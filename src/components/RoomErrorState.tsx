import { AlertCircle, Lock, LogIn } from "lucide-react";

interface RoomErrorStateProps {
  code?: string;
  roomId?: string;
}

/**
 * Consistent error UI for room loading failures
 * Shows user-friendly bilingual messages based on error code
 */
export function RoomErrorState({ code, roomId }: RoomErrorStateProps) {
  if (code === "AUTHENTICATION_REQUIRED") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
        <LogIn className="w-16 h-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">Need login / Cần đăng nhập để vào phòng này.</p>
        </div>
        <a
          href="/login"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Login / Đăng nhập
        </a>
      </div>
    );
  }

  if (code === "ACCESS_DENIED_INSUFFICIENT_TIER") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
        <Lock className="w-16 h-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            Phòng chỉ dành cho cấp VIP cao hơn.
            <br />
            This room requires a higher VIP tier.
          </p>
        </div>
        <a
          href="/upgrade"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Upgrade / Nâng cấp
        </a>
      </div>
    );
  }

  if (code === "ROOM_NOT_FOUND") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Room Not Found</h2>
          <p className="text-muted-foreground">
            Không tìm thấy phòng này.
            <br />
            {roomId && <span className="text-sm">Room ID: {roomId}</span>}
          </p>
        </div>
        <a
          href="/"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Home / Về trang chủ
        </a>
      </div>
    );
  }

  // Generic error
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6">
      <AlertCircle className="w-16 h-16 text-destructive" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Error Loading Room</h2>
        <p className="text-muted-foreground">
          Có lỗi khi tải phòng. Thử lại sau nhé.
          <br />
          There was an error loading this room. Please try again later.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Retry / Thử lại
      </button>
    </div>
  );
}
