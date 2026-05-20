// Recipient-side scrub for `email_audit` — closes GAP A from the privacy
// audit (reports/PRIVACY-b1-anonymize-audit-A4c.md / PR #819).
//
// Why this exists as its own module: the user-data-manifest entry for
// email_audit filters with .eq("admin_user_id", userId) — it only catches
// rows where the deleted user was the admin SENDER. When the deleted user
// was the RECIPIENT of a feedback reply / 2FA email / etc, their address
// remains in `recipient_email` after account deletion. GDPR Art. 17 +
// Apple 5.1.1(v) require erasure.
//
// The manifest schema only filters by user-id-shaped columns; the
// recipient case needs filtering by email (a plain text field). That
// can't be expressed in the manifest, so this is a dedicated pre-pass
// that runs before Pass 3 (profiles delete) / Pass 4 (auth.users delete).
// Capturing the email at that point is load-bearing — by Pass 4 the
// auth.users row is gone and the lookup is no longer possible.
//
// Kept Deno-free and side-effect-free at the type level (the side
// effect is the supabase-js UPDATE the caller injects) so it can be
// unit-tested with vitest. The ScrubClient interface matches just the
// surface area we actually use, letting the test inject a fake without
// pulling in @supabase/supabase-js.

/** Minimal supabase-js surface this helper depends on. */
export interface ScrubClient {
  from(table: string): {
    update(values: Record<string, string | null>): {
      eq(column: string, value: string): Promise<{
        error: { message: string } | null;
      }>;
    };
  };
}

export type EmailAuditScrubResult =
  | { kind: "skipped"; reason: "no_recipient_email" }
  | { kind: "scrubbed" }
  | { kind: "error"; message: string };

/**
 * Scrub `recipient_email` + `subject` on every `email_audit` row where
 * the deleted user appears as the RECIPIENT.
 *
 * Why only those two columns: they directly identify the recipient
 * (their address + the subject line, which often embeds their name —
 * "Re: your refund request, Tuấn"). The remaining columns are kept:
 *   - `admin_user_id` — points to the (presumably still-active) admin
 *     who sent the email; the row's accountability survives.
 *   - `feedback_id` — points to a `feedback` row whose own anonymize
 *     entry scrubs the user's free-text message body.
 *   - `error_message` + `metadata` — admin-system-side text (Resend IDs,
 *     SMTP errors) that doesn't identify the recipient on its own.
 *   - `sent_at` / `success` — timestamps + status, not PII.
 *
 * Returns a discriminated-union result rather than throwing: the
 * delete-account flow records errors in `report.errors[]` and continues
 * (audit-row failures must not block the core deletion).
 */
export async function scrubEmailAuditByRecipient(
  client: ScrubClient,
  recipientEmail: string | null | undefined,
): Promise<EmailAuditScrubResult> {
  if (!recipientEmail) {
    return { kind: "skipped", reason: "no_recipient_email" };
  }
  const { error } = await client
    .from("email_audit")
    .update({
      recipient_email: "[deleted]",
      subject: "[deleted]",
    })
    .eq("recipient_email", recipientEmail);
  if (error) return { kind: "error", message: error.message };
  return { kind: "scrubbed" };
}
