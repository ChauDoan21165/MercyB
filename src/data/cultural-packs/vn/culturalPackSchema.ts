// src/data/cultural-packs/vn/culturalPackSchema.ts
//
// Step 10 — VN cultural English packs. Authentic VN cultural moments
// translated to English-language context so diaspora users can
// explain Tết, family titles, weddings, funerals, ancestor
// veneration, food, and clinic-translation duty to coworkers,
// kids' teachers, and neighbors.
//
// Each pack ships as a self-contained JSON file in this directory.
// The schema enforces shape at import time so a typo in a pack JSON
// breaks CI rather than producing weird runtime behaviour.
//
// Free-tier feature (community building, not a paywalled premium
// surface) — no entitlement gating in the loader.

import { z } from "zod";

import tetPack from "./tet-lunar-new-year.json";
import familyTitlesPack from "./family-titles.json";
import weddingsPack from "./weddings.json";
import funeralsPack from "./funerals.json";
import ancestorPack from "./ancestor-veneration.json";
import phoFoodPack from "./pho-and-food.json";
import doctorPack from "./doctor-translator.json";
import dailyLifePack from "./daily-life.json";

// ── Pack identifiers ─────────────────────────────────────────────────────

export const CULTURAL_PACK_IDS = [
  "tet-lunar-new-year",
  "family-titles",
  "weddings",
  "funerals",
  "ancestor-veneration",
  "pho-and-food",
  "doctor-translator",
  "daily-life",
] as const;

export type CulturalPackId = (typeof CULTURAL_PACK_IDS)[number];

// ── Phrase schema ────────────────────────────────────────────────────────

export const CulturalPhraseSchema = z.object({
  /** Stable ID, lowercase-kebab, scoped to the pack. */
  id: z.string().regex(/^[a-z0-9-]+$/),
  /**
   * The VN cultural moment (in Vietnamese, with optional English
   * gloss in parentheses). E.g. "Mừng tuổi (lì xì)".
   */
  vn_moment: z.string().min(1),
  /** What's happening / when this phrase comes up. */
  context: z.string().min(1),
  /** The English sentence the speaker says. */
  english: z.string().min(1),
  /**
   * Cultural note for a Western listener — what they should know to
   * receive the explanation respectfully.
   */
  cultural_note: z.string().min(1),
});

export type CulturalPhrase = z.infer<typeof CulturalPhraseSchema>;

// ── Dialogue schema ──────────────────────────────────────────────────────

export const CulturalDialogueLineSchema = z.object({
  /** Speaker label, free-form ("You", "Coworker", "Mom", "Doctor"...). */
  speaker: z.string().min(1),
  english: z.string().min(1),
  /** Optional VN reference for moments where VN words land in the EN dialogue. */
  vn: z.string().optional(),
});

export const CulturalDialogueSchema = z.object({
  title: z.string().min(1),
  setting: z.string().min(1),
  lines: z.array(CulturalDialogueLineSchema).min(2),
});

export type CulturalDialogue = z.infer<typeof CulturalDialogueSchema>;

// ── Pack schema ──────────────────────────────────────────────────────────

export const CulturalPackSchema = z.object({
  id: z.enum(CULTURAL_PACK_IDS),
  /** Vietnamese-first title. */
  title_vn: z.string().min(1),
  /** English title. */
  title_en: z.string().min(1),
  /** Short bilingual blurb shown on the index card. */
  summary_vn: z.string().min(1),
  summary_en: z.string().min(1),
  /**
   * Tone guardrail for editors of this pack. Sacred / festive / practical.
   * Surfaced in tests so a future contributor can't accidentally drop
   * the tone label and quietly shift voice.
   */
  tone: z.enum(["sacred", "festive", "practical", "respectful"]),
  /** Regional variation note (Hà Nội vs Sài Gòn etc.) — empty string OK. */
  regional_note: z.string(),
  phrases: z.array(CulturalPhraseSchema).min(15).max(25),
  dialogues: z.array(CulturalDialogueSchema).min(2).max(3),
});

export type CulturalPack = z.infer<typeof CulturalPackSchema>;

// ── Validate every shipped pack at module load ───────────────────────────

const RAW_PACKS: Record<CulturalPackId, unknown> = {
  "tet-lunar-new-year": tetPack,
  "family-titles": familyTitlesPack,
  weddings: weddingsPack,
  funerals: funeralsPack,
  "ancestor-veneration": ancestorPack,
  "pho-and-food": phoFoodPack,
  "doctor-translator": doctorPack,
  "daily-life": dailyLifePack,
};

export const VN_CULTURAL_PACKS: Readonly<Record<CulturalPackId, CulturalPack>> =
  Object.freeze(
    Object.fromEntries(
      CULTURAL_PACK_IDS.map((id) => [id, CulturalPackSchema.parse(RAW_PACKS[id])]),
    ) as Record<CulturalPackId, CulturalPack>,
  );

export function getVnCulturalPack(id: string): CulturalPack | null {
  if (!isCulturalPackId(id)) return null;
  return VN_CULTURAL_PACKS[id];
}

export function isCulturalPackId(value: string): value is CulturalPackId {
  return (CULTURAL_PACK_IDS as readonly string[]).includes(value);
}
