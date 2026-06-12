export type BilingualText = {
  vi: string;
  en: string;
};

export const VIETNAMESE_DIACRITIC_PATTERN =
  /[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function hasVietnameseDiacritics(value: string): boolean {
  return VIETNAMESE_DIACRITIC_PATTERN.test(value);
}

function sentenceFragments(value: string): string[] {
  const normalized = value
    .replace(/[•·]/g, "\n")
    .replace(/\s+[\\/|]\s+/g, "\n")
    .replace(/([.!?。！？])\s+/g, "$1\n");
  return normalized
    .split(/\r?\n/)
    .map(compact)
    .filter(Boolean);
}

export function englishTextForTts(value: string): string {
  const text = compact(String(value ?? ""));
  if (!text) return "";
  if (!hasVietnameseDiacritics(text)) return text;

  const englishFragments = sentenceFragments(text).filter((fragment) => {
    if (hasVietnameseDiacritics(fragment)) return false;
    return /[a-z]/i.test(fragment);
  });
  const extracted = compact(englishFragments.join(" "));
  return hasVietnameseDiacritics(extracted) ? "" : extracted;
}

export function bilingualText(vi: string, en: string): BilingualText {
  return { vi: compact(vi), en: compact(en) };
}

export function speechTextFromBilingual(value: BilingualText | string | null | undefined): string {
  if (typeof value === "string") return englishTextForTts(value);
  return englishTextForTts(value?.en ?? "");
}
