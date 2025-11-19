import { useState } from "react";
import { Card } from "@/components/ui/card";
import dictionaryData from "@/data/system/Dictionary.json";

interface DictionaryEntry {
  en: string[];
  vi: string[];
  ipa_en?: string;
  ipa_vi?: string;
}

interface Dictionary {
  [key: string]: DictionaryEntry;
}

interface HoveringDictionaryProps {
  word: string;
  children: React.ReactNode;
  roomKeywords?: string[];
}

export const HoveringDictionary = ({ word, children, roomKeywords }: HoveringDictionaryProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const dictionary = (dictionaryData as any).dictionary as Dictionary;
  
  // Filter dictionary to only room-relevant keywords
  const relevantDictionary: Dictionary = {};
  if (roomKeywords && roomKeywords.length > 0) {
    for (const [key, entry] of Object.entries(dictionary)) {
      const keyLower = key.toLowerCase();
      const isRelevant = roomKeywords.some(keyword => {
        const kwLower = keyword.toLowerCase().replace(/_/g, ' ');
        return keyLower.includes(kwLower) || kwLower.includes(keyLower);
      });
      if (isRelevant) {
        relevantDictionary[key] = entry;
      }
    }
  } else {
    Object.assign(relevantDictionary, dictionary);
  }

  // Find translation for the word
  const findTranslation = (): DictionaryEntry | null => {
    const term = word.toLowerCase().trim();
    
    // Try exact match first
    for (const [key, entry] of Object.entries(relevantDictionary)) {
      const exactMatch = entry.en.some(w => w.toLowerCase() === term);
      if (exactMatch) return entry;
    }
    
    // Try partial match
    for (const [key, entry] of Object.entries(relevantDictionary)) {
      const partialMatch = entry.en.some(w => w.toLowerCase().includes(term));
      if (partialMatch) return entry;
    }
    
    return null;
  };

  const translation = findTranslation();

  // If no translation exists, just render children without hover functionality
  if (!translation) {
    return <>{children}</>;
  }

  return (
    <span 
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="hover:bg-primary/10 transition-colors rounded px-0.5">
        {children}
      </span>
      
      {showTooltip && (
        <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 shadow-lg border-border z-50 w-64 bg-background">
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-semibold text-foreground">
                {translation.en.join(", ")}
              </p>
              {translation.ipa_en && (
                <p className="text-xs text-muted-foreground italic">
                  /{translation.ipa_en}/
                </p>
              )}
            </div>
            <hr className="border-border" />
            <div>
              <p className="text-foreground">
                {translation.vi.join(", ")}
              </p>
              {translation.ipa_vi && (
                <p className="text-xs text-muted-foreground italic">
                  /{translation.ipa_vi}/
                </p>
              )}
            </div>
          </div>
          {/* Arrow pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border" />
          </div>
        </Card>
      )}
    </span>
  );
};
