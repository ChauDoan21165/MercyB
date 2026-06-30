// src/components/share/ShareableStreakCard.tsx
//
// Step 11 — branded streak card. Renders a polished 1080×1350 PNG
// (Instagram/Facebook portrait ratio) of the user's current streak,
// with the MercyBlade logo and a "made by Chau" credit. Free-tier
// — drives evangelism via word-of-mouth posts.
//
// Implementation: HTML5 Canvas. No external dependency. The drawing
// happens on a hidden offscreen <canvas>; the visible component shows
// a CSS preview that mirrors the canvas layout so the user sees what
// they'll get before they hit Download or Share.

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Copy, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareableStreakCardProps {
  /** Current streak length in days. */
  streak: number;
  /** Display name shown above the streak. */
  displayName: string;
  /** Optional longest streak — appears as a smaller pill. */
  longestStreak?: number;
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

const DEFAULT_HEADLINE_VN = (n: number) => `Tôi học tiếng Anh ${n} ngày liền trên MercyBlade`;
const DEFAULT_HEADLINE_EN = (n: number) =>
  n === 1
    ? "Day 1 of learning English with MercyBlade"
    : `${n} days of learning English with MercyBlade`;

export default function ShareableStreakCard({
  streak,
  displayName,
  longestStreak,
}: ShareableStreakCardProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = CARD_WIDTH;
    canvas.height = CARD_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient — amber to deeper amber.
    const bg = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
    bg.addColorStop(0, "#fffbeb");
    bg.addColorStop(1, "#fcd34d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

    // Subtle inner border.
    ctx.strokeStyle = "rgba(154, 52, 18, 0.18)";
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, CARD_WIDTH - 80, CARD_HEIGHT - 80);

    // Brand mark — top-left.
    ctx.fillStyle = "#92400e";
    ctx.font = "700 64px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("MercyBlade", 100, 180);

    ctx.fillStyle = "#9a3412";
    ctx.font = "400 28px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText("Học tiếng Anh dành cho người Việt", 100, 226);

    // Big number — center stage.
    ctx.fillStyle = "#7c2d12";
    ctx.font = "800 280px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(streak), CARD_WIDTH / 2, 660);

    // Flame icon row.
    ctx.fillStyle = "#dc2626";
    ctx.font = "400 80px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText("🔥", CARD_WIDTH / 2 - 220, 660);
    ctx.fillText("🔥", CARD_WIDTH / 2 + 220, 660);

    // VN headline.
    ctx.fillStyle = "#1f2937";
    ctx.font = "700 46px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    drawWrappedText(
      ctx,
      DEFAULT_HEADLINE_VN(streak),
      CARD_WIDTH / 2,
      820,
      CARD_WIDTH - 200,
      56,
    );

    // EN subhead.
    ctx.fillStyle = "#475569";
    ctx.font = "400 32px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    drawWrappedText(
      ctx,
      DEFAULT_HEADLINE_EN(streak),
      CARD_WIDTH / 2,
      940,
      CARD_WIDTH - 200,
      40,
    );

    // Display name pill.
    ctx.fillStyle = "#92400e";
    ctx.font = "600 36px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(`— ${displayName}`, CARD_WIDTH / 2, 1060);

    // Longest streak pill (optional).
    if (typeof longestStreak === "number" && longestStreak > 0) {
      ctx.fillStyle = "rgba(154, 52, 18, 0.85)";
      ctx.font = "500 26px system-ui, -apple-system, Helvetica, Arial, sans-serif";
      ctx.fillText(
        `Best streak: ${longestStreak} days`,
        CARD_WIDTH / 2,
        1110,
      );
    }

    // Founder credit + URL.
    ctx.fillStyle = "#92400e";
    ctx.font = "500 28px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("mercyblade.com", CARD_WIDTH / 2, CARD_HEIGHT - 130);

    ctx.fillStyle = "rgba(154, 52, 18, 0.65)";
    ctx.font = "400 22px system-ui, -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText("MercyBlade · for the VN diaspora", CARD_WIDTH / 2, CARD_HEIGHT - 90);

    // Update the visible preview.
    setPreviewUrl(canvas.toDataURL("image/png"));
  }, [streak, displayName, longestStreak]);

  useEffect(() => {
    draw();
  }, [draw]);

  function handleDownload(): void {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mercyblade-streak-${streak}-days.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  async function handleShare(): Promise<void> {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (!blob) return;

    const file = new File([blob], `mercyblade-streak-${streak}-days.png`, {
      type: "image/png",
    });

    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      typeof (navigator as Navigator).canShare === "function" &&
      (navigator as Navigator).canShare({ files: [file] })
    ) {
      try {
        await (navigator as Navigator).share({
          files: [file],
          title: "MercyBlade streak",
          text: DEFAULT_HEADLINE_VN(streak),
        });
        return;
      } catch {
        // User cancelled or browser blocked — silently fall back.
      }
    }
    handleDownload();
  }

  function copyHeadline(): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(DEFAULT_HEADLINE_VN(streak)).then(() => {
      toast({ title: "Đã sao chép / Copied" });
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <header>
          <h2 className="text-lg font-semibold text-slate-900">
            Chia sẻ chuỗi ngày học / Share your streak
          </h2>
          <p className="text-xs text-slate-600">
            Tải ảnh PNG hoặc đăng thẳng lên Facebook / Zalo.
          </p>
        </header>

        {/* Visible preview — CSS mirrors the canvas layout */}
        <div
          className="overflow-hidden rounded-lg border border-amber-200"
          style={{ background: "linear-gradient(180deg,#fffbeb 0%,#fcd34d 100%)" }}
          data-testid="streak-card-preview"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${streak}-day streak preview`}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center text-amber-700">
              <Flame className="h-10 w-10" aria-hidden />
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ display: "none" }}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
        />

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" aria-hidden />
            Tải PNG / Download
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleShare()}>
            <Share2 className="mr-1 h-4 w-4" aria-hidden />
            Chia sẻ / Share
          </Button>
          <Button type="button" variant="outline" onClick={copyHeadline}>
            <Copy className="mr-1 h-4 w-4" aria-hidden />
            Copy text
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const width = ctx.measureText(test).width;
    if (width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}
