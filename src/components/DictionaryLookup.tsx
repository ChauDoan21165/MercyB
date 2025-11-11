import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Volume2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [loadingAudio, setLoadingAudio] = useState<'en' | 'vi' | null>(null);
  const [speed, setSpeed] = useState<number>(1.0);
  const { toast } = useToast();
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

  const playPronunciation = async (text: string, language: 'en' | 'vi') => {
    setLoadingAudio(language);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "VIP Feature",
          description: "Please sign in with a VIP subscription to use pronunciation",
          variant: "destructive",
        });
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
    <div className="w-full max-w-md mx-auto mb-4 p-4 border-2 border-primary/20 rounded-lg bg-accent/5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-accent/10 hover:shadow-md">
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
      
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={speed === 0.75 ? "default" : "outline"}
            className="h-6 px-2 text-xs"
            onClick={() => setSpeed(0.75)}
          >
            Slow
          </Button>
          <Button
            size="sm"
            variant={speed === 1.0 ? "default" : "outline"}
            className="h-6 px-2 text-xs"
            onClick={() => setSpeed(1.0)}
          >
            Normal
          </Button>
          <Button
            size="sm"
            variant={speed === 1.5 ? "default" : "outline"}
            className="h-6 px-2 text-xs"
            onClick={() => setSpeed(1.5)}
          >
            Fast
          </Button>
        </div>
      </div>
      
      {result && searchTerm && (
        <Card className="mt-2 p-3 bg-muted/50">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground">English:</span>
                <p className="text-sm">{result.en.join(", ")}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 flex-shrink-0"
                onClick={() => playPronunciation(result.en[0], 'en')}
                disabled={loadingAudio !== null}
              >
                {loadingAudio === 'en' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground">Vietnamese:</span>
                <p className="text-sm">{result.vi.join(", ")}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 flex-shrink-0"
                onClick={() => playPronunciation(result.vi[0], 'vi')}
                disabled={loadingAudio !== null}
              >
                {loadingAudio === 'vi' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
