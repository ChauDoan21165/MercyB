// src/features/review/content/index.ts — D3 public surface.
//
// The session slice (D4) builds a deck via `createContentAdapter()`. Per-source
// factories + the internal ReviewSource seam are exported too, so other slices
// (or tests) can compose a custom adapter, but the default `createContentAdapter()`
// wires the real content.

export { createContentAdapter } from "./contentAdapter";
export type { CreateContentAdapterOptions } from "./contentAdapter";

export type { ReviewSource } from "./sources/source";
export { createSpanishLessonsSource } from "./sources/spanishLessons";
export type { SpanishLessonLike } from "./sources/spanishLessons";
export { createBilingualSentencesSource } from "./sources/bilingualSentences";
export type { BilingualSentenceLike } from "./sources/bilingualSentences";

export { slugify, stableHash } from "./slug";
