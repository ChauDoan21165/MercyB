#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes build output and generates performance report
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const OUTPUT_FILE = path.join(__dirname, '../docs/BUNDLE_ANALYSIS.md');

/**
 * Get file size in KB
 */
function getFileSizeKB(filepath) {
  const stats = fs.statSync(filepath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Analyze dist directory
 */
function analyzeDist() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  const assetsDir = path.join(DIST_DIR, 'assets');
  const files = fs.readdirSync(assetsDir);

  const jsFiles = files.filter(f => f.endsWith('.js')).map(f => ({
    name: f,
    size: getFileSizeKB(path.join(assetsDir, f)),
  }));

  const cssFiles = files.filter(f => f.endsWith('.css')).map(f => ({
    name: f,
    size: getFileSizeKB(path.join(assetsDir, f)),
  }));

  // Sort by size descending
  jsFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
  cssFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));

  return { jsFiles, cssFiles };
}

/**
 * Generate markdown report
 */
function generateReport(data) {
  const totalJS = data.jsFiles.reduce((sum, f) => sum + parseFloat(f.size), 0);
  const totalCSS = data.cssFiles.reduce((sum, f) => sum + parseFloat(f.size), 0);

  let report = `# Bundle Analysis Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total JS**: ${totalJS.toFixed(2)} KB\n`;
  report += `- **Total CSS**: ${totalCSS.toFixed(2)} KB\n`;
  report += `- **Total Assets**: ${(totalJS + totalCSS).toFixed(2)} KB\n\n`;

  // Largest JS chunks
  report += `## JavaScript Bundles\n\n`;
  report += `| File | Size (KB) | Notes |\n`;
  report += `|------|-----------|-------|\n`;
  data.jsFiles.forEach(f => {
    let notes = '';
    if (f.name.includes('vendor')) notes = 'Vendor chunk';
    else if (f.name.includes('admin')) notes = 'Admin (lazy)';
    else if (f.name.includes('index')) notes = 'Main entry';
    report += `| ${f.name} | ${f.size} | ${notes} |\n`;
  });

  report += `\n## CSS Bundles\n\n`;
  report += `| File | Size (KB) |\n`;
  report += `|------|----------|\n`;
  data.cssFiles.forEach(f => {
    report += `| ${f.name} | ${f.size} |\n`;
  });

  report += `\n## Optimization Recommendations\n\n`;
  
  // Check for large chunks
  const largeChunks = data.jsFiles.filter(f => parseFloat(f.size) > 500);
  if (largeChunks.length > 0) {
    report += `⚠️ **Large chunks detected:**\n\n`;
    largeChunks.forEach(f => {
      report += `- ${f.name} (${f.size} KB) - Consider splitting further\n`;
    });
    report += `\n`;
  }

  report += `✅ **Optimizations applied:**\n\n`;
  report += `- Code splitting for admin routes\n`;
  report += `- Vendor chunk separation (React, Supabase, UI libs)\n`;
  report += `- Tree shaking enabled\n`;
  report += `- Minification with Terser\n`;
  report += `- Console.log removal in production\n`;

  return report;
}

/**
 * Main
 */
function main() {
  console.log('🔍 Analyzing bundle...\n');
  
  const data = analyzeDist();
  const report = generateReport(data);

  // Write report
  fs.writeFileSync(OUTPUT_FILE, report);
  
  console.log('✅ Bundle analysis complete');
  console.log(`📄 Report: ${OUTPUT_FILE}\n`);
  
  // Print summary
  const totalJS = data.jsFiles.reduce((sum, f) => sum + parseFloat(f.size), 0);
  console.log(`Total JS: ${totalJS.toFixed(2)} KB`);
  console.log(`Largest chunk: ${data.jsFiles[0].name} (${data.jsFiles[0].size} KB)`);
}

main();
