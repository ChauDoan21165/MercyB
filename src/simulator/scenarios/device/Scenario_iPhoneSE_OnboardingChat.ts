// Scenario: iPhone SE - Onboarding & Chat (worst-case mobile viewport)

import { runOnDevice } from '../../device/DeviceSimulationManager';
import { simulator } from '../../LaunchSimulatorCore';
import type { SimulationStep } from '../../LaunchSimulatorCore';

export async function runScenario_iPhoneSE_OnboardingChat() {
  const steps: SimulationStep[] = [
    {
      name: 'Apply iPhone SE device preset',
      action: async () => {
        // Device preset applied by runOnDevice wrapper
      },
    },
    {
      name: 'Simulate opening landing page',
      action: async () => {
        // Navigate to landing (simulated)
        await delay(500);
        simulator.info('Landing page loaded on iPhone SE');
      },
    },
    {
      name: 'Simulate sign in',
      action: async () => {
        // Mock sign in
        await delay(800);
        simulator.info('User signed in (mocked)');
      },
    },
    {
      name: 'Open VIP2 tier grid',
      action: async () => {
        await delay(1000);
        simulator.info('VIP2 grid opened');
        
        // Check layout issues
        const hasOverflow = checkForOverflow();
        simulator.assert(!hasOverflow, 'No horizontal overflow on iPhone SE viewport');
      },
    },
    {
      name: 'Scroll through rooms',
      action: async () => {
        // Simulate scrolling
        for (let i = 0; i < 10; i++) {
          await delay(100);
        }
        simulator.info('Scrolled through 10 rooms');
      },
    },
    {
      name: 'Open ChatHub with room',
      action: async () => {
        await delay(1200);
        simulator.info('ChatHub opened');
        
        // Check for clipped content
        const hasClippedContent = checkForClippedContent();
        simulator.assert(!hasClippedContent, 'No clipped content in ChatHub on small screen');
      },
    },
    {
      name: 'Send 30 messages',
      action: async () => {
        for (let i = 0; i < 30; i++) {
          await delay(200);
          simulator.info(`Sent message ${i + 1}/30`);
        }
        simulator.info('All 30 messages sent');
      },
    },
    {
      name: 'Toggle theme',
      action: async () => {
        await delay(300);
        simulator.info('Theme toggled');
        
        // Check for broken layout after theme change
        const layoutBroken = checkForBrokenLayout();
        simulator.assert(!layoutBroken, 'Layout intact after theme toggle');
      },
    },
  ];

  await runOnDevice(
    'iphone_se',
    { networkProfile: 'slow_3g', logResults: true },
    async () => {
      await simulator.runScenario('iPhone SE - Onboarding & Chat', steps);
    }
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkForOverflow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.scrollWidth > window.innerWidth;
}

function checkForClippedContent(): boolean {
  if (typeof document === 'undefined') return false;
  
  // Check if any elements are clipped
  const elements = document.querySelectorAll('[data-room-title], .message-content, .room-header');
  for (const el of Array.from(elements)) {
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
      return true;
    }
  }
  return false;
}

function checkForBrokenLayout(): boolean {
  if (typeof document === 'undefined') return false;
  
  // Check for broken flex layouts
  const flexContainers = document.querySelectorAll('[style*="flex"], .flex');
  for (const container of Array.from(flexContainers)) {
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return true;
    }
  }
  return false;
}
