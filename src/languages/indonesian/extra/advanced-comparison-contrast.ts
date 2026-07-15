// Indonesian advanced comparison and contrast lesson pack for Vietnamese learners.
//
// Self-contained extra lesson file following the established Indonesian format.
// The `en` field holds TARGET-LANGUAGE Indonesian; `vi` holds the Vietnamese
// gloss. Pronunciation notes include Vietnamese L1 traps plus English companions.

type LessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

type VocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type Exercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const advancedComparisonContrastLessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_comparison_structures",
    level: "B2",
    category: "grammar_debate",
    title_vi: "So sánh nâng cao: dibandingkan dengan và lebih baik daripada",
    title_en: "Advanced comparison: dibandingkan dengan and lebih baik daripada",
    sentences: [
      {
        en: "Dibandingkan dengan tahun lalu, omzet bulan ini jauh lebih tinggi.",
        vi: "So với năm ngoái, doanh thu tháng này cao hơn nhiều.",
        pronunciation_focus: [
          "di-ban-DING-kan de-NGAN TA-hun LA-lu, OM-zet BU-lan I-ni JAUH LE-bih TING-gi.",
          "`dibandingkan dengan` = so với/được so sánh với; dùng tốt trong báo cáo và phân tích.",
          "L1 Việt: đừng bỏ `dengan` trong văn viết trang trọng; `dibandingkan dengan...` là cụm đầy đủ.",
        ],
        pronunciation_focus_en: [
          "di-ban-DING-kan de-NGAN TA-hun LA-lu, OM-zet BU-lan I-ni JAUH LE-bih TING-gi.",
          "`dibandingkan dengan` = compared with; useful in reports and analysis.",
          "VN-speaker note: do not drop `dengan` in formal writing; `dibandingkan dengan...` is the full phrase.",
        ],
      },
      {
        en: "Menurut saya, solusi ini lebih baik daripada solusi sebelumnya.",
        vi: "Theo tôi, giải pháp này tốt hơn giải pháp trước đó.",
        pronunciation_focus: [
          "me-NU-rut SA-ya, so-LU-si I-ni LE-bih BA-ik da-ri-PA-da so-LU-si se-be-LUM-nya.",
          "`lebih baik daripada` = tốt hơn so với; đặt `lebih` trước tính từ.",
          "L1 Việt: tiếng Việt nói 'tốt hơn' sau tính từ, nhưng Indonesia đặt `lebih` trước: `lebih baik`.",
        ],
        pronunciation_focus_en: [
          "me-NU-rut SA-ya, so-LU-si I-ni LE-bih BA-ik da-ri-PA-da so-LU-si se-be-LUM-nya.",
          "`lebih baik daripada` = better than; put `lebih` before the adjective.",
          "VN-speaker trap: Vietnamese places 'hơn' after the adjective, but Indonesian puts `lebih` before: `lebih baik`.",
        ],
      },
      {
        en: "Perbedaan utama antara dua pilihan ini adalah biaya dan risiko.",
        vi: "Khác biệt chính giữa hai lựa chọn này là chi phí và rủi ro.",
        pronunciation_focus: [
          "per-be-DA-an u-TA-ma an-TA-ra DU-a pi-LI-han I-ni A-da-lah bi-A-ya dan RI-si-ko.",
          "`perbedaan utama` = khác biệt chính; `antara` = giữa hai hoặc nhiều bên.",
          "L1 Việt: cụm tự nhiên là `perbedaan antara A dan B`, không nói `perbedaan dari A dan B`.",
        ],
        pronunciation_focus_en: [
          "per-be-DA-an u-TA-ma an-TA-ra DU-a pi-LI-han I-ni A-da-lah bi-A-ya dan RI-si-ko.",
          "`perbedaan utama` = main difference; `antara` = between/among.",
          "VN-speaker trap: natural phrase is `perbedaan antara A dan B`, not `perbedaan dari A dan B`.",
        ],
      },
      {
        en: "Persamaannya, kedua pihak sama-sama ingin hasil yang adil.",
        vi: "Điểm giống nhau là cả hai bên đều muốn kết quả công bằng.",
        pronunciation_focus: [
          "per-sa-MA-an-nya, ke-DU-a PI-hak SA-ma-SA-ma I-ngin HA-sil yang A-dil.",
          "`persamaan` = điểm giống nhau/sự tương đồng; `sama-sama` = cùng đều.",
          "L1 Việt: `sama-sama` không chỉ là 'không có gì'; trong câu này nghĩa là cả hai/cùng đều.",
        ],
        pronunciation_focus_en: [
          "per-sa-MA-an-nya, ke-DU-a PI-hak SA-ma-SA-ma I-ngin HA-sil yang A-dil.",
          "`persamaan` = similarity; `sama-sama` = both/equally.",
          "VN-speaker note: `sama-sama` is not only 'you're welcome'; here it means both/equally.",
        ],
      },
      {
        en: "Kalau dilihat dari sisi biaya, pilihan kedua lebih masuk akal.",
        vi: "Nếu nhìn từ phía chi phí, lựa chọn thứ hai hợp lý hơn.",
        pronunciation_focus: [
          "KA-lau di-LI-hat da-ri SI-si bi-A-ya, pi-LI-han ke-DU-a LE-bih MA-suk A-kal.",
          "`dilihat dari sisi...` = xét từ góc độ...; `masuk akal` = hợp lý.",
          "L1 Việt: `dari sisi` = từ góc độ, không phải 'từ cạnh bên' theo nghĩa vật lý.",
        ],
        pronunciation_focus_en: [
          "KA-lau di-LI-hat da-ri SI-si bi-A-ya, pi-LI-han ke-DU-a LE-bih MA-suk A-kal.",
          "`dilihat dari sisi...` = viewed from the perspective of...; `masuk akal` = makes sense.",
          "VN-speaker note: `dari sisi` means from the perspective of, not a physical side.",
        ],
      },
    ],
    cultural_notes_vi:
      "Dalam rapat, esai, atau debat Indonesia, perbandingan yang baik biasanya tidak hanya memakai `lebih... daripada`. Người nói thường dùng `dibandingkan dengan`, `perbedaan utama`, `persamaan`, dan `dilihat dari sisi...` để phân tích có cấu trúc. Cách này nghe lebih akademis và profesional daripada chỉ nói `ini lebih bagus`.",
    cultural_notes_en:
      "In Indonesian meetings, essays, or debates, good comparison usually goes beyond `lebih... daripada`. Speakers often use `dibandingkan dengan`, `perbedaan utama`, `persamaan`, and `dilihat dari sisi...` to structure analysis. This sounds more academic and professional than simply saying `ini lebih bagus`.",
    tip_advice_vi:
      "Mẫu nên thuộc: `Dibandingkan dengan...`, `lebih baik daripada...`, `perbedaan utama adalah...`, `persamaannya...`, `dilihat dari sisi...`. Người Việt cần chú ý trật tự `lebih + tính từ`, không đặt `lebih` sau tính từ.",
    tip_advice_en:
      "Chunks to memorize: `Dibandingkan dengan...`, `lebih baik daripada...`, `perbedaan utama adalah...`, `persamaannya...`, `dilihat dari sisi...`. Vietnamese speakers should watch the order `lebih + adjective`; do not place `lebih` after the adjective.",
    vocabulary: [
      {
        cell_id: "35d0bbdc-319c-4328-a214-ef8159405292",
        word: "dibandingkan dengan",
        en: "compared with",
        vi: "so với / được so sánh với",
        pos: "connector",
        pronunciation_vi: "di-ban-DING-kan de-NGAN",
        pronunciation_en: "di-ban-DING-kan de-NGAN",
      },
      {
        cell_id: "1cb9b3de-d9ce-482d-aaee-4b2f8cd67ff7",
        word: "lebih baik daripada",
        en: "better than",
        vi: "tốt hơn so với",
        pos: "comparative phrase",
        pronunciation_vi: "LE-bih BA-ik da-ri-PA-da",
        pronunciation_en: "LE-bih BA-ik da-ri-PA-da",
      },
      {
        cell_id: "afa765ab-f819-4cb8-904d-b663ec15492d",
        word: "perbedaan utama",
        en: "main difference",
        vi: "khác biệt chính",
        pos: "noun phrase",
        pronunciation_vi: "per-be-DA-an u-TA-ma",
        pronunciation_en: "per-be-DA-an u-TA-ma",
      },
      {
        cell_id: "0bfe7f20-048d-482f-b608-443c017cd12a",
        word: "persamaan",
        en: "similarity",
        vi: "điểm giống nhau / sự tương đồng",
        pos: "noun",
        pronunciation_vi: "per-sa-MA-an",
        pronunciation_en: "per-sa-MA-an",
      },
      {
        cell_id: "e21eacab-9690-40df-8c2c-a291ed853afd",
        word: "dari sisi",
        en: "from the perspective of",
        vi: "từ góc độ",
        pos: "phrase",
        pronunciation_vi: "da-ri SI-si",
        pronunciation_en: "da-ri SI-si",
      },
      {
        cell_id: "e26bbe3d-0a13-44a0-b58b-51935c65a4e1",
        word: "masuk akal",
        en: "reasonable / makes sense",
        vi: "hợp lý",
        pos: "phrase",
        pronunciation_vi: "MA-suk A-kal",
        pronunciation_en: "MA-sook A-kal",
      },
    ],
    dialogue: [
      {
        cell_id: "a4f10443-9be0-4e17-a504-306d16d0fe66",
        speaker: "Rina",
        text: "Dibandingkan dengan paket lama, paket baru ini lebih mahal.",
        vi: "So với gói cũ, gói mới này đắt hơn.",
        en: "Compared with the old package, this new package is more expensive.",
      },
      {
        cell_id: "700cd297-8a3c-4199-b99c-02ea2eb4c143",
        speaker: "Dimas",
        text: "Benar, tetapi fasilitasnya juga lebih lengkap.",
        vi: "Đúng, nhưng tiện nghi của nó cũng đầy đủ hơn.",
        en: "True, but the facilities are also more complete.",
      },
      {
        cell_id: "750b8edb-7627-456b-82e1-97792a7857cf",
        speaker: "Rina",
        text: "Perbedaan utamanya ada pada biaya dan layanan tambahan.",
        vi: "Khác biệt chính nằm ở chi phí và dịch vụ bổ sung.",
        en: "The main difference is in cost and additional services.",
      },
      {
        cell_id: "da3fcea9-cec4-42cb-a412-f09bf9b297c8",
        speaker: "Dimas",
        text: "Kalau dilihat dari sisi waktu, paket baru lebih masuk akal.",
        vi: "Nếu xét từ góc độ thời gian, gói mới hợp lý hơn.",
        en: "From the time perspective, the new package makes more sense.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền liên từ/cụm so sánh phù hợp:",
        instruction_en: "Fill in the suitable comparison connector:",
        items: [
          {
            prompt: "___ dengan tahun lalu, hasilnya lebih baik. (so với)",
            answer: "Dibandingkan",
            options: ["Dibandingkan", "Sedangkan", "Sementara"],
          },
          {
            prompt: "Perbedaan ___ antara dua pilihan ini adalah biaya. (chính)",
            answer: "utama",
            options: ["utama", "utara", "ulang"],
          },
          {
            prompt: "Pilihan kedua lebih baik ___ pilihan pertama. (hơn so với)",
            answer: "daripada",
            options: ["daripada", "dengan", "untuk"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "So với năm ngoái, kết quả này tốt hơn.", answer: "Dibandingkan dengan tahun lalu, hasil ini lebih baik." },
          { prompt: "Khác biệt chính là chi phí và rủi ro.", answer: "Perbedaan utama adalah biaya dan risiko." },
          { prompt: "Điểm giống nhau là cả hai bên muốn kết quả công bằng.", answer: "Persamaannya, kedua pihak sama-sama ingin hasil yang adil." },
        ],
      },
    ],
  },
  {
    id: "indonesian_contrast_connectors_opinion",
    level: "B2",
    category: "grammar_debate",
    title_vi: "Đối lập ý kiến: sedangkan, sementara itu và kontras pendapat",
    title_en: "Contrasting opinions: sedangkan, sementara itu and contrast",
    sentences: [
      {
        en: "Saya setuju dengan tujuannya, sedangkan Anda lebih fokus pada caranya.",
        vi: "Tôi đồng ý với mục tiêu, trong khi anh/chị tập trung hơn vào cách làm.",
        pronunciation_focus: [
          "SA-ya se-TU-ju de-NGAN tu-JU-an-nya, se-DANG-kan AN-da LE-bih FO-kus PA-da CA-ra-nya.",
          "`sedangkan` = trong khi/còn; nối hai vế tương phản trong cùng câu.",
          "L1 Việt: `sedangkan` không phải `sedang` + `kan`; học nguyên cụm connector.",
        ],
        pronunciation_focus_en: [
          "SA-ya se-TU-ju de-NGAN tu-JU-an-nya, se-DANG-kan AN-da LE-bih FO-kus PA-da CA-ra-nya.",
          "`sedangkan` = whereas/while; links two contrasting clauses in one sentence.",
          "VN-speaker note: `sedangkan` is not `sedang` + `kan`; learn it as one connector.",
        ],
      },
      {
        en: "Sementara itu, tim pemasaran melihat masalah ini dari sudut yang berbeda.",
        vi: "Trong khi đó, đội marketing nhìn vấn đề này từ góc độ khác.",
        pronunciation_focus: [
          "se-men-TA-ra I-tu, tim pe-ma-SA-ran me-LI-hat ma-SA-lah I-ni da-ri SU-dut yang ber-BE-da.",
          "`sementara itu` = trong khi đó; thường mở câu mới để chuyển sang bên/nhóm khác.",
          "L1 Việt: dùng `sementara itu` khi đổi bối cảnh, không chỉ để nói 'tạm thời'.",
        ],
        pronunciation_focus_en: [
          "se-men-TA-ra I-tu, tim pe-ma-SA-ran me-LI-hat ma-SA-lah I-ni da-ri SU-dut yang ber-BE-da.",
          "`sementara itu` = meanwhile/at the same time; often starts a new sentence to shift to another group.",
          "VN-speaker trap: use `sementara itu` for contrast/context shift, not only 'temporary'.",
        ],
      },
      {
        en: "Pendapat saya kontras dengan pendapat mayoritas.",
        vi: "Ý kiến của tôi đối lập với ý kiến của đa số.",
        pronunciation_focus: [
          "pen-DA-pat SA-ya KON-tras de-NGAN pen-DA-pat ma-yo-ri-TAS.",
          "`kontras dengan` = đối lập/tương phản với; từ này hơi trang trọng.",
          "L1 Việt: sau `kontras`, dùng `dengan`, không dùng `pada`.",
        ],
        pronunciation_focus_en: [
          "pen-DA-pat SA-ya KON-tras de-NGAN pen-DA-pat ma-yo-ri-TAS.",
          "`kontras dengan` = contrasts with; this sounds fairly formal.",
          "VN-speaker trap: after `kontras`, use `dengan`, not `pada`.",
        ],
      },
      {
        en: "Di satu sisi, rencana ini cepat; di sisi lain, biayanya tinggi.",
        vi: "Một mặt, kế hoạch này nhanh; mặt khác, chi phí cao.",
        pronunciation_focus: [
          "di SA-tu SI-si, ren-CA-na I-ni CE-pat; di SI-si LA-in, bi-A-ya-nya TING-gi.",
          "`di satu sisi... di sisi lain...` = một mặt... mặt khác..., cấu trúc cân bằng.",
          "L1 Việt: cụm cố định là `di sisi lain`, không đảo thành `di lain sisi`.",
        ],
        pronunciation_focus_en: [
          "di SA-tu SI-si, ren-CA-na I-ni CE-pat; di SI-si LA-in, bi-A-ya-nya TING-gi.",
          "`di satu sisi... di sisi lain...` = on one hand... on the other hand..., a balanced structure.",
          "VN-speaker trap: fixed phrase is `di sisi lain`, not `di lain sisi`.",
        ],
      },
      {
        en: "Kedua pendapat itu berbeda, tetapi tidak harus bertentangan.",
        vi: "Hai ý kiến đó khác nhau, nhưng không nhất thiết phải mâu thuẫn.",
        pronunciation_focus: [
          "ke-DU-a pen-DA-pat I-tu ber-BE-da, te-TA-pi TI-dak HA-rus ber-ten-TA-ngan.",
          "`berbeda` = khác nhau; `bertentangan` = mâu thuẫn/đối nghịch.",
          "L1 Việt: không phải mọi `berbeda` đều là `bertentangan`; câu này giúp tranh luận mềm hơn.",
        ],
        pronunciation_focus_en: [
          "ke-DU-a pen-DA-pat I-tu ber-BE-da, te-TA-pi TI-dak HA-rus ber-ten-TA-ngan.",
          "`berbeda` = different; `bertentangan` = contradictory/opposed.",
          "VN-speaker note: not every `berbeda` is `bertentangan`; this sentence softens debate.",
        ],
      },
    ],
    cultural_notes_vi:
      "Untuk kontras pendapat secara sopan, bahasa Indonesia sering memakai struktur yang menyeimbangkan dua sisi: `di satu sisi... di sisi lain...`, `sedangkan`, `sementara itu`, dan `tidak harus bertentangan`. Cách này giúp người nói phản biện tanpa terdengar menyerang pribadi.",
    cultural_notes_en:
      "For polite contrast of opinions, Indonesian often uses structures that balance two sides: `di satu sisi... di sisi lain...`, `sedangkan`, `sementara itu`, and `tidak harus bertentangan`. These help speakers disagree without sounding personally attacking.",
    tip_advice_vi:
      "Khi muốn phản biện mềm, dùng: `Saya setuju dengan..., sedangkan...`, `Sementara itu,...`, `Di satu sisi..., di sisi lain...`, `berbeda tetapi tidak harus bertentangan`. Tránh mở đầu bằng `Anda salah`; hãy so sánh góc nhìn trước.",
    tip_advice_en:
      "For soft disagreement, use: `Saya setuju dengan..., sedangkan...`, `Sementara itu,...`, `Di satu sisi..., di sisi lain...`, `berbeda tetapi tidak harus bertentangan`. Avoid starting with `Anda salah`; compare perspectives first.",
    vocabulary: [
      {
        cell_id: "3183ab14-4c14-4cb1-aeb9-5e1df07d4ed3",
        word: "sedangkan",
        en: "whereas / while",
        vi: "trong khi / còn",
        pos: "connector",
        pronunciation_vi: "se-DANG-kan",
        pronunciation_en: "se-DANG-kan",
      },
      {
        cell_id: "4deec6a2-e811-459a-8a59-93df6cd6f6f9",
        word: "sementara itu",
        en: "meanwhile / at the same time",
        vi: "trong khi đó",
        pos: "connector",
        pronunciation_vi: "se-men-TA-ra I-tu",
        pronunciation_en: "se-men-TA-ra I-too",
      },
      {
        cell_id: "4bb6ac3c-5fbd-4dc9-b575-71a1bef866e9",
        word: "kontras dengan",
        en: "contrasts with",
        vi: "tương phản / đối lập với",
        pos: "phrase",
        pronunciation_vi: "KON-tras de-NGAN",
        pronunciation_en: "KON-tras de-NGAN",
      },
      {
        cell_id: "183b9430-887d-41e7-840d-d1b9baf484e6",
        word: "di sisi lain",
        en: "on the other hand",
        vi: "mặt khác",
        pos: "connector",
        pronunciation_vi: "di SI-si LA-in",
        pronunciation_en: "di SI-si LA-in",
      },
      {
        cell_id: "7cc6ac87-587b-41b0-b841-3b1cdd36e213",
        word: "bertentangan",
        en: "contradictory / opposed",
        vi: "mâu thuẫn / đối nghịch",
        pos: "verb / adjective",
        pronunciation_vi: "ber-ten-TA-ngan",
        pronunciation_en: "ber-ten-TA-ngan",
      },
      {
        cell_id: "d4eda39c-de74-40a9-a951-877a23707f91",
        word: "sudut pandang",
        en: "point of view",
        vi: "góc nhìn / quan điểm",
        pos: "noun phrase",
        pronunciation_vi: "SU-dut PAN-dang",
        pronunciation_en: "SOO-dut PAN-dang",
      },
    ],
    dialogue: [
      {
        cell_id: "1a50aae7-2fb1-4086-8323-b888f3ad15ef",
        speaker: "Moderator",
        text: "Apa perbedaan utama antara dua pendapat ini?",
        vi: "Khác biệt chính giữa hai ý kiến này là gì?",
        en: "What is the main difference between these two opinions?",
      },
      {
        cell_id: "19d42733-3d7f-402c-beff-cc1da15cb7ca",
        speaker: "Peserta A",
        text: "Saya fokus pada biaya, sedangkan Bapak fokus pada kualitas.",
        vi: "Tôi tập trung vào chi phí, trong khi anh/bác tập trung vào chất lượng.",
        en: "I focus on cost, whereas you focus on quality.",
      },
      {
        cell_id: "87e036fb-8452-49e9-9676-6c0cf35ba4a9",
        speaker: "Peserta B",
        text: "Benar. Namun, kedua pendapat itu tidak harus bertentangan.",
        vi: "Đúng. Tuy nhiên, hai ý kiến đó không nhất thiết phải mâu thuẫn.",
        en: "Correct. However, the two opinions do not have to contradict each other.",
      },
      {
        cell_id: "ac110115-021a-4121-b56d-c947d8d20402",
        speaker: "Moderator",
        text: "Baik, mari kita cari persamaan sebelum membahas perbedaannya.",
        vi: "Được, hãy tìm điểm giống nhau trước khi bàn về khác biệt.",
        en: "Good, let's find the similarities before discussing the differences.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối connector với nghĩa tiếng Việt:",
        instruction_en: "Match each connector with its Vietnamese meaning:",
        items: [
          { prompt: "sedangkan", answer: "trong khi / còn" },
          { prompt: "sementara itu", answer: "trong khi đó" },
          { prompt: "di sisi lain", answer: "mặt khác" },
          { prompt: "bertentangan", answer: "mâu thuẫn / đối nghịch" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn connector đúng:",
        instruction_en: "Choose the correct connector:",
        items: [
          {
            prompt: "Saya fokus pada biaya, ___ Anda fokus pada kualitas.",
            answer: "sedangkan",
            options: ["sedangkan", "sebelum", "supaya"],
          },
          {
            prompt: "Di satu sisi rencana ini cepat; di sisi ___ biayanya tinggi.",
            answer: "lain",
            options: ["lain", "lalu", "luar"],
          },
          {
            prompt: "Pendapat itu berbeda, tetapi tidak harus ___.",
            answer: "bertentangan",
            options: ["bertentangan", "berangkat", "bertanya"],
          },
        ],
      },
    ],
  },
];
