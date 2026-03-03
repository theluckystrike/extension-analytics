// Setup file for vitest to mock chrome APIs
import { vi } from 'vitest';

// Mock chrome.storage
const mockStorage = {
    get: vi.fn(() => Promise.resolve({})),
    set: vi.fn(() => Promise.resolve()),
    remove: vi.fn(() => Promise.resolve()),
    clear: vi.fn(() => Promise.resolve()),
    getBytesInUse: vi.fn(() => Promise.resolve(0)),
};

const mockChrome = {
    storage: {
        local: mockStorage,
        sync: mockStorage,
        session: mockStorage,
    },
    runtime: {
        id: 'test-extension-id',
        getURL: vi.fn((path: string) => `chrome-extension://test-extension-id/${path}`),
        sendMessage: vi.fn(),
        onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
        },
    },
};

// @ts-ignore - global chrome
globalThis.chrome = mockChrome;
