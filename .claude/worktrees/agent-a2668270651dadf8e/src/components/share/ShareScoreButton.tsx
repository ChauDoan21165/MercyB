// One-tap "Share to Facebook" button for the Speak tab. Renders only
// when the score is high enough to be worth sharing (>= 70). Disabled
// for the few seconds the canvas + upload + share-sheet runs so a
// fast double-tap can't queue two shares.

import React, { useState } from "react";
import { Share2, Loader2, Check } from "lucide-react";

import {
  shareScoreToFacebook,
  type FacebookShareOutcome,
} from "@/lib/share/facebookShare";
import type { ShareScoreInput } from "@/lib/share/scoreCard";

export type ShareScoreButtonProps = {
  /** What to render in the share card. */
  input: ShareScoreInput;
  /**
   * Score gate. Default 70 (matches the brief). Below this the button
   * does not render; above it the button is interactive.
   */
  minScoreToShow?: number;
  /**
   * Optional analytics callback. Wired to your existing tracker. The
   * orchestrator calls this with `share_score_card_clicked` before the
   * share path is picked.
   */
  onTrack?: (event: string, payload: Record<string, unknown>) => void;
  /**
   * Optional className passthrough so the host can tune layout (margin
   * / alignment) without forking the component.
   */
  className?: string;
};

type ButtonState = "idle" | "working" | "shared" | "error";

export default function ShareScoreButton({
  input,
  minScoreToShow = 70,
  onTrack,
  className = "",
}: ShareScoreButtonProps) {
  const [state, setState] = useState<ButtonState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (input.overallScore < minScoreToShow) return null;

  const onClick = async () => {
    if (state === "working") return;
    setState("working");
    setErrorMsg(null);
    let outcome: FacebookShareOutcome;
    try {
      outcome = await shareScoreToFacebook(input, { onTrack });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      setState("error");
      setErrorMsg(msg);
      return;
    }
    if (outcome.ok) {
      setState("shared");
      // Reset to idle after a short delay so a re-share is possible.
      window.setTimeout(() => setState("idle"), 2400);
    } else if (outcome.reason === "share_cancelled") {
      // User dismissed the share sheet. Not an error — back to idle.
      setState("idle");
    } else {
      setState("error");
      setErrorMsg(humanizeFailure(outcome));
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={state === "working"}
        aria-label={state === "shared" ? "Shared" : "Share to Facebook"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-bold text-white shadow-[0_6px_18px_rgba(24,119,242,0.30)] transition hover:bg-[#0F65DA] disabled:opacity-70"
      >
        {state === "working" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Đang tạo… · Generating…
          </>
        ) : state === "shared" ? (
          <>
            <Check className="h-4 w-4" aria-hidden />
            Đã chia sẻ · Shared
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" aria-hidden />
            Chia sẻ Facebook · Share to Facebook
          </>
        )}
      </button>
      {state === "error" && errorMsg && (
        <div role="alert" className="mt-1 text-[11px] font-semibold text-rose-600">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

function humanizeFailure(outcome: FacebookShareOutcome): string {
  if (outcome.ok) return "";
  switch (outcome.reason) {
    case "blob_failed":
      return "Không tạo được ảnh. Thử lại nhé. · Could not generate image — try again.";
    case "upload_failed":
      return "Không tải được ảnh lên. Kiểm tra mạng. · Image upload failed — check your network.";
    case "no_share_target":
      return "Vui lòng đăng nhập để chia sẻ. · Sign in to share.";
    case "share_cancelled":
      return "";
    default:
      return "Có lỗi khi chia sẻ. · Share failed.";
  }
}
