import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, FileCode } from "lucide-react";
import { toast } from "sonner";

// Full code content for all key system files
const CODE_FILES: Record<string, string> = {
  "src/lib/constants/tiers.ts": `// src/lib/constants/tiers.ts
// Tier constants following Mercy Blade Design System v1.1

// Human-facing labels (what shows in UI / JSON)
export const TIERS = {
  FREE: "Free / Miễn phí",
  VIP1: "VIP1 / VIP1",
  VIP2: "VIP2 / VIP2",
  VIP3: "VIP3 / VIP3",
  VIP4: "VIP4 / VIP4",
  VIP5: "VIP5 / VIP5",
  VIP6: "VIP6 / VIP6",
  VIP7: "VIP7 / VIP7",
  VIP8: "VIP8 / VIP8",
  VIP9: "VIP9 / Cấp VIP9",
  KIDS_1: "Kids Level 1 / Trẻ em cấp 1",
  KIDS_2: "Kids Level 2 / Trẻ em cấp 2",
  KIDS_3: "Kids Level 3 / Trẻ em cấp 3",
} as const;

export type TierKey = keyof typeof TIERS;
export type TierValue = (typeof TIERS)[TierKey];

// Canonical TierId type - the single source of truth
export type TierId =
  | 'free'
  | 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5'
  | 'vip6' | 'vip7' | 'vip8' | 'vip9'
  | 'kids_1' | 'kids_2' | 'kids_3';

// Tier order for access control hierarchy
export const TIER_ORDER: TierId[] = [
  'free', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5',
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_1', 'kids_2', 'kids_3',
];

// Short, machine-friendly IDs used across the app
export const VIP_TIER_IDS = [
  "vip1", "vip2", "vip3", "vip4", "vip5",
  "vip6", "vip7", "vip8", "vip9",
] as const;

export const KIDS_TIER_IDS: TierId[] = ['kids_1', 'kids_2', 'kids_3'];

export const ALL_TIER_IDS: TierId[] = [
  'free',
  'vip1', 'vip2', 'vip3', 'vip4', 'vip5',
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_1', 'kids_2', 'kids_3',
];

export type VipTierId = (typeof VIP_TIER_IDS)[number];
export type KidsTierId = 'kids_1' | 'kids_2' | 'kids_3';

// Canonical mapping: TierId -> human label
export const TIER_ID_TO_LABEL: Record<TierId, TierValue> = {
  free: TIERS.FREE,
  vip1: TIERS.VIP1,
  vip2: TIERS.VIP2,
  vip3: TIERS.VIP3,
  vip4: TIERS.VIP4,
  vip5: TIERS.VIP5,
  vip6: TIERS.VIP6,
  vip7: TIERS.VIP7,
  vip8: TIERS.VIP8,
  vip9: TIERS.VIP9,
  kids_1: TIERS.KIDS_1,
  kids_2: TIERS.KIDS_2,
  kids_3: TIERS.KIDS_3,
};

/**
 * Check if a tier is a kids tier
 */
export function isKidsTier(tier: TierId): boolean {
  return tier.startsWith('kids_');
}

// Helper: validate human-facing label
export function isValidTier(tier: string): tier is TierValue {
  return Object.values(TIERS).includes(tier as TierValue);
}

// Helper: validate tier ID
export function isValidTierId(id: string): id is TierId {
  return ALL_TIER_IDS.includes(id as TierId);
}

// Map TierId -> human label
export function tierIdToLabel(id: TierId): TierValue {
  return TIER_ID_TO_LABEL[id];
}

/**
 * Best-effort mapping from label or messy string -> TierId
 * Handles all variations: "Free / Miễn phí", "Free", "free",
 * "Kids 1", "Kids Level 1", "kids_level_1", "kids_1", etc.
 */
export function tierLabelToId(raw: string): TierId {
  const s = raw.toLowerCase().trim();

  // Kids variations
  if (s.includes("kids") && (s.includes("1") || s.includes("level 1"))) return "kids_1";
  if (s.includes("kids") && (s.includes("2") || s.includes("level 2"))) return "kids_2";
  if (s.includes("kids") && (s.includes("3") || s.includes("level 3"))) return "kids_3";
  if (s.includes("kids_level_1") || s === "kids_1") return "kids_1";
  if (s.includes("kids_level_2") || s === "kids_2") return "kids_2";
  if (s.includes("kids_level_3") || s === "kids_3") return "kids_3";
  if (s.includes("trẻ em") && s.includes("1")) return "kids_1";
  if (s.includes("trẻ em") && s.includes("2")) return "kids_2";
  if (s.includes("trẻ em") && s.includes("3")) return "kids_3";

  // VIP tiers (check longer ones first)
  if (s.includes("vip9") || s === "vip9") return "vip9";
  if (s.includes("vip8") || s === "vip8") return "vip8";
  if (s.includes("vip7") || s === "vip7") return "vip7";
  if (s.includes("vip6") || s === "vip6") return "vip6";
  if (s.includes("vip5") || s === "vip5") return "vip5";
  if (s.includes("vip4") || s === "vip4") return "vip4";
  if (s.includes("vip3") || s === "vip3") return "vip3";
  if (s.includes("vip2") || s === "vip2") return "vip2";
  if (s.includes("vip1") || s === "vip1") return "vip1";

  // Free variations
  if (s.includes("free") || s.includes("miễn phí")) return "free";

  return "free";
}

/**
 * Normalize any tier-like string into a canonical TierId
 */
export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";
  return tierLabelToId(tier);
}`,

  "src/lib/accessControl.ts": `/**
 * Centralized VIP Access Control
 * Uses canonical tier system from lib/constants/tiers.ts
 */

import { type TierId, isKidsTier, TIER_ORDER } from '@/lib/constants/tiers';

/**
 * Tier hierarchy (higher tiers include access to all lower tiers)
 */
const TIER_HIERARCHY: Record<TierId, number> = {
  free: 1,
  vip1: 2,
  vip2: 3,
  vip3: 4,
  vip4: 5,
  vip5: 6,
  vip6: 7,
  vip7: 8,
  vip8: 9,
  vip9: 10,
  kids_1: 2,
  kids_2: 3,
  kids_3: 4,
};

/**
 * Determines if a user can access a specific room based on tier
 */
export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
  const userIsKids = isKidsTier(userTier);
  const roomIsKids = isKidsTier(roomTier);
  
  // Kids/VIP can't cross access (except VIP9)
  if (userIsKids !== roomIsKids && userTier !== 'vip9') {
    return false;
  }
  
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const roomLevel = TIER_HIERARCHY[roomTier] || 0;
  
  return userLevel >= roomLevel;
}

export function canAccessVIPTier(userTier: TierId, targetTier: TierId): boolean {
  return canUserAccessRoom(userTier, targetTier);
}

export function getAccessibleTiers(userTier: TierId): TierId[] {
  const userLevel = TIER_HIERARCHY[userTier] || 0;
  const tiers: TierId[] = ['free'];
  
  if (userLevel >= TIER_HIERARCHY.vip1) tiers.push('vip1');
  if (userLevel >= TIER_HIERARCHY.vip2) tiers.push('vip2');
  if (userLevel >= TIER_HIERARCHY.vip3) tiers.push('vip3');
  if (userLevel >= TIER_HIERARCHY.vip4) tiers.push('vip4');
  if (userLevel >= TIER_HIERARCHY.vip5) tiers.push('vip5');
  if (userLevel >= TIER_HIERARCHY.vip6) tiers.push('vip6');
  if (userLevel >= TIER_HIERARCHY.vip7) tiers.push('vip7');
  if (userLevel >= TIER_HIERARCHY.vip8) tiers.push('vip8');
  if (userLevel >= TIER_HIERARCHY.vip9) tiers.push('vip9');
  
  return tiers;
}

// Access test matrix for verification
export const ACCESS_TEST_MATRIX = [
  { tier: 'free' as TierId, roomTier: 'free' as TierId, expected: true },
  { tier: 'free' as TierId, roomTier: 'vip3' as TierId, expected: false },
  { tier: 'vip2' as TierId, roomTier: 'free' as TierId, expected: true },
  { tier: 'vip2' as TierId, roomTier: 'vip2' as TierId, expected: true },
  { tier: 'vip2' as TierId, roomTier: 'vip3' as TierId, expected: false },
  { tier: 'kids_1' as TierId, roomTier: 'kids_1' as TierId, expected: true },
  { tier: 'kids_1' as TierId, roomTier: 'vip1' as TierId, expected: false },
  { tier: 'vip9' as TierId, roomTier: 'kids_3' as TierId, expected: true },
];

export function validateAccessControl(): { passed: number; failed: number; failures: any[] } {
  let passed = 0;
  let failed = 0;
  const failures: any[] = [];
  
  for (const test of ACCESS_TEST_MATRIX) {
    const result = canUserAccessRoom(test.tier, test.roomTier);
    if (result === test.expected) {
      passed++;
    } else {
      failed++;
      failures.push({ ...test, actual: result });
    }
  }
  
  return { passed, failed, failures };
}`,

  "src/lib/audioSchema.ts": `/**
 * Audio Schema Definition
 * Defines all DB fields where audio may live for batch processing
 */

export type PathDayAudioField = 
  | 'audio_content_en' | 'audio_content_vi'
  | 'audio_reflection_en' | 'audio_reflection_vi'
  | 'audio_dare_en' | 'audio_dare_vi'
  | 'audio_intro_en' | 'audio_intro_vi';

export type AudioKind = 'content' | 'reflection' | 'dare' | 'intro' | 'warmth';
export type AudioLang = 'en' | 'vi';

export type AudioFieldTarget =
  | { table: 'path_days'; field: PathDayAudioField; lang: AudioLang; kind: AudioKind }
  | { table: 'rooms'; field: 'audio_intro_en' | 'audio_intro_vi'; lang: AudioLang; kind: 'intro' }
  | { table: 'warmth'; field: 'audio_en' | 'audio_vi'; lang: AudioLang; kind: 'warmth' };

export interface AudioTask {
  target: 'path_days' | 'rooms' | 'warmth';
  id: string;
  slug: string;
  day_index?: number;
  lang: AudioLang;
  kind: AudioKind;
  text: string;
  suggestedFilename: string;
  field: string;
}

export interface BatchScanResult {
  ok: boolean;
  tasks: AudioTask[];
  summary?: {
    total: number;
    byKind: Record<string, number>;
    byLang: Record<string, number>;
    estimatedChars: number;
    estimatedCostUsd: number;
  };
  error?: string;
}

export interface BatchGenerateResult {
  ok: boolean;
  results: {
    id: string;
    filename: string;
    status: 'success' | 'skipped_exists' | 'error';
    error?: string;
  }[];
  summary?: {
    success: number;
    skipped: number;
    errors: number;
  };
}

export function generatePathDayFilename(
  pathSlug: string, dayIndex: number, kind: AudioKind, lang: AudioLang
): string {
  const normalizedSlug = pathSlug.toLowerCase().replace(/-/g, '_');
  return \`\${normalizedSlug}_day\${dayIndex}_\${kind}_\${lang}.mp3\`;
}

export function getPathDayAudioField(kind: AudioKind, lang: AudioLang): PathDayAudioField {
  const fieldMap: Record<string, PathDayAudioField> = {
    'content_en': 'audio_content_en',
    'content_vi': 'audio_content_vi',
    'reflection_en': 'audio_reflection_en',
    'reflection_vi': 'audio_reflection_vi',
    'dare_en': 'audio_dare_en',
    'dare_vi': 'audio_dare_vi',
    'intro_en': 'audio_intro_en',
    'intro_vi': 'audio_intro_vi',
  };
  return fieldMap[\`\${kind}_\${lang}\`] || 'audio_content_en';
}

export function parsePathDayAudioField(field: PathDayAudioField): { kind: AudioKind; lang: AudioLang } {
  const parts = field.replace('audio_', '').split('_');
  const lang = parts.pop() as AudioLang;
  const kind = parts.join('_') as AudioKind;
  return { kind, lang };
}

export function estimateTtsCost(charCount: number): number {
  return (charCount / 1000) * 0.015;
}`,

  "src/lib/roomLoader.ts": `// src/lib/roomLoader.ts
import { supabase } from '@/integrations/supabase/client';
import { processEntriesOptimized } from './roomLoaderHelpers';
import { ROOMS_TABLE, AUDIO_FOLDER } from '@/lib/constants/rooms';
import { normalizeTier, type TierId, isKidsTier } from '@/lib/constants/tiers';
import type { Database } from '@/integrations/supabase/types';
import { logger } from './logger';
import { useSWR } from './cache/swrCache';

type RoomRow = Database['public']['Tables']['rooms']['Row'];

export type RoomLoadErrorCode = 'ROOM_NOT_FOUND' | 'ACCESS_DENIED' | 'AUTH_REQUIRED';

export type LoadedRoomResult = {
  merged: any[];
  keywordMenu: { en: string[]; vi: string[] };
  audioBasePath: string;
  roomTier?: TierId | null;
  errorCode?: RoomLoadErrorCode;
  hasFullAccess?: boolean;
};

const ROOM_ID_OVERRIDES: Record<string, string> = {
  'english-writing-deep-dive-vip3-ii': 'english-writing-deep-dive-vip3II',
  'english-writing-deep-dive-vip3-ii-ii': 'english-writing-deep-dive-vip3II-II',
  'english-writing-deep-dive-vip3-iii': 'english-writing-deep-dive-vip3ii-III',
};

const normalizeRoomId = (roomId: string): string => {
  if (ROOM_ID_OVERRIDES[roomId]) return ROOM_ID_OVERRIDES[roomId];
  if (roomId.endsWith('_kids_l1')) {
    return roomId.replace('_kids_l1', '').replace(/_/g, '-');
  }
  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (romanNumeralPattern.test(roomId)) {
    return roomId.replace(romanNumeralPattern, (match) => match.toUpperCase());
  }
  return roomId;
};

const AUDIO_BASE_PATH = \`\${AUDIO_FOLDER}/\`;

const buildPreviewEntries = (entries: any[]): any[] => {
  if (!Array.isArray(entries)) return [];
  return entries.slice(0, 2);
};

const loadFromDatabase = async (dbRoomId: string) => {
  const { data: dbRoom, error } = await supabase
    .from(ROOMS_TABLE)
    .select('*')
    .eq('id', dbRoomId)
    .maybeSingle<RoomRow>();

  if (error || !dbRoom) return null;

  const hasEntries = Array.isArray(dbRoom.entries) && dbRoom.entries.length > 0;
  const roomTier: TierId | null = dbRoom.tier ? normalizeTier(dbRoom.tier) : null;

  if (!hasEntries) {
    const hasRoomKeywords = Array.isArray(dbRoom.keywords) && dbRoom.keywords.length > 0;
    if (!hasRoomKeywords) return null;
    return {
      merged: [],
      keywordMenu: { en: dbRoom.keywords || [], vi: dbRoom.keywords || [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  const { keywordMenu, merged } = processEntriesOptimized(dbRoom.entries, dbRoomId);
  return { merged, keywordMenu, audioBasePath: AUDIO_BASE_PATH, roomTier };
};

const loadFromJson = async (roomId: string) => {
  try {
    const { loadRoomJson } = await import('./roomJsonResolver');
    const jsonData = await loadRoomJson(roomId);
    if (!Array.isArray(jsonData?.entries) || jsonData.entries.length === 0) return null;
    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries, roomId);
    const roomTier: TierId | null = jsonData.tier ? normalizeTier(jsonData.tier) : null;
    return { merged, keywordMenu, audioBasePath: AUDIO_BASE_PATH, roomTier };
  } catch (error) {
    console.error('Failed to load room from JSON:', error);
    return null;
  }
};

const checkIsKidsTier = (tier: TierId | null | undefined): boolean => {
  if (!tier) return false;
  return isKidsTier(tier);
};

/**
 * Main room loader with SWR caching
 */
export const loadMergedRoom = async (roomId: string): Promise<LoadedRoomResult> => {
  const cacheKey = \`room:\${roomId}\`;
  return useSWR({
    key: cacheKey,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000,
  });
};

/**
 * Internal room loader - "Shop preview" model
 * - Visitors/Free users CAN see preview (first 2 entries)
 * - Full access requires correct tier subscription
 */
const loadMergedRoomInternal = async (roomId: string): Promise<LoadedRoomResult> => {
  const startTime = performance.now();
  const { canUserAccessRoom } = await import('./accessControl');

  try {
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    let baseTier: TierId = 'free';

    if (user) {
      const { data: isAdminRpc } = await supabase.rpc('has_role', {
        _role: 'admin', _user_id: user.id,
      });
      isAdmin = !!isAdminRpc;

      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('subscription_tiers(name)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      const rawUserTier = (subscription?.subscription_tiers as any)?.name || 'Free / Miễn phí';
      baseTier = normalizeTier(rawUserTier);
    }

    const normalizedUserTier: TierId = isAdmin ? 'vip9' : baseTier;
    const isUserKidsTier = checkIsKidsTier(baseTier);
    const dbRoomId = normalizeRoomId(roomId);

    // Try database first
    const dbResult = await loadFromDatabase(dbRoomId);
    if (dbResult) {
      // Rebuild keyword menu if empty
      if (dbResult.keywordMenu && Array.isArray(dbResult.merged) && 
          dbResult.merged.length > 0 && 
          (!dbResult.keywordMenu.en || dbResult.keywordMenu.en.length === 0)) {
        const fallbackEn: string[] = [];
        const fallbackVi: string[] = [];
        (dbResult.merged as any[]).forEach((entry) => {
          const en = String(entry.keywordEn || entry.slug || '').trim();
          const vi = String(entry.keywordVi || entry.keywordEn || '').trim();
          if (en) { fallbackEn.push(en); fallbackVi.push(vi); }
        });
        dbResult.keywordMenu = { en: fallbackEn, vi: fallbackVi };
      }

      const normalizedRoomTier = dbResult.roomTier ?? ('free' as TierId);
      const isRoomKidsTier = checkIsKidsTier(normalizedRoomTier);
      
      let hasFullAccess = true;
      if (!isAdmin) {
        if (isUserKidsTier && !isRoomKidsTier) hasFullAccess = false;
        else if (!canUserAccessRoom(normalizedUserTier, normalizedRoomTier)) hasFullAccess = false;
      }

      if (!hasFullAccess) {
        const previewMerged = buildPreviewEntries(dbResult.merged);
        return {
          merged: previewMerged,
          keywordMenu: dbResult.keywordMenu,
          audioBasePath: AUDIO_BASE_PATH,
          roomTier: normalizedRoomTier,
          errorCode: 'ACCESS_DENIED',
          hasFullAccess: false,
        };
      }

      return { ...dbResult, hasFullAccess: true };
    }

    // Fallback to JSON
    let jsonResult = await loadFromJson(dbRoomId);
    if (!jsonResult && dbRoomId !== roomId) {
      jsonResult = await loadFromJson(roomId);
    }
    
    if (jsonResult) {
      const normalizedRoomTier = jsonResult.roomTier ?? ('free' as TierId);
      let hasFullAccess = true;
      if (!isAdmin) {
        if (isUserKidsTier && !checkIsKidsTier(normalizedRoomTier)) hasFullAccess = false;
        else if (jsonResult.roomTier && !canUserAccessRoom(normalizedUserTier, jsonResult.roomTier)) hasFullAccess = false;
      }

      if (!hasFullAccess) {
        const previewMerged = buildPreviewEntries(jsonResult.merged);
        return {
          merged: previewMerged,
          keywordMenu: jsonResult.keywordMenu,
          audioBasePath: AUDIO_BASE_PATH,
          roomTier: normalizedRoomTier,
          errorCode: 'ACCESS_DENIED',
          hasFullAccess: false,
        };
      }
      
      return { ...jsonResult, hasFullAccess: true };
    }

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      errorCode: 'ROOM_NOT_FOUND',
      hasFullAccess: false,
    };
  } catch (error: any) {
    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      errorCode: 'ROOM_NOT_FOUND',
      hasFullAccess: false,
    };
  }
};`,

  "scripts/room-schema.json": `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [],
  "properties": {
    "tier": { "type": "string" },
    "title": {
      "type": "object",
      "properties": {
        "en": { "type": "string" },
        "vi": { "type": "string" }
      }
    },
    "content": {
      "type": "object",
      "properties": {
        "en": { "type": "string" },
        "vi": { "type": "string" }
      }
    },
    "entries": {
      "oneOf": [
        { "type": "array" },
        { "type": "object" }
      ]
    },
    "meta": {
      "type": "object",
      "properties": {
        "created_at": { "type": "string" },
        "updated_at": { "type": "string" },
        "entry_count": { "type": "integer", "minimum": 1 },
        "tier": { "type": "string" },
        "room_color": { "type": "string" }
      }
    }
  },
  "definitions": {
    "entry": {
      "type": "object",
      "properties": {
        "slug": { "type": "string", "pattern": "^[A-Za-z0-9_-]+$" },
        "keywordEn": { "type": "string" },
        "id": { "type": "string" },
        "keywords_en": { "type": "array", "items": { "type": "string" } },
        "keywords_vi": { "type": "array", "items": { "type": "string" } },
        "copy": {
          "type": "object",
          "properties": {
            "en": { "type": "string" },
            "vi": { "type": "string" }
          },
          "additionalProperties": true
        },
        "replyEn": { "type": "string" },
        "replyVi": { "type": "string" },
        "essay": { "type": "string" },
        "tags": { "type": "array", "items": { "type": "string" } },
        "audio": {
          "oneOf": [
            { "type": "string", "pattern": "^[A-Za-z0-9._/-]+\\\\.mp3$" },
            {
              "type": "object",
              "properties": {
                "en": { "type": "string", "pattern": "^[A-Za-z0-9._/-]+\\\\.mp3$" },
                "vi": { "type": "string", "pattern": "^[A-Za-z0-9._/-]+\\\\.mp3$" }
              }
            }
          ]
        }
      },
      "additionalProperties": true,
      "anyOf": [
        { "required": ["slug"] },
        { "required": ["keywordEn"] },
        { "required": ["id"] }
      ]
    }
  }
}`,
};

