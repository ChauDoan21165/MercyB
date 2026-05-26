import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { highlightTextByRules } from '@/lib/wordColorHighlighter';

interface StrictProtectedContentProps {
  content: string;
  className?: string;
}

export const StrictProtectedContent = ({ content, className = '' }: StrictProtectedContentProps) => {
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

  return (
    <div 
      ref={contentRef}
      className={`relative ${className}`}
    >
      <div 
        className="text-base leading-relaxed whitespace-pre-wrap select-none cursor-default"
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {highlightTextByRules(content, false)}
      </div>
    </div>
  );
};
