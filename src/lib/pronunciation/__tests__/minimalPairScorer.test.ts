import { describe, expect, it } from "vitest";

import {
  buildPairIndex,
  scorePairContrast,
  type MinimalPair,
} from "../minimalPairScorer";
import {
  BID_FAIL,
  BID_NO_PHONEMES,
  BID_PASS,
  COAT_FAIL,
  COAT_PASS,
  MIST_FAIL,
  MIST_PASS,
  RECORD_NOUN_FAIL,
  RECORD_NOUN_PASS,
  SHEEP_FAIL,
  SHEEP_PASS,
  STOP_FAIL,
  STOP_PASS,
  THINK_FAIL,
  THINK_PASS,
} from "../__fixtures__/minimalPairAzureFixtures";

// ─── Minimal corpus covering all seven categories ─────────────────────────────

const CORPUS: MinimalPair[] = [
  {
    id: "f5w1-001",
    category: "final_consonants",
    pair: { target: "bit", contrast: "bid" },
    ipa: { target: "/bɪt/", contrast: "/bɪd/" },
    vi: 'Người Việt thường không thả rõ phụ âm cuối, nên /t/ không rung trong "bit" và /d/ có rung trong "bid" dễ bị nhập lại thành một âm cuối ngắn.',
    examples: { target: "I took one small bit of cake.", contrast: "She made a fair bid for the car." },
    difficulty: "easy",
  },
  {
    id: "f5w1-016",
    category: "th_pairs",
    pair: { target: "think", contrast: "sink" },
    ipa: { target: "/θɪŋk/", contrast: "/sɪŋk/" },
    vi: 'Tiếng Việt không có /θ/, nên nhiều người thay bằng /s/ vì đều là âm xát; "think" phải có lưỡi giữa hai hàm răng.',
    examples: { target: "I think this plan will work.", contrast: "Do not leave dishes in the sink." },
    difficulty: "easy",
  },
  {
    id: "f5w1-027",
    category: "initial_clusters",
    pair: { target: "stop", contrast: "top" },
    ipa: { target: "/stɑːp/", contrast: "/tɑːp/" },
    vi: 'Tiếng Việt không có cụm /st/ đầu từ, nên người học dễ bỏ /s/ và biến "stop" thành "top".',
    examples: { target: "Please stop at the corner.", contrast: "Put the box on the top shelf." },
    difficulty: "easy",
  },
  {
    id: "f5w2-001",
    category: "final_clusters",
    pair: { target: "miss", contrast: "mist" },
    ipa: { target: "/mɪs/", contrast: "/mɪst/" },
    vi: 'Người Việt dễ bỏ /t/ trong cụm cuối /st/, nên "mist" có thể bị đọc gọn thành "miss" nếu không giữ âm chặn cuối.',
    examples: { target: "I miss my old neighborhood.", contrast: "A light mist covered the lake." },
    difficulty: "medium",
  },
  {
    id: "f5w1-lv-001",
    category: "long_short_vowels",
    pair: { target: "sheep", contrast: "ship" },
    ipa: { target: "/ʃiːp/", contrast: "/ʃɪp/" },
    vi: "Tiếng Việt không có đối lập /iː/ dài-căng và /ɪ/ ngắn-lỏng như tiếng Anh.",
    examples: { target: "The sheep is in the field.", contrast: "The ship is in the harbor." },
    difficulty: "easy",
  },
  {
    id: "f5w2-diph-001",
    category: "diphthongs",
    pair: { target: "coat", contrast: "caught" },
    ipa: { target: "/koʊt/", contrast: "/kɔːt/" },
    vi: '"Coat" có nguyên âm đôi /oʊ/ trượt môi, còn "caught" là /ɔː/ mở hơn; người Việt dễ đọc phẳng.',
    examples: { target: "She wore a long coat.", contrast: "The fish was caught early." },
    difficulty: "medium",
  },
  {
    id: "f5w2-stress-001",
    category: "stress_pairs",
    pair: { target: "record (noun)", contrast: "record (verb)" },
    ipa: { target: "/ˈrɛkərd/", contrast: "/rɪˈkɔːrd/" },
    vi: 'Tiếng Việt dùng thanh điệu hơn trọng âm từ, nên cặp "record" dễ bị đọc cùng nhịp.',
    examples: { target: "I bought the record.", contrast: "Let me record this." },
    difficulty: "hard",
  },
];

