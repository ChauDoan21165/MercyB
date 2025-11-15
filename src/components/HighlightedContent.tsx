import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { getKeywordColor } from '@/lib/keywordColors';

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
   */
  const highlightKeywords = (text: string): JSX.Element[] => {
    if (!enableHighlighting) {
      return [<span key="0">{text}</span>];
    }

    // Split text into words while preserving spaces and punctuation
    const parts: JSX.Element[] = [];
    let currentIndex = 0;
    
    // Match word boundaries, including hyphenated words and phrases
    const wordRegex = /\b[\w'-]+(?:\s+[\w'-]+)?\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[0];
      const startIndex = match.index;
      
      // Add text before the word
      if (startIndex > currentIndex) {
        parts.push(
          <span key={`text-${currentIndex}`}>
            {text.substring(currentIndex, startIndex)}
          </span>
        );
      }

      // Check if this word or phrase is a keyword
      const color = getKeywordColor(word);
      
      if (color) {
        parts.push(
          <span
            key={`keyword-${startIndex}`}
            style={{
              backgroundColor: color,
              padding: '2px 6px',
              borderRadius: '3px',
              fontWeight: '500'
            }}
          >
            {word}
          </span>
        );
      } else {
        parts.push(<span key={`word-${startIndex}`}>{word}</span>);
      }

      currentIndex = startIndex + word.length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${currentIndex}`}>
          {text.substring(currentIndex)}
        </span>
      );
    }

    return parts;
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
