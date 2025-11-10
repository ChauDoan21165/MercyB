import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface MessageActionsProps {
  text: string;
  roomId: string;
}

export const MessageActions = ({ text, roomId }: MessageActionsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
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

  return (
    <div className="flex gap-2 mt-3 opacity-70 hover:opacity-100 transition-opacity">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-8 px-3 gap-2 text-xs"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Copy</span>
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="h-8 px-3 gap-2 text-xs"
      >
        <Share2 className="w-3 h-3" />
        <span>Share</span>
      </Button>
    </div>
  );
};
