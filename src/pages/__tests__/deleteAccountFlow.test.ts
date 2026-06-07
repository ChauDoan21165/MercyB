import { describe, expect, it, vi, beforeEach } from "vitest";
import { runDeleteAccountFlow } from "../account/deleteAccountFlow";

const deps = {
  getSession: vi.fn(),
  invokeDeleteAccount: vi.fn(),
  signOut: vi.fn(),
  navigate: vi.fn(),
  setDeleteError: vi.fn(),
};

describe("Account delete-account flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deps.getSession.mockResolvedValue({
      data: { session: { access_token: "test-access-token" } },
    });
    deps.invokeDeleteAccount.mockResolvedValue({ error: null });
    deps.signOut.mockResolvedValue(undefined);
  });

  it("invokes the delete-account function with the authenticated bearer token", async () => {
    await runDeleteAccountFlow(deps);

    expect(deps.invokeDeleteAccount).toHaveBeenCalledWith("delete-account", {
      body: {},
      headers: { Authorization: "Bearer test-access-token" },
    });
    expect(deps.signOut).toHaveBeenCalledTimes(1);
    expect(deps.navigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("routes AAL2-required responses through the existing challenge page", async () => {
    const response = new Response(
      JSON.stringify({ error: "aal2_required" }),
      { headers: { "content-type": "application/json" } },
    );
    deps.invokeDeleteAccount.mockResolvedValue({
      error: Object.assign(new Error("AAL2 required"), { context: response }),
    });

    await runDeleteAccountFlow(deps);

    expect(deps.setDeleteError).toHaveBeenCalledWith(
      expect.stringContaining("xác thực mã 2FA"),
    );
    expect(deps.navigate).toHaveBeenCalledWith("/auth/challenge?next=/account");
    expect(deps.signOut).not.toHaveBeenCalled();
  });
});
