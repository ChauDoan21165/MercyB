// @vitest-environment jsdom
//
// Hardening tests for MercyGuideProfileSettings.
//
// This component loads a "companion profile" (name / English level / learning
// goal) on mount, lets the user edit it, and saves it back through the
// `@/services/companion` service. The tests below mock that service and the
// `sonner` toast layer so the component can be exercised deterministically in
// jsdom without any network / Supabase access.

import React from 'react';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type Mock,
} from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react';

import { MercyGuideProfileSettings } from '@/components/MercyGuideProfileSettings';
import type {
  CompanionProfile,
  EnglishLevel,
} from '@/services/companion';
import {
  getCompanionProfile,
  updateCompanionProfile,
} from '@/services/companion';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@/services/companion', () => ({
  getCompanionProfile: vi.fn(),
  updateCompanionProfile: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockGetProfile = getCompanionProfile as unknown as Mock;
const mockUpdateProfile = updateCompanionProfile as unknown as Mock;
const mockToastSuccess = toast.success as unknown as Mock;
const mockToastError = toast.error as unknown as Mock;

// A controllable promise so we can assert on intermediate (loading) state.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  // The repo's vitest config sets clearMocks/restoreMocks/mockReset, so make
  // the happy-path defaults explicit for every test.
  mockGetProfile.mockResolvedValue({} as CompanionProfile);
  mockUpdateProfile.mockResolvedValue(undefined);
  // Silence the component's expected console.error noise on failure paths.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Wait for the async load effect to settle (spinner gone, form mounted).
