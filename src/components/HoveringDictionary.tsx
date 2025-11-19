import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { toast } = useToast();
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

  const playPronunciation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlayingAudio) return;
    
    setIsPlayingAudio(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to use audio pronunciation",
          variant: "destructive",
        });
        setIsPlayingAudio(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: word,
          voice: 'alloy',
          roomSlug: 'dictionary',
          entrySlug: word.toLowerCase()
        }
      });

      if (error) throw error;

      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          toast({
            title: "Playback error",
            description: "Could not play audio",
            variant: "destructive",
          });
        };
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      toast({
        title: "Error",
        description: "Failed to load pronunciation",
        variant: "destructive",
      });
      setIsPlayingAudio(false);
    }
  };

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
      <span 
        className="hover:bg-primary/10 transition-colors rounded px-0.5 cursor-pointer"
        onClick={playPronunciation}
      >
        {children}
      </span>
      
      {showTooltip && (
        <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 shadow-lg border-border z-50 w-64 bg-background">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-foreground flex-1">
                {translation.en.join(", ")}
              </p>
              <button
                onClick={playPronunciation}
                disabled={isPlayingAudio}
                className="p-1 hover:bg-primary/10 rounded transition-colors disabled:opacity-50"
                title="Play pronunciation"
              >
                <Volume2 className={`w-4 h-4 text-primary ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              </button>
            </div>
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
