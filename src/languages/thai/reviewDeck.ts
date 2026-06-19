// src/languages/thai/reviewDeck.ts
//
// Thai REVIEW DECK — spaced-repetition SEED DATA only.
//
// PURE DATA. There is intentionally NO scheduler engine here (no SM-2 /
// Leitner / interval math). This module exports flat, app-ready review
// cards; a separate review engine (wherever it lives) owns scheduling.
//
// Audience: Vietnamese-speaking learners first, English-speaking learners
// second. Every card carries Thai script + romanization + a Vietnamese
// gloss + an English gloss, plus a recall prompt in both languages.
//
// Cards are assembled from compact source tuples by the pure `build()`
// helper below (a data transform, NOT a scheduler) so the deck stays
// readable while still emitting fully-shaped card objects. Distractors are
// derived deterministically from sibling entries — no randomness — so the
// generated file is stable across runs.
//
// Native review DEFERRED: romanization and tone marks are a readable
// approximation, not a linguist-verified transcription. Do not advertise
// as native-reviewed.

// ── Types ────────────────────────────────────────────────────────────────

export type ThaiReviewCategory =
  | "vocab"
  | "phrase"
  | "classifier"
  | "particle"
  | "word_order"
  | "politeness"
  | "survival_phrase"
  | "tone_awareness";

export type ThaiReviewLevel = "A1" | "A2" | "B1" | "B2";

export type ThaiReviewCard = {
  /** Stable unique id, e.g. "thai-rev-001". */
  id: string;
  category: ThaiReviewCategory;
  level: ThaiReviewLevel;
  /** Thai script — the canonical target form. */
  th: string;
  /** Romanization with light tone cues. */
  rtgs: string;
  /** Vietnamese gloss / meaning. */
  vi: string;
  /** English gloss / meaning. */
  en: string;
  /** Recall prompt — Vietnamese. */
  prompt_vi: string;
  /** Recall prompt — English. */
  prompt_en: string;
  /** The expected answer (Thai script for most cards). */
  answer: string;
  /** Optional multiple-choice distractors (Thai script). */
  distractors?: string[];
};

// ── Source tuple + builder (pure data transform) ─────────────────────────

/** [th, rtgs, vi, en] */
type Entry = readonly [th: string, rtgs: string, vi: string, en: string];

type BuildOpts = {
  /** Derive 3 Thai distractors from sibling entries (multiple-choice). */
  withDistractors?: boolean;
};

/** Build prompt text for a category. Pure; no side effects. */
function prompts(
  category: ThaiReviewCategory,
  e: Entry,
): { prompt_vi: string; prompt_en: string } {
  const [th, rtgs, vi, en] = e;
  switch (category) {
    case "vocab":
      return {
        prompt_vi: `Từ tiếng Thái nghĩa là "${vi}" là gì?`,
        prompt_en: `What is the Thai word for "${en}"?`,
      };
    case "phrase":
    case "survival_phrase":
      return {
        prompt_vi: `Nói câu này bằng tiếng Thái: "${vi}"`,
        prompt_en: `Say this in Thai: "${en}"`,
      };
    case "classifier":
      return {
        prompt_vi: `Lượng từ (classifier) tiếng Thái dùng cho ${vi} là gì?`,
        prompt_en: `Which Thai classifier is used for ${en}?`,
      };
    case "particle":
      return {
        prompt_vi: `Tiểu từ tiếng Thái có chức năng: ${vi}`,
        prompt_en: `Thai particle that does: ${en}`,
      };
    case "word_order":
      return {
        prompt_vi: `Sắp xếp đúng trật tự từ tiếng Thái cho: "${vi}"`,
        prompt_en: `Put this into correct Thai word order: "${en}"`,
      };
    case "politeness":
      return {
        prompt_vi: `Cách nói/cụm lịch sự tiếng Thái cho: ${vi}`,
        prompt_en: `Polite Thai expression for: ${en}`,
      };
    case "tone_awareness":
      return {
        prompt_vi: `Phát âm "${rtgs}" (chú ý thanh điệu) — viết là gì, nghĩa "${vi}"?`,
        prompt_en: `Pronounced "${rtgs}" (mind the tone) — which Thai word means "${en}"?`,
      };
    default:
      return { prompt_vi: th, prompt_en: th };
  }
}

let CARD_SEQ = 0;

