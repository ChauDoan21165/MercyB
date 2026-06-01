import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

describe("AlertDialog", () => {
  function renderAlertDialog(onAction?: () => void, onCancel?: () => void) {
    return render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  it("renders trigger button", () => {
    renderAlertDialog();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("dialog not visible initially", () => {
    renderAlertDialog();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("opens alert dialog on trigger click", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("shows title and description when open", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("calls action callback when Confirm is clicked", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    renderAlertDialog(onAction);
    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Confirm"));
    expect(onAction).toHaveBeenCalled();
  });

  it("closes dialog after cancel click", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByTestId("trigger"));
    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("AlertDialogAction applies button variant class", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByTestId("trigger"));
    const btn = screen.getByText("Confirm");
    // buttonVariants() default includes bg-primary
    expect(btn.className).toContain("bg-primary");
  });

  it("AlertDialogCancel applies outline button class", async () => {
    const user = userEvent.setup();
    renderAlertDialog();
    await user.click(screen.getByTestId("trigger"));
    const btn = screen.getByText("Cancel");
    expect(btn.className).toContain("border");
  });
});
