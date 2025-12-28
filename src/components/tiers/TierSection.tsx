// src/components/tiers/TierSection.tsx
// MB-BLUE-96.9 — 2025-12-28 (+0700)
//
// FIX:
// - REMOVE legacy <AudioPlayer> usage (it renders non-motif audio UI)
// - USE TalkingFacePlayButton ONLY (Mercy Blade core motif)
// - Accept audio as either "file.mp3" or "/audio/file.mp3" or "audio/file.mp3"

import React from "react";

// ✅ AUTHORITATIVE UI MOTIF
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

interface TierSectionProps {
  id: string;
  backgroundColor: string;
  titleEn: string;
  titleVi: string;
  contentEn: string;
  contentVi: string;
  audio?: string;
  price?: {
    usd_per_month?: number;
    monthly?: number;
    rooms_per_month?: number | string;
    rooms_total?: number;
    strategic_domains?: number;
    entries_per_room?: number;
    words_per_entry?: number;
    personalized_room?: boolean;
    career_coaching_mode?: boolean;
    writing_feedback?: boolean;
    custom_topics_per_month?: number;
    note?: {
      en: string;
      vi: string;
    };
  };
}

function normalizeAudioSrc(input: string): string {
  const s = String(input || "").trim();
  if (!s) return "";
  if (s.startsWith("http")) return s;

  // remove leading slashes
  const p = s.replace(/^\/+/, "");
  // already "audio/..."
  if (p.startsWith("audio/")) return `/${p}`;
  // already "/audio/..."
  if (s.startsWith("/audio/")) return s;

  // default: treat as filename
  return `/audio/${p}`;
}

function audioLabelFromSrc(src: string): string {
  const leaf = (src || "").split("/").pop() || src;
  return leaf;
}

export const TierSection = ({
  id,
  backgroundColor,
  titleEn,
  titleVi,
  contentEn,
  contentVi,
  audio,
  price,
}: TierSectionProps) => {
  const isDarkBackground = backgroundColor.toLowerCase() === "#1e293b";
  const textColorClass = isDarkBackground ? "text-slate-50" : "text-gray-800";
  const textColorSecondaryClass = isDarkBackground
    ? "text-slate-100"
    : "text-gray-700";
  const borderColorClass = isDarkBackground
    ? "border-slate-500/40"
    : "border-gray-300/50";

  const audioSrc = audio ? normalizeAudioSrc(audio) : "";
  const audioLabel = audioSrc ? audioLabelFromSrc(audioSrc) : "";

  return (
    <section
      id={id}
      className="min-h-screen py-16 px-6 flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="max-w-[640px] w-full space-y-8">
        {/* English Section */}
        <div className="space-y-4">
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              isDarkBackground
                ? "text-slate-50"
                : "bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent"
            }`}
          >
            {titleEn}
          </h2>

          {price && (
            <div
              className={`${
                isDarkBackground
                  ? "bg-slate-700/50 border-slate-500/50"
                  : "bg-card/80 border-border"
              } backdrop-blur-sm rounded-xl p-6 shadow-lg border-2`}
            >
              <div className="text-center space-y-2">
                <div
                  className={`text-4xl font-bold ${
                    isDarkBackground ? "text-slate-50" : "text-gray-900"
                  }`}
                >
                  ${price.usd_per_month || price.monthly || 0}
                  <span
                    className={`text-lg font-normal ${
                      isDarkBackground ? "text-slate-200" : "text-gray-600"
                    }`}
                  >
                    /month
                  </span>
                </div>

                {price.rooms_per_month && (
                  <div
                    className={`text-sm ${
                      isDarkBackground ? "text-slate-200" : "text-gray-600"
                    }`}
                  >
                    {price.rooms_per_month} rooms per month
                  </div>
                )}

                {price.rooms_total && (
                  <div
                    className={`text-sm ${
                      isDarkBackground ? "text-slate-200" : "text-gray-600"
                    } space-y-1`}
                  >
                    <div>{price.rooms_total} Strategic Rooms</div>
                    {price.strategic_domains && (
                      <div>{price.strategic_domains} Strategic Domains</div>
                    )}
                    {price.entries_per_room && (
                      <div>{price.entries_per_room} Entries per Room</div>
                    )}
                  </div>
                )}

                {price.note && (
                  <div
                    className={`text-xs italic ${
                      isDarkBackground ? "text-slate-400" : "text-gray-500"
                    } mt-2`}
                  >
                    {price.note.en}
                  </div>
                )}

                {price.personalized_room && (
                  <div
                    className={`text-sm font-semibold ${
                      isDarkBackground ? "text-sky-300" : "text-blue-600"
                    }`}
                  >
                    + Personalized Room
                  </div>
                )}
                {price.career_coaching_mode && (
                  <div
                    className={`text-sm font-semibold ${
                      isDarkBackground ? "text-purple-300" : "text-purple-600"
                    }`}
                  >
                    + Career Coaching Mode
                  </div>
                )}
                {price.writing_feedback && (
                  <div
                    className={`text-sm font-semibold ${
                      isDarkBackground ? "text-emerald-300" : "text-emerald-600"
                    }`}
                  >
                    + AI Writing Feedback
                  </div>
                )}
                {price.custom_topics_per_month && price.custom_topics_per_month > 0 && (
                  <div
                    className={`text-sm font-semibold ${
                      isDarkBackground ? "text-amber-300" : "text-amber-600"
                    }`}
                  >
                    + {price.custom_topics_per_month} Custom Topic/Month
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className={`${textColorClass} leading-relaxed whitespace-pre-line text-[15px]`}>
              {contentEn}
            </p>
          </div>

          {/* ✅ Talking Face Audio (ONLY) */}
          {audioSrc ? (
            <div className="pt-2 w-full max-w-none">
              <TalkingFacePlayButton
                src={audioSrc}
                label={audioLabel}
                className="w-full max-w-none"
                fullWidthBar
              />
            </div>
          ) : null}
        </div>

        {/* Vietnamese Section */}
        <div className={`space-y-4 pt-6 border-t ${borderColorClass}`}>
          <h3
            className={`text-2xl md:text-3xl font-semibold ${
              isDarkBackground
                ? "text-slate-50"
                : "bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent"
            }`}
          >
            {titleVi}
          </h3>
          <div className="prose prose-lg max-w-none">
            <p className={`${textColorSecondaryClass} leading-relaxed whitespace-pre-line text-[15px]`}>
              {contentVi}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
