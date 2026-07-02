/**
 * Hardening tests for src/components/MercyGuide.tsx
 *
 * MercyGuide only exports the `MercyGuide` component (named + default). All of
 * its decision logic (kids/adult detection, panel preset wiring, persisted
 * geometry, drag-to-open, profile hydration, teacher-writing flow) lives in
 * module-private helpers, so this suite drives that logic through the rendered
 * component with every runtime dependency mocked.
 *
 * The heavy lazy panel is replaced by a capture component that records the
 * props it last received into `mockH.panelState.last`, letting us assert the
 * exact wiring the parent hands down without loading the real panel chunk.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Hoisted, mutable mock state (vi.hoisted runs before imports so these are
// safe to reference inside the hoisted vi.mock factories below).
// ---------------------------------------------------------------------------
const mockH = vi.hoisted(() => {
  const panelState: { last: unknown; renderCount: number } = {
    last: null,
    renderCount: 0,
  };
  const MockMercyPanel = (props: unknown) => {
    panelState.last = props;
    panelState.renderCount += 1;
    return null;
  };

  return {
    guideState: { isEnabled: true } as { isEnabled: boolean },
    authState: { user: null as null | { id: string } },
    profileState: { data: null as unknown },
    memory: {
      pronunciation: { troubleWords: ['through', 'world'] },
      writing: {} as Record<string, unknown>,
    },
    panelState,
    MockMercyPanel,
    loadPoints: vi.fn(() => Promise.resolve()),
    breadcrumb: vi.fn(),
    updateMemory: vi.fn(),
    analyze: vi.fn(() =>
      Promise.resolve({
        correctedText: 'Corrected.',
        enhancedText: 'Enhanced.',
        writingMode: 'guided',
      }),
    ),
  };
});

// ---------------------------------------------------------------------------
// Module mocks. Alias paths (@/) + paths relative to THIS test file
// (../mercy-guide/...) which resolve to the same modules the component imports.
// ---------------------------------------------------------------------------
vi.mock('@/hooks/useMercyGuide', () => ({
  useMercyGuide: () => mockH.guideState,
}));

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => mockH.authState,
}));

vi.mock('@/lib/queries/useProfileQuery', () => ({
  useProfileQuery: () => mockH.profileState,
}));

vi.mock('@/services/pointsService', () => ({
  getTotalPoints: () => 0,
  getStreakDays: () => 0,
  getStreakEmoji: () => '🔥',
  getPointsDisplay: () => '0',
  loadPointsFromSupabase: mockH.loadPoints,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('@/lib/monitoring/breadcrumbs', () => ({
  breadcrumbMercyPanel: mockH.breadcrumb,
}));

vi.mock('@/lib/lazyWithRetry', () => ({
  // Bypass React.lazy / dynamic import entirely: hand back a synchronous
  // capture component so the Suspense boundary resolves immediately.
  lazyWithRetry: () => mockH.MockMercyPanel,
}));

vi.mock('../mercy-guide/hooks/useMercyMemory', () => ({
  default: () => ({
    memory: mockH.memory,
    teacherSummary: 'You practiced past tense.',
    updateMemory: mockH.updateMemory,
  }),
}));

vi.mock('../mercy-guide/tabs/grammar-writing/api', () => ({
  analyzeGrammarWithApi: mockH.analyze,
}));

vi.mock('../mercy-guide/mercyGuide.constants', () => ({
  BUBBLE_POSITION_STORAGE_KEY: 'mercy.bubble.pos',
  BUBBLE_SAFE_MARGIN: 16,
  BUBBLE_SIZE: 80,
  DEFAULT_BUBBLE_BOTTOM: 24,
  DEFAULT_BUBBLE_RIGHT: 16,
  DEFAULT_PANEL_BOTTOM: 24,
  DEFAULT_PANEL_HEIGHT_RATIO: 0.7,
  DEFAULT_PANEL_RIGHT: 24,
  MIN_PANEL_HEIGHT: 360,
  MIN_PANEL_MARGIN: 12,
  MIN_PANEL_WIDTH: 320,
  MOBILE_PANEL_BOTTOM_SAFE: 80,
  MUSIC_BAR_SAFE_HEIGHT: 64,
  PANEL_SIZE_STORAGE_KEY_DESKTOP: 'mercy.panel.desktop',
  PANEL_SIZE_STORAGE_KEY_MOBILE: 'mercy.panel.mobile',
  SIZE_PRESETS: {
    small: { width: 320, height: 360 },
    medium: { width: 380, height: 480 },
    large: { width: 480, height: 640 },
  },
}));

vi.mock('../mercy-guide/mercyGuide.utils', () => ({
  getPanelWidthPolicy: () => ({ minWidth: 320, defaultWidth: 380, maxWidth: 560 }),
  getPanelHeightPolicy: () => ({ minHeight: 360, maxHeight: 900 }),
}));

vi.mock('../mercy-guide/shared', () => ({
  MERCY_HOST_IMAGE_AVIF: 'https://cdn.test/mercy.avif',
  MERCY_HOST_IMAGE_WEBP: 'https://cdn.test/mercy.webp',
  MERCY_HOST_IMAGE_SRC: 'https://cdn.test/mercy.png',
  MERCY_HOST_IMAGE_FALLBACK: 'https://cdn.test/mercy-fallback.png',
}));

// Import AFTER mocks are registered.
import { MercyGuide, default as MercyGuideDefault } from '../MercyGuide';

// ---------------------------------------------------------------------------
// Minimal PointerEvent polyfill for jsdom so fireEvent.pointerDown works.
// ---------------------------------------------------------------------------
class FakePointerEvent extends Event {
  clientX: number;
  clientY: number;
  pointerId: number;
  button: number;
  constructor(type: string, props: unknown = {}) {
    super(type, props);
    this.clientX = props.clientX ?? 0;
    this.clientY = props.clientY ?? 0;
    this.pointerId = props.pointerId ?? 1;
    this.button = props.button ?? 0;
  }
}
if (typeof (globalThis as unknown).PointerEvent === 'undefined') {
  (globalThis as unknown).PointerEvent = FakePointerEvent as unknown;
  (window as unknown).PointerEvent = FakePointerEvent as unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  });
}

function renderGuide(props: Record<string, unknown> = {}) {
  return render(
    <MercyGuide
      roomId="room1"
      roomTitle="Daily Life"
      tier="A1"
      {...(props as unknown)}
    />,
  );
}

const panel = () => mockH.panelState.last;

function getBubble() {
  return screen.queryByRole('button', {
    name: /Open (Mercy Guide|Teacher Mercy for kids)/i,
  });
}

beforeEach(() => {
  mockH.guideState.isEnabled = true;
  mockH.authState.user = null;
  mockH.profileState.data = null;
  mockH.memory.writing = {};
  mockH.panelState.last = null;
  mockH.panelState.renderCount = 0;
  mockH.loadPoints.mockClear();
  mockH.breadcrumb.mockClear();
  mockH.updateMemory.mockClear();
  mockH.analyze.mockClear();
  window.localStorage.clear();
  setViewport(1024, 768);
});

afterEach(() => {
  cleanup();
});

// ===========================================================================
describe('MercyGuide — exports & enablement gate', () => {
  it('exposes the same component as named and default export', () => {
    expect(MercyGuide).toBe(MercyGuideDefault);
    expect(typeof MercyGuide).toBe('function');
  });

  it('renders nothing when the guide is disabled', () => {
    mockH.guideState.isEnabled = false;
    const { container } = renderGuide();
    expect(container.firstChild).toBeNull();
    expect(getBubble()).toBeNull();
    expect(panel()).toBeNull();
  });

  it('renders the floating bubble (closed) when enabled', () => {
    renderGuide();
    expect(getBubble()).not.toBeNull();
    // Panel is lazy + gated behind isOpen, so it must not render yet.
    expect(panel()).toBeNull();
  });

  it('still runs the points-load effect even when disabled', () => {
    mockH.guideState.isEnabled = false;
    renderGuide();
    expect(mockH.loadPoints).toHaveBeenCalledTimes(1);
  });
});

// ===========================================================================
describe('MercyGuide — kids vs adult detection (deriveTeacherMode)', () => {
  it('treats a plain room as adult: standard aria-label, no "Kids" subtitle', () => {
    renderGuide({ roomId: 'grammar-basics', roomTitle: 'Daily Life' });
    expect(
      screen.getByRole('button', { name: 'Open Mercy Guide' }),
    ).toBeTruthy();
    expect(screen.queryByText('Kids')).toBeNull();
    expect(screen.getByText('Teacher Mercy')).toBeTruthy();
  });

  it('detects kids mode from the roomId token', () => {
    renderGuide({ roomId: 'kids_l1', roomTitle: 'Animals' });
    expect(
      screen.getByRole('button', { name: 'Open Teacher Mercy for kids' }),
    ).toBeTruthy();
    expect(screen.getByText('Kids')).toBeTruthy();
  });

  it('detects kids mode from a tag', () => {
    renderGuide({ roomId: 'r', roomTitle: 'Songs', tags: ['toddler'] });
    expect(screen.getByText('Kids')).toBeTruthy();
  });

  it('detects kids mode from contentEn keywords', () => {
    renderGuide({
      roomId: 'r',
      roomTitle: 'Story',
      contentEn: 'A gentle story for children at bedtime',
    });
    expect(screen.getByText('Kids')).toBeTruthy();
  });

  it('detects kids mode from a kid-flavoured room title', () => {
    renderGuide({ roomId: 'r', roomTitle: 'Kids Level 1' });
    expect(
      screen.getByRole('button', { name: 'Open Teacher Mercy for kids' }),
    ).toBeTruthy();
  });
});

// ===========================================================================
describe('MercyGuide — bubble label visibility (mobile reading)', () => {
  it('hides the bubble label while reading a room on a mobile viewport', () => {
    setViewport(500, 800);
    renderGuide({
      roomId: 'r',
      roomTitle: 'Daily Life',
      contentEn: 'This is a long readable reading passage for the room.',
    });
    // aria-label still present (button is reachable) but the visible label is gone.
    expect(getBubble()).not.toBeNull();
    expect(screen.queryByText('Teacher Mercy')).toBeNull();
  });

  it('keeps the label when content is only empty HTML (not readable)', () => {
    setViewport(500, 800);
    renderGuide({
      roomId: 'r',
      roomTitle: 'Daily Life',
      contentEn: '<p>   </p>',
    });
    expect(screen.getByText('Teacher Mercy')).toBeTruthy();
  });

  it('keeps the label on a desktop viewport even while reading', () => {
    setViewport(1280, 900);
    renderGuide({
      roomId: 'r',
      roomTitle: 'Daily Life',
      contentEn: 'A long readable passage that would hide the label on mobile.',
    });
    expect(screen.getByText('Teacher Mercy')).toBeTruthy();
  });
});

// ===========================================================================
describe('MercyGuide — opening the panel', () => {
  it('opens on Enter and records an open breadcrumb is not fired for keyboard', () => {
    renderGuide();
    const bubble = getBubble()!;
    act(() => {
      fireEvent.keyDown(bubble, { key: 'Enter' });
    });
    expect(getBubble()).toBeNull(); // bubble hidden once open
    expect(panel()).not.toBeNull();
  });

  it('opens on Space', () => {
    renderGuide();
    const bubble = getBubble()!;
    act(() => {
      fireEvent.keyDown(bubble, { key: ' ' });
    });
    expect(panel()).not.toBeNull();
  });

  it('ignores irrelevant keys', () => {
    renderGuide();
    const bubble = getBubble()!;
    act(() => {
      fireEvent.keyDown(bubble, { key: 'a' });
    });
    expect(getBubble()).not.toBeNull();
    expect(panel()).toBeNull();
  });

  it('opens via pointer tap (no drag) with a bubble-source breadcrumb', () => {
    renderGuide();
    const bubble = getBubble()!;
    act(() => {
      fireEvent.pointerDown(bubble, { clientX: 10, clientY: 10, pointerId: 1 });
    });
    act(() => {
      window.dispatchEvent(new Event('pointerup'));
    });
    expect(panel()).not.toBeNull();
    expect(mockH.breadcrumb).toHaveBeenCalledWith('open', { source: 'bubble' });
  });

  it('opens (and selects initialTab) when openRequestId is provided', async () => {
    renderGuide({ openRequestId: 7, initialTab: 'grammar' });
    await act(async () => {});
    expect(panel()).not.toBeNull();
    expect(panel().activeTab).toBe('grammar');
  });
});

// ===========================================================================
describe('MercyGuide — panel prop wiring (adult preset)', () => {
  function openAdult(extra: Record<string, unknown> = {}) {
    renderGuide(extra);
    act(() => {
      fireEvent.keyDown(getBubble()!, { key: 'Enter' });
    });
  }

  it('passes the full adult tab set and non-kids flags', () => {
    openAdult();
    const p = panel();
    expect(p.isKidsMode).toBe(false);
    expect(p.teacherMode).toBe('adult');
    expect(p.availableTabs).toEqual(['teacher', 'grammar', 'pronunciation', 'logic']);
    expect(p.hideGrammarTab).toBe(false);
    expect(p.hideLogicTab).toBe(false);
    expect(p.disableTeacherWriting).toBe(false);
    expect(p.panelTitle).toBe('Teacher Mercy');
    expect(p.activeTab).toBe('teacher');
  });

  it('reflects hasEnglishContext from contentEn', () => {
    openAdult({ contentEn: 'Hello world content.' });
    expect(panel().hasEnglishContext).toBe(true);
  });

  it('reports no english context when contentEn is absent', () => {
    openAdult({ contentEn: undefined });
    expect(panel().hasEnglishContext).toBe(false);
  });

  it('derives journeyTitle from the room title', () => {
    openAdult({ roomTitle: 'Daily Life' });
    expect(panel().journeyTitle).toBe('Daily Life');
  });

  it('falls back to "<tier> room" when only a tier is present', () => {
    openAdult({ roomTitle: undefined, tier: 'B2', contentEn: undefined });
    expect(panel().journeyTitle).toBe('B2 room');
  });

  it('falls back to "Teacher Mercy" when there is no room context at all', () => {
    openAdult({ roomTitle: undefined, tier: undefined, contentEn: undefined });
    expect(panel().journeyTitle).toBe('Teacher Mercy');
  });

  it('maps memory trouble words into objects', () => {
    openAdult();
    expect(panel().troubleWords).toEqual([{ word: 'through' }, { word: 'world' }]);
  });

  it('passes the teacher memory summary through', () => {
    openAdult();
    expect(panel().teacherMemorySummary).toBe('You practiced past tense.');
  });
});

// ===========================================================================
describe('MercyGuide — panel prop wiring (kids preset)', () => {
  function openKids(extra: Record<string, unknown> = {}) {
    renderGuide({ roomId: 'kids_l1', roomTitle: 'Animals', ...extra });
    act(() => {
      fireEvent.keyDown(getBubble()!, { key: 'Enter' });
    });
  }

  it('passes the restricted kids tab set and disabled flags', () => {
    openKids();
    const p = panel();
    expect(p.isKidsMode).toBe(true);
    expect(p.teacherMode).toBe('kids');
    expect(p.availableTabs).toEqual(['pronunciation', 'teacher']);
    expect(p.hideGrammarTab).toBe(true);
    expect(p.hideLogicTab).toBe(true);
    expect(p.disableTeacherWriting).toBe(true);
    expect(p.disableGrammarAnalysis).toBe(true);
    expect(p.disableEnglishLogic).toBe(true);
    expect(p.preferPronunciationFirst).toBe(true);
    expect(p.preferTapAndRepeat).toBe(true);
    expect(p.kidsModeAgeBand).toBe('3-4');
  });

  it('defaults the active tab to pronunciation in kids mode', () => {
    openKids();
    expect(panel().activeTab).toBe('pronunciation');
  });
});

// ===========================================================================
describe('MercyGuide — setActiveTab guard from the panel', () => {
  it('lets adult mode switch to any tab', () => {
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().setActiveTab('logic'));
    expect(panel().activeTab).toBe('logic');
  });

  it('blocks grammar/logic in kids mode and snaps back to pronunciation', () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().setActiveTab('grammar'));
    expect(panel().activeTab).toBe('pronunciation');
    act(() => panel().setActiveTab('logic'));
    expect(panel().activeTab).toBe('pronunciation');
  });

  it('still allows the pronunciation/teacher tabs in kids mode', () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().setActiveTab('teacher'));
    expect(panel().activeTab).toBe('teacher');
  });
});

// ===========================================================================
describe('MercyGuide — close / collapse / fullscreen', () => {
  function open() {
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
  }

  it('onCloseGuide hides the panel and emits a close breadcrumb', () => {
    open();
    mockH.breadcrumb.mockClear();
    act(() => panel().onCloseGuide());
    expect(getBubble()).not.toBeNull();
    expect(mockH.breadcrumb).toHaveBeenCalledWith('close', { source: 'close' });
  });

  it('onCollapseGuide hides the panel with a collapse breadcrumb', () => {
    open();
    mockH.breadcrumb.mockClear();
    act(() => panel().onCollapseGuide());
    expect(getBubble()).not.toBeNull();
    expect(mockH.breadcrumb).toHaveBeenCalledWith('close', { source: 'collapse' });
  });

  it('onToggleFullscreen flips the fullscreen flag both ways', () => {
    open();
    expect(panel().isFullscreen).toBe(false);
    act(() => panel().onToggleFullscreen());
    expect(panel().isFullscreen).toBe(true);
    act(() => panel().onToggleFullscreen());
    expect(panel().isFullscreen).toBe(false);
  });
});

// ===========================================================================
describe('MercyGuide — size presets & geometry clamping', () => {
  it('clamps a large preset to the viewport-derived max height', () => {
    setViewport(1024, 768);
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().onSetSizePreset('large'));
    const rect = panel().panelRect;
    // width 480 fits under the 560 policy cap; height 640 clamps to 600.
    expect(rect.width).toBe(480);
    expect(rect.height).toBe(600);
  });

  it('ignores an unknown preset key without throwing', () => {
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    const before = panel().panelRect;
    act(() => panel().onSetSizePreset('does-not-exist'));
    expect(panel().panelRect).toEqual(before);
  });
});

// ===========================================================================
describe('MercyGuide — navigation helpers passed to the panel', () => {
  function openAdult(extra: Record<string, unknown> = {}) {
    renderGuide(extra);
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
  }

  it('onPracticePronunciation switches tab and stores the payload', () => {
    openAdult();
    act(() => panel().onPracticePronunciation({ sourceText: 'hello' }));
    expect(panel().activeTab).toBe('pronunciation');
    expect(panel().pendingPronunciationPayload).toEqual({ sourceText: 'hello' });
  });

  it('onOpenEnglishLogic goes to logic in adult mode', () => {
    openAdult();
    act(() => panel().onOpenEnglishLogic());
    expect(panel().activeTab).toBe('logic');
  });

  it('onOpenEnglishLogic falls back to pronunciation in kids mode', () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().onOpenEnglishLogic());
    expect(panel().activeTab).toBe('pronunciation');
  });

  it('onTeacherOpenWriting goes to grammar in adult mode', () => {
    openAdult();
    act(() => panel().onTeacherOpenWriting());
    expect(panel().activeTab).toBe('grammar');
  });

  it('onTeacherOpenWriting falls back to pronunciation in kids mode', () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().onTeacherOpenWriting());
    expect(panel().activeTab).toBe('pronunciation');
  });

  it('onTeacherOpenPronunciation with no source text just switches tab', () => {
    openAdult();
    act(() => panel().onTeacherOpenPronunciation());
    expect(panel().activeTab).toBe('pronunciation');
    expect(panel().pendingPronunciationPayload).toBeNull();
  });

  it('onTeacherOpenPronunciation carries remembered writing text into a payload', () => {
    mockH.memory.writing = {
      lastSubmittedText: 'I goed to school',
      lastCorrectedText: 'I went to school',
      lastEnhancedText: 'I went to school yesterday',
    };
    openAdult();
    act(() => panel().onTeacherOpenPronunciation());
    expect(panel().activeTab).toBe('pronunciation');
    expect(panel().pendingPronunciationPayload).toEqual({
      sourceText: 'I goed to school',
      correctedText: 'I went to school',
      enhancedText: 'I went to school yesterday',
    });
  });
});

// ===========================================================================
describe('MercyGuide — analysis result handling', () => {
  it('stores an analysis result in adult mode', () => {
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(panel().latestAnalysisResult).toBeNull();
    act(() => panel().onAnalysisResult({ correctedText: 'X' }));
    expect(panel().latestAnalysisResult).toEqual({ correctedText: 'X' });
  });

  it('drops analysis results in kids mode (grammar disabled)', () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() => panel().onAnalysisResult({ correctedText: 'X' }));
    expect(panel().latestAnalysisResult).toBeNull();
  });
});

// ===========================================================================
describe('MercyGuide — teacher revision submission', () => {
  function openAdult(extra: Record<string, unknown> = {}) {
    renderGuide(extra);
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
  }

  it('calls the grammar API with the revised text and stores the result', async () => {
    openAdult({ roomId: 'room42', roomTitle: 'Travel', contentEn: 'Ctx' });
    let result: unknown;
    await act(async () => {
      result = await panel().onSubmitTeacherRevision({
        previousText: 'me go store',
        newText: 'I went to the store',
      });
    });
    expect(mockH.analyze).toHaveBeenCalledTimes(1);
    const arg = ((mockH.analyze.mock.calls[0] as unknown as unknown[]) as unknown as [unknown])[0] as unknown;
    expect(arg.text).toBe('I went to the store');
    expect(arg.roomId).toBe('room42');
    expect(arg.isTeacherInitiated).toBe(true);
    expect(arg.isRevisionAttempt).toBe(true);
    expect(result.correctedText).toBe('Corrected.');
    expect(panel().latestAnalysisResult.correctedText).toBe('Corrected.');
    expect(panel().latestTeacherWritingState.latestSubmittedText).toBe(
      'I went to the store',
    );
    // result has corrected/enhanced text -> a pronunciation payload is queued.
    expect(panel().pendingPronunciationPayload.sourceText).toBe(
      'I went to the store',
    );
  });

  it('returns null and skips the API for empty revised text', async () => {
    openAdult();
    let result: unknown = 'unset';
    await act(async () => {
      result = await panel().onSubmitTeacherRevision({
        previousText: 'x',
        newText: '   ',
      });
    });
    expect(result).toBeNull();
    expect(mockH.analyze).not.toHaveBeenCalled();
  });

  it('returns null and skips the API entirely in kids mode', async () => {
    renderGuide({ roomId: 'kids_l1' });
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    let result: unknown = 'unset';
    await act(async () => {
      result = await panel().onSubmitTeacherRevision({
        previousText: 'a',
        newText: 'a better sentence',
      });
    });
    expect(result).toBeNull();
    expect(mockH.analyze).not.toHaveBeenCalled();
  });
});

// ===========================================================================
describe('MercyGuide — profile handling', () => {
  it('onSaveProfile updates the profile handed to the panel', () => {
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    act(() =>
      panel().onSaveProfile({
        english_level: 'advanced',
        preferred_name: 'Mai',
      }),
    );
    expect(panel().profile.preferred_name).toBe('Mai');
  });

  it('hydrates preferred_name from the profile query row', () => {
    mockH.authState.user = { id: 'u1' };
    mockH.profileState.data = { preferred_name: 'Linh' };
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(panel().profile.preferred_name).toBe('Linh');
  });

  it('falls back to full_name when preferred_name is missing', () => {
    mockH.authState.user = { id: 'u1' };
    mockH.profileState.data = { preferred_name: null, full_name: 'Tran Linh' };
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(panel().profile.preferred_name).toBe('Tran Linh');
  });

  it('derives the name from the email local-part as a last resort', () => {
    mockH.authState.user = { id: 'u1' };
    mockH.profileState.data = { email: 'tony@example.com' };
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(panel().profile.preferred_name).toBe('tony');
  });
});

// ===========================================================================
describe('MercyGuide — persisted geometry (localStorage)', () => {
  it('persists the panel rect under the desktop key on a desktop viewport', () => {
    setViewport(1280, 900);
    renderGuide();
    const raw = window.localStorage.getItem('mercy.panel.desktop');
    expect(raw).not.toBeNull();
    const stored = JSON.parse(raw as string);
    expect(stored.width).toBe(380);
    expect(window.localStorage.getItem('mercy.bubble.pos')).not.toBeNull();
  });

  it('persists the panel rect under the mobile key on a mobile viewport', () => {
    setViewport(500, 800);
    renderGuide();
    expect(window.localStorage.getItem('mercy.panel.mobile')).not.toBeNull();
  });

  it('restores a stored bubble position', () => {
    window.localStorage.setItem(
      'mercy.bubble.pos',
      JSON.stringify({ right: 120, bottom: 220 }),
    );
    renderGuide();
    const bubble = getBubble()!;
    expect(bubble.style.right).toBe('120px');
    expect(bubble.style.bottom).toBe('220px');
  });

  it('falls back to defaults when stored bubble JSON is corrupt', () => {
    window.localStorage.setItem('mercy.bubble.pos', '{not valid json');
    renderGuide();
    const bubble = getBubble()!;
    expect(bubble.style.right).toBe('16px');
    expect(bubble.style.bottom).toBe('24px');
  });

  it('restores a partial stored panel rect, defaulting the rest', () => {
    setViewport(1024, 768);
    window.localStorage.setItem(
      'mercy.panel.desktop',
      JSON.stringify({ width: 444 }),
    );
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(panel().panelRect.width).toBe(444);
    // height default derives from innerHeight * 0.7 = round(537.6) = 538
    expect(panel().panelRect.height).toBe(538);
  });

  it('ignores non-numeric stored geometry fields', () => {
    setViewport(1024, 768);
    window.localStorage.setItem(
      'mercy.panel.desktop',
      JSON.stringify({ width: 'wide', height: null, right: 50 }),
    );
    renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    const rect = panel().panelRect;
    expect(rect.width).toBe(380); // bad width -> policy default
    expect(rect.right).toBe(50); // good numeric value preserved
  });
});

// ===========================================================================
describe('MercyGuide — avatar fallback', () => {
  it('swaps to the fallback image on the first error then stops', () => {
    renderGuide();
    const img = screen.getByAltText('Teacher Mercy') as HTMLImageElement;
    expect(img.src).toBe('https://cdn.test/mercy.png');

    fireEvent.error(img);
    expect(img.src).toBe('https://cdn.test/mercy-fallback.png');

    // Second error is a no-op (guard prevents reassignment loops).
    fireEvent.error(img);
    expect(img.src).toBe('https://cdn.test/mercy-fallback.png');
  });
});

// ===========================================================================
describe('MercyGuide — side effects on mount', () => {
  it('loads points from Supabase exactly once', () => {
    renderGuide();
    expect(mockH.loadPoints).toHaveBeenCalledTimes(1);
  });

  it('does not crash and cleans up on unmount', () => {
    const { unmount } = renderGuide();
    act(() => fireEvent.keyDown(getBubble()!, { key: 'Enter' }));
    expect(() => unmount()).not.toThrow();
  });
});
