/**
 * Standardized Button Component
 * Replaces all button variants across the app
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { radiusClasses } from "../radius";
import { shadowClasses } from "../shadows";
import { spaceClasses } from "../spacing";
import { typographyClasses } from "../typography";

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center whitespace-nowrap transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-95",
    radiusClasses.md
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90",
          shadowClasses.sm,
          "hover:shadow-md"
        ),
        secondary: cn(
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          shadowClasses.sm
        ),
        subtle: cn(
          "bg-muted text-foreground",
          "hover:bg-muted/80"
        ),
        ghost: cn(
          "hover:bg-accent hover:text-accent-foreground"
        ),
        danger: cn(
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          shadowClasses.sm
        ),
        outline: cn(
          "border border-input bg-background",
          "hover:bg-accent hover:text-accent-foreground"
        ),
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: cn(spaceClasses.px.md, spaceClasses.py.xs, "text-xs font-medium h-8"),
        md: cn(spaceClasses.px.base, spaceClasses.py.sm, "text-sm font-medium h-10"),
        lg: cn(spaceClasses.px.lg, spaceClasses.py.md, "text-base font-semibold h-11"),
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
