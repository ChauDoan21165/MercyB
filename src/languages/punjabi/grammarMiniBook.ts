// src/languages/punjabi/grammarMiniBook.ts
//
// Compact Punjabi grammar mini-book for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// learner aid, not a phonetic standard. Shahmukhi is mentioned only for script
// awareness; this is not a Shahmukhi course. Native review is deferred.

export type PunjabiGrammarTopic =
  | "word_order"
  | "postpositions"
  | "gender_number"
  | "verb_agreement"
  | "pronouns"
  | "honorifics"
  | "negation"
  | "questions"
  | "tense_aspect"
  | "possession"
  | "comparison"
  | "sentence_linking";

export type PunjabiGrammarExample = {
  pa: string;
  romanization: string;
  vi: string;
  en: string;
};

export type PunjabiGrammarMistake = {
  wrong: string;
  right: string;
  why_vi: string;
  why_en: string;
};

export type PunjabiGrammarNote = {
  id: string;
  topic: PunjabiGrammarTopic;
  title_vi: string;
  title_en: string;
  explanation_vi: string;
  explanation_en: string;
  examples: PunjabiGrammarExample[];
  mistakes: PunjabiGrammarMistake[];
};

const n = (
  id: string,
  topic: PunjabiGrammarTopic,
  title_vi: string,
  title_en: string,
  explanation_vi: string,
  explanation_en: string,
  example: PunjabiGrammarExample,
  mistake: PunjabiGrammarMistake,
): PunjabiGrammarNote => ({
  id,
  topic,
  title_vi,
  title_en,
  explanation_vi,
  explanation_en,
  examples: [example],
  mistakes: [mistake],
});

