/**
 * VERSION: teachingStrategies.ts v2
 *
 * Mercy Teaching Strategies
 *
 * Reusable teacher moves for Mercy Host.
 *
 * Purpose:
 * - separate pedagogical structure from personality styling
 * - keep teacher responses consistent and intentional
 * - provide bilingual building blocks for scripts and planners
 * - add worked-example support so Mercy can demonstrate before pushing the learner
 *
 * Design rules:
 * - acknowledge -> teach -> next step
 * - correct one useful thing at a time
 * - praise specifically when possible
 * - keep warmth, avoid fluff
 * - clarity first, wit second
 */

import type { TeachingMode } from './teachingModes';

export type StrategyTone = 'calm' | 'warm' | 'playful' | 'firm';
export type CorrectionStyle = 'gentle' | 'direct' | 'contrastive';

export interface TeachingStrategyLine {
  en: string;
  vi: string;
}

export interface TeachingStrategyResult {
  mode: TeachingMode;
  tone: StrategyTone;
  opening?: TeachingStrategyLine;
  teaching?: TeachingStrategyLine;
  nextStep?: TeachingStrategyLine;
  followUpMode?: TeachingMode;
  tags?: string[];
}

export interface CorrectionInput {
  mistake: string;
  fix: string;
}

export interface StrategyOptions {
  tone?: StrategyTone;
  nextPrompt?: string;
  specificPraise?: string;
  learnerName?: string;
  concept?: string;
  example?: string;
  workedExample?: string;
  repeatedMistake?: boolean;
  isSensitiveMoment?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function joinLine(parts: Array<string | undefined>): string {
  return cleanText(parts.filter(Boolean).join(' '));
}

function buildLine(en: string, vi: string): TeachingStrategyLine {
  return {
    en: cleanText(en),
    vi: cleanText(vi),
  };
}

function buildNextStep(nextPrompt?: string): TeachingStrategyLine | undefined {
  if (!nextPrompt) return undefined;

  return buildLine(nextPrompt, `Bước tiếp theo: ${cleanText(nextPrompt)}`);
}

function buildNamedOpening(
  baseEn: string,
  baseVi: string,
  learnerName?: string
): TeachingStrategyLine {
  if (!learnerName) {
    return buildLine(baseEn, baseVi);
  }

  return buildLine(
    `${learnerName}, ${baseEn.charAt(0).toLowerCase()}${baseEn.slice(1)}`,
    `${learnerName}, ${baseVi.charAt(0).toLowerCase()}${baseVi.slice(1)}`
  );
}

function buildPraiseLine(specificPraise?: string): TeachingStrategyLine | undefined {
  if (!specificPraise) return undefined;
  return buildLine(specificPraise, specificPraise);
}

function withMeta(
  result: Omit<TeachingStrategyResult, 'followUpMode' | 'tags'>,
  meta?: { followUpMode?: TeachingMode; tags?: string[] }
): TeachingStrategyResult {
  return {
    ...result,
    followUpMode: meta?.followUpMode,
    tags: meta?.tags || [],
  };
}

function buildWorkedExampleNextStep(nextPrompt?: string): TeachingStrategyLine {
  if (nextPrompt) {
    return buildNextStep(nextPrompt)!;
  }

  return buildLine(
    'Now try the same pattern once on your own.',
    'Giờ bạn thử đúng mẫu đó một lần nhé.'
  );
}

/* -------------------------------------------------------------------------- */
/* Core correction strategies                                                 */
/* -------------------------------------------------------------------------- */

export function gentleCorrection(
  correction: CorrectionInput,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'warm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'correct',
      tone,
      opening:
        praise ||
        buildNamedOpening("you're close.", 'bạn gần đúng rồi.', options.learnerName),
      teaching: buildLine(`Small fix: ${correction.fix}.`, `Sửa nhẹ: ${correction.fix}.`),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['correction', 'gentle'],
    }
  );
}

export function directCorrection(
  correction: CorrectionInput,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'correct',
      tone,
      opening:
        praise ||
        buildNamedOpening('close.', 'gần đúng rồi.', options.learnerName),
      teaching: buildLine(`${correction.fix}.`, `${correction.fix}.`),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['correction', 'direct'],
    }
  );
}

