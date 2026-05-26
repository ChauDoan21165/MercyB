/**
 * AI Safety Layer
 * Content filtering, tone checking, crisis detection
 */

export interface SafetyCheckResult {
  passed: boolean;
  blocked?: boolean;
  reason?: string;
  suggestion?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

/**
 * Crisis keywords that trigger immediate intervention
 */
const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "want to die",
  "self-harm",
  "cut myself",
  "hurt myself",
  "abuse me",
  "being abused",
];

/**
 * Harmful instruction patterns
 */
const HARMFUL_PATTERNS = [
  "how to harm",
  "how to hurt",
  "illegal activities",
  "manipulate someone",
  "steal",
  "hack",
  "violence",
  "weapon",
];

/**
 * Medical advice patterns that need disclaimers
 */
const MEDICAL_PATTERNS = [
  "diagnose",
  "prescription",
  "medication",
  "treatment plan",
  "medical condition",
  "disease",
];

/**
 * Check input for crisis content
 */
export function checkCrisisContent(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();

  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        passed: false,
        blocked: true,
        reason: "Crisis content detected",
        severity: "critical",
        suggestion: "I hear you're going through something very difficult. Please reach out immediately to a crisis hotline or mental health professional. They can provide the support you need right now. In Vietnam: 1800-1612. International: 988 (Suicide & Crisis Lifeline).",
      };
    }
  }

  return { passed: true };
}

/**
 * Check for harmful instructions
 */
export function checkHarmfulContent(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();

  for (const pattern of HARMFUL_PATTERNS) {
    if (lowerText.includes(pattern)) {
      return {
        passed: false,
        blocked: true,
        reason: "Harmful instruction detected",
        severity: "high",
        suggestion: "I can't provide guidance on that topic as it could cause harm. I'm here to support your wellbeing and growth in positive, constructive ways.",
      };
    }
  }

  return { passed: true };
}

/**
 * Check if medical disclaimer needed
 */
export function checkMedicalContent(text: string): SafetyCheckResult {
  const lowerText = text.toLowerCase();

  for (const pattern of MEDICAL_PATTERNS) {
    if (lowerText.includes(pattern)) {
      return {
        passed: true, // Allow but flag
        reason: "Medical content detected - disclaimer needed",
        severity: "medium",
        suggestion: "\n\n⚠️ **Important**: This is educational information only, not medical advice. Please consult qualified healthcare professionals for diagnosis, treatment, or medical decisions.",
      };
    }
  }

  return { passed: true };
}

/**
 * Comprehensive safety check on user input
 */
export function checkInputSafety(input: string): SafetyCheckResult {
  // Check crisis content first (highest priority)
  const crisisCheck = checkCrisisContent(input);
  if (!crisisCheck.passed) return crisisCheck;

  // Check harmful instructions
  const harmfulCheck = checkHarmfulContent(input);
  if (!harmfulCheck.passed) return harmfulCheck;

  return { passed: true };
}

/**
 * Comprehensive safety check on AI output
 */
export function checkOutputSafety(output: string): SafetyCheckResult {
  // Check if output accidentally contains crisis instructions
  const crisisCheck = checkCrisisContent(output);
  if (!crisisCheck.passed) return crisisCheck;

  // Check harmful content
  const harmfulCheck = checkHarmfulContent(output);
  if (!harmfulCheck.passed) return harmfulCheck;

  // Check if medical disclaimer needed
  const medicalCheck = checkMedicalContent(output);
  if (medicalCheck.suggestion) {
    return medicalCheck; // Flag for disclaimer addition
  }

  return { passed: true };
}

/**
 * Validate tone appropriateness
 */
export function checkTone(output: string, expectedTone: "warm" | "professional" | "kids" = "warm"): SafetyCheckResult {
  const lowerOutput = output.toLowerCase();

  // Check for judgmental language
  const judgmentalPatterns = [
    "you should have",
    "you're wrong",
    "that's stupid",
    "you failed",
    "bad choice",
  ];

  for (const pattern of judgmentalPatterns) {
    if (lowerOutput.includes(pattern)) {
      return {
        passed: false,
        reason: "Judgmental tone detected",
        severity: "medium",
      };
    }
  }

  // Check kids mode requirements
  if (expectedTone === "kids") {
    const wordCount = output.split(/\s+/).length;
    const sentenceCount = output.split(/[.!?]+/).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    if (avgWordsPerSentence > 10) {
      return {
        passed: false,
        reason: "Sentences too long for kids mode (max 10 words per sentence)",
        severity: "low",
      };
    }

    // Check for emoji presence
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(output);
    if (!hasEmoji) {
      return {
        passed: true,
        reason: "Kids mode should include encouraging emojis",
        severity: "low",
        suggestion: "Add emojis like 🌟 ✨ 💪 to make it more engaging",
      };
    }
  }

  return { passed: true };
}

/**
 * Apply safety response override
 */
export function getSafetyResponse(check: SafetyCheckResult): string {
  if (check.suggestion) {
    return check.suggestion;
  }

  // Fallback safety responses
  switch (check.severity) {
    case "critical":
      return "I'm here to support you, but I think you need immediate help from a trained professional. Please reach out to a crisis hotline or emergency services. Your wellbeing matters.";
    case "high":
      return "I can't help with that request as it could cause harm. I'm here to support your growth and wellbeing in positive ways. Is there something constructive I can help you with?";
    case "medium":
      return "I want to help, but I need to redirect this conversation. Let's focus on something that supports your wellbeing and growth.";
    default:
      return "Let's keep our conversation positive and constructive. How can I support you in a helpful way?";
  }
}
