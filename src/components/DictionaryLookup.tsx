import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import dictionaryData from "@/data/system/Dictionary.json";

interface DictionaryEntry {
  en: string[];
  vi: string[];
}

interface Dictionary {
  [key: string]: DictionaryEntry;
}

export const DictionaryLookup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<{ en: string[]; vi: string[] } | null>(null);
  const dictionary = (dictionaryData as any).dictionary as Dictionary;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResult(null);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Search in English terms
    for (const [key, entry] of Object.entries(dictionary)) {
      const englishMatches = entry.en.some(word => word.toLowerCase().includes(term));
      if (englishMatches) {
        setResult(entry);
        return;
      }
    }

    // Search in Vietnamese terms
    for (const [key, entry] of Object.entries(dictionary)) {
      const vietnameseMatches = entry.vi.some(word => word.toLowerCase().includes(term));
      if (vietnameseMatches) {
        setResult(entry);
        return;
      }
    }

    setResult(null);
  }, [searchTerm, dictionary]);

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Type a word to translate / Nhập từ để dịch"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {result && searchTerm && (
        <Card className="mt-2 p-3 bg-muted/50">
          <div className="space-y-2">
            <div>
              <span className="text-xs font-semibold text-muted-foreground">English:</span>
              <p className="text-sm">{result.en.join(", ")}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-muted-foreground">Vietnamese:</span>
              <p className="text-sm">{result.vi.join(", ")}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
