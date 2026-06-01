import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Stub matchMedia before vaul module effects run
// vaul calls window.matchMedia('(display-mode: standalone)') when drawer opens
const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});
Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

describe("Drawer", () => {
  function renderDrawer() {
    return render(
      <Drawer>
        <DrawerTrigger data-testid="trigger">Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose data-testid="close-btn">Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  it("renders the trigger button", () => {
    renderDrawer();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("drawer content is not visible initially", () => {
    renderDrawer();
    expect(screen.queryByText("Drawer Title")).not.toBeInTheDocument();
  });

  it("opens drawer when trigger is clicked", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
  });

  it("shows title and description after opening", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
    expect(screen.getByText("Drawer description")).toBeInTheDocument();
  });

  it("DrawerHeader forwards className", () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerHeader className="custom-header" data-testid="header">
            <DrawerTitle>T</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
    expect(screen.getByTestId("header").className).toContain("custom-header");
  });

  it("DrawerContent has rounded-t class when open", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByTestId("trigger"));
    const content = document.querySelector("[class*='rounded-t']");
    expect(content).toBeInTheDocument();
  });

  it("DrawerTitle applies font-semibold class", async () => {
    const user = userEvent.setup();
    renderDrawer();
    await user.click(screen.getByTestId("trigger"));
    const title = screen.getByText("Drawer Title");
    expect(title.className).toContain("font-semibold");
  });
});
