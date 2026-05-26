// Hand-curated phoneme drill packs for the /practice/phoneme/:slug
// route. Each pack targets ONE phoneme (or a tightly-related pair like
// /ɪ/ vs /iː/) and contains exactly ten sentences progressing from
// simple to complex. The substitution insights and articulation tips
// are written for Vietnamese learners — they reference actual phonemes
// in the L1 inventory ("tiếng Việt không có /θ/") rather than generic
// ESL advice.
//
// IMPORTANT: This content is hand-written. AI-generated drill sentences
// produce surface-correct examples that miss the point — you can write
// "She thanks Mr. Smith" all day and never realize that the trickier
// failure mode is "/θ/ at word-end" or "/θ/-cluster blends." Each pack
// therefore includes a mix of word-initial, word-medial, word-final,
// and consonant-cluster appearances of the target phoneme.
//
// Schema is imported by:
//   - src/pages/practice/PhonemeDrillPage.tsx (reads pack by slug)
//   - src/components/pronunciation/HeatmapDrillDown.tsx (CTA → drill)
//   - src/components/home/RecommendedDrillCard.tsx
//   - src/lib/pronunciation/__tests__/phonemeDrills.test.ts
//
// Slugs are ASCII-safe (the route is /practice/phoneme/:slug). For
// pairs we use joined keys: `ih_iy`, `uh_uw`, `p_b_final`, etc.

// ── Types ───────────────────────────────────────────────────────────────

export type DrillSentence = {
  /** Target English sentence the learner reads aloud. */
  sentence_en: string;
  /** Vietnamese translation shown beneath. */
  sentence_vi: string;
  /**
   * 0-indexed word positions in `sentence_en` that contain the target
   * phoneme. The drill UI underlines / colors these words so the
   * learner sees exactly which sound they're aiming for.
   */
  target_word_indices: readonly number[];
  /** Optional one-liner reminder shown when this sentence is active. */
  notes_vi?: string;
};

export type CommonSubstitution = {
  /** The wrong sound learners typically produce (IPA, in slashes). */
  wrong_ipa: string;
  /** Vietnamese explanation of WHY this swap happens. */
  why_vi: string;
};

/**
 * Discriminator for the kind of pronunciation contrast a pack targets.
 * Defaults to 'phoneme' when omitted (back-compat with the original 24
 * packs). 'stress' and 'intonation' packs may omit `phoneme_ipa` since
 * the unit they teach isn't a single phoneme.
 */
export type PackKind = "phoneme" | "stress" | "intonation";

export type PhonemeDrillPack = {
  /** ASCII URL slug. Stable — used in route + telemetry + graduation key. */
  slug: string;
  /**
   * Pack kind. Omitting → 'phoneme'. The route + heatmap render the
   * same UI for all kinds; this field is read by tests and (later) by
   * any consumer that needs to fork behavior per-kind.
   */
  pack_kind?: PackKind;
  /**
   * IPA representation shown to the learner ("/θ/"). Required for
   * `pack_kind === 'phoneme'`; optional for stress / intonation packs
   * (whose unit isn't a single phoneme). May be a non-IPA glyph like
   * "ˈ" (primary stress mark) when present on a stress pack.
   */
  phoneme_ipa?: string;
  /** Vietnamese display label. */
  phoneme_label_vi: string;
  /** English display label. */
  phoneme_label_en: string;
  /**
   * Canonical phoneme keys this pack covers. Used by the heatmap CTA
   * to find the right pack from a (single-key) cell click. Pairs like
   * `ih_iy` list both "ih" and "iy". Stress / intonation packs use a
   * placeholder key ("stress" / "intonation") since they don't surface
   * on the phoneme heatmap.
   */
  canonical_phonemes: readonly string[];
  /** Testable physical cue — mirror, finger on throat, etc. */
  articulation_tip_vi: string;
  articulation_tip_en: string;
  /** L1-interference patterns. At least 1 entry, usually 2–3. */
  common_vn_substitutions: readonly CommonSubstitution[];
  /** Always exactly 10 sentences, simple → complex. */
  sentences: readonly DrillSentence[];
};

// ── Packs ───────────────────────────────────────────────────────────────

const TH: PhonemeDrillPack = {
  slug: "th",
  phoneme_ipa: "/θ/",
  phoneme_label_vi: "âm /θ/ — th vô thanh",
  phoneme_label_en: "/θ/ — voiceless 'th'",
  canonical_phonemes: ["th"],
  articulation_tip_vi:
    "Đặt đầu lưỡi nhẹ giữa hai hàm răng, thổi hơi ra. Soi gương: phải thấy lưỡi nhô ra một chút, không để lưỡi chạm răng quá mạnh.",
  articulation_tip_en:
    "Tip your tongue lightly between your upper and lower teeth and blow air out. Use a mirror — you should see the tongue tip just past your teeth.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/t/",
      why_vi:
        "Tiếng Việt không có /θ/. Người học thường thay bằng /t/ vì lưỡi chạm sau răng trên — gần đúng nhưng âm sẽ nghe cứng và đứt.",
    },
    {
      wrong_ipa: "/s/",
      why_vi:
        "Một số người thay /θ/ bằng /s/ vì cả hai đều là âm xát. Sai vì /s/ phát từ phía trong miệng, còn /θ/ phải có lưỡi giữa răng.",
    },
  ],
  sentences: [
    { sentence_en: "I think so.", sentence_vi: "Tôi nghĩ vậy.", target_word_indices: [1] },
    { sentence_en: "Three thin trees.", sentence_vi: "Ba cái cây gầy.", target_word_indices: [0, 1] },
    { sentence_en: "Thank you, sir.", sentence_vi: "Cảm ơn anh.", target_word_indices: [0] },
    { sentence_en: "She has a thick book.", sentence_vi: "Cô ấy có một cuốn sách dày.", target_word_indices: [3] },
    { sentence_en: "Throw it through the door.", sentence_vi: "Ném nó qua cửa.", target_word_indices: [0, 2] },
    { sentence_en: "My birthday is on Thursday.", sentence_vi: "Sinh nhật của tôi vào thứ năm.", target_word_indices: [1, 4] },
    { sentence_en: "Both brothers like math.", sentence_vi: "Cả hai anh em đều thích toán.", target_word_indices: [0, 3], notes_vi: "Chú ý /θ/ ở cuối từ both và math." },
    { sentence_en: "I think this thought is true.", sentence_vi: "Tôi nghĩ ý này đúng.", target_word_indices: [1, 3] },
    { sentence_en: "Healthy mouth, healthy teeth.", sentence_vi: "Miệng khoẻ, răng khoẻ.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Throughout the month, thank everyone.", sentence_vi: "Suốt tháng, cảm ơn mọi người.", target_word_indices: [0, 2, 3], notes_vi: "Từ throughout có /θ/ đầu — đừng bỏ qua." },
  ],
};

const DH: PhonemeDrillPack = {
  slug: "dh",
  phoneme_ipa: "/ð/",
  phoneme_label_vi: "âm /ð/ — th hữu thanh",
  phoneme_label_en: "/ð/ — voiced 'th'",
  canonical_phonemes: ["dh"],
  articulation_tip_vi:
    "Vị trí lưỡi giống /θ/ (giữa răng), nhưng RUNG dây thanh. Đặt ngón tay vào cổ họng — phải cảm thấy rung. Nếu không rung, bạn đang phát /θ/.",
  articulation_tip_en:
    "Same tongue position as /θ/ (between teeth) but vibrate your vocal cords. Touch your throat — you should feel a buzz. No buzz means you're saying /θ/.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/d/",
      why_vi:
        "Người Việt hay thay /ð/ bằng /d/ vì cùng là âm hữu thanh. Sai vì /d/ là âm tắc (lưỡi chạm chặt rồi bật ra), còn /ð/ là âm xát (hơi ra liên tục).",
    },
    {
      wrong_ipa: "/z/",
      why_vi:
        "Một số người thay /ð/ bằng /z/. Cả hai đều là âm xát hữu thanh, nhưng /z/ phát từ trong miệng còn /ð/ phải có lưỡi nhô ra giữa răng.",
    },
  ],
  sentences: [
    { sentence_en: "This is the one.", sentence_vi: "Đây là cái đó.", target_word_indices: [0, 2] },
    { sentence_en: "That dog is mine.", sentence_vi: "Con chó đó là của tôi.", target_word_indices: [0] },
    { sentence_en: "Then they left.", sentence_vi: "Sau đó họ rời đi.", target_word_indices: [0, 1] },
    { sentence_en: "My mother and father.", sentence_vi: "Mẹ và cha của tôi.", target_word_indices: [1, 3] },
    { sentence_en: "Tell them the truth.", sentence_vi: "Nói cho họ sự thật.", target_word_indices: [1, 2] },
    { sentence_en: "These are their books.", sentence_vi: "Đây là sách của họ.", target_word_indices: [0, 2] },
    { sentence_en: "Together we breathe better.", sentence_vi: "Cùng nhau chúng ta thở tốt hơn.", target_word_indices: [0, 2] },
    { sentence_en: "The other brother smiled.", sentence_vi: "Người anh kia mỉm cười.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Either this or that.", sentence_vi: "Hoặc cái này hoặc cái kia.", target_word_indices: [0, 1, 3] },
    { sentence_en: "They gather rather smoothly.", sentence_vi: "Họ tụ họp khá êm.", target_word_indices: [0, 1, 2, 3], notes_vi: "Bốn từ liên tiếp đều có /ð/ — luyện liên kết." },
  ],
};

