import { ProtectedContent } from './ProtectedContent';

interface HighlightedContentProps {
  content: string;
  className?: string;
  enableHighlighting?: boolean;
  showShadowingReminder?: boolean;
  showCopyButton?: boolean;
}

/**
 * HighlightedContent Component
 * Extends StrictProtectedContent with psychology-based keyword highlighting
 * Automatically detects and highlights keywords with their associated colors
 * Optional copy button for admin users
 */
export const HighlightedContent = ({ 
  content, 
  className = '', 
  enableHighlighting = true,
  showShadowingReminder = false,
  showCopyButton = true
}: HighlightedContentProps) => {
  return (
    <ProtectedContent 
      content={content} 
      className={className}
      showCopyButton={showCopyButton}
    />
  );
};
