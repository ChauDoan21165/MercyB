// Apartment fire alarm Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson pack for Vietnamese L1 learners. The shape mirrors
// sibling Indonesian extra files: `en` stores the Indonesian target text, `vi`
// stores the Vietnamese gloss, and pronunciation_focus carries Vietnamese-facing
// emergency-safety notes with English companions in pronunciation_focus_en.

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
    id: "indonesian_apartment_fire_alarm",
    level: "B1",
    category: "emergency",
    title_vi: "Báo cháy trong căn hộ",
    title_en: "Apartment fire alarm",
    sentences: [
      {
        en: "Alarm kebakaran berbunyi di lantai kami.",
        vi: "Báo cháy đang kêu ở tầng của chúng tôi.",
        pronunciation_focus: [
          "a-LARM ke-ba-KA-ran ber-BU-nyi di LAN-tai KA-mi - `alarm kebakaran` = báo cháy; `berbunyi` = kêu/ring.",
          "Lỗi người Việt: nói `alarm chay` thiếu rõ. Cụm chuẩn là `alarm kebakaran`.",
          "Luyện: `Alarm kebakaran berbunyi.`",
        ],
        pronunciation_focus_en: [
          "a-LARM keh-ba-KAH-ran ber-BOO-nyi dee LAN-tie KA-mee - `alarm kebakaran` = fire alarm; `berbunyi` = sounds/rings.",
          "VN-speaker trap: saying a shortened `alarm chay`. The standard phrase is `alarm kebakaran`.",
          "Drill: `Alarm kebakaran berbunyi.`",
        ],
      },
      {
        en: "Kami harus turun lewat tangga darurat.",
        vi: "Chúng tôi phải đi xuống bằng cầu thang thoát hiểm.",
        pronunciation_focus: [
          "KA-mi HA-rus TUR-un le-WAT TANG-ga da-RU-rat - `tangga darurat` = cầu thang khẩn cấp; `turun` = đi xuống.",
          "Lỗi người Việt: dùng `turun di lift` theo thói quen. Trong cháy, đi bằng `tangga darurat`.",
          "Luyện: `Turun lewat tangga darurat.`",
        ],
        pronunciation_focus_en: [
          "KA-mee HA-roos TOOR-oon leh-WAHT TANG-gah da-ROO-rat - `tangga darurat` = emergency stairs; `turun` = go down.",
          "VN-speaker trap: saying `turun di lift` by habit. In a fire, use the `tangga darurat`.",
          "Drill: `Turun lewat tangga darurat.`",
        ],
      },
      {
        en: "Jangan gunakan lift saat evakuasi.",
        vi: "Đừng dùng thang máy khi sơ tán.",
        pronunciation_focus: [
          "JANG-an gu-NA-kan LIFT saat e-va-ku-A-si - `jangan` = đừng; `evakuasi` = sơ tán.",
          "Lưu ý ngữ pháp: `jangan` đi với động từ gốc: `gunakan`, `masuk`, `panik`.",
          "Luyện: `Jangan gunakan lift.`",
        ],
        pronunciation_focus_en: [
          "JANG-an goo-NAH-kan LIFT saat eh-vah-koo-AH-see - `jangan` = do not; `evakuasi` = evacuation.",
          "Grammar note: `jangan` pairs with the base verb: `gunakan`, `masuk`, `panik`.",
          "Drill: `Jangan gunakan lift.`",
        ],
      },
      {
        en: "Asap sudah mulai masuk ke koridor.",
        vi: "Khói đã bắt đầu vào hành lang.",
        pronunciation_focus: [
          "A-sap SU-dah mu-LAI MA-suk ke ko-RI-dor - `asap` = khói; `koridor` = hành lang.",
          "Lỗi người Việt: nhầm `masuk` với `datang`. Khói không `datang`, khói `masuk` atau `menyebar`.",
          "Luyện: `Asap mulai masuk.`",
        ],
        pronunciation_focus_en: [
          "A-sap SOO-dah moo-LIE MAH-sook keh ko-REE-dor - `asap` = smoke; `koridor` = corridor/hallway.",
          "VN-speaker trap: confusing `masuk` with `datang`. Smoke does not `come`; it `masuk` or `menyebar`.",
          "Drill: `Asap mulai masuk.`",
        ],
      },
      {
        en: "Semua penghuni apartemen harus keluar sekarang.",
        vi: "Tất cả cư dân căn hộ phải ra ngoài ngay bây giờ.",
        pronunciation_focus: [
          "se-MU-a peng-HU-ni a-par-TE-men HA-rus ke-LU-ar se-KA-rang - `penghuni` = cư dân/người ở; `harus` = phải.",
          "Lỗi người Việt: dùng `orang apartemen`. Trong ngữ cảnh tòa nhà, nói `penghuni apartemen`.",
          "Luyện: `Semua penghuni harus keluar.`",
        ],
        pronunciation_focus_en: [
          "seh-MOO-ah pehng-HOO-nee ah-par-TEH-men HA-roos keh-LOO-ar seh-KAH-rang - `penghuni` = resident/occupant; `harus` = must.",
          "VN-speaker trap: using `orang apartemen`. In a building context, say `penghuni apartemen`.",
          "Drill: `Semua penghuni harus keluar.`",
        ],
      },
      {
        en: "Titik kumpul ada di depan lobby utama.",
        vi: "Điểm tập trung ở phía trước sảnh chính.",
        pronunciation_focus: [
          "TI-tik KUM-pul A-da di de-PAN lob-BY u-TA-ma - `titik kumpul` = điểm tập trung; `lobby` = sảnh.",
          "Lỗi người Việt: dịch `meeting point` thành tiếng Anh luôn. Trong Indonesia, `titik kumpul` là từ chuẩn.",
          "Luyện: `Titik kumpul di depan lobby.`",
        ],
        pronunciation_focus_en: [
          "TEE-teek KOOM-pool AH-dah dee deh-PAN LOH-bee oo-TAH-ma - `titik kumpul` = assembly point; `lobby` = lobby.",
          "VN-speaker trap: leaving `meeting point` in English. Indonesian uses `titik kumpul` as the standard term.",
          "Drill: `Titik kumpul di depan lobby.`",
        ],
      },
      {
        en: "Satpam akan membantu membuka pintu darurat.",
        vi: "Bảo vệ sẽ giúp mở cửa khẩn cấp.",
        pronunciation_focus: [
          "SAT-pam A-kan mem-BAN-tu mem-BU-ka PIN-tu da-RU-rat - `satpam` = bảo vệ; `pintu darurat` = cửa khẩn cấp.",
          "Lỗi người Việt: dùng `security` trong câu Indonesia. `Satpam` là từ rất tự nhiên ở apartemen và kantor.",
          "Luyện: `Satpam membantu membuka pintu darurat.`",
        ],
        pronunciation_focus_en: [
          "SAHT-pam A-kan mem-BAN-too mem-BOO-kah PEEN-too da-ROO-rat - `satpam` = security guard; `pintu darurat` = emergency door.",
          "VN-speaker trap: using English `security` in the Indonesian sentence. `Satpam` is the natural local term.",
          "Drill: `Satpam membantu membuka pintu darurat.`",
        ],
      },
      {
        en: "Lift mati, jadi kami harus pakai tangga darurat.",
        vi: "Thang máy bị ngắt, nên chúng tôi phải dùng cầu thang thoát hiểm.",
        pronunciation_focus: [
          "LIFT MA-ti, JA-di KA-mi HA-rus PA-kai TANG-ga da-RU-rat - `lift mati` = thang máy ngừng hoạt động; `pakai` = dùng.",
          "Lỗi người Việt: nói `lift rusak` mọi lúc. Nếu đang ngừng do điện hoặc sistem, `lift mati` hay `lift tidak berfungsi`.",
          "Luyện: `Lift mati, kami pakai tangga darurat.`",
        ],
        pronunciation_focus_en: [
          "LIFT MAH-tee, JAH-dee KA-mee HA-roos PAH-kie TANG-gah da-ROO-rat - `lift mati` = elevator is out; `pakai` = use.",
          "VN-speaker trap: saying `lift rusak` for everything. If it is out due to power/system, `lift mati` or `lift tidak berfungsi` is better.",
          "Drill: `Lift mati, kami pakai tangga darurat.`",
        ],
      },
      {
        en: "Tolong hubungi petugas kalau ada orang terjebak.",
        vi: "Làm ơn gọi nhân viên nếu có ai bị kẹt.",
        pronunciation_focus: [
          "TO-long hu-BUNG-i pe-TU-gas KA-lau A-da O-rang ter-JE-bak - `terjebak` = bị mắc kẹt; `petugas` = nhân viên/phụ trách.",
          "Lỗi người Việt: nói `ter-stop` hoặc `blocked`. Trong tiếng Indonesia, `terjebak` là từ phù hợp.",
          "Luyện: `Hubungi petugas kalau ada orang terjebak.`",
        ],
        pronunciation_focus_en: [
          "TO-long hoo-BOONG-ee peh-TOO-gas KAH-lau AH-dah OH-rang ter-JEH-bak - `terjebak` = trapped; `petugas` = staff/officer.",
          "VN-speaker trap: using `stop` or `blocked`. In Indonesian, `terjebak` is the right word.",
          "Drill: `Hubungi petugas kalau ada orang terjebak.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, chung cư và apartemen thường có alarm kebakaran, tangga darurat, lift, satpam, dan titik kumpul yang ditentukan. Khi có asap atau kebakaran, penghuni biasanya mengikuti instruksi petugas, turun lewat tangga darurat, dan không dùng lift. Các tòa nhà thường yêu cầu người ở biết posisi pintu darurat dan lokasi titik kumpul.",
    cultural_notes_en:
      "In Indonesia, apartment buildings usually have a fire alarm, emergency stairs, elevators, security guards, and a designated assembly point. When there is smoke or a fire, residents typically follow staff instructions, go down the emergency stairs, and do not use the elevator. Buildings usually expect residents to know the emergency door locations and the assembly point.",
    tip_advice_vi:
      "Mẹo cho người Việt: trong tình huống khẩn cấp, dùng câu ngắn và rõ như `Alarm kebakaran berbunyi`, `Jangan gunakan lift`, `Turun lewat tangga darurat`, `Titik kumpul di depan lobby`, `Hubungi petugas`. Động từ mệnh lệnh và bị động là rất tự nhiên trong hướng dẫn an toàn.",
    tip_advice_en:
      "Tip for Vietnamese speakers: in an emergency, use short and clear sentences such as `Alarm kebakaran berbunyi`, `Jangan gunakan lift`, `Turun lewat tangga darurat`, `Titik kumpul di depan lobby`, `Hubungi petugas`. Imperatives and passive forms are very natural in safety instructions.",
    vocabulary: [
      {
        cell_id: "8b119466-6162-468a-8f13-e85644ca95a2",
        word: "alarm kebakaran",
        en: "fire alarm",
        vi: "báo cháy",
        pos: "noun phrase",
        pronunciation_vi: "a-LARM ke-ba-KA-ran",
        pronunciation_en: "a-LARM keh-ba-KAH-ran",
      },
      {
        cell_id: "7a531a67-80ac-4494-a7bf-dd46e318d906",
        word: "tangga darurat",
        en: "emergency stairs",
        vi: "cầu thang thoát hiểm",
        pos: "noun phrase",
        pronunciation_vi: "TANG-ga da-RU-rat",
        pronunciation_en: "TANG-gah da-ROO-rat",
      },
      {
        cell_id: "db1d3c17-6c1f-498c-b380-aebc9cd4bd9b",
        word: "evakuasi",
        en: "evacuation",
        vi: "sơ tán",
        pos: "noun",
        pronunciation_vi: "e-va-ku-A-si",
        pronunciation_en: "eh-vah-koo-AH-see",
      },
      {
        cell_id: "c7524fe5-956d-4ad8-af60-dc39d4083b59",
        word: "titik kumpul",
        en: "assembly point",
        vi: "điểm tập trung",
        pos: "noun phrase",
        pronunciation_vi: "TI-tik KUM-pul",
        pronunciation_en: "TEE-teek KOOM-pool",
      },
      {
        cell_id: "5186689e-7b98-4384-8721-51891d63e392",
        word: "satpam",
        en: "security guard",
        vi: "bảo vệ",
        pos: "noun",
        pronunciation_vi: "SAT-pam",
        pronunciation_en: "SAHT-pam",
      },
      {
        cell_id: "7303c8a5-fff7-4aaa-a86c-a3980293b780",
        word: "asap",
        en: "smoke",
        vi: "khói",
        pos: "noun",
        pronunciation_vi: "A-sap",
        pronunciation_en: "AH-sahp",
      },
      {
        cell_id: "97a3825f-a33d-47be-976e-6131cfcf24f0",
        word: "penghuni",
        en: "resident / occupant",
        vi: "cư dân / người ở",
        pos: "noun",
        pronunciation_vi: "peng-HU-ni",
        pronunciation_en: "pehng-HOO-nee",
      },
      {
        cell_id: "9bf5e9dc-bc11-4e05-9e12-3e2d43dcc796",
        word: "pintu darurat",
        en: "emergency door",
        vi: "cửa khẩn cấp",
        pos: "noun phrase",
        pronunciation_vi: "PIN-tu da-RU-rat",
        pronunciation_en: "PEEN-too da-ROO-rat",
      },
      {
        cell_id: "53989e1f-48ff-4309-bc71-c7f9174af392",
        word: "petugas",
        en: "officer / staff member",
        vi: "nhân viên / cán bộ phụ trách",
        pos: "noun",
        pronunciation_vi: "pe-TU-gas",
        pronunciation_en: "peh-TOO-gas",
      },
      {
        cell_id: "bfea8893-b8d3-4b8b-8014-f060b5e2de1f",
        word: "lift mati",
        en: "elevator is out of service",
        vi: "thang máy ngừng hoạt động",
        pos: "phrase",
        pronunciation_vi: "LIFT MA-ti",
        pronunciation_en: "LIFT MAH-tee",
      },
    ],
    dialogue: [
      {
        cell_id: "3b1045b7-2c75-4c4f-bd01-274d8c46451c",
        speaker: "Penghuni",
        text: "Alarm kebakaran berbunyi! Semua orang keluar sekarang!",
        vi: "Báo cháy đang kêu! Mọi người ra ngoài ngay!",
        en: "The fire alarm is ringing! Everyone get out now!",
      },
      {
        cell_id: "fa609f9c-3ae7-475d-9eda-ff7cb95f64f1",
        speaker: "Satpam",
        text: "Silakan turun lewat tangga darurat. Jangan gunakan lift.",
        vi: "Vui lòng đi xuống bằng cầu thang thoát hiểm. Đừng dùng thang máy.",
        en: "Please go down the emergency stairs. Do not use the elevator.",
      },
      {
        cell_id: "c3001dfb-888c-4f6d-b1d2-265da1466f39",
        speaker: "Penghuni",
        text: "Asap sudah masuk ke koridor, kami langsung menuju titik kumpul.",
        vi: "Khói đã vào hành lang, chúng tôi đi thẳng tới điểm tập trung.",
        en: "Smoke has entered the corridor, and we are heading straight to the assembly point.",
      },
      {
        cell_id: "3edb4924-9b1a-4e89-80b3-4289ef7f0cd8",
        speaker: "Satpam",
        text: "Baik, saya akan hubungi petugas dan cek apakah ada orang terjebak.",
        vi: "Vâng, tôi sẽ gọi nhân viên và kiểm tra xem có ai bị kẹt không.",
        en: "All right, I will contact staff and check whether anyone is trapped.",
      },
      {
        cell_id: "283bfe69-0350-4b92-b46c-8214b3d20c46",
        speaker: "Penghuni",
        text: "Lift mati, jadi semua penghuni harus pakai tangga darurat.",
        vi: "Thang máy bị ngắt, nên tất cả cư dân phải dùng cầu thang thoát hiểm.",
        en: "The elevator is out, so all residents must use the emergency stairs.",
      },
      {
        cell_id: "116320f1-31e2-4cc5-8c67-5c58c92142d2",
        speaker: "Satpam",
        text: "Setelah evakuasi selesai, kita menunggu informasi resmi dari gedung.",
        vi: "Sau khi sơ tán xong, chúng ta chờ thông tin chính thức từ tòa nhà.",
        en: "After evacuation is complete, we wait for official information from the building.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dịch sang tiếng Indonesia: Đừng dùng thang máy khi sơ tán.",
        prompt_en: "Translate into Indonesian: Do not use the elevator during evacuation.",
        answer: "Jangan gunakan lift saat evakuasi.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Điền từ: Semua penghuni apartemen harus keluar ____.",
        prompt_en: "Fill in the blank: Semua penghuni apartemen harus keluar ____.",
        answer: "sekarang",
      },
      {
        type: "multiple_choice",
        prompt_vi: "`titik kumpul` nghĩa là gì?",
        prompt_en: "What does `titik kumpul` mean?",
        choices: ["điểm tập trung / assembly point", "cửa sổ / window", "hành lang / corridor"],
        answer: "điểm tập trung / assembly point",
      },
      {
        type: "rewrite_formal",
        prompt_vi: "Viết lại rõ hơn: Aku turun aja, lift mati.",
        prompt_en: "Rewrite more clearly: I will just go down, the elevator is out.",
        answer: "Lift mati, jadi kami harus pakai tangga darurat.",
      },
    ],
  },
];

export default lessons;
