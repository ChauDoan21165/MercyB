export type StripeWebhookRuntimeEnvironment = "production" | "sandbox";

export type SandboxStripeWebhookFailure =
  | "missing_subscription_id"
  | "missing_customer_id"
  | "unresolved_user"
  | "invoice_missing_subscription_id"
  | "invoice_unresolved_user"
  | "invoice_missing_customer_id";

export type SandboxStripeWebhookIgnoreReason =
  | "sandbox_missing_subscription_id"
  | "sandbox_missing_customer_id"
  | "sandbox_unresolved_user"
  | "sandbox_invoice_missing_subscription_id"
  | "sandbox_invoice_unresolved_user"
  | "sandbox_invoice_missing_customer_id";

const SANDBOX_IGNORE_REASONS: Record<
  SandboxStripeWebhookFailure,
  SandboxStripeWebhookIgnoreReason
> = {
  missing_subscription_id: "sandbox_missing_subscription_id",
  missing_customer_id: "sandbox_missing_customer_id",
  unresolved_user: "sandbox_unresolved_user",
  invoice_missing_subscription_id: "sandbox_invoice_missing_subscription_id",
  invoice_unresolved_user: "sandbox_invoice_unresolved_user",
  invoice_missing_customer_id: "sandbox_invoice_missing_customer_id",
};

export function getSandboxStripeWebhookIgnoreReason(
  environment: StripeWebhookRuntimeEnvironment,
  failure: SandboxStripeWebhookFailure,
): SandboxStripeWebhookIgnoreReason | null {
  if (environment !== "sandbox") {
    return null;
  }

  return SANDBOX_IGNORE_REASONS[failure];
}
