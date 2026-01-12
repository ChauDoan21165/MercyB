import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  roomId?: string;
  roomTitle?: string;
  keyword?: string | null;
};

function tipsFor(keyword?: string | null) {
  const k = (keyword || "").toLowerCase().trim();
  if (!k) {
    return [
      { en: "Pick a keyword to get coaching.", vi: "Chọn một từ khóa để nhận hướng dẫn." },
      { en: "Start small: 1 keyword → 1 sentence.", vi: "Bắt đầu nhỏ: 1 từ khóa → 1 câu." },
    ];
  }

  // simple rule-based examples (expand later)
  return [
    {
      en: `Try a “real life” sentence with “${keyword}”.`,
      vi: `Hãy đặt một câu “đời thật” với “${keyword}”.`,
    },
    {
      en: "Say it slowly once, then naturally once.",
      vi: "Nói chậm một lần, rồi nói tự nhiên một lần.",
    },
    {
      en: "If you get stuck, shorten the sentence.",
      vi: "Nếu bí, hãy rút ngắn câu lại.",
    },
  ];
}

export default function TeacherGPTPanel({ open, onClose, roomId, roomTitle, keyword }: Props) {
  if (!open) return null;

  const tips = tipsFor(keyword);

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 84, // stays above BottomMusicBar
        width: 360,
        maxWidth: "calc(100vw - 32px)",
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.14)",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
        zIndex: 9999,
        overflow: "hidden",
      }}
      role="dialog"
      aria-label="Teacher GPT Guide"
    >
      <div
        style={{
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          borderBottom: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ fontWeight: 950, fontSize: 13 }}>
          🙂 Teacher GPT
          <div style={{ fontWeight: 800, fontSize: 12, opacity: 0.7 }}>
            {roomTitle ? roomTitle : roomId ? roomId : "Guide"}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "white",
            cursor: "pointer",
            fontWeight: 950,
          }}
          aria-label="Close"
          title="Close"
        >
          ×
        </button>
      </div>

      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 900 }}>Keyword</div>
        <div style={{ marginTop: 6, fontWeight: 950 }}>
          {keyword ? keyword : <span style={{ opacity: 0.6 }}>None selected</span>}
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {tips.map((t, i) => (
            <div
              key={i}
              style={{
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 14,
                padding: 10,
                background: "rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ fontWeight: 900 }}>{t.en}</div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>{t.vi}</div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled
          style={{
            marginTop: 12,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.14)",
            background: "rgba(0,0,0,0.04)",
            fontWeight: 950,
            cursor: "not-allowed",
            opacity: 0.75,
          }}
          title="API later"
        >
          Ask teacher GPT (soon)
        </button>
      </div>
    </div>
  );
}
