// src/languages/vietnamese/lessons.ts
//
// Small MVP: Vietnamese survival speaking for foreigners in Vietnam.
// Keep this intentionally compact. It is not a full curriculum.

export type VietnameseCefrLevel = "A1";

export type VietnamesePhrase = {
  english: string;
  vietnamese: string;
  pronunciation: string;
  context: string;
};

export type VietnameseDialogueLine = {
  speaker: string;
  vietnamese: string;
  english: string;
  pronunciation: string;
};

export type VietnameseLesson = {
  id: number;
  level: VietnameseCefrLevel;
  title_en: string;
  subtitle: string;
  intro: string;
  phrases: VietnamesePhrase[];
  dialogue?: VietnameseDialogueLine[];
  cultural_note: string;
  tip: string;
};

export const VIETNAMESE_LESSONS: VietnameseLesson[] = [
  {
    id: 1,
    level: "A1",
    title_en: "Greetings",
    subtitle: "Start politely with anyone.",
    intro:
      "Use these first in cafes, shops, hotels, apartment buildings, and casual meetings.",
    phrases: [
      {
        english: "Hello",
        vietnamese: "Xin chào",
        pronunciation: "seen chow",
        context: "Use with anyone politely.",
      },
      {
        english: "Good morning",
        vietnamese: "Chào buổi sáng",
        pronunciation: "chow boo-ee sahng",
        context: "Use in the morning with staff, neighbors, or colleagues.",
      },
      {
        english: "How are you?",
        vietnamese: "Bạn khỏe không?",
        pronunciation: "ban kweh khome",
        context: "Friendly check-in after hello.",
      },
      {
        english: "Goodbye",
        vietnamese: "Tạm biệt",
        pronunciation: "tahm byet",
        context: "Use when leaving a shop, taxi, or conversation.",
      },
    ],
    cultural_note:
      "Vietnamese greetings often depend on age and relationship, but xin chào is a safe first phrase for foreigners.",
    tip:
      "Speak slowly and smile. Vietnamese tones matter, but people usually understand short survival phrases from context.",
  },
  {
    id: 2,
    level: "A1",
    title_en: "Ordering Coffee And Food",
    subtitle: "Useful phrases for cafes and street food.",
    intro:
      "These phrases help you order common items and pay without needing a long conversation.",
    phrases: [
      {
        english: "One iced milk coffee, please.",
        vietnamese: "Cho tôi một cà phê sữa đá.",
        pronunciation: "chaw toy moht cafe sua da",
        context: "Common order in coffee shops.",
      },
      {
        english: "I want to eat pho.",
        vietnamese: "Tôi muốn ăn phở.",
        pronunciation: "toy mwon an fuh",
        context: "Use when choosing food at a restaurant or street stall.",
      },
      {
        english: "No chili, please.",
        vietnamese: "Không cay, làm ơn.",
        pronunciation: "khome kai, lam uhn",
        context: "Use if you cannot eat spicy food.",
      },
      {
        english: "The bill, please.",
        vietnamese: "Tính tiền giúp tôi.",
        pronunciation: "ting teen zoop toy",
        context: "Use when you are ready to pay.",
      },
    ],
    cultural_note:
      "In many casual places, you order directly and pay at the counter or when you leave.",
    tip:
      "Pointing at the menu while saying the phrase is normal and practical.",
  },
  {
    id: 3,
    level: "A1",
    title_en: "Taxi And Directions",
    subtitle: "Get around by taxi, car, or motorbike.",
    intro:
      "Keep the address on your phone and use these short commands when the driver needs help.",
    phrases: [
      {
        english: "Please take me to this address.",
        vietnamese: "Cho tôi đến địa chỉ này.",
        pronunciation: "chaw toy den dee-ah chee nai",
        context: "Say this while showing the address on your phone.",
      },
      {
        english: "Turn left.",
        vietnamese: "Rẽ trái.",
        pronunciation: "zeh chai",
        context: "Use in a taxi or on a motorbike ride.",
      },
      {
        english: "Turn right.",
        vietnamese: "Rẽ phải.",
        pronunciation: "zeh fai",
        context: "Use when guiding the driver near your destination.",
      },
      {
        english: "Stop here, please.",
        vietnamese: "Dừng ở đây giúp tôi.",
        pronunciation: "zoong uh day zoop toy",
        context: "Use when you arrive or need to get out early.",
      },
    ],
    cultural_note:
      "Drivers may call to confirm the pickup point. Sending a map pin helps more than a long explanation.",
    tip:
      "If pronunciation fails, show the phrase and map together.",
  },
  {
    id: 4,
    level: "A1",
    title_en: "Shopping And Prices",
    subtitle: "Ask prices and buy simple things.",
    intro:
      "These work in markets, convenience shops, small stores, and souvenir stalls.",
    phrases: [
      {
        english: "How much is this?",
        vietnamese: "Cái này bao nhiêu tiền?",
        pronunciation: "kai nai bao nyew teen",
        context: "Use while pointing at the item.",
      },
      {
        english: "Too expensive.",
        vietnamese: "Mắc quá.",
        pronunciation: "mak gwa",
        context: "Casual phrase for bargaining in markets.",
      },
      {
        english: "Can you lower the price?",
        vietnamese: "Bớt được không?",
        pronunciation: "buht duoc khome",
        context: "Use politely when bargaining.",
      },
      {
        english: "I will take this one.",
        vietnamese: "Tôi lấy cái này.",
        pronunciation: "toy lay kai nai",
        context: "Use when you decide to buy.",
      },
    ],
    cultural_note:
      "Bargaining is common in markets, but not in supermarkets, malls, or convenience stores.",
    tip:
      "Use a calculator or phone screen for prices if the numbers are hard to hear.",
  },
  {
    id: 5,
    level: "A1",
    title_en: "Basic Polite Phrases",
    subtitle: "Small phrases that make interactions smoother.",
    intro:
      "These are short, high-value phrases for everyday respect and repair.",
    phrases: [
      {
        english: "Thank you.",
        vietnamese: "Cảm ơn.",
        pronunciation: "gahm uhn",
        context: "Use anytime someone helps you.",
      },
      {
        english: "Sorry / excuse me.",
        vietnamese: "Xin lỗi.",
        pronunciation: "seen loy",
        context: "Use to apologize or get someone's attention politely.",
      },
      {
        english: "Please.",
        vietnamese: "Làm ơn.",
        pronunciation: "lam uhn",
        context: "Add to simple requests.",
      },
      {
        english: "That's okay.",
        vietnamese: "Không sao.",
        pronunciation: "khome sao",
        context: "Use to reassure someone after a small mistake.",
      },
    ],
    cultural_note:
      "A small amount of Vietnamese politeness changes the tone of a whole interaction.",
    tip:
      "If you know only one polite phrase, use cảm ơn often.",
  },
  {
    id: 6,
    level: "A1",
    title_en: "Asking For Help",
    subtitle: "When you are lost, confused, or need support.",
    intro:
      "These phrases are for practical moments when you need someone to slow down or help.",
    phrases: [
      {
        english: "Can you help me?",
        vietnamese: "Bạn giúp tôi được không?",
        pronunciation: "ban zoop toy duoc khome",
        context: "Use when asking a nearby person or staff member for help.",
      },
      {
        english: "I don't understand.",
        vietnamese: "Tôi không hiểu.",
        pronunciation: "toy khome hyew",
        context: "Use when someone speaks too fast or the situation is unclear.",
      },
      {
        english: "Do you speak English?",
        vietnamese: "Bạn nói tiếng Anh được không?",
        pronunciation: "ban noy tee-eng anh duoc khome",
        context: "Ask before switching to English.",
      },
      {
        english: "Where is the bathroom?",
        vietnamese: "Nhà vệ sinh ở đâu?",
        pronunciation: "nha veh sing uh dow",
        context: "Useful in cafes, malls, stations, and restaurants.",
      },
    ],
    cultural_note:
      "People may answer with gestures even if they do not speak English. Watch pointing and body language.",
    tip:
      "Short questions are easier to understand than full English-style sentences.",
  },
  {
    id: 7,
    level: "A1",
    title_en: "Simple Self-Introduction",
    subtitle: "Say who you are without a full conversation.",
    intro:
      "Use these when meeting neighbors, staff, classmates, or your spouse's family.",
    phrases: [
      {
        english: "My name is...",
        vietnamese: "Tôi tên là...",
        pronunciation: "toy ten la",
        context: "Use for a simple first introduction.",
      },
      {
        english: "I am from...",
        vietnamese: "Tôi đến từ...",
        pronunciation: "toy den tu",
        context: "Add your country or city after the phrase.",
      },
      {
        english: "I am learning Vietnamese.",
        vietnamese: "Tôi đang học tiếng Việt.",
        pronunciation: "toy dang hawk tee-eng vyet",
        context: "Use to explain why you speak slowly.",
      },
      {
        english: "Nice to meet you.",
        vietnamese: "Rất vui được gặp bạn.",
        pronunciation: "zut vui duoc gap ban",
        context: "Polite phrase after introductions.",
      },
    ],
    cultural_note:
      "With family or older people, Vietnamese pronouns get more specific. Tôi and bạn are acceptable starter words for foreigners.",
    tip:
      "Prepare your country name in Vietnamese or keep it in English if you are unsure.",
  },
  {
    id: 8,
    level: "A1",
    title_en: "Coffee Shop Conversations",
    subtitle: "Order, sit, and handle simple cafe moments.",
    intro:
      "Use these in coffee shops when ordering drinks, changing sweetness, or asking to sit.",
    phrases: [
      {
        english: "Can I see the menu?",
        vietnamese: "Cho tôi xem thực đơn được không?",
        pronunciation: "chaw toy sem thuk don duoc khome",
        context: "Use when there is no menu on the table.",
      },
      {
        english: "I want this one.",
        vietnamese: "Tôi muốn cái này.",
        pronunciation: "toy mwon kai nai",
        context: "Use while pointing at a drink or photo.",
      },
      {
        english: "Less sugar, please.",
        vietnamese: "Ít đường thôi.",
        pronunciation: "eet duong toy",
        context: "Use for coffee, tea, or smoothies.",
      },
      {
        english: "No ice, please.",
        vietnamese: "Không đá, làm ơn.",
        pronunciation: "khome da, lam uhn",
        context: "Use if you want a drink without ice.",
      },
      {
        english: "Take away, please.",
        vietnamese: "Mang đi giúp tôi.",
        pronunciation: "mang dee zoop toy",
        context: "Use when you do not want to sit in the cafe.",
      },
      {
        english: "Can I sit here?",
        vietnamese: "Tôi ngồi đây được không?",
        pronunciation: "toy ngoy day duoc khome",
        context: "Use before taking a table or shared seat.",
      },
    ],
    cultural_note:
      "Cafe staff are used to short orders and pointing. You do not need perfect Vietnamese to be understood.",
    tip:
      "For drinks, the most useful add-ons are ít đường for less sugar and không đá for no ice.",
  },
  {
    id: 9,
    level: "A1",
    title_en: "Ordering Restaurant Meals",
    subtitle: "Short phrases for simple meals.",
    intro:
      "Use these when sitting down, choosing food, and handling basic dietary needs.",
    phrases: [
      {
        english: "Table for two.",
        vietnamese: "Bàn cho hai người.",
        pronunciation: "ban chaw high nguoi",
        context: "Use when entering a restaurant with another person.",
      },
      {
        english: "What do you recommend?",
        vietnamese: "Bạn gợi ý món nào?",
        pronunciation: "ban goi ee mon nao",
        context: "Use when you want the staff to suggest a dish.",
      },
      {
        english: "I don't eat pork.",
        vietnamese: "Tôi không ăn thịt heo.",
        pronunciation: "toy khome an thit heo",
        context: "Use before ordering if you avoid pork.",
      },
      {
        english: "Can I have rice?",
        vietnamese: "Cho tôi cơm được không?",
        pronunciation: "chaw toy com duoc khome",
        context: "Use when rice is not already included.",
      },
      {
        english: "Is this vegetarian?",
        vietnamese: "Món này chay không?",
        pronunciation: "mon nai chai khome",
        context: "Use while pointing at a dish on the menu.",
      },
      {
        english: "Very delicious.",
        vietnamese: "Ngon lắm.",
        pronunciation: "ngon lam",
        context: "Use as a friendly compliment after eating.",
      },
    ],
    cultural_note:
      "Many casual restaurants specialize in one dish, so ordering can be very direct and fast.",
    tip:
      "If you have a serious allergy, show it written clearly on your phone too.",
  },
  {
    id: 10,
    level: "A1",
    title_en: "Asking Directions",
    subtitle: "Get simple help when walking around.",
    intro:
      "Use these when you are lost, looking for a place, or following local directions.",
    phrases: [
      {
        english: "Where is...?",
        vietnamese: "... ở đâu?",
        pronunciation: "uh dow",
        context: "Put the place name first, like 'ATM ở đâu?'",
      },
      {
        english: "Is it far?",
        vietnamese: "Có xa không?",
        pronunciation: "caw sa khome",
        context: "Use before walking or accepting directions.",
      },
      {
        english: "Go straight.",
        vietnamese: "Đi thẳng.",
        pronunciation: "dee thang",
        context: "Useful when someone gives or repeats directions.",
      },
      {
        english: "After this street, turn left.",
        vietnamese: "Qua đường này rồi rẽ trái.",
        pronunciation: "gwa duong nai roy zeh chai",
        context: "Use when guiding someone nearby.",
      },
      {
        english: "I am lost.",
        vietnamese: "Tôi bị lạc.",
        pronunciation: "toy bee lak",
        context: "Use when asking a shop, guard, or passerby for help.",
      },
      {
        english: "Can you show me on the map?",
        vietnamese: "Bạn chỉ trên bản đồ được không?",
        pronunciation: "ban chee tren ban do duoc khome",
        context: "Use while showing Google Maps or another map app.",
      },
    ],
    cultural_note:
      "People may point, walk with you a short distance, or call someone nearby to help.",
    tip:
      "Keep the destination name visible on your phone. It helps more than a long explanation.",
  },
  {
    id: 11,
    level: "A1",
    title_en: "Taking Grab Or Taxi",
    subtitle: "Handle pickup, waiting, and arrival.",
    intro:
      "Use these with Grab, taxis, and motorbike drivers when the pickup or destination needs clarification.",
    phrases: [
      {
        english: "I booked a Grab.",
        vietnamese: "Tôi đặt Grab rồi.",
        pronunciation: "toy dat grab roy",
        context: "Use when confirming you are the passenger.",
      },
      {
        english: "Is this the right car?",
        vietnamese: "Đúng xe này không?",
        pronunciation: "doong seh nai khome",
        context: "Use before getting in, especially at busy pickup spots.",
      },
      {
        english: "I am standing at the gate.",
        vietnamese: "Tôi đứng ở cổng.",
        pronunciation: "toy dung uh kong",
        context: "Use on the phone or by message when the driver cannot find you.",
      },
      {
        english: "Please wait one minute.",
        vietnamese: "Chờ tôi một phút nhé.",
        pronunciation: "chuh toy moht foot nyeh",
        context: "Use if you are almost at the pickup point.",
      },
      {
        english: "Please drive slowly.",
        vietnamese: "Đi chậm giúp tôi.",
        pronunciation: "dee cham zoop toy",
        context: "Useful on motorbikes or in heavy traffic.",
      },
      {
        english: "I will pay cash.",
        vietnamese: "Tôi trả bằng tiền mặt.",
        pronunciation: "toy cha bang teen mat",
        context: "Use when the app or driver asks about payment.",
      },
    ],
    cultural_note:
      "For Grab pickups, drivers often rely on landmarks like gates, lobby names, and shop fronts.",
    tip:
      "Check the plate number before getting in, then use đúng xe này không if you are unsure.",
  },
  {
    id: 12,
    level: "A1",
    title_en: "Meeting Vietnamese Friends",
    subtitle: "Simple social phrases for casual plans.",
    intro:
      "Use these with new friends, neighbors, classmates, coworkers, or your partner's family.",
    phrases: [
      {
        english: "I just arrived in Vietnam.",
        vietnamese: "Tôi mới đến Việt Nam.",
        pronunciation: "toy moy den vyet nam",
        context: "Use when explaining that you are new here.",
      },
      {
        english: "Nice to see you.",
        vietnamese: "Rất vui gặp bạn.",
        pronunciation: "zut vui gap ban",
        context: "Use when meeting someone again.",
      },
      {
        english: "Do you want coffee?",
        vietnamese: "Bạn muốn uống cà phê không?",
        pronunciation: "ban mwon uong cafe khome",
        context: "Use for a casual invitation.",
      },
      {
        english: "Let's go eat.",
        vietnamese: "Mình đi ăn nhé.",
        pronunciation: "ming dee an nyeh",
        context: "Friendly phrase for making simple plans.",
      },
      {
        english: "I like Vietnamese food.",
        vietnamese: "Tôi thích đồ ăn Việt Nam.",
        pronunciation: "toy thik doh an vyet nam",
        context: "Easy small talk at meals.",
      },
      {
        english: "See you later.",
        vietnamese: "Hẹn gặp lại.",
        pronunciation: "hen gap lai",
        context: "Use when leaving friends or coworkers.",
      },
    ],
    cultural_note:
      "Food and coffee are common ways to spend time together, even for short casual meetings.",
    tip:
      "Mình is friendly and soft. Tôi is more neutral and still safe for beginners.",
  },
  {
    id: 13,
    level: "A1",
    title_en: "Convenience Store And Supermarket",
    subtitle: "Buy basics without a long conversation.",
    intro:
      "Use these at convenience stores, supermarkets, pharmacies, and small shops.",
    phrases: [
      {
        english: "Where is water?",
        vietnamese: "Nước ở đâu?",
        pronunciation: "nuoc uh dow",
        context: "Use when looking for bottled water.",
      },
      {
        english: "Do you have a bag?",
        vietnamese: "Có túi không?",
        pronunciation: "caw too-ee khome",
        context: "Use at checkout if you need a bag.",
      },
      {
        english: "I need a SIM card.",
        vietnamese: "Tôi cần SIM.",
        pronunciation: "toy kan sim",
        context: "Use at phone shops or convenience stores that sell SIMs.",
      },
      {
        english: "Can I pay by card?",
        vietnamese: "Trả thẻ được không?",
        pronunciation: "cha teh duoc khome",
        context: "Use before tapping or handing over a card.",
      },
      {
        english: "I don't need a receipt.",
        vietnamese: "Không cần hóa đơn.",
        pronunciation: "khome kan hwa don",
        context: "Use after paying if you do not need paper.",
      },
      {
        english: "Can you heat this?",
        vietnamese: "Hâm nóng giúp tôi.",
        pronunciation: "hum nawng zoop toy",
        context: "Use for packaged food at convenience stores.",
      },
    ],
    cultural_note:
      "Many convenience stores can heat boxed meals, noodles, and snacks for you.",
    tip:
      "At checkout, short phrases plus pointing are enough.",
  },
  {
    id: 14,
    level: "A1",
    title_en: "Apartment And Landlord Basics",
    subtitle: "Handle small home problems.",
    intro:
      "Use these with a landlord, apartment guard, building staff, or repair person.",
    phrases: [
      {
        english: "The air conditioner is broken.",
        vietnamese: "Máy lạnh bị hỏng.",
        pronunciation: "may lanh bee hong",
        context: "Use when reporting an AC problem.",
      },
      {
        english: "There is no water.",
        vietnamese: "Không có nước.",
        pronunciation: "khome caw nuoc",
        context: "Use when the tap or shower is not working.",
      },
      {
        english: "The power is out.",
        vietnamese: "Mất điện rồi.",
        pronunciation: "mat deen roy",
        context: "Use during an outage or electrical problem.",
      },
      {
        english: "Can you fix it?",
        vietnamese: "Sửa giúp tôi được không?",
        pronunciation: "sua zoop toy duoc khome",
        context: "Use after showing the problem.",
      },
      {
        english: "When can you come?",
        vietnamese: "Khi nào bạn đến được?",
        pronunciation: "khi nao ban den duoc",
        context: "Use when scheduling a repair or visit.",
      },
      {
        english: "I paid the rent.",
        vietnamese: "Tôi trả tiền thuê nhà rồi.",
        pronunciation: "toy cha teen tweh nha roy",
        context: "Use if payment needs confirmation.",
      },
    ],
    cultural_note:
      "Building guards and landlords often prefer a photo of the problem plus a short message.",
    tip:
      "Send the Vietnamese phrase with a photo or screenshot when possible.",
  },
  {
    id: 15,
    level: "A1",
    title_en: "Emergency And Help Phrases",
    subtitle: "Short phrases for urgent moments.",
    intro:
      "Use these when you need immediate help, medical care, or official support.",
    phrases: [
      {
        english: "Help!",
        vietnamese: "Cứu tôi!",
        pronunciation: "kew toy",
        context: "Use loudly in an urgent situation.",
      },
      {
        english: "Call the police.",
        vietnamese: "Gọi công an giúp tôi.",
        pronunciation: "goy kong an zoop toy",
        context: "Use if you need police help.",
      },
      {
        english: "Call an ambulance.",
        vietnamese: "Gọi xe cấp cứu giúp tôi.",
        pronunciation: "goy seh kap kew zoop toy",
        context: "Use for serious medical emergencies.",
      },
      {
        english: "I am sick.",
        vietnamese: "Tôi bị bệnh.",
        pronunciation: "toy bee ben",
        context: "Use at a pharmacy, clinic, or with hotel staff.",
      },
      {
        english: "I lost my phone.",
        vietnamese: "Tôi mất điện thoại.",
        pronunciation: "toy mat deen thoai",
        context: "Use with staff, police, or a taxi company.",
      },
      {
        english: "I need a hospital.",
        vietnamese: "Tôi cần bệnh viện.",
        pronunciation: "toy kan ben vyen",
        context: "Use when you need medical care quickly.",
      },
    ],
    cultural_note:
      "In emergencies, show your phone, passport copy, hotel address, or location pin if you can.",
    tip:
      "Save emergency phrases offline so they are available without mobile data.",
  },
  {
    id: 16,
    level: "A1",
    title_en: "Making Small Talk",
    subtitle: "Start friendly everyday conversations.",
    intro:
      "Use these when chatting with neighbors, staff, classmates, coworkers, or new friends.",
    phrases: [
      {
        english: "Where is your hometown?",
        vietnamese: "Bạn quê ở đâu?",
        pronunciation: "ban kway uh dow",
        context: "Common friendly question when getting to know someone.",
      },
      {
        english: "Have you lived here long?",
        vietnamese: "Bạn sống ở đây lâu chưa?",
        pronunciation: "ban song uh day low chua",
        context: "Use with neighbors, coworkers, or new friends.",
      },
      {
        english: "I just moved here.",
        vietnamese: "Tôi mới chuyển đến đây.",
        pronunciation: "toy moy chwen den day",
        context: "Use when explaining why Vietnam is still new to you.",
      },
      {
        english: "What do you do?",
        vietnamese: "Bạn làm nghề gì?",
        pronunciation: "ban lam ngeh zee",
        context: "Natural small talk after introductions.",
      },
      {
        english: "What do you usually do on weekends?",
        vietnamese: "Cuối tuần bạn thường làm gì?",
        pronunciation: "kwee twan ban thuong lam zee",
        context: "Use when keeping a friendly conversation going.",
      },
      {
        english: "It is crowded today.",
        vietnamese: "Hôm nay đông quá.",
        pronunciation: "home nai dome gwa",
        context: "Easy comment in cafes, streets, malls, or events.",
      },
      {
        english: "It is fun talking with you.",
        vietnamese: "Nói chuyện với bạn vui quá.",
        pronunciation: "noy chuyen voy ban vui gwa",
        context: "Warm phrase when a conversation is going well.",
      },
    ],
    cultural_note:
      "Vietnamese small talk often starts with hometown, work, food, and daily plans.",
    tip:
      "Short answers are fine. A smile and one follow-up question can keep the conversation moving.",
  },
  {
    id: 17,
    level: "A1",
    title_en: "Introducing Family And Friends",
    subtitle: "Simple phrases for social introductions.",
    intro:
      "Use these when introducing people or meeting a friend's family.",
    phrases: [
      {
        english: "This is my friend.",
        vietnamese: "Đây là bạn tôi.",
        pronunciation: "day la ban toy",
        context: "Use when introducing a friend to someone.",
      },
      {
        english: "This is my wife.",
        vietnamese: "Đây là vợ tôi.",
        pronunciation: "day la vuh toy",
        context: "Use when introducing your wife.",
      },
      {
        english: "This is my husband.",
        vietnamese: "Đây là chồng tôi.",
        pronunciation: "day la chom toy",
        context: "Use when introducing your husband.",
      },
      {
        english: "This is my child.",
        vietnamese: "Đây là con tôi.",
        pronunciation: "day la con toy",
        context: "Use when introducing your child.",
      },
      {
        english: "My family is overseas.",
        vietnamese: "Gia đình tôi ở nước ngoài.",
        pronunciation: "za ding toy uh nuoc ngoai",
        context: "Use when explaining where your family lives.",
      },
      {
        english: "My friend's name is...",
        vietnamese: "Bạn tôi tên là...",
        pronunciation: "ban toy ten la",
        context: "Use before saying your friend's name.",
      },
      {
        english: "Nice to meet your family.",
        vietnamese: "Rất vui được gặp gia đình bạn.",
        pronunciation: "zut vui duoc gap za ding ban",
        context: "Polite phrase when meeting a friend's or partner's family.",
      },
    ],
    cultural_note:
      "Family introductions matter in Vietnam, and a simple respectful phrase goes a long way.",
    tip:
      "If you are unsure about age-based pronouns, keep the sentence simple and let locals help naturally.",
  },
  {
    id: 18,
    level: "A1",
    title_en: "Weather And Daily Life",
    subtitle: "Talk about the day around you.",
    intro:
      "Use these phrases for easy daily comments at home, work, cafes, and outside.",
    phrases: [
      {
        english: "It is so hot today.",
        vietnamese: "Hôm nay nóng quá.",
        pronunciation: "home nai nawng gwa",
        context: "Very common daily comment in Vietnam.",
      },
      {
        english: "It is raining now.",
        vietnamese: "Trời mưa rồi.",
        pronunciation: "choy mua roy",
        context: "Use when rain starts or changes your plans.",
      },
      {
        english: "The weather is nice today.",
        vietnamese: "Hôm nay đẹp trời.",
        pronunciation: "home nai dep choy",
        context: "Good small talk on a pleasant day.",
      },
      {
        english: "I am going to work now.",
        vietnamese: "Tôi đi làm bây giờ.",
        pronunciation: "toy dee lam bay zuh",
        context: "Use when leaving home or ending a chat.",
      },
      {
        english: "I am going home.",
        vietnamese: "Tôi về nhà.",
        pronunciation: "toy veh nha",
        context: "Use when leaving work, a cafe, or a friend's place.",
      },
      {
        english: "I am going to the market.",
        vietnamese: "Tôi đi chợ.",
        pronunciation: "toy dee chuh",
        context: "Useful for daily errands and neighborhood small talk.",
      },
      {
        english: "I am a little tired.",
        vietnamese: "Tôi hơi mệt.",
        pronunciation: "toy hoy met",
        context: "Simple way to explain low energy without a long story.",
      },
    ],
    cultural_note:
      "Weather, food, and daily errands are easy safe topics for light conversation.",
    tip:
      "Repeat daily-life phrases often. They become useful because you can say them every day.",
  },
  {
    id: 19,
    level: "A1",
    title_en: "Cafe, Work, And Study Conversations",
    subtitle: "Speak naturally in shared spaces.",
    intro:
      "Use these when working, studying, or spending time in cafes and coworking spaces.",
    phrases: [
      {
        english: "I work here.",
        vietnamese: "Tôi làm việc ở đây.",
        pronunciation: "toy lam vyek uh day",
        context: "Use when explaining why you are in a cafe or office.",
      },
      {
        english: "I study Vietnamese here.",
        vietnamese: "Tôi học tiếng Việt ở đây.",
        pronunciation: "toy hawk tee-eng vyet uh day",
        context: "Use at a cafe, class, or study place.",
      },
      {
        english: "What are you studying?",
        vietnamese: "Bạn đang học gì?",
        pronunciation: "ban dang hawk zee",
        context: "Friendly question for students or language learners.",
      },
      {
        english: "I need Wi-Fi.",
        vietnamese: "Tôi cần Wi-Fi.",
        pronunciation: "toy kan wai-fai",
        context: "Use in cafes, hotels, coworking spaces, or apartments.",
      },
      {
        english: "What is the Wi-Fi password?",
        vietnamese: "Mật khẩu Wi-Fi là gì?",
        pronunciation: "mat khow wai-fai la zee",
        context: "Use with staff before sitting down to work.",
      },
      {
        english: "I will sit and work for a bit.",
        vietnamese: "Tôi ngồi làm việc một chút.",
        pronunciation: "toy ngoy lam vyek moht chut",
        context: "Use if staff ask whether you are staying.",
      },
      {
        english: "Where do you work?",
        vietnamese: "Bạn làm việc ở đâu?",
        pronunciation: "ban lam vyek uh dow",
        context: "Natural work-related small talk.",
      },
    ],
    cultural_note:
      "Cafes are common places to work, study, meet friends, or wait between errands.",
    tip:
      "Keep cafe/work phrases short; most people only need the key idea.",
  },
  {
    id: 20,
    level: "A1",
    title_en: "Asking For Recommendations",
    subtitle: "Find good places and local favorites.",
    intro:
      "Use these when asking friends, staff, drivers, or neighbors for practical suggestions.",
    phrases: [
      {
        english: "Which dish do you recommend?",
        vietnamese: "Bạn giới thiệu món nào?",
        pronunciation: "ban zoy thieu mon nao",
        context: "Use in restaurants or with local friends.",
      },
      {
        english: "Which place is good?",
        vietnamese: "Chỗ nào tốt?",
        pronunciation: "cho nao tote",
        context: "General question for services, shops, or places.",
      },
      {
        english: "Which cafe is good near here?",
        vietnamese: "Gần đây có quán cà phê nào ngon không?",
        pronunciation: "gan day caw kwan cafe nao ngon khome",
        context: "Use when looking for a local cafe.",
      },
      {
        english: "Is this dish good?",
        vietnamese: "Món này có ngon không?",
        pronunciation: "mon nai caw ngon khome",
        context: "Use while pointing at a menu or food display.",
      },
      {
        english: "Where should I go?",
        vietnamese: "Tôi nên đi đâu?",
        pronunciation: "toy nen dee dow",
        context: "Use when asking for travel, food, or neighborhood ideas.",
      },
      {
        english: "What is fun around here?",
        vietnamese: "Ở đây có gì vui?",
        pronunciation: "uh day caw zee vui",
        context: "Use with friends or locals when exploring an area.",
      },
      {
        english: "What place do you like?",
        vietnamese: "Bạn thích chỗ nào?",
        pronunciation: "ban thik cho nao",
        context: "A friendly way to ask for a personal recommendation.",
      },
    ],
    cultural_note:
      "Local recommendations are often better than online lists, especially for food and coffee.",
    tip:
      "Ask one short question, then show your map if you need a specific location.",
  },
  {
    id: 21,
    level: "A1",
    title_en: "Vietnamese Social Etiquette",
    subtitle: "Be polite in homes and social moments.",
    intro:
      "Use these when visiting someone's home, joining a meal, or trying to be respectful.",
    phrases: [
      {
        english: "What should I call you?",
        vietnamese: "Tôi nên gọi bạn là gì?",
        pronunciation: "toy nen goi ban la zee",
        context: "Useful when you are unsure about names or pronouns.",
      },
      {
        english: "May I come in?",
        vietnamese: "Tôi có thể vào không?",
        pronunciation: "toy caw theh vao khome",
        context: "Use before entering a home, room, or office.",
      },
      {
        english: "Do I need to take off my shoes?",
        vietnamese: "Tôi có cần bỏ giày không?",
        pronunciation: "toy caw kan baw zay khome",
        context: "Useful before entering someone's home.",
      },
      {
        english: "I brought a small gift.",
        vietnamese: "Tôi mang quà nhỏ.",
        pronunciation: "toy mang gwa nyaw",
        context: "Use when visiting a home or meeting a host.",
      },
      {
        english: "Excuse me, may I?",
        vietnamese: "Xin phép nhé.",
        pronunciation: "seen fep nyeh",
        context: "Use softly before interrupting, entering, or doing something.",
      },
      {
        english: "I don't want to bother you.",
        vietnamese: "Tôi không muốn làm phiền.",
        pronunciation: "toy khome mwon lam fyen",
        context: "Use when asking for help politely.",
      },
      {
        english: "Thank you for inviting me.",
        vietnamese: "Cảm ơn vì đã mời tôi.",
        pronunciation: "gahm uhn vee da moy toy",
        context: "Use after being invited to a meal, home, or event.",
      },
    ],
    cultural_note:
      "Small etiquette phrases help you sound considerate even with beginner Vietnamese.",
    tip:
      "When in doubt, ask simply. Vietnamese hosts usually appreciate the effort.",
  },
  {
    id: 22,
    level: "A1",
    title_en: "Common Polite Responses",
    subtitle: "React naturally in everyday exchanges.",
    intro:
      "Use these short replies to sound warm, calm, and socially present.",
    phrases: [
      {
        english: "Yes. / Respectful yes.",
        vietnamese: "Dạ.",
        pronunciation: "yah",
        context: "Use with staff, older people, or when being polite.",
      },
      {
        english: "Yes.",
        vietnamese: "Vâng.",
        pronunciation: "vung",
        context: "Polite agreement or answer to a question.",
      },
      {
        english: "Okay.",
        vietnamese: "Được ạ.",
        pronunciation: "duoc ah",
        context: "Polite way to accept or confirm something.",
      },
      {
        english: "No problem.",
        vietnamese: "Không sao đâu.",
        pronunciation: "khome sao dow",
        context: "Use when someone apologizes or makes a small mistake.",
      },
      {
        english: "You're welcome.",
        vietnamese: "Không có gì.",
        pronunciation: "khome caw zee",
        context: "Use after someone says thank you.",
      },
      {
        english: "Let me try.",
        vietnamese: "Để tôi thử.",
        pronunciation: "deh toy thu",
        context: "Use when practicing language, food, or a new task.",
      },
      {
        english: "Let me think a little.",
        vietnamese: "Cho tôi suy nghĩ chút nhé.",
        pronunciation: "chaw toy swee ngee chut nyeh",
        context: "Use when you need time before answering.",
      },
    ],
    cultural_note:
      "Small responses like dạ and được ạ make everyday Vietnamese sound softer and more respectful.",
    tip:
      "These phrases are easy to repeat many times a day, so they build confidence quickly.",
  },
  {
    id: 23,
    level: "A1",
    title_en: "Simple Texting And Chat Phrases",
    subtitle: "Message friends, drivers, and staff.",
    intro:
      "Use these in text messages when meeting people, sending locations, or running late.",
    phrases: [
      {
        english: "Where are you?",
        vietnamese: "Bạn đang ở đâu?",
        pronunciation: "ban dang uh dow",
        context: "Use in messages with friends, drivers, or deliveries.",
      },
      {
        english: "I will be a little late.",
        vietnamese: "Tôi đến trễ một chút.",
        pronunciation: "toy den treh moht chut",
        context: "Use when you are delayed.",
      },
      {
        english: "I arrived.",
        vietnamese: "Tôi tới rồi.",
        pronunciation: "toy toy roy",
        context: "Use when you reach the meeting place.",
      },
      {
        english: "Please send me the address.",
        vietnamese: "Gửi địa chỉ cho tôi nhé.",
        pronunciation: "gooy dee-ah chee chaw toy nyeh",
        context: "Use before going somewhere new.",
      },
      {
        english: "Text me when you arrive.",
        vietnamese: "Nhắn tôi khi bạn đến.",
        pronunciation: "nyan toy khi ban den",
        context: "Use with friends or visitors.",
      },
      {
        english: "I will call back later.",
        vietnamese: "Tôi gọi lại sau.",
        pronunciation: "toy goi lai sow",
        context: "Use when you cannot talk now.",
      },
      {
        english: "Okay, see you.",
        vietnamese: "Ok, hẹn gặp bạn.",
        pronunciation: "okay, hen gap ban",
        context: "Friendly message to confirm plans.",
      },
    ],
    cultural_note:
      "Messaging in Vietnam is often short and practical. Clear location details matter more than long text.",
    tip:
      "Use these with a map pin, address, or screenshot when plans involve travel.",
  },
  {
    id: 24,
    level: "A1",
    title_en: "Going Out And Invitations",
    subtitle: "Make simple plans with people.",
    intro:
      "Use these when inviting someone out, choosing a place, or responding to plans.",
    phrases: [
      {
        english: "Are you free tonight?",
        vietnamese: "Tối nay bạn rảnh không?",
        pronunciation: "toy nai ban ranh khome",
        context: "Use when inviting a friend or coworker out.",
      },
      {
        english: "Want to get coffee?",
        vietnamese: "Đi cà phê không?",
        pronunciation: "dee cafe khome",
        context: "Casual invitation for friends or classmates.",
      },
      {
        english: "Let's go eat dinner.",
        vietnamese: "Mình đi ăn tối nhé.",
        pronunciation: "ming dee an toy nyeh",
        context: "Friendly plan suggestion.",
      },
      {
        english: "Where do you want to go?",
        vietnamese: "Bạn muốn đi đâu?",
        pronunciation: "ban mwon dee dow",
        context: "Use when choosing a cafe, restaurant, or activity.",
      },
      {
        english: "What time should we meet?",
        vietnamese: "Mấy giờ gặp nhau?",
        pronunciation: "may zuh gap nhau",
        context: "Use after deciding to meet.",
      },
      {
        english: "I am busy today.",
        vietnamese: "Tôi bận hôm nay.",
        pronunciation: "toy ban home nai",
        context: "Simple polite decline.",
      },
      {
        english: "Maybe next time.",
        vietnamese: "Để lần sau nhé.",
        pronunciation: "deh lan sow nyeh",
        context: "Warm way to decline without sounding harsh.",
      },
    ],
    cultural_note:
      "Coffee invitations are very normal in Vietnam and can be casual, quick, or social.",
    tip:
      "If you decline, adding nhé keeps the tone softer.",
  },
  {
    id: 25,
    level: "A1",
    title_en: "Misunderstandings And Clarification",
    subtitle: "Stay calm when conversation gets unclear.",
    intro:
      "Use these when someone speaks quickly, you miss a word, or you need time to understand.",
    phrases: [
      {
        english: "Sorry, I can't hear clearly.",
        vietnamese: "Xin lỗi, tôi nghe không rõ.",
        pronunciation: "seen loy, toy nghe khome raw",
        context: "Use in noisy places or on the phone.",
      },
      {
        english: "Can you speak more slowly?",
        vietnamese: "Bạn nói chậm hơn được không?",
        pronunciation: "ban noy cham hurn duoc khome",
        context: "Use when someone is speaking too fast.",
      },
      {
        english: "Can you say that again?",
        vietnamese: "Bạn nói lại được không?",
        pronunciation: "ban noy lai duoc khome",
        context: "Use when you missed the sentence.",
      },
      {
        english: "I understand a little.",
        vietnamese: "Tôi hiểu một chút.",
        pronunciation: "toy hyew moht chut",
        context: "Use when you understand some Vietnamese but not all.",
      },
      {
        english: "I don't understand yet.",
        vietnamese: "Tôi chưa hiểu.",
        pronunciation: "toy chua hyew",
        context: "Use when you need another explanation.",
      },
      {
        english: "What do you mean?",
        vietnamese: "Ý bạn là gì?",
        pronunciation: "ee ban la zee",
        context: "Use gently when the meaning is unclear.",
      },
      {
        english: "Can you write it down?",
        vietnamese: "Bạn viết ra được không?",
        pronunciation: "ban vyet ra duoc khome",
        context: "Use when names, addresses, or numbers are hard to catch.",
      },
    ],
    cultural_note:
      "Asking for repetition is normal. Short clarification phrases keep the conversation comfortable.",
    tip:
      "Use tôi hiểu một chút to signal effort and keep the other person patient.",
  },
  {
    id: 26,
    level: "A1",
    title_en: "Roleplay: Ordering Coffee",
    subtitle: "Practice a simple cafe order.",
    intro:
      "Practice this before ordering a drink at a local cafe.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Cho tôi một cà phê sữa đá.",
        english: "One iced milk coffee, please.",
        pronunciation: "chaw toy moht cafe sua da",
      },
      {
        speaker: "B",
        vietnamese: "Có đá không?",
        english: "With ice?",
        pronunciation: "caw da khome",
      },
      {
        speaker: "A",
        vietnamese: "Có, ít đá thôi.",
        english: "Yes, just a little ice.",
        pronunciation: "caw, eet da toy",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, ngồi đây hay mang đi?",
        english: "Okay, for here or take away?",
        pronunciation: "yah, ngoy day hai mang dee",
      },
      {
        speaker: "A",
        vietnamese: "Ngồi đây.",
        english: "For here.",
        pronunciation: "ngoy day",
      },
    ],
    cultural_note:
      "Cafe orders are often short. Staff may ask about ice, sugar, or take away.",
    tip:
      "Pointing at the menu while saying the first line is completely normal.",
  },
  {
    id: 27,
    level: "A1",
    title_en: "Roleplay: Ordering Street Food",
    subtitle: "Order a simple bowl or plate.",
    intro:
      "Practice this at a street stall or casual local restaurant.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Cho tôi một tô phở bò.",
        english: "One bowl of beef pho, please.",
        pronunciation: "chaw toy moht toh fuh baw",
      },
      {
        speaker: "B",
        vietnamese: "Ăn ở đây hay mang đi?",
        english: "Eat here or take away?",
        pronunciation: "an uh day hai mang dee",
      },
      {
        speaker: "A",
        vietnamese: "Ăn ở đây.",
        english: "Eat here.",
        pronunciation: "an uh day",
      },
      {
        speaker: "B",
        vietnamese: "Có cay không?",
        english: "Do you want it spicy?",
        pronunciation: "caw kai khome",
      },
      {
        speaker: "A",
        vietnamese: "Không cay, làm ơn.",
        english: "Not spicy, please.",
        pronunciation: "khome kai, lam uhn",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, chờ chút nhé.",
        english: "Okay, please wait a moment.",
        pronunciation: "yah, chuh chut nyeh",
      },
    ],
    cultural_note:
      "Street food conversations move quickly, but the same simple answers repeat often.",
    tip:
      "If you are unsure, say không cay early and point to the dish you want.",
  },
  {
    id: 28,
    level: "A1",
    title_en: "Roleplay: Asking A Taxi Or Grab Driver",
    subtitle: "Confirm the ride and destination.",
    intro:
      "Practice this before getting into a taxi or Grab car.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Đúng xe này không?",
        english: "Is this the right car?",
        pronunciation: "doong seh nai khome",
      },
      {
        speaker: "B",
        vietnamese: "Đúng rồi. Bạn đi đâu?",
        english: "Yes. Where are you going?",
        pronunciation: "doong roy. ban dee dow",
      },
      {
        speaker: "A",
        vietnamese: "Cho tôi đến địa chỉ này.",
        english: "Please take me to this address.",
        pronunciation: "chaw toy den dee-ah chee nai",
      },
      {
        speaker: "B",
        vietnamese: "Bạn trả bằng tiền mặt hay thẻ?",
        english: "Will you pay cash or by card?",
        pronunciation: "ban cha bang teen mat hai teh",
      },
      {
        speaker: "A",
        vietnamese: "Tôi trả bằng tiền mặt.",
        english: "I will pay cash.",
        pronunciation: "toy cha bang teen mat",
      },
    ],
    cultural_note:
      "Confirming the car and destination is useful at busy pickup spots.",
    tip:
      "Show the address on your phone while saying cho tôi đến địa chỉ này.",
  },
  {
    id: 29,
    level: "A1",
    title_en: "Roleplay: Asking Directions",
    subtitle: "Ask a local for a nearby place.",
    intro:
      "Practice this when you need help finding a bank, restroom, cafe, or address.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, nhà vệ sinh ở đâu?",
        english: "Excuse me, where is the bathroom?",
        pronunciation: "seen loy, nha veh sing uh dow",
      },
      {
        speaker: "B",
        vietnamese: "Đi thẳng rồi rẽ trái.",
        english: "Go straight, then turn left.",
        pronunciation: "dee thang roy zeh chai",
      },
      {
        speaker: "A",
        vietnamese: "Xa không?",
        english: "Is it far?",
        pronunciation: "sa khome",
      },
      {
        speaker: "B",
        vietnamese: "Không xa, gần đây thôi.",
        english: "Not far, just nearby.",
        pronunciation: "khome sa, gan day toy",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn bạn.",
        english: "Thank you.",
        pronunciation: "gahm uhn ban",
      },
    ],
    cultural_note:
      "People may answer with gestures, so watch where they point.",
    tip:
      "Repeat đi thẳng and rẽ trái aloud so you remember the direction.",
  },
  {
    id: 30,
    level: "A1",
    title_en: "Roleplay: Shopping At A Market",
    subtitle: "Ask the price and buy one item.",
    intro:
      "Practice this for markets, fruit stalls, and small shops.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Cái này bao nhiêu tiền?",
        english: "How much is this?",
        pronunciation: "kai nai bao nyew teen",
      },
      {
        speaker: "B",
        vietnamese: "Năm mươi nghìn.",
        english: "Fifty thousand.",
        pronunciation: "nam moo-ee ngeen",
      },
      {
        speaker: "A",
        vietnamese: "Mắc quá. Bớt được không?",
        english: "Too expensive. Can you lower the price?",
        pronunciation: "mak gwa. buht duoc khome",
      },
      {
        speaker: "B",
        vietnamese: "Bốn mươi nghìn được không?",
        english: "Is forty thousand okay?",
        pronunciation: "bon moo-ee ngeen duoc khome",
      },
      {
        speaker: "A",
        vietnamese: "Được, tôi lấy cái này.",
        english: "Okay, I will take this one.",
        pronunciation: "duoc, toy lay kai nai",
      },
    ],
    cultural_note:
      "Bargaining can be friendly in markets, but prices are fixed in supermarkets and malls.",
    tip:
      "Use a calculator or phone screen if numbers are hard to hear.",
  },
  {
    id: 31,
    level: "A1",
    title_en: "Roleplay: Meeting A New Vietnamese Friend",
    subtitle: "Start a warm first conversation.",
    intro:
      "Practice this when meeting a friend of a friend, classmate, or neighbor.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin chào, tôi tên là Alex.",
        english: "Hello, my name is Alex.",
        pronunciation: "seen chow, toy ten la Alex",
      },
      {
        speaker: "B",
        vietnamese: "Chào Alex, rất vui gặp bạn.",
        english: "Hi Alex, nice to meet you.",
        pronunciation: "chow Alex, zut vui gap ban",
      },
      {
        speaker: "A",
        vietnamese: "Bạn quê ở đâu?",
        english: "Where is your hometown?",
        pronunciation: "ban kway uh dow",
      },
      {
        speaker: "B",
        vietnamese: "Tôi quê ở Đà Nẵng. Còn bạn?",
        english: "I am from Da Nang. And you?",
        pronunciation: "toy kway uh da nang. con ban",
      },
      {
        speaker: "A",
        vietnamese: "Tôi đến từ Canada.",
        english: "I am from Canada.",
        pronunciation: "toy den tu Canada",
      },
      {
        speaker: "B",
        vietnamese: "Bạn nói tiếng Việt tốt đó.",
        english: "You speak Vietnamese well.",
        pronunciation: "ban noy tee-eng vyet tote daw",
      },
    ],
    cultural_note:
      "Hometown questions are a normal friendly way to begin a conversation.",
    tip:
      "Prepare your country name and one simple follow-up question.",
  },
  {
    id: 32,
    level: "A1",
    title_en: "Roleplay: Landlord And Apartment Issue",
    subtitle: "Report a basic home problem.",
    intro:
      "Practice this when messaging or speaking to a landlord, guard, or building staff.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, máy lạnh bị hỏng.",
        english: "Sorry, the air conditioner is broken.",
        pronunciation: "seen loy, may lanh bee hong",
      },
      {
        speaker: "B",
        vietnamese: "Bị hỏng từ khi nào?",
        english: "Since when has it been broken?",
        pronunciation: "bee hong tu khi nao",
      },
      {
        speaker: "A",
        vietnamese: "Từ tối qua.",
        english: "Since last night.",
        pronunciation: "tu toy gwa",
      },
      {
        speaker: "B",
        vietnamese: "Tôi gọi người sửa nhé.",
        english: "I will call a repair person.",
        pronunciation: "toy goi nguoi sua nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn. Khi nào họ đến?",
        english: "Thank you. When will they come?",
        pronunciation: "gahm uhn. khi nao haw den",
      },
    ],
    cultural_note:
      "A photo or short video can make apartment problems easier to explain.",
    tip:
      "Use the first line with a photo when messaging your landlord.",
  },
  {
    id: 33,
    level: "A1",
    title_en: "Roleplay: Asking For Help When Lost",
    subtitle: "Get help calmly when you cannot find a place.",
    intro:
      "Practice this for a mall, neighborhood, station, or unfamiliar street.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, tôi bị lạc.",
        english: "Excuse me, I am lost.",
        pronunciation: "seen loy, toy bee lak",
      },
      {
        speaker: "B",
        vietnamese: "Bạn muốn đi đâu?",
        english: "Where do you want to go?",
        pronunciation: "ban mwon dee dow",
      },
      {
        speaker: "A",
        vietnamese: "Tôi muốn đến khách sạn này.",
        english: "I want to go to this hotel.",
        pronunciation: "toy mwon den khach san nai",
      },
      {
        speaker: "B",
        vietnamese: "Bạn đi thẳng rồi rẽ phải.",
        english: "Go straight, then turn right.",
        pronunciation: "ban dee thang roy zeh fai",
      },
      {
        speaker: "A",
        vietnamese: "Bạn chỉ trên bản đồ được không?",
        english: "Can you show me on the map?",
        pronunciation: "ban chee tren ban do duoc khome",
      },
      {
        speaker: "B",
        vietnamese: "Được, đây nhé.",
        english: "Sure, here.",
        pronunciation: "duoc, day nyeh",
      },
    ],
    cultural_note:
      "Showing a hotel name, map pin, or address helps people help you faster.",
    tip:
      "Keep your destination visible on your phone before asking for help.",
  },
  {
    id: 34,
    level: "A1",
    title_en: "Roleplay: Making A Simple Plan",
    subtitle: "Invite someone and confirm time.",
    intro:
      "Practice this when making plans with a friend, classmate, or coworker.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tối nay bạn rảnh không?",
        english: "Are you free tonight?",
        pronunciation: "toy nai ban ranh khome",
      },
      {
        speaker: "B",
        vietnamese: "Có, bạn muốn làm gì?",
        english: "Yes, what do you want to do?",
        pronunciation: "caw, ban mwon lam zee",
      },
      {
        speaker: "A",
        vietnamese: "Mình đi cà phê nhé?",
        english: "Let's go get coffee?",
        pronunciation: "ming dee cafe nyeh",
      },
      {
        speaker: "B",
        vietnamese: "Được. Mấy giờ gặp nhau?",
        english: "Okay. What time should we meet?",
        pronunciation: "duoc. may zuh gap nhau",
      },
      {
        speaker: "A",
        vietnamese: "Bảy giờ được không?",
        english: "Is seven o'clock okay?",
        pronunciation: "bay zuh duoc khome",
      },
      {
        speaker: "B",
        vietnamese: "Được, hẹn gặp bạn.",
        english: "Okay, see you.",
        pronunciation: "duoc, hen gap ban",
      },
    ],
    cultural_note:
      "Coffee is a common low-pressure plan in Vietnam.",
    tip:
      "Use nhé to make invitations sound softer and friendly.",
  },
  {
    id: 35,
    level: "A1",
    title_en: "Roleplay: Clinic Or Pharmacy Help",
    subtitle: "Ask for basic medical help.",
    intro:
      "Practice this for a pharmacy, hotel front desk, or basic clinic visit.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, tôi bị bệnh.",
        english: "Excuse me, I am sick.",
        pronunciation: "seen loy, toy bee ben",
      },
      {
        speaker: "B",
        vietnamese: "Bạn bị gì?",
        english: "What is wrong?",
        pronunciation: "ban bee zee",
      },
      {
        speaker: "A",
        vietnamese: "Tôi đau bụng.",
        english: "I have a stomachache.",
        pronunciation: "toy dow boong",
      },
      {
        speaker: "B",
        vietnamese: "Bạn cần thuốc không?",
        english: "Do you need medicine?",
        pronunciation: "ban kan thuoc khome",
      },
      {
        speaker: "A",
        vietnamese: "Có. Tôi cần thuốc nhẹ.",
        english: "Yes. I need mild medicine.",
        pronunciation: "caw. toy kan thuoc nyeh",
      },
      {
        speaker: "B",
        vietnamese: "Nếu nặng hơn, đi bệnh viện nhé.",
        english: "If it gets worse, go to the hospital.",
        pronunciation: "new nang hurn, dee ben vyen nyeh",
      },
    ],
    cultural_note:
      "For serious symptoms, ask for a hospital or clinic instead of only a pharmacy.",
    tip:
      "Keep a translated allergy or medical note on your phone if you need one.",
  },
];
