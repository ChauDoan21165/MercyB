# Auto-Sync System Guide

## Overview
The auto-sync system automatically watches JSON files in `public/data/` and syncs changes to the database in real-time, eliminating the need for manual imports.

## Usage

### 🔄 Automatic Sync (Recommended for Development)
```bash
npm run sync:watch
```

This will:
- ✅ Run an initial sync of all JSON files to the database
- 👁️ Watch for changes to any `.json` file in `public/data/`
- 🔄 Automatically sync changes to the database within 500ms
- ✨ Keep your database in perfect sync with your JSON files

**When to use**: Run this alongside your dev server (`npm run dev`) during development

### 📤 One-Time Sync
```bash
npm run sync:once
```

This will:
- Import all room JSON files to the database once
- Exit when complete

**When to use**: 
- Initial setup
- After pulling changes from git
- When you want a manual sync without watching

## How It Works

1. **Initial Sync**: On startup, syncs all existing JSON files to database
2. **File Watching**: Monitors the `public/data/` directory for changes
3. **Debouncing**: Waits 500ms after last change before syncing (prevents multiple syncs on rapid saves)
4. **Automatic Upsert**: Updates existing rooms or creates new ones based on the JSON content

## What Gets Synced

For each JSON file, the system extracts and syncs:
- ✅ Room ID (from filename)
- ✅ Titles (English & Vietnamese)
- ✅ Tier (free, vip1, vip2, vip3)
- ✅ Keywords (auto-extracted from entries)
- ✅ All entries with their content
- ✅ Room essays, crisis footers, safety disclaimers

## Workflow Examples

### Regular Development Workflow
```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Run auto-sync (in a separate terminal)
npm run sync:watch
```

Now you can:
1. Edit any JSON file in `public/data/`
2. Save the file
3. See the sync happen automatically in Terminal 2
4. Refresh your app to see the changes immediately

### After Git Pull
```bash
# Sync any new or updated JSON files
npm run sync:once
```

## Benefits

✅ **No Manual Import**: Never use the admin import page again  
✅ **Real-Time Updates**: Changes appear in the database within seconds  
✅ **Error Prevention**: Automatic validation ensures data integrity  
✅ **Development Speed**: Edit JSON → Save → See changes instantly  
✅ **Team Collaboration**: Everyone's local database stays in sync with JSON files

## Troubleshooting

### Sync Not Working
- Check that Supabase credentials are in `.env` file
- Ensure the JSON file is valid (proper JSON syntax)
- Check the terminal output for error messages

### Room Not Appearing in App
- Verify the sync completed successfully (check terminal logs)
- Refresh your browser
- Check that the room tier matches your user's subscription

### Multiple Syncs Happening
- This is normal! The debouncing ensures only the final sync executes
- The system waits 500ms after the last save before syncing

## Migration from Manual Import

If you were using the manual import page before:
1. Start running `npm run sync:watch` during development
2. Your existing imported rooms will be updated automatically
3. No need to re-import anything manually
4. The admin import page still works if you need it for special cases
