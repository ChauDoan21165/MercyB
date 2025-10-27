import { roomDataMap } from "@/lib/roomDataImports";
import crossTopicData from "@/data/system/cross_topic_recommendations.json";

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
  return { en: String(obj?.[base] || ""), vi: String(obj?.[`${base}_vi`] || "") };
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
      groupKey // allow matching by the slug key itself
    ];
    for (const k of list) {
      const normalizedK = normalize(k);
      // Exact or contains
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
    // Title vs matched keyword
    score = Math.max(score, jaccard(tTokens, mkTokens));
    // Title vs each group keyword
    for (const g of groupTokenSets) score = Math.max(score, jaccard(tTokens, g));
    // Audio filename cue
    score = Math.max(score, jaccard(aTokens, mkTokens) * 0.9);
    for (const g of groupTokenSets) score = Math.max(score, jaccard(aTokens, g) * 0.9);

    // Boost if title string contains matched keyword substring
    const titleStr = [...tTokens].join(' ');
    const mkStr = [...mkTokens].join(' ');
    if (mkStr && titleStr.includes(mkStr)) score += 0.2;

    if (!best || score > best.score) best = { entry, score };
  }

  if (best && best.score >= 0.2) return best.entry;
  return null;
}

function findRelatedRooms(message: string, currentRoomId: string): string[] {
  const msg = normalize(message);
  const relatedRooms = new Set<string>();
  
  // Check cross-topic recommendations
  if (crossTopicData?.recommendations) {
    crossTopicData.recommendations.forEach((rec: any) => {
      const keyword = normalize(rec.keyword);
      if (msg.includes(keyword)) {
        // Find rooms that are NOT the current room
        rec.rooms?.forEach((room: any) => {
          if (room.roomId !== currentRoomId && room.relevance === 'primary') {
            relatedRooms.add(`${room.roomNameEn} (${room.roomNameVi})`);
          }
        });
      }
    });
  }
  
  return Array.from(relatedRooms).slice(0, 3); // Top 3 related rooms
}

