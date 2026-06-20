/**
 * Hardening tests for EnglishRoadmapPanel.
 *
 * The panel only exports the `EnglishRoadmapPanel` component. Its behavior is
 * entirely driven by the `useNinetyDayPlan` hook, which we mock so we can
 * deterministically exercise every render branch (idle, loading, error, and a
 * fully-populated plan) plus the two user actions (generate / clear).
 *
 * The CEFR_INFO / FOCUS_INFO constants are imported from the real planTypes
 * module so the assertions verify the component wires the genuine copy.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { EnglishRoadmapPanel } from '@/components/EnglishRoadmapPanel';
import {
  CEFR_INFO,
  FOCUS_INFO,
  type NinetyDayPlan,
  type CEFRLevel,
  type FocusArea,
} from '@/lib/english/planTypes';

// ---------------------------------------------------------------------------
// Mock the hook the panel depends on.
// ---------------------------------------------------------------------------

const generatePlan = vi.fn();
const clearPlan = vi.fn();

interface HookState {
  plan: NinetyDayPlan | null;
  isLoading: boolean;
  error: string | null;
}

// Mutable state the mocked hook returns; reset before each test.
let hookState: HookState;

vi.mock('@/hooks/useNinetyDayPlan', () => ({
  useNinetyDayPlan: () => ({
    plan: hookState.plan,
    roadmap: null,
    isLoading: hookState.isLoading,
    error: hookState.error,
    generatePlan,
    generateRoadmap: vi.fn(),
    clearPlan,
    clearRoadmap: vi.fn(),
    getSummary: vi.fn(),
    getRoadmapSummaryFn: vi.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makePlan(overrides: Partial<NinetyDayPlan> = {}): NinetyDayPlan {
  return {
    id: 'plan-1',
    created_at: '2026-01-01T00:00:00.000Z',
    cefr_level: 'B1',
    focus: 'listening',
    topics: ['travel'],
    total_days: 90,
    estimated_rooms: 42,
    estimated_hours: 18,
    phases: [
      {
        phase_number: 1,
        weeks_start: 1,
        weeks_end: 4,
        title_en: 'Foundations',
        title_vi: 'Nền tảng',
        focus: 'listening',
        goals_en: ['Build core vocabulary', 'Practice daily listening'],
        goals_vi: ['Xây dựng từ vựng', 'Luyện nghe hàng ngày'],
        rooms_to_complete: 10,
        sample_tasks: [
          { id: 't1', type: 'listen', duration_minutes: 10, description_en: '', description_vi: '' },
          { id: 't2', type: 'shadow', duration_minutes: 5, description_en: '', description_vi: '' },
          { id: 't3', type: 'review', duration_minutes: 15, description_en: '', description_vi: '' },
          { id: 't4', type: 'vocabulary', duration_minutes: 8, description_en: '', description_vi: '' },
        ],
      },
      {
        phase_number: 2,
        weeks_start: 5,
        weeks_end: 8,
        title_en: 'Expansion',
        title_vi: 'Mở rộng',
        focus: 'listening',
        goals_en: ['Expand topics'],
        goals_vi: ['Mở rộng chủ đề'],
        rooms_to_complete: 12,
        sample_tasks: [],
      },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  hookState = { plan: null, isLoading: false, error: null };
  generatePlan.mockReset();
  clearPlan.mockReset();
});

// ---------------------------------------------------------------------------
// Static / structural rendering
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — base render', () => {
  it('renders the card title and both selectors', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('90-Day English Roadmap')).toBeInTheDocument();
    expect(screen.getByText('CEFR Level')).toBeInTheDocument();
    expect(screen.getByText('Focus Area')).toBeInTheDocument();
  });

  it('shows the idle generate button label by default', () => {
    render(<EnglishRoadmapPanel />);
    const button = screen.getByRole('button', {
      name: /Generate my 90-day English roadmap/i,
    });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('forwards a custom className onto the root card', () => {
    const { container } = render(<EnglishRoadmapPanel className="custom-class" />);
    expect(container.querySelector('.custom-class')).not.toBeNull();
  });

  it('does not crash when className is omitted (default empty string)', () => {
    expect(() => render(<EnglishRoadmapPanel />)).not.toThrow();
  });

  it('does not render the plan section, error, or loading state when idle', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.queryByText(/Generating\.\.\./i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Clear/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/rooms$/)).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Generate action
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — generate action', () => {
  it('calls generatePlan with the default level and mixed focus', () => {
    render(<EnglishRoadmapPanel />);
    fireEvent.click(
      screen.getByRole('button', { name: /Generate my 90-day English roadmap/i }),
    );
    expect(generatePlan).toHaveBeenCalledTimes(1);
    expect(generatePlan).toHaveBeenCalledWith({
      cefrLevel: 'A1',
      focus: 'mixed',
      dailyMinutes: 15,
    });
  });

  it('honors the defaultLevel prop in the generate payload', () => {
    const level: CEFRLevel = 'B2';
    render(<EnglishRoadmapPanel defaultLevel={level} />);
    fireEvent.click(
      screen.getByRole('button', { name: /Generate my 90-day English roadmap/i }),
    );
    expect(generatePlan).toHaveBeenCalledWith(
      expect.objectContaining({ cefrLevel: 'B2' }),
    );
  });
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — loading state', () => {
  beforeEach(() => {
    hookState.isLoading = true;
  });

  it('shows the "Generating..." label and disables the button', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText(/Generating\.\.\./i)).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('hides the idle generate label while loading', () => {
    render(<EnglishRoadmapPanel />);
    expect(
      screen.queryByText(/Generate my 90-day English roadmap/i),
    ).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — error state', () => {
  it('renders the error message when error is present', () => {
    hookState.error = 'Something went wrong';
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders no error region when error is null', () => {
    hookState.error = null;
    render(<EnglishRoadmapPanel />);
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('renders error and plan simultaneously when both exist', () => {
    hookState.error = 'Partial failure';
    hookState.plan = makePlan();
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Partial failure')).toBeInTheDocument();
    expect(screen.getByText(/Plan$/)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Plan display
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — plan display', () => {
  beforeEach(() => {
    hookState.plan = makePlan();
  });

  it('renders the plan header using CEFR_INFO copy for the level', () => {
    render(<EnglishRoadmapPanel />);
    const info = CEFR_INFO['B1'];
    expect(screen.getByText(`${info.name_en} Plan`)).toBeInTheDocument();
    expect(screen.getByText(info.description_en)).toBeInTheDocument();
  });

  it('renders estimated rooms and hours stats', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('42 rooms')).toBeInTheDocument();
    expect(screen.getByText('~18 hours')).toBeInTheDocument();
  });

  it('renders the focus badge using FOCUS_INFO copy', () => {
    render(<EnglishRoadmapPanel />);
    const focus: FocusArea = 'listening';
    expect(screen.getByText(FOCUS_INFO[focus].name_en)).toBeInTheDocument();
  });

  it('renders every phase title and week range', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Phase 1: Foundations')).toBeInTheDocument();
    expect(screen.getByText('Phase 2: Expansion')).toBeInTheDocument();
    expect(screen.getByText('Weeks 1-4')).toBeInTheDocument();
    expect(screen.getByText('Weeks 5-8')).toBeInTheDocument();
  });

  it('renders all goals for each phase', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Build core vocabulary')).toBeInTheDocument();
    expect(screen.getByText('Practice daily listening')).toBeInTheDocument();
    expect(screen.getByText('Expand topics')).toBeInTheDocument();
  });

  it('renders the per-phase target rooms', () => {
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Target: 10 rooms')).toBeInTheDocument();
    expect(screen.getByText('Target: 12 rooms')).toBeInTheDocument();
  });

  it('renders at most three sample-task badges per phase', () => {
    render(<EnglishRoadmapPanel />);
    // Phase 1 has 4 tasks but only the first 3 should appear.
    expect(screen.getByText('listen (10m)')).toBeInTheDocument();
    expect(screen.getByText('shadow (5m)')).toBeInTheDocument();
    expect(screen.getByText('review (15m)')).toBeInTheDocument();
    expect(screen.queryByText('vocabulary (8m)')).not.toBeInTheDocument();
  });

  it('renders a Clear button that invokes clearPlan', () => {
    render(<EnglishRoadmapPanel />);
    const clearBtn = screen.getByRole('button', { name: /Clear/i });
    fireEvent.click(clearBtn);
    expect(clearPlan).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Plan display — edge cases
// ---------------------------------------------------------------------------

describe('EnglishRoadmapPanel — plan edge cases', () => {
  it('handles a plan with no phases without throwing', () => {
    hookState.plan = makePlan({ phases: [] });
    expect(() => render(<EnglishRoadmapPanel />)).not.toThrow();
    expect(screen.getByText(/Plan$/)).toBeInTheDocument();
  });

  it('handles a phase with empty goals and zero sample tasks', () => {
    hookState.plan = makePlan({
      phases: [
        {
          phase_number: 1,
          weeks_start: 1,
          weeks_end: 2,
          title_en: 'Empty Phase',
          title_vi: 'Rỗng',
          focus: 'mixed',
          goals_en: [],
          goals_vi: [],
          rooms_to_complete: 0,
          sample_tasks: [],
        },
      ],
    });
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('Phase 1: Empty Phase')).toBeInTheDocument();
    expect(screen.getByText('Target: 0 rooms')).toBeInTheDocument();
  });

  it('renders correctly for each CEFR level a plan may carry', () => {
    (Object.keys(CEFR_INFO) as CEFRLevel[]).forEach((level) => {
      hookState.plan = makePlan({ cefr_level: level });
      const { unmount } = render(<EnglishRoadmapPanel />);
      expect(
        screen.getByText(`${CEFR_INFO[level].name_en} Plan`),
      ).toBeInTheDocument();
      unmount();
    });
  });

  it('renders correctly for each focus area a plan may carry', () => {
    (Object.keys(FOCUS_INFO) as FocusArea[]).forEach((focus) => {
      hookState.plan = makePlan({ focus });
      const { container, unmount } = render(<EnglishRoadmapPanel />);
      // The focus name can also surface in the Select value, so just assert
      // the plan badge contributes at least one occurrence.
      expect(
        within(container).getAllByText(FOCUS_INFO[focus].name_en).length,
      ).toBeGreaterThanOrEqual(1);
      unmount();
    });
  });

  it('handles exactly three sample tasks without truncation', () => {
    hookState.plan = makePlan({
      phases: [
        {
          phase_number: 1,
          weeks_start: 1,
          weeks_end: 2,
          title_en: 'Three Tasks',
          title_vi: 'Ba',
          focus: 'reading',
          goals_en: ['g'],
          goals_vi: ['g'],
          rooms_to_complete: 3,
          sample_tasks: [
            { id: 'a', type: 'read', duration_minutes: 1, description_en: '', description_vi: '' },
            { id: 'b', type: 'vocabulary', duration_minutes: 2, description_en: '', description_vi: '' },
            { id: 'c', type: 'pronunciation', duration_minutes: 3, description_en: '', description_vi: '' },
          ],
        },
      ],
    });
    render(<EnglishRoadmapPanel />);
    expect(screen.getByText('read (1m)')).toBeInTheDocument();
    expect(screen.getByText('vocabulary (2m)')).toBeInTheDocument();
    expect(screen.getByText('pronunciation (3m)')).toBeInTheDocument();
  });
});
