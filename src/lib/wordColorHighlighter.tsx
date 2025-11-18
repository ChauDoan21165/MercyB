import wordColorRules from "@/data/word-color-rule.json";

interface ColoredWord {
  word: string;
  color: string;
  category: string;
}

function findWordInCategories(word: string, isVietnamese: boolean = false): ColoredWord | null {
  const lowerWord = word.toLowerCase();
  
  // Check all categories for this word
  for (const categoryData of wordColorRules.categories as any[]) {
    // Collect words based on language
    const allWords = isVietnamese ? [
      ...(categoryData.adjectives_vi || []),
      ...(categoryData.adverbs_vi || []),
      ...(categoryData.verbs_light_vi || []),
      ...(categoryData.verbs_medium_vi || []),
      ...(categoryData.verbs_strong_vi || [])
    ] : [
      ...(categoryData.adjectives || []),
      ...(categoryData.adverbs || []),
      ...(categoryData.verbs_light || []),
      ...(categoryData.verbs_medium || []),
      ...(categoryData.verbs_strong || [])
    ];
    
    const lowerWords = allWords.map((w: string) => w.toLowerCase());
    
    if (lowerWords.includes(lowerWord)) {
      return { 
        word, 
        color: categoryData.hex, 
        category: categoryData.id 
      };
    }
  }
  
  return null;
}

export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  // Split by common punctuation while preserving the punctuation
  // Split by common punctuation while preserving the punctuation
  const segments = text.split(/(\s+|[.,;:!?()""—–-])/);
  const result: JSX.Element[] = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    if (!segment || segment.trim() === '') {
      result.push(<span key={i}>{segment}</span>);
      continue;
    }
    
    const cleanWord = segment.trim().toLowerCase();
    
    // Check the word with language context
    const coloredWord = findWordInCategories(cleanWord, isVietnamese);
    
    if (coloredWord) {
      result.push(
        <span 
          key={i}
          style={{ 
            backgroundColor: coloredWord.color,
            padding: '2px 4px',
            borderRadius: '3px',
            fontWeight: 500
          }}
        >
          {segment}
        </span>
      );
    } else {
      result.push(<span key={i}>{segment}</span>);
    }
  }
  
  return result;
}

export function highlightPairedText(enText: string, viText: string): {
  enHighlighted: JSX.Element[];
  viHighlighted: JSX.Element[];
} {
  return {
    enHighlighted: highlightTextByRules(enText, false),
    viHighlighted: highlightTextByRules(viText, true)
  };
}
