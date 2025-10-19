import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Set much higher timeout for all tests
vi.setConfig({
  testTimeout: 30000
})

// Configure default fake timers settings
vi.useFakeTimers()

// Reset modules and clear timers before each test
beforeEach(() => {
  vi.resetModules()
  vi.clearAllTimers()
})

// Cleanup after each test case
afterEach(() => {
  cleanup()
  // Clear localStorage
  if (typeof localStorage !== 'undefined' && localStorage.clear) {
    localStorage.clear()
  }
  // Clean up timers and mocks
  vi.clearAllTimers()
  vi.clearAllMocks()
  vi.resetAllMocks()
  // Use real timers after each test
  vi.useRealTimers()
})

// Mock ResizeObserver
beforeAll(() => {
  // Mock localStorage methods instead of replacing the object
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  // Use Object.defineProperty to mock localStorage methods
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  })

  // Mock HTMLElement.scrollIntoView
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    writable: true,
    value: vi.fn(),
  })

  // Mock HTMLElement.getBoundingClientRect
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    writable: true,
    value: vi.fn(() => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    })),
  })

  // Mock CSS.supports
  Object.defineProperty(CSS, 'supports', {
    writable: true,
    value: vi.fn(() => false),
  })

  // Mock touch events
  class MockTouch {
    constructor(touchInit) {
      this.identifier = touchInit.identifier || 0
      this.target = touchInit.target || null
      this.clientX = touchInit.clientX || 0
      this.clientY = touchInit.clientY || 0
      this.pageX = touchInit.pageX || 0
      this.pageY = touchInit.pageY || 0
      this.screenX = touchInit.screenX || 0
      this.screenY = touchInit.screenY || 0
    }
  }

  class MockTouchEvent extends Event {
    constructor(type, touchEventInit = {}) {
      super(type, touchEventInit)
      this.touches = touchEventInit.touches || []
      this.targetTouches = touchEventInit.targetTouches || []
      this.changedTouches = touchEventInit.changedTouches || []
    }
  }

  global.Touch = MockTouch
  global.TouchEvent = MockTouchEvent

  // Mock getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn(() => Promise.resolve({
        getTracks: () => [],
      })),
    },
  })

  // Mock geolocation
  Object.defineProperty(navigator, 'geolocation', {
    writable: true,
    value: {
      getCurrentPosition: vi.fn((success) => success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      })),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
  })

  // Setup default body styles for testing
  Object.defineProperty(document.body, 'classList', {
    writable: true,
    value: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false),
      toggle: vi.fn(),
    },
  })

  // Mock clipboard API
  const clipboard = {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('test')),
  };

  // Define clipboard once to avoid redefining
  if (!('clipboard' in navigator)) {
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboard,
      writable: true,
      configurable: true,
    });
  }

  // Mock share API
  Object.defineProperty(navigator, 'share', {
    writable: true,
    value: vi.fn(() => Promise.resolve()),
  })

  // Mock File API
  global.File = class File {
    constructor(parts, filename, properties = {}) {
      this.name = filename;
      this.size = parts.reduce((acc, part) => acc + part.length, 0);
      this.type = properties.type || '';
      this.lastModified = properties.lastModified || Date.now();
    }
  };

  global.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onerror = null;
    }

    readAsDataURL(file) {
      setTimeout(() => {
        this.result = `data:${file.type};base64,mock-base64-data`;
        if (this.onload) {
          this.onload({ target: this });
        }
      }, 10);
    }
  };

  // Mock XMLHttpRequest for upload testing
  global.XMLHttpRequest = class XMLHttpRequest {
    constructor() {
      this.upload = {
        onprogress: null,
      };
      this.onload = null;
      this.onerror = null;
      this.status = 200;
      this.responseText = '{"success": true}';
    }

    open() {}
    setRequestHeader() {}
    send() {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 10);
    }
  };
})