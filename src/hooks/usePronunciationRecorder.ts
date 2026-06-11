import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'recording' | 'processing';

export interface PronunciationRecorderState {
  status: RecorderStatus;
  error: string | null;
  audioBlob: Blob | null;
  lastRecordedAudioUrl: string | null;
  isPlayingReference: boolean;
  isPlayingRecorded: boolean;
  isComparing: boolean;
  setError: (value: string | null) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  reset: () => void;
  clearRecordedAudio: () => void;
  /** Resolves true only if the model sentence actually played (spoke), false
   *  if speech playback was unavailable or failed. Callers (compare-by-ear)
   *  use this to avoid pretending a comparison ran when the model was silent. */
  playReference: (text: string, rate?: number) => Promise<boolean>;
  playRecorded: () => Promise<void>;
  compareWithReference: (
    text: string,
    rate?: number,
    gapMs?: number
  ) => Promise<void>;
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

  for (const type of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    } catch {
      // ignore
    }
  }

  return undefined;
}

function getFriendlyMicError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
      return 'Microphone access was denied in your browser. Please allow mic access for this site and try again.';
    }

    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      return 'No microphone was found for this browser session. Please connect or enable a mic and try again.';
    }

    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      return 'Your microphone is busy or unavailable to the browser right now. Close other apps using the mic and try again.';
    }

    if (err.name === 'AbortError') {
      return 'Recording was interrupted before it could start. Please try again.';
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return 'Could not start recording. Please try again.';
}

function getSpeechSynthesisSafe(): SpeechSynthesis | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return window.speechSynthesis;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    window.setTimeout(resolve, ms);
  });
}

