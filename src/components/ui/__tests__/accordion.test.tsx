import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

describe("Accordion", () => {
  function renderAccordion(type: "single" | "multiple" = "single") {
    return render(
      <Accordion type={type} collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  it("renders trigger buttons", () => {
    renderAccordion();
    expect(screen.getByRole("button", { name: /Section 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Section 2/i })).toBeInTheDocument();
  });

  it("content is hidden initially (collapsed)", () => {
    renderAccordion();
    // Content region is present but hidden (hidden attribute + data-state=closed)
    const regions = document.querySelectorAll("[role='region']");
    expect(regions.length).toBeGreaterThan(0);
    regions.forEach((r) => {
      expect(r).toHaveAttribute("data-state", "closed");
    });
  });

  it("opens accordion item on click", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
  });

  it("shows content after opening", async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.click(screen.getByRole("button", { name: /Section 1/i }));
    const content = screen.getByText("Content 1");
    expect(content.closest("[data-state]")).toHaveAttribute("data-state", "open");
  });

  it("collapses open item on second click (collapsible)", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = screen.getByRole("button", { name: /Section 1/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "open");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("data-state", "closed");
  });

  it("AccordionItem has border-b class", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="x" data-testid="item">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("item").className).toContain("border-b");
  });

  it("AccordionTrigger forwards custom className", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="x">
          <AccordionTrigger className="custom-trigger" data-testid="trig">T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId("trig").className).toContain("custom-trigger");
  });
});
