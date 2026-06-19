// src/languages/thai/familyDailyLife.ts
//
// Thai family & daily-life language support for Vietnamese-speaking AND
// English-speaking learners. Built by the A3 agent (Wave 5).
//
// Each entry is a SCENARIO CARD: a short situation, the useful phrases you'd
// reach for in it, one model response, and the common mistake a VI/EN learner
// makes. Thai is in script first, then a learner romanization (loosely RTGS),
// with Vietnamese AND English glosses throughout — this pack is meant to be
// app-ready and skimmable on a phone.
//
// Topics: family, home, chores, schedule, school pickup, neighbor, invitation,
// illness at home, daily routine, simple feelings.
//
// Self-contained: the Thai vertical has no shared phrasebook registry yet, so
// the types live here. Native review is DEFERRED — register and politeness
// particles are provisional; no native authority is claimed. Politeness
// particles ครับ/ค่ะ are shown in some lines as a model; learners should match
// the particle to their OWN gender (ครับ male / ค่ะ female).

// ── Types ───────────────────────────────────────────────────────────────────

export type ThaiDailyLifeTopic =
  | "family"
  | "home"
  | "chores"
  | "schedule"
  | "school_pickup"
  | "neighbor"
  | "invitation"
  | "illness_home"
  | "daily_routine"
  | "feelings";

export type ThaiPhrase = {
  /** Thai script. */
  th: string;
  /** Romanization. */
  rtgs: string;
  vi: string;
  en: string;
};

export type ThaiDailyLifeItem = {
  id: string;
  topic: ThaiDailyLifeTopic;
  /** The situation, set for a Vietnamese reader. */
  scenario_vi: string;
  /** The situation, set for an English reader. */
  scenario_en: string;
  /** Phrases you'd reach for in this scenario. */
  useful_phrases: ThaiPhrase[];
  /** One model thing to say / reply. */
  model_response: ThaiPhrase;
  /** The common mistake a VI/EN learner makes. */
  common_mistake_vi: string;
  common_mistake_en: string;
};

// Compact builder so each card stays readable.
function card(
  id: string,
  topic: ThaiDailyLifeTopic,
  scenario: [string, string],
  phrases: Array<[string, string, string, string]>,
  response: [string, string, string, string],
  mistake: [string, string],
): ThaiDailyLifeItem {
  return {
    id,
    topic,
    scenario_vi: scenario[0],
    scenario_en: scenario[1],
    useful_phrases: phrases.map(([th, rtgs, vi, en]) => ({ th, rtgs, vi, en })),
    model_response: { th: response[0], rtgs: response[1], vi: response[2], en: response[3] },
    common_mistake_vi: mistake[0],
    common_mistake_en: mistake[1],
  };
}

// ── Family ──────────────────────────────────────────────────────────────────

const family: ThaiDailyLifeItem[] = [
  card("thai_fdl_family_intro", "family",
    ["Giới thiệu các thành viên trong gia đình.", "Introducing your family members."],
    [
      ["นี่คือพ่อกับแม่ของผม", "nîi khue phâaw gàp mâae khǎawng phǒm", "Đây là bố và mẹ tôi.", "These are my father and mother."],
      ["ผมมีพี่ชายหนึ่งคน", "phǒm mii phîi-chaai nùeng khon", "Tôi có một anh trai.", "I have one older brother."],
    ],
    ["ครอบครัวผมมีสี่คนครับ", "khrâawp-khrua phǒm mii sìi khon khráp", "Gia đình tôi có bốn người.", "My family has four people."],
    ["Quên loại từ 'คน' khi đếm người.", "Forgetting the classifier 'คน' when counting people."]),
  card("thai_fdl_family_ask", "family",
    ["Hỏi về gia đình của ai đó.", "Asking about someone's family."],
    [
      ["ครอบครัวคุณมีกี่คน", "khrâawp-khrua khun mii gìi khon", "Gia đình bạn có mấy người?", "How many are in your family?"],
      ["คุณมีพี่น้องไหม", "khun mii phîi-náawng mái", "Bạn có anh chị em không?", "Do you have siblings?"],
    ],
    ["บ้านคุณอยู่กันกี่คนครับ", "bâan khun yùu gan gìi khon khráp", "Nhà bạn có mấy người ở cùng?", "How many people live in your home?"],
    ["Dùng 'ตัว' thay 'คน' khi hỏi số người.", "Using 'ตัว' instead of 'คน' for people."]),
  card("thai_fdl_family_jobs", "family",
    ["Nói về nghề nghiệp của cha mẹ.", "Talking about your parents' jobs."],
    [
      ["พ่อผมเป็นชาวนา", "phâaw phǒm bpen chaao-naa", "Bố tôi là nông dân.", "My father is a farmer."],
      ["แม่ผมทำงานที่โรงพยาบาล", "mâae phǒm tham-ngaan thîi roong-phá-yaa-baan", "Mẹ tôi làm ở bệnh viện.", "My mother works at a hospital."],
    ],
    ["พ่อแม่ผมทำงานหนักครับ", "phâaw-mâae phǒm tham-ngaan nàk khráp", "Bố mẹ tôi làm việc vất vả.", "My parents work hard."],
    ["Thêm 'เป็น' trước tính từ: 'เป็นหนัก' (sai). Nghề nghiệp mới dùng 'เป็น'.", "Adding 'เป็น' before an adjective; only nouns/jobs take 'เป็น'."]),
  card("thai_fdl_family_siblings", "family",
    ["Nói về số anh chị em.", "Talking about your siblings."],
    [
      ["ผมมีน้องสาวสองคน", "phǒm mii náawng-sǎao sǎawng khon", "Tôi có hai em gái.", "I have two younger sisters."],
      ["ผมเป็นลูกคนโต", "phǒm bpen lûuk khon dtoo", "Tôi là con cả.", "I'm the eldest child."],
    ],
    ["ผมเป็นลูกคนเดียวครับ", "phǒm bpen lûuk khon diao khráp", "Tôi là con một.", "I'm an only child."],
    ["Lẫn 'พี่' (lớn hơn) và 'น้อง' (nhỏ hơn).", "Mixing up 'พี่' (older) and 'น้อง' (younger)."]),
  card("thai_fdl_family_grandparents", "family",
    ["Nói về ông bà.", "Talking about grandparents."],
    [
      ["ปู่กับย่าอยู่ต่างจังหวัด", "bpùu gàp yâa yùu dtàang-jang-wàt", "Ông bà (nội) ở tỉnh khác.", "My (paternal) grandparents live in another province."],
      ["ผมไปเยี่ยมตายายทุกปีใหม่", "phǒm bpai yîam dtaa-yaai thúk bpii-mài", "Tôi về thăm ông bà (ngoại) mỗi dịp năm mới.", "I visit my (maternal) grandparents every New Year."],
    ],
    ["คุณยายอายุแปดสิบแล้วครับ", "khun-yaai aa-yú bpàaet-sìp láeo khráp", "Bà ngoại tôi đã tám mươi tuổi.", "My grandmother is already eighty."],
    ["Dùng chung một từ cho ông bà — Thái phân biệt nội (ปู่/ย่า) và ngoại (ตา/ยาย).", "Using one word for grandparents — Thai splits paternal (ปู่/ย่า) and maternal (ตา/ยาย)."]),
  card("thai_fdl_family_meal", "family",
    ["Cả nhà ăn cơm cùng nhau.", "The family eats together."],
    [
      ["กินข้าวพร้อมกันนะ", "gin khâao phráawm gan ná", "Ăn cơm cùng nhau nhé.", "Let's eat together."],
      ["ใครหิวบ้าง", "khrai hǐu bâang", "Ai đói nào?", "Who's hungry?"],
    ],
    ["มากินข้าวกันเถอะ", "maa gin khâao gan thòe", "Lại đây ăn cơm nào.", "Come, let's eat."],
    ["Quên 'กัน' (cùng nhau) làm câu mất nghĩa tập thể.", "Dropping 'กัน' (together) loses the 'together' sense."]),
];

