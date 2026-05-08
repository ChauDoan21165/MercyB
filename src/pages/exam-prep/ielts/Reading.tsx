
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';
import {
  IELTS_READING_PASSAGES,
  listIeltsReadingPassages,
  type IELTSReadingBand,
  type IELTSReadingPassage,
  type IELTSReadingTopicFamily,
} from '@/data/exam-prep/ielts/reading-passages';

type TopicFilter = 'all' | IELTSReadingTopicFamily;
type BandFilter = 'all' | IELTSReadingBand;

const TOPIC_LABELS: Record<string, string> = {
  history: 'Lịch sử', economics: 'Kinh tế',
  earth_science: 'Khoa học trái đất',
  atmospheric_science: 'Khí quyển',
  life_science: 'Sinh học', medical_science: 'Y học',
  agriculture: 'Nông nghiệp', ecology: 'Sinh thái',
};
const BAND_BADGE: Record<number, string> = {
  5.5: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  6.5: 'bg-amber-100 text-amber-800 border-amber-200',
  7.5: 'bg-sky-100 text-sky-800 border-sky-200',
  8.5: 'bg-violet-100 text-violet-800 border-violet-200',
};

function PassageCard({ passage }: { passage: IELTSReadingPassage }) {
  return (
    <Link
      to={"/exam-prep/ielts/reading/" + passage.id}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={"inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider " + (BAND_BADGE[passage.band] ?? "bg-slate-100 text-slate-700 border-slate-200")}>
          Band {passage.band}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {passage.topic_family.replace(/_/g, " ")}
        </span>
        <span className="ml-auto text-[11px] font-semibold text-slate-500">
          {passage.time_minutes} min · {passage.questions.length} Q
        </span>
      </div>
      <h3 className="text-base font-bold text-slate-900">{passage.title_vi}</h3>
      <p className="text-xs text-slate-500">{passage.title_en}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 line-clamp-2">{passage.summary_vi}</p>
    </Link>
  );
}

export default function Reading() {
  const allPassages = useMemo(() => listIeltsReadingPassages(), []);
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");
  const [bandFilter, setBandFilter] = useState<BandFilter>("all");

  const topicFamilies = useMemo(
    () => [...new Set(allPassages.map((p) => p.topic_family))],
    [allPassages],
  );

  const visiblePassages = useMemo(() => {
    let items = allPassages;
    if (topicFilter !== "all") items = items.filter((p) => p.topic_family === topicFilter);
    if (bandFilter !== "all") items = items.filter((p) => p.band === bandFilter);
    return items;
  }, [allPassages, topicFilter, bandFilter]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <header className="mb-5">
        <Link to="/exam/ielts" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
          <ChevronLeft size={14} />
          Quay lại tổng quan IELTS · Back to IELTS overview
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <BookOpen size={22} className="text-amber-700" />
          <h1 className="text-2xl font-extrabold text-slate-900">IELTS Reading · Luyện đọc</h1>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Luyện IELTS Reading với bài đọc thực tế, kèm giải thích tiếng Việt cho từng câu. Mỗi bài có 13 câu hỏi trải đều các dạng: True/False/Not Given, Multiple Choice, Sentence Completion, Matching Headings.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Full-length passages with Vietnamese explanations. Based on the public IELTS test specification.
        </p>
      </header>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTopicFilter("all")}
          className={"rounded-full border px-3 py-1 text-xs font-semibold " + (topicFilter === "all" ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
          Tất cả chủ đề
        </button>
        {topicFamilies.map((tf) => (
          <button key={tf} type="button" onClick={() => setTopicFilter(tf)}
            className={"rounded-full border px-3 py-1 text-xs font-semibold " + (topicFilter === tf ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
            {TOPIC_LABELS[tf] ?? tf}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Band:</span>
        {(["all", 5.5, 6.5, 7.5, 8.5] as const).map((b) => (
          <button key={b} type="button" onClick={() => setBandFilter(b)}
            className={"rounded-full border px-3 py-0.5 text-[11px] font-semibold " + (bandFilter === b ? "border-amber-600 bg-amber-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")}>
            {b === "all" ? "tất cả" : b.toFixed(1)}
          </button>
        ))}
      </div>
      <div className="text-xs text-slate-500">
        Hiển thị {visiblePassages.length} / {allPassages.length} bài.
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {visiblePassages.map((p) => <PassageCard key={p.id} passage={p} />)}
      </div>
    </div>
  );
}
