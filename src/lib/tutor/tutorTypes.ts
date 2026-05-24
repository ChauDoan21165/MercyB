export type TutorTargetLanguage = string;
export type TutorExplainLanguage = string;
export type TutorMode = "correction" | "conversation";

export type TutorTurn = {
  id: string;
  mode: TutorMode;
  targetLanguage: TutorTargetLanguage;
  explainLanguage: TutorExplainLanguage;
  userText: string;
  correctedText: string;
  explanation: string;
  naturalReply: string;
  nextQuestion: string;
  shouldReadAloudText: string;
  createdAt: string;
};

export type TutorCorrectionResult = {
  turn: TutorTurn;
};

export type TutorConversationResult = {
  turn: TutorTurn;
};
