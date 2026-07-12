export type ExplorerActionKind = "navigate" | "click" | "fill-submit";

export type CandidateAction = {
  kind: ExplorerActionKind;
  route: string;
  label: string;
  role?: string;
  href?: string | null;
  inputKind?: "tutor-chat" | "search" | "other";
};

export type PolicyDecision =
  | { allow: true; reason: string }
  | { allow: false; reason: string; hardDeny: boolean };

const DENY_PATTERNS: RegExp[] = [
  /(^|\/)admin(\/|$)/i,
  /checkout|payment|billing|stripe|subscribe|upgrade|pricing|invoice|receipt/i,
  /delete|remove account|close account|erase|xo\u00e1 t\u00e0i kho\u1ea3n|x\u00f3a t\u00e0i kho\u1ea3n/i,
  /settings|preferences|profile|security|mfa|password/i,
  /logout|log out|sign out|\u0111\u0103ng xu\u1ea5t/i,
  /publish|invite|redeem|apply|confirm|approve|cancel subscription/i,
];

const SAFE_LINK_OR_TAB_ROLES = new Set(["link", "tab", "menuitem"]);

export function denyReason(text: string): string | null {
  const hit = DENY_PATTERNS.find((pattern) => pattern.test(text));
  return hit ? `hard-deny:${hit.source}` : null;
}

export function routeIsDenied(route: string): string | null {
  const pathname = safePath(route);
  return denyReason(pathname);
}

export function safePath(urlOrPath: string): string {
  try {
    const url = new URL(urlOrPath, "https://mercyblade.com");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return urlOrPath || "/";
  }
}

export function classifyInput(placeholderOrLabel: string, route: string): CandidateAction["inputKind"] {
  const text = `${placeholderOrLabel} ${route}`.toLowerCase();
  if (/ai-tutor|roleplay|reply|mercy|chat|correct|s\u1eeda c\u00e2u|c\u00e2u tr\u1ea3 l\u1eddi|answer|sentence/.test(text)) return "tutor-chat";
  if (/search|t\u00ecm ki\u1ebfm|find/.test(text)) return "search";
  return "other";
}

export function decideAction(action: CandidateAction): PolicyDecision {
  const targetText = [action.route, action.href ?? "", action.label, action.role ?? ""].join(" ");
  const denied = denyReason(targetText);
  if (denied) return { allow: false, hardDeny: true, reason: denied };

  if (action.kind === "navigate") return { allow: true, reason: "navigation" };

  if (action.kind === "click") {
    if (action.role && SAFE_LINK_OR_TAB_ROLES.has(action.role)) return { allow: true, reason: `safe-${action.role}` };
    if (/dialog|modal|details|more|info|help|learn/i.test(action.label)) return { allow: true, reason: "safe-modal-open" };
    return { allow: false, hardDeny: false, reason: "click-role-not-allowlisted" };
  }

  if (action.kind === "fill-submit") {
    if (action.inputKind === "tutor-chat" || action.inputKind === "search") {
      return { allow: true, reason: `safe-${action.inputKind}` };
    }
    return { allow: false, hardDeny: false, reason: "fill-submit-input-not-allowlisted" };
  }

  return { allow: false, hardDeny: false, reason: "unknown-action" };
}

export function assertNoDeniedRoute(route: string): void {
  const reason = routeIsDenied(route);
  if (reason) throw new Error(`R3 denylist violation: navigated to denied route ${route} (${reason})`);
}
