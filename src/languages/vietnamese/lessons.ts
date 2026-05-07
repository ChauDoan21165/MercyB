// src/languages/vietnamese/lessons.ts
//
// Small MVP: Vietnamese survival speaking for foreigners in Vietnam.
// Keep this intentionally compact. It is not a full curriculum.

export type VietnameseCefrLevel = "A1" | "A1+" | "A2" | "B1";

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
  {
    id: 36,
    level: "A1",
    title_en: "Pronunciation: Vietnamese Tones Overview",
    subtitle: "Hear pitch and voice shape before chasing every word.",
    intro:
      "Vietnamese meaning changes with tone. For survival speaking, slow down and make the tone shape clear enough for the listener.",
    phrases: [
      {
        english: "Flat tone example",
        vietnamese: "ma",
        pronunciation: "ma - level voice",
        context: "Example: keep the voice steady, not rising or falling.",
      },
      {
        english: "Rising tone example",
        vietnamese: "má",
        pronunciation: "ma - rising voice",
        context: "Example: lift the pitch like a short question.",
      },
      {
        english: "Practice line: Hello, I am learning Vietnamese.",
        vietnamese: "Xin chào, tôi đang học tiếng Việt.",
        pronunciation: "seen chow, toy dang hawk tee-eng vyet",
        context: "Use this line when people hear your accent and you want them to be patient.",
      },
    ],
    cultural_note:
      "Common mistake: foreigners say every tone flat. Vietnamese listeners then hear a different word or no clear word.",
    tip:
      "Practice slowly first. Clear tone shape matters more than speed.",
  },
  {
    id: 37,
    level: "A1",
    title_en: "Pronunciation: The Six Tones Of Ma",
    subtitle: "Same base sound, different tone shape.",
    intro:
      "Use ma, má, mà, mả, mã, mạ to feel how tone changes meaning. This is practice for your ear and voice, not a grammar lesson.",
    phrases: [
      {
        english: "Six-tone contrast",
        vietnamese: "ma, má, mà, mả, mã, mạ",
        pronunciation: "ma, ma rising, ma falling, ma dipping, ma broken rising, ma low heavy",
        context: "Say them slowly as six different voice shapes.",
      },
      {
        english: "Low heavy tone example",
        vietnamese: "mạ",
        pronunciation: "ma - low and firm",
        context: "Do not add a long English vowel; keep it short and low.",
      },
      {
        english: "Practice line: I don't understand yet.",
        vietnamese: "Tôi chưa hiểu.",
        pronunciation: "toy chua hyew",
        context: "Use when you need someone to explain again.",
      },
    ],
    cultural_note:
      "Common mistake: learners only change loudness. Tone is pitch and voice shape, not volume.",
    tip:
      "Use your hand to trace the pitch: flat, up, down, dip, broken-up, low-heavy.",
  },
  {
    id: 38,
    level: "A1",
    title_en: "Pronunciation: Xin Chào",
    subtitle: "Make your first greeting easy to understand.",
    intro:
      "Xin chào is the safest polite greeting for foreigners. The chào tone falls, so do not say it like English chow with a rising voice.",
    phrases: [
      {
        english: "Hello",
        vietnamese: "Xin chào",
        pronunciation: "seen chow - let chow fall",
        context: "Use with anyone politely.",
      },
      {
        english: "Hello everyone",
        vietnamese: "Xin chào mọi người",
        pronunciation: "seen chow moy nguoi",
        context: "Use when greeting a small group.",
      },
      {
        english: "Practice line: Hello, my name is Alex.",
        vietnamese: "Xin chào, tôi tên là Alex.",
        pronunciation: "seen chow, toy ten la Alex",
        context: "Use for a simple first introduction.",
      },
    ],
    cultural_note:
      "Common mistake: saying chào too flat or too much like English chow. Let the tone fall gently.",
    tip:
      "Keep xin short and let chào carry the greeting.",
  },
  {
    id: 39,
    level: "A1",
    title_en: "Pronunciation: Cảm Ơn",
    subtitle: "Say thank you with clear tones.",
    intro:
      "Cảm ơn is short, but both words have tone movement. Say it slowly so it does not blur into one flat sound.",
    phrases: [
      {
        english: "Thank you",
        vietnamese: "Cảm ơn",
        pronunciation: "gahm uhn - dip on cảm",
        context: "Use anytime someone helps you.",
      },
      {
        english: "Thank you very much",
        vietnamese: "Cảm ơn nhiều",
        pronunciation: "gahm uhn nyew",
        context: "Use when someone gives extra help.",
      },
      {
        english: "Practice line: Thank you for helping me.",
        vietnamese: "Cảm ơn bạn đã giúp tôi.",
        pronunciation: "gahm uhn ban da zoop toy",
        context: "Use after someone gives directions or solves a small problem.",
      },
    ],
    cultural_note:
      "Common mistake: dropping the tone on cảm and saying a flat cam. The listener may still guess, but the phrase sounds unclear.",
    tip:
      "Pause slightly between cảm and ơn if you are new.",
  },
  {
    id: 40,
    level: "A1",
    title_en: "Pronunciation: Không",
    subtitle: "A tiny word you will use every day.",
    intro:
      "Không means no or not. It appears in many survival questions, so make the kh sound and the round vowel clear.",
    phrases: [
      {
        english: "No / not",
        vietnamese: "Không",
        pronunciation: "khome - airy kh, round o",
        context: "Use as a short answer or inside questions.",
      },
      {
        english: "Is that okay?",
        vietnamese: "Được không?",
        pronunciation: "duoc khome",
        context: "Use when asking if something is possible.",
      },
      {
        english: "Practice line: Do you speak English?",
        vietnamese: "Bạn nói tiếng Anh được không?",
        pronunciation: "ban noy tee-eng anh duoc khome",
        context: "Use before switching to English.",
      },
    ],
    cultural_note:
      "Common mistake: saying không like English come. Start with a breathy kh and keep the vowel round.",
    tip:
      "Practice không by itself, then in được không and cay không.",
  },
  {
    id: 41,
    level: "A1",
    title_en: "Pronunciation: Ng Sound Survival",
    subtitle: "The ng sound can start a Vietnamese word.",
    intro:
      "Vietnamese uses ng at the start of words. Foreigners often skip it, but it is important in common words like người and ngon.",
    phrases: [
      {
        english: "Person / people",
        vietnamese: "người",
        pronunciation: "ngoo-ee",
        context: "You hear this in hai người, many people, and family talk.",
      },
      {
        english: "Delicious",
        vietnamese: "ngon",
        pronunciation: "ngon",
        context: "Use after eating something good.",
      },
      {
        english: "Practice line: Very delicious.",
        vietnamese: "Ngon lắm.",
        pronunciation: "ngon lam",
        context: "Use as a friendly compliment at meals.",
      },
    ],
    cultural_note:
      "Common mistake: changing ng to n or g. Keep the back-of-mouth ng sound from English sing, but put it at the front.",
    tip:
      "Start with sing-ngon, then remove sing and keep ngon.",
  },
  {
    id: 42,
    level: "A1",
    title_en: "Pronunciation: Final T, C, And P",
    subtitle: "Stop the word cleanly at the end.",
    intro:
      "Vietnamese final consonants are short stops. Do not add an extra vowel after final t, c, or p.",
    phrases: [
      {
        english: "A little",
        vietnamese: "một chút",
        pronunciation: "moht chut - stop at t",
        context: "Useful in phrases like wait a little or a little ice.",
      },
      {
        english: "Can / possible",
        vietnamese: "được",
        pronunciation: "duoc - stop at c",
        context: "You hear this in được không.",
      },
      {
        english: "Practice line: Please wait a little.",
        vietnamese: "Chờ chút nhé.",
        pronunciation: "chuh chut nyeh",
        context: "Use when asking someone to wait briefly.",
      },
    ],
    cultural_note:
      "Common mistake: adding an English-style extra sound, like chút-uh or được-uh. Stop cleanly.",
    tip:
      "End the word by closing your mouth or tongue position, then stop.",
  },
  {
    id: 43,
    level: "A1",
    title_en: "Pronunciation: Short And Long Vowels",
    subtitle: "Small vowel changes can make words sound different.",
    intro:
      "Vietnamese has vowel contrasts that can feel small to foreigners. For survival, listen for length and mouth shape in common words.",
    phrases: [
      {
        english: "Year / five",
        vietnamese: "năm",
        pronunciation: "num - short",
        context: "Used in numbers and dates.",
      },
      {
        english: "Male / south",
        vietnamese: "nam",
        pronunciation: "nahm - more open",
        context: "You hear this in Việt Nam.",
      },
      {
        english: "Practice line: I just arrived in Vietnam.",
        vietnamese: "Tôi mới đến Việt Nam.",
        pronunciation: "toy moy den vyet nahm",
        context: "Use when explaining that you are new here.",
      },
    ],
    cultural_note:
      "Common mistake: using one English a sound for every Vietnamese vowel. Slow down and copy the mouth shape.",
    tip:
      "Practice with words you actually say, like Việt Nam, năm, bạn, and làm.",
  },
  {
    id: 44,
    level: "A1",
    title_en: "Pronunciation: Polite Phrase Rhythm",
    subtitle: "Sound calm and respectful in short phrases.",
    intro:
      "Vietnamese polite phrases often sound softer when you keep them short, even, and not too loud.",
    phrases: [
      {
        english: "Please help me",
        vietnamese: "giúp tôi",
        pronunciation: "zoop toy",
        context: "Add after many requests to sound polite.",
      },
      {
        english: "A soft ending",
        vietnamese: "nhé",
        pronunciation: "nyeh",
        context: "Use to soften requests or invitations.",
      },
      {
        english: "Practice line: Please help me stop here.",
        vietnamese: "Dừng ở đây giúp tôi nhé.",
        pronunciation: "zoong uh day zoop toy nyeh",
        context: "Use in a taxi or Grab when arriving.",
      },
    ],
    cultural_note:
      "Common mistake: stressing every word like English. Vietnamese often sounds smoother when each short word stays clear.",
    tip:
      "Say the phrase in small chunks: dừng ở đây / giúp tôi / nhé.",
  },
  {
    id: 45,
    level: "A1",
    title_en: "Pronunciation: Common Foreigner Mistakes",
    subtitle: "Fix the sounds that most often block understanding.",
    intro:
      "You do not need perfect Vietnamese. Focus on a few mistakes that make everyday phrases hard to understand.",
    phrases: [
      {
        english: "Do not flatten tones",
        vietnamese: "có, không, được",
        pronunciation: "caw, khome, duoc",
        context: "These words appear in many yes/no questions.",
      },
      {
        english: "Do not drop final sounds",
        vietnamese: "một, chút, được",
        pronunciation: "moht, chut, duoc",
        context: "Final stops help the word stay recognizable.",
      },
      {
        english: "Practice line: Can you say that again?",
        vietnamese: "Bạn nói lại được không?",
        pronunciation: "ban noy lai duoc khome",
        context: "Use when pronunciation or listening breaks down.",
      },
    ],
    cultural_note:
      "Common mistake: speaking too fast to hide uncertainty. Slow clear speech works better.",
    tip:
      "Pick three daily words and make them clear: không, được, cảm ơn.",
  },
  {
    id: 46,
    level: "A1",
    title_en: "Pronunciation: Northern And Southern Note",
    subtitle: "Expect different local accents.",
    intro:
      "Vietnamese pronunciation changes by region. A word may sound slightly different in Hanoi, Da Nang, and Ho Chi Minh City.",
    phrases: [
      {
        english: "Yes / polite yes",
        vietnamese: "dạ",
        pronunciation: "yah or zah depending on region",
        context: "You will hear this often in shops, cafes, and family settings.",
      },
      {
        english: "Then / already",
        vietnamese: "rồi",
        pronunciation: "roy, zoy, or goy depending on region",
        context: "Used in many daily sentences like tới rồi.",
      },
      {
        english: "Practice line: I arrived.",
        vietnamese: "Tôi tới rồi.",
        pronunciation: "toy toy roy",
        context: "Use by text or phone when you reach a meeting place.",
      },
    ],
    cultural_note:
      "Common mistake: thinking one accent is the only correct Vietnamese. Regional variation is normal.",
    tip:
      "Copy the people around you, but keep your core survival phrases clear and slow.",
  },
  {
    id: 47,
    level: "A1",
    title_en: "Pronunciation: Listening For Tone",
    subtitle: "Train your ear to hear more than the base word.",
    intro:
      "When listening, do not only hear the consonants and vowels. Listen for the tone shape because it carries meaning.",
    phrases: [
      {
        english: "Listen for rising tone",
        vietnamese: "má, có, nhé",
        pronunciation: "rising or high tone shapes",
        context: "These words may sound small, but the tone helps you identify them.",
      },
      {
        english: "Listen for low or heavy tone",
        vietnamese: "mạ, chợ, bệnh",
        pronunciation: "low or heavy tone shapes",
        context: "These tones can sound shorter or heavier to foreign ears.",
      },
      {
        english: "Practice line: Sorry, I can't hear clearly.",
        vietnamese: "Xin lỗi, tôi nghe không rõ.",
        pronunciation: "seen loy, toy nghe khome raw",
        context: "Use when noise or speed makes Vietnamese hard to catch.",
      },
    ],
    cultural_note:
      "Common mistake: hearing only ma and missing whether it was má, mà, mả, mã, or mạ.",
    tip:
      "When lost, ask for repetition slowly: Bạn nói lại được không?",
  },
  {
    id: 48,
    level: "A1",
    title_en: "Telling Stories About Your Day",
    subtitle: "Say what happened, what you did, and how you felt.",
    intro:
      "Use these sentences when talking to friends, coworkers, or family about a normal day in Vietnam.",
    phrases: [
      {
        english: "Today I went to work, then I had coffee with a colleague.",
        vietnamese: "Hôm nay tôi đi làm, rồi tôi uống cà phê với đồng nghiệp.",
        pronunciation: "hom nay toy dee lam, roy toy uong cafe voy dong ngeep",
        context: "Use to tell someone what your day looked like.",
      },
      {
        english: "After work, I went home and rested for a while.",
        vietnamese: "Sau giờ làm, tôi về nhà và nghỉ một lúc.",
        pronunciation: "sow zuh lam, toy veh nha va nghee moht ook",
        context: "Useful for describing a simple evening routine.",
      },
      {
        english: "I was busy today, so I didn't have much time.",
        vietnamese: "Hôm nay tôi bận, nên tôi không có nhiều thời gian.",
        pronunciation: "hom nay toy bun, nen toy khome kaw nyew thoy zan",
        context: "Use when explaining why you could not do something.",
      },
      {
        english: "The weather was hot, but the day was still good.",
        vietnamese: "Trời nóng, nhưng hôm nay vẫn ổn.",
        pronunciation: "choy nong, nyung hom nay van own",
        context: "Use when giving a light opinion about the day.",
      },
      {
        english: "I talked with my friend about work and life in Vietnam.",
        vietnamese: "Tôi nói chuyện với bạn tôi về công việc và cuộc sống ở Việt Nam.",
        pronunciation: "toy noy chuyen voy ban toy veh kong vyek va kwok song uh vyet nam",
        context: "Use when telling a friend what you discussed.",
      },
      {
        english: "I felt a little tired, but I was happy.",
        vietnamese: "Tôi hơi mệt, nhưng tôi khá vui.",
        pronunciation: "toy hoy met, nyung toy kha vui",
        context: "Useful for a short honest daily-life update.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Hôm nay của bạn thế nào?",
        english: "How was your day?",
        pronunciation: "hom nay cua ban the nao",
      },
      {
        speaker: "B",
        vietnamese: "Tôi đi làm rồi về nhà sớm.",
        english: "I went to work, then came home early.",
        pronunciation: "toy dee lam roy veh nha som",
      },
      {
        speaker: "A",
        vietnamese: "Có gì vui không?",
        english: "Anything good happen?",
        pronunciation: "kaw zee vui khome",
      },
      {
        speaker: "B",
        vietnamese: "Có, tôi uống cà phê với một người bạn.",
        english: "Yes, I had coffee with a friend.",
        pronunciation: "kaw, toy uong cafe voy moht nguo-ee ban",
      },
    ],
    cultural_note:
      "Vietnamese people often tell stories in a simple order: first what happened, then why, then how they felt.",
    tip:
      "Use rồi, nên, and nhưng to make your story sound more natural without using long grammar explanations.",
  },
  {
    id: 49,
    level: "A1",
    title_en: "Explaining Problems",
    subtitle: "Describe what is wrong in a clear, adult way.",
    intro:
      "These lines help when something is broken, confusing, late, or not working the way you expected.",
    phrases: [
      {
        english: "I have a small problem.",
        vietnamese: "Tôi có một vấn đề nhỏ.",
        pronunciation: "toy kaw moht vun de nyaw",
        context: "Use before explaining the issue.",
      },
      {
        english: "The Wi-Fi is not working.",
        vietnamese: "Wi-Fi không hoạt động.",
        pronunciation: "wai fai khome hoaht dong",
        context: "Useful in cafes, apartments, and offices.",
      },
      {
        english: "I lost my key.",
        vietnamese: "Tôi bị mất chìa khóa.",
        pronunciation: "toy bee mut chee-ah kwa",
        context: "Use when you need help getting into a room or house.",
      },
      {
        english: "My phone battery is dead.",
        vietnamese: "Điện thoại tôi hết pin rồi.",
        pronunciation: "dee-n thoai toy het pin roy",
        context: "Use when you need a charger or time.",
      },
      {
        english: "The room is too hot, and the air conditioner is broken.",
        vietnamese: "Phòng nóng quá, và máy lạnh bị hỏng.",
        pronunciation: "fong nong gwa, va may lanh bee hong",
        context: "Use with a landlord, hotel staff, or host.",
      },
      {
        english: "I don't feel well today.",
        vietnamese: "Hôm nay tôi không khỏe.",
        pronunciation: "hom nay toy khome kweh",
        context: "Useful if you need to stop work or go home early.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Có chuyện gì vậy?",
        english: "What happened?",
        pronunciation: "kaw chuyen zee vay",
      },
      {
        speaker: "B",
        vietnamese: "Wi-Fi không hoạt động.",
        english: "The Wi-Fi is not working.",
        pronunciation: "wai fai khome hoaht dong",
      },
      {
        speaker: "A",
        vietnamese: "Bạn đã thử tắt rồi bật lại chưa?",
        english: "Have you tried turning it off and on again?",
        pronunciation: "ban da thu tat roy bat lai chua",
      },
      {
        speaker: "B",
        vietnamese: "Rồi, nhưng vẫn không được.",
        english: "Yes, but it still doesn't work.",
        pronunciation: "roy, nyung van khome duoc",
      },
    ],
    cultural_note:
      "In Vietnam, short problem statements are often easier to help with than long explanations.",
    tip:
      "Start with the problem first. You can explain the details after the other person understands the main issue.",
  },
  {
    id: 50,
    level: "A1",
    title_en: "Giving Opinions Politely",
    subtitle: "Say what you think without sounding too strong.",
    intro:
      "Use these phrases at dinner, in class, at work, or when talking with friends and family.",
    phrases: [
      {
        english: "I think this is good.",
        vietnamese: "Tôi nghĩ cái này tốt.",
        pronunciation: "toy nghee kai nai tot",
        context: "Use for a simple positive opinion.",
      },
      {
        english: "In my opinion, this is a bit expensive.",
        vietnamese: "Theo tôi, cái này hơi đắt.",
        pronunciation: "theo toy, kai nai hoy dat",
        context: "Useful for soft disagreement about price.",
      },
      {
        english: "I prefer this one because it is easier.",
        vietnamese: "Tôi thích cái này hơn vì nó dễ hơn.",
        pronunciation: "toy thik kai nai hon vi no ze hon",
        context: "Use when comparing two choices.",
      },
      {
        english: "I don't like it very much, but it's okay.",
        vietnamese: "Tôi không thích lắm, nhưng cũng được.",
        pronunciation: "toy khome thik lam, nyung koong duoc",
        context: "Polite, gentle negative opinion.",
      },
      {
        english: "Maybe we can try another option.",
        vietnamese: "Có lẽ mình thử cách khác nhé.",
        pronunciation: "caw le ming thu kahk khac nyeh",
        context: "Use when suggesting a different idea.",
      },
    ],
    cultural_note:
      "Vietnamese conversation often sounds warmer when you soften opinions with theo tôi, có lẽ, or cũng được.",
    tip:
      "If you are unsure, do not make the sentence too strong. Soft opinions are easier to receive.",
  },
  {
    id: 51,
    level: "A1",
    title_en: "Making And Changing Plans",
    subtitle: "Arrange a time, then adjust it naturally.",
    intro:
      "These are the lines you need for everyday invitations, confirmations, and last-minute changes.",
    phrases: [
      {
        english: "If you're free tonight, we can go for coffee.",
        vietnamese: "Nếu bạn rảnh tối nay, mình đi uống cà phê nhé?",
        pronunciation: "new ban ranh toy nay, ming dee uong cafe nyeh",
        context: "Use to make a friendly plan.",
      },
      {
        english: "What time works for you?",
        vietnamese: "Mấy giờ thì tiện cho bạn?",
        pronunciation: "may zuh thi tyeen chaw ban",
        context: "Useful when scheduling a meeting.",
      },
      {
        english: "I can meet after 7 p.m.",
        vietnamese: "Tôi có thể gặp sau 7 giờ tối.",
        pronunciation: "toy kaw teh gap sow bay zuh toy",
        context: "Use when giving a time you are available.",
      },
      {
        english: "I need to change the plan.",
        vietnamese: "Tôi cần đổi kế hoạch.",
        pronunciation: "toy kun doy kay hoaht",
        context: "Use when your schedule changes.",
      },
      {
        english: "Sorry, I can't make it today.",
        vietnamese: "Xin lỗi, hôm nay tôi không đi được.",
        pronunciation: "seen loy, hom nay toy khome dee duoc",
        context: "Use when cancelling politely.",
      },
      {
        english: "Let's do it another day.",
        vietnamese: "Để hôm khác nhé.",
        pronunciation: "deh hom khak nyeh",
        context: "Use to reschedule casually.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Nếu bạn rảnh tối nay, mình đi uống cà phê nhé?",
        english: "If you're free tonight, we can go for coffee.",
        pronunciation: "new ban ranh toy nay, ming dee uong cafe nyeh",
      },
      {
        speaker: "B",
        vietnamese: "Được, mấy giờ thì tiện cho bạn?",
        english: "Sure, what time works for you?",
        pronunciation: "duoc, may zuh thi tyeen chaw ban",
      },
      {
        speaker: "A",
        vietnamese: "Khoảng 7 giờ tối nhé.",
        english: "Around 7 p.m.?",
        pronunciation: "khowang bay zuh toy nyeh",
      },
      {
        speaker: "B",
        vietnamese: "Được, nhưng nếu mưa thì mình đổi sang ngày mai.",
        english: "Okay, but if it rains, we can move it to tomorrow.",
        pronunciation: "duoc, nyung new mua thi ming doy sang ngay mai",
      },
    ],
    cultural_note:
      "Vietnamese plans often stay flexible. People usually confirm again close to the time.",
    tip:
      "When changing plans, be direct but polite. A short xin lỗi is usually enough.",
  },
  {
    id: 52,
    level: "A1",
    title_en: "Talking About Work",
    subtitle: "Simple work talk for colleagues and small talk.",
    intro:
      "Use these with coworkers, clients, or anyone asking what you do in Vietnam.",
    phrases: [
      {
        english: "I work near here.",
        vietnamese: "Tôi làm việc gần đây.",
        pronunciation: "toy lam vyek gun day",
        context: "Good answer when someone asks about your job location.",
      },
      {
        english: "I work from home sometimes.",
        vietnamese: "Thỉnh thoảng tôi làm việc ở nhà.",
        pronunciation: "tinh thowang toy lam vyek uh nha",
        context: "Useful for explaining your routine.",
      },
      {
        english: "I am busy this week.",
        vietnamese: "Tuần này tôi bận.",
        pronunciation: "twan nai toy bun",
        context: "Use when you cannot take on more work or meetings.",
      },
      {
        english: "My job is difficult, but interesting.",
        vietnamese: "Công việc của tôi hơi khó, nhưng thú vị.",
        pronunciation: "kong vyek cua toy hoy kho, nyung thu vee",
        context: "Helpful for a natural work conversation.",
      },
      {
        english: "I need a little more time.",
        vietnamese: "Tôi cần thêm chút thời gian.",
        pronunciation: "toy kun them chut thoy zan",
        context: "Useful at work when you need a delay.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn làm việc ở đâu?",
        english: "Where do you work?",
        pronunciation: "ban lam vyek uh dow",
      },
      {
        speaker: "B",
        vietnamese: "Tôi làm việc gần đây.",
        english: "I work near here.",
        pronunciation: "toy lam vyek gun day",
      },
      {
        speaker: "A",
        vietnamese: "Công việc có bận không?",
        english: "Is work busy?",
        pronunciation: "kong vyek kaw bun khome",
      },
      {
        speaker: "B",
        vietnamese: "Tuần này tôi hơi bận, nhưng vẫn ổn.",
        english: "I'm a little busy this week, but it's okay.",
        pronunciation: "twan nai toy hoy bun, nyung van own",
      },
    ],
    cultural_note:
      "Work talk in Vietnam is often practical and brief. People may ask where you work before they ask deeper questions.",
    tip:
      "If your sentence feels too long, start with nơi làm việc, thời gian, or bận / rảnh.",
  },
  {
    id: 53,
    level: "A1",
    title_en: "Talking About Family And Relationships",
    subtitle: "Simple family language for daily conversations.",
    intro:
      "Use this with friends, in-laws, landlords, or anyone asking about your family life.",
    phrases: [
      {
        english: "I live with my family.",
        vietnamese: "Tôi sống với gia đình.",
        pronunciation: "toy song voy za ding",
        context: "A natural answer about your living situation.",
      },
      {
        english: "My wife / husband is Vietnamese.",
        vietnamese: "Vợ / chồng tôi là người Việt.",
        pronunciation: "vo / chong toy la nguo-ee vyet",
        context: "Use when talking about your partner.",
      },
      {
        english: "I have one child.",
        vietnamese: "Tôi có một con.",
        pronunciation: "toy kaw moht kon",
        context: "Useful for simple family introductions.",
      },
      {
        english: "My family is in another city.",
        vietnamese: "Gia đình tôi ở thành phố khác.",
        pronunciation: "za ding toy uh thanh pho khac",
        context: "Good when explaining why you travel often.",
      },
      {
        english: "We often eat dinner together.",
        vietnamese: "Chúng tôi thường ăn tối cùng nhau.",
        pronunciation: "choong toy thuong an toy koong nhau",
        context: "Useful for describing family routine.",
      },
    ],
    cultural_note:
      "Family is an important topic in Vietnam, and simple sentences about family often make conversations warmer.",
    tip:
      "You do not need fancy grammar. A short sentence about who lives with you is enough.",
  },
  {
    id: 54,
    level: "A1",
    title_en: "Renting An Apartment",
    subtitle: "Deeper questions for housing and landlords.",
    intro:
      "Use these when you are moving in, renewing a lease, or solving apartment issues.",
    phrases: [
      {
        english: "I want to rent this apartment for a long time.",
        vietnamese: "Tôi muốn thuê căn hộ này lâu dài.",
        pronunciation: "toy mwon thue kan ho nai lau zai",
        context: "Use when discussing a lease.",
      },
      {
        english: "Is electricity and water included in the rent?",
        vietnamese: "Tiền điện nước đã bao gồm trong tiền thuê chưa?",
        pronunciation: "tyen deen nuok da bao gom trong tyen thue chua",
        context: "Important question before signing a contract.",
      },
      {
        english: "Can we fix the water problem today?",
        vietnamese: "Hôm nay mình sửa vấn đề nước được không?",
        pronunciation: "hom nay ming sua vun de nuok duoc khome",
        context: "Use when something in the apartment is not working.",
      },
      {
        english: "I would like a quieter room.",
        vietnamese: "Tôi muốn một căn yên tĩnh hơn.",
        pronunciation: "toy mwon moht kan yen ting hon",
        context: "Useful when choosing a place to live.",
      },
      {
        english: "When can the landlord come?",
        vietnamese: "Khi nào chủ nhà có thể qua?",
        pronunciation: "khi nao chu nha kaw teh kwa",
        context: "Use when arranging repairs or a visit.",
      },
      {
        english: "I need to give one month's notice.",
        vietnamese: "Tôi cần báo trước một tháng.",
        pronunciation: "toy kun bao truok moht thang",
        context: "Useful for moving out or ending a lease.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tiền điện nước đã bao gồm trong tiền thuê chưa?",
        english: "Are electricity and water included in the rent?",
        pronunciation: "tyen deen nuok da bao gom trong tyen thue chua",
      },
      {
        speaker: "B",
        vietnamese: "Chưa, tính riêng nhé.",
        english: "No, they're charged separately.",
        pronunciation: "chua, ting ryeng nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Vậy mỗi tháng khoảng bao nhiêu?",
        english: "So how much is it each month?",
        pronunciation: "vay moi thang khowang bao nyew",
      },
      {
        speaker: "B",
        vietnamese: "Tùy mức dùng, nhưng tháng trước hơi cao.",
        english: "It depends on usage, but last month was a bit high.",
        pronunciation: "twee muk zoong, nyung thang truok hoy kaw",
      },
    ],
    cultural_note:
      "Housing conversations often include utilities, deposit, repair timing, and notice periods.",
    tip:
      "If you are unsure, ask each item one by one. Apartment talk does not need perfect grammar.",
  },
  {
    id: 55,
    level: "A1",
    title_en: "Doctor And Pharmacy Explanations",
    subtitle: "Describe symptoms clearly and simply.",
    intro:
      "Use these when talking to a doctor, nurse, or pharmacist in Vietnam.",
    phrases: [
      {
        english: "I have had a fever since yesterday.",
        vietnamese: "Tôi bị sốt từ hôm qua.",
        pronunciation: "toy bee sot tu hom kwa",
        context: "Useful when explaining when the problem started.",
      },
      {
        english: "My throat hurts when I swallow.",
        vietnamese: "Tôi đau họng khi nuốt.",
        pronunciation: "toy dow hong khi nuot",
        context: "Simple symptom description for a clinic or pharmacy.",
      },
      {
        english: "I need medicine for a headache.",
        vietnamese: "Tôi cần thuốc đau đầu.",
        pronunciation: "toy kun thuok dow dow",
        context: "Useful in a pharmacy.",
      },
      {
        english: "I am allergic to this medicine.",
        vietnamese: "Tôi bị dị ứng với thuốc này.",
        pronunciation: "toy bee zee oong voy thuok nai",
        context: "Very important medical phrase.",
      },
      {
        english: "Can you explain how to take it?",
        vietnamese: "Bạn có thể giải thích cách uống không?",
        pronunciation: "ban kaw teh zai thik kahk uong khome",
        context: "Use when you need dosage instructions.",
      },
      {
        english: "Please speak a little slower.",
        vietnamese: "Làm ơn nói chậm hơn một chút.",
        pronunciation: "lam uhn noy cham hon moht chut",
        context: "Useful if medical Vietnamese is too fast.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi bị sốt từ hôm qua.",
        english: "I have had a fever since yesterday.",
        pronunciation: "toy bee sot tu hom kwa",
      },
      {
        speaker: "B",
        vietnamese: "Bạn có đau họng không?",
        english: "Do you have a sore throat?",
        pronunciation: "ban kaw dow hong khome",
      },
      {
        speaker: "A",
        vietnamese: "Có, và tôi hơi mệt.",
        english: "Yes, and I feel a bit tired.",
        pronunciation: "kaw, va toy hoy met",
      },
      {
        speaker: "B",
        vietnamese: "Đây là thuốc, bạn uống sau bữa ăn nhé.",
        english: "This is the medicine. Take it after meals.",
        pronunciation: "day la thuok, ban uong sow bua an nyeh",
      },
    ],
    cultural_note:
      "Medical conversations are easier when you say one symptom at a time and mention when it started.",
    tip:
      "If you do not understand the pharmacist, ask for cách uống and thời gian uống first.",
  },
  {
    id: 56,
    level: "A1",
    title_en: "Workplace Vietnamese",
    subtitle: "Useful phrases for office or team conversations.",
    intro:
      "Use these with coworkers when discussing tasks, timing, and coordination.",
    phrases: [
      {
        english: "I will finish this by tomorrow morning.",
        vietnamese: "Tôi sẽ xong việc này trước sáng mai.",
        pronunciation: "toy seh song vyek nai truok sang mai",
        context: "Useful for deadlines.",
      },
      {
        english: "Can you send me the file?",
        vietnamese: "Bạn gửi cho tôi file được không?",
        pronunciation: "ban goo-ee chaw toy fai duoc khome",
        context: "Useful in office chats.",
      },
      {
        english: "Let's discuss this after lunch.",
        vietnamese: "Mình bàn việc này sau bữa trưa nhé.",
        pronunciation: "ming ban vyek nai sow bua chua nyeh",
        context: "Good for delaying a longer discussion.",
      },
      {
        english: "I agree, but I have one small concern.",
        vietnamese: "Tôi đồng ý, nhưng tôi có một chút lo lắng.",
        pronunciation: "toy dong ee, nyung toy kaw moht chut lo lang",
        context: "Use in a polite work discussion.",
      },
      {
        english: "We need to check it again before sending.",
        vietnamese: "Mình cần kiểm tra lại trước khi gửi.",
        pronunciation: "ming kun kyem cha lai truok khi goo-ee",
        context: "Useful for teamwork and quality control.",
      },
    ],
    cultural_note:
      "Workplace Vietnamese often uses short coordination phrases with cần, sẽ, trước khi, and sau khi.",
    tip:
      "When speaking at work, focus on timing and action first. That keeps the message clear.",
  },
  {
    id: 57,
    level: "A1",
    title_en: "Natural Connectors",
    subtitle: "Link ideas with vì, nên, nhưng, nếu, khi.",
    intro:
      "These connectors help your Vietnamese sound more connected and less like separate short sentences.",
    phrases: [
      {
        english: "I stayed home because I was tired.",
        vietnamese: "Tôi ở nhà vì tôi hơi mệt.",
        pronunciation: "toy uh nha vi toy hoy met",
        context: "Use vì to explain the reason.",
      },
      {
        english: "It was raining, so I took a taxi.",
        vietnamese: "Trời mưa nên tôi đi taxi.",
        pronunciation: "choy mua nen toy dee taxi",
        context: "Use nên to show result.",
      },
      {
        english: "I like this place, but it's a little noisy.",
        vietnamese: "Tôi thích chỗ này, nhưng hơi ồn.",
        pronunciation: "toy thik cho nai, nyung hoy on",
        context: "Use but / nhưng to soften a negative point.",
      },
      {
        english: "If you are busy, we can meet another day.",
        vietnamese: "Nếu bạn bận, mình gặp ngày khác nhé.",
        pronunciation: "new ban bun, ming gap ngay khac nyeh",
        context: "Use nếu for a simple condition.",
      },
      {
        english: "When I get home, I will call you.",
        vietnamese: "Khi tôi về nhà, tôi sẽ gọi cho bạn.",
        pronunciation: "khi toy veh nha, toy seh goy chaw ban",
        context: "Use khi to connect time and action.",
      },
      {
        english: "I didn't go out because I wanted to rest.",
        vietnamese: "Tôi không ra ngoài vì tôi muốn nghỉ.",
        pronunciation: "toy khome ra ngowai vi toy mwon nghee",
        context: "A longer sentence that sounds more natural.",
      },
    ],
    cultural_note:
      "These connectors are enough to make many everyday sentences sound more fluent without studying formal grammar.",
    tip:
      "Practice one connector per sentence until it feels automatic. Do not try to learn all five at once.",
  },
  {
    id: 58,
    level: "A1",
    title_en: "Clarifying And Following Up",
    subtitle: "Keep the conversation moving naturally.",
    intro:
      "Use these when you want more detail, want to confirm meaning, or want to ask a follow-up question.",
    phrases: [
      {
        english: "Sorry, I don't quite understand what you mean.",
        vietnamese: "Xin lỗi, tôi chưa hiểu ý bạn lắm.",
        pronunciation: "seen loy, toy chua hyew ee ban lam",
        context: "Useful when the idea is still unclear.",
      },
      {
        english: "Can you say that a little more clearly?",
        vietnamese: "Bạn có thể nói rõ hơn một chút không?",
        pronunciation: "ban kaw teh noy raw hon moht chut khome",
        context: "Polite clarification request.",
      },
      {
        english: "Do you mean today or tomorrow?",
        vietnamese: "Ý bạn là hôm nay hay ngày mai?",
        pronunciation: "ee ban la hom nay hai ngay mai",
        context: "Useful when a time point is unclear.",
      },
      {
        english: "What do you suggest?",
        vietnamese: "Bạn gợi ý gì?",
        pronunciation: "ban goy ee zee",
        context: "Use to ask for a follow-up idea.",
      },
      {
        english: "Can you give me an example?",
        vietnamese: "Bạn cho tôi một ví dụ được không?",
        pronunciation: "ban chaw toy moht vee zoo duoc khome",
        context: "Great when learning or discussing instructions.",
      },
      {
        english: "I understand a little more now.",
        vietnamese: "Bây giờ tôi hiểu hơn một chút rồi.",
        pronunciation: "bay zuh toy hyew hon moht chut roy",
        context: "Use after someone explains again.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, tôi chưa hiểu ý bạn lắm.",
        english: "Sorry, I don't quite understand what you mean.",
        pronunciation: "seen loy, toy chua hyew ee ban lam",
      },
      {
        speaker: "B",
        vietnamese: "Ý tôi là bạn có thể đến sớm hơn.",
        english: "I mean you can come earlier.",
        pronunciation: "ee toy la ban kaw teh den som hon",
      },
      {
        speaker: "A",
        vietnamese: "À, vậy là khoảng 6 giờ phải không?",
        english: "Ah, so around 6 o'clock, right?",
        pronunciation: "a, vay la khowang sau zuh fai khome",
      },
      {
        speaker: "B",
        vietnamese: "Đúng rồi, 6 giờ cũng được.",
        english: "Yes, 6 o'clock is fine.",
        pronunciation: "doong roy, sau zuh koong duoc",
      },
    ],
    cultural_note:
      "Good follow-up questions make Vietnamese conversations smoother than trying to guess and answer too quickly.",
    tip:
      "If you are not sure, ask one small clarifying question instead of restarting the whole conversation.",
  },
  {
    id: 59,
    level: "A1",
    title_en: "Talking About Your Routine",
    subtitle: "Say what your normal day looks like.",
    intro:
      "These lines move beyond single phrases into short connected sentences about daily life.",
    phrases: [
      {
        english: "I usually wake up early and drink coffee.",
        vietnamese: "Tôi thường dậy sớm và uống cà phê.",
        pronunciation: "toy thuong zay som va uong cafe",
        context: "Use when a friend asks about your morning routine.",
      },
      {
        english: "In the morning, I go to work by motorbike taxi.",
        vietnamese: "Buổi sáng tôi đi làm bằng xe ôm công nghệ.",
        pronunciation: "boo-ee sang toy dee lam bang seh om kong ngheh",
        context: "Use to explain how you usually commute.",
      },
      {
        english: "After work, I go home and cook a simple dinner.",
        vietnamese: "Sau giờ làm, tôi về nhà và nấu bữa tối đơn giản.",
        pronunciation: "sow zuh lam, toy veh nha va now bua toy don zan",
        context: "Use when describing your evening routine.",
      },
      {
        english: "In the evening, I exercise a little.",
        vietnamese: "Buổi tối tôi tập thể dục một chút.",
        pronunciation: "boo-ee toy toy tap teh zook moht chut",
        context: "Use for simple health or lifestyle small talk.",
      },
      {
        english: "On weekends, I usually meet friends or rest at home.",
        vietnamese: "Cuối tuần tôi thường gặp bạn bè hoặc nghỉ ở nhà.",
        pronunciation: "kwoi twan toy thuong gap ban beh hoak nghee uh nha",
        context: "Use when talking about weekend habits.",
      },
      {
        english: "Today my schedule is a little busy.",
        vietnamese: "Hôm nay lịch của tôi hơi bận.",
        pronunciation: "hom nay lik cua toy hoy bun",
        context: "Use when explaining why you have limited time.",
      },
    ],
    cultural_note:
      "Vietnamese daily-life talk often uses short time markers like buổi sáng, sau giờ làm, and cuối tuần.",
    tip:
      "Add one reason or time phrase to a basic sentence. That is enough to sound more real at A1+.",
  },
  {
    id: 60,
    level: "A1",
    title_en: "Talking About Likes And Dislikes",
    subtitle: "Give simple opinions with a reason.",
    intro:
      "Use these when talking about food, cafes, music, places, and everyday choices.",
    phrases: [
      {
        english: "I like Vietnamese coffee because it is very strong.",
        vietnamese: "Tôi thích cà phê Việt Nam vì rất đậm.",
        pronunciation: "toy thik cafe vyet nam vi zut dum",
        context: "Use when talking about coffee with staff or friends.",
      },
      {
        english: "I like this place because it is quite quiet.",
        vietnamese: "Tôi thích chỗ này vì khá yên tĩnh.",
        pronunciation: "toy thik cho nai vi kha yen ting",
        context: "Use when explaining why you chose a cafe or seat.",
      },
      {
        english: "I do not like food that is too spicy.",
        vietnamese: "Tôi không thích đồ ăn cay quá.",
        pronunciation: "toy khome thik do an kai gwa",
        context: "Use before ordering or choosing a dish.",
      },
      {
        english: "I prefer sitting outside if it is not raining.",
        vietnamese: "Tôi thích ngồi bên ngoài hơn nếu trời không mưa.",
        pronunciation: "toy thik ngoy ben ngowai hon new choy khome mua",
        context: "Use when choosing a table or meeting place.",
      },
      {
        english: "This song is nice, but a little loud.",
        vietnamese: "Bài nhạc này hay, nhưng hơi lớn.",
        pronunciation: "bai nyak nai hai, nyung hoy lon",
        context: "Use for a soft opinion in a cafe, bar, or taxi.",
      },
      {
        english: "I like walking around this neighborhood in the evening.",
        vietnamese: "Tôi thích đi bộ quanh khu này vào buổi tối.",
        pronunciation: "toy thik dee bo quanh khu nai vao boo-ee toy",
        context: "Use when chatting about where you live or stay.",
      },
    ],
    cultural_note:
      "A short reason with vì makes a beginner opinion sound warmer and more complete.",
    tip:
      "Use tôi thích, tôi không thích, and tôi thích hơn. Those three patterns cover many daily opinions.",
  },
  {
    id: 61,
    level: "A1",
    title_en: "Ordering With Modifications",
    subtitle: "Ask for small changes clearly.",
    intro:
      "These lines help you order naturally when you need less sugar, less chili, no ice, or takeout.",
    phrases: [
      {
        english: "Can I have less sugar?",
        vietnamese: "Cho tôi ít đường hơn được không?",
        pronunciation: "chaw toy it duong hon duoc khome",
        context: "Use when ordering coffee, tea, or juice.",
      },
      {
        english: "Please do not add ice.",
        vietnamese: "Đừng bỏ đá giúp tôi nhé.",
        pronunciation: "dung baw da zoop toy nyeh",
        context: "Use when ordering a cold drink without ice.",
      },
      {
        english: "Can you make it not too spicy?",
        vietnamese: "Làm không cay quá được không?",
        pronunciation: "lam khome kai gwa duoc khome",
        context: "Use at street food stalls or restaurants.",
      },
      {
        english: "Can I change rice to noodles?",
        vietnamese: "Tôi đổi cơm sang bún được không?",
        pronunciation: "toy doy kom sang boon duoc khome",
        context: "Use when asking for a simple food substitution.",
      },
      {
        english: "Please put the sauce on the side.",
        vietnamese: "Để nước sốt riêng giúp tôi nhé.",
        pronunciation: "deh nuok sot ryeng zoop toy nyeh",
        context: "Use if you want to control how much sauce you eat.",
      },
      {
        english: "I will eat here, but please pack one more portion to go.",
        vietnamese: "Tôi ăn ở đây, nhưng gói thêm một phần mang đi giúp tôi.",
        pronunciation: "toy an uh day, nyung goy them moht fun mang dee zoop toy",
        context: "Use when dining in and buying extra food for later.",
      },
    ],
    cultural_note:
      "Small food changes are common, but keep the request short and point at the item if needed.",
    tip:
      "Put the change first, then add giúp tôi nhé to keep the request polite.",
  },
  {
    id: 62,
    level: "A1",
    title_en: "Explaining Simple Problems",
    subtitle: "Say what is wrong without a long story.",
    intro:
      "Use these when something is not working, you made a mistake, or you need practical help.",
    phrases: [
      {
        english: "I cannot open this door.",
        vietnamese: "Tôi không mở được cửa này.",
        pronunciation: "toy khome muh duoc kua nai",
        context: "Use at an apartment, hotel, office, or shop entrance.",
      },
      {
        english: "My card is not working.",
        vietnamese: "Thẻ của tôi không dùng được.",
        pronunciation: "theh cua toy khome zoong duoc",
        context: "Use when a payment card fails.",
      },
      {
        english: "I think I ordered the wrong item.",
        vietnamese: "Tôi nghĩ tôi gọi nhầm món.",
        pronunciation: "toy nghee toy goy nyum mon",
        context: "Use when food or drink is not what you expected.",
      },
      {
        english: "I left my bag in the car.",
        vietnamese: "Tôi để quên túi trong xe.",
        pronunciation: "toy deh quen too-ee trong seh",
        context: "Use after leaving something in a taxi or Grab.",
      },
      {
        english: "The address in the app is wrong.",
        vietnamese: "Địa chỉ trong ứng dụng bị sai.",
        pronunciation: "dee-ah chee trong ung zoong bee sai",
        context: "Use when a driver, delivery person, or map has the wrong place.",
      },
      {
        english: "I need help because I do not understand this message.",
        vietnamese: "Tôi cần giúp vì tôi không hiểu tin nhắn này.",
        pronunciation: "toy kun zoop vi toy khome hyew tin nyan nai",
        context: "Use when showing a Vietnamese message on your phone.",
      },
    ],
    cultural_note:
      "For everyday problems, the clearest Vietnamese is often one sentence: problem first, reason second.",
    tip:
      "Use không... được for many simple problems: không mở được, không dùng được, không nghe được.",
  },
  {
    id: 63,
    level: "A1",
    title_en: "Asking Follow-Up Questions",
    subtitle: "Keep the conversation from stopping.",
    intro:
      "These questions help you continue when you need more detail, slower speech, or a clear next step.",
    phrases: [
      {
        english: "What does this word mean?",
        vietnamese: "Từ này nghĩa là gì?",
        pronunciation: "tu nai nghee-ah la zee",
        context: "Use when learning a new word from a menu, sign, or message.",
      },
      {
        english: "Can you say it again more slowly?",
        vietnamese: "Bạn nói lại chậm hơn được không?",
        pronunciation: "ban noy lai cham hon duoc khome",
        context: "Use when the other person speaks too fast.",
      },
      {
        english: "Is this today or tomorrow?",
        vietnamese: "Cái này là hôm nay hay ngày mai?",
        pronunciation: "kai nai la hom nay hai ngay mai",
        context: "Use when confirming a date or appointment.",
      },
      {
        english: "Where should I wait?",
        vietnamese: "Tôi nên chờ ở đâu?",
        pronunciation: "toy nen chuh uh dow",
        context: "Use at a pickup point, clinic, office, or station.",
      },
      {
        english: "Who should I call?",
        vietnamese: "Tôi nên gọi cho ai?",
        pronunciation: "toy nen goy chaw ai",
        context: "Use when you need the right contact person.",
      },
      {
        english: "Can you show me on the map?",
        vietnamese: "Bạn chỉ cho tôi trên bản đồ được không?",
        pronunciation: "ban chee chaw toy chen ban do duoc khome",
        context: "Use when directions are hard to understand by speech.",
      },
    ],
    cultural_note:
      "Follow-up questions are normal. They sound more confident than pretending to understand.",
    tip:
      "If you feel stuck, ask one small question: ở đâu, ai, hôm nay hay ngày mai.",
  },
  {
    id: 64,
    level: "A1",
    title_en: "Describing Places",
    subtitle: "Say what a place is like in simple connected sentences.",
    intro:
      "Use these when talking about cafes, hotels, apartments, streets, and neighborhoods.",
    phrases: [
      {
        english: "This cafe is small but comfortable.",
        vietnamese: "Quán cà phê này nhỏ nhưng thoải mái.",
        pronunciation: "kwan cafe nai nyaw nyung thoai mai",
        context: "Use when describing a cafe to a friend.",
      },
      {
        english: "My apartment is near the market.",
        vietnamese: "Căn hộ của tôi gần chợ.",
        pronunciation: "kan ho cua toy gun chuh",
        context: "Use when explaining where you live.",
      },
      {
        english: "This street is quite busy in the evening.",
        vietnamese: "Đường này buổi tối khá đông.",
        pronunciation: "duong nai boo-ee toy kha dong",
        context: "Use when describing traffic or a neighborhood.",
      },
      {
        english: "The room is clean and quiet.",
        vietnamese: "Phòng sạch và yên tĩnh.",
        pronunciation: "fong sak va yen ting",
        context: "Use when talking about a hotel room or apartment.",
      },
      {
        english: "The hotel is a little far from the center.",
        vietnamese: "Khách sạn hơi xa trung tâm.",
        pronunciation: "khak san hoy sa choong tam",
        context: "Use when explaining travel time or location.",
      },
      {
        english: "I like this neighborhood because there are many restaurants.",
        vietnamese: "Tôi thích khu này vì có nhiều quán ăn.",
        pronunciation: "toy thik khu nai vi kaw nyew kwan an",
        context: "Use when sharing why you like an area.",
      },
    ],
    cultural_note:
      "Place descriptions often combine one simple adjective with one reason: gần chợ, khá đông, nhiều quán ăn.",
    tip:
      "Start with the place, then add one quality. That keeps the sentence natural and beginner-friendly.",
  },
  {
    id: 65,
    level: "A1",
    title_en: "Simple Travel Conversations",
    subtitle: "Handle tickets, seats, bags, and arrival.",
    intro:
      "These lines help with buses, trains, domestic travel, hotels, and short trips in Vietnam.",
    phrases: [
      {
        english: "I want to buy a ticket to Da Nang.",
        vietnamese: "Tôi muốn mua vé đi Đà Nẵng.",
        pronunciation: "toy mwon mua veh dee da nang",
        context: "Use at a station, travel desk, or ticket counter.",
      },
      {
        english: "What time does the bus leave?",
        vietnamese: "Xe buýt đi lúc mấy giờ?",
        pronunciation: "seh bweet dee look may zuh",
        context: "Use when confirming a departure time.",
      },
      {
        english: "Is this seat empty?",
        vietnamese: "Ghế này còn trống không?",
        pronunciation: "geh nai kon chong khome",
        context: "Use on a bus, train, or waiting area.",
      },
      {
        english: "I have one suitcase and one backpack.",
        vietnamese: "Tôi có một vali và một ba lô.",
        pronunciation: "toy kaw moht va-lee va moht ba lo",
        context: "Use when checking luggage or explaining your bags.",
      },
      {
        english: "Please tell me when we arrive.",
        vietnamese: "Khi nào đến, báo tôi biết giúp nhé.",
        pronunciation: "khi nao den, bao toy byet zoop nyeh",
        context: "Use if you are worried about missing your stop.",
      },
      {
        english: "I am only staying here for two days.",
        vietnamese: "Tôi chỉ ở đây hai ngày.",
        pronunciation: "toy chee uh day hai ngay",
        context: "Use at a hotel, homestay, or casual travel conversation.",
      },
    ],
    cultural_note:
      "Travel Vietnamese is easier when you confirm time, place, and bags separately.",
    tip:
      "Keep the city name clear. If pronunciation is hard, show the destination on your phone.",
  },
  {
    id: 66,
    level: "A1",
    title_en: "Asking For Recommendations",
    subtitle: "Ask locals for useful, specific suggestions.",
    intro:
      "These lines help you ask for food, cafes, weekend ideas, and practical local choices.",
    phrases: [
      {
        english: "Do you know a good pho place nearby?",
        vietnamese: "Bạn biết quán phở nào ngon gần đây không?",
        pronunciation: "ban byet kwan fuh nao ngon gun day khome",
        context: "Use when asking a local for food nearby.",
      },
      {
        english: "Which dish is easy for foreigners to eat?",
        vietnamese: "Món nào dễ ăn cho người nước ngoài?",
        pronunciation: "mon nao ze an chaw nguo-ee nuok ngowai",
        context: "Use when you want a beginner-friendly dish.",
      },
      {
        english: "Where should I go this weekend?",
        vietnamese: "Cuối tuần này tôi nên đi đâu?",
        pronunciation: "kwoi twan nai toy nen dee dow",
        context: "Use when asking for local travel or activity ideas.",
      },
      {
        english: "Can you recommend a quiet cafe for working?",
        vietnamese: "Bạn gợi ý quán cà phê yên tĩnh để làm việc được không?",
        pronunciation: "ban goy ee kwan cafe yen ting deh lam vyek duoc khome",
        context: "Use when looking for a work-friendly cafe.",
      },
      {
        english: "Is this place good for families?",
        vietnamese: "Chỗ này phù hợp cho gia đình không?",
        pronunciation: "cho nai foo hop chaw za ding khome",
        context: "Use before choosing a restaurant, hotel, or activity.",
      },
      {
        english: "If it were you, what would you choose?",
        vietnamese: "Nếu là bạn thì bạn chọn gì?",
        pronunciation: "new la ban thi ban chon zee",
        context: "Use when you want the other person's honest recommendation.",
      },
    ],
    cultural_note:
      "Specific recommendation questions get better answers than broad questions like what is good here.",
    tip:
      "Add gần đây, yên tĩnh, cho gia đình, or cuối tuần này to make your question practical.",
  },
  {
    id: 67,
    level: "A1",
    title_en: "Simple Social Conversations",
    subtitle: "Sound friendly without needing long Vietnamese.",
    intro:
      "Use these with neighbors, classmates, coworkers, new friends, and people you meet often.",
    phrases: [
      {
        english: "Have you lived here for a long time?",
        vietnamese: "Bạn sống ở đây lâu chưa?",
        pronunciation: "ban song uh day lau chua",
        context: "Use as friendly small talk with someone local.",
      },
      {
        english: "I just moved here, so I am still learning.",
        vietnamese: "Tôi mới chuyển đến đây nên vẫn đang học.",
        pronunciation: "toy moy chuyen den day nen van dang hok",
        context: "Use when explaining why your Vietnamese is still limited.",
      },
      {
        english: "You speak Vietnamese very fast, but I want to try.",
        vietnamese: "Bạn nói tiếng Việt nhanh quá, nhưng tôi muốn thử.",
        pronunciation: "ban noy tee-eng vyet nyanh gwa, nyung toy mwon thu",
        context: "Use warmly when someone speaks faster than you can follow.",
      },
      {
        english: "I like talking with you because you speak clearly.",
        vietnamese: "Tôi thích nói chuyện với bạn vì bạn nói rõ.",
        pronunciation: "toy thik noy chuyen voy ban vi ban noy raw",
        context: "Use as a friendly compliment during language practice.",
      },
      {
        english: "When you are free, do you want to get coffee?",
        vietnamese: "Lúc nào rảnh, bạn muốn đi uống cà phê không?",
        pronunciation: "look nao ranh, ban mwon dee uong cafe khome",
        context: "Use for a low-pressure social invitation.",
      },
      {
        english: "Let's keep in touch.",
        vietnamese: "Mình giữ liên lạc nhé.",
        pronunciation: "ming zu lee-en lak nyeh",
        context: "Use at the end of a friendly conversation.",
      },
    ],
    cultural_note:
      "Simple social Vietnamese often sounds better with gentle words like nhé, hơi, and muốn thử.",
    tip:
      "You can be honest about learning. Tôi vẫn đang học is useful and human.",
  },
  {
    id: 68,
    level: "A1",
    title_en: "Everyday Polite Conversation Flow",
    subtitle: "Open, respond, repair, and close politely.",
    intro:
      "These lines help a short conversation feel complete instead of stopping after one phrase.",
    phrases: [
      {
        english: "Excuse me, can I ask something?",
        vietnamese: "Xin lỗi, tôi hỏi một chút được không?",
        pronunciation: "seen loy, toy hoy moht chut duoc khome",
        context: "Use before asking staff, neighbors, or strangers a question.",
      },
      {
        english: "Yes, please go ahead.",
        vietnamese: "Dạ được, bạn hỏi đi.",
        pronunciation: "yah duoc, ban hoy dee",
        context: "Use when inviting someone to ask or continue.",
      },
      {
        english: "Thank you, I understand now.",
        vietnamese: "Cảm ơn, bây giờ tôi hiểu rồi.",
        pronunciation: "gahm uhn, bay zuh toy hyew roy",
        context: "Use after someone explains something clearly.",
      },
      {
        english: "Sorry, I need to leave first.",
        vietnamese: "Xin lỗi, tôi phải đi trước.",
        pronunciation: "seen loy, toy fai dee truok",
        context: "Use when leaving a conversation or gathering early.",
      },
      {
        english: "No problem, see you next time.",
        vietnamese: "Không sao, hẹn gặp lần sau nhé.",
        pronunciation: "khome sao, hen gap lun sow nyeh",
        context: "Use to close a friendly interaction.",
      },
      {
        english: "Thank you for talking with me.",
        vietnamese: "Cảm ơn bạn đã nói chuyện với tôi.",
        pronunciation: "gahm uhn ban da noy chuyen voy toy",
        context: "Use after practice, help, or a warm casual conversation.",
      },
    ],
    cultural_note:
      "A complete polite flow can be very short: ask, listen, thank, and close gently.",
    tip:
      "Use nhé at the end of friendly closing lines. It softens the sentence without making it complicated.",
  },
  {
    id: 69,
    level: "A1",
    title_en: "Visa And Immigration Office Basics",
    subtitle: "Handle simple office questions with calm, clear Vietnamese.",
    intro:
      "These lines help when you need to talk about visas, paperwork, and appointment questions in a government office.",
    phrases: [
      {
        english: "I need to extend my visa.",
        vietnamese: "Tôi cần gia hạn visa.",
        pronunciation: "toy kun za-han vee-za",
        context: "Use when asking about a visa extension.",
      },
      {
        english: "I do not have all the documents yet.",
        vietnamese: "Tôi chưa có đủ giấy tờ.",
        pronunciation: "toy chua kaw doo zay toh",
        context: "Use when you are missing some paperwork.",
      },
      {
        english: "When is my appointment?",
        vietnamese: "Lịch hẹn của tôi là khi nào?",
        pronunciation: "lik hen cua toy la khi nao",
        context: "Use to confirm your appointment time.",
      },
      {
        english: "I came to ask about the procedure.",
        vietnamese: "Tôi đến để hỏi về thủ tục.",
        pronunciation: "toy den de hoy ve thoo took",
        context: "Use when you want the office to explain the process.",
      },
      {
        english: "Do I need to come back tomorrow?",
        vietnamese: "Tôi có cần quay lại ngày mai không?",
        pronunciation: "toy kaw kun kwai lai ngay mai khome",
        context: "Use when you want to know if you must return later.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào anh, tôi muốn hỏi về việc gia hạn visa.",
        english: "Hello, I want to ask about extending my visa.",
        pronunciation: "chaw anh, toy mwon hoy ve vyek za-han vee-za",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, anh đã có giấy tờ đầy đủ chưa?",
        english: "Do you have all the documents already?",
        pronunciation: "yah, anh da kaw zay toh day doo chua",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chưa có đủ, nhưng tôi có hộ chiếu và ảnh.",
        english: "Not all of them yet, but I have my passport and photos.",
        pronunciation: "toy chua kaw doo, nyung toy kaw ho chyeu va anh",
      },
      {
        speaker: "B",
        vietnamese: "Vậy anh cần quay lại vào thứ Năm.",
        english: "Then you need to come back on Thursday.",
        pronunciation: "vay anh kun kwai lai vao thoo nam",
      },
      {
        speaker: "A",
        vietnamese: "Dạ, tôi hiểu rồi. Cảm ơn anh.",
        english: "Okay, I understand. Thank you.",
        pronunciation: "yah, toy hyew roy. kahm uhn anh",
      },
      {
        speaker: "B",
        vietnamese: "Không có gì, anh cứ đến đúng giờ nhé.",
        english: "No problem, just come on time.",
        pronunciation: "khome kaw zee, anh koo den doong zuh nyeh",
      },
    ],
    cultural_note:
      "At office counters, short polite sentences work better than long explanations.",
    tip:
      "Bring your passport, copies, and a pen. Small preparation makes Vietnamese office conversations much easier.",
  },
  {
    id: 70,
    level: "A1",
    title_en: "Bank Account And ATM Problems",
    subtitle: "Talk about payments, cards, transfers, and banking trouble.",
    intro:
      "Use these lines when a card fails, a transfer is slow, or you need help opening an account.",
    phrases: [
      {
        english: "I want to open a bank account.",
        vietnamese: "Tôi muốn mở tài khoản ngân hàng.",
        pronunciation: "toy mwon muh tai-khoan ngan hang",
        context: "Use when talking to a bank clerk.",
      },
      {
        english: "I do not have a temporary residence card yet.",
        vietnamese: "Tôi chưa có thẻ tạm trú.",
        pronunciation: "toy chua kaw the tam choo",
        context: "Use if the bank asks for local residency documents.",
      },
      {
        english: "The ATM took my card.",
        vietnamese: "Máy ATM nuốt thẻ của tôi rồi.",
        pronunciation: "mai ay tee-em nuot the cua toy roy",
        context: "Use when the machine keeps your card.",
      },
      {
        english: "My transfer is not working.",
        vietnamese: "Chuyển khoản của tôi không được.",
        pronunciation: "chwen kwan cua toy khome duoc",
        context: "Use when an online or app transfer fails.",
      },
      {
        english: "Can you check my account, please?",
        vietnamese: "Bạn kiểm tra tài khoản giúp tôi được không?",
        pronunciation: "ban kiem tra tai-khoan zoop toy duoc khome",
        context: "Use when you need a staff member to look at your account.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin chào, tôi muốn mở tài khoản ngân hàng.",
        english: "Hello, I want to open a bank account.",
        pronunciation: "seen chaw, toy mwon muh tai-khoan ngan hang",
      },
      {
        speaker: "B",
        vietnamese: "Anh đã có thẻ tạm trú chưa?",
        english: "Do you already have a temporary residence card?",
        pronunciation: "anh da kaw the tam choo chua",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chưa có, nhưng tôi có hộ chiếu.",
        english: "Not yet, but I have my passport.",
        pronunciation: "toy chua kaw, nyung toy kaw ho chyeu",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, vậy anh cần thêm giấy xác nhận địa chỉ.",
        english: "Okay, then you also need an address confirmation.",
        pronunciation: "yah, vay anh kun them zay sak nyan dee-ah chee",
      },
      {
        speaker: "A",
        vietnamese: "Máy ATM hôm qua nuốt thẻ của tôi.",
        english: "Yesterday the ATM took my card.",
        pronunciation: "mai ay tee-em hom kwa nuot the cua toy",
      },
      {
        speaker: "B",
        vietnamese: "Tôi sẽ kiểm tra giúp anh ngay bây giờ.",
        english: "I will check it for you now.",
        pronunciation: "toy seh kiem tra zoop anh ngay bay zuh",
      },
    ],
    cultural_note:
      "Bank and ATM problems are best handled with short, concrete nouns: card, account, transfer, passport.",
    tip:
      "If the first staff member cannot help, ask who should continue the process instead of repeating the whole story.",
  },
  {
    id: 71,
    level: "A1",
    title_en: "Phone SIM And Internet Setup",
    subtitle: "Handle SIM cards, data, Wi-Fi, and mobile setup.",
    intro:
      "These lines help when you need a new SIM, a better data plan, or help with internet installation.",
    phrases: [
      {
        english: "I need a SIM card with data.",
        vietnamese: "Tôi cần một SIM có data.",
        pronunciation: "toy kun moht seem kaw day-ta",
        context: "Use in a phone shop or convenience store.",
      },
      {
        english: "My home Wi-Fi has been slow since yesterday.",
        vietnamese: "Mạng Wi-Fi nhà tôi bị chậm từ hôm qua.",
        pronunciation: "mang why-fye nha toy bee cham tu hom kwa",
        context: "Use when reporting an internet problem.",
      },
      {
        english: "Can you help me install the internet?",
        vietnamese: "Bạn có thể giúp tôi lắp mạng không?",
        pronunciation: "ban kaw the zoop toy lap mang khome",
        context: "Use with a technician or service provider.",
      },
      {
        english: "My phone is not receiving the OTP message.",
        vietnamese: "Điện thoại tôi không nhận được mã OTP.",
        pronunciation: "dee-en thoai toy khome nyan duoc ma oh-tee-pee",
        context: "Use when bank or app codes do not arrive.",
      },
      {
        english: "Please help me top up the data.",
        vietnamese: "Làm ơn nạp thêm data giúp tôi.",
        pronunciation: "lam uhn nap them day-ta zoop toy",
        context: "Use when your mobile data is running low.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào bạn, tôi muốn mua SIM có data.",
        english: "Hi, I want to buy a SIM with data.",
        pronunciation: "chaw ban, toy mwon mua seem kaw day-ta",
      },
      {
        speaker: "B",
        vietnamese: "Bạn dùng mạng nào cũng được hay muốn mạng mạnh hơn?",
        english: "Any network is fine, or do you want a stronger one?",
        pronunciation: "ban zoom mang nao koom duoc hai mwon mang manh hon",
      },
      {
        speaker: "A",
        vietnamese: "Tôi muốn mạng ổn để làm việc.",
        english: "I want stable internet for work.",
        pronunciation: "toy mwon mang on deh lam vyek",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, tôi có gói 30 ngày, có data nhiều hơn.",
        english: "Okay, I have a 30-day plan with more data.",
        pronunciation: "yah, toy kaw goi ba muoi ngay, kaw day-ta nyew hon",
      },
      {
        speaker: "A",
        vietnamese: "Nhà tôi cũng cần lắp Wi-Fi. Có thể giúp được không?",
        english: "I also need Wi-Fi installed at home. Can you help?",
        pronunciation: "nha toy koom kun lap why-fye. kaw the zoop duoc khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, để tôi ghi địa chỉ của bạn.",
        english: "Sure, let me write down your address.",
        pronunciation: "yah, deh toy zee dee-ah chee cua ban",
      },
    ],
    cultural_note:
      "For SIM and internet, the most useful words are data, gói, mạng, and lắp.",
    tip:
      "If you do not know the exact plan, ask for the strongest or most stable option instead of trying to describe everything.",
  },
  {
    id: 72,
    level: "A1",
    title_en: "Workplace Problems And Requests",
    subtitle: "Ask for help, time, or clarification at work.",
    intro:
      "These lines are useful in offices, stores, and freelance situations where you need a clear, polite request.",
    phrases: [
      {
        english: "I need to finish this today.",
        vietnamese: "Tôi cần hoàn thành việc này hôm nay.",
        pronunciation: "toy kun hoan than vyek nai hom nay",
        context: "Use when a deadline matters.",
      },
      {
        english: "I do not understand this task.",
        vietnamese: "Tôi không hiểu việc này.",
        pronunciation: "toy khome hyew vyek nai",
        context: "Use when instructions are unclear.",
      },
      {
        english: "Can you send it by email?",
        vietnamese: "Bạn gửi qua email giúp tôi được không?",
        pronunciation: "ban gooey kwa ee-mail zoop toy duoc khome",
        context: "Use when you need a written version.",
      },
      {
        english: "I need to leave early today.",
        vietnamese: "Hôm nay tôi cần về sớm.",
        pronunciation: "hom nay toy kun veh som",
        context: "Use when you must leave before the normal time.",
      },
      {
        english: "Can we discuss it tomorrow?",
        vietnamese: "Mai mình bàn lại được không?",
        pronunciation: "mai ming ban lai duoc khome",
        context: "Use when you need more time to think or prepare.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh ơi, em chưa hiểu việc này lắm.",
        english: "Excuse me, I do not understand this task very well.",
        pronunciation: "anh oi, em chua hyew vyek nai lam",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, tôi giải thích lại nhé.",
        english: "No problem, I will explain again.",
        pronunciation: "khome sao, toy zai thik lai nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Nếu được, anh gửi qua email giúp em.",
        english: "If possible, please send it by email.",
        pronunciation: "new duoc, anh gooey kwa ee-mail zoop em",
      },
      {
        speaker: "B",
        vietnamese: "Được, nhưng hôm nay phải xong trước 5 giờ.",
        english: "Okay, but it needs to be done before 5 o'clock today.",
        pronunciation: "duoc, nyung hom nay fai song truok nam zuh",
      },
      {
        speaker: "A",
        vietnamese: "Vâng, em sẽ cố gắng hoàn thành.",
        english: "Yes, I will do my best to finish it.",
        pronunciation: "vang, em seh koh gung hoan than",
      },
      {
        speaker: "B",
        vietnamese: "Nếu cần gì thêm thì báo tôi nhé.",
        english: "If you need anything else, tell me.",
        pronunciation: "new kun zee them thi bao toy nyeh",
      },
    ],
    cultural_note:
      "Workplace Vietnamese often sounds best when you keep the request short and mention the deadline clearly.",
    tip:
      "Use mai mình bàn lại or để em kiểm tra when you need breathing room without sounding difficult.",
  },
  {
    id: 73,
    level: "A1",
    title_en: "School Childcare And Family Schedules",
    subtitle: "Talk about children, pickup times, and school messages.",
    intro:
      "These lines help with teachers, childcare staff, and family scheduling in daily life.",
    phrases: [
      {
        english: "My child starts school next week.",
        vietnamese: "Con tôi bắt đầu đi học tuần sau.",
        pronunciation: "kon toy bat dau dee hok twan sao",
        context: "Use when talking about school timing.",
      },
      {
        english: "I need to pick up my child at five.",
        vietnamese: "Tôi cần đón con lúc năm giờ.",
        pronunciation: "toy kun don kon look nam zuh",
        context: "Use when arranging pickup time.",
      },
      {
        english: "The teacher said there is a meeting.",
        vietnamese: "Cô giáo nói có một buổi họp.",
        pronunciation: "koh ziao noy kaw moht boo-ee hop",
        context: "Use when sharing a school notice.",
      },
      {
        english: "My child is a little shy.",
        vietnamese: "Con tôi hơi nhút nhát một chút.",
        pronunciation: "kon toy hoy nyoot nyat moht chut",
        context: "Use when explaining a child's personality.",
      },
      {
        english: "Can you help explain the school message?",
        vietnamese: "Bạn có thể giúp tôi hiểu tin nhắn của trường không?",
        pronunciation: "ban kaw the zoop toy hyew tin nyan cua choong khome",
        context: "Use when a school message is hard to understand.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin chào cô, con tôi mới bắt đầu đi học tuần sau.",
        english: "Hello teacher, my child starts school next week.",
        pronunciation: "seen chaw koh, kon toy moy bat dau dee hok twan sao",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, vậy anh/chị cần đến sớm một chút.",
        english: "Okay, then you need to come a little early.",
        pronunciation: "yah, vay anh chi kun den som moht chut",
      },
      {
        speaker: "A",
        vietnamese: "Tôi cần đón con lúc năm giờ chiều.",
        english: "I need to pick up my child at five p.m.",
        pronunciation: "toy kun don kon look nam zuh chiew",
      },
      {
        speaker: "B",
        vietnamese: "Được ạ, tôi sẽ ghi chú lại.",
        english: "Sure, I will note that down.",
        pronunciation: "duoc ah, toy seh zee choo lai",
      },
      {
        speaker: "A",
        vietnamese: "Con tôi hơi nhút nhát, nên chắc cần thời gian.",
        english: "My child is a little shy, so it may take time.",
        pronunciation: "kon toy hoy nyoot nyat, nen chak kun tho-ee zian",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, trẻ mới thường như vậy.",
        english: "No problem, new children are often like that.",
        pronunciation: "khome sao, chay moy thuong nyu vay",
      },
    ],
    cultural_note:
      "School conversations often sound softer when you mention time, routine, and the child's mood.",
    tip:
      "If a message is unclear, ask for one key detail first: time, place, or what to bring.",
  },
  {
    id: 74,
    level: "A1",
    title_en: "Dating Social Nuance And Boundaries",
    subtitle: "Keep social conversations warm, clear, and respectful.",
    intro:
      "Use these lines when you are getting to know someone and want to sound friendly without moving too fast.",
    phrases: [
      {
        english: "I want to get to know you better.",
        vietnamese: "Tôi muốn tìm hiểu bạn thêm.",
        pronunciation: "toy mwon tim hyew ban them",
        context: "Use when showing friendly interest.",
      },
      {
        english: "I am not ready for that yet.",
        vietnamese: "Tôi chưa sẵn sàng cho việc đó.",
        pronunciation: "toy chua san zang chaw vyek do",
        context: "Use when you want to slow things down.",
      },
      {
        english: "Let's take it slowly.",
        vietnamese: "Mình cứ từ từ nhé.",
        pronunciation: "ming koo tu tu nyeh",
        context: "Use to keep the pace gentle.",
      },
      {
        english: "I prefer meeting in a public place.",
        vietnamese: "Tôi thích gặp ở chỗ công cộng.",
        pronunciation: "toy thik gap uh cho kong kong",
        context: "Use when you want a safe, casual first meeting.",
      },
      {
        english: "I feel comfortable talking with you.",
        vietnamese: "Tôi thấy nói chuyện với bạn rất thoải mái.",
        pronunciation: "toy thay noy chuyen voy ban zat thoai mai",
        context: "Use when the conversation feels natural and easy.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi muốn tìm hiểu bạn thêm, nếu bạn thấy thoải mái.",
        english: "I want to get to know you better, if you feel comfortable.",
        pronunciation: "toy mwon tim hyew ban them, new ban thay thoai mai",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, mình cứ từ từ nhé.",
        english: "Sure, let's take it slowly.",
        pronunciation: "yah, ming koo tu tu nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Tôi thích gặp ở chỗ công cộng cho thoải mái hơn.",
        english: "I prefer meeting in a public place so it feels more comfortable.",
        pronunciation: "toy thik gap uh cho kong kong chaw thoai mai hon",
      },
      {
        speaker: "B",
        vietnamese: "Được, quán cà phê là ổn.",
        english: "Okay, a cafe is fine.",
        pronunciation: "duoc, kwan cafe la on",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chưa sẵn sàng cho việc đó, mong bạn hiểu.",
        english: "I am not ready for that yet, I hope you understand.",
        pronunciation: "toy chua san zang chaw vyek do, mong ban hyew",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, mình tôn trọng nhau là được.",
        english: "No problem, respecting each other is enough.",
        pronunciation: "khome sao, ming ton trong nhau la duoc",
      },
    ],
    cultural_note:
      "In Vietnamese social conversation, soft boundaries sound better than direct rejection.",
    tip:
      "Use if you want a slower pace: mình cứ từ từ nhé, hoặc tôi chưa sẵn sàng.",
  },
  {
    id: 75,
    level: "A1",
    title_en: "Landlord Repairs And Complaints",
    subtitle: "Explain problems clearly and ask for repair without sounding harsh.",
    intro:
      "Use these lines when something in your apartment needs fixing and you need a practical response.",
    phrases: [
      {
        english: "The faucet is leaking.",
        vietnamese: "Vòi nước bị rò rỉ.",
        pronunciation: "voi nuok bee ro ree",
        context: "Use when water is leaking from the tap.",
      },
      {
        english: "The Wi-Fi has been slow since yesterday.",
        vietnamese: "Mạng Wi-Fi bị chậm từ hôm qua.",
        pronunciation: "mang why-fye bee cham tu hom kwa",
        context: "Use when the internet has been bad for a while.",
      },
      {
        english: "Could you fix it before the weekend?",
        vietnamese: "Nếu được, bạn có thể sửa giúp tôi trước cuối tuần không?",
        pronunciation: "new duoc, ban kaw the sua zoop toy truok kwoi twan khome",
        context: "Use when you want a repair done by a certain time.",
      },
      {
        english: "The air conditioner is making a strange noise.",
        vietnamese: "Máy lạnh kêu lạ.",
        pronunciation: "mai lanh kew la",
        context: "Use when the AC sounds wrong.",
      },
      {
        english: "I already told you about this last week.",
        vietnamese: "Tôi đã nói với bạn việc này tuần trước rồi.",
        pronunciation: "toy da noy voy ban vyek nai twan truok roy",
        context: "Use when you need to remind someone politely.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào anh, vòi nước trong bếp đang bị rò rỉ.",
        english: "Hello, the kitchen faucet is leaking.",
        pronunciation: "chaw anh, voi nuok trong bep dang bee ro ree",
      },
      {
        speaker: "B",
        vietnamese: "Tôi biết rồi. Tôi sẽ gọi thợ.",
        english: "I know. I will call a repair person.",
        pronunciation: "toy byet roy. toy seh goy tho",
      },
      {
        speaker: "A",
        vietnamese: "Nếu được, bạn có thể sửa giúp tôi trước cuối tuần không?",
        english: "If possible, can you fix it before the weekend?",
        pronunciation: "new duoc, ban kaw the sua zoop toy truok kwoi twan khome",
      },
      {
        speaker: "B",
        vietnamese: "Được, tôi sẽ sắp xếp hôm nay.",
        english: "Okay, I will arrange it today.",
        pronunciation: "duoc, toy seh sap sep hom nay",
      },
      {
        speaker: "A",
        vietnamese: "Mạng Wi-Fi cũng chậm từ hôm qua nữa.",
        english: "The Wi-Fi has also been slow since yesterday.",
        pronunciation: "mang why-fye koom cham tu hom kwa nua",
      },
      {
        speaker: "B",
        vietnamese: "Vậy tôi kiểm tra luôn cho bạn.",
        english: "Then I will check it for you right away.",
        pronunciation: "vay toy kiem tra lun chaw ban",
      },
    ],
    cultural_note:
      "For repair problems, one clear complaint plus one time marker is usually enough.",
    tip:
      "Say từ hôm qua, tuần trước, or mấy ngày rồi to make the timing easier to understand.",
  },
  {
    id: 76,
    level: "A1",
    title_en: "Doctor Visit Symptoms And Pharmacy Details",
    subtitle: "Describe how you feel and ask about medicine clearly.",
    intro:
      "These lines help when you need to explain symptoms, ask about dosage, and understand basic pharmacy instructions.",
    phrases: [
      {
        english: "I have had a sore throat and cough for three days.",
        vietnamese: "Tôi bị đau họng và ho khoảng ba ngày rồi.",
        pronunciation: "toy bee dow hong va ho khwang ba ngay roy",
        context: "Use when explaining how long you have felt sick.",
      },
      {
        english: "I feel dizzy and a little weak.",
        vietnamese: "Tôi bị chóng mặt và hơi mệt.",
        pronunciation: "toy bee chong mat va hoy met",
        context: "Use when describing general symptoms.",
      },
      {
        english: "Do I need to take this medicine after eating?",
        vietnamese: "Thuốc này uống sau khi ăn phải không?",
        pronunciation: "thuok nai uong sau khi an fai khome",
        context: "Use to confirm medicine instructions.",
      },
      {
        english: "Is there something that does not make me sleepy?",
        vietnamese: "Có thuốc nào không làm tôi buồn ngủ không?",
        pronunciation: "kaw thuok nao khome lam toy bwan ngu khome",
        context: "Use when you need a non-drowsy option.",
      },
      {
        english: "I am allergic to penicillin.",
        vietnamese: "Tôi bị dị ứng với penicillin.",
        pronunciation: "toy bee zee oong voy pen-i-sil-in",
        context: "Use for an important medical warning.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bác sĩ ơi, tôi bị đau họng và ho khoảng ba ngày rồi.",
        english: "Doctor, I have had a sore throat and cough for about three days.",
        pronunciation: "bak see oi, toy bee dow hong va ho khwang ba ngay roy",
      },
      {
        speaker: "B",
        vietnamese: "Bạn có bị sốt không?",
        english: "Do you have a fever?",
        pronunciation: "ban kaw bee sot khome",
      },
      {
        speaker: "A",
        vietnamese: "Tôi không sốt, nhưng hơi mệt và chóng mặt.",
        english: "I do not have a fever, but I feel weak and dizzy.",
        pronunciation: "toy khome sot, nyung hoy met va chong mat",
      },
      {
        speaker: "B",
        vietnamese: "Được, tôi kê thuốc cho bạn nhé.",
        english: "Okay, I will prescribe medicine for you.",
        pronunciation: "duoc, toy ke thuok chaw ban nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Thuốc này uống sau khi ăn phải không?",
        english: "Do I take this medicine after eating?",
        pronunciation: "thuok nai uong sau khi an fai khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ đúng, và uống nhiều nước nhé.",
        english: "Yes, that's right, and drink plenty of water.",
        pronunciation: "yah doong, va uong nyew nuok nyeh",
      },
    ],
    cultural_note:
      "Medical Vietnamese works best when you give time, symptom, and any allergy clearly.",
    tip:
      "If you know the body part, say it first: họng, đầu, bụng, ngực, or lưng.",
  },
  {
    id: 77,
    level: "A1",
    title_en: "Negotiating Politely And Making Complaints",
    subtitle: "Ask for a better price or a better solution without sounding rude.",
    intro:
      "These lines help when you need to negotiate, complain, or ask for another option in a calm way.",
    phrases: [
      {
        english: "Could you lower the price a little?",
        vietnamese: "Bạn có thể giảm giá một chút không?",
        pronunciation: "ban kaw the ziam zia moht chut khome",
        context: "Use in markets or with small services.",
      },
      {
        english: "I can pay now if the price is reasonable.",
        vietnamese: "Nếu giá hợp lý, tôi có thể trả ngay.",
        pronunciation: "new zia hop lee, toy kaw the cha ngay",
        context: "Use when you want to close a deal politely.",
      },
      {
        english: "This is not what I expected.",
        vietnamese: "Cái này không giống tôi mong đợi.",
        pronunciation: "kai nai khome zong toy mong doi",
        context: "Use when a product or service is disappointing.",
      },
      {
        english: "I still need a better solution.",
        vietnamese: "Tôi vẫn cần một giải pháp tốt hơn.",
        pronunciation: "toy van kun moht zai fap tot hon",
        context: "Use when the first answer is not enough.",
      },
      {
        english: "Could you explain it one more time?",
        vietnamese: "Bạn có thể giải thích lại một lần nữa không?",
        pronunciation: "ban kaw the zai thik lai moht lan nua khome",
        context: "Use when you want a clearer explanation.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh có thể giảm giá một chút không?",
        english: "Can you lower the price a little?",
        pronunciation: "anh kaw the ziam zia moht chut khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, tôi có thể bớt cho anh một ít.",
        english: "Yes, I can reduce it a little for you.",
        pronunciation: "yah, toy kaw the but chaw anh moht eet",
      },
      {
        speaker: "A",
        vietnamese: "Nếu giá hợp lý, tôi có thể trả ngay.",
        english: "If the price is reasonable, I can pay now.",
        pronunciation: "new zia hop lee, toy kaw the cha ngay",
      },
      {
        speaker: "B",
        vietnamese: "Được, vậy tôi tính cho anh giá tốt hơn.",
        english: "Okay, then I will give you a better price.",
        pronunciation: "duoc, vay toy ting chaw anh zia tot hon",
      },
      {
        speaker: "A",
        vietnamese: "Cái này không giống tôi mong đợi lắm.",
        english: "This is not quite what I expected.",
        pronunciation: "kai nai khome zong toy mong doi lam",
      },
      {
        speaker: "B",
        vietnamese: "Tôi hiểu, để tôi xem còn cách nào khác.",
        english: "I understand, let me see if there is another option.",
        pronunciation: "toy hyew, deh toy xem kon kach nao khak",
      },
    ],
    cultural_note:
      "Polite negotiation often sounds better when you say nếu giá hợp lý or có thể bớt một chút không.",
    tip:
      "Avoid sounding absolute. A little, one more time, or another option keeps the tone softer.",
  },
  {
    id: 78,
    level: "A1",
    title_en: "Telling Longer Stories And Reasons",
    subtitle: "Link ideas naturally when you explain what happened.",
    intro:
      "These lines help you tell a fuller story with because, so, if, and when.",
    phrases: [
      {
        english: "I went to the clinic yesterday because I felt unwell.",
        vietnamese: "Hôm qua tôi đi khám vì thấy không khỏe.",
        pronunciation: "hom kwa toy dee kham vi thay khome khoe",
        context: "Use when starting a simple story about your day.",
      },
      {
        english: "After that, I worked from home and rested.",
        vietnamese: "Sau đó tôi làm việc ở nhà và nghỉ ngơi.",
        pronunciation: "sau do toy lam vyek uh nha va nghi ngoy",
        context: "Use to continue the story in time order.",
      },
      {
        english: "I like this area because it is quiet and convenient.",
        vietnamese: "Tôi thích khu này vì yên tĩnh và tiện.",
        pronunciation: "toy thik khu nai vi yen ting va tien",
        context: "Use when explaining a preference.",
      },
      {
        english: "I was late because the bus was delayed.",
        vietnamese: "Tôi đến muộn vì xe buýt bị trễ.",
        pronunciation: "toy den muon vi seh bweet bee chay",
        context: "Use when explaining a problem with timing.",
      },
      {
        english: "If I have time, I usually go for coffee with friends.",
        vietnamese: "Nếu có thời gian, tôi thường đi uống cà phê với bạn.",
        pronunciation: "new kaw tho-ee zian, toy thuong dee uong cafe voy ban",
        context: "Use when describing a habit or routine.",
      },
    ],
    cultural_note:
      "Longer Vietnamese stories still work best when the order is simple: before, after, because, so.",
    tip:
      "Use vì, nên, sau đó, and nếu to make your sentence longer without making it complicated.",
  },
  {
    id: 79,
    level: "A1",
    title_en: "Apologizing And Fixing Mistakes",
    subtitle: "Recover smoothly when you get something wrong.",
    intro:
      "These lines help when you mishear, send the wrong thing, or need to correct yourself politely.",
    phrases: [
      {
        english: "Sorry, I misunderstood.",
        vietnamese: "Xin lỗi, chắc tôi hiểu nhầm.",
        pronunciation: "seen loy, chak toy hyew nyum",
        context: "Use when you realized the meaning was wrong.",
      },
      {
        english: "I will fix it now.",
        vietnamese: "Tôi sẽ sửa ngay bây giờ.",
        pronunciation: "toy seh sua ngay bay zuh",
        context: "Use when you want to correct a mistake immediately.",
      },
      {
        english: "Thank you for your patience.",
        vietnamese: "Cảm ơn bạn đã kiên nhẫn.",
        pronunciation: "gahm uhn ban da kyen nyan",
        context: "Use after someone waits for you or repeats something.",
      },
      {
        english: "I wrote the wrong address.",
        vietnamese: "Tôi ghi sai địa chỉ.",
        pronunciation: "toy zee sai dee-ah chee",
        context: "Use when correcting an address or contact detail.",
      },
      {
        english: "Could you send it again, please?",
        vietnamese: "Bạn gửi lại giúp tôi được không?",
        pronunciation: "ban gooey lai zoop toy duoc khome",
        context: "Use when a message, file, or photo needs to be resent.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin lỗi, chắc tôi hiểu nhầm ý của bạn.",
        english: "Sorry, I think I misunderstood your meaning.",
        pronunciation: "seen loy, chak toy hyew nyum ee cua ban",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, tôi nói lại nhé.",
        english: "No problem, I will say it again.",
        pronunciation: "khome sao, toy noy lai nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Tôi sẽ sửa ngay bây giờ.",
        english: "I will fix it right now.",
        pronunciation: "toy seh sua ngay bay zuh",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn, vậy là ổn rồi.",
        english: "Thank you, then it is fine.",
        pronunciation: "gahm uhn, vay la on roy",
      },
      {
        speaker: "A",
        vietnamese: "Tôi ghi sai địa chỉ, tôi sẽ gửi lại.",
        english: "I wrote the wrong address, I will send it again.",
        pronunciation: "toy zee sai dee-ah chee, toy seh gooey lai",
      },
      {
        speaker: "B",
        vietnamese: "Được, cảm ơn bạn đã báo lại.",
        english: "Okay, thank you for letting me know.",
        pronunciation: "duoc, gahm uhn ban da bao lai",
      },
    ],
    cultural_note:
      "A calm apology plus a concrete fix sounds much better than a long explanation of the mistake.",
    tip:
      "Use chắc tôi hiểu nhầm or tôi sẽ sửa ngay when you need a fast recovery line.",
  },
  {
    id: 80,
    level: "A1",
    title_en: "Understanding Common Vietnamese Responses",
    subtitle: "Learn the response words locals use every day.",
    intro:
      "These short phrases help you hear meaning in the tiny words people say all the time.",
    phrases: [
      {
        english: "\"Dạ\" is a polite yes or polite response.",
        vietnamese: "\"Dạ\" là cách đáp lễ lịch sự.",
        pronunciation: "ya la kach dap leh lik soo",
        context: "Use when you hear a soft polite response from staff or older people.",
      },
      {
        english: "\"Ừ\" can be a casual yes.",
        vietnamese: "\"Ừ\" là kiểu đồng ý thân mật.",
        pronunciation: "oo la kiew dong ee than mat",
        context: "Use when a friend or close person speaks casually.",
      },
      {
        english: "\"Để tôi xem\" means let me check.",
        vietnamese: "\"Để tôi xem\" nghĩa là để tôi kiểm tra.",
        pronunciation: "deh toy xem nghia la deh toy kiem tra",
        context: "Use when someone wants time to look at something.",
      },
      {
        english: "\"Tùy bạn\" means up to you.",
        vietnamese: "\"Tùy bạn\" nghĩa là bạn quyết định.",
        pronunciation: "too-ee ban nghia la ban kwet dinh",
        context: "Use when the other person is leaving the choice to you.",
      },
      {
        english: "\"Không sao đâu\" means it is okay.",
        vietnamese: "\"Không sao đâu\" nghĩa là không có vấn đề.",
        pronunciation: "khome sao dow nghia la khome kaw van deh",
        context: "Use when someone wants to reassure you.",
      },
    ],
    cultural_note:
      "Small response words in Vietnamese carry a lot of social meaning, so listen for tone as well as words.",
    tip:
      "When in doubt, hear the response as attitude first: polite, casual, checking, or reassuring.",
  },
  {
    id: 81,
    level: "A1",
    title_en: "Visa And Immigration Office Follow-Up",
    subtitle: "Handle visa questions, documents, and return visits calmly.",
    intro:
      "Use these lines when you need to ask about extensions, missing documents, or the next step in an office process.",
    phrases: [
      {
        english: "I want to extend my visa.",
        vietnamese: "Tôi muốn gia hạn visa.",
        pronunciation: "toy mwon za-han vee-za",
        context: "Use when talking about a visa extension.",
      },
      {
        english: "I still do not have all the documents.",
        vietnamese: "Tôi vẫn chưa có đủ giấy tờ.",
        pronunciation: "toy van chua kaw doo zay toh",
        context: "Use when you are missing paperwork.",
      },
      {
        english: "Can I come back tomorrow?",
        vietnamese: "Tôi có thể quay lại ngày mai không?",
        pronunciation: "toy kaw the kwai lai ngay mai khome",
        context: "Use to confirm the next visit.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào anh, tôi muốn hỏi về việc gia hạn visa.",
        english: "Hello, I want to ask about extending my visa.",
        pronunciation: "chaw anh, toy mwon hoy ve vyek za-han vee-za",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, anh đã có đủ giấy tờ chưa?",
        english: "Do you already have all the documents?",
        pronunciation: "yah, anh da kaw doo zay toh chua",
      },
      {
        speaker: "A",
        vietnamese: "Tôi vẫn chưa có đủ, nhưng tôi có hộ chiếu và ảnh.",
        english: "Not all of them yet, but I have my passport and photos.",
        pronunciation: "toy van chua kaw doo, nyung toy kaw ho chyeu va anh",
      },
      {
        speaker: "B",
        vietnamese: "Vậy anh cần quay lại vào thứ Năm.",
        english: "Then you need to come back on Thursday.",
        pronunciation: "vay anh kun kwai lai vao thoo nam",
      },
      {
        speaker: "A",
        vietnamese: "Dạ, tôi hiểu rồi. Cảm ơn anh.",
        english: "Okay, I understand. Thank you.",
        pronunciation: "yah, toy hyew roy. gahm uhn anh",
      },
      {
        speaker: "B",
        vietnamese: "Không có gì, anh cứ đến đúng giờ nhé.",
        english: "No problem, just come on time.",
        pronunciation: "khome kaw zee, anh koo den doong zuh nyeh",
      },
    ],
    cultural_note:
      "Office conversations are easier when you mention documents first and the date second.",
    tip:
      "If you are missing one paper, say it directly. That helps staff explain the next step faster.",
  },
  {
    id: 82,
    level: "A1",
    title_en: "Bank Account And ATM Problems",
    subtitle: "Talk about cards, transfers, and banking trouble.",
    intro:
      "Use these lines when a card fails, an ATM keeps your card, or you need help opening an account.",
    phrases: [
      {
        english: "I want to open a bank account.",
        vietnamese: "Tôi muốn mở tài khoản ngân hàng.",
        pronunciation: "toy mwon muh tai-khoan ngan hang",
        context: "Use when speaking to a bank employee.",
      },
      {
        english: "I do not have a temporary residence card yet.",
        vietnamese: "Tôi chưa có thẻ tạm trú.",
        pronunciation: "toy chua kaw the tam choo",
        context: "Use if the bank asks for residency documents.",
      },
      {
        english: "My ATM card was swallowed by the machine.",
        vietnamese: "Máy ATM nuốt thẻ của tôi rồi.",
        pronunciation: "mai ay tee-em nuot the cua toy roy",
        context: "Use when the ATM keeps your card.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin chào, tôi muốn mở tài khoản ngân hàng.",
        english: "Hello, I want to open a bank account.",
        pronunciation: "seen chaw, toy mwon muh tai-khoan ngan hang",
      },
      {
        speaker: "B",
        vietnamese: "Anh đã có thẻ tạm trú chưa?",
        english: "Do you already have a temporary residence card?",
        pronunciation: "anh da kaw the tam choo chua",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chưa có, nhưng tôi có hộ chiếu.",
        english: "Not yet, but I have my passport.",
        pronunciation: "toy chua kaw, nyung toy kaw ho chyeu",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, vậy anh cần thêm giấy xác nhận địa chỉ.",
        english: "Okay, then you also need address confirmation.",
        pronunciation: "yah, vay anh kun them zay sak nyan dee-ah chee",
      },
      {
        speaker: "A",
        vietnamese: "Máy ATM hôm qua nuốt thẻ của tôi.",
        english: "Yesterday the ATM kept my card.",
        pronunciation: "mai ay tee-em hom kwa nuot the cua toy",
      },
      {
        speaker: "B",
        vietnamese: "Tôi sẽ kiểm tra giúp anh ngay bây giờ.",
        english: "I will check it for you right now.",
        pronunciation: "toy seh kiem tra zoop anh ngay bay zuh",
      },
    ],
    cultural_note:
      "Bank conversations are clearest when you name the object first: card, account, transfer, address.",
    tip:
      "If one document is missing, say that immediately instead of explaining the whole situation.",
  },
  {
    id: 83,
    level: "A1",
    title_en: "Phone SIM And Internet Setup",
    subtitle: "Handle SIM cards, data plans, and Wi-Fi issues.",
    intro:
      "These lines help when you need mobile data, a new SIM, or help with internet setup at home.",
    phrases: [
      {
        english: "I need a SIM card with data.",
        vietnamese: "Tôi cần một SIM có data.",
        pronunciation: "toy kun moht seem kaw day-ta",
        context: "Use at a phone shop or kiosk.",
      },
      {
        english: "My home Wi-Fi has been slow since yesterday.",
        vietnamese: "Mạng Wi-Fi nhà tôi bị chậm từ hôm qua.",
        pronunciation: "mang why-fye nha toy bee cham tu hom kwa",
        context: "Use when reporting an internet problem.",
      },
      {
        english: "Can you help me top up the data?",
        vietnamese: "Bạn nạp thêm data giúp tôi được không?",
        pronunciation: "ban nap them day-ta zoop toy duoc khome",
        context: "Use when your data is running low.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào bạn, tôi muốn mua SIM có data.",
        english: "Hi, I want to buy a SIM with data.",
        pronunciation: "chaw ban, toy mwon mua seem kaw day-ta",
      },
      {
        speaker: "B",
        vietnamese: "Bạn muốn mạng nào? Ổn định hay rẻ hơn?",
        english: "Which network do you want? Stable or cheaper?",
        pronunciation: "ban mwon mang nao? on dinh hai re hon",
      },
      {
        speaker: "A",
        vietnamese: "Tôi muốn mạng ổn để làm việc.",
        english: "I want stable internet for work.",
        pronunciation: "toy mwon mang on deh lam vyek",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, tôi có gói 30 ngày, data nhiều hơn.",
        english: "Okay, I have a 30-day plan with more data.",
        pronunciation: "yah, toy kaw goi ba muoi ngay, day-ta nyew hon",
      },
      {
        speaker: "A",
        vietnamese: "Nhà tôi cũng cần lắp Wi-Fi. Có thể giúp không?",
        english: "I also need Wi-Fi installed at home. Can you help?",
        pronunciation: "nha toy koom kun lap why-fye. kaw the zoop khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, để tôi ghi địa chỉ của bạn.",
        english: "Sure, let me write down your address.",
        pronunciation: "yah, deh toy zee dee-ah chee cua ban",
      },
    ],
    cultural_note:
      "For SIM and internet, the useful words are data, gói, mạng, and lắp.",
    tip:
      "If you do not know the exact plan, ask for the stable option instead of trying to over-explain.",
  },
  {
    id: 84,
    level: "A1",
    title_en: "Workplace Problems And Requests",
    subtitle: "Ask for help, more time, or clearer instructions at work.",
    intro:
      "Use these lines in offices, shops, or freelance work when a task needs more clarity.",
    phrases: [
      {
        english: "I do not understand this task yet.",
        vietnamese: "Tôi chưa hiểu việc này lắm.",
        pronunciation: "toy chua hyew vyek nai lam",
        context: "Use when instructions are unclear.",
      },
      {
        english: "Can you send it by email?",
        vietnamese: "Bạn gửi qua email giúp tôi được không?",
        pronunciation: "ban gooey kwa ee-mail zoop toy duoc khome",
        context: "Use when you need a written version.",
      },
      {
        english: "I need a little more time.",
        vietnamese: "Tôi cần thêm thời gian một chút.",
        pronunciation: "toy kun them tho-ee zian moht chut",
        context: "Use when you need more time to finish.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh ơi, em chưa hiểu việc này lắm.",
        english: "Excuse me, I do not understand this task very well.",
        pronunciation: "anh oi, em chua hyew vyek nai lam",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, tôi giải thích lại nhé.",
        english: "No problem, I will explain again.",
        pronunciation: "khome sao, toy zai thik lai nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Nếu được, anh gửi qua email giúp em.",
        english: "If possible, please send it by email.",
        pronunciation: "new duoc, anh gooey kwa ee-mail zoop em",
      },
      {
        speaker: "B",
        vietnamese: "Được, nhưng hôm nay phải xong trước 5 giờ.",
        english: "Okay, but it needs to be finished before 5 o'clock today.",
        pronunciation: "duoc, nyung hom nay fai song truok nam zuh",
      },
      {
        speaker: "A",
        vietnamese: "Vâng, em sẽ cố gắng hoàn thành.",
        english: "Yes, I will do my best to finish it.",
        pronunciation: "vang, em seh koh gung hoan than",
      },
      {
        speaker: "B",
        vietnamese: "Nếu cần gì thêm thì báo tôi nhé.",
        english: "If you need anything else, tell me.",
        pronunciation: "new kun zee them thi bao toy nyeh",
      },
    ],
    cultural_note:
      "Workplace Vietnamese often works best when you name the task, the problem, and the deadline.",
    tip:
      "Use mai mình bàn lại or thêm thời gian một chút when you need breathing room without sounding difficult.",
  },
  {
    id: 85,
    level: "A1",
    title_en: "School Childcare And Family Schedules",
    subtitle: "Talk about children, pickup times, and school messages.",
    intro:
      "These lines help with teachers, childcare staff, and family scheduling in daily life.",
    phrases: [
      {
        english: "My child starts school next week.",
        vietnamese: "Con tôi bắt đầu đi học tuần sau.",
        pronunciation: "kon toy bat dau dee hok twan sao",
        context: "Use when talking about school timing.",
      },
      {
        english: "I need to pick up my child at five.",
        vietnamese: "Tôi cần đón con lúc năm giờ.",
        pronunciation: "toy kun don kon look nam zuh",
        context: "Use when arranging pickup time.",
      },
      {
        english: "Can you explain the school message?",
        vietnamese: "Bạn có thể giải thích tin nhắn của trường không?",
        pronunciation: "ban kaw the zai thik tin nyan cua choong khome",
        context: "Use when a school message is hard to understand.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Xin chào cô, con tôi mới bắt đầu đi học tuần sau.",
        english: "Hello teacher, my child starts school next week.",
        pronunciation: "seen chaw koh, kon toy moy bat dau dee hok twan sao",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, vậy anh/chị cần đến sớm một chút.",
        english: "Okay, then you need to come a little early.",
        pronunciation: "yah, vay anh chi kun den som moht chut",
      },
      {
        speaker: "A",
        vietnamese: "Tôi cần đón con lúc năm giờ chiều.",
        english: "I need to pick up my child at five in the evening.",
        pronunciation: "toy kun don kon look nam zuh chiew",
      },
      {
        speaker: "B",
        vietnamese: "Được ạ, tôi sẽ ghi chú lại.",
        english: "Sure, I will note that down.",
        pronunciation: "duoc ah, toy seh zee choo lai",
      },
      {
        speaker: "A",
        vietnamese: "Con tôi hơi nhút nhát, nên chắc cần thời gian.",
        english: "My child is a little shy, so it may take time.",
        pronunciation: "kon toy hoy nyoot nyat, nen chak kun tho-ee zian",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, trẻ mới thường như vậy.",
        english: "No problem, new children are often like that.",
        pronunciation: "khome sao, chay moy thuong nyu vay",
      },
    ],
    cultural_note:
      "School conversations sound softer when you mention time, routine, and the child's mood.",
    tip:
      "If a message is unclear, ask for one detail first: time, place, or what to bring.",
  },
  {
    id: 86,
    level: "A1",
    title_en: "Dating Social Nuance And Boundaries",
    subtitle: "Keep social conversations warm, clear, and respectful.",
    intro:
      "Use these lines when you are getting to know someone and want to sound friendly without moving too fast.",
    phrases: [
      {
        english: "I want to get to know you better.",
        vietnamese: "Tôi muốn tìm hiểu bạn thêm.",
        pronunciation: "toy mwon tim hyew ban them",
        context: "Use when showing friendly interest.",
      },
      {
        english: "I prefer meeting in a public place.",
        vietnamese: "Tôi thích gặp ở chỗ công cộng.",
        pronunciation: "toy thik gap uh cho kong kong",
        context: "Use when you want a safe first meeting.",
      },
      {
        english: "Let's take it slowly.",
        vietnamese: "Mình cứ từ từ nhé.",
        pronunciation: "ming koo tu tu nyeh",
        context: "Use to keep the pace gentle.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi muốn tìm hiểu bạn thêm, nếu bạn thấy thoải mái.",
        english: "I want to get to know you better, if you feel comfortable.",
        pronunciation: "toy mwon tim hyew ban them, new ban thay thoai mai",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, mình cứ từ từ nhé.",
        english: "Sure, let's take it slowly.",
        pronunciation: "yah, ming koo tu tu nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Tôi thích gặp ở chỗ công cộng cho thoải mái hơn.",
        english: "I prefer meeting in a public place so it feels more comfortable.",
        pronunciation: "toy thik gap uh cho kong kong chaw thoai mai hon",
      },
      {
        speaker: "B",
        vietnamese: "Được, quán cà phê là ổn.",
        english: "Okay, a cafe is fine.",
        pronunciation: "duoc, kwan cafe la on",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chưa sẵn sàng cho việc đó, mong bạn hiểu.",
        english: "I am not ready for that yet, I hope you understand.",
        pronunciation: "toy chua san zang chaw vyek do, mong ban hyew",
      },
      {
        speaker: "B",
        vietnamese: "Không sao, mình tôn trọng nhau là được.",
        english: "No problem, respecting each other is enough.",
        pronunciation: "khome sao, ming ton trong nhau la duoc",
      },
    ],
    cultural_note:
      "Soft boundaries are often better than direct rejection in early social conversations.",
    tip:
      "Use mình cứ từ từ nhé when you want a slower pace without sounding cold.",
  },
  {
    id: 87,
    level: "A1",
    title_en: "Landlord Repairs And Complaints",
    subtitle: "Ask for repair without sounding harsh.",
    intro:
      "Use these lines when something in your apartment needs fixing and you need a practical response.",
    phrases: [
      {
        english: "The faucet is leaking.",
        vietnamese: "Vòi nước bị rò rỉ.",
        pronunciation: "voi nuok bee ro ree",
        context: "Use when water is leaking from the tap.",
      },
      {
        english: "The air conditioner is making a strange noise.",
        vietnamese: "Máy lạnh kêu lạ.",
        pronunciation: "mai lanh kew la",
        context: "Use when the AC sounds wrong.",
      },
      {
        english: "Could you fix it before the weekend?",
        vietnamese: "Nếu được, bạn có thể sửa giúp tôi trước cuối tuần không?",
        pronunciation: "new duoc, ban kaw the sua zoop toy truok kwoi twan khome",
        context: "Use when you want a repair done by a certain time.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào anh, vòi nước trong bếp đang bị rò rỉ.",
        english: "Hello, the kitchen faucet is leaking.",
        pronunciation: "chaw anh, voi nuok trong bep dang bee ro ree",
      },
      {
        speaker: "B",
        vietnamese: "Tôi biết rồi. Tôi sẽ gọi thợ.",
        english: "I know. I will call a repair person.",
        pronunciation: "toy byet roy. toy seh goy tho",
      },
      {
        speaker: "A",
        vietnamese: "Nếu được, bạn có thể sửa giúp tôi trước cuối tuần không?",
        english: "If possible, can you fix it before the weekend?",
        pronunciation: "new duoc, ban kaw the sua zoop toy truok kwoi twan khome",
      },
      {
        speaker: "B",
        vietnamese: "Được, tôi sẽ sắp xếp hôm nay.",
        english: "Okay, I will arrange it today.",
        pronunciation: "duoc, toy seh sap sep hom nay",
      },
      {
        speaker: "A",
        vietnamese: "Mạng Wi-Fi cũng chậm từ hôm qua nữa.",
        english: "The Wi-Fi has also been slow since yesterday.",
        pronunciation: "mang why-fye koom cham tu hom kwa nua",
      },
      {
        speaker: "B",
        vietnamese: "Vậy tôi kiểm tra luôn cho bạn.",
        english: "Then I will check it for you right away.",
        pronunciation: "vay toy kiem tra lun chaw ban",
      },
    ],
    cultural_note:
      "For repair problems, one clear complaint plus one time marker is usually enough.",
    tip:
      "Say từ hôm qua, tuần trước, or mấy ngày rồi to make the timing easier to understand.",
  },
  {
    id: 88,
    level: "A1",
    title_en: "Doctor Visit Symptoms And Pharmacy Details",
    subtitle: "Describe symptoms and ask about medicine clearly.",
    intro:
      "These lines help when you need to explain symptoms, ask about dosage, and understand basic pharmacy instructions.",
    phrases: [
      {
        english: "I have had a sore throat and cough for three days.",
        vietnamese: "Tôi bị đau họng và ho khoảng ba ngày rồi.",
        pronunciation: "toy bee dow hong va ho khwang ba ngay roy",
        context: "Use when explaining how long you have felt sick.",
      },
      {
        english: "I feel dizzy and a little weak.",
        vietnamese: "Tôi bị chóng mặt và hơi mệt.",
        pronunciation: "toy bee chong mat va hoy met",
        context: "Use when describing general symptoms.",
      },
      {
        english: "Do I need to take this medicine after eating?",
        vietnamese: "Thuốc này uống sau khi ăn phải không?",
        pronunciation: "thuok nai uong sau khi an fai khome",
        context: "Use to confirm medicine instructions.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bác sĩ ơi, tôi bị đau họng và ho khoảng ba ngày rồi.",
        english: "Doctor, I have had a sore throat and cough for about three days.",
        pronunciation: "bak see oi, toy bee dow hong va ho khwang ba ngay roy",
      },
      {
        speaker: "B",
        vietnamese: "Bạn có bị sốt không?",
        english: "Do you have a fever?",
        pronunciation: "ban kaw bee sot khome",
      },
      {
        speaker: "A",
        vietnamese: "Tôi không sốt, nhưng hơi mệt và chóng mặt.",
        english: "I do not have a fever, but I feel weak and dizzy.",
        pronunciation: "toy khome sot, nyung hoy met va chong mat",
      },
      {
        speaker: "B",
        vietnamese: "Được, tôi kê thuốc cho bạn nhé.",
        english: "Okay, I will prescribe medicine for you.",
        pronunciation: "duoc, toy ke thuok chaw ban nyeh",
      },
      {
        speaker: "A",
        vietnamese: "Thuốc này uống sau khi ăn phải không?",
        english: "Do I take this medicine after eating?",
        pronunciation: "thuok nai uong sau khi an fai khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ đúng, và uống nhiều nước nhé.",
        english: "Yes, that's right, and drink plenty of water.",
        pronunciation: "yah doong, va uong nyew nuok nyeh",
      },
    ],
    cultural_note:
      "Medical Vietnamese is clearer when you give the symptom, the duration, and any special condition.",
    tip:
      "If you know the body part, say it first: họng, đầu, bụng, ngực, or lưng.",
  },
  {
    id: 89,
    level: "A1",
    title_en: "Pharmacy Details And Dosage",
    subtitle: "Ask about timing, dose, and side effects at the pharmacy.",
    intro:
      "These lines help when you need clearer medicine instructions from a pharmacist.",
    phrases: [
      {
        english: "How many times a day should I take this?",
        vietnamese: "Mỗi ngày tôi uống mấy lần?",
        pronunciation: "moi ngay toy uong may lan",
        context: "Use to confirm the dosage schedule.",
      },
      {
        english: "Is this medicine before or after eating?",
        vietnamese: "Thuốc này uống trước hay sau khi ăn?",
        pronunciation: "thuok nai uong truok hai sau khi an",
        context: "Use to check the timing of the dose.",
      },
      {
        english: "Is there something that will not make me sleepy?",
        vietnamese: "Có thuốc nào không làm tôi buồn ngủ không?",
        pronunciation: "kaw thuok nao khome lam toy bwan ngu khome",
        context: "Use when you need a non-drowsy option.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Chào chị, thuốc này uống mấy lần một ngày?",
        english: "Hello, how many times a day do I take this medicine?",
        pronunciation: "chaw chi, thuok nai uong may lan moht ngay",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, ngày uống hai lần, sáng và tối.",
        english: "Two times a day, morning and evening.",
        pronunciation: "yah, ngay uong hai lan, sang va toy",
      },
      {
        speaker: "A",
        vietnamese: "Thuốc này uống trước hay sau khi ăn?",
        english: "Should I take this before or after eating?",
        pronunciation: "thuok nai uong truok hai sau khi an",
      },
      {
        speaker: "B",
        vietnamese: "Sau khi ăn thì tốt hơn ạ.",
        english: "After eating is better.",
        pronunciation: "sau khi an thi tot hon ah",
      },
      {
        speaker: "A",
        vietnamese: "Có thuốc nào không làm tôi buồn ngủ không?",
        english: "Is there something that will not make me sleepy?",
        pronunciation: "kaw thuok nao khome lam toy bwan ngu khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, tôi sẽ chọn loại nhẹ hơn cho bạn.",
        english: "Yes, I will choose a lighter one for you.",
        pronunciation: "yah, toy seh chon loai nye hon chaw ban",
      },
    ],
    cultural_note:
      "Pharmacy conversations usually become easier when you ask about number, time, and side effects separately.",
    tip:
      "If you are unsure, repeat the medicine name and ask mỗi ngày mấy lần.",
  },
  {
    id: 90,
    level: "A1",
    title_en: "Negotiating Politely",
    subtitle: "Ask for a better price or a better option without sounding rude.",
    intro:
      "These lines help when you want to negotiate, compare options, or ask for a small discount.",
    phrases: [
      {
        english: "Could you lower the price a little?",
        vietnamese: "Bạn có thể giảm giá một chút không?",
        pronunciation: "ban kaw the ziam zia moht chut khome",
        context: "Use in markets or with small services.",
      },
      {
        english: "If the price is reasonable, I can pay now.",
        vietnamese: "Nếu giá hợp lý, tôi có thể trả ngay.",
        pronunciation: "new zia hop lee, toy kaw the cha ngay",
        context: "Use when you want to close the deal politely.",
      },
      {
        english: "Could you give me another option?",
        vietnamese: "Bạn có thể cho tôi lựa chọn khác không?",
        pronunciation: "ban kaw the chaw toy lua chon khak khome",
        context: "Use when the first option is not enough.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh có thể giảm giá một chút không?",
        english: "Can you lower the price a little?",
        pronunciation: "anh kaw the ziam zia moht chut khome",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, tôi có thể bớt cho anh một ít.",
        english: "Yes, I can reduce it a little for you.",
        pronunciation: "yah, toy kaw the but chaw anh moht eet",
      },
      {
        speaker: "A",
        vietnamese: "Nếu giá hợp lý, tôi có thể trả ngay.",
        english: "If the price is reasonable, I can pay now.",
        pronunciation: "new zia hop lee, toy kaw the cha ngay",
      },
      {
        speaker: "B",
        vietnamese: "Được, vậy tôi tính cho anh giá tốt hơn.",
        english: "Okay, then I will give you a better price.",
        pronunciation: "duoc, vay toy ting chaw anh zia tot hon",
      },
      {
        speaker: "A",
        vietnamese: "Cái này không giống tôi mong đợi lắm.",
        english: "This is not quite what I expected.",
        pronunciation: "kai nai khome zong toy mong doi lam",
      },
      {
        speaker: "B",
        vietnamese: "Tôi hiểu, để tôi xem còn cách nào khác.",
        english: "I understand, let me see if there is another option.",
        pronunciation: "toy hyew, deh toy xem kon kach nao khak",
      },
    ],
    cultural_note:
      "Polite negotiation often sounds better when you say một chút, hợp lý, or lựa chọn khác.",
    tip:
      "Avoid sounding absolute. A little, another option, or maybe better helps keep the tone soft.",
  },
  {
    id: 91,
    level: "A1",
    title_en: "Telling Longer Stories",
    subtitle: "Link events naturally when you explain what happened.",
    intro:
      "Use these lines to tell a fuller story with because, so, after that, and if.",
    phrases: [
      {
        english: "Yesterday I went to the clinic because I felt unwell.",
        vietnamese: "Hôm qua tôi đi khám vì thấy không khỏe.",
        pronunciation: "hom kwa toy dee kham vi thay khome khoe",
        context: "Use when starting a simple story about your day.",
      },
      {
        english: "After that, I worked from home and rested.",
        vietnamese: "Sau đó tôi làm việc ở nhà và nghỉ ngơi.",
        pronunciation: "sau do toy lam vyek uh nha va nghi ngoy",
        context: "Use to continue the story in time order.",
      },
      {
        english: "The bus was delayed, so I arrived late.",
        vietnamese: "Xe buýt bị trễ nên tôi đến muộn.",
        pronunciation: "seh bweet bee chay nen toy den muon",
        context: "Use when explaining a problem with timing.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Hôm qua tôi đi khám vì thấy không khỏe.",
        english: "Yesterday I went to the clinic because I felt unwell.",
        pronunciation: "hom kwa toy dee kham vi thay khome khoe",
      },
      {
        speaker: "B",
        vietnamese: "Sau đó bạn làm gì?",
        english: "What did you do after that?",
        pronunciation: "sau do ban lam zee",
      },
      {
        speaker: "A",
        vietnamese: "Sau đó tôi làm việc ở nhà và nghỉ ngơi.",
        english: "After that, I worked from home and rested.",
        pronunciation: "sau do toy lam vyek uh nha va nghi ngoy",
      },
      {
        speaker: "B",
        vietnamese: "Vậy hôm nay bạn đỡ hơn chưa?",
        english: "So are you feeling better today?",
        pronunciation: "vay hom nay ban do hon chua",
      },
      {
        speaker: "A",
        vietnamese: "Đỡ hơn rồi, nhưng tôi vẫn muốn nghỉ thêm.",
        english: "Better now, but I still want to rest more.",
        pronunciation: "do hon roy, nyung toy van mwon nghi them",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, nếu cần thì cứ nghỉ nhé.",
        english: "Sure, if you need to, just rest.",
        pronunciation: "oo, new kun thi koo nghi nyeh",
      },
    ],
    cultural_note:
      "Longer Vietnamese stories are easier when you keep the order simple: before, after, because, so.",
    tip:
      "Use vì, nên, sau đó, and nếu to make sentences longer without making them academic.",
  },
  {
    id: 92,
    level: "A1",
    title_en: "Explaining Preferences And Reasons",
    subtitle: "Say what you like and why in natural Vietnamese.",
    intro:
      "Use these lines when you want to explain a choice, preference, or habit.",
    phrases: [
      {
        english: "I like this area because it is quiet and convenient.",
        vietnamese: "Tôi thích khu này vì yên tĩnh và tiện.",
        pronunciation: "toy thik khu nai vi yen ting va tien",
        context: "Use when explaining a place preference.",
      },
      {
        english: "I prefer simple food because my stomach is sensitive.",
        vietnamese: "Tôi thích đồ ăn đơn giản vì bụng tôi nhạy cảm.",
        pronunciation: "toy thik do an don zian vi boong toy nhay cam",
        context: "Use when talking about food choices.",
      },
      {
        english: "I chose this cafe because it is good for working.",
        vietnamese: "Tôi chọn quán cà phê này vì nó phù hợp để làm việc.",
        pronunciation: "toy chon kwan cafe nai vi no foo hop deh lam vyek",
        context: "Use when explaining a choice of cafe or place.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi thích khu này vì yên tĩnh và tiện.",
        english: "I like this area because it is quiet and convenient.",
        pronunciation: "toy thik khu nai vi yen ting va tien",
      },
      {
        speaker: "B",
        vietnamese: "Vậy sao bạn không chuyển đến gần trung tâm hơn?",
        english: "Then why do you not move closer to the center?",
        pronunciation: "vay sao ban khome chuyen den gun choong tam hon",
      },
      {
        speaker: "A",
        vietnamese: "Tôi muốn gần chợ và dễ đi làm.",
        english: "I want to be near the market and have an easier commute.",
        pronunciation: "toy mwon gun chuh va ze dee lam",
      },
      {
        speaker: "B",
        vietnamese: "Nghe hợp lý đấy.",
        english: "That sounds reasonable.",
        pronunciation: "nghe hop lee day",
      },
      {
        speaker: "A",
        vietnamese: "Tôi chọn quán này vì nó phù hợp để làm việc.",
        english: "I chose this cafe because it is good for working.",
        pronunciation: "toy chon kwan nai vi no foo hop deh lam vyek",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, ở đây khá yên và có Wi-Fi ổn.",
        english: "Yeah, it is quiet here and the Wi-Fi is stable.",
        pronunciation: "oo, uh day kha yen va kaw why-fye on",
      },
    ],
    cultural_note:
      "Preferences sound natural when you connect the choice to a simple reason.",
    tip:
      "Use vì plus one clear reason. That is usually enough for an A2/B1 answer.",
  },
  {
    id: 93,
    level: "A1",
    title_en: "Giving Advice Politely",
    subtitle: "Offer help without sounding bossy.",
    intro:
      "These lines are useful when you want to suggest a next step or a practical solution.",
    phrases: [
      {
        english: "Maybe you should talk to the landlord first.",
        vietnamese: "Có lẽ bạn nên nói với chủ nhà trước.",
        pronunciation: "ko le ban nen noy voy choo nha truok",
        context: "Use when suggesting a practical next step.",
      },
      {
        english: "If I were you, I would rest today.",
        vietnamese: "Nếu là tôi, tôi sẽ nghỉ hôm nay.",
        pronunciation: "new la toy, toy seh nghi hom nay",
        context: "Use when giving gentle advice.",
      },
      {
        english: "You should ask for a clear price.",
        vietnamese: "Bạn nên hỏi giá rõ ràng.",
        pronunciation: "ban nen hoy zia raw rang",
        context: "Use when giving simple consumer advice.",
      },
    ],
    cultural_note:
      "Advice sounds softer when you use có lẽ, nên, or nếu là tôi.",
    tip:
      "Do not over-explain the advice. One clear suggestion is usually enough.",
  },
  {
    id: 94,
    level: "A1",
    title_en: "Apologizing And Fixing Mistakes",
    subtitle: "Recover smoothly when you get something wrong.",
    intro:
      "Use these lines when you mishear, send the wrong thing, or need to correct yourself politely.",
    phrases: [
      {
        english: "Sorry, I misunderstood.",
        vietnamese: "Xin lỗi, chắc tôi hiểu nhầm.",
        pronunciation: "seen loy, chak toy hyew nyum",
        context: "Use when you realized the meaning was wrong.",
      },
      {
        english: "I wrote the wrong address.",
        vietnamese: "Tôi ghi sai địa chỉ.",
        pronunciation: "toy zee sai dee-ah chee",
        context: "Use when correcting an address or contact detail.",
      },
      {
        english: "I will fix it now.",
        vietnamese: "Tôi sẽ sửa ngay bây giờ.",
        pronunciation: "toy seh sua ngay bay zuh",
        context: "Use when you want to correct a mistake immediately.",
      },
    ],
    cultural_note:
      "A calm apology plus a concrete fix sounds better than a long explanation of the mistake.",
    tip:
      "Use chắc tôi hiểu nhầm or tôi sẽ sửa ngay when you need a fast recovery line.",
  },
  {
    id: 95,
    level: "A1",
    title_en: "Making Complaints Without Sounding Rude",
    subtitle: "Explain a problem clearly and ask for a better solution.",
    intro:
      "These lines help when something is not working, but you still want to sound respectful and practical.",
    phrases: [
      {
        english: "The room is too noisy at night.",
        vietnamese: "Phòng này ồn quá vào ban đêm.",
        pronunciation: "fong nai on gwa vao ban dem",
        context: "Use when complaining about noise.",
      },
      {
        english: "The internet has been slow since yesterday.",
        vietnamese: "Mạng bị chậm từ hôm qua.",
        pronunciation: "mang bee cham tu hom kwa",
        context: "Use when reporting a repeated problem.",
      },
      {
        english: "Could you help me with a better solution?",
        vietnamese: "Bạn có thể giúp tôi một giải pháp tốt hơn không?",
        pronunciation: "ban kaw the zoop toy moht zai fap tot hon khome",
        context: "Use when the first answer is not enough.",
      },
    ],
    cultural_note:
      "Complaints stay more effective when they focus on the problem and the requested fix.",
    tip:
      "Use from yesterday, at night, or for a week to make the complaint concrete.",
  },
  {
    id: 96,
    level: "A1",
    title_en: "Understanding Common Vietnamese Responses",
    subtitle: "Learn the response words locals use every day.",
    intro:
      "These short lines help you understand tiny response words that carry a lot of meaning in real conversation.",
    phrases: [
      {
        english: "\"Dạ\" is a polite response.",
        vietnamese: "\"Dạ\" là cách đáp lễ lịch sự.",
        pronunciation: "ya la kach dap leh lik soo",
        context: "Use when you hear a soft polite response from staff or older people.",
      },
      {
        english: "\"Ừ\" can mean casual yes.",
        vietnamese: "\"Ừ\" là kiểu đồng ý thân mật.",
        pronunciation: "oo la kiew dong ee than mat",
        context: "Use when a friend speaks casually.",
      },
      {
        english: "\"Để tôi xem\" means let me check.",
        vietnamese: "\"Để tôi xem\" nghĩa là để tôi kiểm tra.",
        pronunciation: "deh toy xem nghia la deh toy kiem tra",
        context: "Use when someone wants time to look at something.",
      },
    ],
    cultural_note:
      "Small response words in Vietnamese carry a lot of social meaning, so listen for tone as well as words.",
    tip:
      "When in doubt, hear the response as attitude first: polite, casual, checking, or reassuring.",
  },
  {
    id: 97,
    level: "B1",
    title_en: "Family Pressure: Checking In Without Pushing",
    subtitle: "Ask about a sensitive family topic gently.",
    intro:
      "These lines help when you want to check in with someone without sounding nosy or controlling.",
    phrases: [
      {
        english: "I do want to ask, but if it is uncomfortable, you do not have to answer.",
        vietnamese: "Tôi cũng muốn hỏi, nhưng nếu bạn không thoải mái thì không cần trả lời đâu.",
        pronunciation: "toy kung mwon hoy, nyung new ban khong thoai mai thi khong kun cha loy dau",
        context: "Use before asking about a private family matter.",
      },
      {
        english: "I am asking because I care, not because I want to pressure you.",
        vietnamese: "Tôi hỏi vì quan tâm thôi, chứ không phải muốn gây áp lực cho bạn.",
        pronunciation: "toy hoy vi quan tam thoy, chu khong phai mwon gay ap look cho ban",
        context: "Use when your intention might be misunderstood.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Dạo này ở nhà ổn không? Nếu khó nói thì thôi cũng được.",
        english: "Have things been okay at home lately? If it is hard to talk about, it is okay not to.",
        pronunciation: "zao nai uh nha on khong, new kho noy thi thoy kung duoc",
      },
      {
        speaker: "B",
        vietnamese: "Ừ... cũng hơi căng, nhưng tôi chưa biết kể từ đâu.",
        english: "Yeah... it has been a bit tense, but I do not know where to start.",
        pronunciation: "oo, kung hoy kang, nyung toy chua biet keh tu dau",
      },
      {
        speaker: "A",
        vietnamese: "Không sao, bạn cứ nói chậm thôi. Tôi nghe được.",
        english: "It is okay. Just take it slowly. I can listen.",
        pronunciation: "khong sao, ban ku noy cham thoy, toy nghe duoc",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn. Có người nghe mà không phán xét cũng đỡ rồi.",
        english: "Thank you. Having someone listen without judging already helps.",
        pronunciation: "kam un, ko nguoi nghe ma khong fan zet kung do roy",
      },
    ],
    cultural_note:
      "In Vietnamese family conversations, direct questions can feel heavy. A soft permission line gives the other person space.",
    tip:
      "Use nếu khó nói thì thôi cũng được when you want to lower pressure before a sensitive question.",
  },
  {
    id: 98,
    level: "B1",
    title_en: "Parents Comparing You To Others",
    subtitle: "Respond to comparison without attacking your parents.",
    intro:
      "These lines help heritage speakers and adult learners talk about comparison, shame, and expectations calmly.",
    phrases: [
      {
        english: "I know you want me to do well, but comparison makes me feel small.",
        vietnamese: "Con biết ba mẹ muốn con tốt hơn, nhưng bị so sánh làm con thấy mình nhỏ lại.",
        pronunciation: "kon biet ba me mwon kon tot hon, nyung bi so sanh lam kon thay minh nyo lai",
        context: "Use with parents when comparison hurts but you still want respect.",
      },
      {
        english: "Can we talk about my path without bringing up other people's children?",
        vietnamese: "Mình nói chuyện về đường đi của con thôi, đừng nhắc con nhà người ta được không?",
        pronunciation: "minh noy chuyen ve duong di kua kon thoy, dung nyak kon nha nguoi ta duoc khong",
        context: "Use when you need a clearer boundary around comparison.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Ba mẹ cứ nói con nhà người ta, con nghe nhiều cũng mệt.",
        english: "When you keep bringing up other people's children, I get tired of hearing it.",
        pronunciation: "ba me ku noy kon nha nguoi ta, kon nghe nhieu kung met",
      },
      {
        speaker: "B",
        vietnamese: "Ba mẹ chỉ muốn con có động lực thôi.",
        english: "We just want you to have motivation.",
        pronunciation: "ba me chi mwon kon ko dong luc thoy",
      },
      {
        speaker: "A",
        vietnamese: "Con hiểu, nhưng cách đó làm con thấy bị chê nhiều hơn là được động viên.",
        english: "I understand, but that way makes me feel criticized more than encouraged.",
        pronunciation: "kon hieu, nyung kach do lam kon thay bi che nhieu hon la duoc dong vien",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, vậy mình nói cách khác nha.",
        english: "Okay, then let us talk about it another way.",
        pronunciation: "oo, vay minh noy kach khak nha",
      },
    ],
    cultural_note:
      "Many Vietnamese parents use comparison as motivation, but adult children often hear it as rejection.",
    tip:
      "Name both truths: con hiểu ý tốt, nhưng cách đó làm con đau. That keeps the door open.",
  },
  {
    id: 99,
    level: "B1",
    title_en: "Not Ready For Marriage",
    subtitle: "Explain your timing without sounding dismissive.",
    intro:
      "Use these lines when relatives ask about marriage and you need a calm, adult answer.",
    phrases: [
      {
        english: "I am not avoiding marriage; I just want to be ready emotionally and financially.",
        vietnamese: "Con không né chuyện cưới hỏi, chỉ là con muốn sẵn sàng hơn về cảm xúc và tài chính.",
        pronunciation: "kon khong ne chuyen kuoi hoy, chi la kon mwon san sang hon ve kam xuk va tai chinh",
        context: "Use with family when they think you are delaying without reason.",
      },
      {
        english: "I would rather marry later than rush and make both people suffer.",
        vietnamese: "Con thà cưới trễ còn hơn vội vàng rồi làm khổ cả hai người.",
        pronunciation: "kon tha kuoi tre kon hon voy vang roy lam kho ka hai nguoi",
        context: "Use to explain a more thoughtful view of marriage.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Sao con chưa tính chuyện cưới xin?",
        english: "Why have you not thought about getting married yet?",
        pronunciation: "sao kon chua tinh chuyen kuoi xin",
      },
      {
        speaker: "B",
        vietnamese: "Con có nghĩ chứ, nhưng con chưa muốn làm cho xong chuyện.",
        english: "I have thought about it, but I do not want to do it just to get it over with.",
        pronunciation: "kon ko nghi chu, nyung kon chua mwon lam cho xong chuyen",
      },
      {
        speaker: "A",
        vietnamese: "Lớn rồi, chờ hoài cũng khó.",
        english: "You are grown now; waiting forever is hard too.",
        pronunciation: "lon roy, cho hoai kung kho",
      },
      {
        speaker: "B",
        vietnamese: "Con hiểu. Con chỉ muốn khi cưới thì thật sự có trách nhiệm.",
        english: "I understand. I just want to be truly responsible when I marry.",
        pronunciation: "kon hieu, kon chi mwon khi kuoi thi that su ko trach nhiem",
      },
    ],
    cultural_note:
      "Marriage questions often carry care, anxiety, family pride, and fear of gossip all at once.",
    tip:
      "Use con hiểu to acknowledge family worry before explaining your own timing.",
  },
  {
    id: 100,
    level: "B1",
    title_en: "Comforting A Burned-Out Sibling",
    subtitle: "Support someone without turning it into advice too fast.",
    intro:
      "These phrases are for real family support when someone is tired, ashamed, or overwhelmed.",
    phrases: [
      {
        english: "You do not have to be strong with me all the time.",
        vietnamese: "Ở với tôi, bạn không cần lúc nào cũng phải mạnh mẽ đâu.",
        pronunciation: "uh voi toy, ban khong kun luk nao kung phai manh me dau",
        context: "Use when someone always hides their exhaustion.",
      },
      {
        english: "Resting is not failure; it means your body has been carrying too much.",
        vietnamese: "Nghỉ không phải là thất bại, mà là cơ thể bạn đã gồng quá lâu rồi.",
        pronunciation: "ngi khong phai la that bai, ma la ko the ban da gong qua lau roy",
        context: "Use to reframe rest for someone who feels guilty.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi thấy mình vô dụng ghê. Mới làm chút đã kiệt sức.",
        english: "I feel so useless. I barely did anything and I am already exhausted.",
        pronunciation: "toy thay minh vo dung ghe, moi lam chut da kiet suc",
      },
      {
        speaker: "B",
        vietnamese: "Không phải vô dụng đâu. Bạn gồng lâu quá rồi.",
        english: "You are not useless. You have been pushing yourself for too long.",
        pronunciation: "khong phai vo dung dau, ban gong lau qua roy",
      },
      {
        speaker: "A",
        vietnamese: "Nhưng ai cũng chịu được, có mình tôi là than.",
        english: "But everyone else can handle it. I am the only one complaining.",
        pronunciation: "nyung ai kung chiu duoc, ko minh toy la than",
      },
      {
        speaker: "B",
        vietnamese: "Người ta chịu được hay không mình đâu thấy hết. Bạn mệt thì mình lo phần mệt trước.",
        english: "We do not see everything other people carry. If you are tired, let us care for that first.",
        pronunciation: "nguoi ta chiu duoc hay khong minh dau thay het, ban met thi minh lo phan met truoc",
      },
    ],
    cultural_note:
      "Vietnamese support can become advice very quickly. Sometimes the kinder move is to witness the tiredness first.",
    tip:
      "Use mình lo phần mệt trước to slow the conversation down and focus on the person.",
  },
  {
    id: 101,
    level: "B1",
    title_en: "Quiet Resentment In The Family",
    subtitle: "Say something is building up before it explodes.",
    intro:
      "These lines help you name resentment early without making the conversation dramatic.",
    phrases: [
      {
        english: "I am not angry right now, but I can feel resentment building up.",
        vietnamese: "Bây giờ tôi không giận, nhưng tôi thấy trong lòng bắt đầu có sự ấm ức.",
        pronunciation: "bay gio toy khong zan, nyung toy thay trong long bat dau ko su am uk",
        context: "Use when you want to prevent a bigger conflict.",
      },
      {
        english: "I do not want to pretend everything is fine and then become cold later.",
        vietnamese: "Tôi không muốn giả vờ ổn rồi sau đó lại lạnh nhạt.",
        pronunciation: "toy khong mwon za vo on roy sau do lai lanh nhat",
        context: "Use to explain why you are bringing up a hard topic.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Có chuyện này tôi muốn nói sớm, trước khi nó thành khó chịu.",
        english: "There is something I want to say early, before it turns into resentment.",
        pronunciation: "ko chuyen nai toy mwon noy som, truoc khi no thanh kho chiu",
      },
      {
        speaker: "B",
        vietnamese: "Nghe nghiêm trọng vậy?",
        english: "That sounds serious.",
        pronunciation: "nghe nghiem trong vay",
      },
      {
        speaker: "A",
        vietnamese: "Không nghiêm trọng, nhưng nếu im hoài chắc sẽ thành nghiêm trọng.",
        english: "It is not serious yet, but if I keep quiet, it probably will become serious.",
        pronunciation: "khong nghiem trong, nyung new im hoai chak se thanh nghiem trong",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, vậy nói đi. Tôi nghe.",
        english: "Okay, say it. I am listening.",
        pronunciation: "oo, vay noy di, toy nghe",
      },
    ],
    cultural_note:
      "In many families, silence is treated as peace. But long silence can become emotional distance.",
    tip:
      "Use nói sớm to frame the conversation as prevention, not attack.",
  },
  {
    id: 102,
    level: "B1",
    title_en: "Money Stress With Parents",
    subtitle: "Talk about financial pressure with respect and clarity.",
    intro:
      "Use these phrases when money, support, debt, or family obligation feels emotionally loaded.",
    phrases: [
      {
        english: "I want to help, but I need to be honest about what I can actually afford.",
        vietnamese: "Con muốn giúp, nhưng con cần nói thật về khả năng tài chính của con.",
        pronunciation: "kon mwon zup, nyung kon kun noy that ve kha nang tai chinh kua kon",
        context: "Use when setting a realistic family support limit.",
      },
      {
        english: "If I say yes to everything, later I may become resentful, and I do not want that.",
        vietnamese: "Nếu con cái gì cũng nhận, sau này con dễ ấm ức, mà con không muốn vậy.",
        pronunciation: "new kon kai zi kung nhan, sau nai kon ze am uk, ma kon khong mwon vay",
        context: "Use when money boundaries are tied to family peace.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tháng này con gửi được ít hơn một chút, được không?",
        english: "Can I send a little less this month?",
        pronunciation: "thang nai kon gui duoc it hon mot chut, duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Ở nhà cũng đang kẹt, nên ba mẹ mới hỏi.",
        english: "Things are tight at home too, that is why we asked.",
        pronunciation: "uh nha kung dang ket, nen ba me moi hoy",
      },
      {
        speaker: "A",
        vietnamese: "Con hiểu. Con không bỏ mặc đâu, chỉ là con cũng cần thở một chút.",
        english: "I understand. I am not abandoning you, I just need a little breathing room too.",
        pronunciation: "kon hieu, kon khong bo mak dau, chi la kon kung kun tho mot chut",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, vậy con gửi được bao nhiêu thì nói rõ nha.",
        english: "Okay, then tell us clearly how much you can send.",
        pronunciation: "oo, vay kon gui duoc bao nhieu thi noy ro nha",
      },
    ],
    cultural_note:
      "Money support in Vietnamese families can carry love, duty, guilt, and pride at the same time.",
    tip:
      "Give a number if you can. Clear limits often feel less hurtful than vague avoidance.",
  },
  {
    id: 103,
    level: "B1",
    title_en: "Respectful Disagreement With A Parent",
    subtitle: "Disagree without turning the conversation into a fight.",
    intro:
      "These lines help you separate respect from obedience when you need to speak honestly.",
    phrases: [
      {
        english: "I respect your experience, but this part of my life is different now.",
        vietnamese: "Con tôn trọng kinh nghiệm của ba mẹ, nhưng phần này trong đời con bây giờ khác rồi.",
        pronunciation: "kon ton trong kinh nghiem kua ba me, nyung phan nai trong doi kon bay gio khak roy",
        context: "Use when older advice does not fit your current situation.",
      },
      {
        english: "I am not trying to win; I just want you to understand why I choose this.",
        vietnamese: "Con không cố thắng đâu, con chỉ muốn ba mẹ hiểu vì sao con chọn như vậy.",
        pronunciation: "kon khong ko thang dau, kon chi mwon ba me hieu vi sao kon chon nhu vay",
        context: "Use when disagreement starts to feel competitive.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Con biết ba mẹ lo, nhưng con muốn thử cách của con.",
        english: "I know you are worried, but I want to try my way.",
        pronunciation: "kon biet ba me lo, nyung kon mwon thu kach kua kon",
      },
      {
        speaker: "B",
        vietnamese: "Ba mẹ sống lâu hơn, thấy nhiều hơn con.",
        english: "We have lived longer and seen more than you.",
        pronunciation: "ba me song lau hon, thay nhieu hon kon",
      },
      {
        speaker: "A",
        vietnamese: "Dạ, con biết. Nhưng hoàn cảnh của con có vài điểm khác.",
        english: "Yes, I know. But my situation has a few differences.",
        pronunciation: "ya, kon biet, nyung hoan kanh kua kon ko vai diem khak",
      },
      {
        speaker: "B",
        vietnamese: "Vậy con giải thích cho ba mẹ nghe.",
        english: "Then explain it to us.",
        pronunciation: "vay kon zai thik cho ba me nghe",
      },
    ],
    cultural_note:
      "Dạ can soften disagreement without erasing your point. It signals respect before the boundary.",
    tip:
      "Use con muốn ba mẹ hiểu rather than con muốn ba mẹ đồng ý when agreement may be too much to ask.",
  },
  {
    id: 104,
    level: "B1",
    title_en: "Vietnamese Parenting Boundaries",
    subtitle: "Talk about discipline, pressure, and emotional safety.",
    intro:
      "Use these lines when discussing parenting choices that differ from the older generation.",
    phrases: [
      {
        english: "I want my child to respect adults, but I also want them to feel safe speaking honestly.",
        vietnamese: "Tôi muốn con biết tôn trọng người lớn, nhưng cũng muốn con thấy an toàn khi nói thật.",
        pronunciation: "toy mwon kon biet ton trong nguoi lon, nyung kung mwon kon thay an toan khi noy that",
        context: "Use when explaining a balanced parenting value.",
      },
      {
        english: "Being strict is not the same as making a child afraid.",
        vietnamese: "Nghiêm không có nghĩa là làm cho con sợ.",
        pronunciation: "nghiem khong ko nghia la lam cho kon so",
        context: "Use when discussing discipline without fear.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Con nít phải sợ người lớn một chút mới ngoan.",
        english: "Children need to fear adults a little to behave.",
        pronunciation: "kon nit phai so nguoi lon mot chut moi ngoan",
      },
      {
        speaker: "B",
        vietnamese: "Tôi hiểu ý đó, nhưng tôi không muốn con sợ đến mức giấu hết mọi chuyện.",
        english: "I understand that idea, but I do not want my child to be so afraid they hide everything.",
        pronunciation: "toy hieu y do, nyung toy khong mwon kon so den muc zau het moi chuyen",
      },
      {
        speaker: "A",
        vietnamese: "Vậy làm sao dạy được?",
        english: "Then how can you teach them?",
        pronunciation: "vay lam sao zay duoc",
      },
      {
        speaker: "B",
        vietnamese: "Vẫn có giới hạn rõ ràng, chỉ là mình không làm nhục con.",
        english: "There are still clear limits; we just do not humiliate the child.",
        pronunciation: "van ko zoi han ro rang, chi la minh khong lam nhuk kon",
      },
    ],
    cultural_note:
      "Many Vietnamese parenting conversations blend love, fear, sacrifice, and authority. Nuance matters.",
    tip:
      "Use vẫn có giới hạn rõ ràng to show you are not rejecting structure.",
  },
  {
    id: 105,
    level: "B1",
    title_en: "A Deep Apology To A Friend",
    subtitle: "Apologize without over-explaining or defending yourself.",
    intro:
      "These phrases help you repair trust after you hurt someone or handled something poorly.",
    phrases: [
      {
        english: "I understand why that hurt you, and I should not have brushed it off.",
        vietnamese: "Tôi hiểu vì sao chuyện đó làm bạn đau, và lẽ ra tôi không nên xem nhẹ như vậy.",
        pronunciation: "toy hieu vi sao chuyen do lam ban dau, va le ra toy khong nen xem nhe nhu vay",
        context: "Use when apologizing for minimizing someone's feelings.",
      },
      {
        english: "I do not want to use my stress as an excuse for treating you badly.",
        vietnamese: "Tôi không muốn lấy chuyện tôi căng thẳng làm cớ để đối xử tệ với bạn.",
        pronunciation: "toy khong mwon lay chuyen toy kang thang lam ko de doi xu te voi ban",
        context: "Use when taking responsibility without self-pity.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi xin lỗi vì hôm đó đã nói kiểu rất lạnh.",
        english: "I am sorry for speaking so coldly that day.",
        pronunciation: "toy xin loy vi hom do da noy kieu rat lanh",
      },
      {
        speaker: "B",
        vietnamese: "Tôi không giận vì bạn bận. Tôi buồn vì bạn làm như tôi phiền.",
        english: "I was not mad that you were busy. I was hurt because you made me feel like a burden.",
        pronunciation: "toy khong zan vi ban ban, toy buon vi ban lam nhu toy phien",
      },
      {
        speaker: "A",
        vietnamese: "Ừ, tôi nghe. Tôi đã làm bạn thấy bị gạt ra ngoài.",
        english: "Yes, I hear that. I made you feel pushed aside.",
        pronunciation: "oo, toy nghe, toy da lam ban thay bi gat ra ngoai",
      },
      {
        speaker: "B",
        vietnamese: "Chỉ cần bạn hiểu vậy là tôi nhẹ hơn rồi.",
        english: "Just knowing you understand that already makes me feel lighter.",
        pronunciation: "chi kun ban hieu vay la toy nhe hon roy",
      },
    ],
    cultural_note:
      "A strong Vietnamese apology often includes nhận lỗi, hiểu nỗi đau, and a concrete change.",
    tip:
      "Avoid nhưng right after xin lỗi. It can make the apology sound like a defense.",
  },
  {
    id: 106,
    level: "B1",
    title_en: "Soft Refusal Without Burning The Relationship",
    subtitle: "Say no in a way that keeps dignity for both sides.",
    intro:
      "Use these lines when you cannot accept an invitation, favor, or request but want to stay warm.",
    phrases: [
      {
        english: "I really appreciate you thinking of me, but I cannot take this on right now.",
        vietnamese: "Tôi rất quý việc bạn nghĩ tới tôi, nhưng lúc này tôi không nhận thêm được.",
        pronunciation: "toy rat quy viec ban nghi toi toy, nyung luk nai toy khong nhan them duoc",
        context: "Use for a warm but clear refusal.",
      },
      {
        english: "I do not want to say yes and then do it carelessly.",
        vietnamese: "Tôi không muốn nhận lời rồi làm qua loa.",
        pronunciation: "toy khong mwon nhan loy roy lam qua loa",
        context: "Use when refusing because you want to be responsible.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Cuối tuần này bạn phụ tôi một việc được không?",
        english: "Can you help me with something this weekend?",
        pronunciation: "cuoi tuan nai ban phu toy mot viec duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Tôi muốn giúp lắm, nhưng tuần này tôi kín lịch thật sự.",
        english: "I really want to help, but this week my schedule is truly full.",
        pronunciation: "toy mwon zup lam, nyung tuan nai toy kin lich that su",
      },
      {
        speaker: "A",
        vietnamese: "Không được chút nào hả?",
        english: "Not even a little?",
        pronunciation: "khong duoc chut nao ha",
      },
      {
        speaker: "B",
        vietnamese: "Tôi sợ nhận rồi làm không tới nơi. Để lần sau tôi phụ kỹ hơn nha.",
        english: "I am afraid I would say yes and not do it properly. Let me help more fully next time.",
        pronunciation: "toy so nhan roy lam khong toi noi, de lan sau toy phu ky hon nha",
      },
    ],
    cultural_note:
      "A soft refusal protects mặt mũi by showing appreciation before the limit.",
    tip:
      "Use tôi sợ nhận rồi làm không tới nơi when your no is about capacity, not rejection.",
  },
  {
    id: 107,
    level: "B1",
    title_en: "Dating: Unclear Intentions",
    subtitle: "Ask where things are going without sounding accusatory.",
    intro:
      "These phrases help with modern dating conversations where signals are mixed or vague.",
    phrases: [
      {
        english: "I like spending time with you, but I am a little unsure what you are looking for.",
        vietnamese: "Tôi thích đi chơi với bạn, nhưng tôi hơi không rõ bạn đang tìm điều gì.",
        pronunciation: "toy thik di choi voi ban, nyung toy hoy khong ro ban dang tim dieu zi",
        context: "Use when dating feels warm but undefined.",
      },
      {
        english: "I do not need an answer immediately, but I do need honesty.",
        vietnamese: "Tôi không cần câu trả lời ngay, nhưng tôi cần sự thật lòng.",
        pronunciation: "toy khong kun kau tra loy ngay, nyung toy kun su that long",
        context: "Use when asking for emotional clarity.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi vui khi gặp bạn, nhưng thú thật tôi hơi lấn cấn.",
        english: "I enjoy seeing you, but honestly I feel a little uneasy.",
        pronunciation: "toy vui khi gap ban, nyung thu that toy hoy lan kan",
      },
      {
        speaker: "B",
        vietnamese: "Vì chuyện gì?",
        english: "About what?",
        pronunciation: "vi chuyen zi",
      },
      {
        speaker: "A",
        vietnamese: "Tôi không rõ mình đang tìm hiểu nghiêm túc hay chỉ đi chơi cho vui.",
        english: "I am not sure if we are seriously getting to know each other or just hanging out.",
        pronunciation: "toy khong ro minh dang tim hieu nghiem tuk hay chi di choi cho vui",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, câu đó công bằng. Để tôi nói thật hơn.",
        english: "Yeah, that is a fair question. Let me be more honest.",
        pronunciation: "oo, kau do kong bang, de toy noy that hon",
      },
    ],
    cultural_note:
      "Dating conversations in Vietnamese can be indirect, especially when neither person wants to mất mặt.",
    tip:
      "Use hơi lấn cấn for a natural way to say something feels off but not explosive.",
  },
  {
    id: 108,
    level: "B1",
    title_en: "Dating And Family Expectations",
    subtitle: "Talk about family pressure around relationships.",
    intro:
      "These lines help when dating is not only between two people but also tied to family timing and approval.",
    phrases: [
      {
        english: "I like you, but I also need to move carefully because my family gets involved quickly.",
        vietnamese: "Tôi thích bạn, nhưng tôi cũng cần đi chậm vì gia đình tôi hay xen vào khá sớm.",
        pronunciation: "toy thik ban, nyung toy kung kun di cham vi gia dinh toy hay xen vao kha som",
        context: "Use when family pressure affects dating pace.",
      },
      {
        english: "I do not want us to rush just because people are asking questions.",
        vietnamese: "Tôi không muốn tụi mình vội chỉ vì người khác hỏi nhiều.",
        pronunciation: "toy khong mwon tui minh voi chi vi nguoi khak hoy nhieu",
        context: "Use when outside pressure is shaping the relationship.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mẹ tôi bắt đầu hỏi về bạn rồi.",
        english: "My mom has started asking about you.",
        pronunciation: "me toy bat dau hoy ve ban roy",
      },
      {
        speaker: "B",
        vietnamese: "Nghe hơi áp lực ha.",
        english: "That sounds a little pressuring.",
        pronunciation: "nghe hoy ap luc ha",
      },
      {
        speaker: "A",
        vietnamese: "Ừ, tôi thích bạn, nhưng không muốn tụi mình bị đẩy nhanh quá.",
        english: "Yeah, I like you, but I do not want us to be pushed too fast.",
        pronunciation: "oo, toy thik ban, nyung khong mwon tui minh bi day nhanh qua",
      },
      {
        speaker: "B",
        vietnamese: "Vậy mình cứ đi chậm, nhưng nói rõ với nhau.",
        english: "Then let us go slowly, but stay clear with each other.",
        pronunciation: "vay minh ku di cham, nyung noy ro voi nhau",
      },
    ],
    cultural_note:
      "Family curiosity can feel like care to one person and pressure to another.",
    tip:
      "Use tụi mình bị đẩy nhanh quá to name outside pressure without blaming your partner.",
  },
  {
    id: 109,
    level: "B1",
    title_en: "Saying You Need Space",
    subtitle: "Ask for emotional space without disappearing.",
    intro:
      "Use these phrases when you need quiet time but do not want the other person to feel abandoned.",
    phrases: [
      {
        english: "I need some space, but I am not trying to punish you.",
        vietnamese: "Tôi cần một chút không gian, nhưng không phải để phạt bạn.",
        pronunciation: "toy kun mot chut khong gian, nyung khong phai de fat ban",
        context: "Use when asking for space after tension.",
      },
      {
        english: "Can we pause tonight and talk again when both of us are calmer?",
        vietnamese: "Tối nay mình tạm dừng nha, khi cả hai bình tĩnh hơn rồi nói tiếp được không?",
        pronunciation: "toi nai minh tam dung nha, khi ka hai binh tinh hon roy noy tiep duoc khong",
        context: "Use when a conversation is getting heated.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi thấy mình sắp nói những câu không nên nói.",
        english: "I feel like I am about to say things I should not say.",
        pronunciation: "toy thay minh sap noy nhung kau khong nen noy",
      },
      {
        speaker: "B",
        vietnamese: "Vậy bạn muốn dừng lại hả?",
        english: "So you want to stop?",
        pronunciation: "vay ban mwon dung lai ha",
      },
      {
        speaker: "A",
        vietnamese: "Dừng tối nay thôi. Tôi vẫn muốn giải quyết chuyện này.",
        english: "Just stop for tonight. I still want to resolve this.",
        pronunciation: "dung toi nai thoy, toy van mwon zai quyet chuyen nai",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, mai mình nói tiếp.",
        english: "Okay, we will talk more tomorrow.",
        pronunciation: "oo, mai minh noy tiep",
      },
    ],
    cultural_note:
      "Space can be mistaken for coldness. A time promise helps the other person feel less rejected.",
    tip:
      "Add mai mình nói tiếp or lát nữa mình nhắn lại if you need distance but not disappearance.",
  },
  {
    id: 110,
    level: "B1",
    title_en: "Awkward Follow-Up After A Date",
    subtitle: "Be kind when the feeling is not mutual.",
    intro:
      "These lines help you close a dating conversation honestly without being cruel.",
    phrases: [
      {
        english: "I had a good time, but I did not feel the kind of connection I am looking for.",
        vietnamese: "Tôi đã có một buổi đi chơi vui, nhưng tôi không cảm thấy kiểu kết nối mình đang tìm.",
        pronunciation: "toy da ko mot buoi di choi vui, nyung toy khong kam thay kieu ket noi minh dang tim",
        context: "Use when declining a second date kindly.",
      },
      {
        english: "I do not want to keep talking if I already know my heart is not there.",
        vietnamese: "Tôi không muốn tiếp tục nhắn nếu trong lòng tôi đã biết là không tới.",
        pronunciation: "toy khong mwon tiep tuc nhan new trong long toy da biet la khong toi",
        context: "Use when honesty is kinder than dragging things out.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tối qua tôi vui, nhưng chắc tôi nên nói thật.",
        english: "I had fun last night, but I should probably be honest.",
        pronunciation: "toi qua toy vui, nyung chak toy nen noy that",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, bạn nói đi.",
        english: "Okay, say it.",
        pronunciation: "oo, ban noy di",
      },
      {
        speaker: "A",
        vietnamese: "Tôi quý bạn, nhưng không thấy cảm giác hẹn hò.",
        english: "I respect you, but I do not feel a dating connection.",
        pronunciation: "toy quy ban, nyung khong thay kam ziak hen ho",
      },
      {
        speaker: "B",
        vietnamese: "Buồn chút, nhưng cảm ơn vì nói rõ.",
        english: "That stings a little, but thank you for being clear.",
        pronunciation: "buon chut, nyung kam un vi noy ro",
      },
    ],
    cultural_note:
      "A clear, kind ending often hurts less than vague replies that slowly disappear.",
    tip:
      "Use tôi quý bạn to preserve dignity without implying romantic interest.",
  },
  {
    id: 111,
    level: "B1",
    title_en: "Workplace Burnout",
    subtitle: "Explain exhaustion without sounding unreliable.",
    intro:
      "These phrases help you talk about burnout in a practical workplace tone.",
    phrases: [
      {
        english: "I can still handle my work, but my current pace is not sustainable.",
        vietnamese: "Tôi vẫn xử lý được công việc, nhưng nhịp hiện tại không bền được.",
        pronunciation: "toy van xu ly duoc kong viec, nyung nhip hien tai khong ben duoc",
        context: "Use with a manager when you need a realistic pace.",
      },
      {
        english: "I need to adjust priorities before the quality starts dropping.",
        vietnamese: "Tôi cần điều chỉnh ưu tiên trước khi chất lượng bắt đầu đi xuống.",
        pronunciation: "toy kun dieu chinh uu tien truoc khi chat luong bat dau di xuong",
        context: "Use when asking to reprioritize work.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi muốn nói sớm về tải công việc hiện tại.",
        english: "I want to speak early about my current workload.",
        pronunciation: "toy mwon noy som ve tai kong viec hien tai",
      },
      {
        speaker: "B",
        vietnamese: "Có vấn đề gì không?",
        english: "Is there a problem?",
        pronunciation: "ko van de zi khong",
      },
      {
        speaker: "A",
        vietnamese: "Chưa hỏng, nhưng nếu giữ nhịp này thì chất lượng sẽ giảm.",
        english: "Nothing is broken yet, but if we keep this pace, quality will drop.",
        pronunciation: "chua hong, nyung new zu nhip nai thi chat luong se zam",
      },
      {
        speaker: "B",
        vietnamese: "Vậy mình xem lại ưu tiên tuần này.",
        english: "Then let us review this week's priorities.",
        pronunciation: "vay minh xem lai uu tien tuan nai",
      },
    ],
    cultural_note:
      "In many workplaces, burnout is easier to discuss through quality, priorities, and sustainability than emotions alone.",
    tip:
      "Use không bền được when you need to say a pace cannot continue.",
  },
  {
    id: 112,
    level: "B1",
    title_en: "Impossible Deadline",
    subtitle: "Push back on timing without rejecting responsibility.",
    intro:
      "Use these lines when a deadline is too tight and you need to negotiate scope or time.",
    phrases: [
      {
        english: "With the current scope, this deadline is risky.",
        vietnamese: "Với phạm vi hiện tại, hạn này khá rủi ro.",
        pronunciation: "voi fam vi hien tai, han nai kha rui ro",
        context: "Use when the timeline may create quality or delivery risk.",
      },
      {
        english: "If we need it by Friday, we should reduce the scope clearly.",
        vietnamese: "Nếu cần xong trước thứ Sáu, mình nên giảm phạm vi cho rõ.",
        pronunciation: "new kun xong truoc thu sau, minh nen zam fam vi cho ro",
        context: "Use when offering a practical tradeoff.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Việc này có thể xong trong hai ngày không?",
        english: "Can this be done in two days?",
        pronunciation: "viec nai ko the xong trong hai ngay khong",
      },
      {
        speaker: "B",
        vietnamese: "Nếu giữ đủ phạm vi thì hơi rủi ro.",
        english: "If we keep the full scope, it is a bit risky.",
        pronunciation: "new zu du fam vi thi hoy rui ro",
      },
      {
        speaker: "A",
        vietnamese: "Vậy phương án nào ổn hơn?",
        english: "Then what option is better?",
        pronunciation: "vay fuong an nao on hon",
      },
      {
        speaker: "B",
        vietnamese: "Mình chốt phần cần nhất trước, phần còn lại để sang tuần.",
        english: "We lock the most necessary part first and move the rest to next week.",
        pronunciation: "minh chot phan kun nyat truoc, phan kon lai de sang tuan",
      },
    ],
    cultural_note:
      "A practical tradeoff sounds better than a flat no in most workplace conversations.",
    tip:
      "Use phạm vi and rủi ro to sound calm, specific, and professional.",
  },
  {
    id: 113,
    level: "B1",
    title_en: "Pushing Back Politely",
    subtitle: "Disagree with a direction while staying constructive.",
    intro:
      "These phrases help you raise concerns without sounding negative or defensive.",
    phrases: [
      {
        english: "I understand the direction, but I am worried about one part.",
        vietnamese: "Tôi hiểu hướng đó, nhưng tôi hơi lo một phần.",
        pronunciation: "toy hieu huong do, nyung toy hoy lo mot phan",
        context: "Use before giving a concern in a meeting.",
      },
      {
        english: "Can I suggest a safer version of this idea?",
        vietnamese: "Tôi đề xuất một phiên bản an toàn hơn của ý này được không?",
        pronunciation: "toy de xuat mot fien ban an toan hon kua y nai duoc khong",
        context: "Use when offering an alternative instead of only criticizing.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mình sẽ launch toàn bộ vào tuần sau.",
        english: "We will launch everything next week.",
        pronunciation: "minh se launch toan bo vao tuan sau",
      },
      {
        speaker: "B",
        vietnamese: "Tôi hiểu mục tiêu, nhưng tôi hơi lo phần kiểm thử.",
        english: "I understand the goal, but I am a little worried about testing.",
        pronunciation: "toy hieu muc tieu, nyung toy hoy lo phan kiem thu",
      },
      {
        speaker: "A",
        vietnamese: "Bạn nghĩ nên làm sao?",
        english: "What do you think we should do?",
        pronunciation: "ban nghi nen lam sao",
      },
      {
        speaker: "B",
        vietnamese: "Mình launch từng phần nhỏ để nếu có lỗi thì dễ xử lý hơn.",
        english: "We launch in smaller parts so if there is a bug, it is easier to handle.",
        pronunciation: "minh launch tung phan nyo de new ko loi thi ze xu ly hon",
      },
    ],
    cultural_note:
      "Soft concern plus concrete alternative is often easier to receive than direct opposition.",
    tip:
      "Use tôi hơi lo một phần to open a concern without making it sound like a rejection.",
  },
  {
    id: 114,
    level: "B1",
    title_en: "Coworker Tension",
    subtitle: "Address awkwardness before it becomes office drama.",
    intro:
      "Use these lines when a coworker relationship feels cold, unclear, or passive-aggressive.",
    phrases: [
      {
        english: "I feel some tension between us, and I would rather clear it up directly.",
        vietnamese: "Tôi thấy giữa mình có chút căng, nên tôi muốn nói rõ thay vì để vậy.",
        pronunciation: "toy thay zua minh ko chut kang, nen toy mwon noy ro thay vi de vay",
        context: "Use when you want to address awkwardness early.",
      },
      {
        english: "If I missed something, please tell me. I do not want to guess.",
        vietnamese: "Nếu tôi có sót gì thì bạn nói giúp tôi, tôi không muốn đoán mò.",
        pronunciation: "new toy ko sot zi thi ban noy zup toy, toy khong mwon doan mo",
        context: "Use when a coworker seems upset but has not said why.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mấy ngày nay tôi thấy mình nói chuyện hơi gượng.",
        english: "These past few days I feel like our conversations have been a little stiff.",
        pronunciation: "may ngay nay toy thay minh noy chuyen hoy guong",
      },
      {
        speaker: "B",
        vietnamese: "Tôi cũng có cảm giác vậy.",
        english: "I felt that too.",
        pronunciation: "toy kung ko kam ziak vay",
      },
      {
        speaker: "A",
        vietnamese: "Nếu có gì tôi làm chưa ổn, bạn nói thẳng nhưng nhẹ giúp tôi nha.",
        english: "If I did something poorly, please tell me directly but gently.",
        pronunciation: "new ko zi toy lam chua on, ban noy thang nyung nhe zup toy nha",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, có một chuyện trong buổi họp hôm đó.",
        english: "Okay, there was one thing in that meeting.",
        pronunciation: "oo, ko mot chuyen trong buoi hop hom do",
      },
    ],
    cultural_note:
      "Workplace tension in Vietnamese settings may stay indirect for a long time unless someone opens a face-saving path.",
    tip:
      "Use nói thẳng nhưng nhẹ to invite honesty without inviting harshness.",
  },
  {
    id: 115,
    level: "B1",
    title_en: "Asking For Help At Work",
    subtitle: "Ask for support without sounding helpless.",
    intro:
      "These phrases help you ask for guidance, review, or backup in a mature way.",
    phrases: [
      {
        english: "I have tried two approaches, but I am still stuck at this point.",
        vietnamese: "Tôi đã thử hai cách, nhưng vẫn bị kẹt ở chỗ này.",
        pronunciation: "toy da thu hai kach, nyung van bi ket uh cho nai",
        context: "Use when asking for help after showing effort.",
      },
      {
        english: "Could you help me check my thinking, not solve the whole thing for me?",
        vietnamese: "Bạn giúp tôi kiểm tra hướng nghĩ thôi, không cần làm hết giúp tôi đâu.",
        pronunciation: "ban zup toy kiem tra huong nghi thoy, khong kun lam het zup toy dau",
        context: "Use when you want guidance while keeping ownership.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi bị kẹt chỗ này, nhưng không muốn đẩy việc qua cho bạn.",
        english: "I am stuck here, but I do not want to push the work onto you.",
        pronunciation: "toy bi ket cho nai, nyung khong mwon day viec qua cho ban",
      },
      {
        speaker: "B",
        vietnamese: "Bạn đã thử gì rồi?",
        english: "What have you tried already?",
        pronunciation: "ban da thu zi roy",
      },
      {
        speaker: "A",
        vietnamese: "Tôi thử hai hướng này. Bạn xem giúp tôi sai ở logic nào được không?",
        english: "I tried these two directions. Could you help me see where the logic is wrong?",
        pronunciation: "toy thu hai huong nai, ban xem zup toy sai uh logic nao duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Được, gửi tôi xem nhanh.",
        english: "Sure, send it and I will take a quick look.",
        pronunciation: "duoc, gui toy xem nhanh",
      },
    ],
    cultural_note:
      "Showing what you already tried makes a help request feel responsible rather than passive.",
    tip:
      "Use kiểm tra hướng nghĩ when you want mentoring, not handoff.",
  },
  {
    id: 116,
    level: "B1",
    title_en: "Resigning Gracefully",
    subtitle: "Leave a job without burning bridges.",
    intro:
      "Use these lines when you need to resign, transition work, and keep the relationship respectful.",
    phrases: [
      {
        english: "This was not an easy decision, and I am grateful for what I learned here.",
        vietnamese: "Đây không phải quyết định dễ dàng, và tôi biết ơn những gì đã học được ở đây.",
        pronunciation: "day khong phai quyet dinh ze zang, va toy biet un nhung zi da hoc duoc uh day",
        context: "Use when opening a resignation conversation.",
      },
      {
        english: "I want to hand things over clearly so the team is not left struggling.",
        vietnamese: "Tôi muốn bàn giao rõ ràng để team không bị chới với.",
        pronunciation: "toy mwon ban giao ro rang de team khong bi choi voi",
        context: "Use when showing responsibility during transition.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tôi muốn báo trước là tôi đã quyết định nghỉ.",
        english: "I want to let you know in advance that I have decided to resign.",
        pronunciation: "toy mwon bao truoc la toy da quyet dinh nghi",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì làm bạn không hài lòng à?",
        english: "Is there something that made you unhappy?",
        pronunciation: "ko chuyen zi lam ban khong hai long a",
      },
      {
        speaker: "A",
        vietnamese: "Có vài lý do cá nhân và hướng phát triển mới. Tôi vẫn rất biết ơn team.",
        english: "There are a few personal reasons and a new direction for growth. I am still very grateful to the team.",
        pronunciation: "ko vai ly zo ka nhan va huong fat trien moi, toy van rat biet un team",
      },
      {
        speaker: "B",
        vietnamese: "Vậy mình lên kế hoạch bàn giao cho ổn.",
        english: "Then let us make a transition plan properly.",
        pronunciation: "vay minh len ke hoach ban giao cho on",
      },
    ],
    cultural_note:
      "Vietnamese resignation conversations often value gratitude and smooth handover as much as the formal notice.",
    tip:
      "Use bàn giao rõ ràng to keep the focus on responsibility, not drama.",
  },
  {
    id: 117,
    level: "B1",
    title_en: "Financial Stress With A Partner",
    subtitle: "Talk about money anxiety without blaming.",
    intro:
      "These lines help couples discuss money when both love and fear are present.",
    phrases: [
      {
        english: "When money gets tight, I get quiet, but that does not mean I blame you.",
        vietnamese: "Khi tiền bạc căng, tôi hay im lặng, nhưng không có nghĩa là tôi trách bạn.",
        pronunciation: "khi tien bak kang, toy hay im lang, nyung khong ko nghia la toy trach ban",
        context: "Use when your stress response looks like distance.",
      },
      {
        english: "Can we look at the numbers together before both of us panic separately?",
        vietnamese: "Mình xem số liệu cùng nhau trước khi mỗi người tự hoảng được không?",
        pronunciation: "minh xem so lieu kung nhau truoc khi moi nguoi tu hoang duoc khong",
        context: "Use when asking for shared problem-solving.",
      },
    ],
    cultural_note:
      "Money conversations can quickly become about dignity. Keep the focus on shared reality, not personal failure.",
    tip:
      "Use cùng nhau to lower defensiveness and remind both people they are on the same side.",
  },
  {
    id: 118,
    level: "B1",
    title_en: "Splitting Bills Awkwardly",
    subtitle: "Handle payment without resentment or embarrassment.",
    intro:
      "Use these phrases when paying, splitting, or treating someone needs a little tact.",
    phrases: [
      {
        english: "Let us split this one; next time one of us can treat if it feels natural.",
        vietnamese: "Bữa này mình chia nha, lần sau ai mời cũng được nếu thấy tự nhiên.",
        pronunciation: "bua nai minh chia nha, lan sau ai moi kung duoc new thay tu nhien",
        context: "Use on dates or with friends when you want low pressure.",
      },
      {
        english: "I appreciate the offer, but I feel more comfortable paying my part.",
        vietnamese: "Tôi rất quý ý tốt của bạn, nhưng tôi thấy thoải mái hơn khi trả phần của mình.",
        pronunciation: "toy rat quy y tot kua ban, nyung toy thay thoai mai hon khi tra phan kua minh",
        context: "Use when someone insists on paying and you want a gentle boundary.",
      },
    ],
    cultural_note:
      "Paying can carry care, status, romance, or obligation. A light tone helps avoid awkwardness.",
    tip:
      "Use bữa này mình chia nha when you want the moment to feel simple and uncharged.",
  },
  {
    id: 119,
    level: "B1",
    title_en: "Lending Money Boundaries",
    subtitle: "Protect a relationship when money is requested.",
    intro:
      "These lines help you say yes, no, or not that much without damaging trust.",
    phrases: [
      {
        english: "I care about you, but lending money is difficult for me right now.",
        vietnamese: "Tôi thương bạn, nhưng chuyện cho mượn tiền lúc này hơi khó với tôi.",
        pronunciation: "toy thuong ban, nyung chuyen cho muon tien luk nai hoy kho voi toy",
        context: "Use when refusing a loan but keeping warmth.",
      },
      {
        english: "I can help a smaller amount, and I need us to be clear about repayment.",
        vietnamese: "Tôi giúp được một khoản nhỏ hơn, và mình cần rõ chuyện trả lại.",
        pronunciation: "toy zup duoc mot khoan nyo hon, va minh kun ro chuyen tra lai",
        context: "Use when agreeing with a clear limit.",
      },
    ],
    cultural_note:
      "Money loans can quietly change friendships. Clarity protects the relationship more than vague generosity.",
    tip:
      "Use khoản nhỏ hơn if you can help a little but not the full amount.",
  },
  {
    id: 120,
    level: "B1",
    title_en: "Supporting Someone Unemployed",
    subtitle: "Encourage without making them feel ashamed.",
    intro:
      "Use these phrases when a friend or relative is job hunting and feeling judged.",
    phrases: [
      {
        english: "Not having a job right now does not erase your value.",
        vietnamese: "Hiện tại chưa có việc không có nghĩa là giá trị của bạn mất đi.",
        pronunciation: "hien tai chua ko viec khong ko nghia la gia tri kua ban mat di",
        context: "Use when someone feels ashamed about unemployment.",
      },
      {
        english: "If you want, I can help you think through next steps, not pressure you.",
        vietnamese: "Nếu bạn muốn, tôi có thể cùng bạn nghĩ bước tiếp theo, chứ không ép bạn.",
        pronunciation: "new ban mwon, toy ko the kung ban nghi buoc tiep theo, chu khong ep ban",
        context: "Use when offering practical support gently.",
      },
    ],
    cultural_note:
      "Job status can feel tied to family face. Support should reduce shame before strategy.",
    tip:
      "Use nếu bạn muốn to avoid turning care into pressure.",
  },
  {
    id: 121,
    level: "B1",
    title_en: "Heritage Identity: Feeling In-Between",
    subtitle: "Talk about belonging to more than one world.",
    intro:
      "These lines are for heritage speakers who feel Vietnamese and not Vietnamese enough at the same time.",
    phrases: [
      {
        english: "Sometimes I feel too Vietnamese in one place and not Vietnamese enough in another.",
        vietnamese: "Đôi khi tôi thấy mình quá Việt ở một nơi, mà lại không đủ Việt ở nơi khác.",
        pronunciation: "doi khi toy thay minh qua viet uh mot noi, ma lai khong du viet uh noi khak",
        context: "Use when describing in-between identity.",
      },
      {
        english: "I am trying to reconnect without pretending I grew up the same way.",
        vietnamese: "Tôi đang cố kết nối lại, nhưng không muốn giả vờ là mình lớn lên giống mọi người.",
        pronunciation: "toy dang ko ket noi lai, nyung khong mwon za vo la minh lon len zong moi nguoi",
        context: "Use when talking about heritage language or culture honestly.",
      },
    ],
    cultural_note:
      "Heritage identity often includes love, loss, embarrassment, and longing in the same sentence.",
    tip:
      "Use không đủ Việt to name the feeling directly without turning it into self-hate.",
  },
  {
    id: 122,
    level: "B1",
    title_en: "Speaking Vietnamese With Relatives",
    subtitle: "Handle correction, embarrassment, and trying again.",
    intro:
      "Use these lines when you want to practice Vietnamese with family but feel nervous.",
    phrases: [
      {
        english: "Please correct me gently; I want to learn, but I get embarrassed easily.",
        vietnamese: "Mọi người sửa nhẹ giúp con nha, con muốn học nhưng dễ ngại lắm.",
        pronunciation: "moi nguoi sua nhe zup kon nha, kon mwon hoc nyung ze ngai lam",
        context: "Use before speaking Vietnamese with relatives.",
      },
      {
        english: "I understand more than I can say, so please give me a little time.",
        vietnamese: "Con hiểu nhiều hơn con nói được, nên cho con thêm chút thời gian nha.",
        pronunciation: "kon hieu nhieu hon kon noy duoc, nen cho kon them chut thoi gian nha",
        context: "Use when relatives expect faster speaking.",
      },
    ],
    cultural_note:
      "Family correction can feel loving to elders and humiliating to learners. Naming the need helps.",
    tip:
      "Use sửa nhẹ giúp con to invite correction without making it public embarrassment.",
  },
  {
    id: 123,
    level: "B1",
    title_en: "Feeling Judged At Community Events",
    subtitle: "Describe social pressure without sounding hostile.",
    intro:
      "These phrases help when community gatherings feel warm and stressful at the same time.",
    phrases: [
      {
        english: "I like seeing everyone, but sometimes I feel like I am being evaluated.",
        vietnamese: "Tôi thích gặp mọi người, nhưng đôi khi có cảm giác mình đang bị đánh giá.",
        pronunciation: "toy thik gap moi nguoi, nyung doi khi ko kam ziak minh dang bi danh zia",
        context: "Use when explaining discomfort at community events.",
      },
      {
        english: "I know people may not mean harm, but the questions still feel heavy.",
        vietnamese: "Tôi biết mọi người có thể không có ý xấu, nhưng mấy câu hỏi đó vẫn nặng.",
        pronunciation: "toy biet moi nguoi ko the khong ko y xau, nyung may kau hoy do van nang",
        context: "Use when intrusive questions are framed as care.",
      },
    ],
    cultural_note:
      "Vietnamese community events can mix belonging with comparison, curiosity, and social pressure.",
    tip:
      "Use không có ý xấu to keep the critique soft while still naming impact.",
  },
  {
    id: 124,
    level: "B1",
    title_en: "Accent Shame",
    subtitle: "Talk about pronunciation insecurity honestly.",
    intro:
      "Use these lines when accent, mistakes, or laughter make speaking Vietnamese feel vulnerable.",
    phrases: [
      {
        english: "When people laugh at my pronunciation, even kindly, I freeze.",
        vietnamese: "Khi người ta cười cách tôi phát âm, dù là cười vui, tôi vẫn bị khựng lại.",
        pronunciation: "khi nguoi ta kuoi kach toy fat am, du la kuoi vui, toy van bi khung lai",
        context: "Use when explaining why correction needs care.",
      },
      {
        english: "I am not ashamed of Vietnamese; I am ashamed of not sounding like I belong.",
        vietnamese: "Tôi không xấu hổ vì tiếng Việt, tôi xấu hổ vì nghe như mình không thuộc về.",
        pronunciation: "toy khong xau ho vi tieng viet, toy xau ho vi nghe nhu minh khong thuoc ve",
        context: "Use when describing a deeper heritage-language wound.",
      },
    ],
    cultural_note:
      "Accent is not just sound. For many learners it touches identity, family, and belonging.",
    tip:
      "Use bị khựng lại for the natural feeling of freezing mid-sentence.",
  },
  {
    id: 125,
    level: "B1",
    title_en: "Internet Slang And Gentle Teasing",
    subtitle: "Understand casual Vietnamese online tone.",
    intro:
      "These phrases help you handle jokes, slang, and teasing in group chats without sounding stiff.",
    phrases: [
      {
        english: "Are you teasing me or being serious? I cannot read the tone.",
        vietnamese: "Bạn đang chọc tôi hay nói nghiêm túc vậy? Tôi đọc giọng không ra.",
        pronunciation: "ban dang chok toy hay noy nghiem tuk vay, toy dok zong khong ra",
        context: "Use in chat when tone is unclear.",
      },
      {
        english: "That sounded a little harsh in text, but maybe I am reading it wrong.",
        vietnamese: "Nhắn vậy nghe hơi gắt, nhưng chắc tôi hiểu sai giọng cũng nên.",
        pronunciation: "nhan vay nghe hoy gat, nyung chak toy hieu sai zong kung nen",
        context: "Use to flag tone without escalating.",
      },
    ],
    cultural_note:
      "Vietnamese texting often uses teasing, particles, and shorthand that can sound sharper than intended.",
    tip:
      "Use chắc tôi hiểu sai giọng cũng nên to leave room for misunderstanding.",
  },
  {
    id: 126,
    level: "B1",
    title_en: "Group Chat Misunderstanding",
    subtitle: "Repair tone when a message lands badly.",
    intro:
      "Use these lines when a quick message causes awkwardness in a family, friend, or work chat.",
    phrases: [
      {
        english: "I reread my message and realized it sounded colder than I meant.",
        vietnamese: "Tôi đọc lại tin nhắn mới thấy nó lạnh hơn ý tôi nhiều.",
        pronunciation: "toy dok lai tin nhan moi thay no lanh hon y toy nhieu",
        context: "Use when repairing a text tone mistake.",
      },
      {
        english: "I meant to be brief, not dismissive.",
        vietnamese: "Ý tôi là nói cho gọn, chứ không phải xem nhẹ bạn.",
        pronunciation: "y toy la noy cho gon, chu khong phai xem nhe ban",
        context: "Use when a short message sounded rude.",
      },
    ],
    cultural_note:
      "Short Vietnamese replies can feel efficient or cold depending on relationship and timing.",
    tip:
      "Use đọc lại tin nhắn mới thấy to take responsibility without overdramatizing.",
  },
  {
    id: 127,
    level: "B1",
    title_en: "Avoiding Gossip Gracefully",
    subtitle: "Step out of gossip without sounding superior.",
    intro:
      "These phrases help you keep boundaries around gossip while preserving the social mood.",
    phrases: [
      {
        english: "I do not know the full story, so I do not want to judge too quickly.",
        vietnamese: "Tôi không biết hết câu chuyện, nên không muốn phán xét vội.",
        pronunciation: "toy khong biet het kau chuyen, nen khong mwon fan zet voi",
        context: "Use when people ask for your opinion about someone else.",
      },
      {
        english: "Let us leave that part aside; I do not want to talk behind their back too much.",
        vietnamese: "Mình bỏ qua phần đó đi, tôi không muốn nói sau lưng người ta nhiều quá.",
        pronunciation: "minh bo qua phan do di, toy khong mwon noy sau lung nguoi ta nhieu qua",
        context: "Use to redirect a gossip thread.",
      },
    ],
    cultural_note:
      "A gentle redirect works better than moralizing, especially in close social groups.",
    tip:
      "Use không biết hết câu chuyện to leave the conversation without accusing anyone.",
  },
  {
    id: 128,
    level: "B1",
    title_en: "A Soft Implied No",
    subtitle: "Recognize and give indirect refusals.",
    intro:
      "Use these lines when Vietnamese communication is indirect and the real answer is probably no.",
    phrases: [
      {
        english: "Let me see first usually means the answer is not certain.",
        vietnamese: "\"Để tôi xem đã\" thường có nghĩa là chưa chắc được.",
        pronunciation: "de toy xem da thuong ko nghia la chua chak duoc",
        context: "Use when explaining a soft Vietnamese refusal.",
      },
      {
        english: "I do not want to say no too bluntly, but I probably cannot make it.",
        vietnamese: "Tôi không muốn từ chối thẳng quá, nhưng chắc tôi không đi được.",
        pronunciation: "toy khong mwon tu choi thang qua, nyung chak toy khong di duoc",
        context: "Use when you need to make the implied no clearer.",
      },
    ],
    cultural_note:
      "Indirect no protects face, but it can confuse learners who expect direct answers.",
    tip:
      "Listen for chắc, để xem, hơi khó, and lần sau nha as soft no signals.",
  },
  {
    id: 129,
    level: "B1",
    title_en: "When Someone Says They Are Okay",
    subtitle: "Hear the emotion behind ổn.",
    intro:
      "These lines help you respond when someone says they are okay but does not seem okay.",
    phrases: [
      {
        english: "You say you are okay, but your voice sounds tired.",
        vietnamese: "Bạn nói là ổn, nhưng giọng bạn nghe mệt lắm.",
        pronunciation: "ban noy la on, nyung zong ban nghe met lam",
        context: "Use gently when someone's tone says more than their words.",
      },
      {
        english: "I will not push, but I am here if you want to say the real version.",
        vietnamese: "Tôi không ép đâu, nhưng nếu bạn muốn nói bản thật hơn thì tôi ở đây.",
        pronunciation: "toy khong ep dau, nyung new ban mwon noy ban that hon thi toy uh day",
        context: "Use when giving someone space to open up.",
      },
    ],
    cultural_note:
      "Ổn can mean fine, surviving, leave me alone, or please ask once more. Tone matters.",
    tip:
      "Use bản thật hơn for a modern, natural way to invite more honesty.",
  },
  {
    id: 130,
    level: "B1",
    title_en: "Comforting After A Breakup",
    subtitle: "Be present without insulting the ex or rushing healing.",
    intro:
      "Use these phrases when a friend is grieving a relationship and needs dignity.",
    phrases: [
      {
        english: "You can miss someone and still know leaving was the right choice.",
        vietnamese: "Bạn có thể nhớ một người mà vẫn biết rời đi là đúng.",
        pronunciation: "ban ko the nho mot nguoi ma van biet roi di la dung",
        context: "Use when someone doubts themselves after a breakup.",
      },
      {
        english: "I will not force you to be okay faster than you are.",
        vietnamese: "Tôi không bắt bạn phải ổn nhanh hơn nhịp của bạn.",
        pronunciation: "toy khong bat ban phai on nhanh hon nhip kua ban",
        context: "Use to comfort without rushing.",
      },
    ],
    cultural_note:
      "Good comfort does not always need criticism of the ex. Sometimes it needs permission to grieve.",
    tip:
      "Use nhịp của bạn to sound gentle and emotionally mature.",
  },
  {
    id: 131,
    level: "B1",
    title_en: "Difficult Advice Without Preaching",
    subtitle: "Tell someone the truth with care.",
    intro:
      "These lines help you give hard advice while keeping the other person respected.",
    phrases: [
      {
        english: "I may be wrong, but from the outside, this pattern looks painful for you.",
        vietnamese: "Có thể tôi sai, nhưng nhìn từ ngoài thì kiểu này đang làm bạn đau.",
        pronunciation: "ko the toy sai, nyung nhin tu ngoai thi kieu nai dang lam ban dau",
        context: "Use before giving a difficult observation.",
      },
      {
        english: "I am saying this because I care, not because I think I know better than you.",
        vietnamese: "Tôi nói vì thương bạn, không phải vì nghĩ mình biết hơn bạn.",
        pronunciation: "toy noy vi thuong ban, khong phai vi nghi minh biet hon ban",
        context: "Use when advice may sound intrusive.",
      },
    ],
    cultural_note:
      "Hard advice lands better when you lower your authority and raise your care.",
    tip:
      "Start with có thể tôi sai when the other person's life is more complex than what you see.",
  },
  {
    id: 132,
    level: "B1",
    title_en: "Repairing After Silence",
    subtitle: "Come back after distance without pretending nothing happened.",
    intro:
      "Use these phrases when a friendship or family relationship went quiet after conflict.",
    phrases: [
      {
        english: "I know I went quiet, and that probably hurt you.",
        vietnamese: "Tôi biết tôi đã im lặng, và chắc điều đó làm bạn buồn.",
        pronunciation: "toy biet toy da im lang, va chak dieu do lam ban buon",
        context: "Use when re-opening after withdrawal.",
      },
      {
        english: "I needed time, but I should have told you instead of disappearing.",
        vietnamese: "Tôi cần thời gian, nhưng lẽ ra tôi nên nói thay vì biến mất.",
        pronunciation: "toy kun thoi gian, nyung le ra toy nen noy thay vi bien mat",
        context: "Use when silence became hurtful.",
      },
    ],
    cultural_note:
      "Silence can protect you in the moment and damage trust over time.",
    tip:
      "Use lẽ ra tôi nên nói to take responsibility without shaming yourself endlessly.",
  },
  {
    id: 133,
    level: "B1",
    title_en: "Storytelling: A Childhood Memory",
    subtitle: "Tell a short emotional story naturally.",
    intro:
      "These phrases help you tell stories with setting, feeling, and reflection.",
    phrases: [
      {
        english: "When I was little, I did not understand it, but now I see why my parents were worried.",
        vietnamese: "Hồi nhỏ tôi không hiểu, nhưng bây giờ mới thấy vì sao ba mẹ lo.",
        pronunciation: "hoi nyo toy khong hieu, nyung bay gio moi thay vi sao ba me lo",
        context: "Use when telling a reflective childhood story.",
      },
      {
        english: "That memory is small, but it stayed with me for a long time.",
        vietnamese: "Kỷ niệm đó nhỏ thôi, nhưng nó ở lại trong tôi rất lâu.",
        pronunciation: "ky niem do nyo thoy, nyung no uh lai trong toy rat lau",
        context: "Use when a small moment had lasting emotional meaning.",
      },
    ],
    cultural_note:
      "Natural Vietnamese storytelling often moves between event, feeling, and lesson.",
    tip:
      "Use hồi nhỏ, lúc đó, bây giờ mới thấy to create a simple emotional timeline.",
  },
  {
    id: 134,
    level: "B1",
    title_en: "Explaining An Opinion In A Group",
    subtitle: "Speak with nuance when people disagree.",
    intro:
      "Use these lines when you want to share a view without sounding rigid.",
    phrases: [
      {
        english: "I see both sides, but I lean a little toward this option.",
        vietnamese: "Tôi thấy cả hai phía đều có lý, nhưng tôi hơi nghiêng về phương án này.",
        pronunciation: "toy thay ka hai fia deu ko ly, nyung toy hoy nghieng ve fuong an nai",
        context: "Use in group discussion when your opinion is nuanced.",
      },
      {
        english: "My concern is not the idea itself, but how we will carry it out.",
        vietnamese: "Điều tôi lo không phải là ý tưởng, mà là cách mình thực hiện.",
        pronunciation: "dieu toy lo khong phai la y tuong, ma la kach minh thuc hien",
        context: "Use to separate concept from execution.",
      },
    ],
    cultural_note:
      "A nuanced opinion often needs both acknowledgment and a clear position.",
    tip:
      "Use hơi nghiêng về when you have a preference but do not want to sound absolute.",
  },
  {
    id: 135,
    level: "B1",
    title_en: "Dinner Table Disagreement",
    subtitle: "Keep a family meal from turning into a debate.",
    intro:
      "These phrases help when a dinner conversation gets tense, personal, or repetitive.",
    phrases: [
      {
        english: "I think we see this differently, but I do not want dinner to turn into a fight.",
        vietnamese: "Con nghĩ mình nhìn chuyện này khác nhau, nhưng con không muốn bữa ăn thành cuộc cãi nhau.",
        pronunciation: "kon nghi minh nhin chuyen nai khak nhau, nyung kon khong mwon bua an thanh kuoc kai nhau",
        context: "Use to de-escalate a family meal.",
      },
      {
        english: "Can we leave this topic for another time and eat peacefully today?",
        vietnamese: "Mình để chuyện này lúc khác nói, hôm nay ăn cho yên được không?",
        pronunciation: "minh de chuyen nai luk khak noy, hom nay an cho yen duoc khong",
        context: "Use when the topic is ruining the mood.",
      },
    ],
    cultural_note:
      "Meals are relationship spaces. Protecting the meal can sometimes protect the relationship.",
    tip:
      "Use ăn cho yên for a natural, slightly tired but non-aggressive reset.",
  },
  {
    id: 136,
    level: "B1",
    title_en: "Caring For An Aging Parent",
    subtitle: "Talk about love, fatigue, and responsibility.",
    intro:
      "Use these lines when caregiving is loving but emotionally heavy.",
    phrases: [
      {
        english: "I love my parent, but caregiving still makes me tired sometimes.",
        vietnamese: "Tôi thương ba mẹ, nhưng chăm sóc lâu ngày vẫn có lúc tôi kiệt sức.",
        pronunciation: "toy thuong ba me, nyung cham sok lau ngay van ko luk toy kiet suc",
        context: "Use when admitting caregiver fatigue without guilt.",
      },
      {
        english: "I need help not because I do not care, but because I cannot do everything alone.",
        vietnamese: "Tôi cần người phụ không phải vì tôi không thương, mà vì tôi không thể làm hết một mình.",
        pronunciation: "toy kun nguoi phu khong phai vi toy khong thuong, ma vi toy khong the lam het mot minh",
        context: "Use when asking family for help.",
      },
    ],
    cultural_note:
      "Vietnamese caregiving ideals can make people hide exhaustion. Naming fatigue does not erase love.",
    tip:
      "Use không phải vì tôi không thương to protect the emotional meaning before asking for support.",
  },
  {
    id: 137,
    level: "B1",
    title_en: "Sibling Duty And Resentment",
    subtitle: "Talk about unequal family responsibility.",
    intro:
      "These phrases help when one sibling carries more family work or emotional labor than others.",
    phrases: [
      {
        english: "I do not mind helping, but I am starting to feel like the default person for everything.",
        vietnamese: "Tôi không ngại giúp, nhưng tôi bắt đầu thấy mình thành người mặc định cho mọi việc.",
        pronunciation: "toy khong ngai zup, nyung toy bat dau thay minh thanh nguoi mak dinh cho moi viec",
        context: "Use when family labor feels unequal.",
      },
      {
        english: "Can we divide this more clearly so it does not all fall on one person?",
        vietnamese: "Mình chia rõ hơn được không, để đừng dồn hết lên một người?",
        pronunciation: "minh chia ro hon duoc khong, de dung zon het len mot nguoi",
        context: "Use when asking siblings to share responsibility.",
      },
    ],
    cultural_note:
      "The oldest child, daughter, or local sibling may become the default helper without anyone naming it.",
    tip:
      "Use người mặc định for the modern feeling of being automatically assigned responsibility.",
  },
  {
    id: 138,
    level: "B1",
    title_en: "Raising A Bilingual Child",
    subtitle: "Talk about language, pressure, and connection.",
    intro:
      "These lines help parents discuss Vietnamese language learning without turning it into shame.",
    phrases: [
      {
        english: "I want Vietnamese to feel like connection, not punishment.",
        vietnamese: "Tôi muốn tiếng Việt là sự kết nối, chứ không phải hình phạt.",
        pronunciation: "toy mwon tieng viet la su ket noi, chu khong phai hinh fat",
        context: "Use when discussing how to teach a child Vietnamese.",
      },
      {
        english: "If we shame the child every time they make a mistake, they will stop trying.",
        vietnamese: "Nếu lần nào con sai mình cũng làm con xấu hổ, con sẽ ngừng cố gắng.",
        pronunciation: "new lan nao kon sai minh kung lam kon xau ho, kon se ngung ko gang",
        context: "Use when correcting older relatives' approach to language.",
      },
    ],
    cultural_note:
      "Language survival in diaspora depends on warmth as much as discipline.",
    tip:
      "Use kết nối, không phải hình phạt to explain the emotional goal clearly.",
  },
  {
    id: 139,
    level: "B1",
    title_en: "Dating After Divorce",
    subtitle: "Speak about a sensitive past with dignity.",
    intro:
      "Use these phrases when discussing divorce, dating again, or fear of judgment.",
    phrases: [
      {
        english: "That chapter was painful, but I do not want it to define my whole life.",
        vietnamese: "Giai đoạn đó rất đau, nhưng tôi không muốn nó định nghĩa cả đời mình.",
        pronunciation: "zai doan do rat dau, nyung toy khong mwon no dinh nghia ka doi minh",
        context: "Use when talking about divorce or a difficult past.",
      },
      {
        english: "I am open to loving again, but I move more carefully now.",
        vietnamese: "Tôi vẫn mở lòng để yêu lại, nhưng bây giờ tôi đi cẩn thận hơn.",
        pronunciation: "toy van mo long de yeu lai, nyung bay gio toy di kan than hon",
        context: "Use when explaining dating with more caution.",
      },
    ],
    cultural_note:
      "Divorce can carry extra social judgment in Vietnamese communities, especially for women and parents.",
    tip:
      "Use giai đoạn đó rather than labeling your whole identity around one relationship.",
  },
  {
    id: 140,
    level: "B1",
    title_en: "A Friend Cancels Often",
    subtitle: "Address repeated cancellation without accusing.",
    intro:
      "These lines help you talk about reliability, disappointment, and changing expectations.",
    phrases: [
      {
        english: "I know things come up, but when plans change often, I start feeling unimportant.",
        vietnamese: "Tôi biết ai cũng có việc đột xuất, nhưng khi kế hoạch đổi hoài, tôi bắt đầu thấy mình không quan trọng.",
        pronunciation: "toy biet ai kung ko viec dot xuat, nyung khi ke hoach doi hoai, toy bat dau thay minh khong quan trong",
        context: "Use when repeated cancellations hurt.",
      },
      {
        english: "If you are too busy these days, we can plan less often but more realistically.",
        vietnamese: "Nếu dạo này bạn quá bận, mình hẹn ít lại nhưng thực tế hơn cũng được.",
        pronunciation: "new zao nai ban qua ban, minh hen it lai nyung thuc te hon kung duoc",
        context: "Use when adjusting expectations rather than ending the friendship.",
      },
    ],
    cultural_note:
      "A practical adjustment can save a friendship from repeated disappointment.",
    tip:
      "Use thực tế hơn to make the new plan feel mature, not punitive.",
  },
  {
    id: 141,
    level: "B1",
    title_en: "Roommate Tension",
    subtitle: "Talk about shared space before resentment grows.",
    intro:
      "Use these phrases when cleanliness, noise, guests, or schedules are creating stress.",
    phrases: [
      {
        english: "I do not want to make this bigger than it is, but the shared space has been hard for me.",
        vietnamese: "Tôi không muốn làm lớn chuyện, nhưng phần không gian chung dạo này hơi khó chịu với tôi.",
        pronunciation: "toy khong mwon lam lon chuyen, nyung phan khong gian chung zao nai hoy kho chiu voi toy",
        context: "Use to open a roommate conversation gently.",
      },
      {
        english: "Can we agree on a small rule that both of us can actually keep?",
        vietnamese: "Mình thống nhất một quy định nhỏ mà cả hai thật sự làm được nha?",
        pronunciation: "minh thong nhat mot quy dinh nyo ma ka hai that su lam duoc nha",
        context: "Use when making a realistic house rule.",
      },
    ],
    cultural_note:
      "Shared-space conflict often improves with small clear agreements rather than big moral speeches.",
    tip:
      "Use không muốn làm lớn chuyện to show you are trying to stay reasonable.",
  },
  {
    id: 142,
    level: "B1",
    title_en: "Neighbor Noise Complaint",
    subtitle: "Complain politely but clearly.",
    intro:
      "Use these lines when you need to complain about noise without escalating the relationship.",
    phrases: [
      {
        english: "I am sorry to bother you, but the noise after midnight has been hard for my family.",
        vietnamese: "Xin lỗi vì làm phiền, nhưng tiếng ồn sau nửa đêm làm nhà tôi rất khó nghỉ.",
        pronunciation: "xin loy vi lam fien, nyung tieng on sau nua dem lam nha toy rat kho ngi",
        context: "Use when approaching a neighbor respectfully.",
      },
      {
        english: "Could we keep it quieter after this hour? I would really appreciate it.",
        vietnamese: "Sau giờ này mình giữ yên hơn một chút được không? Tôi cảm ơn nhiều lắm.",
        pronunciation: "sau gio nai minh zu yen hon mot chut duoc khong, toy kam un nhieu lam",
        context: "Use when asking for a specific change.",
      },
    ],
    cultural_note:
      "A respectful opening makes a complaint easier to receive, but the request still needs to be specific.",
    tip:
      "Use sau nửa đêm or sau giờ này so the complaint has a clear boundary.",
  },
  {
    id: 143,
    level: "B1",
    title_en: "Explaining Mental Stress To A Doctor",
    subtitle: "Describe stress symptoms clearly and calmly.",
    intro:
      "These phrases help you talk about stress, sleep, appetite, and emotional strain in practical Vietnamese.",
    phrases: [
      {
        english: "Lately I have been tired even after sleeping, and my chest feels tight when I am stressed.",
        vietnamese: "Dạo này tôi ngủ dậy vẫn mệt, và khi căng thẳng thì ngực hay bị nặng.",
        pronunciation: "zao nai toy ngu zay van met, va khi kang thang thi nguc hay bi nang",
        context: "Use when describing stress symptoms to a doctor.",
      },
      {
        english: "I am not sure if this is physical or stress-related, so I wanted to check.",
        vietnamese: "Tôi không chắc đây là vấn đề cơ thể hay do căng thẳng, nên muốn đi kiểm tra.",
        pronunciation: "toy khong chak day la van de ko the hay zo kang thang, nen mwon di kiem tra",
        context: "Use when explaining why you came in.",
      },
    ],
    cultural_note:
      "Practical symptom language can make mental stress easier to discuss in medical settings.",
    tip:
      "Name sleep, appetite, chest, stomach, and timeline. Concrete details help.",
  },
  {
    id: 144,
    level: "B1",
    title_en: "Talking About Therapy Or Emotional Support",
    subtitle: "Discuss mental health without sounding dramatic.",
    intro:
      "Use these phrases when you want to explain counseling, support, or emotional care in everyday language.",
    phrases: [
      {
        english: "I am not going because I am broken; I am going because I want to understand myself better.",
        vietnamese: "Tôi không đi vì tôi hư hỏng gì, tôi đi vì muốn hiểu mình hơn.",
        pronunciation: "toy khong di vi toy hu hong zi, toy di vi mwon hieu minh hon",
        context: "Use when explaining therapy to someone skeptical.",
      },
      {
        english: "Talking to someone neutral helps me sort out what is really happening.",
        vietnamese: "Nói chuyện với một người trung lập giúp tôi gỡ rối chuyện trong đầu.",
        pronunciation: "noy chuyen voi mot nguoi trung lap zup toy go roi chuyen trong dau",
        context: "Use when describing emotional support simply.",
      },
    ],
    cultural_note:
      "Mental health language can feel stigmatized. Everyday wording often works better than clinical labels.",
    tip:
      "Use gỡ rối chuyện trong đầu for a natural, non-academic way to describe emotional processing.",
  },
  {
    id: 145,
    level: "B1",
    title_en: "Comforting Someone At A Funeral",
    subtitle: "Offer condolences with quiet respect.",
    intro:
      "Use these lines when someone is grieving and you need words that are simple, respectful, and not too much.",
    phrases: [
      {
        english: "I do not know what to say, but I am very sorry for your loss.",
        vietnamese: "Tôi không biết nói gì cho đủ, nhưng tôi rất tiếc vì mất mát của gia đình bạn.",
        pronunciation: "toy khong biet noy zi cho du, nyung toy rat tiek vi mat mat kua gia dinh ban",
        context: "Use when offering condolences sincerely.",
      },
      {
        english: "If your family needs anything practical, please tell me.",
        vietnamese: "Nếu gia đình cần gì cụ thể, bạn cứ nói tôi biết nha.",
        pronunciation: "new gia dinh kun zi ku the, ban ku noy toy biet nha",
        context: "Use when offering practical help after a death.",
      },
    ],
    cultural_note:
      "In grief, simple and quiet usually lands better than trying to explain the loss.",
    tip:
      "Use không biết nói gì cho đủ when words feel inadequate but you still want to show care.",
  },
  {
    id: 146,
    level: "B1",
    title_en: "Everyday Polite Flow With Elders",
    subtitle: "Keep a conversation respectful but natural.",
    intro:
      "These phrases help you move through greetings, small questions, and soft exits with older Vietnamese speakers.",
    phrases: [
      {
        english: "Yes, I have been well. I have just been a bit busy with work lately.",
        vietnamese: "Dạ, con vẫn khỏe. Dạo này con chỉ hơi bận công việc một chút.",
        pronunciation: "ya, kon van khoe, zao nai kon chi hoy ban kong viec mot chut",
        context: "Use when an elder asks how you have been.",
      },
      {
        english: "I will let you rest now. I will visit again when I have a chance.",
        vietnamese: "Thôi con để cô chú nghỉ nha. Có dịp con ghé lại thăm.",
        pronunciation: "thoy kon de ko chu nghi nha, ko dip kon ghe lai tham",
        context: "Use when ending a polite visit or phone call.",
      },
    ],
    cultural_note:
      "Polite Vietnamese with elders is warm, indirect, and often uses small softeners like dạ, nha, and có dịp.",
    tip:
      "Use con with older adults when appropriate; it often sounds warmer than tôi.",
  },
  {
    id: 147,
    level: "B1",
    title_en: "When Mom Asks About Marriage Again",
    subtitle: "Deflect family pressure without slamming the door.",
    intro:
      "Use these lines when a parent keeps asking when you'll settle down. Stay warm, stay vague, do not over-explain.",
    phrases: [
      {
        english: "Mom, I get it, but I really am not ready yet.",
        vietnamese: "Mẹ ơi, con biết mà, nhưng thật sự con chưa sẵn sàng đâu.",
        pronunciation: "may oi, kon biet ma, nyung that su kon chua san sang dau",
        context: "Use when your mom asks again about marriage.",
      },
      {
        english: "If something happens, I will tell you, I promise.",
        vietnamese: "Có gì con kể mẹ liền, con hứa.",
        pronunciation: "ko zi kon ke may lien, kon hua",
        context: "Use to reassure her without giving a timeline.",
      },
      {
        english: "Please do not compare me with your friends' kids, okay?",
        vietnamese: "Mẹ đừng so con với con người ta nha mẹ.",
        pronunciation: "may dung so kon voi kon nguoi ta nha may",
        context: "Use to set a soft limit on comparisons.",
      },
      {
        english: "I love you, but this part of my life I want to handle quietly.",
        vietnamese: "Con thương mẹ, nhưng chuyện này con muốn tự lo một mình trước đã.",
        pronunciation: "kon thuong may, nyung chuyen nay kon mwon tu lo mot minh truoc da",
        context: "Use when you want to reassure love while asking for space.",
      },
    ],
    cultural_note:
      "Marriage pressure usually comes from love, not control. Pushing back hard often wounds; gentle vagueness lasts longer.",
    tip:
      "Use con người ta to name the comparison habit directly without naming a specific person.",
  },
  {
    id: 148,
    level: "B1",
    title_en: "Defending Your Career Choice",
    subtitle: "Stand by your path with parents who do not understand it.",
    intro:
      "Use these lines when your parents wanted a stable job and you chose something different. Do not argue facts; protect the relationship.",
    phrases: [
      {
        english: "I know it is not what you imagined for me.",
        vietnamese: "Con biết đây không phải là cái mà ba mẹ hình dung cho con đâu.",
        pronunciation: "kon biet day khong phai la kai ma ba may hinh zung cho kon dau",
        context: "Use to acknowledge their disappointment without arguing.",
      },
      {
        english: "I am not asking you to agree, I am asking you to trust me a little.",
        vietnamese: "Con không cần ba mẹ đồng ý, chỉ xin ba mẹ tin con một chút thôi.",
        pronunciation: "kon khong kun ba may dong y, chi xin ba may tin kon mot chut thoy",
        context: "Use when explaining a path they cannot fully accept.",
      },
      {
        english: "If I fail, I will come home, but please let me try first.",
        vietnamese: "Nếu con thất bại, con sẽ về, nhưng xin ba mẹ để con thử trước đã.",
        pronunciation: "new kon that bai, kon se ve, nyung xin ba may de kon thu truoc da",
        context: "Use to reassure them you have an honest fallback plan.",
      },
      {
        english: "It is not that I do not listen, it is that I have to live this myself.",
        vietnamese: "Không phải con không nghe, mà là chuyện này con phải tự sống mới hiểu.",
        pronunciation: "khong phai kon khong nghe, ma la chuyen nay kon phai tu song moi hieu",
        context: "Use when they accuse you of not respecting their advice.",
      },
    ],
    cultural_note:
      "Vietnamese parents often equate stability with love. Choosing risk feels like rejecting their care, even when it is not.",
    tip:
      "Tự sống mới hiểu is a gentle but firm way of saying this is mine to live, not yours to decide.",
  },
  {
    id: 149,
    level: "B1",
    title_en: "Money Expectations From Extended Family",
    subtitle: "Handle requests without poisoning the relationship.",
    intro:
      "Use these phrases when an aunt, uncle, or cousin asks for money and you cannot or do not want to give it.",
    phrases: [
      {
        english: "Right now I am also tight, but let me see what I can do.",
        vietnamese: "Dạo này con cũng kẹt mà, để con tính lại xem sao đã.",
        pronunciation: "zao nay kon kung ket ma, de kon tinh lai xem sao da",
        context: "Use to soften a likely no without refusing on the spot.",
      },
      {
        english: "I can help a small amount, but not the full thing.",
        vietnamese: "Con phụ một ít được, chứ con không lo nổi hết đâu cô ơi.",
        pronunciation: "kon phu mot it duoc, chu kon khong lo noi het dau ko oi",
        context: "Use to set a partial limit without rejecting outright.",
      },
      {
        english: "I will let you know by Sunday so you can plan.",
        vietnamese: "Con trả lời cô trước Chủ Nhật để cô tính trước nha.",
        pronunciation: "kon tra loi ko truoc chu nhat de ko tinh truoc nha",
        context: "Use to buy time and signal you are taking it seriously.",
      },
      {
        english: "I am sorry, this time I really cannot.",
        vietnamese: "Lần này con xin lỗi cô, thật sự con không lo được.",
        pronunciation: "lan nay kon xin loi ko, that su kon khong lo duoc",
        context: "Use as a final, polite, full refusal.",
      },
    ],
    cultural_note:
      "Family money requests carry social weight. A clear no without warmth can feel like cutting ties; a vague yes builds resentment.",
    tip:
      "Use kẹt and không lo nổi to name limits without sounding stingy.",
  },
  {
    id: 150,
    level: "B1",
    title_en: "Setting Limits On A Child's Screen Time",
    subtitle: "Be firm, not angry, when the iPad becomes a fight.",
    intro:
      "Use these phrases as a parent setting a limit your child does not want to hear.",
    phrases: [
      {
        english: "Mom is not angry, but the rule today is the rule today.",
        vietnamese: "Mẹ không có giận, nhưng luật hôm nay là vậy đó con.",
        pronunciation: "may khong ko zan, nyung luat hom nay la vay do kon",
        context: "Use to hold a limit without escalating.",
      },
      {
        english: "Five more minutes, then we put the iPad away together.",
        vietnamese: "Năm phút nữa thôi, rồi mình cùng cất iPad nha con.",
        pronunciation: "nam phut nua thoy, roy minh kung kat iPad nha kon",
        context: "Use to land a limit with a small soft warning.",
      },
      {
        english: "Crying is okay, but the answer is still no for now.",
        vietnamese: "Con khóc cũng được, nhưng giờ vẫn là không nha con.",
        pronunciation: "kon khok kung duoc, nyung gio van la khong nha kon",
        context: "Use to validate emotion while keeping the limit.",
      },
      {
        english: "Tomorrow we can play again. Tonight body needs to rest.",
        vietnamese: "Mai mình chơi tiếp, tối nay cơ thể con phải nghỉ rồi.",
        pronunciation: "mai minh choi tiep, toi nay ko the kon phai nghi roy",
        context: "Use to reframe the limit as care for their body.",
      },
    ],
    cultural_note:
      "Vietnamese parenting is shifting; older styles use scolding, newer urban styles use calmer limits like these.",
    tip:
      "Khóc cũng được lets your child feel without you collapsing the limit.",
  },
  {
    id: 151,
    level: "B1",
    title_en: "When Grandma Overrides Your Parenting",
    subtitle: "Set the limit kindly without humiliating her.",
    intro:
      "Use these phrases when a grandparent gives the child something you said no to.",
    phrases: [
      {
        english: "Mom, I love that you spoil her, but please stop the candy at night.",
        vietnamese: "Mẹ thương cháu thì con biết, nhưng tối mẹ đừng cho kẹo nha mẹ.",
        pronunciation: "may thuong chau thi kon biet, nyung toi may dung cho keo nha may",
        context: "Use to ask grandma to stop a specific habit.",
      },
      {
        english: "When you said yes after I said no, it makes me look weak in front of her.",
        vietnamese: "Mẹ đồng ý sau khi con đã nói không, làm con khó nói chuyện với cháu.",
        pronunciation: "may dong y sau khi kon da noy khong, lam kon kho noy chuyen voi chau",
        context: "Use to name the impact without blaming.",
      },
      {
        english: "If you disagree with my rule, please tell me first, not her.",
        vietnamese: "Nếu mẹ không đồng ý với luật của con, mẹ nói riêng với con trước, đừng nói với cháu nha.",
        pronunciation: "new may khong dong y voi luat kua kon, may noy rieng voi kon truoc, dung noy voi chau nha",
        context: "Use to redirect disagreements away from the child.",
      },
      {
        english: "I really need us to be one team in front of the kid.",
        vietnamese: "Con thật sự cần nhà mình thống nhất trước mặt cháu.",
        pronunciation: "kon that su kun nha minh thong nhat truoc mat chau",
        context: "Use to ask for parenting alignment.",
      },
    ],
    cultural_note:
      "Grandparents traditionally have authority over discipline, so reframing this as teamwork lands better than telling them to stop.",
    tip:
      "Use thống nhất trước mặt cháu — it shifts the issue from authority to family unity.",
  },
  {
    id: 152,
    level: "B1",
    title_en: "Disagreeing With A Senior In A Meeting",
    subtitle: "Push back without losing face for either side.",
    intro:
      "Use these lines when a manager or older colleague says something you disagree with in front of others.",
    phrases: [
      {
        english: "Anh, I see your point, but I want to add one angle.",
        vietnamese: "Dạ anh, em hiểu ý anh, nhưng em xin bổ sung thêm một góc nữa.",
        pronunciation: "ya anh, em hieu y anh, nyung em xin bo sung them mot gok nua",
        context: "Use to start a polite disagreement with a senior.",
      },
      {
        english: "Maybe I am missing something, but the data we saw last week showed differently.",
        vietnamese: "Có thể em hiểu thiếu, nhưng số liệu tuần trước thấy khác một chút.",
        pronunciation: "ko the em hieu thieu, nyung so lieu tuan truoc thay khak mot chut",
        context: "Use to introduce a counter-fact without confrontation.",
      },
      {
        english: "Can we look at this part again before we decide?",
        vietnamese: "Mình xem lại đoạn này một lần nữa trước khi chốt được không anh?",
        pronunciation: "minh xem lai doan nay mot lan nua truoc khi chot duoc khong anh",
        context: "Use to slow down a decision without blocking it.",
      },
      {
        english: "I just do not want us to commit too fast.",
        vietnamese: "Em chỉ sợ mình quyết hơi vội thôi anh.",
        pronunciation: "em chi so minh kwet hoi voi thoy anh",
        context: "Use to frame the disagreement as protective, not oppositional.",
      },
    ],
    cultural_note:
      "Disagreeing publicly with a senior is risky. Framing it as I might be missing something is the safe entry.",
    tip:
      "Use bổ sung thêm to add rather than oppose; it preserves the senior's face.",
  },
  {
    id: 153,
    level: "B1",
    title_en: "Asking The Boss To Lighten The Workload",
    subtitle: "Name the limit without sounding lazy.",
    intro:
      "Use these lines when you cannot keep absorbing more without breaking.",
    phrases: [
      {
        english: "Anh, can I be honest with you for two minutes?",
        vietnamese: "Anh ơi, em xin nói thật với anh hai phút thôi được không.",
        pronunciation: "anh oi, em xin noy that voi anh hai phut thoy duoc khong",
        context: "Use to open a serious workload conversation.",
      },
      {
        english: "Right now I am juggling four things, and the quality is starting to slip.",
        vietnamese: "Hiện tại em đang gánh bốn việc cùng lúc, chất lượng bắt đầu đuối rồi anh.",
        pronunciation: "hien tai em dang ganh bon viec kung luk, chat luong bat dau duoy roy anh",
        context: "Use to name the impact, not just the load.",
      },
      {
        english: "Could we move one to next sprint, or get a hand from someone?",
        vietnamese: "Mình dời một việc qua sprint sau, hay nhờ ai phụ một tay được không anh?",
        pronunciation: "minh zoi mot viec kwa sprint sau, hai nho ai phu mot tai duoc khong anh",
        context: "Use to suggest a solution, not just complain.",
      },
      {
        english: "I do not want to drop the ball; that is why I am saying this early.",
        vietnamese: "Em không muốn để rớt việc, nên em nói sớm cho anh biết.",
        pronunciation: "em khong mwon de rot viec, nen em noy som cho anh biet",
        context: "Use to position yourself as responsible, not avoidant.",
      },
    ],
    cultural_note:
      "Bosses respect workers who flag overload early. Quietly drowning until you crash is read as carelessness, not toughness.",
    tip:
      "Use chất lượng đuối rồi to make burnout concrete and work-relevant, not personal.",
  },
  {
    id: 154,
    level: "B1",
    title_en: "Naming Burnout To A Close Friend",
    subtitle: "Say the real version without performing collapse.",
    intro:
      "Use these phrases when you need to admit to a friend that you are running on empty.",
    phrases: [
      {
        english: "I am okay, but I am tired in a way sleep does not fix.",
        vietnamese: "Tôi ổn, nhưng kiểu mệt này ngủ bao nhiêu cũng không hết.",
        pronunciation: "toy on, nyung kieu met nay ngu bao nhieu kung khong het",
        context: "Use to describe burnout in a way that sounds honest, not dramatic.",
      },
      {
        english: "Lately I do everything on autopilot, and I do not feel anything.",
        vietnamese: "Dạo này tôi làm gì cũng như cái máy, không thấy gì hết.",
        pronunciation: "zao nay toy lam zi kung nhu kai may, khong thay zi het",
        context: "Use when emotion has gone flat from exhaustion.",
      },
      {
        english: "I think I need to slow down before something breaks.",
        vietnamese: "Chắc tôi phải chậm lại trước khi gãy luôn.",
        pronunciation: "chak toy phai cham lai truoc khi gay luon",
        context: "Use when you are pre-empting a real crash.",
      },
      {
        english: "Thanks for asking. Most people do not, and I do not blame them.",
        vietnamese: "Cảm ơn bạn đã hỏi nha. Đa phần người ta không hỏi, mà tôi cũng không trách.",
        pronunciation: "kam un ban da hoi nha, da phan nguoi ta khong hoi, ma toy kung khong trach",
        context: "Use when a friend checks in and you want to honor it.",
      },
    ],
    cultural_note:
      "Vietnamese conversation often skips burnout because of stigma around mental fatigue. Naming it plainly to one trusted friend is increasingly common in young urban speakers.",
    tip:
      "Use ngủ bao nhiêu cũng không hết — it makes burnout legible without medicalizing it.",
  },
  {
    id: 155,
    level: "B1",
    title_en: "Saying No To Overtime On The Weekend",
    subtitle: "Decline without sounding uncommitted.",
    intro:
      "Use these phrases when work asks for your weekend and you need to protect it.",
    phrases: [
      {
        english: "Anh, this weekend I really cannot, I have something with family.",
        vietnamese: "Anh ơi, cuối tuần này em kẹt việc gia đình, không lên được anh.",
        pronunciation: "anh oi, kuoy tuan nay em ket viec gia dinh, khong len duoc anh",
        context: "Use to refuse weekend overtime with a soft reason.",
      },
      {
        english: "Monday morning early I will be in and finish it first thing.",
        vietnamese: "Sáng thứ Hai sớm em vào làm liền cho anh.",
        pronunciation: "sang thu hai som em vao lam lien cho anh",
        context: "Use to offer an alternative that respects the deadline.",
      },
      {
        english: "If it is really an emergency, please tell me what is on fire.",
        vietnamese: "Nếu có gì gấp lắm anh nói thẳng, em coi xem sắp xếp được không.",
        pronunciation: "new ko zi gap lam anh noy thang, em koy xem sap xep duoc khong",
        context: "Use to keep a small door open for true emergencies.",
      },
      {
        english: "I am not going to disappear, just need this weekend off.",
        vietnamese: "Em không bỏ việc đâu, chỉ là cuối tuần này em xin nghỉ thôi.",
        pronunciation: "em khong bo viec dau, chi la kuoy tuan nay em xin nghi thoy",
        context: "Use to reassure your boss about commitment.",
      },
    ],
    cultural_note:
      "Saying no flat out can damage relationships; offering a Monday alternative usually preserves both the boundary and the trust.",
    tip:
      "Use kẹt việc gia đình when you do not want to specify; it is socially respected and rarely questioned.",
  },
  {
    id: 156,
    level: "B1",
    title_en: "Texting After A First Date",
    subtitle: "Modern, warm, not too eager.",
    intro:
      "Use these lines when texting someone the day after meeting them. Casual register, no over-explanation.",
    phrases: [
      {
        english: "Hey, last night was fun. I had a good time with you.",
        vietnamese: "Ê, tối qua vui ghê, đi với bạn xong tâm trạng tốt hẳn.",
        pronunciation: "eh, toy kwa vui ghe, di voi ban xong tam trang tot han",
        context: "Use as an opener the day after a first date.",
      },
      {
        english: "If you are free this week, want to grab coffee?",
        vietnamese: "Tuần này rảnh không, đi cà phê không?",
        pronunciation: "tuan nay ranh khong, di cafe khong",
        context: "Use to suggest a low-pressure second meeting.",
      },
      {
        english: "No pressure if you are busy, just thought I would ask.",
        vietnamese: "Không sao nếu bận nha, mình hỏi cho biết thôi.",
        pronunciation: "khong sao new ban nha, minh hoi cho biet thoy",
        context: "Use to soften the ask and protect both sides.",
      },
      {
        english: "Either way, ride home safe last night?",
        vietnamese: "Mà tối qua về tới nhà an toàn chứ?",
        pronunciation: "ma toy kwa ve toy nha an toan chu",
        context: "Use to add care without making it heavy.",
      },
    ],
    cultural_note:
      "Modern Vietnamese dating texts are short, warm, with low ego. Long paragraphs early signal pressure.",
    tip:
      "Use ê, vui ghê, ghê for casual register; pair with a real follow-up question to avoid sounding like small talk.",
  },
  {
    id: 157,
    level: "B1",
    title_en: "Defining The Relationship",
    subtitle: "Have the where-is-this-going talk without panic.",
    intro:
      "Use these phrases when you need clarity about whether this is casual, exclusive, or going somewhere.",
    phrases: [
      {
        english: "I do not want to make this heavy, but I want to be clear.",
        vietnamese: "Mình không muốn làm nặng nề, mà mình muốn nói rõ một chút.",
        pronunciation: "minh khong mwon lam nang ne, ma minh mwon noy ro mot chut",
        context: "Use to open a defining conversation without pressure.",
      },
      {
        english: "For me, I think I want this to be just us.",
        vietnamese: "Phần mình thì mình muốn chỉ có hai đứa thôi.",
        pronunciation: "phan minh thi minh mwon chi ko hai dua thoy",
        context: "Use to ask for exclusivity in plain words.",
      },
      {
        english: "If you are not there yet, I want to know honestly.",
        vietnamese: "Nếu bạn chưa nghĩ tới đó, bạn cứ nói thật với mình nha.",
        pronunciation: "new ban chua nghi toi do, ban ku noy that voi minh nha",
        context: "Use to invite honesty without ambushing.",
      },
      {
        english: "Whatever you say, I am not going to be weird about it.",
        vietnamese: "Bạn trả lời sao mình cũng không có làm khó đâu.",
        pronunciation: "ban tra loi sao minh kung khong ko lam kho dau",
        context: "Use to lower the stakes for the other person.",
      },
    ],
    cultural_note:
      "Modern young Vietnamese borrow English DTR style but keep the warmth: hai đứa, không làm khó, nha. Dignity is key.",
    tip:
      "Use chỉ có hai đứa thôi as a soft-but-clear way of asking for exclusivity.",
  },
  {
    id: 158,
    level: "B1",
    title_en: "Letting Someone Down Kindly",
    subtitle: "Rejection that does not destroy a person.",
    intro:
      "Use these phrases when someone has feelings for you and you do not feel the same.",
    phrases: [
      {
        english: "I really appreciate you telling me; that took courage.",
        vietnamese: "Cảm ơn bạn đã nói thật với mình, mình biết để nói được vậy không dễ.",
        pronunciation: "kam un ban da noy that voi minh, minh biet de noy duoc vay khong de",
        context: "Use to honor the courage of someone confessing feelings.",
      },
      {
        english: "I do not feel the same, and I do not want to lie to you.",
        vietnamese: "Mình không có cùng cảm giác, và mình không muốn nói dối bạn.",
        pronunciation: "minh khong ko kung kam giak, va minh khong mwon noy zoy ban",
        context: "Use to be clear without harshness.",
      },
      {
        english: "I value our friendship, but I do not want to keep it just to be polite.",
        vietnamese: "Mình quý tình bạn này, nhưng mình không muốn giữ chỉ vì lịch sự.",
        pronunciation: "minh kwy tinh ban nay, nyung minh khong mwon giu chi vi lich su",
        context: "Use to be honest about whether the friendship can continue.",
      },
      {
        english: "Take time. If you need space, I will not push you.",
        vietnamese: "Bạn cứ từ từ, nếu cần khoảng cách thì mình không ép.",
        pronunciation: "ban ku tu tu, new kun khoang kak thi minh khong ep",
        context: "Use to give the other person room to recover.",
      },
    ],
    cultural_note:
      "Vietnamese rejection at its best preserves dignity. Vague avoidance feels worse than a clear, kind no.",
    tip:
      "Use không cùng cảm giác instead of không thích — it sounds adult, not dismissive.",
  },
  {
    id: 159,
    level: "B1",
    title_en: "When You Accidentally Offend Someone",
    subtitle: "Repair without overdoing it.",
    intro:
      "Use these phrases when you said something that landed wrong and you can see the other person flinch.",
    phrases: [
      {
        english: "Hold on, I think what I said came out wrong.",
        vietnamese: "Khoan, mình nói câu đó nghe hơi sai sai rồi.",
        pronunciation: "khoan, minh noy kau do nghe hoi sai sai roy",
        context: "Use to catch yourself in real time.",
      },
      {
        english: "I did not mean it the way it sounded, sorry.",
        vietnamese: "Mình không có ý nói kiểu đó đâu, xin lỗi nha.",
        pronunciation: "minh khong ko y noy kieu do dau, xin loi nha",
        context: "Use to apologize for tone without overexplaining.",
      },
      {
        english: "Did that hurt you? Be honest with me.",
        vietnamese: "Câu đó có làm bạn tổn thương không, nói thật mình nghe.",
        pronunciation: "kau do ko lam ban ton thuong khong, noy that minh nghe",
        context: "Use to invite the other person to name the hurt.",
      },
      {
        english: "Thanks for telling me. I will try to say it better next time.",
        vietnamese: "Cảm ơn bạn nói cho mình biết, lần sau mình diễn đạt khác đi.",
        pronunciation: "kam un ban noy cho minh biet, lan sau minh dien dat khak di",
        context: "Use to receive their feedback without defending.",
      },
    ],
    cultural_note:
      "Repair lands better when it is short and concrete, not a long apology that makes the hurt person comfort you.",
    tip:
      "Use sai sai rồi to catch yourself before the damage hardens.",
  },
  {
    id: 160,
    level: "B1",
    title_en: "Apologizing For Missing An Important Event",
    subtitle: "Real ownership, no excuses dressed as reasons.",
    intro:
      "Use these lines when you missed a friend's wedding, funeral, birthday, or major moment.",
    phrases: [
      {
        english: "I missed it, and I do not want to wrap it in excuses.",
        vietnamese: "Mình vắng mặt hôm đó, và mình không muốn lấy lý do để bao biện.",
        pronunciation: "minh vang mat hom do, va minh khong mwon lay ly zo de bao bien",
        context: "Use to open a real apology with ownership.",
      },
      {
        english: "I know an apology does not return that day.",
        vietnamese: "Mình biết xin lỗi cũng không lấy lại được ngày đó cho bạn.",
        pronunciation: "minh biet xin loi kung khong lay lai duoc ngay do cho ban",
        context: "Use to acknowledge that words do not undo absence.",
      },
      {
        english: "Tell me how you actually felt that day, I will listen.",
        vietnamese: "Bạn cứ kể mình nghe hôm đó bạn thật sự thấy thế nào, mình ngồi nghe.",
        pronunciation: "ban ku ke minh nghe hom do ban that su thay the nao, minh ngoy nghe",
        context: "Use to invite the friend to name the hurt fully.",
      },
      {
        english: "I want to be there better from now on, not just say so.",
        vietnamese: "Từ nay mình muốn có mặt thật sự, không chỉ nói thôi.",
        pronunciation: "tu nay minh mwon ko mat that su, khong chi noy thoy",
        context: "Use to commit to changed behavior, not just words.",
      },
    ],
    cultural_note:
      "Big apologies in Vietnamese hit harder when they are short, plain, and offer to listen — not when they are flowery.",
    tip:
      "Use không bao biện early; it signals to the listener that this is not a defensive apology.",
  },
  {
    id: 161,
    level: "B1",
    title_en: "Comforting When A Friend's Parent Is Sick",
    subtitle: "Be near without saying too much.",
    intro:
      "Use these lines when your friend's parent is hospitalized or seriously ill.",
    phrases: [
      {
        english: "I do not have words, but I am here for whatever you need.",
        vietnamese: "Mình không biết nói gì cho phải, nhưng có gì cần thì bạn cứ nói nha.",
        pronunciation: "minh khong biet noy zi cho phai, nyung ko zi kun thi ban ku noy nha",
        context: "Use when you do not want to fake comfort.",
      },
      {
        english: "Are you eating? Sleeping a little? Just checking on you, not the patient.",
        vietnamese: "Bạn ăn uống được không, ngủ chút nào không, mình hỏi bạn nha chứ không phải hỏi bệnh.",
        pronunciation: "ban an uong duoc khong, ngu chut nao khong, minh hoi ban nha chu khong phai hoi benh",
        context: "Use to direct care toward the caregiver, not just the patient.",
      },
      {
        english: "If you want company at the hospital, I can sit with you.",
        vietnamese: "Cần người ngồi cùng ở viện thì kêu mình, mình tới ngồi chung.",
        pronunciation: "kun nguoi ngoy kung u vien thi keu minh, minh toi ngoy chung",
        context: "Use to offer presence without forcing conversation.",
      },
      {
        english: "Whatever happens, you are not going through this alone.",
        vietnamese: "Dù chuyện ra sao, bạn không phải gánh một mình đâu.",
        pronunciation: "zu chuyen ra sao, ban khong phai ganh mot minh dau",
        context: "Use to anchor your friend during uncertainty.",
      },
    ],
    cultural_note:
      "Caregiver burnout is invisible in Vietnamese culture; asking how the caregiver is doing rather than how the patient is doing is meaningful.",
    tip:
      "Use không phải gánh một mình to validate the weight without trying to fix it.",
  },
  {
    id: 162,
    level: "B1",
    title_en: "When A Friend Loses Their Job",
    subtitle: "Comfort without rushing them to bounce back.",
    intro:
      "Use these phrases when a friend has just been laid off or let go.",
    phrases: [
      {
        english: "That is brutal. You did not deserve this.",
        vietnamese: "Vụ này đau thật, bạn đâu có đáng bị vậy.",
        pronunciation: "vu nay dau that, ban dau ko dang bi vay",
        context: "Use to validate the unfairness first.",
      },
      {
        english: "Take a few days before you start applying. You are tired.",
        vietnamese: "Mấy hôm đầu cứ nghỉ đi, đừng vội apply, bạn mệt thật rồi.",
        pronunciation: "may hom dau ku nghi di, dung voi apply, ban met that roy",
        context: "Use to slow them down from frantic recovery.",
      },
      {
        english: "If you want to vent, I will not jump in with advice.",
        vietnamese: "Bạn cần xả thì cứ xả, mình không chen lời khuyên đâu.",
        pronunciation: "ban kun xa thi ku xa, minh khong chen loi khuyen dau",
        context: "Use to offer ear without unsolicited fixes.",
      },
      {
        english: "Money-wise, if it ever gets bad, just ask. I will figure it out.",
        vietnamese: "Tiền bạc nếu có lúc bí quá, bạn cứ nói mình, mình tính được.",
        pronunciation: "tien bak new ko luk bi qua, ban ku noy minh, minh tinh duoc",
        context: "Use to leave a real safety net open without pressuring.",
      },
    ],
    cultural_note:
      "Job loss in Vietnamese culture often carries shame. Validating before solving prevents the shame from compounding.",
    tip:
      "Use bạn đâu có đáng bị vậy to push back against the self-blame instinct.",
  },
  {
    id: 163,
    level: "B1",
    title_en: "Telling A Friend Their Partner Is Wrong For Them",
    subtitle: "Honest, careful, not preachy.",
    intro:
      "Use these phrases when a friend's relationship is harming them and they have not asked for advice.",
    phrases: [
      {
        english: "I have something to say, but only if you want to hear it.",
        vietnamese: "Mình có chuyện muốn nói, nhưng chỉ nói nếu bạn muốn nghe.",
        pronunciation: "minh ko chuyen mwon noy, nyung chi noy new ban mwon nghe",
        context: "Use to ask permission before giving hard feedback.",
      },
      {
        english: "When you are with this person, you are quieter, smaller.",
        vietnamese: "Lúc bạn ở bên người đó, bạn im hơn, nhỏ lại.",
        pronunciation: "luk ban u ben nguoi do, ban im hon, nho lai",
        context: "Use to describe a behavioral change you have observed.",
      },
      {
        english: "I am not asking you to leave. I am asking you to notice.",
        vietnamese: "Mình không bắt bạn rời đi, mình chỉ xin bạn để ý.",
        pronunciation: "minh khong bat ban roi di, minh chi xin ban de y",
        context: "Use to give awareness, not orders.",
      },
      {
        english: "Whatever you decide, I am not going anywhere.",
        vietnamese: "Bạn quyết sao cũng được, mình vẫn ở đây.",
        pronunciation: "ban kwet sao kung duoc, minh van u day",
        context: "Use to preserve the friendship regardless of outcome.",
      },
    ],
    cultural_note:
      "Friends who push hard get pushed out. Friends who notice and stay get listened to eventually.",
    tip:
      "Use im hơn, nhỏ lại — concrete behavioral observations land better than character judgments.",
  },
  {
    id: 164,
    level: "B1",
    title_en: "Telling A Storied Hard Week",
    subtitle: "Connected speech with real emotion.",
    intro:
      "Use these phrases to recount a difficult week to a close friend in natural connected speech.",
    phrases: [
      {
        english: "Wait, let me start from the beginning, because the whole week was a lot.",
        vietnamese: "Khoan, để mình kể từ đầu, tại nguyên tuần rồi đúng kiểu hơi nhiều chuyện.",
        pronunciation: "khoan, de minh ke tu dau, tai nguyen tuan roy dung kieu hoi nhieu chuyen",
        context: "Use to set up a longer story with a friend.",
      },
      {
        english: "So Monday, I already came in tired, and then the boss dropped a new project on me.",
        vietnamese: "Thì thứ Hai, đi làm mình đã mệt sẵn rồi, xong sếp lại quăng cho cái dự án mới.",
        pronunciation: "thi thu hai, di lam minh da met san roy, xong sep lai kwang cho kai zu an moi",
        context: "Use to begin the body of a real-life weekly story.",
      },
      {
        english: "By Wednesday I was crying in the bathroom, not even sure why.",
        vietnamese: "Tới thứ Tư mình ngồi khóc trong nhà vệ sinh luôn, mà cũng không hiểu sao khóc nữa.",
        pronunciation: "toi thu tu minh ngoy khok trong nha ve sinh luon, ma kung khong hieu sao khok nua",
        context: "Use to describe an emotional low point.",
      },
      {
        english: "Honestly, telling you this now, I already feel a bit lighter.",
        vietnamese: "Mà nói thật, kể bạn nghe vầy là mình cũng nhẹ ra một chút rồi.",
        pronunciation: "ma noy that, ke ban nghe vay la minh kung nhe ra mot chut roy",
        context: "Use to close the story by naming the relief of being heard.",
      },
    ],
    cultural_note:
      "Vietnamese storytelling between friends is improvised, leans on tại, thì, mà, xong, luôn — markers of casual flow.",
    tip:
      "Use khoan, để mình kể từ đầu when you want to slow down and tell a real story instead of quick small talk.",
  },
  {
    id: 165,
    level: "B1",
    title_en: "Modern Texting Slang And Casual Speech",
    subtitle: "Sound natural, not like Google Translate.",
    intro:
      "Use these expressions in casual texting, group chats, and informal voice messages with peers.",
    phrases: [
      {
        english: "OMG, no way, are you serious?",
        vietnamese: "Trời ơi, gì vậy trời, thiệt hả?",
        pronunciation: "troi oi, zi vay troi, thiet ha",
        context: "Use as a casual reaction to surprising news.",
      },
      {
        english: "lol same, I was just thinking that.",
        vietnamese: "kkk same nha, tui cũng vừa nghĩ đúng cái đó.",
        pronunciation: "ka ka ka same nha, tui kung vua nghi dung kai do",
        context: "Use in chat to show you are on the same page.",
      },
      {
        english: "Brb, putting kid to bed, will call you back in 15.",
        vietnamese: "Khoan nha, cho con đi ngủ cái đã, 15 phút nữa gọi lại bạn.",
        pronunciation: "khoan nha, cho kon di ngu kai da, muoi lam phut nua goi lai ban",
        context: "Use as a quick pause-and-return message.",
      },
      {
        english: "Honestly, I just need to vent for five minutes.",
        vietnamese: "Thật ra tui chỉ cần xả năm phút thôi á.",
        pronunciation: "that ra tui chi kun xa nam phut thoy a",
        context: "Use to ask for ear, not solutions.",
      },
    ],
    cultural_note:
      "Modern casual Vietnamese mixes English (lol, brb), uses kkk for laughter, and softens with á, nha, mà, đó.",
    tip:
      "Use gì vậy trời and thiệt hả as universal reaction phrases that signal you are listening.",
  },
  {
    id: 166,
    level: "B1",
    title_en: "Soft Refusal Of A Wedding Or Big Event",
    subtitle: "Decline with face intact on both sides.",
    intro:
      "Use these phrases when you cannot attend a wedding, engagement, or major family event.",
    phrases: [
      {
        english: "Congrats already; sorry, I genuinely cannot make that day.",
        vietnamese: "Chúc mừng bạn trước nha, mà ngày đó mình thật sự không sắp xếp được.",
        pronunciation: "chuk mung ban truoc nha, ma ngay do minh that su khong sap xep duoc",
        context: "Use to lead with congratulations before the no.",
      },
      {
        english: "I would not miss it for a small reason; it is a real conflict.",
        vietnamese: "Không phải mình lười đâu, kẹt thật sự, không thì mình đã đi rồi.",
        pronunciation: "khong phai minh luoi dau, ket that su, khong thi minh da di roy",
        context: "Use to defuse the suspicion that you are blowing them off.",
      },
      {
        english: "I will send a gift through your sister; I do not want it to feel empty.",
        vietnamese: "Mình gửi quà qua chị bạn nha, không thì mình thấy kỳ lắm.",
        pronunciation: "minh gui kwa kwa chi ban nha, khong thi minh thay ki lam",
        context: "Use to show care even though you cannot show up.",
      },
      {
        english: "Let me take you out properly the week after, just us.",
        vietnamese: "Tuần sau mình hẹn bạn đi ăn riêng cho đàng hoàng, chỉ hai đứa thôi.",
        pronunciation: "tuan sau minh hen ban di an rieng cho dang hoang, chi hai dua thoy",
        context: "Use to repair absence with personal time afterward.",
      },
    ],
    cultural_note:
      "Wedding absence is socially weighted in Vietnam. The combination of congrats + real reason + later make-up time keeps the friendship clean.",
    tip:
      "Use không phải mình lười đâu — preempting the assumption is half the apology.",
  },
  {
    id: 167,
    level: "B1",
    title_en: "Roleplay: Mom Asking About Marriage At Tết",
    subtitle: "Tết family pressure dialogue.",
    intro:
      "Practice this when you go home for Tết and your mom keeps circling the marriage question with relatives nearby.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Năm nay con bao nhiêu tuổi rồi nhỉ?",
        english: "How old are you this year again?",
        pronunciation: "nam nay kon bao nhieu tuoi roy nhi",
      },
      {
        speaker: "B",
        vietnamese: "Mẹ ơi, mẹ biết tuổi con rồi mà.",
        english: "Mom, you already know my age.",
        pronunciation: "may oi, may biet tuoi kon roy ma",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ hỏi vậy thôi, bạn con cưới hết rồi đó.",
        english: "Just asking, your friends have all gotten married already.",
        pronunciation: "may hoi vay thoy, ban kon kuoi het roy do",
      },
      {
        speaker: "B",
        vietnamese: "Dạ con biết, mà chuyện cưới đâu phải đua nha mẹ.",
        english: "I know, but marriage is not a race, mom.",
        pronunciation: "ya kon biet, ma chuyen kuoi dau phai dua nha may",
      },
      {
        speaker: "A",
        vietnamese: "Ý mẹ là mẹ lo cho con thôi, chứ ai ép.",
        english: "I am just worried for you, no one is forcing you.",
        pronunciation: "y may la may lo cho kon thoy, chu ai ep",
      },
      {
        speaker: "B",
        vietnamese: "Con biết mà mẹ. Có gì con kể mẹ liền, được không?",
        english: "I know, mom. If anything happens, I will tell you right away, okay?",
        pronunciation: "kon biet ma may, ko zi kon ke may lien, duoc khong",
      },
      {
        speaker: "A",
        vietnamese: "Ờ, vậy đi. Ăn thêm miếng bánh chưng đi con.",
        english: "Okay, fine. Have another piece of bánh chưng.",
        pronunciation: "uh, vay di, an them mieng banh chung di kon",
      },
    ],
    cultural_note:
      "Tết multiplies family pressure questions. The exit is rarely a hard no; it is a warm reframe and a redirect (often to food).",
    tip:
      "Notice how the mom redirects to bánh chưng at the end — accepting that food gesture often ends the line of questioning.",
  },
  {
    id: 168,
    level: "B1",
    title_en: "Roleplay: Whose Family For Tết",
    subtitle: "Couple negotiates a hard scheduling decision.",
    intro:
      "Practice this when you and your partner cannot make both families work and someone has to be disappointed.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Năm nay mình tính sao về Tết, em?",
        english: "What is the plan for Tết this year, em?",
        pronunciation: "nam nay minh tinh sao ve tet, em",
      },
      {
        speaker: "B",
        vietnamese: "Em cũng đang lăn tăn, ba mẹ em đợi từ lâu rồi.",
        english: "I am also stuck, my parents have been waiting a while.",
        pronunciation: "em kung dang lan tan, ba may em doi tu lau roy",
      },
      {
        speaker: "A",
        vietnamese: "Anh hiểu, mà nhà anh năm nay có đám giỗ trùng vô đó.",
        english: "I get it, but my family has a memorial that overlaps this year.",
        pronunciation: "anh hieu, ma nha anh nam nay ko dam gio trung vo do",
      },
      {
        speaker: "B",
        vietnamese: "Vậy thì khó rồi. Hay mình mùng một bên anh, mùng ba về bên em được không?",
        english: "That makes it tough. How about Day 1 your side, Day 3 my side?",
        pronunciation: "vay thi kho roy, hai minh mung mot ben anh, mung ba ve ben em duoc khong",
      },
      {
        speaker: "A",
        vietnamese: "Được, mà mình gọi sớm cho cả hai nhà biết, đừng để người ta hụt hẫng.",
        english: "Works for me, but let us call both families early so no one gets blindsided.",
        pronunciation: "duoc, ma minh goi som cho ka hai nha biet, dung de nguoi ta hut hang",
      },
      {
        speaker: "B",
        vietnamese: "Ừ. Em sẽ gọi mẹ em chiều nay. Anh gọi mẹ anh nha.",
        english: "Yeah. I will call my mom this afternoon. You call yours, okay?",
        pronunciation: "u, em se goi may em chieu nay, anh goi may anh nha",
      },
      {
        speaker: "A",
        vietnamese: "Ok. Cảm ơn em chịu chia với anh nha.",
        english: "Okay. Thanks for sharing this with me.",
        pronunciation: "ok, kam un em chiu chia voi anh nha",
      },
    ],
    cultural_note:
      "Tết planning is rarely solved by logic alone; the explicit thank-you for compromise (chịu chia) often matters as much as the schedule.",
    tip:
      "Use lăn tăn for soft, real-couple wavering — it sounds far more native than không biết.",
  },
  {
    id: 169,
    level: "B1",
    title_en: "Roleplay: Friend Confronts You About Overworking",
    subtitle: "Burnout intervention dialogue.",
    intro:
      "Practice this when a close friend calls you out for working through every weekend.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tuần này bạn lại làm cuối tuần nữa hả?",
        english: "You are working again this weekend?",
        pronunciation: "tuan nay ban lai lam kuoy tuan nua ha",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, deadline gấp quá, không kịp.",
        english: "Yeah, the deadline is too tight, I cannot finish in time.",
        pronunciation: "u, deadline gap qua, khong kip",
      },
      {
        speaker: "A",
        vietnamese: "Bạn nói câu đó đúng kiểu lần thứ năm rồi đó.",
        english: "You have said that exact line five times already.",
        pronunciation: "ban noy kau do dung kieu lan thu nam roy do",
      },
      {
        speaker: "B",
        vietnamese: "Ờ ha. Mà giờ bỏ cũng không được nữa.",
        english: "Yeah, true. But now I cannot just drop it either.",
        pronunciation: "u ha, ma gio bo kung khong duoc nua",
      },
      {
        speaker: "A",
        vietnamese: "Mình không bắt bạn bỏ. Mình sợ tới lúc bạn gãy thật.",
        english: "I am not asking you to quit. I am scared of when you actually break.",
        pronunciation: "minh khong bat ban bo, minh so toi luk ban gay that",
      },
      {
        speaker: "B",
        vietnamese: "Thôi… để Chủ Nhật mình đi cà phê với bạn cái đã. Một buổi thôi cũng được.",
        english: "Okay… let me at least go for coffee with you Sunday. Just one block of time.",
        pronunciation: "thoy de chu nhat minh di cafe voi ban kai da, mot buoi thoy kung duoc",
      },
      {
        speaker: "A",
        vietnamese: "Vậy đi. Chiều Chủ Nhật, mình tới đón.",
        english: "Done. Sunday afternoon, I will come pick you up.",
        pronunciation: "vay di, chieu chu nhat, minh toi don",
      },
    ],
    cultural_note:
      "Burnout intervention works best with one specific commitment, not a lecture. A coffee Sunday beats abstract take care of yourself.",
    tip:
      "Use bạn nói câu đó đúng kiểu lần thứ năm rồi đó when you want to call a pattern out without moralizing.",
  },
  {
    id: 170,
    level: "B1",
    title_en: "Roleplay: Apologizing To A Sibling You Hurt",
    subtitle: "Real ownership between brother and sister.",
    intro:
      "Practice this when you said something cruel to a sibling and you need to repair it.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em rảnh không? Anh muốn nói chuyện một lát.",
        english: "Are you free? I want to talk for a bit.",
        pronunciation: "em ranh khong, anh mwon noy chuyen mot lat",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì hả?",
        english: "What is it?",
        pronunciation: "ko chuyen zi ha",
      },
      {
        speaker: "A",
        vietnamese: "Hôm bữa anh nói câu đó với em, anh sai rồi.",
        english: "What I said to you the other day, I was wrong.",
        pronunciation: "hom bua anh noy kau do voi em, anh sai roy",
      },
      {
        speaker: "B",
        vietnamese: "Em cũng đang giận anh thiệt. Mà em không muốn cãi nữa.",
        english: "I really am angry with you. But I do not want to fight more.",
        pronunciation: "em kung dang gian anh thiet, ma em khong mwon kai nua",
      },
      {
        speaker: "A",
        vietnamese: "Anh không biện minh đâu. Anh xin lỗi vì câu đó làm em tổn thương.",
        english: "I am not making excuses. I am sorry that what I said hurt you.",
        pronunciation: "anh khong bien minh dau, anh xin loi vi kau do lam em ton thuong",
      },
      {
        speaker: "B",
        vietnamese: "Ừ. Em ghi nhận. Lần sau anh suy nghĩ trước khi mở miệng nha.",
        english: "Okay. I hear you. Next time think before you open your mouth.",
        pronunciation: "u, em ghi nhan, lan sau anh suy nghi truoc khi mo mieng nha",
      },
      {
        speaker: "A",
        vietnamese: "Anh hứa.",
        english: "I promise.",
        pronunciation: "anh hua",
      },
    ],
    cultural_note:
      "Sibling apologies are rare in older Vietnamese family culture; the new urban norm of older sibling apologizing first is meaningful.",
    tip:
      "Use anh không biện minh đâu to short-circuit any defensive reflex before it starts.",
  },
  {
    id: 171,
    level: "B1",
    title_en: "Roleplay: Roommate Confrontation About Cleanliness",
    subtitle: "Cohabitation friction without exploding.",
    intro:
      "Practice this when a roommate's cleanliness habits have become a real problem and you need to say so.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn rảnh chút mình nói chuyện không?",
        english: "Free for a quick chat?",
        pronunciation: "ban ranh chut minh noy chuyen khong",
      },
      {
        speaker: "B",
        vietnamese: "Có gì hả? Nghe nghiêm túc dữ vậy.",
        english: "What is up? You sound serious.",
        pronunciation: "ko zi ha, nghe nghiem tuk zu vay",
      },
      {
        speaker: "A",
        vietnamese: "Mình muốn nói về bếp. Tuần này chén bẩn lại đầy bồn nữa.",
        english: "I want to talk about the kitchen. This week the sink is full of dirty dishes again.",
        pronunciation: "minh mwon noy ve bep, tuan nay chen ban lai day bon nua",
      },
      {
        speaker: "B",
        vietnamese: "Ờ, mình bận quá nên quên. Để chiều mình rửa.",
        english: "Yeah, I have been swamped, I forgot. I will wash them this afternoon.",
        pronunciation: "u, minh ban qua nen kwen, de chieu minh rua",
      },
      {
        speaker: "A",
        vietnamese: "Không phải lần đầu nha. Mình không muốn căng, nhưng mình mệt khi rửa giùm hoài.",
        english: "It is not the first time. I do not want to get heavy about it, but I am tired of washing for both of us.",
        pronunciation: "khong phai lan dau nha, minh khong mwon kang, nyung minh met khi rua zum hoai",
      },
      {
        speaker: "B",
        vietnamese: "Ờ, mình hiểu rồi. Vậy mình lập lịch luân phiên đi, mỗi đứa hai ngày.",
        english: "Yeah, I get it. Let us make a rotation, two days each.",
        pronunciation: "u, minh hieu roy, vay minh lap lich luan phien di, moi dua hai ngay",
      },
      {
        speaker: "A",
        vietnamese: "Ok, vậy được. Cảm ơn bạn không có cãi lại.",
        english: "Okay, that works. Thanks for not getting defensive.",
        pronunciation: "ok, vay duoc, kam un ban khong ko kai lai",
      },
    ],
    cultural_note:
      "Roommate friction handled directly with a concrete fix, not a moral lesson, usually preserves the relationship.",
    tip:
      "Use mình mệt khi rửa giùm hoài — naming the impact is more persuasive than naming the misbehavior.",
  },
  {
    id: 172,
    level: "B1",
    title_en: "Roleplay: Asking Parents For Help Quietly",
    subtitle: "Shame-free financial help conversation.",
    intro:
      "Practice this when you genuinely need a short loan from your parents and you do not want to make it dramatic.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mẹ ơi, con xin nói với mẹ một chuyện được không?",
        english: "Mom, can I tell you something?",
        pronunciation: "may oi, kon xin noy voi may mot chuyen duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Có gì con cứ nói.",
        english: "Whatever it is, just say it.",
        pronunciation: "ko zi kon ku noy",
      },
      {
        speaker: "A",
        vietnamese: "Tháng này con kẹt mười triệu. Mẹ cho con mượn được không, tới lương con trả lại liền.",
        english: "This month I am short by ten million. Could you lend me, I will pay back when I get paid.",
        pronunciation: "thang nay kon ket muoi trieu, may cho kon muon duoc khong, toi luong kon tra lai lien",
      },
      {
        speaker: "B",
        vietnamese: "Sao không nói sớm hơn? Có chuyện gì không con?",
        english: "Why did you not say earlier? Is something wrong?",
        pronunciation: "sao khong noy som hon, ko chuyen zi khong kon",
      },
      {
        speaker: "A",
        vietnamese: "Không gì lớn đâu mẹ, chỉ là chi phí dồn dập, lương lại trễ một tuần.",
        english: "Nothing big, mom, costs piled up and my paycheck is a week late.",
        pronunciation: "khong zi lon dau may, chi la chi phi don dap, luong lai tre mot tuan",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, để mai mẹ chuyển. Mà lần sau kẹt cứ nói sớm, đừng giấu mẹ.",
        english: "Okay, I will transfer tomorrow. Next time, say earlier, do not hide it from me.",
        pronunciation: "u, de mai may chuyen, ma lan sau ket ku noy som, dung zau may",
      },
      {
        speaker: "A",
        vietnamese: "Dạ, con cảm ơn mẹ. Con sẽ trả đúng hẹn.",
        english: "Yes, thanks mom. I will pay back on time.",
        pronunciation: "ya, kon kam un may, kon se tra dung hen",
      },
    ],
    cultural_note:
      "The opening permission frame (xin nói một chuyện) signals that the request is real, not casual.",
    tip:
      "Use kẹt mười triệu — the directness of the number makes the conversation easier than vague phrasing.",
  },
  {
    id: 173,
    level: "B1",
    title_en: "Roleplay: Việt Kiều At A Family Dinner",
    subtitle: "Heritage speaker handling soft cultural distance.",
    intro:
      "Practice this when you are visiting Vietnam, your accent is rusty, and a relative comments on it at dinner.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Lâu rồi mới về, giọng cháu nghe lạ ghê.",
        english: "It has been so long since you visited; your accent sounds different now.",
        pronunciation: "lau roy moi ve, zong chau nghe la ghe",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, cháu cũng biết. Giờ cháu nói tiếng Việt là cháu phải nghĩ trước.",
        english: "I know. These days I have to think first when I speak Vietnamese.",
        pronunciation: "ya, chau kung biet, gio chau noy tieng viet la chau phai nghi truoc",
      },
      {
        speaker: "A",
        vietnamese: "Không sao, ráng nói nhiều là quen lại à.",
        english: "It is okay, the more you speak, the more it comes back.",
        pronunciation: "khong sao, rang noy nhieu la kwen lai a",
      },
      {
        speaker: "B",
        vietnamese: "Cháu cũng đang cố. Nhiều lúc cháu nghe hết, mà tới lượt nói cháu đứng hình.",
        english: "I am trying. A lot of times I understand everything, but when it is my turn, I freeze.",
        pronunciation: "chau kung dang ko, nhieu luk chau nghe het, ma toi luot noy chau dung hinh",
      },
      {
        speaker: "A",
        vietnamese: "Vậy hồi nhỏ ba mẹ có nói tiếng Việt với cháu không?",
        english: "When you were little, did your parents speak Vietnamese with you?",
        pronunciation: "vay hoi nho ba may ko noy tieng viet voi chau khong",
      },
      {
        speaker: "B",
        vietnamese: "Có chứ, nhưng tới trường thì cháu chuyển hết qua tiếng Anh, lâu ngày cháu quên.",
        english: "Yes, but once I started school I switched everything to English, and over time I forgot.",
        pronunciation: "ko chu, nyung toi truong thi chau chuyen het kwa tieng anh, lau ngay chau kwen",
      },
      {
        speaker: "A",
        vietnamese: "Không sao đâu, cô vui là cháu vẫn nói được tới đây nè.",
        english: "It is okay, I am happy you can still speak this much.",
        pronunciation: "khong sao dau, ko vui la chau van noy duoc toi day ne",
      },
    ],
    cultural_note:
      "Heritage speakers often feel ashamed of accent loss; relatives usually mean the comment kindly even when it stings.",
    tip:
      "Use cháu đứng hình — it is the modern, honest way to describe linguistic freezing.",
  },
  {
    id: 174,
    level: "B1",
    title_en: "Roleplay: Friend Just Got Fired",
    subtitle: "Comforting in real time, not after the polish.",
    intro:
      "Practice this when a friend just told you over the phone that they were laid off today.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Khoan, bạn đang ở đâu? Bạn ổn không?",
        english: "Wait, where are you? Are you okay?",
        pronunciation: "khoan, ban dang u dau, ban on khong",
      },
      {
        speaker: "B",
        vietnamese: "Mình đang ngồi trong xe. Vừa mới ra khỏi công ty.",
        english: "I am sitting in my car. I just left the office.",
        pronunciation: "minh dang ngoy trong xe, vua moi ra khoy kong ti",
      },
      {
        speaker: "A",
        vietnamese: "Trời ơi. Đừng tự lái về liền nha, nghỉ chút đi.",
        english: "God. Do not drive home right away, rest a bit first.",
        pronunciation: "troi oi, dung tu lai ve lien nha, nghi chut di",
      },
      {
        speaker: "B",
        vietnamese: "Mình không biết phải làm gì luôn. Đầu trống không.",
        english: "I do not even know what to do. My head is blank.",
        pronunciation: "minh khong biet phai lam zi luon, dau trong khong",
      },
      {
        speaker: "A",
        vietnamese: "Bạn không phải biết liền đâu. Hôm nay không cần kế hoạch gì hết.",
        english: "You do not have to know right now. Today does not need a plan.",
        pronunciation: "ban khong phai biet lien dau, hom nay khong kun ke hoach zi het",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn bạn. Mình thấy nhẹ hơn khi nghe tiếng bạn.",
        english: "Thanks. I feel lighter just hearing your voice.",
        pronunciation: "kam un ban, minh thay nhe hon khi nghe tieng ban",
      },
      {
        speaker: "A",
        vietnamese: "Tối nay ăn cơm chung không? Mình nấu cho bạn một bữa cũng được.",
        english: "Want to eat dinner together tonight? I can cook for you.",
        pronunciation: "toi nay an kom chung khong, minh nau cho ban mot bua kung duoc",
      },
    ],
    cultural_note:
      "Acute crisis comforting in Vietnamese is best when it offers presence and a small concrete kindness, not a five-step plan.",
    tip:
      "Use đầu trống không — letting the friend name the blankness gives them permission to feel without performance.",
  },
  {
    id: 175,
    level: "B1",
    title_en: "Roleplay: Running Into Your Ex",
    subtitle: "Awkward coffee shop encounter.",
    intro:
      "Practice this when you accidentally see your ex in public after a long silence.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Ơ, là bạn hả? Lâu rồi không gặp.",
        english: "Oh, is that you? Long time no see.",
        pronunciation: "oh, la ban ha, lau roy khong gap",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, mình. Bạn cũng hay tới quán này hả?",
        english: "Yeah, it is me. Do you come here a lot too?",
        pronunciation: "u, minh, ban kung hai toi quan nay ha",
      },
      {
        speaker: "A",
        vietnamese: "Mới biết quán này được vài tháng. Bạn vẫn vậy ha.",
        english: "I only found this place a few months ago. You look the same.",
        pronunciation: "moi biet quan nay duoc vai thang, ban van vay ha",
      },
      {
        speaker: "B",
        vietnamese: "Cũng ổn, có cái khác chút. Bạn ổn không?",
        english: "I am okay, a few things have shifted. Are you okay?",
        pronunciation: "kung on, ko kai khak chut, ban on khong",
      },
      {
        speaker: "A",
        vietnamese: "Ổn nha. Bữa nay đi với bạn này thôi, không có gì căng đâu.",
        english: "I am okay. Just here with a friend today, nothing dramatic.",
        pronunciation: "on nha, bua nay di voi ban nay thoy, khong ko zi kang dau",
      },
      {
        speaker: "B",
        vietnamese: "Vậy thôi, bạn vui nha. Mình đi trước đây.",
        english: "Alright, take care. I am heading out.",
        pronunciation: "vay thoy, ban vui nha, minh di truoc day",
      },
      {
        speaker: "A",
        vietnamese: "Ừ, bảo trọng nha bạn.",
        english: "Yeah, take care of yourself.",
        pronunciation: "u, bao trong nha ban",
      },
    ],
    cultural_note:
      "Polite ex encounters in Vietnamese keep small talk small, exit fast, and end with bảo trọng — a soft closure that does not invite reopening.",
    tip:
      "Use không có gì căng đâu when you want to signal that you are not bringing the past back into this minute.",
  },
  {
    id: 176,
    level: "B1",
    title_en: "Roleplay: Telling A Friend Their Relationship Is Bad",
    subtitle: "Hard truth between close friends.",
    intro:
      "Practice this for a serious one-on-one conversation where a friend's relationship is hurting them.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn cho mình hỏi một cái, không phán xét đâu.",
        english: "Can I ask you one thing, no judgment.",
        pronunciation: "ban cho minh hoi mot kai, khong fan zet dau",
      },
      {
        speaker: "B",
        vietnamese: "Ừ, hỏi đi.",
        english: "Yeah, go ahead.",
        pronunciation: "u, hoi di",
      },
      {
        speaker: "A",
        vietnamese: "Lúc bạn ở bên ảnh, bạn có thấy mình như cũ không?",
        english: "When you are with him, do you still feel like yourself?",
        pronunciation: "luk ban u ben anh, ban ko thay minh nhu ku khong",
      },
      {
        speaker: "B",
        vietnamese: "… Thiệt ra dạo này không. Mình hay im lại.",
        english: "Honestly, lately, no. I tend to stay quiet.",
        pronunciation: "thiet ra zao nay khong, minh hai im lai",
      },
      {
        speaker: "A",
        vietnamese: "Mình không nói bạn phải bỏ. Mình chỉ muốn bạn để ý cái đó.",
        english: "I am not saying leave him. I just want you to notice that.",
        pronunciation: "minh khong noy ban phai bo, minh chi mwon ban de y kai do",
      },
      {
        speaker: "B",
        vietnamese: "Mình biết. Mà nói ra với bạn rồi, mình thấy nó thật hơn.",
        english: "I know. Saying it out loud to you makes it feel more real.",
        pronunciation: "minh biet, ma noy ra voi ban roy, minh thay no that hon",
      },
      {
        speaker: "A",
        vietnamese: "Bạn quyết sao mình cũng ở đây. Không đi đâu hết.",
        english: "Whatever you decide, I am here. Not going anywhere.",
        pronunciation: "ban kwet sao minh kung u day, khong di dau het",
      },
    ],
    cultural_note:
      "Real influence in close friendships comes from staying through the decision, not from steering it.",
    tip:
      "Use bạn có thấy mình như cũ không as the question that opens self-noticing without accusing the partner.",
  },
  {
    id: 177,
    level: "B1",
    title_en: "Roleplay: Boss Wants You On The Weekend",
    subtitle: "Negotiate without folding completely.",
    intro:
      "Practice this when your boss messages you Saturday morning needing you to come in.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em ơi, gấp lắm, em ghé văn phòng được không?",
        english: "Em, it is urgent, can you swing by the office?",
        pronunciation: "em oi, gap lam, em ghe van phong duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Anh ơi, hôm nay em đang ở quê, không vô được.",
        english: "Anh, I am at my hometown today, I cannot come in.",
        pronunciation: "anh oi, hom nay em dang u kwe, khong vo duoc",
      },
      {
        speaker: "A",
        vietnamese: "Vậy em làm online được không? Khoảng hai tiếng thôi.",
        english: "Can you handle it online then? About two hours of work.",
        pronunciation: "vay em lam online duoc khong, khoang hai tieng thoy",
      },
      {
        speaker: "B",
        vietnamese: "Em làm online được, mà tới 10 giờ tối. Có gì gửi link em vô liền.",
        english: "Online I can manage, but only until 10 PM. Send me the link, I will jump in.",
        pronunciation: "em lam online duoc, ma toi muoi gio toi, ko zi gui link em vo lien",
      },
      {
        speaker: "A",
        vietnamese: "Ok, anh gửi liền. Cảm ơn em chịu hỗ trợ.",
        english: "Okay, sending now. Thanks for helping out.",
        pronunciation: "ok, anh gui lien, kam un em chiu ho tro",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, mà anh cho em nói một câu thôi: cuối tuần em đang ở quê thì rất khó tham gia full lực, anh thông cảm.",
        english: "Sure, but let me say this: when I am at my hometown on weekends, I cannot give full energy, please understand.",
        pronunciation: "ya, ma anh cho em noy mot kau thoy, kuoy tuan em dang u kwe thi rat kho tham gia full luk, anh thong kam",
      },
      {
        speaker: "A",
        vietnamese: "Anh hiểu, lần này gấp thôi. Cảm ơn em.",
        english: "I get it, this is just an emergency. Thank you.",
        pronunciation: "anh hieu, lan nay gap thoy, kam un em",
      },
    ],
    cultural_note:
      "Naming the limit while still helping protects both the boundary and the relationship; outright refusal would damage long-term standing.",
    tip:
      "Use anh thông cảm at the end of a partial yes — it converts compliance into a moment of mutual respect.",
  },
  {
    id: 178,
    level: "B1",
    title_en: "Roleplay: Brother Borrowing Money Again",
    subtitle: "Set a real limit with family money.",
    intro:
      "Practice this when a sibling is repeatedly asking for money and you cannot keep saying yes.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em ơi, tháng này anh kẹt nữa rồi, em cho anh mượn năm triệu được không?",
        english: "Em, I am short again this month, can you lend me five million?",
        pronunciation: "em oi, thang nay anh ket nua roy, em cho anh muon nam trieu duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Anh, lần trước anh chưa trả mà.",
        english: "Anh, you have not paid back the last one yet.",
        pronunciation: "anh, lan truoc anh chua tra ma",
      },
      {
        speaker: "A",
        vietnamese: "Anh biết, anh sẽ trả hết một lần luôn, hứa.",
        english: "I know, I will pay all of it back at once, I promise.",
        pronunciation: "anh biet, anh se tra het mot lan luon, hua",
      },
      {
        speaker: "B",
        vietnamese: "Em không phải không thương anh. Mà cứ vầy hoài là em cũng đuối.",
        english: "It is not that I do not care about you. But this pattern is wearing me out too.",
        pronunciation: "em khong phai khong thuong anh, ma ku vay hoai la em kung duoy",
      },
      {
        speaker: "A",
        vietnamese: "Vậy em cho anh mượn ít hơn cũng được, hai triệu cũng đỡ.",
        english: "Then less is fine, even two million helps.",
        pronunciation: "vay em cho anh muon it hon kung duoc, hai trieu kung do",
      },
      {
        speaker: "B",
        vietnamese: "Lần này em không cho mượn nữa. Mình ngồi xuống coi tiền của anh đang chạy đi đâu trước đã.",
        english: "This time I am not lending. Let us sit down and look at where your money is going first.",
        pronunciation: "lan nay em khong cho muon nua, minh ngoy xuong koy tien kua anh dang chay di dau truoc da",
      },
      {
        speaker: "A",
        vietnamese: "… Ờ. Vậy chiều mai anh qua nhà em.",
        english: "… Okay. I will come by your place tomorrow afternoon.",
        pronunciation: "u, vay chieu mai anh kwa nha em",
      },
    ],
    cultural_note:
      "Refusing family money requests works better when it is paired with offering a different kind of help — like sitting down to look at the budget together.",
    tip:
      "Use em không phải không thương anh as a buffer before the no; it preserves love while drawing the limit.",
  },
  {
    id: 179,
    level: "B1",
    title_en: "When A Teen Pushes Back",
    subtitle: "Hold ground without becoming the bad guy.",
    intro:
      "Use these phrases when your teenager pushes back hard against a rule or expectation.",
    phrases: [
      {
        english: "I hear you. The rule still stands tonight.",
        vietnamese: "Mẹ nghe rồi. Tối nay luật vẫn vậy.",
        pronunciation: "may nghe roy, toi nay luat van vay",
      context: "Use to validate the pushback without folding.",
      },
      {
        english: "Tomorrow we can talk about whether the rule should change.",
        vietnamese: "Mai mình ngồi nói chuyện coi luật này có nên đổi không.",
        pronunciation: "mai minh ngoy noy chuyen koy luat nay ko nen doi khong",
        context: "Use to offer real renegotiation, not just shutdown.",
      },
      {
        english: "I am not your enemy. I am your mom.",
        vietnamese: "Mẹ không phải kẻ thù của con đâu. Mẹ là mẹ con thôi.",
        pronunciation: "may khong phai ke thu kua kon dau, may la may kon thoy",
        context: "Use to reset the emotional frame when it gets adversarial.",
      },
      {
        english: "If you slam the door, that is fine. We will still finish this tomorrow.",
        vietnamese: "Con đóng cửa cái rầm cũng được, mai mình vẫn nói tiếp.",
        pronunciation: "kon dong kua kai ram kung duoc, mai minh van noy tiep",
        context: "Use to stay regulated when your teen escalates.",
      },
    ],
    cultural_note:
      "Vietnamese parenting is moving toward acknowledging teen feelings without losing authority. The trick is hold + delay, not hold + lecture.",
    tip:
      "Use mẹ không phải kẻ thù của con đâu when the conversation has tipped into us-versus-them.",
  },
  {
    id: 180,
    level: "B1",
    title_en: "When A Colleague Takes Credit",
    subtitle: "Reclaim quietly without explosion.",
    intro:
      "Use these phrases when someone took credit for your idea or work in front of others.",
    phrases: [
      {
        english: "Quick clarification: that part actually came from me last week.",
        vietnamese: "Cho em làm rõ một chút: phần đó tuần trước em đề xuất.",
        pronunciation: "cho em lam ro mot chut, phan do tuan truoc em de xuat",
        context: "Use to correct in real time, dispassionately.",
      },
      {
        english: "I am not making a big deal, but I do want it on record.",
        vietnamese: "Em không có làm to chuyện đâu, mà em muốn nó được ghi nhận đúng.",
        pronunciation: "em khong ko lam to chuyen dau, ma em mwon no duoc ghi nhan dung",
        context: "Use to lower temperature while still claiming credit.",
      },
      {
        english: "Anh, can we talk privately for two minutes?",
        vietnamese: "Anh ơi, mình nói riêng hai phút được không.",
        pronunciation: "anh oi, minh noy rieng hai phut duoc khong",
        context: "Use when you want to escalate to a one-on-one with a manager.",
      },
      {
        english: "I am not asking for praise; I am asking for accuracy.",
        vietnamese: "Em không xin khen đâu, em chỉ xin nói cho đúng người làm.",
        pronunciation: "em khong xin khen dau, em chi xin noy cho dung nguoi lam",
        context: "Use to frame credit-claiming as fairness, not ego.",
      },
    ],
    cultural_note:
      "Open confrontation about credit can backfire in Vietnamese workplaces; private follow-up plus a single calm public correction usually lands better.",
    tip:
      "Use em chỉ xin nói cho đúng người làm — it sounds like a process correction, not a power move.",
  },
  {
    id: 181,
    level: "B1",
    title_en: "Roleplay: Quitting Your Job Conversation",
    subtitle: "Resign with dignity intact.",
    intro:
      "Practice this when you are sitting down with your boss to give notice.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh ơi, em xin một chút thời gian nói chuyện được không.",
        english: "Anh, can I take a minute to talk with you.",
        pronunciation: "anh oi, em xin mot chut thoi gian noy chuyen duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Có gì đó em? Anh đang đoán rồi đó.",
        english: "What is it? I think I am guessing.",
        pronunciation: "ko zi do em, anh dang doan roy do",
      },
      {
        speaker: "A",
        vietnamese: "Em quyết định nghỉ. Em xin báo trước một tháng.",
        english: "I have decided to leave. I am giving one month notice.",
        pronunciation: "em kwet dinh nghi, em xin bao truoc mot thang",
      },
      {
        speaker: "B",
        vietnamese: "Tiếc thật. Có chuyện gì anh giải quyết được không?",
        english: "That is a real loss. Anything I could fix?",
        pronunciation: "tiek that, ko chuyen zi anh giai kwet duoc khong",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn anh đã hỏi. Mà chuyện này em đã suy nghĩ lâu rồi, không phải bộc phát.",
        english: "Thanks for asking. I have been thinking about this for a while, it is not impulsive.",
        pronunciation: "kam un anh da hoi, ma chuyen nay em da suy nghi lau roy, khong phai bok phat",
      },
      {
        speaker: "B",
        vietnamese: "Vậy ok. Mình ngồi với HR để bàn giao đầy đủ. Cảm ơn em đã chịu báo sớm.",
        english: "Alright. Let us sit with HR for a clean handover. Thanks for the early notice.",
        pronunciation: "vay ok, minh ngoy voi HR de ban giao day du, kam un em da chiu bao som",
      },
      {
        speaker: "A",
        vietnamese: "Dạ, em cảm ơn anh đã nâng đỡ em thời gian qua.",
        english: "Thank you for supporting me all this time.",
        pronunciation: "ya, em kam un anh da nang do em thoi gian kwa",
      },
    ],
    cultural_note:
      "Resigning well in Vietnamese workplaces preserves the bridge — you may need a reference, a recommendation, or a future return.",
    tip:
      "Use không phải bộc phát to signal a considered decision; it short-circuits any attempt to talk you out of it.",
  },
  {
    id: 182,
    level: "B1",
    title_en: "Roleplay: Anxiety Check-In With Therapist",
    subtitle: "Modern mental health conversation.",
    intro:
      "Practice this for a session with a Vietnamese-speaking therapist or counselor.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tuần này em thấy thế nào?",
        english: "How have you been feeling this week?",
        pronunciation: "tuan nay em thay the nao",
      },
      {
        speaker: "B",
        vietnamese: "Hơi tệ. Em thức dậy là thấy tim đập mạnh, mà không có lý do rõ.",
        english: "A bit rough. I wake up with my heart racing, no clear reason.",
        pronunciation: "hoi te, em thuk zay la thay tim dap manh, ma khong ko ly zo ro",
      },
      {
        speaker: "A",
        vietnamese: "Em mô tả cụ thể giúp chị một xíu nha. Trước khi đi ngủ em hay nghĩ gì?",
        english: "Can you describe it more concretely? Before sleep, what do you usually think about?",
        pronunciation: "em mo ta ku the zup chi mot xiu nha, truoc khi di ngu em hai nghi zi",
      },
      {
        speaker: "B",
        vietnamese: "Chủ yếu là việc ở công ty. Với cả nỗi sợ ngày mai mình lại không kịp.",
        english: "Mostly work stuff. And a fear of falling behind tomorrow again.",
        pronunciation: "chu yeu la viec u kong ti, voi ka noi so ngay mai minh lai khong kip",
      },
      {
        speaker: "A",
        vietnamese: "Cái nỗi sợ không kịp đó, có quen từ hồi nhỏ không?",
        english: "That fear of falling behind, does it feel familiar from childhood?",
        pronunciation: "kai noi so khong kip do, ko kwen tu hoi nho khong",
      },
      {
        speaker: "B",
        vietnamese: "Có. Hồi nhỏ ba em hay nói em chậm hơn các bạn.",
        english: "Yes. As a kid, my dad often said I was slower than the others.",
        pronunciation: "ko, hoi nho ba em hai noy em cham hon kak ban",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn em đã chia sẻ. Tuần này mình thử ghi lại mỗi sáng em thấy gì khi vừa thức nha.",
        english: "Thanks for sharing. This week, let us try writing down what you feel each morning when you wake up.",
        pronunciation: "kam un em da chia se, tuan nay minh thu ghi lai moi sang em thay zi khi vua thuk nha",
      },
    ],
    cultural_note:
      "Modern Vietnamese therapy register is gentle and rarely uses clinical labels; it focuses on naming sensations and connecting them to history.",
    tip:
      "Use thấy tim đập mạnh, mà không có lý do rõ — describing somatic experience is the most therapy-friendly way to name anxiety in Vietnamese.",
  },
  {
    id: 183,
    level: "B1",
    title_en: "Saying No To A Date Without Ghosting",
    subtitle: "Direct enough to respect them, soft enough not to wound.",
    intro:
      "Use these lines when someone has invited you out and you do not want to go.",
    phrases: [
      {
        english: "Thanks for the invite, but honestly I do not feel that spark.",
        vietnamese: "Cảm ơn bạn rủ, mà thật lòng mình chưa thấy gì đặc biệt.",
        pronunciation: "kam un ban ru, ma that long minh chua thay zi dak biet",
        context: "Use to refuse a romantic invitation without hiding behind busy.",
      },
      {
        english: "I do not want to keep texting like nothing was said.",
        vietnamese: "Mình không muốn nhắn tới nhắn lui như chưa có chuyện gì.",
        pronunciation: "minh khong mwon nhan toi nhan lui nhu chua ko chuyen zi",
        context: "Use to explain why you are being clear instead of vague.",
      },
      {
        english: "I respect you, that is why I am telling you straight.",
        vietnamese: "Mình tôn trọng bạn, nên mình mới nói thẳng với bạn vầy.",
        pronunciation: "minh ton trong ban, nen minh moi noy thang voi ban vay",
        context: "Use to frame directness as care, not coldness.",
      },
      {
        english: "Wishing you the kind of person who really matches you.",
        vietnamese: "Chúc bạn gặp được người hợp với bạn thật sự nha.",
        pronunciation: "chuk ban gap duoc nguoi hop voi ban that su nha",
        context: "Use to close the conversation with dignity.",
      },
    ],
    cultural_note:
      "Modern Vietnamese romantic refusals favor honesty over disappearing; ghosting is increasingly seen as immature.",
    tip:
      "Use chưa thấy gì đặc biệt — softer than không thích, but still clear.",
  },
  {
    id: 184,
    level: "B1",
    title_en: "Telling Your Heritage Story",
    subtitle: "Talk about being between cultures.",
    intro:
      "Use these phrases when you want to describe your bicultural identity to a Vietnamese-speaking friend or relative.",
    phrases: [
      {
        english: "I grew up there, but I was raised inside a Vietnamese house.",
        vietnamese: "Mình lớn lên bên đó, mà nhà thì vẫn là kiểu Việt Nam.",
        pronunciation: "minh lon len ben do, ma nha thi van la kieu viet nam",
        context: "Use to begin describing a heritage childhood.",
      },
      {
        english: "Honestly, I do not feel fully one or the other.",
        vietnamese: "Thật ra mình không thấy mình thuộc hẳn về bên nào.",
        pronunciation: "that ra minh khong thay minh thuoc han ve ben nao",
        context: "Use to name the in-between feeling without apologizing for it.",
      },
      {
        english: "When I am there, people see me as Vietnamese; when I am here, people see me as foreign.",
        vietnamese: "Bên đó người ta thấy mình là Việt, mà về đây người ta lại nghĩ mình là người ngoài.",
        pronunciation: "ben do nguoi ta thay minh la viet, ma ve day nguoi ta lai nghi minh la nguoi ngoai",
        context: "Use to describe the dual displacement of heritage life.",
      },
      {
        english: "Coming back is not always sweet; sometimes it is heavy too.",
        vietnamese: "Về lại không phải lúc nào cũng vui, có lúc nặng lòng lắm.",
        pronunciation: "ve lai khong phai luk nao kung vui, ko luk nang long lam",
        context: "Use to permit complexity in your relationship to home.",
      },
    ],
    cultural_note:
      "Heritage identity in Vietnamese conversation lands better when it is described in concrete situations than in abstract terms like identity.",
    tip:
      "Use nặng lòng — it captures emotional weight without sounding therapeutic.",
  },
  {
    id: 185,
    level: "B1",
    title_en: "Group Chat And Casual Slang",
    subtitle: "Modern chat-style speech.",
    intro:
      "Use these phrases in active group chats with peers — they sound natural and current.",
    phrases: [
      {
        english: "Bro, did you see the news this morning?",
        vietnamese: "Ê ông, sáng nay có thấy tin đó chưa?",
        pronunciation: "eh ong, sang nay ko thay tin do chua",
        context: "Use to open a casual chat with male friends.",
      },
      {
        english: "Sis, today I am too tired to function.",
        vietnamese: "Bà ơi, nay tui đuối luôn không nói nổi.",
        pronunciation: "ba oi, nay tui duoy luon khong noy noi",
        context: "Use to vent quickly in a female peer chat.",
      },
      {
        english: "Lol, that is so chaotic.",
        vietnamese: "kkk loạn nhỉ.",
        pronunciation: "ka ka ka loan nhi",
        context: "Use as a casual reaction in messages.",
      },
      {
        english: "Ok ok, on my way, traffic is dying.",
        vietnamese: "Ok ok đang đi rồi, kẹt xe muốn xỉu.",
        pronunciation: "ok ok dang di roy, ket xe mwon xiu",
        context: "Use when you are running late but engaged.",
      },
    ],
    cultural_note:
      "Vietnamese chat slang uses ông/bà between peers casually, kkk for laughter, and exaggeration phrases like muốn xỉu, đuối luôn.",
    tip:
      "Use ông and bà between same-age friends for a playful register that English bro/sis only roughly captures.",
  },
  {
    id: 186,
    level: "B1",
    title_en: "When You Feel Invisible At Work",
    subtitle: "Name a quiet kind of pain to a friend.",
    intro:
      "Use these phrases when you are not being seen at work and you need to tell someone.",
    phrases: [
      {
        english: "It is not that something bad is happening; it is that nothing is happening.",
        vietnamese: "Không phải có chuyện xấu, mà là không có chuyện gì hết.",
        pronunciation: "khong phai ko chuyen xau, ma la khong ko chuyen zi het",
        context: "Use to describe being overlooked rather than mistreated.",
      },
      {
        english: "I am there every day, but I feel like I do not exist there.",
        vietnamese: "Mình đi làm đủ ngày, mà không thấy mình tồn tại trong đó.",
        pronunciation: "minh di lam du ngay, ma khong thay minh ton tai trong do",
        context: "Use to name a deeper version of feeling unseen.",
      },
      {
        english: "I do not want praise; I just want to be in the conversation.",
        vietnamese: "Mình không cần khen, mình chỉ muốn được tham gia thật sự.",
        pronunciation: "minh khong kun khen, minh chi mwon duoc tham gia that su",
        context: "Use to name what you are actually missing.",
      },
      {
        english: "I might need to look elsewhere if this stays the same.",
        vietnamese: "Nếu chỗ này vẫn vầy hoài, chắc mình phải tìm chỗ khác.",
        pronunciation: "new cho nay van vay hoai, chak minh phai tim cho khak",
        context: "Use to admit out loud that change might be necessary.",
      },
    ],
    cultural_note:
      "Quiet workplace invisibility often goes unspoken in Vietnamese culture because it is not dramatic enough to discuss; naming it to one trusted friend is real progress.",
    tip:
      "Use không thấy mình tồn tại trong đó — it captures invisibility better than the literal không được chú ý.",
  },
  {
    id: 187,
    level: "B1",
    title_en: "Roleplay: Couple Money Disagreement",
    subtitle: "A real fight that does not turn cruel.",
    intro:
      "Practice this for the kind of money conversation that has been simmering for weeks.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh, mình ngồi nói chuyện chi tiêu một chút được không.",
        english: "Anh, can we sit down and talk about spending for a bit?",
        pronunciation: "anh, minh ngoy noy chuyen chi tieu mot chut duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì hả em? Sao nghe căng vậy.",
        english: "What is going on? You sound stressed.",
        pronunciation: "ko chuyen zi ha em, sao nghe kang vay",
      },
      {
        speaker: "A",
        vietnamese: "Tháng này mình âm tiền, mà em thấy anh vẫn đặt đồ đều đều.",
        english: "We are negative this month, and I see you still ordering things steadily.",
        pronunciation: "thang nay minh am tien, ma em thay anh van dat do deu deu",
      },
      {
        speaker: "B",
        vietnamese: "Em nói vậy nghe nặng lắm. Đồ anh mua cũng không nhiều.",
        english: "That sounds harsh. The stuff I bought is not even that much.",
        pronunciation: "em noy vay nghe nang lam, do anh mua kung khong nhieu",
      },
      {
        speaker: "A",
        vietnamese: "Em không trách anh. Em chỉ muốn mình cùng nhìn con số thật.",
        english: "I am not blaming you. I just want us to look at the real numbers together.",
        pronunciation: "em khong trach anh, em chi mwon minh kung nhin kon so that",
      },
      {
        speaker: "B",
        vietnamese: "Ok. Mở app ngân hàng coi cùng đi.",
        english: "Okay. Let us open the bank app together.",
        pronunciation: "ok, mo app ngan hang koy kung di",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn anh. Mình không cần đúng sai, mình cần kế hoạch.",
        english: "Thanks. We do not need to be right, we need a plan.",
        pronunciation: "kam un anh, minh khong kun dung sai, minh kun ke hoach",
      },
    ],
    cultural_note:
      "Money fights often turn personal. Naming numbers and asking for a plan instead of an apology defuses most of the heat.",
    tip:
      "Use mình không cần đúng sai, mình cần kế hoạch — a clean exit from a defensive spiral.",
  },
  {
    id: 188,
    level: "B1",
    title_en: "When An Elderly Parent Forgets",
    subtitle: "Hold patience without infantilizing.",
    intro:
      "Use these phrases as memory loss begins to show in a parent and the family is not sure how to respond yet.",
    phrases: [
      {
        english: "Mom, no rush. Tell me again whenever you need to.",
        vietnamese: "Mẹ, không gấp đâu. Có gì mẹ kể con lại lần nữa cũng được.",
        pronunciation: "may, khong gap dau, ko zi may ke kon lai lan nua kung duoc",
        context: "Use to receive a repeated story without correction.",
      },
      {
        english: "It is okay to forget. We will go through it together.",
        vietnamese: "Quên cũng được mẹ ơi. Mình từ từ đi qua chuyện đó với nhau.",
        pronunciation: "kwen kung duoc may oi, minh tu tu di kwa chuyen do voi nhau",
        context: "Use to remove shame from the moment.",
      },
      {
        english: "Mom, want me to write the appointment on the fridge so it is easier?",
        vietnamese: "Mẹ ơi, để con ghi lịch hẹn lên tủ lạnh cho mẹ dễ thấy nha.",
        pronunciation: "may oi, de kon ghi lich hen len tu lanh cho may ze thay nha",
        context: "Use to introduce a tool for support, not surveillance.",
      },
      {
        english: "I love you the same as before, mom.",
        vietnamese: "Con vẫn thương mẹ y như xưa, mẹ ơi.",
        pronunciation: "kon van thuong may i nhu xua, may oi",
        context: "Use to anchor identity through cognitive change.",
      },
    ],
    cultural_note:
      "Memory loss in Vietnamese family life is often handled with mute concern. Words that name the love directly help more than words that name the loss.",
    tip:
      "Use không gấp đâu and quên cũng được as gentle re-grounding phrases when your parent is anxious.",
  },
  {
    id: 189,
    level: "B1",
    title_en: "Cancelling Plans Last-Minute",
    subtitle: "Bail without burning the bridge.",
    intro:
      "Use these phrases when you really cannot make plans you previously agreed to.",
    phrases: [
      {
        english: "Hey, can I cancel tonight? I feel terrible but I am completely drained.",
        vietnamese: "Bạn ơi, mình huỷ tối nay được không, tệ thật mà mình đuối quá.",
        pronunciation: "ban oi, minh huy toi nay duoc khong, te that ma minh duoy qua",
        context: "Use as an honest, last-minute bail.",
      },
      {
        english: "I know it is short notice; that is on me.",
        vietnamese: "Mình biết báo trễ, lỗi mình.",
        pronunciation: "minh biet bao tre, loi minh",
        context: "Use to take ownership without overexplaining.",
      },
      {
        english: "Can we move it to Friday? I will lock it in firmly.",
        vietnamese: "Mình dời qua thứ Sáu được không, mình chốt chắc luôn.",
        pronunciation: "minh zoi kwa thu sau duoc khong, minh chot chak luon",
        context: "Use to propose a real reschedule, not just an apology.",
      },
      {
        english: "Either way, sorry I let you down today.",
        vietnamese: "Sao cũng được, mà bữa nay mình thất hứa với bạn, xin lỗi nha.",
        pronunciation: "sao kung duoc, ma bua nay minh that hua voi ban, xin loi nha",
        context: "Use to close cleanly even if they are upset.",
      },
    ],
    cultural_note:
      "Vietnamese friendships handle bails better when paired with a concrete reschedule offer; vague soon does not repair the moment.",
    tip:
      "Use chốt chắc luôn — promising firmness next time helps the cancellation land.",
  },
  {
    id: 190,
    level: "B1",
    title_en: "Reaching Back After Long Silence",
    subtitle: "Reopen a friendship that drifted.",
    intro:
      "Use these phrases when you want to message someone after months or years of no contact.",
    phrases: [
      {
        english: "Hey, sudden message, but you crossed my mind today.",
        vietnamese: "Ê, tự dưng nhắn, mà nay tự nhiên nghĩ tới bạn.",
        pronunciation: "eh, tu zung nhan, ma nay tu nhien nghi toi ban",
        context: "Use as a low-pressure reopening line.",
      },
      {
        english: "I am not going to pretend nothing happened or that no time passed.",
        vietnamese: "Mình không định giả vờ như chưa có gì hay chưa xa nhau lâu vậy đâu.",
        pronunciation: "minh khong dinh za vo nhu chua ko zi hai chua xa nhau lau vay dau",
        context: "Use to acknowledge the gap honestly.",
      },
      {
        english: "If you are open, I would love to catch up sometime soon.",
        vietnamese: "Nếu bạn mở lòng, mình muốn ngồi với bạn một bữa sắp tới.",
        pronunciation: "new ban mo long, minh mwon ngoy voi ban mot bua sap toi",
        context: "Use to invite a real meet-up rather than chat.",
      },
      {
        english: "If you are not ready, I respect that too.",
        vietnamese: "Còn nếu bạn chưa sẵn sàng, mình tôn trọng nha.",
        pronunciation: "kon new ban chua san sang, minh ton trong nha",
        context: "Use to pre-honor a possible no.",
      },
    ],
    cultural_note:
      "Reconnection works better when the message names the gap instead of pretending it does not exist.",
    tip:
      "Use mở lòng for a respectful framing of emotional readiness.",
  },
  {
    id: 191,
    level: "B1",
    title_en: "Roleplay: Reconnecting With An Old Friend",
    subtitle: "First in-person meeting after a long pause.",
    intro:
      "Practice this for a coffee with a friend you have not seen in years.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Lâu thật. Bạn vẫn nhận ra mình không?",
        english: "It has been so long. You still recognize me?",
        pronunciation: "lau that, ban van nhan ra minh khong",
      },
      {
        speaker: "B",
        vietnamese: "Tất nhiên rồi. Có khác chút mà vẫn là bạn.",
        english: "Of course. A bit different, but still you.",
        pronunciation: "tat nhien roy, ko khak chut ma van la ban",
      },
      {
        speaker: "A",
        vietnamese: "Mình hơi lo bữa nay sẽ kỳ kỳ giữa hai đứa.",
        english: "I was a little worried today might feel weird between us.",
        pronunciation: "minh hoi lo bua nay se ki ki giua hai dua",
      },
      {
        speaker: "B",
        vietnamese: "Mình cũng. Mà ngồi xuống một cái thì lại thấy quen liền.",
        english: "Me too. But the second I sat down it felt familiar again.",
        pronunciation: "minh kung, ma ngoy xuong mot kai thi lai thay kwen lien",
      },
      {
        speaker: "A",
        vietnamese: "Mấy năm qua bạn sống ra sao? Kể nghe đi.",
        english: "These last few years, how have you been living? Tell me.",
        pronunciation: "may nam kwa ban song ra sao, ke nghe di",
      },
      {
        speaker: "B",
        vietnamese: "Có nhiều chuyện. Mà bữa nay mình muốn nghe bạn trước.",
        english: "A lot has happened. But today I want to hear you first.",
        pronunciation: "ko nhieu chuyen, ma bua nay minh mwon nghe ban truoc",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn bạn ngồi lại với mình.",
        english: "Thanks for sitting down with me.",
        pronunciation: "kam un ban ngoy lai voi minh",
      },
    ],
    cultural_note:
      "Reunion conversations between Vietnamese friends often start with mutual confession of mild anxiety; this small honesty makes the rest of the conversation easier.",
    tip:
      "Use ngồi xuống một cái thì lại thấy quen liền — it captures the body-memory of long friendship beautifully.",
  },
  {
    id: 192,
    level: "B1",
    title_en: "Roleplay: When A Friend's Spouse Makes You Uneasy",
    subtitle: "Honest, careful conversation with a close friend.",
    intro:
      "Practice this when you do not feel safe around your friend's partner and you need to tell her.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn rảnh không, mình muốn nói một chuyện hơi khó.",
        english: "Are you free? I want to bring up something a bit hard.",
        pronunciation: "ban ranh khong, minh mwon noy mot chuyen hoi kho",
      },
      {
        speaker: "B",
        vietnamese: "Có gì bạn cứ nói, mình nghe.",
        english: "Whatever it is, just say. I am listening.",
        pronunciation: "ko zi ban ku noy, minh nghe",
      },
      {
        speaker: "A",
        vietnamese: "Mình không có ý xen vào nhà bạn. Mà ở gần chồng bạn, mình hay thấy không thoải mái.",
        english: "I do not mean to interfere in your home. But around your husband, I often feel uncomfortable.",
        pronunciation: "minh khong ko y xen vao nha ban, ma u gan chong ban, minh hai thay khong thoai mai",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì cụ thể không?",
        english: "Did something specific happen?",
        pronunciation: "ko chuyen zi ku the khong",
      },
      {
        speaker: "A",
        vietnamese: "Cách ảnh nhìn, cách ảnh nói chuyện với mình. Không tới mức đụng vô, mà mình ngại.",
        english: "The way he looks, the way he talks to me. Nothing physical, but I feel uneasy.",
        pronunciation: "kak anh nhin, kak anh noy chuyen voi minh, khong toi muk dung vo, ma minh ngai",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn bạn đã nói với mình. Mình không gạt cái này qua một bên đâu.",
        english: "Thanks for telling me. I am not going to brush this aside.",
        pronunciation: "kam un ban da noy voi minh, minh khong gat kai nay kwa mot ben dau",
      },
      {
        speaker: "A",
        vietnamese: "Mình sợ nói ra mất bạn luôn, mà giữ lại thì giả tạo.",
        english: "I was scared saying this would cost me you, but staying silent felt fake.",
        pronunciation: "minh so noy ra mat ban luon, ma giu lai thi za tao",
      },
    ],
    cultural_note:
      "Bringing this up risks the friendship; framing it as I do not mean to interfere up front lets your friend hear it without immediate defensiveness.",
    tip:
      "Use giả tạo — naming that silence feels fake gives the truth-telling moral weight.",
  },
  {
    id: 193,
    level: "B1",
    title_en: "Roleplay: Two Generations Of Vietnamese",
    subtitle: "Heritage versus locally-raised conversation.",
    intro:
      "Practice this between a Vietnamese person born in Vietnam and a heritage Vietnamese person, having a real conversation about identity.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn về Việt Nam thấy quen không, hay vẫn lạ?",
        english: "When you come back to Vietnam, does it feel familiar, or still foreign?",
        pronunciation: "ban ve viet nam thay kwen khong, hai van la",
      },
      {
        speaker: "B",
        vietnamese: "Quen lắm cái này, nhưng có cái lại thấy mình giống khách.",
        english: "Very familiar in some ways, but in others I feel like a guest.",
        pronunciation: "kwen lam kai nay, nyung ko kai lai thay minh zong khak",
      },
      {
        speaker: "A",
        vietnamese: "Vậy ở bên đó bạn có thấy mình là người nước ngoài không?",
        english: "And over there, do you ever feel foreign?",
        pronunciation: "vay u ben do ban ko thay minh la nguoi nuoc ngoai khong",
      },
      {
        speaker: "B",
        vietnamese: "Có chứ. Lúc đó người ta nhìn cái mặt mình là biết mình không phải gốc bên đó.",
        english: "Yes. Over there, people look at my face and know I am not native.",
        pronunciation: "ko chu, luk do nguoi ta nhin kai mat minh la biet minh khong phai gok ben do",
      },
      {
        speaker: "A",
        vietnamese: "Mình cũng từng thấy có lỗi kiểu mình không giữ được tiếng Việt như nhà mong đợi.",
        english: "I also used to feel guilty that I did not keep Vietnamese the way my family hoped.",
        pronunciation: "minh kung tung thay ko loi kieu minh khong giu duoc tieng viet nhu nha mong doi",
      },
      {
        speaker: "B",
        vietnamese: "Tới đây mình mới thấy không phải mình ít Việt, mà mình Việt theo một cách khác.",
        english: "I have come to feel I am not less Vietnamese, just Vietnamese in a different way.",
        pronunciation: "toi day minh moi thay khong phai minh it viet, ma minh viet theo mot kak khak",
      },
      {
        speaker: "A",
        vietnamese: "Câu đó hay đó. Mình ghi nhớ.",
        english: "That is a good line. I will remember it.",
        pronunciation: "kau do hai do, minh ghi nho",
      },
    ],
    cultural_note:
      "Identity conversations between heritage and home-raised Vietnamese speakers go deeper when both sides admit small displacements they have felt.",
    tip:
      "Use mình Việt theo một cách khác as a generous, mature self-description that resists either-or framing.",
  },
  {
    id: 194,
    level: "B1",
    title_en: "Telling A Childhood Memory",
    subtitle: "Connected, emotionally textured speech.",
    intro:
      "Use these phrases for a longer narrative when you want to tell someone a real childhood memory.",
    phrases: [
      {
        english: "When I was little, our house was near a small market.",
        vietnamese: "Hồi nhỏ, nhà mình ở gần một cái chợ nhỏ.",
        pronunciation: "hoi nho, nha minh u gan mot kai cho nho",
        context: "Use as a typical Vietnamese opener for childhood memory.",
      },
      {
        english: "Every morning my mom took me with her, one hand holding the basket, the other holding mine.",
        vietnamese: "Sáng nào mẹ cũng dắt mình đi, một tay xách giỏ, một tay nắm mình.",
        pronunciation: "sang nao may kung zat minh di, mot tai xak zo, mot tai nam minh",
        context: "Use as a sensory detail mid-story.",
      },
      {
        english: "One time I got lost and stood in the middle of the market crying loudly.",
        vietnamese: "Có một lần mình bị lạc, đứng giữa chợ khóc um sùm.",
        pronunciation: "ko mot lan minh bi lak, dung giua cho khok um sum",
        context: "Use to introduce a turning point in the memory.",
      },
      {
        english: "Even now I remember I was not scared of being lost; I was scared of making my mom sad.",
        vietnamese: "Tới giờ mình nhớ là mình không sợ đi lạc, mình sợ làm mẹ buồn.",
        pronunciation: "toi gio minh nho la minh khong so di lak, minh so lam may buon",
        context: "Use to land an emotional truth at the end of the memory.",
      },
    ],
    cultural_note:
      "Vietnamese childhood storytelling thrives on sensory detail (chợ, sáng, giỏ) and a final twist that names the real feeling.",
    tip:
      "Notice how the last line reframes the memory — that move (twist + emotional truth) is the heart of native-feeling Vietnamese storytelling.",
  },
  {
    id: 195,
    level: "B1",
    title_en: "Politely Correcting Someone In Public",
    subtitle: "Disagree without making them lose face.",
    intro:
      "Use these phrases when you need to correct a peer or junior in front of others, without humiliating them.",
    phrases: [
      {
        english: "Sorry, just one quick clarification before we go on.",
        vietnamese: "Cho mình chen một câu nhỏ trước khi mình đi tiếp nha.",
        pronunciation: "cho minh chen mot kau nho truoc khi minh di tiep nha",
        context: "Use to insert a correction without freezing the conversation.",
      },
      {
        english: "I think there might be one part that needs adjusting.",
        vietnamese: "Mình thấy có một chỗ cần điều chỉnh chút.",
        pronunciation: "minh thay ko mot cho kun dieu chinh chut",
        context: "Use as a soft entry to the actual correction.",
      },
      {
        english: "Maybe I am wrong, but the original number was different.",
        vietnamese: "Có thể mình sai, mà con số gốc mình nhớ là khác.",
        pronunciation: "ko the minh sai, ma kon so gok minh nho la khak",
        context: "Use a face-saving frame even when you are confident.",
      },
      {
        english: "Let us double check together later, no rush.",
        vietnamese: "Lát mình kiểm tra lại với nhau, không có gấp đâu.",
        pronunciation: "lat minh kiem tra lai voi nhau, khong ko gap dau",
        context: "Use to soften the moment by deferring the resolution.",
      },
    ],
    cultural_note:
      "Public correction is high-risk in Vietnamese culture; the right answer paired with bad delivery often costs more than a wrong answer delivered well.",
    tip:
      "Use có thể mình sai as a real face-saver, even if you are 95 percent sure you are right.",
  },
  {
    id: 196,
    level: "B1",
    title_en: "Roleplay: Talking To Your Dad About Something Real",
    subtitle: "First serious adult conversation with a quiet father.",
    intro:
      "Practice this when you finally sit down to say something hard to a parent who does not usually speak emotionally.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Ba à, tự dưng con muốn nói với ba một chuyện.",
        english: "Dad, suddenly I want to tell you something.",
        pronunciation: "ba a, tu zung kon mwon noy voi ba mot chuyen",
      },
      {
        speaker: "B",
        vietnamese: "Ờ. Có gì con cứ nói.",
        english: "Yeah. Whatever it is, just say.",
        pronunciation: "uh, ko zi kon ku noy",
      },
      {
        speaker: "A",
        vietnamese: "Hồi con còn nhỏ, có nhiều lúc con thấy ba xa lắm.",
        english: "When I was little, a lot of times I felt like you were far away.",
        pronunciation: "hoi kon kon nho, ko nhieu luk kon thay ba xa lam",
      },
      {
        speaker: "B",
        vietnamese: "… Ba biết. Ba lo kiếm tiền, mà nhiều lúc ba quên mặt con.",
        english: "… I know. I was busy earning, and a lot of times I forgot your face.",
        pronunciation: "ba biet, ba lo kiem tien, ma nhieu luk ba kwen mat kon",
      },
      {
        speaker: "A",
        vietnamese: "Con không trách ba đâu. Con chỉ cần ba biết con từng cảm thấy vậy thôi.",
        english: "I am not blaming you. I just need you to know I once felt that way.",
        pronunciation: "kon khong trach ba dau, kon chi kun ba biet kon tung kam thay vay thoy",
      },
      {
        speaker: "B",
        vietnamese: "Ba xin lỗi con. Ba thật sự không biết kể chuyện kiểu này, nhưng ba nghe.",
        english: "I am sorry. I am not good at talking like this, but I am listening.",
        pronunciation: "ba xin loi kon, ba that su khong biet ke chuyen kieu nay, nyung ba nghe",
      },
      {
        speaker: "A",
        vietnamese: "Vậy là đủ rồi ba.",
        english: "That is enough, Dad.",
        pronunciation: "vay la du roy ba",
      },
    ],
    cultural_note:
      "Vietnamese fathers of older generations often did not have language for emotional talk; receiving even a partial response is significant.",
    tip:
      "Use vậy là đủ rồi ba — it gives him grace for an imperfect response and closes the moment with love instead of disappointment.",
  },
  {
    id: 197,
    level: "B1",
    title_en: "Roleplay: Passive Aggressive Coworker",
    subtitle: "Read between the lines and respond cleanly.",
    intro:
      "Practice this when a coworker keeps making sideways comments that pretend to be casual.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Ờ, không sao đâu, em cứ làm theo ý em đi.",
        english: "Oh, no problem, just do it your way.",
        pronunciation: "uh, khong sao dau, em ku lam theo y em di",
      },
      {
        speaker: "B",
        vietnamese: "Chị nói vậy mà em nghe có gì đó không ổn.",
        english: "You say that, but I hear something off.",
        pronunciation: "chi noy vay ma em nghe ko zi do khong on",
      },
      {
        speaker: "A",
        vietnamese: "Có gì đâu, chỉ là hồi xưa chị làm cách khác.",
        english: "Nothing, just that I used to do it differently.",
        pronunciation: "ko zi dau, chi la hoi xua chi lam kak khak",
      },
      {
        speaker: "B",
        vietnamese: "Vậy chị nói thẳng cho em đi, em không giận đâu.",
        english: "Then say it directly to me, I will not get upset.",
        pronunciation: "vay chi noy thang cho em di, em khong zan dau",
      },
      {
        speaker: "A",
        vietnamese: "Chị thấy đoạn đầu em hơi vội. Chị sợ khách hiểu nhầm.",
        english: "I felt the opening was rushed. I worry the client misreads it.",
        pronunciation: "chi thay doan dau em hoi voi, chi so khak hieu nham",
      },
      {
        speaker: "B",
        vietnamese: "Vậy mới rõ ràng. Em sửa lại, cảm ơn chị nói thẳng.",
        english: "Now it is clear. I will revise, thanks for being direct.",
        pronunciation: "vay moi ro rang, em sua lai, kam un chi noy thang",
      },
      {
        speaker: "A",
        vietnamese: "Lần sau có gì chị sẽ nói thẳng từ đầu.",
        english: "Next time I will say it straight from the start.",
        pronunciation: "lan sau ko zi chi se noy thang tu dau",
      },
    ],
    cultural_note:
      "Passive-aggressive comments often hide a real concern. Inviting the direct version cleanly converts tension into work feedback.",
    tip:
      "Use chị nói thẳng cho em đi, em không giận đâu — it removes the social punishment for direct speech.",
  },
  {
    id: 198,
    level: "B1",
    title_en: "Roleplay: Stepping Out Of Office Gossip",
    subtitle: "Decline to amplify a rumor without acting superior.",
    intro:
      "Practice this when colleagues are gossiping at lunch and trying to pull you in.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn nghe vụ chị Lan với sếp chưa?",
        english: "Did you hear about Lan and the boss?",
        pronunciation: "ban nghe vu chi lan voi sep chua",
      },
      {
        speaker: "B",
        vietnamese: "Hơi loáng thoáng à. Mà mình cũng không biết hết câu chuyện.",
        english: "Vaguely. But I do not know the full story.",
        pronunciation: "hoi loang thoang a, ma minh kung khong biet het kau chuyen",
      },
      {
        speaker: "A",
        vietnamese: "Mình kể nha, dữ lắm.",
        english: "Let me tell you, it is wild.",
        pronunciation: "minh ke nha, zu lam",
      },
      {
        speaker: "B",
        vietnamese: "Thôi mình không nghe đâu. Mai gặp chị Lan mình nhìn không tự nhiên được.",
        english: "I will pass. If I see Lan tomorrow I will not act normal.",
        pronunciation: "thoy minh khong nghe dau, mai gap chi lan minh nhin khong tu nhien duoc",
      },
      {
        speaker: "A",
        vietnamese: "Ơ, bạn nghiêm túc dữ vậy.",
        english: "Wow, you are being so serious.",
        pronunciation: "uh, ban nghiem tuk zu vay",
      },
      {
        speaker: "B",
        vietnamese: "Không phải nghiêm túc, chỉ là mình ngại xài tin của người khác làm mồi nói chuyện.",
        english: "Not serious, just uneasy using someone else's life as conversation fuel.",
        pronunciation: "khong phai nghiem tuk, chi la minh ngai xai tin kua nguoi khak lam moi noy chuyen",
      },
      {
        speaker: "A",
        vietnamese: "Ờ ha, hôm nào mình cũng nên vậy.",
        english: "Yeah, true. I should be like that some days too.",
        pronunciation: "uh ha, hom nao minh kung nen vay",
      },
    ],
    cultural_note:
      "Refusing gossip without scolding lands as quiet character; lecturing the gossiper usually backfires.",
    tip:
      "Use ngại xài tin của người khác làm mồi nói chuyện — a precise, non-judgmental refusal.",
  },
  {
    id: 199,
    level: "B1",
    title_en: "Roleplay: An Awkward Family Gathering",
    subtitle: "Cousins, comparison, and quiet survival.",
    intro:
      "Practice this when a relative starts comparing you to a more successful cousin in front of everyone.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Năm nay con Linh nó mua nhà rồi, con biết chưa?",
        english: "This year Linh bought a house, did you know?",
        pronunciation: "nam nay kon linh no mua nha roy, kon biet chua",
      },
      {
        speaker: "B",
        vietnamese: "Dạ con biết, mừng cho chị Linh.",
        english: "Yes, I know. Happy for her.",
        pronunciation: "ya kon biet, mung cho chi linh",
      },
      {
        speaker: "A",
        vietnamese: "Còn con thì sao, có tính mua chưa?",
        english: "And you, are you planning to buy?",
        pronunciation: "kon kon thi sao, ko tinh mua chua",
      },
      {
        speaker: "B",
        vietnamese: "Dạ thời điểm của mỗi người khác nhau, chị Linh có lộ trình của chị, con có của con.",
        english: "Each person has their own timing. She has hers, I have mine.",
        pronunciation: "ya thoi diem kua moi nguoi khak nhau, chi linh ko lo trinh kua chi, kon ko kua kon",
      },
      {
        speaker: "A",
        vietnamese: "Mà cô lo cho con thôi, không có ý gì đâu.",
        english: "I am just worrying about you, nothing else.",
        pronunciation: "ma ko lo cho kon thoy, khong ko y zi dau",
      },
      {
        speaker: "B",
        vietnamese: "Dạ con cảm ơn cô đã quan tâm. Con đang đi đúng nhịp của con.",
        english: "Thank you for caring. I am moving at my own rhythm.",
        pronunciation: "ya kon kam un ko da kwan tam, kon dang di dung nhip kua kon",
      },
      {
        speaker: "A",
        vietnamese: "Ờ, vậy đi. Ăn miếng gỏi đi con.",
        english: "Okay then. Have some salad.",
        pronunciation: "uh, vay di, an mieng goi di kon",
      },
    ],
    cultural_note:
      "Vietnamese family comparisons are repetitive on purpose. A composed, non-defensive answer like nhịp của con shuts the line down without hurting anyone.",
    tip:
      "Use đang đi đúng nhịp của con — it implies confidence without performance.",
  },
  {
    id: 200,
    level: "B1",
    title_en: "Roleplay: Sibling Favoritism Confrontation",
    subtitle: "Name the pattern with parents, gently.",
    intro:
      "Practice this when you finally tell a parent that you have noticed years of favoring your sibling.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mẹ ơi, con muốn nói với mẹ một chuyện hơi khó.",
        english: "Mom, I want to bring up something a bit hard.",
        pronunciation: "may oi, kon mwon noy voi may mot chuyen hoi kho",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì? Sao mặt nghiêm vậy.",
        english: "What is it? Why so serious?",
        pronunciation: "ko chuyen zi, sao mat nghiem vay",
      },
      {
        speaker: "A",
        vietnamese: "Lâu rồi con thấy nhà mình hay thiên về anh hai. Con không trách, nhưng con buồn.",
        english: "For a long time I have noticed our family leans toward older brother. I am not blaming, just sad.",
        pronunciation: "lau roy kon thay nha minh hai thien ve anh hai, kon khong trach, nyung kon buon",
      },
      {
        speaker: "B",
        vietnamese: "Mẹ đâu có thiên ai, mẹ thương đều mà.",
        english: "I do not favor anyone, I love both of you the same.",
        pronunciation: "may dau ko thien ai, may thuong deu ma",
      },
      {
        speaker: "A",
        vietnamese: "Dạ mẹ thương đều, con tin. Mà cách thể hiện hơi khác nhau nhiều lúc, con để ý.",
        english: "Mom, I believe you love us the same. But the way it shows is sometimes different, I notice.",
        pronunciation: "ya may thuong deu, kon tin, ma kak the hien hoi khak nhau nhieu luk, kon de y",
      },
      {
        speaker: "B",
        vietnamese: "… Có thể mẹ vô ý. Con kể mẹ nghe lúc nào con thấy đi.",
        english: "… Maybe I have done it without realizing. Tell me when you have felt it.",
        pronunciation: "ko the may vo y, kon ke may nghe luk nao kon thay di",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn mẹ chịu nghe. Vậy là đủ với con rồi.",
        english: "Thanks for listening. That alone means a lot.",
        pronunciation: "kam un may chiu nghe, vay la du voi kon roy",
      },
    ],
    cultural_note:
      "Naming favoritism without accusation often unlocks repair; framing it as cách thể hiện hơi khác keeps the parent from going defensive.",
    tip:
      "Use vậy là đủ với con rồi when you want to honor a small but real moment of being heard.",
  },
  {
    id: 201,
    level: "B1",
    title_en: "Roleplay: Networking Without Being Fake",
    subtitle: "Real conversation at an industry event.",
    intro:
      "Practice this when you want to introduce yourself meaningfully without the empty handshake script.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh ơi, em có thể đứng cạnh anh một xíu được không.",
        english: "Anh, mind if I stand here with you for a bit?",
        pronunciation: "anh oi, em ko the dung kanh anh mot xiu duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Dạ, được chứ. Em làm bên nào?",
        english: "Sure. What field are you in?",
        pronunciation: "ya, duoc chu, em lam ben nao",
      },
      {
        speaker: "A",
        vietnamese: "Em làm bên product cho công ty fintech nhỏ. Còn anh?",
        english: "Product at a small fintech. You?",
        pronunciation: "em lam ben product cho kong ti fintech nho, kon anh",
      },
      {
        speaker: "B",
        vietnamese: "Anh làm bên đầu tư mạo hiểm, gần đây đang xem fintech khá nhiều.",
        english: "Venture capital, lately looking at fintech a lot.",
        pronunciation: "anh lam ben dau tu mao hiem, gan day dang xem fintech kha nhieu",
      },
      {
        speaker: "A",
        vietnamese: "Vậy may quá. Em không định gửi pitch, em chỉ muốn nghe góc nhìn của anh thôi.",
        english: "Lucky. I am not pitching, just want to hear your perspective.",
        pronunciation: "vay may qua, em khong dinh gui pitch, em chi mwon nghe gok nhin kua anh thoy",
      },
      {
        speaker: "B",
        vietnamese: "Đây cách tiếp cận hay đó, đa số người tới đây là để bán mình.",
        english: "Refreshing approach, most people here come to sell themselves.",
        pronunciation: "day kak tiep kan hai do, da phan nguoi toi day la de ban minh",
      },
      {
        speaker: "A",
        vietnamese: "Sau buổi này em xin số liên lạc anh được không, không có mục đích gì gấp đâu.",
        english: "Could I take your contact after this? No agenda, no rush.",
        pronunciation: "sau buoi nay em xin so lien lak anh duoc khong, khong ko muk dik zi gap dau",
      },
    ],
    cultural_note:
      "Authentic networking lands stronger when you remove the implicit ask; signaling no agenda often opens more doors than the pitch.",
    tip:
      "Use không định gửi pitch, em chỉ muốn nghe góc nhìn của anh — it reframes the encounter as learning, not extracting.",
  },
  {
    id: 202,
    level: "B1",
    title_en: "Roleplay: Confronting A Toxic Coworker",
    subtitle: "Address the pattern without being cruel.",
    intro:
      "Practice this when a coworker keeps undermining you and you finally need to say something one-on-one.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh có vài phút không, em cần nói chuyện riêng một xíu.",
        english: "Got a few minutes? I need to talk one-on-one.",
        pronunciation: "anh ko vai phut khong, em kun noy chuyen rieng mot xiu",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì hả em.",
        english: "What is going on.",
        pronunciation: "ko chuyen zi ha em",
      },
      {
        speaker: "A",
        vietnamese: "Mấy lần họp gần đây, anh hay nói chen vô lúc em đang trình bày.",
        english: "In the recent meetings, you tend to cut in while I am presenting.",
        pronunciation: "may lan hop gan day, anh hai noy chen vo luk em dang trinh bai",
      },
      {
        speaker: "B",
        vietnamese: "Anh đâu có ý gì đâu, anh chỉ bổ sung thôi.",
        english: "I did not mean anything by it, just adding context.",
        pronunciation: "anh dau ko y zi dau, anh chi bo sung thoy",
      },
      {
        speaker: "A",
        vietnamese: "Em không đoán ý anh. Em chỉ nói tác động lên em là em mất nhịp, mất uy tín trước team.",
        english: "I am not guessing your intent. I am naming the impact on me — broken flow, lost authority with the team.",
        pronunciation: "em khong doan y anh, em chi noy tak dong len em la em mat nhip, mat uy tin truoc team",
      },
      {
        speaker: "B",
        vietnamese: "Ờ, vậy lần sau anh chờ em xong rồi hẳn nói thêm.",
        english: "Okay, next time I will wait until you finish.",
        pronunciation: "uh, vay lan sau anh cho em xong roy han noy them",
      },
      {
        speaker: "A",
        vietnamese: "Vậy là đủ. Em cảm ơn anh đã không đẩy lại.",
        english: "That works. Thanks for not deflecting.",
        pronunciation: "vay la du, em kam un anh da khong day lai",
      },
    ],
    cultural_note:
      "Hard one-on-one conversations work when you separate intent from impact: em không đoán ý anh, em chỉ nói tác động.",
    tip:
      "Use cảm ơn anh đã không đẩy lại when the other person took it well — it positively reinforces the right behavior.",
  },
  {
    id: 203,
    level: "B1",
    title_en: "Roleplay: A One-On-One With A Bad Manager",
    subtitle: "Survive the meeting without lying or exploding.",
    intro:
      "Practice this when your manager is checking in and you cannot afford to either suck up or detonate.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em thấy mọi thứ ổn không, có gì cần anh hỗ trợ không?",
        english: "Everything okay on your side? Anything I should support?",
        pronunciation: "em thay moi thu on khong, ko zi kun anh ho tro khong",
      },
      {
        speaker: "B",
        vietnamese: "Dạ ổn ạ, mà em cũng có vài chỗ muốn anh nghe.",
        english: "Mostly okay, but there are a couple of things I would like you to hear.",
        pronunciation: "ya on a, ma em kung ko vai cho mwon anh nghe",
      },
      {
        speaker: "A",
        vietnamese: "Ờ em nói đi.",
        english: "Sure, go ahead.",
        pronunciation: "uh em noy di",
      },
      {
        speaker: "B",
        vietnamese: "Mấy tuần nay yêu cầu hay đổi giữa chừng, em làm xong lại bị thay đổi, hơi tốn năng lượng.",
        english: "Recently requirements have been shifting mid-task; I finish then it is rewritten, it drains energy.",
        pronunciation: "may tuan nay yeu kau hai doi giua chung, em lam xong lai bi thay doi, hoi ton nang luong",
      },
      {
        speaker: "A",
        vietnamese: "Đó là do trên áp xuống, anh biết em đang gánh.",
        english: "That comes down from above, I know you have been carrying it.",
        pronunciation: "do la zo tren ap xuong, anh biet em dang ganh",
      },
      {
        speaker: "B",
        vietnamese: "Em hiểu, mà em mong tuần này mình chốt yêu cầu một lần thôi, không sửa giữa chừng.",
        english: "I understand. But this week I hope we can lock requirements once, no mid-stream rewrites.",
        pronunciation: "em hieu, ma em mong tuan nay minh chot yeu kau mot lan thoy, khong sua giua chung",
      },
      {
        speaker: "A",
        vietnamese: "Ok, anh sẽ giữ phần đó cho em.",
        english: "Okay, I will hold that for you.",
        pronunciation: "ok, anh se giu phan do cho em",
      },
    ],
    cultural_note:
      "Managing up is real Vietnamese workplace skill: empathize with the manager's pressure, then ask for one specific behavior change.",
    tip:
      "Use em hiểu, mà em mong... — empathy plus one ask is more persuasive than complaining.",
  },
  {
    id: 204,
    level: "B1",
    title_en: "Roleplay: Performance Review Going Sideways",
    subtitle: "Stay regulated when feedback feels unfair.",
    intro:
      "Practice this when your review contains a label you disagree with and you do not want to detonate.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Tổng thể anh đánh giá em ở mức Đạt, không vượt kỳ vọng.",
        english: "Overall I am rating you Meets Expectations, not Exceeds.",
        pronunciation: "tong the anh danh gia em u muk dat, khong vuot ki vong",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn anh đã cho biết. Em xin hỏi rõ phần nào em chưa đạt kỳ vọng vượt mức?",
        english: "Thanks for letting me know. Could I ask which areas fell short of Exceeds?",
        pronunciation: "kam un anh da cho biet, em xin hoi ro phan nao em chua dat ki vong vuot muk",
      },
      {
        speaker: "A",
        vietnamese: "Chủ yếu là phần dẫn dắt team, em làm cá nhân tốt mà chưa kéo được người khác.",
        english: "Mainly leading the team — strong individual work, but you have not lifted others yet.",
        pronunciation: "chu yeu la phan zan zat team, em lam ka nhan tot ma chua keo duoc nguoi khak",
      },
      {
        speaker: "B",
        vietnamese: "Em ghi nhận. Mà em muốn lưu ý một dữ kiện để mình cùng xem.",
        english: "I take that in. But I want to flag one data point for us to look at.",
        pronunciation: "em ghi nhan, ma em mwon luu y mot zu kien de minh kung xem",
      },
      {
        speaker: "A",
        vietnamese: "Em nói đi.",
        english: "Go ahead.",
        pronunciation: "em noy di",
      },
      {
        speaker: "B",
        vietnamese: "Quý này em đã onboard hai bạn mới, hai bạn đó đang đạt KPI. Em không tranh cãi đánh giá, em chỉ muốn nó được tính đủ.",
        english: "This quarter I onboarded two new hires, both hitting KPI. I am not arguing the rating, I just want it counted in.",
        pronunciation: "kwy nay em da onboard hai ban moi, hai ban do dang dat KPI, em khong tranh kai danh gia, em chi mwon no duoc tinh du",
      },
      {
        speaker: "A",
        vietnamese: "Hợp lý. Anh cập nhật thêm vào ghi chú, mình review lại quý sau.",
        english: "Fair. I will add that to the notes; we revisit next quarter.",
        pronunciation: "hop ly, anh kap nhat them vao ghi chu, minh review lai kwy sau",
      },
    ],
    cultural_note:
      "Pushing back on a review without losing face is about adding evidence, not arguing the rating; em không tranh cãi, em chỉ muốn nó được tính đủ is the bridge.",
    tip:
      "Use em xin hỏi rõ instead of disagreeing on the spot; it lets you collect specifics before you respond.",
  },
  {
    id: 205,
    level: "B1",
    title_en: "Roleplay: Asking For A Raise",
    subtitle: "Make the case without apologizing for it.",
    intro:
      "Practice this when you have prepared and you sit down with your manager.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em xin nói thẳng vấn đề lương cho gọn nha.",
        english: "Let me be direct about salary, briefly.",
        pronunciation: "em xin noy thang van de luong cho gon nha",
      },
      {
        speaker: "B",
        vietnamese: "Ok em nói đi.",
        english: "Okay, go.",
        pronunciation: "ok em noy di",
      },
      {
        speaker: "A",
        vietnamese: "Sau hai năm em đã mở rộng phạm vi công việc gấp đôi, đồng thời thị trường cho vai trò này tăng khá nhiều.",
        english: "In two years my scope has doubled, and the market for this role has moved up notably.",
        pronunciation: "sau hai nam em da mo rong pham vi kong viec gap doi, dong thoi thi truong cho vai tro nay tang kha nhieu",
      },
      {
        speaker: "B",
        vietnamese: "Cụ thể em đề xuất bao nhiêu.",
        english: "What number are you proposing?",
        pronunciation: "ku the em de xuat bao nhieu",
      },
      {
        speaker: "A",
        vietnamese: "Em đề xuất tăng 18%, đưa em lên đúng giữa khung của thị trường, không phải đỉnh.",
        english: "I propose 18%, putting me at market mid, not top.",
        pronunciation: "em de xuat tang muoi tam phan tram, dua em len dung giua khung kua thi truong, khong phai dinh",
      },
      {
        speaker: "B",
        vietnamese: "Mức đó không nhỏ, anh phải xin trên. Em cho anh hai tuần.",
        english: "That is not small, I have to escalate. Give me two weeks.",
        pronunciation: "muk do khong nho, anh phai xin tren, em cho anh hai tuan",
      },
      {
        speaker: "A",
        vietnamese: "Dạ được. Sau hai tuần mình ngồi lại có quyết định rõ ràng nha anh.",
        english: "Sure. After two weeks let us sit again with a clear answer.",
        pronunciation: "ya duoc, sau hai tuan minh ngoy lai ko kwet dinh ro rang nha anh",
      },
    ],
    cultural_note:
      "A raise conversation goes better with a specific number, a market anchor, and a defined follow-up date — not a vague ask.",
    tip:
      "Use mức giữa khung, không phải đỉnh — it lowers defensiveness while still anchoring an evidence-based number.",
  },
  {
    id: 206,
    level: "B1",
    title_en: "Roleplay: Quitting Respectfully For A Better Offer",
    subtitle: "Leave well even when the new place is exciting.",
    intro:
      "Practice this when you have a competing offer and you owe your current boss a real conversation.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em xin một cuộc nói chuyện riêng nhanh được không.",
        english: "Could we have a quick private conversation?",
        pronunciation: "em xin mot kuok noy chuyen rieng nhanh duoc khong",
      },
      {
        speaker: "B",
        vietnamese: "Có gì em.",
        english: "What is it.",
        pronunciation: "ko zi em",
      },
      {
        speaker: "A",
        vietnamese: "Em đã nhận một offer khác và em đã quyết nhận. Em không định kéo dài chuyện này.",
        english: "I have received another offer and decided to accept. I do not want to drag this out.",
        pronunciation: "em da nhan mot offer khak va em da kwet nhan, em khong dinh keo dai chuyen nay",
      },
      {
        speaker: "B",
        vietnamese: "Counter offer thì sao, anh lo phần đó được.",
        english: "What about a counter? I can handle that.",
        pronunciation: "counter offer thi sao, anh lo phan do duoc",
      },
      {
        speaker: "A",
        vietnamese: "Em quý anh nói thật. Mà chuyện này không phải tiền, em đã suy nghĩ kỹ lắm.",
        english: "I appreciate you saying that honestly. But this is not about money, I have thought it through.",
        pronunciation: "em kwy anh noy that, ma chuyen nay khong phai tien, em da suy nghi ki lam",
      },
      {
        speaker: "B",
        vietnamese: "Vậy anh tôn trọng. Em định bàn giao trong bao lâu.",
        english: "Then I respect that. How long do you envision the handover?",
        pronunciation: "vay anh ton trong, em dinh ban giao trong bao lau",
      },
      {
        speaker: "A",
        vietnamese: "Em đề xuất bốn tuần, có tài liệu, có buổi đào tạo cho người tiếp nhận.",
        english: "I propose four weeks, with documentation and training sessions for the successor.",
        pronunciation: "em de xuat bon tuan, ko tai lieu, ko buoi dao tao cho nguoi tiep nhan",
      },
    ],
    cultural_note:
      "Quitting becomes a reference-defining moment. Refusing the counter cleanly while offering a real handover protects future relationships.",
    tip:
      "Use chuyện này không phải tiền — it short-circuits an expensive negotiation that you do not want.",
  },
  {
    id: 207,
    level: "B1",
    title_en: "Roleplay: The Future Conversation",
    subtitle: "Couple aligns on the next five years.",
    intro:
      "Practice this when you and your partner finally sit down to talk about marriage, kids, location, money — without scripting.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh, em muốn mình nói chuyện nghiêm túc về 5 năm tới.",
        english: "Anh, I want us to have a serious talk about the next five years.",
        pronunciation: "anh, em mwon minh noy chuyen nghiem tuk ve nam nam toi",
      },
      {
        speaker: "B",
        vietnamese: "Ờ, anh cũng nghĩ tới mà chưa biết mở lời sao.",
        english: "Yeah, I have been thinking too, just did not know how to open it.",
        pronunciation: "uh, anh kung nghi toi ma chua biet mo loi sao",
      },
      {
        speaker: "A",
        vietnamese: "Em cứ nói thẳng nha. Em muốn cưới trong vòng hai năm, em muốn có con trước 35.",
        english: "Let me be straight. I want to marry within two years, have a kid before 35.",
        pronunciation: "em ku noy thang nha, em mwon kuoi trong vong hai nam, em mwon ko kon truoc ba muoi lam",
      },
      {
        speaker: "B",
        vietnamese: "Anh cũng muốn cưới em. Mà chuyện con cái anh chưa chắc khi nào sẵn sàng.",
        english: "I want to marry you too. The kids part, I am not sure when I will be ready.",
        pronunciation: "anh kung mwon kuoi em, ma chuyen kon kai anh chua chak khi nao san sang",
      },
      {
        speaker: "A",
        vietnamese: "Em nghe rồi. Mình hai đứa có thể không đồng pha trên cùng một dòng thời gian không.",
        english: "I hear you. Can the two of us still align even when our timing is not in sync?",
        pronunciation: "em nghe roy, minh hai dua ko the khong dong pha tren kung mot zong thoi gian khong",
      },
      {
        speaker: "B",
        vietnamese: "Anh nghĩ được, miễn là mình nói chuyện đều, không giấu nhau cái gì lớn.",
        english: "I think yes, as long as we talk regularly and hide nothing big.",
        pronunciation: "anh nghi duoc, mien la minh noy chuyen deu, khong zau nhau kai zi lon",
      },
      {
        speaker: "A",
        vietnamese: "Vậy mỗi sáu tháng mình ngồi lại check một lần nha.",
        english: "Let us check in like this every six months then.",
        pronunciation: "vay moi sau thang minh ngoy lai check mot lan nha",
      },
    ],
    cultural_note:
      "Future-talk works when both partners can disagree on timeline without it ending the relationship; the ritual of every-six-months check-ins protects against drift.",
    tip:
      "Use không đồng pha trên cùng một dòng thời gian — a precise, modern Vietnamese metaphor for couple-timing mismatch.",
  },
  {
    id: 208,
    level: "B1",
    title_en: "Roleplay: Long-Distance Tension",
    subtitle: "Real fight over a video call.",
    intro:
      "Practice this when you and your partner are far apart and a small thing has become a big one over chat.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Sao mấy ngày qua anh nhắn cho em ngắn ngắn, kiểu lạnh vậy.",
        english: "Why have your messages been so short and cold these last few days?",
        pronunciation: "sao may ngay kwa anh nhan cho em ngan ngan, kieu lanh vay",
      },
      {
        speaker: "B",
        vietnamese: "Anh không có ý lạnh đâu, anh chỉ kiệt sức quá thôi.",
        english: "I did not mean to be cold, I have just been wiped out.",
        pronunciation: "anh khong ko y lanh dau, anh chi kiet suk qua thoy",
      },
      {
        speaker: "A",
        vietnamese: "Mệt thì em hiểu, mà hai chữ ngủ ngon mà cũng không có thì em có cảm giác mình bị đẩy ra.",
        english: "Tiredness I get, but missing even a goodnight makes me feel pushed away.",
        pronunciation: "met thi em hieu, ma hai chu ngu ngon ma kung khong ko thi em ko kam giak minh bi day ra",
      },
      {
        speaker: "B",
        vietnamese: "Xin lỗi em. Anh không nhận ra mấy ngày đó im lặng nó đè nặng cỡ vậy.",
        english: "I am sorry. I did not realize that silence weighed that heavy.",
        pronunciation: "xin loi em, anh khong nhan ra may ngay do im lang no de nang ko vay",
      },
      {
        speaker: "A",
        vietnamese: "Em không cần anh viết nhiều. Một câu nhỏ trước khi ngủ là đủ.",
        english: "I do not need long messages. One small line before sleep is enough.",
        pronunciation: "em khong kun anh viet nhieu, mot kau nho truoc khi ngu la du",
      },
      {
        speaker: "B",
        vietnamese: "Ok, anh sẽ giữ thói quen đó. Em cũng nói cho anh nghe khi anh lạnh đi sớm nha.",
        english: "Okay, I will keep that habit. Tell me earlier when I drift cold, too.",
        pronunciation: "ok, anh se giu thoi kwen do, em kung noy cho anh nghe khi anh lanh di som nha",
      },
      {
        speaker: "A",
        vietnamese: "Ừ. Mình giữ nhau qua cách nhỏ, không phải bằng câu hứa.",
        english: "Yeah. We hold each other through small things, not big promises.",
        pronunciation: "u, minh giu nhau kwa kak nho, khong phai bang kau hua",
      },
    ],
    cultural_note:
      "Long-distance care collapses through small absences first; calling out the small ones early is what saves the relationship.",
    tip:
      "Use giữ nhau qua cách nhỏ — a beautifully native way of describing relational maintenance.",
  },
  {
    id: 209,
    level: "B1",
    title_en: "Roleplay: Naming Subtle Jealousy",
    subtitle: "Honest self-disclosure to a partner.",
    intro:
      "Practice this when you feel jealous about a friend of theirs and want to say it without becoming controlling.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Em muốn nói anh nghe một chuyện em hơi ngại.",
        english: "I want to tell you something I am a bit embarrassed about.",
        pronunciation: "em mwon noy anh nghe mot chuyen em hoi ngai",
      },
      {
        speaker: "B",
        vietnamese: "Em cứ nói, không sao.",
        english: "Go ahead, it is okay.",
        pronunciation: "em ku noy, khong sao",
      },
      {
        speaker: "A",
        vietnamese: "Lúc anh nhắn với chị Hằng đến khuya, em hơi khó chịu trong lòng.",
        english: "When you text Hằng late at night, something in me feels uneasy.",
        pronunciation: "luk anh nhan voi chi hang den khuya, em hoi kho chiu trong long",
      },
      {
        speaker: "B",
        vietnamese: "Anh không có gì với chị đó cả, em yên tâm.",
        english: "There is nothing between us, you can rest easy.",
        pronunciation: "anh khong ko zi voi chi do ka, em yen tam",
      },
      {
        speaker: "A",
        vietnamese: "Em biết anh không có. Nhưng em cũng không muốn giả vờ là em không thấy gì.",
        english: "I know there is nothing. But I do not want to pretend I do not feel anything either.",
        pronunciation: "em biet anh khong ko, nyung em kung khong mwon za vo la em khong thay zi",
      },
      {
        speaker: "B",
        vietnamese: "Cảm ơn em đã nói thẳng. Em thấy điều gì sẽ giúp em nhẹ hơn?",
        english: "Thanks for being direct. What would help you feel lighter?",
        pronunciation: "kam un em da noy thang, em thay dieu zi se zup em nhe hon",
      },
      {
        speaker: "A",
        vietnamese: "Khuya thì mình giảm lại, để dành cho mình thôi. Vậy là đủ.",
        english: "Late at night, dial that down, save it for us. That alone is enough.",
        pronunciation: "khuya thi minh giam lai, de zanh cho minh thoy, vay la du",
      },
    ],
    cultural_note:
      "Naming jealousy to a partner without weaponizing it is a high skill; framing it as a feeling about a behavior, not a verdict about a person, keeps the conversation safe.",
    tip:
      "Use em không muốn giả vờ là em không thấy gì — it makes vulnerability sound like honesty, not insecurity.",
  },
  {
    id: 210,
    level: "B1",
    title_en: "Roleplay: Rebuilding Trust After A Lie",
    subtitle: "Months in, the conversation that decides everything.",
    intro:
      "Practice this when one partner lied months ago and the relationship is finally ready to sit with it again.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mấy tháng rồi nhưng em vẫn còn nặng lòng với chuyện đó.",
        english: "It has been months, but I still carry weight about that thing.",
        pronunciation: "may thang roy nyung em van kon nang long voi chuyen do",
      },
      {
        speaker: "B",
        vietnamese: "Anh hiểu. Anh không xin em quên nhanh đâu.",
        english: "I understand. I am not asking you to forget fast.",
        pronunciation: "anh hieu, anh khong xin em kwen nhanh dau",
      },
      {
        speaker: "A",
        vietnamese: "Em không hỏi để moi lại. Em hỏi để biết em có thể tin lại từ từ không.",
        english: "I am not asking to dig it up. I am asking if I can rebuild trust slowly.",
        pronunciation: "em khong hoi de moi lai, em hoi de biet em ko the tin lai tu tu khong",
      },
      {
        speaker: "B",
        vietnamese: "Anh sẵn sàng làm bất cứ chuyện gì hợp lý để em an tâm. Em nói điều cụ thể đi.",
        english: "I am willing to do anything reasonable so you feel safe. Tell me a specific thing.",
        pronunciation: "anh san sang lam bat ku chuyen zi hop ly de em an tam, em noy dieu ku the di",
      },
      {
        speaker: "A",
        vietnamese: "Cuối tuần đầu mỗi tháng, mình ngồi 30 phút, anh kể em nghe tuần đó có gì em cần biết.",
        english: "First weekend each month, we sit 30 minutes, you tell me what I should know from that month.",
        pronunciation: "kuoy tuan dau moi thang, minh ngoy ba muoi phut, anh ke em nghe tuan do ko zi em kun biet",
      },
      {
        speaker: "B",
        vietnamese: "Anh đồng ý. Anh thà mệt vì giải trình, còn hơn để em nghi.",
        english: "I agree. I would rather tire from explaining than leave you suspicious.",
        pronunciation: "anh dong y, anh tha met vi giai trinh, kon hon de em nghi",
      },
      {
        speaker: "A",
        vietnamese: "Vậy mình thử ba tháng. Sau đó mình đánh giá lại.",
        english: "Let us try three months, then reassess.",
        pronunciation: "vay minh thu ba thang, sau do minh danh gia lai",
      },
    ],
    cultural_note:
      "Trust repair works as a structured ritual, not a single conversation; agreeing on a recurring check-in beats every dramatic apology.",
    tip:
      "Use em không hỏi để moi lại — preempting the suspicion that you are weaponizing the past keeps the door open.",
  },
  {
    id: 211,
    level: "B1",
    title_en: "Roleplay: Difficult Mother-In-Law",
    subtitle: "Talk to your spouse, not the in-law, first.",
    intro:
      "Practice this when your in-law's behavior is hurting you and you need your spouse to step in.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Anh rảnh không, em cần nói chuyện về mẹ một xíu.",
        english: "Got a minute? I need to talk about your mom.",
        pronunciation: "anh ranh khong, em kun noy chuyen ve may mot xiu",
      },
      {
        speaker: "B",
        vietnamese: "Có chuyện gì hả em.",
        english: "What is going on.",
        pronunciation: "ko chuyen zi ha em",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ hay vô bếp khi em đang nấu, sửa tay em, kiểu em làm gì cũng chưa đúng.",
        english: "Mom keeps coming into the kitchen, correcting my hands, like nothing I do is right.",
        pronunciation: "may hai vo bep khi em dang nau, sua tai em, kieu em lam zi kung chua dung",
      },
      {
        speaker: "B",
        vietnamese: "Mẹ thương em mà, không có ý xấu đâu.",
        english: "Mom likes you, she does not mean anything bad.",
        pronunciation: "may thuong em ma, khong ko y xau dau",
      },
      {
        speaker: "A",
        vietnamese: "Em không nói mẹ ác. Em chỉ nói cảm giác em khi đó. Em ngại nấu trong nhà mình luôn.",
        english: "I am not saying she is mean. I am saying how it feels for me. I now hesitate to cook in our own house.",
        pronunciation: "em khong noy may ak, em chi noy kam giak em khi do, em ngai nau trong nha minh luon",
      },
      {
        speaker: "B",
        vietnamese: "Vậy em muốn anh nói với mẹ kiểu nào.",
        english: "So how do you want me to talk to her.",
        pronunciation: "vay em mwon anh noy voi may kieu nao",
      },
      {
        speaker: "A",
        vietnamese: "Anh nói nhẹ thôi, kiểu nhà mình có cách của tụi con, mời mẹ ngồi đợi cơm cho ấm cúng.",
        english: "Soft tone, something like our home has our own way, invite her to sit and wait for the meal as family.",
        pronunciation: "anh noy nhe thoy, kieu nha minh ko kak kua tui kon, moi may ngoi doi kom cho am kung",
      },
    ],
    cultural_note:
      "Most in-law tension is best handled by the blood relative, not the spouse; coordinating the script before delivery is the saving move.",
    tip:
      "Use em không nói mẹ ác, em chỉ nói cảm giác em — separating intent from impact protects both sides.",
  },
  {
    id: 212,
    level: "B1",
    title_en: "Roleplay: Code-Switching With Parents",
    subtitle: "Heritage speaker negotiating language at home.",
    intro:
      "Practice this when your parents prefer Vietnamese but your reflex switches to English during emotional moments.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Sao con cứ chuyển qua tiếng Anh hoài vậy con?",
        english: "Why do you keep switching to English on me?",
        pronunciation: "sao kon ku chuyen kwa tieng anh hoai vay kon",
      },
      {
        speaker: "B",
        vietnamese: "Tại lúc xúc động, đầu con bật qua tiếng Anh tự nhiên.",
        english: "When I get emotional, my brain flips to English automatically.",
        pronunciation: "tai luk xuk dong, dau kon bat kwa tieng anh tu nhien",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ nghe không hiểu, mẹ thấy mình bị bỏ ngoài.",
        english: "I cannot follow, I feel left out.",
        pronunciation: "may nghe khong hieu, may thay minh bi bo ngoai",
      },
      {
        speaker: "B",
        vietnamese: "Con xin lỗi. Con không cố ý bỏ mẹ ngoài. Con chỉ chậm hơn khi nói tiếng Việt thôi.",
        english: "Sorry, mom. I am not deliberately shutting you out. I am just slower in Vietnamese.",
        pronunciation: "kon xin loi, kon khong ko y bo may ngoai, kon chi cham hon khi noy tieng viet thoy",
      },
      {
        speaker: "A",
        vietnamese: "Con cứ chậm, mẹ chờ. Mẹ không cần con nói nhanh, mẹ cần nghe con thật.",
        english: "Take your time, I will wait. I do not need fast, I need real.",
        pronunciation: "kon ku cham, may cho, may khong kun kon noy nhanh, may kun nghe kon that",
      },
      {
        speaker: "B",
        vietnamese: "Vậy con sẽ nói tiếng Việt với mẹ, dù vấp.",
        english: "Then I will speak Vietnamese with you, even stumbling.",
        pronunciation: "vay kon se noy tieng viet voi may, zu vap",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ thương con vì câu đó.",
        english: "I love you for that line.",
        pronunciation: "may thuong kon vi kau do",
      },
    ],
    cultural_note:
      "Heritage code-switching is rarely about laziness; making the brain mechanism explicit (đầu con bật qua tiếng Anh) is what melts the parent's hurt.",
    tip:
      "Use vấp instead of nói sai — it sounds humble and self-aware without performing shame.",
  },
  {
    id: 213,
    level: "B1",
    title_en: "Roleplay: Translating For Your Parent At A Clinic",
    subtitle: "Heritage child accompanying parent to a doctor.",
    intro:
      "Practice this when you are the bridge between a Vietnamese-speaking parent and an English-speaking doctor.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mẹ ơi, bác sĩ hỏi mẹ đau ở đâu nhiều nhất, từ lúc nào.",
        english: "Mom, the doctor asks where it hurts the most and since when.",
        pronunciation: "may oi, bak si hoi may dau u dau nhieu nhat, tu luk nao",
      },
      {
        speaker: "B",
        vietnamese: "Bụng dưới này nè, đau gần một tháng, mà cô vẫn ráng đi làm.",
        english: "Lower belly here, hurting almost a month, but I kept working.",
        pronunciation: "bung zuoi nay ne, dau gan mot thang, ma ko van rang di lam",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ nói nguyên một câu giúp con, đừng giấu, để con dịch đầy đủ cho bác sĩ.",
        english: "Tell me the whole sentence, do not hide anything, so I translate fully.",
        pronunciation: "may noy nguyen mot kau zup kon, dung zau, de kon zik day du cho bak si",
      },
      {
        speaker: "B",
        vietnamese: "Đau âm ỉ, có lúc nhói lên dữ. Tối ngủ không được luôn.",
        english: "Dull ache, sometimes sharp. Cannot sleep at night.",
        pronunciation: "dau am i, ko luk nhoi len zu, toi ngu khong duoc luon",
      },
      {
        speaker: "A",
        vietnamese: "Ok, con dịch đúng nguyên lời mẹ luôn nha, không giảm bớt.",
        english: "Okay, I will translate exactly, I will not soften it.",
        pronunciation: "ok, kon zik dung nguyen loi may luon nha, khong giam bot",
      },
      {
        speaker: "B",
        vietnamese: "Con dịch sao nó mà thấy con thương mẹ là được.",
        english: "Translate so they see you love your mom, that is enough.",
        pronunciation: "kon zik sao no ma thay kon thuong may la duoc",
      },
      {
        speaker: "A",
        vietnamese: "Dạ. Mẹ cứ nói thật, con bảo vệ mẹ phần này.",
        english: "Yes. You speak truthfully, I will protect you on this side.",
        pronunciation: "ya, may ku noy that, kon bao ve may phan nay",
      },
    ],
    cultural_note:
      "Heritage children translating for parents often soften medical truth out of love; full, exact translation is the real form of care here.",
    tip:
      "Use con bảo vệ mẹ phần này — it makes interpreting feel like protection, which it is.",
  },
  {
    id: 214,
    level: "B1",
    title_en: "Roleplay: Returning To Vietnam After Many Years",
    subtitle: "First evening with relatives, ten years later.",
    intro:
      "Practice this when you are sitting with relatives the first night you are back, not knowing where to start.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Mười năm rồi cháu mới về, không biết bắt đầu từ đâu nữa.",
        english: "Ten years gone, I do not even know where to start.",
        pronunciation: "muoi nam roy chau moi ve, khong biet bat dau tu dau nua",
      },
      {
        speaker: "B",
        vietnamese: "Không cần kể hết đâu cháu. Cứ ngồi đây ăn cơm với cô là đủ.",
        english: "You do not have to recount everything. Sit and eat with me, that is enough.",
        pronunciation: "khong kun ke het dau chau, ku ngoy day an kom voi ko la du",
      },
      {
        speaker: "A",
        vietnamese: "Cháu có cảm giác mình lạ với chính nhà mình.",
        english: "I feel like a stranger inside my own family.",
        pronunciation: "chau ko kam giak minh la voi chinh nha minh",
      },
      {
        speaker: "B",
        vietnamese: "Cô hiểu. Mà nhà mình không bỏ cháu đi đâu hết.",
        english: "I understand. But this family did not move on without you.",
        pronunciation: "ko hieu, ma nha minh khong bo chau di dau het",
      },
      {
        speaker: "A",
        vietnamese: "Có nhiều thứ thay đổi, đường xá, tiệm xưa, mà tiếng nói của cô vẫn vậy.",
        english: "So much changed — streets, old shops — but your voice is still the same.",
        pronunciation: "ko nhieu thu thay doi, duong xa, tiem xua, ma tieng noy kua ko van vay",
      },
      {
        speaker: "B",
        vietnamese: "Cô vẫn đợi cháu về. Lúc nào cũng đợi.",
        english: "I have always been waiting for you to come home. Always.",
        pronunciation: "ko van doi chau ve, luk nao kung doi",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn cô đã không quên cháu.",
        english: "Thanks for not forgetting me.",
        pronunciation: "kam un ko da khong kwen chau",
      },
    ],
    cultural_note:
      "Returning Vietnamese-overseas conversations work better when the elder takes the pressure off; the act of eating together carries the meaning words cannot.",
    tip:
      "Use cảm ơn cô đã không quên cháu — a quiet, native line that lands deep without melodrama.",
  },
  {
    id: 215,
    level: "B1",
    title_en: "Roleplay: A Cultural Misunderstanding At Work",
    subtitle: "Repair across two cultural defaults.",
    intro:
      "Practice this when a colleague from another culture has read your Vietnamese politeness as evasion.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn đồng ý hôm trước rồi mà sao giờ kết quả khác?",
        english: "You agreed the other day, so why is the result different now?",
        pronunciation: "ban dong y hom truoc roy ma sao gio ket kwa khak",
      },
      {
        speaker: "B",
        vietnamese: "Mình nghĩ chắc có hiểu nhầm. Hôm đó mình nói để xem, mà ở đây nó hay có nghĩa là chưa chắc.",
        english: "There may have been a misunderstanding. That day I said let me see, which here often means not sure yet.",
        pronunciation: "minh nghi chak ko hieu nham, hom do minh noy de xem, ma u day no hai ko nghia la chua chak",
      },
      {
        speaker: "A",
        vietnamese: "Ơ, mình tưởng bạn đồng ý rồi luôn.",
        english: "Oh, I thought that meant agreed already.",
        pronunciation: "uh, minh tuong ban dong y roy luon",
      },
      {
        speaker: "B",
        vietnamese: "Lỗi mình không nói rõ hơn. Để xem trong văn hoá mình đôi khi là phép lịch sự.",
        english: "It is on me for not being clearer. Let me see in our culture is sometimes politeness, not yes.",
        pronunciation: "loi minh khong noy ro hon, de xem trong van hoa minh doi khi la phep lich su",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn bạn nói cho mình biết. Lần sau bạn cứ nói no nha, mình không buồn đâu.",
        english: "Thanks for explaining. Next time, just say no, I will not be hurt.",
        pronunciation: "kam un ban noy cho minh biet, lan sau ban ku noy no nha, minh khong buon dau",
      },
      {
        speaker: "B",
        vietnamese: "Ok, mình sẽ làm vậy. Cảm ơn bạn không lấy chuyện này làm to.",
        english: "Okay, I will. Thanks for not blowing this up.",
        pronunciation: "ok, minh se lam vay, kam un ban khong lay chuyen nay lam to",
      },
      {
        speaker: "A",
        vietnamese: "Mình muốn làm việc lâu dài, thì mình phải hiểu cách nói của nhau.",
        english: "If we want to work together long-term, we have to understand each other's speech.",
        pronunciation: "minh mwon lam viec lau zai, thi minh phai hieu kak noy kua nhau",
      },
    ],
    cultural_note:
      "Cross-cultural confusion at work in Vietnam usually traces back to politeness phrases like để xem; explaining the cultural code rather than apologizing for it is the modern adult move.",
    tip:
      "Use để xem trong văn hoá mình đôi khi là phép lịch sự — a clean cultural unpacking phrase.",
  },
  {
    id: 216,
    level: "B1",
    title_en: "Roleplay: Generational Expectation Push",
    subtitle: "Quietly stand your ground at the family table.",
    intro:
      "Practice this when an older relative pushes you toward a path you have already opted out of.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Cháu không nghĩ tới chuyện học lên Master nữa hả?",
        english: "Are you not thinking about a Master's anymore?",
        pronunciation: "chau khong nghi toi chuyen hok len master nua ha",
      },
      {
        speaker: "B",
        vietnamese: "Dạ cháu cân nhắc lâu rồi, hiện tại cháu đi hướng khác.",
        english: "I considered it for a long time. I am going in a different direction now.",
        pronunciation: "ya chau kan nhak lau roy, hien tai chau di huong khak",
      },
      {
        speaker: "A",
        vietnamese: "Hồi xưa nhà mình ai cũng cố học lên cho cao.",
        english: "In the old days everyone in the family tried to climb the degree.",
        pronunciation: "hoi xua nha minh ai kung ko hok len cho kao",
      },
      {
        speaker: "B",
        vietnamese: "Cháu hiểu cô. Mà thị trường giờ khác, kinh nghiệm thực tế cháu cần hơn bằng nữa.",
        english: "I understand you. But the market today is different; real experience matters more for me than another degree.",
        pronunciation: "chau hieu ko, ma thi truong gio khak, kinh nghiem thuk te chau kun hon bang nua",
      },
      {
        speaker: "A",
        vietnamese: "Ờ, miễn cháu suy nghĩ kỹ là được.",
        english: "Alright, as long as you have thought it through.",
        pronunciation: "uh, mien chau suy nghi ki la duoc",
      },
      {
        speaker: "B",
        vietnamese: "Cháu hứa, không có quyết bộc phát đâu. Cháu cũng vẫn tiếp tục học, chỉ là theo kiểu khác.",
        english: "I promise, this is not impulsive. I am still learning, just in a different format.",
        pronunciation: "chau hua, khong ko kwet bok phat dau, chau kung van tiep tuk hok, chi la theo kieu khak",
      },
      {
        speaker: "A",
        vietnamese: "Vậy thôi, cô không ép. Có gì tới hỏi cô nha.",
        english: "Alright then, no pressure. Come ask me if you need anything.",
        pronunciation: "vay thoy, ko khong ep, ko zi toi hoi ko nha",
      },
    ],
    cultural_note:
      "Generational expectation is real but rarely is it pure control; framing your alternative as still learning, just differently honors the elder while protecting your path.",
    tip:
      "Use vẫn tiếp tục học, chỉ là theo kiểu khác — it bridges old values with new realities elegantly.",
  },
  {
    id: 217,
    level: "B1",
    title_en: "Roleplay: A Late-Night Call From Abroad",
    subtitle: "Loneliness named without performing collapse.",
    intro:
      "Practice this when you live abroad and call home at midnight with no real plan, just needing voice.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Khuya rồi mà sao con gọi vậy con.",
        english: "It is late, why are you calling now?",
        pronunciation: "khuya roy ma sao kon goi vay kon",
      },
      {
        speaker: "B",
        vietnamese: "Không có gì gấp đâu mẹ. Con chỉ muốn nghe tiếng mẹ một xíu.",
        english: "Nothing urgent, mom. I just wanted to hear your voice for a bit.",
        pronunciation: "khong ko zi gap dau may, kon chi mwon nghe tieng may mot xiu",
      },
      {
        speaker: "A",
        vietnamese: "Bên đó tối lắm phải không.",
        english: "It is dark over there, no?",
        pronunciation: "ben do toi lam phai khong",
      },
      {
        speaker: "B",
        vietnamese: "Tối, lạnh, mà cái lạnh không phải do trời thôi mẹ.",
        english: "Dark, cold — and the cold is not just from the weather, mom.",
        pronunciation: "toi, lanh, ma kai lanh khong phai zo troi thoy may",
      },
      {
        speaker: "A",
        vietnamese: "Mẹ biết con. Hôm nay ăn gì chưa?",
        english: "I know, son. Have you eaten today?",
        pronunciation: "may biet kon, hom nay an zi chua",
      },
      {
        speaker: "B",
        vietnamese: "Có ăn rồi. Mà nhớ canh chua mẹ nấu kinh khủng.",
        english: "I ate. But I miss your sour soup so badly.",
        pronunciation: "ko an roy, ma nho kanh chua may nau kinh khung",
      },
      {
        speaker: "A",
        vietnamese: "Khi nào về mẹ nấu liền. Giờ cứ nghe tiếng mẹ, ngủ được thì ngủ nha con.",
        english: "Whenever you return, I will cook it right away. For now, listen to my voice and sleep if you can.",
        pronunciation: "khi nao ve may nau lien, gio ku nghe tieng may, ngu duoc thi ngu nha kon",
      },
    ],
    cultural_note:
      "Diaspora loneliness rarely needs solving; it needs witnessing. The mom keeping the call going without prying is the love.",
    tip:
      "Use cái lạnh không phải do trời thôi mẹ — a quiet, native way of naming homesickness.",
  },
  {
    id: 218,
    level: "B1",
    title_en: "When Winning Feels Empty",
    subtitle: "Talk about the strange flatness after a success.",
    intro:
      "Use these phrases when you finally got the thing you wanted and the feeling did not arrive.",
    phrases: [
      {
        english: "I got promoted but I do not feel anything, and that scares me.",
        vietnamese: "Mình lên chức rồi mà không thấy gì, hơi sợ luôn.",
        pronunciation: "minh len chuk roy ma khong thay zi, hoi so luon",
        context: "Use when admitting the absence of expected joy.",
      },
      {
        english: "I thought reaching this would make me settle; instead, I am unsettled.",
        vietnamese: "Mình tưởng tới đây là yên, mà ngược lại, mình thấy chông chênh hơn.",
        pronunciation: "minh tuong toi day la yen, ma nguoc lai, minh thay chong chenh hon",
        context: "Use to name the post-success disorientation.",
      },
      {
        english: "Maybe I was running toward this because running was the comfort.",
        vietnamese: "Hay là mình chạy về phía đó vì chạy là thứ làm mình thấy quen.",
        pronunciation: "hai la minh chay ve phia do vi chay la thu lam minh thay kwen",
        context: "Use to question whether the goal was the real goal.",
      },
      {
        english: "I do not need to know the answer tonight. I just want to say it out loud.",
        vietnamese: "Mình không cần biết câu trả lời tối nay. Mình chỉ muốn nói ra thôi.",
        pronunciation: "minh khong kun biet kau tra loi toi nay, minh chi mwon noy ra thoy",
        context: "Use to give yourself permission to feel without resolving.",
      },
    ],
    cultural_note:
      "Vietnamese rarely names post-achievement emptiness because it can sound ungrateful; saying it to a trusted friend is a quiet act of self-honesty.",
    tip:
      "Use chông chênh — a beautifully precise word for unsettled-after-the-summit.",
  },
  {
    id: 219,
    level: "B1",
    title_en: "Recognizing Fake Politeness",
    subtitle: "Hear the smile under a sentence and respond.",
    intro:
      "Use these phrases to flag and respond when someone is being polite-on-the-surface but cold underneath.",
    phrases: [
      {
        english: "She sounds polite, but her eyes say something else.",
        vietnamese: "Bạn nói nghe lễ phép, mà ánh mắt nói khác.",
        pronunciation: "ban noy nghe le phep, ma anh mat noy khak",
        context: "Use when describing a fake-polite encounter to someone else.",
      },
      {
        english: "I am not going to call it out now, but I noticed.",
        vietnamese: "Mình không nói ra liền đâu, mà mình có để ý.",
        pronunciation: "minh khong noy ra lien dau, ma minh ko de y",
        context: "Use to internally acknowledge what someone is doing.",
      },
      {
        english: "If you actually had a problem with me, I would rather you say it.",
        vietnamese: "Nếu bạn có vấn đề với mình thật, mình thà bạn nói thẳng.",
        pronunciation: "new ban ko van de voi minh that, minh tha ban noy thang",
        context: "Use one-on-one to invite directness.",
      },
      {
        english: "Surface kindness without warmth is its own kind of distance.",
        vietnamese: "Tử tế bề ngoài mà không có ấm áp, cũng là một kiểu xa cách.",
        pronunciation: "tu te be ngoai ma khong ko am ap, kung la mot kieu xa kak",
        context: "Use as a quiet observation to a confidant.",
      },
    ],
    cultural_note:
      "Fake politeness is socially common; calling it out badly burns bridges, but quietly noticing it sharpens your social radar.",
    tip:
      "Use ánh mắt nói khác — concrete, observational, hard to argue with.",
  },
  {
    id: 220,
    level: "B1",
    title_en: "Helping Someone Save Face",
    subtitle: "Cover quietly when someone slips publicly.",
    intro:
      "Use these phrases when a friend or colleague has visibly fumbled and you can help cover.",
    phrases: [
      {
        english: "Wait, I think I asked the question wrong, let me ask again.",
        vietnamese: "Khoan, hình như mình hỏi không rõ, để mình hỏi lại nha.",
        pronunciation: "khoan, hinh nhu minh hoi khong ro, de minh hoi lai nha",
        context: "Use to take blame for confusion that was not yours.",
      },
      {
        english: "I think the slide had a typo; it is not his fault.",
        vietnamese: "Mình nghĩ slide bị lỗi đánh máy thôi, không phải lỗi của ảnh.",
        pronunciation: "minh nghi slide bi loi danh mai thoy, khong phai loi kua anh",
        context: "Use to redirect blame from a person to a thing.",
      },
      {
        english: "Let us move on and come back to this part later.",
        vietnamese: "Mình đi tiếp, lát nữa quay lại chỗ này sau cho rõ.",
        pronunciation: "minh di tiep, lat nua kway lai cho nay sau cho ro",
        context: "Use to spare someone in real time.",
      },
      {
        english: "After the meeting I will tell you the trick I used; it saved me last year.",
        vietnamese: "Họp xong mình kể bạn nghe cái mẹo mình từng dùng, nó cứu mình năm ngoái.",
        pronunciation: "hop xong minh ke ban nghe kai meo minh tung zung, no kuu minh nam ngoai",
        context: "Use to teach without shaming.",
      },
    ],
    cultural_note:
      "Vietnamese workplaces remember silent face-saving for years. Helping discreetly often pays back later in unexpected ways.",
    tip:
      "Use mình hỏi không rõ — taking the blame for a confusion is the cleanest face-save.",
  },
  {
    id: 221,
    level: "B1",
    title_en: "Handling Public Embarrassment",
    subtitle: "Stay regulated when the room sees you slip.",
    intro:
      "Use these phrases when something has just made you visibly red and you need to keep the moment small.",
    phrases: [
      {
        english: "Okay, that one is on me. Let me try that again.",
        vietnamese: "Ok, cái này mình sai, để mình thử lại.",
        pronunciation: "ok, kai nay minh sai, de minh thu lai",
        context: "Use to claim the slip without amplifying.",
      },
      {
        english: "Wait, my mind blanked, give me a second.",
        vietnamese: "Khoan, mình đứng hình tí, cho mình một giây.",
        pronunciation: "khoan, minh dung hinh ti, cho minh mot zay",
        context: "Use to buy time without pretending nothing happened.",
      },
      {
        english: "Honestly, that was awkward, but we can move past it.",
        vietnamese: "Thiệt là hơi quê, mà mình đi tiếp đi cho lẹ.",
        pronunciation: "thiet la hoi kwe, ma minh di tiep di cho le",
        context: "Use to disarm an awkward moment with humor.",
      },
      {
        english: "Thanks for not making a big thing out of that.",
        vietnamese: "Cảm ơn mọi người không làm to chuyện cái đó.",
        pronunciation: "kam un moi nguoi khong lam to chuyen kai do",
        context: "Use after the room moved on to acknowledge it briefly.",
      },
    ],
    cultural_note:
      "Public embarrassment in Vietnamese culture often gets quietly forgiven if the person handles it with grace; doubling down on shame is what makes it stick.",
    tip:
      "Use đứng hình — modern, native, and admits the freeze without sounding fragile.",
  },
  {
    id: 222,
    level: "B1",
    title_en: "Naming Social Anxiety",
    subtitle: "Tell a friend why you cannot do the gathering.",
    intro:
      "Use these phrases when an event sounds too much and you want to be honest, not invent fake reasons.",
    phrases: [
      {
        english: "I want to come, but my anxiety with crowds is acting up these days.",
        vietnamese: "Mình muốn đi, mà dạo này đám đông làm mình ngộp.",
        pronunciation: "minh mwon di, ma zao nay dam dong lam minh ngop",
        context: "Use when honestly turning down a noisy event.",
      },
      {
        english: "It is not that I do not love you all, my body just shuts down halfway.",
        vietnamese: "Không phải mình không thương mọi người, mà tới giữa chừng cơ thể mình tự tắt máy.",
        pronunciation: "khong phai minh khong thuong moi nguoi, ma toi giua chung ko the minh tu tat mai",
        context: "Use to make somatic anxiety legible without medicalizing.",
      },
      {
        english: "Could we do something smaller, just three people, low light?",
        vietnamese: "Mình làm cái gì nhỏ hơn không, ba người thôi, chỗ nào yên yên.",
        pronunciation: "minh lam kai zi nho hon khong, ba nguoi thoy, cho nao yen yen",
        context: "Use to negotiate a manageable alternative.",
      },
      {
        english: "Please do not push me; gentle invites land better with me lately.",
        vietnamese: "Đừng ép mình nha, dạo này lời mời nhẹ nhẹ mình mới nhận được.",
        pronunciation: "dung ep minh nha, zao nay loi moi nhe nhe minh moi nhan duoc",
        context: "Use to ask for low-pressure communication style.",
      },
    ],
    cultural_note:
      "Vietnamese social anxiety vocabulary is still emerging in everyday speech; somatic phrases like cơ thể tự tắt máy land much better than clinical labels.",
    tip:
      "Use ngộp — short, native, and instantly understood as overwhelm.",
  },
  {
    id: 223,
    level: "B1",
    title_en: "When A Friendship Is Drifting",
    subtitle: "Notice it before it disappears.",
    intro:
      "Use these phrases to talk to a friend you can feel slipping away.",
    phrases: [
      {
        english: "I do not know if you noticed, but we have been kind of distant lately.",
        vietnamese: "Không biết bạn có để ý không, mà mình thấy hai đứa dạo này xa xa.",
        pronunciation: "khong biet ban ko de y khong, ma minh thay hai dua zao nay xa xa",
        context: "Use to softly open the topic.",
      },
      {
        english: "I am not asking for an explanation; I just wanted to name it.",
        vietnamese: "Mình không hỏi lý do, mình chỉ muốn nói ra cho hai đứa cùng biết.",
        pronunciation: "minh khong hoi ly zo, minh chi mwon noy ra cho hai dua kung biet",
        context: "Use to lower the pressure before they answer.",
      },
      {
        english: "If life is just busy, that is fine; I just do not want it to drift by accident.",
        vietnamese: "Nếu chỉ là cuộc sống bận, mình ok; mình chỉ không muốn xa nhau vì lười.",
        pronunciation: "new chi la kuok song ban, minh ok, minh chi khong mwon xa nhau vi luoi",
        context: "Use to differentiate busy-drift from real-drift.",
      },
      {
        english: "If we still want this friendship, we have to put it on the calendar like real things.",
        vietnamese: "Nếu hai đứa vẫn muốn giữ tình bạn này, phải đặt lịch đàng hoàng như mọi việc khác.",
        pronunciation: "new hai dua van mwon giu tinh ban nay, phai dat lich dang hoang nhu moi viec khak",
        context: "Use to suggest a concrete repair mechanism.",
      },
    ],
    cultural_note:
      "Adult Vietnamese friendships often disappear quietly through accumulated busy-ness; naming it without blame is what saves them.",
    tip:
      "Use xa nhau vì lười — disarmingly self-honest, makes the other person laugh and admit it.",
  },
  {
    id: 224,
    level: "B1",
    title_en: "When You Avoid Confrontation On Purpose",
    subtitle: "Tell a friend why, and ask if it is okay this time.",
    intro:
      "Use these phrases when you are deliberately not addressing something and you want a friend to know you chose this.",
    phrases: [
      {
        english: "I know you are waiting for me to push back. I decided not to this time.",
        vietnamese: "Mình biết bạn đợi mình lên tiếng. Mà lần này mình quyết im đi.",
        pronunciation: "minh biet ban doi minh len tieng, ma lan nay minh kwet im di",
        context: "Use to tell a friend you are choosing silence consciously.",
      },
      {
        english: "It is not that I cannot fight, it is that I am tired of every battle being mine.",
        vietnamese: "Không phải mình không cãi được, là mình mệt vì trận nào cũng tới phiên mình.",
        pronunciation: "khong phai minh khong kai duoc, la minh met vi tran nao kung toi phien minh",
        context: "Use to name the cost of being the always-direct one.",
      },
      {
        english: "If they bring it up, I will deal with it. I just refuse to start it.",
        vietnamese: "Nếu họ mở lời, mình sẽ xử. Mình chỉ không chịu mở trước.",
        pronunciation: "new ho mo loi, minh se xu, minh chi khong chiu mo truoc",
        context: "Use to set the limit of your own engagement.",
      },
      {
        english: "Tell me later if you think I am avoiding too much; I trust your read.",
        vietnamese: "Sau này bạn thấy mình né nhiều quá thì nói mình nghe, mình tin bạn đánh giá đúng.",
        pronunciation: "sau nay ban thay minh ne nhieu kwa thi noy minh nghe, minh tin ban danh gia dung",
        context: "Use to keep yourself accountable through a friend.",
      },
    ],
    cultural_note:
      "Choosing not to confront is not the same as fearing confrontation; the difference shows up in whether you can name it.",
    tip:
      "Use trận nào cũng tới phiên mình — captures direct-person fatigue better than literal language.",
  },
  {
    id: 225,
    level: "B1",
    title_en: "Reaching Out After Years (Text Style)",
    subtitle: "Open a real reconnection cleanly.",
    intro:
      "Use these short text phrases when you message someone after a long silence.",
    phrases: [
      {
        english: "Hey, sudden message — you crossed my mind today.",
        vietnamese: "Ê, tự dưng nhắn nha, hôm nay tự nhiên nghĩ tới bạn.",
        pronunciation: "eh, tu zung nhan nha, hom nay tu nhien nghi toi ban",
        context: "Use as the casual opener after long silence.",
      },
      {
        english: "I was thinking about that thing you used to say. It still helps me.",
        vietnamese: "Mình nhớ câu mà bạn hay nói hồi đó. Tới giờ nó vẫn giúp mình.",
        pronunciation: "minh nho kau ma ban hai noy hoi do, toi gio no van zup minh",
        context: "Use to give the reconnection a concrete anchor.",
      },
      {
        english: "I am not going to pretend nothing happened; just want to say hi.",
        vietnamese: "Mình không định giả vờ như chưa có chuyện gì, chỉ là muốn chào bạn thôi.",
        pronunciation: "minh khong dinh za vo nhu chua ko chuyen zi, chi la mwon chao ban thoy",
        context: "Use to acknowledge the gap without diving into it.",
      },
      {
        english: "If you want quiet, I will take quiet. No hurt feelings.",
        vietnamese: "Nếu bạn muốn im, mình tôn trọng. Mình không giận đâu.",
        pronunciation: "new ban mwon im, minh ton trong, minh khong zan dau",
        context: "Use to pre-honor a possible non-response.",
      },
    ],
    cultural_note:
      "Reaching out without an ask is the move that often unlocks real reconnection; long messages with explanations usually feel heavier than no message.",
    tip:
      "Use tự dưng nhắn nha — the natural Vietnamese way to open without pressure.",
  },
  {
    id: 226,
    level: "B1",
    title_en: "When You Have Lost Motivation",
    subtitle: "Talk about flatness without forcing positivity.",
    intro:
      "Use these phrases to describe a long stretch where nothing pulls at you.",
    phrases: [
      {
        english: "I am not sad exactly. I just cannot feel pull toward anything.",
        vietnamese: "Mình không hẳn buồn đâu, mà mình không thấy bị cuốn vào cái gì hết.",
        pronunciation: "minh khong han buon dau, ma minh khong thay bi kuon vao kai zi het",
        context: "Use to differentiate apathy from sadness.",
      },
      {
        english: "Every morning is a meh. Not bad. Not anything.",
        vietnamese: "Sáng nào cũng nhợt nhạt. Không tệ. Mà cũng không có gì.",
        pronunciation: "sang nao kung nhot nhat, khong te, ma kung khong ko zi",
        context: "Use to capture the quality of low-grade flatness.",
      },
      {
        english: "I think I need a slower few weeks before I can want anything again.",
        vietnamese: "Chắc mình cần vài tuần chậm lại trước khi mình muốn cái gì trở lại.",
        pronunciation: "chak minh kun vai tuan cham lai truoc khi minh mwon kai zi tro lai",
        context: "Use to ask permission for a low season.",
      },
      {
        english: "Please do not pep-talk me. Just sit with me a bit.",
        vietnamese: "Đừng cổ vũ mình ráng lên nha. Ngồi với mình một xíu là được.",
        pronunciation: "dung ko vu minh rang len nha, ngoy voi minh mot xiu la duoc",
        context: "Use to redirect well-meaning friends away from advice.",
      },
    ],
    cultural_note:
      "Demotivation is often misread as laziness in Vietnamese family culture; describing it precisely keeps friends from defaulting to encouragement.",
    tip:
      "Use nhợt nhạt — captures emotional grayness without sounding clinical.",
  },
  {
    id: 227,
    level: "B1",
    title_en: "Office Politics Without Becoming Political",
    subtitle: "Read the room without playing the game.",
    intro:
      "Use these phrases when you want to navigate office dynamics without becoming part of the manipulation.",
    phrases: [
      {
        english: "I will not weigh in until I have seen it from two sides.",
        vietnamese: "Mình chưa lên tiếng đâu, đợi mình nghe đủ hai phía đã.",
        pronunciation: "minh chua len tieng dau, doi minh nghe du hai phia da",
        context: "Use to protect your judgment from one-sided input.",
      },
      {
        english: "I am not going to be on a team against another team here.",
        vietnamese: "Mình không tham gia việc lập phe đối phe ở đây nha.",
        pronunciation: "minh khong tham gia viec lap fe doi fe u day nha",
        context: "Use to opt out of office faction wars.",
      },
      {
        english: "If something is real, please tell HR, not the lunch table.",
        vietnamese: "Có chuyện thật thì báo HR đi, đừng kể bàn ăn trưa.",
        pronunciation: "ko chuyen that thi bao HR di, dung ke ban an trua",
        context: "Use to redirect serious issues to proper channels.",
      },
      {
        english: "I would rather be useful than influential here.",
        vietnamese: "Mình thà có ích hơn là có ảnh hưởng ở chỗ này.",
        pronunciation: "minh tha ko ik hon la ko anh huong u cho nay",
        context: "Use to define your own posture in a political workplace.",
      },
    ],
    cultural_note:
      "Office politics in Vietnamese workplaces happen partly through lunch chatter; declining to participate quietly often earns more respect than denouncing it.",
    tip:
      "Use thà có ích hơn là có ảnh hưởng — a precise self-positioning line.",
  },
  {
    id: 228,
    level: "B1",
    title_en: "Startup Stress Honestly",
    subtitle: "Tell a friend it is not glamorous.",
    intro:
      "Use these phrases when a friend romanticizes startup life and you want to be real with them.",
    phrases: [
      {
        english: "Honestly, most days I am just keeping the thing alive, not building it.",
        vietnamese: "Thật ra đa số ngày mình chỉ giữ cho nó còn sống, chứ không phải xây.",
        pronunciation: "that ra da phan ngay minh chi giu cho no kon song, chu khong phai xai",
        context: "Use to puncture the build-the-future romanticism.",
      },
      {
        english: "I sleep, but I do not rest. There is a difference.",
        vietnamese: "Mình có ngủ, mà không có nghỉ. Hai cái đó khác nhau.",
        pronunciation: "minh ko ngu, ma khong ko nghi, hai kai do khak nhau",
        context: "Use to describe the perpetual low-grade stress.",
      },
      {
        english: "If I succeed, the credit will be loud. If I fail, the failure will be loud too.",
        vietnamese: "Thành công thì nó nổi, mà thất bại nó cũng nổi.",
        pronunciation: "thanh kong thi no noi, ma that bai no kung noi",
        context: "Use to name the visibility cost of startup work.",
      },
      {
        english: "Some days I do this because I love it. Some days because I am too in to leave.",
        vietnamese: "Có ngày mình làm vì mình thương nó. Có ngày làm vì lỡ rồi không lùi được.",
        pronunciation: "ko ngay minh lam vi minh thuong no, ko ngay lam vi lo roy khong lui duoc",
        context: "Use to describe the mixed motivations honestly.",
      },
    ],
    cultural_note:
      "Vietnamese startup culture borrows the Silicon Valley aesthetic but the daily reality is grittier; honesty between founders is rare and worth more than networking.",
    tip:
      "Use lỡ rồi không lùi được — a brutally honest line about commitment-by-momentum.",
  },
  {
    id: 229,
    level: "B1",
    title_en: "Career Regret Out Loud",
    subtitle: "Name the road not taken without melodrama.",
    intro:
      "Use these phrases when you talk honestly with a close friend about a career path you did not pick.",
    phrases: [
      {
        english: "Sometimes I wonder what I would be if I had stayed with that other field.",
        vietnamese: "Có lúc mình nghĩ, nếu hồi đó mình ở lại bên kia, giờ mình ra sao.",
        pronunciation: "ko luk minh nghi, new hoi do minh u lai ben kia, gio minh ra sao",
        context: "Use to admit a quiet what-if.",
      },
      {
        english: "It is not regret exactly, more like curiosity I cannot answer.",
        vietnamese: "Cũng không hẳn tiếc, mà là tò mò mình không trả lời được.",
        pronunciation: "kung khong han tiek, ma la to mo minh khong tra loi duoc",
        context: "Use to be precise about what the feeling actually is.",
      },
      {
        english: "I do not want to redo it; I just want to acknowledge it existed.",
        vietnamese: "Mình không muốn làm lại, chỉ muốn công nhận là từng có.",
        pronunciation: "minh khong mwon lam lai, chi mwon kong nhan la tung ko",
        context: "Use to give the past its due without inviting it back.",
      },
      {
        english: "Maybe naming it out loud is the only way to put it down.",
        vietnamese: "Có khi nói ra với bạn là cách duy nhất để mình đặt nó xuống.",
        pronunciation: "ko khi noy ra voi ban la kak zui nhat de minh dat no xuong",
        context: "Use to honor the function of speaking it.",
      },
    ],
    cultural_note:
      "Vietnamese culture rarely makes room for soft regret; saying it once to one trusted friend often closes a loop the silence cannot.",
    tip:
      "Use đặt nó xuống — physical, gentle, and lands the metaphor of letting go.",
  },
  {
    id: 230,
    level: "B1",
    title_en: "Switching Industries Mid-Career",
    subtitle: "Talk about the move with conviction, not apology.",
    intro:
      "Use these phrases when you are explaining to family or peers why you are leaving the field you spent years in.",
    phrases: [
      {
        english: "I am not throwing the past away; I am taking it into a new shape.",
        vietnamese: "Mình không vứt quá khứ đâu, mình mang nó qua một hình dạng mới.",
        pronunciation: "minh khong vut kwa khu dau, minh mang no kwa mot hinh zang moi",
        context: "Use to reframe a career switch as continuity.",
      },
      {
        english: "Yes, I will start a level lower. That part I have made peace with.",
        vietnamese: "Đúng là mình sẽ bắt đầu thấp hơn một bậc. Cái đó mình đã chấp nhận rồi.",
        pronunciation: "dung la minh se bat dau thap hon mot bak, kai do minh da chap nhan roy",
        context: "Use to preempt the obvious follow-up question.",
      },
      {
        english: "I am switching because the days were starting to feel borrowed.",
        vietnamese: "Mình chuyển vì những ngày đó bắt đầu nghe như mình đi mượn cuộc sống.",
        pronunciation: "minh chuyen vi nhung ngay do bat dau nghe nhu minh di muon kuok song",
        context: "Use to express the existential level of the choice.",
      },
      {
        english: "If I fail, I fail in something I chose. That is enough.",
        vietnamese: "Lỡ thất bại, mình thất bại ở thứ mình chọn. Vậy là đủ.",
        pronunciation: "lo that bai, minh that bai u thu minh chon, vay la du",
        context: "Use to claim the ownership of the risk.",
      },
    ],
    cultural_note:
      "Career switches inside Vietnamese family conversations work best with one strong frame; vague restless or burned out invites pushback, owned-choice does not.",
    tip:
      "Use mình đi mượn cuộc sống — captures the dissonance of an outwardly successful life that does not feel yours.",
  },
  {
    id: 231,
    level: "B1",
    title_en: "Naming Fear Of Failure",
    subtitle: "Out loud, not buried.",
    intro:
      "Use these phrases to admit you are afraid before a big move.",
    phrases: [
      {
        english: "I am scared, and I am still going to do it.",
        vietnamese: "Mình sợ, mà mình vẫn đi.",
        pronunciation: "minh so, ma minh van di",
        context: "Use as a clean self-statement before the leap.",
      },
      {
        english: "If I wait until the fear leaves, I never start.",
        vietnamese: "Nếu mình chờ hết sợ rồi mới đi, mình không bao giờ bắt đầu.",
        pronunciation: "new minh cho het so roy moi di, minh khong bao zo bat dau",
        context: "Use to undercut the wait-til-confident trap.",
      },
      {
        english: "What I am scared of is not the fall; it is the looking dumb after.",
        vietnamese: "Cái mình sợ không phải là ngã, mà là sau khi ngã, người ta nhìn thấy mình.",
        pronunciation: "kai minh so khong phai la nga, ma la sau khi nga, nguoi ta nhin thay minh",
        context: "Use to be precise about the shape of the fear.",
      },
      {
        english: "Help me by not asking me how it is going every week.",
        vietnamese: "Bạn giúp mình bằng cách đừng hỏi tuần nào cũng hỏi tới đâu rồi.",
        pronunciation: "ban zup minh bang kak dung hoi tuan nao kung hoi toi dau roy",
        context: "Use to ask for a specific kind of support.",
      },
    ],
    cultural_note:
      "Vietnamese culture often praises bravery as silent endurance; saying you are afraid out loud is itself a kind of courage that close friends recognize.",
    tip:
      "Use mình sợ, mà mình vẫn đi — short, native, and harder than it looks.",
  },
  {
    id: 232,
    level: "B1",
    title_en: "Decoding Mixed Signals",
    subtitle: "Stop guessing, ask cleanly.",
    intro:
      "Use these phrases when someone has been hot and cold and you need to ask without spiraling.",
    phrases: [
      {
        english: "I am getting different signals from you this week.",
        vietnamese: "Mình thấy bạn tuần này gửi cho mình tín hiệu hơi khác nhau.",
        pronunciation: "minh thay ban tuan nay gui cho minh tin hieu hoi khak nhau",
        context: "Use to name the inconsistency without accusing.",
      },
      {
        english: "I do not need a definition; I just need consistency.",
        vietnamese: "Mình không cần đặt tên cho mình hai đứa, mình chỉ cần ổn định một chút.",
        pronunciation: "minh khong kun dat ten cho minh hai dua, minh chi kun on dinh mot chut",
        context: "Use to lower the conversation pressure while still asking.",
      },
      {
        english: "If you are not sure, say not sure. That is also an answer.",
        vietnamese: "Nếu bạn chưa chắc, nói chưa chắc cũng được, đó cũng là câu trả lời.",
        pronunciation: "new ban chua chak, noy chua chak kung duoc, do kung la kau tra loi",
        context: "Use to give the other person permission to admit uncertainty.",
      },
      {
        english: "I would rather know now than read patterns alone at night.",
        vietnamese: "Mình thà biết bây giờ còn hơn ngồi tối tự đoán mò.",
        pronunciation: "minh tha biet bay zo kon hon ngoy toi tu doan mo",
        context: "Use to explain why directness is care, not pressure.",
      },
    ],
    cultural_note:
      "Asking about ambiguity without panicking the other person is a high-skill move; framing it as I would rather know than guess works almost universally.",
    tip:
      "Use ngồi tối tự đoán mò — vivid and self-deprecating, lowers defensiveness.",
  },
  {
    id: 233,
    level: "B1",
    title_en: "Naming Emotional Unavailability",
    subtitle: "Tell someone what you actually need that you are not getting.",
    intro:
      "Use these phrases when a partner or close friend is consistently distant when you are vulnerable.",
    phrases: [
      {
        english: "When I share something hard, you go quiet, and I read that as not safe.",
        vietnamese: "Lúc mình chia sẻ chuyện khó, bạn im, mình đọc cái đó là không an toàn.",
        pronunciation: "luk minh chia se chuyen kho, ban im, minh dok kai do la khong an toan",
        context: "Use to name a specific behavior and its impact.",
      },
      {
        english: "I am not asking you to fix anything; I am asking you to stay in the room.",
        vietnamese: "Mình không xin bạn sửa, mình xin bạn ngồi lại đây với mình.",
        pronunciation: "minh khong xin ban sua, minh xin ban ngoy lai day voi minh",
        context: "Use to redefine the request away from solutions.",
      },
      {
        english: "Even one sentence back tells me you are still here.",
        vietnamese: "Một câu thôi cũng được, để mình biết bạn còn ở đây.",
        pronunciation: "mot kau thoy kung duoc, de minh biet ban kon u day",
        context: "Use to name the minimum version of what works.",
      },
      {
        english: "If this is not in your vocabulary, please tell me, so I do not keep waiting.",
        vietnamese: "Nếu chuyện này không có trong khả năng của bạn, nói thẳng giùm mình, để mình khỏi chờ.",
        pronunciation: "new chuyen nay khong ko trong kha nang kua ban, noy thang zum minh, de minh khoi cho",
        context: "Use to ask for honesty about capacity.",
      },
    ],
    cultural_note:
      "Many Vietnamese partners were not raised with emotional literacy; framing the ask as a literal behavior rather than a personality verdict gets more traction.",
    tip:
      "Use ngồi lại đây với mình — concrete, somatic, and harder to dismiss than abstract emotional terms.",
  },
  {
    id: 234,
    level: "B1",
    title_en: "Surfacing Old Resentment",
    subtitle: "Bring up a year-old hurt cleanly.",
    intro:
      "Use these phrases when a year-old wound is still affecting how you treat someone and you finally need to say it.",
    phrases: [
      {
        english: "I have been carrying this since last year. I want to put it down with you.",
        vietnamese: "Mình giữ chuyện này từ năm ngoái tới giờ. Mình muốn bỏ nó xuống với bạn.",
        pronunciation: "minh giu chuyen nay tu nam ngoai toi gio, minh mwon bo no xuong voi ban",
        context: "Use to introduce an old hurt with intention to release.",
      },
      {
        english: "I am not asking for an apology, I am asking to be heard once.",
        vietnamese: "Mình không xin lời xin lỗi, mình chỉ xin được kể một lần thôi.",
        pronunciation: "minh khong xin loi xin loi, minh chi xin duoc ke mot lan thoy",
        context: "Use to lower the threat for the other person.",
      },
      {
        english: "I do not want this to keep showing up sideways in our conversations.",
        vietnamese: "Mình không muốn chuyện đó cứ hiện ra ngang ngang trong câu chuyện hai đứa.",
        pronunciation: "minh khong mwon chuyen do ku hien ra ngang ngang trong kau chuyen hai dua",
        context: "Use to explain why the surfacing is necessary.",
      },
      {
        english: "After today, I am letting it go, whatever you say.",
        vietnamese: "Sau hôm nay, mình thả ra rồi, bạn nói gì cũng được.",
        pronunciation: "sau hom nay, minh tha ra roy, ban noy zi kung duoc",
        context: "Use to commit to your own release regardless of their reaction.",
      },
    ],
    cultural_note:
      "Old hurts in Vietnamese friendships often live as quiet sideways comments; addressing them once with a clear release date is what dissolves them.",
    tip:
      "Use bỏ nó xuống — kinetic, embodied, and signals you are done carrying it.",
  },
  {
    id: 235,
    level: "B1",
    title_en: "Setting Boundaries Without Coldness",
    subtitle: "Hold a limit that still feels like care.",
    intro:
      "Use these phrases when a friend or family member crosses a limit and you want to draw the line warmly.",
    phrases: [
      {
        english: "I love you. This thing, I cannot do.",
        vietnamese: "Mình thương bạn. Mà chuyện này, mình không làm được.",
        pronunciation: "minh thuong ban, ma chuyen nay, minh khong lam duoc",
        context: "Use as a warmth-first refusal.",
      },
      {
        english: "I am saying no to the thing, not no to you.",
        vietnamese: "Mình từ chối chuyện này, không phải từ chối bạn.",
        pronunciation: "minh tu choi chuyen nay, khong phai tu choi ban",
        context: "Use to separate behavior from relationship.",
      },
      {
        english: "I will say it once and not get into a debate about it.",
        vietnamese: "Mình nói một lần thôi nha, không tranh luận chuyện này.",
        pronunciation: "minh noy mot lan thoy nha, khong tranh luan chuyen nay",
        context: "Use to set the meta-rule of the conversation.",
      },
      {
        english: "If this becomes a recurring ask, my answer will not change.",
        vietnamese: "Nếu chuyện này hỏi đi hỏi lại, câu trả lời của mình vẫn vậy.",
        pronunciation: "new chuyen nay hoi di hoi lai, kau tra loi kua minh van vay",
        context: "Use to preempt repeated attempts.",
      },
    ],
    cultural_note:
      "Vietnamese boundary-setting is about combining warmth and clarity; the warmth without the clarity gets ignored, the clarity without warmth gets resented.",
    tip:
      "Use thương bạn / không làm được — that pairing is the whole template for warm refusal.",
  },
  {
    id: 236,
    level: "B1",
    title_en: "Living As A Vietnamese Person Overseas",
    subtitle: "Talk about the texture of diaspora life.",
    intro:
      "Use these phrases when someone asks what it is really like living abroad as a Vietnamese.",
    phrases: [
      {
        english: "Day-to-day is fine. It is the holidays that hit different.",
        vietnamese: "Ngày thường ổn lắm. Mấy ngày lễ là mới khác hẳn.",
        pronunciation: "ngay thuong on lam, may ngay le la moi khak han",
        context: "Use to describe the asymmetric pull of diaspora life.",
      },
      {
        english: "I am there long enough that I forget; I am still foreign enough to remember.",
        vietnamese: "Mình ở đủ lâu để quên, mà cũng còn đủ lạ để nhớ.",
        pronunciation: "minh u du lau de kwen, ma kung kon du la de nho",
        context: "Use to capture the in-between of diaspora life.",
      },
      {
        english: "I miss small things, more than big things.",
        vietnamese: "Mình nhớ mấy chuyện nhỏ, hơn là chuyện to.",
        pronunciation: "minh nho may chuyen nho, hon la chuyen to",
        context: "Use to make the missing legible.",
      },
      {
        english: "Going back is not a vacation; it is something deeper.",
        vietnamese: "Về Việt Nam không phải đi chơi đâu, nó là cái gì sâu hơn.",
        pronunciation: "ve viet nam khong phai di choi dau, no la kai zi sau hon",
        context: "Use to push back gently on tourism framing.",
      },
    ],
    cultural_note:
      "Diaspora speech often gets lighter than the actual feeling; choosing to describe small specific things is what makes it land.",
    tip:
      "Use đủ lâu để quên, đủ lạ để nhớ — captures the heart of diaspora identity in one line.",
  },
  {
    id: 237,
    level: "B1",
    title_en: "Naming Accent Insecurity",
    subtitle: "Honest about the embarrassment, not stuck in it.",
    intro:
      "Use these phrases when you are self-conscious about how you sound speaking Vietnamese.",
    phrases: [
      {
        english: "Be patient with my Vietnamese, the words come out a beat late.",
        vietnamese: "Bạn kiên nhẫn với tiếng Việt của mình nha, mình nói chậm hơn một nhịp.",
        pronunciation: "ban kien nhan voi tieng viet kua minh nha, minh noy cham hon mot nhip",
        context: "Use to ask for grace upfront.",
      },
      {
        english: "When I get the tone wrong, just tell me; I will not be hurt.",
        vietnamese: "Mình sai dấu, bạn cứ chỉ mình, mình không buồn đâu.",
        pronunciation: "minh sai zau, ban ku chi minh, minh khong buon dau",
        context: "Use to invite correction warmly.",
      },
      {
        english: "I know my accent gives me away. I am still going to keep speaking.",
        vietnamese: "Mình biết giọng mình lộ ra liền, mà mình vẫn cứ nói.",
        pronunciation: "minh biet zong minh lo ra lien, ma minh van ku noy",
        context: "Use to hold the choice to keep speaking despite shame.",
      },
      {
        english: "If I just stop trying, it disappears completely. So I will keep stumbling.",
        vietnamese: "Nếu mình ngưng tập, nó mất hẳn luôn. Nên mình cứ vấp đi.",
        pronunciation: "new minh ngung tap, no mat han luon, nen minh ku vap di",
        context: "Use to describe the long-term commitment to speaking.",
      },
    ],
    cultural_note:
      "Heritage speakers sometimes refuse to speak Vietnamese to avoid embarrassment; talking about the embarrassment out loud usually loosens its grip.",
    tip:
      "Use mình cứ vấp đi — turns stumbling into a deliberate practice rather than a failure.",
  },
  {
    id: 238,
    level: "B1",
    title_en: "When You Are Forgetting Vietnamese",
    subtitle: "Talk to a parent or sibling about what is being lost.",
    intro:
      "Use these phrases when you can feel your Vietnamese eroding and you need to name it before it disappears.",
    phrases: [
      {
        english: "I notice the words drop one by one over the years.",
        vietnamese: "Mình thấy mấy năm gần đây từ vựng rớt từ từ trong đầu mình.",
        pronunciation: "minh thay may nam gan day tu vung rot tu tu trong dau minh",
        context: "Use to describe gradual language loss honestly.",
      },
      {
        english: "It is not that I do not want to remember; it is that the language needs use.",
        vietnamese: "Không phải mình không muốn nhớ, mà là tiếng cần được xài.",
        pronunciation: "khong phai minh khong mwon nho, ma la tieng kun duoc xai",
        context: "Use to defend yourself from the lazy assumption.",
      },
      {
        english: "Could we have a Vietnamese-only call once a week?",
        vietnamese: "Mình gọi nhau một lần một tuần, chỉ nói tiếng Việt thôi, được không?",
        pronunciation: "minh goi nhau mot lan mot tuan, chi noy tieng viet thoy, duoc khong",
        context: "Use to propose a concrete preservation routine.",
      },
      {
        english: "I would rather sound clumsy with you than fluent only in English.",
        vietnamese: "Mình thà nói tiếng Việt vụng về với mẹ còn hơn chỉ giỏi tiếng Anh thôi.",
        pronunciation: "minh tha noy tieng viet vung ve voi may kon hon chi zoi tieng anh thoy",
        context: "Use to anchor the choice in identity, not skill.",
      },
    ],
    cultural_note:
      "Heritage Vietnamese erodes silently; making a weekly Vietnamese-only call ritual is one of the few practices that durably reverses it.",
    tip:
      "Use rớt từ từ — the verb captures slow loss in a way that is both poetic and accurate.",
  },
  {
    id: 239,
    level: "B1",
    title_en: "Native Interruption Patterns",
    subtitle: "Sound natural when you cut in.",
    intro:
      "Use these short phrases to interrupt politely or naturally in real Vietnamese conversation.",
    phrases: [
      {
        english: "Wait wait, I just want to add one thing.",
        vietnamese: "Khoan khoan, cho mình bổ sung một câu nha.",
        pronunciation: "khoan khoan, cho minh bo sung mot kau nha",
        context: "Use to insert a quick addition to a conversation.",
      },
      {
        english: "Hold on — back up, I lost you at the part about your boss.",
        vietnamese: "Khoan đã, lùi lại đoạn sếp bạn cái đi, mình rớt khúc đó rồi.",
        pronunciation: "khoan da, lui lai doan sep ban kai di, minh rot khuk do roy",
        context: "Use to ask the speaker to back up.",
      },
      {
        english: "Sorry, can I jump in really quick?",
        vietnamese: "Xin lỗi cắt ngang nha, mình chen nhanh một câu được không.",
        pronunciation: "xin loi kat ngang nha, minh chen nhanh mot kau duoc khong",
        context: "Use as a polite interruption marker.",
      },
      {
        english: "Continue continue, I will not interrupt again.",
        vietnamese: "Bạn cứ kể tiếp, mình không chen nữa đâu.",
        pronunciation: "ban ku ke tiep, minh khong chen nua dau",
        context: "Use to hand the floor back.",
      },
    ],
    cultural_note:
      "Native Vietnamese conversation has constant micro-interruptions; the right repair phrases keep them from feeling rude.",
    tip:
      "Use khoan khoan — a doubled khoan slows the pace better than a single one.",
  },
  {
    id: 240,
    level: "B1",
    title_en: "Hearing Implied Meaning",
    subtitle: "Read what was not said.",
    intro:
      "Use these phrases to verbally name a sub-text you have picked up so the conversation can move forward.",
    phrases: [
      {
        english: "When you said busy three times, I read it as not interested.",
        vietnamese: "Bạn nói bận tới ba lần, mình hiểu ngầm là không hứng thú.",
        pronunciation: "ban noy ban toi ba lan, minh hieu ngam la khong hung thu",
        context: "Use to name a polite refusal you decoded.",
      },
      {
        english: "Tell me if I am wrong, but it sounds like you do not want to talk about her.",
        vietnamese: "Nói mình sai cũng được, mà nghe kiểu bạn không muốn nói về chỉ.",
        pronunciation: "noy minh sai kung duoc, ma nghe kieu ban khong mwon noy ve chi",
        context: "Use to invite correction while naming what you heard.",
      },
      {
        english: "What I heard was not the words; it was the pause before them.",
        vietnamese: "Cái mình nghe không phải là chữ, mà là khoảng lặng trước cái chữ đó.",
        pronunciation: "kai minh nghe khong phai la chu, ma la khoang lang truoc kai chu do",
        context: "Use to describe an emotionally precise read.",
      },
      {
        english: "If I am projecting, please correct me.",
        vietnamese: "Nếu mình suy diễn, bạn cứ điều chỉnh mình lại nha.",
        pronunciation: "new minh suy zien, ban ku dieu chinh minh lai nha",
        context: "Use to leave room for being wrong.",
      },
    ],
    cultural_note:
      "Vietnamese culture leans on indirectness; learners gain real fluency the day they can name the unsaid out loud, kindly.",
    tip:
      "Use hiểu ngầm — the precise verb for reading subtext.",
  },
  {
    id: 241,
    level: "B1",
    title_en: "Short Native Responses",
    subtitle: "One-word and two-word native replies.",
    intro:
      "Use these as quick, real reactions rather than full sentences. They make you sound native.",
    phrases: [
      {
        english: "For real?",
        vietnamese: "Thiệt á?",
        pronunciation: "thiet a",
        context: "Use as a quick reaction to surprising news.",
      },
      {
        english: "Mmm yeah, makes sense.",
        vietnamese: "Ờ ha, hợp lý nha.",
        pronunciation: "uh ha, hop ly nha",
        context: "Use as a calm acknowledgment of a point.",
      },
      {
        english: "Phew, I thought worse.",
        vietnamese: "Ủa, mình tưởng tệ hơn.",
        pronunciation: "ua, minh tuong te hon",
        context: "Use for relief after hearing news.",
      },
      {
        english: "Got it, no need to explain more.",
        vietnamese: "Hiểu rồi, không cần giải thích thêm.",
        pronunciation: "hieu roy, khong kun giai thik them",
        context: "Use to close a topic without sounding curt.",
      },
    ],
    cultural_note:
      "Real Vietnamese conversation runs on micro-responses; over-explaining where a short phrase fits is one of the clearest tells of a learner.",
    tip:
      "Use ờ ha — a uniquely native acknowledgment that signals real listening.",
  },
  {
    id: 242,
    level: "B1",
    title_en: "Layered Polite Speech",
    subtitle: "Wrap a hard message in soft layers.",
    intro:
      "Use these phrases when a request needs to feel polite enough to land but firm enough to be real.",
    phrases: [
      {
        english: "Anh, just one small thing I want to ask.",
        vietnamese: "Anh cho em xin một chuyện nhỏ thôi.",
        pronunciation: "anh cho em xin mot chuyen nho thoy",
        context: "Use to introduce a request softly.",
      },
      {
        english: "I do not mean to be heavy, but I am asking you to consider it for me.",
        vietnamese: "Em không dám nói nặng đâu, mà em xin anh cân nhắc giúp em.",
        pronunciation: "em khong zam noy nang dau, ma em xin anh kan nhak zup em",
        context: "Use to add a humility layer before the request.",
      },
      {
        english: "Please understand for me, just this once.",
        vietnamese: "Anh thông cảm cho em một lần này nha.",
        pronunciation: "anh thong kam cho em mot lan nay nha",
        context: "Use to bookend the ask with a request for understanding.",
      },
      {
        english: "Thanks in advance, whichever way you decide.",
        vietnamese: "Em cảm ơn anh trước, cho dù anh quyết sao cũng được.",
        pronunciation: "em kam un anh truoc, cho zu anh kwet sao kung duoc",
        context: "Use to thank ahead and pre-honor any answer.",
      },
    ],
    cultural_note:
      "Layered politeness is a Vietnamese craft: the hard ask stays small but the wrappers carry the relational weight.",
    tip:
      "Use cảm ơn anh trước — pre-thanking is its own subtle kind of polite power.",
  },
  {
    id: 243,
    level: "B1",
    title_en: "Indirect Disagreement",
    subtitle: "Disagree without saying you disagree.",
    intro:
      "Use these phrases to push back politely without ever saying I disagree.",
    phrases: [
      {
        english: "Hmm, that is one way to look at it.",
        vietnamese: "Hơm, cũng là một cách nhìn nha.",
        pronunciation: "hum, kung la mot kak nhin nha",
        context: "Use to neither agree nor commit.",
      },
      {
        english: "There might be another angle worth considering too.",
        vietnamese: "Có khi mình cũng nên xem qua một góc khác nữa.",
        pronunciation: "ko khi minh kung nen xem kwa mot gok khak nua",
        context: "Use to add an alternative without rejecting.",
      },
      {
        english: "Let me think about that one again before I respond.",
        vietnamese: "Để mình suy nghĩ lại cái này trước rồi mình trả lời.",
        pronunciation: "de minh suy nghi lai kai nay truoc roy minh tra loi",
        context: "Use to buy time when you do not want to commit.",
      },
      {
        english: "I get the logic, but somehow I am not fully convinced.",
        vietnamese: "Mình hiểu logic, mà sao mình chưa thấy thuyết phục hẳn.",
        pronunciation: "minh hieu logic, ma sao minh chua thay thuyet phuk han",
        context: "Use to express soft disagreement honestly.",
      },
    ],
    cultural_note:
      "Vietnamese disagreement often arrives as a gentle reframe rather than a confrontation; learners who can recognize and produce these phrases pass invisibly through high-stakes conversations.",
    tip:
      "Use cũng là một cách nhìn nha — the most native way to say I do not agree without saying it.",
  },
  {
    id: 244,
    level: "B1",
    title_en: "Hesitant Speech When You Are Unsure",
    subtitle: "Sound thoughtful, not flaky.",
    intro:
      "Use these phrases when you are mid-thought, working it out, and need conversational space.",
    phrases: [
      {
        english: "How should I put this... hmm.",
        vietnamese: "Sao mình nói nhỉ... ờm.",
        pronunciation: "sao minh noy nhi um",
        context: "Use as a thoughtful pause that buys time.",
      },
      {
        english: "I am not sure yet, but maybe...",
        vietnamese: "Mình chưa chắc, mà có thể là...",
        pronunciation: "minh chua chak, ma ko the la",
        context: "Use to flag that an idea is forming, not finished.",
      },
      {
        english: "Wait, let me retract that and say it better.",
        vietnamese: "Khoan, để mình rút lại câu đó nói lại cho gọn.",
        pronunciation: "khoan, de minh rut lai kau do noy lai cho gon",
        context: "Use to revise on the fly.",
      },
      {
        english: "I am thinking out loud, do not lock me in yet.",
        vietnamese: "Mình đang nghĩ ra tiếng thôi, đừng chốt sớm nha.",
        pronunciation: "minh dang nghi ra tieng thoy, dung chot som nha",
        context: "Use to protect a developing thought from premature commitment.",
      },
    ],
    cultural_note:
      "Real conversation is not polished sentences; signaling that you are thinking out loud is a sign of presence, not weakness.",
    tip:
      "Use đang nghĩ ra tiếng thôi — gives you cover to revise without losing credibility.",
  },
  {
    id: 245,
    level: "B1",
    title_en: "Filler-Heavy Casual Flow",
    subtitle: "How real chats actually move.",
    intro:
      "Use these short connectors and fillers to make casual speech feel native.",
    phrases: [
      {
        english: "And then like, the whole thing went weird.",
        vietnamese: "Xong á, kiểu cả vụ đó thành lạ luôn.",
        pronunciation: "xong a, kieu ka vu do thanh la luon",
        context: "Use as a casual story connector.",
      },
      {
        english: "Anyway, what about you?",
        vietnamese: "Mà nói hoài chuyện mình, còn bạn sao rồi?",
        pronunciation: "ma noy hoai chuyen minh, kon ban sao roy",
        context: "Use to flip the conversation back.",
      },
      {
        english: "So, like, that is kind of how it ended.",
        vietnamese: "Thì, đại khái nó kết thúc kiểu đó á.",
        pronunciation: "thi, dai khai no ket thuk kieu do a",
        context: "Use to close a story casually.",
      },
      {
        english: "Hmm wait, what was I saying again?",
        vietnamese: "Ơ khoan, mình đang nói tới đâu rồi nhỉ.",
        pronunciation: "uh khoan, minh dang noy toi dau roy nhi",
        context: "Use as a natural recovery line in casual flow.",
      },
    ],
    cultural_note:
      "Casual Vietnamese is held together by tiny words — xong, mà, kiểu, á — that signal listening and continuity. Drop them and your speech sounds robotic.",
    tip:
      "Use kiểu, á, xong as connective tissue — they do almost nothing semantically and everything socially.",
  },
  {
    id: 246,
    level: "B1",
    title_en: "Roleplay: One Big Honest Conversation",
    subtitle: "A long talk that closes a long silence.",
    intro:
      "Practice this for a real, slow, multi-topic conversation between two adults who have been close, drifted, and are now sitting back down.",
    phrases: [],
    dialogue: [
      {
        speaker: "A",
        vietnamese: "Bạn ngồi yên với mình một xíu được không, đừng lướt điện thoại.",
        english: "Can you just sit with me for a bit, no scrolling.",
        pronunciation: "ban ngoy yen voi minh mot xiu duoc khong, dung luot dien thoai",
      },
      {
        speaker: "B",
        vietnamese: "Ok, mình để máy xuống đây.",
        english: "Okay, I am putting it down.",
        pronunciation: "ok, minh de mai xuong day",
      },
      {
        speaker: "A",
        vietnamese: "Mình có một mớ chuyện chưa kể, mà bữa nay mình không định kể hết, chỉ kể vài cái thôi.",
        english: "I have a pile of things I never told you. Tonight I am not going to share all, just a few.",
        pronunciation: "minh ko mot mo chuyen chua ke, ma bua nay minh khong dinh ke het, chi ke vai kai thoy",
      },
      {
        speaker: "B",
        vietnamese: "Mình nghe. Bạn cứ chậm chậm cũng được.",
        english: "I am listening. Take it slow.",
        pronunciation: "minh nghe, ban ku cham cham kung duoc",
      },
      {
        speaker: "A",
        vietnamese: "Năm vừa rồi mình mệt thật. Mệt theo kiểu mất luôn cái mình từng vui là gì.",
        english: "This past year I have been so tired. Tired in a way I forgot what used to make me happy.",
        pronunciation: "nam vua roy minh met that, met theo kieu mat luon kai minh tung vui la zi",
      },
      {
        speaker: "B",
        vietnamese: "Mình tiếc là mình không nhận ra sớm hơn.",
        english: "I am sorry I did not notice earlier.",
        pronunciation: "minh tiek la minh khong nhan ra som hon",
      },
      {
        speaker: "A",
        vietnamese: "Không phải lỗi bạn. Mình giấu kỹ lắm. Mà bữa nay mình ngừng giấu một chút.",
        english: "It is not on you. I hid it well. Tonight I am unhiding a little.",
        pronunciation: "khong phai loi ban, minh zau ki lam, ma bua nay minh ngung zau mot chut",
      },
      {
        speaker: "B",
        vietnamese: "Vậy bạn cần mình làm gì cụ thể?",
        english: "So what do you need from me concretely?",
        pronunciation: "vay ban kun minh lam zi ku the",
      },
      {
        speaker: "A",
        vietnamese: "Nghe thôi. Đừng đưa giải pháp. Đừng so chuyện của mình với chuyện của ai khác.",
        english: "Just listen. No solutions. No comparisons to anyone else.",
        pronunciation: "nghe thoy, dung dua giai phap, dung so chuyen kua minh voi chuyen kua ai khak",
      },
      {
        speaker: "B",
        vietnamese: "Ok, mình ngồi đây. Mình không đi đâu hết.",
        english: "Okay, I am here. I am not going anywhere.",
        pronunciation: "ok, minh ngoy day, minh khong di dau het",
      },
      {
        speaker: "A",
        vietnamese: "Cảm ơn bạn vì câu đó. Mình tưởng mình mạnh, mà tới giờ mình mới biết mình mỏi.",
        english: "Thanks for that line. I thought I was strong; tonight I learned I am just tired.",
        pronunciation: "kam un ban vi kau do, minh tuong minh manh, ma toi gio minh moi biet minh moi",
      },
      {
        speaker: "B",
        vietnamese: "Mỏi không phải yếu đâu bạn. Có khi nó là chỗ thật nhất của mình.",
        english: "Tired is not weak, friend. Sometimes it is the truest part of you.",
        pronunciation: "moi khong phai yeu dau ban, ko khi no la cho that nhat kua minh",
      },
    ],
    cultural_note:
      "The deepest Vietnamese friendships hold space without fixing; the line nghe thôi, đừng đưa giải pháp captures the whole modern emotional adult vocabulary in one phrase.",
    tip:
      "Use mỏi instead of yếu when you want to honor the difference between exhaustion and weakness — a quietly powerful native distinction.",
  },
];
