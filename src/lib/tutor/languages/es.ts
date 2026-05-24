import type { TutorLanguagePack } from "../tutorCopy";

export const es = {
  code: "es",
  nameEn: "Spanish",
  nameVi: "tiếng Tây Ban Nha",
  correctionTitle: "Spanish correction",
  conversationTitle: "Spanish conversation with Mercy",
  inputLabel: "Spanish sentence",
  placeholder: 'type your Spanish sentence here, for example: "Yo fui al mercado ayer"',
  fallbackMessages: {
    correctionRequired: "Mercy needs the AI correction engine for this Spanish sentence.",
    emptyConversation: "Mercy empezará con una pregunta fácil.",
    voiceUnavailable: "Microphone unavailable in this browser. You can still type your sentence.",
  },
  exampleSentences: ["Yo fui al mercado ayer.", "Tomo café por la mañana.", "Quiero practicar español."],
  starterQuestions: ["¿Qué haces normalmente por la mañana?", "¿Qué hiciste ayer?", "¿Qué quieres practicar hoy?"],
  commonBeginnerMistakes: ["Using the wrong past tense for completed actions.", "Overusing subject pronouns.", "Translating English word order too directly."],
  grammarHints: ["Use pretérito for completed past actions like ayer.", "Spanish often drops yo when the verb is clear.", "Keep adjective agreement in mind."],
  nextQuestionTemplates: ["¿Qué haces después de eso?", "¿Puedes decir una frase más?", "¿Puedes usar ayer en otra frase?"],
  naturalReplies: ["Muy bien. Tu rutina de la mañana está clara.", "Bien hecho. Tu idea es clara.", "Suena natural para una frase de práctica."],
  speakerLabels: { tutor: "Teacher Mercy", learner: "You", correctedVersion: "Corrected version", shortExplanation: "Short explanation", naturalReply: "Natural reply", thinking: "Mercy is thinking..." },
  micLabels: { input: "Speak your sentence", listening: "Listening to your voice...", helper: "Mercy turns your voice into text for correction.", unavailable: "Microphone unavailable in this browser. You can still type your sentence.", ariaStart: "Speak your sentence for voice input", ariaStop: "Stop listening" },
} satisfies TutorLanguagePack;
