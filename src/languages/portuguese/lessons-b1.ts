// Brazilian Portuguese — B1 lessons for Vietnamese learners.
//
// Hand-crafted, Vietnamese-first: every sentence, note and tip carries a
// Vietnamese (L1) gloss, and an English companion for cross-checking.
// Topics for this round: work, expressing opinions, narrating in the past,
// healthcare, and housing problems.
//
// NOTE: the portuguese/ package does not yet ship a shared lessons.ts with a
// PortugueseLesson type (this is the first file in the pack), so the lesson
// shape is defined inline here. It mirrors the French pack's FrenchLesson
// shape so the page UI stays consistent across language verticals. When a
// portuguese/lessons.ts registry lands, move this type there and re-import.

export type PortugueseCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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
//   translation: vietnamese, portuguese, english?
export type Exercise = Record<string, any>;

export type PortugueseLesson = {
  id: string;
  category: string;
  level: PortugueseCefrLevel;
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

export const lessons: PortugueseLesson[] = [
  {
    "id": "portuguese_work_talking",
    "level": "B1",
    "category": "work",
    "title_vi": "Nói về công việc",
    "title_en": "Talking about your job",
    "sentences": [
      {
        "en": "Eu trabalho como engenheiro numa empresa de tecnologia.",
        "vi": "Tôi làm kỹ sư ở một công ty công nghệ.",
        "pronunciation_focus": [
          "trabalho→tra-ba-lyu",
          "engenheiro→en-giê-nhêy-ru",
          "empresa→em-prê-za"
        ],
        "pronunciation_focus_en": [
          "trabalho → 'tra-BA-lyu' — 'lh' is 'ly' as in 'million'; the final -o softens to 'u'",
          "engenheiro → 'en-zhe-NYEY-ru' — 'g' before e is 'zh' (like 's' in 'measure'); 'nh' is 'ny' as in 'canyon'",
          "empresa → 'em-PRE-za' — the single s between vowels sounds like 'z', never 's'"
        ]
      },
      {
        "en": "O que você faz da vida?",
        "vi": "Bạn làm nghề gì?",
        "pronunciation_focus": [
          "você→vô-sê",
          "faz→fáis"
        ],
        "pronunciation_focus_en": [
          "você → 'voh-SAY' — stress on the last syllable; 'ç/c+e' is a clean 's' sound",
          "faz → 'FAHS' — the final -z is said like 's' at the end of a phrase in Brazil"
        ]
      },
      {
        "en": "Estou procurando um emprego melhor.",
        "vi": "Tôi đang tìm một công việc tốt hơn.",
        "pronunciation_focus": [
          "procurando→prô-cu-ran-du",
          "melhor→me-lyór"
        ],
        "pronunciation_focus_en": [
          "procurando → 'pro-koo-RAHN-du' — the -ndo ending nasalizes 'an' and ends on 'du'; this is the Brazilian present continuous (estar + -ndo)",
          "melhor → 'meh-LYOR' — 'lh' = 'ly'; open 'o' as in 'or', stress on the last syllable"
        ]
      },
      {
        "en": "Tenho uma reunião importante amanhã de manhã.",
        "vi": "Tôi có một cuộc họp quan trọng vào sáng mai.",
        "pronunciation_focus": [
          "reunião→hê-u-ni-ãu",
          "amanhã→a-ma-nhã"
        ],
        "pronunciation_focus_en": [
          "reunião → 'heh-oo-nee-OWN' — initial 'r' is a throaty 'h' in Brazil; '-ão' is a nasal 'owng' with no real 'g'",
          "amanhã → 'ah-mah-NYAN' — final '-ã' is a nasal 'an'; 'nh' = 'ny'. Note manhã (morning) vs amanhã (tomorrow) — close but different!"
        ]
      },
      {
        "en": "O salário é bom, mas o horário é puxado.",
        "vi": "Lương thì ổn, nhưng giờ giấc thì vất vả.",
        "pronunciation_focus": [
          "salário→xa-la-riu",
          "puxado→pu-sha-du"
        ],
        "pronunciation_focus_en": [
          "salário → 'sah-LAH-ree-u' — stress on the second syllable; final -io glides into 'ree-u'",
          "puxado → 'poo-SHAH-du' — 'x' here is 'sh'; 'puxado' literally 'pulled', idiomatic for 'tough/heavy' (of a schedule)"
        ]
      }
    ],
    "cultural_notes_vi": "Ở Brazil, người ta thường hỏi 'O que você faz?' (Bạn làm nghề gì?) rất sớm khi mới quen. Quan hệ đồng nghiệp thân mật, hay xưng 'você' và gọi tên riêng kể cả với sếp. CLT là hợp đồng lao động chính thức; làm 'freelancer' hay 'PJ' (pessoa jurídica) ngày càng phổ biến.",
    "cultural_notes_en": "Brazilians ask 'O que você faz?' ('What do you do?') very early when meeting someone — it's small talk, not nosiness. Workplaces are warm and first-name: people say 'você' and use given names even with the boss. 'CLT' is the formal labor contract (full benefits); working as a 'freelancer' or 'PJ' (registered as a company) is increasingly common, especially in tech.",
    "tip_advice_vi": "Khi nói về công việc đang diễn ra, dùng 'estar + verbo-ndo': Estou trabalhando (Tôi đang làm việc), Estou procurando (Tôi đang tìm). Đây là thì tiếp diễn của tiếng Bồ Brazil, khác với Bồ Đào Nha (estar a trabalhar).",
    "tip_advice_en": "For ongoing actions, Brazilian Portuguese uses 'estar + verb-ndo': 'Estou trabalhando' (I'm working), 'Estou procurando' (I'm looking). Note this differs from European Portuguese, which says 'estar a trabalhar'. Drill the -ndo ending — it's everywhere in spoken Brazil.",
    "vocabulary": [
      {
        "word": "o emprego",
        "en": "job / employment",
        "vi": "việc làm",
        "pos": "n.m.",
        "pronunciation_vi": "em-prê-gu",
        "pronunciation_en": "em-PRE-gu — final -o softens to 'u'; 'emprego' is a position, 'trabalho' is work in general"
      },
      {
        "word": "a empresa",
        "en": "company",
        "vi": "công ty",
        "pos": "n.f.",
        "pronunciation_vi": "em-prê-za",
        "pronunciation_en": "em-PRE-za — the s between vowels is a 'z' sound"
      },
      {
        "word": "o chefe",
        "en": "boss",
        "vi": "sếp",
        "pos": "n.m.",
        "pronunciation_vi": "sê-fi",
        "pronunciation_en": "SHE-fee — opening 'ch' is 'sh'; final -e softens to 'ee'"
      },
      {
        "word": "o salário",
        "en": "salary",
        "vi": "lương",
        "pos": "n.m.",
        "pronunciation_vi": "xa-la-riu",
        "pronunciation_en": "sah-LAH-ree-u — stress on the second syllable"
      },
      {
        "word": "a reunião",
        "en": "meeting",
        "vi": "cuộc họp",
        "pos": "n.f.",
        "pronunciation_vi": "hê-u-ni-ãu",
        "pronunciation_en": "heh-oo-nee-OWN — '-ão' is nasal 'owng'; plural is 'reuniões' (heh-oo-nee-OYNGS)"
      },
      {
        "word": "o currículo",
        "en": "resume / CV",
        "vi": "sơ yếu lý lịch",
        "pos": "n.m.",
        "pronunciation_vi": "cu-hí-cu-lu",
        "pronunciation_en": "koo-HEE-koo-lu — 'rr' is a throaty 'h' in Brazil, never rolled"
      },
      {
        "word": "a entrevista",
        "en": "interview",
        "vi": "phỏng vấn",
        "pos": "n.f.",
        "pronunciation_vi": "en-trê-vít-ta",
        "pronunciation_en": "en-tre-VEES-ta — stress on the third syllable"
      },
      {
        "word": "contratar",
        "en": "to hire",
        "vi": "tuyển dụng",
        "pos": "v.",
        "pronunciation_vi": "con-tra-tar",
        "pronunciation_en": "kon-tra-TAR — stress on the last syllable; opposite of 'demitir' (to fire)"
      },
      {
        "word": "demitir",
        "en": "to fire / lay off",
        "vi": "sa thải",
        "pos": "v.",
        "pronunciation_vi": "đê-mi-tchir",
        "pronunciation_en": "deh-mee-TCHEER — 'ti' before i palatalizes to 'tchi' in Brazil; reflexive 'demitir-se' = to resign"
      },
      {
        "word": "o cargo",
        "en": "position / role",
        "vi": "chức vụ",
        "pos": "n.m.",
        "pronunciation_vi": "car-gu",
        "pronunciation_en": "KAR-gu — final -o softens to 'u'; 'cargo de gerente' = manager position"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "E aí, o que você faz da vida?",
        "en": "Hey, what do you do for a living?",
        "vi": "Này, bạn làm nghề gì vậy?"
      },
      {
        "speaker": "B",
        "text": "Sou analista de dados. E você?",
        "en": "I'm a data analyst. And you?",
        "vi": "Mình là chuyên viên phân tích dữ liệu. Còn bạn?"
      },
      {
        "speaker": "A",
        "text": "Trabalho com marketing, mas estou procurando outra coisa.",
        "en": "I work in marketing, but I'm looking for something else.",
        "vi": "Mình làm marketing, nhưng đang tìm một việc khác."
      },
      {
        "speaker": "B",
        "text": "Sério? Manda o currículo pra gente, estamos contratando!",
        "en": "Really? Send us your resume, we're hiring!",
        "vi": "Thật à? Gửi sơ yếu lý lịch cho bọn mình đi, bên mình đang tuyển!"
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Estou ___ um emprego melhor.",
        "answer": "procurando",
        "hint_vi": "động từ dạng -ndo (đang làm), nghĩa 'đang tìm'",
        "hint_en": "the -ndo (continuous) form of 'procurar' — 'looking for'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "o chefe",
            "sếp (boss)"
          ],
          [
            "contratar",
            "tuyển dụng (to hire)"
          ],
          [
            "a reunião",
            "cuộc họp (meeting)"
          ]
        ],
        "instruction": "Nối từ tiếng Bồ với nghĩa tiếng Việt",
        "instruction_en": "Match the Portuguese word with its meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Tôi có một cuộc họp quan trọng vào sáng mai.",
        "english": "I have an important meeting tomorrow morning.",
        "portuguese": "Tenho uma reunião importante amanhã de manhã."
      }
    ]
  },
  {
    "id": "portuguese_expr_opinions",
    "level": "B1",
    "category": "expressions",
    "title_vi": "Bày tỏ ý kiến",
    "title_en": "Expressing opinions",
    "sentences": [
      {
        "en": "Na minha opinião, esse projeto vale a pena.",
        "vi": "Theo ý tôi, dự án này đáng để làm.",
        "pronunciation_focus": [
          "opinião→ô-pi-ni-ãu",
          "projeto→prô-jê-tu"
        ],
        "pronunciation_focus_en": [
          "opinião → 'oh-pee-nee-OWN' — '-ão' is nasal 'owng'; stress on the final nasal",
          "projeto → 'pro-ZHE-tu' — 'j' is 'zh' (like 's' in 'measure'); final -o softens to 'u'"
        ]
      },
      {
        "en": "Eu acho que você tem razão.",
        "vi": "Tôi nghĩ bạn nói đúng.",
        "pronunciation_focus": [
          "acho→a-shu",
          "razão→ha-zãu"
        ],
        "pronunciation_focus_en": [
          "acho → 'AH-shu' — 'ch' is 'sh'; 'eu acho que…' (I think that…) is THE everyday way to open an opinion in Brazil",
          "razão → 'hah-ZOWN' — initial 'r' is a throaty 'h'; the s is a 'z'; '-ão' nasal. 'ter razão' = to be right"
        ]
      },
      {
        "en": "Sinceramente, não concordo com isso.",
        "vi": "Thành thật mà nói, tôi không đồng ý với điều đó.",
        "pronunciation_focus": [
          "sinceramente→sin-se-ra-men-tchi",
          "concordo→con-cór-du"
        ],
        "pronunciation_focus_en": [
          "sinceramente → 'seen-seh-rah-MEN-tchee' — the final -te palatalizes to 'tchi' in Brazil; all -mente adverbs do this",
          "concordo → 'kon-KOR-du' — open 'o'; 'concordar com' = to agree WITH (always uses 'com')"
        ]
      },
      {
        "en": "Por um lado entendo, por outro lado discordo.",
        "vi": "Một mặt tôi hiểu, mặt khác tôi không đồng tình.",
        "pronunciation_focus": [
          "lado→la-du",
          "discordo→djis-cór-du"
        ],
        "pronunciation_focus_en": [
          "lado → 'LAH-du' — final -o softens to 'u'; 'por um lado… por outro lado…' = on one hand… on the other…",
          "discordo → 'jees-KOR-du' — the 'di' palatalizes to 'jee'; means the opposite of 'concordo'"
        ]
      },
      {
        "en": "Pra mim, faz todo sentido.",
        "vi": "Đối với tôi, điều đó hoàn toàn hợp lý.",
        "pronunciation_focus": [
          "pra→pra",
          "sentido→sen-tchi-du"
        ],
        "pronunciation_focus_en": [
          "pra → 'prah' — spoken shortening of 'para' (for/to); 'pra mim' = 'for me', extremely common in speech",
          "sentido → 'sen-TCHEE-du' — 'ti' → 'tchi'; 'fazer sentido' = to make sense"
        ]
      }
    ],
    "cultural_notes_vi": "Người Brazil tranh luận nhiệt tình nhưng vẫn giữ không khí thân thiện. Mở đầu ý kiến nhẹ nhàng: 'Eu acho que…' (Tôi nghĩ là…), 'Na minha opinião…' (Theo ý tôi…). Phản bác lịch sự: 'Não concordo' (Tôi không đồng ý) tốt hơn nhiều so với nói thẳng 'Você está errado' (Bạn sai rồi).",
    "cultural_notes_en": "Brazilians debate warmly but keep things friendly. Soften an opinion with 'Eu acho que…' (I think that…) or 'Na minha opinião…' (In my opinion…). To push back, 'Não concordo' (I disagree) lands far better than the blunt 'Você está errado' (You're wrong), which can sound like a personal attack rather than a point about the idea.",
    "tip_advice_vi": "Nhớ giới từ đi kèm: concordar COM (đồng ý với), discordar DE (không đồng tình với). 'Acho que' luôn theo sau là một mệnh đề: Acho que sim / Acho que não (Tôi nghĩ là có / là không).",
    "tip_advice_en": "Lock in the prepositions: 'concordar COM' (agree with), 'discordar DE' (disagree with). 'Acho que' is always followed by a clause — handy shortcuts are 'Acho que sim' (I think so) and 'Acho que não' (I don't think so).",
    "vocabulary": [
      {
        "word": "a opinião",
        "en": "opinion",
        "vi": "ý kiến",
        "pos": "n.f.",
        "pronunciation_vi": "ô-pi-ni-ãu",
        "pronunciation_en": "oh-pee-nee-OWN — '-ão' nasal; plural 'opiniões'"
      },
      {
        "word": "achar",
        "en": "to think / find",
        "vi": "nghĩ rằng",
        "pos": "v.",
        "pronunciation_vi": "a-shar",
        "pronunciation_en": "ah-SHAR — 'ch' is 'sh'; 'eu acho que…' is the go-to opinion opener"
      },
      {
        "word": "concordar",
        "en": "to agree",
        "vi": "đồng ý",
        "pos": "v.",
        "pronunciation_vi": "con-cor-dar",
        "pronunciation_en": "kon-kor-DAR — always pairs with 'com' (concordar com você)"
      },
      {
        "word": "discordar",
        "en": "to disagree",
        "vi": "không đồng tình",
        "pos": "v.",
        "pronunciation_vi": "djis-cor-dar",
        "pronunciation_en": "jees-kor-DAR — 'di' → 'jee'; pairs with 'de' (discordar de algo)"
      },
      {
        "word": "ter razão",
        "en": "to be right",
        "vi": "nói đúng",
        "pos": "expr.",
        "pronunciation_vi": "ter ha-zãu",
        "pronunciation_en": "ter hah-ZOWN — literally 'to have reason'; 'você tem razão' = you're right"
      },
      {
        "word": "o argumento",
        "en": "argument / point",
        "vi": "lập luận",
        "pos": "n.m.",
        "pronunciation_vi": "ar-gu-men-tu",
        "pronunciation_en": "ar-goo-MEN-tu — a reasoned point, not a quarrel (that's 'discussão')"
      },
      {
        "word": "duvidar",
        "en": "to doubt",
        "vi": "nghi ngờ",
        "pos": "v.",
        "pronunciation_vi": "đu-vi-dar",
        "pronunciation_en": "doo-vee-DAR — pairs with 'de'; 'duvido' (I doubt it) is a common one-word reply"
      },
      {
        "word": "sinceramente",
        "en": "honestly / frankly",
        "vi": "thành thật mà nói",
        "pos": "adv.",
        "pronunciation_vi": "sin-se-ra-men-tchi",
        "pronunciation_en": "seen-seh-rah-MEN-tchee — final -te → 'tchi'; flags an honest opinion is coming"
      },
      {
        "word": "o ponto de vista",
        "en": "point of view",
        "vi": "quan điểm",
        "pos": "n.m.",
        "pronunciation_vi": "pon-tu đji vís-ta",
        "pronunciation_en": "PON-tu jee VEES-ta — 'de' → 'jee' before the next word in fast speech"
      },
      {
        "word": "fazer sentido",
        "en": "to make sense",
        "vi": "hợp lý",
        "pos": "expr.",
        "pronunciation_vi": "fa-zer sen-tchi-du",
        "pronunciation_en": "fah-ZER sen-TCHEE-du — 'isso faz sentido' = that makes sense"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "O que você acha da nova proposta?",
        "en": "What do you think of the new proposal?",
        "vi": "Bạn nghĩ sao về đề xuất mới?"
      },
      {
        "speaker": "B",
        "text": "Sinceramente, não me convenceu muito.",
        "en": "Honestly, it didn't really convince me.",
        "vi": "Thành thật thì nó chưa thuyết phục được mình lắm."
      },
      {
        "speaker": "A",
        "text": "Por quê? Pra mim faz todo sentido.",
        "en": "Why? To me it makes total sense.",
        "vi": "Sao vậy? Với mình nó hoàn toàn hợp lý mà."
      },
      {
        "speaker": "B",
        "text": "Entendo seu ponto, mas ainda discordo do prazo.",
        "en": "I get your point, but I still disagree with the deadline.",
        "vi": "Mình hiểu ý bạn, nhưng vẫn không đồng tình về thời hạn."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Eu não ___ com essa decisão.",
        "answer": "concordo",
        "hint_vi": "động từ 'concordar' chia ngôi 'eu', đi với 'com'",
        "hint_en": "'concordar' in the 'eu' form — and it always takes 'com'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "achar",
            "nghĩ rằng (to think)"
          ],
          [
            "ter razão",
            "nói đúng (to be right)"
          ],
          [
            "o ponto de vista",
            "quan điểm (point of view)"
          ]
        ],
        "instruction": "Nối từ với nghĩa",
        "instruction_en": "Match the word with its meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Theo ý tôi, bạn hoàn toàn nói đúng.",
        "english": "In my opinion, you're absolutely right.",
        "portuguese": "Na minha opinião, você tem toda razão."
      }
    ]
  },
  {
    "id": "portuguese_past_narration",
    "level": "B1",
    "category": "past_tense",
    "title_vi": "Kể chuyện trong quá khứ",
    "title_en": "Narrating in the past",
    "sentences": [
      {
        "en": "Ontem eu acordei cedo e fui trabalhar.",
        "vi": "Hôm qua tôi thức dậy sớm và đi làm.",
        "pronunciation_focus": [
          "acordei→a-cor-dêy",
          "fui→fui"
        ],
        "pronunciation_focus_en": [
          "acordei → 'ah-kor-DAY' — '-ei' is 'ay' as in 'day'; this is the simple past (pretérito perfeito), a finished action",
          "fui → 'fwee' — irregular past of 'ir' (to go) AND 'ser' (to be); context tells them apart"
        ]
      },
      {
        "en": "Quando eu era criança, morava no interior.",
        "vi": "Hồi tôi còn nhỏ, tôi sống ở vùng quê.",
        "pronunciation_focus": [
          "era→é-ra",
          "morava→mô-ra-va"
        ],
        "pronunciation_focus_en": [
          "era → 'EH-ra' — imperfect of 'ser'; used for ongoing background states ('I was a child')",
          "morava → 'mo-RAH-va' — imperfect of 'morar'; the -ava ending marks a repeated/habitual past action"
        ]
      },
      {
        "en": "Eu estava dormindo quando o telefone tocou.",
        "vi": "Tôi đang ngủ thì điện thoại reo.",
        "pronunciation_focus": [
          "estava→es-ta-va",
          "tocou→tô-cô"
        ],
        "pronunciation_focus_en": [
          "estava → 'es-TAH-va' — imperfect, sets the ongoing scene ('I was sleeping')",
          "tocou → 'toh-KOH' — simple past, the sudden event that interrupts; '-ou' ending is the 3rd-person perfeito"
        ]
      },
      {
        "en": "Nós já tínhamos saído quando começou a chover.",
        "vi": "Chúng tôi đã ra ngoài rồi thì trời bắt đầu mưa.",
        "pronunciation_focus": [
          "tínhamos→tchí-nha-mus",
          "começou→cô-me-sô"
        ],
        "pronunciation_focus_en": [
          "tínhamos → 'TCHEE-nya-mus' — 'ti' → 'tchi'; 'nh' = 'ny'; this is the past perfect (tínhamos + saído = had left)",
          "começou → 'ko-meh-SOH' — 'ç' is 's'; '-ou' simple past. The earlier action uses pluperfect, the later one perfeito"
        ]
      },
      {
        "en": "Foi uma viagem inesquecível, eu me diverti muito.",
        "vi": "Đó là một chuyến đi khó quên, tôi đã vui lắm.",
        "pronunciation_focus": [
          "inesquecível→i-nes-que-sí-vew",
          "diverti→dji-ver-tchi"
        ],
        "pronunciation_focus_en": [
          "inesquecível → 'ee-nes-keh-SEE-veu' — final -l after a vowel becomes a 'w' sound in Brazil (não → 'naw', Brasil → 'bra-ZEEW')",
          "diverti → 'jee-ver-TCHEE' — 'di' → 'jee', final -ti → 'tchi'; 'divertir-se' (reflexive) = to have fun"
        ]
      }
    ],
    "cultural_notes_vi": "Tiếng Bồ có hai thì quá khứ chính cần phân biệt: PRETÉRITO PERFEITO (acordei, fui, tocou) cho hành động đã xong, và PRETÉRITO IMPERFEITO (era, morava, estava) cho bối cảnh, thói quen, hành động đang diễn ra. Khi kể chuyện, người Brazil đan xen cả hai: imperfeito dựng cảnh, perfeito đẩy diễn biến.",
    "cultural_notes_en": "Portuguese has two core past tenses to keep apart: the PRETÉRITO PERFEITO (acordei, fui, tocou) for completed actions, and the PRETÉRITO IMPERFEITO (era, morava, estava) for background, habits, and ongoing states. A Brazilian story weaves both: the imperfeito sets the scene ('it was raining, I was tired'), the perfeito moves the plot ('then the phone rang').",
    "tip_advice_vi": "Mẹo phân biệt: nếu tiếng Việt dùng 'đang' hoặc 'thường', hãy chọn IMPERFEITO. Nếu là một việc xảy ra một lần và xong, dùng PERFEITO. Câu kinh điển 'Tôi đang ngủ thì điện thoại reo' = imperfeito (estava dormindo) + perfeito (tocou).",
    "tip_advice_en": "Quick test: if you'd say 'was -ing' or 'used to' in English, reach for the IMPERFEITO. If it's a one-time, done event, use the PERFEITO. The classic frame — 'I was sleeping when the phone rang' — is imperfeito (estava dormindo) + perfeito (tocou). Master that contrast and your past narration sounds native.",
    "vocabulary": [
      {
        "word": "ontem",
        "en": "yesterday",
        "vi": "hôm qua",
        "pos": "adv.",
        "pronunciation_vi": "on-tẽi",
        "pronunciation_en": "ON-teng — the -em ending is nasal 'eyng'; signals a perfeito is likely coming"
      },
      {
        "word": "antigamente",
        "en": "in the old days",
        "vi": "ngày xưa",
        "pos": "adv.",
        "pronunciation_vi": "an-tchi-ga-men-tchi",
        "pronunciation_en": "an-tchee-gah-MEN-tchee — cues the imperfeito (habitual past)"
      },
      {
        "word": "acordar",
        "en": "to wake up",
        "vi": "thức dậy",
        "pos": "v.",
        "pronunciation_vi": "a-cor-dar",
        "pronunciation_en": "ah-kor-DAR — past 'eu acordei' (I woke up)"
      },
      {
        "word": "morar",
        "en": "to live / reside",
        "vi": "sống / cư trú",
        "pos": "v.",
        "pronunciation_vi": "mô-rar",
        "pronunciation_en": "moh-RAR — imperfect 'eu morava' (I used to live); pairs with 'em' (morar em São Paulo)"
      },
      {
        "word": "acontecer",
        "en": "to happen",
        "vi": "xảy ra",
        "pos": "v.",
        "pronunciation_vi": "a-con-te-ser",
        "pronunciation_en": "ah-kon-teh-SER — 'o que aconteceu?' = what happened?"
      },
      {
        "word": "a lembrança",
        "en": "memory / keepsake",
        "vi": "kỷ niệm",
        "pos": "n.f.",
        "pronunciation_vi": "lem-bran-sa",
        "pronunciation_en": "lem-BRAN-sa — 'ç' is 's'; nasal 'an'. A remembered moment or a souvenir"
      },
      {
        "word": "a viagem",
        "en": "trip / journey",
        "vi": "chuyến đi",
        "pos": "n.f.",
        "pronunciation_vi": "vi-a-jẽi",
        "pronunciation_en": "vee-AH-zheng — 'g' before e is 'zh'; final -em nasal 'eyng'"
      },
      {
        "word": "de repente",
        "en": "suddenly",
        "vi": "đột nhiên",
        "pos": "adv.",
        "pronunciation_vi": "đji he-pen-tchi",
        "pronunciation_en": "jee heh-PEN-tchee — 'r' is a throaty 'h'; great cue for a perfeito event"
      },
      {
        "word": "enquanto",
        "en": "while",
        "vi": "trong khi",
        "pos": "conj.",
        "pronunciation_vi": "en-quan-tu",
        "pronunciation_en": "en-KWAN-tu — links two imperfeito actions: 'enquanto eu lia…' (while I was reading)"
      },
      {
        "word": "inesquecível",
        "en": "unforgettable",
        "vi": "khó quên",
        "pos": "adj.",
        "pronunciation_vi": "i-nes-que-sí-vew",
        "pronunciation_en": "ee-nes-keh-SEE-veu — final -l → 'w' sound; common in trip/story endings"
      }
    ],
    "dialogue": [
      {
        "speaker": "A",
        "text": "Como foi sua viagem pro Rio?",
        "en": "How was your trip to Rio?",
        "vi": "Chuyến đi Rio của bạn thế nào?"
      },
      {
        "speaker": "B",
        "text": "Foi incrível! Todo dia a gente ia à praia.",
        "en": "It was amazing! Every day we used to go to the beach.",
        "vi": "Tuyệt vời lắm! Ngày nào bọn mình cũng ra biển."
      },
      {
        "speaker": "A",
        "text": "E choveu muito? Tava na época das chuvas.",
        "en": "And did it rain a lot? It was the rainy season.",
        "vi": "Trời có mưa nhiều không? Lúc đó đang mùa mưa mà."
      },
      {
        "speaker": "B",
        "text": "Choveu um dia, mas a gente já tinha visto tudo.",
        "en": "It rained one day, but we had already seen everything.",
        "vi": "Mưa một ngày thôi, nhưng bọn mình đã đi xem hết rồi."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Quando eu ___ criança, morava no interior.",
        "answer": "era",
        "hint_vi": "thì imperfeito của 'ser' (thì), dùng cho trạng thái kéo dài",
        "hint_en": "the imperfeito of 'ser' — used for an ongoing childhood state"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "ontem",
            "hôm qua (yesterday → perfeito)"
          ],
          [
            "antigamente",
            "ngày xưa (in the old days → imperfeito)"
          ],
          [
            "de repente",
            "đột nhiên (suddenly)"
          ]
        ],
        "instruction": "Nối từ với nghĩa và thì gợi ý",
        "instruction_en": "Match the word with its meaning and the tense it cues"
      },
      {
        "type": "translation",
        "vietnamese": "Tôi đang ngủ thì điện thoại reo.",
        "english": "I was sleeping when the phone rang.",
        "portuguese": "Eu estava dormindo quando o telefone tocou."
      }
    ]
  },
  {
    "id": "portuguese_health_doctor",
    "level": "B1",
    "category": "health",
    "title_vi": "Đi khám bệnh",
    "title_en": "At the doctor / healthcare",
    "sentences": [
      {
        "en": "Estou me sentindo mal, acho que estou com febre.",
        "vi": "Tôi thấy mệt, tôi nghĩ mình bị sốt.",
        "pronunciation_focus": [
          "sentindo→sen-tchin-du",
          "febre→fé-bri"
        ],
        "pronunciation_focus_en": [
          "sentindo → 'sen-TCHEEN-du' — 'ti' → 'tchi'; 'sentir-se mal' = to feel unwell",
          "febre → 'FEH-bree' — final -re softens to 'ree'; 'estar com febre' = to have a fever (note: COM, not 'ter')"
        ]
      },
      {
        "en": "Onde dói? Estou com uma dor de cabeça forte.",
        "vi": "Đau ở đâu? Tôi bị đau đầu dữ dội.",
        "pronunciation_focus": [
          "dói→đói",
          "cabeça→ca-bê-sa"
        ],
        "pronunciation_focus_en": [
          "dói → 'DOY' — from 'doer' (to hurt); 'onde dói?' = where does it hurt?",
          "cabeça → 'ka-BEH-sa' — 'ç' is 's'; 'dor de cabeça' = headache"
        ]
      },
      {
        "en": "Preciso marcar uma consulta com o médico.",
        "vi": "Tôi cần đặt lịch hẹn với bác sĩ.",
        "pronunciation_focus": [
          "marcar→mar-car",
          "consulta→con-sul-ta"
        ],
        "pronunciation_focus_en": [
          "marcar → 'mar-KAR' — 'marcar uma consulta' = to book an appointment (fixed collocation)",
          "consulta → 'kon-SOOL-ta' — a medical appointment/visit"
        ]
      },
      {
        "en": "O médico me receitou um antibiótico.",
        "vi": "Bác sĩ kê cho tôi thuốc kháng sinh.",
        "pronunciation_focus": [
          "receitou→he-sêy-tô",
          "antibiótico→an-tchi-bi-ó-tchi-cu"
        ],
        "pronunciation_focus_en": [
          "receitou → 'heh-say-TOH' — initial 'r' is 'h'; 'receitar' = to prescribe; 'a receita' = the prescription (also 'a recipe'!)",
          "antibiótico → 'an-tchee-bee-OH-tchee-ku' — two 'ti' → 'tchi' palatalizations"
        ]
      },
      {
        "en": "Você precisa tomar o remédio duas vezes por dia.",
        "vi": "Bạn cần uống thuốc hai lần một ngày.",
        "pronunciation_focus": [
          "remédio→he-mé-dju",
          "vezes→vê-zis"
        ],
        "pronunciation_focus_en": [
          "remédio → 'heh-MEH-jyu' — 'r' is 'h'; final -dio → 'jyu' (di palatalizes). 'tomar remédio' = to take medicine",
          "vezes → 'VEH-zees' — the z + s both sound like 'z'/'s'; 'duas vezes por dia' = twice a day"
        ]
      }
    ],
    "cultural_notes_vi": "Brazil có hệ thống y tế công SUS (Sistema Único de Saúde) miễn phí cho mọi người, kể cả du khách trong trường hợp khẩn cấp. Phòng khám tư và bảo hiểm (plano de saúde) thì nhanh hơn. Hiệu thuốc (farmácia) ở Brazil rất nhiều và dược sĩ có thể tư vấn thuốc thông thường. 'Posto de saúde' là trạm y tế khu phố.",
    "cultural_notes_en": "Brazil's public health system, SUS (Sistema Único de Saúde), is free for everyone — including tourists in emergencies. Private clinics and health insurance ('plano de saúde') are faster. Pharmacies ('farmácia') are everywhere and pharmacists routinely advise on minor ailments and over-the-counter meds. A 'posto de saúde' is a neighborhood public clinic for basic care.",
    "tip_advice_vi": "Lưu ý: nói triệu chứng dùng 'estar com' chứ không phải 'ter': estou com febre (tôi bị sốt), estou com dor (tôi bị đau), estou com gripe (tôi bị cúm). Để diễn tả đau, dùng 'dor de + bộ phận': dor de cabeça (đau đầu), dor de garganta (đau họng), dor de barriga (đau bụng).",
    "tip_advice_en": "Symptoms use 'estar com', not 'ter': 'estou com febre' (I have a fever), 'estou com dor' (I'm in pain), 'estou com gripe' (I have the flu). For specific aches, use 'dor de + body part': 'dor de cabeça' (headache), 'dor de garganta' (sore throat), 'dor de barriga' (stomachache). Memorize these as fixed chunks.",
    "vocabulary": [
      {
        "word": "o médico / a médica",
        "en": "doctor",
        "vi": "bác sĩ",
        "pos": "n.",
        "pronunciation_vi": "mé-dji-cu",
        "pronunciation_en": "MEH-jee-ku — 'di' → 'jee'; feminine 'a médica'"
      },
      {
        "word": "a consulta",
        "en": "appointment / visit",
        "vi": "lịch hẹn khám",
        "pos": "n.f.",
        "pronunciation_vi": "con-sul-ta",
        "pronunciation_en": "kon-SOOL-ta — 'marcar uma consulta' = to book an appointment"
      },
      {
        "word": "a dor",
        "en": "pain / ache",
        "vi": "cơn đau",
        "pos": "n.f.",
        "pronunciation_vi": "đor",
        "pronunciation_en": "DOR — feminine despite the consonant ending; 'dor de cabeça' = headache"
      },
      {
        "word": "a febre",
        "en": "fever",
        "vi": "sốt",
        "pos": "n.f.",
        "pronunciation_vi": "fé-bri",
        "pronunciation_en": "FEH-bree — final -re → 'ree'; 'estar com febre' = to have a fever"
      },
      {
        "word": "o remédio",
        "en": "medicine",
        "vi": "thuốc",
        "pos": "n.m.",
        "pronunciation_vi": "he-mé-dju",
        "pronunciation_en": "heh-MEH-jyu — 'r' is 'h'; 'tomar remédio' = to take medicine"
      },
      {
        "word": "a receita",
        "en": "prescription",
        "vi": "đơn thuốc",
        "pos": "n.f.",
        "pronunciation_vi": "he-sêy-ta",
        "pronunciation_en": "heh-SAY-ta — same word as 'recipe'! Context decides"
      },
      {
        "word": "a farmácia",
        "en": "pharmacy",
        "vi": "hiệu thuốc",
        "pos": "n.f.",
        "pronunciation_vi": "far-ma-si-a",
        "pronunciation_en": "far-MAH-see-a — stress on second syllable; pharmacists give minor advice"
      },
      {
        "word": "a gripe",
        "en": "the flu",
        "vi": "cúm",
        "pos": "n.f.",
        "pronunciation_vi": "gri-pi",
        "pronunciation_en": "GREE-pee — final -e → 'ee'; 'estar com gripe' = to have the flu"
      },
      {
        "word": "doer",
        "en": "to hurt / ache",
        "vi": "đau",
        "pos": "v.",
        "pronunciation_vi": "đu-er",
        "pronunciation_en": "doo-ER — irregular; 'dói' (it hurts), 'doem' (they hurt)"
      },
      {
        "word": "o sintoma",
        "en": "symptom",
        "vi": "triệu chứng",
        "pos": "n.m.",
        "pronunciation_vi": "sin-tô-ma",
        "pronunciation_en": "seen-TOH-ma — masculine despite the -a ending (Greek root)"
      }
    ],
    "dialogue": [
      {
        "speaker": "Médica",
        "text": "Bom dia! O que você está sentindo?",
        "en": "Good morning! What are you feeling?",
        "vi": "Chào buổi sáng! Bạn thấy thế nào?"
      },
      {
        "speaker": "Paciente",
        "text": "Estou com dor de garganta e um pouco de febre.",
        "en": "I have a sore throat and a slight fever.",
        "vi": "Tôi bị đau họng và hơi sốt."
      },
      {
        "speaker": "Médica",
        "text": "Desde quando? Vou examinar você.",
        "en": "Since when? I'll examine you.",
        "vi": "Từ khi nào vậy? Tôi sẽ khám cho bạn."
      },
      {
        "speaker": "Paciente",
        "text": "Desde ontem. Preciso de remédio?",
        "en": "Since yesterday. Do I need medicine?",
        "vi": "Từ hôm qua. Tôi có cần uống thuốc không?"
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "Estou ___ febre desde ontem.",
        "answer": "com",
        "hint_vi": "triệu chứng dùng 'estar ___', không phải 'ter'",
        "hint_en": "symptoms take 'estar ___' in Portuguese, not 'ter'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "a receita",
            "đơn thuốc (prescription)"
          ],
          [
            "a farmácia",
            "hiệu thuốc (pharmacy)"
          ],
          [
            "doer",
            "đau (to hurt)"
          ]
        ],
        "instruction": "Nối từ với nghĩa",
        "instruction_en": "Match the word with its meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Tôi cần đặt lịch hẹn với bác sĩ.",
        "english": "I need to book an appointment with the doctor.",
        "portuguese": "Preciso marcar uma consulta com o médico."
      }
    ]
  },
  {
    "id": "portuguese_house_problems",
    "level": "B1",
    "category": "house",
    "title_vi": "Sự cố trong nhà",
    "title_en": "Housing problems",
    "sentences": [
      {
        "en": "A torneira da cozinha está vazando.",
        "vi": "Vòi nước nhà bếp đang bị rò rỉ.",
        "pronunciation_focus": [
          "torneira→tor-nêy-ra",
          "vazando→va-zan-du"
        ],
        "pronunciation_focus_en": [
          "torneira → 'tor-NAY-ra' — '-ei-' is 'ay'; 'torneira' = tap/faucet",
          "vazando → 'vah-ZAN-du' — z between vowels; 'vazar' = to leak, in the -ndo continuous form"
        ]
      },
      {
        "en": "A luz acabou, acho que queimou um fusível.",
        "vi": "Mất điện rồi, tôi nghĩ là cháy cầu chì.",
        "pronunciation_focus": [
          "luz→luis",
          "queimou→kêy-mô"
        ],
        "pronunciation_focus_en": [
          "luz → 'LOOS' — final -z → 's'; 'a luz acabou' = the power went out (lit. 'the light ran out')",
          "queimou → 'kay-MOH' — 'qu' is 'k'; '-ou' simple past of 'queimar' (to burn out)"
        ]
      },
      {
        "en": "Tem uma infiltração no teto do quarto.",
        "vi": "Có vết thấm nước trên trần phòng ngủ.",
        "pronunciation_focus": [
          "infiltração→in-fiw-tra-sãu",
          "teto→tê-tu"
        ],
        "pronunciation_focus_en": [
          "infiltração → 'een-feew-trah-SOWN' — '-ção' is nasal 'sowng'; the -l in 'fil-' becomes a 'w'",
          "teto → 'TEH-tu' — 'teto' = ceiling; 'telhado' = the outer roof. Don't mix them up"
        ]
      },
      {
        "en": "O aluguel aumentou e o síndico não resolve nada.",
        "vi": "Tiền thuê tăng mà ban quản lý chẳng giải quyết gì.",
        "pronunciation_focus": [
          "aluguel→a-lu-guéw",
          "síndico→sin-dji-cu"
        ],
        "pronunciation_focus_en": [
          "aluguel → 'ah-loo-GEW' — final -l → 'w'; 'o aluguel' = the rent (the payment, not the act of renting)",
          "síndico → 'SEEN-jee-ku' — 'di' → 'jee'; the 'síndico' is the elected building manager in a condo"
        ]
      },
      {
        "en": "Preciso chamar um encanador com urgência.",
        "vi": "Tôi cần gọi thợ sửa ống nước gấp.",
        "pronunciation_focus": [
          "chamar→sha-mar",
          "encanador→en-ca-na-dor"
        ],
        "pronunciation_focus_en": [
          "chamar → 'shah-MAR' — 'ch' is 'sh'; 'chamar' = to call (for help/service)",
          "encanador → 'en-ka-na-DOR' — a plumber (from 'cano', pipe); 'eletricista' is the electrician"
        ]
      }
    ],
    "cultural_notes_vi": "Ở các chung cư (prédio / condomínio) Brazil, người dân bầu ra 'síndico' để quản lý tòa nhà và xử lý sự cố chung. 'Aluguel' (tiền thuê) thường ký qua bất động sản (imobiliária) và cần người bảo lãnh (fiador). Vào mùa mưa, 'infiltração' (thấm nước) và 'mofo' (mốc) là than phiền phổ biến nhất.",
    "cultural_notes_en": "In Brazilian apartment blocks ('prédio' / 'condomínio'), residents elect a 'síndico' to manage the building and handle shared problems. Rent ('aluguel') is usually arranged through a real-estate agency ('imobiliária') and often requires a guarantor ('fiador'). During the rainy season, 'infiltração' (water seepage) and 'mofo' (mold) are the most common complaints — worth knowing the words before you need them.",
    "tip_advice_vi": "Để báo sự cố, dùng cấu trúc 'estar + com problema' hoặc 'estar + -ndo': A torneira está vazando (vòi đang rò). Khi cần gấp, thêm 'com urgência' hoặc 'o quanto antes' (càng sớm càng tốt). Gọi thợ: chamar um encanador / eletricista / técnico.",
    "tip_advice_en": "To report a problem, use 'estar + with a problem' or the '-ndo' continuous: 'A torneira está vazando' (the tap is leaking). For urgency, add 'com urgência' or 'o quanto antes' (as soon as possible). To call a tradesperson: 'chamar um encanador' (plumber) / 'eletricista' (electrician) / 'técnico' (repair technician).",
    "vocabulary": [
      {
        "word": "o aluguel",
        "en": "rent",
        "vi": "tiền thuê nhà",
        "pos": "n.m.",
        "pronunciation_vi": "a-lu-guéw",
        "pronunciation_en": "ah-loo-GEW — final -l → 'w'; the monthly payment"
      },
      {
        "word": "vazar",
        "en": "to leak",
        "vi": "rò rỉ",
        "pos": "v.",
        "pronunciation_vi": "va-zar",
        "pronunciation_en": "vah-ZAR — z between vowels; 'está vazando' = it's leaking"
      },
      {
        "word": "a torneira",
        "en": "tap / faucet",
        "vi": "vòi nước",
        "pos": "n.f.",
        "pronunciation_vi": "tor-nêy-ra",
        "pronunciation_en": "tor-NAY-ra — '-ei-' is 'ay'"
      },
      {
        "word": "a infiltração",
        "en": "water seepage / damp",
        "vi": "thấm nước",
        "pos": "n.f.",
        "pronunciation_vi": "in-fiw-tra-sãu",
        "pronunciation_en": "een-feew-trah-SOWN — '-ção' nasal; a classic rainy-season complaint"
      },
      {
        "word": "o encanador",
        "en": "plumber",
        "vi": "thợ ống nước",
        "pos": "n.m.",
        "pronunciation_vi": "en-ca-na-dor",
        "pronunciation_en": "en-ka-na-DOR — from 'cano' (pipe)"
      },
      {
        "word": "o eletricista",
        "en": "electrician",
        "vi": "thợ điện",
        "pos": "n.m.",
        "pronunciation_vi": "ê-le-tri-sis-ta",
        "pronunciation_en": "eh-leh-tree-SEES-ta — same form for men and women"
      },
      {
        "word": "o síndico",
        "en": "building manager",
        "vi": "ban quản lý chung cư",
        "pos": "n.m.",
        "pronunciation_vi": "sin-dji-cu",
        "pronunciation_en": "SEEN-jee-ku — the elected condo manager; not a 'landlord'"
      },
      {
        "word": "o vizinho / a vizinha",
        "en": "neighbor",
        "vi": "hàng xóm",
        "pos": "n.",
        "pronunciation_vi": "vi-zi-nhu",
        "pronunciation_en": "vee-ZEE-nyu — 'nh' = 'ny'; feminine 'a vizinha'"
      },
      {
        "word": "consertar",
        "en": "to fix / repair",
        "vi": "sửa chữa",
        "pos": "v.",
        "pronunciation_vi": "con-ser-tar",
        "pronunciation_en": "kon-ser-TAR — 'consertar' (fix) ≠ 'concertar'; the everyday repair verb"
      },
      {
        "word": "o mofo",
        "en": "mold / mildew",
        "vi": "nấm mốc",
        "pos": "n.m.",
        "pronunciation_vi": "mô-fu",
        "pronunciation_en": "MOH-fu — common with 'infiltração' in humid flats"
      }
    ],
    "dialogue": [
      {
        "speaker": "Inquilino",
        "text": "Alô, síndico? A torneira do banheiro está vazando muito.",
        "en": "Hello, building manager? The bathroom tap is leaking a lot.",
        "vi": "Alô, ban quản lý à? Vòi nước nhà tắm đang rò rỉ nhiều lắm."
      },
      {
        "speaker": "Síndico",
        "text": "Desde quando? Já avisou o proprietário?",
        "en": "Since when? Have you told the owner?",
        "vi": "Từ khi nào vậy? Anh báo chủ nhà chưa?"
      },
      {
        "speaker": "Inquilino",
        "text": "Desde ontem. Preciso chamar um encanador com urgência.",
        "en": "Since yesterday. I need to call a plumber urgently.",
        "vi": "Từ hôm qua. Tôi cần gọi thợ sửa ống nước gấp."
      },
      {
        "speaker": "Síndico",
        "text": "Pode chamar. O condomínio cobre o conserto.",
        "en": "Go ahead and call. The building covers the repair.",
        "vi": "Anh cứ gọi đi. Chung cư sẽ chi trả tiền sửa."
      }
    ],
    "exercises": [
      {
        "type": "fill-blank",
        "question": "A torneira está ___, precisa de um encanador.",
        "answer": "vazando",
        "hint_vi": "động từ 'vazar' dạng -ndo, nghĩa 'đang rò rỉ'",
        "hint_en": "the -ndo (continuous) form of 'vazar' — 'leaking'"
      },
      {
        "type": "matching",
        "pairs": [
          [
            "o aluguel",
            "tiền thuê nhà (rent)"
          ],
          [
            "o encanador",
            "thợ ống nước (plumber)"
          ],
          [
            "consertar",
            "sửa chữa (to fix)"
          ]
        ],
        "instruction": "Nối từ với nghĩa",
        "instruction_en": "Match the word with its meaning"
      },
      {
        "type": "translation",
        "vietnamese": "Có vết thấm nước trên trần và tôi cần gọi thợ gấp.",
        "english": "There's water seepage on the ceiling and I need to call a repairman urgently.",
        "portuguese": "Tem uma infiltração no teto e preciso chamar um técnico com urgência."
      }
    ]
  }
];

export default lessons;
