import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

describe("DropdownMenu", () => {
  function renderDropdown(onSelect?: () => void) {
    return render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Options</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSelect} data-testid="item-profile">
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="item-settings">Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  it("renders the trigger button", () => {
    renderDropdown();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("menu items are not visible initially", () => {
    renderDropdown();
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("opens menu on trigger click", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("shows label, separator, and items when open", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("calls onClick when menu item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderDropdown(onSelect);
    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByTestId("item-profile"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renders keyboard shortcut text", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("⌘P")).toBeInTheDocument();
  });

  it("DropdownMenuShortcut applies tracking-widest class", async () => {
    const user = userEvent.setup();
    renderDropdown();
    await user.click(screen.getByTestId("trigger"));
    const shortcut = screen.getByText("⌘P");
    expect(shortcut.className).toContain("tracking-widest");
  });
});
