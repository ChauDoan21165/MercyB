/**
 * File: mercyMemoryRoutes.ts
 * Path: server/routes/mercyMemoryRoutes.ts
 */

import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

console.log('✅ mercyMemoryRoutes file loaded');

const router = express.Router();

type MercyLogicPatternMemory = {
  key: string;
  label: string;
  count: number;
  lastSeenAt: string;
};

type StudentMercyMemory = {
  userKey: string;
  writing: {
    patterns: string[];
    strengths: string[];
    currentFocus: string[];
    recurringTopics?: string[];
    commonWritingModes?: string[];
    lastSubmittedText?: string;
    lastCorrectedText?: string;
    lastEnhancedText?: string;
  };
  logic: {
    vietlishPatterns: MercyLogicPatternMemory[];
    bridgesLearned: string[];
    currentLogicFocus: string[];
  };
  pronunciation: {
    troubleWords: string[];
    soundPatterns?: string[];
    confidenceLevel?: 'low' | 'medium' | 'high';
    lastPracticeLine?: string;
  };
  coaching: {
    preferredPromptStyle?: 'mood' | 'daily_event' | 'reflection' | 'mixed';
    preferredFeedbackStyle?: 'gentle' | 'direct' | 'detailed';
  };
  updatedAt: string;
};

type MemoryStore = Record<string, StudentMercyMemory>;

type MercyMemoryPostBody = {
  userKey?: string;
  memory?: Partial<StudentMercyMemory> & {
    lastSentence?: string;
    notes?: string[];
  };
  lastSentence?: string;
  notes?: string[];
};

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_PATH = path.join(DATA_DIR, 'mercy-memory.json');

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function buildEmptyMemory(userKey: string): StudentMercyMemory {
  return {
    userKey,
    writing: {
      patterns: [],
      strengths: [],
      currentFocus: [],
      recurringTopics: [],
      commonWritingModes: [],
      lastSubmittedText: '',
      lastCorrectedText: '',
      lastEnhancedText: '',
    },
    logic: {
      vietlishPatterns: [],
      bridgesLearned: [],
      currentLogicFocus: [],
    },
    pronunciation: {
      troubleWords: [],
      soundPatterns: [],
      confidenceLevel: 'medium',
      lastPracticeLine: '',
    },
    coaching: {
      preferredPromptStyle: 'mixed',
      preferredFeedbackStyle: 'gentle',
    },
    updatedAt: new Date().toISOString(),
  };
}

function normalizeStringArray(value: unknown, max = 20): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of value) {
    const text = cleanText(item);
    if (!text) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    out.push(text);

    if (out.length >= max) break;
  }

  return out;
}

function mergeStringArrays(...values: unknown[]): string[] {
  const merged: string[] = [];

  for (const value of values) {
    if (!Array.isArray(value)) continue;

    for (const item of value) {
      const text = cleanText(item);
      if (text) {
        merged.push(text);
      }
    }
  }

  return normalizeStringArray(merged, 50);
}

function normalizeLogicPatterns(value: unknown): MercyLogicPatternMemory[] {
  if (!Array.isArray(value)) return [];

  const map = new Map<string, MercyLogicPatternMemory>();

  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;

    const item = raw as Partial<MercyLogicPatternMemory>;
    const key = cleanText(item.key).toLowerCase();
    const label = cleanText(item.label);

    if (!key || !label) continue;

    const count =
      typeof item.count === 'number' && Number.isFinite(item.count) && item.count > 0
        ? Math.floor(item.count)
        : 1;

    const lastSeenAt = cleanText(item.lastSeenAt) || new Date().toISOString();

    const existing = map.get(key);
    if (existing) {
      map.set(key, {
        ...existing,
        label,
        count: Math.max(existing.count, count),
        lastSeenAt:
          existing.lastSeenAt > lastSeenAt ? existing.lastSeenAt : lastSeenAt,
      });
      continue;
    }

    map.set(key, {
      key,
      label,
      count,
      lastSeenAt,
    });
  }

  return Array.from(map.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    })
    .slice(0, 20);
}

