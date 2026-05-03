import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  useLanguageProgress,
  EUROPEAN_LANGUAGES,
  ASIAN_LANGUAGES,
  TOTAL_LESSONS_PER_LANGUAGE,
  type LearningLanguage,
} from "@/store/languageProgress";

// ── helpers ─────────────────────────────────────────────────────────────────

function barColor(id: LearningLanguage): string {
  const map: Record<LearningLanguage, string> = {
    french: "#3B82F6",
    german: "#EF4444",
    japanese: "#F59E0B",
    chinese: "#DC2626",
    korean: "#8B5CF6",
  };
  return map[id];
}

function categoryColor(category: "european" | "asian"): string {
  return category === "european" ? "#3B82F6" : "#DC2626";
}

function categoryLabelVi(category: "european" | "asian"): string {
  return category === "european" ? "Châu Âu" : "Châu Á";
}

// ── component ───────────────────────────────────────────────────────────────

export default function LanguageSwitcher() {
  const nav = useNavigate();
  const { selectedLanguage, selectLanguage, getCompletedCount, getProgressPercent } =
    useLanguageProgress();

  const handleCardClick = (id: LearningLanguage) => {
    selectLanguage(id);
  };

  const handleStartLearning = (e: React.MouseEvent, id: LearningLanguage) => {
    e.stopPropagation();
    selectLanguage(id);
    // Navigate to rooms — same entry point as the Library card
    nav("/rooms");
  };

  const renderCategory = (label: string, labelVi: string, languages: typeof EUROPEAN_LANGUAGES) => {
    const cat = languages[0].category;
    return (
      <section aria-label={label} style={{ marginBottom: 10 }}>
        {/* Category header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 4,
              height: 18,
              borderRadius: 2,
              background: categoryColor(cat),
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 0.3,
              color: categoryColor(cat),
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(0,0,0,0.38)",
            }}
          >
            {labelVi}
          </span>
        </div>

        {/* Language cards — 2-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {languages.map((lang) => {
            const completed = getCompletedCount(lang.id);
            const pct = getProgressPercent(lang.id);
            const isSelected = selectedLanguage === lang.id;

            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleCardClick(lang.id)}
                aria-label={`${lang.name} — ${lang.nameVi} — ${completed}/${TOTAL_LESSONS_PER_LANGUAGE} lessons`}
                aria-pressed={isSelected}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  padding: "12px 14px",
                  borderRadius: 16,
                  border: isSelected
                    ? `2px solid ${barColor(lang.id)}`
                    : "1px solid rgba(0,0,0,0.08)",
                  background: isSelected
                    ? `${barColor(lang.id)}08`
                    : "#FFFFFF",
                  boxShadow: isSelected
                    ? `0 6px 18px ${barColor(lang.id)}18`
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border 0.15s, background 0.15s, box-shadow 0.15s",
                }}
              >
                {/* Flag + name row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{lang.flag}</span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: "rgba(0,0,0,0.88)",
                        letterSpacing: -0.2,
                        lineHeight: 1.2,
                      }}
                    >
                      {lang.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.42)",
                        lineHeight: 1.2,
                      }}
                    >
                      {lang.nameVi}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "rgba(0,0,0,0.42)",
                        letterSpacing: 0.3,
                        textTransform: "uppercase",
                      }}
                    >
                      Lessons
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 900,
                        color: barColor(lang.id),
                      }}
                    >
                      {completed}/{TOTAL_LESSONS_PER_LANGUAGE}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      borderRadius: 3,
                      background: "rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 3,
                        background: barColor(lang.id),
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Start learning CTA — compact, shown on selection */}
                {isSelected && (
                  <div
                    onClick={(e) => handleStartLearning(e, lang.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleStartLearning(e as unknown as React.MouseEvent, lang.id);
                      }
                    }}
                    aria-label={`Start learning ${lang.name}`}
                    style={{
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      padding: "6px 10px",
                      borderRadius: 10,
                      background: barColor(lang.id),
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.2,
                      cursor: "pointer",
                    }}
                  >
                    Start learning
                    <ChevronRight size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div
      aria-label="Language switcher"
      style={{
        borderRadius: 20,
        padding: "16px 14px 8px",
        background:
          "linear-gradient(150deg, rgba(248,250,252,0.96) 0%, rgba(250,251,253,0.94) 100%)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 900,
            color: "rgba(0,0,0,0.88)",
            letterSpacing: -0.3,
          }}
        >
          Learning languages
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "rgba(0,0,0,0.40)",
          }}
        >
          Ngôn ngữ đang học
        </span>
      </div>

      {renderCategory("European", categoryLabelVi("european"), EUROPEAN_LANGUAGES)}
      {renderCategory("Asian", categoryLabelVi("asian"), ASIAN_LANGUAGES)}
    </div>
  );
}
