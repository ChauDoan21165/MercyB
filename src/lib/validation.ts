import { z } from "zod";

// Security: Sanitize input by removing potentially harmful characters
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove inline event handlers
    .substring(0, 5000); // Hard limit to prevent DoS
};

// Security: Validate and sanitize text with configurable max length
export const createTextSchema = (maxLength: number, fieldName: string) => {
  return z
    .string()
    .trim()
    .min(1, { message: `${fieldName} cannot be empty` })
    .max(maxLength, { message: `${fieldName} must be less than ${maxLength} characters` })
    .transform(sanitizeInput);
};

// VIP Request Form Schema
export const vipRequestSchema = z.object({
  topic_name: createTextSchema(200, "Topic name"),
  topic_name_vi: z.string().trim().max(200, { message: "Vietnamese topic name must be less than 200 characters" }).transform(sanitizeInput).optional().or(z.literal("")),
  description: createTextSchema(2000, "Description"),
  urgency: z.enum(["low", "medium", "high"]),
});

// VIP Topic Request Schema
export const vipTopicRequestSchema = z.object({
  tier: z.enum(["vip1", "vip2", "vip3"], { message: "Please select a valid VIP tier" }),
  topicTitle: createTextSchema(200, "Topic title"),
  topicDescription: createTextSchema(3000, "Topic description"),
  specificGoals: z.string().trim().max(1000).transform(sanitizeInput).optional().or(z.literal("")),
  targetAudience: z.string().trim().max(200).transform(sanitizeInput).optional().or(z.literal("")),
  urgency: z.enum(["low", "medium", "high"]),
  additionalNotes: z.string().trim().max(1000).transform(sanitizeInput).optional().or(z.literal("")),
});

// Promo Code Schema
export const promoCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, { message: "Promo code must be at least 3 characters" })
    .max(50, { message: "Promo code must be less than 50 characters" })
    .regex(/^[A-Z0-9_-]+$/, { message: "Promo code can only contain letters, numbers, hyphens and underscores" })
    .transform((val) => val.toUpperCase()),
});

// Feedback Schema
export const feedbackSchema = z.object({
  message: createTextSchema(2000, "Feedback message"),
  rating: z.number().min(1).max(5).optional(),
});

// Username Schema (already exists in UsernameSetup but centralizing here)
export const usernameSchema = z
  .string()
  .trim()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(30, { message: "Username must be less than 30 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, hyphens and underscores" })
  .transform((val) => {
    // Remove zero-width characters and normalize
    return val
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
  });

export type VIPRequestInput = z.infer<typeof vipRequestSchema>;
export type VIPTopicRequestInput = z.infer<typeof vipTopicRequestSchema>;
export type PromoCodeInput = z.infer<typeof promoCodeSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type UsernameInput = z.infer<typeof usernameSchema>;
