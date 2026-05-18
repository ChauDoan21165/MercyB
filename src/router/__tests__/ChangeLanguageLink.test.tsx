// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const mockUseAuth = vi.fn();
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...actual, useNavigate: () => navigateMock };
});

import { ChangeLanguageLink } from "../ChangeLanguageLink";

const PAIR_KEY = "mercyblade.languagePair";

function setPair() {
  window.localStorage.setItem(
    PAIR_KEY,
    JSON.stringify({ native: "vi", targets: ["en"] }),
  );
}

function renderLink() {
  return render(
    <MemoryRouter>
      <ChangeLanguageLink />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  navigateMock.mockClear();
  mockUseAuth.mockReset();
});

afterEach(() => vi.restoreAllMocks());

describe("ChangeLanguageLink", () => {
  it("anonymous WITH a stored pair → shows the link", () => {
    setPair();
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    renderLink();
    expect(
      screen.getByRole("button", { name: /Đổi ngôn ngữ/ }),
    ).toBeInTheDocument();
  });

  it("anonymous with NO stored pair → renders nothing", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    const { container } = renderLink();
    expect(container).toBeEmptyDOMElement();
  });

  it("signed-in → renders nothing (Settings owns the pair)", () => {
    setPair();
    mockUseAuth.mockReturnValue({ user: { id: "u1" }, isLoading: false });
    const { container } = renderLink();
    expect(container).toBeEmptyDOMElement();
  });

  it("auth loading → renders nothing", () => {
    setPair();
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
    const { container } = renderLink();
    expect(container).toBeEmptyDOMElement();
  });

  it("click clears the stored pair and routes to the picker", async () => {
    setPair();
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    const u = userEvent.setup();
    renderLink();
    await u.click(screen.getByRole("button", { name: /Đổi ngôn ngữ/ }));
    expect(window.localStorage.getItem(PAIR_KEY)).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/onboarding");
  });
});