export function keywordRespond(roomId: string, message: string, noKeywordCount: number = 0, matchedEntryCount: number = 0): { text: string; matched: boolean; relatedRooms?: string[]; audioFile?: string; entryId?: string } {
  const roomData = roomDataMap[roomId];
  if (!roomData) throw new Error("Room data not found");

  const matchResult = findMatchingGroup(message, roomData.keywords || roomData.keywords_dict);
  const groupKey = matchResult?.groupKey || null;
  const matchedKeyword = matchResult?.matchedKeyword || null;
  
  // Handle both old (array) and new (object) entry structures
  let matchedEntry = null;
  let audioFile: string | undefined;
  let entryId: string | undefined;
  
  if (roomData.entries && !Array.isArray(roomData.entries)) {
    // New structure: entries is an object with entry IDs as keys
    // Try to find entry that matches the groupKey
    if (groupKey) {
      matchedEntry = roomData.entries[groupKey];
      if (matchedEntry) {
        entryId = groupKey;
        // Extract audio file
        const audio = matchedEntry.audio;
        if (typeof audio === 'string') {
          audioFile = audio;
        } else if (audio && typeof audio === 'object') {
          audioFile = audio.en || audio.vi;
        }
      }
    }
    // Fallback to default entry if no match
    if (!matchedEntry && roomData.default_entry_id) {
      matchedEntry = roomData.entries[roomData.default_entry_id];
      if (matchedEntry) {
        entryId = roomData.default_entry_id;
        const audio = matchedEntry.audio;
        if (typeof audio === 'string') {
          audioFile = audio;
        } else if (audio && typeof audio === 'object') {
          audioFile = audio.en || audio.vi;
        }
      }
    }
  } else {
    // Old structure: entries is an array
    const keywordsSource: any = roomData.keywords || (roomData as any).keywords_dict || {};
    matchedEntry = findEntryByKeyword(matchedKeyword, groupKey, roomData.entries || [], keywordsSource);

    // Fallback: try to match by keyword text within title/content
    if (!matchedEntry && groupKey) {
      const groups: any = keywordsSource;
      const group = groups[groupKey];
      const candidates: string[] = [
        ...(Array.isArray(group?.en) ? group.en : []),
        ...(Array.isArray(group?.vi) ? group.vi : [])
      ].map((s: any) => String(s));

      const norm = (s: any) => String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\s\-]+/g, '_')
        .trim();

      const normalizedCandidates = candidates.map(norm).filter(Boolean);

      matchedEntry = (roomData.entries || []).find((e: any) => {
        const titleStr = typeof e?.title === 'string' ? e.title : (e?.title?.en || e?.title_en || '');
        const contentStr = typeof e?.content === 'string' ? e.content : (e?.content?.en || e?.body?.en || '');
        const text = norm(`${titleStr} ${contentStr}`);
        return normalizedCandidates.some((kw) => kw.length >= 4 && text.includes(kw));
      }) || null;
    }

    // Final fallback: pick the first entry
    if (!matchedEntry && groupKey && Array.isArray(roomData.entries) && roomData.entries.length > 0) {
      matchedEntry = roomData.entries[0];
    }

    if (matchedEntry) {
      // Support audio in various formats
      const audio = matchedEntry.audio || matchedEntry.audio_file || matchedEntry.meta?.audio_file || matchedEntry.audioEn || matchedEntry.audio_en;
      if (typeof audio === 'string') {
        // Audio files are in /public root, no path needed
        audioFile = audio.startsWith('/') ? audio.substring(1) : audio;
      } else if (audio && typeof audio === 'object') {
        const audioPath = audio.en || audio.vi;
        audioFile = audioPath?.startsWith('/') ? audioPath.substring(1) : audioPath;
      }
      entryId = matchedEntry.id || matchedEntry.artifact_id || matchedEntry.title;
    }
  }
  
  const relatedRooms = findRelatedRooms(message, roomId);

  const buildEntryResponse = (entry: any) => {
    // Handle content/copy as string or bilingual object
    let copyEn = typeof entry?.copy === "string"
      ? entry.copy
      : typeof entry?.content === 'string'
        ? entry.content
        : String(entry?.copy?.en || entry?.content?.en || entry?.body?.en || entry?.copy_en || "");
    let copyVi = typeof entry?.copy === "string"
      ? ""
      : typeof entry?.content === 'string'
        ? ""
        : String(entry?.copy?.vi || entry?.content?.vi || entry?.body?.vi || entry?.copy_vi || "");

    // Remove word count from both English and Vietnamese
    copyEn = copyEn.replace(/\*Word count: \d+\*\s*/g, '').trim();
    copyVi = copyVi.replace(/\*Số từ: \d+\*\s*/g, '').trim();

    // Return copy only (titles are already included in copy text)
    return [copyEn, "---", copyVi].filter(Boolean).join("\n\n");
  };

  if (matchedEntry) {
    // Handle new entry structure with summary and essay
    let responseText: string;
    if (matchedEntry.summary && matchedEntry.essay) {
      const summary = getBilingual(matchedEntry, 'summary');
      let essay = getBilingual(matchedEntry, 'essay');
      // Remove word count from essay
      essay.en = essay.en.replace(/\*Word count: \d+\*\s*/g, '').trim();
      essay.vi = essay.vi.replace(/\*Số từ: \d+\*\s*/g, '').trim();
      // English first, Vietnamese below
      responseText = `${essay.en}\n\n---\n\n${essay.vi}`;
    } else {
      responseText = buildEntryResponse(matchedEntry);
    }
    // Note: Disclaimer now displayed at bottom of chat, not per-entry
    return { text: responseText, matched: true, relatedRooms, audioFile, entryId };
  }

  // No match: check if message is substantial before showing essay
  const raw = String(message || "");
  const messageLower = raw.toLowerCase();
  const messageWords = raw.trim().split(/\s+/).filter(Boolean);

  // Consider it a real question if:
  // - 3+ words, or
  // - contains a question mark, or
  // - starts with / equals a question word (exact token match), including VN multi-word forms
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
    // Only show essay after ~10 matched entries (reduced for faster access)
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
    
    // Before 10 entries, give a helpful prompt
    const desc = getBilingual(roomData, "description");
    const keywordSource: any = roomData.keywords || roomData.keywords_dict || {};
    const keywordGroups = Object.values(keywordSource).slice(0, 3);
    const topKeysEn = keywordGroups.flatMap((g: any) => (Array.isArray(g.en) ? g.en.slice(0, 2) : [])).join(', ');
    const topKeysVi = keywordGroups.flatMap((g: any) => (Array.isArray(g.vi) ? g.vi.slice(0, 2) : [])).join(', ');
    const safeDescEn = desc.en || 'this topic';
    const safeDescVi = desc.vi || 'chủ đề này';
    const text = [
      `I'm here to help with ${safeDescEn}. Try using keywords in the box below (for your English, please type the keyword so you can remember spelling.).`,
      `Tôi ở đây để giúp về ${safeDescVi}. Hãy thử dùng từ khóa trong khung bên dưới.`
    ].join("\n\n");
    return { text, matched: false };
  }
  
  // For short/unclear messages, use escalating friendly prompts
  // After 2 non-matches, skip to "I am listening"
  const escalationPrompts = [
    {
      en: "Please tell me more.",
      vi: "Vui lòng cho tôi biết thêm."
    },
    {
      en: "Please tell me a bit more, my friend.",
      vi: "Vui lòng cho tôi biết thêm một chút, bạn của tôi."
    },
    {
      en: "Keep saying more, I am listening.",
      vi: "Hãy nói thêm, tôi đang lắng nghe."
    }
  ];
  
  // Use the listening prompt after 2 non-matches
  const promptIndex = noKeywordCount >= 2 ? 2 : noKeywordCount;
  const selectedPrompt = escalationPrompts[promptIndex];
  
  const desc = getBilingual(roomData, "description");
  
  // Extract actual keywords in both languages
  const keywordSource: any = roomData.keywords || roomData.keywords_dict || {};
  const keywordGroups = Object.values(keywordSource).slice(0, 3);
  const topKeysEn = keywordGroups.flatMap((g: any) => (Array.isArray(g.en) ? g.en.slice(0, 2) : [])).join(', ');
  const topKeysVi = keywordGroups.flatMap((g: any) => (Array.isArray(g.vi) ? g.vi.slice(0, 2) : [])).join(', ');
  
  const promptText = [
    selectedPrompt.en,
    selectedPrompt.vi,
    `\nI'm here to help with ${desc.en || 'this topic'}. Try using keywords in the box below (for your English, please type the keyword so you can remember spelling.).`,
    `Tôi ở đây để giúp về ${desc.vi || 'chủ đề này'}. Hãy thử dùng từ khóa trong khung bên dưới.`
  ].join("\n\n");
  
  return { text: promptText, matched: false };
}
