// FILE: roomRegistry.ts
// PATH: src/lib/roomRegistry.ts
// VERSION: v1.1

/**
 * Compatibility shim.
 *
 * Some legacy code and tests import:
 *   "@/lib/roomRegistry"
 *
 * The real implementation lives at:
 *   "@/lib/rooms/roomRegistry"
 *
 * This file re-exports everything so all import paths
 * resolve to the same single source of truth.
 *
 * IMPORTANT:
 * - Keeps backward compatibility
 * - Prevents duplicate registry instances
 * - Does NOT create a new implementation
 */

export * from "@/lib/rooms/roomRegistry";