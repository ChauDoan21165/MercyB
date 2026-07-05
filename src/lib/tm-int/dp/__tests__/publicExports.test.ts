import { describe, expect, test } from "vitest";
import {
  DP_EVIDENCE_BASED_DECISION_SCHEMA_VERSION,
  dpAllowsPedAction,
  dpRecommendationHasEvidenceRationale,
  dpTeacherContextReferenceFrom,
  isDpDecisionConfidenceLevel,
  validateDpDecision,
} from "../index";

describe("DP public exports", () => {
  test("exports evidence-based decision contract and validator APIs", () => {
    expect(DP_EVIDENCE_BASED_DECISION_SCHEMA_VERSION).toBe("tm-int-dp-decision-contract-v1");
    expect(typeof dpTeacherContextReferenceFrom).toBe("function");
    expect(typeof dpAllowsPedAction).toBe("function");
    expect(typeof dpRecommendationHasEvidenceRationale).toBe("function");
    expect(isDpDecisionConfidenceLevel("high")).toBe(true);
    expect(typeof validateDpDecision).toBe("function");
  });
});
