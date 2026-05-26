/**
 * Shared Playwright test fixture. Imports the stock `test` from
 * @playwright/test and layers our two defaults:
 *
 *   1. Every page auto-blocks external services (Stripe, OpenAI, etc.)
 *      so a careless spec can't accidentally spend money.
 *   2. Every page base URL is our dev server (127.0.0.1:3107 by default,
 *      overridable via TEST_BASE_URL).
 *
 * Specs that also need Web Speech stubs call `installWebSpeechStubs(page,
 * { transcript })` explicitly — the transcript varies per test, so that
 * stays a per-test setup.
 */

import { test as base } from "@playwright/test";
import { blockExternalServices } from "./mocks";

export const test = base.extend<{ autoBlock: void }>({
  autoBlock: [
    async ({ page }, use) => {
      await blockExternalServices(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
