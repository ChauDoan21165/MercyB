import { useState } from "react";
import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BilingualLabel from "./BilingualLabel";
import GenericTaskCard from "./GenericTaskCard";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
};

export function ReadingTaskCard({ task, value, onChange }: Props) {
  const [showVi, setShowVi] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[620px]">
      {task.passage ? (
        <section className="mb-4 rounded-[18px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-start justify-between gap-3">
            <BilingualLabel
              text={{ en: "Read the passage", vi: "Đọc đoạn văn sau" }}
              enClassName="text-sm font-black text-slate-800"
              viClassName="text-xs font-medium text-slate-500"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setShowVi((next) => !next)}
              aria-pressed={showVi}
            >
              {showVi ? "Hide VI" : "Show VI"}
            </Button>
          </div>
          <p className="mt-4 text-[15px] leading-7 text-slate-800">{task.passage.en}</p>
          {showVi ? (
            <p className="mt-3 text-sm leading-6 text-slate-500">{task.passage.vi}</p>
          ) : null}
        </section>
      ) : null}

      <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
        {task.options?.length ? (
          <div className="grid gap-3" role="radiogroup" aria-label="Reading answer options">
            {task.options.map((option) => {
              const selected = value === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
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
    </div>
  );
}

export default ReadingTaskCard;
