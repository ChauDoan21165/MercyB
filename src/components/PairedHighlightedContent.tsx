import { highlightPairedText } from "@/lib/wordColorHighlighter";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PairedHighlightedContentProps {
  englishText?: string;
  vietnameseText?: string;
  englishContent?: string;
  vietnameseContent?: string;
  showVietnamese?: boolean;
  showShadowingReminder?: boolean;
  className?: string;
}

export const PairedHighlightedContent = ({ 
  englishText,
  vietnameseText,
  englishContent,
  vietnameseContent,
  showVietnamese = true,
  showShadowingReminder = false,
  className = "" 
}: PairedHighlightedContentProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Support both prop naming conventions
  const enText = englishText || englishContent || "";
  const viText = vietnameseText || vietnameseContent || "";
  
  const { enHighlighted, viHighlighted } = highlightPairedText(enText, viText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(viText);
      setCopied(true);
      toast({
        title: "Copied / Đã sao chép",
        description: "Vietnamese text copied to clipboard / Văn bản tiếng Việt đã được sao chép",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy / Sao chép thất bại",
        description: "Could not copy text / Không thể sao chép văn bản",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-3">
        <div className="text-sm leading-relaxed">
          {enHighlighted}
        </div>
      </div>
      
      {showVietnamese && (
        <>
          <hr className="border-border my-3" />
          <div>
            <div className="text-sm leading-relaxed">
              {viHighlighted}
            </div>
            <div className="mt-3 flex gap-2 opacity-70 hover:opacity-100 transition-opacity">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};
