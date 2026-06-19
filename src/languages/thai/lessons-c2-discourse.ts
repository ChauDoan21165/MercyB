// Thai C2 discourse & nuance lessons — Vietnamese-first (L1 = Vietnamese),
// English companion fields throughout.
//
// SCOPE / STATUS: This is *study support* material for advanced (CEFR C2)
// learners working on Thai discourse, stance, and pragmatic nuance. It is NOT
// native-certified authority. Native review is DEFERRED — do not represent any
// gloss here as native-reviewed or authoritative. Treat romanization as a
// reading aid, not a strict transliteration standard.
//
// Self-contained on purpose: the Thai language folder does not (yet) ship a
// shared `./lessons.ts` registry with a common lesson type, so the structural
// types are declared inline here. A future `lessons.ts` can lift these out.
//
// Focus areas (CEFR C2 discourse): stance, implication, soft disagreement,
// register shifting, politeness hierarchy, hedging, indirectness, formal
// argument, and pragmatic nuance.
//
// Conventions:
//   - `thai`  : Thai script (the authoritative form).
//   - `rtgs`  : a readable romanization (Royal-Thai-General-System-flavoured,
//               with light tone hints in parentheses where useful). Reading aid
//               only — Thai tone/length is not fully recoverable from it.
//   - `vi`    : Vietnamese explanation / translation (primary L1).
//   - `en`    : English explanation / translation (companion).

export type ThaiCefrLevel = "C2";

export type ThaiDiscourseFocus =
  | "stance"
  | "implication"
  | "soft_disagreement"
  | "register_shifting"
  | "politeness_hierarchy"
  | "hedging"
  | "indirectness"
  | "formal_argument"
  | "pragmatic_nuance";

// A reusable discourse marker / phrase with bilingual nuance notes.
export type DiscoursePhrase = {
  thai: string;
  rtgs: string;
  literal_en: string;
  meaning_vi: string;
  meaning_en: string;
  // Rough register band this item lives in (reading aid, not a hard rule).
  register?: "formal" | "neutral" | "colloquial" | "intimate";
};

