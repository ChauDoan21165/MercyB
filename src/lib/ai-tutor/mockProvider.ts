/**
 * PB4 Mock Provider — deterministic canned-response provider for AI Tutor.
 *
 * Phase B — pure functions only. No I/O, no real AI calls, no network.
 * All functions are deterministic: same input → same output, every time.
 *
 * Uses FNV-1a style hashing for deterministic error simulation and
 * canned response selection. No Math.random(), no Date.now(), no timers.
 *
 * AI_TUTOR_ENABLED=false — this module is tree-shaken in production.
 */

import type {
  TutorConversationMode,
  TutorResponse,
  TutorSafetyKind,
} from "./types";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
} from "@/lib/tutor/correctionEngine";

// ─── Canned Responses — 3+ per mode ──────────────────────────────────

const CANNED_RESPONSES: Record<TutorConversationMode, string[]> = {
  general_chat: [
    // Response 1: welcoming
    "Chào bạn! Hôm nay bạn muốn luyện tiếng Anh như thế nào? Mình có thể giúp bạn sửa câu, giải thích ngữ pháp, hoặc luyện nói.",
    // Response 2: helpful
    "Câu hỏi hay đấy! Trong tiếng Anh, có một vài cách để diễn đạt ý này. Bạn muốn mình giải thích chi tiết hơn không?",
    // Response 3: encouraging
    "Bạn đang tiến bộ rồi đấy! Mình thấy bạn ngày càng tự tin hơn. Bạn muốn thử một bài tập nhỏ không?",
    // Response 4: redirecting
    "Mình tập trung học tiếng Anh nhé. Bạn muốn luyện gì hôm nay? Mình có thể giúp bạn sửa câu, giải thích ngữ pháp, hoặc luyện phát âm.",
  ],

  sentence_correction: [
    // Response 1: past tense correction
    '"🔍 Bạn viết: "I go to school yesterday"\n💡 Gợi ý: "I went to school yesterday"\n📝 Giải thích: Trong tiếng Việt, bạn nói "hôm qua tôi đi học" giữ nguyên "đi". Tiếng Anh bắt buộc đổi "go" thành "went" vì có dấu hiệu quá khứ "yesterday".\n🔄 Thử lại: "Tell me what you did yesterday."',
    // Response 2: article correction
    '"🔍 Bạn viết: "She is teacher"\n💡 Gợi ý: "She is a teacher"\n📝 Giải thích: Trong tiếng Anh, khi nói về nghề nghiệp, bạn cần thêm mạo từ "a" hoặc "an" trước danh từ. Tiếng Việt không có mạo từ nên người Việt mình hay quên.\n🔄 Thử lại: "Write a sentence about your job."',
    // Response 3: third-person singular
    '"🔍 Bạn viết: "He go to work"\n💡 Gợi ý: "He goes to work"\n📝 Giải thích: Với ngôi thứ ba số ít (he, she, it), động từ cần thêm -s hoặc -es. Đây là điểm ngữ pháp không có trong tiếng Việt.\n🔄 Thử lại: "Write about what she does every morning."',
    // Response 4: already correct
    "Câu này đúng rồi! Bạn viết rất tự nhiên. Bạn muốn thử một câu khó hơn không?",
  ],

  writing_feedback: [
    // Response 1: paragraph feedback
    "Bài viết của bạn có ý rõ ràng — mình hiểu bạn muốn kể về ngày hôm qua. Có 2 điểm chính cần sửa: thì quá khứ và mạo từ. Đây là lỗi người Việt mình hay gặp nhất khi viết tiếng Anh.\n\n📖 Mẫu lỗi: \"Past tense consistency\"\nVí dụ: go → went, buy → bought, talk → talked",
    // Response 2: structure feedback
    "Bài viết của bạn có cấu trúc tốt. Mình thấy bạn dùng câu ngắn rõ ràng — rất phù hợp cho người mới học. Để nâng cao hơn, bạn có thể thử nối các câu bằng từ nối như 'because', 'so', hoặc 'however'.\n\n📖 Mẫu lỗi: \"Sentence variety\"\nVí dụ: Thay vì 'I went to school. I was late.' → 'I went to school, but I was late.'",
    // Response 3: vocabulary feedback
    "Bài viết của bạn dùng từ vựng phù hợp với trình độ. Có một vài từ bạn có thể thay bằng từ tự nhiên hơn. Ví dụ, 'big' có thể thay bằng 'large' hoặc 'huge' tùy ngữ cảnh.\n\n📖 Mẫu lỗi: \"Word choice\"\nVí dụ: 'a big problem' → 'a serious problem' (trang trọng hơn).",
  ],

  pronunciation_coaching: [
    // Response 1: th sound
    '🗣 Từ: "three" (/θriː/)\n\n1. MÔ TẢ ÂM:\n- Vị trí lưỡi: Đặt đầu lưỡi giữa hai hàm răng, thổi nhẹ.\n- Vị trí môi: Mở nhẹ, không tròn.\n- Rung dây thanh: Không rung.\n\n2. SO SÁNH:\n"three" (/θ/) vs "tree" (/t/)\n→ Âm /θ/ không có trong tiếng Việt. Người Việt hay thay bằng âm /t/.\n\n3. VÍ DỤ:\nthink, thank, through, Thursday\n\n🔄 Thử lại: "Three thin trees through the forest."',
    // Response 2: r sound
    '🗣 Từ: "rice" (/raɪs/)\n\n1. MÔ TẢ ÂM:\n- Vị trí lưỡi: Cong lưỡi lên phía trên, không chạm vòm miệng.\n- Vị trí môi: Hơi tròn.\n- Rung dây thanh: Có rung.\n\n2. SO SÁNH:\n"rice" (/r/) vs "lice" (/l/)\n→ Người Việt hay nhầm /r/ và /l/.\n\n🔄 Thử lại: "Red rice with fresh herbs."',
    // Response 3: final consonant
    '🗣 Từ: "book" (/bʊk/)\n\n1. MÔ TẢ ÂM:\n- Vị trí lưỡi: Nâng cuống lưỡi chạm vòm mềm.\n- Vị trí môi: Mở tự nhiên.\n- Rung dây thanh: Không rung.\n\n2. SO SÁNH:\n"book" (/bʊk/) vs "boo" (/buː/)\n→ Người Việt hay bỏ phụ âm cuối. Phải phát âm rõ âm /k/.\n\n🔄 Thử lại: "Look at the book on the desk."',
  ],

  lesson_guidance: [
    // Response 1: introduce lesson
    "Hôm nay chúng ta sẽ học về thì quá khứ đơn. Đây là thì rất quan trọng trong tiếng Anh vì nó giúp bạn kể về những việc đã xảy ra. Bạn đã sẵn sàng chưa?",
    // Response 2: guide practice
    "Bây giờ bạn hãy thử đặt câu với 'yesterday'. Ví dụ: 'Yesterday I ___ (go) to the market.' Bạn điền gì vào chỗ trống?",
    // Response 3: recap
    "Tốt lắm! Bạn đã luyện được thì quá khứ đơn với các động từ bất quy tắc: go → went, see → saw, have → had. Lần sau chúng ta sẽ học thêm về thì hiện tại hoàn thành. Bạn muốn luyện thêm không?",
  ],
};

