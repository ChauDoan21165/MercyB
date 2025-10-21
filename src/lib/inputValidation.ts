import { z } from 'zod';

export const messageSchema = z.object({
  text: z.string()
    .trim()
    .min(1, { message: 'Message cannot be empty' })
    .max(2000, { message: 'Message too long (max 2000 characters)' })
    .refine(
      (val) => {
        // Check for suspicious patterns but allow normal punctuation
        const suspiciousPatterns = /<script|javascript:|onerror=|onclick=/i;
        return !suspiciousPatterns.test(val);
      },
      { message: 'Invalid content detected' }
    )
});

export type MessageInput = z.infer<typeof messageSchema>;
