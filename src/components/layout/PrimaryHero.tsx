// src/components/layout/PrimaryHero.tsx
import { cn } from "@/lib/utils";

type PrimaryHeroProps = {
  title: string;
  subtitle?: string;
  background?: string; // path to background image or imported asset
  className?: string;
};

export function PrimaryHero({
  title,
  subtitle,
  background,
  className,
}: PrimaryHeroProps) {
  return (
    <section className={cn("relative w-full overflow-hidden", className)}>
      {/* Background image */}
      {background && (
        <div className="absolute inset-0">
          <img
            src={background}
            alt=""
            className="h-full w-full object-cover"
          />
          {/* optional soft overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      {/* Safe text container */}
      <div className="relative mx-auto flex min-h-[260px] max-w-screen-md flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[340px] sm:px-6 lg:min-h-[420px]">
        <h1 className="text-balance text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-tight tracking-tight text-white drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-balance text-[clamp(1.1rem,2.3vw,1.6rem)] text-white/90 drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
