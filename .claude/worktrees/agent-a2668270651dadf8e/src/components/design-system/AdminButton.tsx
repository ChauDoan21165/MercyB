/**
 * Canonical AdminButton Component
 * Single button component for all admin pages
 */

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { typography, radius, touchTarget, interactionStates } from "@/design-system/tokens";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-foreground text-background hover:bg-foreground/90',
      secondary: 'bg-muted text-foreground hover:bg-muted/80 border border-border',
      danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      ghost: 'hover:bg-muted hover:text-foreground',
    }[variant];

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2",
          "font-medium transition-colors duration-200",
          radius.base,
          touchTarget,
          
          // Variant styles
          variantClasses,
          
          // Size styles
          sizeClasses,
          
          // State styles
          interactionStates.focus,
          interactionStates.disabled,
          loading && interactionStates.loading,
          
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";
