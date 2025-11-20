import { HoveringDictionary } from "@/components/HoveringDictionary";

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
  const enText = englishText || englishContent || "";
  const viText = vietnameseText || vietnameseContent || "";

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

