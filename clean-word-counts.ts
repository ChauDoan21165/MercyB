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

function cleanContent(text: string): string {
  if (typeof text !== 'string') return text as any;
  
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
    const data = JSON.parse(content);
    let modified = false;

    // Clean room_essay
    if (data.room_essay) {
      if (typeof data.room_essay === 'string') {
        const cleaned = cleanContent(data.room_essay);
        if (cleaned !== data.room_essay) {
          data.room_essay = cleaned;
          modified = true;
        }
      } else if (typeof data.room_essay === 'object') {
        ['en', 'vi'].forEach(lang => {
          if (data.room_essay[lang]) {
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
      data.entries.forEach((entry: any) => {
        ['copy', 'content', 'body', 'copy_en', 'copy_vi', 'content_en', 'content_vi'].forEach(field => {
          if (entry[field]) {
            if (typeof entry[field] === 'string') {
              const cleaned = cleanContent(entry[field]);
              if (cleaned !== entry[field]) {
                entry[field] = cleaned;
                modified = true;
              }
            } else if (typeof entry[field] === 'object') {
              ['en', 'vi'].forEach(lang => {
                if (entry[field][lang]) {
                  const cleaned = cleanContent(entry[field][lang]);
                  if (cleaned !== entry[field][lang]) {
                    entry[field][lang] = cleaned;
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
      if (data.global_notes) {
        ['safety', 'disclaimer'].forEach((k) => {
          if (data.global_notes[k]) { delete data.global_notes[k]; changed = true; }
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
