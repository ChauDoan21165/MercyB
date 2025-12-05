/**
 * Audio utilities barrel export
 * Chief Automation Engineer: Audio System v5.0 - Zero-Friction Ecosystem
 * 
 * Phase 5 Zero-Friction Audio System:
 * ✓ No missing files
 * ✓ No broken names
 * ✓ No JSON mismatch
 * ✓ No duplicates
 * ✓ No manual renaming
 * ✓ All errors repaired automatically
 * ✓ Governance-controlled autopilot
 * ✓ Multi-pass verification
 * ✓ Cross-room protection
 * ✓ TTS auto-generation
 * ✓ Audio lifecycle tracking
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

// Audio Governance Engine (AGE) - AUTOPILOT CONTROL
export {
  // Core governance functions
  evaluateChangeSet,
  evaluateOperation,
  shouldAutoApply,
  blockCriticalChanges,
  // System integrity
  getSystemIntegrity,
  meetsIntegrityThreshold,
  detectCrossRoomPollution,
  verifyEnViParity,
  // Multi-pass verification
  runMultiPassVerification,
  // Autopilot
  getAutopilotStatus,
  updateAutopilotStatus,
  setAutopilotEnabled,
  // Report generation
  generateGovernanceReport,
  // Configuration
  configureGovernance,
  getGovernanceConfig,
  DEFAULT_GOVERNANCE_CONFIG,
  // Types
  type GovernanceConfig,
  type GovernanceDecision,
  type GovernanceOperation,
  type GovernanceReport,
  type GovernanceViolation,
  type ChangeSet,
  type AutopilotStatus,
  type DecisionType,
} from './audioGovernanceEngine';

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

// TTS Generator (Phase 5)
export {
  createGenerationPlan,
  generateMissingAudio,
  batchGenerateMissingAudio,
  detectCrossLanguageGaps,
  type TTSRequest,
  type TTSResult,
  type MissingAudioEntry,
  type AudioGenerationPlan,
} from './ttsGenerator';

// Audio Lifecycle Database (Phase 5)
export {
  getLifecycleDB,
  saveLifecycleDB,
  upsertLifecycleEntry,
  markVerified,
  markFixed,
  markRegenerated,
  getLifecycleEntry,
  removeLifecycleEntry,
  calculateLifecycleStats,
  findEntriesByRoom,
  findEntriesNeedingRegeneration,
  findRecentlyModified,
  exportLifecycleDB,
  importLifecycleDB,
  type AudioLifecycleEntry,
  type AudioLifecycleDB,
  type LifecycleStats,
} from './audioLifecycle';

// Phase 4 Types (Audio Generation)
export type {
  AudioChangeSet,
  AudioChange,
  AutopilotStatusStore,
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

// Autopilot Engine (Phase 4.4)
export {
  runAutopilotCycle,
  getAutopilotStatus,
  saveAutopilotStatus,
  generateAutopilotReport,
  generateMarkdownReport,
  type AutopilotConfig,
  type AutopilotResult,
  type AutopilotReport,
} from './audioAutopilot';
