import { describe, expect, it } from "vitest";

import {
  PUNJABI_INTEGRATION_ERROR_PATTERNS,
  PUNJABI_INTEGRATION_GATES,
  PUNJABI_INTEGRATION_SUPPORTS,
  PUNJABI_REMEDIATION_INTEGRATION_NOTICE,
  punjabiRemediationIntegrationMatrix,
  type PunjabiRemediationIntegrationMatrixRow,
} from "@/languages/punjabi/remediationIntegrationMatrix";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const VIETNAMESE_MARKS = /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

describe("punjabiRemediationIntegrationMatrix - size and identity", () => {
  it("keeps a compact useful integration matrix", () => {
    expect(punjabiRemediationIntegrationMatrix.length).toBeGreaterThanOrEqual(14);
    expect(punjabiRemediationIntegrationMatrix.length).toBeLessThanOrEqual(45);
  });

  it("has unique matrix ids", () => {
    const ids = punjabiRemediationIntegrationMatrix.map((row) => row.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^matrix-[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("punjabiRemediationIntegrationMatrix - app fields", () => {
  const requiredText: (keyof PunjabiRemediationIntegrationMatrixRow)[] = [
    "reviewDeckId",
    "readinessGateId",
    "canDoStatementId",
    "scenarioRecallId",
    "scriptSupportId",
    "registerSupportId",
    "repairTaskId",
    "prompt_pa",
    "prompt_en",
    "explanation_vi",
    "explanation_en",
    "checkpoint_vi",
    "checkpoint_en",
    "commonTrap",
    "expectedEvidence",
    "nextRouteId",
  ];

  it("fills every required text field", () => {
    for (const row of punjabiRemediationIntegrationMatrix) {
      for (const key of requiredText) {
        const value = row[key];
        expect(typeof value, `${row.id}.${key}`).toBe("string");
        expect((value as string).trim().length, `${row.id}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it("uses Gurmukhi primary prompts with optional romanization", () => {
    for (const row of punjabiRemediationIntegrationMatrix) {
      expect(GURMUKHI_SCRIPT.test(row.prompt_pa), `${row.id}.prompt_pa`).toBe(true);
      expect(row.prompt_pa).not.toBe(row.prompt_roman);
    }
  });

  it("keeps Vietnamese and English explanations distinct", () => {
    for (const row of punjabiRemediationIntegrationMatrix) {
      expect(row.explanation_vi).not.toBe(row.explanation_en);
      expect(row.checkpoint_vi).not.toBe(row.checkpoint_en);
      expect(
        VIETNAMESE_MARKS.test(row.explanation_vi) || VIETNAMESE_MARKS.test(row.checkpoint_vi),
        `${row.id} should include Vietnamese text`,
      ).toBe(true);
    }
  });
});

describe("punjabiRemediationIntegrationMatrix - integration coverage", () => {
  it("covers every requested error pattern", () => {
    const present = new Set<PunjabiRemediationIntegrationMatrixRow["errorPattern"]>();
    for (const row of punjabiRemediationIntegrationMatrix) {
      expect(PUNJABI_INTEGRATION_ERROR_PATTERNS).toContain(row.errorPattern);
      present.add(row.errorPattern);
    }
    for (const pattern of PUNJABI_INTEGRATION_ERROR_PATTERNS) {
      expect(present.has(pattern), `missing pattern ${pattern}`).toBe(true);
    }
  });

  it("uses all readiness gates and valid support tags", () => {
    const gates = new Set<PunjabiRemediationIntegrationMatrixRow["readinessGate"]>();
    const supports = new Set<string>();
    for (const row of punjabiRemediationIntegrationMatrix) {
      expect(PUNJABI_INTEGRATION_GATES).toContain(row.readinessGate);
      gates.add(row.readinessGate);
      expect(row.supports.length, `${row.id}.supports`).toBeGreaterThanOrEqual(3);
      for (const support of row.supports) {
        expect(PUNJABI_INTEGRATION_SUPPORTS).toContain(support);
        supports.add(support);
      }
    }
    for (const gate of PUNJABI_INTEGRATION_GATES) {
      expect(gates.has(gate), `missing gate ${gate}`).toBe(true);
    }
    for (const support of PUNJABI_INTEGRATION_SUPPORTS) {
      expect(supports.has(support), `missing support ${support}`).toBe(true);
    }
  });

  it("connects review decks, readiness gates, can-do statements, scenario recall, and routing", () => {
    for (const row of punjabiRemediationIntegrationMatrix) {
      expect(row.reviewDeckId).toMatch(/^final-/);
      expect(row.readinessGateId).toMatch(/^(final-|route-)/);
      expect(row.canDoStatementId).toMatch(/^can-do-/);
      expect(row.scenarioRecallId).toMatch(/^recall-/);
      expect(row.nextRouteId).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("includes Vietnamese-specific, English-specific, and shared learner routes", () => {
    const audiences = new Set(punjabiRemediationIntegrationMatrix.map((row) => row.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
    expect(audiences.has("both")).toBe(true);
  });

  it("includes Canada-practical repair tasks for public-service scenarios", () => {
    const canadaRows = punjabiRemediationIntegrationMatrix.filter((row) => row.canadaPractical);
    expect(canadaRows.length).toBeGreaterThanOrEqual(7);
    expect(canadaRows.some((row) => row.prompt_pa.includes("ਲਾਇਬ੍ਰੇਰੀ"))).toBe(true);
    expect(canadaRows.some((row) => row.prompt_pa.includes("ਅਰਜ਼ੀ"))).toBe(true);
    expect(canadaRows.some((row) => row.prompt_pa.includes("ਅਪਾਇੰਟਮੈਂਟ"))).toBe(true);
    expect(canadaRows.every((row) => row.supports.includes("canada-repair"))).toBe(true);
  });
});

describe("punjabiRemediationIntegrationMatrix - guardrails", () => {
  it("mentions Shahmukhi only as awareness, not a full course", () => {
    const serialized = `${PUNJABI_REMEDIATION_INTEGRATION_NOTICE} ${JSON.stringify(
      punjabiRemediationIntegrationMatrix,
    )}`.toLowerCase();
    expect(serialized).toContain("shahmukhi");
    expect(serialized).toContain("awareness");
    expect(serialized).toContain("not a full course");
  });

  it("does not claim native review, official placement, or A11 integration", () => {
    const notice = PUNJABI_REMEDIATION_INTEGRATION_NOTICE.toLowerCase();
    expect(notice).toContain("wave 14 integration matrix only");
    expect(notice).toContain("not a11 integration");
    expect(notice).toContain("study support only");
    expect(notice).toContain("not official placement");
    expect(notice).toContain("native review deferred");
    expect(notice).not.toContain("native reviewed");
  });
});
