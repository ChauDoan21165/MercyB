import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';

export const KidsRoomContent = () => {
  const { roomData } = useKidsRoomContext();

  if (!roomData) return null;

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
            <div>
              <h4 className="text-sm font-semibold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                ENGLISH
              </h4>
              <p className="text-base leading-relaxed whitespace-pre-line">
                {entry.copy.en}
              </p>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>Keywords:</strong> {entry.keywords_en.join(', ')}
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="text-sm font-semibold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                TIẾNG VIỆT
              </h4>
              <p className="text-base leading-relaxed whitespace-pre-line">
                {entry.copy.vi}
              </p>
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>Từ khóa:</strong> {entry.keywords_vi.join(', ')}
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Audio (EN): {entry.audio}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Audio (VI): {entry.audio_vi}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
