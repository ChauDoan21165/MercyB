// FILE: domainMap.ts
// PATH: src/lib/mercy-host/domainMap.ts
// VERSION: MB-BLUE-DOMAINMAP-1.0.9 — 2026-02-25 (+0700)
//
// Purpose:
// - Central domain classification for Mercy Host.
//
// Tests expect named exports to exist:
//   - isEnglishDomain
//   - isHealthDomain
//   - isStrategyDomain
//   - isMartialDomain
//   - getDomainCategory
//
// Fixes (1.0.9):
// - Test expects getDomainCategory('random_room') => 'other' (not 'general').
// - Keep existing detection behavior unchanged.
// - Normalize case/spacing/diacritics.

export type DomainCategory =
  | "english"
  | "health"
  | "strategy"
  | "martial"
  | "kids"
  | "other";

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[_\s]+/g, " ")
    .trim();
}

function normalizeId(input: string): string {
  // ids are often snake_case; normalize to snake tokens
  return normalizeText(input).replace(/\s+/g, "_");
}

function tokenizeId(roomId: string): string[] {
  // Stronger than "includes": match on tokens to avoid accidental substring collisions.
  // e.g. "anxiety_relief" => ["anxiety", "relief"]
  // e.g. "english_foundation_ef01" => ["english", "foundation", "ef01"]
  const id = normalizeId(roomId);
  return id.split(/[_\-]+/g).filter(Boolean);
}

function includesAnyToken(tokens: string[], needles: string[]): boolean {
  for (const n of needles) {
    if (tokens.includes(n)) return true;
  }
  return false;
}

function includesAnySubstr(haystack: string, needles: string[]): boolean {
  for (const n of needles) {
    if (haystack.includes(n)) return true;
  }
  return false;
}

// ---------------------------------
// ENGLISH domain detection
// ---------------------------------

// Use token matching for IDs to avoid false positives.
const ENGLISH_ID_TOKENS = [
  "english",
  "english_foundation",
  "foundation",
  "alphabet",
  "phonics",
  "pronunciation",
  "grammar",
  "vocabulary",
  "listening",
  "speaking",
  "reading",
  "writing",

  // CEFR tokens frequently appear as standalone pieces
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
];

// Some ids use compact forms like ef01 / ef_01
// We'll detect "ef" prefix safely via token startsWith.
function hasEnglishIdSignature(roomId: string): boolean {
  const tokens = tokenizeId(roomId);

  // Exact tokens
  if (includesAnyToken(tokens, ENGLISH_ID_TOKENS)) return true;

  // Prefix patterns (safe: only token-level)
  // ef01, ef_01 (becomes "ef01" or "ef", "01" depending on your generator)
  if (tokens.some((t) => /^ef\d{1,3}$/.test(t))) return true;
  if (tokens.includes("ef") && tokens.some((t) => /^\d{1,3}$/.test(t))) return true;

  // "english_foundation_ef01" might tokenize to ["english","foundation","ef01"]
  // already covered, but keep it explicit:
  if (tokens.includes("english") && tokens.some((t) => t.startsWith("ef")))
    return true;

  return false;
}

const ENGLISH_DOMAIN_KEYWORDS = [
  "english",
  "english foundation",
  "pronunciation",
  "phonics",
  "alphabet",
  "grammar",
  "vocabulary",
  "speaking",
  "listening",
  "reading",
  "writing",
];

export function isEnglishDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  if (roomId && hasEnglishIdSignature(roomId)) return true;

  const domain = roomDomain ? normalizeText(roomDomain) : "";
  if (
    domain &&
    includesAnySubstr(domain, ENGLISH_DOMAIN_KEYWORDS.map(normalizeText))
  )
    return true;

  if (tags?.length) {
    for (const t of tags) {
      const tag = normalizeText(String(t));
      // keep this conservative
      if (
        includesAnySubstr(tag, [
          "english",
          "pronunciation",
          "phonics",
          "grammar",
          "vocabulary",
        ])
      )
        return true;
      if (["a1", "a2", "b1", "b2", "c1", "c2"].includes(tag)) return true;
    }
  }

  return false;
}