function build(
  category: ThaiReviewCategory,
  level: ThaiReviewLevel,
  entries: readonly Entry[],
  opts: BuildOpts = {},
): ThaiReviewCard[] {
  return entries.map((e, i) => {
    const [th, rtgs, vi, en] = e;
    const { prompt_vi, prompt_en } = prompts(category, e);
    CARD_SEQ += 1;
    const card: ThaiReviewCard = {
      id: `thai-rev-${String(CARD_SEQ).padStart(3, "0")}`,
      category,
      level,
      th,
      rtgs,
      vi,
      en,
      prompt_vi,
      prompt_en,
      answer: th,
    };
    if (opts.withDistractors && entries.length >= 4) {
      // 3 deterministic siblings (cyclic), never the entry itself.
      const ds: string[] = [];
      for (let k = 1; k <= 3; k++) {
        ds.push(entries[(i + k) % entries.length][0]);
      }
      card.distractors = ds;
    }
    return card;
  });
}

// ── Source data ──────────────────────────────────────────────────────────

// VOCAB — numbers
const VOCAB_NUMBERS: Entry[] = [
  ["หนึ่ง", "nʉ̀ng", "một", "one"],
  ["สอง", "sǎwng", "hai", "two"],
  ["สาม", "sǎam", "ba", "three"],
  ["สี่", "sìi", "bốn", "four"],
  ["ห้า", "hâa", "năm", "five"],
  ["หก", "hòk", "sáu", "six"],
  ["เจ็ด", "jèt", "bảy", "seven"],
  ["แปด", "pàet", "tám", "eight"],
  ["เก้า", "gâo", "chín", "nine"],
  ["สิบ", "sìp", "mười", "ten"],
  ["ร้อย", "rɔ́ɔi", "trăm", "hundred"],
  ["พัน", "phan", "nghìn", "thousand"],
];

// VOCAB — common verbs
const VOCAB_VERBS: Entry[] = [
  ["กิน", "gin", "ăn", "to eat"],
  ["ดื่ม", "dʉ̀ʉm", "uống", "to drink"],
  ["ไป", "pai", "đi", "to go"],
  ["มา", "maa", "đến / tới", "to come"],
  ["นอน", "nawn", "ngủ", "to sleep"],
  ["พูด", "phûut", "nói", "to speak"],
  ["ทำ", "tham", "làm", "to do / make"],
  ["ซื้อ", "sʉ́ʉ", "mua", "to buy"],
  ["ดู", "duu", "xem / nhìn", "to watch / look"],
  ["ฟัง", "fang", "nghe", "to listen"],
  ["อ่าน", "àan", "đọc", "to read"],
  ["เขียน", "khǐan", "viết", "to write"],
  ["รัก", "rák", "yêu", "to love"],
  ["ชอบ", "châwp", "thích", "to like"],
  ["อยาก", "yàak", "muốn", "to want"],
  ["เข้าใจ", "khâo-jai", "hiểu", "to understand"],
  ["รู้", "rúu", "biết", "to know"],
  ["ทำงาน", "tham-ngaan", "làm việc", "to work"],
];

// VOCAB — adjectives
const VOCAB_ADJ: Entry[] = [
  ["ดี", "dii", "tốt", "good"],
  ["ใหญ่", "yài", "to / lớn", "big"],
  ["เล็ก", "lék", "nhỏ", "small"],
  ["ร้อน", "rɔ́ɔn", "nóng", "hot"],
  ["หนาว", "nǎao", "lạnh", "cold"],
  ["แพง", "phaeng", "đắt", "expensive"],
  ["ถูก", "thùuk", "rẻ", "cheap"],
  ["สวย", "sǔai", "đẹp", "beautiful"],
  ["อร่อย", "à-ròi", "ngon", "delicious"],
  ["ง่าย", "ngâai", "dễ", "easy"],
  ["ยาก", "yâak", "khó", "difficult"],
  ["เร็ว", "reo", "nhanh", "fast"],
  ["ช้า", "cháa", "chậm", "slow"],
];

// VOCAB — common nouns
const VOCAB_NOUNS: Entry[] = [
  ["น้ำ", "náam", "nước", "water"],
  ["ข้าว", "khâao", "cơm / gạo", "rice"],
  ["บ้าน", "bâan", "nhà", "house / home"],
  ["รถ", "rót", "xe", "car / vehicle"],
  ["คน", "khon", "người", "person"],
  ["เงิน", "ngən", "tiền", "money"],
  ["เวลา", "wee-laa", "thời gian", "time"],
  ["อาหาร", "aa-hǎan", "thức ăn", "food"],
  ["วันนี้", "wan-níi", "hôm nay", "today"],
  ["พรุ่งนี้", "phrûng-níi", "ngày mai", "tomorrow"],
  ["เมื่อวาน", "mʉ̂a-waan", "hôm qua", "yesterday"],
];

