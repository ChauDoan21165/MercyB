import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

/**
 * Shimmer Skeleton Loader
 * Enhanced skeleton with shimmer animation effect
 * 
 * Usage:
 *   <ShimmerSkeleton variant="text" width="80%" />
 *   <ShimmerSkeleton variant="circular" width={40} height={40} />
 */
export function ShimmerSkeleton({ 
  className, 
  variant = "rectangular",
  width,
  height 
}: ShimmerSkeletonProps) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-white/10 before:to-transparent",
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Room Card Shimmer Skeleton
 */
export function RoomCardShimmer() {
  return (
    <div className="p-4 space-y-3 border rounded-lg bg-card">
      <ShimmerSkeleton variant="rectangular" height={120} />
      <ShimmerSkeleton variant="text" width="80%" />
      <ShimmerSkeleton variant="text" width="60%" />
      <div className="flex gap-2">
        <ShimmerSkeleton variant="rectangular" width={60} height={24} />
        <ShimmerSkeleton variant="rectangular" width={60} height={24} />
      </div>
    </div>
  );
}

/**
 * Chat Message Shimmer Skeleton
 */
export function ChatMessageShimmer() {
  return (
    <div className="flex gap-3 p-4">
      <ShimmerSkeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <ShimmerSkeleton variant="text" width="30%" />
        <ShimmerSkeleton variant="text" width="90%" />
        <ShimmerSkeleton variant="text" width="70%" />
      </div>
    </div>
  );
}

/**
 * Room Grid Shimmer
 */
export function RoomGridShimmer({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardShimmer key={i} />
      ))}
    </div>
  );
}
