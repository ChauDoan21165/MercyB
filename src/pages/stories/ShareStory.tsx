// /stories/share — story collection form. Auth-required (the route
// wrapper enforces it; we double-check on mount so the eligibility
// fetch never fires for an anon user).
//
// Bilingual VI-primary. English labels appear as a secondary line so
// the page reads as a Vietnamese form first.
//
// On submit we INSERT a `pending` row and (if a photo was attached and
// consent given) write the photo to share-cards bucket via
// uploadStoryPhoto. Photo upload is best-effort — a failure does not
// block the story; we just leave display_avatar_url null.

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import {
  isUserEligibleToShareStory,
  type EligibilityResult,
} from "@/lib/stories/eligibility";
import { uploadStoryPhoto } from "@/lib/stories/uploadStoryPhoto";
import {
  STORY_TAGS,
  type StoryContext,
  type StoryTag,
  STORY_CONTEXT_LABELS_VI,
  STORY_CONTEXT_LABELS_EN,
} from "@/lib/stories/types";

const MAX_VI_CHARS = 1000;

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; storyId: string }
  | { kind: "error"; message: string };

export default function ShareStory(): React.ReactElement {
  const { user } = useAuth();

  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);

  const [storyVi, setStoryVi] = useState("");
  const [storyEn, setStoryEn] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [context, setContext] = useState<StoryContext | "">("");
  const [profession, setProfession] = useState("");
  const [ieltsBefore, setIeltsBefore] = useState("");
  const [ieltsAfter, setIeltsAfter] = useState("");
  const [vstepBefore, setVstepBefore] = useState("");
  const [vstepAfter, setVstepAfter] = useState("");
  const [tags, setTags] = useState<StoryTag[]>([]);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);

  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const previous = document.title;
    document.title = "Chia sẻ câu chuyện — MercyBlade";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setEligibility(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await isUserEligibleToShareStory(user.id);
      if (!cancelled) setEligibility(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const charsLeft = useMemo(() => MAX_VI_CHARS - storyVi.length, [storyVi]);

  function toggleTag(tag: StoryTag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function parseBand(s: string): number | null {
    const n = Number(s.replace(",", "."));
    if (!Number.isFinite(n)) return null;
    if (n < 0 || n > 9.5) return null;
    return Math.round(n * 10) / 10;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) {
      setSubmit({ kind: "error", message: "Vui lòng đăng nhập trước." });
      return;
    }
    if (storyVi.trim().length < 50) {
      setSubmit({
        kind: "error",
        message: "Câu chuyện cần ít nhất 50 ký tự (kể chi tiết hơn nhé).",
      });
      return;
    }
    if (storyVi.length > MAX_VI_CHARS) {
      setSubmit({
        kind: "error",
        message: `Câu chuyện tối đa ${MAX_VI_CHARS} ký tự.`,
      });
      return;
    }
    if (!displayName.trim()) {
      setSubmit({ kind: "error", message: "Vui lòng nhập tên hiển thị." });
      return;
    }

    setSubmit({ kind: "submitting" });

    const payload: Record<string, unknown> = {
      user_id: user.id,
      story_text_vi: storyVi.trim(),
      story_text_en: storyEn.trim() ? storyEn.trim() : null,
      display_name: displayName.trim(),
      context: context || null,
      profession: profession.trim() ? profession.trim() : null,
      ielts_band_before: parseBand(ieltsBefore),
      ielts_band_after: parseBand(ieltsAfter),
      vstep_level_before: vstepBefore.trim() || null,
      vstep_level_after: vstepAfter.trim() || null,
      photo_consent_given: photoConsent,
      tags,
      status: "pending",
    };

    const { data: inserted, error: insertError } = await supabase
      .from("user_stories")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !inserted) {
      setSubmit({
        kind: "error",
        message: insertError?.message ?? "Không gửi được câu chuyện.",
      });
      return;
    }

    // Best-effort photo upload (only when consent + file present).
    if (photoFile && photoConsent) {
      try {
        const result = await uploadStoryPhoto(photoFile);
        if (result.ok) {
          await supabase
            .from("user_stories")
            .update({ display_avatar_url: result.publicUrl })
            .eq("id", inserted.id);
        }
      } catch (err) {
        console.warn("[ShareStory] photo upload failed:", err);
      }
    }

    setSubmit({ kind: "done", storyId: inserted.id });
  }

  // ── Render branches ───────────────────────────────────────────────────

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8 text-center">
        <p className="text-sm text-slate-600">
          Vui lòng đăng nhập để chia sẻ câu chuyện.
        </p>
        <p className="mt-1 text-xs text-slate-500">Please sign in to share your story.</p>
        <Link to="/signin" className="mt-4 inline-block rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white">
          Đăng nhập
        </Link>
      </main>
    );
  }

  if (eligibility === null) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <p className="text-sm text-slate-500">Đang kiểm tra điều kiện…</p>
      </main>
    );
  }

  if (!eligibility.eligible) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8" data-testid="ineligible-panel">
        <h1 className="text-xl font-bold text-slate-900">
          Chia sẻ câu chuyện của bạn
        </h1>
        <p className="mt-1 text-xs text-slate-500">Share your story</p>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Bạn chưa đủ điều kiện để chia sẻ ngay.</p>
          <p className="mt-2" data-testid="reason-vi">{eligibility.reasonVi}</p>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          Hãy tiếp tục luyện tập trên MercyBlade. Khi điểm số của bạn ổn định và
          tiến bộ rõ, chúng tôi sẽ mời bạn chia sẻ.
        </div>
      </main>
    );
  }

  if (submit.kind === "done") {
    return (
      <main className="mx-auto max-w-xl px-4 py-8 text-center">
        <h1 className="text-xl font-bold text-slate-900">
          Cảm ơn bạn đã chia sẻ!
        </h1>
        <p className="mt-1 text-xs text-slate-500">Thank you for sharing.</p>
        <p className="mt-4 text-sm text-slate-700">
          Câu chuyện của bạn đang chờ duyệt. Chúng tôi sẽ liên hệ qua email
          khi câu chuyện được đăng.
        </p>
        <Link
          to="/stories"
          className="mt-6 inline-block rounded-full bg-amber-500 px-5 py-2 text-sm font-bold text-white"
        >
          Xem các câu chuyện khác
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Chia sẻ câu chuyện của bạn
        </h1>
        <p className="text-xs text-slate-500">Share your story</p>
        <p className="mt-2 text-sm text-slate-600">
          Câu chuyện của bạn có thể giúp người Việt khác tin rằng họ cũng làm
          được. Chúng tôi sẽ duyệt trước khi đăng công khai.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Story text VI */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Câu chuyện của bạn (tiếng Việt)
            <span className="block text-xs font-normal text-slate-500">
              Your story (Vietnamese) — required
            </span>
          </label>
          <textarea
            value={storyVi}
            onChange={(e) => setStoryVi(e.target.value)}
            rows={8}
            maxLength={MAX_VI_CHARS}
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Trước khi dùng MercyBlade tôi…"
          />
          <p className="mt-1 text-xs text-slate-500">
            Còn {charsLeft} / {MAX_VI_CHARS} ký tự
          </p>
        </div>

        {/* Story text EN */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            English version (optional)
            <span className="block text-xs font-normal text-slate-500">
              Bản tiếng Anh (tuỳ chọn)
            </span>
          </label>
          <textarea
            value={storyEn}
            onChange={(e) => setStoryEn(e.target.value)}
            rows={5}
            maxLength={MAX_VI_CHARS}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Before MercyBlade I…"
          />
        </div>

        {/* Display name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Tên hiển thị
            <span className="block text-xs font-normal text-slate-500">Display name</span>
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Linh N. — Hà Nội"
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Bối cảnh câu chuyện
            <span className="block text-xs font-normal text-slate-500">Story context (optional)</span>
          </label>
          <select
            value={context}
            onChange={(e) => setContext(e.target.value as StoryContext | "")}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">— chọn —</option>
            {(["before_mercyblade", "progress_milestone", "specific_win"] as StoryContext[]).map(
              (k) => (
                <option key={k} value={k}>
                  {STORY_CONTEXT_LABELS_VI[k]} · {STORY_CONTEXT_LABELS_EN[k]}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Profession */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Nghề nghiệp <span className="text-xs font-normal text-slate-500">(tuỳ chọn)</span>
          </label>
          <input
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Nail technician, kỹ sư phần mềm, sinh viên…"
          />
        </div>

        {/* IELTS before/after */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800">IELTS trước</label>
            <input
              value={ieltsBefore}
              onChange={(e) => setIeltsBefore(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="5.5"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800">IELTS sau</label>
            <input
              value={ieltsAfter}
              onChange={(e) => setIeltsAfter(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="7.0"
              inputMode="decimal"
            />
          </div>
        </div>

        {/* VSTEP before/after */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-800">VSTEP trước</label>
            <input
              value={vstepBefore}
              onChange={(e) => setVstepBefore(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="B1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800">VSTEP sau</label>
            <input
              value={vstepAfter}
              onChange={(e) => setVstepAfter(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="C1"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Thẻ <span className="text-xs font-normal text-slate-500">Tags</span>
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {STORY_TAGS.map((tag) => {
              const on = tags.includes(tag);
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

        {/* Photo + consent */}
        <fieldset className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <legend className="px-1 text-sm font-semibold text-slate-800">Ảnh đại diện (tuỳ chọn)</legend>
          <p className="text-xs text-slate-500">
            Chỉ tải ảnh nếu bạn đồng ý hiển thị công khai.
          </p>
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={photoConsent}
              onChange={(e) => setPhotoConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              Tôi đồng ý hiển thị ảnh kèm câu chuyện công khai. /
              <span className="text-slate-500"> I consent to displaying my photo publicly.</span>
            </span>
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={!photoConsent}
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="mt-3 block w-full text-xs disabled:opacity-50"
          />
        </fieldset>

        {/* Submit */}
        {submit.kind === "error" && (
          <p className="text-sm text-red-700" role="alert">
            {submit.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submit.kind === "submitting"}
          className="w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {submit.kind === "submitting" ? "Đang gửi…" : "Gửi câu chuyện"}
        </button>
        <p className="text-center text-xs text-slate-500">
          Câu chuyện sẽ được đội ngũ MercyBlade duyệt trước khi đăng công khai.
        </p>
      </form>
    </main>
  );
}
