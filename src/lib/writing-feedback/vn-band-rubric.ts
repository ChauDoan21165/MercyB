// src/lib/writing-feedback/vn-band-rubric.ts
//
// Band-by-band IELTS Writing Task 2 rubric tailored for Vietnamese
// learners. Each band entry says (a) what a Vietnamese learner at this
// level typically does well, (b) what VN-specific errors are still
// blocking the next half-band, (c) concrete next steps, (d) a typical
// timeline for the next half-band.
//
// Bands cover 4.0 → 9.0 in 0.5-band increments — the practical IELTS
// Writing reporting range. (3.5 and below are extremely rare in
// continued-study contexts; 9.0 is included for completeness.)
//
// Sources of pedagogy:
//   - Public IELTS Writing band descriptors (idp.com / ielts.org).
//   - IDP examiner training materials on common Vietnamese learner
//     band-progression patterns.
//   - Cambridge Assessment English research on lexical-resource
//     development in L2 writers.
//
// Original phrasing in this file. Cite this file (not its sources)
// for any quoted text.

export type IeltsBand =
  | 4.0
  | 4.5
  | 5.0
  | 5.5
  | 6.0
  | 6.5
  | 7.0
  | 7.5
  | 8.0
  | 8.5
  | 9.0;

export interface VnBandRubricRow {
  band: IeltsBand;
  /** What a Vietnamese learner at this band typically does well. */
  strengths_vi: string;
  /** Recurring VN-specific errors still present at this band. */
  recurring_errors_vi: string;
  /** Concrete steps to advance to the next half-band. */
  next_half_band_steps_vi: string;
  /** Typical timeline (in weeks of focused study) to advance. */
  next_half_band_weeks: number;
}

