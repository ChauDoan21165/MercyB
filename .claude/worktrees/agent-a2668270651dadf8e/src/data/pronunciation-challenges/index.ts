/**
 * Hand-curated daily pronunciation challenges. Canonical TypeScript
 * copy of the rows seeded by
 * `supabase/migrations/20260607000000_pronunciation_challenges.sql`.
 *
 * 60 entries split:
 *   - 20 classic tongue twisters
 *   - 20 minimal pair drills
 *   - 20 phoneme-targeted sentences (focused on common VN problem
 *     phonemes: /θ/, /r/, /v/-/w/, final-/s/-/z/)
 *
 * The TypeScript copy is the source of truth for tests and offline
 * development; the migration is the source of truth for production.
 * If you change a row, update both. The test
 * `content.test.ts` enforces the count + schema invariants.
 *
 * IMPORTANT: hand-written. Tongue twisters are public-domain
 * traditional rhymes. Minimal pairs and phoneme-targeted sentences
 * are original — written for Vietnamese learners with explicit
 * articulation cues in `content_vi_explanation`.
 */

export type ChallengeType =
  | "tongue_twister"
  | "minimal_pair"
  | "phoneme_targeted";

export type ChallengeDifficulty = "easy" | "medium" | "hard";

export interface DailyChallenge {
  /** Stable id used as the FK in user_challenge_completion. */
  id: string;
  type: ChallengeType;
  /** The English sentence the learner reads aloud. */
  content_en: string;
  /**
   * Vietnamese explanation of which phoneme to focus on and how to
   * articulate. Always present — this is the teaching scaffold.
   */
  content_vi_explanation: string;
  /**
   * Canonical phoneme keys this challenge targets. Lowercase ARPAbet-ish
   * keys (matching the heatmap aggregator):
   *   th, dh, r, l, v, w, s, z, sh, ch, jh, ng, p, b, t, d, k, g, f,
   *   y, h, n, m, ih, iy, eh, ae, ah, ao, uh, uw, ow, er
   */
  target_phonemes: string[];
  difficulty: ChallengeDifficulty;
}

