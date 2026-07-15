/**
 * VN→EN English-pronunciation minimal-pair drill bank (namespaced extension).
 *
 * This file is a CONTENT-ONLY, append-only extension to the existing
 * `ProblemPair` catalogs in `vn-phoneme-map.ts`. It expands coverage on
 * the Step-7 pain points for Vietnamese learners of English:
 *   th (voiced /ð/ + extra voiceless /θ/), r, l, final consonants, word stress.
 *
 * Design contract:
 *   - Reuses the canonical `ProblemPair` type from `vn-phoneme-map.ts`. We
 *     do NOT redefine or modify it, and we do NOT touch that file.
 *   - These banks are NEW pairs — none duplicate the existing TH_T, R_L,
 *     ED_ENDINGS, S_PLURALS, STRESS, or INTONATION catalogs.
 *   - `audioTarget` / `audioContrast` are always null → the consuming UI
 *     falls back to Web Speech TTS. No pre-recorded assets are referenced.
 *   - `vnWhyConfused` is one natural Vietnamese sentence per pair explaining
 *     why the contrast collapses for VN speakers (learner-facing guidance).
 *   - This bank is NOT wired into the live pronunciation scorer, thresholds,
 *     correction engine, or tone slice. It is a surfacing-ready content
 *     library only. Wiring is a separate, deliberate step.
 *
 * Mirrors the shape of the existing CATEGORY_POOLS via
 * `VN_EN_PRONUNCIATION_DRILL_BANKS` WITHOUT importing or modifying
 * `soundPairDrills.ts`.
 */

import { getAcceptedVariants, type ProblemPair } from './vn-phoneme-map';

/**
 * Voiced /ð/ minimal pairs (this/dis, they/day…) plus a few extra voiceless
 * /θ/ pairs not already covered by PROBLEM_PAIRS_TH_T (mouth/mouse, fourth/fort…).
 * All real English words.
 */
export const TH_VOICED_DRILLS: ProblemPair[] = [
  {
    target: 'this', contrast: 'dis', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "th" có rung trong "this" hay bị đọc thành "d" vì tiếng Việt không có âm này.',
  },
  {
    target: 'they', contrast: 'day', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"they" cần lưỡi giữa răng và có rung giọng; "day" thì lưỡi chạm lợi trên.',
  },
  {
    target: 'then', contrast: 'den', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"then" = sau đó; "den" = hang. Bỏ âm "th" rung sẽ thành "den".',
  },
  {
    target: 'though', contrast: 'dough', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"though" = mặc dù; "dough" = bột nhào. Khác nhau chỉ ở âm đầu "th" rung vs "d".',
  },
  {
    target: 'breathe', contrast: 'breeze', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"breathe" kết thúc bằng "th" rung (lưỡi giữa răng); "breeze" kết thúc bằng "z".',
  },
  {
    target: 'with', contrast: 'wit', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "th" cuối "with" hay bị cắt thành "t" — nghe như "wit".',
  },
  {
    target: 'other', contrast: 'udder', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"other" có "th" rung ở giữa; bỏ đi thành "udder" (bầu vú bò).',
  },
  {
    target: 'mother', contrast: 'mudder', phoneme: 'th-voiced',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "th" rung giữa "mother" dễ bị đọc thành "d" — nghe như "mudder".',
  },
  {
    target: 'mouth', contrast: 'mouse', phoneme: 'th-voiceless',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"mouth" = miệng; "mouse" = chuột. Âm "th" cuối khác âm "s" cuối.',
  },
  {
    target: 'fourth', contrast: 'fort', phoneme: 'th-voiceless',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"fourth" kết thúc bằng hơi "th" qua răng; "fort" kết thúc bằng "t" gọn.',
  },
  {
    target: 'north', contrast: 'nor', phoneme: 'th-voiceless',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"north" cần thả hơi "th" cuối; bỏ âm cuối sẽ thành "nor".',
  },
  {
    target: 'throw', contrast: 'trow', phoneme: 'th-voiceless',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Cụm "thr-" bắt đầu bằng hơi "th" qua răng; bỏ thành âm "t" sẽ nghe như "trow".',
  },
  {
    target: 'math', contrast: 'mat', phoneme: 'th-voiceless',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "th" cuối "math" hay bị cắt thành "t" — nghe như "mat".',
  },
];

