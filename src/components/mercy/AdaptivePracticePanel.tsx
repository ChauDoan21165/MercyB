import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MercyResponse, PracticeTask } from '@/types/mercy';

type Props = {
  result: MercyResponse;
};

function getRankLabel(index: number) {
  if (index === 0) return 'Core Focus';
  if (index === 1) return 'Support';
  return 'Stretch';
}

function QuickFixCard({ task, label }: { task: Extract<PracticeTask, { type: 'quickFix' }>; label: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <CardTitle className="text-base">{task.focus}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="font-medium">Question</div>
          <div>{task.question}</div>
        </div>

        <div>
          <div className="font-medium">Options</div>
          <ul className="list-disc pl-5">
            {task.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-medium">Answer</div>
          <div>{task.answer}</div>
        </div>

        <div>
          <div className="font-medium">Why</div>
          <div>{task.explanation}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContrastCard({ task, label }: { task: Extract<PracticeTask, { type: 'contrast' }>; label: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <CardTitle className="text-base">{task.focus}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="font-medium">Question</div>
          <div>{task.question}</div>
        </div>

        <div>
          <div className="font-medium">Examples</div>
          <ul className="list-disc pl-5">
            {task.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-medium">Why</div>
          <div>{task.explanation}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductionCard({ task, label }: { task: Extract<PracticeTask, { type: 'production' }>; label: string }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <CardTitle className="text-base">{task.focus}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <div className="font-medium">Task</div>
          <div>{task.instruction}</div>
        </div>

        {task.targetPattern && (
          <div>
            <div className="font-medium">Target pattern</div>
            <div>{task.targetPattern}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LegacyPracticeFallback({ result }: { result: MercyResponse }) {
  const practice = result.practice;
  if (!practice) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {practice.quickFix && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Quick Fix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{practice.quickFix.question}</div>
            <ul className="list-disc pl-5">
              {practice.quickFix.options.map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
            <div className="font-medium">Answer: {practice.quickFix.answer}</div>
            <div>{practice.quickFix.explanation}</div>
          </CardContent>
        </Card>
      )}

      {practice.contrast && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Contrast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>{practice.contrast.question}</div>
            <ul className="list-disc pl-5">
              {practice.contrast.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
            <div>{practice.contrast.explanation}</div>
          </CardContent>
        </Card>
      )}

      {practice.production && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Production</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {practice.production.instruction}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function AdaptivePracticePanel({ result }: Props) {
  const practice = result.practice;
  const decision = result.decision;

  const tasks = [...(practice?.tasks ?? [])].sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Adaptive Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Main focus
              </div>
              <div className="mt-1 font-medium">
                {decision?.primaryFocus ?? 'Not available'}
              </div>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Strong point
              </div>
              <div className="mt-1 font-medium">
                {decision?.praiseFocus ?? '—'}
              </div>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Mode
              </div>
              <div className="mt-1 font-medium">
                {practice?.mode ?? decision?.responseMode ?? 'coach'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task, index) => {
            const label = getRankLabel(index);

            if (task.type === 'quickFix') {
              return <QuickFixCard key={`${task.type}-${task.focus}-${index}`} task={task} label={label} />;
            }

            if (task.type === 'contrast') {
              return <ContrastCard key={`${task.type}-${task.focus}-${index}`} task={task} label={label} />;
            }

            return <ProductionCard key={`${task.type}-${task.focus}-${index}`} task={task} label={label} />;
          })}
        </div>
      ) : (
        <LegacyPracticeFallback result={result} />
      )}
    </div>
  );
}