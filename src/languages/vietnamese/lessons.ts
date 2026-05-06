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

export type VietnameseLesson = {
  id: number;
  level: VietnameseCefrLevel;
  title_en: string;
  subtitle: string;
  intro: string;
  phrases: VietnamesePhrase[];
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
];
