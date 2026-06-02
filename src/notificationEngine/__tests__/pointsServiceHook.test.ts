import { vi, describe, it, expect, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ hook: vi.fn() }));

// The single notification touch-point in pointsService.
vi.mock("@/notificationEngine", () => ({ onFirstActionOfDay: h.hook }));
// syncToSupabase early-returns on no user; keep it inert.
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getUser: async () => ({ data: { user: null } }) } },
}));

import { awardPoints } from "@/services/pointsService";

beforeEach(() => {
  h.hook.mockClear();
  // localStorage is reset by the canonical storage mock in the global setup.
});

describe("pointsService.awardPoints → onFirstActionOfDay", () => {
  it("fires the hook exactly once — only on the first action of the local day", () => {
    awardPoints("keyword_click");
    awardPoints("keyword_click");
    expect(h.hook).toHaveBeenCalledTimes(1);
  });
});
