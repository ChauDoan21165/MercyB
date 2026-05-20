import { Loader2 } from "lucide-react";
import BilingualLabel from "./BilingualLabel";

type Props = {
  label?: {
    en: string;
    vi: string;
  };
};

export function LoadingPlaceholder({
  label = { en: "Loading your placement test", vi: "Đang tải bài đánh giá của bạn" },
}: Props) {
  return (
    <div
      className="mx-auto flex min-h-[240px] w-full max-w-[560px] flex-col items-center justify-center gap-4 rounded-[18px] border border-slate-200 bg-white p-6 text-center shadow-sm"
      aria-busy="true"
      role="status"
    >
      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" aria-hidden />
      <BilingualLabel
        text={label}
        enClassName="text-sm font-black text-slate-800"
        viClassName="text-xs font-medium text-slate-400"
      />
    </div>
  );
}

export default LoadingPlaceholder;
