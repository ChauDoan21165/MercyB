import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/RussianLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const appRouterSource = (): string => read('src/router/AppRouter.tsx');
const languageHubSource = (): string => read('src/pages/languages/LanguagesIndexPage.tsx');

describe('Russian lessons page coverage', () => {
  it('uses local Russian lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/RussianLessonsPage|Russian/);
    expect(source).toContain('from "@/languages/russian"');
    expect(source).toContain('russian-starter-1');
    expect(source).toContain('Cyrillic');
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const router = appRouterSource();

    expect(router).toContain('const RussianLessonsPage');
    expect(router).toContain('path="/languages/russian"');
    expect(router).toMatch(/<RussianLessonsPage\s*\/>/);
  });

  it('is discoverable from the languages hub', () => {
    const hub = languageHubSource();

    expect(hub).toContain('slug: "russian"');
    expect(hub).toContain('href: "/languages/russian"');
    expect(hub).toContain('Tiếng Russian');
  });
});
