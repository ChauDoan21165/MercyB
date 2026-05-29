// src/lib/ai-tutor/useBrowserStt.ts
// Browser Speech-to-Text hook using Web Speech API.
// No audio upload, no raw audio storage, no external provider.

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

export interface UseBrowserSttResult {
  supported: boolean;
  listening: boolean;
  transcript: string;
  finalTranscript: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

const FILLER_PATTERN = /\b(?:ok|okay)\b|chương trình nó chạy xong/gi;

function normalizeTranscript(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(FILLER_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim();
}

function collapseRepeatedPhrases(value: string): string {
  let text = normalizeTranscript(value);
  if (!text) return "";

  const words = text.split(" ");
  const maxPhrase = Math.min(10, Math.floor(words.length / 2));
  for (let size = maxPhrase; size >= 1; size--) {
    const collapsed: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const phrase = words.slice(i, i + size).join(" ").toLowerCase();
      const previous = collapsed.slice(-size).join(" ").toLowerCase();
      if (phrase && phrase === previous) {
        i += size - 1;
        continue;
      }
      collapsed.push(words[i]);
    }
    words.splice(0, words.length, ...collapsed);
  }

  text = words.join(" ");
  const clauses = text
    .split(/\s*(?:[.!?。！？]+|[,;，；]|\s+-\s+)\s*/)
    .map(normalizeTranscript)
    .filter(Boolean);
  const uniqueClauses = clauses.filter((clause, index) => {
    const normalized = clause.toLowerCase();
    return !clauses.slice(0, index).some((previous) => {
      const prior = previous.toLowerCase();
      return normalized === prior || normalized.includes(prior) || prior.includes(normalized);
    });
  });

  return uniqueClauses.length > 0 ? uniqueClauses.join(" ") : text;
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
  const interimRef = useRef("");
  const finalSegmentsRef = useRef<string[]>([]);

  const start = useCallback(() => {
    const rec = createRecognizer(lang);
    if (!rec) {
      setError("Voice input is not supported in this browser. Please type your sentence.");
      return;
    }
    setError(null);
    setTranscript("");
    finalRef.current = "";
    interimRef.current = "";
    finalSegmentsRef.current = [];

    rec.onstart = () => setListening(true);
    rec.onresult = (event) => {
      let interim = "";
      const startIndex = Math.max(0, event.resultIndex ?? 0);
      for (let i = startIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const text = normalizeTranscript(r[0]?.transcript ?? "");
        if (!text) continue;
        if (r.isFinal) {
          finalSegmentsRef.current[i] = text;
        } else {
          interim = text;
        }
      }
      const uniqueFinalSegments = finalSegmentsRef.current
        .filter(Boolean)
        .filter((text, index, segments) => index === 0 || text !== segments[index - 1]);
      finalRef.current = collapseRepeatedPhrases(uniqueFinalSegments.join(" "));
      interimRef.current = collapseRepeatedPhrases(interim);
      const preview = collapseRepeatedPhrases(
        [finalRef.current, interimRef.current].filter(Boolean).join(" "),
      );
      setTranscript(preview);
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
      const committed = collapseRepeatedPhrases(finalRef.current || interimRef.current);
      finalRef.current = committed;
      interimRef.current = "";
      if (committed) setTranscript(committed);
    };

    rec.start();
    recRef.current = rec;
  }, [lang]);

  const stop = useCallback(() => {
    const rec = recRef.current;
    rec?.stop();
    if (rec) {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
    }
    recRef.current = null;
    setListening(false);
    const committed = collapseRepeatedPhrases(finalRef.current || interimRef.current);
    finalRef.current = committed;
    interimRef.current = "";
    if (committed) setTranscript(committed);
  }, []);

  const reset = useCallback(() => {
    finalRef.current = "";
    interimRef.current = "";
    finalSegmentsRef.current = [];
    setTranscript("");
  }, []);

  useEffect(() => {
    return () => {
      recRef.current?.stop();
    };
  }, []);

  return { supported, listening, transcript, finalTranscript: finalRef.current, start, stop, reset, error };
}
