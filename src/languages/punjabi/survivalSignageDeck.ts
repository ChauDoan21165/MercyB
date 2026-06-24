// src/languages/punjabi/survivalSignageDeck.ts
//
// Punjabi survival signage and short notices for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a reading
// and search bridge only. No audio, pronunciation scoring, or native-review claim.

export type PunjabiSurvivalSignageDomain =
  | "clinic"
  | "school"
  | "transport"
  | "housing"
  | "workplace_safety"
  | "bank_service_counter"
  | "public_office"
  | "gurmukhi_romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiSurvivalSignageEntry = {
  id: string;
  domain: PunjabiSurvivalSignageDomain;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  whereSeen_vi: string;
  whereSeen_en: string;
  action_vi: string;
  action_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
};

export type PunjabiSurvivalSignageSection = {
  domain: PunjabiSurvivalSignageDomain;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  entries: ReadonlyArray<PunjabiSurvivalSignageEntry>;
};

export const PUNJABI_SURVIVAL_SIGNAGE_SCOPE = {
  vi: "Bộ biển hiệu này dùng Gurmukhi làm chính. Romanization giúp đọc và tìm kiếm, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết Punjabi có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This signage deck uses Gurmukhi as primary. Romanization supports reading and search, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const sections: ReadonlyArray<PunjabiSurvivalSignageSection> = [
  {
    domain: "clinic",
    title_vi: "Phòng khám",
    title_en: "Clinic",
    purpose_vi: "Đọc biển và thông báo ngắn trong phòng khám, bệnh viện, nhà thuốc.",
    purpose_en: "Read short signs and notices in clinics, hospitals, and pharmacies.",
    entries: [
      { id: "pa-sign-clinic-001", domain: "clinic", gurmukhi: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ", romanization: "registration", vi: "đăng ký / tiếp nhận", en: "registration", whereSeen_vi: "quầy tiếp nhận phòng khám", whereSeen_en: "clinic front desk", action_vi: "đến quầy này trước khi khám", action_en: "go to this desk before seeing the doctor", canadaPractical: true },
      { id: "pa-sign-clinic-002", domain: "clinic", gurmukhi: "ਡਾਕਟਰ", romanization: "daaktar", vi: "bác sĩ", en: "doctor", whereSeen_vi: "bảng phòng khám hoặc lịch hẹn", whereSeen_en: "clinic room sign or appointment sheet", action_vi: "tìm phòng hoặc tên bác sĩ", action_en: "look for the room or doctor's name", canadaPractical: true },
      { id: "pa-sign-clinic-003", domain: "clinic", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy", vi: "nhà thuốc", en: "pharmacy", whereSeen_vi: "bệnh viện, cửa hàng thuốc, bảng chỉ dẫn", whereSeen_en: "hospital, drugstore, directory sign", action_vi: "đến đây để lấy thuốc", action_en: "go here to pick up medicine", canadaPractical: true, learnerTrap: { vi: "ਫ có thể tìm bằng ph hoặc f khi dùng Latin.", en: "ਫ may be searched with ph or f in Latin." } },
      { id: "pa-sign-clinic-004", domain: "clinic", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", vi: "cấp cứu", en: "emergency", whereSeen_vi: "khu cấp cứu hoặc biển chỉ đường bệnh viện", whereSeen_en: "emergency area or hospital wayfinding", action_vi: "dùng khi cần trợ giúp y tế khẩn cấp", action_en: "use when urgent medical help is needed", canadaPractical: true },
      { id: "pa-sign-clinic-005", domain: "clinic", gurmukhi: "ਉਡੀਕ ਕਮਰਾ", romanization: "udik kamra", vi: "phòng chờ", en: "waiting room", whereSeen_vi: "phòng khám hoặc bệnh viện", whereSeen_en: "clinic or hospital", action_vi: "ngồi chờ đến lượt", action_en: "sit and wait for your turn", canadaPractical: true },
      { id: "pa-sign-clinic-006", domain: "clinic", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਮਾਸਕ ਪਾਓ", romanization: "kirpa karke mask pao", vi: "vui lòng đeo khẩu trang", en: "please wear a mask", whereSeen_vi: "phòng khám hoặc nơi chăm sóc sức khỏe", whereSeen_en: "clinic or healthcare setting", action_vi: "đeo khẩu trang trước khi vào", action_en: "put on a mask before entering", canadaPractical: true },
    ],
  },
  {
    domain: "school",
    title_vi: "Trường học",
    title_en: "School",
    purpose_vi: "Đọc thông báo ngắn ở trường, lớp, thư viện và văn phòng trường.",
    purpose_en: "Read short notices at school, class, library, and office areas.",
    entries: [
      { id: "pa-sign-school-001", domain: "school", gurmukhi: "ਦਫ਼ਤਰ", romanization: "daftar", vi: "văn phòng", en: "office", whereSeen_vi: "văn phòng trường hoặc cơ sở dịch vụ", whereSeen_en: "school office or service building", action_vi: "đến đây để hỏi thông tin", action_en: "go here to ask for information", canadaPractical: true },
      { id: "pa-sign-school-002", domain: "school", gurmukhi: "ਕਲਾਸ", romanization: "kalaas", vi: "lớp học", en: "class", whereSeen_vi: "lịch học hoặc cửa lớp", whereSeen_en: "schedule or classroom door", action_vi: "kiểm tra lớp cần vào", action_en: "check the class to enter", canadaPractical: true },
      { id: "pa-sign-school-003", domain: "school", gurmukhi: "ਲਾਇਬ੍ਰੇਰੀ", romanization: "library", vi: "thư viện", en: "library", whereSeen_vi: "trường học hoặc dịch vụ cộng đồng", whereSeen_en: "school or community service", action_vi: "đến đây để mượn sách hoặc dùng máy tính", action_en: "go here to borrow books or use computers", canadaPractical: true },
      { id: "pa-sign-school-004", domain: "school", gurmukhi: "ਹੋਮਵਰਕ ਜਮ੍ਹਾਂ ਕਰੋ", romanization: "homework jamma karo", vi: "nộp bài tập về nhà", en: "submit homework", whereSeen_vi: "bảng lớp hoặc cổng học trực tuyến", whereSeen_en: "class board or learning portal", action_vi: "nộp bài đúng nơi", action_en: "submit the work in the right place", canadaPractical: true },
      { id: "pa-sign-school-005", domain: "school", gurmukhi: "ਮਾਪੇ ਮੀਟਿੰਗ", romanization: "maape meeting", vi: "họp phụ huynh", en: "parent meeting", whereSeen_vi: "thư mời hoặc thông báo trường", whereSeen_en: "school notice or invitation", action_vi: "kiểm tra ngày giờ họp", action_en: "check the meeting date and time", canadaPractical: true },
      { id: "pa-sign-school-006", domain: "school", gurmukhi: "ਸਕੂਲ ਬੰਦ ਹੈ", romanization: "school band hai", vi: "trường đóng cửa", en: "school is closed", whereSeen_vi: "thông báo thời tiết hoặc ngày nghỉ", whereSeen_en: "weather or holiday notice", action_vi: "không đến trường vào thời gian đó", action_en: "do not go to school at that time", canadaPractical: true },
    ],
  },
  {
    domain: "transport",
    title_vi: "Giao thông",
    title_en: "Transport",
    purpose_vi: "Đọc biển ở bến xe, ga tàu, sân bay và phương tiện công cộng.",
    purpose_en: "Read signs at bus stops, stations, airports, and public transit.",
    entries: [
      { id: "pa-sign-transport-001", domain: "transport", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", vi: "bến xe buýt", en: "bus stand / bus stop", whereSeen_vi: "bến xe hoặc bản đồ tuyến", whereSeen_en: "bus stop or route map", action_vi: "đến đây để chờ xe buýt", action_en: "go here to wait for the bus", canadaPractical: true, learnerTrap: { vi: "ਅੱਡਾ có addak; đừng đọc thiếu phụ âm mạnh.", en: "ਅੱਡਾ has addak; do not drop the strengthened consonant." } },
      { id: "pa-sign-transport-002", domain: "transport", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ", romanization: "railway station", vi: "ga tàu", en: "railway station", whereSeen_vi: "ga tàu hoặc bảng chỉ đường", whereSeen_en: "train station or wayfinding sign", action_vi: "đi theo biển để đến ga", action_en: "follow the sign to reach the station", canadaPractical: true },
      { id: "pa-sign-transport-003", domain: "transport", gurmukhi: "ਟਿਕਟ", romanization: "tikat", vi: "vé", en: "ticket", whereSeen_vi: "máy bán vé, quầy vé, ứng dụng đi lại", whereSeen_en: "ticket machine, counter, transit app", action_vi: "mua hoặc xuất trình vé", action_en: "buy or show a ticket", canadaPractical: true },
      { id: "pa-sign-transport-004", domain: "transport", gurmukhi: "ਦਾਖਲਾ", romanization: "daakhla", vi: "lối vào / nhập", en: "entrance / admission", whereSeen_vi: "cửa vào, ga, trường, văn phòng", whereSeen_en: "entrance, station, school, office", action_vi: "đi vào theo lối này nếu phù hợp", action_en: "enter this way when appropriate", canadaPractical: true },
      { id: "pa-sign-transport-005", domain: "transport", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", vi: "lối ra", en: "exit", whereSeen_vi: "ga, sân bay, tòa nhà công cộng", whereSeen_en: "station, airport, public building", action_vi: "đi theo biển để ra ngoài", action_en: "follow the sign to leave", canadaPractical: true },
      { id: "pa-sign-transport-006", domain: "transport", gurmukhi: "ਦੇਰੀ", romanization: "deri", vi: "trễ / chậm", en: "delay", whereSeen_vi: "bảng giờ xe buýt, tàu, chuyến bay", whereSeen_en: "bus, train, or flight board", action_vi: "kiểm tra giờ cập nhật", action_en: "check the updated time", canadaPractical: true },
    ],
  },
  {
    domain: "housing",
    title_vi: "Nhà ở",
    title_en: "Housing",
    purpose_vi: "Đọc thông báo thuê nhà, sửa chữa, tiện ích và an toàn tòa nhà.",
    purpose_en: "Read rental, repair, utility, and building safety notices.",
    entries: [
      { id: "pa-sign-housing-001", domain: "housing", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", vi: "tiền thuê", en: "rent", whereSeen_vi: "hợp đồng thuê hoặc thông báo nhà ở", whereSeen_en: "lease or housing notice", action_vi: "kiểm tra số tiền và hạn trả", action_en: "check amount and due date", canadaPractical: true },
      { id: "pa-sign-housing-002", domain: "housing", gurmukhi: "ਮੁਰੰਮਤ", romanization: "murammat", vi: "sửa chữa", en: "repair / maintenance", whereSeen_vi: "thông báo tòa nhà hoặc yêu cầu bảo trì", whereSeen_en: "building notice or maintenance request", action_vi: "báo hoặc theo dõi việc sửa chữa", action_en: "report or track a repair", canadaPractical: true },
      { id: "pa-sign-housing-003", domain: "housing", gurmukhi: "ਪਾਣੀ ਬੰਦ ਹੈ", romanization: "pani band hai", vi: "nước bị cắt", en: "water is shut off", whereSeen_vi: "thông báo bảo trì tòa nhà", whereSeen_en: "building maintenance notice", action_vi: "chuẩn bị nước trước thời gian cắt", action_en: "prepare water before the shutoff", canadaPractical: true },
      { id: "pa-sign-housing-004", domain: "housing", gurmukhi: "ਬਿਜਲੀ ਬੰਦ ਹੈ", romanization: "bijli band hai", vi: "mất điện / điện bị cắt", en: "electricity is out / shut off", whereSeen_vi: "thông báo sự cố hoặc bảo trì", whereSeen_en: "outage or maintenance notice", action_vi: "kiểm tra thời gian khôi phục", action_en: "check restoration time", canadaPractical: true },
      { id: "pa-sign-housing-005", domain: "housing", gurmukhi: "ਧੂੰਮਰਪਾਨ ਮਨਾਹੀ ਹੈ", romanization: "dhumrapaan manahi hai", vi: "cấm hút thuốc", en: "smoking is prohibited", whereSeen_vi: "hành lang, thang máy, khu chung cư", whereSeen_en: "hallway, elevator, apartment area", action_vi: "không hút thuốc ở khu vực này", action_en: "do not smoke in this area", canadaPractical: true },
      { id: "pa-sign-housing-006", domain: "housing", gurmukhi: "ਕੂੜਾ ਇੱਥੇ ਪਾਓ", romanization: "kura itthe pao", vi: "bỏ rác ở đây", en: "put garbage here", whereSeen_vi: "phòng rác hoặc khu thùng rác", whereSeen_en: "garbage room or bin area", action_vi: "bỏ rác đúng nơi được chỉ định", action_en: "dispose of garbage in the right place", canadaPractical: true },
    ],
  },
  {
    domain: "workplace_safety",
    title_vi: "An toàn nơi làm việc",
    title_en: "Workplace Safety",
    purpose_vi: "Đọc biển cảnh báo và hướng dẫn an toàn cơ bản.",
    purpose_en: "Read basic warning and safety instruction signs.",
    entries: [
      { id: "pa-sign-work-001", domain: "workplace_safety", gurmukhi: "ਸੁਰੱਖਿਆ ਪਹਿਲਾਂ", romanization: "surakhia pehlaan", vi: "an toàn trước tiên", en: "safety first", whereSeen_vi: "nhà kho, xưởng, nơi làm việc", whereSeen_en: "warehouse, shop floor, workplace", action_vi: "ưu tiên quy tắc an toàn", action_en: "prioritize safety rules", canadaPractical: true },
      { id: "pa-sign-work-002", domain: "workplace_safety", gurmukhi: "ਖਤਰਾ", romanization: "khatra", vi: "nguy hiểm", en: "danger", whereSeen_vi: "máy móc, khu vực cấm, công trường", whereSeen_en: "machines, restricted areas, worksites", action_vi: "dừng lại và đọc hướng dẫn", action_en: "stop and read instructions", canadaPractical: true, learnerTrap: { vi: "ਖ là kh bật hơi; đừng đọc như ਕ.", en: "ਖ is aspirated kh; do not read it like ਕ." } },
      { id: "pa-sign-work-003", domain: "workplace_safety", gurmukhi: "ਸਾਵਧਾਨ", romanization: "saavdhaan", vi: "cẩn thận", en: "caution", whereSeen_vi: "sàn ướt, máy móc, khu sửa chữa", whereSeen_en: "wet floor, machinery, repair area", action_vi: "đi chậm và chú ý", action_en: "move slowly and pay attention", canadaPractical: true },
      { id: "pa-sign-work-004", domain: "workplace_safety", gurmukhi: "ਹੈਲਮੈਟ ਪਾਓ", romanization: "helmet pao", vi: "đội mũ bảo hộ", en: "wear a helmet", whereSeen_vi: "công trường hoặc khu kho", whereSeen_en: "construction site or warehouse", action_vi: "đội mũ bảo hộ trước khi vào", action_en: "put on a helmet before entering", canadaPractical: true },
      { id: "pa-sign-work-005", domain: "workplace_safety", gurmukhi: "ਦਸਤਾਨੇ ਪਾਓ", romanization: "dastane pao", vi: "đeo găng tay", en: "wear gloves", whereSeen_vi: "khu chế biến, kho, phòng thí nghiệm", whereSeen_en: "processing area, warehouse, lab", action_vi: "đeo găng tay bảo hộ", action_en: "wear protective gloves", canadaPractical: true },
      { id: "pa-sign-work-006", domain: "workplace_safety", gurmukhi: "ਐਮਰਜੈਂਸੀ ਨਿਕਾਸ", romanization: "emergency nikaas", vi: "lối thoát hiểm", en: "emergency exit", whereSeen_vi: "tòa nhà, kho, trường, văn phòng", whereSeen_en: "building, warehouse, school, office", action_vi: "dùng khi cần thoát hiểm", action_en: "use when evacuation is needed", canadaPractical: true },
    ],
  },
  {
    domain: "bank_service_counter",
    title_vi: "Ngân hàng và quầy dịch vụ",
    title_en: "Bank and Service Counter",
    purpose_vi: "Đọc biển ở ngân hàng, quầy thanh toán và dịch vụ khách hàng.",
    purpose_en: "Read signs at banks, checkout counters, and customer service desks.",
    entries: [
      { id: "pa-sign-bank-001", domain: "bank_service_counter", gurmukhi: "ਬੈਂਕ", romanization: "bank", vi: "ngân hàng", en: "bank", whereSeen_vi: "ngân hàng hoặc bảng chỉ đường dịch vụ", whereSeen_en: "bank or service directory", action_vi: "đến đây để làm giao dịch ngân hàng", action_en: "go here for banking service", canadaPractical: true, learnerTrap: { vi: "ੈਂ không khớp hoàn toàn với chính tả tiếng Việt; nhìn Gurmukhi.", en: "ੈਂ does not map neatly to Vietnamese spelling; check Gurmukhi." } },
      { id: "pa-sign-bank-002", domain: "bank_service_counter", gurmukhi: "ਨਕਦ", romanization: "nakad", vi: "tiền mặt", en: "cash", whereSeen_vi: "quầy thanh toán hoặc máy ATM", whereSeen_en: "checkout counter or ATM", action_vi: "dùng khi trả hoặc rút tiền mặt", action_en: "use for paying or withdrawing cash", canadaPractical: true },
      { id: "pa-sign-bank-003", domain: "bank_service_counter", gurmukhi: "ਕਾਰਡ", romanization: "card", vi: "thẻ", en: "card", whereSeen_vi: "quầy thanh toán, ngân hàng, máy POS", whereSeen_en: "checkout, bank, POS machine", action_vi: "dùng khi thanh toán bằng thẻ", action_en: "use when paying by card", canadaPractical: true },
      { id: "pa-sign-bank-004", domain: "bank_service_counter", gurmukhi: "ਜਮ੍ਹਾਂ", romanization: "jamma", vi: "gửi/nộp tiền hoặc hồ sơ", en: "deposit / submit", whereSeen_vi: "ngân hàng, trường, văn phòng", whereSeen_en: "bank, school, office", action_vi: "nộp tiền hoặc giấy tờ theo ngữ cảnh", action_en: "deposit money or submit documents by context", canadaPractical: true },
      { id: "pa-sign-bank-005", domain: "bank_service_counter", gurmukhi: "ਕਢਵਾਉਣਾ", romanization: "kadhvauna", vi: "rút tiền", en: "withdraw", whereSeen_vi: "ATM hoặc biểu mẫu ngân hàng", whereSeen_en: "ATM or bank form", action_vi: "rút tiền từ tài khoản", action_en: "withdraw money from an account", canadaPractical: true },
      { id: "pa-sign-bank-006", domain: "bank_service_counter", gurmukhi: "ਗਾਹਕ ਸੇਵਾ", romanization: "gaahak seva", vi: "dịch vụ khách hàng", en: "customer service", whereSeen_vi: "cửa hàng, ngân hàng, văn phòng dịch vụ", whereSeen_en: "store, bank, service office", action_vi: "đến đây để hỏi hoặc giải quyết vấn đề", action_en: "go here to ask or resolve an issue", canadaPractical: true, learnerTrap: { vi: "ਸੇਵਾ có ੇ; đừng đọc như seva theo tiếng Anh hoàn toàn.", en: "ਸੇਵਾ has ੇ; do not read it only through English spelling." } },
    ],
  },
  {
    domain: "public_office",
    title_vi: "Văn phòng công",
    title_en: "Public Office",
    purpose_vi: "Đọc biển ở văn phòng chính phủ, thư viện, bưu điện và dịch vụ công.",
    purpose_en: "Read signs at government offices, libraries, post offices, and public services.",
    entries: [
      { id: "pa-sign-public-001", domain: "public_office", gurmukhi: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ", romanization: "sarkari daftar", vi: "văn phòng chính phủ", en: "government office", whereSeen_vi: "tòa nhà dịch vụ công", whereSeen_en: "public-service building", action_vi: "đến đây để xử lý giấy tờ chính phủ", action_en: "go here for government paperwork", canadaPractical: true },
      { id: "pa-sign-public-002", domain: "public_office", gurmukhi: "ਜਾਣਕਾਰੀ", romanization: "jaankari", vi: "thông tin", en: "information", whereSeen_vi: "quầy hỏi đáp hoặc biển chỉ dẫn", whereSeen_en: "information desk or directory sign", action_vi: "đến đây để hỏi thông tin", action_en: "go here to ask for information", canadaPractical: true },
      { id: "pa-sign-public-003", domain: "public_office", gurmukhi: "ਫਾਰਮ", romanization: "form", vi: "mẫu đơn", en: "form", whereSeen_vi: "văn phòng công, trường, ngân hàng", whereSeen_en: "public office, school, bank", action_vi: "lấy hoặc điền mẫu đơn", action_en: "take or fill out a form", canadaPractical: true },
      { id: "pa-sign-public-004", domain: "public_office", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", vi: "giấy tờ tùy thân", en: "identification document", whereSeen_vi: "quầy dịch vụ, văn phòng công, ngân hàng", whereSeen_en: "service counter, public office, bank", action_vi: "chuẩn bị giấy tờ tùy thân", action_en: "prepare identification", canadaPractical: true },
      { id: "pa-sign-public-005", domain: "public_office", gurmukhi: "ਡਾਕ ਘਰ", romanization: "daak ghar", vi: "bưu điện", en: "post office", whereSeen_vi: "bưu điện hoặc bản đồ dịch vụ", whereSeen_en: "post office or service map", action_vi: "đến đây để gửi thư hoặc bưu kiện", action_en: "go here to send mail or parcels", canadaPractical: true },
      { id: "pa-sign-public-006", domain: "public_office", gurmukhi: "ਮੁਲਾਕਾਤ ਲਾਜ਼ਮੀ ਹੈ", romanization: "mulaqat lazmi hai", vi: "bắt buộc có cuộc hẹn", en: "appointment required", whereSeen_vi: "văn phòng dịch vụ hoặc phòng khám", whereSeen_en: "service office or clinic", action_vi: "đặt lịch trước khi đến", action_en: "book an appointment before going", canadaPractical: true },
    ],
  },
  {
    domain: "gurmukhi_romanization_bridge",
    title_vi: "Cầu nối đọc Gurmukhi và romanization",
    title_en: "Gurmukhi and Romanization Bridge",
    purpose_vi: "Biển dễ tìm sai nếu chỉ dùng chữ Latin.",
    purpose_en: "Signs that are easy to mis-search with Latin letters only.",
    entries: [
      { id: "pa-sign-bridge-001", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", vi: "nhà thuốc", en: "pharmacy", whereSeen_vi: "nhà thuốc hoặc bệnh viện", whereSeen_en: "pharmacy or hospital", action_vi: "thử ph/f khi tìm bằng Latin, xác nhận bằng ਫ", action_en: "try ph/f in Latin search, confirm with ਫ", canadaPractical: true, learnerTrap: { vi: "ਫ có thể được romanize là ph hoặc f.", en: "ਫ may be romanized as ph or f." } },
      { id: "pa-sign-bridge-002", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਵੈਨਕੂਵਰ", romanization: "vancouver/wancouver", vi: "Vancouver", en: "Vancouver", whereSeen_vi: "tên nơi chốn ở Canada", whereSeen_en: "Canadian place name", action_vi: "nhận diện ਵ dù Latin có v/w", action_en: "recognize ਵ even when Latin varies v/w", canadaPractical: true, learnerTrap: { vi: "ਵ có thể gần v hoặc w tùy giọng.", en: "ਵ may be close to v or w depending on accent." } },
      { id: "pa-sign-bridge-003", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਬ੍ਰੈਂਪਟਨ", romanization: "brampton", vi: "Brampton", en: "Brampton", whereSeen_vi: "tên thành phố có cộng đồng Punjabi lớn", whereSeen_en: "city name with a large Punjabi community", action_vi: "đọc theo khối ਬ੍ਰੈਂ + ਪਟਨ", action_en: "read in chunks ਬ੍ਰੈਂ + ਪਟਨ", canadaPractical: true },
      { id: "pa-sign-bridge-004", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਸਟੇਸ਼ਨ", romanization: "station", vi: "trạm / nhà ga", en: "station", whereSeen_vi: "giao thông công cộng", whereSeen_en: "public transit signage", action_vi: "nhìn ਸ਼/ਸ਼ trong Gurmukhi thay vì chỉ đoán từ English", action_en: "notice ਸ਼/ਸ਼ in Gurmukhi instead of guessing only from English", canadaPractical: true, learnerTrap: { vi: "ਸ਼/ਸ਼ thường gợi sh trong romanization.", en: "ਸ਼/ਸ਼ often cues sh in romanization." } },
      { id: "pa-sign-bridge-005", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਮਾਂ", romanization: "maan/man", vi: "mẹ", en: "mother", whereSeen_vi: "thông báo trường hoặc biểu mẫu gia đình", whereSeen_en: "school notice or family form", action_vi: "nhận diện bindi, thử maan/man khi tìm", action_en: "notice bindi, try maan/man when searching", learnerTrap: { vi: "ਂ có thể bị lược trong tìm kiếm Latin.", en: "ਂ may be omitted in Latin search." } },
      { id: "pa-sign-bridge-006", domain: "gurmukhi_romanization_bridge", gurmukhi: "ਕੀ ਲੋੜ ਹੈ", romanization: "ki/kii lor hai", vi: "cần gì", en: "what is needed", whereSeen_vi: "quầy dịch vụ hoặc tin nhắn hỗ trợ", whereSeen_en: "service counter or support message", action_vi: "nhìn ੀ trong ਕੀ khi đọc", action_en: "notice ੀ in ਕੀ when reading", canadaPractical: true },
    ],
  },
  {
    domain: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    purpose_vi: "Giữ trọng tâm Gurmukhi và chỉ nhắc hệ chữ khác để nhận biết.",
    purpose_en: "Keep Gurmukhi primary and mention the other script only for awareness.",
    entries: [
      { id: "pa-sign-shahmukhi-001", domain: "shahmukhi_awareness", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", vi: "đọc bằng Gurmukhi", en: "read in Gurmukhi", whereSeen_vi: "ghi chú học tập trong khóa này", whereSeen_en: "study note in this course", action_vi: "dùng Gurmukhi làm nguồn chính", action_en: "use Gurmukhi as the primary source", learnerTrap: { vi: "Punjabi cũng có Shahmukhi trong một số cộng đồng, nhưng đây không phải khóa Shahmukhi đầy đủ.", en: "Punjabi also has Shahmukhi in some communities, but this is not a full Shahmukhi course." } },
    ],
  },
];

export const PUNJABI_SURVIVAL_SIGNAGE_DECK = sections;

export const PUNJABI_SURVIVAL_SIGNAGE_ENTRIES: ReadonlyArray<PunjabiSurvivalSignageEntry> =
  sections.flatMap((section) => section.entries);

export default PUNJABI_SURVIVAL_SIGNAGE_DECK;
