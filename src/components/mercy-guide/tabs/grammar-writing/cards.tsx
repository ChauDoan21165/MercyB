// src/components/mercy-guide/tabs/grammar-writing/cards.tsx

import React from 'react';
import { cn } from '@/lib/utils';

export function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2">
      {icon ? <div className="mt-0.5">{icon}</div> : null}
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ScoreCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function SimpleInfoCard({
  title,
  body,
  className,
}: {
  title: string;
  body: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border bg-white p-4 shadow-sm', className)}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="text-sm leading-6 text-foreground">{body}</div>
    </div>
  );
}