// Darker, bolder color palette for better visibility on white background
const COLORS = [
  '#D9185F', '#E66B2F', '#E5B800', '#4FA865', '#2BA89F', '#6BC4BC',
  '#C85A5A', '#7B5FB8', '#E08FB8', '#72C9A9', '#EAA0B0', '#E09F42',
  '#5243B8', '#008F6E', '#00A6A3', '#0661B8', '#D94580', '#E09F42',
  '#3D8CDB', '#7B6FDB', '#D94947', '#D94580', '#E09F42', '#2EC99E',
  '#D93E28', '#E67520', '#E5B800', '#18A856', '#18A095', '#2681CC',
  '#C83A4D', '#B81F35', '#D45610', '#E5A600', '#158F4E', '#0C8F88',
  '#7D34C2', '#623FA8', '#D48F0F', '#E5A600', '#2954B8', '#1F3EB8'
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

    // Full opacity for dark, bold colors
    const baseOpacity = 1.0; // Maximum visibility on white background

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
              fontWeight: 700,
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
