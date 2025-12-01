import { useEffect, useRef, useState } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { highlightTextByRules } from '@/lib/wordColorHighlighter';

interface ProtectedContentProps {
  content: string;
  className?: string;
  showCopyButton?: boolean;
}

export const ProtectedContent = ({ 
  content, 
  className = '', 
  showCopyButton: showCopyButtonProp = true 
}: ProtectedContentProps) => {
  const { isAdmin } = useAdminCheck();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showCopyButton, setShowCopyButton] = useState(false);

  useEffect(() => {
    if (!contentRef.current || isAdmin) return;

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
  }, [isAdmin]);

  const handleAdminCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content",
        variant: "destructive"
      });
    }
  };

  return (
    <div 
      ref={contentRef}
      className={`relative ${className}`}
      onMouseEnter={() => isAdmin && setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div 
        className={`text-base leading-relaxed whitespace-pre-wrap ${
          !isAdmin ? 'select-none cursor-default' : ''
        }`}
        style={!isAdmin ? { 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        } : undefined}
      >
        {highlightTextByRules(content, false)}
      </div>
      
      {isAdmin && showCopyButton && showCopyButtonProp && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAdminCopy}
          className="absolute top-0 right-0 opacity-80 hover:opacity-100"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
