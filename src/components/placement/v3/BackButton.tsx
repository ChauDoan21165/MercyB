import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
  label?: string;
};

export function BackButton({ onClick, label = "Back · Quay lại" }: Props) {
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
