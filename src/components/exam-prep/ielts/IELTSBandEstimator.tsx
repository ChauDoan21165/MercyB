// src/components/exam-prep/ielts/IELTSBandEstimator.tsx
//
// Inputs: 4 section scores. Outputs: per-section band + overall band
// + descriptor. Listening/Reading take raw counts (0–40); Writing/
// Speaking take an estimated band directly (0–9, in 0.5 increments).

import React, { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  descriptorForBand,
  listeningRawToBand,
  overallBand,
  readingRawToBand,
  snapToBand,
  type IELTSBand,
} from "@/data/exam-prep/ielts/band-descriptors";
import { IELTS_COPY } from "./ieltsCopy";

function clampNumeric(value: string, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function IELTSBandEstimator() {
  const [listeningRaw, setListeningRaw] = useState("");
  const [readingRaw, setReadingRaw] = useState("");
  const [writingBand, setWritingBand] = useState("");
  const [speakingBand, setSpeakingBand] = useState("");

  const result = useMemo(() => {
    const listening = listeningRawToBand(clampNumeric(listeningRaw, 0, 40));
    const reading = readingRawToBand(clampNumeric(readingRaw, 0, 40));
    const writing = snapToBand(clampNumeric(writingBand, 0, 9));
    const speaking = snapToBand(clampNumeric(speakingBand, 0, 9));
    const overall: IELTSBand = overallBand({
      listening,
      reading,
      writing,
      speaking,
    });
    return { listening, reading, writing, speaking, overall };
  }, [listeningRaw, readingRaw, writingBand, speakingBand]);

  const descriptor = descriptorForBand(result.overall);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator size={18} />
        <h2 className="text-base font-semibold text-foreground">
          {IELTS_COPY.estimatorTitle.vi}
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        {IELTS_COPY.estimatorIntro.vi}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label={IELTS_COPY.estimatorListeningRaw.vi}
          value={listeningRaw}
          onChange={setListeningRaw}
          band={result.listening}
        />
        <Field
          label={IELTS_COPY.estimatorReadingRaw.vi}
          value={readingRaw}
          onChange={setReadingRaw}
          band={result.reading}
        />
        <Field
          label={IELTS_COPY.estimatorWritingBand.vi}
          value={writingBand}
          onChange={setWritingBand}
          band={result.writing}
          step={0.5}
          max={9}
        />
        <Field
          label={IELTS_COPY.estimatorSpeakingBand.vi}
          value={speakingBand}
          onChange={setSpeakingBand}
          band={result.speaking}
          step={0.5}
          max={9}
        />
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {IELTS_COPY.estimatorOverallLabel.vi}
        </p>
        <p className="mt-1 text-3xl font-semibold text-foreground">
          {result.overall}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            / 9
          </span>
        </p>
        {descriptor && (
          <>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
              {IELTS_COPY.estimatorDescriptorLabel.vi}
            </p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {descriptor.label_vi}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {descriptor.summary_vi}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  band: IELTSBand;
  step?: number;
  max?: number;
}

function Field({ label, value, onChange, band, step = 1, max = 40 }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="decimal"
          step={step}
          min={0}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="max-w-[120px]"
        />
        <span className="text-xs text-muted-foreground">
          → Band {band}
        </span>
      </div>
    </div>
  );
}
