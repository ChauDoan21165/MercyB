/**
 * Hardening tests for ProfileAvatarUpload.
 *
 * The component owns the full avatar-upload pipeline:
 *   validate (type + size) -> auth.getUser -> delete old -> upload ->
 *   getPublicUrl -> profiles.update -> onUploadSuccess + toast.
 *
 * Every Supabase boundary and the toast hook are mocked so the suite is
 * deterministic and hermetic (no network, no real storage). We exercise the
 * private `handleFileSelect` flow by opening the dialog and firing a `change`
 * event on the hidden file input — the only public seam into that logic.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// --- Shared, inspectable mock handles (hoisted above the vi.mock factory). ---
const h = vi.hoisted(() => {
  return {
    getUser: vi.fn(),
    remove: vi.fn(),
    upload: vi.fn(),
    getPublicUrl: vi.fn(),
    update: vi.fn(),
    eq: vi.fn(),
    toast: vi.fn(),
  };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: h.getUser,
    },
    storage: {
      from: vi.fn(() => ({
        remove: h.remove,
        upload: h.upload,
        getPublicUrl: h.getPublicUrl,
      })),
    },
    from: vi.fn(() => ({
      update: h.update,
    })),
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: h.toast }),
  toast: h.toast,
}));

import { ProfileAvatarUpload } from "@/components/ProfileAvatarUpload";

// --- Helpers ----------------------------------------------------------------

/**
 * Build a File with a precisely controlled MIME type and byte size.
 * jsdom derives `size` from content; for the 2MB boundary we override it
 * rather than allocating multi-megabyte buffers.
 */
function makeFile({
  name = "pic.png",
  type = "image/png",
  size = 1024,
}: { name?: string; type?: string; size?: number } = {}): File {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size, configurable: true });
  return file;
}

/** Reset every mock to a known-good "happy path" baseline. */
function primeHappyPath(userId = "user-123") {
  h.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null });
  h.remove.mockResolvedValue({ data: [], error: null });
  h.upload.mockResolvedValue({ error: null });
  h.getPublicUrl.mockReturnValue({
    data: { publicUrl: "https://cdn.example.com/avatars/user-123/avatar.png" },
  });
  h.eq.mockResolvedValue({ error: null });
  h.update.mockReturnValue({ eq: h.eq });
}

/** Open the dialog and return the hidden file <input>. */
function openAndGetInput(): HTMLInputElement {
  fireEvent.click(screen.getByTitle("Change profile picture"));
  const input = document.getElementById("avatar-upload") as HTMLInputElement;
  expect(input).toBeTruthy();
  return input;
}

/** Fire a change event carrying the given files on a file input. */
function selectFiles(input: HTMLInputElement, files: File[]) {
  fireEvent.change(input, { target: { files } });
}

const noop = () => {};

