/**
 * Content Filtering & Toxic Message Detection
 * Prevents abusive, hateful, or spammy messages
 */

import { logger } from '@/lib/logger';

// Toxic patterns (mild filtering - can be expanded)
const TOXIC_PATTERNS = [
  /fuck|shit|damn|hell|ass(?!ume|ist|ess)/gi,
  /stupid|idiot|moron|dumb/gi,
  /hate|kill|die|death/gi,
  /racist|sexist|homophobic/gi,
];

// Spam patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/gi, // Repeated characters
  /[A-Z]{15,}/g, // Excessive caps
  /https?:\/\/[^\s]+/gi, // URLs (can be allowed in some contexts)
];

export interface ContentFilterResult {
  allowed: boolean;
  reason?: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Check if message contains toxic content
 */
export function filterToxicContent(message: string): ContentFilterResult {
  // Check toxic patterns
  for (const pattern of TOXIC_PATTERNS) {
    if (pattern.test(message)) {
      logger.warn('Toxic content detected', { pattern: pattern.source });
      return {
        allowed: false,
        reason: 'Message contains inappropriate language',
        suggestion: 'Please rephrase your message in a respectful way',
        severity: 'high',
      };
    }
  }
  
  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(message)) {
      logger.warn('Spam pattern detected', { pattern: pattern.source });
      return {
        allowed: false,
        reason: 'Message appears to be spam',
        suggestion: 'Please write a normal message',
        severity: 'medium',
      };
    }
  }
  
  return {
    allowed: true,
    severity: 'low',
  };
}

/**
 * Check message length
 */
export function checkMessageLength(message: string, maxLength = 10000): ContentFilterResult {
  if (message.length > maxLength) {
    logger.warn('Message too long', { length: message.length, maxLength });
    return {
      allowed: false,
      reason: `Message is too long (${message.length} chars, max ${maxLength})`,
      suggestion: 'Please shorten your message',
      severity: 'low',
    };
  }
  
  return {
    allowed: true,
    severity: 'low',
  };
}

/**
 * Detect duplicate messages
 */
const recentMessages = new Map<string, { message: string; timestamp: number }[]>();

export function checkDuplicateMessage(userId: string, message: string): ContentFilterResult {
  const now = Date.now();
  const userMessages = recentMessages.get(userId) || [];
  
  // Clean up old messages (older than 5 seconds)
  const recent = userMessages.filter(m => now - m.timestamp < 5000);
  
  // Check for exact duplicates
  const isDuplicate = recent.some(m => m.message === message);
  
  if (isDuplicate) {
    logger.warn('Duplicate message detected', { userId });
    return {
      allowed: false,
      reason: 'You just sent this message',
      suggestion: 'Please wait a few seconds before sending again',
      severity: 'low',
    };
  }
  
  // Add current message
  recent.push({ message, timestamp: now });
  recentMessages.set(userId, recent);
  
  return {
    allowed: true,
    severity: 'low',
  };
}

/**
 * Comprehensive content validation
 */
export function validateMessageContent(
  userId: string,
  message: string
): ContentFilterResult {
  // Check length
  const lengthCheck = checkMessageLength(message);
  if (!lengthCheck.allowed) return lengthCheck;
  
  // Check toxic content
  const toxicCheck = filterToxicContent(message);
  if (!toxicCheck.allowed) return toxicCheck;
  
  // Check duplicates
  const dupeCheck = checkDuplicateMessage(userId, message);
  if (!dupeCheck.allowed) return dupeCheck;
  
  return {
    allowed: true,
    severity: 'low',
  };
}

/**
 * Clean up old message history
 */
export function cleanupMessageHistory(): void {
  const now = Date.now();
  const maxAge = 60000; // 1 minute
  
  for (const [userId, messages] of recentMessages.entries()) {
    const recent = messages.filter(m => now - m.timestamp < maxAge);
    if (recent.length === 0) {
      recentMessages.delete(userId);
    } else {
      recentMessages.set(userId, recent);
    }
  }
}

// Clean up every minute
setInterval(cleanupMessageHistory, 60000);
