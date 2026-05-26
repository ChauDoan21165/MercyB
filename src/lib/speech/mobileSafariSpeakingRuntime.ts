export const MOBILE_SAFARI_RECORDING_MIME_TYPES = [
  'audio/mp4;codecs=mp4a.40.2',
  'audio/mp4',
  'audio/aac',
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
] as const;

export type MobileAudioFailureCode =
  | 'MIC_PERMISSION_BLOCKED'
  | 'MEDIARECORDER_UNSUPPORTED'
  | 'RECORDING_START_FAILED'
  | 'RECORDING_STOP_FAILED'
  | 'NO_AUDIO_CAPTURED'
  | 'BROWSER_TTS_UNAVAILABLE'
  | 'PLAYBACK_BLOCKED';

export type MobileAudioStatusCode =
  | 'MIC_PERMISSION_REQUESTED'
  | 'MIC_PERMISSION_GRANTED'
  | 'MIME_SELECTED'
  | 'RECORDING_STARTED'
  | 'RECORDING_STOPPED'
  | 'BROWSER_TTS_STARTED'
  | 'CLOUD_TTS_NOT_REQUIRED';

export type BilingualRuntimeMessage = {
  en: string;
  vi: string;
};

export type MediaRecorderConstructor = typeof MediaRecorder;

export type MobileAudioPlaybackPath =
  | 'browser_tts'
  | 'recording_playback'
  | 'cloud_tts'
  | 'not_attempted'
  | 'unknown';

export type MobileAudioSupportSnapshot = ReturnType<typeof getMobileAudioSupportSnapshot>;
export type SanitizedMobileAudioSupportSnapshot = {
  micPermissionRequestAvailable: boolean | 'UNKNOWN';
  mediaRecorderSupported: boolean | 'UNKNOWN';
  selectedMimeType: string;
  browserTtsFallbackAvailable: boolean | 'UNKNOWN';
  cloudTtsRequiredForFirstAudibleOutput: boolean | 'UNKNOWN';
};

export type MobileAudioDiagnosticEvent = {
  order: number;
  failureCode: MobileAudioFailureCode | null;
  runtimeSupport: MobileAudioSupportSnapshot;
  playbackPathUsed: MobileAudioPlaybackPath;
  retryCount: number;
  recordingSucceeded: boolean;
  playbackSucceeded: boolean;
};

export type MobileAudioDiagnosticInput = Omit<MobileAudioDiagnosticEvent, 'order' | 'runtimeSupport'> & {
  runtimeSupport?: MobileAudioSupportSnapshot;
};

export type MobileAudioDiagnosticsExport = {
  schemaVersion: typeof MOBILE_AUDIO_DIAGNOSTICS_SCHEMA_VERSION;
  createdAt: string;
  truncated: boolean;
  readiness: 'readiness_verified' | 'readiness_partial' | 'degraded_runtime' | 'blocked';
  certification: 'certified' | 'conditionally_certified' | 'degraded_mobile_runtime' | 'blocked';
  runtimeSupport: SanitizedMobileAudioSupportSnapshot;
  events: Array<{
    order: number;
    code: string;
    playbackPath: MobileAudioPlaybackPath;
    retryCount: number;
    runtimeSupport: SanitizedMobileAudioSupportSnapshot;
    recordSucceeded: boolean;
    playbackSucceeded: boolean;
  }>;
  summary: {
    eventCount: number;
    failureCount: number;
    recordingSucceededCount: number;
    playbackSucceededCount: number;
    playbackBlockedCount: number;
  };
};

const MOBILE_AUDIO_DIAGNOSTICS_KEY = 'mb.mobileAudioDiagnostics.v1';
const MOBILE_AUDIO_DIAGNOSTICS_LIMIT = 5;
const MOBILE_AUDIO_DIAGNOSTICS_EXPORT_LIMIT_BYTES = 8 * 1024;
const MOBILE_AUDIO_DIAGNOSTICS_SCHEMA_VERSION = 'mb-diagnostics-v1' as const;

export function selectMobileSafariRecordingMimeType(
  mediaRecorderCtor: Pick<MediaRecorderConstructor, 'isTypeSupported'> | undefined,
): string {
  if (!mediaRecorderCtor || typeof mediaRecorderCtor.isTypeSupported !== 'function') return '';
  return MOBILE_SAFARI_RECORDING_MIME_TYPES.find((type) => mediaRecorderCtor.isTypeSupported(type)) || '';
}

