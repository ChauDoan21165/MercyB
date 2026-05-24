// src/lib/ai-tutor/useBrowserStt.ts
// Browser Speech-to-Text hook using Web Speech API.
// No audio upload, no raw audio storage, no external provider.

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

export interface UseBrowserSttResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  error: string | null;
}

function createRecognizer(lang: string): SpeechRecognitionLike | null {
  const w = window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike; SpeechRecognition?: new () => SpeechRecognitionLike };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = lang;
  return rec;
}

export function useBrowserStt(lang = "en-US"): UseBrowserSttResult {
  const [supported] = useState(() => {
    const w = window as Window & { webkitSpeechRecognition?: unknown; SpeechRecognition?: unknown };
    return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
  });
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");

  const start = useCallback(() => {
    const rec = createRecognizer(lang);
    if (!rec) {
      setError("Voice input is not supported in this browser. Please type your sentence.");
      return;
    }
    setError(null);
    setTranscript("");
    finalRef.current = "";

    rec.onstart = () => setListening(true);
    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.results.length - 1; i >= 0; i--) {
        const r = event.results[i];
        const text = (r[0]?.transcript ?? "");
        if (r.isFinal) {
          finalRef.current += (finalRef.current ? " " : "") + text;
        } else {
          interim = text;
        }
      }
      setTranscript(finalRef.current + (interim ? ` ${interim}` : ""));
    };
    rec.onerror = (event) => {
      const msg = event.error === "not-allowed"
        ? "Microphone access was denied. Please allow microphone access in your browser settings."
        : event.error === "no-speech"
          ? "No speech detected. Please try again."
          : `Voice input error: ${event.error ?? "unknown"}`;
      setError(msg);
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      if (finalRef.current) setTranscript(finalRef.current);
    };

    rec.start();
    recRef.current = rec;
  }, [lang]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
    if (finalRef.current) setTranscript(finalRef.current);
  }, []);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
    };
  }, []);

  return { supported, listening, transcript, start, stop, error };
}
