import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, FileCode } from "lucide-react";
import { toast } from "sonner";

// Map of viewable files with their actual content
const CODE_FILES: Record<string, string> = {
  "src/lib/constants/tiers.ts": `// src/lib/constants/tiers.ts
// Tier constants following Mercy Blade Design System v1.1

// Human-facing labels (what shows in UI / JSON)
export const TIERS = {
  FREE: "Free / Miễn phí",
  VIP1: "VIP1 / VIP1",
  VIP2: "VIP2 / VIP2",
  VIP3: "VIP3 / VIP3",
  VIP3II: "VIP3 II / VIP3 II",
  VIP4: "VIP4 / VIP4",
  VIP5: "VIP5 / VIP5",
  VIP6: "VIP6 / VIP6",
  VIP9: "VIP9 / Cấp VIP9",
  KIDS_1: "Kids Level 1 / Trẻ em cấp 1",
  KIDS_2: "Kids Level 2 / Trẻ em cấp 2",
  KIDS_3: "Kids Level 3 / Trẻ em cấp 3",
} as const;

export type TierKey = keyof typeof TIERS;
export type TierValue = (typeof TIERS)[TierKey];

// Short, machine-friendly IDs used across the app
export const VIP_TIER_IDS = [
  "vip1", "vip2", "vip3", "vip3ii", "vip4", "vip5", "vip6", "vip9",
] as const;

export const KIDS_TIER_IDS = ["kids_1", "kids_2", "kids_3"] as const;

export const ALL_TIER_IDS = [
  "free", ...VIP_TIER_IDS, ...KIDS_TIER_IDS,
] as const;

export type VipTierId = (typeof VIP_TIER_IDS)[number];
export type KidsTierId = (typeof KIDS_TIER_IDS)[number];
export type TierId = (typeof ALL_TIER_IDS)[number];

// Canonical mapping: TierId -> human label
export const TIER_ID_TO_LABEL: Record<TierId, TierValue> = {
  free: TIERS.FREE,
  vip1: TIERS.VIP1,
  vip2: TIERS.VIP2,
  vip3: TIERS.VIP3,
  vip3ii: TIERS.VIP3II,
  vip4: TIERS.VIP4,
  vip5: TIERS.VIP5,
  vip6: TIERS.VIP6,
  vip9: TIERS.VIP9,
  kids_1: TIERS.KIDS_1,
  kids_2: TIERS.KIDS_2,
  kids_3: TIERS.KIDS_3,
};

export function isValidTier(tier: string): tier is TierValue {
  return Object.values(TIERS).includes(tier as TierValue);
}

export function isValidTierId(id: string): id is TierId {
  return (ALL_TIER_IDS as readonly string[]).includes(id);
}

export function tierIdToLabel(id: TierId): TierValue {
  return TIER_ID_TO_LABEL[id];
}

export function tierLabelToId(raw: string): TierId {
  const s = raw.toLowerCase().trim();
  if (s.includes("kids level 1") || s.includes("kids_1")) return "kids_1";
  if (s.includes("kids level 2") || s.includes("kids_2")) return "kids_2";
  if (s.includes("kids level 3") || s.includes("kids_3")) return "kids_3";
  if (s.includes("vip3 ii") || s.includes("vip3ii")) return "vip3ii";
  if (s.includes("vip1")) return "vip1";
  if (s.includes("vip2")) return "vip2";
  if (s.includes("vip3")) return "vip3";
  if (s.includes("vip4")) return "vip4";
  if (s.includes("vip5")) return "vip5";
  if (s.includes("vip6")) return "vip6";
  if (s.includes("vip9")) return "vip9";
  if (s.includes("free") || s.includes("miễn phí")) return "free";
  return "free";
}

export function normalizeTier(tier: string | null | undefined): TierId {
  if (!tier) return "free";
  return tierLabelToId(tier);
}`,

  "src/lib/accessControl.ts": `/**
 * Centralized VIP Access Control
 * Uses canonical tier system from lib/constants/tiers.ts
 */

import { type TierId } from '@/lib/constants/tiers';

const TIER_HIERARCHY: Record<TierId, number> = {
  free: 1,
  vip1: 2,
  vip2: 3,
  vip3: 4,
  vip3ii: 4.5,
  vip4: 5,
  vip5: 6,
  vip6: 7,
  vip9: 10,
  kids_1: 2,
  kids_2: 3,
  kids_3: 4,
};

export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
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
  if (userLevel >= TIER_HIERARCHY.vip3ii) tiers.push('vip3ii');
  if (userLevel >= TIER_HIERARCHY.vip4) tiers.push('vip4');
  if (userLevel >= TIER_HIERARCHY.vip5) tiers.push('vip5');
  if (userLevel >= TIER_HIERARCHY.vip6) tiers.push('vip6');
  if (userLevel >= TIER_HIERARCHY.vip9) tiers.push('vip9');
  
  return tiers;
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

export function estimateTtsCost(charCount: number): number {
  return (charCount / 1000) * 0.015;
}`,

  "src/lib/roomLoader.ts": `// Room Loader - Main entry point for loading room data
// See full 384-line file in Code Editor

import { supabase } from '@/integrations/supabase/client';
import { normalizeTier, type TierId, KIDS_TIER_IDS } from '@/lib/constants/tiers';

export type RoomLoadErrorCode = 'ROOM_NOT_FOUND' | 'ACCESS_DENIED' | 'AUTH_REQUIRED';

export type LoadedRoomResult = {
  merged: any[];
  keywordMenu: { en: string[]; vi: string[] };
  audioBasePath: string;
  roomTier?: TierId | null;
  errorCode?: RoomLoadErrorCode;
  hasFullAccess?: boolean;
};

/**
 * Main room loader with SWR caching
 * Returns cached data instantly, revalidates in background
 * 
 * NEW BEHAVIOR: "Shop preview" model
 * - Visitors/Free users CAN see preview of VIP rooms (first 2 entries)
 * - Full access requires correct tier subscription
 * - Never returns empty room just because of tier mismatch
 */
export const loadMergedRoom = async (roomId: string): Promise<LoadedRoomResult> => {
  // Implementation handles:
  // 1. Get authenticated user (guests = free tier)
  // 2. Check admin status via has_role RPC
  // 3. Get user's tier from user_subscriptions
  // 4. Normalize room ID
  // 5. Try database first
  // 6. Determine access level (preview vs full)
  // 7. Fallback to JSON files
  // 8. Return with hasFullAccess flag
  
  // See full implementation in Code Editor
};`,
};

