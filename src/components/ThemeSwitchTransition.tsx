/**
 * Theme Switch Transition
 * Smooth crossfade animation for theme changes
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ThemeSwitchTransitionProps {
  children: ReactNode;
  themeKey: string;
}

export function ThemeSwitchTransition({ children, themeKey }: ThemeSwitchTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={themeKey}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
