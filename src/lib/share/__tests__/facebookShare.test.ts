// Pure-function tests for the Facebook share orchestrator. The
// orchestrator's full path (canvas → upload → share-sheet) requires
// real browser APIs; the helpers below carry the bits that DO run
// under jsdom.

import { describe, it, expect } from "vitest";

import {
  buildFacebookSharerUrl,
  buildLandingUrl,
  shareCaption,
  canWebShareWithFiles,
} from "../facebookShare";

describe("buildFacebookSharerUrl", () => {
  it("encodes the URL into the u= query parameter", () => {
    const url = "https://buem.supabase.co/storage/v1/object/public/share-cards/123/abc.png";
    const sharer = buildFacebookSharerUrl(url);
    expect(sharer.startsWith("https://www.facebook.com/sharer/sharer.php?u=")).toBe(true);
    expect(sharer).toContain(encodeURIComponent(url));
  });

  it("handles URLs that contain reserved characters", () => {
    const url = "https://example.com/path?score=94&name=Tôi";
    const sharer = buildFacebookSharerUrl(url);
    expect(sharer).toContain(encodeURIComponent(url));
    // Ensure the raw ? from the inner URL did not leak as an extra
    // outer query parameter.
    expect(sharer.split("?").length).toBe(2);
  });
});

describe("shareCaption", () => {
  it("includes the score, both languages, and the canonical domain", () => {
    const caption = shareCaption(94);
    expect(caption).toContain("94/100");
    expect(caption).toContain("Tôi đạt");
    expect(caption).toContain("I scored");
    expect(caption).toContain("mercyblade.com");
  });

  it("clamps below 0 to 0 and above 100 to 100", () => {
    expect(shareCaption(-10)).toContain("0/100");
    expect(shareCaption(150)).toContain("100/100");
  });
});

describe("canWebShareWithFiles", () => {
  it("returns false when navigator.share is missing", () => {
    // jsdom doesn't ship navigator.share by default, so this is the
    // realistic baseline.
    const blob = new Blob(["x"], { type: "image/png" });
    expect(canWebShareWithFiles(blob)).toBe(false);
  });
});

describe("buildLandingUrl (A9 referral)", () => {
  it("returns the bare home URL when no code is supplied", () => {
    expect(buildLandingUrl(null)).toBe("https://mercyblade.com");
  });

  it("appends ?ref=CODE when a code is supplied", () => {
    expect(buildLandingUrl("ABC234")).toBe("https://mercyblade.com/?ref=ABC234");
  });
});

describe("shareCaption with referral", () => {
  it("includes the Vietnamese invite line and landing URL when a code is supplied", () => {
    const caption = shareCaption(
      88,
      "ABC234",
      "https://mercyblade.com/?ref=ABC234",
    );
    expect(caption).toContain("88/100");
    expect(caption).toContain("Đăng ký bằng link này để được thêm 7 ngày miễn phí");
    expect(caption).toContain("https://mercyblade.com/?ref=ABC234");
  });

  it("falls back to the plain domain line when no code is supplied", () => {
    const caption = shareCaption(88);
    expect(caption).toContain("mercyblade.com");
    expect(caption).not.toContain("Đăng ký bằng link này");
  });
});
