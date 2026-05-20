import type { PlacementV3L1Flag } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";

type Props = {
  flags: PlacementV3L1Flag[];
};

const tone = {
  low: "border-slate-200 bg-slate-50 text-slate-600",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-rose-200 bg-rose-50 text-rose-800",
};

export function L1FlagsDisplay({ flags }: Props) {
  if (!flags.length) {
    return (
      <section className="rounded-[18px] border border-slate-200 bg-white p-5">
        <BilingualLabel
          text={{ en: "No strong Vietnamese interference pattern stood out.", vi: "Chưa thấy dấu hiệu ảnh hưởng tiếng Việt nào nổi bật." }}
          enClassName="text-sm font-bold text-slate-700"
          viClassName="text-xs font-medium text-slate-400"
        />
      </section>
    );
  }

  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
      <BilingualLabel
        text={{ en: "Vietnamese-specific focus", vi: "Trọng tâm riêng cho người Việt" }}
        enClassName="text-lg font-black text-slate-950"
        viClassName="text-sm font-medium text-slate-400"
      />
      <div className="mt-4 grid gap-3">
        {flags.map((flag) => (
          <article key={flag.id} className={`rounded-[14px] border p-4 ${tone[flag.severity]}`}>
            <BilingualLabel
              text={flag.label}
              enClassName="text-sm font-black"
              viClassName="text-xs font-medium opacity-70"
            />
            <BilingualLabel
              text={flag.evidence}
              className="mt-2"
              enClassName="text-sm font-semibold leading-6 text-slate-700"
              viClassName="text-xs font-medium leading-5 text-slate-500"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export default L1FlagsDisplay;
