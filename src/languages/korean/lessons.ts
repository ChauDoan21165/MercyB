// src/languages/korean/lessons.ts
//
// Five starter lessons for Vietnamese learners of Korean.
// Covers: hangul, greetings, numbers (two systems), particles,
// basic verbs. Lesson shape mirrors the hospitality profession-pack
// pattern with bilingual sentences and practical teaching notes
// in Vietnamese.
//
// Content is hand-crafted from Sejong/Yonsei/Sogang textbook
// methodology and classroom experience with VN learners.

export type KoreanLessonSentence = {
  korean: string;
  romanized: string;
  en: string;
  vi: string;
  note_vi?: string;
};

export type KoreanLesson = {
  id: string;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  sentences: KoreanLessonSentence[];
  grammar_notes_vi: string[];
  practice_tip_vi: string;
};

const KOREAN_LESSONS: KoreanLesson[] = [
  // ================================================================
  // Lesson 1 — Hangul
  // ================================================================
  {
    id: "ko-hangul",
    title_vi: "Bảng chữ Hangeul — học trong 2 giờ",
    title_en: "Hangul — learn to read in 2 hours",
    intro_vi:
      "Hangeul (한글) được vua Sejong tạo ra năm 1443, là một trong những bảng chữ cái logic nhất thế giới — thiết kế để 'người thông minh học trong một buổi sáng, người kém cũng học trong 10 ngày'. 24 ký tự cơ bản (14 phụ âm + 10 nguyên âm). Hình dáng phụ âm mô phỏng vị trí lưỡi/môi khi phát âm — cực kỳ trực quan cho người Việt.",
    sentences: [
      {
        korean: "ㄱ",
        romanized: "g/k",
        en: "g/k — tongue against soft palate",
        vi: "g/k — lưỡi chạm vòm mềm",
        note_vi: "Hình chữ ㄱ mô phỏng lưỡi cong lên chạm vòm. Đầu từ đọc 'k' nhẹ, giữa từ đọc 'g'.",
      },
      {
        korean: "ㄴ",
        romanized: "n",
        en: "n — tongue tip on upper teeth",
        vi: "n — đầu lưỡi chạm răng trên",
        note_vi: "Giống 'n' tiếng Việt.",
      },
      {
        korean: "ㄷ",
        romanized: "d/t",
        en: "d/t — tongue on alveolar ridge",
        vi: "d/t — đầu lưỡi chạm lợi trên",
        note_vi: "Đầu từ đọc 't' không bật hơi, giữa từ đọc 'd'. Gần 't'/'đ' tiếng Việt.",
      },
      {
        korean: "ㄹ",
        romanized: "r/l",
        en: "r/l — tongue flap",
        vi: "r/l — lưỡi rung nhẹ",
        note_vi: "Giữa 'r' và 'l'. Đầu từ gần 'l', giữa từ gần 'r' rung nhẹ. VN hay đọc quá nặng thành 'r' rung.",
      },
      {
        korean: "ㅁ",
        romanized: "m",
        en: "m — closed lips",
        vi: "m — môi khép",
        note_vi: "Hình chữ ㅁ là hình vuông = khuôn miệng. Giống 'm' tiếng Việt.",
      },
      {
        korean: "ㅂ",
        romanized: "b/p",
        en: "b/p — closed lips",
        vi: "b/p — môi khép",
        note_vi: "Đầu từ đọc 'p' không bật hơi (gần 'p' Việt), giữa từ đọc 'b'. KHÔNG phải 'b' tiếng Anh.",
      },
      {
        korean: "ㅅ",
        romanized: "s/sh",
        en: "s — tongue behind lower teeth",
        vi: "s/sh — lưỡi sau răng dưới",
        note_vi: "Gần 'x' tiếng Việt nhưng nhẹ hơn. Trước 'i' đọc thành 'sh' nhẹ (시 = shi, không phải 'si').",
      },
      {
        korean: "ㅇ",
        romanized: "ng / silent",
        en: "ng (final) or silent (initial)",
        vi: "ng (cuối) hoặc câm (đầu)",
        note_vi: "Ở vị trí đầu âm tiết: không đọc (= placeholder). Ở cuối: đọc 'ng'. 아 = a, 강 = gang.",
      },
      {
        korean: "ㅈ",
        romanized: "j/ch",
        en: "j — tongue on alveolar ridge",
        vi: "j/ch — đầu lưỡi chạm lợi trên",
        note_vi: "Gần 'ch' tiếng Việt không bật hơi. Đầu từ đọc 'ch', giữa từ đọc 'j'. KHÔNG phải 'gi'.",
      },
      {
        korean: "ㅊ",
        romanized: "ch",
        en: "ch (aspirated)",
        vi: "ch (bật hơi)",
        note_vi: "Giống ㅈ nhưng bật hơi MẠNH. Để tay trước miệng kiểm tra. Phân biệt: 자다 (jada — ngủ) vs 차다 (chada — đá).",
      },
      {
        korean: "ㅋ",
        romanized: "k",
        en: "k (aspirated)",
        vi: "k (bật hơi mạnh)",
        note_vi: "Bật hơi mạnh hơn ㄱ. Phân biệt: 기 (gi — cờ) vs 키 (ki — chiều cao/chìa khóa).",
      },
      {
        korean: "ㅌ",
        romanized: "t",
        en: "t (aspirated)",
        vi: "t (bật hơi mạnh)",
        note_vi: "Bật hơi mạnh hơn ㄷ. Phân biệt: 달 (dal — mặt trăng) vs 탈 (tal — mặt nạ).",
      },
      {
        korean: "ㅍ",
        romanized: "p",
        en: "p (aspirated)",
        vi: "p (bật hơi mạnh)",
        note_vi: "Bật hơi MẠNH. Phân biệt: 발 (bal — chân) vs 팔 (pal — tay/cánh tay).",
      },
      {
        korean: "ㅎ",
        romanized: "h",
        en: "h",
        vi: "h — giống 'h' tiếng Việt",
      },
      {
        korean: "ㄲ ㄸ ㅃ ㅆ ㅉ",
        romanized: "gg/kk dd/tt bb/pp ss jj",
        en: "tense double consonants",
        vi: "Phụ âm đôi căng — cơ miệng căng, không bật hơi",
        note_vi: "KHÓ NHẤT cho người Việt. Cơ lưỡi/môi CĂNG CỨNG, không có hơi bật ra. Phân biệt: 달 (dal) vs 딸 (ttal — con gái).",
      },
    ],
    grammar_notes_vi: [
      "Nguyên âm dọc (ㅏㅑㅓㅕㅣ) đứng bên phải phụ âm đầu. Nguyên âm ngang (ㅗㅛㅜㅠㅡ) đứng dưới phụ âm đầu.",
      "Mỗi khối âm tiết = phụ âm đầu + nguyên âm (+ phụ âm cuối). Cấu trúc giống 'vần' tiếng Việt.",
      "Phân biệt 3 loại phụ âm: thường (ㄱ), bật hơi (ㅋ), căng (ㄲ). Người Việt hay gộp cả 3 thành 1.",
      "Phụ âm cuối (batchim) chỉ có 7 cách đọc dù có nhiều chữ viết khác nhau. Ví dụ: ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ cuối từ đều đọc là 't'.",
    ],
    practice_tip_vi:
      "Học 8 nguyên âm cơ bản trước (ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ), rồi ghép với phụ âm ㅇ câm: 아, 야, 어, 여... Sau đó học 14 phụ âm, ghép thành âm tiết. Dùng app 'Write It! Korean' để tập viết.",
  },

  // ================================================================
  // Lesson 2 — Greetings
  // ================================================================
  {
    id: "ko-greetings",
    title_vi: "Chào hỏi và kính ngữ cơ bản",
    title_en: "Greetings and basic honorifics",
    intro_vi:
      "Tiếng Hàn có hệ thống kính ngữ phức tạp bậc nhất thế giới. Cùng một câu 'xin chào' có 7 cách nói tùy người nghe. Nhưng người mới học chỉ cần 2 mức: lịch sự (요 — yo) và trang trọng (습니다/ㅂ니다 — seumnida/bnida). Bài này dạy cách chào hỏi thực tế + quy tắc chọn mức kính ngữ.",
    sentences: [
      {
        korean: "안녕하세요",
        romanized: "annyeonghaseyo",
        en: "Hello (polite — most common)",
        vi: "Xin chào (lịch sự — phổ biến nhất)",
        note_vi: "Dùng được trong 90% tình huống. 안녕 (annyeong) = bình an + 하세요 = hãy làm.",
      },
      {
        korean: "안녕하십니까",
        romanized: "annyeonghasimnikka",
        en: "Hello (most formal)",
        vi: "Xin chào (trang trọng nhất)",
        note_vi: "Dùng trong quân đội, phát biểu, phỏng vấn. ㅂ니까 là đuôi câu hỏi trang trọng nhất.",
      },
      {
        korean: "안녕",
        romanized: "annyeong",
        en: "Hi / Bye (casual)",
        vi: "Chào / Tạm biệt (thân mật)",
        note_vi: "Dùng cho bạn thân, người nhỏ tuổi. ĐỪNG dùng với người lạ hoặc lớn tuổi hơn.",
      },
      {
        korean: "처음 뵙겠습니다",
        romanized: "cheoeum boepgetseumnida",
        en: "Nice to meet you (formal first meeting)",
        vi: "Rất vui được gặp (trang trọng, lần đầu)",
        note_vi: "Dùng khi gặp LẦN ĐẦU trong ngữ cảnh trang trọng. 뵙다 là kính ngữ của 보다 (gặp/thấy).",
      },
      {
        korean: "반갑습니다",
        romanized: "bangapseumnida",
        en: "Nice to meet you (formal)",
        vi: "Rất vui được gặp (trang trọng)",
        note_vi: "반갑다 (bangapda) = vui mừng. Thường dùng sau 처음 뵙겠습니다.",
      },
      {
        korean: "감사합니다",
        romanized: "gamsahamnida",
        en: "Thank you (formal)",
        vi: "Cảm ơn (trang trọng)",
        note_vi: "Dạng phổ biến NHẤT của 'cảm ơn'. Dùng được trong mọi tình huống.",
      },
      {
        korean: "고마워요",
        romanized: "gomawoyo",
        en: "Thank you (polite-casual)",
        vi: "Cảm ơn (lịch sự thân mật)",
        note_vi: "Nhẹ hơn 감사합니다. Dùng với đồng nghiệp, bạn bè không thân lắm.",
      },
      {
        korean: "죄송합니다",
        romanized: "joesonghamnida",
        en: "I'm sorry (formal)",
        vi: "Xin lỗi (trang trọng)",
        note_vi: "Dùng khi mình có lỗi nghiêm trọng hoặc trong môi trường công sở.",
      },
      {
        korean: "미안해요",
        romanized: "mianhaeyo",
        en: "I'm sorry (polite-casual)",
        vi: "Xin lỗi (lịch sự)",
        note_vi: "Nhẹ hơn 죄송합니다. Dùng với bạn bè, lỗi nhỏ.",
      },
      {
        korean: "안녕히 가세요",
        romanized: "annyeonghi gaseyo",
        en: "Goodbye (to someone leaving)",
        vi: "Tạm biệt (nói với người đi)",
        note_vi: "가다 = đi. Người Ở LẠI nói câu này với người ĐI.",
      },
      {
        korean: "안녕히 계세요",
        romanized: "annyeonghi gyeseyo",
        en: "Goodbye (to someone staying)",
        vi: "Tạm biệt (nói với người ở lại)",
        note_vi: "계시다 = ở (kính ngữ của 있다). Người ĐI nói câu này với người Ở LẠI.",
      },
      {
        korean: "잘 먹겠습니다",
        romanized: "jal meokgetseumnida",
        en: "I will eat well (before meal)",
        vi: "Con/em sẽ ăn ngon ạ (trước bữa ăn)",
        note_vi: "BẮT BUỘC nói trước khi ăn, đặc biệt khi ăn cùng người lớn tuổi. Thể hiện lòng biết ơn.",
      },
      {
        korean: "잘 먹었습니다",
        romanized: "jal meogeotseumnida",
        en: "I ate well (after meal)",
        vi: "Con/em đã ăn ngon ạ (sau bữa ăn)",
        note_vi: "Nói sau khi ăn xong để cảm ơn người nấu/trả tiền.",
      },
      {
        korean: "이름이 뭐예요?",
        romanized: "ireumi mwoyeyo?",
        en: "What's your name?",
        vi: "Tên bạn là gì?",
        note_vi: "뭐 (mwo) = cái gì. 예요 (yeyo) = là (đuôi lịch sự).",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc chọn mức kính ngữ: (1) Người lạ + lớn tuổi + sếp → 합/습니다. (2) Người quen + đồng nghiệp + người lạ trẻ → 아/어요. (3) Bạn thân + trẻ em → dạng thường.",
      "Khi không chắc dùng mức nào: LUÔN dùng dạng lịch sự cao hơn. Bị coi là quá lịch sự tốt hơn bị coi là thô lỗ.",
      "Có 2 cách nói 'tạm biệt' tùy người đi/ở — đây là điểm độc đáo của tiếng Hàn.",
      "Kính ngữ không chỉ ở đuôi câu mà còn ở từ vựng: 있다 → 계시다 (ở), 먹다 → 드시다 (ăn — kính ngữ), 자다 → 주무시다 (ngủ — kính ngữ).",
    ],
    practice_tip_vi:
      "Tập 4 câu cốt lõi mỗi sáng trước gương: 안녕하세요 → 감사합니다 → 죄송합니다 → 안녕히 계세요/가세요. Sau đó tập phân biệt người đi/ở bằng cách tưởng tượng mình ở cửa tiễn khách.",
  },

  // ================================================================
  // Lesson 3 — Numbers
  // ================================================================
  {
    id: "ko-numbers",
    title_vi: "Hai hệ số đếm và cách dùng",
    title_en: "Two number systems and when to use each",
    intro_vi:
      "Tiếng Hàn có HAI hệ số đếm chạy song song: Sino-Korean (gốc Hán — 일이삼) và Native Korean (thuần Hàn — 하나둘셋). Mỗi hệ dùng cho mục đích khác nhau: Sino cho tiền, phút, số điện thoại, địa chỉ; Native cho tuổi, giờ, đếm đồ vật. Dùng sai hệ là nói sai — bài này dạy cách phân biệt.",
    sentences: [
      {
        korean: "하나, 둘, 셋, 넷, 다섯",
        romanized: "hana, dul, set, net, daseot",
        en: "1, 2, 3, 4, 5 (Native Korean)",
        vi: "một, hai, ba, bốn, năm (thuần Hàn)",
        note_vi: "Dùng để đếm tuổi, giờ, đồ vật. Khi đếm với counter: 하나 → 한, 둘 → 두, 셋 → 세, 넷 → 네.",
      },
      {
        korean: "여섯, 일곱, 여덟, 아홉, 열",
        romanized: "yeoseot, ilgop, yeodeol, ahop, yeol",
        en: "6, 7, 8, 9, 10 (Native Korean)",
        vi: "sáu, bảy, tám, chín, mười (thuần Hàn)",
        note_vi: "여덟 (8) phát âm là 'yeo-deol' — ㄼ cuối đọc là 'l'.",
      },
      {
        korean: "일, 이, 삼, 사, 오",
        romanized: "il, i, sam, sa, o",
        en: "1, 2, 3, 4, 5 (Sino-Korean)",
        vi: "một, hai, ba, bốn, năm (Hán-Hàn)",
        note_vi: "Dùng cho tiền, phút, số điện thoại, ngày tháng, toán học. Đây là hệ số nhiều hơn trong đời sống.",
      },
      {
        korean: "육, 칠, 팔, 구, 십",
        romanized: "yuk, chil, pal, gu, sip",
        en: "6, 7, 8, 9, 10 (Sino-Korean)",
        vi: "sáu, bảy, tám, chín, mười (Hán-Hàn)",
      },
      {
        korean: "열하나, 스물, 서른",
        romanized: "yeolhana, seumul, seoreun",
        en: "11, 20, 30 (Native Korean)",
        vi: "mười một, hai mươi, ba mươi (thuần Hàn)",
        note_vi: "Native Korean có tên riêng cho 20, 30, 40, 50... đến 90. Không ghép như Sino.",
      },
      {
        korean: "이십, 삼십, 사십",
        romanized: "isip, samsip, sasip",
        en: "20, 30, 40 (Sino-Korean)",
        vi: "hai mươi, ba mươi, bốn mươi (Hán-Hàn)",
        note_vi: "Hệ Sino ghép logic: 2×10, 3×10, 4×10... Dễ hơn Native.",
      },
      {
        korean: "몇 살이에요?",
        romanized: "myeot sarieyo?",
        en: "How old are you?",
        vi: "Bạn bao nhiêu tuổi?",
        note_vi: "Trả lời dùng Native Korean: 스물다섯 살이에요 (tôi 25 tuổi).",
      },
      {
        korean: "몇 시예요?",
        romanized: "myeot siyeyo?",
        en: "What time is it?",
        vi: "Mấy giờ rồi?",
        note_vi: "Giờ dùng Native, PHÚT dùng Sino: 세 시 십분 (3 giờ 10 phút). Đây là sự kết hợp hai hệ.",
      },
      {
        korean: "얼마예요?",
        romanized: "eolmayeyo?",
        en: "How much is it?",
        vi: "Bao nhiêu tiền?",
        note_vi: "Trả lời dùng Sino-Korean: 오천 원이에요 (5,000 won).",
      },
      {
        korean: "한 개 주세요",
        romanized: "han gae juseyo",
        en: "Please give me one.",
        vi: "Cho tôi một cái ạ.",
        note_vi: "개 (gae) là counter chung cho đồ vật. 한 = 하나 rút gọn. 주세요 = hãy cho tôi.",
      },
      {
        korean: "두 명이에요",
        romanized: "du myeongieyo",
        en: "There are two people.",
        vi: "Có hai người ạ.",
        note_vi: "명 (myeong) = counter cho người. 둘 → 두. Dùng khi vào nhà hàng: '두 명이에요' (2 người ạ).",
      },
      {
        korean: "세 병 주세요",
        romanized: "se byeong juseyo",
        en: "Please give me three bottles.",
        vi: "Cho tôi ba chai ạ.",
        note_vi: "병 (byeong) = counter cho chai. 셋 → 세.",
      },
      {
        korean: "전화번호가 뭐예요?",
        romanized: "jeonhwabeonhoga mwoyeyo?",
        en: "What's your phone number?",
        vi: "Số điện thoại của bạn là gì?",
        note_vi: "Số điện thoại LUÔN dùng Sino-Korean: 공일공-일이삼사-오육칠팔 (010-1234-5678).",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc chọn hệ số: Native Korean = đếm đồ vật + tuổi + giờ. Sino-Korean = tiền + phút + số điện thoại + ngày tháng + toán.",
      "Native Korean 1-4 rút gọn khi đứng trước counter: 하나→한, 둘→두, 셋→세, 넷→네.",
      "Native Korean có tên riêng cho các số chục: 20=스물, 30=서른, 40=마흔, 50=쉰... đến 90=아흔. Không ghép.",
      "GIỜ dùng Native + PHÚT dùng Sino: 한 시 삼십 분 (1:30). Đây là một trong những điểm khó nhất cho người mới học.",
      "Số 0 trong số điện thoại đọc là 공 (gong), không phải 영 (yeong) hay 제로 (jero).",
    ],
    practice_tip_vi:
      "Học thuộc Native Korean 1-10 như bài hát. Sau đó tập nói giờ: 지금 ___ 시 ___ 분이에요 (bây giờ là ___ giờ ___ phút). Cuối cùng tập mua đồ: ___ 개 주세요 (cho tôi ___ cái).",
  },

  // ================================================================
  // Lesson 4 — Particles
  // ================================================================
  {
    id: "ko-particles",
    title_vi: "Trợ từ — bộ khung của câu tiếng Hàn",
    title_en: "Particles — the framework of Korean sentences",
    intro_vi:
      "Giống tiếng Nhật, tiếng Hàn dùng trợ từ (조사 — josa) gắn sau danh từ để chỉ vai trò trong câu. Tiếng Việt dùng trật tự từ (SVO) + giới từ, nhưng tiếng Hàn dùng trợ từ + trật tự SOV. Có ~20 trợ từ, nhưng 5 trợ từ cơ bản trong bài này chiếm ~90% câu hội thoại hằng ngày.",
    sentences: [
      {
        korean: "저는 학생이에요",
        romanized: "jeoneun haksaengieyo",
        en: "I am a student. (topic marker)",
        vi: "Tôi là học sinh. (trợ từ chủ đề)",
        note_vi: "은/는 (eun/neun) = trợ từ chủ đề. 'Nói về tôi thì...' Dùng để giới thiệu, so sánh, nhấn mạnh chủ đề.",
      },
      {
        korean: "제가 할게요",
        romanized: "jega halgeyo",
        en: "I will do it. (subject marker — emphasis on who)",
        vi: "Tôi sẽ làm. (trợ từ chủ ngữ — nhấn AI làm)",
        note_vi: "이/가 (i/ga) = trợ từ chủ ngữ. Nhấn mạnh CHỦ THỂ hành động. Khác 은/는.",
      },
      {
        korean: "밥을 먹어요",
        romanized: "babeul meogeoyo",
        en: "I eat rice / a meal.",
        vi: "Tôi ăn cơm.",
        note_vi: "을/를 (eul/reul) = trợ từ tân ngữ. Đánh dấu thứ bị động từ tác động.",
      },
      {
        korean: "학교에 가요",
        romanized: "hakgyoe gayo",
        en: "I go to school.",
        vi: "Tôi đến trường.",
        note_vi: "에 (e) = trợ từ chỉ đích đến hoặc thời điểm. 'ĐẾN trường', 'VÀO lúc 3 giờ'.",
      },
      {
        korean: "도서관에서 공부해요",
        romanized: "doseogwaneseo gongbuhaeyo",
        en: "I study at the library.",
        vi: "Tôi học ở thư viện.",
        note_vi: "에서 (eseo) = trợ từ chỉ nơi hành động XẢY RA. Phân biệt với 에 (đích đến).",
      },
      {
        korean: "한국에서 왔어요",
        romanized: "hangugeseo wasseoyo",
        en: "I came from Korea.",
        vi: "Tôi đến từ Hàn Quốc.",
        note_vi: "에서 còn chỉ NGUỒN GỐC/XUẤT PHÁT. 'TỪ Hàn Quốc đến'.",
      },
      {
        korean: "친구하고 영화 봐요",
        romanized: "chinguhago yeonghwa bwayo",
        en: "I watch a movie with a friend.",
        vi: "Tôi xem phim với bạn.",
        note_vi: "하고 (hago) = 'với/và' (khẩu ngữ). Còn có 와/과 (wa/gwa — văn viết), (이)랑 (irang — thân mật).",
      },
      {
        korean: "이거는 뭐예요?",
        romanized: "igeoneun mwoyeyo?",
        en: "What is this?",
        vi: "Cái này là gì?",
        note_vi: "이거 (igeo) = cái này. 는 gắn vào để làm chủ đề câu hỏi.",
      },
      {
        korean: "저도 좋아요",
        romanized: "jeodo joayo",
        en: "I like it too / Me too.",
        vi: "Tôi cũng thích.",
        note_vi: "도 (do) = 'cũng'. Thay thế 은/는 hoặc 이/가. Cực kỳ phổ biến.",
      },
      {
        korean: "커피나 차 주세요",
        romanized: "keopina cha juseyo",
        en: "Please give me coffee or tea.",
        vi: "Cho tôi cà phê hoặc trà ạ.",
        note_vi: "(이)나 (ina/na) = 'hoặc'. Dùng để liệt kê lựa chọn.",
      },
      {
        korean: "친구의 책",
        romanized: "chinguui chaek",
        en: "friend's book",
        vi: "sách của bạn",
        note_vi: "의 (ui) = trợ từ sở hữu 'của'. Trong khẩu ngữ thường đọc thành '에' (e).",
      },
      {
        korean: "한국부터 베트남까지",
        romanized: "hangukbuteo beteunamkkaji",
        en: "from Korea to Vietnam",
        vi: "từ Hàn Quốc đến Việt Nam",
        note_vi: "부터 (buteo) = từ (thời gian/không gian), 까지 (kkaji) = đến. Cặp từ này luôn đi cùng nhau.",
      },
    ],
    grammar_notes_vi: [
      "은/는 vs 이/가: Cặp khó NHẤT trong tiếng Hàn. Quy tắc đơn giản: 은/는 = 'nói về...', 이/가 = 'ai/cái gì làm...'. Câu hỏi 'ai?' dùng 이/가, câu trả lời cũng dùng 이/가.",
      "Cách chọn biến thể: có patchim (phụ âm cuối) → dùng 은, 이, 을. Không có patchim → dùng 는, 가, 를.",
      "Câu tiếng Hàn SOV (chủ-tân-động): 'Tôi cơm ăn' chứ không phải 'Tôi ăn cơm'. Người Việt hay quên đảo động từ xuống cuối.",
      "Có thể bỏ trợ từ trong khẩu ngữ nếu ngữ cảnh rõ — nhưng người mới học nên dùng đủ để tạo thói quen đúng.",
    ],
    practice_tip_vi:
      "Viết 3 câu mỗi trợ từ, dùng từ vựng đã học. Mẫu: [N]은/는 [N]이에요. [N]을/를 [V]아/어요. [N]에 [V]아/어요. [N]에서 [V]아/어요. Đọc to, kiểm tra xem trợ từ đúng chưa.",
  },

  // ================================================================
  // Lesson 5 — Basic verbs (아/어요 form)
  // ================================================================
  {
    id: "ko-basic-verbs",
    title_vi: "Động từ cơ bản — dạng 아/어요",
    title_en: "Basic verbs — 아/어요 polite form",
    intro_vi:
      "Động từ tiếng Hàn ở dạng từ điển luôn kết thúc bằng -다 (da). Để nói lịch sự hằng ngày, bạn cần chia sang dạng 아/어요 (a/eoyo). Quy tắc chia dựa vào nguyên âm cuối của gốc từ: nếu là ㅏ hoặc ㅗ → 아요, còn lại → 어요. Có một số bất quy tắc — bài này dạy từng bước.",
    sentences: [
      {
        korean: "먹어요",
        romanized: "meogeoyo",
        en: "I eat / Let's eat. (polite)",
        vi: "Tôi ăn / Ăn đi ạ.",
        note_vi: "먹다 (meokda) → gốc 먹. Nguyên âm ㅓ → + 어요 = 먹어요.",
      },
      {
        korean: "마셔요",
        romanized: "masyeoyo",
        en: "I drink. (polite)",
        vi: "Tôi uống.",
        note_vi: "마시다 (masida) → gốc 마시. ㅣ + 어요 rút gọn thành ㅕ요 = 마셔요.",
      },
      {
        korean: "가요",
        romanized: "gayo",
        en: "I go. (polite)",
        vi: "Tôi đi.",
        note_vi: "가다 (gada) → gốc 가. Nguyên âm ㅏ → + 아요 rút gọn thành 가요.",
      },
      {
        korean: "와요",
        romanized: "wayo",
        en: "I come. (polite)",
        vi: "Tôi đến.",
        note_vi: "오다 (oda) → gốc 오. Nguyên âm ㅗ → + 아요 rút gọn thành 와요.",
      },
      {
        korean: "해요",
        romanized: "haeyo",
        en: "I do. (polite)",
        vi: "Tôi làm.",
        note_vi: "하다 (hada) → gốc 하. 하 + 여요 = 해요. Đây là dạng đặc biệt, cực phổ biến.",
      },
      {
        korean: "봐요",
        romanized: "bwayo",
        en: "I see / I watch. (polite)",
        vi: "Tôi xem.",
        note_vi: "보다 (boda) → gốc 보. ㅗ + 아요 rút gọn thành 봐요.",
      },
      {
        korean: "들어요",
        romanized: "deureoyo",
        en: "I listen. (polite)",
        vi: "Tôi nghe.",
        note_vi: "듣다 (deutda) → gốc 듣. BẤT QUY TẮC ㄷ: ㄷ → ㄹ trước nguyên âm. 듣 + 어요 = 들어요.",
      },
      {
        korean: "말해요",
        romanized: "malhaeyo",
        en: "I speak. (polite)",
        vi: "Tôi nói.",
        note_vi: "말하다 (malhada) = 말 + 하다. Chia như 하다: 말해요.",
      },
      {
        korean: "읽어요",
        romanized: "ilgeoyo",
        en: "I read. (polite)",
        vi: "Tôi đọc.",
        note_vi: "읽다 (ikda) → gốc 읽. ㄺ cuối đọc là 'k', nhưng khi gặp nguyên âm → 읽어요 đọc là 'il-geo-yo'.",
      },
      {
        korean: "써요",
        romanized: "sseoyo",
        en: "I write. (polite)",
        vi: "Tôi viết.",
        note_vi: "쓰다 (sseuda) → gốc 쓰. ㅡ + 어요 rút gọn: xóa ㅡ, lấy nguyên âm trước đó quyết định.",
      },
      {
        korean: "사요",
        romanized: "sayo",
        en: "I buy. (polite)",
        vi: "Tôi mua.",
        note_vi: "사다 (sada) → gốc 사. ㅏ + 아요 = 사요.",
      },
      {
        korean: "뭐 먹어요?",
        romanized: "mwo meogeoyo?",
        en: "What do you eat?",
        vi: "Bạn ăn gì?",
        note_vi: "Câu hỏi với 아/어요: chỉ cần lên giọng cuối câu (như tiếng Việt). Không cần thay đổi đuôi.",
      },
      {
        korean: "안 먹어요",
        romanized: "an meogeoyo",
        en: "I don't eat.",
        vi: "Tôi không ăn.",
        note_vi: "Phủ định ngắn: 안 + động từ. Phủ định dài: 지 않다 → 먹지 않아요.",
      },
      {
        korean: "먹었어요",
        romanized: "meogeosseoyo",
        en: "I ate. (past)",
        vi: "Tôi đã ăn.",
        note_vi: "Quá khứ: gốc + 았/었 + 어요. 먹 + 었 + 어요 = 먹었어요.",
      },
      {
        korean: "뭐 하고 싶어요?",
        romanized: "mwo hago sipeoyo?",
        en: "What do you want to do?",
        vi: "Bạn muốn làm gì?",
        note_vi: "고 싶다 (go sipda) = muốn làm gì. Gắn vào gốc động từ: 가고 싶어요 (muốn đi), 먹고 싶어요 (muốn ăn).",
      },
    ],
    grammar_notes_vi: [
      "Quy tắc chọn 아요 vs 어요: nguyên âm CUỐI của gốc là ㅏ hoặc ㅗ → 아요. Còn lại → 어요.",
      "하다 luôn → 해요 (không phải '하요'). Đây là ngoại lệ phổ biến nhất — hàng trăm động từ kết thúc bằng 하다.",
      "Bất quy tắc ㄷ: 듣다→들어요, 걷다→걸어요 (đi bộ). Chỉ một số động từ có ㄷ bất quy tắc — không phải tất cả.",
      "Bất quy tắc ㅂ: 춥다→추워요 (lạnh), 덥다→더워요 (nóng). Bỏ ㅂ, thêm 우, rồi chia.",
      "Bất quy tắc ㅡ: 쓰다→써요, 바쁘다→바빠요 (bận). Xóa ㅡ, lấy nguyên âm âm tiết trước quyết định 아/어.",
    ],
    practice_tip_vi:
      "Lấy 10 động từ trong vocabulary, chia 3 dạng: hiện tại (아/어요), quá khứ (았/었어요), phủ định (안 ...). Viết ra giấy, đọc to. Sau đó đặt câu hoàn chỉnh với trợ từ: 저는 ___을/를 ___어요.",
  },

  // ================================================================
  // Lesson 6 — Full honorifics system
  // ================================================================
  {
    id: "ko-honorifics",
    title_vi: "Kính ngữ toàn tập — từ vựng và đuôi câu",
    title_en: "Full honorifics — vocabulary and sentence endings",
    intro_vi:
      "Kính ngữ tiếng Hàn không chỉ ở đuôi câu mà còn ở từ vựng. Cùng một động từ 'ăn' có 3 cách nói: 먹다 (thường), 먹어요/먹습니다 (lịch sự), 드시다/잡수시다 (kính ngữ). Dùng sai mức kính ngữ = thô lỗ. Bài này dạy 10 cặp từ thường vs kính ngữ phổ biến nhất.",
    sentences: [
      {
        korean: "먹다 → 드시다 / 잡수시다",
        romanized: "meokda → deusida / japsusida",
        en: "to eat (plain → honorific)",
        vi: "ăn (thường → kính ngữ)",
        note_vi: "Nói về người LỚN TUỔI ăn: 드세요 (deuseyo) = xin mời ăn.",
      },
      {
        korean: "자다 → 주무시다",
        romanized: "jada → jumusida",
        en: "to sleep (plain → honorific)",
        vi: "ngủ (thường → kính ngữ)",
        note_vi: "안녕히 주무세요 = chúc ngủ ngon (kính ngữ).",
      },
      {
        korean: "있다 → 계시다",
        romanized: "itda → gyesida",
        en: "to be/stay (plain → honorific)",
        vi: "ở (thường → kính ngữ)",
        note_vi: "안녕히 계세요 = tạm biệt người Ở LẠI (lit: 'ở lại bình an').",
      },
      {
        korean: "말하다 → 말씀하시다",
        romanized: "malhada → malsseumhasida",
        en: "to speak (plain → honorific)",
        vi: "nói (thường → kính ngữ)",
        note_vi: "말씀 (malsseum) = lời nói (kính ngữ của 말).",
      },
      {
        korean: "보다 → 뵙다",
        romanized: "boda → boepda",
        en: "to see/meet (plain → honorific)",
        vi: "gặp (thường → kính ngữ)",
        note_vi: "처음 뵙겠습니다 = rất vui được gặp (lần đầu, kính ngữ).",
      },
      {
        korean: "이름 → 성함",
        romanized: "ireum → seongham",
        en: "name (plain → honorific)",
        vi: "tên (thường → kính ngữ)",
        note_vi: "성함이 어떻게 되세요? = tên quý danh là gì ạ?",
      },
      {
        korean: "나이 → 연세",
        romanized: "nai → yeonse",
        en: "age (plain → honorific)",
        vi: "tuổi (thường → kính ngữ)",
        note_vi: "연세가 어떻게 되세요? = ngài bao nhiêu tuổi ạ? (hỏi người lớn tuổi).",
      },
      {
        korean: "생일 → 생신",
        romanized: "saengil → saengsin",
        en: "birthday (plain → honorific)",
        vi: "sinh nhật (thường → kính ngữ)",
        note_vi: "생신 축하드립니다 = chúc mừng sinh nhật (kính ngữ).",
      },
      {
        korean: "밥 → 진지",
        romanized: "bap → jinji",
        en: "meal/rice (plain → honorific)",
        vi: "bữa ăn/cơm (thường → kính ngữ)",
        note_vi: "진지 드셨어요? = ngài đã dùng bữa chưa ạ?",
      },
      {
        korean: "집 → 댁",
        romanized: "jip → daek",
        en: "house/home (plain → honorific)",
        vi: "nhà (thường → kính ngữ)",
        note_vi: "댁이 어디세요? = nhà ngài ở đâu ạ?",
      },
    ],
    grammar_notes_vi: [
      "Kính ngữ chủ ngữ: thêm (으)시 vào gốc động từ. 가다 → 가시다 (ngài đi).",
      "Kính ngữ tân ngữ: dùng từ vựng đặc biệt. 밥 → 진지, 이름 → 성함.",
      "Kính ngữ người nghe: đuôi câu. 아/어요 (lịch sự), 습니다 (trang trọng).",
      "Quy tắc vàng: khi nói VỀ hoặc VỚI người lớn tuổi hơn → luôn dùng kính ngữ.",
    ],
    practice_tip_vi:
      "Lấy 5 câu bình thường về người bạn, viết lại bằng kính ngữ khi nói về giáo sư/sếp. Ví dụ: 친구가 밥을 먹어요 → 교수님이 진지를 드세요.",
  },

  // ================================================================
  // Lesson 7 — Formal vs informal speech levels
  // ================================================================
  {
    id: "ko-formal-vs-informal",
    title_vi: "Mức độ nói — từ 반말 đến 합쇼체",
    title_en: "Speech levels — from banmal to hapsyoche",
    intro_vi:
      "Tiếng Hàn có 7 mức độ nói (speech levels), nhưng người mới học chỉ cần 4 mức chính: 합쇼체 (trang trọng nhất), 해요체 (lịch sự), 해체 (thân mật), và 해라체 (văn viết). Bài này dạy cách chia và khi nào dùng từng mức.",
    sentences: [
      {
        korean: "합니다 / 합니다",
        romanized: "hamnida",
        en: "I do. (formal — 합쇼체)",
        vi: "Tôi làm ạ. (trang trọng)",
        note_vi: "Dùng trong họp hành, phỏng vấn, quân đội, phát biểu.",
      },
      {
        korean: "해요",
        romanized: "haeyo",
        en: "I do. (polite — 해요체)",
        vi: "Tôi làm ạ. (lịch sự)",
        note_vi: "Dùng hằng ngày với người không thân, đồng nghiệp. Mức phổ biến NHẤT.",
      },
      {
        korean: "해",
        romanized: "hae",
        en: "I do. (casual — 해체)",
        vi: "Tôi làm. (thân mật)",
        note_vi: "Dùng với bạn thân, người nhỏ tuổi. Còn gọi là 반말 (banmal).",
      },
      {
        korean: "한다",
        romanized: "handa",
        en: "I do. (plain — 해라체)",
        vi: "Tôi làm. (văn viết / độc thoại)",
        note_vi: "Dùng trong sách, báo, nhật ký. Không dùng để nói chuyện.",
      },
      {
        korean: "안녕하십니까 → 안녕하세요 → 안녕",
        romanized: "annyeonghasimnikka → annyeonghaseyo → annyeong",
        en: "Hello (formal → polite → casual)",
        vi: "Xin chào (trang trọng → lịch sự → thân mật)",
      },
      {
        korean: "감사합니다 → 고마워요 → 고마워",
        romanized: "gamsahamnida → gomawoyo → gomawo",
        en: "Thank you (formal → polite → casual)",
        vi: "Cảm ơn (trang trọng → lịch sự → thân mật)",
      },
      {
        korean: "이름이 뭐니?",
        romanized: "ireumi mwoni?",
        en: "What's your name? (casual to child)",
        vi: "Tên cháu là gì? (nói với trẻ em)",
        note_vi: "Đuôi 니/냐? là câu hỏi casual với trẻ em hoặc bạn rất thân.",
      },
    ],
    grammar_notes_vi: [
      "Dùng SAI mức độ nói là lỗi NGHIÊM TRỌNG NHẤT trong tiếng Hàn. Luôn dùng 해요체 khi không chắc.",
      "Người Hàn thường hỏi tuổi trước khi quyết định dùng mức nào. Đây là lý do '몇 살이에요?' rất phổ biến.",
      "Bạn thân cùng tuổi: dùng 해체 (반말). Nhưng cần ĐƯỢC CHO PHÉP trước — không tự ý hạ mức.",
      "해라체 (dạng văn viết) không bao giờ dùng trong hội thoại trừ khi độc thoại hoặc nói với trẻ rất nhỏ.",
    ],
    practice_tip_vi:
      "Viết cùng 1 câu 'Tôi ăn cơm' bằng 4 mức: 합니다, 해요, 해, 한다. Đọc to, cảm nhận sự khác biệt về mức độ trang trọng.",
  },

  // ================================================================
  // Lesson 8 — Counter words
  // ================================================================
  {
    id: "ko-counter-words",
    title_vi: "Trợ từ đếm — 개/명/병/장/마리",
    title_en: "Counter words — gae/myeong/byeong/jang/mari",
    intro_vi:
      "Giống tiếng Nhật và tiếng Trung, tiếng Hàn dùng counter words khi đếm đồ vật. Dùng sai counter là nói sai — nhưng may mắn là số lượng counter cần học ít hơn tiếng Nhật. Bài này dạy 8 counter phổ biến nhất.",
    sentences: [
      {
        korean: "한 개, 두 개, 세 개",
        romanized: "han gae, du gae, se gae",
        en: "1 thing, 2 things, 3 things (general counter)",
        vi: "một cái, hai cái, ba cái",
        note_vi: "개 (gae) là counter CHUNG cho đồ vật — dùng được khi không biết counter riêng.",
      },
      {
        korean: "한 명, 두 명, 세 명",
        romanized: "han myeong, du myeong, se myeong",
        en: "1 person, 2 people, 3 people",
        vi: "một người, hai người, ba người",
        note_vi: "명 (myeong) = người. Trang trọng: 분 (bun).",
      },
      {
        korean: "한 병, 두 병, 세 병",
        romanized: "han byeong, du byeong, se byeong",
        en: "1 bottle, 2 bottles, 3 bottles",
        vi: "một chai, hai chai, ba chai",
        note_vi: "소주 한 병 주세요 = cho tôi một chai soju ạ.",
      },
      {
        korean: "한 잔, 두 잔, 세 잔",
        romanized: "han jan, du jan, se jan",
        en: "1 cup/glass, 2 cups, 3 cups",
        vi: "một cốc/ly, hai cốc, ba cốc",
      },
      {
        korean: "한 장, 두 장, 세 장",
        romanized: "han jang, du jang, se jang",
        en: "1 sheet/page, 2 sheets (flat things)",
        vi: "một tờ/trang, hai tờ (vật phẳng)",
        note_vi: "종이 한 장 = một tờ giấy. 표 한 장 = một vé.",
      },
      {
        korean: "한 마리, 두 마리, 세 마리",
        romanized: "han mari, du mari, se mari",
        en: "1 animal, 2 animals, 3 animals",
        vi: "một con, hai con, ba con",
        note_vi: "Dùng cho động vật: 고양이 한 마리 = một con mèo.",
      },
      {
        korean: "한 권, 두 권, 세 권",
        romanized: "han gwon, du gwon, se gwon",
        en: "1 book/volume, 2 books",
        vi: "một quyển, hai quyển (sách/vở)",
        note_vi: "책 한 권 = một quyển sách.",
      },
      {
        korean: "한 벌, 두 벌, 세 벌",
        romanized: "han beol, du beol, se beol",
        en: "1 set of clothes, 2 sets",
        vi: "một bộ, hai bộ (quần áo)",
        note_vi: "옷 한 벌 = một bộ quần áo.",
      },
    ],
    grammar_notes_vi: [
      "Cấu trúc: DANH TỪ + SỐ (Native) + COUNTER. Hoặc: SỐ + COUNTER + 의 + DANH TỪ.",
      "Số dùng với counter là Native Korean (한, 두, 세...). KHÔNG dùng Sino-Korean.",
      "Số 1-4 + một số counter rút gọn: 하나→한, 둘→두, 셋→세, 넷→네, 스물→스무.",
      "Khi không biết counter nào: dùng 개. Người Hàn vẫn hiểu và đánh giá cao nỗ lực.",
    ],
    practice_tip_vi:
      "Đếm 10 đồ vật trong phòng bằng tiếng Hàn với counter đúng: sách (권), bút (자루), giấy (장), chai nước (병). Làm 3 phút/ngày.",
  },

  // ================================================================
  // Lesson 9 — Descriptive verbs (adjectives)
  // ================================================================
  {
    id: "ko-adjectives",
    title_vi: "Tính từ — động từ miêu tả trong tiếng Hàn",
    title_en: "Adjectives — descriptive verbs in Korean",
    intro_vi:
      "Trong tiếng Hàn, 'tính từ' thực chất là ĐỘNG TỪ MIÊU TẢ (형용사). Chúng chia thì như động từ! 'Đẹp' không phải là một từ cố định mà là 'đẹp + thì + mức độ'. Bài này dạy cách chia tính từ ở hiện tại, quá khứ, và cách dùng chúng để bổ nghĩa danh từ.",
    sentences: [
      {
        korean: "예뻐요",
        romanized: "yeppeoyo",
        en: "It's pretty.",
        vi: "Đẹp ạ.",
        note_vi: "예쁘다 → gốc 예쁘. ㅡ bất quy tắc: xóa ㅡ, lấy âm trước quyết định: 예 → 예뻐요.",
      },
      {
        korean: "예뻤어요",
        romanized: "yeppeosseoyo",
        en: "It was pretty.",
        vi: "Nó đã đẹp.",
        note_vi: "Quá khứ: gốc + 았/었 + 어요.",
      },
      {
        korean: "예쁜 꽃",
        romanized: "yeppeun kkot",
        en: "a pretty flower",
        vi: "bông hoa đẹp",
        note_vi: "Bổ nghĩa danh từ: gốc + ㄴ/은. Có patchim → 은, không patchim → ㄴ.",
      },
      {
        korean: "날씨가 좋아요",
        romanized: "nalssiga joayo",
        en: "The weather is good.",
        vi: "Thời tiết đẹp.",
        note_vi: "좋다 → 좋 + 아요 (ㅗ + 아요) = 좋아요. Rút gọn tự nhiên.",
      },
      {
        korean: "날씨가 안 좋아요",
        romanized: "nalssiga an joayo",
        en: "The weather is not good.",
        vi: "Thời tiết không đẹp.",
        note_vi: "Phủ định tính từ: 안 + tính từ.",
      },
      {
        korean: "추워요 / 더워요",
        romanized: "chuwoyo / deowoyo",
        en: "It's cold / It's hot.",
        vi: "Lạnh ạ / Nóng ạ.",
        note_vi: "ㅂ bất quy tắc: 춥다→추워요, 덥다→더워요.",
      },
      {
        korean: "바빠요",
        romanized: "bappayo",
        en: "I'm busy.",
        vi: "Tôi bận.",
        note_vi: "바쁘다 → ㅡ bất quy tắc: 바빠요.",
      },
      {
        korean: "맛있어요 / 맛없어요",
        romanized: "masisseoyo / madeopseoyo",
        en: "It's delicious / It's not tasty.",
        vi: "Ngon ạ / Không ngon ạ.",
        note_vi: "있다/없다 làm tính từ ghép. 맛 (vị) + 있다 (có) = ngon.",
      },
    ],
    grammar_notes_vi: [
      "Tính từ tiếng Hàn CHIA THÌ như động từ. Không như tiếng Việt hay tiếng Anh.",
      "Bổ nghĩa danh từ: gốc + (으)ㄴ. Khác với động từ bổ nghĩa dùng 는.",
      "Phủ định tính từ: 안 + tính từ (ngắn) hoặc 지 않다 (dài).",
      "Tính từ 있다/없다 không dùng 안 mà dùng -지 않다: 맛있지 않아요.",
    ],
    practice_tip_vi:
      "Lấy 5 tính từ trong vocabulary. Chia: hiện tại, quá khứ, bổ nghĩa danh từ, phủ định. Viết ra giấy. Đọc to.",
  },

  // ================================================================
  // Lesson 10 — Time and dates
  // ================================================================
  {
    id: "ko-telling-time",
    title_vi: "Giờ giấc và ngày tháng",
    title_en: "Telling time and dates",
    intro_vi:
      "Nói giờ trong tiếng Hàn là sự KẾT HỢP của hai hệ số: giờ dùng Native Korean, phút dùng Sino-Korean. Đây là điểm độc đáo và cũng là điểm dễ sai nhất. Bài này dạy cách nói giờ, phút, ngày, tháng, và thứ trong tuần.",
    sentences: [
      {
        korean: "몇 시예요?",
        romanized: "myeot siyeyo?",
        en: "What time is it?",
        vi: "Mấy giờ rồi ạ?",
      },
      {
        korean: "세 시예요",
        romanized: "se siyeyo",
        en: "It's 3 o'clock.",
        vi: "3 giờ ạ.",
        note_vi: "Giờ dùng Native Korean: 한 시, 두 시, 세 시, 네 시...",
      },
      {
        korean: "세 시 삼십 분이에요",
        romanized: "se si samsip bunieyo",
        en: "It's 3:30.",
        vi: "3 giờ 30 phút ạ.",
        note_vi: "Giờ (Native) + phút (Sino). 삼십 분 = 30 phút.",
      },
      {
        korean: "세 시 반이에요",
        romanized: "se si banieyo",
        en: "It's 3:30. (half past)",
        vi: "3 giờ rưỡi ạ.",
        note_vi: "반 (ban) = rưỡi. Tiện hơn 삼십 분.",
      },
      {
        korean: "오늘은 무슨 요일이에요?",
        romanized: "oneureun museun yoirieyo?",
        en: "What day is it today?",
        vi: "Hôm nay thứ mấy ạ?",
      },
      {
        korean: "월요일, 화요일, 수요일...",
        romanized: "woryoil, hwayoil, suyoil...",
        en: "Monday, Tuesday, Wednesday...",
        vi: "thứ hai, thứ ba, thứ tư...",
        note_vi: "Các thứ: 월화수목금토일 (nguyệt, hỏa, thủy, mộc, kim, thổ, nhật).",
      },
      {
        korean: "오늘은 며칠이에요?",
        romanized: "oneureun myeochirieyo?",
        en: "What's the date today?",
        vi: "Hôm nay ngày mấy ạ?",
      },
      {
        korean: "사월 일일이에요",
        romanized: "sawol iririeyo",
        en: "It's April 1st.",
        vi: "Ngày 1 tháng 4 ạ.",
        note_vi: "Tháng + ngày đều dùng Sino-Korean: 사월 (tháng 4) + 일일 (ngày 1).",
      },
    ],
    grammar_notes_vi: [
      "GIỜ = Native Korean (한, 두, 세...), PHÚT = Sino-Korean (일, 이, 삼, 십...).",
      "Thứ trong tuần: 월(nguyệt)화(hỏa)수(thủy)목(mộc)금(kim)토(thổ)일(nhật) + 요일.",
      "Tháng: số Sino + 월. Ngày: số Sino + 일. Đơn giản hơn nhiều so với tiếng Nhật!",
      "시간 (sigan) = thời lượng (giờ đồng hồ). 시 (si) = thời điểm (mấy giờ). Phân biệt!",
    ],
    practice_tip_vi:
      "Mỗi ngày 3 lần: nhìn đồng hồ và nói giờ bằng tiếng Hàn. Sáng: 몇 시예요? → 여덟 시 십분이에요 (8:10).",
  },

  // ================================================================
  // Lesson 11 — Directions
  // ================================================================
  {
    id: "ko-directions",
    title_vi: "Hỏi đường và chỉ đường",
    title_en: "Asking and giving directions",
    intro_vi:
      "Hàn Quốc dùng địa chỉ kiểu mới (tên đường + số nhà) và hệ thống navigation cực tốt (Naver Map, Kakao Map). Nhưng hỏi đường bằng miệng vẫn là kỹ năng cần thiết. Bài này dạy từ vựng vị trí và mẫu câu hỏi/chỉ đường.",
    sentences: [
      {
        korean: "지하철역이 어디예요?",
        romanized: "jihacheolyeogi eodiyeyo?",
        en: "Where is the subway station?",
        vi: "Ga tàu điện ngầm ở đâu ạ?",
      },
      {
        korean: "똑바로 가세요",
        romanized: "ttokbaro gaseyo",
        en: "Go straight.",
        vi: "Đi thẳng ạ.",
      },
      {
        korean: "오른쪽으로 가세요",
        romanized: "oreunjjogeuro gaseyo",
        en: "Go right.",
        vi: "Rẽ phải ạ.",
      },
      {
        korean: "왼쪽으로 가세요",
        romanized: "oenjjogeuro gaseyo",
        en: "Go left.",
        vi: "Rẽ trái ạ.",
      },
      {
        korean: "신호등에서 건너세요",
        romanized: "sinhodeungeseo geonneoseyo",
        en: "Cross at the traffic light.",
        vi: "Băng qua ở đèn giao thông ạ.",
      },
      {
        korean: "은행 옆에 있어요",
        romanized: "eunhaeng yeope isseoyo",
        en: "It's next to the bank.",
        vi: "Ở cạnh ngân hàng ạ.",
        note_vi: "옆 (yeop) = bên cạnh. 앞 (ap) = trước. 뒤 (dwi) = sau.",
      },
      {
        korean: "여기서 멀어요?",
        romanized: "yeogiseo meoreoyo?",
        en: "Is it far from here?",
        vi: "Có xa đây không ạ?",
      },
      {
        korean: "걸어서 몇 분이에요?",
        romanized: "georeoseo myeot bunieyo?",
        en: "How many minutes on foot?",
        vi: "Đi bộ mấy phút ạ?",
      },
    ],
    grammar_notes_vi: [
      "Vị trí: 앞 (trước), 뒤 (sau), 옆 (bên cạnh), 건너편 (đối diện), 근처 (gần).",
      "(으)로 = về phía. 왼쪽으로 (về bên trái), 오른쪽으로 (về bên phải).",
      "에서 = tại (nơi hành động). 신호등에서 건너세요 = băng qua TẠI đèn giao thông.",
      "Người Hàn dùng Naver Map thay Google Maps. Học đọc chỉ đường trong app Naver Map.",
    ],
    practice_tip_vi:
      "Mở Kakao Map hoặc Naver Map. Chọn một địa điểm ở Seoul và tập mô tả đường từ ga tàu đến đó bằng tiếng Hàn.",
  },

  // ================================================================
  // Lesson 12 — Shopping
  // ================================================================
  {
    id: "ko-shopping",
    title_vi: "Mua sắm — từ cửa hàng tiện lợi đến chợ",
    title_en: "Shopping — from convenience stores to markets",
    intro_vi:
      "Mua sắm ở Hàn Quốc rất tiện — từ cửa hàng tiện lợi 24/7 đến chợ truyền thống và trung tâm thương mại. Học các mẫu câu cơ bản để hỏi giá, trả tiền, và mặc cả ở chợ.",
    sentences: [
      {
        korean: "이거 얼마예요?",
        romanized: "igeo eolmayeyo?",
        en: "How much is this?",
        vi: "Cái này bao nhiêu tiền ạ?",
      },
      {
        korean: "너무 비싸요!",
        romanized: "neomu bissayo!",
        en: "Too expensive!",
        vi: "Đắt quá!",
      },
      {
        korean: "깎아 주세요",
        romanized: "kkakka juseyo",
        en: "Please give me a discount.",
        vi: "Bớt cho tôi đi ạ.",
        note_vi: "깎다 (kkakda) = cắt/giảm. Ở chợ truyền thống, mặc cả là BÌNH THƯỜNG.",
      },
      {
        korean: "이거 주세요",
        romanized: "igeo juseyo",
        en: "I'll take this, please.",
        vi: "Cho tôi cái này ạ.",
      },
      {
        korean: "카드 돼요?",
        romanized: "kadeu dwaeyo?",
        en: "Can I use a card?",
        vi: "Trả thẻ được không ạ?",
        note_vi: "Ở chợ nhỏ, có thể chỉ nhận tiền mặt. Luôn hỏi trước.",
      },
      {
        korean: "봉투 주세요",
        romanized: "bongtu juseyo",
        en: "A bag, please.",
        vi: "Cho tôi cái túi ạ.",
      },
      {
        korean: "영수증 주세요",
        romanized: "yeongsujeung juseyo",
        en: "Receipt, please.",
        vi: "Cho tôi hóa đơn ạ.",
      },
      {
        korean: "입어 봐도 돼요?",
        romanized: "ibeo bwado dwaeyo?",
        en: "Can I try it on?",
        vi: "Tôi mặc thử được không ạ?",
      },
    ],
    grammar_notes_vi: [
      "주세요 (juseyo) = hãy cho tôi. Câu quan trọng NHẤT khi mua sắm.",
      "아/어도 돼요? = có thể...được không? Xin phép lịch sự.",
      "깎아 주세요 = bớt giá. Chỉ dùng ở chợ, không dùng ở cửa hàng lớn.",
      "한국에서는 봉투가 보통 무료예요 (Ở Hàn, túi thường miễn phí — nhưng đang thay đổi).",
    ],
    practice_tip_vi:
      "Xem video 'shopping in Korea' trên YouTube. Tập 4 câu: 이거 얼마예요? → 깎아 주세요 → 이거 주세요 → 카드 돼요?",
  },

  // ================================================================
  // Lesson 13 — Transport
  // ================================================================
  {
    id: "ko-transport",
    title_vi: "Giao thông — tàu điện ngầm và xe buýt",
    title_en: "Transport — subway and buses",
    intro_vi:
      "Hệ thống giao thông công cộng Hàn Quốc là một trong những hệ thống TỐT NHẤT thế giới — sạch, đúng giờ, phủ khắp. Tàu điện ngầm Seoul có 23 tuyến! Biết mua thẻ T-money và đọc bảng tàu là kỹ năng sống còn.",
    sentences: [
      {
        korean: "지하철역이 어디예요?",
        romanized: "jihacheolyeogi eodiyeyo?",
        en: "Where is the subway station?",
        vi: "Ga tàu điện ngầm ở đâu ạ?",
      },
      {
        korean: "서울역에 가고 싶어요",
        romanized: "seoullyeoge gago sipeoyo",
        en: "I want to go to Seoul Station.",
        vi: "Tôi muốn đi ga Seoul.",
      },
      {
        korean: "몇 호선을 타야 돼요?",
        romanized: "myeot hoseoneul taya dwaeyo?",
        en: "Which line should I take?",
        vi: "Đi tuyến số mấy ạ?",
        note_vi: "호선 (hoseon) = tuyến (tàu). 1호선 = tuyến số 1.",
      },
      {
        korean: "환승해야 돼요?",
        romanized: "hwanseunghaeya dwaeyo?",
        en: "Do I need to transfer?",
        vi: "Có phải chuyển tàu không ạ?",
      },
      {
        korean: "다음 역이 어디예요?",
        romanized: "daeum yeogi eodiyeyo?",
        en: "What's the next station?",
        vi: "Ga tiếp theo là ga nào ạ?",
      },
      {
        korean: "교통카드 있어요?",
        romanized: "gyotongkadeu isseoyo?",
        en: "Do you have a T-money card?",
        vi: "Có thẻ T-money không ạ?",
        note_vi: "T-money = thẻ giao thông. Mua ở cửa hàng tiện lợi hoặc máy bán vé.",
      },
      {
        korean: "버스 정류장이 어디예요?",
        romanized: "beoseu jeongnyujangi eodiyeyo?",
        en: "Where is the bus stop?",
        vi: "Trạm xe buýt ở đâu ạ?",
      },
      {
        korean: "몇 시에 출발해요?",
        romanized: "myeot sie chulbalhaeyo?",
        en: "What time does it depart?",
        vi: "Mấy giờ khởi hành ạ?",
      },
    ],
    grammar_notes_vi: [
      "타다 (tada) = lên xe/tàu. 내리다 (naerida) = xuống xe/tàu.",
      "갈아타다 (garatada) / 환승하다 (hwanseunghada) = chuyển tàu/xe.",
      "T-money: một thẻ dùng cho tàu điện ngầm, xe buýt, taxi, và cả cửa hàng tiện lợi.",
      "Tàu điện ngầm Hàn Quốc có thông báo bằng tiếng Hàn, Anh, Trung, Nhật. Rất thân thiện với người nước ngoài.",
    ],
    practice_tip_vi:
      "Tải app Kakao Metroid (tàu điện ngầm Seoul). Tập tra cứu lộ trình từ ga Hongdae đến ga Gangnam bằng tiếng Hàn.",
  },

  // ================================================================
  // Lesson 14 — At a restaurant
  // ================================================================
  {
    id: "ko-restaurant",
    title_vi: "Đi ăn nhà hàng Hàn Quốc",
    title_en: "At a Korean restaurant",
    intro_vi:
      "Văn hóa ăn uống Hàn Quốc có nhiều quy tắc bất thành văn: người lớn tuổi nhất cầm đũa trước, không cầm bát lên khi ăn, rót rượu bằng hai tay. Bài này dạy cách gọi món và nghi thức bàn ăn.",
    sentences: [
      {
        korean: "메뉴 주세요",
        romanized: "menyu juseyo",
        en: "Menu, please.",
        vi: "Cho tôi thực đơn ạ.",
      },
      {
        korean: "여기요!",
        romanized: "yeogiyo!",
        en: "Excuse me! (calling server)",
        vi: "Ơi! (gọi phục vụ)",
        note_vi: "Ở Hàn, bạn PHẢI gọi to '여기요!' hoặc '저기요!' để gọi phục vụ.",
      },
      {
        korean: "이거 하나 주세요",
        romanized: "igeo hana juseyo",
        en: "One of these, please.",
        vi: "Cho tôi một cái này ạ.",
      },
      {
        korean: "불고기 2인분 주세요",
        romanized: "bulgogi iinbun juseyo",
        en: "Two portions of bulgogi, please.",
        vi: "Cho 2 phần bulgogi ạ.",
        note_vi: "인분 (inbun) = phần ăn (cho người). 2인분 = 2 phần.",
      },
      {
        korean: "안 맵게 해 주세요",
        romanized: "an maepge hae juseyo",
        en: "Please make it not spicy.",
        vi: "Làm không cay giúp em ạ.",
        note_vi: "맵다 (maepda) = cay. Ở Hàn, đồ ăn MẶC ĐỊNH có thể rất cay.",
      },
      {
        korean: "잘 먹겠습니다!",
        romanized: "jal meokgetseumnida!",
        en: "I will eat well! (before meal)",
        vi: "Con/em sẽ ăn ngon ạ! (trước bữa ăn)",
        note_vi: "BẮT BUỘC nói trước khi ăn với người lớn tuổi.",
      },
      {
        korean: "잘 먹었습니다!",
        romanized: "jal meogeotseumnida!",
        en: "I ate well! (after meal)",
        vi: "Con/em đã ăn ngon ạ! (sau bữa ăn)",
      },
      {
        korean: "계산해 주세요",
        romanized: "gyesanhae juseyo",
        en: "Check, please.",
        vi: "Tính tiền giúp em ạ.",
        note_vi: "Ở Hàn, bạn thường thanh toán ở QUẦY, không phải ở bàn.",
      },
      {
        korean: "물 좀 더 주세요",
        romanized: "mul jom deo juseyo",
        en: "More water, please.",
        vi: "Cho thêm nước ạ.",
        note_vi: "Nước LỌC MIỄN PHÍ ở mọi nhà hàng Hàn. Tự phục vụ ở góc.",
      },
    ],
    grammar_notes_vi: [
      "반찬 (banchan) = món phụ. Luôn được phục vụ MIỄN PHÍ và có thể gọi thêm không giới hạn.",
      "Không TIP ở Hàn Quốc. Tip có thể bị từ chối hoặc coi là bất lịch sự.",
      "Người lớn tuổi nhất cầm đũa TRƯỚC. Đợi họ bắt đầu rồi mình mới ăn.",
      "KHÔNG cầm bát cơm lên miệng (khác Việt Nam). Để bát trên bàn, dùng đũa/thìa.",
    ],
    practice_tip_vi:
      "Lần tới đi nhà hàng Hàn, gọi món bằng tiếng Hàn. Bắt đầu với 3 câu: 여기요! → 이거 하나 주세요 → 계산해 주세요.",
  },

  // ================================================================
  // Lesson 15 — Family
  // ================================================================
  {
    id: "ko-family",
    title_vi: "Gia đình — cách gọi phức tạp của người Hàn",
    title_en: "Family — complex Korean kinship terms",
    intro_vi:
      "Hệ thống xưng hô gia đình Hàn Quốc rất chi tiết — phân biệt bên nội/bên ngoại, tuổi tác, giới tính, và cả tình trạng hôn nhân. Bài này dạy 15 từ xưng hô gia đình cơ bản nhất.",
    sentences: [
      {
        korean: "아버지 / 아빠",
        romanized: "abeoji / appa",
        en: "father / dad",
        vi: "bố / ba",
        note_vi: "아버지 = trang trọng. 아빠 = thân mật. Gọi bố người khác: 아버님.",
      },
      {
        korean: "어머니 / 엄마",
        romanized: "eomeoni / eomma",
        en: "mother / mom",
        vi: "mẹ / má",
        note_vi: "어머니 = trang trọng. 엄마 = thân mật. Gọi mẹ người khác: 어머님.",
      },
      {
        korean: "오빠 / 형",
        romanized: "oppa / hyeong",
        en: "older brother (to female / to male speaker)",
        vi: "anh trai (nữ gọi / nam gọi)",
        note_vi: "NỮ gọi anh trai: 오빠. NAM gọi anh trai: 형. Đây là phân biệt QUAN TRỌNG.",
      },
      {
        korean: "언니 / 누나",
        romanized: "eonni / nuna",
        en: "older sister (to female / to male speaker)",
        vi: "chị gái (nữ gọi / nam gọi)",
        note_vi: "NỮ gọi chị: 언니. NAM gọi chị: 누나.",
      },
      {
        korean: "동생",
        romanized: "dongsaeng",
        en: "younger sibling (both genders)",
        vi: "em (cả trai và gái)",
        note_vi: "Không phân biệt giới tính người nói. 남동생 = em trai, 여동생 = em gái.",
      },
      {
        korean: "할아버지 / 할머니",
        romanized: "harabeoji / halmeoni",
        en: "grandfather / grandmother",
        vi: "ông / bà",
      },
      {
        korean: "가족이 몇 명이에요?",
        romanized: "gajogi myeot myeongieyo?",
        en: "How many people in your family?",
        vi: "Gia đình có mấy người ạ?",
      },
      {
        korean: "네 명이에요",
        romanized: "ne myeongieyo",
        en: "There are four of us.",
        vi: "Có 4 người ạ.",
      },
    ],
    grammar_notes_vi: [
      "Phân biệt GIỚI TÍNH NGƯỜI NÓI: 오빠/형, 언니/누나. Đây là điểm ĐỘC ĐÁO của tiếng Hàn.",
      "Gọi người thân trong gia đình NGƯỜI KHÁC: thêm 님 (nim). 아버지 → 아버님.",
      "Người Hàn hay hỏi về gia đình — đây là cách thể hiện sự quan tâm, không phải tò mò.",
      "Nói về gia đình MÌNH với người ngoài: dùng 저희 (jeohui — chúng tôi, khiêm nhường) thay vì 우리 (uri).",
    ],
    practice_tip_vi:
      "Vẽ sơ đồ gia đình bằng tiếng Hàn. Ghi rõ: bạn là nam hay nữ, cách gọi từng người. Tập giới thiệu: 우리 가족은 ___ 명이에요. 아버지, 어머니, 오빠가 있어요.",
  },

  // ================================================================
  // Lesson 16 — Weather and seasons
  // ================================================================
  {
    id: "ko-weather",
    title_vi: "Thời tiết và 4 mùa Hàn Quốc",
    title_en: "Weather and Korean seasons",
    intro_vi:
      "Hàn Quốc có 4 mùa RÕ RỆT — mỗi mùa có vẻ đẹp và từ vựng riêng. Mùa xuân hoa anh đào, mùa hè nóng ẩm, mùa thu lá đỏ, mùa đông tuyết trắng. Thời tiết là chủ đề small talk số 1 ở Hàn.",
    sentences: [
      {
        korean: "오늘 날씨가 어때요?",
        romanized: "oneul nalssiga eottaeyo?",
        en: "How's the weather today?",
        vi: "Hôm nay thời tiết thế nào ạ?",
      },
      {
        korean: "날씨가 좋아요",
        romanized: "nalssiga joayo",
        en: "The weather is good.",
        vi: "Thời tiết đẹp ạ.",
      },
      {
        korean: "오늘 너무 더워요",
        romanized: "oneul neomu deowoyo",
        en: "It's too hot today.",
        vi: "Hôm nay nóng quá.",
      },
      {
        korean: "오늘 너무 추워요",
        romanized: "oneul neomu chuwoyo",
        en: "It's too cold today.",
        vi: "Hôm nay lạnh quá.",
      },
      {
        korean: "비가 와요",
        romanized: "biga wayo",
        en: "It's raining.",
        vi: "Trời đang mưa.",
        note_vi: "비 (bi) = mưa + 오다 (oda) = đến. 비가 와요 = mưa đến.",
      },
      {
        korean: "눈이 와요",
        romanized: "nuni wayo",
        en: "It's snowing.",
        vi: "Tuyết đang rơi.",
      },
      {
        korean: "봄, 여름, 가을, 겨울",
        romanized: "bom, yeoreum, gaeul, gyeoul",
        en: "spring, summer, autumn, winter",
        vi: "xuân, hè, thu, đông",
        note_vi: "봄에 (vào mùa xuân), 여름에 (vào mùa hè), 가을에, 겨울에.",
      },
      {
        korean: "미세먼지가 심해요",
        romanized: "misemeonjiga simhaeyo",
        en: "The fine dust is severe.",
        vi: "Bụi mịn nặng quá.",
        note_vi: "미세먼지 (fine dust) là chủ đề QUAN TRỌNG ở Hàn — kiểm tra mask KF94 khi bụi nặng.",
      },
    ],
    grammar_notes_vi: [
      "Nhiệt độ: dùng số Sino: 영하 5도 (-5°C), 25도 (25°C).",
      "미세먼지 (fine dust): Hàn Quốc có app riêng kiểm tra mức bụi. Mức >80 là đeo mask.",
      "So sánh thời tiết với Việt Nam là cách mở chuyện tuyệt vời với người Hàn.",
    ],
    practice_tip_vi:
      "Kiểm tra thời tiết Seoul mỗi sáng (weather.naver.com) và nói bằng tiếng Hàn. Dùng app 'Misemise' để kiểm tra 미세먼지.",
  },

  // ================================================================
  // Lesson 17 — Body and health
  // ================================================================
  {
    id: "ko-health",
    title_vi: "Cơ thể và sức khỏe — đi khám bệnh ở Hàn",
    title_en: "Body and health — seeing a doctor in Korea",
    intro_vi:
      "Biết mô tả triệu chứng bằng tiếng Hàn là KỸ NĂNG SINH TỒN. Hệ thống y tế Hàn Quốc rất tốt nhưng bác sĩ có thể không nói tiếng Anh. Bài này dạy từ vựng bộ phận cơ thể và cách nói 'đau ở đâu'.",
    sentences: [
      {
        korean: "머리가 아파요",
        romanized: "meoriga apayo",
        en: "I have a headache.",
        vi: "Tôi đau đầu.",
        note_vi: "[Bộ phận] + 이/가 + 아파요 = đau [bộ phận].",
      },
      {
        korean: "배가 아파요",
        romanized: "baega apayo",
        en: "I have a stomachache.",
        vi: "Tôi đau bụng.",
      },
      {
        korean: "감기에 걸렸어요",
        romanized: "gamgie geollyeosseoyo",
        en: "I caught a cold.",
        vi: "Tôi bị cảm rồi.",
        note_vi: "감기 (gamgi) = cảm. 걸리다 (geollida) = mắc phải.",
      },
      {
        korean: "열이 있어요",
        romanized: "yeori isseoyo",
        en: "I have a fever.",
        vi: "Tôi bị sốt.",
        note_vi: "열 (yeol) = sốt/nhiệt. 있다 = có.",
      },
      {
        korean: "병원에 가야 돼요",
        romanized: "byeongwone gaya dwaeyo",
        en: "I need to go to the hospital.",
        vi: "Tôi cần đi bệnh viện.",
      },
      {
        korean: "약국이 어디예요?",
        romanized: "yakgugi eodiyeyo?",
        en: "Where is the pharmacy?",
        vi: "Nhà thuốc ở đâu ạ?",
      },
      {
        korean: "눈, 코, 입, 귀",
        romanized: "nun, ko, ip, gwi",
        en: "eyes, nose, mouth, ears",
        vi: "mắt, mũi, miệng, tai",
      },
      {
        korean: "손, 발, 다리, 팔",
        romanized: "son, bal, dari, pal",
        en: "hand, foot, leg, arm",
        vi: "tay, chân, cẳng chân, cánh tay",
      },
    ],
    grammar_notes_vi: [
      "[Bộ phận] + 이/가 + 아파요 = đau ở đâu. 머리가 아파요 (đau đầu), 배가 아파요 (đau bụng).",
      "걸리다 (geollida) = mắc/bị (bệnh). 감기에 걸리다 = bị cảm.",
      "Phân biệt 병원 (bệnh viện/phòng khám) vs 약국 (nhà thuốc). Ở Hàn, hai nơi này TÁCH BIỆT.",
    ],
    practice_tip_vi:
      "Học thuộc 10 bộ phận cơ thể bằng tiếng Hàn. Tập nói: nếu đau ở đâu thì nói thế nào. Ví dụ: 목이 아파요 (tôi đau họng), 치아가 아파요 (tôi đau răng).",
  },

  // ================================================================
  // Lesson 18 — Work and daily routine
  // ================================================================
  {
    id: "ko-work",
    title_vi: "Công việc và thói quen hằng ngày",
    title_en: "Work and daily routine",
    intro_vi:
      "Văn hóa làm việc Hàn Quốc nổi tiếng với cường độ cao. Biết nói về công việc, lịch trình hằng ngày và các mối quan hệ công sở giúp bạn hòa nhập nhanh hơn.",
    sentences: [
      {
        korean: "무슨 일을 해요?",
        romanized: "museun ireul haeyo?",
        en: "What kind of work do you do?",
        vi: "Bạn làm công việc gì?",
      },
      {
        korean: "저는 회사원이에요",
        romanized: "jeoneun hoesawonieyo",
        en: "I'm an office worker.",
        vi: "Tôi là nhân viên văn phòng.",
        note_vi: "회사원 (hoesawon) = nhân viên công ty. 회사 (hoesa) = công ty + 원 (viên).",
      },
      {
        korean: "선생님, 의사, 학생",
        romanized: "seonsaengnim, uisa, haksaeng",
        en: "teacher, doctor, student",
        vi: "giáo viên, bác sĩ, học sinh",
      },
      {
        korean: "몇 시에 일어나요?",
        romanized: "myeot sie ireonayo?",
        en: "What time do you wake up?",
        vi: "Bạn thức dậy lúc mấy giờ?",
      },
      {
        korean: "7시에 일어나요",
        romanized: "ilgop sie ireonayo",
        en: "I wake up at 7.",
        vi: "Tôi thức dậy lúc 7 giờ.",
      },
      {
        korean: "9시에 출근해요",
        romanized: "ahop sie chulgeunhaeyo",
        en: "I start work at 9.",
        vi: "Tôi đi làm lúc 9 giờ.",
        note_vi: "출근하다 (chulgeunhada) = đi làm. 퇴근하다 (toegeunhada) = tan sở.",
      },
      {
        korean: "야근이 많아요",
        romanized: "yageuni manayo",
        en: "There's a lot of overtime.",
        vi: "Tăng ca nhiều.",
        note_vi: "야근 (yageun) = làm đêm/tăng ca. Văn hóa thực tế ở Hàn.",
      },
      {
        korean: "주말에 뭐 해요?",
        romanized: "jumare mwo haeyo?",
        en: "What do you do on weekends?",
        vi: "Cuối tuần bạn làm gì?",
      },
    ],
    grammar_notes_vi: [
      "Nghề nghiệp: không có giới từ 'là' như tiếng Việt. Dùng 이에요/예요.",
      "시간 + 에 = vào lúc (thời điểm). 7시에 = vào lúc 7 giờ.",
      "에서 = tại (nơi làm việc). 회사에서 일해요 = tôi làm việc ở công ty.",
      "Trong công ty Hàn: cấp trên gọi bằng 님 (nim). 과장님, 부장님, 사장님.",
    ],
    practice_tip_vi:
      "Viết lịch trình một ngày của bạn bằng tiếng Hàn: mấy giờ thức dậy, đi làm, ăn trưa, về nhà, đi ngủ. Đọc to 3 lần.",
  },

  // ================================================================
  // Lesson 19 — Connecting sentences
  // ================================================================
  {
    id: "ko-connecting",
    title_vi: "Nối câu — và, nhưng, vì, nếu",
    title_en: "Connecting sentences — and, but, because, if",
    intro_vi:
      "Nối câu giúp bạn nói tiếng Hàn TRÔI CHẢY thay vì từng câu rời rạc. Tiếng Hàn có hệ thống đuôi nối (connective endings) gắn TRỰC TIẾP vào gốc động từ. Bài này dạy 6 đuôi nối quan trọng nhất.",
    sentences: [
      {
        korean: "한국어를 공부하고 영어를 가르쳐요",
        romanized: "hangugeoreul gongbuhago yeongeoreul gareuchyeoyo",
        en: "I study Korean and teach English.",
        vi: "Tôi học tiếng Hàn và dạy tiếng Anh.",
        note_vi: "고 (go) = và (nối hành động). Gắn vào gốc động từ.",
      },
      {
        korean: "한국어는 어렵지만 재미있어요",
        romanized: "hangugeoneun eoryeopjiman jaemiisseoyo",
        en: "Korean is difficult but interesting.",
        vi: "Tiếng Hàn khó nhưng thú vị.",
        note_vi: "지만 (jiman) = nhưng. Gắn vào gốc động từ/tính từ.",
      },
      {
        korean: "배가 고파서 밥을 먹었어요",
        romanized: "baega gopaseo babeul meogeosseoyo",
        en: "I was hungry so I ate.",
        vi: "Đói bụng nên tôi đã ăn cơm.",
        note_vi: "아/어서 (aseo/eoseo) = vì...nên. Nguyên nhân-kết quả.",
      },
      {
        korean: "시간이 있으면 영화 볼까요?",
        romanized: "sigani isseumyeon yeonghwa bolkkayo?",
        en: "If you have time, shall we watch a movie?",
        vi: "Nếu có thời gian, mình xem phim nhé?",
        note_vi: "(으)면 = nếu. Gốc + 으면 (có patchim) hoặc 면 (không patchim).",
      },
      {
        korean: "밥을 먹고 나서 공부할 거예요",
        romanized: "babeul meokgo naseo gongbuhal geoyeyo",
        en: "After eating, I will study.",
        vi: "Ăn cơm xong tôi sẽ học.",
        note_vi: "고 나서 (go naseo) = sau khi làm gì đó.",
      },
      {
        korean: "공부하기 전에 운동해요",
        romanized: "gongbuhagi jeone undonghaeyo",
        en: "I exercise before studying.",
        vi: "Tôi tập thể dục trước khi học.",
        note_vi: "기 전에 (gi jeone) = trước khi. Động từ + 기 + 전에.",
      },
      {
        korean: "그리고 / 그래서 / 그런데",
        romanized: "geurigo / geuraeseo / geureonde",
        en: "And / So / But (sentence connectors)",
        vi: "Và / Vì thế / Nhưng (nối câu rời)",
        note_vi: "Dùng để bắt đầu câu mới, nối ý với câu trước.",
      },
    ],
    grammar_notes_vi: [
      "고 = và (nối hành động hoặc tính từ). Chỉ nối, không có quan hệ nhân quả.",
      "아/어서 = vì...nên (có quan hệ nhân quả). Động từ thứ 2 là KẾT QUẢ của động từ thứ 1.",
      "(으)면 = nếu. Dùng cho điều kiện giả định.",
      "지만 = nhưng. Gắn trực tiếp vào gốc, không cần khoảng trắng.",
    ],
    practice_tip_vi:
      "Viết 5 câu về ngày hôm qua của bạn, mỗi câu dùng một đuôi nối khác nhau. Ví dụ: 아침에 일어나서 커피를 마셨어요. 그리고 샤워를 했어요.",
  },

  // ================================================================
  // Lesson 20 — Hobbies and plans
  // ================================================================
  {
    id: "ko-hobbies",
    title_vi: "Sở thích và kế hoạch tương lai",
    title_en: "Hobbies and future plans",
    intro_vi:
      "Người Hàn thích hỏi về sở thích và kế hoạch — đây là cách họ tìm điểm chung để kết nối. Học nói về những gì bạn thích, muốn làm, và dự định sẽ làm.",
    sentences: [
      {
        korean: "취미가 뭐예요?",
        romanized: "chwimiga mwoyeyo?",
        en: "What are your hobbies?",
        vi: "Sở thích của bạn là gì?",
      },
      {
        korean: "등산을 좋아해요",
        romanized: "deungsaneul joahaeyo",
        en: "I like hiking.",
        vi: "Tôi thích leo núi.",
        note_vi: "등산 (deungsan) = leo núi. NGƯỜI HÀN CỰC KỲ THÍCH leo núi — có thể là sở thích quốc dân.",
      },
      {
        korean: "영화 보는 것을 좋아해요",
        romanized: "yeonghwa boneun geoseul joahaeyo",
        en: "I like watching movies.",
        vi: "Tôi thích xem phim.",
        note_vi: "Động từ + 는 것 = việc làm gì đó. 'Việc xem phim'.",
      },
      {
        korean: "운동을 안 좋아해요",
        romanized: "undongeul an joahaeyo",
        en: "I don't like exercising.",
        vi: "Tôi không thích tập thể dục.",
      },
      {
        korean: "뭐 하고 싶어요?",
        romanized: "mwo hago sipeoyo?",
        en: "What do you want to do?",
        vi: "Bạn muốn làm gì?",
        note_vi: "고 싶다 (go sipda) = muốn làm. Động từ + 고 싶어요.",
      },
      {
        korean: "한국에 가고 싶어요",
        romanized: "hanguge gago sipeoyo",
        en: "I want to go to Korea.",
        vi: "Tôi muốn đi Hàn Quốc.",
      },
      {
        korean: "주말에 뭐 할 거예요?",
        romanized: "jumare mwo hal geoyeyo?",
        en: "What will you do on the weekend?",
        vi: "Cuối tuần bạn sẽ làm gì?",
        note_vi: "(으)ㄹ 거예요 = sẽ (kế hoạch/dự định). Động từ + ㄹ/을 거예요.",
      },
      {
        korean: "친구를 만날 거예요",
        romanized: "chingureul mannal geoyeyo",
        en: "I will meet a friend.",
        vi: "Tôi sẽ gặp bạn.",
      },
      {
        korean: "함께 가요!",
        romanized: "hamkke gayo!",
        en: "Let's go together!",
        vi: "Cùng đi nhé!",
        note_vi: "함께 (hamkke) = cùng nhau. 같이 (gachi) = cùng (thân mật hơn).",
      },
    ],
    grammar_notes_vi: [
      "고 싶다 (go sipda) = muốn làm gì. Chỉ dùng cho ngôi thứ nhất (tôi muốn...) và câu hỏi ngôi thứ hai (bạn muốn...?).",
      "(으)ㄹ 거예요 = sẽ (dự định). Khác với (으)ㄹ게요 = sẽ (hứa/làm ngay).",
      "는 것 = biến động từ thành danh từ. 영화 보는 것 = việc xem phim.",
      "같이 (gachi) vs 함께 (hamkke): 같이 thân mật hơn, 함께 trang trọng hơn.",
    ],
    practice_tip_vi:
      "Viết 5 câu về kế hoạch cuối tuần dùng (으)ㄹ 거예요. Viết 5 câu về điều bạn muốn làm dùng 고 싶어요. Đọc to, thu âm, nghe lại.",
  },
];

export default KOREAN_LESSONS;