// ── Home ────────────────────────────────────────────────────────────────────

const home: ThaiDailyLifeItem[] = [
  card("thai_fdl_home_describe", "home",
    ["Mô tả ngôi nhà của bạn.", "Describing your house."],
    [
      ["บ้านผมเป็นบ้านหลังเล็ก", "bâan phǒm bpen bâan lǎng lék", "Nhà tôi là một ngôi nhà nhỏ.", "My house is a small house."],
      ["มีสองชั้น", "mii sǎawng chán", "Có hai tầng.", "It has two floors."],
    ],
    ["บ้านผมอยู่ในซอยเงียบๆ ครับ", "bâan phǒm yùu nai saauy ngîap-ngîap khráp", "Nhà tôi ở trong một con hẻm yên tĩnh.", "My house is on a quiet lane."],
    ["Đặt tính từ trước danh từ: 'เล็กบ้าน'. Đúng là 'บ้านเล็ก'.", "Fronting the adjective: 'เล็กบ้าน'. It's 'บ้านเล็ก'."]),
  card("thai_fdl_home_rooms", "home",
    ["Nói về các phòng trong nhà.", "Naming the rooms in the house."],
    [
      ["ห้องนอนอยู่ชั้นบน", "hâawng-naawn yùu chán-bon", "Phòng ngủ ở tầng trên.", "The bedroom is upstairs."],
      ["ห้องครัวอยู่ข้างหลัง", "hâawng-khrua yùu khâang-lǎng", "Nhà bếp ở phía sau.", "The kitchen is at the back."],
    ],
    ["ห้องน้ำอยู่ตรงนั้นครับ", "hâawng-náam yùu dtrong-nán khráp", "Nhà vệ sinh ở chỗ kia.", "The bathroom is over there."],
    ["Lẫn 'ห้องน้ำ' (nhà vệ sinh) với 'ห้องนอน' (phòng ngủ).", "Confusing 'ห้องน้ำ' (bathroom) with 'ห้องนอน' (bedroom)."]),
  card("thai_fdl_home_where", "home",
    ["Hỏi đồ vật trong nhà ở đâu.", "Asking where something is at home."],
    [
      ["รีโมทอยู่ไหน", "rii-môot yùu nǎi", "Cái điều khiển ở đâu?", "Where's the remote?"],
      ["กุญแจวางไว้บนโต๊ะ", "gun-jaae waang wái bon dtó", "Chìa khóa để trên bàn.", "The keys are on the table."],
    ],
    ["อยู่บนโต๊ะในห้องนั่งเล่นครับ", "yùu bon dtó nai hâawng-nâng-lên khráp", "Ở trên bàn trong phòng khách.", "It's on the table in the living room."],
    ["Bỏ 'อยู่' khi hỏi vị trí: 'รีโมทไหน'.", "Dropping 'อยู่' in a location question: 'รีโมทไหน'."]),
  card("thai_fdl_home_messy", "home",
    ["Nhà bừa bộn, cần dọn.", "The house is messy and needs tidying."],
    [
      ["บ้านรกมากเลย", "bâan rók mâak loei", "Nhà bừa quá đi.", "The house is so messy."],
      ["ช่วยเก็บของหน่อย", "chûay gèp khǎawng nàauy", "Giúp dọn đồ một chút nhé.", "Help tidy up a bit, please."],
    ],
    ["เดี๋ยวเก็บให้เรียบร้อยครับ", "dǐao gèp hâi rîap-ráauy khráp", "Lát nữa tôi dọn gọn gàng.", "I'll tidy it up neatly in a moment."],
    ["Dùng 'สกปรก' (bẩn) khi ý là 'bừa bộn' (รก). Hai từ khác nhau.", "Using 'สกปรก' (dirty) when you mean 'messy' (รก)."]),
  card("thai_fdl_home_welcome", "home",
    ["Mời khách vào nhà.", "Welcoming a guest into your home."],
    [
      ["เชิญเข้ามาข้างในครับ", "chern khâo maa khâang-nai khráp", "Mời vào trong ạ.", "Please come inside."],
      ["ถอดรองเท้าก่อนนะครับ", "thàawt raawng-tháo gàawn ná khráp", "Cởi giày trước nhé.", "Please take off your shoes first."],
    ],
    ["นั่งตามสบายเลยครับ", "nâng dtaam sà-baai loei khráp", "Cứ ngồi tự nhiên ạ.", "Make yourself comfortable."],
    ["Quên mời cởi giày — vào nhà Thái thường bỏ giày ngoài cửa.", "Forgetting the shoes-off custom — Thai homes remove shoes at the door."]),
  card("thai_fdl_home_location", "home",
    ["Nói bạn sống ở đâu.", "Saying where you live."],
    [
      ["ผมอยู่แถวนี้เอง", "phǒm yùu thǎaeo níi eeng", "Tôi ở ngay quanh đây.", "I live right around here."],
      ["บ้านผมอยู่ใกล้ตลาด", "bâan phǒm yùu glâi dtà-làat", "Nhà tôi ở gần chợ.", "My house is near the market."],
    ],
    ["เดินจากที่นี่สิบนาทีครับ", "dern jàak thîi-nîi sìp naa-thii khráp", "Đi bộ từ đây mười phút.", "It's a ten-minute walk from here."],
    ["Dùng 'ที่ไหน' (ở đâu, để hỏi) khi muốn nói 'ở đây/đó'.", "Using 'ที่ไหน' (where? — a question) when you mean 'here/there'."]),
];

// ── Chores ──────────────────────────────────────────────────────────────────

