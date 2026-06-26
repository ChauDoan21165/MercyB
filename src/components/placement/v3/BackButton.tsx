import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlacementT } from "@/components/placement/nativeCopy";
import type { PlacementNativeSlots } from "@/components/placement/nativeCopy";

const COPY_BACK: PlacementNativeSlots = {
  en: "Back",
  vi: "Quay lại",
  ja: "戻る",
  id: "Kembali",
  th: "กลับ",
  ar: "رجوع",
  hi: "वापस",
  ur: "واپس",
  ko: "뒤로",
  zh: "返回",
  pt: "Voltar",
  tr: "Geri",
};

type Props = {
  onClick: () => void;
  label?: string;
};

export function BackButton({ onClick, label: labelProp }: Props) {
  const t = usePlacementT();
  const label = labelProp ?? t(COPY_BACK);
  return (
    <Button
      type="button"
      variant="ghost"
      className="w-fit rounded-full px-3 text-slate-600"
      onClick={onClick}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}

export default BackButton;
