import { describe, expect, it } from "vitest";

import { classifyInput, decideAction, routeIsDenied } from "../prod-r3-explorer/policy";

describe("R3 Explorer read-only policy", () => {
  it("hard-denies admin, billing, destructive account, settings, and logout surfaces", () => {
    for (const route of ["/admin", "/billing", "/checkout", "/account/delete", "/settings/security", "/logout"]) {
      expect(routeIsDenied(route), route).toMatch(/^hard-deny:/);
    }
  });

  it("allows only safe navigation/link/tab/menu interactions", () => {
    expect(decideAction({ kind: "navigate", route: "/ai-tutor", label: "navigate" })).toMatchObject({ allow: true });
    expect(decideAction({ kind: "click", role: "link", route: "/ai-tutor", label: "Grammar", href: "/ai-tutor" })).toMatchObject({ allow: true });
    expect(decideAction({ kind: "click", role: "tab", route: "/ai-tutor", label: "Correction" })).toMatchObject({ allow: true });
    expect(decideAction({ kind: "click", role: "button", route: "/account", label: "Delete account" })).toMatchObject({
      allow: false,
      hardDeny: true,
    });
  });

  it("allows fill-submit only for tutor chat and search inputs", () => {
    expect(classifyInput("Reply to Mercy", "/roleplay")).toBe("tutor-chat");
    expect(classifyInput("Search rooms", "/rooms")).toBe("search");
    expect(classifyInput("Email list", "/corporate")).toBe("other");

    expect(decideAction({ kind: "fill-submit", route: "/roleplay", label: "Reply to Mercy", inputKind: "tutor-chat" })).toMatchObject({ allow: true });
    expect(decideAction({ kind: "fill-submit", route: "/rooms", label: "Search rooms", inputKind: "search" })).toMatchObject({ allow: true });
    expect(decideAction({ kind: "fill-submit", route: "/corporate", label: "Email list", inputKind: "other" })).toMatchObject({
      allow: false,
      hardDeny: false,
    });
  });
});
