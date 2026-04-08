import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  GUIDE_ENABLED: 'mb_mercy_guide_enabled',
  QUESTIONS_THIS_HOUR: 'mb_guide_questions_hour',
  HOUR_TIMESTAMP: 'mb_guide_hour_ts',
} as const;

const MAX_QUESTIONS_PER_HOUR = 10;
const ONE_HOUR_MS = 60 * 60 * 1000;

export interface GuideArticle {
  title_en: string;
  title_vi: string;
  body_en: string;
  body_vi: string;
}

export type GuideArticles = Record<string, GuideArticle>;

let articlesCache: GuideArticles | null = null;
let articlesPromise: Promise<GuideArticles> | null = null;

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage(key: string): string | null {
  if (!canUseBrowserStorage()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage write failures
  }
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function getInitialEnabled(): boolean {
  const stored = readStorage(STORAGE_KEYS.GUIDE_ENABLED);

  if (stored === null) return true;
  return stored === 'true';
}

function normalizeArticles(value: unknown): GuideArticles {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const normalized: GuideArticles = {};

  for (const [key, rawArticle] of entries) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      continue;
    }

    const article = rawArticle as Partial<GuideArticle>;

    normalized[key] = {
      title_en: typeof article.title_en === 'string' ? article.title_en : '',
      title_vi: typeof article.title_vi === 'string' ? article.title_vi : '',
      body_en: typeof article.body_en === 'string' ? article.body_en : '',
      body_vi: typeof article.body_vi === 'string' ? article.body_vi : '',
    };
  }

  return normalized;
}

async function loadGuideArticles(): Promise<GuideArticles> {
  if (articlesCache) {
    return articlesCache;
  }

  if (articlesPromise) {
    return articlesPromise;
  }

  articlesPromise = fetch('/data/guide_articles_en_vi.json', {
    credentials: 'same-origin',
    cache: 'default',
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to load guide articles: HTTP ${res.status}`);
      }

      const data = (await res.json()) as unknown;
      const normalized = normalizeArticles(data);
      articlesCache = normalized;
      return normalized;
    })
    .finally(() => {
      articlesPromise = null;
    });

  return articlesPromise;
}

function ensureHourlyWindow(): { now: number; hourTs: number; questions: number } {
  const now = Date.now();
  const hourTs = parsePositiveInt(readStorage(STORAGE_KEYS.HOUR_TIMESTAMP), 0);
  const questions = parsePositiveInt(readStorage(STORAGE_KEYS.QUESTIONS_THIS_HOUR), 0);

  if (!hourTs || now - hourTs > ONE_HOUR_MS) {
    writeStorage(STORAGE_KEYS.HOUR_TIMESTAMP, String(now));
    writeStorage(STORAGE_KEYS.QUESTIONS_THIS_HOUR, '0');

    return {
      now,
      hourTs: now,
      questions: 0,
    };
  }

  return {
    now,
    hourTs,
    questions,
  };
}

export function useMercyGuide() {
  const [articles, setArticles] = useState<GuideArticles | null>(articlesCache);
  const [isLoading, setIsLoading] = useState(!articlesCache);
  const [isEnabled, setIsEnabled] = useState<boolean>(() => getInitialEnabled());

  useEffect(() => {
    let isCancelled = false;

    if (articlesCache) {
      setArticles(articlesCache);
      setIsLoading(false);

      return () => {
        isCancelled = true;
      };
    }

    setIsLoading(true);

    loadGuideArticles()
      .then((data) => {
        if (isCancelled) return;
        setArticles(data);
      })
      .catch((err) => {
        console.error('Failed to load guide articles:', err);

        if (isCancelled) return;
        setArticles({});
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const setGuideEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    writeStorage(STORAGE_KEYS.GUIDE_ENABLED, String(enabled));
  }, []);

  const canAskQuestion = useCallback((): boolean => {
    const { questions } = ensureHourlyWindow();
    return questions < MAX_QUESTIONS_PER_HOUR;
  }, []);

  const incrementQuestionCount = useCallback(() => {
    const { questions } = ensureHourlyWindow();
    writeStorage(
      STORAGE_KEYS.QUESTIONS_THIS_HOUR,
      String(Math.max(0, questions) + 1),
    );
  }, []);

  const getQuestionsRemaining = useCallback((): number => {
    const { questions } = ensureHourlyWindow();
    return Math.max(0, MAX_QUESTIONS_PER_HOUR - questions);
  }, []);

  return {
    articles,
    isLoading,
    isEnabled,
    setGuideEnabled,
    canAskQuestion,
    incrementQuestionCount,
    getQuestionsRemaining,
  };
}