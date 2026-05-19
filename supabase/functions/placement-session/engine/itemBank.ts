// supabase/functions/placement-session/engine/itemBank.ts
//
// Placement Test v2 — in-memory item bank: validate, index, query
// (Phase 2, PR-V2-4). Sequence-doc item: PR-V2-4 "item bank + schema".
//
// PURE module on the approved `Item` type (types.ts, locked PR 1 #662).
// It does NOT read Supabase: under locked Q1/Q2 the edge function reads
// the server-only `placement_items` table via service-role and hands the
// rows here to be validated + indexed into an `ItemBank`. Keeping the DB
// read out of this module preserves the pure-kernel boundary (Chau,
// reaffirmed) — this layer is testable in isolation with inline
// fixtures, no DB.
//
// Schema decisions for the `placement_items` table itself are in the
// companion migration; they are flagged in the PR for confirm-before-
// apply (migrations are human-applied via SQL Editor — house rule).

import type { Item, ItemBank, ItemType } from "../types.ts";

const ITEM_TYPES: ReadonlyArray<ItemType> = [
  "reading",
  "listening",
  "grammar",
  "vocabulary",
  "writing_sample",
];

/** Result of validating one raw item. `errors` is empty iff `ok`. */
export interface ItemValidation {
  ok: boolean;
  errors: string[];
}

/** Outcome of building a bank: the indexed bank over the VALID unique
 *  items, plus every rejected item with why (the edge fn telemetries
 *  these — a bad item must never crash a live session: design "core
 *  path survives optional failures"). */
