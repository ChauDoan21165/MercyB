// Punjabi Canada housing and transport pack for Vietnamese-speaking and
// English-speaking learners.
//
// Gurmukhi is primary. Romanization is a bridge only. Shahmukhi is awareness
// only, not a full course. Native review is deferred.

export type PunjabiHousingTransportCanadaTopic =
  | "repair_request"
  | "rent_question"
  | "viewing_request"
  | "address_confirmation"
  | "bus_train_help"
  | "lost_item"
  | "route_question"
  | "delay_update"
  | "customer_service"
  | "safety_boundary";

export type PunjabiHousingTransportCanadaItem = {
  id: string;
  topic: PunjabiHousingTransportCanadaTopic;
  situation_vi: string;
  situation_en: string;
  phrase_pa: string;
  romanization: string;
  meaning_vi: string;
  meaning_en: string;
  use_vi: string;
  use_en: string;
  canada_example_vi: string;
  canada_example_en: string;
  support_pa: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
};

export type PunjabiHousingTransportCanadaScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundary: string;
};

export const PUNJABI_HOUSING_TRANSPORT_CANADA_SCOPE: PunjabiHousingTransportCanadaScope = {
  name: "Punjabi Canada Housing and Transport Pack",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundary:
    "Language support for Canadian housing and transport conversations about repairs, rent questions, viewings, address confirmation, bus and train help, lost items, routes, delays, customer service, and safety boundaries; not legal advice.",
};

export const PUNJABI_HOUSING_TRANSPORT_CANADA_TOPICS: PunjabiHousingTransportCanadaTopic[] = [
  "repair_request",
  "rent_question",
  "viewing_request",
  "address_confirmation",
  "bus_train_help",
  "lost_item",
  "route_question",
  "delay_update",
  "customer_service",
  "safety_boundary",
];

