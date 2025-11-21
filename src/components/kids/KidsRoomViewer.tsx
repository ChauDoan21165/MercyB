import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';

interface RoomEntry {
  slug: string;
  keywords_en: string[];
  keywords_vi: string[];
  copy: {
    en: string;
    vi: string;
  };
  tags: string[];
  audio: string;
  audio_vi: string;
}

interface RoomData {
  id: string;
  tier: string;
  title: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
    audio: string;
  };
  entries: RoomEntry[];
  meta: {
    age_range: string;
    level: string;
    entry_count: number;
    room_color: string;
  };
}

export const KidsRoomViewer = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'vi'>('en');

  useEffect(() => {
    fetch('/data/alphabet_adventure_kids_l1.json')
      .then(res => res.json())
      .then(data => {
        setRoomData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load room data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Loading room data...</div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-destructive">Failed to load room data</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: roomData.meta.room_color }}>
              {roomData.title[language]}
            </h1>
            <p className="text-muted-foreground mt-2">
              {roomData.tier} • Ages {roomData.meta.age_range} • {roomData.meta.entry_count} activities
            </p>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Switch to {language === 'en' ? 'Tiếng Việt' : 'English'}
          </button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed">{roomData.content[language]}</p>
            {roomData.content.audio && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Audio: {roomData.content.audio}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Entries */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Activities</h2>
        {roomData.entries.filter(entry => entry.slug !== 'all').map((entry, index) => (
          <Card key={entry.slug} className="overflow-hidden">
            <CardHeader className="bg-muted/50" style={{ borderLeftColor: roomData.meta.room_color, borderLeftWidth: '4px' }}>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">
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
            <CardContent className="pt-6 space-y-4">
              <p className="text-base leading-relaxed whitespace-pre-line">
                {entry.copy[language]}
              </p>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>Audio: {language === 'en' ? entry.audio : entry.audio_vi}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Keywords:</strong> {entry[language === 'en' ? 'keywords_en' : 'keywords_vi'].join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