const chores: ThaiDailyLifeItem[] = [
  card("thai_fdl_chores_dishes", "chores",
    ["Rửa bát đĩa sau bữa ăn.", "Washing dishes after a meal."],
    [
      ["ผมจะล้างจานเอง", "phǒm jà láang jaan eeng", "Để tôi rửa bát.", "I'll wash the dishes."],
      ["ช่วยล้างจานหน่อยได้ไหม", "chûay láang jaan nàauy dâai mái", "Giúp rửa bát được không?", "Could you help wash the dishes?"],
    ],
    ["เดี๋ยวผมล้างให้ครับ", "dǐao phǒm láang hâi khráp", "Để lát tôi rửa cho.", "I'll wash them in a bit."],
    ["Dùng 'ซัก' (giặt vải) cho bát đĩa. Rửa bát dùng 'ล้าง'.", "Using 'ซัก' (wash fabric) for dishes; dishes take 'ล้าง'."]),
  card("thai_fdl_chores_sweep", "chores",
    ["Quét và lau nhà.", "Sweeping and mopping the house."],
    [
      ["ผมจะกวาดบ้าน", "phǒm jà gwàat bâan", "Tôi sẽ quét nhà.", "I'll sweep the house."],
      ["ถูพื้นด้วยนะ", "thǔu phúen dûay ná", "Lau sàn luôn nhé.", "Mop the floor too, ok?"],
    ],
    ["บ้านสะอาดแล้วครับ", "bâan sà-àat láeo khráp", "Nhà sạch rồi ạ.", "The house is clean now."],
    ["Lẫn 'กวาด' (quét) và 'ถู' (lau). Khác động tác.", "Mixing 'กวาด' (sweep) and 'ถู' (mop) — different actions."]),
  card("thai_fdl_chores_laundry", "chores",
    ["Giặt quần áo.", "Doing the laundry."],
    [
      ["วันนี้ต้องซักผ้า", "wan-níi dtâawng sák phâa", "Hôm nay phải giặt đồ.", "I have to do laundry today."],
      ["ตากผ้าให้แห้งด้วย", "dtàak phâa hâi hâeng dûay", "Phơi đồ cho khô nữa nhé.", "Hang the clothes to dry too."],
    ],
    ["ซักเสร็จแล้วเอาไปตากครับ", "sák sèt láeo ao bpai dtàak khráp", "Giặt xong thì đem phơi.", "Once washed, hang it out to dry."],
    ["Dùng 'ล้าง' (rửa) cho quần áo. Giặt vải dùng 'ซัก'.", "Using 'ล้าง' (rinse) for clothes; washing fabric is 'ซัก'."]),
  card("thai_fdl_chores_cook", "chores",
    ["Nấu cơm tối.", "Cooking dinner."],
    [
      ["เย็นนี้ผมทำกับข้าวเอง", "yen níi phǒm tham gàp-khâao eeng", "Tối nay tôi tự nấu ăn.", "I'll cook dinner myself tonight."],
      ["อยากกินอะไรเป็นพิเศษไหม", "yàak gin à-rai bpen phí-sèet mái", "Có muốn ăn gì đặc biệt không?", "Anything special you'd like to eat?"],
    ],
    ["อีกสิบนาทีอาหารเสร็จครับ", "ìik sìp naa-thii aa-hǎan sèt khráp", "Mười phút nữa là xong.", "The food will be ready in ten minutes."],
    ["'ทำอาหาร' / 'ทำกับข้าว' = nấu ăn; đừng nói 'ทำข้าว' (= làm gạo/giã gạo).", "'ทำอาหาร'/'ทำกับข้าว' = cook; 'ทำข้าว' suggests processing rice."]),
  card("thai_fdl_chores_trash", "chores",
    ["Đổ rác.", "Taking out the trash."],
    [
      ["ขยะเต็มแล้ว", "khà-yà dtem láeo", "Thùng rác đầy rồi.", "The bin is full."],
      ["ช่วยเอาขยะไปทิ้งหน่อย", "chûay ao khà-yà bpai thíng nàauy", "Giúp đem rác đi đổ nhé.", "Please take out the trash."],
    ],
    ["เดี๋ยวผมเอาไปทิ้งครับ", "dǐao phǒm ao bpai thíng khráp", "Để lát tôi đem đi đổ.", "I'll take it out in a bit."],
    ["Dùng 'ทิ้ง' nhưng quên 'ไป': 'เอาขยะทิ้ง' nghe cụt. Thêm 'ไปทิ้ง'.", "Saying 'เอาขยะทิ้ง' clipped — add 'ไปทิ้ง' (go throw away)."]),
  card("thai_fdl_chores_askhelp", "chores",
    ["Nhờ ai đó phụ việc nhà.", "Asking someone to help with a chore."],
    [
      ["ช่วยงานบ้านหน่อยได้ไหม", "chûay ngaan-bâan nàauy dâai mái", "Giúp việc nhà một chút được không?", "Could you help with the housework?"],
      ["ช่วยกันทำเดี๋ยวก็เสร็จ", "chûay gan tham dǐao gâaw sèt", "Cùng làm thì xong nhanh thôi.", "If we do it together it'll be done quickly."],
    ],
    ["ได้เลย เดี๋ยวช่วยครับ", "dâai loei, dǐao chûay khráp", "Được chứ, để tôi giúp.", "Sure, I'll help."],
    ["Bỏ 'ได้ไหม' khiến lời nhờ thành mệnh lệnh.", "Dropping 'ได้ไหม' turns the request into a command."]),
];

// ── Schedule ────────────────────────────────────────────────────────────────

const schedule: ThaiDailyLifeItem[] = [
  card("thai_fdl_sched_daily", "schedule",
    ["Nói về lịch trong ngày.", "Talking about your daily schedule."],
    [
      ["ปกติผมยุ่งตอนเช้า", "bpòk-gà-dti phǒm yûng dtaawn-cháo", "Bình thường tôi bận buổi sáng.", "I'm usually busy in the morning."],
      ["บ่ายนี้ผมว่าง", "bàai níi phǒm wâang", "Chiều nay tôi rảnh.", "I'm free this afternoon."],
    ],
    ["วันนี้ตารางแน่นมากครับ", "wan-níi dtaa-raang nâaen mâak khráp", "Hôm nay lịch kín lắm.", "My schedule is very tight today."],
    ["Thêm 'เป็น' trước 'ยุ่ง' (bận, tính từ).", "Adding 'เป็น' before 'ยุ่ง' (busy — an adjective)."]),
  card("thai_fdl_sched_waketime", "schedule",
    ["Nói giờ thức/ngủ.", "Saying when you wake and sleep."],
    [
      ["ผมตื่นหกโมงเช้า", "phǒm dtùen hòk moong cháo", "Tôi dậy 6 giờ sáng.", "I wake up at 6 a.m."],
      ["ผมนอนสี่ทุ่ม", "phǒm naawn sìi thûm", "Tôi đi ngủ lúc 10 giờ tối.", "I sleep at 10 p.m."],
    ],
    ["ผมนอนเร็วตื่นเช้าครับ", "phǒm naawn reo dtùen cháo khráp", "Tôi ngủ sớm dậy sớm.", "I sleep early and wake early."],
    ["Dùng 'ชั่วโมง' (tiếng đồng hồ) cho giờ trên đồng hồ. Sáng dùng 'โมงเช้า', tối dùng 'ทุ่ม'.", "Using 'ชั่วโมง' (duration) for clock time; mornings use 'โมงเช้า', nights 'ทุ่ม'."]),
  card("thai_fdl_sched_today", "schedule",
    ["Nói kế hoạch hôm nay.", "Talking about today's plans."],
    [
      ["วันนี้ผมจะไปตลาด", "wan-níi phǒm jà bpai dtà-làat", "Hôm nay tôi sẽ đi chợ.", "Today I'll go to the market."],
      ["ตอนเย็นจะทำกับข้าว", "dtaawn-yen jà tham gàp-khâao", "Buổi tối sẽ nấu ăn.", "In the evening I'll cook."],
    ],
    ["มีอะไรให้ช่วยบอกได้นะครับ", "mii à-rai hâi chûay bàawk dâai ná khráp", "Cần gì cứ nói nhé.", "Let me know if you need anything."],
    ["Đặt 'จะ' sau động từ thay vì trước.", "Placing 'จะ' after the verb instead of before it."]),
  card("thai_fdl_sched_busy", "schedule",
    ["Cho biết bận hay rảnh.", "Saying you're busy or free."],
    [
      ["ตอนนี้ผมไม่ว่าง", "dtaawn-níi phǒm mâi wâang", "Bây giờ tôi không rảnh.", "I'm not free right now."],
      ["พรุ่งนี้ว่างทั้งวัน", "phrûng-níi wâang tháng wan", "Mai rảnh cả ngày.", "I'm free all day tomorrow."],
    ],
    ["ขอโทษนะครับ ช่วงนี้งานเยอะ", "khǎaw-thôot ná khráp, chûang-níi ngaan yúh", "Xin lỗi nhé, dạo này nhiều việc.", "Sorry, I've got a lot of work these days."],
    ["Đặt 'ไม่' sai chỗ: 'ว่างไม่'. Đúng 'ไม่ว่าง'.", "Misplacing 'ไม่': 'ว่างไม่'. It's 'ไม่ว่าง'."]),
  card("thai_fdl_sched_weekend", "schedule",
    ["Nói lịch cuối tuần.", "Talking about the weekend schedule."],
    [
      ["เสาร์อาทิตย์ผมอยู่บ้าน", "sǎo aa-thít phǒm yùu bâan", "Cuối tuần tôi ở nhà.", "On weekends I stay home."],
      ["วันอาทิตย์พาลูกไปเที่ยว", "wan aa-thít phaa lûuk bpai thîao", "Chủ nhật dẫn con đi chơi.", "On Sunday I take the kids out."],
    ],
    ["เสาร์นี้ว่างไปไหนกันไหมครับ", "sǎo níi wâang bpai nǎi gan mái khráp", "Thứ Bảy này rảnh đi đâu chơi không?", "Free this Saturday — shall we go somewhere?"],
    ["Quên 'วัน' trước thứ trong văn nói chuẩn: 'อาทิตย์' đơn lẻ dễ nhầm 'tuần'.", "Dropping 'วัน' before a weekday; bare 'อาทิตย์' can also mean 'week'."]),
  card("thai_fdl_sched_whattime", "schedule",
    ["Hỏi mấy giờ điều gì diễn ra.", "Asking what time something happens."],
    [
      ["กี่โมงกินข้าวเย็น", "gìi moong gin khâao-yen", "Mấy giờ ăn cơm tối?", "What time is dinner?"],
      ["นัดกันกี่โมงดี", "nát gan gìi moong dii", "Hẹn nhau mấy giờ?", "What time shall we meet?"],
    ],
    ["ประมาณหกโมงเย็นครับ", "bprà-maan hòk moong yen khráp", "Khoảng 6 giờ tối.", "Around 6 p.m."],
    ["Đưa 'กี่โมง' ra cuối kiểu tiếng Anh khi nó thường đứng đầu mệnh đề hỏi giờ.", "Forcing 'กี่โมง' to the end; in time questions it commonly leads."]),
];

