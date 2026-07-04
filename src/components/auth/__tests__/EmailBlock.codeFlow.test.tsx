// src/components/auth/__tests__/EmailBlock.codeFlow.test.tsx
//
// Coverage for the new code-first email OTP flow inside <EmailBlock />.
// Four call-path scenarios required by the task brief:
//
//   1. happy path  — verifyOtp succeeds → onAuthed() is called
//   2. wrong code  — verifyOtp returns "Token has invalid value"
//   3. expired     — verifyOtp returns "Token has expired"
//   4. network err — verifyOtp throws "Failed to fetch"
//
// In every error case onAuthed() must NOT be called and the user must
// see a bilingual VI-first message that does NOT use the legacy
// misleading "OAuth sign-in failed" wording.

import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock> & {
  auth: ReturnType<typeof createSupabaseMock>["auth"] & {
    verifyOtp: ReturnType<typeof vi.fn>;
  };
};

// jsdom doesn't implement scrollIntoView; the component calls it on
// every status update. Stub once so the useEffect doesn't blow up.
beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock() as SupabaseMock;
  // verifyOtp isn't part of the shared mock surface yet — add it here
  // so each test can override per-scenario without polluting other
  // suites that import the same factory.
  supabase.auth.verifyOtp = vi.fn().mockResolvedValue({ data: {}, error: null });
  return { supabase, __mock: supabase };
});

// MFA factor probe runs after a successful primary auth; stub it to
// "no factor enrolled" so the suite doesn't have to drive a TOTP step.
vi.mock("@/lib/security/mfaClient", () => ({
  listMfaFactors: vi.fn().mockResolvedValue({ totp: [], phone: [] }),
  findFirstVerifiedTotp: vi.fn().mockReturnValue(null),
  challengeFactor: vi.fn(),
  verifyChallenge: vi.fn(),
  humanizeMfaError: vi.fn().mockReturnValue({ vi: "", en: "" }),
}));

import EmailBlock from "@/components/auth/EmailBlock";
import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as typeof SupaMod & { __mock: SupabaseMock }).__mock;

function renderBlock() {
  const onAuthed = vi.fn().mockResolvedValue(undefined);
  const onSignupCreated = vi.fn();

  render(
    <EmailBlock
      emailRedirectTo="https://example.test/auth/callback"
      redirectToRecovery="https://example.test/reset-password"
      busyParent={false}
      onAuthed={onAuthed}
      onSignupCreated={onSignupCreated}
    />,
  );

  return { onAuthed, onSignupCreated };
}

async function progressToCodeStep(email: string) {
  // Switch to the code-email mode tab.
  fireEvent.click(screen.getByTestId("signin-mode-code-email"));

  // Type email and send.
  fireEvent.change(screen.getByPlaceholderText("you@email.com"), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole("button", { name: /Gửi mã/ }));

  // Wait for the code-entry step to mount.
  await waitFor(() =>
    expect(screen.getByTestId("email-block-code-step")).toBeInTheDocument(),
  );
}

describe("<EmailBlock /> — code-first email OTP flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMock.auth.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    supabaseMock.auth.verifyOtp = vi.fn().mockResolvedValue({ data: {}, error: null });
    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "fake-token",
          user: { id: "u1", email: "test@example.com" },
        },
      },
      error: null,
    });
  });

  it("happy path: send email → verifyOtp success → onAuthed called", async () => {
    const { onAuthed } = renderBlock();
    await progressToCodeStep("test@example.com");

    // Type the 6-digit code.
    fireEvent.change(screen.getByTestId("signin-email-otp-input"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByTestId("signin-email-otp-submit"));

    await waitFor(() =>
      expect(supabaseMock.auth.verifyOtp).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "123456",
        type: "email",
      }),
    );
    await waitFor(() => expect(onAuthed).toHaveBeenCalledTimes(1));
  });

  it("wrong code: verifyOtp returns invalid_otp → no onAuthed, VI message", async () => {
    const { onAuthed } = renderBlock();
    await progressToCodeStep("test@example.com");

    supabaseMock.auth.verifyOtp.mockResolvedValueOnce({
      data: {},
      error: { message: "Token has invalid value", code: "invalid_otp" },
    });

    fireEvent.change(screen.getByTestId("signin-email-otp-input"), {
      target: { value: "000000" },
    });
    fireEvent.click(screen.getByTestId("signin-email-otp-submit"));

    await waitFor(() => {
      const status = screen.getByTestId("signin-email-otp-status");
      expect(status.textContent).toContain("Mã không đúng");
    });
    expect(onAuthed).not.toHaveBeenCalled();
  });

  it("expired code: verifyOtp returns otp_expired → no onAuthed, VI message", async () => {
    const { onAuthed } = renderBlock();
    await progressToCodeStep("test@example.com");

    supabaseMock.auth.verifyOtp.mockResolvedValueOnce({
      data: {},
      error: { message: "Token has expired", code: "otp_expired" },
    });

    fireEvent.change(screen.getByTestId("signin-email-otp-input"), {
      target: { value: "111111" },
    });
    fireEvent.click(screen.getByTestId("signin-email-otp-submit"));

    await waitFor(() => {
      const status = screen.getByTestId("signin-email-otp-status");
      expect(status.textContent).toContain("hết hạn");
    });
    // Must NOT be the misleading legacy phrasing.
    expect(
      screen.getByTestId("signin-email-otp-status").textContent,
    ).not.toMatch(/OAuth sign-in failed/i);
    expect(onAuthed).not.toHaveBeenCalled();
  });

  it("network error: verifyOtp throws Failed to fetch → no onAuthed, VI message", async () => {
    const { onAuthed } = renderBlock();
    await progressToCodeStep("test@example.com");

    supabaseMock.auth.verifyOtp.mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    );

    fireEvent.change(screen.getByTestId("signin-email-otp-input"), {
      target: { value: "222222" },
    });
    fireEvent.click(screen.getByTestId("signin-email-otp-submit"));

    await waitFor(() => {
      const status = screen.getByTestId("signin-email-otp-status");
      expect(status.textContent).toContain("Không kết nối");
    });
    expect(onAuthed).not.toHaveBeenCalled();
  });
});
