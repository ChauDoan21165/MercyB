<header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
  {/* FULL WIDTH STRIP (buttons can reach viewport padding edge) */}
  <div className="w-full px-4">
    <div className="relative h-12">
      {/* LEFT: flush to viewport padding edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <HomeButton />
        <BackButton />
      </div>

      {/* CENTER: true centered brand, using 980 frame ONLY for centering */}
      <div className="mx-auto max-w-[980px] h-12 flex items-center justify-center pointer-events-none">
        <div
          className="select-none font-extrabold tracking-tight text-sm sm:text-base"
          aria-label="Mercy Blade"
          title="Mercy Blade"
        >
          Mercy Blade
        </div>
      </div>

      {/* RIGHT: optional future actions pinned to right edge */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* actions */}
      </div>
    </div>
  </div>
</header>
