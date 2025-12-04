import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, FileCode } from "lucide-react";
import { toast } from "sonner";

// Map of viewable files with their content
const CODE_FILES: Record<string, string> = {
  "src/lib/roomSchema.ts": `/**
 * Room Schema Types and Validation
 * Defines the structure for room data across all tiers
 */

export interface RoomEntry {
  slug?: string;
  id?: string;
  keywordEn?: string;
  keywords_en?: string[];
  keywords_vi?: string[];
  copy?: {
    en?: string;
    vi?: string;
  };
  replyEn?: string;
  replyVi?: string;
  essay?: string;
  tags?: string[];
  audio?: string | { en?: string; vi?: string };
}

export interface RoomData {
  id: string;
  tier?: string;
  title?: { en: string; vi: string };
  content?: { en: string; vi: string };
  entries?: RoomEntry[] | Record<string, RoomEntry>;
  meta?: {
    created_at?: string;
    updated_at?: string;
    entry_count?: number;
    tier?: string;
    room_color?: string;
  };
}

export type TierId = 
  | 'free' 
  | 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5' 
  | 'vip6' | 'vip7' | 'vip8' | 'vip9'
  | 'kids_level_1' | 'kids_level_2' | 'kids_level_3';

export const TIER_ORDER: TierId[] = [
  'free', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5', 
  'vip6', 'vip7', 'vip8', 'vip9',
  'kids_level_1', 'kids_level_2', 'kids_level_3'
];

export function normalizeTier(raw: string | null | undefined): TierId {
  if (!raw) return 'free';
  const lower = raw.toLowerCase().trim();
  
  // Handle common variations
  if (lower.includes('free') || lower === 'free / miễn phí') return 'free';
  if (lower === 'vip1' || lower === 'vip 1') return 'vip1';
  if (lower === 'vip2' || lower === 'vip 2') return 'vip2';
  if (lower === 'vip3' || lower === 'vip 3') return 'vip3';
  if (lower === 'vip4' || lower === 'vip 4') return 'vip4';
  if (lower === 'vip5' || lower === 'vip 5') return 'vip5';
  if (lower === 'vip6' || lower === 'vip 6') return 'vip6';
  if (lower === 'vip7' || lower === 'vip 7') return 'vip7';
  if (lower === 'vip8' || lower === 'vip 8') return 'vip8';
  if (lower === 'vip9' || lower === 'vip 9') return 'vip9';
  if (lower.includes('kids') && lower.includes('1')) return 'kids_level_1';
  if (lower.includes('kids') && lower.includes('2')) return 'kids_level_2';
  if (lower.includes('kids') && lower.includes('3')) return 'kids_level_3';
  
  return 'free';
}

export function canUserAccessRoom(userTier: TierId, roomTier: TierId): boolean {
  const userIndex = TIER_ORDER.indexOf(userTier);
  const roomIndex = TIER_ORDER.indexOf(roomTier);
  
  if (userIndex === -1 || roomIndex === -1) return false;
  
  // Kids tiers are separate from VIP tiers
  const isUserKids = userTier.startsWith('kids_');
  const isRoomKids = roomTier.startsWith('kids_');
  
  if (isUserKids !== isRoomKids) return false;
  
  return userIndex >= roomIndex;
}

export function isKidsTier(tier: TierId): boolean {
  return tier.startsWith('kids_');
}
`,
  "src/lib/roomLoader.ts": `// Room Loader - See full file in Code Editor
// This file handles loading and merging room data from database and JSON sources
// Key exports: loadMergedRoom, LoadedRoomResult, RoomLoadErrorCode`,
  "src/lib/audioSchema.ts": `// Audio Schema - See full file in Code Editor  
// Defines audio field types and utilities for batch TTS processing
// Key exports: AudioTask, BatchScanResult, generatePathDayFilename`,
};

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
        <p className="text-gray-600">No file specified. Use ?file=path/to/file.ts</p>
        <Button 
          variant="outline" 
          className="mt-4 border-black"
          onClick={() => navigate("/admin/system-code-files")}
        >
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
        <p className="text-gray-600 mb-4">File: {filePath}</p>
        <p className="text-gray-500 text-sm mb-4">
          This file is not available for viewing. Use the Code Editor in Lovable to view all files.
        </p>
        <Button 
          variant="outline" 
          className="border-black"
          onClick={() => navigate("/admin/system-code-files")}
        >
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
            <Button 
              variant="outline" 
              size="sm"
              className="border-black"
              onClick={() => navigate("/admin/system-code-files")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-black" />
              <h1 className="text-lg font-bold text-black font-mono">{filePath}</h1>
            </div>
          </div>
          <Button 
            onClick={copyCode}
            className={copied ? "bg-green-600" : "bg-black"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy All Code
              </>
            )}
          </Button>
        </div>

        {/* Code Block */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-black">
            <span className="text-sm font-mono text-gray-600">{filePath}</span>
          </div>
          <pre className="p-4 bg-gray-50 overflow-x-auto text-sm">
            <code className="font-mono text-black whitespace-pre select-all">
              {content}
            </code>
          </pre>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Click "Copy All Code" or select the code directly and copy with Ctrl+C / Cmd+C
          </p>
        </div>
      </div>
    </div>
  );
}
