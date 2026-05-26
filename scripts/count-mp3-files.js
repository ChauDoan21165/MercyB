import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function countMP3Files() {
  const audioDir = 'public/audio';
  let mp3Count = 0;
  const mp3Files = [];

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
        mp3Files.push(file);
      }
    }

    console.log(`\nTotal MP3 files in public/audio: ${mp3Count}`);
    console.log('\nMP3 files list:');
    mp3Files.sort().forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
}

countMP3Files();
