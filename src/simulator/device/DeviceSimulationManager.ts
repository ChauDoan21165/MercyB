// Device Simulation Manager - Central orchestrator for device + network + a11y simulations

import type { DevicePresetId } from './DevicePresets';
import { applyDevicePreset, resetBrowserEnv } from './BrowserEnvSimulator';
import { setNetworkProfile, resetNetworkProfile } from './NetworkConditionsSimulator';
import {
  enableScreenReaderMode,
  enableLargeTextMode,
  enableHighContrastMode,
  enableKeyboardNavigationMode,
  enableReducedMotionMode,
  resetAccessibilityModes,
} from './AccessibilityEnvSimulator';

export interface DeviceSimulationOptions {
  networkProfile?: 'offline' | 'slow_3g' | 'fast_3g' | '4g' | 'wifi';
  a11y?: Array<'screen-reader' | 'large-text' | 'high-contrast' | 'keyboard-nav' | 'reduced-motion'>;
  logResults?: boolean;
}

export async function runOnDevice<T>(
  deviceId: DevicePresetId,
  options: DeviceSimulationOptions = {},
  scenario: () => Promise<T>
): Promise<T> {
  console.log(`[DeviceSimulationManager] Starting simulation on device: ${deviceId}`);

  try {
    // Apply device preset
    applyDevicePreset(deviceId);

    // Apply network profile
    if (options.networkProfile) {
      setNetworkProfile(options.networkProfile);
    }

    // Apply accessibility modes
    if (options.a11y) {
      options.a11y.forEach(mode => {
        switch (mode) {
          case 'screen-reader':
            enableScreenReaderMode();
            break;
          case 'large-text':
            enableLargeTextMode();
            break;
          case 'high-contrast':
            enableHighContrastMode();
            break;
          case 'keyboard-nav':
            enableKeyboardNavigationMode();
            break;
          case 'reduced-motion':
            enableReducedMotionMode();
            break;
        }
      });
    }

    // Run scenario
    const startTime = Date.now();
    const result = await scenario();
    const duration = Date.now() - startTime;

    if (options.logResults) {
      console.log(`[DeviceSimulationManager] Scenario completed in ${duration}ms`);
    }

    return result;
  } catch (error: any) {
    console.error(`[DeviceSimulationManager] Scenario failed:`, error);
    throw error;
  } finally {
    // Reset all conditions
    resetBrowserEnv();
    resetNetworkProfile();
    resetAccessibilityModes();

    console.log(`[DeviceSimulationManager] Simulation complete, environment reset`);
  }
}

export async function runOnMultipleDevices<T>(
  deviceIds: DevicePresetId[],
  options: DeviceSimulationOptions = {},
  scenario: () => Promise<T>
): Promise<Map<DevicePresetId, { result?: T; error?: Error; duration: number }>> {
  const results = new Map<DevicePresetId, { result?: T; error?: Error; duration: number }>();

  for (const deviceId of deviceIds) {
    const startTime = Date.now();
    try {
      const result = await runOnDevice(deviceId, options, scenario);
      const duration = Date.now() - startTime;
      results.set(deviceId, { result, duration });
    } catch (error: any) {
      const duration = Date.now() - startTime;
      results.set(deviceId, { error, duration });
    }
  }

  return results;
}
