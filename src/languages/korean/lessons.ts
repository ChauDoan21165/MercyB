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
,
  {
    id: 21,
    title: "Making Phone Calls",
    hangul: "전화 걸기",
    meaning: "Making phone calls",
    notes: "Learn essential phone expressions in Korean. Use 여보세요 for hello on phone.",
    vocabulary: [
      { hangul: "전화", meaning: "telephone" },
      { hangul: "전화를 걸다", meaning: "to make a call" },
      { hangul: "전화를 받다", meaning: "to answer the phone" },
      { hangul: "통화하다", meaning: "to have a conversation" },
      { hangul: "여보세요", meaning: "hello (on phone)" },
      { hangul: "실례합니다", meaning: "excuse me" },
      { hangul: "잠시만요", meaning: "just a moment" },
      { hangul: "다시 전화하다", meaning: "to call again" },
      { hangul: "메시지를 남기다", meaning: "to leave a message" },
      { hangul: "통화 중", meaning: "busy (phone)" }
    ],

    sentences: [
      { hangul: "여보세요, 거기 김 선생님 계세요?", meaning: "Hello, is Mr. Kim there?" },
      { hangul: "잠시만 기다리세요.", meaning: "Please wait a moment." },
      { hangul: "다시 전화할게요.", meaning: "I'll call again." },
      { hangul: "메시지를 남겨 주시겠어요?", meaning: "Could you leave a message?" },
      { hangul: "통화 중이에요.", meaning: "The line is busy." }
    ],

    dialogue: [
      { speaker: "A", hangul: "여보세요, 김민수 씨 계세요?", meaning: "Hello, is Minsu Kim there?" },
      { speaker: "B", hangul: "제가 김민순데요. 누구세요?", meaning: "This is Minsu Kim. Who is this?" },
      { speaker: "A", hangul: "저는 박지영이에요.", meaning: "This is Jiyoung Park." },
      { speaker: "B", hangul: "아, 지영 씨! 무슨 일이세요?", meaning: "Ah, Jiyoung! What can I do for you?" },
    ],

    exercises: [
      { type: "fill-blank", question: "여보세요, 김 선생님 ___?", answer: "계세요" },
      { type: "matching", pairs: [{ hangul: "전화를 걸다", meaning: "to make a call" }, { hangul: "전화를 받다", meaning: "to answer the phone" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Xin chào, tôi muốn nói chuyện với giám đốc.", hangul: "안녕하세요, 사장님과 통화하고 싶습니다." }
    ]
  },
  {
    id: 22,
    title: "Writing Emails",
    hangul: "이메일 쓰기",
    meaning: "Writing emails",
    notes: "Learn formal and informal email expressions. Use 안녕하세요 for greeting and 감사합니다 for thanks.",
    vocabulary: [
      { hangul: "이메일", meaning: "email" },
      { hangul: "보내다", meaning: "to send" },
      { hangul: "받다", meaning: "to receive" },
      { hangul: "제목", meaning: "subject" },
      { hangul: "내용", meaning: "content" },
      { hangul: "첨부 파일", meaning: "attachment" },
      { hangul: "회신하다", meaning: "to reply" },
      { hangul: "확인하다", meaning: "to confirm" },
      { hangul: "감사합니다", meaning: "thank you" },
      { hangul: "안녕하세요", meaning: "hello (formal)" }
    ],

    sentences: [
      { hangul: "안녕하세요, 김 선생님께 이메일 드립니다.", meaning: "Hello, I am sending an email to Mr. Kim." },
      { hangul: "첨부 파일을 확인해 주세요.", meaning: "Please check the attached file." },
      { hangul: "회신 부탁드립니다.", meaning: "I look forward to your reply." },
      { hangul: "제목을 다시 쓰겠습니다.", meaning: "I will rewrite the subject." },
      { hangul: "감사합니다. 좋은 하루 보내세요.", meaning: "Thank you. Have a nice day." }
    ],

    dialogue: [
      { speaker: "A", hangul: "안녕하세요, 이메일 보냈어요?", meaning: "Hello, did you send the email?" },
      { speaker: "B", hangul: "네, 방금 보냈어요. 첨부 파일도 넣었어요.", meaning: "Yes, I just sent it. I also attached a file." },
      { speaker: "A", hangul: "확인해 볼게요. 감사합니다.", meaning: "I'll check it. Thank you." },
      { speaker: "B", hangul: "네, 수고하세요.", meaning: "Okay, take care." },
    ],

    exercises: [
      { type: "fill-blank", question: "이메일을 ___습니다.", answer: "보냈" },
      { type: "matching", pairs: [{ hangul: "보내다", meaning: "to send" }, { hangul: "받다", meaning: "to receive" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi đã gửi email kèm tệp đính kèm.", hangul: "첨부 파일과 함께 이메일을 보냈습니다." }
    ]
  },
  {
    id: 23,
    title: "At the Bank",
    hangul: "은행에서",
    meaning: "At the bank",
    notes: "Useful phrases for banking transactions. Use 통장 for bankbook and 계좌 for account.",
    vocabulary: [
      { hangul: "은행", meaning: "bank" },
      { hangul: "계좌", meaning: "account" },
      { hangul: "통장", meaning: "bankbook" },
      { hangul: "입금하다", meaning: "to deposit" },
      { hangul: "출금하다", meaning: "to withdraw" },
      { hangul: "송금하다", meaning: "to transfer" },
      { hangul: "이자", meaning: "interest" },
      { hangul: "비밀번호", meaning: "password" },
      { hangul: "통화", meaning: "currency" },
      { hangul: "수수료", meaning: "fee" }
    ],

    sentences: [
      { hangul: "계좌를 개설하고 싶습니다.", meaning: "I would like to open an account." },
      { hangul: "입금하려고 합니다.", meaning: "I want to make a deposit." },
      { hangul: "송금 수수료는 얼마인가요?", meaning: "How much is the transfer fee?" },
      { hangul: "비밀번호를 변경하고 싶어요.", meaning: "I want to change my password." },
      { hangul: "통장 정리를 부탁합니다.", meaning: "Please update my bankbook." }
    ],

    dialogue: [
      { speaker: "A", hangul: "안녕하세요, 계좌를 개설하고 싶습니다.", meaning: "Hello, I'd like to open an account." },
      { speaker: "B", hangul: "네, 신분증이 필요합니다.", meaning: "Yes, you need an ID." },
      { speaker: "A", hangul: "여기 있습니다.", meaning: "Here it is." },
      { speaker: "B", hangul: "감사합니다. 잠시만 기다려 주세요.", meaning: "Thank you. Please wait a moment." }
    ],
    exercises: [
      { type: "fill-blank", question: "계좌를 ___하고 싶습니다.", answer: "개설" },
      { type: "matching", pairs: [{ hangul: "입금하다", meaning: "to deposit" }, { hangul: "출금하다", meaning: "to withdraw" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn chuyển tiền đến tài khoản này.", hangul: "이 계좌로 송금하고 싶습니다." }
    ]
  },
  {
    id: 24,
    title: "At the Post Office",
    hangul: "우체국에서",
    meaning: "At the post office",
    notes: "Common phrases for mailing letters and packages. Use 우표 for stamp and 소포 for parcel.",
    vocabulary: [
      { hangul: "우체국", meaning: "post office" },
      { hangul: "우표", meaning: "stamp" },
      { hangul: "편지", meaning: "letter" },
      { hangul: "소포", meaning: "parcel" },
      { hangul: "등기", meaning: "registered mail" },
      { hangul: "빠른 우편", meaning: "express mail" },
      { hangul: "받는 사람", meaning: "recipient" },
      { hangul: "보내는 사람", meaning: "sender" },
      { hangul: "주소", meaning: "address" },
      { hangul: "우편 번호", meaning: "postal code" }
    ],

    sentences: [
      { hangul: "이 편지를 한국으로 보내고 싶어요.", meaning: "I want to send this letter to Korea." },
      { hangul: "소포를 부치려면 얼마인가요?", meaning: "How much is it to send a parcel?" },
      { hangul: "등기로 보내 주세요.", meaning: "Please send it by registered mail." },
      { hangul: "우표를 어디서 살 수 있나요?", meaning: "Where can I buy stamps?" },
      { hangul: "주소를 여기에 적어 주세요.", meaning: "Please write the address here." }
    ],

    dialogue: [
      { speaker: "A", hangul: "이 소포를 베트남으로 보내고 싶어요.", meaning: "I want to send this parcel to Vietnam." },
      { speaker: "B", hangul: "네, 내용물은 무엇인가요?", meaning: "Yes, what is the contents?" },
      { speaker: "A", hangul: "옷과 책입니다.", meaning: "Clothes and books." },
      { speaker: "B", hangul: "배송 방법을 선택해 주세요. 항공편이 빠릅니다.", meaning: "Please choose a shipping method. Air mail is faster." }
    ],
    exercises: [
      { type: "fill-blank", question: "이 편지를 ___로 보내고 싶어요.", answer: "한국" },
      { type: "matching", pairs: [{ hangul: "우표", meaning: "stamp" }, { hangul: "소포", meaning: "parcel" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn gửi bưu kiện này bằng đường hàng không.", hangul: "이 소포를 항공편으로 보내고 싶습니다." }
    ]
  },
  {
    id: 25,
    title: "Renting an Apartment",
    hangul: "아파트 임대",
    meaning: "Renting an apartment",
    notes: "Vocabulary for apartment rental. Use 보증금 for deposit and 월세 for monthly rent.",
    vocabulary: [
      { hangul: "아파트", meaning: "apartment" },
      { hangul: "임대", meaning: "rental" },
      { hangul: "보증금", meaning: "deposit" },
      { hangul: "월세", meaning: "monthly rent" },
      { hangul: "계약", meaning: "contract" },
      { hangul: "방", meaning: "room" },
      { hangul: "부엌", meaning: "kitchen" },
      { hangul: "화장실", meaning: "bathroom" },
      { hangul: "주차장", meaning: "parking lot" },
      { hangul: "관리비", meaning: "management fee" }
    ],

    sentences: [
      { hangul: "아파트를 구하고 있습니다.", meaning: "I am looking for an apartment." },
      { hangul: "보증금은 얼마인가요?", meaning: "How much is the deposit?" },
      { hangul: "월세가 너무 비싸요.", meaning: "The monthly rent is too expensive." },
      { hangul: "계약 기간은 1년입니다.", meaning: "The contract period is one year." },
      { hangul: "관리비가 포함되어 있나요?", meaning: "Is the management fee included?" }
    ],

    dialogue: [
      { speaker: "A", hangul: "이 아파트를 보여 주시겠어요?", meaning: "Could you show me this apartment?" },
      { speaker: "B", hangul: "네, 여기 있습니다. 방이 두 개예요.", meaning: "Yes, here it is. It has two rooms." },
      { speaker: "A", hangul: "부엌이 크네요. 마음에 들어요.", meaning: "The kitchen is big. I like it." },
      { speaker: "B", hangul: "보증금은 500만 원이고 월세는 70만 원입니다.", meaning: "The deposit is 5 million won and monthly rent is 700,000 won." }
    ],
    exercises: [
      { type: "fill-blank", question: "보증금이 ___만 원입니다.", answer: "500" },
      { type: "matching", pairs: [{ hangul: "월세", meaning: "monthly rent" }, { hangul: "보증금", meaning: "deposit" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tiền thuê nhà hàng tháng là 700.000 won.", hangul: "월세는 70만 원입니다." }
    ]
  },
  {
    id: 26,
    title: "Complaints and Returns",
    hangul: "불만 및 반품",
    meaning: "Complaints and returns",
    notes: "Expressions for complaining and returning items. Use 불만 for complaint and 반품 for return.",
    vocabulary: [
      { hangul: "불만", meaning: "complaint" },
      { hangul: "반품", meaning: "return" },
      { hangul: "교환", meaning: "exchange" },
      { hangul: "환불", meaning: "refund" },
      { hangul: "하자", meaning: "defect" },
      { hangul: "영수증", meaning: "receipt" },
      { hangul: "고객 센터", meaning: "customer service" },
      { hangul: "불편하다", meaning: "to be uncomfortable" },
      { hangul: "제품", meaning: "product" },
      { hangul: "주문", meaning: "order" }
    ],

    sentences: [
      { hangul: "이 제품에 하자가 있습니다.", meaning: "This product has a defect." },
      { hangul: "반품하고 싶습니다.", meaning: "I want to return it." },
      { hangul: "영수증이 없으면 환불이 어렵습니다.", meaning: "Without a receipt, a refund is difficult." },
      { hangul: "다른 제품으로 교환해 주세요.", meaning: "Please exchange it for another product." },
      { hangul: "고객 센터에 전화해 보세요.", meaning: "Try calling customer service." }
    ],

    dialogue: [
      { speaker: "A", hangul: "이 옷에 구멍이 났어요. 반품하고 싶어요.", meaning: "This clothing has a hole. I want to return it." },
      { speaker: "B", hangul: "영수증 있으세요?", meaning: "Do you have the receipt?" },
      { speaker: "A", hangul: "네, 여기 있어요.", meaning: "Yes, here it is." },
      { speaker: "B", hangul: "죄송합니다. 바로 환불해 드리겠습니다.", meaning: "I'm sorry. I will refund you right away." }
    ],
    exercises: [
      { type: "fill-blank", question: "이 제품에 ___가 있습니다.", answer: "하자" },
      { type: "matching", pairs: [{ hangul: "반품", meaning: "return" }, { hangul: "환불", meaning: "refund" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn đổi sản phẩm này lấy sản phẩm khác.", hangul: "이 제품을 다른 제품으로 교환하고 싶습니다." }
    ]
  },
  {
    id: 27,
    title: "Giving Detailed Directions",
    hangul: "길 안내",
    meaning: "Giving detailed directions",
    notes: "Use directional phrases like 직진 for straight, 왼쪽 for left, 오른쪽 for right.",
    vocabulary: [
      { hangul: "직진", meaning: "straight ahead" },
      { hangul: "왼쪽", meaning: "left" },
      { hangul: "오른쪽", meaning: "right" },
      { hangul: "모퉁이", meaning: "corner" },
      { hangul: "건너편", meaning: "opposite side" },
      { hangul: "사거리", meaning: "intersection" },
      { hangul: "신호등", meaning: "traffic light" },
      { hangul: "걸어서", meaning: "on foot" },
      { hangul: "버스 정류장", meaning: "bus stop" },
      { hangul: "지하철 역", meaning: "subway station" }
    ],

    sentences: [
      { hangul: "직진하다가 사거리에서 왼쪽으로 가세요.", meaning: "Go straight and turn left at the intersection." },
      { hangul: "신호등을 건너면 은행이 보여요.", meaning: "After crossing the traffic light, you'll see the bank." },
      { hangul: "버스 정류장은 건너편에 있어요.", meaning: "The bus stop is on the opposite side." },
      { hangul: "여기서 지하철 역까지 걸어서 10분이에요.", meaning: "It's a 10-minute walk from here to the subway station." },
      { hangul: "모퉁이를 돌면 편의점이 있어요.", meaning: "Around the corner, there is a convenience store." }
    ],

    dialogue: [
      { speaker: "A", hangul: "실례합니다, 시청에 어떻게 가나요?", meaning: "Excuse me, how do I get to City Hall?" },
      { speaker: "B", hangul: "직진하시다가 두 번째 사거리에서 오른쪽으로 가세요.", meaning: "Go straight and turn right at the second intersection." },
      { speaker: "A", hangul: "네, 감사합니다. 걸어서 얼마나 걸리나요?", meaning: "Okay, thank you. How long does it take on foot?" },
      { speaker: "B", hangul: "약 15분 정도 걸려요.", meaning: "It takes about 15 minutes." }
    ],
    exercises: [
      { type: "fill-blank", question: "사거리에서 ___쪽으로 가세요.", answer: "왼" },
      { type: "matching", pairs: [{ hangul: "직진", meaning: "straight" }, { hangul: "모퉁이", meaning: "corner" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Rẽ trái ở ngã tư thứ hai.", hangul: "두 번째 사거리에서 왼쪽으로 가세요." }
    ]
  },
  {
    id: 28,
    title: "Discussing News",
    hangul: "뉴스 토론",
    meaning: "Discussing news",
    notes: "Use 뉴스 for news and 토론 for discussion. Learn to express opinions on current events.",
    vocabulary: [
      { hangul: "뉴스", meaning: "news" },
      { hangul: "토론하다", meaning: "to discuss" },
      { hangul: "기사", meaning: "article" },
      { hangul: "사건", meaning: "incident" },
      { hangul: "의견", meaning: "opinion" },
      { hangul: "동의하다", meaning: "to agree" },
      { hangul: "반대하다", meaning: "to oppose" },
      { hangul: "사실", meaning: "fact" },
      { hangul: "거짓", meaning: "lie / false" },
      { hangul: "분석", meaning: "analysis" }
    ],

    sentences: [
      { hangul: "오늘 뉴스에서 뭘 봤어요?", meaning: "What did you see on the news today?" },
      { hangul: "그 기사에 동의하세요?", meaning: "Do you agree with that article?" },
      { hangul: "저는 그 의견에 반대합니다.", meaning: "I oppose that opinion." },
      { hangul: "그 사건은 아직 사실이 확인되지 않았어요.", meaning: "That incident hasn't been confirmed as fact yet." },
      { hangul: "뉴스 분석이 매우 흥미로웠어요.", meaning: "The news analysis was very interesting." }
    ],

    dialogue: [
      { speaker: "A", hangul: "어제 뉴스 봤어요? 경제 관련 기사가 있었어요.", meaning: "Did you watch the news yesterday? There was an article about the economy." },
      { speaker: "B", hangul: "네, 봤어요. 하지만 그 분석에 동의하지 않아요.", meaning: "Yes, I saw it. But I don't agree with that analysis." },
      { speaker: "A", hangul: "왜요? 저는 꽤 타당하다고 생각했는데요.", meaning: "Why? I thought it was quite reasonable." },
      { speaker: "B", hangul: "몇 가지 사실이 빠져 있어요.", meaning: "Some facts are missing." }
    ],
    exercises: [
      { type: "fill-blank", question: "그 기사에 ___하세요?", answer: "동의" },
      { type: "matching", pairs: [{ hangul: "동의하다", meaning: "to agree" }, { hangul: "반대하다", meaning: "to oppose" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi không đồng ý với phân tích đó.", hangul: "저는 그 분석에 동의하지 않습니다." }
    ]
  },
  {
    id: 29,
    title: "Cultural Differences",
    hangul: "문화적 차이",
    meaning: "Cultural differences",
    notes: "Discuss cultural norms and differences. Use 문화 for culture and 차이 for difference.",
    vocabulary: [
      { hangul: "문화", meaning: "culture" },
      { hangul: "차이", meaning: "difference" },
      { hangul: "관습", meaning: "custom" },
      { hangul: "예절", meaning: "etiquette" },
      { hangul: "인사", meaning: "greeting" },
      { hangul: "선물", meaning: "gift" },
      { hangul: "식사", meaning: "meal" },
      { hangul: "금기", meaning: "taboo" },
      { hangul: "이해하다", meaning: "to understand" },
      { hangul: "존중하다", meaning: "to respect" }
    ],

    sentences: [
      { hangul: "한국과 베트남의 문화 차이가 있어요.", meaning: "There are cultural differences between Korea and Vietnam." },
      { hangul: "한국에서는 인사할 때 고개를 숙여요.", meaning: "In Korea, you bow when greeting." },
      { hangul: "선물을 받을 때 두 손으로 받는 게 예의예요.", meaning: "It is polite to receive a gift with both hands." },
      { hangul: "식사 중에 코를 푸는 것은 금기예요.", meaning: "Blowing your nose during a meal is taboo." },
      { hangul: "서로의 문화를 존중하는 것이 중요해요.", meaning: "It's important to respect each other's culture." }
    ],

    dialogue: [
      { speaker: "A", hangul: "한국에서 처음으로 명절을 보냈어요.", meaning: "I spent my first holiday in Korea." },
      { speaker: "B", hangul: "어땠어요? 다른 점이 많았죠?", meaning: "How was it? There were many differences, right?" },
      { speaker: "A", hangul: "네, 특히 음식과 인사 방식이 달랐어요.", meaning: "Yes, especially the food and greeting style were different." },
      { speaker: "B", hangul: "시간이 지나면 익숙해질 거예요.", meaning: "You'll get used to it over time." }
    ],
    exercises: [
      { type: "fill-blank", question: "한국과 베트남의 ___ 차이가 있어요.", answer: "문화" },
      { type: "matching", pairs: [{ hangul: "인사", meaning: "greeting" }, { hangul: "금기", meaning: "taboo" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Điều quan trọng là tôn trọng văn hóa của nhau.", hangul: "서로의 문화를 존중하는 것이 중요합니다." }
    ]
  },
  {
    id: 30,
    title: "Job Interviews",
    hangul: "면접",
    meaning: "Job interviews",
    notes: "Key phrases for job interviews. Use 자기소개 for self-introduction and 지원하다 for apply.",
    vocabulary: [
      { hangul: "면접", meaning: "interview" },
      { hangul: "지원하다", meaning: "to apply" },
      { hangul: "자기소개", meaning: "self-introduction" },
      { hangul: "경력", meaning: "career / experience" },
      { hangul: "학력", meaning: "educational background" },
      { hangul: "강점", meaning: "strength" },
      { hangul: "약점", meaning: "weakness" },
      { hangul: "목표", meaning: "goal" },
      { hangul: "직무", meaning: "job duty" },
      { hangul: "합격", meaning: "pass / acceptance" }
    ],

    sentences: [
      { hangul: "먼저 자기소개를 해 주세요.", meaning: "Please introduce yourself first." },
      { hangul: "제 강점은 커뮤니케이션 능력입니다.", meaning: "My strength is communication skills." },
      { hangul: "이전 경력에 대해 말씀해 주세요.", meaning: "Please tell me about your previous experience." },
      { hangul: "왜 이 회사에 지원하셨나요?", meaning: "Why did you apply to this company?" },
      { hangul: "앞으로의 목표가 무엇인가요?", meaning: "What are your future goals?" }
    ],

    dialogue: [
      { speaker: "A", hangul: "안녕하세요. 면접관입니다. 편하게 앉으세요.", meaning: "Hello. I am the interviewer. Please have a seat." },
      { speaker: "B", hangul: "감사합니다. 저는 김지수라고 합니다.", meaning: "Thank you. My name is Jisoo Kim." },
      { speaker: "A", hangul: "지수 씨, 자기소개 부탁드립니다.", meaning: "Jisoo, please introduce yourself." },
      { speaker: "B", hangul: "네. 저는 마케팅 분야에서 3년 경력이 있습니다.", meaning: "Yes. I have three years of experience in marketing." }
    ],
    exercises: [
      { type: "fill-blank", question: "먼저 ___를 해 주세요.", answer: "자기소개" },
      { type: "matching", pairs: [{ hangul: "강점", meaning: "strength" }, { hangul: "약점", meaning: "weakness" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi có ba năm kinh nghiệm trong lĩnh vực tiếp thị.", hangul: "저는 마케팅 분야에서 3년 경력이 있습니다." }
    ]
  },
  {
    id: 31,
    title: "Business Meetings",
    hangul: "비즈니스 회의",
    meaning: "Business meetings",
    notes: "Formal meeting expressions. Use 회의 for meeting and 의견을 내다 to give opinion.",
    vocabulary: [
      { hangul: "회의", meaning: "meeting" },
      { hangul: "의제", meaning: "agenda" },
      { hangul: "발표", meaning: "presentation" },
      { hangul: "토의", meaning: "discussion" },
      { hangul: "결정", meaning: "decision" },
      { hangul: "참석하다", meaning: "to attend" },
      { hangul: "의견을 내다", meaning: "to give an opinion" },
      { hangul: "진행하다", meaning: "to proceed" },
      { hangul: "마감", meaning: "deadline" },
      { hangul: "회의록", meaning: "meeting minutes" }
    ],

    sentences: [
      { hangul: "회의를 시작하겠습니다.", meaning: "Let's start the meeting." },
      { hangul: "오늘 의제는 무엇인가요?", meaning: "What is today's agenda?" },
      { hangul: "다음 프로젝트에 대해 토의합시다.", meaning: "Let's discuss the next project." },
      { hangul: "결정은 다음 주까지 미루겠습니다.", meaning: "We will postpone the decision until next week." },
      { hangul: "회의록을 이메일로 보내 드리겠습니다.", meaning: "I will send you the meeting minutes by email." }
    ],

    dialogue: [
      { speaker: "A", hangul: "모두 모였으니 회의를 시작하겠습니다.", meaning: "Since everyone is here, let's start the meeting." },
      { speaker: "B", hangul: "네, 먼저 지난주 진행 상황을 보고하겠습니다.", meaning: "Yes, first I will report on last week's progress." },
      { speaker: "A", hangul: "수고하셨습니다. 다음 의제로 넘어갑시다.", meaning: "Good work. Let's move to the next agenda." },
      { speaker: "B", hangul: "새로운 마케팅 전략에 대해 논의하고 싶습니다.", meaning: "I'd like to discuss the new marketing strategy." }
    ],
    exercises: [
      { type: "fill-blank", question: "회의를 ___겠습니다.", answer: "시작하" },
      { type: "matching", pairs: [{ hangul: "의제", meaning: "agenda" }, { hangul: "회의록", meaning: "minutes" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng ta hãy thảo luận về dự án tiếp theo.", hangul: "다음 프로젝트에 대해 토의합시다." }
    ]
  },
  {
    id: 32,
    title: "Giving Presentations",
    hangul: "발표하기",
    meaning: "Giving presentations",
    notes: "Presentation phrases. Use 발표 for presentation and 자료 for materials.",
    vocabulary: [
      { hangul: "발표", meaning: "presentation" },
      { hangul: "자료", meaning: "materials" },
      { hangul: "슬라이드", meaning: "slide" },
      { hangul: "요약", meaning: "summary" },
      { hangul: "질문", meaning: "question" },
      { hangul: "대답", meaning: "answer" },
      { hangul: "청중", meaning: "audience" },
      { hangul: "준비하다", meaning: "to prepare" },
      { hangul: "설명하다", meaning: "to explain" },
      { hangul: "마무리하다", meaning: "to conclude" }
    ],

    sentences: [
      { hangul: "오늘 발표 주제는 시장 분석입니다.", meaning: "Today's presentation topic is market analysis." },
      { hangul: "다음 슬라이드를 봐 주세요.", meaning: "Please look at the next slide." },
      { hangul: "간단히 요약하겠습니다.", meaning: "I will give a brief summary." },
      { hangul: "질문이 있으시면 언제든지 해 주세요.", meaning: "If you have questions, please feel free to ask anytime." },
      { hangul: "발표를 마치겠습니다. 감사합니다.", meaning: "I will conclude the presentation. Thank you." }
    ],

    dialogue: [
      { speaker: "A", hangul: "안녕하세요, 오늘 발표를 시작하겠습니다.", meaning: "Hello, I will begin today's presentation." },
      { speaker: "B", hangul: "주제가 무엇인가요?", meaning: "What is the topic?" },
      { speaker: "A", hangul: "신제품 출시 전략에 관한 것입니다.", meaning: "It is about the new product launch strategy." },
      { speaker: "B", hangul: "자료를 미리 받을 수 있나요?", meaning: "Can I get the materials in advance?" }
    ],
    exercises: [
      { type: "fill-blank", question: "다음 ___를 봐 주세요.", answer: "슬라이드" },
      { type: "matching", pairs: [{ hangul: "발표", meaning: "presentation" }, { hangul: "요약", meaning: "summary" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ kết thúc bài thuyết trình. Cảm ơn.", hangul: "발표를 마치겠습니다. 감사합니다." }
    ]
  },
  {
    id: 33,
    title: "Negotiating",
    hangul: "협상",
    meaning: "Negotiating",
    notes: "Negotiation vocabulary. Use 협상 for negotiation and 조건 for condition.",
    vocabulary: [
      { hangul: "협상", meaning: "negotiation" },
      { hangul: "조건", meaning: "condition" },
      { hangul: "제안", meaning: "proposal" },
      { hangul: "타협", meaning: "compromise" },
      { hangul: "할인", meaning: "discount" },
      { hangul: "가격", meaning: "price" },
      { hangul: "계약서", meaning: "contract" },
      { hangul: "양보하다", meaning: "to concede" },
      { hangul: "이익", meaning: "profit" },
      { hangul: "마감일", meaning: "deadline" }
    ],

    sentences: [
      { hangul: "협상을 시작합시다.", meaning: "Let's start the negotiation." },
      { hangul: "조건을 조금 완화해 주실 수 있나요?", meaning: "Could you ease the conditions a little?" },
      { hangul: "우리는 10% 할인을 제안합니다.", meaning: "We propose a 10% discount." },
      { hangul: "서로 타협점을 찾아야 합니다.", meaning: "We need to find a compromise." },
      { hangul: "계약서에 서명하기 전에 검토하겠습니다.", meaning: "I will review the contract before signing." }
    ],

    dialogue: [
      { speaker: "A", hangul: "가격을 낮출 수 있을까요?", meaning: "Can you lower the price?" },
      { speaker: "B", hangul: "최대 5%까지 할인이 가능합니다.", meaning: "A maximum of 5% discount is possible." },
      { speaker: "A", hangul: "그럼 10% 할인은 어려운가요?", meaning: "Then is 10% discount difficult?" },
      { speaker: "B", hangul: "죄송합니다. 그 이상은 어렵습니다.", meaning: "Sorry, it's difficult beyond that." }
    ],
    exercises: [
      { type: "fill-blank", question: "___을 시작합시다.", answer: "협상" },
      { type: "matching", pairs: [{ hangul: "할인", meaning: "discount" }, { hangul: "양보하다", meaning: "to concede" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng tôi đề xuất giảm giá 10%.", hangul: "우리는 10% 할인을 제안합니다." }
    ]
  },
  {
    id: 34,
    title: "Social Media",
    hangul: "소셜 미디어",
    meaning: "Social media",
    notes: "Social media terms. Use 소셜 미디어 for social media and 팔로우 for follow.",
    vocabulary: [
      { hangul: "소셜 미디어", meaning: "social media" },
      { hangul: "팔로우", meaning: "follow" },
      { hangul: "좋아요", meaning: "like" },
      { hangul: "댓글", meaning: "comment" },
      { hangul: "공유하다", meaning: "to share" },
      { hangul: "게시물", meaning: "post" },
      { hangul: "프로필", meaning: "profile" },
      { hangul: "해시태그", meaning: "hashtag" },
      { hangul: "인스타그램", meaning: "Instagram" },
      { hangul: "트위터", meaning: "Twitter" }
    ],

    sentences: [
      { hangul: "소셜 미디어에서 자주 활동하세요?", meaning: "Do you often use social media?" },
      { hangul: "제 게시물에 좋아요를 눌러 주세요.", meaning: "Please like my post." },
      { hangul: "댓글을 달아 주셔서 감사합니다.", meaning: "Thank you for leaving a comment." },
      { hangul: "이 사진을 공유하고 싶어요.", meaning: "I want to share this photo." },
      { hangul: "해시태그를 사용하면 검색이 쉬워요.", meaning: "Using hashtags makes searching easier." }
    ],

    dialogue: [
      { speaker: "A", hangul: "인스타그램 계정이 있어요?", meaning: "Do you have an Instagram account?" },
      { speaker: "B", hangul: "네, 있어요. 당신을 팔로우할게요.", meaning: "Yes, I do. I'll follow you." },
      { speaker: "A", hangul: "감사합니다. 저도 팔로우할게요.", meaning: "Thank you. I'll follow you too." },
      { speaker: "B", hangul: "게시물이 정말 예쁘네요!", meaning: "Your posts are really pretty!" }
    ],
    exercises: [
      { type: "fill-blank", question: "게시물에 ___를 눌러 주세요.", answer: "좋아요" },
      { type: "matching", pairs: [{ hangul: "팔로우", meaning: "follow" }, { hangul: "공유하다", meaning: "to share" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn chia sẻ bức ảnh này.", hangul: "이 사진을 공유하고 싶어요." }
    ]
  },
  {
    id: 35,
    title: "Environmental Issues",
    hangul: "환경 문제",
    meaning: "Environmental issues",
    notes: "Environmental vocabulary. Use 환경 for environment and 문제 for issue.",
    vocabulary: [
      { hangul: "환경", meaning: "environment" },
      { hangul: "문제", meaning: "problem" },
      { hangul: "오염", meaning: "pollution" },
      { hangul: "재활용", meaning: "recycling" },
      { hangul: "쓰레기", meaning: "trash" },
      { hangul: "지구 온난화", meaning: "global warming" },
      { hangul: "에너지", meaning: "energy" },
      { hangul: "탄소 배출", meaning: "carbon emission" },
      { hangul: "자연 보호", meaning: "nature protection" },
      { hangul: "생태계", meaning: "ecosystem" }
    ],

    sentences: [
      { hangul: "환경 오염이 심각해지고 있어요.", meaning: "Environmental pollution is becoming serious." },
      { hangul: "재활용을 생활화해야 합니다.", meaning: "We should make recycling a habit." },
      { hangul: "지구 온난화를 막기 위해 노력합시다.", meaning: "Let's try to prevent global warming." },
      { hangul: "탄소 배출을 줄이는 것이 중요해요.", meaning: "Reducing carbon emissions is important." },
      { hangul: "자연을 보호하는 일에 동참해 주세요.", meaning: "Please join in protecting nature." }
    ],

    dialogue: [
      { speaker: "A", hangul: "요즘 환경 문제에 관심이 많아졌어요.", meaning: "I've become more interested in environmental issues these days." },
      { speaker: "B", hangul: "저도요. 특히 플라스틱 사용을 줄이려고 해요.", meaning: "Me too. Especially I try to reduce plastic use." },
      { speaker: "A", hangul: "재활용도 열심히 하고 있어요.", meaning: "I'm also doing recycling diligently." },
      { speaker: "B", hangul: "작은 실천이 큰 변화를 만들 수 있죠.", meaning: "Small actions can make big changes." }
    ],
    exercises: [
      { type: "fill-blank", question: "환경 ___이 심각해지고 있어요.", answer: "오염" },
      { type: "matching", pairs: [{ hangul: "재활용", meaning: "recycling" }, { hangul: "오염", meaning: "pollution" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Giảm lượng khí thải carbon là rất quan trọng.", hangul: "탄소 배출을 줄이는 것이 중요해요." }
    ]
  },
  {
    id: 36,
    title: "Expressing Opinions",
    hangul: "의견 표현",
    meaning: "Expressing opinions",
    notes: "Use 의견 for opinion and 표현 for expression. Learn to state and defend your views.",
    vocabulary: [
      { hangul: "의견", meaning: "opinion" },
      { hangul: "생각", meaning: "thought" },
      { hangul: "주장", meaning: "claim / argument" },
      { hangul: "근거", meaning: "evidence" },
      { hangul: "찬성하다", meaning: "to agree" },
      { hangul: "반대하다", meaning: "to disagree" },
      { hangul: "관점", meaning: "perspective" },
      { hangul: "논리", meaning: "logic" },
      { hangul: "확신", meaning: "conviction" },
      { hangul: "의문", meaning: "doubt" }
    ],

    sentences: [
      { hangul: "제 의견을 말씀드리겠습니다.", meaning: "I will express my opinion." },
      { hangul: "저는 그 주장에 동의하지 않습니다.", meaning: "I do not agree with that claim." },
      { hangul: "다른 관점에서 생각해 볼 필요가 있어요.", meaning: "We need to think from a different perspective." },
      { hangul: "그 근거가 충분하다고 생각하나요?", meaning: "Do you think that evidence is sufficient?" },
      { hangul: "저는 확신이 서지 않아요.", meaning: "I am not convinced." }
    ],

    dialogue: [
      { speaker: "A", hangul: "새 정책에 대해 어떻게 생각하세요?", meaning: "What do you think about the new policy?" },
      { speaker: "B", hangul: "저는 찬성합니다. 효과적일 거예요.", meaning: "I agree. It will be effective." },
      { speaker: "A", hangul: "그런데 비용이 너무 많이 들지 않을까요?", meaning: "But won't it cost too much?" },
      { speaker: "B", hangul: "장기적으로 보면 이익이 더 클 거예요.", meaning: "In the long run, the benefits will be greater." }
    ],
    exercises: [
      { type: "fill-blank", question: "제 ___을 말씀드리겠습니다.", answer: "의견" },
      { type: "matching", pairs: [{ hangul: "찬성하다", meaning: "to agree" }, { hangul: "반대하다", meaning: "to disagree" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi không đồng ý với lập luận đó.", hangul: "저는 그 주장에 동의하지 않습니다." }
    ]
  },
  {
    id: 37,
    title: "Making Suggestions",
    hangul: "제안하기",
    meaning: "Making suggestions",
    notes: "Use 제안 for suggestion. Use -는 게 어때요? for making suggestions.",
    vocabulary: [
      { hangul: "제안", meaning: "suggestion" },
      { hangul: "추천", meaning: "recommendation" },
      { hangul: "대안", meaning: "alternative" },
      { hangul: "의견을 묻다", meaning: "to ask for opinion" },
      { hangul: "제안하다", meaning: "to suggest" },
      { hangul: "투표", meaning: "vote" },
      { hangul: "선택", meaning: "choice" },
      { hangul: "계획", meaning: "plan" },
      { hangul: "실행", meaning: "execution" },
      { hangul: "고려하다", meaning: "to consider" }
    ],

    sentences: [
      { hangul: "같이 영화 보는 게 어때요?", meaning: "How about watching a movie together?" },
      { hangul: "제안이 있으신 분?", meaning: "Anyone have a suggestion?" },
      { hangul: "이 대안을 고려해 보세요.", meaning: "Please consider this alternative." },
      { hangul: "제가 추천하는 곳이 있어요.", meaning: "I have a recommendation." },
      { hangul: "우선 계획을 세우는 게 좋겠어요.", meaning: "I think it would be good to make a plan first." }
    ],

    dialogue: [
      { speaker: "A", hangul: "이번 주말에 뭐 할까요?", meaning: "What shall we do this weekend?" },
      { speaker: "B", hangul: "등산 가는 게 어때요?", meaning: "How about going hiking?" },
      { speaker: "A", hangul: "좋아요! 어디로 갈까요?", meaning: "Good idea! Where shall we go?" },
      { speaker: "B", hangul: "북한산이 어때요? 경치가 좋아요.", meaning: "How about Bukhansan? The scenery is nice." }
    ],
    exercises: [
      { type: "fill-blank", question: "같이 영화 보는 게 ___?", answer: "어때요" },
      { type: "matching", pairs: [{ hangul: "제안", meaning: "suggestion" }, { hangul: "추천", meaning: "recommendation" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi đề xuất chúng ta đi leo núi.", hangul: "등산 가는 것을 제안합니다." }
    ]
  },
  {
    id: 38,
    title: "Apologizing and Making Excuses",
    hangul: "사과와 변명",
    meaning: "Apologizing and making excuses",
    notes: "Use 사과 for apology and 변명 for excuse. Learn polite apology forms.",
    vocabulary: [
      { hangul: "사과", meaning: "apology" },
      { hangul: "변명", meaning: "excuse" },
      { hangul: "죄송합니다", meaning: "I'm sorry" },
      { hangul: "용서", meaning: "forgiveness" },
      { hangul: "실수", meaning: "mistake" },
      { hangul: "늦다", meaning: "to be late" },
      { hangul: "이해하다", meaning: "to understand" },
      { hangul: "다행이다", meaning: "to be relieved" },
      { hangul: "약속", meaning: "promise" },
      { hangul: "재발", meaning: "recurrence" }
    ],

    sentences: [
      { hangul: "정말 죄송합니다.", meaning: "I am really sorry." },
      { hangul: "제 실수였어요. 용서해 주세요.", meaning: "It was my mistake. Please forgive me." },
      { hangul: "늦은 이유를 설명해 주세요.", meaning: "Please explain the reason for being late." },
      { hangul: "다시는 그러지 않겠습니다.", meaning: "I won't do that again." },
      { hangul: "이해해 주셔서 감사합니다.", meaning: "Thank you for understanding." }
    ],

    dialogue: [
      { speaker: "A", hangul: "어제 약속에 늦어서 정말 미안해요.", meaning: "I'm really sorry for being late to the appointment yesterday." },
      { speaker: "B", hangul: "괜찮아요. 무슨 일이 있었어요?", meaning: "It's okay. What happened?" },
      { speaker: "A", hangul: "교통이 많이 막혔어요.", meaning: "There was heavy traffic." },
      { speaker: "B", hangul: "다행히 큰 문제는 없었어요.", meaning: "Luckily, there was no big issue." }
    ],
    exercises: [
      { type: "fill-blank", question: "정말 ___합니다.", answer: "죄송" },
      { type: "matching", pairs: [{ hangul: "사과", meaning: "apology" }, { hangul: "변명", meaning: "excuse" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Đó là lỗi của tôi. Xin hãy tha thứ cho tôi.", hangul: "제 실수였어요. 용서해 주세요." }
    ]
  },
  {
    id: 39,
    title: "Giving Advice",
    hangul: "조언하기",
    meaning: "Giving advice",
    notes: "Use 조언 for advice. Use -는 것이 좋다 for giving recommendations.",
    vocabulary: [
      { hangul: "조언", meaning: "advice" },
      { hangul: "충고", meaning: "counsel" },
      { hangul: "추천하다", meaning: "to recommend" },
      { hangul: "도움이 되다", meaning: "to be helpful" },
      { hangul: "경험", meaning: "experience" },
      { hangul: "조심하다", meaning: "to be careful" },
      { hangul: "노력하다", meaning: "to make an effort" },
      { hangul: "기회", meaning: "opportunity" },
      { hangul: "실패", meaning: "failure" },
      { hangul: "성공", meaning: "success" }
    ],

    sentences: [
      { hangul: "제 조언을 들어 보세요.", meaning: "Listen to my advice." },
      { hangul: "그 일을 먼저 처리하는 것이 좋아요.", meaning: "It's better to handle that task first." },
      { hangul: "실패를 두려워하지 마세요.", meaning: "Don't be afraid of failure." },
      { hangul: "기회가 올 때 잡으세요.", meaning: "Seize the opportunity when it comes." },
      { hangul: "충고를 명심하겠습니다.", meaning: "I will keep your advice in mind." }
    ],

    dialogue: [
      { speaker: "A", hangul: "한국어 공부가 어려워요. 조언 좀 해 주세요.", meaning: "Studying Korean is difficult. Please give me some advice." },
      { speaker: "B", hangul: "매일 조금씩 꾸준히 공부하는 게 좋아요.", meaning: "It's good to study a little bit every day consistently." },
      { speaker: "A", hangul: "듣기 실력을 어떻게 늘릴까요?", meaning: "How can I improve my listening skills?" },
      { speaker: "B", hangul: "한국 드라마를 보는 것도 도움이 돼요.", meaning: "Watching Korean dramas also helps." }
    ],
    exercises: [
      { type: "fill-blank", question: "제 ___을 들어 보세요.", answer: "조언" },
      { type: "matching", pairs: [{ hangul: "조언", meaning: "advice" }, { hangul: "충고", meaning: "counsel" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ ghi nhớ lời khuyên của bạn.", hangul: "충고를 명심하겠습니다." }
    ]
  },
  {
    id: 40,
    title: "Describing Experiences",
    hangul: "경험 설명",
    meaning: "Describing experiences",
    notes: "Use 경험 for experience. Use -아/어 보다 for having tried something.",
    vocabulary: [
      { hangul: "경험", meaning: "experience" },
      { hangul: "여행", meaning: "trip" },
      { hangul: "체험", meaning: "hands-on experience" },
      { hangul: "도전", meaning: "challenge" },
      { hangul: "즐기다", meaning: "to enjoy" },
      { hangul: "배우다", meaning: "to learn" },
      { hangul: "기억", meaning: "memory" },
      { hangul: "인상적이다", meaning: "impressive" },
      { hangul: "처음", meaning: "first time" },
      { hangul: "느끼다", meaning: "to feel" }
    ],

    sentences: [
      { hangul: "한국에 처음 왔을 때가 기억나요.", meaning: "I remember the first time I came to Korea." },
      { hangul: "김치를 처음 먹어 봤어요.", meaning: "I tried kimchi for the first time." },
      { hangul: "그 경험은 정말 인상적이었어요.", meaning: "That experience was really impressive." },
      { hangul: "여행하면서 많은 것을 배웠어요.", meaning: "I learned a lot while traveling." },
      { hangul: "새로운 도전을 즐기는 편이에요.", meaning: "I tend to enjoy new challenges." }
    ],

    dialogue: [
      { speaker: "A", hangul: "제주도에 가 본 적 있어요?", meaning: "Have you ever been to Jeju Island?" },
      { speaker: "B", hangul: "네, 작년에 다녀왔어요. 정말 아름다웠어요.", meaning: "Yes, I went last year. It was really beautiful." },
      { speaker: "A", hangul: "무엇이 가장 기억에 남나요?", meaning: "What is most memorable?" },
      { speaker: "B", hangul: "한라산 등반이 가장 인상 깊었어요.", meaning: "Climbing Hallasan was the most impressive." }
    ],
    exercises: [
      { type: "fill-blank", question: "김치를 처음 ___ 봤어요.", answer: "먹어" },
      { type: "matching", pairs: [{ hangul: "경험", meaning: "experience" }, { hangul: "체험", meaning: "hands-on experience" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Trải nghiệm đó thực sự ấn tượng.", hangul: "그 경험은 정말 인상적이었어요." }
    ]
  },
  {
    id: 41,
    title: "Comparing Options",
    hangul: "옵션 비교",
    meaning: "Comparing options",
    notes: "Use 비교 for comparison. Use -보다 더 for 'more than'.",
    vocabulary: [
      { hangul: "비교", meaning: "comparison" },
      { hangul: "옵션", meaning: "option" },
      { hangul: "선택", meaning: "choice" },
      { hangul: "장점", meaning: "advantage" },
      { hangul: "단점", meaning: "disadvantage" },
      { hangul: "비슷하다", meaning: "similar" },
      { hangul: "다르다", meaning: "different" },
      { hangul: "저렴하다", meaning: "cheap" },
      { hangul: "비싸다", meaning: "expensive" },
      { hangul: "효율적", meaning: "efficient" }
    ],

    sentences: [
      { hangul: "이 옵션과 저 옵션을 비교해 보세요.", meaning: "Compare this option and that option." },
      { hangul: "이 제품이 더 저렴하지만 품질은 비슷해요.", meaning: "This product is cheaper, but quality is similar." },
      { hangul: "장점과 단점을 따져 봐야 해요.", meaning: "We need to weigh the pros and cons." },
      { hangul: "어느 것이 더 효율적이라고 생각하세요?", meaning: "Which one do you think is more efficient?" },
      { hangul: "비교 결과가 흥미로웠어요.", meaning: "The comparison result was interesting." }
    ],

    dialogue: [
      { speaker: "A", hangul: "이 핸드폰과 저 핸드폰 중에 뭐가 더 좋아요?", meaning: "Between this phone and that phone, which is better?" },
      { speaker: "B", hangul: "이쪽이 카메라가 더 좋지만 배터리는 짧아요.", meaning: "This one has a better camera but shorter battery." },
      { speaker: "A", hangul: "가격은 비슷한가요?", meaning: "Are the prices similar?" },
      { speaker: "B", hangul: "아니요, 이게 조금 더 비싸요.", meaning: "No, this one is a bit more expensive." }
    ],
    exercises: [
      { type: "fill-blank", question: "이 옵션과 저 옵션을 ___해 보세요.", answer: "비교" },
      { type: "matching", pairs: [{ hangul: "장점", meaning: "advantage" }, { hangul: "단점", meaning: "disadvantage" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng ta cần cân nhắc ưu và nhược điểm.", hangul: "장점과 단점을 따져 봐야 해요." }
    ]
  },
  {
    id: 42,
    title: "Hypothetical Situations",
    hangul: "가상 상황",
    meaning: "Hypothetical situations",
    notes: "Use 가상 for hypothetical. Use -면 -을 텐데 for conditional hypotheticals.",
    vocabulary: [
      { hangul: "가상", meaning: "hypothetical" },
      { hangul: "상황", meaning: "situation" },
      { hangul: "만약", meaning: "if" },
      { hangul: "가정하다", meaning: "to assume" },
      { hangul: "상상", meaning: "imagination" },
      { hangul: "현실", meaning: "reality" },
      { hangul: "가능성", meaning: "possibility" },
      { hangul: "꿈", meaning: "dream" },
      { hangul: "소원", meaning: "wish" },
      { hangul: "행동", meaning: "action" }
    ],

    sentences: [
      { hangul: "만약 내가 백만장자라면 무엇을 할까?", meaning: "If I were a millionaire, what would I do?" },
      { hangul: "그 상황이 현실이라면 어쩌겠어요?", meaning: "If that situation were real, what would you do?" },
      { hangul: "가상의 시나리오를 생각해 봅시다.", meaning: "Let's think of a hypothetical scenario." },
      { hangul: "소원이 이루어진다면 가장 먼저 뭘 하고 싶어요?", meaning: "If your wish came true, what would you want to do first?" },
      { hangul: "꿈을 쫓는 것이 중요해요.", meaning: "It's important to chase your dreams." }
    ],

    dialogue: [
      { speaker: "A", hangul: "만약 시간을 되돌릴 수 있다면 뭘 하고 싶어요?", meaning: "If you could turn back time, what would you want to do?" },
      { speaker: "B", hangul: "더 열심히 공부할 거예요.", meaning: "I would study harder." },
      { speaker: "A", hangul: "저도요. 후회되는 일이 있어요.", meaning: "Me too. I have some regrets." },
      { speaker: "B", hangul: "하지만 과거는 바꿀 수 없으니 미래를 위해 노력합시다.", meaning: "But we can't change the past, so let's work for the future." }
    ],
    exercises: [
      { type: "fill-blank", question: "___ 내가 백만장자라면 무엇을 할까?", answer: "만약" },
      { type: "matching", pairs: [{ hangul: "가상", meaning: "hypothetical" }, { hangul: "상상", meaning: "imagination" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Nếu tôi có thể quay ngược thời gian, tôi sẽ học chăm chỉ hơn.", hangul: "만약 시간을 되돌릴 수 있다면 더 열심히 공부할 거예요." }
    ]
  },
  {
    id: 43,
    title: "Reporting Speech",
    hangul: "전달 화법",
    meaning: "Reporting speech",
    notes: "Use 전달 화법 for reported speech. Learn -다고 하다 and -라고 하다 patterns.",
    vocabulary: [
      { hangul: "전달", meaning: "report / delivery" },
      { hangul: "화법", meaning: "speech style" },
      { hangul: "인용", meaning: "quotation" },
      { hangul: "직접 화법", meaning: "direct speech" },
      { hangul: "간접 화법", meaning: "indirect speech" },
      { hangul: "말하다", meaning: "to say" },
      { hangul: "주장하다", meaning: "to claim" },
      { hangul: "묻다", meaning: "to ask" },
      { hangul: "대답하다", meaning: "to answer" },
      { hangul: "전하다", meaning: "to convey" }
    ],

    sentences: [
      { hangul: "그가 내일 올 거라고 했어요.", meaning: "He said he would come tomorrow." },
      { hangul: "그녀는 자기는 배고프지 않다고 말했어요.", meaning: "She said she was not hungry." },
      { hangul: "선생님께서 숙제를 내일까지 하라고 하셨어요.", meaning: "The teacher told us to do the homework by tomorrow." },
      { hangul: "그가 뭐라고 했어요?", meaning: "What did he say?" },
      { hangul: "그 소식을 친구에게 전했어요.", meaning: "I conveyed the news to my friend." }
    ],

    dialogue: [
      { speaker: "A", hangul: "민수가 뭐라고 했어요?", meaning: "What did Minsu say?" },
      { speaker: "B", hangul: "내일 시간이 안 된다고 했어요.", meaning: "He said he doesn't have time tomorrow." },
      { speaker: "A", hangul: "그럼 모레는 괜찮다고 물어봐 주세요.", meaning: "Then please ask if the day after tomorrow is okay." },
      { speaker: "B", hangul: "알겠어요. 전해 줄게요.", meaning: "Okay. I'll pass it on." }
    ],
    exercises: [
      { type: "fill-blank", question: "그가 내일 올 ___고 했어요.", answer: "거라" },
      { type: "matching", pairs: [{ hangul: "직접 화법", meaning: "direct speech" }, { hangul: "간접 화법", meaning: "indirect speech" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Cô ấy nói rằng cô ấy không đói.", hangul: "그녀는 자기는 배고프지 않다고 말했어요." }
    ]
  },
  {
    id: 44,
    title: "Passive Voice",
    hangul: "수동태",
    meaning: "Passive voice",
    notes: "Use 수동태 for passive voice. Learn passive verb endings like -이/히/리/기-.",
    vocabulary: [
      { hangul: "수동태", meaning: "passive voice" },
      { hangul: "능동태", meaning: "active voice" },
      { hangul: "동사", meaning: "verb" },
      { hangul: "주어", meaning: "subject" },
      { hangul: "목적어", meaning: "object" },
      { hangul: "쓰이다", meaning: "to be used" },
      { hangul: "열리다", meaning: "to be opened" },
      { hangul: "닫히다", meaning: "to be closed" },
      { hangul: "만들어지다", meaning: "to be made" },
      { hangul: "알려지다", meaning: "to be known" }
    ],

    sentences: [
      { hangul: "이 문은 아침 9시에 열립니다.", meaning: "This door is opened at 9 AM." },
      { hangul: "한국어가 세계에서 많이 쓰이고 있어요.", meaning: "Korean is being used a lot in the world." },
      { hangul: "그 소식은 금방 알려졌어요.", meaning: "That news was quickly known." },
      { hangul: "이 빵은 밀가루로 만들어져요.", meaning: "This bread is made from flour." },
      { hangul: "창문이 닫혀 있어요.", meaning: "The window is closed." }
    ],

    dialogue: [
      { speaker: "A", hangul: "이 건물은 언제 지어졌어요?", meaning: "When was this building built?" },
      { speaker: "B", hangul: "10년 전에 지어졌어요.", meaning: "It was built 10 years ago." },
      { speaker: "A", hangul: "누구에 의해 설계되었나요?", meaning: "By whom was it designed?" },
      { speaker: "B", hangul: "유명한 건축가에 의해 설계되었어요.", meaning: "It was designed by a famous architect." }
    ],
    exercises: [
      { type: "fill-blank", question: "이 문은 아침 9시에 ___.", answer: "열립니다" },
      { type: "matching", pairs: [{ hangul: "열리다", meaning: "to be opened" }, { hangul: "닫히다", meaning: "to be closed" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tin tức đó nhanh chóng được biết đến.", hangul: "그 소식은 금방 알려졌어요." }
    ]
  },
  {
    id: 45,
    title: "Relative Clauses",
    hangul: "관형사절",
    meaning: "Relative clauses",
    notes: "Use 관형사절 for relative clauses. Learn -는, -은, -을 for modifying nouns.",
    vocabulary: [
      { hangul: "관형사절", meaning: "relative clause" },
      { hangul: "수식", meaning: "modification" },
      { hangul: "명사", meaning: "noun" },
      { hangul: "관형사", meaning: "determiner" },
      { hangul: "형용사", meaning: "adjective" },
      { hangul: "현재", meaning: "present tense" },
      { hangul: "과거", meaning: "past tense" },
      { hangul: "미래", meaning: "future tense" },
      { hangul: "연결", meaning: "connection" },
      { hangul: "관계", meaning: "relation" }
    ],

    sentences: [
      { hangul: "제가 산 책이 재미있어요.", meaning: "The book that I bought is interesting." },
      { hangul: "한국어를 배우는 사람이 많아요.", meaning: "There are many people who learn Korean." },
      { hangul: "어제 만난 친구가 전화했어요.", meaning: "The friend I met yesterday called." },
      { hangul: "먹을 음식을 준비할게요.", meaning: "I will prepare food to eat." },
      { hangul: "그가 쓴 편지를 읽었어요.", meaning: "I read the letter that he wrote." }
    ],

    dialogue: [
      { speaker: "A", hangul: "어제 산 치마가 마음에 들어요?", meaning: "Do you like the skirt you bought yesterday?" },
      { speaker: "B", hangul: "네, 그런데 좀 작아요.", meaning: "Yes, but it's a bit small." },
      { speaker: "A", hangul: "다른 색으로 교환할 수 있어요.", meaning: "You can exchange it for another color." },
      { speaker: "B", hangul: "괜찮아요. 그냥 입을게요.", meaning: "It's okay. I'll just wear it." }
    ],
    exercises: [
      { type: "fill-blank", question: "제가 ___ 책이 재미있어요.", answer: "산" },
      { type: "matching", pairs: [{ hangul: "현재", meaning: "present tense" }, { hangul: "과거", meaning: "past tense" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Có nhiều người học tiếng Hàn.", hangul: "한국어를 배우는 사람이 많아요." }
    ]
  },
  {
    id: 46,
    title: "Conditional Sentences",
    hangul: "조건문",
    meaning: "Conditional sentences",
    notes: "Use 조건문 for conditional sentences. Learn -면 and -으면 patterns.",
    vocabulary: [
      { hangul: "조건", meaning: "condition" },
      { hangul: "가정", meaning: "assumption" },
      { hangul: "결과", meaning: "result" },
      { hangul: "인과", meaning: "causation" },
      { hangul: "필요", meaning: "necessity" },
      { hangul: "충족", meaning: "satisfaction" },
      { hangul: "만약", meaning: "if" },
      { hangul: "그러면", meaning: "then" },
      { hangul: "아니면", meaning: "otherwise" },
      { hangul: "때문에", meaning: "because" }
    ],

    sentences: [
      { hangul: "비가 오면 집에 있을 거예요.", meaning: "If it rains, I will stay home." },
      { hangul: "시간이 있으면 같이 가자.", meaning: "If you have time, let's go together." },
      { hangul: "열심히 공부하면 합격할 수 있어요.", meaning: "If you study hard, you can pass." },
      { hangul: "돈이 많으면 여행을 갈 텐데.", meaning: "If I had a lot of money, I would travel." },
      { hangul: "늦으면 먼저 가도 돼요.", meaning: "If you are late, you can go ahead." }
    ],

    dialogue: [
      { speaker: "A", hangul: "내일 날씨가 좋으면 소풍 갈까요?", meaning: "If the weather is nice tomorrow, shall we go on a picnic?" },
      { speaker: "B", hangul: "좋아요. 그런데 비가 오면 어쩌죠?", meaning: "Good. But what if it rains?" },
      { speaker: "A", hangul: "그러면 영화관에 가요.", meaning: "Then let's go to the cinema." },
      { speaker: "B", hangul: "좋은 생각이에요!", meaning: "Good idea!" }
    ],
    exercises: [
      { type: "fill-blank", question: "비가 오면 집에 ___ 거예요.", answer: "있을" },
      { type: "matching", pairs: [{ hangul: "조건", meaning: "condition" }, { hangul: "결과", meaning: "result" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Nếu bạn học chăm chỉ, bạn có thể đỗ.", hangul: "열심히 공부하면 합격할 수 있어요." }
    ]
  },
  {
    id: 47,
    title: "Idiomatic Expressions",
    hangul: "관용 표현",
    meaning: "Idiomatic expressions",
    notes: "Use 관용 표현 for idioms. Learn common Korean idioms.",
    vocabulary: [
      { hangul: "관용 표현", meaning: "idiomatic expression" },
      { hangul: "속담", meaning: "proverb" },
      { hangul: "뜻", meaning: "meaning" },
      { hangul: "비유", meaning: "metaphor" },
      { hangul: "눈이 높다", meaning: "to have high standards (lit. eyes are high)" },
      { hangul: "입이 짧다", meaning: "to eat little (lit. mouth is short)" },
      { hangul: "발이 넓다", meaning: "to have many connections (lit. feet are wide)" },
      { hangul: "손이 크다", meaning: "to be generous (lit. hand is big)" },
      { hangul: "고생 끝에 낙이 온다", meaning: "after hardship comes happiness" },
      { hangul: "시작이 반이다", meaning: "well begun is half done" }
    ],

    sentences: [
      { hangul: "그 사람은 눈이 높아서 쉽게 사귀지 않아요.", meaning: "He has high standards so he doesn't date easily." },
      { hangul: "아기가 입이 짧아서 걱정이에요.", meaning: "I'm worried because the baby eats very little." },
      { hangul: "그녀는 발이 넓어서 아는 사람이 많아요.", meaning: "She has many connections and knows many people." },
      { hangul: "할머니는 손이 크셔서 항상 많이 주세요.", meaning: "Grandma is generous and always gives a lot." },
      { hangul: "힘들지만 고생 끝에 낙이 온다고 했어요.", meaning: "It's hard, but they say after hardship comes happiness." }
    ],

    dialogue: [
      { speaker: "A", hangul: "시험 준비가 너무 힘들어요.", meaning: "Preparing for the exam is so hard." },
      { speaker: "B", hangul: "시작이 반이잖아요. 이미 절반은 한 거예요.", meaning: "Well begun is half done. You've already done half." },
      { speaker: "A", hangul: "맞아요. 포기하지 말아야겠어요.", meaning: "That's right. I shouldn't give up." },
      { speaker: "B", hangul: "힘내세요! 고생 끝에 낙이 올 거예요.", meaning: "Cheer up! After hardship comes happiness." }
    ],
    exercises: [
      { type: "fill-blank", question: "그 사람은 ___이 높아요.", answer: "눈" },
      { type: "matching", pairs: [{ hangul: "손이 크다", meaning: "to be generous" }, { hangul: "입이 짧다", meaning: "to eat little" }],
 instruction: "Match Korean idioms with meanings" },
      { type: "translation", vietnamese: "Sau khó khăn sẽ đến hạnh phúc.", hangul: "고생 끝에 낙이 온다." }
    ]
  },
  {
    id: 48,
    title: "Slang and Colloquial",
    hangul: "속어와 구어체",
    meaning: "Slang and colloquial",
    notes: "Learn Korean slang and casual speech. Use 속어 for slang and 구어체 for colloquial style.",
    vocabulary: [
      { hangul: "속어", meaning: "slang" },
      { hangul: "구어체", meaning: "colloquial style" },
      { hangul: "대박", meaning: "awesome / jackpot" },
      { hangul: "헐", meaning: "whoa / oh my" },
      { hangul: "진짜", meaning: "really" },
      { hangul: "짱", meaning: "best / awesome" },
      { hangul: "존맛", meaning: "so delicious" },
      { hangul: "꿀잼", meaning: "so fun" },
      { hangul: "노잼", meaning: "boring" },
      { hangul: "안녕", meaning: "hi (informal)" }
    ],

    sentences: [
      { hangul: "와, 대박! 이거 진짜 좋다.", meaning: "Wow, awesome! This is really good." },
      { hangul: "헐, 그거 완전 꿀잼이야!", meaning: "Whoa, that's so fun!" },
      { hangul: "이 음식 존맛이야.", meaning: "This food is so delicious." },
      { hangul: "오늘 수업 노잼이었어.", meaning: "Today's class was boring." },
      { hangul: "그 영화 짱이야. 꼭 봐.", meaning: "That movie is the best. You must watch it." }
    ],

    dialogue: [
      { speaker: "A", hangul: "어제 놀이동산 갔어? 어땠어?", meaning: "Did you go to the amusement park yesterday? How was it?" },
      { speaker: "B", hangul: "대박! 완전 꿀잼이었어.", meaning: "Awesome! It was so fun." },
      { speaker: "A", hangul: "진짜? 나도 가고 싶다.", meaning: "Really? I want to go too." },
      { speaker: "B", hangul: "다음에 같이 가자!", meaning: "Let's go together next time!" }
    ],
    exercises: [
      { type: "fill-blank", question: "와, ___! 이거 진짜 좋다.", answer: "대박" },
      { type: "matching", pairs: [{ hangul: "꿀잼", meaning: "so fun" }, { hangul: "노잼", meaning: "boring" }],
 instruction: "Match Korean slang with English" },
      { type: "translation", vietnamese: "Món ăn này ngon tuyệt.", hangul: "이 음식 존맛이야." }
    ]
  },
  {
    id: 49,
    title: "Debating Skills",
    hangul: "토론 기술",
    meaning: "Debating skills",
    notes: "Use 토론 for debate. Learn to argue persuasively and counter arguments.",
    vocabulary: [
      { hangul: "토론", meaning: "debate" },
      { hangul: "논쟁", meaning: "argument" },
      { hangul: "주제", meaning: "topic" },
      { hangul: "반론", meaning: "counterargument" },
      { hangul: "증거", meaning: "evidence" },
      { hangul: "논리", meaning: "logic" },
      { hangul: "설득하다", meaning: "to persuade" },
      { hangul: "청중", meaning: "audience" },
      { hangul: "판사", meaning: "judge" },
      { hangul: "승리", meaning: "victory" }
    ],

    sentences: [
      { hangul: "오늘 토론 주제는 '원격 수업의 장단점'입니다.", meaning: "Today's debate topic is 'Pros and cons of online classes'." },
      { hangul: "제 반론을 말씀드리겠습니다.", meaning: "I will present my counterargument." },
      { hangul: "그 주장을 뒷받침할 증거가 있나요?", meaning: "Is there evidence to support that claim?" },
      { hangul: "논리가 타당하지 않습니다.", meaning: "The logic is not valid." },
      { hangul: "청중을 설득하는 것이 중요해요.", meaning: "Persuading the audience is important." }
    ],

    dialogue: [
      { speaker: "A", hangul: "저는 원격 수업이 더 효율적이라고 생각합니다.", meaning: "I think online classes are more efficient." },
      { speaker: "B", hangul: "하지만 집중하기 어렵다는 문제가 있어요.", meaning: "But there is the problem of difficulty concentrating." },
      { speaker: "A", hangul: "그건 개인의 차이라고 봅니다.", meaning: "I see that as an individual difference." },
      { speaker: "B", hangul: "통계를 보면 오히려 학습 효과가 떨어진다는 결과가 있어요.", meaning: "Statistics show that learning effectiveness actually decreases." }
    ],
    exercises: [
      { type: "fill-blank", question: "오늘 ___ 주제는 '원격 수업의 장단점'입니다.", answer: "토론" },
      { type: "matching", pairs: [{ hangul: "반론", meaning: "counterargument" }, { hangul: "증거", meaning: "evidence" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Lập luận đó không có tính logic.", hangul: "그 논리가 타당하지 않습니다." }
    ]
  },
  {
    id: 50,
    title: "Final Comprehensive Review",
    hangul: "종합 복습",
    meaning: "Final comprehensive review",
    notes: "Review all major grammar and vocabulary from lessons 21-49. Practice integrated skills.",
    vocabulary: [
      { hangul: "종합", meaning: "comprehensive" },
      { hangul: "복습", meaning: "review" },
      { hangul: "확인", meaning: "check" },
      { hangul: "평가", meaning: "evaluation" },
      { hangul: "정리", meaning: "summary" },
      { hangul: "연습", meaning: "practice" },
      { hangul: "강화", meaning: "reinforcement" },
      { hangul: "자신감", meaning: "confidence" },
      { hangul: "목표", meaning: "goal" },
      { hangul: "달성", meaning: "achievement" }
    ],

    sentences: [
      { hangul: "오늘은 지금까지 배운 내용을 총정리하겠습니다.", meaning: "Today we will summarize everything learned so far." },
      { hangul: "이 표현을 사용해서 문장을 만들어 보세요.", meaning: "Try making a sentence using this expression." },
      { hangul: "틀린 부분을 다시 확인해 보세요.", meaning: "Please check the incorrect parts again." },
      { hangul: "실전에서 자신 있게 사용할 수 있을 거예요.", meaning: "You will be able to use it confidently in real situations." },
      { hangul: "목표를 달성하기 위해 계속 노력합시다.", meaning: "Let's keep working to achieve our goals." }
    ],

    dialogue: [
      { speaker: "A", hangul: "드디어 마지막 수업이네요. 많이 배웠어요.", meaning: "Finally the last lesson. I learned a lot." },
      { speaker: "B", hangul: "맞아요. 이제 한국어로 대화하는 게 더 편해졌어요.", meaning: "Right. Now it's more comfortable to converse in Korean." },
      { speaker: "A", hangul: "앞으로도 꾸준히 공부할 거예요.", meaning: "I will continue to study steadily." },
      { speaker: "B", hangul: "화이팅! 함께 힘내요!", meaning: "Fighting! Let's cheer together!" }
    ],
    exercises: [
      { type: "fill-blank", question: "오늘은 지금까지 배운 내용을 ___하겠습니다.", answer: "총정리" },
      { type: "matching", pairs: [{ hangul: "복습", meaning: "review" }, { hangul: "평가", meaning: "evaluation" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ tiếp tục học tiếng Hàn một cách đều đặn.", hangul: "앞으로도 꾸준히 한국어를 공부할 거예요." }
    ]
  }
];
export default lessons;