const TONGUE_TWISTERS: DailyChallenge[] = [
  {
    id: "tt_seashells",
    type: "tongue_twister",
    content_en: "She sells seashells by the seashore.",
    content_vi_explanation:
      "Tập trung vào âm /s/ và /ʃ/ — tiếng Việt không phân biệt rõ. Đặt lưỡi gần răng cho /s/, đẩy hơi ra cho /ʃ/.",
    target_phonemes: ["s", "sh"],
    difficulty: "medium",
  },
  {
    id: "tt_peter_piper",
    type: "tongue_twister",
    content_en: "Peter Piper picked a peck of pickled peppers.",
    content_vi_explanation:
      "Luyện /p/ bật hơi rõ ở đầu từ. Người Việt thường thiếu hơi — đặt tay trước miệng để cảm.",
    target_phonemes: ["p"],
    difficulty: "medium",
  },
  {
    id: "tt_woodchuck",
    type: "tongue_twister",
    content_en:
      "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    content_vi_explanation:
      "Tập /w/ — môi tròn rõ, không nhầm với /v/ (răng cắn môi).",
    target_phonemes: ["w"],
    difficulty: "hard",
  },
  {
    id: "tt_red_lorry",
    type: "tongue_twister",
    content_en: "Red lorry, yellow lorry.",
    content_vi_explanation:
      "Bài kinh điển cho /r/ và /l/. Lưỡi không chạm cho /r/, lưỡi chạm răng trên cho /l/.",
    target_phonemes: ["r", "l"],
    difficulty: "easy",
  },
  {
    id: "tt_betty_butter",
    type: "tongue_twister",
    content_en: "Betty bought a bit of butter, but the butter was bitter.",
    content_vi_explanation:
      "Phân biệt /b/ và /t/ giữa từ — đừng nuốt /t/ ở cuối từ.",
    target_phonemes: ["b", "t"],
    difficulty: "medium",
  },
  {
    id: "tt_unique_new_york",
    type: "tongue_twister",
    content_en:
      "You know New York, you need New York, you know you need unique New York.",
    content_vi_explanation:
      "/n/ và /j/ liên tục — giữ lưỡi linh hoạt, không trộn âm.",
    target_phonemes: ["n", "y"],
    difficulty: "hard",
  },
  {
    id: "tt_irish_wristwatch",
    type: "tongue_twister",
    content_en: "Irish wristwatch, Swiss wristwatch.",
    content_vi_explanation:
      "Cụm phụ âm /st/-/w/ — đừng thêm nguyên âm vào giữa.",
    target_phonemes: ["s", "w", "r"],
    difficulty: "hard",
  },
  {
    id: "tt_six_sticks",
    type: "tongue_twister",
    content_en: "Six slick slim sycamore saplings.",
    content_vi_explanation:
      "Cụm /sl/ ở đầu nhiều từ — luyện kéo dài /s/ trước /l/.",
    target_phonemes: ["s", "l"],
    difficulty: "hard",
  },
  {
    id: "tt_fresh_fish",
    type: "tongue_twister",
    content_en: "Fresh fried fish, fish fresh fried, fried fish fresh.",
    content_vi_explanation:
      "Phân biệt /f/ (răng cắn môi) và /ʃ/ (môi tròn).",
    target_phonemes: ["f", "sh"],
    difficulty: "medium",
  },
  {
    id: "tt_toy_boat",
    type: "tongue_twister",
    content_en: "Toy boat, toy boat, toy boat.",
    content_vi_explanation:
      "Lặp lại nhanh — đừng để /t/ thành /d/ và /b/ thành /p/.",
    target_phonemes: ["t", "b"],
    difficulty: "easy",
  },
  {
    id: "tt_rubber_buggy",
    type: "tongue_twister",
    content_en: "Rubber baby buggy bumpers.",
    content_vi_explanation: "/b/ liên tục — môi đóng kín rồi bật ra.",
    target_phonemes: ["b", "r"],
    difficulty: "medium",
  },
  {
    id: "tt_silly_sally",
    type: "tongue_twister",
    content_en: "Silly Sally swiftly shooed seven silly sheep.",
    content_vi_explanation: "/s/ và /ʃ/ xen kẽ — chú ý không trộn lẫn.",
    target_phonemes: ["s", "sh"],
    difficulty: "medium",
  },
  {
    id: "tt_thirty_three",
    type: "tongue_twister",
    content_en:
      "Thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    content_vi_explanation:
      "Bài cực khó cho /θ/ — lưỡi giữa hai răng, đẩy hơi.",
    target_phonemes: ["th"],
    difficulty: "hard",
  },
  {
    id: "tt_baker_bread",
    type: "tongue_twister",
    content_en: "Black bread, brown bread, blue bread.",
    content_vi_explanation:
      "Cụm /br/ và /bl/ — phân biệt /r/ (lưỡi không chạm) và /l/ (lưỡi chạm).",
    target_phonemes: ["b", "r", "l"],
    difficulty: "medium",
  },
  {
    id: "tt_can_can_canner",
    type: "tongue_twister",
    content_en:
      "A canner can can anything that he can can, but a canner cannot can a can.",
    content_vi_explanation: "Lặp /k/ liên tục — gốc lưỡi chạm vòm họng.",
    target_phonemes: ["k", "n"],
    difficulty: "medium",
  },
  {
    id: "tt_eleven_benevolent",
    type: "tongue_twister",
    content_en: "Eleven benevolent elephants.",
    content_vi_explanation:
      "/v/ răng cắn môi — không thay bằng /w/ (môi tròn).",
    target_phonemes: ["v", "l"],
    difficulty: "medium",
  },
  {
    id: "tt_seventy_seven",
    type: "tongue_twister",
    content_en: "Seventy-seven benevolent elephants.",
    content_vi_explanation: "Số đếm và /v/ — luyện đọc nhanh số dài.",
    target_phonemes: ["v", "s"],
    difficulty: "hard",
  },
  {
    id: "tt_truly_rural",
    type: "tongue_twister",
    content_en: "Truly rural, truly rural, truly rural.",
    content_vi_explanation:
      "/r/ và /l/ liên tiếp — bài tốt nhất để cảm khác biệt.",
    target_phonemes: ["r", "l"],
    difficulty: "hard",
  },
  {
    id: "tt_fuzzy_wuzzy",
    type: "tongue_twister",
    content_en: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
    content_vi_explanation:
      "/f/, /w/, /h/ xen kẽ — chú ý /w/ môi tròn không nhầm /v/.",
    target_phonemes: ["f", "w", "h"],
    difficulty: "easy",
  },
  {
    id: "tt_chip_shop",
    type: "tongue_twister",
    content_en: "Six thick thistle sticks. Six thick thistles stick.",
    content_vi_explanation: "/θ/ ở giữa cụm phụ âm — bài khó top 3.",
    target_phonemes: ["th", "s", "k"],
    difficulty: "hard",
  },
];

