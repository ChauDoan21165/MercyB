// Fix all JSON audio paths to "rooms/room-slug-entry.mp3"
const fs = require('fs');
const path = require('path');

const roomsDir = path.join(__dirname, '../public/audio/rooms');
const jsonDir = path.join(__dirname, '../public');

fs.readdirSync(jsonDir).forEach(file => {
  if (!file.endsWith('.json')) return;
  const filePath = path.join(jsonDir, file);
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!json.entries) return;
  
  const roomSlug = file.replace(/ /g, '-').replace(/_/g, '-').replace(/\.json$/, '').toLowerCase();
  
  json.entries.forEach(entry => {
    if (entry.audio) {
      const oldAudio = typeof entry.audio === 'object' ? entry.audio.en : entry.audio;
      const newAudio = `rooms/${roomSlug}-${entry.slug}.mp3`;
      entry.audio = newAudio;
      console.log(`${file} → ${oldAudio} → ${newAudio}`);
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`Fixed ${file}`);
});
