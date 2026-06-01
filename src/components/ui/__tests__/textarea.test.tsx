import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/ui/textarea";

describe("ui/Textarea", () => {
  it("renders a <textarea> element", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("forwards placeholder", () => {
    render(<Textarea placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("can receive typed input", async () => {
    const user = userEvent.setup();
    render(<Textarea />);
    const ta = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.type(ta, "Hello World");
    expect(ta.value).toBe("Hello World");
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Textarea onChange={handler} />);
    await user.type(screen.getByRole("textbox"), "abc");
    expect(handler).toHaveBeenCalled();
  });

  it("controlled value is respected", () => {
    render(<Textarea value="fixed value" onChange={vi.fn()} />);
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("fixed value");
  });

  it("disabled textarea cannot be edited", async () => {
    const user = userEvent.setup();
    render(<Textarea disabled />);
    const ta = screen.getByRole("textbox");
    expect(ta).toBeDisabled();
    await user.type(ta, "abc");
    expect((ta as HTMLTextAreaElement).value).toBe("");
  });

  it("forwards rows attribute", () => {
    render(<Textarea rows={5} data-testid="ta" />);
    expect(screen.getByTestId("ta")).toHaveAttribute("rows", "5");
  });

  it("forwards custom className", () => {
    render(<Textarea className="custom-ta" data-testid="ta2" />);
    expect(screen.getByTestId("ta2").className).toContain("custom-ta");
  });

  it("has base styling classes (rounded-md, border, bg-background)", () => {
    render(<Textarea data-testid="ta3" />);
    const el = screen.getByTestId("ta3");
    expect(el.className).toContain("rounded-md");
    expect(el.className).toContain("border");
    expect(el.className).toContain("bg-background");
  });

  it("has min-h class for minimum height", () => {
    render(<Textarea data-testid="ta4" />);
    expect(screen.getByTestId("ta4").className).toContain("min-h-[80px]");
  });

  it("handles aria-label", () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole("textbox", { name: "Bio" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null } as React.RefObject<HTMLTextAreaElement>;
    render(<Textarea ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });
});
