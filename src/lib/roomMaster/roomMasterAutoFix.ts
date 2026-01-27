// RoomMaster Auto-Fix Engine - Repairs common JSON issues automatically

import type { RoomJson, AutoFixResult } from "./roomMasterTypes";
import { RULES, normalizeTier } from "./roomMasterRules";

export function autoFixRoom(room: RoomJson): AutoFixResult {
  const changesApplied: string[] = [];
  let repairedRoom = JSON.parse(JSON.stringify(room)); // Deep clone

  // TS NOTE:
  // RULES.TIER.NORMALIZE_MAP is `as const` (no string index signature).
  // For runtime normalization we intentionally treat it as a string->string map.
  const tierMap = RULES.TIER.NORMALIZE_MAP as unknown as Record<string, string | undefined>;

  // Fix 1: Normalize tier
  if (typeof room.tier === "string") {
    const mapped = tierMap[room.tier];
    if (!mapped) {
      const normalized = normalizeTier(room.tier);
      if (normalized) {
        repairedRoom.tier = normalized;
        changesApplied.push(`Fixed tier: "${room.tier}" → "${normalized}"`);
      }
    } else if (mapped !== room.tier) {
      repairedRoom.tier = mapped;
      changesApplied.push(`Normalized tier: "${room.tier}" → "${mapped}"`);
    }
  }

  // Fix 2: Fix slugs to kebab-case
  if (repairedRoom.entries && Array.isArray(repairedRoom.entries)) {
    repairedRoom.entries = repairedRoom.entries.map((entry: any, index: number) => {
      if (entry?.slug && typeof entry.slug === "string" && !RULES.SLUG.PATTERN.test(entry.slug)) {
        const fixedSlug = entry.slug
          .toLowerCase()
          .replace(/_/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        if (fixedSlug !== entry.slug) {
          changesApplied.push(`Fixed slug in entry ${index}: "${entry.slug}" → "${fixedSlug}"`);
          return { ...entry, slug: fixedSlug };
        }
      }
      return entry;
    });
  }

  // Fix 3: Normalize audio filenames (remove "_vip9" if room ID doesn't have it)
  if (repairedRoom.entries && Array.isArray(repairedRoom.entries)) {
    repairedRoom.entries = repairedRoom.entries.map((entry: any, index: number) => {
      const audio = entry?.audio;
      if (
        typeof audio === "string" &&
        audio.includes("vip9") &&
        typeof repairedRoom.id === "string" &&
        !repairedRoom.id.includes("vip9")
      ) {
        const fixedAudio = audio.replace("_vip9", "");
        if (fixedAudio !== audio) {
          changesApplied.push(`Fixed audio in entry ${index}: "${audio}" → "${fixedAudio}"`);
          return { ...entry, audio: fixedAudio };
        }
      }
      return entry;
    });
  }

  // Fix 4: Add missing bilingual fields
  if (!repairedRoom.title) {
    repairedRoom.title = { en: repairedRoom.id, vi: repairedRoom.id };
    changesApplied.push("Added missing bilingual title");
  } else if (!repairedRoom.title.vi && repairedRoom.title.en) {
    repairedRoom.title.vi = repairedRoom.title.en;
    changesApplied.push("Added missing Vietnamese title");
  } else if (!repairedRoom.title.en && repairedRoom.title.vi) {
    repairedRoom.title.en = repairedRoom.title.vi;
    changesApplied.push("Added missing English title");
  }

  // Fix 5: Normalize whitespace and punctuation
  repairedRoom = normalizeWhitespace(repairedRoom, changesApplied);

  // Fix 6: Rebuild keywords if missing
  repairedRoom = rebuildKeywordsIfMissing(repairedRoom, changesApplied);

  // Fix 7: Add safety disclaimers if required and missing
  const tierLabel = typeof repairedRoom.tier === "string" ? repairedRoom.tier : "";
  const tierNorm = tierLabel ? normalizeTier(tierLabel) : null;

  // REQUIRED_FOR_TIERS is `as const` (string literals). Compare as strings.
  const required = RULES.SAFETY.REQUIRED_FOR_TIERS as readonly string[];
  if (tierNorm && required.includes(tierNorm as unknown as string)) {
    if (!repairedRoom.safety_disclaimer) {
      repairedRoom.safety_disclaimer = {
        en: RULES.SAFETY.DEFAULT_EN,
        vi: RULES.SAFETY.DEFAULT_VI,
      };
      changesApplied.push("Added missing safety disclaimer");
    }
  }

  // Fix 8: Rebuild All-Entry if missing or incorrect
  repairedRoom = rebuildAllEntry(repairedRoom, changesApplied);

  const fixed = changesApplied.length > 0;

  return {
    fixed,
    repairedRoom,
    changesApplied,
    remainingErrors: [], // Will be filled by roomMaster validation
  };
}

function normalizeWhitespace(room: RoomJson, changes: string[]): RoomJson {
  const normalized = JSON.parse(JSON.stringify(room));

  // Normalize entry copy
  if (normalized.entries && Array.isArray(normalized.entries)) {
    normalized.entries = normalized.entries.map((entry: any, index: number) => {
      if (entry?.copy?.en && typeof entry.copy.en === "string") {
        const cleaned = entry.copy.en
          .replace(/\s+/g, " ") // Multiple spaces → single space
          .replace(/\.\.\./g, "…") // ... → …
          .replace(/([.!?])\s*([A-Z])/g, "$1 $2") // Fix sentence spacing
          .trim();

        if (cleaned !== entry.copy.en) {
          changes.push(`Normalized whitespace in entry ${index} (EN)`);
          entry.copy.en = cleaned;
        }
      }

      if (entry?.copy?.vi && typeof entry.copy.vi === "string") {
        const cleaned = entry.copy.vi
          .replace(/\s+/g, " ")
          .replace(/\.\.\./g, "…")
          .trim();

        if (cleaned !== entry.copy.vi) {
          changes.push(`Normalized whitespace in entry ${index} (VI)`);
          entry.copy.vi = cleaned;
        }
      }

      return entry;
    });
  }

  return normalized;
}

function rebuildKeywordsIfMissing(room: RoomJson, changes: string[]): RoomJson {
  const rebuilt = JSON.parse(JSON.stringify(room));

  if (rebuilt.entries && Array.isArray(rebuilt.entries)) {
    rebuilt.entries = rebuilt.entries.map((entry: any, index: number) => {
      // If keywords are missing or empty, extract from copy
      if (!entry.keywords_en || entry.keywords_en.length === 0) {
        const extracted = extractKeywordsFromText(entry.copy?.en || "", 3, 5);
        if (extracted.length > 0) {
          entry.keywords_en = extracted;
          changes.push(`Rebuilt EN keywords for entry ${index}`);
        }
      }

      if (!entry.keywords_vi || entry.keywords_vi.length === 0) {
        const extracted = extractKeywordsFromText(entry.copy?.vi || "", 3, 5);
        if (extracted.length > 0) {
          entry.keywords_vi = extracted;
          changes.push(`Rebuilt VI keywords for entry ${index}`);
        }
      }

      return entry;
    });
  }

  return rebuilt;
}

function extractKeywordsFromText(text: string, _min: number, max: number): string[] {
  // Simple keyword extraction: take first few words from first sentence
  const words = text
    .split(/[.!?]/)[0] // First sentence
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w: string) => w.length > 3); // Only words > 3 chars

  return words.slice(0, Math.min(words.length, max));
}

function rebuildAllEntry(room: RoomJson, changes: string[]): RoomJson {
  if (!room.entries || !Array.isArray(room.entries) || room.entries.length === 0) {
    return room;
  }

  const lastEntry = room.entries[room.entries.length - 1];

  // Check if last entry is "all-entry"
  if (lastEntry.slug !== RULES.ALL_ENTRY.SLUG) {
    // All-entry missing - we don't auto-create it as it's complex
    return room;
  }

  // Rebuild all-entry content by concatenating all previous entries
  const allEntriesExceptLast = room.entries.slice(0, -1);

  const concatenatedEN = allEntriesExceptLast
    .map((e: any, i: number) => `${i + 1}. ${e.copy?.en || ""}`)
    .join("\n\n");

  const concatenatedVI = allEntriesExceptLast
    .map((e: any, i: number) => `${i + 1}. ${e.copy?.vi || ""}`)
    .join("\n\n");

  if (lastEntry.copy?.en !== concatenatedEN || lastEntry.copy?.vi !== concatenatedVI) {
    room.entries[room.entries.length - 1] = {
      ...lastEntry,
      copy: {
        en: concatenatedEN,
        vi: concatenatedVI,
      },
    };
    changes.push("Rebuilt all-entry content");
  }

  return room;
}
