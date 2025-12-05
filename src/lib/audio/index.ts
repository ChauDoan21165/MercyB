/**
 * Audio utilities barrel export
 * Chief Automation Engineer: Audio System v2.0 - Phase 2 Complete
 */
export * from './filenameValidator';
export * from './autoRepair';
export { 
  validateAudioFilename,
  validateWithRoomContext,
  generateCanonicalFilename,
  normalizeFilename,
  extractLanguage,
  detectDuplicates,
  batchValidate,
} from './filenameValidator';
export {
  analyzeAndRepair,
  generateRepairBatch,
  validateWithRoomContext as validateRoomAudio,
  generateJsonUpdateOperations,
  detectOrphans,
  generateOrphanCleanupOps,
} from './autoRepair';
export * from './filenameValidator';
