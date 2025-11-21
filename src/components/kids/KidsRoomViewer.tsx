import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserAccess } from "@/hooks/useUserAccess";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PairedHighlightedContentWithDictionary } from "@/components/PairedHighlightedContentWithDictionary";
import { setCustomKeywordMappings, clearCustomKeywordMappings, loadRoomKeywords } from "@/lib/customKeywordLoader";

interface KidsRoomData {
  id: string;
  tier: string;
  title: { en: string; vi: string };
  content: { en: string; vi: string; audio: string };
  entries: Array<{
    slug: string;
    keywords_en: string[];
    keywords_vi: string[];
    copy: { en: string; vi: string };
    tags: string[];
    audio: string;
    audio_vi: string;
  }>;
  meta: {
    age_range: string;
    level: string;
    entry_count: number;
    room_color: string;
  };
}

/**
 * Kids Room Viewer - Built on VIP6/ChatHub Standard
 * 
 * This component reuses the EXACT same pattern as VIP rooms:
 * - Rainbow gradient titles
 * - "Click keyword to discover" welcome message
 * - Clickable keyword buttons (EN / VI pairs)
 * - PairedHighlightedContentWithDictionary for all text
 * - Keyword coloring system (loadRoomKeywords)
 * - Admin copy buttons (JSON filename, Room ID)
 * - AudioPlayer with full controls
 * 
 * NO custom Kids-specific layout patterns - everything matches VIP rooms.
 */
export const KidsRoomViewer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useUserAccess();
  const [roomData, setRoomData] = useState<KidsRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keywordMenu, setKeywordMenu] = useState<{ en: string[]; vi: string[] }>({ en: [], vi: [] });
  const [clickedKeyword, setClickedKeyword] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const roomId = 'alphabet_adventure_kids_l1'; // Default Kids room

  // Load room data (exactly like VIP rooms load from /data/)
  useEffect(() => {
    const loadRoom = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/data/${roomId}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load room: ${response.statusText}`);
        }
        const data = await response.json();
        setRoomData(data);

        // Load keyword colors (exactly like VIP rooms)
        const customKeywords = await loadRoomKeywords(roomId);
        if (customKeywords.length > 0) {
          setCustomKeywordMappings(customKeywords);
        } else {
          clearCustomKeywordMappings();
        }

        // Build keyword menu from entries (exactly like VIP rooms)
        const allKeywordsEn: string[] = [];
        const allKeywordsVi: string[] = [];
        
        data.entries.forEach((entry: any) => {
          if (entry.slug !== 'all') {
            entry.keywords_en.forEach((kw: string, idx: number) => {
              if (!allKeywordsEn.includes(kw)) {
                allKeywordsEn.push(kw);
                allKeywordsVi.push(entry.keywords_vi[idx] || kw);
              }
            });
          }
        });
        
        setKeywordMenu({ en: allKeywordsEn, vi: allKeywordsVi });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load room data';
        setError(errorMessage);
        console.error('Failed to load Kids room:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
    
    return () => clearCustomKeywordMappings();
  }, [roomId]);

  const handleBack = () => {
    navigate('/kids-design-pack');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCopyJsonFilename = () => {
    navigator.clipboard.writeText(`${roomId}.json`);
    toast({ title: "Copied!", description: `JSON: ${roomId}.json` });
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({ title: "Copied!", description: `Room ID: ${roomId}` });
  };

  const handleAudioToggle = (audioPath: string) => {
    if (currentAudio === audioPath && isAudioPlaying) {
      setIsAudioPlaying(false);
    } else {
      setCurrentAudio(audioPath);
      setIsAudioPlaying(true);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setClickedKeyword(keyword);
    
    // Find matching entry and play audio (exactly like VIP rooms)
    const entry = roomData?.entries.find(e => 
      e.slug !== 'all' && (e.keywords_en.includes(keyword) || e.keywords_vi.includes(keyword))
    );
    
    if (entry?.audio) {
      handleAudioToggle(entry.audio);
      
      // Scroll to activities section
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading room data...</div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-lg text-destructive">{error || 'No room data available'}</div>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Navigation Bar - Exactly like VIP rooms */}
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
        
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}
      </div>

      {/* Room Header - Exactly like VIP rooms */}
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

      {/* Welcome Message, Essay, and Keyword Menu - Exactly like VIP rooms */}
      <Card className="p-4 shadow-soft bg-card border border-border">
        <div className="text-center space-y-0 mb-4">
          {keywordMenu.en.length > 0 ? (
            <p className="text-sm text-foreground leading-tight">
              Welcome to {roomData.title.en} Room, please click the keyword of the topic you want to discover / Chào mừng bạn đến với phòng {roomData.title.vi}, vui lòng nhấp vào từ khóa của chủ đề bạn muốn khám phá
            </p>
          ) : (
            <p className="text-sm text-foreground leading-tight">
              Welcome to {roomData.title.en} Room / Chào mừng bạn đến với phòng {roomData.title.vi}
            </p>
          )}
        </div>

        {/* Room Essay with Dictionary - Exactly like VIP rooms */}
        <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <PairedHighlightedContentWithDictionary
            englishContent={roomData.content.en}
            vietnameseContent={roomData.content.vi}
            roomKeywords={keywordMenu.en}
            onWordClick={() => {
              if (roomData.content.audio) {
                handleAudioToggle(roomData.content.audio);
              }
            }}
          />
        </div>

        {/* Clickable Keyword Menu - Exactly like VIP rooms */}
        {keywordMenu.en.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {keywordMenu.en.map((keywordEn, idx) => {
                const keywordVi = keywordMenu.vi[idx] || '';
                const isClicked = clickedKeyword === keywordEn || clickedKeyword === keywordVi;
                return (
                  <Button
                    key={`pair-${idx}`}
                    variant={isClicked ? "default" : "outline"}
                    size="sm"
                    className="text-xs cursor-pointer"
                    onClick={() => handleKeywordClick(keywordEn)}
                  >
                    {isAdmin && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const entry = roomData.entries.find(ent => 
                            ent.keywords_en.includes(keywordEn)
                          );
                          if (entry?.audio) {
                            const audioPath = `/audio/${entry.audio}`;
                            navigator.clipboard.writeText(audioPath);
                            toast({ title: "Copied!", description: `Audio: ${audioPath}` });
                          }
                        }}
                        className="inline-flex w-[1em] h-[1em] rounded-full bg-destructive hover:bg-destructive/90 mr-2 align-middle cursor-pointer"
                        title="Copy audio filename"
                      />
                    )}
                    {keywordEn} / {keywordVi}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Introduction Audio - Exactly like VIP rooms */}
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

      {/* Activities Section - Exactly like VIP entry cards */}
      <div ref={endRef} className="space-y-6">
        <h2 className="text-2xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
          Activities / Hoạt Động
        </h2>
        
        {roomData.entries.filter(entry => entry.slug !== 'all').map((entry, index) => (
          <Card 
            key={entry.slug} 
            className="overflow-hidden border-2" 
            style={{ borderLeftColor: roomData.meta.room_color, borderLeftWidth: '4px' }}
          >
            <div className="bg-muted/50 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                    Activity {index + 1}: {entry.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Entry Content with Dictionary - Exactly like VIP rooms */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <PairedHighlightedContentWithDictionary
                  englishContent={entry.copy.en}
                  vietnameseContent={entry.copy.vi}
                  roomKeywords={entry.keywords_en}
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
              
              {/* Audio Players - Exactly like VIP rooms */}
              <div className="space-y-4">
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
