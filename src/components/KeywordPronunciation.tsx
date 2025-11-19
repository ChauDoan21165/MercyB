import { useEffect, useState } from 'react';
import dictionaryData from '@/data/system/Dictionary.json';
import pronunciationGuide from '@/../../public/data/pronunciation-guide.json';

interface PronunciationData {
  ipa_en?: string;
  ipa_vi?: string;
  breakdown?: string;
  commonMistake?: string;
}

interface KeywordPronunciationProps {
  keyword: string;
  compact?: boolean;
}

// Extended pronunciation database with detailed breakdowns
const pronunciationDatabase: Record<string, PronunciationData> = {
  breathing: {
    ipa_en: '/ˈbriː-ðɪŋ/',
    breakdown: 'bree–thing',
    commonMistake: '❌ Not "breath-ing" (that would rhyme with "bath-ing")\n✔ Correct is bree-thing'
  },
  stress: {
    ipa_en: '/stres/',
    breakdown: 'stress',
    commonMistake: '❌ Not "stree-ss"\n✔ Short "e" sound like "dress"'
  },
  mindfulness: {
    ipa_en: '/ˈmaɪnd.fəl.nəs/',
    breakdown: 'mind–ful–ness',
    commonMistake: '❌ Not "mine-full-ness"\n✔ Say "MIND-ful-ness"'
  },
  routines: {
    ipa_en: '/ruːˈtiːnz/',
    breakdown: 'roo–teens',
    commonMistake: '❌ Not "row-tines"\n✔ Say "roo-TEENS"'
  },
  anxiety: {
    ipa_en: '/æŋˈzaɪ.ə.ti/',
    breakdown: 'ang–ZY–uh–tee',
    commonMistake: '❌ Not "an-zee-tee"\n✔ Stress on ZY: ang-ZY-uh-tee'
  },
  communication: {
    ipa_en: '/kə.ˌmjuː.nɪˈkeɪ.ʃən/',
    breakdown: 'kuh–myoo–ni–KAY–shun',
    commonMistake: '❌ Not "com-yoo-ni-kay-shun"\n✔ Stress on KAY'
  }
};

export const KeywordPronunciation = ({ keyword, compact = false }: KeywordPronunciationProps) => {
  const [pronunciation, setPronunciation] = useState<PronunciationData | null>(null);

  useEffect(() => {
    const normalizedKeyword = keyword.toLowerCase().replace(/_/g, ' ').trim();
    
    // First check our detailed database
    const detailedData = pronunciationDatabase[normalizedKeyword];
    if (detailedData) {
      setPronunciation(detailedData);
      return;
    }

    // Check pronunciation guide (case-insensitive)
    const guideData = pronunciationGuide.pronunciation;
    const guidePronunciation = Object.keys(guideData).find(
      key => key.toLowerCase() === normalizedKeyword
    );
    if (guidePronunciation) {
      setPronunciation({
        breakdown: guideData[guidePronunciation as keyof typeof guideData]
      });
      return;
    }

    // Then check the main dictionary
    const dictEntry = (dictionaryData as any).dictionary[normalizedKeyword];
    if (dictEntry?.ipa_en) {
      setPronunciation({
        ipa_en: dictEntry.ipa_en,
        ipa_vi: dictEntry.ipa_vi
      });
    }
  }, [keyword]);

  if (!pronunciation?.ipa_en && !pronunciation?.breakdown) return null;

  if (compact) {
    return (
      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
        {pronunciation.ipa_en && <div className="font-mono">{pronunciation.ipa_en}</div>}
        {pronunciation.breakdown && (
          <div className="italic">{pronunciation.breakdown}</div>
        )}
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground mt-1 space-y-1 text-left w-full">
      {pronunciation.ipa_en && <div className="font-mono font-medium">{pronunciation.ipa_en}</div>}
      {pronunciation.breakdown && (
        <div className="italic text-foreground/80">{pronunciation.breakdown}</div>
      )}
      {pronunciation.commonMistake && (
        <div className="text-[10px] leading-tight whitespace-pre-line mt-1 p-1 bg-muted/50 rounded">
          {pronunciation.commonMistake}
        </div>
      )}
    </div>
  );
};
