import { readdir, unlink, stat } from 'fs/promises';
import { join } from 'path';

async function cleanupAndCountAudio() {
  const audioDir = 'public/audio';
  let mp3Count = 0;
  let deletedCount = 0;
  const deletedFiles = [];

  try {
    const files = await readdir(audioDir);

    for (const file of files) {
      const filePath = join(audioDir, file);
      const stats = await stat(filePath);

      // Skip directories
      if (stats.isDirectory()) {
        continue;
      }

      // Check if it's an MP3 file
      if (file.toLowerCase().endsWith('.mp3')) {
        mp3Count++;
      } else {
        // Delete non-MP3 files
        try {
          await unlink(filePath);
          deletedFiles.push(file);
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete ${file}:`, err.message);
        }
      }
    }

    console.log('\n=== CLEANUP COMPLETE ===');
    console.log(`Total MP3 files: ${mp3Count}`);
    console.log(`Files deleted: ${deletedCount}`);
    
    if (deletedFiles.length > 0) {
      console.log('\nDeleted files:');
      deletedFiles.forEach(file => console.log(`  - ${file}`));
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

cleanupAndCountAudio();
