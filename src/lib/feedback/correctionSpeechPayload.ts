export interface SplitCorrectionForSpeechInput {
  mode: 'audio' | 'text';
  correctionText: string;
  explanation?: string | null;
  maxSpokenChars?: number;
}

export interface CorrectionSpeechPayload {
  spokenText: string;
  textDetail: string | null;
  reason: 'audio_compact_cue' | 'full_spoken_correction';
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function splitCorrectionForSpeech(
  input: SplitCorrectionForSpeechInput,
): CorrectionSpeechPayload {
  const correctionText = cleanText(input.correctionText);
  const explanation = cleanText(input.explanation ?? '');
  const detail = cleanText([correctionText, explanation].filter(Boolean).join(' '));
  const maxSpokenChars = Math.max(24, input.maxSpokenChars ?? 120);

  if (input.mode !== 'audio' || detail.length <= maxSpokenChars) {
    return {
      spokenText: detail,
      textDetail: null,
      reason: 'full_spoken_correction',
    };
  }

  const cueBase = correctionText.length > 0
    ? `Try: ${correctionText}`
    : 'I marked the correction in text.';
  const spokenText = cueBase.length <= maxSpokenChars
    ? cueBase
    : `${cueBase.slice(0, Math.max(0, maxSpokenChars - 1)).trimEnd()}.`;

  return {
    spokenText,
    textDetail: detail,
    reason: 'audio_compact_cue',
  };
}
