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
      if (msg.includes(normalize(k))) return groupKey;
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

export function keywordRespond(roomId: string, message: string, noKeywordCount: number = 0, matchedEntryCount: number = 0): { text: string; matched: boolean } {
  const roomData = roomDataMap[roomId];
  if (!roomData) throw new Error("Room data not found");

  const groupKey = findMatchingGroup(message, roomData.keywords);
  const matchedEntry = findEntryByGroup(groupKey, roomData.entries || []);
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
    const base = buildEntryResponse(matchedEntry);
    const safety = getBilingual(roomData, "safety_disclaimer");
    const crisis = getBilingual(roomData, "crisis_footer");
    
    // Add related rooms suggestion if available
    const relatedSection = relatedRooms.length > 0
      ? `\n\n📚 Related Topics:\nYou might also find helpful information in: ${relatedRooms.join(', ')}\n\n📚 Chủ đề liên quan:\nBạn cũng có thể tìm thông tin hữu ích trong: ${relatedRooms.join(', ')}`
      : "";
    
    const text = [base, relatedSection, safety.en, safety.vi, crisis.en, crisis.vi]
      .map((s) => (s || "").trim())
      .filter(Boolean)
      .join("\n\n");
    return { text, matched: true };
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
    // Only show essay after ~15 matched entries
    if (matchedEntryCount >= 15) {
      const essay = getBilingual(roomData, "room_essay");
      const desc = getBilingual(roomData, "description");
      const safety = getBilingual(roomData, "safety_disclaimer");
      const text = [essay.en || desc.en, essay.vi || desc.vi, safety.en, safety.vi]
        .map((s) => (s || "").trim())
        .filter(Boolean)
        .join("\n\n");
      return { text, matched: false };
    }
    
    // Before 15 entries, give a helpful prompt
    const desc = getBilingual(roomData, "description");
    const topKeys = Object.keys(roomData.keywords || {}).slice(0, 5).join(', ');
    const text = [
      `I'm here to help with ${desc.en}. Try using keywords like: ${topKeys}.`,
      `Tôi ở đây để giúp về ${desc.vi}. Hãy thử dùng từ khóa như: ${topKeys}.`
    ].join("\n\n");
    return { text, matched: false };
  }
  
  // For short/unclear messages, use escalating friendly prompts
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
      en: "Please tell me more my dear friend.",
      vi: "Vui lòng cho tôi biết thêm, bạn thân yêu của tôi."
    }
  ];
  
  // Cycle through the prompts (0, 1, 2, 0, 1, 2, ...)
  const promptIndex = noKeywordCount % escalationPrompts.length;
  const selectedPrompt = escalationPrompts[promptIndex];
  
  const desc = getBilingual(roomData, "description");
  const topKeys = Object.keys(roomData.keywords || {}).slice(0, 5).join(', ');
  
  const promptText = [
    selectedPrompt.en,
    selectedPrompt.vi,
    `\nI'm here to help with ${desc.en}. Try using keywords like: ${topKeys}.`,
    `Tôi ở đây để giúp về ${desc.vi}. Hãy thử dùng từ khóa như: ${topKeys}.`
  ].join("\n\n");
  
  return { text: promptText, matched: false };
}
