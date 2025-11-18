import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { highlightTextByRules } from '@/lib/wordColorHighlighter';

interface HighlightedContentProps {
  content: string;
  className?: string;
  enableHighlighting?: boolean;
  showShadowingReminder?: boolean;
}

/**
 * HighlightedContent Component
 * Extends StrictProtectedContent with psychology-based keyword highlighting
 * Automatically detects and highlights keywords with their associated colors
 */
export const HighlightedContent = ({ 
  content, 
  className = '', 
  enableHighlighting = true,
  showShadowingReminder = false
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
   * Highlight keywords in the content with their semantic category-based colors
   * Uses the word-color-rule.json system for consistent coloring
   */
  const highlightKeywords = (text: string): JSX.Element[] => {
    if (!enableHighlighting) {
      return [<span key="0">{text}</span>];
    }

    // Auto-detect language: if text contains Vietnamese characters, treat as Vietnamese
    const isVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
    return highlightTextByRules(text, isVietnamese);
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
