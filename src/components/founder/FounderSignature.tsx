// src/components/founder/FounderSignature.tsx
//
// One-line "— Chau Doan, exiled journalist" tag. Designed to live at
// the bottom of a blog article or article-style content slot.
// Reads from PRODUCT_CONFIG so the founder identity stays editable
// from a single source.

import { Link } from "react-router-dom";

import { PRODUCT_CONFIG } from "@/config/product";

export type FounderSignatureProps = {
  /** Link the signature to /about/chau. Defaults to true. */
  linkToAbout?: boolean;
  /** Small (footer) vs medium (mid-article). Defaults to small. */
  size?: "sm" | "md";
};

export default function FounderSignature({
  linkToAbout = true,
  size = "sm",
}: FounderSignatureProps) {
  const className =
    size === "md"
      ? "text-sm text-black/70"
      : "text-xs text-black/55";

  const inner = (
    <>
      <span className="font-semibold">
        — {PRODUCT_CONFIG.founder.name}
      </span>
      <span className="italic"> · {PRODUCT_CONFIG.founder.story}</span>
    </>
  );

  if (!linkToAbout) {
    return <p className={`${className} m-0`}>{inner}</p>;
  }

  return (
    <p className={`${className} m-0`}>
      <Link
        to="/about/chau"
        className="hover:text-black/85 no-underline"
      >
        {inner}
      </Link>
    </p>
  );
}
