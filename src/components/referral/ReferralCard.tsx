// src/components/referral/ReferralCard.tsx
//
// Renders the user's referral code, copyable, with share buttons and
// a usage counter. Vietnamese-first surface. Reward delivery (7 free
// days) is out of scope here — this card only shows the code + count.
//
// Generation: lazy. The first mount calls get_or_create_referral_code
// via referralClient.generateCode(); after that subsequent mounts
// hit getReferralStats() for the same row.

import React, { useCallback, useEffect, useState } from "react";
import { Check, Copy, Gift, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildShareUrl,
  generateCode,
  getReferralStats,
} from "@/lib/referral/referralClient";
import { REFERRAL_COPY } from "./referralCopy";

interface ReferralCardProps {
  /** Authenticated user id. Card hides itself for guests. */
  userId: string | null | undefined;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; code: string; usesCount: number }
  | { kind: "error"; message: string };

export function ReferralCard({ userId }: ReferralCardProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!userId) {
      // Guest view — keep loading; parent should not have rendered us.
      return;
    }

    let cancelled = false;

    (async () => {
      const stats = await getReferralStats(userId);
      if (cancelled) return;

      if (stats.code) {
        setState({ kind: "ready", code: stats.code, usesCount: stats.usesCount });
        return;
      }

      const gen = await generateCode(userId);
      if (cancelled) return;
      if (gen.ok) {
        setState({ kind: "ready", code: gen.code, usesCount: 0 });
      } else {
        setState({ kind: "error", message: gen.error });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleCopyCode = useCallback(async () => {
    if (state.kind !== "ready") return;
    try {
      await navigator.clipboard.writeText(state.code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1500);
    } catch {
      // Clipboard can fail on http or restrictive contexts; the code
      // is visible on screen so the user can copy manually.
    }
  }, [state]);

  const handleCopyLink = useCallback(async () => {
    if (state.kind !== "ready") return;
    try {
      await navigator.clipboard.writeText(buildShareUrl(state.code));
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1500);
    } catch {
      // see above
    }
  }, [state]);

  if (!userId) return null;

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white/80 p-2 shadow-sm">
          <Gift className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">
            {REFERRAL_COPY.cardHeading.vi}
          </p>
          <p className="text-xs text-muted-foreground">
            {REFERRAL_COPY.cardSubheading.vi}
          </p>

          {state.kind === "loading" && (
            <p className="mt-3 text-sm text-muted-foreground">
              {REFERRAL_COPY.loadingCode.vi}
            </p>
          )}

          {state.kind === "error" && (
            <p className="mt-3 text-sm text-destructive">
              {REFERRAL_COPY.generateError.vi}
            </p>
          )}

          {state.kind === "ready" && (
            <>
              <div className="mt-3 rounded-lg bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {REFERRAL_COPY.yourCodeLabel.vi}
                </p>
                <p className="mt-1 font-mono text-lg font-semibold tracking-widest text-foreground">
                  {state.code}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {REFERRAL_COPY.usesCount(state.usesCount).vi}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={handleCopyCode}>
                  {copiedCode ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copiedCode
                    ? REFERRAL_COPY.copiedFeedback.vi
                    : REFERRAL_COPY.copyCta.vi}
                </Button>

                <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                  {copiedLink ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <LinkIcon className="mr-2 h-4 w-4" />
                  )}
                  {copiedLink
                    ? REFERRAL_COPY.copiedFeedback.vi
                    : REFERRAL_COPY.copyLinkCta.vi}
                </Button>

                <ShareButton
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(buildShareUrl(state.code))}`}
                  label={REFERRAL_COPY.shareFacebookCta.vi}
                />
                <ShareButton
                  href={`https://zalo.me/share?u=${encodeURIComponent(buildShareUrl(state.code))}`}
                  label={REFERRAL_COPY.shareZaloCta.vi}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ShareButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-md border border-primary/20 bg-white/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white"
    >
      {label}
    </a>
  );
}
