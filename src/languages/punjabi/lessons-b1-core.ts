// src/languages/punjabi/lessons-b1-core.ts
//
// Punjabi CEFR B1 core lesson batch for Vietnamese-speaking and English-
// speaking learners. Gurmukhi is primary; romanization is a support layer.
// Shahmukhi is mentioned only for awareness, not taught as a full course.
//
// Native review is deferred; this file makes no native-review claim.

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiB1Focus =
  | "storytelling"
  | "workplace_basics"
  | "phone_calls"
  | "appointments"
  | "explaining_problems"
  | "giving_reasons"
  | "comparison"
  | "plans"
  | "public_services";

export type PunjabiExample = {
  /** Punjabi in Gurmukhi script, primary display. */
  pa: string;
  /** Light romanization for learners who need a bridge. */
  romanization: string;
  /** English meaning or usage explanation. */
  en: string;
  /** Vietnamese meaning or usage explanation. */
  vi: string;
};

export type PunjabiPractice = {
  prompt_en: string;
  prompt_vi: string;
  answers: PunjabiExample[];
};

export type PunjabiCommonMistake = {
  mistake_en: string;
  mistake_vi: string;
  correction: PunjabiExample;
};

export type PunjabiB1Lesson = {
  id: string;
  level: "B1";
  focus: PunjabiB1Focus;
  title_en: string;
  title_vi: string;
  note_en: string;
  note_vi: string;
  examples: PunjabiExample[];
  practice: PunjabiPractice[];
  commonMistakes: PunjabiCommonMistake[];
};

