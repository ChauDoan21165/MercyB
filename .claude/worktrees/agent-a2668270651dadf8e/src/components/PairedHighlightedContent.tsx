import { highlightPairedText } from "@/lib/wordColorHighlighter";
import { ProtectedContent } from "./ProtectedContent";

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
  // Support both prop naming conventions
  const enText = englishText || englishContent || "";
  const viText = vietnameseText || vietnameseContent || "";
  
  const { enHighlighted, viHighlighted } = highlightPairedText(enText, viText);
  
  return (
    <div className={className}>
      {/* English Content */}
      <div className="mb-3">
        <ProtectedContent content={enText} showCopyButton={true} />
      </div>
      
      {/* Audio bar would go here - passed from parent */}
      
      {/* Vietnamese Content */}
      {showVietnamese && (
        <>
          <hr className="border-border my-3" />
          <ProtectedContent content={viText} showCopyButton={true} />
        </>
      )}
    </div>
  );
};
