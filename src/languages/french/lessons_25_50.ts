import type { FrenchLesson, LessonSentence, VocabEntry, DialogueLine, Exercise } from "./lessons";

export const FRENCH_B1B2_LESSONS: FrenchLesson[] = [
  {
    id: "french_renting",
    category: "renting" as any,
    title_vi: "Thuê nhà",
    title_en: "Renting a home",
    sentences: [
      { en: 'Je cherche un appartement à louer.', vi: 'Tôi tìm căn hộ cho thuê.', pronunciation_focus: ['cherche', 'louer'] },
      { en: 'Quel est le loyer ?', vi: 'Tiền nhà bao nhiêu?', pronunciation_focus: ['loyer'] },
      { en: 'Les charges sont-elles comprises ?', vi: 'Phí đã gồm chưa?', pronunciation_focus: ['charges'] },
      { en: 'Il faut une caution de deux mois.', vi: 'Cần đặt cọc hai tháng.', pronunciation_focus: ['caution'] },
      { en: 'Le bail est de trois ans.', vi: 'Hợp đồng ba năm.', pronunciation_focus: ['bail'] }
    ],
    cultural_notes_vi: "Thuê nhà Pháp: cần CDI, 3 phiếu lương, bảo lãnh. Caution 1-2 tháng. F2/T2, CC, HC.",
    tip_advice_vi: "Hỏi: chauffage collectif ou individuel? État des lieux quan trọng.",
    vocabulary: [
      { word: 'louer', en: 'to rent', vi: 'thuê', pos: 'verb', pronunciation_vi: 'lu-Ê' },
      { word: 'le loyer', en: 'rent', vi: 'tiền nhà', pos: 'noun (m)', pronunciation_vi: 'loa-YÊ' },
      { word: 'la caution', en: 'deposit', vi: 'đặt cọc', pos: 'noun (f)', pronunciation_vi: 'cô-XI-ÔNG' },
      { word: 'le bail', en: 'lease', vi: 'hợp đồng', pos: 'noun (m)', pronunciation_vi: 'BAY' },
      { word: 'le propriétaire', en: 'landlord', vi: 'chủ nhà', pos: 'noun (m)', pronunciation_vi: 'prô-pri-ê-TE-R' },
      { word: 'les charges', en: 'utilities', vi: 'phí', pos: 'noun (f pl)', pronunciation_vi: 'SÁC-D' },
      { word: 'meublé', en: 'furnished', vi: 'có sẵn đồ', pos: 'adjective', pronunciation_vi: 'mơ-BLÊ' },
      { word: 'le chauffage', en: 'heating', vi: 'sưởi', pos: 'noun (m)', pronunciation_vi: 'sô-PHA-D' },
      { word: 'le garant', en: 'guarantor', vi: 'bảo lãnh', pos: 'noun (m)', pronunciation_vi: 'ga-RĂN' },
      { word: 'l’état des lieux', en: 'inventory', vi: 'biên bản', pos: 'noun (m)', pronunciation_vi: 'lê-ta LI-Ơ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, je vous appelle pour l’annonce.', vi: 'Chào, tôi gọi về tin rao.' },
      { speaker: 'B', text: 'L’appartement est toujours libre.', vi: 'Căn hộ vẫn trống.' },
      { speaker: 'A', text: 'Je peux le visiter ?', vi: 'Xem được không?' },
      { speaker: 'B', text: 'Demain à 14h, ça vous va ?', vi: 'Ngày mai 2h được không?' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['renting'],
        items: [
        { prompt: 'thuê → ___', answer: 'louer' },
        { prompt: 'tiền nhà → ___', answer: 'le loyer' },
        { prompt: 'đặt cọc → ___', answer: 'la caution' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['renting'],
        items: [
        { prompt: 'le bail', answer: 'hợp đồng' },
        { prompt: 'le propriétaire', answer: 'chủ nhà' },
        { prompt: 'les charges', answer: 'phí' },
        { prompt: 'meublé', answer: 'có sẵn đồ' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['renting'],
        items: [
        { prompt: 'Tôi tìm căn hộ cho thuê.', answer: 'Je cherche un appartement à louer.' },
        { prompt: 'Tiền nhà bao nhiêu?', answer: 'Quel est le loyer ?' },
        { prompt: 'Phí đã gồm chưa?', answer: 'Les charges sont-elles comprises ?' }
        ],
      }
    ],
  },
  {
    id: "french_complaints",
    category: "complaints" as any,
    title_vi: "Khiếu nại",
    title_en: "Complaints",
    sentences: [
      { en: 'Je ne suis pas satisfait.', vi: 'Tôi không hài lòng.', pronunciation_focus: ['satisfait'] },
      { en: 'Je voudrais être remboursé.', vi: 'Tôi muốn hoàn tiền.', pronunciation_focus: ['remboursé'] },
      { en: 'Ce n’est pas ce que j’ai commandé.', vi: 'Không phải thứ tôi đặt.', pronunciation_focus: ['commandé'] },
      { en: 'Pouvez-vous m’aider ?', vi: 'Giúp tôi được không?', pronunciation_focus: ['aider'] },
      { en: 'Il y a un problème.', vi: 'Có vấn đề.', pronunciation_focus: ['problème'] }
    ],
    cultural_notes_vi: "Khiếu nại Pháp: bắt đầu Bonjour, j’ai un petit problème. Viết thư hiệu quả hơn gọi.",
    tip_advice_vi: "Cấu trúc: J’ai constaté que... Voici la preuve... Je souhaiterais...",
    vocabulary: [
      { word: 'rembourser', en: 'refund', vi: 'hoàn tiền', pos: 'verb', pronunciation_vi: 'răm-bua-XÊ' },
      { word: 'échanger', en: 'exchange', vi: 'đổi hàng', pos: 'verb', pronunciation_vi: 'ê-săng-DÊ' },
      { word: 'la plainte', en: 'complaint', vi: 'khiếu nại', pos: 'noun (f)', pronunciation_vi: 'PLANG-T' },
      { word: 'le défaut', en: 'defect', vi: 'lỗi', pos: 'noun (m)', pronunciation_vi: 'đê-PHÔ' },
      { word: 'la garantie', en: 'warranty', vi: 'bảo hành', pos: 'noun (f)', pronunciation_vi: 'ga-răng-TI' },
      { word: 'mécontent', en: 'dissatisfied', vi: 'không hài lòng', pos: 'adjective', pronunciation_vi: 'mê-công-TĂN' },
      { word: 'le service client', en: 'customer service', vi: 'dịch vụ KH', pos: 'noun (m)', pronunciation_vi: 'xe-vít cli-ĂN' },
      { word: 'réclamer', en: 'claim', vi: 'yêu cầu', pos: 'verb', pronunciation_vi: 'rê-cla-MÊ' },
      { word: 'le geste commercial', en: 'goodwill', vi: 'thiện chí', pos: 'noun (m)', pronunciation_vi: 'dét co-me-xi-an' },
      { word: 'la preuve', en: 'proof', vi: 'bằng chứng', pos: 'noun (f)', pronunciation_vi: 'PRỚV' }
    ],
    dialogue: [
      { speaker: 'A', text: 'J’ai un problème avec cet article.', vi: 'Tôi có vấn đề với món này.' },
      { speaker: 'B', text: 'Je suis désolé. Avez-vous le ticket ?', vi: 'Xin lỗi. Có hoá đơn không?' },
      { speaker: 'A', text: 'Oui, voici. Je voudrais un échange.', vi: 'Đây. Tôi muốn đổi.' },
      { speaker: 'B', text: 'Bien sûr, je vous l’échange.', vi: 'Vâng, tôi đổi cho anh.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['complaints'],
        items: [
        { prompt: 'hoàn tiền → ___', answer: 'rembourser' },
        { prompt: 'đổi hàng → ___', answer: 'échanger' },
        { prompt: 'khiếu nại → ___', answer: 'la plainte' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['complaints'],
        items: [
        { prompt: 'le défaut', answer: 'lỗi' },
        { prompt: 'la garantie', answer: 'bảo hành' },
        { prompt: 'mécontent', answer: 'không hài lòng' },
        { prompt: 'le service client', answer: 'dịch vụ KH' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['complaints'],
        items: [
        { prompt: 'Tôi không hài lòng.', answer: 'Je ne suis pas satisfait.' },
        { prompt: 'Tôi muốn hoàn tiền.', answer: 'Je voudrais être remboursé.' },
        { prompt: 'Không phải thứ tôi đặt.', answer: 'Ce n’est pas ce que j’ai commandé.' }
        ],
      }
    ],
  },
  {
    id: "french_directions",
    category: "directions" as any,
    title_vi: "Chỉ đường",
    title_en: "Giving directions",
    sentences: [
      { en: 'Excusez-moi, comment aller à la gare ?', vi: 'Xin lỗi, đi ga tàu thế nào?', pronunciation_focus: ['excusez', 'gare'] },
      { en: 'Allez tout droit, puis à gauche.', vi: 'Đi thẳng rồi rẽ trái.', pronunciation_focus: ['droit', 'gauche'] },
      { en: 'C’est à cinq minutes à pied.', vi: 'Đi bộ 5 phút.', pronunciation_focus: ['cinq', 'pied'] },
      { en: 'Traversez le pont.', vi: 'Qua cầu.', pronunciation_focus: ['traversez'] },
      { en: 'C’est juste en face.', vi: 'Ngay đối diện.', pronunciation_focus: ['juste', 'face'] }
    ],
    cultural_notes_vi: "Dùng prenez hơn allez. Điểm mốc: à côté de la boulangerie.",
    tip_advice_vi: "Từ: tout droit, à gauche/droite, en face, au coin. Feu=đèn GT.",
    vocabulary: [
      { word: 'à droite', en: 'right', vi: 'phải', pos: 'adverb', pronunciation_vi: 'a ĐOÁT' },
      { word: 'à gauche', en: 'left', vi: 'trái', pos: 'adverb', pronunciation_vi: 'a GÔ-S' },
      { word: 'tout droit', en: 'straight', vi: 'thẳng', pos: 'adverb', pronunciation_vi: 'tu ĐROA' },
      { word: 'traverser', en: 'cross', vi: 'băng qua', pos: 'verb', pronunciation_vi: 'tra-ve-XÊ' },
      { word: 'le carrefour', en: 'intersection', vi: 'ngã tư', pos: 'noun (m)', pronunciation_vi: 'ca-rờ-PHU-R' },
      { word: 'le feu', en: 'traffic light', vi: 'đèn GT', pos: 'noun (m)', pronunciation_vi: 'PHƠ' },
      { word: 'le rond-point', en: 'roundabout', vi: 'bùng binh', pos: 'noun (m)', pronunciation_vi: 'rông-POANG' },
      { word: 'en face', en: 'opposite', vi: 'đối diện', pos: 'adverb', pronunciation_vi: 'ăng PHÁT' },
      { word: 'le trottoir', en: 'sidewalk', vi: 'vỉa hè', pos: 'noun (m)', pronunciation_vi: 'trô-TOA' },
      { word: 'le plan', en: 'map', vi: 'bản đồ', pos: 'noun (m)', pronunciation_vi: 'PLĂN' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Pardon, rue de Rivoli ?', vi: 'Xin lỗi, đường Rivoli?' },
      { speaker: 'B', text: 'Tout droit, troisième à droite.', vi: 'Thẳng, rẽ phải thứ ba.' },
      { speaker: 'A', text: 'C’est loin ?', vi: 'Xa không?' },
      { speaker: 'B', text: 'Dix minutes à pied.', vi: '10 phút đi bộ.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['directions'],
        items: [
        { prompt: 'phải → ___', answer: 'à droite' },
        { prompt: 'trái → ___', answer: 'à gauche' },
        { prompt: 'thẳng → ___', answer: 'tout droit' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['directions'],
        items: [
        { prompt: 'traverser', answer: 'băng qua' },
        { prompt: 'le carrefour', answer: 'ngã tư' },
        { prompt: 'le feu', answer: 'đèn GT' },
        { prompt: 'le rond-point', answer: 'bùng binh' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['directions'],
        items: [
        { prompt: 'Xin lỗi, đi ga tàu thế nào?', answer: 'Excusez-moi, comment aller à la gare ?' },
        { prompt: 'Đi thẳng rồi rẽ trái.', answer: 'Allez tout droit, puis à gauche.' },
        { prompt: 'Đi bộ 5 phút.', answer: 'C’est à cinq minutes à pied.' }
        ],
      }
    ],
  },
  {
    id: "french_news",
    category: "news" as any,
    title_vi: "Tin tức",
    title_en: "News",
    sentences: [
      { en: 'Tu as vu les infos ?', vi: 'Bạn xem tin chưa?', pronunciation_focus: ['infos'] },
      { en: 'Il va y avoir une grève.', vi: 'Sẽ có đình công.', pronunciation_focus: ['grève'] },
      { en: 'Que se passe-t-il dans le monde ?', vi: 'Chuyện gì đang xảy ra?', pronunciation_focus: ['passe', 'monde'] },
      { en: 'Les élections approchent.', vi: 'Bầu cử sắp tới.', pronunciation_focus: ['élections'] },
      { en: 'J’ai lu un article intéressant.', vi: 'Đọc bài hay.', pronunciation_focus: ['article'] }
    ],
    cultural_notes_vi: "Đọc báo: Le Monde, Le Figaro. Bản tin 20h. Thích tranh luận chính trị.",
    tip_advice_vi: "Từ: à la une, les gros titres. Học qua le fait divers.",
    vocabulary: [
      { word: 'l’actualité', en: 'current events', vi: 'thời sự', pos: 'noun (f)', pronunciation_vi: 'lăc-tuy-a-li-TÊ' },
      { word: 'le journal', en: 'newspaper', vi: 'báo', pos: 'noun (m)', pronunciation_vi: 'dua-NAN' },
      { word: 'les infos', en: 'news', vi: 'tin', pos: 'noun (f pl)', pronunciation_vi: 'danh-PHÔ' },
      { word: 'la une', en: 'front page', vi: 'trang nhất', pos: 'noun (f)', pronunciation_vi: 'UYN' },
      { word: 'le reportage', en: 'report', vi: 'phóng sự', pos: 'noun (m)', pronunciation_vi: 'rơ-po-TA-D' },
      { word: 'la grève', en: 'strike', vi: 'đình công', pos: 'noun (f)', pronunciation_vi: 'GRÉV' },
      { word: 'la manifestation', en: 'protest', vi: 'biểu tình', pos: 'noun (f)', pronunciation_vi: 'ma-ni-phét-ta-xi-ÔNG' },
      { word: 'le politique', en: 'politics', vi: 'chính trị', pos: 'noun (m)', pronunciation_vi: 'pô-li-TÍC' },
      { word: 'le sondage', en: 'poll', vi: 'thăm dò', pos: 'noun (m)', pronunciation_vi: 'xông-DA-D' },
      { word: 'mondial', en: 'worldwide', vi: 'toàn cầu', pos: 'adjective', pronunciation_vi: 'mông-ĐI-AN' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Tu as entendu ? Grève des transports.', vi: 'Bạn nghe chưa? Đình công GT.' },
      { speaker: 'B', text: 'Ah bon ? Pour quand ?', vi: 'Thế à? Khi nào?' },
      { speaker: 'A', text: 'Demain toute la journée.', vi: 'Ngày mai cả ngày.' },
      { speaker: 'B', text: 'Je prendrai le vélo.', vi: 'Tôi đi xe đạp.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['news'],
        items: [
        { prompt: 'thời sự → ___', answer: 'l’actualité' },
        { prompt: 'báo → ___', answer: 'le journal' },
        { prompt: 'tin → ___', answer: 'les infos' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['news'],
        items: [
        { prompt: 'la une', answer: 'trang nhất' },
        { prompt: 'le reportage', answer: 'phóng sự' },
        { prompt: 'la grève', answer: 'đình công' },
        { prompt: 'la manifestation', answer: 'biểu tình' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['news'],
        items: [
        { prompt: 'Bạn xem tin chưa?', answer: 'Tu as vu les infos ?' },
        { prompt: 'Sẽ có đình công.', answer: 'Il va y avoir une grève.' },
        { prompt: 'Chuyện gì đang xảy ra?', answer: 'Que se passe-t-il dans le monde ?' }
        ],
      }
    ],
  },
  {
    id: "french_culture",
    category: "culture" as any,
    title_vi: "Văn hoá Pháp",
    title_en: "French culture",
    sentences: [
      { en: 'On fait la bise pour se dire bonjour.', vi: 'Hôn má để chào.', pronunciation_focus: ['bise'] },
      { en: 'Le fromage avant le dessert.', vi: 'Phô mai trước tráng miệng.', pronunciation_focus: ['fromage'] },
      { en: 'Arriver à l’heure, c’est impoli.', vi: 'Đến đúng giờ là bất lịch sự.', pronunciation_focus: ['impoli'] },
      { en: 'Les Français adorent débattre.', vi: 'Người Pháp thích tranh luận.', pronunciation_focus: ['débattre'] },
      { en: 'Le dimanche, tout est fermé.', vi: 'Chủ Nhật đóng cửa.', pronunciation_focus: ['dimanche'] }
    ],
    cultural_notes_vi: "Văn hoá: đến muộn 15 phút, mang hoa/rượu, để tay trên bàn. La bise 2-4 cái.",
    tip_advice_vi: "NÊN: ẩm thực, du lịch. KHÔNG: lương, tôn giáo.",
    vocabulary: [
      { word: 'la bise', en: 'cheek kiss', vi: 'hôn má', pos: 'noun (f)', pronunciation_vi: 'BI-D' },
      { word: 'la politesse', en: 'politeness', vi: 'lịch sự', pos: 'noun (f)', pronunciation_vi: 'pô-li-TÉT-X' },
      { word: 'le savoir-vivre', en: 'etiquette', vi: 'phép tắc', pos: 'noun (m)', pronunciation_vi: 'xa-voa VÍ-VRỜ' },
      { word: 'le repas', en: 'meal', vi: 'bữa ăn', pos: 'noun (m)', pronunciation_vi: 'rơ-PA' },
      { word: 'la gastronomie', en: 'gastronomy', vi: 'ẩm thực', pos: 'noun (f)', pronunciation_vi: 'gát-trô-nô-MI' },
      { word: 'le pourboire', en: 'tip', vi: 'tiền boa', pos: 'noun (m)', pronunciation_vi: 'pua-BOA-R' },
      { word: 'la laïcité', en: 'secularism', vi: 'thế tục', pos: 'noun (f)', pronunciation_vi: 'la-i-xi-TÊ' },
      { word: 'le patrimoine', en: 'heritage', vi: 'di sản', pos: 'noun (m)', pronunciation_vi: 'pa-tri-MOAN' },
      { word: 'la grève', en: 'strike', vi: 'đình công', pos: 'noun (f)', pronunciation_vi: 'GRÉV' },
      { word: 'le terroir', en: 'local', vi: 'đặc sản', pos: 'noun (m)', pronunciation_vi: 'te-ROA' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Conseils pour un dîner chez des Français ?', vi: 'Lời khuyên ăn tối nhà người Pháp?' },
      { speaker: 'B', text: 'Arrive 10 min en retard, apporte des fleurs.', vi: 'Đến muộn 10 phút, mang hoa.' },
      { speaker: 'A', text: 'Et à table ?', vi: 'Trên bàn ăn?' },
      { speaker: 'B', text: 'Mains sur la table, dis bon appétit.', vi: 'Tay trên bàn, nói bon appétit.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['culture'],
        items: [
        { prompt: 'hôn má → ___', answer: 'la bise' },
        { prompt: 'lịch sự → ___', answer: 'la politesse' },
        { prompt: 'phép tắc → ___', answer: 'le savoir-vivre' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['culture'],
        items: [
        { prompt: 'le repas', answer: 'bữa ăn' },
        { prompt: 'la gastronomie', answer: 'ẩm thực' },
        { prompt: 'le pourboire', answer: 'tiền boa' },
        { prompt: 'la laïcité', answer: 'thế tục' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['culture'],
        items: [
        { prompt: 'Hôn má để chào.', answer: 'On fait la bise pour se dire bonjour.' },
        { prompt: 'Phô mai trước tráng miệng.', answer: 'Le fromage avant le dessert.' },
        { prompt: 'Đến đúng giờ là bất lịch sự.', answer: 'Arriver à l’heure, c’est impoli.' }
        ],
      }
    ],
  },
  {
    id: "french_interviews",
    category: "interviews" as any,
    title_vi: "Phỏng vấn",
    title_en: "Job interviews",
    sentences: [
      { en: 'Parlez-moi de votre parcours.', vi: 'Kể về quá trình của bạn.', pronunciation_focus: ['parcours'] },
      { en: 'Quelles sont vos qualités ?', vi: 'Phẩm chất của bạn?', pronunciation_focus: ['qualités'] },
      { en: 'Je suis très organisé.', vi: 'Tôi rất có tổ chức.', pronunciation_focus: ['organisé'] },
      { en: 'Pourquoi voulez-vous travailler ici ?', vi: 'Tại sao muốn làm ở đây?', pronunciation_focus: ['pourquoi'] },
      { en: 'Quel salaire attendez-vous ?', vi: 'Lương mong đợi?', pronunciation_focus: ['salaire'] }
    ],
    cultural_notes_vi: "Phỏng vấn Pháp: CV có ảnh, đúng giờ. 5 câu kinh điển.",
    tip_advice_vi: "Đừng nói xấu công ty cũ. Luôn hỏi 1-2 câu cuối.",
    vocabulary: [
      { word: 'l’entretien', en: 'interview', vi: 'phỏng vấn', pos: 'noun (m)', pronunciation_vi: 'lăng-trờ-TI-ĂNG' },
      { word: 'le CV', en: 'resume', vi: 'CV', pos: 'noun (m)', pronunciation_vi: 'xê-VÊ' },
      { word: 'l’expérience', en: 'experience', vi: 'kinh nghiệm', pos: 'noun (f)', pronunciation_vi: 'lét-xpê-ri-ĂNG-X' },
      { word: 'les compétences', en: 'skills', vi: 'kỹ năng', pos: 'noun (f pl)', pronunciation_vi: 'côm-pê-TĂNG-X' },
      { word: 'le recruteur', en: 'recruiter', vi: 'tuyển dụng', pos: 'noun (m)', pronunciation_vi: 'rơ-cruy-TƠR' },
      { word: 'la lettre de motivation', en: 'cover letter', vi: 'thư xin việc', pos: 'noun (f)', pronunciation_vi: 'mô-xi-va-xi-ÔNG' },
      { word: 'le stage', en: 'internship', vi: 'thực tập', pos: 'noun (m)', pronunciation_vi: 'XTA-D' },
      { word: 'embaucher', en: 'hire', vi: 'tuyển', pos: 'verb', pronunciation_vi: 'ăm-bô-SÊ' },
      { word: 'la période d’essai', en: 'probation', vi: 'thử việc', pos: 'noun (f)', pronunciation_vi: 'pê-ri-ốt đê-XÊ' },
      { word: 'le salaire', en: 'salary', vi: 'lương', pos: 'noun (m)', pronunciation_vi: 'xa-LE-R' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Phỏng vấn.', vi: 'Chào, tôi có câu hỏi về Phỏng vấn.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['interviews'],
        items: [
        { prompt: 'phỏng vấn → ___', answer: 'l’entretien' },
        { prompt: 'CV → ___', answer: 'le CV' },
        { prompt: 'kinh nghiệm → ___', answer: 'l’expérience' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['interviews'],
        items: [
        { prompt: 'les compétences', answer: 'kỹ năng' },
        { prompt: 'le recruteur', answer: 'tuyển dụng' },
        { prompt: 'la lettre de motivation', answer: 'thư xin việc' },
        { prompt: 'le stage', answer: 'thực tập' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['interviews'],
        items: [
        { prompt: 'Kể về quá trình của bạn.', answer: 'Parlez-moi de votre parcours.' },
        { prompt: 'Phẩm chất của bạn?', answer: 'Quelles sont vos qualités ?' },
        { prompt: 'Tôi rất có tổ chức.', answer: 'Je suis très organisé.' }
        ],
      }
    ],
  },
  {
    id: "french_meetings",
    category: "meetings" as any,
    title_vi: "Họp hành",
    title_en: "Meetings",
    sentences: [
      { en: 'La réunion commence à 10h.', vi: 'Họp lúc 10h.', pronunciation_focus: ['réunion'] },
      { en: 'Quel est l’ordre du jour ?', vi: 'Chương trình nghị sự?', pronunciation_focus: ['ordre'] },
      { en: 'Je suis d’accord.', vi: 'Tôi đồng ý.', pronunciation_focus: ['d’accord'] },
      { en: 'Pouvez-vous clarifier ?', vi: 'Làm rõ được không?', pronunciation_focus: ['clarifier'] },
      { en: 'Décidons avant vendredi.', vi: 'Quyết định trước thứ Sáu.', pronunciation_focus: ['vendredi'] }
    ],
    cultural_notes_vi: "Tour de table, thích tranh luận. Compte-rendu quan trọng.",
    tip_advice_vi: "Cụm: Je propose que..., Je suis pour/contre, Pour résumer.",
    vocabulary: [
      { word: 'la réunion', en: 'meeting', vi: 'cuộc họp', pos: 'noun (f)', pronunciation_vi: 'rê-uyn-I-ÔNG' },
      { word: 'l’ordre du jour', en: 'agenda', vi: 'chương trình', pos: 'noun (m)', pronunciation_vi: 'đuy DUA' },
      { word: 'le compte-rendu', en: 'minutes', vi: 'biên bản', pos: 'noun (m)', pronunciation_vi: 'công-tơ răn-ĐUY' },
      { word: 'proposer', en: 'propose', vi: 'đề xuất', pos: 'verb', pronunciation_vi: 'prô-pô-DÊ' },
      { word: 'approuver', en: 'approve', vi: 'phê duyệt', pos: 'verb', pronunciation_vi: 'a-pru-VÊ' },
      { word: 'le participant', en: 'participant', vi: 'tham gia', pos: 'noun (m)', pronunciation_vi: 'pa-ti-xi-PĂN' },
      { word: 'le point', en: 'item', vi: 'điểm', pos: 'noun (m)', pronunciation_vi: 'POANG' },
      { word: 'animer', en: 'facilitate', vi: 'điều phối', pos: 'verb', pronunciation_vi: 'a-ni-MÊ' },
      { word: 'le consensus', en: 'consensus', vi: 'đồng thuận', pos: 'noun (m)', pronunciation_vi: 'công-xăng-XUYT' },
      { word: 'le brainstorming', en: 'brainstorm', vi: 'động não', pos: 'noun (m)', pronunciation_vi: 'brên-xto-minh' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Họp hành.', vi: 'Chào, tôi có câu hỏi về Họp hành.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['meetings'],
        items: [
        { prompt: 'cuộc họp → ___', answer: 'la réunion' },
        { prompt: 'chương trình → ___', answer: 'l’ordre du jour' },
        { prompt: 'biên bản → ___', answer: 'le compte-rendu' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['meetings'],
        items: [
        { prompt: 'proposer', answer: 'đề xuất' },
        { prompt: 'approuver', answer: 'phê duyệt' },
        { prompt: 'le participant', answer: 'tham gia' },
        { prompt: 'le point', answer: 'điểm' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['meetings'],
        items: [
        { prompt: 'Họp lúc 10h.', answer: 'La réunion commence à 10h.' },
        { prompt: 'Chương trình nghị sự?', answer: 'Quel est l’ordre du jour ?' },
        { prompt: 'Tôi đồng ý.', answer: 'Je suis d’accord.' }
        ],
      }
    ],
  },
  {
    id: "french_presentations",
    category: "presentations" as any,
    title_vi: "Thuyết trình",
    title_en: "Presentations",
    sentences: [
      { en: 'Je vais vous présenter les résultats.', vi: 'Tôi trình bày kết quả.', pronunciation_focus: ['présenter'] },
      { en: 'Comme vous le voyez sur ce graphique...', vi: 'Như bạn thấy trên biểu đồ...', pronunciation_focus: ['voyez'] },
      { en: 'Pour conclure, perspectives positives.', vi: 'Kết luận: triển vọng tốt.', pronunciation_focus: ['conclure'] },
      { en: 'Avez-vous des questions ?', vi: 'Có câu hỏi gì?', pronunciation_focus: ['questions'] },
      { en: 'Merci de votre attention.', vi: 'Cảm ơn đã chú ý.', pronunciation_focus: ['merci'] }
    ],
    cultural_notes_vi: "Intro, développement, conclusion. Slide ít chữ, nhiều số liệu.",
    tip_advice_vi: "Mở: Bonjour, je vais vous parler de... Kết: Merci de votre attention.",
    vocabulary: [
      { word: 'la présentation', en: 'presentation', vi: 'thuyết trình', pos: 'noun (f)', pronunciation_vi: 'prê-dăng-ta-XI-ÔNG' },
      { word: 'le diaporama', en: 'slideshow', vi: 'slide', pos: 'noun (m)', pronunciation_vi: 'đi-a-pô-ra-MA' },
      { word: 'le graphique', en: 'chart', vi: 'biểu đồ', pos: 'noun (m)', pronunciation_vi: 'gra-PHÍC' },
      { word: 'les données', en: 'data', vi: 'dữ liệu', pos: 'noun (f pl)', pronunciation_vi: 'đô-NÊ' },
      { word: 'le public', en: 'audience', vi: 'khán giả', pos: 'noun (m)', pronunciation_vi: 'puy-BLÍC' },
      { word: 'introduire', en: 'introduce', vi: 'giới thiệu', pos: 'verb', pronunciation_vi: 'anh-trô-ĐUY-R' },
      { word: 'conclure', en: 'conclude', vi: 'kết luận', pos: 'verb', pronunciation_vi: 'công-CLUY-R' },
      { word: 'souligner', en: 'highlight', vi: 'nhấn mạnh', pos: 'verb', pronunciation_vi: 'xu-li-NHÊ' },
      { word: 'le résumé', en: 'summary', vi: 'tóm tắt', pos: 'noun (m)', pronunciation_vi: 'rê-duy-MÊ' },
      { word: 'le support visuel', en: 'visual aid', vi: 'trực quan', pos: 'noun (m)', pronunciation_vi: 'xuy-pô vi-duy-EN' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Thuyết trình.', vi: 'Chào, tôi có câu hỏi về Thuyết trình.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['presentations'],
        items: [
        { prompt: 'thuyết trình → ___', answer: 'la présentation' },
        { prompt: 'slide → ___', answer: 'le diaporama' },
        { prompt: 'biểu đồ → ___', answer: 'le graphique' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['presentations'],
        items: [
        { prompt: 'les données', answer: 'dữ liệu' },
        { prompt: 'le public', answer: 'khán giả' },
        { prompt: 'introduire', answer: 'giới thiệu' },
        { prompt: 'conclure', answer: 'kết luận' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['presentations'],
        items: [
        { prompt: 'Tôi trình bày kết quả.', answer: 'Je vais vous présenter les résultats.' },
        { prompt: 'Như bạn thấy trên biểu đồ...', answer: 'Comme vous le voyez sur ce graphique...' },
        { prompt: 'Kết luận: triển vọng tốt.', answer: 'Pour conclure, perspectives positives.' }
        ],
      }
    ],
  },
  {
    id: "french_negotiating",
    category: "negotiating" as any,
    title_vi: "Đàm phán",
    title_en: "Negotiating",
    sentences: [
      { en: 'C’est votre dernier prix ?', vi: 'Giá cuối cùng?', pronunciation_focus: ['dernier', 'prix'] },
      { en: 'On peut trouver un compromis.', vi: 'Ta tìm thoả hiệp.', pronunciation_focus: ['compromis'] },
      { en: 'Si vous commandez plus, je fais 10%.', vi: 'Đặt nhiều hơn, giảm 10%.', pronunciation_focus: ['commandez'] },
      { en: 'Marché conclu !', vi: 'Thoả thuận!', pronunciation_focus: ['marché'] },
      { en: 'Offre valable jusqu’à vendredi.', vi: 'Ưu đãi tới thứ Sáu.', pronunciation_focus: ['offre'] }
    ],
    cultural_notes_vi: "Gián tiếp, xây dựng quan hệ trước. Lịch sự, kiên nhẫn.",
    tip_advice_vi: "Cụm: Je comprends votre position, mais... Que diriez-vous de...?",
    vocabulary: [
      { word: 'négocier', en: 'negotiate', vi: 'đàm phán', pos: 'verb', pronunciation_vi: 'nê-gô-XI-Ê' },
      { word: 'le compromis', en: 'compromise', vi: 'thoả hiệp', pos: 'noun (m)', pronunciation_vi: 'công-prô-MI' },
      { word: 'la remise', en: 'discount', vi: 'giảm giá', pos: 'noun (f)', pronunciation_vi: 'rơ-MIZ' },
      { word: 'le contrat', en: 'contract', vi: 'hợp đồng', pos: 'noun (m)', pronunciation_vi: 'công-TRA' },
      { word: 'l’offre', en: 'offer', vi: 'đề nghị', pos: 'noun (f)', pronunciation_vi: 'LÓP-RỜ' },
      { word: 'la contre-proposition', en: 'counter-offer', vi: 'đối ứng', pos: 'noun (f)', pronunciation_vi: 'công-trờ-prô-pô-xi-ÔNG' },
      { word: 'le délai', en: 'deadline', vi: 'hạn chót', pos: 'noun (m)', pronunciation_vi: 'đê-LE' },
      { word: 'le budget', en: 'budget', vi: 'ngân sách', pos: 'noun (m)', pronunciation_vi: 'buy-DÊ' },
      { word: 'le fournisseur', en: 'supplier', vi: 'nhà cung cấp', pos: 'noun (m)', pronunciation_vi: 'phua-ni-XƠR' },
      { word: 'la condition', en: 'condition', vi: 'điều kiện', pos: 'noun (f)', pronunciation_vi: 'công-đi-XI-ÔNG' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Đàm phán.', vi: 'Chào, tôi có câu hỏi về Đàm phán.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['negotiating'],
        items: [
        { prompt: 'đàm phán → ___', answer: 'négocier' },
        { prompt: 'thoả hiệp → ___', answer: 'le compromis' },
        { prompt: 'giảm giá → ___', answer: 'la remise' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['negotiating'],
        items: [
        { prompt: 'le contrat', answer: 'hợp đồng' },
        { prompt: 'l’offre', answer: 'đề nghị' },
        { prompt: 'la contre-proposition', answer: 'đối ứng' },
        { prompt: 'le délai', answer: 'hạn chót' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['negotiating'],
        items: [
        { prompt: 'Giá cuối cùng?', answer: 'C’est votre dernier prix ?' },
        { prompt: 'Ta tìm thoả hiệp.', answer: 'On peut trouver un compromis.' },
        { prompt: 'Đặt nhiều hơn, giảm 10%.', answer: 'Si vous commandez plus, je fais 10%.' }
        ],
      }
    ],
  },
  {
    id: "french_social_media",
    category: "social_media" as any,
    title_vi: "Mạng xã hội",
    title_en: "Social media",
    sentences: [
      { en: 'Tu as vu ma publication ?', vi: 'Thấy bài tôi chưa?', pronunciation_focus: ['publication'] },
      { en: 'J’ai partagé l’article.', vi: 'Tôi chia sẻ bài.', pronunciation_focus: ['partagé'] },
      { en: 'C’est devenu viral.', vi: 'Lan truyền rồi.', pronunciation_focus: ['viral'] },
      { en: 'Je te suis, suis-moi !', vi: 'Theo dõi tôi đi!', pronunciation_focus: ['suis'] },
      { en: 'Attention aux fausses infos.', vi: 'Coi chừng tin giả.', pronunciation_focus: ['attention'] }
    ],
    cultural_notes_vi: "Người Pháp dùng nhiều, bảo vệ quyền riêng tư. Droit à l’oubli.",
    tip_advice_vi: "Từ: liker, partager, s’abonner, follower, influenceur.",
    vocabulary: [
      { word: 'le réseau social', en: 'social network', vi: 'mạng XH', pos: 'noun (m)', pronunciation_vi: 'rê-dô xô-XI-AN' },
      { word: 'partager', en: 'share', vi: 'chia sẻ', pos: 'verb', pronunciation_vi: 'pa-ta-DÊ' },
      { word: 'le like', en: 'like', vi: 'lượt thích', pos: 'noun (m)', pronunciation_vi: 'LAI-CỜ' },
      { word: 's’abonner', en: 'follow', vi: 'theo dõi', pos: 'verb', pronunciation_vi: 'xa-bô-NÊ' },
      { word: 'le commentaire', en: 'comment', vi: 'bình luận', pos: 'noun (m)', pronunciation_vi: 'cô-măng-TE-R' },
      { word: 'la publication', en: 'post', vi: 'bài đăng', pos: 'noun (f)', pronunciation_vi: 'puy-bli-ca-XI-ÔNG' },
      { word: 'viral', en: 'viral', vi: 'lan truyền', pos: 'adjective', pronunciation_vi: 'vi-RAN' },
      { word: 'le fil d’actualité', en: 'news feed', vi: 'bảng tin', pos: 'noun (m)', pronunciation_vi: 'phin' },
      { word: 'la story', en: 'story', vi: 'tin', pos: 'noun (f)', pronunciation_vi: 'XTÔ-RI' },
      { word: 'le mot-dièse', en: 'hashtag', vi: 'hashtag', pos: 'noun (m)', pronunciation_vi: 'mô đi-È-D' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Mạng xã hội.', vi: 'Chào, tôi có câu hỏi về Mạng xã hội.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['social_media'],
        items: [
        { prompt: 'mạng XH → ___', answer: 'le réseau social' },
        { prompt: 'chia sẻ → ___', answer: 'partager' },
        { prompt: 'lượt thích → ___', answer: 'le like' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['social_media'],
        items: [
        { prompt: 's’abonner', answer: 'theo dõi' },
        { prompt: 'le commentaire', answer: 'bình luận' },
        { prompt: 'la publication', answer: 'bài đăng' },
        { prompt: 'viral', answer: 'lan truyền' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['social_media'],
        items: [
        { prompt: 'Thấy bài tôi chưa?', answer: 'Tu as vu ma publication ?' },
        { prompt: 'Tôi chia sẻ bài.', answer: 'J’ai partagé l’article.' },
        { prompt: 'Lan truyền rồi.', answer: 'C’est devenu viral.' }
        ],
      }
    ],
  },
  {
    id: "french_environment",
    category: "environment" as any,
    title_vi: "Môi trường",
    title_en: "Environment",
    sentences: [
      { en: 'Il faut réduire le plastique.', vi: 'Phải giảm nhựa.', pronunciation_focus: ['réduire'] },
      { en: 'Le réchauffement est urgent.', vi: 'Nóng lên cấp bách.', pronunciation_focus: ['réchauffement'] },
      { en: 'Je trie mes déchets.', vi: 'Tôi phân loại rác.', pronunciation_focus: ['trie'] },
      { en: 'Protégeons la biodiversité.', vi: 'Bảo vệ đa dạng SH.', pronunciation_focus: ['protégeons'] },
      { en: 'Prenez les transports en commun.', vi: 'Đi phương tiện công cộng.', pronunciation_focus: ['transports'] }
    ],
    cultural_notes_vi: "Pháp tiên phong: Paris 2015. Tri sélectif. Bio, zéro déchet.",
    tip_advice_vi: "Động từ: protéger, réduire, recycler.",
    vocabulary: [
      { word: 'l’environnement', en: 'environment', vi: 'môi trường', pos: 'noun (m)', pronunciation_vi: 'lăng-vi-rôn-MĂN' },
      { word: 'la planète', en: 'planet', vi: 'hành tinh', pos: 'noun (f)', pronunciation_vi: 'pla-NÉT' },
      { word: 'le climat', en: 'climate', vi: 'khí hậu', pos: 'noun (m)', pronunciation_vi: 'cli-MA' },
      { word: 'recycler', en: 'recycle', vi: 'tái chế', pos: 'verb', pronunciation_vi: 'rơ-xi-CLÊ' },
      { word: 'la pollution', en: 'pollution', vi: 'ô nhiễm', pos: 'noun (f)', pronunciation_vi: 'pô-luy-xi-ÔNG' },
      { word: 'économiser', en: 'save', vi: 'tiết kiệm', pos: 'verb', pronunciation_vi: 'ê-cô-nô-mi-DÊ' },
      { word: 'le déchet', en: 'waste', vi: 'rác', pos: 'noun (m)', pronunciation_vi: 'đê-SÊ' },
      { word: 'renouvelable', en: 'renewable', vi: 'tái tạo', pos: 'adjective', pronunciation_vi: 'rơ-nu-vơ-LÁP-LƠ' },
      { word: 'l’énergie', en: 'energy', vi: 'năng lượng', pos: 'noun (f)', pronunciation_vi: 'lê-ne-DI' },
      { word: 'le réchauffement', en: 'warming', vi: 'nóng lên', pos: 'noun (m)', pronunciation_vi: 'rê-sô-phơ-MĂN' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Môi trường.', vi: 'Chào, tôi có câu hỏi về Môi trường.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['environment'],
        items: [
        { prompt: 'môi trường → ___', answer: 'l’environnement' },
        { prompt: 'hành tinh → ___', answer: 'la planète' },
        { prompt: 'khí hậu → ___', answer: 'le climat' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['environment'],
        items: [
        { prompt: 'recycler', answer: 'tái chế' },
        { prompt: 'la pollution', answer: 'ô nhiễm' },
        { prompt: 'économiser', answer: 'tiết kiệm' },
        { prompt: 'le déchet', answer: 'rác' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['environment'],
        items: [
        { prompt: 'Phải giảm nhựa.', answer: 'Il faut réduire le plastique.' },
        { prompt: 'Nóng lên cấp bách.', answer: 'Le réchauffement est urgent.' },
        { prompt: 'Tôi phân loại rác.', answer: 'Je trie mes déchets.' }
        ],
      }
    ],
  },
  {
    id: "french_opinions",
    category: "opinions" as any,
    title_vi: "Bày tỏ ý kiến",
    title_en: "Expressing opinions",
    sentences: [
      { en: 'À mon avis, c’est une bonne idée.', vi: 'Theo tôi ý hay.', pronunciation_focus: ['avis'] },
      { en: 'Je pense que tu as raison.', vi: 'Tôi nghĩ bạn đúng.', pronunciation_focus: ['pense'] },
      { en: 'Je ne suis pas d’accord.', vi: 'Tôi không đồng ý.', pronunciation_focus: ['d’accord'] },
      { en: 'Quel est ton point de vue ?', vi: 'Quan điểm của bạn?', pronunciation_focus: ['point', 'vue'] },
      { en: 'Je trouve ça intéressant.', vi: 'Tôi thấy hay.', pronunciation_focus: ['trouve'] }
    ],
    cultural_notes_vi: "À mon avis, je pense que, je trouve que. Subjonctif sau Je ne pense pas que.",
    tip_advice_vi: "Phân biệt indicatif/subjonctif. Selon moi trang trọng.",
    vocabulary: [
      { word: 'à mon avis', en: 'in my opinion', vi: 'theo tôi', pos: 'adverb', pronunciation_vi: 'a mô-na-VI' },
      { word: 'je pense que', en: 'I think', vi: 'tôi nghĩ', pos: 'phrase', pronunciation_vi: 'dơ păng-x kơ' },
      { word: 'selon moi', en: 'according to me', vi: 'theo tôi', pos: 'adverb', pronunciation_vi: 'xơ-lông MOA' },
      { word: 'le point de vue', en: 'viewpoint', vi: 'quan điểm', pos: 'noun (m)', pronunciation_vi: 'poang VUY' },
      { word: 'soutenir', en: 'support', vi: 'ủng hộ', pos: 'verb', pronunciation_vi: 'xu-tơ-NI-R' },
      { word: 'contredire', en: 'contradict', vi: 'phản bác', pos: 'verb', pronunciation_vi: 'công-trờ-ĐI-R' },
      { word: 'le débat', en: 'debate', vi: 'tranh luận', pos: 'noun (m)', pronunciation_vi: 'đê-BA' },
      { word: 'l’argument', en: 'argument', vi: 'lý lẽ', pos: 'noun (m)', pronunciation_vi: 'la-ghuy-MĂN' },
      { word: 'convaincre', en: 'convince', vi: 'thuyết phục', pos: 'verb', pronunciation_vi: 'công-VANG-CR' },
      { word: 'le subjonctif', en: 'subjunctive', vi: 'giả định', pos: 'noun (m)', pronunciation_vi: 'xúp-dông-TÍP' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Bày tỏ ý kiến.', vi: 'Chào, tôi có câu hỏi về Bày tỏ ý kiến.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['opinions'],
        items: [
        { prompt: 'theo tôi → ___', answer: 'à mon avis' },
        { prompt: 'tôi nghĩ → ___', answer: 'je pense que' },
        { prompt: 'theo tôi → ___', answer: 'selon moi' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['opinions'],
        items: [
        { prompt: 'le point de vue', answer: 'quan điểm' },
        { prompt: 'soutenir', answer: 'ủng hộ' },
        { prompt: 'contredire', answer: 'phản bác' },
        { prompt: 'le débat', answer: 'tranh luận' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['opinions'],
        items: [
        { prompt: 'Theo tôi ý hay.', answer: 'À mon avis, c’est une bonne idée.' },
        { prompt: 'Tôi nghĩ bạn đúng.', answer: 'Je pense que tu as raison.' },
        { prompt: 'Tôi không đồng ý.', answer: 'Je ne suis pas d’accord.' }
        ],
      }
    ],
  },
  {
    id: "french_suggestions",
    category: "suggestions" as any,
    title_vi: "Đề xuất",
    title_en: "Suggestions",
    sentences: [
      { en: 'Et si on allait au resto ?', vi: 'Đi ăn nhé?', pronunciation_focus: ['allait'] },
      { en: 'On pourrait partir en week-end.', vi: 'Đi cuối tuần.', pronunciation_focus: ['pourrait'] },
      { en: 'Pourquoi ne pas essayer ?', vi: 'Sao không thử?', pronunciation_focus: ['essayer'] },
      { en: 'Je te conseille ce film.', vi: 'Tôi khuyên phim này.', pronunciation_focus: ['conseille'] },
      { en: 'Tu devrais te reposer.', vi: 'Bạn nên nghỉ.', pronunciation_focus: ['devrais'] }
    ],
    cultural_notes_vi: "Et si on..., On pourrait..., Pourquoi ne pas...? Conditionnel lịch sự.",
    tip_advice_vi: "Je te conseille de..., Tu devrais...",
    vocabulary: [
      { word: 'suggérer', en: 'suggest', vi: 'gợi ý', pos: 'verb', pronunciation_vi: 'xuy-giê-RÊ' },
      { word: 'la proposition', en: 'proposal', vi: 'đề xuất', pos: 'noun (f)', pronunciation_vi: 'prô-pô-di-xi-ÔNG' },
      { word: 'conseiller', en: 'advise', vi: 'khuyên', pos: 'verb', pronunciation_vi: 'công-xê-YÊ' },
      { word: 'recommander', en: 'recommend', vi: 'giới thiệu', pos: 'verb', pronunciation_vi: 'rơ-co-măng-ĐÊ' },
      { word: 'et si on', en: 'what if', vi: 'thế còn', pos: 'phrase', pronunciation_vi: 'ê xi ông' },
      { word: 'pourquoi ne pas', en: 'why not', vi: 'tại sao không', pos: 'phrase', pronunciation_vi: 'pua-coa nờ pa' },
      { word: 'on pourrait', en: 'we could', vi: 'ta có thể', pos: 'phrase', pronunciation_vi: 'ông pu-re' },
      { word: 'l’alternative', en: 'alternative', vi: 'lựa chọn', pos: 'noun (f)', pronunciation_vi: 'lan-te-na-TI-V' },
      { word: 'la solution', en: 'solution', vi: 'giải pháp', pos: 'noun (f)', pronunciation_vi: 'xô-luy-xi-ÔNG' },
      { word: 'envisager', en: 'envision', vi: 'dự tính', pos: 'verb', pronunciation_vi: 'ăng-vi-da-DÊ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Đề xuất.', vi: 'Chào, tôi có câu hỏi về Đề xuất.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['suggestions'],
        items: [
        { prompt: 'gợi ý → ___', answer: 'suggérer' },
        { prompt: 'đề xuất → ___', answer: 'la proposition' },
        { prompt: 'khuyên → ___', answer: 'conseiller' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['suggestions'],
        items: [
        { prompt: 'recommander', answer: 'giới thiệu' },
        { prompt: 'et si on', answer: 'thế còn' },
        { prompt: 'pourquoi ne pas', answer: 'tại sao không' },
        { prompt: 'on pourrait', answer: 'ta có thể' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['suggestions'],
        items: [
        { prompt: 'Đi ăn nhé?', answer: 'Et si on allait au resto ?' },
        { prompt: 'Đi cuối tuần.', answer: 'On pourrait partir en week-end.' },
        { prompt: 'Sao không thử?', answer: 'Pourquoi ne pas essayer ?' }
        ],
      }
    ],
  },
  {
    id: "french_apologies",
    category: "apologies" as any,
    title_vi: "Xin lỗi",
    title_en: "Apologies",
    sentences: [
      { en: 'Pardon, je suis en retard.', vi: 'Xin lỗi tôi muộn.', pronunciation_focus: ['pardon'] },
      { en: 'Excusez-moi de vous déranger.', vi: 'Xin lỗi làm phiền.', pronunciation_focus: ['excusez'] },
      { en: 'Je suis vraiment désolé.', vi: 'Thực sự xin lỗi.', pronunciation_focus: ['désolé'] },
      { en: 'Ce n’est pas grave.', vi: 'Không sao.', pronunciation_focus: ['grave'] },
      { en: 'Je ne l’ai pas fait exprès.', vi: 'Không cố ý.', pronunciation_focus: ['exprès'] }
    ],
    cultural_notes_vi: "Pardon, Excusez-moi, Je suis désolé(e). Ce n’est pas grave.",
    tip_advice_vi: "Xin lỗi quá nhiều = yếu. Kèm giải thích ngắn.",
    vocabulary: [
      { word: 'pardon', en: 'sorry', vi: 'xin lỗi', pos: 'interjection', pronunciation_vi: 'pa-ĐÔNG' },
      { word: 'excusez-moi', en: 'excuse me', vi: 'xin thứ lỗi', pos: 'phrase', pronunciation_vi: 'ét-xku-dê MOA' },
      { word: 'désolé(e)', en: 'sorry', vi: 'rất tiếc', pos: 'adjective', pronunciation_vi: 'đê-dô-LÊ' },
      { word: 'regretter', en: 'regret', vi: 'hối tiếc', pos: 'verb', pronunciation_vi: 'rơ-grê-TÊ' },
      { word: 'pardonner', en: 'forgive', vi: 'tha thứ', pos: 'verb', pronunciation_vi: 'pa-đô-NÊ' },
      { word: 'ce n’est pas grave', en: 'no problem', vi: 'không sao', pos: 'phrase', pronunciation_vi: 'xơ ne pa GRÁV' },
      { word: 'la faute', en: 'fault', vi: 'lỗi', pos: 'noun (f)', pronunciation_vi: 'PHÔT' },
      { word: 'réparer', en: 'make up', vi: 'sửa', pos: 'verb', pronunciation_vi: 'rê-pa-RÊ' },
      { word: 'le malentendu', en: 'misunderstanding', vi: 'hiểu lầm', pos: 'noun (m)', pronunciation_vi: 'man-lăng-tăn-ĐUY' },
      { word: 'les excuses', en: 'apologies', vi: 'lời xin lỗi', pos: 'noun (f pl)', pronunciation_vi: 'dét-XCUYZ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Xin lỗi.', vi: 'Chào, tôi có câu hỏi về Xin lỗi.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['apologies'],
        items: [
        { prompt: 'xin lỗi → ___', answer: 'pardon' },
        { prompt: 'xin thứ lỗi → ___', answer: 'excusez-moi' },
        { prompt: 'rất tiếc → ___', answer: 'désolé(e)' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['apologies'],
        items: [
        { prompt: 'regretter', answer: 'hối tiếc' },
        { prompt: 'pardonner', answer: 'tha thứ' },
        { prompt: 'ce n’est pas grave', answer: 'không sao' },
        { prompt: 'la faute', answer: 'lỗi' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['apologies'],
        items: [
        { prompt: 'Xin lỗi tôi muộn.', answer: 'Pardon, je suis en retard.' },
        { prompt: 'Xin lỗi làm phiền.', answer: 'Excusez-moi de vous déranger.' },
        { prompt: 'Thực sự xin lỗi.', answer: 'Je suis vraiment désolé.' }
        ],
      }
    ],
  },
  {
    id: "french_advice",
    category: "advice" as any,
    title_vi: "Lời khuyên",
    title_en: "Giving advice",
    sentences: [
      { en: 'Tu devrais voir un médecin.', vi: 'Nên đi bác sĩ.', pronunciation_focus: ['devrais'] },
      { en: 'Il faudrait économiser plus.', vi: 'Cần tiết kiệm hơn.', pronunciation_focus: ['faudrait'] },
      { en: 'Si j’étais toi, j’accepterais.', vi: 'Nếu là bạn, tôi nhận.', pronunciation_focus: ['étais'] },
      { en: 'Fais attention !', vi: 'Coi chừng!', pronunciation_focus: ['attention'] },
      { en: 'Prends soin de toi.', vi: 'Bảo trọng.', pronunciation_focus: ['soin'] }
    ],
    cultural_notes_vi: "Tu devrais, Il faudrait, Si j’étais toi. Đừng dùng Tu dois.",
    tip_advice_vi: "Conditionnel an toàn hơn impératif.",
    vocabulary: [
      { word: 'le conseil', en: 'advice', vi: 'lời khuyên', pos: 'noun (m)', pronunciation_vi: 'công-XÂY' },
      { word: 'tu devrais', en: 'you should', vi: 'bạn nên', pos: 'phrase', pronunciation_vi: 'tuy đơ-VRE' },
      { word: 'il faudrait', en: 'one should', vi: 'cần phải', pos: 'phrase', pronunciation_vi: 'in phô-ĐRE' },
      { word: 'si j’étais toi', en: 'if I were you', vi: 'nếu là bạn', pos: 'phrase', pronunciation_vi: 'xi dê-te TOA' },
      { word: 'faire attention', en: 'be careful', vi: 'cẩn thận', pos: 'phrase', pronunciation_vi: 'phe-r a-tăng-XI-ÔNG' },
      { word: 'prendre soin', en: 'take care', vi: 'chăm sóc', pos: 'phrase', pronunciation_vi: 'prăng-đrơ SOANG' },
      { word: 'prévenir', en: 'warn', vi: 'cảnh báo', pos: 'verb', pronunciation_vi: 'prê-vơ-NI-R' },
      { word: 'la prudence', en: 'caution', vi: 'thận trọng', pos: 'noun (f)', pronunciation_vi: 'pruy-ĐĂNG-X' },
      { word: 'l’avertissement', en: 'warning', vi: 'cảnh báo', pos: 'noun (m)', pronunciation_vi: 'la-ve-ti-xơ-MĂN' },
      { word: 'la mise en garde', en: 'caution', vi: 'lưu ý', pos: 'noun (f)', pronunciation_vi: 'mi-dơ GA-Đ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Lời khuyên.', vi: 'Chào, tôi có câu hỏi về Lời khuyên.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['advice'],
        items: [
        { prompt: 'lời khuyên → ___', answer: 'le conseil' },
        { prompt: 'bạn nên → ___', answer: 'tu devrais' },
        { prompt: 'cần phải → ___', answer: 'il faudrait' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['advice'],
        items: [
        { prompt: 'si j’étais toi', answer: 'nếu là bạn' },
        { prompt: 'faire attention', answer: 'cẩn thận' },
        { prompt: 'prendre soin', answer: 'chăm sóc' },
        { prompt: 'prévenir', answer: 'cảnh báo' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['advice'],
        items: [
        { prompt: 'Nên đi bác sĩ.', answer: 'Tu devrais voir un médecin.' },
        { prompt: 'Cần tiết kiệm hơn.', answer: 'Il faudrait économiser plus.' },
        { prompt: 'Nếu là bạn, tôi nhận.', answer: 'Si j’étais toi, j’accepterais.' }
        ],
      }
    ],
  },
  {
    id: "french_experiences",
    category: "experiences" as any,
    title_vi: "Trải nghiệm",
    title_en: "Sharing experiences",
    sentences: [
      { en: 'J’ai déjà visité le Japon.', vi: 'Tôi đã thăm Nhật.', pronunciation_focus: ['déjà'] },
      { en: 'Je n’ai jamais mangé ça.', vi: 'Chưa bao giờ ăn.', pronunciation_focus: ['jamais'] },
      { en: 'C’était inoubliable.', vi: 'Khó quên.', pronunciation_focus: ['inoubliable'] },
      { en: 'Un jour, j’ai rencontré une star.', vi: 'Gặp ngôi sao.', pronunciation_focus: ['rencontré'] },
      { en: 'Raconte-moi ton voyage !', vi: 'Kể chuyến đi đi!', pronunciation_focus: ['raconte'] }
    ],
    cultural_notes_vi: "Passé composé + imparfait. Il faisait beau quand je suis arrivé.",
    tip_advice_vi: "Kể chuyện: Un jour..., C’était..., Tout à coup...",
    vocabulary: [
      { word: 'l’expérience', en: 'experience', vi: 'trải nghiệm', pos: 'noun (f)', pronunciation_vi: 'lét-xpê-ri-ĂNG-X' },
      { word: 'le souvenir', en: 'memory', vi: 'kỷ niệm', pos: 'noun (m)', pronunciation_vi: 'xu-vơ-NI-R' },
      { word: 'raconter', en: 'tell', vi: 'kể', pos: 'verb', pronunciation_vi: 'ra-công-TÊ' },
      { word: 'déjà', en: 'already', vi: 'đã từng', pos: 'adverb', pronunciation_vi: 'đê-DA' },
      { word: 'jamais', en: 'never', vi: 'chưa bao giờ', pos: 'adverb', pronunciation_vi: 'da-ME' },
      { word: 'une fois', en: 'once', vi: 'một lần', pos: 'phrase', pronunciation_vi: 'uyn PHOA' },
      { word: 'inoubliable', en: 'unforgettable', vi: 'khó quên', pos: 'adjective', pronunciation_vi: 'i-nu-bli-ÁP-LƠ' },
      { word: 'le voyage', en: 'trip', vi: 'chuyến đi', pos: 'noun (m)', pronunciation_vi: 'voa-YA-D' },
      { word: 'découvrir', en: 'discover', vi: 'khám phá', pos: 'verb', pronunciation_vi: 'đê-cu-VRI-R' },
      { word: 'l’aventure', en: 'adventure', vi: 'phiêu lưu', pos: 'noun (f)', pronunciation_vi: 'la-văng-TUY-R' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Trải nghiệm.', vi: 'Chào, tôi có câu hỏi về Trải nghiệm.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['experiences'],
        items: [
        { prompt: 'trải nghiệm → ___', answer: 'l’expérience' },
        { prompt: 'kỷ niệm → ___', answer: 'le souvenir' },
        { prompt: 'kể → ___', answer: 'raconter' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['experiences'],
        items: [
        { prompt: 'déjà', answer: 'đã từng' },
        { prompt: 'jamais', answer: 'chưa bao giờ' },
        { prompt: 'une fois', answer: 'một lần' },
        { prompt: 'inoubliable', answer: 'khó quên' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['experiences'],
        items: [
        { prompt: 'Tôi đã thăm Nhật.', answer: 'J’ai déjà visité le Japon.' },
        { prompt: 'Chưa bao giờ ăn.', answer: 'Je n’ai jamais mangé ça.' },
        { prompt: 'Khó quên.', answer: 'C’était inoubliable.' }
        ],
      }
    ],
  },
  {
    id: "french_comparisons",
    category: "comparisons" as any,
    title_vi: "So sánh",
    title_en: "Comparisons",
    sentences: [
      { en: 'Paris est plus grand que Lyon.', vi: 'Paris lớn hơn.', pronunciation_focus: ['plus', 'grand'] },
      { en: 'Ce resto est moins cher.', vi: 'Nhà hàng rẻ hơn.', pronunciation_focus: ['moins'] },
      { en: 'Il est aussi intelligent que toi.', vi: 'Thông minh bằng bạn.', pronunciation_focus: ['aussi'] },
      { en: 'C’est le meilleur film.', vi: 'Phim hay nhất.', pronunciation_focus: ['meilleur'] },
      { en: 'Ma soeur est plus jeune.', vi: 'Em gái trẻ hơn.', pronunciation_focus: ['jeune'] }
    ],
    cultural_notes_vi: "Plus... que, moins... que, aussi... que. Bon→meilleur, bien→mieux.",
    tip_advice_vi: "De plus en plus, de moins en moins. Autant que.",
    vocabulary: [
      { word: 'plus... que', en: 'more than', vi: 'hơn', pos: 'phrase', pronunciation_vi: 'pluy... kơ' },
      { word: 'moins... que', en: 'less than', vi: 'kém', pos: 'phrase', pronunciation_vi: 'moang... kơ' },
      { word: 'aussi... que', en: 'as... as', vi: 'bằng', pos: 'phrase', pronunciation_vi: 'ô-xi... kơ' },
      { word: 'meilleur(e)', en: 'better', vi: 'tốt hơn', pos: 'adjective', pronunciation_vi: 'mê-YƠR' },
      { word: 'pire', en: 'worse', vi: 'tệ hơn', pos: 'adjective', pronunciation_vi: 'PI-R' },
      { word: 'le meilleur', en: 'the best', vi: 'tốt nhất', pos: 'adjective', pronunciation_vi: 'mê-YƠR' },
      { word: 'autant que', en: 'as much as', vi: 'nhiều bằng', pos: 'adverb', pronunciation_vi: 'ô-tăng kơ' },
      { word: 'de plus en plus', en: 'more and more', vi: 'ngày càng', pos: 'phrase', pronunciation_vi: 'pluy' },
      { word: 'la différence', en: 'difference', vi: 'khác biệt', pos: 'noun (f)', pronunciation_vi: 'đi-phê-RĂNG-X' },
      { word: 'semblable', en: 'similar', vi: 'tương tự', pos: 'adjective', pronunciation_vi: 'săng-BLÁP-LƠ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur So sánh.', vi: 'Chào, tôi có câu hỏi về So sánh.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['comparisons'],
        items: [
        { prompt: 'hơn → ___', answer: 'plus... que' },
        { prompt: 'kém → ___', answer: 'moins... que' },
        { prompt: 'bằng → ___', answer: 'aussi... que' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['comparisons'],
        items: [
        { prompt: 'meilleur(e)', answer: 'tốt hơn' },
        { prompt: 'pire', answer: 'tệ hơn' },
        { prompt: 'le meilleur', answer: 'tốt nhất' },
        { prompt: 'autant que', answer: 'nhiều bằng' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['comparisons'],
        items: [
        { prompt: 'Paris lớn hơn.', answer: 'Paris est plus grand que Lyon.' },
        { prompt: 'Nhà hàng rẻ hơn.', answer: 'Ce resto est moins cher.' },
        { prompt: 'Thông minh bằng bạn.', answer: 'Il est aussi intelligent que toi.' }
        ],
      }
    ],
  },
  {
    id: "french_hypotheticals",
    category: "hypotheticals" as any,
    title_vi: "Giả định",
    title_en: "Hypotheticals",
    sentences: [
      { en: 'Si j’avais de l’argent, je voyagerais.', vi: 'Nếu có tiền, tôi đi.', pronunciation_focus: ['avais', 'voyagerais'] },
      { en: 'Si tu étudiais plus, tu réussirais.', vi: 'Học hơn sẽ đỗ.', pronunciation_focus: ['étudiais'] },
      { en: 'Si je gagnais au loto...', vi: 'Nếu trúng số...', pronunciation_focus: ['gagnais'] },
      { en: 'Que ferais-tu à ma place ?', vi: 'Bạn làm gì?', pronunciation_focus: ['ferais'] },
      { en: 'J’aimerais tout visiter.', vi: 'Muốn thăm tất cả.', pronunciation_focus: ['aimerais'] }
    ],
    cultural_notes_vi: "Si + imparfait → conditionnel. Cấu trúc B2 quan trọng nhất.",
    tip_advice_vi: "Luyện: Si j’avais..., je voudrais...",
    vocabulary: [
      { word: 'si', en: 'if', vi: 'nếu', pos: 'conjunction', pronunciation_vi: 'XI' },
      { word: 'l’hypothèse', en: 'hypothesis', vi: 'giả định', pos: 'noun (f)', pronunciation_vi: 'li-pô-TÉ-Z' },
      { word: 'imaginer', en: 'imagine', vi: 'tưởng tượng', pos: 'verb', pronunciation_vi: 'i-ma-di-NÊ' },
      { word: 'le conditionnel', en: 'conditional', vi: 'điều kiện', pos: 'noun (m)', pronunciation_vi: 'công-đi-xi-ô-NEN' },
      { word: 'supposer', en: 'suppose', vi: 'giả sử', pos: 'verb', pronunciation_vi: 'xuy-pô-DÊ' },
      { word: 'dans ce cas', en: 'in that case', vi: 'trường hợp đó', pos: 'phrase', pronunciation_vi: 'đăng ca' },
      { word: 'éventuellement', en: 'possibly', vi: 'có thể', pos: 'adverb', pronunciation_vi: 'ê-văng-tuy-en-MĂN' },
      { word: 'au cas où', en: 'in case', vi: 'phòng khi', pos: 'phrase', pronunciation_vi: 'ô ca U' },
      { word: 'probable', en: 'probable', vi: 'có khả năng', pos: 'adjective', pronunciation_vi: 'prô-BÁP-LƠ' },
      { word: 'improbable', en: 'unlikely', vi: 'khó', pos: 'adjective', pronunciation_vi: 'amh-prô-BÁP-LƠ' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Giả định.', vi: 'Chào, tôi có câu hỏi về Giả định.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['hypotheticals'],
        items: [
        { prompt: 'nếu → ___', answer: 'si' },
        { prompt: 'giả định → ___', answer: 'l’hypothèse' },
        { prompt: 'tưởng tượng → ___', answer: 'imaginer' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['hypotheticals'],
        items: [
        { prompt: 'le conditionnel', answer: 'điều kiện' },
        { prompt: 'supposer', answer: 'giả sử' },
        { prompt: 'dans ce cas', answer: 'trường hợp đó' },
        { prompt: 'éventuellement', answer: 'có thể' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['hypotheticals'],
        items: [
        { prompt: 'Nếu có tiền, tôi đi.', answer: 'Si j’avais de l’argent, je voyagerais.' },
        { prompt: 'Học hơn sẽ đỗ.', answer: 'Si tu étudiais plus, tu réussirais.' },
        { prompt: 'Nếu trúng số...', answer: 'Si je gagnais au loto...' }
        ],
      }
    ],
  },
  {
    id: "french_reported_speech",
    category: "reported_speech" as any,
    title_vi: "Câu tường thuật",
    title_en: "Reported speech",
    sentences: [
      { en: 'Il a dit qu’il était fatigué.', vi: 'Anh ấy nói mệt.', pronunciation_focus: ['dit', 'était'] },
      { en: 'Elle m’a demandé si je venais.', vi: 'Hỏi tôi đến không.', pronunciation_focus: ['demandé'] },
      { en: 'Il a annoncé qu’il partirait.', vi: 'Thông báo sẽ đi.', pronunciation_focus: ['partirait'] },
      { en: 'Elle a répondu qu’elle ne savait pas.', vi: 'Trả lời không biết.', pronunciation_focus: ['savait'] },
      { en: 'Il m’a dit de ne pas m’inquiéter.', vi: 'Bảo đừng lo.', pronunciation_focus: ['inquiéter'] }
    ],
    cultural_notes_vi: "Lùi thì: présent→imparfait. Que bắt buộc. Demain→le lendemain.",
    tip_advice_vi: "Je→il/elle, mon→son. Hier→la veille.",
    vocabulary: [
      { word: 'rapporter', en: 'report', vi: 'tường thuật', pos: 'verb', pronunciation_vi: 'ra-po-TÊ' },
      { word: 'le discours indirect', en: 'indirect speech', vi: 'gián tiếp', pos: 'noun (m)', pronunciation_vi: 'đi-xcua anh-đi-RÉC' },
      { word: 'déclarer', en: 'declare', vi: 'tuyên bố', pos: 'verb', pronunciation_vi: 'đê-cla-RÊ' },
      { word: 'affirmer', en: 'affirm', vi: 'khẳng định', pos: 'verb', pronunciation_vi: 'a-phia-MÊ' },
      { word: 'nier', en: 'deny', vi: 'phủ nhận', pos: 'verb', pronunciation_vi: 'ni-Ê' },
      { word: 'le lendemain', en: 'next day', vi: 'hôm sau', pos: 'noun (m)', pronunciation_vi: 'lăng-đờ-MANG' },
      { word: 'la veille', en: 'day before', vi: 'hôm trước', pos: 'noun (f)', pronunciation_vi: 'la VÂY' },
      { word: 'le discours direct', en: 'direct speech', vi: 'trực tiếp', pos: 'noun (m)', pronunciation_vi: 'đi-xcua đi-RÉC' },
      { word: 'la citation', en: 'quote', vi: 'trích dẫn', pos: 'noun (f)', pronunciation_vi: 'xi-ta-xi-ÔNG' },
      { word: 'la concordance', en: 'agreement', vi: 'phù hợp thì', pos: 'noun (f)', pronunciation_vi: 'công-co-ĐĂNG-X' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Câu tường thuật.', vi: 'Chào, tôi có câu hỏi về Câu tường thuật.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['reported_speech'],
        items: [
        { prompt: 'tường thuật → ___', answer: 'rapporter' },
        { prompt: 'gián tiếp → ___', answer: 'le discours indirect' },
        { prompt: 'tuyên bố → ___', answer: 'déclarer' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['reported_speech'],
        items: [
        { prompt: 'affirmer', answer: 'khẳng định' },
        { prompt: 'nier', answer: 'phủ nhận' },
        { prompt: 'le lendemain', answer: 'hôm sau' },
        { prompt: 'la veille', answer: 'hôm trước' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['reported_speech'],
        items: [
        { prompt: 'Anh ấy nói mệt.', answer: 'Il a dit qu’il était fatigué.' },
        { prompt: 'Hỏi tôi đến không.', answer: 'Elle m’a demandé si je venais.' },
        { prompt: 'Thông báo sẽ đi.', answer: 'Il a annoncé qu’il partirait.' }
        ],
      }
    ],
  },
  {
    id: "french_passive_voice",
    category: "passive_voice" as any,
    title_vi: "Thể bị động",
    title_en: "Passive voice",
    sentences: [
      { en: 'Cette maison a été construite en 1900.', vi: 'Nhà xây 1900.', pronunciation_focus: ['construite'] },
      { en: 'Le français est parlé dans 29 pays.', vi: 'Tiếng Pháp nói 29 nước.', pronunciation_focus: ['parlé'] },
      { en: 'Le gâteau a été mangé.', vi: 'Bánh bị ăn.', pronunciation_focus: ['mangé'] },
      { en: 'Les résultats seront publiés.', vi: 'Kết quả công bố.', pronunciation_focus: ['publiés'] },
      { en: 'Écrit par un inconnu.', vi: 'Viết bởi người lạ.', pronunciation_focus: ['écrit'] }
    ],
    cultural_notes_vi: "être + participe passé + par. Người Pháp thích dùng on.",
    tip_advice_vi: "On a construit thay vì a été construite.",
    vocabulary: [
      { word: 'la voix passive', en: 'passive', vi: 'bị động', pos: 'noun (f)', pronunciation_vi: 'voa pa-XÍV' },
      { word: 'être + participe', en: 'be + pp', vi: 'được/bị', pos: 'phrase', pronunciation_vi: 'é-trờ pa-ti-XÍP' },
      { word: 'par', en: 'by', vi: 'bởi', pos: 'preposition', pronunciation_vi: 'PA' },
      { word: 'construire', en: 'build', vi: 'xây dựng', pos: 'verb', pronunciation_vi: 'công-xtruy-R' },
      { word: 'le sujet', en: 'subject', vi: 'chủ ngữ', pos: 'noun (m)', pronunciation_vi: 'xuy-DÊ' },
      { word: 'l’agent', en: 'agent', vi: 'tác nhân', pos: 'noun (m)', pronunciation_vi: 'la-DĂN' },
      { word: 'actif', en: 'active', vi: 'chủ động', pos: 'adjective', pronunciation_vi: 'ăc-TÍP' },
      { word: 'transformer', en: 'transform', vi: 'chuyển đổi', pos: 'verb', pronunciation_vi: 'trăng-xpho-MÊ' },
      { word: 'le complément', en: 'object', vi: 'tân ngữ', pos: 'noun (m)', pronunciation_vi: 'công-plê-MĂN' },
      { word: 'la tournure', en: 'structure', vi: 'cấu trúc', pos: 'noun (f)', pronunciation_vi: 'tua-NUY-R' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Thể bị động.', vi: 'Chào, tôi có câu hỏi về Thể bị động.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['passive_voice'],
        items: [
        { prompt: 'bị động → ___', answer: 'la voix passive' },
        { prompt: 'được/bị → ___', answer: 'être + participe' },
        { prompt: 'bởi → ___', answer: 'par' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['passive_voice'],
        items: [
        { prompt: 'construire', answer: 'xây dựng' },
        { prompt: 'le sujet', answer: 'chủ ngữ' },
        { prompt: 'l’agent', answer: 'tác nhân' },
        { prompt: 'actif', answer: 'chủ động' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['passive_voice'],
        items: [
        { prompt: 'Nhà xây 1900.', answer: 'Cette maison a été construite en 1900.' },
        { prompt: 'Tiếng Pháp nói 29 nước.', answer: 'Le français est parlé dans 29 pays.' },
        { prompt: 'Bánh bị ăn.', answer: 'Le gâteau a été mangé.' }
        ],
      }
    ],
  },
  {
    id: "french_relative_clauses",
    category: "relative_clauses" as any,
    title_vi: "Mệnh đề quan hệ",
    title_en: "Relative clauses",
    sentences: [
      { en: 'Le livre qui est sur la table.', vi: 'Sách trên bàn.', pronunciation_focus: ['qui'] },
      { en: 'Le film que j’ai vu.', vi: 'Phim tôi xem.', pronunciation_focus: ['que'] },
      { en: 'L’homme dont je parle.', vi: 'Người tôi nói.', pronunciation_focus: ['dont'] },
      { en: 'La ville où j’habite.', vi: 'TP tôi sống.', pronunciation_focus: ['où'] },
      { en: 'La personne à qui j’ai parlé.', vi: 'Người tôi nói chuyện.', pronunciation_focus: ['qui'] }
    ],
    cultural_notes_vi: "qui, que, dont, où. Không được bỏ như tiếng Anh.",
    tip_advice_vi: "qui + V, que + S + V. dont = de + N.",
    vocabulary: [
      { word: 'qui', en: 'who(subj)', vi: 'mà', pos: 'pronoun', pronunciation_vi: 'KI' },
      { word: 'que', en: 'whom(obj)', vi: 'mà', pos: 'pronoun', pronunciation_vi: 'KƠ' },
      { word: 'dont', en: 'whose', vi: 'mà(sở hữu)', pos: 'pronoun', pronunciation_vi: 'ĐÔNG' },
      { word: 'où', en: 'where', vi: 'nơi', pos: 'pronoun', pronunciation_vi: 'U' },
      { word: 'le pronom relatif', en: 'relative pronoun', vi: 'đại từ QH', pos: 'noun (m)', pronunciation_vi: 'prô-nông rơ-la-TÍP' },
      { word: 'l’antécédent', en: 'antecedent', vi: 'tiền ngữ', pos: 'noun (m)', pronunciation_vi: 'lăng-tê-xê-ĐĂN' },
      { word: 'la subordonnée', en: 'subordinate', vi: 'MĐ phụ', pos: 'noun (f)', pronunciation_vi: 'xuy-bo-đô-NÊ' },
      { word: 'décrire', en: 'describe', vi: 'mô tả', pos: 'verb', pronunciation_vi: 'đê-CRI-R' },
      { word: 'préciser', en: 'specify', vi: 'làm rõ', pos: 'verb', pronunciation_vi: 'prê-xi-DÊ' },
      { word: 'le lien', en: 'link', vi: 'liên kết', pos: 'noun (m)', pronunciation_vi: 'LI-ĂNG' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Mệnh đề quan hệ.', vi: 'Chào, tôi có câu hỏi về Mệnh đề quan hệ.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['relative_clauses'],
        items: [
        { prompt: 'mà → ___', answer: 'qui' },
        { prompt: 'mà → ___', answer: 'que' },
        { prompt: 'mà(sở hữu) → ___', answer: 'dont' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['relative_clauses'],
        items: [
        { prompt: 'où', answer: 'nơi' },
        { prompt: 'le pronom relatif', answer: 'đại từ QH' },
        { prompt: 'l’antécédent', answer: 'tiền ngữ' },
        { prompt: 'la subordonnée', answer: 'MĐ phụ' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['relative_clauses'],
        items: [
        { prompt: 'Sách trên bàn.', answer: 'Le livre qui est sur la table.' },
        { prompt: 'Phim tôi xem.', answer: 'Le film que j’ai vu.' },
        { prompt: 'Người tôi nói.', answer: 'L’homme dont je parle.' }
        ],
      }
    ],
  },
  {
    id: "french_conditionals",
    category: "conditionals" as any,
    title_vi: "Câu điều kiện",
    title_en: "Conditionals",
    sentences: [
      { en: 'Si j’étudie, je réussirai.', vi: 'Học thì đỗ.', pronunciation_focus: ['étudie', 'réussirai'] },
      { en: 'Si j’étudiais, je réussirais.', vi: 'Nếu học, sẽ đỗ.', pronunciation_focus: ['étudiais'] },
      { en: 'Si j’avais étudié, j’aurais réussi.', vi: 'Đã học thì đỗ.', pronunciation_focus: ['aurais'] },
      { en: 'J’irai si tu viens.', vi: 'Tôi đi nếu bạn cùng.', pronunciation_focus: ['irai'] },
      { en: 'À condition que tu sois là.', vi: 'Miễn là bạn có mặt.', pronunciation_focus: ['sois'] }
    ],
    cultural_notes_vi: "3 loại: réel, irréel du présent, irréel du passé. Pourvu que + subj.",
    tip_advice_vi: "Luyện: réussirai, réussirais, aurais réussi.",
    vocabulary: [
      { word: 'la condition', en: 'condition', vi: 'điều kiện', pos: 'noun (f)', pronunciation_vi: 'công-đi-XI-ÔNG' },
      { word: 'le potentiel', en: 'potential', vi: 'tiềm năng', pos: 'noun (m)', pronunciation_vi: 'pô-tăng-XI-EN' },
      { word: 'l’irréel', en: 'unreal', vi: 'không thực', pos: 'noun (m)', pronunciation_vi: 'li-rê-EN' },
      { word: 'le regret', en: 'regret', vi: 'hối tiếc', pos: 'noun (m)', pronunciation_vi: 'rơ-GRÊ' },
      { word: 'si seulement', en: 'if only', vi: 'giá như', pos: 'phrase', pronunciation_vi: 'xi xơ-lơ-MĂN' },
      { word: 'pourvu que', en: 'provided', vi: 'miễn là', pos: 'phrase', pronunciation_vi: 'pua-vuy kơ' },
      { word: 'la conséquence', en: 'consequence', vi: 'hậu quả', pos: 'noun (f)', pronunciation_vi: 'công-xê-KĂNG-X' },
      { word: 'la probabilité', en: 'probability', vi: 'xác suất', pos: 'noun (f)', pronunciation_vi: 'prô-ba-bi-li-TÊ' },
      { word: 'le scénario', en: 'scenario', vi: 'kịch bản', pos: 'noun (m)', pronunciation_vi: 'xê-na-RI-Ô' },
      { word: 'à condition que', en: 'on condition', vi: 'với điều kiện', pos: 'phrase', pronunciation_vi: 'a công-đi-xi-ÔNG' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Câu điều kiện.', vi: 'Chào, tôi có câu hỏi về Câu điều kiện.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['conditionals'],
        items: [
        { prompt: 'điều kiện → ___', answer: 'la condition' },
        { prompt: 'tiềm năng → ___', answer: 'le potentiel' },
        { prompt: 'không thực → ___', answer: 'l’irréel' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['conditionals'],
        items: [
        { prompt: 'le regret', answer: 'hối tiếc' },
        { prompt: 'si seulement', answer: 'giá như' },
        { prompt: 'pourvu que', answer: 'miễn là' },
        { prompt: 'la conséquence', answer: 'hậu quả' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['conditionals'],
        items: [
        { prompt: 'Học thì đỗ.', answer: 'Si j’étudie, je réussirai.' },
        { prompt: 'Nếu học, sẽ đỗ.', answer: 'Si j’étudiais, je réussirais.' },
        { prompt: 'Đã học thì đỗ.', answer: 'Si j’avais étudié, j’aurais réussi.' }
        ],
      }
    ],
  },
  {
    id: "french_idioms",
    category: "idioms" as any,
    title_vi: "Thành ngữ",
    title_en: "French idioms",
    sentences: [
      { en: 'J’ai le cafard aujourd’hui.', vi: 'Hôm nay buồn.', pronunciation_focus: ['cafard'] },
      { en: 'Il m’a posé un lapin !', vi: 'Cho leo cây!', pronunciation_focus: ['lapin'] },
      { en: 'Ça coûte les yeux de la tête !', vi: 'Đắt cắt cổ!', pronunciation_focus: ['coûte'] },
      { en: 'Je donne ma langue au chat.', vi: 'Chịu thua.', pronunciation_focus: ['langue'] },
      { en: 'J’ai la pêche ce matin !', vi: 'Đầy năng lượng!', pronunciation_focus: ['pêche'] }
    ],
    cultural_notes_vi: "Avoir le cafard, poser un lapin, tomber dans les pommes, avoir la pêche.",
    tip_advice_vi: "Học qua ngữ cảnh. Ça coûte les yeux de la tête.",
    vocabulary: [
      { word: 'avoir le cafard', en: 'feel down', vi: 'buồn', pos: 'idiom', pronunciation_vi: 'a-voa ca-PHA' },
      { word: 'poser un lapin', en: 'stand up', vi: 'cho leo cây', pos: 'idiom', pronunciation_vi: 'pô-dê la-PANG' },
      { word: 'tomber dans les pommes', en: 'faint', vi: 'ngất', pos: 'idiom', pronunciation_vi: 'tông-bê PÓM' },
      { word: 'avoir la pêche', en: 'energetic', vi: 'năng lượng', pos: 'idiom', pronunciation_vi: 'a-voa PÉT-S' },
      { word: 'coûter les yeux de la tête', en: 'cost a fortune', vi: 'đắt cắt cổ', pos: 'idiom', pronunciation_vi: 'cu-tê di-ơ TÉT' },
      { word: 'mettre son grain de sel', en: 'butt in', vi: 'chen vào', pos: 'idiom', pronunciation_vi: 'mét-trờ XEN' },
      { word: 'donner sa langue au chat', en: 'give up', vi: 'chịu thua', pos: 'idiom', pronunciation_vi: 'đô-nê SA' },
      { word: 'être dans la lune', en: 'daydream', vi: 'mơ màng', pos: 'idiom', pronunciation_vi: 'é-trờ LUYN' },
      { word: 'avoir un poil dans la main', en: 'be lazy', vi: 'lười', pos: 'idiom', pronunciation_vi: 'a-voa poan MANG' },
      { word: 'la mer à boire', en: 'mission impossible', vi: 'chuyện khó', pos: 'idiom', pronunciation_vi: 'me-r a BOA-R' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Thành ngữ.', vi: 'Chào, tôi có câu hỏi về Thành ngữ.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['idioms'],
        items: [
        { prompt: 'buồn → ___', answer: 'avoir le cafard' },
        { prompt: 'cho leo cây → ___', answer: 'poser un lapin' },
        { prompt: 'ngất → ___', answer: 'tomber dans les pommes' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['idioms'],
        items: [
        { prompt: 'avoir la pêche', answer: 'năng lượng' },
        { prompt: 'coûter les yeux de la tête', answer: 'đắt cắt cổ' },
        { prompt: 'mettre son grain de sel', answer: 'chen vào' },
        { prompt: 'donner sa langue au chat', answer: 'chịu thua' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['idioms'],
        items: [
        { prompt: 'Hôm nay buồn.', answer: 'J’ai le cafard aujourd’hui.' },
        { prompt: 'Cho leo cây!', answer: 'Il m’a posé un lapin !' },
        { prompt: 'Đắt cắt cổ!', answer: 'Ça coûte les yeux de la tête !' }
        ],
      }
    ],
  },
  {
    id: "french_slang",
    category: "slang" as any,
    title_vi: "Tiếng lóng",
    title_en: "Slang",
    sentences: [
      { en: 'Ce mec est chelou.', vi: 'Gã này kỳ.', pronunciation_focus: ['mec', 'chelou'] },
      { en: 'J’ai plus de thune.', vi: 'Hết tiền.', pronunciation_focus: ['thune'] },
      { en: 'C’est ouf !', vi: 'Điên thật!', pronunciation_focus: ['ouf'] },
      { en: 'Je kiffe cette chanson.', vi: 'Mê bài này.', pronunciation_focus: ['kiffe'] },
      { en: 'T’as vu sa meuf ?', vi: 'Thấy bạn gái chưa?', pronunciation_focus: ['meuf'] }
    ],
    cultural_notes_vi: "mec, meuf, fric, boulot, ouf, chelou. Verlan đảo âm tiết. Không dùng chuyên nghiệp.",
    tip_advice_vi: "Cẩn thận ngữ cảnh.",
    vocabulary: [
      { word: 'le mec', en: 'guy', vi: 'gã', pos: 'noun (m)', pronunciation_vi: 'MÉC' },
      { word: 'la meuf', en: 'girl(verlan)', vi: 'cô gái', pos: 'noun (f)', pronunciation_vi: 'MỚPH' },
      { word: 'le fric', en: 'money', vi: 'tiền', pos: 'noun (m)', pronunciation_vi: 'PH-RÍC' },
      { word: 'le boulot', en: 'job', vi: 'việc', pos: 'noun (m)', pronunciation_vi: 'bu-LÔ' },
      { word: 'ouf', en: 'crazy', vi: 'điên', pos: 'adjective', pronunciation_vi: 'ÚP' },
      { word: 'chelou', en: 'weird', vi: 'kỳ lạ', pos: 'adjective', pronunciation_vi: 'sờ-LU' },
      { word: 'vénère', en: 'angry', vi: 'bực', pos: 'adjective', pronunciation_vi: 'vê-NE-R' },
      { word: 'la thune', en: 'money', vi: 'tiền', pos: 'noun (f)', pronunciation_vi: 'TUYN' },
      { word: 'kiffer', en: 'like', vi: 'thích', pos: 'verb', pronunciation_vi: 'ki-PHÊ' },
      { word: 'grave', en: 'very', vi: 'cực', pos: 'adverb', pronunciation_vi: 'GRÁ-V' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Tiếng lóng.', vi: 'Chào, tôi có câu hỏi về Tiếng lóng.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['slang'],
        items: [
        { prompt: 'gã → ___', answer: 'le mec' },
        { prompt: 'cô gái → ___', answer: 'la meuf' },
        { prompt: 'tiền → ___', answer: 'le fric' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['slang'],
        items: [
        { prompt: 'le boulot', answer: 'việc' },
        { prompt: 'ouf', answer: 'điên' },
        { prompt: 'chelou', answer: 'kỳ lạ' },
        { prompt: 'vénère', answer: 'bực' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['slang'],
        items: [
        { prompt: 'Gã này kỳ.', answer: 'Ce mec est chelou.' },
        { prompt: 'Hết tiền.', answer: 'J’ai plus de thune.' },
        { prompt: 'Điên thật!', answer: 'C’est ouf !' }
        ],
      }
    ],
  },
  {
    id: "french_debating",
    category: "debating" as any,
    title_vi: "Tranh luận",
    title_en: "Debating",
    sentences: [
      { en: 'Certes, mais pas si simple.', vi: 'Đúng, không đơn giản.', pronunciation_focus: ['certes'] },
      { en: 'D’un côté, je comprends.', vi: 'Một mặt tôi hiểu.', pronunciation_focus: ['côté'] },
      { en: 'De l’autre, il faut considérer...', vi: 'Mặt khác cần cân nhắc.', pronunciation_focus: ['autre'] },
      { en: 'Pas d’accord parce que...', vi: 'Không đồng ý vì...', pronunciation_focus: ['d’accord'] },
      { en: 'Pourtant, les faits montrent...', vi: 'Tuy nhiên sự thật...', pronunciation_focus: ['pourtant'] }
    ],
    cultural_notes_vi: "Certes... mais..., D’un côté... de l’autre..., Pourtant, Cependant, Néanmoins.",
    tip_advice_vi: "Cấu trúc: thừa nhận→phản biện→kết luận.",
    vocabulary: [
      { word: 'le débat', en: 'debate', vi: 'tranh luận', pos: 'noun (m)', pronunciation_vi: 'đê-BA' },
      { word: 'certes', en: 'admittedly', vi: 'đúng là', pos: 'adverb', pronunciation_vi: 'XÉC-T' },
      { word: 'pourtant', en: 'however', vi: 'tuy nhiên', pos: 'adverb', pronunciation_vi: 'pua-TĂN' },
      { word: 'cependant', en: 'however', vi: 'tuy vậy', pos: 'adverb', pronunciation_vi: 'xơ-păng-ĐĂN' },
      { word: 'néanmoins', en: 'nevertheless', vi: 'dù sao', pos: 'adverb', pronunciation_vi: 'nê-ang-MOANG' },
      { word: 'd’un côté', en: 'on one hand', vi: 'một mặt', pos: 'phrase', pronunciation_vi: 'đăng cô-TÊ' },
      { word: 'de l’autre côté', en: 'other hand', vi: 'mặt khác', pos: 'phrase', pronunciation_vi: 'đơ lô-trờ' },
      { word: 'réfuter', en: 'refute', vi: 'bác bỏ', pos: 'verb', pronunciation_vi: 'rê-phuy-TÊ' },
      { word: 'concéder', en: 'concede', vi: 'nhượng bộ', pos: 'verb', pronunciation_vi: 'công-xê-ĐÊ' },
      { word: 'la synthèse', en: 'synthesis', vi: 'tổng hợp', pos: 'noun (f)', pronunciation_vi: 'xanh-TÊ-Z' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Tranh luận.', vi: 'Chào, tôi có câu hỏi về Tranh luận.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['debating'],
        items: [
        { prompt: 'tranh luận → ___', answer: 'le débat' },
        { prompt: 'đúng là → ___', answer: 'certes' },
        { prompt: 'tuy nhiên → ___', answer: 'pourtant' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['debating'],
        items: [
        { prompt: 'cependant', answer: 'tuy vậy' },
        { prompt: 'néanmoins', answer: 'dù sao' },
        { prompt: 'd’un côté', answer: 'một mặt' },
        { prompt: 'de l’autre côté', answer: 'mặt khác' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['debating'],
        items: [
        { prompt: 'Đúng, không đơn giản.', answer: 'Certes, mais pas si simple.' },
        { prompt: 'Một mặt tôi hiểu.', answer: 'D’un côté, je comprends.' },
        { prompt: 'Mặt khác cần cân nhắc.', answer: 'De l’autre, il faut considérer...' }
        ],
      }
    ],
  },
  {
    id: "french_final_test",
    category: "final_test" as any,
    title_vi: "Bài kiểm tra tổng hợp",
    title_en: "Final test",
    sentences: [
      { en: 'Révisez tous les chapitres.', vi: 'Ôn tất cả.', pronunciation_focus: ['révisez'] },
      { en: 'N’oubliez pas le subjonctif !', vi: 'Đừng quên subjonctif!', pronunciation_focus: ['subjonctif'] },
      { en: 'Vous avez fait des progrès.', vi: 'Đã tiến bộ.', pronunciation_focus: ['progrès'] },
      { en: 'Corrigez vos erreurs.', vi: 'Sửa lỗi.', pronunciation_focus: ['corrigez'] },
      { en: 'Félicitations, vous avez terminé !', vi: 'Chúc mừng, hoàn thành!', pronunciation_focus: ['félicitations'] }
    ],
    cultural_notes_vi: "Tổng hợp A1-B2: passé composé, futur, conditionnel, subjonctif, mệnh đề quan hệ.",
    tip_advice_vi: "Tự đánh giá. Quan trọng: tự tin giao tiếp.",
    vocabulary: [
      { word: 'réviser', en: 'review', vi: 'ôn tập', pos: 'verb', pronunciation_vi: 'rê-vi-DÊ' },
      { word: 'le bilan', en: 'assessment', vi: 'đánh giá', pos: 'noun (m)', pronunciation_vi: 'bi-LĂN' },
      { word: 'le progrès', en: 'progress', vi: 'tiến bộ', pos: 'noun (m)', pronunciation_vi: 'prô-GRÊ' },
      { word: 'la difficulté', en: 'difficulty', vi: 'khó khăn', pos: 'noun (f)', pronunciation_vi: 'đi-phi-cuyn-TÊ' },
      { word: 'l’erreur', en: 'error', vi: 'lỗi', pos: 'noun (f)', pronunciation_vi: 'lê-RƠR' },
      { word: 'corriger', en: 'correct', vi: 'sửa', pos: 'verb', pronunciation_vi: 'cô-ri-DÊ' },
      { word: 'le niveau', en: 'level', vi: 'trình độ', pos: 'noun (m)', pronunciation_vi: 'ni-VÔ' },
      { word: 'atteindre', en: 'reach', vi: 'đạt', pos: 'verb', pronunciation_vi: 'a-TANG-đrờ' },
      { word: 'le résultat', en: 'result', vi: 'kết quả', pos: 'noun (m)', pronunciation_vi: 'rê-duyn-TA' },
      { word: 'félicitations', en: 'congrats', vi: 'chúc mừng', pos: 'interjection', pronunciation_vi: 'phê-li-xi-ta-xi-ÔNG' }
    ],
    dialogue: [
      { speaker: 'A', text: 'Bonjour, j\'ai une question sur Bài kiểm tra tổng hợp.', vi: 'Chào, tôi có câu hỏi về Bài kiểm tra tổng hợp.' },
      { speaker: 'B', text: 'Bien sûr, que voulez-vous savoir ?', vi: 'Vâng, bạn muốn biết gì?' },
      { speaker: 'A', text: 'Pouvez-vous m\'expliquer ?', vi: 'Giải thích được không?' },
      { speaker: 'B', text: 'Avec plaisir. Voici l\'essentiel.', vi: 'Vui lòng. Đây là điểm chính.' }
    ],
    exercises: [
      {
        type: "fill_blank",
        instruction_vi: "Điền từ đúng:",
        pronunciation_focus: ['final_test'],
        items: [
        { prompt: 'ôn tập → ___', answer: 'réviser' },
        { prompt: 'đánh giá → ___', answer: 'le bilan' },
        { prompt: 'tiến bộ → ___', answer: 'le progrès' }
        ],
      },
      {
        type: "matching",
        instruction_vi: "Nối từ với nghĩa:",
        pronunciation_focus: ['final_test'],
        items: [
        { prompt: 'la difficulté', answer: 'khó khăn' },
        { prompt: 'l’erreur', answer: 'lỗi' },
        { prompt: 'corriger', answer: 'sửa' },
        { prompt: 'le niveau', answer: 'trình độ' }
        ],
      },
      {
        type: "translation",
        instruction_vi: "Dịch:",
        pronunciation_focus: ['final_test'],
        items: [
        { prompt: 'Ôn tất cả.', answer: 'Révisez tous les chapitres.' },
        { prompt: 'Đừng quên subjonctif!', answer: 'N’oubliez pas le subjonctif !' },
        { prompt: 'Đã tiến bộ.', answer: 'Vous avez fait des progrès.' }
        ],
      }
    ],
  }
];

export default FRENCH_B1B2_LESSONS;
