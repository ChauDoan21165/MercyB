/**
 * Standardized SectionHeader Component
 * Used for page titles, section titles across the app
 */

import { cn } from "@/lib/utils";
import { typographyClasses } from "../typography";
import { spaceClasses } from "../spacing";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  size = 'lg',
  className,
}: SectionHeaderProps) {
  const titleClass = {
    sm: typographyClasses.h3,
    md: typographyClasses.h2,
    lg: typographyClasses.h1,
    xl: typographyClasses.display.md,
  }[size];

  return (
    <div className={cn("flex flex-col", spaceClasses.gap.sm, className)}>
      <div className="flex items-center justify-between gap-4">
        <h1 className={cn(titleClass, "text-foreground")}>
          {title}
        </h1>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
      {subtitle && (
        <p className={cn(typographyClasses.subtitle)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
