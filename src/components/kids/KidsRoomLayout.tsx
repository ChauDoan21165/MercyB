import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { useKidsRoomContext } from '@/contexts/KidsRoomContext';

interface KidsRoomLayoutProps {
  children?: ReactNode;
  backPath?: string;
  showRefresh?: boolean;
}

export const KidsRoomLayout = ({ children, backPath = '/kids-design-pack', showRefresh = true }: KidsRoomLayoutProps) => {
  const { roomData, loading, error, refreshRoom } = useKidsRoomContext();

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
          Back to Kids Area
        </Button>
        
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

      {/* Room Header */}
      <div className="space-y-4">
        <div>
          <div className="mb-2">
            <h1 className="text-4xl font-bold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
              {roomData.title.en}
            </h1>
            <h2 className="text-3xl font-semibold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
              {roomData.title.vi}
            </h2>
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
            </div>
            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-2 bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
                TIẾNG VIỆT
              </h3>
              <p className="text-lg leading-relaxed">{roomData.content.vi}</p>
            </div>
            {roomData.content.audio && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
                <Volume2 className="w-4 h-4" />
                <span>Audio: {roomData.content.audio}</span>
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