// ── School pickup ───────────────────────────────────────────────────────────

const schoolPickup: ThaiDailyLifeItem[] = [
  card("thai_fdl_school_pickup", "school_pickup",
    ["Đón con ở trường.", "Picking up your child from school."],
    [
      ["ผมมารับลูกครับ", "phǒm maa ráp lûuk khráp", "Tôi đến đón con.", "I'm here to pick up my child."],
      ["ลูกผมอยู่ห้องไหนครับ", "lûuk phǒm yùu hâawng nǎi khráp", "Con tôi ở phòng nào ạ?", "Which classroom is my child in?"],
    ],
    ["ขอรับเด็กชายชื่อก้องครับ", "khǎaw ráp dèk-chaai chûe gâawng khráp", "Tôi xin đón bé trai tên Kong.", "I'm picking up the boy named Kong."],
    ["Dùng 'เอา' (lấy) thay 'รับ' (đón). Đón người dùng 'รับ'.", "Using 'เอา' (take) instead of 'รับ' (pick up a person)."]),
  card("thai_fdl_school_askteacher", "school_pickup",
    ["Hỏi cô giáo về tình hình của con.", "Asking the teacher about your child."],
    [
      ["วันนี้ลูกเป็นยังไงบ้างคะ", "wan-níi lûuk bpen yang-ngai bâang khá", "Hôm nay con tôi thế nào ạ?", "How was my child today?"],
      ["มีการบ้านไหมคะ", "mii gaan-bâan mái khá", "Có bài tập về nhà không ạ?", "Is there homework?"],
    ],
    ["ขอบคุณที่ดูแลลูกนะคะ", "khàawp-khun thîi duu-laae lûuk ná khá", "Cảm ơn cô đã chăm sóc cháu.", "Thank you for looking after my child."],
    ["Nữ dùng 'ครับ' khi nói với cô giáo. Nữ dùng 'คะ/ค่ะ'.", "A woman using 'ครับ' with the teacher; women use 'คะ/ค่ะ'."]),
  card("thai_fdl_school_forgot", "school_pickup",
    ["Con để quên đồ ở trường.", "Your child forgot something at school."],
    [
      ["ลูกลืมกระเป๋าไว้ที่โรงเรียน", "lûuk luem grà-bpǎo wái thîi roong-rian", "Con để quên cặp ở trường.", "My child left their bag at school."],
      ["ขอกลับไปเอาได้ไหมคะ", "khǎaw glàp bpai ao dâai mái khá", "Cho quay lại lấy được không ạ?", "May we go back to get it?"],
    ],
    ["เดี๋ยวพรุ่งนี้มาเอาก็ได้ค่ะ", "dǐao phrûng-níi maa ao gâaw dâai khâ", "Mai đến lấy cũng được ạ.", "You can come get it tomorrow."],
    ["Dùng 'ลืม' đúng nhưng quên 'ไว้' để chỉ 'để lại': 'ลืมไว้ที่...'.", "Using 'ลืม' but dropping 'ไว้' for 'left behind': 'ลืมไว้ที่…'."]),
  card("thai_fdl_school_late", "school_pickup",
    ["Đến đón con trễ.", "Running late to pick up your child."],
    [
      ["ขอโทษที่มาสายครับ", "khǎaw-thôot thîi maa sǎai khráp", "Xin lỗi vì đến trễ.", "Sorry I'm late."],
      ["รถติดมากเลยครับ", "rót-dtìt mâak loei khráp", "Kẹt xe quá ạ.", "The traffic was terrible."],
    ],
    ["จะรีบมาให้ทันเวลานะครับ", "jà rîip maa hâi than wee-laa ná khráp", "Tôi sẽ cố đến đúng giờ.", "I'll hurry to be on time."],
    ["Dùng 'ช้า' (chậm) cho 'đến trễ'. 'Đến trễ' dùng 'มาสาย'.", "Using 'ช้า' (slow) for 'late'; arriving late is 'มาสาย'."]),
  card("thai_fdl_school_otherparent", "school_pickup",
    ["Nói chuyện với phụ huynh khác.", "Chatting with another parent."],
    [
      ["ลูกคุณเรียนห้องไหนคะ", "lûuk khun rian hâawng nǎi khá", "Con chị học lớp nào ạ?", "Which class is your child in?"],
      ["ลูกเราอยู่ห้องเดียวกัน", "lûuk rao yùu hâawng diao-gan", "Con mình học cùng lớp.", "Our kids are in the same class."],
    ],
    ["ฝากเด็กๆ เล่นด้วยกันนะคะ", "fàak dèk-dèk lên dûay-gan ná khá", "Để bọn nhỏ chơi với nhau nhé.", "Let's let the kids play together."],
    ["Dùng 'คุณ' lạnh lùng; dùng 'พี่' với phụ huynh lớn tuổi cho thân.", "Defaulting to a distant 'คุณ'; 'พี่' is warmer with an older parent."]),
  card("thai_fdl_school_homework", "school_pickup",
    ["Hỏi con về bài tập.", "Asking your child about homework."],
    [
      ["วันนี้มีการบ้านไหมลูก", "wan-níi mii gaan-bâan mái lûuk", "Hôm nay có bài tập không con?", "Do you have homework today?"],
      ["ทำการบ้านก่อนเล่นนะ", "tham gaan-bâan gàawn lên ná", "Làm bài xong rồi mới chơi nhé.", "Do your homework before playing."],
    ],
    ["เดี๋ยวพ่อช่วยดูการบ้านให้", "dǐao phâaw chûay duu gaan-bâan hâi", "Lát bố xem bài giúp cho.", "I'll help check your homework."],
    ["Tách 'การบ้าน' thành 'งานบ้าน' (việc nhà) — nghĩa khác hẳn.", "Confusing 'การบ้าน' (homework) with 'งานบ้าน' (housework)."]),
];

