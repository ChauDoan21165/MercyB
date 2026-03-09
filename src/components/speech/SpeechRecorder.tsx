// src/components/speech/SpeechRecorder.tsx
//
// Mercy Blade — Speech Recorder
// Supabase Edge Function version
//
// Calls:
//   ${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/speech-analyze
//
// Requires:
// - VITE_SUPABASE_FUNCTIONS_URL in .env
// - Supabase auth session available
// - Edge Function deployed: speech-analyze

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SpeechAnalysisResponse } from "@/lib/speech/speechTypes";
import { supabase } from "@/lib/supabaseClient";

type SpeechRecorderProps = {
  roomId: string;
  lineId: string;
  targetText: string;
};

type SpeechState =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "recorded"
  | "analyzing"
  | "done"
  | "error";

function safeFunctionsBaseUrl(): string {
  return String(import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || "").trim().replace(/\/+$/, "");
}

function pickFileNameFromBlob(blob: Blob): string {
  const type = String(blob.type || "").toLowerCase();

  if (type.includes("webm")) return "speech.webm";
  if (type.includes("ogg")) return "speech.ogg";
  if (type.includes("wav")) return "speech.wav";
  if (type.includes("mp4")) return "speech.mp4";
  if (type.includes("mpeg")) return "speech.mp3";
  return "speech.webm";
}

function friendlyErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error || "");

  if (/functions url/i.test(msg)) return "Speech service is not configured yet.";
  if (/not signed in/i.test(msg)) return "Please sign in to analyze your speech.";
  if (/microphone/i.test(msg)) return "Microphone access was not available.";
  if (/analyze failed/i.test(msg)) return "We could not analyze your speech just now.";
  return msg || "Something went wrong.";
}

export default function SpeechRecorder({
  roomId,
  lineId,
  targetText,
}: SpeechRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [result, setResult] = useState<SpeechAnalysisResponse | null>(null);

  const functionsBaseUrl = useMemo(() => safeFunctionsBaseUrl(), []);

  const canRecord = useMemo(
    () =>
      speechState === "idle" ||
      speechState === "recorded" ||
      speechState === "done" ||
      speechState === "error",
    [speechState],
  );

  useEffect(() => {
    return () => {
      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch {
          // ignore
        }
      }

      try {
        streamRef.current?.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
    };
  }, [audioUrl]);

  async function startRecording() {
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone recording is not supported in this browser.");
      }

      if (typeof MediaRecorder === "undefined") {
        throw new Error("MediaRecorder is not available in this browser.");
      }

      setErrorText("");
      setResult(null);
      setAudioBlob(null);

      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
        } catch {
          // ignore
        }
      }
      setAudioUrl("");

      setSpeechState("requesting_permission");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);

        setAudioBlob(blob);
        setAudioUrl(url);
        setSpeechState("recorded");

        try {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        } catch {
          // ignore
        }
      };

      recorder.start();
      setSpeechState("recording");
    } catch (error) {
      console.error(error);
      setErrorText(friendlyErrorMessage(error));
      setSpeechState("error");
    }
  }

  function stopRecording() {
    try {
      if (mediaRecorderRef.current && speechState === "recording") {
        mediaRecorderRef.current.stop();
      }
    } catch (error) {
      console.error(error);
      setErrorText("Could not stop recording.");
      setSpeechState("error");
    }
  }

  async function analyzeRecording() {
    try {
      if (!audioBlob) return;

      if (!functionsBaseUrl) {
        throw new Error("Supabase Functions URL is missing.");
      }

      setSpeechState("analyzing");
      setErrorText("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Not signed in.");
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, pickFileNameFromBlob(audioBlob));
      formData.append("roomId", roomId);
      formData.append("lineId", lineId);
      formData.append("targetText", targetText);

      const response = await fetch(`${functionsBaseUrl}/speech-analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        const msg = String(json?.error || `Analyze failed: ${response.status}`);
        throw new Error(msg);
      }

      const data = json as SpeechAnalysisResponse;
      setResult(data);
      setSpeechState("done");
    } catch (error) {
      console.error(error);
      setErrorText(friendlyErrorMessage(error));
      setSpeechState("error");
    }
  }

  function resetRecorder() {
    setResult(null);
    setAudioBlob(null);

    if (audioUrl) {
      try {
        URL.revokeObjectURL(audioUrl);
      } catch {
        // ignore
      }
    }

    setAudioUrl("");
    setErrorText("");
    setSpeechState("idle");
  }

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 16,
        background: "rgba(255,255,255,0.88)",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 0.5,
          color: "#666",
        }}
      >
        SPEAK
      </div>

      <h3 style={{ marginTop: 8, marginBottom: 0 }}>Say this sentence</h3>
      <p style={{ fontSize: 20, lineHeight: 1.6, marginTop: 10 }}>{targetText}</p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
        {canRecord ? (
          <button type="button" onClick={startRecording}>
            Record
          </button>
        ) : null}

        {speechState === "recording" ? (
          <button type="button" onClick={stopRecording}>
            Stop
          </button>
        ) : null}

        {speechState === "recorded" && audioBlob ? (
          <>
            <button type="button" onClick={analyzeRecording}>
              Analyze
            </button>
            <button type="button" onClick={resetRecorder}>
              Record again
            </button>
          </>
        ) : null}
      </div>

      {speechState === "requesting_permission" ? (
        <p style={{ marginTop: 12 }}>Requesting microphone access…</p>
      ) : null}

      {speechState === "recording" ? (
        <p style={{ marginTop: 12 }}>Recording… speak calmly.</p>
      ) : null}

      {speechState === "analyzing" ? (
        <p style={{ marginTop: 12 }}>Listening carefully…</p>
      ) : null}

      {audioUrl ? (
        <div style={{ marginTop: 14 }}>
          <audio controls src={audioUrl} />
        </div>
      ) : null}

      {errorText ? (
        <div style={{ marginTop: 14, color: "#8b0000" }}>{errorText}</div>
      ) : null}

      {result ? (
        <div
          style={{
            marginTop: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 14,
            padding: 14,
            background: "rgba(245,250,255,0.95)",
          }}
        >
          <div style={{ fontWeight: 900 }}>We heard</div>
          <div style={{ marginTop: 6 }}>{result.transcript || "—"}</div>

          <div style={{ marginTop: 12, fontWeight: 900 }}>Match score</div>
          <div style={{ marginTop: 6 }}>{Math.round(result.matchScore * 100)}%</div>

          {result.missingWords.length > 0 ? (
            <>
              <div style={{ marginTop: 12, fontWeight: 900 }}>Missing words</div>
              <div style={{ marginTop: 6 }}>{result.missingWords.join(", ")}</div>
            </>
          ) : null}

          {result.extraWords.length > 0 ? (
            <>
              <div style={{ marginTop: 12, fontWeight: 900 }}>Extra words</div>
              <div style={{ marginTop: 6 }}>{result.extraWords.join(", ")}</div>
            </>
          ) : null}

          <div style={{ marginTop: 12, fontWeight: 900 }}>Feedback</div>
          <div style={{ marginTop: 6 }}>{result.message}</div>

          <div style={{ marginTop: 14 }}>
            <button type="button" onClick={resetRecorder}>
              Try once more
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}