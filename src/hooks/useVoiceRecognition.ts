import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US',
    onResult,
    onEnd
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = continuous;
    recognitionRef.current.interimResults = interimResults;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcriptPart;
        } else {
          interimText += transcriptPart;
        }
      }

      if (finalText) {
        setTranscript(prev => prev + finalText);
        onResult?.(finalText);
      }
      setInterimTranscript(interimText);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error(`Voice recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      onEnd?.();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, interimResults, language, onResult, onEnd]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Voice recognition started');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  };
};
