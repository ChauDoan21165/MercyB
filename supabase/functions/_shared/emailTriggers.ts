// PATH: supabase/functions/_shared/emailTriggers.ts
// VERSION: v2026-01-06.triggers.1 (shared trigger helper for many apps)

import { sendEmail } from "./sendEmail.ts";

export type TriggerEmailArgs = {
  to: string;
  appKey: string;
  templateKey: string;
  variables?: Record<string, string>;
  correlationId?: string;
};

export async function triggerEmailBestEffort(args: TriggerEmailArgs) {
  try {
    await sendEmail({
      to: args.to,
      appKey: args.appKey,
      templateKey: args.templateKey,
      variables: args.variables ?? {},
      correlationId: args.correlationId,
    });
    return { ok: true };
  } catch (e) {
    console.warn("[emailTriggers] sendEmail failed (ignored)", e);
    return { ok: false };
  }
}
