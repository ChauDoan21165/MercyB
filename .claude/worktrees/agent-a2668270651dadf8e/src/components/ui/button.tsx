import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
// Single source of truth for the 44px minimum touch target
// (Apple HIG 44pt / Material 48dp). Previously this primitive shipped
// sub-spec sizes (sm 36px, default/icon 40px) — flagged by the mobile
// audit (Category 2). Composing the existing token here makes every
// size variant touch-compliant by default instead of leaving the token
// orphaned at 2 of ~600 consumers. See src/design-system/tokens.ts.
import { touchTarget } from "@/design-system/tokens";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // All interactive sizes meet the ≥44px touch-target minimum via
        // the shared `touchTarget` token (min-h/min-w, not fixed h/w —
        // a min floor still holds even when a consumer overrides height
        // with a standard `h-*` class, since Tailwind groups differ).
        // Visual weight is differentiated by padding/rounding, NOT by
        // shrinking the tap area below spec.
        default: `${touchTarget} px-4 py-2`,
        sm: `${touchTarget} rounded-md px-3`,
        lg: `${touchTarget} rounded-md px-8`,
        icon: `${touchTarget} p-0`,
        // OPT-OUT — intentionally NOT touch-compliant (<44px). Use ONLY
        // in pointer-guaranteed contexts where 44px is impractical
        // (dense desktop/admin tables, inline metadata controls). Never
        // place a `compact` button on a primary mobile flow. This is a
        // sanctioned, named escape hatch so the default stays safe.
        compact: "h-8 rounded-md px-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
