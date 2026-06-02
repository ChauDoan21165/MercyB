import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders the spinner icon (animate-spin class)", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("[class*='animate-spin']");
    expect(spinner).toBeInTheDocument();
  });

  it("renders default message when no message prop", () => {
    render(<LoadingSpinner />);
    // Default English message
    expect(screen.getByText("Loading… Please wait.")).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    render(<LoadingSpinner message="Please wait for auth" />);
    expect(screen.getByText("Please wait for auth")).toBeInTheDocument();
  });

  it("renders Vietnamese message when lang=vi", () => {
    render(<LoadingSpinner lang="vi" />);
    expect(screen.getByText("Đang tải… Vui lòng chờ.")).toBeInTheDocument();
  });

  it("applies sm size class (w-4 h-4)", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector("[class*='w-4'][class*='h-4']");
    expect(spinner).toBeInTheDocument();
  });

  it("applies md size class (w-8 h-8) by default", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("[class*='w-8'][class*='h-8']");
    expect(spinner).toBeInTheDocument();
  });

  it("applies lg size class (w-12 h-12)", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector("[class*='w-12'][class*='h-12']");
    expect(spinner).toBeInTheDocument();
  });

  it("forwards className to container", () => {
    const { container } = render(<LoadingSpinner className="my-spinner" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("my-spinner");
  });

  it("falls back to default message when message is empty string (falsy)", () => {
    // empty string is falsy — component uses LOADING_MESSAGES default
    render(<LoadingSpinner message="" />);
    // displayMessage = "" || LOADING_MESSAGES[lang].default → default shown
    expect(screen.getByText("Loading… Please wait.")).toBeInTheDocument();
  });
});
