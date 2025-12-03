import { useState, useRef, useCallback } from 'react';

export type RecorderStatus = 'idle' | 'recording' | 'processing' | 'error';

export interface UsePronunciationRecorderReturn {
  status: RecorderStatus;
  error?: string;
  audioBlob?: Blob;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
}

const PERMISSION_ERROR = {
  en: "I need microphone permission to listen to you.",
  vi: "Mình cần quyền dùng micro để nghe bạn nhé."
};

export function usePronunciationRecorder(): UsePronunciationRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | undefined>();
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError(undefined);
    setAudioBlob(undefined);
    chunksRef.current = [];

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder with supported format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setStatus('idle');
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = () => {
        setError('Recording failed. Please try again.');
        setStatus('error');
      };

      mediaRecorder.start();
      setStatus('recording');
    } catch (err) {
      console.error('Microphone error:', err);
      
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError(`${PERMISSION_ERROR.en}\n${PERMISSION_ERROR.vi}`);
      } else {
        setError('Could not access microphone. Please check your settings.');
      }
      setStatus('error');
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setStatus('processing');
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus('idle');
    setError(undefined);
    setAudioBlob(undefined);
    chunksRef.current = [];
  }, []);

  return {
    status,
    error,
    audioBlob,
    startRecording,
    stopRecording,
    reset,
  };
}
