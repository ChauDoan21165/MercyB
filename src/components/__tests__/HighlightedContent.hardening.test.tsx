import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

/**
 * Hardening tests for HighlightedContent.
 *
 * HighlightedContent is a thin wrapper around ProtectedContent. Its only job is
 * to forward `content`, `className`, and `showCopyButton` (with the right
 * defaults) and to intentionally drop the `enableHighlighting` /
 * `showShadowingReminder` props. We mock ProtectedContent with a spy so the
 * tests are deterministic and assert the wrapper's exact prop contract without
 * pulling in Supabase, auth, the highlighter, or the toast system.
 */

// Records every props object ProtectedContent is rendered with.
const protectedContentCalls: Array<Record<string, unknown>> = [];

vi.mock('../ProtectedContent', () => ({
  ProtectedContent: (props: Record<string, unknown>) => {
    protectedContentCalls.push(props);
    return (
      <div
        data-testid="protected-content"
        data-classname={String(props.className ?? '')}
        data-show-copy={String(props.showCopyButton)}
      >
        {String(props.content ?? '')}
      </div>
    );
  },
}));

// Import AFTER the mock is registered so the wrapper picks up the mocked child.
import { HighlightedContent } from '../HighlightedContent';

beforeEach(() => {
  protectedContentCalls.length = 0;
  cleanup();
});

describe('HighlightedContent — rendering', () => {
  it('renders ProtectedContent with the provided content', () => {
    render(<HighlightedContent content="Hello world" />);
    const node = screen.getByTestId('protected-content');
    expect(node).toBeInTheDocument();
    expect(node).toHaveTextContent('Hello world');
  });

  it('renders exactly one ProtectedContent per mount', () => {
    render(<HighlightedContent content="abc" />);
    expect(protectedContentCalls).toHaveLength(1);
    expect(screen.getAllByTestId('protected-content')).toHaveLength(1);
  });

  it('returns a defined React element (does not render null/undefined)', () => {
    const { container } = render(<HighlightedContent content="x" />);
    expect(container.firstChild).not.toBeNull();
  });
});

describe('HighlightedContent — prop forwarding', () => {
  it('forwards content unchanged', () => {
    render(<HighlightedContent content="The quick brown fox" />);
    expect(protectedContentCalls[0].content).toBe('The quick brown fox');
  });

  it('forwards className when provided', () => {
    render(<HighlightedContent content="x" className="custom-class" />);
    expect(protectedContentCalls[0].className).toBe('custom-class');
    expect(screen.getByTestId('protected-content')).toHaveAttribute(
      'data-classname',
      'custom-class',
    );
  });

  it('forwards showCopyButton=false explicitly', () => {
    render(<HighlightedContent content="x" showCopyButton={false} />);
    expect(protectedContentCalls[0].showCopyButton).toBe(false);
  });

  it('forwards showCopyButton=true explicitly', () => {
    render(<HighlightedContent content="x" showCopyButton={true} />);
    expect(protectedContentCalls[0].showCopyButton).toBe(true);
  });

  it('does NOT forward enableHighlighting to ProtectedContent', () => {
    render(<HighlightedContent content="x" enableHighlighting={false} />);
    expect(protectedContentCalls[0]).not.toHaveProperty('enableHighlighting');
  });

  it('does NOT forward showShadowingReminder to ProtectedContent', () => {
    render(<HighlightedContent content="x" showShadowingReminder={true} />);
    expect(protectedContentCalls[0]).not.toHaveProperty('showShadowingReminder');
  });

  it('passes exactly the three supported props (content, className, showCopyButton)', () => {
    render(<HighlightedContent content="x" />);
    expect(Object.keys(protectedContentCalls[0]).sort()).toEqual(
      ['className', 'content', 'showCopyButton'].sort(),
    );
  });
});

describe('HighlightedContent — defaults', () => {
  it('defaults className to empty string', () => {
    render(<HighlightedContent content="x" />);
    expect(protectedContentCalls[0].className).toBe('');
  });

  it('defaults showCopyButton to true', () => {
    render(<HighlightedContent content="x" />);
    expect(protectedContentCalls[0].showCopyButton).toBe(true);
  });

  it('ignores enableHighlighting default without affecting forwarded props', () => {
    render(<HighlightedContent content="x" />);
    // enableHighlighting defaults to true internally but is never forwarded.
    expect(protectedContentCalls[0]).not.toHaveProperty('enableHighlighting');
  });
});

describe('HighlightedContent — edge cases', () => {
  it('handles empty string content', () => {
    render(<HighlightedContent content="" />);
    expect(protectedContentCalls).toHaveLength(1);
    expect(protectedContentCalls[0].content).toBe('');
    expect(screen.getByTestId('protected-content')).toHaveTextContent('');
  });

  it('handles whitespace-only content', () => {
    render(<HighlightedContent content="   " />);
    expect(protectedContentCalls[0].content).toBe('   ');
  });

  it('handles multiline content', () => {
    const multiline = 'line one\nline two\nline three';
    render(<HighlightedContent content={multiline} />);
    expect(protectedContentCalls[0].content).toBe(multiline);
  });

  it('handles content containing HTML-like characters without interpreting them', () => {
    const html = '<script>alert("x")</script>';
    render(<HighlightedContent content={html} />);
    expect(protectedContentCalls[0].content).toBe(html);
    // Rendered as text, not as a real <script> element.
    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByTestId('protected-content')).toHaveTextContent(html);
  });

  it('handles unicode / Vietnamese diacritics in content', () => {
    const vi = 'Xin chào, học tiếng Anh!';
    render(<HighlightedContent content={vi} />);
    expect(protectedContentCalls[0].content).toBe(vi);
    expect(screen.getByTestId('protected-content')).toHaveTextContent(vi);
  });

  it('handles very long content', () => {
    const long = 'a'.repeat(10000);
    render(<HighlightedContent content={long} />);
    expect(protectedContentCalls[0].content).toBe(long);
  });

  it('handles empty className string explicitly', () => {
    render(<HighlightedContent content="x" className="" />);
    expect(protectedContentCalls[0].className).toBe('');
  });
});

describe('HighlightedContent — re-render stability', () => {
  it('forwards updated content on re-render', () => {
    const { rerender } = render(<HighlightedContent content="first" />);
    expect(protectedContentCalls[protectedContentCalls.length - 1].content).toBe(
      'first',
    );

    rerender(<HighlightedContent content="second" />);
    expect(protectedContentCalls[protectedContentCalls.length - 1].content).toBe(
      'second',
    );
  });

  it('forwards updated showCopyButton on re-render', () => {
    const { rerender } = render(
      <HighlightedContent content="x" showCopyButton={true} />,
    );
    rerender(<HighlightedContent content="x" showCopyButton={false} />);
    expect(
      protectedContentCalls[protectedContentCalls.length - 1].showCopyButton,
    ).toBe(false);
  });

  it('is deterministic across repeated identical renders', () => {
    render(<HighlightedContent content="same" className="c" />);
    cleanup();
    protectedContentCalls.length = 0;
    render(<HighlightedContent content="same" className="c" />);
    expect(protectedContentCalls[0]).toMatchObject({
      content: 'same',
      className: 'c',
      showCopyButton: true,
    });
  });
});