// ── Neighbor ────────────────────────────────────────────────────────────────

const neighbor: ThaiDailyLifeItem[] = [
  card("thai_fdl_neighbor_greet", "neighbor",
    ["Chào hàng xóm.", "Greeting a neighbor."],
    [
      ["สวัสดีครับ ไปไหนมาครับ", "sà-wàt-dii khráp, bpai nǎi maa khráp", "Chào anh, đi đâu về thế?", "Hello, where have you been?"],
      ["วันนี้อากาศดีนะครับ", "wan-níi aa-gàat dii ná khráp", "Hôm nay trời đẹp nhỉ.", "Nice weather today, isn't it."],
    ],
    ["กินข้าวหรือยังครับ", "gin khâao rǔe yang khráp", "Ăn cơm chưa anh?", "Have you eaten yet?"],
    ["Hiểu 'ไปไหนมา' theo nghĩa đen — đây chỉ là lời chào xã giao, không cần khai báo.", "Taking 'ไปไหนมา' literally — it's just a friendly greeting, not a real question."]),
  card("thai_fdl_neighbor_borrow", "neighbor",
    ["Mượn đồ của hàng xóm.", "Borrowing something from a neighbor."],
    [
      ["ขอยืมไข่สักสองฟองได้ไหมครับ", "khǎaw yuem khài sàk sǎawng faawng dâai mái khráp", "Cho mượn hai quả trứng được không?", "Could I borrow a couple of eggs?"],
      ["เดี๋ยวคืนให้นะครับ", "dǐao khuen hâi ná khráp", "Lát tôi trả lại nhé.", "I'll return it later."],
    ],
    ["ขอบคุณมากครับ ช่วยได้เยอะเลย", "khàawp-khun mâak khráp, chûay dâai yúh loei", "Cảm ơn nhiều, giúp được nhiều lắm.", "Thanks so much, that helps a lot."],
    ["Dùng 'ขอ' (xin luôn) khi ý là 'ยืม' (mượn, sẽ trả).", "Using 'ขอ' (keep) when you mean 'ยืม' (borrow, will return)."]),
  card("thai_fdl_neighbor_noise", "neighbor",
    ["Nhắc khéo hàng xóm ồn.", "Politely raising a noise issue."],
    [
      ["ขอโทษนะครับ เสียงดังไปนิดนึง", "khǎaw-thôot ná khráp, sǐang dang bpai nít-nueng", "Xin lỗi nhé, hơi ồn một chút.", "Excuse me, it's a little loud."],
      ["ลูกผมกำลังนอนอยู่ครับ", "lûuk phǒm gam-lang naawn yùu khráp", "Con tôi đang ngủ ạ.", "My child is sleeping."],
    ],
    ["รบกวนเบาเสียงหน่อยได้ไหมครับ", "róp-guan bao sǐang nàauy dâai mái khráp", "Phiền anh nhỏ tiếng chút được không?", "Could you lower the volume a bit, please?"],
    ["Nói thẳng quá ('เสียงดัง!') mất lịch sự; người Thái mở đầu bằng 'ขอโทษ' và 'รบกวน'.", "Being too blunt ('เสียงดัง!'); soften with 'ขอโทษ' and 'รบกวน'."]),
  card("thai_fdl_neighbor_help", "neighbor",
    ["Giúp đỡ hàng xóm.", "Helping a neighbor."],
    [
      ["ให้ผมช่วยไหมครับ", "hâi phǒm chûay mái khráp", "Để tôi giúp nhé?", "Shall I help you?"],
      ["ยกของหนักไหมครับ", "yók khǎawng nàk mái khráp", "Đồ có nặng không, để tôi khiêng?", "Is it heavy — want a hand lifting it?"],
    ],
    ["ไม่ต้องเกรงใจนะครับ", "mâi dtâawng greeng-jai ná khráp", "Đừng ngại nhé.", "Don't feel you're imposing."],
    ["Bỏ 'ไหม' khi mời giúp khiến câu thành ra lệnh.", "Dropping 'ไหม' when offering help turns it into a command."]),
  card("thai_fdl_neighbor_watch", "neighbor",
    ["Nhờ hàng xóm trông nhà.", "Asking a neighbor to watch your house."],
    [
      ["ฝากดูบ้านหน่อยนะครับ", "fàak duu bâan nàauy ná khráp", "Nhờ anh trông nhà giúp nhé.", "Please keep an eye on my house."],
      ["ผมไปต่างจังหวัดสองวัน", "phǒm bpai dtàang-jang-wàt sǎawng wan", "Tôi đi tỉnh hai ngày.", "I'll be away in the province for two days."],
    ],
    ["ถ้ามีอะไรโทรหาผมได้เลยครับ", "thâa mii à-rai thoo hǎa phǒm dâai loei khráp", "Có gì thì gọi tôi nhé.", "Call me if anything comes up."],
    ["Dùng 'ดู' không có 'ฝาก' — 'ฝากดู' mới mang nghĩa 'nhờ trông giúp'.", "Using bare 'ดู'; 'ฝากดู' is what conveys 'please look after'."]),
  card("thai_fdl_neighbor_smalltalk", "neighbor",
    ["Tán gẫu với hàng xóm.", "Making small talk with a neighbor."],
    [
      ["ช่วงนี้เป็นยังไงบ้างครับ", "chûang-níi bpen yang-ngai bâang khráp", "Dạo này thế nào rồi anh?", "How have things been lately?"],
      ["ลูกๆ โตเร็วนะครับ", "lûuk-lûuk dtoo reo ná khráp", "Bọn nhỏ lớn nhanh nhỉ.", "The kids grow up fast, don't they."],
    ],
    ["ว่างๆ แวะมาคุยกันนะครับ", "wâang-wâang wáe maa khui gan ná khráp", "Rảnh ghé qua trò chuyện nhé.", "Drop by for a chat when you're free."],
    ["Dịch sát 'how are you' thành câu hỏi trang trọng; tán gẫu dùng 'เป็นยังไงบ้าง'.", "Translating 'how are you' too formally; small talk uses 'เป็นยังไงบ้าง'."]),
];

// ── Invitation ──────────────────────────────────────────────────────────────

