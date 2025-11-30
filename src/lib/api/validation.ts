import { z } from "zod";

/**
 * Edge function input validation schemas
 * Use these in all edge functions to ensure type safety and prevent injection attacks
 */

export const RoomIdSchema = z.object({
  roomId: z.string().trim().min(1).max(200),
});

export const ChatMessageSchema = z.object({
  roomId: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(4000),
});

export const TierIdSchema = z.object({
  tierId: z.string().trim().min(1).max(50),
});

export const AccessCodeSchema = z.object({
  code: z.string().trim().min(4).max(50).regex(/^[A-Z0-9-]+$/i, "Invalid code format"),
});

export const UserIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

/**
 * Safe body parser with automatic error handling
 * Throws INVALID_INPUT error if validation fails
 * 
 * @example
 * const data = safeParseBody(ChatMessageSchema, await req.json());
 */
export function safeParseBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    console.warn("[api] invalid body", result.error.flatten());
    throw new Error("INVALID_INPUT");
  }
  return result.data;
}

/**
 * Safe query parameter parser
 * Returns null if validation fails instead of throwing
 */
export function safeParseQuery<T>(schema: z.ZodSchema<T>, params: unknown): T | null {
  const result = schema.safeParse(params);
  if (!result.success) {
    console.warn("[api] invalid query params", result.error.flatten());
    return null;
  }
  return result.data;
}
