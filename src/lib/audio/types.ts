/**
 * Audio System Types v1.0
 * Phase 4 Preparation: Interfaces for future TTS and voice generation
 */

/**
 * Audio Generation Plan
 * Used for TTS and human voice generation pipeline
 */
export interface AudioGenerationPlan {
  roomId: string;
  entrySlug: string;
  text: {
    en: string;
    vi: string;
  };
  priority: 'high' | 'medium' | 'low';
  estimatedDuration?: {
    en: number; // seconds
    vi: number;
  };
}

/**
 * Audio Generation Batch
 * Collection of generation tasks
 */
export interface AudioGenerationBatch {
  batchId: string;
  plans: AudioGenerationPlan[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  createdAt: string;
  completedAt?: string;
}

/**
 * TTS Provider Configuration
 */
export interface TTSProviderConfig {
  provider: 'google' | 'elevenlabs' | 'openai' | 'azure';
  apiKey?: string;
  voiceSettings: {
    en: {
      voiceId: string;
      speed: number;
      pitch: number;
    };
    vi: {
      voiceId: string;
      speed: number;
      pitch: number;
    };
  };
  outputFormat: 'mp3' | 'wav' | 'ogg';
  sampleRate: number;
}

/**
 * Audio File Metadata
 */
export interface AudioFileMetadata {
  filename: string;
  roomId: string;
  entrySlug: string;
  language: 'en' | 'vi';
  duration: number; // seconds
  sampleRate: number;
  bitrate: number;
  fileSize: number; // bytes
  createdAt: string;
  generatedBy: 'tts' | 'human' | 'unknown';
  checksumMd5?: string;
}

/**
 * Audio Quality Report
 */
export interface AudioQualityReport {
  filename: string;
  qualityScore: number; // 0-100
  issues: AudioQualityIssue[];
  passesMinimumThreshold: boolean;
}

export interface AudioQualityIssue {
  type: 'duration-mismatch' | 'silence-detected' | 'clipping' | 'low-volume' | 'noise';
  severity: 'warning' | 'error';
  description: string;
  timestamp?: number; // seconds into the file
}

/**
 * Audio Sync State
 * Tracks synchronization between sources
 */
export interface AudioSyncState {
  lastSync: string;
  sourcesChecked: {
    manifest: boolean;
    storage: boolean;
    database: boolean;
    json: boolean;
  };
  conflicts: AudioConflict[];
  pendingOperations: number;
}

export interface AudioConflict {
  filename: string;
  type: 'version-mismatch' | 'missing-source' | 'duplicate' | 'naming-conflict';
  sources: string[];
  resolution?: 'pending' | 'auto-resolved' | 'manual-required';
}

/**
 * Repair Log Entry
 * Audit trail for all repair operations
 */
export interface RepairLogEntry {
  id: string;
  timestamp: string;
  operationType: 'rename' | 'delete' | 'move' | 'create' | 'update-json';
  source: string;
  target: string;
  roomId?: string;
  success: boolean;
  errorMessage?: string;
  reversible: boolean;
  executedBy: 'auto' | 'manual' | 'github-action';
}

/**
 * System Health Metrics
 */
export interface AudioSystemHealth {
  overallScore: number; // 0-100
  metrics: {
    coverageScore: number;
    namingScore: number;
    consistencyScore: number;
    orphanScore: number;
  };
  totalFiles: number;
  totalRooms: number;
  issueCount: {
    critical: number;
    warning: number;
    info: number;
  };
  lastChecked: string;
  recommendations: string[];
}
