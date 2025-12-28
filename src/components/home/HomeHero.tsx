// src/components/home/HomeHero.tsx
// MB-BLUE-97.4 — 2025-12-29 (+0700)

import React from "react";

export default function HomeHero({
  title = "English & Knowledge",
  subtitle = "Colors of Life",
  // Put your hero image here (public/...)
  // Example: public/assets/hero-rainbow-clean.png
  imageSrc = "/assets/hero-rainbow-clean.png",
}: {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover select-none pointer-events-none"
          draggable={false}
        />
        {/* Soft veil like your screenshot */}
        <div className="absolute inset-0 bg-white/12 dark:bg-black/20" />
        {/* Subtle top fade for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent dark:from-black/35" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[260px] max-w-screen-md flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[340px] sm:px-6 lg:min-h-[420px]">
        <h1 className="text-balance text-[clamp(2.1rem,4.2vw,3.4rem)] font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_0_rgba(255,255,255,0.15)]">
          {title}
        </h1>
        <p className="mt-3 text-balance text-[clamp(1.1rem,2.3vw,1.6rem)] text-slate-900/90 dark:text-slate-100/90 drop-shadow-[0_1px_0_rgba(255,255,255,0.10)]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
