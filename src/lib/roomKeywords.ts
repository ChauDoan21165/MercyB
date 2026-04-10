// src/lib/roomKeywords.ts
/**
 * Room-specific keyword highlighting configuration
 * Loads custom keyword colors through the secure room loader.
 */

import { CustomKeywordMapping } from "./keywordColors";
import { loadRoomJson } from "./roomJsonResolver";

export interface RoomKeywordConfig {
  highlighted_words?: {
    en?: string[];
    vi?: string[];
    color?: string;
  }[];
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
        color: record.color,
      } satisfies CustomKeywordMapping;
    })
    .filter((item): item is CustomKeywordMapping => item !== null);
}

/**
 * Load keyword highlighting configuration from secure room data
 */
export async function loadRoomKeywords(roomId: string): Promise<CustomKeywordMapping[]> {
  try {
    const json = (await loadRoomJson(roomId)) as RoomKeywordConfig | null;

    if (!json || typeof json !== "object") {
      return [];
    }

    return normalizeHighlightedWords(json.highlighted_words);
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
  grammar: "#B8D4F1", // Calm blue for grammar concepts
  structure: "#C8E6F5", // Light blue for structural elements
  syntax: "#A8E6F5", // Bright blue for syntax

  // Skills & Methods
  skill: "#90EE90", // Growth green for skills
  method: "#98FB98", // Fresh green for methods
  technique: "#A8F0A8", // Soft green for techniques

  // Learning Process
  practice: "#D8F0E6", // Calm green for practice
  learning: "#E0F5F8", // Cool blue-green for learning
  training: "#D8F0F5", // Light blue for training

  // Cognitive
  thinking: "#E0D8F5", // Purple for thinking
  processing: "#D9C8F0", // Soft purple for processing
  cognitive: "#C4EAEA", // Teal for cognitive

  // Performance
  fluency: "#FFE0CC", // Warm peach for fluency
  momentum: "#FFD8B8", // Light orange for momentum
  productivity: "#FFF4D8", // Bright yellow for productivity

  // Strategy
  strategy: "#D8F0F5", // Strategic blue
  planning: "#E0F5F8", // Planning blue-green
  framework: "#C8E6F5", // Framework blue

  // Communication
  speaking: "#FFE0EC", // Warm pink for speaking
  expression: "#FFF8D8", // Bright cream for expression
  communication: "#FFE0D8", // Warm coral for communication

  // Key concepts
  important: "#FFD8E6", // Highlight pink for key terms
  emphasis: "#FFE0ED", // Emphasis pink
  focus: "#A8C8E6", // Focus blue
};