import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import meaningFree from "@/data/rooms/meaning_of_life_free.json";
import meaningVip1 from "@/data/rooms/meaning_of_life_vip1.json";
import meaningVip2 from "@/data/rooms/meaning_of_life_vip2.json";
import meaningVip3 from "@/data/rooms/meaning_of_life_vip3.json";
import { supabase } from "@/integrations/supabase/client";

const MeaningOfLife = () => {
  const [playingTier, setPlayingTier] = useState<string | null>(null);
  const audioRefs = {
    free: useRef<HTMLAudioElement>(null),
    vip1: useRef<HTMLAudioElement>(null),
    vip2: useRef<HTMLAudioElement>(null),
    vip3: useRef<HTMLAudioElement>(null),
  };

  useEffect(() => {
    document.title = "Meaning of Life — Mercy Blade";
  }, []);

  const toggleAudio = (tier: string) => {
    const audioRef = audioRefs[tier as keyof typeof audioRefs].current;
    
    // Stop all other audio
    Object.entries(audioRefs).forEach(([key, ref]) => {
      if (key !== tier && ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    if (audioRef) {
      if (playingTier === tier) {
        audioRef.pause();
        setPlayingTier(null);
      } else {
        audioRef.play();
        setPlayingTier(tier);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingTier(null);
  };

  const handleAudioError = async (tierKey: string, data: any) => {
    try {
      const englishText: string = data?.content?.en || data?.title?.en || 'Meaning of Life';
      const { data: ttsData, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: englishText,
          voice: 'alloy',
          roomSlug: 'meaning_of_life',
          entrySlug: tierKey,
        },
      });

      if (error) {
        console.error('TTS error:', error);
        return;
      }

      const url = (ttsData as any)?.audioUrl as string | undefined;
      const ref = audioRefs[tierKey as keyof typeof audioRefs].current;
      if (url && ref) {
        ref.src = url;
        ref.load();
      }
    } catch (e) {
      console.error('TTS fallback failed', e);
    }
  };

  const tiers = [
    { key: "free", data: meaningFree, audio: "/room-audio/meaning_of_life_free.mp3" },
    { key: "vip1", data: meaningVip1, audio: "/room-audio/meaning_of_life_vip1.mp3" },
    { key: "vip2", data: meaningVip2, audio: "/room-audio/meaning_of_life_vip2.mp3" },
    { key: "vip3", data: meaningVip3, audio: "/room-audio/meaning_of_life_vip3.mp3" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            The Meaning of Life
          </h1>
          <p className="text-muted-foreground text-lg">
            Ý Nghĩa Của Cuộc Sống
          </p>
        </div>

        <div className="grid gap-8">
          {tiers.map(({ key, data, audio }) => (
            <Card key={key} className="p-6 md:p-8 space-y-6 border-2 hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="text-sm font-medium text-primary/80">
                    {data.tier}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {data.title.en}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {data.title.vi}
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => toggleAudio(key)}
                  className="shrink-0"
                  variant={playingTier === key ? "default" : "outline"}
                >
                  {playingTier === key ? (
                    <VolumeX className="h-5 w-5 mr-2" />
                  ) : (
                    <Volume2 className="h-5 w-5 mr-2" />
                  )}
                  {playingTier === key ? "Pause" : "Play Audio"}
                </Button>
              </div>

              <audio
                ref={audioRefs[key as keyof typeof audioRefs]}
                src={audio}
                onEnded={handleAudioEnded}
                onError={() => handleAudioError(key, data)}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">English</h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {data.content.en}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Tiếng Việt</h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                    {data.content.vi}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeaningOfLife;
