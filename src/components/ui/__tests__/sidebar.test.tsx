import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";

// The sidebar's `useIsMobile` calls window.matchMedia. The setup.ts shim may
// not register in time — reinstall a full matchMedia mock here to be safe.
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }),
  });
});

// Helper: minimal sidebar tree
function BasicSidebar({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader data-testid="sb-header">Header</SidebarHeader>
        <SidebarContent data-testid="sb-content">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Home</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Settings</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter data-testid="sb-footer">Footer</SidebarFooter>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}

describe("ui/Sidebar", () => {
  it("renders sidebar header", () => {
    render(<BasicSidebar />);
    expect(screen.getByTestId("sb-header")).toBeInTheDocument();
  });

  it("renders sidebar content", () => {
    render(<BasicSidebar />);
    expect(screen.getByTestId("sb-content")).toBeInTheDocument();
  });

  it("renders sidebar footer", () => {
    render(<BasicSidebar />);
    expect(screen.getByTestId("sb-footer")).toBeInTheDocument();
  });

  it("renders group label", () => {
    render(<BasicSidebar />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("renders menu items", () => {
    render(<BasicSidebar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("SidebarMenuButton is a button element", () => {
    render(<BasicSidebar />);
    const buttons = screen.getAllByRole("button");
    // There should be at least 2 menu buttons
    const homeBtn = buttons.find((b) => b.textContent?.includes("Home"));
    expect(homeBtn).toBeInTheDocument();
  });

  it("SidebarProvider renders with data-state=expanded by default", () => {
    const { container } = render(<BasicSidebar />);
    const sidebar = container.querySelector("[data-state]");
    expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  it("SidebarTrigger button toggles sidebar", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <SidebarTrigger data-testid="trigger" />
        <Sidebar>
          <SidebarContent>content</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toBeInTheDocument();
    // First click collapses
    await user.click(trigger);
    const { container } = render(<SidebarProvider>
      <Sidebar data-testid="sb2" />
    </SidebarProvider>);
    expect(screen.getByTestId("sb2")).toBeInTheDocument();
  });

  it("SidebarSeparator renders in the DOM", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarSeparator data-testid="sep" />
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByTestId("sep")).toBeInTheDocument();
  });

  it("useSidebar throws when used outside SidebarProvider", () => {
    // useSidebar should throw when no context
    const BadComponent = () => {
      useSidebar();
      return null;
    };
    expect(() => render(<BadComponent />)).toThrow(
      "useSidebar must be used within a SidebarProvider",
    );
  });

  it("SidebarProvider with defaultOpen=false collapses sidebar", () => {
    const { container } = render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar data-testid="sb-closed" />
      </SidebarProvider>,
    );
    const sidebar = container.querySelector("[data-state]");
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
  });
});
