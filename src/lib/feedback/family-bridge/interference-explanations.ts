import type { FamilyBridgeExplanation } from "./types.js";

export const VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS: FamilyBridgeExplanation[] =
  [
    {
      tag: "final_consonant_cluster_reduction",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Âm cuối chùm phụ âm",
      patternLabelEn: "Final cluster reduction",
      parentSummaryVi:
        "Nhiều người Việt biết chữ đúng nhưng khi nói tiếng Anh, chùm âm cuối như -sts, -sked dễ bị nhẹ đi.",
      whyVi:
        "Tiếng Việt ít khi kết thúc âm tiết bằng hai hoặc ba phụ âm liền nhau. Vì vậy khi nói nhanh, người học có thể giữ ý đúng nhưng làm nhẹ phần cuối của từ tiếng Anh.",
      howToHelpVi:
        "Gia đình có thể nghe phần cuối của từ trong các cặp ngắn như test/tests hoặc ask/asked, rồi khen khi âm cuối nghe rõ hơn.",
      encouragementVi:
        "Đây là điểm phát âm rất quen thuộc với người Việt mình; luyện chậm rồi tăng tốc sẽ tiến bộ rõ.",
      example: {
        learnerSays: "She ask me last night.",
        naturalForm: "She asked me last night.",
        glossVi:
          "Ý là 'cô ấy hỏi tôi tối qua'; tiếng Anh cần nghe rõ âm cuối -ed.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "voiced_final_stop_devoicing",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Âm cuối b/d/g",
      patternLabelEn: "Voiced final stop loss",
      parentSummaryVi:
        "Các âm cuối như b, d, g trong tiếng Anh cần tín hiệu rõ hơn tiếng Việt nên đôi khi nghe thành âm khác.",
      whyVi:
        "Tiếng Việt có âm cuối ngắn và thường không bật mạnh. Tiếng Anh lại dựa vào độ dài nguyên âm và hơi cuối để phân biệt bad/bat hoặc bag/back.",
      howToHelpVi:
        "Gia đình có thể cho người học nghe và lặp lại từng cặp tối thiểu, chú ý giữ nguyên âm trước âm b/d/g dài hơn một chút.",
      encouragementVi:
        "Người học không thiếu từ vựng; đây là điều chỉnh cơ miệng và tai nghe.",
      example: {
        learnerSays: "I need a back.",
        naturalForm: "I need a bag.",
        glossVi: "Ý là 'tôi cần cái túi'; tiếng Anh cần âm cuối g đủ rõ.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "th_stopping_and_fronting",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Âm th trong tiếng Anh",
      patternLabelEn: "TH substitution",
      parentSummaryVi:
        "Âm th tiếng Anh không giống chữ th tiếng Việt, nên think, this, three cần một cách đặt lưỡi mới.",
      whyVi:
        "Tiếng Việt không có âm đặt đầu lưỡi giữa hai răng như tiếng Anh. Người học thường mượn âm gần hơn như t, d, s hoặc z để nói cho kịp.",
      howToHelpVi:
        "Gia đình có thể luyện các từ rất ngắn: think, three, this, that; mục tiêu là thấy hơi ra nhẹ và nghe khác t/d.",
      encouragementVi:
        "Âm này mới với hầu hết người Việt học tiếng Anh, luyện từng từ quen thuộc sẽ dễ hơn.",
      example: {
        learnerSays: "I tink it is good.",
        naturalForm: "I think it is good.",
        glossVi:
          "Ý là 'tôi nghĩ là tốt'; think cần âm th tiếng Anh, không phải t tiếng Việt.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "inflectional_s_ed_inaudible",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Đuôi -s và -ed nghe chưa rõ",
      patternLabelEn: "Inaudible -s and -ed",
      parentSummaryVi:
        "Người học có thể biết ngữ pháp nhưng khi nói, đuôi -s, -ed, hoặc sở hữu 's chưa bật rõ.",
      whyVi:
        "Tiếng Việt không thêm hậu tố để báo số nhiều, quá khứ, hay chủ ngữ. Khi kết hợp với âm cuối khó, các đuôi nhỏ của tiếng Anh dễ bị nuốt mất.",
      howToHelpVi:
        "Gia đình nên tách nghĩa với âm: one cat/two cats, I walk/I walked, I work/she works, rồi nghe phần cuối.",
      encouragementVi:
        "Điểm này thường là phát âm lẫn thói quen, không phải người học không hiểu bài.",
      example: {
        learnerSays: "He work every day.",
        naturalForm: "He works every day.",
        glossVi:
          "Ý là 'anh ấy làm mỗi ngày'; tiếng Anh cần nghe đuôi -s trong works.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "word_stress_even_timing",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Trọng âm trong từ dài",
      patternLabelEn: "Even word stress",
      parentSummaryVi:
        "Từ tiếng Anh nhiều âm tiết cần một âm nổi bật hơn; nếu âm nào cũng đều, người nghe khó nhận ra từ.",
      whyVi:
        "Tiếng Việt dùng thanh điệu trên từng tiếng, không dùng trọng âm kiểu tiếng Anh để làm một âm tiết nổi lên trong cả từ.",
      howToHelpVi:
        "Gia đình có thể đánh dấu âm mạnh bằng chữ in hoa khi luyện: in-for-MA-tion, im-POR-tant, pho-TOG-ra-pher.",
      encouragementVi:
        "Khi người học nghe và bắt chước nhịp của từ, vốn từ đã biết sẽ trở nên dễ hiểu hơn nhiều.",
      example: {
        learnerSays: "IN-for-ma-tion",
        naturalForm: "in-for-MA-tion",
        glossVi: "Ý là 'thông tin'; tiếng Anh nhấn mạnh âm MA.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "diphthong_monophthong_reduction",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Nguyên âm đôi",
      patternLabelEn: "Diphthong reduction",
      parentSummaryVi:
        "Một số nguyên âm tiếng Anh cần trượt từ âm này sang âm khác; nếu nói quá ngắn, face dễ nghe như fess.",
      whyVi:
        "Người Việt quen giữ nguyên âm ổn định trong từng tiếng. Một số nguyên âm tiếng Anh lại cần chuyển động rõ trong cùng một âm.",
      howToHelpVi:
        "Gia đình có thể luyện chậm với mũi tên âm: face, goat, late, boat; sau đó rút ngắn dần về tốc độ tự nhiên.",
      encouragementVi:
        "Đây là luyện đường đi của âm, không phải học thêm ngữ pháp khó.",
      example: {
        learnerSays: "My fess is tired.",
        naturalForm: "My face is tired.",
        glossVi: "Ý là 'mặt tôi mệt'; face cần nguyên âm đôi nghe rõ hơn.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "r_l_w_position_confusion",
      source: "interference",
      cefr: "A1",
      patternNameVi: "R, L, W theo vị trí",
      patternLabelEn: "R/L/W position confusion",
      parentSummaryVi:
        "R, L, W không khó giống nhau ở mọi chỗ; đầu từ, giữa từ, cuối từ cần luyện riêng.",
      whyVi:
        "Cách phát âm r, d, gi, v, l trong tiếng Việt thay đổi theo vùng, còn tiếng Anh có r, w và l cuối không khớp hẳn với thói quen đó.",
      howToHelpVi:
        "Gia đình có thể luyện theo vị trí: red ở đầu từ, very ở giữa, feel ở cuối; mỗi nhóm chỉ vài phút.",
      encouragementVi:
        "Chẩn đoán đúng vị trí sẽ giúp luyện nhanh hơn là sửa tất cả R/L/W cùng lúc.",
      example: {
        learnerSays: "I really like lice.",
        naturalForm: "I really like rice.",
        glossVi:
          "Ý là 'tôi rất thích cơm/gạo'; rice cần âm r tiếng Anh ở đầu từ.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "flat_english_intonation",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Ngữ điệu câu tiếng Anh",
      patternLabelEn: "Flat English intonation",
      parentSummaryVi:
        "Người học có thể nói đúng từ nhưng câu nghe đều; tiếng Anh dùng lên xuống giọng để báo câu hỏi, thái độ, và ý chính.",
      whyVi:
        "Tiếng Việt dùng thanh điệu để phân biệt từng tiếng. Khi chuyển sang tiếng Anh, người học có thể giữ cao độ từng từ mà chưa dùng đường lên xuống của cả câu.",
      howToHelpVi:
        "Gia đình có thể cho người học bắt chước câu ngắn trong audio, nhất là câu hỏi, lời mời, và chỗ cần nhấn ý.",
      encouragementVi:
        "Ngữ điệu là lớp nhạc của câu; nghe nhiều và nhại lại sẽ tự nhiên dần.",
      example: {
        learnerSays: "You want coffee.",
        naturalForm: "Do you want coffee?",
        glossVi:
          "Ý là 'bạn muốn cà phê không?'; tiếng Anh cần mẫu câu hỏi và giọng hỏi.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "missing_subject_verb_agreement",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Động từ sau he/she/it",
      patternLabelEn: "Missing subject agreement",
      parentSummaryVi:
        "Tiếng Việt không đổi động từ theo chủ ngữ, nên he goes, she has cần được luyện thành phản xạ riêng.",
      whyVi:
        "Trong tiếng Việt, tôi đi, anh ấy đi, họ đi đều dùng một dạng động từ. Tiếng Anh hiện tại đơn lại thêm -s cho he, she, it.",
      howToHelpVi:
        "Gia đình có thể luyện cặp đối chiếu ngắn: I work / she works, I have / he has, I go / she goes.",
      encouragementVi:
        "Quy tắc nhỏ nhưng cần lặp nhiều; khi thành nhịp nói, người học sẽ dùng tự nhiên hơn.",
      example: {
        learnerSays: "My brother have a job.",
        naturalForm: "My brother has a job.",
        glossVi: "Ý là 'anh tôi có việc làm'; tiếng Anh đổi have thành has.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "past_tense_unmarked",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Quá khứ nằm trên động từ",
      patternLabelEn: "Unmarked past tense",
      parentSummaryVi:
        "Tiếng Việt chỉ cần hôm qua, tuần trước; tiếng Anh vẫn cần đổi động từ như went, cooked, met.",
      whyVi:
        "Tiếng Việt báo thời gian bằng từ như đã, hôm qua, tuần trước, nên động từ giữ nguyên. Tiếng Anh yêu cầu cụm động từ cũng mang dấu quá khứ.",
      howToHelpVi:
        "Gia đình có thể hỏi chuyện hôm qua bằng vài động từ quen thuộc rồi nhắc lại dạng tự nhiên: went, ate, watched, studied.",
      encouragementVi:
        "Người học đã biết ý thời gian; bước tiếp theo là gắn thời gian đó vào động từ tiếng Anh.",
      example: {
        learnerSays: "I go to Da Nang last week.",
        naturalForm: "I went to Da Nang last week.",
        glossVi: "Ý là 'tuần trước tôi đi Đà Nẵng'; tiếng Anh cần went.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "plural_s_omission",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Danh từ số nhiều thêm -s",
      patternLabelEn: "Plural -s omission",
      parentSummaryVi:
        "Tiếng Việt có số lượng rồi danh từ vẫn giữ nguyên; tiếng Anh cần thêm -s trong two books, many students.",
      whyVi:
        "Trong tiếng Việt, số đếm hoặc từ lượng đã nói rõ số nhiều, danh từ không đổi. Tiếng Anh lại đánh dấu số nhiều ngay trên danh từ đếm được.",
      howToHelpVi:
        "Gia đình có thể luyện quanh đồ vật quen thuộc: one book/two books, one friend/many friends, one year/five years.",
      encouragementVi:
        "Người nghe vẫn hiểu ý; thêm -s đều hơn sẽ làm câu tiếng Anh gọn và chuẩn hơn.",
      example: {
        learnerSays: "I have two sister.",
        naturalForm: "I have two sisters.",
        glossVi: "Ý là 'tôi có hai chị/em gái'; tiếng Anh cần sisters.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "possessive_s_avoidance",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Sở hữu bằng 's",
      patternLabelEn: "Possessive -s avoidance",
      parentSummaryVi:
        "Tiếng Việt dùng của để nối sở hữu; tiếng Anh thường thêm 's vào người sở hữu: Nam's car.",
      whyVi:
        "Tiếng Việt đặt ý sở hữu bằng từ của hoặc bằng trật tự quen thuộc. Tiếng Anh có một dạng rất ngắn là 's, nên người học dễ bỏ sót khi nói nhanh.",
      howToHelpVi:
        "Gia đình có thể luyện tên thật và đồ vật quen thuộc: Mai's bag, Dad's phone, my friend's house.",
      encouragementVi:
        "Đây là thói quen hình thức nhỏ; luyện qua vật thật trong nhà sẽ dễ nhớ.",
      example: {
        learnerSays: "This is Nam car.",
        naturalForm: "This is Nam's car.",
        glossVi: "Ý là 'đây là xe của Nam'; tiếng Anh gắn 's vào Nam.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "comparative_superlative_mixing",
      source: "interference",
      cefr: "A2",
      patternNameVi: "So sánh hơn và nhất",
      patternLabelEn: "Comparative form mixing",
      parentSummaryVi:
        "Tiếng Việt dùng hơn/nhất rất đều; tiếng Anh phải chọn -er, more, hoặc the most theo loại tính từ.",
      whyVi:
        "Tiếng Việt dùng một từ báo so sánh rõ ràng, còn tính từ không biến đổi. Tiếng Anh chia thành nhiều mẫu, nên người học dễ trộn more với -er.",
      howToHelpVi:
        "Gia đình có thể luyện từng nhóm: taller/faster cho từ ngắn, more beautiful cho từ dài, the best/the most cho bậc nhất.",
      encouragementVi:
        "Khi đã thuộc nhóm từ quen, người học sẽ ít phải nghĩ từng câu.",
      example: {
        learnerSays: "He is more taller.",
        naturalForm: "He is taller.",
        glossVi:
          "Ý là 'anh ấy cao hơn'; tiếng Anh chỉ cần taller, không thêm more.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "modal_verb_inflection",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Động từ sau can/will/should",
      patternLabelEn: "Modal verb inflection",
      parentSummaryVi:
        "Sau can, will, should, động từ tiếng Anh trở về dạng gốc; she can sings cần thành she can sing.",
      whyVi:
        "Người học đã quen thêm -s cho she/he, nhưng sau trợ động từ tiếng Anh, động từ chính không nhận -s, -ed, hay to.",
      howToHelpVi:
        "Gia đình có thể luyện một khung cố định: can + sing, will + go, should + study; giữ động từ sau đó thật đơn giản.",
      encouragementVi:
        "Đây là lúc hai quy tắc tiếng Anh gặp nhau; tách khung ra luyện sẽ rất nhanh rõ.",
      example: {
        learnerSays: "She can sings well.",
        naturalForm: "She can sing well.",
        glossVi: "Ý là 'cô ấy có thể hát hay'; sau can dùng sing.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "missing_articles",
      source: "interference",
      cefr: "A1",
      patternNameVi: "A, an, the trước danh từ",
      patternLabelEn: "Article omission",
      parentSummaryVi:
        "Tiếng Việt không có a/an/the, nên người học cần luyện thêm từ nhỏ này trước danh từ tiếng Anh.",
      whyVi:
        "Tiếng Việt để danh từ đứng tự nhiên và dựa vào ngữ cảnh, số đếm, hoặc từ chỉ định. Tiếng Anh lại cần a/an/the trước nhiều danh từ đếm được.",
      howToHelpVi:
        "Gia đình có thể luyện với vật quen thuộc: a book, an apple, the door; nói ngắn nhưng đủ cụm danh từ.",
      encouragementVi:
        "A/an/the rất nhỏ nên dễ quên; càng luyện theo cụm, người học càng dùng tự động.",
      example: {
        learnerSays: "I bought book yesterday.",
        naturalForm: "I bought a book yesterday.",
        glossVi: "Ý là 'tôi mua sách hôm qua'; tiếng Anh cần a book.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "copula_be_omission",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Be trước tính từ",
      patternLabelEn: "Copula be omission",
      parentSummaryVi:
        "Tiếng Việt nói tôi mệt là đủ; tiếng Anh cần I am tired, he is happy, they are ready.",
      whyVi:
        "Trong tiếng Việt, chủ ngữ có thể đi thẳng với tính từ. Tiếng Anh cần động từ nối am/is/are để câu đầy đủ.",
      howToHelpVi:
        "Gia đình có thể luyện khung ba bước: I am, she is, they are, rồi thêm tính từ quen thuộc như tired, happy, ready.",
      encouragementVi:
        "Chỉ cần quen đặt be vào giữa, câu tiếng Anh sẽ rõ hơn ngay.",
      example: {
        learnerSays: "I tired.",
        naturalForm: "I am tired.",
        glossVi: "Ý là 'tôi mệt'; tiếng Anh cần am ở giữa.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "question_word_order_transfer",
      source: "interference",
      cefr: "A1",
      patternNameVi: "Trật tự câu hỏi",
      patternLabelEn: "Question word order",
      parentSummaryVi:
        "Tiếng Việt đổi giọng hoặc thêm không/à; tiếng Anh thường cần do/does/did và đảo trật tự.",
      whyVi:
        "Tiếng Việt có thể giữ trật tự câu kể rồi thêm dấu hỏi, không, à. Tiếng Anh lại đưa trợ động từ lên trước chủ ngữ trong nhiều câu hỏi.",
      howToHelpVi:
        "Gia đình có thể luyện mẫu ngắn: Do you like..., Did you go..., Where do you live... thay vì chỉ lên giọng.",
      encouragementVi:
        "Người học đã biết đặt ý hỏi; cần thêm khung tiếng Anh cho ý hỏi đó.",
      example: {
        learnerSays: "You like coffee?",
        naturalForm: "Do you like coffee?",
        glossVi: "Ý là 'bạn thích cà phê không?'; tiếng Anh cần Do ở đầu.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "relative_clause_transfer",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Mệnh đề quan hệ",
      patternLabelEn: "Relative clause transfer",
      parentSummaryVi:
        "Tiếng Việt nối ý bằng mà/người/cái rất linh hoạt; tiếng Anh cần who, which, that đúng vị trí.",
      whyVi:
        "Tiếng Việt có thể bổ nghĩa sau danh từ bằng cách rất gọn. Tiếng Anh cần từ nối quan hệ và trật tự rõ hơn để người nghe biết phần nào mô tả danh từ.",
      howToHelpVi:
        "Gia đình có thể luyện hai khung: the person who... và the thing that..., mỗi lần chỉ một câu ngắn.",
      encouragementVi:
        "Đây là mẫu câu dài hơn; chia thành hai khung nhỏ sẽ dễ kiểm soát.",
      example: {
        learnerSays: "The man I met him is my teacher.",
        naturalForm: "The man I met is my teacher.",
        glossVi:
          "Ý là 'người mà tôi gặp là thầy tôi'; tiếng Anh không lặp him trong mẫu này.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "negation_no_not_placement",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Phủ định với do/does/did",
      patternLabelEn: "Negation placement",
      parentSummaryVi:
        "Tiếng Việt đặt không trước ý phủ định; tiếng Anh cần don't, doesn't, didn't theo thì và chủ ngữ.",
      whyVi:
        "Tiếng Việt dùng không/chưa rất ổn định, động từ không đổi. Tiếng Anh thường phải thêm trợ động từ để tạo phủ định.",
      howToHelpVi:
        "Gia đình có thể luyện ba khung: I don't..., she doesn't..., yesterday I didn't..., rồi giữ động từ chính ở dạng gốc.",
      encouragementVi:
        "Khi khung phủ định đã quen, người học sẽ bớt dịch từng chữ từ tiếng Việt.",
      example: {
        learnerSays: "She not like coffee.",
        naturalForm: "She doesn't like coffee.",
        glossVi: "Ý là 'cô ấy không thích cà phê'; tiếng Anh cần doesn't.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "there_is_co_transfer",
      source: "interference",
      cefr: "A2",
      patternNameVi: "There is/there are từ 'có'",
      patternLabelEn: "There is / có transfer",
      parentSummaryVi:
        "Tiếng Việt dùng có rất rộng; tiếng Anh tách thành there is, there are, have, hoặc exist tùy câu.",
      whyVi:
        "Một chữ có trong tiếng Việt có thể báo sự tồn tại, sở hữu, hoặc tình huống. Tiếng Anh chọn cấu trúc khác nhau cho từng nghĩa.",
      howToHelpVi:
        "Gia đình có thể luyện câu nhìn thấy: There is one..., There are two..., I have..., để tách tồn tại khỏi sở hữu.",
      encouragementVi:
        "Người học đang dùng một ý rất Việt Nam; chỉ cần chọn đúng khung tiếng Anh theo ngữ cảnh.",
      example: {
        learnerSays: "In my room has a desk.",
        naturalForm: "There is a desk in my room.",
        glossVi:
          "Ý là 'trong phòng tôi có một cái bàn'; tiếng Anh dùng There is.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "topic_comment_fronting",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Đưa chủ đề lên đầu câu",
      patternLabelEn: "Topic-comment fronting",
      parentSummaryVi:
        "Tiếng Việt hay nêu chủ đề trước rồi nhận xét; tiếng Anh thường cần chủ ngữ chính đứng đúng vị trí.",
      whyVi:
        "Câu tiếng Việt có thể mở bằng chủ đề: món này, tôi thích lắm. Trong tiếng Anh, nếu bê nguyên trật tự đó, câu có thể nghe thiếu chủ ngữ hoặc quá Việt.",
      howToHelpVi:
        "Gia đình có thể giúp người học đổi từ mẫu chủ đề-nhận xét sang mẫu chủ ngữ-động từ: I like this dish very much.",
      encouragementVi:
        "Cách nghĩ chủ đề trước rất tự nhiên trong tiếng Việt; tiếng Anh chỉ cần sắp lại để người nghe theo kịp.",
      example: {
        learnerSays: "This dish, I like very much.",
        naturalForm: "I like this dish very much.",
        glossVi:
          "Ý là 'món này tôi rất thích'; tiếng Anh thường đặt I like trước.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "literal_vietnamese_calques",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Dịch sát cụm tiếng Việt",
      patternLabelEn: "Literal Vietnamese calques",
      parentSummaryVi:
        "Khi đổi mã từ tiếng Việt sang tiếng Anh, người học có thể giữ hình ảnh Việt; tiếng Anh cần cụm tự nhiên riêng.",
      whyVi:
        "Trong ngữ cảnh Việt Nam, cụm như ăn thuốc, đóng đèn, nói với rất dễ hiểu. Khi chuyển sang mã tiếng Anh, nghĩa vẫn đúng nhưng cụm tự nhiên đổi thành take medicine, turn off the light, talk to.",
      howToHelpVi:
        "Gia đình có thể giúp bằng cách học theo cụm nguyên khối, không bắt bẻ từng chữ: take medicine, turn off the fan, talk to a friend.",
      encouragementVi:
        "Đây là chuyển mã theo ngữ cảnh; càng gặp nhiều cụm tiếng Anh tự nhiên, người học càng chọn đúng mã.",
      example: {
        learnerSays: "I eat medicine after dinner.",
        naturalForm: "I take medicine after dinner.",
        glossVi:
          "Ý là 'tôi uống thuốc sau bữa tối'; tiếng Anh dùng take medicine.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics/calque wording must stay framed as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "polysemy_one_vietnamese_many_english",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Một từ Việt, nhiều từ Anh",
      patternLabelEn: "One Vietnamese word, many English words",
      parentSummaryVi:
        "Một từ tiếng Việt như đi, làm, mở có thể ứng với nhiều từ tiếng Anh khác nhau theo ngữ cảnh.",
      whyVi:
        "Tiếng Việt dùng một từ rất linh hoạt qua nhiều tình huống. Tiếng Anh thường tách nghĩa thành nhiều từ khác nhau, nên người học cần chọn theo cụm.",
      howToHelpVi:
        "Gia đình có thể luyện theo tình huống: do homework, make a cake, go to school, ride a bike, open a business.",
      encouragementVi:
        "Người học có ý đúng; phần cần luyện là bản đồ từ vựng giữa hai ngôn ngữ.",
      example: {
        learnerSays: "I do a cake.",
        naturalForm: "I make a cake.",
        glossVi:
          "Ý là 'tôi làm bánh'; tiếng Anh dùng make khi tạo ra món bánh.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "preposition_selection_transfer",
      source: "interference",
      cefr: "A2",
      patternNameVi: "Giới từ theo ngữ cảnh",
      patternLabelEn: "Preposition selection",
      parentSummaryVi:
        "Từ ở, vào, trên trong tiếng Việt không đổi một-một sang in, on, at; tiếng Anh chọn theo cụm.",
      whyVi:
        "Một giới từ tiếng Việt bao phủ nhiều tình huống. Tiếng Anh chia nhỏ hơn: at school, in Vietnam, on the street, by bus.",
      howToHelpVi:
        "Gia đình có thể luyện giới từ theo cả cụm địa điểm hoặc hoạt động, không học từng từ rời.",
      encouragementVi:
        "Giới từ là thói quen của từng ngôn ngữ; người học sẽ nhớ tốt hơn qua ví dụ quen thuộc.",
      example: {
        learnerSays: "I live in 12 Le Loi Street.",
        naturalForm: "I live on Le Loi Street.",
        glossVi:
          "Ý là 'tôi sống ở đường Lê Lợi'; tiếng Anh dùng on cho tên đường.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "phrasal_verb_avoidance",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Cụm động từ tiếng Anh",
      patternLabelEn: "Phrasal verb avoidance",
      parentSummaryVi:
        "Người học thường chọn động từ trang trọng vì phrasal verb như give up, look after, put off không có mẫu Việt tương đương.",
      whyVi:
        "Tiếng Việt không ghép động từ với tiểu từ kiểu tiếng Anh để đổi nghĩa theo cách look up, give in, put off. Vì vậy người học dễ né hoặc dùng từ dài hơn.",
      howToHelpVi:
        "Gia đình có thể luyện từng cụm qua một cảnh cụ thể: turn on the light, look after a sibling, put off a meeting.",
      encouragementVi:
        "Dùng từ trang trọng không phải vấn đề lớn; thêm phrasal verb sẽ làm tiếng Anh tự nhiên hơn.",
      example: {
        learnerSays: "Please activate the light.",
        naturalForm: "Please turn on the light.",
        glossVi:
          "Ý là 'làm đèn sáng lên'; tiếng Anh tự nhiên là turn on the light.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "false_friend_loanword_overreach",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Từ vay mượn dễ lệch nghĩa",
      patternLabelEn: "Loanword false friends",
      parentSummaryVi:
        "Một số từ nghe giống tiếng Anh trong đời sống Việt có nghĩa hẹp hơn hoặc khác khi dùng bằng tiếng Anh.",
      whyVi:
        "Tiếng Việt mượn nhiều từ quốc tế nhưng dùng theo nhu cầu địa phương. Khi chuyển sang tiếng Anh, từ đó có thể không mang đúng sắc thái hoặc phạm vi nghĩa.",
      howToHelpVi:
        "Gia đình có thể hỏi người học dùng từ đó trong câu tiếng Anh thật, rồi kiểm tra cụm đi kèm thay vì đoán theo âm quen.",
      encouragementVi:
        "Biết từ vay mượn là lợi thế; chỉ cần gắn thêm cách dùng tiếng Anh chuẩn.",
      example: {
        learnerSays: "I wear a vest to school.",
        naturalForm: "I wear a uniform to school.",
        glossVi:
          "Ý là 'tôi mặc đồng phục đi học'; vest trong tiếng Anh không bao quát như cách gọi quen ở Việt Nam.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "idiom_literal_interpretation",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Thành ngữ không dịch từng chữ",
      patternLabelEn: "Literal idiom interpretation",
      parentSummaryVi:
        "Thành ngữ là mã văn hóa theo ngôn ngữ; khi đổi sang tiếng Anh, cần học nghĩa cả cụm thay vì dịch từng chữ.",
      whyVi:
        "Trong tiếng Việt, thành ngữ và cách nói hình ảnh hoạt động trong ngữ cảnh Việt rất tự nhiên. Sang tiếng Anh, cùng ý đó thường cần một thành ngữ khác hoặc câu diễn giải rõ hơn.",
      howToHelpVi:
        "Gia đình có thể giúp bằng cách hỏi 'cụm này nghĩa là gì trong tình huống này?' rồi học bản tiếng Anh tương đương cả cụm.",
      encouragementVi:
        "Đây là chuyển mã văn hóa; biết cả hai cách nói là lợi thế giao tiếp của người học.",
      example: {
        learnerSays: "He is like water breaks the bank.",
        naturalForm: "He is under a lot of pressure.",
        glossVi:
          "Ý là một hình ảnh Việt về áp lực; tiếng Anh nên diễn đạt bằng cụm tự nhiên theo ngữ cảnh.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics/idiom wording must stay framed as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "over_explicit_pronoun_reference",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Nhắc lại đại từ quá rõ",
      patternLabelEn: "Over-explicit pronouns",
      parentSummaryVi:
        "Tiếng Việt hay nhắc lại người/vật để rõ quan hệ; tiếng Anh đôi khi cần lược bớt để câu gọn.",
      whyVi:
        "Tiếng Việt dùng đại từ, tên gọi, và vai vế để giữ mạch quan hệ trong câu. Tiếng Anh viết học thuật hoặc công việc thường muốn tham chiếu gọn hơn.",
      howToHelpVi:
        "Gia đình có thể luyện đọc lại câu và hỏi: từ nào đã rõ rồi, có thể bỏ để câu tiếng Anh nhẹ hơn không?",
      encouragementVi:
        "Người học đang cố làm rõ ý; bước tiếp theo là chọn mức rõ vừa đủ theo văn phong tiếng Anh.",
      example: {
        learnerSays: "My teacher, she helped me.",
        naturalForm: "My teacher helped me.",
        glossVi:
          "Ý là 'cô giáo tôi, cô ấy giúp tôi'; tiếng Anh thường không cần lặp she.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "topic_comment_paragraph_shape",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Dáng đoạn văn chủ đề-nhận xét",
      patternLabelEn: "Topic-comment paragraphing",
      parentSummaryVi:
        "Đoạn văn tiếng Việt có thể đi vòng mềm; tiếng Anh học thuật thường muốn câu chủ đề và luận điểm sớm hơn.",
      whyVi:
        "Tiếng Việt cho phép mở bằng bối cảnh, dẫn ý, rồi mới chốt. Trong nhiều bài tiếng Anh, người đọc mong luận điểm xuất hiện sớm để theo dõi.",
      howToHelpVi:
        "Gia đình có thể hỏi người học: câu nào là ý chính? Đưa câu đó lên đầu đoạn rồi thêm lý do sau.",
      encouragementVi:
        "Đây là khác biệt về cách tổ chức văn bản; người học chỉ cần đổi bố cục theo kỳ vọng tiếng Anh.",
      example: {
        learnerSays:
          "About studying online, many things are convenient. So I think it is useful.",
        naturalForm: "Online study is useful because it is convenient.",
        glossVi: "Ý chính đến sau; tiếng Anh thường đưa luận điểm lên trước.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "connector_overuse_and_stacking",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Nối ý quá nhiều",
      patternLabelEn: "Connector stacking",
      parentSummaryVi:
        "Người học có thể dùng nhiều moreover, however, therefore để làm bài rõ; tiếng Anh tự nhiên cần nối ý vừa đủ.",
      whyVi:
        "Trong quá trình học viết, người học thường được dạy nhiều từ nối để bài có cấu trúc. Khi dùng quá sát nhau, đoạn tiếng Anh nghe nặng và kém tự nhiên.",
      howToHelpVi:
        "Gia đình có thể giúp người học đọc đoạn văn và giữ mỗi ý chính một từ nối cần thiết, bỏ từ lặp.",
      encouragementVi:
        "Người học đang cố tạo mạch logic; tinh chỉnh số lượng từ nối sẽ làm bài trưởng thành hơn.",
      example: {
        learnerSays: "Moreover, also, I think this is important.",
        naturalForm: "Also, I think this is important.",
        glossVi: "Ý là thêm một điểm mới; tiếng Anh chỉ cần một từ nối.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "time_reference_overmarking",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Đánh dấu thời gian quá nhiều",
      patternLabelEn: "Time reference overmarking",
      parentSummaryVi:
        "Người học đôi khi vừa dùng yesterday, already, before, vừa đổi thì quá nhiều; tiếng Anh cần một mốc thời gian rõ là đủ.",
      whyVi:
        "Tiếng Việt thường dùng từ chỉ thời gian để giữ mạch. Khi sang tiếng Anh, nếu thêm nhiều mốc thời gian cùng lúc, câu có thể dư hoặc rối thì.",
      howToHelpVi:
        "Gia đình có thể hỏi: câu này cần mốc nào nhất? Giữ một mốc chính rồi chọn thì tiếng Anh đi cùng mốc đó.",
      encouragementVi:
        "Người học đang muốn nói rõ thời gian; chỉ cần gọn lại để tiếng Anh mạch lạc hơn.",
      example: {
        learnerSays: "Yesterday I already finished it before.",
        naturalForm: "I finished it yesterday.",
        glossVi:
          "Ý là 'hôm qua tôi làm xong rồi'; tiếng Anh chỉ cần một mốc chính.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "indirect_main_point_delay",
      source: "interference",
      cefr: "B2",
      patternNameVi: "Chốt ý chính hơi muộn",
      patternLabelEn: "Delayed main point",
      parentSummaryVi:
        "Cách nói vòng trước khi vào ý chính có thể lịch sự trong tiếng Việt; tiếng Anh công việc thường muốn ý chính sớm.",
      whyVi:
        "Trong nhiều ngữ cảnh Việt, mở bằng bối cảnh và quan hệ giúp lời nói mềm hơn. Trong email hoặc bài nói tiếng Anh, người nghe thường chờ ý chính ngay đầu.",
      howToHelpVi:
        "Gia đình có thể luyện mẫu: ý chính trước, lý do sau, chi tiết cuối. Mỗi email thử viết câu đầu thật rõ.",
      encouragementVi:
        "Đây là khác biệt kỳ vọng giao tiếp; đổi thứ tự ý sẽ giúp người học nghe chuyên nghiệp hơn.",
      example: {
        learnerSays:
          "Recently our team has many tasks, and the deadline is close, so maybe I need support.",
        naturalForm: "I need support because our deadline is close.",
        glossVi: "Ý chính là cần hỗ trợ; tiếng Anh công việc nên nói sớm hơn.",
      },
      validated: false,
      reviewStatus: "draft",
      version: "2026-06-05.e2",
    },
    {
      tag: "direct_request_transfer",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Lời nhờ theo ngữ cảnh",
      patternLabelEn: "Direct request transfer",
      parentSummaryVi:
        "Một lời nhờ ngắn có thể bình thường trong tiếng Việt; tiếng Anh cần thêm please, could you, hoặc lý do tùy quan hệ.",
      whyVi:
        "Trong gia đình, lớp học, hoặc nơi quen biết, tiếng Việt dựa nhiều vào quan hệ và ngữ cảnh nên câu nhờ có thể rất ngắn mà vẫn lịch sự. Khi chuyển sang mã tiếng Anh, người nghe cần dấu hiệu lịch sự rõ hơn trong câu.",
      howToHelpVi:
        "Gia đình có thể luyện ba mức: Please..., Could you please..., Would it be possible to..., rồi chọn theo người nghe.",
      encouragementVi:
        "Đây là chuyển mã theo ngữ cảnh xã hội; thêm mẫu lịch sự giúp ý tốt của người học được nghe đúng.",
      example: {
        learnerSays: "Send me the file.",
        naturalForm: "Could you please send me the file?",
        glossVi:
          "Ý là 'gửi giúp tôi tệp đó'; tiếng Anh cần dấu hiệu nhờ lịch sự hơn.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics wording must frame this as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "formality_calibration",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Căn mức thân mật/trang trọng",
      patternLabelEn: "Formality calibration",
      parentSummaryVi:
        "Tiếng Việt có vai vế trong cách xưng hô; tiếng Anh dùng lựa chọn từ và độ trực tiếp để báo mức trang trọng.",
      whyVi:
        "Người Việt điều chỉnh quan hệ bằng xưng hô, kính ngữ, và cách nói theo tuổi/vai. Tiếng Anh ít vai vế hơn nhưng lại nhạy với mức trang trọng của cụm từ, lời mở, và lời kết.",
      howToHelpVi:
        "Gia đình có thể hỏi người học đang nói với bạn bè, thầy cô, khách hàng, hay sếp, rồi chọn mẫu casual, polite, hoặc formal.",
      encouragementVi:
        "Người học đã quen đọc ngữ cảnh quan hệ bằng tiếng Việt; chỉ cần học bộ tín hiệu tương ứng trong tiếng Anh.",
      example: {
        learnerSays: "Hey teacher, give me feedback.",
        naturalForm: "Could you please give me feedback, teacher?",
        glossVi:
          "Ý là nhờ thầy cô góp ý; tiếng Anh cần mức lịch sự phù hợp hơn.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics wording must frame this as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "apology_explanation_before_responsibility",
      source: "interference",
      cefr: "B2",
      patternNameVi: "Xin lỗi và nhận trách nhiệm",
      patternLabelEn: "Apology explanation order",
      parentSummaryVi:
        "Tiếng Việt có thể giải thích bối cảnh trước để giữ hòa khí; tiếng Anh thường muốn xin lỗi và nhận trách nhiệm trước.",
      whyVi:
        "Trong nhiều tình huống Việt, kể bối cảnh trước giúp người nghe hiểu và giảm căng thẳng. Trong tiếng Anh công việc, nếu giải thích trước, người nghe có thể tưởng là né trách nhiệm.",
      howToHelpVi:
        "Gia đình có thể luyện thứ tự: I'm sorry, I take responsibility, then explain briefly, then say what will be done next.",
      encouragementVi:
        "Ý định vẫn là tôn trọng người nghe; đổi thứ tự sẽ giúp lời xin lỗi được hiểu đúng trong mã tiếng Anh.",
      example: {
        learnerSays: "Because the traffic was bad, I came late.",
        naturalForm:
          "I'm sorry I was late. The traffic was bad, and I should have left earlier.",
        glossVi:
          "Ý là giải thích lý do đến muộn; tiếng Anh nên xin lỗi và nhận phần trách nhiệm trước.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics wording must frame this as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "refusal_softening_gap",
      source: "interference",
      cefr: "B2",
      patternNameVi: "Từ chối mềm trong tiếng Anh",
      patternLabelEn: "Refusal softening gap",
      parentSummaryVi:
        "Tiếng Việt có nhiều cách từ chối gián tiếp theo quan hệ; tiếng Anh cần mẫu mềm rõ như I'm afraid hoặc I wish I could.",
      whyVi:
        "Trong tiếng Việt, người nghe dựa vào ngữ cảnh, im lặng, hoặc lời vòng để hiểu lời từ chối. Trong tiếng Anh, nhất là công việc, lời từ chối cần vừa rõ vừa mềm bằng cụm cố định.",
      howToHelpVi:
        "Gia đình có thể luyện khung: Thank you, but I'm afraid I can't..., hoặc I wish I could, but...",
      encouragementVi:
        "Người học đang cố giữ lịch sự; học mẫu từ chối tiếng Anh sẽ giúp vừa rõ ý vừa giữ quan hệ.",
      example: {
        learnerSays: "I cannot join.",
        naturalForm: "I'm afraid I can't join this time.",
        glossVi:
          "Ý là không tham gia được; tiếng Anh thêm cụm mềm để giữ lịch sự.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics wording must frame this as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
    {
      tag: "greeting_small_talk_transfer",
      source: "interference",
      cefr: "B1",
      patternNameVi: "Chào hỏi và hỏi thăm",
      patternLabelEn: "Greeting convention transfer",
      parentSummaryVi:
        "Câu hỏi thăm kiểu Việt rất thân tình; tiếng Anh có quy ước small talk riêng để tránh nghe quá riêng tư.",
      whyVi:
        "Trong tiếng Việt, hỏi ăn cơm chưa, đi đâu đấy, hoặc hỏi chuyện gia đình có thể là cách mở lời thân mật. Khi chuyển sang tiếng Anh, vài câu tương tự cần đổi sang mẫu small talk phù hợp hơn.",
      howToHelpVi:
        "Gia đình có thể luyện các câu mở an toàn: How are you?, How was your weekend?, Nice to see you, rồi thêm câu hỏi theo mức thân quen.",
      encouragementVi:
        "Đây là khác biệt quy ước xã hội giữa hai mã ngôn ngữ; người học càng biết nhiều mẫu càng giao tiếp tự nhiên.",
      example: {
        learnerSays: "Have you eaten rice?",
        naturalForm: "How are you?",
        glossVi:
          "Ý là lời hỏi thăm thân tình; tiếng Anh thường dùng How are you? trong ngữ cảnh xã giao.",
      },
      validated: false,
      reviewStatus: "draft",
      reviewNote:
        "Pragmatics wording must frame this as context code-switching, never deficiency.",
      version: "2026-06-05.e2",
    },
  ];

export function listVnInterferenceFamilyBridgeExplanations(): FamilyBridgeExplanation[] {
  return VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS;
}

export function getVnInterferenceFamilyBridgeExplanation(
  tag: string
): FamilyBridgeExplanation | null {
  return (
    VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS.find(
      (entry) => entry.tag === tag
    ) ?? null
  );
}
