// Bahasa Indonesia — B1 lessons for Vietnamese learners.
//
// Hand-crafted, Vietnamese-first: every sentence, note and tip carries a
// Vietnamese (L1) gloss, and an English companion for cross-checking.
// Topics for this round: the workplace, expressing opinions, talking about the
// past and future (sudah / belum / akan), healthcare, and the formal vs.
// informal register (aku/saya, kamu/Anda). Vietnamese-speaker notes lean on
// the one feature with no Vietnamese parallel: reduplication (orang-orang,
// sayur-mayur).
//
// NOTE: the indonesian/ package ships a shared lessons.ts registry (authored in
// the A7 wave), but — mirroring the Portuguese pack — each lessons-*.ts file
// declares its OWN inline lesson shape so the waves can be authored in parallel
// without a type-import barrier. Indonesian uses the Latin alphabet, so there is
// no special-script field; `pronunciation_focus` instead targets the sounds
// Vietnamese speakers reshape (c = 'ch', the schwa 'e', word-initial 'ng',
// released final consonants).

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  // English-speaker companion to pronunciation_focus — same length + order.
  pronunciation_focus_en?: string[];
};

export type VocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  // English-speaker pronunciation hint with the stressed syllable in CAPS.
  pronunciation_en?: string;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

// Loosely typed so per-type fields (fill-blank, matching, translation) vary.
//   fill-blank:  question, answer, hint_vi?, hint_en?
//   matching:    pairs, instruction, instruction_en?
//   translation: vietnamese, indonesian, english?
export type Exercise = Record<string, unknown>;

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: LessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: VocabEntry[];
  dialogue?: DialogueLine[];
  exercises?: Exercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    "id": "indonesian_work_talking",
    "level": "B1",
    "category": "work",
    "title_vi": "Nói về công việc",
    "title_en": "Talking about your job",
    "sentences": [
      {
        "en": "I work at a technology company in Jakarta.",
        "vi": "Tôi làm việc ở một công ty công nghệ tại Jakarta.",
        "pronunciation_focus": [
          "bekerja→bơ-kơr-ja",
          "kantor→kan-tor",
          "perusahaan→pơ-ru-sa-ha-an"
        ],
        "pronunciation_focus_en": [
          "bekerja → 'buh-KER-jah' — the prefix 'be-' is a soft schwa 'buh'; root is 'kerja' (work)",
          "kantor → 'KAHN-tor' — clean final 'r'; means office/workplace",
          "perusahaan → 'puh-roo-sah-HAH-an' — note the double 'aa' is two separate vowels, a tiny break between them"
        ]
      },
      {
        "en": "What do you do for a living?",
        "vi": "Bạn làm nghề gì?",
        "pronunciation_focus": [
          "kerja→kơr-ja",
          "apa→a-pa"
        ],
        "pronunciation_focus_en": [
          "kerja → 'KER-jah' — 'j' is a hard English 'j' as in 'jam', never French",
          "apa → 'AH-pah' — 'Kerja apa?' literally 'work what?', the everyday casual way to ask someone's job"
        ]
      },
      {
        "en": "I have an important meeting tomorrow morning.",
        "vi": "Tôi có một cuộc họp quan trọng vào sáng mai.",
        "pronunciation_focus": [
          "rapat→ra-pạt",
          "penting→pơn-ting",
          "besok→bê-sok"
        ],
        "pronunciation_focus_en": [
          "rapat → 'RAH-paht' — final 't' is unreleased, like a held stop; means a formal meeting",
          "penting → 'PUHN-ting' — 'e' is a schwa 'uh'; word-final 'ng' is one sound, no hard 'g' after it",
          "besok → 'BEH-sohk' — 'besok pagi' = tomorrow morning"
        ]
      },
      {
        "en": "The salary is decent, but the working hours are long.",
        "vi": "Lương thì ổn, nhưng giờ làm việc thì dài.",
        "pronunciation_focus": [
          "gaji→ga-ji",
          "jam→jam",
          "lembur→lơm-bur"
        ],
        "pronunciation_focus_en": [
          "gaji → 'GAH-jee' — 'gaji' is salary/wage; 'gajian' (gah-jee-AHN) is payday",
          "jam → 'jahm' — 'jam kerja' = working hours; the same word 'jam' also means clock/hour",
          "lembur → 'luhm-BOOR' — overtime; 'kerja lembur' = to work overtime"
        ]
      },
      {
        "en": "My colleagues are friendly and we often eat lunch together.",
        "vi": "Đồng nghiệp của tôi thân thiện và chúng tôi thường ăn trưa cùng nhau.",
        "pronunciation_focus": [
          "rekan-rekan→rê-kan rê-kan",
          "ramah→ra-mah",
          "bersama→bơr-sa-ma"
        ],
        "pronunciation_focus_en": [
          "rekan-rekan → 'REH-kahn REH-kahn' — the doubling marks the plural 'colleagues'; this is reduplication, your B1 grammar focus",
          "ramah → 'RAH-mah' — friendly/warm; a high compliment in Indonesian culture",
          "bersama → 'ber-SAH-mah' — together; the 'ber-' prefix often means 'doing X jointly'"
        ]
      }
    ],
    "cultural_notes_vi": "Trong môi trường công sở Indonesia, người ta rất coi trọng sự hòa thuận (rukun) và tránh xung đột trực tiếp. Đồng nghiệp hay gọi nhau bằng 'Pak' (anh/ông) và 'Bu' (chị/bà) kèm tên, kể cả với sếp — đây là phép lịch sự cơ bản. Hỏi 'Kerja di mana?' (Làm việc ở đâu?) là cách bắt chuyện rất phổ biến khi mới quen.",
    "cultural_notes_en": "Indonesian workplaces prize harmony ('rukun') and avoid blunt confrontation. Colleagues address each other with 'Pak' (Mr./older man) or 'Bu' (Ms./older woman) plus a name — even the boss — as basic politeness. 'Kerja di mana?' ('Where do you work?') is standard small talk when you first meet someone, much like 'What do you do?' in English.",
    "tip_advice_vi": "Để ý cách tạo danh từ chỉ người làm nghề: thêm tiền tố 'pe-' vào động từ. 'Kerja' (làm) → 'pekerja' (người lao động); 'ajar' (dạy) → 'pengajar' (giáo viên); 'kerja' → 'pekerjaan' (công việc, dùng hậu tố -an). Đây là hệ thống tiền tố/hậu tố rất đều, học một lần dùng được nhiều từ.",
    "tip_advice_en": "Notice how Indonesian builds job/agent nouns: add the 'pe-' prefix to a verb. 'kerja' (to work) → 'pekerja' (worker); 'ajar' (to teach) → 'pengajar' (teacher). Add the '-an' suffix for the abstract noun: 'kerja' → 'pekerjaan' (job/occupation). The affix system is highly regular — learn the pattern once and unlock dozens of words.",
    "vocabulary": [
      {
        "word": "pekerjaan",
        "en": "job / occupation",
        "vi": "công việc",
        "pos": "n.",
        "pronunciation_vi": "pơ-kơr-ja-an",
        "pronunciation_en": "puh-ker-JAH-an — pe- + kerja + -an; the abstract noun 'work/occupation'"
      },
      {
        "word": "kantor",
        "en": "office",
        "vi": "văn phòng",
        "pos": "n.",
        "pronunciation_vi": "kan-tor",
        "pronunciation_en": "KAHN-tor — 'kantor pusat' = head office, 'kantor cabang' = branch office"
      },
      {
        "word": "rapat",
        "en": "meeting",
        "vi": "cuộc họp",
        "pos": "n.",
        "pronunciation_vi": "ra-pạt",
        "pronunciation_en": "RAH-paht — final 't' unreleased; 'rapat' is a formal meeting, 'ketemu' is to just meet up"
      },
      {
        "word": "gaji",
        "en": "salary / wage",
        "vi": "lương",
        "pos": "n.",
        "pronunciation_vi": "ga-ji",
        "pronunciation_en": "GAH-jee — 'naik gaji' = a raise; 'gajian' = payday"
      },
      {
        "word": "atasan",
        "en": "boss / superior",
        "vi": "cấp trên / sếp",
        "pos": "n.",
        "pronunciation_vi": "a-ta-san",
        "pronunciation_en": "ah-TAH-san — from 'atas' (above) + -an; opposite is 'bawahan' (subordinate)"
      },
      {
        "word": "rekan kerja",
        "en": "colleague",
        "vi": "đồng nghiệp",
        "pos": "n.",
        "pronunciation_vi": "rê-kan kơr-ja",
        "pronunciation_en": "REH-kahn KER-jah — also 'teman kantor' in casual speech"
      },
      {
        "word": "melamar",
        "en": "to apply (for a job)",
        "vi": "nộp đơn / xin việc",
        "pos": "v.",
        "pronunciation_vi": "mơ-la-mar",
        "pronunciation_en": "muh-LAH-mar — meN- prefix + 'lamar'; 'melamar pekerjaan' = to apply for a job (also 'melamar' = to propose marriage!)"
      },
      {
        "word": "wawancara",
        "en": "interview",
        "vi": "phỏng vấn",
        "pos": "n.",
        "pronunciation_vi": "wa-wan-ca-ra",
        "pronunciation_en": "wah-wahn-CHAH-rah — 'c' is always 'ch'; the job-interview word"
      },
      {
        "word": "lembur",
        "en": "overtime",
        "vi": "làm thêm giờ",
        "pos": "n./v.",
        "pronunciation_vi": "lơm-bur",
        "pronunciation_en": "luhm-BOOR — 'kerja lembur' = to work overtime"
      },
      {
        "word": "cuti",
        "en": "leave / time off",
        "vi": "nghỉ phép",
        "pos": "n.",
        "pronunciation_vi": "cu-ti",
        "pronunciation_en": "CHOO-tee — 'c' = 'ch'; 'cuti tahunan' = annual leave, 'ambil cuti' = to take leave"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "Kamu kerja di mana sekarang?",
        "en": "Where do you work now?",
        "vi": "Bây giờ bạn làm việc ở đâu?"
      },
      {
        "speaker": "B",
        "text": "Aku kerja di perusahaan teknologi, jadi analis data. Kamu?",
        "en": "I work at a tech company as a data analyst. You?",
        "vi": "Mình làm ở một công ty công nghệ, làm chuyên viên phân tích dữ liệu. Còn bạn?"
      },
      {
        "speaker": "A",
        "text": "Aku di bidang marketing, tapi lagi cari kerjaan baru.",
        "en": "I'm in marketing, but I'm looking for a new job right now.",
        "vi": "Mình bên marketing, nhưng đang tìm việc mới."
      },
      {
        "speaker": "B",
        "text": "Oh ya? Kantorku lagi buka lowongan, kirim lamaranmu aja!",
        "en": "Oh yeah? My office has an opening, just send your application!",
        "vi": "Ồ thật à? Chỗ mình đang tuyển đấy, cứ gửi đơn xin việc đi!"
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Saya punya ___ penting besok pagi di kantor.",
        "answer": "rapat",
        "hint_vi": "danh từ nghĩa 'cuộc họp'",
        "hint_en": "the noun for a formal 'meeting'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "gaji",
            "lương (salary)"
          ],
          [
            "atasan",
            "sếp / cấp trên (boss)"
          ],
          [
            "cuti",
            "nghỉ phép (leave)"
          ]
        ],
        "instruction": "Nối từ tiếng Indonesia với nghĩa tiếng Việt",
        "instruction_en": "Match the Indonesian word with its Vietnamese meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Tôi có một cuộc họp quan trọng vào sáng mai.",
        "english": "I have an important meeting tomorrow morning.",
        "indonesian": "Saya punya rapat penting besok pagi."
      }
    ]
  },
  {
    "id": "indonesian_expr_opinions",
    "level": "B1",
    "category": "expressions",
    "title_vi": "Bày tỏ ý kiến",
    "title_en": "Expressing opinions",
    "sentences": [
      {
        "en": "In my opinion, this project is worth doing.",
        "vi": "Theo ý tôi, dự án này đáng để làm.",
        "pronunciation_focus": [
          "menurut→mơ-nu-rut",
          "pendapat→pơn-da-pạt",
          "proyek→pro-yek"
        ],
        "pronunciation_focus_en": [
          "menurut → 'muh-NOO-root' — 'menurut saya' literally 'according to me' = 'in my opinion'",
          "pendapat → 'puhn-DAH-paht' — opinion; from 'dapat' (to get) + pen-...; final 't' unreleased",
          "proyek → 'PROH-yehk' — a loanword from Dutch 'project'; 'oy' is two glided vowels"
        ]
      },
      {
        "en": "I think you're right.",
        "vi": "Tôi nghĩ bạn nói đúng.",
        "pronunciation_focus": [
          "saya→sa-ya",
          "pikir→pi-kir",
          "benar→bơ-nar"
        ],
        "pronunciation_focus_en": [
          "pikir → 'PEE-keer' — 'saya pikir' = 'I think'; 'saya rasa' (I feel) is a softer variant",
          "benar → 'buh-NAR' — correct/right; 'kamu benar' = you're right; 'betul' is a common synonym"
        ]
      },
      {
        "en": "Honestly, I don't agree with that.",
        "vi": "Thành thật mà nói, tôi không đồng ý với điều đó.",
        "pronunciation_focus": [
          "jujur→ju-jur",
          "setuju→sơ-tu-ju",
          "tidak→ti-dak"
        ],
        "pronunciation_focus_en": [
          "jujur → 'JOO-joor' — honest; 'sejujurnya' = honestly/to be honest",
          "setuju → 'suh-TOO-joo' — to agree; 'tidak setuju' = to disagree, 'setuju dengan' = agree WITH",
          "tidak → 'TEE-dah(k)' — the formal 'no/not'; in speech it shrinks to 'tdak' or even 'gak/nggak'"
        ]
      },
      {
        "en": "On one hand I understand, on the other hand I disagree.",
        "vi": "Một mặt tôi hiểu, mặt khác tôi không đồng tình.",
        "pronunciation_focus": [
          "satu sisi→sa-tu si-si",
          "paham→pa-ham",
          "sisi lain→si-si la-in"
        ],
        "pronunciation_focus_en": [
          "satu sisi → 'SAH-too SEE-see' — 'di satu sisi… di sisi lain…' = on one hand… on the other…",
          "paham → 'PAH-ham' — to understand; 'mengerti' is the more formal twin",
          "sisi lain → 'SEE-see LAH-in' — 'lain' (other) is two syllables: 'lah-in', not 'line'"
        ]
      },
      {
        "en": "For me, it makes complete sense.",
        "vi": "Đối với tôi, điều đó hoàn toàn hợp lý.",
        "pronunciation_focus": [
          "bagi saya→ba-gi sa-ya",
          "masuk akal→ma-suk a-kal"
        ],
        "pronunciation_focus_en": [
          "bagi saya → 'BAH-gee SAH-yah' — 'bagi saya' / 'buat saya' = 'for me, as far as I'm concerned'",
          "masuk akal → 'MAH-sook AH-kahl' — literally 'enters the mind' = 'makes sense'; a fixed idiom"
        ]
      }
    ],
    "cultural_notes_vi": "Người Indonesia thường bày tỏ bất đồng một cách gián tiếp để giữ thể diện cho cả hai bên. Thay vì nói thẳng 'Saya tidak setuju' (Tôi không đồng ý), họ hay nói 'Mungkin...' (Có lẽ...) hoặc 'Bagaimana kalau...' (Hay là mình...). Câu mở đầu 'Menurut saya' (Theo tôi) làm cho ý kiến nghe nhẹ nhàng, không áp đặt.",
    "cultural_notes_en": "Indonesians often voice disagreement indirectly to save face on both sides. Rather than a flat 'Saya tidak setuju' (I disagree), they'll soften it with 'Mungkin…' (Maybe…) or 'Bagaimana kalau…' (How about we…). Opening with 'Menurut saya' (In my opinion) frames a view as personal and non-imposing — a small phrase that buys a lot of social goodwill.",
    "tip_advice_vi": "Ba cách mở đầu ý kiến cần thuộc lòng: 'Menurut saya...' (Theo tôi), 'Saya pikir...' / 'Saya rasa...' (Tôi nghĩ / Tôi cảm thấy), và 'Bagi saya...' (Đối với tôi). 'Saya rasa' nghe mềm và khiêm tốn hơn 'Saya pikir', dùng khi không chắc chắn lắm. Khác với tiếng Việt, tiếng Indonesia không chia động từ, nên các cụm này không đổi dạng — học thuộc là dùng được ngay.",
    "tip_advice_en": "Memorize three opinion-openers: 'Menurut saya…' (In my opinion), 'Saya pikir…' / 'Saya rasa…' (I think / I feel), and 'Bagi saya…' (For me). 'Saya rasa' is softer and more tentative than 'Saya pikir' — reach for it when you're not fully sure. A relief for Vietnamese learners: Indonesian verbs don't conjugate, so these phrases never change form.",
    "vocabulary": [
      {
        "word": "menurut saya",
        "en": "in my opinion",
        "vi": "theo tôi",
        "pos": "phrase",
        "pronunciation_vi": "mơ-nu-rut sa-ya",
        "pronunciation_en": "muh-NOO-root SAH-yah — literally 'according to me'"
      },
      {
        "word": "pendapat",
        "en": "opinion",
        "vi": "ý kiến",
        "pos": "n.",
        "pronunciation_vi": "pơn-da-pạt",
        "pronunciation_en": "puhn-DAH-paht — 'berpendapat' (verb) = to hold the opinion that…"
      },
      {
        "word": "setuju",
        "en": "to agree",
        "vi": "đồng ý",
        "pos": "v.",
        "pronunciation_vi": "sơ-tu-ju",
        "pronunciation_en": "suh-TOO-joo — 'setuju dengan' = agree with; 'tidak setuju' = disagree"
      },
      {
        "word": "benar",
        "en": "correct / right",
        "vi": "đúng",
        "pos": "adj.",
        "pronunciation_vi": "bơ-nar",
        "pronunciation_en": "buh-NAR — 'betul' is a frequent synonym; 'salah' is the opposite (wrong)"
      },
      {
        "word": "salah",
        "en": "wrong / mistaken",
        "vi": "sai",
        "pos": "adj.",
        "pronunciation_vi": "sa-lah",
        "pronunciation_en": "SAH-lah — also 'kesalahan' = a mistake/error"
      },
      {
        "word": "jujur",
        "en": "honest(ly)",
        "vi": "thành thật",
        "pos": "adj.",
        "pronunciation_vi": "ju-jur",
        "pronunciation_en": "JOO-joor — 'sejujurnya' = honestly/to be honest"
      },
      {
        "word": "mungkin",
        "en": "maybe / possibly",
        "vi": "có lẽ",
        "pos": "adv.",
        "pronunciation_vi": "mung-kin",
        "pronunciation_en": "MOONG-kin — softens a statement; key for polite disagreement"
      },
      {
        "word": "masuk akal",
        "en": "makes sense",
        "vi": "hợp lý",
        "pos": "phrase",
        "pronunciation_vi": "ma-suk a-kal",
        "pronunciation_en": "MAH-sook AH-kahl — idiom, 'enters reason'; 'tidak masuk akal' = doesn't make sense"
      },
      {
        "word": "yakin",
        "en": "sure / certain",
        "vi": "chắc chắn",
        "pos": "adj.",
        "pronunciation_vi": "ya-kin",
        "pronunciation_en": "YAH-kin — 'saya yakin' = I'm sure; 'tidak yakin' = not sure"
      },
      {
        "word": "alasan",
        "en": "reason",
        "vi": "lý do",
        "pos": "n.",
        "pronunciation_vi": "a-la-san",
        "pronunciation_en": "ah-LAH-san — 'apa alasannya?' = what's the reason?"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "Menurutmu, ide ini bagus nggak?",
        "en": "In your opinion, is this idea good?",
        "vi": "Theo bạn, ý tưởng này có hay không?"
      },
      {
        "speaker": "B",
        "text": "Saya rasa lumayan, tapi ada satu masalah.",
        "en": "I think it's pretty good, but there's one problem.",
        "vi": "Mình thấy cũng ổn, nhưng có một vấn đề."
      },
      {
        "speaker": "A",
        "text": "Masalah apa? Coba jelaskan alasanmu.",
        "en": "What problem? Try explaining your reasoning.",
        "vi": "Vấn đề gì? Thử giải thích lý do của bạn xem."
      },
      {
        "speaker": "B",
        "text": "Jujur, biayanya terlalu mahal. Bagi saya itu kurang masuk akal.",
        "en": "Honestly, the cost is too high. For me that doesn't quite make sense.",
        "vi": "Thành thật mà nói, chi phí quá đắt. Đối với mình điều đó hơi vô lý."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "___ saya, rencana ini terlalu berisiko.",
        "answer": "Menurut",
        "hint_vi": "từ mở đầu ý kiến, nghĩa 'theo'",
        "hint_en": "the opinion-opener meaning 'according to'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "setuju",
            "đồng ý (to agree)"
          ],
          [
            "mungkin",
            "có lẽ (maybe)"
          ],
          [
            "masuk akal",
            "hợp lý (makes sense)"
          ]
        ],
        "instruction": "Nối từ với nghĩa tiếng Việt",
        "instruction_en": "Match the word with its Vietnamese meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Thành thật mà nói, tôi không đồng ý với điều đó.",
        "english": "Honestly, I don't agree with that.",
        "indonesian": "Sejujurnya, saya tidak setuju dengan itu."
      }
    ]
  },
  {
    "id": "indonesian_time_past_future",
    "level": "B1",
    "category": "grammar_time",
    "title_vi": "Quá khứ và tương lai (sudah / belum / akan)",
    "title_en": "Past and future (sudah / belum / akan)",
    "sentences": [
      {
        "en": "I have already eaten, thank you.",
        "vi": "Tôi ăn rồi, cảm ơn.",
        "pronunciation_focus": [
          "sudah→su-dah",
          "makan→ma-kan"
        ],
        "pronunciation_focus_en": [
          "sudah → 'SOO-dah' — the past/completed marker, like Vietnamese 'rồi'; in speech often shortened to 'udah' or 'dah'",
          "makan → 'MAH-kahn' — to eat; the verb itself never changes for tense — 'sudah' carries the time"
        ]
      },
      {
        "en": "I haven't finished my work yet.",
        "vi": "Tôi chưa làm xong việc.",
        "pronunciation_focus": [
          "belum→bơ-lum",
          "selesai→sơ-lơ-sai"
        ],
        "pronunciation_focus_en": [
          "belum → 'buh-LOOM' — 'not yet'; the exact partner of Vietnamese 'chưa'. The answer to 'Sudah?' is either 'sudah' or 'belum'",
          "selesai → 'suh-luh-SIGH' — finished/done; 'sudah selesai' = already finished"
        ]
      },
      {
        "en": "I will go to Bali next month.",
        "vi": "Tôi sẽ đi Bali vào tháng tới.",
        "pronunciation_focus": [
          "akan→a-kan",
          "bulan depan→bu-lan dơ-pan"
        ],
        "pronunciation_focus_en": [
          "akan → 'AH-kahn' — the future marker, like Vietnamese 'sẽ'; in casual speech 'bakal' or 'mau' often replace it",
          "bulan depan → 'BOO-lahn duh-PAHN' — 'next month'; 'depan' (front) also means 'next/upcoming' in time"
        ]
      },
      {
        "en": "Have you ever been to Indonesia before?",
        "vi": "Bạn đã từng đến Indonesia chưa?",
        "pronunciation_focus": [
          "pernah→pơr-nah",
          "sebelumnya→sơ-bơ-lum-nya"
        ],
        "pronunciation_focus_en": [
          "pernah → 'PER-nah' — 'ever / once (have done)'; 'pernah ke…' = have been to…; 'belum pernah' = never (yet)",
          "sebelumnya → 'suh-buh-LOOM-nyah' — previously/before; built from 'belum' inside 'sebelum' (before)"
        ]
      },
      {
        "en": "I was working when you called.",
        "vi": "Tôi đang làm việc lúc bạn gọi.",
        "pronunciation_focus": [
          "sedang→sơ-dang",
          "menelepon→mơ-nê-lê-pon"
        ],
        "pronunciation_focus_en": [
          "sedang → 'suh-DAHNG' — the ongoing marker, like Vietnamese 'đang'; casual 'lagi' does the same job",
          "menelepon → 'muh-neh-LEH-pohn' — to phone/call; meN- prefix on 'telepon'"
        ]
      }
    ],
    "cultural_notes_vi": "Đây là điểm dễ chịu nhất cho người Việt: tiếng Indonesia KHÔNG chia động từ theo thì. Thay vào đó họ dùng các từ chỉ thời gian đứng trước động từ, giống hệt tiếng Việt: 'sudah' = rồi, 'belum' = chưa, 'akan' = sẽ, 'sedang' = đang. Nếu đã có trạng từ thời gian (kemarin = hôm qua, besok = ngày mai) thì thường bỏ luôn các từ này, vì ngữ cảnh đã rõ.",
    "cultural_notes_en": "This is the friendliest corner of Indonesian for Vietnamese speakers: verbs do NOT conjugate for tense. Instead, small time-words sit before the verb, exactly like Vietnamese: 'sudah' = rồi (already), 'belum' = chưa (not yet), 'akan' = sẽ (will), 'sedang' = đang (-ing). And if there's already a time adverb ('kemarin' = yesterday, 'besok' = tomorrow), Indonesians usually drop these markers — context does the work.",
    "tip_advice_vi": "Cặp 'sudah ↔ belum' hoạt động y như 'rồi ↔ chưa' trong tiếng Việt. Khi ai đó hỏi 'Sudah makan?' (Ăn cơm chưa?), bạn trả lời 'Sudah' (Rồi) hoặc 'Belum' (Chưa) — không bao giờ trả lời 'tidak'. 'Tidak' là 'không' (phủ định chung); 'belum' là 'chưa' (sẽ làm nhưng chưa làm). Nhầm hai từ này là lỗi rất phổ biến.",
    "tip_advice_en": "The pair 'sudah ↔ belum' behaves just like Vietnamese 'rồi ↔ chưa'. When someone asks 'Sudah makan?' ('Have you eaten?'), you answer 'Sudah' (yes, already) or 'Belum' (not yet) — never 'tidak'. 'Tidak' is general negation ('no/not'); 'belum' means 'not yet, but it will happen'. Mixing them up is one of the most common beginner errors — drill the difference.",
    "vocabulary": [
      {
        "word": "sudah",
        "en": "already (completed)",
        "vi": "rồi / đã",
        "pos": "adv.",
        "pronunciation_vi": "su-dah",
        "pronunciation_en": "SOO-dah — completed-action marker; casual 'udah'"
      },
      {
        "word": "belum",
        "en": "not yet",
        "vi": "chưa",
        "pos": "adv.",
        "pronunciation_vi": "bơ-lum",
        "pronunciation_en": "buh-LOOM — the partner of 'sudah'; answer to a 'sudah?' question"
      },
      {
        "word": "akan",
        "en": "will (future)",
        "vi": "sẽ",
        "pos": "adv.",
        "pronunciation_vi": "a-kan",
        "pronunciation_en": "AH-kahn — future marker; casual 'bakal' / 'mau'"
      },
      {
        "word": "sedang",
        "en": "currently (-ing)",
        "vi": "đang",
        "pos": "adv.",
        "pronunciation_vi": "sơ-dang",
        "pronunciation_en": "suh-DAHNG — ongoing marker; casual 'lagi'"
      },
      {
        "word": "pernah",
        "en": "ever / have once",
        "vi": "đã từng",
        "pos": "adv.",
        "pronunciation_vi": "pơr-nah",
        "pronunciation_en": "PER-nah — experiential past; 'belum pernah' = never (yet)"
      },
      {
        "word": "kemarin",
        "en": "yesterday",
        "vi": "hôm qua",
        "pos": "n./adv.",
        "pronunciation_vi": "kơ-ma-rin",
        "pronunciation_en": "kuh-MAH-rin — 'kemarin' also loosely means 'the other day' in speech"
      },
      {
        "word": "besok",
        "en": "tomorrow",
        "vi": "ngày mai",
        "pos": "n./adv.",
        "pronunciation_vi": "bê-sok",
        "pronunciation_en": "BEH-sohk — 'besok pagi' = tomorrow morning; 'lusa' = the day after tomorrow"
      },
      {
        "word": "nanti",
        "en": "later (today/soon)",
        "vi": "lát nữa",
        "pos": "adv.",
        "pronunciation_vi": "nan-ti",
        "pronunciation_en": "NAHN-tee — 'nanti' = later today; 'nanti malam' = tonight (later)"
      },
      {
        "word": "tadi",
        "en": "earlier (just now)",
        "vi": "lúc nãy",
        "pos": "adv.",
        "pronunciation_vi": "ta-di",
        "pronunciation_en": "TAH-dee — recent past today; 'tadi pagi' = earlier this morning"
      },
      {
        "word": "selesai",
        "en": "finished / done",
        "vi": "xong",
        "pos": "v./adj.",
        "pronunciation_vi": "sơ-lơ-sai",
        "pronunciation_en": "suh-luh-SIGH — 'sudah selesai' = already finished"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "Kamu sudah makan siang?",
        "en": "Have you had lunch yet?",
        "vi": "Bạn ăn trưa chưa?"
      },
      {
        "speaker": "B",
        "text": "Belum, masih sibuk. Nanti aja.",
        "en": "Not yet, still busy. Later.",
        "vi": "Chưa, còn bận. Lát nữa thôi."
      },
      {
        "speaker": "A",
        "text": "Kamu pernah coba nasi padang?",
        "en": "Have you ever tried nasi padang?",
        "vi": "Bạn đã từng thử cơm Padang chưa?"
      },
      {
        "speaker": "B",
        "text": "Belum pernah, tapi besok aku akan coba.",
        "en": "Never, but I'll try it tomorrow.",
        "vi": "Chưa từng, nhưng ngày mai mình sẽ thử."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "— Sudah selesai? — ___, sebentar lagi.",
        "answer": "Belum",
        "hint_vi": "trả lời 'chưa' cho câu hỏi 'sudah?'",
        "hint_en": "the 'not yet' answer to a 'sudah?' question"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "sudah",
            "rồi (already)"
          ],
          [
            "akan",
            "sẽ (will)"
          ],
          [
            "sedang",
            "đang (-ing)"
          ]
        ],
        "instruction": "Nối từ chỉ thời gian với nghĩa tiếng Việt",
        "instruction_en": "Match each time-marker with its Vietnamese meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Tôi sẽ đi Bali vào tháng tới.",
        "english": "I will go to Bali next month.",
        "indonesian": "Saya akan pergi ke Bali bulan depan."
      }
    ]
  },
  {
    "id": "indonesian_health_doctor",
    "level": "B1",
    "category": "health",
    "title_vi": "Đi khám bác sĩ",
    "title_en": "At the doctor's",
    "sentences": [
      {
        "en": "I don't feel well, my head and stomach hurt.",
        "vi": "Tôi thấy không khỏe, đầu và bụng tôi đau.",
        "pronunciation_focus": [
          "sakit→sa-kit",
          "kepala→kơ-pa-la",
          "perut→pơ-rut"
        ],
        "pronunciation_focus_en": [
          "sakit → 'SAH-kit' — 'sick / it hurts / pain'; 'sakit kepala' = headache, 'sakit perut' = stomachache",
          "kepala → 'kuh-PAH-lah' — head; 'kepala' also means 'chief/boss' of an office",
          "perut → 'PUH-root' — stomach/belly; final 't' unreleased"
        ]
      },
      {
        "en": "I have had a fever since yesterday.",
        "vi": "Tôi bị sốt từ hôm qua.",
        "pronunciation_focus": [
          "demam→dê-mam",
          "sejak→sơ-jak"
        ],
        "pronunciation_focus_en": [
          "demam → 'deh-MAHM' — fever; 'demam tinggi' = high fever",
          "sejak → 'suh-JAH(k)' — 'since'; 'sejak kemarin' = since yesterday"
        ]
      },
      {
        "en": "I want to see a doctor at the hospital.",
        "vi": "Tôi muốn đi khám bác sĩ ở bệnh viện.",
        "pronunciation_focus": [
          "dokter→dok-ter",
          "rumah sakit→ru-mah sa-kit"
        ],
        "pronunciation_focus_en": [
          "dokter → 'DOHK-ter' — doctor; 'periksa ke dokter' = to go get checked by a doctor",
          "rumah sakit → 'ROO-mah SAH-kit' — literally 'sick house' = hospital; a transparent compound"
        ]
      },
      {
        "en": "The doctor gave me medicine to take three times a day.",
        "vi": "Bác sĩ cho tôi thuốc uống ba lần một ngày.",
        "pronunciation_focus": [
          "obat→o-bạt",
          "minum→mi-num",
          "kali→ka-li"
        ],
        "pronunciation_focus_en": [
          "obat → 'OH-baht' — medicine; note you 'minum obat' (drink medicine), not 'eat' it",
          "minum → 'MEE-noom' — to drink; 'minum obat' = to take medicine",
          "kali → 'KAH-lee' — times/occurrence; 'tiga kali sehari' = three times a day"
        ]
      },
      {
        "en": "Get well soon, take care of yourself.",
        "vi": "Mau khỏe lại nhé, giữ gìn sức khỏe.",
        "pronunciation_focus": [
          "sembuh→sơm-buh",
          "jaga→ja-ga"
        ],
        "pronunciation_focus_en": [
          "sembuh → 'suhm-BOOH' — to recover/heal; 'semoga cepat sembuh' = get well soon (a set phrase)",
          "jaga → 'JAH-gah' — to guard/look after; 'jaga kesehatan' = take care of your health"
        ]
      }
    ],
    "cultural_notes_vi": "Ở Indonesia, nhiều người ghé 'apotek' (hiệu thuốc) trước khi đi bác sĩ, vì dược sĩ có thể tư vấn thuốc thông thường. Hệ thống bảo hiểm y tế công gọi là 'BPJS Kesehatan', dùng được ở bệnh viện công ('rumah sakit') và phòng khám ('puskesmas' — trạm y tế cộng đồng). Câu chúc 'Semoga cepat sembuh' (Chúc mau khỏi) là cách lịch sự khi ai đó bị bệnh.",
    "cultural_notes_en": "In Indonesia many people stop at an 'apotek' (pharmacy) before seeing a doctor, since pharmacists can advise on common medicines. The public health-insurance scheme is 'BPJS Kesehatan', accepted at public hospitals ('rumah sakit') and community clinics ('puskesmas'). 'Semoga cepat sembuh' ('Hope you recover quickly') is the polite, expected thing to say when someone is ill.",
    "tip_advice_vi": "Để mô tả đau ở đâu, ghép 'sakit' + bộ phận cơ thể: 'sakit kepala' (đau đầu), 'sakit perut' (đau bụng), 'sakit gigi' (đau răng), 'sakit tenggorokan' (đau họng). Rất giống tiếng Việt 'đau + ...'. Lưu ý: thuốc thì 'minum obat' (uống thuốc) chứ không 'makan obat' — y như tiếng Việt nói 'uống thuốc'.",
    "tip_advice_en": "To say where it hurts, stack 'sakit' + body part: 'sakit kepala' (headache), 'sakit perut' (stomachache), 'sakit gigi' (toothache), 'sakit tenggorokan' (sore throat) — beautifully parallel to Vietnamese 'đau + …'. One fixed collocation: you 'minum obat' (drink/take medicine), never 'makan obat' (eat) — exactly like Vietnamese 'uống thuốc'.",
    "vocabulary": [
      {
        "word": "rumah sakit",
        "en": "hospital",
        "vi": "bệnh viện",
        "pos": "n.",
        "pronunciation_vi": "ru-mah sa-kit",
        "pronunciation_en": "ROO-mah SAH-kit — literally 'sick house'; often abbreviated 'RS'"
      },
      {
        "word": "dokter",
        "en": "doctor",
        "vi": "bác sĩ",
        "pos": "n.",
        "pronunciation_vi": "dok-ter",
        "pronunciation_en": "DOHK-ter — 'dokter gigi' = dentist, 'dokter anak' = pediatrician"
      },
      {
        "word": "obat",
        "en": "medicine",
        "vi": "thuốc",
        "pos": "n.",
        "pronunciation_vi": "o-bạt",
        "pronunciation_en": "OH-baht — 'minum obat' = to take medicine; 'obat batuk' = cough medicine"
      },
      {
        "word": "sakit",
        "en": "sick / painful",
        "vi": "đau / bệnh",
        "pos": "adj.",
        "pronunciation_vi": "sa-kit",
        "pronunciation_en": "SAH-kit — both 'to be ill' and 'it hurts'; 'orang sakit' = a patient/sick person"
      },
      {
        "word": "demam",
        "en": "fever",
        "vi": "sốt",
        "pos": "n.",
        "pronunciation_vi": "dê-mam",
        "pronunciation_en": "deh-MAHM — 'demam berdarah' = dengue fever"
      },
      {
        "word": "batuk",
        "en": "cough",
        "vi": "ho",
        "pos": "n./v.",
        "pronunciation_vi": "ba-tuk",
        "pronunciation_en": "BAH-took — 'batuk pilek' = cough and cold"
      },
      {
        "word": "apotek",
        "en": "pharmacy",
        "vi": "hiệu thuốc",
        "pos": "n.",
        "pronunciation_vi": "a-po-têk",
        "pronunciation_en": "ah-POH-tehk — from Dutch 'apotheek'; where you buy 'obat'"
      },
      {
        "word": "resep",
        "en": "prescription",
        "vi": "đơn thuốc",
        "pos": "n.",
        "pronunciation_vi": "rê-sêp",
        "pronunciation_en": "REH-sehp — 'resep dokter' = doctor's prescription (also means 'recipe'!)"
      },
      {
        "word": "periksa",
        "en": "to examine / check up",
        "vi": "khám",
        "pos": "v.",
        "pronunciation_vi": "pơ-rik-sa",
        "pronunciation_en": "puh-REEK-sah — 'periksa ke dokter' = to get checked by a doctor"
      },
      {
        "word": "sembuh",
        "en": "to recover / heal",
        "vi": "khỏi bệnh",
        "pos": "v.",
        "pronunciation_vi": "sơm-buh",
        "pronunciation_en": "suhm-BOOH — 'semoga cepat sembuh' = get well soon"
      }
    ],
    "dialogue": [
      {
        "speaker": "Dokter",
        "text": "Selamat siang, ada keluhan apa?",
        "en": "Good afternoon, what's the complaint?",
        "vi": "Chào buổi chiều, bạn có triệu chứng gì?"
      },
      {
        "speaker": "Pasien",
        "text": "Saya demam dan sakit kepala sejak kemarin, Dok.",
        "en": "I've had a fever and headache since yesterday, doctor.",
        "vi": "Tôi bị sốt và đau đầu từ hôm qua, thưa bác sĩ."
      },
      {
        "speaker": "Dokter",
        "text": "Baik, saya periksa dulu. Apakah ada batuk?",
        "en": "Alright, let me check first. Do you have a cough?",
        "vi": "Được, để tôi khám trước. Bạn có bị ho không?"
      },
      {
        "speaker": "Pasien",
        "text": "Sedikit. Nanti saya tebus obatnya di apotek ya, Dok.",
        "en": "A little. I'll get the medicine filled at the pharmacy, doctor.",
        "vi": "Một chút. Lát nữa tôi sẽ ra hiệu thuốc lấy thuốc nhé, bác sĩ."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Saya ___ kepala dan ingin minum obat.",
        "answer": "sakit",
        "hint_vi": "ghép với 'kepala' thành 'đau đầu'",
        "hint_en": "combines with 'kepala' to mean 'headache'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "obat",
            "thuốc (medicine)"
          ],
          [
            "demam",
            "sốt (fever)"
          ],
          [
            "rumah sakit",
            "bệnh viện (hospital)"
          ]
        ],
        "instruction": "Nối từ với nghĩa tiếng Việt",
        "instruction_en": "Match the word with its Vietnamese meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Bác sĩ cho tôi thuốc uống ba lần một ngày.",
        "english": "The doctor gave me medicine to take three times a day.",
        "indonesian": "Dokter memberi saya obat untuk diminum tiga kali sehari."
      }
    ]
  },
  {
    "id": "indonesian_register_formal_informal",
    "level": "B1",
    "category": "register",
    "title_vi": "Trang trọng và thân mật (aku/saya, kamu/Anda)",
    "title_en": "Formal vs. informal register (aku/saya, kamu/Anda)",
    "sentences": [
      {
        "en": "I would like to ask you something, sir. (formal)",
        "vi": "Tôi muốn hỏi ông một điều ạ. (trang trọng)",
        "pronunciation_focus": [
          "saya→sa-ya",
          "Anda→an-da",
          "tanya→ta-nya"
        ],
        "pronunciation_focus_en": [
          "saya → 'SAH-yah' — the neutral/formal 'I', safe with anyone you don't know well",
          "Anda → 'AHN-dah' — formal 'you', always capitalized in writing; polite but a touch distant",
          "tanya → 'TAH-nyah' — to ask; 'ny' is one sound, as in Vietnamese 'nh' (nhà)"
        ]
      },
      {
        "en": "Hey, can you help me? (casual)",
        "vi": "Này, bạn giúp mình được không? (thân mật)",
        "pronunciation_focus": [
          "aku→a-ku",
          "kamu→ka-mu",
          "bantu→ban-tu"
        ],
        "pronunciation_focus_en": [
          "aku → 'AH-koo' — the casual 'I', for friends, family, peers; never use with a stranger you should respect",
          "kamu → 'KAH-moo' — casual 'you'; even shorter 'kau' in some regions, '-mu' as a suffix",
          "bantu → 'BAHN-too' — to help; 'tolong' is the politer 'please help'"
        ]
      },
      {
        "en": "The guests have all arrived.",
        "vi": "Các vị khách đã đến hết rồi.",
        "pronunciation_focus": [
          "tamu-tamu→ta-mu ta-mu",
          "sudah→su-dah",
          "datang→da-tang"
        ],
        "pronunciation_focus_en": [
          "tamu-tamu → 'TAH-moo TAH-moo' — reduplication for 'guests (plural)'; this doubling is your headline grammar point",
          "datang → 'DAH-tahng' — to come/arrive; word-final 'ng' is a single nasal sound",
          "sudah → 'SOO-dah' — 'already'; 'sudah datang' = have arrived"
        ]
      },
      {
        "en": "We bought all kinds of vegetables at the market.",
        "vi": "Chúng tôi mua đủ thứ rau ở chợ.",
        "pronunciation_focus": [
          "sayur-mayur→sa-yur ma-yur",
          "pasar→pa-sar",
          "membeli→mơm-bơ-li"
        ],
        "pronunciation_focus_en": [
          "sayur-mayur → 'SAH-yoor MAH-yoor' — 'all sorts of vegetables'; a rhyming reduplication where the second half changes its first sound",
          "pasar → 'PAH-sar' — market; clean final 'r'",
          "membeli → 'muhm-buh-LEE' — to buy; meN- prefix on root 'beli'"
        ]
      },
      {
        "en": "Slowly, slowly — there's no rush.",
        "vi": "Từ từ thôi — không vội đâu.",
        "pronunciation_focus": [
          "pelan-pelan→pơ-lan pơ-lan",
          "buru-buru→bu-ru bu-ru"
        ],
        "pronunciation_focus_en": [
          "pelan-pelan → 'puh-LAHN puh-LAHN' — doubling an adjective softens/intensifies it: 'nice and slowly'",
          "buru-buru → 'BOO-roo BOO-roo' — 'in a hurry'; 'jangan buru-buru' = don't rush"
        ]
      }
    ],
    "cultural_notes_vi": "Chọn đúng đại từ là kỹ năng xã hội quan trọng nhất ở B1. Dùng 'saya/Anda' với người lạ, người lớn tuổi, cấp trên, hoặc trong công việc. Dùng 'aku/kamu' với bạn bè, người cùng tuổi, người thân. Dùng 'aku' với sếp có thể bị coi là vô lễ; dùng 'Anda' với bạn thân lại nghe lạnh lùng, xa cách. Khi chưa chắc, cứ chọn 'saya' — luôn an toàn.",
    "cultural_notes_en": "Picking the right pronoun is the single most important social skill at B1. Use 'saya/Anda' with strangers, elders, superiors, and at work. Use 'aku/kamu' with friends, peers, and family. Saying 'aku' to your boss can sound disrespectful; saying 'Anda' to a close friend sounds cold and distant. When in doubt, default to 'saya' — it's never wrong.",
    "tip_advice_vi": "Điểm ngữ pháp mới so với tiếng Việt: PHÉP LÁY (reduplication). Tiếng Indonesia lặp từ để: (1) tạo số nhiều — 'orang' (người) → 'orang-orang' (nhiều người), 'anak' → 'anak-anak' (bọn trẻ); (2) làm dịu/nhấn mạnh tính từ — 'pelan-pelan' (từ từ); (3) tạo từ láy vần như 'sayur-mayur' (đủ thứ rau), 'lauk-pauk' (đủ món ăn). Lưu ý: nếu đã có số đếm ('dua orang' = hai người) thì KHÔNG láy nữa.",
    "tip_advice_en": "The new grammar versus Vietnamese is REDUPLICATION (doubling a word). Indonesian repeats words to: (1) form plurals — 'orang' (person) → 'orang-orang' (people), 'anak' → 'anak-anak' (children); (2) soften or intensify adjectives — 'pelan-pelan' (slowly, gently); (3) make rhyming pair-words like 'sayur-mayur' (all kinds of vegetables) and 'lauk-pauk' (assorted dishes). Key rule: if a number is already present ('dua orang' = two people), do NOT reduplicate — the number marks plurality.",
    "vocabulary": [
      {
        "word": "saya",
        "en": "I (formal/neutral)",
        "vi": "tôi (trang trọng)",
        "pos": "pron.",
        "pronunciation_vi": "sa-ya",
        "pronunciation_en": "SAH-yah — the safe, polite 'I' for any situation"
      },
      {
        "word": "aku",
        "en": "I (casual)",
        "vi": "mình / tao (thân mật)",
        "pos": "pron.",
        "pronunciation_vi": "a-ku",
        "pronunciation_en": "AH-koo — casual 'I'; suffix form '-ku' (bukuku = my book)"
      },
      {
        "word": "Anda",
        "en": "you (formal)",
        "vi": "ông / bà / quý vị",
        "pos": "pron.",
        "pronunciation_vi": "an-da",
        "pronunciation_en": "AHN-dah — formal 'you', always capitalized; polite but distant"
      },
      {
        "word": "kamu",
        "en": "you (casual)",
        "vi": "bạn / cậu (thân mật)",
        "pos": "pron.",
        "pronunciation_vi": "ka-mu",
        "pronunciation_en": "KAH-moo — casual 'you'; suffix form '-mu' (bukumu = your book)"
      },
      {
        "word": "Bapak / Pak",
        "en": "Sir / Mr. (older man)",
        "vi": "ông / anh (lịch sự)",
        "pos": "n.",
        "pronunciation_vi": "ba-pak / pak",
        "pronunciation_en": "BAH-pah(k) / pah(k) — respectful address for a man; pairs with a name: 'Pak Budi'"
      },
      {
        "word": "Ibu / Bu",
        "en": "Ma'am / Mrs. (older woman)",
        "vi": "bà / chị (lịch sự)",
        "pos": "n.",
        "pronunciation_vi": "i-bu / bu",
        "pronunciation_en": "EE-boo / boo — respectful address for a woman; 'Bu Ani'"
      },
      {
        "word": "orang-orang",
        "en": "people (plural)",
        "vi": "mọi người",
        "pos": "n.",
        "pronunciation_vi": "o-rang o-rang",
        "pronunciation_en": "OH-rahng OH-rahng — reduplicated plural of 'orang' (person)"
      },
      {
        "word": "anak-anak",
        "en": "children",
        "vi": "trẻ con / bọn trẻ",
        "pos": "n.",
        "pronunciation_vi": "a-nak a-nak",
        "pronunciation_en": "AH-nah(k) AH-nah(k) — reduplicated plural of 'anak' (child)"
      },
      {
        "word": "pelan-pelan",
        "en": "slowly / gently",
        "vi": "từ từ",
        "pos": "adv.",
        "pronunciation_vi": "pơ-lan pơ-lan",
        "pronunciation_en": "puh-LAHN puh-LAHN — softened reduplication of 'pelan' (slow)"
      },
      {
        "word": "sayur-mayur",
        "en": "all kinds of vegetables",
        "vi": "đủ loại rau",
        "pos": "n.",
        "pronunciation_vi": "sa-yur ma-yur",
        "pronunciation_en": "SAH-yoor MAH-yoor — rhyming reduplication; the 'm-' half is a sound-change echo"
      }
    ],
    "dialogue": [
      {
        "speaker": "Karyawan",
        "text": "Selamat pagi, Pak. Apakah Bapak ada waktu sebentar?",
        "en": "Good morning, sir. Do you have a moment? (formal)",
        "vi": "Chào buổi sáng, thưa ông. Ông có chút thời gian không ạ? (trang trọng)"
      },
      {
        "speaker": "Atasan",
        "text": "Tentu, silakan duduk. Ada apa, Bu?",
        "en": "Of course, please sit. What is it, ma'am? (formal)",
        "vi": "Tất nhiên, mời ngồi. Có chuyện gì vậy, chị? (trang trọng)"
      },
      {
        "speaker": "Teman 1",
        "text": "Eh, kamu mau ikut aku ke pasar nggak?",
        "en": "Hey, you wanna come with me to the market? (casual)",
        "vi": "Này, cậu muốn đi chợ với mình không? (thân mật)"
      },
      {
        "speaker": "Teman 2",
        "text": "Boleh! Aku lagi pengen beli sayur-mayur juga.",
        "en": "Sure! I've been wanting to buy some vegetables too. (casual)",
        "vi": "Được! Mình cũng đang muốn mua ít rau. (thân mật)"
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Saat berbicara dengan atasan di kantor, gunakan kata ganti '___' bukan 'aku'.",
        "answer": "saya",
        "hint_vi": "đại từ 'tôi' trang trọng, dùng với cấp trên",
        "hint_en": "the formal 'I' you use with a superior"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "orang-orang",
            "mọi người (people)"
          ],
          [
            "anak-anak",
            "bọn trẻ (children)"
          ],
          [
            "pelan-pelan",
            "từ từ (slowly)"
          ]
        ],
        "instruction": "Nối từ láy với nghĩa tiếng Việt",
        "instruction_en": "Match each reduplicated word with its Vietnamese meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Các vị khách đã đến hết rồi.",
        "english": "The guests have all arrived.",
        "indonesian": "Tamu-tamu sudah datang semua."
      }
    ]
  }
];

export default lessons;
