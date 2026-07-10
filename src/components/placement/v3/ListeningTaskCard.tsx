import { useEffect, useRef, useState } from "react";
import { Headphones } from "lucide-react";
import type { PlacementV3MediaStatus, PlacementV3Task } from "@/lib/placement/v3/types";
import { Input } from "@/components/ui/input";
import BilingualLabel from "./BilingualLabel";
import GenericTaskCard from "./GenericTaskCard";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { openSignal, type SignalCell } from "@/lib/telemetry/signalCell";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
  onMediaStatusChange?: (
    status: PlacementV3MediaStatus,
    details?: { durationSeconds?: number; playbackError?: string },
  ) => void;
};

export function ListeningTaskCard({ task, value, onChange, onMediaStatusChange }: Props) {
  const [mediaStatus, setMediaStatus] = useState<PlacementV3MediaStatus>(
    task.audioUrl ? "loading" : "missing",
  );
  // One signal cell per (task, audioUrl). Audio load is event-driven, so the
  // cell is opened here and closed by the <audio> handlers below — or by its
  // own timeout, if the element never fires either event.
  const audioSignal = useRef<SignalCell | null>(null);

  const updateMediaStatus = (
    next: PlacementV3MediaStatus,
    details?: { durationSeconds?: number; playbackError?: string },
  ) => {
    setMediaStatus(next);
    onMediaStatusChange?.(next, details);
  };

  useEffect(() => {
    updateMediaStatus(task.audioUrl ? "loading" : "missing");

    audioSignal.current?.cancel();
    if (!task.audioUrl) {
      // No src at all. A src-less <audio controls> renders 0:00/0:00 and fires
      // NO error event, so this is the only place the failure can be observed.
      audioSignal.current = null;
      openSignal("PLACEMENT_LOAD_AUDIO", { context: { task_id: task.id } })
        .failed("invariant", { cause: "missing_audio_url" });
      return;
    }
    audioSignal.current = openSignal("PLACEMENT_LOAD_AUDIO", {
      context: { task_id: task.id, has_audio_url: true },
    });
    return () => {
      audioSignal.current?.cancel();
      audioSignal.current = null;
    };
  }, [task.id, task.audioUrl]);

  const showVi = useChromeLanguage() === "vi";

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      <div className="mb-5 rounded-[16px] border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Headphones className="h-5 w-5" aria-hidden />
          </div>
          <BilingualLabel
            text={{ en: "Audio prompt", vi: "Đoạn nghe" }}
            enClassName="text-sm font-black text-slate-800"
            viClassName="text-xs font-medium text-slate-600"
          />
        </div>
        {/*
          Render the player ONLY with a real source. `<audio src={undefined}>`
          drops the attribute and renders a 0:00/0:00 control that can never
          play and fires no `error` event — it reads as "broken audio" when the
          truth is "no audio was ever provided". Never synthesize a URL here:
          an unmatched /audio/... path is answered by the SPA rewrite with
          200 text/html, which the element would load and then fail on.
        */}
        {task.audioUrl ? (
          <audio
            controls
            className="w-full"
            src={task.audioUrl}
            aria-label="Listening prompt audio"
            onLoadedMetadata={(event) => {
              const duration = event.currentTarget.duration;
              const playable = Number.isFinite(duration) && duration > 0;
              if (playable) audioSignal.current?.succeeded({ duration_seconds: duration });
              else audioSignal.current?.failed("invariant", { cause: "zero_duration" });
              updateMediaStatus(
                playable ? "playable" : "unplayable",
                Number.isFinite(duration) ? { durationSeconds: duration } : undefined,
              );
            }}
            onCanPlay={() => updateMediaStatus("playable")}
            onError={() => {
              audioSignal.current?.failed("exception", { cause: "audio_element_error" });
              updateMediaStatus("unplayable", { playbackError: "audio element error" });
            }}
          />
        ) : null}
        <p className="mt-2 text-xs font-medium text-slate-600">
          {mediaStatus === "playable"
            ? "Audio is ready. Listen first, then answer."
            : mediaStatus === "loading"
              ? "Loading audio. Please wait before answering."
              : "Audio is unavailable for this question. You can continue; this listening score will be excluded."}
          {showVi && (
            <>
              <br />
              {mediaStatus === "playable"
                ? "Âm thanh đã sẵn sàng. Hãy nghe trước khi trả lời."
                : mediaStatus === "loading"
                  ? "Đang tải âm thanh. Vui lòng chờ trước khi trả lời."
                  : "Chưa nghe được âm thanh cho câu này. Bạn vẫn có thể tiếp tục; điểm nghe sẽ được loại khỏi kết quả."}
            </>
          )}
        </p>
      </div>

      {task.options?.length ? (
        <div className="grid gap-3" role="radiogroup" aria-label="Listening answer options">
          {task.options.map((option) => {
            const selected = value === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={showVi ? `Option ${option.id}: ${option.label.en}. ${option.label.vi}${selected ? ". Selected." : ""}` : `Option ${option.id}: ${option.label.en}${selected ? ". Selected." : ""}`}
                onClick={() => onChange(option.id)}
                className={`flex min-h-[64px] items-center gap-3 rounded-[14px] border p-4 text-left transition ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black uppercase text-slate-700">
                  {option.id}
                </span>
                <BilingualLabel
                  text={option.label}
                  enClassName="text-base font-bold text-slate-800"
                  viClassName="text-xs font-medium text-slate-600"
                />
              </button>
            );
          })}
        </div>
      ) : (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 rounded-[14px]"
          placeholder={showVi ? "Short answer... / Câu trả lời ngắn..." : "Short answer..."}
        />
      )}
    </GenericTaskCard>
  );
}

export default ListeningTaskCard;
