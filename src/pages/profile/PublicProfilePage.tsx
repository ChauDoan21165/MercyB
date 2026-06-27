// src/pages/profile/PublicProfilePage.tsx
//
// Step 6 (Community) — public-facing profile at /u/:username.
//
// Renders nothing identifying unless the profile is public. The
// `getPublicProfile` RPC returns null for both "not found" and "set
// to private" — the page treats both as 404 so we don't leak whether
// a username exists.
//
// Mobile-first (375 px). No PII shown — only display_name, bio,
// country flag, avatar, and the three public stats (streak, XP,
// lessons). No email, no phone, no full_name.

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getPublicProfile,
  type PublicProfile,
} from "@/lib/profile/publicProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy, BookOpen, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function countryToFlag(code: string | null): string {
  if (!code || code.length !== 2) return "";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(
    A + (code.charCodeAt(0) - a),
    A + (code.charCodeAt(1) - a),
  );
}

export default function PublicProfilePage(): React.ReactElement {
  const { username = "" } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicProfile(username).then((p) => {
      if (cancelled) return;
      setProfile(p);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!profile) return;
    const previous = document.title;
    const display = profile.display_name?.trim() || profile.username;
    document.title = `${display} · MercyBlade`;
    return () => {
      document.title = previous;
    };
  }, [profile]);

  if (loading) {
    return <CenteredMessage title="Loading…" subtitle="Đang tải hồ sơ…" />;
  }

  if (!profile) {
    return (
      <CenteredMessage
        title="Profile not found"
        subtitle="Hồ sơ không tồn tại hoặc đang ở chế độ riêng tư."
        cta={
          <Link to="/" className="text-amber-600 underline">
            Về trang chủ / Home
          </Link>
        }
      />
    );
  }

  const flag = countryToFlag(profile.country);
  const displayName = profile.display_name?.trim() || profile.username;
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${profile.username}`
      : `/u/${profile.username}`;

  function copyLink(): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(profileUrl).then(() => {
      toast({ title: "Đã sao chép link / Link copied" });
    });
  }

  function shareFacebook(): void {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareZalo(): void {
    const url = `https://zalo.me/share?u=${encodeURIComponent(profileUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <header className="flex flex-col items-center text-center">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={`${displayName} avatar`}
                className="h-24 w-24 rounded-full border-2 border-amber-200 object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 text-3xl">
                👤
              </div>
            )}
            <h1 className="mt-3 text-xl font-semibold text-slate-900">
              {displayName} {flag ? <span className="ml-1">{flag}</span> : null}
            </h1>
            <p className="text-sm text-slate-600">@{profile.username}</p>
            {profile.bio ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {profile.bio}
              </p>
            ) : null}
          </header>

          <section
            className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-4"
            aria-label="Public stats"
          >
            <Stat
              icon={<Flame className="h-4 w-4" aria-hidden />}
              labelEn="Streak"
              labelVi="Chuỗi ngày"
              value={profile.streak_current}
            />
            <Stat
              icon={<Trophy className="h-4 w-4" aria-hidden />}
              labelEn="Total XP"
              labelVi="Tổng điểm"
              value={profile.total_xp}
            />
            <Stat
              icon={<BookOpen className="h-4 w-4" aria-hidden />}
              labelEn="Lessons"
              labelVi="Bài học"
              value={profile.lessons_completed}
            />
          </section>

          <section className="space-y-2 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Chia sẻ / Share
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyLink}
                aria-label="Copy profile link"
              >
                <Copy className="mr-1 h-3 w-3" aria-hidden />
                Copy link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={shareFacebook}
                aria-label="Share on Facebook"
              >
                <Share2 className="mr-1 h-3 w-3" aria-hidden />
                Facebook
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={shareZalo}
                aria-label="Share on Zalo"
              >
                <Share2 className="mr-1 h-3 w-3" aria-hidden />
                Zalo
              </Button>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-4">
            <Link
              to="/account?tab=referral"
              className="block w-full rounded-md bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-amber-600"
            >
              Mã giới thiệu / Use a referral code
            </Link>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}

interface StatProps {
  icon: React.ReactNode;
  labelEn: string;
  labelVi: string;
  value: number;
}

function Stat({ icon, labelEn, labelVi, value }: StatProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center rounded-md bg-slate-50 p-2 text-center">
      <div className="text-amber-600">{icon}</div>
      <span className="mt-1 text-lg font-semibold text-slate-900">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-600">
        {labelVi}
      </span>
      <span className="text-[10px] text-slate-600">{labelEn}</span>
    </div>
  );
}

interface CenteredMessageProps {
  title: string;
  subtitle: string;
  cta?: React.ReactNode;
}

function CenteredMessage({
  title,
  subtitle,
  cta,
}: CenteredMessageProps): React.ReactElement {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      {cta ? <div className="mt-4">{cta}</div> : null}
    </main>
  );
}
