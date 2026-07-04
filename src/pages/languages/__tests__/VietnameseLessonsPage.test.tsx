import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/VietnameseLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const appRouterSource = (): string => read('src/router/AppRouter.tsx');
const languageHubSource = (): string => read('src/pages/languages/LanguagesIndexPage.tsx');

describe('Vietnamese lessons page coverage', () => {
  it('uses local Vietnamese lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/VietnameseLessonsPage|Vietnamese/);
    expect(source).toContain('from "@/languages/vietnamese/lessons"');
    expect(source).toContain('loadVietnameseLessons');
    expect(source).toContain('normalizeVietnameseLesson');
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const router = appRouterSource();

    expect(router).toContain('const VietnameseLessonsPage');
    expect(router).toContain('path="/languages/vietnamese"');
    expect(router).toMatch(/<VietnameseLessonsPage\s*\/>/);
  });

  it('is discoverable from the languages hub', () => {
    const hub = languageHubSource();

    expect(hub).toContain('slug: "vietnamese"');
    expect(hub).toContain('href: "/languages/vietnamese"');
    expect(hub).toContain('Vietnamese for Foreigners');
  });
});