function normalizeMemory(
  userKey: string,
  raw?: Partial<StudentMercyMemory> | null,
): StudentMercyMemory {
  const base = buildEmptyMemory(userKey);
  const memory = raw ?? {};

  return {
    userKey,
    writing: {
      ...base.writing,
      ...(memory.writing ?? {}),
      patterns: normalizeStringArray(memory.writing?.patterns, 20),
      strengths: normalizeStringArray(memory.writing?.strengths, 20),
      currentFocus: normalizeStringArray(memory.writing?.currentFocus, 12),
      recurringTopics: normalizeStringArray(memory.writing?.recurringTopics, 12),
      commonWritingModes: normalizeStringArray(memory.writing?.commonWritingModes, 8),
      lastSubmittedText: cleanText(memory.writing?.lastSubmittedText),
      lastCorrectedText: cleanText(memory.writing?.lastCorrectedText),
      lastEnhancedText: cleanText(memory.writing?.lastEnhancedText),
    },
    logic: {
      ...base.logic,
      ...(memory.logic ?? {}),
      vietlishPatterns: normalizeLogicPatterns(memory.logic?.vietlishPatterns),
      bridgesLearned: normalizeStringArray(memory.logic?.bridgesLearned, 20),
      currentLogicFocus: normalizeStringArray(memory.logic?.currentLogicFocus, 12),
    },
    pronunciation: {
      ...base.pronunciation,
      ...(memory.pronunciation ?? {}),
      troubleWords: normalizeStringArray(memory.pronunciation?.troubleWords, 20),
      soundPatterns: normalizeStringArray(memory.pronunciation?.soundPatterns, 20),
      confidenceLevel:
        memory.pronunciation?.confidenceLevel === 'low' ||
        memory.pronunciation?.confidenceLevel === 'medium' ||
        memory.pronunciation?.confidenceLevel === 'high'
          ? memory.pronunciation.confidenceLevel
          : 'medium',
      lastPracticeLine: cleanText(memory.pronunciation?.lastPracticeLine),
    },
    coaching: {
      ...base.coaching,
      ...(memory.coaching ?? {}),
      preferredPromptStyle:
        memory.coaching?.preferredPromptStyle === 'mood' ||
        memory.coaching?.preferredPromptStyle === 'daily_event' ||
        memory.coaching?.preferredPromptStyle === 'reflection' ||
        memory.coaching?.preferredPromptStyle === 'mixed'
          ? memory.coaching.preferredPromptStyle
          : 'mixed',
      preferredFeedbackStyle:
        memory.coaching?.preferredFeedbackStyle === 'gentle' ||
        memory.coaching?.preferredFeedbackStyle === 'direct' ||
        memory.coaching?.preferredFeedbackStyle === 'detailed'
          ? memory.coaching.preferredFeedbackStyle
          : 'gentle',
    },
    updatedAt: cleanText(memory.updatedAt) || new Date().toISOString(),
  };
}

function mergeMemory(
  existing: StudentMercyMemory,
  incoming?: Partial<StudentMercyMemory> | null,
): Partial<StudentMercyMemory> {
  const next = incoming ?? {};

  return {
    ...existing,
    ...next,
    userKey: existing.userKey,
    writing: {
      ...existing.writing,
      ...(next.writing ?? {}),
      patterns: mergeStringArrays(existing.writing.patterns, next.writing?.patterns),
      strengths: mergeStringArrays(existing.writing.strengths, next.writing?.strengths),
      currentFocus: mergeStringArrays(
        existing.writing.currentFocus,
        next.writing?.currentFocus,
      ),
      recurringTopics: mergeStringArrays(
        existing.writing.recurringTopics,
        next.writing?.recurringTopics,
      ),
      commonWritingModes: mergeStringArrays(
        existing.writing.commonWritingModes,
        next.writing?.commonWritingModes,
      ),
      lastSubmittedText:
        cleanText(next.writing?.lastSubmittedText) || existing.writing.lastSubmittedText,
      lastCorrectedText:
        cleanText(next.writing?.lastCorrectedText) || existing.writing.lastCorrectedText,
      lastEnhancedText:
        cleanText(next.writing?.lastEnhancedText) || existing.writing.lastEnhancedText,
    },
    logic: {
      ...existing.logic,
      ...(next.logic ?? {}),
      vietlishPatterns: [
        ...(existing.logic.vietlishPatterns ?? []),
        ...((next.logic?.vietlishPatterns as MercyLogicPatternMemory[] | undefined) ?? []),
      ],
      bridgesLearned: mergeStringArrays(
        existing.logic.bridgesLearned,
        next.logic?.bridgesLearned,
      ),
      currentLogicFocus: mergeStringArrays(
        existing.logic.currentLogicFocus,
        next.logic?.currentLogicFocus,
      ),
    },
    pronunciation: {
      ...existing.pronunciation,
      ...(next.pronunciation ?? {}),
      troubleWords: mergeStringArrays(
        existing.pronunciation.troubleWords,
        next.pronunciation?.troubleWords,
      ),
      soundPatterns: mergeStringArrays(
        existing.pronunciation.soundPatterns,
        next.pronunciation?.soundPatterns,
      ),
      confidenceLevel:
        next.pronunciation?.confidenceLevel ?? existing.pronunciation.confidenceLevel,
      lastPracticeLine:
        cleanText(next.pronunciation?.lastPracticeLine) ||
        existing.pronunciation.lastPracticeLine,
    },
    coaching: {
      ...existing.coaching,
      ...(next.coaching ?? {}),
      preferredPromptStyle:
        next.coaching?.preferredPromptStyle ?? existing.coaching.preferredPromptStyle,
      preferredFeedbackStyle:
        next.coaching?.preferredFeedbackStyle ?? existing.coaching.preferredFeedbackStyle,
    },
    updatedAt: new Date().toISOString(),
  };
}

