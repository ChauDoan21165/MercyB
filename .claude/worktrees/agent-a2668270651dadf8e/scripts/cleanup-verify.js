#!/usr/bin/env node

/**
 * Root Directory Cleanup Verification Script
 * Checks for proper file organization and generates a cleanup report
 */

const fs = require('fs');
const path = require('path');

// Define expected root-level items
const EXPECTED_ROOT_ITEMS = {
  files: [
    '.gitignore',
    'components.json',
    'index.html',
    'package.json',
    'package-lock.json',
    'bun.lockb',
    'postcss.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    '.env',
    'README.md'
  ],
  directories: [
    'public',
    'src',
    'supabase',
    'scripts',
    'node_modules',
    '.git'
  ]
};

// Define where different file types should be
const FILE_LOCATIONS = {
  data: 'public/data',
  audio: 'public/audio',
  images: 'public/images',
  scripts: 'scripts',
  components: 'src/components',
  pages: 'src/pages',
  types: 'src/types',
  utils: 'src/utils',
  hooks: 'src/hooks'
};

const report = {
  timestamp: new Date().toISOString(),
  rootItems: [],
  misplacedFiles: [],
  properlyOrganized: [],
  warnings: [],
  recommendations: []
};

function analyzeRootDirectory() {
  console.log('🔍 Analyzing root directory structure...\n');
  
  try {
    const rootItems = fs.readdirSync('.').filter(item => !item.startsWith('.'));
    
    rootItems.forEach(item => {
      const itemPath = path.join('.', item);
      const stats = fs.statSync(itemPath);
      const isExpected = EXPECTED_ROOT_ITEMS.files.includes(item) || 
                        EXPECTED_ROOT_ITEMS.directories.includes(item);
      
      report.rootItems.push({
        name: item,
        type: stats.isDirectory() ? 'directory' : 'file',
        expected: isExpected
      });
      
      if (!isExpected && !item.startsWith('.')) {
        report.misplacedFiles.push({
          name: item,
          type: stats.isDirectory() ? 'directory' : 'file',
          currentLocation: './',
          suggestedLocation: getSuggestedLocation(item, stats.isDirectory())
        });
      }
    });
    
    // Check data organization
    checkDataOrganization();
    
    // Check audio organization
    checkAudioOrganization();
    
    // Generate recommendations
    generateRecommendations();
    
  } catch (error) {
    report.warnings.push(`Error analyzing root directory: ${error.message}`);
  }
}

function getSuggestedLocation(itemName, isDirectory) {
  const ext = path.extname(itemName).toLowerCase();
  
  if (ext === '.json') return FILE_LOCATIONS.data;
  if (['.mp3', '.wav', '.ogg'].includes(ext)) return FILE_LOCATIONS.audio;
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) return FILE_LOCATIONS.images;
  if (ext === '.js' || ext === '.ts') return FILE_LOCATIONS.scripts;
  if (isDirectory && itemName.toLowerCase().includes('component')) return FILE_LOCATIONS.components;
  
  return 'Please review manually';
}

function checkDataOrganization() {
  console.log('📁 Checking data organization...\n');
  
  const dataDir = 'public/data';
  if (!fs.existsSync(dataDir)) {
    report.warnings.push('public/data directory does not exist');
    return;
  }
  
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  
  dataFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    report.properlyOrganized.push({
      file: filePath,
      category: 'data',
      status: '✅ Properly located'
    });
  });
  
  console.log(`✅ Found ${dataFiles.length} data files in proper location`);
}

function checkAudioOrganization() {
  console.log('🎵 Checking audio organization...\n');
  
  const audioDir = 'public/audio';
  if (!fs.existsSync(audioDir)) {
    report.warnings.push('public/audio directory does not exist - create it for audio files');
    return;
  }
  
  const audioFiles = fs.readdirSync(audioDir).filter(f => 
    ['.mp3', '.wav', '.ogg'].includes(path.extname(f).toLowerCase())
  );
  
  console.log(`✅ Found ${audioFiles.length} audio files in proper location`);
}

function generateRecommendations() {
  if (report.misplacedFiles.length > 0) {
    report.recommendations.push('Move misplaced files to their suggested locations');
  }
  
  if (!fs.existsSync('public/audio')) {
    report.recommendations.push('Create public/audio directory for audio files');
  }
  
  if (!fs.existsSync('public/images')) {
    report.recommendations.push('Create public/images directory for image assets');
  }
  
  report.recommendations.push('Ensure all data JSON files are in public/data/');
  report.recommendations.push('Ensure all audio files are in public/audio/');
  report.recommendations.push('Keep root directory clean with only essential config files');
}

function generateMarkdownReport() {
  let markdown = `# 🧹 Root Directory Cleanup Report

Generated: ${new Date().toLocaleString()}

---

## 📊 Root Directory Analysis

### Current Root Items (${report.rootItems.length} items)

| Item | Type | Status |
|------|------|--------|
`;

  report.rootItems.forEach(item => {
    const status = item.expected ? '✅ Expected' : '⚠️ Unexpected';
    markdown += `| ${item.name} | ${item.type} | ${status} |\n`;
  });

  if (report.misplacedFiles.length > 0) {
    markdown += `\n---

## ⚠️ Misplaced Files (${report.misplacedFiles.length})

These files should be moved to proper locations:

| File | Type | Current Location | Suggested Location |
|------|------|------------------|-------------------|
`;

    report.misplacedFiles.forEach(item => {
      markdown += `| ${item.name} | ${item.type} | ${item.currentLocation} | ${item.suggestedLocation} |\n`;
    });
  } else {
    markdown += `\n---

## ✅ No Misplaced Files

All root-level items are properly organized!
`;
  }

  if (report.warnings.length > 0) {
    markdown += `\n---

## ⚠️ Warnings

`;
    report.warnings.forEach(warning => {
      markdown += `- ${warning}\n`;
    });
  }

  markdown += `\n---

## 💡 Recommendations

`;
  report.recommendations.forEach(rec => {
    markdown += `- ${rec}\n`;
  });

  markdown += `\n---

## 📁 Expected Directory Structure

\`\`\`
project-root/
├── public/
│   ├── data/          # JSON data files
│   ├── audio/         # Audio files (.mp3, .wav, etc.)
│   └── images/        # Image assets
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
├── scripts/           # Build and utility scripts
├── supabase/          # Supabase configuration
└── [config files]     # Root-level config files only
\`\`\`

---

## 🔧 Action Items

`;

  if (report.misplacedFiles.length > 0) {
    markdown += `- [ ] Move ${report.misplacedFiles.length} misplaced file(s) to suggested locations\n`;
  }
  
  markdown += `- [ ] Verify all data files are in public/data/
- [ ] Verify all audio files are in public/audio/
- [ ] Remove any unnecessary files from root directory
- [ ] Update import paths if files are moved

---

**Run this script regularly to maintain clean project structure:**
\`\`\`bash
node scripts/cleanup-verify.js
\`\`\`
`;

  return markdown;
}

// Run analysis
analyzeRootDirectory();

// Generate and save report
const reportContent = generateMarkdownReport();
fs.writeFileSync('CLEANUP_REPORT.md', reportContent);

console.log('\n✅ Cleanup report generated: CLEANUP_REPORT.md');
console.log(`\nSummary:`);
console.log(`- Total root items: ${report.rootItems.length}`);
console.log(`- Misplaced files: ${report.misplacedFiles.length}`);
console.log(`- Warnings: ${report.warnings.length}`);
console.log(`- Recommendations: ${report.recommendations.length}`);

// Exit with code based on findings
process.exit(report.misplacedFiles.length > 0 ? 1 : 0);
