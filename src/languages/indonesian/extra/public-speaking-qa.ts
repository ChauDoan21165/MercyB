// Public Speaking Q&A Indonesian (Vietnamese -> Indonesian study track).
//
// Self-contained extra lesson file following the established Indonesian extra
// format. The `en` field holds TARGET-LANGUAGE Indonesian, `vi` holds the
// Vietnamese gloss, and pronunciation_focus carries Vietnamese L1 notes with
// English companion explanations in the same order.

type IndonesianLessonSentence = {
  /** Target-language (Indonesian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar/culture notes, incl. L1 traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus, same length + order. */
  pronunciation_focus_en?: string[];
};

type IndonesianVocabEntry = {
  cell_id?: string;
  word: string;
  en: string;
  vi: string;
  pos: string;
  pronunciation_vi: string;
  pronunciation_en?: string;
};

type IndonesianDialogueLine = {
  cell_id?: string;
  speaker: string;
  text: string;
  vi?: string;
  en?: string;
};

type IndonesianExercise = Record<string, unknown>;

type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type IndonesianLesson = {
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

export const publicSpeakingQaLessons: IndonesianLesson[] = [
  {
    id: "indonesian_public_speaking_qa",
    level: "B1",
    category: "communication",
    title_vi: "Hoi dap san: tra loi tu tin, lich su, va biet khi nao can lam ro",
    title_en: "Q&A sessions: answering confidently, politely, and knowing when to clarify",
    sentences: [
      {
        en: "Terima kasih atas pertanyaannya, saya akan menjawab singkat dulu.",
        vi: "Cam on vi cau hoi cua ban, toi se tra loi ngan gon truoc.",
        pronunciation_focus: [
          "`atas pertanyaannya` = voi cau hoi cua ban; cau mo dau rat an toan khi tra loi truoc cong chung.",
          "`menjawab singkat dulu` = tra loi ngan gon truoc; `dulu` cho biet chua can giai thich dai.",
          "Loi nguoi Viet: vao ngay vao noi dung ma khong mo dau. Trong Q&A, mo bang loi cam on giup ban binh tinh va lich su.",
        ],
        pronunciation_focus_en: [
          "`atas pertanyaannya` means for your question; a safe opener in public Q&A.",
          "`menjawab singkat dulu` means answer briefly first; `dulu` signals that a longer explanation can come later.",
          "VN-speaker trap: jumping straight into the answer without a polite opener. In Q&A, a thank-you opener helps you stay calm and courteous.",
        ],
      },
      {
        en: "Pertanyaan itu penting, dan saya perlu menjelaskan konteksnya dulu.",
        vi: "Cau hoi do quan trong, va toi can giai thich boi canh truoc da.",
        pronunciation_focus: [
          "`penting` = quan trong; dung de danh gia cau hoi la hop le va dang tra loi.",
          "`menjelaskan konteksnya dulu` = giai thich boi canh truoc; rat huu ich khi can dat nen.",
          "Loi nguoi Viet: co the noi qua nhieu ngay lap tuc. `konteks` giup nguoi nghe hieu rang ban se tra loi co cau truc.",
        ],
        pronunciation_focus_en: [
          "`penting` means important; useful to validate the question before answering.",
          "`menjelaskan konteksnya dulu` means explain the context first; very useful when setting the frame.",
          "VN-speaker note: speaking at length immediately can be too much. `konteks` tells the audience you will answer in structure.",
        ],
      },
      {
        en: "Kalau saya belum tahu jawabannya, saya akan cek dulu dan mengabari lagi.",
        vi: "Neu toi chua biet cau tra loi, toi se kiem tra truoc va thong bao lai.",
        pronunciation_focus: [
          "`belum tahu jawabannya` = chua biet cau tra loi; hon than noi sai thong tin.",
          "`cek dulu dan mengabari lagi` = kiem tra truoc roi thong bao lai; rat thuc te trong hoi thao.",
          "Loi nguoi Viet: so noi `tidak tahu` nen bat cuu cau chuyen. Trong Q&A, nhan khong biet va hen tra loi lai la rat chuyen nghiep.",
        ],
        pronunciation_focus_en: [
          "`belum tahu jawabannya` means not know the answer yet; safer than giving wrong information.",
          "`cek dulu dan mengabari lagi` means check first and get back later; very practical in live Q&A.",
          "VN-speaker trap: fearing `tidak tahu` and inventing an answer. In Q&A, admitting uncertainty and following up is professional.",
        ],
      },
      {
        en: "Maksud saya bukan itu, tetapi hal yang sedikit berbeda.",
        vi: "Y toi khong phai dieu do, ma la mot dieu khac mot chut.",
        pronunciation_focus: [
          "`maksud saya bukan itu` = y toi khong phai dieu do; dung de sua lai hieu nham.",
          "`sedikit berbeda` = khac mot chut; mem hon so voi sua nhan hieu nham qua truc tiep.",
          "Loi nguoi Viet: noi `salah` qua manh ngay tren san khau. Cau nay giup ban chinh lai y ma khong lam mat the dien.",
        ],
        pronunciation_focus_en: [
          "`maksud saya bukan itu` means I did not mean that; useful for correcting misunderstandings.",
          "`sedikit berbeda` means slightly different; softer than a blunt correction.",
          "VN-speaker trap: using harsh `salah` immediately on stage. This phrase corrects without losing composure.",
        ],
      },
      {
        en: "Boleh saya minta pertanyaannya diulang pelan-pelan?",
        vi: "Toi co the nhin cau hoi duoc lap lai cham cham khong?",
        pronunciation_focus: [
          "`boleh saya minta` = toi co the xin ... khong; rat lich su va co tinh hop tac.",
          "`diulang pelan-pelan` = lap lai cham cham; dung khi am thanh hoi truong khong ro.",
          "Loi nguoi Viet: xin lap lai ngay lap tuc bang giong nhe. Nguoi Indonesia rat quen voi `boleh saya minta...` khi can lam ro.",
        ],
        pronunciation_focus_en: [
          "`boleh saya minta` means may I request...; polite and collaborative.",
          "`diulang pelan-pelan` means repeated slowly; useful when the room audio is unclear.",
          "VN-speaker note: asking for repetition is normal. `boleh saya minta...` is a common and polite frame.",
        ],
      },
      {
        en: "Saya setuju dengan sebagian pertanyaannya, tetapi belum dengan semuanya.",
        vi: "Toi dong y voi mot phan cau hoi do, nhung chua dong y het.",
        pronunciation_focus: [
          "`sebagian` = mot phan; rat huu ich khi muon dong y co dieu kien.",
          "`belum dengan semuanya` = chua phai tat ca; dau hieu ban dang giu lap truong co thai do.",
          "Loi nguoi Viet: tra loi qua trang trongo boi `ya` lien tuc. Cau nay giup ban vua khich le nguoi hoi vua giu tinh chinh xac.",
        ],
        pronunciation_focus_en: [
          "`sebagian` means partly/some of it; useful for conditional agreement.",
          "`belum dengan semuanya` means not with all of it yet; indicates a firm but open position.",
          "VN-speaker trap: overusing filler `ya`. This line is balanced: it acknowledges the question while keeping precision.",
        ],
      },
      {
        en: "Izinkan saya memberi contoh supaya lebih jelas.",
        vi: "Cho phep toi dua ra vi du de ro hon.",
        pronunciation_focus: [
          "`izinkan saya` = xin cho toi; cau mo dau trang trong va mem.",
          "`memberi contoh` = dua ra vi du; rat quan trong khi tra loi cau hoi kho.",
          "Loi nguoi Viet: nhay thang vao ket luan. Trong Q&A, vi du giup nguoi nghe theo kip y ban muon trinh bay.",
        ],
        pronunciation_focus_en: [
          "`izinkan saya` means allow me; a formal and soft opener.",
          "`memberi contoh` means give an example; very important when answering difficult questions.",
          "VN-speaker trap: jumping straight to conclusions. In Q&A, examples help the audience follow your point.",
        ],
      },
      {
        en: "Saya menghargai pertanyaan yang kritis seperti ini.",
        vi: "Toi tran trong nhung cau hoi mang tinh phe binh nhu the nay.",
        pronunciation_focus: [
          "`menghargai` = tran trong, coi trong; tu rat huu ich khi phan hoi cau hoi kho.",
          "`pertanyaan yang kritis` = cau hoi co tinh phe binh/hoai nghi; khong phai `crisis question`.",
          "Loi nguoi Viet: bi nham `kritis` voi xau hoac nguy hiem. Trong hoi dap, `kritis` thuong mang nghia khang dinh tinh benh va can nhac ky.",
        ],
        pronunciation_focus_en: [
          "`menghargai` means appreciate/respect; useful when answering tough questions.",
          "`pertanyaan yang kritis` means a critical question; not a crisis question.",
          "VN-speaker trap: misreading `kritis` as negative or dangerous. In Q&A it often means thoughtful, probing, or critical.",
        ],
      },
      {
        en: "Kalau jawabannya masih belum lengkap, saya akan lanjutkan setelah sesi ini.",
        vi: "Neu cau tra loi chua day du, toi se tiep tuc sau phien nay.",
        pronunciation_focus: [
          "`masih belum lengkap` = van chua day du; trung thuc hon la tra loi cho qua.",
          "`setelah sesi ini` = sau phien nay; cho thoi gian de hoan thien thong tin.",
          "Loi nguoi Viet: co the cam thay phai tra loi ngay lap tuc. Cau nay giup ban giu uy tin ma khong cung.",
        ],
        pronunciation_focus_en: [
          "`masih belum lengkap` means still incomplete; more honest than pretending to know everything.",
          "`setelah sesi ini` means after this session; gives time to complete the information.",
          "VN-speaker note: you may feel pressured to answer immediately. This line preserves credibility without sounding rigid.",
        ],
      },
      {
        en: "Terima kasih, saya siap menerima pertanyaan berikutnya.",
        vi: "Cam on, toi san sang tiep nhan cau hoi tiep theo.",
        pronunciation_focus: [
          "`siap menerima` = san sang tiep nhan; cau ket cho thay ban van tu tin.",
          "`pertanyaan berikutnya` = cau hoi tiep theo; tot khi moderator chuyen luot nhanh.",
          "Loi nguoi Viet: sau khi tra loi xong hay im lang. Cau ket nay giup ban dong phien hoi dap mot cach chuyen nghiep.",
        ],
        pronunciation_focus_en: [
          "`siap menerima` means ready to receive; a confident closing line.",
          "`pertanyaan berikutnya` means the next question; useful when the moderator moves on quickly.",
          "VN-speaker trap: ending abruptly and going silent. This line closes the Q&A professionally.",
        ],
      },
    ],
    cultural_notes_vi:
      "Trong sesi hoi dap o Indonesia, nguoi noi thuong bat dau bang loi cam on, sau do tra loi ngan gon, ro rang, va neu can thi xin lam ro them. Khi chua biet cau tra loi, noi thang `saya belum tahu` khong bi xem la yeu kem; nguo i nghe thuong danh gia cao su trung thuc va cach hen `saya cek dulu`. Nha to chuc va moderator rat quan trong: ho giup dieu huong luot hoi, nen tra loi can giu gioi han va khong noi qua dai.",
    cultural_notes_en:
      "In Indonesian Q&A sessions, speakers often start with thanks, then answer briefly and clearly, and ask for clarification if needed. If they do not know the answer, saying `saya belum tahu` is not seen as weak; audiences usually value honesty and the follow-up promise `saya cek dulu`. The host and moderator are important because they guide the flow, so answers should stay within the question and not run too long.",
    tip_advice_vi:
      "Meo cho nguoi Viet: hoc 3 khung an toan - `Terima kasih atas pertanyaannya`, `Saya belum tahu jawabannya, saya akan cek dulu`, va `Izinkan saya memberi contoh`. Khi bi hoi kho, dung `boleh saya minta pertanyaannya diulang?` thay vi im lang hoac doan dai.",
    tip_advice_en:
      "Tip for Vietnamese speakers: learn three safe frames - `Terima kasih atas pertanyaannya`, `Saya belum tahu jawabannya, saya akan cek dulu`, and `Izinkan saya memberi contoh`. When a question is hard, use `boleh saya minta pertanyaannya diulang?` instead of staying silent or guessing.",
    vocabulary: [
      {
        cell_id: "e1f08b01-5600-49ff-8ab1-c23d4180e613",
        word: "pertanyaan",
        en: "question",
        vi: "cau hoi",
        pos: "noun",
        pronunciation_vi: "per-ta-NYA-an",
        pronunciation_en: "per-tah-NYAH-an",
      },
      {
        cell_id: "910d877b-3bd9-45f5-950a-406ddc3259f5",
        word: "menjawab singkat",
        en: "to answer briefly",
        vi: "tra loi ngan gon",
        pos: "verb phrase",
        pronunciation_vi: "men-ja-WAB SING-kat",
        pronunciation_en: "men-JAH-wab SING-kat",
      },
      {
        cell_id: "89075485-084f-486d-b9b7-65a0bde269dc",
        word: "konteks",
        en: "context",
        vi: "boi canh",
        pos: "noun",
        pronunciation_vi: "kon-TEKS",
        pronunciation_en: "KON-teks",
      },
      {
        cell_id: "6cc5d40c-0056-4aaa-a546-7ee5bf1e34fc",
        word: "boleh saya minta",
        en: "may I ask / may I request",
        vi: "toi co the xin",
        pos: "phrase",
        pronunciation_vi: "BO-leh SA-ya MIN-ta",
        pronunciation_en: "BOH-leh SAH-yah MEEN-tah",
      },
      {
        cell_id: "20ebe904-3b03-4f9b-bb84-bf66ac59c250",
        word: "menghargai",
        en: "to appreciate, to respect",
        vi: "tran trong, coi trong",
        pos: "verb",
        pronunciation_vi: "meng-har-GAI",
        pronunciation_en: "meng-har-GUY",
      },
      {
        cell_id: "91c7a4bb-2fe0-42cc-b811-4f34aa91de9c",
        word: "moderator",
        en: "moderator / host",
        vi: "nguoi dieu phoi",
        pos: "noun",
        pronunciation_vi: "mo-de-RA-tor",
        pronunciation_en: "MOH-duh-ray-ter",
      },
      {
        cell_id: "43599eda-8822-4534-846f-5c91a4c5198b",
        word: "klarifikasi",
        en: "clarification",
        vi: "lam ro",
        pos: "noun",
        pronunciation_vi: "kla-ri-fi-KA-si",
        pronunciation_en: "klah-ree-fee-KAH-see",
      },
      {
        cell_id: "8f522ea3-4069-436a-9b91-f28f984e3214",
        word: "siap menerima",
        en: "ready to receive",
        vi: "san sang tiep nhan",
        pos: "phrase",
        pronunciation_vi: "si-AP me-ne-RI-ma",
        pronunciation_en: "see-AHP meh-neh-REE-ma",
      },
    ],
    dialogue: [
      {
        cell_id: "b315d018-e910-4e42-a2b1-6fd133f364fb",
        speaker: "Moderator",
        text: "Baik, kita buka sesi tanya jawab.",
        vi: "Duoc, chung ta bat dau phien hoi dap.",
        en: "Alright, we are opening the Q&A session.",
      },
      {
        cell_id: "7f68df59-50ff-46f4-900f-651d09260c60",
        speaker: "Peserta",
        text: "Terima kasih atas pertanyaannya, saya akan menjawab singkat dulu.",
        vi: "Cam on vi cau hoi cua ban, toi se tra loi ngan gon truoc.",
        en: "Thank you for your question, I will answer briefly first.",
      },
      {
        cell_id: "b0bd6aa8-a61b-4d1c-b730-45cdf568e903",
        speaker: "Moderator",
        text: "Silakan, kalau perlu bisa diberi contoh.",
        vi: "Xin moi, neu can co the dua ra vi du.",
        en: "Go ahead, if needed you can give an example.",
      },
      {
        cell_id: "534d9f6c-2aa6-40f1-b9a9-290ed59b8158",
        speaker: "Peserta",
        text: "Izinkan saya memberi contoh supaya lebih jelas.",
        vi: "Cho phep toi dua ra vi du de ro hon.",
        en: "Allow me to give an example so it is clearer.",
      },
      {
        cell_id: "42fb3b87-4537-4622-9488-dc143cc236a9",
        speaker: "Moderator",
        text: "Terima kasih. Kita lanjut ke pertanyaan berikutnya.",
        vi: "Cam on. Chung ta chuyen sang cau hoi tiep theo.",
        en: "Thank you. Let us move to the next question.",
      },
    ],
    exercises: [
      {
        type: "translation_id",
        prompt_vi: "Dich sang tieng Indonesia: Cam on vi cau hoi cua ban, toi se tra loi ngan gon truoc.",
        prompt_en: "Translate into Indonesian: Thank you for your question, I will answer briefly first.",
        answer: "Terima kasih atas pertanyaannya, saya akan menjawab singkat dulu.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: Boleh saya minta pertanyaannya diulang ___-___?",
        prompt_en: "Fill in the correct word: Boleh saya minta pertanyaannya diulang ___-___?",
        answer: "pelan-pelan",
        explanation_vi: "`pelan-pelan` = cham cham.",
        explanation_en: "`pelan-pelan` means slowly.",
      },
      {
        type: "multiple_choice",
        prompt_vi: "Cau nao phu hop nhat khi chua biet cau tra loi?",
        prompt_en: "Which sentence is most appropriate when you do not yet know the answer?",
        choices: [
          "Saya belum tahu jawabannya, saya akan cek dulu.",
          "Saya pasti tahu semuanya.",
          "Jangan tanya lagi.",
          "Saya tidak mau jawab.",
        ],
        answer: "Saya belum tahu jawabannya, saya akan cek dulu.",
      },
      {
        type: "short_answer",
        prompt_vi: "Viet mot cau de xin nguoi hoi lap lai cau hoi.",
        prompt_en: "Write one sentence asking the questioner to repeat the question.",
        sample_answer: "Boleh saya minta pertanyaannya diulang pelan-pelan?",
      },
    ],
  },
];
