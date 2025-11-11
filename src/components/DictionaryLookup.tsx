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
  ipa_en?: string;
  ipa_vi?: string;
  example_en?: string;
  example_vi?: string;
}

interface Dictionary {
  [key: string]: DictionaryEntry;
}

export const DictionaryLookup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<DictionaryEntry | null>(null);
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
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
        <Input
          type="text"
          placeholder="Search English or Vietnamese / Tìm tiếng Anh hoặc tiếng Việt"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-14 text-base border-2 focus:border-primary shadow-sm"
        />
      </div>
      
      {result && searchTerm && (
        <Card className="mt-4 overflow-hidden border-2 shadow-lg">
          <div className="divide-y divide-border">
            <div className="p-6 bg-gradient-to-r from-background to-muted/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">English</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-primary/10"
                      onClick={() => playPronunciation(result.en[0], 'en')}
                      disabled={loadingAudio !== null}
                    >
                      {loadingAudio === 'en' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold text-foreground">{result.en.join(", ")}</p>
                    {result.ipa_en && (
                      <p className="text-sm text-primary font-mono">/{result.ipa_en}/</p>
                    )}
                  </div>
                  {result.example_en && (
                    <div className="mt-4 p-3 bg-muted/40 rounded-md border-l-4 border-primary">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">EXAMPLE</p>
                      <p className="text-sm text-foreground/90 italic">"{result.example_en}"</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Playback speed:</span>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant={speed === 0.75 ? "default" : "outline"}
                    className="h-7 px-3 text-xs"
                    onClick={() => setSpeed(0.75)}
                  >
                    0.75×
                  </Button>
                  <Button
                    size="sm"
                    variant={speed === 1.0 ? "default" : "outline"}
                    className="h-7 px-3 text-xs"
                    onClick={() => setSpeed(1.0)}
                  >
                    1.0×
                  </Button>
                  <Button
                    size="sm"
                    variant={speed === 1.5 ? "default" : "outline"}
                    className="h-7 px-3 text-xs"
                    onClick={() => setSpeed(1.5)}
                  >
                    1.5×
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-muted/20 to-background">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tiếng Việt</span>
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-foreground">{result.vi.join(", ")}</p>
                  {result.ipa_vi && (
                    <p className="text-sm text-primary font-mono">/{result.ipa_vi}/</p>
                  )}
                </div>
                {result.example_vi && (
                  <div className="mt-4 p-3 bg-muted/40 rounded-md border-l-4 border-primary">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">VÍ DỤ</p>
                    <p className="text-sm text-foreground/90 italic">"{result.example_vi}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
