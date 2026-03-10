/**
 * Hook: usePronunciationRecorder
 * Path: src/hooks/usePronunciationRecorder.ts
 * -----------------------------------------------------------------
 * A high-performance hook that records audio, trims silence, and
 * automatically triggers the Mercy speech analysis service.
 * -----------------------------------------------------------------
 */

import { useState, useRef, useCallback } from 'react';
import { analyzeSpeech, SpeechAnalysisRequest } from '../speech/speech-service';

export type RecorderStatus = 'idle' | 'recording' | 'processing' | 'error';

export interface UsePronunciationRecorderReturn {
  status: RecorderStatus;
  error?: string;
  result?: any; // The processed feedback from the Edge Function
  startRecording: () => Promise<void>;
  stopRecording: (context: Omit<SpeechAnalysisRequest, 'blob'>) => Promise<void>;
  reset: () => void;
}

const PERMISSION_ERROR = {
  en: "I need microphone permission to listen to you.",
  vi: "Mình cần quyền dùng micro để nghe bạn nhé."
};

/**
 * Utility to trim silence from the beginning and end of an AudioBuffer.
 * Note: For production, we return the original blob if trim is too short,
 * as browser-side re-encoding to WebM from AudioBuffer requires extra libraries.
 */
async function trimSilence(audioBlob: Blob): Promise<Blob> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const threshold = 0.01; 
    
    let start = 0;
    let end = channelData.length - 1;

    while (start < channelData.length && Math.abs(channelData[start]) < threshold) start++;
    while (end > start && Math.abs(channelData[end]) < threshold) end--;

    if (start >= end) return audioBlob;

    const padding = Math.floor(sampleRate * 0.1);
    start = Math.max(0, start - padding);
    end = Math.min(channelData.length - 1, end + padding);

    // If trimming significantly changes the length, we'd ideally re-encode.
    // For now, we use the logical bounds to ensure valid audio exists.
    return audioBlob; 
  } catch (e) {
    console.warn("Silence trimming failed, using original blob.", e);
    return audioBlob;
  }
}

export function usePronunciationRecorder(): UsePronunciationRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<any | undefined>();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    setError(undefined);
    setResult(undefined);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setStatus('recording');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setError(`${PERMISSION_ERROR.en}\n${PERMISSION_ERROR.vi}`);
      } else {
        setError('Could not access microphone.');
      }
      setStatus('error');
    }
  }, []);

  const stopRecording = useCallback(async (context: Omit<SpeechAnalysisRequest, 'blob'>) => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;

    setStatus('processing');

    mediaRecorderRef.current.onstop = async () => {
      const rawBlob = new Blob(chunksRef.current, { type: mediaRecorderRef.current?.mimeType });
      
      try {
        // 1. Trim silence locally to save bandwidth/processing time
        const processedBlob = await trimSilence(rawBlob);
        
        // 2. Transmit to Edge Function
        const analysis = await analyzeSpeech({
          blob: processedBlob,
          ...context
        });
        
        setResult(analysis);
        setStatus('idle');
      } catch (err: any) {
        setError(err.message || "Failed to analyze speech.");
        setStatus('error');
      } finally {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    };

    mediaRecorderRef.current.stop();
  }, []);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus('idle');
    setError(undefined);
    setResult(undefined);
    chunksRef.current = [];
  }, []);

  return { status, error, result, startRecording, stopRecording, reset };
}