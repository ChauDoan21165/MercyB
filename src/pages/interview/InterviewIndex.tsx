import { Link } from "react-router-dom";

import {
  listScenarios,
  type InterviewDifficulty,
  type InterviewScenario,
} from "@/data/mock-interviews/scenarios";

const DIFFICULTY_LABEL: Record<InterviewDifficulty, string> = {
  A2: "Cơ bản",
  B1: "Trung cấp",
  B2: "Khá",
};

const DIFFICULTY_COLOR: Record<InterviewDifficulty, string> = {
  A2: "bg-emerald-100 text-emerald-800",
  B1: "bg-sky-100 text-sky-800",
  B2: "bg-amber-100 text-amber-800",
};

export default function InterviewIndex() {
  const scenarios = listScenarios();

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Phỏng vấn thử bằng tiếng Anh</h1>
        <p className="text-sm text-black/60 mt-1">
          Chọn một tình huống, trả lời 5–8 câu, và xem góp ý cụ thể về cách
          bạn nói. Năm kịch bản được viết tay theo công việc thật của người
          Việt ở nước ngoài.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenarios.map((s) => (
          <ScenarioCard key={s.slug} scenario={s} />
        ))}
      </div>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: InterviewScenario }) {
  return (
    <Link
      to={`/interview/${scenario.slug}`}
      className="block p-4 rounded-xl border border-black/10 bg-white hover:bg-emerald-50 no-underline transition"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-base font-semibold text-black/90">
          {scenario.title_vi}
        </h2>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            DIFFICULTY_COLOR[scenario.difficulty]
          }`}
        >
          {DIFFICULTY_LABEL[scenario.difficulty]} · {scenario.difficulty}
        </span>
      </div>

      <p className="text-xs text-black/55 italic">{scenario.title_en}</p>
      <p className="text-sm text-black/70 mt-2 leading-relaxed line-clamp-3">
        {scenario.intro_vi}
      </p>

      <div className="text-xs text-black/50 mt-3">
        {scenario.questions.length} câu hỏi
      </div>
    </Link>
  );
}
