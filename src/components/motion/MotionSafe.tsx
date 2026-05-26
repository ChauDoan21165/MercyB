/**
 * MotionSafe Component
 * SSR-safe animation wrapper that disables animations during hydration
 */

import { motion, MotionProps } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

interface MotionSafeProps extends MotionProps {
  children: ReactNode;
  as?: keyof typeof motion;
}

/**
 * Wrapper component that prevents animation flash during SSR/hydration
 * Disables animations on first render, enables after hydration
 */
export function MotionSafe({ children, as = "div", ...props }: MotionSafeProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const MotionComponent = motion[as] as typeof motion.div;

  // During SSR or first render, render without animation
  if (!isHydrated) {
    return <div {...(props as any)}>{children}</div>;
  }

  // After hydration, render with full animation support
  return <MotionComponent {...props}>{children}</MotionComponent>;
}
