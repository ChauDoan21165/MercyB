/**
 * File: useMercyMemory.ts
 * Path: src/components/mercy-guide/hooks/useMercyMemory.ts
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type {
  MercyLogicPatternMemory,
  StudentMercyMemory,
  StudentMercyMemoryUpdate,
  TeacherMemorySummaryItem,
} from '../types';

const STORAGE_PREFIX = 'mercy-student-memory-v2';

type BasicProfileLike = {
  id?: string | null;
  user_id?: string | null;
  email?: string | null;
  preferred_name?: string | null;
  display_name?: string | null;
  first_name?: string | null;
  name?: string | null;
};

function cleanText(value?: string | null): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function dedupe(values: Array<string | undefined | null>, max = 12): string[] {
  const seen = new Set<string>();
  const next: string[] = [];

  for (const raw of values) {
    const value = cleanText(raw);
    if (!value) continue;

    const key = value.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    next.push(value);

    if (next.length >= max) break;
  }

  return next;
}

function mergeStringArrays(
  current: string[] | undefined,
  incoming: string[] | undefined,
  max = 12,
): string[] {
  return dedupe([...(current ?? []), ...(incoming ?? [])], max);
}

function buildUserKey(profile?: BasicProfileLike | null): string {
  const explicit =
    cleanText(profile?.id) ||
    cleanText(profile?.user_id) ||
    cleanText(profile?.email) ||
    cleanText(profile?.preferred_name) ||
    cleanText(profile?.display_name) ||
    cleanText(profile?.first_name) ||
    cleanText(profile?.name);

  return explicit ? explicit.toLowerCase() : 'guest';
}

function normalizeLogicPatterns(
  current: MercyLogicPatternMemory[] = [],
  incoming: MercyLogicPatternMemory[] = [],
): MercyLogicPatternMemory[] {
  const map = new Map<string, MercyLogicPatternMemory>();

  for (const item of current) {
    const key = cleanText(item?.key).toLowerCase();
    const label = cleanText(item?.label);

    if (!key || !label) continue;

    map.set(key, {
      key,
      label,
      count: Number.isFinite(item?.count) ? Math.max(1, item.count) : 1,
      lastSeenAt: cleanText(item?.lastSeenAt) || new Date().toISOString(),
    });
  }

  for (const item of incoming) {
    const key = cleanText(item?.key).toLowerCase();
    const label = cleanText(item?.label);

    if (!key || !label) continue;

    const existing = map.get(key);

    if (existing) {
      map.set(key, {
        ...existing,
        label,
        count: existing.count + Math.max(1, item?.count ?? 1),
        lastSeenAt: cleanText(item?.lastSeenAt) || new Date().toISOString(),
      });
      continue;
    }

    map.set(key, {
      key,
      label,
      count: Math.max(1, item?.count ?? 1),
      lastSeenAt: cleanText(item?.lastSeenAt) || new Date().toISOString(),
    });
  }

  return Array.from(map.values())
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.lastSeenAt.localeCompare(a.lastSeenAt);
    })
    .slice(0, 12);
}

function createEmptyMemory(userKey: string): StudentMercyMemory {
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

function mergeMemory(
  current: StudentMercyMemory,
  patch: StudentMercyMemoryUpdate,
): StudentMercyMemory {
  return {
    ...current,
    writing: {
      ...current.writing,
      ...patch.writing,
      patterns: mergeStringArrays(current.writing.patterns, patch.writing?.patterns),
      strengths: mergeStringArrays(current.writing.strengths, patch.writing?.strengths),
      currentFocus: mergeStringArrays(
        current.writing.currentFocus,
        patch.writing?.currentFocus,
      ),
      recurringTopics: mergeStringArrays(
        current.writing.recurringTopics,
        patch.writing?.recurringTopics,
      ),
      commonWritingModes: mergeStringArrays(
        current.writing.commonWritingModes,
        patch.writing?.commonWritingModes,
      ),
      lastSubmittedText:
        patch.writing?.lastSubmittedText ?? current.writing.lastSubmittedText ?? '',
      lastCorrectedText:
        patch.writing?.lastCorrectedText ?? current.writing.lastCorrectedText ?? '',
      lastEnhancedText:
        patch.writing?.lastEnhancedText ?? current.writing.lastEnhancedText ?? '',
    },
    logic: {
      ...current.logic,
      ...patch.logic,
      vietlishPatterns: normalizeLogicPatterns(
        current.logic.vietlishPatterns,
        patch.logic?.vietlishPatterns,
      ),
      bridgesLearned: mergeStringArrays(
        current.logic.bridgesLearned,
        patch.logic?.bridgesLearned,
      ),
      currentLogicFocus: mergeStringArrays(
        current.logic.currentLogicFocus,
        patch.logic?.currentLogicFocus,
      ),
    },
    pronunciation: {
      ...current.pronunciation,
      ...patch.pronunciation,
      troubleWords: mergeStringArrays(
        current.pronunciation.troubleWords,
        patch.pronunciation?.troubleWords,
      ),
      soundPatterns: mergeStringArrays(
        current.pronunciation.soundPatterns,
        patch.pronunciation?.soundPatterns,
      ),
      confidenceLevel:
        patch.pronunciation?.confidenceLevel ??
        current.pronunciation.confidenceLevel ??
        'medium',
      lastPracticeLine:
        patch.pronunciation?.lastPracticeLine ??
        current.pronunciation.lastPracticeLine ??
        '',
    },
    coaching: {
      ...current.coaching,
      ...patch.coaching,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function buildTeacherMemorySummary(
  memory?: StudentMercyMemory | null,
): TeacherMemorySummaryItem[] {
  if (!memory) return [];

  const summary: TeacherMemorySummaryItem[] = [];

  if (memory.writing.strengths[0]) {
    summary.push({
      type: 'strength',
      label: memory.writing.strengths[0],
    });
  }

  if (memory.writing.currentFocus.length > 0) {
    summary.push({
      type: 'focus',
      label: `Current focus: ${memory.writing.currentFocus.slice(0, 2).join(' + ')}.`,
    });
  }

  if (memory.logic.vietlishPatterns[0]?.label) {
    summary.push({
      type: 'logic',
      label: `Mercy notices a repeated pattern: ${memory.logic.vietlishPatterns[0].label}.`,
    });
  }

  if (memory.pronunciation.troubleWords.length > 0) {
    summary.push({
      type: 'pronunciation',
      label: `Pronunciation focus: ${memory.pronunciation.troubleWords
        .slice(0, 3)
        .join(', ')}.`,
    });
  }

  return summary.slice(0, 4);
}

function memoryToPatch(memory: StudentMercyMemory): StudentMercyMemoryUpdate {
  return {
    writing: memory.writing,
    logic: memory.logic,
    pronunciation: memory.pronunciation,
    coaching: memory.coaching,
  };
}

export function useMercyMemory(profile?: BasicProfileLike | null) {
  const userKey = useMemo(() => buildUserKey(profile), [profile]);
  const storageKey = useMemo(() => `${STORAGE_PREFIX}:${userKey}`, [userKey]);

  const [memory, setMemory] = useState<StudentMercyMemory>(() => {
    if (typeof window === 'undefined') {
      return createEmptyMemory(userKey);
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return createEmptyMemory(userKey);

      const parsed = JSON.parse(raw) as StudentMercyMemory;
      return {
        ...createEmptyMemory(userKey),
        ...parsed,
        userKey,
      };
    } catch {
      return createEmptyMemory(userKey);
    }
  });

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const serverLoadedForRef = useRef<string | null>(null);
  const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextServerWriteRef = useRef(false);

  // Track the signed-in Supabase user. Anonymous users stay on localStorage only.
  useEffect(() => {
    let cancelled = false;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (cancelled) return;
        setAuthUserId(data.user?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setAuthUserId(null);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Rehydrate from localStorage whenever the user key changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setMemory(createEmptyMemory(userKey));
        return;
      }

      const parsed = JSON.parse(raw) as StudentMercyMemory;
      setMemory({
        ...createEmptyMemory(userKey),
        ...parsed,
        userKey,
      });
    } catch {
      setMemory(createEmptyMemory(userKey));
    }
  }, [storageKey, userKey]);

  // Fetch from Supabase on sign-in. Server wins on overlapping keys; if the
  // server row is empty we seed it with whatever the user already has locally.
  useEffect(() => {
    if (!authUserId) return;
    if (serverLoadedForRef.current === authUserId) return;
    serverLoadedForRef.current = authUserId;

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('teacher_memory')
          .select('memory')
          .eq('user_id', authUserId)
          .maybeSingle();

        if (cancelled) return;
        if (error) return;

        const serverMemory = data?.memory as StudentMercyMemory | null | undefined;
        const hasServerData =
          serverMemory &&
          typeof serverMemory === 'object' &&
          Object.keys(serverMemory).length > 0;

        if (hasServerData) {
          // Server is source of truth — merge it into local state.
          skipNextServerWriteRef.current = true;
          setMemory((current) => mergeMemory(current, memoryToPatch(serverMemory!)));
          return;
        }

        // Server empty — seed it from whatever we have locally.
        setMemory((current) => {
          if (current.updatedAt) {
            void supabase
              .from('teacher_memory')
              .upsert(
                { user_id: authUserId, memory: current },
                { onConflict: 'user_id' },
              );
          }
          return current;
        });
      } catch {
        // Network or RLS failure — stay on localStorage, try again next mount.
        serverLoadedForRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  // Write locally immediately; debounce the Supabase upsert by 500ms.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...memory,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // ignore storage failures
    }

    if (!authUserId) return;
    if (skipNextServerWriteRef.current) {
      skipNextServerWriteRef.current = false;
      return;
    }

    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(() => {
      void supabase
        .from('teacher_memory')
        .upsert(
          { user_id: authUserId, memory },
          { onConflict: 'user_id' },
        );
    }, 500);

    return () => {
      if (writeTimerRef.current) {
        clearTimeout(writeTimerRef.current);
        writeTimerRef.current = null;
      }
    };
  }, [memory, storageKey, authUserId]);

  const updateMemory = useCallback((patch: StudentMercyMemoryUpdate) => {
    setMemory((current) => mergeMemory(current, patch));
  }, []);

  const resetMemory = useCallback(() => {
    setMemory(createEmptyMemory(userKey));
    if (authUserId) {
      void supabase.from('teacher_memory').delete().eq('user_id', authUserId);
    }
  }, [userKey, authUserId]);

  const teacherSummary = useMemo(() => buildTeacherMemorySummary(memory), [memory]);

  return {
    memory,
    updateMemory,
    resetMemory,
    teacherSummary,
    userKey,
  };
}

export default useMercyMemory;