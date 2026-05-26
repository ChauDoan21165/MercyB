// src/components/home/ListeningSuggestionCard.tsx
//
// Home widget: "Continue: Restaurant" — points the signed-in user at
// the next listening clip in the category they've been engaging with
// most recently. Hidden if:
//   - the user is not signed in
//   - they have no listening progress yet
//   - the category they've been working in is 100% complete
//
// The card owns its own data fetch so Home doesn't auto-load
// listening data on render.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
import {
  LISTENING_BY_CATEGORY,
  suggestNextInCategory,
  type ListeningCategory,
  type ListeningClip,
} from "@/data/listening/clips";
import { getUserListeningProgress } from "@/services/listeningProgress";

const CATEGORY_VI: Record<ListeningCategory, string> = {
  restaurant:         "Nhà hàng",
  doctor:             "Bác sĩ",
  "customer-service": "Chăm sóc khách hàng",
  "job-interview":    "Phỏng vấn",
  casual:             "Đời thường",
  shopping:           "Mua sắm",
  transportation:     "Di chuyển",
};

interface SuggestionState {
  category: ListeningCategory;
  next: ListeningClip;
  completedInCategory: number;
  totalInCategory: number;
}

const cardStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 16,
  padding: "14px 16px",
  background: "white",
  boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: 12,
  cursor: "pointer",
  textAlign: "left",
};

export default function ListeningSuggestionCard(): React.ReactElement | null {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<SuggestionState | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    let alive = true;
    void getUserListeningProgress().then((rows) => {
      if (!alive) return;
      if (rows.length === 0) {
        setHidden(true);
        return;
      }
      // Pick the category the user touched most recently.
      const recentCategory = (() => {
        const byClipId = new Map<string, ListeningCategory>();
        for (const cat of Object.keys(LISTENING_BY_CATEGORY) as ListeningCategory[]) {
          for (const clip of LISTENING_BY_CATEGORY[cat]) {
            byClipId.set(clip.id, clip.category);
          }
        }
        for (const r of rows) {
          const cat = byClipId.get(r.clip_id);
          if (cat) return cat;
        }
        return null;
      })();
      if (!recentCategory) {
        setHidden(true);
        return;
      }
      const completed = new Set(rows.map((r) => r.clip_id));
      const next = suggestNextInCategory(recentCategory, completed);
      if (!next) {
        // Category fully complete — hide rather than nag.
        setHidden(true);
        return;
      }
      const total = LISTENING_BY_CATEGORY[recentCategory].length;
      const completedInCategory = LISTENING_BY_CATEGORY[recentCategory].filter((c) =>
        completed.has(c.id),
      ).length;
      setState({ category: recentCategory, next, completedInCategory, totalInCategory: total });
    });
    return () => {
      alive = false;
    };
  }, [authLoading, user]);

  if (!user || hidden || !state) return null;

  const ratio = state.completedInCategory / state.totalInCategory;
  const pct = Math.round(ratio * 100);

  return (
    <button
      type="button"
      onClick={() => navigate(`/listening/${state.next.id}`)}
      aria-label={`Continue: ${state.category}`}
      data-testid="home-listening-suggestion"
      style={cardStyle}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
            color: "rgba(0,0,0,0.55)",
          }}
        >
          Tiếp tục · Continue
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            marginTop: 4,
            color: "#1f2937",
          }}
        >
          {CATEGORY_VI[state.category]}: {state.next.title_vi}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 6,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 6,
              borderRadius: 9999,
              background: "#e2e8f0",
              overflow: "hidden",
              maxWidth: 180,
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "#1e3a8a",
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>
            {state.completedInCategory}/{state.totalInCategory}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a", whiteSpace: "nowrap" }}>
        Nghe · Listen →
      </div>
    </button>
  );
}
