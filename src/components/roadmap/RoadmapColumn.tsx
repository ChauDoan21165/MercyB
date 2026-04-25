import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  badgeColor: "blue" | "amber" | "emerald";
  children: ReactNode;
  empty: string;
  isEmpty: boolean;
};

const COLOR_STYLES: Record<Props["badgeColor"], string> = {
  blue:    "bg-blue-100 text-blue-900",
  amber:   "bg-amber-100 text-amber-900",
  emerald: "bg-emerald-100 text-emerald-900",
};

export function RoadmapColumn({ title, subtitle, badgeColor, children, empty, isEmpty }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <header>
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${COLOR_STYLES[badgeColor]}`}>
          {title}
        </span>
        {subtitle ? <p className="text-xs text-black/55 mt-1">{subtitle}</p> : null}
      </header>
      {isEmpty ? (
        <p className="text-sm text-black/45 italic">{empty}</p>
      ) : (
        <div className="flex flex-col gap-3">{children}</div>
      )}
    </section>
  );
}
