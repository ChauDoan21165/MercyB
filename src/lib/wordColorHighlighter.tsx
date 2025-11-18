// Pleasant rainbow colors with good contrast
const RAINBOW_COLORS = [
  '#FF6B9D', // Pink
  '#C44569', // Deep Rose
  '#FFA07A', // Light Salmon
  '#FF8C42', // Orange
  '#FFD93D', // Yellow
  '#6BCF7F', // Green
  '#4ECDC4', // Turquoise
  '#5DADE2', // Blue
  '#A569BD', // Purple
  '#EC7063', // Red
  '#F39C12', // Amber
  '#1ABC9C', // Teal
];

// Seeded random function for consistency
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  // Split text into lines
  const lines = text.split('\n');
  const result: JSX.Element[] = [];
  let globalIndex = 0;

  lines.forEach((line, lineIndex) => {
    if (!line.trim()) {
      result.push(<span key={`line-${globalIndex++}`}>{line}\n</span>);
      return;
    }

    // Split line into words, keeping punctuation
    const segments = line.split(/(\s+|[.,;:!?()""—–-])/);
    
    // Find word indices (not spaces or punctuation)
    const wordIndices: number[] = [];
    segments.forEach((seg, idx) => {
      if (seg.trim() && !/^[.,;:!?()""—–-]+$/.test(seg) && seg.length > 2) {
        wordIndices.push(idx);
      }
    });

    // Randomly select 3 words to color (or less if line has fewer words)
    const wordsToColor = Math.min(3, wordIndices.length);
    const selectedIndices = new Set<number>();
    
    // Use line content as seed for consistent coloring
    const seed = lineIndex * 1000 + line.length;
    let currentSeed = seed;
    
    while (selectedIndices.size < wordsToColor && wordIndices.length > 0) {
      const randomIndex = Math.floor(seededRandom(currentSeed++) * wordIndices.length);
      selectedIndices.add(wordIndices[randomIndex]);
    }

    // Render segments with random colors
    segments.forEach((segment, segIndex) => {
      if (selectedIndices.has(segIndex)) {
        const colorIndex = Math.floor(seededRandom(seed + segIndex) * RAINBOW_COLORS.length);
        result.push(
          <span
            key={`word-${globalIndex++}`}
            style={{
              color: RAINBOW_COLORS[colorIndex],
              fontWeight: 600,
            }}
          >
            {segment}
          </span>
        );
      } else {
        result.push(<span key={`seg-${globalIndex++}`}>{segment}</span>);
      }
    });

    // Add newline except for last line
    if (lineIndex < lines.length - 1) {
      result.push(<span key={`newline-${globalIndex++}`}>{'\n'}</span>);
    }
  });

  return result;
}

export function highlightPairedText(enText: string, viText: string): {
  enHighlighted: JSX.Element[];
  viHighlighted: JSX.Element[];
} {
  return {
    enHighlighted: highlightTextByRules(enText, false),
    viHighlighted: highlightTextByRules(viText, true)
  };
}