export const punjabiB1CoreLessons: PunjabiB1Lesson[] = [
  {
    id: "pa-b1-core-01-story-sequence",
    level: "B1",
    focus: "storytelling",
    title_en: "Telling a short story in order",
    title_vi: "Kể một câu chuyện ngắn theo trình tự",
    note_en:
      "Use ਪਹਿਲਾਂ (first), ਫਿਰ (then), ਉਸ ਤੋਂ ਬਾਅਦ (after that), and ਅਖੀਰ ਵਿੱਚ (in the end) to make a simple story clear. Punjabi often keeps the verb at the end of the clause.",
    note_vi:
      "Dùng ਪਹਿਲਾਂ (trước tiên), ਫਿਰ (sau đó), ਉਸ ਤੋਂ ਬਾਅਦ (sau đó nữa), và ਅਖੀਰ ਵਿੱਚ (cuối cùng) để kể chuyện rõ ràng. Tiếng Punjabi thường đặt động từ ở cuối mệnh đề.",
    examples: [
      {
        pa: "ਪਹਿਲਾਂ ਮੈਂ ਬੱਸ ਲਈ, ਫਿਰ ਦਫ਼ਤਰ ਪਹੁੰਚਿਆ।",
        romanization: "pahilan main bass laee, phir daftar pahunchia.",
        en: "First I took the bus, then I reached the office.",
        vi: "Trước tiên tôi đi xe buýt, rồi đến văn phòng.",
      },
      {
        pa: "ਉਸ ਤੋਂ ਬਾਅਦ ਮੈਨੂੰ ਮੈਨੇਜਰ ਨਾਲ ਗੱਲ ਕਰਨੀ ਪਈ।",
        romanization: "us ton baad mainu manager naal gall karni pai.",
        en: "After that I had to speak with the manager.",
        vi: "Sau đó tôi phải nói chuyện với quản lý.",
      },
      {
        pa: "ਅਖੀਰ ਵਿੱਚ ਸਾਰਾ ਕੰਮ ਠੀਕ ਹੋ ਗਿਆ।",
        romanization: "akhir vich sara kamm theek ho gia.",
        en: "In the end, all the work turned out fine.",
        vi: "Cuối cùng, mọi việc ổn cả.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Tell a three-step story about arriving late: first, then, in the end.",
        prompt_vi:
          "Kể một câu chuyện ba bước về việc đến muộn: trước tiên, sau đó, cuối cùng.",
        answers: [
          {
            pa: "ਪਹਿਲਾਂ ਟ੍ਰੈਫਿਕ ਬਹੁਤ ਸੀ, ਫਿਰ ਬੱਸ ਲੇਟ ਆਈ, ਅਖੀਰ ਵਿੱਚ ਮੈਂ ਦੱਸ ਮਿੰਟ ਲੇਟ ਪਹੁੰਚਿਆ।",
            romanization:
              "pahilan traffic bahut si, phir bass late aee, akhir vich main dass mint late pahunchia.",
            en: "First there was a lot of traffic, then the bus came late, and in the end I arrived ten minutes late.",
            vi: "Trước tiên đường rất kẹt, sau đó xe buýt đến muộn, cuối cùng tôi đến muộn mười phút.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Putting every connector at the start without a clear verb ending.",
        mistake_vi:
          "Đặt mọi từ nối ở đầu câu nhưng không kết thúc mệnh đề bằng động từ rõ ràng.",
        correction: {
          pa: "ਫਿਰ ਮੈਂ ਉਸਨੂੰ ਫ਼ੋਨ ਕੀਤਾ।",
          romanization: "phir main usnu phone kita.",
          en: "Then I called them.",
          vi: "Sau đó tôi gọi cho người đó.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-02-past-experience",
    level: "B1",
    focus: "storytelling",
    title_en: "Talking about past experience",
    title_vi: "Nói về trải nghiệm trong quá khứ",
    note_en:
      "For past experience, use ਕਦੇ (ever), ਪਹਿਲਾਂ (before), and ਇੱਕ ਵਾਰ (once). At B1, focus on a clear time marker plus one result or feeling.",
    note_vi:
      "Khi nói về trải nghiệm quá khứ, dùng ਕਦੇ (đã từng), ਪਹਿਲਾਂ (trước đây), và ਇੱਕ ਵਾਰ (một lần). Ở B1, hãy nêu mốc thời gian rõ ràng và thêm một kết quả hoặc cảm xúc.",
    examples: [
      {
        pa: "ਕੀ ਤੁਸੀਂ ਕਦੇ ਪੰਜਾਬੀ ਵਿੱਚ ਮੀਟਿੰਗ ਕੀਤੀ ਹੈ?",
        romanization: "ki tusin kade Punjabi vich meeting kiti hai?",
        en: "Have you ever had a meeting in Punjabi?",
        vi: "Bạn đã từng họp bằng tiếng Punjabi chưa?",
      },
      {
        pa: "ਮੈਂ ਪਹਿਲਾਂ ਇੱਥੇ ਕੰਮ ਕੀਤਾ ਹੈ।",
        romanization: "main pahilan itthe kamm kita hai.",
        en: "I have worked here before.",
        vi: "Tôi đã từng làm việc ở đây trước đây.",
      },
      {
        pa: "ਇੱਕ ਵਾਰ ਮੇਰਾ ਫ਼ੋਨ ਖੋ ਗਿਆ ਸੀ।",
        romanization: "ikk vaar mera phone kho gia si.",
        en: "Once my phone was lost.",
        vi: "Có một lần điện thoại của tôi bị mất.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Say that you have used Punjabi at work before and explain how it felt.",
        prompt_vi:
          "Nói rằng bạn đã từng dùng tiếng Punjabi ở nơi làm việc và giải thích cảm giác.",
        answers: [
          {
            pa: "ਮੈਂ ਪਹਿਲਾਂ ਕੰਮ ਤੇ ਪੰਜਾਬੀ ਬੋਲੀ ਹੈ, ਅਤੇ ਪਹਿਲਾਂ ਥੋੜ੍ਹਾ ਔਖਾ ਲੱਗਿਆ।",
            romanization:
              "main pahilan kamm te Punjabi boli hai, ate pahilan thora aukha laggia.",
            en: "I have spoken Punjabi at work before, and at first it felt a little difficult.",
            vi: "Tôi đã từng nói tiếng Punjabi ở chỗ làm, và lúc đầu thấy hơi khó.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Using only the English word 'before' in a Punjabi sentence instead of ਪਹਿਲਾਂ.",
        mistake_vi:
          "Chỉ dùng từ tiếng Anh 'before' trong câu Punjabi thay vì dùng ਪਹਿਲਾਂ.",
        correction: {
          pa: "ਮੈਂ ਪਹਿਲਾਂ ਇਹ ਕੀਤਾ ਹੈ।",
          romanization: "main pahilan eh kita hai.",
          en: "I have done this before.",
          vi: "Tôi đã làm việc này trước đây.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-03-workplace-requests",
    level: "B1",
    focus: "workplace_basics",
    title_en: "Polite workplace requests",
    title_vi: "Yêu cầu lịch sự ở nơi làm việc",
    note_en:
      "Use ਕਿਰਪਾ ਕਰਕੇ (please), ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ? (could you ...?), and ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ (I need ...). ਤੁਸੀਂ is the safer polite 'you' at work.",
    note_vi:
      "Dùng ਕਿਰਪਾ ਕਰਕੇ (làm ơn), ਕੀ ਤੁਸੀਂ ... ਸਕਦੇ ਹੋ? (bạn có thể ... không?), và ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ (tôi cần ...). Ở nơi làm việc, ਤੁਸੀਂ là cách nói 'bạn/anh/chị' lịch sự và an toàn hơn.",
    examples: [
      {
        pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਰਿਪੋਰਟ ਭੇਜ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin mainu report bhej sakde ho?",
        en: "Could you send me the report?",
        vi: "Bạn có thể gửi báo cáo cho tôi không?",
      },
      {
        pa: "ਮੈਨੂੰ ਅੱਜ ਦੋ ਵਜੇ ਤੱਕ ਜਵਾਬ ਚਾਹੀਦਾ ਹੈ।",
        romanization: "mainu ajj do vaje takk jawab chahida hai.",
        en: "I need the answer by two o'clock today.",
        vi: "Tôi cần câu trả lời trước hai giờ hôm nay.",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਫ਼ਾਈਲ ਦੁਬਾਰਾ ਚੈੱਕ ਕਰੋ।",
        romanization: "kirpa karke eh file dubara check karo.",
        en: "Please check this file again.",
        vi: "Vui lòng kiểm tra lại tệp này.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Ask a coworker politely to check a document before lunch.",
        prompt_vi:
          "Nhờ đồng nghiệp kiểm tra một tài liệu trước bữa trưa một cách lịch sự.",
        answers: [
          {
            pa: "ਕੀ ਤੁਸੀਂ ਦੁਪਹਿਰ ਦੇ ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਦਸਤਾਵੇਜ਼ ਚੈੱਕ ਕਰ ਸਕਦੇ ਹੋ?",
            romanization:
              "ki tusin dupahir de khane ton pahilan eh dastavez check kar sakde ho?",
            en: "Could you check this document before lunch?",
            vi: "Bạn có thể kiểm tra tài liệu này trước bữa trưa không?",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Using ਤੂੰ with coworkers when you are not close. It can sound too direct.",
        mistake_vi:
          "Dùng ਤੂੰ với đồng nghiệp khi chưa thân. Cách này có thể nghe quá suồng sã.",
        correction: {
          pa: "ਕੀ ਤੁਸੀਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹੋ?",
          romanization: "ki tusin madad kar sakde ho?",
          en: "Could you help?",
          vi: "Bạn có thể giúp không?",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-04-workplace-updates",
    level: "B1",
    focus: "workplace_basics",
    title_en: "Giving progress updates",
    title_vi: "Cập nhật tiến độ công việc",
    note_en:
      "To update progress, combine ਅਜੇ (still/yet), ਲਗਭਗ (almost/about), ਮੁਕ ਗਿਆ (finished), and ਬਾਕੀ ਹੈ (is remaining). Be specific about the next step.",
    note_vi:
      "Khi cập nhật tiến độ, kết hợp ਅਜੇ (vẫn/chưa), ਲਗਭਗ (gần như/khoảng), ਮੁਕ ਗਿਆ (đã xong), và ਬਾਕੀ ਹੈ (còn lại). Hãy nói rõ bước tiếp theo.",
    examples: [
      {
        pa: "ਰਿਪੋਰਟ ਲਗਭਗ ਮੁਕ ਗਈ ਹੈ।",
        romanization: "report lagbhag muk gai hai.",
        en: "The report is almost finished.",
        vi: "Báo cáo gần xong rồi.",
      },
      {
        pa: "ਅਜੇ ਦੋ ਸਫ਼ੇ ਬਾਕੀ ਹਨ।",
        romanization: "aje do safe baaki han.",
        en: "Two pages are still remaining.",
        vi: "Vẫn còn hai trang.",
      },
      {
        pa: "ਮੈਂ ਇਹ ਕੱਲ੍ਹ ਸਵੇਰੇ ਭੇਜ ਦਿਆਂਗਾ।",
        romanization: "main eh kallh savere bhej dianga.",
        en: "I will send this tomorrow morning.",
        vi: "Tôi sẽ gửi cái này sáng mai.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Give a progress update: almost done, one part remaining, send tomorrow.",
        prompt_vi:
          "Cập nhật tiến độ: gần xong, còn một phần, gửi ngày mai.",
        answers: [
          {
            pa: "ਕੰਮ ਲਗਭਗ ਮੁਕ ਗਿਆ ਹੈ, ਪਰ ਇੱਕ ਹਿੱਸਾ ਬਾਕੀ ਹੈ। ਮੈਂ ਕੱਲ੍ਹ ਭੇਜ ਦਿਆਂਗਾ।",
            romanization:
              "kamm lagbhag muk gia hai, par ikk hissa baaki hai. main kallh bhej dianga.",
            en: "The work is almost finished, but one part remains. I will send it tomorrow.",
            vi: "Công việc gần xong, nhưng còn một phần. Tôi sẽ gửi ngày mai.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Saying only 'finished' when one part remains. Use ਬਾਕੀ ਹੈ to avoid confusion.",
        mistake_vi:
          "Chỉ nói 'xong' khi vẫn còn một phần. Dùng ਬਾਕੀ ਹੈ để tránh hiểu nhầm.",
        correction: {
          pa: "ਇੱਕ ਕੰਮ ਬਾਕੀ ਹੈ।",
          romanization: "ikk kamm baaki hai.",
          en: "One task remains.",
          vi: "Còn lại một việc.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-05-phone-openings",
    level: "B1",
    focus: "phone_calls",
    title_en: "Starting and managing phone calls",
    title_vi: "Bắt đầu và điều phối cuộc gọi điện thoại",
    note_en:
      "On the phone, identify yourself early: ਮੈਂ ... ਬੋਲ ਰਿਹਾ/ਰਹੀ ਹਾਂ. Use ਕੀ ਤੁਸੀਂ ਸੁਣ ਸਕਦੇ ਹੋ? for connection checks and ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ for repair.",
    note_vi:
      "Khi gọi điện, hãy giới thiệu mình sớm: ਮੈਂ ... ਬੋਲ ਰਿਹਾ/ਰਹੀ ਹਾਂ. Dùng ਕੀ ਤੁਸੀਂ ਸੁਣ ਸਕਦੇ ਹੋ? để kiểm tra kết nối và ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ để yêu cầu nói chậm lại.",
    examples: [
      {
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਅਮਨ ਬੋਲ ਰਿਹਾ ਹਾਂ।",
        romanization: "sat sri akal, main Aman bol riha han.",
        en: "Hello, Aman speaking.",
        vi: "Xin chào, Aman đang nghe/đang nói đây.",
      },
      {
        pa: "ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਠੀਕ ਸੁਣ ਸਕਦੇ ਹੋ?",
        romanization: "ki tusin mainu theek sun sakde ho?",
        en: "Can you hear me clearly?",
        vi: "Bạn có nghe tôi rõ không?",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹਾ ਹੌਲੀ ਬੋਲੋ।",
        romanization: "kirpa karke thora hauli bolo.",
        en: "Please speak a little more slowly.",
        vi: "Vui lòng nói chậm hơn một chút.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Open a phone call, say your name, and ask whether the other person can hear you.",
        prompt_vi:
          "Mở đầu cuộc gọi, nói tên bạn, và hỏi người kia có nghe rõ không.",
        answers: [
          {
            pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਮੈਂ ਲੀਨਾ ਬੋਲ ਰਹੀ ਹਾਂ। ਕੀ ਤੁਸੀਂ ਮੈਨੂੰ ਸੁਣ ਸਕਦੇ ਹੋ?",
            romanization:
              "sat sri akal, main Leena bol rahi han. ki tusin mainu sun sakde ho?",
            en: "Hello, this is Leena speaking. Can you hear me?",
            vi: "Xin chào, tôi là Leena. Bạn có nghe tôi không?",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Starting with only 'hello' and waiting. State your name and purpose.",
        mistake_vi:
          "Chỉ nói 'hello' rồi chờ. Hãy nói tên và mục đích cuộc gọi.",
        correction: {
          pa: "ਮੈਂ ਰਵੀ ਬੋਲ ਰਿਹਾ ਹਾਂ, ਮੈਨੂੰ ਅਪਾਇੰਟਮੈਂਟ ਬਾਰੇ ਪੁੱਛਣਾ ਹੈ।",
          romanization:
            "main Ravi bol riha han, mainu appointment bare puchhna hai.",
          en: "This is Ravi speaking; I need to ask about the appointment.",
          vi: "Tôi là Ravi; tôi cần hỏi về cuộc hẹn.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-06-phone-messages",
    level: "B1",
    focus: "phone_calls",
    title_en: "Leaving and taking messages",
    title_vi: "Để lại và nhận lời nhắn",
    note_en:
      "Use ਸੁਨੇਹਾ (message), ਵਾਪਸ ਫ਼ੋਨ ਕਰਨਾ (call back), and ਨੰਬਰ ਲਿਖਣਾ (write down a number). Repeat key numbers slowly for accuracy.",
    note_vi:
      "Dùng ਸੁਨੇਹਾ (lời nhắn), ਵਾਪਸ ਫ਼ੋਨ ਕਰਨਾ (gọi lại), và ਨੰਬਰ ਲਿਖਣਾ (ghi số). Lặp lại số điện thoại chậm rãi để chính xác.",
    examples: [
      {
        pa: "ਕੀ ਮੈਂ ਸੁਨੇਹਾ ਛੱਡ ਸਕਦਾ ਹਾਂ?",
        romanization: "ki main suneha chhadd sakda han?",
        en: "May I leave a message?",
        vi: "Tôi có thể để lại lời nhắn không?",
      },
      {
        pa: "ਕਿਰਪਾ ਕਰਕੇ ਉਹਨੂੰ ਕਹੋ ਕਿ ਮੈਨੂੰ ਵਾਪਸ ਫ਼ੋਨ ਕਰੇ।",
        romanization:
          "kirpa karke ohnu kaho ki mainu wapas phone kare.",
        en: "Please tell them to call me back.",
        vi: "Vui lòng bảo người đó gọi lại cho tôi.",
      },
      {
        pa: "ਮੇਰਾ ਨੰਬਰ ਜ਼ੀਰੋ-ਚਾਰ-ਤਿੰਨ-ਦੋ ਹੈ।",
        romanization: "mera number zero-char-tinn-do hai.",
        en: "My number is zero-four-three-two.",
        vi: "Số của tôi là không-bốn-ba-hai.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Leave a message asking someone to call you back after three o'clock.",
        prompt_vi:
          "Để lại lời nhắn yêu cầu ai đó gọi lại cho bạn sau ba giờ.",
        answers: [
          {
            pa: "ਕਿਰਪਾ ਕਰਕੇ ਉਹਨੂੰ ਕਹੋ ਕਿ ਤਿੰਨ ਵਜੇ ਤੋਂ ਬਾਅਦ ਮੈਨੂੰ ਵਾਪਸ ਫ਼ੋਨ ਕਰੇ।",
            romanization:
              "kirpa karke ohnu kaho ki tinn vaje ton baad mainu wapas phone kare.",
            en: "Please tell them to call me back after three o'clock.",
            vi: "Vui lòng bảo người đó gọi lại cho tôi sau ba giờ.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Giving a number too quickly. Chunk it into small groups.",
        mistake_vi:
          "Đọc số điện thoại quá nhanh. Hãy chia thành nhóm nhỏ.",
        correction: {
          pa: "ਮੇਰਾ ਨੰਬਰ ਪੰਜ-ਛੇ, ਸੱਤ-ਅੱਠ ਹੈ।",
          romanization: "mera number panj-chhe, satt-atth hai.",
          en: "My number is five-six, seven-eight.",
          vi: "Số của tôi là năm-sáu, bảy-tám.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-07-appointments",
    level: "B1",
    focus: "appointments",
    title_en: "Making and changing appointments",
    title_vi: "Đặt và đổi lịch hẹn",
    note_en:
      "For appointments, use ਸਮਾਂ ਲੈਣਾ (make an appointment), ਬਦਲਣਾ (change), ਰੱਦ ਕਰਨਾ (cancel), and ਕੀ ... ਉਪਲਬਧ ਹੈ? (is ... available?).",
    note_vi:
      "Với lịch hẹn, dùng ਸਮਾਂ ਲੈਣਾ (đặt lịch), ਬਦਲਣਾ (đổi), ਰੱਦ ਕਰਨਾ (hủy), và ਕੀ ... ਉਪਲਬਧ ਹੈ? (có trống/khả dụng không?).",
    examples: [
      {
        pa: "ਮੈਨੂੰ ਡਾਕਟਰ ਲਈ ਸਮਾਂ ਲੈਣਾ ਹੈ।",
        romanization: "mainu doctor lai sama laina hai.",
        en: "I need to make an appointment with the doctor.",
        vi: "Tôi cần đặt lịch hẹn với bác sĩ.",
      },
      {
        pa: "ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਸਵੇਰੇ ਦੱਸ ਵਜੇ ਉਪਲਬਧ ਹੈ?",
        romanization: "ki shukkarvaar savere dass vaje uplabdh hai?",
        en: "Is Friday at ten in the morning available?",
        vi: "Thứ Sáu lúc mười giờ sáng có trống không?",
      },
      {
        pa: "ਮੈਨੂੰ ਆਪਣਾ ਸਮਾਂ ਬਦਲਣਾ ਪਵੇਗਾ।",
        romanization: "mainu apna sama badalna pavega.",
        en: "I will have to change my appointment time.",
        vi: "Tôi sẽ phải đổi giờ hẹn.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Ask for an appointment next Monday afternoon and offer a second option.",
        prompt_vi:
          "Xin lịch hẹn chiều thứ Hai tới và đưa ra lựa chọn thứ hai.",
        answers: [
          {
            pa: "ਕੀ ਅਗਲੇ ਸੋਮਵਾਰ ਦੁਪਹਿਰ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ? ਜੇ ਨਹੀਂ, ਤਾਂ ਮੰਗਲਵਾਰ ਸਵੇਰੇ ਠੀਕ ਹੈ।",
            romanization:
              "ki agle somvaar dupahir sama mil sakda hai? je nahin, tan mangalvaar savere theek hai.",
            en: "Can I get an appointment next Monday afternoon? If not, Tuesday morning is fine.",
            vi: "Tôi có thể đặt lịch chiều thứ Hai tới không? Nếu không, sáng thứ Ba cũng được.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Forgetting to give a backup time, which slows the conversation.",
        mistake_vi:
          "Quên đưa ra thời gian dự phòng, làm cuộc trao đổi chậm lại.",
        correction: {
          pa: "ਜੇ ਉਹ ਸਮਾਂ ਨਹੀਂ ਮਿਲਦਾ, ਤਾਂ ਬੁੱਧਵਾਰ ਵੀ ਠੀਕ ਹੈ।",
          romanization: "je oh sama nahin milda, tan budhvaar vi theek hai.",
          en: "If that time is not available, Wednesday is also fine.",
          vi: "Nếu giờ đó không trống, thứ Tư cũng được.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-08-explaining-problems",
    level: "B1",
    focus: "explaining_problems",
    title_en: "Explaining what is wrong",
    title_vi: "Giải thích vấn đề đang xảy ra",
    note_en:
      "State the problem, when it started, and what you already tried. Useful frames: ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ (is not working), ਜਦੋਂ ... ਤਾਂ ... (when ... then ...), ਮੈਂ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ (I tried).",
    note_vi:
      "Nêu vấn đề, thời điểm bắt đầu, và điều bạn đã thử. Khung hữu ích: ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ (không hoạt động), ਜਦੋਂ ... ਤਾਂ ... (khi ... thì ...), ਮੈਂ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ (tôi đã thử).",
    examples: [
      {
        pa: "ਮੇਰਾ ਕੰਪਿਊਟਰ ਸਵੇਰੇ ਤੋਂ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।",
        romanization: "mera computer savere ton kamm nahin kar riha.",
        en: "My computer has not been working since the morning.",
        vi: "Máy tính của tôi không hoạt động từ sáng.",
      },
      {
        pa: "ਜਦੋਂ ਮੈਂ ਲਾਗ ਇਨ ਕਰਦਾ ਹਾਂ, ਤਾਂ ਗਲਤੀ ਆਉਂਦੀ ਹੈ।",
        romanization: "jadon main log in karda han, tan galti aundi hai.",
        en: "When I log in, an error appears.",
        vi: "Khi tôi đăng nhập thì có lỗi xuất hiện.",
      },
      {
        pa: "ਮੈਂ ਦੁਬਾਰਾ ਚਲਾਉਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ।",
        romanization: "main dubara chalaun di koshish kiti.",
        en: "I tried restarting it.",
        vi: "Tôi đã thử khởi động lại.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Explain that your card is not working and you already tried twice.",
        prompt_vi:
          "Giải thích rằng thẻ của bạn không hoạt động và bạn đã thử hai lần.",
        answers: [
          {
            pa: "ਮੇਰਾ ਕਾਰਡ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਮੈਂ ਦੋ ਵਾਰ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ, ਪਰ ਗਲਤੀ ਆਉਂਦੀ ਹੈ।",
            romanization:
              "mera card kamm nahin kar riha. main do vaar koshish kiti, par galti aundi hai.",
            en: "My card is not working. I tried twice, but an error appears.",
            vi: "Thẻ của tôi không hoạt động. Tôi đã thử hai lần, nhưng vẫn có lỗi.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Only saying 'problem' without the time or action. Add when it happens.",
        mistake_vi:
          "Chỉ nói 'có vấn đề' mà không nêu thời điểm hoặc hành động. Hãy nói khi nào nó xảy ra.",
        correction: {
          pa: "ਜਦੋਂ ਮੈਂ ਭੁਗਤਾਨ ਕਰਦਾ ਹਾਂ, ਤਾਂ ਗਲਤੀ ਆਉਂਦੀ ਹੈ।",
          romanization: "jadon main bhugtan karda han, tan galti aundi hai.",
          en: "When I make the payment, an error appears.",
          vi: "Khi tôi thanh toán thì lỗi xuất hiện.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-09-giving-reasons",
    level: "B1",
    focus: "giving_reasons",
    title_en: "Giving reasons and results",
    title_vi: "Nêu lý do và kết quả",
    note_en:
      "ਕਿਉਂਕਿ means because, so it introduces the reason. ਇਸ ਲਈ means therefore/so, so it introduces the result. Avoid using both in the same small clause unless the structure is clear.",
    note_vi:
      "ਕਿਉਂਕਿ nghĩa là bởi vì, dùng để nêu lý do. ਇਸ ਲਈ nghĩa là vì vậy/cho nên, dùng để nêu kết quả. Tránh dùng cả hai trong cùng một mệnh đề ngắn nếu cấu trúc chưa rõ.",
    examples: [
      {
        pa: "ਮੈਂ ਲੇਟ ਆਇਆ ਕਿਉਂਕਿ ਬੱਸ ਲੇਟ ਸੀ।",
        romanization: "main late aaya kyonki bass late si.",
        en: "I arrived late because the bus was late.",
        vi: "Tôi đến muộn vì xe buýt đến muộn.",
      },
      {
        pa: "ਬੱਸ ਲੇਟ ਸੀ, ਇਸ ਲਈ ਮੈਂ ਲੇਟ ਆਇਆ।",
        romanization: "bass late si, is lai main late aaya.",
        en: "The bus was late, so I arrived late.",
        vi: "Xe buýt đến muộn, nên tôi đến muộn.",
      },
      {
        pa: "ਮੈਨੂੰ ਜਾਣਾ ਪਵੇਗਾ ਕਿਉਂਕਿ ਮੇਰੀ ਮੀਟਿੰਗ ਹੈ।",
        romanization: "mainu jana pavega kyonki meri meeting hai.",
        en: "I will have to go because I have a meeting.",
        vi: "Tôi sẽ phải đi vì tôi có cuộc họp.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Give one reason for changing an appointment, then give the result with ਇਸ ਲਈ.",
        prompt_vi:
          "Nêu một lý do phải đổi lịch hẹn, rồi nêu kết quả bằng ਇਸ ਲਈ.",
        answers: [
          {
            pa: "ਮੇਰੀ ਮੀਟਿੰਗ ਲੰਮੀ ਹੋ ਗਈ, ਇਸ ਲਈ ਮੈਨੂੰ ਸਮਾਂ ਬਦਲਣਾ ਪਵੇਗਾ।",
            romanization:
              "meri meeting lammi ho gai, is lai mainu sama badalna pavega.",
            en: "My meeting became long, so I will have to change the time.",
            vi: "Cuộc họp của tôi kéo dài, nên tôi sẽ phải đổi giờ.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Copying English 'because ... so ...' into one sentence. In Punjabi, choose reason-first or result-first clearly.",
        mistake_vi:
          "Dịch máy kiểu tiếng Anh 'because ... so ...' vào một câu. Trong Punjabi, hãy chọn rõ: lý do trước hoặc kết quả trước.",
        correction: {
          pa: "ਮੈਂ ਨਹੀਂ ਆ ਸਕਦਾ ਕਿਉਂਕਿ ਮੈਂ ਬਿਮਾਰ ਹਾਂ।",
          romanization: "main nahin aa sakda kyonki main bimar han.",
          en: "I cannot come because I am sick.",
          vi: "Tôi không thể đến vì tôi bị bệnh.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-10-comparison",
    level: "B1",
    focus: "comparison",
    title_en: "Comparing choices",
    title_vi: "So sánh các lựa chọn",
    note_en:
      "Use ਤੋਂ (than/from) for comparisons: X Y ਤੋਂ ਵਧੀਆ ਹੈ (X is better than Y). Use ਜ਼ਿਆਦਾ (more) and ਘੱਟ (less) for quantity or degree.",
    note_vi:
      "Dùng ਤੋਂ (hơn/từ) khi so sánh: X Y ਤੋਂ ਵਧੀਆ ਹੈ (X tốt hơn Y). Dùng ਜ਼ਿਆਦਾ (nhiều hơn) và ਘੱਟ (ít hơn) cho số lượng hoặc mức độ.",
    examples: [
      {
        pa: "ਇਹ ਰਸਤਾ ਉਸ ਰਸਤੇ ਤੋਂ ਤੇਜ਼ ਹੈ।",
        romanization: "eh rasta us raste ton tez hai.",
        en: "This route is faster than that route.",
        vi: "Tuyến đường này nhanh hơn tuyến kia.",
      },
      {
        pa: "ਇਹ ਚੋਣ ਥੋੜ੍ਹੀ ਸਸਤੀ ਹੈ।",
        romanization: "eh chon thori sasti hai.",
        en: "This option is a little cheaper.",
        vi: "Lựa chọn này rẻ hơn một chút.",
      },
      {
        pa: "ਮੇਰੇ ਲਈ ਸਵੇਰ ਸ਼ਾਮ ਤੋਂ ਵਧੀਆ ਹੈ।",
        romanization: "mere lai saver shaam ton vadhiya hai.",
        en: "For me, morning is better than evening.",
        vi: "Với tôi, buổi sáng tốt hơn buổi tối.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Compare two appointment times and say which one is better for you.",
        prompt_vi:
          "So sánh hai giờ hẹn và nói giờ nào tốt hơn cho bạn.",
        answers: [
          {
            pa: "ਮੇਰੇ ਲਈ ਦੱਸ ਵਜੇ ਤਿੰਨ ਵਜੇ ਤੋਂ ਵਧੀਆ ਹੈ ਕਿਉਂਕਿ ਸਵੇਰੇ ਟ੍ਰੈਫਿਕ ਘੱਟ ਹੁੰਦਾ ਹੈ।",
            romanization:
              "mere lai dass vaje tinn vaje ton vadhiya hai kyonki savere traffic ghatt hunda hai.",
            en: "Ten o'clock is better than three o'clock for me because traffic is lighter in the morning.",
            vi: "Mười giờ tốt hơn ba giờ với tôi vì buổi sáng ít kẹt xe hơn.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Dropping ਤੋਂ in comparisons. The listener may not know what is being compared.",
        mistake_vi:
          "Bỏ ਤੋਂ trong câu so sánh. Người nghe có thể không biết bạn đang so với cái gì.",
        correction: {
          pa: "ਇਹ ਉਸ ਤੋਂ ਵਧੀਆ ਹੈ।",
          romanization: "eh us ton vadhiya hai.",
          en: "This is better than that.",
          vi: "Cái này tốt hơn cái đó.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-11-plans",
    level: "B1",
    focus: "plans",
    title_en: "Talking about plans and intentions",
    title_vi: "Nói về kế hoạch và dự định",
    note_en:
      "Use ਮੈਂ ... ਜਾ ਰਿਹਾ/ਰਹੀ ਹਾਂ for a plan already in motion, and ਮੈਂ ... ਕਰਾਂਗਾ/ਕਰਾਂਗੀ for a future commitment. Add ਸ਼ਾਇਦ (maybe) when uncertain.",
    note_vi:
      "Dùng ਮੈਂ ... ਜਾ ਰਿਹਾ/ਰਹੀ ਹਾਂ cho kế hoạch đang chuẩn bị/đang diễn ra, và ਮੈਂ ... ਕਰਾਂਗਾ/ਕਰਾਂਗੀ cho cam kết tương lai. Thêm ਸ਼ਾਇਦ (có lẽ) khi chưa chắc.",
    examples: [
      {
        pa: "ਮੈਂ ਅਗਲੇ ਮਹੀਨੇ ਕੋਰਸ ਸ਼ੁਰੂ ਕਰਨ ਜਾ ਰਿਹਾ ਹਾਂ।",
        romanization: "main agle mahine course shuru karan ja riha han.",
        en: "I am going to start the course next month.",
        vi: "Tôi sẽ bắt đầu khóa học vào tháng tới.",
      },
      {
        pa: "ਮੈਂ ਕੱਲ੍ਹ ਤੁਹਾਨੂੰ ਜਵਾਬ ਭੇਜਾਂਗਾ।",
        romanization: "main kallh tuhanu jawab bhejanga.",
        en: "I will send you an answer tomorrow.",
        vi: "Ngày mai tôi sẽ gửi câu trả lời cho bạn.",
      },
      {
        pa: "ਸ਼ਾਇਦ ਅਸੀਂ ਸ਼ਾਮ ਨੂੰ ਮਿਲਾਂਗੇ।",
        romanization: "shayad asin shaam nu milange.",
        en: "Maybe we will meet in the evening.",
        vi: "Có lẽ chúng ta sẽ gặp vào buổi tối.",
      },
    ],
    practice: [
      {
        prompt_en:
          "Say your plan for next week and one thing you will do tomorrow.",
        prompt_vi:
          "Nói kế hoạch của bạn cho tuần tới và một việc bạn sẽ làm ngày mai.",
        answers: [
          {
            pa: "ਮੈਂ ਅਗਲੇ ਹਫ਼ਤੇ ਨਵਾਂ ਕੰਮ ਸ਼ੁਰੂ ਕਰਨ ਜਾ ਰਹੀ ਹਾਂ। ਮੈਂ ਕੱਲ੍ਹ ਸਾਰੇ ਦਸਤਾਵੇਜ਼ ਭੇਜਾਂਗੀ।",
            romanization:
              "main agle hafte nava kamm shuru karan ja rahi han. main kallh sare dastavez bhejangi.",
            en: "I am going to start a new job next week. I will send all the documents tomorrow.",
            vi: "Tuần tới tôi sẽ bắt đầu công việc mới. Ngày mai tôi sẽ gửi tất cả tài liệu.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Using a strong future form when you are unsure. Add ਸ਼ਾਇਦ to soften uncertainty.",
        mistake_vi:
          "Dùng dạng tương lai chắc chắn khi bạn chưa chắc. Thêm ਸ਼ਾਇਦ để diễn đạt sự không chắc.",
        correction: {
          pa: "ਸ਼ਾਇਦ ਮੈਂ ਕੱਲ੍ਹ ਆਵਾਂਗਾ।",
          romanization: "shayad main kallh avanga.",
          en: "Maybe I will come tomorrow.",
          vi: "Có lẽ ngày mai tôi sẽ đến.",
        },
      },
    ],
  },
  {
    id: "pa-b1-core-12-public-services",
    level: "B1",
    focus: "public_services",
    title_en: "Using public services",
    title_vi: "Sử dụng dịch vụ công",
    note_en:
      "For public services, be clear and formal: ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ (I need ...), ਫਾਰਮ (form), ਪਤਾ (address), ਪਹਿਚਾਣ ਪੱਤਰ (ID). Punjabi is also written in Shahmukhi in some communities; this course uses Gurmukhi for instruction.",
    note_vi:
      "Khi dùng dịch vụ công, hãy nói rõ và trang trọng: ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ (tôi cần ...), ਫਾਰਮ (mẫu đơn), ਪਤਾ (địa chỉ), ਪਹਿਚਾਣ ਪੱਤਰ (giấy tờ tùy thân). Punjabi cũng được viết bằng Shahmukhi trong một số cộng đồng; khóa này dùng Gurmukhi để học.",
    examples: [
      {
        pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        romanization: "mainu eh form bharan vich madad chahidi hai.",
        en: "I need help filling out this form.",
        vi: "Tôi cần giúp điền mẫu đơn này.",
      },
      {
        pa: "ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ।",
        romanization: "mera pata badal gia hai.",
        en: "My address has changed.",
        vi: "Địa chỉ của tôi đã thay đổi.",
      },
      {
        pa: "ਕੀ ਮੈਨੂੰ ਪਹਿਚਾਣ ਪੱਤਰ ਦਿਖਾਉਣਾ ਪਵੇਗਾ?",
        romanization: "ki mainu pahichan pattar dikhauna pavega?",
        en: "Will I have to show identification?",
        vi: "Tôi có phải xuất trình giấy tờ tùy thân không?",
      },
    ],
    practice: [
      {
        prompt_en:
          "At a public office, ask for help with a form and say your address changed.",
        prompt_vi:
          "Ở cơ quan dịch vụ công, nhờ giúp điền mẫu đơn và nói địa chỉ của bạn đã đổi.",
        answers: [
          {
            pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਮੇਰਾ ਪਤਾ ਬਦਲ ਗਿਆ ਹੈ।",
            romanization:
              "mainu eh form bharan vich madad chahidi hai kyonki mera pata badal gia hai.",
            en: "I need help filling out this form because my address has changed.",
            vi: "Tôi cần giúp điền mẫu đơn này vì địa chỉ của tôi đã thay đổi.",
          },
        ],
      },
    ],
    commonMistakes: [
      {
        mistake_en:
          "Giving a long story before the service request. Start with what you need.",
        mistake_vi:
          "Kể quá dài trước khi nêu yêu cầu dịch vụ. Hãy bắt đầu bằng điều bạn cần.",
        correction: {
          pa: "ਮੈਨੂੰ ਨਵਾਂ ਕਾਰਡ ਚਾਹੀਦਾ ਹੈ।",
          romanization: "mainu nava card chahida hai.",
          en: "I need a new card.",
          vi: "Tôi cần thẻ mới.",
        },
      },
    ],
  },
];
