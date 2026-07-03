import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const directories = [
  'src/data/rooms',
  'supabase/functions/ai-chat/data',
  'supabase/functions/room-chat/data'
];

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function cleanText(text: string): string {
  if (!text) return text;
  
  // Remove bold markers (**)
  let cleaned = text.replace(/\*\*/g, '');
  
  // Remove word count lines (English and Vietnamese)
  cleaned = cleaned.replace(/\*Word count:\s*\d+\*/gi, '');
  cleaned = cleaned.replace(/\*Số từ:\s*\d+\*/gi, '');
  
  // Remove timestamps (various formats)
  cleaned = cleaned.replace(/\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?/gi, '');
  
  // Remove extra newlines and whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  
  return cleaned;
}

function processRoomFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const parsed: unknown = JSON.parse(content);
    if (!isRecord(parsed)) return false;
    const data = parsed;
    
    let modified = false;
    
    // Remove global disclaimer if present
    const globalNotes = isRecord(data.global_notes) ? data.global_notes : null;
    if (globalNotes?.disclaimer) {
      delete globalNotes.disclaimer;
      modified = true;
    }
    
    if (data.safety_disclaimer) {
      delete data.safety_disclaimer;
      modified = true;
    }
    
    if (data.disclaimer) {
      delete data.disclaimer;
      modified = true;
    }
    
    // Clean room_essay
    const roomEssay = isRecord(data.room_essay) ? data.room_essay : null;
    if (roomEssay) {
      if (typeof roomEssay.en === 'string') {
        const cleaned = cleanText(roomEssay.en);
        if (cleaned !== roomEssay.en) {
          roomEssay.en = cleaned;
          modified = true;
        }
      }
      if (typeof roomEssay.vi === 'string') {
        const cleaned = cleanText(roomEssay.vi);
        if (cleaned !== roomEssay.vi) {
          roomEssay.vi = cleaned;
          modified = true;
        }
      }
      
      // Remove word count fields
      if (roomEssay.word_count_en) {
        delete roomEssay.word_count_en;
        modified = true;
      }
      if (roomEssay.word_count_vi) {
        delete roomEssay.word_count_vi;
        modified = true;
      }
      if (roomEssay.updated_at) {
        delete roomEssay.updated_at;
        modified = true;
      }
    }
    
    // Clean entries
    if (data.entries && Array.isArray(data.entries)) {
      data.entries.forEach((entryValue) => {
        if (!isRecord(entryValue)) return;
        const entry = entryValue;
        // Remove disclaimer from entry
        if (entry.disclaimer) {
          delete entry.disclaimer;
          modified = true;
        }
        
        // Clean copy text
        const copy = isRecord(entry.copy) ? entry.copy : null;
        if (copy) {
          if (typeof copy.en === 'string') {
            const cleaned = cleanText(copy.en);
            if (cleaned !== copy.en) {
              copy.en = cleaned;
              modified = true;
            }
          }
          if (typeof copy.vi === 'string') {
            const cleaned = cleanText(copy.vi);
            if (cleaned !== copy.vi) {
              copy.vi = cleaned;
              modified = true;
            }
          }
          
          // Remove word count fields
          if (copy.word_count_en) {
            delete copy.word_count_en;
            modified = true;
          }
          if (copy.word_count_vi) {
            delete copy.word_count_vi;
            modified = true;
          }
        }
        
        // Clean title if present
        const title = isRecord(entry.title) ? entry.title : null;
        if (title) {
          if (typeof title.en === 'string') {
            const cleaned = cleanText(title.en);
            if (cleaned !== title.en) {
              title.en = cleaned;
              modified = true;
            }
          }
          if (typeof title.vi === 'string') {
            const cleaned = cleanText(title.vi);
            if (cleaned !== title.vi) {
              title.vi = cleaned;
              modified = true;
            }
          }
        }
        
        // Remove timestamps
        if (entry.created_at) {
          delete entry.created_at;
          modified = true;
        }
        if (entry.updated_at) {
          delete entry.updated_at;
          modified = true;
        }
      });
    }
    
    if (modified) {
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`✓ Cleaned: ${filePath}`);
      return true;
    } else {
      console.log(`- No changes: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error);
    return false;
  }
}

function processDirectory(dirPath: string) {
  try {
    const files = readdirSync(dirPath);
    let processedCount = 0;
    let modifiedCount = 0;
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        processedCount++;
        const filePath = join(dirPath, file);
        if (processRoomFile(filePath)) {
          modifiedCount++;
        }
      }
    });
    
    console.log(`\nDirectory: ${dirPath}`);
    console.log(`Processed: ${processedCount} files`);
    console.log(`Modified: ${modifiedCount} files\n`);
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

console.log('Starting room entry cleanup...\n');

directories.forEach(dir => {
  processDirectory(dir);
});

console.log('Cleanup complete!');
