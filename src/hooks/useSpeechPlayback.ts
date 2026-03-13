import { useCallback, useEffect, useRef, useState } from 'react';

interface PlayTextOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

interface CompareOptions {
  text: string;
  audioUrl: string;
  lang?: string;
  rate?: number;
  delayMs?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function useSpeechPlayback() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const compareAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis.cancel();

    if (compareAudioRef.current) {
      compareAudioRef.current.pause();
      compareAudioRef.current.currentTime = 0;
      compareAudioRef.current = null;
    }

    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback(
    (text: string, options: PlayTextOptions = {}) => {
      if (!text?.trim()) return;

      cancelSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        options.onStart?.();
      };

      utterance.onend = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        options.onEnd?.();
      };

      utterance.onerror = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        options.onError?.();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [cancelSpeech]
  );

  const playNormal = useCallback(
    (text: string, callbacks?: Omit<PlayTextOptions, 'rate'>) => {
      speakText(text, { ...callbacks, rate: 0.9 });
    },
    [speakText]
  );

  const playSlow = useCallback(
    (text: string, callbacks?: Omit<PlayTextOptions, 'rate'>) => {
      speakText(text, { ...callbacks, rate: 0.65 });
    },
    [speakText]
  );

  const playCompare = useCallback(
    async ({
      text,
      audioUrl,
      lang = 'en-US',
      rate = 0.85,
      delayMs = 500,
      onStart,
      onEnd,
      onError,
    }: CompareOptions) => {
      if (!text?.trim() || !audioUrl) return;

      cancelSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      utterance.onstart = () => {
        setIsSpeaking(true);
        onStart?.();
      };

      utterance.onend = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          const audio = new Audio(audioUrl);
          compareAudioRef.current = audio;

          audio.onended = () => {
            compareAudioRef.current = null;
            setIsSpeaking(false);
            onEnd?.();
          };

          audio.onerror = () => {
            compareAudioRef.current = null;
            setIsSpeaking(false);
            onError?.();
          };

          await audio.play();
        } catch {
          compareAudioRef.current = null;
          setIsSpeaking(false);
          onError?.();
        }
      };

      utterance.onerror = () => {
        utteranceRef.current = null;
        setIsSpeaking(false);
        onError?.();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [cancelSpeech]
  );

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, [cancelSpeech]);

  return {
    isSpeaking,
    speakText,
    playNormal,
    playSlow,
    playCompare,
    cancelSpeech,
  };
}