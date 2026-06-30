import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Textarea } from "@/components/ui/textarea";
import GenericTaskCard from "./GenericTaskCard";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
};

const WORD_LABELS: PlacementNativeSlots = {
  en: "words",
  vi: "từ",
  ja: "語",
  id: "kata",
  th: "คำ",
  ar: "كلمات",
  hi: "शब्द",
  ur: "الفاظ",
  ko: "단어",
  zh: "字",
  pt: "palavras",
  tr: "kelime",
};

const MINIMUM_LABEL_PREFIX: PlacementNativeSlots = {
  en: "Minimum",
  vi: "Tối thiểu",
  ja: "最低",
  id: "Minimum",
  th: "ขั้นต่ำ",
  ar: "الحد الأدنى",
  hi: "न्यूनतम",
  ur: "کم از کم",
  ko: "최소",
  zh: "至少",
  pt: "Mínimo de",
  tr: "En az",
};

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function WritingTaskCard({ task, value, onChange }: Props) {
  const words = countWords(value);
  const min = task.minWords ?? 20;
  const enough = words >= min;
  const showVi = useChromeLanguage() === "vi";
  const pt = usePlacementT();

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      <label className="sr-only" htmlFor="placement-writing-answer">
        Writing answer
      </label>
      <Textarea
        id="placement-writing-answer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby="placement-writing-word-count placement-writing-minimum"
        className="min-h-[180px] resize-y rounded-[14px] border-slate-200 text-base leading-relaxed"
        placeholder={showVi ? "Write your answer here... / Viết câu trả lời tại đây..." : "Write your answer here..."}
      />
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span id="placement-writing-word-count" aria-live="polite" className={enough ? "font-bold text-emerald-700" : "font-bold text-slate-600"}>
          {words} {pt(WORD_LABELS)}
        </span>
        <span id="placement-writing-minimum" className="text-right text-xs font-medium text-slate-600">
          {pt(MINIMUM_LABEL_PREFIX)} {min} {pt(WORD_LABELS)}
        </span>
      </div>
    </GenericTaskCard>
  );
}

export default WritingTaskCard;