const MINIMAL_PAIRS: DailyChallenge[] = [
  {
    id: "mp_ship_sheep",
    type: "minimal_pair",
    content_en: "I see a ship and a sheep on the ship.",
    content_vi_explanation:
      "/ɪ/ ngắn (ship) vs /iː/ dài (sheep). Người Việt thường nói /iː/ cho cả hai — kéo dài cho sheep.",
    target_phonemes: ["ih", "iy"],
    difficulty: "medium",
  },
  {
    id: "mp_pen_pan",
    type: "minimal_pair",
    content_en: "The pen is in the pan, but the pan is not a pen.",
    content_vi_explanation:
      "/ɛ/ (pen) vs /æ/ (pan). Mở miệng rộng hơn cho /æ/.",
    target_phonemes: ["eh", "ae"],
    difficulty: "medium",
  },
  {
    id: "mp_light_right",
    type: "minimal_pair",
    content_en: "Turn the light to the right, then go right past the light.",
    content_vi_explanation: "/l/ lưỡi chạm vs /r/ lưỡi cong không chạm.",
    target_phonemes: ["l", "r"],
    difficulty: "medium",
  },
  {
    id: "mp_thin_sin",
    type: "minimal_pair",
    content_en: "It is a thin sin to think you can sin without thinking.",
    content_vi_explanation:
      "/θ/ (thin) — lưỡi giữa răng. /s/ (sin) — lưỡi sau răng.",
    target_phonemes: ["th", "s"],
    difficulty: "hard",
  },
  {
    id: "mp_very_berry",
    type: "minimal_pair",
    content_en: "A very berry is very, very rare.",
    content_vi_explanation:
      "/v/ (răng cắn môi) vs /b/ (hai môi đóng).",
    target_phonemes: ["v", "b"],
    difficulty: "easy",
  },
  {
    id: "mp_west_vest",
    type: "minimal_pair",
    content_en: "I wear my vest going west.",
    content_vi_explanation:
      "/w/ (môi tròn) vs /v/ (răng cắn môi). Người Việt rất hay trộn.",
    target_phonemes: ["w", "v"],
    difficulty: "hard",
  },
  {
    id: "mp_full_fool",
    type: "minimal_pair",
    content_en: "A full fool is full of foolish thoughts.",
    content_vi_explanation:
      "/ʊ/ ngắn (full) vs /uː/ dài (fool). Kéo dài rõ cho fool.",
    target_phonemes: ["uh", "uw"],
    difficulty: "medium",
  },
  {
    id: "mp_cat_cut",
    type: "minimal_pair",
    content_en: "The cat cut the cake on the mat.",
    content_vi_explanation:
      "/æ/ (cat — mở miệng) vs /ʌ/ (cut — miệng nhỏ thoải mái).",
    target_phonemes: ["ae", "ah"],
    difficulty: "medium",
  },
  {
    id: "mp_walk_work",
    type: "minimal_pair",
    content_en: "I walk to work and I work after I walk.",
    content_vi_explanation:
      "/ɔː/ (walk) vs /ɝ/ (work). /ɝ/ có /r/ ẩn, môi tròn.",
    target_phonemes: ["ao", "er"],
    difficulty: "hard",
  },
  {
    id: "mp_bat_bet",
    type: "minimal_pair",
    content_en: "The bat is on the bed, and the bed is for the bat.",
    content_vi_explanation:
      "/æ/ (bat) vs /ɛ/ (bet). Kéo miệng rộng cho /æ/.",
    target_phonemes: ["ae", "eh"],
    difficulty: "easy",
  },
  {
    id: "mp_glass_grass",
    type: "minimal_pair",
    content_en:
      "Pour the glass on the grass, but watch the glass and the grass.",
    content_vi_explanation:
      "/l/ (glass) vs /r/ (grass). Trong cụm phụ âm /gl/-/gr/.",
    target_phonemes: ["l", "r"],
    difficulty: "medium",
  },
  {
    id: "mp_bowl_bull",
    type: "minimal_pair",
    content_en: "Put the bowl by the bull, then pull the bull from the bowl.",
    content_vi_explanation:
      "/oʊ/ (bowl — kéo dài có đuôi w) vs /ʊ/ (bull — ngắn).",
    target_phonemes: ["ow", "uh"],
    difficulty: "hard",
  },
  {
    id: "mp_pat_bat",
    type: "minimal_pair",
    content_en: "Pat the bat, do not bat at Pat.",
    content_vi_explanation: "/p/ bật hơi mạnh vs /b/ rung dây thanh.",
    target_phonemes: ["p", "b"],
    difficulty: "easy",
  },
  {
    id: "mp_cap_cab",
    type: "minimal_pair",
    content_en: "Put the cap in the cab, and pay the cab for the cap.",
    content_vi_explanation:
      "/p/ và /b/ ở cuối từ — đừng nuốt phụ âm cuối.",
    target_phonemes: ["p", "b"],
    difficulty: "medium",
  },
  {
    id: "mp_fan_van",
    type: "minimal_pair",
    content_en: "The fan in the van blows like a van fan.",
    content_vi_explanation:
      "/f/ (răng cắn môi vô thanh) vs /v/ (răng cắn môi hữu thanh).",
    target_phonemes: ["f", "v"],
    difficulty: "easy",
  },
  {
    id: "mp_chair_share",
    type: "minimal_pair",
    content_en: "Share the chair, please share the chair fairly.",
    content_vi_explanation:
      "/tʃ/ (chair — bật + xát) vs /ʃ/ (share — chỉ xát).",
    target_phonemes: ["ch", "sh"],
    difficulty: "medium",
  },
  {
    id: "mp_jeep_zip",
    type: "minimal_pair",
    content_en: "The jeep can zip, but the zip is not the jeep.",
    content_vi_explanation:
      "/dʒ/ (jeep) vs /z/ (zip). Người Việt thường thay /z/ bằng /s/.",
    target_phonemes: ["jh", "z"],
    difficulty: "medium",
  },
  {
    id: "mp_thigh_die",
    type: "minimal_pair",
    content_en: "My thigh is sore — I think I will die laughing.",
    content_vi_explanation:
      "/θ/ (thigh — lưỡi giữa răng) vs /d/ (die — lưỡi chạm vòm).",
    target_phonemes: ["th", "d"],
    difficulty: "hard",
  },
  {
    id: "mp_sit_seat",
    type: "minimal_pair",
    content_en: "Take a seat and sit; do not sit on the seat sideways.",
    content_vi_explanation: "/ɪ/ (sit) vs /iː/ (seat). Kéo dài rõ cho seat.",
    target_phonemes: ["ih", "iy"],
    difficulty: "easy",
  },
  {
    id: "mp_bag_back",
    type: "minimal_pair",
    content_en: "Bring the bag back, and put the back in the bag.",
    content_vi_explanation:
      "/g/ (bag — hữu thanh) vs /k/ (back — vô thanh) ở cuối từ.",
    target_phonemes: ["g", "k"],
    difficulty: "medium",
  },
];

