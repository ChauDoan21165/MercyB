// src/components/pricing/LifetimeIntentDialog.tsx
//
// Modal form that captures Lifetime-tier intent. Vietnamese-first.
// Submission goes to lifetime_intent_signups via lifetimeClient. There
// is no purchase, no Stripe, no fulfillment promise.

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  isLikelyValidEmail,
  signUpForLifetime,
  type LifetimeReasonCode,
} from "@/lib/lifetime/lifetimeClient";
import { LIFETIME_COPY } from "./lifetimeCopy";

interface LifetimeIntentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Authenticated user id; required for the submit path. */
  userId: string | null | undefined;
  /** Pre-fill the email field (e.g. from auth profile). */
  defaultEmail?: string;
  /** Called once on a successful submission. */
  onSubmitted?: () => void;
}

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const REASON_OPTIONS: ReadonlyArray<{ value: LifetimeReasonCode }> = [
  { value: "gift" },
  { value: "commitment" },
  { value: "savings" },
  { value: "other" },
];

export function LifetimeIntentDialog({
  open,
  onOpenChange,
  userId,
  defaultEmail,
  onSubmitted,
}: LifetimeIntentDialogProps) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [country, setCountry] = useState("");
  const [reason, setReason] = useState<LifetimeReasonCode>("commitment");
  const [reasonNote, setReasonNote] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  // Keep the email field in sync if the parent passes a new default
  // (e.g. user signs in while the dialog is mounted).
  useEffect(() => {
    if (defaultEmail && !email) setEmail(defaultEmail);
  }, [defaultEmail, email]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!userId) {
        setState({ kind: "error", message: LIFETIME_COPY.errorAuth.vi });
        return;
      }

      if (!isLikelyValidEmail(email)) {
        setState({ kind: "error", message: LIFETIME_COPY.errorEmail.vi });
        return;
      }

      setState({ kind: "submitting" });
      const result = await signUpForLifetime({
        userId,
        email: email.trim(),
        country: country.trim() || null,
        reasonCode: reason,
        reasonText: reasonNote.trim() || null,
      });

      if (result.ok) {
        setState({ kind: "success" });
        onSubmitted?.();
      } else {
        setState({ kind: "error", message: LIFETIME_COPY.errorGeneric.vi });
      }
    },
    [country, email, onSubmitted, reason, reasonNote, userId],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{LIFETIME_COPY.dialogTitle.vi}</DialogTitle>
          <DialogDescription>{LIFETIME_COPY.dialogIntro.vi}</DialogDescription>
        </DialogHeader>

        {state.kind === "success" ? (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {LIFETIME_COPY.successTitle.vi}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {LIFETIME_COPY.successBody.vi}
                </p>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                {LIFETIME_COPY.cancelCta.vi}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground" htmlFor="lifetime-email">
                {LIFETIME_COPY.emailLabel.vi}
              </label>
              <Input
                id="lifetime-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state.kind === "error") setState({ kind: "idle" });
                }}
                placeholder={LIFETIME_COPY.emailPlaceholder.vi}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground" htmlFor="lifetime-country">
                {LIFETIME_COPY.countryLabel.vi}
              </label>
              <Input
                id="lifetime-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={LIFETIME_COPY.countryPlaceholder.vi}
                autoComplete="country-name"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">
                {LIFETIME_COPY.reasonLabel.vi}
              </p>
              <div className="grid gap-1">
                {REASON_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-start gap-2 rounded-md border border-input p-2 text-xs"
                  >
                    <input
                      type="radio"
                      name="lifetime-reason"
                      value={opt.value}
                      checked={reason === opt.value}
                      onChange={() => setReason(opt.value)}
                      className="mt-0.5"
                    />
                    <span className="text-foreground">
                      {LIFETIME_COPY.reasonOptions[opt.value].vi}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground" htmlFor="lifetime-note">
                {LIFETIME_COPY.reasonNoteLabel.vi}
              </label>
              <textarea
                id="lifetime-note"
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full resize-y rounded-md border border-input bg-background p-2 text-sm"
              />
            </div>

            {state.kind === "error" && (
              <p className="text-xs text-destructive">{state.message}</p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={state.kind === "submitting"}
              >
                {LIFETIME_COPY.cancelCta.vi}
              </Button>
              <Button type="submit" disabled={state.kind === "submitting"}>
                {state.kind === "submitting" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {LIFETIME_COPY.submitCta.vi}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
