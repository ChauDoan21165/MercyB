import React from "react";
import type { BilingualText } from "@/lib/placement/v3/types";
import { cn } from "@/lib/utils";
import { useNativeLanguage } from "@/contexts/NativeLanguageContext";

type Props = {
  text: BilingualText;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  enClassName?: string;
  viClassName?: string;
  className?: string;
};

/**
 * Safe native-lang reader: returns "vi" when called outside
 * NativeLanguageProvider so existing call-sites never crash.
 */
function useSafeNativeLang(): string {
  try {
    return useNativeLanguage().nativeLang;
  } catch {
    return "vi";
  }
}

/**
 * Renders bilingual (EN + VI) text. When the learner's native language is
 * Vietnamese (nativeLang === "vi"), both English and Vietnamese are shown as
 * stacked lines. For any other native language, only the English line is
 * rendered — eliminating Vietnamese leakage for Chinese-/Japanese-/etc.
 * native learners who did not choose a Vietnamese-language route.
 */
export function BilingualLabel({
  text,
  as: Tag = "div",
  enClassName,
  viClassName,
  className,
}: Props) {
  const nativeLang = useSafeNativeLang();
  const showVi = nativeLang === "vi";

  return (
    <Tag className={className}>
      <span lang="en" className={cn("block", enClassName)}>{text.en}</span>
      {showVi && (
        <span lang="vi" className={cn("mt-1 block text-slate-500", viClassName)}>
          {text.vi}
        </span>
      )}
    </Tag>
  );
}

export default BilingualLabel;
