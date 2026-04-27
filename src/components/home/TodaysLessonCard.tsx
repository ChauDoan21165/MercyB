/**
 * Home page anchor: "Today's 5-minute lesson".
 *
 * Renders one curated room as a finishable daily task. Sits at the top
 * of the Home grid so returning users no longer bounce on "what should
 * I do now?". On tap → /room/:roomId. Vietnamese-first framing: small,
 * daily, finishable.
 *
 * Anonymous users get a static starter lesson plus a soft prompt to
 * sign in for personalized rotation. Streak fueling is handled by the
 * existing server-side trigger when the user enters the linked room;
 * this component only marks "started today" in localStorage so we can
 * show the calmed/checkmark state on subsequent visits.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Clock3 } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import {
  getDailyLesson,
  isDailyLessonCompletedToday,
  markDailyLessonStarted,
} from "@/lib/lessons/dailyLesson";

type Props = {
  /** When true, render the phone-tight padding/sizes. */
  isPhone?: boolean;
};

export default function TodaysLessonCard({ isPhone = false }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const lesson = getDailyLesson(userId);
  const [completed, setCompleted] = useState<boolean>(() =>
    isDailyLessonCompletedToday(userId),
  );

  useEffect(() => {
    setCompleted(isDailyLessonCompletedToday(userId));
  }, [userId]);

  const handleStart = () => {
    markDailyLessonStarted(userId);
    setCompleted(true);
    navigate(`/room/${lesson.roomId}`);
  };

  const headerEn = "Today's lesson";
  const headerVi = "Bài học hôm nay";
  const ctaEn = completed ? "Practice again" : "Start";
  const ctaVi = completed ? "Luyện lại" : "Bắt đầu";

  return (
    <button
      type="button"
      onClick={handleStart}
      aria-label={`${headerEn}: ${lesson.title_en}`}
      data-testid="todays-lesson-card"
      style={{
        width: "100%",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 24,
          padding: isPhone ? "20px 18px 22px" : "26px 26px 28px",
          background: completed
            ? "linear-gradient(150deg, rgba(220,252,231,0.96) 0%, rgba(236,253,245,0.94) 100%)"
            : "linear-gradient(150deg, #FFE9C7 0%, #FED7AA 28%, #FDBA74 62%, #FB923C 100%)",
          border: completed
            ? "1px solid rgba(16,185,129,0.32)"
            : "1px solid rgba(234,88,12,0.32)",
          boxShadow: completed
            ? "0 18px 38px rgba(16,185,129,0.16)"
            : "0 18px 38px rgba(234,88,12,0.18)",
          color: completed ? "rgba(6,78,59,0.96)" : "rgba(67,20,7,0.96)",
          opacity: completed ? 0.92 : 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 10px",
            borderRadius: 9999,
            background: completed
              ? "rgba(16,185,129,0.18)"
              : "rgba(255,255,255,0.55)",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.2,
          }}
        >
          {completed ? (
            <CheckCircle2 size={14} aria-hidden />
          ) : (
            <span aria-hidden>🔥</span>
          )}
          <span>{headerVi} · {headerEn}</span>
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: isPhone ? 22 : 28,
            fontWeight: 950,
            lineHeight: 1.15,
            letterSpacing: -0.4,
          }}
        >
          {lesson.title_vi}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: isPhone ? 13 : 14,
            fontWeight: 700,
            opacity: 0.7,
            lineHeight: 1.35,
          }}
        >
          {lesson.title_en}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 800,
            opacity: 0.78,
          }}
        >
          <Clock3 size={14} aria-hidden />
          <span>{lesson.duration_minutes} phút · {lesson.duration_minutes} min</span>
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: isPhone ? 14 : 15,
            fontWeight: 700,
            lineHeight: 1.5,
            maxWidth: 540,
          }}
        >
          {lesson.description_vi}
        </div>
        <div
          style={{
            marginTop: 2,
            fontSize: isPhone ? 12 : 13,
            fontWeight: 600,
            opacity: 0.65,
            lineHeight: 1.4,
            maxWidth: 540,
          }}
        >
          {lesson.description_en}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 9999,
            background: completed
              ? "rgba(16,185,129,0.20)"
              : "rgba(67,20,7,0.92)",
            color: completed ? "rgba(6,78,59,0.96)" : "#FFF7ED",
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: 0.2,
          }}
        >
          <span>{ctaVi} · {ctaEn}</span>
          <ChevronRight size={16} aria-hidden />
        </div>

        {!userId ? (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 700,
              opacity: 0.7,
              lineHeight: 1.4,
            }}
          >
            Đăng nhập để theo dõi tiến độ · Sign in to track progress
          </div>
        ) : completed ? (
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              fontWeight: 700,
              opacity: 0.78,
              lineHeight: 1.4,
            }}
            data-testid="todays-lesson-completed-note"
          >
            🔥 Hôm nay bạn đã học rồi! · Studied today.
          </div>
        ) : null}
      </div>
    </button>
  );
}
