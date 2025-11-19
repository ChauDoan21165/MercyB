import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Volume2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserAccess } from "@/hooks/useUserAccess";
import { KeywordPronunciation } from "@/components/KeywordPronunciation";
import dictionaryData from "@/data/system/Dictionary.json";

interface DictionaryEntry {
  en: string[];
  vi: string[];
  ipa_en?: string;
  ipa_vi?: string;
  example_en?: string;
  example_vi?: string;
}

interface Dictionary {
  [key: string]: DictionaryEntry;
}

interface DictionaryLookupProps {
  roomId?: string;
  roomKeywords?: string[];
  externalSearch?: string;
}

export const DictionaryLookup = ({ roomId, roomKeywords, externalSearch }: DictionaryLookupProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<'en' | 'vi' | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);
  const { toast } = useToast();
  const { access } = useUserAccess();
  const dictionary = (dictionaryData as any).dictionary as Dictionary;
  
  // Update search term when external search is provided
  useEffect(() => {
    if (externalSearch) {
      setSearchTerm(externalSearch);
    }
  }, [externalSearch]);
  
  // Filter dictionary to only room-relevant keywords
  const relevantDictionary: Dictionary = {};
  if (roomKeywords && roomKeywords.length > 0) {
    for (const [key, entry] of Object.entries(dictionary)) {
      // Check if this dictionary key matches any room keyword
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
    // If no room keywords provided, use full dictionary
    Object.assign(relevantDictionary, dictionary);
  }

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResult(null);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // First try exact word match in relevant dictionary
    for (const [key, entry] of Object.entries(relevantDictionary)) {
      const exactMatch = entry.en.some(word => word.toLowerCase() === term) ||
                         entry.vi.some(word => word.toLowerCase() === term);
      if (exactMatch) {
        setResult(entry);
        return;
      }
    }
    
    // Then try partial match (word contains the search term)
    for (const [key, entry] of Object.entries(relevantDictionary)) {
      const partialMatch = entry.en.some(word => word.toLowerCase().includes(term)) ||
                          entry.vi.some(word => word.toLowerCase().includes(term));
      if (partialMatch) {
        setResult(entry);
        return;
      }
    }

    setResult(null);
  }, [searchTerm, relevantDictionary]);

  const playPronunciation = async (text: string, language: 'en' | 'vi') => {
    setLoadingAudio(language);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "VIP3 Feature",
          description: "Please sign in to use pronunciation",
          variant: "destructive",
        });
        return;
      }

      // Check for VIP3 access
      if (!access.isVip3) {
        toast({
          title: "VIP3 Feature",
          description: "This function is for VIP3 users",
          variant: "destructive",
        });
        setLoadingAudio(null);
        return;
      }

      // Determine voice based on language
      const voice = language === 'en' ? 'alloy' : 'nova';

      // Call the VIP-only text-to-speech function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text,
          voice: voice,
          roomSlug: 'dictionary',
          entrySlug: text.toLowerCase().replace(/\s+/g, '-'),
        },
      });

      if (error) {
        if (error.message?.includes('VIP')) {
          toast({
            title: "VIP Feature",
            description: "Dictionary pronunciation is available for VIP members only",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.playbackRate = speed;
        audio.play();
        toast({
          title: "Playing pronunciation",
          duration: 1500,
        });
      }
    } catch (error: any) {
      console.error('Pronunciation error:', error);
      toast({
        title: "Pronunciation failed",
        description: error.message || "Could not generate audio",
        variant: "destructive",
      });
    } finally {
      setLoadingAudio(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        <Input
          type="text"
          placeholder="Search keyword"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 h-11 text-sm border focus:border-primary"
        />
      </div>
      
      {result && searchTerm && (
        <Card className="mt-3 overflow-hidden border shadow-md">
          <div className="divide-y divide-border">
            <div className="p-4 bg-gradient-to-r from-background to-muted/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">English</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                    onClick={() => playPronunciation(result.en[0], 'en')}
                    disabled={loadingAudio !== null}
                  >
                    {loadingAudio === 'en' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-lg font-semibold text-foreground">{result.en.join(", ")}</p>
                {result.ipa_en && (
                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    <p className="font-mono">/{result.ipa_en}/</p>
                  </div>
                )}
                {result.example_en && (
                  <div className="mt-2 p-2 bg-muted/30 rounded border-l-2 border-primary">
                    <p className="text-xs text-foreground/80 italic">"{result.example_en}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-background to-muted/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tiếng Việt</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                    onClick={() => playPronunciation(result.vi[0], 'vi')}
                    disabled={loadingAudio !== null}
                  >
                    {loadingAudio === 'vi' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-lg font-semibold text-foreground">{result.vi.join(", ")}</p>
                {result.ipa_vi && (
                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    <p className="font-mono">/{result.ipa_vi}/</p>
                  </div>
                )}
                {result.example_vi && (
                  <div className="mt-2 p-2 bg-muted/30 rounded border-l-2 border-primary">
                    <p className="text-xs text-foreground/80 italic">"{result.example_vi}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted/5">
              <KeywordPronunciation keyword={result.en[0]} compact={true} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
