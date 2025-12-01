/**
 * Truncated Title with Tooltip
 * Handles long room titles gracefully with overflow
 */

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TruncatedTitleProps {
  title: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedTitle({ title, maxLength = 50, className }: TruncatedTitleProps) {
  const isTruncated = title.length > maxLength;

  if (!isTruncated) {
    return <span className={className}>{title}</span>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('truncate block', className)}>
          {title}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm whitespace-normal break-words">{title}</p>
      </TooltipContent>
    </Tooltip>
  );
}
