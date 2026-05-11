// src/hooks/useLessonData.ts
// Fetch a single lesson from public.lessons. Caches per (language,level,index).

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { GermanLesson } from "@/languages/german/lessons";

export type LessonContent = GermanLesson;
type CacheKey = string;

const lessonCache = new Map<CacheKey, LessonContent | null>();

function cacheKey(language: string, level: string, index: number): CacheKey {
  return `${language}-${level}-${index}`;
}

export interface UseLessonDataResult {
  lesson: LessonContent | null;
  loading: boolean;
  error: string | null;
}

export function useLessonData(
  language: string,
  level: string,
  index: number,
): UseLessonDataResult {
  const key = cacheKey(language, level, index);

  const [lesson, setLesson] = useState<LessonContent | null>(() => {
    const cached = lessonCache.get(key);
    return cached ?? null;
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
        lessonCache.set(key, data as LessonContent);
        setLesson(data as LessonContent);
        setLoading(false);
      } catch (err) {
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
export async function fetchLessonsBatch(
  language: string,
  level: string,
): Promise<LessonContent[]> {
  const cached: LessonContent[] = [];
  // Scan existing cache first — if all indexed lessons present, skip fetch
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("language", language)
    .eq("level", level)
    .order("lesson_index", { ascending: true })
    .limit(100);

  if (error) {
    console.warn("[useLessonData] batch fetch error:", error);
    return cached;
  }

  if (!data || data.length === 0) return cached;

  for (const row of data) {
    const idx = (row as { lesson_index: number }).lesson_index;
    if (idx != null) {
      const k = cacheKey(language, level, idx);
      lessonCache.set(k, row as LessonContent);
      cached.push(row as LessonContent);
    }
  }
  return cached;
}

/** Clear the module-level cache. Exported for tests. */
export function __clearLessonCache(): void {
  lessonCache.clear();
}