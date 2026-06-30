import type { PlacementV3Task } from "@/lib/placement/v3/types";
import { Textarea } from "@/components/ui/textarea";
import BilingualLabel from "./BilingualLabel";
import GenericTaskCard from "./GenericTaskCard";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";

type Props = {
  task: PlacementV3Task;
  value: string;
  onChange: (value: string) => void;
};

export function ConversationTaskCard({ task, value, onChange }: Props) {
  const showVi = useChromeLanguage() === "vi";

  return (
    <GenericTaskCard instruction={task.instruction} prompt={task.prompt}>
      {task.mercyTurn ? (
        <div className="mb-4 rounded-[16px] border border-amber-200 bg-[#FFF8F3] p-4">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-amber-800">
            Mercy
          </div>
          <BilingualLabel
            text={task.mercyTurn}
            enClassName="text-base font-bold leading-relaxed text-slate-900"
            viClassName="text-sm font-medium leading-relaxed text-slate-600"
          />
        </div>
      ) : null}
      <label className="sr-only" htmlFor="placement-conversation-answer">
        Conversation answer
      </label>
      <Textarea
        id="placement-conversation-answer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[150px] rounded-[14px] border-slate-200 text-base leading-relaxed"
        placeholder={showVi ? "Reply to Mercy... / Trả lời Mercy..." : "Reply to Mercy..."}
      />
    </GenericTaskCard>
  );
}

export default ConversationTaskCard;