async function renderAndSettle(
  props?: Parameters<typeof MercyGuideProfileSettings>[0],
) {
  const utils = render(<MercyGuideProfileSettings {...props} />);
  await screen.findByLabelText(/Your name/i);
  return utils;
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — loading state', () => {
  it('shows a spinner and no form while the profile is loading', () => {
    const d = deferred<CompanionProfile>();
    mockGetProfile.mockReturnValue(d.promise);

    const { container } = render(<MercyGuideProfileSettings />);

    // Spinner present (Loader2 renders an svg with the animate-spin class).
    expect(container.querySelector('.animate-spin')).not.toBeNull();
    // Form fields are not mounted yet.
    expect(screen.queryByLabelText(/Your name/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /save/i })).toBeNull();

    // Resolve so the effect does not leak into other tests.
    d.resolve({});
  });

  it('calls getCompanionProfile exactly once on mount', async () => {
    await renderAndSettle();
    expect(mockGetProfile).toHaveBeenCalledTimes(1);
  });

  it('renders the form once loading resolves', async () => {
    await renderAndSettle();
    expect(screen.getByText('My Guide Settings')).toBeTruthy();
    expect(screen.getByLabelText(/Your name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Learning goal/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /save/i })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Hydration from the loaded profile
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — hydrating loaded values', () => {
  it('populates name and goal from a fully-populated profile', async () => {
    mockGetProfile.mockResolvedValue({
      preferred_name: 'Linh',
      english_level: 'advanced',
      learning_goal: 'Pass IELTS 7.0',
    } satisfies CompanionProfile);

    await renderAndSettle();

    expect((screen.getByLabelText(/Your name/i) as HTMLInputElement).value).toBe(
      'Linh',
    );
    expect(
      (screen.getByLabelText(/Learning goal/i) as HTMLTextAreaElement).value,
    ).toBe('Pass IELTS 7.0');
  });

  it('reflects the loaded English level in the select trigger', async () => {
    mockGetProfile.mockResolvedValue({
      english_level: 'intermediate',
    } satisfies CompanionProfile);

    await renderAndSettle();

    // SelectValue renders the chosen item's bilingual label.
    expect(screen.getByText('Intermediate')).toBeTruthy();
    expect(screen.getByText('(Trung cấp)')).toBeTruthy();
  });

  it('falls back to empty fields and beginner level for an empty profile', async () => {
    mockGetProfile.mockResolvedValue({});

    await renderAndSettle();

    expect((screen.getByLabelText(/Your name/i) as HTMLInputElement).value).toBe(
      '',
    );
    expect(
      (screen.getByLabelText(/Learning goal/i) as HTMLTextAreaElement).value,
    ).toBe('');
    // Default level is 'beginner'.
    expect(screen.getByText('Beginner')).toBeTruthy();
  });

  it('ignores null/undefined profile fields without crashing', async () => {
    mockGetProfile.mockResolvedValue({
      preferred_name: null,
      english_level: null,
      learning_goal: null,
      last_english_activity: null,
    } satisfies CompanionProfile);

    await renderAndSettle();

    expect((screen.getByLabelText(/Your name/i) as HTMLInputElement).value).toBe(
      '',
    );
    expect(screen.getByText('Beginner')).toBeTruthy();
  });

  it('keeps the form usable when loading rejects (error is swallowed)', async () => {
    mockGetProfile.mockRejectedValue(new Error('network down'));

    await renderAndSettle();

    // Form still renders with default values despite the load failure.
    expect((screen.getByLabelText(/Your name/i) as HTMLInputElement).value).toBe(
      '',
    );
    expect(console.error).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Editing inputs
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — editing fields', () => {
  it('updates the name field as the user types', async () => {
    await renderAndSettle();
    const input = screen.getByLabelText(/Your name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Mai' } });
    expect(input.value).toBe('Mai');
  });

  it('updates the learning goal field as the user types', async () => {
    await renderAndSettle();
    const textarea = screen.getByLabelText(
      /Learning goal/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Speak fluently' } });
    expect(textarea.value).toBe('Speak fluently');
  });
});

// ---------------------------------------------------------------------------
// Saving — happy path
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — saving', () => {
  it('saves trimmed values and calls the success toast + callbacks', async () => {
    const onSaved = vi.fn();
    const onClose = vi.fn();
    await renderAndSettle({ onSaved, onClose });

    fireEvent.change(screen.getByLabelText(/Your name/i), {
      target: { value: '  Tuan  ' },
    });
    fireEvent.change(screen.getByLabelText(/Learning goal/i), {
      target: { value: '  Travel abroad  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(1));

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      preferred_name: 'Tuan',
      english_level: 'beginner',
      learning_goal: 'Travel abroad',
    });
    expect(mockToastSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastError).not.toHaveBeenCalled();

    // onSaved receives the patch object that was persisted.
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onSaved).toHaveBeenCalledWith({
      preferred_name: 'Tuan',
      english_level: 'beginner',
      learning_goal: 'Travel abroad',
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('persists null for blank / whitespace-only name and goal', async () => {
    await renderAndSettle();

    fireEvent.change(screen.getByLabelText(/Your name/i), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByLabelText(/Learning goal/i), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(1));
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      preferred_name: null,
      english_level: 'beginner',
      learning_goal: null,
    });
  });

  it('preserves the loaded level when saving without changing it', async () => {
    mockGetProfile.mockResolvedValue({
      preferred_name: 'An',
      english_level: 'lower_intermediate',
    } satisfies CompanionProfile);

    await renderAndSettle();
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(1));
    const patch = mockUpdateProfile.mock.calls[0][0] as Partial<CompanionProfile>;
    expect(patch.english_level).toBe<EnglishLevel>('lower_intermediate');
    expect(patch.preferred_name).toBe('An');
  });

  it('works when no callbacks are provided (optional chaining)', async () => {
    await renderAndSettle();
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledTimes(1));
    // No throw means optional onSaved?./onClose?. were handled safely.
    expect(mockToastSuccess).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Saving — error path
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — save failures', () => {
  it('shows an error toast and does not call success callbacks on failure', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('save boom'));
    const onSaved = vi.fn();
    const onClose = vi.fn();

    await renderAndSettle({ onSaved, onClose });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => expect(mockToastError).toHaveBeenCalledTimes(1));
    expect(mockToastError).toHaveBeenCalledWith(
      'Failed to save. Please try again.',
    );
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('re-enables the Save button after a failed save', async () => {
    mockUpdateProfile.mockRejectedValue(new Error('nope'));
    await renderAndSettle();

    const saveBtn = screen.getByRole('button', {
      name: /save/i,
    }) as HTMLButtonElement;
    fireEvent.click(saveBtn);

    await waitFor(() => expect(mockToastError).toHaveBeenCalled());
    // After the finally block, isSaving is false again → button enabled.
    await waitFor(() => expect(saveBtn.disabled).toBe(false));
  });

  it('disables the Save button while a save is in flight', async () => {
    const d = deferred<void>();
    mockUpdateProfile.mockReturnValue(d.promise);

    await renderAndSettle();
    const saveBtn = screen.getByRole('button', {
      name: /save/i,
    }) as HTMLButtonElement;

    fireEvent.click(saveBtn);
    await waitFor(() => expect(saveBtn.disabled).toBe(true));

    d.resolve();
    await waitFor(() => expect(saveBtn.disabled).toBe(false));
  });
});

// ---------------------------------------------------------------------------
// Cancel button / onClose wiring
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — cancel control', () => {
  it('renders a Cancel button only when onClose is provided', async () => {
    const onClose = vi.fn();
    await renderAndSettle({ onClose });
    expect(screen.getByRole('button', { name: /cancel/i })).toBeTruthy();
  });

  it('omits the Cancel button when onClose is absent', async () => {
    await renderAndSettle();
    expect(screen.queryByRole('button', { name: /cancel/i })).toBeNull();
  });

  it('invokes onClose when Cancel is clicked (without saving)', async () => {
    const onClose = vi.fn();
    await renderAndSettle({ onClose });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockUpdateProfile).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Re-export / type surface sanity
// ---------------------------------------------------------------------------

describe('MercyGuideProfileSettings — module surface', () => {
  it('exports the component and the mocked service functions', () => {
    expect(typeof MercyGuideProfileSettings).toBe('function');
    expect(typeof getCompanionProfile).toBe('function');
    expect(typeof updateCompanionProfile).toBe('function');
  });

  it('cleans up between renders without leaking DOM', async () => {
    const { unmount } = await renderAndSettle();
    unmount();
    cleanup();
    expect(screen.queryByText('My Guide Settings')).toBeNull();
  });
});
