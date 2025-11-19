// Vibrant, fun color palette for learning
const COLORS = [
  '#FF6B9D', '#FF8E53', '#FFD93D', '#6BCF7F', '#4ECDC4', '#95E1D3',
  '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF', '#FFD1DC', '#FDCB6E',
  '#6C5CE7', '#00B894', '#00CEC9', '#0984E3', '#FD79A8', '#FDCB6E',
  '#74B9FF', '#A29BFE', '#FF7675', '#FD79A8', '#FDCB6E', '#55EFC4',
  '#FF6348', '#FF9F43', '#FFDD59', '#26DE81', '#2BCBBA', '#45AAF2',
  '#FC5C65', '#EB3B5A', '#FA8231', '#FED330', '#20BF6B', '#0FB9B1',
  '#A55EEA', '#8854D0', '#F7B731', '#FED330', '#4B7BEC', '#3867D6'
];

// Filler words to exclude (English + Vietnamese)
const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'it', 'this', 'that', 'these', 'those',
  'là', 'và', 'có', 'thì', 'của', 'được', 'cho', 'với', 'từ', 'trong', 'trên', 'dưới', 'về', 'đã', 'sẽ', 'đang', 'các', 'những', 'này', 'đó', 'kia', 'mà', 'như'
]);


export function highlightTextByRules(text: string, isVietnamese: boolean = false): JSX.Element[] {
  // Treat each sentence as a "line" so essays get multiple groups of colored words
  const sentenceLines: string[] = [];
  const rawLines = text.split('\n');

  rawLines.forEach((raw) => {
    if (!raw.trim()) {
      sentenceLines.push(raw);
      return;
    }
    const parts = raw.split(/(?<=[.!?])\s+/);
    sentenceLines.push(...parts);
  });

  const lines = sentenceLines;
  const result: JSX.Element[] = [];
  let globalIndex = 0;
  let globalColorIndex = 0;
  const totalLines = lines.length || 1;

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
      if (
        cleaned &&
        !/^[.,;:!?()""—–-]+$/.test(seg) &&
        seg.length > 2 &&
        !FILLER_WORDS.has(cleaned)
      ) {
        keywordIndices.push(idx);
      }
    });

    // Fun, colorful highlighting: color 2-4 keywords per line for vibrant learning
    const hasKeywords = keywordIndices.length > 0;
    const shouldColorThisLine = hasKeywords; // Color every line that has keywords

    let numToColor = 0;
    if (shouldColorThisLine) {
      if (keywordIndices.length > 10) {
        numToColor = 4;
      } else if (keywordIndices.length > 5) {
        numToColor = 3;
      } else {
        numToColor = 2;
      }
      numToColor = Math.min(numToColor, keywordIndices.length);
    }

    const selectedIndices = new Set<number>();
    if (numToColor > 0) {
      const step = Math.max(1, Math.floor(keywordIndices.length / numToColor));
      for (let i = 0; i < numToColor && i * step < keywordIndices.length; i++) {
        selectedIndices.add(keywordIndices[i * step]);
      }
    }

    // High opacity for vibrant, fun colors
    const baseOpacity = 0.95; // Bright and clear for better visibility

    const colorMap = new Map<number, { color: string; opacity: number }>();
    selectedIndices.forEach((idx) => {
      const color = COLORS[globalColorIndex % COLORS.length];
      colorMap.set(idx, {
        color,
        opacity: baseOpacity,
      });
      globalColorIndex++;
    });

    // Render segments
    segments.forEach((segment, segIndex) => {
      if (colorMap.has(segIndex)) {
        const { color, opacity } = colorMap.get(segIndex)!;
        result.push(
          <span
            key={`word-${globalIndex++}`}
            style={{
              color,
              opacity,
              fontWeight: 600,
              transition: 'opacity 0.3s ease',
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
