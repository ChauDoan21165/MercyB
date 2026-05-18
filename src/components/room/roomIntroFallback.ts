// src/components/room/roomIntroFallback.ts
//
// Pure room-intro field selection + the M4 honest-fallback predicate.
//
// WHY A SEPARATE MODULE: these were inline in RoomRenderer.tsx, but the
// load-bearing bit — "would a VI learner be silently shown English here?"
// — needs a unit test, and pulling the full RoomRenderer graph (Supabase
// client, audio resolver, …) into a test just to assert a string pick is
// exactly the kind of central-file coupling CLAUDE.md warns about. These
// functions have zero runtime deps, so the test imports only this file.
//
// M4 context: /private/tmp/wrong-language-sweep-report.md §"MECHANISM 4".
// Room JSON ships a plain English `description` string PLUS structured
// `content.{en,vi}`; ~28 rooms have `content.vi = ""` / no `description_vi`.
// pickIntroVI's final `r?.description` link then substitutes that English
// string for the missing Vietnamese, so the welcome line renders `EN / EN`
// to a Vietnamese learner with no signal. pickIntroVIStrict / isViIntroMissing
// detect exactly that case so the caller can show an honest badge + beacon
// instead.

// Rooms are loaded untyped (JSON of many historical shapes); mirrors the
// `AnyRoom` alias RoomRenderer uses for the same values.
type AnyRoom = any;

export const pickIntroEN = (r: AnyRoom): string =>
  (r?.intro?.en ||
    r?.description?.en ||
    r?.intro_en ||
    r?.description_en ||
    r?.summary?.en ||
    r?.summary_en ||
    r?.description ||
    "") as string;

export const pickIntroVI = (r: AnyRoom): string =>
  (r?.intro?.vi ||
    r?.description?.vi ||
    r?.intro_vi ||
    r?.description_vi ||
    r?.summary?.vi ||
    r?.summary_vi ||
    r?.description ||
    "") as string;

// Genuine Vietnamese intro ONLY — the same chain as pickIntroVI minus the
// trailing `r?.description` plain-string fallback (almost always English).
// Returns "" when no real VI copy exists. `content.vi` is intentionally NOT
// consulted: pickIntroVI never read it, and adding it now would change which
// text renders — out of scope here (this is the delivery-side fix; authoring
// the missing VI is the separate clinical-content backlog).
export const pickIntroVIStrict = (r: AnyRoom): string =>
  (r?.intro?.vi ||
    r?.description?.vi ||
    r?.intro_vi ||
    r?.description_vi ||
    r?.summary?.vi ||
    r?.summary_vi ||
    "") as string;

// Pure predicate behind the M4 honest-fallback badge + Sentry beacon: a VI
// learner would otherwise be shown English in the welcome line. True iff
// there is EN intro content to show AND no genuine VI copy exists. A room
// with neither just gets the generated bilingual welcome (no leak → false).
export const isViIntroMissing = (r: AnyRoom): boolean =>
  !pickIntroVIStrict(r).trim() && !!pickIntroEN(r).trim();
