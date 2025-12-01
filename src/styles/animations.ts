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
  
  // Hover effects
  hoverScale: 'transition-transform duration-200 hover:scale-105 active:scale-95',
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  hoverGlow: 'transition-shadow duration-200 hover:shadow-glow',
  
  // Focus effects
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',

  // Loading
  pulse: 'animate-pulse',
  spin: 'animate-spin',

  // Message animations
  messageEnter: 'animate-in slide-in-from-bottom-2 fade-in duration-300',
  
  // Card animations
  cardHover: 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
  
  // Room grid item
  roomCardEnter: 'animate-in fade-in zoom-in-95 duration-300',
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
