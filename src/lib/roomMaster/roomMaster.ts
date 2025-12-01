// RoomMaster - The canonical room validation + auto-repair engine

import type { RoomJson, RoomMasterOutput, RoomMasterError, RoomMasterWarning, ValidationMode } from './roomMasterTypes';
import { RULES, validateRoomId, validateSlug, validateTier, validateAudioFilename, validateTags, countWords } from './roomMasterRules';
import { autoFixRoom } from './roomMasterAutoFix';
import { detectCrisisSignals } from './crisisDetector';
import { scoreWritingQuality } from './writingQualityScorer';

export function validateRoom(
  room: RoomJson,
  mode: ValidationMode = { mode: 'strict', allowMissingFields: false, allowEmptyEntries: false, requireAudio: true, requireBilingualCopy: true, minEntries: 2, maxEntries: 8 }
): RoomMasterOutput {
  const errors: RoomMasterError[] = [];
  const warnings: RoomMasterWarning[] = [];

  // Run auto-fix first
  const autoFixResult = autoFixRoom(room);
  const cleanedRoom = autoFixResult.repairedRoom;
  const autofixed = autoFixResult.fixed;

  // Validate room ID
  if (!validateRoomId(cleanedRoom.id)) {
    errors.push({
      field: 'id',
      rule: 'ROOM_ID_FORMAT',
      severity: 'error',
      message: RULES.ID.MESSAGE,
      actual: cleanedRoom.id,
      expected: RULES.ID.EXAMPLE,
      autoFixable: false,
    });
  }

  // Validate tier
  if (!validateTier(cleanedRoom.tier)) {
    errors.push({
      field: 'tier',
      rule: 'TIER_INVALID',
      severity: 'error',
      message: 'Tier must be one of the canonical tier values',
      actual: cleanedRoom.tier,
      expected: RULES.TIER.VALID_TIERS.join(', '),
      autoFixable: true,
    });
  }

  // Validate entry count
  const entryCount = cleanedRoom.entries?.length || 0;
  if (entryCount < mode.minEntries || entryCount > mode.maxEntries) {
    errors.push({
      field: 'entries',
      rule: 'ENTRY_COUNT',
      severity: 'error',
      message: RULES.ENTRIES.MESSAGE,
      actual: entryCount,
      expected: `${mode.minEntries}-${mode.maxEntries} entries`,
      autoFixable: false,
    });
  }

  // Validate bilingual title
  if (mode.requireBilingualCopy) {
    if (!cleanedRoom.title?.en || !cleanedRoom.title?.vi) {
      errors.push({
        field: 'title',
        rule: 'BILINGUAL_REQUIRED',
        severity: 'error',
        message: RULES.BILINGUAL.MESSAGE,
        autoFixable: true,
      });
    }
  }

  // Validate intro length
  if (cleanedRoom.content) {
    const enWordCount = countWords(cleanedRoom.content.en || '');
    const viWordCount = countWords(cleanedRoom.content.vi || '');

    if (enWordCount < RULES.INTRO.MIN_WORDS || enWordCount > RULES.INTRO.MAX_WORDS) {
      warnings.push({
        field: 'content.en',
        rule: 'INTRO_LENGTH',
        message: RULES.INTRO.MESSAGE,
        suggestion: `Current: ${enWordCount} words. ${enWordCount < RULES.INTRO.MIN_WORDS ? 'Expand' : 'Compress'} to ${RULES.INTRO.MIN_WORDS}-${RULES.INTRO.MAX_WORDS} words.`,
      });
    }

    if (viWordCount < RULES.INTRO.MIN_WORDS || viWordCount > RULES.INTRO.MAX_WORDS) {
      warnings.push({
        field: 'content.vi',
        rule: 'INTRO_LENGTH',
        message: RULES.INTRO.MESSAGE,
        suggestion: `Current: ${viWordCount} words. ${viWordCount < RULES.INTRO.MIN_WORDS ? 'Expand' : 'Compress'} to ${RULES.INTRO.MIN_WORDS}-${RULES.INTRO.MAX_WORDS} words.`,
      });
    }
  }

  // Validate each entry
  cleanedRoom.entries?.forEach((entry, index) => {
    // Slug validation
    if (!validateSlug(entry.slug)) {
      errors.push({
        field: `entries[${index}].slug`,
        rule: 'SLUG_FORMAT',
        severity: 'error',
        message: RULES.SLUG.MESSAGE,
        actual: entry.slug,
        expected: RULES.SLUG.EXAMPLE,
        autoFixable: true,
      });
    }

    // Keywords validation
    if (!entry.keywords_en || entry.keywords_en.length < RULES.KEYWORDS.MIN_COUNT || entry.keywords_en.length > RULES.KEYWORDS.MAX_COUNT) {
      warnings.push({
        field: `entries[${index}].keywords_en`,
        rule: 'KEYWORDS_COUNT',
        message: RULES.KEYWORDS.MESSAGE,
        suggestion: `Current: ${entry.keywords_en?.length || 0} keywords. Adjust to ${RULES.KEYWORDS.MIN_COUNT}-${RULES.KEYWORDS.MAX_COUNT}.`,
      });
    }

    if (!entry.keywords_vi || entry.keywords_vi.length < RULES.KEYWORDS.MIN_COUNT || entry.keywords_vi.length > RULES.KEYWORDS.MAX_COUNT) {
      warnings.push({
        field: `entries[${index}].keywords_vi`,
        rule: 'KEYWORDS_COUNT',
        message: RULES.KEYWORDS.MESSAGE,
        suggestion: `Current: ${entry.keywords_vi?.length || 0} keywords. Adjust to ${RULES.KEYWORDS.MIN_COUNT}-${RULES.KEYWORDS.MAX_COUNT}.`,
      });
    }

    // Copy length validation
    const enWordCount = countWords(entry.copy?.en || '');
    const viWordCount = countWords(entry.copy?.vi || '');

    if (enWordCount < RULES.COPY.MIN_WORDS || enWordCount > RULES.COPY.MAX_WORDS) {
      warnings.push({
        field: `entries[${index}].copy.en`,
        rule: 'COPY_LENGTH',
        message: RULES.COPY.MESSAGE,
        suggestion: `Current: ${enWordCount} words. ${enWordCount < RULES.COPY.MIN_WORDS ? 'Expand' : 'Compress'} to ${RULES.COPY.MIN_WORDS}-${RULES.COPY.MAX_WORDS} words.`,
      });
    }

    if (viWordCount < RULES.COPY.MIN_WORDS || viWordCount > RULES.COPY.MAX_WORDS) {
      warnings.push({
        field: `entries[${index}].copy.vi`,
        rule: 'COPY_LENGTH',
        message: RULES.COPY.MESSAGE,
        suggestion: `Current: ${viWordCount} words. ${viWordCount < RULES.COPY.MIN_WORDS ? 'Expand' : 'Compress'} to ${RULES.COPY.MIN_WORDS}-${RULES.COPY.MAX_WORDS} words.`,
      });
    }

    // Audio validation
    if (mode.requireAudio && !entry.audio) {
      errors.push({
        field: `entries[${index}].audio`,
        rule: 'AUDIO_REQUIRED',
        severity: 'error',
        message: 'Audio file is required for this entry',
        autoFixable: false,
      });
    } else if (entry.audio && !validateAudioFilename(entry.audio)) {
      warnings.push({
        field: `entries[${index}].audio`,
        rule: 'AUDIO_FORMAT',
        message: RULES.AUDIO.MESSAGE,
        suggestion: `Expected format: ${RULES.AUDIO.EXAMPLE}`,
      });
    }

    // Tags validation
    if (!entry.tags || entry.tags.length < RULES.TAGS.MIN_COUNT || entry.tags.length > RULES.TAGS.MAX_COUNT) {
      warnings.push({
        field: `entries[${index}].tags`,
        rule: 'TAGS_COUNT',
        message: RULES.TAGS.MESSAGE,
        suggestion: `Current: ${entry.tags?.length || 0} tags. Adjust to ${RULES.TAGS.MIN_COUNT}-${RULES.TAGS.MAX_COUNT}.`,
      });
    } else if (!validateTags(entry.tags)) {
      warnings.push({
        field: `entries[${index}].tags`,
        rule: 'TAGS_INVALID',
        message: 'One or more tags are not in the allowed list',
        suggestion: `Allowed tags: ${RULES.TAGS.ALLOWED.join(', ')}`,
      });
    }

    // Bilingual copy validation
    if (mode.requireBilingualCopy) {
      if (!entry.copy?.en || !entry.copy?.vi) {
        errors.push({
          field: `entries[${index}].copy`,
          rule: 'BILINGUAL_REQUIRED',
          severity: 'error',
          message: RULES.BILINGUAL.MESSAGE,
          autoFixable: false,
        });
      }
    }
  });

  // Detect crisis signals
  const crisisFlags = detectCrisisSignals(cleanedRoom);

  // Score writing quality
  const qualityScore = scoreWritingQuality(cleanedRoom);

  return {
    cleanedRoom,
    errors,
    warnings,
    autofixed,
    crisisFlags,
    qualityScore,
    validationMode: mode.mode,
  };
}