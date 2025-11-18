import wordColorRules from "@/data/word-color-rule.json";

interface ColoredWord {
  word: string;
  color: string;
  category: string;
}

// Build English-to-Vietnamese mapping from the new color rules
const enToViEquivalents: Record<string, string> = {};
const viToEnEquivalents: Record<string, string> = {};

// Build mappings from the categories in the JSON
Object.entries(wordColorRules.categories).forEach(([categoryKey, categoryData]: [string, any]) => {
  const enWords = categoryData.words_en || [];
  const viWords = categoryData.words_vi || [];
  
  // Map each English word to its Vietnamese equivalent at the same index
  enWords.forEach((enWord: string, index: number) => {
    if (viWords[index]) {
      enToViEquivalents[enWord.toLowerCase()] = viWords[index].toLowerCase();
      viToEnEquivalents[viWords[index].toLowerCase()] = enWord.toLowerCase();
    }
  });
});

function findWordInCategories(word: string): ColoredWord | null {
  const lowerWord = word.toLowerCase();
  
  // Check all categories for this word
  for (const [categoryKey, categoryData] of Object.entries(wordColorRules.categories) as [string, any][]) {
    const enWords = (categoryData.words_en || []).map((w: string) => w.toLowerCase());
    const viWords = (categoryData.words_vi || []).map((w: string) => w.toLowerCase());
    
    if (enWords.includes(lowerWord) || viWords.includes(lowerWord)) {
      return { 
        word, 
        color: categoryData.color, 
        category: categoryKey 
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
    let coloredWord: ColoredWord | null = null;
    
    if (isVietnamese) {
      // Try single word equivalence first
      const enEquivalent = viToEnEquivalents[cleanWord];
      if (enEquivalent) {
        coloredWord = findWordInCategories(enEquivalent);
      }
      
      // Try phrase equivalence: current + space + next word (e.g., "bình yên")
      if (!coloredWord && i + 2 < segments.length) {
        const maybeSpace = segments[i + 1];
        const nextSeg = segments[i + 2];
        if (/^\s+$/.test(maybeSpace || '') && nextSeg && nextSeg.trim() !== '') {
          const phrase = `${cleanWord} ${nextSeg.trim().toLowerCase()}`;
          const enEqPhrase = viToEnEquivalents[phrase];
          if (enEqPhrase) {
            const cat = findWordInCategories(enEqPhrase);
            if (cat) {
              result.push(
                <span key={i} style={{ backgroundColor: cat.color, padding: '2px 4px', borderRadius: '3px', fontWeight: 500 }}>
                  {segment}
                </span>
              );
              result.push(<span key={i + 1}>{maybeSpace}</span>);
              result.push(
                <span key={i + 2} style={{ backgroundColor: cat.color, padding: '2px 4px', borderRadius: '3px', fontWeight: 500 }}>
                  {nextSeg}
                </span>
              );
              i += 2;
              continue;
            }
          }
        }
      }
      
      // Also check if the Vietnamese word itself matches a category directly
      if (!coloredWord) {
        coloredWord = findWordInCategories(cleanWord);
      }
    } else {
      // For English, directly check the word
      coloredWord = findWordInCategories(cleanWord);
    }
    
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
