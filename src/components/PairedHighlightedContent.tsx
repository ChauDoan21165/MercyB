import { highlightPairedText } from "@/lib/wordColorHighlighter";

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
      <div className="mb-3">
        <div className="text-sm leading-relaxed">
          {enHighlighted}
        </div>
      </div>
      
      {showShadowingReminder && (
        <p className="text-xs text-muted-foreground italic mt-2 mb-3">
          💡 Try shadowing: Listen and repeat along with the audio to improve your pronunciation and fluency.
        </p>
      )}
      
      {showVietnamese && (
        <>
          <hr className="border-border my-3" />
          <div>
            <div className="text-sm leading-relaxed">
              {viHighlighted}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
