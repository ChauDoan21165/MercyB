// src/languages/thai/conversationRepair.ts
//
// Thai conversation-repair phrases — what to say when you DON'T understand, or
// when you've been misunderstood. Built by the A3 agent (Wave 6).
//
// "Repair" is the survival layer of speaking a second language: the moves that
// keep a conversation alive when comprehension breaks down — asking someone to
// repeat, slow down, simplify, confirm meaning, fix a misunderstanding, write
// it down, give an example, or politely admit your Thai is limited.
//
// Each entry: the phrase in Thai script + romanization, Vietnamese AND English
// glosses, a "when to use" note, and a polite-particle note — because in Thai,
// whether a repair phrase lands as polite or blunt depends almost entirely on
// the sentence-final particle (ครับ for male speakers, ค่ะ for female; ค่ะ
// becomes คะ on a question). Repair phrases are face-threatening by nature, so
// the particle is not optional.
//
// Self-contained: the Thai vertical has no shared phrasebook registry yet, so
// the types live here. Native review is DEFERRED — register and particle
// choices are provisional; no native authority is claimed.

// ── Types ───────────────────────────────────────────────────────────────────

export type ThaiRepairTopic =
  | "ask_repeat"
  | "slower_speech"
  | "simpler_words"
  | "confirm_meaning"
  | "correct_misunderstanding"
  | "ask_to_write"
  | "ask_for_example"
  | "admit_limited_thai";

export type ThaiRepairItem = {
  id: string;
  topic: ThaiRepairTopic;
  /** The repair phrase, Thai script. */
  phrase_th: string;
  phrase_rtgs: string;
  phrase_vi: string;
  phrase_en: string;
  /** When/why to use this phrase. */
  when_to_use_vi: string;
  when_to_use_en: string;
  /** Polite-particle guidance for this phrase (ครับ/ค่ะ/คะ). */
  polite_particle_note_vi: string;
  polite_particle_note_en: string;
};

// Compact builder.
function card(
  id: string,
  topic: ThaiRepairTopic,
  phrase: [string, string, string, string],
  when: [string, string],
  particle: [string, string],
): ThaiRepairItem {
  return {
    id,
    topic,
    phrase_th: phrase[0],
    phrase_rtgs: phrase[1],
    phrase_vi: phrase[2],
    phrase_en: phrase[3],
    when_to_use_vi: when[0],
    when_to_use_en: when[1],
    polite_particle_note_vi: particle[0],
    polite_particle_note_en: particle[1],
  };
}

// Reusable particle notes (kept varied but consistent).
const PQ: [string, string] = [
  "Thêm 'ครับ' (nam) / 'คะ' (nữ) cuối câu hỏi để lịch sự — nữ dùng 'คะ' thanh cao khi hỏi.",
  "End the question with 'ครับ' (male) / 'คะ' (female, high tone on questions) to stay polite.",
];
const PS: [string, string] = [
  "Thêm 'ครับ' (nam) / 'ค่ะ' (nữ) cuối câu khẳng định để mềm mại, lịch sự.",
  "End the statement with 'ครับ' (male) / 'ค่ะ' (female) to soften and stay polite.",
];

// ── Ask to repeat ────────────────────────────────────────────────────────────

