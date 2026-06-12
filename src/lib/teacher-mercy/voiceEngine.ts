import { fetchCloudTtsUrl } from "@/lib/mercyVoice";
import type { MercyLanguage } from "@/config/mercyVoices";
import {
  getTtsLocale,
  resolveTutorTargetLanguage,
} from "@/lib/tutor/languageRegistry";
import { sanitizeSpeakableText } from "@/lib/tutor/speakableText";
import {
  englishTextForTts,
  hasVietnameseDiacritics,
} from "@/lib/tutor/englishOnlyTts";

export type TeacherMercyVoiceStyle = "teacher-mercy" | "kid-friendly" | "neutral";

export type TeacherMercyVoiceStatus =
  | "idle"
  | "preparing"
  | "speaking"
  | "fallback"
  | "error";

export type TeacherMercyTargetLanguage =
  | "en"
  | "vi"
  | "fr"
  | "zh"
  | "de"
  | "ja"
  | "ko"
  | "es"
  | string;

export interface SpeakTutorTextOptions {
  targetLanguage?: TeacherMercyTargetLanguage;
  voiceStyle?: TeacherMercyVoiceStyle;
  preferCloudVoice?: boolean;
  fallbackToBrowserTts?: boolean;
  requiredCloudProvider?: "azure" | "elevenlabs";
  /**
   * Optional guard for correction flows. If the requested speech equals the raw
   * learner mistake, the engine refuses to read it aloud by default.
   */
  rawUserInput?: string;
  allowRawUserInput?: boolean;
}

export interface VoiceEngineStatus {
  status: TeacherMercyVoiceStatus;
  message: string | null;
  speaking: boolean;
  preparing: boolean;
  usingBrowserFallback: boolean;
  targetLanguage: string;
  locale: string;
  voiceStyle: TeacherMercyVoiceStyle;
  lastError: string | null;
}

export interface SpeakTutorTextResult {
  spoken: boolean;
  cloud: boolean;
  fallback: boolean;
  text: string;
  locale: string;
}

const PREPARING_MESSAGE = "Preparing Mercy voice…";
const FALLBACK_MESSAGE = "Mercy voice unavailable. Using device voice.";
const BROWSER_TTS_ERROR_MESSAGE = "Không nghe thấy? Kiểm tra âm lượng hoặc thử bấm lại.";
const AZURE_TTS_REQUIRED_MESSAGE =
  "Giọng Mercy Azure chưa sẵn sàng. Bấm thử lại sau giây lát — Mercy sẽ không tự chuyển sang giọng trình duyệt.";
// BUG3 trust floor: shown when the device has no matching-language voice (e.g. no Vietnamese
// voice). We suppress speech rather than read the text aloud in the wrong language.
const TARGET_VOICE_UNAVAILABLE_MESSAGE =
  "Thiết bị này chưa có giọng đọc đúng ngôn ngữ, nên Mercy tạm bỏ qua phần đọc để không đọc sai giọng. (No matching-language voice on this device — skipping audio so the text isn't read in the wrong language.)";

const DEFAULT_STATUS: VoiceEngineStatus = {
  status: "idle",
  message: null,
  speaking: false,
  preparing: false,
  usingBrowserFallback: false,
  targetLanguage: "en",
  locale: "en-US",
  voiceStyle: "teacher-mercy",
  lastError: null,
};

let status: VoiceEngineStatus = { ...DEFAULT_STATUS };
let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let requestId = 0;

function setStatus(next: Partial<VoiceEngineStatus>) {
  status = { ...status, ...next };
}

export function voiceLocaleForTargetLanguage(targetLanguage: TeacherMercyTargetLanguage = "en"): string {
  const normalized = String(targetLanguage || "en").trim();
  if (!normalized) return getTtsLocale("en");
  if (normalized.includes("-")) return normalized;
  return getTtsLocale(resolveTutorTargetLanguage(normalized));
}

function cloudLanguageForTarget(targetLanguage: TeacherMercyTargetLanguage = "en"): MercyLanguage {
  const normalized = String(targetLanguage || "en").trim().toLowerCase();
  const baseLanguage = normalized.split("-")[0];
  return resolveTutorTargetLanguage(baseLanguage || normalized) as MercyLanguage;
}

function requiresReliableAzureVoice(targetLanguage: TeacherMercyTargetLanguage = "en"): boolean {
  const normalized = String(targetLanguage || "en").trim().toLowerCase();
  const baseLanguage = normalized.split("-")[0];
  const target = resolveTutorTargetLanguage(baseLanguage || normalized);
  return target === "en" || target === "vi";
}

