// G7 — Italian Driving License Language (Vietnamese → Italian study track).
// Converted from .local/vietnamese-italian-study/G7-italian-driving-license-language.md.
//
// Scope: Italian for driving school, road signs, traffic rules, car documents,
// insurance, accidents, and police stops. Language practice, NOT legal advice.
//
// NOTE: There is no shared Italian lesson type yet (src/languages/italian has no
// lessons.ts), so this file is self-contained: it declares an inline ItalianLesson
// type that mirrors the French `FrenchLesson` shape in
// src/languages/french/lessons.ts (and matches the sibling A4 / B6 / B7 /
// hospitality extra files). When the Italian registry lands, swap the local types
// for a shared import.
//
// Field convention (inherited from the French lessons): the `en` field on a
// sentence holds the TARGET-LANGUAGE text (here: Italian), and `vi` holds the
// Vietnamese gloss. `pronunciation_focus` carries Vietnamese-facing pronunciation
// + grammar notes (incl. the common Vietnamese-speaker mistake = L1 note + a
// correction drill); `pronunciation_focus_en` is the English-speaker companion,
// same order.

export type ItalianLessonSentence = {
  /** Target-language (Italian) sentence. */
  en: string;
  /** Vietnamese translation. */
  vi: string;
  /** Vietnamese-facing pronunciation/grammar notes, incl. L1 (VN-speaker) traps. */
  pronunciation_focus: string[];
  /** English-speaker companion to pronunciation_focus — same length + order. */
  pronunciation_focus_en?: string[];
};

export type ItalianVocabEntry = {
  cell_id?: string;
  /** Italian word/phrase (with article where it teaches gender). */
  word: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech, e.g. "noun (m)", "noun (f)", "verb", "phrase". */
  pos: string;
  /** Vietnamese pronunciation hint, stressed syllable in CAPS. */
  pronunciation_vi: string;
  /** English pronunciation hint, stressed syllable in CAPS. */
  pronunciation_en?: string;
};

export type ItalianDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** Italian line. */
  text: string;
  /** Vietnamese gloss. */
  vi?: string;
  /** English gloss. */
  en?: string;
};

// Loosely typed so per-type fields (translation, reading, checklist, rubric) can vary.
export type ItalianExercise = Record<string, unknown>;

export type ItalianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ItalianLesson = {
  id: string;
  category: string;
  level: ItalianCefrLevel;
  title_vi: string;
  title_en: string;
  sentences: ItalianLessonSentence[];
  cultural_notes_vi: string;
  cultural_notes_en?: string;
  tip_advice_vi: string;
  tip_advice_en?: string;
  vocabulary?: ItalianVocabEntry[];
  dialogue?: ItalianDialogueLine[];
  exercises?: ItalianExercise[];
  content?: string;
};

