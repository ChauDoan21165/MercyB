// supabase/functions/stripe-webhook/index.ts
// deno-lint-ignore-file no-import-prefix

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import {
  NonRetryableWebhookError,
  asLowerNonEmptyStringOrNull,
  asNonEmptyStringOrNull,
  decodeJwtPayload,
  getServiceRoleKey,
  getSupabaseUrl,
  isSupportedEventType,
  json,
  logWebhook,
  ok200,
  stripeEnvironmentFromEvent,
  toIsoFromUnix,
} from "./core.ts";
import {
  attachInvoiceLookupPayload,
  buildCommonEmailAuditVariables,
  derivePlanDetails,
  fetchStripeSubscriptionById,
  finalizeSubscriptionProcessing,
  formatMoney,
  getCheckoutSessionPriceId,
  getInvoicePeriodRange,
  getInvoicePriceId,
  getInvoiceProductId,
  getSharedSubscriptionByProviderSubscriptionId,
  getSubscriptionPriceId,
  getSubscriptionProductId,
  hasProcessedEntitlementEvent,
  normalizeStripeSubscriptionStatus,
  resolveCheckoutCustomerEmail,
  resolveEmailRoute,
  resolveInvoiceCustomerEmail,
  resolveUserByStripeLinkage,
  resolveUserForInvoiceEvent,
  sendEmailOnce,
  syncProfileStripeCustomerIdBestEffort,
  upsertSharedSubscriptionMonotonic,
} from "./billing.ts";
import { getStripeWebhookSecrets, verifyStripeSignatureOrThrow } from "./stripe-signature.ts";
import {
  hasProcessedStripeWebhookEvent,
  markStripeWebhookEventProcessed,
  upsertStripeWebhookEventResult,
} from "./webhook-events.ts";
import type {
  CheckoutSessionLike,
  Database,
  InvoiceLike,
  SharedSubscriptionStatus,
  StripeWebhookEvent,
  SubscriptionLike,
} from "./types.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok200();

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const webhookSecrets = getStripeWebhookSecrets();
  const supabaseUrl = getSupabaseUrl();
  const serviceKey = getServiceRoleKey();

  const serviceKeyPayload = decodeJwtPayload(serviceKey);
  logWebhook("info", "runtime supabase target", {
    supabase_url: supabaseUrl || null,
    service_role_ref: serviceKeyPayload?.ref ?? null,
    service_role_role: serviceKeyPayload?.role ?? null,
  });

  if (!webhookSecrets.length) {
    return json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, 500);
  }

  if (!supabaseUrl || !serviceKey) {
    return json(
      {
        error:
          "Missing hosted Supabase config (PROJECT_SUPABASE_URL/VITE_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or PROJECT_SUPABASE_SERVICE_ROLE_KEY)",
      },
      500,
    );
  }

  const signatureHeader = req.headers.get("stripe-signature");
  if (!signatureHeader) {
    return json({ error: "Missing signature" }, 400);
  }

  const rawBuf = await req.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuf);

  try {
    let verified = false;
    let lastError: unknown = null;

    for (const webhookSecret of webhookSecrets) {
      try {
        await verifyStripeSignatureOrThrow({
          rawBodyBytes: rawBytes,
          sigHeader: signatureHeader,
          webhookSecret,
        });
        verified = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!verified) {
      throw lastError ?? new Error("Stripe signature mismatch");
    }
  } catch (error) {
    logWebhook("warn", "invalid stripe signature", {
      details: error instanceof Error ? error.message : String(error),
    });
    return json({ error: "Invalid signature" }, 400);
  }

  let event: StripeWebhookEvent;

  try {
    const rawText = new TextDecoder().decode(rawBytes);
    event = JSON.parse(rawText) as StripeWebhookEvent;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!event?.id) {
    return json({ error: "Stripe event missing id" }, 400);
  }

  if (!isSupportedEventType(event.type)) {
    return ok200();
  }

  logWebhook("info", "received stripe webhook", {
    event_id: event.id,
    event_type: event.type,
    livemode: typeof event.livemode === "boolean" ? event.livemode : null,
  });

  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  try {
    const alreadyProcessedStripeWebhookEvent =
      await hasProcessedStripeWebhookEvent(
        supabase,
        event.id,
      );

    if (alreadyProcessedStripeWebhookEvent) {
      logWebhook("info", "stripe event replay skipped", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_replayed_event",
      });
      return ok200();
    }

    const alreadyProcessed = await hasProcessedEntitlementEvent(
      supabase,
      event.id,
    );

    if (alreadyProcessed) {
      logWebhook("info", "entitlement event already processed", {
        event_id: event.id,
        event_type: event.type,
        action: "skip_already_processed",
      });
      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    const environment = stripeEnvironmentFromEvent(event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as CheckoutSessionLike;

      const mode = asLowerNonEmptyStringOrNull(session?.mode);
      const sessionStatus = asLowerNonEmptyStringOrNull(session?.status);
      const paymentStatus = asLowerNonEmptyStringOrNull(
        session?.payment_status,
      );

      if (
        mode !== "subscription" ||
        sessionStatus !== "complete" ||
        (paymentStatus !== "paid" && paymentStatus !== "no_payment_required")
      ) {
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const providerCustomerId = asNonEmptyStringOrNull(session?.customer);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        session?.subscription,
      );
      const checkoutEmail = resolveCheckoutCustomerEmail(session);

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: session?.metadata?.supabase_user_id ?? null,
        metadataUserId: session?.metadata?.user_id ?? null,
        clientReferenceId: session?.client_reference_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: checkoutEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "checkout.session.completed user resolution failed",
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      if (!providerSubscriptionId) {
        throw new NonRetryableWebhookError(
          "checkout.session.completed missing subscription id",
        );
      }

      const stripeSubscription = await fetchStripeSubscriptionById(
        providerSubscriptionId,
      );
      if (!stripeSubscription) {
        logWebhook("warn", "stripe subscription fetch failed during checkout", {
          event_id: event.id,
          providerSubscriptionId,
        });
      }

      const checkoutCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const checkoutCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );
      const checkoutStatus = stripeSubscription
        ? normalizeStripeSubscriptionStatus({
            value: stripeSubscription.status,
            currentPeriodEnd: checkoutCurrentPeriodEnd,
          })
        : "active";

      const existingCanonical =
        await getSharedSubscriptionByProviderSubscriptionId(
          {
            supabase,
            providerSubscriptionId,
          },
        );

      if (existingCanonical) {
        if (existingCanonical.user_id !== userId) {
          throw new Error("Stripe subscription ownership mismatch");
        }

        const didMarkProcessed = await finalizeSubscriptionProcessing({
          supabase,
          userId,
          event,
          shouldRecomputeBeforeFinalMark: false,
        });

        if (didMarkProcessed && checkoutEmail) {
          const route = resolveEmailRoute(checkoutEmail);

          if (route) {
            const amount = typeof session.amount_total === "number"
              ? session.amount_total
              : 0;

            const currency = asNonEmptyStringOrNull(session.currency);
            const correlationId = event.id;

            const commonAuditVars = buildCommonEmailAuditVariables({
              originalTo: route.originalTo,
              forcedTo: route.forcedTo,
              correlationId,
              userId,
            });
            const planDetails = derivePlanDetails({
              providerPriceId: getCheckoutSessionPriceId(session),
              subscription: stripeSubscription,
              metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
            });

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "receipt_subscription",
                variables: {
                  ...commonAuditVars,
                  amount: formatMoney(amount, currency),
                  period: planDetails.period,
                  tier: planDetails.tier,
                  currency: currency ?? "",
                  amount_minor: String(amount),
                  stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "welcome_vip",
                variables: {
                  ...commonAuditVars,
                  tier: planDetails.tier,
                  stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }
          }
        }

        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: asNonEmptyStringOrNull(session?.id),
        providerOriginalTransactionId: null,
        productId: getSubscriptionProductId(stripeSubscription),
        providerProductId: getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getCheckoutSessionPriceId(session) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: checkoutStatus,
        currentPeriodStart: checkoutCurrentPeriodStart,
        currentPeriodEnd: checkoutCurrentPeriodEnd,
        cancelAtPeriodEnd:
          typeof stripeSubscription?.cancel_at_period_end === "boolean"
            ? stripeSubscription.cancel_at_period_end
            : null,
        canceledAt: toIsoFromUnix(stripeSubscription?.canceled_at),
        endedAt: toIsoFromUnix(stripeSubscription?.ended_at),
        metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
        rawPayload: stripeSubscription ?? session,
      });

      const didMarkProcessed = await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      if (didMarkProcessed && checkoutEmail) {
        const route = resolveEmailRoute(checkoutEmail);

        if (route) {
          const amount = typeof session.amount_total === "number"
            ? session.amount_total
            : 0;

          const currency = asNonEmptyStringOrNull(session.currency);
          const correlationId = event.id;

          const commonAuditVars = buildCommonEmailAuditVariables({
            originalTo: route.originalTo,
            forcedTo: route.forcedTo,
            correlationId,
            userId,
          });
          const planDetails = derivePlanDetails({
            providerPriceId: getCheckoutSessionPriceId(session),
            subscription: stripeSubscription,
            metadata: session?.metadata ?? stripeSubscription?.metadata ?? null,
          });

          try {
            await sendEmailOnce({
              supabase,
              correlationId,
              to: route.finalTo,
              templateKey: "receipt_subscription",
              variables: {
                ...commonAuditVars,
                amount: formatMoney(amount, currency),
                period: planDetails.period,
                tier: planDetails.tier,
                currency: currency ?? "",
                amount_minor: String(amount),
                stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                stripe_subscription_id: providerSubscriptionId,
              },
            });
          } catch {
            // best-effort
          }

          try {
            await sendEmailOnce({
              supabase,
              correlationId,
              to: route.finalTo,
              templateKey: "welcome_vip",
              variables: {
                ...commonAuditVars,
                tier: planDetails.tier,
                stripe_session_id: asNonEmptyStringOrNull(session.id) ?? "",
                stripe_subscription_id: providerSubscriptionId,
              },
            });
          } catch {
            // best-effort
          }
        }
      }

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object as InvoiceLike;
      const providerTransactionId = asNonEmptyStringOrNull(invoice?.id);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        invoice?.subscription,
      );
      const providerCustomerId = asNonEmptyStringOrNull(invoice?.customer);
      const invoiceEmail = asNonEmptyStringOrNull(invoice?.customer_email) ??
        asNonEmptyStringOrNull(invoice?.customer_details?.email);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
        supabase,
        providerSubscriptionId,
        providerCustomerId,
        invoiceEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError("invoice.paid user resolution failed");
      }

      const resolvedProviderCustomerId =
        providerCustomerId ??
        asNonEmptyStringOrNull(stripeSubscription?.customer);

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
      });

      const period = getInvoicePeriodRange(invoice);
      const fallbackCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const fallbackCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
        providerSubscriptionId,
        providerTransactionId,
        providerOriginalTransactionId: null,
        productId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerProductId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getInvoicePriceId(invoice) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: "active",
        currentPeriodStart:
          period.currentPeriodStart ?? fallbackCurrentPeriodStart,
        currentPeriodEnd:
          period.currentPeriodEnd ?? fallbackCurrentPeriodEnd,
        metadata: stripeSubscription?.metadata ?? null,
        rawPayload: attachInvoiceLookupPayload(invoice, stripeSubscription),
      });

      const didMarkProcessed = await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      if (didMarkProcessed) {
        const customerEmail = await resolveInvoiceCustomerEmail({
          supabase,
          invoice,
          userId,
        });

        if (customerEmail) {
          const route = resolveEmailRoute(customerEmail);

          if (route) {
            const amountMinor = typeof invoice.amount_paid === "number"
              ? invoice.amount_paid
              : typeof invoice.amount_due === "number"
              ? invoice.amount_due
              : 0;

            const currency = asNonEmptyStringOrNull(invoice.currency);
            const correlationId = event.id;

            const commonAuditVars = buildCommonEmailAuditVariables({
              originalTo: route.originalTo,
              forcedTo: route.forcedTo,
              correlationId,
              userId,
            });
            const planDetails = derivePlanDetails({
              providerPriceId: getInvoicePriceId(invoice) ??
                getSubscriptionPriceId(stripeSubscription),
              subscription: stripeSubscription,
              invoice,
              metadata: stripeSubscription?.metadata ?? null,
            });

            try {
              await sendEmailOnce({
                supabase,
                correlationId,
                to: route.finalTo,
                templateKey: "receipt_subscription",
                variables: {
                  ...commonAuditVars,
                  amount: formatMoney(amountMinor, currency),
                  period: planDetails.period,
                  tier: planDetails.tier,
                  currency: currency ?? "",
                  amount_minor: String(amountMinor),
                  stripe_session_id: "",
                  stripe_subscription_id: providerSubscriptionId,
                },
              });
            } catch {
              // best-effort
            }
          }
        }
      }

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as InvoiceLike;
      const providerTransactionId = asNonEmptyStringOrNull(invoice?.id);
      const providerSubscriptionId = asNonEmptyStringOrNull(
        invoice?.subscription,
      );
      const providerCustomerId = asNonEmptyStringOrNull(invoice?.customer);
      const invoiceEmail = asNonEmptyStringOrNull(invoice?.customer_email) ??
        asNonEmptyStringOrNull(invoice?.customer_details?.email);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const { userId, stripeSubscription } = await resolveUserForInvoiceEvent({
        supabase,
        providerSubscriptionId,
        providerCustomerId,
        invoiceEmail,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "invoice.payment_failed user resolution failed",
        );
      }

      const resolvedProviderCustomerId =
        providerCustomerId ??
        asNonEmptyStringOrNull(stripeSubscription?.customer);

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
      });

      const period = getInvoicePeriodRange(invoice);
      const fallbackCurrentPeriodStart = toIsoFromUnix(
        stripeSubscription?.current_period_start,
      );
      const fallbackCurrentPeriodEnd = toIsoFromUnix(
        stripeSubscription?.current_period_end,
      );

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId: resolvedProviderCustomerId,
        providerSubscriptionId,
        providerTransactionId,
        providerOriginalTransactionId: null,
        productId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerProductId:
          getInvoiceProductId(invoice) ??
          getSubscriptionProductId(stripeSubscription),
        providerPriceId:
          getInvoicePriceId(invoice) ??
          getSubscriptionPriceId(stripeSubscription),
        environment,
        status: "past_due",
        currentPeriodStart:
          period.currentPeriodStart ?? fallbackCurrentPeriodStart,
        currentPeriodEnd:
          period.currentPeriodEnd ?? fallbackCurrentPeriodEnd,
        metadata: stripeSubscription?.metadata ?? null,
        rawPayload: attachInvoiceLookupPayload(invoice, stripeSubscription),
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated"
    ) {
      const subscription = event.data.object as SubscriptionLike;
      const providerSubscriptionId = asNonEmptyStringOrNull(subscription?.id);
      const providerCustomerId = asNonEmptyStringOrNull(subscription?.customer);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: subscription?.metadata?.supabase_user_id ?? null,
        metadataUserId: subscription?.metadata?.user_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: subscription?.metadata?.email ?? null,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          `${event.type} user resolution failed`,
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      const currentPeriodEnd = toIsoFromUnix(subscription?.current_period_end);

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: null,
        providerOriginalTransactionId: null,
        productId: getSubscriptionProductId(subscription),
        providerProductId: getSubscriptionProductId(subscription),
        providerPriceId: getSubscriptionPriceId(subscription),
        environment,
        status: normalizeStripeSubscriptionStatus({
          value: subscription?.status,
          currentPeriodEnd,
        }),
        currentPeriodStart: toIsoFromUnix(subscription?.current_period_start),
        currentPeriodEnd,
        cancelAtPeriodEnd:
          typeof subscription?.cancel_at_period_end === "boolean"
            ? subscription.cancel_at_period_end
            : null,
        canceledAt: toIsoFromUnix(subscription?.canceled_at),
        endedAt: toIsoFromUnix(subscription?.ended_at),
        metadata: subscription?.metadata ?? null,
        rawPayload: subscription,
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as SubscriptionLike;
      const providerSubscriptionId = asNonEmptyStringOrNull(subscription?.id);
      const providerCustomerId = asNonEmptyStringOrNull(subscription?.customer);

      if (!providerSubscriptionId) {
        logWebhook("warn", "missing subscription id", {
          event_id: event.id,
          event_type: event.type,
        });
        await markStripeWebhookEventProcessed(supabase, event);
        return ok200();
      }

      const userId = await resolveUserByStripeLinkage({
        supabase,
        metadataSupabaseUserId: subscription?.metadata?.supabase_user_id ?? null,
        metadataUserId: subscription?.metadata?.user_id ?? null,
        providerSubscriptionId,
        providerCustomerId,
        email: subscription?.metadata?.email ?? null,
      });

      if (!userId) {
        throw new NonRetryableWebhookError(
          "customer.subscription.deleted user resolution failed",
        );
      }

      await syncProfileStripeCustomerIdBestEffort({
        supabase,
        userId,
        providerCustomerId,
      });

      const currentPeriodEnd = toIsoFromUnix(subscription?.current_period_end);
      const endedAt = toIsoFromUnix(subscription?.ended_at) ?? new Date().toISOString();

      const status: SharedSubscriptionStatus = "expired";

      const upsertResult = await upsertSharedSubscriptionMonotonic({
        supabase,
        event,
        userId,
        providerCustomerId,
        providerSubscriptionId,
        providerTransactionId: null,
        providerOriginalTransactionId: null,
        productId: getSubscriptionProductId(subscription),
        providerProductId: getSubscriptionProductId(subscription),
        providerPriceId: getSubscriptionPriceId(subscription),
        environment,
        status,
        currentPeriodStart: toIsoFromUnix(subscription?.current_period_start),
        currentPeriodEnd,
        cancelAtPeriodEnd:
          typeof subscription?.cancel_at_period_end === "boolean"
            ? subscription.cancel_at_period_end
            : true,
        canceledAt: toIsoFromUnix(subscription?.canceled_at) ?? endedAt,
        endedAt,
        metadata: subscription?.metadata ?? null,
        rawPayload: subscription,
      });

      await finalizeSubscriptionProcessing({
        supabase,
        userId,
        event,
        shouldRecomputeBeforeFinalMark:
          upsertResult.shouldRecomputeBeforeFinalMark,
      });

      await markStripeWebhookEventProcessed(supabase, event);
      return ok200();
    }

    await markStripeWebhookEventProcessed(supabase, event);
    return ok200();
  } catch (error: unknown) {
    const details =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : typeof error === "object" && error !== null
          ? JSON.parse(JSON.stringify(error))
          : { message: String(error) };

    logWebhook("error", "webhook processing failed", {
      event_id: event?.id ?? null,
      event_type: event?.type ?? null,
      details,
    });

    try {
      await upsertStripeWebhookEventResult({
        supabase,
        event,
        processed: error instanceof NonRetryableWebhookError,
        errorMessage: error instanceof Error
          ? error.message
          : String(error ?? "unknown error"),
      });
    } catch {
      // best-effort only
    }

    if (error instanceof NonRetryableWebhookError) {
      return ok200();
    }

    return json({ error: "Webhook processing failed" }, 500);
  }
});
