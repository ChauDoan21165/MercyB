// src/data/exam-prep/ielts/speaking-topics.ts
//
// IELTS Speaking content pack — 30 topics across all 3 parts.
//
// IELTS Speaking format (publicly documented by IDP / British Council):
//   Part 1 — Introduction & interview (~4–5 min). Examiner asks about
//            familiar topics: home, family, work/study, free time. Short
//            answers (1–2 sentences each).
//   Part 2 — Long turn / cue card (~3–4 min). Candidate gets a card,
//            1 minute to prepare, then speaks for 1–2 min. Card has a
//            topic plus four bullet points.
//   Part 3 — Discussion (~4–5 min). Examiner shifts to abstract questions
//            related to the Part 2 theme. Candidate gives extended,
//            reasoned answers.
//
// All topic content here is original — written for MercyBlade based on
// the public format spec + standard IELTS pedagogy. No verbatim copy
// from Cambridge / IDP / BC prep materials. Sample answers are
// illustrative — they are NOT band-certified scripts; they're written
// to anchor what the band differences feel like at the response level.
//
// Vietnamese-speaker strategies deliberately call out L1-interference
// patterns the rest of the IELTS prep market under-addresses:
//   - dropped final consonants (test → tes; bed → be)
//   - /θ/ /ð/ replaced with /t/ /d/ (think → tink)
//   - missing articles ("I went to market" instead of "to the market")
//   - tense flattening ("Yesterday I go" instead of "I went")
//   - over-modesty in Part 3 (read as low confidence by examiners)
//   - over-reliance on "I think that..." (signals low band)
//   - vocabulary monotony in Part 2 (same 3 verbs across the long turn)
//
// Marketing claim guarded: copy elsewhere may say "phản hồi tiếng Việt"
// (Vietnamese feedback) — never "duy nhất" (only) or other unverifiable
// superlatives. See reports/a4-ielts-speaking-content.md for the
// content-pack rationale.

export type IELTSSpeakingPart = 1 | 2 | 3;

export type IELTSBandLevel = 5 | 6 | 7 | 8 | 9;

export interface IELTSVocabularyItem {
  /** The English word or short phrase. */
  word: string;
  /** General-American IPA. Mercy uses GA across the app. */
  ipa: string;
  /** Vietnamese gloss. Natural rendering, not a calque. */
  vi_translation: string;
  /** Band level this vocabulary becomes "expected" at on Speaking. */
  band_level: IELTSBandLevel;
  /** A natural example using this word in the topic context. */
  example_use_in_topic: string;
}

export interface IELTSSpeakingTopic {
  /** URL-safe id used in /exam-prep/ielts/speaking/:topicId. */
  id: string;
  part: IELTSSpeakingPart;
  topic_title_vi: string;
  topic_title_en: string;
  /** Vietnamese explainer: when this topic appears + what examiners want. */
  description_vi: string;
  /**
   * Typical examiner questions on this topic. Part 1: 4–6 short questions.
   * Part 2: 1 cue-card prompt; the cue_card_text field holds the bullets.
   * Part 3: 4–6 discussion questions.
   */
  sample_questions: string[];
  /**
   * Part 2 only: the four-bullet cue-card structure as a single block of
   * text the way it would appear on an actual card.
   */
  cue_card_text?: string;
  vocabulary_focus: IELTSVocabularyItem[];
  /** ≥5 VN-speaker tips: L1-transfer mistakes + how to fix them. */
  vietnamese_speaker_strategies: string[];
  /** Illustrative band-7 response. Paragraph form, not a script. */
  sample_strong_answer_band_7: string;
  /**
   * Illustrative band-5 response. Annotation in [square brackets]
   * marks specific weaknesses (vocabulary, tense, missing detail, etc.).
   */
  sample_weak_answer_band_5: string;
  estimated_time_minutes: number;
}

// ─────────────────────────────────────────────────────────────────────
// PART 1 — Introduction & interview (10 topics)
// ─────────────────────────────────────────────────────────────────────

