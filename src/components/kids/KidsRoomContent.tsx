import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';
import { AudioPlayer } from '@/components/AudioPlayer';
import { PairedHighlightedContentWithDictionary } from '@/components/PairedHighlightedContentWithDictionary';

export const KidsRoomContent = () => {
  const { roomData } = useKidsRoomContext();
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  if (!roomData) return null;

  const handleAudioToggle = (audioPath: string) => {
    if (currentAudio === audioPath && isAudioPlaying) {
      setIsAudioPlaying(false);
    } else {
      setCurrentAudio(audioPath);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
        Activities / Hoạt Động
      </h2>
      
      {roomData.entries.filter(entry => entry.slug !== 'all').map((entry, index) => (
        <Card 
          key={entry.slug} 
          className="overflow-hidden border-2" 
          style={{ borderLeftColor: roomData.meta.room_color, borderLeftWidth: '4px' }}
        >
          <CardHeader className="bg-muted/50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                  Activity {index + 1}: {entry.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <PairedHighlightedContentWithDictionary
                englishContent={entry.copy.en}
                vietnameseContent={entry.copy.vi}
                roomKeywords={[...entry.keywords_en, ...entry.keywords_vi]}
                onWordClick={() => {
                  if (entry.audio && currentAudio !== entry.audio) {
                    handleAudioToggle(entry.audio);
                  }
                }}
              />
              <div className="mt-3 pt-3 border-t border-border/30 text-sm text-muted-foreground">
                <div>
                  <strong>Keywords:</strong> {entry.keywords_en.join(', ')}
                </div>
                <div>
                  <strong>Từ khóa:</strong> {entry.keywords_vi.join(', ')}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Audio (English):</span>
                </div>
                <AudioPlayer
                  audioPath={`/audio/${entry.audio}`}
                  isPlaying={currentAudio === entry.audio && isAudioPlaying}
                  onPlayPause={() => handleAudioToggle(entry.audio)}
                  onEnded={() => setIsAudioPlaying(false)}
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Audio (Tiếng Việt):</span>
                </div>
                <AudioPlayer
                  audioPath={`/audio/${entry.audio_vi}`}
                  isPlaying={currentAudio === entry.audio_vi && isAudioPlaying}
                  onPlayPause={() => handleAudioToggle(entry.audio_vi)}
                  onEnded={() => setIsAudioPlaying(false)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