/**
 * Initial & medial /r/ contrasts: English /r/ vs the Vietnamese trill/approximant,
 * plus r/w confusions. The English /r/ is curled-back, no trill, no tap.
 */
export const R_DRILLS: ProblemPair[] = [
  {
    target: 'red', contrast: 'wed', phoneme: 'r-vs-w',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"red" = màu đỏ; "wed" = cưới. Âm "r" cong lưỡi, không tròn môi như "w".',
  },
  {
    target: 'ran', contrast: 'wan', phoneme: 'r-vs-w',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "r" đầu "ran" dễ bị tròn môi thành "w" — nghe như "wan".',
  },
  {
    target: 'rake', contrast: 'wake', phoneme: 'r-vs-w',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"rake" = cái cào; "wake" = thức dậy. Cong lưỡi cho "r", đừng tròn môi.',
  },
  {
    target: 'right', contrast: 'write', phoneme: 'r-initial',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Cả hai bắt đầu bằng /r/ tiếng Anh — luyện cong lưỡi không rung, không gõ lưỡi như "r" tiếng Việt.',
  },
  {
    target: 'correct', contrast: 'collect', phoneme: 'r-vs-l',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"correct" = đúng; "collect" = thu thập. Âm /r/ giữa từ dễ lẫn với /l/.',
  },
  {
    target: 'arrive', contrast: 'alive', phoneme: 'r-vs-l',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"arrive" = đến nơi; "alive" = còn sống. Một số vùng trộn /r/ và /l/ ở giữa từ.',
  },
  {
    target: 'berry', contrast: 'belly', phoneme: 'r-vs-l',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"berry" = quả mọng; "belly" = bụng. Âm /r/ giữa từ phải cong lưỡi, không chạm vòm.',
  },
  {
    target: 'pirate', contrast: 'pilot', phoneme: 'r-vs-l',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"pirate" = cướp biển; "pilot" = phi công. Âm /r/ giữa dễ bị nghe thành /l/.',
  },
  {
    target: 'rice', contrast: 'wise', phoneme: 'r-vs-w',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Âm "r" đầu "rice" nếu tròn môi sẽ trượt sang "w" — nghe lệch hẳn nghĩa.',
  },
];

/**
 * Light & dark /l/ clarity: initial /l/ vs /n/ (a real VN confusion) and
 * final / post-vocalic dark-l deletion. SKIPS r-l pairs (those live in R_L).
 * phoneme keys: 'l-clarity' (initial) and 'l-final' (dark-l deletion).
 */
export const L_DRILLS: ProblemPair[] = [
  {
    target: 'light', contrast: 'night', phoneme: 'l-clarity',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"light" = ánh sáng; "night" = ban đêm. Âm "l" đầu hay bị lẫn với "n" ở một số vùng.',
  },
  {
    target: 'low', contrast: 'no', phoneme: 'l-clarity',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"low" = thấp; "no" = không. Đầu lưỡi chạm lợi trên cho "l", đừng đưa hơi qua mũi như "n".',
  },
  {
    target: 'lame', contrast: 'name', phoneme: 'l-clarity',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"lame" = què; "name" = tên. Âm "l" và "n" dễ lẫn vì đều chạm lợi trên.',
  },
  {
    target: 'lap', contrast: 'nap', phoneme: 'l-clarity',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"lap" = đùi/vòng đua; "nap" = giấc ngủ ngắn. "l" thoát hơi hai bên lưỡi; "n" thoát hơi qua mũi.',
  },
  {
    target: 'feel', contrast: 'fee', phoneme: 'l-final',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"feel" = cảm thấy; "fee" = phí. Âm "l" cuối (dark-l) hay bị nuốt mất.',
  },
  {
    target: 'sail', contrast: 'say', phoneme: 'l-final',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"sail" = buồm/giương buồm; "say" = nói. Đừng bỏ âm "l" cuối từ.',
  },
  {
    target: 'tool', contrast: 'too', phoneme: 'l-final',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"tool" = công cụ; "too" = cũng. Tiếng Việt không có "l" cuối nên dễ rớt âm.',
  },
  {
    target: 'call', contrast: 'caw', phoneme: 'l-final',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"call" = gọi; "caw" = tiếng quạ kêu. Giữ đầu lưỡi chạm lợi để giữ "l" cuối.',
  },
];