// ─── Mock Provider Types ──────────────────────────────────────────────

export type MockProviderConfig = {
  /** Deterministic seed for error simulation and response selection. */
  seed: number;
  /** Error rate 0–1. 0 = always succeed, 1 = always fail. */
  errorRate: number;
};

export type MockProvider = {
  config: MockProviderConfig;
  /** Count of calls made (for deterministic response rotation). */
  callCount: number;
};

export type MockProviderResult = {
  ok: true;
  response: TutorResponse;
  requestId: string;
  tokensUsed: { input: number; output: number };
} | {
  ok: false;
  errorKind: "provider_5xx" | "provider_timeout" | "provider_rate_limited" | "empty_response";
  messageVi: string;
  requestId: string;
};

// ─── FNV-1a Hash (deterministic) ─────────────────────────────────────

function fnv1aHash(input: string, seed: number): number {
  let hash = seed;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0; // unsigned 32-bit
}

function selectDeterministic<T>(items: readonly T[], input: string, seed: number, offset: number): T {
  const hash = fnv1aHash(input, seed) + offset;
  return items[hash % items.length];
}

// ─── Mock Provider Functions ──────────────────────────────────────────

/**
 * Create a mock provider with the given configuration.
 */
export function createMockProvider(config: MockProviderConfig): MockProvider {
  return { config, callCount: 0 };
}

/**
 * Get a canned Vietnamese response for the given mode and input.
 * Deterministic: same mode + input + seed → same response.
 */
export function getCannedResponse(
  mode: TutorConversationMode,
  userInput: string,
  seed: number,
  callCount: number,
): TutorResponse {
  if (mode === "sentence_correction") {
    const correction = correctWithTutorRules(userInput, "en");
    if (correction.status === "corrected") {
      return {
        vi: `🔍 Bạn viết: "${userInput}"\n💡 Gợi ý: "${correction.corrected}"\n📝 Giải thích: Mercy đã dùng luật sửa lỗi tiếng Anh cơ bản trong chế độ mock.\n🔄 Thử lại: "Tell me what you did yesterday."`,
        correctedSentence: correction.corrected,
        grammarPoints: correction.appliedRuleIds,
        nextSteps: [{ labelVi: "Thử câu khác", action: "write", payload: "Tell me what you did yesterday." }],
        saveTargets: [{ phrase: correction.corrected, type: "sentence" }],
      };
    }

    if (correction.status === "needs_ai") {
      return {
        vi: correction.message || AI_CORRECTION_REQUIRED_MESSAGE,
        nextSteps: [{ labelVi: "Thử câu đơn giản hơn", action: "write", payload: "" }],
        saveTargets: [],
      };
    }
  }

  const pool = CANNED_RESPONSES[mode] ?? CANNED_RESPONSES.general_chat;
  const raw = selectDeterministic(pool, userInput, seed, callCount);

  return parseCannedResponse(raw, mode);
}