// ---------------------------------
// HEALTH domain detection
// ---------------------------------

const HEALTH_ID_TOKENS = [
  "health",
  "mental",
  "mentalhealth",
  "mental_health",
  "anxiety",
  "stress",
  "sleep",
  "therapy",
  "healing",
  "wellbeing",
  "well_being",
  "mindfulness",
  "burnout",
  "depression",
  "panic",
  "relief",
];

const HEALTH_DOMAIN_KEYWORDS = [
  "health",
  "healing",
  "mental health",
  "wellbeing",
  "well-being",
  "mindfulness",
  "anxiety",
  "stress",
  "sleep",
  "therapy",
];

export function isHealthDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  if (roomId) {
    const tokens = tokenizeId(roomId);

    // token-based (so "anxiety_relief" hits "anxiety" + "relief")
    // allow either anxiety/stress/etc OR explicit health tokens
    if (includesAnyToken(tokens, HEALTH_ID_TOKENS)) return true;

    // common composites like "mental_health_room"
    if (tokens.includes("mental") && tokens.includes("health")) return true;
  }

  const domain = roomDomain ? normalizeText(roomDomain) : "";
  if (
    domain &&
    includesAnySubstr(domain, HEALTH_DOMAIN_KEYWORDS.map(normalizeText))
  )
    return true;

  if (tags?.length) {
    for (const t of tags) {
      const tag = normalizeText(String(t));
      if (
        includesAnySubstr(tag, [
          "health",
          "mental health",
          "anxiety",
          "stress",
          "sleep",
          "therapy",
          "mindfulness",
          "healing",
          "wellbeing",
          "well-being",
          "relief",
        ])
      ) {
        return true;
      }
    }
  }

  return false;
}

// ---------------------------------
// STRATEGY domain detection
// ---------------------------------

const STRATEGY_ID_TOKENS = [
  "strategy",
  "strategic",
  "thinking",
  "critical",
  "criticalthinking",
  "critical_thinking",
  "logic",
  "decision",
  "decisionmaking",
  "decision_making",
  "risk",
  "riskmanagement",
  "risk_management",
  "systems",
  "systems_thinking",
];

const STRATEGY_DOMAIN_KEYWORDS = [
  "strategy",
  "strategic thinking",
  "critical thinking",
  "logic",
  "decision making",
  "risk management",
  "systems thinking",
];

export function isStrategyDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  if (roomId) {
    const tokens = tokenizeId(roomId);
    if (includesAnyToken(tokens, STRATEGY_ID_TOKENS)) return true;

    // common phrasey ids
    if (tokens.includes("strategic") && tokens.includes("thinking")) return true;
    if (tokens.includes("critical") && tokens.includes("thinking")) return true;
  }

  const domain = roomDomain ? normalizeText(roomDomain) : "";
  if (
    domain &&
    includesAnySubstr(domain, STRATEGY_DOMAIN_KEYWORDS.map(normalizeText))
  )
    return true;

  if (tags?.length) {
    for (const t of tags) {
      const tag = normalizeText(String(t));
      if (
        includesAnySubstr(tag, [
          "strategy",
          "strategic",
          "logic",
          "critical thinking",
          "risk",
        ])
      )
        return true;
    }
  }

  return false;
}

// ---------------------------------
// KIDS domain detection (test-backed)
// ---------------------------------

const KIDS_ID_TOKENS = ["kids", "kid", "children", "child", "level"];
const KIDS_DOMAIN_KEYWORDS = ["kids", "children", "kid", "child"];

