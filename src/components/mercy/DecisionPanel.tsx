import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MercyResponse } from '@/types/mercy';

type Props = {
  result: MercyResponse;
};

export function DecisionPanel({ result }: Props) {
  const decision = result.decision;
  if (!decision) return null;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Teaching Decision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Primary focus
            </div>
            <div className="mt-1 font-medium">{decision.primaryFocus}</div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Praise focus
            </div>
            <div className="mt-1 font-medium">{decision.praiseFocus ?? '—'}</div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Explanation depth
            </div>
            <div className="mt-1 font-medium">{decision.explanationDepth}</div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Response tone
            </div>
            <div className="mt-1 font-medium">{decision.responseTone}</div>
          </div>
        </div>

        {decision.secondaryFocuses.length > 0 && (
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              Supporting focuses
            </div>
            <div className="flex flex-wrap gap-2">
              {decision.secondaryFocuses.map((focus) => (
                <span key={focus} className="rounded-full border px-3 py-1 text-xs">
                  {focus}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}