import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load ChatHub component for better performance
const ChatHub = lazy(() => import("./ChatHub"));

/**
 * Lazy-loaded ChatHub with loading skeleton
 * Use this in routes to reduce initial bundle size
 */
export function LazyLoadedChatHub() {
  return (
    <Suspense fallback={<ChatHubSkeleton />}>
      <ChatHub />
    </Suspense>
  );
}

function ChatHubSkeleton() {
  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      {/* Footer skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
