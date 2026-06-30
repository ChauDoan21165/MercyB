// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const startSessionMock = vi.hoisted(() => vi.fn());
const authState = vi.hoisted(() => ({
  user: { id: "user-1", email: "learner@example.test" } as { id: string; email?: string } | null,
}));

vi.mock("@/lib/placement/v3/clientStub", () => ({
  startSession: startSessionMock,
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: authState.user, isLoading: false }),
}));

vi.mock("@/contexts/NativeLanguageContext", () => ({
  useNativeLanguage: () => ({
    nativeLang: "vi",
    setNativeLang: vi.fn(),
  }),
  NativeLanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import WhoForPage from "../WhoForPage";


function LocationProbe() {
  const location = useLocation();
  return <div data-testid="pathname">{location.pathname}</div>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/placement/who"]}>
      <LocationProbe />
      <WhoForPage />
    </MemoryRouter>,
  );
}

describe("WhoForPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.user = { id: "user-1", email: "learner@example.test" };
  });

  it("signposts sign-in and redirects when a learner reaches the picker without a session", async () => {
    authState.user = null;

    renderPage();

    const signInButton = screen.getByRole("button", { name: /đăng nhập để làm bài test/i });
    expect(signInButton).toHaveTextContent("Đăng nhập để làm bài test");

    await userEvent.click(signInButton);

    expect(startSessionMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/signin");
  });

  it("surfaces a start failure instead of leaving a signed-in user stuck silently", async () => {
    startSessionMock.mockRejectedValueOnce(new Error("Sign in to start placement."));

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /mình — người lớn đang học/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Sign in to start placement.");
    });
    expect(screen.getByTestId("pathname")).toHaveTextContent("/placement/who");
  });
});
