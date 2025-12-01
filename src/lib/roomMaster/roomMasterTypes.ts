// RoomMaster Types - Shared type definitions for the RoomMaster engine

export type TierId = 
  | 'free'
  | 'vip1'
  | 'vip2'
  | 'vip3'
  | 'vip3ii'
  | 'vip4'
  | 'vip5'
  | 'vip6'
  | 'vip7'
  | 'vip8'
  | 'vip9'
  | 'kids_1'
  | 'kids_2'
  | 'kids_3';

export interface RoomEntry {
  slug: string;
  keywords_en: string[];
  keywords_vi: string[];
  copy: {
    en: string;
    vi: string;
  };
  audio: string;
  tags: string[];
}

export interface RoomJson {
  id: string;
  tier: string;
  title: {
    en: string;
    vi: string;
  };
  content?: {
    en: string;
    vi: string;
  };
  entries: RoomEntry[];
  keywords?: string[];
  domain?: string;
  schema_id?: string;
  safety_disclaimer?: {
    en?: string;
    vi?: string;
  };
  crisis_footer?: {
    en?: string;
    vi?: string;
  };
}

export interface AudioSpec {
  filename: string;
  exists: boolean;
  url?: string;
}

export interface RoomMasterError {
  field: string;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  actual?: any;
  expected?: string;
  autoFixable: boolean;
}

export interface RoomMasterWarning {
  field: string;
  rule: string;
  message: string;
  suggestion?: string;
}

export interface CrisisFlag {
  field: string;
  triggerWords: string[];
  severity: number; // 1-5
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  suggestedAction: string;
}

export interface QualityScore {
  clarity: number; // 0-100
  density: number; // 0-100
  sentiment: number; // -1 to 1
  repetition: number; // 0-100 (lower is better)
  overall: number; // 0-100
}

export interface RoomMasterOutput {
  cleanedRoom: RoomJson;
  errors: RoomMasterError[];
  warnings: RoomMasterWarning[];
  autofixed: boolean;
  crisisFlags: CrisisFlag[];
  qualityScore?: QualityScore;
  validationMode: 'strict' | 'preview' | 'relaxed';
}

export interface ValidationMode {
  mode: 'strict' | 'preview' | 'relaxed';
  allowMissingFields: boolean;
  allowEmptyEntries: boolean;
  requireAudio: boolean;
  requireBilingualCopy: boolean;
  minEntries: number;
  maxEntries: number;
}

export interface AutoFixResult {
  fixed: boolean;
  repairedRoom: RoomJson;
  changesApplied: string[];
  remainingErrors: RoomMasterError[];
}

export interface RoomId {
  id: string;
  normalized: string;
  tier: TierId;
}