// src/components/stage-4/composeStage4Reason.ts
//
// Stage 4 (L4) — presentation-layer reason composer (Q5=B).
//
// Q5=B: the L4 engine emits a STRUCTURED `TriggerReason` (rule id +
// signal context); the presentation layer composes the VI/EN
// user-facing string. This keeps engine and copy separate — each
// surface (in-app card, parent digest, future teacher view) can render
// the same `TriggerReason` in its own register without engine-side
// branching. The composed pair is rendered through `<Bilingual>` so the
// per-language `lang` attributes (WCAG 3.1.2) are correct.
//
// Pure: no I/O, no React, no localStorage. Identical reason → identical
// text. Labels resolve through `stage-3a/taxonomy.ts` — never duplicate
// the label tables here; unknown tags get the taxonomy's neutral
// fallback, never a raw engineer tag in learner-facing copy.

import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
} from "@/lib/stage-3a/taxonomy";
import type { TriggerReason } from "@/lib/stage-4/types";

export interface ComposedReason {
  vi: string;
  en: string;
}

/**
 * Compose the learner-facing VI/EN intervention text from a structured
 * `TriggerReason`. VI is the primary register (house style); EN is the
 * secondary. Tone is calm and invitational — never streak / XP / shame /
 * daily-requirement language (the Stage 3B engine's forbidden-phrase
 * guarantee extends to L4's copy).
 */
export function composeStage4Reason(reason: TriggerReason): ComposedReason {
  switch (reason.kind) {
    case "repeated_l1_pattern": {
      const label = describeL1Tag(reason.tag);
      // L5-PENDING: attribution rationale phrasing is a provisional
      // default pending L5 ratification of "L4 attribution rationale
      // content authorship". See STAGE-4-5-decision-queue.md
      // § Research-blocked → "L4 attribution rationale content authorship".
      return {
        vi: `Tuần này Mercy thấy em hay gặp "${label.shortVi}" — thử luyện một chút nhé?`,
        en: `Mercy noticed "${label.shortEn}" came up a few times this week — want to practice a bit?`,
      };
    }
    case "high_severity_placement": {
      const label = describePlacementWeakness(reason.tag);
      // L5-PENDING: see note above.
      return {
        vi: `"${label.shortVi}" là điểm em có thể luyện thêm — thử một lượt nhanh nhé?`,
        en: `"${label.shortEn}" is something you can work on — try a quick round?`,
      };
    }
    case "high_error_phoneme": {
      const label = describePhonemeAxis(reason.axis);
      // L5-PENDING: see note above.
      return {
        vi: `Có muốn luyện thêm "${label.shortVi}" không em?`,
        en: `Want to practice "${label.shortEn}" a bit more?`,
      };
    }
    default:
      return assertNever(reason);
  }
}

function assertNever(reason: never): ComposedReason {
  void (reason as TriggerReason);
  // Neutral, kind fallback — never a raw tag.
  return {
    vi: "Một mẫu câu em còn đang luyện — thử thêm một chút nhé?",
    en: "A pattern you're still working on — want to try a bit more?",
  };
}
