// The "interim English bridge" surface.
//
// WHY THIS EXISTS
//   Some native languages have English-learning CONTENT but no L1-specific
//   correction rules yet — their tutor language config is a label-only spread of
//   `en` (e.g. src/lib/tutor/languages/th.ts). Dropping those learners into the
//   Vietnamese-default correction flow is wrong: they get VN framing and VN
//   explanations for a tutor that is not theirs. Hiding the tutor entirely throws
//   away a working English engine.
//
//   Instead we route them to an honestly-framed English coaching surface: the
//   real English engine, labeled in their language, with a light, visible
//   "a deeper <Language> tutor is coming" note. Truthful about what it is (real
//   English practice) and what it is not (native-language-specific depth).
//
// GENERALITY (load-bearing — do not hardcode Thai against reuse)
//   Thai is the FIRST bridge native, not a special case. Japanese, Indonesian,
//   etc. follow the identical pattern: add an entry to BRIDGE_NATIVES when that
//   language's bridge surface is ready. The gate and the surface copy are already
//   parametrized by the bridge descriptor, so no per-language code is needed.

import { readAnonymousPair } from "@/lib/languagePair/anonymousPair";
import type { NativeLang, TargetLang } from "@/lib/onboarding/types";

export interface InterimEnglishBridge {
  /** NativeLang code, e.g. "th". */
  code: NativeLang;
  /** Endonym shown to the learner, e.g. "ไทย". */
  endonym: string;
  /** English name, e.g. "Thai". */
  englishName: string;
  /** Optional dedicated lesson page for this native→English pair. */
  lessonHref?: string;
}

/**
 * Native languages that have an interim English bridge surface TODAY. Grow this
 * map as each language's bridge ships — the gate and surface are already generic.
 */
const BRIDGE_NATIVES: Partial<Record<NativeLang, InterimEnglishBridge>> = {
  th: { code: "th", endonym: "ไทย", englishName: "Thai", lessonHref: "/thai-english/" },
};

/**
 * URL `native` param aliases → NativeLang code. Kept permissive because the param
 * has historically arrived as a code ("th"), an English name ("thai"), or an
 * endonym ("ไทย"). Only bridge natives need aliases here.
 */
const URL_NATIVE_ALIASES: Record<string, NativeLang> = {
  th: "th",
  thai: "th",
  "ไทย": "th",
  "tiếng thái": "th",
  "tieng thai": "th",
};

const ENGLISH_TARGET: TargetLang = "en";
const ENGLISH_TARGET_ALIASES = new Set(["en", "english", "tiếng anh", "tieng anh"]);

function readUrlNativeParam(search?: string): string | null {
  if (!search) return null;
  try {
    return (new URLSearchParams(search).get("native") ?? "").trim().toLowerCase() || null;
  } catch {
    return null;
  }
}

function bridgeFromUrl(search?: string): InterimEnglishBridge | null {
  const nativeRaw = readUrlNativeParam(search);
  if (!nativeRaw) return null;
  let target = "en";
  try {
    target = (new URLSearchParams(search ?? "").get("target") ?? "en").trim().toLowerCase();
  } catch {
    return null;
  }
  if (!ENGLISH_TARGET_ALIASES.has(target)) return null;
  const code = URL_NATIVE_ALIASES[nativeRaw];
  return code ? BRIDGE_NATIVES[code] ?? null : null;
}

function bridgeFromStoredPair(): InterimEnglishBridge | null {
  const pair = readAnonymousPair();
  if (!pair) return null;
  if (!pair.targets.includes(ENGLISH_TARGET)) return null;
  return BRIDGE_NATIVES[pair.native] ?? null;
}

/**
 * Resolve the interim English bridge surface for this tutor session, or null to
 * use the default correction flow.
 *
 * Resolution order:
 *   1. URL `native` param (with target = English). An explicit native wins.
 *   2. When the URL carries NO native param, fall back to the stored anonymous
 *      language pair — this is the fix for entry points that navigate to
 *      /ai-tutor without threading `native` (Home, the CTA banner, any future
 *      one).
 *
 * When the URL specifies a native that is NOT a bridge native (e.g. `native=vi`),
 * we honor it and return null — we never override an explicit URL native with the
 * stored pair. This keeps the Vietnamese-default flow untouched.
 */
export function resolveInterimEnglishBridge(search?: string): InterimEnglishBridge | null {
  const fromUrl = bridgeFromUrl(search);
  if (fromUrl) return fromUrl;
  // An explicit (but non-bridge) URL native must not be overridden by the pair.
  if (readUrlNativeParam(search)) return null;
  return bridgeFromStoredPair();
}

/**
 * The light, honest "deeper tutor coming" note. Reusable across every bridge
 * native — never Thai-hardcoded.
 */
export function interimBridgeComingSoonNote(bridge: InterimEnglishBridge): string {
  return `English coaching — a ${bridge.englishName}-specific tutor is coming.`;
}