const askRepeat: ThaiRepairItem[] = [
  card("thai_rep_repeat_again", "ask_repeat",
    ["พูดอีกครั้งได้ไหม", "phûut ìik khráng dâai mái", "Nói lại lần nữa được không?", "Could you say that again?"],
    ["Khi bạn không nghe rõ và muốn nghe lại toàn bộ.", "When you didn't catch it and want the whole thing again."],
    PQ),
  card("thai_rep_repeat_notheard", "ask_repeat",
    ["ขอโทษ ไม่ได้ยินครับ", "khǎaw-thôot, mâi dâai-yin khráp", "Xin lỗi, tôi không nghe rõ.", "Sorry, I didn't hear that."],
    ["Khi tiếng ồn hoặc nói nhỏ khiến bạn không nghe được.", "When noise or a quiet voice meant you couldn't hear."],
    PS),
  card("thai_rep_repeat_what", "ask_repeat",
    ["อะไรนะคะ", "à-rai ná khá", "Dạ gì cơ ạ?", "Sorry, what was that?"],
    ["Câu 'huh?' lịch sự — luôn kèm 'นะ' + tiểu từ, đừng nói trống không.", "The polite 'huh?' — always with 'นะ' + a particle, never bare."],
    ["BẮT BUỘC có 'ครับ/คะ': 'อะไรนะ' trống không nghe cộc lốc. Nam 'อะไรนะครับ', nữ 'อะไรนะคะ'.",
     "The particle is essential: bare 'อะไรนะ' sounds curt. Male 'อะไรนะครับ', female 'อะไรนะคะ'."]),
  card("thai_rep_repeat_oncemore", "ask_repeat",
    ["ขอฟังอีกทีได้ไหม", "khǎaw fang ìik thii dâai mái", "Cho tôi nghe lại một lần nữa được không?", "May I hear it one more time?"],
    ["Khi bạn muốn được nghe lại để xác nhận.", "When you want to listen once more to be sure."],
    PQ),
  card("thai_rep_repeat_justnow", "ask_repeat",
    ["เมื่อกี้พูดว่าอะไรนะครับ", "mûea-gîi phûut wâa à-rai ná khráp", "Vừa nãy bạn nói gì vậy ạ?", "What did you say just now?"],
    ["Khi bạn lỡ mất câu vừa rồi và muốn hỏi lại cụ thể.", "When you missed what was said a moment ago."],
    ["'นะครับ/นะคะ' làm câu hỏi mềm hơn hẳn so với chỉ 'ครับ/คะ'.",
     "'นะครับ/นะคะ' softens the question noticeably more than a plain particle."]),
  card("thai_rep_repeat_slowrepeat", "ask_repeat",
    ["ช่วยพูดซ้ำได้ไหม", "chûay phûut sám dâai mái", "Làm ơn nhắc lại được không?", "Could you repeat that, please?"],
    ["'ช่วย' mở đầu lời nhờ; 'ซ้ำ' = lặp lại.", "'ช่วย' opens a request; 'ซ้ำ' = repeat."],
    PQ),
  card("thai_rep_repeat_anew", "ask_repeat",
    ["พูดใหม่ได้ไหมครับ", "phûut mài dâai mái khráp", "Nói lại từ đầu được không ạ?", "Could you say it again from the start?"],
    ["Khi cả câu rối và bạn muốn nghe lại từ đầu.", "When the whole utterance was muddled and you want a fresh start."],
    PQ),
];

// ── Slower speech ─────────────────────────────────────────────────────────────

