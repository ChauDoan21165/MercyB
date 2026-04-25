import { useState } from "react";
import { Link } from "react-router-dom";

import NAIL_PACK, {
  type Phrase,
  type PhraseRegister,
  type Scenario,
  type Vocabulary,
} from "@/data/profession-packs/nail-technician";
import PaywallProfessionPackGate from "@/components/profession-packs/PaywallProfessionPackGate";

type Tab = "overview" | "vocabulary" | "phrases" | "scenarios" | "pronunciation";

const TAB_LABELS_VI: Record<Tab, string> = {
  overview: "Tổng quan",
  vocabulary: "Từ vựng",
  phrases: "Câu giao tiếp",
  scenarios: "Role-play",
  pronunciation: "Phát âm",
};

const REGISTER_LABELS_VI: Record<PhraseRegister, string> = {
  greeting: "Chào hỏi",
  service: "Phục vụ",
  upsell: "Gợi ý thêm",
  complaint: "Phàn nàn",
  closing: "Kết thúc",
  tip: "Tiền tip",
};

export default function NailTechnicianPage() {
  return (
    <PaywallProfessionPackGate packTitleVi={NAIL_PACK.title_vi}>
      <NailTechnicianPackBody />
    </PaywallProfessionPackGate>
  );
}

function NailTechnicianPackBody() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-5">
        <Link
          to="/"
          className="text-xs text-black/50 hover:text-black/80"
        >
          ← Trang chủ
        </Link>
        <h1 className="text-2xl font-bold mt-2 text-black/90">
          {NAIL_PACK.title_vi}
        </h1>
        <p className="text-xs text-black/55 italic">{NAIL_PACK.title_en}</p>
        <p className="text-sm text-black/70 mt-2 leading-relaxed">
          {NAIL_PACK.intro_vi}
        </p>
      </header>

      <nav className="flex gap-1 flex-wrap mb-5 border-b border-black/10">
        {(Object.keys(TAB_LABELS_VI) as Tab[]).map((t) => (
          <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>
            {TAB_LABELS_VI[t]}
          </TabButton>
        ))}
      </nav>

      {tab === "overview" && <OverviewSection />}
      {tab === "vocabulary" && <VocabularySection items={NAIL_PACK.vocabulary} />}
      {tab === "phrases" && <PhrasesSection items={NAIL_PACK.phrases} />}
      {tab === "scenarios" && <ScenariosSection items={NAIL_PACK.scenarios} />}
      {tab === "pronunciation" && (
        <PronunciationSection
          traps={NAIL_PACK.pronunciation}
          l1Overrides={NAIL_PACK.l1_overrides}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 text-sm font-semibold border-b-2 -mb-px ${
        active
          ? "border-emerald-600 text-emerald-700"
          : "border-transparent text-black/55 hover:text-black/85"
      }`}
    >
      {children}
    </button>
  );
}

function OverviewSection() {
  const cards: Array<{ label: string; count: number }> = [
    { label: "Từ vựng nail", count: NAIL_PACK.vocabulary.length },
    { label: "Câu giao tiếp", count: NAIL_PACK.phrases.length },
    { label: "Kịch bản role-play", count: NAIL_PACK.scenarios.length },
    { label: "Bẫy phát âm", count: NAIL_PACK.pronunciation.length },
    { label: "Lỗi L1 đặc thù", count: NAIL_PACK.l1_overrides.length },
  ];

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-black/10 bg-white p-4 text-center"
        >
          <div className="text-3xl font-bold text-emerald-700">{c.count}</div>
          <div className="text-xs text-black/65 mt-1">{c.label}</div>
        </div>
      ))}
    </section>
  );
}

function VocabularySection({ items }: { items: readonly Vocabulary[] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((v) => (
        <article
          key={v.en}
          className="rounded-xl border border-black/10 bg-white p-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-base font-semibold text-black/90">{v.en}</span>
            <span className="text-[10px] uppercase tracking-wide text-black/45">
              {v.pos}
            </span>
          </div>
          <div className="text-sm text-black/70 mt-1">{v.vi}</div>
          {v.note_vi ? (
            <div className="text-xs text-black/55 mt-1 italic">{v.note_vi}</div>
          ) : null}
          {v.pronunciation_hint ? (
            <div className="text-xs text-amber-700 mt-2">
              🗣 {v.pronunciation_hint}
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function PhrasesSection({ items }: { items: readonly Phrase[] }) {
  const grouped = items.reduce<Record<PhraseRegister, Phrase[]>>(
    (acc, p) => {
      (acc[p.register] ??= []).push(p);
      return acc;
    },
    {} as Record<PhraseRegister, Phrase[]>,
  );

  const order: PhraseRegister[] = [
    "greeting",
    "service",
    "upsell",
    "complaint",
    "closing",
    "tip",
  ];

  return (
    <section className="space-y-5">
      {order.map((register) => {
        const list = grouped[register];
        if (!list || list.length === 0) return null;
        return (
          <div key={register}>
            <h3 className="text-sm font-bold text-black/80 mb-2 uppercase tracking-wide">
              {REGISTER_LABELS_VI[register]}
            </h3>
            <div className="space-y-2">
              {list.map((p, i) => (
                <article
                  key={`${register}-${i}`}
                  className="rounded-xl border border-black/10 bg-white p-3"
                >
                  <div className="text-sm font-semibold text-black/90">
                    {p.en}
                  </div>
                  <div className="text-sm text-black/70 mt-1">{p.vi}</div>
                  <div className="text-xs text-black/55 mt-2 leading-relaxed">
                    💡 {p.when_to_use_vi}
                  </div>
                  {p.common_response_en ? (
                    <div className="text-xs text-emerald-700 mt-2 italic">
                      Khách thường trả lời: "{p.common_response_en}"
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ScenariosSection({ items }: { items: readonly Scenario[] }) {
  return (
    <section className="space-y-4">
      {items.map((scenario) => (
        <details
          key={scenario.slug}
          className="rounded-xl border border-black/10 bg-white p-4"
        >
          <summary className="cursor-pointer text-base font-semibold text-black/90">
            {scenario.title_vi}
          </summary>
          <p className="text-xs text-black/55 italic mt-1">{scenario.title_en}</p>
          <ol className="space-y-3 mt-4">
            {scenario.turns.map((turn, i) => {
              const isTech = turn.speaker === "tech";
              return (
                <li
                  key={i}
                  className={`rounded-lg p-3 ${
                    isTech
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-slate-50 border border-black/10"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wide text-black/55 mb-1">
                    {isTech ? "Thợ (bạn)" : "Khách"}
                  </div>
                  <div className="text-sm text-black/90">{turn.en}</div>
                  <div className="text-xs text-black/60 italic mt-1">
                    {turn.vi}
                  </div>
                  {turn.coaching_vi ? (
                    <div className="text-xs text-emerald-800 mt-2">
                      🎯 {turn.coaching_vi}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </details>
      ))}
    </section>
  );
}

