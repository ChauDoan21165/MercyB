import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from "@/components/ui/toast";

describe("ui/Toast", () => {
  function renderToast({
    variant,
    open = true,
  }: { variant?: "default" | "destructive"; open?: boolean } = {}) {
    return render(
      <ToastProvider>
        <Toast open={open} variant={variant} data-testid="toast">
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes were saved.</ToastDescription>
          <ToastAction altText="Undo" onClick={() => {}}>Undo</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
  }

  it("renders ToastTitle when open", () => {
    renderToast();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders ToastDescription when open", () => {
    renderToast();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });

  it("renders ToastAction button", () => {
    renderToast();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("default variant does not have destructive class", () => {
    renderToast({ variant: "default" });
    const el = screen.getByTestId("toast");
    expect(el.className).not.toContain("destructive");
  });

  it("destructive variant has destructive class", () => {
    renderToast({ variant: "destructive" });
    const el = screen.getByTestId("toast");
    expect(el.className).toContain("destructive");
  });

  it("ToastTitle has font-semibold class", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle data-testid="title">Title</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByTestId("title").className).toContain("font-semibold");
  });

  it("ToastDescription has opacity class", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastDescription data-testid="desc">Desc</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByTestId("desc").className).toContain("opacity-90");
  });

  it("ToastViewport renders in the DOM", () => {
    render(
      <ToastProvider>
        <ToastViewport data-testid="vp" />
      </ToastProvider>,
    );
    expect(screen.getByTestId("vp")).toBeInTheDocument();
  });

  it("closed Toast (open=false) does not show content", () => {
    renderToast({ open: false });
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });
});
