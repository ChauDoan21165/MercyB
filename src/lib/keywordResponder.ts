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

function findMatchingGroup(message: string, keywords: any): string | null {
  if (!keywords || typeof keywords !== "object") return null;
  const msg = normalize(message);
  for (const [groupKey, groupVal] of Object.entries(keywords)) {
    const g: any = groupVal;
    const list: string[] = [
      ...(Array.isArray(g.en) ? g.en : []),
      ...(Array.isArray(g.vi) ? g.vi : []),
      ...(Array.isArray(g.slug_vi) ? g.slug_vi : []),
    ];
    for (const k of list) {
      const normalizedK = normalize(k);
      // Exact match
      if (msg.includes(normalizedK)) return groupKey;
      // Fuzzy match: check if keyword partially matches (>= 70% overlap)
      if (normalizedK.length >= 4 && msg.length >= 4) {
        for (let i = 0; i <= msg.length - 3; i++) {
          const substring = msg.substring(i, i + Math.min(normalizedK.length, msg.length - i));
          if (normalizedK.includes(substring) && substring.length >= normalizedK.length * 0.7) {
            return groupKey;
          }
        }
      }
    }
  }
  return null;
}

function findEntryByGroup(groupKey: string | null, entries: any[]): any | null {
  if (!groupKey || !Array.isArray(entries)) return null;
  return (
    entries.find((e: any) => e?.slug === groupKey) ||
    entries.find((e: any) => e?.id === groupKey) ||
    entries.find((e: any) => e?.keyword_group === groupKey) ||
    null
  );
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

  const groupKey = findMatchingGroup(message, roomData.keywords || roomData.keywords_dict);
  
  // Handle new structure with entries object
  let matchedEntry = null;
  let audioFile: string | undefined;
  let entryId: string | undefined;
  
  if (roomData.entries && !Array.isArray(roomData.entries)) {
    // New structure: entries is an object with entry IDs as keys
    if (roomData.default_entry_id && groupKey) {
      const defaultEntry = roomData.entries[roomData.default_entry_id];
      if (defaultEntry) {
        matchedEntry = defaultEntry;
        entryId = roomData.default_entry_id;
        audioFile = defaultEntry.audio?.en || defaultEntry.audio?.vi;
      }
    }
  } else {
    // Old structure: entries is an array
    matchedEntry = findEntryByGroup(groupKey, roomData.entries || []);
    if (matchedEntry) {
      audioFile = matchedEntry.audio?.en || matchedEntry.audio?.vi;
      entryId = matchedEntry.id || matchedEntry.artifact_id;
    }
  }
  
  const relatedRooms = findRelatedRooms(message, roomId);

  const buildEntryResponse = (entry: any) => {
    const titleEn = String(entry?.title?.en || entry?.title_en || "");
    const titleVi = String(entry?.title?.vi || entry?.title_vi || "");

    const copyEn = typeof entry?.copy === "string"
      ? entry.copy
      : String(entry?.copy?.en || entry?.content?.en || entry?.body?.en || entry?.copy_en || "");
    const copyVi = typeof entry?.copy === "string"
      ? ""
      : String(entry?.copy?.vi || entry?.content?.vi || entry?.body?.vi || entry?.copy_vi || "");

    const en = [titleEn, copyEn].filter(Boolean).join("\n\n");
    const vi = [titleVi, copyVi].filter(Boolean).join("\n\n");
    return [en, vi].filter(Boolean).join("\n\n");
  };

  if (matchedEntry) {
    // Handle new entry structure with summary and essay
    let responseText: string;
    if (matchedEntry.summary && matchedEntry.essay) {
      const summary = getBilingual(matchedEntry, 'summary');
      const essay = getBilingual(matchedEntry, 'essay');
      responseText = `**${summary.en}** / **${summary.vi}**\n\n${essay.en}\n\n---\n\n${essay.vi}`;
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
