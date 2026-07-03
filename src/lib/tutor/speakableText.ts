const UI_LABEL_PATTERN =
  /\b(?:Teacher Mercy|Câu trả lời tự nhiên|Câu đã sửa|Giải thích|Câu hỏi tiếp theo|Natural reply|Corrected|Explanation|Next question)\b\s*[:：\-–—]?/gi;

const LINE_LABEL_PATTERN =
  /^(?:Mercy|Teacher|Tutor|User|Learner|Bạn|Học viên)\s*[:：\-–—]\s*/i;

function normalizeForDedupe(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.!?。！？]+$/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function removeRepeatedHalves(value: string): string {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length < 4 || words.length % 2 !== 0) return value;
  const midpoint = words.length / 2;
  const first = words.slice(0, midpoint).join(" ");
  const second = words.slice(midpoint).join(" ");
  return normalizeForDedupe(first) === normalizeForDedupe(second) ? first : value;
}

function removeRepeatedSentences(value: string): string {
  const fragments = value.match(/[^.!?。！？]+[.!?。！？]?/gu) ?? [value];
  const kept: string[] = [];
  const seen = new Set<string>();

  for (const fragment of fragments) {
    const cleaned = removeRepeatedHalves(fragment.replace(/\s+/g, " ").trim());
    if (!cleaned) continue;
    const key = normalizeForDedupe(cleaned);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    kept.push(cleaned);
  }

  return kept.join(" ");
}

function stripControlCharacters(value: string): string {
  return Array.from(value)
    .map((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || (code >= 127 && code <= 159) ? " " : character;
    })
    .join("");
}

export function sanitizeSpeakableText(text: string): string {
  const withoutLabels = String(text ?? "")
    .replace(UI_LABEL_PATTERN, " ")
    .split(/\r?\n/)
    .map((line) => stripControlCharacters(line).replace(LINE_LABEL_PATTERN, " "))
    .join(" ");

  const withoutMarkup = withoutLabels
    .replace(/<[^>\n]*>/g, " ")
    .replace(/[`*_#>~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return removeRepeatedSentences(withoutMarkup).replace(/\s+/g, " ").trim();
}
