/**
 * extension-analytics - Privacy-first analytics for Chrome extensions
 */

export interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export interface AnalyticsConfig {
  endpoint?: string;
  anonymizeIP?: boolean;
  respectDNT?: boolean;
}

export class ExtensionAnalytics {
  private extensionId: string;
  private config: AnalyticsConfig;

  constructor(extensionId: string, config: AnalyticsConfig = {}) {
    this.extensionId = extensionId;
    this.config = {
      anonymizeIP: true,
      respectDNT: true,
      ...config
    };
  }

  private shouldTrack(): boolean {
    if (this.config.respectDNT && navigator.doNotTrack === '1') {
      return false;
    }
    return true;
  }

  async trackEvent(event: EventData): Promise<void> {
    if (!this.shouldTrack()) return;

    const payload = {
      extensionId: this.extensionId,
      timestamp: Date.now(),
      event: {
        ...event,
        url: window.location.href
      },
      anonymize: this.config.anonymizeIP
    };

    // Store locally for demo - in production, send to analytics endpoint
    const events = await this.getStoredEvents();
    events.push(payload);
    chrome.storage.local.set({ _analytics_events: events.slice(-100) });
  }

  private async getStoredEvents(): Promise<any[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get('_analytics_events', (result) => {
        resolve(result._analytics_events || []);
      });
    });
  }

  async trackPageView(path: string): Promise<void> {
    await this.trackEvent({
      category: 'page_view',
      action: path
    });
  }

  async trackExtensionInstall(): Promise<void> {
    await this.trackEvent({
      category: 'lifecycle',
      action: 'install'
    });
  }

  async trackExtensionUpdate(previousVersion: string): Promise<void> {
    await this.trackEvent({
      category: 'lifecycle',
      action: 'update',
      label: previousVersion
    });
  }

  async getStats(): Promise<{ totalEvents: number; categories: Record<string, number> }> {
    const events = await this.getStoredEvents();
    const categories: Record<string, number> = {};
    
    events.forEach((e: any) => {
      categories[e.event.category] = (categories[e.event.category] || 0) + 1;
    });

    return { totalEvents: events.length, categories };
  }
}

export default ExtensionAnalytics;
