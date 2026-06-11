export type ErrorTag =
  | "tense"
  | "article"
  | "plural"
  | "preposition"
  | "word_order"
  | "copula"
  | "collocation"
  | "register"
  | "pronoun"
  | "conjunction"
  | "literal_translation"
  | "redundancy"
  | "omission";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type Register = "informal" | "neutral" | "formal";

export type ToneJudgment = {
  register: Register;
  natural: boolean;
  context: string;
};

export type EvalEntry = {
  id: string;
  input: string;
  expected: string;
  errorTags: ErrorTag[];
  tone: ToneJudgment;
  level: CefrLevel;
  vietlishPattern: string;
};

export type EvalSetMeta = {
  name: string;
  description: string;
  version: number;
  targetLearnerL1: "vi";
  targetLearnerL2: "en";
  schemaSource: string;
  count: number;
  entries: EvalEntry[];
};
