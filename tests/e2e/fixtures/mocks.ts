/**
 * Browser-side stubs for APIs that are flaky or forbidden in a test
 * environment:
 *
 *   - SpeechRecognition / webkitSpeechRecognition — always resolves with
 *     a caller-provided transcript after ~50 ms. Injected via
 *     page.addInitScript so it's in place before any app code runs.
 *   - speechSynthesis.speak — no-op (never actually plays audio).
 *   - OpenAI / Stripe outbound calls — routed to empty 200 responses so
 *     specs never touch billing or live LLM APIs.
 *
 * Usage (typical):
 *
 *   test.beforeEach(async ({ page }) => {
 *     await installWebSpeechStubs(page, { transcript: "she studies english" });
 *     await blockExternalServices(page);
 *   });
 */

import type { Page } from "@playwright/test";

export type WebSpeechStubOptions = {
  /** The transcript the stub recognizer returns. */
  transcript: string;
  /** Simulated recognition delay (ms). Default 50. */
  delayMs?: number;
  /** Simulated confidence (0..1). Default 0.95. */
  confidence?: number;
};

/**
 * Installs a deterministic SpeechRecognition stub + a speechSynthesis no-op
 * into every page frame. Must be called BEFORE navigating to the app (uses
 * page.addInitScript internally).
 */
export async function installWebSpeechStubs(
  page: Page,
  options: WebSpeechStubOptions,
): Promise<void> {
  const { transcript, delayMs = 50, confidence = 0.95 } = options;

  await page.addInitScript(
    ({ transcript, delayMs, confidence }) => {
      type StubListener = (event: unknown) => void;

      class FakeSpeechRecognition {
        public continuous = false;
        public interimResults = false;
        public lang = "en-US";
        public onresult: StubListener | null = null;
        public onerror: StubListener | null = null;
        public onend: StubListener | null = null;
        public onstart: StubListener | null = null;
        private _timer: ReturnType<typeof setTimeout> | null = null;

        start() {
          this.onstart?.({ type: "start" });
          this._timer = setTimeout(() => {
            const result = {
              isFinal: true,
              0: { transcript, confidence },
              length: 1,
              item() {
                return this[0];
              },
            };
            const resultsList = {
              0: result,
              length: 1,
              item() {
                return this[0];
              },
            };
            this.onresult?.({
              results: resultsList,
              resultIndex: 0,
              type: "result",
            });
            this.onend?.({ type: "end" });
          }, delayMs);
        }

        stop() {
          if (this._timer) clearTimeout(this._timer);
          this.onend?.({ type: "end" });
        }

        abort() {
          if (this._timer) clearTimeout(this._timer);
          this.onend?.({ type: "end" });
        }
      }

      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition =
        FakeSpeechRecognition;
      (
        window as unknown as { webkitSpeechRecognition: unknown }
      ).webkitSpeechRecognition = FakeSpeechRecognition;

      // speechSynthesis.speak → silent no-op that still fires onend so
      // code paths waiting for the utterance to finish don't hang.
      const noopSpeak = function (this: unknown, utterance: unknown) {
        const u = utterance as { onend?: StubListener } | null;
        setTimeout(() => u?.onend?.({ type: "end" }), 10);
      } as unknown as typeof speechSynthesis.speak;
      if (typeof window.speechSynthesis !== "undefined") {
        Object.defineProperty(window.speechSynthesis, "speak", {
          configurable: true,
          value: noopSpeak,
        });
      }
    },
    { transcript, delayMs, confidence },
  );
}

/**
 * Blocks outbound network requests to paid / third-party services so a
 * runaway spec can never spend money or hit a live LLM.
 *
 * Replaces the response with a boring 200 containing an empty JSON body.
 * For Stripe specifically we don't want redirects, so a 200 is safer
 * than a 204.
 */
export async function blockExternalServices(page: Page): Promise<void> {
  await page.route(
    (url) => {
      const href = url.toString();
      return (
        href.includes("api.openai.com") ||
        href.includes("api.anthropic.com") ||
        href.includes("api.stripe.com") ||
        href.includes("checkout.stripe.com") ||
        href.includes("js.stripe.com")
      );
    },
    (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ stubbed: true, reason: "external-blocked" }),
      }),
  );
}
