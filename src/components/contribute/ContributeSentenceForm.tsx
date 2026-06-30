// src/components/contribute/ContributeSentenceForm.tsx
//
// Submitter-facing form: EN + VI + optional context / difficulty /
// suggested L1 tag. Validates client-side before calling Supabase so
// learners see an immediate, localised error rather than a raw PG code.
//
// Vietnamese-first labels; English captions underneath for learners
// who are comfortable enough to skip the VN line.

import React, { useMemo, useState } from 'react';

import {
  submitSentence,
  validateSubmissionPayload,
  SUBMISSION_DIFFICULTY_LEVELS,
  type SubmissionDifficulty,
} from '@/lib/userContent/sentenceSubmission';

export type ContributeSentenceFormProps = {
  /** Current authenticated user id (caller resolves before mounting). */
  userId: string;
  /** Called after a successful submission. Clears the form. */
  onSubmitted?: () => void;
};

const CONTEXT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '',              label: '— chưa chọn —' },
  { value: 'daily',         label: 'Giao tiếp hàng ngày' },
  { value: 'work',          label: 'Công việc' },
  { value: 'travel',        label: 'Du lịch' },
  { value: 'medical',       label: 'Y tế' },
  { value: 'immigration',   label: 'Nhập cư / giấy tờ' },
  { value: 'school',        label: 'Học tập' },
  { value: 'news',          label: 'Tin tức' },
  { value: 'relationships', label: 'Quan hệ / cảm xúc' },
];

export function ContributeSentenceForm({ userId, onSubmitted }: ContributeSentenceFormProps) {
  const [en, setEn] = useState('');
  const [vi, setVi] = useState('');
  const [context, setContext] = useState('');
  const [difficulty, setDifficulty] = useState<SubmissionDifficulty | ''>('');
  const [suggestedL1Tag, setSuggestedL1Tag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clientError = useMemo(
    () =>
      validateSubmissionPayload({
        en,
        vi,
        difficulty: difficulty === '' ? null : difficulty,
        suggestedL1Tag: suggestedL1Tag.trim() === '' ? null : suggestedL1Tag.trim(),
      }),
    [en, vi, difficulty, suggestedL1Tag],
  );

  const canSubmit = !submitting && clientError === null && en.length > 0 && vi.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const result = await submitSentence(userId, {
        en,
        vi,
        context: context === '' ? null : context,
        difficulty: difficulty === '' ? null : difficulty,
        suggestedL1Tag: suggestedL1Tag.trim() === '' ? null : suggestedL1Tag.trim(),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setEn('');
      setVi('');
      setContext('');
      setDifficulty('');
      setSuggestedL1Tag('');
      onSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm p-5 sm:p-6 max-w-xl mx-auto space-y-4"
      aria-label="Contribute a sentence"
    >
      <div>
        <label htmlFor="contribute-en" className="block text-sm font-semibold mb-1">
          Câu tiếng Anh
          <span className="text-slate-600 font-normal ml-2">English sentence</span>
        </label>
        <textarea
          id="contribute-en"
          value={en}
          onChange={(e) => setEn(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="She told me the interview was postponed."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="contribute-vi" className="block text-sm font-semibold mb-1">
          Bản dịch tiếng Việt
          <span className="text-slate-600 font-normal ml-2">Vietnamese translation</span>
        </label>
        <textarea
          id="contribute-vi"
          value={vi}
          onChange={(e) => setVi(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="Cô ấy báo với tôi là buổi phỏng vấn bị hoãn."
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          required
          lang="vi"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contribute-context" className="block text-sm font-semibold mb-1">
            Chủ đề
            <span className="text-slate-600 font-normal ml-2">Context</span>
          </label>
          <select
            id="contribute-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          >
            {CONTEXT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contribute-difficulty" className="block text-sm font-semibold mb-1">
            Mức độ
            <span className="text-slate-600 font-normal ml-2">CEFR</span>
          </label>
          <select
            id="contribute-difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as SubmissionDifficulty | '')}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm"
          >
            <option value="">— chưa chọn —</option>
            {SUBMISSION_DIFFICULTY_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contribute-l1" className="block text-sm font-semibold mb-1">
          Quy tắc liên quan (tuỳ chọn)
          <span className="text-slate-600 font-normal ml-2">Suggested L1 rule (optional)</span>
        </label>
        <input
          id="contribute-l1"
          type="text"
          value={suggestedL1Tag}
          onChange={(e) => setSuggestedL1Tag(e.target.value)}
          placeholder="vi_l1_3rd_person_s"
          pattern="^vi_l1_[a-z0-9_]+$"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-2 text-sm font-mono"
        />
        <p className="text-xs text-slate-600 mt-1">
          Nếu câu này luyện một lỗi L1 cụ thể — ví dụ <code>vi_l1_3rd_person_s</code>. Bỏ trống nếu không chắc.
        </p>
      </div>

      {clientError && (en.length > 0 || vi.length > 0) && (
        <p className="text-sm text-amber-700 dark:text-amber-300" role="status">
          {clientError}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
          Cảm ơn bạn! Câu đã được gửi để xét duyệt.
        </p>
      )}

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 font-medium"
        >
          {submitting ? 'Đang gửi…' : 'Gửi xét duyệt'}
        </button>
      </div>
    </form>
  );
}

export default ContributeSentenceForm;
