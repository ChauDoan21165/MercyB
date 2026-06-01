import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";

describe("ContextMenu", () => {
  function renderContextMenu(onSelect?: () => void) {
    return render(
      <ContextMenu>
        <ContextMenuTrigger data-testid="trigger">Right-click here</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onSelect} data-testid="item-copy">
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem data-testid="item-paste">Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  it("renders the trigger area", () => {
    renderContextMenu();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("menu items are not visible initially", () => {
    renderContextMenu();
    expect(screen.queryByText("Copy")).not.toBeInTheDocument();
  });

  it("opens menu on right-click", async () => {
    const user = userEvent.setup();
    renderContextMenu();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("trigger") });
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("shows label and items when open", async () => {
    const user = userEvent.setup();
    renderContextMenu();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("trigger") });
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Paste")).toBeInTheDocument();
  });

  it("calls onClick when menu item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderContextMenu(onSelect);
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("trigger") });
    await user.click(screen.getByTestId("item-copy"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renders shortcut text", async () => {
    const user = userEvent.setup();
    renderContextMenu();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("trigger") });
    expect(screen.getByText("⌘C")).toBeInTheDocument();
  });

  it("ContextMenuShortcut applies muted-foreground class", async () => {
    const user = userEvent.setup();
    renderContextMenu();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("trigger") });
    const shortcut = screen.getByText("⌘C");
    expect(shortcut.className).toContain("text-muted-foreground");
  });
});
