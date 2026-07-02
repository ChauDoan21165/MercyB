// Clinic lab test results Indonesian lesson pack for Vietnamese learners.
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
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type DialogueLine = {
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_clinic_labs_blood_tests",
    level: "B1",
    category: "health",
    title_vi: "Xét nghiệm máu và lấy kết quả lab",
    title_en: "Blood tests and collecting lab results",
    sentences: [
      {
        en: "Saya perlu tes darah pagi ini.",
        vi: "Tôi cần xét nghiệm máu sáng nay.",
        pronunciation_focus: [
          "SA-ya per-LU tes DA-rah PA-gi I-ni.",
          "`tes darah` = xét nghiệm máu; `pagi ini` = sáng nay.",
          "L1 Việt: `tes darah` là cụm cố định rất tự nhiên, đừng cố dịch thành `uji darah` trong hội thoại đời thường.",
        ],
        pronunciation_focus_en: [
          "SAH-yah per-LOO tes DAH-rah PAH-gee EE-nee.",
          "`tes darah` = blood test; `pagi ini` = this morning.",
          "VN-speaker note: `tes darah` is a fixed, natural phrase; do not over-literalize it as `uji darah` in everyday speech.",
        ],
      },
      {
        en: "Apakah saya harus puasa sebelum tes?",
        vi: "Tôi có phải nhịn ăn trước khi xét nghiệm không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya HA-rus PU-a-sa se-BE-lum tes.",
          "`puasa sebelum tes` = nhịn ăn trước xét nghiệm; `harus` = phải.",
          "L1 Việt: `puasa` trong y tế không phải nhịn ăn tôn giáo, mà là không ăn/uống theo hướng dẫn.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SAH-yah HA-roos POO-ah-sah seh-BEH-loom tes.",
          "`puasa sebelum tes` = fasting before a test; `harus` = must/should.",
          "VN-speaker note: in medical contexts, `puasa` means fasting before the test, not religious fasting.",
        ],
      },
      {
        en: "Saya sudah puasa sejak jam sepuluh malam tadi.",
        vi: "Tôi đã nhịn ăn từ 10 giờ tối hôm qua.",
        pronunciation_focus: [
          "SA-ya SU-dah PU-a-sa se-JAK jam se-PU-luh MA-lam TA-di.",
          "`sejak` = từ khi/từ lúc; `jam sepuluh malam tadi` = 10 giờ tối hôm qua.",
          "L1 Việt: nếu cần nói thời điểm bắt đầu nhịn ăn, dùng `sejak` rất rõ.",
        ],
        pronunciation_focus_en: [
          "SAH-yah SOO-dah POO-ah-sah sej-AK jam seh-POO-looh MAH-lam TAH-dee.",
          "`sejak` = since/from; `jam sepuluh malam tadi` = ten o'clock last night.",
          "VN-speaker note: if you need to state when fasting started, `sejak` makes it clear.",
        ],
      },
      {
        en: "Kapan hasil lab bisa diambil?",
        vi: "Khi nào có thể lấy kết quả lab?",
        pronunciation_focus: [
          "KA-pan ha-SIL lab BI-sa di-AM-bil.",
          "`hasil lab` = kết quả xét nghiệm; `diambil` = được lấy.",
          "L1 Việt: hỏi thời gian nhận kết quả bằng `kapan` là chuẩn; không dùng `berapa` vì đây không phải con số.",
        ],
        pronunciation_focus_en: [
          "KAH-pan hah-SEEL lab BEE-sa dee-AM-beel.",
          "`hasil lab` = lab result; `diambil` = can be picked up.",
          "VN-speaker note: ask for collection time with `kapan`; do not use `berapa` because this is not a number question.",
        ],
      },
      {
        en: "Saya mau tahu hasil kolesterol dan gula darah saya.",
        vi: "Tôi muốn biết kết quả cholesterol và đường huyết của tôi.",
        pronunciation_focus: [
          "SA-ya mau TA-hu ha-SIL ko-le-STER-ol dan GU-la DA-rah SA-ya.",
          "`kolesterol` = cholesterol; `gula darah` = đường huyết/đường trong máu.",
          "L1 Việt: `gula darah` không phải đường ăn; đó là đường trong máu, tương đương blood sugar.",
        ],
        pronunciation_focus_en: [
          "SAH-yah mau TAH-hoo hah-SEEL koh-le-STEH-rol dan GOO-lah DAH-rah SAH-yah.",
          "`kolesterol` = cholesterol; `gula darah` = blood sugar.",
          "VN-speaker note: `gula darah` is not table sugar; it means blood sugar.",
        ],
      },
      {
        en: "Dokter memberi saya rujukan untuk tes lanjutan.",
        vi: "Bác sĩ cho tôi giấy chuyển tuyến để làm xét nghiệm tiếp theo.",
        pronunciation_focus: [
          "DOK-ter mem-BE-ri SA-ya ru-JU-kan un-TUK tes lan-JU-tan.",
          "`rujukan` = giấy chuyển tuyến; `tes lanjutan` = xét nghiệm tiếp theo.",
          "L1 Việt: `rujukan dokter` trong phòng khám rất quan trọng khi cần test ở tempat lain.",
        ],
        pronunciation_focus_en: [
          "DOK-ter mem-BEH-ree SAH-yah roo-JOO-kan oon-TOOK tes lan-JOO-tahn.",
          "`rujukan` = referral; `tes lanjutan` = follow-up test.",
          "VN-speaker note: `rujukan dokter` is important when you need a test at another facility.",
        ],
      },
      {
        en: "Saya ingin mengerti hasil lab dengan bahasa sederhana.",
        vi: "Tôi muốn hiểu kết quả lab bằng ngôn ngữ đơn giản.",
        pronunciation_focus: [
          "SA-ya I-ngin men-GER-ti ha-SIL lab de-NGAN ba-HA-sa se-de-HA-na.",
          "`mengerti` = hiểu; `bahasa sederhana` = ngôn ngữ đơn giản.",
          "L1 Việt: khi nghe kết quả y tế, bạn có thể xin `bahasa sederhana` để bác sĩ giải thích dễ hiểu hơn.",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin mehn-GER-tee hah-SEEL lab deh-NGAN bah-HAH-sah seh-deh-HAH-nah.",
          "`mengerti` = understand; `bahasa sederhana` = simple language.",
          "VN-speaker note: when hearing medical results, ask for `bahasa sederhana` so the doctor explains in plain language.",
        ],
      },
      {
        en: "Nilai saya tinggi atau rendah?",
        vi: "Chỉ số của tôi cao hay thấp?",
        pronunciation_focus: [
          "NI-lai SA-ya TING-gi A-tau ren-DAH.",
          "`nilai` = chỉ số/kết quả số; `tinggi` = cao, `rendah` = thấp.",
          "L1 Việt: trong ngữ cảnh lab, `nilai` có thể là chỉ số xét nghiệm, không chỉ là điểm số ở trường.",
        ],
        pronunciation_focus_en: [
          "NEE-lie SAH-yah TING-gee AH-tow ren-DAH.",
          "`nilai` = result/value/number; `tinggi` = high, `rendah` = low.",
          "VN-speaker note: in lab contexts, `nilai` can mean a test value, not only a school grade.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở phòng khám hoặc laboratorium Indonesia, pasien thường phải nhịn ăn trước một số xét nghiệm seperti gula darah atau kolesterol. Petugas bisa menyebut apakah hasil sudah jadi, apakah perlu puasa, dan kapan bisa diambil. Nếu chỉ số tinggi hoặc rendah, thường perlu rujukan dokter để giải thích hoặc làm tes lanjutan. Cách hỏi an toàn là: `Apakah saya harus puasa?`, `Kapan hasil lab bisa diambil?`, `Bisa dijelaskan dengan bahasa sederhana?`.",
    cultural_notes_en:
      "At Indonesian clinics or laboratories, patients often need to fast before some tests such as blood sugar or cholesterol. Staff may explain whether the results are ready, whether fasting is required, and when they can be collected. If a value is high or low, you may need a doctor's referral for explanation or a follow-up test. Safe questions are: `Apakah saya harus puasa?`, `Kapan hasil lab bisa diambil?`, `Bisa dijelaskan dengan bahasa sederhana?`.",
    tip_advice_vi:
      "Mẫu nhớ nhanh: `tes darah`, `puasa sebelum tes`, `hasil lab`, `diambil`, `rujukan dokter`, `gula darah`, `kolesterol`. Người Việt nên chú ý `diambil` = được lấy, `mengambil` = đi lấy; trong quầy kết quả, bị động nghe rất tự nhiên.",
    tip_advice_en:
      "Fast memory set: `tes darah`, `puasa sebelum tes`, `hasil lab`, `diambil`, `rujukan dokter`, `gula darah`, `kolesterol`. Vietnamese speakers should note that `diambil` = can be picked up, while `mengambil` = to go pick up; passive forms sound very natural at the results counter.",
    vocabulary: [
      { word: "tes darah", en: "blood test", vi: "xét nghiệm máu", pos: "noun phrase", pronunciation_vi: "tes DA-rah", pronunciation_en: "tes DAH-rah" },
      { word: "puasa sebelum tes", en: "fasting before a test", vi: "nhịn ăn trước xét nghiệm", pos: "noun phrase", pronunciation_vi: "PU-a-sa se-BE-lum tes", pronunciation_en: "POO-ah-sah seh-BEH-loom tes" },
      { word: "hasil lab", en: "lab result", vi: "kết quả xét nghiệm", pos: "noun phrase", pronunciation_vi: "ha-SIL lab", pronunciation_en: "hah-SEEL lab" },
      { word: "kolesterol", en: "cholesterol", vi: "cholesterol", pos: "noun", pronunciation_vi: "ko-le-STER-ol", pronunciation_en: "koh-leh-STEH-rol" },
      { word: "gula darah", en: "blood sugar", vi: "đường huyết", pos: "noun phrase", pronunciation_vi: "GU-la DA-rah", pronunciation_en: "GOO-lah DAH-rah" },
      { word: "rujukan dokter", en: "doctor referral", vi: "giấy chuyển tuyến bác sĩ", pos: "noun phrase", pronunciation_vi: "ru-JU-kan DOK-ter", pronunciation_en: "roo-JOO-kan DOK-ter" },
      { word: "diambil", en: "can be collected", vi: "được lấy", pos: "verb / passive", pronunciation_vi: "di-AM-bil", pronunciation_en: "dee-AM-beel" },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Selamat pagi, saya perlu tes darah pagi ini.",
        vi: "Chào buổi sáng, tôi cần xét nghiệm máu sáng nay.",
        en: "Good morning, I need a blood test this morning.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Apakah Anda sudah puasa sebelum tes?",
        vi: "Vâng. Anh/chị đã nhịn ăn trước khi xét nghiệm chưa?",
        en: "Okay. Have you fasted before the test?",
      },
      {
        speaker: "Pasien",
        text: "Sudah, sejak jam sepuluh malam tadi.",
        vi: "Rồi, từ 10 giờ tối hôm qua.",
        en: "Yes, since ten o'clock last night.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Hasil lab bisa diambil besok sore.",
        vi: "Được. Kết quả xét nghiệm có thể lấy vào chiều mai.",
        en: "Okay. The lab results can be collected tomorrow afternoon.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "tes darah", answer: "xét nghiệm máu" },
          { prompt: "hasil lab", answer: "kết quả xét nghiệm" },
          { prompt: "puasa sebelum tes", answer: "nhịn ăn trước xét nghiệm" },
          { prompt: "rujukan dokter", answer: "giấy chuyển tuyến bác sĩ" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi có phải nhịn ăn trước khi xét nghiệm không?", answer: "Apakah saya harus puasa sebelum tes?" },
          { prompt: "Khi nào có thể lấy kết quả lab?", answer: "Kapan hasil lab bisa diambil?" },
          { prompt: "Tôi muốn hiểu kết quả lab bằng ngôn ngữ đơn giản.", answer: "Saya ingin mengerti hasil lab dengan bahasa sederhana." },
        ],
      },
    ],
  },
  {
    id: "indonesian_clinic_labs_simple_interpretation",
    level: "B2",
    category: "health",
    title_vi: "Giải thích đơn giản về kết quả xét nghiệm",
    title_en: "Simple interpretation of lab results",
    sentences: [
      {
        en: "Bisa dijelaskan hasil lab saya secara sederhana?",
        vi: "Có thể giải thích kết quả xét nghiệm của tôi một cách đơn giản không?",
        pronunciation_focus: [
          "BI-sa di-je-LAS-kan ha-SIL lab SA-ya se-CA-ra se-de-HA-na.",
          "`dijelaskan` = được giải thích; `secara sederhana` = một cách đơn giản.",
          "L1 Việt: hỏi `secara sederhana` là cách rất an toàn khi bạn không muốn nghe thuật ngữ quá phức tạp.",
        ],
        pronunciation_focus_en: [
          "BEE-sa dee-jeh-LAHS-kan hah-SEEL lab SAH-yah seh-CHA-rah seh-deh-HAH-nah.",
          "`dijelaskan` = explained; `secara sederhana` = in simple terms.",
          "VN-speaker note: asking `secara sederhana` is a safe way to avoid overly technical explanations.",
        ],
      },
      {
        en: "Kolesterol saya sedikit tinggi, artinya apa?",
        vi: "Cholesterol của tôi hơi cao, điều đó nghĩa là gì?",
        pronunciation_focus: [
          "ko-le-STER-ol SA-ya se-DI-kit TING-gi, ar-TI-nya A-pa.",
          "`sedikit tinggi` = hơi cao; `artinya apa` = có nghĩa là gì.",
          "L1 Việt: `sedikit tinggi` giúp câu nghe mềm hơn, tránh hoảng khi nghe kết quả chưa tốt.",
        ],
        pronunciation_focus_en: [
          "koh-leh-STEH-rol SAH-yah seh-DEE-kit TING-gee, ar-TEE-nya AH-pah.",
          "`sedikit tinggi` = a little high; `artinya apa` = what does it mean.",
          "VN-speaker note: `sedikit tinggi` softens the sentence and helps avoid panic when the result is not ideal.",
        ],
      },
      {
        en: "Gula darah saya normal atau tidak?",
        vi: "Đường huyết của tôi bình thường hay không?",
        pronunciation_focus: [
          "GU-la DA-rah SA-ya NOR-mal A-tau ti-DAK.",
          "`normal` = bình thường; `atau tidak` = hay không.",
          "L1 Việt: trong tiếng Indonesia, hỏi `normal atau tidak` là tự nhiên khi bạn muốn biết có trong ngưỡng hay không.",
        ],
        pronunciation_focus_en: [
          "GOO-lah DAH-rah SAH-yah NOR-mal AH-tow tee-DAK.",
          "`normal` = normal; `atau tidak` = or not.",
          "VN-speaker note: asking `normal atau tidak` is natural when you want to know whether the value is within range.",
        ],
      },
      {
        en: "Apakah saya perlu rujukan dokter untuk tes lanjutan?",
        vi: "Tôi có cần giấy chuyển tuyến bác sĩ cho xét nghiệm tiếp theo không?",
        pronunciation_focus: [
          "A-pa-kah SA-ya per-LU ru-JU-kan DOK-ter un-TUK tes lan-JU-tan.",
          "`tes lanjutan` = xét nghiệm tiếp theo; `rujukan dokter` = giấy chuyển tuyến bác sĩ.",
          "L1 Việt: nếu kết quả cần giải thích thêm, `rujukan dokter` là câu hỏi rất thực tế và lễ phép.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SAH-yah per-LOO roo-JOO-kan DOK-ter oon-TOOK tes lan-JOO-tahn.",
          "`tes lanjutan` = follow-up test; `rujukan dokter` = doctor referral.",
          "VN-speaker note: if results need further explanation, `rujukan dokter` is a practical and polite question.",
        ],
      },
      {
        en: "Saya ingin tahu apakah saya masih perlu puasa.",
        vi: "Tôi muốn biết liệu tôi còn cần nhịn ăn nữa không.",
        pronunciation_focus: [
          "SA-ya I-ngin TA-hu a-pa-kah SA-ya ma-SIH per-LU PU-a-sa.",
          "`masih perlu` = vẫn cần; `puasa` = nhịn ăn.",
          "L1 Việt: sau khi lấy mẫu một phần, một số xét nghiệm vẫn cần nhịn ăn tiếp; hỏi rõ để khỏi nhầm.",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin TAH-hoo ah-pa-kah SAH-yah mah-SEEH per-LOO POO-ah-sah.",
          "`masih perlu` = still need to; `puasa` = fasting.",
          "VN-speaker note: after some samples are taken, a few tests may still require fasting; ask clearly to avoid confusion.",
        ],
      },
      {
        en: "Saya akan simpan hasil lab ini untuk kontrol berikutnya.",
        vi: "Tôi sẽ giữ kết quả xét nghiệm này cho lần tái khám tiếp theo.",
        pronunciation_focus: [
          "SA-ya A-kan SIM-pan ha-SIL lab I-ni un-TUK kon-TROL be-RI-kut-nya.",
          "`simpan` = giữ lại; `kontrol berikutnya` = lần tái khám tiếp theo.",
          "L1 Việt: giữ bản in hoặc screenshot kết quả giúp bác sĩ so sánh dễ hơn ở lần sau.",
        ],
        pronunciation_focus_en: [
          "SAH-yah AH-kan SIM-pahn hah-SEEL lab EE-nee oon-TOOK kon-TROL beh-REE-koot-nya.",
          "`simpan` = keep/store; `kontrol berikutnya` = next follow-up visit.",
          "VN-speaker note: keeping a printout or screenshot of the result helps the doctor compare it later.",
        ],
      },
      {
        en: "Tolong jelaskan jika ada angka yang di atas batas normal.",
        vi: "Xin hãy giải thích nếu có chỉ số nào vượt ngưỡng bình thường.",
        pronunciation_focus: [
          "TO-long je-LAS-kan ji-ka A-da ANG-ka yang di A-tas BA-tas NOR-mal.",
          "`di atas batas normal` = vượt ngưỡng bình thường; `angka` = con số/chỉ số.",
          "L1 Việt: `batas normal` là cụm y khoa quan trọng; nghe rõ phần `di atas` để biết chỉ số nào vượt.",
        ],
        pronunciation_focus_en: [
          "TOH-long jeh-LAHS-kan JEE-kah AH-dah ANG-kah yang dee AH-tas BAH-tas NOR-mal.",
          "`di atas batas normal` = above the normal range; `angka` = number/value.",
          "VN-speaker note: `batas normal` is an important medical phrase; listen carefully to `di atas` to know what is above range.",
        ],
      },
      {
        en: "Kalau hasilnya tidak jelas, saya boleh minta penjelasan lagi?",
        vi: "Nếu kết quả chưa rõ, tôi có thể xin giải thích thêm không?",
        pronunciation_focus: [
          "KA-lau ha-SIL-nya ti-DAK JE-las, SA-ya BO-leh MIN-ta pen-je-LAS-an LA-gi.",
          "`tidak jelas` = chưa rõ; `minta penjelasan lagi` = xin giải thích thêm.",
          "L1 Việt: `boleh minta... lagi?` là cách hỏi lại rất lịch sự khi bạn vẫn chưa hiểu.",
        ],
        pronunciation_focus_en: [
          "KAH-low hah-SEEL-nya tee-DAK JEH-las, SAH-yah BO-leh MIN-tah pen-jeh-LAHS-an LAH-gee.",
          "`tidak jelas` = not clear; `minta penjelasan lagi` = ask for further explanation.",
          "VN-speaker note: `boleh minta... lagi?` is a polite way to ask again when you still do not understand.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở klinik Indonesia, kết quả lab thường được giải thích ngắn gọn: normal, tinggi, rendah, atau perlu tindak lanjut. Người bệnh thường được khuyên giữ bản hasil lab để so sánh lần sau. Nếu chỉ số cần theo dõi liên quan đến gula darah hoặc kolesterol, dokter bisa menyarankan kontrol ulang, pola makan, olahraga ringan, hoặc rujukan ke dokter spesialis. Cách hỏi lịch sự là yêu cầu `bahasa sederhana` khi bạn nghe thuật ngữ y khoa quá nhanh.",
    cultural_notes_en:
      "At Indonesian clinics, lab results are often explained briefly: normal, high, low, or needing follow-up. Patients are usually advised to keep the lab result copy for later comparison. If values to monitor relate to blood sugar or cholesterol, the doctor may suggest a follow-up, diet changes, light exercise, or referral to a specialist. A polite way to ask is to request `bahasa sederhana` when medical terms are explained too quickly.",
    tip_advice_vi:
      "Mẫu nhớ nhanh: `Apakah saya harus puasa?`, `Kapan hasil lab bisa diambil?`, `Bisa dijelaskan secara sederhana?`, `Saya perlu rujukan dokter?`. Người Việt nên nhớ `diambil` = có thể lấy, `dijelaskan` = được giải thích, `kontrol berikutnya` = lần tái khám tới.",
    tip_advice_en:
      "Fast memory set: `Apakah saya harus puasa?`, `Kapan hasil lab bisa diambil?`, `Bisa dijelaskan secara sederhana?`, `Saya perlu rujukan dokter?`. Vietnamese speakers should remember `diambil` = can be collected, `dijelaskan` = explained, and `kontrol berikutnya` = the next follow-up visit.",
    vocabulary: [
      { word: "hasil lab", en: "lab result", vi: "kết quả xét nghiệm", pos: "noun phrase", pronunciation_vi: "ha-SIL lab", pronunciation_en: "hah-SEEL lab" },
      { word: "kolesterol", en: "cholesterol", vi: "cholesterol", pos: "noun", pronunciation_vi: "ko-le-STER-ol", pronunciation_en: "koh-leh-STEH-rol" },
      { word: "gula darah", en: "blood sugar", vi: "đường huyết", pos: "noun phrase", pronunciation_vi: "GU-la DA-rah", pronunciation_en: "GOO-lah DAH-rah" },
      { word: "rujukan dokter", en: "doctor referral", vi: "giấy chuyển tuyến bác sĩ", pos: "noun phrase", pronunciation_vi: "ru-JU-kan DOK-ter", pronunciation_en: "roo-JOO-kan DOK-ter" },
      { word: "puasa sebelum tes", en: "fasting before a test", vi: "nhịn ăn trước xét nghiệm", pos: "noun phrase", pronunciation_vi: "PU-a-sa se-BE-lum tes", pronunciation_en: "POO-ah-sah seh-BEH-loom tes" },
      { word: "kontrol berikutnya", en: "next follow-up visit", vi: "lần tái khám tiếp theo", pos: "noun phrase", pronunciation_vi: "kon-TROL be-RI-kut-nya", pronunciation_en: "kon-TROL beh-REE-koot-nya" },
      { word: "batas normal", en: "normal range", vi: "ngưỡng bình thường", pos: "noun phrase", pronunciation_vi: "BA-tas NOR-mal", pronunciation_en: "BAH-tas NOR-mal" },
    ],
    dialogue: [
      {
        speaker: "Pasien",
        text: "Bisa dijelaskan hasil lab saya secara sederhana?",
        vi: "Có thể giải thích kết quả xét nghiệm của tôi một cách đơn giản không?",
        en: "Can my lab results be explained in simple terms?",
      },
      {
        speaker: "Petugas",
        text: "Tentu. Gula darah Anda masih normal, tetapi kolesterol sedikit tinggi.",
        vi: "Tất nhiên. Đường huyết của anh/chị vẫn bình thường, nhưng cholesterol hơi cao.",
        en: "Of course. Your blood sugar is still normal, but cholesterol is a little high.",
      },
      {
        speaker: "Pasien",
        text: "Apakah saya perlu rujukan dokter untuk tes lanjutan?",
        vi: "Tôi có cần giấy chuyển tuyến bác sĩ cho xét nghiệm tiếp theo không?",
        en: "Do I need a doctor's referral for a follow-up test?",
      },
      {
        speaker: "Petugas",
        text: "Ya, dan mohon simpan hasil lab ini untuk kontrol berikutnya.",
        vi: "Có, và xin hãy giữ kết quả xét nghiệm này cho lần tái khám tiếp theo.",
        en: "Yes, and please keep this lab result for the next follow-up visit.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu phù hợp khi hỏi về kết quả xét nghiệm.",
        instruction_en: "Choose the suitable sentence when asking about test results.",
        items: [
          {
            prompt: "Bạn muốn hỏi kết quả theo cách đơn giản.",
            answer: "Bisa dijelaskan hasil lab saya secara sederhana?",
            options: [
              "Bisa dijelaskan hasil lab saya secara sederhana?",
              "Saya mau hasil sekarang!",
              "Lab saya bagus sekali kan?",
            ],
          },
          {
            prompt: "Bạn muốn hỏi có cần giấy chuyển tuyến không.",
            answer: "Apakah saya perlu rujukan dokter untuk tes lanjutan?",
            options: [
              "Apakah saya perlu rujukan dokter untuk tes lanjutan?",
              "Saya suka rujukan dokter.",
              "Tes lanjutan saya mahal ya?",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi có phải nhịn ăn trước khi xét nghiệm không?", answer: "Apakah saya harus puasa sebelum tes?" },
          { prompt: "Khi nào có thể lấy kết quả lab?", answer: "Kapan hasil lab bisa diambil?" },
          { prompt: "Xin hãy giải thích nếu có chỉ số nào vượt ngưỡng bình thường.", answer: "Tolong jelaskan jika ada angka yang di atas batas normal." },
        ],
      },
    ],
  },
];
