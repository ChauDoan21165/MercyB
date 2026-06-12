import { AI_TUTOR_STALE_SESSION_MESSAGE } from "./staleSessionGuard";

export interface AiTutorStaleSessionNoticeProps {
  onReload?: () => void;
  className?: string;
}

export function AiTutorStaleSessionNotice({
  onReload = () => window.location.reload(),
  className = "",
}: AiTutorStaleSessionNoticeProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950",
        className,
      ].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">{AI_TUTOR_STALE_SESSION_MESSAGE}</p>
        <button
          type="button"
          onClick={onReload}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-amber-900 px-4 py-2 font-semibold text-white hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2"
        >
          Tải lại trang
        </button>
      </div>
    </div>
  );
}
