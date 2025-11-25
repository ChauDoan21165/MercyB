import { ProtectedContent } from './ProtectedContent';

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
  return (
    <ProtectedContent content={content} className={className} />
  );
};
