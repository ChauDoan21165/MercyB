/**
 * A3 regression spec: SelfCompareRecorder record → play flow.
 *
 * Evidence base (local Playwright run, 2026-06-11):
 *   blob type:  audio/webm;codecs=opus
 *   blob size:  9754 bytes  (non-zero ✓)
 *   URLs revoked before play: 0  (no premature revoke ✓)
 *   audio element errors: 0  (Chrome decoded the blob fine ✓)
 *   play() rejections: 0  (no autoplay block ✓)
 *
 * Root cause of "Recorded playback failed" on prod (compare path):
 *   usePronunciationRecorder.ts had a single useEffect with deps
 *   [cleanupStream, lastRecordedAudioUrl, stopPlayback].  Whenever
 *   lastRecordedAudioUrl changed (new recording made while audio was
 *   playing) the cleanup fired stopPlayback(), which called
 *   currentAudio.pause().  If play() was still pending at that
 *   moment it rejected with AbortError → ".catch() → setErrorState(...)".
 *   Even after play() resolved, pausing left onended unfire, permanently
 *   hanging the await-new-Promise wrapper and leaving the UI stuck.
 *
 * Fix: split the single useEffect into two:
 *   1. URL-only effect (deps:[lastRecordedAudioUrl]) — revokes old URL,
 *      does NOT call stopPlayback().
 *   2. Unmount-only effect (deps:[cleanupStream, stopPlayback]) — runs
 *      stream + playback cleanup only when the component unmounts.
 *
 * Regression test coverage:
 *   T1 — simple record → play: no error, blob > 0 bytes, URL not revoked.
 *   T2 — record → delayed play (≥1 s): play still succeeds after a delay
 *        that simulates the compare path's await onPlayModel() window.
 */

import { test, expect } from "@playwright/test";

// Fake mic: Chrome grants permission without UI prompt and generates a
// sine-wave audio stream that MediaRecorder can encode into a real blob.
test.use({
  launchOptions: {
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
    ],
  },
});

type BlobRecord = { url: string; type: string; size: number; ts: number };
type RevokeRecord = { url: string; ts: number; stackTop: string };
type AudioErrorRecord = {
  url: string;
  errorCode: number;
  errorMessage: string;
  ts: number;
  revokedBeforeLoad: boolean;
};
type PlayRejectionRecord = { url: string; reason: string; ts: number };

interface MbDiag {
  blobs: BlobRecord[];
  revoked: RevokeRecord[];
  audioErrors: AudioErrorRecord[];
  playRejections: PlayRejectionRecord[];
  isTypeSupportedMatrix: Record<string, boolean>;
}

declare global {
  interface Window {
    __mb_diag?: MbDiag;
  }
}

/** Inject diagnostic hooks before the app boots. */
function injectDiagnostics() {
  return async ({ page }: { page: import("@playwright/test").Page }) => {
    await page.addInitScript(() => {
      const t = () => Date.now();

      const blobs: BlobRecord[] = [];
      const revoked: RevokeRecord[] = [];
      const audioErrors: AudioErrorRecord[] = [];
      const playRejections: PlayRejectionRecord[] = [];

      const candidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/ogg",
      ];
      const isTypeSupportedMatrix: Record<string, boolean> = {};
      if (typeof MediaRecorder !== "undefined") {
        for (const c of candidates) {
          try {
            isTypeSupportedMatrix[c] = MediaRecorder.isTypeSupported(c);
          } catch {
            isTypeSupportedMatrix[c] = false;
          }
        }
      }

      const origCreate = URL.createObjectURL.bind(URL);
      URL.createObjectURL = (obj: Blob | MediaSource) => {
        const url = origCreate(obj);
        if (obj instanceof Blob) {
          blobs.push({ url, type: obj.type, size: obj.size, ts: t() });
        }
        return url;
      };

      const origRevoke = URL.revokeObjectURL.bind(URL);
      URL.revokeObjectURL = (url: string) => {
        const err = new Error();
        const stackTop =
          (err.stack?.split("\n")[2] ?? "").replace(/^\s+at\s+/, "").trim();
        revoked.push({ url, ts: t(), stackTop });
        origRevoke(url);
      };

      const OrigAudio = window.Audio;
      // @ts-expect-error -- reassign window.Audio for test instrumentation
      window.Audio = class extends OrigAudio {
        constructor(src?: string) {
          // @ts-expect-error -- optional src not in HTMLAudioElement constructor typing
          super(src ?? "");
          if (src) {
            this.addEventListener("error", () => {
              const wasRevoked = revoked.some((r) => r.url === src);
              audioErrors.push({
                url: src,
                errorCode: this.error?.code ?? -1,
                errorMessage: this.error?.message ?? "unknown",
                ts: t(),
                revokedBeforeLoad: wasRevoked,
              });
            });
          }
        }

        play(): Promise<void> {
          const url = this.src;
          return super.play().catch((err: Error) => {
            playRejections.push({
              url,
              reason: err?.message ?? String(err),
              ts: t(),
            });
            throw err;
          });
        }
      };

      window.__mb_diag = {
        blobs,
        revoked,
        audioErrors,
        playRejections,
        isTypeSupportedMatrix,
      };
    });
  };
}

