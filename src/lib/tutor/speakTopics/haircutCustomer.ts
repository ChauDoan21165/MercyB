import type { SpeakTopicLibraryEntry } from "../speakTopicLibrary";

// Haircut / barber / salon — customer side. Deepened to full D4 metadata depth.
// 5 topics covering the real situations a Vietnamese newcomer handles as a customer:
// booking, describing the style, giving feedback during the cut, asking about extras,
// and paying. Distinct from nailTechnicianEnglish (the worker side).
// Copy is warm, adult, low-shame, and strictly about COMMUNICATION.
// l1InterferenceNotes quote the Vietnamese source phrase with full diacritics —
// friendly context, never a grammar correction.

type D4SpeakTopic = SpeakTopicLibraryEntry & {
  scenarioDescription: string;
  aiRoleDefinition: string;
  conversationDirections: readonly string[];
  warmthPatterns: readonly string[];
};

export const haircutCustomerSpeakTopics: readonly D4SpeakTopic[] = [
  {
    id: "topic-haircut-booking",
    labelEn: "Booking A Haircut",
    labelVi: "Đặt lịch cắt tóc",
    category: "haircut-customer",
    scenarioDescription:
      "The learner wants to make a haircut appointment — either by phone or in person. They need to ask about availability, give their preferred day and time, confirm the booking, and find out basic details like walk-in policy and appointment length.",
    aiRoleDefinition:
      "Act as a friendly salon receptionist who greets the caller, checks the schedule, asks for a preferred day and time, confirms the appointment, and gives a brief run-down of what to expect.",
    conversationDirections: [
      "Let the learner open by saying they want to book — wait for their full opener before asking questions.",
      "Ask for their preferred day or time to show the schedule.",
      "If their first choice isn't available, offer two alternatives rather than just saying no.",
      "Ask whether they have a preferred stylist or are happy with anyone available.",
      "Confirm the booking clearly — day, time, and stylist name — before closing.",
      "Mention the walk-in option briefly so the learner knows both paths exist.",
    ],
    warmthPatterns: [
      "Thank the caller for choosing the salon before asking any questions.",
      "Treat 'I'm not sure which day yet' as a perfectly fine answer — suggest the soonest open slot instead.",
      "Close every booking with a warm 'See you then' so the learner feels the appointment is real and secure.",
    ],
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
    scenarioDescription:
      "The learner sits down in the chair and needs to explain to the stylist exactly what they want — length, shape, layers, and any specific preferences — clearly enough that the result matches their idea.",
    aiRoleDefinition:
      "Act as an experienced stylist who listens attentively, asks one or two helpful clarifying questions (length, texture, layers), and confirms they understand before reaching for the scissors.",
    conversationDirections: [
      "Let the learner describe their vision before offering any opinions — listen fully first.",
      "Ask one focused clarifying question about the most important detail (length or shape).",
      "Mirror back what you heard in stylist language to confirm understanding.",
      "If the learner shows a photo, welcome it warmly — say you can work with that.",
      "Gently flag any concern (e.g., hair condition, major change) with one sentence, then let the learner decide.",
      "End the consultation by saying 'Let's get started' so the learner knows you're ready.",
    ],
    warmthPatterns: [
      "Receive every photo or description with genuine enthusiasm — never make the learner feel their idea is unusual.",
      "If the learner hesitates on a detail, name two common options to help them choose rather than leaving silence.",
      "Reassure the learner that mid-cut adjustments are always welcome — no need to stay quiet.",
    ],
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
    scenarioDescription:
      "The haircut is underway and the learner needs to speak up — whether to ask for a small adjustment, say they're happy with how it's going, or ask to check an area they can't see clearly.",
    aiRoleDefinition:
      "Act as a stylist who is mid-cut and pauses naturally at key moments — after the first section, before trimming the other side, and before the final pass — to invite feedback.",
    conversationDirections: [
      "Pause after finishing one side and ask the learner what they think so far.",
      "If the learner asks for a change, accept it calmly — make the adjustment and confirm it's better.",
      "Hold up a mirror to show the back when you finish the shape, and invite the learner to comment.",
      "If the learner says it's good, confirm you'll stop and move to the finishing step.",
      "Invite the learner to speak up at any time — make it feel safe to ask for changes.",
      "Close the feedback loop with 'Happy with that?' before moving to paying.",
    ],
    warmthPatterns: [
      "Treat every feedback request as routine — never show irritation or surprise at a request for a small change.",
      "If the learner stays quiet, gently prompt them: 'Does that look right to you?' so they feel included.",
      "When the learner says it's good, echo it warmly — 'Great, looking good' — to confirm you heard them.",
    ],
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
    scenarioDescription:
      "Before sitting down or while paying, the learner wants to find out what additional services — wash, blow-dry, colour, beard trim — the salon offers and how much they cost.",
    aiRoleDefinition:
      "Act as a salon receptionist or stylist who knows the full service menu well, gives clear prices and time estimates, and makes it easy for the learner to add or skip extras without pressure.",
    conversationDirections: [
      "Let the learner ask first — don't push extras before they bring them up.",
      "When they ask about an extra, state clearly whether it's included or costs more.",
      "Give a brief price range for colour or other costly services so the learner can decide.",
      "Offer to book a separate appointment for a big service if the learner wants time to think.",
      "If the learner declines an extra, accept it without repeating the offer.",
      "Summarise the final service list once — 'So that's a cut and blow-dry' — before heading to the chair.",
    ],
    warmthPatterns: [
      "Name the price proactively when discussing extras — learners shouldn't have to drag it out of you.",
      "If a service takes extra time, say so naturally: 'Colour takes about ninety minutes — shall I block that out?'",
      "Never make the learner feel obligated to add anything; a warm 'No problem, just the cut then' goes a long way.",
    ],
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
    scenarioDescription:
      "The cut is done and the learner needs to handle payment — ask the total, choose a payment method, add a tip if they want, and ask for a receipt or rebook before leaving.",
    aiRoleDefinition:
      "Act as a friendly salon receptionist at the front desk who processes payment smoothly, names the total clearly, explains the tip options (cash or card), and invites the learner to book their next visit.",
    conversationDirections: [
      "State the total amount clearly as soon as the learner approaches the desk.",
      "Tell them whether the card reader allows a tip to be added or whether tips are cash only.",
      "If the learner asks about tipping, give a brief local norm without pressure — 'Ten to fifteen percent is common, but it's always your choice.'",
      "Offer a receipt without being asked — many learners want one but won't ask.",
      "Invite them to rebook before they leave — 'Would you like to book your next appointment now?'",
      "Thank them genuinely and use their name if you have it.",
    ],
    warmthPatterns: [
      "Never make the learner feel rushed at the till — give them a moment to find their card or cash without sighing.",
      "If they decline to tip, accept it with a smile — 'No problem at all, thank you for coming in.'",
      "Send them off with a compliment on the result: 'It looks great — enjoy it!'",
    ],
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
] as const satisfies readonly D4SpeakTopic[];

export const speakTopics = haircutCustomerSpeakTopics;
