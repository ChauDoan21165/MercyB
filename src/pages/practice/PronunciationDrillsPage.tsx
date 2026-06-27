// src/pages/practice/PronunciationDrillsPage.tsx
//
// Minimal learner-reachable consumer for the Lane C pronunciation/tone drill
// banks (previously banked with no consumer). Route: /practice/pronunciation.
//
// What it surfaces:
//   1. EN→VN Vietnamese tone listen-compare drills (TONE_CONTRAST_EXTRA) — the
//      32 reference clips uploaded to room-audio/tones/ play here via
//      TalkingFacePlayButton (→ useAudioUrl → resolveRoomAudioUrl). Below-floor
//      hỏi/ngã pairs are clearly marked LISTEN-COMPARE only (no scoring — this
//      page never scores, so the tone trust floor is not touched).
//   2. VN→EN English minimal-pair drills (VN_EN_PRONUNCIATION_DRILL_BANKS) —
//      target vs. confusable contrast + the Vietnamese "why it collapses" note.
//      These carry no uploaded audio (audioTarget null), so they render as read
//      drills; no scorer, no TTS dependency.
//
// Deliberately NOT here: any scorer, any percent, any threshold logic. This is
// a content browse/practice surface only.

import { useMemo } from "react";

import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";
import SelfCompareRecorder from "@/components/pronunciation/SelfCompareRecorder";
import { toAudioKey } from "@/lib/roomAudioResolver";
import {
  TONE_CONTRAST_EXTRA,
  type PendingTonePair,
} from "@/data/tone-drill/tone-contrast-extra";
import {
  VN_EN_PRONUNCIATION_DRILL_BANKS,
} from "@/lib/pronunciation/vnEnPronunciationDrills";

const VN_EN_BANK_LABELS: Record<string, string> = {
  "th-voiced": "Âm “th” (có rung) — this / they",
  r: "Âm “r” — red / right",
  l: "Âm “l” — light / feel",
  "final-consonant": "Phụ âm cuối — bag / back",
  stress: "Trọng âm từ — REcord / reCORD",
};

function ToneTargetRow({
  syllable,
  tone,
  shapeEn,
  audioPath,
}: {
  syllable: string;
  tone: string;
  shapeEn: string;
  audioPath: string;
}) {
  // audioPath is "/audio/tones/<key>.mp3"; toAudioKey → "tones/<key>.mp3",
  // which TalkingFacePlayButton resolves through the room-audio bucket.
  const audioKey = toAudioKey(audioPath) ?? "";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900">{syllable}</span>
        <span className="text-xs font-bold text-indigo-700">
          {tone} tone · {shapeEn}
        </span>
      </div>
      <TalkingFacePlayButton
        src={audioKey}
        label={`Listen: “${syllable}”`}
        ariaLabel={`${syllable} — ${tone} tone (${shapeEn})`}
        // 32 clips render at once here — fetch each clip's bytes lazily on first
        // play instead of eagerly preloading metadata for all of them on mount.
        preload="none"
      />
    </div>
  );
}

function TonePairCard({ pair }: { pair: PendingTonePair }) {
  const [a, b] = pair.contrast;
  const listenOnly = pair.listenCompareOnly;
  return (
    <li className="rounded-[16px] border border-sky-100 bg-white px-4 py-4 shadow-sm">
      {/* English-primary: this block teaches Vietnamese tones to English
          speakers, so the English gloss leads; the Vietnamese gloss (tone
          names + example words being taught) stays as the secondary line. */}
      <p className="text-sm font-black leading-6 text-slate-900">{pair.glossEn}</p>
      <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-600">{pair.glossVi}</p>
      {listenOnly && (
        <p className="mt-2 inline-block rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-black text-amber-800">
          Listen &amp; compare only — not scored
        </p>
      )}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <ToneTargetRow
          syllable={a.syllable}
          tone={a.tone}
          shapeEn={a.shapeEn}
          audioPath={a.audioPath}
        />
        <ToneTargetRow
          syllable={b.syllable}
          tone={b.tone}
          shapeEn={b.shapeEn}
          audioPath={b.audioPath}
        />
      </div>
    </li>
  );
}

export default function PronunciationDrillsPage() {
  const tonePairs = useMemo(() => TONE_CONTRAST_EXTRA, []);
  const vnEnBanks = useMemo(
    () => Object.entries(VN_EN_PRONUNCIATION_DRILL_BANKS),
    [],
  );

  return (
    <main
      data-testid="pronunciation-drills-page"
      className="mx-auto w-full max-w-3xl px-4 py-6"
    >
      <header>
        <p className="text-xs font-black uppercase text-indigo-600">Luyện phát âm</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          Nghe &amp; luyện cặp âm dễ nhầm
        </h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Nghe câu mẫu, so sánh hai âm, rồi tự đọc theo. Trang này chỉ để nghe và
          luyện — không chấm điểm.
        </p>
      </header>

      <SelfCompareRecorder />

      {/* ── Vietnamese tone listen-compare ── */}
      <section className="mt-6" data-testid="tone-pairs-section">
        <h2 className="text-lg font-black text-slate-900">Vietnamese tones</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          Listen to the same syllable said with two different tones, then
          compare them by ear. No score — this is listen-and-compare only.
        </p>
        <ul className="mt-3 grid gap-3">
          {tonePairs.map((pair) => (
            <TonePairCard key={pair.id} pair={pair} />
          ))}
        </ul>
      </section>

      {/* ── VN→EN English minimal pairs ── */}
      <section className="mt-8" data-testid="vn-en-drills-section">
        <h2 className="text-lg font-black text-slate-900">Cặp âm tiếng Anh</h2>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
          Những cặp từ người Việt hay đọc lẫn. Đọc to và giữ khác biệt rõ ràng.
        </p>
        <div className="mt-3 grid gap-4">
          {vnEnBanks.map(([key, pairs]) => (
            <div key={key} data-testid={`vn-en-bank-${key}`}>
              <h3 className="text-sm font-black text-indigo-700">
                {VN_EN_BANK_LABELS[key] ?? key}
              </h3>
              <ul className="mt-2 grid gap-2">
                {pairs.map((p) => (
                  <li
                    key={`${key}-${p.target}-${p.contrast}`}
                    className="rounded-[14px] border border-slate-100 bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-base font-black text-slate-900">{p.target}</span>
                      <span className="text-xs font-bold text-slate-600">vs</span>
                      <span className="text-base font-bold text-slate-600">{p.contrast}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-600">
                      {p.vnWhyConfused}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
