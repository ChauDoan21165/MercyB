export const lessons = [
  {
    id: 1,
    title: "Basic Vowels",
    hangul: "ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ",
    meaning: "a, ya, eo, yeo, o, yo, u, yu, eu, i",
    notes: "These are the 10 basic vowel shapes in Hangul."
  },
  {
    id: 2,
    title: "Basic Consonants",
    hangul: "ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ",
    meaning: "g/k, n, d/t, r/l, m, b/p, s, ng/null, j, ch, k, t, p, h",
    notes: "Consonants are pronounced differently at the beginning and end of a syllable."
  },
  {
    id: 3,
    title: "Syllable Block: 가, 나, 다",
    hangul: "가 나 다 라 마 바 사 아 자 차 카 타 파 하",
    meaning: "ga, na, da, ra, ma, ba, sa, a, ja, cha, ka, ta, pa, ha",
    notes: "Each block is a consonant + vowel. The silent ㅇ becomes 'ng' at the bottom."
  },
  {
    id: 4,
    title: "Double Consonants",
    hangul: "ㄲ ㄸ ㅃ ㅆ ㅉ",
    meaning: "kk, tt, pp, ss, jj",
    notes: "These are tensed (fortis) sounds. They are pronounced with more force."
  },
  {
    id: 5,
    title: "Compound Vowels",
    hangul: "ㅐ ㅒ ㅔ ㅖ ㅘ ㅙ ㅚ ㅝ ㅞ ㅟ ㅢ",
    meaning: "ae, yae, e, ye, wa, wae, oe, wo, we, wi, ui",
    notes: "These are formed by combining two basic vowels."
  },
  {
    id: 6,
    title: "Final Consonants (받침) - Basic",
    hangul: "악 안 알 암 압 앗 앙 앚 앜 앝",
    meaning: "ak, an, al, am, ap, at, ang, a(tch), ak, at",
    notes: "Consonants at the bottom of a syllable have limited release. ㅇ becomes ng."
  },
  {
    id: 7,
    title: "Complex Final Consonants",
    hangul: "ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ",
    meaning: "gs, nj, nh, lg, lm, lb, ls, lt, lp, lh, bs",
    notes: "Only the left sound is pronounced when followed by a consonant; both when followed by a vowel."
  },
  {
    id: 8,
    title: "Greetings",
    hangul: "안녕하세요. 감사합니다. 네. 아니요.",
    meaning: "Hello. Thank you. Yes. No.",
    notes: "안녕하세요 is formal. 감사합니다 is polite. 네 = yes, 아니요 = no."
  },
  {
    id: 9,
    title: "Self-introduction",
    hangul: "저는 [이름]입니다. 만나서 반갑습니다.",
    meaning: "I am [name]. Nice to meet you.",
    notes: "저는 is 'I' (humble). 입니다 is 'am/are' (formal)."
  },
  {
    id: 10,
    title: "Numbers 1-10",
    hangul: "하나 둘 셋 넷 다섯 여섯 일곱 여덟 아홉 열",
    meaning: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
    notes: "These are native Korean numbers. Sino-Korean numbers are also used for dates, money, etc."
  },
  {
    id: 11,
    title: "Days of the Week",
    hangul: "월요일 화요일 수요일 목요일 금요일 토요일 일요일",
    meaning: "Monday Tuesday Wednesday Thursday Friday Saturday Sunday",
    notes: "Each starts with a celestial body: moon, fire, water, wood, gold, earth, sun."
  },
  {
    id: 12,
    title: "Basic Verbs",
    hangul: "하다 (to do), 가다 (to go), 오다 (to come), 먹다 (to eat), 마시다 (to drink)",
    meaning: "do, go, come, eat, drink",
    notes: "Verbs end with 다 in dictionary form. Remove 다 to conjugate."
  },
  {
    id: 13,
    title: "Present Tense Conjugation",
    hangul: "가요 (goes), 와요 (comes), 먹어요 (eats), 해요 (does)",
    meaning: "Go, come, eat, do (polite present)",
    notes: "Add -아요/어요/해요 depending on the vowel stem. This is the 해요체 polite style."
  },
  {
    id: 14,
    title: "Topic and Subject Particles",
    hangul: "저는 학생이에요. 이것은 책이에요.",
    meaning: "I am a student. This is a book.",
    notes: "은/는 marks the topic. 이/가 marks the subject. 이에요/예요 means 'is/are'."
  },
  {
    id: 15,
    title: "Common Adjectives",
    hangul: "크다 (big), 작다 (small), 길다 (long), 짧다 (short), 좋다 (good), 나쁘다 (bad)",
    meaning: "big, small, long, short, good, bad",
    notes: "Adjectives conjugate like verbs. E.g., 커요 (is big), 좋아요 (is good)."
  },
  {
    id: 16,
    title: "Location Words",
    hangul: "여기 (here), 거기 (there), 저기 (over there), 어디 (where)",
    meaning: "here, there (near listener), over there (far), where",
    notes: "여기 = near speaker, 거기 = near listener, 저기 = away from both."
  },
  {
    id: 17,
    title: "Question Words",
    hangul: "무엇 (what), 누구 (who), 언제 (when), 왜 (why), 어떻게 (how)",
    meaning: "what, who, when, why, how",
    notes: "These are used at the beginning or end of a question. E.g., 이것은 무엇이에요?"
  },
  {
    id: 18,
    title: "Negative Sentences",
    hangul: "안 가요 (don't go), 안 먹어요 (don't eat), 안 해요 (don't do)",
    meaning: "I don't go, I don't eat, I don't do",
    notes: "Place 안 before the verb to negate. For 있다 (to have) use 없다."
  },
  {
    id: 19,
    title: "Past Tense",
    hangul: "갔어요 (went), 먹었어요 (ate), 했어요 (did), 좋았어요 (was good)",
    meaning: "went, ate, did, was good",
    notes: "Add -았/었/했어요 to the verb stem. E.g., 가 + 았어요 → 갔어요."
  },
  {
    id: 20,
    title: "Honorifics with -시-",
    hangul: "가세요 (goes, honorific), 하세요 (does, honorific), 계세요 (stays/be, honorific)",
    meaning: "(He/She) goes, does, is (polite to the subject)",
    notes: "Insert -시- after the verb stem and conjugate. Used to show respect to the subject."
  }
];