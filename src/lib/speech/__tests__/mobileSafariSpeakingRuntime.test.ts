import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildMobileAudioDiagnosticsExport,
  buildMobileAudioRetestChecklist,
  copyMobileAudioDiagnosticsToClipboard,
  formatMobileAudioFailure,
  getMobileAudioSupportSnapshot,
  readMobileAudioDiagnostics,
  recordMobileAudioDiagnostic,
  selectMobileSafariRecordingMimeType,
} from '../mobileSafariSpeakingRuntime';

function mediaRecorderSupporting(types: string[]) {
  return {
    isTypeSupported: (type: string) => types.includes(type),
  };
}

const DIAGNOSTICS_KEY = 'mb.mobileAudioDiagnostics.v1';
const TOP_LEVEL_KEYS = [
  'schemaVersion',
  'createdAt',
  'truncated',
  'readiness',
  'certification',
  'runtimeSupport',
  'events',
  'summary',
];
const EVENT_KEYS = [
  'order',
  'code',
  'playbackPath',
  'retryCount',
  'runtimeSupport',
  'recordSucceeded',
  'playbackSucceeded',
];
const UNSAFE_EXPORT_PATTERN = /audio|blob|transcript|utterance|learner|student|userId|learnerId|deviceId|sessionId|token|secret|authorization|cookie|localStorage|navigator|userAgent/i;

function storedEvent(overrides: Record<string, unknown> = {}) {
  return {
    order: 1,
    failureCode: null,
    runtimeSupport: {
      micPermissionRequestAvailable: true,
      mediaRecorderSupported: true,
      selectedMimeType: 'audio/mp4',
      browserTtsFallbackAvailable: true,
      cloudTtsRequiredForFirstAudibleOutput: false,
    },
    playbackPathUsed: 'browser_tts',
    retryCount: 0,
    recordingSucceeded: false,
    playbackSucceeded: true,
    ...overrides,
  };
}

function normalizeCreatedAt(value: unknown) {
  return JSON.stringify({
    ...(value as Record<string, unknown>),
    createdAt: '<normalized>',
  });
}

