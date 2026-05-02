import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ErrorBoundary } from "../ErrorBoundary";

function Bomb() {
  throw new Error("kaboom");
}

describe("<ErrorBoundary />", () => {
  // Suppress the noisy React "uncaught render error" console output that
  // is emitted whenever a child throws — it's not a real failure, it's
  // just React being chatty about the error we're deliberately raising.
  let errSpy: ReturnType<typeof vi.spyOn>;
  let groupSpy: ReturnType<typeof vi.spyOn>;
  let groupEndSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    groupSpy = vi.spyOn(console, "group").mockImplementation(() => {});
    groupEndSpy = vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  });
  afterEach(() => {
    errSpy.mockRestore();
    groupSpy.mockRestore();
    groupEndSpy.mockRestore();
  });

  // Regression: ErrorBoundary mounts ABOVE BrowserRouter in main.tsx, so
  // the fallback UI must not depend on react-router-dom context. Using
  // <Link> here previously crashed the fallback with
  //   "Cannot destructure property 'basename' from null or undefined value"
  // and the secondary crash bubbled to window.onerror, masking the
  // primary error inside the boundary. Keeping the fallback Router-free
  // means a real exception is captured by componentDidCatch instead.
  it("renders the fallback UI when there is no Router ancestor", () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();

    const goHome = screen.getByText("Go Home");
    expect(goHome).toBeInstanceOf(HTMLAnchorElement);
    expect((goHome as HTMLAnchorElement).getAttribute("href")).toBe("/");
  });
});