// Available files list for the error page
const AVAILABLE_FILES = Object.keys(CODE_FILES);

export default function CodeViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const filePath = searchParams.get("file") || "";
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

  if (!filePath) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-black mb-4">Code Viewer</h1>
        <p className="text-gray-600 mb-4">No file specified.</p>
        <div className="mb-6">
          <h2 className="font-bold text-black mb-2">Available Files:</h2>
          <ul className="space-y-1">
            {AVAILABLE_FILES.map(f => (
              <li key={f}>
                <button 
                  onClick={() => navigate(`/admin/code-viewer?file=${encodeURIComponent(f)}`)}
                  className="text-blue-600 hover:underline font-mono text-sm"
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Button variant="outline" className="border-black" onClick={() => navigate("/admin/system-codes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to File List
        </Button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold text-black mb-4">File Not Found</h1>
        <p className="text-gray-600 mb-2">File: <code className="bg-gray-100 px-2 py-1 rounded">{filePath}</code></p>
        <p className="text-gray-500 text-sm mb-6">
          This file is not available in the viewer. Use the <strong>Code Editor</strong> in Lovable to view all files.
        </p>
        <div className="mb-6 p-4 bg-gray-50 border rounded">
          <h2 className="font-bold text-black mb-2">Available Files:</h2>
          <ul className="space-y-1">
            {AVAILABLE_FILES.map(f => (
              <li key={f}>
                <button 
                  onClick={() => navigate(`/admin/code-viewer?file=${encodeURIComponent(f)}`)}
                  className="text-blue-600 hover:underline font-mono text-sm"
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Button variant="outline" className="border-black" onClick={() => navigate("/admin/system-codes")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to File List
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-black" onClick={() => navigate("/admin/system-codes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-black" />
              <h1 className="text-lg font-bold text-black font-mono">{filePath}</h1>
            </div>
          </div>
          <Button onClick={copyCode} className={copied ? "bg-green-600" : "bg-black"}>
            {copied ? (
              <><Check className="h-4 w-4 mr-2" />Copied!</>
            ) : (
              <><Copy className="h-4 w-4 mr-2" />Copy All Code</>
            )}
          </Button>
        </div>

        {/* Code Block */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-black flex justify-between items-center">
            <span className="text-sm font-mono text-gray-600">{filePath}</span>
            <span className="text-xs text-gray-500">{content.split('\n').length} lines</span>
          </div>
          <pre className="p-4 bg-gray-50 overflow-x-auto text-sm max-h-[70vh] overflow-y-auto">
            <code className="font-mono text-black whitespace-pre select-all">
              {content}
            </code>
          </pre>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Click "Copy All Code" or select the code directly (Ctrl+A / Cmd+A in code block) then copy.
          </p>
        </div>
      </div>
    </div>
  );
}