export function usePronunciationRecorder(): PronunciationRecorderState {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setErrorState] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [lastRecordedAudioUrl, setLastRecordedAudioUrl] = useState<string | null>(
    null
  );
  const [isPlayingReference, setIsPlayingReference] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopPromiseResolverRef = useRef<(() => void) | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const setError = useCallback((value: string | null) => {
    setErrorState(value);
  }, []);

  const cleanupStream = useCallback(() => {
    if (!streamRef.current) return;

    for (const track of streamRef.current.getTracks()) {
      try {
        track.stop();
      } catch {
        // ignore
      }
    }

    streamRef.current = null;
  }, []);

  const cleanupRecorder = useCallback(() => {
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, []);

  const stopPlayback = useCallback(() => {
    const synth = getSpeechSynthesisSafe();
    try {
      synth?.cancel();
    } catch {
      // ignore
    }

    const currentAudio = currentAudioRef.current;
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
    }

    currentAudioRef.current = null;
    setIsPlayingReference(false);
    setIsPlayingRecorded(false);
    setIsComparing(false);
  }, []);

  const clearRecordedAudio = useCallback(() => {
    setLastRecordedAudioUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, []);

  const reset = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }

    stopPlayback();
    cleanupRecorder();
    cleanupStream();
    stopPromiseResolverRef.current = null;
    setAudioBlob(null);
    setErrorState(null);
    setStatus('idle');
  }, [cleanupRecorder, cleanupStream, stopPlayback]);

  // Revoke the blob URL when it changes — but do NOT call stopPlayback() here.
  // Calling stopPlayback() on every URL change aborts any in-flight play()
  // Promise with AbortError and leaves the Promise unresolved if the audio was
  // already playing (onended never fires on a paused element). Both paths set
  // the "Recorded playback failed" error message or silently hang the UI.
  useEffect(() => {
    const urlToRevoke = lastRecordedAudioUrl;
    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [lastRecordedAudioUrl]);

  // Stream and playback cleanup — runs only on component unmount.
  // cleanupStream and stopPlayback are stable (useCallback with [] deps) so
  // this effect fires exactly once (setup) and its cleanup runs exactly once
  // (unmount), matching the semantics of a "componentWillUnmount" guard.
  useEffect(() => {
    return () => {
      cleanupStream();
      stopPlayback();
    };
  }, [cleanupStream, stopPlayback]);

  const playReference = useCallback(
    async (text: string, rate = 0.85): Promise<boolean> => {
      const phrase = String(text || '').trim();
      if (!phrase) {
        setErrorState('There is no reference phrase to play.');
        return false;
      }

      const synth = getSpeechSynthesisSafe();
      if (!synth) {
        setErrorState('Speech playback is not supported in this browser.');
        return false;
      }

      stopPlayback();
      setErrorState(null);

      return await new Promise<boolean>((resolve) => {
        let finished = false;
        // `spoke` stays false unless the utterance actually started/ended
        // without error. A silent failure (no voices, engine paused, the
        // 8s watchdog with no audio) resolves false so callers don't pretend.
        let spoke = false;
        let errored = false;

        const finish = () => {
          if (finished) return;
          finished = true;
          setIsPlayingReference(false);
          resolve(spoke);
        };

        try {
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.lang = 'en-US';
          utterance.rate = rate;

          utterance.onstart = () => {
            spoke = true;
            setIsPlayingReference(true);
          };

          utterance.onend = () => {
            if (!errored) spoke = true;
            finish();
          };

          utterance.onerror = () => {
            console.warn('Speech synthesis failed');
            errored = true;
            spoke = false;
            setErrorState(
              'Reference playback is unavailable on this device right now.'
            );
            finish();
          };

          synth.cancel();
          synth.speak(utterance);

          if (typeof window !== 'undefined') {
            window.setTimeout(() => {
              finish();
            }, 8000);
          } else {
            finish();
          }
        } catch (err) {
          console.warn('Speech synthesis crash', err);
          errored = true;
          spoke = false;
          setErrorState(
            'Reference playback is unavailable on this device right now.'
          );
          finish();
        }
      });
    },
    [stopPlayback]
  );

  const playRecorded = useCallback(async () => {
    if (!lastRecordedAudioUrl) {
      setErrorState('No recorded audio is available yet.');
      return;
    }

    stopPlayback();
    setErrorState(null);

    await new Promise<void>((resolve) => {
      try {
        const audio = new Audio(lastRecordedAudioUrl);
        currentAudioRef.current = audio;

        audio.onplay = () => setIsPlayingRecorded(true);
        audio.onended = () => {
          currentAudioRef.current = null;
          setIsPlayingRecorded(false);
          resolve();
        };
        audio.onerror = () => {
          console.error(
            '[usePronunciationRecorder] playback media error',
            'code:', audio.error?.code,
            'msg:', audio.error?.message,
          );
          currentAudioRef.current = null;
          setIsPlayingRecorded(false);
          setErrorState('Recorded playback failed. Please record again.');
          resolve();
        };

        void audio.play().catch((err: unknown) => {
          console.error('[usePronunciationRecorder] play() rejected', err);
          currentAudioRef.current = null;
          setIsPlayingRecorded(false);
          setErrorState('Recorded playback failed. Please record again.');
          resolve();
        });
      } catch {
        setIsPlayingRecorded(false);
        setErrorState('Recorded playback failed. Please record again.');
        resolve();
      }
    });
  }, [lastRecordedAudioUrl, stopPlayback]);

  const compareWithReference = useCallback(
    async (text: string, rate = 0.85, gapMs = 500) => {
      const phrase = String(text || '').trim();
      if (!phrase) {
        setErrorState('There is no reference phrase to compare.');
        return;
      }

      if (!lastRecordedAudioUrl) {
        setErrorState('Please record your voice first before comparing.');
        return;
      }

      setErrorState(null);
      setIsComparing(true);

      try {
        const spokeModel = await playReference(phrase, rate);
        if (!spokeModel) {
          // The model sentence did not actually play. Do NOT fall through to
          // playing only the learner's recording — that would pretend a
          // comparison happened. Surface a clear message instead.
          setErrorState(
            'Không phát được câu mẫu trên thiết bị này, nên chưa so sánh được. ' +
              'Hãy bấm “Mercy đọc” để nghe mẫu, rồi “Nghe bản thu của bạn”. / ' +
              'Could not play the model sentence on this device, so the comparison did not run.'
          );
          return;
        }
        await delay(gapMs);
        await playRecorded();
      } finally {
        setIsComparing(false);
      }
    },
    [lastRecordedAudioUrl, playReference, playRecorded]
  );

  const startRecording = useCallback(async () => {
    if (typeof window === 'undefined') {
      setStatus('idle');
      setErrorState('Recording is only available in the browser.');
      return;
    }

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setStatus('idle');
      setErrorState(
        'Recording is not supported in this browser. Please try Chrome, Edge, or Safari.'
      );
      return;
    }

    if (status === 'recording' || status === 'processing') {
      return;
    }

    stopPlayback();
    cleanupStream();
    cleanupRecorder();
    stopPromiseResolverRef.current = null;
    setAudioBlob(null);
    setErrorState(null);
    chunksRef.current = [];

    try {
      let permissionState: PermissionStatus | null = null;

      if (navigator.permissions?.query) {
        try {
          permissionState = await navigator.permissions.query({
            name: 'microphone' as PermissionName,
          });
        } catch {
          permissionState = null;
        }
      }

      if (permissionState?.state === 'denied') {
        setStatus('idle');
        setErrorState(
          'Microphone access is blocked in your browser. Please allow mic access for this site and try again.'
        );
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

      recorder.onerror = () => {
        setErrorState(
          'Recording failed while using the microphone. Please try again.'
        );
        setStatus('idle');
        cleanupStream();
      };

      recorder.onstop = () => {
        const finalMimeType = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: finalMimeType });

        clearRecordedAudio();
        setAudioBlob(blob.size > 0 ? blob : null);
        setStatus('idle');
        cleanupStream();

        if (blob.size > 0) {
          const nextUrl = URL.createObjectURL(blob);
          setLastRecordedAudioUrl(nextUrl);
        } else {
          setErrorState(
            'No audio was captured. Please try again and speak after pressing Record.'
          );
        }

        const resolve = stopPromiseResolverRef.current;
        stopPromiseResolverRef.current = null;
        if (resolve) resolve();
      };

      recorder.start();
      setStatus('recording');
    } catch (err) {
      cleanupStream();
      cleanupRecorder();
      stopPromiseResolverRef.current = null;
      setStatus('idle');
      setErrorState(getFriendlyMicError(err));
    }
  }, [cleanupRecorder, cleanupStream, clearRecordedAudio, status, stopPlayback]);

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
      } catch {
        stopPromiseResolverRef.current = null;
        setErrorState('Could not finish recording. Please try again.');
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
    lastRecordedAudioUrl,
    isPlayingReference,
    isPlayingRecorded,
    isComparing,
    setError,
    startRecording,
    stopRecording,
    reset,
    clearRecordedAudio,
    playReference,
    playRecorded,
    compareWithReference,
  };
}