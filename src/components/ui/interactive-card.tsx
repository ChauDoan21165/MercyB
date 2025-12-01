/**
 * Interactive Card Component
 * Premium hover/press effects with haptic feedback
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { haptics } from "@/utils/haptics";
import { cardHover, cardTap } from "@/lib/motion";

interface InteractiveCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "subtle";
  hapticFeedback?: boolean;
}

export function InteractiveCard({
  children,
  onClick,
  className,
  variant = "default",
  hapticFeedback = true,
}: InteractiveCardProps) {
  const handleClick = () => {
    if (hapticFeedback) {
      haptics.light();
    }
    onClick?.();
  };

  return (
    <motion.div
      whileHover={cardHover}
      whileTap={cardTap}
      onClick={handleClick}
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-card",
        "transition-shadow duration-200",
        variant === "default" && "hover:shadow-md",
        variant === "subtle" && "hover:shadow-sm",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
