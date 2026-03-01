# extension-analytics — Privacy-First Analytics for Chrome Extensions

[![npm version](https://img.shields.io/npm/v/extension-analytics.svg)](https://www.npmjs.com/package/extension-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)** — the privacy-first alternative to paid extension analytics

**Local-first analytics for Chrome extensions.** No external servers, no data collection, no privacy concerns. All data stays on the user's device.

## 📦 Install

```bash
npm install extension-analytics
```

## 🚀 Quick Start

```typescript
import { Analytics, InstallTracker } from 'extension-analytics';

// In background service worker
InstallTracker.init();
const analytics = new Analytics();

// Track feature usage
await analytics.trackFeature('dark-mode-toggled');
await analytics.trackFeature('export-csv', { rows: 150 });

// Track custom events
await analytics.track('settings_changed', { theme: 'dark' });

// Get snapshot
const snapshot = await analytics.getSnapshot();
console.log(`Total events: ${snapshot.totalEvents}`);
```

## ✨ Features

### Funnel Tracking
```typescript
import { FunnelTracker } from 'extension-analytics';

const funnel = new FunnelTracker();
const id = await funnel.startFunnel('onboarding', 'welcome_shown');
await funnel.recordStep(id, 'permissions_granted');
await funnel.completeFunnel(id, 'first_use');

const report = await funnel.getReport('onboarding');
console.log(`Conversion: ${report.conversionRate}%`);
```

### Dashboard Data
```typescript
import { Dashboard } from 'extension-analytics';

const dashboard = new Dashboard();
const data = await dashboard.getData();
// { summary, topFeatures, dailyActivity, recentEvents }
```

### Install Tracking
```typescript
import { InstallTracker } from 'extension-analytics';

const days = await InstallTracker.getDaysSinceInstall();
const history = await InstallTracker.getHistory();
```

## 🔗 Related Projects

- [chrome-extension-starter-mv3](https://github.com/theluckystrike/chrome-extension-starter-mv3)
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus)
- [content-script-toolkit](https://github.com/theluckystrike/content-script-toolkit)

## 📄 License

MIT — [Zovo](https://zovo.one)
