import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface MessageActionsProps {
  text: string;
  viText?: string;
  roomId: string;
}

export const MessageActions = ({ text, viText, roomId }: MessageActionsProps) => {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedVi, setCopiedVi] = useState(false);
  const { toast } = useToast();

  const handleCopyEn = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
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

  const handleCopyVi = async () => {
    if (!viText) return;
    try {
      await navigator.clipboard.writeText(viText);
      setCopiedVi(true);
      setTimeout(() => setCopiedVi(false), 2000);
      toast({
        title: "Copied! / Đã sao chép!",
        description: "Vietnamese advice copied / Lời khuyên tiếng Việt đã được sao chép",
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

  return (
    <div className="flex gap-2 opacity-70 hover:opacity-100 transition-opacity">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyEn}
        className="h-8 px-3 gap-2 text-xs"
      >
        {copiedEn ? (
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

      {viText && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyVi}
          className="h-8 px-3 gap-2 text-xs"
        >
          {copiedVi ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied VN</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy VN</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};
