/**
 * Audio Coverage Fix Proposal Script v1.0
 * 
 * Reads audio-coverage.csv exported from /admin/audio-coverage
 * Finds all rows with missing EN/VI audio
 * Sends batches (max 20 items) to OpenAI API
 * Proposes canonical filenames and outputs audio-missing-fix-plan.json
 * 
 * Usage: npx tsx scripts/propose-audio-fix-from-csv.ts
 */

import fs from 'fs';
import path from 'path';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const INPUT_CSV = 'audio-coverage.csv';
const OUTPUT_JSON = 'audio-missing-fix-plan.json';
const BATCH_SIZE = 20;

interface MissingAudioRow {
  roomId: string;
  tier: string;
  missingEn: string[];
  missingVi: string[];
}

interface FixProposal {
  original: string;
  proposed: string;
  roomId: string;
  language: 'en' | 'vi';
  entryIndex?: number;
}

interface FixPlan {
  generatedAt: string;
  totalMissing: number;
  proposals: FixProposal[];
}

// Parse CSV file
function parseCSV(filePath: string): MissingAudioRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const roomIdIdx = headers.findIndex(h => h.includes('room') && h.includes('id'));
  const tierIdx = headers.findIndex(h => h.includes('tier'));
  const missingEnIdx = headers.findIndex(h => h.includes('missing') && h.includes('en'));
  const missingViIdx = headers.findIndex(h => h.includes('missing') && h.includes('vi'));
  
  const rows: MissingAudioRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const missingEn = parseArrayField(values[missingEnIdx] || '');
    const missingVi = parseArrayField(values[missingViIdx] || '');
    
    if (missingEn.length > 0 || missingVi.length > 0) {
      rows.push({
        roomId: values[roomIdIdx]?.trim() || '',
        tier: values[tierIdx]?.trim() || '',
        missingEn,
        missingVi
      });
    }
  }
  
  return rows;
}

// Parse a single CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Parse array field like "[file1.mp3, file2.mp3]"
function parseArrayField(value: string): string[] {
  if (!value || value === '[]' || value === '') return [];
  const cleaned = value.replace(/^\[|\]$/g, '').trim();
  if (!cleaned) return [];
  return cleaned.split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
}

// Call OpenAI to propose canonical filenames
async function proposeFilenames(
  items: { original: string; roomId: string; language: 'en' | 'vi' }[]
): Promise<FixProposal[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable not set');
  }

  const prompt = `You are an audio filename normalizer. Given these audio file references that are missing, propose canonical filenames.

Rules for canonical filenames:
- All lowercase
- Use hyphens (no underscores or spaces)
- Start with roomId
- Add -entry-X if entry index is obvious from context
- End with -en.mp3 or -vi.mp3 based on language

Input items (JSON array):
${JSON.stringify(items, null, 2)}

Return a JSON array of objects with this exact structure:
[
  {
    "original": "original filename",
    "proposed": "canonical-filename-en.mp3",
    "roomId": "room-id",
    "language": "en",
    "entryIndex": 1
  }
]

Only return valid JSON, no explanations.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that normalizes audio filenames. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '[]';
  
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                      content.match(/```\s*([\s\S]*?)\s*```/) ||
                      [null, content];
    const jsonStr = jsonMatch[1] || content;
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    console.error('Failed to parse OpenAI response:', content);
    return items.map(item => ({
      original: item.original,
      proposed: `${item.roomId.toLowerCase().replace(/[_\s]/g, '-')}-${item.language}.mp3`,
      roomId: item.roomId,
      language: item.language,
    }));
  }
}

// Process in batches
async function processBatches(rows: MissingAudioRow[]): Promise<FixProposal[]> {
  const allItems: { original: string; roomId: string; language: 'en' | 'vi' }[] = [];
  
  // Flatten all missing files
  for (const row of rows) {
    for (const file of row.missingEn) {
      allItems.push({ original: file, roomId: row.roomId, language: 'en' });
    }
    for (const file of row.missingVi) {
      allItems.push({ original: file, roomId: row.roomId, language: 'vi' });
    }
  }
  
  console.log(`Total missing files: ${allItems.length}`);
  
  const allProposals: FixProposal[] = [];
  const batches = Math.ceil(allItems.length / BATCH_SIZE);
  
  for (let i = 0; i < batches; i++) {
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, allItems.length);
    const batch = allItems.slice(start, end);
    
    console.log(`Processing batch ${i + 1}/${batches} (${batch.length} items)...`);
    
    try {
      const proposals = await proposeFilenames(batch);
      allProposals.push(...proposals);
      
      // Rate limiting - wait 1 second between batches
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Batch ${i + 1} failed:`, error);
      // Fallback: add items with simple transformation
      for (const item of batch) {
        allProposals.push({
          original: item.original,
          proposed: `${item.roomId.toLowerCase().replace(/[_\s]/g, '-')}-${item.language}.mp3`,
          roomId: item.roomId,
          language: item.language,
        });
      }
    }
  }
  
  return allProposals;
}

// Main execution
async function main() {
  console.log('=== Audio Coverage Fix Proposal Script ===\n');
  
  // Check for input file
  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`Error: ${INPUT_CSV} not found.`);
    console.error('Please export the CSV from /admin/audio-coverage first.');
    process.exit(1);
  }
  
  // Check for API key
  if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable not set.');
    console.error('Set it with: export OPENAI_API_KEY=your-key');
    process.exit(1);
  }
  
  // Parse CSV
  console.log(`Reading ${INPUT_CSV}...`);
  const rows = parseCSV(INPUT_CSV);
  console.log(`Found ${rows.length} rooms with missing audio.\n`);
  
  if (rows.length === 0) {
    console.log('No missing audio found. Exiting.');
    process.exit(0);
  }
  
  // Process batches
  const proposals = await processBatches(rows);
  
  // Create fix plan
  const fixPlan: FixPlan = {
    generatedAt: new Date().toISOString(),
    totalMissing: proposals.length,
    proposals,
  };
  
  // Write output
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(fixPlan, null, 2));
  console.log(`\n✅ Fix plan saved to ${OUTPUT_JSON}`);
  console.log(`   Total proposals: ${proposals.length}`);
  
  // Summary by room
  const byRoom = new Map<string, number>();
  for (const p of proposals) {
    byRoom.set(p.roomId, (byRoom.get(p.roomId) || 0) + 1);
  }
  console.log(`   Rooms affected: ${byRoom.size}`);
  
  console.log('\n=== Done ===');
}

main().catch(console.error);