export const lessons: ItalianLesson[] = [
  {
    id: "italian_driving_license_language_g7",
    level: "B1",
    category: "life_admin_driving",
    title_vi: "Tiếng Ý cho bằng lái xe và luật giao thông",
    title_en: "Italian for the driving license and traffic rules",
    sentences: [
      // ── Core driving vocabulary in context ─────────────────────────────
      {
        en: "Ho la patente vietnamita.",
        vi: "Tôi có bằng lái Việt Nam.",
        pronunciation_focus: [
          "o la pa-TEN-te vye-tna-MI-ta — `patente` là giống cái: `LA patente`.",
          "Lỗi người Việt: bỏ mạo từ (`Ho patente`). Tiếng Ý bắt buộc có `la`: `Ho LA patente`.",
          "Drill: `Ho la patente vietnamita.`",
        ],
        pronunciation_focus_en: [
          "o la pa-TEN-te vye-tna-MEE-ta — `patente` is feminine: `LA patente`.",
          "VN-speaker trap: dropping the article (`Ho patente`). Italian needs it: `Ho LA patente`.",
          "Drill: `Ho la patente vietnamita.`",
        ],
      },
      {
        en: "Mi iscrivo all'autoscuola.",
        vi: "Tôi ghi danh vào trường dạy lái xe.",
        pronunciation_focus: [
          "mi i-SKRI-vo al-lau-to-SKWO-la — `sc` trước `u` đọc `sk`; `iscriversi` là động từ phản thân.",
          "Lỗi người Việt: quên đại từ phản thân `mi` (`Iscrivo`). Ghi danh chính mình = `MI iscrivo`.",
          "Drill: `Mi iscrivo all'autoscuola.`",
        ],
        pronunciation_focus_en: [
          "mi i-SKREE-vo al-lau-to-SKWO-la — `sc` before `u` is `sk`; `iscriversi` is reflexive.",
          "VN-speaker trap: dropping the reflexive `mi` (`Iscrivo`). Enrolling yourself = `MI iscrivo`.",
          "Drill: `Mi iscrivo all'autoscuola.`",
        ],
      },
      {
        en: "Studio per l'esame teorico.",
        vi: "Tôi học cho kỳ thi lý thuyết.",
        pronunciation_focus: [
          "STU-dyo per le-ZA-me te-O-ri-co — `s` giữa hai nguyên âm trong `esame` đọc `z`.",
          "Lỗi người Việt: nói `Studio l'esame` (thiếu `per`). Đúng là `studiare PER`: học CHO kỳ thi.",
          "Drill: `Studio per l'esame teorico.`",
        ],
        pronunciation_focus_en: [
          "STOO-dyo per le-ZA-me te-O-ri-co — the `s` between vowels in `esame` is `z`.",
          "VN-speaker trap: `Studio l'esame` (no `per`). It is `studiare PER`: to study FOR an exam.",
          "Drill: `Studio per l'esame teorico.`",
        ],
      },
      {
        en: "Il limite di velocità è 50 km/h.",
        vi: "Giới hạn tốc độ là 50 km/h.",
        pronunciation_focus: [
          "il LI-mi-te di ve-lo-chi-TA È cin-KWAN-ta — `c` trước `i` trong `velocità` đọc `ch`.",
          "Lỗi người Việt: nói `limite velocità` (thiếu `di`). Phải có giới từ: `il limite DI velocità`.",
          "Drill: `Il limite di velocità è 50 km/h.`",
        ],
        pronunciation_focus_en: [
          "il LEE-mee-te di ve-lo-chee-TA È cheen-KWAN-ta — `c` before `i` in `velocità` is `ch`.",
          "VN-speaker trap: `limite velocità` (no `di`). The preposition is required: `il limite DI velocità`.",
          "Drill: `Il limite di velocità è 50 km/h.`",
        ],
      },
      {
        en: "L'assicurazione è valida.",
        vi: "Bảo hiểm còn hiệu lực.",
        pronunciation_focus: [
          "las-si-cu-ra-TSYO-ne È VA-li-da — `z` trong `assicurazione` đọc `ts`.",
          "Lỗi người Việt: không hợp giống (`assicurazione valido`). `assicurazione` giống cái → `validA`.",
          "Drill: `L'assicurazione è valida.`",
        ],
        pronunciation_focus_en: [
          "las-si-cu-ra-TSYO-ne È VA-li-da — the `z` in `assicurazione` is `ts`.",
          "VN-speaker trap: no agreement (`assicurazione valido`). It is feminine → `validA`.",
          "Drill: `L'assicurazione è valida.`",
        ],
      },
      {
        en: "La revisione è scaduta. Ho ricevuto una multa.",
        vi: "Kiểm định xe đã hết hạn. Tôi đã bị phạt.",
        pronunciation_focus: [
          "la re-vi-ZYO-ne È ska-DU-ta — o ri-che-VU-to OO-na MUL-ta.",
          "Lỗi người Việt: lẫn `multa` (tiền phạt) với `molta` (nhiều). Khác nghĩa hoàn toàn — đọc rõ `MUL`.",
          "Drill: `La revisione è scaduta. Ho ricevuto una multa.`",
        ],
        pronunciation_focus_en: [
          "la re-vee-ZYO-ne È ska-DOO-ta — o ree-che-VOO-to OO-na MUL-ta.",
          "VN-speaker trap: confusing `multa` (fine) with `molta` (a lot). Totally different — say `MUL`.",
          "Drill: `La revisione è scaduta. Ho ricevuto una multa.`",
        ],
      },
      // ── Road-sign language ─────────────────────────────────────────────
      {
        en: "Qui c'è divieto di sosta e senso unico.",
        vi: "Ở đây cấm đỗ xe và là đường một chiều.",
        pronunciation_focus: [
          "kwi ce di-VYE-to di SOS-ta e SEN-so U-ni-co — `sosta` = đỗ/dừng xe.",
          "Văn hóa: `senso unico` (một chiều) rất hay gặp trong phố cổ — đi ngược chiều bị phạt nặng.",
          "Drill: `Qui c'è divieto di sosta e senso unico.`",
        ],
        pronunciation_focus_en: [
          "kwee che di-VYE-to di SOS-ta e SEN-so OO-ni-co — `sosta` = parking/stopping.",
          "Note: `senso unico` (one-way) is everywhere in old town centers — going the wrong way is a heavy fine.",
          "Drill: `Qui c'è divieto di sosta e senso unico.`",
        ],
      },
      {
        en: "Devi dare precedenza al pedone sull'attraversamento.",
        vi: "Bạn phải nhường đường cho người đi bộ ở vạch qua đường.",
        pronunciation_focus: [
          "DE-vi DA-re pre-che-DEN-tsa al pe-DO-ne — `c` trước `e` đọc `ch`; `z` trong `precedenza` đọc `ts`.",
          "`dare precedenza` = nhường đường; `attraversamento pedonale` = vạch qua đường (đi bộ).",
          "Drill: `Devi dare precedenza al pedone sull'attraversamento.`",
        ],
        pronunciation_focus_en: [
          "DE-vee DA-re pre-che-DEN-tsa al pe-DO-ne — `c` before `e` is `ch`; `z` in `precedenza` is `ts`.",
          "`dare precedenza` = to give way; `attraversamento pedonale` = pedestrian crossing.",
          "Drill: `Devi dare precedenza al pedone sull'attraversamento.`",
        ],
      },
      {
        en: "Attento: zona a traffico limitato, la strada è chiusa.",
        vi: "Chú ý: khu hạn chế giao thông, đường đã đóng.",
        pronunciation_focus: [
          "at-TEN-to: TSO-na a TRAF-fi-co li-mi-TA-to, la STRA-da È KYU-za — `chi` đọc `ky`.",
          "Văn hóa: ZTL (`zona a traffico limitato`) bắt camera tự động — lái vào không phép bị phạt rất nhiều.",
          "Drill: `Zona a traffico limitato, la strada è chiusa.`",
        ],
        pronunciation_focus_en: [
          "at-TEN-to: TSO-na a TRAF-fee-co lee-mee-TA-to, la STRA-da È KYOO-za — `chi` is `ky`.",
          "Note: a ZTL (`zona a traffico limitato`) is camera-enforced — driving in without a permit is a common, costly fine.",
          "Drill: `Zona a traffico limitato, la strada è chiusa.`",
        ],
      },
      // ── At a police stop / after an accident ───────────────────────────
      {
        en: "No, mi dispiace. Ho fatto qualcosa di sbagliato?",
        vi: "Không, xin lỗi. Tôi đã làm gì sai à?",
        pronunciation_focus: [
          "no, mi di-SPYA-che — o FAT-to kwal-CO-za di zba-LYA-to — `gli` đọc `ly`.",
          "Lỗi người Việt: dịch sát `Ho fatto sbagliato?`. Tự nhiên hơn: `Ho fatto QUALCOSA DI sbagliato?`",
          "Drill: `Ho fatto qualcosa di sbagliato?`",
        ],
        pronunciation_focus_en: [
          "no, mee di-SPYA-che — o FAT-to kwal-CO-za di zba-LYA-to — `gli` is `ly`.",
          "VN-speaker trap: literal `Ho fatto sbagliato?`. More natural: `Ho fatto QUALCOSA DI sbagliato?`",
          "Drill: `Ho fatto qualcosa di sbagliato?`",
        ],
      },
      {
        en: "C'è stato un incidente, ma nessuno è ferito.",
        vi: "Đã có một tai nạn, nhưng không ai bị thương.",
        pronunciation_focus: [
          "ce STA-to un in-chi-DEN-te, ma nes-SU-no È fe-RI-to — `c` trước `i` đọc `ch`.",
          "Lỗi người Việt: nói `non nessuno` (phủ định kép sai vị trí). Khi `nessuno` đứng đầu, KHÔNG thêm `non`.",
          "Drill: `Nessuno è ferito.` / `Una persona è ferita.`",
        ],
        pronunciation_focus_en: [
          "che STA-to un in-chee-DEN-te, ma nes-SOO-no È fe-REE-to — `c` before `i` is `ch`.",
          "VN-speaker trap: `non nessuno`. When `nessuno` comes before the verb you do NOT add `non`.",
          "Drill: `Nessuno è ferito.` / `Una persona è ferita.`",
        ],
      },
      {
        en: "Compiliamo il modulo di constatazione amichevole. Ho bisogno dei dati dell'assicurazione.",
        vi: "Chúng ta điền mẫu thỏa thuận tai nạn. Tôi cần thông tin bảo hiểm.",
        pronunciation_focus: [
          "com-pi-LYA-mo il MO-du-lo di con-sta-ta-TSYO-ne a-mi-KE-vo-le — `che` trong `amichevole` đọc `ke`.",
          "`avere bisogno DI`: cần CÁI GÌ phải có `di` (+ `dei` = di + i). Tôi cần thông tin = `Ho bisogno DEI dati`.",
          "Drill: `Ho bisogno dei dati dell'assicurazione.`",
        ],
        pronunciation_focus_en: [
          "com-pee-LYA-mo il MO-doo-lo di con-sta-ta-TSYO-ne a-mee-KE-vo-le — `che` in `amichevole` is `ke`.",
          "`avere bisogno DI`: needing something takes `di` (+ `dei` = di + i). `Ho bisogno DEI dati`.",
          "Drill: `Ho bisogno dei dati dell'assicurazione.`",
        ],
      },
    ],
    cultural_notes_vi:
      "Ở Ý, lái xe phải LUÔN mang theo `patente` (bằng lái), `libretto` (giấy đăng ký xe) và bằng chứng `assicurazione` (bảo hiểm) — cảnh sát (Polizia / Carabinieri) có quyền dừng xe kiểm tra bất cứ lúc nào. Bằng lái nước ngoài (kể cả bằng Việt Nam) chỉ dùng được trong thời gian giới hạn cho người cư trú; sau đó phải đổi hoặc thi lại — hãy hỏi `autoscuola` về tình trạng của bạn. `Revisione` (kiểm định xe) bắt buộc theo định kỳ; xe quá hạn revisione cũng bị phạt. ZTL (`zona a traffico limitato`) trong trung tâm các thành phố cổ bắt bằng camera tự động và là một trong những lỗi phạt phổ biến nhất với du khách. Tài liệu này là thực hành ngôn ngữ, KHÔNG phải tư vấn pháp lý.",
    cultural_notes_en:
      "In Italy you must ALWAYS carry your `patente` (license), `libretto` (vehicle registration) and proof of `assicurazione` (insurance) — the Polizia / Carabinieri can stop you to check at any time. A foreign license (Vietnamese included) is only valid for a limited window once you become a resident; after that you must convert it or re-take the test — ask an `autoscuola` about your situation. The periodic `revisione` (roadworthiness inspection) is mandatory, and an expired one is itself a fine. The ZTL (`zona a traffico limitato`) in historic city centers is camera-enforced and one of the most common fines tourists get. This is language practice, NOT legal advice.",
    tip_advice_vi:
      "Hai mẹo ngữ pháp cứu bạn ở Ý: (1) danh từ giấy tờ luôn đi KÈM mạo từ + hợp giống — `LA patente`, `IL libretto`, `L'assicurazione è validA`. (2) `studiare PER`, `il limite DI velocità`, `avere bisogno DI` — đừng bỏ giới từ như khi dịch từ tiếng Việt. Khi bị dừng xe, câu an toàn nhất là: `Certo, eccoli` (chìa giấy tờ) và `Mi dispiace, non lo sapevo` (Xin lỗi, tôi không biết) — bình tĩnh và lịch sự.",
    tip_advice_en:
      "Two grammar habits save you in Italy: (1) document nouns always travel WITH their article and agree in gender — `LA patente`, `IL libretto`, `L'assicurazione è validA`. (2) `studiare PER`, `il limite DI velocità`, `avere bisogno DI` — don't drop the preposition the way a word-for-word Vietnamese translation would. If you get pulled over, the safest lines are `Certo, eccoli` (handing over the documents) and `Mi dispiace, non lo sapevo` (Sorry, I didn't know) — stay calm and polite.",
    vocabulary: [
      {
        cell_id: "a69ecd16-de41-4f10-a68b-66d749a59c62",
        word: "la patente",
        en: "driving license",
        vi: "bằng lái",
        pos: "noun (f)",
        pronunciation_vi: "la pa-TEN-te",
        pronunciation_en: "la pa-TEN-te",
      },
      {
        cell_id: "66b7cceb-a87b-4ee5-925e-7ae1ddc59e51",
        word: "l'autoscuola",
        en: "driving school",
        vi: "trường dạy lái xe",
        pos: "noun (f)",
        pronunciation_vi: "lau-to-SKWO-la — `sc` đọc `sk`",
        pronunciation_en: "lau-to-SKWO-la — `sc` is `sk`",
      },
      {
        cell_id: "e4b50abf-544d-4980-bbbe-8b5882922ee7",
        word: "l'esame teorico",
        en: "theory test",
        vi: "thi lý thuyết",
        pos: "noun (m)",
        pronunciation_vi: "le-ZA-me te-O-ri-co — `s` đọc `z`",
        pronunciation_en: "le-ZA-me te-O-ri-co — `s` is `z`",
      },
      {
        cell_id: "2afb4333-018e-4843-898f-4e0d27facfd4",
        word: "l'esame pratico",
        en: "practical test",
        vi: "thi thực hành",
        pos: "noun (m)",
        pronunciation_vi: "le-ZA-me PRA-ti-co",
        pronunciation_en: "le-ZA-me PRA-ti-co",
      },
      {
        cell_id: "0b01e1cc-612b-4dd4-972f-e20fa84f1c2f",
        word: "il segnale stradale",
        en: "road sign",
        vi: "biển báo đường",
        pos: "noun (m)",
        pronunciation_vi: "il se-NYA-le stra-DA-le — `gn` đọc `nh`",
        pronunciation_en: "il se-NYA-le stra-DA-le — `gn` is `ny`",
      },
      {
        cell_id: "34d9f5a5-61cc-4937-a384-57954b991d3f",
        word: "il limite di velocità",
        en: "speed limit",
        vi: "giới hạn tốc độ",
        pos: "noun (m)",
        pronunciation_vi: "il LI-mi-te di ve-lo-chi-TA — `c` đọc `ch`",
        pronunciation_en: "il LEE-mee-te di ve-lo-chee-TA — `c` is `ch`",
      },
      {
        cell_id: "474ee5c1-dab2-4726-844f-d6dbc166ba81",
        word: "l'assicurazione",
        en: "insurance",
        vi: "bảo hiểm",
        pos: "noun (f)",
        pronunciation_vi: "las-si-cu-ra-TSYO-ne — `z` đọc `ts`",
        pronunciation_en: "las-si-cu-ra-TSYO-ne — `z` is `ts`",
      },
      {
        cell_id: "eb1774d3-d201-4233-a5d7-41f55119ddc9",
        word: "il libretto",
        en: "vehicle registration document",
        vi: "giấy đăng ký xe",
        pos: "noun (m)",
        pronunciation_vi: "il li-BRET-to",
        pronunciation_en: "il lee-BRET-to",
      },
      {
        cell_id: "3bcd1495-8a37-4dab-a741-59a410fec83b",
        word: "la revisione",
        en: "roadworthiness inspection",
        vi: "kiểm định xe",
        pos: "noun (f)",
        pronunciation_vi: "la re-vi-ZYO-ne — `s` đọc `z`",
        pronunciation_en: "la re-vee-ZYO-ne — `s` is `z`",
      },
      {
        cell_id: "82f16255-2f24-48b8-9948-f413f44b97e1",
        word: "la multa",
        en: "fine / ticket",
        vi: "tiền phạt",
        pos: "noun (f)",
        pronunciation_vi: "la MUL-ta — đừng lẫn với `molta` (nhiều)",
        pronunciation_en: "la MUL-ta — don't confuse with `molta` (a lot)",
      },
      {
        cell_id: "181c87ed-5e47-4ac5-98b8-a79dab76551b",
        word: "il divieto di sosta",
        en: "no parking",
        vi: "cấm đỗ xe",
        pos: "noun (m)",
        pronunciation_vi: "il di-VYE-to di SOS-ta",
        pronunciation_en: "il di-VYE-to di SOS-ta",
      },
      {
        cell_id: "f885ec96-c469-454c-a0b2-3b683ca9ad3c",
        word: "il senso unico",
        en: "one-way street",
        vi: "đường một chiều",
        pos: "noun (m)",
        pronunciation_vi: "il SEN-so U-ni-co",
        pronunciation_en: "il SEN-so OO-ni-co",
      },
      {
        cell_id: "c0bb68ac-6820-4240-b59c-d7a12dd12957",
        word: "dare precedenza",
        en: "to give way / yield",
        vi: "nhường đường",
        pos: "verb (phrase)",
        pronunciation_vi: "DA-re pre-che-DEN-tsa — `c` đọc `ch`, `z` đọc `ts`",
        pronunciation_en: "DA-re pre-che-DEN-tsa — `c` is `ch`, `z` is `ts`",
      },
      {
        cell_id: "310249d6-aa5d-4b43-9824-e2071285138e",
        word: "l'attraversamento pedonale",
        en: "pedestrian crossing",
        vi: "vạch qua đường",
        pos: "noun (m)",
        pronunciation_vi: "lat-tra-ver-sa-MEN-to pe-do-NA-le",
        pronunciation_en: "lat-tra-ver-sa-MEN-to pe-do-NA-le",
      },
      {
        cell_id: "dc7fa30e-dcfe-48a3-a9e4-8b394f72dea6",
        word: "la zona a traffico limitato (ZTL)",
        en: "limited traffic zone",
        vi: "khu hạn chế giao thông",
        pos: "noun (f)",
        pronunciation_vi: "la TSO-na a TRAF-fi-co li-mi-TA-to",
        pronunciation_en: "la TSO-na a TRAF-fee-co lee-mee-TA-to",
      },
      {
        cell_id: "e6d4fb0f-2f87-4f5d-b8e8-de6a60c595cc",
        word: "la strada chiusa",
        en: "road closed",
        vi: "đường đóng",
        pos: "noun (f)",
        pronunciation_vi: "la STRA-da KYU-za — `chi` đọc `ky`",
        pronunciation_en: "la STRA-da KYOO-za — `chi` is `ky`",
      },
      {
        cell_id: "e652fc55-85bd-44af-8540-3ddc349ef644",
        word: "l'incidente",
        en: "accident",
        vi: "tai nạn",
        pos: "noun (m)",
        pronunciation_vi: "lin-chi-DEN-te — `c` đọc `ch`",
        pronunciation_en: "lin-chee-DEN-te — `c` is `ch`",
      },
      {
        cell_id: "3d4af8b8-8020-4baf-8dcf-a4a8b4819516",
        word: "ferito / ferita",
        en: "injured",
        vi: "bị thương",
        pos: "adjective",
        pronunciation_vi: "fe-RI-to (nam) / fe-RI-ta (nữ)",
        pronunciation_en: "fe-REE-to (m) / fe-REE-ta (f)",
      },
      {
        cell_id: "d51428bd-3bd9-4886-98e2-b85bfc799f2a",
        word: "il modulo di constatazione amichevole",
        en: "friendly accident report form (CAI)",
        vi: "mẫu thỏa thuận tai nạn",
        pos: "noun (m)",
        pronunciation_vi: "il MO-du-lo di con-sta-ta-TSYO-ne a-mi-KE-vo-le",
        pronunciation_en: "il MO-doo-lo di con-sta-ta-TSYO-ne a-mee-KE-vo-le",
      },
    ],
    dialogue: [
      // ── Police stop (Officer ⇄ Driver) ─────────────────────────────────
      {
        cell_id: "0ecd65b1-7b03-4273-8957-64833b850568",
        speaker: "Agente",
        text: "Buongiorno, patente e libretto, per favore.",
        vi: "Chào, bằng lái và giấy xe, làm ơn.",
        en: "Good morning, license and registration, please.",
      },
      {
        cell_id: "169aba7a-ec39-4aad-bbda-33ea1f18b38c",
        speaker: "Conducente",
        text: "Certo, eccoli.",
        vi: "Vâng, đây.",
        en: "Of course, here they are.",
      },
      {
        cell_id: "add1a681-99e8-43d7-a657-57ead0644286",
        speaker: "Agente",
        text: "Sa perché l'abbiamo fermata?",
        vi: "Ông/bà biết vì sao chúng tôi dừng xe không?",
        en: "Do you know why we stopped you?",
      },
      {
        cell_id: "1822283d-eec1-4f5c-9a50-f9a6c3d36547",
        speaker: "Conducente",
        text: "No, mi dispiace. Ho fatto qualcosa di sbagliato?",
        vi: "Không, xin lỗi. Tôi đã làm gì sai à?",
        en: "No, sorry. Did I do something wrong?",
      },
      {
        cell_id: "1eea0f5b-b3d1-4de2-9ffb-e8beede8adb6",
        speaker: "Agente",
        text: "Ha superato il limite di velocità.",
        vi: "Ông/bà đã vượt giới hạn tốc độ.",
        en: "You went over the speed limit.",
      },
      {
        cell_id: "39736a27-f326-42e9-927e-9cd417e8997e",
        speaker: "Conducente",
        text: "Capisco. Posso vedere il limite indicato?",
        vi: "Tôi hiểu. Tôi có thể xem giới hạn được chỉ ra không?",
        en: "I understand. May I see the posted limit?",
      },
      // ── Driving school enquiry (Learner ⇄ School) ──────────────────────
      {
        cell_id: "aa185bb5-08ba-4ee0-8d75-0b5c53fbf174",
        speaker: "Allievo",
        text: "Vorrei informazioni per prendere la patente in Italia.",
        vi: "Tôi muốn thông tin để lấy bằng lái ở Ý.",
        en: "I'd like information about getting a license in Italy.",
      },
      {
        cell_id: "69901ed9-b79c-4fab-8848-77e1a68062c9",
        speaker: "Scuola",
        text: "Ha già una patente straniera?",
        vi: "Anh/chị đã có bằng nước ngoài chưa?",
        en: "Do you already have a foreign license?",
      },
      {
        cell_id: "6801d9c3-27ca-4211-9f0f-46deb8cd36a0",
        speaker: "Allievo",
        text: "Sì, ho una patente vietnamita.",
        vi: "Có, tôi có bằng Việt Nam.",
        en: "Yes, I have a Vietnamese license.",
      },
      {
        cell_id: "053e063c-209c-4921-bad2-7c8580f47853",
        speaker: "Scuola",
        text: "Dobbiamo controllare la sua situazione.",
        vi: "Chúng tôi cần kiểm tra tình trạng của anh/chị.",
        en: "We need to check your situation.",
      },
      {
        cell_id: "dcab89b3-c51a-4401-a368-f438f55b9f30",
        speaker: "Allievo",
        text: "Quali documenti devo portare?",
        vi: "Tôi phải mang giấy tờ nào?",
        en: "Which documents do I need to bring?",
      },
    ],
    exercises: [
      {
        type: "reading",
        instruction_vi:
          "Đọc bảng thông báo đỗ xe rồi trả lời câu hỏi:",
        instruction_en:
          "Read the parking notice, then answer the questions:",
        text:
          "In questa zona il parcheggio è riservato ai residenti dalle 8:00 alle 20:00. I veicoli senza permesso possono essere multati o rimossi.",
        text_vi:
          "Trong khu này, chỗ đỗ xe dành riêng cho cư dân từ 8:00 đến 20:00. Xe không có giấy phép có thể bị phạt hoặc bị kéo đi.",
        items: [
          {
            prompt: "A chi è riservato il parcheggio?",
            prompt_vi: "Chỗ đỗ xe dành riêng cho ai?",
            answer: "Ai residenti.",
          },
          {
            prompt: "In quali orari?",
            prompt_vi: "Vào những giờ nào?",
            answer: "Dalle 8:00 alle 20:00.",
          },
          {
            prompt: "Che cosa può succedere ai veicoli senza permesso?",
            prompt_vi: "Xe không có giấy phép có thể bị gì?",
            answer: "Possono essere multati o rimossi.",
          },
        ],
      },
      {
        type: "error_correction",
        instruction_vi:
          "Sửa lỗi thường gặp của người Việt — viết lại cho đúng và nhớ lý do:",
        instruction_en:
          "Fix the common Vietnamese-speaker mistakes — rewrite correctly and note why:",
        items: [
          {
            wrong: "Ho patente.",
            correct: "Ho la patente.",
            why_vi: "Cần mạo từ: `patente` luôn đi với `la`.",
            why_en: "Article needed: `patente` always takes `la`.",
          },
          {
            wrong: "Studio esame teorico.",
            correct: "Studio per l'esame teorico.",
            why_vi: "Cấu trúc là `studiare PER` (học CHO kỳ thi).",
            why_en: "The structure is `studiare per` (to study FOR an exam).",
          },
          {
            wrong: "Limite velocità.",
            correct: "Il limite di velocità.",
            why_vi: "Phải có giới từ `di` nối hai danh từ.",
            why_en: "The preposition `di` is required between the two nouns.",
          },
          {
            wrong: "Assicurazione valido.",
            correct: "L'assicurazione è valida.",
            why_vi: "`assicurazione` giống cái → tính từ hợp giống `valida`.",
            why_en: "`assicurazione` is feminine → the adjective agrees: `valida`.",
          },
          {
            wrong: "Ho fatto sbagliato?",
            correct: "Ho fatto qualcosa di sbagliato?",
            why_vi: "Cụm tự nhiên là `qualcosa di sbagliato` (điều gì sai).",
            why_en: "The natural phrase is `qualcosa di sbagliato` (something wrong).",
          },
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch sang tiếng Ý:",
        instruction_en: "Translate into Italian:",
        items: [
          {
            prompt: "Tôi muốn thông tin về bằng lái.",
            answer: "Vorrei informazioni sulla patente.",
          },
          {
            prompt: "Tôi có bằng lái Việt Nam.",
            answer: "Ho una patente vietnamita.",
          },
          {
            prompt: "Giới hạn tốc độ là 50.",
            answer: "Il limite di velocità è 50.",
          },
          {
            prompt: "Tôi cần thông tin bảo hiểm.",
            answer: "Ho bisogno dei dati dell'assicurazione.",
          },
          {
            prompt: "Tôi có thể xem biển báo không?",
            answer: "Posso vedere il segnale?",
          },
        ],
      },
      {
        type: "roleplay",
        instruction_vi:
          "Đóng vai tài xế bị dừng xe — thực hiện đúng thứ tự: chào → đưa giấy tờ → hỏi lý do → thừa nhận lịch sự → xin xem biển báo.",
        instruction_en:
          "Roleplay the stopped driver — run it in order: greet → hand over documents → ask the reason → acknowledge politely → ask to see the sign.",
        example:
          "Buongiorno. Certo, eccoli: patente e libretto. Ho fatto qualcosa di sbagliato? Capisco, mi dispiace. Posso vedere il limite indicato?",
        example_vi:
          "Chào. Vâng, đây: bằng lái và giấy xe. Tôi đã làm gì sai à? Tôi hiểu, xin lỗi. Tôi có thể xem giới hạn được chỉ ra không?",
      },
      {
        type: "checklist",
        instruction_vi: "Bảng tự kiểm tra — bạn làm được chưa?",
        instruction_en: "Self-check — can you do each one?",
        items: [
          {
            vi: "Tôi gọi đúng tên các giấy tờ: patente, libretto, assicurazione, revisione.",
            en: "I can name the documents correctly: patente, libretto, assicurazione, revisione.",
          },
          {
            vi: "Tôi luôn dùng mạo từ và hợp giống: `L'assicurazione è valida`.",
            en: "I always use the article and agreement: `L'assicurazione è valida`.",
          },
          {
            vi: "Tôi không bỏ giới từ: `studiare per`, `limite di velocità`, `bisogno di`.",
            en: "I don't drop prepositions: `studiare per`, `limite di velocità`, `bisogno di`.",
          },
          {
            vi: "Tôi xử lý được tình huống bị cảnh sát dừng xe một cách bình tĩnh, lịch sự.",
            en: "I can handle a police stop calmly and politely.",
          },
          {
            vi: "Tôi đọc và phản ứng đúng với biển báo: senso unico, divieto di sosta, ZTL.",
            en: "I can read and respond to signs: senso unico, divieto di sosta, ZTL.",
          },
          {
            vi: "Tôi báo cáo được tai nạn: `C'è stato un incidente. Nessuno è ferito.`",
            en: "I can report an accident: `C'è stato un incidente. Nessuno è ferito.`",
          },
        ],
      },
      {
        type: "rubric",
        instruction_vi: "Thang tự đánh giá (1–5):",
        instruction_en: "Self-assessment scale (1–5):",
        items: [
          {
            score: 1,
            vi: "Chưa gọi đúng tên giấy tờ và biển báo cơ bản.",
            en: "Cannot name the basic documents and signs.",
          },
          {
            score: 2,
            vi: "Gọi tên được nhưng hay bỏ mạo từ hoặc giới từ.",
            en: "Can name them but often drops articles or prepositions.",
          },
          {
            score: 3,
            vi: "Hiểu và trả lời được các câu của cảnh sát ở mức cơ bản.",
            en: "Can understand and answer basic police questions.",
          },
          {
            score: 4,
            vi: "Xử lý tình huống dừng xe và đăng ký autoscuola chính xác, đúng mạo từ/giới từ.",
            en: "Can handle a stop and an autoscuola enquiry accurately, with correct articles/prepositions.",
          },
          {
            score: 5,
            vi: "Tự tin trao đổi về bằng lái, bảo hiểm, tai nạn và luật giao thông một cách trôi chảy, lịch sự.",
            en: "Can confidently discuss the license, insurance, accidents, and traffic rules fluently and politely.",
          },
        ],
      },
    ],
  },
];

export default lessons;
