import { afterAll, beforeAll, expect, test } from "vitest";
import { createServer as createNetServer } from "node:net";
import { TextEncoder as NodeTextEncoder } from "node:util";
import { chromium, type Page } from "@playwright/test";
import type { ViteDevServer } from "vite";

const routes = ["spanish", "french", "german", "italian", "russian", "punjabi", "swahili"];
let baseUrl = "";

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

async function findAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createNetServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === "object") {
          resolve(address.port);
        } else {
          reject(new Error("Unable to allocate an isolated Vite port"));
        }
      });
    });
  });
}

async function waitForViteReady(timeoutMs = 60000) {
  const started = Date.now();
  let lastError: unknown;

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Vite readiness returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Vite did not become ready at ${baseUrl}: ${String(lastError)}`);
}

beforeAll(async () => {
  process.env.VITE_SUPABASE_URL ??= "http://127.0.0.1:54321";
  process.env.VITE_SUPABASE_ANON_KEY ??= "test-anon-key";
  originalTextEncoder = globalThis.TextEncoder;
  originalUint8Array = globalThis.Uint8Array;
  globalThis.TextEncoder = NodeTextEncoder;
  globalThis.Uint8Array = new NodeTextEncoder().encode("").constructor as typeof globalThis.Uint8Array;

  const { createServer } = await import("vite");
  const port = await findAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;

  viteServer = await createServer({
    logLevel: "error",
    server: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
  });

  await viteServer.listen();
  await waitForViteReady();
}, 90000);

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
    const context = await browser.newContext({ viewport: { width: 1280, height: 1200 } });
    await context.addInitScript(() => {
      localStorage.setItem("mercyblade.nativeLang", "vi");
      localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
    });
    const page = await context.newPage();

    for (const native of routes) {
      await page.goto(`${baseUrl}/learn/${native}/english`, {
        // CI can stall before domcontentloaded on the cold Spanish route.
        // Commit proves navigation started; waitForRenderedPageText below proves app render.
        waitUntil: "commit",
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
