# AiTutor Stale-Session Guard Wiring Spec

Context: MR !926 is still open and edits `src/pages/AiTutor.tsx`, so this branch intentionally leaves that file untouched.

After !926 merges, wire the pure guard as follows:

1. Import from `src/lib/ai-tutor/staleSessionGuard`:
   - `useAiTutorStaleSessionGuard`
2. Import `AiTutorStaleSessionNotice` from `src/lib/ai-tutor/AiTutorStaleSessionNotice`.
3. In `AiTutor`, create the hook near the other submit-state hooks:
   - `const staleSessionGuard = useAiTutorStaleSessionGuard();`
4. At the very start of `handleSubmit`, before clearing result/loading state or running correction logic:
   - `if (!(await staleSessionGuard.guardBeforeSubmit())) return;`
5. Render the notice above the correction input/result surface:
   - `{staleSessionGuard.notice ? <AiTutorStaleSessionNotice onReload={staleSessionGuard.reloadLatest} /> : null}`
6. Optionally disable the submit button while `staleSessionGuard.checking` is true.

Expected behavior:

- When `import.meta.env.VITE_MERCYB_BUILD_HASH` matches the fresh `/version.json` hash, behavior is unchanged.
- If fetching `/version.json` fails, returns a non-OK response, has invalid JSON, or lacks a hash, correction proceeds.
- If the hashes differ, `handleSubmit` returns before correction and the user sees:
  `Có phiên bản mới — tải lại trang để dùng bản mới nhất`
  with a `Tải lại trang` button.
