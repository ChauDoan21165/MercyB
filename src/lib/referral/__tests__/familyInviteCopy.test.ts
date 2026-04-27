// src/lib/referral/__tests__/familyInviteCopy.test.ts

import { describe, it, expect } from "vitest";

import {
  FAMILY_INVITE_TEMPLATES,
  inviterSelfAddressVi,
  recipientAddressVi,
  renderInviteBody,
} from "../familyInviteCopy";

describe("recipientAddressVi", () => {
  it("uses Vietnamese pronouns by relationship", () => {
    expect(recipientAddressVi("older_sister")).toBe("chị");
    expect(recipientAddressVi("older_brother")).toBe("anh");
    expect(recipientAddressVi("younger")).toBe("em");
    expect(recipientAddressVi("aunt")).toBe("cô");
    expect(recipientAddressVi("uncle")).toBe("chú");
    expect(recipientAddressVi("parent")).toBe("ba/mẹ");
    expect(recipientAddressVi("colleague")).toBe("anh/chị");
    expect(recipientAddressVi("friend")).toBe("bạn");
  });

  it("falls back to 'bạn' for unknown / null", () => {
    expect(recipientAddressVi(null)).toBe("bạn");
  });
});

describe("inviterSelfAddressVi", () => {
  it("inviter uses 'em' when speaking to elders/older", () => {
    expect(inviterSelfAddressVi("older_sister")).toBe("em");
    expect(inviterSelfAddressVi("older_brother")).toBe("em");
    expect(inviterSelfAddressVi("aunt")).toBe("em");
    expect(inviterSelfAddressVi("uncle")).toBe("em");
    expect(inviterSelfAddressVi("parent")).toBe("em");
  });

  it("inviter uses 'anh/chị' when speaking to younger sibling", () => {
    expect(inviterSelfAddressVi("younger")).toBe("anh/chị");
  });

  it("falls back to 'mình' for friend/colleague/null", () => {
    expect(inviterSelfAddressVi("friend")).toBe("mình");
    expect(inviterSelfAddressVi("colleague")).toBe("mình");
    expect(inviterSelfAddressVi(null)).toBe("mình");
  });
});

describe("renderInviteBody", () => {
  it("interpolates self-address + recipient-address into the family template", () => {
    const out = renderInviteBody({
      templateKey: "family",
      inviterName: "Linh",
      recipientName: "Mẹ",
      relationship: "parent",
      customMessage: null,
      inviteUrl: "https://mercyblade.com/invite/ABCDEFGH2345",
    });
    // Inviter is younger relative to parent → uses 'em'.
    expect(out.vi).toContain("em mời ba/mẹ");
    expect(out.en).toContain("MercyBlade");
    expect(out.en).toContain("English");
  });

  it("renders the friend template with 'mình' + 'bạn'", () => {
    const out = renderInviteBody({
      templateKey: "friend",
      inviterName: "Linh",
      recipientName: null,
      relationship: "friend",
      customMessage: null,
      inviteUrl: "https://mercyblade.com/invite/ABCDEFGH2345",
    });
    expect(out.vi).toContain("Mình");
    expect(out.vi).toContain("bạn");
  });

  it("falls back to family template for unknown templateKey", () => {
    const out = renderInviteBody({
      // @ts-expect-error — exercising the fallback
      templateKey: "nope",
      inviterName: "Linh",
      recipientName: "Lan",
      relationship: "older_sister",
      customMessage: null,
      inviteUrl: "https://mercyblade.com/invite/ABCDEFGH2345",
    });
    expect(out.vi).toContain("chị");
  });

  it("renders custom-template body verbatim from customMessage", () => {
    const out = renderInviteBody({
      templateKey: "custom",
      inviterName: "Linh",
      recipientName: null,
      relationship: "friend",
      customMessage: "Học cùng mình nhé bạn ơi",
      inviteUrl: "https://mercyblade.com/invite/ABCDEFGH2345",
    });
    expect(out.vi).toContain("Học cùng mình nhé bạn ơi");
    expect(out.en).toContain("Học cùng mình nhé bạn ơi");
  });

  it("never leaves a {{var}} placeholder in the rendered output", () => {
    for (const t of FAMILY_INVITE_TEMPLATES) {
      const out = renderInviteBody({
        templateKey: t.key,
        inviterName: "Linh",
        recipientName: null,
        relationship: null,
        customMessage: "fallback",
        inviteUrl: "https://x",
      });
      expect(out.vi).not.toMatch(/\{\{[^}]+\}\}/);
      expect(out.en).not.toMatch(/\{\{[^}]+\}\}/);
    }
  });
});
