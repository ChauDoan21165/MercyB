// src/components/home/CardSkeleton.tsx
//
// Placeholder rendered while a below-the-fold home card's lazy chunk
// loads. The goal is CLS — the skeleton must reserve close to the real
// card's vertical space so the page doesn't jump when the card hydrates.
//
// Default height (140 px) is the median of the seven cards lazy-loaded
// in src/pages/Home.tsx. Call sites pass `className` to override for
// cards that diverge meaningfully (e.g. LeaderboardCard ~220 px).
//
// Tailwind tokens reused from src/components/ui/loading-skeleton.tsx:
//   bg-muted/50  — subtle filled background that reads as "loading"
//   animate-pulse — built-in Tailwind keyframe
//   rounded-xl   — matches the card shells used on Home

import React from "react";
import { cn } from "@/lib/utils";

export interface CardSkeletonProps {
  /**
   * Tailwind classes to override the default height / margin. Common usage:
   *   <CardSkeleton className="h-[120px]" />
   *   <CardSkeleton className="h-[220px] mt-3" />
   */
  className?: string;
  /** Accessible label for screen readers; defaults to a generic loading message. */
  label?: string;
}

export function CardSkeleton({ className, label = "Đang tải · Loading…" }: CardSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cn(
        "w-full animate-pulse rounded-xl bg-muted/50",
        // Default to ~140 px — a reasonable mid-point across the seven cards.
        // Override per call site for cards taller/shorter than this.
        "h-[140px]",
        className,
      )}
    />
  );
}

export default CardSkeleton;
