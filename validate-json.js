const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '../src/data');
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
let valid = 0;
files.forEach(f => {
  const p = path.join(DATA_DIR, f);
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
    if (!data.keywords_en && data.entries.every(e => e.slug && Array.isArray(e.keywords_en) && e.keywords_en.length >= 3 && e.audio)) {
      console.log(`VALID: ${f}`);
      valid++;
    } else {
      console.log(`INVALID: ${f} - Check root keywords or entry fields`);
    }
  } catch (e) {
    console.log(`ERROR: ${f} - ${e.message}`);
  }
});
console.log(`\n${valid}/${files.length} VALID FILES!`);