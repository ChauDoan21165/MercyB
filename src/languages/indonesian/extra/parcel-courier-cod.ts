// Parcel, Courier & COD Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson following the established Indonesian extra shape.
// Sentence `en` is TARGET-LANGUAGE Indonesian; `vi` is the Vietnamese gloss.
// Vietnamese L1 notes live in `pronunciation_focus`, with English companions in
// `pronunciation_focus_en` in the same order.

export type IndonesianLessonSentence = {
  en: string;
  vi: string;
  pronunciation_focus: string[];
  pronunciation_focus_en?: string[];
};

export type IndonesianVocabEntry = {
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

export type IndonesianDialogueLine = {
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
    id: "indonesian_parcel_courier_cod",
    level: "A2",
    category: "shopping",
    title_vi: "Giao hàng, kurir và COD",
    title_en: "Parcels, couriers and COD",
    sentences: [
      {
        en: "Kurir sudah mengantar paket saya belum?",
        vi: "Shipper đã giao gói hàng của tôi chưa?",
        pronunciation_focus: [
          "KU-rir SU-dah me-NGAN-tar PA-ket SA-ya be-LUM - `kurir` = người giao hàng; `sudah...belum?` = đã...chưa?",
          "Lỗi người Việt: hỏi `sudah mengantar tidak?`. Với 'đã...chưa?', dùng `belum`, không dùng `tidak`.",
          "Luyện: `Kurir sudah datang belum?`",
        ],
        pronunciation_focus_en: [
          "KOO-rir SOO-dah me-NGAN-tar PA-ket SA-ya be-LOOM - `kurir` = courier; `sudah...belum?` = has it...yet?",
          "VN-speaker trap: asking `sudah mengantar tidak?`. For 'has it yet?', use `belum`, not `tidak`.",
          "Drill: `Kurir sudah datang belum?`",
        ],
      },
      {
        en: "Saya pilih COD, jadi saya bayar saat paket datang.",
        vi: "Tôi chọn COD, nên tôi trả tiền khi gói hàng đến.",
        pronunciation_focus: [
          "SA-ya PI-lih si-o-di, JA-di SA-ya BA-yar SA-at PA-ket DA-tang - `COD` = trả tiền khi nhận hàng.",
          "Lỗi người Việt: nói `bayar di paket datang`. Cụm đúng là `saat paket datang` hoặc `ketika paket datang`.",
          "Luyện: `Saya bayar saat paket datang.`",
        ],
        pronunciation_focus_en: [
          "SA-ya PI-lih see-oh-dee, JA-di SA-ya BA-yar SA-at PA-ket DA-tang - `COD` = cash on delivery.",
          "VN-speaker trap: saying `bayar di paket datang`. Correct phrasing is `saat paket datang` or `ketika paket datang`.",
          "Drill: `Saya bayar saat paket datang.`",
        ],
      },
      {
        en: "Paket saya belum sampai, padahal statusnya sudah dikirim.",
        vi: "Gói hàng của tôi chưa tới, mặc dù trạng thái đã gửi.",
        pronunciation_focus: [
          "PA-ket SA-ya be-LUM SAM-pai, pa-DA-hal STA-tus-nya SU-dah di-KI-rim - `belum sampai` = chưa tới; `padahal` = mặc dù/thế mà.",
          "Lỗi người Việt: dùng `sudah sampai belum` cho câu khẳng định. Câu khẳng định là `belum sampai`.",
          "Luyện: `Paket saya belum sampai.`",
        ],
        pronunciation_focus_en: [
          "PA-ket SA-ya be-LOOM SAM-pai, pa-DA-hal STA-tus-nya SOO-dah di-KI-rim - `belum sampai` = has not arrived; `padahal` = even though.",
          "VN-speaker trap: using `sudah sampai belum` as a statement. The statement form is `belum sampai`.",
          "Drill: `Paket saya belum sampai.`",
        ],
      },
      {
        en: "Nomor resinya bisa dicek di aplikasi.",
        vi: "Mã vận đơn có thể kiểm tra trong ứng dụng.",
        pronunciation_focus: [
          "NO-mor RE-si-nya BI-sa di-CEK di a-pli-KA-si - `nomor resi` = mã vận đơn; `dicek` = được kiểm tra.",
          "Lỗi người Việt: hỏi `apa resi`. Vì là số/mã, hỏi `nomor resinya berapa?`.",
          "Luyện: `Nomor resinya berapa?`",
        ],
        pronunciation_focus_en: [
          "NO-mor REH-see-nya BI-sa di-CHEK di ap-lee-KA-see - `nomor resi` = tracking number; `dicek` = can be checked.",
          "VN-speaker trap: asking `apa resi`. Since it is a number/code, ask `nomor resinya berapa?`.",
          "Drill: `Nomor resinya berapa?`",
        ],
      },
      {
        en: "Alamat saya salah di sistem, tolong diperbaiki.",
        vi: "Địa chỉ của tôi bị sai trong hệ thống, làm ơn sửa lại.",
        pronunciation_focus: [
          "a-LA-mat SA-ya SA-lah di SIS-tem, TO-long di-per-BA-i-ki - `alamat salah` = địa chỉ sai; `diperbaiki` = được sửa.",
          "Lỗi người Việt: nói `alamat saya salahkan`. Không dùng `-kan` ở đây; nói `alamat saya salah`.",
          "Luyện: `Alamat saya salah.`",
        ],
        pronunciation_focus_en: [
          "a-LA-mat SA-ya SA-lah di SIS-tem, TO-long di-per-BA-i-ki - `alamat salah` = wrong address; `diperbaiki` = corrected.",
          "VN-speaker trap: saying `alamat saya salahkan`. Do not use `-kan` here; say `alamat saya salah`.",
          "Drill: `Alamat saya salah.`",
        ],
      },
      {
        en: "Nama penerima dan nomor teleponnya sudah benar.",
        vi: "Tên người nhận và số điện thoại đã đúng.",
        pronunciation_focus: [
          "NA-ma pe-ne-RI-ma dan NO-mor te-le-PON-nya SU-dah be-NAR - `penerima` = người nhận; `benar` = đúng.",
          "Lỗi người Việt: nói `orang terima`. Danh từ đúng là `penerima`; người gửi là `pengirim`.",
          "Luyện: `Nama penerima sudah benar.`",
        ],
        pronunciation_focus_en: [
          "NA-ma pe-ne-REE-ma dan NO-mor te-le-PON-nya SOO-dah be-NAR - `penerima` = recipient; `benar` = correct.",
          "VN-speaker trap: saying `orang terima`. Correct noun is `penerima`; sender is `pengirim`.",
          "Drill: `Nama penerima sudah benar.`",
        ],
      },
      {
        en: "Berapa ongkir kalau kirim ke luar kota?",
        vi: "Phí ship là bao nhiêu nếu gửi ra ngoài thành phố?",
        pronunciation_focus: [
          "be-RA-pa ONG-kir KA-lau KI-rim ke LU-ar KO-ta - `ongkir` = ongkos kirim/phí ship; `luar kota` = ngoài thành phố.",
          "Lỗi người Việt: hỏi `apa ongkir`. Hỏi giá/số tiền luôn dùng `berapa`.",
          "Luyện: `Berapa ongkirnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ONG-keer KA-lau KI-rim ke LU-ar KO-ta - `ongkir` = shipping fee; `luar kota` = out of town.",
          "VN-speaker trap: asking `apa ongkir`. For price/amount, always use `berapa`.",
          "Drill: `Berapa ongkirnya?`",
        ],
      },
      {
        en: "Kurir bilang alamatnya tidak ditemukan.",
        vi: "Shipper nói là không tìm thấy địa chỉ.",
        pronunciation_focus: [
          "KU-rir BI-lang a-LA-mat-nya TI-dak di-te-MU-kan - `tidak ditemukan` = không được tìm thấy/không tìm thấy.",
          "Lỗi người Việt: nói `tidak ketemu alamat` rất thân mật. Với CS, dùng `alamat tidak ditemukan`.",
          "Luyện: `Alamatnya tidak ditemukan.`",
        ],
        pronunciation_focus_en: [
          "KOO-rir BI-lang a-LA-mat-nya TI-dak di-te-MOO-kan - `tidak ditemukan` = not found.",
          "VN-speaker trap: saying casual `tidak ketemu alamat`. With customer service, use `alamat tidak ditemukan`.",
          "Drill: `Alamatnya tidak ditemukan.`",
        ],
      },
      {
        en: "Saya mau mengajukan komplain pengiriman.",
        vi: "Tôi muốn gửi khiếu nại về giao hàng.",
        pronunciation_focus: [
          "SA-ya mau me-nga-JU-kan kom-PLAIN pe-NGI-rim-an - `komplain pengiriman` = khiếu nại giao hàng.",
          "Lỗi người Việt: chỉ nói `saya komplain`. Trong chat chính thức, `mengajukan komplain` rõ và lịch sự hơn.",
          "Luyện: `Saya mau mengajukan komplain.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau me-nga-JOO-kan kom-PLAIN pe-NGEE-rim-an - `komplain pengiriman` = delivery complaint.",
          "VN-speaker trap: only saying `saya komplain`. In official chat, `mengajukan komplain` is clearer and more polite.",
          "Drill: `Saya mau mengajukan komplain.`",
        ],
      },
      {
        en: "Mohon follow up paket ini hari ini.",
        vi: "Mong anh/chị theo dõi xử lý gói hàng này hôm nay.",
        pronunciation_focus: [
          "MO-hon FO-low ap PA-ket I-ni HA-ri I-ni - `mohon` = xin/mong; `follow up` = theo dõi xử lý.",
          "Lỗi người Việt: dùng `tolong` được, nhưng trong khiếu nại lịch sự hơn là `mohon`.",
          "Luyện: `Mohon follow up paket ini.`",
        ],
        pronunciation_focus_en: [
          "MO-hon FO-low up PA-ket I-ni HA-ri I-ni - `mohon` = kindly request; `follow up` = follow up.",
          "VN-speaker trap: `tolong` works, but in complaints `mohon` sounds more formal and polite.",
          "Drill: `Mohon follow up paket ini.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, mua hàng online thường liên quan đến `kurir`, `nomor resi`, `ongkir`, và đôi khi `COD`. Nếu chọn COD, người nhận chuẩn bị tiền mặt hoặc thanh toán theo hướng dẫn khi kurir đến. Khi paket belum sampai, alamat salah, hoặc status aplikasi không khớp, người mua thường chat với seller hoặc layanan pelanggan bằng các cụm như `cek resi`, `komplain pengiriman`, `mohon follow up`, và `nomor tiket`. Giữ bukti: screenshot status, nomor resi, chat dengan kurir, và foto paket nếu có vấn đề.",
    cultural_notes_en:
      "In Indonesia, online shopping often involves a `kurir`, `nomor resi`, `ongkir`, and sometimes `COD`. If you choose COD, the recipient prepares cash or follows payment instructions when the courier arrives. When a parcel has not arrived, the address is wrong, or the app status does not match reality, buyers usually chat with the seller or customer service using phrases like `cek resi`, `komplain pengiriman`, `mohon follow up`, and `nomor tiket`. Keep evidence: status screenshots, tracking number, courier chat, and parcel photos if there is an issue.",
    tip_advice_vi:
      "Mẹo cho người Việt: `kurir` là người giao hàng; `pengirim` là người gửi; `penerima` là người nhận. `Ongkir` = phí ship, không hỏi bằng `apa` mà hỏi `berapa`. Với khiếu nại giao hàng, khung an toàn là: vấn đề (`paket belum sampai`) + mã (`nomor resi`) + yêu cầu (`mohon follow up`).",
    tip_advice_en:
      "Tip for Vietnamese speakers: `kurir` is the delivery person; `pengirim` is the sender; `penerima` is the recipient. `Ongkir` = shipping fee, so ask with `berapa`, not `apa`. For delivery complaints, use a safe frame: issue (`paket belum sampai`) + code (`nomor resi`) + request (`mohon follow up`).",
    vocabulary: [
      {
        word: "kurir",
        en: "courier",
        vi: "người giao hàng / shipper",
        pos: "noun",
        pronunciation_vi: "KU-rir",
        pronunciation_en: "KOO-rir",
      },
      {
        word: "COD",
        en: "cash on delivery",
        vi: "trả tiền khi nhận hàng",
        pos: "noun",
        pronunciation_vi: "si-o-di",
        pronunciation_en: "see-oh-dee",
      },
      {
        word: "paket belum sampai",
        en: "parcel has not arrived",
        vi: "gói hàng chưa tới",
        pos: "phrase",
        pronunciation_vi: "PA-ket be-LUM SAM-pai",
        pronunciation_en: "PA-ket be-LOOM SAM-pai",
      },
      {
        word: "resi",
        en: "tracking number / receipt",
        vi: "mã vận đơn / biên nhận",
        pos: "noun",
        pronunciation_vi: "RE-si",
        pronunciation_en: "REH-see",
      },
      {
        word: "alamat salah",
        en: "wrong address",
        vi: "địa chỉ sai",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-mat SA-lah",
        pronunciation_en: "a-LA-mat SA-lah",
      },
      {
        word: "penerima",
        en: "recipient",
        vi: "người nhận",
        pos: "noun",
        pronunciation_vi: "pe-ne-RI-ma",
        pronunciation_en: "pe-ne-REE-ma",
      },
      {
        word: "ongkir",
        en: "shipping fee",
        vi: "phí ship / phí gửi",
        pos: "noun",
        pronunciation_vi: "ONG-kir",
        pronunciation_en: "ONG-keer",
      },
      {
        word: "komplain pengiriman",
        en: "delivery complaint",
        vi: "khiếu nại giao hàng",
        pos: "noun phrase",
        pronunciation_vi: "kom-PLAIN pe-NGI-rim-an",
        pronunciation_en: "kom-PLAIN pe-NGEE-rim-an",
      },
      {
        word: "follow up",
        en: "follow up",
        vi: "theo dõi xử lý",
        pos: "verb/noun",
        pronunciation_vi: "FO-low ap",
        pronunciation_en: "FO-low up",
      },
      {
        word: "ditemukan",
        en: "found",
        vi: "được tìm thấy",
        pos: "passive verb",
        pronunciation_vi: "di-te-MU-kan",
        pronunciation_en: "di-te-MOO-kan",
      },
    ],
    dialogue: [
      {
        speaker: "Pembeli",
        text: "Halo, Kak. Paket saya belum sampai, padahal statusnya sudah dikirim.",
        vi: "Chào anh/chị. Gói hàng của tôi chưa tới, mặc dù trạng thái đã gửi.",
        en: "Hello. My parcel has not arrived, even though the status says it was sent.",
      },
      {
        speaker: "Customer Service",
        text: "Boleh kirim nomor resinya?",
        vi: "Anh/chị có thể gửi mã vận đơn không?",
        en: "Can you send the tracking number?",
      },
      {
        speaker: "Pembeli",
        text: "Ini resinya. Kurir bilang alamatnya tidak ditemukan.",
        vi: "Đây là mã vận đơn. Shipper nói không tìm thấy địa chỉ.",
        en: "Here is the tracking number. The courier said the address was not found.",
      },
      {
        speaker: "Customer Service",
        text: "Baik, kami follow up komplain pengiriman ini hari ini.",
        vi: "Vâng, chúng tôi sẽ theo dõi xử lý khiếu nại giao hàng này hôm nay.",
        en: "Okay, we will follow up on this delivery complaint today.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về giao hàng và COD:",
        instruction_en: "Fill in the delivery/COD word:",
        items: [
          {
            prompt: "Saya pilih ___, jadi saya bayar saat paket datang.",
            answer: "COD",
            options: ["COD", "KTP", "ATM"],
          },
          {
            prompt: "Paket saya belum ___, padahal statusnya sudah dikirim.",
            answer: "sampai",
            options: ["sampai", "santai", "salah"],
          },
          {
            prompt: "Saya mau mengajukan komplain ___. (giao hàng)",
            answer: "pengiriman",
            options: ["pengiriman", "penerima", "pengasuh"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kurir", answer: "người giao hàng / shipper" },
          { prompt: "resi", answer: "mã vận đơn / biên nhận" },
          { prompt: "alamat salah", answer: "địa chỉ sai" },
          { prompt: "penerima", answer: "người nhận" },
          { prompt: "ongkir", answer: "phí ship / phí gửi" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Gói hàng của tôi chưa tới.",
            answer: "Paket saya belum sampai.",
          },
          {
            prompt: "Mã vận đơn có thể kiểm tra trong ứng dụng.",
            answer: "Nomor resinya bisa dicek di aplikasi.",
          },
          {
            prompt: "Tôi muốn gửi khiếu nại về giao hàng.",
            answer: "Saya mau mengajukan komplain pengiriman.",
          },
        ],
      },
    ],
  },
];