export function getMobileAudioSupportSnapshot(
  input: {
    hasGetUserMedia: boolean;
    mediaRecorderCtor?: Pick<MediaRecorderConstructor, 'isTypeSupported'>;
    hasSpeechSynthesis: boolean;
  },
) {
  const mimeType = selectMobileSafariRecordingMimeType(input.mediaRecorderCtor);
  return {
    micPermissionRequestAvailable: input.hasGetUserMedia,
    mediaRecorderSupported: Boolean(input.mediaRecorderCtor),
    selectedMimeType: mimeType || 'browser-default',
    browserTtsFallbackAvailable: input.hasSpeechSynthesis,
    cloudTtsRequiredForFirstAudibleOutput: false,
  };
}

function getCurrentMobileAudioSupportSnapshot(win: Window | undefined = typeof window !== 'undefined' ? window : undefined) {
  const mediaRecorderCtor =
    typeof MediaRecorder !== 'undefined'
      ? MediaRecorder
      : undefined;
  return getMobileAudioSupportSnapshot({
    hasGetUserMedia: Boolean(win?.navigator?.mediaDevices?.getUserMedia),
    mediaRecorderCtor,
    hasSpeechSynthesis: Boolean(win?.speechSynthesis),
  });
}

function isMobileAudioFailureCode(value: unknown): value is MobileAudioFailureCode {
  return value === 'MIC_PERMISSION_BLOCKED'
    || value === 'MEDIARECORDER_UNSUPPORTED'
    || value === 'RECORDING_START_FAILED'
    || value === 'RECORDING_STOP_FAILED'
    || value === 'NO_AUDIO_CAPTURED'
    || value === 'BROWSER_TTS_UNAVAILABLE'
    || value === 'PLAYBACK_BLOCKED';
}

function isPlaybackPath(value: unknown): value is MobileAudioPlaybackPath {
  return value === 'browser_tts'
    || value === 'recording_playback'
    || value === 'cloud_tts'
    || value === 'not_attempted'
    || value === 'unknown';
}

function isSupportSnapshot(value: unknown): value is MobileAudioSupportSnapshot {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.micPermissionRequestAvailable === 'boolean'
    && typeof candidate.mediaRecorderSupported === 'boolean'
    && typeof candidate.selectedMimeType === 'string'
    && typeof candidate.browserTtsFallbackAvailable === 'boolean'
    && typeof candidate.cloudTtsRequiredForFirstAudibleOutput === 'boolean';
}

function isDiagnosticEvent(value: unknown): value is MobileAudioDiagnosticEvent {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.order === 'number'
    && Number.isInteger(candidate.order)
    && candidate.order >= 0
    && (candidate.failureCode === null || isMobileAudioFailureCode(candidate.failureCode))
    && isSupportSnapshot(candidate.runtimeSupport)
    && isPlaybackPath(candidate.playbackPathUsed)
    && typeof candidate.retryCount === 'number'
    && Number.isInteger(candidate.retryCount)
    && candidate.retryCount >= 0
    && typeof candidate.recordingSucceeded === 'boolean'
    && typeof candidate.playbackSucceeded === 'boolean';
}

function readRawDiagnostics(win: Window | undefined): MobileAudioDiagnosticEvent[] {
  try {
    const raw = win?.localStorage?.getItem(MOBILE_AUDIO_DIAGNOSTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      win?.localStorage?.removeItem(MOBILE_AUDIO_DIAGNOSTICS_KEY);
      return [];
    }
    const valid = parsed.filter(isDiagnosticEvent);
    if (valid.length === 0 && parsed.length > 0) {
      win?.localStorage?.removeItem(MOBILE_AUDIO_DIAGNOSTICS_KEY);
      return [];
    }
    if (valid.length !== parsed.length) {
      writeRawDiagnostics(win, valid);
    }
    return valid
      .slice(-MOBILE_AUDIO_DIAGNOSTICS_LIMIT)
      .sort((a, b) => a.order - b.order);
  } catch {
    try {
      win?.localStorage?.removeItem(MOBILE_AUDIO_DIAGNOSTICS_KEY);
    } catch {
      // Ignore storage failures; diagnostics must never break learning.
    }
    return [];
  }
}

function writeRawDiagnostics(win: Window | undefined, events: MobileAudioDiagnosticEvent[]) {
  try {
    win?.localStorage?.setItem(
      MOBILE_AUDIO_DIAGNOSTICS_KEY,
      JSON.stringify(events.slice(-MOBILE_AUDIO_DIAGNOSTICS_LIMIT)),
    );
  } catch {
    // Safari private-mode and quota failures should not block the retest flow.
  }
}

