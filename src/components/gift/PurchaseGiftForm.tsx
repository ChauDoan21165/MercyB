// src/components/gift/PurchaseGiftForm.tsx
//
// Step 9 — front-end of the gift purchase flow. Captures recipient
// email, duration, and personal message, then mints a gift_subscriptions
// row via giftSubscriptionClient.
//
// IMPORTANT: this form does NOT charge real money. The Stripe checkout
// hand-off lives at the // TODO(stripe) marker below — daytime work.
// For the cohort-of-100 beta we mint codes free so the diaspora-family
// flow can be exercised end-to-end.

import React, { useState } from "react";

import {
  ALLOWED_DURATIONS,
  PERSONAL_MESSAGE_MAX,
  generateGiftCode,
  type GiftDurationMonths,
  type GiftSubscriptionRow,
} from "@/lib/gift/giftSubscriptionClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseGiftFormProps {
  purchaserId: string;
  purchaserEmail?: string | null;
  onSuccess?: (row: GiftSubscriptionRow) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PurchaseGiftForm({
  purchaserId,
  purchaserEmail,
  onSuccess,
}: PurchaseGiftFormProps): React.ReactElement {
  const [duration, setDuration] = useState<GiftDurationMonths>(6);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [issued, setIssued] = useState<GiftSubscriptionRow | null>(null);
  const { toast } = useToast();

  const messageLeft = PERSONAL_MESSAGE_MAX - message.length;
  const messageOver = messageLeft < 0;
  const emailValid = EMAIL_REGEX.test(recipientEmail.trim());
  const canSubmit = !submitting && emailValid && !messageOver;

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // TODO(stripe): replace this direct insert with a Stripe Checkout
      // session that mints the gift row in its `checkout.session.completed`
      // webhook. For now we issue the code immediately so the diaspora
      // flow is fully testable end-to-end.
      const result = await generateGiftCode(
        purchaserId,
        duration,
        recipientEmail.trim(),
        message.trim() || null,
        purchaserEmail ?? null,
      );

      if (result.error || !result.row) {
        toast({
          title: "Không tạo được mã quà / Could not create gift",
          description: result.error ?? "Unknown error",
          variant: "destructive",
        });
        return;
      }

      setIssued(result.row);
      toast({
        title: "🎁 Đã tạo mã quà / Gift code created",
        description: `Code: ${result.row.code}`,
      });
      onSuccess?.(result.row);
    } finally {
      setSubmitting(false);
    }
  }

  if (issued) {
    return <IssuedGiftCard row={issued} onReset={() => setIssued(null)} />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <header className="text-center">
            <Gift className="mx-auto h-10 w-10 text-amber-500" aria-hidden />
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Tặng người thân tiếng Anh
            </h2>
            <p className="text-sm text-slate-500">
              Give a loved one premium MercyBlade access.
            </p>
          </header>

          <div className="space-y-2">
            <Label>Thời hạn / Duration</Label>
            <div className="grid grid-cols-4 gap-2">
              {ALLOWED_DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    duration === d
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-pressed={duration === d}
                >
                  {d} tháng
                  <span className="ml-1 text-xs text-slate-400">/ mo</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-email">Email người nhận / Recipient email</Label>
            <Input
              id="recipient-email"
              type="email"
              autoComplete="email"
              required
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="me@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal-message">
              Lời nhắn / Personal message{" "}
              <span className="text-xs text-slate-400">(tuỳ chọn / optional)</span>
            </Label>
            <Textarea
              id="personal-message"
              rows={3}
              maxLength={PERSONAL_MESSAGE_MAX + 1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mẹ ơi, con tặng mẹ 6 tháng học tiếng Anh. Yêu mẹ."
            />
            <p
              className={`text-xs ${
                messageOver ? "text-rose-600" : "text-slate-400"
              }`}
              aria-live="polite"
            >
              {messageLeft >= 0 ? `${messageLeft} chars left` : `${-messageLeft} too many`}
            </p>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-amber-500 text-white hover:bg-amber-600"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Đang tạo / Creating…
              </>
            ) : (
              <>Tạo mã quà / Create gift code</>
            )}
          </Button>

          <p className="text-xs text-slate-500">
            Beta: chưa thanh toán thật / Beta: not charging real money yet.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

interface IssuedGiftCardProps {
  row: GiftSubscriptionRow;
  onReset: () => void;
}

function IssuedGiftCard({ row, onReset }: IssuedGiftCardProps): React.ReactElement {
  const { toast } = useToast();
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/gift/redeem?code=${row.code}`
      : `/gift/redeem?code=${row.code}`;

  function copy(value: string): void {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(value).then(() => {
      toast({ title: "Đã sao chép / Copied" });
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6 text-center">
        <Gift className="mx-auto h-10 w-10 text-amber-500" aria-hidden />
        <h2 className="text-xl font-semibold text-slate-900">
          Mã quà đã sẵn sàng / Gift ready
        </h2>
        <p className="text-sm text-slate-500">
          Gửi mã hoặc link cho {row.recipientEmail ?? "người nhận"}.
        </p>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 font-mono text-2xl tracking-widest text-amber-700">
          {row.code}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" variant="outline" onClick={() => copy(row.code)}>
            Copy code
          </Button>
          <Button type="button" variant="outline" onClick={() => copy(link)}>
            Copy link
          </Button>
          <Button type="button" onClick={onReset}>
            Tạo mã khác / New gift
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
