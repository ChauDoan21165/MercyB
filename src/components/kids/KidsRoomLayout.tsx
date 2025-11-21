import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';
import { useUserAccess } from '@/hooks/useUserAccess';
import { useToast } from '@/hooks/use-toast';
import { AudioPlayer } from '@/components/AudioPlayer';
import { PairedHighlightedContentWithDictionary } from '@/components/PairedHighlightedContentWithDictionary';
import { setCustomKeywordMappings, clearCustomKeywordMappings, loadRoomKeywords } from '@/lib/customKeywordLoader';

interface KidsRoomLayoutProps {
  children?: ReactNode;
  backPath?: string;
  showRefresh?: boolean;
}

export const KidsRoomLayout = ({ children, backPath = '/kids-design-pack', showRefresh = true }: KidsRoomLayoutProps) => {
  const { roomData, loading, error, refreshRoom } = useKidsRoomContext();
  const { isAdmin } = useUserAccess();
  const { toast } = useToast();
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [keywordMenu, setKeywordMenu] = useState<string[]>([]);

  // Load keyword colors when room data changes (exactly like VIP rooms)
  useEffect(() => {
    if (!roomData) return;
    
    const loadKeywords = async () => {
      const customKeywords = await loadRoomKeywords(roomData.id);
      if (customKeywords.length > 0) {
        setCustomKeywordMappings(customKeywords);
      } else {
        clearCustomKeywordMappings();
      }
      
      // Extract keyword menu
      const allKeywords = roomData.entries.flatMap(e => e.keywords_en);
      setKeywordMenu(allKeywords);
    };
    
    loadKeywords();
    
    return () => clearCustomKeywordMappings();
  }, [roomData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading room data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-destructive">{error}</div>
          <Button onClick={refreshRoom}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">No room data available</div>
      </div>
    );
  }

  const handleBack = () => {
    window.location.href = backPath;
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomData.id);
    toast({
      title: "Copied!",
      description: `Room ID: ${roomData.id}`,
    });
  };

  const handleCopyJsonFilename = () => {
    const filename = `${roomData.id}.json`;
    navigator.clipboard.writeText(filename);
    toast({
      title: "Copied!",
      description: `JSON: ${filename}`,
    });
  };

  const handleAudioToggle = (audioPath: string) => {
    if (currentAudio === audioPath && isAudioPlaying) {
      setIsAudioPlaying(false);
    } else {
      setCurrentAudio(audioPath);
      setIsAudioPlaying(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Navigation Bar - exactly like VIP rooms */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Kids Area / Quay Lại
        </Button>
        
        <div className="flex items-center gap-2">
          {showRefresh && isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshRoom}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
        </div>
      </div>

      {/* Room Header - exactly like VIP rooms */}
      <div className="border-b pb-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleCopyJsonFilename}
                  className="w-[1em] h-[1em] rounded-full bg-primary hover:bg-primary/90 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy JSON filename"
                />
                <button
                  type="button"
                  onClick={handleCopyRoomId}
                  className="w-[1em] h-[1em] rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy Room ID"
                />
              </>
            )}
            <h2 className="text-lg font-semibold" style={{
              background: 'var(--gradient-rainbow)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {roomData.title.en === roomData.title.vi 
                ? roomData.title.en 
                : `${roomData.title.en} / ${roomData.title.vi}`}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {roomData.tier}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-primary">
            <span>Ages {roomData.meta.age_range} • {roomData.meta.entry_count} activities</span>
          </div>
        </div>
      </div>

      {/* Welcome Message and Room Essay - exactly like VIP rooms */}
      <Card className="p-4 shadow-soft bg-card border border-border">
        <div className="text-center space-y-0 mb-4">
          {keywordMenu.length > 0 ? (
            <p className="text-sm text-foreground leading-tight">
              Welcome to {roomData.title.en} Room, please click the keyword of the topic you want to discover / Chào mừng bạn đến với phòng {roomData.title.vi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
            </p>
          ) : (
            <p className="text-sm text-foreground leading-tight">
              Welcome to {roomData.title.en} Room / Chào mừng bạn đến với phòng {roomData.title.vi}
            </p>
          )}
        </div>

        {/* Room Essay with Dictionary - exactly like VIP rooms */}
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <PairedHighlightedContentWithDictionary
            englishContent={roomData.content.en}
            vietnameseContent={roomData.content.vi}
            roomKeywords={keywordMenu}
            onWordClick={() => {
              if (roomData.content.audio) {
                handleAudioToggle(roomData.content.audio);
              }
            }}
          />
        </div>

        {/* Audio Player */}
        {roomData.content.audio && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <Volume2 className="w-4 h-4" />
              <span>Introduction Audio:</span>
            </div>
            <AudioPlayer
              audioPath={`/audio/${roomData.content.audio}`}
              isPlaying={currentAudio === roomData.content.audio && isAudioPlaying}
              onPlayPause={() => handleAudioToggle(roomData.content.audio)}
              onEnded={() => setIsAudioPlaying(false)}
            />
          </div>
        )}
      </Card>

      {/* Custom Content */}
      {children}
    </div>
  );
};
