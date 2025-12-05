/**
 * Audio utilities barrel export
 * Chief Automation Engineer: Audio System v4.0 - Full Expanded Version
 * 
 * Zero-Friction Audio System:
 * ✓ No missing files
 * ✓ No broken names
 * ✓ No JSON mismatch
 * ✓ No duplicates
 * ✓ No manual renaming
 * ✓ All errors repaired automatically
 */

// Core validator (v3.0 APIs)
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
  findOrphanMatch,
  type ValidationResult,
  type RoomAwareValidationResult,
  type DuplicateGroup,
  type CrossRoomIssue,
  type RoomCompletenessScore,
  type FixReport,
} from './filenameValidator';

// Auto-repair engine (v3.0)
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

// Global Consistency Engine (GCE)
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

// Integrity Mapping
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

// Semantic Matcher
export {
  matchAudioToEntry,
  batchMatchOrphans,
  validateRoomAudioConsistency,
  type SemanticMatch,
} from './semanticMatcher';

// Phase 4 Types (Audio Generation)
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