const invitation: ThaiDailyLifeItem[] = [
  card("thai_fdl_invite_dinner", "invitation",
    ["Mời ai đó ăn tối.", "Inviting someone to dinner."],
    [
      ["มากินข้าวเย็นที่บ้านไหมครับ", "maa gin khâao-yen thîi bâan mái khráp", "Đến nhà ăn tối không?", "Want to come over for dinner?"],
      ["คืนนี้ว่างไหมครับ", "khuen níi wâang mái khráp", "Tối nay rảnh không?", "Are you free tonight?"],
    ],
    ["เชิญมาเลยครับ ไม่ต้องเกรงใจ", "chern maa loei khráp, mâi dtâawng greeng-jai", "Cứ đến nhé, đừng ngại.", "Please come, don't be shy."],
    ["Dùng 'เชิญ' như câu hỏi; 'เชิญ' là lời mời/khẳng định, hỏi thì thêm 'ไหม'.", "Using 'เชิญ' as a question; it's an invitation/affirmative — add 'ไหม' to ask."]),
  card("thai_fdl_invite_party", "invitation",
    ["Mời đến tiệc/sự kiện.", "Inviting someone to a party."],
    [
      ["เสาร์นี้มีงานวันเกิดลูก", "sǎo níi mii ngaan wan-gòet lûuk", "Thứ Bảy này có tiệc sinh nhật con.", "There's my child's birthday party this Saturday."],
      ["มาร่วมงานด้วยกันนะครับ", "maa rûam ngaan dûay-gan ná khráp", "Đến chung vui nhé.", "Please join us."],
    ],
    ["เริ่มงานบ่ายโมงนะครับ", "rôem ngaan bàai moong ná khráp", "Tiệc bắt đầu lúc 1 giờ chiều.", "It starts at 1 p.m."],
    ["'งาน' nghĩa cả 'việc' lẫn 'tiệc/sự kiện' — thiếu ngữ cảnh dễ hiểu nhầm.", "'งาน' means both 'work' and 'event/party' — context disambiguates."]),
  card("thai_fdl_invite_accept", "invitation",
    ["Nhận lời mời.", "Accepting an invitation."],
    [
      ["ได้เลยครับ ขอบคุณที่ชวน", "dâai loei khráp, khàawp-khun thîi chuan", "Được chứ, cảm ơn đã mời.", "Sure, thanks for inviting me."],
      ["ผมจะไปแน่นอนครับ", "phǒm jà bpai nâae-naawn khráp", "Tôi chắc chắn sẽ đến.", "I'll definitely come."],
    ],
    ["ให้ผมเอาอะไรไปไหมครับ", "hâi phǒm ao à-rai bpai mái khráp", "Tôi mang gì đến nhé?", "Should I bring anything?"],
    ["Trả lời 'ใช่' cho lời mời 'มา...ไหม'; nên lặp động từ hoặc nói 'ได้เลย'.", "Answering 'ใช่' to a 'มา…ไหม' invite; echo the verb or say 'ได้เลย'."]),
  card("thai_fdl_invite_decline", "invitation",
    ["Từ chối khéo léo.", "Declining politely."],
    [
      ["ขอบคุณมากครับ แต่วันนั้นผมติดธุระ", "khàawp-khun mâak khráp, dtàae wan nán phǒm dtìt thú-rá", "Cảm ơn nhiều, nhưng hôm đó tôi bận.", "Thanks a lot, but I'm tied up that day."],
      ["ไว้คราวหน้านะครับ", "wái khraao nâa ná khráp", "Để lần sau nhé.", "Maybe next time."],
    ],
    ["เสียดายจริงๆ ครับ", "sǐa-daai jing-jing khráp", "Tiếc thật đấy ạ.", "It's a real shame."],
    ["Từ chối thẳng 'ไม่ไป' mà không có lời cảm ơn/lý do — thiếu lịch sự.", "A blunt 'ไม่ไป' with no thanks or reason comes across as rude."]),
  card("thai_fdl_invite_neighbor", "invitation",
    ["Mời hàng xóm sang chơi.", "Inviting a neighbor over."],
    [
      ["ว่างๆ แวะมาบ้านนะครับ", "wâang-wâang wáe maa bâan ná khráp", "Rảnh ghé qua nhà chơi nhé.", "Drop by my place when you're free."],
      ["มาดื่มกาแฟด้วยกันไหมครับ", "maa dùem gaa-faae dûay-gan mái khráp", "Sang uống cà phê cùng không?", "Want to come over for coffee?"],
    ],
    ["ประตูบ้านเปิดเสมอครับ", "bprà-dtuu bâan bpòet sà-mǒe khráp", "Cửa nhà luôn rộng mở.", "My door is always open."],
    ["Quên 'มา' (sang đây) khi mời tới nhà mình.", "Forgetting 'มา' (come over) when inviting to your own home."]),
  card("thai_fdl_invite_whatbring", "invitation",
    ["Hỏi nên mang gì.", "Asking what to bring."],
    [
      ["ให้เอาอะไรไปดีครับ", "hâi ao à-rai bpai dii khráp", "Nên mang gì đến nhỉ?", "What should I bring?"],
      ["เอาผลไม้ไปได้ไหมครับ", "ao phǒn-lá-mái bpai dâai mái khráp", "Mang trái cây đến được không?", "Can I bring fruit?"],
    ],
    ["ไม่ต้องเอาอะไรมาก็ได้ครับ", "mâi dtâawng ao à-rai maa gâaw dâai khráp", "Không cần mang gì cũng được.", "You don't need to bring anything."],
    ["Lẫn 'เอา...ไป' (mang đi) với 'เอา...มา' (mang đến) — hướng ngược nhau.", "Confusing 'เอา…ไป' (take there) with 'เอา…มา' (bring here)."]),
];

// ── Illness at home ─────────────────────────────────────────────────────────

