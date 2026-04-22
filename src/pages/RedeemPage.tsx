// src/pages/RedeemPage.tsx
//
// Standalone page that opens the GiftCodeModal immediately. Handles bookmarkable
// links like /redeem and /promo-code so admins can share a direct URL with
// anyone who needs to paste a gift code.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiftCodeModal } from "@/components/GiftCodeModal";

export default function RedeemPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) navigate("/account", { replace: true });
  };

  const handleSuccess = () => {
    setOpen(false);
    navigate("/account", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFF8F3] via-white to-[#F7FAFF] p-4">
      <div className="text-center text-slate-600">
        <h1 className="text-xl font-semibold text-slate-900">
          Redeem your gift code / Kích hoạt mã quà tặng
        </h1>
        <p className="mt-2 text-sm">
          Paste the code your admin sent you in the box that just opened.
        </p>
      </div>
      <GiftCodeModal open={open} onOpenChange={handleClose} onSuccess={handleSuccess} />
    </div>
  );
}
