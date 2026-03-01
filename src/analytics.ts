/**
 * Core Analytics Engine
 * Local-first analytics — all data stays on device
 * No external requests, no tracking servers, no privacy concerns
 */

export interface AnalyticsConfig {
    /** Storage key prefix (default: '__ext_analytics__') */
    prefix?: string;
    /** Storage area to use (default: 'local') */
    storageArea?: 'local' | 'sync';
    /** Maximum events to retain (default: 10000) */
    maxEvents?: number;
    /** Auto-track page views in options/popup pages (default: true) */
    autoTrackPageViews?: boolean;
}

export interface AnalyticsSnapshot {
    totalEvents: number;
    uniqueSessions: number;
    eventBreakdown: Record<string, number>;
    firstEventAt: number | null;
    lastEventAt: number | null;
}

const DEFAULT_CONFIG: Required<AnalyticsConfig> = {
    prefix: '__ext_analytics__',
    storageArea: 'local',
    maxEvents: 10000,
    autoTrackPageViews: true,
};

export class Analytics {
    private config: Required<AnalyticsConfig>;
    private sessionId: string;

    constructor(config: AnalyticsConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.sessionId = this.generateSessionId();

        if (this.config.autoTrackPageViews && typeof document !== 'undefined') {
            this.trackPageView();
        }
    }

    /** Track a custom event */
    async track(eventName: string, properties?: Record<string, unknown>): Promise<void> {
        const event = {
            event: eventName,
            properties: properties || {},
            timestamp: Date.now(),
            sessionId: this.sessionId,
        };

        const key = `${this.config.prefix}events`;
        const storage = chrome.storage[this.config.storageArea];
        const result = await storage.get(key);
        const events = (result[key] as Array<typeof event>) || [];

        events.push(event);

        // Trim if over max
        if (events.length > this.config.maxEvents) {
            events.splice(0, events.length - this.config.maxEvents);
        }

        await storage.set({ [key]: events });
    }

    /** Track a page view */
    async trackPageView(pageName?: string): Promise<void> {
        await this.track('page_view', {
            page: pageName || (typeof document !== 'undefined' ? document.title : 'unknown'),
            url: typeof location !== 'undefined' ? location.href : '',
        });
    }

    /** Track a feature usage */
    async trackFeature(featureName: string, details?: Record<string, unknown>): Promise<void> {
        await this.track('feature_used', {
            feature: featureName,
            ...details,
        });
    }

    /** Get analytics snapshot */
    async getSnapshot(): Promise<AnalyticsSnapshot> {
        const key = `${this.config.prefix}events`;
        const storage = chrome.storage[this.config.storageArea];
        const result = await storage.get(key);
        const events = (result[key] as Array<{ event: string; timestamp: number; sessionId: string }>) || [];

        const eventBreakdown: Record<string, number> = {};
        const sessions = new Set<string>();

        for (const e of events) {
            eventBreakdown[e.event] = (eventBreakdown[e.event] || 0) + 1;
            sessions.add(e.sessionId);
        }

        return {
            totalEvents: events.length,
            uniqueSessions: sessions.size,
            eventBreakdown,
            firstEventAt: events.length > 0 ? events[0].timestamp : null,
            lastEventAt: events.length > 0 ? events[events.length - 1].timestamp : null,
        };
    }

    /** Clear all analytics data */
    async clear(): Promise<void> {
        const storage = chrome.storage[this.config.storageArea];
        await storage.remove(`${this.config.prefix}events`);
        await storage.remove(`${this.config.prefix}install`);
    }

    /** Export analytics as JSON */
    async export(): Promise<string> {
        const snapshot = await this.getSnapshot();
        const key = `${this.config.prefix}events`;
        const storage = chrome.storage[this.config.storageArea];
        const result = await storage.get(key);

        return JSON.stringify({
            snapshot,
            events: result[key] || [],
            exportedAt: new Date().toISOString(),
        }, null, 2);
    }

    private generateSessionId(): string {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    private trackPageView(): void {
        // Fire and forget — no need to await in constructor
        this.trackPageView().catch(() => { /* ignore */ });
    }
}
