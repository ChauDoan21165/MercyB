// Keyword Rebuilder - Extract keywords from text if missing

export function rebuildKeywords(text: string, targetCount: number = 4): string[] {
  // Extract meaningful words (nouns, verbs, adjectives)
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3); // Only words > 3 chars

  // Remove common stop words
  const stopWords = new Set([
    'this', 'that', 'with', 'from', 'have', 'been', 'were', 'will',
    'would', 'could', 'should', 'about', 'which', 'their', 'there',
    'when', 'where', 'what', 'how', 'why', 'who', 'whom', 'whose',
    'these', 'those', 'then', 'than', 'them', 'they', 'some', 'such',
    'into', 'onto', 'upon', 'over', 'under', 'above', 'below',
  ]);

  const meaningful = words.filter(w => !stopWords.has(w));

  // Count frequency
  const freq = new Map<string, number>();
  meaningful.forEach(w => {
    freq.set(w, (freq.get(w) || 0) + 1);
  });

  // Sort by frequency
  const sorted = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);

  // Return top N unique words
  return sorted.slice(0, targetCount);
}