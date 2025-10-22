import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const directories = [
  'src/data/rooms',
  'supabase/functions/ai-chat/data',
  'supabase/functions/room-chat/data'
];

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
    const data = JSON.parse(content);
    
    let modified = false;
    
    // Remove global disclaimer if present
    if (data.global_notes?.disclaimer) {
      delete data.global_notes.disclaimer;
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
    if (data.room_essay) {
      if (data.room_essay.en) {
        const cleaned = cleanText(data.room_essay.en);
        if (cleaned !== data.room_essay.en) {
          data.room_essay.en = cleaned;
          modified = true;
        }
      }
      if (data.room_essay.vi) {
        const cleaned = cleanText(data.room_essay.vi);
        if (cleaned !== data.room_essay.vi) {
          data.room_essay.vi = cleaned;
          modified = true;
        }
      }
      
      // Remove word count fields
      if (data.room_essay.word_count_en) {
        delete data.room_essay.word_count_en;
        modified = true;
      }
      if (data.room_essay.word_count_vi) {
        delete data.room_essay.word_count_vi;
        modified = true;
      }
      if (data.room_essay.updated_at) {
        delete data.room_essay.updated_at;
        modified = true;
      }
    }
    
    // Clean entries
    if (data.entries && Array.isArray(data.entries)) {
      data.entries.forEach((entry: any) => {
        // Remove disclaimer from entry
        if (entry.disclaimer) {
          delete entry.disclaimer;
          modified = true;
        }
        
        // Clean copy text
        if (entry.copy) {
          if (entry.copy.en) {
            const cleaned = cleanText(entry.copy.en);
            if (cleaned !== entry.copy.en) {
              entry.copy.en = cleaned;
              modified = true;
            }
          }
          if (entry.copy.vi) {
            const cleaned = cleanText(entry.copy.vi);
            if (cleaned !== entry.copy.vi) {
              entry.copy.vi = cleaned;
              modified = true;
            }
          }
          
          // Remove word count fields
          if (entry.copy.word_count_en) {
            delete entry.copy.word_count_en;
            modified = true;
          }
          if (entry.copy.word_count_vi) {
            delete entry.copy.word_count_vi;
            modified = true;
          }
        }
        
        // Clean title if present
        if (entry.title) {
          if (entry.title.en) {
            const cleaned = cleanText(entry.title.en);
            if (cleaned !== entry.title.en) {
              entry.title.en = cleaned;
              modified = true;
            }
          }
          if (entry.title.vi) {
            const cleaned = cleanText(entry.title.vi);
            if (cleaned !== entry.title.vi) {
              entry.title.vi = cleaned;
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
