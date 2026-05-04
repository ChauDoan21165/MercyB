import type { FrenchLesson, LessonSentence, VocabEntry, DialogueLine, Exercise } from "./lessons";

export const FRENCH_B1_LESSONS: FrenchLesson[] = [
  // ── 21. Phone Calls ──────────────────────────────────────────────────
  {
    id: "french_phone_calls", category: "phone_calls" as any,
    title_vi: "Gọi điện thoại", title_en: "Phone calls",
    sentences: [
      { en: "Allô, bonjour, je voudrais parler à Monsieur Martin.", vi: "A lô, chào anh, tôi muốn nói chuyện với ông Martin.", pronunciation_focus: ["allô → a-lô", "voudrais → vu-đre", "parler → pa-lê"] },
      { en: "Ne quittez pas, je vous le passe.", vi: "Xin giữ máy, tôi chuyển máy cho anh.", pronunciation_focus: ["quittez → ki-tê", "passe → pát", "vous → vu"] },
      { en: "Je suis désolé, la ligne est occupée.", vi: "Tôi xin lỗi, đường dây đang bận.", pronunciation_focus: ["désolé → đê-dô-lê", "ligne → lin-nhơ", "occupée → o-cuy-pê"] },
      { en: "Pouvez-vous rappeler dans dix minutes ?", vi: "Anh gọi lại sau mười phút được không?", pronunciation_focus: ["rappeler → ra-pơ-lê", "dix → đi", "minutes → mi-nuyt"] },
      { en: "Je n'entends pas bien, pouvez-vous parler plus fort ?", vi: "Tôi nghe không rõ, anh nói to hơn được không?", pronunciation_focus: ["entends → ăn-tăn", "parler → pa-lê", "fort → pho"] },
    ],
    cultural_notes_vi: "Người Pháp luôn mở đầu cuộc gọi với 'Allô' rồi tự giới thiệu. Khi gọi công ty, nói 'Bonjour, [tên] à l'appareil'. Không gọi vào giờ ăn trưa (12h-14h) hoặc sau 21h trừ khi khẩn cấp.",
    tip_advice_vi: "Học thuộc: 'C'est de la part de qui ?' (Ai đang gọi đấy?), 'Je vous écoute' (Tôi đang nghe), 'Je raccroche' (Tôi cúp máy). 'Raccrocher' = cúp máy, 'décrocher' = nhấc máy.",
    vocabulary: [
      { word: "allô", en: "hello (phone)", vi: "a lô", pos: "interjection", pronunciation_vi: "a-LÔ" },
      { word: "le téléphone", en: "telephone", vi: "điện thoại", pos: "noun (m)", pronunciation_vi: "lơ tê-lê-PHÔN" },
      { word: "appeler", en: "to call", vi: "gọi điện", pos: "verb", pronunciation_vi: "a-pơ-LÊ" },
      { word: "décrocher", en: "to pick up", vi: "nhấc máy", pos: "verb", pronunciation_vi: "đê-crô-SÊ" },
      { word: "raccrocher", en: "to hang up", vi: "cúp máy", pos: "verb", pronunciation_vi: "ra-crô-SÊ" },
      { word: "la ligne", en: "line", vi: "đường dây", pos: "noun (f)", pronunciation_vi: "la LIN-nhơ — 'gn' đọc 'nh'" },
      { word: "occupé", en: "busy", vi: "bận", pos: "adjective", pronunciation_vi: "o-cuy-PÊ" },
      { word: "le message", en: "message", vi: "tin nhắn", pos: "noun (m)", pronunciation_vi: "lơ mê-XA-D" },
      { word: "rappeler", en: "to call back", vi: "gọi lại", pos: "verb", pronunciation_vi: "ra-pơ-LÊ" },
      { word: "laisser un message", en: "leave a message", vi: "để lại tin nhắn", pos: "phrase", pronunciation_vi: "le-xê ăng mê-xa-d" },
    ],
    dialogue: [
      { speaker: "A", text: "Allô, c'est Sophie. Est-ce que Thomas est là ?", vi: "A lô, Sophie đây. Thomas có ở đó không ạ?" },
      { speaker: "B", text: "Bonjour Sophie, il est en réunion. Je peux prendre un message ?", vi: "Chào Sophie, anh ấy đang họp. Tôi ghi lời nhắn nhé?" },
      { speaker: "A", text: "Oui, dites-lui de me rappeler quand il est libre.", vi: "Vâng, nhắn anh ấy gọi lại cho tôi khi rảnh." },
      { speaker: "B", text: "D'accord, je lui transmets le message.", vi: "Được rồi, tôi sẽ chuyển lời." },
    ],
    exercises: [
      { type: "fill_blank", instruction_vi: "Điền từ về điện thoại:", pronunciation_focus: ["téléphone"], items: [{ prompt: "Ne ___ pas, je vous le passe.", answer: "quittez" }, { prompt: "La ___ est occupée.", answer: "ligne" }, { prompt: "Pouvez-vous ___ ?", answer: "rappeler" }] },
      { type: "matching", instruction_vi: "Nối hành động với từ:", pronunciation_focus: ["appels"], items: [{ prompt: "nhấc máy", answer: "décrocher" }, { prompt: "cúp máy", answer: "raccrocher" }, { prompt: "gọi lại", answer: "rappeler" }, { prompt: "để lại tin nhắn", answer: "laisser un message" }] },
      { type: "translation", instruction_vi: "Dịch sang tiếng Pháp:", pronunciation_focus: ["téléphoner"], items: [{ prompt: "Xin giữ máy một lát.", answer: "Ne quittez pas, un instant." }, { prompt: "Tôi muốn nói chuyện với ông Dupont.", answer: "Je voudrais parler à Monsieur Dupont." }, { prompt: "Anh gọi lại sau được không?", answer: "Pouvez-vous rappeler plus tard ?" }] },
    ],
  },
  // ── 22. Emails ────────────────────────────────────────────────────────
  {
    id: "french_emails", category: "emails" as any,
    title_vi: "Viết email", title_en: "Writing emails",
    sentences: [
      { en: "Je vous écris pour confirmer notre rendez-vous.", vi: "Tôi viết thư này để xác nhận cuộc hẹn.", pronunciation_focus: ["écris → ê-cri", "confirmer → công-phia-mê"] },
      { en: "Veuillez trouver ci-joint le document demandé.", vi: "Xin vui lòng xem tài liệu đính kèm.", pronunciation_focus: ["veuillez → vơ-yê", "ci-joint → xi-doang"] },
      { en: "Dans l'attente de votre réponse, je vous remercie.", vi: "Mong nhận được hồi âm, xin cảm ơn.", pronunciation_focus: ["attente → a-tăngt", "réponse → rê-pông-x"] },
      { en: "Pourriez-vous m'envoyer le fichier par retour de mail ?", vi: "Bạn gửi file qua email được không?", pronunciation_focus: ["pourriez → pu-ri-ê", "fichier → phi-si-ê"] },
      { en: "Merci de me tenir informé de la suite.", vi: "Cảm ơn đã cập nhật cho tôi.", pronunciation_focus: ["tenir → tơ-ni-r", "informé → anh-pho-mê"] },
    ],
    cultural_notes_vi: "Email Pháp trang trọng hơn email Mỹ. Luôn mở đầu bằng 'Bonjour' hoặc 'Monsieur/Madame' và kết thúc bằng 'Cordialement' (thân mật) hoặc 'Bien à vous' (thân thiện). Đừng quên khoảng trắng TRƯỚC dấu hai chấm, chấm hỏi, chấm than trong tiếng Pháp.",
    tip_advice_vi: "Các cụm chủ chốt: 'Je vous écris pour...' (tôi viết để...), 'Je fais suite à...' (tiếp theo về...), 'Je vous prie de...' (tôi xin...).",
    vocabulary: [
      { word: "l'email", en: "email", vi: "thư điện tử", pos: "noun (m)", pronunciation_vi: "lê-MÊ-L" },
      { word: "envoyer", en: "to send", vi: "gửi", pos: "verb", pronunciation_vi: "ăng-voa-YÊ" },
      { word: "recevoir", en: "to receive", vi: "nhận", pos: "verb", pronunciation_vi: "rơ-xơ-VOA" },
      { word: "la pièce jointe", en: "attachment", vi: "tập tin đính kèm", pos: "noun (f)", pronunciation_vi: "la pi-et DOANG-T" },
      { word: "l'objet", en: "subject line", vi: "tiêu đề", pos: "noun (m)", pronunciation_vi: "lốp-DÊ" },
      { word: "la réponse", en: "reply", vi: "thư trả lời", pos: "noun (f)", pronunciation_vi: "la rê-PÔNG-X" },
      { word: "transférer", en: "to forward", vi: "chuyển tiếp", pos: "verb", pronunciation_vi: "trăng-xphê-RÊ" },
      { word: "la signature", en: "signature", vi: "chữ ký", pos: "noun (f)", pronunciation_vi: "la xi-nhia-TUY-R" },
      { word: "cordialement", en: "best regards", vi: "trân trọng", pos: "adverb", pronunciation_vi: "co-đi-an-lơ-MĂN" },
      { word: "la boîte de réception", en: "inbox", vi: "hộp thư đến", pos: "noun (f)", pronunciation_vi: "la boát đơ rê-xép-xi-ông" },
    ],
    dialogue: [
      { speaker: "A", text: "Tu as reçu mon email avec les photos ?", vi: "Bạn nhận email ảnh chưa?" },
      { speaker: "B", text: "Non, je ne l'ai pas encore vu. Vérifie dans tes spams.", vi: "Chưa. Kiểm tra hộp thư rác thử." },
      { speaker: "A", text: "Ah, il était dans les spams ! Je te réponds tout de suite.", vi: "À, nó nằm trong spam! Trả lời ngay đây." },
      { speaker: "B", text: "Pas de problème, prends ton temps.", vi: "Không sao, cứ từ từ." },
    ],
    exercises: [
      { type: "fill_blank", instruction_vi: "Điền từ:", pronunciation_focus: ["email"], items: [{ prompt: "Veuillez trouver le document ___.", answer: "ci-joint" }, { prompt: "Je vous ___ pour confirmer.", answer: "écris" }, { prompt: "Merci de me ___ informé.", answer: "tenir" }] },
      { type: "matching", instruction_vi: "Nối hành động:", pronunciation_focus: ["courriel"], items: [{ prompt: "gửi", answer: "envoyer" }, { prompt: "nhận", answer: "recevoir" }, { prompt: "chuyển tiếp", answer: "transférer" }, { prompt: "trả lời", answer: "répondre" }] },
      { type: "translation", instruction_vi: "Dịch sang tiếng Pháp:", pronunciation_focus: ["formules"], items: [{ prompt: "Xin vui lòng xem tài liệu đính kèm.", answer: "Veuillez trouver le document ci-joint." }, { prompt: "Mong sớm nhận được hồi âm.", answer: "Dans l'attente de votre réponse." }, { prompt: "Bạn gửi file đó được không?", answer: "Pourriez-vous m'envoyer ce fichier ?" }] },
    ],
  },
  // ── 23. Bank ─────────────────────────────────────────────────────────
  {
    id: "french_bank", category: "bank" as any,
    title_vi: "Ngân hàng", title_en: "Bank",
    sentences: [
      { en: "Je voudrais ouvrir un compte bancaire.", vi: "Tôi muốn mở tài khoản ngân hàng.", pronunciation_focus: ["ouvrir → u-vri-r", "compte → công-t"] },
      { en: "Quels documents faut-il pour ouvrir un compte ?", vi: "Cần giấy tờ gì để mở tài khoản?", pronunciation_focus: ["quels → ken", "faut-il → phô-tin"] },
      { en: "Je voudrais faire un virement de 500 euros.", vi: "Tôi muốn chuyển khoản 500 euro.", pronunciation_focus: ["virement → vi-rờ-măn", "euros → ơ-rô"] },
      { en: "Où est le distributeur le plus proche ?", vi: "Cây ATM gần nhất ở đâu?", pronunciation_focus: ["distributeur → đi-xtri-buy-tơr"] },
      { en: "Ma carte a été avalée par le distributeur !", vi: "Thẻ tôi bị máy ATM nuốt rồi!", pronunciation_focus: ["avalée → a-va-lê", "distributeur → đi-xtri-buy-tơr"] },
    ],
    cultural_notes_vi: "Mở tài khoản ở Pháp cần CMND và bằng chứng địa chỉ. Séc vẫn còn dùng rộng rãi. Thẻ ngân hàng thường là thẻ ghi nợ với chip. Hầu hết ngân hàng đóng cửa nghỉ trưa. 'Un RIB' là số tài khoản — bạn cần nó cho mọi giao dịch.",
    tip_advice_vi: "'Compte' phát âm 'công-t', 'p' và 'e' cuối KHÔNG đọc. 'Découvert' = thấu chi, phí rất cao. Luôn hỏi 'C'est gratuit ?' trước khi dùng dịch vụ mới.",
    vocabulary: [
      { word: "le compte", en: "account", vi: "tài khoản", pos: "noun (m)", pronunciation_vi: "lơ CÔNG-T" },
      { word: "la carte bancaire", en: "bank card", vi: "thẻ ngân hàng", pos: "noun (f)", pronunciation_vi: "la ca-tơ băng-KE-R" },
      { word: "le distributeur", en: "ATM", vi: "cây ATM", pos: "noun (m)", pronunciation_vi: "lơ đi-xtri-buy-TƠR" },
      { word: "le virement", en: "transfer", vi: "chuyển khoản", pos: "noun (m)", pronunciation_vi: "lơ vi-rờ-MĂN" },
      { word: "le chèque", en: "cheque", vi: "séc", pos: "noun (m)", pronunciation_vi: "lơ SÉC" },
      { word: "le retrait", en: "withdrawal", vi: "rút tiền", pos: "noun (m)", pronunciation_vi: "lơ rơ-TRE" },
      { word: "le dépôt", en: "deposit", vi: "gửi tiền", pos: "noun (m)", pronunciation_vi: "lơ đê-PÔ" },
      { word: "le code", en: "PIN", vi: "mã PIN", pos: "noun (m)", pronunciation_vi: "lơ CÓT" },
      { word: "le solde", en: "balance", vi: "số dư", pos: "noun (m)", pronunciation_vi: "lơ XÔN-Đ" },
      { word: "le découvert", en: "overdraft", vi: "thấu chi", pos: "noun (m)", pronunciation_vi: "lơ đê-cu-VE-R" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je voudrais retirer de l'argent.", vi: "Chào chị, tôi muốn rút tiền." },
      { speaker: "B", text: "Bien sûr, vous avez votre carte et une pièce d'identité ?", vi: "Vâng, anh có thẻ và giấy tờ tuỳ thân?" },
      { speaker: "A", text: "Oui, voilà. Je voudrais retirer 200 euros.", vi: "Có, đây. Tôi muốn rút 200 euro." },
      { speaker: "B", text: "Tapez votre code. Voilà vos 200 euros.", vi: "Mời nhập mã PIN. Đây là 200 euro." },
    ],
    exercises: [
      { type: "fill_blank", instruction_vi: "Điền từ:", pronunciation_focus: ["banque"], items: [{ prompt: "Je voudrais ___ un compte.", answer: "ouvrir" }, { prompt: "Où est le ___ ?", answer: "distributeur" }, { prompt: "Ma ___ a été avalée !", answer: "carte" }] },
      { type: "matching", instruction_vi: "Nối:", pronunciation_focus: ["argent"], items: [{ prompt: "rút tiền", answer: "le retrait" }, { prompt: "gửi tiền", answer: "le dépôt" }, { prompt: "chuyển khoản", answer: "le virement" }, { prompt: "số dư", answer: "le solde" }] },
      { type: "translation", instruction_vi: "Dịch:", pronunciation_focus: ["banque"], items: [{ prompt: "Tôi muốn mở tài khoản.", answer: "Je voudrais ouvrir un compte." }, { prompt: "ATM gần nhất ở đâu?", answer: "Où est le distributeur le plus proche ?" }, { prompt: "Chuyển khoản 500 euro.", answer: "Je voudrais faire un virement de 500 euros." }] },
    ],
  },
  // ── 24. Post Office ──────────────────────────────────────────────────
  {
    id: "french_post_office", category: "post_office" as any,
    title_vi: "Bưu điện", title_en: "Post office",
    sentences: [
      { en: "Je voudrais envoyer ce colis au Vietnam.", vi: "Tôi muốn gửi bưu kiện về Việt Nam.", pronunciation_focus: ["envoyer → ăng-voa-yê", "colis → cô-li"] },
      { en: "Combien de temps prend la livraison ?", vi: "Giao hàng mất bao lâu?", pronunciation_focus: ["livraison → li-vre-dông"] },
      { en: "Je voudrais cinq timbres pour l'étranger.", vi: "Năm con tem gửi nước ngoài.", pronunciation_focus: ["timbres → tang-brơ", "étranger → ê-trăng-dê"] },
      { en: "En recommandé, s'il vous plaît.", vi: "Gửi bảo đảm ạ.", pronunciation_focus: ["recommandé → rơ-co-măng-đê"] },
      { en: "Où est la boîte aux lettres la plus proche ?", vi: "Hòm thư gần nhất ở đâu?", pronunciation_focus: ["boîte → boát", "lettres → lé-trờ"] },
    ],
    cultural_notes_vi: "La Poste cũng cung cấp dịch vụ ngân hàng. Tem mua được ở bureau de tabac, không chỉ bưu điện. Hòm thư đường phố màu vàng. Bưu điện thường đóng cửa nghỉ trưa.",
    tip_advice_vi: "Các cụm: 'par avion' (đường hàng không), 'en recommandé' (bảo đảm), 'contre signature' (cần chữ ký). 'Colis' = bưu kiện, 'courrier' = thư từ.",
    vocabulary: [
      { word: "le timbre", en: "stamp", vi: "con tem", pos: "noun (m)", pronunciation_vi: "lơ TANG-brơ" },
      { word: "le colis", en: "parcel", vi: "bưu kiện", pos: "noun (m)", pronunciation_vi: "lơ cô-LI" },
      { word: "la lettre", en: "letter", vi: "lá thư", pos: "noun (f)", pronunciation_vi: "la LÉT-rờ" },
      { word: "la boîte aux lettres", en: "mailbox", vi: "hòm thư", pos: "noun (f)", pronunciation_vi: "la boát ô LÉT-rờ" },
      { word: "l'enveloppe", en: "envelope", vi: "phong bì", pos: "noun (f)", pronunciation_vi: "lăng-vơ-LÓP" },
      { word: "l'adresse", en: "address", vi: "địa chỉ", pos: "noun (f)", pronunciation_vi: "la-ĐRÉT-X" },
      { word: "le facteur", en: "mail carrier", vi: "người đưa thư", pos: "noun (m)", pronunciation_vi: "lơ phăc-TƠR" },
      { word: "le code postal", en: "postal code", vi: "mã bưu chính", pos: "noun (m)", pronunciation_vi: "lơ cốt pốt-TAN" },
      { word: "la poste restante", en: "poste restante", vi: "giữ thư tại bưu điện", pos: "noun (f)", pronunciation_vi: "la pốt rét-TĂNGT" },
      { word: "peser", en: "to weigh", vi: "cân", pos: "verb", pronunciation_vi: "pơ-DÊ" },
    ],
    dialogue: [
      { speaker: "A", text: "Bonjour, je voudrais envoyer cette lettre en recommandé.", vi: "Chào chị, tôi muốn gửi thư bảo đảm." },
      { speaker: "B", text: "Très bien. Vous voulez l'envoyer où ?", vi: "Vâng. Gửi đi đâu ạ?" },
      { speaker: "A", text: "Au Vietnam. Ça prend combien de temps ?", vi: "Đi Việt Nam. Mất bao lâu?" },
      { speaker: "B", text: "Environ une semaine par avion. Ça fera 8 euros.", vi: "Khoảng một tuần đường hàng không. 8 euro." },
    ],
    exercises: [
      { type: "fill_blank", instruction_vi: "Điền từ:", pronunciation_focus: ["poste"], items: [{ prompt: "Je voudrais ___ ce colis.", answer: "envoyer" }, { prompt: "Cinq ___ pour l'étranger.", answer: "timbres" }, { prompt: "Où est la ___ aux lettres ?", answer: "boîte" }] },
      { type: "matching", instruction_vi: "Nối:", pronunciation_focus: ["courrier"], items: [{ prompt: "le timbre", answer: "con tem" }, { prompt: "le colis", answer: "bưu kiện" }, { prompt: "la lettre", answer: "lá thư" }, { prompt: "le facteur", answer: "người đưa thư" }] },
      { type: "translation", instruction_vi: "Dịch:", pronunciation_focus: ["envoyer"], items: [{ prompt: "Gửi bưu kiện về Việt Nam.", answer: "Je voudrais envoyer un colis au Vietnam." }, { prompt: "Bao lâu thì tới?", answer: "Combien de temps prend la livraison ?" }, { prompt: "Gửi bảo đảm ạ.", answer: "En recommandé, s'il vous plaît." }] },
    ],
  },
];

export default FRENCH_B1_LESSONS;
