// FILE: martialCoach.ts
// PATH: src/lib/mercy-host/martialCoach.ts
// VERSION: MB-BLUE-MARTIAL-COACH-1.0.7 — 2026-02-25 (+0700)
//
// Fix:
// - Domain detection for roomDomain strings must include "Kung Fu" (test-backed).
// - Keep matching broad but safe: normalize case/spacing/diacritics.
// - Keep exports stable for existing tests: isMartialDomain, getDomainCategory,
//   getMartialCoachTip, inferMartialDiscipline.

export type DomainCategory = "martial" | "general";

export type MartialDiscipline =
  | "martial"
  | "boxing"
  | "karate"
  | "bjj"
  | "sword"
  | "taekwondo"
  | "muay_thai"
  | "judo"
  | "krav_maga";

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    // strip diacritics
    .replace(/[\u0300-\u036f]/g, "")
    // ✅ harden whitespace normalization (handles NBSP and other unicode spaces)
    .replace(/[\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    // unify separators
    .replace(/[_\s]+/g, " ")
    .trim();
}

function includesAny(haystack: string, needles: string[]): boolean {
  for (const n of needles) {
    if (haystack.includes(n)) return true;
  }
  return false;
}

const MARTIAL_KEYWORDS = [
  // general
  "martial",
  "martial arts",
  "combat",
  "dojo",
  "academy",
  "self defense",
  "self-defence",
  "self defence",
  "self-protection",
  "self protection",
  "sparring",

  // ✅ test-backed: "Kung Fu Academy"
  "kung fu",

  // common disciplines
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
  "kungfu",
  "kung fu",
  "karate",
  "taekwondo",
  "boxing",
  "bjj",
  "jiu-jitsu",
  "jiu jitsu",
  "muaythai",
  "muay thai",
  "self-defense",
  "self defense",
  "krav",
  "judo",
  "fencing",
  "sword",
];

/**
 * Detect if the content belongs to the martial domain.
 * Supports detection by roomId, roomDomain (title/category), and tags.
 */
export function isMartialDomain(
  roomId: string | null | undefined,
  roomDomain?: string | null,
  tags?: string[] | null
): boolean {
  const id = roomId ? normalizeText(roomId).replace(/\s+/g, "_") : "";
  const domain = roomDomain ? normalizeText(roomDomain) : "";

  if (id) {
    // fast path for ids that often contain category tokens
    if (
      includesAny(id, [
        "martial",
        "combat",
        "dojo",
        "kung_fu",
        "kungfu",
        "karate",
        "taekwondo",
        "boxing",
        "bjj",
        "jiu",
        "muay_thai",
        "krav",
        "judo",
        "kendo",
        "fencing",
        "sword",
      ])
    ) {
      return true;
    }
  }

  if (domain) {
    // ✅ this is where "Kung Fu Academy" must match
    if (includesAny(domain, MARTIAL_KEYWORDS)) return true;
  }

  if (tags && tags.length > 0) {
    for (const t of tags) {
      const nt = normalizeText(String(t));
      if (includesAny(nt, MARTIAL_TAG_KEYWORDS)) return true;
    }
  }

  return false;
}

/**
 * Higher-level category helper used by the coach.
 */
export function getDomainCategory(
  roomId: string | null | undefined,
  roomDomain?: string | null,
  tags?: string[] | null
): DomainCategory {
  return isMartialDomain(roomId, roomDomain, tags) ? "martial" : "general";
}

function inferFromText(text: string): MartialDiscipline {
  const t = normalizeText(text);

  if (includesAny(t, ["fencing", "kendo", "sword", "swords"])) return "sword";
  if (includesAny(t, ["boxing", "kickboxing", "kick boxing"])) return "boxing";
  if (includesAny(t, ["bjj", "brazilian jiu jitsu", "jiu jitsu", "jiujitsu", "grappling"]))
    return "bjj";
  if (includesAny(t, ["karate"])) return "karate";
  if (includesAny(t, ["taekwondo", "tkd"])) return "taekwondo";
  if (includesAny(t, ["muay thai"])) return "muay_thai";
  if (includesAny(t, ["judo"])) return "judo";
  if (includesAny(t, ["krav maga"])) return "krav_maga";

  return "martial";
}

/**
 * Infer martial discipline from room metadata.
 */
export function inferMartialDiscipline(
  roomId: string | null | undefined,
  roomDomain?: string | null,
  tags?: string[] | null
): MartialDiscipline {
  const parts: string[] = [];
  if (roomId) parts.push(roomId);
  if (roomDomain) parts.push(roomDomain);
  if (tags?.length) parts.push(tags.join(" "));

  return inferFromText(parts.join(" "));
}

function stablePick<T>(items: T[], seed: string): T {
  if (items.length === 1) return items[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[h % items.length];
}

function normalizeCoachLevel(level: unknown): "off" | "gentle" | "active" {
  if (level == null) return "off";
  if (typeof level === "number") return level <= 0 ? "off" : level === 1 ? "gentle" : "active";
  const s = normalizeText(String(level));
  if (s === "off" || s === "0" || s === "false" || s === "disabled") return "off";
  if (s === "gentle" || s === "soft" || s === "low" || s === "1") return "gentle";
  return "active";
}

/**
 * Return a short martial coach tip.
 * - Returns "" when level is off.
 * - Replaces {{name}} placeholder with userName.
 * - Guaranteed <= 140 chars.
 */
export function getMartialCoachTip(opts: {
  coachLevel?: unknown;
  userName?: string | null;
  roomId?: string | null;
  roomDomain?: string | null;
  tags?: string[] | null;
}): string {
  const level = normalizeCoachLevel(opts.coachLevel);
  if (level === "off") return "";

  const name = (opts.userName ?? "").trim() || "friend";
  const discipline = inferMartialDiscipline(opts.roomId ?? null, opts.roomDomain ?? null, opts.tags ?? null);

  const gentleTips: Record<MartialDiscipline, string[]> = {
    martial: [
      "Hi {{name}} — slow breaths. Choose one small drill and do it cleanly.",
      "Small wins, {{name}}. One technique, 3 reps, then rest.",
    ],
    boxing: [
      "{{name}}, light hands today: jab–cross, then reset your guard.",
      "Keep it easy, {{name}}: step, jab, breathe out on impact.",
    ],
    karate: [
      "{{name}}, focus on stance first—balance makes speed.",
      "Gentle kata energy, {{name}}: smooth motion, quiet power.",
    ],
    bjj: [
      "{{name}}, start with posture: spine tall, elbows in, breathe.",
      "Easy roll mindset, {{name}}: frames first, then move.",
    ],
    sword: [
      "{{name}}, slow is sharp: clean footwork before faster cuts.",
      "Hands relaxed, {{name}}—let the blade line do the work.",
    ],
    taekwondo: [
      "{{name}}, chamber cleanly—precision beats height today.",
      "Light bounce, {{name}}: snap the kick, then reset stance.",
    ],
    muay_thai: [
      "{{name}}, keep it smooth: teep for distance, then breathe.",
      "Relax shoulders, {{name}}—turn the hip, not the neck.",
    ],
    judo: [
      "{{name}}, break balance first—kuzushi before the throw.",
      "Soft hands, {{name}}: grip, step, off-balance, then commit.",
    ],
    krav_maga: [
      "{{name}}, keep it simple: create space, scan, move to safety.",
      "Short burst, {{name}}: protect head, exit line, breathe.",
    ],
  };

  const activeTips: Record<MartialDiscipline, string[]> = {
    martial: [
      "{{name}}, pick ONE technique: 5 perfect reps, then 5 fast reps.",
      "Quality rounds, {{name}}: timing > power. Stay crisp.",
    ],
    boxing: [
      "{{name}}, add a slip after the cross—hit, move, reset.",
      "Jab to set rhythm, {{name}}—then pivot out, don’t admire work.",
    ],
    karate: [
      "{{name}}, snap back to guard after every strike—no lingering.",
      "Drive from the floor, {{name}}: hip rotation makes it effortless.",
    ],
    bjj: [
      "{{name}}, win the grips, then pass—sequence beats scramble.",
      "Frames + angle, {{name}}: get to your hip before you push.",
    ],
    sword: [
      "{{name}}, cut on line—feet and blade arrive together.",
      "Measure, {{name}}: step to range, strike, exit—repeat.",
    ],
    taekwondo: [
      "{{name}}, feint first—make them react, then fire the kick.",
      "Reset fast, {{name}}: kick → land balanced → guard up.",
    ],
    muay_thai: [
      "{{name}}, set with jab/teep, then turn the hip through the roundhouse.",
      "Clinch posture, {{name}}: head up, elbows tight—control first.",
    ],
    judo: [
      "{{name}}, chain attacks: first throw creates the second.",
      "Step off-line, {{name}}: angle makes kuzushi easier.",
    ],
    krav_maga: [
      "{{name}}, explode then disengage—don’t stay in the pocket.",
      "Protect, strike, exit, {{name}}: the goal is distance and safety.",
    ],
  };

  const pool = level === "gentle" ? gentleTips[discipline] : activeTips[discipline];
  const raw = stablePick(pool, `${name}:${discipline}:${level}`);

  const rendered = raw.replace(/\{\{\s*name\s*\}\}/g, name);
  return rendered.length <= 140 ? rendered : rendered.slice(0, 140);
}