// Thai risky-phrase safety guide — Vietnamese-first (L1 = Vietnamese),
// English companion fields throughout.
//
// SCOPE / STATUS: A *study-support* guide flagging phrasing/behaviour that can
// come across as rude, presumptuous, or unsafe for learners, each paired with a
// safer alternative. NOT native-certified authority; native review is DEFERRED.
// These are general communication-risk patterns, NOT claims or stereotypes
// about any group of people. Romanization is a reading aid, not a standard.
//
// Self-contained on purpose: the Thai folder ships no shared registry yet, so
// the types are declared inline.
//
// Each entry carries: the risky phrase/behaviour, WHY it's risky, a SAFER
// alternative (Thai script), and a CONTEXT note. `risky.thai` is present for
// utterance-based risks and omitted for pure-behaviour risks (e.g. pointing
// feet); `safer.thai` is always present.
//
// Topics: rude pronouns, too-direct commands, status/hierarchy, apology,
// refusal, temple/formal contexts, workplace respect.

export type RiskTopic =
  | "rude_pronouns"
  | "too_direct_commands"
  | "status_hierarchy"
  | "apology"
  | "refusal"
  | "temple_formal"
  | "workplace_respect";

export type RiskSeverity = "low" | "medium" | "high";

// A phrase block. `thai` authoritative; `rtgs` a reading aid. For pure-behaviour
// risks, `risky.thai` may be omitted (the risk is an action, not words).
export type Phrase = {
  thai?: string;
  rtgs?: string;
  vi: string; // Vietnamese meaning / description
  en: string; // English meaning / description
};

export type RiskyPhraseEntry = {
  id: string;
  topic: RiskTopic;
  severity: RiskSeverity;
  risky: Phrase;
  why_risky_vi: string;
  why_risky_en: string;
  safer: Phrase; // always carries Thai script
  context_vi: string;
  context_en: string;
};

export const TOPIC_ORDER: RiskTopic[] = [
  "rude_pronouns",
  "too_direct_commands",
  "status_hierarchy",
  "apology",
  "refusal",
  "temple_formal",
  "workplace_respect",
];

