/**
 * Canonical SeverityBadge Component
 * Consistent severity display across admin health checks
 */

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { radius } from "@/design-system/tokens";

type Severity = 'error' | 'warn' | 'info' | 'success';

interface SeverityBadgeProps {
  severity: Severity;
  children: React.ReactNode;
  className?: string;
}

const severityConfig = {
  error: {
    icon: XCircle,
    className: 'severity-error',
  },
  warn: {
    icon: AlertTriangle,
    className: 'severity-warn',
  },
  info: {
    icon: Info,
    className: 'severity-info',
  },
  success: {
    icon: CheckCircle,
    className: 'severity-success',
  },
};

export function SeverityBadge({ severity, children, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2",
        "px-3 py-1.5",
        "border",
        "text-sm font-medium",
        radius.base,
        config.className,
        className
      )}
      role="status"
      aria-label={`${severity} status`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
