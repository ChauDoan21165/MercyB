import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HoveringDictionary } from "@/components/HoveringDictionary";
import { useAdminCheck } from "@/hooks/useAdminCheck";

interface PairedHighlightedContentWithDictionaryProps {
  englishText?: string;
  vietnameseText?: string;
  englishContent?: string;
  vietnameseContent?: string;
  showVietnamese?: boolean;
  roomKeywords?: string[];
  className?: string;
  onWordClick?: () => void;
}

export const PairedHighlightedContentWithDictionary = ({ 
  englishText,
  vietnameseText,
  englishContent,
  vietnameseContent,
  showVietnamese = true,
  roomKeywords = [],
  className = "",
  onWordClick
}: PairedHighlightedContentWithDictionaryProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdminCheck();

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
        <HoveringDictionary 
          key={idx} 
          word={token} 
          roomKeywords={roomKeywords}
          roomContent={enText}
          onWordClick={onWordClick}
        >
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
          </div>
        </>
      )}
    </div>
  );
};

