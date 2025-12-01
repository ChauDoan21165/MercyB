// Crisis Detector - Scan content for crisis signals and flag them

import type { RoomJson, CrisisFlag } from './roomMasterTypes';
import { RULES } from './roomMasterRules';

export function detectCrisisSignals(room: RoomJson): CrisisFlag[] {
  const flags: CrisisFlag[] = [];

  // Scan room intro
  if (room.content?.en) {
    flags.push(...scanTextForCrisis(room.content.en, 'content.en'));
  }
  if (room.content?.vi) {
    flags.push(...scanTextForCrisis(room.content.vi, 'content.vi'));
  }

  // Scan entries
  room.entries?.forEach((entry, index) => {
    if (entry.copy?.en) {
      flags.push(...scanTextForCrisis(entry.copy.en, `entries[${index}].copy.en`));
    }
    if (entry.copy?.vi) {
      flags.push(...scanTextForCrisis(entry.copy.vi, `entries[${index}].copy.vi`));
    }
  });

  return flags;
}

function scanTextForCrisis(text: string, field: string): CrisisFlag[] {
  const flags: CrisisFlag[] = [];
  const lowerText = text.toLowerCase();

  // Check high severity keywords
  const highTriggers = RULES.CRISIS_KEYWORDS.HIGH_SEVERITY.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  if (highTriggers.length > 0) {
    flags.push({
      field,
      triggerWords: highTriggers,
      severity: 5,
      urgency: 'immediate',
      suggestedAction: 'call_emergency',
    });
  }

  // Check medium severity keywords
  const mediumTriggers = RULES.CRISIS_KEYWORDS.MEDIUM_SEVERITY.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  if (mediumTriggers.length > 0) {
    flags.push({
      field,
      triggerWords: mediumTriggers,
      severity: 4,
      urgency: 'high',
      suggestedAction: 'professional_help_recommended',
    });
  }

  // Check low severity keywords
  const lowTriggers = RULES.CRISIS_KEYWORDS.LOW_SEVERITY.filter(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  if (lowTriggers.length > 0) {
    flags.push({
      field,
      triggerWords: lowTriggers,
      severity: 3,
      urgency: 'medium',
      suggestedAction: 'consider_professional_support',
    });
  }

  return flags;
}