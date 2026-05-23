// src/pages/AiTutor.tsx
// AI Tutor mock UI shell — static responses only, no real provider calls.

import { useState } from "react";

const MOCK_RESPONSE = {
  corrected: "She goes to school every day.",
  explanation: "Third-person singular 'she' requires 'goes' (not 'go').",
};

export default function AiTutorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<typeof MOCK_RESPONSE | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setResult(MOCK_RESPONSE);
    setSubmitted(true);
  };

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>
          AI Tutor
        </h1>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            background: "#FEF3C7",
            color: "#92400E",
            padding: "2px 10px",
            borderRadius: 9999,
            textTransform: "uppercase",
          }}
        >
          Mock — Provider Disabled
        </span>
      </div>

      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
        Type a sentence and get a correction. Responses are static mocks.
        No real AI provider calls are made.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='e.g. "She go to school every day."'
        rows={3}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 15,
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          resize: "vertical",
          fontFamily: "inherit",
        }}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!input.trim()}
        style={{
          marginTop: 12,
          width: "100%",
          padding: "12px 0",
          fontSize: 16,
          fontWeight: 800,
          borderRadius: 9999,
          border: "none",
          background: input.trim() ? "#0F172A" : "#CBD5E1",
          color: input.trim() ? "#fff" : "#94A3B8",
          cursor: input.trim() ? "pointer" : "not-allowed",
        }}
      >
        Correct my sentence
      </button>

      {submitted && result && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 14,
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
            Corrected
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#14532D" }}>
            {result.corrected}
          </div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 8 }}>
            {result.explanation}
          </div>
        </div>
      )}
    </main>
  );
}