const INDEX = buildPairIndex(CORPUS);

// ─── buildPairIndex ───────────────────────────────────────────────────────────

describe("buildPairIndex", () => {
  it("indexes both sides of each pair", () => {
    expect(INDEX.has("bit")).toBe(true);
    expect(INDEX.has("bid")).toBe(true);
    expect(INDEX.has("think")).toBe(true);
    expect(INDEX.has("sink")).toBe(true);
    expect(INDEX.has("stop")).toBe(true);
    expect(INDEX.has("top")).toBe(true);
    expect(INDEX.has("miss")).toBe(true);
    expect(INDEX.has("mist")).toBe(true);
  });

  it("both sides resolve to the same pair entry", () => {
    expect(INDEX.get("bit")).toBe(INDEX.get("bid"));
    expect(INDEX.get("think")).toBe(INDEX.get("sink"));
    expect(INDEX.get("stop")).toBe(INDEX.get("top"));
    expect(INDEX.get("miss")).toBe(INDEX.get("mist"));
  });
});

// ─── unknown word ─────────────────────────────────────────────────────────────

describe("scorePairContrast — unknown word", () => {
  it("returns null for a word not in the index", () => {
    expect(scorePairContrast("helicopter", BID_PASS, INDEX)).toBeNull();
  });
});

// ─── final_consonants ─────────────────────────────────────────────────────────

