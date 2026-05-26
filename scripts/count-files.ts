#!/usr/bin/env npx tsx
/**
 * Count all code files in Mercy Blade repository by extension
 * Run: npx tsx scripts/count-files.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.turbo',
  '.vercel',
  '.git',
  '.cache',
  'coverage',
]);

const EXTENSIONS_TO_COUNT = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.css',
  '.scss',
  '.sass',
  '.md',
  '.mdx',
  '.html',
  '.svg',
  '.sql',
];

interface FileStats {
  [ext: string]: number;
}

function walkDir(dir: string, stats: FileStats, allFiles: string[]): void {
  let entries: fs.Dirent[];
  
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkDir(fullPath, stats, allFiles);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      
      if (EXTENSIONS_TO_COUNT.includes(ext)) {
        stats[ext] = (stats[ext] || 0) + 1;
        allFiles.push(fullPath);
      }
    }
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function main(): void {
  const rootDir = process.cwd();
  const stats: FileStats = {};
  const allFiles: string[] = [];

  console.log('🔍 Scanning Mercy Blade repository...\n');
  console.log(`Root: ${rootDir}\n`);

  walkDir(rootDir, stats, allFiles);

  // Calculate totals
  const totalFiles = Object.values(stats).reduce((a, b) => a + b, 0);

  // Sort by count (descending)
  const sortedEntries = Object.entries(stats).sort((a, b) => b[1] - a[1]);

  // Print report
  console.log('═══════════════════════════════════════');
  console.log('  MERCY BLADE CODE FILE STATISTICS');
  console.log('═══════════════════════════════════════\n');

  console.log(`Total files: ${formatNumber(totalFiles)}\n`);

  console.log('By extension:');
  console.log('─────────────────────────────────────');
  
  for (const [ext, count] of sortedEntries) {
    const percentage = ((count / totalFiles) * 100).toFixed(1);
    const bar = '█'.repeat(Math.ceil(count / totalFiles * 30));
    console.log(`  ${ext.padEnd(8)} ${formatNumber(count).padStart(5)}  (${percentage.padStart(5)}%)  ${bar}`);
  }

  console.log('─────────────────────────────────────\n');

  // Category breakdown
  const categories = {
    'TypeScript': (stats['.ts'] || 0) + (stats['.tsx'] || 0),
    'JavaScript': (stats['.js'] || 0) + (stats['.jsx'] || 0),
    'Styles': (stats['.css'] || 0) + (stats['.scss'] || 0) + (stats['.sass'] || 0),
    'Data/Config': stats['.json'] || 0,
    'Documentation': (stats['.md'] || 0) + (stats['.mdx'] || 0),
    'Other': (stats['.html'] || 0) + (stats['.svg'] || 0) + (stats['.sql'] || 0),
  };

  console.log('By category:');
  console.log('─────────────────────────────────────');
  
  for (const [category, count] of Object.entries(categories)) {
    if (count > 0) {
      const percentage = ((count / totalFiles) * 100).toFixed(1);
      console.log(`  ${category.padEnd(14)} ${formatNumber(count).padStart(5)}  (${percentage.padStart(5)}%)`);
    }
  }

  console.log('─────────────────────────────────────\n');

  // Directory breakdown (top-level only)
  const dirStats: { [dir: string]: number } = {};
  
  for (const file of allFiles) {
    const relativePath = path.relative(rootDir, file);
    const topDir = relativePath.split(path.sep)[0];
    dirStats[topDir] = (dirStats[topDir] || 0) + 1;
  }

  const sortedDirs = Object.entries(dirStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  console.log('Top directories:');
  console.log('─────────────────────────────────────');
  
  for (const [dir, count] of sortedDirs) {
    const percentage = ((count / totalFiles) * 100).toFixed(1);
    console.log(`  ${dir.padEnd(20)} ${formatNumber(count).padStart(5)}  (${percentage.padStart(5)}%)`);
  }

  console.log('─────────────────────────────────────\n');

  console.log(`Generated: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════\n');
}

main();
