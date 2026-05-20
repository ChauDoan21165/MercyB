// supabase/functions/delete-account/__tests__/email-audit-recipient-scrub.test.ts
//
// Regression lock for GAP A from the privacy audit
// (reports/PRIVACY-b1-anonymize-audit-A4c.md / PR #819):
//
//   Before this fix, the manifest's anonymize entry on email_audit only
//   filtered by admin_user_id — meaning when the deleted user was the
//   RECIPIENT (any feedback reply / 2FA email), recipient_email survived
//   account deletion. GDPR Art. 17 + Apple 5.1.1(v) defect.
//
// These tests exercise the dedicated recipient-keyed scrub helper that
// runs as a Pass-2b pre-pass in delete-account/index.ts. The helper is
// kept Deno-free + side-effect-injected so vitest can run against it
// without spinning up a Supabase or the Deno.serve handler.

import { describe, expect, it, vi } from "vitest";

import {
  scrubEmailAuditByRecipient,
  type ScrubClient,
} from "../email-audit-recipient-scrub";

/**
 * Build a fake ScrubClient that records the .from() / .update() / .eq()
 * calls and returns a configurable result from the terminal .eq() call.
 */
function makeFakeClient(eqResult: { error: { message: string } | null } = { error: null }) {
  const eq = vi.fn().mockResolvedValue(eqResult);
  const update = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ update });
  return { client: { from } as ScrubClient, from, update, eq };
}

describe("scrubEmailAuditByRecipient — GAP A regression lock", () => {
  it("scrubs recipient_email + subject for the deleted user's email", async () => {
    const { client, from, update, eq } = makeFakeClient();

    const result = await scrubEmailAuditByRecipient(client, "alice@example.com");

    expect(result).toEqual({ kind: "scrubbed" });
    expect(from).toHaveBeenCalledExactlyOnceWith("email_audit");
    expect(update).toHaveBeenCalledExactlyOnceWith({
      recipient_email: "[deleted]",
      subject: "[deleted]",
    });
    expect(eq).toHaveBeenCalledExactlyOnceWith(
      "recipient_email",
      "alice@example.com",
    );
  });

  it("does NOT touch admin_user_id / feedback_id / error_message / metadata", async () => {
    // The other columns must survive — they encode admin accountability,
    // FK chain to feedback, and admin-system-side diagnostics.
    const { client, update } = makeFakeClient();

    await scrubEmailAuditByRecipient(client, "bob@example.com");

    const updatePayload = update.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(Object.keys(updatePayload).sort()).toEqual([
      "recipient_email",
      "subject",
    ]);
    expect(updatePayload).not.toHaveProperty("admin_user_id");
    expect(updatePayload).not.toHaveProperty("feedback_id");
    expect(updatePayload).not.toHaveProperty("error_message");
    expect(updatePayload).not.toHaveProperty("metadata");
  });

  it("skips the UPDATE entirely when recipientEmail is null", async () => {
    // Defensive — if user.email is missing for any reason, do nothing.
    // The core deletion must still proceed; this scrub is best-effort.
    const { client, from } = makeFakeClient();

    const result = await scrubEmailAuditByRecipient(client, null);

    expect(result).toEqual({ kind: "skipped", reason: "no_recipient_email" });
    expect(from).not.toHaveBeenCalled();
  });

  it("skips the UPDATE entirely when recipientEmail is undefined", async () => {
    const { client, from } = makeFakeClient();

    const result = await scrubEmailAuditByRecipient(client, undefined);

    expect(result).toEqual({ kind: "skipped", reason: "no_recipient_email" });
    expect(from).not.toHaveBeenCalled();
  });

  it("skips the UPDATE entirely when recipientEmail is an empty string", async () => {
    const { client, from } = makeFakeClient();

    const result = await scrubEmailAuditByRecipient(client, "");

    expect(result).toEqual({ kind: "skipped", reason: "no_recipient_email" });
    expect(from).not.toHaveBeenCalled();
  });

  it("returns an error result (does NOT throw) when the UPDATE fails", async () => {
    // Non-fatal contract: the caller appends to report.errors and the
    // core deletion continues. The helper must never throw.
    const { client } = makeFakeClient({ error: { message: "permission denied for table email_audit" } });

    const result = await scrubEmailAuditByRecipient(client, "carol@example.com");

    expect(result).toEqual({
      kind: "error",
      message: "permission denied for table email_audit",
    });
  });
});
