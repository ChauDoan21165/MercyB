import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

describe("NavigationMenu", () => {
  function renderNavMenu() {
    return render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger data-testid="trigger">Products</NavigationMenuTrigger>
            <NavigationMenuContent data-testid="content">
              <p>Product list here</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" data-testid="about-link">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  it("renders trigger and link", () => {
    renderNavMenu();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.getByTestId("about-link")).toBeInTheDocument();
  });

  it("link has correct href", () => {
    renderNavMenu();
    expect(screen.getByTestId("about-link")).toHaveAttribute("href", "/about");
  });

  it("renders NavigationMenuList as <ul>", () => {
    renderNavMenu();
    // NavigationMenuList renders a ul with list-none
    const list = document.querySelector("ul");
    expect(list).toBeInTheDocument();
    expect(list!.className).toContain("list-none");
  });

  it("trigger has default trigger style classes", () => {
    renderNavMenu();
    const trigger = screen.getByTestId("trigger");
    // trigger uses navigationMenuTriggerStyle() which includes bg-background
    expect(trigger.className).toContain("bg-background");
  });

  it("navigationMenuTriggerStyle exports a cva function that includes expected classes", () => {
    const cls = navigationMenuTriggerStyle();
    expect(cls).toContain("bg-background");
    expect(cls).toContain("rounded-md");
  });

  it("opens content on trigger click", async () => {
    const user = userEvent.setup();
    renderNavMenu();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Product list here")).toBeInTheDocument();
  });

  it("NavigationMenu root has relative z-10 class", () => {
    renderNavMenu();
    const root = document.querySelector("[class*='relative'][class*='z-10']");
    expect(root).toBeInTheDocument();
  });
});
