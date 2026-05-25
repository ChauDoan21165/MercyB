/**
 * Structural validator for L1Profile.
 *
 * Spec §6 Phase-1 plumbing: deferred from the C5/C6 ingestor PR so a
 * single Vietnamese-tuned dispatch couldn't smuggle Vietnamese-specific
 * assumptions into the validator. Korean and Spanish profiles won't get
 * the same level of human review C1-C4 gave Vietnamese — this is the
 * structural insurance.
 *
 * Pure function. Reads the profile, returns errors + warnings. Never
 * mutates. Never calls into the runtime detector. Never throws — bad
 * input becomes an error string, not an exception.
 *
 * Companion to `feedback/rule-pack-types.ts:validateRulePack()`. That
 * one validates the detector pack (rules + explanations); this one
 * validates the whole profile (meta + interference + grammar + writing
 * + phonology). They're orthogonal: a profile can pass this validator
 * while its rulePack fails validateRulePack, and vice versa. Callers
 * that need full coverage run both.
 *
 * Return shape `{ errors, warnings }` extends what validateRulePack
 * returns (a flat string[]). The warning bin exists for `needsReview`
 * flags carried over from C2 (writing) and C3 (phonology) — they
 * signal "this entry was flagged for human review at authoring time",
 * not "this entry is structurally invalid".
 *
 * No runtime callers yet (per dispatch). Exposing the function is
 * enough; future CI checks, test harnesses, and the C5 eval harness
 * will invoke it.
 */

import type { L1Profile } from "./vi.js";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

const SNAKE_RE = /^[a-z][a-z0-9_]*$/;
const ISO_LANG_RE = /^[a-z]{2}$/;
const SEMVER_RE = /^\d+(\.\d+){0,2}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SEVERITY_VOCAB: ReadonlySet<string> = new Set(["low", "medium", "high"]);

function isSnake(s: unknown): s is string {
  return typeof s === "string" && SNAKE_RE.test(s);
}

function isValidSeverity(s: unknown): boolean {
  return typeof s === "string" && SEVERITY_VOCAB.has(s);
}

