import { useCallback, useEffect, useRef, useState } from "react";

type PermissionState = "unknown" | "granted" | "denied";

export function usePlacementAudioCapture() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [isRecording, setIsRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    stopTimer();
    setIsRecording(false);
  }, [stopTimer]);

  const start = useCallback(async () => {
    setError(null);
    setBlob(null);
    setElapsedSeconds(0);
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        setPermission("denied");
        setError("Microphone recording is not available in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission("granted");
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const nextBlob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setBlob(nextBlob);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((value) => value + 1);
      }, 1000);
    } catch (err) {
      setPermission("denied");
      setError(err instanceof Error ? err.message : "Microphone permission was denied.");
      setIsRecording(false);
      stopTimer();
    }
  }, [stopTimer]);

  const retake = useCallback(() => {
    if (isRecording) stop();
    chunksRef.current = [];
    setBlob(null);
    setElapsedSeconds(0);
    setError(null);
  }, [isRecording, stop]);

  useEffect(() => {
    return () => {
      stopTimer();
      recorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [stopTimer]);

  return {
    permission,
    isRecording,
    blob,
    elapsedSeconds,
    error,
    start,
    stop,
    retake,
  };
}

export default usePlacementAudioCapture;
