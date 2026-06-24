import { describe, expect, it } from "vitest";

import {
  PUNJABI_CAN_DO_AUDIENCES,
  PUNJABI_CAN_DO_FOCI,
  PUNJABI_CAN_DO_LEVELS,
  PUNJABI_CAN_DO_NOTICE,
  punjabiRemediationCanDoStatements,
  type PunjabiRemediationCanDoStatement,
} from "@/languages/punjabi/remediationCanDoStatements";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationCanDoStatements - size and identity", () => {
  it("keeps a compact useful can-do set", () => {
    expect(punjabiRemediationCanDoStatements.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationCanDoStatements.length).toBeLessThanOrEqual(50);
  });

  it("has unique kebab-case ids", () => {
    const ids = punjabiRemediationCanDoStatements.map((statement) => statement.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationCanDoStatements - app fields", () => {
  const requiredText: (keyof PunjabiRemediationCanDoStatement)[] = [
    "canDo_vi",
    "canDo_en",
    "checkpointTask_vi",
    "checkpointTask_en",
    "evidence_pa",
    "evidence_en",
    "readinessSignal",
    "nextRemediation",
    "learnerTip_vi",
    "learnerTip_en",
  ];

  it("fills every required text field", () => {
    for (const statement of punjabiRemediationCanDoStatements) {
      for (const key of requiredText) {
        const value = statement[key];
        expect(typeof value, `${statement.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${statement.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary in evidence", () => {
    for (const statement of punjabiRemediationCanDoStatements) {
      expect(GURMUKHI_SCRIPT.test(statement.evidence_pa), `${statement.id}.evidence_pa`).toBe(true);
    }
  });

  it("keeps Vietnamese and English can-do text genuinely bilingual", () => {
    for (const statement of punjabiRemediationCanDoStatements) {
      expect(statement.canDo_vi).not.toBe(statement.canDo_en);
      expect(statement.checkpointTask_vi).not.toBe(statement.checkpointTask_en);
      expect(
        VIETNAMESE_MARKS.test(statement.canDo_vi) || VIETNAMESE_MARKS.test(statement.learnerTip_vi),
        `${statement.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationCanDoStatements - coverage and guardrails", () => {
  it("uses only valid foci and covers every remediation focus", () => {
    const present = new Set<PunjabiRemediationCanDoStatement["focus"]>();
    for (const statement of punjabiRemediationCanDoStatements) {
      expect(PUNJABI_CAN_DO_FOCI).toContain(statement.focus);
      present.add(statement.focus);
    }
    for (const focus of PUNJABI_CAN_DO_FOCI) {
      expect(present.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("uses all can-do levels and valid audiences", () => {
    const levels = new Set<PunjabiRemediationCanDoStatement["level"]>();
    const audiences = new Set<PunjabiRemediationCanDoStatement["audience"]>();
    for (const statement of punjabiRemediationCanDoStatements) {
      expect(PUNJABI_CAN_DO_LEVELS).toContain(statement.level);
      expect(PUNJABI_CAN_DO_AUDIENCES).toContain(statement.audience);
      levels.add(statement.level);
      audiences.add(statement.audience);
    }
    for (const level of PUNJABI_CAN_DO_LEVELS) {
      expect(levels.has(level), `missing level ${level}`).toBe(true);
    }
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical examples", () => {
    expect(punjabiRemediationCanDoStatements.filter((statement) => statement.canadaPractical).length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_CAN_DO_NOTICE} ${JSON.stringify(punjabiRemediationCanDoStatements)}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_CAN_DO_NOTICE.toLowerCase();
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).toContain("not a11 integration");
    expect(notice).not.toContain("native reviewed");
  });
});
