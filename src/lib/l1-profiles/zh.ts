/**
 * Vietnamese L1 → Chinese target profile shell.
 *
 * This is a structural shell only. It establishes the pair-matrix profile
 * slot and points at the existing ZH correction-rule consumer without wiring
 * detector or prompt behavior.
 */

import { chineseCorrectionRules } from "../tutor/correctionRules/zh.js";
import type { CorrectionRule } from "../tutor/correctionRules/en.js";
import type { L1Profile } from "./vi.js";

export interface ZHProfileFunctionalConsumer {
  correctionRules: CorrectionRule[];
  correctionRulesPath: "src/lib/tutor/correctionRules/zh.ts";
}

export type ZHL1Profile = L1Profile & {
  functionalConsumer: ZHProfileFunctionalConsumer;
};

export const zhL1Profile = {
  meta: {
    nativeLangCode: "vi",
    nativeLangName: "Vietnamese",
    targetLangCode: "zh",
    version: "0.1.0",
    lastReviewed: "2026-05-25",
    lastReviewedBy: "A2",
    citations: [
      "docs/pair-matrix.md",
      "src/lib/tutor/correctionRules/zh.ts",
    ],
  },
  interference: {
    patterns: [
      {
        id: "zh_profile_shell",
        category: "syntax",
        name: "Chinese profile shell",
        shortDescription:
          "Structural placeholder for Vietnamese learners studying Chinese.",
        longDescription:
          "This shell reserves the VI→ZH profile slot and links it to the existing ZH correction-rule consumer. It does not author detector rules, prompt wiring, or a full Chinese interference taxonomy.",
        vietnameseRoot:
          "Vietnamese learner-transfer details for Chinese are not authored in this shell. Future taxonomy work should replace this placeholder with reviewed VI→ZH patterns.",
        examples: [
          {
            incorrect: "TBD VI→ZH learner sentence",
            corrected: "TBD natural Chinese sentence",
            gloss: "placeholder only",
            context: "Profile shell",
          },
        ],
        cefrLevelsObserved: ["A1"],
        severity: "low",
        remediation:
          "Use the existing ZH correction-rule consumer until reviewed VI→ZH taxonomy entries are authored.",
        ruleTags: ["zh_profile_shell"],
      },
    ],
  },
  functionalConsumer: {
    correctionRules: chineseCorrectionRules,
    correctionRulesPath: "src/lib/tutor/correctionRules/zh.ts",
  },
} satisfies ZHL1Profile;

export default zhL1Profile;