const slower: ThaiRepairItem[] = [
  card("thai_rep_slow_slowly", "slower_speech",
    ["พูดช้าๆ ได้ไหม", "phûut cháa-cháa dâai mái", "Nói chậm chậm được không?", "Could you speak slowly?"],
    ["Câu cốt lõi khi người ta nói quá nhanh.", "The core line when someone speaks too fast."],
    PQ),
  card("thai_rep_slow_slowdown", "slower_speech",
    ["ช่วยพูดช้าลงหน่อยครับ", "chûay phûut cháa long nàauy khráp", "Làm ơn nói chậm lại một chút.", "Please slow down a little."],
    ["'ช้าลง' = chậm lại (so với hiện tại); 'หน่อย' làm mềm.", "'ช้าลง' = slow down (from current pace); 'หน่อย' softens."],
    PS),
  card("thai_rep_slow_toofast", "slower_speech",
    ["เร็วไปครับ พูดช้าๆ ได้ไหม", "reo bpai khráp, phûut cháa-cháa dâai mái", "Nhanh quá ạ, nói chậm được không?", "That's too fast — could you speak slowly?"],
    ["Khi bạn muốn nói rõ là 'nhanh quá' trước khi xin chậm lại.", "When you want to signal 'too fast' before asking them to slow."],
    PQ),
  card("thai_rep_slow_wordbyword", "slower_speech",
    ["พูดทีละคำได้ไหมคะ", "phûut thii-lá kham dâai mái khá", "Nói từng từ một được không ạ?", "Could you say it word by word?"],
    ["Khi bạn cần tách từng từ để nghe ra.", "When you need each word separated to make it out."],
    PQ),
  card("thai_rep_slow_slowerthan", "slower_speech",
    ["ช้ากว่านี้ได้ไหมครับ", "cháa gwàa níi dâai mái khráp", "Chậm hơn nữa được không ạ?", "Could you go slower than that?"],
    ["Khi vẫn còn nhanh dù họ đã chậm lại một chút.", "When it's still fast even after they slowed a bit."],
    PQ),
  card("thai_rep_slow_simpleslow", "slower_speech",
    ["ขอแบบช้าๆ ได้ไหม", "khǎaw bàaep cháa-cháa dâai mái", "Cho kiểu chậm chậm được không?", "Could I get that slowly?"],
    ["'ขอแบบ...' = xin theo kiểu... — cách nhờ nhẹ nhàng.", "'ขอแบบ…' = 'may I have it in a … way' — a gentle request frame."],
    PQ),
  card("thai_rep_slow_takeyourtime", "slower_speech",
    ["ใจเย็นๆ พูดช้าๆ นะครับ", "jai-yen-yen, phûut cháa-cháa ná khráp", "Cứ từ từ, nói chậm chậm nhé.", "Take your time, speak slowly."],
    ["Khi muốn trấn an người nói rằng không cần vội.", "When reassuring the speaker there's no rush."],
    ["'นะครับ/นะคะ' giữ giọng thân thiện; bỏ tiểu từ dễ nghe như ra lệnh.",
     "'นะครับ/นะคะ' keeps it friendly; without a particle it can sound like an order."]),
];

// ── Simpler words ─────────────────────────────────────────────────────────────

const simpler: ThaiRepairItem[] = [
  card("thai_rep_simple_easier", "simpler_words",
    ["พูดให้ง่ายกว่านี้ได้ไหม", "phûut hâi ngâai gwàa níi dâai mái", "Nói dễ hơn được không?", "Could you say it more simply?"],
    ["Khi câu dùng từ khó, muốn diễn đạt đơn giản hơn.", "When the wording is hard and you want it simpler."],
    PQ),
  card("thai_rep_simple_easierword", "simpler_words",
    ["มีคำที่ง่ายกว่านี้ไหมครับ", "mii kham thîi ngâai gwàa níi mái khráp", "Có từ nào dễ hơn không ạ?", "Is there an easier word for it?"],
    ["Khi một từ cụ thể quá khó, xin từ đồng nghĩa dễ hơn.", "When one word is too hard and you want an easier synonym."],
    PQ),
  card("thai_rep_simple_dontknowword", "simpler_words",
    ["ผมไม่เข้าใจคำนี้ครับ", "phǒm mâi khâo-jai kham níi khráp", "Tôi không hiểu từ này.", "I don't understand this word."],
    ["Khi bạn nghe được từ nhưng không biết nghĩa.", "When you caught the word but don't know its meaning."],
    PS),
  card("thai_rep_simple_whatmeans", "simpler_words",
    ["คำนี้แปลว่าอะไรคะ", "kham níi bplaae wâa à-rai khá", "Từ này nghĩa là gì ạ?", "What does this word mean?"],
    ["'แปลว่า' = có nghĩa là / dịch là.", "'แปลว่า' = means / translates as."],
    PQ),
  card("thai_rep_simple_explainsimply", "simpler_words",
    ["อธิบายแบบง่ายๆ ได้ไหมครับ", "à-thí-baai bàaep ngâai-ngâai dâai mái khráp", "Giải thích đơn giản được không ạ?", "Could you explain it simply?"],
    ["Khi cần giải thích lại bằng cách dễ hiểu hơn.", "When you need it re-explained in plainer terms."],
    PQ),
  card("thai_rep_simple_plainwords", "simpler_words",
    ["ใช้คำธรรมดาได้ไหม", "chái kham tham-má-daa dâai mái", "Dùng từ thông thường được không?", "Could you use everyday words?"],
    ["Khi đối phương dùng từ trang trọng/chuyên môn.", "When the other person uses formal or technical words."],
    PQ),
  card("thai_rep_simple_inenglish", "simpler_words",
    ["พูดเป็นภาษาอังกฤษได้ไหมครับ", "phûut bpen phaa-sǎa ang-grìt dâai mái khráp", "Nói bằng tiếng Anh được không ạ?", "Could you say it in English?"],
    ["Phương án cuối khi tiếng Thái quá khó với một ý.", "A fallback when the Thai is too hard for one point."],
    PQ),
];

