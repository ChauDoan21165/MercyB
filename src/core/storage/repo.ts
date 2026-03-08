/**
 * FILE: src/core/storage/repo.ts
 * VERSION: repo.ts v1.2
 *
 * Purpose:
 * - Simple persistence layer (localStorage-based)
 * - Central place for reading/writing user progress + sessions
 * - Can later swap to Supabase / server without breaking UI
 */

import type { UserProgress, Session } from "../types/session";
import type {
  GateDefinition,
  LevelDefinition,
  LevelsIndex,
  Module,
} from "../types/curriculum";

const KEYS = {
  USER_PROGRESS: "mb_user_progress",
  SESSIONS: "mb_sessions",
};

function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function safeJSONParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  if (!hasLocalStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function load<T>(key: string, fallback: T): T {
  if (!hasLocalStorage()) return fallback;
  return safeJSONParse<T>(localStorage.getItem(key), fallback);
}

function remove(key: string): void {
  if (!hasLocalStorage()) return;
  localStorage.removeItem(key);
}

// -------------------------------------------------
// USER PROGRESS
// -------------------------------------------------

export function loadUserProgress(): UserProgress | null {
  return load<UserProgress | null>(KEYS.USER_PROGRESS, null);
}

export function saveUserProgress(progress: UserProgress): void {
  save(KEYS.USER_PROGRESS, progress);
}

export function clearUserProgress(): void {
  remove(KEYS.USER_PROGRESS);
}

// -------------------------------------------------
// SESSIONS
// -------------------------------------------------

export function loadSessions(): Session[] {
  return load<Session[]>(KEYS.SESSIONS, []);
}

export function saveSession(session: Session): void {
  const sessions = loadSessions();
  sessions.push(session);
  save(KEYS.SESSIONS, sessions);
}

export function clearSessions(): void {
  remove(KEYS.SESSIONS);
}

// -------------------------------------------------
// CURRICULUM (STATIC IMPORT)
// -------------------------------------------------

type LegacyPrompt = Record<string, unknown>;

type LegacyLevelModule = {
  moduleId?: string;
  moduleKey?: string;
  title?: string;
  drills?: unknown[];
  prompts?: LegacyPrompt[];
  [key: string]: unknown;
};

type LegacyLevelDefinition = {
  levelId?: number;
  level?: number;
  title?: string;
  description?: string;
  focus?: string;
  gate?: unknown;
  targets?: unknown;
  modules?: LegacyLevelModule[];
  mercyHostRules?: unknown[];
  [key: string]: unknown;
};

type LegacyLevelsIndex = {
  levels?: Array<{
    levelId?: number;
    level?: number;
    title?: string;
    name?: string;
    shortDescription?: string;
    unlock?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

function normalizeGate(rawGate: unknown): GateDefinition {
  if (rawGate && typeof rawGate === "object") {
    const gate = rawGate as {
      minAttempts?: unknown;
      minAverage?: unknown;
      minPerSkill?: unknown;
    };

    return {
      minAttempts:
        typeof gate.minAttempts === "number" ? gate.minAttempts : 1,
      minAverage:
        typeof gate.minAverage === "number" ? gate.minAverage : 0,
      minPerSkill:
        gate.minPerSkill && typeof gate.minPerSkill === "object"
          ? (gate.minPerSkill as GateDefinition["minPerSkill"])
          : {},
    };
  }

  return {
    minAttempts: 1,
    minAverage: 0,
    minPerSkill: {},
  };
}

function normalizeModules(rawModules: LegacyLevelModule[] | undefined): Module[] {
  if (!Array.isArray(rawModules)) return [];

  return rawModules.map((mod, index) => {
    const prompts = Array.isArray(mod.prompts) ? mod.prompts : [];
    const drills = Array.isArray(mod.drills) ? mod.drills : prompts;

    return {
      moduleId:
        typeof mod.moduleId === "string" && mod.moduleId.trim()
          ? mod.moduleId
          : typeof mod.moduleKey === "string" && mod.moduleKey.trim()
            ? mod.moduleKey
            : `module_${index + 1}`,
      title:
        typeof mod.title === "string" && mod.title.trim()
          ? mod.title
          : `Module ${index + 1}`,
      drills,
    } as Module;
  });
}

function normalizeLevelDefinition(
  raw: LegacyLevelDefinition,
  levelId: number
): LevelDefinition {
  return {
    levelId,
    title:
      typeof raw.title === "string" && raw.title.trim()
        ? raw.title
        : typeof raw.focus === "string" && raw.focus.trim()
          ? `Level ${levelId} - ${raw.focus}`
          : `Level ${levelId}`,
    description:
      typeof raw.description === "string" && raw.description.trim()
        ? raw.description
        : typeof raw.focus === "string" && raw.focus.trim()
          ? raw.focus
          : `Training content for level ${levelId}.`,
    gate: normalizeGate(raw.gate),
    modules: normalizeModules(raw.modules),
  };
}

function normalizeLevelsIndex(raw: LegacyLevelsIndex): LevelsIndex {
  const levels = Array.isArray(raw.levels) ? raw.levels : [];

  return {
    levels: levels.map((item, index) => {
      const levelId =
        typeof item.levelId === "number"
          ? item.levelId
          : typeof item.level === "number"
            ? item.level
            : index + 1;

      const title =
        typeof item.title === "string" && item.title.trim()
          ? item.title
          : typeof item.name === "string" && item.name.trim()
            ? item.name
            : `Level ${levelId}`;

      const shortDescription =
        typeof item.shortDescription === "string" && item.shortDescription.trim()
          ? item.shortDescription
          : typeof item.unlock === "string" && item.unlock.trim()
            ? item.unlock
            : `Level ${levelId} curriculum`;

      return {
        levelId,
        title,
        shortDescription,
      };
    }),
  };
}

// IMPORTANT:
// In Vite/React you can import JSON directly.

export async function loadLevel(levelId: number): Promise<LevelDefinition> {
  switch (levelId) {
    case 1: {
      const raw = (await import("../curriculum/level_1.json"))
        .default as LegacyLevelDefinition;
      return normalizeLevelDefinition(raw, 1);
    }
    case 2: {
      const raw = (await import("../curriculum/level_2.json"))
        .default as LegacyLevelDefinition;
      return normalizeLevelDefinition(raw, 2);
    }
    default:
      throw new Error(`Level ${levelId} not found`);
  }
}

export async function loadLevelsIndex(): Promise<LevelsIndex> {
  const raw = (await import("../curriculum/levels.json"))
    .default as LegacyLevelsIndex;
  return normalizeLevelsIndex(raw);
}