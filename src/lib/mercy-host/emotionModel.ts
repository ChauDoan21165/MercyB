/**
 * Mercy Emotion Model - Phase 5
 * 
 * Emotion-aware engine that adapts Mercy's responses based on user behavior.
 */

export type EmotionState = 
  | 'neutral' 
  | 'focused' 
  | 'confused' 
  | 'low_mood' 
  | 'stressed' 
  | 'celebrating' 
  | 'returning_after_gap';

export type EmotionInput = 
  | 'room_enter'
  | 'entry_complete'
  | 'long_scroll'
  | 'rapid_clicks'
  | 'idle_too_long'
  | 'error_seen'
  | 'milestone_complete'
  | 'return_after_7_days'
  | 'tier_unlock'
  | 'vip_upgrade'
  | 'color_toggle'
  | 'audio_complete'
  | 'favorite_add';

interface EmotionContext {
  roomTags?: string[];
  tier?: string;
  hoursSinceLastVisit?: number | null;
  recentErrors?: number;
  recentMilestones?: number;
}

interface EmotionEvent {
  input: EmotionInput;
  timestamp: number;
}

// Emotion transition weights
const EMOTION_WEIGHTS: Record<EmotionInput, Partial<Record<EmotionState, number>>> = {
  room_enter: { neutral: 0.3, focused: 0.2 },
  entry_complete: { focused: 0.4, celebrating: 0.2 },
  long_scroll: { focused: 0.3, confused: 0.2 },
  rapid_clicks: { stressed: 0.5, confused: 0.3 },
  idle_too_long: { low_mood: 0.3, confused: 0.2 },
  error_seen: { confused: 0.4, stressed: 0.3 },
  milestone_complete: { celebrating: 0.7 },
  return_after_7_days: { returning_after_gap: 0.8 },
  tier_unlock: { celebrating: 0.6 },
  vip_upgrade: { celebrating: 0.8 },
  color_toggle: { neutral: 0.1 },
  audio_complete: { focused: 0.2, neutral: 0.1 },
  favorite_add: { focused: 0.2 }
};

// Emotion decay rates (how fast emotions return to neutral)
const EMOTION_DECAY: Record<EmotionState, number> = {
  neutral: 0,
  focused: 0.1,
  confused: 0.15,
  low_mood: 0.08,
  stressed: 0.12,
  celebrating: 0.2,
  returning_after_gap: 0.3
};

const ROLLING_WINDOW_SIZE = 10;
const MIN_TRANSITION_INTERVAL_MS = 10000; // 10 seconds between emotion changes

/**
 * Emotion Engine class that tracks and infers user emotional state
 */
export class EmotionEngine {
  private eventHistory: EmotionEvent[] = [];
  private currentEmotion: EmotionState = 'neutral';
  private lastTransitionTime: number = 0;
  private emotionScores: Record<EmotionState, number> = {
    neutral: 1,
    focused: 0,
    confused: 0,
    low_mood: 0,
    stressed: 0,
    celebrating: 0,
    returning_after_gap: 0
  };

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Record an event and update emotion state
   */
  recordEvent(input: EmotionInput, context: EmotionContext = {}): EmotionState {
    const now = Date.now();
    
    // Add to history
    this.eventHistory.push({ input, timestamp: now });
    
    // Trim to rolling window
    if (this.eventHistory.length > ROLLING_WINDOW_SIZE) {
      this.eventHistory = this.eventHistory.slice(-ROLLING_WINDOW_SIZE);
    }

    // Apply decay to all emotions
    this.applyDecay();

    // Get weights for this input
    const weights = EMOTION_WEIGHTS[input] || {};
    
    // Apply weights to scores
    for (const [emotion, weight] of Object.entries(weights)) {
      this.emotionScores[emotion as EmotionState] += weight;
    }

    // Check for context-based overrides
    if (context.hoursSinceLastVisit && context.hoursSinceLastVisit > 168) { // 7 days
      this.emotionScores.returning_after_gap = 1;
    }

    // Check for rapid negative events
    const recentErrorEvents = this.eventHistory
      .filter(e => e.input === 'error_seen' && now - e.timestamp < 60000)
      .length;
    if (recentErrorEvents >= 3) {
      this.emotionScores.stressed += 0.3;
    }

    // Infer new emotion
    const newEmotion = this.inferEmotion();

    // Apply cool-down: can't jump more than one step per interval
    if (now - this.lastTransitionTime >= MIN_TRANSITION_INTERVAL_MS) {
      if (newEmotion !== this.currentEmotion) {
        this.currentEmotion = newEmotion;
        this.lastTransitionTime = now;
        this.saveToStorage();
      }
    }

    return this.currentEmotion;
  }

