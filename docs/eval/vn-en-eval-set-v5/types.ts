import type { EvalSetMeta } from "../vn-en-eval-set-v1/types";
import type { RegisterPatternId } from "../vn-en-eval-set-v4/types";
import type { InterferenceMasteryLevel } from "../../../src/lib/sequencing/types";

export type EvalSetV5Category =
  | "stt_mishear_sanity"
  | "register_error_contextual"
  | "forecast_abstain_thin_data";

export type SttMode = "read_back" | "free_answer";

export type SttExpectedBehavior =
  | "accept_target_only"
  | "flag_mishear_and_ask_reread"
  | "abstain_no_correction";

export type VnFinalConsonantClass =
  | "final_t_d_voicing"
  | "final_p_b_voicing"
  | "final_k_g_voicing"
  | "final_s_z_voicing"
  | "vowel_length_i_short_i";

export type SttMishearExpectation = {
  mode: SttMode;
  targetPhrase: string;
  transcript: string;
  minimalPair: [string, string];
  vnFinalConsonantClass: VnFinalConsonantClass;
  expectedBehavior: SttExpectedBehavior;
  shouldAbstain: boolean;
};

export type RegisterContextExpectation = {
  taxonomyPatternId: RegisterPatternId;
  contextProvided: boolean;
  addresseeContext: string;
  expectedBehavior: "flag_register_error";
  shouldAbstain: false;
};

export type ForecastAbstainExpectation = {
  patternId: string;
  attemptsCount: 0 | 1 | 2;
  level: InterferenceMasteryLevel;
  score: number | null;
  confidenceWidth: number;
  expectedBehavior: "abstain_no_forecast";
  shouldAbstain: true;
  reasonCode: "untested" | "thin_data";
  minAttemptsRequired: 3;
};

export type EvalEntryV5Base = {
  id: string;
  category: EvalSetV5Category;
  input: string;
  expected: string;
  errorTags: string[];
  tone: string;
  level: string;
  vietlishPattern: string;
};

export type SttEvalEntryV5 = EvalEntryV5Base & {
  category: "stt_mishear_sanity";
  stt: SttMishearExpectation;
};

export type RegisterEvalEntryV5 = EvalEntryV5Base & {
  category: "register_error_contextual";
  register: RegisterContextExpectation;
};

export type ForecastEvalEntryV5 = EvalEntryV5Base & {
  category: "forecast_abstain_thin_data";
  forecast: ForecastAbstainExpectation;
};

export type EvalEntryV5 = SttEvalEntryV5 | RegisterEvalEntryV5 | ForecastEvalEntryV5;

export type EvalSetMetaV5 = Omit<EvalSetMeta, "version" | "entries"> & {
  version: 5;
  entries: EvalEntryV5[];
};
