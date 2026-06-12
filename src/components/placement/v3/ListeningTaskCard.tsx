import { Headphones } from "lucide-react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Input } from "@/components/ui/input";
import BilingualLabel from "./BilingualLabel";
import GenericTaskCard from "./GenericTaskCard";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
};

export function ListeningTaskCard({ task, value, onChange }: Props) {
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
            viClassName="text-xs font-medium text-slate-500"
          />
        </div>
        <audio controls className="w-full" src={task.audioUrl} aria-label="Listening prompt audio" />
        <p className="mt-2 text-xs font-medium text-slate-500">
          Stub audio may be unavailable locally; the production orchestrator will provide a signed audio URL.
          <span className="block">Audio mẫu có thể chưa chạy ở máy local; backend thật sẽ trả URL nghe.</span>
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
                aria-label={`Option ${option.id}: ${option.label.en}. ${option.label.vi}${selected ? ". Selected." : ""}`}
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
                  viClassName="text-xs font-medium text-slate-500"
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
          placeholder="Short answer... / Câu trả lời ngắn..."
        />
      )}
    </GenericTaskCard>
  );
}

export default ListeningTaskCard;