// ── Confirm meaning ───────────────────────────────────────────────────────────

const confirm: ThaiRepairItem[] = [
  card("thai_rep_confirm_whatmeans", "confirm_meaning",
    ["หมายความว่าอะไรครับ", "mǎai-khwaam wâa à-rai khráp", "Có nghĩa là gì ạ?", "What does that mean?"],
    ["Hỏi nghĩa của cả một câu/ý, không chỉ một từ.", "Asking the meaning of a whole phrase, not just a word."],
    PQ),
  card("thai_rep_confirm_meansright", "confirm_meaning",
    ["หมายความว่า...ใช่ไหมครับ", "mǎai-khwaam wâa … châi mái khráp", "Nghĩa là... phải không ạ?", "It means … right?"],
    ["Khi bạn đoán nghĩa và muốn xác nhận.", "When you've guessed the meaning and want confirmation."],
    ["Câu xác nhận dùng '...ใช่ไหม' + 'ครับ/คะ'. Nó giả định câu trả lời là 'đúng'.",
     "Confirmation uses '…ใช่ไหม' + 'ครับ/คะ'; it assumes the answer is 'yes'."]),
  card("thai_rep_confirm_translateright", "confirm_meaning",
    ["แปลว่า...ใช่ไหมคะ", "bplaae wâa … châi mái khá", "Dịch là... đúng không ạ?", "It translates as … is that right?"],
    ["Khi kiểm tra cách hiểu nghĩa của một từ.", "When checking your understanding of a word's meaning."],
    PQ),
  card("thai_rep_confirm_youmean", "confirm_meaning",
    ["คุณหมายถึง...หรือเปล่าครับ", "khun mǎai-thǔeng … rǔe-bplào khráp", "Ý bạn là... đúng không ạ?", "Do you mean …?"],
    ["'หรือเปล่า' = hay không — hỏi xác nhận trung lập.", "'หรือเปล่า' = 'or not' — a neutral confirmation tag."],
    PQ),
  card("thai_rep_confirm_understandright", "confirm_meaning",
    ["ผมเข้าใจถูกไหมครับ", "phǒm khâo-jai thùuk mái khráp", "Tôi hiểu đúng không ạ?", "Did I understand correctly?"],
    ["Sau khi nhắc lại ý mình hiểu, hỏi xem đúng chưa.", "After paraphrasing, asking whether you got it right."],
    PQ),
  card("thai_rep_confirm_sosummary", "confirm_meaning",
    ["สรุปว่า...ใช่ไหมครับ", "sà-rùp wâa … châi mái khráp", "Tóm lại là... phải không ạ?", "So in short, … right?"],
    ["Khi tóm tắt lại điều vừa nghe để chốt.", "When summarizing what you heard to lock it in."],
    PQ),
  card("thai_rep_confirm_thisone", "confirm_meaning",
    ["อันนี้ใช่ไหมครับ", "an níi châi mái khráp", "Cái này đúng không ạ?", "Is it this one?"],
    ["Khi vừa chỉ vừa hỏi để xác nhận đúng thứ/ý.", "When pointing and asking to confirm the right thing."],
    PQ),
];

// ── Correct a misunderstanding ────────────────────────────────────────────────

