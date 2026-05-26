/**
 * Accessibility Utilities
 * Helper functions and hooks for WCAG AA compliance
 */

import { useEffect, useRef } from "react";

/**
 * Focus Trap Hook
 * Traps focus within a container (for modals, dialogs)
 * 
 * Usage:
 *   const containerRef = useFocusTrap(isOpen);
 *   <div ref={containerRef}>...</div>
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  return containerRef;
}

/**
 * ESC Key Handler
 * Closes modal/dialog on ESC key press
 */
export function useEscapeKey(callback: () => void, isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [callback, isActive]);
}

/**
 * Announce to Screen Readers
 * Uses ARIA live regions to announce dynamic content
 */
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get Accessible Label
 * Generates accessible labels for common UI patterns
 */
export function getAccessibleLabel(type: string, context?: Record<string, any>): string {
  const labels: Record<string, string> = {
    close: "Close",
    menu: "Open menu",
    search: "Search",
    play: "Play audio",
    pause: "Pause audio",
    next: "Next entry",
    previous: "Previous entry",
    favorite: "Add to favorites",
    unfavorite: "Remove from favorites",
    share: "Share",
    settings: "Settings",
    profile: "Profile",
    theme: "Toggle theme",
    room: context?.title ? `Open room: ${context.title}` : "Open room",
  };

  return labels[type] || type;
}

/**
 * Debounce Hook for Inputs
 * Reduces CPU load for search bars and text inputs
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Click Guard
 * Prevents double-click duplicate submissions
 */
export function useClickGuard(delay: number = 1000) {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const guardedClick = (callback: () => void | Promise<void>) => {
    return async () => {
      if (isProcessing) return;

      setIsProcessing(true);
      try {
        await callback();
      } finally {
        setTimeout(() => setIsProcessing(false), delay);
      }
    };
  };

  return { guardedClick, isProcessing };
}

// Export React for hooks
import * as React from "react";
