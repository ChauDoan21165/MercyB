// src/hooks/useLessonData.ts
// Fetch lessons from public.lessons. Caches per (language,level,index).
//
// Index convention: callers use 1-based lesson_index matching DB storage.
// The unified rule kills the off-by-one + cache-collision class of bugs:
//   - `useLessonData(lang, lvl, n)` queries `.eq("lesson_index", n)` directly.
//   - `fetchLessonsBatch` caches each row under its own `lesson_index`.
//   - So both fetchers share the same cache namespace; passing `1` always
//     hits the first lesson whether it came from a batch or a single fetch.
// The hook returns `row.content` (the JSONB payload), not the raw row.
// Callers get lesson fields at the top level — no `.content` indirection
// downstream.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type LessonContent = Record<string, unknown>;

type CacheKey = string;

const lessonCache = new Map<CacheKey, LessonContent | null>();

function cacheKey(language: string, level: string, index: number): CacheKey {
  return `${language}-${level}-${index}`;
}

export interface UseLessonDataResult<T = LessonContent> {
  lesson: T | null;
  loading: boolean;
  error: string | null;
}

export function useLessonData<T = LessonContent>(
  language: string,
  level: string,
  index: number,
): UseLessonDataResult<T> {
  const key = cacheKey(language, level, index);

  const [lesson, setLesson] = useState<T | null>(() => {
    const cached = lessonCache.get(key);
    return (cached as T) ?? null;
  });
  const [loading, setLoading] = useState<boolean>(!lessonCache.has(key));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lessonCache.has(key)) return;
    let cancelled = false;
    void (async () => {
      try {
        const { data, error: queryError } = await supabase
          .from("lessons")
          .select("*")
          .eq("language", language)
          .eq("level", level)
          .eq("lesson_index", index)
          .maybeSingle();
        if (cancelled) return;
        if (queryError) {
          lessonCache.set(key, null);
          setError("Could not load lesson. Please try again.");
          setLoading(false);
          return;
        }
        if (!data) {
          lessonCache.set(key, null);
          setError("Lesson not found.");
          setLoading(false);
          return;
        }
        const lessonContent = (data as { content: T }).content;
        lessonCache.set(key, lessonContent as LessonContent);
        setLesson(lessonContent);
        setLoading(false);
      } catch {
        if (cancelled) return;
        lessonCache.set(key, null);
        setError("Could not load lesson. Please try again.");
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [key]);

  return { lesson, loading, error };
}

/** Batch-fetch all lessons for (language, level). Caches individually. */
export async function fetchLessonsBatch<T = LessonContent>(
  language: string,
  level: string,
): Promise<T[]> {
  const cached: T[] = [];
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("language", language)
    .eq("level", level)
    .order("lesson_index", { ascending: true })
    .limit(1000);

  if (error) {
    console.warn("[useLessonData] batch fetch error:", error);
    return cached;
  }

  if (!data || data.length === 0) return cached;

  for (const row of data) {
    const rowData = row as { lesson_index: number; content: T };
    const idx = rowData.lesson_index;
    if (idx != null) {
      // 1-based key, matching the hook's caller convention. The content
      // payload is what callers want; the wrapping row metadata
      // (id, language, level, lesson_index) stays out of the cache.
      const k = cacheKey(language, level, idx);
      lessonCache.set(k, rowData.content as LessonContent);
      cached.push(rowData.content);
    }
  }
  return cached;
}

/** Clear the module-level cache. Exported for tests. */
export function __clearLessonCache(): void {
  lessonCache.clear();
}