const illness: ThaiDailyLifeItem[] = [
  card("thai_fdl_ill_feelsick", "illness_home",
    ["Nói bạn thấy không khỏe.", "Saying you feel unwell."],
    [
      ["วันนี้ผมไม่ค่อยสบาย", "wan-níi phǒm mâi khâauy sà-baai", "Hôm nay tôi không khỏe lắm.", "I don't feel very well today."],
      ["ปวดหัวนิดหน่อย", "bpùat-hǔa nít-nàauy", "Hơi đau đầu.", "I have a slight headache."],
    ],
    ["ขอนอนพักสักครู่นะครับ", "khǎaw naawn phák sàk khrûu ná khráp", "Cho tôi nằm nghỉ một lát nhé.", "Let me lie down and rest for a bit."],
    ["Dùng 'ป่วย' đúng nhưng nói nhẹ thường dùng 'ไม่ค่อยสบาย'.", "'ป่วย' is fine, but mild illness is usually 'ไม่ค่อยสบาย'."]),
  card("thai_fdl_ill_childfever", "illness_home",
    ["Con bị sốt.", "Your child has a fever."],
    [
      ["ลูกตัวร้อน เป็นไข้", "lûuk dtua-ráawn, bpen khâi", "Con nóng người, bị sốt.", "My child is hot — has a fever."],
      ["ต้องวัดไข้ก่อน", "dtâawng wát khâi gàawn", "Phải đo nhiệt độ trước.", "We should take their temperature first."],
    ],
    ["เดี๋ยวพาไปหาหมอนะ", "dǐao phaa bpai hǎa mǎaw ná", "Lát đưa đi khám bác sĩ nhé.", "Let's take them to the doctor."],
    ["Dùng 'ร้อน' (nóng/thời tiết) cho 'sốt'. Sốt là 'เป็นไข้' / 'ตัวร้อน'.", "Using 'ร้อน' (hot weather) for a fever; fever is 'เป็นไข้' / 'ตัวร้อน'."]),
  card("thai_fdl_ill_medicine", "illness_home",
    ["Uống thuốc.", "Taking medicine."],
    [
      ["กินยาแล้วหรือยัง", "gin yaa láeo rǔe yang", "Uống thuốc chưa?", "Have you taken your medicine?"],
      ["กินยาหลังอาหารนะ", "gin yaa lǎng aa-hǎan ná", "Uống thuốc sau khi ăn nhé.", "Take the medicine after meals."],
    ],
    ["กินยาวันละสามครั้งนะครับ", "gin yaa wan-lá sǎam khráng ná khráp", "Uống thuốc ngày ba lần nhé.", "Take it three times a day."],
    ["Dùng 'ดื่ม' (uống nước) cho thuốc viên. Tiếng Thái 'kgin yaa' = uống/dùng thuốc.", "Using 'ดื่ม' (drink) for pills; Thai says 'กินยา' (take medicine)."]),
  card("thai_fdl_ill_rest", "illness_home",
    ["Nghỉ ngơi ở nhà.", "Resting at home."],
    [
      ["วันนี้พักอยู่บ้านดีกว่า", "wan-níi phák yùu bâan dii gwàa", "Hôm nay ở nhà nghỉ thì hơn.", "Better to rest at home today."],
      ["อย่าเพิ่งทำงานหนักนะ", "yàa phôeng tham-ngaan nàk ná", "Đừng vội làm việc nặng nhé.", "Don't push yourself with hard work yet."],
    ],
    ["พักผ่อนเยอะๆ เดี๋ยวก็หาย", "phák-phàawn yúh-yúh, dǐao gâaw hǎai", "Nghỉ nhiều rồi sẽ khỏi.", "Rest a lot and you'll get better."],
    ["Dùng 'ไม่ทำงาน' cho 'đừng làm'; mệnh lệnh 'đừng' dùng 'อย่า'.", "Using 'ไม่ทำงาน' for 'don't work'; the command 'don't' is 'อย่า'."]),
  card("thai_fdl_ill_callsick", "illness_home",
    ["Báo nghỉ vì ốm.", "Telling someone you're calling in sick."],
    [
      ["วันนี้ผมขอลาป่วยครับ", "wan-níi phǒm khǎaw laa-bpùay khráp", "Hôm nay tôi xin nghỉ ốm.", "I'd like to take sick leave today."],
      ["ผมไม่สบาย คงไปไม่ได้", "phǒm mâi sà-baai, khong bpai mâi dâai", "Tôi mệt, chắc không đi được.", "I'm unwell and probably can't make it."],
    ],
    ["พรุ่งนี้ถ้าดีขึ้นจะไปครับ", "phrûng-níi thâa dii khûen jà bpai khráp", "Mai khỏe hơn tôi sẽ đi.", "If I'm better tomorrow I'll come in."],
    ["Tách 'ลาป่วย' (nghỉ ốm) — đừng nói 'ป่วยลา'. Thứ tự cố định.", "Reordering 'ลาป่วย' to 'ป่วยลา' — the order is fixed."]),
  card("thai_fdl_ill_askfeel", "illness_home",
    ["Hỏi ai đó thấy thế nào.", "Asking how someone feels."],
    [
      ["รู้สึกดีขึ้นไหม", "rúu-sùek dii khûen mái", "Thấy đỡ hơn chưa?", "Are you feeling better?"],
      ["ยังปวดอยู่ไหม", "yang bpùat yùu mái", "Vẫn còn đau không?", "Does it still hurt?"],
    ],
    ["ดูแลตัวเองด้วยนะครับ", "duu-laae dtua-eeng dûay ná khráp", "Giữ gìn sức khỏe nhé.", "Take care of yourself."],
    ["Bỏ 'ขึ้น' trong 'ดีขึ้น' (đỡ hơn); 'ดี' không thôi nghĩa khác.", "Dropping 'ขึ้น' in 'ดีขึ้น' (better); bare 'ดี' means just 'good'."]),
];

// ── Daily routine ───────────────────────────────────────────────────────────

const routine: ThaiDailyLifeItem[] = [
  card("thai_fdl_routine_morning", "daily_routine",
    ["Thói quen buổi sáng.", "Your morning routine."],
    [
      ["ตื่นมาผมล้างหน้าแปรงฟัน", "dtùen maa phǒm láang-nâa bpraaeng-fan", "Dậy thì tôi rửa mặt đánh răng.", "When I wake I wash my face and brush my teeth."],
      ["แล้วก็กินข้าวเช้า", "láeo gâaw gin khâao-cháo", "Rồi ăn sáng.", "Then I have breakfast."],
    ],
    ["เช้าๆ ผมชอบดื่มกาแฟครับ", "cháo-cháo phǒm châawp dùem gaa-faae khráp", "Buổi sáng tôi thích uống cà phê.", "In the mornings I like to drink coffee."],
    ["Dùng 'ล้าง' chung cho 'rửa mặt' nhưng quên 'หน้า': 'ล้างหน้า' là rửa mặt.", "Using bare 'ล้าง'; 'ล้างหน้า' (wash face) needs the 'หน้า'."]),
  card("thai_fdl_routine_gowork", "daily_routine",
    ["Đi làm/đi học.", "Going to work or school."],
    [
      ["ผมออกจากบ้านเจ็ดโมง", "phǒm àawk jàak bâan jèt moong", "Tôi rời nhà lúc 7 giờ.", "I leave home at seven."],
      ["ไปทำงานโดยรถเมล์", "bpai tham-ngaan dooy rót-mee", "Đi làm bằng xe buýt.", "I go to work by bus."],
    ],
    ["ปกติใช้เวลาครึ่งชั่วโมงครับ", "bpòk-gà-dti chái wee-laa khrûeng chûa-moong khráp", "Bình thường mất nửa tiếng.", "It usually takes half an hour."],
    ["Dùng 'ไป' cho 'đi bằng (xe)'; dùng 'โดย/นั่ง' cho phương tiện.", "Using 'ไป' for 'by (vehicle)'; use 'โดย/นั่ง' for transport."]),
  card("thai_fdl_routine_evening", "daily_routine",
    ["Thói quen buổi tối.", "Your evening routine."],
    [
      ["กลับบ้านมาผมอาบน้ำก่อน", "glàp bâan maa phǒm àap-náam gàawn", "Về nhà tôi tắm trước.", "When I get home I shower first."],
      ["แล้วก็ทำกับข้าว", "láeo gâaw tham gàp-khâao", "Rồi nấu ăn.", "Then I cook."],
    ],
    ["ตอนเย็นผมชอบดูทีวีพักผ่อนครับ", "dtaawn-yen phǒm châawp duu thii-wii phák-phàawn khráp", "Buổi tối tôi thích xem TV thư giãn.", "In the evening I like to relax watching TV."],
    ["Dùng 'อาบ' không có 'น้ำ': 'อาบน้ำ' mới là tắm.", "Using bare 'อาบ'; 'อาบน้ำ' is to shower."]),
  card("thai_fdl_routine_meals", "daily_routine",
    ["Các bữa ăn trong ngày.", "Meals through the day."],
    [
      ["ผมกินข้าวสามมื้อ", "phǒm gin khâao sǎam múe", "Tôi ăn ba bữa.", "I eat three meals."],
      ["มื้อเที่ยงกินที่ทำงาน", "múe thîang gin thîi tham-ngaan", "Bữa trưa ăn ở chỗ làm.", "I have lunch at work."],
    ],
    ["มื้อเย็นกินกับครอบครัวครับ", "múe yen gin gàp khrâawp-khrua khráp", "Bữa tối ăn cùng gia đình.", "I have dinner with my family."],
    ["Dùng loại từ 'ครั้ง' cho bữa ăn; bữa ăn dùng 'มื้อ'.", "Using 'ครั้ง' for meals; the classifier for a meal is 'มื้อ'."]),
  card("thai_fdl_routine_beforebed", "daily_routine",
    ["Trước khi đi ngủ.", "Before going to bed."],
    [
      ["ก่อนนอนผมอ่านหนังสือ", "gàawn naawn phǒm àan nǎng-sǔe", "Trước khi ngủ tôi đọc sách.", "Before bed I read a book."],
      ["ตั้งนาฬิกาปลุกหกโมง", "dtâng naa-lí-gaa bplùk hòk moong", "Đặt báo thức 6 giờ.", "I set the alarm for six."],
    ],
    ["ฝันดีนะครับ", "fǎn dii ná khráp", "Ngủ ngon nhé.", "Sweet dreams."],
    ["Dùng 'หลัง' (sau) thay 'ก่อน' (trước) khi nói 'trước khi ngủ'.", "Using 'หลัง' (after) instead of 'ก่อน' (before) for 'before bed'."]),
  card("thai_fdl_routine_weekend", "daily_routine",
    ["Thói quen cuối tuần.", "Weekend routine."],
    [
      ["วันหยุดผมตื่นสาย", "wan-yùt phǒm dtùen sǎai", "Ngày nghỉ tôi dậy muộn.", "On days off I wake up late."],
      ["ชอบทำความสะอาดบ้าน", "châawp tham-khwaam-sà-àat bâan", "Thích dọn dẹp nhà cửa.", "I like to clean the house."],
    ],
    ["บางทีก็พาครอบครัวไปเที่ยวครับ", "baang-thii gâaw phaa khrâawp-khrua bpai thîao khráp", "Đôi khi dẫn gia đình đi chơi.", "Sometimes I take the family out."],
    ["Dùng 'มาสาย' (đến trễ) cho 'dậy muộn'; dậy muộn là 'ตื่นสาย'.", "Using 'มาสาย' (arrive late) for 'wake late'; it's 'ตื่นสาย'."]),
];

