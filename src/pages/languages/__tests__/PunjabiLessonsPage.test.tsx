import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/PunjabiLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const appRouterSource = (): string => read('src/router/AppRouter.tsx');
const languageHubSource = (): string => read('src/pages/languages/LanguagesIndexPage.tsx');

describe('Punjabi lessons page coverage', () => {
  it('uses local Punjabi lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/PunjabiLessonsPage|Punjabi/);
    expect(source).toContain('from "@/languages/punjabi"');
    expect(source).toContain('punjabi-starter-1');
    expect(source).toContain('Gurmukhi');
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const router = appRouterSource();

    expect(router).toContain('const PunjabiLessonsPage');
    expect(router).toContain('path="/languages/punjabi"');
    expect(router).toMatch(/<PunjabiLessonsPage\s*\/>/);
  });

  it('is discoverable from the languages hub', () => {
    const hub = languageHubSource();

    expect(hub).toContain('slug: "punjabi"');
    expect(hub).toContain('href: "/languages/punjabi"');
    expect(hub).toContain('Tiếng Punjabi');
  });
});
