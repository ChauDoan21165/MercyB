import { getRoomInfo } from "@/lib/roomData";

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

export async function keywordRespond(roomId: string, message: string): Promise<{ text: string; matched: boolean }> {
  const info = getRoomInfo(roomId);
  if (!info?.dataFile) throw new Error("Room data mapping not found");

  // Dynamic import of the JSON file at build/runtime
  const mod: any = await import(`@/data/rooms/${info.dataFile}`);
  const roomData = (mod && (mod.default ?? mod)) as any;
  if (!roomData) throw new Error("Room data file missing");

  const groupKey = findMatchingGroup(message, roomData.keywords);
  const matchedEntry = findEntryByGroup(groupKey, roomData.entries || []);

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
    const text = [base, safety.en, safety.vi, crisis.en, crisis.vi]
      .map((s) => (s || "").trim())
      .filter(Boolean)
      .join("\n\n");
    return { text, matched: true };
  }

  // No match: keep it minimal and still 100% from user's data
  const essay = getBilingual(roomData, "room_essay");
  const desc = getBilingual(roomData, "description");
  const safety = getBilingual(roomData, "safety_disclaimer");
  const text = [essay.en || desc.en, essay.vi || desc.vi, safety.en, safety.vi]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join("\n\n");
  return { text, matched: false };
}