export function contrastiveCorrection(
  correction: CorrectionInput,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'correct',
      tone,
      opening:
        praise ||
        buildNamedOpening('close.', 'gần đúng rồi.', options.learnerName),
      teaching: buildLine(
        `Use "${correction.fix}", not "${correction.mistake}".`,
        `Dùng "${correction.fix}", không dùng "${correction.mistake}".`
      ),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['correction', 'contrastive'],
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Review / recap strategies                                                  */
/* -------------------------------------------------------------------------- */

export function guidedRecall(
  target: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';

  return withMeta(
    {
      mode: 'review',
      tone,
      opening: buildLine("Let's recall the key point.", 'Hãy nhớ lại điểm chính.'),
      teaching: buildLine(`Think about ${target} first.`, `Hãy nghĩ về ${target} trước.`),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['review', 'recall'],
    }
  );
}

export function microRecap(
  summary: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';

  return withMeta(
    {
      mode: 'recap',
      tone,
      opening: buildLine('Quick recap.', 'Ôn nhanh nhé.'),
      teaching: buildLine(summary, summary),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'encourage',
      tags: ['recap'],
    }
  );
}

export function conceptReview(
  concept: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';

  return withMeta(
    {
      mode: 'review',
      tone,
      opening: buildLine("Let's review this once more.", 'Hãy ôn lại phần này thêm một lần nữa.'),
      teaching: buildLine(
        `Focus on ${concept}. Keep it simple and clear.`,
        `Tập trung vào ${concept}. Giữ nó đơn giản và rõ ràng.`
      ),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['review', 'concept'],
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Confidence / encouragement strategies                                      */
/* -------------------------------------------------------------------------- */

export function confidenceRepair(
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'warm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'encourage',
      tone,
      opening: praise || buildLine("You're still in this.", 'Bạn vẫn đang ở trong tiến trình này.'),
      teaching: buildLine(
        'One clear step is enough for now.',
        'Một bước rõ ràng lúc này là đủ.'
      ),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['encourage', 'confidence'],
    }
  );
}

export function encourageMomentum(
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'warm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'encourage',
      tone,
      opening: praise || buildLine('Good direction.', 'Hướng đi tốt.'),
      teaching: buildLine(
        'Keep building from here.',
        'Tiếp tục xây từ đây nhé.'
      ),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'challenge',
      tags: ['encourage', 'momentum'],
    }
  );
}

export function praiseThenPush(
  specificPraise: string,
  nextPrompt?: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'warm';

  return withMeta(
    {
      mode: 'encourage',
      tone,
      opening: buildLine(specificPraise, specificPraise),
      teaching: buildLine('Good. Keep that part.', 'Tốt. Hãy giữ phần đó.'),
      nextStep: buildNextStep(nextPrompt || options.nextPrompt),
    },
    {
      followUpMode: 'challenge',
      tags: ['encourage', 'praise'],
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Explanation strategies                                                     */
/* -------------------------------------------------------------------------- */

export function explainRule(
  explanation: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'explain',
      tone,
      opening: praise || buildLine('Here is the key point.', 'Đây là điểm chính.'),
      teaching: buildLine(explanation, explanation),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['explain'],
    }
  );
}

export function explainWithExample(
  explanation: string,
  example: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'explain',
      tone,
      opening: praise || buildLine('Here is the rule.', 'Đây là quy tắc.'),
      teaching: buildLine(
        `${explanation} Example: ${example}`,
        `${explanation} Ví dụ: ${example}`
      ),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['explain', 'example'],
    }
  );
}

export function workedExample(
  explanation: string,
  example: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'warm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'explain',
      tone,
      opening:
        praise ||
        buildLine(
          'Watch this one first.',
          'Xem ví dụ này trước nhé.'
        ),
      teaching: buildLine(
        `${explanation} Worked example: ${example}`,
        `${explanation} Ví dụ làm mẫu: ${example}`
      ),
      nextStep: buildWorkedExampleNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['explain', 'worked_example'],
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Practice / drill strategies                                                */
/* -------------------------------------------------------------------------- */

export function oneStepChallenge(
  prompt?: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'firm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'challenge',
      tone,
      opening: praise || buildLine('Good.', 'Tốt.'),
      teaching: buildLine(
        'Now take it one step further.',
        'Giờ tiến thêm một bước nữa.'
      ),
      nextStep: buildNextStep(prompt || options.nextPrompt),
    },
    {
      followUpMode: 'encourage',
      tags: ['challenge'],
    }
  );
}

