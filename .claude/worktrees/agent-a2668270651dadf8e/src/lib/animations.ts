/**
 * Mercy Blade Animation Library
 * Framer Motion configurations for Apple-quality animations
 */

import { Variants, Transition } from "framer-motion";

/**
 * Spring Transition (bouncy, natural)
 */
export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

/**
 * Smooth Transition (ease-out)
 */
export const smoothTransition: Transition = {
  type: "tween",
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
};

/**
 * Slow Transition (for modals, page changes)
 */
export const slowTransition: Transition = {
  type: "tween",
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
};

/**
 * Fade In Variants
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: smoothTransition,
  },
};

/**
 * Slide Up Variants (for modals, drawers)
 */
export const slideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition,
  },
};

/**
 * Scale In Variants (for cards, buttons)
 */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
};

/**
 * Stagger Children (for lists, grids)
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

/**
 * Stagger Item
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: smoothTransition,
  },
};

/**
 * Page Transition Variants
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: slowTransition,
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: smoothTransition,
  },
};

/**
 * Modal Variants (scale + fade)
 */
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: smoothTransition,
  },
};

/**
 * Overlay Variants (backdrop)
 */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * Hover Scale (for interactive elements)
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.15 },
};

/**
 * Press Scale (for buttons)
 */
export const pressScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

/**
 * Glow Pulse (for notifications, badges)
 */
export const glowPulse = {
  scale: [1, 1.05, 1],
  opacity: [1, 0.8, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
