# Placement v3 UI Polish Iterations

Date: 2026-05-20

## Iteration 1 — Long Bilingual CTAs On Mobile

Noticed: `Start placement test · Bắt đầu đánh giá` can run long in a 375 px full-width button.

Changed: kept the primary CTA full width and rounded, with normal wrapping allowed by the shadcn button instead of fixed-height text containers.

## Iteration 2 — Results Page Was Too Dense In One Column

Noticed: overall CEFR, skills, flags, gaps, and recommendations in one long stream made the top lesson hard to find.

Changed: desktop uses a two-column layout with diagnostics on the left and recommendations/actions on the right. Mobile stays single-column.

## Iteration 3 — Speaking Permission Failure Needed A Real Path

Noticed: a denied microphone state would otherwise strand the learner on the speaking task.

Changed: speaking always includes a transcript/typed-answer textarea. When permission is denied, the record button disables and the typed fallback remains submit-capable.

## Iteration 4 — Progress Needed Modality Context

Noticed: "Task 2 of 5" alone is ambiguous when moving from writing to speaking.

Changed: the progress strip announces the active modality in EN/VI and adds a five-segment visual rail.

## Iteration 5 — Retry Needed To Stay Near The Failure

Noticed: submit failures hidden in hook state would not give a clear next action.

Changed: `TestPage` renders an inline `role="alert"` under the task with "Retry submit / Gửi lại" and a short bilingual recovery note.

## Iteration 6 — Reading Translation Toggle Was Too Verbose

Noticed: full "Show Vietnamese / Hiện tiếng Việt" labels compete with the passage header on narrow screens.

Changed: v3 reading uses compact "Show VI" / "Hide VI" controls while the passage heading remains bilingual.

## Iteration 7 — Modals Needed Primary Action First

Noticed: skip/abandon choices can accidentally discard work if the destructive action is too prominent.

Changed: "Keep testing / Tiếp tục" is primary and auto-focused; abandon/skip uses outline styling.
