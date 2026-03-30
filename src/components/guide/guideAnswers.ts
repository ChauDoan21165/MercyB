export type GuideAnswerKey =
  | "greeting"
  | "onboarding"
  | "app_usage"
  | "room_usage"
  | "host_redirect"
  | "speak_redirect"
  | "fallback";

export const guideAnswers: Record<GuideAnswerKey, string> = {
  greeting:
    "Hi! I’m Guide. I can help you use the app, choose a room, and know where to go next.",

  onboarding:
    "Tell me your goal and I’ll point you to the best place. For example: grammar help, writing practice, reading, pronunciation, or general app help.",

  app_usage:
    "You can use Guide for app help and room navigation. Use Mercy Host when you want real tutoring like grammar explanation, writing correction, summarizing, or reading help.",

  room_usage:
    "Use Guide for where-to-go questions. Use Mercy Host for learning questions. Use Speak for pronunciation practice.",

  host_redirect:
    "That sounds like a learning question. Please use Mercy Host for grammar, writing correction, rewriting, summarizing, reading help, and explanations.",

  speak_redirect:
    "That sounds like pronunciation practice. Please use Speak for pronunciation help.",

  fallback:
    "I can help with app usage, room navigation, and where to go next. If you want teaching or correction, switch to Mercy Host.",
};