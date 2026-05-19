// src/pages/placement/v2/PlacementV2Page.tsx
//
// Placement Test v2 — the re-surfaced experience (Phase 2, PR 11, the
// FINAL slice of the 11-PR series).
//
// One self-contained page that drives the whole adaptive session via
// `usePlacementSession` (PR 11 hook) → PR 10 flow → PR 9 edge fn → the
// PRs 1-8 engine. The v2 session is a single SERVER-DRIVEN loop (self-
// rating → item loop → result), NOT a fixed wizard, so it collapses v1's
// 4-page flow into one page (reconstruction flag F1 — the wireframes doc
// is ephemeral; anchored to the EXISTING /placement route + #658's flag
// idiom + the merged contract; v1 page files are left byte-for-byte
// intact, #658 "HIDE not delete").
//
// Vietnamese-first + mobile-first (the five non-negotiables): every
// learner-facing line leads in Vietnamese; layout caps at a phone width.
// The answer key never reaches here — `PublicItem` carries no
// `correctOptionId`; the EDGE FN grades (PR 11 core.ts fix). The client
// only reports its `selectedOptionId` + timing + the L1-crutch flag.

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePlacementSession } from "@/hooks/usePlacementSession";
import { useAudioUrl } from "@/hooks/useAudioUrl";
import { CEFR_TAGLINE } from "@/lib/placement/cefrToRoom";
import type {
  ClientResponse,
  PublicItem,
  SelfRating,
} from "@/lib/placement/v2/types";

// cefrToRoom.ts:16-17 — kids do NOT take the adaptive test; the
// "who-for" kid branch routes straight to this room (the v1 destination,
// anchored not invented). Reconstruction flag F3.
const KIDS_ROOM_ID = "alphabet_adventure_kids_l1";

const PAGE_MAX = 520;

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "32px 16px 64px",
  display: "flex",
  justifyContent: "center",
};
const col: React.CSSProperties = {
  width: "100%",
  maxWidth: PAGE_MAX,
  display: "flex",
  flexDirection: "column",
  gap: 18,
};
const h1: React.CSSProperties = {
  fontSize: "clamp(22px, 5.5vw, 30px)",
  fontWeight: 900,
  lineHeight: 1.2,
  color: "rgba(10,10,10,0.94)",
  margin: 0,
};
const subEn: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: "#94a3b8",
  margin: 0,
};
const primaryBtn: React.CSSProperties = {
  padding: "14px 18px",
  borderRadius: 14,
  border: "none",
  background: "#0a0a0a",
  color: "#fff",
  fontSize: 16,
  fontWeight: 800,
  cursor: "pointer",
};
const choiceBtn = (selected: boolean): React.CSSProperties => ({
  padding: "14px 16px",
  borderRadius: 12,
  border: selected ? "2px solid #0a0a0a" : "1px solid rgba(10,10,10,0.16)",
  background: selected ? "rgba(10,10,10,0.04)" : "#fff",
  color: "rgba(10,10,10,0.92)",
  fontSize: 15,
  fontWeight: 600,
  textAlign: "left",
  cursor: "pointer",
});
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  padding: 0,
};

const SELF_RATINGS: Array<{ id: SelfRating; vi: string; en: string }> = [
  { id: "beginner", vi: "Mới bắt đầu", en: "Beginner" },
  { id: "intermediate", vi: "Trung cấp", en: "Intermediate" },
  { id: "advanced", vi: "Nâng cao", en: "Advanced" },
  { id: "not_sure", vi: "Không chắc", en: "Not sure" },
];

/** One item card. Owns the per-item answer state + timing; emits a
 *  fully-formed `ClientResponse` (server grades — `correct` is null
 *  here, never self-assessed). */
