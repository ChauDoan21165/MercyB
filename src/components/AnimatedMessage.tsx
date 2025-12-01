/**
 * Animated Message Component
 * Smooth entrance animations for chat messages
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { messageEnter, getVariants } from "@/lib/motion";

interface AnimatedMessageProps {
  children: ReactNode;
  index: number;
}

export function AnimatedMessage({ children, index }: AnimatedMessageProps) {
  const variants = getVariants(messageEnter);
  
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: Math.min(index * 0.05, 0.3), // Stagger with max delay
      }}
    >
      {children}
    </motion.div>
  );
}