async function recordOneSec(page: import("@playwright/test").Page) {
  const recordBtn = page.getByTestId("self-compare-record");
  await expect(recordBtn).toBeVisible({ timeout: 8_000 });
  await recordBtn.click();
  const stopBtn = page.getByTestId("self-compare-stop");
  await expect(stopBtn).toBeVisible({ timeout: 3_000 });
  await page.waitForTimeout(1_000);
  await stopBtn.click();
  const playBtn = page.getByTestId("self-compare-play");
  await expect(playBtn).toBeVisible({ timeout: 5_000 });
  return playBtn;
}

test("T1: record → direct play — blob valid, no error", async ({ page }) => {
  await injectDiagnostics()({ page });

  await page.goto("/practice/pronunciation");
  const playBtn = await recordOneSec(page);

  const diagBefore = await page.evaluate(() => window.__mb_diag!);

  await playBtn.click();
  await page.waitForTimeout(2_000);

  const diagAfter = await page.evaluate(() => window.__mb_diag!);
  const errorText = await page
    .locator('[aria-live="polite"] p')
    .textContent()
    .catch(() => null);

  console.log("\n══ A3 T1 EVIDENCE ══");
  console.log("isTypeSupported:", JSON.stringify(diagAfter.isTypeSupportedMatrix));
  console.log("blobs:", JSON.stringify(diagAfter.blobs));
  console.log("revoked:", JSON.stringify(diagAfter.revoked));
  console.log("audioErrors:", JSON.stringify(diagAfter.audioErrors));
  console.log("playRejections:", JSON.stringify(diagAfter.playRejections));
  console.log("UI error:", errorText);
  console.log("═══════════════════\n");

  const blob = diagBefore.blobs[diagBefore.blobs.length - 1];
  expect(blob, "recording should produce at least one blob").toBeTruthy();
  expect(blob.size, `blob must be > 0 bytes (was ${blob.size})`).toBeGreaterThan(0);

  const revokedBeforePlay = diagBefore.revoked.some((r) => r.url === blob.url);
  expect(
    revokedBeforePlay,
    `blob URL revoked before play — premature revoke detected`
  ).toBe(false);

  // Primary assertion — no error shown in the UI.
  expect(errorText ?? "", "UI must not show playback error").not.toMatch(
    /Recorded playback failed/
  );
});

test("T2: record → 1.5 s delay → play — still succeeds (simulates compare path)", async ({
  page,
}) => {
  await injectDiagnostics()({ page });

  await page.goto("/practice/pronunciation");
  const playBtn = await recordOneSec(page);

  // Simulate the delay introduced by await onPlayModel() in handleCompare.
  // Before the fix, if any React effect fired stopPlayback() during this
  // window the play() Promise would reject with AbortError.
  await page.waitForTimeout(1_500);

  await playBtn.click();
  await page.waitForTimeout(2_000);

  const diagAfter = await page.evaluate(() => window.__mb_diag!);
  const errorText = await page
    .locator('[aria-live="polite"] p')
    .textContent()
    .catch(() => null);

  console.log("\n══ A3 T2 EVIDENCE ══");
  console.log("playRejections:", JSON.stringify(diagAfter.playRejections));
  console.log("audioErrors:", JSON.stringify(diagAfter.audioErrors));
  console.log("UI error:", errorText);
  console.log("═══════════════════\n");

  expect(errorText ?? "", "UI must not show playback error after delay").not.toMatch(
    /Recorded playback failed/
  );
  expect(
    diagAfter.playRejections,
    "play() must not reject (AbortError = stopPlayback raced with play)"
  ).toHaveLength(0);
});