const AVAILABLE_FILES = Object.keys(CODE_FILES);

const DEFAULT_FILE = "src/lib/constants/tiers.ts";

export default function CodeViewer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const rawFilePath = searchParams.get("file") || "";
  // Clean the path - remove leading slash if present
  const filePath = rawFilePath.startsWith("/") ? rawFilePath.slice(1) : rawFilePath;
  const content = CODE_FILES[filePath];

  const copyCode = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // No file specified or invalid file - show file selector
  if (!filePath || !content) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" className="border-black" onClick={() => navigate("/admin/system-codes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-black">Code Viewer</h1>
          </div>
          
          {filePath && !content && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">
                File <code className="bg-red-100 px-2 py-1 rounded font-mono">{rawFilePath}</code> not found in available files.
              </p>
            </div>
          )}
          
          <h2 className="text-lg font-bold text-black mb-4">Select a file to view:</h2>
          <div className="grid gap-3">
            {AVAILABLE_FILES.map(f => (
              <button 
                key={f}
                onClick={() => setSearchParams({ file: f })}
                className="text-left p-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 hover:border-black rounded-lg font-mono text-sm transition-colors"
              >
                <FileCode className="h-4 w-4 inline mr-2 text-gray-600" />
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show file with single Copy Code button
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-black" onClick={() => navigate("/admin/system-codes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-black" />
              <span className="font-bold text-black font-mono text-sm">{filePath}</span>
            </div>
          </div>
          <Button onClick={copyCode} size="lg" className={copied ? "bg-green-600" : "bg-black"}>
            {copied ? (
              <><Check className="h-5 w-5 mr-2" />Copied!</>
            ) : (
              <><Copy className="h-5 w-5 mr-2" />Copy Code</>
            )}
          </Button>
        </div>

        {/* Code Block */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-black">
            <span className="text-sm text-gray-600">{content.split('\n').length} lines</span>
          </div>
          <pre className="p-4 bg-gray-50 overflow-x-auto text-sm max-h-[75vh] overflow-y-auto">
            <code className="font-mono text-black whitespace-pre">{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
