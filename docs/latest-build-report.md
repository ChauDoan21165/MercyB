# Build Diagnosis Report

## Date: 2025-12-03

## Issues Found & Fixed

### 1. netlify.toml Misconfiguration (CRITICAL)
**Category**: Build Configuration Error

**Problem**: 
- `netlify.toml` was configured for Next.js (`.next` publish directory, `@netlify/plugin-nextjs`)
- This is a **Vite/React** project that outputs to `dist/`

**Fix**:
- Changed `publish = ".next"` → `publish = "dist"`
- Removed `@netlify/plugin-nextjs` plugin reference
- Fixed redirect paths from `/public/data/*` → `/data/*`

### 2. Missing `voiceQuiet` key in EN companion JSON
**Category**: Data Integrity

**Problem**:
- `public/data/companion_lines_friend_vi.json` had `voiceQuiet` key
- `public/data/companion_lines_friend_en.json` was missing this key
- `getRandomCompanionLine('voiceQuiet')` would return undefined for EN users

**Fix**:
- Added `voiceQuiet` array to EN JSON file with 2 fallback messages

## Files Changed
1. `netlify.toml` - Fixed build config for Vite
2. `public/data/companion_lines_friend_en.json` - Added missing `voiceQuiet` key

## Before Editing These Areas

### Companion System
- All categories in `CompanionCategory` type must exist in BOTH JSON files
- Test with both EN and VI language settings
- The files are fetched at runtime, not imported statically

### Build Config
- This is a Vite project, NOT Next.js
- Build outputs to `dist/` directory
- Do not add Next.js specific configurations
