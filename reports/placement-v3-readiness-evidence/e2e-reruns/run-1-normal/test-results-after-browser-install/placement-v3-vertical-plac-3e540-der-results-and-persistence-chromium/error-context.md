# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: placement-v3-vertical.spec.ts >> placement v3 end-to-end vertical >> runs UI client, session orchestrator, graders, recommender, results, and persistence
- Location: tests/e2e/placement-v3-vertical.spec.ts:34:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/Let's find where you should start/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/Let's find where you should start/i)

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic "Mercy global hero band" [ref=e4]:
      - generic [ref=e5]:
        - button "Go Back" [ref=e7] [cursor=pointer]: ← Back
        - link "Mercy Blade" [ref=e8] [cursor=pointer]:
          - /url: /
          - generic [ref=e9]:
            - img "Mercy Blade"
        - generic [ref=e10]:
          - group "Ngôn ngữ giải thích / Explanation language" [ref=e11]:
            - button "VI" [pressed] [ref=e12] [cursor=pointer]
            - button "EN" [ref=e13] [cursor=pointer]
          - link "Account" [ref=e14] [cursor=pointer]:
            - /url: /account
    - generic [ref=e16]:
      - generic "Study streak quick view" [ref=e17]:
        - link "Level 1, 0 XP. Mở trang XP." [ref=e19] [cursor=pointer]:
          - /url: /xp
          - generic [ref=e20]: Lv 1
          - generic [ref=e21]: ·
          - generic [ref=e22]: 0 XP
      - generic [ref=e24]:
        - region "Homepage hero" [ref=e25]:
          - heading "Small Steps. Real Progress." [level=1] [ref=e26]:
            - text: Small Steps.
            - generic [ref=e27]: Real Progress.
          - generic [ref=e28]: English for real life.
          - generic [ref=e29]: See your pronunciation score in 12 seconds — no signup.
          - generic [ref=e30]: Xem điểm phát âm của bạn trong 12 giây — không cần đăng nhập.
        - region "Homepage choices" [ref=e31]:
          - button "Open Teacher Mercy" [ref=e34] [cursor=pointer]:
            - img "Teacher Mercy" [ref=e37]
            - generic [ref=e38]: Teacher Mercy
            - generic [ref=e39]: Giáo viên Mercy
            - generic [ref=e40]: Hỏi — Mercy trả lời. Sửa lỗi — Mercy giải thích. Tiến bộ mỗi ngày.
            - generic [ref=e41]: Ask. Get corrected. Understand why. Improve daily.
            - generic [ref=e42]: Open Teacher Mercy →
          - button "Try one word — no signup needed" [ref=e43] [cursor=pointer]:
            - generic [ref=e44]:
              - img [ref=e46]
              - generic [ref=e49]:
                - generic [ref=e50]: Try one word — no signup
                - generic [ref=e51]: Thử phát âm — không cần đăng nhập
                - generic [ref=e52]: Hear how MercyBlade scores your pronunciation in 12 seconds.
                - generic [ref=e53]: Nhận điểm phát âm từ MercyBlade chỉ trong 12 giây.
              - img [ref=e55]
          - button "IELTS Speaking content pack" [ref=e57] [cursor=pointer]:
            - generic [ref=e58]:
              - img [ref=e60]
              - generic [ref=e63]:
                - generic [ref=e64]: IELTS Speaking
                - generic [ref=e65]: Band 5 → Band 7
                - generic [ref=e66]: Biết band hiện tại. Biết chính xác cách nâng lên.
                - generic [ref=e67]: Chiến lược riêng cho người Việt, từ vựng theo band, bài mẫu band 5 + band 7.
              - img [ref=e69]
          - button "TOEIC practice pack" [ref=e71] [cursor=pointer]:
            - generic [ref=e72]:
              - img [ref=e74]
              - generic [ref=e77]:
                - generic [ref=e78]: Luyện TOEIC
                - generic [ref=e79]: TOEIC 450 → 750+
                - generic [ref=e80]: Luyện đúng định dạng. Hiểu sâu nhờ giải thích tiếng Việt.
                - generic [ref=e81]: Official format, Vietnamese explanations — built for the score you need.
              - img [ref=e83]
          - button "VSTEP — Vietnamese national English exam prep" [ref=e85] [cursor=pointer]:
            - generic [ref=e86]:
              - img [ref=e88]
              - generic [ref=e91]:
                - generic [ref=e92]: Chinh phục B2 VSTEP
                - generic [ref=e93]: VSTEP — Kỳ thi năng lực ngoại ngữ Việt Nam
                - generic [ref=e94]: Học đúng định dạng Bộ Giáo dục. Đạt chuẩn đầu ra.
                - generic [ref=e95]: Speaking B1 + B2, 30 chủ đề, mẹo riêng cho người Việt.
              - img [ref=e97]
          - button "Library" [ref=e99] [cursor=pointer]:
            - generic [ref=e100]:
              - img [ref=e102]
              - generic [ref=e105]:
                - generic [ref=e106]: Library
                - generic [ref=e107]: Thư viện
                - generic [ref=e108]: Đọc. Nghe. Suy ngẫm. Tiến bộ từng ngày.
                - generic [ref=e109]: Read, listen, reflect — build a real English habit.
              - img [ref=e111]
          - button "Explore other languages" [ref=e113] [cursor=pointer]:
            - generic [ref=e114]:
              - generic [ref=e115]: Khám phá ngôn ngữ khác
              - generic [ref=e116]: Hàn · Nhật · Trung · Pháp · Đức · Tây Ban Nha…
            - generic [ref=e117]: →
        - button "Open Mercy Guide" [ref=e118] [cursor=pointer]:
          - img "Teacher Mercy" [ref=e121]
          - generic [ref=e122]: Teacher Mercy
      - generic "Bottom music dock":
        - generic [ref=e123]:
          - generic [ref=e124]:
            - button "Toggle favourites filter" [ref=e125] [cursor=pointer]:
              - img [ref=e126]
            - button "Play" [ref=e128] [cursor=pointer]:
              - img [ref=e129]
            - combobox "Select track" [ref=e131]:
              - option "In A Quiet Room I Open My Mind" [selected]
              - option "In A Quiet Room I Open My Mind (2)"
              - option "When Mercy Looks at Me"
              - option "When Mercy Looks at Me (1)"
              - option "When Mercy Looks at Me (2)"
              - option "When Mercy Looks at Me (3)"
              - option "Heart of the Blade"
              - option "Heart of the Blade (1)"
              - option "Heart of the Blade (2)"
              - option "Rise With Mercy"
              - option "Where Mercy Finds Me"
              - option "Where Mercy Finds Me (1)"
              - option "Where Mercy Finds Me (2)"
              - option "Where Mercy Finds Me (3)"
              - option "Where Mercy Finds Me (4)"
              - option "Where Mercy Finds Me (4 v2)"
              - option "Where Mercy Finds Me (5)"
              - option "Where Mercy Finds Me (6)"
              - option "Mercy On My Mind"
              - option "Mercy On My Mind (1)"
              - option "Mercy On My Mind (2)"
              - option "Mercy On My Mind (3)"
              - option "In the Quiet Mercy"
              - option "In the Quiet Mercy (2)"
              - option "Step With Me Mercy"
              - option "Step With Me Mercy (2)"
              - option "In A Quiet Room I Open My Mind (3)"
              - option "Bridge of Hearts"
              - option "Say My Name, Mercy Blade (core)"
              - option "Say My Name, Mercy Blade (1)"
              - option "Morning With You / Buổi Sáng Cùng Ngài (2)"
              - option "The Song of Mercy Blade (2)"
              - option "The Song of Mercy Blade (3)"
              - option "Tâm Hồn Tự Tại / A Mind at Peace"
              - option "Ánh Sáng Trong Vòng Tay Cha (1)"
              - option "Dấu Ấn Trong Tôi / The Prints Within (1)"
              - option "Sự Sắp Đặt Thiêng Liêng"
          - generic [ref=e132]:
            - slider "Seek" [ref=e133]: "0"
            - generic [ref=e134]:
              - text: 0:00
              - generic [ref=e135]: / 0:00
          - button "Favourite this track" [ref=e136] [cursor=pointer]:
            - img [ref=e137]
          - generic [ref=e139]:
            - generic [ref=e140]:
              - img [ref=e141]
              - slider "Volume" [ref=e145]: "60"
            - generic [ref=e147]:
              - img [ref=e148]
              - slider "Zoom" [ref=e151]: "100"
              - generic [ref=e152]: 100%
  - button "Mở khung báo lỗi" [ref=e153] [cursor=pointer]: 💬 Báo lỗi
