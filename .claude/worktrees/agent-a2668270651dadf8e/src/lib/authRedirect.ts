const DANGEROUS_PROTOCOLS = /^(data|javascript|vbscript|file|about):/i;

export function stripControlChars(value: string): string {
  if (!value) return "";
  return Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 32 && code !== 127;
    })
    .join("");
}

export function sanitizeParam(value: string): string {
  if (!value) return "";
  const cleaned = stripControlChars(value).trim();
  if (!cleaned) return "";

  if (DANGEROUS_PROTOCOLS.test(cleaned)) return "";
  if (cleaned.startsWith("//")) return "";
  if (cleaned.includes("\\")) return "";
  if (cleaned.includes("\0")) return "";

  return cleaned;
}

export function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (path.includes("/../") || path.endsWith("/..") || path.includes("/./")) return false;
  return true;
}

export function safeParseReturnTo(search: string): string | null {
  try {
    const sp = new URLSearchParams(search || "");
    const raw = sp.get("returnTo");
    if (!raw) return null;

    const trimmed = sanitizeParam(raw);
    if (!trimmed) return null;

    if (isSafeRelativePath(trimmed)) return trimmed;

    const u = new URL(trimmed, window.location.origin);
    if (u.origin !== window.location.origin) return null;

    const path = `${u.pathname}${u.search}${u.hash}`;
    return isSafeRelativePath(path) ? path : null;
  } catch {
    return null;
  }
}

export function toSafeAppPath(returnTo: string | null): string | null {
  if (!returnTo) return null;
  const trimmed = sanitizeParam(returnTo);
  if (!trimmed) return null;

  if (isSafeRelativePath(trimmed)) return trimmed;

  try {
    const u = new URL(trimmed, window.location.origin);
    if (u.origin !== window.location.origin) return null;
    const path = `${u.pathname}${u.search}${u.hash}`;
    return isSafeRelativePath(path) ? path : null;
  } catch {
    return null;
  }
}

export function resolveAppFromReturnTo(
  returnTo: string | null,
): { key: string; label: string } | null {
  if (!returnTo) return null;
  const s = returnTo.toLowerCase();

  if (s.includes("mercy-ai-builder") || s.includes("ai-builder")) {
    return { key: "mercy_ai_builder", label: "Mercy AI Builder" };
  }
  if (s.includes("mercy-signal") || s.includes("mercysignal")) {
    return { key: "mercy_signal", label: "Mercy Signal" };
  }
  return null;
}

export function readSearchFlag(search: string, key: string): boolean {
  try {
    const sp = new URLSearchParams(search || "");
    return sp.get(key) === "1";
  } catch {
    return false;
  }
}

/**
 * Auth-redirect error envelope. Supabase routes failures from the email
 * link / OAuth provider back via either the query string or the URL
 * fragment, so we check both. `code` carries the discriminator we care
 * about (e.g. `otp_expired`, `access_denied`); `error` is the broader
 * category; `desc` is the human-readable text from the provider.
 */
export type AuthRedirectError = {
  error: string;
  code: string;
  desc: string;
};

function parseErrorFromParams(
  sp: URLSearchParams,
): AuthRedirectError | null {
  const e = (sp.get("error") || "").trim();
  const c = (sp.get("error_code") || "").trim();
  const d = (sp.get("error_description") || "").trim();
  if (!e && !c && !d) return null;
  return { error: e, code: c, desc: d };
}

export function readAuthRedirectError(
  search: string,
  hash?: string,
): AuthRedirectError | null {
  try {
    const fromQuery = parseErrorFromParams(new URLSearchParams(search || ""));
    if (fromQuery) return fromQuery;

    // Supabase sometimes returns errors in the URL fragment (#error=...).
    const rawHash = (hash || "").replace(/^#/, "");
    if (rawHash) return parseErrorFromParams(new URLSearchParams(rawHash));

    return null;
  } catch {
    return null;
  }
}

/**
 * Bilingual user-facing copy for an auth-redirect error. Vietnamese first
 * because the primary user base is Vietnamese.
 *
 * Returns { vi, en } so callers can render either side or both.
 */
export function mapAuthRedirectError(
  err: AuthRedirectError | null,
): { vi: string; en: string } | null {
  if (!err) return null;

  const code = err.code.toLowerCase();
  const error = err.error.toLowerCase();
  const descLower = err.desc.toLowerCase();

  const looksExpired =
    code === "otp_expired" ||
    descLower.includes("invalid or has expired") ||
    descLower.includes("expired");

  const looksAccessDenied = error === "access_denied";

  if (looksExpired) {
    return {
      vi: "Link đã hết hạn hoặc đã được dùng. Hãy yêu cầu mã mới và nhập trực tiếp vào trang này.",
      en: "Link expired or already used. Request a new code and type it in here.",
    };
  }

  if (looksAccessDenied) {
    return {
      vi: "Đăng nhập chưa hoàn tất. Hãy yêu cầu mã mới và nhập trực tiếp vào trang này.",
      en: "Sign-in didn't complete. Request a new code and type it in here.",
    };
  }

  // Fallback: surface whatever the provider sent without the misleading
  // "OAuth" prefix. Vietnamese first, English on the next line.
  const detail = err.desc || err.error || err.code;
  return {
    vi: `Đăng nhập gặp lỗi.${detail ? ` Chi tiết: ${detail}` : ""}`,
    en: `Sign-in failed.${detail ? ` Details: ${detail}` : ""}`,
  };
}

/**
 * @deprecated use {@link readAuthRedirectError}. Kept for any external
 * caller that imports the old name; reads only query string, only the
 * legacy two fields.
 */
export function readOAuthErrorFromSearch(
  search: string,
): { error: string; desc: string } | null {
  const parsed = readAuthRedirectError(search);
  if (!parsed) return null;
  return { error: parsed.error, desc: parsed.desc };
}