export function isKidsDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  if (roomId) {
    const tokens = tokenizeId(roomId);
    // "kids_level_1_room" => includes "kids" and "level"
    if (includesAnyToken(tokens, KIDS_ID_TOKENS)) {
      // require "kids" or "kid" specifically to avoid accidental "level" hits elsewhere
      if (tokens.includes("kids") || tokens.includes("kid")) return true;
    }
    if (tokens.includes("kids")) return true;
  }

  const domain = roomDomain ? normalizeText(roomDomain) : "";
  if (
    domain &&
    includesAnySubstr(domain, KIDS_DOMAIN_KEYWORDS.map(normalizeText))
  )
    return true;

  if (tags?.length) {
    for (const t of tags) {
      const tag = normalizeText(String(t));
      if (includesAnySubstr(tag, ["kids", "kid", "children", "child"]))
        return true;
    }
  }

  return false;
}

// ---------------------------------
// MARTIAL domain detection (test-backed)
// ---------------------------------

const MARTIAL_ID_TOKENS = [
  "martial",
  "combat",
  "dojo",
  "academy",
  "boxing",
  "bjj",
  "jiu",
  "jiujitsu",
  "karate",
  "taekwondo",
  "tkd",
  "muay",
  "thai",
  "krav",
  "judo",
  "kendo",
  "fencing",
  "sword",
  "kung",
  "fu",
  "kungfu",
  "wushu",
  "samurai", // ✅ test-backed: samurai_mindset
];

const MARTIAL_DOMAIN_KEYWORDS = [
  "martial",
  "martial arts",
  "combat",
  "dojo",
  "academy",
  "self defense",
  "self-defence",
  "self defence",
  "self protection",
  "self-protection",
  "sparring",
  "kung fu", // ✅ test-backed: "Kung Fu Academy"
  "kungfu",
  "wushu",
  "samurai",
  "karate",
  "taekwondo",
  "tkd",
  "muay thai",
  "kickboxing",
  "kick boxing",
  "boxing",
  "jiu jitsu",
  "jiujitsu",
  "bjj",
  "brazilian jiu jitsu",
  "grappling",
  "wrestling",
  "judo",
  "aikido",
  "krav maga",
  "kendo",
  "fencing",
  "sword",
  "swords",
];

const MARTIAL_TAG_KEYWORDS = [
  "martial",
  "combat",
  "dojo",
  "academy",
  "kung fu",
  "kungfu",
  "wushu",
  "samurai",
  "karate",
  "taekwondo",
  "boxing",
  "bjj",
  "jiu jitsu",
  "jiu-jitsu",
  "muay thai",
  "muaythai",
  "self defense",
  "self-defense",
  "krav",
  "judo",
  "kendo",
  "fencing",
  "sword",
];

export function isMartialDomain(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  if (roomId) {
    const tokens = tokenizeId(roomId);

    // token-based; allow combos like kung + fu
    if (includesAnyToken(tokens, MARTIAL_ID_TOKENS)) return true;
    if (tokens.includes("kung") && tokens.includes("fu")) return true;
  }

  const domain = roomDomain ? normalizeText(roomDomain) : "";
  if (
    domain &&
    includesAnySubstr(domain, MARTIAL_DOMAIN_KEYWORDS.map(normalizeText))
  )
    return true;

  if (tags?.length) {
    for (const t of tags) {
      const tag = normalizeText(String(t));
      if (
        includesAnySubstr(tag, MARTIAL_TAG_KEYWORDS.map(normalizeText))
      )
        return true;
    }
  }

  return false;
}

// ---------------------------------
// Category router (test-backed)
// ---------------------------------

export function getDomainCategory(
  roomId?: string | null,
  roomDomain?: string | null,
  tags?: string[] | null
): DomainCategory {
  // Order matters.
  // - kids should win for kids rooms
  // - english/health/strategy should not be polluted by substring collisions
  if (isKidsDomain(roomId, roomDomain, tags)) return "kids";
  if (isEnglishDomain(roomId, roomDomain, tags)) return "english";
  if (isHealthDomain(roomId, roomDomain, tags)) return "health";
  if (isStrategyDomain(roomId, roomDomain, tags)) return "strategy";
  if (isMartialDomain(roomId, roomDomain, tags)) return "martial";
  return "other";
}