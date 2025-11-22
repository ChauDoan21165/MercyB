/**
 * Shared helper for loading Kids Room JSON data
 * Used by KidsChat and KidsRoomHealthCheck to ensure consistent JSON file resolution
 */

export interface KidsEntry {
  id: string;
  content_en: string;
  content_vi: string;
  keywords_en: string[];
  keywords_vi: string[];
  audio_url: string | null;
  display_order: number;
}

/**
 * Maps room IDs to custom JSON filenames
 * If a room ID is not in this map, a default filename will be generated
 */
export const KIDS_ROOM_JSON_MAP: Record<string, string> = {
  // Level 1 rooms
  "alphabet-adventure": "alphabet_adventure_kids_l1.json",
  "colors-shapes": "colors_shapes_kids_l1.json",
  "numbers-counting": "numbers_counting_kids_l1.json",
  "opposites-matching": "opposites_matching_kids_l1.json",
  "body-parts-movement": "body_parts_movement_kids_l1.json",
  "feelings-emotions": "feelings_emotions_kids_l1.json",
  "first-action-verbs": "first_action_verbs_kids_l1.json",
  "size-comparison": "size_comparison_kids_l1\".json",
  "simple-questions": "simple_questions_kids_l1.json",
  "early-phonics": "early_phonics_sounds_kids_l1.json",
  "family-home": "family_home_words_kids_l1.json",
  "rooms-house": "rooms_in_the_house_kids_l1.json",
  "clothes-dressing": "clothes_dressing_kids_l1.json",
  "food-snacks": "food_snacks_kids_l1.json",
  "drinks-treats": "drinks_treats_kids_l1.json",
  "daily-routines": "daily_routines_kids_l1.json",
  "bedtime-words": "bedtime_words_kids_l1.json",
  "bathroom-hygiene": "bathroom_hygiene_kids_l1.json",
  "school-objects": "school_objects_kids_l1.json",
  "playground-words": "playground_words_kids_l1.json",
  "toys-playtime": "toys_playtime_kids_l1.json",
  "animals-sounds": "animals_sounds_kids_l1.json",
  "farm-animals": "farm_animals_kids_l1.json",
  "wild-animals": "wild_animals_kids_l1.json",
  "pets-caring": "pets_caring_kids_l1.json",
  "nature-explorers": "nature_explorers_kids_l1.json",
  "weather-kids": "weather_for_kids_l1.json",
  "colors-nature": "colors_nature_kids_l1.json",
  "magic-story": "magic_story_words_kids_l1.json",
  "make-believe": "make_believe_kids_l1.json",

  // Level 2 rooms
  "school-life": "school_life_vocabulary_kids_l2.json",
  "classroom-english": "classroom_english_kids_l2.json",
  "math-words": "math_words_kids_l2.json",
  "science-basics": "science_basics_kids_l2.json",
  "geography-basics": "geography_basics_kids_l2.json",
  "reading-skills": "reading_skills_kids_l2.json",
  "spelling-patterns": "spelling_patterns_kids_l2.json",
  "project-vocab": "project_vocabulary_kids_l2.json",
  "art-creativity": "art_creativity_words_kids_l2.json",
  "hobbies-fun": "hobbies_fun_activities_kids_l2.json",
  "games-sports": "games_sports_kids_l2.json",
  "friendship-kindness": "friendship_kindness_kids_l2.json",
  "social-skills": "social_skills_kids_l2.json",
  "community-helpers": "community_helpers_kids_l2.json",
  "safety-rules": "safety_rules_kids_l2\".json",
  "healthy-habits": "healthy_habits_kids_l2.json",
  "travel-transport": "travel_transport_kids_l2\".json",
  "daily-conversations": "daily_conversations_kids_l2.json",
  "weather-seasons": "weather_seasons_kids_l2.json",
  "space-planets": "space_planets_kids_l2.json",
  "animals-world": "animals_around_world_kids_l2.json",
  "experiments-vocab": "simple_experiments_vocabulary_kids_l2.json",
  "world-cultures": "world_cultures_kids_l2.json",
  "environment-nature": "environment_nature_kids_l2.json",
  "adventure-discovery": "adventure_discovery_words_kids_l2.json",
  "story-builder": "story_builder_kids_l2.json",

  // Level 3 rooms (JSON-spec based)
  "creative-writing": "creative_writing_basics_kids_l3\".json",
  "conversation-starters": "conversation_starters_kids_l3.json",
};

