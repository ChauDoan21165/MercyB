import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "src/pages/AiTutor.tsx"), "utf8");

describe("AiTutor self-audit outcome telemetry wiring", () => {
  it("emits formatted self-audit telemetry before each block return", () => {
    expect(source).toContain("formatSelfAuditTelemetry");
    expect(source).toContain("recordSelfAuditOutcomeEvent");

    const aiSelfAudit = source.indexOf("const selfAuditResult = selfAuditCorrectionQuick(trimmed, turn.explanation, aiCorrected);");
    const ruleSelfAudit = source.indexOf("const selfAuditResult = selfAuditCorrectionQuick(trimmed, turn.explanation, corrected);");
    expect(aiSelfAudit).toBeGreaterThan(0);
    expect(ruleSelfAudit).toBeGreaterThan(0);

    for (const start of [aiSelfAudit, ruleSelfAudit]) {
      const block = source.slice(start, start + 600);
      expect(block).toContain("recordSelfAuditOutcomeEvent({");
      expect(block).toContain("telemetry: formatSelfAuditTelemetry(selfAuditResult)");
      expect(block.indexOf("recordSelfAuditOutcomeEvent({")).toBeLessThan(block.indexOf("if (selfAuditResult.isBlocked)"));
    }
  });
});
