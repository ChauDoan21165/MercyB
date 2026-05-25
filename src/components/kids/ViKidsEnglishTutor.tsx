// src/components/kids/ViKidsEnglishTutor.tsx
//
// Mercy Kids — picture flashcard flow.
//
// Single user flow per CLAUDE.md non-negotiable #2 ("Kids mode is sacred.
// Offline-first, no login friction, no monetization CTAs, age-appropriate."):
//
//   1. Header in Vietnamese + English.
//   2. Page selector (pages 11–34, loaded from src/components/mercy-guide/kids/
//      via loadKidsItemsForPages).
//   3. Photo grid for the current page.
//   4. Tap a photo → preview card with the English word + Speak button.
//   5. Tap Speak → play the pre-recorded /images/mercy-kids-page-<N>/<key>.mp3
//      if it exists, otherwise fall back to Web Speech API (kid-friendly rate).
//   6. Optional Next-photo button advances within the current page.
//
// Hard safety rules (audited line-by-line — every absence is intentional):
//   - No microphone. No navigator.mediaDevices.getUserMedia call anywhere.
//   - No MediaRecorder. No `new MediaRecorder(...)` anywhere.
//   - No recording, no transcript persistence, no PII.
//   - No cloud upload. No fetch to azure-*, no scoreCloud.
//   - No `useBrowserStt`, no STT imports.
//   - No TeacherMercyLearningShell mode tabs.
//   - No MercySpeakTab (mounting it on a kids surface was the P0 violation
//     of PR #1146; the adult MercySpeakTab pipeline can record + upload audio
//     regardless of an `isKidsMode` prop).
//   - No MercyTeacherTab adult-mode disclosure paths.
//   - No TutorMemoryCard / learningMemory writes.
//   - No "AI Tutor" framing.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

import { loadKidsItemsForPages } from "@/components/mercy-guide/kidsDataLoader";

// ────────────────────────────────────────────────────────────────────────
// Types and constants
// ────────────────────────────────────────────────────────────────────────

type KidPhoto = {
  key: string;
  label: string;
  image: string;
  alt?: string;
};

// Pages 11–34: 24 pages, ~1,200+ flashcards across the kidsDataLoader's
// loadKidsItemsForPages contract (KID_PAGE_<N>_ITEMS shape).
// Pages 4–9 export a different shape (KID_PAGE4_LESSONS with imageSrc, no
// flat ITEMS array). Adding them is a follow-up — out of scope for this
// initial flashcard ship.
const AVAILABLE_PAGES: number[] = Array.from({ length: 34 - 11 + 1 }, (_, i) => 11 + i);

const DEFAULT_PAGE = AVAILABLE_PAGES[0];

// ────────────────────────────────────────────────────────────────────────
// Audio playback — pre-recorded mp3 with Web Speech fallback.
// Strictly PLAYBACK ONLY. Never instantiates MediaRecorder, never calls
// getUserMedia, never uploads anywhere.
// ────────────────────────────────────────────────────────────────────────

function audioUrlForPhoto(image: string): string {
  return image.replace(/\.png$/i, ".mp3");
}

