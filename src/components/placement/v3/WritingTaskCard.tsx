import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Textarea } from "@/components/ui/textarea";
import GenericTaskCard from "./GenericTaskCard";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
};

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function WritingTaskCard({ task, value, onChange }: Props) {
  const words = countWords(value);
  const min = task.minWords ?? 20;
  const enough = words >= min;

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      <label className="sr-only" htmlFor="placement-writing-answer">
        Writing answer
      </label>
      <Textarea
        id="placement-writing-answer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[180px] resize-y rounded-[14px] border-slate-200 text-base leading-relaxed"
        placeholder="Write your answer here... / Viết câu trả lời tại đây..."
      />
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className={enough ? "font-bold text-emerald-700" : "font-bold text-slate-600"}>
          {words} words
          <span className="block text-xs font-medium text-slate-400">
            {words} từ
          </span>
        </span>
        <span className="text-right text-xs font-medium text-slate-400">
          Minimum {min} words
          <span className="block">Tối thiểu {min} từ</span>
        </span>
      </div>
    </GenericTaskCard>
  );
}

export default WritingTaskCard;