// ── Feelings ────────────────────────────────────────────────────────────────

const feelings: ThaiDailyLifeItem[] = [
  card("thai_fdl_feel_happy", "feelings",
    ["Nói bạn thấy vui.", "Saying you feel happy."],
    [
      ["วันนี้ผมมีความสุขมาก", "wan-níi phǒm mii khwaam-sùk mâak", "Hôm nay tôi rất vui.", "I'm very happy today."],
      ["ดีใจที่ได้เจอคุณ", "dii-jai thîi dâai jeu khun", "Vui vì được gặp bạn.", "Glad to see you."],
    ],
    ["รู้สึกดีจังเลยครับ", "rúu-sùek dii jang loei khráp", "Thấy thật dễ chịu.", "I feel really good."],
    ["Lẫn 'ดีใจ' (vui, cảm xúc) với 'ใจดี' (tốt bụng) — đảo chữ, đổi nghĩa.", "Swapping 'ดีใจ' (glad) and 'ใจดี' (kind) — reversed syllables, different meaning."]),
  card("thai_fdl_feel_tired", "feelings",
    ["Nói bạn thấy mệt.", "Saying you feel tired."],
    [
      ["วันนี้เหนื่อยมาก", "wan-níi nùeay mâak", "Hôm nay mệt quá.", "I'm so tired today."],
      ["อยากพักผ่อน", "yàak phák-phàawn", "Muốn nghỉ ngơi.", "I want to rest."],
    ],
    ["ขอพักสักครู่นะครับ", "khǎaw phák sàk khrûu ná khráp", "Cho tôi nghỉ một lát nhé.", "Let me rest for a moment."],
    ["Lẫn 'เหนื่อย' (mệt thể chất) với 'เบื่อ' (chán). Nghe gần nhưng khác nghĩa.", "Confusing 'เหนื่อย' (physically tired) with 'เบื่อ' (bored)."]),
  card("thai_fdl_feel_sad", "feelings",
    ["Nói bạn thấy buồn.", "Saying you feel sad."],
    [
      ["ผมรู้สึกเศร้านิดหน่อย", "phǒm rúu-sùek sâo nít-nàauy", "Tôi thấy hơi buồn.", "I feel a little sad."],
      ["ไม่ค่อยมีอารมณ์", "mâi khâauy mii aa-rom", "Không được vui lắm.", "I'm not really in the mood."],
    ],
    ["เดี๋ยวก็ดีขึ้นเองครับ", "dǐao gâaw dii khûen eeng khráp", "Rồi sẽ ổn thôi.", "I'll feel better soon."],
    ["Dùng 'เสียใจ' (hối tiếc/đau lòng) cho nỗi buồn nhẹ; buồn man mác là 'เศร้า'.", "Using 'เสียใจ' (regret/heartbroken) for mild sadness; low mood is 'เศร้า'."]),
  card("thai_fdl_feel_worried", "feelings",
    ["Nói bạn lo lắng/căng thẳng.", "Saying you feel worried or stressed."],
    [
      ["ผมเป็นห่วงเรื่องงาน", "phǒm bpen-hùang rûeang ngaan", "Tôi lo chuyện công việc.", "I'm worried about work."],
      ["ช่วงนี้เครียดนิดหน่อย", "chûang-níi khrîat nít-nàauy", "Dạo này hơi căng thẳng.", "I've been a bit stressed lately."],
    ],
    ["ไม่ต้องคิดมากนะครับ", "mâi dtâawng khít mâak ná khráp", "Đừng nghĩ nhiều quá nhé.", "Try not to overthink it."],
    ["Lẫn 'เป็นห่วง' (lo cho ai/việc gì) với 'กลัว' (sợ).", "Confusing 'เป็นห่วง' (worried about) with 'กลัว' (afraid)."]),
  card("thai_fdl_feel_bored", "feelings",
    ["Nói bạn thấy chán.", "Saying you feel bored."],
    [
      ["วันนี้เบื่อจัง", "wan-níi bùea jang", "Hôm nay chán ghê.", "I'm so bored today."],
      ["ไม่รู้จะทำอะไรดี", "mâi rúu jà tham à-rai dii", "Không biết làm gì cho hết chán.", "I don't know what to do."],
    ],
    ["หาอะไรทำกันดีไหมครับ", "hǎa à-rai tham gan dii mái khráp", "Tìm gì làm cùng nhau nhé?", "Shall we find something to do?"],
    ["Lẫn 'เบื่อ' (chán) với 'เหนื่อย' (mệt).", "Confusing 'เบื่อ' (bored) with 'เหนื่อย' (tired)."]),
  card("thai_fdl_feel_excited", "feelings",
    ["Nói bạn háo hức/mong chờ.", "Saying you feel excited or are looking forward to something."],
    [
      ["ผมตื่นเต้นมากเลย", "phǒm dtùen-dtên mâak loei", "Tôi háo hức lắm.", "I'm so excited."],
      ["รอวันหยุดไม่ไหวแล้ว", "raaw wan-yùt mâi wǎi láeo", "Mong ngày nghỉ quá rồi.", "I can't wait for the holiday."],
    ],
    ["น่าจะสนุกมากครับ", "nâa-jà sà-nùk mâak khráp", "Chắc sẽ vui lắm.", "It should be a lot of fun."],
    ["Lẫn 'ตื่นเต้น' (háo hức/hồi hộp) với 'ตื่นนอน' (thức dậy).", "Confusing 'ตื่นเต้น' (excited) with 'ตื่นนอน' (wake up)."]),
];

// ── Aggregate export ────────────────────────────────────────────────────────

export const items: ThaiDailyLifeItem[] = [
  ...family,
  ...home,
  ...chores,
  ...schedule,
  ...schoolPickup,
  ...neighbor,
  ...invitation,
  ...illness,
  ...routine,
  ...feelings,
];

export default items;
