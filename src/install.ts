/**
 * Install Tracker
 * Track extension install, update, and uninstall events
 */

const INSTALL_KEY = '__ext_analytics__install';

export class InstallTracker {
    /** Initialize install tracking — call in background service worker */
    static init(): void {
        chrome.runtime.onInstalled.addListener(async (details) => {
            const data = {
                event: details.reason,
                previousVersion: details.previousVersion || null,
                timestamp: Date.now(),
                version: chrome.runtime.getManifest().version,
            };

            const storage = chrome.storage.local;
            const result = await storage.get(INSTALL_KEY);
            const history = (result[INSTALL_KEY] as Array<typeof data>) || [];
            history.push(data);
            await storage.set({ [INSTALL_KEY]: history });
        });
    }

    /** Get install history */
    static async getHistory(): Promise<Array<{
        event: string;
        previousVersion: string | null;
        timestamp: number;
        version: string;
    }>> {
        const result = await chrome.storage.local.get(INSTALL_KEY);
        return (result[INSTALL_KEY] as Array<{
            event: string;
            previousVersion: string | null;
            timestamp: number;
            version: string;
        }>) || [];
    }

    /** Get install date */
    static async getInstallDate(): Promise<Date | null> {
        const history = await this.getHistory();
        const install = history.find((h) => h.event === 'install');
        return install ? new Date(install.timestamp) : null;
    }

    /** Get days since install */
    static async getDaysSinceInstall(): Promise<number> {
        const installDate = await this.getInstallDate();
        if (!installDate) return 0;
        return Math.floor((Date.now() - installDate.getTime()) / (1000 * 60 * 60 * 24));
    }
}
