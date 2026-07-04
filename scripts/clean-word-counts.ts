import fs from 'fs';
import path from 'path';

/**
 * Script to remove word counts and redundant formatting from all room JSON files
 * Cleans up: "Word count: 123", "*Word count: 123*", "(Word count: 123)", etc.
 */

const roomDirs = [
  'src/data/rooms',
  'supabase/functions/ai-chat/data',
  'supabase/functions/room-chat/data'
];

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanContent(text: string): string {
  
  // Remove word count patterns, markdown bold, and cleanup
  let cleaned = text
    // Word count patterns (EN/VI)
    .replace(/\*?[Ww]ord [Cc]ount:?\s*\d+\*?/g, '')
    .replace(/\([Ww]ord [Cc]ount:?\s*\d+\)/g, '')
    .replace(/[Ss]ố từ:?\s*\d+/g, '')
    .replace(/\*[Ss]ố từ:?\s*\d+\*/g, '')
    .replace(/\([Ss]ố từ:?\s*\d+\)/g, '')
    // Remove markdown bold markers
    .replace(/\*\*/g, '');
  
  // Clean up extra whitespace/newlines left behind
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n').trim();
  
  return cleaned;
}

function cleanRoomFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) return false;
    const data = parsed;
    let modified = false;

    // Clean room_essay
    if (data.room_essay) {
      if (typeof data.room_essay === 'string') {
        const cleaned = cleanContent(data.room_essay);
        if (cleaned !== data.room_essay) {
          data.room_essay = cleaned;
          modified = true;
        }
      } else if (isRecord(data.room_essay)) {
        ['en', 'vi'].forEach(lang => {
          if (isRecord(data.room_essay) && typeof data.room_essay[lang] === 'string') {
            const cleaned = cleanContent(data.room_essay[lang]);
            if (cleaned !== data.room_essay[lang]) {
              data.room_essay[lang] = cleaned;
              modified = true;
            }
          }
        });
      }
    }

    // Clean entries
    if (Array.isArray(data.entries)) {
      data.entries.forEach((entryValue) => {
        if (!isRecord(entryValue)) return;
        const entry = entryValue;
        ['copy', 'content', 'body', 'copy_en', 'copy_vi', 'content_en', 'content_vi'].forEach(field => {
          if (entry[field]) {
            if (typeof entry[field] === 'string') {
              const cleaned = cleanContent(entry[field]);
              if (cleaned !== entry[field]) {
                entry[field] = cleaned;
                modified = true;
              }
            } else if (isRecord(entry[field])) {
              ['en', 'vi'].forEach(lang => {
                const block = entry[field];
                if (isRecord(block) && typeof block[lang] === 'string') {
                  const cleaned = cleanContent(block[lang]);
                  if (cleaned !== block[lang]) {
                    block[lang] = cleaned;
                    modified = true;
                  }
                }
              });
            }
          }
        });
      });
    }
    
    // Remove room-level disclaimers and global safety notes
    const removedAny = (() => {
      let changed = false;
      ['safety_disclaimer', 'crisis_footer', 'safety_footer'].forEach((key) => {
        if (data[key]) { delete data[key]; changed = true; }
      });
      if (isRecord(data.global_notes)) {
        ['safety', 'disclaimer'].forEach((k) => {
          if (isRecord(data.global_notes) && data.global_notes[k]) { delete data.global_notes[k]; changed = true; }
        });
        if (Object.keys(data.global_notes).length === 0) {
          delete data.global_notes;
          changed = true;
        }
      }
      return changed;
    })();
    if (removedAny) modified = true;

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✓ Cleaned: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error);
    return false;
  }
}

function processDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return 0;
  }

  const files = fs.readdirSync(dir);
  let cleanedCount = 0;

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dir, file);
      if (cleanRoomFile(filePath)) {
        cleanedCount++;
      }
    }
  });

  return cleanedCount;
}

console.log('🧹 Cleaning word counts from room files...\n');

let totalCleaned = 0;
roomDirs.forEach(dir => {
  console.log(`Processing: ${dir}`);
  const cleaned = processDirectory(dir);
  totalCleaned += cleaned;
  console.log(`  ${cleaned} files cleaned\n`);
});

console.log(`\n✨ Done! ${totalCleaned} files cleaned total.`);
