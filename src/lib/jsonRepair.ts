/**
 * Client-side JSON repair utilities
 * Fixes common JSON syntax errors
 */

export interface RepairResult {
  success: boolean;
  fixed: boolean;
  data?: any;
  error?: string;
  changes?: string[];
}

export function repairJSON(content: string): RepairResult {
  const changes: string[] = [];
  let fixed = false;

  try {
    // Try to parse as-is first
    const parsed = JSON.parse(content);
    return { success: true, fixed: false, data: parsed };
  } catch (initialError: any) {
    // JSON is invalid, try to fix it
    let repairedContent = content;

    // Remove BOM if present
    if (repairedContent.charCodeAt(0) === 0xfeff) {
      repairedContent = repairedContent.slice(1);
      changes.push("Removed BOM");
      fixed = true;
    }

    // Fix unescaped quotes in strings
    // This is tricky - we need to escape quotes that are inside string values
    const unescapedQuoteRegex = /("(?:[^"\\]|\\.)*")\s*:\s*"([^"]*)\\?"([^"]*)"([^,}\]]*)/g;
    if (unescapedQuoteRegex.test(repairedContent)) {
      repairedContent = repairedContent.replace(
        /("(?:[^"\\]|\\.)*")\s*:\s*"([^"]*)"/g,
        (match, key, value) => {
          if (value.includes('"') && !value.includes('\\"')) {
            return `${key}: "${value.replace(/"/g, '\\"')}"`;
          }
          return match;
        }
      );
      changes.push("Escaped unescaped quotes in string values");
      fixed = true;
    }

    // Remove trailing commas
    const trailingCommaRegex = /,(\s*[}\]])/g;
    if (trailingCommaRegex.test(repairedContent)) {
      repairedContent = repairedContent.replace(trailingCommaRegex, "$1");
      changes.push("Removed trailing commas");
      fixed = true;
    }

    // Fix missing commas between properties
    const missingCommaRegex = /"(\s*)\n(\s*)"/g;
    if (missingCommaRegex.test(repairedContent)) {
      repairedContent = repairedContent.replace(missingCommaRegex, '",\n$2"');
      changes.push("Added missing commas");
      fixed = true;
    }

    // Remove comments (not valid in JSON)
    const commentRegex = /\/\/.*$/gm;
    if (commentRegex.test(repairedContent)) {
      repairedContent = repairedContent.replace(commentRegex, "");
      changes.push("Removed comments");
      fixed = true;
    }

    // Fix single quotes to double quotes (JSON requires double quotes)
    const singleQuoteRegex = /'([^']*)':/g;
    if (singleQuoteRegex.test(repairedContent)) {
      repairedContent = repairedContent.replace(singleQuoteRegex, '"$1":');
      changes.push("Converted single quotes to double quotes");
      fixed = true;
    }

    // Try to parse again after fixes
    try {
      const parsed = JSON.parse(repairedContent);
      return { success: true, fixed, data: parsed, changes };
    } catch (secondError: any) {
      return {
        success: false,
        fixed,
        error: secondError.message,
        changes,
      };
    }
  }
}

export function validateRoomStructure(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  const requiredFields = ["id", "tier", "title", "content", "entries", "meta"];
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check title structure
  if (data.title) {
    if (!data.title.en) errors.push("Missing title.en");
    if (!data.title.vi) errors.push("Missing title.vi");
  }

  // Check content structure
  if (data.content) {
    if (!data.content.en) errors.push("Missing content.en");
    if (!data.content.vi) errors.push("Missing content.vi");
  }

  // Check entries is array
  if (data.entries && !Array.isArray(data.entries)) {
    errors.push("entries must be an array");
  }

  return { valid: errors.length === 0, errors };
}

export function downloadJSON(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
