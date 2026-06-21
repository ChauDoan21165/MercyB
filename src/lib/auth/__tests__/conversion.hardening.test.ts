// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
const refreshSession = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
      refreshSession: (...args: unknown[]) => refreshSession(...args),
    },
  },
}));

import {
  convertWithEmail,
  mergeAnonIntoPermanent,
  type ConvertEmailResult,
  type ConvertOAuthResult,
  type EmailErrorCode,
  type OAuthErrorCode,
} from "../conversion";

const emailErrorCodes: EmailErrorCode[] = [
  "email_in_use",
  "email_invalid",
  "password_invalid",
  "anon_required",
  "supabase_error",
  "unknown",
];
const oauthErrorCodes: OAuthErrorCode[] = ["same_id", "anon_required", "rpc_error", "unknown"];

function sessionWithToken(token = "access-token-1") {
  getSession.mockResolvedValue({
    data: { session: { access_token: token } },
  });
}

function sessionWithoutToken() {
  getSession.mockResolvedValue({
    data: { session: null },
  });
}

function mockJsonResponse(body: unknown, init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

function mockJsonThrowingResponse(init: { ok?: boolean; status?: number } = {}) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: vi.fn().mockRejectedValue(new Error("bad json")),
  } as unknown as Response;
}

function fetchMock() {
  return vi.mocked(globalThis.fetch);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.stubEnv("VITE_SUPABASE_URL", "");
  vi.stubGlobal("fetch", vi.fn());
  refreshSession.mockResolvedValue({ data: { session: null }, error: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("conversion exported type contracts", () => {
  it("keeps all exported discriminated result and error-code types usable", () => {
    const emailOk: ConvertEmailResult = { kind: "ok", userId: "user-1" };
    const emailTransport: ConvertEmailResult = { kind: "transport_error", httpStatus: 503 };
    const emailError: ConvertEmailResult = {
      kind: "error",
      code: emailErrorCodes[0],
      messageVi: "Email da duoc dung",
      messageEn: "Email is already in use",
    };
    const oauthOk: ConvertOAuthResult = {
      kind: "ok",
      userId: "permanent-1",
      rowsMigratedTotal: 12,
    };
    const oauthTransport: ConvertOAuthResult = { kind: "transport_error" };
    const oauthError: ConvertOAuthResult = {
      kind: "error",
      code: oauthErrorCodes[0],
      messageVi: "Trung tai khoan",
      messageEn: "Same account",
    };

    expect(emailErrorCodes).toEqual([
      "email_in_use",
      "email_invalid",
      "password_invalid",
      "anon_required",
      "supabase_error",
      "unknown",
    ]);
    expect(oauthErrorCodes).toEqual(["same_id", "anon_required", "rpc_error", "unknown"]);
    expect([emailOk, emailTransport, emailError, oauthOk, oauthTransport, oauthError]).toHaveLength(6);
  });
});

describe("convertWithEmail", () => {
  it("returns transport_error and does not fetch when no access token is present", async () => {
    sessionWithoutToken();

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "transport_error",
    });
    expect(fetchMock()).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("propagates session lookup failures before attempting the network call", async () => {
    getSession.mockRejectedValue(new Error("session store unavailable"));

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).rejects.toThrow(
      "session store unavailable",
    );
    expect(fetchMock()).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("posts credentials to the default edge-function URL with bearer auth", async () => {
    sessionWithToken("email-token");
    fetchMock().mockResolvedValue(
      mockJsonResponse({ ok: true, user_id: "same-user-id" }),
    );

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "ok",
      userId: "same-user-id",
    });

    expect(fetchMock()).toHaveBeenCalledWith(
      expect.stringMatching(/\/functions\/v1\/account-convert\/email$/), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer email-token",
      },
      body: JSON.stringify({ email: "learner@example.com", password: "Passw0rd!" }),
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("uses VITE_SUPABASE_URL and trims one trailing slash", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://project.supabase.co/");
    sessionWithToken("token-for-url");
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: true, user_id: "u-url" }));

    await convertWithEmail("learner@example.com", "Passw0rd!");

    expect(fetchMock()).toHaveBeenCalledWith(
      expect.stringMatching(/\/functions\/v1\/account-convert\/email$/),
      expect.any(Object),
    );
  });

  it("returns transport_error when fetch rejects", async () => {
    sessionWithToken();
    fetchMock().mockRejectedValue(new Error("network down"));

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "transport_error",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("returns transport_error with status for non-200 HTTP failures", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ error: "forbidden" }, { ok: false, status: 403 }));

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "transport_error",
      httpStatus: 403,
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("still parses a status-200 response even if ok is false", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(
      mockJsonResponse({ ok: true, user_id: "status-200-user" }, { ok: false, status: 200 }),
    );

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "ok",
      userId: "status-200-user",
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("returns transport_error with status when JSON parsing fails", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonThrowingResponse({ status: 202 }));

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "transport_error",
      httpStatus: 202,
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("maps structured email error bodies without refreshing the session", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(
      mockJsonResponse({
        ok: false,
        error_code: "password_invalid",
        message_vi: "Mat khau qua ngan",
        message_en: "Password is too short",
      }),
    );

    await expect(convertWithEmail("learner@example.com", "short")).resolves.toEqual({
      kind: "error",
      code: "password_invalid",
      messageVi: "Mat khau qua ngan",
      messageEn: "Password is too short",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("defaults missing email error fields to unknown code and empty messages", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: false }));

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "error",
      code: "unknown",
      messageVi: "",
      messageEn: "",
    });
  });

  it("treats ok bodies missing string user_id as application errors", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(
      mockJsonResponse({ ok: true, user_id: 123, message_en: "Missing user id" }),
    );

    await expect(convertWithEmail("learner@example.com", "Passw0rd!")).resolves.toEqual({
      kind: "error",
      code: "unknown",
      messageVi: "",
      messageEn: "Missing user id",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });
});

