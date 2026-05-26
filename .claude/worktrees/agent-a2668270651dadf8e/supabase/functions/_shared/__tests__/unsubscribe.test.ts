// supabase/functions/_shared/__tests__/unsubscribe.test.ts
//
// Pure-helper coverage for the email unsubscribe surface:
//   - URL builders escape correctly and use the canonical origin
//   - buildFooter emits both VI + EN copy and links to both targets
//   - buildListUnsubscribeHeaders includes URL + mailto + One-Click flag
//   - withFooter splices the footer inside the wrapper card div if
//     present, falls back to before </body>, falls back to plain append

import { describe, expect, it } from "vitest";

import {
  SITE_ORIGIN,
  buildFooter,
  buildListUnsubscribeHeaders,
  buildPreferencesUrl,
  buildUnsubscribeMailto,
  buildUnsubscribeUrl,
  withFooter,
} from "../unsubscribe";

describe("URL builders", () => {
  it("buildUnsubscribeUrl uses /unsubscribe?token= on the canonical origin", () => {
    expect(buildUnsubscribeUrl("abc123")).toBe(
      `${SITE_ORIGIN}/unsubscribe?token=abc123`,
    );
  });

  it("URL-encodes special characters in the token", () => {
    expect(buildUnsubscribeUrl("ab/cd?e&f")).toBe(
      `${SITE_ORIGIN}/unsubscribe?token=ab%2Fcd%3Fe%26f`,
    );
  });

  it("buildPreferencesUrl points at /account/notifications", () => {
    expect(buildPreferencesUrl()).toBe(`${SITE_ORIGIN}/account/notifications`);
  });

  it("buildUnsubscribeMailto carries the token in the local part", () => {
    expect(buildUnsubscribeMailto("xyz")).toBe(
      "mailto:unsubscribe+xyz@mercyblade.com",
    );
  });
});

describe("buildFooter", () => {
  const { text, html } = buildFooter("token123");

  it("includes both VI and EN footers", () => {
    expect(text).toContain("Bạn nhận email này vì đã đăng ký MercyBlade");
    expect(text).toContain("You're receiving this because you signed up for MercyBlade");
  });

  it("links to both the per-category and full opt-out targets", () => {
    expect(text).toContain("/account/notifications");
    expect(text).toContain("/unsubscribe?token=token123");
    expect(html).toContain("/account/notifications");
    expect(html).toContain("/unsubscribe?token=token123");
  });

  it("HTML escapes the URLs into anchor tags", () => {
    expect(html).toContain('<a href="https://mercyblade.com/unsubscribe?token=token123"');
  });
});

describe("buildListUnsubscribeHeaders", () => {
  const headers = buildListUnsubscribeHeaders("token123");

  it("includes the One-Click POST flag", () => {
    expect(headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });

  it("List-Unsubscribe carries both URL and mailto in <>", () => {
    expect(headers["List-Unsubscribe"]).toBe(
      "<https://mercyblade.com/unsubscribe?token=token123>, " +
        "<mailto:unsubscribe+token123@mercyblade.com>",
    );
  });
});

describe("withFooter", () => {
  it("appends the text footer", () => {
    const out = withFooter({ text: "hello", html: "<p>hi</p>" }, "tok");
    expect(out.text.startsWith("hello")).toBe(true);
    expect(out.text).toContain("Bạn nhận email này");
  });

  it("inserts before the inner card </div></body> when wrapper is present", () => {
    const html =
      `<!DOCTYPE html><html><body><div class="card"><p>body</p></div></body></html>`;
    const out = withFooter({ text: "", html }, "tok");
    // Footer should sit inside the </div> that closes the card.
    const cardCloseIdx = out.html.indexOf("</div></body>");
    const footerIdx = out.html.indexOf("Bạn nhận email này");
    expect(footerIdx).toBeGreaterThan(0);
    expect(footerIdx).toBeLessThan(cardCloseIdx);
  });

  it("falls back to before </body> for minimal HTML", () => {
    const html = `<!DOCTYPE html><html><body><p>body</p></body></html>`;
    const out = withFooter({ text: "", html }, "tok");
    const bodyClose = out.html.indexOf("</body>");
    const footer = out.html.indexOf("Bạn nhận email này");
    expect(footer).toBeGreaterThan(0);
    expect(footer).toBeLessThan(bodyClose);
  });

  it("plain-appends when there's no wrapper at all", () => {
    const out = withFooter({ text: "", html: "<p>raw</p>" }, "tok");
    expect(out.html.indexOf("Bạn nhận email này")).toBeGreaterThan(
      out.html.indexOf("<p>raw</p>"),
    );
  });
});
