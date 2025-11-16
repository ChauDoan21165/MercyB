import { emotionKeywordGroups, getEmotionKeywordColor } from './emotionKeywordColors';

export interface EmotionTheme {
  emotion: string;
  count: number;
  percentage: number;
  color: string;
  keywords: string[];
}

/**
 * Normalize text for analysis (case-insensitive, accent-normalized)
 */
const normalizeForAnalysis = (text: string): string => {
  return text.toLowerCase().normalize('NFC');
};

/**
 * Analyze text and count keyword frequency by emotion category
 */
export const analyzeEmotionalThemes = (text: string): EmotionTheme[] => {
  const normalizedText = normalizeForAnalysis(text);
  const emotionCounts = new Map<string, { count: number; keywords: Set<string>; color: string }>();

  // Initialize all emotion categories
  emotionKeywordGroups.forEach(group => {
    emotionCounts.set(group.emotion, {
      count: 0,
      keywords: new Set(),
      color: group.color
    });
  });

  // Count keyword occurrences
  emotionKeywordGroups.forEach(group => {
    const allKeywords = [...group.en, ...group.vi];
    
    allKeywords.forEach(keyword => {
      const normalizedKeyword = normalizeForAnalysis(keyword);
      
      // Use word boundaries to match whole words/phrases
      const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = normalizedText.match(regex);
      
      if (matches) {
        const current = emotionCounts.get(group.emotion)!;
        current.count += matches.length;
        current.keywords.add(keyword);
      }
    });
  });

  // Convert to array and calculate percentages
  const totalCount = Array.from(emotionCounts.values()).reduce((sum, { count }) => sum + count, 0);
  
  const themes: EmotionTheme[] = Array.from(emotionCounts.entries())
    .map(([emotion, { count, keywords, color }]) => ({
      emotion,
      count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      color,
      keywords: Array.from(keywords)
    }))
    .filter(theme => theme.count > 0) // Only include themes that appear
    .sort((a, b) => b.count - a.count); // Sort by frequency

  return themes;
};

/**
 * Get the top N most dominant themes
 */
export const getTopThemes = (text: string, topN: number = 5): EmotionTheme[] => {
  const themes = analyzeEmotionalThemes(text);
  return themes.slice(0, topN);
};

/**
 * Get a summary of the dominant theme
 */
export const getDominantTheme = (text: string): EmotionTheme | null => {
  const themes = analyzeEmotionalThemes(text);
  return themes.length > 0 ? themes[0] : null;
};