export const VN_BAND_RUBRIC: VnBandRubricRow[] = [
  {
    band: 4.0,
    strengths_vi:
      "Bài viết hoàn thành chủ đề ở mức cơ bản. Có ít nhất một câu mở bài và một số câu thân bài liên quan đến đề.",
    recurring_errors_vi:
      "Lỗi mạo từ và số nhiều xuất hiện gần như mọi câu. Câu nối bằng dấu phẩy. Vốn từ đa số là A2. Không có câu phức rõ ràng.",
    next_half_band_steps_vi:
      "Tập trung vào 2 việc: (1) thêm mạo từ a/an/the đúng vị trí, (2) chia số nhiều cho mọi danh từ đếm được. Đọc lại bài và đánh dấu mỗi danh từ — kiểm tra mạo từ + plural -s.",
    next_half_band_weeks: 4,
  },
  {
    band: 4.5,
    strengths_vi:
      "Đoạn mở bài có ý kiến rõ. Có 2–3 câu phức được thử (although, because). Vài kết nối cơ bản giữa các câu.",
    recurring_errors_vi:
      "Mạo từ vẫn rơi rớt. 'More better' / 'more easier' xuất hiện. Câu kết luận mới chỉ lặp lại đề. Văn nói (I think, kids, a lot of) còn nhiều.",
    next_half_band_steps_vi:
      "Bỏ contractions (don't → do not). Thay 'I think' bằng 'It is widely accepted that'. Đọc lại bài tìm comparative — viết đúng dạng -er hoặc 'more + adj dài'.",
    next_half_band_weeks: 4,
  },
  {
    band: 5.0,
    strengths_vi:
      "Cấu trúc 4 đoạn hiện rõ. Mỗi body paragraph có ý chính. Một số phrase B1 (in addition, on the other hand) đã ổn định.",
    recurring_errors_vi:
      "Câu chủ đề đôi khi thiếu. Đoạn body thường dừng ở 1 ví dụ. Hợp số chủ-vị với 'government / family / team' chưa nhất quán. Idiom Việt dịch chữ-cho-chữ thỉnh thoảng xuất hiện.",
    next_half_band_steps_vi:
      "Mỗi body paragraph viết theo công thức TEEI: Topic sentence → Explain → Example → Implication. Câu Implication là câu kéo band lên 5.5+. Tập 5 bài liên tiếp đúng cấu trúc TEEI.",
    next_half_band_weeks: 5,
  },
  {
    band: 5.5,
    strengths_vi:
      "Thesis trong mở bài rõ ràng. Body paragraph trung bình 4–5 câu. Bắt đầu hedging ('many people', 'tend to'). Câu phức với because/although ổn.",
    recurring_errors_vi:
      "Connector trang trọng (Furthermore, Moreover, In addition) lặp lại quá đều. Vague 'It' / 'This' không rõ tham chiếu. Tense vẫn nhảy giữa hiện tại và quá khứ trong cùng đoạn.",
    next_half_band_steps_vi:
      "Cắt connector mở đoạn — thay bằng câu chủ đề kết nối với ý đoạn trước. Mỗi đại từ 'It / This / They' kiểm tra: nó chỉ vào danh từ nào ở câu trước? Nếu mơ hồ, viết lại bằng cụm danh từ.",
    next_half_band_weeks: 6,
  },
  {
    band: 6.0,
    strengths_vi:
      "Bài viết có lập luận hai mặt. Coherence ổn — chuyển ý mượt. Lexical Resource đã có một số collocations ('have a significant impact', 'play a role'). Grammar accuracy ~80%.",
    recurring_errors_vi:
      "Phrasal verbs còn ít — văn nghe textbook. Hedging chưa đủ tinh tế. Thỉnh thoảng câu cụt 'Because + clause' đứng riêng. Sample list không tổng hợp thành argument.",
    next_half_band_steps_vi:
      "Học 20 phrasal verbs IELTS phổ biến (point out, rely on, come up with, deal with, set out). Mỗi đoạn body: thay 1 ví dụ rời thành 1 câu lồng 2–3 ví dụ vào luận chứng. Đọc 5 bài mẫu band 7 mỗi tuần để cảm collocation.",
    next_half_band_weeks: 6,
  },
  {
    band: 6.5,
    strengths_vi:
      "Đa dạng câu phức (relative clauses, conditionals) đã ổn định. Vocabulary có ít nhất 5–7 từ B2+ phù hợp đề. Coherence rõ — paragraph có flow đúng IELTS.",
    recurring_errors_vi:
      "Vài lỗi article và uncountable noun còn rơi rớt (informations, advices). Một số câu quá dài (>30 từ) gây mất focus. Argument đôi khi thiếu nuance — quá dứt khoát.",
    next_half_band_steps_vi:
      "Tập câu hedge nâng cao: 'It could be argued that...', 'While X is generally true, there are cases where...'. Cắt câu dài >25 từ thành 2 câu. Học 10 uncountable nouns hay nhầm và viết câu mẫu mỗi từ.",
    next_half_band_weeks: 6,
  },
  {
    band: 7.0,
    strengths_vi:
      "Bài viết có voice rõ. Lexical Resource tự nhiên với phrasal verbs + collocations chính xác. Grammar lỗi rất ít, phần lớn là typos. Argument có nuance, có concession.",
    recurring_errors_vi:
      "Range câu chưa max — hiếm gặp inversion ('Only by X can we Y'). Một số connector hơi formulaic. Conclusion đôi khi mới chỉ tóm tắt thay vì insight thêm.",
    next_half_band_steps_vi:
      "Học 5 cấu trúc band 8: inversion, cleft sentence, participle clause, complex passive, mixed conditional. Conclusion thử thêm 1 câu insight ('looking ahead, the deeper question is...'). Đọc bài band 8 mẫu để cảm tone.",
    next_half_band_weeks: 8,
  },
  {
    band: 7.5,
    strengths_vi:
      "Câu phức đa dạng đến band 8. Tone academic ổn, không formulaic. Argument có depth — biết thừa nhận đối phương rồi phản biện. Lexical Resource native-like trong nhiều phần.",
    recurring_errors_vi:
      "Một số collocation chưa tự nhiên (e.g., 'do a research' thay vì 'conduct research'). Ngữ điệu Việt còn nhẹ trong cách phân đoạn. Hiếm khi sai grammar nhưng khi sai là do over-engineering câu.",
    next_half_band_steps_vi:
      "Cải thiện collocation chính xác: dùng từ điển collocation (Oxford Collocations) thay vì dịch trực tiếp. Đoạn body chia tỉ lệ 30% thesis support / 50% evidence + analysis / 20% counter-argument. Viết 2 bài/tuần và nhờ examiner chấm.",
    next_half_band_weeks: 10,
  },
  {
    band: 8.0,
    strengths_vi:
      "Văn xuôi gần như native. Argument tinh tế, có sắc thái. Lexical Resource phong phú và chính xác. Grammar có cấu trúc band 9 thỉnh thoảng.",
    recurring_errors_vi:
      "Lỗi cực hiếm — chủ yếu là lựa chọn từ giữa 2 từ gần nghĩa hoặc collocation hơi formal hơn cần thiết. Một vài câu register quá cao cho prompt.",
    next_half_band_steps_vi:
      "Đọc và bắt chước văn academic native (op-eds The Economist, FT Comment). Nhờ native-speaker English teacher chấm 5 bài và ghi lại từng từ họ thay đổi. Nắm subtle distinction giữa near-synonyms (effective vs efficient, principle vs principal).",
    next_half_band_weeks: 12,
  },
  {
    band: 8.5,
    strengths_vi:
      "Văn xuôi tinh tế gần như không phân biệt với native ESL teacher. Argument structure cao. Lexical Resource điều chỉnh chính xác theo register.",
    recurring_errors_vi:
      "Hầu như không có lỗi — IELTS ở mức này dùng tiêu chí đánh giá artistry, không phải accuracy. Đôi khi câu hay nhưng quá dài cho format Task 2.",
    next_half_band_steps_vi:
      "Tập viết bài 280 từ đúng band 9 — không phải 350. Chính xác ngắn gọn quan trọng hơn dài. Đọc 'On Writing Well' (Zinsser) để cảm voice gọn. Nhờ examiner band 9 chấm để biết khoảng cách thực sự.",
    next_half_band_weeks: 16,
  },
  {
    band: 9.0,
    strengths_vi:
      "Native-tier writing. Argument fully developed, lexical resource flexible and precise, grammar nearly error-free with a wide range. Người học Việt đạt band 9 thường có thời gian dài sống/học ở môi trường tiếng Anh.",
    recurring_errors_vi:
      "Không còn lỗi đáng kể. Sự khác biệt giữa 8.5 và 9.0 là consistency và depth of argument, không còn là accuracy.",
    next_half_band_steps_vi:
      "Duy trì bằng cách đọc + viết tiếng Anh academic mỗi ngày. Không có 'next half-band' — hướng đến chuyên nghiệp hóa (publish trong tạp chí, giảng dạy IELTS).",
    next_half_band_weeks: 0,
  },
];

/** Look up the rubric row for a given band. */
export function rubricForBand(band: IeltsBand): VnBandRubricRow | undefined {
  return VN_BAND_RUBRIC.find((r) => r.band === band);
}

/**
 * Snap any numeric band estimate to the nearest 0.5 within [4.0, 9.0].
 * Out-of-range inputs are clamped.
 */
export function snapToHalfBand(value: number): IeltsBand {
  if (!Number.isFinite(value)) return 4.0;
  const rounded = Math.round(value * 2) / 2;
  if (rounded <= 4.0) return 4.0;
  if (rounded >= 9.0) return 9.0;
  return rounded as IeltsBand;
}
