import { describe, it, expect } from 'vitest';

describe('MercyForge Pipeline Floor Refill Behavior', () => {
  it('should maintain floor resource count after multiple refill cycles', () => {
    const floor = {
      maxResources: 100,
      currentResources: 100,
      refillRate: 10,
      refillCycle: 0,
      refill() {
        if (this.currentResources < this.maxResources) {
          const available = this.maxResources - this.currentResources;
          const refillAmount = Math.min(this.refillRate, available);
          this.currentResources += refillAmount;
        }
        this.refillCycle++;
      },
      deplete(amount) {
        if (this.currentResources >= amount) {
          this.currentResources -= amount;
          return true;
        }
        return false;
      }
    };

    floor.deplete(45);
    expect(floor.currentResources).toBe(55);

    floor.refill();
    expect(floor.currentResources).toBe(65);
    expect(floor.refillCycle).toBe(1);

    floor.deplete(30);
    expect(floor.currentResources).toBe(35);

    floor.refill();
    expect(floor.currentResources).toBe(45);
    expect(floor.refillCycle).toBe(2);

    floor.deplete(50);
    expect(floor.currentResources).toBe(45);
    expect(floor.deplete(50)).toBe(false);

    floor.refill();
    expect(floor.currentResources).toBe(55);
    expect(floor.refillCycle).toBe(3);

    floor.deplete(55);
    expect(floor.currentResources).toBe(0);

    floor.refill();
    expect(floor.currentResources).toBe(10);
    expect(floor.refillCycle).toBe(4);

    for (let i = 0; i < 9; i++) {
      floor.refill();
    }
    expect(floor.currentResources).toBe(100);
    expect(floor.refillCycle).toBe(13);

    floor.refill();
    expect(floor.currentResources).toBe(100);
    expect(floor.refillCycle).toBe(14);
  });

  it('should not exceed maximum resources on refill', () => {
    const floor = {
      maxResources: 50,
      currentResources: 50,
      refillRate: 20,
      refillCycle: 0,
      refill() {
        if (this.currentResources < this.maxResources) {
          const available = this.maxResources - this.currentResources;
          const refillAmount = Math.min(this.refillRate, available);
          this.currentResources += refillAmount;
        }
        this.refillCycle++;
      }
    };

    floor.refill();
    expect(floor.currentResources).toBe(50);
    expect(floor.refillCycle).toBe(1);

    floor.currentResources = 45;
    floor.refill();
    expect(floor.currentResources).toBe(50);
    expect(floor.refillCycle).toBe(2);
  });

  it('should handle zero refill rate gracefully', () => {
    const floor = {
      maxResources: 100,
      currentResources: 50,
      refillRate: 0,
      refillCycle: 0,
      refill() {
        if (this.currentResources < this.maxResources) {
          const available = this.maxResources - this.currentResources;
          const refillAmount = Math.min(this.refillRate, available);
          this.currentResources += refillAmount;
        }
        this.refillCycle++;
      }
    };

    floor.refill();
    expect(floor.currentResources).toBe(50);
    expect(floor.refillCycle).toBe(1);

    floor.refill();
    expect(floor.currentResources).toBe(50);
    expect(floor.refillCycle).toBe(2);
  });

  it('should refill in deterministic steps regardless of depletion pattern', () => {
    const floor = {
      maxResources: 100,
      currentResources: 100,
      refillRate: 25,
      refillCycle: 0,
      refill() {
        if (this.currentResources < this.maxResources) {
          const available = this.maxResources - this.currentResources;
          const refillAmount = Math.min(this.refillRate, available);
          this.currentResources += refillAmount;
        }
        this.refillCycle++;
      },
      deplete(amount) {
        if (this.currentResources >= amount) {
          this.currentResources -= amount;
          return true;
        }
        return false;
      }
    };

    floor.deplete(55);
    floor.refill();
    expect(floor.currentResources).toBe(70);
    expect(floor.refillCycle).toBe(1);

    floor.deplete(70);
    floor.refill();
    expect(floor.currentResources).toBe(25);
    expect(floor.refillCycle).toBe(2);

    floor.deplete(10);
    floor.refill();
    expect(floor.currentResources).toBe(40);
    expect(floor.refillCycle).toBe(3);

    floor.deplete(40);
    floor.refill();
    expect(floor.currentResources).toBe(25);
    expect(floor.refillCycle).toBe(4);

    floor.deplete(25);
    floor.refill();
    expect(floor.currentResources).toBe(25);
    expect(floor.refillCycle).toBe(5);
  });
});
