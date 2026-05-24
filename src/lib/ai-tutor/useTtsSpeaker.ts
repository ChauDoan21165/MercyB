// src/lib/ai-tutor/useTtsSpeaker.ts
// React wrapper around the shared Teacher Mercy voice engine.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getVoiceStatus,
  speakTutorText,
  stopTutorSpeech,
  type SpeakTutorTextOptions,
} from "@/lib/teacher-mercy/voiceEngine";
import {
  getTutorLanguage,
  type TutorLanguageCode,
} from "@/lib/tutor/languageRegistry";
import { sanitizeSpeakableText } from "@/lib/tutor/tutorEngine";

export interface UseTtsSpeakerResult {
  supported: boolean;
  speaking: boolean;
  preparing: boolean;
  usingBrowserFallback: boolean;
  voiceSource: "mercy" | "device" | null;
  speak: (
    text: string,
    lang: string,
    target?: TutorLanguageCode,
    options?: Pick<SpeakTutorTextOptions, "voiceStyle">,
  ) => Promise<void>;
  stop: () => void;
  error: string | null;
}

export function useTtsSpeaker(): UseTtsSpeakerResult {
  const [supported] = useState(() => {
    if (typeof window === "undefined") return false;
    return typeof window.speechSynthesis !== "undefined" || typeof window.Audio !== "undefined";
  });
  const [speaking, setSpeaking] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [usingBrowserFallback, setUsingBrowserFallback] = useState(false);
  const [voiceSource, setVoiceSource] = useState<"mercy" | "device" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef(0);
  const pollRef = useRef<number | null>(null);

  const syncFromVoiceStatus = useCallback(() => {
    const voiceStatus = getVoiceStatus();
    setPreparing(voiceStatus.preparing);
    setSpeaking(voiceStatus.speaking);
    setUsingBrowserFallback(voiceStatus.usingBrowserFallback);
    if (voiceStatus.usingBrowserFallback) setVoiceSource("device");
    else if (voiceStatus.status === "speaking") setVoiceSource("mercy");
    setError(voiceStatus.lastError);
  }, []);

  const clearPoll = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!supported) return;
    const id = window.setInterval(() => {
      try { window.speechSynthesis?.resume(); } catch { /* ignore */ }
    }, 5000);
    return () => window.clearInterval(id);
  }, [supported]);

  const stop = useCallback(() => {
    requestRef.current += 1;
    clearPoll();
    stopTutorSpeech();
    setPreparing(false);
    setSpeaking(false);
    setUsingBrowserFallback(false);
    setVoiceSource(null);
    setError(null);
  }, [clearPoll]);

  const speak = useCallback(async (
    text: string,
    lang: string,
    target: TutorLanguageCode = "en",
    options: Pick<SpeakTutorTextOptions, "voiceStyle"> = {},
  ) => {
    const safeText = sanitizeSpeakableText(text);
    if (!safeText) return;
    if (!supported) {
      setError("Speech playback is not supported in this browser.");
      return;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    clearPoll();
    setError(null);
    setUsingBrowserFallback(false);
    setVoiceSource(null);
    setPreparing(true);

    pollRef.current = window.setInterval(() => {
      if (requestRef.current !== requestId) return;
      syncFromVoiceStatus();
    }, 25);

    const targetLanguage = getTutorLanguage(target);
    const result = await speakTutorText(safeText, {
      targetLanguage: targetLanguage.code,
      voiceStyle: options.voiceStyle ?? "teacher-mercy",
      preferCloudVoice: true,
      fallbackToBrowserTts: targetLanguage.supportsBrowserTts,
    });

    if (requestRef.current !== requestId) return;
    clearPoll();
    syncFromVoiceStatus();
    setPreparing(false);
    setUsingBrowserFallback(result.fallback || getVoiceStatus().usingBrowserFallback);
    setVoiceSource(result.cloud ? "mercy" : result.fallback ? "device" : null);
    if (!result.spoken && safeText) {
      setSpeaking(false);
    }

    if (!targetLanguage.supportsBrowserTts && !result.spoken) {
      setError(`Speech playback is not supported for ${targetLanguage.labelEn}.`);
    }

    void lang;
  }, [clearPoll, supported, syncFromVoiceStatus]);

  useEffect(() => stop, [stop]);

  return { supported, speaking, preparing, usingBrowserFallback, voiceSource, speak, stop, error };
}