describe("mergeAnonIntoPermanent", () => {
  it("returns transport_error and does not fetch when no access token is present", async () => {
    sessionWithoutToken();

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "transport_error",
    });
    expect(fetchMock()).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("propagates session lookup failures before attempting the merge call", async () => {
    getSession.mockRejectedValue(new Error("session store unavailable"));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).rejects.toThrow(
      "session store unavailable",
    );
    expect(fetchMock()).not.toHaveBeenCalled();
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("posts merge payload to the OAuth merge endpoint with bearer auth", async () => {
    sessionWithToken("oauth-token");
    fetchMock().mockResolvedValue(
      mockJsonResponse({ ok: true, user_id: "permanent-user", rows_migrated_total: 9 }),
    );

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "ok",
      userId: "permanent-user",
      rowsMigratedTotal: 9,
    });

    expect(fetchMock()).toHaveBeenCalledWith(
      expect.stringMatching(/\/functions\/v1\/account-convert\/oauth-merge$/), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer oauth-token",
      },
      body: JSON.stringify({ permanentUserId: "permanent-user", source: "google" }),
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it("supports apple and other source values in the request body", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: true, user_id: "u-apple" }));
    await mergeAnonIntoPermanent("u-apple", "apple");
    expect(fetchMock()).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ permanentUserId: "u-apple", source: "apple" }),
      }),
    );

    vi.clearAllMocks();
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: true, user_id: "u-other" }));
    await mergeAnonIntoPermanent("u-other", "other");
    expect(fetchMock()).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ permanentUserId: "u-other", source: "other" }),
      }),
    );
  });

  it("uses VITE_SUPABASE_URL for the OAuth merge endpoint", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://project.supabase.co");
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: true, user_id: "u-oauth-url" }));

    await mergeAnonIntoPermanent("u-oauth-url", "google");

    expect(fetchMock()).toHaveBeenCalledWith(
      expect.stringMatching(/\/functions\/v1\/account-convert\/oauth-merge$/),
      expect.any(Object),
    );
  });

  it("defaults a missing rows_migrated_total value to zero", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: true, user_id: "permanent-user" }));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "ok",
      userId: "permanent-user",
      rowsMigratedTotal: 0,
    });
  });

  it("ignores a non-number rows_migrated_total value", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(
      mockJsonResponse({ ok: true, user_id: "permanent-user", rows_migrated_total: "7" }),
    );

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "ok",
      userId: "permanent-user",
      rowsMigratedTotal: 0,
    });
  });

  it("returns transport_error when fetch rejects", async () => {
    sessionWithToken();
    fetchMock().mockRejectedValue(new Error("offline"));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "transport_error",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("returns transport_error with status for non-200 HTTP failures", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ error: "bad gateway" }, { ok: false, status: 502 }));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "transport_error",
      httpStatus: 502,
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("returns transport_error with status when OAuth JSON parsing fails", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonThrowingResponse({ status: 200 }));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "transport_error",
      httpStatus: 200,
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("maps structured OAuth error bodies without refreshing the session", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(
      mockJsonResponse({
        ok: false,
        error_code: "same_id",
        message_vi: "Tai khoan dich trung tai khoan an danh",
        message_en: "Permanent user matches anonymous user",
      }),
    );

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "error",
      code: "same_id",
      messageVi: "Tai khoan dich trung tai khoan an danh",
      messageEn: "Permanent user matches anonymous user",
    });
    expect(refreshSession).not.toHaveBeenCalled();
  });

  it("defaults missing OAuth error fields to unknown code and empty messages", async () => {
    sessionWithToken();
    fetchMock().mockResolvedValue(mockJsonResponse({ ok: false }));

    await expect(mergeAnonIntoPermanent("permanent-user", "google")).resolves.toEqual({
      kind: "error",
      code: "unknown",
      messageVi: "",
      messageEn: "",
    });
  });
});
