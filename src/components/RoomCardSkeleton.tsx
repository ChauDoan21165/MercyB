import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RoomCardSkeleton = () => {
  return (
    <Card className="relative p-3 animate-pulse">
      <div className="space-y-2">
        {/* Status badge skeleton */}
        <div className="absolute top-1 right-1">
          <Skeleton className="w-5 h-5 rounded-full" />
        </div>
        
        {/* Room names skeleton */}
        <div className="space-y-1 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-2 w-3/4 mt-1" />
        </div>
      </div>
    </Card>
  );
};

export const RoomGridSkeleton = ({ count = 24 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
};
