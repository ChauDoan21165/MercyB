// src/languages/thai/scriptVisualNotes.ts
//
// Thai script VISUAL notes — for learners who confuse written Thai.
//
// Self-contained PURE DATA: declares its own types inline and exports the
// note array. Where the script reading starter (WAVE5) teaches how to READ
// letters, this set targets the VISUAL traps: letter pairs that look almost
// identical, where a vowel actually sits vs. where it's read, how spacing
// works, short signs that get misread, and tone-mark look-alikes.
//
// Each note contrasts items so the learner can see the distinguishing detail
// (a loop, a tail, a notch). Romanization is a reading aid, NOT a
// pronunciation claim. No audio, no scoring. Native-speaker review is
// DEFERRED — this set does NOT claim native review.

export type ThaiVisualCategory =
  | "similar_letters"
  | "vowel_placement"
  | "spacing"
  | "sign"
  | "tone_mark";

export type ThaiVisualNote = {
  id: string;
  category: ThaiVisualCategory;
  /** The Thai item(s) the note is about (often a contrasting pair/triple). */
  script: string;
  /** Romanization where it helps; "—" when not applicable. */
  rtgs: string;
  /** Vietnamese explanation of the visual distinction / rule. */
  explanation_vi: string;
  /** English explanation. */
  explanation_en: string;
  /** Optional compact "how to tell them apart" tip, bilingual. */
  tip_vi?: string;
  tip_en?: string;
};