export const entries: RiskyPhraseEntry[] = [
  // ───────────────── rude_pronouns ─────────────────
  {
    id: "thx_rp_01",
    topic: "rude_pronouns",
    severity: "high",
    risky: {
      thai: "มึง / กู",
      rtgs: "mueng / kuu",
      vi: "mày / tao",
      en: "you / I (intimate-vulgar)",
    },
    why_risky_vi: "Với người lạ hoặc cấp trên, cặp này nghe rất thô tục và gây xúc phạm.",
    why_risky_en: "With strangers or seniors, this pair sounds vulgar and gives offence.",
    safer: {
      thai: "คุณ / ผม / ดิฉัน",
      rtgs: "khun / phom / di-chan",
      vi: "bạn / tôi (nam / nữ)",
      en: "you / I (male / female)",
    },
    context_vi: "Chỉ dùng « มึง/กู » giữa bạn bè rất thân, đồng trang lứa, trong không khí đùa.",
    context_en: "Reserve « มึง/กู » for very close, same-age friends in a joking mood.",
  },
  {
    id: "thx_rp_02",
    topic: "rude_pronouns",
    severity: "medium",
    risky: {
      thai: "แก",
      rtgs: "kae",
      vi: "'mày/bà' (suồng sã) — dùng với người lớn tuổi",
      en: "'you' (familiar) — used to an elder",
    },
    why_risky_vi: "« แก » thân mật giữa bạn bè, nhưng với người lớn tuổi/cấp trên nghe thiếu tôn trọng.",
    why_risky_en: "« แก » is friendly among peers, but to an elder/senior it sounds disrespectful.",
    safer: {
      thai: "พี่ / คุณ",
      rtgs: "phii / khun",
      vi: "anh/chị / bạn (lịch sự)",
      en: "older one / you (polite)",
    },
    context_vi: "Với người hơn tuổi, « พี่ » vừa thân vừa kính.",
    context_en: "For someone older, « พี่ » is both warm and respectful.",
  },
  {
    id: "thx_rp_03",
    topic: "rude_pronouns",
    severity: "medium",
    risky: {
      thai: "มัน (chỉ người)",
      rtgs: "man",
      vi: "'nó' dùng để chỉ một người",
      en: "'it' used to refer to a person",
    },
    why_risky_vi: "Gọi người bằng « มัน » hạ thấp họ, nghe khinh miệt (trừ khi rất thân, đùa).",
    why_risky_en: "Calling a person « มัน » demeans them and sounds contemptuous (unless very close, joking).",
    safer: {
      thai: "เขา",
      rtgs: "khao",
      vi: "anh ấy / cô ấy / họ",
      en: "he / she / they",
    },
    context_vi: "Dùng « เขา » cho ngôi thứ ba lịch sự, an toàn với mọi người.",
    context_en: "Use « เขา » for a polite third person, safe for anyone.",
  },
  {
    id: "thx_rp_04",
    topic: "rude_pronouns",
    severity: "high",
    risky: {
      thai: "ไอ้ + ชื่อ",
      rtgs: "ai + chue",
      vi: "tiền tố « ไอ้ » trước tên (mang nghĩa khinh)",
      en: "the prefix « ไอ้ » before a name (derogatory)",
    },
    why_risky_vi: "« ไอ้ » trước tên thường mang sắc thái khinh hoặc chửi; dễ gây gổ.",
    why_risky_en: "« ไอ้ » before a name usually carries a contemptuous/abusive tone; can provoke conflict.",
    safer: {
      thai: "คุณ + ชื่อ",
      rtgs: "khun + chue",
      vi: "« คุณ » + tên (lịch sự)",
      en: "« khun » + name (polite)",
    },
    context_vi: "Giữa bạn thân nam, « ไอ้ » đôi khi là trêu đùa — nhưng người ngoài đừng bắt chước.",
    context_en: "Among close male friends « ไอ้ » can be teasing — but outsiders shouldn't copy it.",
  },
  {
    id: "thx_rp_05",
    topic: "rude_pronouns",
    severity: "low",
    risky: {
      thai: "น้อง (với người rõ ràng lớn tuổi hơn)",
      rtgs: "nong",
      vi: "gọi « em » với người rõ ràng lớn tuổi hơn",
      en: "calling someone clearly older « younger sibling »",
    },
    why_risky_vi: "Gọi người lớn tuổi hơn là « น้อง » hạ vai vế họ, có thể làm phật ý.",
    why_risky_en: "Calling an older person « น้อง » lowers their standing and may offend.",
    safer: {
      thai: "พี่",
      rtgs: "phii",
      vi: "anh/chị",
      en: "older one",
    },
    context_vi: "Khi không chắc tuổi, đoán nghiêng về « พี่ » an toàn hơn.",
    context_en: "When unsure of age, erring toward « พี่ » is safer.",
  },
  {
    id: "thx_rp_06",
    topic: "rude_pronouns",
    severity: "low",
    risky: {
      thai: "ตัวเอง (với người mới quen)",
      rtgs: "tua-eng",
      vi: "dùng « ตัวเอง » làm 'cậu/mình' với người mới quen",
      en: "using « ตัวเอง » as 'you' with a new acquaintance",
    },
    why_risky_vi: "« ตัวเอง » mang sắc thái tình cảm/thân mật; với người lạ nghe lả lơi hoặc kỳ.",
    why_risky_en: "« ตัวเอง » carries an affectionate/intimate tone; with strangers it sounds flirty or odd.",
    safer: {
      thai: "คุณ",
      rtgs: "khun",
      vi: "bạn (trung tính, lịch sự)",
      en: "you (neutral, polite)",
    },
    context_vi: "« ตัวเอง » hợp giữa người yêu hoặc bạn nữ rất thân.",
    context_en: "« ตัวเอง » fits couples or very close (often female) friends.",
  },
  {
    id: "thx_rp_07",
    topic: "rude_pronouns",
    severity: "medium",
    risky: {
      thai: "เอ็ง / ข้า",
      rtgs: "eng / khaa",
      vi: "'ngươi / ta' (cổ/thô)",
      en: "'thou / I' (archaic/rough)",
    },
    why_risky_vi: "Nghe cổ hoặc trịch thượng trong đời thường; dễ tạo khoảng cách hoặc gây hiểu lầm.",
    why_risky_en: "Sounds archaic or condescending in everyday speech; creates distance or misreads.",
    safer: {
      thai: "คุณ / ผม",
      rtgs: "khun / phom",
      vi: "bạn / tôi",
      en: "you / I",
    },
    context_vi: "Chủ yếu gặp trong phim cổ trang, tục ngữ — không dùng giao tiếp hiện đại.",
    context_en: "Mostly seen in period dramas/proverbs — not for modern conversation.",
  },

  // ───────────────── too_direct_commands ─────────────────
  {
    id: "thx_dc_01",
    topic: "too_direct_commands",
    severity: "medium",
    risky: {
      thai: "ทำเดี๋ยวนี้",
      rtgs: "tham diao-nii",
      vi: "Làm ngay bây giờ.",
      en: "Do it right now.",
    },
    why_risky_vi: "Mệnh lệnh trần không có lớp dịu nghe gắt và áp đặt, nhất là với người ngang/​trên.",
    why_risky_en: "A bare imperative with no softener sounds harsh and pushy, especially to peers/seniors.",
    safer: {
      thai: "ช่วยทำตอนนี้หน่อยได้ไหมครับ",
      rtgs: "chuai tham tawn-nii noi dai mai khrap",
      vi: "Giúp làm bây giờ một chút được không ạ?",
      en: "Could you do it now, please?",
    },
    context_vi: "Thêm ช่วย + หน่อย + ได้ไหม biến lệnh thành lời nhờ.",
    context_en: "Adding ช่วย + หน่อย + ได้ไหม turns a command into a request.",
  },
  {
    id: "thx_dc_02",
    topic: "too_direct_commands",
    severity: "medium",
    risky: {
      thai: "มานี่",
      rtgs: "maa nii",
      vi: "Lại đây.",
      en: "Come here.",
    },
    why_risky_vi: "Cộc lủn như gọi trẻ con hoặc ra lệnh; với người lớn nghe bất lịch sự.",
    why_risky_en: "Curt, like summoning a child or ordering; to an adult it sounds impolite.",
    safer: {
      thai: "ขอเชิญมาทางนี้หน่อยครับ",
      rtgs: "khaw-choen maa thaang-nii noi khrap",
      vi: "Mời anh/chị lại phía này một chút ạ.",
      en: "Please come this way.",
    },
    context_vi: "Trong dịch vụ/đón tiếp, « ขอเชิญ » nghe trang nhã.",
    context_en: "In service/hosting, « ขอเชิญ » sounds gracious.",
  },
  {
    id: "thx_dc_03",
    topic: "too_direct_commands",
    severity: "medium",
    risky: {
      thai: "เงียบ",
      rtgs: "ngiap",
      vi: "Im đi.",
      en: "Be quiet.",
    },
    why_risky_vi: "Ra lệnh im lặng trực diện làm người nghe mất mặt.",
    why_risky_en: "A blunt order to be silent makes the listener lose face.",
    safer: {
      thai: "รบกวนเบาเสียงลงหน่อยได้ไหมครับ",
      rtgs: "rop-kuan bao siang long noi dai mai khrap",
      vi: "Phiền nói nhỏ lại một chút được không ạ?",
      en: "Could I ask you to lower your voice a little?",
    },
    context_vi: "Phù hợp ở thư viện, phòng họp, nơi công cộng.",
    context_en: "Fits libraries, meeting rooms, public places.",
  },
  {
    id: "thx_dc_04",
    topic: "too_direct_commands",
    severity: "low",
    risky: {
      thai: "เอามา",
      rtgs: "ao maa",
      vi: "Đưa đây.",
      en: "Give it here.",
    },
    why_risky_vi: "Thiếu từ nhờ, nghe như đòi hỏi.",
    why_risky_en: "Lacking a request marker, it sounds demanding.",
    safer: {
      thai: "ขอหน่อยได้ไหมครับ",
      rtgs: "khaw noi dai mai khrap",
      vi: "Cho tôi xin một chút được không ạ?",
      en: "May I have it, please?",
    },
    context_vi: "« ขอ...หน่อย » là khung xin đồ chuẩn mực.",
    context_en: "« ขอ...หน่อย » is the standard frame for asking for something.",
  },
  {
    id: "thx_dc_05",
    topic: "too_direct_commands",
    severity: "medium",
    risky: {
      thai: "รีบ ๆ หน่อย",
      rtgs: "rip-rip noi",
      vi: "Nhanh lên đi.",
      en: "Hurry up.",
    },
    why_risky_vi: "Giục giã trực tiếp tạo áp lực và nghe thiếu kiên nhẫn.",
    why_risky_en: "Direct chivvying creates pressure and sounds impatient.",
    safer: {
      thai: "ไม่ทราบว่าพอจะเร็วขึ้นได้นิดนึงไหมครับ",
      rtgs: "mai saap waa phaw ja reo khuen dai nit-nueng mai khrap",
      vi: "Không biết có thể nhanh hơn một chút được không ạ?",
      en: "Would it be possible to speed up just a little?",
    },
    context_vi: "Khi gấp, vẫn nên bọc lời giục bằng câu hỏi nhẹ.",
    context_en: "Even when rushed, wrap the urge in a gentle question.",
  },
  {
    id: "thx_dc_06",
    topic: "too_direct_commands",
    severity: "high",
    risky: {
      thai: "ไป / ไปให้พ้น",
      rtgs: "pai / pai hai phon",
      vi: "Đi đi / Cút đi.",
      en: "Go / Get lost.",
    },
    why_risky_vi: "Đuổi thẳng rất nặng, dễ leo thang thành xung đột.",
    why_risky_en: "A blunt dismissal is very harsh and can escalate into conflict.",
    safer: {
      thai: "ขอเวลาส่วนตัวสักครู่นะครับ",
      rtgs: "khaw wee-laa suan-tua sak-khruu na khrap",
      vi: "Cho tôi xin chút thời gian riêng nhé ạ.",
      en: "I'd like a moment to myself, please.",
    },
    context_vi: "Khi cần khoảng cách, hãy nói nhu cầu của mình thay vì đuổi người khác.",
    context_en: "When you need space, state your need rather than dismissing the other person.",
  },
  {
    id: "thx_dc_07",
    topic: "too_direct_commands",
    severity: "low",
    risky: {
      thai: "หยุด",
      rtgs: "yut",
      vi: "Dừng lại.",
      en: "Stop.",
    },
    why_risky_vi: "Một mình « หยุด » nghe gắt trừ khi khẩn cấp.",
    why_risky_en: "« หยุด » alone sounds sharp unless it's an emergency.",
    safer: {
      thai: "ขอโทษครับ ขอหยุดตรงนี้ก่อนนะครับ",
      rtgs: "khaw-thot khrap, khaw yut trong-nii kawn na khrap",
      vi: "Xin lỗi ạ, mình dừng ở đây trước nhé.",
      en: "Sorry — let's pause here for now.",
    },
    context_vi: "Trong trường hợp nguy hiểm thì « หยุด! » trực tiếp là đúng và cần thiết.",
    context_en: "In genuine danger, a direct « หยุด! » is correct and necessary.",
  },

  // ───────────────── status_hierarchy ─────────────────
  {
    id: "thx_sh_01",
    topic: "status_hierarchy",
    severity: "medium",
    risky: {
      thai: "ผิดแล้ว",
      rtgs: "phit laeo",
      vi: "Sai rồi. (nói thẳng với người trên)",
      en: "That's wrong. (said bluntly to a senior)",
    },
    why_risky_vi: "Phủ định thẳng người trên/lớn tuổi làm họ mất mặt trước người khác.",
    why_risky_en: "Flatly contradicting a senior/elder makes them lose face in front of others.",
    safer: {
      thai: "ขออนุญาตเสนอความเห็นต่างนะครับ",
      rtgs: "khaw a-nu-yaat sa-noe khwaam-hen taang na khrap",
      vi: "Cho phép tôi nêu một ý kiến khác ạ.",
      en: "May I offer a differing view?",
    },
    context_vi: "Xin phép + 'ý kiến khác' giữ thứ bậc trong họp.",
    context_en: "Asking permission + 'a differing view' preserves hierarchy in meetings.",
  },
  {
    id: "thx_sh_02",
    topic: "status_hierarchy",
    severity: "medium",
    risky: {
      thai: "เงินเดือนเท่าไร / อายุเท่าไร",
      rtgs: "ngoen-duean thao-rai / aa-yu thao-rai",
      vi: "Lương bao nhiêu / Bao nhiêu tuổi? (hỏi thẳng người mới quen)",
      en: "How much do you earn / How old are you? (asked bluntly of a new acquaintance)",
    },
    why_risky_vi: "Hỏi thẳng lương/tuổi với người lạ hoặc cấp trên có thể bị xem là vô duyên.",
    why_risky_en: "Bluntly asking salary/age of a stranger or senior can seem intrusive.",
    safer: {
      thai: "ไม่ทราบว่าทำงานสายนี้มานานไหมครับ",
      rtgs: "mai saap waa tham-ngaan saai-nii maa naan mai khrap",
      vi: "Không biết anh/chị làm ngành này lâu chưa ạ?",
      en: "May I ask, have you been in this field long?",
    },
    context_vi: "Hỏi gián tiếp về kinh nghiệm nhẹ nhàng hơn hỏi con số.",
    context_en: "Asking indirectly about experience is gentler than asking for numbers.",
  },
  {
    id: "thx_sh_03",
    topic: "status_hierarchy",
    severity: "low",
    risky: {
      vi: "Vẫy gọi người trên bằng ngón tay hướng lên",
      en: "Beckoning a senior with the finger pointing up",
    },
    why_risky_vi: "Vẫy ngón tay hướng lên bị coi là bất lịch sự, nhất là với người trên.",
    why_risky_en: "Beckoning with the finger up is seen as rude, especially toward a senior.",
    safer: {
      thai: "เชิญทางนี้ครับ (พร้อมแบมือคว่ำ)",
      rtgs: "choen thaang-nii khrap (phrom bae-mue khwam)",
      vi: "Mời phía này ạ (kèm vẫy cả bàn tay úp xuống).",
      en: "This way, please (with the whole hand, palm down).",
    },
    context_vi: "Vẫy bằng cả bàn tay úp xuống là cử chỉ lịch sự.",
    context_en: "Beckoning with the whole hand, palm down, is the polite gesture.",
  },
  {
    id: "thx_sh_04",
    topic: "status_hierarchy",
    severity: "medium",
    risky: {
      vi: "Ngắt lời người lớn tuổi/cấp trên khi họ đang nói",
      en: "Interrupting an elder/senior mid-sentence",
    },
    why_risky_vi: "Ngắt lời người trên bị xem là thiếu tôn trọng thứ bậc.",
    why_risky_en: "Cutting off a senior is seen as disrespecting hierarchy.",
    safer: {
      thai: "ขออนุญาตเสริมนิดนึงนะครับ",
      rtgs: "khaw a-nu-yaat soem nit-nueng na khrap",
      vi: "Cho phép tôi bổ sung một chút ạ.",
      en: "May I add a small point?",
    },
    context_vi: "Chờ họ ngừng, rồi « ขออนุญาต » trước khi xen vào.",
    context_en: "Wait for a pause, then « ขออนุญาต » before stepping in.",
  },
  {
    id: "thx_sh_05",
    topic: "status_hierarchy",
    severity: "low",
    risky: {
      vi: "Đưa/nhận đồ từ người trên bằng một tay, thái độ hờ hững",
      en: "Giving/receiving from a senior with one careless hand",
    },
    why_risky_vi: "Trao nhận hờ hững bằng một tay với người trên nghe thiếu trân trọng.",
    why_risky_en: "A careless one-handed exchange with a senior reads as lacking respect.",
    safer: {
      thai: "ขอบคุณครับ (รับด้วยสองมือ)",
      rtgs: "khop-khun khrap (rap duai song mue)",
      vi: "Cảm ơn ạ (nhận bằng hai tay).",
      en: "Thank you (receiving with both hands).",
    },
    context_vi: "Dùng hai tay (hoặc tay phải đỡ khuỷu trái) khi trao/nhận trang trọng.",
    context_en: "Use both hands (or right hand with left supporting the elbow) for formal exchanges.",
  },
  {
    id: "thx_sh_06",
    topic: "status_hierarchy",
    severity: "medium",
    risky: {
      thai: "เรียกชื่อเฉย ๆ (กับผู้ใหญ่)",
      rtgs: "riak chue choei-choei",
      vi: "Gọi trống tên (với người lớn tuổi)",
      en: "Using a bare first name (for an elder)",
    },
    why_risky_vi: "Gọi trống tên người lớn hơn nhiều nghe suồng sã.",
    why_risky_en: "A bare first name for someone much older sounds overly familiar.",
    safer: {
      thai: "คุณ + ชื่อ / พี่ + ชื่อ",
      rtgs: "khun + chue / phii + chue",
      vi: "« คุณ »/« พี่ » + tên",
      en: "« khun »/« phii » + name",
    },
    context_vi: "Tiền tố lịch sự trước tên là cách an toàn để thể hiện kính trọng.",
    context_en: "A polite prefix before the name is the safe way to show respect.",
  },
  {
    id: "thx_sh_07",
    topic: "status_hierarchy",
    severity: "low",
    risky: {
      vi: "Đứng/ngồi cao hơn rõ rệt so với người rất đáng kính khi trao đổi",
      en: "Positioning yourself clearly higher than a highly respected person",
    },
    why_risky_vi: "Để đầu mình cao hơn người rất đáng kính (vd nhà sư, người lớn tuổi ngồi) có thể bị coi là vô ý.",
    why_risky_en: "Keeping your head above a highly respected (e.g. seated elder/monk) can read as thoughtless.",
    safer: {
      thai: "ขอตัวนั่งลงก่อนนะครับ",
      rtgs: "khaw tua nang long kawn na khrap",
      vi: "Xin phép ngồi xuống trước ạ.",
      en: "Let me sit down first.",
    },
    context_vi: "Khi đi ngang người đang ngồi đáng kính, hơi cúi mình là cử chỉ tôn trọng.",
    context_en: "Passing a seated respected person, a slight stoop is a respectful gesture.",
  },

  // ───────────────── apology ─────────────────
  {
    id: "thx_ap_01",
    topic: "apology",
    severity: "medium",
    risky: {
      thai: "โทษที",
      rtgs: "thot-thii",
      vi: "Lỗi nha. (xin lỗi kiểu suồng sã, với người trên)",
      en: "My bad. (casual sorry, to a senior)",
    },
    why_risky_vi: "« โทษที » quá xuề xòa khi lỗi nghiêm trọng hoặc với người trên.",
    why_risky_en: "« โทษที » is too flippant for a serious mistake or with a senior.",
    safer: {
      thai: "ขอโทษครับ / ขออภัยครับ",
      rtgs: "khaw-thot khrap / khaw a-phai khrap",
      vi: "Tôi xin lỗi ạ / Thành thật xin lỗi ạ.",
      en: "I'm sorry / I apologise.",
    },
    context_vi: "« โทษที » ổn giữa bạn bè cho lỗi nhỏ.",
    context_en: "« โทษที » is fine among friends for minor slips.",
  },
  {
    id: "thx_ap_02",
    topic: "apology",
    severity: "medium",
    risky: {
      thai: "ไม่ใช่ความผิดผม",
      rtgs: "mai chai khwaam-phit phom",
      vi: "Không phải lỗi của tôi. (phòng thủ ngay)",
      en: "It's not my fault. (immediately defensive)",
    },
    why_risky_vi: "Đổ lỗi ngay làm căng thẳng leo thang và mất thiện chí.",
    why_risky_en: "Deflecting blame at once escalates tension and loses goodwill.",
    safer: {
      thai: "ต้องขอโทษด้วยครับ เดี๋ยวเรามาดูกันว่าเกิดอะไรขึ้น",
      rtgs: "tong khaw-thot duai khrap, diao rao maa duu kan waa koet a-rai khuen",
      vi: "Tôi xin lỗi ạ; để mình cùng xem chuyện gì đã xảy ra.",
      en: "I'm sorry — let's look together at what happened.",
    },
    context_vi: "Nhận một phần và chuyển sang giải pháp giữ hòa khí.",
    context_en: "Owning part of it and moving to a solution keeps the peace.",
  },
  {
    id: "thx_ap_03",
    topic: "apology",
    severity: "low",
    risky: {
      thai: "ก็แค่เรื่องเล็ก ๆ",
      rtgs: "kaw khae rueang lek-lek",
      vi: "Có gì đâu, chuyện nhỏ. (gạt phăng lỗi)",
      en: "It's just a small thing. (brushing off the mistake)",
    },
    why_risky_vi: "Xem nhẹ lỗi mình gây ra khiến người bị ảnh hưởng cảm thấy không được tôn trọng.",
    why_risky_en: "Minimising your own mistake makes the affected person feel dismissed.",
    safer: {
      thai: "ขอโทษที่ทำให้ไม่สะดวกนะครับ",
      rtgs: "khaw-thot thii tham-hai mai sa-duak na khrap",
      vi: "Xin lỗi vì đã gây bất tiện ạ.",
      en: "Sorry for the inconvenience caused.",
    },
    context_vi: "Thừa nhận tác động đến người khác quan trọng hơn đánh giá mức độ lỗi.",
    context_en: "Acknowledging the impact on others matters more than rating the mistake's size.",
  },
  {
    id: "thx_ap_04",
    topic: "apology",
    severity: "medium",
    risky: {
      thai: "ขอโทษก็ได้ (giọng kháy)",
      rtgs: "khaw-thot kaw dai",
      vi: "Thì xin lỗi vậy. (mỉa mai)",
      en: "Fine, sorry then. (sarcastic)",
    },
    why_risky_vi: "Xin lỗi kiểu kháy còn tệ hơn không xin lỗi — nghe khiêu khích.",
    why_risky_en: "A sarcastic apology is worse than none — it reads as provocation.",
    safer: {
      thai: "ผมขอโทษจริง ๆ นะครับ",
      rtgs: "phom khaw-thot jing-jing na khrap",
      vi: "Tôi thật lòng xin lỗi ạ.",
      en: "I'm truly sorry.",
    },
    context_vi: "Nếu chưa sẵn sàng xin lỗi thật, hãy tạm dừng thay vì nói mỉa.",
    context_en: "If you're not ready to mean it, pause rather than apologise sarcastically.",
  },
  {
    id: "thx_ap_05",
    topic: "apology",
    severity: "high",
    risky: {
      vi: "Đùa cợt cho qua một lỗi nghiêm trọng",
      en: "Joking off a serious mistake",
    },
    why_risky_vi: "Cười cợt lỗi nghiêm trọng làm người bị ảnh hưởng tổn thương và mất lòng tin.",
    why_risky_en: "Laughing off a serious error hurts the affected party and erodes trust.",
    safer: {
      thai: "ขออภัยอย่างสูงครับ ผมจะรับผิดชอบแก้ไขให้เรียบร้อย",
      rtgs: "khaw a-phai yaang suung khrap, phom ja rap-phit-chop kae-khai hai riap-roi",
      vi: "Tôi thành thật xin lỗi ạ; tôi sẽ chịu trách nhiệm khắc phục đến nơi đến chốn.",
      en: "My sincere apologies — I'll take responsibility and put it right.",
    },
    context_vi: "Lỗi lớn cần xin lỗi trang trọng kèm cam kết sửa.",
    context_en: "Big mistakes need a formal apology with a commitment to fix.",
  },

  // ───────────────── refusal ─────────────────
  {
    id: "thx_rf_01",
    topic: "refusal",
    severity: "medium",
    risky: {
      thai: "ไม่",
      rtgs: "mai",
      vi: "Không. (cụt lủn)",
      en: "No. (bare)",
    },
    why_risky_vi: "Từ chối một tiếng « ไม่ » nghe lạnh và có thể làm người mời mất mặt.",
    why_risky_en: "A one-word « ไม่ » sounds cold and can make the inviter lose face.",
    safer: {
      thai: "ขอบคุณนะครับ ไว้โอกาสหน้านะครับ",
      rtgs: "khop-khun na khrap, wai oo-kaat naa na khrap",
      vi: "Cảm ơn nhé, để dịp sau ạ.",
      en: "Thanks — maybe next time.",
    },
    context_vi: "Cảm ơn + hoãn 'dịp sau' là công thức từ chối giữ thể diện.",
    context_en: "Thanks + 'next time' is the face-saving refusal formula.",
  },
  {
    id: "thx_rf_02",
    topic: "refusal",
    severity: "low",
    risky: {
      thai: "ไม่เอา",
      rtgs: "mai ao",
      vi: "Không lấy / Không cần. (với người mời đồ)",
      en: "Don't want it. (to someone offering)",
    },
    why_risky_vi: "« ไม่เอา » trống không khi từ chối quà/đồ mời nghe hơi thô.",
    why_risky_en: "A bare « ไม่เอา » when declining a gift/offer sounds a bit blunt.",
    safer: {
      thai: "ขอบคุณครับ อิ่มแล้วจริง ๆ",
      rtgs: "khop-khun khrap, im laeo jing-jing",
      vi: "Cảm ơn ạ, tôi no thật rồi.",
      en: "Thank you, I'm really full.",
    },
    context_vi: "Kèm một lý do nhẹ làm lời từ chối ấm áp hơn.",
    context_en: "Adding a light reason makes the refusal warmer.",
  },
  {
    id: "thx_rf_03",
    topic: "refusal",
    severity: "medium",
    risky: {
      thai: "ไม่ชอบ / เกลียด",
      rtgs: "mai chop / kliat",
      vi: "Không thích / Ghét. (nói thẳng về thứ người khác đưa ra)",
      en: "Don't like it / Hate it. (bluntly about what someone offered)",
    },
    why_risky_vi: "Chê thẳng nghe gay gắt; « เกลียด » đặc biệt nặng.",
    why_risky_en: "Blunt dislike sounds harsh; « เกลียด » (hate) is especially strong.",
    safer: {
      thai: "ไม่ค่อยถนัดเท่าไรครับ",
      rtgs: "mai-khoi tha-nat thao-rai khrap",
      vi: "Tôi không hợp lắm ạ.",
      en: "It's not really my thing.",
    },
    context_vi: "« ไม่ค่อยถนัด/ไม่ค่อยชอบ » mềm hơn nhiều so với « เกลียด ».",
    context_en: "« ไม่ค่อยถนัด/ไม่ค่อยชอบ » is much softer than « เกลียด ».",
  },
  {
    id: "thx_rf_04",
    topic: "refusal",
    severity: "medium",
    risky: {
      thai: "ทำไม่ได้",
      rtgs: "tham mai dai",
      vi: "Không làm được. (đáp cụt với yêu cầu công việc)",
      en: "Can't do it. (flat reply to a work request)",
    },
    why_risky_vi: "Đáp « ทำไม่ได้ » trống không nghe thiếu hợp tác với cấp trên/đồng nghiệp.",
    why_risky_en: "A flat « can't do it » sounds uncooperative to a boss/colleague.",
    safer: {
      thai: "ขอเวลาดูก่อนนะครับ เดี๋ยวแจ้งกลับว่าพอจะช่วยตรงไหนได้บ้าง",
      rtgs: "khaw wee-laa duu kawn na khrap, diao jaeng-klap waa phaw ja chuai trong-nai dai baang",
      vi: "Cho tôi xem trước đã ạ, rồi báo lại xem giúp được phần nào.",
      en: "Let me take a look first, then I'll get back on what I can help with.",
    },
    context_vi: "Đưa hướng mở thay vì chốt 'không' giữ quan hệ làm việc.",
    context_en: "Offering an opening instead of a flat 'no' preserves the working relationship.",
  },
  {
    id: "thx_rf_05",
    topic: "refusal",
    severity: "high",
    risky: {
      thai: "ได้ ๆ (ทั้งที่ทำไม่ได้)",
      rtgs: "dai-dai",
      vi: "Được được. (đồng ý cho qua dù biết không làm được)",
      en: "Yes, yes. (agreeing just to avoid saying no, knowing you can't)",
    },
    why_risky_vi: "Hứa suông để tránh nói 'không' gây hậu quả tệ hơn khi không giữ lời.",
    why_risky_en: "Over-promising to dodge a 'no' backfires worse when you can't deliver.",
    safer: {
      thai: "ตรง ๆ นะครับ ส่วนนี้ผมอาจช่วยได้ไม่เต็มที่ แต่...",
      rtgs: "trong-trong na khrap, suan-nii phom aat chuai dai mai tem-thii, tae...",
      vi: "Nói thật ạ, phần này tôi giúp được không trọn vẹn, nhưng...",
      en: "To be honest, I may not be able to fully help here, but...",
    },
    context_vi: "Thành thật mềm mỏng tốt hơn hứa rồi thất hứa — quan trọng trong công việc.",
    context_en: "Gentle honesty beats a broken promise — important at work.",
  },
  {
    id: "thx_rf_06",
    topic: "refusal",
    severity: "medium",
    risky: {
      vi: "Im lặng/lờ đi (ghosting) thay vì phản hồi lời mời",
      en: "Going silent/ghosting instead of replying to an invitation",
    },
    why_risky_vi: "Lờ hoàn toàn có thể bị hiểu là khinh; một phản hồi ngắn lịch sự vẫn hơn.",
    why_risky_en: "Total silence can read as disdain; a short polite reply is better.",
    safer: {
      thai: "ขอบคุณที่ชวนนะครับ คราวนี้ขอผ่านก่อน ไว้เจอกันโอกาสหน้า",
      rtgs: "khop-khun thii chuan na khrap, khraao-nii khaw phaan kawn, wai joe kan oo-kaat naa",
      vi: "Cảm ơn đã rủ nhé, lần này tôi xin phép bỏ qua, hẹn dịp sau gặp.",
      en: "Thanks for the invite — I'll pass this time, see you next time.",
    },
    context_vi: "Một dòng từ chối lịch sự giữ quan hệ tốt hơn im lặng.",
    context_en: "A one-line polite decline keeps the relationship better than silence.",
  },

  // ───────────────── temple_formal ─────────────────
  {
    id: "thx_tf_01",
    topic: "temple_formal",
    severity: "high",
    risky: {
      vi: "Chỉ/đặt bàn chân hướng về tượng Phật hoặc nhà sư",
      en: "Pointing or resting your feet toward a Buddha image or a monk",
    },
    why_risky_vi: "Chân được xem là phần thấp nhất; hướng chân vào vật/người thiêng là rất bất kính.",
    why_risky_en: "Feet are seen as the lowest part; pointing them at sacred objects/people is highly disrespectful.",
    safer: {
      thai: "นั่งพับเพียบเก็บเท้าให้เรียบร้อย",
      rtgs: "nang phap-phiap kep thao hai riap-roi",
      vi: "Ngồi nghiêng kiểu « พับเพียบ », thu gọn chân lại.",
      en: "Sit side-saddle (« phap-phiap »), tucking your feet away.",
    },
    context_vi: "Trong chùa, ngồi thu chân về phía sau, không duỗi về phía tượng.",
    context_en: "In a temple, tuck feet behind you, never stretched toward the image.",
  },
  {
    id: "thx_tf_02",
    topic: "temple_formal",
    severity: "high",
    risky: {
      vi: "Phụ nữ chạm vào nhà sư hoặc đưa đồ trực tiếp tận tay",
      en: "A woman touching a monk or handing items directly to him",
    },
    why_risky_vi: "Theo giới luật, nhà sư không chạm phụ nữ; trao trực tiếp đặt sư vào thế khó.",
    why_risky_en: "By monastic rule, monks don't make contact with women; a direct handover puts the monk in a bind.",
    safer: {
      thai: "วางของบนผ้ารับประเคนหรือให้ผู้ชายส่งแทน",
      rtgs: "waang khong bon phaa rap-pra-khen rue hai phu-chai song thaen",
      vi: "Đặt đồ lên tấm vải nhận lễ, hoặc nhờ nam giới chuyển giúp.",
      en: "Place items on the receiving cloth, or have a man pass them.",
    },
    context_vi: "Nhiều chùa có sẵn « ผ้ารับประเคน » cho mục đích này.",
    context_en: "Many temples keep a « receiving cloth » for exactly this.",
  },
  {
    id: "thx_tf_03",
    topic: "temple_formal",
    severity: "medium",
    risky: {
      vi: "Trèo lên, tạo dáng đùa giỡn với tượng Phật để chụp ảnh",
      en: "Climbing on or posing playfully with a Buddha statue for photos",
    },
    why_risky_vi: "Coi tượng Phật như đạo cụ chụp ảnh bị xem là xúc phạm tín ngưỡng (và có thể vi phạm quy định).",
    why_risky_en: "Treating a Buddha image as a photo prop is seen as religiously offensive (and may breach rules).",
    safer: {
      thai: "ยืนสำรวมและถ่ายจากระยะที่เหมาะสม",
      rtgs: "yuen sam-ruam lae thaai jaak ra-ya thii mo-som",
      vi: "Đứng nghiêm trang và chụp từ khoảng cách phù hợp.",
      en: "Stand respectfully and photograph from an appropriate distance.",
    },
    context_vi: "Đầu không nên cao hơn tượng; tránh quay lưng tạo dáng.",
    context_en: "Keep your head below the image; avoid turning your back to pose.",
  },
  {
    id: "thx_tf_04",
    topic: "temple_formal",
    severity: "medium",
    risky: {
      thai: "พระกินข้าว",
      rtgs: "phra kin khaao",
      vi: "Dùng « กิน » (ăn) khi nói nhà sư ăn",
      en: "Using « กิน » (eat) for a monk eating",
    },
    why_risky_vi: "Có động từ riêng cho hành động của nhà sư; dùng từ đời thường nghe thiếu kính.",
    why_risky_en: "Monks' actions take special verbs; everyday words sound irreverent.",
    safer: {
      thai: "พระฉัน(เพล)",
      rtgs: "phra chan (phen)",
      vi: "« พระฉัน » — nhà sư thọ trai.",
      en: "« พระฉัน » — the monk takes his meal.",
    },
    context_vi: "Một số động từ tôn kính: ฉัน (ăn), จำวัด (ngủ), อาพาธ (ốm).",
    context_en: "Some deferential verbs: ฉัน (eat), จำวัด (sleep), อาพาธ (be ill).",
  },
  {
    id: "thx_tf_05",
    topic: "temple_formal",
    severity: "high",
    risky: {
      vi: "Bình luận đùa cợt hoặc tiêu cực về hoàng gia nơi công cộng/trên mạng",
      en: "Making joking or negative comments about the monarchy in public/online",
    },
    why_risky_vi: "Thái Lan có luật bảo vệ hoàng gia rất nghiêm; phát ngôn bất cẩn có thể dẫn đến hậu quả pháp lý nghiêm trọng.",
    why_risky_en: "Thailand has strict laws protecting the monarchy; careless remarks can carry serious legal consequences.",
    safer: {
      thai: "ขอใช้ถ้อยคำที่สุภาพและเหมาะสมนะครับ",
      rtgs: "khaw chai thoi-kham thii su-phaap lae mo-som na khrap",
      vi: "Xin dùng từ ngữ lịch sự, phù hợp ạ.",
      en: "Let me use respectful, appropriate wording.",
    },
    context_vi: "Đây là lưu ý pháp lý/an toàn thực tế cho người học và du khách, không phải bình luận chính trị.",
    context_en: "This is a practical legal/safety note for learners and travellers, not a political comment.",
  },
  {
    id: "thx_tf_06",
    topic: "temple_formal",
    severity: "low",
    risky: {
      vi: "Nói to, cười đùa, để chuông điện thoại lớn trong khu chính điện",
      en: "Talking loudly, laughing, or letting a phone ring in the main hall",
    },
    why_risky_vi: "Ồn ào trong khu thờ phá vỡ không khí trang nghiêm và làm phiền người hành lễ.",
    why_risky_en: "Noise in the worship hall breaks the solemn atmosphere and disturbs worshippers.",
    safer: {
      thai: "ปิดเสียงโทรศัพท์และพูดเบา ๆ ครับ",
      rtgs: "pit siang tho-ra-sap lae phuut bao-bao khrap",
      vi: "Tắt chuông điện thoại và nói nhỏ ạ.",
      en: "Silence your phone and speak softly.",
    },
    context_vi: "Để chế độ im lặng trước khi vào chính điện.",
    context_en: "Switch to silent before entering the main hall.",
  },
  {
    id: "thx_tf_07",
    topic: "temple_formal",
    severity: "medium",
    risky: {
      thai: "นะ / สิ (ในเอกสารราชการ)",
      rtgs: "na / si",
      vi: "Dùng trợ từ khẩu ngữ นะ/สิ trong văn bản hành chính",
      en: "Using colloquial particles นะ/สิ in official documents",
    },
    why_risky_vi: "Trợ từ cuối câu khẩu ngữ làm văn bản trang trọng nghe thiếu nghiêm túc.",
    why_risky_en: "Casual final particles make a formal document sound unserious.",
    safer: {
      thai: "จึงเรียนมาเพื่อโปรดพิจารณา",
      rtgs: "jueng rian maa phuea proot phi-jaa-ra-naa",
      vi: "Kính trình để quý vị xem xét. (kết thư trang trọng)",
      en: "Submitted herewith for your kind consideration. (formal closing)",
    },
    context_vi: "Văn hành chính dùng công thức cố định, bỏ trợ từ khẩu ngữ.",
    context_en: "Official writing uses fixed formulas and drops conversational particles.",
  },

  // ───────────────── workplace_respect ─────────────────
  {
    id: "thx_wr_01",
    topic: "workplace_respect",
    severity: "high",
    risky: {
      vi: "Phê bình cấp dưới/đồng nghiệp gay gắt trước mặt cả nhóm",
      en: "Criticising a junior/colleague harshly in front of the group",
    },
    why_risky_vi: "Chỉ trích công khai làm mất mặt nặng, hại tinh thần và quan hệ đội.",
    why_risky_en: "Public criticism causes serious loss of face and damages team morale and trust.",
    safer: {
      thai: "เดี๋ยวขอคุยด้วยส่วนตัวสักครู่นะครับ",
      rtgs: "diao khaw khui duai suan-tua sak-khruu na khrap",
      vi: "Lát nữa cho tôi trao đổi riêng một chút nhé ạ.",
      en: "Let me have a brief word with you in private.",
    },
    context_vi: "Khen công khai, góp ý riêng — nguyên tắc giữ thể diện nơi làm việc.",
    context_en: "Praise in public, correct in private — the workplace face-saving rule.",
  },
  {
    id: "thx_wr_02",
    topic: "workplace_respect",
    severity: "medium",
    risky: {
      thai: "เอางานมาส่งเดี๋ยวนี้",
      rtgs: "ao ngaan maa song diao-nii",
      vi: "Nộp việc ngay đây. (ra lệnh đồng nghiệp)",
      en: "Hand in the work right now. (ordering a colleague)",
    },
    why_risky_vi: "Ra lệnh ngang hàng tạo cảm giác bị sai khiến, sinh bất mãn.",
    why_risky_en: "Bossing a peer around feels like being ordered and breeds resentment.",
    safer: {
      thai: "ไม่ทราบว่าพอจะส่งงานภายในวันนี้ได้ไหมครับ",
      rtgs: "mai saap waa phaw ja song ngaan phai-nai wan-nii dai mai khrap",
      vi: "Không biết có thể nộp việc trong hôm nay được không ạ?",
      en: "Would it be possible to submit the work by today?",
    },
    context_vi: "Đặt thành câu hỏi giữ sự ngang hàng và tôn trọng.",
    context_en: "Framing it as a question keeps things peer-level and respectful.",
  },
  {
    id: "thx_wr_03",
    topic: "workplace_respect",
    severity: "low",
    risky: {
      vi: "Nhắn tin/email cho sếp đầy tiếng lóng và emoji",
      en: "Messaging/emailing a boss full of slang and emojis",
    },
    why_risky_vi: "Văn phong quá xuề xòa với cấp trên nghe thiếu chuyên nghiệp.",
    why_risky_en: "An overly casual register with a superior reads as unprofessional.",
    safer: {
      thai: "เรียนพี่ ขออัปเดตความคืบหน้าดังนี้ครับ",
      rtgs: "rian phii, khaw ap-det khwaam khuep-naa dang-nii khrap",
      vi: "Kính gửi anh/chị, em xin cập nhật tiến độ như sau ạ.",
      en: "Dear (senior), here is my progress update.",
    },
    context_vi: "Mở đầu « เรียน » + giữ giọng trang trọng trong thư công việc.",
    context_en: "Open with « เรียน » + keep a formal tone in work messages.",
  },
  {
    id: "thx_wr_04",
    topic: "workplace_respect",
    severity: "medium",
    risky: {
      vi: "CC sếp vào email để gây áp lực/'mách' đồng nghiệp trước khi nói trực tiếp",
      en: "CC-ing the boss to pressure/'tell on' a colleague before talking to them directly",
    },
    why_risky_vi: "Bị xem là « ฟ้อง » (mách lẻo); phá vỡ lòng tin và khiến đồng nghiệp mất mặt.",
    why_risky_en: "Seen as « ฟ้อง » (tattling); it breaks trust and makes the colleague lose face.",
    safer: {
      thai: "ขอคุยกันตรง ๆ ก่อนนะครับ เผื่อมีอะไรเข้าใจไม่ตรงกัน",
      rtgs: "khaw khui kan trong-trong kawn na khrap, phuea mii a-rai khao-jai mai trong kan",
      vi: "Mình nói chuyện thẳng với nhau trước nhé, phòng khi có gì hiểu chưa khớp.",
      en: "Let's talk directly first, in case there's a misunderstanding.",
    },
    context_vi: "Giải quyết tay đôi trước khi leo lên cấp trên giữ quan hệ tốt.",
    context_en: "Resolving one-on-one before escalating preserves the relationship.",
  },
  {
    id: "thx_wr_05",
    topic: "workplace_respect",
    severity: "medium",
    risky: {
      vi: "Rời đi/về sớm mà không báo hay bàn giao",
      en: "Leaving early without informing anyone or handing over",
    },
    why_risky_vi: "Biến mất không báo gây gián đoạn và bị xem là thiếu trách nhiệm với đội.",
    why_risky_en: "Disappearing without notice disrupts work and reads as irresponsible to the team.",
    safer: {
      thai: "ขอตัวกลับก่อนนะครับ งานที่ค้างผมจัดการเรียบร้อยแล้ว",
      rtgs: "khaw tua klap kawn na khrap, ngaan thii khaang phom jat-kaan riap-roi laeo",
      vi: "Tôi xin phép về trước nhé ạ; việc còn dở tôi đã lo xong.",
      en: "I'll head off now — I've wrapped up any pending work.",
    },
    context_vi: "Một câu xin phép + bàn giao ngắn thể hiện trách nhiệm.",
    context_en: "A quick leave-taking + handover shows responsibility.",
  },
  {
    id: "thx_wr_06",
    topic: "workplace_respect",
    severity: "low",
    risky: {
      vi: "Nhận hết công lao của nhóm khi báo cáo với sếp",
      en: "Taking sole credit for the team's work when reporting to the boss",
    },
    why_risky_vi: "Giành công làm xói mòn lòng tin và tinh thần hợp tác.",
    why_risky_en: "Hogging credit erodes trust and the spirit of cooperation.",
    safer: {
      thai: "งานนี้สำเร็จได้เพราะทีมช่วยกันครับ",
      rtgs: "ngaan nii sam-ret dai phro thiim chuai kan khrap",
      vi: "Việc này thành công là nhờ cả nhóm cùng giúp ạ.",
      en: "This succeeded thanks to the whole team's effort.",
    },
    context_vi: "Chia sẻ công lao củng cố vị thế lâu dài trong môi trường coi trọng tập thể.",
    context_en: "Sharing credit strengthens your long-term standing in a group-oriented setting.",
  },
];

// ── Quick lookups ───────────────────────────────────────────────────────────
export function entriesByTopic(topic: RiskTopic): RiskyPhraseEntry[] {
  return entries.filter((e) => e.topic === topic);
}

export function entriesBySeverity(sev: RiskSeverity): RiskyPhraseEntry[] {
  return entries.filter((e) => e.severity === sev);
}

// Banner the UI should render alongside these entries. Kept as data so the
// "general patterns, not native-certified" caveat travels with the content.
export const RISKY_PHRASES_DISCLAIMER = {
  vi: "Hướng dẫn hỗ trợ học tập về cách nói có rủi ro — mô tả khuôn mẫu giao tiếp chung, KHÔNG phải định kiến về con người. Chưa được người bản xứ thẩm định; phần thẩm định bản xứ được hoãn lại.",
  en: "Study-support risky-phrase guidance — describing general communication patterns, NOT stereotypes about people. Not native-certified; native review is deferred.",
} as const;

export default entries;
