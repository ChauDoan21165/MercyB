// Punjabi C2 learner-proof statement guards. These validate app-consumable structure
// and scope, not certification, official placement, or native-level authority.

import { describe, expect, it } from "vitest";

import {
  C2_LEARNER_PROOF_PACK_STATEMENTS_DISCLAIMER,
  LearnerProofPackStatementsC2,
  LearnerProofPackStatementsC2ByFocus,
  type PunjabiC2LearnerProofPackFocus,
  type PunjabiC2LearnerProofPackStatement,
} from "@/languages/punjabi/learnerProofPackC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2LearnerProofPackFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "conflict_deescalation",
  "sensitive_topic_framing",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 learner-proof statements — coverage", () => {
  it("ships a compact app-consumable learner-proof pack", () => {
    expect(LearnerProofPackStatementsC2.length).toBeGreaterThanOrEqual(8);
    expect(LearnerProofPackStatementsC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 learner-proof focus", () => {
    const seen = new Set(LearnerProofPackStatementsC2.map((statement) => statement.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = LearnerProofPackStatementsC2.map((statement) => statement.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("LearnerProofPackStatementsC2ByFocus returns only matching statements", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = LearnerProofPackStatementsC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((statement) => statement.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 learner-proof statements — bilingual integrity", () => {
  it("each statement has VI+EN title, learner-proof statement, and learner context", () => {
    for (const statement of LearnerProofPackStatementsC2) {
      expect(statement.title_vi.length, `${statement.id} title_vi`).toBeGreaterThan(0);
      expect(statement.title_en.length, `${statement.id} title_en`).toBeGreaterThan(0);
      expect(statement.statement_vi.length, `${statement.id} statement_vi`).toBeGreaterThan(0);
      expect(statement.statement_en.length, `${statement.id} statement_en`).toBeGreaterThan(0);
      expect(statement.learner_context_vi.length, `${statement.id} context_vi`).toBeGreaterThan(0);
      expect(statement.learner_context_en.length, `${statement.id} context_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const statement of LearnerProofPackStatementsC2) {
      expect(hasGurmukhi(statement.model_gurmukhi), `${statement.id} model_gurmukhi`).toBe(true);
      expect(statement.model_romanization.length, `${statement.id} model_romanization`).toBeGreaterThan(0);
      expect(statement.model_vi.length, `${statement.id} model_vi`).toBeGreaterThan(0);
      expect(statement.model_en.length, `${statement.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each sample phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const statement of LearnerProofPackStatementsC2) {
      expect(statement.sample_phrases.length, `${statement.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of statement.sample_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${statement.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${statement.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${statement.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${statement.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner-proof checkpoint and readiness style items", () => {
    for (const statement of LearnerProofPackStatementsC2) {
      expect(statement.checkpoints.length, `${statement.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(statement.readiness.self_check_vi.length, `${statement.id} self_check_vi`).toBeGreaterThan(0);
      expect(statement.readiness.self_check_en.length, `${statement.id} self_check_en`).toBeGreaterThan(0);
      expect(statement.readiness.ready_signal_vi.length, `${statement.id} ready_signal_vi`).toBeGreaterThan(0);
      expect(statement.readiness.ready_signal_en.length, `${statement.id} ready_signal_en`).toBeGreaterThan(0);
    }
    const statuses = new Set(LearnerProofPackStatementsC2.map((statement) => statement.readiness.status_if_missing));
    expect(statuses.has("needs_practice")).toBe(true);
    expect(statuses.has("near_ready")).toBe(true);
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(LearnerProofPackStatementsC2.filter((statement) => statement.learner_trap).length).toBeGreaterThanOrEqual(5);
    const canadaStatements = LearnerProofPackStatementsC2.filter((statement) => statement.canada_practical);
    expect(canadaStatements.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaStatements).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 learner-proof statements — scope framing", () => {
  it("exposes self-study, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_LEARNER_PROOF_PACK_STATEMENTS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_LEARNER_PROOF_PACK_STATEMENTS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_LEARNER_PROOF_PACK_STATEMENTS_DISCLAIMER.vi} ${C2_LEARNER_PROOF_PACK_STATEMENTS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in statements", () => {
    const blob = JSON.stringify(LearnerProofPackStatementsC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2LearnerProofPackStatement[] = LearnerProofPackStatementsC2;
void _typecheck;
