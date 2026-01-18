import { useState } from "react";

export function useRoomFeedback(supabase: any, roomId: string, authUser: any) {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  async function sendFeedback() {
    const msg = feedbackText.trim();
    if (!msg) return;

    if (!authUser) {
      setFeedbackError("Please sign in to send feedback.");
      setFeedbackSent(false);
      return;
    }

    setFeedbackSending(true);
    setFeedbackError(null);
    setFeedbackSent(false);

    try {
      const rid = String(roomId || "").trim() || null;

      const { error } = await supabase.from("app_feedback").insert({
        room_id: rid,
        user_id: authUser?.id ?? null,
        user_email: authUser?.email ?? null,
        message: msg,
      });

      if (error) throw error;

      setFeedbackText("");
      setFeedbackSent(true);
    } catch (e: any) {
      setFeedbackError(String(e?.message || e || "Failed to send feedback"));
      setFeedbackSent(false);
    } finally {
      setFeedbackSending(false);
    }
  }

  return {
    feedbackText,
    setFeedbackText,
    feedbackSending,
    feedbackSent,
    feedbackError,
    sendFeedback,
    setFeedbackError,
    setFeedbackSent,
  };
}
