// /stories/:storyId — single-story detail page. Public route. Pulls
// the row server-side; RLS surfaces the row only when status =
// 'published' OR the viewer is the owner. The owner sees a "hide"
// button for self-takedown.
//
// Share affordance: copy link to clipboard + open Facebook sharer in
// new tab (mirrors the existing facebookShare helper but inlined here
// because the score-card flow is more elaborate than what we need).
//
// CTA: "Bắt đầu hành trình giống <name>" → /placement (the placement
// welcome page). Vietnamese-first headline, English secondary.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import type { UserStoryRow } from "@/lib/stories/types";

const META_DESCRIPTION_FALLBACK =
  "Câu chuyện thật của người Việt học tiếng Anh trên MercyBlade.";

export default function StoryDetail(): React.ReactElement {
  const { storyId } = useParams<{ storyId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [row, setRow] = useState<UserStoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hideState, setHideState] = useState<"idle" | "hiding" | "hidden">("idle");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!storyId) return;
    let cancelled = false;
    (async () => {
      const { data, error: queryError } = await supabase
        .from("user_stories")
        .select("*")
        .eq("id", storyId)
        .maybeSingle<UserStoryRow>();
      if (cancelled) return;
      if (queryError) {
        setError(queryError.message);
        return;
      }
      if (!data) {
        setError("Không tìm thấy câu chuyện này.");
        return;
      }
      setRow(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [storyId]);

  // SEO meta. Run after row arrives so title/description reflect the
  // actual story.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousTitle = document.title;
    const previousDesc = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    const title = row
      ? `${row.display_name} · MercyBlade`
      : "Câu chuyện học viên · MercyBlade";
    const desc = row
      ? `${row.display_name}: ${row.story_text_vi.slice(0, 140)}`
      : META_DESCRIPTION_FALLBACK;

    document.title = title;
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", desc);

    return () => {
      document.title = previousTitle;
      if (metaTag) metaTag.setAttribute("content", previousDesc ?? "");
    };
  }, [row]);

  const isOwner = useMemo(
    () => Boolean(row && user?.id && row.user_id === user.id),
    [row, user?.id],
  );

  async function handleShare() {
    if (!row) return;
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://mercyblade.com/stories/${row.id}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        window.setTimeout(() => setShareCopied(false), 2500);
      }
    } catch {
      /* ignore */
    }

    if (typeof window !== "undefined") {
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(fbUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function handleHide() {
    if (!row || !isOwner) return;
    setHideState("hiding");
    const { error: updateError } = await supabase
      .from("user_stories")
      .update({
        takedown_requested_at: new Date().toISOString(),
        status: "archived",
      })
      .eq("id", row.id);
    if (updateError) {
      setHideState("idle");
      setError(updateError.message);
      return;
    }
    setHideState("hidden");
    window.setTimeout(() => navigate("/stories"), 1500);
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-sm text-red-700" role="alert">{error}</p>
        <Link to="/stories" className="mt-4 inline-block text-sm text-amber-700 underline">
          ← Quay lại danh sách câu chuyện
        </Link>
      </main>
    );
  }

  if (!row) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-sm text-slate-500">Đang tải…</p>
      </main>
    );
  }

  if (hideState === "hidden") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8 text-center">
        <p className="text-sm text-slate-700">
          Câu chuyện đã được ẩn. Đang chuyển hướng…
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <article>
        <header className="flex items-start gap-4">
          <Avatar name={row.display_name} url={row.display_avatar_url} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-900">{row.display_name}</h1>
            {row.profession && (
              <p className="mt-0.5 text-xs text-slate-500">{row.profession}</p>
            )}
            <ScoreDelta row={row} />
          </div>
        </header>

        <section className="mt-5 space-y-4">
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-800">
            {row.story_text_vi}
          </p>
          {row.story_text_en && (
            <>
              <hr className="border-slate-200" />
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-500">
                {row.story_text_en}
              </p>
            </>
          )}
        </section>

        {row.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {row.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white"
          >
            Chia sẻ / Share
          </button>
          {shareCopied && (
            <span className="text-xs text-emerald-700">Đã sao chép link.</span>
          )}
        </div>

        {/* CTA — this whole block points only at the placement test, so
            it is HIDDEN behind FEATURE_FLAGS.PLACEMENT_TEST_ENABLED
            (default false; see featureFlags.ts). Flip the one flag to
            bring the "start a journey like <name>" CTA back. */}
        {FEATURE_FLAGS.PLACEMENT_TEST_ENABLED && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
            <p className="text-base font-bold text-amber-900">
              Bắt đầu hành trình giống {row.display_name}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Start a journey like {row.display_name}.
            </p>
            <Link
              to="/placement"
              className="mt-3 inline-block rounded-full bg-amber-600 px-5 py-2 text-sm font-bold text-white"
            >
              Làm bài kiểm tra trình độ
            </Link>
          </div>
        )}

        {/* Owner takedown */}
        {isOwner && (
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Bạn là tác giả của câu chuyện này. Nếu muốn ẩn câu chuyện khỏi
              trang công khai, bấm nút bên dưới.
            </p>
            <button
              type="button"
              onClick={handleHide}
              disabled={hideState === "hiding"}
              className="mt-3 rounded-full border border-slate-500 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-400 hover:text-red-700 disabled:opacity-60"
            >
              {hideState === "hiding" ? "Đang ẩn…" : "Tôi muốn ẩn câu chuyện"}
            </button>
          </div>
        )}
      </article>
    </main>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-16 w-16 flex-none rounded-full object-cover"
        loading="lazy"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-16 w-16 flex-none items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-800">
      {initial}
    </div>
  );
}

function ScoreDelta({ row }: { row: UserStoryRow }) {
  if (row.ielts_band_before != null && row.ielts_band_after != null) {
    return (
      <p className="mt-1 text-sm font-semibold text-emerald-700">
        IELTS {row.ielts_band_before} → {row.ielts_band_after}
      </p>
    );
  }
  if (row.vstep_level_before && row.vstep_level_after) {
    return (
      <p className="mt-1 text-sm font-semibold text-emerald-700">
        VSTEP {row.vstep_level_before} → {row.vstep_level_after}
      </p>
    );
  }
  return null;
}
