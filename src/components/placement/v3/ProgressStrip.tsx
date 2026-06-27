import type { PlacementV3Modality } from "@/lib/placement/v3/types";

type Props = {
  current: number;
  total: number;
  modality: PlacementV3Modality;
  modalities: PlacementV3Modality[];
};

const labels: Record<PlacementV3Modality, { en: string; vi: string }> = {
  writing: { en: "Writing", vi: "Viết" },
  speaking: { en: "Speaking", vi: "Nói" },
  reading: { en: "Reading", vi: "Đọc" },
  listening: { en: "Listening", vi: "Nghe" },
  conversation: { en: "Conversation", vi: "Hội thoại" },
};

export function ProgressStrip({ current, total, modality, modalities }: Props) {
  const safeTotal = Math.max(1, total);
  const pct = Math.min(100, Math.max(0, (current / safeTotal) * 100));

  return (
    <div
      className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
      aria-label="Placement test progress"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <div
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Task ${current} of ${total}`}
          className="h-1 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] font-black uppercase tracking-[0.06em] text-slate-600">
          <span>
            Task {Math.min(current + 1, total)} of {total}
            <span className="block font-medium normal-case tracking-normal text-slate-600">
              Mục {Math.min(current + 1, total)} / {total}
            </span>
          </span>
          <span aria-live="polite" className="text-right">
            {labels[modality].en}
            <span className="block font-medium normal-case tracking-normal text-slate-600">
              {labels[modality].vi}
            </span>
          </span>
        </div>
        <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden>
          {modalities.map((item) => (
            <div
              key={item}
              className={`h-1.5 rounded-full ${
                item === modality ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressStrip;
