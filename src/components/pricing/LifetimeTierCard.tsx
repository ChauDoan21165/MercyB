// src/components/pricing/LifetimeTierCard.tsx
//
// Lifetime-tier shell card for the Pricing screen. This is intent
// capture, not a live offer. The card surfaces $199 + bullets but
// the CTA opens a waitlist dialog — there is no purchase flow.

import React, { useEffect, useState } from "react";
import { Crown, Gift, ShieldCheck, Sparkles } from "lucide-react";
import {
  getMySignup,
  getSignupCount,
} from "@/lib/lifetime/lifetimeClient";
import { LIFETIME_COPY } from "./lifetimeCopy";
import { LifetimeIntentDialog } from "./LifetimeIntentDialog";

interface LifetimeTierCardProps {
  /** Authenticated user id. CTA still works for guests but the dialog
   * blocks submit until they sign in. */
  userId: string | null | undefined;
  /** Optional pre-fill email — typically the user's auth email. */
  defaultEmail?: string;
}

export function LifetimeTierCard({
  userId,
  defaultEmail,
}: LifetimeTierCardProps) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    void getSignupCount().then((n) => {
      if (!cancelled) setCount(n);
    });
    if (userId) {
      void getMySignup(userId).then((b) => {
        if (!cancelled) setAlreadySigned(b);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleSubmitted = () => {
    setAlreadySigned(true);
    setCount((n) => n + 1);
  };

  return (
    <>
      <div
        style={{
          borderRadius: 18,
          border: "1px solid rgba(99,102,241,0.30)",
          background:
            "linear-gradient(160deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Crown size={18} color="#6366f1" />
          <span
            style={{
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "#6366f1",
              fontWeight: 700,
            }}
          >
            {LIFETIME_COPY.cardEyebrow.vi}
          </span>
        </div>

        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: "#1e1b4b",
            }}
          >
            {LIFETIME_COPY.cardTitle.vi}
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            {LIFETIME_COPY.cardTitle.en}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1e1b4b",
              letterSpacing: -0.5,
            }}
          >
            {LIFETIME_COPY.cardPrice.vi}
          </span>
        </div>

        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 }}>
          {LIFETIME_COPY.cardLead.vi}
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "4px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {LIFETIME_COPY.bullets.vi.map((bullet, i) => {
            const Icon =
              i === 0 ? ShieldCheck : i === 2 ? Sparkles : Gift;
            return (
              <li
                key={bullet}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  fontSize: 13,
                  color: "#1e1b4b",
                }}
              >
                <Icon size={14} color="#6366f1" style={{ marginTop: 2 }} />
                <span>{bullet}</span>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={alreadySigned}
          style={{
            marginTop: 6,
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: alreadySigned
              ? "rgba(99,102,241,0.12)"
              : "linear-gradient(90deg,#6366f1,#a855f7)",
            color: alreadySigned ? "#6366f1" : "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: alreadySigned ? "default" : "pointer",
          }}
        >
          {alreadySigned
            ? LIFETIME_COPY.ctaAlreadySigned.vi
            : LIFETIME_COPY.cta.vi}
        </button>

        {count > 0 && (
          <p
            style={{
              fontSize: 12,
              color: "#6366f1",
              fontWeight: 600,
              margin: 0,
              textAlign: "center",
            }}
          >
            {LIFETIME_COPY.waitlistCount(count).vi}
          </p>
        )}

        <p
          style={{
            fontSize: 11,
            color: "#64748b",
            lineHeight: 1.5,
            margin: 0,
            paddingTop: 6,
            borderTop: "1px dashed rgba(99,102,241,0.25)",
          }}
        >
          {LIFETIME_COPY.finePrint.vi}
        </p>
      </div>

      <LifetimeIntentDialog
        open={open}
        onOpenChange={setOpen}
        userId={userId}
        defaultEmail={defaultEmail}
        onSubmitted={handleSubmitted}
      />
    </>
  );
}