// VOCAB — days of the week
const VOCAB_DAYS: Entry[] = [
  ["วันจันทร์", "wan jan", "thứ Hai", "Monday"],
  ["วันอังคาร", "wan ang-khaan", "thứ Ba", "Tuesday"],
  ["วันพุธ", "wan phút", "thứ Tư", "Wednesday"],
  ["วันพฤหัสบดี", "wan phá-rʉ́-hàt", "thứ Năm", "Thursday"],
  ["วันศุกร์", "wan sùk", "thứ Sáu", "Friday"],
  ["วันเสาร์", "wan sǎo", "thứ Bảy", "Saturday"],
  ["วันอาทิตย์", "wan aa-thít", "Chủ nhật", "Sunday"],
];

// PHRASE — everyday
const PHRASES: Entry[] = [
  ["สวัสดี", "sà-wàt-dii", "Xin chào", "Hello"],
  ["ขอบคุณ", "khàwp-khun", "Cảm ơn", "Thank you"],
  ["ขอโทษ", "khǎw-thôot", "Xin lỗi", "Sorry / excuse me"],
  ["สบายดีไหม", "sà-baai dii mǎi", "Bạn khỏe không?", "How are you?"],
  ["สบายดี", "sà-baai dii", "Tôi khỏe", "I'm fine"],
  ["คุณชื่ออะไร", "khun chʉ̂ʉ à-rai", "Bạn tên gì?", "What's your name?"],
  ["ยินดีที่ได้รู้จัก", "yin-dii thîi dâai rúu-jàk", "Rất vui được làm quen", "Nice to meet you"],
  ["แล้วเจอกัน", "láeo jəə gan", "Hẹn gặp lại", "See you later"],
  ["ราตรีสวัสดิ์", "raa-trii sà-wàt", "Chúc ngủ ngon", "Goodnight"],
  ["ไม่เป็นไร", "mâi pen rai", "Không sao đâu", "No problem / never mind"],
  ["ใช่", "châi", "Đúng / vâng", "Yes"],
  ["ไม่ใช่", "mâi châi", "Không phải", "No / that's not right"],
  ["เข้าใจแล้ว", "khâo-jai láeo", "Hiểu rồi", "I understand"],
  ["ไม่เข้าใจ", "mâi khâo-jai", "Không hiểu", "I don't understand"],
  ["พูดอีกครั้งได้ไหม", "phûut ìik khráng dâi mǎi", "Nói lại lần nữa được không?", "Can you say that again?"],
  ["เท่าไหร่", "thâo-rài", "Bao nhiêu?", "How much?"],
  ["อยู่ที่ไหน", "yùu thîi-nǎi", "Ở đâu?", "Where is it?"],
  ["กี่โมงแล้ว", "gìi moong láeo", "Mấy giờ rồi?", "What time is it?"],
  ["ผมหิว", "phǒm hǐu", "Tôi đói", "I'm hungry"],
  ["ผมเหนื่อย", "phǒm nʉ̀ai", "Tôi mệt", "I'm tired"],
  ["รอสักครู่", "raw sàk-khrûu", "Đợi một lát", "Wait a moment"],
  ["ไปกันเถอะ", "pai gan thə̀", "Đi thôi", "Let's go"],
  ["ยินดีต้อนรับ", "yin-dii tâwn-ráp", "Chào mừng", "Welcome"],
  ["โชคดี", "chôok dii", "Chúc may mắn", "Good luck"],
];

