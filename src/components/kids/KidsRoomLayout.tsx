import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Volume2, Copy } from 'lucide-react';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';
import { useUserAccess } from '@/hooks/useUserAccess';
import { useToast } from '@/hooks/use-toast';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MessageActions } from '@/components/MessageActions';

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
      {/* Navigation Bar */}
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
          {showRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshRoom}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Room Header */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            {isAdmin && (
              <>
                <button
                  onClick={handleCopyJsonFilename}
                  className="w-[1em] h-[1em] rounded-full bg-primary hover:bg-primary/90 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy JSON filename"
                />
                <button
                  onClick={handleCopyRoomId}
                  className="w-[1em] h-[1em] rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy Room ID"
                />
              </>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                {roomData.title.en}
              </h1>
              <h2 className="text-3xl font-semibold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                {roomData.title.vi}
              </h2>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">
            {roomData.tier} • Ages {roomData.meta.age_range} • {roomData.meta.entry_count} activities
          </p>
        </div>

        <Card className="border-2" style={{ borderColor: roomData.meta.room_color }}>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                ENGLISH
              </h3>
              <p className="text-lg leading-relaxed">{roomData.content.en}</p>
              <MessageActions text={roomData.content.en} roomId={roomData.id} />
            </div>
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                TIẾNG VIỆT
              </h3>
              <p className="text-lg leading-relaxed">{roomData.content.vi}</p>
              <MessageActions text={roomData.content.vi} roomId={roomData.id} />
            </div>
            {roomData.content.audio && (
              <div className="mt-4 border-t pt-4">
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
          </CardContent>
        </Card>
      </div>

      {/* Custom Content */}
      {children}
    </div>
  );
};
