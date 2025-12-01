// Network Conditions Simulator - Simulate network profiles for testing

type NetworkProfile = 'offline' | 'slow_3g' | 'fast_3g' | '4g' | 'wifi';

interface NetworkConfig {
  latency: number; // ms
  downloadSpeed: number; // kbps
  uploadSpeed: number; // kbps
  packetLoss: number; // 0-1
}

const NETWORK_PROFILES: Record<NetworkProfile, NetworkConfig> = {
  offline: {
    latency: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    packetLoss: 1,
  },
  slow_3g: {
    latency: 400,
    downloadSpeed: 400,
    uploadSpeed: 200,
    packetLoss: 0.05,
  },
  fast_3g: {
    latency: 200,
    downloadSpeed: 1600,
    uploadSpeed: 768,
    packetLoss: 0.02,
  },
  '4g': {
    latency: 50,
    downloadSpeed: 4000,
    uploadSpeed: 3000,
    packetLoss: 0.01,
  },
  wifi: {
    latency: 10,
    downloadSpeed: 10000,
    uploadSpeed: 5000,
    packetLoss: 0,
  },
};

let currentProfile: NetworkProfile | null = null;
let originalFetch: typeof fetch | null = null;

export function setNetworkProfile(profileId: NetworkProfile): void {
  if (typeof window === 'undefined') return;

  currentProfile = profileId;
  const config = NETWORK_PROFILES[profileId];

  // Store original fetch if not already stored
  if (!originalFetch) {
    originalFetch = window.fetch;
  }

  // Mock fetch with network conditions
  window.fetch = async (...args) => {
    const [resource, init] = args;

    // Offline: reject immediately
    if (profileId === 'offline') {
      throw new Error('Network request failed (offline simulation)');
    }

    // Packet loss: randomly fail
    if (Math.random() < config.packetLoss) {
      throw new Error('Network request failed (packet loss simulation)');
    }

    // Add latency
    await delay(config.latency);

    // Call original fetch
    if (!originalFetch) throw new Error('Original fetch not available');
    return originalFetch(resource, init);
  };

  console.log(`[NetworkConditionsSimulator] Applied network profile: ${profileId}`, config);
}

export async function withNetworkProfile<T>(
  profileId: NetworkProfile,
  fn: () => Promise<T>
): Promise<T> {
  const previousProfile = currentProfile;
  
  setNetworkProfile(profileId);
  
  try {
    return await fn();
  } finally {
    if (previousProfile) {
      setNetworkProfile(previousProfile);
    } else {
      resetNetworkProfile();
    }
  }
}

export function resetNetworkProfile(): void {
  if (typeof window === 'undefined') return;

  // Restore original fetch
  if (originalFetch) {
    window.fetch = originalFetch;
    originalFetch = null;
  }

  currentProfile = null;

  console.log('[NetworkConditionsSimulator] Reset network profile');
}

export function getCurrentNetworkProfile(): NetworkProfile | null {
  return currentProfile;
}

export function getNetworkConfig(profileId: NetworkProfile): NetworkConfig {
  return NETWORK_PROFILES[profileId];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock fetch helper for tests
export function mockFetch(
  profileId: NetworkProfile,
  originalFetchFn: typeof fetch
): typeof fetch {
  const config = NETWORK_PROFILES[profileId];

  return async (...args) => {
    if (profileId === 'offline') {
      throw new Error('Network request failed (offline simulation)');
    }

    if (Math.random() < config.packetLoss) {
      throw new Error('Network request failed (packet loss simulation)');
    }

    await delay(config.latency);

    return originalFetchFn(...args);
  };
}
