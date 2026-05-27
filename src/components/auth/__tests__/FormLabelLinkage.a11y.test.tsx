// @vitest-environment jsdom
//
// Form label/input linkage — a11y guard test.
//
// Pins WCAG 1.3.1 (info & relationships) + 3.3.2 (labels or instructions)
// for the auth-flow forms that the !64 a11y audit called out:
//   - EmailBlock      — Email + Password fields
//   - PhoneOtp        — Phone field (SMS code only appears post-send)
//   - ResetPasswordPage — New + Confirm password fields
//   - Reset (legacy)  — New + Confirm password fields
//
// Contract under test:
//   1. Every `<label>` with text on these forms is programmatically
//      linked to its `<input>` via `htmlFor` matching the input's
//      `id`.
//   2. The link must use a non-empty id (not "" / undefined).
//   3. The label's text content is non-empty (so the linkage carries
//      meaning, not just a structural attachment).
//
// What we deliberately do NOT test here:
//   - Behavioural specs (typing, submit, mutation) — those live in
//     the existing EmailBlock.codeFlow.test.tsx etc.
//   - The OTP-code inputs (no visible <label> by design — they're
//     accessible via aria-label + descriptive paragraph above).

import React from "react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

afterEach(() => {
  cleanup();
});

// Shared Supabase + auth-helper stubs so importing these components
// doesn't try to hit a real network or session.
vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>(
    "@/test/mocks/supabaseMock",
  );
  return { supabase: mod.createSupabaseMock() };
});
vi.mock("@/lib/security/mfaClient", () => ({
  listMfaFactors: vi.fn().mockResolvedValue({ totp: [], phone: [] }),
  findFirstVerifiedTotp: vi.fn().mockReturnValue(null),
}));

// Render helpers + linkage assertion. Each form lives behind its own
// `describe`, but the assertion is the same shape — checking
// label.htmlFor === input.id for each visible-label/input pair.

function assertEveryLabelIsLinkedToAnInput(): void {
  const labels = Array.from(
    document.querySelectorAll<HTMLLabelElement>("label"),
  );
  // Skip labels that wrap their input (implicit association — the
  // browser handles linkage even without htmlFor). For those, the
  // label has a child <input>.
  const explicit = labels.filter(
    (l) => l.querySelector("input,textarea,select") == null,
  );

  // Filter further to the labels that carry visible text content
  // (the audit's defect is on text labels, not icon-wrapping ones).
  const textLabels = explicit.filter(
    (l) => (l.textContent ?? "").trim().length > 0,
  );

  expect(textLabels.length).toBeGreaterThan(0);
  for (const label of textLabels) {
    const targetId = label.htmlFor;
    expect(
      targetId,
      `label "${label.textContent}" has empty htmlFor — input is orphaned`,
    ).toBeTruthy();
    const target = document.getElementById(targetId);
    expect(
      target,
      `label "${label.textContent}" htmlFor="${targetId}" does not resolve to an element`,
    ).not.toBeNull();
    expect(["INPUT", "TEXTAREA", "SELECT"]).toContain(target!.tagName);
  }
}

describe("EmailBlock — label/input linkage", () => {
  it("every visible <label> is linked to its <input> via htmlFor/id", async () => {
    const EmailBlock = (await import("../EmailBlock")).default;
    render(
      <MemoryRouter>
        <EmailBlock
          emailRedirectTo="/"
          redirectToRecovery="/reset-password"
          busyParent={false}
          onAuthed={async () => {}}
          onSignupCreated={() => {}}
        />
      </MemoryRouter>,
    );

    // Email input visible immediately; password field only appears
    // after the user toggles to password mode. The default code-OTP
    // mode renders only the email <label>, which is enough to
    // exercise the contract — the link assertion runs over whatever
    // <label>s are in the DOM at this moment.
    expect(screen.getByText("Email")).toBeTruthy();
    assertEveryLabelIsLinkedToAnInput();
  });
});

describe("PhoneOtp — label/input linkage (source-level)", () => {
  it("phone + SMS-code labels declare htmlFor + paired ids", () => {
    const src = readSrc("src/components/auth/PhoneOtp.tsx");
    expect(src).toMatch(/useId/);
    expect(src).toMatch(/<label htmlFor=\{phoneInputId\}/);
    expect(src).toMatch(/<label htmlFor=\{smsCodeInputId\}/);
    expect(src).toMatch(/id=\{phoneInputId\}/);
    expect(src).toMatch(/id=\{smsCodeInputId\}/);
  });
});

// ResetPasswordPage + Reset are page-level components with deep
// provider trees (NativeLanguageProvider, supabase auth boot path,
// recovery-token hash gating). A full render-tree test for either
// page would pull in 5+ providers and a recovery-session mock — a
// lot of weight to assert a four-line linkage contract.
//
// Source-level assertions cover them instead: parse the file and
// confirm every `<label>` that carries text content also carries
// `htmlFor={someId}`, and that the id is referenced by an `<input
// id={someId}>`. Brittle to refactors that change the literal
// syntax, but precise about the contract that matters.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = join(__dirname, "..", "..", "..", "..");

function readSrc(rel: string): string {
  return readFileSync(join(REPO_ROOT, rel), "utf8");
}

describe("ResetPasswordPage — label/input linkage (source-level)", () => {
  it("both visible <label> elements declare htmlFor + are paired with id-bearing inputs", () => {
    const src = readSrc("src/pages/ResetPasswordPage.tsx");
    // `useId` is wired
    expect(src).toMatch(/useId/);
    // The two labels carry htmlFor pointing at the useId-derived
    // variables.
    expect(src).toMatch(/<label htmlFor=\{newPwInputId\}/);
    expect(src).toMatch(/<label htmlFor=\{confirmPwInputId\}/);
    // The inputs carry matching `id={...}`.
    expect(src).toMatch(/id=\{newPwInputId\}/);
    expect(src).toMatch(/id=\{confirmPwInputId\}/);
  });
});

describe("Reset (legacy) — label/input linkage (source-level)", () => {
  it("both visible <label> elements declare htmlFor + are paired with id-bearing inputs", () => {
    const src = readSrc("src/pages/Reset.tsx");
    expect(src).toMatch(/useId/);
    expect(src).toMatch(/<label htmlFor=\{newPwInputId\}/);
    expect(src).toMatch(/<label htmlFor=\{confirmPwInputId\}/);
    expect(src).toMatch(/id=\{newPwInputId\}/);
    expect(src).toMatch(/id=\{confirmPwInputId\}/);
  });
});
