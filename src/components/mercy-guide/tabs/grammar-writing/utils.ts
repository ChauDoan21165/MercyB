// src/components/mercy-guide/tabs/grammar-writing/utils.ts

import type { LearnerMemory, WritingMode } from './types';

export function capitalizeFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ensureEndingPunctuation(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function toTitleCase(value?: string | null) {
  if (!value) return '';
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => capitalizeFirst(part.toLowerCase()))
    .join(' ');
}

export function normalizeMeaningfulText(value?: string | null) {
  return (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
}

export function hasMeaningfulDifference(a?: string | null, b?: string | null) {
  return normalizeMeaningfulText(a) !== normalizeMeaningfulText(b);
}

export function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function getTrendTone(trend?: LearnerMemory['levelTrend']) {
  if (trend === 'rising') return 'border-green-200 bg-green-50 text-green-700';
  if (trend === 'struggling') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export function getWritingModeTone(mode?: WritingMode) {
  if (mode === 'essay') return 'border-indigo-200 bg-indigo-50 text-indigo-700';
  if (mode === 'paragraph') return 'border-pink-200 bg-pink-50 text-pink-700';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export function getTeacherTaskTone(taskType?: string) {
  if (taskType === 'rewrite') return 'border-pink-200 bg-pink-50 text-pink-700';
  if (taskType === 'linking') return 'border-indigo-200 bg-indigo-50 text-indigo-700';
  if (taskType === 'quickFix') return 'border-amber-200 bg-amber-50 text-amber-700';
  if (taskType === 'production') return 'border-green-200 bg-green-50 text-green-700';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export function getTeacherTaskLabel(taskType?: string) {
  if (!taskType) return 'Teacher Task';
  if (taskType === 'quickFix') return 'Teacher Task · Quick Fix';
  return `Teacher Task · ${toTitleCase(taskType)}`;
}