const PART_1_TOPICS: readonly IELTSSpeakingTopic[] = [
  {
    id: "ielts_speaking_part1_hometown",
    part: 1,
    topic_title_vi: "Quê hương",
    topic_title_en: "Hometown",
    description_vi:
      "Một trong những chủ đề Part 1 phổ biến nhất. Giám khảo muốn nghe câu trả lời ngắn, tự nhiên, có chi tiết cá nhân — không phải bài thuộc lòng. Tránh \"my hometown is very beautiful\" rỗng.",
    sample_questions: [
      "Where is your hometown?",
      "What do you like most about your hometown?",
      "Has your hometown changed much in recent years?",
      "Would you like to move back if you live somewhere else now?",
      "Is your hometown a good place for young people to grow up?",
    ],
    vocabulary_focus: [
      {
        word: "bustling",
        ipa: "/ˈbʌs.lɪŋ/",
        vi_translation: "nhộn nhịp",
        band_level: 7,
        example_use_in_topic:
          "Hà Nội is a bustling city, especially around the Old Quarter in the evenings.",
      },
      {
        word: "outskirts",
        ipa: "/ˈaʊt.skɜːrts/",
        vi_translation: "vùng ngoại ô",
        band_level: 6,
        example_use_in_topic:
          "I grew up on the outskirts of Đà Nẵng, about half an hour from the centre.",
      },
      {
        word: "tight-knit community",
        ipa: "/ˌtaɪt nɪt kəˈmjuː.nə.ti/",
        vi_translation: "cộng đồng gắn kết",
        band_level: 7,
        example_use_in_topic: "It's a tight-knit community where neighbours actually know each other.",
      },
      {
        word: "rapid development",
        ipa: "/ˈræp.ɪd dɪˈvel.əp.mənt/",
        vi_translation: "phát triển nhanh",
        band_level: 6,
        example_use_in_topic: "There's been rapid development over the past decade.",
      },
      {
        word: "lose its character",
        ipa: "/luːz ɪts ˈker.ɪk.tər/",
        vi_translation: "mất đi nét riêng",
        band_level: 7,
        example_use_in_topic:
          "Some neighbourhoods have lost their character to high-rise apartments.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'My hometown is very beautiful' — câu này band 5. Thay bằng một chi tiết cụ thể: 'My hometown is famous for its night markets'.",
      "Phụ âm cuối /t/ trong 'hometown' phải nghe được. Người Việt hay nuốt → nghe thành 'hometon'.",
      "Tránh dùng 'because' nhiều lần. Đa dạng: 'since', 'as', 'the reason is that…'.",
      "Khi nói tên thành phố Việt Nam, phát âm chậm + rõ — giám khảo có thể chưa nghe quen.",
      "Khi giám khảo hỏi 'has it changed?' đừng chỉ nói 'yes a lot'. Cho một ví dụ: 'Yes — ten years ago, my street had only one café; now there are five'.",
    ],
    sample_strong_answer_band_7:
      "I'm originally from Đà Nẵng, a coastal city in central Vietnam. What I like most about it is the balance — it's bustling enough to have a real city life, but you can be at a quiet beach in twenty minutes. Honestly, it's changed a lot since I was a kid. Ten years ago, my neighbourhood was mostly low-rise houses; now there are high-rise apartments going up everywhere. Some of the rapid development has been good for jobs, but I do worry the city is starting to lose its character.",
    sample_weak_answer_band_5:
      "My hometown is Đà Nẵng. It is very beautiful. [vague — no detail] I like my hometown because it have many beach. [grammar: it has, plural beaches] Yes it changed. [no example] I want to live there in the future. Thank you. [the 'thank you' is unnecessary and signals nervousness]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_family",
    part: 1,
    topic_title_vi: "Gia đình",
    topic_title_en: "Family",
    description_vi:
      "Giám khảo hỏi về gia đình để bạn ấm lên. Tránh khoe (con học giỏi) hoặc khiêm tốn quá đà (gia đình mình bình thường thôi) — cả hai đều ngại nghe. Trả lời như nói chuyện với người mới quen.",
    sample_questions: [
      "How big is your family?",
      "Who are you closest to in your family?",
      "Do you spend much time with your family?",
      "How has your family influenced you?",
      "Do families in your country tend to be close?",
    ],
    vocabulary_focus: [
      {
        word: "close-knit",
        ipa: "/kloʊs nɪt/",
        vi_translation: "gắn bó",
        band_level: 6,
        example_use_in_topic: "We're a pretty close-knit family — we still have dinner together most weekends.",
      },
      {
        word: "extended family",
        ipa: "/ɪkˈsten.dɪd ˈfæm.ə.li/",
        vi_translation: "đại gia đình",
        band_level: 6,
        example_use_in_topic: "My extended family lives nearby, so I see my cousins almost every week.",
      },
      {
        word: "take after someone",
        ipa: "/teɪk ˈæf.tər/",
        vi_translation: "giống ai",
        band_level: 7,
        example_use_in_topic: "I take after my mother — we're both very stubborn.",
      },
      {
        word: "instil values",
        ipa: "/ɪnˈstɪl ˈvæl.juːz/",
        vi_translation: "truyền đạt giá trị",
        band_level: 8,
        example_use_in_topic: "My parents instilled the value of hard work in me from a young age.",
      },
      {
        word: "moral compass",
        ipa: "/ˈmɔːr.əl ˈkʌm.pəs/",
        vi_translation: "kim chỉ nam đạo đức",
        band_level: 8,
        example_use_in_topic: "My grandfather was my moral compass when I was growing up.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng dùng 'My family have 4 people' — không tự nhiên. Người Anh-Mỹ nói 'There are four of us' hoặc 'I have one brother and one sister'.",
      "Khi nói 'I am closest to my mother', nhớ phụ âm /st/ cuối — 'closes' nghe sai.",
      "Tránh 'My parents are very nice' — thay bằng đặc điểm cụ thể: 'patient', 'easy-going', 'protective'.",
      "Nói về giá trị gia đình truyền lại — nhưng đừng nói 'Vietnamese culture' chung chung. Cụ thể: 'In my family specifically, education was always the priority'.",
      "Số nhiều: 'parents', 'siblings', 'children' — phụ âm cuối /s/ /z/ rõ ràng. Người Việt hay bỏ.",
    ],
    sample_strong_answer_band_7:
      "There are four of us — my parents, my younger sister, and me. I'd say I'm closest to my sister, even though we're six years apart. We text almost every day, even now that I've moved out for work. My family is fairly close-knit; we still have Sunday lunch together when our schedules align. I take after my father in personality — both of us are pretty quiet but stubborn when it comes to things we care about. I think my parents instilled the value of education in me early — I never doubted I'd go to university.",
    sample_weak_answer_band_5:
      "My family have 4 person. [grammar: has 4 people] My father, my mother, my sister, and me. They are very nice. [vague]. I love my family very much. [too generic] We eat dinner together. [no detail of frequency or context] My parent teach me many thing. [plural -s missing twice] In Vietnam family is very important. [stating culture cliché instead of personal answer]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_work_study",
    part: 1,
    topic_title_vi: "Công việc / học tập",
    topic_title_en: "Work or studies",
    description_vi:
      "Câu đầu tiên của Part 1 thường là 'Do you work or study?'. Trả lời rõ trong 1 câu, sau đó phát triển — đừng vòng vo. Nếu đang chuyển nghề, nói thẳng.",
    sample_questions: [
      "Do you work or are you a student?",
      "What do you do for work / what do you study?",
      "Why did you choose that job / subject?",
      "What do you find most interesting about it?",
      "What are your plans for the next few years?",
    ],
    vocabulary_focus: [
      {
        word: "demanding",
        ipa: "/dɪˈmæn.dɪŋ/",
        vi_translation: "đòi hỏi nhiều",
        band_level: 6,
        example_use_in_topic: "It's a demanding job, but I find it really rewarding.",
      },
      {
        word: "make a difference",
        ipa: "/meɪk ə ˈdɪf.rəns/",
        vi_translation: "tạo ra khác biệt",
        band_level: 7,
        example_use_in_topic: "I chose teaching because I wanted to make a difference in students' lives.",
      },
      {
        word: "rewarding",
        ipa: "/rɪˈwɔːr.dɪŋ/",
        vi_translation: "đáng giá / thoả mãn",
        band_level: 6,
        example_use_in_topic: "It's a rewarding career, even when the hours are long.",
      },
      {
        word: "broaden my horizons",
        ipa: "/ˈbrɔːd.ən maɪ həˈraɪ.zənz/",
        vi_translation: "mở rộng tầm nhìn",
        band_level: 7,
        example_use_in_topic:
          "I'm hoping postgraduate studies will broaden my horizons and open new doors.",
      },
      {
        word: "career trajectory",
        ipa: "/kəˈrɪr trəˈdʒek.tər.i/",
        vi_translation: "định hướng nghề nghiệp",
        band_level: 8,
        example_use_in_topic: "I'm thinking carefully about my career trajectory over the next five years.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I am working at company XYZ' — nói 'I work for a tech company in Hà Nội'.",
      "Tránh 'I want to be successful' — vague. Nói cụ thể: 'I want to become a senior developer in three years'.",
      "Giám khảo không quan tâm tên công ty cụ thể — quan tâm bạn LÀM GÌ ở đó.",
      "Nếu đang thất nghiệp, nói thẳng: 'I'm between jobs at the moment, looking for a marketing role'. Trung thực hơn vòng vo.",
      "Phụ âm /st/ cuối 'interest' — phải nghe được. Người Việt hay nói 'interes'.",
    ],
    sample_strong_answer_band_7:
      "I work as a software developer for a fintech startup in Hà Nội. I've been there about two years now. I chose this field because I'd been tinkering with code since high school and wanted to do it professionally. What I find most interesting is the variety — one week I'm building a feature, the next I'm debugging something nobody understood. It's demanding, especially around release deadlines, but it's rewarding when something I built is actually used by thousands of people. Looking ahead, I'm hoping to lead a small team in the next couple of years.",
    sample_weak_answer_band_5:
      "I am working in IT company. [missing article 'an'] I do many thing. [missing -s, vague] I like it because it is interesting. [no detail what's interesting] In future I want to be a manager. [no reasoning, no timeline] My job is good. [empty]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_hobbies",
    part: 1,
    topic_title_vi: "Sở thích",
    topic_title_en: "Hobbies",
    description_vi:
      "Cơ hội thể hiện cá tính. Đừng nói 'reading books' — quá phổ biến. Cho chi tiết: thể loại sách, lý do, gần đây đọc gì.",
    sample_questions: [
      "What do you like to do in your free time?",
      "How long have you had this hobby?",
      "Do you prefer doing it alone or with friends?",
      "Has your taste in hobbies changed over the years?",
      "Do you think hobbies are important for adults?",
    ],
    vocabulary_focus: [
      {
        word: "unwind",
        ipa: "/ʌnˈwaɪnd/",
        vi_translation: "thư giãn / xả stress",
        band_level: 7,
        example_use_in_topic: "Cooking is how I unwind after a long day at work.",
      },
      {
        word: "hooked on",
        ipa: "/hʊkt ɒn/",
        vi_translation: "nghiện / mê",
        band_level: 7,
        example_use_in_topic: "I got hooked on photography during the pandemic and haven't stopped since.",
      },
      {
        word: "pick up a hobby",
        ipa: "/pɪk ʌp ə ˈhɒb.i/",
        vi_translation: "bắt đầu một sở thích",
        band_level: 6,
        example_use_in_topic: "I picked up climbing about a year ago.",
      },
      {
        word: "fully immersed",
        ipa: "/ˈfʊl.i ɪˈmɜːrst/",
        vi_translation: "đắm chìm hoàn toàn",
        band_level: 8,
        example_use_in_topic: "When I'm playing guitar, I get fully immersed and forget about everything else.",
      },
      {
        word: "outlet",
        ipa: "/ˈaʊt.let/",
        vi_translation: "lối thoát / cách giải toả",
        band_level: 7,
        example_use_in_topic: "Painting is my creative outlet — work doesn't give me that.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'I like reading books' — quá phổ biến, nghe học thuộc. Nói thể loại: 'I'm into historical fiction these days'.",
      "Đừng dùng 'free time' nhiều lần — đa dạng: 'spare time', 'downtime', 'after work'.",
      "Khi giám khảo hỏi 'how long?', nói cụ thể số năm/tháng — đừng chỉ 'long time'.",
      "Phụ âm /d/ cuối 'hooked', 'picked' — past participle phải nghe được.",
      "Nếu sở thích đã đổi, nói thẳng: 'I used to play football, but now I prefer hiking' — câu so sánh quá khứ/hiện tại nâng band.",
    ],
    sample_strong_answer_band_7:
      "These days, my main thing is photography — specifically film photography. I picked it up about three years ago after I borrowed a friend's old camera and got hooked on the slowness of it. I usually shoot alone — it's how I unwind. With digital you take a hundred photos and pick one; with film you have to commit before pressing the shutter. It forces me to slow down. I think hobbies matter a lot for adults; without an outlet outside work, life starts to feel one-dimensional.",
    sample_weak_answer_band_5:
      "In free time I like to read book and watch TV. [missing -s] I do it long time. [missing 'a' and tense vague] I like to do alone. [grammar: do it alone] I think hobby is important. [generic, missing -ies/-ies] When I have free time I read. [repeats free time, no detail]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_food",
    part: 1,
    topic_title_vi: "Thức ăn",
    topic_title_en: "Food",
    description_vi:
      "Chủ đề an toàn — ai cũng có ý kiến. Nhưng đừng chỉ liệt kê món Việt. Giám khảo muốn nghe cảm xúc, ký ức, thói quen ăn của bạn.",
    sample_questions: [
      "What kind of food do you usually eat at home?",
      "Do you prefer cooking yourself or eating out?",
      "Has your taste in food changed since you were younger?",
      "Are there any foods you don't like?",
      "Do you think food is an important part of culture?",
    ],
    vocabulary_focus: [
      {
        word: "comfort food",
        ipa: "/ˈkʌm.fərt fuːd/",
        vi_translation: "món ăn dễ chịu / món tuổi thơ",
        band_level: 6,
        example_use_in_topic: "Phở is the ultimate comfort food for me — especially when I'm sick.",
      },
      {
        word: "acquired taste",
        ipa: "/əˈkwaɪrd teɪst/",
        vi_translation: "vị phải tập mới quen",
        band_level: 7,
        example_use_in_topic: "Mắm tôm is definitely an acquired taste — most foreigners struggle with it.",
      },
      {
        word: "from scratch",
        ipa: "/frɒm skrætʃ/",
        vi_translation: "tự nấu từ nguyên liệu thô",
        band_level: 7,
        example_use_in_topic: "On weekends I cook from scratch — during the week, I'm too tired.",
      },
      {
        word: "indulge in",
        ipa: "/ɪnˈdʌldʒ ɪn/",
        vi_translation: "thưởng thức (đôi khi quá đà)",
        band_level: 7,
        example_use_in_topic: "I try to eat healthy, but I'll indulge in dessert on weekends.",
      },
      {
        word: "culinary heritage",
        ipa: "/ˈkʌl.ɪ.ner.i ˈher.ɪ.tɪdʒ/",
        vi_translation: "di sản ẩm thực",
        band_level: 8,
        example_use_in_topic:
          "Vietnam's culinary heritage is one of the things I'd miss most if I lived abroad long-term.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng chỉ nói 'I like phở and bún chả' — kể bạn thích THẾ NÀO: 'I have phở at the same place every Sunday morning'.",
      "Tránh 'Vietnamese food is delicious' — câu này band 5. Nói: 'Vietnamese cooking relies on fresh herbs more than rich sauces'.",
      "Phụ âm cuối /t/ /d/ trong 'eat', 'food', 'liked' — phải nghe được.",
      "Khi nói tên món Việt, có thể giải thích nhanh: 'phở — a beef noodle soup'. Đừng giả định giám khảo biết.",
      "Tránh 'every day' và 'always' lặp đi lặp lại. Đa dạng: 'most weekdays', 'on the weekend', 'when I have time'.",
    ],
    sample_strong_answer_band_7:
      "At home it's mostly Vietnamese food — my mum cooks rice, fish, soup, vegetables, that classic spread. When I'm cooking for myself I keep it simpler: stir-fries, noodles, that kind of thing. Honestly, my taste has changed a lot since I was younger; I used to refuse anything spicy, and now I actively seek it out. Phở is still my comfort food, especially when I'm sick — there's something about that broth that nothing else replaces. I do think food is important culturally; Vietnam's culinary heritage is one of the things I'd miss most if I moved abroad long-term.",
    sample_weak_answer_band_5:
      "I like Vietnamese food. [generic] My mother cook rice and pho every day. [missing -s, missing article 'every' applies broadly] I like to eat. [empty] Vietnamese food is delicious. [cliché] I don't like fast food. [no reasoning] I think food important. [missing 'is']",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_technology",
    part: 1,
    topic_title_vi: "Công nghệ",
    topic_title_en: "Technology",
    description_vi:
      "Chủ đề thường gặp. Đừng chỉ nói 'I use phone every day' — nói bạn dùng để LÀM GÌ và cảm thấy thế nào về nó.",
    sample_questions: [
      "How often do you use technology in your daily life?",
      "What technology do you use most?",
      "How has technology changed the way you work or study?",
      "Are there any tech habits you'd like to change?",
      "Do you think we rely too much on technology?",
    ],
    vocabulary_focus: [
      {
        word: "double-edged sword",
        ipa: "/ˌdʌb.əl edʒd sɔːrd/",
        vi_translation: "con dao hai lưỡi",
        band_level: 7,
        example_use_in_topic: "Smartphones are a double-edged sword — convenient, but addictive.",
      },
      {
        word: "screen time",
        ipa: "/skriːn taɪm/",
        vi_translation: "thời gian xem màn hình",
        band_level: 6,
        example_use_in_topic: "I'm trying to cut down on my screen time, especially before bed.",
      },
      {
        word: "indispensable",
        ipa: "/ˌɪn.dɪˈspen.sə.bəl/",
        vi_translation: "không thể thiếu",
        band_level: 8,
        example_use_in_topic: "My laptop has become indispensable — I can't really work without it.",
      },
      {
        word: "tech-savvy",
        ipa: "/tek ˈsæv.i/",
        vi_translation: "rành công nghệ",
        band_level: 7,
        example_use_in_topic: "My grandmother is surprisingly tech-savvy — she's on TikTok daily.",
      },
      {
        word: "digital detox",
        ipa: "/ˈdɪdʒ.ɪ.təl ˈdiː.tɒks/",
        vi_translation: "cai công nghệ",
        band_level: 7,
        example_use_in_topic: "I try to do a digital detox at least one weekend a month.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'I use phone' — phải có 'my': 'I use my phone'. Người Việt hay quên đại từ sở hữu.",
      "Đừng nói 'technology is very good' — quá đơn giản. Nói 'technology has its ups and downs' hoặc dùng 'double-edged sword'.",
      "Phụ âm /d/ cuối 'technology has changed' — past participle /dʒd/ khó với người Việt.",
      "Đa dạng động từ: thay vì 'use' lặp lại, dùng 'rely on', 'depend on', 'turn to'.",
      "Khi nói 'social media', đừng để cụm này xuất hiện 5 lần. Đa dạng: 'social platforms', 'apps', 'online communities'.",
    ],
    sample_strong_answer_band_7:
      "Honestly, technology is woven into pretty much everything I do — I'd say my phone has become indispensable, which is a bit scary when I think about it. I use it for work emails, news, navigation, paying for things. The biggest change is probably how I learn — I used to buy textbooks; now I watch YouTube tutorials when I want to pick up something new. That said, I do think we rely too much on it. Technology is a double-edged sword: it saves time but it eats into your attention. I'm trying to cut down my screen time before bed.",
    sample_weak_answer_band_5:
      "I use phone every day. [missing 'my'] It is very useful. [generic] I use it for many thing. [missing -s] Technology is good. [empty] I think we use too much. [vague] In future technology will be more advanced. [filler]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_sports",
    part: 1,
    topic_title_vi: "Thể thao",
    topic_title_en: "Sports",
    description_vi:
      "Nếu không thích thể thao, nói thẳng — đừng giả vờ. Examiner trọng câu trả lời thật. Bạn vẫn có thể nói về thể thao xem trên TV hoặc thể thao bạn đã thử.",
    sample_questions: [
      "Do you play any sports?",
      "Do you watch sports on TV?",
      "What sports are popular in your country?",
      "Did you do any sports as a child?",
      "Do you think sports should be mandatory in schools?",
    ],
    vocabulary_focus: [
      {
        word: "keep fit",
        ipa: "/kiːp fɪt/",
        vi_translation: "giữ dáng",
        band_level: 6,
        example_use_in_topic: "I jog twice a week mainly to keep fit.",
      },
      {
        word: "team spirit",
        ipa: "/tiːm ˈspɪr.ɪt/",
        vi_translation: "tinh thần đồng đội",
        band_level: 6,
        example_use_in_topic: "What I miss about football is the team spirit — running alone isn't the same.",
      },
      {
        word: "armchair fan",
        ipa: "/ˈɑːrm.tʃer fæn/",
        vi_translation: "fan ngồi nhà xem",
        band_level: 7,
        example_use_in_topic:
          "I'm an armchair fan — I watch the World Cup religiously, but I haven't kicked a ball in years.",
      },
      {
        word: "physically demanding",
        ipa: "/ˈfɪz.ɪ.kli dɪˈmæn.dɪŋ/",
        vi_translation: "đòi hỏi thể lực",
        band_level: 7,
        example_use_in_topic: "Climbing is physically demanding, but I love how it pushes me.",
      },
      {
        word: "instil discipline",
        ipa: "/ɪnˈstɪl ˈdɪs.ə.plɪn/",
        vi_translation: "rèn kỷ luật",
        band_level: 8,
        example_use_in_topic: "School sports instil discipline that pays off later in life.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I am not interested in sports' rồi dừng — nói tiếp: 'but I do go for walks'.",
      "Phụ âm /ts/ cuối 'sports', 'fans' — cluster khó. Tập riêng.",
      "Tránh 'football is very popular in Vietnam' — câu này ai cũng nói. Thay: 'football has a huge following — every Premier League match has fans watching at 2am here'.",
      "Khi nói thể thao đã chơi hồi nhỏ, dùng quá khứ đúng: 'I used to play badminton', không 'I play badminton when I am child'.",
      "Đừng dùng 'do sport' — sai. Dùng 'play sports' (hoạt động đội), 'do exercise' (cá nhân), 'work out'.",
    ],
    sample_strong_answer_band_7:
      "I'm honestly more of an armchair fan than a player these days. I follow English football pretty seriously — I've stayed up until 2am for matches more times than I should admit. I used to play football quite a lot in school, but once I started working full-time, that fell off. Now I jog twice a week, mainly to keep fit. Football is huge here — every Premier League weekend, you'll see crowds at cafés watching together. I do think sports should be in schools; not for everyone to become an athlete, but because they instil discipline that pays off later.",
    sample_weak_answer_band_5:
      "I don't play sport. [missing -s, dead-end answer] I watch football on TV sometimes. [no detail] In Vietnam football is very popular. [cliché] I think sport is good for health. [empty] When I am young I play badminton. [tense: was, played]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_travel",
    part: 1,
    topic_title_vi: "Du lịch",
    topic_title_en: "Travel",
    description_vi:
      "Đừng nói 'I love traveling' — quá phổ biến. Cụ thể: kiểu du lịch bạn thích, nơi đáng nhớ, học được gì.",
    sample_questions: [
      "Do you like to travel?",
      "What was your most memorable trip?",
      "Do you prefer travelling alone or with others?",
      "What kind of places do you like to visit?",
      "Has the way you travel changed as you've gotten older?",
    ],
    vocabulary_focus: [
      {
        word: "off the beaten track",
        ipa: "/ɒf ðə ˈbiː.tən træk/",
        vi_translation: "xa đường mòn / ít người biết",
        band_level: 7,
        example_use_in_topic:
          "I prefer destinations that are off the beaten track — fewer crowds, more authentic.",
      },
      {
        word: "wanderlust",
        ipa: "/ˈwɒn.də.lʌst/",
        vi_translation: "máu xê dịch",
        band_level: 8,
        example_use_in_topic:
          "I've always had wanderlust — I started saving for trips when I was a teenager.",
      },
      {
        word: "soak up the atmosphere",
        ipa: "/soʊk ʌp ði ˈæt.mə.sfɪr/",
        vi_translation: "đắm mình vào không khí",
        band_level: 7,
        example_use_in_topic:
          "I like to just sit in a local café and soak up the atmosphere — sightseeing exhausts me.",
      },
      {
        word: "broaden one's perspective",
        ipa: "/ˈbrɔːd.ən pərˈspek.tɪv/",
        vi_translation: "mở rộng góc nhìn",
        band_level: 8,
        example_use_in_topic:
          "Travel has broadened my perspective — there's no substitute for actually being somewhere.",
      },
      {
        word: "tourist trap",
        ipa: "/ˈtʊr.ɪst træp/",
        vi_translation: "bẫy du lịch",
        band_level: 7,
        example_use_in_topic: "I avoid tourist traps now — overpriced food, photos, the usual.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I love travel' — sai động từ/danh từ. 'I love travelling' hoặc 'I love to travel'.",
      "Tên địa danh nước ngoài: nhấn đúng. 'Paris' đọc /ˈpær.ɪs/ chứ không 'pa-ri'.",
      "Nói memorable trip cụ thể: thời điểm + một chi tiết đáng nhớ. Đừng chung chung.",
      "Khi nói 'beautiful', đa dạng: 'stunning', 'breathtaking', 'picturesque'.",
      "Phụ âm cuối /t/ trong 'visit', 'tourist' — phải có. Người Việt hay nuốt.",
    ],
    sample_strong_answer_band_7:
      "I do — I'd say I have a bit of wanderlust. The most memorable trip was probably one I took to Japan two years ago; I went off the beaten track to a small fishing town instead of just doing Tokyo and Kyoto. I prefer travelling alone, actually — it's easier to soak up the atmosphere when you're not negotiating with someone else's schedule. The way I travel has changed a lot; in my early twenties I'd cram five cities into a week, now I'd rather spend a week in one place and actually understand it. I avoid tourist traps these days.",
    sample_weak_answer_band_5:
      "Yes I love travel. [grammar: travelling] I want to go to many country. [missing -ies] My favourite is Japan. It is very beautiful. [generic, no detail] I like travel with my friend. [grammar: travelling, missing -s on friends] Travel is good for life. [empty]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_weather",
    part: 1,
    topic_title_vi: "Thời tiết",
    topic_title_en: "Weather",
    description_vi:
      "Chủ đề tưởng dễ nhưng nhiều người trả lời sơ sài. Có cơ hội dùng từ vựng phong phú và kể câu chuyện cá nhân.",
    sample_questions: [
      "What's the weather like in your hometown?",
      "What's your favourite season?",
      "Does the weather affect your mood?",
      "Has the climate where you live changed in recent years?",
      "Do you prefer hot weather or cold weather?",
    ],
    vocabulary_focus: [
      {
        word: "scorching",
        ipa: "/ˈskɔːr.tʃɪŋ/",
        vi_translation: "nóng như đổ lửa",
        band_level: 7,
        example_use_in_topic: "Hà Nội summers are absolutely scorching — sometimes 38 degrees with humidity.",
      },
      {
        word: "drizzly",
        ipa: "/ˈdrɪz.li/",
        vi_translation: "mưa phùn",
        band_level: 7,
        example_use_in_topic: "Spring in the north is drizzly and grey — not most people's favourite season.",
      },
      {
        word: "humidity",
        ipa: "/hjuːˈmɪd.ə.ti/",
        vi_translation: "độ ẩm",
        band_level: 6,
        example_use_in_topic: "The humidity is what makes Vietnamese summers so tough on visitors.",
      },
      {
        word: "unpredictable",
        ipa: "/ˌʌn.prɪˈdɪk.tə.bəl/",
        vi_translation: "khó đoán",
        band_level: 7,
        example_use_in_topic: "The weather has become more unpredictable in recent years.",
      },
      {
        word: "changing patterns",
        ipa: "/ˈtʃeɪn.dʒɪŋ ˈpæt.ərnz/",
        vi_translation: "khí hậu đang thay đổi",
        band_level: 7,
        example_use_in_topic:
          "I've noticed changing patterns — the rainy season starts earlier than it used to.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'weather is hot' — quá đơn giản. Dùng 'sweltering', 'scorching', 'sticky'.",
      "Khi nói nhiệt độ, đọc rõ: 'thirty-five degrees' chứ không 'tirty-five'.",
      "Đừng dùng 'rain rain rain' lặp lại — đa dạng: 'pouring', 'drizzling', 'a downpour'.",
      "Thì hiện tại hoàn thành cho changing patterns: 'It has become hotter' — band 7+.",
      "Phụ âm cuối /st/ 'cold weather' /ðr/ — luyện riêng cluster.",
    ],
    sample_strong_answer_band_7:
      "Hà Nội has four pretty distinct seasons, which is unusual for Vietnam. Summer is scorching — easily 38 degrees with humidity that makes everything feel ten degrees hotter. Winter is short but actually properly cold; you'll see people in heavy jackets in January. My favourite is probably autumn — clear skies, cool evenings, that brief window before winter hits. I'd say weather definitely affects my mood; the drizzly grey weeks in March drag on me. I've also noticed the patterns have become more unpredictable over the past few years — summers feel longer, springs shorter.",
    sample_weak_answer_band_5:
      "In Vietnam weather is hot. [missing 'the', generic] I like winter. [no detail] Summer is too hot. [generic] Sometimes it rain a lot. [missing -s] I don't like rain. [empty] Weather is changing. [no detail]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part1_music",
    part: 1,
    topic_title_vi: "Âm nhạc",
    topic_title_en: "Music",
    description_vi:
      "Cơ hội thể hiện cá tính. Tránh 'I like all kind of music' — câu trả lời rỗng. Cho thể loại + nghệ sĩ + lý do.",
    sample_questions: [
      "What kind of music do you enjoy?",
      "When do you usually listen to music?",
      "Do you play any musical instruments?",
      "Has your taste in music changed since you were younger?",
      "Do you think live music is better than recorded music?",
    ],
    vocabulary_focus: [
      {
        word: "eclectic taste",
        ipa: "/ɪˈklek.tɪk teɪst/",
        vi_translation: "gu đa dạng",
        band_level: 8,
        example_use_in_topic: "I have pretty eclectic taste — anything from indie rock to traditional Vietnamese music.",
      },
      {
        word: "catchy",
        ipa: "/ˈkætʃ.i/",
        vi_translation: "dễ thuộc",
        band_level: 6,
        example_use_in_topic: "It's a catchy song — it gets stuck in your head all day.",
      },
      {
        word: "soundtrack of my life",
        ipa: "/ˈsaʊnd.træk/",
        vi_translation: "nhạc nền của đời mình",
        band_level: 7,
        example_use_in_topic: "Those songs are basically the soundtrack of my teenage years.",
      },
      {
        word: "live performance",
        ipa: "/laɪv pərˈfɔːr.məns/",
        vi_translation: "biểu diễn trực tiếp",
        band_level: 6,
        example_use_in_topic: "There's an energy at a live performance you just don't get from a recording.",
      },
      {
        word: "evoke emotion",
        ipa: "/ɪˈvoʊk ɪˈmoʊ.ʃən/",
        vi_translation: "gợi cảm xúc",
        band_level: 8,
        example_use_in_topic: "Some songs evoke emotion in a way that nothing else really matches.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I like all kind of music' — sai số nhiều VÀ rỗng. Cụ thể: 'I'm mostly into pop and folk'.",
      "Tên ban nhạc nước ngoài: phát âm tự nhiên, không nhấn quá theo kiểu Việt.",
      "Khi nói 'I listen to music' — phụ âm /n/ /m/ /z/ phải rõ.",
      "Đa dạng tần suất: 'every day' lặp đi lặp lại nghe đơn điệu. Dùng 'most days', 'pretty much constantly'.",
      "Câu so sánh nâng band: 'live music is better than recorded' — đừng chỉ trả lời yes/no.",
    ],
    sample_strong_answer_band_7:
      "I've got fairly eclectic taste — anything from indie rock to traditional Vietnamese music depending on the day. I usually listen on my commute, or while I'm cooking; it makes everything more pleasant. I don't play an instrument anymore, but I had piano lessons as a kid and I think about picking it up again. My taste has changed a lot; songs I loved at 17 mostly make me cringe now, while artists I dismissed back then are some of my favourites. Live music is something else — there's an energy at a live performance you just don't get from a recording.",
    sample_weak_answer_band_5:
      "I like all kind of music. [grammar: kinds] I listen to music every day. [vague — when?] My favourite is pop. [no artist] I don't play instrument. [missing 'an'] Music is good for relax. [grammar: relaxing]",
    estimated_time_minutes: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────
// PART 2 — Long turn / cue cards (10 topics)
// ─────────────────────────────────────────────────────────────────────

const PART_2_TOPICS: readonly IELTSSpeakingTopic[] = [
  {
    id: "ielts_speaking_part2_describe_family_member",
    part: 2,
    topic_title_vi: "Mô tả một thành viên trong gia đình bạn ngưỡng mộ",
    topic_title_en: "Describe a family member you admire",
    description_vi:
      "Cue card 'mô tả một người' rất phổ biến. Cấu trúc 4 gạch đầu dòng: ai, mối quan hệ, đặc điểm, lý do ngưỡng mộ. Giám khảo muốn câu chuyện cụ thể, không phải mô tả lý lịch.",
    sample_questions: [
      "Describe a family member who you admire.",
    ],
    cue_card_text:
      "You should say:\n• who this person is\n• how they are related to you\n• what kind of person they are\nand explain why you admire them.",
    vocabulary_focus: [
      {
        word: "look up to",
        ipa: "/lʊk ʌp tə/",
        vi_translation: "ngưỡng mộ / kính trọng",
        band_level: 6,
        example_use_in_topic: "I've always looked up to my grandfather — he ran a small business and put four kids through school.",
      },
      {
        word: "down-to-earth",
        ipa: "/ˌdaʊn.tʊˈɜːrθ/",
        vi_translation: "giản dị / thực tế",
        band_level: 7,
        example_use_in_topic: "He's incredibly successful but completely down-to-earth.",
      },
      {
        word: "set an example",
        ipa: "/set ən ɪɡˈzæm.pəl/",
        vi_translation: "làm gương",
        band_level: 7,
        example_use_in_topic: "She set an example for the rest of us by going back to university at fifty.",
      },
      {
        word: "self-made",
        ipa: "/ˌselfˈmeɪd/",
        vi_translation: "tự lập từ tay trắng",
        band_level: 7,
        example_use_in_topic: "My uncle is genuinely self-made — he started with nothing.",
      },
      {
        word: "perseverance",
        ipa: "/ˌpɜːr.səˈvɪr.əns/",
        vi_translation: "tính kiên trì",
        band_level: 8,
        example_use_in_topic: "What I admire most is her perseverance through the years when nobody believed in her project.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng chỉ nói 'my mother is very kind' — kể một CHUYỆN cụ thể: 'Once when I was 15, she stayed up all night sewing my exam clothes...'.",
      "Cấu trúc 4 phút: 30s ai, 60s mô tả, 90s câu chuyện, 30s lý do ngưỡng mộ + chốt.",
      "Đa dạng tính từ: 'kind' xuất hiện 5 lần là band 5. Dùng 'compassionate', 'thoughtful', 'level-headed'.",
      "Phát âm tên người Việt chậm + rõ. Giám khảo cần nghe được.",
      "Tránh khiêm tốn quá đà về bản thân — IELTS không cần bạn hạ thấp mình. 'I learned a lot from her' là đủ.",
    ],
    sample_strong_answer_band_7:
      "I'd like to talk about my grandmother — she's been the family member I look up to most. She's my mother's mother, and she's now in her late seventies. She's the kind of person who's down-to-earth in a way that masks how impressive she actually is. She raised five kids on her own after my grandfather passed away when my mother was twelve, ran a small market stall to put them through school, and somehow stayed warm through all of it. The story I always come back to is when I was about ten and failed a maths test — she didn't lecture me, she just sat down and re-taught me the chapter, even though her own schooling stopped at primary. I admire her perseverance, but more than that, the way she set an example without ever needing to be praised for it.",
    sample_weak_answer_band_5:
      "I want to talk about my mother. [opener fine] She is very kind. [generic] She love me very much. [missing -s] She cook very well. [missing -s] I admire her. [no story] I love my mother. [filler — runs out of content fast]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_favourite_restaurant",
    part: 2,
    topic_title_vi: "Mô tả nhà hàng yêu thích",
    topic_title_en: "Describe your favourite restaurant",
    description_vi:
      "Cue card 'mô tả một nơi'. Tránh chỉ liệt kê món — kể không khí, ký ức, lý do quay lại.",
    sample_questions: ["Describe your favourite restaurant or café."],
    cue_card_text:
      "You should say:\n• where it is\n• what kind of place it is\n• what you like to eat or drink there\nand explain why it's your favourite.",
    vocabulary_focus: [
      {
        word: "tucked away",
        ipa: "/tʌkt əˈweɪ/",
        vi_translation: "nằm khuất / kín đáo",
        band_level: 7,
        example_use_in_topic: "It's tucked away on a side street, easy to miss if you don't know it's there.",
      },
      {
        word: "hole in the wall",
        ipa: "/hoʊl ɪn ðə wɔːl/",
        vi_translation: "quán nhỏ giản dị",
        band_level: 7,
        example_use_in_topic:
          "It's a real hole in the wall — three tables, family-run — but the food is unbelievable.",
      },
      {
        word: "go-to spot",
        ipa: "/ˈgoʊ.tuː spɒt/",
        vi_translation: "chỗ thường ghé",
        band_level: 6,
        example_use_in_topic: "It's been my go-to spot for late dinners for almost five years.",
      },
      {
        word: "ambience",
        ipa: "/ˈæm.bi.əns/",
        vi_translation: "không khí / không gian",
        band_level: 7,
        example_use_in_topic: "What keeps me coming back is the ambience — soft lighting, no music, you can actually talk.",
      },
      {
        word: "specialty dish",
        ipa: "/ˈspeʃ.əl.ti dɪʃ/",
        vi_translation: "món đặc trưng",
        band_level: 7,
        example_use_in_topic: "The specialty dish is the grilled fish — they marinate it for two days.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng kể địa chỉ chính xác — không quan trọng. Kể CẢM GIÁC khi vào đó.",
      "Tránh 'food is delicious' lặp lại. Dùng 'flavoursome', 'rich', 'subtle', 'beautifully balanced'.",
      "Cụ thể tần suất: 'I go there about once a week' chứ không 'I go there often'.",
      "Phát âm /θ/ 'thirty', 'thoughtful', 'three' — nếu khó, tập riêng.",
      "Khi tả không gian, dùng giác quan: nghe thấy gì, ngửi thấy gì, chứ không chỉ nhìn.",
    ],
    sample_strong_answer_band_7:
      "There's a restaurant in the Old Quarter of Hà Nội that I'd call my go-to spot. It's tucked away on a side street — really a hole in the wall, three small tables, a family operation. They serve northern Vietnamese food: bún chả, nem, that kind of thing. The specialty is the grilled pork; they marinate it in fish sauce and honey overnight, and the smell when it hits the charcoal is honestly the best argument for going. What keeps me coming back, though, isn't really the food — it's the ambience. The grandmother runs the kitchen, her son takes orders, and they actually remember you after the second visit. There's something about being recognised in a city of nine million that feels like home.",
    sample_weak_answer_band_5:
      "I like a restaurant near my house. [vague] The food is delicious. [generic] I eat there with my family. [no detail of frequency or atmosphere] It is cheap. [empty] I like it because it is good. [circular]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_celebration",
    part: 2,
    topic_title_vi: "Mô tả một dịp lễ đáng nhớ",
    topic_title_en: "Describe a memorable celebration",
    description_vi:
      "Cue card 'mô tả một sự kiện'. Có thể là Tết, đám cưới, sinh nhật, lễ tốt nghiệp. Tránh nói 'it was very fun' — kể CẢM XÚC cụ thể.",
    sample_questions: ["Describe a memorable celebration you took part in."],
    cue_card_text:
      "You should say:\n• what the celebration was\n• when and where it took place\n• who was there\nand explain why it was memorable.",
    vocabulary_focus: [
      {
        word: "gathering",
        ipa: "/ˈɡæð.ər.ɪŋ/",
        vi_translation: "buổi tụ họp",
        band_level: 6,
        example_use_in_topic: "It was a small family gathering — only fifteen of us, but it felt full.",
      },
      {
        word: "milestone",
        ipa: "/ˈmaɪl.stoʊn/",
        vi_translation: "cột mốc",
        band_level: 7,
        example_use_in_topic: "It was a milestone for her — twenty-five years at the same school.",
      },
      {
        word: "in full swing",
        ipa: "/ɪn fʊl swɪŋ/",
        vi_translation: "đang sôi nổi nhất",
        band_level: 7,
        example_use_in_topic: "By 8pm the party was in full swing — music, dancing, the works.",
      },
      {
        word: "heartwarming",
        ipa: "/ˈhɑːrtˌwɔːr.mɪŋ/",
        vi_translation: "ấm lòng",
        band_level: 7,
        example_use_in_topic: "The toast my brother gave was genuinely heartwarming.",
      },
      {
        word: "etched in memory",
        ipa: "/etʃt ɪn ˈmem.ər.i/",
        vi_translation: "khắc sâu trong ký ức",
        band_level: 8,
        example_use_in_topic: "That moment — her face when she opened the gift — is etched in my memory.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng kể TOÀN BỘ ngày — chọn 1-2 khoảnh khắc cụ thể. Examiner chấm chiều sâu chứ không độ rộng.",
      "Tránh 'we were very happy' lặp lại. Dùng 'thrilled', 'overjoyed', 'on cloud nine'.",
      "Phát âm /ʤ/ 'gathering', 'celebration' /tʃ/ 'church' — phụ âm khó với người Việt.",
      "Đa dạng quá khứ: 'we went, we ate, we danced' = đơn điệu. Mix với 'I remember', 'I'll never forget'.",
      "Kết bài bằng câu rút lại lý do tại sao đáng nhớ — đừng dừng đột ngột.",
    ],
    sample_strong_answer_band_7:
      "The celebration that stands out most was my grandmother's eightieth birthday two years ago. We held it in her village in the countryside — the whole extended family came back, including my uncle who flew in from Australia. We were maybe forty people, three generations under one roof. What I remember most isn't the food, even though there was tons of it; it's the moment after dinner when my cousin gave a short speech and my grandmother actually cried — which she never does. By 8pm the gathering was in full swing, with the kids running around and the older relatives playing cards. It was a milestone for her, but it became a milestone for the family too — that was the last time we were all together before my grandfather got sick. That moment is etched in my memory.",
    sample_weak_answer_band_5:
      "I want to talk about Tet last year. [opener fine] I went to my hometown. We eat a lot of food. [missing -s, no detail] Many people come. [tense, vague] It was very fun. [generic] I love Tet. [empty]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_valuable_item",
    part: 2,
    topic_title_vi: "Mô tả một vật giá trị với bạn",
    topic_title_en: "Describe a possession that means a lot to you",
    description_vi:
      "Cue card 'mô tả một vật'. Không nhất thiết phải đắt — có thể là cuốn sách, lá thư, đồ thừa kế. Giá trị nằm ở câu chuyện.",
    sample_questions: [
      "Describe a possession that means a lot to you.",
    ],
    cue_card_text:
      "You should say:\n• what it is\n• how you got it\n• how long you've had it\nand explain why it means a lot to you.",
    vocabulary_focus: [
      {
        word: "sentimental value",
        ipa: "/ˌsen.tɪˈmen.təl ˈvæl.juː/",
        vi_translation: "giá trị tinh thần",
        band_level: 7,
        example_use_in_topic: "It's not worth much in money, but it has huge sentimental value.",
      },
      {
        word: "heirloom",
        ipa: "/ˈer.luːm/",
        vi_translation: "vật gia truyền",
        band_level: 8,
        example_use_in_topic: "It's a family heirloom — passed down through three generations now.",
      },
      {
        word: "stand the test of time",
        ipa: "/stænd ðə test əv taɪm/",
        vi_translation: "trụ vững theo thời gian",
        band_level: 8,
        example_use_in_topic: "It's a simple item, but it's stood the test of time.",
      },
      {
        word: "battered but loved",
        ipa: "/ˈbæt.ərd bʌt lʌvd/",
        vi_translation: "cũ kỹ nhưng được yêu",
        band_level: 7,
        example_use_in_topic: "The book is battered but loved — every page has my notes in the margins.",
      },
      {
        word: "memento",
        ipa: "/məˈmen.toʊ/",
        vi_translation: "kỷ vật",
        band_level: 7,
        example_use_in_topic: "I keep it as a memento of that summer.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'this is my phone' — quá hiện đại, ít chiều sâu. Chọn vật có CÂU CHUYỆN.",
      "Phát âm /θ/ trong 'thirty', 'thoughtful' — luyện riêng nếu khó.",
      "Dùng 'used to' cho quá khứ thói quen: 'I used to take it everywhere with me'.",
      "Câu so sánh 'compared to a new one, mine has...' nâng band.",
      "Đừng nói 'very old' — dùng số: 'about twenty years old'.",
    ],
    sample_strong_answer_band_7:
      "I'd like to talk about my grandfather's watch. It's a simple silver one — nothing fancy, no designer name — but it's stood the test of time, both literally and figuratively. He bought it in the seventies, wore it every day until he passed away when I was sixteen, and my grandmother gave it to me at the funeral. So I've had it about ten years now. The face is scratched, the leather strap is on its third replacement, but I refuse to swap the original parts. It has huge sentimental value — when I look at it I think about him at his desk, doing his accounts, this watch on his wrist. It's a memento of someone I miss but also a quiet reminder to take my time the way he did. Battered but loved, basically.",
    sample_weak_answer_band_5:
      "I will talk about my phone. [too modern, low ceiling] I bought it 2 years ago. [tense fine but no story] I use it every day. [no emotional detail] It is very useful. [generic] I love my phone. [empty]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_challenge",
    part: 2,
    topic_title_vi: "Mô tả thử thách bạn đã vượt qua",
    topic_title_en: "Describe a challenge you overcame",
    description_vi:
      "Cue card 'mô tả một trải nghiệm'. Đừng chọn thử thách quá nhỏ. Dùng cấu trúc Situation-Action-Outcome-Lesson.",
    sample_questions: ["Describe a difficult challenge that you overcame."],
    cue_card_text:
      "You should say:\n• what the challenge was\n• when and how it happened\n• what you did to overcome it\nand explain how you felt afterwards.",
    vocabulary_focus: [
      {
        word: "out of my depth",
        ipa: "/aʊt əv maɪ depθ/",
        vi_translation: "vượt quá tầm",
        band_level: 7,
        example_use_in_topic: "Honestly, I felt completely out of my depth in the first week.",
      },
      {
        word: "rise to the occasion",
        ipa: "/raɪz tə ði əˈkeɪ.ʒən/",
        vi_translation: "vượt qua thử thách",
        band_level: 8,
        example_use_in_topic: "I had to rise to the occasion — there was no one else to do it.",
      },
      {
        word: "throw in the towel",
        ipa: "/θroʊ ɪn ðə ˈtaʊ.əl/",
        vi_translation: "bỏ cuộc",
        band_level: 8,
        example_use_in_topic: "I almost threw in the towel halfway through.",
      },
      {
        word: "pull through",
        ipa: "/pʊl θruː/",
        vi_translation: "vượt qua được",
        band_level: 7,
        example_use_in_topic: "Somehow I pulled through, mostly because the team had my back.",
      },
      {
        word: "learning curve",
        ipa: "/ˈlɜːr.nɪŋ kɜːrv/",
        vi_translation: "quá trình học hỏi",
        band_level: 7,
        example_use_in_topic: "It was a steep learning curve, but I grew more in three months than the previous year.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng chọn 'my IELTS test' làm thử thách — clichéd. Chọn việc thật trong đời.",
      "Cấu trúc: 30s vấn đề, 60s tại sao khó, 90s bạn làm gì, 30s cảm giác sau đó.",
      "Past simple lẫn past perfect: 'I had never... when I was asked to...' — dấu hiệu band 7.",
      "Tránh 'very difficult' lặp lại. 'overwhelming', 'daunting', 'gruelling'.",
      "Đừng kết bằng 'I am very proud' rỗng. Cụ thể: 'It taught me that I can handle more pressure than I thought'.",
    ],
    sample_strong_answer_band_7:
      "The challenge that comes to mind is my first management role. I was promoted at twenty-six, much earlier than expected, and suddenly I had four people reporting to me, two of whom were older than me. Honestly I felt completely out of my depth in the first month. The hardest part wasn't the work — it was the conversations: telling someone their performance wasn't good enough, mediating a disagreement between two colleagues. I almost threw in the towel six weeks in. What pulled me through was finding a mentor outside my company who'd been through it, plus reading a few books and just being honest with my team that I was learning. By month four I started recognising the rhythm. It was a steep learning curve, but it taught me I can handle more pressure than I thought.",
    sample_weak_answer_band_5:
      "I want to talk about IELTS test. [cliché] It is very difficult. [generic] I study hard every day. [no specific actions] My teacher help me. [missing -s] Now I am happy. [empty]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_dream_destination",
    part: 2,
    topic_title_vi: "Mô tả nơi bạn muốn đến",
    topic_title_en: "Describe a place you'd like to visit",
    description_vi:
      "Cue card 'nơi muốn đến nhưng chưa đi'. Cụ thể tại sao MUỐN đi đó — không chung chung 'nơi đẹp'.",
    sample_questions: ["Describe a place you'd like to visit but haven't been to yet."],
    cue_card_text:
      "You should say:\n• where it is\n• how you first heard about it\n• what you'd do there\nand explain why you want to go.",
    vocabulary_focus: [
      {
        word: "bucket list",
        ipa: "/ˈbʌk.ɪt lɪst/",
        vi_translation: "danh sách phải làm trong đời",
        band_level: 7,
        example_use_in_topic: "It's been on my bucket list for as long as I can remember.",
      },
      {
        word: "stunning landscapes",
        ipa: "/ˈstʌn.ɪŋ ˈlænd.skeɪps/",
        vi_translation: "phong cảnh choáng ngợp",
        band_level: 7,
        example_use_in_topic: "The stunning landscapes are what drew me to it in the first place.",
      },
      {
        word: "pilgrimage",
        ipa: "/ˈpɪl.ɡrɪm.ɪdʒ/",
        vi_translation: "chuyến hành hương / mơ ước",
        band_level: 8,
        example_use_in_topic: "For any music fan it's basically a pilgrimage to the city where the genre started.",
      },
      {
        word: "in person",
        ipa: "/ɪn ˈpɜːr.sən/",
        vi_translation: "tận mắt",
        band_level: 6,
        example_use_in_topic: "I want to see it in person, not through someone's photos on Instagram.",
      },
      {
        word: "soak in the culture",
        ipa: "/soʊk ɪn ðə ˈkʌl.tʃər/",
        vi_translation: "cảm nhận văn hoá",
        band_level: 7,
        example_use_in_topic: "I'd take at least a month so I could really soak in the culture.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I want to go to America' — quá rộng. Cụ thể: 'New Orleans, because of the jazz history'.",
      "Câu điều kiện: 'If I had the money, I'd…' — giúp band cao hơn.",
      "Phát âm tên thành phố nước ngoài cho đúng — luyện trước.",
      "Dùng would, could, might khi nói về kế hoạch — không quá chắc chắn.",
      "Tránh 'it is very beautiful' — luôn cụ thể: 'the architecture, the food, the history'.",
    ],
    sample_strong_answer_band_7:
      "The place I've always wanted to visit is Iceland. It's been on my bucket list since I was a teenager — I first saw it in a documentary about the northern lights, and the stunning landscapes hooked me immediately. If I went, I'd probably go in winter, even though the weather would be brutal, just for the chance to see the auroras in person. I'd want to drive the ring road, hit a few hot springs, walk on a black-sand beach. The reason it appeals to me is honestly that it looks completely unlike anywhere I've been; growing up in tropical Vietnam, the idea of a country with no trees and active volcanoes just sounds like another planet. I'd take at least two weeks so I could actually soak in the culture instead of rushing.",
    sample_weak_answer_band_5:
      "I want to go to Japan. [generic — popular choice without reason] It is very beautiful. [empty] I want to see flower. [missing -s, missing context] I want to eat sushi. [no detail] I hope I can go in future. [filler]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_recent_purchase",
    part: 2,
    topic_title_vi: "Mô tả món bạn mới mua gần đây",
    topic_title_en: "Describe something you bought recently",
    description_vi:
      "Cue card 'mô tả một vật'. Khác với 'vật giá trị' — đây là mua RECENTLY. Có thể có hoặc không có cảm xúc lớn — đó là OK.",
    sample_questions: ["Describe something you bought recently."],
    cue_card_text:
      "You should say:\n• what it is\n• where you bought it\n• why you bought it\nand explain how you feel about it now.",
    vocabulary_focus: [
      {
        word: "splurge on",
        ipa: "/splɜːrdʒ ɒn/",
        vi_translation: "chi đậm cho",
        band_level: 7,
        example_use_in_topic: "I decided to splurge on a good pair of headphones after years of using cheap ones.",
      },
      {
        word: "impulse buy",
        ipa: "/ˈɪm.pʌls baɪ/",
        vi_translation: "mua bốc đồng",
        band_level: 7,
        example_use_in_topic: "It was a bit of an impulse buy — I'd be lying if I said I planned it.",
      },
      {
        word: "worth every penny",
        ipa: "/wɜːrθ ˈev.ri ˈpen.i/",
        vi_translation: "đáng từng đồng",
        band_level: 7,
        example_use_in_topic: "Two months in, it's worth every penny.",
      },
      {
        word: "buyer's remorse",
        ipa: "/ˈbaɪ.ərz rɪˈmɔːrs/",
        vi_translation: "hối hận sau khi mua",
        band_level: 8,
        example_use_in_topic: "I had a bit of buyer's remorse the first week, but it's grown on me.",
      },
      {
        word: "well-built",
        ipa: "/ˌwelˈbɪlt/",
        vi_translation: "chắc chắn / chế tác tốt",
        band_level: 6,
        example_use_in_topic: "What surprised me is how well-built it is for the price.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'I bought a phone' — quá phổ biến. Chọn món có chuyện kể.",
      "Quá khứ: 'I bought', 'I went', 'I decided' — phụ âm /t/ /d/ cuối phải nghe được.",
      "Cảm giác: 'thrilled', 'pleased', 'underwhelmed' thay vì 'happy'.",
      "Dùng so sánh: 'compared to my old one, this is...' — nâng band.",
      "Trung thực: nếu thấy hối hận, nói thẳng 'I had buyer's remorse' — examiner thích câu trả lời thật.",
    ],
    sample_strong_answer_band_7:
      "The most recent thing I splurged on was a pair of noise-cancelling headphones — it was about a month ago. I'd been using cheap earbuds for years, breaking a pair every six months, and I finally decided I was tired of replacing them. I bought them online from a Japanese retailer that had a sale. Honestly, the first week I had a bit of buyer's remorse — they cost three times what I usually spend. But two months in, they're worth every penny. The noise cancellation has changed my morning commute completely; the bus is loud here, and now it's just music. They're also incredibly well-built — I expect to have these for years. So the regret faded fast.",
    sample_weak_answer_band_5:
      "Last week I buy a phone. [tense: bought] It is iPhone. [generic, missing 'an'] I bought in the shop. [vague — which shop] I like it. [empty] It is very expensive. [no reflection]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_teacher",
    part: 2,
    topic_title_vi: "Mô tả thầy/cô có ảnh hưởng đến bạn",
    topic_title_en: "Describe a teacher who influenced you",
    description_vi:
      "Cue card 'mô tả một người'. Kể câu chuyện cụ thể chứ không liệt kê đặc điểm.",
    sample_questions: ["Describe a teacher who has had an influence on you."],
    cue_card_text:
      "You should say:\n• who this teacher was\n• what subject they taught\n• what they were like as a person\nand explain how they influenced you.",
    vocabulary_focus: [
      {
        word: "no-nonsense",
        ipa: "/noʊ ˈnɒn.səns/",
        vi_translation: "thẳng thắn / không nhảm nhí",
        band_level: 7,
        example_use_in_topic: "She was a no-nonsense teacher — kind, but didn't tolerate excuses.",
      },
      {
        word: "spark an interest",
        ipa: "/spɑːrk ən ˈɪn.trəst/",
        vi_translation: "khơi dậy đam mê",
        band_level: 7,
        example_use_in_topic: "He sparked an interest in literature that I still have today.",
      },
      {
        word: "go above and beyond",
        ipa: "/goʊ əˈbʌv ənd bɪˈjɒnd/",
        vi_translation: "làm hơn bổn phận",
        band_level: 7,
        example_use_in_topic: "She went above and beyond — staying after school to help students who were behind.",
      },
      {
        word: "shaped my outlook",
        ipa: "/ʃeɪpt maɪ ˈaʊt.lʊk/",
        vi_translation: "định hình cách nhìn",
        band_level: 8,
        example_use_in_topic: "He shaped my outlook on what good teaching actually looks like.",
      },
      {
        word: "lasting impact",
        ipa: "/ˈlæs.tɪŋ ˈɪm.pækt/",
        vi_translation: "ảnh hưởng lâu dài",
        band_level: 7,
        example_use_in_topic: "Her teaching has had a lasting impact on how I read.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'my teacher is very kind' — sáo rỗng. Cho ví dụ cụ thể về tính cách.",
      "Past tense rõ ràng: 'taught', 'said', 'made me think'.",
      "Tránh 'I love my teacher' — đa dạng: 'admire', 'respect', 'looked up to'.",
      "Nếu thầy cô đã mất hoặc nghỉ hưu, dùng past simple xuyên suốt.",
      "Phụ âm /tʃ/ trong 'teacher' phải rõ. Người Việt hay đọc thành 'tee-cer'.",
    ],
    sample_strong_answer_band_7:
      "The teacher who comes to mind is my high-school literature teacher, Cô Hương. She taught Vietnamese literature, but for me her real subject was how to think. She was no-nonsense — kind, but didn't tolerate excuses. The thing she did differently was she'd ask us a question, then sit there and wait. Most teachers move on after five seconds; she'd wait two minutes if she had to, and somebody would eventually have to think instead of guess. I'll always remember her because she sparked an interest in reading that I still have — I went from a kid who hated literature to one who reads novels for pleasure. More than the subject, she shaped my outlook on what good teaching looks like. Her impact has lasted in a way no other teacher's has.",
    sample_weak_answer_band_5:
      "My teacher is Mr Tuấn. [opener fine] He teach English. [missing -s] He is very kind. [generic] He help me a lot. [missing -ed if past, missing -s if present] I love him. [empty] I want to be teacher like him. [missing 'a']",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_decision",
    part: 2,
    topic_title_vi: "Mô tả một quyết định quan trọng",
    topic_title_en: "Describe an important decision you made",
    description_vi:
      "Cue card 'mô tả một sự kiện'. Quyết định có thể to (đổi nghề) hoặc nhỏ (chọn trường) — quan trọng là cách bạn KỂ.",
    sample_questions: ["Describe an important decision that you made."],
    cue_card_text:
      "You should say:\n• what the decision was\n• when you made it\n• how you reached it\nand explain whether it was the right decision.",
    vocabulary_focus: [
      {
        word: "weigh up the options",
        ipa: "/weɪ ʌp ði ˈɒp.ʃənz/",
        vi_translation: "cân nhắc các lựa chọn",
        band_level: 7,
        example_use_in_topic: "I spent weeks weighing up the options before I committed.",
      },
      {
        word: "gut feeling",
        ipa: "/ɡʌt ˈfiː.lɪŋ/",
        vi_translation: "linh cảm",
        band_level: 7,
        example_use_in_topic: "In the end I went with my gut feeling rather than the spreadsheet.",
      },
      {
        word: "take the plunge",
        ipa: "/teɪk ðə plʌndʒ/",
        vi_translation: "liều một phen",
        band_level: 8,
        example_use_in_topic: "After months of dithering, I finally took the plunge.",
      },
      {
        word: "in hindsight",
        ipa: "/ɪn ˈhaɪnd.saɪt/",
        vi_translation: "nhìn lại thì",
        band_level: 7,
        example_use_in_topic: "In hindsight, I should have done it a year earlier.",
      },
      {
        word: "no regrets",
        ipa: "/noʊ rɪˈɡrets/",
        vi_translation: "không hối hận",
        band_level: 6,
        example_use_in_topic: "I have no regrets — even though it was the harder path.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Cấu trúc: 30s quyết định gì, 60s tại sao quan trọng, 90s quy trình quyết, 30s đánh giá.",
      "Past perfect: 'I had been thinking about it for months before I finally...' — dấu hiệu band 7+.",
      "Tránh 'I think it is right' lặp đi lặp lại. Đa dạng: 'looking back', 'in hindsight', 'on reflection'.",
      "Phát âm /ʃ/ 'decision' rõ. Người Việt hay đọc thành 'desison'.",
      "Trung thực nếu vẫn còn doubt: 'I think it was right, though I still wonder sometimes' — band cao hơn vẻ giả 'definitely yes'.",
    ],
    sample_strong_answer_band_7:
      "The decision I'd talk about is leaving a stable corporate job to join a small startup three years ago. I was twenty-eight at the time. I'd been at the corporation for four years, climbing slowly, and the startup approached me with less money but real autonomy. I weighed up the options for almost two months — talked to mentors, made literal pros-and-cons lists. In the end, though, I went with my gut feeling: I knew if I stayed, I'd always wonder. So I took the plunge. The first six months were brutal — long hours, no structure, two near-failures. But three years on, the company is doing well, my role has grown, and in hindsight I should have done it a year earlier. No regrets, even though my parents still tell me the corporate job was safer.",
    sample_weak_answer_band_5:
      "I want to talk about my university. [vague topic] I choose IT. [tense: chose] It is good decision. [missing 'a', generic] My family is happy. [empty] I think I make right decision. [missing 'a', shallow]",
    estimated_time_minutes: 4,
  },

  {
    id: "ielts_speaking_part2_describe_landmark",
    part: 2,
    topic_title_vi: "Mô tả một địa danh nổi tiếng ở quê bạn",
    topic_title_en: "Describe a famous landmark in your country",
    description_vi:
      "Cue card 'mô tả một nơi'. Cơ hội thể hiện vốn từ về văn hoá, lịch sử. Tránh chỉ kể địa lý.",
    sample_questions: ["Describe a famous landmark in your country."],
    cue_card_text:
      "You should say:\n• what it is\n• where it is\n• why it's famous\nand explain whether you have visited it or want to.",
    vocabulary_focus: [
      {
        word: "iconic",
        ipa: "/aɪˈkɒn.ɪk/",
        vi_translation: "biểu tượng",
        band_level: 7,
        example_use_in_topic: "It's probably the most iconic landmark in northern Vietnam.",
      },
      {
        word: "UNESCO World Heritage Site",
        ipa: "/juːˈnes.koʊ wɜːrld ˈher.ɪ.tɪdʒ saɪt/",
        vi_translation: "Di sản Thế giới UNESCO",
        band_level: 7,
        example_use_in_topic: "It was made a UNESCO World Heritage Site in the early nineties.",
      },
      {
        word: "draw crowds",
        ipa: "/drɔː kraʊdz/",
        vi_translation: "thu hút đám đông",
        band_level: 7,
        example_use_in_topic: "It draws crowds from all over the world, especially in summer.",
      },
      {
        word: "preserve heritage",
        ipa: "/prɪˈzɜːrv ˈher.ɪ.tɪdʒ/",
        vi_translation: "bảo tồn di sản",
        band_level: 8,
        example_use_in_topic: "There's a real effort to preserve the heritage despite tourism pressure.",
      },
      {
        word: "steeped in history",
        ipa: "/stiːpt ɪn ˈhɪs.tər.i/",
        vi_translation: "đậm chất lịch sử",
        band_level: 8,
        example_use_in_topic: "The whole area is steeped in history — every corner has a story.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng chỉ nói 'Hạ Long Bay is very beautiful' — đào sâu lịch sử, ý nghĩa.",
      "Tên địa danh Việt: phát âm chậm. Có thể dịch: 'Hạ Long Bay — literally Bay of the Descending Dragon'.",
      "Phụ âm /st/ /ʤ/ trong 'history', 'heritage' — luyện riêng.",
      "Đa dạng động từ tả: 'rises', 'stretches', 'sits' thay vì 'is'.",
      "Câu so sánh: 'compared to other landmarks I've seen, what makes this one different is...'",
    ],
    sample_strong_answer_band_7:
      "The landmark I'd describe is Hạ Long Bay — possibly the most iconic site in northern Vietnam. It's about three hours east of Hà Nội, on the Gulf of Tonkin. What makes it famous is the geology: there are nearly two thousand limestone karsts rising straight out of the water, some over a hundred metres tall. It's been a UNESCO World Heritage Site since the early nineties, which is why it draws crowds from all over. The whole area is steeped in history — there are caves the Việt Minh used during the resistance, and fishing villages that have been there for centuries. I've been twice; the first time I did the standard cruise, the second time I went off-season and stayed on a small boat further from the main route. The off-season trip was unforgettable — fewer crowds, mist, the whole landscape felt mythical.",
    sample_weak_answer_band_5:
      "I want to talk about Ha Long Bay. It is in Vietnam. [too basic] It is very beautiful. [generic] Many people go there. [no detail] I went there one time. [grammar: once] I like it. [empty]",
    estimated_time_minutes: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────
// PART 3 — Discussion (10 topics)
// ─────────────────────────────────────────────────────────────────────

const PART_3_TOPICS: readonly IELTSSpeakingTopic[] = [
  {
    id: "ielts_speaking_part3_family_modern_society",
    part: 3,
    topic_title_vi: "Vai trò của gia đình trong xã hội hiện đại",
    topic_title_en: "The role of family in modern society",
    description_vi:
      "Discussion về xã hội. Examiner muốn câu trả lời dài (3-5 câu mỗi câu hỏi), có quan điểm rõ + lý lẽ + ví dụ.",
    sample_questions: [
      "Has the role of the family changed in your country in recent years?",
      "Are extended families becoming less common?",
      "Do you think family structures will keep changing in the future?",
      "What are the advantages and disadvantages of nuclear families?",
      "Should the elderly live with their children?",
    ],
    vocabulary_focus: [
      {
        word: "nuclear family",
        ipa: "/ˈnuː.kli.ər ˈfæm.ə.li/",
        vi_translation: "gia đình hạt nhân",
        band_level: 7,
        example_use_in_topic: "Nuclear families have become the norm in urban Vietnam over the past two decades.",
      },
      {
        word: "intergenerational living",
        ipa: "/ˌɪn.tər.dʒen.əˈreɪ.ʃən.əl ˈlɪv.ɪŋ/",
        vi_translation: "sống nhiều thế hệ chung",
        band_level: 8,
        example_use_in_topic:
          "Intergenerational living is still common in rural areas but increasingly rare in cities.",
      },
      {
        word: "ageing population",
        ipa: "/ˈeɪ.dʒɪŋ ˌpɒp.jəˈleɪ.ʃən/",
        vi_translation: "dân số già hoá",
        band_level: 8,
        example_use_in_topic: "An ageing population means family-based elder care is becoming less viable.",
      },
      {
        word: "social safety net",
        ipa: "/ˈsoʊ.ʃəl ˈseɪf.ti net/",
        vi_translation: "lưới an sinh xã hội",
        band_level: 8,
        example_use_in_topic: "When the state's social safety net is thin, families pick up the slack.",
      },
      {
        word: "filial duty",
        ipa: "/ˈfɪl.i.əl ˈdjuː.ti/",
        vi_translation: "đạo hiếu",
        band_level: 8,
        example_use_in_topic: "Filial duty still shapes housing decisions for many Vietnamese in their thirties.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'in Vietnam, family is very important' — câu này rỗng. Phải có dữ liệu hoặc xu hướng cụ thể.",
      "Nâng band bằng so sánh quá khứ-hiện tại: 'a generation ago, X was the norm; now Y'.",
      "Examiner trọng quan điểm rõ ràng — nói 'I tend to think...' chứ đừng 'maybe both are good'.",
      "Đa dạng động từ: 'shape', 'influence', 'drive', 'erode' thay vì 'change' lặp đi lặp lại.",
      "Phụ âm /θ/ trong 'family', 'thoughtful' — luyện riêng nếu khó.",
    ],
    sample_strong_answer_band_7:
      "Yes, the role of the family has shifted significantly in Vietnam over the past twenty years, especially in cities. A generation ago, intergenerational living was the norm — three or even four generations under one roof. Now nuclear families are increasingly common in places like Hà Nội and Sài Gòn. I think this is driven by urbanisation and changing work patterns more than by any decline in filial duty. That said, families still pick up where the state's social safety net is thin — elder care, childcare, financial support during unemployment. With an ageing population coming, that balance is going to get harder to maintain. I tend to think Vietnam will need stronger formal social services in the next decade because the family alone won't cope.",
    sample_weak_answer_band_5:
      "Family is very important in Vietnam. [generic] In Vietnam family is changing. [tense issue, vague] Some young people don't live with parent. [missing -s] I think family is good. [empty] But also some people live alone. [no reasoning]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_technology_work",
    part: 3,
    topic_title_vi: "Tác động của công nghệ đến công việc",
    topic_title_en: "Technology's impact on work",
    description_vi:
      "Discussion abstract về work + tech. Cần ý kiến cá nhân CỘNG VỚI ví dụ rộng (xã hội, không chỉ bản thân).",
    sample_questions: [
      "How has technology changed the way people work?",
      "Has remote work been a positive or negative development?",
      "Will artificial intelligence make many jobs disappear?",
      "Should companies be required to train workers in new technology?",
      "Is the gap between high-tech and low-tech workers widening?",
    ],
    vocabulary_focus: [
      {
        word: "automation",
        ipa: "/ˌɔː.təˈmeɪ.ʃən/",
        vi_translation: "tự động hoá",
        band_level: 7,
        example_use_in_topic: "Automation has reshaped manufacturing more dramatically than any other sector.",
      },
      {
        word: "remote work",
        ipa: "/rɪˈmoʊt wɜːrk/",
        vi_translation: "làm việc từ xa",
        band_level: 6,
        example_use_in_topic: "Remote work was a temporary fix during the pandemic that became permanent for many.",
      },
      {
        word: "displacement",
        ipa: "/dɪˈspleɪs.mənt/",
        vi_translation: "thay thế / mất việc",
        band_level: 8,
        example_use_in_topic: "Job displacement from AI is real, but historically new technology creates as many jobs as it eliminates.",
      },
      {
        word: "upskilling",
        ipa: "/ˌʌpˈskɪl.ɪŋ/",
        vi_translation: "nâng cao kỹ năng",
        band_level: 8,
        example_use_in_topic: "Upskilling has become essential — what you learned five years ago is half-obsolete.",
      },
      {
        word: "digital divide",
        ipa: "/ˈdɪdʒ.ɪ.təl dɪˈvaɪd/",
        vi_translation: "phân hoá số",
        band_level: 8,
        example_use_in_topic: "The digital divide between high-tech and low-tech workers is widening, not closing.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng dùng 'technology' 10 lần — đa dạng: 'tech', 'digital tools', 'innovation', 'automation'.",
      "Examiner thích quan điểm cân bằng: 'on the one hand... on the other hand...'",
      "Tránh 'AI will take all our jobs' — sáo rỗng. Cụ thể: 'routine clerical work first, creative + relational work last'.",
      "Câu điều kiện loại 1 + 2: 'If companies don't invest in training, workers will fall behind'.",
      "Phụ âm /ʤ/ /tʃ/ trong 'technology', 'digital', 'change' — luyện riêng.",
    ],
    sample_strong_answer_band_7:
      "Technology has reshaped work in two ways: what we do, and where we do it. Automation has shifted manufacturing and routine clerical work; that's been ongoing for decades but accelerated with AI tools in the last few years. Remote work was a temporary fix during the pandemic that became permanent for many — for good and bad. On the positive side, more flexibility and access to global jobs from cities like Hà Nội. On the negative, isolation and a digital divide opening between workers who can leverage these tools and those who can't. I tend to think AI won't eliminate jobs as fast as headlines suggest, but it will keep raising the upskilling bar. Companies that don't invest in training are setting their workers up to fall behind.",
    sample_weak_answer_band_5:
      "Technology change work very much. [tense issue, vague] Many people use computer. [missing -s] AI is good. [empty, polarized] Some job will disappear. [missing -s] I think we need more technology. [filler]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_globalization_culture",
    part: 3,
    topic_title_vi: "Toàn cầu hoá vs văn hoá địa phương",
    topic_title_en: "Globalization vs local culture",
    description_vi:
      "Discussion. Examiner muốn quan điểm rõ về căng thẳng giữa global và local — không phải 'both are good'.",
    sample_questions: [
      "How has globalization affected your country's culture?",
      "Is it possible to enjoy global culture while preserving local traditions?",
      "Should governments protect traditional culture from foreign influence?",
      "Is English necessary for participating in global culture?",
      "Will local cultures eventually disappear?",
    ],
    vocabulary_focus: [
      {
        word: "cultural homogenization",
        ipa: "/ˈkʌl.tʃər.əl həˌmɒdʒ.ə.naɪˈzeɪ.ʃən/",
        vi_translation: "đồng nhất văn hoá",
        band_level: 9,
        example_use_in_topic:
          "There's a fear of cultural homogenization — that everywhere will end up looking like everywhere else.",
      },
      {
        word: "preserve traditions",
        ipa: "/prɪˈzɜːrv trəˈdɪʃ.ənz/",
        vi_translation: "gìn giữ truyền thống",
        band_level: 7,
        example_use_in_topic: "It's possible to engage with the world and still preserve traditions.",
      },
      {
        word: "lingua franca",
        ipa: "/ˌlɪŋ.ɡwə ˈfræŋ.kə/",
        vi_translation: "ngôn ngữ chung",
        band_level: 9,
        example_use_in_topic: "English has become the de facto lingua franca of business and academia.",
      },
      {
        word: "cultural exchange",
        ipa: "/ˈkʌl.tʃər.əl ɪksˈtʃeɪndʒ/",
        vi_translation: "giao lưu văn hoá",
        band_level: 7,
        example_use_in_topic: "Cultural exchange goes both ways — Vietnamese food is now in cities globally.",
      },
      {
        word: "homogeneous",
        ipa: "/ˌhɒməˈdʒiː.ni.əs/",
        vi_translation: "đồng nhất / giống nhau",
        band_level: 8,
        example_use_in_topic: "Cities risk becoming visually homogeneous — same chains, same architecture.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'globalization is bad for culture' — quan điểm cực đoan. Examiner thích nuance.",
      "Cho ví dụ Việt Nam cụ thể: 'phở is now a global dish; that's globalization working in our favour'.",
      "Đa dạng từ 'culture': 'tradition', 'heritage', 'local identity'.",
      "Past + present perfect: 'globalization has shaped... but it has also opened...'.",
      "Phụ âm /ʒ/ trong 'globalization', /θ/ trong 'thoughtful' — luyện riêng.",
    ],
    sample_strong_answer_band_7:
      "Globalization has cut both ways for Vietnamese culture. On one hand, it's brought our food, films, and music to cities globally — phở is now everywhere from Berlin to Sydney. That's cultural exchange working in our favour. On the other, you do see homogenization in cities — the same chain coffee shops, the same brands, the same architectural style. I don't think it's necessary to choose; it's possible to engage with the world and still preserve traditions. Lunar New Year is bigger than ever in Vietnam, even as Christmas decorations show up in cafés. I think governments shouldn't try to wall culture off — that usually fails — but they can fund the things globalization undervalues, like traditional crafts, regional dialects, and minority languages. English being the lingua franca isn't a threat as long as Vietnamese stays alive at home.",
    sample_weak_answer_band_5:
      "Globalization is good. [polarized] Many people learn English. [no reasoning] Sometimes it is bad for culture. [vague] I think we need to keep our culture. [empty] In Vietnam there are many foreign thing. [missing -s, generic]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_education_reform_vietnam",
    part: 3,
    topic_title_vi: "Cải cách giáo dục ở Việt Nam",
    topic_title_en: "Education reform in Vietnam",
    description_vi:
      "Discussion về giáo dục Việt Nam cụ thể. Đây là chủ đề Vietnamese-relevant — câu trả lời nên có ý kiến cá nhân + nhận thức về xu hướng.",
    sample_questions: [
      "What are the strengths and weaknesses of education in Vietnam?",
      "Is there too much pressure on students in Vietnam?",
      "Should Vietnamese education focus more on practical skills?",
      "How do you compare Vietnamese education with Western education?",
      "Will online learning replace traditional schools?",
    ],
    vocabulary_focus: [
      {
        word: "rote learning",
        ipa: "/roʊt ˈlɜːr.nɪŋ/",
        vi_translation: "học vẹt",
        band_level: 7,
        example_use_in_topic: "The system still relies too heavily on rote learning at the secondary level.",
      },
      {
        word: "critical thinking",
        ipa: "/ˈkrɪt.ɪ.kəl ˈθɪŋ.kɪŋ/",
        vi_translation: "tư duy phản biện",
        band_level: 7,
        example_use_in_topic: "Critical thinking is what most reform efforts are trying to bring in.",
      },
      {
        word: "academic pressure",
        ipa: "/ˌæk.əˈdem.ɪk ˈpreʃ.ər/",
        vi_translation: "áp lực học hành",
        band_level: 7,
        example_use_in_topic: "Academic pressure on Vietnamese students is honestly higher than what Western peers experience.",
      },
      {
        word: "vocational training",
        ipa: "/voʊˈkeɪ.ʃən.əl ˈtreɪ.nɪŋ/",
        vi_translation: "đào tạo nghề",
        band_level: 7,
        example_use_in_topic: "Vocational training is undervalued — every parent wants university, even when it's the wrong fit.",
      },
      {
        word: "well-rounded education",
        ipa: "/ˌwelˈraʊn.dɪd ˌed.juˈkeɪ.ʃən/",
        vi_translation: "giáo dục toàn diện",
        band_level: 8,
        example_use_in_topic: "A well-rounded education means more than test scores.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'Vietnamese education is good' — phải có nhận xét cụ thể.",
      "Tránh chê toàn diện — examiner trọng nuance: cái gì làm tốt, cái gì cần sửa.",
      "Cho ví dụ cụ thể: 'maths and science test scores are high; speaking English isn't'.",
      "Phụ âm cuối /st/ /kt/ trong 'test', 'fact' — luyện riêng.",
      "Câu so sánh: 'compared to Western systems, ours...' — nâng band.",
    ],
    sample_strong_answer_band_7:
      "Vietnamese education has real strengths and real weaknesses. The strength is academic discipline — Vietnamese students consistently rank well in international maths and science tests, sometimes better than far richer countries. The weakness is heavy reliance on rote learning at the secondary level and not enough room for critical thinking. Academic pressure is honestly higher than Western peers experience; I've seen friends sleep four hours during exam season. I think the obvious reform is shifting from memorisation to application, but the real bottleneck is the entrance-exam culture — as long as university entry is decided by one high-stakes test, schools will teach to that test. Vocational training is also undervalued; every parent wants university for their kid, even when it's the wrong fit. A well-rounded education has to mean more than test scores.",
    sample_weak_answer_band_5:
      "Vietnamese education is good. [generic] Students learn very hard. [grammar: study, not learn here] We have many test. [missing -s] Some student have a lot pressure. [missing -s] I think education is important. [empty]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_environmental_responsibility",
    part: 3,
    topic_title_vi: "Trách nhiệm môi trường",
    topic_title_en: "Environmental responsibility",
    description_vi:
      "Discussion. Examiner muốn nghe quan điểm rõ về cá nhân vs tập thể vs chính phủ.",
    sample_questions: [
      "Whose responsibility is it to protect the environment — individuals, companies, or governments?",
      "Are individual actions enough to make a difference?",
      "Should governments use taxes to discourage pollution?",
      "How can young people contribute to environmental protection?",
      "Is economic growth compatible with environmental protection?",
    ],
    vocabulary_focus: [
      {
        word: "carbon footprint",
        ipa: "/ˈkɑːr.bən ˈfʊt.prɪnt/",
        vi_translation: "dấu chân carbon",
        band_level: 7,
        example_use_in_topic: "Reducing your carbon footprint matters, but it's not the whole answer.",
      },
      {
        word: "sustainable development",
        ipa: "/səˈsteɪ.nə.bəl dɪˈvel.əp.mənt/",
        vi_translation: "phát triển bền vững",
        band_level: 7,
        example_use_in_topic: "Sustainable development is the framework most governments now claim to follow.",
      },
      {
        word: "single-use plastic",
        ipa: "/ˈsɪŋ.ɡəl juːs ˈplæs.tɪk/",
        vi_translation: "nhựa dùng một lần",
        band_level: 7,
        example_use_in_topic: "Banning single-use plastic is symbolic — useful, but not enough.",
      },
      {
        word: "systemic change",
        ipa: "/sɪˈstem.ɪk tʃeɪndʒ/",
        vi_translation: "thay đổi mang tính hệ thống",
        band_level: 8,
        example_use_in_topic: "Without systemic change, individual recycling is rearranging deck chairs.",
      },
      {
        word: "polluter pays principle",
        ipa: "/pəˈluː.tər peɪz ˈprɪn.sə.pəl/",
        vi_translation: "nguyên tắc người gây ô nhiễm phải trả tiền",
        band_level: 9,
        example_use_in_topic: "The polluter-pays principle is the cleanest way to align incentives.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'we should protect the environment' — empty. Cụ thể: 'we should put a real price on emissions'.",
      "Examiner trọng quan điểm có hệ thống — đừng chỉ 'individuals should recycle'.",
      "Đa dạng động từ: 'mitigate', 'curb', 'tackle' thay vì 'protect'.",
      "Câu so sánh: 'compared to Europe, Vietnam still relies more on coal'.",
      "Phụ âm /θ/ trong 'thoughtful' /ð/ trong 'the' — phải nghe được.",
    ],
    sample_strong_answer_band_7:
      "Honestly, I don't think it's a choice between individuals, companies, and governments — it's all three, but with very different leverage. Individual actions like reducing your carbon footprint matter, but if you do everything right and the power grid still runs on coal, you've barely moved the needle. The real lever is systemic change: how electricity is generated, how cities are built, how transportation works. That's mostly government policy and large-company decisions. Economic growth and environmental protection aren't actually incompatible — countries like Denmark are richer than they were thirty years ago and have lower per-capita emissions. The polluter-pays principle is the cleanest way to align incentives. Individual responsibility shouldn't be dismissed, but expecting it to solve the problem alone lets bigger actors off the hook.",
    sample_weak_answer_band_5:
      "Environment is very important. [generic] We must protect it. [empty] Government should do something. [vague] I recycle every day. [no reasoning] Plastic is bad. [polarised, no nuance]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_tradition_progress",
    part: 3,
    topic_title_vi: "Truyền thống vs tiến bộ",
    topic_title_en: "Tradition vs progress",
    description_vi:
      "Discussion philosophical. Examiner muốn quan điểm có lập luận, không chỉ 'I love tradition'.",
    sample_questions: [
      "Should societies prioritize traditions or progress?",
      "Are some traditions worth preserving even if they seem outdated?",
      "Is it possible to be modern and traditional at the same time?",
      "Who should decide what traditions to keep?",
      "Will younger generations care about traditions?",
    ],
    vocabulary_focus: [
      {
        word: "time-honoured",
        ipa: "/ˌtaɪmˈɒn.ərd/",
        vi_translation: "truyền thống lâu đời",
        band_level: 7,
        example_use_in_topic: "Some time-honoured customs serve real purposes that aren't obvious at first glance.",
      },
      {
        word: "outdated",
        ipa: "/ˌaʊtˈdeɪ.tɪd/",
        vi_translation: "lỗi thời",
        band_level: 6,
        example_use_in_topic: "A few traditions feel outdated — others have aged remarkably well.",
      },
      {
        word: "evolve",
        ipa: "/ɪˈvɒlv/",
        vi_translation: "phát triển / tiến hoá",
        band_level: 7,
        example_use_in_topic: "Traditions evolve naturally; the ones that don't, fade.",
      },
      {
        word: "the baby with the bathwater",
        ipa: "/ðə ˈbeɪ.bi wɪð ðə ˈbæθ.wɔː.tər/",
        vi_translation: "vứt bỏ cùng cái cũ cả cái tốt",
        band_level: 8,
        example_use_in_topic: "Throwing out all tradition risks throwing the baby out with the bathwater.",
      },
      {
        word: "cultural continuity",
        ipa: "/ˈkʌl.tʃər.əl ˌkɒn.tɪˈnjuː.ə.ti/",
        vi_translation: "tính liên tục văn hoá",
        band_level: 8,
        example_use_in_topic: "Cultural continuity gives people a sense of place that pure modernization erases.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng cực đoan: 'tradition is good' hoặc 'progress is better' — examiner muốn nuance.",
      "Cho ví dụ Việt Nam: 'Tết is bigger than ever; ancestor worship has adapted, not vanished'.",
      "Phụ âm /θ/ /ð/ trong 'tradition', 'thoughtful', 'the' — luyện riêng.",
      "Đa dạng từ 'change': 'evolve', 'transform', 'shift', 'adapt'.",
      "Modal verbs nâng band: 'should', 'might', 'tends to'.",
    ],
    sample_strong_answer_band_7:
      "I tend to think it's a false choice — societies that pit tradition against progress usually do badly at both. Traditions that survive tend to be the ones that serve a real purpose, even when the original reason has been forgotten. Vietnamese ancestor worship is a good example: it's not just about old beliefs, it's about cultural continuity and family identity, and it's adapted to apartment living without losing its meaning. Some traditions are genuinely outdated — practices that limit who can study or work, for instance — and those should fade. The mistake is throwing out all tradition along with the harmful bits; you risk throwing the baby out with the bathwater. Younger generations will care about traditions if those traditions feel alive — Tết is bigger than ever, even though most of my friends couldn't tell you the historical origin of every ritual.",
    sample_weak_answer_band_5:
      "Tradition is very important. [generic, polarized] We must keep it. [empty] But also progress is important. [no reasoning] Young people don't care. [polarised, no example] I love tradition. [empty]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_media_society",
    part: 3,
    topic_title_vi: "Vai trò của truyền thông trong xã hội",
    topic_title_en: "The role of media in society",
    description_vi:
      "Discussion về news + social media. Examiner muốn quan điểm có nuance — đừng cực đoan 'social media is bad'.",
    sample_questions: [
      "How has social media changed the way people get news?",
      "Are traditional newspapers still relevant?",
      "Should there be limits on what social media platforms can publish?",
      "How do you decide what news to trust?",
      "Is the media in your country reliable?",
    ],
    vocabulary_focus: [
      {
        word: "echo chamber",
        ipa: "/ˈek.oʊ ˈtʃeɪm.bər/",
        vi_translation: "buồng vọng / chỉ nghe ý kiến giống mình",
        band_level: 8,
        example_use_in_topic: "Algorithms create echo chambers where you mostly hear opinions you already agree with.",
      },
      {
        word: "fact-checking",
        ipa: "/ˈfækt ˌtʃek.ɪŋ/",
        vi_translation: "kiểm chứng thông tin",
        band_level: 7,
        example_use_in_topic: "Fact-checking has become harder when news travels faster than the verification.",
      },
      {
        word: "biased coverage",
        ipa: "/ˈbaɪ.əst ˈkʌv.ər.ɪdʒ/",
        vi_translation: "đưa tin thiên lệch",
        band_level: 7,
        example_use_in_topic: "Almost every outlet has some biased coverage — the question is whether they're transparent about it.",
      },
      {
        word: "hold power to account",
        ipa: "/hoʊld ˈpaʊ.ər tə əˈkaʊnt/",
        vi_translation: "giám sát quyền lực",
        band_level: 8,
        example_use_in_topic: "Good journalism holds power to account — that's its core function.",
      },
      {
        word: "misinformation",
        ipa: "/ˌmɪs.ɪn.fərˈmeɪ.ʃən/",
        vi_translation: "thông tin sai lệch",
        band_level: 7,
        example_use_in_topic: "Misinformation spreads faster than corrections — that's the asymmetry we have to deal with.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'social media is bad' — clichéd. Cụ thể: 'social media is good for X, bad for Y'.",
      "Examiner thích quan điểm cân bằng — 'on the whole, I'd say...' rồi đưa ngược-quan-điểm sau.",
      "Phụ âm cluster /st/ /ks/ trong 'social', 'fact-check' — luyện riêng.",
      "Đa dạng từ 'news': 'reporting', 'journalism', 'coverage', 'media'.",
      "Tránh chỉ trích chính phủ Việt Nam trực tiếp — không cần thiết cho band 7+, examiner trọng lập luận.",
    ],
    sample_strong_answer_band_7:
      "Social media has fundamentally changed how people get news — for better and for worse. The good is access: I follow journalists, scientists, eyewitnesses I'd never have heard of through traditional outlets. The bad is the echo chamber problem — algorithms feed you what you already agree with, so opinions calcify. Traditional newspapers are still relevant, even if their business model is in trouble; they do the slow, expensive work of investigative reporting that holds power to account. Whether to trust a source is a skill people now have to learn — fact-checking, cross-referencing, noticing when a claim travels faster than its verification. Misinformation moves faster than corrections, and that's the asymmetry every reader has to navigate. I don't think regulation alone solves this; media literacy has to be taught.",
    sample_weak_answer_band_5:
      "Many people use social media. [generic] Sometimes news is fake. [vague] I read newspaper. [missing -s, no detail] Media is important. [empty] Government should control fake news. [polarised, no reasoning]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_generational_differences",
    part: 3,
    topic_title_vi: "Khác biệt thế hệ",
    topic_title_en: "Generational differences",
    description_vi:
      "Discussion. Examiner muốn examples cụ thể — không clichéd 'old people don't understand technology'.",
    sample_questions: [
      "What are the main differences between younger and older generations in your country?",
      "Do generations communicate well with each other?",
      "Are young people today more independent than previous generations?",
      "What can older generations learn from younger ones?",
      "Will the generation gap get wider in the future?",
    ],
    vocabulary_focus: [
      {
        word: "generation gap",
        ipa: "/ˌdʒen.əˈreɪ.ʃən ɡæp/",
        vi_translation: "khoảng cách thế hệ",
        band_level: 6,
        example_use_in_topic: "There's a generation gap, but it's smaller than people think.",
      },
      {
        word: "digital natives",
        ipa: "/ˈdɪdʒ.ɪ.təl ˈneɪ.tɪvz/",
        vi_translation: "thế hệ sinh ra cùng công nghệ",
        band_level: 8,
        example_use_in_topic: "Digital natives don't see technology as a tool — it's just the air they breathe.",
      },
      {
        word: "values shift",
        ipa: "/ˈvæl.juːz ʃɪft/",
        vi_translation: "thay đổi giá trị sống",
        band_level: 7,
        example_use_in_topic: "There's been a values shift around career stability, marriage, and home ownership.",
      },
      {
        word: "lived experience",
        ipa: "/lɪvd ɪkˈspɪr.i.əns/",
        vi_translation: "trải nghiệm sống",
        band_level: 8,
        example_use_in_topic: "Older generations have lived experience that no amount of reading can replicate.",
      },
      {
        word: "common ground",
        ipa: "/ˈkɒm.ən ɡraʊnd/",
        vi_translation: "điểm chung",
        band_level: 7,
        example_use_in_topic: "Family meals are still common ground across the generations.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Tránh 'old people don't understand' — clichéd. Đa số người lớn dùng smartphone tốt.",
      "Đa dạng từ 'generation': 'cohort', 'group', 'demographic'.",
      "Cho ví dụ cụ thể Việt Nam: 'my grandmother joined Facebook last year and now sends me memes'.",
      "Câu so sánh: 'compared to my parents at my age, I have...'",
      "Phụ âm /ʤ/ trong 'generation' — phát âm chính xác.",
    ],
    sample_strong_answer_band_7:
      "Honestly, I think the generation gap in Vietnam is real but smaller than people sometimes claim. The biggest difference is around values — my generation thinks differently about marriage timing, career changes, and home ownership than my parents did at my age. The Vietnamese economy in 2026 just rewards different choices than it did in 1996. Technology gets cited as the dividing line, but I'd push back on that — my grandmother joined Facebook last year and now sends me TikTok videos. Where the gap is genuinely wide is around lived experience: my parents grew up during the post-war years, and that shapes them in ways my generation can read about but can't fully internalise. What older generations can teach is exactly that perspective — patience with hardship, the relativity of comfort. What younger generations bring is comfort with rapid change. Common ground exists; it just takes deliberate conversation.",
    sample_weak_answer_band_5:
      "Old people and young people are different. [generic] Old people don't understand technology. [cliché] Young people use phone. [missing -s] My parent and me are different. [missing -s] Sometimes we don't understand each other. [no example]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_urban_rural_living",
    part: 3,
    topic_title_vi: "Sống ở thành phố vs nông thôn",
    topic_title_en: "Urban vs rural living",
    description_vi:
      "Discussion. Examiner muốn so sánh có nuance, không 'city is better'.",
    sample_questions: [
      "What are the advantages and disadvantages of living in a big city?",
      "Why do many young people move to cities?",
      "Is rural life becoming less attractive to young Vietnamese?",
      "Should the government do more to develop rural areas?",
      "Will the gap between cities and the countryside grow?",
    ],
    vocabulary_focus: [
      {
        word: "urbanization",
        ipa: "/ˌɜːr.bə.naɪˈzeɪ.ʃən/",
        vi_translation: "đô thị hoá",
        band_level: 7,
        example_use_in_topic: "Urbanization in Vietnam has been one of the fastest in Southeast Asia.",
      },
      {
        word: "rural exodus",
        ipa: "/ˈrʊr.əl ˈek.sə.dəs/",
        vi_translation: "làn sóng rời nông thôn",
        band_level: 8,
        example_use_in_topic: "The rural exodus has hollowed out villages — only the elderly remain in many.",
      },
      {
        word: "cost of living",
        ipa: "/kɒst əv ˈlɪv.ɪŋ/",
        vi_translation: "chi phí sinh hoạt",
        band_level: 6,
        example_use_in_topic: "The cost of living in Hà Nội is the biggest single complaint from new arrivals.",
      },
      {
        word: "infrastructure gap",
        ipa: "/ˈɪn.frəˌstrʌk.tʃər ɡæp/",
        vi_translation: "khoảng cách hạ tầng",
        band_level: 8,
        example_use_in_topic: "The infrastructure gap between urban and rural Vietnam is closing, but slowly.",
      },
      {
        word: "quality of life",
        ipa: "/ˈkwɒl.ə.ti əv laɪf/",
        vi_translation: "chất lượng sống",
        band_level: 7,
        example_use_in_topic: "Quality of life isn't a one-dimensional question — it depends what you value.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'city is better' — empty. Cụ thể: 'cities offer X but cost Y'.",
      "Cho ví dụ Việt Nam: 'Hà Nội salaries are 3x rural ones, but housing eats most of the difference'.",
      "Đa dạng từ 'city': 'urban areas', 'metropolises', 'urban centres'.",
      "Câu so sánh: 'compared to ten years ago, rural areas have more...'",
      "Phụ âm /ʃ/ /ʒ/ trong 'urbanization' — luyện riêng.",
    ],
    sample_strong_answer_band_7:
      "It's a real trade-off, and it depends what you value. Cities offer jobs, education, healthcare access, social variety — that's why young people move to them. The Vietnamese rural exodus over the last twenty years has been one of the fastest in Southeast Asia. The downsides are familiar: cost of living, pollution, traffic, social isolation paradoxically inside dense areas. Rural life has become less attractive partly because the infrastructure gap is real — fewer good schools, fewer specialist doctors — but also because the cultural pull has shifted toward urban lifestyles. The government has been investing in rural development, and you can see it: better roads, more 4G coverage, stronger e-commerce reach. But until rural areas can offer comparable career options, the migration will continue. The gap will probably narrow over the next decade rather than widen.",
    sample_weak_answer_band_5:
      "Cities are better. [polarized] Many people go to city. [missing -ies] In countryside life is quiet. [grammar] Young people don't like village. [empty] City has many problem. [missing -s]",
    estimated_time_minutes: 5,
  },

  {
    id: "ielts_speaking_part3_future_of_work",
    part: 3,
    topic_title_vi: "Tương lai của công việc",
    topic_title_en: "The future of work",
    description_vi:
      "Discussion về xu hướng. Examiner muốn dự báo có cơ sở, không khoa học viễn tưởng.",
    sample_questions: [
      "How will work change over the next 20 years?",
      "Will full-time jobs become less common?",
      "What skills will be most valuable in the future?",
      "Should young people prepare differently for their careers?",
      "Will work-life balance improve or get worse?",
    ],
    vocabulary_focus: [
      {
        word: "gig economy",
        ipa: "/ɡɪɡ ɪˈkɒn.ə.mi/",
        vi_translation: "kinh tế việc lẻ",
        band_level: 8,
        example_use_in_topic: "The gig economy has created flexibility, but also stripped workers of basic protections.",
      },
      {
        word: "lifelong learning",
        ipa: "/ˈlaɪf.lɒŋ ˈlɜːr.nɪŋ/",
        vi_translation: "học cả đời",
        band_level: 7,
        example_use_in_topic: "Lifelong learning is no longer a slogan — it's the actual job description.",
      },
      {
        word: "soft skills",
        ipa: "/sɒft skɪlz/",
        vi_translation: "kỹ năng mềm",
        band_level: 7,
        example_use_in_topic: "Soft skills like communication and adaptability are what AI struggles to replicate.",
      },
      {
        word: "hybrid work model",
        ipa: "/ˈhaɪ.brɪd wɜːrk ˈmɒd.əl/",
        vi_translation: "mô hình làm việc kết hợp",
        band_level: 7,
        example_use_in_topic: "The hybrid work model — some days remote, some in office — looks like the new default.",
      },
      {
        word: "burnout",
        ipa: "/ˈbɜːrn.aʊt/",
        vi_translation: "kiệt sức",
        band_level: 7,
        example_use_in_topic: "Burnout has become so common that companies finally have to take it seriously.",
      },
    ],
    vietnamese_speaker_strategies: [
      "Đừng nói 'in 20 years robots will do everything' — sáo rỗng. Cụ thể về kỹ năng nào AI thay thế, kỹ năng nào không.",
      "Đa dạng từ 'work': 'employment', 'career', 'professional life'.",
      "Câu điều kiện loại 1: 'If automation continues, then...'.",
      "Phụ âm /ʤ/ trong 'job', 'change' — luyện riêng.",
      "Tránh dự báo cực đoan — examiner trọng nuance ('it's likely that...', 'we'll probably see...').",
    ],
    sample_strong_answer_band_7:
      "Work over the next two decades is going to look pretty different from what my parents experienced. Full-time, single-employer careers will probably keep declining; the gig economy and contract work are eating into the middle. Hybrid work models are likely the new default — some remote, some in office, depending on the role. Skills-wise, I think soft skills will become more valuable, paradoxically: communication, adaptability, judgement under uncertainty — exactly the things AI struggles to replicate. Hard technical skills still matter but they have a shorter half-life now, which is why lifelong learning has become the actual job description rather than a slogan. Work-life balance is genuinely complicated; flexible work helps some people, but always-on culture has produced more burnout, not less. I think young people should prepare for changing fields multiple times — career stability is mostly nostalgic at this point.",
    sample_weak_answer_band_5:
      "In future work will change. [vague] Many people will work from home. [generic] AI will take some job. [missing -s] We need to learn new skill. [missing -s] Work-life balance is important. [empty]",
    estimated_time_minutes: 5,
  },
];

// ─────────────────────────────────────────────────────────────────────
// Public exports
// ─────────────────────────────────────────────────────────────────────

export const IELTS_SPEAKING_TOPICS: readonly IELTSSpeakingTopic[] = [
  ...PART_1_TOPICS,
  ...PART_2_TOPICS,
  ...PART_3_TOPICS,
];

export function getTopicById(id: string): IELTSSpeakingTopic | null {
  return IELTS_SPEAKING_TOPICS.find((t) => t.id === id) ?? null;
}

export function getTopicsByPart(part: IELTSSpeakingPart): IELTSSpeakingTopic[] {
  return IELTS_SPEAKING_TOPICS.filter((t) => t.part === part);
}

export const IELTS_SPEAKING_TOPICS_BY_PART: Record<IELTSSpeakingPart, readonly IELTSSpeakingTopic[]> = {
  1: PART_1_TOPICS,
  2: PART_2_TOPICS,
  3: PART_3_TOPICS,
};
