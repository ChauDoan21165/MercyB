import { afterAll, beforeAll, expect, test } from "vitest";
import { TextEncoder as NodeTextEncoder } from "node:util";
import { chromium, type Page } from "@playwright/test";
import type { ViteDevServer } from "vite";

const routes = ["spanish", "french", "german", "italian", "russian", "punjabi", "swahili"];
const port = 3107;
const baseUrl = `http://127.0.0.1:${port}`;

let viteServer: ViteDevServer | null = null;
let originalTextEncoder: typeof globalThis.TextEncoder | undefined;
let originalUint8Array: typeof globalThis.Uint8Array | undefined;

const forbiddenVietnameseMarkers = [
  "Mở AI Tutor",
  "Mercy sẽ nhớ",
  "Kiểm tra trình độ",
  "Thử một từ",
  "không cần đăng nhập",
  "Nhận điểm phát âm",
  "Luyện TOEIC",
  "Biết bắt đầu từ đâu",
  "Chiến lược riêng",
  "người Việt",
  "của bạn",
];

async function waitForRenderedPageText(page: Page) {
  await page.waitForFunction(
    () => document.body.innerText.replace(/\s+/g, " ").trim().length > 500,
    undefined,
    { timeout: 60000 },
  );
}

async function hasRunningServer() {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
}

beforeAll(async () => {
  if (await hasRunningServer()) {
    return;
  }

  process.env.VITE_SUPABASE_URL ??= "http://127.0.0.1:54321";
  process.env.VITE_SUPABASE_ANON_KEY ??= "test-anon-key";
  originalTextEncoder = globalThis.TextEncoder;
  originalUint8Array = globalThis.Uint8Array;
  globalThis.TextEncoder = NodeTextEncoder;
  globalThis.Uint8Array = new NodeTextEncoder().encode("").constructor as typeof globalThis.Uint8Array;

  const { createServer } = await import("vite");

  viteServer = await createServer({
    logLevel: "error",
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
  });

  await viteServer.listen();
}, 30000);

afterAll(async () => {
  await viteServer?.close();
  viteServer = null;

  if (originalTextEncoder) {
    globalThis.TextEncoder = originalTextEncoder;
    originalTextEncoder = undefined;
  }

  if (originalUint8Array) {
    globalThis.Uint8Array = originalUint8Array;
    originalUint8Array = undefined;
  }
});

test("non-Vietnamese /learn/{native}/english routes never fall back to Vietnamese UI", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

    for (const native of routes) {
      await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.evaluate(() => {
        localStorage.setItem("mercyblade.nativeLang", "vi");
        localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
      });

      await page.goto(`${baseUrl}/learn/${native}/english`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      await waitForRenderedPageText(page);
      const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      expect(text.length, `${native} route rendered enough product copy`).toBeGreaterThan(500);

      for (const marker of forbiddenVietnameseMarkers) {
        expect(text, `${native} leaked Vietnamese marker: ${marker}`).not.toContain(marker);
      }
    }
  } finally {
    await browser.close();
  }
}, 90000);
