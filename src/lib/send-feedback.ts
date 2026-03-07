// FILE: src/lib/send-feedback.ts

type Vote = "up" | "down";

type SendFeedbackArgs = {
  appKey: string;
  anonId: string;
  sessionId: string;
  conversationId: string;
  responseId: string;
  msgId: string;
  vote: Vote;
  feedbackReason?: string | null;
  answerText?: string | null;
  modelName?: string | null;
  promptVersion?: string | null;
  tier?: string | null;
  lang?: string | null;
  mode?: string | null;
  path?: string | null;
};

export async function sendMercyFeedback({
  appKey,
  anonId,
  sessionId,
  conversationId,
  responseId,
  msgId,
  vote,
  feedbackReason = null,
  answerText = null,
  modelName = null,
  promptVersion = null,
  tier = "free",
  lang = "en",
  mode = "home",
  path = "/",
}: SendFeedbackArgs) {
  const res = await fetch("/api/mercy-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schema: "mb.feedback.v1",
      appKey,
      client: {
        version: "web",
        buildTime: new Date().toISOString(),
        platform: "web",
        locale: navigator.language || "en-US",
        tzOffsetMin: new Date().getTimezoneOffset(),
      },
      actor: {
        anonId,
        sessionId,
      },
      context: {
        pagePath: path,
        mode,
        contextLine: null,
        conversationId,
      },
      model: {
        name: modelName,
        promptVersion,
      },
      items: [
        {
          v: 1,
          ts: Date.now(),
          appKey,
          authUserId: null,
          tier,
          lang,
          mode,
          path,
          msgId,
          responseId,
          vote,
          feedbackReason,
          answerText,
        },
      ],
    }),
  });

  return res.json();
}