function PronunciationSection({
  traps,
  l1Overrides,
}: {
  traps: typeof NAIL_PACK.pronunciation;
  l1Overrides: typeof NAIL_PACK.l1_overrides;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-black/80 mb-2 uppercase tracking-wide">
          Bẫy phát âm tại tiệm
        </h3>
        <div className="space-y-2">
          {traps.map((t) => (
            <article
              key={t.word}
              className="rounded-xl border border-black/10 bg-white p-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-base font-semibold text-black/90">
                  {t.word}
                </span>
                <span className="text-xs font-mono text-amber-700">
                  /{t.ipa_hint}/
                </span>
              </div>
              <div className="text-xs text-black/65 mt-1 leading-relaxed">
                {t.vn_trap_vi}
              </div>
              {t.drill_pair ? (
                <div className="text-xs text-emerald-700 mt-2 italic">
                  Cặp luyện: {t.drill_pair}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-black/80 mb-2 uppercase tracking-wide">
          Lỗi tiếng Việt thường gặp tại tiệm nail
        </h3>
        <div className="space-y-2">
          {l1Overrides.map((o) => (
            <article
              key={o.tag}
              className="rounded-xl border border-rose-200 bg-rose-50 p-3"
            >
              <div className="text-sm font-semibold text-rose-900">
                {o.name_vi}
              </div>
              <div className="text-xs text-black/70 mt-1 leading-relaxed">
                {o.why_vi}
              </div>
              <div className="mt-2 text-sm">
                <span className="text-rose-700 line-through">
                  {o.example_wrong}
                </span>
              </div>
              <div className="text-sm text-emerald-800 font-medium">
                ✓ {o.example_right}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
