/**
 * Script to import JSON room files to Supabase rooms table
 * Run this once to migrate your Echologic Mercy Blade JSON data to Supabase
 * 
 * Usage:
 * 1. Install dependencies: npm install @supabase/supabase-js
 * 2. Set environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * 3. Run: npx tsx scripts/import-rooms-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Room ID mapping (slug to filename)
const roomFiles: { [key: string]: string } = {
  'abdominal-pain': 'abdominal_pain.json',
  'addiction': 'addiction.json',
  'ai': 'AI.json',
  'autoimmune': 'autoimmune_diseases.json',
  'burnout': 'burnout.json',
  'career-burnout': 'career_burnout.json',
  'business-negotiation': 'business_negotiation_compass.json',
  'business-strategy': 'business_strategy.json',
  'cancer-support': 'cancer_support.json',
  'cardiovascular': 'cardiovascular.json',
  'child-health': 'child_health.json',
  'cholesterol': 'cholesterol.json',
  'chronic-fatigue': 'chronic_fatigue.json',
  'cough': 'cough.json',
  'crypto': 'crypto.json',
  'depression': 'depression.json',
  'diabetes': 'diabetes.json',
  'digestive': 'digestive_system.json',
  'elderly-care': 'elderly_care.json',
  'endocrine': 'endocrine_system.json',
  'exercise-medicine': 'exercise_medicine.json',
  'fever': 'fever.json',
  'finance': 'finance.json',
  'fitness': 'fitness_room.json',
  'food-nutrition': 'food_and_nutrition.json',
  'grief': 'grief.json',
  'gut-brain': 'gut_brain_axis.json',
  'headache': 'headache.json',
  'soul-mate': 'how_to_find_your_soul_mate.json',
  'husband-dealing': 'husband_dealing.json',
  'hypertension': 'hypertension.json',
  'immune-system': 'immune_system.json',
  'immunity-boost': 'immunity_boost.json',
  'injury-bleeding': 'injury_and_bleeding.json',
  'matchmaker': 'matchmaker_traits.json',
  'mens-health': 'men_health.json',
  'mental-health': 'mental_health.json',
  'mindful-movement': 'mindful_movement.json',
  'mindfulness-healing': 'mindfulness_and_healing.json',
  'nutrition-basics': 'nutrition_basics.json',
  'obesity': 'obesity.json',
  'office-survival': 'office_survival.json',
  'pain-management': 'pain_management.json',
  'phobia': 'phobia.json',
  'rare-diseases': 'rare_diseases.json',
  'renal-health': 'renal_health.json',
  'reproductive': 'reproductive_health.json',
  'respiratory': 'respiratory_system.json',
  'screening': 'screening_and_prevention.json',
  'sexuality': 'sexuality_and_intimacy.json',
  'skin-health': 'skin_health.json',
  'sleep-health': 'sleep_health.json',
  'social-connection': 'social_connection.json',
  'speaking-crowd': 'speaking_crowd.json',
  'stoicism': 'stoicism.json',
  'stress-anxiety': 'stress_and_anxiety.json',
  'teen': 'teen.json',
  'toddler': 'toddler.json',
  'train-brain': 'train_brain_memory.json',
  'trauma': 'trauma.json',
  'user-profile-dashboard': 'user_profile_dashboard.json',
  'wife-dealing': 'wife_dealing.json',
  'womens-health': 'women_health.json',
  'habit-building': 'habit_building.json',
  'negotiation-mastery': 'negotiation_mastery.json',
  'diabetes-advanced': 'diabetes_advanced.json',
  'confidence-building': 'confidence_building.json',
  'financial-planning': 'financial_planning_101.json',
  'onboarding-free-users': 'onboarding_free_users.json',
  'parenting-toddlers': 'parenting_toddlers.json',
  'relationship-conflicts': 'relationship_conflicts.json',
  'weight-loss': 'weight_loss_program.json',
  'anxiety-toolkit': 'anxiety_toolkit.json',
};

// Extract keywords from entries for better search
function extractKeywords(entries: any[]): string[] {
  const keywords = new Set<string>();
  
  entries.forEach(entry => {
    // Add keywords from entry
    if (entry.keywords && Array.isArray(entry.keywords)) {
      entry.keywords.forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    // Add title words as keywords
    if (entry.title?.en) {
      entry.title.en.toLowerCase().split(/\s+/).forEach((word: string) => {
        if (word.length > 3) keywords.add(word);
      });
    }
  });
  
  return Array.from(keywords);
}

async function importRooms() {
  console.log('🚀 Starting room import...\n');
  
  const roomsDir = join(process.cwd(), 'src/data/rooms');
  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const [roomId, fileName] of Object.entries(roomFiles)) {
    try {
      const filePath = join(roomsDir, fileName);
      const fileContent = readFileSync(filePath, 'utf-8');
      const roomData = JSON.parse(fileContent);

      const keywords = extractKeywords(roomData.entries || []);

      const roomRecord = {
        id: roomId,
        schema_id: roomData.schema_id || roomId,
        title_en: roomData.title?.en || roomData.schema_id || roomId,
        title_vi: roomData.title?.vi || roomData.schema_id || roomId,
        room_essay_en: roomData.room_essay?.en || '',
        room_essay_vi: roomData.room_essay?.vi || '',
        safety_disclaimer_en: roomData.safety_disclaimer?.en || '',
        safety_disclaimer_vi: roomData.safety_disclaimer?.vi || '',
        crisis_footer_en: roomData.crisis_footer?.en || '',
        crisis_footer_vi: roomData.crisis_footer?.vi || '',
        entries: roomData.entries || [],
        keywords: keywords,
        tier: 'free', // Default tier, adjust as needed
      };

      const { error } = await supabase
        .from('rooms')
        .upsert(roomRecord, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Error importing ${roomId}:`, error.message);
        errors++;
      } else {
        console.log(`✅ Imported: ${roomId} (${keywords.length} keywords)`);
        imported++;
      }
    } catch (err) {
      console.error(`❌ Failed to process ${roomId}:`, err);
      errors++;
    }
  }

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n✨ Import complete!`);
}

importRooms().catch(console.error);
