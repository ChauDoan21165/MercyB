export type ConversationEntitlementInput = {
  entitlement?: {
    is_premium?: unknown;
  } | null;
  adminLevel?: unknown;
};

export function resolveConversationEntitlementAccess(
  input: ConversationEntitlementInput,
): boolean {
  return input.entitlement?.is_premium === true || readAdminLevel(input.adminLevel) >= 9;
}

export function readAdminLevel(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
