// supabase/functions/onboarding-welcome-email/__tests__/index.test.ts
// Tests for the pure functions exported by the onboarding welcome email function.

import { describe, it, expect } from "vitest";

import { isEmailValid, renderWelcomeHtml } from "../template";

describe("isEmailValid", () => {
  it("returns true for valid email addresses", () => {
    expect(isEmailValid("user@example.com")).toBe(true);
    expect(isEmailValid("a@b.co")).toBe(true);
    expect(isEmailValid("test+tag@mercyblade.com")).toBe(true);
  });

  it("returns false for invalid email addresses", () => {
    expect(isEmailValid("")).toBe(false);
    expect(isEmailValid("   ")).toBe(false);
    expect(isEmailValid("not-an-email")).toBe(false);
    expect(isEmailValid("@nouser.com")).toBe(false);
    expect(isEmailValid("nodomain@")).toBe(false);
  });
});

describe("renderWelcomeHtml", () => {
  it("includes the VI-first headline", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("Chào mừng bạn đến với MercyBlade!");
  });

  it("includes the 3-day trial mention", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("3 ngày dùng thử miễn phí");
    expect(html).toContain("3 free days");
  });

  it("includes the three feature bullet points", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("A1 đến C2");
    expect(html).toContain("VSTEP");
    expect(html).toContain("phát âm với AI");
  });

  it("includes the CTA button pointing to mercyblade.com", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("https://mercyblade.com");
    expect(html).toContain("Bắt đầu học ngay");
  });

  it("includes the support email", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("support@mercyblade.com");
  });

  it("includes the unsubscribe notice", () => {
    const html = renderWelcomeHtml();
    expect(html).toContain("Bạn nhận được email này vì đã đăng ký MercyBlade");
  });

  it("has no broken HTML structure", () => {
    const html = renderWelcomeHtml();
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain("</html>");
    expect((html.match(/<body/g) || []).length).toBe(1);
    expect((html.match(/<\/body>/g) || []).length).toBe(1);
    expect((html.match(/<\/html>/g) || []).length).toBe(1);
  });
});