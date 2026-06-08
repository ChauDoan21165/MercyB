type SessionResult = {
  data?: { session?: { access_token?: string | null } | null } | null;
};

type FunctionError = Error & {
  context?: Response;
};

type DeleteAccountDeps = {
  getSession: () => Promise<SessionResult>;
  invokeDeleteAccount: (
    name: "delete-account",
    options: { body: Record<string, never>; headers: { Authorization: string } },
  ) => Promise<{ error: FunctionError | null }>;
  signOut: () => Promise<unknown>;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  setDeleteError: (message: string | null) => void;
};

export async function runDeleteAccountFlow(deps: DeleteAccountDeps): Promise<void> {
  const { data: sessionData } = await deps.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("Not signed in.");

  const { error } = await deps.invokeDeleteAccount("delete-account", {
    body: {},
    headers: { Authorization: `Bearer ${token}` },
  });
  if (error) {
    let body: { error?: string; message?: string } | null = null;
    const ctx = error.context;
    if (ctx && typeof ctx.clone === "function") {
      try {
        body = await ctx.clone().json();
      } catch {
        /* non-JSON / already-consumed body — fall through */
      }
    }
    if (body?.error === "aal2_required") {
      deps.setDeleteError(
        "Vì xóa tài khoản là hành động không thể hoàn tác, bạn cần " +
          "xác thực mã 2FA. Đang chuyển đến trang xác thực…",
      );
      deps.navigate("/auth/challenge?next=/account");
      return;
    }
    if (body?.error === "aal_check_unavailable") {
      deps.setDeleteError(
        body.message ??
          "Không thể xác minh trạng thái bảo mật. Vui lòng thử lại sau.",
      );
      return;
    }
    throw error;
  }

  await deps.signOut();
  deps.navigate("/", { replace: true });
}
