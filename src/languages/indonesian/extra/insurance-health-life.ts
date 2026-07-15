// Indonesian health and life insurance lesson pack for Vietnamese learners.
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

export const insuranceHealthLifeLessons: IndonesianLesson[] = [
  {
    id: "indonesian_health_insurance_policy",
    level: "B1",
    category: "health_finance",
    title_vi: "Bảo hiểm sức khỏe: premi, polis và klaim",
    title_en: "Health insurance: premiums, policies, and claims",
    sentences: [
      {
        en: "Saya ingin membeli asuransi kesehatan untuk keluarga.",
        vi: "Tôi muốn mua bảo hiểm sức khỏe cho gia đình.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-BE-li a-su-RAN-si ke-SE-ha-tan UN-tuk ke-LU-ar-ga.",
          "`asuransi kesehatan` = bảo hiểm sức khỏe/y tế tư nhân; khác với BPJS Kesehatan.",
          "L1 Việt: `untuk keluarga` = cho gia đình. Không cần thêm giới từ khác sau `untuk`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin mem-BE-li a-su-RAN-si ke-SE-ha-tan UN-tuk ke-LU-ar-ga.",
          "`asuransi kesehatan` = health insurance, often private; separate from BPJS Kesehatan.",
          "VN-speaker note: `untuk keluarga` = for the family. No extra preposition is needed after `untuk`.",
        ],
      },
      {
        en: "Berapa premi per bulan untuk polis ini?",
        vi: "Phí bảo hiểm mỗi tháng cho hợp đồng này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa PRE-mi per BU-lan UN-tuk PO-lis I-ni.",
          "`premi` = phí bảo hiểm định kỳ; `polis` = hợp đồng/giấy chứng nhận bảo hiểm.",
          "L1 Việt: hỏi giá/số tiền dùng `berapa`, không dùng `apa`: `berapa premi`, `berapa biaya`.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa PRE-mi per BU-lan UN-tuk PO-lis I-ni.",
          "`premi` = recurring insurance premium; `polis` = insurance policy document/contract.",
          "VN-speaker trap: ask amounts with `berapa`, not `apa`: `berapa premi`, `berapa biaya`.",
        ],
      },
      {
        en: "Apa saja yang ditanggung oleh asuransi ini?",
        vi: "Những gì được bảo hiểm này chi trả?",
        pronunciation_focus: [
          "A-pa SA-ja yang di-TANG-gung O-leh a-su-RAN-si I-ni.",
          "`ditanggung` = được chi trả/được bảo hiểm; dạng bị động rất hay gặp trong bảo hiểm.",
          "L1 Việt: thêm `saja` để hỏi cả danh sách quyền lợi, không chỉ một món.",
        ],
        pronunciation_focus_en: [
          "A-pa SA-ja yang di-TANG-gung O-leh a-su-RAN-si I-ni.",
          "`ditanggung` = covered/paid for; the passive form is very common in insurance.",
          "VN-speaker note: add `saja` to ask for the whole list of covered items, not just one.",
        ],
      },
      {
        en: "Apakah ada masa tunggu sebelum klaim pertama?",
        vi: "Có thời gian chờ trước yêu cầu bồi thường đầu tiên không?",
        pronunciation_focus: [
          "a-PA-kah A-da MA-sa TUNG-gu se-BE-lum klaim per-TA-ma.",
          "`masa tunggu` = thời gian chờ; `klaim pertama` = yêu cầu bồi thường đầu tiên.",
          "L1 Việt: `sebelum` = trước khi/trước mốc. Đừng dùng `di depan` cho thời gian.",
        ],
        pronunciation_focus_en: [
          "a-PA-kah A-da MA-sa TUNG-gu se-BE-lum claim per-TA-ma.",
          "`masa tunggu` = waiting period; `klaim pertama` = first claim.",
          "VN-speaker trap: `sebelum` = before a time/event. Do not use `di depan` for time.",
        ],
      },
      {
        en: "Tolong jelaskan pengecualian dalam polis.",
        vi: "Làm ơn giải thích các điều khoản loại trừ trong hợp đồng bảo hiểm.",
        pronunciation_focus: [
          "TO-long je-LAS-kan pe-nge-cu-a-LI-an DA-lam PO-lis.",
          "`pengecualian` = ngoại lệ/loại trừ; rất quan trọng khi đọc polis.",
          "L1 Việt: `dalam polis` = trong hợp đồng bảo hiểm. `Dalam` dùng cho nội dung trong văn bản.",
        ],
        pronunciation_focus_en: [
          "TO-long je-LAS-kan pe-nge-choo-a-LEE-an DA-lam PO-lis.",
          "`pengecualian` = exclusion/exception; important when reading a policy.",
          "VN-speaker note: `dalam polis` = in the insurance policy. `Dalam` works for content inside documents.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di Indonesia, `asuransi kesehatan` bisa berarti bảo hiểm tư nhân ngoài BPJS. Trước khi membeli, hỏi jelas tentang `premi`, `manfaat`, `plafon`, `masa tunggu`, `pengecualian`, rumah sakit rekanan, và cara klaim. Jangan hanya mendengar ringkasan agen; baca `polis` karena aturan resmi biasanya ada di dokumen itu.",
    cultural_notes_en:
      "In Indonesia, `asuransi kesehatan` can mean private insurance in addition to BPJS. Before buying, ask clearly about the premium, benefits, coverage limits, waiting period, exclusions, partner hospitals, and claim process. Do not rely only on an agent's summary; read the `polis` because the official rules are usually in that document.",
    tip_advice_vi:
      "Mẫu hỏi an toàn: `Berapa premi per bulan?`, `Apa saja yang ditanggung?`, `Apakah ada masa tunggu?`, `Tolong jelaskan pengecualian`. Người Việt nên nhớ `klaim` là danh từ và cũng hay dùng như động từ trong nói hằng ngày.",
    tip_advice_en:
      "Safe question frames: `Berapa premi per bulan?`, `Apa saja yang ditanggung?`, `Apakah ada masa tunggu?`, `Tolong jelaskan pengecualian`. Vietnamese speakers should remember that `klaim` is a noun and is also often used like a verb in daily speech.",
    vocabulary: [
      {
        cell_id: "32509cf2-1789-4106-98ac-623cc24e0085",
        word: "asuransi kesehatan",
        en: "health insurance",
        vi: "bảo hiểm sức khỏe / y tế",
        pos: "noun phrase",
        pronunciation_vi: "a-su-RAN-si ke-SE-ha-tan",
        pronunciation_en: "a-su-RAN-see ke-SE-ha-tan",
      },
      {
        cell_id: "c387a0d2-a84f-45f8-a303-7199f39e818d",
        word: "premi",
        en: "insurance premium",
        vi: "phí bảo hiểm định kỳ",
        pos: "noun",
        pronunciation_vi: "PRE-mi",
        pronunciation_en: "PRE-mee",
      },
      {
        cell_id: "efb6f4d1-bd60-4434-bbfa-b5c742f2966b",
        word: "polis",
        en: "insurance policy",
        vi: "hợp đồng bảo hiểm / giấy chứng nhận bảo hiểm",
        pos: "noun",
        pronunciation_vi: "PO-lis",
        pronunciation_en: "PO-lis",
      },
      {
        cell_id: "af7dc4d4-ee60-4199-9795-8df30284536d",
        word: "klaim",
        en: "insurance claim",
        vi: "yêu cầu bồi thường bảo hiểm",
        pos: "noun / verb",
        pronunciation_vi: "klaim",
        pronunciation_en: "claim",
      },
      {
        cell_id: "27c595a9-7a35-4db2-a942-586ecef3d87d",
        word: "masa tunggu",
        en: "waiting period",
        vi: "thời gian chờ",
        pos: "noun phrase",
        pronunciation_vi: "MA-sa TUNG-gu",
        pronunciation_en: "MA-sa TOONG-goo",
      },
      {
        cell_id: "e651c197-447f-4032-ad3f-0ed1f383cf18",
        word: "pengecualian",
        en: "exclusion / exception",
        vi: "điều khoản loại trừ / ngoại lệ",
        pos: "noun",
        pronunciation_vi: "pe-nge-cu-a-LI-an",
        pronunciation_en: "pe-nge-choo-a-LEE-an",
      },
    ],
    dialogue: [
      {
        cell_id: "a595b583-7879-48db-a7c3-5815c87680f2",
        speaker: "Nasabah",
        text: "Saya ingin membeli asuransi kesehatan untuk keluarga.",
        vi: "Tôi muốn mua bảo hiểm sức khỏe cho gia đình.",
        en: "I want to buy health insurance for my family.",
      },
      {
        cell_id: "f5400faf-1ebe-4e00-9a93-d62f108d5a8e",
        speaker: "Agen",
        text: "Baik. Premi tergantung usia dan manfaat yang dipilih.",
        vi: "Vâng. Phí bảo hiểm tùy vào tuổi và quyền lợi được chọn.",
        en: "Okay. The premium depends on age and the selected benefits.",
      },
      {
        cell_id: "28491f38-fd0a-4572-9e07-db4f34eba35a",
        speaker: "Nasabah",
        text: "Apa saja yang ditanggung, dan apakah ada masa tunggu?",
        vi: "Những gì được chi trả, và có thời gian chờ không?",
        en: "What is covered, and is there a waiting period?",
      },
      {
        cell_id: "9c39c17a-c86c-4fe6-8783-89fbdff58887",
        speaker: "Agen",
        text: "Saya jelaskan manfaat, pengecualian, dan cara klaim di polis.",
        vi: "Tôi sẽ giải thích quyền lợi, điều khoản loại trừ và cách yêu cầu bồi thường trong hợp đồng.",
        en: "I will explain the benefits, exclusions, and claim process in the policy.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ bảo hiểm phù hợp:",
        instruction_en: "Fill in the suitable insurance word:",
        items: [
          {
            prompt: "Berapa ___ per bulan untuk polis ini? (phí bảo hiểm)",
            answer: "premi",
            options: ["premi", "paspor", "parkir"],
          },
          {
            prompt: "Apakah ada masa ___ sebelum klaim pertama? (chờ)",
            answer: "tunggu",
            options: ["tunggu", "tanda", "tamu"],
          },
          {
            prompt: "Apa saja yang ___ oleh asuransi ini? (được chi trả)",
            answer: "ditanggung",
            options: ["ditanggung", "ditangkap", "ditanya"],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          { prompt: "Tôi muốn mua bảo hiểm sức khỏe cho gia đình.", answer: "Saya ingin membeli asuransi kesehatan untuk keluarga." },
          { prompt: "Phí bảo hiểm mỗi tháng là bao nhiêu?", answer: "Berapa premi per bulan?" },
          { prompt: "Có thời gian chờ trước yêu cầu bồi thường đầu tiên không?", answer: "Apakah ada masa tunggu sebelum klaim pertama?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_life_insurance_beneficiary",
    level: "B1",
    category: "health_finance",
    title_vi: "Bảo hiểm nhân thọ và người thụ hưởng",
    title_en: "Life insurance and beneficiaries",
    sentences: [
      {
        en: "Saya sedang mempertimbangkan asuransi jiwa.",
        vi: "Tôi đang cân nhắc bảo hiểm nhân thọ.",
        pronunciation_focus: [
          "SA-ya se-DANG mem-per-tim-BANG-kan a-su-RAN-si JI-wa.",
          "`asuransi jiwa` = bảo hiểm nhân thọ; `mempertimbangkan` = cân nhắc.",
          "L1 Việt: `jiwa` nghĩa là sinh mạng/tâm hồn, nhưng trong bảo hiểm là life insurance.",
        ],
        pronunciation_focus_en: [
          "SA-ya se-DANG mem-per-tim-BANG-kan a-su-RAN-si JI-wa.",
          "`asuransi jiwa` = life insurance; `mempertimbangkan` = consider.",
          "VN-speaker note: `jiwa` means life/soul, but in insurance it means life insurance.",
        ],
      },
      {
        en: "Siapa yang bisa menjadi ahli waris dalam polis ini?",
        vi: "Ai có thể trở thành người thụ hưởng/người thừa kế trong hợp đồng này?",
        pronunciation_focus: [
          "SI-a-pa yang BI-sa men-JA-di AH-li WA-ris DA-lam PO-lis I-ni.",
          "`ahli waris` = người thừa kế/người thụ hưởng trong bảo hiểm; hỏi rõ tên người nhận manfaat.",
          "L1 Việt: `siapa yang bisa...` là khung hỏi người rất tự nhiên, giống 'ai có thể...'.",
        ],
        pronunciation_focus_en: [
          "SI-a-pa yang BI-sa men-JA-di AH-li WA-ris DA-lam PO-lis I-ni.",
          "`ahli waris` = heir/beneficiary in insurance; clarify who receives the benefit.",
          "VN-speaker win: `siapa yang bisa...` is a natural person-question frame, like Vietnamese 'ai có thể...'.",
        ],
      },
      {
        en: "Agen asuransi meminta data keluarga saya.",
        vi: "Đại lý bảo hiểm yêu cầu dữ liệu gia đình của tôi.",
        pronunciation_focus: [
          "A-gen a-su-RAN-si me-MIN-ta DA-ta ke-LU-ar-ga SA-ya.",
          "`agen asuransi` = đại lý/tư vấn bảo hiểm; `meminta data` = yêu cầu dữ liệu.",
          "L1 Việt: `data keluarga` là thông tin gia đình. Không đọc `data` theo tiếng Anh quá nặng; Indonesia thường DA-ta.",
        ],
        pronunciation_focus_en: [
          "A-gen a-su-RAN-si me-MIN-ta DA-ta ke-LU-ar-ga SA-ya.",
          "`agen asuransi` = insurance agent/advisor; `meminta data` = request data.",
          "VN-speaker note: `data keluarga` = family information. Indonesian commonly says DA-ta, not heavy English `day-ta`.",
        ],
      },
      {
        en: "Saya perlu membaca polis sebelum tanda tangan.",
        vi: "Tôi cần đọc hợp đồng bảo hiểm trước khi ký tên.",
        pronunciation_focus: [
          "SA-ya per-LU mem-BA-ca PO-lis se-BE-lum TAN-da TA-ngan.",
          "`sebelum tanda tangan` = trước khi ký; `polis` là văn bản chính thức cần đọc.",
          "L1 Việt: `tanda tangan` vừa là danh từ chữ ký vừa là động từ ký tên trong nói hằng ngày.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LU mem-BA-cha PO-lis se-BE-lum TAN-da TA-ngan.",
          "`sebelum tanda tangan` = before signing; `polis` is the official document to read.",
          "VN-speaker note: `tanda tangan` can mean signature and also sign a document in daily speech.",
        ],
      },
      {
        en: "Kalau premi terlambat dibayar, apa polisnya tetap aktif?",
        vi: "Nếu phí bảo hiểm được trả muộn, hợp đồng vẫn còn hiệu lực không?",
        pronunciation_focus: [
          "KA-lau PRE-mi ter-LAM-bat di-BA-yar, A-pa PO-lis-nya te-TAP AK-tif.",
          "`terlambat dibayar` = được trả muộn; `tetap aktif` = vẫn còn hiệu lực.",
          "L1 Việt: với thẻ/hợp đồng/tài khoản, dùng `aktif`, không dùng `hidup`.",
        ],
        pronunciation_focus_en: [
          "KA-lau PRE-mi ter-LAM-bat di-BA-yar, A-pa PO-lis-nya te-TAP AK-tif.",
          "`terlambat dibayar` = paid late; `tetap aktif` = remains active/valid.",
          "VN-speaker trap: for cards, policies, or accounts, use `aktif`, not `hidup`.",
        ],
      },
    ],
    cultural_notes_vi:
      "`Asuransi jiwa` ở Indonesia thường liên quan đến `uang pertanggungan` cho ahli waris nếu tertanggung meninggal dunia. Sản phẩm bisa sederhana, bisa juga digabung dengan investasi; karena itu penting hỏi manfaat, risiko, biaya, masa berlaku, cara klaim, dan apa yang terjadi kalau premi terlambat. Jangan tanda tangan sebelum hiểu polis và nama ahli waris.",
    cultural_notes_en:
      "`Asuransi jiwa` in Indonesia often involves a death benefit for the beneficiary if the insured person dies. Products can be simple or bundled with investment features, so it is important to ask about benefits, risks, fees, term, claim process, and what happens if the premium is late. Do not sign before understanding the policy and beneficiary names.",
    tip_advice_vi:
      "Mẫu hỏi nên dùng với agen: `Apa manfaat utamanya?`, `Siapa ahli warisnya?`, `Berapa uang pertanggungan?`, `Apa risikonya?`, `Apa polis tetap aktif kalau premi terlambat?`. Giữ giọng lịch sự nhưng hỏi cụ thể.",
    tip_advice_en:
      "Useful questions for an agent: `Apa manfaat utamanya?`, `Siapa ahli warisnya?`, `Berapa uang pertanggungan?`, `Apa risikonya?`, `Apa polis tetap aktif kalau premi terlambat?`. Keep the tone polite but ask specific questions.",
    vocabulary: [
      {
        cell_id: "81c54bae-0916-478b-a498-87da52342656",
        word: "asuransi jiwa",
        en: "life insurance",
        vi: "bảo hiểm nhân thọ",
        pos: "noun phrase",
        pronunciation_vi: "a-su-RAN-si JI-wa",
        pronunciation_en: "a-su-RAN-see JI-wa",
      },
      {
        cell_id: "a87ca7e8-a405-4613-b4cc-d5d91e00bc4a",
        word: "ahli waris",
        en: "heir / beneficiary",
        vi: "người thừa kế / người thụ hưởng",
        pos: "noun phrase",
        pronunciation_vi: "AH-li WA-ris",
        pronunciation_en: "AH-lee WA-ris",
      },
      {
        cell_id: "4862fa79-61ba-49ad-9059-e6637b593981",
        word: "agen asuransi",
        en: "insurance agent",
        vi: "đại lý / tư vấn bảo hiểm",
        pos: "noun phrase",
        pronunciation_vi: "A-gen a-su-RAN-si",
        pronunciation_en: "A-gen a-su-RAN-see",
      },
      {
        cell_id: "27f39f45-4d0d-4c44-a5f8-c03164a6d26d",
        word: "uang pertanggungan",
        en: "sum insured / benefit amount",
        vi: "số tiền bảo hiểm / quyền lợi chi trả",
        pos: "noun phrase",
        pronunciation_vi: "U-ang per-tang-GUNG-an",
        pronunciation_en: "OO-ang per-tang-GOONG-an",
      },
      {
        cell_id: "3e983f37-d605-4952-a9af-f11bf14aef05",
        word: "tertanggung",
        en: "insured person",
        vi: "người được bảo hiểm",
        pos: "noun",
        pronunciation_vi: "ter-TANG-gung",
        pronunciation_en: "ter-TANG-goong",
      },
      {
        cell_id: "c37631b9-cdcb-497f-af2d-01145638ab95",
        word: "tetap aktif",
        en: "remain active / valid",
        vi: "vẫn còn hiệu lực",
        pos: "phrase",
        pronunciation_vi: "te-TAP AK-tif",
        pronunciation_en: "te-TAP AK-tif",
      },
    ],
    dialogue: [
      {
        cell_id: "ff34b59c-fd3d-4522-b5ad-9266d08b7ca0",
        speaker: "Calon Nasabah",
        text: "Saya sedang mempertimbangkan asuransi jiwa.",
        vi: "Tôi đang cân nhắc bảo hiểm nhân thọ.",
        en: "I am considering life insurance.",
      },
      {
        cell_id: "ffa30f13-7177-4f36-afdd-dbb7cad8ebe7",
        speaker: "Agen",
        text: "Baik. Apakah Bapak sudah menentukan ahli waris?",
        vi: "Vâng. Anh/bác đã xác định người thụ hưởng chưa?",
        en: "Okay. Have you chosen a beneficiary?",
      },
      {
        cell_id: "c291b8ce-2793-45f5-b091-2ede006db597",
        speaker: "Calon Nasabah",
        text: "Belum. Saya juga ingin membaca polis sebelum tanda tangan.",
        vi: "Chưa. Tôi cũng muốn đọc hợp đồng trước khi ký.",
        en: "Not yet. I also want to read the policy before signing.",
      },
      {
        cell_id: "2f720870-5704-4407-9f46-97b741435d94",
        speaker: "Agen",
        text: "Tentu. Saya jelaskan premi, uang pertanggungan, dan masa tunggu.",
        vi: "Tất nhiên. Tôi sẽ giải thích phí bảo hiểm, số tiền bảo hiểm và thời gian chờ.",
        en: "Of course. I will explain the premium, benefit amount, and waiting period.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ bảo hiểm nhân thọ với nghĩa tiếng Việt:",
        instruction_en: "Match each life-insurance term with its Vietnamese meaning:",
        items: [
          { prompt: "asuransi jiwa", answer: "bảo hiểm nhân thọ" },
          { prompt: "ahli waris", answer: "người thụ hưởng / người thừa kế" },
          { prompt: "agen asuransi", answer: "đại lý / tư vấn bảo hiểm" },
          { prompt: "tertanggung", answer: "người được bảo hiểm" },
        ],
      },
      {
        type: "fill_blank",
        instruction_vi: "Chọn từ đúng:",
        instruction_en: "Choose the correct word:",
        items: [
          {
            prompt: "Siapa yang bisa menjadi ahli ___ dalam polis ini? (người thụ hưởng)",
            answer: "waris",
            options: ["waris", "warga", "waktu"],
          },
          {
            prompt: "Agen ___ meminta data keluarga saya. (bảo hiểm)",
            answer: "asuransi",
            options: ["asuransi", "asrama", "alamat"],
          },
          {
            prompt: "Saya perlu membaca polis sebelum tanda ___. (ký)",
            answer: "tangan",
            options: ["tangan", "tangga", "tanggal"],
          },
        ],
      },
    ],
  },
];
