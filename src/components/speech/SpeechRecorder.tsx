import { useEffect, useRef, useState } from "react";
import { sendSpeechForAnalysis } from "@/lib/speech/sendSpeechForAnalysis";
import type { SpeechAnalysisResponse } from "@/lib/speech/speechTypes";

type SpeechRecorderProps = {
  roomId: string;
  lineId: string;
  targetText: string;
  disabled?: boolean;
  onResult?: (result: SpeechAnalysisResponse) => void;
  onError?: (message: string) => void;
};

type RecorderState =
  | "idle"
  | "requesting-permission"
  | "recording"
  | "stopping"
  | "uploading"
  | "success"
  | "error";

export default function SpeechRecorder({
  roomId,
  lineId,
  targetText,
  disabled = false,
  onResult,
  onError,
}: SpeechRecorderProps) {
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [result, setResult] = useState<SpeechAnalysisResponse | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const isBusy =
    recorderState === "requesting-permission" ||
    recorderState === "stopping" ||
    recorderState === "uploading";

  const isRecording = recorderState === "recording";

  useEffect(() => {
    return () => {
      cleanupMedia();
      clearRecordingTimer();
    };
  }, []);

  function clearRecordingTimer() {
    if (recordingTimerRef.current !== null) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }

  function startRecordingTimer() {
    clearRecordingTimer();
    setRecordingSeconds(0);

    recordingTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }

  function cleanupMedia() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.onerror = null;
      mediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
      mediaStreamRef.current = null;
    }

    recordedChunksRef.current = [];
  }

  function resetFeedback() {
    setErrorMessage("");
    setResult(null);
  }

  async function startRecording() {
    if (disabled || isBusy || isRecording) return;

    resetFeedback();
    setRecorderState("requesting-permission");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      recordedChunksRef.current = [];

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        clearRecordingTimer();
        cleanupMedia();
        setRecorderState("error");
        setErrorMessage("Recording failed. Please try again.");
        onError?.("Recording failed. Please try again.");
      };

      recorder.onstop = async () => {
        clearRecordingTimer();
        setRecorderState("uploading");

        try {
          const mime = recorder.mimeType || "audio/webm";
          const audioBlob = new Blob(recordedChunksRef.current, { type: mime });

          if (audioBlob.size === 0) {
            throw new Error("No audio was recorded.");
          }

          const analysis = await sendSpeechForAnalysis({
            audioBlob,
            roomId,
            lineId,
            targetText,
          });

          setResult(analysis);
          setRecorderState("success");
          onResult?.(analysis);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Could not analyze speech.";
          setRecorderState("error");
          setErrorMessage(message);
          onError?.(message);
        } finally {
          cleanupMedia();
        }
      };

      recorder.start();
      setRecorderState("recording");
      startRecordingTimer();
    } catch (error) {
      cleanupMedia();
      clearRecordingTimer();

      const message =
        error instanceof Error
          ? mapMediaError(error)
          : "Microphone access failed.";
      setRecorderState("error");
      setErrorMessage(message);
      onError?.(message);
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
      return;
    }

    setRecorderState("stopping");
    mediaRecorderRef.current.stop();
  }

  function handleMainButtonClick() {
    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  }

  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-medium">Target sentence</p>
          <p className="mt-1 text-base">{targetText}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleMainButtonClick}
            disabled={disabled || isBusy}
            className="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {isRecording ? "Stop recording" : "Start recording"}
          </button>

          <button
            type="button"
            onClick={() => {
              resetFeedback();
              setRecorderState("idle");
            }}
            disabled={isRecording || isBusy}
            className="rounded-xl border px-4 py-2 text-sm disabled:opacity-50"
          >
            Clear
          </button>

          <span className="text-sm opacity-70">
            {isRecording
              ? `Recording... ${recordingSeconds}s`
              : formatRecorderState(recorderState)}
          </span>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {result ? (
          <div className="rounded-xl border p-3">
            <p className="text-sm font-medium">Feedback</p>
            <p className="mt-1 text-sm">{result.message}</p>

            <div className="mt-3 grid gap-2 text-sm">
              <div>
                <span className="font-medium">Transcript:</span>{" "}
                {result.transcript || "—"}
              </div>
              <div>
                <span className="font-medium">Score:</span> {result.matchScore}
              </div>
              <div>
                <span className="font-medium">Intent:</span> {result.intent}
              </div>
              <div>
                <span className="font-medium">Missing words:</span>{" "}
                {result.missingWords.length > 0
                  ? result.missingWords.join(", ")
                  : "None"}
              </div>
              <div>
                <span className="font-medium">Extra words:</span>{" "}
                {result.extraWords.length > 0
                  ? result.extraWords.join(", ")
                  : "None"}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getSupportedMimeType(): string | undefined {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];

  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return undefined;
}

function formatRecorderState(state: RecorderState): string {
  switch (state) {
    case "idle":
      return "Ready";
    case "requesting-permission":
      return "Requesting microphone access...";
    case "recording":
      return "Recording...";
    case "stopping":
      return "Stopping...";
    case "uploading":
      return "Analyzing speech...";
    case "success":
      return "Done";
    case "error":
      return "Something went wrong";
    default:
      return "Ready";
  }
}

function mapMediaError(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes("permission") || message.includes("denied")) {
    return "Microphone permission was denied. Please allow microphone access and try again.";
  }

  if (message.includes("notfound") || message.includes("device")) {
    return "No microphone was found on this device.";
  }

  return "Could not start recording. Please try again.";
}