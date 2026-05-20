export type PlacementV3Cefr = "pre_a1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PlacementV3Modality =
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "conversation";

export type PlacementV3TaskType =
  | "writing"
  | "speaking"
  | "reading_mcq"
  | "reading_short"
  | "listening_mcq"
  | "listening_short"
  | "conversation";

export type BilingualText = {
  en: string;
  vi: string;
};

export type PlacementV3Option = {
  id: string;
  label: BilingualText;
};

export type PlacementV3Task = {
  id: string;
  modality: PlacementV3Modality;
  type: PlacementV3TaskType;
  instruction: BilingualText;
  prompt: BilingualText;
  minWords?: number;
  passage?: BilingualText;
  audioUrl?: string;
  mercyTurn?: BilingualText;
  options?: PlacementV3Option[];
  estimatedSeconds?: number;
};

export type PlacementV3SkillProfile = {
  modality: PlacementV3Modality;
  cefr: PlacementV3Cefr;
  confidence: number;
  summary: BilingualText;
};

export type PlacementV3Recommendation = {
  roomId: string;
  title: BilingualText;
  description: BilingualText;
  cefr: PlacementV3Cefr;
  reason: BilingualText;
};

export type PlacementV3L1Flag = {
  id: string;
  label: BilingualText;
  evidence: BilingualText;
  severity: "low" | "medium" | "high";
};

export type PlacementV3Results = {
  sessionId: string;
  completedAt: string;
  overallCefr: PlacementV3Cefr;
  overallConfidence: number;
  overallSummary: BilingualText;
  skills: PlacementV3SkillProfile[];
  l1Flags: PlacementV3L1Flag[];
  recommendations: PlacementV3Recommendation[];
  strengths: BilingualText[];
  gaps: BilingualText[];
  questionCount: number;
};

export type PlacementV3SessionStatus =
  | "in_progress"
  | "completed"
  | "abandoned"
  | "expired";

export type PlacementV3Session = {
  sessionId: string;
  status: PlacementV3SessionStatus;
  currentTask: PlacementV3Task | null;
  answeredCount: number;
  estimatedTotal: number;
  modalityIndex: number;
  modalities: PlacementV3Modality[];
  startedAt: string;
  expiresAt: string;
};

export type PlacementV3ResponsePayload = {
  sessionId: string;
  taskId: string;
  modality: PlacementV3Modality;
  value: string;
  audioBlob?: Blob | null;
  viRevealed?: boolean;
  elapsedMs?: number;
};

export type PlacementV3SubmitResult = {
  session: PlacementV3Session;
  completed: boolean;
  results?: PlacementV3Results;
};
