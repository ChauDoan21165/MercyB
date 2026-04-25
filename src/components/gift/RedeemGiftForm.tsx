// src/components/gift/RedeemGiftForm.tsx
//
// Step 9 — recipient-side redemption. Two-step flow: paste code →
// preview duration + personal message → confirm → DB update.

import React, { useEffect, useState } from "react";

import {
  GIFT_CODE_LENGTH,
  lookupGiftCode,
  redeemGiftCode,
  type GiftSubscriptionRow,
  type LookupGiftStatus,
  type RedeemGiftError,
} from "@/lib/gift/giftSubscriptionClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RedeemGiftFormProps {
  userId: string;
  /** Optional pre-filled code (e.g. via /gift/redeem?code=XXXXXXXXXXXX). */
  initialCode?: string;
  onSuccess?: (row: GiftSubscriptionRow) => void;
}

export default function RedeemGiftForm({
  userId,
  initialCode,
  onSuccess,
}: RedeemGiftFormProps): React.ReactElement {
  const [code, setCode] = useState(
    (initialCode ?? "").trim().toUpperCase(),
  );
  const [preview, setPreview] = useState<{
    status: LookupGiftStatus;
    row: GiftSubscriptionRow | null;
  } | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<RedeemGiftError | null>(null);
  const [redeemed, setRedeemed] = useState<GiftSubscriptionRow | null>(null);
  const { toast } = useToast();

  // If we got the code from the URL, run a lookup right away so the user
  // sees the preview without having to click anything.
  useEffect(() => {
    if (initialCode && initialCode.length === GIFT_CODE_LENGTH) {
      void handleLookup(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLookup(raw?: string): Promise<void> {
    const value = (raw ?? code).trim().toUpperCase();
    if (value.length !== GIFT_CODE_LENGTH) {
      setPreview({ status: "not_found", row: null });
      return;
    }
    const result = await lookupGiftCode(value);
    setPreview(result);
  }

  async function handleRedeem(): Promise<void> {
    if (!preview?.row || preview.status !== "available") return;
    setRedeeming(true);
    setRedeemError(null);
    try {
      const result = await redeemGiftCode(userId, preview.row.code);
      if (result.error) {
        setRedeemError(result.error);
        toast({
          title: "Không kích hoạt được / Could not redeem",
          description: errorCopy(result.error),
          variant: "destructive",
        });
        return;
      }
      if (result.row) {
        setRedeemed(result.row);
        toast({
          title: "🎁 Đã nhận quà / Gift redeemed",
          description: `+${result.row.durationMonths} tháng MercyBlade`,
        });
        onSuccess?.(result.row);
      }
    } finally {
      setRedeeming(false);
    }
  }

  if (redeemed) {
    return (
      <Card>
        <CardContent className="space-y-3 p-6 text-center">
          <Gift className="mx-auto h-10 w-10 text-emerald-500" aria-hidden />
          <h2 className="text-xl font-semibold text-slate-900">
            Đã kích hoạt {redeemed.durationMonths} tháng MercyBlade!
          </h2>
          <p className="text-sm text-slate-500">
            {redeemed.durationMonths} months of MercyBlade premium added to
            your account.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <header className="text-center">
          <Gift className="mx-auto h-10 w-10 text-amber-500" aria-hidden />
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            Kích hoạt mã quà / Redeem gift code
          </h2>
        </header>

        <div className="space-y-2">
          <Label htmlFor="redeem-code">Mã quà / Gift code</Label>
          <Input
            id="redeem-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setPreview(null);
              setRedeemError(null);
            }}
            placeholder="ABCDEFGH2345"
            maxLength={GIFT_CODE_LENGTH}
            className="font-mono text-center text-lg tracking-widest"
          />
        </div>

        {!preview ? (
          <Button
            type="button"
            onClick={() => void handleLookup()}
            disabled={code.trim().length !== GIFT_CODE_LENGTH}
            className="w-full"
          >
            Kiểm tra mã / Check code
          </Button>
        ) : null}

        {preview && preview.status === "available" && preview.row ? (
          <div className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="text-lg font-semibold text-amber-700">
              {preview.row.durationMonths} tháng MercyBlade
            </p>
            {preview.row.personalMessage ? (
              <blockquote className="border-l-2 border-amber-300 pl-3 text-sm italic text-slate-700">
                "{preview.row.personalMessage}"
              </blockquote>
            ) : null}
            <Button
              type="button"
              onClick={() => void handleRedeem()}
              disabled={redeeming}
              className="w-full bg-amber-500 text-white hover:bg-amber-600"
            >
              {redeeming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  Đang kích hoạt…
                </>
              ) : (
                <>Kích hoạt / Redeem now</>
              )}
            </Button>
          </div>
        ) : null}

        {preview && preview.status !== "available" ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {previewErrorCopy(preview.status)}
          </div>
        ) : null}

        {redeemError ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {errorCopy(redeemError)}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function previewErrorCopy(status: LookupGiftStatus): string {
  switch (status) {
    case "already_redeemed":
      return "Mã đã được dùng rồi. / This code has already been redeemed.";
    case "expired":
      return "Mã đã hết hạn. / This code has expired.";
    default:
      return "Không tìm thấy mã. / Code not found.";
  }
}

function errorCopy(err: RedeemGiftError): string {
  switch (err) {
    case "already_redeemed":
      return "Mã đã được dùng rồi. / This code has already been redeemed.";
    case "expired":
      return "Mã đã hết hạn. / This code has expired.";
    case "not_found":
      return "Không tìm thấy mã. / Code not found.";
    case "update_failed":
    default:
      return "Có lỗi xảy ra. Thử lại sau. / Something went wrong, try again.";
  }
}
