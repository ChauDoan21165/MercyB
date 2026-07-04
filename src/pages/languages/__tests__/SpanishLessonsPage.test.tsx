import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/SpanishLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const appRouterSource = (): string => read('src/router/AppRouter.tsx');
const languageHubSource = (): string => read('src/pages/languages/LanguagesIndexPage.tsx');

describe('Spanish lessons page coverage', () => {
  it('uses local Spanish lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/SpanishLessonsPage|Spanish/);
    expect(source).toContain('from "@/languages/spanish/lessons"');
    expect(source).toContain('fetchLessonsBatch<SpanishLesson>("spanish"');
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const router = appRouterSource();

    expect(router).toContain('const SpanishLessonsPage');
    expect(router).toContain('path="/languages/spanish"');
    expect(router).toMatch(/<SpanishLessonsPage\s*\/>/);
  });

  it('is discoverable from the languages hub', () => {
    const hub = languageHubSource();

    expect(hub).toContain('slug: "spanish"');
    expect(hub).toContain('href: "/languages/spanish"');
    expect(hub).toContain('Spanish for English Speakers');
  });
});
