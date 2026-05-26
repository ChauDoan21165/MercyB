import React from "react";
import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type SectionTitleProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

type ActionGridProps = DivProps & {
  columns?: 2 | 3;
};

type HeroBandProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function PageFrame({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[980px] px-4 py-4", className)}
      {...props}
    />
  );
}

export function PageSection({ className, ...props }: DivProps) {
  return <section className={cn("mt-4 md:mt-5", className)} {...props} />;
}

export function TopPriorityGrid({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:items-stretch",
        className
      )}
      {...props}
    />
  );
}

export function InfoCard({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-black/10 bg-white/95 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)] md:p-5",
        className
      )}
      {...props}
    />
  );
}

export function SoftCard({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,248,255,0.92))] p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] md:p-5",
        className
      )}
      {...props}
    />
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <div className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-black/45">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="mt-2 text-[24px] font-black leading-[1.08] tracking-[-0.03em] text-black/90 md:text-[30px]">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-2 text-[14px] leading-7 text-black/65 md:text-[15px]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function PrimaryActionRow({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("mt-4 flex flex-wrap items-center gap-2.5", className)}
      {...props}
    />
  );
}

export function ActionGrid({
  columns = 3,
  className,
  ...props
}: ActionGridProps) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : "md:grid-cols-3";

  return (
    <div
      className={cn("mt-4 grid grid-cols-1 gap-2.5", cols, className)}
      {...props}
    />
  );
}

export function ActionCardButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, ...rest } = props;

  return (
    <button
      className={cn(
        "flex min-h-[72px] w-full items-center rounded-2xl border border-black/12 bg-white/88 px-4 py-3 text-left text-[15px] font-extrabold text-black/75 shadow-sm transition hover:border-black/18 hover:bg-white",
        className
      )}
      {...rest}
    />
  );
}

export function HeroBand({ src, alt, className, imageClassName }: HeroBandProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[22px] border border-black/8 bg-white h-[180px] md:h-[260px]",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full object-cover", imageClassName)}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

export function EyebrowPill({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/85 px-2.5 py-1 text-[12px] font-black text-black/65",
        className
      )}
      {...props}
    />
  );
}

export function StatGrid({ className, ...props }: DivProps) {
  return (
    <div
      className={cn("mt-4 grid grid-cols-1 gap-3 md:grid-cols-3", className)}
      {...props}
    />
  );
}

export function StatCard({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/8 bg-white/92 p-4 shadow-sm",
        className
      )}
      {...props}
    />
  );
}