function normalizeText(text: string): string {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

function speakableTextFor(text: string, options: SpeakTutorTextOptions): string {
  const normalized = sanitizeSpeakableText(text);
  // TODO(structured-fields): interim guard for legacy display strings that still
  // concatenate Vietnamese and English before reaching the speech path.
  const englishOnly = englishTextForTts(normalized);
  const raw = normalizeText(options.rawUserInput ?? "");
  if (raw && englishOnly === raw && !options.allowRawUserInput) {
    return "";
  }
  return englishOnly;
}

function localeLanguagePrefix(locale: string): string {
  return String(locale || "").split("-")[0].toLowerCase();
}

function browserVoiceFor(locale: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const exact = voices.find((voice) => voice.lang === locale);
  if (exact) return exact;
  const languagePrefix = localeLanguagePrefix(locale);
  // Only ever return a voice in the SAME language. Never fall back to voices[0] (an arbitrary,
  // usually English voice): that is exactly how Vietnamese text ends up read aloud in English.
  return voices.find((voice) => localeLanguagePrefix(voice.lang) === languagePrefix) ?? null;
}

function waitForBrowserVoices(): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve();
  if (window.speechSynthesis.getVoices().length > 0) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.speechSynthesis.removeEventListener?.("voiceschanged", finish);
      window.clearTimeout(timeoutId);
      resolve();
    };
    const timeoutId = window.setTimeout(finish, 250);
    window.speechSynthesis.addEventListener?.("voiceschanged", finish, { once: true });
  });
}

function stopCloudAudio() {
  const audio = currentAudio;
  if (!audio) return;
  try {
    audio.pause();
    audio.src = "";
  } catch {
    // Best effort only.
  }
  currentAudio = null;
}

function stopBrowserSpeech() {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Best effort only.
  }
  currentUtterance = null;
}

async function speakViaBrowser(text: string, locale: string, currentRequestId: number): Promise<boolean> {
  if (
    typeof window === "undefined" ||
    typeof window.speechSynthesis === "undefined" ||
    typeof window.SpeechSynthesisUtterance === "undefined"
  ) {
    setStatus({
      status: "error",
      preparing: false,
      speaking: false,
      usingBrowserFallback: false,
      lastError: "Speech playback is not supported in this browser.",
      message: "Speech playback is not supported in this browser.",
    });
    return false;
  }

  stopBrowserSpeech();
  await waitForBrowserVoices();
  if (requestId !== currentRequestId) return false;

  return new Promise<boolean>((resolve) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = browserVoiceFor(locale);
    // BUG3: never read non-English (e.g. Vietnamese) text with a wrong-language voice. If the
    // device has no matching-language voice, suppress speech instead of letting the browser
    // substitute an English voice for Vietnamese text.
    if (!voice && localeLanguagePrefix(locale) !== "en") {
      if (requestId === currentRequestId) {
        setStatus({
          status: "error",
          preparing: false,
          speaking: false,
          usingBrowserFallback: false,
          lastError: TARGET_VOICE_UNAVAILABLE_MESSAGE,
          message: TARGET_VOICE_UNAVAILABLE_MESSAGE,
        });
      }
      resolve(false);
      return;
    }
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (requestId !== currentRequestId) return;
      setStatus({
        status: "fallback",
        preparing: false,
        speaking: true,
        usingBrowserFallback: true,
        message: FALLBACK_MESSAGE,
        lastError: null,
      });
    };
    utterance.onend = () => {
      if (requestId === currentRequestId) {
        setStatus({ status: "idle", speaking: false, preparing: false });
      }
      resolve(true);
    };
    utterance.onerror = () => {
      if (requestId === currentRequestId) {
        setStatus({
          status: "error",
          speaking: false,
          preparing: false,
          lastError: BROWSER_TTS_ERROR_MESSAGE,
          message: BROWSER_TTS_ERROR_MESSAGE,
        });
      }
      resolve(false);
    };

    currentUtterance = utterance;
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume?.();
      window.speechSynthesis.speak(utterance);
    } catch {
      setStatus({
        status: "error",
        speaking: false,
        preparing: false,
        lastError: BROWSER_TTS_ERROR_MESSAGE,
        message: BROWSER_TTS_ERROR_MESSAGE,
      });
      resolve(false);
    }
  });
}