// SURVIVAL_PHRASE
const SURVIVAL: Entry[] = [
  ["ช่วยด้วย", "chûay dûay", "Cứu với!", "Help!"],
  ["ห้องน้ำอยู่ที่ไหน", "hâwng-náam yùu thîi-nǎi", "Nhà vệ sinh ở đâu?", "Where is the toilet?"],
  ["เรียกตำรวจ", "rîak tam-rùat", "Gọi cảnh sát", "Call the police"],
  ["เรียกหมอ", "rîak mǎw", "Gọi bác sĩ", "Call a doctor"],
  ["ผมหลงทาง", "phǒm lǒng thaang", "Tôi bị lạc đường", "I'm lost"],
  ["คุณพูดอังกฤษได้ไหม", "khun phûut ang-grìt dâi mǎi", "Bạn nói được tiếng Anh không?", "Do you speak English?"],
  ["ผมแพ้อาหารทะเล", "phǒm pháe aa-hǎan thá-lee", "Tôi dị ứng hải sản", "I'm allergic to seafood"],
  ["ไม่เผ็ด", "mâi phèt", "Không cay", "Not spicy"],
  ["เปิดมิเตอร์ด้วย", "pə̀ət mí-tə̂ə dûay", "Bật đồng hồ giúp", "Use the meter, please"],
  ["จอดตรงนี้", "jàwt trong níi", "Dừng ở đây", "Stop here"],
  ["แพงไป ลดได้ไหม", "phaeng pai, lót dâi mǎi", "Đắt quá, giảm được không?", "Too expensive, can you lower it?"],
  ["ผมไม่สบาย", "phǒm mâi sà-baai", "Tôi không khỏe", "I feel unwell"],
  ["ปวดท้อง", "pùat tháwng", "Đau bụng", "Stomachache"],
  ["มียาแก้ปวดไหม", "mii yaa gâe pùat mǎi", "Có thuốc giảm đau không?", "Do you have painkillers?"],
  ["ตู้เอทีเอ็มอยู่ที่ไหน", "tûu ee-thii-em yùu thîi-nǎi", "Máy ATM ở đâu?", "Where is an ATM?"],
  ["ขอเมนูหน่อย", "khǎw mee-nuu nòi", "Cho xem thực đơn", "Menu, please"],
  ["เก็บเงินด้วย", "gèp ngən dûay", "Tính tiền", "The bill, please"],
  ["ขอน้ำเปล่าหนึ่งแก้ว", "khǎw náam plào nʉ̀ng gâeo", "Cho một ly nước lọc", "A glass of water, please"],
  ["สถานีรถไฟฟ้าอยู่ที่ไหน", "sà-thǎa-nii rót-fai-fáa yùu thîi-nǎi", "Ga tàu điện ở đâu?", "Where is the BTS station?"],
  ["ช่วยโทรเรียกรถพยาบาล", "chûay toh rîak rót phá-yaa-baan", "Gọi xe cấp cứu giúp", "Please call an ambulance"],
  ["หนังสือเดินทางของผมหาย", "nǎng-sʉ̌ʉ dəən-thaang khǎwng phǒm hǎai", "Hộ chiếu của tôi bị mất", "My passport is lost"],
  ["ผมต้องการความช่วยเหลือ", "phǒm tâwng-gaan khwaam chûay-lʉ̌a", "Tôi cần được giúp đỡ", "I need help"],
  ["พูดช้าๆ ได้ไหม", "phûut cháa-cháa dâi mǎi", "Nói chậm lại được không?", "Can you speak slowly?"],
  ["ผมโดนขโมย", "phǒm dohn khà-mooi", "Tôi bị trộm", "I've been robbed"],
];

// CLASSIFIER (ลักษณนาม) — vi/en describe what the classifier counts
const CLASSIFIERS: Entry[] = [
  ["คน", "khon", "người", "people"],
  ["ตัว", "tua", "động vật, áo, bàn ghế", "animals, clothes, tables/chairs"],
  ["อัน", "an", "vật nhỏ (chung)", "small generic objects"],
  ["ใบ", "bai", "vé, ly, lá, trái cây dẹt/tròn", "tickets, cups, leaves, flat/round items"],
  ["คัน", "khan", "xe cộ, ô / dù", "vehicles, umbrellas"],
  ["เล่ม", "lêm", "sách, dao", "books, knives"],
  ["ขวด", "khùat", "chai", "bottles"],
  ["แก้ว", "gâeo", "ly (đồ uống)", "drinking glasses"],
  ["จาน", "jaan", "đĩa / món ăn", "plates / dishes"],
  ["ลูก", "lûuk", "trái cây, quả bóng, vật tròn", "fruit, balls, round things"],
  ["ดอก", "dàwk", "hoa", "flowers"],
  ["ต้น", "tôn", "cây", "trees / plants"],
  ["เครื่อง", "khrʉ̂ang", "máy móc, thiết bị", "machines / appliances"],
  ["ห้อง", "hâwng", "phòng", "rooms"],
  ["คู่", "khûu", "đôi / cặp", "pairs"],
];

