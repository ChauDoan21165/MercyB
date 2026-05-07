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
];