const PHONEME_TARGETED: DailyChallenge[] = [
  {
    id: "pt_th_thursday",
    type: "phoneme_targeted",
    content_en: "I think Thursday is the third day this month.",
    content_vi_explanation:
      "Bốn /θ/ trong câu — lưỡi giữa hai răng, đẩy hơi ra. Tiếng Việt không có âm này.",
    target_phonemes: ["th"],
    difficulty: "medium",
  },
  {
    id: "pt_th_brother",
    type: "phoneme_targeted",
    content_en: "My brother and mother bother me on Sundays.",
    content_vi_explanation:
      "/ð/ hữu thanh — như /θ/ nhưng có rung dây thanh. Đặt tay vào cổ để cảm.",
    target_phonemes: ["dh"],
    difficulty: "medium",
  },
  {
    id: "pt_th_thirsty",
    type: "phoneme_targeted",
    content_en: "I am thirsty after thirty-three thrilling thoughts.",
    content_vi_explanation:
      "/θ/ ở đầu từ liên tục — bài khó nhất cho người Việt.",
    target_phonemes: ["th"],
    difficulty: "hard",
  },
  {
    id: "pt_r_around",
    type: "phoneme_targeted",
    content_en: "The river runs around the rocks and through the trees.",
    content_vi_explanation:
      "/r/ Mỹ — lưỡi cong vào trong nhưng không chạm vòm. Tiếng Việt /r/ rung — sai cách.",
    target_phonemes: ["r"],
    difficulty: "medium",
  },
  {
    id: "pt_r_corner",
    type: "phoneme_targeted",
    content_en: "There is a car at the corner of Park Road.",
    content_vi_explanation:
      "/r/ giữa và cuối từ — môi tròn nhẹ, lưỡi co lại.",
    target_phonemes: ["r"],
    difficulty: "hard",
  },
  {
    id: "pt_r_difficult",
    type: "phoneme_targeted",
    content_en: "It is difficult to remember every Friday morning routine.",
    content_vi_explanation:
      "/r/ trong cụm phụ âm — đừng bỏ qua, đừng thêm nguyên âm.",
    target_phonemes: ["r"],
    difficulty: "medium",
  },
  {
    id: "pt_v_w_visiting",
    type: "phoneme_targeted",
    content_en: "We are visiting Victor in Wisconsin in November.",
    content_vi_explanation:
      "/v/ và /w/ xen kẽ. /v/ răng cắn môi; /w/ môi tròn không chạm răng.",
    target_phonemes: ["v", "w"],
    difficulty: "hard",
  },
  {
    id: "pt_v_very",
    type: "phoneme_targeted",
    content_en: "I have a very heavy violet vase from Victoria.",
    content_vi_explanation:
      "/v/ liên tục — răng trên cắn nhẹ môi dưới, dây thanh rung.",
    target_phonemes: ["v"],
    difficulty: "medium",
  },
  {
    id: "pt_w_water",
    type: "phoneme_targeted",
    content_en: "I want one warm cup of water from the well.",
    content_vi_explanation: "/w/ liên tục — môi tròn, không cắn môi.",
    target_phonemes: ["w"],
    difficulty: "easy",
  },
  {
    id: "pt_finals_friends",
    type: "phoneme_targeted",
    content_en: "My friends sometimes make plans for weekends.",
    content_vi_explanation:
      "/-s/ và /-z/ cuối từ — đừng nuốt. Người Việt rất hay bỏ phụ âm cuối.",
    target_phonemes: ["s", "z"],
    difficulty: "medium",
  },
  {
    id: "pt_finals_apples",
    type: "phoneme_targeted",
    content_en: "The students like apples, oranges, and grapes.",
    content_vi_explanation:
      "Phụ âm cuối /-s/, /-z/, /-əz/ — kéo nhẹ ở cuối từ.",
    target_phonemes: ["s", "z"],
    difficulty: "medium",
  },
  {
    id: "pt_finals_cats",
    type: "phoneme_targeted",
    content_en: "The cats sit on the mats and watch the bats.",
    content_vi_explanation:
      "/-ts/ cụm cuối từ — bật /t/ rồi xát /s/ liền.",
    target_phonemes: ["t", "s"],
    difficulty: "medium",
  },
  {
    id: "pt_finals_dogs",
    type: "phoneme_targeted",
    content_en: "The dogs barked and the birds flew away.",
    content_vi_explanation:
      "/-d/ và /-z/ cuối từ ở past tense — đừng làm rơi.",
    target_phonemes: ["d", "z"],
    difficulty: "medium",
  },
  {
    id: "pt_finals_rocks",
    type: "phoneme_targeted",
    content_en: "I picked six big rocks from the beach last weekend.",
    content_vi_explanation:
      "/-ks/ và /-st/ cuối từ — luyện cụm phụ âm cuối.",
    target_phonemes: ["k", "s", "t"],
    difficulty: "hard",
  },
  {
    id: "pt_th_initial",
    type: "phoneme_targeted",
    content_en: "Thank you for thinking of me through these tough times.",
    content_vi_explanation:
      "/θ/ và /ð/ ở đầu từ — phân biệt vô thanh và hữu thanh.",
    target_phonemes: ["th", "dh"],
    difficulty: "hard",
  },
  {
    id: "pt_r_dark",
    type: "phoneme_targeted",
    content_en: "The dark park near the harbor is far from the airport.",
    content_vi_explanation:
      "/r/ tối, /r/ sau nguyên âm — vẫn cong lưỡi nhưng nhẹ.",
    target_phonemes: ["r"],
    difficulty: "hard",
  },
  {
    id: "pt_l_yellow",
    type: "phoneme_targeted",
    content_en: "A yellow ball fell on the floor of the small hall.",
    content_vi_explanation:
      "/l/ ở đầu vs cuối từ — cuối từ /l/ nghe tối hơn.",
    target_phonemes: ["l"],
    difficulty: "medium",
  },
  {
    id: "pt_z_zoo",
    type: "phoneme_targeted",
    content_en: "The zoo has zebras, lizards, and lazy lions.",
    content_vi_explanation:
      "/z/ — như /s/ nhưng dây thanh rung. Người Việt thường thay bằng /s/.",
    target_phonemes: ["z"],
    difficulty: "medium",
  },
  {
    id: "pt_sh_shopping",
    type: "phoneme_targeted",
    content_en: "She is shopping for shoes at the special shop.",
    content_vi_explanation:
      "/ʃ/ — môi tròn, lưỡi gần vòm nhưng không chạm.",
    target_phonemes: ["sh"],
    difficulty: "easy",
  },
  {
    id: "pt_ng_singing",
    type: "phoneme_targeted",
    content_en: "They are singing and dancing in the morning sun.",
    content_vi_explanation:
      "/ŋ/ — gốc lưỡi lên vòm mềm, không phát /n/+/g/ riêng.",
    target_phonemes: ["ng"],
    difficulty: "medium",
  },
];

export const DAILY_CHALLENGES: ReadonlyArray<DailyChallenge> = [
  ...TONGUE_TWISTERS,
  ...MINIMAL_PAIRS,
  ...PHONEME_TARGETED,
];

export function getChallengeById(id: string): DailyChallenge | undefined {
  return DAILY_CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByType(
  type: ChallengeType,
): DailyChallenge[] {
  return DAILY_CHALLENGES.filter((c) => c.type === type);
}

export function getChallengesByPhoneme(phoneme: string): DailyChallenge[] {
  const target = phoneme.toLowerCase();
  return DAILY_CHALLENGES.filter((c) =>
    c.target_phonemes.map((p) => p.toLowerCase()).includes(target),
  );
}
