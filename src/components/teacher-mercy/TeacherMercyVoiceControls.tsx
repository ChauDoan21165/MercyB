import { Mic, MicOff, Square, Volume2 } from "lucide-react";

type Props = {
  kind: "mic" | "speaker";
  supported: boolean;
  active?: boolean;
  preparing?: boolean;
  unavailableLabel: string;
  inactiveLabel: string;
  activeLabel: string;
  preparingLabel?: string;
  ariaStart: string;
  ariaStop: string;
  onToggle: () => void;
  className?: string;
  fallbackTestId?: string;
  disabled?: boolean;
};

export default function TeacherMercyVoiceControls({
  kind,
  supported,
  active = false,
  preparing = false,
  unavailableLabel,
  inactiveLabel,
  activeLabel,
  preparingLabel,
  ariaStart,
  ariaStop,
  onToggle,
  className = "",
  fallbackTestId,
  disabled = false,
}: Props) {
  if (!supported) {
    return (
      <div
        role="status"
        className={`min-h-[44px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-xs font-bold text-slate-500 ${className}`}
        data-testid={fallbackTestId}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {kind === "mic" ? <MicOff className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
          {unavailableLabel}
        </span>
      </div>
    );
  }

  const icon = kind === "mic"
    ? <Mic className="h-4 w-4" aria-hidden />
    : active
      ? <Square className="h-4 w-4" aria-hidden />
      : <Volume2 className="h-4 w-4" aria-hidden />;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || preparing}
      className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm font-black transition ${
        active
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
      } disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      aria-label={active ? ariaStop : ariaStart}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {preparing ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        ) : (
          icon
        )}
        {preparing && preparingLabel ? preparingLabel : active ? activeLabel : inactiveLabel}
      </span>
    </button>
  );
}
