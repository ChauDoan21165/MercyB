import { expect, test } from "vitest";
import { chromium } from "playwright";

const routes = ["spanish", "french", "german", "italian", "russian", "punjabi", "swahili"];

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

test("non-Vietnamese /learn/{native}/english routes never fall back to Vietnamese UI", async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

    for (const native of routes) {
      await page.goto("http://127.0.0.1:3107/", { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(() => {
        localStorage.setItem("mercyblade.nativeLang", "vi");
        localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
      });

      await page.goto(`http://127.0.0.1:3107/learn/${native}/english`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");

      for (const marker of forbiddenVietnameseMarkers) {
        expect(text, `${native} leaked Vietnamese marker: ${marker}`).not.toContain(marker);
      }
    }
  } finally {
    await browser.close();
  }
}, 90000);
