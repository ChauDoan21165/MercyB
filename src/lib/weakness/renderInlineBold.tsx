// src/lib/weakness/renderInlineBold.tsx
//
// Tiny markdown-bolding renderer for catalog strings. The catalog stores
// plain strings with `**word**` segments for emphasis; this helper splits
// them into React fragments wrapping the bold runs in <strong>.
//
// Scope is intentionally narrow: bold only, no links, no italics, no
// nested formatting. Extending later (e.g. to italics) is a one-line
// regex change + test addition.

import React from "react";

const BOLD_REGEX = /\*\*([^*]+)\*\*/g;

/**
 * Render a string containing `**word**` bold segments as a React node
 * array. Returns plain text unchanged when no bold markers are present.
 *
 * Example:
 *   renderInlineBold("Vietnamese **hôm qua** or **đã**")
 *     → ["Vietnamese ", <strong>hôm qua</strong>, " or ", <strong>đã</strong>]
 */
export function renderInlineBold(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  // Reset regex state; RegExp with /g is stateful across calls.
  BOLD_REGEX.lastIndex = 0;

  while ((match = BOLD_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={`b${key++}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
