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
      { word: "memperpanjang visa", en: "to extend a visa", vi: "gia hạn visa", pos: "verb phrase", pronunciation_vi: "mem-per-PAN-jang VI-sa", pronunciation_en: "mem-per-PAN-jang VEE-sa" },
      { word: "imigrasi bandara", en: "airport immigration", vi: "nhập cảnh sân bay", pos: "noun phrase", pronunciation_vi: "i-mi-GRA-si BAN-da-ra", pronunciation_en: "i-mi-GRA-see BAN-dah-rah" },
      { word: "dokumen kurang", en: "missing documents", vi: "thiếu giấy tờ", pos: "noun phrase", pronunciation_vi: "do-ku-MEN KU-rang", pronunciation_en: "do-koo-MEN KOO-rang" },
      { word: "petugas", en: "officer / staff", vi: "nhân viên / cán bộ", pos: "noun", pronunciation_vi: "pe-TU-gas", pronunciation_en: "peh-TOO-gas" },
      { word: "nomor antrean", en: "queue number", vi: "số thứ tự", pos: "noun phrase", pronunciation_vi: "NO-mor an-TRE-an", pronunciation_en: "NO-mor an-TRE-an" },
      { word: "surat sponsor", en: "sponsor letter", vi: "thư bảo lãnh", pos: "noun phrase", pronunciation_vi: "SU-rat SPON-sor", pronunciation_en: "SOO-rat SPON-sor" },
      { word: "jadwal ulang", en: "reschedule", vi: "đổi lịch hẹn", pos: "verb phrase", pronunciation_vi: "jad-WAL u-LANG", pronunciation_en: "jad-WAL oo-LANG" },
      { word: "biaya", en: "cost / fee", vi: "chi phí", pos: "noun", pronunciation_vi: "BI-a-ya", pronunciation_en: "BEE-ah-yah" },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Selamat pagi, saya ingin memperpanjang visa saya di imigrasi bandara.",
        vi: "Chào buổi sáng, tôi muốn gia hạn visa của tôi ở phòng nhập cảnh sân bay.",
        en: "Good morning, I would like to extend my visa at airport immigration.",
      },
      {
        speaker: "Petugas",
        text: "Baik. Silakan ambil nomor antrean dan siapkan paspor asli.",
        vi: "Được ạ. Mời lấy số thứ tự và chuẩn bị hộ chiếu gốc.",
        en: "Okay. Please take a queue number and prepare the original passport.",
      },
      {
        speaker: "Pemohon",
        text: "Dokumen saya ada yang kurang, bisa bantu cek?",
        vi: "Hồ sơ của tôi có thiếu giấy tờ nào, có thể giúp kiểm tra không?",
        en: "Some of my documents are missing; can you help check?",
      },
      {
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
      { word: "berlaku", en: "valid / in force", vi: "còn hiệu lực", pos: "adjective / verb", pronunciation_vi: "ber-LA-ku", pronunciation_en: "ber-LAH-koo" },
      { word: "nomor laporan", en: "report number", vi: "số hồ sơ / số báo cáo", pos: "noun phrase", pronunciation_vi: "NO-mor la-PO-ran", pronunciation_en: "NO-mor la-PO-ran" },
      { word: "pembaruan", en: "update", vi: "cập nhật", pos: "noun", pronunciation_vi: "pem-ba-RU-an", pronunciation_en: "pem-ba-ROO-an" },
      { word: "opsi", en: "option", vi: "lựa chọn", pos: "noun", pronunciation_vi: "OP-si", pronunciation_en: "OP-see" },
      { word: "sesuai jadwal", en: "according to schedule", vi: "theo lịch", pos: "phrase", pronunciation_vi: "se-SU-ai jad-WAL", pronunciation_en: "seh-SOO-ah-ee jad-WAL" },
      { word: "lengkap", en: "complete", vi: "đầy đủ", pos: "adjective", pronunciation_vi: "leng-KAP", pronunciation_en: "leng-KAP" },
      { word: "loket pembayaran", en: "payment counter", vi: "quầy thanh toán", pos: "noun phrase", pronunciation_vi: "LO-ket pem-ba-YAR-an", pronunciation_en: "LO-ket pem-ba-YAR-an" },
    ],
    dialogue: [
      {
        speaker: "Pemohon",
        text: "Berapa biaya untuk memperpanjang visa ini?",
        vi: "Gia hạn visa này hết bao nhiêu tiền?",
        en: "How much does it cost to extend this visa?",
      },
      {
        speaker: "Petugas",
        text: "Biayanya akan kami jelaskan di loket pembayaran.",
        vi: "Chi phí sẽ được chúng tôi giải thích ở quầy thanh toán.",
        en: "We will explain the fee at the payment counter.",
      },
      {
        speaker: "Pemohon",
        text: "Apakah sponsor saya harus datang juga?",
        vi: "Người bảo lãnh của tôi có phải đến cùng không?",
        en: "Does my sponsor have to come too?",
      },
      {
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