export interface BuildBankResult {
  bank: ItemBank;
  rejected: Array<{ id: string | null; errors: string[] }>;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isBilingual(v: unknown): boolean {
  return (
    !!v &&
    typeof v === "object" &&
    isNonEmptyString((v as { en?: unknown }).en) &&
    // VI may legitimately equal EN (bilingual-leak rule, design §7.4),
    // but must be a present string.
    typeof (v as { vi?: unknown }).vi === "string"
  );
}

/**
 * Structural + semantic validation of one item (design §7.1 required
 * fields). Returns the full error list (not fail-fast) so authoring
 * (Phase 3) gets every problem at once.
 *
 * Rules:
 *  - id, type, cefr, skill: present/in-range; difficulty finite;
 *    discrimination finite AND > 0 (a 2PL item with a ≤ 0 is invalid).
 *  - prompt: bilingual {en (non-empty), vi (string)}.
 *  - MC types (reading|listening|grammar|vocabulary): options[] with ≥2
 *    distinct ids, correctOptionId present AND ∈ options ids.
 *  - reading: passage bilingual required.
 *  - listening: audio.key non-empty + audio.replayLimit ≥ 0; transcript
 *    bilingual required (withheld in-test, revealed in result).
 *  - writing_sample: NOT IRT-scored (decision #3) → options/
 *    correctOptionId NOT required; if difficulty/discrimination present
 *    they are ignored downstream (selector excludes the type), but the
 *    fields must still be the right shape if present.
 */
export function validateItem(raw: unknown): ItemValidation {
  const errors: string[] = [];
  const it = (raw ?? {}) as Partial<Item>;

  if (!isNonEmptyString(it.id)) errors.push("id: missing/empty");
  if (!it.type || !ITEM_TYPES.includes(it.type)) {
    errors.push(`type: invalid (${String(it.type)})`);
  }
  const CEFR = ["pre_a1", "A1", "A2", "B1", "B2", "C1", "C2"];
  if (!it.cefr || !CEFR.includes(it.cefr)) {
    errors.push(`cefr: invalid (${String(it.cefr)})`);
  }
  const SKILLS = ["reading", "listening", "grammar", "vocabulary", "writing"];
  if (!it.skill || !SKILLS.includes(it.skill)) {
    errors.push(`skill: invalid (${String(it.skill)})`);
  }
  if (typeof it.difficulty !== "number" || !Number.isFinite(it.difficulty)) {
    errors.push("difficulty: not a finite number");
  }
  if (
    typeof it.discrimination !== "number" ||
    !Number.isFinite(it.discrimination) ||
    it.discrimination <= 0
  ) {
    errors.push("discrimination: must be a finite number > 0");
  }
  if (!isBilingual(it.prompt)) {
    errors.push("prompt: must be { en:non-empty, vi:string }");
  }
  if (!it.meta || typeof it.meta !== "object") {
    errors.push("meta: missing");
  }

  const isMc =
    it.type === "reading" ||
    it.type === "listening" ||
    it.type === "grammar" ||
    it.type === "vocabulary";

  if (isMc) {
    const opts = Array.isArray(it.options) ? it.options : null;
    if (!opts || opts.length < 2) {
      errors.push("options: MC item needs ≥2 options");
    } else {
      const ids = opts.map((o) => o?.id);
      if (new Set(ids).size !== ids.length) {
        errors.push("options: duplicate option ids");
      }
      if (!isNonEmptyString(it.correctOptionId)) {
        errors.push("correctOptionId: missing on an MC item");
      } else if (!ids.includes(it.correctOptionId)) {
        errors.push("correctOptionId: not among options ids");
      }
    }
  }

  if (it.type === "reading" && !isBilingual(it.passage)) {
    errors.push("passage: reading item needs bilingual passage");
  }

  if (it.type === "listening") {
    const a = it.audio;
    if (!a || !isNonEmptyString(a.key) || typeof a.replayLimit !== "number" || a.replayLimit < 0) {
      errors.push("audio: listening needs { key:non-empty, replayLimit:≥0 }");
    }
    if (!isBilingual(it.transcript)) {
      errors.push("transcript: listening needs bilingual transcript");
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Validate + index a set of raw items into an `ItemBank`.
 *
 * - Invalid items are REJECTED (collected in `rejected`), never indexed
 *   — a malformed answer key must not enter a live test.
 * - Duplicate `id` is rejected for every occurrence after the first
 *   (a dup id in an answer bank is an authoring bug, not "last wins").
 * - `byType` always has all 5 ItemType keys (possibly empty arrays) so
 *   callers never hit `undefined` (matches the types.ts Record shape).
 */
export function buildItemBank(
  rawItems: ReadonlyArray<unknown>,
  version: string,
): BuildBankResult {
  const rejected: BuildBankResult["rejected"] = [];
  const byId: Record<string, Item> = {};
  const seen = new Set<string>();
  const valid: Item[] = [];

  for (const raw of rawItems) {
    const v = validateItem(raw);
    const id = (raw as Partial<Item>)?.id;
    const idStr = isNonEmptyString(id) ? id : null;
    if (!v.ok) {
      rejected.push({ id: idStr, errors: v.errors });
      continue;
    }
    const item = raw as Item;
    if (seen.has(item.id)) {
      rejected.push({ id: item.id, errors: ["duplicate id"] });
      continue;
    }
    seen.add(item.id);
    byId[item.id] = item;
    valid.push(item);
  }

  // Explicit all-5-keys construction (no cast): the types.ts Record
  // shape requires every ItemType key present, even if empty.
  const byType: Record<ItemType, Item[]> = {
    reading: [],
    listening: [],
    grammar: [],
    vocabulary: [],
    writing_sample: [],
  };
  for (const item of valid) byType[item.type].push(item);

  return {
    bank: { version, items: valid, byType, byId },
    rejected,
  };
}

/** O(1) id lookup. Returns null (not undefined) for a miss. */
export function itemById(bank: ItemBank, id: string): Item | null {
  return bank.byId[id] ?? null;
}

/** All items of a type (empty array, never undefined). */
export function itemsByType(bank: ItemBank, type: ItemType): ReadonlyArray<Item> {
  return bank.byType[type] ?? [];
}

/** Pure predicate filter over the bank (the selector, PR-V2-5, layers
 *  exposure/quota/MFI on top of this). */
export function filterItems(
  bank: ItemBank,
  predicate: (item: Item) => boolean,
): Item[] {
  return bank.items.filter(predicate);
}