function hasOversizedStoredDiagnostics(win: Window | undefined): boolean {
  try {
    const raw = win?.localStorage?.getItem(MOBILE_AUDIO_DIAGNOSTICS_KEY) ?? '';
    return new TextEncoder().encode(raw).length > MOBILE_AUDIO_DIAGNOSTICS_EXPORT_LIMIT_BYTES;
  } catch {
    return false;
  }
}

function sanitizeSupportSnapshot(snapshot: MobileAudioSupportSnapshot): SanitizedMobileAudioSupportSnapshot {
  const selectedMimeType = snapshot.selectedMimeType === 'browser-default'
    ? 'BROWSER_DEFAULT'
    : snapshot.selectedMimeType.includes('mp4')
      ? 'MP4'
      : snapshot.selectedMimeType.includes('aac')
        ? 'AAC'
        : snapshot.selectedMimeType.includes('webm')
          ? 'WEBM'
          : snapshot.selectedMimeType.includes('ogg')
            ? 'OGG'
            : 'UNKNOWN';
  return {
    micPermissionRequestAvailable: typeof snapshot.micPermissionRequestAvailable === 'boolean' ? snapshot.micPermissionRequestAvailable : 'UNKNOWN',
    mediaRecorderSupported: typeof snapshot.mediaRecorderSupported === 'boolean' ? snapshot.mediaRecorderSupported : 'UNKNOWN',
    selectedMimeType,
    browserTtsFallbackAvailable: typeof snapshot.browserTtsFallbackAvailable === 'boolean' ? snapshot.browserTtsFallbackAvailable : 'UNKNOWN',
    cloudTtsRequiredForFirstAudibleOutput: typeof snapshot.cloudTtsRequiredForFirstAudibleOutput === 'boolean' ? snapshot.cloudTtsRequiredForFirstAudibleOutput : 'UNKNOWN',
  };
}

function sanitizeFailureCode(code: MobileAudioFailureCode | null): string {
  if (code === null) return 'NONE';
  if (code === 'NO_AUDIO_CAPTURED') return 'NO_CAPTURE';
  return code;
}

export function readMobileAudioDiagnostics(win: Window | undefined = typeof window !== 'undefined' ? window : undefined) {
  return readRawDiagnostics(win);
}

export function recordMobileAudioDiagnostic(
  input: MobileAudioDiagnosticInput,
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined,
): MobileAudioDiagnosticEvent {
  const existing = readRawDiagnostics(win);
  const event: MobileAudioDiagnosticEvent = {
    order: (existing[existing.length - 1]?.order ?? 0) + 1,
    failureCode: input.failureCode,
    runtimeSupport: input.runtimeSupport ?? getCurrentMobileAudioSupportSnapshot(win),
    playbackPathUsed: input.playbackPathUsed,
    retryCount: Math.max(0, Math.trunc(input.retryCount)),
    recordingSucceeded: input.recordingSucceeded,
    playbackSucceeded: input.playbackSucceeded,
  };
  writeRawDiagnostics(win, [...existing, event]);
  return event;
}

function readinessFor(support: MobileAudioSupportSnapshot, events: MobileAudioDiagnosticEvent[]) {
  if (events.some((event) => event.failureCode === 'PLAYBACK_BLOCKED')) return 'blocked';
  if (!support.browserTtsFallbackAvailable) return 'degraded_runtime';
  if (!support.micPermissionRequestAvailable || !support.mediaRecorderSupported) return 'readiness_partial';
  return 'readiness_verified';
}

function certificationFor(readiness: ReturnType<typeof readinessFor>) {
  if (readiness === 'readiness_verified') return 'certified';
  if (readiness === 'readiness_partial') return 'conditionally_certified';
  if (readiness === 'blocked') return 'blocked';
  return 'degraded_mobile_runtime';
}

