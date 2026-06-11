// src/pages/profile/ShareProgressPage.tsx
//
// Step 6 (Community) — generate a shareable progress image and offer
// download + share buttons. Auth-required (anchored to the current
// user's own stats).
//
// Image strategy: hand-built SVG. No external dep (html-to-image and
// html2canvas are not installed). The SVG is also rendered inline so
// the user sees what they'll get; the download path serializes the
// same DOM node into a data URL.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import { PROGRESS_SHARE_COPY } from "@/lib/feedback/family-bridge/content-pack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OwnStats {
  username: string | null;
  display_name: string | null;
  streak_current: number;
  total_xp: number;
  lessons_completed: number;
}

const CARD_WIDTH = 800;
const CARD_HEIGHT = 1000;

export default function ShareProgressPage(): React.ReactElement {
  const { user } = useAuth();
  const [stats, setStats] = useState<OwnStats | null>(null);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { toast } = useToast();

  const { data: profileRow, isFetched: profileFetched } = useProfileQuery(
    user?.id ?? null,
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (!profileFetched) return;
    let cancelled = false;
    setLoading(true);

    void Promise.all([
      supabase
        .from("user_xp")
        .select("total_xp")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("user_room_progress")
        .select("room_id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("progress_pct", 100),
    ]).then(([xpRes, lessonsRes]) => {
      if (cancelled) return;
      const row = profileRow as {
        username?: string | null;
        display_name?: string | null;
        streak_current?: number | null;
      } | null | undefined;
      const xpRow = (xpRes.data ?? null) as {
        total_xp?: number | null;
      } | null;
      setStats({
        username: row?.username ?? null,
        display_name: row?.display_name ?? null,
        streak_current: row?.streak_current ?? 0,
        total_xp: xpRow?.total_xp ?? 0,
        lessons_completed: lessonsRes.count ?? 0,
      });
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, profileFetched, profileRow]);

  const headline = useMemo(() => {
    if (!stats) return "";
    const days = stats.streak_current;
    if (days <= 0) return "Tôi đang học tiếng Anh trên MercyBlade.";
    return `Tôi học tiếng Anh được ${days} ngày liền trên MercyBlade.`;
  }, [stats]);

  function handleDownload(): void {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n', source], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mercyblade-progress-${stats?.username ?? "user"}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyHeadline(): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(headline).then(() => {
      toast({ title: "Đã sao chép / Copied" });
    });
  }

  function shareFacebook(): void {
    if (typeof window === "undefined") return;
    const text = encodeURIComponent(headline);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareZalo(): void {
    if (typeof window === "undefined") return;
    window.open(
      `https://zalo.me/share?u=${encodeURIComponent(window.location.origin)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold">Cần đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-500">
          Đăng nhập để tạo ảnh chia sẻ tiến độ.
        </p>
        <Link to="/signin" className="mt-4 text-amber-600 underline">
          Đăng nhập / Sign in
        </Link>
      </main>
    );
  }

  if (loading || !stats) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-slate-500">Đang tạo ảnh chia sẻ…</p>
      </main>
    );
  }

  const displayName = stats.display_name?.trim() || stats.username || "Mercy Learner";

  return (
    <main className="mx-auto max-w-md space-y-4 px-4 py-6">
      <Card>
        <CardContent className="space-y-4 p-4">
          <header>
            <h1 className="text-xl font-semibold text-slate-900">
              Chia sẻ tiến độ / Share progress
            </h1>
            <p className="text-sm text-slate-500">
              Lưu ảnh và đăng lên Facebook hoặc Zalo của bạn.
            </p>
          </header>

          <div className="overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
            <ProgressShareSvg
              ref={svgRef}
              displayName={displayName}
              streak={stats.streak_current}
              xp={stats.total_xp}
              lessons={stats.lessons_completed}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" aria-hidden />
              Tải ảnh / Download
            </Button>
            <Button type="button" variant="outline" onClick={copyHeadline}>
              <Copy className="mr-1 h-4 w-4" aria-hidden />
              Copy text
            </Button>
            <Button type="button" variant="outline" onClick={shareFacebook}>
              <Share2 className="mr-1 h-4 w-4" aria-hidden />
              Facebook
            </Button>
            <Button type="button" variant="outline" onClick={shareZalo}>
              <Share2 className="mr-1 h-4 w-4" aria-hidden />
              Zalo
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            Bạn có thể chia sẻ ảnh và link hồ sơ công khai (nếu đã bật):{" "}
            {stats.username ? (
              <Link
                to={`/u/${stats.username}`}
                className="text-amber-600 underline"
              >
                /u/{stats.username}
              </Link>
            ) : (
              <span>chưa có username</span>
            )}
            .
          </p>
        </CardContent>
      </Card>

      <FamilyShareSection streak={stats.streak_current} />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Family-share section — parent-mode variant of the share card.
// Copy templates from the Step-13 content pack for sending to family.
// Exported for isolated unit tests.
// ─────────────────────────────────────────────────────────────────────────────

export function FamilyShareSection({
  streak,
}: {
  streak: number;
}): React.ReactElement {
  const { toast } = useToast();

  function interpolate(template: string): string {
    return template.replace("{streak}", String(streak));
  }

  function copyMessage(message: string): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(interpolate(message)).then(() => {
      toast({ title: "Đã sao chép / Copied" });
    });
  }

  // Show parent template always; streak template only when streak is active.
  const templates = PROGRESS_SHARE_COPY.filter(
    (t) =>
      t.id === "family-share-parent" ||
      (t.id === "family-share-streak" && streak > 0),
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <header>
          <h2 className="text-base font-semibold text-slate-900" lang="vi">
            Gửi cho gia đình
          </h2>
          <p className="text-sm text-slate-500" lang="vi">
            Sao chép tin nhắn để gửi cho ba mẹ hoặc người thân.
          </p>
        </header>
        <ul className="space-y-3">
          {templates.map((t) => (
            <li
              key={t.id}
              data-testid={`family-share-template-${t.id}`}
              className="rounded-lg border border-amber-100 bg-amber-50 p-3"
            >
              <p className="text-sm leading-relaxed text-slate-700" lang="vi">
                {interpolate(t.learnerMessageVi)}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => copyMessage(t.learnerMessageVi)}
              >
                <Copy className="mr-1 h-3 w-3" aria-hidden />
                <span lang="vi">{t.labelVi}</span>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface ProgressShareSvgProps {
  displayName: string;
  streak: number;
  xp: number;
  lessons: number;
}

const ProgressShareSvg = React.forwardRef<SVGSVGElement, ProgressShareSvgProps>(
  function ProgressShareSvg(
    { displayName, streak, xp, lessons }: ProgressShareSvgProps,
    ref,
  ) {
    const headline =
      streak > 0
        ? `Tôi học tiếng Anh được ${streak} ngày liền`
        : "Tôi đang học tiếng Anh";

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
        width="100%"
        role="img"
        aria-label="Progress share image"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>

        <rect width={CARD_WIDTH} height={CARD_HEIGHT} fill="url(#bgGrad)" />

        <text
          x={CARD_WIDTH / 2}
          y={140}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          fontSize={48}
          fontWeight={700}
          fill="#92400e"
        >
          MercyBlade
        </text>

        <text
          x={CARD_WIDTH / 2}
          y={200}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          fontSize={24}
          fill="#9a3412"
        >
          Học tiếng Anh dành cho người Việt
        </text>

        <text
          x={CARD_WIDTH / 2}
          y={350}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          fontSize={42}
          fontWeight={700}
          fill="#1f2937"
        >
          {headline}
        </text>

        <text
          x={CARD_WIDTH / 2}
          y={420}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          fontSize={28}
          fill="#475569"
        >
          — {displayName}
        </text>

        <g transform={`translate(${CARD_WIDTH / 2 - 280}, 520)`}>
          <StatBlock x={0} icon="🔥" label="Chuỗi ngày" value={String(streak)} />
          <StatBlock x={200} icon="🏆" label="Điểm XP" value={String(xp)} />
          <StatBlock x={400} icon="📚" label="Bài học" value={String(lessons)} />
        </g>

        <text
          x={CARD_WIDTH / 2}
          y={CARD_HEIGHT - 80}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          fontSize={22}
          fill="#92400e"
          fontWeight={600}
        >
          mercyblade.com
        </text>
      </svg>
    );
  },
);

interface StatBlockProps {
  x: number;
  icon: string;
  label: string;
  value: string;
}

function StatBlock({ x, icon, label, value }: StatBlockProps): React.ReactElement {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect
        width={160}
        height={160}
        rx={20}
        ry={20}
        fill="#ffffff"
        stroke="#fcd34d"
        strokeWidth={3}
      />
      <text
        x={80}
        y={60}
        textAnchor="middle"
        fontSize={40}
        fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
      >
        {icon}
      </text>
      <text
        x={80}
        y={108}
        textAnchor="middle"
        fontSize={32}
        fontWeight={700}
        fill="#1f2937"
        fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
      >
        {value}
      </text>
      <text
        x={80}
        y={140}
        textAnchor="middle"
        fontSize={16}
        fill="#64748b"
        fontFamily="system-ui, -apple-system, Helvetica, Arial, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}
