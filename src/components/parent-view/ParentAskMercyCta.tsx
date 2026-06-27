import { Link } from "react-router-dom";

import { Bilingual } from "@/components/Bilingual";

export function ParentAskMercyCta() {
  // Subtle CTA per doc § First-build scope #4. Links into the existing
  // reading-only tutor surface — NOT a parent→learner write.
  return (
    <Link
      to="/weak-at"
      data-testid="parent-ask-mercy"
      aria-label="Mở bản đồ điểm cần luyện"
      className="block rounded-[20px] border border-slate-200/70 bg-white px-4 py-3 text-center text-sm font-semibold text-indigo-700 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <Bilingual
        primary="vi"
        vi="Xem bản đồ điểm cần luyện"
        en="Open practice map"
        viClassName="text-sm font-semibold text-indigo-700"
        enClassName="text-[12px] text-slate-600"
      />
    </Link>
  );
}
