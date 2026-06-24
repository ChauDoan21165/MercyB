import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRIORITY_BANDS,
  PUNJABI_PRIORITY_FOCI,
  PUNJABI_REMEDIATION_PRIORITY_NOTICE,
  punjabiRemediationPriorityQueue,
  type PunjabiRemediationPriorityQueueItem,
} from "@/languages/punjabi/remediationPriorityQueue";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationPriorityQueue - size, ranking, identity", () => {
  it("keeps a compact useful priority queue", () => {
    expect(punjabiRemediationPriorityQueue.length).toBeGreaterThanOrEqual(12);
    expect(punjabiRemediationPriorityQueue.length).toBeLessThanOrEqual(35);
  });

  it("has unique ids and contiguous ranks", () => {
    const ids = punjabiRemediationPriorityQueue.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^priority-[a-z0-9]+(-[a-z0-9]+)*$/);
    }

    const ranks = punjabiRemediationPriorityQueue.map((item) => item.rank);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(ranks).toEqual(Array.from({ length: ranks.length }, (_, index) => index + 1));
  });
});

describe("punjabiRemediationPriorityQueue - app fields", () => {
  const requiredText: (keyof PunjabiRemediationPriorityQueueItem)[] = [
    "trigger",
    "learnerRisk_vi",
    "learnerRisk_en",
    "navigationTarget",
    "reviewDeckId",
    "remediationRouteId",
    "readinessGateId",
    "model_pa",
    "model_en",
    "repairAction_vi",
    "repairAction_en",
    "readinessEvidence",
    "commonTrap",
  ];

  it("fills every required field", () => {
    for (const item of punjabiRemediationPriorityQueue) {
      for (const key of requiredText) {
        const value = item[key];
        expect(typeof value, `${item.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${item.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary with romanization only as support", () => {
    for (const item of punjabiRemediationPriorityQueue) {
      expect(GURMUKHI_SCRIPT.test(item.model_pa), `${item.id}.model_pa`).toBe(true);
      expect(item.model_pa).not.toBe(item.model_roman);
    }
  });

  it("keeps Vietnamese and English repair guidance distinct", () => {
    for (const item of punjabiRemediationPriorityQueue) {
      expect(item.learnerRisk_vi).not.toBe(item.learnerRisk_en);
      expect(item.repairAction_vi).not.toBe(item.repairAction_en);
      expect(
        VIETNAMESE_MARKS.test(item.learnerRisk_vi) || VIETNAMESE_MARKS.test(item.repairAction_vi),
        `${item.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationPriorityQueue - coverage and routing", () => {
  it("covers every required priority focus", () => {
    const present = new Set<PunjabiRemediationPriorityQueueItem["focus"]>();
    for (const item of punjabiRemediationPriorityQueue) {
      expect(PUNJABI_PRIORITY_FOCI).toContain(item.focus);
      present.add(item.focus);
    }
    for (const focus of PUNJABI_PRIORITY_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all priority bands and puts urgent work first", () => {
    const bands = new Set<PunjabiRemediationPriorityQueueItem["priorityBand"]>();
    for (const item of punjabiRemediationPriorityQueue) {
      expect(PUNJABI_PRIORITY_BANDS).toContain(item.priorityBand);
      bands.add(item.priorityBand);
    }
    for (const band of PUNJABI_PRIORITY_BANDS) {
      expect(bands.has(band), `missing band ${band}`).toBe(true);
    }

    expect(punjabiRemediationPriorityQueue.slice(0, 5).every((item) => item.priorityBand === "urgent")).toBe(true);
  });

  it("includes Vietnamese-specific, English-specific, and shared audiences", () => {
    const audiences = new Set(punjabiRemediationPriorityQueue.map((item) => item.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("links each priority to review, remediation, readiness, and navigation", () => {
    for (const item of punjabiRemediationPriorityQueue) {
      expect(item.reviewDeckId).toMatch(/^final-/);
      expect(item.remediationRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.readinessGateId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.navigationTarget.length).toBeGreaterThan(4);
    }
  });

  it("includes Canada-practical communication repair priorities", () => {
    const canadaItems = punjabiRemediationPriorityQueue.filter((item) => item.canadaPractical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(7);
    expect(canadaItems.some((item) => item.model_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaItems.some((item) => item.model_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaItems.some((item) => item.model_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
  });
});

describe("punjabiRemediationPriorityQueue - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_PRIORITY_NOTICE} ${JSON.stringify(
      punjabiRemediationPriorityQueue,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_PRIORITY_NOTICE.toLowerCase();
    expect(notice).toContain("wave 16 priority queue only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
