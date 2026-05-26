// src/components/pronunciation/WaveformComparison.tsx
//
// Stacked waveform overlay for the Speak-tab "So sánh với Mercy" card.
//
// Two waveforms in one canvas:
//   • Top half:    user's recording (blue)
//   • Bottom half: Mercy reference (green)
// Shared X axis (after time-stretch alignment in audioComparison.ts).
// Orange highlight bands on either waveform mark buckets where the
// user diverged from the reference by more than DIVERGENCE_THRESHOLD —
// the eye reads this as "right here you sounded off."
//
// Why a single canvas: two stacked SVGs would double DOM nodes for the
// 500-bucket case. Canvas keeps it cheap on mid-tier Android.
//
// Brief contract:
//   • tap to play either waveform (we expose two play buttons + tap on
//     either half also plays that side)
//   • "loop both" mode: user → Mercy → user → Mercy until stopped
//   • bilingual labels (Bạn / You and Mercy)

import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, Repeat, Square, Loader2 } from "lucide-react";

import {
  diffWaveforms,
  divergentMask,
  type Waveform,
} from "@/lib/pronunciation/audioComparison";

export type WaveformComparisonProps = {
  user: Waveform | null;
  /** Reference (Mercy) waveform. May still be loading. */
  reference: Waveform | null;
  /** Direct URLs for the two clips so we can play them on tap. */
  userAudioUrl: string | null;
  referenceAudioUrl: string | null;
  /** True while the reference TTS is still being fetched. */
  loadingReference?: boolean;
  /** Optional surface error to render under the canvas. */
  error?: string | null;
};

const COLOR_USER = "#3b82f6"; // tailwind blue-500
const COLOR_USER_FILL = "rgba(59,130,246,0.18)";
const COLOR_REF = "#16a34a"; // tailwind green-600
const COLOR_REF_FILL = "rgba(22,163,74,0.18)";
const COLOR_DIVERGE = "rgba(249,115,22,0.42)"; // orange-500 @ ~42% alpha
const COLOR_AXIS = "rgba(15,23,42,0.10)";
const COLOR_BG = "#fafaf9";
const CANVAS_HEIGHT = 160;

