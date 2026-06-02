// src/pages/__tests__/Unsubscribe.render.test.tsx
//
// Lane E (E3) — render integration for the public /unsubscribe page. The
// token IS the credential (no auth), and the page calls the
// unsubscribeByToken service on mount. We mock that service so the test is
// hermetic, and assert the three conditional states the page branches on:
//   - missing token        → "Liên kết không hợp lệ" (no service call)
//   - valid token / ok      → success card + re-subscribe link
//   - token_not_found       → "hết hạn hoặc không khớp" info state

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import UnsubscribePage from "@/pages/Unsubscribe";

const unsubscribeByToken = vi.fn();

vi.mock("@/services/emailPreferences", () => ({
  unsubscribeByToken: (...args: unknown[]) => unsubscribeByToken(...args),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <UnsubscribePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  unsubscribeByToken.mockReset();
});

describe("Unsubscribe page", () => {
  it("renders the card landmark", () => {
    unsubscribeByToken.mockResolvedValue({ ok: true });
    renderAt("/unsubscribe?token=deadbeef");
    expect(screen.getByTestId("unsubscribe-card")).toBeInTheDocument();
  });

  it("shows the invalid-link state and does NOT call the service when token is missing", () => {
    renderAt("/unsubscribe");
    expect(
      screen.getByRole("heading", { name: "Liên kết không hợp lệ" }),
    ).toBeInTheDocument();
    expect(unsubscribeByToken).not.toHaveBeenCalled();
  });

  it("calls the service with the token and shows the success state on ok", async () => {
    unsubscribeByToken.mockResolvedValue({ ok: true });
    renderAt("/unsubscribe?token=abc123");

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Bạn đã unsubscribe" })).toBeInTheDocument(),
    );
    expect(unsubscribeByToken).toHaveBeenCalledWith("abc123");
    // Success offers a granular re-subscribe link.
    expect(screen.getByTestId("unsubscribe-resubscribe-link")).toHaveAttribute(
      "href",
      "/account/notifications",
    );
  });

  it("shows the not-found info state when the token does not match an account", async () => {
    unsubscribeByToken.mockResolvedValue({ ok: false, message: "token_not_found" });
    renderAt("/unsubscribe?token=zzz");

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Liên kết đã hết hạn hoặc không khớp" }),
      ).toBeInTheDocument(),
    );
  });
});
