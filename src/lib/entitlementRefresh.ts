export const ENTITLEMENT_REFRESH_EVENT = "mercyblade:entitlement-refresh";

export function dispatchEntitlementRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ENTITLEMENT_REFRESH_EVENT));
}

export function subscribeToEntitlementRefresh(
  listener: () => void
): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(ENTITLEMENT_REFRESH_EVENT, listener);
  return () => window.removeEventListener(ENTITLEMENT_REFRESH_EVENT, listener);
}
