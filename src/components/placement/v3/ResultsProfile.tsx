import type { PlacementV3Results } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";

type Props = {
  results: PlacementV3Results;
};

const modalityLabel: Record<string, { en: string; vi: string }> = {
  writing: { en: "Writing", vi: "Viết" },
  speaking: { en: "Speaking", vi: "Nói" },
  reading: { en: "Reading", vi: "Đọc" },
  listening: { en: "Listening", vi: "Nghe" },
  conversation: { en: "Conversation", vi: "Hội thoại" },
};

export function ResultsProfile({ results }: Props) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div className="text-center sm:text-left">
          <div className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">
            Overall level
            <span className="ml-1 font-medium normal-case tracking-normal text-slate-500">· Trình độ chung</span>
          </div>
          <div className="mt-2 text-6xl font-black leading-none text-emerald-600">
            {results.overallCefr}
          </div>
          <div className="mt-2 text-sm font-bold text-slate-700">
            {Math.round(results.overallConfidence * 100)}% confidence
            <span className="block text-xs font-medium text-slate-500">
              Độ tin cậy {Math.round(results.overallConfidence * 100)}%
            </span>
          </div>
        </div>
        <BilingualLabel
          text={results.overallSummary}
          enClassName="text-base font-bold leading-7 text-slate-800"
          viClassName="text-sm font-medium leading-6 text-slate-500"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {results.skills.map((skill) => (
          <article key={skill.modality} className="rounded-[14px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <BilingualLabel
                text={modalityLabel[skill.modality]}
                enClassName="text-sm font-black text-slate-800"
                viClassName="text-xs font-medium text-slate-500"
              />
              <div className="text-right">
                <div className="text-xl font-black text-slate-950">{skill.cefr}</div>
                <div className="text-[11px] font-bold text-slate-500">
                  {Math.round(skill.confidence * 100)}%
                </div>
              </div>
            </div>
            <BilingualLabel
              text={skill.summary}
              className="mt-3"
              enClassName="text-sm font-semibold leading-6 text-slate-700"
              viClassName="text-xs font-medium leading-5 text-slate-500"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResultsProfile;
