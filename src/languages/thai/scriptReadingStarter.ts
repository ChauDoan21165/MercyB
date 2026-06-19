// src/languages/thai/scriptReadingStarter.ts
//
// Thai script reading starter for Vietnamese-speaking and English-speaking
// learners.
//
// Self-contained PURE DATA: declares its own types inline and exports the
// reading-item array. The goal is RECOGNITION, not pronunciation — each item
// shows a piece of Thai script (a letter, vowel, sign, or short word) with a
// romanization and a bilingual explanation of how to read/decode it.
//
// Categories cover the on-ramp to reading: consonants, vowels, the
// no-spaces-between-words convention (spacing), common public signs, tone-mark
// awareness, short whole words, and street-sign-style phrases.
//
// No audio, no pronunciation scoring. Romanization + tone labels are reading
// aids, NOT a claim of correct pronunciation. Native-speaker review is
// DEFERRED — this starter does NOT claim native review.

export type ThaiReadingCategory =
  | "consonant"
  | "vowel"
  | "spacing"
  | "sign"
  | "tone_mark"
  | "short_word"
  | "street_phrase";

export type ThaiReadingItem = {
  id: string;
  category: ThaiReadingCategory;
  /** The Thai script being read. */
  script: string;
  /** Romanization / reading of the script. */
  rtgs: string;
  /** Vietnamese explanation of how to read/decode it. */
  explanation_vi: string;
  /** English explanation. */
  explanation_en: string;
};

