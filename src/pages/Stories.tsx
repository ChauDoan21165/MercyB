// /stories — public index of approved/published testimonials.
// Anonymous-readable; only `status = 'published'` rows surface here
// (RLS enforces this server-side too, so even if an admin mis-clicks
// we cannot leak a pending row).
//
// Filter dimensions:
//   - Tag pills (multi-select; AND)
//   - Profession dropdown (single)
//   - Exam-type filter (IELTS / VSTEP / TOEIC) — derived from tags
//
// SEO: VI title + meta description set via document.* (the rest of the
// codebase doesn't use react-helmet — see VNCulturalIndexPage for the
// established pattern).

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import {
  STORY_TAGS,
  EXAM_TAGS,
  excerpt,
  type StoryTag,
  type UserStoryRow,
} from "@/lib/stories/types";

type ListItem = Pick<
  UserStoryRow,
  | "id"
  | "display_name"
  | "display_avatar_url"
  | "story_text_vi"
  | "ielts_band_before"
  | "ielts_band_after"
  | "vstep_level_before"
  | "vstep_level_after"
  | "profession"
  | "tags"
  | "published_at"
>;

const META_DESCRIPTION =
  "Câu chuyện thật của người Việt học tiếng Anh trên MercyBlade — IELTS, VSTEP, TOEIC, đổi việc, tự tin giao tiếp.";

export default function StoriesPage(): React.ReactElement {
  const [rows, setRows] = useState<ListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tagFilter, setTagFilter] = useState<StoryTag[]>([]);
  const [profession, setProfession] = useState<string>("");
  const [exam, setExam] = useState<"" | "IELTS" | "VSTEP" | "TOEIC">("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previousTitle = document.title;
    const previousDesc = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    document.title = "Câu chuyện học viên · MercyBlade";
    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", META_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (previousDesc !== undefined && metaTag) {
        metaTag.setAttribute("content", previousDesc ?? "");
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: queryError } = await supabase
        .from("user_stories")
        .select(
          "id,display_name,display_avatar_url,story_text_vi,ielts_band_before,ielts_band_after,vstep_level_before,vstep_level_after,profession,tags,published_at",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(200);

      if (cancelled) return;
      if (queryError) {
        setError(queryError.message);
        setRows([]);
        return;
      }
      setRows((data ?? []) as ListItem[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const professions = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows ?? []) {
      if (r.profession) set.add(r.profession);
    }
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    return rows.filter((r) => {
      if (tagFilter.length > 0) {
        for (const t of tagFilter) {
          if (!r.tags.includes(t)) return false;
        }
      }
      if (profession && r.profession !== profession) return false;
      if (exam && !r.tags.includes(exam)) return false;
      return true;
    });
  }, [rows, tagFilter, profession, exam]);

  function toggleTag(t: StoryTag) {
    setTagFilter((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Câu chuyện thật của người học
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Real stories from Vietnamese learners.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Mỗi câu chuyện đều do người học tự gửi và được đội ngũ MercyBlade duyệt.
        </p>
      </header>

      {/* Filters */}
      <section className="mb-6 space-y-3" aria-label="Bộ lọc">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Thẻ / Tags</p>
          <div className="flex flex-wrap gap-2">
            {STORY_TAGS.map((tag) => {
              const on = tagFilter.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    on
                      ? "border-amber-400 bg-amber-100 text-amber-900"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nghề / Profession
            </label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="">Tất cả</option>
              {professions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Kỳ thi / Exam
            </label>
            <select
              value={exam}
              onChange={(e) =>
                setExam(e.target.value as "" | "IELTS" | "VSTEP" | "TOEIC")
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="">Tất cả</option>
              {Array.from(EXAM_TAGS).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {rows === null && !error && (
        <p className="text-sm text-slate-500">Đang tải…</p>
      )}
      {filtered && filtered.length === 0 && !error && (
        <p className="text-sm text-slate-500">
          Chưa có câu chuyện phù hợp với bộ lọc. Hãy bỏ bớt bộ lọc nhé.
        </p>
      )}

      <ul className="space-y-3">
        {(filtered ?? []).map((r) => (
          <li key={r.id}>
            <Link
              to={`/stories/${r.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-amber-300 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar name={r.display_name} url={r.display_avatar_url} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{r.display_name}</p>
                    <ScoreDelta row={r} />
                  </div>
                  {r.profession && (
                    <p className="mt-0.5 text-xs text-slate-500">{r.profession}</p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {excerpt(r.story_text_vi, 140)}
                  </p>
                  {r.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-12 w-12 flex-none rounded-full object-cover"
        loading="lazy"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-amber-100 text-base font-bold text-amber-800">
      {initial}
    </div>
  );
}

function ScoreDelta({ row }: { row: ListItem }) {
  if (row.ielts_band_before != null && row.ielts_band_after != null) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
        IELTS {row.ielts_band_before} → {row.ielts_band_after}
      </span>
    );
  }
  if (row.vstep_level_before && row.vstep_level_after) {
    return (
      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
        VSTEP {row.vstep_level_before} → {row.vstep_level_after}
      </span>
    );
  }
  return null;
}
