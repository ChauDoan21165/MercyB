// src/components/mercy/AIDisclosureModal.tsx
//
// One-time disclosure modal that surfaces before a learner can send
// their first message to Teacher Mercy. Shipped in response to an
// Apple App Review rejection under Guideline 5.1.1 (user data sent
// to a third-party AI service must be disclosed up front).
//
// Acceptance is persisted in localStorage under
// AI_DISCLOSURE_STORAGE_KEY. The hosting component is responsible for
// (1) gating its message-send action on `accepted` and (2) rendering
// this modal when `accepted` is false. Keeping the persistence layer
// in the host (not here) means tests can pre-seed the flag with a
// single `localStorage.setItem` call and skip the modal entirely.

export const AI_DISCLOSURE_STORAGE_KEY = "mercy_ai_disclosure_accepted";

/**
 * Read the current acceptance state from localStorage. Defaults to
 * `false` (i.e. show the modal) when the storage API is unavailable
 * (SSR, private browsing, iOS WebView storage racing initial render,
 * jsdom in some configs).
 *
 * The earlier default-true behaviour silently *hid* the disclosure
 * whenever storage was uncertain — the opposite of the Apple 5.1.1
 * compliance goal. Apple reviewers run TestFlight on real devices
 * where WebView storage can fail during initial render; defaulting
 * to "accepted" would let the chat dispatch a first message without
 * ever showing the disclosure, which is exactly the rejection.
 *
 * Defaulting to `false` means: if storage truly never works for a
 * given user, they will see the modal every session. That's annoying
 * for the tiny minority who hit it, but it's the right side to err
 * on — Apple-review compliance requires *showing* the disclosure,
 * not hiding it.
 */
export function readAIDisclosureAccepted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AI_DISCLOSURE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Persist acceptance. Failures (private mode, quota) are swallowed —
 * we'll still flip in-memory state in the host so the user isn't
 * shown the modal repeatedly within the same session.
 */
export function writeAIDisclosureAccepted(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AI_DISCLOSURE_STORAGE_KEY, "1");
  } catch {
    /* swallow */
  }
}

export type AIDisclosureModalProps = {
  /** Fires when the learner taps the "I understand" button. */
  onAccept: () => void;
};

export function AIDisclosureModal({ onAccept }: AIDisclosureModalProps) {
  return (
    <div
      data-testid="mercy-ai-disclosure"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mercy-ai-disclosure-title"
      aria-describedby="mercy-ai-disclosure-body"
      // Mobile-first: bottom sheet on phones (items-end), centered on tablet+.
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-6"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:p-6">
        <h2
          id="mercy-ai-disclosure-title"
          className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-100"
        >
          Giáo viên Mercy dùng AI
          <span className="mt-1 block text-sm font-normal text-slate-500 dark:text-slate-400">
            Teacher Mercy uses AI
          </span>
        </h2>

        <div id="mercy-ai-disclosure-body" className="mt-3 space-y-2">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            Tin nhắn của bạn được xử lý bởi AI để tạo phản hồi. Nội dung không được lưu trữ lâu dài.
          </p>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Your messages are processed by AI to generate responses. Content is not stored long-term.
          </p>
        </div>

        <button
          type="button"
          onClick={onAccept}
          data-testid="mercy-ai-disclosure-accept"
          // autoFocus draws the on-screen ring to the only action;
          // satisfies a11y "first-focus on actionable element" pattern
          // for modal dialogs.
          autoFocus
          className="mt-5 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          Tôi hiểu · I understand
        </button>
      </div>
    </div>
  );
}

export default AIDisclosureModal;