  /**
   * Infer emotion from current scores
   */
  private inferEmotion(): EmotionState {
    let maxScore = 0;
    let maxEmotion: EmotionState = 'neutral';

    for (const [emotion, score] of Object.entries(this.emotionScores)) {
      if (score > maxScore) {
        maxScore = score;
        maxEmotion = emotion as EmotionState;
      }
    }

    return maxEmotion;
  }

  /**
   * Apply decay to emotion scores
   */
  private applyDecay(): void {
    for (const emotion of Object.keys(this.emotionScores) as EmotionState[]) {
      const decay = EMOTION_DECAY[emotion];
      this.emotionScores[emotion] = Math.max(0, this.emotionScores[emotion] - decay);
    }
    // Neutral always has a baseline
    this.emotionScores.neutral = Math.max(0.5, this.emotionScores.neutral);
  }

  /**
   * Get current emotion state
   */
  getEmotion(): EmotionState {
    return this.currentEmotion;
  }

  /**
   * Get emotion scores for debugging
   */
  getScores(): Record<EmotionState, number> {
    return { ...this.emotionScores };
  }

  /**
   * Get recent event history
   */
  getHistory(): EmotionEvent[] {
    return [...this.eventHistory];
  }

  /**
   * Force set emotion (for onboarding seed)
   */
  setEmotion(emotion: EmotionState): void {
    this.currentEmotion = emotion;
    this.emotionScores[emotion] = 1;
    this.lastTransitionTime = Date.now();
    this.saveToStorage();
  }

  /**
   * Reset emotion to neutral
   */
  reset(): void {
    this.currentEmotion = 'neutral';
    this.emotionScores = {
      neutral: 1,
      focused: 0,
      confused: 0,
      low_mood: 0,
      stressed: 0,
      celebrating: 0,
      returning_after_gap: 0
    };
    this.eventHistory = [];
    this.lastTransitionTime = 0;
    this.saveToStorage();
  }

  /**
   * Persist to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('mercy_emotion_state', JSON.stringify({
        emotion: this.currentEmotion,
        scores: this.emotionScores,
        lastTransition: this.lastTransitionTime
      }));
    } catch {
      // ignore storage errors
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('mercy_emotion_state');
      if (stored) {
        const data = JSON.parse(stored);
        this.currentEmotion = data.emotion || 'neutral';
        this.emotionScores = { ...this.emotionScores, ...data.scores };
        this.lastTransitionTime = data.lastTransition || 0;
      }
    } catch {
      // ignore parse errors
    }
  }
}

// Singleton instance
export const emotionEngine = new EmotionEngine();

/**
 * Infer emotion from a single event with context
 */
export function inferEmotion(input: EmotionInput, context: EmotionContext = {}): EmotionState {
  return emotionEngine.recordEvent(input, context);
}

/**
 * Get current emotion
 */
export function getCurrentEmotion(): EmotionState {
  return emotionEngine.getEmotion();
}

/**
 * Map onboarding answer to initial emotion seed
 */
export function getEmotionFromOnboardingAnswer(answer: string): EmotionState {
  const answerLower = answer.toLowerCase();
  
  if (answerLower.includes('lost') || answerLower.includes('confused') || answerLower.includes('mất')) {
    return 'confused';
  }
  if (answerLower.includes('tired') || answerLower.includes('sad') || answerLower.includes('mệt')) {
    return 'low_mood';
  }
  if (answerLower.includes('stressed') || answerLower.includes('anxious') || answerLower.includes('lo')) {
    return 'stressed';
  }
  if (answerLower.includes('excited') || answerLower.includes('happy') || answerLower.includes('vui')) {
    return 'celebrating';
  }
  if (answerLower.includes('focused') || answerLower.includes('ready') || answerLower.includes('sẵn')) {
    return 'focused';
  }
  
  return 'neutral';
}
