import { useState, useEffect, useCallback } from 'react';

interface CompanionLine {
  en: string;
  vi: string;
}

interface CompanionLinesData {
  greeting: { en: string[]; vi: string[] };
  reflection: { en: string[]; vi: string[] };
  completion: { en: string[]; vi: string[] };
}

type LineCategory = 'greeting' | 'reflection' | 'completion';

let cachedLines: CompanionLinesData | null = null;

/**
 * Hook for bilingual companion lines (legacy/Vietnamese support)
 * For English-only friend mode, use companionLines.ts utility
 */
export function useCompanionLines() {
  const [lines, setLines] = useState<CompanionLinesData | null>(cachedLines);
  const [loading, setLoading] = useState(!cachedLines);

  useEffect(() => {
    if (cachedLines) {
      setLines(cachedLines);
      setLoading(false);
      return;
    }

    fetch('/data/companion_lines.json')
      .then((res) => res.json())
      .then((data: CompanionLinesData) => {
        cachedLines = data;
        setLines(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load companion lines:', err);
        setLoading(false);
      });
  }, []);

  const getRandomLine = useCallback(
    (category: LineCategory): CompanionLine | null => {
      if (!lines) return null;

      const categoryData = lines[category];
      if (!categoryData || !categoryData.en.length || !categoryData.vi.length) {
        return null;
      }

      const enIndex = Math.floor(Math.random() * categoryData.en.length);
      const viIndex = Math.floor(Math.random() * categoryData.vi.length);

      return {
        en: categoryData.en[enIndex],
        vi: categoryData.vi[viIndex],
      };
    },
    [lines]
  );

  return { lines, loading, getRandomLine };
}
