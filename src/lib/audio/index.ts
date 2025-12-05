/**
 * Audio utilities barrel export
 * Chief Automation Engineer: Audio System v3.0 - Phase 3 Complete
 * 
 * True Self-Healing Audio Intelligence
 */

// Core validator
export {
  validateAudioFilename,
  validateWithRoomContext,
  generateCanonicalFilename,
  normalizeFilename,
  extractLanguage,
  detectDuplicates,
  batchValidate,
  levenshteinDistance,
  similarityScore,
  detectCrossRoomIssues,
  calculateRoomCompletenessScore,
  generateRoomFixReport,
  getCanonicalAudioPair,
  type ValidationResult,
  type RoomAwareValidationResult,
  type DuplicateGroup,
  type CrossRoomIssue,
  type RoomCompletenessScore,
  type FixReport,
} from './filenameValidator';

// Auto-repair engine
export {
  analyzeAndRepair,
  generateRepairBatch,
  validateWithRoomContext as validateRoomAudio,
  generateJsonUpdateOperations,
  detectOrphansWithMatching,
  generateOrphanCleanupOps,
  generateDuplicateResolutionOps,
  generateMissingAudioFixOps,
  generateCompleteFixReports,
  type RepairOperation,
  type RepairBatch,
  type NamingViolation,
  type RoomAudioData,
} from './autoRepair';

// Global Consistency Engine (Phase 3)
export {
  getCanonicalAudioForRoom,
  normalizeRoomId,
  normalizeEntrySlug,
  validateWithGCE,
  generateRoomRepairPlan,
  generateGlobalRepairPlan,
  applyRepairPlan,
  reconcileRoom,
  configureGCE,
  getGCEConfig,
  type CanonicalAudioPair,
  type GCEConfig,
  type GCEValidationResult,
  type GCERepairPlan,
  type GCEOperation,
} from './globalConsistencyEngine';

// Integrity Mapping (Phase 3)
export {
  buildRoomIntegrity,
  buildIntegrityMap,
  generateIntegritySummary,
  getLowestIntegrityRooms,
  getRoomsWithIssues,
  exportIntegrityMapJSON,
  exportIntegrityMapCSV,
  type RoomIntegrity,
  type IntegrityMap,
  type IntegritySummary,
} from './integrityMap';

// Semantic Matcher (Phase 3)
export {
  matchAudioToEntry,
  batchMatchOrphans,
  validateRoomAudioConsistency,
  type SemanticMatch,
} from './semanticMatcher';

// Phase 4 Types (preparation)
export type {
  AudioGenerationPlan,
  AudioGenerationBatch,
  TTSProviderConfig,
  AudioFileMetadata,
  AudioQualityReport,
  AudioQualityIssue,
  AudioSyncState,
  AudioConflict,
  RepairLogEntry,
  AudioSystemHealth,
} from './types';
