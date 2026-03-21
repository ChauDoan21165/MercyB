import {
  BillingProvider,
  json,
  ok200,
  readEntitlementForUser,
  requireUser,
} from "../_shared/billing.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return ok200();

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const auth = await requireUser(req);
    if ("error" in auth) return auth.error;

    const body = await req.json().catch(() => ({}));
    const provider = body?.provider as BillingProvider | undefined;

    if (
      provider !== undefined &&
      provider !== "stripe" &&
      provider !== "apple" &&
      provider !== "google"
    ) {
      return json({ error: "Invalid provider" }, 400);
    }

    const entitlement = await readEntitlementForUser(auth.user.id);

    return json(
      {
        restored: true,
        provider: provider ?? null,
        ...entitlement,
      },
      200,
    );
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});