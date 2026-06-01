import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

describe("ui/RadioGroup", () => {
  it("renders a radiogroup role", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" id="a" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("renders individual radio items", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="apple" id="r1" aria-label="Apple" />
        <RadioGroupItem value="banana" id="r2" aria-label="Banana" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
  });

  it("selecting a radio sets it as checked", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup>
        <RadioGroupItem value="a" id="ra" aria-label="Option A" />
        <RadioGroupItem value="b" id="rb" aria-label="Option B" />
      </RadioGroup>,
    );
    const optA = screen.getByRole("radio", { name: "Option A" });
    await user.click(optA);
    expect(optA).toHaveAttribute("data-state", "checked");
  });

  it("only one item can be checked at a time (single select)", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup>
        <RadioGroupItem value="a" id="ra2" aria-label="Option A" />
        <RadioGroupItem value="b" id="rb2" aria-label="Option B" />
      </RadioGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Option A" }));
    await user.click(screen.getByRole("radio", { name: "Option B" }));

    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("data-state", "unchecked");
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute("data-state", "checked");
  });

  it("onValueChange is called with the selected value", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <RadioGroup onValueChange={handler}>
        <RadioGroupItem value="foo" id="rfoo" aria-label="Foo" />
      </RadioGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Foo" }));
    expect(handler).toHaveBeenCalledWith("foo");
  });

  it("controlled value prop is respected", () => {
    render(
      <RadioGroup value="b">
        <RadioGroupItem value="a" id="rc1" aria-label="Option A" />
        <RadioGroupItem value="b" id="rc2" aria-label="Option B" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Option B" })).toHaveAttribute("data-state", "checked");
    expect(screen.getByRole("radio", { name: "Option A" })).toHaveAttribute("data-state", "unchecked");
  });

  it("disabled item is not interactive", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <RadioGroup onValueChange={handler}>
        <RadioGroupItem value="x" id="rdisabled" aria-label="Disabled Option" disabled />
      </RadioGroup>,
    );
    const radio = screen.getByRole("radio", { name: "Disabled Option" });
    expect(radio).toBeDisabled();
    await user.click(radio);
    expect(handler).not.toHaveBeenCalled();
  });

  it("forwards className to RadioGroup", () => {
    render(
      <RadioGroup className="custom-group" data-testid="rg">
        <RadioGroupItem value="a" id="rtest" aria-label="A" />
      </RadioGroup>,
    );
    expect(screen.getByTestId("rg").className).toContain("custom-group");
  });

  it("works with a Label association", () => {
    render(
      <RadioGroup>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id="yes-radio" />
          <Label htmlFor="yes-radio">Yes</Label>
        </div>
      </RadioGroup>,
    );
    expect(screen.getByLabelText("Yes")).toBeInTheDocument();
  });
});
