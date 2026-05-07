export const SUPPORTED_STRIPE_WEBHOOK_EVENT_TYPES = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
] as const;

export type SupportedStripeWebhookEventType =
  (typeof SUPPORTED_STRIPE_WEBHOOK_EVENT_TYPES)[number];

export function isSupportedStripeWebhookEventType(
  value: string,
): value is SupportedStripeWebhookEventType {
  return SUPPORTED_STRIPE_WEBHOOK_EVENT_TYPES.includes(
    value as SupportedStripeWebhookEventType,
  );
}
