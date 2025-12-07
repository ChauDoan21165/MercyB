/**
 * Keyword responder - refactored to load data at runtime
 * No static imports of large JSON files
 */

// Cache for loaded room data and cross-topic recommendations
let crossTopicCache: any = null;
let roomJsonCache: Record<string, any> = {};

function normalize(text: unknown) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s\-]+/g, "_")
    .trim();
}

function getBilingual(obj: any, base: string): { en: string; vi: string } {
  const val = obj?.[base];
  if (val && typeof val === "object") {
    return { en: String(val.en || ""), vi: String(val.vi || "") };
  }
  return { en: String(obj?.[base] || ""), vi: String(obj?.[`${base}_vi`] || obj?.[`${base}Vi`] || "") };
}

function getBilingualFlexible(entry: any): { en: string; vi: string } {
  const paths: Array<[string[], string[]]> = [
    [["essay","en"],["essay","vi"]],
    [["copy","en"],["copy","vi"]],
    [["content","en"],["content","vi"]],
    [["body","en"],["body","vi"]],
    [["description","en"],["description","vi"]],
  ];

  const singles: Array<[string[], string[]]> = [
    [["essay_en"],["essay_vi"]],
    [["copy_en"],["copy_vi"]],
    [["content_en"],["content_vi"]],
    [["body_en"],["body_vi"]],
    [["vi_en"],["vi_vi"]],
  ];

  const readPath = (root: any, path: string[]) => path.reduce((acc, key) => (acc ? acc[key] : undefined), root);

  for (const [enPath, viPath] of [...paths, ...singles]) {
    const en = String(readPath(entry, enPath) || "").trim();
    const vi = String(readPath(entry, viPath) || "").trim();
    if (en || vi) return { en, vi };
  }

  if (typeof entry?.en === 'string' || typeof entry?.vi === 'string') {
    return { en: String(entry.en || ''), vi: String(entry.vi || '') };
  }
  return { en: '', vi: '' };
}

function findMatchingGroup(message: string, keywords: any): { groupKey: string; matchedKeyword: string } | null {
  if (!keywords || typeof keywords !== "object") return null;
  const msg = normalize(message);
  for (const [groupKey, groupVal] of Object.entries(keywords)) {
    const g: any = groupVal;
    const list: string[] = [
      ...(Array.isArray(g.en) ? g.en : []),
      ...(Array.isArray(g.vi) ? g.vi : []),
      ...(Array.isArray(g.slug_vi) ? g.slug_vi : []),
      groupKey
    ];
    for (const k of list) {
      const normalizedK = normalize(k);
      if (msg.includes(normalizedK) || normalizedK.includes(msg)) return { groupKey, matchedKeyword: normalize(k) };
    }
  }
  return null;
}

