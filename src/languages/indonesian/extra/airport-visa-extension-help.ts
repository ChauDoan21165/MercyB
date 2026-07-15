// Airport visa extension Indonesian lesson pack for Vietnamese learners.
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

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_airport_visa_extension_documents",
    level: "B1",
    category: "bureaucracy",
    title_vi: "Gia hạn visa ở imigrasi bandara",
    title_en: "Extending a visa at airport immigration",
    sentences: [
      {
        en: "Saya ingin memperpanjang visa saya di imigrasi bandara.",
        vi: "Tôi muốn gia hạn visa của tôi ở phòng nhập cảnh sân bay.",
        pronunciation_focus: [
          "SA-ya I-ngin mem-per-PAN-jang VI-sa SA-ya di i-mi-GRA-si BAN-da-ra.",
          "`memperpanjang visa` = gia hạn visa; `imigrasi bandara` = bộ phận nhập cảnh ở sân bay.",
          "L1 Việt: `memperpanjang` là động từ; đừng dùng `perpanjangan` khi bạn đang nói hành động xin gia hạn.",
        ],
        pronunciation_focus_en: [
          "SAH-yah EE-ngin mem-per-PAN-jang VEE-sa SAH-yah dee ee-mee-GRA-see BAN-dah-rah.",
          "`memperpanjang visa` = to extend a visa; `imigrasi bandara` = airport immigration.",
          "VN-speaker note: `memperpanjang` is the verb; do not use `perpanjangan` when you mean the action of extending.",
        ],
      },
      {
        en: "Visa saya akan habis minggu depan.",
        vi: "Visa của tôi sẽ hết hạn vào tuần tới.",
        pronunciation_focus: [
          "VI-sa SA-ya A-kan HA-bis MING-gu de-PAN.",
          "`akan habis` = sẽ hết hạn; `minggu depan` = tuần tới.",
          "L1 Việt: `habis` trong giấy tờ nghĩa là hết hạn/hết thời gian, không phải chỉ hết đồ ăn.",
        ],
        pronunciation_focus_en: [
          "VEE-sa SAH-yah AH-kan HA-bees MEENG-goo deh-PAHN.",
          "`akan habis` = will expire; `minggu depan` = next week.",
          "VN-speaker note: in documents, `habis` means expired/out of time, not only that something has run out physically.",
        ],
      },
      {
        en: "Dokumen saya ada yang kurang, bisa bantu cek?",
        vi: "Hồ sơ của tôi có thiếu giấy tờ nào, có thể giúp kiểm tra không?",
        pronunciation_focus: [
          "do-ku-MEN SA-ya A-da yang KU-rang, BI-sa BAN-tu cek.",
          "`ada yang kurang` = có cái gì đó còn thiếu; `bantu cek` = giúp kiểm tra.",
          "L1 Việt: nói `dokumen kurang` nghe được, nhưng `ada yang kurang` tự nhiên hơn khi bạn chưa biết thiếu cái gì.",
        ],
        pronunciation_focus_en: [
          "do-ku-MEN SAH-yah AH-dah yang KOO-rang, BEE-sa BAN-too chek.",
          "`ada yang kurang` = something is missing; `bantu cek` = help check.",
          "VN-speaker note: `dokumen kurang` is understandable, but `ada yang kurang` is more natural when you do not yet know what is missing.",
        ],
      },
      {
        en: "Petugas meminta paspor asli dan surat sponsor.",
        vi: "Nhân viên yêu cầu hộ chiếu gốc và thư bảo lãnh.",
        pronunciation_focus: [
          "pe-TU-gas me-MIN-ta PAS-por AS-li dan SU-rat SPON-sor.",
          "`paspor asli` = hộ chiếu gốc; `surat sponsor` = thư bảo lãnh.",
          "L1 Việt: `sponsor` ở imigrasi là bên bảo lãnh, không phải nhà tài trợ quảng cáo.",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas meh-MIN-tah PAS-por AS-lee dan SOO-rat SPON-sor.",
          "`paspor asli` = original passport; `surat sponsor` = sponsor letter.",
          "VN-speaker note: in immigration, `sponsor` means the guarantor/sponsoring party, not an advertising sponsor.",
        ],
      },
      {
        en: "Saya sudah ambil nomor antrean di loket imigrasi.",
        vi: "Tôi đã lấy số thứ tự ở quầy nhập cảnh.",
        pronunciation_focus: [
          "SA-ya SU-dah AM-bil NO-mor an-TRE-an di LO-ket i-mi-GRA-si.",
          "`nomor antrean` = số thứ tự xếp hàng; `loket` = quầy.",
          "L1 Việt: trong văn phòng nhà nước, `ambil nomor antrean` là câu rất tự nhiên để nói đã lấy số.",
        ],
        pronunciation_focus_en: [
          "SAH-yah SOO-dah AM-beel NO-mor an-TRE-an dee LO-ket ee-mee-GRA-see.",
          "`nomor antrean` = queue number; `loket` = counter.",
          "VN-speaker note: in government offices, `ambil nomor antrean` is the natural way to say you already took a queue number.",
        ],
      },
      {
        en: "Apakah ada jadwal ulang untuk datang besok?",
        vi: "Có lịch hẹn lại để đến vào ngày mai không?",
        pronunciation_focus: [
          "A-pa-kah A-da jad-WAL u-LANG UN-tuk DA-tang BE-sok.",
          "`jadwal ulang` = đổi lịch/hẹn lại; `datang besok` = đến vào ngày mai.",
          "L1 Việt: `jadwal ulang` thường dùng khi bạn cần đổi ngày hoặc giờ, không phải hủy hẳn.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah AH-dah jad-WAL oo-LANG OON-took DAH-tang BEH-sok.",
          "`jadwal ulang` = reschedule; `datang besok` = come tomorrow.",
          "VN-speaker note: `jadwal ulang` is used when you need to change the day or time, not cancel entirely.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong imigrasi bandara Indonesia, petugas thường kiểm tra paspor asli, visa, surat sponsor, dan bukti bahwa Anda masih memenuhi syarat tinggal. Nếu ada dokumen kurang, mereka bisa meminta Anda kembali dengan jadwal ulang atau mengarahkan ke loket tertentu. Ambil nomor antrean, simpan semua kuitansi atau bukti pembayaran, dan tanya dengan kalimat singkat serta sopan.",
    cultural_notes_en:
      "At Indonesian airport immigration, officers often check the original passport, visa, sponsor letter, and proof that you still meet the stay requirements. If documents are missing, they may ask you to come back with a rescheduled appointment or direct you to a specific counter. Take a queue number, keep all receipts or payment proof, and ask with short, polite sentences.",
    tip_advice_vi:
      "Câu khung nhanh: `Saya ingin memperpanjang visa saya`, `Dokumen saya ada yang kurang`, `Saya sudah ambil nomor antrean`, `Apakah ada jadwal ulang?`. Người Việt nên nhớ `asli` = gốc, `sponsor` = bên bảo lãnh, `antrean` = hàng đợi.",
    tip_advice_en:
      "Fast sentence frames: `Saya ingin memperpanjang visa saya`, `Dokumen saya ada yang kurang`, `Saya sudah ambil nomor antrean`, `Apakah ada jadwal ulang?`. Vietnamese speakers should remember `asli` = original, `sponsor` = guarantor, and `antrean` = queue.",
    vocabulary: [
      { cell_id: "47d6705e-0d5d-49cb-87e3-f1d0cb98e19b", word: "memperpanjang visa", en: "to extend a visa", vi: "gia hạn visa", pos: "verb phrase", pronunciation_vi: "mem-per-PAN-jang VI-sa", pronunciation_en: "mem-per-PAN-jang VEE-sa" },
      { cell_id: "2d225095-c171-4a8a-ba7e-5a58813bb451", word: "imigrasi bandara", en: "airport immigration", vi: "nhập cảnh sân bay", pos: "noun phrase", pronunciation_vi: "i-mi-GRA-si BAN-da-ra", pronunciation_en: "i-mi-GRA-see BAN-dah-rah" },
      { cell_id: "30e27eed-8aa8-4ea5-aede-62ab231214c3", word: "dokumen kurang", en: "missing documents", vi: "thiếu giấy tờ", pos: "noun phrase", pronunciation_vi: "do-ku-MEN KU-rang", pronunciation_en: "do-koo-MEN KOO-rang" },
      { cell_id: "15d983ba-3141-4111-b2fa-8d0ca586d490", word: "petugas", en: "officer / staff", vi: "nhân viên / cán bộ", pos: "noun", pronunciation_vi: "pe-TU-gas", pronunciation_en: "peh-TOO-gas" },
      { cell_id: "d7fd1f31-7a42-44cb-a152-3add3656afe6", word: "nomor antrean", en: "queue number", vi: "số thứ tự", pos: "noun phrase", pronunciation_vi: "NO-mor an-TRE-an", pronunciation_en: "NO-mor an-TRE-an" },
      { cell_id: "a5262bc0-f48d-4079-84ff-1afcfe6d6b11", word: "surat sponsor", en: "sponsor letter", vi: "thư bảo lãnh", pos: "noun phrase", pronunciation_vi: "SU-rat SPON-sor", pronunciation_en: "SOO-rat SPON-sor" },
      { cell_id: "c313dccb-2747-4e95-aa0e-820db336d9e5", word: "jadwal ulang", en: "reschedule", vi: "đổi lịch hẹn", pos: "verb phrase", pronunciation_vi: "jad-WAL u-LANG", pronunciation_en: "jad-WAL oo-LANG" },
      { cell_id: "d736b122-ba24-436f-a00c-891721fe2a71", word: "biaya", en: "cost / fee", vi: "chi phí", pos: "noun", pronunciation_vi: "BI-a-ya", pronunciation_en: "BEE-ah-yah" },
    ],
    dialogue: [
      {
        cell_id: "570380fb-3794-4b3a-b486-b5917b2c3654",
        speaker: "Pemohon",
        text: "Selamat pagi, saya ingin memperpanjang visa saya di imigrasi bandara.",
        vi: "Chào buổi sáng, tôi muốn gia hạn visa của tôi ở phòng nhập cảnh sân bay.",
        en: "Good morning, I would like to extend my visa at airport immigration.",
      },
      {
        cell_id: "3923c90e-844c-492b-9e58-12005808ee55",
        speaker: "Petugas",
        text: "Baik. Silakan ambil nomor antrean dan siapkan paspor asli.",
        vi: "Được ạ. Mời lấy số thứ tự và chuẩn bị hộ chiếu gốc.",
        en: "Okay. Please take a queue number and prepare the original passport.",
      },
      {
        cell_id: "3ea05287-5d4a-430c-9f2b-db97edc0bac7",
        speaker: "Pemohon",
        text: "Dokumen saya ada yang kurang, bisa bantu cek?",
        vi: "Hồ sơ của tôi có thiếu giấy tờ nào, có thể giúp kiểm tra không?",
        en: "Some of my documents are missing; can you help check?",
      },
      {
        cell_id: "d88413bc-551a-4723-b9a0-92995912ced1",
        speaker: "Petugas",
        text: "Bisa. Jika perlu, kami buat jadwal ulang untuk besok.",
        vi: "Được. Nếu cần, chúng tôi sẽ đặt lịch lại cho ngày mai.",
        en: "Yes. If needed, we will make a new appointment for tomorrow.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối cụm từ với nghĩa.",
        instruction_en: "Match the phrase to its meaning.",
        items: [
          { prompt: "memperpanjang visa", answer: "gia hạn visa" },
          { prompt: "nomor antrean", answer: "số thứ tự xếp hàng" },
          { prompt: "surat sponsor", answer: "thư bảo lãnh" },
          { prompt: "jadwal ulang", answer: "đổi lịch hẹn" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn gia hạn visa của tôi ở phòng nhập cảnh sân bay.", answer: "Saya ingin memperpanjang visa saya di imigrasi bandara." },
          { prompt: "Tôi đã lấy số thứ tự ở quầy nhập cảnh.", answer: "Saya sudah ambil nomor antrean di loket imigrasi." },
          { prompt: "Có lịch hẹn lại để đến vào ngày mai không?", answer: "Apakah ada jadwal ulang untuk datang besok?" },
        ],
      },
    ],
  },
  {
    id: "indonesian_airport_visa_extension_followup",
    level: "B2",
    category: "bureaucracy",
    title_vi: "Phí, sponsor, và theo dõi hồ sơ gia hạn",
    title_en: "Fees, sponsor, and visa-extension follow-up",
    sentences: [
      {
        en: "Berapa biaya untuk memperpanjang visa ini?",
        vi: "Gia hạn visa này hết bao nhiêu tiền?",
        pronunciation_focus: [
          "be-RA-pa BI-a-ya un-TUK mem-per-PAN-jang VI-sa i-ni.",
          "`berapa biaya` = bao nhiêu chi phí; `memperpanjang visa` = gia hạn visa.",
          "L1 Việt: hỏi tiền thì dùng `berapa`, không dùng `apa`. Câu này là mẫu chuẩn ở loket.",
        ],
        pronunciation_focus_en: [
          "beh-RAH-pah BEE-ah-yah oon-TOOK mem-per-PAN-jang VEE-sa EE-nee.",
          "`berapa biaya` = how much does it cost; `memperpanjang visa` = extend the visa.",
          "VN-speaker note: for money, use `berapa`, not `apa`. This is the standard counter question.",
        ],
      },
      {
        en: "Apakah sponsor saya harus datang juga?",
        vi: "Người bảo lãnh của tôi có phải đến cùng không?",
        pronunciation_focus: [
          "A-pa-kah SPON-sor SA-ya HA-rus DA-tang JU-ga.",
          "`harus datang juga` = cũng phải đến; `sponsor` = bên bảo lãnh.",
          "L1 Việt: `juga` đặt ở cuối câu nghe rất tự nhiên khi hỏi thêm một điều kiện.",
        ],
        pronunciation_focus_en: [
          "A-pa-kah SPON-sor SAH-yah HA-roos DAH-tang JOO-gah.",
          "`harus datang juga` = also has to come; `sponsor` = sponsoring party/guarantor.",
          "VN-speaker note: placing `juga` at the end sounds very natural when asking about an extra requirement.",
        ],
      },
      {
        en: "Petugas bilang dokumen saya masih belum lengkap.",
        vi: "Nhân viên nói hồ sơ của tôi vẫn chưa đầy đủ.",
        pronunciation_focus: [
          "pe-TU-gas bi-LANG do-ku-MEN SA-ya ma-SIH be-LUM leng-KAP.",
          "`masih belum lengkap` = vẫn chưa đầy đủ; `bilang` = nói/báo.",
          "L1 Việt: `masih belum` nghe dài nhưng rất thường dùng để nhấn mạnh là vẫn chưa xong.",
        ],
        pronunciation_focus_en: [
          "peh-TOO-gas bee-LANG do-koo-MEN SAH-yah mah-SEEH beh-LOOM leng-KAP.",
          "`masih belum lengkap` = still not complete; `bilang` = says/tells.",
          "VN-speaker note: `masih belum` is common and emphasizes that it is still not finished.",
        ],
      },
      {
        en: "Saya akan kembali sesuai jadwal yang baru.",
        vi: "Tôi sẽ quay lại theo lịch mới.",
        pronunciation_focus: [
          "SA-ya A-kan kem-BA-li se-SU-ai jad-WAL yang BA-ru.",
          "`sesuai jadwal` = theo lịch; `yang baru` = mới.",
          "L1 Việt: nếu đổi lịch, hãy nói `sesuai jadwal yang baru` để rõ là bạn chấp nhận lịch mới.",
        ],
        pronunciation_focus_en: [
          "SAH-yah AH-kan kem-BAH-lee seh-SOO-ah-ee jad-WAL yang BAH-roo.",
          "`sesuai jadwal` = according to the schedule; `yang baru` = the new one.",
          "VN-speaker note: if the schedule changes, `sesuai jadwal yang baru` makes it clear you accept the new timing.",
        ],
      },
      {
        en: "Kalau biaya terlalu besar, saya mau tanya opsi lain.",
        vi: "Nếu chi phí quá lớn, tôi muốn hỏi lựa chọn khác.",
        pronunciation_focus: [
          "KA-lau BI-a-ya ter-la-LU be-SAR, SA-ya mau TA-nya OP-si LA-in.",
          "`opsi lain` = lựa chọn khác; `terlalu besar` = quá lớn.",
          "L1 Việt: `opsi` là từ rất tự nhiên trong dịch vụ; dùng khi bạn muốn hỏi phương án khác, không gây căng thẳng.",
        ],
        pronunciation_focus_en: [
          "KAH-low BEE-ah-yah ter-la-LOO beh-SAR, SAH-yah mau TAH-nya OP-see LAH-een.",
          "`opsi lain` = another option; `terlalu besar` = too expensive/too large.",
          "VN-speaker note: `opsi` is very natural in service interactions when you want to ask for an alternative without sounding confrontational.",
        ],
      },
      {
        en: "Mohon kirim pembaruan melalui email jika ada perubahan.",
        vi: "Xin hãy gửi cập nhật qua email nếu có thay đổi.",
        pronunciation_focus: [
          "MO-hon KIR-im pem-ba-RU-an me-LA-lui E-mail ji-ka A-da pe-ru-BA-han.",
          "`pembaruan` = cập nhật; `melalui email` = qua email.",
          "L1 Việt: email giúp có catatan tertulis, rất tốt nếu bạn phải chứng minh đã liên hệ.",
        ],
        pronunciation_focus_en: [
          "MO-hon KEER-im pem-ba-ROO-an meh-LAH-loo-ee EE-mail JEE-kah AH-dah pe-roo-BAH-han.",
          "`pembaruan` = update; `melalui email` = via email.",
          "VN-speaker note: email gives you a written record, which is useful if you need proof of contact.",
        ],
      },
      {
        en: "Saya masih menunggu nomor laporan dari petugas.",
        vi: "Tôi vẫn đang chờ số hồ sơ/báo cáo từ nhân viên.",
        pronunciation_focus: [
          "SA-ya ma-SIH me-NUNG-gu NO-mor la-PO-ran da-ri pe-TU-gas.",
          "`nomor laporan` = số hồ sơ/số báo cáo; `menunggu` = chờ.",
          "L1 Việt: `nomor laporan` là mã việc. Nếu có, giữ lại để theo dõi dễ hơn.",
        ],
        pronunciation_focus_en: [
          "SAH-yah mah-SEEH meh-NOONG-goo NO-mor la-PO-ran dah-ree peh-TOO-gas.",
          "`nomor laporan` = report/reference number; `menunggu` = waiting.",
          "VN-speaker note: `nomor laporan` is the case number. Keep it so follow-up is easier.",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở counter imigrasi bandara, nhân viên thường kiểm tra rủi ro rất chặt: sponsor hợp lệ không, dokumen lengkap không, dan apakah pemohon datang sesuai jadwal. Nếu ada biaya, họ biasanya menjelaskan di awal hoặc minta Anda ke loket pembayaran. Khi hồ sơ belum lengkap, jangan panik; minta nomor laporan, simpan bukti email, dan tanya apakah bisa jadwal ulang.",
    cultural_notes_en:
      "At airport immigration counters, staff often check risk carefully: whether the sponsor is valid, whether the documents are complete, and whether the applicant arrived on schedule. If there is a fee, they usually explain it up front or send you to the payment counter. If your file is incomplete, do not panic; ask for the report number, keep email proof, and ask whether rescheduling is possible.",
    tip_advice_vi:
      "Mẫu nói nhanh: `Berapa biaya?`, `Apakah sponsor saya harus datang juga?`, `Dokumen saya masih belum lengkap`, `Mohon kirim pembaruan melalui email`. Người Việt nên chú ý `masih belum` và `sesuai jadwal` là cụm rất tự nhiên trong hồ sơ hành chính.",
    tip_advice_en:
      "Quick speaking frames: `Berapa biaya?`, `Apakah sponsor saya harus datang juga?`, `Dokumen saya masih belum lengkap`, `Mohon kirim pembaruan melalui email`. Vietnamese speakers should note that `masih belum` and `sesuai jadwal` are very natural administrative phrases.",
    vocabulary: [
      { cell_id: "9c09c908-0d96-4c05-a62a-080cc9610781", word: "berlaku", en: "valid / in force", vi: "còn hiệu lực", pos: "adjective / verb", pronunciation_vi: "ber-LA-ku", pronunciation_en: "ber-LAH-koo" },
      { cell_id: "655085d0-0407-4a68-a50a-c5dfec83b9d8", word: "nomor laporan", en: "report number", vi: "số hồ sơ / số báo cáo", pos: "noun phrase", pronunciation_vi: "NO-mor la-PO-ran", pronunciation_en: "NO-mor la-PO-ran" },
      { cell_id: "dfa1c877-7c22-45a8-a6cb-3fe72d48a5bb", word: "pembaruan", en: "update", vi: "cập nhật", pos: "noun", pronunciation_vi: "pem-ba-RU-an", pronunciation_en: "pem-ba-ROO-an" },
      { cell_id: "c0b2a518-0d2a-4931-8ad7-fe592e8c38fe", word: "opsi", en: "option", vi: "lựa chọn", pos: "noun", pronunciation_vi: "OP-si", pronunciation_en: "OP-see" },
      { cell_id: "803702cb-b664-4f03-82ac-ba9d31ca4c94", word: "sesuai jadwal", en: "according to schedule", vi: "theo lịch", pos: "phrase", pronunciation_vi: "se-SU-ai jad-WAL", pronunciation_en: "seh-SOO-ah-ee jad-WAL" },
      { cell_id: "38d7f18f-47ff-4cdd-8f60-952894ce8761", word: "lengkap", en: "complete", vi: "đầy đủ", pos: "adjective", pronunciation_vi: "leng-KAP", pronunciation_en: "leng-KAP" },
      { cell_id: "f398c6e7-e5de-43f8-992c-587ffdeb8461", word: "loket pembayaran", en: "payment counter", vi: "quầy thanh toán", pos: "noun phrase", pronunciation_vi: "LO-ket pem-ba-YAR-an", pronunciation_en: "LO-ket pem-ba-YAR-an" },
    ],
    dialogue: [
      {
        cell_id: "a8384321-d32b-4b7b-aa73-2811aa4015a9",
        speaker: "Pemohon",
        text: "Berapa biaya untuk memperpanjang visa ini?",
        vi: "Gia hạn visa này hết bao nhiêu tiền?",
        en: "How much does it cost to extend this visa?",
      },
      {
        cell_id: "fdcec2c6-dad5-4d48-854e-cc0354a1668b",
        speaker: "Petugas",
        text: "Biayanya akan kami jelaskan di loket pembayaran.",
        vi: "Chi phí sẽ được chúng tôi giải thích ở quầy thanh toán.",
        en: "We will explain the fee at the payment counter.",
      },
      {
        cell_id: "875ee40a-bc40-49bb-88ee-87d0a0e1fe7b",
        speaker: "Pemohon",
        text: "Apakah sponsor saya harus datang juga?",
        vi: "Người bảo lãnh của tôi có phải đến cùng không?",
        en: "Does my sponsor have to come too?",
      },
      {
        cell_id: "6d2f78eb-702f-4b12-8ca8-6572216476e2",
        speaker: "Petugas",
        text: "Belum tentu. Jika ada perubahan, mohon cek email dan nomor laporan.",
        vi: "Chưa chắc. Nếu có thay đổi, xin kiểm tra email và số hồ sơ.",
        en: "Not necessarily. If there are changes, please check email and the report number.",
      },
    ],
    exercises: [
      {
        type: "multiple_choice",
        instruction_vi: "Chọn câu phù hợp khi hỏi ở imigrasi bandara.",
        instruction_en: "Choose the suitable sentence when asking at airport immigration.",
        items: [
          {
            prompt: "Bạn muốn hỏi phí gia hạn visa.",
            answer: "Berapa biaya untuk memperpanjang visa ini?",
            options: [
              "Berapa biaya untuk memperpanjang visa ini?",
              "Saya suka bandara ini.",
              "Visa saya panjang sekali.",
            ],
          },
          {
            prompt: "Bạn muốn hỏi về lịch mới.",
            answer: "Apakah ada jadwal ulang untuk datang besok?",
            options: [
              "Apakah ada jadwal ulang untuk datang besok?",
              "Saya tidak mau nomor antrean.",
              "Nomor laporan saya hilang tadi malam.",
            ],
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia.",
        instruction_en: "Translate into Indonesian.",
        items: [
          { prompt: "Tôi muốn gia hạn visa của tôi ở phòng nhập cảnh sân bay.", answer: "Saya ingin memperpanjang visa saya di imigrasi bandara." },
          { prompt: "Hồ sơ của tôi có thiếu giấy tờ nào, có thể giúp kiểm tra không?", answer: "Dokumen saya ada yang kurang, bisa bantu cek?" },
          { prompt: "Nếu có thay đổi, xin hãy gửi cập nhật qua email.", answer: "Mohon kirim pembaruan melalui email jika ada perubahan." },
        ],
      },
    ],
  },
];
