/**
 * Unified Motion System for Mercy Blade
 * Framer Motion animation presets with accessibility support
 */

import { Variants, Transition } from "framer-motion";

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Import animation config
import { ANIMATION_CONFIG } from "@/config/animation";

/**
 * Base transitions using global config
 */
export const baseTransition: Transition = {
  duration: ANIMATION_CONFIG.duration.medium,
  ease: ANIMATION_CONFIG.easing.default,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: ANIMATION_CONFIG.spring.stiffness,
  damping: ANIMATION_CONFIG.spring.damping,
};

/**
 * Core animation variants
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: baseTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition,
  },
};

export const pulseSoft: Variants = {
  pulse: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: ANIMATION_CONFIG.easing.soft,
    },
  },
};

/**
 * Room card animations
 */
export const cardHover = {
  scale: 1.02,
  y: -4,
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  transition: {
    duration: ANIMATION_CONFIG.duration.short,
    ease: ANIMATION_CONFIG.easing.default,
  },
};

export const cardTap = {
  scale: 0.97,
  transition: {
    duration: ANIMATION_CONFIG.duration.short,
    ease: ANIMATION_CONFIG.easing.default,
  },
};

/**
 * Stagger animations for lists
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

/**
 * Exit animations
 */
export const fadeOut: Variants = {
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration.short,
    },
  },
};

export const fadeOutScale: Variants = {
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: ANIMATION_CONFIG.duration.short,
    },
  },
};

/**
 * Chat message animations
 */
export const messageEnter: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration.short,
      ease: ANIMATION_CONFIG.easing.default,
    },
  },
};

/**
 * Kids-specific playful animations
 */
export const bouncyEnter: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 12,
    },
  },
};

export const gentleWobble = {
  rotate: [0, -2, 2, -2, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

/**
 * Error state animations
 */
export const shakeError: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Helper: Return variants based on reduced motion preference
 */
export const getVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    // Return simplified variants with no motion
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }
  return variants;
};

/**
 * Helper: Return transition based on reduced motion preference
 */
export const getTransition = (transition: Transition): Transition => {
  if (prefersReducedMotion()) {
    return { duration: 0.01 };
  }
  return transition;
};
