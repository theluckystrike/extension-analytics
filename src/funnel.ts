/**
 * Funnel Tracker
 * Track user progression through multi-step flows
 */

export interface FunnelStep {
    name: string;
    timestamp: number;
}

export interface Funnel {
    id: string;
    name: string;
    steps: FunnelStep[];
    completed: boolean;
    startedAt: number;
    completedAt?: number;
}

export interface FunnelReport {
    funnelName: string;
    totalStarted: number;
    totalCompleted: number;
    conversionRate: number;
    stepBreakdown: Array<{ step: string; reached: number; dropoff: number }>;
}

export class FunnelTracker {
    private prefix: string;
    private storageArea: 'local' | 'sync';

    constructor(prefix: string = '__ext_analytics__', storageArea: 'local' | 'sync' = 'local') {
        this.prefix = prefix;
        this.storageArea = storageArea;
    }

    /** Start a new funnel */
    async startFunnel(name: string, firstStep: string): Promise<string> {
        const funnel: Funnel = {
            id: `funnel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name,
            steps: [{ name: firstStep, timestamp: Date.now() }],
            completed: false,
            startedAt: Date.now(),
        };

        const funnels = await this.getAllFunnels();
        funnels.push(funnel);
        await this.saveFunnels(funnels);
        return funnel.id;
    }

    /** Record a funnel step progression */
    async recordStep(funnelId: string, stepName: string): Promise<void> {
        const funnels = await this.getAllFunnels();
        const funnel = funnels.find((f) => f.id === funnelId);
        if (!funnel) return;

        funnel.steps.push({ name: stepName, timestamp: Date.now() });
        await this.saveFunnels(funnels);
    }

    /** Mark a funnel as completed */
    async completeFunnel(funnelId: string, finalStep?: string): Promise<void> {
        const funnels = await this.getAllFunnels();
        const funnel = funnels.find((f) => f.id === funnelId);
        if (!funnel) return;

        if (finalStep) {
            funnel.steps.push({ name: finalStep, timestamp: Date.now() });
        }
        funnel.completed = true;
        funnel.completedAt = Date.now();
        await this.saveFunnels(funnels);
    }

    /** Generate a funnel conversion report */
    async getReport(funnelName: string): Promise<FunnelReport> {
        const funnels = await this.getAllFunnels();
        const matching = funnels.filter((f) => f.name === funnelName);

        const totalStarted = matching.length;
        const totalCompleted = matching.filter((f) => f.completed).length;

        // Step breakdown
        const allStepNames = new Set<string>();
        matching.forEach((f) => f.steps.forEach((s) => allStepNames.add(s.name)));

        const stepBreakdown = Array.from(allStepNames).map((step) => {
            const reached = matching.filter((f) => f.steps.some((s) => s.name === step)).length;
            return { step, reached, dropoff: totalStarted - reached };
        });

        return {
            funnelName,
            totalStarted,
            totalCompleted,
            conversionRate: totalStarted > 0 ? Math.round((totalCompleted / totalStarted) * 100) : 0,
            stepBreakdown,
        };
    }

    private async getAllFunnels(): Promise<Funnel[]> {
        const key = `${this.prefix}funnels`;
        const result = await chrome.storage[this.storageArea].get(key);
        return (result[key] as Funnel[]) || [];
    }

    private async saveFunnels(funnels: Funnel[]): Promise<void> {
        const key = `${this.prefix}funnels`;
        await chrome.storage[this.storageArea].set({ [key]: funnels });
    }
}
