import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { getEmotionKeywordColor } from '@/lib/emotionKeywordColors';

interface HighlightedContentProps {
  content: string;
  className?: string;
  enableHighlighting?: boolean;
}

/**
 * HighlightedContent Component
 * Extends StrictProtectedContent with psychology-based keyword highlighting
 * Automatically detects and highlights keywords with their associated colors
 */
export const HighlightedContent = ({ 
  content, 
  className = '', 
  enableHighlighting = true 
}: HighlightedContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;

    // Prevent keyboard shortcuts for copying
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'a' || e.key === 'A' || e.key === 'c' || e.key === 'C')
      ) {
        e.preventDefault();
        toast({
          title: "Protected Content",
          description: "Content copying is restricted",
          variant: "destructive"
        });
      }
    };

    // Prevent context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({
        title: "Protected Content",
        description: "Right-click is disabled on this content",
        variant: "destructive"
      });
    };

    // Prevent drag selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    element.addEventListener('keydown', handleKeyDown as any);
    element.addEventListener('contextmenu', handleContextMenu as any);
    element.addEventListener('selectstart', handleSelectStart);

    return () => {
      element.removeEventListener('keydown', handleKeyDown as any);
      element.removeEventListener('contextmenu', handleContextMenu as any);
      element.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  /**
   * Highlight keywords in the content with their psychology-based colors
   * Supports both English and Vietnamese text with proper Unicode handling
   */
  const highlightKeywords = (text: string): JSX.Element[] => {
    if (!enableHighlighting) {
      return [<span key="0">{text}</span>];
    }

    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    
    // Enhanced regex that supports Vietnamese Unicode characters
    // Matches single words and multi-word phrases (up to 5 words)
    const wordRegex = /[\p{L}\p{M}'-]+(?:\s+[\p{L}\p{M}'-]+){0,4}/gu;
    let match;
    const matches: Array<{ text: string; index: number; color: string | null }> = [];

    // First pass: collect all potential matches
    while ((match = wordRegex.exec(text)) !== null) {
      const matchedText = match[0];
      const startIndex = match.index;
      
      // Try to match the full phrase first, then progressively shorter versions
      let color = null;
      let bestMatch = '';
      
      // Split into words and try different combinations
      const words = matchedText.split(/\s+/);
      
      // Try full phrase first
      color = getEmotionKeywordColor(matchedText);
      if (color) {
        bestMatch = matchedText;
      } else {
        // Try progressively shorter phrases from the start
        for (let len = words.length; len >= 1; len--) {
          const phrase = words.slice(0, len).join(' ');
          color = getEmotionKeywordColor(phrase);
          if (color) {
            bestMatch = phrase;
            break;
          }
        }
      }
      
      if (bestMatch) {
        matches.push({
          text: bestMatch,
          index: startIndex,
          color: color!
        });
      }
    }

    // Sort matches by index to process in order
    matches.sort((a, b) => a.index - b.index);

    // Second pass: build the highlighted content
    matches.forEach((matchData, idx) => {
      const { text: matchedText, index: startIndex, color } = matchData;
      
      // Add text before this match
      if (startIndex > currentIndex) {
        parts.push(
          <span key={`text-${currentIndex}-${idx}`}>
            {text.substring(currentIndex, startIndex)}
          </span>
        );
      }

      // Add the highlighted keyword
      parts.push(
        <span
          key={`keyword-${startIndex}-${idx}`}
          style={{
            backgroundColor: color,
            padding: '2px 6px',
            borderRadius: '3px',
            fontWeight: '500'
          }}
        >
          {matchedText}
        </span>
      );

      currentIndex = startIndex + matchedText.length;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-end-${currentIndex}`}>
          {text.substring(currentIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : [<span key="0">{text}</span>];
  };

  /**
   * Process multi-line content
   */
  const renderHighlightedContent = () => {
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => (
      <span key={`line-${lineIndex}`}>
        {highlightKeywords(line)}
        {lineIndex < lines.length - 1 && '\n'}
      </span>
    ));
  };

  return (
    <div 
      ref={contentRef}
      className={`relative ${className}`}
    >
      <span 
        className="text-base leading-relaxed whitespace-pre-wrap select-none cursor-default"
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {renderHighlightedContent()}
      </span>
    </div>
  );
};
