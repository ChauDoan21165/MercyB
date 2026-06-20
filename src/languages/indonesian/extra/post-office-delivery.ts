// Post Office & Delivery Indonesian (Vietnamese -> Indonesian study track).
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

export type IndonesianExercise = Record<string, any>;

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
    id: "indonesian_post_office_delivery",
    level: "A2",
    category: "public_services",
    title_vi: "Bưu điện và giao hàng: gửi gói, mã vận đơn và shipper",
    title_en: "Post office and delivery: parcels, tracking numbers and couriers",
    sentences: [
      {
        en: "Di mana kantor pos terdekat?",
        vi: "Bưu điện gần nhất ở đâu?",
        pronunciation_focus: [
          "di MA-na KAN-tor pos ter-DE-kat - `kantor pos` = bưu điện; `terdekat` = gần nhất.",
          "Lỗi người Việt: nói `pos office` hoặc `kantor post`. Cụm tự nhiên là `kantor pos`.",
          "Luyện: `Di mana kantor pos terdekat?`",
        ],
        pronunciation_focus_en: [
          "di MA-na KAN-tor pos ter-DE-kat - `kantor pos` = post office; `terdekat` = nearest.",
          "VN-speaker trap: saying `pos office` or `kantor post`. Natural Indonesian is `kantor pos`.",
          "Drill: `Di mana kantor pos terdekat?`",
        ],
      },
      {
        en: "Saya mau kirim paket ini ke Surabaya.",
        vi: "Tôi muốn gửi gói hàng này đi Surabaya.",
        pronunciation_focus: [
          "SA-ya mau KI-rim PA-ket I-ni ke su-ra-BA-ya - `kirim paket` = gửi gói hàng; `ke` = đến/tới.",
          "Lỗi người Việt: bỏ phụ âm cuối `t` trong `paket`. Giữ rõ `PA-ket`, không đọc thành `pa-ke`.",
          "Luyện: `Saya mau kirim paket ini.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau KI-rim PA-ket I-ni ke su-ra-BA-ya - `kirim paket` = send a parcel; `ke` = to.",
          "VN-speaker trap: dropping the final `t` in `paket`. Keep it clear: `PA-ket`, not `pa-ke`.",
          "Drill: `Saya mau kirim paket ini.`",
        ],
      },
      {
        en: "Berapa ongkir untuk alamat ini?",
        vi: "Phí gửi đến địa chỉ này là bao nhiêu?",
        pronunciation_focus: [
          "be-RA-pa ONG-kir un-TUK a-LA-mat I-ni - `ongkir` = phí gửi hàng; viết tắt của `ongkos kirim`.",
          "Lỗi người Việt: hỏi `apa ongkir`. Hỏi giá/số tiền dùng `berapa`, không dùng `apa`.",
          "Luyện: `Berapa ongkirnya?`",
        ],
        pronunciation_focus_en: [
          "be-RA-pa ONG-keer un-TUK a-LA-mat I-ni - `ongkir` = shipping fee; short for `ongkos kirim`.",
          "VN-speaker trap: asking `apa ongkir`. For price/amount, use `berapa`, not `apa`.",
          "Drill: `Berapa ongkirnya?`",
        ],
      },
      {
        en: "Tolong tulis alamat lengkap penerima.",
        vi: "Làm ơn viết địa chỉ đầy đủ của người nhận.",
        pronunciation_focus: [
          "TO-long TU-lis a-LA-mat LENG-kap pe-ne-RI-ma - `alamat lengkap` = địa chỉ đầy đủ; `penerima` = người nhận.",
          "Lỗi người Việt: dùng `orang terima`. Danh từ đúng là `penerima`; người gửi là `pengirim`.",
          "Luyện: `Tulis alamat lengkap penerima.`",
        ],
        pronunciation_focus_en: [
          "TO-long TU-lis a-LA-mat LENG-kap pe-ne-REE-ma - `alamat lengkap` = full address; `penerima` = recipient.",
          "VN-speaker trap: saying `orang terima`. Correct noun is `penerima`; sender is `pengirim`.",
          "Drill: `Tulis alamat lengkap penerima.`",
        ],
      },
      {
        en: "Nomor resinya bisa saya dapatkan sekarang?",
        vi: "Tôi có thể lấy mã vận đơn bây giờ không?",
        pronunciation_focus: [
          "NO-mor RE-si-nya BI-sa SA-ya da-PAT-kan se-KA-rang - `nomor resi` = mã vận đơn/mã theo dõi.",
          "Lỗi người Việt: hỏi `apa nomor resi`. Vì là số/mã, hỏi tự nhiên hơn là `nomor resinya berapa?` hoặc câu này.",
          "Luyện: `Nomor resinya berapa?`",
        ],
        pronunciation_focus_en: [
          "NO-mor REH-see-nya BI-sa SA-ya da-PAT-kan se-KA-rang - `nomor resi` = tracking number/receipt number.",
          "VN-speaker trap: asking `apa nomor resi`. Since it is a number/code, say `nomor resinya berapa?` or this sentence.",
          "Drill: `Nomor resinya berapa?`",
        ],
      },
      {
        en: "Saya mau cek paket dengan nomor resi ini.",
        vi: "Tôi muốn kiểm tra gói hàng bằng mã vận đơn này.",
        pronunciation_focus: [
          "SA-ya mau cek PA-ket de-NGAN NO-mor RE-si I-ni - `cek paket` = kiểm tra/tracking gói; `dengan` = bằng/với.",
          "Lỗi người Việt: nói `lihat paket` khi muốn tracking. Trong bối cảnh vận đơn, dùng `cek paket` hoặc `lacak paket`.",
          "Luyện: `Saya mau cek paket.`",
        ],
        pronunciation_focus_en: [
          "SA-ya mau chek PA-ket de-NGAN NO-mor REH-see I-ni - `cek paket` = check/track a parcel; `dengan` = with/by.",
          "VN-speaker trap: saying `lihat paket` when you mean tracking. For shipment tracking, use `cek paket` or `lacak paket`.",
          "Drill: `Saya mau cek paket.`",
        ],
      },
      {
        en: "Paket saya terlambat dua hari.",
        vi: "Gói hàng của tôi trễ hai ngày.",
        pronunciation_focus: [
          "PA-ket SA-ya ter-LAM-bat DU-a HA-ri - `terlambat` = bị trễ/muộn; `dua hari` = hai ngày.",
          "Lỗi người Việt: dùng `lambat` một mình cho giao hàng trễ. Tự nhiên hơn: `paket terlambat`.",
          "Luyện: `Paket saya terlambat.`",
        ],
        pronunciation_focus_en: [
          "PA-ket SA-ya ter-LAM-bat DOO-a HA-ri - `terlambat` = late/delayed; `dua hari` = two days.",
          "VN-speaker trap: using bare `lambat` for a delayed delivery. More natural: `paket terlambat`.",
          "Drill: `Paket saya terlambat.`",
        ],
      },
      {
        en: "Kurir sudah datang, tapi saya tidak di rumah.",
        vi: "Shipper đã đến, nhưng tôi không có ở nhà.",
        pronunciation_focus: [
          "KU-rir SU-dah DA-tang, TA-pi SA-ya TI-dak di RU-mah - `kurir` = người giao hàng; `di rumah` = ở nhà.",
          "Lỗi người Việt: nói `saya tidak rumah`. Cần giới từ `di`: `saya tidak di rumah`.",
          "Luyện: `Saya tidak di rumah.`",
        ],
        pronunciation_focus_en: [
          "KOO-rir SOO-dah DA-tang, TA-pi SA-ya TI-dak di ROO-mah - `kurir` = courier; `di rumah` = at home.",
          "VN-speaker trap: saying `saya tidak rumah`. You need preposition `di`: `saya tidak di rumah`.",
          "Drill: `Saya tidak di rumah.`",
        ],
      },
      {
        en: "Apakah paket ini perlu tanda tangan penerima?",
        vi: "Gói này có cần chữ ký của người nhận không?",
        pronunciation_focus: [
          "a-PA-kah PA-ket I-ni per-LU TAN-da TA-ngan pe-ne-RI-ma - `tanda tangan` = chữ ký; `perlu` = cần.",
          "Lỗi người Việt: dịch từng chữ 'ký tên' thành `tulis nama`. Chữ ký là `tanda tangan`.",
          "Luyện: `Perlu tanda tangan?`",
        ],
        pronunciation_focus_en: [
          "a-PA-kah PA-ket I-ni per-LOO TAN-da TA-ngan pe-ne-REE-ma - `tanda tangan` = signature; `perlu` = need.",
          "VN-speaker trap: translating 'sign name' as `tulis nama`. A signature is `tanda tangan`.",
          "Drill: `Perlu tanda tangan?`",
        ],
      },
      {
        en: "Kalau alamatnya kurang lengkap, paket bisa dikembalikan.",
        vi: "Nếu địa chỉ không đủ đầy đủ, gói hàng có thể bị trả lại.",
        pronunciation_focus: [
          "KA-lau a-LA-mat-nya KU-rang LENG-kap, PA-ket BI-sa di-kem-BA-li-kan - `dikembalikan` = bị/được trả lại.",
          "Lỗi người Việt: né bị động `di-`. Trong thông báo giao hàng, `dikirim`, `diterima`, `dikembalikan` rất phổ biến.",
          "Luyện: `Paket bisa dikembalikan.`",
        ],
        pronunciation_focus_en: [
          "KA-lau a-LA-mat-nya KU-rang LENG-kap, PA-ket BI-sa di-kem-BA-li-kan - `dikembalikan` = returned/sent back.",
          "VN-speaker trap: avoiding passive `di-`. Delivery notices often use `dikirim`, `diterima`, `dikembalikan`.",
          "Drill: `Paket bisa dikembalikan.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Indonesia, gửi hàng có thể qua `kantor pos`, JNE, J&T, SiCepat, Anteraja, hoặc kurir của marketplace. Người bán và người mua thường nói `resi` để chỉ mã vận đơn, `ongkir` cho phí gửi, và `kurir` cho người giao. Địa chỉ nên có tên người nhận, số điện thoại, tên đường, số nhà, RT/RW nếu có, kelurahan/desa, kecamatan, kota/kabupaten, provinsi, và kode pos. Khi nhận gói quan trọng, kurir có thể xin `tanda tangan` hoặc foto bukti penerimaan.",
    cultural_notes_en:
      "In Indonesia, parcels may go through the `kantor pos`, JNE, J&T, SiCepat, Anteraja, or marketplace couriers. Sellers and buyers commonly use `resi` for the tracking number, `ongkir` for shipping fee, and `kurir` for the delivery person. A good address includes recipient name, phone number, street, house number, RT/RW if available, kelurahan/desa, kecamatan, city/regency, province, and postal code. For important parcels, the courier may ask for a `tanda tangan` or a proof-of-receipt photo.",
    tip_advice_vi:
      "Mẹo cho người Việt: phân biệt `kirim` = gửi, `terima` = nhận, `penerima` = người nhận, `pengirim` = người gửi. Hỏi giá dùng `berapa`: `Berapa ongkirnya?` Hỏi tracking dùng `nomor resi`: `Nomor resinya berapa?` Trong thông báo giao hàng, hãy nhận ra bị động `di-`: `dikirim`, `diterima`, `dikembalikan`.",
    tip_advice_en:
      "Tip for Vietnamese speakers: separate `kirim` = send, `terima` = receive, `penerima` = recipient, `pengirim` = sender. Ask prices with `berapa`: `Berapa ongkirnya?` Ask tracking with `nomor resi`: `Nomor resinya berapa?` In delivery notices, learn to recognize passive `di-`: `dikirim`, `diterima`, `dikembalikan`.",
    vocabulary: [
      {
        word: "kantor pos",
        en: "post office",
        vi: "bưu điện",
        pos: "noun phrase",
        pronunciation_vi: "KAN-tor pos",
        pronunciation_en: "KAN-tor pos",
      },
      {
        word: "kirim paket",
        en: "send a parcel",
        vi: "gửi gói hàng",
        pos: "verb phrase",
        pronunciation_vi: "KI-rim PA-ket",
        pronunciation_en: "KI-rim PA-ket",
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
        word: "ongkir",
        en: "shipping fee",
        vi: "phí gửi hàng / phí ship",
        pos: "noun",
        pronunciation_vi: "ONG-kir",
        pronunciation_en: "ONG-keer",
      },
      {
        word: "alamat lengkap",
        en: "full address",
        vi: "địa chỉ đầy đủ",
        pos: "noun phrase",
        pronunciation_vi: "a-LA-mat LENG-kap",
        pronunciation_en: "a-LA-mat LENG-kap",
      },
      {
        word: "kurir",
        en: "courier",
        vi: "người giao hàng / shipper",
        pos: "noun",
        pronunciation_vi: "KU-rir",
        pronunciation_en: "KOO-rir",
      },
      {
        word: "paket terlambat",
        en: "delayed parcel",
        vi: "gói hàng bị trễ",
        pos: "noun phrase",
        pronunciation_vi: "PA-ket ter-LAM-bat",
        pronunciation_en: "PA-ket ter-LAM-bat",
      },
      {
        word: "tanda tangan",
        en: "signature",
        vi: "chữ ký",
        pos: "noun",
        pronunciation_vi: "TAN-da TA-ngan",
        pronunciation_en: "TAN-da TA-ngan",
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
        word: "pengirim",
        en: "sender",
        vi: "người gửi",
        pos: "noun",
        pronunciation_vi: "pe-NGI-rim",
        pronunciation_en: "pe-NGEE-rim",
      },
    ],
    dialogue: [
      {
        speaker: "Pelanggan",
        text: "Pak, saya mau kirim paket ini ke Surabaya.",
        vi: "Anh ơi, tôi muốn gửi gói này đi Surabaya.",
        en: "Sir, I want to send this parcel to Surabaya.",
      },
      {
        speaker: "Petugas pos",
        text: "Boleh. Tolong tulis alamat lengkap penerima dan nomor teleponnya.",
        vi: "Được ạ. Làm ơn viết địa chỉ đầy đủ của người nhận và số điện thoại.",
        en: "Sure. Please write the recipient's full address and phone number.",
      },
      {
        speaker: "Pelanggan",
        text: "Berapa ongkirnya, dan kapan paket sampai?",
        vi: "Phí gửi bao nhiêu, và khi nào gói tới?",
        en: "How much is the shipping fee, and when will the parcel arrive?",
      },
      {
        speaker: "Petugas pos",
        text: "Ongkirnya tiga puluh ribu. Ini nomor resinya untuk cek paket.",
        vi: "Phí gửi là ba mươi nghìn. Đây là mã vận đơn để kiểm tra gói hàng.",
        en: "The shipping fee is thirty thousand. This is the tracking number to check the parcel.",
      },
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ về bưu điện và giao hàng:",
        instruction_en: "Fill in the post/delivery word:",
        items: [
          {
            prompt: "Saya mau ___ paket ini ke Surabaya. (gửi)",
            answer: "kirim",
            options: ["kirim", "kurir", "kiri"],
          },
          {
            prompt: "Berapa ___ untuk alamat ini? (phí ship)",
            answer: "ongkir",
            options: ["ongkir", "ongkosan", "online"],
          },
          {
            prompt: "Paket ini perlu ___ tangan penerima. (chữ ký)",
            answer: "tanda",
            options: ["tanda", "tanya", "tangga"],
          },
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa tiếng Việt:",
        instruction_en: "Match each word with its Vietnamese meaning:",
        items: [
          { prompt: "kantor pos", answer: "bưu điện" },
          { prompt: "resi", answer: "mã vận đơn / biên nhận" },
          { prompt: "kurir", answer: "người giao hàng / shipper" },
          { prompt: "alamat lengkap", answer: "địa chỉ đầy đủ" },
          { prompt: "penerima", answer: "người nhận" },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Indonesia:",
        instruction_en: "Translate into Indonesian:",
        items: [
          {
            prompt: "Bưu điện gần nhất ở đâu?",
            answer: "Di mana kantor pos terdekat?",
          },
          {
            prompt: "Tôi muốn kiểm tra gói hàng bằng mã vận đơn này.",
            answer: "Saya mau cek paket dengan nomor resi ini.",
          },
          {
            prompt: "Gói hàng của tôi trễ hai ngày.",
            answer: "Paket saya terlambat dua hari.",
          },
        ],
      },
    ],
  },
];