const V: PhonemeDrillPack = {
  slug: "v",
  phoneme_ipa: "/v/",
  phoneme_label_vi: "âm /v/ — môi-răng hữu thanh",
  phoneme_label_en: "/v/ — voiced labiodental fricative",
  canonical_phonemes: ["v"],
  articulation_tip_vi:
    "Cắn nhẹ môi DƯỚI bằng răng trên, rồi rung dây thanh khi thở ra. /v/ tiếng Anh KHÔNG giống /v/ tiếng Việt — tiếng Việt phát môi-môi, tiếng Anh phải có răng chạm môi.",
  articulation_tip_en:
    "Press your upper teeth lightly on your lower lip and voice it. English /v/ is labiodental — your teeth must touch your lip. Vietnamese /v/ is bilabial; that's the trap.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/v/ kiểu Việt (môi-môi)",
      why_vi:
        "Người miền Bắc thường phát /v/ tiếng Anh giống /v/ tiếng Việt — môi chạm môi. Phải có răng chạm môi dưới mới đúng.",
    },
    {
      wrong_ipa: "/j/ (như 'd' miền Nam)",
      why_vi:
        "Người miền Nam thường thay /v/ bằng /j/ (yêu) — 'very' nghe thành 'yery'. Hãy ép răng vào môi để nghe tiếng rung.",
    },
  ],
  sentences: [
    { sentence_en: "Very good.", sentence_vi: "Rất tốt.", target_word_indices: [0] },
    { sentence_en: "I love you.", sentence_vi: "Tôi yêu em.", target_word_indices: [1] },
    { sentence_en: "Five votes only.", sentence_vi: "Chỉ năm phiếu thôi.", target_word_indices: [0, 1] },
    { sentence_en: "Drive a van slowly.", sentence_vi: "Lái xe tải chậm.", target_word_indices: [0, 2] },
    { sentence_en: "Visit my village.", sentence_vi: "Ghé thăm làng tôi.", target_word_indices: [0, 2] },
    { sentence_en: "Save every video.", sentence_vi: "Lưu mọi video.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Have a brave evening.", sentence_vi: "Một buổi tối dũng cảm.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Vivian loves heavy lifting.", sentence_vi: "Vivian thích nâng vật nặng.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Voters value every vote.", sentence_vi: "Cử tri trân trọng mọi lá phiếu.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Vivid memories never leave us.", sentence_vi: "Ký ức sống động không bao giờ rời chúng ta.", target_word_indices: [0, 2, 3] },
  ],
};

const W: PhonemeDrillPack = {
  slug: "w",
  phoneme_ipa: "/w/",
  phoneme_label_vi: "âm /w/ — môi tròn",
  phoneme_label_en: "/w/ — voiced labiovelar approximant",
  canonical_phonemes: ["w"],
  articulation_tip_vi:
    "Tròn môi như khi huýt sáo, sau đó mở ra nhanh sang nguyên âm tiếp theo. KHÔNG có răng chạm môi — đó là /v/. Soi gương: môi phải tròn rồi rộng ra.",
  articulation_tip_en:
    "Round your lips like you're whistling, then open quickly to the next vowel. No teeth-on-lip — that would make /v/. Mirror: round → open.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/v/",
      why_vi:
        "Người Việt hay nhầm /w/ với /v/ vì cả hai gần môi. Phân biệt: /w/ môi tròn không răng, /v/ răng chạm môi.",
    },
    {
      wrong_ipa: "không phát âm",
      why_vi:
        "Trong từ như 'who', 'where', 'when', /w/ thường bị bỏ qua. Phải tròn môi rồi mới phát nguyên âm tiếp theo.",
    },
  ],
  sentences: [
    { sentence_en: "We win.", sentence_vi: "Chúng tôi thắng.", target_word_indices: [0, 1] },
    { sentence_en: "Where are we?", sentence_vi: "Chúng ta đang ở đâu?", target_word_indices: [0, 2] },
    { sentence_en: "Wait for water.", sentence_vi: "Đợi nước.", target_word_indices: [0, 2] },
    { sentence_en: "We watched twenty whales.", sentence_vi: "Chúng tôi xem hai mươi con cá voi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Always wear warm wool.", sentence_vi: "Luôn mặc len ấm.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Why won't William wait?", sentence_vi: "Sao William không đợi?", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "We will work weekends.", sentence_vi: "Chúng tôi sẽ làm cuối tuần.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Whatever weather, we walk.", sentence_vi: "Thời tiết thế nào chúng tôi cũng đi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "One quiet wonderful winter.", sentence_vi: "Một mùa đông yên tĩnh tuyệt vời.", target_word_indices: [0, 1, 2, 3], notes_vi: "/w/ ẩn trong 'one' và 'quiet'." },
    { sentence_en: "We won't worry without water.", sentence_vi: "Chúng tôi không lo nếu không có nước.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const R: PhonemeDrillPack = {
  slug: "r",
  phoneme_ipa: "/r/",
  phoneme_label_vi: "âm /r/ — uốn lưỡi",
  phoneme_label_en: "/r/ — voiced postalveolar approximant",
  canonical_phonemes: ["r"],
  articulation_tip_vi:
    "Cong lưỡi lên gần vòm miệng, ĐỪNG để chạm. Môi hơi tròn. /r/ tiếng Anh không rung — khác hẳn /r/ rung của tiếng Việt miền Trung.",
  articulation_tip_en:
    "Curl your tongue up toward the roof of your mouth without touching it. Lips slightly rounded. English /r/ does NOT trill — it glides.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/r/ rung",
      why_vi:
        "Người miền Trung và một số miền Bắc phát /r/ rung mạnh. /r/ tiếng Anh không rung — chỉ là âm lướt, lưỡi không chạm.",
    },
    {
      wrong_ipa: "/z/ hoặc /j/",
      why_vi:
        "Người miền Nam có khi thay /r/ bằng /j/ (giống 'dạ'). Phải cong lưỡi lên — không phẳng.",
    },
    {
      wrong_ipa: "âm Việt 'r'",
      why_vi:
        "/r/ Việt phát đầu lưỡi chạm gần răng. /r/ Anh phát phía sau, lưỡi cong lên cao và lùi.",
    },
  ],
  sentences: [
    { sentence_en: "Read it.", sentence_vi: "Đọc nó đi.", target_word_indices: [0] },
    { sentence_en: "A red car.", sentence_vi: "Một chiếc xe đỏ.", target_word_indices: [1, 2] },
    { sentence_en: "Run, Robert, run!", sentence_vi: "Chạy đi, Robert, chạy!", target_word_indices: [0, 1, 2] },
    { sentence_en: "Right or wrong?", sentence_vi: "Đúng hay sai?", target_word_indices: [0, 2] },
    { sentence_en: "Three rabbits ran around.", sentence_vi: "Ba con thỏ chạy quanh.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Robert reads every report.", sentence_vi: "Robert đọc mọi báo cáo.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Rural roads remain rough.", sentence_vi: "Đường nông thôn vẫn gập ghềnh.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Really, truly, every Friday.", sentence_vi: "Thực sự, mọi thứ sáu.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Around the corner, turn right.", sentence_vi: "Quẹo phải ở góc đường.", target_word_indices: [0, 3, 4] },
    { sentence_en: "Roar, river, roar through rocks.", sentence_vi: "Gầm lên, dòng sông, qua đá.", target_word_indices: [0, 1, 2, 4], notes_vi: "Luyện /r/ liên tiếp." },
  ],
};

