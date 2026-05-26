/**
 * Mercy Engine Heartbeat Monitor
 * 
 * Monitors engine health and auto-repairs broken state.
 * Checks every 5s: animation, avatar, bubble state.
 */

import type { MercyEngineState } from './engine';

export interface HeartbeatStatus {
  isHealthy: boolean;
  lastCheck: number;
  checks: {
    animationAlive: boolean;
    avatarMounted: boolean;
    bubbleStateValid: boolean;
    memoryAccessible: boolean;
  };
  repairCount: number;
  errors: string[];
}

const HEARTBEAT_INTERVAL_MS = 5000;
const MAX_REPAIR_ATTEMPTS = 3;

class MercyHeartbeat {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private status: HeartbeatStatus = {
    isHealthy: true,
    lastCheck: 0,
    checks: {
      animationAlive: true,
      avatarMounted: true,
      bubbleStateValid: true,
      memoryAccessible: true
    },
    repairCount: 0,
    errors: []
  };
  private repairCallback: (() => void) | null = null;
  private getState: (() => MercyEngineState) | null = null;

  /**
   * Start heartbeat monitoring
   */
  start(
    getState: () => MercyEngineState,
    onRepair: () => void
  ): void {
    this.getState = getState;
    this.repairCallback = onRepair;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.runCheck();
    }, HEARTBEAT_INTERVAL_MS);

    // Initial check
    this.runCheck();
  }

  /**
   * Stop heartbeat monitoring
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Run health check
   */
  private runCheck(): void {
    if (!this.getState) return;

    const state = this.getState();
    const errors: string[] = [];

    // Check animation state
    const animationAlive = this.checkAnimation(state);
    if (!animationAlive) errors.push('Animation state invalid');

    // Check avatar mounted
    const avatarMounted = this.checkAvatar(state);
    if (!avatarMounted) errors.push('Avatar not mounted');

    // Check bubble state consistency
    const bubbleStateValid = this.checkBubbleState(state);
    if (!bubbleStateValid) errors.push('Bubble state inconsistent');

    // Check memory accessibility
    const memoryAccessible = this.checkMemory();
    if (!memoryAccessible) errors.push('Memory inaccessible');

    const isHealthy = animationAlive && avatarMounted && bubbleStateValid && memoryAccessible;

    this.status = {
      isHealthy,
      lastCheck: Date.now(),
      checks: {
        animationAlive,
        avatarMounted,
        bubbleStateValid,
        memoryAccessible
      },
      repairCount: this.status.repairCount,
      errors
    };

    // Attempt repair if unhealthy
    if (!isHealthy && this.status.repairCount < MAX_REPAIR_ATTEMPTS) {
      this.attemptRepair();
    }
  }

  /**
   * Check animation state
   */
  private checkAnimation(state: MercyEngineState): boolean {
    // Animation should be a valid string or null
    if (state.currentAnimation === undefined) return false;
    if (state.currentAnimation !== null && typeof state.currentAnimation !== 'string') return false;
    return true;
  }

  /**
   * Check avatar state
   */
  private checkAvatar(state: MercyEngineState): boolean {
    const validStyles = ['angelic', 'minimalist', 'abstract'];
    return validStyles.includes(state.avatarStyle);
  }

  /**
   * Check bubble state consistency
   */
  private checkBubbleState(state: MercyEngineState): boolean {
    // If bubble is visible, there should be content
    if (state.isBubbleVisible && !state.currentVoiceLine && !state.greetingText) {
      return false;
    }
    return true;
  }

  /**
   * Check memory/localStorage accessibility
   */
  private checkMemory(): boolean {
    try {
      const testKey = '__mercy_heartbeat_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Attempt to repair broken state
   */
  private attemptRepair(): void {
    console.warn('[MercyHeartbeat] Attempting repair...', this.status.errors);
    
    this.status.repairCount++;
    
    if (this.repairCallback) {
      try {
        this.repairCallback();
        console.info('[MercyHeartbeat] Repair callback executed');
      } catch (error) {
        console.error('[MercyHeartbeat] Repair failed:', error);
      }
    }
  }

  /**
   * Get current status
   */
  getStatus(): HeartbeatStatus {
    return { ...this.status };
  }

  /**
   * Reset repair counter
   */
  resetRepairCount(): void {
    this.status.repairCount = 0;
  }

  /**
   * Force a health check
   */
  forceCheck(): HeartbeatStatus {
    this.runCheck();
    return this.getStatus();
  }
}

// Singleton instance
export const mercyHeartbeat = new MercyHeartbeat();

/**
 * Hook to use heartbeat in React components
 */
export function useHeartbeatStatus(): HeartbeatStatus {
  return mercyHeartbeat.getStatus();
}