const correct: ThaiRepairItem[] = [
  card("thai_rep_correct_notlikethat", "correct_misunderstanding",
    ["ไม่ใช่อย่างนั้นครับ", "mâi châi yàang nán khráp", "Không phải như vậy ạ.", "It's not like that."],
    ["Khi đối phương hiểu sai ý bạn.", "When the other person has misread your meaning."],
    ["'ครับ/ค่ะ' rất quan trọng ở câu phủ định — không có, dễ nghe gắt.",
     "'ครับ/ค่ะ' matters most on a negation — without it, the line can sound sharp."]),
  card("thai_rep_correct_imean", "correct_misunderstanding",
    ["ผมหมายถึง...ครับ", "phǒm mǎai-thǔeng … khráp", "Ý tôi là...", "I mean …"],
    ["Để nói lại ý mình cho rõ sau khi bị hiểu nhầm.", "To restate your point clearly after a misunderstanding."],
    PS),
  card("thai_rep_correct_misspoke", "correct_misunderstanding",
    ["ขอโทษ ผมพูดผิดครับ", "khǎaw-thôot, phǒm phûut phìt khráp", "Xin lỗi, tôi nói nhầm.", "Sorry, I misspoke."],
    ["Khi chính bạn nói sai và muốn sửa.", "When you yourself said it wrong and want to fix it."],
    PS),
  card("thai_rep_correct_imisunderstood", "correct_misunderstanding",
    ["ผมเข้าใจผิดเองครับ", "phǒm khâo-jai phìt eeng khráp", "Tôi đã hiểu nhầm.", "I misunderstood."],
    ["Khi nhận là mình hiểu sai (giữ thể diện cho đôi bên).", "When owning that you misunderstood (saves face all round)."],
    PS),
  card("thai_rep_correct_no_imean", "correct_misunderstanding",
    ["ไม่ใช่ครับ ผมหมายถึง...", "mâi châi khráp, phǒm mǎai-thǔeng …", "Không phải ạ, ý tôi là...", "No, I mean …"],
    ["Phủ định nhẹ rồi nêu lại ý đúng.", "A soft 'no' followed by the intended meaning."],
    ["Đặt 'ครับ/ค่ะ' ngay sau 'ไม่ใช่' để giảm cảm giác phản bác.",
     "Put 'ครับ/ค่ะ' right after 'ไม่ใช่' to soften the contradiction."]),
  card("thai_rep_correct_letmefix", "correct_misunderstanding",
    ["ขอแก้ใหม่นะครับ", "khǎaw gâae mài ná khráp", "Cho tôi sửa lại nhé.", "Let me correct that."],
    ["Khi muốn nói lại cho chính xác.", "When you want a do-over to be accurate."],
    ["'นะครับ/นะคะ' khiến lời xin sửa nghe khiêm tốn, dễ chịu.",
     "'นะครับ/นะคะ' makes the correction sound humble and easy."]),
  card("thai_rep_correct_correctis", "correct_misunderstanding",
    ["ที่ถูกคือ...ครับ", "thîi thùuk khue … khráp", "Cái đúng là...", "The correct one is …"],
    ["Khi nêu thông tin chính xác thay cho thông tin sai.", "When giving the correct information in place of the wrong."],
    PS),
];

// ── Ask to write it down ──────────────────────────────────────────────────────

