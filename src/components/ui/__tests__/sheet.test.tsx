import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

describe("ui/Sheet", () => {
  it("does not render content before trigger click", () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );
    expect(screen.queryByText("Sheet body")).not.toBeInTheDocument();
  });

  it("shows content after trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent>
          <SheetTitle>My Sheet</SheetTitle>
          Sheet body
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open Sheet"));
    expect(screen.getByText("My Sheet")).toBeInTheDocument();
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
  });

  it("has an accessible dialog role when open", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("close button (X) closes the sheet", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet</SheetTitle>
          Content here
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Content here")).toBeInTheDocument();
    // The built-in close button has sr-only "Close" text
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Content here")).not.toBeInTheDocument();
  });

  it("renders side=right variant class by default", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent data-testid="sc">
          <SheetTitle>Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    const content = screen.getByTestId("sc");
    // right side variant applies inset-y-0, right-0 classes
    expect(content.className).toContain("right-0");
  });

  it("renders side=left variant class", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side="left" data-testid="sc-left">
          <SheetTitle>Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("sc-left").className).toContain("left-0");
  });

  it("SheetHeader, SheetTitle, SheetDescription, SheetFooter render correctly", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title text</SheetTitle>
            <SheetDescription>Description text</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <button>Save</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Title text")).toBeInTheDocument();
    expect(screen.getByText("Description text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("onOpenChange fires when closed", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <Sheet onOpenChange={handler}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(handler).toHaveBeenCalledWith(false);
  });
});
