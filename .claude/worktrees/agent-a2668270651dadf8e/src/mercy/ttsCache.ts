// Path: src/mercy/ttsCache.ts

export type MercyReply = {
  content?: string;
  contentEn?: string;
  contentVi?: string;
  bilingualContent?: string;
  audioUrl?: string;
};

const audioCache = new Map<string, string>();
const contentCache = new Map<string, string>();
const bilingualContentCache = new Map<string, string>();

function makeKey(input: {
  roomId?: string;
  content?: string;
  contentEn?: string;
  contentVi?: string;
}) {
  return JSON.stringify({
    roomId: input.roomId ?? '',
    content: input.content ?? '',
    contentEn: input.contentEn ?? '',
    contentVi: input.contentVi ?? '',
  });
}

export function hasMercyAudio(key: string): boolean {
  return audioCache.has(key);
}

export function getMercyContent(key: string): string | undefined {
  return contentCache.get(key);
}

export function getMercyBilingualContent(key: string): string | undefined {
  return bilingualContentCache.get(key);
}

export async function ensureMercyAudio(input: {
  key?: string;
  roomId?: string;
  reply?: MercyReply | null;
  content?: string;
  contentEn?: string;
  contentVi?: string;
  audioUrl?: string;
}): Promise<string | undefined> {
  const resolvedKey =
    input.key ??
    makeKey({
      roomId: input.roomId,
      content: input.content ?? input.reply?.content,
      contentEn: input.contentEn ?? input.reply?.contentEn,
      contentVi: input.contentVi ?? input.reply?.contentVi,
    });

  const resolvedAudioUrl = input.audioUrl ?? input.reply?.audioUrl;
  const resolvedContent = input.content ?? input.reply?.content;
  const resolvedBilingual =
    input.reply?.bilingualContent ??
    [input.contentEn ?? input.reply?.contentEn, input.contentVi ?? input.reply?.contentVi]
      .filter(Boolean)
      .join('\n\n');

  if (resolvedContent) {
    contentCache.set(resolvedKey, resolvedContent);
  }

  if (resolvedBilingual) {
    bilingualContentCache.set(resolvedKey, resolvedBilingual);
  }

  if (resolvedAudioUrl) {
    audioCache.set(resolvedKey, resolvedAudioUrl);
    return resolvedAudioUrl;
  }

  return audioCache.get(resolvedKey);
}