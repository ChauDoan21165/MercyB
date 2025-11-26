import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Room ID validation - alphanumeric with hyphens
export const roomIdSchema = z.string()
  .trim()
  .min(3, "Room ID too short")
  .max(100, "Room ID too long")
  .regex(/^[a-z0-9-_]+$/, "Invalid room ID format");

// Access code validation - uppercase alphanumeric, 8-20 chars
export const accessCodeSchema = z.string()
  .trim()
  .min(8, "Code too short")
  .max(20, "Code too long")
  .regex(/^[A-Z0-9]+$/, "Invalid code format")
  .transform((val) => val.toUpperCase());

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
  roomId: roomIdSchema.optional(),
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
  imageUrl: z.string().url("Invalid image URL"),
  tierId: z.string().uuid("Invalid tier ID"),
  username: z.string()
    .trim()
    .min(1, "Username required")
    .max(100, "Username too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username contains invalid characters"),
  expectedAmount: z.number()
    .positive("Amount must be positive")
    .optional(),
});

// Access code redemption validation
export const accessCodeRedemptionSchema = z.object({
  code: accessCodeSchema,
});

// Match generation validation (no body needed, just auth check)
export const matchGenerationSchema = z.object({});

// Input sanitization helper
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .slice(0, 10000); // Hard limit
}

// Helper to validate and return typed data
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.errors.map(e => e.message).join(", ")}`);
  }
  return result.data;
}