export const scriptReadingStarter: ThaiReadingItem[] = [
  // ───────────────── consonants ─────────────────
  { id: "rd_cons_001", category: "consonant", script: "ก", rtgs: "g (gaw gài)", explanation_vi: "ก = âm 'g', tên chữ 'ก ไก่' (gà). Phụ âm giữa.", explanation_en: "ก = 'g' sound, named 'gɔɔ gài' (chicken). A mid-class consonant." },
  { id: "rd_cons_002", category: "consonant", script: "ข", rtgs: "kh (khaw khài)", explanation_vi: "ข = âm 'kh' bật hơi, 'ข ไข่' (trứng). Phụ âm cao.", explanation_en: "ข = aspirated 'kh', 'khɔɔ khài' (egg). High-class." },
  { id: "rd_cons_003", category: "consonant", script: "ค", rtgs: "kh (khaw khwaai)", explanation_vi: "ค = âm 'kh', 'ค ควาย' (trâu). Phụ âm thấp — quan trọng cho luật thanh.", explanation_en: "ค = 'kh', 'khɔɔ khwaai' (buffalo). Low-class — matters for tone rules." },
  { id: "rd_cons_004", category: "consonant", script: "ง", rtgs: "ng (ngaw nguu)", explanation_vi: "ง = âm 'ng' (như 'ng' tiếng Việt), 'ง งู' (rắn). Có thể đứng đầu từ.", explanation_en: "ง = 'ng' (as in 'sing'), 'ngɔɔ nguu' (snake). Can begin a word." },
  { id: "rd_cons_005", category: "consonant", script: "จ", rtgs: "j (jaw jaan)", explanation_vi: "จ = âm 'j/ch' nhẹ, 'จ จาน' (đĩa). Phụ âm giữa.", explanation_en: "จ = 'j', 'jɔɔ jaan' (plate). Mid-class." },
  { id: "rd_cons_006", category: "consonant", script: "ด", rtgs: "d (daw dek)", explanation_vi: "ด = âm 'd', 'ด เด็ก' (đứa trẻ). Phụ âm giữa.", explanation_en: "ด = 'd', 'dɔɔ dèk' (child). Mid-class." },
  { id: "rd_cons_007", category: "consonant", script: "ต", rtgs: "t (taw tao)", explanation_vi: "ต = âm 't' không bật hơi, 'ต เต่า' (rùa). Dễ nhầm với ด.", explanation_en: "ต = unaspirated 't', 'tɔɔ tào' (turtle). Easy to confuse with ด." },
  { id: "rd_cons_008", category: "consonant", script: "ท", rtgs: "th (thaw thahaan)", explanation_vi: "ท = âm 'th' bật hơi, 'ท ทหาร' (lính). Phụ âm thấp.", explanation_en: "ท = aspirated 'th', 'thɔɔ thá-hǎan' (soldier). Low-class." },
  { id: "rd_cons_009", category: "consonant", script: "น", rtgs: "n (naw nuu)", explanation_vi: "น = âm 'n', 'น หนู' (chuột). Cũng làm phụ âm cuối phổ biến.", explanation_en: "น = 'n', 'nɔɔ nǔu' (mouse). Also a common final consonant." },
  { id: "rd_cons_010", category: "consonant", script: "บ", rtgs: "b (baw baimai)", explanation_vi: "บ = âm 'b', 'บ ใบไม้' (lá cây). Phụ âm giữa.", explanation_en: "บ = 'b', 'bɔɔ bai-máai' (leaf). Mid-class." },
  { id: "rd_cons_011", category: "consonant", script: "ป", rtgs: "p (paw plaa)", explanation_vi: "ป = âm 'p' không bật hơi, 'ป ปลา' (cá). Khác với ผ/พ (bật hơi).", explanation_en: "ป = unaspirated 'p', 'pɔɔ plaa' (fish). Differs from aspirated ผ/พ." },
  { id: "rd_cons_012", category: "consonant", script: "ม", rtgs: "m (maw maa)", explanation_vi: "ม = âm 'm', 'ม ม้า' (ngựa).", explanation_en: "ม = 'm', 'mɔɔ máa' (horse)." },
  { id: "rd_cons_013", category: "consonant", script: "ร", rtgs: "r (raw ruea)", explanation_vi: "ร = âm 'r' rung, 'ร เรือ' (thuyền). Khẩu ngữ hay đọc thành 'l'.", explanation_en: "ร = trilled 'r', 'rɔɔ rʉa' (boat). Often relaxed to 'l' in speech." },
  { id: "rd_cons_014", category: "consonant", script: "ล", rtgs: "l (law ling)", explanation_vi: "ล = âm 'l', 'ล ลิง' (khỉ).", explanation_en: "ล = 'l', 'lɔɔ ling' (monkey)." },
  { id: "rd_cons_015", category: "consonant", script: "ส", rtgs: "s (saw suea)", explanation_vi: "ส = âm 's', 'ส เสือ' (hổ). Phụ âm cao.", explanation_en: "ส = 's', 'sɔɔ sʉ̌a' (tiger). High-class." },
  { id: "rd_cons_016", category: "consonant", script: "ห", rtgs: "h (haw hiip)", explanation_vi: "ห = âm 'h', 'ห หีบ' (rương). Đứng đầu (ห-นำ) thì câm và nâng thanh.", explanation_en: "ห = 'h', 'hɔɔ hìip' (chest). As a silent leader it raises the next consonant's tone." },
  { id: "rd_cons_017", category: "consonant", script: "อ", rtgs: "ʔ / o (aw aang)", explanation_vi: "อ = phụ âm 'câm' đặc biệt, 'อ อ่าง' (chậu). Cũng làm chỗ tựa cho nguyên âm.", explanation_en: "อ = a special 'silent' consonant, 'ɔɔ àang' (basin). Also a vowel carrier." },
  { id: "rd_cons_018", category: "consonant", script: "พ", rtgs: "ph (phaw phaan)", explanation_vi: "พ = âm 'ph' bật hơi (KHÔNG phải 'f'), 'พ พาน'. Phụ âm thấp.", explanation_en: "พ = aspirated 'ph' (NOT 'f'), 'phɔɔ phaan'. Low-class." },

  // ───────────────── vowels ─────────────────
  { id: "rd_vow_001", category: "vowel", script: "อา", rtgs: "-aa (long a)", explanation_vi: "สระอา = nguyên âm 'a' DÀI, viết sau phụ âm. Vd: มา = maa.", explanation_en: "สระอา = long 'aa', written after the consonant. e.g. มา = maa." },
  { id: "rd_vow_002", category: "vowel", script: "อิ", rtgs: "-i (short i)", explanation_vi: "สระอิ = 'i' NGẮN, viết PHÍA TRÊN phụ âm. Vd: บิ = bì.", explanation_en: "สระอิ = short 'i', written ABOVE the consonant. e.g. บิ = bì." },
  { id: "rd_vow_003", category: "vowel", script: "อี", rtgs: "-ii (long i)", explanation_vi: "สระอี = 'i' DÀI, dấu phía trên. Vd: ดี = dii (tốt).", explanation_en: "สระอี = long 'ii', mark above. e.g. ดี = dii (good)." },
  { id: "rd_vow_004", category: "vowel", script: "อุ", rtgs: "-u (short u)", explanation_vi: "สระอุ = 'u' NGẮN, viết PHÍA DƯỚI phụ âm. Vd: ดุ = dù.", explanation_en: "สระอุ = short 'u', written BELOW the consonant. e.g. ดุ = dù." },
  { id: "rd_vow_005", category: "vowel", script: "อู", rtgs: "-uu (long u)", explanation_vi: "สระอู = 'u' DÀI, dấu phía dưới. Vd: หมู = mǔu (heo).", explanation_en: "สระอู = long 'uu', mark below. e.g. หมู = mǔu (pig)." },
  { id: "rd_vow_006", category: "vowel", script: "เอ", rtgs: "-ee (long e)", explanation_vi: "สระเอ = 'ê' DÀI, viết TRƯỚC phụ âm dù đọc sau. Vd: เท = thee.", explanation_en: "สระเอ = long 'ee', written BEFORE the consonant but read after. e.g. เท = thee." },
  { id: "rd_vow_007", category: "vowel", script: "แอ", rtgs: "-ɛɛ (long ae)", explanation_vi: "สระแอ = 'e' mở (như 'a' trong 'cat'), viết trước. Vd: แม = mɛɛ.", explanation_en: "สระแอ = open 'ae' (as in 'cat'), written before. e.g. แม = mɛɛ." },
  { id: "rd_vow_008", category: "vowel", script: "โอ", rtgs: "-oo (long o)", explanation_vi: "สระโอ = 'ô' DÀI, viết trước phụ âm. Vd: โต = too (lớn).", explanation_en: "สระโอ = long 'oo', written before. e.g. โต = too (big)." },
  { id: "rd_vow_009", category: "vowel", script: "ไอ", rtgs: "-ai", explanation_vi: "สระไอ (ไม้มลาย) = 'ai', viết trước. Vd: ไป = pai (đi).", explanation_en: "สระไอ = 'ai', written before. e.g. ไป = pai (go)." },
  { id: "rd_vow_010", category: "vowel", script: "ใอ", rtgs: "-ai", explanation_vi: "สระใอ (ไม้ม้วน) = cũng đọc 'ai', chỉ dùng cho 20 từ đặc biệt. Vd: ใจ = jai (tim).", explanation_en: "สระใอ = also 'ai', used for only ~20 special words. e.g. ใจ = jai (heart)." },
  { id: "rd_vow_011", category: "vowel", script: "เอา", rtgs: "-ao", explanation_vi: "สระเอา = 'ao', bao quanh phụ âm. Vd: เรา = rao (chúng ta).", explanation_en: "สระเอา = 'ao', surrounds the consonant. e.g. เรา = rao (we)." },
  { id: "rd_vow_012", category: "vowel", script: "อำ", rtgs: "-am", explanation_vi: "สระอำ = 'am'. Vd: น้ำ = náam (nước, có thêm dấu thanh).", explanation_en: "สระอำ = 'am'. e.g. น้ำ = náam (water, with a tone mark added)." },
  { id: "rd_vow_013", category: "vowel", script: "เอีย", rtgs: "-ia", explanation_vi: "สระเอีย = 'ia'. Vd: เสีย = sǐa (hỏng/mất).", explanation_en: "สระเอีย = 'ia'. e.g. เสีย = sǐa (broken/lost)." },
  { id: "rd_vow_014", category: "vowel", script: "อัว", rtgs: "-ua", explanation_vi: "สระอัว = 'ua'. Vd: ตัว = tua (loại từ cho con vật).", explanation_en: "สระอัว = 'ua'. e.g. ตัว = tua (classifier for animals)." },

  // ───────────────── spacing ─────────────────
  { id: "rd_space_001", category: "spacing", script: "ผมกินข้าว", rtgs: "phǒm gin khâao", explanation_vi: "Tiếng Thái KHÔNG có khoảng trắng giữa các từ. Cụm này là 3 từ: ผม | กิน | ข้าว.", explanation_en: "Thai has NO spaces between words. This is three words: ผม | กิน | ข้าว." },
  { id: "rd_space_002", category: "spacing", script: "ขอบคุณมากครับ", rtgs: "khɔ̀ɔp-khun mâak khráp", explanation_vi: "Đọc liền không cách: ขอบคุณ + มาก + ครับ. Phải tự tách từ khi đọc.", explanation_en: "Read with no gaps: ขอบคุณ + มาก + ครับ. You segment words yourself." },
  { id: "rd_space_003", category: "spacing", script: "วันนี้ อากาศดี", rtgs: "wan-níi  aa-gàat dii", explanation_vi: "Khoảng trắng trong tiếng Thái ngắt CÂU/MỆNH ĐỀ, không ngắt từ. Ở đây tách hai ý.", explanation_en: "Spaces in Thai break CLAUSES/sentences, not words. Here it separates two ideas." },
  { id: "rd_space_004", category: "spacing", script: "ไปไหนมา", rtgs: "pai nǎi maa", explanation_vi: "Ba từ dính liền: ไป | ไหน | มา. Nhận diện từng từ quen để tách.", explanation_en: "Three joined words: ไป | ไหน | มา. Spot familiar words to split them." },
  { id: "rd_space_005", category: "spacing", script: "สวัสดีครับผมชื่อนาม", rtgs: "sà-wàt-dii khráp phǒm chʉ̂ʉ Naam", explanation_vi: "Cả câu không cách. Mẹo: tìm ครับ/ค่ะ và từ quen để biết ranh giới.", explanation_en: "A whole sentence with no gaps. Tip: find ครับ/ค่ะ and known words to locate boundaries." },

  // ───────────────── signs ─────────────────
  { id: "rd_sign_001", category: "sign", script: "ทางออก", rtgs: "thaang-ɔ̀ɔk", explanation_vi: "Biển 'LỐI RA' (exit). ทาง = đường/lối, ออก = ra.", explanation_en: "An 'EXIT' sign. ทาง = way, ออก = out." },
  { id: "rd_sign_002", category: "sign", script: "ทางเข้า", rtgs: "thaang-khâo", explanation_vi: "Biển 'LỐI VÀO' (entrance). เข้า = vào.", explanation_en: "An 'ENTRANCE' sign. เข้า = enter." },
  { id: "rd_sign_003", category: "sign", script: "ห้องน้ำ", rtgs: "hɔ̂ng-náam", explanation_vi: "Biển 'NHÀ VỆ SINH'. Nghĩa đen 'phòng nước'.", explanation_en: "A 'TOILET' sign. Literally 'water room'." },
  { id: "rd_sign_004", category: "sign", script: "ชาย", rtgs: "chaai", explanation_vi: "'NAM' — biển nhà vệ sinh nam.", explanation_en: "'MEN' — on a men's toilet." },
  { id: "rd_sign_005", category: "sign", script: "หญิง", rtgs: "yǐng", explanation_vi: "'NỮ' — biển nhà vệ sinh nữ.", explanation_en: "'WOMEN' — on a women's toilet." },
  { id: "rd_sign_006", category: "sign", script: "ห้ามสูบบุหรี่", rtgs: "hâam sùup bù-rìi", explanation_vi: "'CẤM HÚT THUỐC'. ห้าม = cấm.", explanation_en: "'NO SMOKING'. ห้าม = forbidden." },
  { id: "rd_sign_007", category: "sign", script: "เปิด", rtgs: "pəət", explanation_vi: "'MỞ CỬA' — biển cửa hàng.", explanation_en: "'OPEN' — shop sign." },
  { id: "rd_sign_008", category: "sign", script: "ปิด", rtgs: "pìt", explanation_vi: "'ĐÓNG CỬA'.", explanation_en: "'CLOSED'." },
  { id: "rd_sign_009", category: "sign", script: "ผลัก / ดึง", rtgs: "phlàk / dʉng", explanation_vi: "ผลัก = ĐẨY, ดึง = KÉO (biển trên cửa).", explanation_en: "ผลัก = PUSH, ดึง = PULL (on doors)." },
  { id: "rd_sign_010", category: "sign", script: "ระวัง", rtgs: "rá-wang", explanation_vi: "'CẨN THẬN / CHÚ Ý'.", explanation_en: "'CAUTION / BE CAREFUL'." },
  { id: "rd_sign_011", category: "sign", script: "ราคา", rtgs: "raa-khaa", explanation_vi: "'GIÁ' — thường thấy trên bảng giá.", explanation_en: "'PRICE' — common on price tags." },
  { id: "rd_sign_012", category: "sign", script: "ลดราคา", rtgs: "lót raa-khaa", explanation_vi: "'GIẢM GIÁ / SALE'.", explanation_en: "'SALE / DISCOUNT'." },

  // ───────────────── tone_mark ─────────────────
  { id: "rd_tone_001", category: "tone_mark", script: "อ่", rtgs: "máai èek ( ่ )", explanation_vi: "Dấu thanh thứ 1 (ไม้เอก). Vd: ป่า = pàa (rừng).", explanation_en: "Tone mark #1 (máai èek). e.g. ป่า = pàa (forest)." },
  { id: "rd_tone_002", category: "tone_mark", script: "อ้", rtgs: "máai thoo ( ้ )", explanation_vi: "Dấu thanh thứ 2 (ไม้โท). Vd: ป้า = pâa (bác/cô).", explanation_en: "Tone mark #2 (máai thoo). e.g. ป้า = pâa (aunt)." },
  { id: "rd_tone_003", category: "tone_mark", script: "อ๊", rtgs: "máai trii ( ๊ )", explanation_vi: "Dấu thanh thứ 3 (ไม้ตรี). Hiếm hơn. Vd: โต๊ะ = tó (bàn).", explanation_en: "Tone mark #3 (máai trii). Rarer. e.g. โต๊ะ = tó (table)." },
  { id: "rd_tone_004", category: "tone_mark", script: "อ๋", rtgs: "máai jàt-tà-waa ( ๋ )", explanation_vi: "Dấu thanh thứ 4 (ไม้จัตวา). Vd: จ๋า = jǎa (tiếng dạ thân mật).", explanation_en: "Tone mark #4 (máai jàt-tà-waa). e.g. จ๋า = jǎa (affectionate 'yes')." },
  { id: "rd_tone_005", category: "tone_mark", script: "ไม้ / ไม่", rtgs: "mái vs mâi", explanation_vi: "Cùng chữ, khác dấu thanh: ไม้ (มาตรี→cao)=gỗ; ไม่ (มาเอก→xuống)=không.", explanation_en: "Same letters, different tone mark: ไม้ (high)=wood; ไม่ (falling)=not." },
  { id: "rd_tone_006", category: "tone_mark", script: "ข้าว / ข่าว", rtgs: "khâao vs khàao", explanation_vi: "ไม้โท→xuống = cơm; ไม้เอก→thấp = tin tức. Dấu thanh đổi nghĩa.", explanation_en: "máai thoo→falling = rice; máai èek→low = news. The mark changes meaning." },
  { id: "rd_tone_007", category: "tone_mark", script: "นา / น้ำ", rtgs: "naa vs náam", explanation_vi: "นา không dấu = ruộng; thêm ไม้โท + อำ → น้ำ = nước. Dấu thanh nằm trên phụ âm.", explanation_en: "นา (no mark) = field; add máai thoo + อำ → น้ำ = water. The mark sits over the consonant." },

  // ───────────────── short_word ─────────────────
  { id: "rd_word_001", category: "short_word", script: "มา", rtgs: "maa", explanation_vi: "'đến' — phụ âm ม + สระอา. Từ một âm tiết dễ đọc.", explanation_en: "'come' — ม + long aa. An easy one-syllable word." },
  { id: "rd_word_002", category: "short_word", script: "ไป", rtgs: "pai", explanation_vi: "'đi' — สระไอ (trước) + ป.", explanation_en: "'go' — สระไอ (before) + ป." },
  { id: "rd_word_003", category: "short_word", script: "ดี", rtgs: "dii", explanation_vi: "'tốt' — ด + สระอี.", explanation_en: "'good' — ด + long ii." },
  { id: "rd_word_004", category: "short_word", script: "นี่", rtgs: "nîi", explanation_vi: "'cái này / đây' — มี ไม้เอก, đọc thanh xuống.", explanation_en: "'this / here' — has máai èek, read with a falling tone." },
  { id: "rd_word_005", category: "short_word", script: "กิน", rtgs: "gin", explanation_vi: "'ăn' — ก + สระอิ + น (phụ âm cuối).", explanation_en: "'eat' — ก + short i + final น." },
  { id: "rd_word_006", category: "short_word", script: "น้ำ", rtgs: "náam", explanation_vi: "'nước' — น + อำ + ไม้โท (thanh cao do phụ âm thấp).", explanation_en: "'water' — น + อำ + máai thoo (high tone via low-class consonant)." },
  { id: "rd_word_007", category: "short_word", script: "รัก", rtgs: "rák", explanation_vi: "'yêu' — ร + สระอะ (ẩn) + ก. Âm chết, thanh cao.", explanation_en: "'love' — ร + inherent short a + ก. A dead syllable, high tone." },
  { id: "rd_word_008", category: "short_word", script: "หมา", rtgs: "mǎa", explanation_vi: "'chó' — ห-นำ câm nâng ม thành thanh lên.", explanation_en: "'dog' — silent leading ห raises ม to a rising tone." },
  { id: "rd_word_009", category: "short_word", script: "ตา", rtgs: "taa", explanation_vi: "'mắt / ông ngoại' — ต + สระอา.", explanation_en: "'eye / grandfather' — ต + long aa." },
  { id: "rd_word_010", category: "short_word", script: "พ่อ", rtgs: "phɔ̂ɔ", explanation_vi: "'bố' — พ + สระออ (อ làm nguyên âm) + ไม้เอก.", explanation_en: "'father' — พ + สระออ (อ as vowel) + máai èek." },
  { id: "rd_word_011", category: "short_word", script: "แม่", rtgs: "mɛ̂ɛ", explanation_vi: "'mẹ' — สระแอ (trước) + ม + ไม้เอก.", explanation_en: "'mother' — สระแอ (before) + ม + máai èek." },
  { id: "rd_word_012", category: "short_word", script: "เด็ก", rtgs: "dèk", explanation_vi: "'đứa trẻ' — เ + ด + ็ (ไม้ไต่คู้ rút ngắn nguyên âm) + ก.", explanation_en: "'child' — เ + ด + ็ (shortener) + ก." },

  // ───────────────── street_phrase ─────────────────
  { id: "rd_street_001", category: "street_phrase", script: "ร้านอาหาร", rtgs: "ráan aa-hǎan", explanation_vi: "'NHÀ HÀNG / QUÁN ĂN' — biển hiệu hay gặp. ร้าน = cửa hàng.", explanation_en: "'RESTAURANT' — a common shop sign. ร้าน = shop." },
  { id: "rd_street_002", category: "street_phrase", script: "ร้านกาแฟ", rtgs: "ráan gaa-fɛɛ", explanation_vi: "'QUÁN CÀ PHÊ'.", explanation_en: "'COFFEE SHOP'." },
  { id: "rd_street_003", category: "street_phrase", script: "สถานีรถไฟ", rtgs: "sà-thǎa-nii rót-fai", explanation_vi: "'GA TÀU HỎA'. รถไฟ = xe lửa.", explanation_en: "'TRAIN STATION'. รถไฟ = train." },
  { id: "rd_street_004", category: "street_phrase", script: "โรงพยาบาล", rtgs: "roong-phá-yaa-baan", explanation_vi: "'BỆNH VIỆN'. โรง = tòa/xưởng.", explanation_en: "'HOSPITAL'. โรง = building/hall." },
  { id: "rd_street_005", category: "street_phrase", script: "ตำรวจ", rtgs: "tam-rùat", explanation_vi: "'CẢNH SÁT' — biển đồn công an: สถานีตำรวจ.", explanation_en: "'POLICE' — on a station: สถานีตำรวจ." },
  { id: "rd_street_006", category: "street_phrase", script: "ธนาคาร", rtgs: "thá-naa-khaan", explanation_vi: "'NGÂN HÀNG'.", explanation_en: "'BANK'." },
  { id: "rd_street_007", category: "street_phrase", script: "ตลาด", rtgs: "tà-làat", explanation_vi: "'CHỢ'.", explanation_en: "'MARKET'." },
  { id: "rd_street_008", category: "street_phrase", script: "รถเมล์", rtgs: "rót-mee", explanation_vi: "'XE BUÝT' — hay thấy ở trạm: ป้ายรถเมล์.", explanation_en: "'BUS' — at stops: ป้ายรถเมล์ (bus stop)." },
  { id: "rd_street_009", category: "street_phrase", script: "ทางม้าลาย", rtgs: "thaang máa-laai", explanation_vi: "'VẠCH SANG ĐƯỜNG' (nghĩa đen 'đường ngựa vằn').", explanation_en: "'PEDESTRIAN CROSSING' (literally 'zebra path')." },
  { id: "rd_street_010", category: "street_phrase", script: "ห้ามจอด", rtgs: "hâam jɔ̀ɔt", explanation_vi: "'CẤM ĐỖ XE'.", explanation_en: "'NO PARKING'." },
  { id: "rd_street_011", category: "street_phrase", script: "เซเว่น", rtgs: "see-wên", explanation_vi: "'7-Eleven' (cửa hàng tiện lợi) — viết theo âm tiếng Anh.", explanation_en: "'7-Eleven' (convenience store) — written phonetically from English." },
  { id: "rd_street_012", category: "street_phrase", script: "ทางลัด", rtgs: "thaang lát", explanation_vi: "'ĐƯỜNG TẮT'.", explanation_en: "'SHORTCUT'." },
];

export default scriptReadingStarter;
