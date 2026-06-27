import React from "react";
import { Card } from "@/components/ui/card";
import type { BilingualText } from "@/lib/placement/v3/types";
import BilingualLabel from "./BilingualLabel";

type Props = {
  instruction: BilingualText;
  prompt: BilingualText;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function GenericTaskCard({ instruction, prompt, children, footer }: Props) {
  return (
    <Card className="mx-auto w-full max-w-[620px] rounded-[18px] border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <BilingualLabel
        text={instruction}
        enClassName="text-xs font-black uppercase tracking-[0.08em] text-slate-600"
        viClassName="text-[12px] font-medium text-slate-600"
      />
      <BilingualLabel
        text={prompt}
        as="h2"
        className="mt-4"
        enClassName="text-xl font-black leading-snug text-slate-950 sm:text-2xl"
        viClassName="text-sm font-medium leading-relaxed text-slate-600"
      />
      <div className="mt-5">{children}</div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </Card>
  );
}

export default GenericTaskCard;
