export default function MercyBladeMobileHeaderV1() {
  const actions = [
    { icon: "🎙️", label: "Practice Speaking", sub: "Quick voice drill" },
    { icon: "✨", label: "Chat with Mercy", sub: "Ask anything" },
    { icon: "🔊", label: "Audio Practice", sub: "Listen & repeat" },
  ];

  const nav = [
    { icon: "🏠", label: "Home", active: true },
    { icon: "📘", label: "Learn" },
    { icon: "🎤", label: "Practice" },
    { icon: "📊", label: "Progress" },
    { icon: "👥", label: "Community" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900">
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white shadow-xl">
        <header className="flex items-center justify-between px-4 pb-2 pt-3">
          <button
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200"
          >
            <span className="text-lg">☰</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 text-sm font-black text-slate-900 shadow-sm">
              M
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-slate-900">Mercy Blade</div>
              <div className="text-[11px] font-medium text-slate-500">English practice</div>
            </div>
          </div>

          <button
            aria-label="Open profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-sm"
          >
            C
          </button>
        </header>

        <main className="px-4 pb-28 pt-2">
          <section className="rounded-[28px] bg-slate-900 p-4 text-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-sky-100">
                  Today’s lesson
                </div>
                <h1 className="mt-3 text-[22px] font-bold leading-7 tracking-tight">
                  Resume Lesson 4
                </h1>
                <p className="mt-1 text-sm leading-5 text-slate-300">
                  Ordering food politely · about 3 minutes left
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                <div className="text-[11px] font-medium text-slate-300">Progress</div>
                <div className="text-base font-bold">62%</div>
              </div>
            </div>

            <button className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
              Resume Lesson
            </button>
          </section>

          <section className="mt-4 grid grid-cols-3 gap-3">
            {actions.map((item) => (
              <button
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-300"
              >
                <div className="mb-3 text-xl">{item.icon}</div>
                <div className="text-[13px] font-semibold leading-4 text-slate-900">
                  {item.label}
                </div>
                <div className="mt-1 text-[11px] leading-4 text-slate-500">{item.sub}</div>
              </button>
            ))}
          </section>

          <section className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <div className="text-xs font-semibold text-amber-700">Streak</div>
              <div className="mt-1 text-lg font-bold text-slate-900">5 days 🔥</div>
              <div className="mt-1 text-xs text-slate-600">Keep going today</div>
            </div>

            <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-100">
              <div className="text-xs font-semibold text-sky-700">This week</div>
              <div className="mt-1 text-lg font-bold text-slate-900">3 lessons</div>
              <div className="mt-1 text-xs text-slate-600">Nice consistency</div>
            </div>
          </section>

          <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Mercy Host</div>
                <p className="mt-1 text-xs leading-4 text-slate-500">
                  Need help with pronunciation or translation?
                </p>
              </div>
              <button className="rounded-full bg-pink-50 px-3 py-2 text-xs font-semibold text-pink-700 ring-1 ring-pink-100">
                Open
              </button>
            </div>
          </section>
        </main>

        <button className="fixed bottom-24 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg ring-1 ring-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-700">
            M
          </div>
          <span className="text-sm font-semibold text-slate-800">Mercy Host</span>
        </button>

        <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-sm -translate-x-1/2 items-center justify-around border-t border-slate-200 bg-white/95 px-2 pt-2 backdrop-blur [padding-bottom:calc(env(safe-area-inset-bottom)+10px)]">
          {nav.map((item) => (
            <button
              key={item.label}
              className="flex min-w-[62px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium text-slate-500"
            >
              <span className={item.active ? "text-slate-900" : ""}>{item.icon}</span>
              <span className={item.active ? "font-bold text-slate-900" : ""}>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