const write: ThaiRepairItem[] = [
  card("thai_rep_write_writeit", "ask_to_write",
    ["ช่วยเขียนให้ดูได้ไหมครับ", "chûay khǐan hâi duu dâai mái khráp", "Viết ra cho tôi xem được không ạ?", "Could you write it down for me?"],
    ["Khi nghe không ra nhưng đọc chữ thì hiểu.", "When you can't catch it by ear but could read it."],
    PQ),
  card("thai_rep_write_onpaper", "ask_to_write",
    ["เขียนลงกระดาษได้ไหม", "khǐan long grà-dàat dâai mái", "Viết xuống giấy được không?", "Could you write it on paper?"],
    ["Khi có sẵn giấy bút.", "When paper and pen are handy."],
    PQ),
  card("thai_rep_write_typeit", "ask_to_write",
    ["พิมพ์ในมือถือให้ดูได้ไหมคะ", "phim nai mue-thǔe hâi duu dâai mái khá", "Gõ vào điện thoại cho tôi xem được không ạ?", "Could you type it on the phone for me?"],
    ["Khi muốn xem chữ trên điện thoại để tra/đọc.", "When you'd rather see it typed on a phone to read or look up."],
    PQ),
  card("thai_rep_write_spelling", "ask_to_write",
    ["ขอดูตัวสะกดได้ไหมครับ", "khǎaw duu dtua-sà-gòt dâai mái khráp", "Cho tôi xem cách viết được không ạ?", "Could I see how it's spelled?"],
    ["Khi cần biết mặt chữ/chính tả của từ.", "When you need the spelling of a word."],
    PQ),
  card("thai_rep_write_inenglish", "ask_to_write",
    ["เขียนเป็นภาษาอังกฤษได้ไหม", "khǐan bpen phaa-sǎa ang-grìt dâai mái", "Viết bằng tiếng Anh được không?", "Could you write it in English?"],
    ["Khi chữ Thái khó đọc, xin viết bằng tiếng Anh.", "When Thai script is hard and English would help."],
    PQ),
  card("thai_rep_write_jotdown", "ask_to_write",
    ["ช่วยจดให้หน่อยได้ไหมครับ", "chûay jòt hâi nàauy dâai mái khráp", "Ghi giúp tôi một chút được không ạ?", "Could you jot it down for me?"],
    ["'จด' = ghi nhanh (số, địa chỉ, tên).", "'จด' = to jot/note (numbers, addresses, names)."],
    PQ),
  card("thai_rep_write_number", "ask_to_write",
    ["เขียนเบอร์ให้หน่อยได้ไหมคะ", "khǐan beu hâi nàauy dâai mái khá", "Viết số (điện thoại) giúp tôi được không ạ?", "Could you write the number down for me?"],
    ["Khi số đọc bằng miệng dễ nghe nhầm.", "When a spoken number is easy to mishear."],
    PQ),
];

// ── Ask for an example ────────────────────────────────────────────────────────

const example: ThaiRepairItem[] = [
  card("thai_rep_ex_giveexample", "ask_for_example",
    ["ยกตัวอย่างได้ไหมครับ", "yók dtua-yàang dâai mái khráp", "Cho ví dụ được không ạ?", "Could you give an example?"],
    ["Khi hiểu mơ hồ và cần một ví dụ cụ thể.", "When it's vague and a concrete example would help."],
    PQ),
  card("thai_rep_ex_likewhat", "ask_for_example",
    ["เช่นอะไรบ้างคะ", "chên à-rai bâang khá", "Ví dụ như cái gì ạ?", "Like what, for example?"],
    ["'เช่น' = ví dụ như; 'บ้าง' xin vài ví dụ.", "'เช่น' = such as; 'บ้าง' invites a few examples."],
    PQ),
  card("thai_rep_ex_anexample", "ask_for_example",
    ["ขอตัวอย่างหน่อยได้ไหมครับ", "khǎaw dtua-yàang nàauy dâai mái khráp", "Cho xin một ví dụ được không ạ?", "Could I have an example, please?"],
    ["Cách nhờ ví dụ lịch sự với 'ขอ...หน่อย'.", "A polite request for an example with 'ขอ…หน่อย'."],
    PQ),
  card("thai_rep_ex_howtouse", "ask_for_example",
    ["ใช้ยังไงครับ", "chái yang-ngai khráp", "Dùng thế nào ạ?", "How do you use it?"],
    ["Khi biết từ nhưng chưa rõ cách dùng trong câu.", "When you know the word but not how to use it."],
    PQ),
  card("thai_rep_ex_insentence", "ask_for_example",
    ["พูดเป็นประโยคได้ไหมคะ", "phûut bpen bprà-yòok dâai mái khá", "Đặt thành câu được không ạ?", "Could you put it in a sentence?"],
    ["Khi cần thấy từ trong một câu hoàn chỉnh.", "When you need the word shown in a full sentence."],
    PQ),
  card("thai_rep_ex_anyexample", "ask_for_example",
    ["มีตัวอย่างไหมครับ", "mii dtua-yàang mái khráp", "Có ví dụ nào không ạ?", "Is there an example?"],
    ["Câu hỏi ngắn xin ví dụ.", "A short request for any example."],
    PQ),
  card("thai_rep_ex_likethissentence", "ask_for_example",
    ["เช่นประโยคนี้ใช่ไหมครับ", "chên bprà-yòok níi châi mái khráp", "Ví dụ như câu này phải không ạ?", "Like this sentence, right?"],
    ["Khi tự thử một ví dụ và muốn xác nhận đúng chưa.", "When you try an example yourself and want it confirmed."],
    PQ),
];