function tokenize(s: string): Set<string> {
  return new Set(
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_\s-]/g, " ")
      .replace(/[\s-]+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

function bestTitleTokens(entry: any): Set<string> {
  const titleStr = typeof entry?.title === 'string' ? entry.title : (entry?.title?.en || entry?.title?.vi || '');
  return tokenize(titleStr);
}

function audioTokens(entry: any): Set<string> {
  const audio = entry?.audio || entry?.audio_file || entry?.meta?.audio_file || entry?.audioEn || entry?.audio_en;
  let audioStr = '';
  if (typeof audio === 'string') audioStr = audio;
  else if (audio && typeof audio === 'object') audioStr = audio.en || audio.vi || '';
  audioStr = audioStr.replace(/^\//, '').replace(/\.[a-z0-9]+$/i, '').replace(/[_.-]+/g, ' ');
  return tokenize(audioStr);
}

function findEntryByKeyword(matchedKeyword: string | null, groupKey: string | null, entries: any[], keywordsSource: any): any | null {
  if (!Array.isArray(entries)) return null;

  const mkTokens = tokenize(String(matchedKeyword || ''));
  const group = groupKey ? (keywordsSource?.[groupKey] || {}) : {};
  const groupKeywords: string[] = [
    ...(Array.isArray(group.en) ? group.en : []),
    ...(Array.isArray(group.vi) ? group.vi : [])
  ];
  const groupTokenSets = groupKeywords.map(k => tokenize(k));

  let best: { entry: any; score: number } | null = null;

  for (const entry of entries) {
    const tTokens = bestTitleTokens(entry);
    const aTokens = audioTokens(entry);

    let score = 0;
    score = Math.max(score, jaccard(tTokens, mkTokens));
    for (const g of groupTokenSets) score = Math.max(score, jaccard(tTokens, g));
    score = Math.max(score, jaccard(aTokens, mkTokens) * 0.9);
    for (const g of groupTokenSets) score = Math.max(score, jaccard(aTokens, g) * 0.9);

    const titleStr = [...tTokens].join(' ');
    const mkStr = [...mkTokens].join(' ');
    if (mkStr && titleStr.includes(mkStr)) score += 0.2;

    if (!best || score > best.score) best = { entry, score };
  }

  if (best && best.score >= 0.2) return best.entry;
  return null;
}

async function loadCrossTopicData(): Promise<any> {
  if (crossTopicCache) return crossTopicCache;
  try {
    const response = await fetch('/data/system/cross_topic_recommendations.json');
    if (response.ok) {
      crossTopicCache = await response.json();
    }
  } catch (e) {
    console.warn('Failed to load cross-topic data:', e);
  }
  return crossTopicCache || { recommendations: [] };
}

async function loadRoomJson(roomId: string): Promise<any> {
  if (roomJsonCache[roomId]) return roomJsonCache[roomId];
  try {
    const response = await fetch(`/data/${roomId}.json`);
    if (response.ok) {
      const data = await response.json();
      roomJsonCache[roomId] = data;
      return data;
    }
  } catch (e) {
    console.warn(`Failed to load room ${roomId}:`, e);
  }
  return null;
}

async function findRelatedRooms(message: string, currentRoomId: string): Promise<string[]> {
  const msg = normalize(message);
  const relatedRooms = new Set<string>();
  
  const crossTopicData = await loadCrossTopicData();
  if (crossTopicData?.recommendations) {
    crossTopicData.recommendations.forEach((rec: any) => {
      const keyword = normalize(rec.keyword);
      if (msg.includes(keyword)) {
        rec.rooms?.forEach((room: any) => {
          if (room.roomId !== currentRoomId && room.relevance === 'primary') {
            relatedRooms.add(`${room.roomNameEn} (${room.roomNameVi})`);
          }
        });
      }
    });
  }
  
  return Array.from(relatedRooms).slice(0, 3);
}

export async function keywordRespondAsync(
  roomId: string, 
  message: string, 
  noKeywordCount: number = 0, 
  matchedEntryCount: number = 0
): Promise<{ text: string; matched: boolean; relatedRooms?: string[]; audioFile?: string; entryId?: string }> {
  const roomData = await loadRoomJson(roomId);
  if (!roomData) throw new Error("Room data not found");

  const matchResult = findMatchingGroup(message, roomData.keywords || roomData.keywords_dict);
  const groupKey = matchResult?.groupKey || null;
  const matchedKeyword = matchResult?.matchedKeyword || null;
  
  let matchedEntry = null;
  let audioFile: string | undefined;
  let entryId: string | undefined;
  
  if (roomData.entries && typeof roomData.entries === 'object' && !Array.isArray(roomData.entries)) {
    if (groupKey && roomData.entries[groupKey]) {
      matchedEntry = roomData.entries[groupKey];
    }
    
    if (matchedEntry) {
      entryId = matchedEntry.id;
      const audio = matchedEntry.audio;
      if (typeof audio === 'string') {
        let path = audio.replace(/^\/+/, '').replace(/^public\//, '').replace(/^audio\//, '');
        audioFile = `/audio/${path}`;
      } else if (audio && typeof audio === 'object') {
        const audioPath = audio.en || audio.vi;
        if (audioPath) {
          let path = audioPath.replace(/^\/+/, '').replace(/^public\//, '').replace(/^audio\//, '');
          audioFile = `/audio/${path}`;
        }
      }
    }
  } else {
    const keywordsSource: any = roomData.keywords || roomData.keywords_dict || {};
    matchedEntry = findEntryByKeyword(matchedKeyword, groupKey, roomData.entries || [], keywordsSource);

    if (matchedEntry) {
      const audio = matchedEntry.audio || matchedEntry.audio_file || matchedEntry.meta?.audio_file || matchedEntry.audioEn || matchedEntry.audio_en;
      if (typeof audio === 'string') {
        let path = audio.replace(/^\/+/, '').replace(/^public\//, '').replace(/^audio\//, '');
        audioFile = `/audio/${path}`;
      } else if (audio && typeof audio === 'object') {
        const audioPath = audio.en || audio.vi;
        if (audioPath) {
          let path = audioPath.replace(/^\/+/, '').replace(/^public\//, '').replace(/^audio\//, '');
          audioFile = `/audio/${path}`;
        }
      }
      entryId = matchedEntry.id || matchedEntry.artifact_id || matchedEntry.title;
    }
  }
  
  const relatedRooms = await findRelatedRooms(message, roomId);

  const buildEntryResponse = (entry: any) => {
    let { en: copyEn, vi: copyVi } = getBilingualFlexible(entry);

    if (!copyEn) {
      copyEn = String(entry?.copy_en || entry?.content_en || entry?.body_en || "");
    }
    if (!copyVi) {
      copyVi = String(entry?.copy_vi || entry?.content_vi || entry?.body_vi || "");
    }

    copyEn = String(copyEn || "").replace(/\*Word count: \d+\*\s*/g, '').trim();
    copyVi = String(copyVi || "").replace(/\*Số từ: \d+\*\s*/g, '').trim();

    if (copyEn && copyVi) return `${copyEn}\n\n---\n\n${copyVi}`;
    return copyEn || copyVi || '';
  };

  if (matchedEntry) {
    let responseText: string;
    if (matchedEntry.summary && matchedEntry.essay) {
      const summary = getBilingual(matchedEntry, 'summary');
      let essay = getBilingual(matchedEntry, 'essay');
      essay.en = String(essay.en || '').replace(/\*Word count: \d+\*\s*/g, '').trim();
      essay.vi = String(essay.vi || '').replace(/\*Số từ: \d+\*\s*/g, '').trim();
      responseText = essay.vi ? `${essay.en}\n\n---\n\n${essay.vi}` : essay.en;
    } else {
      responseText = buildEntryResponse(matchedEntry);
    }
    return { text: responseText, matched: true, relatedRooms, audioFile, entryId };
  }

  const raw = String(message || "");
  const messageLower = raw.toLowerCase();
  const messageWords = raw.trim().split(/\s+/).filter(Boolean);

  const qTokens = new Set([
    'how','what','why','when','where','can','should','is','are','do','does','could','would','will',
    'làm','gì','khi','nào','đâu','có','nên','là'
  ]);
  const multiWordQs = ['tại sao','khi nào','ở đâu'];

  const startsWithQToken = messageWords.length > 0 && qTokens.has(messageWords[0].toLowerCase());
  const hasExactQToken = messageWords.some(w => qTokens.has(w.toLowerCase()));
  const hasMultiWordQ = multiWordQs.some(phrase => messageLower.includes(phrase));

  const isQuestion = messageWords.length >= 3 || messageLower.includes('?') || startsWithQToken || hasExactQToken || hasMultiWordQ;

  if (isQuestion) {
    if (matchedEntryCount >= 10) {
      const essay = getBilingual(roomData, "room_essay");
      const desc = getBilingual(roomData, "description");
      const safety = getBilingual(roomData, "safety_disclaimer");
      const text = [essay.en || desc.en, essay.vi || desc.vi, safety.en, safety.vi]
        .map((s) => (s || "").trim())
        .filter(Boolean)
        .join("\n\n");
      return { text, matched: false };
    }
    
    const desc = getBilingual(roomData, "description");
    const keywordSource: any = roomData.keywords || roomData.keywords_dict || {};
    const keywordGroups = Object.values(keywordSource).slice(0, 3);
    const safeDescEn = desc.en || 'this topic';
    const safeDescVi = desc.vi || 'chủ đề này';
    const text = [
      `I'm here to help with ${safeDescEn}. Try using keywords in the box below (for your English, please type the keyword so you can remember spelling.).`,
      `Tôi ở đây để giúp về ${safeDescVi}. Hãy thử dùng từ khóa trong khung bên dưới.`
    ].join("\n\n");
    return { text, matched: false };
  }
  
  const escalationPrompts = [
    { en: "Please tell me more.", vi: "Vui lòng cho tôi biết thêm." },
    { en: "Please tell me a bit more, my friend.", vi: "Vui lòng cho tôi biết thêm một chút, bạn của tôi." },
    { en: "Keep saying more, I am listening.", vi: "Hãy nói thêm, tôi đang lắng nghe." }
  ];
  
  const promptIndex = noKeywordCount >= 2 ? 2 : noKeywordCount;
  const selectedPrompt = escalationPrompts[promptIndex];
  
  const desc = getBilingual(roomData, "description");
  
  const promptText = [
    selectedPrompt.en,
    selectedPrompt.vi,
    `\nI'm here to help with ${desc.en || 'this topic'}. Try using keywords in the box below (for your English, please type the keyword so you can remember spelling.).`,
    `Tôi ở đây để giúp về ${desc.vi || 'chủ đề này'}. Hãy thử dùng từ khóa trong khung bên dưới.`
  ].join("\n\n");
  
  return { text: promptText, matched: false };
}

// Legacy sync wrapper (deprecated - use keywordRespondAsync)
export function keywordRespond(
  roomId: string, 
  message: string, 
  noKeywordCount: number = 0, 
  matchedEntryCount: number = 0
): { text: string; matched: boolean; relatedRooms?: string[]; audioFile?: string; entryId?: string } {
  // Return a placeholder - callers should migrate to async version
  console.warn('keywordRespond is deprecated, use keywordRespondAsync');
  return {
    text: "Loading...",
    matched: false
  };
}
