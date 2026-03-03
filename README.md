# extension-analytics

[![npm version](https://img.shields.io/npm/v/extension-analytics)](https://npmjs.com/package/extension-analytics)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![CI Status](https://github.com/theluckystrike/extension-analytics/actions/workflows/ci.yml/badge.svg)](https://github.com/theluckystrike/extension-analytics/actions)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/extension-analytics?style=social)](https://github.com/theluckystrike/extension-analytics)

> Privacy-first analytics for Chrome extensions — track usage metrics locally without sending data to third parties.

Part of the [Zovo](https://zovo.one) family of privacy-first Chrome extensions and developer tools.

## Overview

`extension-analytics` is a privacy-first analytics library designed specifically for Chrome extensions. Unlike traditional analytics solutions that send data to external servers, this library stores all metrics locally on the user's device, giving them complete control over their data.

## Features

- ✅ **Privacy-First** - All data stays on the user's device
- ✅ **Zero External Dependencies** - No data sent to third parties
- ✅ **Local Storage** - Uses chrome.storage for persistent metrics
- ✅ **TypeScript Support** - Fully typed for better developer experience
- ✅ **MV3 Compatible** - Works with Manifest V3 extensions
- ✅ **GDPR Compliant** - No consent banner needed
- ✅ **Lightweight** - Minimal impact on extension bundle size

## Installation

### From npm

```bash
npm install extension-analytics
```

### From Source

```bash
# Clone the repository
git clone https://github.com/theluckystrike/extension-analytics.git
cd extension-analytics

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Basic Setup

```typescript
import { Analytics } from 'extension-analytics';

// Initialize analytics
const analytics = new Analytics({
  extensionId: 'your-extension-id',
  storageKey: 'analytics'
});

// Track an event
await analytics.track('button_click', {
  buttonId: 'submit-form',
  page: 'options'
});
```

### Track Page Views

```typescript
// Track a page view
await analytics.trackPageView('/options', 'Options Page');
```

### Track Errors

```typescript
// Track an error
await analytics.trackError('api_failure', {
  endpoint: '/api/data',
  statusCode: 500
});
```

### Get Analytics Data

```typescript
// Get all events
const events = await analytics.getEvents();

// Get events for a specific time range
const recentEvents = await analytics.getEvents({
  since: Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
});

// Get event counts
const counts = await analytics.getEventCounts();
```

### Export Data

```typescript
// Export analytics as JSON
const export = await analytics.export();

// Clear all analytics data
await analytics.clear();
```

## API Reference

### Analytics Class

| Method | Description |
|--------|-------------|
| `track(event, data)` | Track a custom event |
| `trackPageView(path, title)` | Track a page view |
| `trackError(type, data)` | Track an error |
| `getEvents(options)` | Get tracked events |
| `getEventCounts()` | Get event counts by type |
| `export()` | Export all data as JSON |
| `clear()` | Clear all analytics data |

### Options

| Option | Type | Description |
|--------|------|-------------|
| `extensionId` | string | Your extension ID |
| `storageKey` | string | Storage key (default: 'analytics') |
| `maxEvents` | number | Max events to store (default: 1000) |

## Privacy

This library is designed with privacy as the top priority:

- **No External Servers** - All data is stored locally using chrome.storage
- **No User Tracking** - No unique identifiers or fingerprinting
- **No Cookies** - Doesn't use any cookie-based tracking
- **GDPR Compliant** - No need for consent banners
- **User Control** - Users can view and delete their data

## Related Packages

This package is part of the Zovo extension analytics ecosystem:

- [extension-analytics-dashboard](https://github.com/theluckystrike/extension-analytics-dashboard) - Visual dashboard for analytics
- [extension-analytics-export](https://github.com/theluckystrike/extension-analytics-export) - Export analytics to file

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/analytics-improvement`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** your changes: `git commit -m 'Add new feature'`
6. **Push** to the branch: `git push origin feature/analytics-improvement`
7. **Submit** a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/theluckystrike/extension-analytics.git
cd extension-analytics

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Built by Zovo

Part of the [Zovo](https://zovo.one) developer tools family — privacy-first Chrome extensions built by developers, for developers.

## See Also

### Related Zovo Repositories

- [zovo-extension-template](https://github.com/theluckystrike/zovo-extension-template) - Boilerplate for building privacy-first Chrome extensions
- [zovo-types-webext](https://github.com/theluckystrike/zovo-types-webext) - Comprehensive TypeScript type definitions for browser extensions
- [zovo-permissions-scanner](https://github.com/theluckystrike/zovo-permissions-scanner) - Privacy scanner for Chrome extensions
- [chrome-storage-plus](https://github.com/theluckystrike/chrome-storage-plus) - Type-safe storage wrapper

### Zovo Chrome Extensions

- [Zovo Tab Manager](https://chrome.google.com/webstore/detail/zovo-tab-manager) - Manage tabs efficiently
- [Zovo Focus](https://chrome.google.com/webstore/detail/zovo-focus) - Block distractions
- [Zovo Permissions Scanner](https://chrome.google.com/webstore/detail/zovo-permissions-scanner) - Check extension privacy grades

Visit [zovo.one](https://zovo.one) for more information.

## License

MIT - [Zovo](https://zovo.one)

---

*Built by developers, for developers. No compromises on privacy.*
