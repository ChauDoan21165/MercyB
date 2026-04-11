// PATH: src/lib/roomKeywords.ts
/**
 * Room-specific keyword highlighting configuration
 * Loads custom keyword colors through the secure room loader.
 *
 * Compatibility:
 * - accepts raw room JSON
 * - accepts legacy wrapped payloads like { room: {...} }
 * - accepts highlighted_words from root, room, or meta
 */

import { CustomKeywordMapping } from "./keywordColors";
import { loadRoomJson } from "./roomJsonResolver";

export interface RoomKeywordConfig {
  highlighted_words?: {
    en?: string[];
    vi?: string[];
    color?: string;
  }[];
  room?: {
    highlighted_words?: {
      en?: string[];
      vi?: string[];
      color?: string;
    }[];
    meta?: {
      highlighted_words?: {
        en?: string[];
        vi?: string[];
        color?: string;
      }[];
    };
  };
  meta?: {
    highlighted_words?: {
      en?: string[];
      vi?: string[];
      color?: string;
    }[];
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function normalizeHighlightedWords(value: unknown): CustomKeywordMapping[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const record = item as {
        en?: unknown;
        vi?: unknown;
        color?: unknown;
      };

      if (typeof record.color !== "string" || !record.color.trim()) {
        return null;
      }

      return {
        en: isStringArray(record.en) ? record.en : [],
        vi: isStringArray(record.vi) ? record.vi : [],
        color: record.color.trim(),
      } satisfies CustomKeywordMapping;
    })
    .filter((item): item is CustomKeywordMapping => item !== null);
}

function unwrapRoomKeywordConfig(payload: unknown): RoomKeywordConfig | null {
  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, unknown>;
  const wrappedRoom = obj.room;

  if (wrappedRoom && typeof wrappedRoom === "object") {
    return payload as RoomKeywordConfig;
  }

  return payload as RoomKeywordConfig;
}

function extractHighlightedWords(config: RoomKeywordConfig | null): unknown {
  if (!config || typeof config !== "object") return [];

  return (
    config.highlighted_words ??
    config.room?.highlighted_words ??
    config.meta?.highlighted_words ??
    config.room?.meta?.highlighted_words ??
    []
  );
}

/**
 * Load keyword highlighting configuration from secure room data
 */
export async function loadRoomKeywords(roomId: string): Promise<CustomKeywordMapping[]> {
  try {
    const payload = await loadRoomJson(roomId);
    const config = unwrapRoomKeywordConfig(payload);

    if (!config || typeof config !== "object") {
      return [];
    }

    return normalizeHighlightedWords(extractHighlightedWords(config));
  } catch (error) {
    console.error(`Failed to load room keywords for ${roomId}:`, error);
    return [];
  }
}

/**
 * Generate default color palette for English learning rooms
 * These colors are optimized for readability and semantic meaning
 */
export const ENGLISH_LEARNING_COLORS = {
  // Grammar & Structure
  grammar: "#B8D4F1",
  structure: "#C8E6F5",
  syntax: "#A8E6F5",

  // Skills & Methods
  skill: "#90EE90",
  method: "#98FB98",
  technique: "#A8F0A8",

  // Learning Process
  practice: "#D8F0E6",
  learning: "#E0F5F8",
  training: "#D8F0F5",

  // Cognitive
  thinking: "#E0D8F5",
  processing: "#D9C8F0",
  cognitive: "#C4EAEA",

  // Performance
  fluency: "#FFE0CC",
  momentum: "#FFD8B8",
  productivity: "#FFF4D8",

  // Strategy
  strategy: "#D8F0F5",
  planning: "#E0F5F8",
  framework: "#C8E6F5",

  // Communication
  speaking: "#FFE0EC",
  expression: "#FFF8D8",
  communication: "#FFE0D8",

  // Key concepts
  important: "#FFD8E6",
  emphasis: "#FFE0ED",
  focus: "#A8C8E6",
};