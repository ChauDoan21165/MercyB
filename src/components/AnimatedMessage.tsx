/**
 * Animated Message Component
 * Smooth entrance animations for chat messages
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedMessageProps {
  children: ReactNode;
  index: number;
}

export function AnimatedMessage({ children, index }: AnimatedMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        delay: Math.min(index * 0.05, 0.3), // Stagger with max delay
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