export function controlledDrill(
  cue: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'firm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'drill',
      tone,
      opening:
        praise ||
        buildLine('Again, slowly and clearly.', 'Lại lần nữa, chậm và rõ nhé.'),
      teaching: buildLine(cue, cue),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'challenge',
      tags: ['drill'],
    }
  );
}

export function pronunciationNudge(
  cue: string,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  const tone = options.tone || 'calm';
  const praise = buildPraiseLine(options.specificPraise);

  return withMeta(
    {
      mode: 'drill',
      tone,
      opening: praise || buildLine('Listen first.', 'Nghe trước nhé.'),
      teaching: buildLine(cue, cue),
      nextStep: buildNextStep(options.nextPrompt),
    },
    {
      followUpMode: 'drill',
      tags: ['pronunciation', 'drill'],
    }
  );
}

/* -------------------------------------------------------------------------- */
/* Composite helpers                                                          */
/* -------------------------------------------------------------------------- */

export function buildCorrectionStrategy(
  style: CorrectionStyle,
  correction: CorrectionInput,
  options: StrategyOptions = {}
): TeachingStrategyResult {
  switch (style) {
    case 'contrastive':
      return contrastiveCorrection(correction, options);
    case 'direct':
      return directCorrection(correction, options);
    case 'gentle':
    default:
      return gentleCorrection(correction, options);
  }
}

export function buildTeachingStrategy(args: {
  mode: TeachingMode;
  tone?: StrategyTone;
  correction?: CorrectionInput;
  summary?: string;
  explanation?: string;
  example?: string;
  concept?: string;
  cue?: string;
  nextPrompt?: string;
  specificPraise?: string;
  learnerName?: string;
  workedExample?: string;
  repeatedMistake?: boolean;
  isSensitiveMoment?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
}): TeachingStrategyResult {
  const options: StrategyOptions = {
    tone: args.tone,
    nextPrompt: args.nextPrompt,
    specificPraise: args.specificPraise,
    learnerName: args.learnerName,
    concept: args.concept,
    example: args.example,
    workedExample: args.workedExample,
    repeatedMistake: args.repeatedMistake,
    isSensitiveMoment: args.isSensitiveMoment,
    wantsChallenge: args.wantsChallenge,
    wantsExplanation: args.wantsExplanation,
  };

  switch (args.mode) {
    case 'correct':
      return buildCorrectionStrategy(
        'gentle',
        args.correction || { mistake: '', fix: '' },
        options
      );

    case 'explain':
      if (args.workedExample && args.explanation) {
        return workedExample(args.explanation, args.workedExample, options);
      }

      if (
        args.example &&
        args.explanation &&
        (args.repeatedMistake || args.isSensitiveMoment || args.wantsExplanation)
      ) {
        return workedExample(args.explanation, args.example, options);
      }

      if (args.explanation && args.example) {
        return explainWithExample(args.explanation, args.example, options);
      }

      return explainRule(args.explanation || 'Here is the main rule.', options);

    case 'challenge':
      return oneStepChallenge(args.nextPrompt, options);

    case 'drill':
      return controlledDrill(args.cue || args.nextPrompt || 'Try it once more.', options);

    case 'recap':
      return microRecap(
        args.summary || 'You learned the key point clearly today.',
        options
      );

    case 'review':
      return conceptReview(args.concept || 'this concept', options);

    case 'encourage':
    default:
      if (args.specificPraise) {
        return praiseThenPush(args.specificPraise, args.nextPrompt, options);
      }
      return encourageMomentum(options);
  }
}

/* -------------------------------------------------------------------------- */
/* Renderer                                                                   */
/* -------------------------------------------------------------------------- */

export function renderTeachingStrategy(
  strategy: TeachingStrategyResult
): TeachingStrategyLine {
  return buildLine(
    joinLine([
      strategy.opening?.en,
      strategy.teaching?.en,
      strategy.nextStep?.en,
    ]),
    joinLine([
      strategy.opening?.vi,
      strategy.teaching?.vi,
      strategy.nextStep?.vi,
    ])
  );
}