function coerceLegacyMemoryPayload(
  body: MercyMemoryPostBody,
): Partial<StudentMercyMemory> {
  const memory = body.memory ?? {};
  const lastSentence = cleanText(memory.lastSentence ?? body.lastSentence);
  const notes = normalizeStringArray(memory.notes ?? body.notes, 12);

  return {
    ...memory,
    writing: {
      ...(memory.writing ?? {}),
      ...(lastSentence ? { lastSubmittedText: lastSentence } : {}),
    },
    logic: {
      ...(memory.logic ?? {}),
      ...(notes.length
        ? {
            currentLogicFocus: [
              ...((memory.logic?.currentLogicFocus as string[] | undefined) ?? []),
              ...notes,
            ],
          }
        : {}),
    },
  };
}

async function ensureStoreExists(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({}, null, 2), 'utf8');
  }
}

async function readStore(): Promise<MemoryStore> {
  await ensureStoreExists();

  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as MemoryStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: MemoryStore): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

router.get('/api/mercy/memory', async (req: Request, res: Response) => {
  console.log('📥 GET /api/mercy/memory', {
    userKey: cleanText(req.query.userKey),
  });

  try {
    const userKey = cleanText(req.query.userKey);

    if (!userKey) {
      return res.status(400).json({
        error: 'Missing required query parameter: userKey',
      });
    }

    const store = await readStore();
    const memory = store[userKey]
      ? normalizeMemory(userKey, store[userKey])
      : buildEmptyMemory(userKey);

    return res.status(200).json({ memory });
  } catch (error) {
    console.error('GET /api/mercy/memory failed:', error);
    return res.status(500).json({
      error: 'Failed to load Mercy memory',
    });
  }
});

router.post('/api/mercy/memory', async (req: Request, res: Response) => {
  console.log('📤 POST /api/mercy/memory', {
    userKey: cleanText((req.body as { userKey?: string })?.userKey),
  });

  try {
    const body = req.body as MercyMemoryPostBody;

    const userKey = cleanText(body?.userKey || body?.memory?.userKey);

    if (!userKey) {
      return res.status(400).json({
        error: 'Missing required field: userKey',
      });
    }

    const store = await readStore();
    const existing = store[userKey]
      ? normalizeMemory(userKey, store[userKey])
      : buildEmptyMemory(userKey);

    const incoming = coerceLegacyMemoryPayload(body);
    const merged = mergeMemory(existing, {
      ...incoming,
      userKey,
      updatedAt: new Date().toISOString(),
    });

    const normalized = normalizeMemory(userKey, merged);

    store[userKey] = normalized;
    await writeStore(store);

    return res.status(200).json({
      ok: true,
      memory: normalized,
    });
  } catch (error) {
    console.error('POST /api/mercy/memory failed:', error);
    return res.status(500).json({
      error: 'Failed to save Mercy memory',
    });
  }
});

export default router;