// PARTICLE — vi/en describe the function
const PARTICLES: Entry[] = [
  ["ครับ", "khráp", "tiểu từ lịch sự (nam)", "polite ending (male speaker)"],
  ["ค่ะ", "khâ", "tiểu từ lịch sự (nữ, câu khẳng định)", "polite ending (female, statement)"],
  ["คะ", "khá", "tiểu từ lịch sự (nữ, câu hỏi)", "polite ending (female, question)"],
  ["ไหม", "mǎi", "biến câu thành câu hỏi có/không", "turns a sentence into a yes/no question"],
  ["นะ", "ná", "làm câu dịu lại, thân thiện", "softens a sentence, friendly"],
  ["หรือ", "rʉ̌ʉ", "hoặc / hỏi xác nhận", "or / confirming question"],
  ["ด้วย", "dûay", "cũng / với / nhờ (làm dịu yêu cầu)", "also / too / softens a request"],
  ["หน่อย", "nòi", "một chút (làm dịu yêu cầu)", "a little (softens a request)"],
  ["เลย", "ləəi", "hoàn toàn / nhấn mạnh", "at all / emphasis"],
  ["สิ", "sì", "nhấn mạnh, khích lệ", "emphasis / encouragement"],
  ["แล้ว", "láeo", "đã (hoàn thành / quá khứ)", "already / past-completed marker"],
  ["จะ", "jà", "sẽ (tương lai)", "will / future marker"],
  ["กำลัง", "gam-lang", "đang (tiếp diễn)", "progressive 'in the middle of'"],
];

// WORD_ORDER — th is the correct Thai, vi/en is the meaning to assemble
const WORD_ORDER: Entry[] = [
  ["ผมกินข้าว", "phǒm gin khâao", "Tôi ăn cơm (Chủ–Động–Tân, giống tiếng Việt)", "I eat rice (Subject–Verb–Object)"],
  ["บ้านใหญ่", "bâan yài", "Nhà to (tính từ ĐỨNG SAU danh từ)", "Big house (adjective AFTER the noun)"],
  ["รถของผม", "rót khǎwng phǒm", "Xe của tôi (sở hữu: danh từ + ของ + người)", "My car (noun + ของ + owner)"],
  ["กาแฟสองแก้ว", "gaa-fae sǎwng gâeo", "Hai ly cà phê (danh từ + số + lượng từ)", "Two coffees (noun + number + classifier)"],
  ["ผมไม่กิน", "phǒm mâi gin", "Tôi không ăn (ไม่ đứng TRƯỚC động từ)", "I don't eat (ไม่ before the verb)"],
  ["เขาจะไป", "kháo jà pai", "Anh ấy sẽ đi (จะ = tương lai, trước động từ)", "He will go (จะ marks future)"],
  ["ผมกินแล้ว", "phǒm gin láeo", "Tôi ăn rồi (แล้ว = đã, ở cuối)", "I have eaten (แล้ว marks completion)"],
  ["คุณชอบอะไร", "khun châwp à-rai", "Bạn thích gì? (từ để hỏi giữ NGUYÊN vị trí)", "What do you like? (question word stays in place)"],
  ["หนังสือเล่มนี้", "nǎng-sʉ̌ʉ lêm níi", "Quyển sách này (danh từ + lượng từ + นี้)", "This book (noun + classifier + นี้)"],
  ["ผมไปตลาดเมื่อวาน", "phǒm pai tà-làat mʉ̂a-waan", "Hôm qua tôi đi chợ (thời gian thường ở cuối)", "I went to the market yesterday (time often at end)"],
  ["อาหารอร่อยมาก", "aa-hǎan à-ròi mâak", "Thức ăn rất ngon (มาก 'rất' đứng SAU tính từ)", "The food is very delicious (มาก 'very' AFTER the adjective)"],
  ["เขากำลังกินข้าว", "kháo gam-lang gin khâao", "Anh ấy đang ăn cơm (กำลัง = đang, trước động từ)", "He is eating (กำลัง marks the progressive)"],
];

