import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  PRO_VERTICALS,
  PRO_VERTICAL_LABELS,
  listProScenarios,
  type ProInterviewScenario,
  type ProLevel,
  type ProVertical,
} from "@/data/mock-interviews/professional-scenarios";

const LEVEL_LABEL: Record<ProLevel, string> = {
  entry: "Cơ bản",
  mid: "Trung cấp",
  senior: "Nâng cao",
};

const LEVEL_COLOR: Record<ProLevel, string> = {
  entry: "bg-emerald-100 text-emerald-800",
  mid: "bg-sky-100 text-sky-800",
  senior: "bg-amber-100 text-amber-800",
};

type TimeBucket = "all" | "short" | "medium" | "long";

const TIME_LABEL: Record<TimeBucket, string> = {
  all: "Mọi độ dài",
  short: "Ngắn (≤ 12 phút)",
  medium: "Vừa (13–20 phút)",
  long: "Dài (> 20 phút)",
};

function inTimeBucket(s: ProInterviewScenario, bucket: TimeBucket): boolean {
  if (bucket === "all") return true;
  if (bucket === "short") return s.estimated_time_minutes <= 12;
  if (bucket === "medium")
    return s.estimated_time_minutes > 12 && s.estimated_time_minutes <= 20;
  return s.estimated_time_minutes > 20;
}

export default function MockInterviewIndex() {
  const all = useMemo(() => listProScenarios(), []);

  const [vertical, setVertical] = useState<ProVertical | "all">("all");
  const [level, setLevel] = useState<ProLevel | "all">("all");
  const [time, setTime] = useState<TimeBucket>("all");

  const filtered = all.filter((s) => {
    if (vertical !== "all" && s.vertical !== vertical) return false;
    if (level !== "all" && s.level !== level) return false;
    if (!inTimeBucket(s, time)) return false;
    return true;
  });

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">
          Phỏng vấn thử — những lúc tiếng Anh quan trọng nhất
        </h1>
        <p className="text-sm text-black/70 mt-1">
          Luyện phỏng vấn bằng tiếng Anh. Mercy hỏi như nhà tuyển dụng thật.
        </p>
        <p className="text-xs text-black/55 mt-2 italic">
          Practice high-stakes English interviews. Mercy plays the
          interviewer.
        </p>
      </header>

      <Filters
        vertical={vertical}
        setVertical={setVertical}
        level={level}
        setLevel={setLevel}
        time={time}
        setTime={setTime}
      />

      <div className="text-xs text-black/55 mb-3">
        {filtered.length} / {all.length} kịch bản
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <ScenarioCard key={s.id} scenario={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-black/50 mt-8 italic">
          Không có kịch bản nào khớp bộ lọc — thử mở rộng bộ lọc xem.
        </div>
      )}

      <footer className="mt-10 pt-6 border-t border-black/10 text-xs text-black/55">
        <p>
          <strong>Free tier:</strong> 1 phỏng vấn / tuần.{" "}
          <strong>Trial / Paid:</strong> không giới hạn.
        </p>
      </footer>
    </div>
  );
}

function Filters({
  vertical,
  setVertical,
  level,
  setLevel,
  time,
  setTime,
}: {
  vertical: ProVertical | "all";
  setVertical: (v: ProVertical | "all") => void;
  level: ProLevel | "all";
  setLevel: (l: ProLevel | "all") => void;
  time: TimeBucket;
  setTime: (t: TimeBucket) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <FilterGroup label="Lĩnh vực">
        <Pill
          active={vertical === "all"}
          onClick={() => setVertical("all")}
          label="Tất cả"
        />
        {PRO_VERTICALS.map((v) => (
          <Pill
            key={v}
            active={vertical === v}
            onClick={() => setVertical(v)}
            label={PRO_VERTICAL_LABELS[v].vi}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Cấp độ">
        <Pill
          active={level === "all"}
          onClick={() => setLevel("all")}
          label="Tất cả"
        />
        {(["entry", "mid", "senior"] as ProLevel[]).map((l) => (
          <Pill
            key={l}
            active={level === l}
            onClick={() => setLevel(l)}
            label={LEVEL_LABEL[l]}
          />
        ))}
      </FilterGroup>

      <FilterGroup label="Thời lượng">
        {(["all", "short", "medium", "long"] as TimeBucket[]).map((t) => (
          <Pill
            key={t}
            active={time === t}
            onClick={() => setTime(t)}
            label={TIME_LABEL[t]}
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wide text-black/45">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
        active
          ? "bg-black text-white"
          : "bg-black/5 text-black/70 hover:bg-black/10"
      }`}
    >
      {label}
    </button>
  );
}

function ScenarioCard({ scenario }: { scenario: ProInterviewScenario }) {
  return (
    <Link
      to={`/mock-interview/${scenario.id}`}
      className="block p-4 rounded-xl border border-black/10 bg-white hover:bg-emerald-50 no-underline transition"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-semibold text-black/90">
          {scenario.title_vi}
        </h2>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            LEVEL_COLOR[scenario.level]
          }`}
        >
          {LEVEL_LABEL[scenario.level]}
        </span>
      </div>

      <p className="text-xs text-black/55 italic mb-2">{scenario.title_en}</p>
      <p className="text-sm text-black/70 leading-relaxed line-clamp-3">
        {scenario.context}
      </p>

      <div className="flex items-center justify-between mt-3 text-xs text-black/55">
        <span>{PRO_VERTICAL_LABELS[scenario.vertical].vi}</span>
        <span>~{scenario.estimated_time_minutes} phút</span>
      </div>
    </Link>
  );
}