/**
 * Get the JSON filename for a room
 * Checks KIDS_ROOM_JSON_MAP first, then generates a default filename
 */
export function getKidsJsonFilename(roomId: string, levelId: string): string {
  const filenameFromMap = KIDS_ROOM_JSON_MAP[roomId];
  
  if (filenameFromMap) {
    return filenameFromMap;
  }

  const suffix =
    levelId === "level1" ? "kids_l1" :
    levelId === "level2" ? "kids_l2" :
    levelId === "level3" ? "kids_l3" : "kids";

  return `${roomId.replace(/-/g, "_")}_${suffix}.json`;
}

/**
 * Fetch and parse a kids room JSON file, returning structured entries
 * Used by KidsChat for display and KidsRoomHealthCheck for data import
 */
export async function fetchKidsRoomJson(roomId: string, levelId: string): Promise<KidsEntry[]> {
  const filename = getKidsJsonFilename(roomId, levelId);

  try {
    const response = await fetch(`/data/${filename}`);
    
    if (!response.ok) {
      throw new Error(`JSON file not found: /data/${filename}`);
    }

    const json = await response.json();

    if (!json.entries || !Array.isArray(json.entries)) {
      throw new Error(`Invalid JSON structure in ${filename}: missing or invalid entries array`);
    }

    const entries: KidsEntry[] = json.entries.map((entry: any, index: number) => {
      let contentEn = "";
      let contentVi = "";

      if (entry.copy) {
        contentEn = entry.copy.en || "";
        contentVi = entry.copy.vi || "";
      } else if (entry.content) {
        contentEn = entry.content.en || "";
        contentVi = entry.content.vi || "";
      }

      // Extract keywords
      const keywordsEn = Array.isArray(entry.keywords_en) ? entry.keywords_en : [];
      const keywordsVi = Array.isArray(entry.keywords_vi) ? entry.keywords_vi : [];

      let audioUrl = entry.audio || entry.audio_url || null;
      
      // Handle multiple audio files (space-separated) for playlist
      if (audioUrl && typeof audioUrl === 'string') {
        const audioFiles = audioUrl.trim().split(/\s+/);
        if (audioFiles.length > 1) {
          // Multiple files - create playlist array
          audioUrl = audioFiles.map(file => {
            if (file.startsWith("http")) return file;
            let p = file.trim().replace(/^\/+/, "");
            return p.startsWith("audio/") ? `/${p}` : `/audio/${p}`;
          }).join(" ");
        } else if (!audioUrl.startsWith("http")) {
          // Single file
          let p = String(audioUrl).trim().replace(/^\/+/, "");
          audioUrl = p.startsWith("audio/") ? `/${p}` : `/audio/${p}`;
        }
      }

      return {
        id: `${roomId}-${index + 1}`,
        content_en: contentEn,
        content_vi: contentVi,
        keywords_en: keywordsEn,
        keywords_vi: keywordsVi,
        audio_url: audioUrl,
        display_order: index + 1,
      };
    });

    return entries;
  } catch (error) {
    console.error(`Failed to load JSON for room ${roomId}:`, error);
    throw error;
  }
}

/**
 * Fetch raw JSON data for a room (used by KidsRoomHealthCheck for database import)
 */
export async function fetchKidsRoomRawJson(roomId: string, levelId: string): Promise<any> {
  const filename = getKidsJsonFilename(roomId, levelId);
  
  const response = await fetch(`/data/${filename}`);
  
  if (!response.ok) {
    throw new Error(`JSON file not found: /data/${filename}`);
  }

  return response.json();
}