async function playCloudAudio(audioUrl: string, currentRequestId: number): Promise<boolean> {
  if (typeof window === "undefined" || typeof window.Audio === "undefined") {
    return false;
  }

  stopCloudAudio();
  const audio = new window.Audio(audioUrl);
  currentAudio = audio;

  return new Promise<boolean>((resolve) => {
    audio.onplay = () => {
      if (requestId !== currentRequestId) return;
      setStatus({
        status: "speaking",
        preparing: false,
        speaking: true,
        usingBrowserFallback: false,
        message: null,
        lastError: null,
      });
    };
    audio.onended = () => {
      if (requestId === currentRequestId) {
        currentAudio = null;
        setStatus({ status: "idle", speaking: false, preparing: false });
      }
      resolve(true);
    };
    audio.onerror = () => resolve(false);
    audio.play().catch(() => resolve(false));
  });
}

export async function speakTutorText(
  text: string,
  options: SpeakTutorTextOptions = {},
): Promise<SpeakTutorTextResult> {
  const requestedTargetLanguage = options.targetLanguage ?? "en";
  const voiceStyle = options.voiceStyle ?? "teacher-mercy";
  const speakableText = speakableTextFor(text, options);
  const targetLanguage =
    hasVietnameseDiacritics(String(text ?? "")) && speakableText
      ? "en"
      : requestedTargetLanguage;
  const locale = voiceLocaleForTargetLanguage(targetLanguage);
  const currentRequestId = requestId + 1;
  requestId = currentRequestId;

  stopCloudAudio();
  stopBrowserSpeech();

  setStatus({
    status: "idle",
    message: null,
    speaking: false,
    preparing: false,
    usingBrowserFallback: false,
    targetLanguage: String(targetLanguage),
    locale,
    voiceStyle,
    lastError: null,
  });

  if (!speakableText) {
    return { spoken: false, cloud: false, fallback: false, text: "", locale };
  }

  const preferCloudVoice = options.preferCloudVoice ?? true;
  const reliableAzureRequired = requiresReliableAzureVoice(targetLanguage);
  const requiredCloudProvider = options.requiredCloudProvider ?? (reliableAzureRequired ? "azure" : undefined);
  const fallbackToBrowserTts = reliableAzureRequired
    ? false
    : options.fallbackToBrowserTts ?? true;

  if (preferCloudVoice || requiredCloudProvider) {
    setStatus({
      status: "preparing",
      preparing: true,
      speaking: false,
      message: PREPARING_MESSAGE,
      usingBrowserFallback: false,
    });

    const cloud = await fetchCloudTtsUrl({
      text: speakableText,
      language: cloudLanguageForTarget(targetLanguage),
      ...(requiredCloudProvider ? { requiredProvider: requiredCloudProvider } : {}),
    });

    if (requestId !== currentRequestId) {
      return { spoken: false, cloud: false, fallback: false, text: speakableText, locale };
    }

    if (cloud?.audioUrl && (!requiredCloudProvider || cloud.provider === requiredCloudProvider)) {
      const played = await playCloudAudio(cloud.audioUrl, currentRequestId);
      if (played) {
        return { spoken: true, cloud: true, fallback: false, text: speakableText, locale };
      }
    }

    if (requiredCloudProvider) {
      setStatus({
        status: "error",
        preparing: false,
        speaking: false,
        usingBrowserFallback: false,
        lastError: AZURE_TTS_REQUIRED_MESSAGE,
        message: AZURE_TTS_REQUIRED_MESSAGE,
      });
      return { spoken: false, cloud: false, fallback: false, text: speakableText, locale };
    }
  }

  if (!fallbackToBrowserTts || requestId !== currentRequestId) {
    setStatus({ status: "idle", preparing: false, speaking: false });
    return { spoken: false, cloud: false, fallback: false, text: speakableText, locale };
  }

  setStatus({
    status: "fallback",
    preparing: false,
    speaking: false,
    usingBrowserFallback: true,
    message: FALLBACK_MESSAGE,
  });
  const fallbackSpoken = await speakViaBrowser(speakableText, locale, currentRequestId);
  return {
    spoken: fallbackSpoken,
    cloud: false,
    fallback: fallbackSpoken,
    text: speakableText,
    locale,
  };
}

export function stopTutorSpeech() {
  requestId += 1;
  stopCloudAudio();
  stopBrowserSpeech();
  setStatus({
    status: "idle",
    message: null,
    speaking: false,
    preparing: false,
    usingBrowserFallback: false,
    lastError: null,
  });
}

export function getVoiceStatus(): VoiceEngineStatus {
  return { ...status };
}