/**
 * Generate a full mock response including token counts.
 * Deterministic for same request input.
 */
export function generateMockResponse(
  mode: TutorConversationMode,
  userInput: string,
  seed: number,
  callCount: number,
): { response: TutorResponse; inputTokens: number; outputTokens: number } {
  const response = getCannedResponse(mode, userInput, seed, callCount);
  const inputTokens = Math.ceil(userInput.length / 4);
  const outputTokens = Math.ceil(response.vi.length / 4);

  return { response, inputTokens, outputTokens };
}

/**
 * Simulate a provider call with deterministic error simulation.
 *
 * Uses FNV-1a hash of (requestId + seed) to determine if the call
 * succeeds or fails. This is deterministic: same requestId + seed
 * always produces the same outcome.
 */
export function simulateProviderCall(
  provider: MockProvider,
  mode: TutorConversationMode,
  userInput: string,
  requestId: string,
): MockProviderResult {
  // Increment call count
  const callCount = provider.callCount;
  provider.callCount = callCount + 1;

  // Deterministic error simulation
  const errorHash = fnv1aHash(requestId, provider.config.seed);
  const normalizedHash = errorHash / 0xFFFFFFFF; // 0–1
  const { errorRate } = provider.config;

  if (normalizedHash < errorRate) {
    // Simulate a failure
    const errorKind = selectDeterministic(
      ["provider_5xx", "provider_timeout", "provider_rate_limited", "empty_response"] as const,
      requestId,
      provider.config.seed,
      1,
    );

    const fallbackMessages: Record<string, string> = {
      provider_5xx: "Xin lỗi, mình gặp chút trục trặc. Bạn thử lại nhé?",
      provider_timeout: "Xin lỗi, phản hồi hơi chậm. Bạn thử lại nhé?",
      provider_rate_limited: "Mình đang hơi bận. Bạn đợi một chút rồi thử lại nhé.",
      empty_response: "Mình chưa hiểu rõ ý bạn lắm. Bạn có thể diễn đạt cách khác không?",
    };

    return {
      ok: false,
      errorKind: errorKind as "provider_5xx" | "provider_timeout" | "provider_rate_limited" | "empty_response",
      messageVi: fallbackMessages[errorKind] ?? fallbackMessages.provider_5xx,
      requestId,
    };
  }

  // Success — generate mock response
  const { response, inputTokens, outputTokens } = generateMockResponse(
    mode,
    userInput,
    provider.config.seed,
    callCount,
  );

  return {
    ok: true,
    response,
    requestId,
    tokensUsed: { input: inputTokens, output: outputTokens },
  };
}

// ─── Canned Response Parser ───────────────────────────────────────────

function parseCannedResponse(raw: string, mode: TutorConversationMode): TutorResponse {
  const vi = raw;
  const nextSteps: TutorResponse["nextSteps"] = [{ labelVi: "Thử lại", action: "write", payload: "" }];

  if (mode === "sentence_correction") {
    // Parse correction markers from canned response
    const corrected = extractQuoted(raw, "💡 Gợi ý:");
    const practice = extractQuoted(raw, "🔄 Thử lại:");

    if (corrected) {
      return {
        vi,
        correctedSentence: corrected,
        grammarPoints: ["Simple past tense"],
        nextSteps: practice ? [{ labelVi: "Thử câu khác", action: "write", payload: practice }] : nextSteps,
        saveTargets: [{ phrase: corrected, type: "sentence" }],
      };
    }

    // Already correct response
    return { vi, nextSteps, saveTargets: [] };
  }

  if (mode === "pronunciation_coaching") {
    const practice = extractQuoted(raw, "🔄 Thử lại:");
    return {
      vi,
      practiceSentence: practice ?? undefined,
      nextSteps: practice ? [{ labelVi: "Luyện nói", action: "speak", payload: practice }] : nextSteps,
      saveTargets: [],
    };
  }

  return { vi, nextSteps, saveTargets: [] };
}

function extractQuoted(text: string, marker: string): string | undefined {
  const idx = text.indexOf(marker);
  if (idx < 0) return undefined;
  const after = text.slice(idx + marker.length);
  const match = after.match(/"([^"]*)"/);
  return match ? match[1].trim() : undefined;
}

// ─── Public API ───────────────────────────────────────────────────────

export type { TutorConversationMode, TutorResponse, TutorSafetyKind };