const AE: PhonemeDrillPack = {
  slug: "ae",
  phoneme_ipa: "/æ/",
  phoneme_label_vi: "âm /æ/ — a mở, thấp",
  phoneme_label_en: "/æ/ — open front 'a' as in 'cat'",
  canonical_phonemes: ["ae"],
  articulation_tip_vi:
    "Mở miệng rộng, lưỡi để THẤP và đẩy về phía trước. Soi gương: hàm dưới phải hạ xuống nhiều hơn khi nói âm 'a' tiếng Việt.",
  articulation_tip_en:
    "Open your mouth wide, tongue low and forward. Mirror: your jaw should drop more than for Vietnamese 'a'.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/e/",
      why_vi:
        "Người Việt hay thay /æ/ bằng /e/ (như 'em') vì gần nhau. Phải mở rộng hàm hơn để có /æ/.",
    },
    {
      wrong_ipa: "/a/ Việt",
      why_vi:
        "/a/ Việt ngắn và sau hơn. /æ/ Anh dài hơn và nằm trước hơn — gần như 'eaaa' kéo dài.",
    },
  ],
  sentences: [
    { sentence_en: "A cat sat.", sentence_vi: "Một con mèo ngồi.", target_word_indices: [1, 2] },
    { sentence_en: "Pat had a hat.", sentence_vi: "Pat có một cái mũ.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Ann likes apples.", sentence_vi: "Ann thích táo.", target_word_indices: [0, 2] },
    { sentence_en: "Dad ran fast.", sentence_vi: "Bố chạy nhanh.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Sam packed a bag.", sentence_vi: "Sam xếp đồ vào túi.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Black cats catch rats.", sentence_vi: "Mèo đen bắt chuột.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "That family is happy.", sentence_vi: "Gia đình đó hạnh phúc.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Stand back, ask Adam.", sentence_vi: "Đứng lùi lại, hỏi Adam.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Anna grabbed a candy bag.", sentence_vi: "Anna lấy một túi kẹo.", target_word_indices: [0, 1, 3, 4] },
    { sentence_en: "Practice and patience matter.", sentence_vi: "Luyện tập và kiên nhẫn rất quan trọng.", target_word_indices: [0, 2, 3] },
  ],
};

