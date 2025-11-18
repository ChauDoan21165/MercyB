import { highlightPairedText } from "@/lib/wordColorHighlighter";

interface PairedHighlightedContentProps {
  englishContent: string;
  vietnameseContent: string;
  className?: string;
}

export const PairedHighlightedContent = ({ 
  englishContent, 
  vietnameseContent, 
  className = "" 
}: PairedHighlightedContentProps) => {
  const { enHighlighted, viHighlighted } = highlightPairedText(englishContent, vietnameseContent);
  
  return (
    <div className={className}>
      <div className="mb-3">
        <div className="text-sm leading-relaxed">
          {enHighlighted}
        </div>
      </div>
      <hr className="border-border my-3" />
      <div>
        <div className="text-sm leading-relaxed">
          {viHighlighted}
        </div>
      </div>
    </div>
  );
};
