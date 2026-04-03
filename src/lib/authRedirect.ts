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

export function readOAuthErrorFromSearch(
  search: string,
): { error: string; desc: string } | null {
  try {
    const sp = new URLSearchParams(search || "");
    const e = (sp.get("error") || "").trim();
    const d = (sp.get("error_description") || "").trim();
    if (!e && !d) return null;
    return { error: e, desc: d };
  } catch {
    return null;
  }
}