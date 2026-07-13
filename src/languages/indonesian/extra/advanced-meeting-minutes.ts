// Advanced meeting minutes Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// lesson format: Indonesian target text lives in `en`, Vietnamese glosses live in
// `vi`, and each Vietnamese-facing learning note has an English companion.

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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_advanced_meeting_minutes",
    level: "B2",
    category: "business",
    title_vi: "Notulen rapat: keputusan, tindak lanjut, dan tenggat waktu",
    title_en: "Meeting minutes: decisions, follow-up, and deadlines",
    sentences: [
      {
        en: "Saya sedang menulis notulen rapat hari ini.",
        vi: "Tôi đang viết biên bản cuộc họp hôm nay.",
        pronunciation_focus: [
          "no-tu-LEN ra-PAT = biên bản cuộc họp; `sedang menulis` = đang viết.",
          "Lỗi người Việt: nói `minute rapat` theo tiếng Anh. Trong bahasa Indonesia, `notulen rapat` là cụm chuẩn.",
          "Luyện: `Saya menulis notulen rapat.`",
        ],
        pronunciation_focus_en: [
          "`notulen rapat` = meeting minutes; `sedang menulis` = is writing.",
          "VN-speaker trap: saying `minute rapat` like English. In Indonesian, `notulen rapat` is the standard phrase.",
          "Drill: `Saya menulis notulen rapat.`",
        ],
      },
      {
        en: "Keputusan utama rapat sudah disepakati bersama.",
        vi: "Quyết định chính của cuộc họp đã được thống nhất.",
        pronunciation_focus: [
          "`keputusan utama` = quyết định chính; `disepakati bersama` = được thống nhất chung.",
          "Lỗi người Việt: dùng `agree` lẫn tiếng Anh. `Disepakati` là kata kerja pasif yang sangat natural di rapat.",
          "Luyện: `Keputusan sudah disepakati.`",
        ],
        pronunciation_focus_en: [
          "`keputusan utama` = main decision; `disepakati bersama` = mutually agreed.",
          "VN-speaker trap: mixing in English `agree`. `Disepakati` is a very natural passive verb in meetings.",
          "Drill: `Keputusan sudah disepakati.`",
        ],
      },
      {
        en: "Tolong catat tindak lanjut untuk masing-masing poin.",
        vi: "Làm ơn ghi lại các việc cần làm tiếp theo cho từng mục.",
        pronunciation_focus: [
          "`tindak lanjut` = việc tiếp theo / follow-up action.",
          "`masing-masing poin` = từng mục; rất hữu ích saat membuat notulen.",
          "Lỗi người Việt: nói `action lanjut` hoặc `next action` nửa Anh nửa Indonesia. Cụm tự nhiên là `tindak lanjut`.",
        ],
        pronunciation_focus_en: [
          "`tindak lanjut` = follow-up action; `masing-masing poin` = each point.",
          "VN-speaker trap: saying `action lanjut` or `next action` mixed with English. The natural phrase is `tindak lanjut`.",
          "Drill: `Tindak lanjut untuk masing-masing poin.`",
        ],
      },
      {
        en: "Siapa penanggung jawab untuk tugas ini?",
        vi: "Ai là người chịu trách nhiệm cho nhiệm vụ này?",
        pronunciation_focus: [
          "`penanggung jawab` = người chịu trách nhiệm; sering disingkat `PJ` dalam catatan internal.",
          "`untuk tugas ini` = cho nhiệm vụ này; sangat jelas dan spesifik.",
          "Lỗi người Việt: hỏi `siapa responsible?` nửa Anh nửa Indo. `Penanggung jawab` là istilah standar.",
        ],
        pronunciation_focus_en: [
          "`penanggung jawab` = person responsible; often shortened to `PJ` in internal notes.",
          "`untuk tugas ini` = for this task; clear and specific.",
          "VN-speaker trap: asking `siapa responsible?` mixed with English. `Penanggung jawab` is the standard term.",
        ],
      },
      {
        en: "Tenggat waktunya hari Jumat jam lima sore.",
        vi: "Hạn chót là thứ Sáu lúc năm giờ chiều.",
        pronunciation_focus: [
          "`tenggat waktu` = hạn chót / deadline; `jam lima sore` = 5 giờ chiều.",
          "`hari Jumat` sangat umum di notulen karena keputusan sering dicatat bersama waktunya.",
          "Lỗi người Việt: nói `deadline-nya Friday` nửa Anh nửa Indonesia. Cách tự nhiên là `tenggat waktunya hari Jumat`.",
        ],
        pronunciation_focus_en: [
          "`tenggat waktu` = deadline; `jam lima sore` = 5 p.m.",
          "`hari Jumat` is common in meeting minutes because decisions are often recorded with the exact time.",
          "VN-speaker trap: saying `deadline-nya Friday` mixed with English. Natural Indonesian is `tenggat waktunya hari Jumat`.",
        ],
      },
      {
        en: "Daftar hadir sudah saya kirim ke grup.",
        vi: "Tôi đã gửi danh sách người tham dự vào nhóm.",
        pronunciation_focus: [
          "`daftar hadir` = danh sách điểm danh / danh sách người tham dự.",
          "`ke grup` = vào nhóm chat; cụm này rất thường dùng di kantor.",
          "Lỗi người Việt: dịch `attendance list` thẳng. `Daftar hadir` là cụm chuẩn di rapat.",
        ],
        pronunciation_focus_en: [
          "`daftar hadir` = attendance list / attendance sheet.",
          "`ke grup` = to the group chat; very common in office communication.",
          "VN-speaker trap: translating `attendance list` directly. `Daftar hadir` is the standard meeting phrase.",
        ],
      },
      {
        en: "Ringkasannya akan saya perbaiki sebelum dikirim.",
        vi: "Tôi sẽ sửa bản tóm tắt trước khi gửi đi.",
        pronunciation_focus: [
          "`ringkasan` = bản tóm tắt; `akan saya perbaiki` = tôi sẽ sửa.",
          "Lỗi người Việt: dùng `summary` hoặc `resume` lẫn tiếng Anh. Dalam notulen, `ringkasan` atau `notulen ringkas` lebih alami.",
          "Luyện: `Ringkasannya akan saya perbaiki.`",
        ],
        pronunciation_focus_en: [
          "`ringkasan` = summary; `akan saya perbaiki` = I will revise it.",
          "VN-speaker trap: mixing in English `summary` or `resume`. In meeting writing, `ringkasan` or `notulen ringkas` sounds natural.",
          "Drill: `Ringkasannya akan saya perbaiki.`",
        ],
      },
      {
        en: "Mohon dicek lagi poin yang masih kurang jelas.",
        vi: "Làm ơn kiểm tra lại những điểm còn chưa rõ.",
        pronunciation_focus: [
          "`mohon dicek lagi` = xin được kiểm tra lại; cách yêu cầu rất sopan.",
          "`poin yang masih kurang jelas` = những mục còn chưa rõ.",
          "Lỗi người Việt: nói `please re-check` nửa Anh nửa Indonesia. `Mohon dicek lagi` resmi dan singkat.",
        ],
        pronunciation_focus_en: [
          "`mohon dicek lagi` = kindly please re-check; very polite.",
          "`poin yang masih kurang jelas` = points that are still unclear.",
          "VN-speaker trap: saying `please re-check` mixed with Indonesian. `Mohon dicek lagi` is formal and concise.",
        ],
      },
      {
        en: "Kita perlu menuliskan alasan keputusan itu dengan jelas.",
        vi: "Chúng ta cần ghi rõ lý do của quyết định đó.",
        pronunciation_focus: [
          "`menuliskan` = viết ra; `alasan keputusan` = lý do của quyết định.",
          "`dengan jelas` = một cách rõ ràng; rất quan trọng trong notulen profesional.",
          "Lỗi người Việt: bỏ lý do vì nghĩ notulen chỉ cần quyết định. Bản tốt luôn punya alasan singkat.",
        ],
        pronunciation_focus_en: [
          "`menuliskan` = to write down; `alasan keputusan` = reason for the decision.",
          "`dengan jelas` = clearly; important in professional minutes.",
          "VN-speaker trap: skipping the reason and only writing the decision. Good minutes always include a short reason.",
        ],
      },
      {
        en: "Kalau ada perubahan, tolong update notulen sebelum pukul tiga.",
        vi: "Nếu có thay đổi, vui lòng cập nhật biên bản trước ba giờ.",
        pronunciation_focus: [
          "`update` sering dipakai langsung di kantor; `sebelum pukul tiga` = trước 3 giờ.",
          "`tolong update notulen` là câu thực tế dalam kerja kantor, meski bercampur loanword.",
          "Lỗi người Việt: dùng `perbaiki` saja. Nếu ada perubahan kecil setelah rapat, `update notulen` lebih spesifik.",
        ],
        pronunciation_focus_en: [
          "`update` is often used directly in offices; `sebelum pukul tiga` = before 3 o'clock.",
          "`tolong update notulen` is practical office language, even with a loanword.",
          "VN-speaker trap: only using `perbaiki`. If there are small changes after a meeting, `update notulen` is more specific.",
        ],
      },
    ],
    cultural_notes_vi:
      "Di kantor Indonesia, notulen rapat thường mencakup daftar hadir, keputusan utama, penanggung jawab, tenggat waktu, dan tindak lanjut. Tulisan yang baik biasanya ringkas, memakai bahasa netral, dan langsung ke poin. Jika ada istilah internal seperti PJ, risalah, atau rapat koordinasi, itu normal di lingkungan kerja. Nên ghi rõ ai bertugas, kapan selesai, dan apa hasil rapat supaya mudah ditindaklanjuti.",
    cultural_notes_en:
      "In Indonesian offices, meeting minutes usually include an attendance list, main decisions, the person responsible, deadlines, and follow-up actions. Good writing is usually concise, neutral, and direct. Internal terms like PJ, risalah, or coordination meeting are normal in workplaces. It is useful to state who is responsible, when it is due, and what the outcome was so follow-up is easy.",
    tip_advice_vi:
      "Mẫu rất hữu ích: `Keputusan sudah disepakati`, `Siapa penanggung jawab?`, `Tenggat waktunya kapan?`, `Mohon dicek lagi`, `Daftar hadir sudah dikirim`. Trong notulen, `disepakati`, `ditindaklanjuti`, `dicatat`, `dikirim` là các dạng bị động rất thường gặp.",
    tip_advice_en:
      "Very useful patterns: `Keputusan sudah disepakati`, `Siapa penanggung jawab?`, `Tenggat waktunya kapan?`, `Mohon dicek lagi`, `Daftar hadir sudah dikirim`. In meeting minutes, passive forms like `disepakati`, `ditindaklanjuti`, `dicatat`, and `dikirim` are very common.",
    vocabulary: [
      {
        cell_id: "3f2d84b0-b6f5-4876-a4db-b9cf91454a8f",
        word: "notulen rapat",
        en: "meeting minutes",
        vi: "biên bản cuộc họp",
        pos: "noun phrase",
        pronunciation_vi: "no-tu-LEN ra-PAT",
        pronunciation_en: "no-TOO-len ra-PAT",
      },
      {
        cell_id: "6fba193d-9607-4e88-a38f-2d9ab401f68d",
        word: "keputusan",
        en: "decision",
        vi: "quyết định",
        pos: "noun",
        pronunciation_vi: "ke-PUTUS-an",
        pronunciation_en: "keh-POO-toos-an",
      },
      {
        cell_id: "bf1ee5e5-8c9e-4bee-92f9-a0529ebd1dd2",
        word: "tindak lanjut",
        en: "follow-up action",
        vi: "việc cần làm tiếp theo",
        pos: "noun phrase",
        pronunciation_vi: "TIN-dak lan-JUT",
        pronunciation_en: "TEEN-dak lan-JOOT",
      },
      {
        cell_id: "45af6cfe-8480-4614-a15c-81fda7b77e6a",
        word: "penanggung jawab",
        en: "person responsible",
        vi: "người chịu trách nhiệm",
        pos: "noun phrase",
        pronunciation_vi: "pe-nang-GUNG ja-WAB",
        pronunciation_en: "pe-nang-GOONG ja-WAB",
      },
      {
        cell_id: "88b15458-2a01-4f35-b3c2-29398a74b4af",
        word: "tenggat waktu",
        en: "deadline",
        vi: "hạn chót",
        pos: "noun phrase",
        pronunciation_vi: "TENG-gat WAK-tu",
        pronunciation_en: "TENG-gat WAK-too",
      },
      {
        cell_id: "0bb2e99d-ce8d-4e47-b176-0b3dff8bacf6",
        word: "ringkasan",
        en: "summary",
        vi: "bản tóm tắt",
        pos: "noun",
        pronunciation_vi: "ring-KAS-an",
        pronunciation_en: "ring-KAH-san",
      },
      {
        cell_id: "aa69a7ea-d856-4be0-8ada-0731340ab58e",
        word: "daftar hadir",
        en: "attendance list",
        vi: "danh sách người tham dự",
        pos: "noun phrase",
        pronunciation_vi: "DAF-tar ha-DIR",
        pronunciation_en: "DAF-tar ha-DEER",
      },
      {
        cell_id: "812d99a8-ae33-4163-9e47-eda6dc84aa61",
        word: "disepakati",
        en: "agreed upon",
        vi: "được thống nhất",
        pos: "verb",
        pronunciation_vi: "di-se-pa-KA-ti",
        pronunciation_en: "di-se-pa-KA-tee",
      },
      {
        cell_id: "eb9db2ae-fc06-4e48-823e-41053c4d41d8",
        word: "ditindaklanjuti",
        en: "to be followed up",
        vi: "được tiếp tục xử lý",
        pos: "verb",
        pronunciation_vi: "di-TIN-dak-lan-JU-ti",
        pronunciation_en: "di-TEEN-dak-lan-JOO-tee",
      },
      {
        cell_id: "dabec734-d2e7-4c25-afe1-5250828e58c4",
        word: "rapat koordinasi",
        en: "coordination meeting",
        vi: "cuộc họp phối hợp",
        pos: "noun phrase",
        pronunciation_vi: "RA-pat ko-or-di-NA-si",
        pronunciation_en: "RA-pat ko-or-di-NA-see",
      },
    ],
    dialogue: [
      {
        cell_id: "c4b08067-97ed-4662-9471-e9deb7975e80",
        speaker: "Ketua Tim",
        text: "Saya sedang menulis notulen rapat hari ini.",
        vi: "Tôi đang viết biên bản cuộc họp hôm nay.",
        en: "I am writing today's meeting minutes.",
      },
      {
        cell_id: "98c77082-3f54-46d9-b9f8-0197ca46f621",
        speaker: "Anggota",
        text: "Keputusan utamanya apa saja?",
        vi: "Những quyết định chính là gì?",
        en: "What are the main decisions?",
      },
      {
        cell_id: "dec63816-f77c-4098-bd41-7903f8b7d551",
        speaker: "Ketua Tim",
        text: "Tolong catat tindak lanjut untuk masing-masing poin.",
        vi: "Làm ơn ghi lại các việc tiếp theo cho từng mục.",
        en: "Please note the follow-up for each point.",
      },
      {
        cell_id: "c496debc-fb44-4f0d-a2e1-36255c2a5140",
        speaker: "Anggota",
        text: "Siapa penanggung jawab dan tenggat waktunya?",
        vi: "Ai là người phụ trách và hạn chót là khi nào?",
        en: "Who is responsible and what is the deadline?",
      },
      {
        cell_id: "29fbb8d4-f86b-461f-8e8b-3e15ad6a2000",
        speaker: "Ketua Tim",
        text: "Daftar hadir sudah saya kirim ke grup.",
        vi: "Tôi đã gửi danh sách người tham dự vào nhóm.",
        en: "I have sent the attendance list to the group.",
      },
      {
        cell_id: "83bb2180-512c-4e9d-80df-958af506350e",
        speaker: "Anggota",
        text: "Baik, saya akan cek ringkasannya lagi sebelum dikirim.",
        vi: "Được, tôi sẽ kiểm tra lại bản tóm tắt trước khi gửi.",
        en: "Okay, I will check the summary again before sending it.",
      },
    ],
    exercises: [
      {
        type: "translation",
        prompt: "Dich sang tieng Indonesia: 'Ai là người chịu trách nhiệm cho nhiệm vụ này?'",
        answer: "Siapa penanggung jawab untuk tugas ini?",
        explanation_vi: "Dung `penanggung jawab` de noi nguoi chiu trach nhiem.",
        explanation_en: "Use `penanggung jawab` to ask who is responsible.",
      },
      {
        type: "fill_blank",
        prompt: "Dien tu dung: Tenggat waktunya hari ____ jam lima sore.",
        answer: "Jumat",
        explanation_vi: "Cau co dinh `hari Jumat` cho han chot nay.",
        explanation_en: "The fixed phrase here is `hari Jumat`.",
      },
      {
        type: "choice",
        prompt: "Cau nao tu nhien hon khi noi ve follow-up action?",
        answer: "Tolong catat tindak lanjut untuk masing-masing poin.",
        explanation_vi: "Tindak lanjut la cum tu hanh chinh rat pho bien.",
        explanation_en: "`Tindak lanjut` is a very common administrative phrase.",
      },
      {
        type: "roleplay",
        prompt: "Dong vai nguoi viet notulen. Noi ve keputusan, penanggung jawab, tenggat waktu, daftar hadir, va ringkasan.",
        answer: "Keputusan utama rapat sudah disepakati bersama. Tolong catat tindak lanjut, penanggung jawab, dan tenggat waktunya. Daftar hadir sudah saya kirim ke grup, dan ringkasannya akan saya perbaiki sebelum dikirim.",
        explanation_vi: "Giu van phong cach ngan gon, ro rang, va trung lap.",
        explanation_en: "Keep the tone concise, clear, and neutral.",
      },
    ],
  },
];
