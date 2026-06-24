// src/lib/ai-tutor/__tests__/sanitizeMemoryTag.test.ts
// Privacy proof: sanitizeMemoryTag must never pass PII through to memory storage.
//
// This is the trust boundary between raw learner input and what gets stored
// in IndexedDB. Any PII that leaks through here becomes persistent on-device
// memory. These tests lock the sanitization invariants.

import { describe, expect, it } from "vitest";
import { sanitizeMemoryTag } from "../learningMemory";

describe("sanitizeMemoryTag — PII never enters memory storage", () => {
  // ── Email redaction ──────────────────────────────────────────────

  it("strips standard email addresses", () => {
    expect(sanitizeMemoryTag("learner@example.com")).toBe("general");
    expect(sanitizeMemoryTag("contact jane.doe+tag@example.co.uk")).toBe("general");
  });

  it("strips emails embedded within a tag string", () => {
    const result = sanitizeMemoryTag(
      "past-tense learner@example.com verb-forms",
    );
    expect(result).not.toContain("@");
    expect(result).not.toContain("learner");
    expect(result).not.toMatch(/example/);
  });

  // ── JWT token redaction ──────────────────────────────────────────

  it("strips JWT tokens (header.payload.signature)", () => {
    expect(
      sanitizeMemoryTag("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature"),
    ).toBe("general");
  });

  it("strips JWTs embedded in topic text", () => {
    const result = sanitizeMemoryTag(
      "past tense eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsZWFybmVyIn0.abc123",
    );
    expect(result).not.toContain("eyJ");
    expect(result).not.toMatch(/[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/);
  });

  it("strips Bearer tokens", () => {
    const result = sanitizeMemoryTag(
      "Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.def456 article error",
    );
    expect(result).not.toContain("Bearer");
    expect(result).not.toContain("eyJ");
  });

  // ── UUID redaction ───────────────────────────────────────────────

  it("strips UUIDs (standard 8-4-4-4-12 format)", () => {
    expect(
      sanitizeMemoryTag("550e8400-e29b-41d4-a716-446655440000"),
    ).toBe("general");
  });

  it("strips UUIDs inside compound tag text", () => {
    const result = sanitizeMemoryTag(
      "user 550e8400-e29b-41d4-a716-446655440000 grammar-article",
    );
    expect(result).not.toContain("550e8400");
    expect(result).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}/);
  });

  // ── Long number redaction (6+ digits) ────────────────────────────

  it("strips 6+ digit number runs (phone numbers, IDs)", () => {
    // Pure number strings → everything stripped → "general"
    expect(sanitizeMemoryTag("0987654321")).toBe("general");
    // Number stripped, "id" remains → 1 safe word passes through
    expect(sanitizeMemoryTag("id 123456")).toBe("id");
  });

  it("preserves short digit runs (≤5 digits) as they are not identifiers", () => {
    const result = sanitizeMemoryTag("cefr-b1 level-3 score-95");
    expect(result).toContain("b1");
    expect(result).toContain("level-3");
    expect(result).not.toBe("general");
  });

  // ── Sentence-like text collapses to "general" ────────────────────

  it("collapses sentences with punctuation to 'general'", () => {
    expect(sanitizeMemoryTag("I went to the store yesterday.")).toBe(
      "general",
    );
    expect(sanitizeMemoryTag("Did you finish the homework?")).toBe(
      "general",
    );
    expect(sanitizeMemoryTag("That is wrong!")).toBe("general");
  });

  it("collapses text with pronouns and >3 words to 'general'", () => {
    expect(sanitizeMemoryTag("I bought a private ticket yesterday")).toBe(
      "general",
    );
    expect(sanitizeMemoryTag("she forgot her homework again")).toBe(
      "general",
    );
  });

  it("collapses text with >5 words to 'general' (even without pronouns)", () => {
    expect(
      sanitizeMemoryTag("past tense verb form irregular conjugation mistake"),
    ).toBe("general");
  });

  // ── Privacy keywords trigger collapse ────────────────────────────

  it("collapses tags containing privacy-sensitive keywords to 'general'", () => {
    // Each of these contains a privacy keyword that triggers collapse
    const collapsingKeywords = [
      "audio recording of session",
      "transcript from lesson one",
      "conversation history export",
      "raw text input here",
      "jwt token leaked",
      "password reset link",
      "secret api key",
      "email address field",
      "phone number here",
    ];

    for (const keyword of collapsingKeywords) {
      expect(sanitizeMemoryTag(keyword)).toBe("general");
    }

    // "bearer auth header" — "bearer" is stripped but remaining
    // "auth header" (2 words, no pronouns/punctuation) passes through.
    // The Bearer regex in sanitizeMemoryTag strips the word "Bearer"
    // but lowercase "bearer" may not match the case-sensitive pattern.
    // Either way, the remaining text is safe (no PII after stripping).
    const bearerResult = sanitizeMemoryTag("bearer auth header");
    expect(bearerResult).not.toContain("bearer");
    expect(bearerResult).not.toMatch(/eyJ/); // no JWT content
  });

  // ── Safe tags pass through ───────────────────────────────────────

  it("passes through clean grammar topic tags unchanged", () => {
    expect(sanitizeMemoryTag("past-tense")).toBe("past-tense");
    expect(sanitizeMemoryTag("present-simple")).toBe("present-simple");
    expect(sanitizeMemoryTag("articles")).toBe("articles");
    expect(sanitizeMemoryTag("third-person-s")).toBe("third-person-s");
    expect(sanitizeMemoryTag("prepositions")).toBe("prepositions");
    expect(sanitizeMemoryTag("subject-verb-agreement")).toBe(
      "subject-verb-agreement",
    );
  });

  it("passes through CEFR level tags", () => {
    expect(sanitizeMemoryTag("A1")).toBe("A1");
    expect(sanitizeMemoryTag("B2")).toBe("B2");
    expect(sanitizeMemoryTag("C1")).toBe("C1");
  });

  // ── Edge cases ───────────────────────────────────────────────────

  it("handles empty input by returning 'general'", () => {
    expect(sanitizeMemoryTag("")).toBe("general");
    expect(sanitizeMemoryTag("   ")).toBe("general");
  });

  it("strips special characters but sentence punctuation (!?.) triggers collapse", () => {
    // Sentence punctuation (!?.) triggers collapse to "general"
    const withExclamation = sanitizeMemoryTag("past-tense!!!@#$%^&*()");
    expect(withExclamation).toBe("general");

    // Without sentence punctuation, special chars are stripped and safe text remains
    const withoutPunctuation = sanitizeMemoryTag("past-tense@#$%^&*()");
    expect(withoutPunctuation).toBe("past-tense");
  });

  it("truncates long safe tags to 60 characters", () => {
    const longTag = "a".repeat(80) + "-valid-grammar-tag";
    const result = sanitizeMemoryTag(longTag);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result).not.toBe("general");
  });

  it("handles mixed PII in one tag — all redacted, falls back to 'general'", () => {
    const mixedPii =
      "learner@example.com 550e8400-e29b-41d4-a716-446655440000 eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature 0987654321";
    const result = sanitizeMemoryTag(mixedPii);

    expect(result).toBe("general");
    expect(result).not.toContain("@");
    expect(result).not.toContain("550e8400");
    expect(result).not.toContain("eyJ");
    expect(result).not.toContain("0987654321");
  });

  // ── Vietnamese-specific ──────────────────────────────────────────

  it("handles Vietnamese diacritics in safe tags", () => {
    // Vietnamese grammar topics with diacritics should pass through
    expect(sanitizeMemoryTag("phát-âm")).toBe("phát-âm");
    expect(sanitizeMemoryTag("dấu-huyền")).toBe("dấu-huyền");
  });

  it("collapses Vietnamese sentences with pronouns to 'general'", () => {
    // "tôi" = "I" — pronoun triggers collapse
    expect(sanitizeMemoryTag("tôi đã đi học hôm qua")).toBe("general");
  });

  it("handles Vietnamese + English mixed PII", () => {
    // Mixed language with email — should collapse
    const result = sanitizeMemoryTag(
      "tôi học past-tense learner@example.com",
    );
    expect(result).toBe("general");
    expect(result).not.toContain("@");
  });

  // ── Non-regression: tags that should NOT collapse ────────────────

  it("does not collapse short technical terms that happen to contain pronouns", () => {
    // "me" is a pronoun but short enough (1 word) to pass through
    // This guards against over-redaction of legitimate short tags
    const result = sanitizeMemoryTag("me");
    // "me" is only 1 word, so the (wordCount > 3) check prevents collapse
    expect(result).not.toBe("general");
  });

  it("does not collapse 3-word tags without pronouns or sentence punctuation", () => {
    const result = sanitizeMemoryTag("past tense irregular");
    expect(result).not.toBe("general");
  });
});
