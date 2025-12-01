import { AlertCircle, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { normalizeRoomError, type RoomErrorPayload } from "@/lib/errors";
import { useMercyBladeTheme } from "@/hooks/useMercyBladeTheme";

type RoomErrorStateProps = RoomErrorPayload & {
  onBack?: () => void;
};

/**
 * Consistent error UI for room loading failures
 * Shows user-friendly bilingual messages based on error code or kind
 * Theme-aware and logs all errors for analytics
 */
export function RoomErrorState(props: RoomErrorStateProps) {
  const navigate = useNavigate();
  const { mode } = useMercyBladeTheme();
  
  const { code, roomId, kind, message, onBack } = normalizeRoomError(props);
  const errorKind = kind!;
  
  // Log all room errors for analytics
  console.warn("[RoomErrorState]", { errorKind, code, roomId, message });
  
  // Default back behavior
  const handleBack = onBack || (() => navigate("/room"));

  if (errorKind === "auth") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <LogIn className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">Authentication Required</h2>
          <p className="text-muted-foreground transition-colors duration-200">Need login / Cần đăng nhập để vào phòng này.</p>
        </div>
        <a
          href="/login"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          Login / Đăng nhập
        </a>
      </div>
    );
  }

  if (errorKind === "access") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <Lock className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">Access Denied</h2>
          <p className="text-muted-foreground transition-colors duration-200">
            {message || (
              <>
                Phòng chỉ dành cho cấp VIP cao hơn.
                <br />
                This room requires a higher VIP tier.
              </>
            )}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          Back to Rooms / Quay lại
        </button>
      </div>
    );
  }

  if (errorKind === "not_found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
        <AlertCircle className="w-16 h-16 text-muted-foreground transition-colors duration-200" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold transition-colors duration-200">Room Not Found</h2>
          <p className="text-muted-foreground transition-colors duration-200">
            Không tìm thấy phòng này.
            <br />
            {message || (roomId && <span className="text-sm">Room ID: {roomId}</span>)}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
        >
          Back to Home / Về trang chủ
        </button>
      </div>
    );
  }

  // Generic error (unknown)
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-6 transition-colors duration-200">
      <AlertCircle className="w-16 h-16 text-destructive transition-colors duration-200" />
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold transition-colors duration-200">Error Loading Room</h2>
        <p className="text-muted-foreground transition-colors duration-200">
          {message || (
            <>
              Có lỗi khi tải phòng. Thử lại sau nhé.
              <br />
              There was an error loading this room. Please try again later.
            </>
          )}
        </p>
      </div>
      <button
        onClick={handleBack}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
      >
        Go Back / Quay lại
      </button>
    </div>
  );
}
