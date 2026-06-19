// src/languages/thai/beginnerPhrasebook.ts
//
// Compact A1–A2 Thai phrasebook for Vietnamese-speaking and English-speaking
// learners.
//
// Self-contained PURE DATA: declares its own types inline and exports the
// phrase array. Vietnamese-first: every entry carries a Vietnamese meaning
// (`vi`) alongside English (`en`). Thai script is the source of truth; `rtgs`
// is a practical romanization (loose RTGS with tone hints where useful).
//
// Politeness particles ครับ (male) / ค่ะ (female) are shown where they matter;
// `polite` flags entries that already include a particle in the Thai.
//
// No audio, no scoring engine. Native-speaker review is DEFERRED — this
// phrasebook does NOT claim native review.

export type ThaiPhraseCategory =
  | "greeting"
  | "food"
  | "shopping"
  | "transport"
  | "hotel"
  | "help"
  | "yes_no"
  | "apology"
  | "thanks"
  | "numbers"
  | "directions"
  | "time";

export type ThaiPhrase = {
  id: string;
  category: ThaiPhraseCategory;
  /** Thai script — the line the learner speaks. */
  th: string;
  /** Practical romanization. */
  rtgs: string;
  /** Vietnamese meaning. */
  vi: string;
  /** English meaning. */
  en: string;
  /** True when the Thai already contains a politeness particle (ครับ/ค่ะ). */
  polite?: boolean;
  /** Optional short usage note (kept compact), bilingual. */
  note_vi?: string;
  note_en?: string;
};

