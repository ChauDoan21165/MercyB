export type TutorTargetLanguage = string;
export type TutorExplainLanguage = string;
export type TutorMode = "correction" | "conversation";

export type TutorTurn = {
  id: string;
  mode: TutorMode;
  targetLanguage: string;
  explainLanguage: string;
  userText: string;
  correctedText: string;
  explanation: string;
  naturalReply?: string;
  nextQuestion?: string;
  shouldReadAloudText: string;
  createdAt: string;
  cell_id?: string | null;
  cellId?: string | null;
};

export type TutorCorrectionResult = {
  turn: TutorTurn;
};

export type TutorConversationResult = {
  turn: TutorTurn;
};
