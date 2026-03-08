import { beforeEach, describe, expect, it } from 'vitest';
import { generateTeachingTurn } from '../mercyHost';
import { clearTeacherMemory } from '../teacherMemoryEngine';
import { clearLessonMemory } from '../lessonMemory';

describe('generateTeachingTurn voice snapshots', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    clearTeacherMemory();
    clearLessonMemory();
  });

  it('keeps correction voice calm, teacherly, and actionable', () => {
    const result = generateTeachingTurn({
      userId: 'voice-correction',
      userName: 'Lina',
      language: 'en',
      learnerText: 'maybe it is go to school yesterday',
      correction: {
        mistake: 'go to school yesterday',
        fix: 'Say "went to school yesterday"',
      },
      concept: 'past tense',
      isCorrectiveTurn: true,
      currentDifficulty: 'easy',
      nextPrompt: 'Try one sentence with "went".',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "correct",
        "text": "Lina, you're close. Small fix: Say "went to school yesterday" Try one sentence with "went".",
        "textAlt": "Nhẹ nhàng thôi, bạn gần đúng rồi. Sửa nhẹ: Say "went to school yesterday" Try one sentence with "went".",
        "tone": "calm",
      }
    `);
  });

  it('keeps frustrated explanation voice warm and steady', () => {
    const result = generateTeachingTurn({
      userId: 'voice-explain',
      userName: 'Minh',
      language: 'en',
      learnerText: "I don't get it. Why is this so hard?",
      explanation: 'Use "went" because "go" changes in the past tense.',
      concept: 'past tense',
      wantsExplanation: true,
      currentDifficulty: 'medium',
      nextPrompt: 'Now say: I went home early.',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "explain",
        "text": "Good — the structure is cleaner. Pause here. Use "went" because "go" changes in the past tense. Now say: I went home early.",
        "textAlt": "Good — the structure is cleaner. Pause here. Use "went" because "go" changes in the past tense. Bước tiếp theo: Now say: I went home early.",
        "tone": "warm",
      }
    `);
  });

  it('lets challenge voice feel playful without becoming silly', () => {
    const result = generateTeachingTurn({
      userId: 'voice-challenge',
      userName: 'Jay',
      language: 'en',
      learnerText: 'haha okay boss, give me a harder one',
      wantsChallenge: true,
      concept: 'conditionals',
      currentDifficulty: 'medium',
      nextPrompt: 'Translate: If I had known, I would have called.',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "challenge",
        "text": "Now take it one step further. Translate: If I had known, I would have called. Good. Now let us make the sentence earn its lunch.",
        "textAlt": "Giờ tiến thêm một bước nữa. Bước tiếp theo: Translate: If I had known, I would have called. Tốt. Giờ hãy làm cho câu này làm việc xứng đáng hơn.",
        "tone": "playful",
      }
    `);
  });

  it('keeps review voice patient and non-punitive', () => {
    const userId = 'voice-review-sequence';

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'I said goed',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Oops, goed again',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Still goed',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    const result = generateTeachingTurn({
      userId,
      userName: 'An',
      language: 'en',
      learnerText: 'I am back. Can we try again?',
      concept: 'past tense',
      currentDifficulty: 'medium',
      nextPrompt: 'Say one sentence about yesterday with "went".',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "review",
        "text": "Good. Let’s stay with this idea one more round. Focus on past tense. Try: I went there yesterday.",
        "textAlt": "Tốt. Mình ở lại với ý này thêm một vòng nữa nhé. Tập trung vào thì quá khứ. Try: I went there yesterday.",
        "tone": "calm",
      }
    `);
  });

  it('keeps recap voice clear and composed', () => {
    const result = generateTeachingTurn({
      userId: 'voice-recap',
      language: 'en',
      learnerText: 'Can you recap that for me?',
      wantsRecap: true,
      concept: 'present perfect',
      summary: 'Use it for past actions connected to the present.',
      currentDifficulty: 'medium',
      nextPrompt: 'Now make one sentence with have + past participle.',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "recap",
        "text": "Use it for past actions connected to the present. Now make one sentence with have + past participle.",
        "textAlt": "Use it for past actions connected to the present. Bước tiếp theo: Now make one sentence with have + past participle.",
        "tone": "calm",
      }
    `);
  });

  it('keeps drill voice brief, clean, and practical', () => {
    const result = generateTeachingTurn({
      userId: 'voice-drill',
      language: 'en',
      learnerText: 'Can we practice that sound again?',
      wantsDrill: true,
      concept: 'final t sound',
      currentDifficulty: 'easy',
      nextPrompt: 'Say: cat, hat, late.',
    });

    expect({
      mode: result.plan.teachingMode,
      tone: result.tone.tone,
      text: result.text,
      textAlt: result.textAlt,
    }).toMatchInlineSnapshot(`
      {
        "mode": "drill",
        "text": "Say: cat, hat, late. Say: cat, hat, late.",
        "textAlt": "Say: cat, hat, late. Bước tiếp theo: Say: cat, hat, late.",
        "tone": "calm",
      }
    `);
  });
});