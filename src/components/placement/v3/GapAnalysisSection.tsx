import type { BilingualText } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";

type Props = {
  strengths: BilingualText[];
  gaps: BilingualText[];
};

export function GapAnalysisSection({ strengths, gaps }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[18px] border border-slate-200 bg-white p-5">
        <BilingualLabel
          text={{ en: "Strengths", vi: "Điểm mạnh" }}
          enClassName="text-lg font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-600"
        />
        <ul className="mt-4 space-y-3">
          {strengths.map((item) => (
            <li key={item.en} className="rounded-[12px] bg-emerald-50 p-3">
              <BilingualLabel
                text={item}
                enClassName="text-sm font-bold leading-6 text-slate-700"
                viClassName="text-xs font-medium leading-5 text-slate-600"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[18px] border border-slate-200 bg-white p-5">
        <BilingualLabel
          text={{ en: "Next gaps", vi: "Khoảng trống cần lấp" }}
          enClassName="text-lg font-black text-slate-950"
          viClassName="text-sm font-medium text-slate-600"
        />
        <ul className="mt-4 space-y-3">
          {gaps.map((item) => (
            <li key={item.en} className="rounded-[12px] bg-amber-50 p-3">
              <BilingualLabel
                text={item}
                enClassName="text-sm font-bold leading-6 text-slate-700"
                viClassName="text-xs font-medium leading-5 text-slate-600"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default GapAnalysisSection;