// A worked example sentence showing a marker in context.
export type DiscourseExample = {
  thai: string;
  rtgs: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type ThaiC2DiscourseLesson = {
  id: string;
  level: ThaiCefrLevel;
  focus: ThaiDiscourseFocus;
  title_vi: string;
  title_en: string;
  overview_vi: string;
  overview_en: string;
  phrases: DiscoursePhrase[];
  examples: DiscourseExample[];
  tip_vi: string;
  tip_en: string;
};

// Banner shown by any consumer that surfaces this material. Kept as data (not a
// comment) so the UI can render the "not native-certified" caveat verbatim.
export const C2_DISCOURSE_DISCLAIMER = {
  vi: "Tài liệu hỗ trợ học tập trình độ C2. Chưa được người bản xứ thẩm định; phần thẩm định bản xứ được hoãn lại. Hãy coi phần phiên âm là công cụ hỗ trợ đọc, không phải chuẩn chính tả.",
  en: "C2-level study-support material. Not native-certified; native review is deferred. Treat romanization as a reading aid, not an orthographic standard.",
} as const;

export const lessons: ThaiC2DiscourseLesson[] = [
  // ── 1. Stance: framing a personal position ──────────────────────────────
  {
    id: "thc2_stance_framing",
    level: "C2",
    focus: "stance",
    title_vi: "Đặt lập trường: cách đóng khung quan điểm cá nhân",
    title_en: "Taking a stance: framing a personal position",
    overview_vi:
      "Ở trình độ C2, người nói hiếm khi tuyên bố quan điểm trần trụi. Họ đóng khung nó bằng các cụm 'theo tôi', 'có thể nói rằng', 'cá nhân tôi cho rằng' để vừa khẳng định vừa chừa đường lui. Chọn cụm đóng khung quyết định mức độ chắc chắn mà bạn cam kết.",
    overview_en:
      "At C2, speakers rarely state opinions bare. They frame them with markers like 'in my view', 'one could say', 'personally I hold that', which assert a position while leaving room to retreat. The framing you choose signals how much certainty you commit to.",
    phrases: [
      {
        thai: "ในความเห็นของผม/ดิฉัน",
        rtgs: "nai khwaam-hen khong phom / di-chan",
        literal_en: "in the opinion of me",
        meaning_vi: "Theo quan điểm của tôi (trang trọng; ผม cho nam, ดิฉัน cho nữ).",
        meaning_en: "In my opinion (formal; ผม male speaker, ดิฉัน female speaker).",
        register: "formal",
      },
      {
        thai: "ส่วนตัวแล้ว ผมมองว่า",
        rtgs: "suan-tua laeo, phom mong waa",
        literal_en: "personally then, I see that",
        meaning_vi: "Cá nhân tôi nhìn nhận rằng… — đánh dấu đây là góc nhìn riêng, không áp đặt.",
        meaning_en: "Personally, I see it as… — marks this as a private view, not imposed.",
        register: "neutral",
      },
      {
        thai: "พูดได้ว่า",
        rtgs: "phuut dai waa",
        literal_en: "can say that",
        meaning_vi: "Có thể nói rằng… — đóng khung mềm, hạ thấp mức cam kết.",
        meaning_en: "One could say that… — a soft frame that lowers commitment.",
        register: "neutral",
      },
      {
        thai: "ยืนยันได้เลยว่า",
        rtgs: "yuen-yan dai loei waa",
        literal_en: "can affirm right-away that",
        meaning_vi: "Tôi dám khẳng định rằng… — cam kết mạnh, dùng khi rất chắc chắn.",
        meaning_en: "I can firmly affirm that… — strong commitment, used when very sure.",
        register: "neutral",
      },
    ],
    examples: [
      {
        thai: "ในความเห็นของผม นโยบายนี้ยังต้องปรับอีกพอสมควร",
        rtgs: "nai khwaam-hen khong phom, na-yo-baai nii yang tong prap iik phaw-som-khuan",
        vi: "Theo quan điểm của tôi, chính sách này còn phải điều chỉnh kha khá.",
        en: "In my view, this policy still needs a fair amount of adjustment.",
        note_vi: "พอสมควร (phaw-som-khuan) làm dịu lời chê: 'kha khá' chứ không phải 'rất nhiều'.",
        note_en: "พอสมควร hedges the criticism: 'a fair amount', not 'a great deal'.",
      },
      {
        thai: "ส่วนตัวแล้วผมมองว่ายังเร็วเกินไปที่จะสรุป",
        rtgs: "suan-tua laeo phom mong waa yang reo koen-pai thii ja sa-rup",
        vi: "Cá nhân tôi cho rằng còn quá sớm để kết luận.",
        en: "Personally, I think it is still too early to conclude.",
      },
    ],
    tip_vi: "Mở đầu bằng cụm đóng khung lập trường giúp người nghe biết bạn đang nêu ý kiến, không phải sự thật hiển nhiên — đây là dấu hiệu lịch sự bậc cao trong tiếng Thái.",
    tip_en: "Opening with a stance frame tells the listener you are offering an opinion, not an obvious fact — a high-level politeness signal in Thai.",
  },

  // ── 2. Implication: meaning beyond the words ────────────────────────────
  {
    id: "thc2_implication_subtext",
    level: "C2",
    focus: "implication",
    title_vi: "Hàm ý: nghĩa nằm ngoài câu chữ",
    title_en: "Implication: meaning beyond the words",
    overview_vi:
      "Tiếng Thái coi trọng việc 'nói vòng' (พูดอ้อม). Người C2 phải đọc được n|y ý (นัย) — điều người nói gợi ra mà không nói thẳng. Nhận diện các tín hiệu báo rằng 'có ẩn ý phía sau'.",
    overview_en:
      "Thai prizes 'speaking around' a point (พูดอ้อม). A C2 user must read the นัย (implied sense) — what the speaker gestures at without stating. Learn the cues that flag 'there is subtext here'.",
    phrases: [
      {
        thai: "พูดอ้อม ๆ",
        rtgs: "phuut om-om",
        literal_en: "speak round-round",
        meaning_vi: "Nói vòng vo, nói bóng gió (cố ý không nói thẳng).",
        meaning_en: "To speak indirectly / hint around something on purpose.",
        register: "colloquial",
      },
      {
        thai: "มีนัยแฝง",
        rtgs: "mii nai faeng",
        literal_en: "have hidden implication",
        meaning_vi: "Có hàm ý ẩn, có ngụ ý đằng sau.",
        meaning_en: "To carry a hidden implication / underlying meaning.",
        register: "formal",
      },
      {
        thai: "เข้าใจตรงกันนะ",
        rtgs: "khao-jai trong kan na",
        literal_en: "understand mutually, yeah",
        meaning_vi: "'Ta hiểu nhau rồi nhé' — ám chỉ một thỏa thuận ngầm không nói ra.",
        meaning_en: "'We understand each other, right?' — invokes an unspoken shared understanding.",
        register: "colloquial",
      },
      {
        thai: "ก็แล้วแต่จะคิด",
        rtgs: "kaw laeo-tae ja khit",
        literal_en: "well, depends-on how (you) think",
        meaning_vi: "'Tùy bạn nghĩ thôi' — bỏ lửng để người nghe tự suy ra ẩn ý.",
        meaning_en: "'It's up to how you read it' — left open so the listener infers the subtext.",
        register: "colloquial",
      },
    ],
    examples: [
      {
        thai: "เขาไม่ได้ปฏิเสธตรง ๆ แต่ก็พูดอ้อม ๆ ว่ายังไม่พร้อม",
        rtgs: "khao mai dai pa-ti-set trong-trong, tae kaw phuut om-om waa yang mai phrom",
        vi: "Anh ấy không từ chối thẳng, mà nói vòng rằng chưa sẵn sàng.",
        en: "He didn't refuse outright, but hinted around that he wasn't ready.",
        note_vi: "Từ chối gián tiếp giữ thể diện cho cả hai bên — chuẩn mực Thái.",
        note_en: "Indirect refusal saves face for both sides — a Thai norm.",
      },
      {
        thai: "ที่เขาพูดแบบนั้น น่าจะมีนัยแฝงอยู่",
        rtgs: "thii khao phuut baep nan, naa-ja mii nai faeng yuu",
        vi: "Cách anh ấy nói vậy, có lẽ có ẩn ý đằng sau.",
        en: "The way he said that, there's probably a hidden implication.",
      },
    ],
    tip_vi: "Khi một người Thái trả lời lảng tránh hoặc bỏ lửng, hãy coi đó là thông tin — sự im lặng và câu lửng thường mang ý 'không' một cách lịch sự.",
    tip_en: "When a Thai speaker answers evasively or trails off, treat it as information — silence and unfinished sentences often carry a polite 'no'.",
  },

  // ── 3. Soft disagreement: dissent without confrontation ─────────────────
  {
    id: "thc2_soft_disagreement",
    level: "C2",
    focus: "soft_disagreement",
    title_vi: "Bất đồng nhẹ nhàng: phản đối mà không đối đầu",
    title_en: "Soft disagreement: dissent without confrontation",
    overview_vi:
      "Phản đối thẳng dễ làm mất mặt và bị coi là thô lỗ. Người C2 dùng cấu trúc 'đồng ý một phần rồi xoay': công nhận điểm đúng (ก็จริง), sau đó nhẹ nhàng đưa hướng khác (แต่...).",
    overview_en:
      "Blunt contradiction risks loss of face and reads as rude. C2 speakers use a 'concede-then-pivot' structure: acknowledge what's right (ก็จริง), then gently redirect (แต่…).",
    phrases: [
      {
        thai: "ก็จริงอยู่ แต่ว่า",
        rtgs: "kaw jing yuu, tae waa",
        literal_en: "(it) is true indeed, but that",
        meaning_vi: "'Đúng là vậy thật, nhưng mà…' — công nhận trước, phản đối sau.",
        meaning_en: "'That's true, but…' — concede first, then object.",
        register: "neutral",
      },
      {
        thai: "อาจจะไม่เชิงนะ",
        rtgs: "aat-ja mai choeng na",
        literal_en: "maybe not-quite, yeah",
        meaning_vi: "'Có lẽ không hẳn vậy đâu' — phản đối rất dịu, gần như xin lỗi.",
        meaning_en: "'Maybe not exactly' — a very gentle, almost apologetic disagreement.",
        register: "colloquial",
      },
      {
        thai: "เห็นด้วยบางส่วน",
        rtgs: "hen-duai baang-suan",
        literal_en: "agree some-part",
        meaning_vi: "Đồng ý một phần (ám chỉ phần còn lại thì không).",
        meaning_en: "Agree in part (implying the rest, not so).",
        register: "neutral",
      },
      {
        thai: "ขอเห็นต่างนิดนึงได้ไหม",
        rtgs: "khaw hen-taang nit-nueng dai mai",
        literal_en: "may (I) see-differently a-little, okay?",
        meaning_vi: "'Cho tôi có ý kiến khác một chút được không?' — xin phép bất đồng, rất lịch sự.",
        meaning_en: "'May I see it a bit differently?' — asking permission to dissent, very polite.",
        register: "formal",
      },
    ],
    examples: [
      {
        thai: "ก็จริงอยู่ครับ แต่ผมว่าเราน่าจะลองอีกทางก่อน",
        rtgs: "kaw jing yuu khrap, tae phom waa rao naa-ja long iik thaang kawn",
        vi: "Đúng là vậy thật, nhưng tôi nghĩ ta nên thử hướng khác trước.",
        en: "That's true, but I think we should try the other way first.",
        note_vi: "ครับ (khrap) ngay sau lời công nhận làm cả câu mềm hơn.",
        note_en: "Placing ครับ right after the concession softens the whole turn.",
      },
      {
        thai: "ขอเห็นต่างนิดนึงนะคะ ตรงข้อมูลตัวเลขอาจคลาดเคลื่อน",
        rtgs: "khaw hen-taang nit-nueng na kha, trong khaw-muun tua-lek aat khlaat-khluean",
        vi: "Cho em có ý kiến khác chút nhé, chỗ số liệu có thể bị sai lệch.",
        en: "Let me differ a little — the figures may be slightly off.",
      },
    ],
    tip_vi: "Không bao giờ bắt đầu bằng 'ไม่ใช่' (sai rồi) với người trên hoặc trong họp. Hãy mở bằng một sự công nhận rồi mới xoay — đó là khác biệt giữa B2 và C2.",
    tip_en: "Never open with 'ไม่ใช่' (that's wrong) to a senior or in a meeting. Lead with an acknowledgement, then pivot — that's the B2-to-C2 gap.",
  },

  // ── 4. Register shifting: matching tone to setting ──────────────────────
  {
    id: "thc2_register_shifting",
    level: "C2",
    focus: "register_shifting",
    title_vi: "Chuyển ngữ vực: khớp giọng điệu với bối cảnh",
    title_en: "Register shifting: matching tone to the setting",
    overview_vi:
      "Tiếng Thái có nhiều tầng từ vựng song song: từ đời thường (กิน 'ăn'), từ lịch sự/trang trọng (รับประทาน), và từ hoàng gia/tôn kính. Người C2 chuyển tầng mượt mà tùy người nghe và tình huống.",
    overview_en:
      "Thai has parallel vocabulary tiers: everyday (กิน 'eat'), polite/formal (รับประทาน), and royal/deferential. A C2 user shifts tiers smoothly depending on audience and situation.",
    phrases: [
      {
        thai: "กิน → ทาน → รับประทาน",
        rtgs: "kin → thaan → rap-pra-thaan",
        literal_en: "eat (plain → polite → formal)",
        meaning_vi: "Cùng nghĩa 'ăn' nhưng tăng dần độ trang trọng từ trái sang phải.",
        meaning_en: "All mean 'eat', rising in formality from left to right.",
        register: "neutral",
      },
      {
        thai: "เมีย → ภรรยา → คู่สมรส",
        rtgs: "mia → phan-ra-yaa → khuu-som-rot",
        literal_en: "wife (colloquial → formal → legal/official)",
        meaning_vi: "'Vợ': เมีย (suồng sã) → ภรรยา (lịch sự) → คู่สมรส (pháp lý/văn bản).",
        meaning_en: "'Wife': เมีย (casual) → ภรรยา (polite) → คู่สมรส (legal/official).",
        register: "neutral",
      },
      {
        thai: "หิวจัง → ดิฉันรู้สึกหิวแล้วค่ะ",
        rtgs: "hiu jang → di-chan ruu-suek hiu laeo kha",
        literal_en: "so hungry → I feel hungry already (polite-F)",
        meaning_vi: "Cùng nội dung 'đói', bản phải trang trọng hóa bằng đại từ + ค่ะ.",
        meaning_en: "Same content 'hungry'; the right version formalises it with pronoun + ค่ะ.",
        register: "formal",
      },
      {
        thai: "เอกสารฉบับนี้",
        rtgs: "ek-ka-saan cha-bap nii",
        literal_en: "document classifier this",
        meaning_vi: "'Văn bản này' — dùng lượng từ trang trọng ฉบับ thay vì อัน đời thường.",
        meaning_en: "'This document' — uses the formal classifier ฉบับ instead of everyday อัน.",
        register: "formal",
      },
    ],
    examples: [
      {
        thai: "กับเพื่อนพูดว่า 'กินข้าวยัง' แต่กับลูกค้าใช้ 'รับประทานอาหารหรือยังครับ'",
        rtgs: "kap phuean phuut waa 'kin khaao yang', tae kap luuk-khaa chai 'rap-pra-thaan aa-haan rue yang khrap'",
        vi: "Với bạn nói 'ăn cơm chưa', nhưng với khách dùng 'quý vị đã dùng bữa chưa ạ'.",
        en: "With a friend you say 'eaten yet?', but with a client 'have you dined yet, sir?'.",
        note_vi: "Cùng câu hỏi, hai ngữ vực hoàn toàn khác.",
        note_en: "Same question, two completely different registers.",
      },
      {
        thai: "ในอีเมลทางการ ควรเลี่ยงคำแสลงและใช้คำเชื่อมแบบเป็นทางการ",
        rtgs: "nai ii-meo thaang-kaan, khuan liang kham-sa-laeng lae chai kham-chueam baep pen-thaang-kaan",
        vi: "Trong email chính thức, nên tránh tiếng lóng và dùng từ nối trang trọng.",
        en: "In a formal email, avoid slang and use formal connectives.",
      },
    ],
    tip_vi: "Dấu hiệu C2 không phải là dùng từ trang trọng nhất, mà là chọn đúng tầng. Quá trang trọng với bạn bè nghe xa cách; quá suồng sã với cấp trên nghe thất lễ.",
    tip_en: "The C2 marker isn't using the most formal word — it's picking the right tier. Too formal with friends sounds cold; too casual with a superior sounds disrespectful.",
  },

  // ── 5. Politeness hierarchy: pronouns and address ───────────────────────
  {
    id: "thc2_politeness_pronouns",
    level: "C2",
    focus: "politeness_hierarchy",
    title_vi: "Thứ bậc lịch sự: đại từ và cách xưng hô",
    title_en: "Politeness hierarchy: pronouns and forms of address",
    overview_vi:
      "Hệ đại từ tiếng Thái mã hóa quan hệ quyền lực và sự thân mật. Chọn sai đại từ có thể xúc phạm hoặc nghe lả lơi. Người C2 điều chỉnh đại từ theo tuổi, địa vị và mức thân của người đối thoại.",
    overview_en:
      "Thai pronouns encode power and intimacy. The wrong pronoun can offend or sound presumptuous. A C2 user tunes pronouns to the interlocutor's age, status, and closeness.",
    phrases: [
      {
        thai: "ผม / ดิฉัน / กระผม",
        rtgs: "phom / di-chan / kra-phom",
        literal_en: "I (male / female-formal / male-very-formal)",
        meaning_vi: "'Tôi': ผม (nam, trung tính) · ดิฉัน (nữ, trang trọng) · กระผม (nam, rất kính cẩn).",
        meaning_en: "'I': ผม (male, neutral) · ดิฉัน (female, formal) · กระผม (male, highly deferential).",
        register: "formal",
      },
      {
        thai: "ท่าน",
        rtgs: "thaan",
        literal_en: "you/he (honorific)",
        meaning_vi: "Đại từ tôn kính cho người địa vị cao (quan chức, nhà sư, bậc trên).",
        meaning_en: "Honorific for high-status people (officials, monks, dignitaries).",
        register: "formal",
      },
      {
        thai: "พี่ / น้อง",
        rtgs: "phii / nong",
        literal_en: "elder-sibling / younger-sibling",
        meaning_vi: "Xưng hô theo tuổi tương đối, dùng cả với người lạ để tỏ thiện chí (như 'anh/chị – em').",
        meaning_en: "Relative-age address, used even with strangers to signal warmth (like 'older/younger sibling').",
        register: "neutral",
      },
      {
        thai: "กู / มึง",
        rtgs: "kuu / mueng",
        literal_en: "I / you (intimate-vulgar)",
        meaning_vi: "'Tao/mày' — chỉ dùng giữa bạn rất thân; dùng sai là cực kỳ thô lỗ.",
        meaning_en: "'I/you' very intimate — only among close friends; misused it is highly rude.",
        register: "intimate",
      },
    ],
    examples: [
      {
        thai: "เรียกอาจารย์ว่า 'อาจารย์' แทนการใช้ 'คุณ' เพื่อแสดงความเคารพ",
        rtgs: "riak aa-jaan waa 'aa-jaan' thaen kaan chai 'khun' phuea sa-daeng khwaam-khao-rop",
        vi: "Gọi thầy là 'อาจารย์' (thầy/cô) thay vì 'คุณ' (ông/bà) để tỏ sự kính trọng.",
        en: "Address a teacher as 'อาจารย์' rather than 'คุณ' to show respect.",
        note_vi: "Dùng chức danh thay đại từ là cách nâng mức kính trọng phổ biến.",
        note_en: "Using a title instead of a pronoun is a common way to raise deference.",
      },
      {
        thai: "กับเพื่อนสนิทใช้ 'กู–มึง' ได้ แต่ห้ามหลุดในที่ทำงานเด็ดขาด",
        rtgs: "kap phuean sa-nit chai 'kuu–mueng' dai, tae haam lut nai thii-tham-ngaan det-khaat",
        vi: "Với bạn thân có thể dùng 'tao–mày', nhưng tuyệt đối đừng lỡ miệng ở chỗ làm.",
        en: "With close friends 'kuu–mueng' is fine, but never let it slip at work.",
      },
    ],
    tip_vi: "Khi chưa chắc, chọn พี่/น้อง theo tuổi hoặc dùng tên + คุณ. An toàn hơn nhiều so với đoán sai về phía suồng sã.",
    tip_en: "When unsure, default to พี่/น้อง by relative age, or name + คุณ. Far safer than guessing wrong toward casual.",
  },

  // ── 6. Hedging: calibrating certainty ───────────────────────────────────
  {
    id: "thc2_hedging_certainty",
    level: "C2",
    focus: "hedging",
    title_vi: "Rào đón: hiệu chỉnh mức độ chắc chắn",
    title_en: "Hedging: calibrating certainty",
    overview_vi:
      "Người C2 hiếm khi nói tuyệt đối. Họ gắn các trợ từ phỏng đoán (น่าจะ, คงจะ, ราว ๆ) để báo mức tin cậy và tránh bị bắt lỗi nếu sai. Mỗi rào đón có một 'nhiệt độ' chắc chắn khác nhau.",
    overview_en:
      "C2 speakers rarely speak in absolutes. They attach epistemic markers (น่าจะ, คงจะ, ราว ๆ) to signal confidence and avoid being pinned down. Each hedge has a different 'temperature' of certainty.",
    phrases: [
      {
        thai: "น่าจะ",
        rtgs: "naa-ja",
        literal_en: "ought-to / likely",
        meaning_vi: "'Có lẽ / chắc là' — phỏng đoán có cơ sở, độ tin trung bình-cao.",
        meaning_en: "'Probably / likely' — a reasoned guess, medium-high confidence.",
        register: "neutral",
      },
      {
        thai: "คงจะ",
        rtgs: "khong ja",
        literal_en: "presumably will",
        meaning_vi: "'Chắc là' — phỏng đoán dựa trên kỳ vọng, hơi kém chắc hơn น่าจะ một chút.",
        meaning_en: "'Presumably' — a guess based on expectation, slightly less sure than น่าจะ.",
        register: "neutral",
      },
      {
        thai: "ราว ๆ / ประมาณ",
        rtgs: "raao-raao / pra-maan",
        literal_en: "around / approximately",
        meaning_vi: "'Khoảng / chừng' — rào đón về số lượng, thời gian (~).",
        meaning_en: "'About / roughly' — hedges quantity or time (~).",
        register: "neutral",
      },
      {
        thai: "เท่าที่ทราบ",
        rtgs: "thao-thii saap",
        literal_en: "as-much-as (I) know",
        meaning_vi: "'Theo những gì tôi biết' — giới hạn lời khẳng định trong hiểu biết của mình.",
        meaning_en: "'As far as I know' — limits the claim to one's own knowledge.",
        register: "formal",
      },
    ],
    examples: [
      {
        thai: "โครงการนี้น่าจะเสร็จราว ๆ เดือนหน้า แต่ยังไม่ฟันธง",
        rtgs: "khrong-kaan nii naa-ja set raao-raao duean-naa, tae yang mai fan-thong",
        vi: "Dự án này chắc xong khoảng tháng sau, nhưng chưa chốt chắc.",
        en: "This project will likely finish around next month, but it's not nailed down.",
        note_vi: "ฟันธง (fan-thong) = 'chốt chắc'; phủ định nó tăng thêm một lớp rào đón.",
        note_en: "ฟันธง means 'to state definitively'; negating it adds a second hedge layer.",
      },
      {
        thai: "เท่าที่ทราบ ทางบริษัทยังไม่ได้ประกาศอย่างเป็นทางการ",
        rtgs: "thao-thii saap, thaang baw-ri-sat yang mai dai pra-kaat yaang pen-thaang-kaan",
        vi: "Theo tôi biết, công ty vẫn chưa công bố chính thức.",
        en: "As far as I know, the company hasn't announced it officially.",
      },
    ],
    tip_vi: "Lạm dụng rào đón nghe thiếu tự tin; thiếu rào đón nghe ngạo mạn. C2 là biết khi nào bỏ rào (để cam kết) và khi nào giữ rào (để an toàn).",
    tip_en: "Over-hedging sounds timid; under-hedging sounds arrogant. C2 is knowing when to drop the hedge (to commit) and when to keep it (to stay safe).",
  },

  // ── 7. Indirectness: face-saving and เกรงใจ ─────────────────────────────
  {
    id: "thc2_indirectness_kreng_jai",
    level: "C2",
    focus: "indirectness",
    title_vi: "Gián tiếp: giữ thể diện và văn hóa เกรงใจ",
    title_en: "Indirectness: face-saving and the เกรงใจ ethic",
    overview_vi:
      "เกรงใจ (kreng-jai) — sự nể nang, ngại làm phiền — chi phối phần lớn lời nói gián tiếp của người Thái. Người C2 dùng nó để đưa yêu cầu, từ chối, hoặc nhờ vả mà không gây áp lực cho người nghe.",
    overview_en:
      "เกรงใจ (kreng-jai) — deference and reluctance to impose — drives much of Thai indirectness. C2 speakers use it to make requests, refuse, or ask favours without pressuring the listener.",
    phrases: [
      {
        thai: "เกรงใจ",
        rtgs: "kreng-jai",
        literal_en: "awe-heart",
        meaning_vi: "Ngại làm phiền, nể nang, không muốn gây bất tiện cho người khác.",
        meaning_en: "Reluctance to impose; consideration that holds you back from troubling others.",
        register: "neutral",
      },
      {
        thai: "ถ้าไม่เป็นการรบกวนเกินไป",
        rtgs: "thaa mai pen kaan-rop-kuan koen-pai",
        literal_en: "if (it) is not too much of a disturbance",
        meaning_vi: "'Nếu không quá làm phiền' — mở đầu yêu cầu một cách rào trước.",
        meaning_en: "'If it's not too much trouble' — a pre-emptive softener before a request.",
        register: "formal",
      },
      {
        thai: "ไม่อยากรบกวน",
        rtgs: "mai yaak rop-kuan",
        literal_en: "not want to disturb",
        meaning_vi: "'Tôi không muốn làm phiền' — tỏ thiện chí trước khi (vẫn) nhờ.",
        meaning_en: "'I don't want to bother you' — signals goodwill before (still) asking.",
        register: "neutral",
      },
      {
        thai: "แล้วแต่สะดวกเลยนะ",
        rtgs: "laeo-tae sa-duak loei na",
        literal_en: "depends-on (your) convenience, yeah",
        meaning_vi: "'Tùy bạn tiện thôi nhé' — trao quyền quyết định cho người nghe để giảm áp lực.",
        meaning_en: "'Whatever's convenient for you' — hands the decision to the listener to ease pressure.",
        register: "colloquial",
      },
    ],
    examples: [
      {
        thai: "ผมเกรงใจ เลยไม่กล้ารบกวนให้ช่วยตอนดึก",
        rtgs: "phom kreng-jai, loei mai klaa rop-kuan hai chuai tawn duek",
        vi: "Tôi ngại làm phiền nên không dám nhờ giúp lúc khuya.",
        en: "Out of kreng-jai, I didn't dare trouble you for help late at night.",
        note_vi: "เกรงใจ là lý do được nêu thẳng — người Thái xem đó là phép lịch sự, không phải yếu đuối.",
        note_en: "Naming เกรงใจ as the reason is itself polite in Thai — not seen as weakness.",
      },
      {
        thai: "ถ้าไม่เป็นการรบกวนเกินไป ขอรบกวนช่วยตรวจเอกสารหน่อยได้ไหมครับ",
        rtgs: "thaa mai pen kaan-rop-kuan koen-pai, khaw rop-kuan chuai truat ek-ka-saan noi dai mai khrap",
        vi: "Nếu không quá làm phiền, cho tôi nhờ kiểm tra giúp tài liệu một chút được không ạ?",
        en: "If it's not too much trouble, may I trouble you to check the document a bit?",
      },
    ],
    tip_vi: "Để ý: người Thái thường nói 'ไม่เป็นไร' (không sao đâu) khi thực ra có sao. เกรงใจ khiến họ giảm nhẹ nhu cầu của mình — hãy hỏi lại nhẹ nhàng để xác nhận.",
    tip_en: "Watch for 'ไม่เป็นไร' (it's fine) when it isn't. เกรงใจ makes people downplay their own needs — gently re-check to confirm.",
  },

  // ── 8. Formal argument: connectives for structured reasoning ────────────
  {
    id: "thc2_formal_argument",
    level: "C2",
    focus: "formal_argument",
    title_vi: "Lập luận trang trọng: từ nối cho lý lẽ có cấu trúc",
    title_en: "Formal argument: connectives for structured reasoning",
    overview_vi:
      "Văn nghị luận và bài nói trang trọng dựa vào một bộ từ nối riêng, khác hẳn khẩu ngữ. Người C2 dùng chúng để dẫn dắt lý lẽ: nêu nguyên nhân, nhượng bộ, đối lập, và kết luận.",
    overview_en:
      "Formal writing and speech rely on a distinct set of connectives, quite unlike casual speech. C2 users deploy them to steer an argument: cause, concession, contrast, and conclusion.",
    phrases: [
      {
        thai: "เนื่องจาก",
        rtgs: "nueang-jaak",
        literal_en: "owing to",
        meaning_vi: "'Do / bởi vì' — nêu nguyên nhân, trang trọng hơn เพราะ.",
        meaning_en: "'Owing to / because' — states a cause, more formal than เพราะ.",
        register: "formal",
      },
      {
        thai: "อย่างไรก็ตาม",
        rtgs: "yaang-rai kaw taam",
        literal_en: "however it may be",
        meaning_vi: "'Tuy nhiên' — chuyển sang ý đối lập trong văn trang trọng.",
        meaning_en: "'However / nonetheless' — pivots to a contrasting point in formal prose.",
        register: "formal",
      },
      {
        thai: "กล่าวคือ",
        rtgs: "klaao khue",
        literal_en: "to-say is",
        meaning_vi: "'Tức là / cụ thể là' — dẫn vào phần giải thích, làm rõ.",
        meaning_en: "'That is to say / namely' — introduces a clarification.",
        register: "formal",
      },
      {
        thai: "ในทางกลับกัน",
        rtgs: "nai thaang klap-kan",
        literal_en: "in the reverse direction",
        meaning_vi: "'Ngược lại / mặt khác' — nêu góc đối lập cân bằng.",
        meaning_en: "'Conversely / on the other hand' — presents a balancing opposite.",
        register: "formal",
      },
    ],
    examples: [
      {
        thai: "เนื่องจากข้อมูลยังไม่ครบ จึงยังไม่อาจสรุปได้ในขณะนี้",
        rtgs: "nueang-jaak khaw-muun yang mai khrop, jueng yang mai aat sa-rup dai nai kha-na nii",
        vi: "Do dữ liệu chưa đầy đủ nên hiện chưa thể kết luận.",
        en: "Owing to incomplete data, no conclusion can yet be drawn at this time.",
        note_vi: "Cặp เนื่องจาก…จึง… (do…nên…) là khung nhân-quả chuẩn của văn trang trọng.",
        note_en: "The pair เนื่องจาก…จึง… (because…therefore…) is the standard formal cause-effect frame.",
      },
      {
        thai: "อย่างไรก็ตาม ข้อเสนอนี้ยังมีข้อจำกัดบางประการที่ต้องพิจารณา",
        rtgs: "yaang-rai kaw taam, khaw-sa-noe nii yang mii khaw-jam-kat baang pra-kaan thii tong phi-jaa-ra-naa",
        vi: "Tuy nhiên, đề xuất này vẫn có một số hạn chế cần cân nhắc.",
        en: "Nonetheless, this proposal still has certain limitations to consider.",
      },
    ],
    tip_vi: "Đừng trộn từ nối khẩu ngữ (แล้วก็, ก็เลย) vào bài nói trang trọng. Bộ từ nối là thước đo nhanh để người nghe Thái xếp bạn vào 'có học thức'.",
    tip_en: "Don't mix casual connectives (แล้วก็, ก็เลย) into formal speech. Your connective set is a quick gauge by which Thai listeners read you as 'educated'.",
  },

  // ── 9. Pragmatic particles: the tone-bearing tail ───────────────────────
  {
    id: "thc2_pragmatic_particles",
    level: "C2",
    focus: "pragmatic_nuance",
    title_vi: "Trợ từ ngữ dụng: cái đuôi mang sắc thái",
    title_en: "Pragmatic particles: the tone-bearing tail",
    overview_vi:
      "Trợ từ cuối câu (นะ, สิ, ล่ะ, หรอก, เถอะ, แหละ) gần như không dịch được nhưng quyết định toàn bộ thái độ của câu: dỗ dành, thúc giục, phản bác, hay nhấn mạnh. Đây là một trong những tầng khó nhất của C2.",
    overview_en:
      "Sentence-final particles (นะ, สิ, ล่ะ, หรอก, เถอะ, แหละ) are nearly untranslatable yet set a sentence's entire attitude: coaxing, urging, rebutting, or emphatic. This is one of the hardest C2 layers.",
    phrases: [
      {
        thai: "นะ",
        rtgs: "na",
        literal_en: "(softening particle)",
        meaning_vi: "Làm mềm, tạo sự thân thiện hoặc dỗ dành: 'nhé / nha'.",
        meaning_en: "Softens; adds friendliness or coaxing: '…, okay? / …, you know'.",
        register: "colloquial",
      },
      {
        thai: "สิ",
        rtgs: "si",
        literal_en: "(urging/assertive particle)",
        meaning_vi: "Thúc giục hoặc khẳng định mạnh: 'đi mà / chứ còn gì'.",
        meaning_en: "Urges or asserts strongly: '…, go on / …, of course'.",
        register: "colloquial",
      },
      {
        thai: "หรอก",
        rtgs: "rok",
        literal_en: "(corrective/reassuring particle)",
        meaning_vi: "Dùng với phủ định để cải chính hoặc trấn an: 'đâu (mà)'.",
        meaning_en: "Used with negation to correct or reassure: '…, not really / …, don't worry'.",
        register: "colloquial",
      },
      {
        thai: "เถอะ",
        rtgs: "thoe",
        literal_en: "(let's / go-ahead particle)",
        meaning_vi: "Rủ rê hoặc cho phép nhẹ nhàng: 'thôi / đi nào'.",
        meaning_en: "Gently suggests or permits: 'let's… / go ahead and…'.",
        register: "colloquial",
      },
    ],
    examples: [
      {
        thai: "ไปเถอะนะ เดี๋ยวสายแล้ว",
        rtgs: "pai thoe na, diao saai laeo",
        vi: "Đi thôi nào, sắp trễ rồi.",
        en: "Let's go, come on — we'll be late.",
        note_vi: "เถอะ + นะ chồng nhau: rủ rê (เถอะ) rồi làm mềm thêm (นะ).",
        note_en: "Stacking เถอะ + นะ: suggest (เถอะ), then soften further (นะ).",
      },
      {
        thai: "ไม่ได้โกรธหรอก แค่เหนื่อยนิดหน่อย",
        rtgs: "mai dai groot rok, khae nueai nit-noi",
        vi: "Có giận đâu, chỉ hơi mệt thôi.",
        en: "I'm not angry, really — just a little tired.",
        note_vi: "หรอก biến lời phủ định thành lời trấn an, không phải phản bác gay gắt.",
        note_en: "หรอก turns the negation into reassurance, not a sharp rebuttal.",
      },
    ],
    tip_vi: "Cùng một câu, đổi trợ từ cuối là đổi cả quan hệ. Học trợ từ theo cặp ngữ cảnh (lúc nào dùng, với ai), đừng học như từ điển.",
    tip_en: "Same sentence, swap the final particle, and you change the whole relationship. Learn particles by context pairs (when, with whom), not as dictionary glosses.",
  },

  // ── 10. Softening requests and commands ─────────────────────────────────
  {
    id: "thc2_softening_requests",
    level: "C2",
    focus: "indirectness",
    title_vi: "Làm dịu yêu cầu và mệnh lệnh",
    title_en: "Softening requests and commands",
    overview_vi:
      "Mệnh lệnh trần trụi nghe rất gắt trong tiếng Thái. Người C2 bọc yêu cầu bằng ช่วย ('giúp'), หน่อย ('một chút'), và đuôi hỏi ได้ไหม ('được không') để biến lệnh thành lời nhờ.",
    overview_en:
      "Bare imperatives sound harsh in Thai. C2 speakers wrap requests in ช่วย ('help'), หน่อย ('a little'), and the tag ได้ไหม ('is that okay?') to turn a command into a favour.",
    phrases: [
      {
        thai: "ช่วย...หน่อย",
        rtgs: "chuai … noi",
        literal_en: "help … a little",
        meaning_vi: "Khung nhờ vả chuẩn: 'giúp … một chút' — làm dịu mệnh lệnh.",
        meaning_en: "The standard request frame: 'help … a little' — softens a command.",
        register: "neutral",
      },
      {
        thai: "...ได้ไหม / ...ได้หรือเปล่า",
        rtgs: "… dai mai / … dai rue plao",
        literal_en: "… can (you)? / … can or not?",
        meaning_vi: "Đuôi hỏi biến lệnh thành lời mời, chừa quyền từ chối cho người nghe.",
        meaning_en: "A question tag turning a command into an invitation, leaving room to decline.",
        register: "neutral",
      },
      {
        thai: "รบกวน...",
        rtgs: "rop-kuan …",
        literal_en: "trouble (you to) …",
        meaning_vi: "'Phiền … ' — mở đầu yêu cầu lịch sự, thừa nhận mình đang làm phiền.",
        meaning_en: "'May I trouble you to …' — a polite request opener that admits the imposition.",
        register: "formal",
      },
      {
        thai: "ถ้าสะดวก...",
        rtgs: "thaa sa-duak …",
        literal_en: "if (it's) convenient …",
        meaning_vi: "'Nếu tiện … ' — gắn điều kiện để người nghe dễ từ chối.",
        meaning_en: "'If it's convenient …' — adds a condition so the listener can easily decline.",
        register: "neutral",
      },
    ],
    examples: [
      {
        thai: "ช่วยส่งไฟล์ให้หน่อยได้ไหมคะ",
        rtgs: "chuai song fai hai noi dai mai kha",
        vi: "Giúp gửi file cho mình một chút được không?",
        en: "Could you help send me the file, please?",
        note_vi: "ช่วย + หน่อย + ได้ไหม + คะ: bốn lớp làm dịu chồng lên một yêu cầu đơn giản.",
        note_en: "ช่วย + หน่อย + ได้ไหม + คะ: four softening layers on one simple request.",
      },
      {
        thai: "รบกวนช่วยปิดแอร์ให้ด้วยนะครับ ถ้าสะดวก",
        rtgs: "rop-kuan chuai pit ae hai duai na khrap, thaa sa-duak",
        vi: "Phiền giúp tắt máy lạnh giúp mình nhé, nếu tiện.",
        en: "Would you mind turning off the AC, please — if it's convenient.",
      },
    ],
    tip_vi: "Bỏ หน่อย hay ได้ไหม khỏi một yêu cầu là cách nhanh nhất nghe ra lệnh. Khi nghi ngờ, thêm một lớp dịu — thừa lịch sự an toàn hơn thiếu.",
    tip_en: "Dropping หน่อย or ได้ไหม from a request is the fastest way to sound like you're giving orders. When in doubt, add a softener — excess politeness is safer than too little.",
  },

  // ── 11. Concession and qualification in argument ────────────────────────
  {
    id: "thc2_concession_qualification",
    level: "C2",
    focus: "formal_argument",
    title_vi: "Nhượng bộ và hạn định trong lập luận",
    title_en: "Concession and qualification in argument",
    overview_vi:
      "Lập luận trưởng thành thừa nhận phía đối lập trước khi phản biện. Người C2 dùng ถึงแม้ว่า ('mặc dù'), แม้กระทั่ง ('thậm chí'), ทั้งนี้ ('theo đó') để nhượng bộ có kiểm soát rồi giữ vững luận điểm.",
    overview_en:
      "Mature argument concedes the other side before rebutting. C2 users deploy ถึงแม้ว่า ('although'), แม้กระทั่ง ('even'), ทั้งนี้ ('that said / accordingly') to concede in a controlled way, then hold the line.",
    phrases: [
      {
        thai: "ถึงแม้ว่า...ก็ตาม",
        rtgs: "thueng-mae waa … kaw taam",
        literal_en: "although … (it) may be",
        meaning_vi: "'Mặc dù … thì cũng' — khung nhượng bộ trang trọng, đầy đủ.",
        meaning_en: "'Even though … still' — a full, formal concession frame.",
        register: "formal",
      },
      {
        thai: "แม้กระทั่ง",
        rtgs: "mae kra-thang",
        literal_en: "even up-to",
        meaning_vi: "'Thậm chí (cả)' — đẩy nhượng bộ đến trường hợp cực đoan để củng cố luận điểm.",
        meaning_en: "'Even' — pushes the concession to an extreme case to strengthen the point.",
        register: "formal",
      },
      {
        thai: "ทั้งนี้",
        rtgs: "thang-nii",
        literal_en: "all this / accordingly",
        meaning_vi: "'Theo đó / tuy vậy' — gắn một điều kiện hoặc bảo lưu vào ý vừa nêu.",
        meaning_en: "'That said / accordingly' — attaches a condition or caveat to what was just stated.",
        register: "formal",
      },
      {
        thai: "ในระดับหนึ่ง",
        rtgs: "nai ra-dap nueng",
        literal_en: "at one level",
        meaning_vi: "'Ở một mức độ nào đó' — hạn định lời đồng ý, không cam kết toàn phần.",
        meaning_en: "'To some extent' — qualifies agreement without fully committing.",
        register: "neutral",
      },
    ],
    examples: [
      {
        thai: "ถึงแม้ว่าต้นทุนจะสูงก็ตาม ผลลัพธ์ระยะยาวก็คุ้มค่า",
        rtgs: "thueng-mae waa ton-thun ja suung kaw taam, phon-lap ra-ya-yaao kaw khum-khaa",
        vi: "Mặc dù chi phí cao, kết quả dài hạn vẫn đáng giá.",
        en: "Although the cost is high, the long-term outcome is still worth it.",
        note_vi: "Nhượng bộ điểm yếu (chi phí) trước khiến phản biện sau nghe khách quan hơn.",
        note_en: "Conceding the weak point (cost) first makes the rebuttal sound more objective.",
      },
      {
        thai: "ผมเห็นด้วยในระดับหนึ่ง ทั้งนี้ต้องดูบริบทประกอบด้วย",
        rtgs: "phom hen-duai nai ra-dap nueng, thang-nii tong duu baw-ri-bot pra-kop duai",
        vi: "Tôi đồng ý ở một mức độ nào đó, tuy vậy còn phải xét cả ngữ cảnh.",
        en: "I agree to some extent; that said, the context must be taken into account too.",
      },
    ],
    tip_vi: "Cấu trúc 'nhượng bộ rồi phản biện' khiến bạn nghe công bằng và khó bị phản bác hơn. Nêu điểm mạnh nhất của đối phương trước, rồi vượt qua nó.",
    tip_en: "The 'concede-then-rebut' structure makes you sound fair and harder to counter. State the opponent's strongest point first, then go beyond it.",
  },

  // ── 12. Irony, understatement, and subtext ──────────────────────────────
  {
    id: "thc2_irony_understatement",
    level: "C2",
    focus: "pragmatic_nuance",
    title_vi: "Mỉa mai, nói giảm, và ẩn ý",
    title_en: "Irony, understatement, and subtext",
    overview_vi:
      "ประชด (pra-chot) — nói mỉa — và nói giảm là vũ khí tinh vi. Người C2 nhận ra khi lời khen thực chất là chê, và khi câu nhẹ nhàng đang che một phê phán nặng. Sai ngữ điệu thì mỉa mai dễ thành xúc phạm.",
    overview_en:
      "ประชด (sarcasm) and understatement are subtle tools. A C2 user recognises when praise is really criticism, and when a mild sentence masks a heavy judgement. Misjudge the tone and irony tips into insult.",
    phrases: [
      {
        thai: "ประชด",
        rtgs: "pra-chot",
        literal_en: "to be sarcastic",
        meaning_vi: "Nói mỉa, nói kháy — nói điều ngược với ý thật để châm chọc.",
        meaning_en: "To speak sarcastically — say the opposite of what's meant to needle someone.",
        register: "colloquial",
      },
      {
        thai: "เก่งจังเลยนะ",
        rtgs: "keng jang loei na",
        literal_en: "so clever, huh",
        meaning_vi: "'Giỏi ghê nhỉ' — tùy ngữ điệu, có thể là khen thật hoặc mỉa (giỏi… gây rối).",
        meaning_en: "'So clever' — depending on tone, genuine praise or sarcasm ('clever'… at messing up).",
        register: "colloquial",
      },
      {
        thai: "ก็ดีนะ... (น้ำเสียงประชด)",
        rtgs: "kaw dii na … (nam-siang pra-chot)",
        literal_en: "well, (it's) good … (sarcastic tone)",
        meaning_vi: "'Cũng hay đấy…' nói với giọng kháy = thực ra không hay chút nào.",
        meaning_en: "'Well, that's nice…' said in a dry tone = actually not nice at all.",
        register: "colloquial",
      },
      {
        thai: "ก็พอได้อยู่",
        rtgs: "kaw phaw dai yuu",
        literal_en: "well, just about works",
        meaning_vi: "'Cũng tạm được' — nói giảm; thường ngụ ý 'chỉ ở mức chấp nhận, không hơn'.",
        meaning_en: "'It'll do' — understatement; usually implies 'merely acceptable, no more'.",
        register: "colloquial",
      },
    ],
    examples: [
      {
        thai: "มาสายอีกแล้ว เก่งจังเลยนะ",
        rtgs: "maa saai iik laeo, keng jang loei na",
        vi: "Lại đến trễ nữa, giỏi ghê nhỉ.",
        en: "Late again — well aren't you impressive.",
        note_vi: "Khen 'giỏi' ngay sau lỗi = mỉa. Ngữ cảnh, không phải từ ngữ, mang ý.",
        note_en: "Praise ('clever') right after a fault = sarcasm. Context, not the words, carries the meaning.",
      },
      {
        thai: "อาหารร้านนี้ก็พอได้อยู่ ไม่ได้ถึงกับแย่",
        rtgs: "aa-haan raan nii kaw phaw dai yuu, mai dai thueng kap yae",
        vi: "Đồ ăn quán này cũng tạm, không đến nỗi tệ.",
        en: "The food here is okay-ish — not exactly bad.",
        note_vi: "'Tạm được, không tệ' là nói giảm cho 'khá bình thường' — khen lấy lệ.",
        note_en: "'Okay, not bad' understates 'rather mediocre' — faint praise.",
      },
    ],
    tip_vi: "Mỉa mai trong tiếng Thái dựa nhiều vào ngữ điệu và nét mặt hơn là từ ngữ. Nếu lời khen lệch với hoàn cảnh, hãy nghi ngờ ประชด trước khi hiểu theo nghĩa đen.",
    tip_en: "Thai irony leans on tone and facial cues more than wording. If praise clashes with the situation, suspect ประชด before taking it literally.",
  },
];

export default lessons;
