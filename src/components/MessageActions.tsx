import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserAccess } from "@/hooks/useUserAccess";

interface MessageActionsProps {
  text: string;
  roomId: string;
}

export const MessageActions = ({ text, roomId }: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { toast } = useToast();
  const { canAccessVIP1 } = useUserAccess();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied! / Đã sao chép!",
        description: "Advice copied to clipboard / Lời khuyên đã được sao chép",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy / Sao chép thất bại",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/chat/${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Health Consultation Room",
          text: "Check out this health consultation room",
          url: url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied! / Đã sao chép liên kết!",
          description: "Share this link with others / Chia sẻ liên kết này với người khác",
          duration: 3000,
        });
      } catch (err) {
        toast({
          title: "Failed to copy link / Sao chép liên kết thất bại",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
  };

  const handlePlayAudio = async () => {
    // Check VIP access
    if (!canAccessVIP1) {
      toast({
        title: "VIP Required / Yêu Cầu VIP",
        description: "Audio playback is available for VIP members. / Phát âm thanh dành cho thành viên VIP.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      // PRIORITY 1: Check for manually uploaded MP3 in storage
      const { data: uploadedFiles } = await supabase.storage
        .from('room-audio-uploads')
        .list(roomId, {
          search: '.mp3'
        });

      if (uploadedFiles && uploadedFiles.length > 0) {
        // Use first uploaded MP3 file
        const { data: urlData } = supabase.storage
          .from('room-audio-uploads')
          .getPublicUrl(`${roomId}/${uploadedFiles[0].name}`);
        
        console.log('Playing manually uploaded audio');
        const audio = new Audio(urlData.publicUrl);
        
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          toast({
            title: "Playback Error / Lỗi Phát",
            description: "Failed to play audio / Không thể phát âm thanh",
            variant: "destructive",
          });
        };

        await audio.play();
        return;
      }

      // PRIORITY 2: Check for TTS-generated cached audio
      const englishText = text.split('\n\n')[0] || text;
      const textHash = englishText.substring(0, 100).replace(/[^a-z0-9]/gi, '_').substring(0, 50);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voice: 'alloy',
          roomSlug: roomId,
          entrySlug: textHash
        }
      });

      if (error) throw error;

      if (data?.audioUrl) {
        const audio = new Audio(data.audioUrl);
        
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          toast({
            title: "Playback Error / Lỗi Phát",
            description: "Failed to play audio / Không thể phát âm thanh",
            variant: "destructive",
          });
        };

        await audio.play();
        console.log(data.cached ? 'Playing TTS cached audio' : 'Playing new TTS audio');
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setIsPlayingAudio(false);
      toast({
        title: "Error / Lỗi",
        description: "Failed to play audio / Không thể phát âm thanh",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 px-2 text-xs"
      >
        {copied ? (
          <Check className="w-3 h-3 mr-1" />
        ) : (
          <Copy className="w-3 h-3 mr-1" />
        )}
        {copied ? "Copied" : "Copy"}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-7 px-2 text-xs"
      >
        <Share2 className="w-3 h-3 mr-1" />
        Share
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayAudio}
        disabled={isPlayingAudio}
        className="h-7 px-2 text-xs"
        title="Listen to English audio (VIP only)"
      >
        <Volume2 className={`w-3 h-3 mr-1 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
        {isPlayingAudio ? "Playing..." : "Audio"}
      </Button>
    </div>
  );
};
