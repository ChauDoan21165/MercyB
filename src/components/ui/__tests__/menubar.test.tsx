import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar";

describe("Menubar", () => {
  function renderMenubar(onSelect?: () => void) {
    return render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger data-testid="file-trigger">File</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>File Options</MenubarLabel>
            <MenubarSeparator />
            <MenubarItem onClick={onSelect} data-testid="item-new">
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem data-testid="item-open">Open</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger data-testid="edit-trigger">Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  }

  it("renders the menubar container", () => {
    renderMenubar();
    // Menubar root has flex h-10 items-center class
    const file = screen.getByTestId("file-trigger");
    expect(file.closest("[class*='flex'][class*='h-10']")).toBeInTheDocument();
  });

  it("renders trigger buttons", () => {
    renderMenubar();
    expect(screen.getByTestId("file-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("edit-trigger")).toBeInTheDocument();
  });

  it("menu items not visible initially", () => {
    renderMenubar();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("opens menu content on trigger click", async () => {
    const user = userEvent.setup();
    renderMenubar();
    await user.click(screen.getByTestId("file-trigger"));
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("shows label, separator, and items when open", async () => {
    const user = userEvent.setup();
    renderMenubar();
    await user.click(screen.getByTestId("file-trigger"));
    expect(screen.getByText("File Options")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("calls onClick when menu item clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenubar(onSelect);
    await user.click(screen.getByTestId("file-trigger"));
    await user.click(screen.getByTestId("item-new"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renders shortcut text", async () => {
    const user = userEvent.setup();
    renderMenubar();
    await user.click(screen.getByTestId("file-trigger"));
    expect(screen.getByText("⌘N")).toBeInTheDocument();
  });

  it("Menubar applies h-10 border class", () => {
    renderMenubar();
    const trigger = screen.getByTestId("file-trigger");
    const root = trigger.closest("[class*='h-10']");
    expect(root).not.toBeNull();
    expect(root!.className).toContain("border");
  });
});
