// src/pages/WeakAt.tsx
//
// Stage-3A /weak-at route. Hosts the local-only LocalWeaknessMap
// (different posture from /progress's Supabase aggregation —
// coexists, doesn't replace). Anon-viewable; the underlying
// component renders an empty-state when no local signal exists
// (per docs/stage-3a/local-weakness-map-design.md §7).
//
// Page shell is intentionally minimal: bilingual title, a one-line
// subtitle naming the source, and the component. No nav chrome,
// no actions — discovery + reading-only.

import LocalWeaknessMap from "@/components/stage-3a/LocalWeaknessMap";

export default function WeakAt() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6">
        {/* Bilingual title — VI primary (the home-axis), EN secondary */}
        <h1
          data-testid="weak-at-title-vi"
          className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
        >
          Điểm yếu của bạn
        </h1>
        <p
          data-testid="weak-at-title-en"
          className="mt-1 text-base text-slate-500"
        >
          What you're working on
        </p>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Tổng hợp từ thiết bị này (phát âm + ngữ pháp + placement) —
          không gửi lên server. Càng luyện càng chính xác.
        </p>
      </header>
      <LocalWeaknessMap />
    </main>
  );
}
