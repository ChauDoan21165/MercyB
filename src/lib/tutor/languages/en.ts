import type { TutorLanguagePack } from "../tutorCopy";

export const en = {
  code: "en",
  nameEn: "English",
  nameVi: "tiếng Anh",
  correctionTitle: "English correction",
  conversationTitle: "Conversation with Mercy",
  inputLabel: "English sentence",
  placeholder: 'gõ câu của bạn ở đây, ví dụ: "She go to school every day"',
  fallbackMessages: {
    correctionRequired: "Mercy needs the AI correction engine for this one.",
    emptyConversation: "Mercy will start with one easy question.",
    voiceUnavailable: "Microphone unavailable in this browser. You can still type your sentence.",
  },
  exampleSentences: [
    "She go to school every day.",
    "I buy a hat yesterday.",
    "He eat rice yesterday.",
  ],
  starterQuestions: [
    "What do you usually do in the morning?",
    "What did you do yesterday?",
    "What do you want to practice today?",
  ],
  commonBeginnerMistakes: [
    "Forgetting -s/-es with she/he/it in the present simple.",
    "Using a present verb with yesterday or last week.",
    "Missing articles before jobs or singular nouns.",
  ],
  grammarHints: [
    "Third-person singular subject -> verb + -s/-es.",
    "Use past verb forms with clear past time markers.",
    "Use a/an before singular countable nouns when needed.",
  ],
  nextQuestionTemplates: [
    "What do you do after that?",
    "Can you say one more sentence about your day?",
    "Can you try the same idea with yesterday?",
  ],
  naturalReplies: [
    "Nice. That sounds like a clear morning routine.",
    "Good. Your idea is clear.",
    "That sounds natural for a beginner sentence.",
  ],
  speakerLabels: {
    tutor: "Teacher Mercy",
    learner: "You",
    correctedVersion: "Corrected version",
    shortExplanation: "Short explanation",
    naturalReply: "Natural reply",
    thinking: "Mercy is thinking...",
  },
  micLabels: {
    input: "Speak your sentence",
    listening: "Listening to your voice...",
    helper: "Mercy turns your voice into text for correction.",
    unavailable: "Microphone unavailable in this browser. You can still type your sentence.",
    ariaStart: "Speak your sentence for voice input",
    ariaStop: "Stop listening",
  },
} satisfies TutorLanguagePack;