export const scriptVisualNotes: ThaiVisualNote[] = [
  // ───────────────── similar_letters ─────────────────
  { id: "vn_sim_001", category: "similar_letters", script: "ก vs ภ", rtgs: "g vs ph", explanation_vi: "ก (g) và ภ (ph) đều có thân tròn; ภ có thêm một nét/râu bên trái phía trên.", explanation_en: "ก (g) and ภ (ph) share a round body; ภ has an extra upward stroke on the left.", tip_vi: "ภ 'cao' hơn, có móc trái; ก trơn.", tip_en: "ภ is 'taller' with a left hook; ก is plain." },
  { id: "vn_sim_002", category: "similar_letters", script: "ด vs ต", rtgs: "d vs t", explanation_vi: "ด (d) và ต (t) gần giống; ต có một 'răng nhọn' nhô lên ở đỉnh, ด thì đỉnh trơn.", explanation_en: "ด (d) and ต (t) look alike; ต has a small pointed notch at the top, ด is smooth.", tip_vi: "Thấy răng nhọn ở đầu → ต.", tip_en: "Pointed top notch → ต." },
  { id: "vn_sim_003", category: "similar_letters", script: "ค vs ด", rtgs: "kh vs d", explanation_vi: "ค (kh) mở vòng sang phải; ด (d) khép vòng tròn nhỏ bên trái. Hướng vòng khác nhau.", explanation_en: "ค (kh) opens to the right; ด (d) has a small closed loop on the left.", tip_vi: "Vòng kín bên trái → ด.", tip_en: "Closed left loop → ด." },
  { id: "vn_sim_004", category: "similar_letters", script: "ค vs ด vs ต", rtgs: "kh / d / t", explanation_vi: "Bộ ba dễ lẫn: ค (kh) thân rộng mở phải; ด (d) vòng trái trơn; ต (d→) như ด nhưng có răng đỉnh.", explanation_en: "A tricky trio: ค (kh) wide & open; ด (d) left loop, smooth; ต like ด but with a top notch.", tip_vi: "So đỉnh: trơn=ด, có răng=ต, mở phải=ค.", tip_en: "Check the top: smooth=ด, notched=ต, open-right=ค." },
  { id: "vn_sim_005", category: "similar_letters", script: "พ vs ผ vs ฟ", rtgs: "ph / ph / f", explanation_vi: "พ (ph thấp) đỉnh trơn; ผ (ph cao) cũng trơn nhưng thân khác; ฟ (f) giống พ nhưng có 'cây gậy' vươn cao.", explanation_en: "พ (low ph) smooth top; ผ (high ph) similar; ฟ (f) like พ but with a tall ascender.", tip_vi: "Có nét vươn cao → ฟ (f).", tip_en: "Tall ascender → ฟ (f)." },
  { id: "vn_sim_006", category: "similar_letters", script: "ผ vs ฝ", rtgs: "ph vs f", explanation_vi: "ผ (ph) và ฝ (f) chỉ khác: ฝ có thêm nét vươn lên trên. Cùng dáng thân.", explanation_en: "ผ (ph) and ฝ (f) differ only by ฝ's extra upward stroke. Same body.", tip_vi: "Thêm 'gậy' = ฝ (f).", tip_en: "Extra ascender = ฝ (f)." },
  { id: "vn_sim_007", category: "similar_letters", script: "บ vs ป", rtgs: "b vs p", explanation_vi: "บ (b) đỉnh trơn; ป (p) có nét vươn cao bên phải. Cùng vòng đáy.", explanation_en: "บ (b) smooth top; ป (p) has a tall stroke on the right. Same base loop.", tip_vi: "Có 'gậy' cao → ป.", tip_en: "Tall flag → ป." },
  { id: "vn_sim_008", category: "similar_letters", script: "ป vs ษ", rtgs: "p vs s", explanation_vi: "ป (p) và ษ (s, dùng trong từ gốc Phạn) khá giống; ษ có nét gấp khúc phức tạp hơn ở thân.", explanation_en: "ป (p) and ษ (s, Sanskrit-derived) resemble; ษ has a more complex kinked body.", tip_vi: "Thân gấp khúc rườm rà → ษ.", tip_en: "Busier kinked body → ษ." },
  { id: "vn_sim_009", category: "similar_letters", script: "ม vs น", rtgs: "m vs n", explanation_vi: "ม (m) có vòng tròn kín bên trái; น (n) mở, không khép vòng đầy đủ.", explanation_en: "ม (m) has a closed left loop; น (n) is open, no full loop.", tip_vi: "Vòng kín trái → ม.", tip_en: "Closed left loop → ม." },
  { id: "vn_sim_010", category: "similar_letters", script: "น vs ห", rtgs: "n vs h", explanation_vi: "น (n) một thân; ห (h) có hai 'chân' rõ và cao hơn. ห hay làm phụ âm dẫn câm.", explanation_en: "น (n) is single-bodied; ห (h) has two clear legs, taller. ห often a silent leader.", tip_vi: "Hai chân cao → ห.", tip_en: "Two tall legs → ห." },
  { id: "vn_sim_011", category: "similar_letters", script: "ห vs N-shapes", rtgs: "h", explanation_vi: "ห (h) khác ก/ถ ở chỗ có hai nét dọc nối bằng vòng trên. So sánh chiều cao.", explanation_en: "ห (h) differs from ก/ถ by two verticals joined by a top loop. Compare heights.", tip_vi: "ห cao và 'mở' hai chân.", tip_en: "ห is tall with two open legs." },
  { id: "vn_sim_012", category: "similar_letters", script: "ถ vs ภ", rtgs: "th vs ph", explanation_vi: "ถ (th) và ภ (ph) đều cao; ถ vòng đầu mở, ภ có móc trái đặc trưng.", explanation_en: "ถ (th) and ภ (ph) are both tall; ถ has an open top, ภ a distinct left hook.", tip_vi: "Móc trái rõ → ภ.", tip_en: "Clear left hook → ภ." },
  { id: "vn_sim_013", category: "similar_letters", script: "ฎ vs ฏ", rtgs: "d vs t", explanation_vi: "ฎ (d) và ฏ (t) (dùng trong từ trang trọng) chỉ khác đỉnh: ฏ có răng nhọn như ต.", explanation_en: "ฎ (d) and ฏ (t) (formal words) differ at the top: ฏ has a ต-like notch.", tip_vi: "Răng đỉnh → ฏ (t).", tip_en: "Top notch → ฏ (t)." },
  { id: "vn_sim_014", category: "similar_letters", script: "ช vs ซ", rtgs: "ch vs s", explanation_vi: "ช (ch) và ซ (s) giống hệt phần thân; ซ có 'đuôi/râu' cong thêm phía trên phải.", explanation_en: "ช (ch) and ซ (s) share the body; ซ adds a curl on the upper right.", tip_vi: "Có râu cong trên phải → ซ.", tip_en: "Upper-right curl → ซ." },
  { id: "vn_sim_015", category: "similar_letters", script: "ฃ/ฅ (cổ)", rtgs: "kh (obsolete)", explanation_vi: "ฃ và ฅ là chữ CỔ, gần như không dùng. Đừng nhầm với ข/ค hiện đại.", explanation_en: "ฃ and ฅ are OBSOLETE letters, virtually unused. Don't confuse with modern ข/ค.", tip_vi: "Hiếm thấy ngoài đời → bỏ qua, dùng ข/ค.", tip_en: "Rarely seen → ignore, use ข/ค." },
  { id: "vn_sim_016", category: "similar_letters", script: "เ vs แ", rtgs: "ee vs ɛɛ", explanation_vi: "เ (một nét) và แ (HAI nét เ ghép) là nguyên âm đứng trước. Đếm số nét đứng.", explanation_en: "เ (one stroke) vs แ (TWO เ together) are pre-posed vowels. Count the verticals.", tip_vi: "Hai nét → แ (ɛɛ); một nét → เ (ee).", tip_en: "Two strokes → แ; one → เ." },
  { id: "vn_sim_017", category: "similar_letters", script: "ไ vs ใ", rtgs: "ai vs ai", explanation_vi: "ไ (ไม้มลาย) và ใ (ไม้ม้วน) đều đọc 'ai'; ใ có vòng cuộn thêm ở đầu, chỉ dùng cho ~20 từ.", explanation_en: "ไ and ใ both read 'ai'; ใ has an extra curl, used for only ~20 words.", tip_vi: "Có vòng cuộn → ใ (từ đặc biệt).", tip_en: "Extra curl → ใ (special words)." },
  { id: "vn_sim_018", category: "similar_letters", script: "ฉ vs ฌ", rtgs: "ch", explanation_vi: "ฉ và ฌ (đều 'ch') giống thân; ฌ có thêm chân/nét phụ. ฌ rất hiếm.", explanation_en: "ฉ and ฌ (both 'ch') share a body; ฌ adds an extra leg. ฌ is rare.", tip_vi: "Thêm chân phụ → ฌ.", tip_en: "Extra leg → ฌ." },

  // ───────────────── vowel_placement ─────────────────
  { id: "vn_vow_001", category: "vowel_placement", script: "เด (เ + ด)", rtgs: "dee", explanation_vi: "Nguyên âm เ VIẾT TRƯỚC phụ âm nhưng ĐỌC SAU. เด đọc 'dee', không phải 'ed'.", explanation_en: "The vowel เ is WRITTEN BEFORE the consonant but READ AFTER. เด = 'dee', not 'ed'.", tip_vi: "Thấy เ đầu → đọc phụ âm trước, rồi 'ee'.", tip_en: "เ at the front → say the consonant first, then 'ee'." },
  { id: "vn_vow_002", category: "vowel_placement", script: "ไป (ไ + ป)", rtgs: "pai", explanation_vi: "ไ đứng trước ป nhưng âm là 'pai': phụ âm + ai. Đừng đọc 'aip'.", explanation_en: "ไ precedes ป but the sound is 'pai': consonant + ai. Not 'aip'.", tip_vi: "ไ/ใ/เ/แ/โ luôn viết trước, đọc sau.", tip_en: "ไ/ใ/เ/แ/โ are always written first, read after." },
  { id: "vn_vow_003", category: "vowel_placement", script: "บิ (บ + ◌ิ)", rtgs: "bì", explanation_vi: "Nguyên âm อิ VIẾT PHÍA TRÊN phụ âm. Nó thuộc về phụ âm bên dưới nó.", explanation_en: "The vowel อิ is written ABOVE the consonant and belongs to the one beneath it.", tip_vi: "Dấu trên đầu = nguyên âm của chữ ngay dưới.", tip_en: "A mark on top = the vowel of the letter directly below." },
  { id: "vn_vow_004", category: "vowel_placement", script: "ดุ (ด + ◌ุ)", rtgs: "dù", explanation_vi: "Nguyên âm อุ VIẾT PHÍA DƯỚI phụ âm. Đừng nhầm là nét trang trí.", explanation_en: "The vowel อุ is written BELOW the consonant. It's not decoration.", tip_vi: "Móc dưới chân = nguyên âm 'u'.", tip_en: "Hook under the foot = the 'u' vowel." },
  { id: "vn_vow_005", category: "vowel_placement", script: "กา (ก + า)", rtgs: "gaa", explanation_vi: "สระอา (า) viết SAU phụ âm, đọc cũng sau — trường hợp dễ nhất.", explanation_en: "สระอา (า) is written AFTER the consonant and read after — the easy case.", tip_vi: "Nét đứng bên phải = 'aa' dài.", tip_en: "Vertical stroke on the right = long 'aa'." },
  { id: "vn_vow_006", category: "vowel_placement", script: "เกา (เ + ก + า)", rtgs: "gao", explanation_vi: "Nguyên âm 'BAO QUANH': เ trước + า sau cùng ghép thành เ–า = 'ao'. Phụ âm ở giữa.", explanation_en: "A SURROUNDING vowel: เ before + า after combine as เ–า = 'ao', consonant in the middle.", tip_vi: "Đọc thứ tự: phụ âm + 'ao'.", tip_en: "Read order: consonant + 'ao'." },
  { id: "vn_vow_007", category: "vowel_placement", script: "เลีย (เ + ล + ี + ย)", rtgs: "lia", explanation_vi: "Nguyên âm เ–ีย gồm nhiều phần ôm lấy phụ âm. Nhận cả cụm là 'ia'.", explanation_en: "The vowel เ–ีย has several parts wrapping the consonant. Read the whole as 'ia'.", tip_vi: "Đừng đọc rời từng dấu; nhận cụm.", tip_en: "Don't read marks separately; take the cluster." },
  { id: "vn_vow_008", category: "vowel_placement", script: "ครับ (ค + ร + ◌ั + บ)", rtgs: "khráp", explanation_vi: "ไม้หันอากาศ (◌ั) trên đầu = nguyên âm 'a' ngắn, không phải dấu thanh.", explanation_en: "ไม้หันอากาศ (◌ั) on top = a short 'a' vowel, NOT a tone mark.", tip_vi: "Dấu giống 'cái mũ' tròn nhỏ = 'a' ngắn.", tip_en: "The small round 'hat' = short 'a'." },
  { id: "vn_vow_009", category: "vowel_placement", script: "◌ิ (vowel) vs ◌่ (tone)", rtgs: "i vs èek", explanation_vi: "Cả hai nằm TRÊN chữ nhưng khác chức năng: ◌ิ là nguyên âm, ◌่ là dấu thanh. Có thể cùng xuất hiện.", explanation_en: "Both sit ABOVE a letter but differ: ◌ิ is a vowel, ◌่ is a tone mark. They can co-occur.", tip_vi: "Một chữ có thể mang cả nguyên âm trên + dấu thanh trên.", tip_en: "One letter can carry both an upper vowel and a tone mark." },
  { id: "vn_vow_010", category: "vowel_placement", script: "อ là phụ âm & nguyên âm", rtgs: "ɔ / carrier", explanation_vi: "อ vừa là phụ âm (อ่าง) vừa làm 'giá đỡ' cho nguyên âm khi từ bắt đầu bằng âm nguyên: อา, อี...", explanation_en: "อ is both a consonant and a vowel 'carrier' when a word starts with a vowel sound: อา, อี...", tip_vi: "Đầu từ có อ + nguyên âm → อ chỉ là chỗ tựa.", tip_en: "Word-initial อ + vowel → อ is just a holder." },
  { id: "vn_vow_011", category: "vowel_placement", script: "นก (nguyên âm ẩn)", rtgs: "nók", explanation_vi: "นก không có ký hiệu nguyên âm: có 'o ngắn' ẨN giữa hai phụ âm. = 'nók' (chim).", explanation_en: "นก shows no vowel sign: a short inherent 'o' hides between the two consonants. = 'nók' (bird).", tip_vi: "Hai phụ âm sát nhau, không nguyên âm → thường có 'o/a' ẩn.", tip_en: "Two bare consonants → often a hidden 'o/a'." },

  // ───────────────── spacing ─────────────────
  { id: "vn_space_001", category: "spacing", script: "ไปโรงเรียน", rtgs: "pai roong-rian", explanation_vi: "Không có dấu cách trong từ/cụm. ไป|โรงเรียน = 'đi học'. Tự tách khi đọc.", explanation_en: "No spaces inside a phrase. ไป|โรงเรียน = 'go to school'. Segment as you read.", tip_vi: "Nhận từ quen (ไป) để cắt cụm.", tip_en: "Spot a known word (ไป) to split the chunk." },
  { id: "vn_space_002", category: "spacing", script: "ผมชอบกินข้าว", rtgs: "phǒm chɔ̂ɔp gin khâao", explanation_vi: "Bốn từ dính liền: ผม|ชอบ|กิน|ข้าว. Khoảng trắng KHÔNG dùng giữa từ.", explanation_en: "Four joined words: ผม|ชอบ|กิน|ข้าว. Spaces are NOT used between words.", tip_vi: "Đừng chờ dấu cách; tách theo nghĩa.", tip_en: "Don't wait for spaces; split by meaning." },
  { id: "vn_space_003", category: "spacing", script: "วันนี้ฝนตก เลยไม่ไป", rtgs: "wan-níi fǒn tòk  ləəi mâi pai", explanation_vi: "Khoảng trắng ở đây ngắt MỆNH ĐỀ (như dấu phẩy), không ngắt từ.", explanation_en: "The space here breaks a CLAUSE (like a comma), not a word.", tip_vi: "Dấu cách ≈ dấu phẩy/chấm câu trong tiếng Thái.", tip_en: "A space ≈ comma/sentence break in Thai." },
  { id: "vn_space_004", category: "spacing", script: "นางสาว สมหญิง", rtgs: "naang-sǎao  Sǒm-yǐng", explanation_vi: "Khoảng trắng tách CHỨC DANH với TÊN RIÊNG, hoặc trước tên người.", explanation_en: "A space separates a title from a proper NAME, or precedes a personal name.", tip_vi: "Cách trước tên riêng là bình thường.", tip_en: "A space before a name is normal." },
  { id: "vn_space_005", category: "spacing", script: "๑๒๓ / 123", rtgs: "nʉ̀ng-sɔ̌ɔng-sǎam", explanation_vi: "Chữ số Thái ๑๒๓ và số Ả Rập 123 đều dùng. Không có dấu cách giữa các chữ số.", explanation_en: "Thai numerals ๑๒๓ and Arabic 123 are both used. No spaces between digits.", tip_vi: "Học nhận mặt số Thái: ๑=1, ๒=2, ๓=3...", tip_en: "Learn Thai digits: ๑=1, ๒=2, ๓=3..." },

  // ───────────────── sign ─────────────────
  { id: "vn_sign_001", category: "sign", script: "เข้า vs ออก", rtgs: "khâo vs ɔ̀ɔk", explanation_vi: "เข้า = VÀO, ออก = RA. Hai biển hay đứng cạnh nhau ở cửa.", explanation_en: "เข้า = IN/ENTER, ออก = OUT/EXIT. Often paired at doorways.", tip_vi: "ออก ngắn, bắt đầu bằng อ; เข้า có เ ở đầu.", tip_en: "ออก starts with อ; เข้า starts with เ." },
  { id: "vn_sign_002", category: "sign", script: "ชาย vs หญิง", rtgs: "chaai vs yǐng", explanation_vi: "ชาย = NAM, หญิง = NỮ. Biển nhà vệ sinh. หญิง dài hơn, có ห dẫn.", explanation_en: "ชาย = MEN, หญิง = WOMEN. Toilet signs. หญิง is longer, starts with ห.", tip_vi: "Chữ dài bắt đầu ห → หญิง (nữ).", tip_en: "Longer, ห-initial → หญิง (women)." },
  { id: "vn_sign_003", category: "sign", script: "เปิด vs ปิด", rtgs: "pəət vs pìt", explanation_vi: "เปิด = MỞ, ปิด = ĐÓNG. Chỉ khác เ ở đầu! Dễ đọc nhầm.", explanation_en: "เปิด = OPEN, ปิด = CLOSED. They differ only by เ at the front! Easy to misread.", tip_vi: "Có เ đầu = MỞ (เปิด).", tip_en: "Leading เ = OPEN (เปิด)." },
  { id: "vn_sign_004", category: "sign", script: "ห้าม", rtgs: "hâam", explanation_vi: "ห้าม = CẤM. Mở đầu nhiều biển cấm: ห้ามจอด, ห้ามสูบบุหรี่.", explanation_en: "ห้าม = FORBIDDEN. Opens many prohibition signs: ห้ามจอด, ห้ามสูบบุหรี่.", tip_vi: "Thấy ห้าม đầu biển → điều bị cấm.", tip_en: "ห้าม at the start → something prohibited." },
  { id: "vn_sign_005", category: "sign", script: "ห้องน้ำ", rtgs: "hɔ̂ng-náam", explanation_vi: "Biển NHÀ VỆ SINH. ห้อง = phòng, น้ำ = nước.", explanation_en: "TOILET sign. ห้อง = room, น้ำ = water.", tip_vi: "Hai khối: ห้อง + น้ำ.", tip_en: "Two blocks: ห้อง + น้ำ." },
  { id: "vn_sign_006", category: "sign", script: "ทางออกฉุกเฉิน", rtgs: "thaang-ɔ̀ɔk chùk-chə̌ən", explanation_vi: "LỐI THOÁT HIỂM. ทางออก = lối ra + ฉุกเฉิน = khẩn cấp.", explanation_en: "EMERGENCY EXIT. ทางออก = exit + ฉุกเฉิน = emergency.", tip_vi: "Nhận ทางออก trước, phần sau = khẩn cấp.", tip_en: "Spot ทางออก first; the rest = emergency." },
  { id: "vn_sign_007", category: "sign", script: "ระวัง", rtgs: "rá-wang", explanation_vi: "CẨN THẬN / CHÚ Ý. Hay đi kèm: ระวังลื่น (coi chừng trơn).", explanation_en: "CAUTION. Often with: ระวังลื่น (caution: slippery).", tip_vi: "ระวัง = chú ý, theo sau là mối nguy.", tip_en: "ระวัง = beware; a hazard usually follows." },
  { id: "vn_sign_008", category: "sign", script: "พนักงานเท่านั้น", rtgs: "phá-nák-ngaan thâo-nán", explanation_vi: "CHỈ DÀNH CHO NHÂN VIÊN. เท่านั้น = chỉ/duy nhất.", explanation_en: "STAFF ONLY. เท่านั้น = only.", tip_vi: "Thấy เท่านั้น cuối = 'chỉ ...'.", tip_en: "เท่านั้น at the end = 'only ...'." },

  // ───────────────── tone_mark ─────────────────
  { id: "vn_tone_001", category: "tone_mark", script: "◌่ vs ◌้", rtgs: "èek vs thoo", explanation_vi: "ไม้เอก (◌่, một nét xiên) vs ไม้โท (◌้, nét gấp như số 2 nhỏ). Đếm độ phức tạp nét.", explanation_en: "máai èek (◌่, a single slash) vs máai thoo (◌้, a kinked '2'-like mark).", tip_vi: "Một gạch = เอก; nét cong gấp = โท.", tip_en: "One slash = èek; kinked curl = thoo." },
  { id: "vn_tone_002", category: "tone_mark", script: "◌๊ vs ◌๋", rtgs: "trii vs jàt-tà-waa", explanation_vi: "ไม้ตรี (◌๊) như số ๒ nhỏ có vòng; ไม้จัตวา (◌๋) như dấu '+' nhỏ. Cả hai hiếm hơn.", explanation_en: "máai trii (◌๊) loops like a tiny ๒; máai jàt-tà-waa (◌๋) like a small '+'. Both rarer.", tip_vi: "Dấu '+' nhỏ → จัตวา (thanh lên).", tip_en: "Tiny '+' → jàt-tà-waa (rising)." },
  { id: "vn_tone_003", category: "tone_mark", script: "ไม้ vs ไม่", rtgs: "mái vs mâi", explanation_vi: "Cùng chữ ไม; ◌้ (โท) → ไม้ = gỗ; ◌่ (เอก) → ไม่ = không. Dấu thanh đổi NGHĨA.", explanation_en: "Same ไม; ◌้ → ไม้ = wood; ◌่ → ไม่ = not. The tone mark changes MEANING.", tip_vi: "Nhìn kỹ dấu trên: gấp=ไม้, gạch=ไม่.", tip_en: "Check the upper mark: kinked=ไม้, slash=ไม่." },
  { id: "vn_tone_004", category: "tone_mark", script: "ป่า vs ป้า", rtgs: "pàa vs pâa", explanation_vi: "ป่า (◌่ → rừng) vs ป้า (◌้ → bác/cô). Chỉ khác kiểu dấu thanh phía trên.", explanation_en: "ป่า (◌่ → forest) vs ป้า (◌้ → aunt). Only the upper tone mark differs.", tip_vi: "Một gạch=ป่า; nét gấp=ป้า.", tip_en: "Single slash=ป่า; kinked=ป้า." },
  { id: "vn_tone_005", category: "tone_mark", script: "ดู vs ดู่", rtgs: "duu vs dùu", explanation_vi: "Không dấu vs có ไม้เอก. Dấu thanh nằm TRÊN phụ âm, dù nguyên âm อู ở dưới.", explanation_en: "No mark vs máai èek. The tone mark sits ABOVE the consonant even when อู is below.", tip_vi: "Dấu thanh luôn trên phụ âm gốc, không trên nguyên âm.", tip_en: "Tone marks ride on the base consonant, not the vowel." },
  { id: "vn_tone_006", category: "tone_mark", script: "น้ำ (dấu chồng)", rtgs: "náam", explanation_vi: "น้ำ có ◌้ (โท) NẰM TRÊN cùng với nguyên âm อำ. Một chữ có thể chồng nhiều ký hiệu.", explanation_en: "น้ำ stacks ◌้ (thoo) together with the vowel อำ. A letter can carry stacked marks.", tip_vi: "Đừng hoảng khi thấy nhiều dấu chồng trên một chữ.", tip_en: "Don't panic at multiple stacked marks on one letter." },
  { id: "vn_tone_007", category: "tone_mark", script: "◌่◌้ ≠ ◌ิ◌ี", rtgs: "—", explanation_vi: "Dấu thanh (◌่◌้◌๊◌๋) KHÁC nguyên âm trên (◌ิ◌ี◌ึ◌ื). Đừng đọc dấu thanh thành âm.", explanation_en: "Tone marks (◌่◌้◌๊◌๋) are NOT upper vowels (◌ิ◌ี◌ึ◌ื). Don't read a tone mark as a sound.", tip_vi: "Dấu thanh chỉ đổi cao độ, không thêm âm.", tip_en: "Tone marks change pitch only, they add no sound." },
];

export default scriptVisualNotes;