/**
 * Final-consonant contrasts: voiced/voiceless final-stop pairs and
 * final-consonant deletion — the single biggest VN pain point, because
 * Vietnamese syllable-final stops are UNRELEASED, so voiced/voiceless
 * finals collapse and final consonants often vanish entirely.
 */
export const FINAL_CONSONANT_DRILLS: ProblemPair[] = [
  {
    target: 'bag', contrast: 'back', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'Phụ âm cuối tiếng Việt không thả hơi nên "g" rung (bag) và "k" (back) bị nghe giống nhau.',
  },
  {
    target: 'cab', contrast: 'cap', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"cab" = taxi; "cap" = mũ lưỡi trai. Âm cuối "b" rung và "p" không rung không được thả hơi nên dễ lẫn.',
  },
  {
    target: 'bad', contrast: 'bat', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"bad" = xấu; "bat" = con dơi. Vì phụ âm cuối không thả hơi, "d" rung và "t" thành như nhau.',
  },
  {
    target: 'pig', contrast: 'pick', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"pig" = con lợn; "pick" = chọn. Cần thả nhẹ hơi để phân biệt "g" rung với "k".',
  },
  {
    target: 'robe', contrast: 'rope', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"robe" = áo choàng; "rope" = dây thừng. Âm cuối "b" và "p" lẫn khi không thả hơi.',
  },
  {
    target: 'leave', contrast: 'leaf', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"leave" = rời đi; "leaf" = chiếc lá. Âm cuối "v" rung và "f" không rung dễ trùng nhau.',
  },
  {
    target: 'prize', contrast: 'price', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"prize" = giải thưởng; "price" = giá. Âm cuối "z" rung và "s" không rung hay bị lẫn.',
  },
  {
    target: 'seed', contrast: 'seat', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"seed" = hạt giống; "seat" = chỗ ngồi. Phụ âm cuối không thả hơi làm "d" và "t" giống nhau.',
  },
  {
    target: 'code', contrast: 'coat', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"code" = mã; "coat" = áo khoác. Cần thả hơi nhẹ để phân biệt "d" rung với "t".',
  },
  {
    target: 'league', contrast: 'leak', phoneme: 'final-consonant',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: '"league" = giải đấu; "leak" = rò rỉ. Âm cuối "g" rung dễ bị nghe thành "k" khi không thả hơi.',
  },
];

/**
 * Additional word-stress minimal pairs beyond PROBLEM_PAIRS_STRESS.
 * Noun-vs-verb stress shifts (deCREASE/DEcrease…) — English moves stress to
 * mark word class; Vietnamese (syllable-timed, tonal) has no such rule.
 * Does NOT repeat the existing greenhouse/blackbird/REcord/PREsent/OBject/
 * PROduce/PERmit pairs.
 */
