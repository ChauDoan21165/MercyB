/**
 * Category-based room intro scripts (English only)
 * Maps room topic tags to gentle intro lines
 */

export const ROOM_INTRO_EN: Record<string, string> = {
  calm: 'This room is here to help your mind move one step closer to calm. You do not have to silence your thoughts. Just let them speak more softly.',
  
  'self-worth': 'This room is for the part of you that doubts your own value. Here, we will practice talking to yourself like someone who truly matters.',
  
  heartbreak: 'This room is a soft place for your broken or tired heart. You are allowed to miss, to ache, and to slowly heal.',
  
  anxiety: 'This room is here for your restless mind. Together, we will try to give your worries a safer place to land.',
  
  courage: 'This room is for the you that wants to move but feels scared. Courage here is not loud. It is one small step that still counts.',
  
  'learning-english': 'This room is for practicing English in a gentle way. You will learn new words, but more importantly, new ways to speak to yourself.',
  
  sleep: 'This room is here to help you find rest. Let these words be a soft bridge between your busy mind and peaceful sleep.',
  
  motivation: 'This room is for when you feel stuck. Sometimes all you need is one gentle push to remember you can move again.',
  
  gratitude: 'This room is here to help you notice the small good things. Gratitude does not have to be loud to be real.',
  
  forgiveness: 'This room is for letting go of what weighs on you. Forgiveness is not forgetting. It is choosing your own peace.',
  
  confidence: 'This room is here to remind you of your own strength. Confidence grows from small steps taken one at a time.',
  
  relationships: 'This room is about connection. How we love others and how we let ourselves be loved.',
  
  focus: 'This room is here to help your scattered mind gather itself. Focus is not force. It is gentle attention.',
  
  creativity: 'This room is for the creative spirit in you. Here, there are no wrong ideas, only seeds waiting to grow.',
};

/**
 * Get room intro by tag, returns undefined if no match
 */
export function getRoomIntroByTag(tag: string): string | undefined {
  const normalizedTag = tag.toLowerCase().trim();
  return ROOM_INTRO_EN[normalizedTag];
}

/**
 * Get first matching intro from an array of tags
 */
export function getRoomIntroFromTags(tags: string[]): string | undefined {
  for (const tag of tags) {
    const intro = getRoomIntroByTag(tag);
    if (intro) return intro;
  }
  return undefined;
}