function ItemCard({
  item,
  busy,
  onAnswer,
}: {
  item: PublicItem;
  busy: boolean;
  onAnswer: (r: ClientResponse) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [viRevealed, setViRevealed] = useState(false);
  const [audioPlays, setAudioPlays] = useState(0);
  const shownAtRef = useRef<number>(Date.now());
  const shownIsoRef = useRef<string>(new Date().toISOString());
  const { url: audioUrl } = useAudioUrl(item.audio ? item.audio.key : null);

  // Reset per item (the same component instance is reused as items swap).
  useEffect(() => {
    setSelected(null);
    setViRevealed(false);
    setAudioPlays(0);
    shownAtRef.current = Date.now();
    shownIsoRef.current = new Date().toISOString();
  }, [item.id]);

  const isMc = Array.isArray(item.options) && item.options.length > 0;
  const replayLimit = item.audio?.replayLimit ?? 0;

  function submit() {
    const now = Date.now();
    onAnswer({
      itemId: item.id,
      correct: null, // server grades from the answer key (PR 11 fix)
      selectedOptionId: selected ?? undefined,
      responseMs: Math.max(0, now - shownAtRef.current),
      timedOut: false,
      l1RevealedUsed: viRevealed,
      audioPlays: item.audio ? audioPlays : undefined,
      shownAt: shownIsoRef.current,
      answeredAt: new Date(now).toISOString(),
    });
  }

  return (
    <div style={col}>
      <p style={{ ...h1, fontSize: "clamp(18px,4.5vw,22px)" }}>
        {item.prompt.vi}
      </p>
      {item.prompt.en !== item.prompt.vi && (
        <p style={subEn}>{item.prompt.en}</p>
      )}

      {item.passage && (
        <div
          style={{
            background: "rgba(10,10,10,0.03)",
            borderRadius: 12,
            padding: 14,
            fontSize: 15,
            lineHeight: 1.55,
          }}
        >
          <div>{item.passage.en}</div>
          {viRevealed ? (
            <div style={{ marginTop: 10, color: "#64748b" }}>
              {item.passage.vi}
            </div>
          ) : (
            item.passage.vi !== item.passage.en && (
              <button
                type="button"
                style={{ ...linkBtn, marginTop: 10 }}
                onClick={() => setViRevealed(true)}
              >
                Hiện nghĩa tiếng Việt
              </button>
            )
          )}
        </div>
      )}

      {item.audio && audioUrl && (
        <button
          type="button"
          style={{ ...choiceBtn(false), opacity: audioPlays >= replayLimit && replayLimit > 0 ? 0.5 : 1 }}
          disabled={replayLimit > 0 && audioPlays >= replayLimit}
          onClick={() => {
            const a = new Audio(audioUrl);
            a.play().catch(() => undefined);
            setAudioPlays((n) => n + 1);
          }}
        >
          🔊 Nghe đoạn âm thanh
          {replayLimit > 0 ? ` (còn ${Math.max(0, replayLimit - audioPlays)} lần)` : ""}
        </button>
      )}

      {isMc &&
        item.options!.map((o) => (
          <button
            key={o.id}
            type="button"
            style={choiceBtn(selected === o.id)}
            onClick={() => setSelected(o.id)}
          >
            {o.en}
          </button>
        ))}

      <button
        type="button"
        style={{
          ...primaryBtn,
          opacity: busy || (isMc && !selected) ? 0.5 : 1,
        }}
        disabled={busy || (isMc && !selected)}
        onClick={submit}
      >
        {busy ? "Đang chấm…" : "Trả lời"}
      </button>
    </div>
  );
}

export default function PlacementV2Page() {
  const nav = useNavigate();
  const { state, begin, rate, submit, abandon } = usePlacementSession();
  // Local pre-flow step: "who is this for?" then self-rating, before the
  // server session starts. Once `state.sessionId` exists the server
  // phase drives everything.
  const [step, setStep] = useState<"who" | "rating">("who");

  const busy = state.status === "starting" || state.status === "submitting";

  // ── Pre-flow (only while the flow is still idle — once begin() runs,
  //    error/in_progress/complete take precedence even with no sessionId
  //    yet, so a failed start surfaces the error, not the who screen) ──
  if (state.status === "idle" && step === "who") {
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>Bài kiểm tra xếp lớp</h1>
          <p style={subEn}>Placement test — find your real level</p>
          <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.55 }}>
            Khoảng 6–9 phút. Trả lời thật, đề tự điều chỉnh độ khó theo bạn.
          </p>
          <button type="button" style={primaryBtn} onClick={() => setStep("rating")}>
            Tôi là người lớn — bắt đầu
          </button>
          <button
            type="button"
            style={choiceBtn(false)}
            onClick={() => nav(`/room/${KIDS_ROOM_ID}`)}
          >
            Con tôi (4–10 tuổi)
          </button>
        </div>
      </div>
    );
  }

  // ── Pre-flow: self-rating ────────────────────────────────────────────
  if (state.status === "idle" && step === "rating") {
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>Bạn tự thấy trình độ tiếng Anh của mình thế nào?</h1>
          <p style={subEn}>How would you rate your English?</p>
          {SELF_RATINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              style={choiceBtn(false)}
              disabled={busy}
              onClick={() => begin({ selfRating: r.id })}
            >
              {r.vi} <span style={{ color: "#94a3b8" }}>· {r.en}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Server-driven phases ─────────────────────────────────────────────
  if (state.status === "error") {
    const e = state.error;
    const isAuth = e?.kind === "auth_required";
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>
            {isAuth ? "Vui lòng đăng nhập" : "Đã có lỗi xảy ra"}
          </h1>
          <p style={{ color: "#475569", fontSize: 15 }}>
            {isAuth
              ? "Bạn cần đăng nhập để làm bài kiểm tra xếp lớp."
              : "Không kết nối được tới máy chủ. Vui lòng thử lại."}
          </p>
          <button
            type="button"
            style={primaryBtn}
            onClick={() => (isAuth ? nav("/login") : nav("/"))}
          >
            {isAuth ? "Đăng nhập" : "Về trang chủ"}
          </button>
        </div>
      </div>
    );
  }

  if (state.status === "abandoned") {
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>Bài kiểm tra đã dừng</h1>
          <button type="button" style={primaryBtn} onClick={() => nav("/")}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (state.status === "complete" && state.result) {
    const r = state.result;
    const tag =
      CEFR_TAGLINE[r.overall.cefr as keyof typeof CEFR_TAGLINE];
    const eligible = new Date(r.retest.eligibleAt).toLocaleDateString("vi-VN");
    return (
      <div style={wrap}>
        <div style={{ ...col, textAlign: "center" }}>
          <p style={subEn}>Trình độ của bạn</p>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#0a0a0a" }}>
            {r.overall.cefr.toUpperCase()}
          </div>
          {tag && (
            <p style={{ color: "#475569", fontSize: 15 }}>
              {tag.vi}
              <br />
              <span style={subEn}>{tag.en}</span>
            </p>
          )}
          <button
            type="button"
            style={primaryBtn}
            onClick={() => nav(`/room/${r.recommendedRoomId}`)}
          >
            Bắt đầu học
          </button>
          <p style={{ ...subEn, marginTop: 8 }}>
            Bạn có thể kiểm tra lại sau ngày {eligible}.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "in_progress" && state.item) {
    return (
      <div style={wrap}>
        <ItemCard item={state.item} busy={busy} onAnswer={submit} />
      </div>
    );
  }

  // in_progress without an item = a resumed session whose in-flight item
  // was not persisted (PR 9 flags #4/#5 — there is no server anchor; the
  // UI would re-present its held item, but a hard reload lost it). Be
  // honest, never strand: offer a clean restart.
  if (state.status === "in_progress" && !state.item) {
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>Phiên kiểm tra chưa hoàn tất</h1>
          <p style={{ color: "#475569", fontSize: 15 }}>
            Vui lòng bắt đầu lại từ đầu.
          </p>
          <button
            type="button"
            style={primaryBtn}
            disabled={busy}
            onClick={async () => {
              await abandon();
              setStep("who");
            }}
          >
            Bắt đầu lại
          </button>
        </div>
      </div>
    );
  }

  if (state.status === "awaiting_self_rating") {
    return (
      <div style={wrap}>
        <div style={col}>
          <h1 style={h1}>Bạn tự thấy trình độ của mình thế nào?</h1>
          {SELF_RATINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              style={choiceBtn(false)}
              disabled={busy}
              onClick={() => rate(r.id)}
            >
              {r.vi} <span style={{ color: "#94a3b8" }}>· {r.en}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // starting / submitting — loading.
  return (
    <div style={wrap}>
      <div style={{ ...col, textAlign: "center" }}>
        <p style={{ color: "#475569", fontSize: 15 }}>Đang tải…</p>
      </div>
    </div>
  );
}
