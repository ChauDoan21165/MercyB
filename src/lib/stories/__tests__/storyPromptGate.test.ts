// storyPromptGate tests. Cooldown logic is pure; eligibility is mocked
// out (because eligibility itself is covered by eligibility.test.ts).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isCooldownElapsed,
  STORY_PROMPT_COOLDOWN_DAYS,
  STORY_PROMPT_KEY_PREFIX,
} from "../storyPromptGate";

vi.mock("../eligibility", () => ({
  isUserEligibleToShareStory: vi.fn(),
}));

import { isUserEligibleToShareStory } from "../eligibility";

const DAY = 86_400_000;

beforeEach(() => {
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isCooldownElapsed", () => {
  it("returns true when no last-shown timestamp is recorded", () => {
    expect(isCooldownElapsed(null, Date.now())).toBe(true);
  });

  it("returns false when shown < 30 days ago", () => {
    const lastShown = Date.now() - 5 * DAY;
    expect(isCooldownElapsed(lastShown, Date.now())).toBe(false);
  });

  it("returns true when shown >= 30 days ago", () => {
    const lastShown = Date.now() - (STORY_PROMPT_COOLDOWN_DAYS + 1) * DAY;
    expect(isCooldownElapsed(lastShown, Date.now())).toBe(true);
  });
});

describe("shouldShowStoryPrompt", () => {
  it("returns true when no prompt timestamp and user is eligible", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({ eligible: true });
    const { shouldShowStoryPrompt } = await import("../storyPromptGate");
    const ok = await shouldShowStoryPrompt("u-1");
    expect(ok).toBe(true);
    expect(isUserEligibleToShareStory).toHaveBeenCalledWith("u-1");
  });

  it("returns false when prompt was shown < 30 days ago — even if eligible", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({ eligible: true });
    window.localStorage.setItem(
      `${STORY_PROMPT_KEY_PREFIX}u-2`,
      String(Date.now() - 3 * DAY),
    );
    const { shouldShowStoryPrompt } = await import("../storyPromptGate");
    const ok = await shouldShowStoryPrompt("u-2");
    expect(ok).toBe(false);
    // Eligibility is short-circuited when cooldown is active.
    expect(isUserEligibleToShareStory).not.toHaveBeenCalled();
  });

  it("returns true when cooldown elapsed and user is eligible", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({ eligible: true });
    window.localStorage.setItem(
      `${STORY_PROMPT_KEY_PREFIX}u-3`,
      String(Date.now() - (STORY_PROMPT_COOLDOWN_DAYS + 5) * DAY),
    );
    const { shouldShowStoryPrompt } = await import("../storyPromptGate");
    const ok = await shouldShowStoryPrompt("u-3");
    expect(ok).toBe(true);
  });

  it("returns false when cooldown elapsed but user is NOT eligible", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({
      eligible: false,
      reason: "tier < 1",
      reasonVi: "Cần gói trả phí",
    });
    const { shouldShowStoryPrompt } = await import("../storyPromptGate");
    const ok = await shouldShowStoryPrompt("u-4");
    expect(ok).toBe(false);
  });
});
