export type TutorVoiceSource = "idle" | "cloud" | "device";

export type SpeakableTutorTurn = {
  role: "mercy" | "user";
  text?: string;
  correction?: string;
  reply?: string;
  nextQuestion?: string;
};

export function getVoiceSourceLabel(source: TutorVoiceSource): string | null {
  if (source === "cloud") return "Mercy voice";
  if (source === "device") return "Device voice fallback";
  return null;
}

export function getSpeakableText(turn: SpeakableTutorTurn): string {
  if (turn.role !== "mercy") return "";
  return [turn.correction, turn.reply, turn.nextQuestion, turn.text]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" ");
}
