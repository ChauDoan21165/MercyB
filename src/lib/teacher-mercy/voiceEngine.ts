import { fetchCloudTtsUrl } from "@/lib/mercyVoice";
import type { MercyLanguage } from "@/config/mercyVoices";
import {
  getTtsLocale,
  resolveTutorTargetLanguage,
} from "@/lib/tutor/languageRegistry";
import { sanitizeSpeakableText } from "@/lib/tutor/speakableText";

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
  return resolveTutorTargetLanguage(String(targetLanguage || "en")) as MercyLanguage;
}

function normalizeText(text: string): string {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

function speakableTextFor(text: string, options: SpeakTutorTextOptions): string {
  const normalized = sanitizeSpeakableText(text);
  const raw = normalizeText(options.rawUserInput ?? "");
  if (raw && normalized === raw && !options.allowRawUserInput) {
    return "";
  }
  return normalized;
}

function browserVoiceFor(locale: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const exact = voices.find((voice) => voice.lang === locale);
  if (exact) return exact;
  const languagePrefix = locale.split("-")[0];
  return voices.find((voice) => voice.lang.startsWith(languagePrefix)) ?? voices[0] ?? null;
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
  return new Promise<boolean>((resolve) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.85;
    utterance.volume = 1;
    const voice = browserVoiceFor(locale);
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
          lastError: "Speech playback failed. Please try again.",
          message: "Speech playback failed. Please try again.",
        });
      }
      resolve(false);
    };

    currentUtterance = utterance;
    try {
      // Some mobile browsers suspend the speech queue between user gestures.
      // Resume immediately before speaking so device TTS starts reliably.
      window.speechSynthesis.resume?.();
      window.speechSynthesis.speak(utterance);
    } catch {
      setStatus({
        status: "error",
        speaking: false,
        preparing: false,
        lastError: "Speech playback failed. Please try again.",
        message: "Speech playback failed. Please try again.",
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
  const targetLanguage = options.targetLanguage ?? "en";
  const locale = voiceLocaleForTargetLanguage(targetLanguage);
  const voiceStyle = options.voiceStyle ?? "teacher-mercy";
  const speakableText = speakableTextFor(text, options);
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
  const fallbackToBrowserTts = options.fallbackToBrowserTts ?? true;

  if (preferCloudVoice) {
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
    });

    if (requestId !== currentRequestId) {
      return { spoken: false, cloud: false, fallback: false, text: speakableText, locale };
    }

    if (cloud?.audioUrl) {
      const played = await playCloudAudio(cloud.audioUrl, currentRequestId);
      if (played) {
        return { spoken: true, cloud: true, fallback: false, text: speakableText, locale };
      }
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