function speakViaWebSpeech(label: string): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  try {
    const utter = new SpeechSynthesisUtterance(label);
    utter.lang = "en-US";
    // Slower than default so kids can hear each phoneme.
    utter.rate = 0.85;
    // Stop any in-flight utterance first.
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

// ────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────

export default function ViKidsEnglishTutor() {
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);
  const [photos, setPhotos] = useState<KidPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<KidPhoto | null>(null);
  const [audioStatus, setAudioStatus] = useState<"idle" | "playing" | "fallback" | "unavailable">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelected(null);
    setAudioStatus("idle");
    loadKidsItemsForPages([currentPage])
      .then((map) => {
        if (cancelled) return;
        const items = map.get(currentPage) ?? [];
        // Normalise into the minimum KidPhoto shape we render.
        const normalised: KidPhoto[] = items
          .map((item) => ({
            key: item.key,
            label: item.label,
            image: (item as { image?: string }).image ?? "",
            alt: (item as { alt?: string }).alt,
          }))
          .filter((p) => p.image.length > 0);
        setPhotos(normalised);
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const stopActiveAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }, []);

  // Stop any in-flight audio when component unmounts or the page changes.
  useEffect(() => {
    return () => {
      stopActiveAudio();
    };
  }, [stopActiveAudio]);

  const handlePlay = useCallback(
    (photo: KidPhoto) => {
      stopActiveAudio();
      setAudioStatus("playing");

      const mp3Url = audioUrlForPhoto(photo.image);
      const audio = new Audio(mp3Url);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          setAudioStatus("idle");
        }
      });

      audio.play().catch(() => {
        // mp3 missing or browser blocked — fall back to Web Speech.
        audioRef.current = null;
        const ok = speakViaWebSpeech(photo.label);
        setAudioStatus(ok ? "fallback" : "unavailable");
      });
    },
    [stopActiveAudio],
  );

  const handlePhotoClick = useCallback(
    (photo: KidPhoto) => {
      stopActiveAudio();
      setSelected(photo);
      setAudioStatus("idle");
    },
    [stopActiveAudio],
  );

  const handleNextPhoto = useCallback(() => {
    if (!selected) return;
    const idx = photos.findIndex((p) => p.key === selected.key);
    if (idx >= 0 && idx < photos.length - 1) {
      handlePhotoClick(photos[idx + 1]);
    }
  }, [handlePhotoClick, photos, selected]);

  const currentPageIndex = AVAILABLE_PAGES.indexOf(currentPage);
  const canGoPrev = currentPageIndex > 0;
  const canGoNext = currentPageIndex < AVAILABLE_PAGES.length - 1;

  const goPrevPage = useCallback(() => {
    if (canGoPrev) setCurrentPage(AVAILABLE_PAGES[currentPageIndex - 1]);
  }, [canGoPrev, currentPageIndex]);

  const goNextPage = useCallback(() => {
    if (canGoNext) setCurrentPage(AVAILABLE_PAGES[currentPageIndex + 1]);
  }, [canGoNext, currentPageIndex]);

  const audioStatusLabel = useMemo(() => {
    switch (audioStatus) {
      case "playing":
        return "Mercy đang đọc…";
      case "fallback":
        return "Mercy đọc (giọng máy)";
      case "unavailable":
        return "Không phát được âm thanh trên thiết bị này.";
      default:
        return "";
    }
  }, [audioStatus]);

  return (
    <main
      data-testid="vi-kids-english-tutor"
      className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-[960px] px-3 py-5 sm:px-6"
    >
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">Mercy Kids</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Chọn hình rồi nói với Mercy.
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Pick a picture and say the word with Mercy.
        </p>
      </header>

      <nav
        aria-label="Page selector"
        className="mb-4 flex flex-wrap items-center justify-center gap-2"
      >
        <button
          type="button"
          onClick={goPrevPage}
          disabled={!canGoPrev}
          aria-label="Trang trước"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <span className="text-xs uppercase text-slate-500">Trang</span>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-indigo-400"
            aria-label="Chọn trang ảnh"
          >
            {AVAILABLE_PAGES.map((p) => (
              <option key={p} value={p}>
                Page {p}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={goNextPage}
          disabled={!canGoNext}
          aria-label="Trang sau"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </nav>

      {selected && (
        <section
          data-testid="vi-kids-selected-card"
          className="mb-5 rounded-3xl border border-indigo-100 bg-white p-5 shadow-md sm:p-6"
        >
          <div className="grid items-center gap-5 sm:grid-cols-[160px_1fr]">
            <img
              src={selected.image}
              alt={selected.alt || selected.label}
              className="mx-auto h-40 w-40 rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-wide text-indigo-500">
                Từ tiếng Anh
              </p>
              <p className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
                {selected.label}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <button
                  type="button"
                  onClick={() => handlePlay(selected)}
                  className="flex min-h-[48px] items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-black text-white shadow-sm transition hover:bg-indigo-700"
                  aria-label={`Mercy đọc ${selected.label}`}
                >
                  <Volume2 className="h-5 w-5" aria-hidden />
                  <span>Mercy đọc · Speak</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="flex min-h-[48px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  aria-label="Hình kế tiếp"
                >
                  <span>Hình sau</span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {audioStatusLabel && (
                <p
                  data-testid="vi-kids-audio-status"
                  className={`mt-3 text-xs font-semibold ${audioStatus === "unavailable" ? "text-amber-700" : "text-slate-500"}`}
                >
                  {audioStatusLabel}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
        {loading ? (
          <div className="grid place-items-center py-16 text-sm font-semibold text-slate-400">
            Đang tải hình…
          </div>
        ) : photos.length === 0 ? (
          <div className="grid place-items-center py-16 text-sm font-semibold text-slate-400">
            Không tìm thấy hình cho trang này.
          </div>
        ) : (
          <div
            data-testid="vi-kids-photo-grid"
            className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
          >
            {photos.map((photo) => {
              const isSelected = selected?.key === photo.key;
              return (
                <button
                  key={photo.key}
                  type="button"
                  onClick={() => handlePhotoClick(photo)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 transition ${
                    isSelected
                      ? "border-indigo-500 shadow-md"
                      : "border-slate-100 hover:border-indigo-200 hover:shadow-sm"
                  }`}
                  aria-label={`Chọn ${photo.label}`}
                  aria-pressed={isSelected}
                >
                  <img
                    src={photo.image}
                    alt={photo.alt || photo.label}
                    className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
                    loading="lazy"
                  />
                  <span className="text-[11px] font-bold text-slate-700">{photo.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mt-6 text-center text-[11px] text-slate-400">
        Mercy Kids · Không thu âm, không tải lên đám mây · Picture + Speak only.
      </footer>
    </main>
  );
}
