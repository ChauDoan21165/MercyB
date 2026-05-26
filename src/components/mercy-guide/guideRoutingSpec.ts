export type GuideRoute =
  | 'prewritten'
  | 'api_tutor'
  | 'speak_route'
  | 'fallback';

export type GuideSkillIntent =
  | 'grammar'
  | 'reading'
  | 'reading_comprehension'
  | 'writing'
  | 'pronunciation'
  | 'speaking';

export type GuideTaskIntent =
  | 'explain_grammar_in_text'
  | 'give_simple_patterns'
  | 'summarize_text'
  | 'reading_comprehension_questions'
  | 'check_writing'
  | 'rewrite_simpler'
  | 'extract_vocabulary';

export type GuideClassification = {
  language: 'vi' | 'en';
  route: GuideRoute;
  skillIntent?: GuideSkillIntent;
  taskIntent?: GuideTaskIntent;
  hasPayload: boolean;
  payload?: string;
};

export const GUIDE_ROUTING_RULES = {
  summary: [
    'Use prewritten answers for stable guidance requests.',
    'Use api_tutor for content-specific tutoring tasks on provided text.',
    'Use speak_route only for pronunciation or speaking practice.',
    'Never answer a content-specific tutoring request with only a generic study plan.',
  ],
};

export const GUIDE_ROUTE_MATRIX = [
  { kind: 'greeting', payload: false, route: 'prewritten' as const },
  { kind: 'app_intro', payload: false, route: 'prewritten' as const },
  { kind: 'app_usage', payload: false, route: 'prewritten' as const },
  { kind: 'study_plan', payload: false, route: 'prewritten' as const },
  { kind: 'room_usage', payload: false, route: 'prewritten' as const },
  { kind: 'skill_guidance', payload: false, route: 'prewritten' as const },
  { kind: 'pronunciation_only', payload: false, route: 'speak_route' as const },
  { kind: 'task_on_text', payload: true, route: 'api_tutor' as const },
  { kind: 'unknown', payload: false, route: 'fallback' as const },
];