// Clinic back pain work Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// medical/work notes with English companions in pronunciation_focus_en.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

export type IndonesianExercise = Record<string, unknown>;

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  category: string;
  level: IndonesianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: IndonesianVocabEntry[];
  dialogue?: IndonesianDialogueLine[];
  exercises?: IndonesianExercise[];
  content?: string;
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_clinic_back_pain_work",
    level: "B1",
    category: "health_work",
    title_vi: "Đau lưng vì ngồi lâu và đi khám",
    title_en: "Back pain from sitting too long and clinic visit",
    sentences: [
      {
        en: "Saya sering sakit punggung karena duduk terlalu lama.",
        vi: "Tôi thường bị đau lưng vì ngồi quá lâu.",
        pronunciation_focus: [
          "SA-ya SER-ing SA-kit PUNG-gung ka-RE-na DU-duk ter-LA-lu LA-ma - `sakit punggung` = đau lưng; `duduk terlalu lama` = ngồi quá lâu.",
          "Lỗi người Việt: nói `punggung sakit` theo trật tự Việt. Tự nhiên hơn là `sakit punggung`.",
          "Luyện: `Saya sakit punggung karena duduk lama.`",
        ],
        pronunciation_focus_en: [
          "SA-ya SER-ing SA-kit POONG-goong ka-REH-na DOO-dook ter-LAH-loo LAH-ma - `sakit punggung` = back pain; `duduk terlalu lama` = sitting too long.",
          "VN-speaker trap: using Vietnamese order `punggung sakit`. Natural Indonesian is `sakit punggung`.",
          "Drill: `Saya sakit punggung karena duduk lama.`",
        ],
      },
      {
        en: "Pekerjaan saya membuat saya duduk lama setiap hari.",
        vi: "Công việc của tôi khiến tôi phải ngồi lâu mỗi ngày.",
        pronunciation_focus: [
          "pe-ker-JA-an SA-ya mem-BU-at SA-ya DU-duk LA-ma se-TI-ap HA-ri - `pekerjaan` = công việc; `duduk lama` = ngồi lâu.",
          "Lỗi người Việt: dùng `kerja saya` khi muốn nói công việc như một danh từ. Cần `pekerjaan saya`.",
          "Luyện: `Pekerjaan saya duduk lama.`",
        ],
        pronunciation_focus_en: [
          "peh-ker-JAH-an SAH-yah mem-BOO-at SAH-yah DOO-dook LAH-ma seh-TEE-ap HAH-ree - `pekerjaan` = job/work; `duduk lama` = sit for a long time.",
          "VN-speaker trap: using `kerja saya` when you mean the job as a noun. Use `pekerjaan saya`.",
          "Drill: `Pekerjaan saya membuat saya duduk lama.`",
        ],
      },
      {
        en: "Saya ingin periksa ke dokter hari ini.",
        vi: "Hôm nay tôi muốn đi khám bác sĩ.",
        pronunciation_focus: [
          "SA-ya I-ngin pe-RIK-sa ke DOK-ter HA-ri I-ni - `periksa ke dokter` = đi khám bác sĩ.",
          "Lỗi người Việt: nói `check dokter` hoặc `periksa dokter` thiếu `ke`. Khi đi khám, sering dipakai `ke dokter`.",
          "Luyện: `Saya ingin periksa ke dokter.`",
        ],
        pronunciation_focus_en: [
          "SA-ya EE-ngin peh-REEK-sah keh DOK-ter HAH-ree EE-nee - `periksa ke dokter` = to see a doctor.",
          "VN-speaker trap: saying `check dokter` or omitting `ke`. When going to a clinic, `ke dokter` is common.",
          "Drill: `Saya ingin periksa ke dokter.`",
        ],
      },
      {
        en: "Punggung saya terasa kaku dan nyeri.",
        vi: "Lưng tôi cảm thấy cứng và đau.",
        pronunciation_focus: [
          "PUNG-gung SA-ya te-RA-sa KA-ku dan NYE-ri - `kaku` = cứng; `nyeri` = đau/nhức y tế.",
          "`kaku` mô tả cơ thể căng cứng rất tự nhiên trong bệnh viện hoặc klinik.",
          "Lỗi người Việt: dùng chỉ `sakit` cho mọi triệu chứng. `kaku` và `nyeri` giúp mô tả chính xác hơn.",
        ],
        pronunciation_focus_en: [
          "POONG-goong SAH-yah teh-RAH-sah KAH-koo dan NYEH-ree - `kaku` = stiff; `nyeri` = pain/aching.",
          "`Kaku` is a very natural word for a stiff body in a clinic or hospital.",
          "VN-speaker trap: using only `sakit` for every symptom. `kaku` and `nyeri` are more precise.",
        ],
      },
      {
        en: "Apakah saya perlu fisioterapi?",
        vi: "Tôi có cần vật lý trị liệu không?",
        pronunciation_focus: [
          "a-pa-KAH SA-ya per-LU fi-si-o-te-RA-pi - `fisioterapi` = vật lý trị liệu.",
          "Lỗi người Việt: dịch kiểu `terapi fisik` theo tiếng Anh. Từ chẩn chuẩn là `fisioterapi`.",
          "Luyện: `Saya perlu fisioterapi?`",
        ],
        pronunciation_focus_en: [
          "a-pa-KAH SAH-yah per-LOO fee-see-oh-teh-RAH-pee - `fisioterapi` = physiotherapy.",
          "VN-speaker trap: translating it as `terapi fisik` from English. The standard Indonesian term is `fisioterapi`.",
          "Drill: `Saya perlu fisioterapi?`",
        ],
      },
      {
        en: "Dokter memberi obat nyeri untuk sementara.",
        vi: "Bác sĩ cho thuốc giảm đau tạm thời.",
        pronunciation_focus: [
          "DOK-ter mem-BE-ri O-bat NYE-ri un-TUK sem-eN-TARA - `obat nyeri` = thuốc giảm đau; `untuk sementara` = tạm thời.",
          "Lỗi người Việt: nói `obat sakit` nghe lạ. Trong y tế, `obat nyeri` atau `obat pereda nyeri` lebih tepat.",
          "Luyện: `Dokter memberi obat nyeri.`",
        ],
        pronunciation_focus_en: [
          "DOK-ter mem-BEH-ree OH-bat NYEH-ree oon-TOOK sem-en-TAH-rah - `obat nyeri` = pain medicine; `untuk sementara` = temporarily.",
          "VN-speaker trap: saying `obat sakit` sounds odd. In medical talk, `obat nyeri` or `obat pereda nyeri` is better.",
          "Drill: `Dokter memberi obat nyeri.`",
        ],
      },
      {
        en: "Saya butuh surat izin kerja selama dua hari.",
        vi: "Tôi cần giấy nghỉ làm trong hai ngày.",
        pronunciation_focus: [
          "SA-ya BU-tuh SU-rat I-zin KER-ja se-LA-ma DU-a HA-ri - `surat izin kerja` = giấy nghỉ làm; `selama dua hari` = trong hai ngày.",
          "Lỗi người Việt: nói `surat cuti sakit` trong mọi nơi. Trong công việc, `surat izin kerja` hoặc `surat dokter` thường được dùng tùy perusahaan.",
          "Luyện: `Saya butuh surat izin kerja.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah BOO-tooh SOO-rat EE-zin KER-jah seh-LAH-mah DOO-ah HAH-ree - `surat izin kerja` = work excuse note; `selama dua hari` = for two days.",
          "VN-speaker trap: using `surat cuti sakit` everywhere. At work, `surat izin kerja` or `surat dokter` is often used depending on the company.",
          "Drill: `Saya butuh surat izin kerja.`",
        ],
      },
      {
        en: "Kalau duduk lama, saya perlu latihan ringan setiap jam.",
        vi: "Nếu ngồi lâu, tôi cần tập nhẹ mỗi giờ.",
        pronunciation_focus: [
          "KA-lau DU-duk LA-ma, SA-ya per-LU LA-ti-han RING-an se-TI-ap JAM - `latihan ringan` = bài tập nhẹ; `setiap jam` = mỗi giờ.",
          "Lỗi người Việt: dùng `olahraga kecil` theo nghĩa đen. `Latihan ringan` tự nhiên hơn khi nói về cơ thể.",
          "Luyện: `Saya perlu latihan ringan.`",
        ],
        pronunciation_focus_en: [
          "KAH-lau DOO-dook LAH-ma, SAH-yah per-LOO LAH-tee-han REENG-an seh-TEE-ap JAHM - `latihan ringan` = light exercises; `setiap jam` = every hour.",
          "VN-speaker trap: literal `olahraga kecil`. `Latihan ringan` is more natural for body care.",
          "Drill: `Saya perlu latihan ringan.`",
        ],
      },
      {
        en: "Saya akan kontrol ulang minggu depan.",
        vi: "Tôi sẽ tái khám vào tuần sau.",
        pronunciation_focus: [
          "SA-ya A-kan KON-trol U-lang MING-gu de-PAN - `kontrol ulang` = tái khám; `minggu depan` = tuần sau.",
          "Lỗi người Việt: dùng `cek lagi` khi cần văn cảnh y tế. `Kontrol ulang` nghe đúng chuyên môn hơn.",
          "Luyện: `Minggu depan kontrol ulang.`",
        ],
        pronunciation_focus_en: [
          "SAH-yah A-kan KON-trohl OO-lang MING-goo deh-PAN - `kontrol ulang` = follow-up visit; `minggu depan` = next week.",
          "VN-speaker trap: using `cek lagi` in a medical context. `Kontrol ulang` sounds more professional.",
          "Drill: `Minggu depan kontrol ulang.`",
        ],
      },
      {
        en: "Dokter menyarankan saya istirahat lebih sering.",
        vi: "Bác sĩ khuyên tôi nghỉ ngơi thường xuyên hơn.",
        pronunciation_focus: [
          "DOK-ter me-nya-RAN-kan SA-ya is-ti-RA-hat le-BIH SE-ring - `menyarankan` = khuyên; `istirahat lebih sering` = nghỉ thường xuyên hơn.",
          "Lỗi người Việt: dùng `dokter bilang` trong hồ sơ y tế. `Menyarankan` lebih formal dan tepat.",
          "Luyện: `Dokter menyarankan istirahat.`",
        ],
        pronunciation_focus_en: [
          "DOK-ter mehn-yah-RAN-kan SAH-yah is-tee-RAH-hat leh-BEEH SEH-reeng - `menyarankan` = recommend; `istirahat lebih sering` = rest more often.",
          "VN-speaker trap: `dokter bilang` in medical notes. `Menyarankan` is more formal and accurate.",
          "Drill: `Dokter menyarankan istirahat.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, sakit punggung vì duduk lama rất thường gặp ở pekerja kantor, supir, dan orang yang kerja depan komputer. Khi đi khám, pasien thường nói rõ posisi đau: `punggung bawah`, `pinggang`, atau `leher`, plus apakah ada kebas, kaku, atau nyeri menjalar. Dokter có thể menyarankan fisioterapi, obat nyeri sementara, istirahat, dan kontrol ulang. Nếu cần nghỉ làm, banyak tempat kerja meminta surat dokter hoặc surat izin kerja.",
    cultural_notes_en:
      "In Indonesia, back pain from sitting too long is common among office workers, drivers, and people who work in front of a computer. During a visit, patients usually specify where it hurts: `punggung bawah`, `pinggang`, or `leher`, plus whether there is numbness, stiffness, or radiating pain. The doctor may recommend physiotherapy, temporary pain medicine, rest, and a follow-up visit. If time off work is needed, many workplaces ask for a doctor’s note or work excuse letter.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong phòng khám, hãy nói theo công thức `Saya sakit punggung karena duduk terlalu lama`, `Punggung saya terasa kaku dan nyeri`, `Apakah saya perlu fisioterapi?`, `Saya butuh surat izin kerja`, `Saya akan kontrol ulang minggu depan`. Dùng `kontrol ulang` cho tái khám và `obat nyeri` cho thuốc giảm đau.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in the clinic, use the pattern `Saya sakit punggung karena duduk terlalu lama`, `Punggung saya terasa kaku dan nyeri`, `Apakah saya perlu fisioterapi?`, `Saya butuh surat izin kerja`, `Saya akan kontrol ulang minggu depan`. Use `kontrol ulang` for follow-up visits and `obat nyeri` for pain medicine.",
    vocabulary: [
      { cell_id: "960e3db2-381c-4cbc-9488-b16eddf5da33", word: "sakit punggung", en: "back pain", vi: "đau lưng", pos: "noun phrase", pronunciation_vi: "SA-kit PUNG-gung", pronunciation_en: "SA-kit POONG-goong" },
      { cell_id: "e855350d-7939-4dfd-881b-a35bdac157ce", word: "duduk lama", en: "sit for a long time", vi: "ngồi lâu", pos: "verb phrase", pronunciation_vi: "DU-duk LA-ma", pronunciation_en: "DOO-dook LAH-ma" },
      { cell_id: "158d444a-93ad-4151-9c6d-0ab3584443a9", word: "dokter", en: "doctor", vi: "bác sĩ", pos: "noun", pronunciation_vi: "DOK-ter", pronunciation_en: "DOK-ter" },
      { cell_id: "7e05aec5-d8cc-444a-9c6c-46aa1e5aa187", word: "fisioterapi", en: "physiotherapy", vi: "vật lý trị liệu", pos: "noun", pronunciation_vi: "fi-si-o-te-RA-pi", pronunciation_en: "fee-see-oh-teh-RAH-pee" },
      { cell_id: "2047e39c-ceec-4406-b885-94d96ff8976f", word: "obat nyeri", en: "pain medicine", vi: "thuốc giảm đau", pos: "noun phrase", pronunciation_vi: "O-bat NYE-ri", pronunciation_en: "OH-bat NYEH-ree" },
      { cell_id: "9085e9da-2543-41e4-b095-cd1fefc50cfd", word: "surat izin kerja", en: "work excuse note", vi: "giấy nghỉ làm", pos: "noun phrase", pronunciation_vi: "SU-rat I-zin KER-ja", pronunciation_en: "SOO-rat EE-zin KER-jah" },
      { cell_id: "a1ab401b-d502-42be-be90-505cc2f105dc", word: "latihan ringan", en: "light exercise", vi: "bài tập nhẹ", pos: "noun phrase", pronunciation_vi: "LA-ti-han RING-an", pronunciation_en: "LAH-tee-han REENG-an" },
      { cell_id: "30d25424-21b7-480e-9d16-97daaaa1efdf", word: "kontrol ulang", en: "follow-up visit", vi: "tái khám", pos: "noun phrase", pronunciation_vi: "KON-trol U-lang", pronunciation_en: "KON-trohl OO-lang" },
      { cell_id: "9bb236ca-d503-4ac8-8112-47b5cfcbad7e", word: "kaku", en: "stiff", vi: "cứng", pos: "adjective", pronunciation_vi: "KA-ku", pronunciation_en: "KAH-koo" },
      { cell_id: "1fd1be70-c063-433c-896b-a2e36ad323a4", word: "nyeri", en: "pain / aching", vi: "đau / nhức", pos: "adjective / noun", pronunciation_vi: "NYE-ri", pronunciation_en: "NYEH-ree" },
    ],
    dialogue: [
      {
        cell_id: "b1a2799c-2290-40fa-96ad-54d6c9cd299e",
        speaker: "Pasien",
        text: "Dok, saya sering sakit punggung karena duduk terlalu lama.",
        vi: "Bác sĩ ơi, tôi thường bị đau lưng vì ngồi quá lâu.",
        en: "Doctor, I often have back pain because I sit too long.",
      },
      {
        cell_id: "00aa8edb-6229-4e79-912a-12262bfd98ff",
        speaker: "Dokter",
        text: "Baik, punggungnya terasa kaku atau nyeri menjalar?",
        vi: "Được rồi, lưng có cảm thấy cứng hay đau lan không?",
        en: "Okay, does your back feel stiff or is the pain radiating?",
      },
      {
        cell_id: "b0733b53-579c-4007-b5a7-39d63ab3ee06",
        speaker: "Pasien",
        text: "Iya, saya juga butuh surat izin kerja untuk dua hari.",
        vi: "Vâng, tôi cũng cần giấy nghỉ làm trong hai ngày.",
        en: "Yes, I also need a work excuse note for two days.",
      },
      {
        cell_id: "223ec9e1-aec9-4e9b-8731-9f8513b258ab",
        speaker: "Dokter",
        text: "Saya sarankan fisioterapi dan obat nyeri untuk sementara.",
        vi: "Tôi khuyên vật lý trị liệu và thuốc giảm đau tạm thời.",
        en: "I recommend physiotherapy and temporary pain medicine.",
      },
      {
        cell_id: "0fc15ddb-2ef7-440d-bf28-9f0643617b8c",
        speaker: "Pasien",
        text: "Kapan saya harus kontrol ulang?",
        vi: "Khi nào tôi nên tái khám?",
        en: "When should I come back for a follow-up?",
      },
      {
        cell_id: "36487505-f8d4-45bc-a714-67cbbc40ebe1",
        speaker: "Dokter",
        text: "Minggu depan, lalu kita lihat apakah keluhannya membaik.",
        vi: "Tuần sau, rồi chúng ta xem triệu chứng có đỡ hơn không.",
        en: "Next week, then we will see whether the complaint improves.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Tôi thường bị đau lưng vì ngồi quá lâu.",
        prompt_en: "Translate into Indonesian: I often have back pain because I sit too long.",
        answer: "Saya sering sakit punggung karena duduk terlalu lama.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Apakah saya perlu ____?",
        prompt_en: "Fill in the blank: Apakah saya perlu ____?",
        answer: "fisioterapi",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`kontrol ulang` nghĩa là gì?",
        prompt_en: "What does `kontrol ulang` mean?",
        choices: ["tái khám / follow-up visit", "uống thuốc / take medicine", "nghỉ phép / holiday"],
        answer: "tái khám / follow-up visit",
      },
      {
        type: "rewrite_formal",
        prompt_vi: "Viết lại lịch sự hơn: Saya mau cuti karena sakit punggung.",
        prompt_en: "Rewrite more politely: I want leave because of back pain.",
        answer: "Saya butuh surat izin kerja karena sakit punggung.",
      },
    ],
  },
];

export default lessons;
