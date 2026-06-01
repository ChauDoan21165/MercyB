import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("ui/Tabs", () => {
  function renderTabs(onValueChange?: (v: string) => void) {
    return render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>,
    );
  }

  it("renders all tab triggers", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 3" })).toBeInTheDocument();
  });

  it("renders a tablist", () => {
    renderTabs();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("shows content for the default active tab", () => {
    renderTabs();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("default tab trigger is active (data-state=active)", () => {
    renderTabs();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "inactive");
  });

  it("clicking a different tab shows that tab's content", async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByText("Content 2")).toBeVisible();
  });

  it("clicking Tab 2 activates it", async () => {
    const user = userEvent.setup();
    renderTabs();
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "inactive");
  });

  it("onValueChange fires with the new tab value", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    renderTabs(handler);
    await user.click(screen.getByRole("tab", { name: "Tab 3" }));
    expect(handler).toHaveBeenCalledWith("tab3");
  });

  it("controlled value prop is respected", () => {
    render(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "active");
  });

  it("disabled tab cannot be activated", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={handler}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Tab 2" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("TabsList applies bg-muted class", () => {
    renderTabs();
    expect(screen.getByRole("tablist").className).toContain("bg-muted");
  });

  it("TabsContent forwards className", () => {
    render(
      <Tabs defaultValue="t1">
        <TabsList>
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1" className="custom-content" data-testid="tc">
          body
        </TabsContent>
      </Tabs>,
    );
    expect(screen.getByTestId("tc").className).toContain("custom-content");
  });
});