```

# Test source

```ts
  1   | import { expect, type Page } from "@playwright/test";
  2   | import { test } from "./fixtures/test";
  3   | import { BASE_URL } from "./fixtures/env";
  4   | import { handleAction, type CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
  5   | import { createHttpWritingGrader } from "../../supabase/functions/placement-v3-session/graderClient.ts";
  6   | import { makeSession, recommendLessons } from "../../supabase/functions/placement-v3-session/persistence.ts";
  7   | import type {
  8   |   GraderInput,
  9   |   OrchestratorResponse,
  10  |   PlacementV3Profile,
  11  |   PlacementV3Request,
  12  |   PlacementV3Response,
  13  |   PlacementV3Session,
  14  |   Recommendation,
  15  | } from "../../supabase/functions/placement-v3-session/types.ts";
  16  | import { gradeWritingSample } from "../../supabase/functions/placement-v3-grade-writing/core.ts";
  17  | import { CEFRSubskill } from "../../supabase/functions/_shared/cefr/types.ts";
  18  | import { gradeConversation } from "../../supabase/functions/placement-v3-mercy-conversation/conversationGrader.ts";
  19  | 
  20  | const TEST_USER_ID = "00000000-0000-4000-8000-000000000033";
  21  | const TEST_TOKEN = "placement-v3-e2e-token";
  22  | const LONG_PLACEMENT_ANSWER =
  23  |   "I use English at work when I write emails, explain problems, and speak with customers from other countries. Yesterday I practiced after work at a coffee shop near my office. I still make mistakes with articles, verb tense, and final sounds, but I can explain my goal clearly, give examples, and keep answering follow-up questions with enough detail.";
  24  | 
  25  | type Stored = {
  26  |   sessions: Map<string, PlacementV3Session>;
  27  |   responses: Map<string, PlacementV3Response[]>;
  28  |   profiles: Map<string, PlacementV3Profile>;
  29  |   graderCalls: string[];
  30  |   recommenderCalls: number;
  31  | };
  32  | 
  33  | test.describe("placement v3 end-to-end vertical", () => {
  34  |   test("runs UI client, session orchestrator, graders, recommender, results, and persistence", async ({ page }) => {
  35  |     const stored = createStored();
  36  |     await seedAuthenticatedSession(page);
  37  |     await installAuthRoutes(page);
  38  |     await installOrchestratorRoute(page, stored);
  39  | 
  40  |     await page.goto(`${BASE_URL}/placement`);
> 41  |     await expect(page.getByText(/Let's find where you should start/i)).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  42  |     await page.getByRole("button", { name: /Start placement test/i }).click();
  43  |     await page.getByRole("button", { name: /adult learner/i }).click();
  44  |     await page.waitForURL(/\/placement\/test\//);
  45  |     await expect(page.getByLabel(/Writing answer/i)).toBeVisible();
  46  | 
  47  |     for (let i = 0; i < 11; i += 1) {
  48  |       if (await page.getByText(/Overall level/i).isVisible().catch(() => false)) break;
  49  |       await answerCurrentTask(page);
  50  |       const submit = page.getByRole("button", { name: /Submit answer/i });
  51  |       await expect(submit).toBeEnabled();
  52  |       await submit.click();
  53  |       await page.waitForTimeout(350);
  54  |     }
  55  | 
  56  |     await expect(page.getByText(/Overall level/i)).toBeVisible();
  57  |     await expect(page.getByText(/^Writing$/i).first()).toBeVisible();
  58  |     await expect(page.getByText(/^Speaking$/i).first()).toBeVisible();
  59  |     await expect(page.getByText(/^Reading$/i).first()).toBeVisible();
  60  |     await expect(page.getByText(/^Listening$/i).first()).toBeVisible();
  61  |     await expect(page.getByText(/^Conversation$/i).first()).toBeVisible();
  62  |     await expect(page.getByRole("button", { name: /Start this lesson/i }).first()).toBeVisible();
  63  | 
  64  |     const [session] = [...stored.sessions.values()];
  65  |     expect(session.flow_state).toBe("completed");
  66  |     expect(stored.responses.get(session.id)?.length).toBeGreaterThanOrEqual(5);
  67  |     expect(stored.profiles.get(session.id)?.recommended_lessons.length).toBeGreaterThan(0);
  68  |     expect(stored.graderCalls).toContain("placement-v3-grade-writing");
  69  |     expect(stored.graderCalls).toContain("placement-v3-mercy-conversation");
  70  |     expect(stored.recommenderCalls).toBeGreaterThan(0);
  71  |   });
  72  | });
  73  | 
  74  | async function seedAuthenticatedSession(page: Page) {
  75  |   const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "https://placeholder.invalid.supabase.co";
  76  |   const projectId = deriveProjectId(supabaseUrl);
  77  |   const storageKey = `mb-supabase-auth-${projectId}`;
  78  |   const now = Math.floor(Date.now() / 1000);
  79  |   await page.addInitScript(
  80  |     ({ storageKey, now }) => {
  81  |       window.localStorage.setItem(
  82  |         storageKey,
  83  |         JSON.stringify({
  84  |           access_token: "placement-v3-e2e-token",
  85  |           refresh_token: "placement-v3-refresh-token",
  86  |           token_type: "bearer",
  87  |           expires_in: 3600,
  88  |           expires_at: now + 3600,
  89  |           user: {
  90  |             id: "00000000-0000-4000-8000-000000000033",
  91  |             aud: "authenticated",
  92  |             role: "authenticated",
  93  |             email: "placement-v3-e2e@mercyblade.test",
  94  |             email_confirmed_at: new Date(0).toISOString(),
  95  |           },
  96  |         }),
  97  |       );
  98  |     },
  99  |     { storageKey, now },
  100 |   );
  101 | }
  102 | 
  103 | async function installAuthRoutes(page: Page) {
  104 |   await page.route("**/auth/v1/**", async (route) => {
  105 |     const url = route.request().url();
  106 |     if (url.includes("/user")) {
  107 |       await route.fulfill({
  108 |         contentType: "application/json",
  109 |         body: JSON.stringify({
  110 |           id: TEST_USER_ID,
  111 |           aud: "authenticated",
  112 |           role: "authenticated",
  113 |           email: "placement-v3-e2e@mercyblade.test",
  114 |           email_confirmed_at: new Date(0).toISOString(),
  115 |         }),
  116 |       });
  117 |       return;
  118 |     }
  119 |     await route.fulfill({
  120 |       contentType: "application/json",
  121 |       body: JSON.stringify({
  122 |         access_token: TEST_TOKEN,
  123 |         refresh_token: "placement-v3-refresh-token",
  124 |         token_type: "bearer",
  125 |         expires_in: 3600,
  126 |         user: {
  127 |           id: TEST_USER_ID,
  128 |           aud: "authenticated",
  129 |           role: "authenticated",
  130 |           email: "placement-v3-e2e@mercyblade.test",
  131 |           email_confirmed_at: new Date(0).toISOString(),
  132 |         },
  133 |       }),
  134 |     });
  135 |   });
  136 | }
  137 | 
  138 | async function installOrchestratorRoute(page: Page, stored: Stored) {
  139 |   const deps = createDeps(stored);
  140 |   await page.route("**/functions/v1/placement-v3-session", async (route) => {
  141 |     const body = route.request().postDataJSON() as PlacementV3Request;
```