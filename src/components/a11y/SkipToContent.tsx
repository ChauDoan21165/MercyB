/**
 * Skip to Content Button
 * Accessible skip link that appears on keyboard focus
 * Allows keyboard users to skip navigation and go directly to main content
 */

import { A11Y_CONFIG } from "@/config/a11y";

export function SkipToContent() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById(A11Y_CONFIG.skipToContentId);
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${A11Y_CONFIG.skipToContentId}`}
      onClick={handleSkip}
      className="
        sr-only focus:not-sr-only
        focus:absolute focus:top-4 focus:left-4 focus:z-[9999]
        bg-primary text-primary-foreground
        px-4 py-2 rounded-md
        focus-ring
        font-medium
      "
    >
      Skip to main content
    </a>
  );
}