export const PUNJABI_HOUSING_TRANSPORT_CANADA: PunjabiHousingTransportCanadaItem[] = [
  {
    id: "pa-ca-housing-transport-repair-001",
    topic: "repair_request",
    situation_vi: "Bạn cần báo đồ trong nhà thuê bị hỏng và xin người phụ trách sửa.",
    situation_en: "You need to report something broken in rental housing and ask the responsible person to repair it.",
    phrase_pa: "ਮੇਰੇ ਘਰ ਵਿੱਚ ਮੁਰੰਮਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਵੇਖੋ।",
    romanization: "mere ghar vich murammat di lor hai. kirpa karke isnu vekho.",
    meaning_vi: "Nhà tôi cần sửa chữa. Làm ơn xem việc này.",
    meaning_en: "My home needs a repair. Please look at this.",
    use_vi: "Dùng khi báo vòi nước, nhiệt, cửa, điện, hoặc thiết bị bị hỏng.",
    use_en: "Use when reporting a broken tap, heat, door, electrical issue, or appliance.",
    canada_example_vi: "Ở Canada, dùng với landlord, building manager, hoặc maintenance desk.",
    canada_example_en: "In Canada, use with a landlord, building manager, or maintenance desk.",
    support_pa: ["ਗਰਮੀ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", "ਕੀ ਤੁਸੀਂ ਸਮਾਂ ਦੱਸ ਸਕਦੇ ਹੋ?"],
    learner_trap_vi: "ਮੁਰੰਮਤ là sửa chữa; nói rõ vật nào hỏng thay vì chỉ nói nhà có vấn đề.",
    learner_trap_en: "ਮੁਰੰਮਤ means repair; name the broken item instead of only saying the home has a problem.",
  },
  {
    id: "pa-ca-housing-transport-rent-002",
    topic: "rent_question",
    situation_vi: "Bạn cần hỏi tiền thuê, ngày trả, hoặc biên nhận bằng câu ngắn.",
    situation_en: "You need to ask about rent, the payment date, or a receipt with a short line.",
    phrase_pa: "ਕਿਰਾਇਆ ਕਦੋਂ ਦੇਣਾ ਹੈ? ਕੀ ਮੈਨੂੰ ਰਸੀਦ ਮਿਲ ਸਕਦੀ ਹੈ?",
    romanization: "kiraya kadon dena hai? ki mainu rasid mil sakdi hai?",
    meaning_vi: "Khi nào cần trả tiền thuê? Tôi có thể nhận biên nhận không?",
    meaning_en: "When is rent due? Can I get a receipt?",
    use_vi: "Dùng để xác nhận thông tin thanh toán cơ bản, không tranh luận pháp lý.",
    use_en: "Use to confirm basic payment information, not to argue a legal issue.",
    canada_example_vi: "Hữu ích khi thuê phòng, apartment, basement suite, hoặc shared housing ở Canada.",
    canada_example_en: "Useful when renting a room, apartment, basement suite, or shared housing in Canada.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।", "ਕੀ ਮੈਂ ਈਮੇਲ ਨਾਲ ਪੁਸ਼ਟੀ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "ਕਿਰਾਇਆ là tiền thuê; luôn xin ngày và số tiền bằng văn bản nếu chưa chắc.",
    learner_trap_en: "ਕਿਰਾਇਆ means rent; ask for the date and amount in writing if unsure.",
  },
  {
    id: "pa-ca-housing-transport-viewing-003",
    topic: "viewing_request",
    situation_vi: "Bạn muốn đặt lịch xem phòng hoặc căn hộ.",
    situation_en: "You want to book a viewing for a room or apartment.",
    phrase_pa: "ਕੀ ਮੈਂ ਘਰ ਵੇਖਣ ਲਈ ਸਮਾਂ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
    romanization: "ki main ghar vekhan lai sama lai sakda/sakdi haan?",
    meaning_vi: "Tôi có thể đặt giờ để xem nhà không?",
    meaning_en: "Can I make a time to view the home?",
    use_vi: "Dùng khi nhắn tin, gọi điện, hoặc hỏi trực tiếp về listing.",
    use_en: "Use when texting, calling, or asking in person about a listing.",
    canada_example_vi: "Ở Canada, hỏi thêm địa chỉ, thời gian, và người liên hệ trước khi đi xem.",
    canada_example_en: "In Canada, ask for the address, time, and contact person before going to a viewing.",
    support_pa: ["ਪਤਾ ਕੀ ਹੈ?", "ਕੀ ਕਮਰਾ ਅਜੇ ਵੀ ਖਾਲੀ ਹੈ?"],
    learner_trap_vi: "ਵੇਖਣਾ là xem; đừng gửi thông tin cá nhân dài trước khi xác nhận listing cơ bản.",
    learner_trap_en: "ਵੇਖਣਾ means to view; do not send long personal details before confirming the basic listing.",
  },
  {
    id: "pa-ca-housing-transport-address-004",
    topic: "address_confirmation",
    situation_vi: "Bạn cần xác nhận địa chỉ, unit number, hoặc postal code cho nhà ở hoặc chuyến đi.",
    situation_en: "You need to confirm an address, unit number, or postal code for housing or travel.",
    phrase_pa: "ਕੀ ਤੁਸੀਂ ਪਤਾ ਦੁਬਾਰਾ ਕਹਿ ਸਕਦੇ ਹੋ? ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
    romanization: "ki tusin pata dubara kahi sakde ho? kirpa karke ih likh dio.",
    meaning_vi: "Bạn có thể nói lại địa chỉ không? Làm ơn viết ra.",
    meaning_en: "Can you say the address again? Please write it down.",
    use_vi: "Dùng khi nghe địa chỉ qua điện thoại hoặc tại quầy dịch vụ.",
    use_en: "Use when hearing an address by phone or at a service counter.",
    canada_example_vi: "Ở Canada, địa chỉ thường cần street number, street name, unit, city, province, và postal code.",
    canada_example_en: "In Canada, an address often needs a street number, street name, unit, city, province, and postal code.",
    support_pa: ["ਯੂਨਿਟ ਨੰਬਰ ਕੀ ਹੈ?", "ਪੋਸਟਲ ਕੋਡ ਕੀ ਹੈ?"],
    learner_trap_vi: "ਪਤਾ là địa chỉ; đừng bỏ unit number nếu bạn ở apartment hoặc basement unit.",
    learner_trap_en: "ਪਤਾ means address; do not skip the unit number if you live in an apartment or basement unit.",
  },
  {
    id: "pa-ca-housing-transport-bus-train-005",
    topic: "bus_train_help",
    situation_vi: "Bạn cần hỏi nhân viên hoặc người khác về xe bus, train, hoặc ticket.",
    situation_en: "You need to ask staff or another person about a bus, train, or ticket.",
    phrase_pa: "ਮੈਨੂੰ ਬੱਸ ਜਾਂ ਟ੍ਰੇਨ ਲਈ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਕਿੱਥੇ ਜਾਵਾਂ?",
    romanization: "mainu bus jaan train lai madad chahidi hai. main kithe javan?",
    meaning_vi: "Tôi cần giúp về xe bus hoặc train. Tôi nên đi đâu?",
    meaning_en: "I need help with the bus or train. Where should I go?",
    use_vi: "Dùng ở station, bus stop, transit counter, hoặc khi bị lạc hướng.",
    use_en: "Use at a station, bus stop, transit counter, or when you are unsure where to go.",
    canada_example_vi: "Dùng với transit staff ở Canada khi cần platform, stop, fare, hoặc transfer.",
    canada_example_en: "Use with Canadian transit staff when asking for a platform, stop, fare, or transfer.",
    support_pa: ["ਟਿਕਟ ਕਿੱਥੇ ਮਿਲਦੀ ਹੈ?", "ਕੀ ਇਹ ਸਹੀ ਪਲੇਟਫਾਰਮ ਹੈ?"],
    learner_trap_vi: "ਕਿੱਥੇ là ở đâu; dùng câu hỏi ngắn khi station ồn hoặc đông.",
    learner_trap_en: "ਕਿੱਥੇ means where; use a short question when the station is noisy or busy.",
  },
  {
    id: "pa-ca-housing-transport-lost-006",
    topic: "lost_item",
    situation_vi: "Bạn làm mất ví, phone, túi, hoặc giấy tờ trên transit hoặc trong building.",
    situation_en: "You lost a wallet, phone, bag, or document on transit or in a building.",
    phrase_pa: "ਮੇਰੀ ਚੀਜ਼ ਗੁੰਮ ਗਈ ਹੈ। ਮੈਂ ਲਾਸਟ ਐਂਡ ਫਾਊਂਡ ਕਿੱਥੇ ਪੁੱਛਾਂ?",
    romanization: "meri cheez gumm gai hai. main lost and found kithe puchhan?",
    meaning_vi: "Đồ của tôi bị mất. Tôi hỏi lost and found ở đâu?",
    meaning_en: "My item is lost. Where can I ask lost and found?",
    use_vi: "Dùng khi cần tìm đúng quầy hoặc kênh báo mất đồ.",
    use_en: "Use when you need the right desk or channel for a lost item report.",
    canada_example_vi: "Ở Canada, bus/train agency, library, mall, hoặc building desk có thể có lost and found.",
    canada_example_en: "In Canada, a bus or train agency, library, mall, or building desk may have lost and found.",
    support_pa: ["ਇਹ ਕੱਲ੍ਹ ਗੁੰਮ ਹੋਈ ਸੀ।", "ਕੀ ਮੈਂ ਫਾਰਮ ਭਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "ਗੁੰਮ ਗਈ là bị mất; mô tả đồ, ngày, giờ, và tuyến nếu biết.",
    learner_trap_en: "ਗੁੰਮ ਗਈ means lost; describe the item, date, time, and route if known.",
  },
  {
    id: "pa-ca-housing-transport-route-007",
    topic: "route_question",
    situation_vi: "Bạn cần hỏi tuyến nào đi tới địa chỉ hoặc khu vực cụ thể.",
    situation_en: "You need to ask which route goes to a specific address or area.",
    phrase_pa: "ਇਸ ਪਤੇ ਲਈ ਕਿਹੜੀ ਬੱਸ ਲੈਣੀ ਹੈ?",
    romanization: "is pate lai kihri bus laini hai?",
    meaning_vi: "Tôi nên đi xe bus nào tới địa chỉ này?",
    meaning_en: "Which bus should I take for this address?",
    use_vi: "Dùng khi đưa địa chỉ trên phone hoặc giấy cho người hỗ trợ xem.",
    use_en: "Use when showing an address on your phone or paper to someone helping you.",
    canada_example_vi: "Hữu ích khi đi tới clinic, school, job interview, hoặc rental viewing ở Canada.",
    canada_example_en: "Useful when going to a clinic, school, job interview, or rental viewing in Canada.",
    support_pa: ["ਕੀ ਮੈਨੂੰ ਟ੍ਰਾਂਸਫਰ ਕਰਨਾ ਪਵੇਗਾ?", "ਸਟਾਪ ਕਿਹੜਾ ਹੈ?"],
    learner_trap_vi: "ਕਿਹੜੀ là cái nào/tuyến nào; luôn xác nhận chiều đi đúng hướng.",
    learner_trap_en: "ਕਿਹੜੀ means which; always confirm the direction of travel.",
  },
  {
    id: "pa-ca-housing-transport-delay-008",
    topic: "delay_update",
    situation_vi: "Xe bus/train bị trễ hoặc bạn bị trễ hẹn vì transit.",
    situation_en: "The bus or train is delayed, or you are late to an appointment because of transit.",
    phrase_pa: "ਬੱਸ ਦੇਰ ਨਾਲ ਆ ਰਹੀ ਹੈ। ਮੈਂ ਥੋੜ੍ਹਾ ਲੇਟ ਹੋ ਜਾਵਾਂਗਾ/ਜਾਵਾਂਗੀ।",
    romanization: "bus der nal aa rahi hai. main thora late ho javanga/javangi.",
    meaning_vi: "Xe bus đang tới trễ. Tôi sẽ đến muộn một chút.",
    meaning_en: "The bus is delayed. I will be a little late.",
    use_vi: "Dùng để nhắn cho landlord, worker, clinic, trường, hoặc nơi làm khi transit trễ.",
    use_en: "Use to message a landlord, worker, clinic, school, or workplace when transit is delayed.",
    canada_example_vi: "Ở Canada mùa đông hoặc giờ cao điểm, delay có thể làm bạn tới trễ appointment.",
    canada_example_en: "In Canada during winter or rush hour, a delay can make you late for an appointment.",
    support_pa: ["ਮੈਂ ਰਸਤੇ ਵਿੱਚ ਹਾਂ।", "ਕੀ ਅਜੇ ਵੀ ਮਿਲ ਸਕਦੇ ਹਾਂ?"],
    learner_trap_vi: "ਦੇਰ ਨਾਲ means trễ; nhắn sớm thay vì chờ tới sau giờ hẹn.",
    learner_trap_en: "ਦੇਰ ਨਾਲ means late; message early instead of waiting until after the appointment time.",
  },
  {
    id: "pa-ca-housing-transport-service-009",
    topic: "customer_service",
    situation_vi: "Bạn cần xin hỗ trợ ở quầy dịch vụ về pass, fare, booking, complaint, hoặc thông tin nhà ở.",
    situation_en: "You need help at a service desk about a pass, fare, booking, complaint, or housing information.",
    phrase_pa: "ਮੈਨੂੰ ਗਾਹਕ ਸੇਵਾ ਨਾਲ ਗੱਲ ਕਰਨੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ।",
    romanization: "mainu gahak seva nal gall karni hai. kirpa karke meri madad karo.",
    meaning_vi: "Tôi muốn nói chuyện với bộ phận customer service. Làm ơn giúp tôi.",
    meaning_en: "I want to speak with customer service. Please help me.",
    use_vi: "Dùng khi bạn không biết đúng quầy hoặc cần chuyển tới người hỗ trợ.",
    use_en: "Use when you do not know the right desk or need to be directed to support.",
    canada_example_vi: "Dùng tại transit office, building office, rental office, hoặc service counter ở Canada.",
    canada_example_en: "Use at a Canadian transit office, building office, rental office, or service counter.",
    support_pa: ["ਮੇਰੇ ਕੋਲ ਇਹ ਟਿਕਟ ਹੈ।", "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਦੱਸੋ।"],
    learner_trap_vi: "ਗਾਹਕ ਸੇਵਾ là customer service; nêu mục tiêu cụ thể sau câu mở đầu.",
    learner_trap_en: "ਗਾਹਕ ਸੇਵਾ means customer service; state your specific goal after the opening line.",
  },
  {
    id: "pa-ca-housing-transport-safety-010",
    topic: "safety_boundary",
    situation_vi: "Nhà ở hoặc transit có nguy cơ an toàn ngay và bạn cần rời đi hoặc xin giúp.",
    situation_en: "Housing or transit has an immediate safety risk and you need to leave or ask for help.",
    phrase_pa: "ਮੈਨੂੰ ਇੱਥੇ ਸੁਰੱਖਿਅਤ ਮਹਿਸੂਸ ਨਹੀਂ ਹੋ ਰਿਹਾ। ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    romanization: "mainu itthe surakhiat mahsus nahin ho riha. mainu madad chahidi hai.",
    meaning_vi: "Tôi không cảm thấy an toàn ở đây. Tôi cần giúp đỡ.",
    meaning_en: "I do not feel safe here. I need help.",
    use_vi: "Dùng khi cần rời khu vực, gọi staff, hoặc tìm nơi an toàn hơn.",
    use_en: "Use when you need to leave the area, call staff, or find a safer place.",
    canada_example_vi: "Ở Canada, nếu có nguy hiểm khẩn cấp thật sự, gọi 911 hoặc nhờ người khác gọi.",
    canada_example_en: "In Canada, if there is a true immediate danger, call 911 or ask someone to call.",
    support_pa: ["ਕਿਰਪਾ ਕਰਕੇ ਸਟਾਫ਼ ਨੂੰ ਬੁਲਾਓ।", "ਕੀ ਮੈਂ ਇੱਥੇ ਉਡੀਕ ਕਰ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?"],
    learner_trap_vi: "ਸੁਰੱਖਿਅਤ là an toàn; câu này là ranh giới an toàn, không phải lời khuyên pháp lý.",
    learner_trap_en: "ਸੁਰੱਖਿਅਤ means safe; this is a safety boundary, not legal advice.",
  },
];

export default PUNJABI_HOUSING_TRANSPORT_CANADA;
