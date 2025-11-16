/**
 * Room-specific keyword highlighting configuration
 * Loads custom keyword colors from room JSON files
 */

import { CustomKeywordMapping } from './keywordColors';

export interface RoomKeywordConfig {
  highlighted_words?: {
    en: string[];
    vi: string[];
    color: string;
  }[];
}

/**
 * Load keyword highlighting configuration from room data
 */
export async function loadRoomKeywords(roomId: string): Promise<CustomKeywordMapping[]> {
  try {
    // Try to fetch room data from public/data
    const response = await fetch(`/data/${roomId}.json`);
    if (!response.ok) {
      return [];
    }
    
    const roomData = await response.json() as RoomKeywordConfig;
    
    // Extract highlighted_words configuration if it exists
    if (roomData.highlighted_words && Array.isArray(roomData.highlighted_words)) {
      return roomData.highlighted_words.map(hw => ({
        en: hw.en || [],
        vi: hw.vi || [],
        color: hw.color
      }));
    }
    
    return [];
  } catch (error) {
    console.error(`Failed to load room keywords for ${roomId}:`, error);
    return [];
  }
}

/**
 * Generate default color palette for English learning rooms
 * These colors are optimized for readability and semantic meaning
 */
export const ENGLISH_LEARNING_COLORS = {
  // Grammar & Structure
  grammar: '#B8D4F1',      // Calm blue for grammar concepts
  structure: '#C8E6F5',    // Light blue for structural elements
  syntax: '#A8E6F5',       // Bright blue for syntax
  
  // Skills & Methods
  skill: '#90EE90',        // Growth green for skills
  method: '#98FB98',       // Fresh green for methods
  technique: '#A8F0A8',    // Soft green for techniques
  
  // Learning Process
  practice: '#D8F0E6',     // Calm green for practice
  learning: '#E0F5F8',     // Cool blue-green for learning
  training: '#D8F0F5',     // Light blue for training
  
  // Cognitive
  thinking: '#E0D8F5',     // Purple for thinking
  processing: '#D9C8F0',   // Soft purple for processing
  cognitive: '#C4EAEA',    // Teal for cognitive
  
  // Performance
  fluency: '#FFE0CC',      // Warm peach for fluency
  momentum: '#FFD8B8',     // Light orange for momentum
  productivity: '#FFF4D8', // Bright yellow for productivity
  
  // Strategy
  strategy: '#D8F0F5',     // Strategic blue
  planning: '#E0F5F8',     // Planning blue-green
  framework: '#C8E6F5',    // Framework blue
  
  // Communication
  speaking: '#FFE0EC',     // Warm pink for speaking
  expression: '#FFF8D8',   // Bright cream for expression
  communication: '#FFE0D8',// Warm coral for communication
  
  // Key concepts
  important: '#FFD8E6',    // Highlight pink for key terms
  emphasis: '#FFE0ED',     // Emphasis pink
  focus: '#A8C8E6'         // Focus blue
};
