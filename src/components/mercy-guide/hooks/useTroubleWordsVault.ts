import { useCallback, useEffect, useState } from 'react';
import {
  TROUBLE_WORDS_STORAGE_KEY,
  TroubleWord,
  normalizeVaultWord,
} from '../shared';

export function useTroubleWordsVault() {
  const [troubleWords, setTroubleWords] = useState<TroubleWord[]>([]);

  const addToTroubleWords = useCallback(
    (word: string, score: number, tipEn?: string, tipVi?: string) => {
      const normalized = normalizeVaultWord(word);
      if (!normalized) return;

      setTroubleWords((prev) => {
        const existing = prev.find((item) => item.word.toLowerCase() === normalized);
        const updatedAt = new Date().toISOString();

        const next = existing
          ? prev.map((item) =>
              item.word.toLowerCase() === normalized
                ? {
                    ...item,
                    count: item.count + 1,
                    lastScore: score,
                    bestScore: Math.max(item.bestScore ?? score, score),
                    updatedAt,
                    tipEn: tipEn ?? item.tipEn,
                    tipVi: tipVi ?? item.tipVi,
                  }
                : item
            )
          : [
              ...prev,
              {
                word: normalized,
                count: 1,
                lastScore: score,
                bestScore: score,
                updatedAt,
                tipEn,
                tipVi,
              },
            ];

        return next
          .slice()
          .sort((a, b) => {
            if (a.lastScore !== b.lastScore) return a.lastScore - b.lastScore;
            if (a.count !== b.count) return b.count - a.count;
            return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
          })
          .slice(0, 30);
      });
    },
    []
  );

  useEffect(() => {
    const stored = sessionStorage.getItem(TROUBLE_WORDS_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as TroubleWord[];
      if (Array.isArray(parsed)) {
        setTroubleWords(parsed);
      }
    } catch (error) {
      console.error('Failed to parse trouble words:', error);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(TROUBLE_WORDS_STORAGE_KEY, JSON.stringify(troubleWords));
  }, [troubleWords]);

  return {
    troubleWords,
    addToTroubleWords,
  };
}