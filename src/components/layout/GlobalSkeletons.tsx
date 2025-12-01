import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMercyBladeTheme } from "@/hooks/useMercyBladeTheme";

export const RoomGridSkeleton = () => {
  const { isColorMode } = useMercyBladeTheme();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-3">
          <Skeleton className={`h-6 w-3/4 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          <Skeleton className={`h-4 w-full ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          <Skeleton className={`h-4 w-2/3 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
        </Card>
      ))}
    </div>
  );
};

export const ChatSkeleton = () => {
  const { isColorMode } = useMercyBladeTheme();
  
  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className={`h-8 w-2/3 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
        <Skeleton className={`h-4 w-1/3 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
      </div>
      <div className="flex-1 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className={`h-4 w-1/4 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
            <Skeleton className={`h-20 w-full ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const KidsRoomSkeleton = () => {
  const { isColorMode } = useMercyBladeTheme();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className={`h-12 w-12 rounded-full ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          <Skeleton className={`h-6 w-full ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          <Skeleton className={`h-4 w-3/4 ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
          <Skeleton className={`h-10 w-full ${isColorMode ? 'bg-muted' : 'bg-muted'}`} />
        </Card>
      ))}
    </div>
  );
};
