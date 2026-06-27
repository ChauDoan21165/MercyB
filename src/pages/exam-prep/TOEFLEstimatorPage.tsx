// src/pages/exam-prep/TOEFLEstimatorPage.tsx — /exam/toefl/estimator
//
// TOEFL iBT score estimator. Takes raw section inputs (0–30 each) or
// raw correct counts → scaled scores via the lookup tables in
// src/data/exam-prep/toefl/score-bands.ts, then displays total (0–120)
// and CEFR band with VN explanation.
//
// Unlike IELTS (0.5-band steps), TOEFL uses a 0–30 per-section scale
// with no official linear formula. This estimator uses the ETS-published
// approximate conversion tables and clearly marks the output as an
// estimate with a caveat.

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calculator, ChevronLeft } from "lucide-react";
import {
  estimateTOEFLScore,
  bandForTotal,
  type TOEFLScoreEstimate,
} from "@/data/exam-prep/toefl/score-bands";
import { TOEFL_COPY } from "@/components/exam-prep/toefl/TOEFLCopy";
import { Button } from "@/components/ui/button";

type InputMode = "raw" | "scaled";

export default function TOEFLEstimatorPage() {
  const [mode, setMode] = useState<InputMode>("scaled");

  // Scaled mode inputs (0–30)
  const [readingScaled, setReadingScaled] = useState<number | "">("");
  const [listeningScaled, setListeningScaled] = useState<number | "">("");
  const [speakingScaled, setSpeakingScaled] = useState<number | "">("");
  const [writingScaled, setWritingScaled] = useState<number | "">("");

  // Raw mode inputs
  const [readingRaw, setReadingRaw] = useState<number | "">("");
  const [listeningRaw, setListeningRaw] = useState<number | "">("");

  const estimate: TOEFLScoreEstimate | null = useMemo(() => {
    if (mode === "scaled") {
      const r = typeof readingScaled === "number" ? readingScaled : 0;
      const l = typeof listeningScaled === "number" ? listeningScaled : 0;
      const s = typeof speakingScaled === "number" ? speakingScaled : 0;
      const w = typeof writingScaled === "number" ? writingScaled : 0;
      if (r === 0 && l === 0 && s === 0 && w === 0) return null;
      return estimateTOEFLScore({
        readingRaw: 0,
        listeningRaw: 0,
        speakingScaled: s,
        writingScaled: w,
      });
    }
    const rr = typeof readingRaw === "number" ? readingRaw : undefined;
    const lr = typeof listeningRaw === "number" ? listeningRaw : undefined;
    const s = typeof speakingScaled === "number" ? speakingScaled : 0;
    const w = typeof writingScaled === "number" ? writingScaled : 0;
    if (rr === undefined && lr === undefined && s === 0 && w === 0) return null;
    return estimateTOEFLScore({
      readingRaw: rr,
      listeningRaw: lr,
      speakingScaled: s,
      writingScaled: w,
    });
  }, [mode, readingScaled, listeningScaled, speakingScaled, writingScaled, readingRaw, listeningRaw]);

  const sampleBand = useMemo(() => {
    return estimateTOEFLScore({
      readingRaw: 15,
      listeningRaw: 20,
      speakingScaled: 22,
      writingScaled: 24,
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{TOEFL_COPY.estimatorTitle.vi}</h1>
        <Button asChild size="sm" variant="ghost"><Link to="/exam/toefl">{TOEFL_COPY.backToOverview.vi}</Link></Button>
      </header>

      <p className="mb-4 text-sm text-muted-foreground">{TOEFL_COPY.estimatorIntro.vi}</p>

      {/* Mode toggle */}
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={mode === "scaled" ? "default" : "ghost"} onClick={() => setMode("scaled")}>Điểm tổng (0–30)</Button>
        <Button size="sm" variant={mode === "raw" ? "default" : "ghost"} onClick={() => setMode("raw")}>Điểm thô R/L + tổng S/W</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Reading */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-sm font-semibold text-slate-700">{TOEFL_COPY.estimatorReadingRaw.vi}</label>
          {mode === "scaled" ? (
            <input type="number" min={0} max={30} value={readingScaled} onChange={(e) => setReadingScaled(e.target.value ? Number(e.target.value) : "")}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–30" />
          ) : (
            <input type="number" min={0} max={20} value={readingRaw} onChange={(e) => setReadingRaw(e.target.value ? Number(e.target.value) : "")}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–20 câu đúng" />
          )}
        </div>

        {/* Listening */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-sm font-semibold text-slate-700">{TOEFL_COPY.estimatorListeningRaw.vi}</label>
          {mode === "scaled" ? (
            <input type="number" min={0} max={30} value={listeningScaled} onChange={(e) => setListeningScaled(e.target.value ? Number(e.target.value) : "")}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–30" />
          ) : (
            <input type="number" min={0} max={28} value={listeningRaw} onChange={(e) => setListeningRaw(e.target.value ? Number(e.target.value) : "")}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–28 câu đúng" />
          )}
        </div>

        {/* Speaking */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-sm font-semibold text-slate-700">{TOEFL_COPY.estimatorSpeakingScaled.vi}</label>
          <input type="number" min={0} max={30} value={speakingScaled} onChange={(e) => setSpeakingScaled(e.target.value ? Number(e.target.value) : "")}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–30" />
        </div>

        {/* Writing */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-sm font-semibold text-slate-700">{TOEFL_COPY.estimatorWritingScaled.vi}</label>
          <input type="number" min={0} max={30} value={writingScaled} onChange={(e) => setWritingScaled(e.target.value ? Number(e.target.value) : "")}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-1.5 text-sm" placeholder="0–30" />
        </div>
      </div>

      {/* Result */}
      {estimate ? (
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{TOEFL_COPY.estimatorTotalLabel.vi}</p>
              <p className="text-3xl font-bold text-foreground">{estimate.totalScore}<span className="text-base font-normal text-muted-foreground">/120</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{TOEFL_COPY.estimatorBandLabel.vi}</p>
              <p className="text-lg font-semibold text-foreground">{estimate.band.label_vi}</p>
            </div>
          </div>

          {/* Section breakdown */}
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {(["readingScaled", "listeningScaled", "speakingScaled", "writingScaled"] as const).map((key) => (
              <div key={key} className="rounded-lg border border-slate-200 bg-white p-2">
                <p className="text-[10px] uppercase text-slate-600">{key.replace("Scaled", "")}</p>
                <p className="text-sm font-bold text-slate-900">{estimate[key]}/30</p>
              </div>
            ))}
          </div>

          <p className="mt-2 text-xs text-slate-700">{estimate.band.description_vi}</p>
          <p className="mt-3 text-[11px] italic text-slate-600">{TOEFL_COPY.estimatorCaveat.vi}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">Nhập điểm các kỹ năng để xem kết quả.</p>
        </div>
      )}

      {/* Sample estimate */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Ví dụ: band ước lượng mẫu</h2>
        <div className="grid grid-cols-4 gap-2 text-center mb-2">
          <div><span className="text-[10px] text-amber-700">Reading</span><br /><span className="text-sm font-bold">15/20</span></div>
          <div><span className="text-[10px] text-amber-700">Listening</span><br /><span className="text-sm font-bold">20/28</span></div>
          <div><span className="text-[10px] text-amber-700">Speaking</span><br /><span className="text-sm font-bold">22/30</span></div>
          <div><span className="text-[10px] text-amber-700">Writing</span><br /><span className="text-sm font-bold">24/30</span></div>
        </div>
        <p className="text-sm font-semibold text-amber-900">
          Tổng: {sampleBand.totalScore}/120 — {sampleBand.band.label_vi}
        </p>
        <p className="text-xs text-amber-800 mt-1">{sampleBand.band.description_vi}</p>
      </div>
    </div>
  );
}
