/**
 * Standardized Tag/Badge Component
 * Used for status indicators, labels, pills
 */

import { cn } from "@/lib/utils";
import { radiusClasses } from "../radius";
import { spaceClasses } from "../spacing";

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Tag({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: TagProps) {
  const variantStyles = {
    default: 'bg-muted text-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    error: 'bg-destructive text-destructive-foreground',
  };

  const sizeStyles = {
    sm: cn(spaceClasses.px.sm, spaceClasses.py.xs, 'text-xs'),
    md: cn(spaceClasses.px.md, spaceClasses.py.xs, 'text-sm'),
    lg: cn(spaceClasses.px.base, spaceClasses.py.sm, 'text-base'),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium",
        radiusClasses.full,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
