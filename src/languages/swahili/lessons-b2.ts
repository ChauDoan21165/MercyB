// src/languages/swahili/lessons-b2.ts

import type { SwahiliLesson } from "./lessons";

export const lessons: SwahiliLesson[] = [
  {
    id: "swahili_b2_media_news_summary",
    level: "B2",
    category: "media",
    title_vi: "Đọc tin tức Kiswahili với giọng trung lập",
    title_en: "Reading Swahili news with a neutral tone",
    intro_vi:
      "Học cách đọc và tóm tắt tin tức bằng tiếng Swahili — giữ giọng trung lập, quy nguồn chính xác, tránh thêm cảm xúc cá nhân.",
    intro_en:
      "Learn to read and summarize news in Swahili — stay neutral, attribute sources accurately, and avoid adding personal emotion.",
    sentences: [
      {
        sw: "Kulingana na gazeti la Daily News, bei ya mafuta itapanda mwezi ujao.",
        en: "According to the Daily News, fuel prices will rise next month.",
        vi: "Theo báo Daily News, giá xăng dầu sẽ tăng vào tháng tới.",
        pronunciation_focus: [
          "ku-li-NGA-na = theo như, dựa theo",
          "ga-ZE-ti = báo (lớp danh từ 5)",
          "i-ta-PAN-da = nó sẽ tăng (chủ ngữ lớp 9)",
          "MWE-zi u-JA-o = tháng tới",
        ],
        pronunciation_focus_en: [
          "kulingana na = according to",
          "gazeti = newspaper (noun class 5)",
          "itapanda = it will rise (class 9 subject)",
          "mwezi ujao = next month",
        ],
      },
      {
        sw: "Waziri alisema kuwa serikali itachukua hatua mapema.",
        en: "The minister said that the government will take action soon.",
        vi: "Bộ trưởng nói rằng chính phủ sẽ hành động sớm.",
        pronunciation_focus: [
          "wa-ZI-ri = bộ trưởng",
          "a-li-SE-ma = ông ấy đã nói",
          "KU-wa = rằng (liên từ tường thuật)",
          "ha-TU-a = bước đi, hành động",
        ],
        pronunciation_focus_en: [
          "waziri = minister",
          "alisema = he/she said",
          "kuwa = that (reporting conjunction)",
          "hatua = steps / action",
        ],
      },
      {
        sw: "Ripoti hiyo inaonyesha kuwa hali ya hewa inabadilika haraka.",
        en: "The report shows that the climate is changing rapidly.",
        vi: "Bản báo cáo đó cho thấy khí hậu đang thay đổi nhanh chóng.",
        pronunciation_focus: [
          "ri-PO-ti HI-yo = bản báo cáo đó",
          "i-na-o-NYE-sha = nó cho thấy",
          "HA-li ya HE-wa = khí hậu, thời tiết",
          "i-na-ba-di-LI-ka = nó đang thay đổi (dạng stative)",
        ],
        pronunciation_focus_en: [
          "ripoti hiyo = that report",
          "inaonyesha = it shows",
          "hali ya hewa = climate / weather conditions",
          "inabadilika = it is changing (stative form)",
        ],
      },
    ],
    cultural_notes_vi:
      "Báo chí Kiswahili (kama Daily News, Mwananchi, HabariLeo) dùng giọng trang trọng và quy nguồn rõ ràng. " +
      "Cụm 'kulingana na' (theo như), 'alisema' (đã nói), na 'imeelezwa' (được cho biết) giúp giữ giọng trung lập " +
      "và tránh suy diễn cá nhân. Người Tanzania đánh giá cao sự khách quan trong thảo luận công cộng.",
    cultural_notes_en:
      "Swahili newspapers (like Daily News, Mwananchi, HabariLeo) use formal tone and clear attribution. " +
      "Phrases like 'kulingana na' (according to), 'alisema' (said), and 'imeelezwa' (it was explained) keep the " +
      "tone neutral and avoid personal inference. Tanzanians value objectivity in public discourse.",
    tip_advice_vi:
      "Khi tự tóm tắt tin: bắt đầu với 'Kulingana na [nguồn]', dùng 'alisema' thay vì tự kết luận, " +
      "và tránh thêm 'nadhani' (tôi nghĩ) hay 'labda' (có lẽ). Mẫu hay: Kulingana na ___, ___. Aliongeza kuwa ___.",
    tip_advice_en:
      "When summarizing news: start with 'Kulingana na [source]', use 'alisema' instead of drawing your own conclusion, " +
      "and avoid adding 'nadhani' (I think) or 'labda' (maybe). Good pattern: Kulingana na ___, ___. Aliongeza kuwa ___.",
    vocabulary: [
      {
        cell_id: "84d4e436-5152-4608-8271-2f0843511c84",
        word: "gazeti",
        en: "newspaper",
        vi: "báo",
        pos: "noun (class 5/6)",
        pronunciation_vi: "ga-ZE-ti",
        pronunciation_en: "gah-ZEH-tee",
      },
      {
        cell_id: "e8f3b292-0917-4e7c-ac02-81f10daf301b",
        word: "bei",
        en: "price",
        vi: "giá cả",
        pos: "noun (class 9/10)",
        pronunciation_vi: "BE-i",
        pronunciation_en: "BEH-ee",
      },
      {
        cell_id: "cb1552f0-60fc-4265-aa7c-8d22eb751b0d",
        word: "hatua",
        en: "step / action / measure",
        vi: "bước đi / hành động / biện pháp",
        pos: "noun (class 9/10)",
        pronunciation_vi: "ha-TU-a",
        pronunciation_en: "hah-TOO-ah",
      },
      {
        cell_id: "db6eb97e-1667-469c-9391-150df8235a6c",
        word: "kuchukua hatua",
        en: "to take action",
        vi: "hành động, ra tay",
        pos: "verb phrase",
        pronunciation_vi: "ku-chu-KU-a ha-TU-a",
        pronunciation_en: "koo-choo-KOO-ah hah-TOO-ah",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Kulingana ____ gazeti, bei itapanda.",
        answer: "na",
        hint_vi: "Theo như...",
        hint_en: "According to...",
      },
      {
        type: "translation",
        vietnamese: "Theo báo cáo, khí hậu đang thay đổi.",
        english: "According to the report, the climate is changing.",
        swahili: "Kulingana na ripoti, hali ya hewa inabadilika.",
      },
    ],
  },

  {
    id: "swahili_b2_workplace_communication",
    level: "B2",
    category: "workplace",
    title_vi: "Giao tiếp công sở chuyên nghiệp",
    title_en: "Professional workplace communication",
    intro_vi:
      "Viết email, đề xuất và phản hồi bằng tiếng Swahili với văn phong lịch sự, hợp tác — không đổ lỗi trực tiếp.",
    intro_en:
      "Write emails, proposals, and feedback in Swahili with a polite, collaborative tone — without direct blame.",
    sentences: [
      {
        sw: "Tafadhali nijulishe ikiwa utaweza kuhudhuria mkutano wa kesho.",
        en: "Please let me know if you will be able to attend tomorrow's meeting.",
        vi: "Vui lòng cho tôi biết nếu anh/chị có thể tham dự cuộc họp ngày mai.",
        pronunciation_focus: [
          "ta-fa-DHA-li = xin vui lòng (từ gốc Ả Rập)",
          "ni-JU-li-she = hãy cho tôi biết (subjunctive)",
          "i-KI-wa = nếu, liệu rằng",
          "ku-hu-dhu-RI-a = tham dự",
        ],
        pronunciation_focus_en: [
          "tafadhali = please (Arabic loanword)",
          "nijulishe = inform me (subjunctive)",
          "ikiwa = if / whether",
          "kuhudhuria = to attend",
        ],
      },
      {
        sw: "Ningependa kupendekeza njia mbadala ya kutatua tatizo hili.",
        en: "I would like to propose an alternative way to solve this problem.",
        vi: "Tôi muốn đề xuất một cách khác để giải quyết vấn đề này.",
        pronunciation_focus: [
          "ni-nge-PEN-da = tôi muốn (điều kiện lịch sự)",
          "ku-pen-de-KE-za = đề xuất",
          "NJia m-BA-da-la = cách thay thế",
          "ku-ta-TU-a = giải quyết",
        ],
        pronunciation_focus_en: [
          "ningependa = I would like (polite conditional)",
          "kupendekeza = to propose",
          "njia mbadala = alternative way",
          "kutatua = to solve",
        ],
      },
      {
        sw: "Tunaweza kukutana tena wiki ijayo ili kujadili maendeleo.",
        en: "We can meet again next week to discuss progress.",
        vi: "Chúng ta có thể gặp lại vào tuần tới để thảo luận tiến độ.",
        pronunciation_focus: [
          "tu-na-WE-za = chúng ta có thể",
          "ku-ku-TA-na = gặp nhau (dạng reciprocal)",
          "WI-ki i-JA-yo = tuần tới",
          "i-li = để (liên từ chỉ mục đích)",
        ],
        pronunciation_focus_en: [
          "tunaweza = we can",
          "kukutana = to meet each other (reciprocal)",
          "wiki ijayo = next week",
          "ili = in order to",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong môi trường công sở Đông Phi, lời chào mở đầu rất quan trọng — luôn bắt đầu email với 'Habari za asubuhi?' " +
      "hoặc 'Natumaini uko salama.' Tránh đi thẳng vào vấn đề như văn phong phương Tây. " +
      "Dùng 'tafadhali' và dạng subjunctive (nijulishe, upange) thay vì mệnh lệnh trực tiếp để giữ phép lịch sự.",
    cultural_notes_en:
      "In East African workplaces, opening greetings matter — always start an email with 'Habari za asubuhi?' " +
      "or 'Natumaini uko salama.' Avoid jumping straight into business as in Western style. " +
      "Use 'tafadhali' and subjunctive forms (nijulishe, upange) instead of direct imperatives to stay polite.",
    tip_advice_vi:
      "Cấu trúc email lịch sự: (1) Chào hỏi, (2) Nêu mục đích với 'Ningependa' hoặc 'Naomba', " +
      "(3) Đề xuất với 'Tunashauri' hoặc 'Inafaa', (4) Kết thúc với 'Asante kwa ushirikiano wako.'",
    tip_advice_en:
      "Polite email structure: (1) Greeting, (2) State purpose with 'Ningependa' or 'Naomba', " +
      "(3) Propose with 'Tunashauri' or 'Inafaa', (4) Close with 'Asante kwa ushirikiano wako.'",
    vocabulary: [
      {
        cell_id: "1acbf623-312c-439a-a22a-82db25745996",
        word: "kupendekeza",
        en: "to propose / suggest",
        vi: "đề xuất",
        pos: "verb",
        pronunciation_vi: "ku-pen-de-KE-za",
        pronunciation_en: "koo-pen-deh-KEH-zah",
      },
      {
        cell_id: "d9088c95-7387-41dd-b7d7-7f42e012f0f5",
        word: "mkutano",
        en: "meeting",
        vi: "cuộc họp",
        pos: "noun (class 3/4)",
        pronunciation_vi: "m-ku-TA-no",
        pronunciation_en: "m-koo-TAH-no",
      },
      {
        cell_id: "0ade3d74-70bb-4f5a-8a1a-24aa05b05e0d",
        word: "njia mbadala",
        en: "alternative way / approach",
        vi: "cách thay thế",
        pos: "noun phrase (class 9/10)",
        pronunciation_vi: "NJI-a m-ba-DA-la",
        pronunciation_en: "N-JEE-ah m-bah-DAH-lah",
      },
      {
        cell_id: "4d4f504f-5382-4899-97a2-11918b64dc83",
        word: "kutatua",
        en: "to solve / resolve",
        vi: "giải quyết",
        pos: "verb",
        pronunciation_vi: "ku-ta-TU-a",
        pronunciation_en: "koo-tah-TOO-ah",
      },
    ],
    dialogue: [
      {
        cell_id: "2d696ddf-5635-429f-9413-6657977d4d3f",
        speaker: "Mwenzako",
        text: "Habari ya asubuhi? Je, umepata nafasi ya kuangalia ripoti yangu?",
        vi: "Chào buổi sáng! Bạn đã có thời gian xem báo cáo của tôi chưa?",
        en: "Good morning! Have you had a chance to look at my report?",
      },
      {
        cell_id: "8727df3d-450f-46d9-97a8-27743a81cc14",
        speaker: "Wewe",
        text: "Ndiyo, nimeiangalia. Ningependa kukutana ili kujadili baadhi ya mapendekezo.",
        vi: "Vâng, tôi đã xem rồi. Tôi muốn gặp để thảo luận một vài đề xuất.",
        en: "Yes, I have reviewed it. I would like to meet to discuss some suggestions.",
      },
    ],
    register_notes:
      "Dạng điều kiện -nge- (ningependa) và subjunctive (nijulishe) là hai công cụ chính để giữ giọng lịch sự " +
      "trong giao tiếp công sở. Tránh dùng mệnh lệnh trực tiếp như 'Nijulishe!' (không có tafadhali) — " +
      "nghe rất thô lỗ trong tiếng Swahili.",
    register_notes_en:
      "The conditional -nge- (ningependa) and subjunctive (nijulishe) are the two main tools for keeping a " +
      "polite tone in workplace Swahili. Avoid bare imperatives like 'Nijulishe!' (without tafadhali) — " +
      "they sound very rude in Swahili.",
  },

  {
    id: "swahili_b2_reported_speech",
    level: "B2",
    category: "reported_speech",
    title_vi: "Tường thuật lời nói chính xác",
    title_en: "Accurate reported speech",
    intro_vi:
      "Dùng 'kuwa' và 'kwamba' để tường thuật lời người khác một cách chính xác, không làm sai lệch sắc thái gốc.",
    intro_en:
      "Use 'kuwa' and 'kwamba' to report others' speech accurately, without distorting the original tone.",
    sentences: [
      {
        sw: "Mkurugenzi alieleza kwamba kampuni itaajiri wafanyakazi wapya mwaka ujao.",
        en: "The director explained that the company will hire new employees next year.",
        vi: "Giám đốc giải thích rằng công ty sẽ tuyển nhân viên mới vào năm tới.",
        pronunciation_focus: [
          "m-ku-ru-GE-nzi = giám đốc",
          "a-li-e-LE-za = ông ấy đã giải thích",
          "KWAM-ba = rằng (trang trọng hơn kuwa)",
          "i-ta-a-JI-ri = nó sẽ tuyển dụng",
        ],
        pronunciation_focus_en: [
          "mkurugenzi = director",
          "alieleza = he/she explained",
          "kwamba = that (more formal than kuwa)",
          "itaajiri = it will hire (class 9 subject)",
        ],
      },
      {
        sw: "Wananchi walilalamika kuwa huduma za afya hazitoshi vijijini.",
        en: "Citizens complained that health services are insufficient in rural areas.",
        vi: "Người dân phàn nàn rằng dịch vụ y tế không đủ ở vùng nông thôn.",
        pronunciation_focus: [
          "wa-NA-nchi = người dân, công dân",
          "wa-li-la-LA-mi-ka = họ đã phàn nàn",
          "hu-DU-ma za AF-ya = dịch vụ y tế",
          "ha-zi-TO-shi = chúng không đủ",
        ],
        pronunciation_focus_en: [
          "wananchi = citizens",
          "walilalamika = they complained",
          "huduma za afya = health services",
          "hazitoshi = they are not sufficient",
        ],
      },
      {
        sw: "Mtaalamu alionya kwamba ikiwa hatua hazitachukuliwa, hali itazidi kuwa mbaya.",
        en: "The expert warned that if action is not taken, the situation will get worse.",
        vi: "Chuyên gia cảnh báo rằng nếu không hành động, tình hình sẽ trở nên tồi tệ hơn.",
        pronunciation_focus: [
          "m-ta-a-LA-mu = chuyên gia",
          "a-li-O-nya = ông ấy đã cảnh báo",
          "ha-zi-ta-chu-ku-LI-wa = chúng sẽ không được thực hiện (bị động)",
          "i-ta-ZI-di = nó sẽ tăng / trở nên nhiều hơn",
        ],
        pronunciation_focus_en: [
          "mtaalamu = expert",
          "alionya = he/she warned",
          "hazitachukuliwa = they will not be taken (passive)",
          "itazidi = it will increase / worsen",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong tiếng Swahili, 'kuwa' và 'kwamba' đều có nghĩa 'rằng', nhưng 'kwamba' trang trọng hơn. " +
      "Trong báo chí, dùng 'kwamba' sau các động từ như 'alieleza' (giải thích), 'alionya' (cảnh báo), " +
      "'alisisitiza' (nhấn mạnh). 'Kuwa' phổ biến hơn trong hội thoại hàng ngày. " +
      "Người Đông Phi đánh giá cao việc tường thuật chính xác — không thêm bớt ý kiến cá nhân.",
    cultural_notes_en:
      "In Swahili, both 'kuwa' and 'kwamba' mean 'that', but 'kwamba' is more formal. " +
      "In journalism, use 'kwamba' after verbs like 'alieleza' (explained), 'alionya' (warned), " +
      "'alisisitiza' (emphasized). 'Kuwa' is more common in everyday speech. " +
      "East Africans value accurate reporting — don't add or remove personal opinion.",
    tip_advice_vi:
      "Khi tường thuật: (1) chọn động từ dẫn phù hợp (alisema = nói, alieleza = giải thích, alikiri = thừa nhận), " +
      "(2) giữ nguyên thì gốc sau kuwa/kwamba nếu thông tin vẫn đúng, " +
      "(3) phân biệt giữa sự thật ('alisema kuwa...') và tin đồn ('inasemekana kuwa...').",
    tip_advice_en:
      "When reporting: (1) choose the right reporting verb (alisema = said, alieleza = explained, alikiri = admitted), " +
      "(2) keep the original tense after kuwa/kwamba if the information is still true, " +
      "(3) distinguish between fact ('alisema kuwa...') and hearsay ('inasemekana kuwa...').",
    vocabulary: [
      {
        cell_id: "8a4e0fe6-d32d-4bde-acb7-b08063da6493",
        word: "kueleza",
        en: "to explain",
        vi: "giải thích",
        pos: "verb",
        pronunciation_vi: "ku-e-LE-za",
        pronunciation_en: "koo-eh-LEH-zah",
      },
      {
        cell_id: "7f4732ba-c7cb-4b1c-99fb-875afeb9de9a",
        word: "kuonya",
        en: "to warn",
        vi: "cảnh báo",
        pos: "verb",
        pronunciation_vi: "ku-O-nya",
        pronunciation_en: "koo-OH-nyah",
      },
      {
        cell_id: "32e140f7-b0a5-4526-86fe-2b49581c1d9b",
        word: "kulalamika",
        en: "to complain",
        vi: "phàn nàn, than phiền",
        pos: "verb (stative)",
        pronunciation_vi: "ku-la-la-MI-ka",
        pronunciation_en: "koo-lah-lah-MEE-kah",
      },
      {
        cell_id: "5ea3d3d7-3288-42df-8793-d7f02c5f788c",
        word: "kuzidi",
        en: "to exceed / increase / worsen",
        vi: "vượt quá / tăng lên / xấu đi",
        pos: "verb",
        pronunciation_vi: "ku-ZI-di",
        pronunciation_en: "koo-ZEE-dee",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Mkurugenzi alieleza ____ kampuni itaajiri wafanyakazi.",
        answer: "kwamba",
        hint_vi: "rằng (trang trọng)",
        hint_en: "that (formal)",
      },
      {
        type: "translation",
        vietnamese: "Người dân phàn nàn rằng dịch vụ không đủ.",
        english: "Citizens complained that the services are insufficient.",
        swahili: "Wananchi walilalamika kuwa huduma hazitoshi.",
      },
    ],
  },

  {
    id: "swahili_b2_debate_polite",
    level: "B2",
    category: "debate",
    title_vi: "Tranh luận lịch sự: nhượng bộ rồi phản biện",
    title_en: "Polite debate: concede, then counter",
    intro_vi:
      "Dùng 'Ni kweli... lakini...' và 'Nakubaliana... hata hivyo...' để công nhận một điểm trước khi phản biện.",
    intro_en:
      "Use 'Ni kweli... lakini...' and 'Nakubaliana... hata hivyo...' to acknowledge a point before countering it.",
    sentences: [
      {
        sw: "Ni kweli kwamba elimu ni muhimu, lakini uzoefu wa kazi pia una thamani kubwa.",
        en: "It is true that education is important, but work experience also has great value.",
        vi: "Đúng là giáo dục quan trọng, nhưng kinh nghiệm làm việc cũng có giá trị lớn.",
        pronunciation_focus: [
          "ni KWE-li = đúng là, quả thật",
          "e-LI-mu = giáo dục",
          "la-KI-ni = nhưng",
          "u-zo-E-fu wa KA-zi = kinh nghiệm làm việc",
        ],
        pronunciation_focus_en: [
          "ni kweli = it is true",
          "elimu = education",
          "lakini = but",
          "uzoefu wa kazi = work experience",
        ],
      },
      {
        sw: "Nakubaliana na hoja yako, hata hivyo tafiti za hivi karibuni zinaonyesha matokeo tofauti.",
        en: "I agree with your argument; however, recent studies show different results.",
        vi: "Tôi đồng ý với lập luận của anh/chị, tuy nhiên các nghiên cứu gần đây cho thấy kết quả khác.",
        pronunciation_focus: [
          "na-ku-ba-li-A-na = tôi đồng ý (dạng reciprocal)",
          "HO-ja = lập luận, luận điểm",
          "HA-ta HI-vyo = tuy nhiên (nghĩa đen: ngay cả như vậy)",
          "ma-to-LE-o to-fa-U-ti = kết quả khác biệt",
        ],
        pronunciation_focus_en: [
          "nakubaliana = I agree (reciprocal form)",
          "hoja = argument / point",
          "hata hivyo = however (literally: even so)",
          "matokeo tofauti = different results",
        ],
      },
      {
        sw: "Mtazamo wako unaeleweka, lakini nafikiri tunapaswa kuzingatia gharama pia.",
        en: "Your perspective is understandable, but I think we should consider the costs too.",
        vi: "Quan điểm của anh/chị dễ hiểu, nhưng tôi nghĩ chúng ta cũng nên cân nhắc chi phí.",
        pronunciation_focus: [
          "m-ta-ZA-mo = quan điểm, góc nhìn",
          "u-na-e-le-WE-ka = nó dễ hiểu (dạng stative)",
          "na-FI-ki-ri = tôi nghĩ",
          "ku-zi-nga-TI-a = cân nhắc, xem xét",
        ],
        pronunciation_focus_en: [
          "mtazamo = perspective / viewpoint",
          "unaeleweka = it is understandable (stative)",
          "nafikiri = I think",
          "kuzingatia = to consider",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong văn hóa Swahili, tranh luận trực diện và gay gắt bị coi là thiếu tôn trọng. " +
      "Mẫu 'Ni kweli... lakini...' và 'Nakubaliana... hata hivyo...' rất phổ biến vì chúng " +
      "công nhận đối phương trước khi đưa ra ý kiến khác. Cách này giữ hòa khí (amani) — " +
      "một giá trị cốt lõi trong văn hóa Swahili.",
    cultural_notes_en:
      "In Swahili culture, direct and harsh debate is considered disrespectful. " +
      "The patterns 'Ni kweli... lakini...' and 'Nakubaliana... hata hivyo...' are very common because they " +
      "acknowledge the other person before offering a different view. This preserves amani (peace/harmony) — " +
      "a core value in Swahili culture.",
    tip_advice_vi:
      "Cặp câu hữu ích để tranh luận lịch sự: Unasema kweli, lakini... (Bạn nói đúng, nhưng...); " +
      "Naelewa maana yako, ila... (Tôi hiểu ý bạn, tuy nhiên...); " +
      "Hilo ni muhimu, hata hivyo... (Điều đó quan trọng, tuy nhiên...).",
    tip_advice_en:
      "Useful pairs for polite debate: Unasema kweli, lakini... (You're right, but...); " +
      "Naelewa maana yako, ila... (I understand your point, however...); " +
      "Hilo ni muhimu, hata hivyo... (That's important, however...).",
    vocabulary: [
      {
        cell_id: "14b7afe1-032e-4ba4-bbeb-7ccfc8b8706e",
        word: "hoja",
        en: "argument / point / motion",
        vi: "lập luận / luận điểm",
        pos: "noun (class 9/10)",
        pronunciation_vi: "HO-ja",
        pronunciation_en: "HOH-jah",
      },
      {
        cell_id: "620dc155-3737-4532-b18c-c25eda65ae7f",
        word: "kukubaliana",
        en: "to agree with each other",
        vi: "đồng ý với nhau",
        pos: "verb (reciprocal)",
        pronunciation_vi: "ku-ku-ba-li-A-na",
        pronunciation_en: "koo-koo-bah-lee-AH-nah",
      },
      {
        cell_id: "3fc06862-285a-4b34-b230-a068c7f88b66",
        word: "hata hivyo",
        en: "however / nevertheless",
        vi: "tuy nhiên / dù vậy",
        pos: "connector",
        pronunciation_vi: "HA-ta HI-vyo",
        pronunciation_en: "HAH-tah HEE-vyoh",
      },
      {
        cell_id: "0953475c-250f-42c3-b0c1-43ad40b23148",
        word: "kuzingatia",
        en: "to consider / take into account",
        vi: "cân nhắc / xem xét",
        pos: "verb",
        pronunciation_vi: "ku-zi-nga-TI-a",
        pronunciation_en: "koo-zeen-gah-TEE-ah",
      },
    ],
    dialogue: [
      {
        cell_id: "28477bf5-1107-41f3-bc76-a3015349cbda",
        speaker: "Mwanafunzi A",
        text: "Nafikiri teknolojia inaharibu utamaduni wetu.",
        vi: "Tôi nghĩ công nghệ đang phá hủy văn hóa của chúng ta.",
        en: "I think technology is destroying our culture.",
      },
      {
        cell_id: "5f40386e-f447-47b3-a054-8567e5bc7739",
        speaker: "Mwanafunzi B",
        text: "Ni kweli kwamba teknolojia inaleta changamoto, lakini pia inasaidia kuhifadhi lugha zetu kupitia programu za kujifunza.",
        vi: "Đúng là công nghệ mang đến thách thức, nhưng nó cũng giúp bảo tồn ngôn ngữ của chúng ta qua các ứng dụng học tập.",
        en: "It's true that technology brings challenges, but it also helps preserve our languages through learning apps.",
      },
    ],
    register_notes:
      "Phân biệt sắc thái: 'lakini' (nhưng) — trung tính, phổ biến nhất; 'ila' (tuy nhiên) — hơi trang trọng hơn, " +
      "gốc Ả Rập; 'hata hivyo' (tuy nhiên, dù vậy) — dùng trong văn viết và tranh luận trang trọng.",
    register_notes_en:
      "Tone distinctions: 'lakini' (but) — neutral, most common; 'ila' (however) — slightly more formal, " +
      "Arabic origin; 'hata hivyo' (nevertheless, even so) — used in writing and formal debate.",
  },

  {
    id: "swahili_b2_verb_extensions",
    level: "B2",
    category: "verb_extensions",
    title_vi: "Vinyambuo vya vitenzi — đuôi mở rộng động từ",
    title_en: "Verb extensions — derivational suffixes",
    intro_vi:
      "Nắm bốn đuôi mở rộng chính của động từ Swahili: -wa (bị động), -ana (tương hỗ), -isha/-esha (sai khiến), -eka/-ika (trạng thái).",
    intro_en:
      "Master the four main Swahili verb extensions: -wa (passive), -ana (reciprocal), -isha/-esha (causative), -eka/-ika (stative).",
    sentences: [
      {
        sw: "Barua ilitumwa jana lakini haijapokewa bado. (—tumwa: tuma + wa)",
        en: "The letter was sent yesterday but has not been received yet. (—tumwa: tuma + wa)",
        vi: "Thư đã được gửi hôm qua nhưng vẫn chưa được nhận. (—tumwa: tuma + wa)",
        pronunciation_focus: [
          "i-li-TUM-wa = nó đã được gửi (tuma + wa → bị động)",
          "ha-i-ja-po-KE-wa = nó chưa được nhận (pokea + wa → bị động)",
          "JA-na = hôm qua",
          "BA-do = vẫn chưa",
        ],
        pronunciation_focus_en: [
          "ilitumwa = it was sent (tuma + wa → passive)",
          "haijapokewa = it has not been received yet (pokea + wa → passive)",
          "jana = yesterday",
          "bado = yet / still not",
        ],
      },
      {
        sw: "Wanafunzi walisaidiana kumaliza kazi ya nyumbani. (—saidiana: saidia + ana)",
        en: "The students helped each other finish the homework. (—saidiana: saidia + ana)",
        vi: "Các học sinh đã giúp đỡ lẫn nhau để hoàn thành bài tập về nhà. (—saidiana: saidia + ana)",
        pronunciation_focus: [
          "wa-li-sa-i-di-A-na = họ đã giúp đỡ lẫn nhau (saidia + ana → tương hỗ)",
          "ku-ma-LI-za = hoàn thành, kết thúc",
          "KA-zi ya nyum-BA-ni = bài tập về nhà",
        ],
        pronunciation_focus_en: [
          "walisaidiana = they helped each other (saidia + ana → reciprocal)",
          "kumaliza = to finish",
          "kazi ya nyumbani = homework",
        ],
      },
      {
        sw: "Mwalimu aliwafundisha wanafunzi sarufi. (—fundisha: funda + isha)",
        en: "The teacher taught the students grammar. (—fundisha: funda + isha)",
        vi: "Thầy/cô giáo đã dạy học sinh ngữ pháp. (—fundisha: funda + isha)",
        pronunciation_focus: [
          "a-li-wa-fun-DI-sha = ông ấy đã dạy họ (funda + isha → sai khiến)",
          "mwa-LI-mu = thầy/cô giáo",
          "sa-RU-fi = ngữ pháp",
        ],
        pronunciation_focus_en: [
          "aliwafundisha = he/she taught them (funda + isha → causative)",
          "mwalimu = teacher",
          "sarufi = grammar",
        ],
      },
      {
        sw: "Mlango ulifunguka kwa sababu ya upepo. (—funguka: funga + uka)",
        en: "The door opened (by itself) because of the wind. (—funguka: funga + uka)",
        vi: "Cánh cửa tự mở ra vì gió. (—funguka: funga + uka)",
        pronunciation_focus: [
          "u-li-fu-NGU-ka = nó đã tự mở (funga + uka → trạng thái)",
          "MLA-ngo = cánh cửa (lớp 3)",
          "u-PE-po = gió",
        ],
        pronunciation_focus_en: [
          "ulifunguka = it opened by itself (funga + uka → stative)",
          "mlango = door (class 3)",
          "upepo = wind",
        ],
      },
    ],
    cultural_notes_vi:
      "Hệ thống vinyambuo (đuôi mở rộng động từ) là trái tim của ngữ pháp Kiswahili. " +
      "Một gốc động từ có thể mang nhiều đuôi cùng lúc, ví dụ: " +
      "'alifundishwa' = a-li-fund-ish-w-a = anh ấy đã được dạy (sai khiến + bị động). " +
      "Người học từ các ngôn ngữ không có hệ thống tương tự (như tiếng Việt) cần thời gian để quen — " +
      "đây là kỹ năng phân biệt trình độ B1 và B2.",
    cultural_notes_en:
      "The vinyambuo (verb extension) system is the heart of Swahili grammar. " +
      "A single verb root can carry multiple extensions, e.g.: " +
      "'alifundishwa' = a-li-fund-ish-w-a = he was taught (causative + passive). " +
      "Learners from languages without a similar system (like Vietnamese) need time to adjust — " +
      "this is the skill that separates B1 from B2 level.",
    tip_advice_vi:
      "Cách học: bắt đầu với một gốc động từ quen thuộc và tự tạo ra tất cả các dạng mở rộng của nó. " +
      "Ví dụ: -funga (đóng) → -fungwa (bị đóng), -fungika (có thể đóng được), -fungisha (khiến ai đó đóng), " +
      "-funguka (tự mở ra — nghĩa đối lập!). Luyện mỗi ngày một gốc từ.",
    tip_advice_en:
      "How to learn: start with a familiar verb root and generate all its extended forms. " +
      "Example: -funga (close) → -fungwa (be closed), -fungika (be closable), -fungisha (make someone close), " +
      "-funguka (open by itself — opposite meaning!). Practice one root per day.",
    vocabulary: [
      {
        cell_id: "4b1e435c-b633-4d9e-a76f-b26b1641eb7a",
        word: "kutuma",
        en: "to send",
        vi: "gửi",
        pos: "verb",
        pronunciation_vi: "ku-TU-ma",
        pronunciation_en: "koo-TOO-mah",
      },
      {
        cell_id: "5830e75b-83d1-46a8-a753-76eb91f6c8a8",
        word: "kupokea",
        en: "to receive",
        vi: "nhận",
        pos: "verb",
        pronunciation_vi: "ku-po-KE-a",
        pronunciation_en: "koo-poh-KEH-ah",
      },
      {
        cell_id: "4d3b77aa-a3ba-47f6-b9b1-e9d200333c64",
        word: "kusaidia",
        en: "to help",
        vi: "giúp đỡ",
        pos: "verb",
        pronunciation_vi: "ku-sa-i-DI-a",
        pronunciation_en: "koo-sah-ee-DEE-ah",
      },
      {
        cell_id: "44e0856e-5c00-4179-bd78-ea7bebe2b156",
        word: "kufundisha",
        en: "to teach",
        vi: "dạy",
        pos: "verb (causative of -funda)",
        pronunciation_vi: "ku-fun-DI-sha",
        pronunciation_en: "koo-foon-DEE-shah",
      },
      {
        cell_id: "2c5f241d-7646-4516-9e7f-03afa871173c",
        word: "kufunguka",
        en: "to open (by itself) / become open",
        vi: "tự mở / trở nên mở",
        pos: "verb (stative of -funga)",
        pronunciation_vi: "ku-fu-NGU-ka",
        pronunciation_en: "koo-foo-NGOO-kah",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        question: "Barua ____ jana. (tuma → bị động)",
        answer: "ilitumwa",
        hint_vi: "Thư đã được gửi.",
        hint_en: "The letter was sent.",
      },
      {
        type: "fill_blank",
        question: "Wanafunzi ____ kumaliza kazi. (saidia → tương hỗ)",
        answer: "walisaidiana",
        hint_vi: "Họ đã giúp đỡ lẫn nhau.",
        hint_en: "They helped each other.",
      },
      {
        type: "matching",
        instruction_vi: "Ghép gốc động từ với dạng mở rộng đúng:",
        instruction_en: "Match the verb root with the correct extension form:",
        pairs: [
          { a: "funga (đóng) + bị động", b: "fungwa" },
          { a: "funda (học) + sai khiến", b: "fundisha" },
          { a: "saidia (giúp) + tương hỗ", b: "saidiana" },
          { a: "funga (đóng) + trạng thái", b: "funguka" },
        ],
      },
      {
        type: "translation",
        vietnamese: "Cánh cửa tự mở ra.",
        english: "The door opened by itself.",
        swahili: "Mlango ulifunguka.",
      },
    ],
    idiom_glosses: [
      {
        idiom: "Kufundisha samaki kuogelea",
        literal: "Dạy cá bơi",
        literal_en: "To teach a fish to swim",
        meaning: "Làm việc thừa thãi, dạy người đã biết rồi",
        meaning_en: "To do something pointless, to teach someone what they already know",
        example: "Kumwambia mvuvi jinsi ya kuvua samaki ni kufundisha samaki kuogelea.",
        example_en: "Telling a fisherman how to fish is like teaching a fish to swim.",
      },
    ],
  },
];

export default lessons;
