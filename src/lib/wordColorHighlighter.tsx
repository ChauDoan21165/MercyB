// Pastel color palette as specified
const SOFT_BLUES = ['#8EC6E8', '#6FB4E3', '#4D9FD9'];
const FRESH_GREENS = ['#A8E6CF', '#7FD9BC', '#5CC7A8'];
const WARM_PEACH = ['#FFCCB6', '#FFB59E', '#FF9F8A'];
const LAVENDER = ['#D7CFF2', '#C7B9EE', '#B3A4E8'];
const GOLDEN_SAND = ['#F6E3B4', '#F3D89B', '#F1CD85'];
const ACCENTS = ['#FF8C7A', '#F4A261', '#6A57D5', '#2A9D8F', '#44A7C4', '#FF9E7C', '#A875E8', '#53C1C9', '#E79F62', '#F27D72'];
const NEUTRALS = ['#A7B4C2', '#C9D1D9', '#E5E7EB', '#D9CFC3', '#C9B9A8'];

const SOFT_PASTELS = [...SOFT_BLUES, ...FRESH_GREENS, ...WARM_PEACH, ...LAVENDER, ...GOLDEN_SAND, ...NEUTRALS];

// Filler words to exclude (English + Vietnamese)
const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'it', 'this', 'that', 'these', 'those',
  'là', 'và', 'có', 'thì', 'của', 'được', 'cho', 'với', 'từ', 'trong', 'trên', 'dưới', 'về', 'đã', 'sẽ', 'đang', 'các', 'những', 'này', 'đó', 'kia', 'mà', 'như'
]);

// Seeded random function for consistency
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  const lines = text.split('\n');
  const result: JSX.Element[] = [];
  let globalIndex = 0;

  lines.forEach((line, lineIndex) => {
    if (!line.trim()) {
      result.push(<span key={`line-${globalIndex++}`}>{line}\n</span>);
      return;
    }

    const segments = line.split(/(\s+|[.,;:!?()""—–-])/);
    
    // Find keyword indices (exclude filler words, punctuation, short words)
    const keywordIndices: number[] = [];
    segments.forEach((seg, idx) => {
      const cleaned = seg.trim().toLowerCase();
      if (cleaned && 
          !/^[.,;:!?()""—–-]+$/.test(seg) && 
          seg.length > 2 &&
          !FILLER_WORDS.has(cleaned)) {
        keywordIndices.push(idx);
      }
    });

    // Select exactly 3 keywords (or fewer if line has less)
    const numToColor = Math.min(3, keywordIndices.length);
    const selectedIndices = new Set<number>();
    
    const seed = lineIndex * 1000 + line.length;
    let currentSeed = seed;
    
    // Randomly pick keywords
    const shuffled = [...keywordIndices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.slice(0, numToColor).forEach(idx => selectedIndices.add(idx));

    // Pick colors: 2 soft pastels + 1 accent
    const colors: string[] = [];
    if (numToColor >= 1) {
      const soft1Index = Math.floor(seededRandom(seed + 1) * SOFT_PASTELS.length);
      colors.push(SOFT_PASTELS[soft1Index]);
    }
    if (numToColor >= 2) {
      const soft2Index = Math.floor(seededRandom(seed + 2) * SOFT_PASTELS.length);
      colors.push(SOFT_PASTELS[soft2Index]);
    }
    if (numToColor >= 3) {
      const accentIndex = Math.floor(seededRandom(seed + 3) * ACCENTS.length);
      colors.push(ACCENTS[accentIndex]);
    }

    // Render segments
    let colorIndex = 0;
    segments.forEach((segment, segIndex) => {
      if (selectedIndices.has(segIndex)) {
        result.push(
          <span
            key={`word-${globalIndex++}`}
            style={{
              color: colors[colorIndex++],
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
