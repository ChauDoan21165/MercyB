import { useCallback, useEffect, useRef, useState } from 'react';

type RecorderStatus = 'idle' | 'recording' | 'processing';

interface PronunciationRecorderState {
  status: RecorderStatus;
  error: string | null;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
}

function getSupportedMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return undefined;
  }

  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

export function usePronunciationRecorder(): PronunciationRecorderState {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopPromiseResolverRef = useRef<(() => void) | null>(null);

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Failed to stop recorder during reset:', err);
      }
    }

    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setAudioBlob(null);
    setError(null);
    setStatus('idle');
    cleanupStream();
  }, [cleanupStream]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  const startRecording = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError(
        'Recording is not supported in this browser. Please try Chrome, Edge, or Safari.'
      );
      setStatus('idle');
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      setError(
        'Recording is not supported in this browser. Please try Chrome, Edge, or Safari.'
      );
      setStatus('idle');
      return;
    }

    if (status === 'recording' || status === 'processing') {
      return;
    }

    setError(null);
    setAudioBlob(null);
    chunksRef.current = [];

    try {
      const permissionState =
        typeof navigator.permissions?.query === 'function'
          ? await navigator.permissions
              .query({ name: 'microphone' as PermissionName })
              .catch(() => null)
          : null;

      if (permissionState?.state === 'denied') {
        setError(
          'Microphone access is blocked in your browser. Please allow mic access for this site and try again.'
        );
        setStatus('idle');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setError(
          'Recording failed while using the microphone. Please try again.'
        );
        setStatus('idle');
        cleanupStream();
      };

      recorder.onstop = () => {
        const finalMimeType = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMimeType });

        setAudioBlob(blob.size > 0 ? blob : null);
        setStatus('idle');
        cleanupStream();

        if (blob.size === 0) {
          setError(
            'No audio was captured. Please try again and speak after pressing Record.'
          );
        }

        stopPromiseResolverRef.current?.();
        stopPromiseResolverRef.current = null;
      };

      recorder.start();
      setStatus('recording');
    } catch (err) {
      console.error('Failed to start microphone recording:', err);
      cleanupStream();
      setStatus('idle');

      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          setError(
            'Microphone access was denied in your browser. Please allow mic access for this site and try again.'
          );
          return;
        }

        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError(
            'No microphone was found for this browser session. Please connect or enable a mic and try again.'
          );
          return;
        }

        if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError(
            'Your microphone is busy or unavailable to the browser right now. Close other apps using the mic and try again.'
          );
          return;
        }
      }

      setError('Could not start recording. Please try again.');
    }
  }, [cleanupStream, status]);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== 'recording') {
      return;
    }

    setStatus('processing');

    await new Promise<void>((resolve) => {
      stopPromiseResolverRef.current = resolve;

      try {
        recorder.stop();
      } catch (err) {
        console.error('Failed to stop microphone recording:', err);
        stopPromiseResolverRef.current = null;
        setError('Could not finish recording. Please try again.');
        setStatus('idle');
        cleanupStream();
        resolve();
      }
    });
  }, [cleanupStream]);

  return {
    status,
    error,
    audioBlob,
    startRecording,
    stopRecording,
    reset,
  };
}