beforeEach(() => {
  vi.clearAllMocks();
  primeHappyPath();
  // Silence the component's console.error on the error-path tests.
  vi.spyOn(console, "error").mockImplementation(noop);
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe("ProfileAvatarUpload — rendering", () => {
  it("renders the emoji placeholder when no avatar URL is provided", () => {
    render(<ProfileAvatarUpload onUploadSuccess={noop} />);
    expect(screen.getByText("👤")).toBeInTheDocument();
    expect(screen.queryByAltText("Profile")).not.toBeInTheDocument();
  });

  it("renders the current avatar image when a URL is provided", () => {
    render(
      <ProfileAvatarUpload
        currentAvatarUrl="https://cdn.example.com/a/b.png"
        onUploadSuccess={noop}
      />,
    );
    const img = screen.getByAltText("Profile") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://cdn.example.com/a/b.png");
  });

  it("treats null currentAvatarUrl like the missing case", () => {
    render(<ProfileAvatarUpload currentAvatarUrl={null} onUploadSuccess={noop} />);
    expect(screen.getByText("👤")).toBeInTheDocument();
  });

  it("opens the dialog and shows the Choose Image control plus a preview", () => {
    render(
      <ProfileAvatarUpload
        currentAvatarUrl="https://cdn.example.com/a/b.png"
        onUploadSuccess={noop}
      />,
    );
    openAndGetInput();
    expect(screen.getByText("Change Profile Picture")).toBeInTheDocument();
    expect(screen.getByText("Choose Image")).toBeInTheDocument();
    // Dialog preview uses alt="Current avatar".
    expect(screen.getByAltText("Current avatar")).toBeInTheDocument();
  });

  it("exposes the file input restricted to images", () => {
    render(<ProfileAvatarUpload onUploadSuccess={noop} />);
    const input = openAndGetInput();
    expect(input.type).toBe("file");
    expect(input.accept).toBe("image/*");
  });
});

// ---------------------------------------------------------------------------
// Validation / early returns
// ---------------------------------------------------------------------------
describe("ProfileAvatarUpload — input validation", () => {
  it("does nothing when no file is selected (empty file list)", () => {
    render(<ProfileAvatarUpload onUploadSuccess={noop} />);
    const input = openAndGetInput();
    selectFiles(input, []);
    expect(h.toast).not.toHaveBeenCalled();
    expect(h.getUser).not.toHaveBeenCalled();
  });

  it("rejects a non-image file with a destructive toast and no upload", async () => {
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile({ name: "doc.pdf", type: "application/pdf" })]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Invalid file type",
          variant: "destructive",
        }),
      ),
    );
    expect(h.getUser).not.toHaveBeenCalled();
    expect(h.upload).not.toHaveBeenCalled();
    expect(onUploadSuccess).not.toHaveBeenCalled();
  });

  it("rejects a file larger than 2MB with a destructive toast", async () => {
    render(<ProfileAvatarUpload onUploadSuccess={noop} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile({ size: 2 * 1024 * 1024 + 1 })]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "File too large",
          variant: "destructive",
        }),
      ),
    );
    expect(h.upload).not.toHaveBeenCalled();
  });

  it("accepts a file at exactly the 2MB boundary (size is not > limit)", async () => {
    render(<ProfileAvatarUpload onUploadSuccess={noop} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile({ size: 2 * 1024 * 1024 })]);

    // Boundary value passes validation and proceeds to auth.
    await waitFor(() => expect(h.upload).toHaveBeenCalled());
    expect(h.toast).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: "File too large" }),
    );
  });
});

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------
describe("ProfileAvatarUpload — successful upload", () => {
  it("uploads, updates the profile, fires the callback, and toasts success", async () => {
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile({ name: "me.png", type: "image/png" })]);

    await waitFor(() => expect(onUploadSuccess).toHaveBeenCalledTimes(1));

    const publicUrl = "https://cdn.example.com/avatars/user-123/avatar.png";
    expect(onUploadSuccess).toHaveBeenCalledWith(publicUrl);

    // Upload path keyed by user id + original extension, upsert enabled.
    expect(h.upload).toHaveBeenCalledWith(
      "user-123/avatar.png",
      expect.any(File),
      { upsert: true },
    );

    // Profile row updated with the resolved public URL, scoped to the user.
    expect(h.update).toHaveBeenCalledWith({ avatar_url: publicUrl });
    expect(h.eq).toHaveBeenCalledWith("id", "user-123");

    expect(h.toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Success!" }),
    );
  });

  it("derives the file extension from the original file name", async () => {
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile({ name: "holiday.snap.JPEG", type: "image/jpeg" })]);

    await waitFor(() =>
      expect(h.upload).toHaveBeenCalledWith(
        "user-123/avatar.JPEG",
        expect.any(File),
        { upsert: true },
      ),
    );
  });

  it("does not attempt to remove an old avatar when none exists", async () => {
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() => expect(h.upload).toHaveBeenCalled());
    expect(h.remove).not.toHaveBeenCalled();
  });

  it("removes the previous avatar (last two path segments) before uploading", async () => {
    render(
      <ProfileAvatarUpload
        currentAvatarUrl="https://cdn.example.com/storage/v1/object/public/avatars/user-123/avatar.png"
        onUploadSuccess={vi.fn()}
      />,
    );
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() => expect(h.remove).toHaveBeenCalled());
    expect(h.remove).toHaveBeenCalledWith(["user-123/avatar.png"]);
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
describe("ProfileAvatarUpload — error handling", () => {
  it("toasts an upload failure when the user is not authenticated", async () => {
    h.getUser.mockResolvedValue({ data: { user: null }, error: null });
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Upload failed",
          variant: "destructive",
        }),
      ),
    );
    expect(h.upload).not.toHaveBeenCalled();
    expect(onUploadSuccess).not.toHaveBeenCalled();
  });

  it("surfaces a storage upload error without updating the profile", async () => {
    h.upload.mockResolvedValue({ error: new Error("storage boom") });
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Upload failed", variant: "destructive" }),
      ),
    );
    expect(h.update).not.toHaveBeenCalled();
    expect(onUploadSuccess).not.toHaveBeenCalled();
  });

  it("surfaces a profile-update error and does not fire the success callback", async () => {
    h.eq.mockResolvedValue({ error: new Error("update boom") });
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Upload failed", variant: "destructive" }),
      ),
    );
    expect(onUploadSuccess).not.toHaveBeenCalled();
  });

  it("handles a rejected getUser promise gracefully (caught, toasted)", async () => {
    h.getUser.mockRejectedValue(new Error("network down"));
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Upload failed", variant: "destructive" }),
      ),
    );
  });

  it("logs the underlying error to the console for diagnostics", async () => {
    h.upload.mockResolvedValue({ error: new Error("diagnostic boom") });
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        "Error uploading avatar:",
        expect.any(Error),
      ),
    );
  });
});

// ---------------------------------------------------------------------------
// Side effects / state cleanup
// ---------------------------------------------------------------------------
describe("ProfileAvatarUpload — post-upload state", () => {
  it("resets the file input value after a successful upload", async () => {
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() => expect(h.upload).toHaveBeenCalled());
    await waitFor(() => expect(input.value).toBe(""));
  });

  it("resets the file input value even when the upload fails", async () => {
    h.upload.mockResolvedValue({ error: new Error("boom") });
    render(<ProfileAvatarUpload onUploadSuccess={vi.fn()} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() =>
      expect(h.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Upload failed" }),
      ),
    );
    await waitFor(() => expect(input.value).toBe(""));
  });

  it("does not call onUploadSuccess more than once per successful upload", async () => {
    const onUploadSuccess = vi.fn();
    render(<ProfileAvatarUpload onUploadSuccess={onUploadSuccess} />);
    const input = openAndGetInput();
    selectFiles(input, [makeFile()]);

    await waitFor(() => expect(onUploadSuccess).toHaveBeenCalledTimes(1));
    // Give any stray microtasks a chance to (incorrectly) re-fire.
    await Promise.resolve();
    expect(onUploadSuccess).toHaveBeenCalledTimes(1);
    cleanup();
  });
});
