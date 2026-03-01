/**
 * Event Tracker
 * Track and query extension events with retention controls
 */

export interface TrackedEvent {
    event: string;
    properties: Record<string, unknown>;
    timestamp: number;
    sessionId: string;
}

export class EventTracker {
    private prefix: string;
    private storageArea: 'local' | 'sync';

    constructor(prefix: string = '__ext_analytics__', storageArea: 'local' | 'sync' = 'local') {
        this.prefix = prefix;
        this.storageArea = storageArea;
    }

    /** Get all events */
    async getAll(): Promise<TrackedEvent[]> {
        const key = `${this.prefix}events`;
        const result = await chrome.storage[this.storageArea].get(key);
        return (result[key] as TrackedEvent[]) || [];
    }

    /** Get events filtered by name */
    async getByName(eventName: string): Promise<TrackedEvent[]> {
        const events = await this.getAll();
        return events.filter((e) => e.event === eventName);
    }

    /** Get events within a time range */
    async getByTimeRange(startMs: number, endMs: number): Promise<TrackedEvent[]> {
        const events = await this.getAll();
        return events.filter((e) => e.timestamp >= startMs && e.timestamp <= endMs);
    }

    /** Get events from the last N days */
    async getLastDays(days: number): Promise<TrackedEvent[]> {
        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const events = await this.getAll();
        return events.filter((e) => e.timestamp >= cutoff);
    }

    /** Count events by name */
    async countByName(): Promise<Record<string, number>> {
        const events = await this.getAll();
        const counts: Record<string, number> = {};
        events.forEach((e) => {
            counts[e.event] = (counts[e.event] || 0) + 1;
        });
        return counts;
    }

    /** Get daily event counts for the last N days */
    async getDailyCounts(days: number = 30): Promise<Array<{ date: string; count: number }>> {
        const events = await this.getLastDays(days);
        const daily = new Map<string, number>();

        events.forEach((e) => {
            const date = new Date(e.timestamp).toISOString().split('T')[0];
            daily.set(date, (daily.get(date) || 0) + 1);
        });

        return Array.from(daily.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    /** Purge events older than N days */
    async purge(olderThanDays: number): Promise<number> {
        const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
        const events = await this.getAll();
        const remaining = events.filter((e) => e.timestamp >= cutoff);
        const purged = events.length - remaining.length;

        const key = `${this.prefix}events`;
        await chrome.storage[this.storageArea].set({ [key]: remaining });
        return purged;
    }
}
