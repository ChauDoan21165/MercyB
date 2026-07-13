// Discussing salary and benefits Indonesian lesson pack for Vietnamese learners.
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

export const discussingSalaryBenefitsLessons: IndonesianLesson[] = [
  {
    id: "indonesian_salary_payslip_benefits",
    level: "B1",
    category: "work",
    title_vi: "Gaji, slip gaji và tunjangan",
    title_en: "Salary, payslips, and benefits",
    sentences: [
      {
        en: "Saya ingin memastikan rincian gaji bulanan saya.",
        vi: "Tôi muốn xác nhận chi tiết lương hằng tháng của tôi.",
        pronunciation_focus: [
          "SA-ya I-ngin me-mas-TI-kan rin-CI-an GA-ji bu-LA-nan SA-ya.",
          "`rincian gaji` = chi tiết lương; `gaji bulanan` = lương hằng tháng.",
          "L1 Việt: `gaji` là lương, không phải `harga`. `Harga` dùng cho giá hàng hóa/dịch vụ.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-mas-TEE-kan rin-CHEE-an GA-jee boo-LA-nan SA-ya.",
          "`rincian gaji` = salary details; `gaji bulanan` = monthly salary.",
          "VN-speaker trap: `gaji` means salary, not `harga`. `Harga` is the price of goods/services.",
        ],
      },
      {
        en: "Apakah slip gaji dikirim setiap akhir bulan?",
        vi: "Phiếu lương có được gửi vào cuối mỗi tháng không?",
        pronunciation_focus: [
          "A-pa-kah SLIP GA-ji di-KI-rim se-TI-ap A-khir BU-lan.",
          "`slip gaji` = phiếu lương; `akhir bulan` = cuối tháng.",
          "L1 Việt: trong công sở Indonesia, `slip gaji` là cụm phổ biến; không cần dịch thành `kertas gaji`.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SLIP GA-jee di-KEE-rim se-TEE-ap A-khir BOO-lan.",
          "`slip gaji` = payslip; `akhir bulan` = end of the month.",
          "VN-speaker note: in Indonesian workplaces, `slip gaji` is the normal phrase; do not translate it as `kertas gaji`.",
        ],
      },
      {
        en: "Tunjangan transportasi sudah termasuk dalam gaji pokok atau terpisah?",
        vi: "Phụ cấp đi lại đã bao gồm trong lương cơ bản hay tách riêng?",
        pronunciation_focus: [
          "tun-JANG-an trans-por-TA-si SU-dah ter-MA-suk DA-lam GA-ji PO-kok A-tau ter-PI-sah.",
          "`tunjangan transportasi` = phụ cấp đi lại; `gaji pokok` = lương cơ bản.",
          "L1 Việt: `termasuk dalam` = bao gồm trong; nếu khoản riêng, dùng `terpisah`.",
        ],
        pronunciation_focus_en: [
          "toon-JANG-an trans-por-TA-si SOO-dah ter-MA-suk DA-lam GA-jee PO-kok A-tau ter-PEE-sah.",
          "`tunjangan transportasi` = transportation allowance; `gaji pokok` = base salary.",
          "VN-speaker note: `termasuk dalam` = included in; if it is separate, use `terpisah`.",
        ],
      },
      {
        en: "Apakah perusahaan menanggung BPJS Kesehatan dan BPJS Ketenagakerjaan?",
        vi: "Công ty có chi trả/đóng BPJS y tế và BPJS lao động không?",
        pronunciation_focus: [
          "A-pa-kah pe-ru-sa-HA-an me-NANG-gung be-pe-je-ES ke-SE-hat-an dan be-pe-je-ES ke-te-na-ga-ker-JA-an.",
          "`menanggung BPJS` = chịu/chi trả phần BPJS; `Kesehatan` khác `Ketenagakerjaan`.",
          "L1 Việt: đừng gộp tất cả thành `asuransi`. BPJS là hệ thống cụ thể, nên hỏi rõ loại BPJS.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah pe-ru-sa-HA-an me-NANG-goong be-pe-je-ES ke-SE-hat-an dan be-pe-je-ES ke-te-na-ga-ker-JA-an.",
          "`menanggung BPJS` = cover/pay for BPJS; `Kesehatan` differs from `Ketenagakerjaan`.",
          "VN-speaker note: do not lump everything into `asuransi`. BPJS is a specific system, so ask which BPJS applies.",
        ],
      },
      {
        en: "Berapa jatah cuti tahunan untuk karyawan tetap?",
        vi: "Số ngày nghỉ phép năm dành cho nhân viên chính thức là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa JA-tah CU-ti ta-HU-nan UN-tuk kar-ya-WAN te-TAP.",
          "`jatah cuti tahunan` = số ngày nghỉ phép năm; `karyawan tetap` = nhân viên chính thức/lâu dài.",
          "L1 Việt: hỏi số lượng bằng `berapa`; đừng hỏi `apa jatah cuti` khi cần con số.",
        ],
        pronunciation_focus_en: [
          "be-RA-pa JA-tah CHOO-ti ta-HOO-nan OON-tuk kar-ya-WAN te-TAP.",
          "`jatah cuti tahunan` = annual leave entitlement; `karyawan tetap` = permanent employee.",
          "VN-speaker trap: ask quantities with `berapa`; do not ask `apa jatah cuti` when you need a number.",
        ],
      },
      {
        en: "Bonus tahunan dihitung berdasarkan kinerja dan kebijakan perusahaan.",
        vi: "Thưởng hằng năm được tính dựa trên hiệu suất và chính sách công ty.",
        pronunciation_focus: [
          "BO-nus ta-HU-nan di-HI-tung ber-DA-sar-kan ki-NER-ja dan ke-bi-JAK-an pe-ru-sa-HA-an.",
          "`berdasarkan kinerja` = dựa trên hiệu suất; `kebijakan perusahaan` = chính sách công ty.",
          "L1 Việt: `bonus` không bảo đảm tự động; câu này nói rõ nó phụ thuộc vào kinerja và kebijakan.",
        ],
        pronunciation_focus_en: [
          "BO-nus ta-HOO-nan di-HEE-toong ber-DA-sar-kan ki-NER-ja dan ke-bi-JAK-an pe-ru-sa-HA-an.",
          "`berdasarkan kinerja` = based on performance; `kebijakan perusahaan` = company policy.",
          "VN-speaker note: `bonus` is not automatically guaranteed; this sentence shows it depends on performance and policy.",
        ],
      },
    ],
    cultural_notes_vi:
      "Khi nói chuyện với HRD ở Indonesia, hỏi về `gaji pokok`, `tunjangan`, `slip gaji`, `BPJS`, `cuti`, và `bonus` là bình thường, nhất là trước khi ký kontrak kerja. Giọng nên lịch sự và cụ thể: hỏi khoản nào termasuk trong gaji, khoản nào terpisah, và apakah ada potongan.",
    cultural_notes_en:
      "When speaking with HR in Indonesia, asking about `gaji pokok`, `tunjangan`, `slip gaji`, `BPJS`, `cuti`, and `bonus` is normal, especially before signing an employment contract. Keep the tone polite and specific: ask what is included in salary, what is separate, and whether there are deductions.",
    tip_advice_vi:
      "Khung hỏi HR hữu ích: `Saya ingin memastikan rincian...`, `Apakah ... termasuk atau terpisah?`, `Berapa jatah...?`. Người Việt nên phân biệt `gaji pokok` (lương cơ bản), `tunjangan` (phụ cấp), và `bonus` (thưởng).",
    tip_advice_en:
      "Useful HR question frames: `Saya ingin memastikan rincian...`, `Apakah ... termasuk atau terpisah?`, `Berapa jatah...?`. Vietnamese speakers should distinguish `gaji pokok` (base salary), `tunjangan` (allowance/benefit), and `bonus` (bonus).",
    vocabulary: [
      { cell_id: "ddd715d5-ba0d-4b2e-a2fc-3c3f44ebc52d", word: "gaji", en: "salary", vi: "lương", pos: "noun", pronunciation_vi: "GA-ji", pronunciation_en: "GA-jee" },
      { cell_id: "73f59ad2-2cba-44dd-abdc-7c8cdfe8329a", word: "slip gaji", en: "payslip", vi: "phiếu lương", pos: "noun phrase", pronunciation_vi: "SLIP GA-ji", pronunciation_en: "SLIP GA-jee" },
      { cell_id: "1f04b94c-a0cb-4b4e-8e0f-c260642d87a7", word: "tunjangan", en: "allowance / benefit", vi: "phụ cấp / phúc lợi", pos: "noun", pronunciation_vi: "tun-JANG-an", pronunciation_en: "toon-JANG-an" },
      { cell_id: "59bbfed2-fbf1-45aa-b4b3-1fe5b42e023e", word: "gaji pokok", en: "base salary", vi: "lương cơ bản", pos: "noun phrase", pronunciation_vi: "GA-ji PO-kok", pronunciation_en: "GA-jee PO-kok" },
      { cell_id: "a46a98e5-559b-48f3-baa4-02c3a061ca20", word: "BPJS", en: "Indonesian social security program", vi: "chương trình bảo hiểm xã hội Indonesia", pos: "noun", pronunciation_vi: "be-pe-je-ES", pronunciation_en: "be-pe-je-ES" },
      { cell_id: "4cf540d3-0beb-469b-a9b1-fa0b5f479673", word: "cuti tahunan", en: "annual leave", vi: "nghỉ phép năm", pos: "noun phrase", pronunciation_vi: "CU-ti ta-HU-nan", pronunciation_en: "CHOO-ti ta-HOO-nan" },
      { cell_id: "1bb910dd-e69a-4398-b402-1a3f3635abec", word: "bonus tahunan", en: "annual bonus", vi: "thưởng hằng năm", pos: "noun phrase", pronunciation_vi: "BO-nus ta-HU-nan", pronunciation_en: "BO-nus ta-HOO-nan" },
    ],
    dialogue: [
      {
        cell_id: "c5c60e84-6ad4-4612-be0a-e98d3f0618b5",
        speaker: "Karyawan",
        text: "Bu, saya ingin memastikan rincian gaji bulanan saya.",
        vi: "Chị ơi, tôi muốn xác nhận chi tiết lương hằng tháng của tôi.",
        en: "Ma'am, I would like to confirm the details of my monthly salary.",
      },
      {
        cell_id: "13935aca-ac28-4ed6-94d3-4171e12708bc",
        speaker: "HRD",
        text: "Silakan. Rinciannya ada di slip gaji setiap akhir bulan.",
        vi: "Mời anh/chị. Chi tiết có trong phiếu lương mỗi cuối tháng.",
        en: "Sure. The details are in the payslip at the end of each month.",
      },
      {
        cell_id: "d7059e42-9918-4601-b522-f71c118c8ee8",
        speaker: "Karyawan",
        text: "Apakah tunjangan transportasi termasuk dalam gaji pokok?",
        vi: "Phụ cấp đi lại có bao gồm trong lương cơ bản không?",
        en: "Is the transportation allowance included in the base salary?",
      },
      {
        cell_id: "731880f0-9922-4021-8d15-59a639b21b26",
        speaker: "HRD",
        text: "Tidak, tunjangan itu terpisah dan tertulis di kontrak kerja.",
        vi: "Không, phụ cấp đó tách riêng và được ghi trong hợp đồng lao động.",
        en: "No, that allowance is separate and written in the employment contract.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối thuật ngữ HR với nghĩa.",
        instruction_en: "Match the HR term to its meaning.",
        items: [
          { prompt: "gaji pokok", answer: "lương cơ bản" },
          { prompt: "slip gaji", answer: "phiếu lương" },
          { prompt: "tunjangan", answer: "phụ cấp" },
          { prompt: "cuti tahunan", answer: "nghỉ phép năm" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Phiếu lương có được gửi cuối mỗi tháng không?", answer: "Apakah slip gaji dikirim setiap akhir bulan?" },
          { prompt: "Số ngày nghỉ phép năm là bao nhiêu?", answer: "Berapa jatah cuti tahunan?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_salary_negotiation_contract",
    level: "B2",
    category: "work",
    title_vi: "Negosiasi gaji và kontrak kerja",
    title_en: "Salary negotiation and employment contracts",
    sentences: [
      {
        en: "Apakah masih ada ruang untuk negosiasi gaji?",
        vi: "Vẫn còn khoảng trống để thương lượng lương không?",
        pronunciation_focus: [
          "A-pa-kah MA-sih A-da RU-ang UN-tuk ne-go-si-A-si GA-ji.",
          "`ruang untuk negosiasi` = dư địa/khoảng trống để thương lượng.",
          "L1 Việt: câu này mềm và chuyên nghiệp hơn `Bisa naik gaji?` trong phỏng vấn hoặc offer call.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah MA-sih A-da ROO-ang OON-tuk ne-go-si-A-si GA-jee.",
          "`ruang untuk negosiasi` = room for negotiation.",
          "VN-speaker note: this sounds softer and more professional than `Bisa naik gaji?` in an interview or offer call.",
        ],
      },
      {
        en: "Berdasarkan pengalaman saya, ekspektasi gaji saya sekitar delapan juta rupiah.",
        vi: "Dựa trên kinh nghiệm của tôi, mức lương kỳ vọng của tôi khoảng tám triệu rupiah.",
        pronunciation_focus: [
          "ber-DA-sar-kan pe-nga-LA-man SA-ya, eks-pek-TA-si GA-ji SA-ya se-KI-tar de-LA-pan JU-ta ru-PI-ah.",
          "`ekspektasi gaji` = mức lương kỳ vọng; `sekitar` = khoảng.",
          "L1 Việt: nêu lý do bằng `berdasarkan pengalaman saya` giúp câu thương lượng bớt đòi hỏi trực tiếp.",
        ],
        pronunciation_focus_en: [
          "ber-DA-sar-kan pe-nga-LA-man SA-ya, eks-pek-TA-si GA-jee SA-ya se-KEE-tar de-LA-pan JOO-ta roo-PEE-ah.",
          "`ekspektasi gaji` = salary expectation; `sekitar` = around.",
          "VN-speaker note: giving a reason with `berdasarkan pengalaman saya` makes the negotiation less blunt.",
        ],
      },
      {
        en: "Saya ingin memahami masa percobaan sebelum menandatangani kontrak kerja.",
        vi: "Tôi muốn hiểu thời gian thử việc trước khi ký hợp đồng lao động.",
        pronunciation_focus: [
          "SA-ya I-ngin me-ma-HA-mi MA-sa per-CO-ba-an se-BE-lum me-nan-da-ta-NGA-ni KON-trak KER-ja.",
          "`masa percobaan` = thời gian thử việc; `menandatangani kontrak kerja` = ký hợp đồng lao động.",
          "L1 Việt: `kontrak kerja` là hợp đồng lao động; đừng dùng `kontrak bekerja`.",
        ],
        pronunciation_focus_en: [
          "SA-ya I-ngin me-ma-HA-mi MA-sa per-CHO-ba-an se-BE-lum me-nan-da-ta-NGA-ni KON-trak KER-ja.",
          "`masa percobaan` = probation period; `menandatangani kontrak kerja` = sign an employment contract.",
          "VN-speaker trap: `kontrak kerja` means employment contract; do not say `kontrak bekerja`.",
        ],
      },
      {
        en: "Apakah kenaikan gaji ditinjau setiap tahun?",
        vi: "Việc tăng lương có được xem xét mỗi năm không?",
        pronunciation_focus: [
          "A-pa-kah ke-NAI-kan GA-ji di-TIN-jau se-TI-ap ta-HUN.",
          "`kenaikan gaji` = tăng lương; `ditinjau` = được xem xét/đánh giá lại.",
          "L1 Việt: `naik gaji` là nói thường; trong HR, cụm danh từ `kenaikan gaji` nghe trang trọng hơn.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah ke-NAI-kan GA-jee di-TIN-jau se-TEE-ap ta-HOON.",
          "`kenaikan gaji` = salary increase; `ditinjau` = reviewed.",
          "VN-speaker note: `naik gaji` is casual speech; in HR, the noun phrase `kenaikan gaji` sounds more formal.",
        ],
      },
      {
        en: "Saya perlu membaca pasal tentang lembur dan bonus dengan teliti.",
        vi: "Tôi cần đọc kỹ điều khoản về làm thêm giờ và thưởng.",
        pronunciation_focus: [
          "SA-ya per-LU mem-BA-ca PA-sal ten-TANG LEM-bur dan BO-nus de-NGAN te-LI-ti.",
          "`pasal` = điều khoản trong hợp đồng; `lembur` = làm thêm giờ; `dengan teliti` = kỹ/cẩn thận.",
          "L1 Việt: `lembur` là làm thêm giờ, không phải làm ca đêm nói chung.",
        ],
        pronunciation_focus_en: [
          "SA-ya per-LOO mem-BA-cha PA-sal ten-TANG LEM-bur dan BO-nus de-NGAN te-LEE-ti.",
          "`pasal` = contract clause; `lembur` = overtime; `dengan teliti` = carefully.",
          "VN-speaker trap: `lembur` means overtime, not night shift in general.",
        ],
      },
      {
        en: "Bolehkah saya meminta waktu satu hari untuk meninjau tawaran ini?",
        vi: "Tôi có thể xin một ngày để xem xét đề nghị này không?",
        pronunciation_focus: [
          "BO-leh-kah SA-ya me-MIN-ta WAK-tu SA-tu HA-ri UN-tuk me-NIN-jau TA-war-an I-ni.",
          "`meninjau tawaran` = xem xét đề nghị; `meminta waktu` = xin thêm thời gian.",
          "L1 Việt: khi chưa muốn đồng ý ngay, câu này lịch sự hơn im lặng hoặc trả lời quá nhanh.",
        ],
        pronunciation_focus_en: [
          "BO-leh-kah SA-ya me-MIN-ta WAK-tu SA-too HA-ri OON-tuk me-NIN-jau TA-war-an EE-ni.",
          "`meninjau tawaran` = review an offer; `meminta waktu` = ask for time.",
          "VN-speaker note: when you do not want to accept immediately, this is more polite than silence or rushing an answer.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong negosiasi gaji ở Indonesia, cách nói gián tiếp và có căn cứ thường được đánh giá tốt hơn: nhắc pengalaman, tanggung jawab, lokasi kerja, tunjangan, và isi kontrak. Trước khi ký, nên hỏi masa percobaan, lembur, cuti, BPJS, bonus, potongan, và kapan slip gaji diberikan.",
    cultural_notes_en:
      "In salary negotiation in Indonesia, indirect and evidence-based wording is often better received: mention experience, responsibilities, work location, benefits, and contract terms. Before signing, ask about probation, overtime, leave, BPJS, bonuses, deductions, and when payslips are issued.",
    tip_advice_vi:
      "Mẫu lịch sự: `Apakah masih ada ruang untuk negosiasi gaji?`, `Berdasarkan pengalaman saya...`, `Bolehkah saya meminta waktu...?`. Tránh câu quá trực diện như `Gajinya kurang`; hãy nói bằng `ekspektasi gaji` và lý do cụ thể.",
    tip_advice_en:
      "Polite templates: `Apakah masih ada ruang untuk negosiasi gaji?`, `Berdasarkan pengalaman saya...`, `Bolehkah saya meminta waktu...?`. Avoid blunt lines like `Gajinya kurang`; use `ekspektasi gaji` and a concrete reason.",
    vocabulary: [
      { cell_id: "33af3625-7674-4ffe-b1d5-fd1b5b644dff", word: "negosiasi gaji", en: "salary negotiation", vi: "thương lượng lương", pos: "noun phrase", pronunciation_vi: "ne-go-si-A-si GA-ji", pronunciation_en: "ne-go-si-A-si GA-jee" },
      { cell_id: "38287d5c-acdb-420f-bacc-a19d5dc481b1", word: "ekspektasi gaji", en: "salary expectation", vi: "mức lương kỳ vọng", pos: "noun phrase", pronunciation_vi: "eks-pek-TA-si GA-ji", pronunciation_en: "eks-pek-TA-si GA-jee" },
      { cell_id: "1cfec9ab-98cb-4479-8d7a-a4bfd3815e88", word: "kontrak kerja", en: "employment contract", vi: "hợp đồng lao động", pos: "noun phrase", pronunciation_vi: "KON-trak KER-ja", pronunciation_en: "KON-trak KER-ja" },
      { cell_id: "1fdc6a96-1c70-41c7-ac8c-a1c46982e060", word: "masa percobaan", en: "probation period", vi: "thời gian thử việc", pos: "noun phrase", pronunciation_vi: "MA-sa per-CO-ba-an", pronunciation_en: "MA-sa per-CHO-ba-an" },
      { cell_id: "ec08ba8a-2374-41fa-bfba-09f4a56ec119", word: "kenaikan gaji", en: "salary increase", vi: "tăng lương", pos: "noun phrase", pronunciation_vi: "ke-NAI-kan GA-ji", pronunciation_en: "ke-NAI-kan GA-jee" },
      { cell_id: "bcf1adef-f5a3-4e90-8838-cadf6175309b", word: "lembur", en: "overtime", vi: "làm thêm giờ", pos: "noun / verb", pronunciation_vi: "LEM-bur", pronunciation_en: "LEM-boor" },
      { cell_id: "1c73d0e7-c43d-4341-9fe8-416fcec53c8e", word: "tawaran", en: "offer", vi: "đề nghị / offer", pos: "noun", pronunciation_vi: "TA-war-an", pronunciation_en: "TA-war-an" },
    ],
    dialogue: [
      {
        cell_id: "dd4b4fda-650d-45f4-84d5-036bf70c61f7",
        speaker: "Kandidat",
        text: "Terima kasih atas tawarannya. Apakah masih ada ruang untuk negosiasi gaji?",
        vi: "Cảm ơn về lời đề nghị. Vẫn còn dư địa để thương lượng lương không?",
        en: "Thank you for the offer. Is there still room for salary negotiation?",
      },
      {
        cell_id: "3ed71b63-687b-48b1-bd5e-31061b69c48c",
        speaker: "HRD",
        text: "Boleh. Berapa ekspektasi gaji Anda?",
        vi: "Được. Mức lương kỳ vọng của anh/chị là bao nhiêu?",
        en: "Sure. What is your salary expectation?",
      },
      {
        cell_id: "6d499612-edf8-4ddc-a7d4-faed6fe91bf8",
        speaker: "Kandidat",
        text: "Berdasarkan pengalaman saya, ekspektasi gaji saya sekitar delapan juta rupiah.",
        vi: "Dựa trên kinh nghiệm của tôi, mức lương kỳ vọng của tôi khoảng tám triệu rupiah.",
        en: "Based on my experience, my salary expectation is around eight million rupiah.",
      },
      {
        cell_id: "d0ed7102-a8e8-4137-9c63-0d3411252c2a",
        speaker: "HRD",
        text: "Baik, kami akan meninjau kembali tawaran dan isi kontrak kerja.",
        vi: "Vâng, chúng tôi sẽ xem xét lại offer và nội dung hợp đồng lao động.",
        en: "Okay, we will review the offer and the employment contract terms.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu chuyên nghiệp nhất trong ngữ cảnh HR.",
        instruction_en: "Choose the most professional sentence in the HR context.",
        items: [
          {
            prompt: "Bạn muốn hỏi còn thương lượng lương được không.",
            answer: "Apakah masih ada ruang untuk negosiasi gaji?",
            options: [
              "Apakah masih ada ruang untuk negosiasi gaji?",
              "Gajinya kurang, naikkan sekarang.",
              "Saya tidak mau gaji itu.",
            ],
          },
          {
            prompt: "Bạn cần thời gian xem xét offer.",
            answer: "Bolehkah saya meminta waktu satu hari untuk meninjau tawaran ini?",
            options: [
              "Bolehkah saya meminta waktu satu hari untuk meninjau tawaran ini?",
              "Saya jawab nanti saja.",
              "Tawaran ini bikin bingung.",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn hiểu thời gian thử việc trước khi ký hợp đồng lao động.", answer: "Saya ingin memahami masa percobaan sebelum menandatangani kontrak kerja." },
          { prompt: "Việc tăng lương có được xem xét mỗi năm không?", answer: "Apakah kenaikan gaji ditinjau setiap tahun?" },
          { prompt: "Tôi cần đọc kỹ điều khoản về làm thêm giờ và thưởng.", answer: "Saya perlu membaca pasal tentang lembur dan bonus dengan teliti." },
        ],
      },
    ],
  },
];
