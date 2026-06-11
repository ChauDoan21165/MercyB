import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Haircut / barber / salon — customer side. The real situations a Vietnamese
// newcomer handles as a customer: booking, describing what they want, giving
// feedback during the cut, asking about services, and paying. Distinct from
// nailTechnicianEnglish (the worker side). Deterministic / client-side; copy
// is warm, adult, low-shame. l1InterferenceNotes quote the Vietnamese source
// phrase with full diacritics — friendly context, never a grammar correction.
export const speakTopics: readonly SpeakTopicLibraryEntry[] = [
  {
    id: "topic-haircut-booking",
    labelEn: "Booking A Haircut",
    labelVi: "Đặt lịch cắt tóc",
    category: "haircut-customer",
    seedInputs: [
      "Hi, I'd like to book a haircut for Saturday morning.",
      "Do you have any openings this week?",
      "I'd like to make an appointment — how long does it take?",
    ],
    detectionPatterns: [
      /\b(?:book a haircut|make an appointment|hair appointment|salon booking|any openings|walk-?in|earliest available|barber appointment)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "haircut-booking-cat-toc",
        label: "\"Cắt tóc\" and booking",
        note: "'Cắt tóc' (cut hair) sometimes leads to 'I want to cut hair' in English — which sounds like the learner is the one doing the cutting. The natural phrase is 'I'd like to get a haircut' or 'I'd like to book a haircut.'",
      },
      {
        id: "haircut-booking-walk-in",
        label: "Walk-in vs appointment",
        note: "Some salons take walk-ins (no booking needed); others prefer appointments. Asking 'Do you take walk-ins or do I need an appointment?' tells you whether to call ahead — and saves a wasted trip.",
      },
      {
        id: "haircut-booking-wait-time",
        label: "Asking the wait time",
        note: "If the salon is busy, 'How long is the wait?' is a natural question. 'Phải đợi bao lâu?' maps directly to it — and gives you a clear answer before you decide to wait or come back.",
      },
    ],
    followUps: [
      { id: "haircut-booking-when", question: "What day or time would you like?", salienceQuestion: "When would you ask to schedule the {slot}?" },
      { id: "haircut-booking-walkin", question: "How would you ask if they take walk-ins?", salienceQuestion: "How would you ask about the {slot} walk-in option?" },
      { id: "haircut-booking-who", question: "How would you ask to see a specific stylist?", salienceQuestion: "How would you ask for the {slot} stylist?" },
      { id: "haircut-booking-long", question: "How would you ask how long the appointment is?", salienceQuestion: "How long is the {slot} appointment?" },
      { id: "haircut-booking-confirm", question: "How would you confirm the booking before you hang up?", salienceQuestion: "How would you confirm the {slot}?" },
    ],
  },
  {
    id: "topic-haircut-describing-style",
    labelEn: "Describing The Style You Want",
    labelVi: "Mô tả kiểu tóc mình muốn",
    category: "haircut-customer",
    seedInputs: [
      "I'd like a trim — just a little off the ends.",
      "Can I show you a photo of what I'm looking for?",
      "I want it shorter on the sides but keep the length on top.",
    ],
    detectionPatterns: [
      /\b(?:show you a (?:picture|photo)|just a trim|a little off|shorter on the sides|layers?|keep the length|fade|taper|undercut|leave it (?:long|short)|about an inch|how I want)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "haircut-style-show-photo",
        label: "Showing a photo is always okay",
        note: "Bringing or showing a photo on your phone is the easiest way to get the cut you want. 'Can I show you a photo?' is a natural opener — stylists see phones every day and prefer clear pictures over complex descriptions.",
      },
      {
        id: "haircut-style-trim",
        label: "\"Trim\" for a small amount",
        note: "'Chỉ cắt chút thôi' (just cut a little) becomes 'just a trim' in English. A trim means only a small amount is taken off — maybe a centimetre or two. 'I'd like a trim, please' is a complete, clear request.",
      },
      {
        id: "haircut-style-measurement",
        label: "Giving a length in inches or centimetres",
        note: "Stylists work in inches or centimetres in English-speaking countries. 'About two inches off' or 'about five centimetres' is clearer than pointing loosely. If you're not sure how much, 'just a little' or 'not too short' also works.",
      },
    ],
    followUps: [
      { id: "haircut-style-photo", question: "How would you ask if you can show a photo?", salienceQuestion: "How would you share the {slot} reference?" },
      { id: "haircut-style-length", question: "How would you say how much to take off?", salienceQuestion: "How much of the {slot} should come off?" },
      { id: "haircut-style-sides", question: "How would you describe what you want on the sides?", salienceQuestion: "What do you want on the {slot} sides?" },
      { id: "haircut-style-top", question: "How would you say what you want on top?", salienceQuestion: "What do you want for the {slot} top?" },
      { id: "haircut-style-layered", question: "How would you ask for layers?", salienceQuestion: "How would you ask for the {slot} layered look?" },
    ],
  },
  {
    id: "topic-haircut-during-cut",
    labelEn: "Giving Feedback During The Cut",
    labelVi: "Phản hồi trong khi cắt tóc",
    category: "haircut-customer",
    seedInputs: [
      "Could you go a little shorter on the left side?",
      "That's good — don't take any more off.",
      "Could you check the back is even?",
    ],
    detectionPatterns: [
      /\b(?:a (?:bit|little) (?:shorter|longer)|could you (?:leave|take|even|check)|don'?t take any more|that'?s good|just like that|is the back even|the same on both sides|trim the (?:front|back|sides))\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "haircut-during-speak-up",
        label: "It is okay to speak up",
        note: "Many learners stay quiet during a haircut even when they want a change. 'Could you take a little more off the left?' is polite and welcome — stylists prefer feedback during the cut, not after. Staying quiet when unhappy means going home unhappy.",
      },
      {
        id: "haircut-during-stop-word",
        label: "How to say stop",
        note: "'That's fine — please stop there' or 'That's enough off the top' tells the stylist exactly where to stop. 'Thế là được rồi' maps neatly to 'That's good, thank you' — a phrase worth knowing.",
      },
      {
        id: "haircut-during-mirror",
        label: "Asking to see the back",
        note: "Stylists will often hold up a mirror to show the back. If they don't, asking 'Could I see the back?' is a normal request. 'Cho tôi xem phía sau' maps to this — and catching an issue in the chair is easier than fixing it later.",
      },
    ],
    followUps: [
      { id: "haircut-during-shorter", question: "How would you ask to take a little more off?", salienceQuestion: "How would you ask for the {slot} to be shorter?" },
      { id: "haircut-during-stop", question: "How would you say that's enough?", salienceQuestion: "How would you say stop the {slot} there?" },
      { id: "haircut-during-even", question: "How would you ask if both sides are even?", salienceQuestion: "How would you check the {slot} is even?" },
      { id: "haircut-during-back", question: "How would you ask to see the back?", salienceQuestion: "How would you ask to check the {slot} back?" },
      { id: "haircut-during-liking", question: "How would you say you like how it looks?", salienceQuestion: "How would you say the {slot} looks good?" },
    ],
  },
  {
    id: "topic-haircut-extra-services",
    labelEn: "Asking About Extra Services",
    labelVi: "Hỏi về các dịch vụ thêm",
    category: "haircut-customer",
    seedInputs: [
      "Do you also do beard trims here?",
      "Is a wash and blow-dry included?",
      "How much is a colour treatment?",
    ],
    detectionPatterns: [
      /\b(?:beard trim|beard shave|wash (?:and|&) blow-?dry|colour (?:treatment|rinse)|highlights?|toning|fringe trim|eyebrow trim|included in the price|extra charge|blow-?dry)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "haircut-extras-goi-dau",
        label: "\"Gội đầu\" — wash included?",
        note: "'Gội đầu' (wash hair) is 'a shampoo wash' or 'hair wash.' In many salons a wash and blow-dry is included in the price; in others it costs extra. Asking 'Is a wash included?' clears it up before you sit down.",
      },
      {
        id: "haircut-extras-nhuom",
        label: "Hair colour — \"nhuộm tóc\"",
        note: "'Nhuộm tóc' (dye hair) is 'hair colour' or 'a colour treatment.' Asking 'Do you do colour here?' opens the door. For highlights, lowlights, or a single all-over colour, the stylist can show you options and prices.",
      },
      {
        id: "haircut-extras-extra-charge",
        label: "Asking what is included",
        note: "Prices vary: some salons bundle washing and styling, others charge separately. 'Is the blow-dry included, or is it extra?' saves a surprise at the till. 'Có tính phí thêm không?' maps directly to 'Is there an extra charge?'",
      },
    ],
    followUps: [
      { id: "haircut-extras-wash", question: "How would you ask if a wash is included?", salienceQuestion: "Is the {slot} wash included?" },
      { id: "haircut-extras-blowdry", question: "How would you ask for a blow-dry?", salienceQuestion: "How would you ask for the {slot} blow-dry?" },
      { id: "haircut-extras-colour", question: "How would you ask about colour services?", salienceQuestion: "How would you ask about the {slot} colour?" },
      { id: "haircut-extras-beard", question: "How would you ask about beard or eyebrow trimming?", salienceQuestion: "How would you ask about the {slot} trim?" },
      { id: "haircut-extras-price", question: "How would you ask the price before agreeing?", salienceQuestion: "How would you ask the {slot} price?" },
    ],
  },
  {
    id: "topic-haircut-paying-tipping",
    labelEn: "Paying And Tipping",
    labelVi: "Thanh toán và tiền tip",
    category: "haircut-customer",
    seedInputs: [
      "How much do I owe?",
      "Do you accept card, or is it cash only?",
      "Is it okay to leave a tip?",
    ],
    detectionPatterns: [
      /\b(?:how much (?:do I|is it)|how much (?:for|does)|cash only|accept card|contactless|do you take|is it okay to tip|tip (?:the )?stylist|gratuity|receipt)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "haircut-tip-tip-culture",
        label: "Tipping custom varies by country",
        note: "In many English-speaking countries tipping your stylist is normal — 10–20% is common. 'Is it okay to leave a tip?' is a warm, safe way to ask if you're unsure. 'Có thể tip không?' maps right to it.",
      },
      {
        id: "haircut-tip-payment-method",
        label: "Card or cash",
        note: "Smaller salons often prefer cash. Asking 'Do you accept card?' or 'Is it card or cash only?' before you sit down avoids an awkward scramble at the end. 'Thanh toán bằng thẻ được không?' maps to 'Can I pay by card?'",
      },
      {
        id: "haircut-tip-how-much",
        label: "Asking the total",
        note: "'How much do I owe?' or 'What do I owe?' is the natural question at checkout — not 'How much is your cost?' Knowing the price before you pay is always fine to ask.",
      },
    ],
    followUps: [
      { id: "haircut-tip-total", question: "How would you ask the total cost?", salienceQuestion: "How would you ask the {slot} total?" },
      { id: "haircut-tip-card", question: "How would you ask if they accept card?", salienceQuestion: "How would you ask about the {slot} payment method?" },
      { id: "haircut-tip-how-tip", question: "How would you ask about leaving a tip?", salienceQuestion: "How would you ask about the {slot} tip?" },
      { id: "haircut-tip-receipt", question: "How would you ask for a receipt?", salienceQuestion: "How would you ask for the {slot} receipt?" },
      { id: "haircut-tip-rebook", question: "How would you say you'd like to book again before leaving?", salienceQuestion: "How would you rebook the {slot}?" },
    ],
  },
] as const;
