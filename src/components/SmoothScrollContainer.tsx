/**
 * Smooth Scroll Container
 * Provides smooth scrolling with scroll anchoring
 */

import { ReactNode, useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SmoothScrollContainerProps {
  children: ReactNode;
  className?: string;
  autoScrollToBottom?: boolean;
  maintainScrollAnchor?: boolean;
}

export const SmoothScrollContainer = forwardRef<HTMLDivElement, SmoothScrollContainerProps>(
  ({ children, className, autoScrollToBottom = false, maintainScrollAnchor = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastScrollHeightRef = useRef(0);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      if (autoScrollToBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }

      lastScrollHeightRef.current = container.scrollHeight;
    }, [children, autoScrollToBottom]);

    // Maintain scroll position when new content loads above
    useEffect(() => {
      if (!maintainScrollAnchor) return;
      
      const container = containerRef.current;
      if (!container) return;

      const scrollHeightDiff = container.scrollHeight - lastScrollHeightRef.current;
      if (scrollHeightDiff > 0 && container.scrollTop > 0) {
        container.scrollTop += scrollHeightDiff;
      }

      lastScrollHeightRef.current = container.scrollHeight;
    }, [children, maintainScrollAnchor]);

    return (
      <div
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn('scroll-smooth', className)}
      >
        {children}
      </div>
    );
  }
);

SmoothScrollContainer.displayName = 'SmoothScrollContainer';
