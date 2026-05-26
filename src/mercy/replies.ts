// PATH: src/mercy/replies.ts

/**
 * API-only teacher mode (compatibility stub)
 * Keeps all legacy exports so other modules compile,
 * but returns inert / empty data.
 */

export type MercyReplyId = string;
export type MercyReplyCategory = string;

export type MercyReply = {
  id?: MercyReplyId;
  category?: MercyReplyCategory;
  text_en?: string;
  text_vi?: string;
};

export type MercyReplyLibrary = MercyReply[];

export const EMPTY_MERCY_REPLY_LIBRARY: MercyReplyLibrary = [];

export async function loadMercyReplyLibrary(): Promise<MercyReplyLibrary> {
  return EMPTY_MERCY_REPLY_LIBRARY;
}

export async function preloadMercyLibrary(): Promise<void> {
  return;
}

export function isMercyLibraryLoaded(): boolean {
  return true;
}

export function getMercyReply(_id?: MercyReplyId): MercyReply | null {
  return null;
}

export function getMercyReplySync(_id?: MercyReplyId): MercyReply | null {
  return null;
}

export function getMercyRepliesByCategory(
  _category?: MercyReplyCategory
): MercyReplyLibrary {
  return EMPTY_MERCY_REPLY_LIBRARY;
}

export function getMercyAudioPath(_id?: MercyReplyId): string | null {
  return null;
}

export async function getMercyReplies(): Promise<MercyReplyLibrary> {
  return EMPTY_MERCY_REPLY_LIBRARY;
}

export function getMercyRepliesSync(): MercyReplyLibrary {
  return EMPTY_MERCY_REPLY_LIBRARY;
}

export function findMercyReply(): MercyReply | null {
  return null;
}

export default EMPTY_MERCY_REPLY_LIBRARY;
