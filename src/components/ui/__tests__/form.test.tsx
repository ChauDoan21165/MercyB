import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Wrapper component to test Form with react-hook-form context
function TestForm({
  defaultValues = { email: "" },
  rules = {},
}: {
  defaultValues?: Record<string, string>;
  rules?: Record<string, unknown>;
}) {
  const form = useForm({ defaultValues });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          rules={rules}
          render={({ field }) => (
            <FormItem>
              <FormLabel data-testid="form-label">Email</FormLabel>
              <FormControl>
                <Input {...field} data-testid="form-input" placeholder="Enter email" />
              </FormControl>
              <FormDescription data-testid="form-desc">Your email address</FormDescription>
              <FormMessage data-testid="form-message" />
            </FormItem>
          )}
        />
        <button type="submit" data-testid="submit-btn">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("renders FormLabel with correct text", () => {
    render(<TestForm />);
    expect(screen.getByTestId("form-label")).toHaveTextContent("Email");
  });

  it("FormLabel renders as a <label> element", () => {
    render(<TestForm />);
    expect(screen.getByTestId("form-label").tagName).toBe("LABEL");
  });

  it("FormControl renders the Input with formItemId", () => {
    render(<TestForm />);
    const input = screen.getByTestId("form-input");
    expect(input).toBeInTheDocument();
    // FormControl sets id to formItemId
    expect(input.id).toMatch(/form-item/);
  });

  it("FormLabel htmlFor matches Input id", () => {
    render(<TestForm />);
    const label = screen.getByTestId("form-label");
    const input = screen.getByTestId("form-input");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("FormDescription renders description text", () => {
    render(<TestForm />);
    expect(screen.getByTestId("form-desc")).toHaveTextContent("Your email address");
  });

  it("FormDescription has text-muted-foreground class", () => {
    render(<TestForm />);
    expect(screen.getByTestId("form-desc").className).toContain("text-muted-foreground");
  });

  it("FormMessage is not rendered when no error", () => {
    render(<TestForm />);
    // FormMessage returns null when no error and no children
    const msg = screen.queryByTestId("form-message");
    // it may be null or empty — just assert no error text shown
    if (msg) {
      expect(msg).toBeEmptyDOMElement();
    } else {
      expect(msg).not.toBeInTheDocument();
    }
  });

  it("FormMessage shows validation error after submit with required rule", async () => {
    const user = userEvent.setup();
    render(<TestForm rules={{ required: "Email is required" }} />);
    await user.click(screen.getByTestId("submit-btn"));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("FormLabel applies text-destructive class when field has error", async () => {
    const user = userEvent.setup();
    render(<TestForm rules={{ required: "Required" }} />);
    await user.click(screen.getByTestId("submit-btn"));
    await screen.findByText("Required");
    const label = screen.getByTestId("form-label");
    expect(label.className).toContain("text-destructive");
  });

  it("accepts user input into the controlled field", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    const input = screen.getByTestId("form-input");
    await user.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });
});
