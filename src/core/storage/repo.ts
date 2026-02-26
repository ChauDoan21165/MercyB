// FILE: repo.ts
// PATH: src/core/storage/repo.ts
//
// Purpose:
// - Simple persistence layer (localStorage-based)
// - Central place for reading/writing user progress + sessions
// - Can later swap to Supabase / server without breaking UI

import type { UserProgress, Session } from "../types/session";
import type { LevelDefinition, LevelsIndex } from "../types/curriculum";

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

function save(key: string, value: unknown) {
  if (!hasLocalStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function load<T>(key: string, fallback: T): T {
  if (!hasLocalStorage()) return fallback;
  return safeJSONParse<T>(localStorage.getItem(key), fallback);
}

function remove(key: string) {
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

// IMPORTANT:
// In Vite/React you can import JSON directly.

export async function loadLevel(levelId: number): Promise<LevelDefinition> {
  switch (levelId) {
    case 1:
      return (await import("../curriculum/level_1.json")).default;
    case 2:
      return (await import("../curriculum/level_2.json")).default;
    default:
      throw new Error(`Level ${levelId} not found`);
  }
}

export async function loadLevelsIndex(): Promise<LevelsIndex> {
  return (await import("../curriculum/levels.json")).default;
}