export default function WaveformComparison({
  user,
  reference,
  userAudioUrl,
  referenceAudioUrl,
  loadingReference,
  error,
}: WaveformComparisonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState<"user" | "ref" | "loop" | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const loopGuardRef = useRef<{ stop: boolean }>({ stop: false });

  // Derive comparison vectors once per (user, reference) pair.
  const { commonLength, diverge } = useMemo(() => {
    if (!user || !reference) {
      return { commonLength: 0, diverge: new Uint8Array(0) };
    }
    const length = Math.max(user.samples.length, reference.samples.length);
    const diff = diffWaveforms(user.samples, reference.samples, length);
    return { commonLength: length, diverge: divergentMask(diff) };
  }, [user, reference]);

  // Canvas paint pass.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const cssWidth = canvas.clientWidth || canvas.width;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(CANVAS_HEIGHT * dpr);
    ctx.scale(dpr, dpr);

    // Background + centre axis.
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, cssWidth, CANVAS_HEIGHT);

    const midY = CANVAS_HEIGHT / 2;
    ctx.strokeStyle = COLOR_AXIS;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(cssWidth, midY);
    ctx.stroke();

    if (!user || !reference || commonLength === 0) {
      return; // empty state — caller renders skeleton/spinner
    }

    const stretchedUser = stretchForCanvas(user.samples, commonLength);
    const stretchedRef = stretchForCanvas(reference.samples, commonLength);
    const bucketWidth = cssWidth / commonLength;

    // Divergent band overlay — drawn FIRST so the waveform lines sit on top.
    ctx.fillStyle = COLOR_DIVERGE;
    for (let i = 0; i < commonLength; i++) {
      if (diverge[i]) {
        ctx.fillRect(i * bucketWidth, 0, Math.max(1, bucketWidth), CANVAS_HEIGHT);
      }
    }

    // User waveform (top half).
    drawHalfWaveform(ctx, stretchedUser, {
      yTop: 8,
      yBottom: midY - 4,
      bucketWidth,
      stroke: COLOR_USER,
      fill: COLOR_USER_FILL,
    });

    // Reference waveform (bottom half).
    drawHalfWaveform(ctx, stretchedRef, {
      yTop: midY + 4,
      yBottom: CANVAS_HEIGHT - 8,
      bucketWidth,
      stroke: COLOR_REF,
      fill: COLOR_REF_FILL,
    });
  }, [user, reference, commonLength, diverge]);

  // Cleanup audio when unmounting.
  useEffect(() => {
    return () => {
      const a = audioElementRef.current;
      if (a) {
        try {
          a.pause();
          a.src = "";
        } catch {
          /* ignore */
        }
      }
      loopGuardRef.current.stop = true;
    };
  }, []);

  function playOnce(url: string | null): Promise<void> {
    return new Promise((resolve) => {
      if (!url) {
        resolve();
        return;
      }
      // Stop any previous playback.
      const prev = audioElementRef.current;
      if (prev) {
        try {
          prev.pause();
          prev.src = "";
        } catch {
          /* ignore */
        }
      }
      const audio = new Audio(url);
      audioElementRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve(); // fail-quiet — UI moves on
      audio.play().catch(() => resolve());
    });
  }

  async function playUser() {
    setPlaying("user");
    await playOnce(userAudioUrl);
    setPlaying((p) => (p === "user" ? null : p));
  }

  async function playReference() {
    setPlaying("ref");
    await playOnce(referenceAudioUrl);
    setPlaying((p) => (p === "ref" ? null : p));
  }

  async function startLoop() {
    if (!userAudioUrl || !referenceAudioUrl) return;
    setPlaying("loop");
    loopGuardRef.current.stop = false;
    while (!loopGuardRef.current.stop) {
      await playOnce(userAudioUrl);
      if (loopGuardRef.current.stop) break;
      await playOnce(referenceAudioUrl);
    }
    setPlaying((p) => (p === "loop" ? null : p));
  }

  function stopLoop() {
    loopGuardRef.current.stop = true;
    const a = audioElementRef.current;
    if (a) {
      try {
        a.pause();
        a.src = "";
      } catch {
        /* ignore */
      }
    }
    setPlaying(null);
  }

  const showSpinner = loadingReference && !reference;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            So sánh với Mercy
          </div>
          <div className="text-[11px] text-slate-500">Compare with Mercy</div>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 text-blue-600">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Bạn · You
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
            Mercy
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: CANVAS_HEIGHT, display: "block" }}
          aria-label="Waveform comparison: user recording on top, Mercy reference on bottom"
        />
        {showSpinner ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2 text-xs">Đang tạo giọng Mercy… · Generating Mercy's voice…</span>
          </div>
        ) : null}
        {!user && !showSpinner ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-500">
            Chưa có ghi âm · No recording yet
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          {error}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void playUser()}
          disabled={!userAudioUrl || playing === "loop"}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Nghe bạn · Play you
          {playing === "user" ? <span className="ml-1 animate-pulse">▶</span> : null}
        </button>
        <button
          type="button"
          onClick={() => void playReference()}
          disabled={!referenceAudioUrl || playing === "loop"}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
        >
          <Volume2 className="h-3.5 w-3.5" />
          Nghe Mercy · Play Mercy
          {playing === "ref" ? <span className="ml-1 animate-pulse">▶</span> : null}
        </button>
        {playing === "loop" ? (
          <button
            type="button"
            onClick={stopLoop}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <Square className="h-3.5 w-3.5" />
            Dừng · Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startLoop()}
            disabled={!userAudioUrl || !referenceAudioUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Repeat className="h-3.5 w-3.5" />
            Lặp lại · Loop both
          </button>
        )}
      </div>

      <p className="mt-2 text-[11px] leading-snug text-slate-500">
        Vùng cam: chỗ bạn khác Mercy nhiều nhất ·{" "}
        <span className="italic">Orange bands mark where you diverged most</span>
      </p>
    </div>
  );
}

// ─── Canvas helpers ──────────────────────────────────────────────────────

function drawHalfWaveform(
  ctx: CanvasRenderingContext2D,
  samples: Float32Array,
  args: {
    yTop: number;
    yBottom: number;
    bucketWidth: number;
    stroke: string;
    fill: string;
  },
) {
  const { yTop, yBottom, bucketWidth, stroke, fill } = args;
  const range = yBottom - yTop;
  const baseline = yBottom;
  if (samples.length === 0 || range <= 0) return;

  ctx.beginPath();
  ctx.moveTo(0, baseline);
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(0, Math.min(1, samples[i]));
    const y = baseline - v * range;
    ctx.lineTo(i * bucketWidth, y);
  }
  ctx.lineTo(samples.length * bucketWidth, baseline);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  ctx.beginPath();
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(0, Math.min(1, samples[i]));
    const y = baseline - v * range;
    if (i === 0) ctx.moveTo(0, y);
    else ctx.lineTo(i * bucketWidth, y);
  }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

/**
 * Inline copy of stretchToLength for the canvas pass — keeps the
 * canvas paint code self-contained and avoids re-importing the
 * pure helper into a useEffect (the deps array stays simple).
 */
function stretchForCanvas(src: Float32Array, target: number): Float32Array {
  if (target <= 0) return new Float32Array(0);
  if (src.length === 0) return new Float32Array(target);
  if (src.length === target) return src;
  const out = new Float32Array(target);
  const ratio = (src.length - 1) / Math.max(1, target - 1);
  for (let i = 0; i < target; i++) {
    const t = i * ratio;
    const lo = Math.floor(t);
    const hi = Math.min(src.length - 1, lo + 1);
    const frac = t - lo;
    out[i] = src[lo] * (1 - frac) + src[hi] * frac;
  }
  return out;
}