function expectBoundedSafeJson(text: string, truncated?: boolean) {
  const parsed = JSON.parse(text);
  expect(new TextEncoder().encode(text).length).toBeLessThanOrEqual(8 * 1024);
  expect(Object.keys(parsed)).toEqual(TOP_LEVEL_KEYS);
  expect(parsed.truncated).toBe(truncated ?? parsed.truncated);
  expect(text.replace(/"schemaVersion":"[^"]+"/, '"schemaVersion":"<schema>"')).not.toMatch(UNSAFE_EXPORT_PATTERN);
  return parsed;
}

function copiedClipboardText(writeText: ReturnType<typeof vi.fn>): string {
  const firstCall = writeText.mock.calls[0] as unknown[] | undefined;
  const text = firstCall?.[0];
  expect(typeof text).toBe('string');
  return text as string;
}

function throwingStorage(overrides: Partial<Storage> = {}): Storage {
  return {
    length: 0,
    clear: vi.fn(),
    getItem: vi.fn(() => null),
    key: vi.fn(() => null),
    removeItem: vi.fn(),
    setItem: vi.fn(),
    ...overrides,
  } as Storage;
}

describe('mobileSafariSpeakingRuntime', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('chooses the iOS-friendly mp4/aac MIME before webm', () => {
    const selected = selectMobileSafariRecordingMimeType(
      mediaRecorderSupporting(['audio/webm;codecs=opus', 'audio/mp4']),
    );

    expect(selected).toBe('audio/mp4');
  });

  it('falls back to browser-default MIME when support probing is unavailable', () => {
    expect(selectMobileSafariRecordingMimeType(undefined)).toBe('');
    expect(
      getMobileAudioSupportSnapshot({
        hasGetUserMedia: true,
        mediaRecorderCtor: undefined,
        hasSpeechSynthesis: true,
      }).selectedMimeType,
    ).toBe('browser-default');
  });

  it('marks cloud TTS as not required for first audible browser output', () => {
    const snapshot = getMobileAudioSupportSnapshot({
      hasGetUserMedia: true,
      mediaRecorderCtor: mediaRecorderSupporting(['audio/mp4']),
      hasSpeechSynthesis: true,
    });

    expect(snapshot).toMatchObject({
      micPermissionRequestAvailable: true,
      mediaRecorderSupported: true,
      selectedMimeType: 'audio/mp4',
      browserTtsFallbackAvailable: true,
      cloudTtsRequiredForFirstAudibleOutput: false,
    });
  });

  it('returns visible bilingual blocked-permission errors with reportable codes', () => {
    const message = formatMobileAudioFailure('MIC_PERMISSION_BLOCKED');

    expect(message).toContain('Microphone access was blocked');
    expect(message).toContain('Micro bị chặn');
    expect(message).toContain('[MIC_PERMISSION_BLOCKED]');
  });

  it('provides the exact iPhone manual retest checklist shape', () => {
    const checklist = buildMobileAudioRetestChecklist();

    expect(checklist).toHaveLength(6);
    expect(checklist[0]).toContain('?mobileAudioRetest=1');
    expect(checklist.join('\n')).toContain('Tap Teacher Mercy');
    expect(checklist.join('\n')).toContain('failure code');
  });

  it('keeps only the last 5 mobile audio diagnostics events', () => {
    for (let index = 0; index < 6; index += 1) {
      recordMobileAudioDiagnostic({
        failureCode: null,
        playbackPathUsed: index % 2 === 0 ? 'browser_tts' : 'recording_playback',
        retryCount: index,
        recordingSucceeded: index >= 2,
        playbackSucceeded: true,
      });
    }

    const diagnostics = readMobileAudioDiagnostics();
    const exported = buildMobileAudioDiagnosticsExport();

    expect(diagnostics).toHaveLength(5);
    expect(diagnostics.map((event) => event.order)).toEqual([2, 3, 4, 5, 6]);
    expect(exported.events.map((event) => event.order)).toEqual([-4, -3, -2, -1, 0]);
  });

  it('appends newest mobile audio diagnostic event last', () => {
    recordMobileAudioDiagnostic({
      failureCode: null,
      playbackPathUsed: 'browser_tts',
      retryCount: 0,
      recordingSucceeded: false,
      playbackSucceeded: true,
    });
    recordMobileAudioDiagnostic({
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'recording_playback',
      retryCount: 1,
      recordingSucceeded: true,
      playbackSucceeded: false,
    });

    const diagnostics = readMobileAudioDiagnostics();
    expect(diagnostics.at(-1)).toMatchObject({
      order: 2,
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'recording_playback',
    });
  });

  it('exports only the deterministic top-level schema keys in order', () => {
    const exported = buildMobileAudioDiagnosticsExport();

    expect(Object.keys(exported)).toEqual([
      ...TOP_LEVEL_KEYS,
    ]);
    expect(exported.schemaVersion).toBe('mb-diagnostics-v1');
    expect(new Date(exported.createdAt).toISOString()).toBe(exported.createdAt);
  });

  it('rejects malformed stored diagnostics instead of merging them', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([{ order: 'newer', rawDeviceId: 'iphone-123' }]));

    expect(readMobileAudioDiagnostics()).toEqual([]);
    expect(window.localStorage.getItem(DIAGNOSTICS_KEY)).toBeNull();
  });

  it('exports deterministic ordering and no raw audio, learner text, identifiers, tokens, or secrets', () => {
    recordMobileAudioDiagnostic({
      failureCode: null,
      playbackPathUsed: 'browser_tts',
      retryCount: 0,
      recordingSucceeded: false,
      playbackSucceeded: true,
    });
    recordMobileAudioDiagnostic({
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'browser_tts',
      retryCount: 1,
      recordingSucceeded: false,
      playbackSucceeded: false,
    });

    const exported = buildMobileAudioDiagnosticsExport();
    const serialized = JSON.stringify(exported);

    expect(exported.events.map((event) => event.order)).toEqual([-1, 0]);
    expect(serialized).toContain('PLAYBACK_BLOCKED');
    expect(serialized.replace(/"schemaVersion":"[^"]+"/, '"schemaVersion":"<schema>"')).not.toMatch(UNSAFE_EXPORT_PATTERN);
  });

  it('exports event fields with relative order and no event timestamps', () => {
    recordMobileAudioDiagnostic({
      failureCode: 'NO_AUDIO_CAPTURED',
      playbackPathUsed: 'recording_playback',
      retryCount: 1,
      recordingSucceeded: false,
      playbackSucceeded: false,
    });

    const exported = buildMobileAudioDiagnosticsExport();
    expect(Object.keys(exported.events[0])).toEqual([
      ...EVENT_KEYS,
    ]);
    expect(exported.events[0]).toMatchObject({
      order: 0,
      code: 'NO_CAPTURE',
      playbackPath: 'recording_playback',
      recordSucceeded: false,
    });
    expect(Object.keys(exported.events[0])).not.toContain('atIso');
    expect(Object.keys(exported.events[0])).not.toContain('createdAt');
    expect(Object.keys(exported.events[0])).not.toContain('timestamp');
  });

  it('serializes unsupported runtime fields as UNKNOWN instead of raw browser details', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([
      storedEvent({
        runtimeSupport: {
          micPermissionRequestAvailable: true,
          mediaRecorderSupported: true,
          selectedMimeType: `audio/x-private-${'fingerprint'.repeat(8)}`,
          browserTtsFallbackAvailable: true,
          cloudTtsRequiredForFirstAudibleOutput: false,
        },
      }),
    ]));

    const exported = buildMobileAudioDiagnosticsExport();
    const serialized = JSON.stringify(exported);
    expect(exported.events[0].runtimeSupport.selectedMimeType).toBe('UNKNOWN');
    expect(serialized).not.toContain('audio/x-private');
    expect(serialized).not.toContain('fingerprint');
  });

  it('keeps normal copied diagnostics under 8 KB', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    recordMobileAudioDiagnostic({
      failureCode: null,
      playbackPathUsed: 'browser_tts',
      retryCount: 0,
      recordingSucceeded: false,
      playbackSucceeded: true,
    });

    await copyMobileAudioDiagnosticsToClipboard();

    const copiedText = copiedClipboardText(writeText);
    expect(new TextEncoder().encode(copiedText).length).toBeLessThanOrEqual(8 * 1024);
    expectBoundedSafeJson(copiedText, false);
  });

  it('keeps oversized stored event inputs under 8 KB with truncated valid JSON', async () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([
      storedEvent({
        runtimeSupport: {
          micPermissionRequestAvailable: true,
          mediaRecorderSupported: true,
          selectedMimeType: `audio/mp4-${'x'.repeat(12_000)}`,
          browserTtsFallbackAvailable: false,
          cloudTtsRequiredForFirstAudibleOutput: false,
        },
      }),
    ]));
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    await copyMobileAudioDiagnosticsToClipboard();

    const copiedText = copiedClipboardText(writeText);
    const copied = expectBoundedSafeJson(copiedText, true);
    expect(copied.truncated).toBe(true);
    expect(copied.events).toHaveLength(1);
    expect(JSON.stringify(copied)).not.toMatch(/x{20}/i);
  });

  it('copies compact mobile audio diagnostics to the clipboard', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    recordMobileAudioDiagnostic({
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'recording_playback',
      retryCount: 2,
      recordingSucceeded: true,
      playbackSucceeded: false,
    });

    const result = await copyMobileAudioDiagnosticsToClipboard();

    expect(result.ok).toBe(true);
    expect(writeText).toHaveBeenCalledTimes(1);
    const copied = JSON.parse(copiedClipboardText(writeText));
    expect(copied.schemaVersion).toBe('mb-diagnostics-v1');
    expect(copied.events[0]).toMatchObject({
      code: 'PLAYBACK_BLOCKED',
      playbackPath: 'recording_playback',
      retryCount: 2,
      playbackSucceeded: false,
    });
  });

  it('reports clipboard write failures without throwing', async () => {
    const writeText = vi.fn(async () => {
      throw new Error('blocked');
    });
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const result = await copyMobileAudioDiagnosticsToClipboard();

    expect(result.ok).toBe(false);
    expect(result.payload.schemaVersion).toBe('mb-diagnostics-v1');
  });

  it('locks copied JSON top-level key order exactly', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

    await copyMobileAudioDiagnosticsToClipboard();

    expect(Object.keys(JSON.parse(copiedClipboardText(writeText)))).toEqual(TOP_LEVEL_KEYS);
  });

  it('locks copied event key order exactly with no additional keys', async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });
    recordMobileAudioDiagnostic({
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'browser_tts',
      retryCount: 1,
      recordingSucceeded: false,
      playbackSucceeded: false,
    });

    await copyMobileAudioDiagnosticsToClipboard();

    expect(Object.keys(JSON.parse(copiedClipboardText(writeText)).events[0])).toEqual(EVENT_KEYS);
  });

  it('exports byte-identically for same diagnostics after normalizing createdAt', () => {
    recordMobileAudioDiagnostic({
      failureCode: 'PLAYBACK_BLOCKED',
      playbackPathUsed: 'browser_tts',
      retryCount: 1,
      recordingSucceeded: false,
      playbackSucceeded: false,
    });

    expect(normalizeCreatedAt(buildMobileAudioDiagnosticsExport())).toBe(normalizeCreatedAt(buildMobileAudioDiagnosticsExport()));
  });

  it('exports valid empty events when no diagnostics are stored', () => {
    const exported = buildMobileAudioDiagnosticsExport();

    expect(exported.events).toEqual([]);
    expect(exported.summary).toMatchObject({ eventCount: 0, failureCount: 0 });
  });

  it('retains exactly 5 stored events', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(Array.from({ length: 5 }, (_, index) => storedEvent({ order: index + 1 }))));

    const exported = buildMobileAudioDiagnosticsExport();

    expect(exported.events).toHaveLength(5);
    expect(exported.events.map((event) => event.order)).toEqual([-4, -3, -2, -1, 0]);
  });

  it('drops the oldest event when 6 stored events exist', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(Array.from({ length: 6 }, (_, index) => storedEvent({ order: index + 1 }))));

    expect(readMobileAudioDiagnostics().map((event) => event.order)).toEqual([2, 3, 4, 5, 6]);
  });

  it('keeps newest 5 events when 20 stored events exist', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(Array.from({ length: 20 }, (_, index) => storedEvent({ order: index + 1 }))));

    expect(readMobileAudioDiagnostics().map((event) => event.order)).toEqual([16, 17, 18, 19, 20]);
  });

  it('clears malformed stored JSON', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, '{not-json');

    expect(buildMobileAudioDiagnosticsExport().events).toEqual([]);
    expect(window.localStorage.getItem(DIAGNOSTICS_KEY)).toBeNull();
  });

  it('clears a stored non-array object', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify({ event: storedEvent() }));

    expect(readMobileAudioDiagnostics()).toEqual([]);
    expect(window.localStorage.getItem(DIAGNOSTICS_KEY)).toBeNull();
  });

  it('drops malformed events from a stored array while retaining valid events', () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([storedEvent({ order: 1 }), { order: 'bad' }, storedEvent({ order: 2 })]));

    expect(readMobileAudioDiagnostics().map((event) => event.order)).toEqual([1, 2]);
  });

  it('does not crash when storage quota prevents writes', () => {
    const win = { localStorage: throwingStorage({ setItem: vi.fn(() => { throw new Error('quota'); }) }) } as unknown as Window;

    expect(() => recordMobileAudioDiagnostic({
      failureCode: null,
      playbackPathUsed: 'browser_tts',
      retryCount: 0,
      recordingSucceeded: false,
      playbackSucceeded: true,
    }, win)).not.toThrow();
  });

  it('does not crash when storage read fails during export', () => {
    const win = { localStorage: throwingStorage({ getItem: vi.fn(() => { throw new Error('read'); }) }) } as unknown as Window;

    expect(buildMobileAudioDiagnosticsExport(win).events).toEqual([]);
  });

  it('does not export browser fingerprint fields from navigator-like globals', () => {
    Object.defineProperty(window.navigator, 'userAgent', { configurable: true, value: 'SecretBrowser/17.4 iPhone OS 17_4' });
    Object.defineProperty(window.navigator, 'platform', { configurable: true, value: 'iPhone' });
    Object.defineProperty(window.navigator, 'hardwareConcurrency', { configurable: true, value: 8 });
    Object.defineProperty(window.navigator, 'language', { configurable: true, value: 'vi-VN' });
    Object.defineProperty(window.navigator, 'languages', { configurable: true, value: ['vi-VN', 'en-US'] });

    const serialized = JSON.stringify(buildMobileAudioDiagnosticsExport());

    expect(serialized.replace(/"schemaVersion":"[^"]+"/, '"schemaVersion":"<schema>"')).not.toMatch(/SecretBrowser|iPhone OS|platform|hardwareConcurrency|language|languages|navigator|userAgent|screen|17_4/i);
  });

  it('uses UNKNOWN for unsupported current runtime support strings', () => {
    class WeirdRecorder {
      static isTypeSupported() {
        return false;
      }
    }
    Object.defineProperty(globalThis, 'MediaRecorder', { configurable: true, value: WeirdRecorder });

    expect(buildMobileAudioDiagnosticsExport().runtimeSupport.selectedMimeType).toBe('BROWSER_DEFAULT');
  });

  it('keeps oversized invalid event codes under 8 KB and safe', async () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([storedEvent({ failureCode: 'X'.repeat(12_000) })]));
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

    await copyMobileAudioDiagnosticsToClipboard();

    const copied = expectBoundedSafeJson(copiedClipboardText(writeText), true);
    expect(copied.events).toEqual([]);
  });

  it('keeps oversized runtime support objects under 8 KB and safe', async () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify([storedEvent({ runtimeSupport: { micPermissionRequestAvailable: true, mediaRecorderSupported: true, selectedMimeType: 'private/'.concat('x'.repeat(20_000)), browserTtsFallbackAvailable: true, cloudTtsRequiredForFirstAudibleOutput: false } })]));
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

    await copyMobileAudioDiagnosticsToClipboard();

    expectBoundedSafeJson(copiedClipboardText(writeText), true);
  });

  it('keeps oversized summary-affecting stored inputs under 8 KB and safe', async () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(Array.from({ length: 300 }, (_, index) => storedEvent({ order: index + 1, failureCode: 'PLAYBACK_BLOCKED' }))));
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

    await copyMobileAudioDiagnosticsToClipboard();

    expectBoundedSafeJson(copiedClipboardText(writeText), true);
  });

  it('keeps many events with oversized strings under 8 KB and safe', async () => {
    window.localStorage.setItem(DIAGNOSTICS_KEY, JSON.stringify(Array.from({ length: 20 }, (_, index) => storedEvent({ order: index + 1, runtimeSupport: { micPermissionRequestAvailable: true, mediaRecorderSupported: true, selectedMimeType: `secret-${index}-${'y'.repeat(2000)}`, browserTtsFallbackAvailable: true, cloudTtsRequiredForFirstAudibleOutput: false } }))));
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText } });

    await copyMobileAudioDiagnosticsToClipboard();

    const copied = expectBoundedSafeJson(copiedClipboardText(writeText), true);
    expect(copied.events.length).toBeLessThanOrEqual(5);
  });
});
