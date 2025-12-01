/**
 * Micro-animation utilities
 * Subtle, premium transitions across the app
 * 
 * Respects prefers-reduced-motion
 */

export const animations = {
  // Durations
  fast: '150ms',
  base: '200ms',
  slow: '300ms',

  // Easing curves
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Transitions (Tailwind classes)
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-300',
  slideInFromTop: 'animate-in slide-in-from-top-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  
  // Hover effects - ENHANCED
  hoverScale: 'transition-all duration-150 ease-out hover:scale-[1.02] active:scale-95',
  hoverLift: 'transition-all duration-150 ease-out hover:-translate-y-1 hover:shadow-lg',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-glow',
  
  // Focus effects
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

  // Loading
  pulse: 'animate-pulse',
  spin: 'animate-spin',

  // Message animations - ENHANCED
  messageEnter: 'animate-in slide-in-from-bottom-2 fade-in duration-180',
  
  // Card animations - ENHANCED
  cardHover: 'transition-all duration-150 ease-out hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02]',
  
  // Room grid item - ENHANCED
  roomCardEnter: 'animate-in fade-in zoom-in-95 duration-300',
  roomCardHover: 'transition-all duration-150 ease-out hover:scale-[1.02] hover:shadow-lg',
  
  // Button ripple/feedback
  buttonPress: 'active:scale-95 transition-transform duration-100',
  
  // Theme toggle smooth transition
  themeSwitch: 'transition-all duration-300 ease-in-out',
  
  // Search bar interactions
  searchFocus: 'focus:ring-2 focus:ring-primary focus:scale-[1.01] transition-all duration-150',
  
  // Modal animations
  modalEnter: 'animate-in fade-in zoom-in-95 duration-200',
  modalExit: 'animate-out fade-out zoom-out-95 duration-150',
  overlayEnter: 'animate-in fade-in duration-200',
  overlayExit: 'animate-out fade-out duration-150',
  
  // Audio player states
  audioActive: 'scale-[1.05] transition-transform duration-150',
  
  // Smooth scroll behavior
  smoothScroll: 'scroll-smooth',
} as const;

/**
 * Respects user's motion preferences
 */
export function getAnimationClass(animationClass: string): string {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return ''; // No animation if user prefers reduced motion
  }
  return animationClass;
}

/**
 * Shadow scale for consistency
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  glow: 'shadow-[0_0_20px_rgba(var(--primary),0.3)]',
  hover: 'shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
} as const;