export const notes: PunjabiGrammarNote[] = [
  n(
    "pa_gram_sov_basic",
    "word_order",
    "Trật tự cơ bản SOV",
    "Basic SOV word order",
    "Punjabi thường đặt động từ ở cuối: Chủ ngữ + thông tin phụ/tân ngữ + động từ. Điều này khác tiếng Anh nhưng gần với nhiều cấu trúc châu Á có động từ cuối.",
    "Punjabi usually places the verb at the end: Subject + extra information/object + verb. This differs from English and is the backbone of Punjabi clauses.",
    { pa: "ਮੈਂ ਚਾਹ ਪੀਂਦਾ ਹਾਂ।", romanization: "main chah peenda haan.", vi: "Tôi uống trà.", en: "I drink tea." },
    { wrong: "ਮੈਂ ਪੀਂਦਾ ਹਾਂ ਚਾਹ", right: "ਮੈਂ ਚਾਹ ਪੀਂਦਾ ਹਾਂ।", why_vi: "Không đặt động từ trước tân ngữ trong câu trung tính.", why_en: "Do not put the verb before the object in a neutral sentence." },
  ),
  n(
    "pa_gram_time_before_verb",
    "word_order",
    "Cụm thời gian đứng linh hoạt",
    "Flexible time phrases",
    "Cụm thời gian có thể đứng đầu câu hoặc trước động từ, nhưng động từ chính vẫn thường ở cuối.",
    "Time phrases can stand at the start or before the verb, but the main verb normally remains final.",
    { pa: "ਕੱਲ੍ਹ ਮੈਂ ਸਕੂਲ ਗਿਆ।", romanization: "kal main school gia.", vi: "Hôm qua tôi đi học.", en: "Yesterday I went to school." },
    { wrong: "ਮੈਂ ਗਿਆ ਕੱਲ੍ਹ ਸਕੂਲ", right: "ਕੱਲ੍ਹ ਮੈਂ ਸਕੂਲ ਗਿਆ।", why_vi: "Đặt động từ cuối giúp câu tự nhiên hơn.", why_en: "Keeping the verb final makes the sentence natural." },
  ),
  n(
    "pa_gram_modifier_before_noun",
    "word_order",
    "Tính từ thường đứng trước danh từ",
    "Adjectives usually precede nouns",
    "Khác tiếng Việt, tính từ Punjabi thường đứng trước danh từ và phải chú ý giống/số.",
    "Unlike Vietnamese, Punjabi adjectives usually come before nouns, and many agree for gender/number.",
    { pa: "ਵੱਡਾ ਘਰ ਸੁੰਦਰ ਹੈ।", romanization: "vadda ghar sundar hai.", vi: "Ngôi nhà lớn đẹp.", en: "The big house is beautiful." },
    { wrong: "ਘਰ ਵੱਡਾ ਸੁੰਦਰ ਹੈ (khi muốn nói 'big house')", right: "ਵੱਡਾ ਘਰ ਸੁੰਦਰ ਹੈ।", why_vi: "Dùng tính từ trước danh từ cho cụm danh từ.", why_en: "Use the adjective before the noun for a noun phrase." },
  ),
  n(
    "pa_gram_postposition_after_noun",
    "postpositions",
    "Punjabi dùng hậu giới từ",
    "Punjabi uses postpositions",
    "Các từ như ਵਿੱਚ, ਤੇ, ਤੋਂ, ਨੂੰ đứng sau danh từ/cụm danh từ. Đây là điểm khác tiếng Anh dùng prepositions trước danh từ.",
    "Words such as ਵਿੱਚ, ਤੇ, ਤੋਂ, ਨੂੰ come after the noun phrase. This differs from English prepositions.",
    { pa: "ਕਿਤਾਬ ਮੇਜ਼ ਤੇ ਹੈ।", romanization: "kitab mez te hai.", vi: "Quyển sách ở trên bàn.", en: "The book is on the table." },
    { wrong: "ਤੇ ਮੇਜ਼", right: "ਮੇਜ਼ ਤੇ", why_vi: "Hậu giới từ đứng sau danh từ.", why_en: "The postposition comes after the noun." },
  ),
  n(
    "pa_gram_vich_location",
    "postpositions",
    "ਵਿੱਚ = trong/ở",
    "ਵਿੱਚ = in/inside",
    "ਵਿੱਚ chỉ vị trí bên trong hoặc trong phạm vi một nơi: nhà, lớp, thành phố.",
    "ਵਿੱਚ marks location inside or within a place: a house, class, city.",
    { pa: "ਉਹ ਕਲਾਸ ਵਿੱਚ ਹੈ।", romanization: "oh class vich hai.", vi: "Bạn ấy ở trong lớp.", en: "They are in class." },
    { wrong: "ਉਹ ਵਿੱਚ ਕਲਾਸ ਹੈ", right: "ਉਹ ਕਲਾਸ ਵਿੱਚ ਹੈ।", why_vi: "ਵਿੱਚ đi sau ਕਲਾਸ.", why_en: "ਵਿੱਚ follows ਕਲਾਸ." },
  ),
  n(
    "pa_gram_nu_marker",
    "postpositions",
    "ਨੂੰ đánh dấu người nhận/thời gian",
    "ਨੂੰ marks recipient/object/time",
    "ਨੂੰ có nhiều chức năng: đánh dấu người nhận, một số tân ngữ xác định, và thời gian như ਸ਼ਾਮ ਨੂੰ.",
    "ਨੂੰ has several jobs: recipient, some definite objects, and time phrases such as ਸ਼ਾਮ ਨੂੰ.",
    { pa: "ਮੈਂ ਰੀਨਾ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", romanization: "main reena nu phone kita.", vi: "Tôi đã gọi cho Reena.", en: "I called Reena." },
    { wrong: "ਮੈਂ ਰੀਨਾ ਫ਼ੋਨ ਕੀਤਾ", right: "ਮੈਂ ਰੀਨਾ ਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।", why_vi: "Với người nhận/cuộc gọi cho ai, ਨੂੰ là tự nhiên.", why_en: "For the person called/recipient, ਨੂੰ is natural." },
  ),
  n(
    "pa_gram_gender_masculine_feminine",
    "gender_number",
    "Danh từ có giống",
    "Nouns have gender",
    "Punjabi phân biệt giống đực/giống cái; tính từ và động từ có thể đổi theo danh từ.",
    "Punjabi distinguishes masculine and feminine nouns; adjectives and verbs may change accordingly.",
    { pa: "ਚੰਗੀ ਚਾਹ ਗਰਮ ਹੈ।", romanization: "changi chah garam hai.", vi: "Trà ngon đang nóng.", en: "The good tea is hot." },
    { wrong: "ਚੰਗਾ ਚਾਹ", right: "ਚੰਗੀ ਚਾਹ", why_vi: "ਚਾਹ thường giống cái, nên dùng ਚੰਗੀ.", why_en: "ਚਾਹ is usually feminine, so use ਚੰਗੀ." },
  ),
  n(
    "pa_gram_plural_adjectives",
    "gender_number",
    "Tính từ đổi theo số nhiều",
    "Adjectives change for plural",
    "Nhiều tính từ đuôi -ਆ đổi thành -ੇ với danh từ giống đực số nhiều.",
    "Many -ਆ adjectives change to -ੇ with masculine plural nouns.",
    { pa: "ਵੱਡੇ ਮੁੰਡੇ ਖੇਡ ਰਹੇ ਹਨ।", romanization: "vadde munde khed rahe han.", vi: "Các cậu bé lớn đang chơi.", en: "The big boys are playing." },
    { wrong: "ਵੱਡਾ ਮੁੰਡੇ", right: "ਵੱਡੇ ਮੁੰਡੇ", why_vi: "ਮੁੰਡੇ là số nhiều, nên ਵੱਡੇ.", why_en: "ਮੁੰਡੇ is plural, so use ਵੱਡੇ." },
  ),
  n(
    "pa_gram_feminine_plural",
    "gender_number",
    "Giống cái số nhiều thường dùng -ਈਆਂ/-ਆਂ",
    "Feminine plural often uses -ਈਆਂ/-ਆਂ",
    "Nhiều danh từ giống cái có dạng số nhiều riêng, ví dụ ਕੁੜੀ → ਕੁੜੀਆਂ.",
    "Many feminine nouns have distinct plural forms, for example ਕੁੜੀ → ਕੁੜੀਆਂ.",
    { pa: "ਕੁੜੀਆਂ ਸਕੂਲ ਜਾਂਦੀਆਂ ਹਨ।", romanization: "kurian school jandian han.", vi: "Các cô gái đi học.", en: "The girls go to school." },
    { wrong: "ਕੁੜੀ ਸਕੂਲ ਜਾਂਦੀਆਂ ਹਨ", right: "ਕੁੜੀਆਂ ਸਕੂਲ ਜਾਂਦੀਆਂ ਹਨ।", why_vi: "Chủ ngữ số nhiều cần dạng danh từ số nhiều.", why_en: "A plural subject needs the plural noun form." },
  ),
  n(
    "pa_gram_habitual_agreement",
    "verb_agreement",
    "Thói quen: -ਦਾ/-ਦੀ/-ਦੇ",
    "Habitual: -ਦਾ/-ਦੀ/-ਦੇ",
    "Hành động thường xuyên dùng gốc động từ + ਦਾ/ਦੀ/ਦੇ + trợ động từ. Đuôi phụ thuộc vào chủ ngữ/người nói.",
    "Habitual actions use verb stem + ਦਾ/ਦੀ/ਦੇ + auxiliary. The ending depends on the subject/speaker.",
    { pa: "ਮੈਂ ਕੰਮ ਤੇ ਜਾਂਦੀ ਹਾਂ।", romanization: "main kamm te jandi haan.", vi: "Tôi đi làm. (người nói nữ)", en: "I go to work. (female speaker)" },
    { wrong: "ਮੈਂ ਜਾਂਦਾ ਹਾਂ (female speaker)", right: "ਮੈਂ ਜਾਂਦੀ ਹਾਂ।", why_vi: "Người nói nữ dùng -ਦੀ cho bản thân.", why_en: "A female speaker uses -ਦੀ for herself." },
  ),
  n(
    "pa_gram_past_intransitive",
    "verb_agreement",
    "Quá khứ với động từ không chuyển tác",
    "Past with intransitive verbs",
    "Với các động từ như ਜਾਣਾ, ਆਉਣਾ, động từ quá khứ thường agrees với chủ ngữ.",
    "With verbs such as ਜਾਣਾ and ਆਉਣਾ, the past form usually agrees with the subject.",
    { pa: "ਉਹ ਘਰ ਗਈ।", romanization: "oh ghar gai.", vi: "Cô ấy đã về nhà.", en: "She went home." },
    { wrong: "ਉਹ ਘਰ ਗਿਆ (for she)", right: "ਉਹ ਘਰ ਗਈ।", why_vi: "Chủ ngữ nữ dùng ਗਈ.", why_en: "A feminine subject takes ਗਈ." },
  ),
  n(
    "pa_gram_ne_past_transitive",
    "verb_agreement",
    "ਨੇ trong nhiều câu quá khứ chuyển tác",
    "ਨੇ in many transitive past clauses",
    "Khi hành động quá khứ có tân ngữ, người làm thường đi với ਨੇ, và động từ có thể agree với tân ngữ.",
    "In many transitive past clauses, the doer takes ਨੇ, and the verb may agree with the object.",
    { pa: "ਰੀਨਾ ਨੇ ਚਾਹ ਪੀਤੀ।", romanization: "reena ne chah peeti.", vi: "Reena đã uống trà.", en: "Reena drank tea." },
    { wrong: "ਰੀਨਾ ਚਾਹ ਪੀਤਾ", right: "ਰੀਨਾ ਨੇ ਚਾਹ ਪੀਤੀ।", why_vi: "Dùng ਨੇ; ਪੀਤੀ agrees với ਚਾਹ giống cái.", why_en: "Use ਨੇ; ਪੀਤੀ agrees with feminine ਚਾਹ." },
  ),
  n(
    "pa_gram_main_pronouns",
    "pronouns",
    "Đại từ cơ bản",
    "Basic pronouns",
    "ਮੈਂ = tôi, ਤੂੰ = bạn thân mật, ਤੁਸੀਂ = bạn lịch sự/số nhiều, ਉਹ = anh/cô/đó tùy ngữ cảnh.",
    "ਮੈਂ = I, ਤੂੰ = intimate you, ਤੁਸੀਂ = polite/plural you, ਉਹ = he/she/that depending on context.",
    { pa: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?", romanization: "tusi kitthe rehnde ho?", vi: "Bạn sống ở đâu?", en: "Where do you live?" },
    { wrong: "ਤੂੰ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ? (to a stranger)", right: "ਤੁਸੀਂ ਕਿੱਥੇ ਰਹਿੰਦੇ ਹੋ?", why_vi: "Với người lạ, dùng ਤੁਸੀਂ lịch sự.", why_en: "With a stranger, use polite ਤੁਸੀਂ." },
  ),
  n(
    "pa_gram_oh_context",
    "pronouns",
    "ਉਹ phụ thuộc ngữ cảnh",
    "ਉਹ depends on context",
    "ਉਹ có thể là 'anh ấy', 'cô ấy', hoặc 'cái đó'. Dựa vào động từ/tính từ và ngữ cảnh để hiểu.",
    "ਉਹ can mean he, she, or that. Use verb/adjective agreement and context to interpret it.",
    { pa: "ਉਹ ਮੇਰੀ ਅਧਿਆਪਕਾ ਹੈ।", romanization: "oh meri adhiapaka hai.", vi: "Cô ấy là giáo viên của tôi.", en: "She is my teacher." },
    { wrong: "Always translating ਉਹ as he", right: "Translate by context", why_vi: "ਉਹ không cố định giới tính như English he/she.", why_en: "ਉਹ is not fixed like English he/she." },
  ),
  n(
    "pa_gram_asi_plural",
    "pronouns",
    "ਅਸੀਂ = chúng tôi/chúng ta",
    "ਅਸੀਂ = we",
    "ਅਸੀਂ bao gồm 'we' nhưng ngữ cảnh quyết định có bao gồm người nghe hay không.",
    "ਅਸੀਂ means we; context decides whether the listener is included.",
    { pa: "ਅਸੀਂ ਕੱਲ੍ਹ ਮਿਲਾਂਗੇ।", romanization: "asin kal milange.", vi: "Chúng ta/chúng tôi sẽ gặp ngày mai.", en: "We will meet tomorrow." },
    { wrong: "Assuming ਅਸੀਂ always excludes the listener", right: "Read context", why_vi: "Punjabi không luôn tách inclusive/exclusive trong đại từ này.", why_en: "Punjabi does not always mark inclusive/exclusive in this pronoun." },
  ),
  n(
    "pa_gram_ji_softener",
    "honorifics",
    "ਜੀ làm câu lịch sự hơn",
    "ਜੀ adds respect",
    "ਜੀ sau tên, xưng hô hoặc lời đáp làm giọng lịch sự/thân thiện hơn.",
    "ਜੀ after a name, address term, or response adds respect and warmth.",
    { pa: "ਹਾਂ ਜੀ, ਮੈਂ ਆ ਰਿਹਾ ਹਾਂ।", romanization: "haan ji, main aa riha haan.", vi: "Vâng, tôi đang đến.", en: "Yes, I am coming." },
    { wrong: "Dropping ਜੀ in a formal reply", right: "ਹਾਂ ਜੀ", why_vi: "Trong bối cảnh lịch sự, ਜੀ làm câu mềm hơn.", why_en: "In polite contexts, ਜੀ softens the reply." },
  ),
  n(
    "pa_gram_tusi_honorific",
    "honorifics",
    "ਤੁਸੀਂ cho lịch sự",
    "ਤੁਸੀਂ for politeness",
    "ਤੁਸੀਂ dùng với người lớn tuổi, người lạ, cấp trên, và cũng là số nhiều.",
    "ਤੁਸੀਂ is used for elders, strangers, superiors, and also as plural you.",
    { pa: "ਤੁਸੀਂ ਬੈਠੋ ਜੀ।", romanization: "tusi baitho ji.", vi: "Mời anh/chị ngồi.", en: "Please sit." },
    { wrong: "ਤੂੰ ਬੈਠ (to elder)", right: "ਤੁਸੀਂ ਬੈਠੋ ਜੀ।", why_vi: "ਤੂੰ quá thân mật với người lớn/người lạ.", why_en: "ਤੂੰ is too intimate for elders/strangers." },
  ),
  n(
    "pa_gram_sahib_madam",
    "honorifics",
    "Xưng hô trang trọng",
    "Formal address",
    "ਸਾਹਿਬ, ਮੈਡਮ, ਜੀ có thể dùng trong bối cảnh dịch vụ/công việc, nhưng không nên lạm dụng.",
    "ਸਾਹਿਬ, ਮੈਡਮ, and ਜੀ can be used in service/work contexts, but should not be overused.",
    { pa: "ਮੈਡਮ ਜੀ, ਇਹ ਫਾਰਮ ਕਿੱਥੇ ਦੇਣਾ ਹੈ?", romanization: "madam ji, eh form kitthe dena hai?", vi: "Thưa cô/chị, nộp mẫu này ở đâu?", en: "Madam, where should this form be submitted?" },
    { wrong: "Using only ਤੂੰ in offices", right: "Use ਮੈਡਮ ਜੀ / ਸਾਹਿਬ ਜੀ / ਤੁਸੀਂ", why_vi: "Văn phòng cần register lịch sự.", why_en: "Office contexts need polite register." },
  ),
  n(
    "pa_gram_nahi_basic",
    "negation",
    "ਨਹੀਂ phủ định cơ bản",
    "Basic negation with ਨਹੀਂ",
    "ਨਹੀਂ thường đứng trước động từ chính hoặc trước cụm động từ cuối câu.",
    "ਨਹੀਂ usually stands before the main verb or final verb phrase.",
    { pa: "ਮੈਂ ਮਾਸ ਨਹੀਂ ਖਾਂਦਾ।", romanization: "main maas nahi khanda.", vi: "Tôi không ăn thịt.", en: "I do not eat meat." },
    { wrong: "ਮੈਂ ਨਹੀਂ ਮਾਸ ਖਾਂਦਾ", right: "ਮੈਂ ਮਾਸ ਨਹੀਂ ਖਾਂਦਾ।", why_vi: "Phủ định đặt sát cụm động từ.", why_en: "Place negation close to the verb phrase." },
  ),
  n(
    "pa_gram_no_be",
    "negation",
    "ਨਹੀਂ với ਹੈ",
    "ਨਹੀਂ with ਹੈ",
    "Trong nhiều câu 'không phải/không ở', ਨਹੀਂ đứng trước ਹੈ hoặc thay thế bằng ਨਹੀਂ ở cuối trong lối nói ngắn.",
    "In many 'is not/is not located' sentences, ਨਹੀਂ comes before ਹੈ or appears finally in short speech.",
    { pa: "ਉਹ ਘਰ ਵਿੱਚ ਨਹੀਂ ਹੈ।", romanization: "oh ghar vich nahi hai.", vi: "Bạn ấy không ở nhà.", en: "They are not at home." },
    { wrong: "ਉਹ ਨਹੀਂ ਘਰ ਵਿੱਚ ਹੈ", right: "ਉਹ ਘਰ ਵਿੱਚ ਨਹੀਂ ਹੈ।", why_vi: "Đặt ਨਹੀਂ trước ਹੈ trong câu vị trí.", why_en: "Put ਨਹੀਂ before ਹੈ in location sentences." },
  ),
  n(
    "pa_gram_never",
    "negation",
    "ਕਦੇ ਨਹੀਂ = không bao giờ",
    "ਕਦੇ ਨਹੀਂ = never",
    "ਕਦੇ ਨਹੀਂ dùng để nói 'không bao giờ'; ਕਦੇ một mình có thể nghĩa 'từng/khi nào đó'.",
    "ਕਦੇ ਨਹੀਂ means never; ਕਦੇ alone can mean ever/sometime.",
    { pa: "ਮੈਂ ਕਦੇ ਝੂਠ ਨਹੀਂ ਬੋਲਦਾ।", romanization: "main kade jhooth nahi bolda.", vi: "Tôi không bao giờ nói dối.", en: "I never lie." },
    { wrong: "ਮੈਂ ਕਦੇ ਝੂਠ ਬੋਲਦਾ", right: "ਮੈਂ ਕਦੇ ਝੂਠ ਨਹੀਂ ਬੋਲਦਾ।", why_vi: "Cần ਨਹੀਂ để tạo nghĩa phủ định.", why_en: "You need ਨਹੀਂ to make the meaning negative." },
  ),
  n(
    "pa_gram_kithhe_ki_kadon",
    "questions",
    "Từ hỏi cơ bản",
    "Basic question words",
    "ਕੀ = gì/có phải, ਕਿੱਥੇ = ở đâu, ਕਦੋਂ = khi nào, ਕਿਉਂ = tại sao. Từ hỏi thường đứng trước động từ cuối.",
    "ਕੀ = what/yes-no marker, ਕਿੱਥੇ = where, ਕਦੋਂ = when, ਕਿਉਂ = why. Question words usually come before the final verb.",
    { pa: "ਤੁਸੀਂ ਕਦੋਂ ਆਓਗੇ?", romanization: "tusi kadon aaoge?", vi: "Khi nào bạn sẽ đến?", en: "When will you come?" },
    { wrong: "ਤੁਸੀਂ ਆਓਗੇ ਕਦੋਂ", right: "ਤੁਸੀਂ ਕਦੋਂ ਆਓਗੇ?", why_vi: "Từ hỏi thường đứng trước động từ.", why_en: "The question word usually comes before the verb." },
  ),
  n(
    "pa_gram_yes_no_ki",
    "questions",
    "ਕੀ mở câu hỏi có/không",
    "ਕੀ opens yes/no questions",
    "ਕੀ ở đầu câu có thể biến mệnh đề thành câu hỏi có/không.",
    "ਕੀ at the beginning can turn a statement into a yes/no question.",
    { pa: "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?", romanization: "ki tusi tiyar ho?", vi: "Bạn đã sẵn sàng chưa?", en: "Are you ready?" },
    { wrong: "ਤੁਸੀਂ ਤਿਆਰ ਹੋ? (can work by intonation, but less explicit)", right: "ਕੀ ਤੁਸੀਂ ਤਿਆਰ ਹੋ?", why_vi: "ਕੀ làm câu hỏi rõ ràng trong văn viết.", why_en: "ਕੀ makes the question explicit in writing." },
  ),
  n(
    "pa_gram_question_politeness",
    "questions",
    "Câu hỏi lịch sự với ਸਕਦੇ ਹੋ",
    "Polite questions with ਸਕਦੇ ਹੋ",
    "Dùng ਸਕਦੇ ਹੋ để hỏi khả năng/yêu cầu lịch sự: 'bạn có thể... không?'.",
    "Use ਸਕਦੇ ਹੋ to ask ability or make a polite request: 'can you...?'.",
    { pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", romanization: "ki tusi meri madad kar sakde ho?", vi: "Bạn có thể giúp tôi không?", en: "Can you help me?" },
    { wrong: "ਮੇਰੀ ਮਦਦ ਕਰੋ! (too direct with stranger)", right: "ਕੀ ਤੁਸੀਂ ਮੇਰੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?", why_vi: "Câu hỏi với ਸਕਦੇ ਹੋ lịch sự hơn mệnh lệnh.", why_en: "A question with ਸਕਦੇ ਹੋ is more polite than a command." },
  ),
  n(
    "pa_gram_present_progressive",
    "tense_aspect",
    "Đang làm: ਰਿਹਾ/ਰਹੀ/ਰਹੇ",
    "Doing now: ਰਿਹਾ/ਰਹੀ/ਰਹੇ",
    "Tiếp diễn dùng gốc động từ + ਰਿਹਾ/ਰਹੀ/ਰਹੇ + trợ động từ.",
    "Progressive aspect uses verb stem + ਰਿਹਾ/ਰਹੀ/ਰਹੇ + auxiliary.",
    { pa: "ਉਹ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।", romanization: "oh kitab parh rahi hai.", vi: "Cô ấy đang đọc sách.", en: "She is reading a book." },
    { wrong: "ਉਹ ਕਿਤਾਬ ਪੜ੍ਹਦਾ ਹੈ (for now)", right: "ਉਹ ਕਿਤਾਬ ਪੜ੍ਹ ਰਹੀ ਹੈ।", why_vi: "ਪੜ੍ਹਦਾ ਹੈ là thói quen; đang làm dùng ਰਹੀ ਹੈ.", why_en: "ਪੜ੍ਹਦਾ ਹੈ is habitual; ongoing action uses ਰਹੀ ਹੈ." },
  ),
  n(
    "pa_gram_future_ga",
    "tense_aspect",
    "Tương lai: -ਗਾ/-ਗੀ/-ਗੇ",
    "Future: -ਗਾ/-ਗੀ/-ਗੇ",
    "Tương lai thường dùng đuôi -ਗਾ/-ਗੀ/-ਗੇ theo giống/số/người.",
    "The future often uses -ਗਾ/-ਗੀ/-ਗੇ according to gender/number/person.",
    { pa: "ਮੈਂ ਕੱਲ੍ਹ ਆਵਾਂਗੀ।", romanization: "main kal aavangi.", vi: "Ngày mai tôi sẽ đến. (nữ)", en: "I will come tomorrow. (female speaker)" },
    { wrong: "ਮੈਂ ਆਵਾਂਗਾ (female speaker)", right: "ਮੈਂ ਆਵਾਂਗੀ।", why_vi: "Người nói nữ dùng -ਗੀ trong mẫu này.", why_en: "A female speaker uses -ਗੀ in this pattern." },
  ),
  n(
    "pa_gram_perfect_hoia",
    "tense_aspect",
    "Kết quả/trạng thái với ਹੋਇਆ",
    "Result/state with ਹੋਇਆ",
    "ਹੋਇਆ/ਹੋਈ/ਹੋਏ có thể diễn tả trạng thái đã xảy ra hoặc kết quả hiện tại.",
    "ਹੋਇਆ/ਹੋਈ/ਹੋਏ can express a completed state or current result.",
    { pa: "ਦਰਵਾਜ਼ਾ ਬੰਦ ਹੋਇਆ ਹੈ।", romanization: "darvaza band hoia hai.", vi: "Cửa đã được đóng.", en: "The door has been closed." },
    { wrong: "ਦਰਵਾਜ਼ਾ ਬੰਦ ਹੋਈ ਹੈ", right: "ਦਰਵਾਜ਼ਾ ਬੰਦ ਹੋਇਆ ਹੈ।", why_vi: "ਦਰਵਾਜ਼ਾ giống đực, dùng ਹੋਇਆ.", why_en: "ਦਰਵਾਜ਼ਾ is masculine, so use ਹੋਇਆ." },
  ),
  n(
    "pa_gram_mera_meri",
    "possession",
    "ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ agrees với vật sở hữu",
    "ਮੇਰਾ/ਮੇਰੀ/ਮੇਰੇ agrees with the possessed noun",
    "Từ sở hữu đổi theo danh từ được sở hữu, không theo người sở hữu.",
    "Possessives change according to the possessed noun, not the owner.",
    { pa: "ਮੇਰੀ ਕਿਤਾਬ ਨਵੀਂ ਹੈ।", romanization: "meri kitab navi hai.", vi: "Sách của tôi mới.", en: "My book is new." },
    { wrong: "ਮੇਰਾ ਕਿਤਾਬ", right: "ਮੇਰੀ ਕਿਤਾਬ", why_vi: "ਕਿਤਾਬ giống cái, nên ਮੇਰੀ.", why_en: "ਕਿਤਾਬ is feminine, so use ਮੇਰੀ." },
  ),
  n(
    "pa_gram_da_di_de",
    "possession",
    "ਦਾ/ਦੀ/ਦੇ = của",
    "ਦਾ/ਦੀ/ਦੇ = of",
    "ਦਾ/ਦੀ/ਦੇ nối quan hệ sở hữu và agrees với danh từ sau nó.",
    "ਦਾ/ਦੀ/ਦੇ links possession and agrees with the following possessed noun.",
    { pa: "ਰੀਨਾ ਦਾ ਭਰਾ ਡਾਕਟਰ ਹੈ।", romanization: "reena da bhra daktar hai.", vi: "Anh/em trai của Reena là bác sĩ.", en: "Reena's brother is a doctor." },
    { wrong: "ਰੀਨਾ ਦੀ ਭਰਾ", right: "ਰੀਨਾ ਦਾ ਭਰਾ", why_vi: "ਭਰਾ giống đực, nên ਦਾ.", why_en: "ਭਰਾ is masculine, so use ਦਾ." },
  ),
  n(
    "pa_gram_kol_possession",
    "possession",
    "ਕੋਲ để nói 'có'",
    "ਕੋਲ for having",
    "Punjabi thường nói 'ở chỗ tôi có...' bằng ਮੇਰੇ ਕੋਲ, thay vì một động từ 'have' giống tiếng Anh.",
    "Punjabi often says 'with/near me there is...' using ਮੇਰੇ ਕੋਲ rather than an English-style have verb.",
    { pa: "ਮੇਰੇ ਕੋਲ ਸਮਾਂ ਨਹੀਂ ਹੈ।", romanization: "mere kol sama nahi hai.", vi: "Tôi không có thời gian.", en: "I do not have time." },
    { wrong: "ਮੈਂ ਸਮਾਂ ਹੈ", right: "ਮੇਰੇ ਕੋਲ ਸਮਾਂ ਹੈ।", why_vi: "Sở hữu dùng ਕੋਲ trong mẫu này.", why_en: "Possession uses ਕੋਲ in this pattern." },
  ),
  n(
    "pa_gram_ton_comparison",
    "comparison",
    "ਤੋਂ trong so sánh",
    "ਤੋਂ in comparison",
    "Cấu trúc thường là A B ਤੋਂ + tính từ hơn: A hơn B.",
    "A common structure is A B ਤੋਂ + adjective: A is more adjective than B.",
    { pa: "ਇਹ ਘਰ ਉਸ ਘਰ ਤੋਂ ਵੱਡਾ ਹੈ।", romanization: "eh ghar us ghar ton vadda hai.", vi: "Nhà này lớn hơn nhà kia.", en: "This house is bigger than that house." },
    { wrong: "ਇਹ ਘਰ ਵੱਡਾ ਉਸ ਘਰ", right: "ਇਹ ਘਰ ਉਸ ਘਰ ਤੋਂ ਵੱਡਾ ਹੈ।", why_vi: "ਤੋਂ đặt sau chuẩn so sánh.", why_en: "ਤੋਂ follows the comparison standard." },
  ),
  n(
    "pa_gram_sab_ton",
    "comparison",
    "ਸਭ ਤੋਂ = nhất",
    "ਸਭ ਤੋਂ = most",
    "ਸਭ ਤੋਂ + tính từ tạo so sánh nhất.",
    "ਸਭ ਤੋਂ + adjective forms the superlative.",
    { pa: "ਇਹ ਸਭ ਤੋਂ ਚੰਗਾ ਜਵਾਬ ਹੈ।", romanization: "eh sabh ton changa jawab hai.", vi: "Đây là câu trả lời tốt nhất.", en: "This is the best answer." },
    { wrong: "ਇਹ ਚੰਗਾ ਤੋਂ", right: "ਇਹ ਸਭ ਤੋਂ ਚੰਗਾ ਹੈ।", why_vi: "So sánh nhất dùng ਸਭ ਤੋਂ trước tính từ.", why_en: "The superlative uses ਸਭ ਤੋਂ before the adjective." },
  ),
  n(
    "pa_gram_jinna_ohna",
    "comparison",
    "ਜਿੰਨਾ... ਓਨਾ... = càng/bao nhiêu... bấy nhiêu",
    "ਜਿੰਨਾ... ਓਨਾ... = the more/as much... the more",
    "Cặp này nối hai mức độ tương ứng, thường ở trình độ trung cấp trở lên.",
    "This pair links two corresponding degrees, usually at intermediate level and above.",
    { pa: "ਜਿੰਨਾ ਤੁਸੀਂ ਪੜ੍ਹੋਗੇ, ਓਨਾ ਸਮਝੋਗੇ।", romanization: "jinna tusi parhoge, ona samjhoge.", vi: "Bạn đọc càng nhiều thì hiểu càng nhiều.", en: "The more you read, the more you will understand." },
    { wrong: "ਜਿੰਨਾ without ਓਨਾ", right: "ਜਿੰਨਾ..., ਓਨਾ...", why_vi: "Cặp tương ứng cần phần thứ hai.", why_en: "The paired structure needs the second half." },
  ),
  n(
    "pa_gram_ate_te",
    "sentence_linking",
    "ਅਤੇ/ਤੇ nối danh từ hoặc mệnh đề",
    "ਅਤੇ/ਤੇ link nouns or clauses",
    "ਅਤੇ trang trọng hơn, ਤੇ rất phổ biến trong nói. Cả hai có thể nghĩa 'và'.",
    "ਅਤੇ is more formal, while ਤੇ is common in speech. Both can mean 'and'.",
    { pa: "ਮੈਂ ਚਾਹ ਅਤੇ ਪਾਣੀ ਲਵਾਂਗਾ।", romanization: "main chah ate paani lavanga.", vi: "Tôi sẽ lấy trà và nước.", en: "I will take tea and water." },
    { wrong: "Using only English-style comma links", right: "Use ਅਤੇ/ਤੇ", why_vi: "Punjabi cần từ nối rõ khi liệt kê.", why_en: "Punjabi needs a clear linker in lists." },
  ),
  n(
    "pa_gram_par_contrast",
    "sentence_linking",
    "ਪਰ tạo tương phản",
    "ਪਰ creates contrast",
    "ਪਰ = nhưng; dùng để nối hai ý trái hướng.",
    "ਪਰ = but; it connects two contrasting ideas.",
    { pa: "ਮੈਂ ਜਾਣਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਪਰ ਸਮਾਂ ਨਹੀਂ ਹੈ।", romanization: "main jaana chaunda haan, par sama nahi hai.", vi: "Tôi muốn đi, nhưng không có thời gian.", en: "I want to go, but there is no time." },
    { wrong: "ਅਤੇ for contrast", right: "ਪਰ", why_vi: "Ý trái hướng cần ਪਰ, không phải 'và'.", why_en: "Contrasting ideas need ਪਰ, not 'and'." },
  ),
  n(
    "pa_gram_ki_subordinator",
    "sentence_linking",
    "ਕਿ nối lời nói/ý nghĩ",
    "ਕਿ links reported speech/thought",
    "ਕਿ tương tự 'rằng/that', dùng sau ਕਹਿਣਾ, ਸੋਚਣਾ, ਲਿਖਣਾ.",
    "ਕਿ is like 'that', used after say, think, write.",
    { pa: "ਉਸਨੇ ਕਿਹਾ ਕਿ ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਹੈ।", romanization: "usne keha ki meeting kal hai.", vi: "Bạn ấy nói rằng cuộc họp là ngày mai.", en: "They said that the meeting is tomorrow." },
    { wrong: "ਉਸਨੇ ਕਿਹਾ ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਹੈ (possible speech, less explicit)", right: "ਉਸਨੇ ਕਿਹਾ ਕਿ ਮੀਟਿੰਗ ਕੱਲ੍ਹ ਹੈ।", why_vi: "ਕਿ làm quan hệ câu rõ hơn trong văn viết.", why_en: "ਕਿ makes the sentence relationship clearer in writing." },
  ),
];
