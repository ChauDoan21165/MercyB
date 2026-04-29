// src/components/offline/OfflineUnavailable.tsx
//
// Offline Lite v1 (A3) — shown when the user navigates to a room while
// offline AND the room has not been downloaded. The companion path —
// offline + downloaded — is handled silently inside loadRoomJson and
// the user sees a normal room page.
//
// Vietnamese-first per CLAUDE.md non-negotiables. Copy is short and
// honest: we do not pretend the room is "loading", and we do not
// pretend we can fix this without an internet connection.

import { useNavigate } from "react-router-dom";

export interface OfflineUnavailableProps {
  roomId?: string | null;
  onBack?: () => void;
}

export default function OfflineUnavailable({
  roomId,
  onBack,
}: OfflineUnavailableProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/rooms");
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm"
    >
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Ngoại tuyến / Offline
      </div>

      <h1 className="mt-2 text-2xl font-bold text-foreground">
        Phòng này chưa tải về
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Bạn đang ngoại tuyến và phòng này chưa được tải về máy.
        Hãy mở phòng một lần khi có mạng để tải về, rồi sau đó có thể học
        ngay cả khi mất kết nối.
      </p>

      {roomId ? (
        <p className="mt-2 text-xs text-muted-foreground">
          <span className="font-mono">{roomId}</span>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 font-medium text-foreground shadow-sm transition hover:bg-black/[0.03]"
        >
          ← Quay lại / Back
        </button>
      </div>
    </div>
  );
}
