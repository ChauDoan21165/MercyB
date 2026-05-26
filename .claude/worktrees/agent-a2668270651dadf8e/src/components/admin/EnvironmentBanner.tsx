/**
 * L9 — Environment Banner
 * Shows DEV/PREVIEW/PRODUCTION indicator at top of all pages
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnvironmentBanner() {
  const environment = import.meta.env.MODE;
  
  // Only show in non-production environments
  if (environment === 'production') {
    return null;
  }

  const configs = {
    development: {
      label: 'DEV',
      bg: 'bg-yellow-500',
      text: 'text-yellow-950',
      description: 'Development Environment'
    },
    preview: {
      label: 'PREVIEW',
      bg: 'bg-blue-500',
      text: 'text-blue-950',
      description: 'Preview Environment'
    }
  };

  const config = configs[environment as keyof typeof configs] || configs.development;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 py-1 px-4 text-center text-xs font-semibold",
      config.bg,
      config.text
    )}>
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="h-3 w-3" />
        <span>{config.label}</span>
        <span className="hidden sm:inline">— {config.description}</span>
      </div>
    </div>
  );
}