export function validateL1Profile(profile: L1Profile): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!profile || typeof profile !== "object") {
    return { errors: ["profile is not an object"], warnings: [] };
  }

  // ── meta ────────────────────────────────────────────────────────────
  const meta = profile.meta;
  if (!meta || typeof meta !== "object") {
    errors.push("meta is required and must be an object");
  } else {
    if (
      typeof meta.nativeLangCode !== "string" ||
      !ISO_LANG_RE.test(meta.nativeLangCode)
    ) {
      errors.push(
        `meta.nativeLangCode must match ISO 639-1 (/^[a-z]{2}$/); got ${JSON.stringify(meta.nativeLangCode)}`,
      );
    }
    if (
      typeof meta.targetLangCode !== "string" ||
      !ISO_LANG_RE.test(meta.targetLangCode)
    ) {
      errors.push(
        `meta.targetLangCode must match ISO 639-1 (/^[a-z]{2}$/); got ${JSON.stringify(meta.targetLangCode)}`,
      );
    }
    if (
      typeof meta.nativeLangName !== "string" ||
      meta.nativeLangName.trim() === ""
    ) {
      errors.push("meta.nativeLangName must be a non-empty string");
    }
    if (typeof meta.version !== "string" || !SEMVER_RE.test(meta.version)) {
      errors.push(
        `meta.version must be a dot-separated semver-style string; got ${JSON.stringify(meta.version)}`,
      );
    }
    if (
      typeof meta.lastReviewed !== "string" ||
      !ISO_DATE_RE.test(meta.lastReviewed)
    ) {
      errors.push(
        `meta.lastReviewed must be an ISO date (YYYY-MM-DD); got ${JSON.stringify(meta.lastReviewed)}`,
      );
    }
    if (
      typeof meta.lastReviewedBy !== "string" ||
      meta.lastReviewedBy.trim() === ""
    ) {
      errors.push("meta.lastReviewedBy must be a non-empty string");
    }
    if (!Array.isArray(meta.citations) || meta.citations.length === 0) {
      errors.push("meta.citations must be a non-empty array of strings");
    }
  }

  // ── interference (required atlas — spec §2) ────────────────────────
  if (!profile.interference || typeof profile.interference !== "object") {
    errors.push("interference is required and must be an object");
  } else if (!Array.isArray(profile.interference.patterns)) {
    errors.push("interference.patterns must be an array");
  } else if (profile.interference.patterns.length === 0) {
    errors.push("interference.patterns must contain at least one entry");
  } else {
    const seen = new Set<string>();
    for (const p of profile.interference.patterns) {
      if (typeof p.id !== "string" || p.id.trim() === "") {
        errors.push("an interference pattern is missing an id");
        continue;
      }
      if (!isSnake(p.id)) {
        errors.push(
          `interference.patterns[${p.id}]: id must be snake_case (regression check vs codemod)`,
        );
      }
      if (seen.has(p.id)) {
        errors.push(`duplicate interference pattern id: ${p.id}`);
      }
      seen.add(p.id);
      if (!isValidSeverity(p.severity)) {
        errors.push(
          `interference.patterns[${p.id}]: severity must be 'low'|'medium'|'high' (got ${JSON.stringify(p.severity)})`,
        );
      }
    }
  }

  // ── grammar layer (optional) ───────────────────────────────────────
  if (profile.grammar) {
    const families = profile.grammar.families ?? [];
    const familyIds = new Set<string>();
    const validRuleTags = new Set<string>(
      profile.grammar.rulePack?.explanations?.map((e) => e.tag) ?? [],
    );

    for (const fam of families) {
      if (typeof fam.id !== "string" || fam.id.trim() === "") {
        errors.push("a grammar family is missing an id");
        continue;
      }
      if (!isSnake(fam.id)) {
        errors.push(
          `grammar.families[${fam.id}]: id must be snake_case`,
        );
      }
      if (familyIds.has(fam.id)) {
        errors.push(`duplicate grammar family id: ${fam.id}`);
      }
      familyIds.add(fam.id);
      if (!isValidSeverity(fam.severity)) {
        errors.push(
          `grammar.families[${fam.id}]: severity must be 'low'|'medium'|'high' (got ${JSON.stringify(fam.severity)})`,
        );
      }
      if (fam.phenomenon !== undefined && !isSnake(fam.phenomenon)) {
        errors.push(
          `grammar.families[${fam.id}]: phenomenon must be snake_case`,
        );
      }
      for (const tag of fam.ruleTags ?? []) {
        if (!isSnake(tag)) {
          errors.push(
            `grammar.families[${fam.id}]: ruleTags entry "${tag}" must be snake_case`,
          );
        }
        // Cross-link enforcement per spec §4 decision 2.
        if (validRuleTags.size > 0 && !validRuleTags.has(tag)) {
          errors.push(
            `grammar.families[${fam.id}]: ruleTags entry "${tag}" is not a tag in grammar.rulePack.explanations`,
          );
        }
      }
    }
  }

  // ── writing layer (optional) ───────────────────────────────────────
  if (profile.writing) {
    const patterns = profile.writing.patterns ?? [];
    const writingIds = new Set<string>();
    for (const p of patterns) {
      if (typeof p.id !== "string" || p.id.trim() === "") {
        errors.push("a writing pattern is missing an id");
        continue;
      }
      if (!isSnake(p.id)) {
        errors.push(`writing.patterns[${p.id}]: id must be snake_case`);
      }
      if (writingIds.has(p.id)) {
        errors.push(`duplicate writing pattern id: ${p.id}`);
      }
      writingIds.add(p.id);
      if (!isValidSeverity(p.severity)) {
        errors.push(
          `writing.patterns[${p.id}]: severity must be 'low'|'medium'|'high' (got ${JSON.stringify(p.severity)})`,
        );
      }
      if (p.phenomenon !== undefined && !isSnake(p.phenomenon)) {
        errors.push(`writing.patterns[${p.id}]: phenomenon must be snake_case`);
      }
      // needsReview is a warning, not an error — surfaces C2's authoring flags.
      if (p.needsReview === true) {
        warnings.push(
          `writing.patterns[${p.id}]: needsReview flag is set`,
        );
      }
    }
  }

  // ── phonology layer (optional) ─────────────────────────────────────
  if (profile.phonology) {
    const gaps = profile.phonology.gaps ?? [];
    const gapIds = new Set<string>();
    for (const g of gaps) {
      if (typeof g.id !== "string" || g.id.trim() === "") {
        errors.push("a phonology gap is missing an id");
        continue;
      }
      if (!isSnake(g.id)) {
        errors.push(`phonology.gaps[${g.id}]: id must be snake_case`);
      }
      if (gapIds.has(g.id)) {
        errors.push(`duplicate phonology gap id: ${g.id}`);
      }
      gapIds.add(g.id);
      if (g.needsReview === true) {
        warnings.push(`phonology.gaps[${g.id}]: needsReview flag is set`);
      }
    }
  }

  return { errors, warnings };
}
