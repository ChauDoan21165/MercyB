// Simulator Environment - Helpers to simulate various conditions

export interface EnvironmentState {
  networkLatency: number;
  isOffline: boolean;
  viewport: { width: number; height: number };
  isColdStart: boolean;
  localStorageBroken: boolean;
}

class SimulatorEnvironment {
  private originalFetch: typeof fetch;
  private originalLocalStorage: Storage;
  private state: EnvironmentState = {
    networkLatency: 0,
    isOffline: false,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    isColdStart: false,
    localStorageBroken: false,
  };

  constructor() {
    this.originalFetch = window.fetch;
    this.originalLocalStorage = window.localStorage;
  }

  simulateSlowNetwork(latencyMs: number): void {
    this.state.networkLatency = latencyMs;

    // Mock fetch with delay
    window.fetch = async (...args) => {
      await this.delay(latencyMs);
      return this.originalFetch(...args);
    };
  }

  simulateOffline(): void {
    this.state.isOffline = true;

    // Mock fetch to fail
    window.fetch = async () => {
      throw new Error('Network request failed (offline simulation)');
    };
  }

  restoreNetwork(): void {
    window.fetch = this.originalFetch;
    this.state.networkLatency = 0;
    this.state.isOffline = false;
  }

  simulateMobileViewport(): void {
    const width = 375;
    const height = 667;
    
    this.state.viewport = { width, height };

    // Set viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', `width=${width}, height=${height}, initial-scale=1.0`);

    // Resize window (if allowed by browser)
    try {
      window.resizeTo(width, height);
    } catch (e) {
      console.warn('Cannot resize window in this environment');
    }
  }

  simulateColdStart(): void {
    this.state.isColdStart = true;

    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }

    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();
  }

  breakLocalStorage(): void {
    this.state.localStorageBroken = true;

    // Mock localStorage to throw errors
    const brokenStorage = {
      getItem: () => { throw new Error('localStorage is broken (simulation)'); },
      setItem: () => { throw new Error('localStorage is broken (simulation)'); },
      removeItem: () => { throw new Error('localStorage is broken (simulation)'); },
      clear: () => { throw new Error('localStorage is broken (simulation)'); },
      key: () => { throw new Error('localStorage is broken (simulation)'); },
      length: 0,
    };

    Object.defineProperty(window, 'localStorage', {
      value: brokenStorage,
      writable: true,
    });
  }

  restoreLocalStorage(): void {
    this.state.localStorageBroken = false;

    Object.defineProperty(window, 'localStorage', {
      value: this.originalLocalStorage,
      writable: true,
    });
  }

  restoreAll(): void {
    this.restoreNetwork();
    this.restoreLocalStorage();
    this.state = {
      networkLatency: 0,
      isOffline: false,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      isColdStart: false,
      localStorageBroken: false,
    };
  }

  getState(): EnvironmentState {
    return { ...this.state };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const environment = new SimulatorEnvironment();