// POLITENESS — th is the polite word/phrase, vi/en the intent
const POLITENESS: Entry[] = [
  ["ขอ...หน่อย", "khǎw ... nòi", "xin / cho tôi ... (yêu cầu lịch sự)", "may I have ... (polite request)"],
  ["กรุณา", "gà-rú-naa", "xin vui lòng (trang trọng, thường ở biển báo)", "please (formal, often on signs)"],
  ["ช่วย...หน่อย", "chûay ... nòi", "làm ơn giúp ...", "please help / kindly ..."],
  ["ขอบคุณมาก", "khàwp-khun mâak", "cảm ơn nhiều", "thank you very much"],
  ["ขอโทษครับ/ค่ะ", "khǎw-thôot khráp/khâ", "xin lỗi (lịch sự)", "sorry / excuse me (polite)"],
  ["ไม่เป็นไร", "mâi pen rai", "không sao / đừng bận tâm", "it's okay / you're welcome"],
  ["เชิญ", "chəən", "mời / xin mời (nhường lượt)", "please go ahead / you're welcome to"],
  ["พี่", "phîi", "anh/chị (gọi người lớn tuổi hơn, thân thiện)", "older sibling — address someone older politely"],
  ["น้อง", "náwng", "em (gọi người nhỏ tuổi hơn)", "younger sibling — address someone younger"],
  ["คุณ", "khun", "ông/bà/anh/chị (Mr/Ms, lịch sự, an toàn)", "Mr/Ms — safe polite 'you'"],
  ["ไหว้", "wâai", "chắp tay chào (cử chỉ kính trọng)", "the wâi — palms-together greeting of respect"],
  ["รบกวน", "róp-guan", "làm phiền ... (mở đầu yêu cầu lịch sự)", "sorry to trouble you ... (polite request opener)"],
];

// TONE_AWARENESS — minimal-pair sets; meaning hinges on the tone
const TONE_AWARENESS: Entry[] = [
  ["มา", "maa (thanh ngang)", "đến / tới", "to come"],
  ["ม้า", "máa (thanh cao)", "con ngựa", "horse"],
  ["หมา", "mǎa (thanh lên)", "con chó", "dog"],
  ["ไม่", "mâi (thanh xuống)", "không", "not / no"],
  ["ไม้", "mái (thanh cao)", "gỗ / cây", "wood"],
  ["ใหม่", "mài (thanh thấp)", "mới", "new"],
  ["ไหม", "mǎi (thanh lên)", "lụa / (tiểu từ hỏi)", "silk / (question particle)"],
  ["ข้าว", "khâao (thanh xuống)", "cơm", "rice"],
  ["ขาว", "khǎao (thanh lên)", "màu trắng", "white"],
  ["ข่าว", "khàao (thanh thấp)", "tin tức", "news"],
  ["เสือ", "sʉ̌a (thanh lên)", "con hổ", "tiger"],
  ["เสื้อ", "sʉ̂a (thanh xuống)", "áo", "shirt"],
  ["ใกล้", "glâi (thanh xuống)", "gần", "near"],
  ["ไกล", "glai (thanh ngang)", "xa", "far"],
  ["ป่า", "pàa (thanh thấp)", "rừng", "forest"],
  ["ป้า", "pâa (thanh xuống)", "bác / cô (chị của bố mẹ)", "aunt"],
];

// ── Assembled deck ───────────────────────────────────────────────────────

export const thaiReviewDeck: ThaiReviewCard[] = [
  ...build("vocab", "A1", VOCAB_NUMBERS, { withDistractors: true }),
  ...build("vocab", "A1", VOCAB_VERBS, { withDistractors: true }),
  ...build("vocab", "A1", VOCAB_ADJ, { withDistractors: true }),
  ...build("vocab", "A1", VOCAB_NOUNS, { withDistractors: true }),
  ...build("vocab", "A2", VOCAB_DAYS, { withDistractors: true }),
  ...build("phrase", "A1", PHRASES),
  ...build("survival_phrase", "A2", SURVIVAL),
  ...build("classifier", "A2", CLASSIFIERS, { withDistractors: true }),
  ...build("particle", "A2", PARTICLES, { withDistractors: true }),
  ...build("word_order", "B1", WORD_ORDER),
  ...build("politeness", "A2", POLITENESS),
  ...build("tone_awareness", "B1", TONE_AWARENESS, { withDistractors: true }),
];

/** Categories present in the deck (handy for filtered review sessions). */
export const THAI_REVIEW_CATEGORIES: ThaiReviewCategory[] = [
  "vocab",
  "phrase",
  "classifier",
  "particle",
  "word_order",
  "politeness",
  "survival_phrase",
  "tone_awareness",
];

export default thaiReviewDeck;
