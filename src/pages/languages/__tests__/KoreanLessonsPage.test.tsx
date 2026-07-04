import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/KoreanLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const appRouterSource = (): string => read('src/router/AppRouter.tsx');
const languageHubSource = (): string => read('src/pages/languages/LanguagesIndexPage.tsx');

describe('Korean lessons page coverage', () => {
  it('uses local Korean lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/KoreanLessonsPage|Korean/);
    expect(source).toContain('from "@/languages/korean/lessons"');
    expect(source).toContain('from "@/languages/korean/normalize"');
    expect(source).toContain('fetchLessonsBatch<KoreanLesson>("korean"');
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const router = appRouterSource();

    expect(router).toContain('const KoreanLessonsPage');
    expect(router).toContain('path="/languages/korean"');
    expect(router).toMatch(/<KoreanLessonsPage\s*\/>/);
  });

  it('is discoverable from the languages hub', () => {
    const hub = languageHubSource();

    expect(hub).toContain('slug: "korean"');
    expect(hub).toContain('href: "/languages/korean"');
    expect(hub).toContain('Tiếng Hàn');
  });
});
