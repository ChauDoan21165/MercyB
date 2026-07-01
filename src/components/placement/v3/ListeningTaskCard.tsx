import { useEffect, useState } from "react";
import { Headphones } from "lucide-react";
import type { PlacementV3MediaStatus, PlacementV3Task } from "@/lib/placement/v3/types";
import { Input } from "@/components/ui/input";
import BilingualLabel from "./BilingualLabel";
import GenericTaskCard from "./GenericTaskCard";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
  onMediaStatusChange?: (status: PlacementV3MediaStatus) => void;
};

export function ListeningTaskCard({ task, value, onChange, onMediaStatusChange }: Props) {
  const [mediaStatus, setMediaStatus] = useState<PlacementV3MediaStatus>(
    task.audioUrl ? "loading" : "missing",
  );

  const updateMediaStatus = (next: PlacementV3MediaStatus) => {
    setMediaStatus(next);
    onMediaStatusChange?.(next);
  };

  useEffect(() => {
    updateMediaStatus(task.audioUrl ? "loading" : "missing");
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
        <audio
          controls
          className="w-full"
          src={task.audioUrl}
          aria-label="Listening prompt audio"
          onLoadedMetadata={(event) => {
            const duration = event.currentTarget.duration;
            updateMediaStatus(Number.isFinite(duration) && duration > 0 ? "playable" : "unplayable");
          }}
          onCanPlay={() => updateMediaStatus("playable")}
          onError={() => updateMediaStatus("unplayable")}
        />
        <p className="mt-2 text-xs font-medium text-slate-600">
          {mediaStatus === "playable"
            ? "Audio is ready. Listen first, then answer."
            : mediaStatus === "loading"
              ? "Loading audio. Please wait before answering."
              : "Audio is unavailable for this question. This listening item cannot be submitted yet."}
          {showVi && (
            <>
              <br />
              {mediaStatus === "playable"
                ? "Âm thanh đã sẵn sàng. Hãy nghe trước khi trả lời."
                : mediaStatus === "loading"
                  ? "Đang tải âm thanh. Vui lòng chờ trước khi trả lời."
                  : "Chưa nghe được âm thanh cho câu này nên chưa thể gửi câu trả lời nghe."}
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
