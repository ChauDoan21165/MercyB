// Path: src/pages/DevAudioTest.tsx
// Dev-only manual test harness for useAudioUrl. Exercises every input class,
// shows live state transitions, plays audio, measures resolution latency.
// Route is gated in AppRouter.tsx behind import.meta.env.DEV — excluded from prod bundles.

import React, { useEffect, useRef, useState } from 'react';
import { useAudioUrl } from '@/hooks/useAudioUrl';
import { toAudioKey } from '@/lib/roomAudioResolver';

type PresetId = 'adult' | 'kids' | 'music' | 'absolute' | 'empty' | 'legacy';

const PRESETS: Record<PresetId, { label: string; value: string }> = {
  adult:    { label: 'Adult room',       value: 'alexander_v2_1_en.mp3' },
  kids:     { label: 'Kids',             value: 'kids/airplane.mp3' },
  music:    { label: 'Music',            value: 'music/theme.mp3' },
  absolute: { label: 'Absolute URL',     value: 'https://example.com/test.mp3' },
  empty:    { label: 'Empty',            value: '' },
  legacy:   { label: 'Legacy private:',  value: 'private:foo.mp3' },
};

type LatencyLog = { at: number; label: string; ms?: number };

export default function DevAudioTest() {
  const [input, setInput] = useState<string>(PRESETS.adult.value);
  const [filename, setFilename] = useState<string>(PRESETS.adult.value);
  const [latencyLog, setLatencyLog] = useState<LatencyLog[]>([]);
  const loadStartedAtRef = useRef<number | null>(null);
  const prevLoadingRef = useRef<boolean>(false);

  const { url, loading, error, refresh } = useAudioUrl(filename);
  const key = toAudioKey(filename);

  useEffect(() => {
    // Track loading transitions to measure resolution latency.
    if (loading && !prevLoadingRef.current) {
      loadStartedAtRef.current = performance.now();
    } else if (!loading && prevLoadingRef.current && loadStartedAtRef.current !== null) {
      const ms = Math.round(performance.now() - loadStartedAtRef.current);
      setLatencyLog((log) => [
        { at: Date.now(), label: `${filename || '(empty)'} → resolved`, ms },
        ...log,
      ].slice(0, 10));
      loadStartedAtRef.current = null;
    }
    prevLoadingRef.current = loading;
  }, [loading, filename]);

  const handleLoad = () => {
    setLatencyLog((log) =>
      [{ at: Date.now(), label: `Load ${input || '(empty)'}` }, ...log].slice(0, 10),
    );
    setFilename(input);
  };

  const handlePreset = (id: PresetId) => {
    setInput(PRESETS[id].value);
    setLatencyLog((log) =>
      [{ at: Date.now(), label: `Preset ${PRESETS[id].label}` }, ...log].slice(0, 10),
    );
    setFilename(PRESETS[id].value);
  };

  const handleRefresh = () => {
    setLatencyLog((log) =>
      [{ at: Date.now(), label: `refresh() on ${filename || '(empty)'}` }, ...log].slice(0, 10),
    );
    refresh();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 font-mono">
      <h1 className="text-xl font-bold">DevAudioTest</h1>
      <p className="mt-1 text-xs text-slate-600">
        Manual harness for <code>useAudioUrl</code>. Dev build only.
      </p>

      <section className="mt-5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Filename
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLoad(); }}
            className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm"
            placeholder="alexander_v2_1_en.mp3"
          />
          <button
            type="button"
            onClick={handleLoad}
            className="rounded bg-rose-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-rose-600"
          >
            Load
          </button>
        </div>
      </section>

      <section className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Presets
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handlePreset(id)}
              className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs hover:bg-slate-50"
            >
              {PRESETS[id].label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          State
        </p>
        <pre className="mt-2 text-xs leading-5 text-slate-800">
{`filename : ${JSON.stringify(filename)}
key      : ${JSON.stringify(key)}
loading  : ${loading}
url      : ${url ?? 'null'}
error    : ${error ? error.message : 'null'}`}
        </pre>
      </section>

      <section className="mt-4">
        {url ? (
          <audio controls src={url} className="w-full" />
        ) : (
          <p className="text-xs italic text-slate-500">
            No audio element (url is null).
          </p>
        )}
      </section>

      <section className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={!filename}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          refresh()
        </button>
        <span className="text-[11px] text-slate-500">
          Drops cache for this key, re-signs via Supabase.
        </span>
      </section>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          Latency log (most recent 10)
        </p>
        {latencyLog.length === 0 ? (
          <p className="mt-1 text-xs italic text-slate-500">No events yet.</p>
        ) : (
          <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
            {latencyLog.map((entry, i) => (
              <li key={`${entry.at}-${i}`}>
                <span className="text-slate-400">
                  {new Date(entry.at).toLocaleTimeString()}
                </span>{' '}
                {entry.label}
                {entry.ms !== undefined ? ` (${entry.ms}ms)` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
        <p className="font-semibold">Expected behavior:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          <li>kids/, music/, https:// → resolve synchronously, ~0ms, no Supabase call</li>
          <li>adult-room filename → warm cache &lt; 50ms, cold sign &lt; 1500ms</li>
          <li>empty / null / whitespace → url = null, no audio element rendered</li>
          <li>refresh() → loading flips true, previous url retained, new url swaps in</li>
          <li>private:foo.mp3 → prefix stripped, treated as adult-room key</li>
        </ul>
      </section>
    </div>
  );
}
