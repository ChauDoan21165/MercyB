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

// Global Consistency Engine (GCE) - THE SINGLE SOURCE OF TRUTH
export {
  // Core functions
  getCanonicalAudioForRoom,
  getCanonicalAudioForEntireRoom,
  normalizeRoomId,
  normalizeEntrySlug,
  extractLanguage,
  validateWithGCE,
  reconcileRoom,
  // Repair plan generation
  generateRoomRepairPlan,
  generateGlobalRepairPlan,
  applyRepairPlan,
  // Configuration
  configureGCE,
  getGCEConfig,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
  // Types
  type CanonicalAudioPair,
  type GCEConfig,
  type GCEValidationResult,
  type GCERepairPlan,
  type GCEOperation,
  type GCEEntryResult,
  type GCEIssue,
  type GCERoomResult,
} from './globalConsistencyEngine';

// Core validator (v3.0 APIs)
export {
  validateAudioFilename,
  validateWithRoomContext,
  generateCanonicalFilename,
  normalizeFilename,
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

// Integrity Mapping
export {
  buildRoomIntegrity,
  buildIntegrityMap,
  getIntegrityMap,
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
  getMatchConfidence,
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
