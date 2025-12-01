import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Text-to-speech validation
export const ttsRequestSchema = z.object({
  text: z.string().trim().min(1).max(5000, "Text too long"),
  voice: z.enum(["alloy", "echo", "fable", "onyx", "nova", "shimmer"]),
  roomSlug: z.string().trim().min(1).max(100).optional(),
  entrySlug: z.string().trim().min(1).max(100).optional(),
});

// AI chat validation
export const aiChatSchema = z.object({
  message: z.string().trim().min(1).max(2000, "Message too long"),
  roomId: z.string().trim().min(1).max(100).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })).max(50).optional(),
});

// Payment validation
export const paymentActionSchema = z.object({
  action: z.enum(["get-client-id", "create-order", "capture-order"]),
  tierId: z.string().uuid().optional(),
  orderId: z.string().optional(),
});

// Payment verification validation
export const paymentVerificationSchema = z.object({
  screenshot: z.instanceof(File).or(z.string().url()),
  tierId: z.string().uuid(),
  username: z.string().trim().min(1).max(100),
  paymentMethod: z.enum(["paypal_manual", "bank_transfer"]),
});

// Match generation validation (no body needed, just auth check)
export const matchGenerationSchema = z.object({});

// Room request validation
export const roomRequestSchema = z.object({
  roomId: z.string().trim().min(1).max(100),
});

// Admin set tier validation
export const setTierSchema = z.object({
  user_id: z.string().uuid(),
  tier_name: z.string().trim().min(1).max(50),
  days: z.number().int().positive().max(365),
});

// Profile update validation
export const profileUpdateSchema = z.object({
  full_name: z.string().trim().max(100).optional(),
  username: z.string().trim().min(3).max(50).optional(),
  avatar_url: z.string().url().optional(),
  phone: z.string().trim().max(20).optional(),
});

// Feedback submission validation
export const feedbackSchema = z.object({
  message: z.string().trim().min(10).max(2000),
  category: z.enum(["bug", "feature", "general"]).optional(),
});

// Helper to validate and return typed data
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.errors.map(e => e.message).join(", ")}`);
  }
  return result.data;
}

// Sanitize error messages for production
export function sanitizeError(error: any): string {
  if (Deno.env.get('ENVIRONMENT') === 'production') {
    // Remove stack traces and SQL details
    return 'An error occurred. Please try again later.';
  }
  
  // In development, return full error
  return error?.message || String(error);
}