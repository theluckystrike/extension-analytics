/**
 * Dashboard Data
 * Generate dashboard-ready analytics data for options page display
 */

export interface DashboardData {
    summary: {
        totalEvents: number;
        uniqueSessions: number;
        daysSinceInstall: number;
        currentVersion: string;
    };
    topFeatures: Array<{ name: string; count: number }>;
    dailyActivity: Array<{ date: string; count: number }>;
    recentEvents: Array<{ event: string; timestamp: number; properties: Record<string, unknown> }>;
}

export class Dashboard {
    private prefix: string;
    private storageArea: 'local' | 'sync';

    constructor(prefix: string = '__ext_analytics__', storageArea: 'local' | 'sync' = 'local') {
        this.prefix = prefix;
        this.storageArea = storageArea;
    }

    /** Generate dashboard-ready data */
    async getData(recentLimit: number = 50): Promise<DashboardData> {
        const storage = chrome.storage[this.storageArea];
        const eventsKey = `${this.prefix}events`;
        const installKey = `${this.prefix}install`;

        const [eventsResult, installResult] = await Promise.all([
            storage.get(eventsKey),
            storage.get(installKey),
        ]);

        const events = (eventsResult[eventsKey] as Array<{
            event: string; timestamp: number; sessionId: string; properties: Record<string, unknown>;
        }>) || [];
        const installHistory = (installResult[installKey] as Array<{ event: string; timestamp: number }>) || [];

        // Summary
        const sessions = new Set(events.map((e) => e.sessionId));
        const install = installHistory.find((h) => h.event === 'install');
        const daysSinceInstall = install
            ? Math.floor((Date.now() - install.timestamp) / (1000 * 60 * 60 * 24))
            : 0;

        // Top features
        const featureCounts = new Map<string, number>();
        events
            .filter((e) => e.event === 'feature_used')
            .forEach((e) => {
                const name = (e.properties?.feature as string) || 'unknown';
                featureCounts.set(name, (featureCounts.get(name) || 0) + 1);
            });

        const topFeatures = Array.from(featureCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Daily activity (last 30 days)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const dailyMap = new Map<string, number>();
        events
            .filter((e) => e.timestamp >= thirtyDaysAgo)
            .forEach((e) => {
                const date = new Date(e.timestamp).toISOString().split('T')[0];
                dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
            });

        const dailyActivity = Array.from(dailyMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Recent events
        const recentEvents = events
            .slice(-recentLimit)
            .reverse()
            .map((e) => ({ event: e.event, timestamp: e.timestamp, properties: e.properties }));

        return {
            summary: {
                totalEvents: events.length,
                uniqueSessions: sessions.size,
                daysSinceInstall,
                currentVersion: typeof chrome !== 'undefined' ? chrome.runtime.getManifest().version : '0.0.0',
            },
            topFeatures,
            dailyActivity,
            recentEvents,
        };
    }
}