describe("scorePairContrast — final_consonants (bit / bid)", () => {
  it("passes when final /d/ scores above threshold", () => {
    const r = scorePairContrast("bid", BID_PASS, INDEX);
    expect(r).not.toBeNull();
    expect(r!.failed).toBe(false);
    expect(r!.evidence).toBeNull();
    expect(r!.contrastType).toBe("final_consonant_dropped");
  });

  it("fails when final /d/ scores below threshold", () => {
    const r = scorePairContrast("bid", BID_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("final_consonant_dropped");
    expect(r!.evidence?.phoneme).toBe("d");
    expect(r!.evidence!.score).toBeLessThan(70);
  });

  it("contrastWord points to the other side of the pair", () => {
    expect(scorePairContrast("bid", BID_PASS, INDEX)!.contrastWord).toBe("bit");
    expect(scorePairContrast("bit", BID_PASS, INDEX)!.contrastWord).toBe("bid");
  });

  it("includes the Vietnamese interference explanation", () => {
    const r = scorePairContrast("bid", BID_FAIL, INDEX);
    expect(r!.viExplanation).toContain("phụ âm cuối");
  });

  it("does not fail when no phoneme data is present", () => {
    const r = scorePairContrast("bid", BID_NO_PHONEMES, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.evidence).toBeNull();
  });
});

// ─── th_pairs ─────────────────────────────────────────────────────────────────

describe("scorePairContrast — th_pairs (think / sink)", () => {
  it("passes when /θ/ scores above threshold", () => {
    const r = scorePairContrast("think", THINK_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("th_substitution");
    expect(r!.evidence).toBeNull();
  });

  it("fails when /θ/ scores below threshold (th-substitution detected)", () => {
    const r = scorePairContrast("think", THINK_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("th_substitution");
    expect(r!.evidence?.phoneme).toBe("th");
  });

  it("also resolves from the contrast-word side", () => {
    const r = scorePairContrast("sink", THINK_PASS, INDEX);
    expect(r).not.toBeNull();
    expect(r!.contrastWord).toBe("think");
    expect(r!.contrastType).toBe("th_substitution");
    expect(r!.pairId).toBe("f5w1-016");
  });

  it("carries the pair's Vietnamese explanation", () => {
    const r = scorePairContrast("think", THINK_FAIL, INDEX);
    expect(r!.viExplanation).toContain("/θ/");
  });
});

// ─── initial_clusters ─────────────────────────────────────────────────────────

describe("scorePairContrast — initial_clusters (stop / top)", () => {
  it("passes when /st/ cluster scores above threshold", () => {
    const r = scorePairContrast("stop", STOP_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("initial_cluster_simplification");
    expect(r!.evidence).toBeNull();
  });

  it("fails when cluster phonemes are weak (cluster simplified)", () => {
    const r = scorePairContrast("stop", STOP_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("initial_cluster_simplification");
    expect(r!.evidence).not.toBeNull();
    expect(r!.evidence!.score).toBeLessThan(70);
  });
});

// ─── final_clusters ───────────────────────────────────────────────────────────

describe("scorePairContrast — final_clusters (mist / miss)", () => {
  it("passes when /st/ final cluster scores above threshold", () => {
    const r = scorePairContrast("mist", MIST_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("final_cluster_simplification");
    expect(r!.evidence).toBeNull();
  });

  it("fails when final /t/ is dropped from /st/ cluster", () => {
    const r = scorePairContrast("mist", MIST_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("final_cluster_simplification");
    expect(r!.evidence?.phoneme).toBe("t");
    expect(r!.evidence!.score).toBeLessThan(70);
  });

  it("also resolves from the target-word side (miss)", () => {
    const r = scorePairContrast("miss", MIST_PASS, INDEX);
    expect(r).not.toBeNull();
    expect(r!.contrastWord).toBe("mist");
    expect(r!.contrastType).toBe("final_cluster_simplification");
  });
});

// ─── long_short_vowels ────────────────────────────────────────────────────────

describe("scorePairContrast — long_short_vowels (sheep / ship)", () => {
  it("passes when /iː/ vowel scores above threshold", () => {
    const r = scorePairContrast("sheep", SHEEP_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("vowel_length");
    expect(r!.evidence).toBeNull();
  });

  it("fails when /iː/ is shortened or laxed (heard as ship)", () => {
    const r = scorePairContrast("sheep", SHEEP_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("vowel_length");
    expect(r!.evidence?.phoneme).toBe("iy");
  });
});

// ─── diphthongs ───────────────────────────────────────────────────────────────

describe("scorePairContrast — diphthongs (coat / caught)", () => {
  it("passes when /oʊ/ diphthong scores above threshold", () => {
    const r = scorePairContrast("coat", COAT_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("diphthong_reduction");
    expect(r!.evidence).toBeNull();
  });

  it("fails when diphthong is reduced to monophthong", () => {
    const r = scorePairContrast("coat", COAT_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("diphthong_reduction");
    expect(r!.evidence?.phoneme).toBe("ow");
  });
});

// ─── stress_pairs ─────────────────────────────────────────────────────────────

describe("scorePairContrast — stress_pairs (record noun / verb)", () => {
  it("passes when overall word accuracy is above threshold", () => {
    const r = scorePairContrast("record (noun)", RECORD_NOUN_PASS, INDEX);
    expect(r!.failed).toBe(false);
    expect(r!.contrastType).toBe("word_stress");
    expect(r!.evidence).toBeNull();
  });

  it("fails when overall word accuracy is below threshold (stress shifted)", () => {
    const r = scorePairContrast("record (noun)", RECORD_NOUN_FAIL, INDEX);
    expect(r!.failed).toBe(true);
    expect(r!.contrastType).toBe("word_stress");
    expect(r!.evidence?.phoneme).toBe("(word)");
    expect(r!.evidence!.score).toBeLessThan(70);
  });

  it("resolves correct contrastWord for the noun side", () => {
    const r = scorePairContrast("record (noun)", RECORD_NOUN_PASS, INDEX);
    expect(r!.contrastWord).toBe("record (verb)");
  });
});
