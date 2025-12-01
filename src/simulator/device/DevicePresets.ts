// Device Presets - Standard device configurations for simulations

export interface DevicePreset {
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  touch: boolean;
  cpuSlowdownMultiplier?: number;
  network?: '3g' | '4g' | 'wifi' | 'slow_3g' | 'fast_3g';
  description?: string;
}

export const DEVICE_PRESETS = {
  iphone_se: {
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    touch: true,
    description: 'iPhone SE - smallest modern iPhone, worst-case mobile viewport',
  },
  iphone_13: {
    width: 390,
    height: 844,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    touch: true,
    description: 'iPhone 13 - standard modern iPhone',
  },
  ipad: {
    width: 768,
    height: 1024,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    touch: true,
    description: 'iPad - tablet viewport',
  },
  android_small: {
    width: 360,
    height: 640,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
    touch: true,
    network: 'slow_3g',
    description: 'Small Android phone - low-end device',
  },
  android_large: {
    width: 412,
    height: 915,
    pixelRatio: 2.625,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Mobile Safari/537.36',
    touch: true,
    network: '4g',
    description: 'Large Android phone - modern flagship',
  },
  low_end_laptop: {
    width: 1366,
    height: 768,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    touch: false,
    cpuSlowdownMultiplier: 3,
    network: 'slow_3g',
    description: 'Old laptop - slow CPU, small screen, poor network',
  },
  old_desktop: {
    width: 1280,
    height: 1024,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    touch: false,
    cpuSlowdownMultiplier: 2,
    network: 'fast_3g',
    description: 'Old desktop - legacy system',
  },
  modern_desktop: {
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    touch: false,
    network: 'wifi',
    description: 'Modern desktop - high-res, fast',
  },
} as const;

export type DevicePresetId = keyof typeof DEVICE_PRESETS;

export function getDevicePreset(id: DevicePresetId): DevicePreset {
  return DEVICE_PRESETS[id];
}

export function getAllDevicePresets(): Record<DevicePresetId, DevicePreset> {
  return DEVICE_PRESETS;
}

export function getDevicePresetIds(): DevicePresetId[] {
  return Object.keys(DEVICE_PRESETS) as DevicePresetId[];
}
