import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StandardConfirmDialog } from "@/components/ui/StandardConfirmDialog";

describe("ui/StandardConfirmDialog", () => {
  it("does not render when open=false", () => {
    render(
      <StandardConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open=true", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("shows default English title and body when lang=en", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        lang="en"
      />,
    );
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
  });

  it("shows default Vietnamese title and body when lang=vi", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        lang="vi"
      />,
    );
    expect(screen.getByText("Bạn có chắc không?")).toBeInTheDocument();
    expect(screen.getByText("Hành động này không thể hoàn tác.")).toBeInTheDocument();
  });

  it("shows custom title and description when provided", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete room?"
        description="This will permanently remove the room."
      />,
    );
    expect(screen.getByText("Delete room?")).toBeInTheDocument();
    expect(screen.getByText("This will permanently remove the room.")).toBeInTheDocument();
  });

  it("renders Cancel and Confirm buttons (en)", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        lang="en"
      />,
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("renders Vietnamese Cancel and Confirm buttons (vi)", () => {
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        lang="vi"
      />,
    );
    expect(screen.getByRole("button", { name: "Hủy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xác nhận" })).toBeInTheDocument();
  });

  it("calls onConfirm when Confirm button clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        lang="en"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange(false) when Cancel button clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
        lang="en"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not call onConfirm when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <StandardConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        lang="en"
      />,
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
