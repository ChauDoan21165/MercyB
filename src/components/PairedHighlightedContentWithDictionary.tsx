import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HoveringDictionary } from "@/components/HoveringDictionary";

interface PairedHighlightedContentWithDictionaryProps {
  englishText?: string;
  vietnameseText?: string;
  englishContent?: string;
  vietnameseContent?: string;
  showVietnamese?: boolean;
  roomKeywords?: string[];
  className?: string;
}

export const PairedHighlightedContentWithDictionary = ({ 
  englishText,
  vietnameseText,
  englishContent,
  vietnameseContent,
  showVietnamese = true,
  roomKeywords = [],
  className = "" 
}: PairedHighlightedContentWithDictionaryProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const enText = englishText || englishContent || "";
  const viText = vietnameseText || vietnameseContent || "";

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

  // Split text into words and wrap each with dictionary
  const renderTextWithDictionary = (text: string) => {
    // Split by spaces and punctuation while keeping punctuation
    const tokens = text.split(/(\s+|[.,!?;:])/);
    
    return tokens.map((token, idx) => {
      // If it's whitespace or punctuation, render as is
      if (/^\s+$/.test(token) || /^[.,!?;:]$/.test(token)) {
        return <span key={idx}>{token}</span>;
      }
      
      // Otherwise, wrap word with dictionary
      return (
        <HoveringDictionary key={idx} word={token} roomKeywords={roomKeywords}>
          {token}
        </HoveringDictionary>
      );
    });
  };
  
  return (
    <div className={className}>
      <div className="mb-3">
        <div className="text-sm leading-relaxed">
          {renderTextWithDictionary(enText)}
        </div>
      </div>
      
      {showVietnamese && (
        <>
          <hr className="border-border my-3" />
          <div>
            <div className="text-sm leading-relaxed">
              {viText}
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

