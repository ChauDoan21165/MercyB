import { vi } from "vitest";
import { createPlacementV3Harness } from "../harness.ts";

export function createHarness(options: Parameters<typeof createPlacementV3Harness>[0] = {}) {
  return createPlacementV3Harness({ ...options, log: vi.fn() });
}
