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
  const { canAccessVIP3 } = useUserAccess();

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
    // Check VIP3 access
    if (!canAccessVIP3) {
      toast({
        title: "VIP 3 Only / Chỉ Dành Cho VIP 3",
        description: "Audio playback is only available for VIP 3 members. / Phát âm thanh chỉ dành cho thành viên VIP 3.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to audio and play
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsPlayingAudio(false);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          setIsPlayingAudio(false);
          toast({
            title: "Playback Error / Lỗi Phát",
            description: "Failed to play audio / Không thể phát âm thanh",
            variant: "destructive",
          });
        };

        await audio.play();
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlayingAudio(false);
      toast({
        title: "Error / Lỗi",
        description: "Failed to generate audio / Không thể tạo âm thanh",
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
        title="Listen to English audio (VIP 3 only)"
      >
        <Volume2 className={`w-3 h-3 mr-1 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
        {isPlayingAudio ? "Playing..." : "Audio"}
      </Button>
    </div>
  );
};