export const STRESS_DRILLS: ProblemPair[] = [
  {
    target: 'a DEcrease', contrast: 'to deCREASE', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'DE-crease (sự giảm — danh từ) nhấn âm tiết đầu; de-CREASE (làm giảm — động từ) nhấn âm tiết sau.',
  },
  {
    target: 'a CONduct', contrast: 'to conDUCT', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'CON-duct (hành vi — danh từ) vs con-DUCT (tiến hành — động từ). Trọng âm quyết định từ loại.',
  },
  {
    target: 'an EXport', contrast: 'to exPORT', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'EX-port (hàng xuất khẩu — danh từ) vs ex-PORT (xuất khẩu — động từ).',
  },
  {
    target: 'the CONtent', contrast: 'to be conTENT', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'CON-tent (nội dung — danh từ) vs con-TENT (hài lòng — tính từ). Cùng chữ, khác trọng âm, khác nghĩa.',
  },
  {
    target: 'a PROtest', contrast: 'to proTEST', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'PRO-test (cuộc biểu tình — danh từ) vs pro-TEST (phản đối — động từ).',
  },
  {
    target: 'an INcrease', contrast: 'to inCREASE', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'IN-crease (sự tăng — danh từ) nhấn âm đầu; in-CREASE (làm tăng — động từ) nhấn âm sau.',
  },
  {
    target: 'an INsult', contrast: 'to inSULT', phoneme: 'word-stress',
    audioTarget: null, audioContrast: null,
    vnWhyConfused: 'IN-sult (lời lăng mạ — danh từ) vs in-SULT (lăng mạ — động từ).',
  },
];

/**
 * Grouped map keyed by category slug — mirrors the CATEGORY_POOLS shape in
 * soundPairDrills.ts for easy surfacing, WITHOUT importing or modifying it.
 * Keys: 'th-voiced', 'r', 'l', 'final-consonant', 'stress'.
 */
export const VN_EN_PRONUNCIATION_DRILL_BANKS: Record<string, ProblemPair[]> = {
  'th-voiced': TH_VOICED_DRILLS,
  r: R_DRILLS,
  l: L_DRILLS,
  'final-consonant': FINAL_CONSONANT_DRILLS,
  stress: STRESS_DRILLS,
};

export type FinalClusterFeedbackKey = 'final_cluster_simplification';

const FINAL_CLUSTER_SUFFIXES = [
  'st', 'sk', 'sp', 'ld', 'nd', 'nt', 'ft', 'lf', 'mp',
  'lp', 'lt', 'ct', 'pt', 'xt', 'nk',
];

function hasFinalClusterShape(word: string): boolean {
  return FINAL_CLUSTER_SUFFIXES.some((suffix) => word.endsWith(suffix));
}

/**
 * Select the stable feedback key for Vietnamese-speaker final-cluster
 * simplification. Conservative by design: only returns a key when the target
 * has a known coda-cluster variant from getAcceptedVariants(), and when a
 * heard word is supplied it must equal one of those variants.
 */
export function selectFinalClusterFeedbackKey(
  targetWord: string,
  heardWord?: string,
): FinalClusterFeedbackKey | null {
  const target = String(targetWord || '').toLowerCase().trim();
  if (!target || !hasFinalClusterShape(target)) return null;

  const variants = getAcceptedVariants(target).filter((entry) => {
    const ruleTarget = entry.rule?.target ?? '';
    const suffix = ruleTarget.endsWith('$') ? ruleTarget.slice(0, -1) : '';
    return FINAL_CLUSTER_SUFFIXES.includes(suffix);
  });
  if (variants.length === 0) return null;

  const heard = String(heardWord || '').toLowerCase().trim();
  if (heard) {
    return variants.some((entry) => entry.variant === heard)
      ? 'final_cluster_simplification'
      : null;
  }

  const hasDrillContext = FINAL_CONSONANT_DRILLS.some((pair) =>
    pair.phoneme === 'final-consonant' && (
      hasFinalClusterShape(pair.target.toLowerCase()) ||
      hasFinalClusterShape(pair.contrast.toLowerCase())
    ),
  );
  return hasDrillContext || variants.length > 0 ? 'final_cluster_simplification' : null;
}
