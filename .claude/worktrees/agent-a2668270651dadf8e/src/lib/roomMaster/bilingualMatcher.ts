// Bilingual Matcher - Check EN-VI alignment quality

import type { RoomJson, RoomMasterWarning } from './roomMasterTypes';

export function checkBilingualAlignment(room: RoomJson): RoomMasterWarning[] {
  const warnings: RoomMasterWarning[] = [];

  // Check title alignment
  if (room.title?.en && room.title?.vi) {
    const alignment = assessAlignment(room.title.en, room.title.vi);
    if (alignment.score < 0.5) {
      warnings.push({
        field: 'title',
        rule: 'BILINGUAL_ALIGNMENT',
        message: `Title EN-VI alignment is weak (${(alignment.score * 100).toFixed(0)}%)`,
        suggestion: alignment.suggestion,
      });
    }
  }

  // Check content alignment
  if (room.content?.en && room.content?.vi) {
    const alignment = assessAlignment(room.content.en, room.content.vi);
    if (alignment.score < 0.5) {
      warnings.push({
        field: 'content',
        rule: 'BILINGUAL_ALIGNMENT',
        message: `Content EN-VI alignment is weak (${(alignment.score * 100).toFixed(0)}%)`,
        suggestion: alignment.suggestion,
      });
    }
  }

  // Check entry copy alignment
  room.entries?.forEach((entry, index) => {
    if (entry.copy?.en && entry.copy?.vi) {
      const alignment = assessAlignment(entry.copy.en, entry.copy.vi);
      if (alignment.score < 0.5) {
        warnings.push({
          field: `entries[${index}].copy`,
          rule: 'BILINGUAL_ALIGNMENT',
          message: `Entry ${index + 1} EN-VI alignment is weak (${(alignment.score * 100).toFixed(0)}%)`,
          suggestion: alignment.suggestion,
        });
      }
    }
  });

  return warnings;
}

interface AlignmentResult {
  score: number; // 0-1
  suggestion: string;
}

function assessAlignment(en: string, vi: string): AlignmentResult {
  // Simple heuristic: compare word counts
  const enWords = en.split(/\s+/).length;
  const viWords = vi.split(/\s+/).length;

  const ratio = Math.min(enWords, viWords) / Math.max(enWords, viWords);

  // Check for common translation red flags
  const redFlags = detectRedFlags(en, vi);

  let score = ratio * 0.7 + (1 - redFlags.length * 0.1);
  score = Math.max(0, Math.min(1, score));

  let suggestion = '';
  if (ratio < 0.6) {
    suggestion = 'Word count mismatch suggests incomplete translation. Review for missing content.';
  } else if (redFlags.length > 0) {
    suggestion = `Potential issues: ${redFlags.join(', ')}`;
  } else {
    suggestion = 'Alignment looks good.';
  }

  return { score, suggestion };
}

function detectRedFlags(en: string, vi: string): string[] {
  const flags: string[] = [];

  // Check for untranslated English words in Vietnamese
  const enWords = en.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const viText = vi.toLowerCase();
  
  const untranslated = enWords.filter(word => viText.includes(word));
  if (untranslated.length > 3) {
    flags.push('Multiple untranslated English words in Vietnamese');
  }

  // Check for missing punctuation match
  const enPunctCount = (en.match(/[.!?]/g) || []).length;
  const viPunctCount = (vi.match(/[.!?]/g) || []).length;
  
  if (Math.abs(enPunctCount - viPunctCount) > 2) {
    flags.push('Punctuation count mismatch');
  }

  return flags;
}