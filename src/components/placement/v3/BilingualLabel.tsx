import React from "react";
import type { BilingualText } from "@/lib/placement/v3/types";
import { cn } from "@/lib/utils";

type Props = {
  text: BilingualText;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  enClassName?: string;
  viClassName?: string;
  className?: string;
};

export function BilingualLabel({
  text,
  as: Tag = "div",
  enClassName,
  viClassName,
  className,
}: Props) {
  return (
    <Tag className={className}>
      <span className={cn("block", enClassName)}>{text.en}</span>
      <span className={cn("mt-1 block text-slate-500", viClassName)}>{text.vi}</span>
    </Tag>
  );
}

export default BilingualLabel;
