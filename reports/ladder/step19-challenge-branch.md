# Ladder Step 19: Challenge Branch

## Change

The conversation retention selector now has a real `challenge` branch in addition to the existing warmth/encouragement paths.

The tutor chooses challenge without learner prompting only when current learner evidence supports it:

- current turn is not the first turn;
- current turn has zero detected errors;
- topic mastery includes at least one topic at `80%` or higher;
- recent mastery interactions contain at least two correct/incorrect outcomes;
- recent error rate is `20%` or lower.

If any gate is missing, the selector falls back to the existing warmth path. Repair copy still takes priority when the current turn has errors, so challenge evidence cannot weaken the low-shame correction path.

## Learner-Facing Copy

Challenge copy is VN-first and asks for a harder response:

- VI: `Bạn đang vững phần này rồi. Thử trả lời dài hơn: thêm một lý do và một chi tiết cụ thể.`
- EN: `You look steady here. Try a harder answer: add one reason and one specific detail.`

## Tests

Focused verification:

```text
npx vitest run src/lib/retention/__tests__/conversationHooks.test.ts src/lib/tutor/__tests__/conversationTelemetry.test.ts src/components/ai-tutor/conversation/__tests__/AiConversationScenarioPanel.telemetry.test.tsx
```

Result: `3` test files passed, `28` tests passed.

Typecheck:

```text
npm run typecheck:app
```

Result: passed.

Coverage added:

- selector chooses `challenge` from high mastery and low recent error evidence;
- repair warmth still wins when current turn has an error;
- selector does not challenge below the mastery gate;
- telemetry passes mastery evidence into the encourage-vs-challenge selector;
- existing panel telemetry rendering tests remain green, proving learner-facing encouragement copy still renders.