const IH_IY: PhonemeDrillPack = {
  slug: "ih_iy",
  phoneme_ipa: "/ɪ/ vs /iː/",
  phoneme_label_vi: "cặp /ɪ/ và /iː/ — i ngắn vs i dài",
  phoneme_label_en: "/ɪ/ vs /iː/ — KIT vs FLEECE",
  canonical_phonemes: ["ih", "iy"],
  articulation_tip_vi:
    "/ɪ/ ngắn, lưỡi thấp hơn — như nói 'í' nhanh và lỏng. /iː/ dài, lưỡi cao và căng — như 'i' Việt nhưng kéo dài 1.5 lần. Đặt tay dưới hàm: /iː/ làm hàm căng hơn.",
  articulation_tip_en:
    "/ɪ/ short, lax tongue. /iː/ long, tense tongue. Hand under jaw: /iː/ feels more taut.",
  common_vn_substitutions: [
    {
      wrong_ipa: "phát cả hai như /i/ Việt",
      why_vi:
        "Tiếng Việt chỉ có một âm /i/. Người học thường gộp cả /ɪ/ và /iː/ thành 'i' — 'ship' và 'sheep' nghe giống nhau.",
    },
    {
      wrong_ipa: "kéo dài /ɪ/ thành /iː/",
      why_vi:
        "/ɪ/ phải NGẮN và lỏng. Nếu kéo dài, tự động biến thành /iː/.",
    },
  ],
  sentences: [
    { sentence_en: "Ship and sheep.", sentence_vi: "Tàu và cừu.", target_word_indices: [0, 2], notes_vi: "Cặp đối lập kinh điển." },
    { sentence_en: "It is easy.", sentence_vi: "Nó dễ.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Sit and read.", sentence_vi: "Ngồi và đọc.", target_word_indices: [0, 2] },
    { sentence_en: "I see six bees.", sentence_vi: "Tôi thấy sáu con ong.", target_word_indices: [1, 2, 3] },
    { sentence_en: "Bill eats green beans.", sentence_vi: "Bill ăn đậu xanh.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "This week is busy.", sentence_vi: "Tuần này bận.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Please listen and repeat.", sentence_vi: "Xin nghe và lặp lại.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Jim leaves his quiet city.", sentence_vi: "Jim rời thành phố yên tĩnh.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Three little fish swim deep.", sentence_vi: "Ba con cá nhỏ bơi sâu.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Tim seems extremely fit indeed.", sentence_vi: "Tim trông rất khoẻ.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const UH_UW: PhonemeDrillPack = {
  slug: "uh_uw",
  phoneme_ipa: "/ʊ/ vs /uː/",
  phoneme_label_vi: "cặp /ʊ/ và /uː/ — u ngắn vs u dài",
  phoneme_label_en: "/ʊ/ vs /uː/ — FOOT vs GOOSE",
  canonical_phonemes: ["uh", "uw"],
  articulation_tip_vi:
    "/ʊ/ ngắn, môi tròn nhẹ — như 'ư' lỏng. /uː/ dài, môi tròn căng — như 'u' Việt kéo dài, lưỡi đẩy lùi cao.",
  articulation_tip_en:
    "/ʊ/ short, lax. /uː/ long, tense, lips rounded tight. Compare 'foot' (short) vs 'food' (long).",
  common_vn_substitutions: [
    {
      wrong_ipa: "phát cả hai như /u/ Việt",
      why_vi:
        "Tiếng Việt /u/ ở giữa hai âm này. Phải phân biệt: 'pull' /pʊl/ ngắn, 'pool' /puːl/ dài.",
    },
    {
      wrong_ipa: "/ɔ/ thay cho /ʊ/",
      why_vi:
        "Một số người phát /ʊ/ thành /ɔ/ ('ô'). Sai — môi tròn nhỏ hơn, lưỡi cao hơn.",
    },
  ],
  sentences: [
    { sentence_en: "Look at the moon.", sentence_vi: "Nhìn mặt trăng kìa.", target_word_indices: [0, 3] },
    { sentence_en: "Put it in soup.", sentence_vi: "Cho vào súp.", target_word_indices: [0, 3] },
    { sentence_en: "Good food, good mood.", sentence_vi: "Đồ ăn ngon, tâm trạng tốt.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Pull the pool cover.", sentence_vi: "Kéo nắp hồ bơi.", target_word_indices: [0, 2] },
    { sentence_en: "She took two books.", sentence_vi: "Cô ấy lấy hai cuốn sách.", target_word_indices: [1, 2, 3] },
    { sentence_en: "Cool wool socks indoors.", sentence_vi: "Tất len mát trong nhà.", target_word_indices: [0, 1] },
    { sentence_en: "True or false answers.", sentence_vi: "Câu trả lời đúng sai.", target_word_indices: [0] },
    { sentence_en: "Could you choose soon?", sentence_vi: "Bạn chọn sớm được không?", target_word_indices: [0, 2, 3] },
    { sentence_en: "Foolish butchers cook food.", sentence_vi: "Đầu bếp khờ nấu đồ.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Beautiful blue room overlooking.", sentence_vi: "Phòng xanh đẹp nhìn ra.", target_word_indices: [0, 1, 2, 3] },
  ],
};

const EY: PhonemeDrillPack = {
  slug: "ey",
  phoneme_ipa: "/eɪ/",
  phoneme_label_vi: "âm đôi /eɪ/ — ê + i",
  phoneme_label_en: "/eɪ/ — FACE diphthong",
  canonical_phonemes: ["ey"],
  articulation_tip_vi:
    "Bắt đầu ở âm /e/ (như 'ê'), lướt sang /ɪ/. Hai âm — không phải một. Đặt tay dưới hàm: hàm phải nhích lên giữa chừng.",
  articulation_tip_en:
    "Start at /e/, glide to /ɪ/. Two sounds in one — your jaw rises mid-glide. Don't say a flat 'e'.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/e/ Việt phẳng",
      why_vi:
        "Người Việt hay phát 'ê' thẳng và ngắn. /eɪ/ phải có chuyển động lên — không tĩnh.",
    },
  ],
  sentences: [
    { sentence_en: "Say hi.", sentence_vi: "Chào đi.", target_word_indices: [0] },
    { sentence_en: "Today is May eighth.", sentence_vi: "Hôm nay là mùng tám tháng năm.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Pay the lady.", sentence_vi: "Trả cho cô ấy.", target_word_indices: [0, 2] },
    { sentence_en: "Wait for Jane.", sentence_vi: "Đợi Jane.", target_word_indices: [0, 2] },
    { sentence_en: "They came late.", sentence_vi: "Họ đến muộn.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Eight grey planes today.", sentence_vi: "Tám máy bay xám hôm nay.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Make a great escape.", sentence_vi: "Trốn thoát thành công.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Save space, save paper.", sentence_vi: "Tiết kiệm chỗ, tiết kiệm giấy.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Maybe Jake will stay.", sentence_vi: "Có lẽ Jake sẽ ở lại.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Daily training pays great rewards.", sentence_vi: "Luyện hàng ngày trả công xứng đáng.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const AY: PhonemeDrillPack = {
  slug: "ay",
  phoneme_ipa: "/aɪ/",
  phoneme_label_vi: "âm đôi /aɪ/ — a + i",
  phoneme_label_en: "/aɪ/ — PRICE diphthong",
  canonical_phonemes: ["ay"],
  articulation_tip_vi:
    "Bắt đầu ở /a/ mở rộng, lướt nhanh sang /ɪ/. Khác 'ai' tiếng Việt — phần đầu phải mở rộng hàm hơn.",
  articulation_tip_en:
    "Start at open /a/, glide quickly to /ɪ/. Compare to Vietnamese 'ai' — the start is wider.",
  common_vn_substitutions: [
    {
      wrong_ipa: "'ai' Việt phẳng",
      why_vi:
        "Tiếng Việt 'ai' không có chuyển động hàm rõ. /aɪ/ phải có hàm mở rộng rồi đóng.",
    },
  ],
  sentences: [
    { sentence_en: "I like pie.", sentence_vi: "Tôi thích bánh.", target_word_indices: [0, 1, 2] },
    { sentence_en: "My time, my life.", sentence_vi: "Thời gian, cuộc đời tôi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Five white kites.", sentence_vi: "Năm con diều trắng.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Mike rides his bike.", sentence_vi: "Mike đạp xe.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Why try tonight?", sentence_vi: "Sao phải cố tối nay?", target_word_indices: [0, 1] },
    { sentence_en: "Bright lights blind eyes.", sentence_vi: "Đèn sáng làm mù mắt.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "I tried writing twice.", sentence_vi: "Tôi đã thử viết hai lần.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Nine quiet kids cycled.", sentence_vi: "Chín đứa trẻ yên tĩnh đạp xe.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Time flies; nights pass quickly.", sentence_vi: "Thời gian trôi nhanh.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Slight pride blinds bright minds.", sentence_vi: "Tự cao nhẹ làm mù trí tuệ.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const OW: PhonemeDrillPack = {
  slug: "ow",
  phoneme_ipa: "/oʊ/",
  phoneme_label_vi: "âm đôi /oʊ/ — ô + u",
  phoneme_label_en: "/oʊ/ — GOAT diphthong",
  canonical_phonemes: ["ow"],
  articulation_tip_vi:
    "Bắt đầu ở /o/ (môi tròn vừa), lướt sang /ʊ/ (môi tròn nhỏ hơn). KHÔNG phẳng như 'ô' Việt — môi phải khép lại dần.",
  articulation_tip_en:
    "Start at /o/ (medium-rounded lips), glide to /ʊ/ (tighter rounding). Lips close in — not a flat Vietnamese 'ô'.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/o/ Việt phẳng",
      why_vi:
        "'ô' Việt không có chuyển động môi. /oʊ/ phải có chuyển động khép môi rõ — bắt đầu mở, kết thúc khép.",
    },
  ],
  sentences: [
    { sentence_en: "Go home.", sentence_vi: "Về nhà đi.", target_word_indices: [0, 1] },
    { sentence_en: "Slow down.", sentence_vi: "Chậm lại.", target_word_indices: [0] },
    { sentence_en: "I know Joe.", sentence_vi: "Tôi biết Joe.", target_word_indices: [1, 2] },
    { sentence_en: "Both boats float low.", sentence_vi: "Cả hai thuyền nổi thấp.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Don't open old roads.", sentence_vi: "Đừng mở đường cũ.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Snow grows over stones.", sentence_vi: "Tuyết phủ trên đá.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Both hosts told jokes.", sentence_vi: "Cả hai chủ đều kể chuyện.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Hopeful poets compose slowly.", sentence_vi: "Nhà thơ đầy hy vọng sáng tác chậm.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Most known stories grow old.", sentence_vi: "Hầu hết truyện nổi tiếng đều cũ.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Lonely roads only roll homeward.", sentence_vi: "Đường vắng chỉ quay về nhà.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const CH: PhonemeDrillPack = {
  slug: "ch",
  phoneme_ipa: "/tʃ/",
  phoneme_label_vi: "âm /tʃ/ — ch tiếng Anh",
  phoneme_label_en: "/tʃ/ — voiceless postalveolar affricate",
  canonical_phonemes: ["ch"],
  articulation_tip_vi:
    "/tʃ/ là TỔ HỢP /t/ + /ʃ/ — đầu lưỡi chạm rồi bật ra với hơi xát. KHÁC /ch/ Việt — Việt mềm và phẳng hơn, /tʃ/ Anh có nhiều hơi.",
  articulation_tip_en:
    "/tʃ/ is /t/ + /ʃ/ blended — tongue tip touches, then releases with friction. More airy than Vietnamese 'ch'.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/ʃ/",
      why_vi:
        "Người Việt thường bỏ phần /t/ ở đầu, biến /tʃ/ thành /ʃ/. 'cheap' nghe thành 'sheep'.",
    },
    {
      wrong_ipa: "/ch/ Việt mềm",
      why_vi:
        "/ch/ Việt không có hơi xát đậm. /tʃ/ Anh có hơi rõ — như đẩy hơi mạnh ra.",
    },
  ],
  sentences: [
    { sentence_en: "Cheap chair.", sentence_vi: "Ghế rẻ.", target_word_indices: [0, 1] },
    { sentence_en: "Catch a chicken.", sentence_vi: "Bắt một con gà.", target_word_indices: [0, 2] },
    { sentence_en: "Choose chocolate cherries.", sentence_vi: "Chọn anh đào sô cô la.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Each child watched.", sentence_vi: "Mỗi đứa trẻ đã xem.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Charlie's church is rich.", sentence_vi: "Nhà thờ của Charlie giàu có.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Much cheaper than chains.", sentence_vi: "Rẻ hơn nhiều xích.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Choose cheese for lunch.", sentence_vi: "Chọn pho mát cho bữa trưa.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Children cheer at matches.", sentence_vi: "Trẻ em reo hò ở trận đấu.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Chase that chubby chipmunk.", sentence_vi: "Đuổi con sóc mập đó.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Each teacher teaches enriched lectures.", sentence_vi: "Mỗi giáo viên dạy bài giảng phong phú.", target_word_indices: [0, 1, 2, 3] },
  ],
};

const JH: PhonemeDrillPack = {
  slug: "jh",
  phoneme_ipa: "/dʒ/",
  phoneme_label_vi: "âm /dʒ/ — j tiếng Anh",
  phoneme_label_en: "/dʒ/ — voiced postalveolar affricate",
  canonical_phonemes: ["jh"],
  articulation_tip_vi:
    "Vị trí giống /tʃ/ nhưng có rung dây thanh. Đặt ngón vào cổ — phải cảm thấy rung. /dʒ/ KHÁC âm 'gi' Việt — Anh phải có sự bật rồi xát.",
  articulation_tip_en:
    "Same position as /tʃ/ but voiced. Throat buzzes. Different from Vietnamese 'gi' — English version has stop-then-friction.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/j/ (như 'y' Việt)",
      why_vi:
        "Người Việt hay phát /dʒ/ thành /j/ — 'jeep' nghe thành 'yeep'. Phải có lưỡi chạm vòm trước.",
    },
    {
      wrong_ipa: "'gi' Việt",
      why_vi:
        "'gi' Việt mềm, không có sự bật. /dʒ/ phải bắt đầu bằng âm tắc /d/ rồi mới xát.",
    },
  ],
  sentences: [
    { sentence_en: "John jumps.", sentence_vi: "John nhảy.", target_word_indices: [0, 1] },
    { sentence_en: "Just enjoy June.", sentence_vi: "Cứ tận hưởng tháng sáu.", target_word_indices: [0, 1, 2] },
    { sentence_en: "George judges jam.", sentence_vi: "George chấm điểm mứt.", target_word_indices: [0, 1, 2] },
    { sentence_en: "A large bridge.", sentence_vi: "Một cây cầu lớn.", target_word_indices: [1, 2] },
    { sentence_en: "Jenny enjoys orange juice.", sentence_vi: "Jenny thích nước cam.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Just imagine major changes.", sentence_vi: "Hãy tưởng tượng thay đổi lớn.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Jim's jacket suggests danger.", sentence_vi: "Áo của Jim gợi sự nguy hiểm.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Engineers manage huge projects.", sentence_vi: "Kỹ sư quản lý dự án lớn.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "The judge urged just judgment.", sentence_vi: "Quan toà yêu cầu phán quyết công bằng.", target_word_indices: [1, 2, 3, 4] },
    { sentence_en: "Generally, large genuine joys jingle.", sentence_vi: "Thường thì niềm vui chân thật lớn vang lên.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const SH: PhonemeDrillPack = {
  slug: "sh",
  phoneme_ipa: "/ʃ/",
  phoneme_label_vi: "âm /ʃ/ — sh tiếng Anh",
  phoneme_label_en: "/ʃ/ — voiceless postalveolar fricative",
  canonical_phonemes: ["sh"],
  articulation_tip_vi:
    "Môi tròn nhẹ, lưỡi đặt sau ổ răng (xa hơn /s/). Hơi ra liên tục — không bật. Như tiếng nhắc 'shhh'.",
  articulation_tip_en:
    "Lips slightly rounded, tongue further back than /s/. Continuous airflow — like a 'shhh' for 'be quiet'.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/s/ Việt",
      why_vi:
        "/s/ Việt phát đầu lưỡi gần răng, /ʃ/ Anh phát lưỡi lùi hơn nhiều. Tròn môi để nghe khác biệt.",
    },
  ],
  sentences: [
    { sentence_en: "She shines.", sentence_vi: "Cô ấy toả sáng.", target_word_indices: [0, 1] },
    { sentence_en: "A short shower.", sentence_vi: "Một cơn mưa ngắn.", target_word_indices: [1, 2] },
    { sentence_en: "Wash this sheep.", sentence_vi: "Tắm con cừu này.", target_word_indices: [0, 2] },
    { sentence_en: "Sharp ships sail.", sentence_vi: "Tàu sắc nét đi biển.", target_word_indices: [0, 1] },
    { sentence_en: "She showed shy fish.", sentence_vi: "Cô ấy chỉ cá nhút nhát.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Should shoppers shout?", sentence_vi: "Người mua sắm có nên hét?", target_word_indices: [0, 1, 2] },
    { sentence_en: "Shells crashed on shore.", sentence_vi: "Vỏ sò vỡ trên bờ.", target_word_indices: [0, 3] },
    { sentence_en: "Sharing fashion shows shapes.", sentence_vi: "Chia sẻ chương trình thời trang định hình.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "She wished shiny shells washed up.", sentence_vi: "Cô ước vỏ sò sáng dạt vào.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Shall sharp Sherlock shadow Sheila?", sentence_vi: "Sherlock sắc bén có nên theo Sheila?", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const ZH: PhonemeDrillPack = {
  slug: "zh",
  phoneme_ipa: "/ʒ/",
  phoneme_label_vi: "âm /ʒ/ — sh có rung",
  phoneme_label_en: "/ʒ/ — voiced postalveolar fricative",
  canonical_phonemes: ["zh"],
  articulation_tip_vi:
    "Giống /ʃ/ nhưng RUNG dây thanh. Hiếm trong tiếng Anh — chủ yếu trong từ gốc Pháp như 'measure', 'vision'. Đặt tay vào cổ — phải có rung.",
  articulation_tip_en:
    "Like /ʃ/ but voiced. Rare in English — mostly in French-origin words ('measure', 'vision'). Throat must buzz.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/ʃ/",
      why_vi:
        "Người Việt hay bỏ rung, phát /ʒ/ thành /ʃ/. 'measure' phải có rung — không phẳng như 'me-sher'.",
    },
    {
      wrong_ipa: "/z/",
      why_vi:
        "Một số người thay /ʒ/ bằng /z/. Sai vì /z/ phát phía trước hơn — /ʒ/ phải có lưỡi lùi và môi tròn.",
    },
  ],
  sentences: [
    { sentence_en: "A vision.", sentence_vi: "Một tầm nhìn.", target_word_indices: [1] },
    { sentence_en: "Measure twice.", sentence_vi: "Đo hai lần.", target_word_indices: [0] },
    { sentence_en: "Casual treasure.", sentence_vi: "Kho báu bình thường.", target_word_indices: [0, 1] },
    { sentence_en: "Pleasure of leisure.", sentence_vi: "Niềm vui khi rảnh.", target_word_indices: [0, 2] },
    { sentence_en: "Asia and decision.", sentence_vi: "Á châu và quyết định.", target_word_indices: [0, 2] },
    { sentence_en: "Usual television show.", sentence_vi: "Chương trình tivi thường lệ.", target_word_indices: [0, 1] },
    { sentence_en: "Casually measure pleasure.", sentence_vi: "Đo niềm vui bình thường.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Vision drives my decision.", sentence_vi: "Tầm nhìn dẫn dắt quyết định.", target_word_indices: [0, 3] },
    { sentence_en: "Casual collision in Asia.", sentence_vi: "Va chạm tình cờ ở Á.", target_word_indices: [0, 1, 3] },
    { sentence_en: "The measure of usual treasure.", sentence_vi: "Thước đo của kho báu thường.", target_word_indices: [1, 3, 4] },
  ],
};

const NG: PhonemeDrillPack = {
  slug: "ng",
  phoneme_ipa: "/ŋ/",
  phoneme_label_vi: "âm /ŋ/ — ng tiếng Anh",
  phoneme_label_en: "/ŋ/ — velar nasal",
  canonical_phonemes: ["ng"],
  articulation_tip_vi:
    "Đáy lưỡi nâng lên chạm vòm mềm, hơi qua mũi. /ŋ/ Việt và Anh GIỐNG nhau — nhưng /ŋ/ Anh thường KHÔNG đi với /g/ ở đuôi. 'sing' = /sɪŋ/, không phải /sɪŋ-g/.",
  articulation_tip_en:
    "Back of tongue touches soft palate, air through nose. Vietnamese has the same sound — but English /ŋ/ at word-end is usually NOT followed by /g/.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/ŋg/",
      why_vi:
        "Người Việt hay thêm /g/ sau /ŋ/. 'singing' phải là /sɪŋɪŋ/ chứ không phải 'sing-ging'.",
    },
    {
      wrong_ipa: "/n/",
      why_vi:
        "Một số người thay /ŋ/ bằng /n/ ở cuối từ. 'thing' nghe thành 'thin'.",
    },
  ],
  sentences: [
    { sentence_en: "I am running.", sentence_vi: "Tôi đang chạy.", target_word_indices: [2] },
    { sentence_en: "Sing along.", sentence_vi: "Hát theo.", target_word_indices: [0, 1] },
    { sentence_en: "King of swing.", sentence_vi: "Vua của swing.", target_word_indices: [0, 2] },
    { sentence_en: "Long strong wings.", sentence_vi: "Cánh dài và khoẻ.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Working and waiting.", sentence_vi: "Làm việc và chờ đợi.", target_word_indices: [0, 2] },
    { sentence_en: "Bring everything along.", sentence_vi: "Mang mọi thứ theo.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Singing brings strong feelings.", sentence_vi: "Hát mang lại cảm xúc mạnh.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Young king ringing bells.", sentence_vi: "Vua trẻ rung chuông.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Hanging laundry on a string.", sentence_vi: "Phơi đồ trên dây.", target_word_indices: [0, 4] },
    { sentence_en: "Spring evenings bring lasting joy.", sentence_vi: "Tối xuân mang niềm vui lâu.", target_word_indices: [0, 1, 2, 3] },
  ],
};

const L_FINAL: PhonemeDrillPack = {
  slug: "l_final",
  phoneme_ipa: "/l/ (cuối từ)",
  phoneme_label_vi: "âm /l/ ở cuối từ — 'dark L'",
  phoneme_label_en: "/l/ at word-end — dark L",
  canonical_phonemes: ["l"],
  articulation_tip_vi:
    "Đầu lưỡi chạm sau răng trên, đáy lưỡi NÂNG lên — tạo âm 'l' tối, sâu. KHÁC /l/ đầu từ (lưỡi chỉ chạm trên). Nhiều người Việt bỏ /l/ ở cuối — phải kết thúc lưỡi trên.",
  articulation_tip_en:
    "Tongue tip touches behind upper teeth, BACK of tongue raised — produces a dark /l/. Different from initial /l/. Many Vietnamese drop final /l/ — make sure tongue lands.",
  common_vn_substitutions: [
    {
      wrong_ipa: "bỏ qua /l/",
      why_vi:
        "Tiếng Việt không kết thúc bằng /l/. Người học hay bỏ — 'feel' nghe thành 'fee'.",
    },
    {
      wrong_ipa: "/n/",
      why_vi:
        "Một số người thay /l/ cuối bằng /n/. 'tell' nghe thành 'ten'.",
    },
  ],
  sentences: [
    { sentence_en: "Tell me.", sentence_vi: "Kể tôi nghe.", target_word_indices: [0] },
    { sentence_en: "Feel cool.", sentence_vi: "Thấy mát mẻ.", target_word_indices: [0, 1] },
    { sentence_en: "Call Bill.", sentence_vi: "Gọi Bill.", target_word_indices: [0, 1] },
    { sentence_en: "All well.", sentence_vi: "Tất cả ổn.", target_word_indices: [0, 1] },
    { sentence_en: "Will Paul fall?", sentence_vi: "Paul có ngã không?", target_word_indices: [0, 1, 2] },
    { sentence_en: "Tall, full, real apple.", sentence_vi: "Quả táo cao, đầy, thật.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Bill will tell Paul.", sentence_vi: "Bill sẽ kể cho Paul.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "I feel small and still.", sentence_vi: "Tôi thấy nhỏ bé và yên.", target_word_indices: [1, 2, 4] },
    { sentence_en: "Call Hill until full.", sentence_vi: "Gọi Hill đến khi đầy.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "All small models pull well.", sentence_vi: "Mọi mô hình nhỏ đều kéo tốt.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const S_FINAL: PhonemeDrillPack = {
  slug: "s_final",
  phoneme_ipa: "/s/ (cuối từ)",
  phoneme_label_vi: "âm /s/ ở cuối từ",
  phoneme_label_en: "/s/ at word-end",
  canonical_phonemes: ["s"],
  articulation_tip_vi:
    "Đầu lưỡi gần ổ răng, hơi ra liên tục, dây thanh KHÔNG rung. Người Việt thường bỏ /s/ cuối — phải nghe rõ tiếng 'sssss'.",
  articulation_tip_en:
    "Tongue tip near alveolar ridge, continuous airflow, no voicing. Vietnamese learners often drop final /s/ — make sure the hiss is audible.",
  common_vn_substitutions: [
    {
      wrong_ipa: "bỏ /s/",
      why_vi:
        "Tiếng Việt rất ít từ kết thúc bằng /s/. Người học bỏ qua — 'cats' nghe thành 'cat'.",
    },
    {
      wrong_ipa: "/sh/ thay vì /s/",
      why_vi:
        "Một số người phát /s/ cuối thành /ʃ/ vì lưỡi lùi. /s/ phải lưỡi phía trước, không tròn môi.",
    },
  ],
  sentences: [
    { sentence_en: "Yes, please.", sentence_vi: "Vâng, xin mời.", target_word_indices: [0] },
    { sentence_en: "Six cats.", sentence_vi: "Sáu con mèo.", target_word_indices: [0, 1] },
    { sentence_en: "He likes it.", sentence_vi: "Anh ấy thích.", target_word_indices: [1] },
    { sentence_en: "Class starts soon.", sentence_vi: "Lớp sắp bắt đầu.", target_word_indices: [0, 1] },
    { sentence_en: "Press this once.", sentence_vi: "Bấm cái này một lần.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Twenty buses pass us.", sentence_vi: "Hai mươi xe buýt đi qua.", target_word_indices: [1, 2, 3] },
    { sentence_en: "She passes glass slowly.", sentence_vi: "Cô ấy chuyền kính chậm.", target_word_indices: [1, 2] },
    { sentence_en: "His students miss class.", sentence_vi: "Học sinh của anh ấy lỡ lớp.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Strict guests notice mistakes.", sentence_vi: "Khách nghiêm khắc để ý lỗi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Bus stops cross busy streets.", sentence_vi: "Trạm xe buýt qua phố đông.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const Z_FINAL: PhonemeDrillPack = {
  slug: "z_final",
  phoneme_ipa: "/z/ (cuối từ)",
  phoneme_label_vi: "âm /z/ ở cuối từ",
  phoneme_label_en: "/z/ at word-end",
  canonical_phonemes: ["z"],
  articulation_tip_vi:
    "Vị trí giống /s/ nhưng RUNG dây thanh. Đặt tay vào cổ — phải rung. /z/ rất quan trọng cho dạng số nhiều và chia động từ ('he runs', 'two boys').",
  articulation_tip_en:
    "Same position as /s/ but voiced. Throat buzzes. Critical for plurals and conjugations.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/s/",
      why_vi:
        "Người Việt hay phát /z/ cuối thành /s/ — bỏ rung. 'eyes' nghe thành 'ice'.",
    },
    {
      wrong_ipa: "bỏ qua",
      why_vi:
        "Một số người bỏ /z/ cuối hoàn toàn. 'goes' nghe thành 'go'.",
    },
  ],
  sentences: [
    { sentence_en: "He goes.", sentence_vi: "Anh ấy đi.", target_word_indices: [1] },
    { sentence_en: "His eyes.", sentence_vi: "Mắt anh ấy.", target_word_indices: [0, 1] },
    { sentence_en: "Two boys arrive.", sentence_vi: "Hai cậu bé đến.", target_word_indices: [1] },
    { sentence_en: "She loves cheese.", sentence_vi: "Cô ấy thích pho mát.", target_word_indices: [1, 2] },
    { sentence_en: "Bees buzz inside.", sentence_vi: "Ong kêu bên trong.", target_word_indices: [0, 1] },
    { sentence_en: "Days pass slowly always.", sentence_vi: "Ngày trôi chậm.", target_word_indices: [0] },
    { sentence_en: "Kids bring news quickly.", sentence_vi: "Trẻ mang tin tức nhanh.", target_word_indices: [0, 2] },
    { sentence_en: "His shoes please his eyes.", sentence_vi: "Giày của anh ấy làm anh ấy hài lòng.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Roses please neighbors always.", sentence_vi: "Hoa hồng làm hàng xóm vui.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "These boys' rules raise eyebrows.", sentence_vi: "Quy tắc của các cậu bé khiến chú ý.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const P_B_FINAL: PhonemeDrillPack = {
  slug: "p_b_final",
  phoneme_ipa: "/p/ và /b/ (cuối từ)",
  phoneme_label_vi: "/p/ và /b/ ở cuối từ — phải bật ra",
  phoneme_label_en: "Final /p/ and /b/ — release the stop",
  canonical_phonemes: ["p", "b"],
  articulation_tip_vi:
    "Cả hai môi đóng lại rồi BẬT mở. /p/ vô thanh (không rung), /b/ hữu thanh (có rung trước khi bật). Người Việt KHÔNG bật cuối — phải tách môi rõ.",
  articulation_tip_en:
    "Lips close, then RELEASE. /p/ unvoiced, /b/ voiced (throat buzzes before release). Vietnamese stops don't release at word-end — make sure lips part audibly.",
  common_vn_substitutions: [
    {
      wrong_ipa: "không bật",
      why_vi:
        "Tiếng Việt không bật /p/ /b/ ở cuối — chỉ đóng môi. Tiếng Anh phải bật — 'cup' nghe khác 'cu'.",
    },
    {
      wrong_ipa: "/p/ và /b/ giống nhau",
      why_vi:
        "Khi không có rung, /b/ cuối nghe giống /p/. Phải duy trì rung dây thanh trước khi bật mới phân biệt được.",
    },
  ],
  sentences: [
    { sentence_en: "Stop the cab.", sentence_vi: "Dừng taxi.", target_word_indices: [0, 2] },
    { sentence_en: "Cap or cab?", sentence_vi: "Mũ hay taxi?", target_word_indices: [0, 2], notes_vi: "Cặp đối lập: phân biệt rõ /p/ và /b/." },
    { sentence_en: "Pup, pop, lab.", sentence_vi: "Chó con, nổ, phòng thí nghiệm.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Keep the cup up.", sentence_vi: "Giữ cốc lên.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Job, sob, rob.", sentence_vi: "Việc, khóc, cướp.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Sleep deep, dream tribe.", sentence_vi: "Ngủ sâu, mơ bộ tộc.", target_word_indices: [0, 1, 3] },
    { sentence_en: "He grabbed up the rope.", sentence_vi: "Anh ấy chộp lấy dây.", target_word_indices: [1, 2, 4] },
    { sentence_en: "Robb tipped the lab cap.", sentence_vi: "Robb chạm mũ phòng thí nghiệm.", target_word_indices: [0, 1, 3, 4] },
    { sentence_en: "Pop drops top crab.", sentence_vi: "Pop làm rơi cua to.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Slip, drop, hop, climb.", sentence_vi: "Trượt, rơi, nhảy, leo.", target_word_indices: [0, 1, 2, 3] },
  ],
};

const T_D_FINAL: PhonemeDrillPack = {
  slug: "t_d_final",
  phoneme_ipa: "/t/ và /d/ (cuối từ)",
  phoneme_label_vi: "/t/ và /d/ ở cuối từ — phải bật ra",
  phoneme_label_en: "Final /t/ and /d/ — release the stop",
  canonical_phonemes: ["t", "d"],
  articulation_tip_vi:
    "Đầu lưỡi chạm sau răng trên, ép hơi rồi BẬT. /t/ vô thanh, /d/ hữu thanh. Tiếng Việt không bật cuối — phải tách lưỡi nghe rõ.",
  articulation_tip_en:
    "Tongue tip touches behind upper teeth, build pressure, then RELEASE. /t/ unvoiced, /d/ voiced. Audible release is what Vietnamese learners miss.",
  common_vn_substitutions: [
    {
      wrong_ipa: "không bật",
      why_vi:
        "'cat' và 'cad' nghe giống nhau khi không bật. Phải tách lưỡi để nghe rõ.",
    },
    {
      wrong_ipa: "/t/ và /d/ trộn",
      why_vi:
        "Khi không rung dây thanh, /d/ cuối thành /t/. 'bed' nghe thành 'bet'.",
    },
  ],
  sentences: [
    { sentence_en: "Sit down.", sentence_vi: "Ngồi xuống.", target_word_indices: [0, 1] },
    { sentence_en: "Bad bet.", sentence_vi: "Cá cược xấu.", target_word_indices: [0, 1] },
    { sentence_en: "Bed, bet, bid.", sentence_vi: "Giường, cược, đặt giá.", target_word_indices: [0, 1, 2] },
    { sentence_en: "I made a list.", sentence_vi: "Tôi làm một danh sách.", target_word_indices: [1, 3] },
    { sentence_en: "Send that document.", sentence_vi: "Gửi tài liệu đó.", target_word_indices: [0, 1, 2] },
    { sentence_en: "He worked hard last week.", sentence_vi: "Anh ấy làm chăm chỉ tuần trước.", target_word_indices: [1, 2, 3] },
    { sentence_en: "Right, finished, edited, sent.", sentence_vi: "Đúng, xong, sửa, gửi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Add a hot bread basket.", sentence_vi: "Thêm giỏ bánh nóng.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Bad food spoiled the night.", sentence_vi: "Đồ dở làm hỏng đêm.", target_word_indices: [0, 1, 4] },
    { sentence_en: "Held tight, sailed straight ahead.", sentence_vi: "Giữ chặt, đi thẳng.", target_word_indices: [0, 1, 2, 3] },
  ],
};

const K_G_FINAL: PhonemeDrillPack = {
  slug: "k_g_final",
  phoneme_ipa: "/k/ và /g/ (cuối từ)",
  phoneme_label_vi: "/k/ và /g/ ở cuối từ — phải bật ra",
  phoneme_label_en: "Final /k/ and /g/ — release the stop",
  canonical_phonemes: ["k", "g"],
  articulation_tip_vi:
    "Đáy lưỡi nâng chạm vòm mềm, rồi BẬT mở. /k/ vô thanh, /g/ hữu thanh. Người Việt thường không bật — 'back' nghe lửng.",
  articulation_tip_en:
    "Back of tongue against soft palate, then RELEASE. /k/ unvoiced, /g/ voiced. Vietnamese stops don't release — give the burst.",
  common_vn_substitutions: [
    {
      wrong_ipa: "không bật",
      why_vi:
        "Tiếng Việt không bật /k/ /g/ cuối. Tiếng Anh phải có cú bật rõ — 'pick' nghe khác 'pic'.",
    },
    {
      wrong_ipa: "/k/ thay /g/",
      why_vi:
        "Khi không rung, /g/ cuối thành /k/. 'bag' nghe thành 'back'.",
    },
  ],
  sentences: [
    { sentence_en: "Pick a bag.", sentence_vi: "Chọn một túi.", target_word_indices: [0, 2] },
    { sentence_en: "Lock the dog.", sentence_vi: "Khoá con chó.", target_word_indices: [0, 2] },
    { sentence_en: "Back log book.", sentence_vi: "Sổ ghi chép cũ.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Big black truck.", sentence_vi: "Xe tải đen lớn.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Take a long walk.", sentence_vi: "Đi dạo lâu.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Make Frank pick six.", sentence_vi: "Bảo Frank chọn sáu.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "He drank cold milk.", sentence_vi: "Anh ấy uống sữa lạnh.", target_word_indices: [1, 2, 3] },
    { sentence_en: "Quick fox jumped logs.", sentence_vi: "Cáo nhanh nhảy qua khúc gỗ.", target_word_indices: [0, 2, 3] },
    { sentence_en: "Track black bug, pack snacks.", sentence_vi: "Theo bọ đen, gói đồ ăn vặt.", target_word_indices: [0, 1, 2, 3, 4] },
    { sentence_en: "Lock the back, take the dog.", sentence_vi: "Khoá cửa sau, dắt chó.", target_word_indices: [0, 2, 3, 5] },
  ],
};

const F: PhonemeDrillPack = {
  slug: "f",
  phoneme_ipa: "/f/",
  phoneme_label_vi: "âm /f/ — môi-răng vô thanh",
  phoneme_label_en: "/f/ — voiceless labiodental fricative",
  canonical_phonemes: ["f"],
  articulation_tip_vi:
    "Cắn nhẹ môi DƯỚI bằng răng trên, thở hơi ra (KHÔNG rung). Giống /v/ nhưng không có tiếng. /f/ Việt và Anh GIỐNG nhau — nhưng phải ép răng đủ chặt để có tiếng xát.",
  articulation_tip_en:
    "Upper teeth on lower lip, blow air. Same as Vietnamese /f/ — but make sure the teeth-on-lip contact is firm enough to produce friction.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/p/",
      why_vi:
        "Một số người thay /f/ bằng /p/ — 'fan' nghe thành 'pan'. Phải có răng chạm môi, không phải hai môi đóng.",
    },
  ],
  sentences: [
    { sentence_en: "Five fish.", sentence_vi: "Năm con cá.", target_word_indices: [0, 1] },
    { sentence_en: "A funny photo.", sentence_vi: "Một bức ảnh vui.", target_word_indices: [1, 2] },
    { sentence_en: "Fresh fruit.", sentence_vi: "Trái cây tươi.", target_word_indices: [0, 1] },
    { sentence_en: "Off and away.", sentence_vi: "Đi và rời khỏi.", target_word_indices: [0] },
    { sentence_en: "Frank found a friend.", sentence_vi: "Frank tìm thấy một người bạn.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Fluffy fries fell off.", sentence_vi: "Khoai tây nhẹ rơi.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Coffee for Phil first.", sentence_vi: "Cà phê cho Phil trước.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Half the staff filed forms.", sentence_vi: "Một nửa nhân viên nộp đơn.", target_word_indices: [0, 2, 3, 4] },
    { sentence_en: "Famous photographers fly often.", sentence_vi: "Nhiếp ảnh gia nổi tiếng bay thường.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Forty fifth-floor flats fit families.", sentence_vi: "Bốn mươi căn lầu năm phù hợp gia đình.", target_word_indices: [0, 1, 2, 3, 4] },
  ],
};

const H: PhonemeDrillPack = {
  slug: "h",
  phoneme_ipa: "/h/",
  phoneme_label_vi: "âm /h/ — h tiếng Anh",
  phoneme_label_en: "/h/ — glottal fricative",
  canonical_phonemes: ["h"],
  articulation_tip_vi:
    "Mở miệng, thở hơi ra mạnh từ cổ — không có vật cản trong miệng. KHÁC /h/ Việt — Việt mềm, đôi khi gần /kh/. /h/ Anh chỉ là hơi thở.",
  articulation_tip_en:
    "Open mouth, exhale strongly from throat — no obstruction. Vietnamese /h/ is sometimes close to /x/ (like 'kh'); English /h/ is purely breath.",
  common_vn_substitutions: [
    {
      wrong_ipa: "/x/ (như 'kh')",
      why_vi:
        "Người miền Bắc đôi khi phát /h/ Anh thành /x/ — gần /kh/ Việt. Phải nhẹ hơn, chỉ là hơi.",
    },
    {
      wrong_ipa: "bỏ qua",
      why_vi:
        "Người miền Nam có khi bỏ /h/. 'hello' phải có /h/ rõ — không phải 'ello'.",
    },
  ],
  sentences: [
    { sentence_en: "Hi, hello!", sentence_vi: "Chào, xin chào!", target_word_indices: [0, 1] },
    { sentence_en: "He has hope.", sentence_vi: "Anh ấy có hy vọng.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Help her home.", sentence_vi: "Giúp cô ấy về nhà.", target_word_indices: [0, 1, 2] },
    { sentence_en: "How happy he is.", sentence_vi: "Anh ấy vui làm sao.", target_word_indices: [0, 1, 2] },
    { sentence_en: "Hot heads need help.", sentence_vi: "Đầu nóng cần giúp.", target_word_indices: [0, 1, 3] },
    { sentence_en: "Hannah holds her hand.", sentence_vi: "Hannah nắm tay cô ấy.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "He hopes Henry helps.", sentence_vi: "Anh ấy mong Henry giúp.", target_word_indices: [0, 1, 2, 3] },
    { sentence_en: "Have a happy holiday home.", sentence_vi: "Chúc nhà nghỉ vui.", target_word_indices: [0, 2, 3, 4] },
    { sentence_en: "Honest hearts heal.", sentence_vi: "Trái tim chân thật chữa lành.", target_word_indices: [1, 2], notes_vi: "'Honest' không phát /h/ — luyện ngoại lệ." },
    { sentence_en: "Helen hurried home Wednesday.", sentence_vi: "Helen vội về nhà thứ tư.", target_word_indices: [0, 1, 2] },
  ],
};

// ── Stress packs ────────────────────────────────────────────────────────
//
// First non-phoneme pack. Targets word-stress placement — the most
// frequent prosodic L1-transfer error for Vietnamese learners, per
// docs/l1-taxonomies/vn-phoneme-gaps.md Gap 4 and STRATEGY §5. The
// PhonemeDrillPack schema gained a `pack_kind` discriminator + an
// optional `phoneme_ipa` so this pack fits the same route + UI as the
// 24 phoneme packs above without forcing a new component path.
//
// Selection criteria for the 10 contrasts:
//   - Noun/verb stress shift (REcord vs reCORD) — 3 pairs (6 sentences
//     would be possible but the brief asked for 10 contrasts total, so
//     5 pairs split across 3 noun/verb + 2 loanword + 5 trap-words).
//   - Loanwords where Vietnamese / French stress patterns leak in
//     (HOtel / HOSpital / etc).
//   - VN-pattern-trap words where the learner's default "even stress"
//     produces a confusable English form (banana, computer).
const STRESS_2_3_SYLLABLE: PhonemeDrillPack = {
  slug: "stress_2_3_syllable",
  pack_kind: "stress",
  // No phoneme_ipa — pack_kind is 'stress'. The UI's tip-button glyph
  // gracefully degrades to empty when this is absent.
  phoneme_label_vi: "trọng âm — từ 2–3 âm tiết",
  phoneme_label_en: "word stress — 2- and 3-syllable",
  canonical_phonemes: ["stress"],
  articulation_tip_vi:
    "Trọng âm trong tiếng Anh là một âm tiết được phát mạnh hơn, dài hơn, và cao hơn các âm tiết khác. Tiếng Việt phát các âm tiết khá đều, nên hãy luyện 'đẩy ra' đúng một âm tiết duy nhất — đừng phát đều.",
  articulation_tip_en:
    "English word stress means one syllable is louder, longer, and higher in pitch than the others. Vietnamese gives every syllable roughly equal weight, so practice pushing out exactly one syllable — don't say them evenly.",
  common_vn_substitutions: [
    {
      wrong_ipa: "even stress",
      why_vi:
        "Tiếng Việt là ngôn ngữ thanh điệu — mỗi âm tiết có thanh của riêng nó, độ dài và độ mạnh tương đối đều. Khi sang tiếng Anh, người Việt hay giữ thói quen này: COM-PU-TER thay vì com-PU-ter.",
    },
    {
      wrong_ipa: "first-syllable stress on loanwords",
      why_vi:
        "Loanword như 'hotel', 'cafe', 'computer' trong tiếng Việt và tiếng Pháp đều có khuôn nhấn riêng. Khi đọc tiếng Anh, người học hay nhấn vào âm tiết đầu (HO-tel) thay vì âm tiết hai (ho-TEL).",
    },
    {
      wrong_ipa: "final-syllable stress",
      why_vi:
        "Một số người học, dưới ảnh hưởng tiếng Pháp, nhấn vào âm tiết cuối (com-pu-TER, cof-FEE). Tiếng Anh chuẩn nhấn trọng âm ở vị trí khác — phải nghe mẫu để nhớ từng từ.",
    },
  ],
  sentences: [
    {
      sentence_en: "She broke the world record.",
      sentence_vi: "Cô ấy đã phá kỷ lục thế giới.",
      target_word_indices: [4],
      notes_vi: "Danh từ → trọng âm âm tiết đầu: RE-cord.",
    },
    {
      sentence_en: "I will record the meeting.",
      sentence_vi: "Tôi sẽ ghi âm cuộc họp.",
      target_word_indices: [2],
      notes_vi: "Động từ → trọng âm âm tiết hai: re-CORD.",
    },
    {
      sentence_en: "Thank you for the present.",
      sentence_vi: "Cảm ơn món quà.",
      target_word_indices: [4],
      notes_vi: "Danh từ → trọng âm âm tiết đầu: PRE-sent.",
    },
    {
      sentence_en: "She will present the project today.",
      sentence_vi: "Cô ấy sẽ trình bày dự án hôm nay.",
      target_word_indices: [2],
      notes_vi: "Động từ → trọng âm âm tiết hai: pre-SENT.",
    },
    {
      sentence_en: "That small object is heavy.",
      sentence_vi: "Vật nhỏ kia rất nặng.",
      target_word_indices: [2],
      notes_vi: "Danh từ → trọng âm âm tiết đầu: OB-ject.",
    },
    {
      sentence_en: "We stayed at a quiet hotel.",
      sentence_vi: "Chúng tôi ở một khách sạn yên tĩnh.",
      target_word_indices: [5],
      notes_vi: "Người Việt hay nhấn HO-tel; tiếng Anh đúng là ho-TEL (trọng âm âm tiết hai).",
    },
    {
      sentence_en: "He drinks coffee every morning.",
      sentence_vi: "Anh ấy uống cà phê mỗi sáng.",
      target_word_indices: [2],
      notes_vi: "Trọng âm âm tiết đầu: COF-fee. Đừng nhấn cof-FEE theo kiểu tiếng Pháp.",
    },
    {
      sentence_en: "She bought a new computer yesterday.",
      sentence_vi: "Cô ấy mua máy tính mới hôm qua.",
      target_word_indices: [4],
      notes_vi: "Trọng âm âm tiết giữa: com-PU-ter. Đừng phát đều COM-PU-TER.",
    },
    {
      sentence_en: "My uncle works at the hospital.",
      sentence_vi: "Chú tôi làm việc ở bệnh viện.",
      target_word_indices: [5],
      notes_vi: "Trọng âm âm tiết đầu: HOS-pi-tal. Tránh hos-PI-tal.",
    },
    {
      sentence_en: "I eat a banana every day.",
      sentence_vi: "Tôi ăn một quả chuối mỗi ngày.",
      target_word_indices: [3],
      notes_vi: "Trọng âm âm tiết giữa: ba-NAN-a. Đừng phát đều ba-na-na.",
    },
  ],
};

// ── Registry ────────────────────────────────────────────────────────────

export const PHONEME_DRILL_PACKS: readonly PhonemeDrillPack[] = [
  TH, DH, V, W, R, AE,
  IH_IY, UH_UW,
  EY, AY, OW,
  CH, JH, SH, ZH, NG,
  L_FINAL, S_FINAL, Z_FINAL,
  P_B_FINAL, T_D_FINAL, K_G_FINAL,
  F, H,
  STRESS_2_3_SYLLABLE,
];

const SLUG_TO_PACK: Record<string, PhonemeDrillPack> = (() => {
  const map: Record<string, PhonemeDrillPack> = {};
  for (const p of PHONEME_DRILL_PACKS) map[p.slug] = p;
  return map;
})();

const CANONICAL_TO_PACK: Record<string, PhonemeDrillPack> = (() => {
  const map: Record<string, PhonemeDrillPack> = {};
  for (const p of PHONEME_DRILL_PACKS) {
    for (const ck of p.canonical_phonemes) {
      // First-write wins when two packs claim the same canonical phoneme;
      // priority follows registry order (single-phoneme packs precede
      // pair packs alphabetically here, which matches our intent).
      if (!map[ck]) map[ck] = p;
    }
  }
  return map;
})();

/** Lookup by URL slug. Returns null when slug is unknown. */
export function getDrillPackBySlug(slug: string): PhonemeDrillPack | null {
  return SLUG_TO_PACK[slug] ?? null;
}

/**
 * Lookup by canonical phoneme key (used by the heatmap CTA — heatmap
 * cells carry single-phoneme keys like "th" or "iy"). Returns the
 * pack covering that phoneme, or null when no pack covers it.
 */
export function getDrillPackForPhoneme(canonicalPhoneme: string): PhonemeDrillPack | null {
  return CANONICAL_TO_PACK[canonicalPhoneme] ?? null;
}

/** All slugs, in registry order (used for tests + admin tooling). */
export function listDrillSlugs(): string[] {
  return PHONEME_DRILL_PACKS.map((p) => p.slug);
}