export function buildMobileAudioDiagnosticsExport(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined,
): MobileAudioDiagnosticsExport {
  const runtimeSupport = getCurrentMobileAudioSupportSnapshot(win);
  const storedWasOversized = hasOversizedStoredDiagnostics(win);
  const events = readRawDiagnostics(win);
  const readiness = readinessFor(runtimeSupport, events);
  const exportedEvents = events.map((event, index) => ({
    order: index - events.length + 1,
    code: sanitizeFailureCode(event.failureCode),
    playbackPath: event.playbackPathUsed,
    retryCount: event.retryCount,
    runtimeSupport: sanitizeSupportSnapshot(event.runtimeSupport),
    recordSucceeded: event.recordingSucceeded,
    playbackSucceeded: event.playbackSucceeded,
  }));
  const payload: MobileAudioDiagnosticsExport = {
    schemaVersion: MOBILE_AUDIO_DIAGNOSTICS_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    truncated: storedWasOversized,
    readiness,
    certification: certificationFor(readiness),
    runtimeSupport: sanitizeSupportSnapshot(runtimeSupport),
    events: exportedEvents,
    summary: {
      eventCount: exportedEvents.length,
      failureCount: events.filter((event) => event.failureCode !== null).length,
      recordingSucceededCount: events.filter((event) => event.recordingSucceeded).length,
      playbackSucceededCount: events.filter((event) => event.playbackSucceeded).length,
      playbackBlockedCount: events.filter((event) => event.failureCode === 'PLAYBACK_BLOCKED').length,
    },
  };
  if (new TextEncoder().encode(JSON.stringify(payload)).length <= MOBILE_AUDIO_DIAGNOSTICS_EXPORT_LIMIT_BYTES) {
    return payload;
  }
  return {
    ...payload,
    truncated: true,
    events: payload.events.slice(-1),
    summary: {
      ...payload.summary,
      eventCount: 1,
    },
  };
}

export async function copyMobileAudioDiagnosticsToClipboard(
  win: Window | undefined = typeof window !== 'undefined' ? window : undefined,
) {
  const payload = buildMobileAudioDiagnosticsExport(win);
  let text = JSON.stringify(payload);
  if (new TextEncoder().encode(text).length > MOBILE_AUDIO_DIAGNOSTICS_EXPORT_LIMIT_BYTES) {
    const compactPayload: MobileAudioDiagnosticsExport = {
      ...payload,
      truncated: true,
      events: [],
      summary: {
        ...payload.summary,
        eventCount: 0,
      },
    };
    text = JSON.stringify(compactPayload);
  }
  try {
    if (typeof win?.navigator?.clipboard?.writeText !== 'function') {
      throw new Error('clipboard_unavailable');
    }
    await win.navigator.clipboard.writeText(text);
    return { ok: true, payload };
  } catch {
    return { ok: false, payload };
  }
}

export function getMobileAudioFailureMessage(code: MobileAudioFailureCode): BilingualRuntimeMessage {
  switch (code) {
    case 'MIC_PERMISSION_BLOCKED':
      return {
        en: 'Microphone access was blocked or unavailable. Allow the microphone in Safari settings, then try again.',
        vi: 'Micro bị chặn hoặc chưa sẵn sàng. Hãy cho phép micro trong cài đặt Safari rồi thử lại.',
      };
    case 'MEDIARECORDER_UNSUPPORTED':
      return {
        en: 'This browser cannot record audio in this page.',
        vi: 'Trình duyệt này không thể ghi âm trong trang này.',
      };
    case 'RECORDING_START_FAILED':
      return {
        en: 'Recording could not start. Close other audio apps and try again.',
        vi: 'Không bắt đầu ghi âm được. Hãy đóng ứng dụng âm thanh khác rồi thử lại.',
      };
    case 'RECORDING_STOP_FAILED':
      return {
        en: 'Recording could not stop cleanly. Refresh and try one more time.',
        vi: 'Không dừng ghi âm gọn được. Hãy tải lại trang rồi thử thêm một lần.',
      };
    case 'NO_AUDIO_CAPTURED':
      return {
        en: 'No recording was captured. Speak after the recording indicator appears.',
        vi: 'Chưa ghi được âm thanh. Hãy nói sau khi thấy trạng thái đang ghi.',
      };
    case 'BROWSER_TTS_UNAVAILABLE':
      return {
        en: 'Browser voice playback is unavailable here.',
        vi: 'Trình duyệt chưa hỗ trợ phát giọng nói ở đây.',
      };
    case 'PLAYBACK_BLOCKED':
      return {
        en: 'Playback was blocked. Tap Teacher Mercy again to start audio.',
        vi: 'Âm thanh bị chặn. Hãy chạm Teacher Mercy lần nữa để phát.',
      };
  }
}

export function formatMobileAudioFailure(code: MobileAudioFailureCode): string {
  const message = getMobileAudioFailureMessage(code);
  return `${message.en} ${message.vi} [${code}]`;
}

export function buildMobileAudioRetestChecklist(): string[] {
  return [
    'Open the dev URL with ?mobileAudioRetest=1 on the iPhone.',
    'Tap Request mic and confirm Safari asks for microphone permission.',
    'Tap Start retest recording, speak one short sentence, then tap Stop.',
    'Tap Play recording and confirm the captured voice is audible.',
    'Tap Teacher Mercy and confirm browser TTS speaks before any cloud TTS is needed.',
    'If a visible bilingual error appears, report its bracketed failure code.',
  ];
}