// ── Politely admit limited Thai ───────────────────────────────────────────────

const admit: ThaiRepairItem[] = [
  card("thai_rep_admit_alittle", "admit_limited_thai",
    ["ผมพูดภาษาไทยได้นิดหน่อยครับ", "phǒm phûut phaa-sǎa thai dâai nít-nàauy khráp", "Tôi nói được tiếng Thái một chút.", "I speak a little Thai."],
    ["Báo trước để người ta điều chỉnh cách nói.", "A heads-up so they adjust how they speak."],
    PS),
  card("thai_rep_admit_juststarted", "admit_limited_thai",
    ["ผมเพิ่งเริ่มเรียนภาษาไทยครับ", "phǒm phôeng rôem rian phaa-sǎa thai khráp", "Tôi mới bắt đầu học tiếng Thái.", "I've just started learning Thai."],
    ["Khi muốn giải thích vì sao bạn còn chậm/hay nhầm.", "To explain why you're slow or make mistakes."],
    PS),
  card("thai_rep_admit_notgood", "admit_limited_thai",
    ["ภาษาไทยผมยังไม่เก่งครับ", "phaa-sǎa thai phǒm yang mâi gèng khráp", "Tiếng Thái của tôi vẫn chưa giỏi.", "My Thai isn't good yet."],
    ["'ยังไม่เก่ง' = chưa giỏi (hàm ý đang tiến bộ).", "'ยังไม่เก่ง' = not good yet (implies it's improving)."],
    PS),
  card("thai_rep_admit_dontquite", "admit_limited_thai",
    ["ขอโทษ ผมไม่ค่อยเข้าใจครับ", "khǎaw-thôot, phǒm mâi khâauy khâo-jai khráp", "Xin lỗi, tôi không hiểu lắm.", "Sorry, I don't quite understand."],
    ["Cách thừa nhận chưa hiểu một cách lịch sự.", "A polite way to admit you didn't fully follow."],
    PS),
  card("thai_rep_admit_notwell", "admit_limited_thai",
    ["ผมยังเข้าใจไม่ค่อยดีครับ", "phǒm yang khâo-jai mâi khâauy dii khráp", "Tôi vẫn chưa hiểu rõ lắm.", "I still don't understand very well."],
    ["Khi hiểu lờ mờ và cần được giúp thêm.", "When you only half-follow and need more help."],
    PS),
  card("thai_rep_admit_sorryifwrong", "admit_limited_thai",
    ["ถ้าพูดผิดขอโทษด้วยนะครับ", "thâa phûut phìt khǎaw-thôot dûay ná khráp", "Nếu nói sai thì xin lỗi nhé.", "Sorry in advance if I say it wrong."],
    ["Lời rào trước khiêm tốn, người Thái rất thiện cảm.", "A humble pre-apology Thais respond to warmly."],
    ["'นะครับ/นะคะ' làm lời rào nghe chân thành, không gượng.",
     "'นะครับ/นะคะ' makes the pre-apology sound sincere, not stiff."]),
  card("thai_rep_admit_bearwithme", "admit_limited_thai",
    ["ค่อยๆ นะครับ ผมกำลังเรียนอยู่", "khâauy-khâauy ná khráp, phǒm gam-lang rian yùu", "Từ từ nhé, tôi đang học.", "Bear with me, I'm still learning."],
    ["Khi muốn xin sự kiên nhẫn của người nghe.", "When asking the listener for a little patience."],
    ["Mở đầu bằng 'ค่อยๆ นะครับ/นะคะ' giữ không khí thân thiện.",
     "Opening with 'ค่อยๆ นะครับ/นะคะ' keeps the mood friendly."]),
];

// ── Aggregate export ────────────────────────────────────────────────────────

export const items: ThaiRepairItem[] = [
  ...askRepeat,
  ...slower,
  ...simpler,
  ...confirm,
  ...correct,
  ...write,
  ...example,
  ...admit,
];

export default items;
