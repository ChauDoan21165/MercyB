import { describe, expect, it, vi } from "vitest";
import { getAdminSecurityHealthAuthHeaders } from "../adminSecurityHealthAuth";

function clientWithSession(accessToken: string | null) {
  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: accessToken ? { access_token: accessToken } : null,
        },
        error: null,
      }),
    },
  };
}

describe("admin security health auth headers", () => {
  it("uses the current Supabase session token as the bearer token", async () => {
    const result = await getAdminSecurityHealthAuthHeaders(
      clientWithSession("admin-session-token"),
      "anon-key",
    );

    expect(result).toEqual({
      ok: true,
      headers: {
        apikey: "anon-key",
        Authorization: "Bearer admin-session-token",
      },
    });
  });

  it("does not send the anon key as bearer when no session exists", async () => {
    const result = await getAdminSecurityHealthAuthHeaders(
      clientWithSession(null),
      "anon-key",
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("missing_session");
    }
  });

  it("surfaces session lookup errors without building auth headers", async () => {
    const result = await getAdminSecurityHealthAuthHeaders(
      {
        auth: {
          getSession: vi.fn().mockResolvedValue({
            data: null,
            error: { message: "storage unavailable" },
          }),
        },
      },
      "anon-key",
    );

    expect(result).toEqual({
      ok: false,
      reason: "session_error",
      detail: "storage unavailable",
    });
  });
});
