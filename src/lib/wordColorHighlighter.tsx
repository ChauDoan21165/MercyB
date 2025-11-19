// Color list in exact order
const COLORS = [
  '#4D9FD9', '#2F88C9', '#1C74B8', '#3FA9D7', '#008BBF', '#0077A8',
  '#2A9D8F', '#3CAEA3', '#2F8F83', '#4BBDAF', '#1F8173', '#3C9E72',
  '#6A57D5', '#7F63E3', '#8A5FDB', '#9A6AE8', '#7C52C4', '#A574E3',
  '#FF9F8A', '#FF8C7A', '#F27D72', '#E6655A', '#FF7A66', '#D85A54',
  '#F4A261', '#E99343', '#D68028', '#E8A046', '#F28E3D', '#CC7B23',
  '#E85A70', '#D94D64', '#C53E58', '#F06478', '#B7324B', '#E14F60',
  '#4A9E51', '#3F8C45', '#59AC63', '#2F7134', '#5CB572', '#3A7F42',
  '#2E5EAA', '#234A87', '#3A63B4', '#1F4C7A', '#2D6ACF', '#1C3D73'
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

    // Gentle wave effect: color 1-2 keywords sparingly, skip some lines
    const totalLines = lines.length;
    const shouldColorThisLine = keywordIndices.length > 0 && (lineIndex % 2 === 0 || keywordIndices.length > 5);
    const numToColor = shouldColorThisLine ? Math.min(1 + Math.floor(Math.random() * 2), keywordIndices.length) : 0;
    
    // Select keywords with some spacing between them
    const selectedIndices = new Set<number>();
    if (numToColor > 0) {
      const step = Math.max(1, Math.floor(keywordIndices.length / numToColor));
      for (let i = 0; i < numToColor && i * step < keywordIndices.length; i++) {
        selectedIndices.add(keywordIndices[i * step]);
      }
    }

    // Calculate opacity for gentle fade effect (top to bottom)
    const progressRatio = lineIndex / Math.max(1, totalLines - 1);
    const baseOpacity = 0.75 + (0.25 * Math.sin(progressRatio * Math.PI)); // Gentle wave 0.75-1.0

    // Assign colors sequentially from global color index
    const colorMap = new Map<number, { color: string; opacity: number }>();
    selectedIndices.forEach(idx => {
      const color = COLORS[globalColorIndex % COLORS.length];
      // Add slight variation to opacity for organic feel
      const opacityVariation = 0.95 + (Math.random() * 0.1);
      colorMap.set(idx, { 
        color, 
        opacity: baseOpacity * opacityVariation 
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
              fontWeight: 500,
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
