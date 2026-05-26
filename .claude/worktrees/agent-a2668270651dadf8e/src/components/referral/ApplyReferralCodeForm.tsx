// src/components/referral/ApplyReferralCodeForm.tsx
//
// Compact "I have a referral code" form. Used standalone on the Account
// page and (eventually) inline in the post-signup flow. Vietnamese-first.
//
// On success, the parent typically navigates the user away or hides the
// form; we expose an onApplied callback for that. The form itself just
// surfaces the per-status copy and stays mounted.

import React, { useCallback, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  applyReferralCode,
  isValidReferralCodeShape,
  normalizeReferralCode,
  type ApplyReferralCodeResult,
} from "@/lib/referral/referralClient";
import { REFERRAL_COPY } from "./referralCopy";

interface ApplyReferralCodeFormProps {
  /** Authenticated user id; required. The form short-circuits if null. */
  userId: string | null | undefined;
  /** Optional initial value (e.g. from `?ref=` URL param). */
  initialCode?: string;
  /** Called once on a successful redemption. */
  onApplied?: () => void;
}

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function errorCopy(result: Exclude<ApplyReferralCodeResult, { ok: true }>): string {
  switch (result.status) {
    case "self_referral":
      return REFERRAL_COPY.applyErrorSelf.vi;
    case "already_used":
      return REFERRAL_COPY.applyErrorAlreadyUsed.vi;
    case "invalid_code":
      return REFERRAL_COPY.applyErrorInvalid.vi;
    default:
      return REFERRAL_COPY.applyErrorGeneric.vi;
  }
}

export function ApplyReferralCodeForm({
  userId,
  initialCode,
  onApplied,
}: ApplyReferralCodeFormProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const [state, setState] = useState<FormState>({ kind: "idle" });

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!userId) return;

      const norm = normalizeReferralCode(code);
      if (!isValidReferralCodeShape(norm)) {
        setState({ kind: "error", message: REFERRAL_COPY.applyErrorInvalid.vi });
        return;
      }

      setState({ kind: "submitting" });
      const result = await applyReferralCode(userId, norm);
      if (result.ok) {
        setState({ kind: "success" });
        onApplied?.();
      } else {
        setState({ kind: "error", message: errorCopy(result) });
      }
    },
    [code, onApplied, userId],
  );

  if (!userId) return null;

  if (state.kind === "success") {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium text-foreground">
            {REFERRAL_COPY.applySuccess.vi}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <p className="text-sm font-semibold text-foreground">
        {REFERRAL_COPY.applyHeading.vi}
      </p>
      <div className="flex flex-wrap gap-2">
        <Input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (state.kind === "error") setState({ kind: "idle" });
          }}
          placeholder={REFERRAL_COPY.applyInputPlaceholder.vi}
          maxLength={6}
          className="max-w-[180px] font-mono uppercase tracking-widest"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          disabled={state.kind === "submitting"}
        />
        <Button type="submit" size="sm" disabled={state.kind === "submitting"}>
          {state.kind === "submitting" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {REFERRAL_COPY.applyCta.vi}
        </Button>
      </div>

      {state.kind === "error" && (
        <p className="text-xs text-destructive">{state.message}</p>
      )}
    </form>
  );
}
