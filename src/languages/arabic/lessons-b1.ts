// Arabic B1 lessons for Vietnamese learners, with English companion support.
//
// Scope: W2 A5 only. This file aligns its exported lesson array to the shared
// Arabic metadata contract but does not edit metadata, normalizer, pages, or tests.
// Canonical target: Modern Standard Arabic. Dialect notes are recognition-only
// learner notes and are not canonical answer keys.

import type { ArabicLesson as ArabicLessonInput } from "./lessons";

export const lessons: ArabicLessonInput[] = [
  {
    id: "arabic_b1_work_tasks_and_deadlines",
    level: "B1",
    category: "work",
    title_vi: "Công việc, nhiệm vụ và thời hạn",
    title_en: "Work tasks and deadlines",
    intro_vi:
      "Bài này dạy cách nói về công việc, nhiệm vụ, hạn chót và tiến độ bằng tiếng Ả Rập chuẩn hiện đại.",
    intro_en:
      "This lesson teaches how to discuss work, tasks, deadlines, and progress in Modern Standard Arabic.",
    sentences: [
      {
        ar: "أعمل في شركة تكنولوجيا.",
        romanization: "a'malu fii sharikat tiknuluujiyaa.",
        vi: "Tôi làm việc ở một công ty công nghệ.",
        en: "I work at a technology company.",
        pronunciation_focus: [
          "أعمل bắt đầu bằng hamza; đừng bỏ âm ngắt ở đầu.",
          "شركة là idaafa khi đi với lĩnh vực: شركة تكنولوجيا.",
        ],
        pronunciation_focus_en: [
          "أعمل starts with hamza; do not drop the initial glottal stop.",
          "شركة can form an idaafa-like work chunk with the field: شركة تكنولوجيا.",
        ],
      },
      {
        ar: "سأرسل التقرير قبل الاجتماع.",
        romanization: "sa-ursilu at-taqriira qabla al-ijtimaa'.",
        vi: "Tôi sẽ gửi báo cáo trước cuộc họp.",
        en: "I will send the report before the meeting.",
        pronunciation_focus: [
          "سـ gắn vào động từ để nói tương lai gần.",
          "التقرير có âm t lặp trong phát âm vì ال gặp chữ mặt trời ت.",
        ],
        pronunciation_focus_en: [
          "سـ attaches to the verb for near future.",
          "التقرير is pronounced with an assimilated t because ال meets the sun letter ت.",
        ],
      },
      {
        ar: "هل يمكنك أن تشرح المهمة مرة أخرى؟",
        romanization: "hal yumkinuka an tashraha al-muhimmata marratan ukhraa?",
        vi: "Bạn có thể giải thích nhiệm vụ một lần nữa không?",
        en: "Can you explain the task one more time?",
        pronunciation_focus: [
          "هل يمكنك أن... là cách hỏi lịch sự hơn mệnh lệnh trực tiếp.",
          "أخرى kết thúc bằng alif maqsurah; khi gõ có thể dễ nhầm với ي.",
        ],
        pronunciation_focus_en: [
          "هل يمكنك أن... is softer than a direct command.",
          "أخرى ends with alif maqsurah; it is easy to confuse with ي when typing.",
        ],
        dialect_notes: [
          {
            region: "general-spoken",
            ar: "هل يمكنك أن تشرح المهمة؟",
            note_vi:
              "Trong nói chuyện thường ngày, người bản ngữ thường dùng phương ngữ cho câu này. Ở đây, câu chuẩn MSA vẫn là đáp án chính.",
            note_en:
              "In everyday speech, native speakers often use a dialectal form for this request. Here, the MSA sentence remains the canonical answer.",
          },
        ],
      },
      {
        ar: "الموعد النهائي يوم الخميس.",
        romanization: "al-maw'idu an-nihaa'iyyu yawma al-khamiis.",
        vi: "Hạn chót là vào thứ Năm.",
        en: "The deadline is on Thursday.",
        pronunciation_focus: [
          "الموعد có ع ở giữa; không biến nó thành nguyên âm thường.",
          "النهائي là tính từ sau danh từ và có ال giống danh từ xác định.",
        ],
        pronunciation_focus_en: [
          "الموعد has ع in the middle; do not turn it into a plain vowel.",
          "النهائي is an adjective after the noun and carries ال because the noun is definite.",
        ],
      },
    ],
    vocabulary: [
      { ar: "الشركة", romanization: "ash-sharika", vi: "công ty", en: "company", pos: "n.f." },
      { ar: "التقرير", romanization: "at-taqriir", vi: "báo cáo", en: "report", pos: "n.m." },
      { ar: "الاجتماع", romanization: "al-ijtimaa'", vi: "cuộc họp", en: "meeting", pos: "n.m." },
      { ar: "المهمة", romanization: "al-muhimma", vi: "nhiệm vụ", en: "task", pos: "n.f." },
      { ar: "الموعد النهائي", romanization: "al-maw'id an-nihaa'ii", vi: "hạn chót", en: "deadline", pos: "n.m." },
    ],
    dialogue: [
      {
        speaker: "A",
        ar: "هل انتهيت من التقرير؟",
        romanization: "hal intahayta min at-taqriir?",
        vi: "Bạn đã hoàn thành báo cáo chưa?",
        en: "Have you finished the report?",
      },
      {
        speaker: "B",
        ar: "ليس بعد، لكنني سأرسله قبل الاجتماع.",
        romanization: "laysa ba'd, laakinnanii sa-ursiluhu qabla al-ijtimaa'.",
        vi: "Chưa, nhưng tôi sẽ gửi nó trước cuộc họp.",
        en: "Not yet, but I will send it before the meeting.",
      },
    ],
    cultural_notes_vi:
      "Trong môi trường công sở dùng tiếng Ả Rập chuẩn, câu hỏi lịch sự và thời hạn rõ ràng quan trọng hơn câu ngắn kiểu mệnh lệnh. Ngoài đời, đồng nghiệp có thể chuyển sang phương ngữ.",
    cultural_notes_en:
      "In an MSA workplace context, polite questions and clear deadlines matter more than short command-like phrasing. In daily life, colleagues may switch to a dialect.",
    tip_advice_vi:
      "Học theo cụm: سأرسل... قبل... (Tôi sẽ gửi... trước...). Cụm này dùng được cho báo cáo, email, tài liệu và bài tập.",
    tip_advice_en:
      "Learn the chunk سأرسل... قبل... (I will send... before...). It works for reports, emails, documents, and homework.",
    register_notes_vi:
      "هل يمكنك أن... trung tính/lịch sự. يرجى... trang trọng hơn và phù hợp trong email hoặc thông báo.",
    register_notes_en:
      "هل يمكنك أن... is neutral and polite. يرجى... is more formal and fits emails or notices.",
    exercises: [
      {
        type: "fill-blank",
        question: "سأرسل التقرير ___ الاجتماع.",
        answer: "قبل",
        hint_vi: "giới từ nghĩa là 'trước'",
        hint_en: "the preposition meaning 'before'",
      },
      {
        type: "translation",
        vi: "Tôi sẽ gửi báo cáo trước cuộc họp.",
        en: "I will send the report before the meeting.",
        ar: "سأرسل التقرير قبل الاجتماع.",
      },
    ],
  },
  {
    id: "arabic_b1_health_clinic_symptoms",
    level: "B1",
    category: "health",
    title_vi: "Mô tả triệu chứng ở phòng khám",
    title_en: "Describing symptoms at a clinic",
    intro_vi:
      "Bài này luyện cách nói triệu chứng, thời gian bắt đầu và mức độ đau bằng MSA an toàn, không đưa lời khuyên y khoa.",
    intro_en:
      "This lesson practices symptoms, onset, and pain level in safe MSA language without giving medical advice.",
    sentences: [
      {
        ar: "عندي ألم في الحلق منذ يومين.",
        romanization: "'indii alam fii al-halq mundhu yawmayn.",
        vi: "Tôi bị đau họng từ hai ngày nay.",
        en: "I have had throat pain for two days.",
        pronunciation_focus: [
          "عندي là 'ở tôi/có ở tôi', dùng như 'tôi có'.",
          "منذ + khoảng thời gian diễn tả 'từ ... nay'.",
        ],
        pronunciation_focus_en: [
          "عندي literally means 'at me' and functions like 'I have'.",
          "منذ + time span expresses 'for/since'.",
        ],
      },
      {
        ar: "بدأ الصداع أمس في المساء.",
        romanization: "bada'a as-sudaa'u ams fii al-masaa'.",
        vi: "Cơn đau đầu bắt đầu tối hôm qua.",
        en: "The headache started yesterday evening.",
        pronunciation_focus: [
          "بدأ có hamza cuối; giữ âm ngắt nhẹ.",
          "الصداع có ص emphatic; không đọc như س thường.",
        ],
        pronunciation_focus_en: [
          "بدأ ends with hamza; keep the light glottal stop.",
          "الصداع has emphatic ص; do not pronounce it like plain س.",
        ],
      },
      {
        ar: "هل أحتاج إلى موعد آخر؟",
        romanization: "hal ahtaaju ilaa maw'id aakhar?",
        vi: "Tôi có cần một lịch hẹn khác không?",
        en: "Do I need another appointment?",
        pronunciation_focus: [
          "أحتاج إلى là cụm cố định: cần đến/cần một việc gì.",
          "موعد có ع ở giữa, không thấy trong chữ Latin nhưng là phụ âm thật.",
        ],
        pronunciation_focus_en: [
          "أحتاج إلى is a fixed chunk for 'need'.",
          "موعد contains ع, a real consonant even though romanization only approximates it.",
        ],
      },
      {
        ar: "لا أستطيع النوم جيدًا بسبب السعال.",
        romanization: "laa astatii'u an-nawma jayyidan bisababi as-su'aal.",
        vi: "Tôi không thể ngủ ngon vì ho.",
        en: "I cannot sleep well because of the cough.",
        pronunciation_focus: [
          "لا أستطيع + danh động từ/động từ dùng để nói không thể.",
          "بسبب + danh từ diễn tả nguyên nhân.",
        ],
        pronunciation_focus_en: [
          "لا أستطيع + verbal noun/verb expresses inability.",
          "بسبب + noun expresses the cause.",
        ],
      },
    ],
    vocabulary: [
      { ar: "الألم", romanization: "al-alam", vi: "cơn đau", en: "pain", pos: "n.m." },
      { ar: "الحلق", romanization: "al-halq", vi: "cổ họng", en: "throat", pos: "n.m." },
      { ar: "الصداع", romanization: "as-sudaa'", vi: "đau đầu", en: "headache", pos: "n.m." },
      { ar: "السعال", romanization: "as-su'aal", vi: "ho", en: "cough", pos: "n.m." },
      { ar: "الموعد", romanization: "al-maw'id", vi: "lịch hẹn", en: "appointment", pos: "n.m." },
    ],
    dialogue: [
      {
        speaker: "Doctor",
        ar: "متى بدأ الألم؟",
        romanization: "mataa bada'a al-alam?",
        vi: "Cơn đau bắt đầu khi nào?",
        en: "When did the pain start?",
      },
      {
        speaker: "Patient",
        ar: "بدأ أمس، وأشعر بالتعب اليوم.",
        romanization: "bada'a ams, wa-ash'uru bit-ta'ab al-yawm.",
        vi: "Nó bắt đầu hôm qua, và hôm nay tôi thấy mệt.",
        en: "It started yesterday, and I feel tired today.",
      },
    ],
    cultural_notes_vi:
      "Bài học chỉ cung cấp ngôn ngữ để mô tả tình trạng và đặt câu hỏi. Nội dung không thay thế bác sĩ, dược sĩ hoặc hướng dẫn y tế.",
    cultural_notes_en:
      "This lesson only provides language for describing a condition and asking questions. It does not replace a doctor, pharmacist, or medical guidance.",
    tip_advice_vi:
      "Dùng khung: عندي + triệu chứng + منذ + thời gian. Đây là cách an toàn để nói vấn đề mà không cần tự chẩn đoán.",
    tip_advice_en:
      "Use the frame عندي + symptom + منذ + time. It is a safe way to describe a problem without self-diagnosing.",
    register_notes_vi:
      "Với nhân viên y tế, câu ngắn, rõ và lịch sự tốt hơn nói vòng vo. Dùng هل أحتاج إلى... để hỏi bước tiếp theo.",
    register_notes_en:
      "With medical staff, short, clear, polite sentences work better than vague language. Use هل أحتاج إلى... to ask about next steps.",
    exercises: [
      {
        type: "fill-blank",
        question: "عندي ألم في الحلق ___ يومين.",
        answer: "منذ",
        hint_vi: "dùng từ nghĩa là 'từ ... nay'",
        hint_en: "use the word meaning 'for/since'",
      },
      {
        type: "translation",
        vi: "Tôi không thể ngủ ngon vì ho.",
        en: "I cannot sleep well because of the cough.",
        ar: "لا أستطيع النوم جيدًا بسبب السعال.",
      },
    ],
  },
  {
    id: "arabic_b1_public_service_documents",
    level: "B1",
    category: "public_services",
    title_vi: "Giấy tờ và dịch vụ công",
    title_en: "Documents and public services",
    intro_vi:
      "Bài này dạy cách hỏi về biểu mẫu, giấy tờ, giờ làm việc và yêu cầu hành chính bằng MSA trang trọng vừa phải.",
    intro_en:
      "This lesson teaches how to ask about forms, documents, office hours, and administrative requirements in moderately formal MSA.",
    sentences: [
      {
        ar: "أريد أن أقدم طلبًا جديدًا.",
        romanization: "uriidu an uqaddima talaban jadiidan.",
        vi: "Tôi muốn nộp một đơn mới.",
        en: "I want to submit a new application.",
        pronunciation_focus: [
          "أريد أن + động từ là khung B1 rất hữu ích.",
          "طلبًا có tanwin trong văn bản có dấu; đáp án gõ có thể không cần dấu.",
        ],
        pronunciation_focus_en: [
          "أريد أن + verb is a useful B1 frame.",
          "طلبًا has tanwin in vowelled text; typed answers may not include the mark.",
        ],
      },
      {
        ar: "ما الوثائق المطلوبة؟",
        romanization: "maa al-wathaa'iq al-matluuba?",
        vi: "Những giấy tờ cần thiết là gì?",
        en: "What documents are required?",
        pronunciation_focus: [
          "الوثائق số nhiều không đều; học như một cụm.",
          "المطلوبة là tính từ bị động: được yêu cầu/cần thiết.",
        ],
        pronunciation_focus_en: [
          "الوثائق is an irregular plural; learn it as a chunk.",
          "المطلوبة is a passive adjective: required.",
        ],
      },
      {
        ar: "هل يجب أن أحجز موعدًا قبل الزيارة؟",
        romanization: "hal yajibu an ahjiza maw'idan qabla az-ziyaara?",
        vi: "Tôi có phải đặt lịch hẹn trước khi đến không?",
        en: "Do I have to book an appointment before the visit?",
        pronunciation_focus: [
          "يجب أن... diễn tả 'phải/cần phải'.",
          "الزيارة có ال + ز; không phải chữ mặt trời, nên không đồng hóa như ت hay س.",
        ],
        pronunciation_focus_en: [
          "يجب أن... expresses obligation.",
          "الزيارة has ال + ز; this does not assimilate like ت or س.",
        ],
      },
      {
        ar: "مكتب الاستقبال في الطابق الأول.",
        romanization: "maktab al-istiqbaal fii at-taabiq al-awwal.",
        vi: "Quầy tiếp tân ở tầng một.",
        en: "The reception office is on the first floor.",
        pronunciation_focus: [
          "مكتب الاستقبال là idaafa: văn phòng/quầy của việc tiếp nhận.",
          "الأول bắt đầu bằng hamza; trong nói nối có thể nhẹ hơn.",
        ],
        pronunciation_focus_en: [
          "مكتب الاستقبال is an idaafa: office/desk of reception.",
          "الأول begins with hamza; it may soften in connected speech.",
        ],
      },
    ],
    vocabulary: [
      { ar: "الطلب", romanization: "at-talab", vi: "đơn/yêu cầu", en: "application/request", pos: "n.m." },
      { ar: "الوثائق", romanization: "al-wathaa'iq", vi: "giấy tờ", en: "documents", pos: "n.pl." },
      { ar: "الموعد", romanization: "al-maw'id", vi: "lịch hẹn", en: "appointment", pos: "n.m." },
      { ar: "مكتب الاستقبال", romanization: "maktab al-istiqbaal", vi: "quầy tiếp tân", en: "reception desk", pos: "n." },
      { ar: "الطابق الأول", romanization: "at-taabiq al-awwal", vi: "tầng một", en: "first floor", pos: "n.m." },
    ],
    dialogue: [
      {
        speaker: "Visitor",
        ar: "ما الوثائق المطلوبة لهذا الطلب؟",
        romanization: "maa al-wathaa'iq al-matluuba li-haadhaa at-talab?",
        vi: "Những giấy tờ cần thiết cho đơn này là gì?",
        en: "What documents are required for this application?",
      },
      {
        speaker: "Clerk",
        ar: "تحتاج إلى جواز السفر وصورة شخصية.",
        romanization: "tahtaaju ilaa jawaaz as-safar wa-suura shakhsiiyya.",
        vi: "Bạn cần hộ chiếu và một ảnh cá nhân.",
        en: "You need a passport and a personal photo.",
      },
    ],
    cultural_notes_vi:
      "Ngôn ngữ hành chính MSA thường dùng danh từ và tính từ bị động như المطلوبة. Người học nên nhận diện cấu trúc trước khi cố nói quá trang trọng.",
    cultural_notes_en:
      "Administrative MSA often uses nouns and passive adjectives such as المطلوبة. Learners should recognize these structures before trying to sound highly formal.",
    tip_advice_vi:
      "Khi không chắc, dùng câu hỏi trực tiếp: ما الوثائق المطلوبة؟ và أين مكتب الاستقبال؟ Rõ ràng quan trọng hơn văn hoa.",
    tip_advice_en:
      "When unsure, use direct questions: ما الوثائق المطلوبة؟ and أين مكتب الاستقبال؟ Clarity matters more than fancy wording.",
    register_notes_vi:
      "أريد أن أقدم... trung tính. أود أن أقدم... trang trọng hơn và phù hợp khi viết email.",
    register_notes_en:
      "أريد أن أقدم... is neutral. أود أن أقدم... is more formal and fits written requests.",
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm MSA với nghĩa tiếng Việt.",
        instruction_en: "Match each MSA phrase with its meaning.",
        pairs: [
          { ar: "الوثائق المطلوبة", meaning_vi: "giấy tờ cần thiết", meaning_en: "required documents" },
          { ar: "أحجز موعدًا", meaning_vi: "tôi đặt lịch hẹn", meaning_en: "I book an appointment" },
          { ar: "مكتب الاستقبال", meaning_vi: "quầy tiếp tân", meaning_en: "reception desk" },
        ],
      },
      {
        type: "translation",
        vi: "Những giấy tờ cần thiết là gì?",
        en: "What documents are required?",
        ar: "ما الوثائق المطلوبة؟",
      },
    ],
  },
  {
    id: "arabic_b1_opinions_reasons",
    level: "B1",
    category: "opinions",
    title_vi: "Nêu ý kiến và lý do",
    title_en: "Giving opinions and reasons",
    intro_vi:
      "Bài này luyện cách nêu ý kiến, đưa lý do, đồng ý một phần và phản đối nhẹ trong MSA.",
    intro_en:
      "This lesson practices giving opinions, reasons, partial agreement, and gentle disagreement in MSA.",
    sentences: [
      {
        ar: "أعتقد أن الدراسة عبر الإنترنت مفيدة.",
        romanization: "a'taqidu anna ad-diraasa 'abra al-internet mufiida.",
        vi: "Tôi nghĩ rằng học trực tuyến là hữu ích.",
        en: "I think online study is useful.",
        pronunciation_focus: [
          "أعتقد أن... cần أن/anna để nối mệnh đề ý kiến.",
          "مفيدة giống giống cái vì الدراسة là danh từ giống cái.",
        ],
        pronunciation_focus_en: [
          "أعتقد أن... needs أن/anna to link the opinion clause.",
          "مفيدة is feminine because الدراسة is grammatically feminine.",
        ],
      },
      {
        ar: "السبب الرئيسي هو أنها توفر الوقت.",
        romanization: "as-sabab ar-ra'iisii huwa annahaa tuwaffiru al-waqt.",
        vi: "Lý do chính là nó tiết kiệm thời gian.",
        en: "The main reason is that it saves time.",
        pronunciation_focus: [
          "السبب الرئيسي là cụm tốt để mở lý do.",
          "توفر có chủ ngữ giống cái vì quay lại الدراسة.",
        ],
        pronunciation_focus_en: [
          "السبب الرئيسي is a useful chunk for introducing a reason.",
          "توفر has a feminine subject because it refers back to الدراسة.",
        ],
      },
      {
        ar: "أفهم رأيك، ولكنني لا أتفق تمامًا.",
        romanization: "afhamu ra'yaka, walaakinnanii laa attafiqu tamaaman.",
        vi: "Tôi hiểu ý kiến của bạn, nhưng tôi không hoàn toàn đồng ý.",
        en: "I understand your opinion, but I do not completely agree.",
        pronunciation_focus: [
          "أفهم رأيك mở đầu mềm hơn nói 'bạn sai'.",
          "تمامًا có tanwin; trong gõ thường có thể bỏ dấu.",
        ],
        pronunciation_focus_en: [
          "أفهم رأيك softens disagreement more than saying 'you are wrong'.",
          "تمامًا has tanwin; typed answers often omit the mark.",
        ],
      },
      {
        ar: "من ناحية أخرى، يحتاج بعض الطلاب إلى الصف التقليدي.",
        romanization: "min naahiya ukhraa, yahtaaju ba'd at-tullaab ilaa as-saff at-taqliidii.",
        vi: "Mặt khác, một số học sinh cần lớp học truyền thống.",
        en: "On the other hand, some students need a traditional classroom.",
        pronunciation_focus: [
          "من ناحية أخرى là khung nối ý B1/B2 quan trọng.",
          "بعض + số nhiều thường vẫn dùng động từ số ít nam trong MSA chuẩn ở đây.",
        ],
        pronunciation_focus_en: [
          "من ناحية أخرى is an important B1/B2 connector.",
          "بعض + plural often still uses a masculine singular verb in standard MSA here.",
        ],
      },
    ],
    vocabulary: [
      { ar: "أعتقد أن", romanization: "a'taqidu anna", vi: "tôi nghĩ rằng", en: "I think that", pos: "phrase" },
      { ar: "الرأي", romanization: "ar-ra'y", vi: "ý kiến", en: "opinion", pos: "n.m." },
      { ar: "السبب", romanization: "as-sabab", vi: "lý do", en: "reason", pos: "n.m." },
      { ar: "مفيد", romanization: "mufiid", vi: "hữu ích", en: "useful", pos: "adj." },
      { ar: "من ناحية أخرى", romanization: "min naahiya ukhraa", vi: "mặt khác", en: "on the other hand", pos: "connector" },
    ],
    dialogue: [
      {
        speaker: "A",
        ar: "ما رأيك في الدراسة عبر الإنترنت؟",
        romanization: "maa ra'yuka fii ad-diraasa 'abra al-internet?",
        vi: "Ý kiến của bạn về học trực tuyến là gì?",
        en: "What is your opinion about online study?",
      },
      {
        speaker: "B",
        ar: "أعتقد أنها مفيدة، ولكنها لا تناسب الجميع.",
        romanization: "a'taqidu annahaa mufiida, walaakinnahaa laa tunaasibu al-jamii'.",
        vi: "Tôi nghĩ nó hữu ích, nhưng nó không phù hợp với tất cả mọi người.",
        en: "I think it is useful, but it does not suit everyone.",
      },
    ],
    cultural_notes_vi:
      "Trong MSA học thuật hoặc công sở, ý kiến thường cần khung: quan điểm, lý do, ví dụ hoặc nhượng bộ. Cách nói quá trực tiếp dễ nghe cứng.",
    cultural_notes_en:
      "In academic or workplace MSA, an opinion usually needs a frame: stance, reason, example, or concession. Very direct disagreement can sound harsh.",
    tip_advice_vi:
      "Học bốn khung: أعتقد أن... / السبب الرئيسي هو... / أفهم رأيك، ولكن... / من ناحية أخرى...",
    tip_advice_en:
      "Memorize four frames: أعتقد أن... / السبب الرئيسي هو... / أفهم رأيك، ولكن... / من ناحية أخرى...",
    register_notes_vi:
      "لا أتفق تمامًا lịch sự hơn لا أوافق hoặc أنت مخطئ. Dùng khi phản biện trong lớp hoặc họp.",
    register_notes_en:
      "لا أتفق تمامًا is more polite than لا أوافق or أنت مخطئ. Use it for class or meeting disagreement.",
    exercises: [
      {
        type: "fill-blank",
        question: "أعتقد ___ الدراسة عبر الإنترنت مفيدة.",
        answer: "أن",
        hint_vi: "từ nối mệnh đề sau 'tôi nghĩ'",
        hint_en: "the linker after 'I think'",
      },
      {
        type: "translation",
        vi: "Tôi hiểu ý kiến của bạn, nhưng tôi không hoàn toàn đồng ý.",
        en: "I understand your opinion, but I do not completely agree.",
        ar: "أفهم رأيك، ولكنني لا أتفق تمامًا.",
      },
    ],
  },
  {
    id: "arabic_b1_past_narration_delay",
    level: "B1",
    category: "past_narration",
    title_vi: "Kể một sự việc trong quá khứ",
    title_en: "Narrating a past event",
    intro_vi:
      "Bài này luyện kể một chuỗi sự việc đơn giản trong quá khứ, giải thích lý do đến muộn và kết thúc bằng giải pháp.",
    intro_en:
      "This lesson practices narrating a simple past sequence, explaining a delay, and ending with a solution.",
    sentences: [
      {
        ar: "خرجت من البيت في السابعة صباحًا.",
        romanization: "kharajtu min al-bayt fii as-saabi'a sabaahan.",
        vi: "Tôi rời nhà lúc bảy giờ sáng.",
        en: "I left home at seven in the morning.",
        pronunciation_focus: [
          "خرجت kết thúc bằng -ت cho 'tôi' trong quá khứ.",
          "في السابعة là cách nói giờ; số giống cái vì الساعة hiểu ngầm.",
        ],
        pronunciation_focus_en: [
          "خرجت ends in -tu for 'I' in the past tense.",
          "في السابعة is a time expression; the number is feminine because الساعة is understood.",
        ],
      },
      {
        ar: "بعد ذلك، انتظرت الحافلة عشرين دقيقة.",
        romanization: "ba'da dhaalik, intazartu al-haafila 'ishriina daqiiqa.",
        vi: "Sau đó, tôi đợi xe buýt hai mươi phút.",
        en: "After that, I waited for the bus for twenty minutes.",
        pronunciation_focus: [
          "بعد ذلك nối các sự kiện theo thứ tự.",
          "عشرين دقيقة: danh từ sau số ở dạng số ít trong cụm này.",
        ],
        pronunciation_focus_en: [
          "بعد ذلك links events in order.",
          "عشرين دقيقة: the noun after this number appears singular in this chunk.",
        ],
      },
      {
        ar: "وصلت إلى المكتب متأخرًا لأن الطريق كان مزدحمًا.",
        romanization: "wasaltu ilaa al-maktab muta'akhkhiran li'anna at-tariiq kaana muzdahiman.",
        vi: "Tôi đến văn phòng muộn vì đường bị đông.",
        en: "I arrived at the office late because the road was crowded.",
        pronunciation_focus: [
          "لأن nối lý do; sau nó thường có mệnh đề đầy đủ.",
          "متأخرًا có hamza giữa từ và tanwin cuối trong văn bản có dấu.",
        ],
        pronunciation_focus_en: [
          "لأن introduces a reason and is usually followed by a full clause.",
          "متأخرًا contains hamza inside the word and tanwin at the end in vowelled text.",
        ],
        dialect_notes: [
          {
            region: "general-spoken",
            ar: "وصلت متأخرًا لأن الطريق كان مزدحمًا.",
            note_vi:
              "Câu này có thể nghe trang trọng trong nói chuyện hằng ngày, nhưng rất phù hợp cho văn bản, lớp học và tình huống chính thức.",
            note_en:
              "This sentence may sound formal in daily speech, but it fits writing, class, and official situations well.",
          },
        ],
      },
      {
        ar: "في النهاية، اتصلت بزميلي وشرحت المشكلة.",
        romanization: "fii an-nihaaya, ittasaltu bi-zamiilii wa-sharahtu al-mushkila.",
        vi: "Cuối cùng, tôi gọi cho đồng nghiệp và giải thích vấn đề.",
        en: "In the end, I called my colleague and explained the problem.",
        pronunciation_focus: [
          "في النهاية đánh dấu phần kết của câu chuyện.",
          "اتصلت بـ nghĩa là gọi/liên lạc với ai.",
        ],
        pronunciation_focus_en: [
          "في النهاية marks the end of the story.",
          "اتصلت بـ means called/contacted someone.",
        ],
      },
    ],
    vocabulary: [
      { ar: "خرجت", romanization: "kharajtu", vi: "tôi đã rời/đi ra", en: "I left/went out", pos: "v." },
      { ar: "انتظرت", romanization: "intazartu", vi: "tôi đã đợi", en: "I waited", pos: "v." },
      { ar: "وصلت", romanization: "wasaltu", vi: "tôi đã đến", en: "I arrived", pos: "v." },
      { ar: "مزدحم", romanization: "muzdahim", vi: "đông/ùn tắc", en: "crowded/congested", pos: "adj." },
      { ar: "في النهاية", romanization: "fii an-nihaaya", vi: "cuối cùng", en: "in the end", pos: "connector" },
    ],
    dialogue: [
      {
        speaker: "Manager",
        ar: "لماذا وصلت متأخرًا اليوم؟",
        romanization: "limaadhaa wasalta muta'akhkhiran al-yawm?",
        vi: "Tại sao hôm nay bạn đến muộn?",
        en: "Why did you arrive late today?",
      },
      {
        speaker: "Employee",
        ar: "أعتذر. انتظرت الحافلة طويلًا، ثم اتصلت بزميلي.",
        romanization: "a'tadhir. intazartu al-haafila tawiilan, thumma ittasaltu bi-zamiilii.",
        vi: "Tôi xin lỗi. Tôi đã đợi xe buýt lâu, rồi gọi cho đồng nghiệp.",
        en: "I apologize. I waited for the bus for a long time, then called my colleague.",
      },
    ],
    cultural_notes_vi:
      "Khi giải thích việc đến muộn bằng MSA, trình tự rõ ràng và một lời xin lỗi ngắn thường hiệu quả hơn một câu chuyện dài.",
    cultural_notes_en:
      "When explaining lateness in MSA, a clear sequence and a short apology usually work better than a long story.",
    tip_advice_vi:
      "Dùng khung kể chuyện: أولًا / بعد ذلك / لأن / في النهاية. B1 không cần văn chương; cần rõ thứ tự và lý do.",
    tip_advice_en:
      "Use the story frame: أولًا / بعد ذلك / لأن / في النهاية. At B1, clarity of order and reason matters more than style.",
    register_notes_vi:
      "أعتذر trang trọng hơn آسف. Trong công việc hoặc dịch vụ công, أعتذر nghe chuyên nghiệp hơn.",
    register_notes_en:
      "أعتذر is more formal than آسف. At work or in public services, أعتذر sounds more professional.",
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ nối với vai trò trong câu chuyện.",
        instruction_en: "Match each connector with its role in the story.",
        pairs: [
          { ar: "أولًا", meaning_vi: "mở đầu", meaning_en: "opening" },
          { ar: "بعد ذلك", meaning_vi: "sự kiện tiếp theo", meaning_en: "next event" },
          { ar: "في النهاية", meaning_vi: "kết thúc", meaning_en: "ending" },
        ],
      },
      {
        type: "translation",
        vi: "Tôi đến văn phòng muộn vì đường bị đông.",
        en: "I arrived at the office late because the road was crowded.",
        ar: "وصلت إلى المكتب متأخرًا لأن الطريق كان مزدحمًا.",
      },
    ],
  },
];

export default lessons;
