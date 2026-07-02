import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(process.cwd());
const pagePath = 'src/pages/languages/JapaneseLessonsPage.tsx';

const read = (path: string): string => readFileSync(resolve(repoRoot, path), 'utf8');

const walk = (dir: string): string[] => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__tests__') {
        continue;
      }
      files.push(...walk(fullPath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
};

const sourceFiles = (): string[] =>
  walk(resolve(repoRoot, 'src')).filter((file) => !file.includes('/__tests__/'));

describe('Japanese lessons page coverage', () => {
  it('uses local Japanese lesson content without Supabase loader or fake media promises', () => {
    expect(existsSync(resolve(repoRoot, pagePath))).toBe(true);

    const source = read(pagePath);
    expect(source).toMatch(/JapaneseLessonsPage|Japanese/);
    expect(source).toMatch(/japanese/i);
    expect(source).toMatch(/lesson/i);
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/Promise\.resolve\s*\([^)]*(audio|ai|tutor)/i);
    expect(source).not.toMatch(/fake(Audio|AI|Tutor)|mock(Audio|AI|Tutor)/i);
  });

  it('is wired through app routing', () => {
    const matches = sourceFiles()
      .filter((file) => /App|Router|routes/.test(file))
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        return /JapaneseLessonsPage/.test(source) && /japanese/i.test(source);
      });

    expect(matches, 'Expected app routing to reference JapaneseLessonsPage and the japanese slug').not.toHaveLength(0);
  });

  it('is discoverable from the languages hub', () => {
    const matches = sourceFiles()
      .filter((file) => /LanguagesIndexPage/.test(file))
      .filter((file) => {
        const source = readFileSync(file, 'utf8');
        return /Japanese/.test(source) && /japanese/i.test(source);
      });

    expect(matches, 'Expected LanguagesIndexPage to expose the Japanese page/card/link').not.toHaveLength(0);
  });
});