export const beginnerPhrasebook: ThaiPhrase[] = [
  // ───────────────── greeting ─────────────────
  { id: "ph_greet_001", category: "greeting", th: "สวัสดีครับ", rtgs: "sà-wàt-dii khráp", vi: "Xin chào (nam).", en: "Hello (male speaker).", polite: true },
  { id: "ph_greet_002", category: "greeting", th: "สวัสดีค่ะ", rtgs: "sà-wàt-dii khâ", vi: "Xin chào (nữ).", en: "Hello (female speaker).", polite: true },
  { id: "ph_greet_003", category: "greeting", th: "สบายดีไหม", rtgs: "sà-baai-dii mǎi", vi: "Bạn khỏe không?", en: "How are you?" },
  { id: "ph_greet_004", category: "greeting", th: "สบายดี ขอบคุณ", rtgs: "sà-baai-dii khɔ̀ɔp-khun", vi: "Khỏe, cảm ơn.", en: "I'm fine, thank you." },
  { id: "ph_greet_005", category: "greeting", th: "แล้วคุณล่ะ", rtgs: "lɛ́ɛo khun lâ", vi: "Còn bạn thì sao?", en: "And you?" },
  { id: "ph_greet_006", category: "greeting", th: "ยินดีที่ได้รู้จัก", rtgs: "yin-dii thîi dâi rúu-jàk", vi: "Rất vui được làm quen.", en: "Nice to meet you." },
  { id: "ph_greet_007", category: "greeting", th: "คุณชื่ออะไร", rtgs: "khun chʉ̂ʉ à-rai", vi: "Bạn tên gì?", en: "What's your name?" },
  { id: "ph_greet_008", category: "greeting", th: "ผมชื่อ...", rtgs: "phǒm chʉ̂ʉ ...", vi: "Tôi tên là... (nam).", en: "My name is... (male)." },
  { id: "ph_greet_009", category: "greeting", th: "ดิฉันชื่อ...", rtgs: "dì-chǎn chʉ̂ʉ ...", vi: "Tôi tên là... (nữ).", en: "My name is... (female)." },
  { id: "ph_greet_010", category: "greeting", th: "ลาก่อน", rtgs: "laa-gɔ̀ɔn", vi: "Tạm biệt.", en: "Goodbye." },
  { id: "ph_greet_011", category: "greeting", th: "แล้วเจอกัน", rtgs: "lɛ́ɛo jəə gan", vi: "Hẹn gặp lại.", en: "See you." },
  { id: "ph_greet_012", category: "greeting", th: "ราตรีสวัสดิ์", rtgs: "raa-trii sà-wàt", vi: "Chúc ngủ ngon.", en: "Good night." },

  // ───────────────── food ─────────────────
  { id: "ph_food_001", category: "food", th: "หิวข้าว", rtgs: "hǐu khâao", vi: "Đói bụng.", en: "I'm hungry." },
  { id: "ph_food_002", category: "food", th: "ขอเมนูหน่อยครับ", rtgs: "khɔ̌ɔ mee-nuu nɔ̀i khráp", vi: "Cho xin thực đơn.", en: "May I have the menu?", polite: true },
  { id: "ph_food_003", category: "food", th: "ขอน้ำเปล่าหนึ่งแก้ว", rtgs: "khɔ̌ɔ náam-plàao nʉ̀ng gɛ̂ɛo", vi: "Cho một ly nước lọc.", en: "A glass of water, please." },
  { id: "ph_food_004", category: "food", th: "ไม่เผ็ดนะครับ", rtgs: "mâi phèt ná khráp", vi: "Đừng cay nhé.", en: "Not spicy, please.", polite: true },
  { id: "ph_food_005", category: "food", th: "เผ็ดนิดหน่อย", rtgs: "phèt nít-nɔ̀i", vi: "Cay một chút.", en: "A little spicy." },
  { id: "ph_food_006", category: "food", th: "อร่อยมาก", rtgs: "à-rɔ̀i mâak", vi: "Rất ngon.", en: "Very delicious." },
  { id: "ph_food_007", category: "food", th: "ขอข้าวเพิ่มหน่อย", rtgs: "khɔ̌ɔ khâao phə̂əm nɔ̀i", vi: "Cho thêm cơm.", en: "More rice, please." },
  { id: "ph_food_008", category: "food", th: "อันนี้คืออะไร", rtgs: "an-níi khʉʉ à-rai", vi: "Cái này là gì?", en: "What is this?" },
  { id: "ph_food_009", category: "food", th: "ผมกินมังสวิรัติ", rtgs: "phǒm gin mang-sà-wí-rát", vi: "Tôi ăn chay.", en: "I'm vegetarian." },
  { id: "ph_food_010", category: "food", th: "ขอกาแฟร้อนหนึ่งที่", rtgs: "khɔ̌ɔ gaa-fɛɛ rɔ́ɔn nʉ̀ng thîi", vi: "Cho một cà phê nóng.", en: "One hot coffee, please." },
  { id: "ph_food_011", category: "food", th: "ไม่ใส่น้ำตาล", rtgs: "mâi sài náam-taan", vi: "Không bỏ đường.", en: "No sugar." },
  { id: "ph_food_012", category: "food", th: "อิ่มแล้ว ขอบคุณ", rtgs: "ìm lɛ́ɛo khɔ̀ɔp-khun", vi: "No rồi, cảm ơn.", en: "I'm full, thanks." },
  { id: "ph_food_013", category: "food", th: "เก็บเงินด้วยครับ", rtgs: "gèp ngən dûay khráp", vi: "Tính tiền giúp tôi.", en: "Bill, please.", polite: true },
  { id: "ph_food_014", category: "food", th: "ขอใส่ถุงด้วย", rtgs: "khɔ̌ɔ sài thǔng dûay", vi: "Cho vào túi mang đi.", en: "To take away, please." },
  { id: "ph_food_015", category: "food", th: "มีอะไรแนะนำไหม", rtgs: "mii à-rai nɛ́-nam mǎi", vi: "Có món nào nên thử không?", en: "Anything you recommend?" },

  // ───────────────── shopping ─────────────────
  { id: "ph_shop_001", category: "shopping", th: "อันนี้เท่าไหร่", rtgs: "an-níi thâo-rài", vi: "Cái này bao nhiêu?", en: "How much is this?" },
  { id: "ph_shop_002", category: "shopping", th: "แพงไป", rtgs: "phɛɛng pai", vi: "Đắt quá.", en: "Too expensive." },
  { id: "ph_shop_003", category: "shopping", th: "ลดได้ไหม", rtgs: "lót dâi mǎi", vi: "Giảm được không?", en: "Can you lower the price?" },
  { id: "ph_shop_004", category: "shopping", th: "ลดหน่อยได้ไหมครับ", rtgs: "lót nɔ̀i dâi mǎi khráp", vi: "Giảm chút được không?", en: "Could you give a little discount?", polite: true },
  { id: "ph_shop_005", category: "shopping", th: "เอาอันนี้ครับ", rtgs: "ao an-níi khráp", vi: "Lấy cái này.", en: "I'll take this one.", polite: true },
  { id: "ph_shop_006", category: "shopping", th: "มีสีอื่นไหม", rtgs: "mii sǐi ʉ̀ʉn mǎi", vi: "Có màu khác không?", en: "Any other colours?" },
  { id: "ph_shop_007", category: "shopping", th: "มีไซส์ใหญ่กว่านี้ไหม", rtgs: "mii sái yài gwàa níi mǎi", vi: "Có cỡ lớn hơn không?", en: "A bigger size?" },
  { id: "ph_shop_008", category: "shopping", th: "ขอลองหน่อยได้ไหม", rtgs: "khɔ̌ɔ lɔɔng nɔ̀i dâi mǎi", vi: "Cho thử được không?", en: "May I try it on?" },
  { id: "ph_shop_009", category: "shopping", th: "จ่ายเงินสดได้ไหม", rtgs: "jàai ngən-sòt dâi mǎi", vi: "Trả tiền mặt được không?", en: "Can I pay cash?" },
  { id: "ph_shop_010", category: "shopping", th: "รับบัตรไหม", rtgs: "ráp bàt mǎi", vi: "Có nhận thẻ không?", en: "Do you take cards?" },
  { id: "ph_shop_011", category: "shopping", th: "ขอใบเสร็จด้วย", rtgs: "khɔ̌ɔ bai-sèt dûay", vi: "Cho xin hóa đơn.", en: "May I have a receipt?" },
  { id: "ph_shop_012", category: "shopping", th: "ไม่เอา ขอบคุณ", rtgs: "mâi ao khɔ̀ɔp-khun", vi: "Không lấy, cảm ơn.", en: "No thanks." },
  { id: "ph_shop_013", category: "shopping", th: "ดูเฉยๆ ครับ", rtgs: "duu chə̌əi-chə̌əi khráp", vi: "Chỉ xem thôi.", en: "Just looking, thanks.", polite: true },
  { id: "ph_shop_014", category: "shopping", th: "ทั้งหมดเท่าไหร่", rtgs: "tháng-mòt thâo-rài", vi: "Tất cả bao nhiêu?", en: "How much altogether?" },

  // ───────────────── transport ─────────────────
  { id: "ph_trans_001", category: "transport", th: "ไปสนามบินเท่าไหร่", rtgs: "pai sà-nǎam-bin thâo-rài", vi: "Đi sân bay bao nhiêu?", en: "How much to the airport?" },
  { id: "ph_trans_002", category: "transport", th: "ไปที่นี่ได้ไหม", rtgs: "pai thîi-nîi dâi mǎi", vi: "Đến chỗ này được không?", en: "Can you go here?" },
  { id: "ph_trans_003", category: "transport", th: "เปิดมิเตอร์ด้วยครับ", rtgs: "pəət mí-təə dûay khráp", vi: "Bật đồng hồ giúp.", en: "Use the meter, please.", polite: true },
  { id: "ph_trans_004", category: "transport", th: "จอดตรงนี้ครับ", rtgs: "jɔ̀ɔt trong-níi khráp", vi: "Dừng ở đây.", en: "Stop here, please.", polite: true },
  { id: "ph_trans_005", category: "transport", th: "ช้าๆ หน่อยครับ", rtgs: "cháa-cháa nɔ̀i khráp", vi: "Chạy chậm lại chút.", en: "Slow down, please.", polite: true },
  { id: "ph_trans_006", category: "transport", th: "รถไฟฟ้าไปทางไหน", rtgs: "rót-fai-fáa pai thaang-nǎi", vi: "Tàu điện đi hướng nào?", en: "Which way to the skytrain?" },
  { id: "ph_trans_007", category: "transport", th: "ป้ายต่อไปคืออะไร", rtgs: "pâai tɔ̀ɔ-pai khʉʉ à-rai", vi: "Trạm tiếp theo là gì?", en: "What's the next stop?" },
  { id: "ph_trans_008", category: "transport", th: "ลงที่ไหน", rtgs: "long thîi-nǎi", vi: "Xuống ở đâu?", en: "Where do I get off?" },
  { id: "ph_trans_009", category: "transport", th: "ขอตั๋วหนึ่งใบ", rtgs: "khɔ̌ɔ tǔa nʉ̀ng bai", vi: "Cho một vé.", en: "One ticket, please." },
  { id: "ph_trans_010", category: "transport", th: "รถออกกี่โมง", rtgs: "rót ɔ̀ɔk gìi moong", vi: "Xe chạy mấy giờ?", en: "What time does it leave?" },
  { id: "ph_trans_011", category: "transport", th: "ใช้เวลานานไหม", rtgs: "chái wee-laa naan mǎi", vi: "Mất nhiều thời gian không?", en: "Does it take long?" },
  { id: "ph_trans_012", category: "transport", th: "เรียกแท็กซี่ให้หน่อย", rtgs: "rîak thɛ́k-sîi hâi nɔ̀i", vi: "Gọi taxi giúp với.", en: "Please call a taxi." },

  // ───────────────── hotel ─────────────────
  { id: "ph_hotel_001", category: "hotel", th: "มีห้องว่างไหม", rtgs: "mii hɔ̂ng wâang mǎi", vi: "Còn phòng trống không?", en: "Do you have a room available?" },
  { id: "ph_hotel_002", category: "hotel", th: "ราคาห้องเท่าไหร่", rtgs: "raa-khaa hɔ̂ng thâo-rài", vi: "Giá phòng bao nhiêu?", en: "How much is the room?" },
  { id: "ph_hotel_003", category: "hotel", th: "ขอดูห้องก่อนได้ไหม", rtgs: "khɔ̌ɔ duu hɔ̂ng gɔ̀ɔn dâi mǎi", vi: "Cho xem phòng trước được không?", en: "May I see the room first?" },
  { id: "ph_hotel_004", category: "hotel", th: "มีไวไฟไหม", rtgs: "mii wai-fai mǎi", vi: "Có wifi không?", en: "Is there wifi?" },
  { id: "ph_hotel_005", category: "hotel", th: "เช็คอินกี่โมง", rtgs: "chék-in gìi moong", vi: "Nhận phòng mấy giờ?", en: "What time is check-in?" },
  { id: "ph_hotel_006", category: "hotel", th: "เช็คเอาท์กี่โมง", rtgs: "chék-áo gìi moong", vi: "Trả phòng mấy giờ?", en: "What time is check-out?" },
  { id: "ph_hotel_007", category: "hotel", th: "แอร์ไม่เย็น", rtgs: "ɛɛ mâi yen", vi: "Máy lạnh không mát.", en: "The AC isn't cold." },
  { id: "ph_hotel_008", category: "hotel", th: "ขอผ้าเช็ดตัวเพิ่ม", rtgs: "khɔ̌ɔ phâa-chét-tua phə̂əm", vi: "Cho thêm khăn tắm.", en: "More towels, please." },
  { id: "ph_hotel_009", category: "hotel", th: "กุญแจห้องหายครับ", rtgs: "gun-jɛɛ hɔ̂ng hǎai khráp", vi: "Tôi làm mất chìa khóa phòng.", en: "I lost my room key.", polite: true },
  { id: "ph_hotel_010", category: "hotel", th: "ขอเก็บกระเป๋าไว้ได้ไหม", rtgs: "khɔ̌ɔ gèp grà-pǎo wái dâi mǎi", vi: "Gửi hành lý lại được không?", en: "Can I leave my luggage here?" },
  { id: "ph_hotel_011", category: "hotel", th: "มีอาหารเช้าไหม", rtgs: "mii aa-hǎan-cháao mǎi", vi: "Có ăn sáng không?", en: "Is breakfast included?" },

  // ───────────────── help ─────────────────
  { id: "ph_help_001", category: "help", th: "ช่วยด้วย", rtgs: "chûay dûay", vi: "Cứu với!", en: "Help!" },
  { id: "ph_help_002", category: "help", th: "ช่วยหน่อยได้ไหมครับ", rtgs: "chûay nɔ̀i dâi mǎi khráp", vi: "Giúp tôi một chút được không?", en: "Could you help me?", polite: true },
  { id: "ph_help_003", category: "help", th: "ผมหลงทาง", rtgs: "phǒm lǒng-thaang", vi: "Tôi bị lạc đường.", en: "I'm lost." },
  { id: "ph_help_004", category: "help", th: "ผมไม่เข้าใจ", rtgs: "phǒm mâi khâo-jai", vi: "Tôi không hiểu.", en: "I don't understand." },
  { id: "ph_help_005", category: "help", th: "พูดช้าๆ ได้ไหม", rtgs: "phûut cháa-cháa dâi mǎi", vi: "Nói chậm được không?", en: "Can you speak slowly?" },
  { id: "ph_help_006", category: "help", th: "พูดอีกครั้งได้ไหม", rtgs: "phûut ìik khráng dâi mǎi", vi: "Nói lại lần nữa được không?", en: "Can you say that again?" },
  { id: "ph_help_007", category: "help", th: "คุณพูดอังกฤษได้ไหม", rtgs: "khun phûut ang-grìt dâi mǎi", vi: "Bạn nói được tiếng Anh không?", en: "Do you speak English?" },
  { id: "ph_help_008", category: "help", th: "เรียกหมอด้วย", rtgs: "rîak mɔ̌ɔ dûay", vi: "Gọi bác sĩ giúp.", en: "Please call a doctor." },
  { id: "ph_help_009", category: "help", th: "เรียกตำรวจด้วย", rtgs: "rîak tam-rùat dûay", vi: "Gọi cảnh sát giúp.", en: "Please call the police." },
  { id: "ph_help_010", category: "help", th: "โรงพยาบาลอยู่ที่ไหน", rtgs: "roong-phá-yaa-baan yùu thîi-nǎi", vi: "Bệnh viện ở đâu?", en: "Where is the hospital?" },
  { id: "ph_help_011", category: "help", th: "ผมไม่สบาย", rtgs: "phǒm mâi sà-baai", vi: "Tôi không khỏe.", en: "I'm not feeling well." },
  { id: "ph_help_012", category: "help", th: "เขียนให้หน่อยได้ไหม", rtgs: "khǐan hâi nɔ̀i dâi mǎi", vi: "Viết ra giúp được không?", en: "Could you write it down?" },

  // ───────────────── yes_no ─────────────────
  { id: "ph_yn_001", category: "yes_no", th: "ใช่", rtgs: "châi", vi: "Đúng / Phải.", en: "Yes (correct)." },
  { id: "ph_yn_002", category: "yes_no", th: "ไม่ใช่", rtgs: "mâi châi", vi: "Không phải.", en: "No (not correct)." },
  { id: "ph_yn_003", category: "yes_no", th: "ได้", rtgs: "dâi", vi: "Được.", en: "Yes, can / okay." },
  { id: "ph_yn_004", category: "yes_no", th: "ไม่ได้", rtgs: "mâi dâi", vi: "Không được.", en: "Cannot / not allowed." },
  { id: "ph_yn_005", category: "yes_no", th: "มี", rtgs: "mii", vi: "Có.", en: "Yes, (I) have." },
  { id: "ph_yn_006", category: "yes_no", th: "ไม่มี", rtgs: "mâi mii", vi: "Không có.", en: "Don't have." },
  { id: "ph_yn_007", category: "yes_no", th: "เอา", rtgs: "ao", vi: "Lấy / Muốn.", en: "Yes, I want it." },
  { id: "ph_yn_008", category: "yes_no", th: "ไม่เอา", rtgs: "mâi ao", vi: "Không lấy.", en: "No, I don't want it." },
  { id: "ph_yn_009", category: "yes_no", th: "โอเค", rtgs: "oo-khee", vi: "Được / OK.", en: "Okay." },
  { id: "ph_yn_010", category: "yes_no", th: "ไม่เป็นไร", rtgs: "mâi pen rai", vi: "Không sao.", en: "It's okay / no problem." },
  { id: "ph_yn_011", category: "yes_no", th: "อาจจะ", rtgs: "àat-jà", vi: "Có lẽ.", en: "Maybe." },
  { id: "ph_yn_012", category: "yes_no", th: "ไม่รู้", rtgs: "mâi rúu", vi: "Không biết.", en: "I don't know." },

  // ───────────────── apology ─────────────────
  { id: "ph_apo_001", category: "apology", th: "ขอโทษครับ", rtgs: "khɔ̌ɔ-thôot khráp", vi: "Xin lỗi (nam).", en: "Sorry (male).", polite: true },
  { id: "ph_apo_002", category: "apology", th: "ขอโทษค่ะ", rtgs: "khɔ̌ɔ-thôot khâ", vi: "Xin lỗi (nữ).", en: "Sorry (female).", polite: true },
  { id: "ph_apo_003", category: "apology", th: "ขอโทษที่มาสาย", rtgs: "khɔ̌ɔ-thôot thîi maa sǎai", vi: "Xin lỗi vì đến muộn.", en: "Sorry I'm late." },
  { id: "ph_apo_004", category: "apology", th: "ขอทางหน่อยครับ", rtgs: "khɔ̌ɔ thaang nɔ̀i khráp", vi: "Cho tôi qua chút (xin nhường đường).", en: "Excuse me (let me through).", polite: true },
  { id: "ph_apo_005", category: "apology", th: "ขอโทษ รบกวนหน่อย", rtgs: "khɔ̌ɔ-thôot róp-guan nɔ̀i", vi: "Xin lỗi, làm phiền một chút.", en: "Excuse me, may I trouble you?" },
  { id: "ph_apo_006", category: "apology", th: "ผมผิดเอง", rtgs: "phǒm phìt eeng", vi: "Là lỗi của tôi.", en: "It's my fault." },
  { id: "ph_apo_007", category: "apology", th: "ไม่ได้ตั้งใจ", rtgs: "mâi dâi tâng-jai", vi: "Tôi không cố ý.", en: "I didn't mean to." },
  { id: "ph_apo_008", category: "apology", th: "เสียใจด้วยนะ", rtgs: "sǐa-jai dûay ná", vi: "Tôi rất tiếc / chia buồn.", en: "I'm sorry (sympathy)." },

  // ───────────────── thanks ─────────────────
  { id: "ph_thx_001", category: "thanks", th: "ขอบคุณครับ", rtgs: "khɔ̀ɔp-khun khráp", vi: "Cảm ơn (nam).", en: "Thank you (male).", polite: true },
  { id: "ph_thx_002", category: "thanks", th: "ขอบคุณค่ะ", rtgs: "khɔ̀ɔp-khun khâ", vi: "Cảm ơn (nữ).", en: "Thank you (female).", polite: true },
  { id: "ph_thx_003", category: "thanks", th: "ขอบคุณมากครับ", rtgs: "khɔ̀ɔp-khun mâak khráp", vi: "Cảm ơn nhiều (nam).", en: "Thank you very much (male).", polite: true },
  { id: "ph_thx_004", category: "thanks", th: "ขอบใจ", rtgs: "khɔ̀ɔp-jai", vi: "Cảm ơn (với người nhỏ tuổi/thân).", en: "Thanks (to someone younger/close)." },
  { id: "ph_thx_005", category: "thanks", th: "ขอบคุณสำหรับทุกอย่าง", rtgs: "khɔ̀ɔp-khun sǎm-ràp thúk yàang", vi: "Cảm ơn vì mọi thứ.", en: "Thanks for everything." },
  { id: "ph_thx_006", category: "thanks", th: "ด้วยความยินดี", rtgs: "dûay khwaam yin-dii", vi: "Rất hân hạnh / không có gì.", en: "You're welcome / my pleasure." },
  { id: "ph_thx_007", category: "thanks", th: "ขอบคุณที่ช่วย", rtgs: "khɔ̀ɔp-khun thîi chûay", vi: "Cảm ơn đã giúp.", en: "Thanks for your help." },

  // ───────────────── numbers ─────────────────
  { id: "ph_num_001", category: "numbers", th: "ศูนย์", rtgs: "sǔun", vi: "Số 0.", en: "Zero." },
  { id: "ph_num_002", category: "numbers", th: "หนึ่ง", rtgs: "nʉ̀ng", vi: "Số 1.", en: "One." },
  { id: "ph_num_003", category: "numbers", th: "สอง", rtgs: "sɔ̌ɔng", vi: "Số 2.", en: "Two." },
  { id: "ph_num_004", category: "numbers", th: "สาม", rtgs: "sǎam", vi: "Số 3.", en: "Three." },
  { id: "ph_num_005", category: "numbers", th: "สี่", rtgs: "sìi", vi: "Số 4.", en: "Four." },
  { id: "ph_num_006", category: "numbers", th: "ห้า", rtgs: "hâa", vi: "Số 5.", en: "Five." },
  { id: "ph_num_007", category: "numbers", th: "หก", rtgs: "hòk", vi: "Số 6.", en: "Six." },
  { id: "ph_num_008", category: "numbers", th: "เจ็ด", rtgs: "jèt", vi: "Số 7.", en: "Seven." },
  { id: "ph_num_009", category: "numbers", th: "แปด", rtgs: "pɛ̀ɛt", vi: "Số 8.", en: "Eight." },
  { id: "ph_num_010", category: "numbers", th: "เก้า", rtgs: "gâo", vi: "Số 9.", en: "Nine." },
  { id: "ph_num_011", category: "numbers", th: "สิบ", rtgs: "sìp", vi: "Số 10.", en: "Ten." },
  { id: "ph_num_012", category: "numbers", th: "ยี่สิบ", rtgs: "yîi-sìp", vi: "Số 20.", en: "Twenty.", note_vi: "20 dùng ยี่ chứ không phải สอง.", note_en: "20 uses ยี่, not สอง." },
  { id: "ph_num_013", category: "numbers", th: "หนึ่งร้อย", rtgs: "nʉ̀ng-rɔ́ɔy", vi: "Số 100.", en: "One hundred." },
  { id: "ph_num_014", category: "numbers", th: "หนึ่งพัน", rtgs: "nʉ̀ng-phan", vi: "Số 1000.", en: "One thousand." },
  { id: "ph_num_015", category: "numbers", th: "ครึ่ง", rtgs: "khrʉ̂ng", vi: "Một nửa.", en: "Half." },

  // ───────────────── directions ─────────────────
  { id: "ph_dir_001", category: "directions", th: "...อยู่ที่ไหน", rtgs: "... yùu thîi-nǎi", vi: "... ở đâu?", en: "Where is ...?" },
  { id: "ph_dir_002", category: "directions", th: "ห้องน้ำอยู่ที่ไหน", rtgs: "hɔ̂ng-náam yùu thîi-nǎi", vi: "Nhà vệ sinh ở đâu?", en: "Where is the toilet?" },
  { id: "ph_dir_003", category: "directions", th: "เลี้ยวซ้าย", rtgs: "líao sáai", vi: "Rẽ trái.", en: "Turn left." },
  { id: "ph_dir_004", category: "directions", th: "เลี้ยวขวา", rtgs: "líao khwǎa", vi: "Rẽ phải.", en: "Turn right." },
  { id: "ph_dir_005", category: "directions", th: "ตรงไป", rtgs: "trong-pai", vi: "Đi thẳng.", en: "Go straight." },
  { id: "ph_dir_006", category: "directions", th: "อยู่ใกล้ๆ", rtgs: "yùu glâi-glâi", vi: "Ở gần đây.", en: "It's nearby." },
  { id: "ph_dir_007", category: "directions", th: "อยู่ไกลไหม", rtgs: "yùu glai mǎi", vi: "Có xa không?", en: "Is it far?" },
  { id: "ph_dir_008", category: "directions", th: "ไป...ยังไง", rtgs: "pai ... yang-ngai", vi: "Đi đến ... thế nào?", en: "How do I get to ...?" },
  { id: "ph_dir_009", category: "directions", th: "อยู่ตรงหัวมุม", rtgs: "yùu trong hǔa-mum", vi: "Ở ngay góc đường.", en: "It's at the corner." },
  { id: "ph_dir_010", category: "directions", th: "ข้ามถนน", rtgs: "khâam thà-nǒn", vi: "Băng qua đường.", en: "Cross the road." },
  { id: "ph_dir_011", category: "directions", th: "อยู่ฝั่งตรงข้าม", rtgs: "yùu fàng trong-khâam", vi: "Ở phía đối diện.", en: "It's on the opposite side." },
  { id: "ph_dir_012", category: "directions", th: "ชี้ให้ดูหน่อยได้ไหม", rtgs: "chíi hâi duu nɔ̀i dâi mǎi", vi: "Chỉ giúp tôi được không?", en: "Could you point the way?" },

  // ───────────────── time ─────────────────
  { id: "ph_time_001", category: "time", th: "ตอนนี้กี่โมง", rtgs: "tɔɔn-níi gìi moong", vi: "Bây giờ mấy giờ?", en: "What time is it now?" },
  { id: "ph_time_002", category: "time", th: "วันนี้", rtgs: "wan-níi", vi: "Hôm nay.", en: "Today." },
  { id: "ph_time_003", category: "time", th: "พรุ่งนี้", rtgs: "phrûng-níi", vi: "Ngày mai.", en: "Tomorrow." },
  { id: "ph_time_004", category: "time", th: "เมื่อวาน", rtgs: "mʉ̂a-waan", vi: "Hôm qua.", en: "Yesterday." },
  { id: "ph_time_005", category: "time", th: "ตอนเช้า", rtgs: "tɔɔn-cháao", vi: "Buổi sáng.", en: "Morning." },
  { id: "ph_time_006", category: "time", th: "ตอนบ่าย", rtgs: "tɔɔn-bàai", vi: "Buổi chiều.", en: "Afternoon." },
  { id: "ph_time_007", category: "time", th: "ตอนเย็น", rtgs: "tɔɔn-yen", vi: "Buổi tối (sớm).", en: "Evening." },
  { id: "ph_time_008", category: "time", th: "ตอนกลางคืน", rtgs: "tɔɔn glaang-khʉʉn", vi: "Ban đêm.", en: "Night." },
  { id: "ph_time_009", category: "time", th: "เดี๋ยวนี้", rtgs: "dǐao-níi", vi: "Ngay bây giờ.", en: "Right now." },
  { id: "ph_time_010", category: "time", th: "สักครู่", rtgs: "sàk-khrûu", vi: "Một lát.", en: "A moment." },
  { id: "ph_time_011", category: "time", th: "รอสักครู่นะครับ", rtgs: "rɔɔ sàk-khrûu ná khráp", vi: "Đợi một chút nhé.", en: "Please wait a moment.", polite: true },
  { id: "ph_time_012", category: "time", th: "กี่โมงเปิด", rtgs: "gìi moong pəət", vi: "Mấy giờ mở cửa?", en: "What time does it open?" },
  { id: "ph_time_013", category: "time", th: "กี่โมงปิด", rtgs: "gìi moong pìt", vi: "Mấy giờ đóng cửa?", en: "What time does it close?" },
  { id: "ph_time_014", category: "time", th: "วันจันทร์", rtgs: "wan-jan", vi: "Thứ Hai.", en: "Monday." },
  { id: "ph_time_015", category: "time", th: "วันอาทิตย์", rtgs: "wan-aa-thít", vi: "Chủ nhật.", en: "Sunday." },
];

export default beginnerPhrasebook;
