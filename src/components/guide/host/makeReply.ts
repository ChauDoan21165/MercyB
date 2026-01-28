cat > src/components/guide/host/makeReply.ts <<'EOF'
// src/components/guide/host/makeReply.ts
// SAFE STUB — required by MercyAIHost import.
// Returns a simple host reply object/string without side effects.

export type HostReply = {
  text_en: string;
  text_vi?: string;
  tone?: "neutral" | "warm" | "firm";
};

export function makeReply(input: any): HostReply {
  // If caller already passes a string, echo it.
  if (typeof input === "string") return { text_en: input, tone: "neutral" };

  // If caller passes an object with text_en, preserve it.
  const text_en =
    typeof input?.text_en === "string"
      ? input.text_en
      : typeof input?.en === "string"
        ? input.en
        : "…";

  const text_vi =
    typeof input?.text_vi === "string"
      ? input.text_vi
      : typeof input?.vi === "string"
        ? input.vi
        : undefined;

  const tone =
    input?.tone === "warm" || input?.tone === "firm" ? input.tone : "neutral";

  return { text_en, text_vi, tone };
}
EOF
