import { describe, expect, it } from "vitest";

import { crawlRoute } from "../e2e/crawler/crawlRoute";

type FakePageOptions = {
  bodyText: string;
  pageErrorMessage?: string;
  rootVisible?: boolean;
};

function fakePage({ bodyText, pageErrorMessage, rootVisible = false }: FakePageOptions) {
  const handlers = new Map<string, Array<(payload: Error) => void>>();

  return {
    on: (event: string, handler: (payload: Error) => void) => {
      handlers.set(event, [...(handlers.get(event) ?? []), handler]);
    },
    goto: async () => {
      if (pageErrorMessage) {
        for (const handler of handlers.get("pageerror") ?? []) handler(new Error(pageErrorMessage));
      }
      return { status: () => 200 };
    },
    waitForTimeout: async () => undefined,
    url: () => "https://mercyblade.com/languages/thai-english/",
    locator: (selector: string) => {
      if (selector === "#root") {
        return { isVisible: async () => rootVisible };
      }
      if (selector === "body") {
        return { innerText: async () => bodyText };
      }
      return {
        isVisible: async () => false,
        innerText: async () => "",
      };
    },
  };
}

describe("crawlRoute static landing pages", () => {
  it("does not classify meaningful static pages without #root as blank renders", async () => {
    const result = await crawlRoute(
      fakePage({
        bodyText:
          "Thai Learners Study English. English study explanations for Thai-speaking learners, from A1 to C2. Local static lesson pack content is visible.",
      }) as never,
      "https://mercyblade.com",
      "/languages/thai-english",
      "public",
    );

    expect(result.outcome).toBe("pass");
    expect(result.failures).toEqual([]);
  });

  it("still flags empty pages without #root as blank renders", async () => {
    const result = await crawlRoute(
      fakePage({ bodyText: "   " }) as never,
      "https://mercyblade.com",
      "/blank",
      "public",
    );

    expect(result.outcome).toBe("fail");
    expect(result.failures).toContainEqual(
      expect.objectContaining({
        type: "blank-render",
        detail: "#root did not render any content",
      }),
    );
  });

  it("does not exempt static pages that also throw page errors", async () => {
    const result = await crawlRoute(
      fakePage({
        bodyText:
          "Thai Learners Study English. English study explanations for Thai-speaking learners, from A1 to C2. Local static lesson pack content is visible.",
        pageErrorMessage: "static page crashed",
      }) as never,
      "https://mercyblade.com",
      "/languages/thai-english",
      "public",
    );

    expect(result.outcome).toBe("fail");
    expect(result.failures).toContainEqual(expect.objectContaining({ type: "js-crash" }));
    expect(result.failures).toContainEqual(expect.objectContaining({ type: "blank-render" }));
  });
});
