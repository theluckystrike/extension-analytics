# extension-analytics

Privacy-first analytics for Chrome extensions. Track usage metrics locally without sending data to third parties.

Part of the Zovo family of privacy-first Chrome extensions and developer tools.

## Overview

extension-analytics is a privacy-first analytics library designed specifically for Chrome extensions. Unlike traditional analytics solutions that send data to external servers, this library stores all metrics locally on the users device using chrome.storage, giving them complete control over their data.

## Features

Privacy-First - All data stays on the users device
Zero External Dependencies - No data sent to third parties
Local Storage - Uses chrome.storage for persistent metrics
TypeScript Support - Fully typed for better developer experience
MV3 Compatible - Works with Manifest V3 extensions
GDPR Compliant - No consent banner needed
Lightweight - Minimal impact on extension bundle size

## Installation

From npm:

```bash
npm install extension-analytics
```

From Source:

```bash
git clone https://github.com/theluckystrike/extension-analytics.git
cd extension-analytics
npm install
```

## Usage

### Basic Setup

```typescript
import { ExtensionAnalytics } from 'extension-analytics';

// Initialize analytics with your extension ID
const analytics = new ExtensionAnalytics('your-extension-id');
```

### Configuration

```typescript
const analytics = new ExtensionAnalytics('your-extension-id', {
  endpoint: 'https://your-analytics-endpoint.com', // optional custom endpoint
  anonymizeIP: true,  // default: true
  respectDNT: true   // default: true - respect Do Not Track browser setting
});
```

### Track Custom Events

```typescript
// Track a custom event with category and action
await analytics.trackEvent({
  category: 'user_action',
  action: 'button_click',
  label: 'submit-form',  // optional
  value: 1               // optional
});
```

### Track Page Views

```typescript
// Track when users view different pages in your extension
await analytics.trackPageView('/options');
await analytics.trackPageView('/popup');
```

### Track Extension Lifecycle

```typescript
// Track when users install your extension
await analytics.trackExtensionInstall();

// Track when users update your extension
await analytics.trackExtensionUpdate('1.0.0');
```

### Get Analytics Stats

```typescript
// Retrieve stored analytics data
const stats = await analytics.getStats();
console.log(stats.totalEvents);       // Total number of tracked events
console.log(stats.categories);        // Event counts by category

// Example output:
// {
//   totalEvents: 42,
//   categories: {
//     page_view: 20,
//     user_action: 15,
//     lifecycle: 7
//   }
// }
```

## API Reference

### ExtensionAnalytics Class

#### constructor(extensionId: string, config?: AnalyticsConfig)

Creates a new analytics instance.

#### trackEvent(event: EventData): Promise<void>

Tracks a custom analytics event.

#### trackPageView(path: string): Promise<void>

Tracks a page view.

#### trackExtensionInstall(): Promise<void>

Tracks an extension installation event.

#### trackExtensionUpdate(previousVersion: string): Promise<void>

Tracks an extension update event.

#### getStats(): Promise<{ totalEvents: number; categories: Record<string, number> }>

Retrieves stored analytics statistics.

### Interfaces

#### EventData

```typescript
interface EventData {
  category: string;   // Event category (e.g., 'user_action', 'page_view')
  action: string;    // Event action (e.g., 'button_click', '/options')
  label?: string;    // Optional event label
  value?: number;    // Optional numeric value
}
```

#### AnalyticsConfig

```typescript
interface AnalyticsConfig {
  endpoint?: string;       // Optional analytics endpoint URL
  anonymizeIP?: boolean;   // Anonymize IP addresses (default: true)
  respectDNT?: boolean;    // Respect Do Not Track (default: true)
}
```

## Privacy

This library is designed with privacy as the top priority:

No External Servers - All data is stored locally using chrome.storage
No User Tracking - No unique identifiers or fingerprinting
No Cookies - Does not use any cookie-based tracking
GDPR Compliant - No need for consent banners
User Control - Users can view and delete their data through Chrome storage

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: git checkout -b feature/your-feature
3. Make your changes
4. Test your changes: npm test
5. Commit your changes: git commit -m 'Add new feature'
6. Push to the branch: git push origin feature/your-feature
7. Submit a Pull Request

## Development Setup

```bash
git clone https://github.com/theluckystrike/extension-analytics.git
cd extension-analytics
npm install
npm test
npm run build
```

## Related Packages

extension-analytics-dashboard - Visual dashboard for analytics
extension-analytics-export - Export analytics to file

## About

extension-analytics is maintained by theluckystrike and is part of the Zovo developer tools family at zovo.one.

## License

MIT License

Copyright (c) 2025 theluckystrike

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
