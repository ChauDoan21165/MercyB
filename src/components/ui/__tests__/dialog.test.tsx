import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

describe("Dialog", () => {
  function renderDialog() {
    return render(
      <Dialog>
        <DialogTrigger data-testid="trigger">Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description text</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  it("renders the trigger button", () => {
    renderDialog();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("dialog content is not visible initially", () => {
    renderDialog();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows title and description after opening", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
    expect(screen.getByText("Dialog description text")).toBeInTheDocument();
  });

  it("renders close button inside dialog content", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByTestId("trigger"));
    // DialogContent includes a close button (sr-only "Close" text)
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("closes dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("DialogHeader forwards className", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader className="my-header" data-testid="header">
            <DialogTitle>T</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByTestId("header").className).toContain("my-header");
  });
});
