// Path: src/components/mercy-guide/kids/kidPage32Data.ts
// File: kidPage32Data.ts
// Target age: 16 | 4 topics × 15 items = 60 items
// Format: dialogue = 3-line mini conversation [A, B, A]

export type KidPage32Item = {
  key: string;
  label: string;
  dialogue: [string, string, string];
  image: string;
};

export const KID_PAGE_32_ITEMS: ReadonlyArray<KidPage32Item> = [

  // ── Critical Thinking & Debate ─────────────────────────────────────────────
  {
    key: 'k32_001_whats_your_evidence',
    label: "What's your evidence?",
    dialogue: ['You said screen time is harmless.', "What's your evidence? I have not seen any research on that.", 'I read it somewhere — I will look it up.'],
    image: '/images/mercy-kids-page-32/k32_001_whats_your_evidence.png',
  },
  {
    key: 'k32_002_that_doesnt_follow',
    label: "That doesn't follow",
    dialogue: ['If you study hard, you will be rich.', "That doesn't follow — there are many factors involved.", 'Fair point, it is more complicated than that.'],
    image: '/images/mercy-kids-page-32/k32_002_that_doesnt_follow.png',
  },
  {
    key: 'k32_003_i_see_your_point_but',
    label: 'I see your point, but...',
    dialogue: ['We should ban phones in schools completely.', 'I see your point, but phones are also useful for learning.', 'Maybe a partial ban would work better then.'],
    image: '/images/mercy-kids-page-32/k32_003_i_see_your_point_but.png',
  },
  {
    key: 'k32_004_can_you_give_an_example',
    label: 'Can you give an example?',
    dialogue: ['Social pressure affects teenagers negatively.', 'Can you give an example? That would make it clearer.', 'Sure — like being forced to follow fashion trends.'],
    image: '/images/mercy-kids-page-32/k32_004_can_you_give_an_example.png',
  },
  {
    key: 'k32_005_how_do_you_know_that',
    label: 'How do you know that?',
    dialogue: ['Most students prefer online learning.', 'How do you know that? Did you do a survey?', 'No, but I could — that is a good idea actually.'],
    image: '/images/mercy-kids-page-32/k32_005_how_do_you_know_that.png',
  },
  {
    key: 'k32_006_thats_a_contradiction',
    label: "That's a contradiction",
    dialogue: ['I believe in free speech but some opinions should be banned.', "That's a contradiction — you cannot have both.", 'You are right, I need to think that through more carefully.'],
    image: '/images/mercy-kids-page-32/k32_006_thats_a_contradiction.png',
  },
  {
    key: 'k32_007_is_that_always_the_case',
    label: 'Is that always the case?',
    dialogue: ['Rich countries always have better education.', 'Is that always the case? Finland spends less than the US.', 'Good point — spending alone does not determine quality.'],
    image: '/images/mercy-kids-page-32/k32_007_is_that_always_the_case.png',
  },
  {
    key: 'k32_008_what_are_you_basing_that_on',
    label: 'What are you basing that on?',
    dialogue: ['Young people today are less hardworking.', 'What are you basing that on? That sounds like a stereotype.', 'Maybe — I should not generalise like that.'],
    image: '/images/mercy-kids-page-32/k32_008_what_are_you_basing_that_on.png',
  },
  {
    key: 'k32_009_have_you_considered',
    label: 'Have you considered...?',
    dialogue: ['We should just remove all homework.', 'Have you considered how that affects exam preparation?', 'That is a good point — there needs to be some balance.'],
    image: '/images/mercy-kids-page-32/k32_009_have_you_considered.png',
  },
  {
    key: 'k32_010_that_assumes',
    label: 'That assumes...',
    dialogue: ['Everyone has equal access to technology.', 'That assumes everyone can afford a device and internet.', 'You are right — we cannot ignore that gap.'],
    image: '/images/mercy-kids-page-32/k32_010_that_assumes.png',
  },
  {
    key: 'k32_011_both_sides_have_a_point',
    label: 'Both sides have a point',
    dialogue: ['Who do you think is right in this debate?', 'Both sides have a point — it is not so black and white.', 'That is a mature way to look at it.'],
    image: '/images/mercy-kids-page-32/k32_011_both_sides_have_a_point.png',
  },
  {
    key: 'k32_012_the_data_suggests',
    label: 'The data suggests...',
    dialogue: ['Do you think exercise really helps mental health?', 'The data suggests it does — multiple studies show it.', 'I should start going to the gym then.'],
    image: '/images/mercy-kids-page-32/k32_012_the_data_suggests.png',
  },
  {
    key: 'k32_013_could_there_be_another_reason',
    label: 'Could there be another reason?',
    dialogue: ['Students fail because they are lazy.', 'Could there be another reason — like stress or home problems?', 'You are right, it is wrong to jump to conclusions.'],
    image: '/images/mercy-kids-page-32/k32_013_could_there_be_another_reason.png',
  },
  {
    key: 'k32_014_lets_look_at_the_facts',
    label: "Let's look at the facts",
    dialogue: ['I think climate change is exaggerated.', "Let's look at the facts before we make that claim.", 'Okay — I am open to changing my view if the evidence is clear.'],
    image: '/images/mercy-kids-page-32/k32_014_lets_look_at_the_facts.png',
  },
  {
    key: 'k32_015_what_would_you_say_to',
    label: 'What would you say to...?',
    dialogue: ['I have made my argument — what do you think?', 'What would you say to someone who completely disagrees?', 'I would ask them to explain their reasoning first.'],
    image: '/images/mercy-kids-page-32/k32_015_what_would_you_say_to.png',
  },

  // ── Persuasion & Negotiation ───────────────────────────────────────────────
  {
    key: 'k32_016_hear_me_out',
    label: 'Hear me out',
    dialogue: ['I already disagree with your idea.', 'Hear me out — just give me two minutes to explain.', 'Fine, go ahead — I am listening.'],
    image: '/images/mercy-kids-page-32/k32_016_hear_me_out.png',
  },
  {
    key: 'k32_017_what_if_i_told_you',
    label: 'What if I told you...?',
    dialogue: ['There is no way to fix this problem.', 'What if I told you there is already a solution being tested?', 'Really? Now I am actually curious to hear more.'],
    image: '/images/mercy-kids-page-32/k32_017_what_if_i_told_you.png',
  },
  {
    key: 'k32_018_lets_compromise',
    label: "Let's compromise",
    dialogue: ['I want the whole weekend off but you want me to study.', "Let's compromise — study in the morning, free in the afternoon.", 'That actually sounds fair — deal.'],
    image: '/images/mercy-kids-page-32/k32_018_lets_compromise.png',
  },
  {
    key: 'k32_019_thats_a_fair_deal',
    label: "That's a fair deal",
    dialogue: ['If you help me with math, I will help you with English.', "That's a fair deal — when do you want to start?", 'How about this Saturday at the library?'],
    image: '/images/mercy-kids-page-32/k32_019_thats_a_fair_deal.png',
  },
  {
    key: 'k32_020_think_about_it_this_way',
    label: 'Think about it this way',
    dialogue: ['I do not see why we need to learn history.', 'Think about it this way — history helps us avoid past mistakes.', 'I never thought of it like that before.'],
    image: '/images/mercy-kids-page-32/k32_020_think_about_it_this_way.png',
  },
  {
    key: 'k32_021_wouldnt_it_be_better_if',
    label: "Wouldn't it be better if...?",
    dialogue: ['The current schedule is exhausting for students.', "Wouldn't it be better if we started school an hour later?", 'I would absolutely support that change.'],
    image: '/images/mercy-kids-page-32/k32_021_wouldnt_it_be_better_if.png',
  },
  {
    key: 'k32_022_imagine_if',
    label: 'Imagine if...',
    dialogue: ['Why does learning English even matter?', 'Imagine if you could travel anywhere and talk to anyone.', 'Okay, I am convinced — where do I sign up?'],
    image: '/images/mercy-kids-page-32/k32_022_imagine_if.png',
  },
  {
    key: 'k32_023_the_way_i_see_it',
    label: 'The way I see it...',
    dialogue: ['Do you think the new school rule is fair?', 'The way I see it, rules should protect students, not restrict them.', 'That is a strong argument — I agree with you.'],
    image: '/images/mercy-kids-page-32/k32_023_the_way_i_see_it.png',
  },
  {
    key: 'k32_024_you_have_to_admit',
    label: 'You have to admit...',
    dialogue: ['I still think the old system was better.', 'You have to admit the new one is faster and more efficient.', 'Okay, I admit — it has improved in some ways.'],
    image: '/images/mercy-kids-page-32/k32_024_you_have_to_admit.png',
  },
  {
    key: 'k32_025_trust_me_on_this',
    label: 'Trust me on this',
    dialogue: ['Are you sure this plan will actually work?', 'Trust me on this — I have tried it before and it worked.', 'Alright, I will give it a chance this time.'],
    image: '/images/mercy-kids-page-32/k32_025_trust_me_on_this.png',
  },
  {
    key: 'k32_026_what_do_i_get_out_of_it',
    label: 'What do I get out of it?',
    dialogue: ['Can you help me move furniture this weekend?', 'What do I get out of it? I am not doing it for free.', 'I will buy you lunch and help you with your project.'],
    image: '/images/mercy-kids-page-32/k32_026_what_do_i_get_out_of_it.png',
  },
  {
    key: 'k32_027_meet_me_halfway',
    label: 'Meet me halfway',
    dialogue: ['I cannot agree to everything you are asking.', 'Then meet me halfway — just agree on the main points.', 'That I can do — let us start from there.'],
    image: '/images/mercy-kids-page-32/k32_027_meet_me_halfway.png',
  },
  {
    key: 'k32_028_i_can_prove_it',
    label: 'I can prove it',
    dialogue: ['That sounds too good to be true.', 'I can prove it — give me five minutes and a whiteboard.', 'Okay, go ahead — I am genuinely interested now.'],
    image: '/images/mercy-kids-page-32/k32_028_i_can_prove_it.png',
  },
  {
    key: 'k32_029_it_is_worth_trying',
    label: 'It is worth trying',
    dialogue: ['I am scared the new approach might not work.', 'It is worth trying — the worst that can happen is we learn something.', 'You are right — let us just go for it.'],
    image: '/images/mercy-kids-page-32/k32_029_it_is_worth_trying.png',
  },
  {
    key: 'k32_030_lets_find_a_middle_ground',
    label: "Let's find a middle ground",
    dialogue: ['We keep arguing and going in circles.', "Let's find a middle ground so we can actually move forward.", 'Agreed — I am tired of this debate going nowhere.'],
    image: '/images/mercy-kids-page-32/k32_030_lets_find_a_middle_ground.png',
  },

  // ── Formal vs Informal Register ────────────────────────────────────────────
  {
    key: 'k32_031_id_like_to_request',
    label: "I'd like to request...",
    dialogue: ['How should I ask the teacher for extra time?', "Say: I'd like to request an extension on the assignment.", 'That sounds much more professional than what I had planned.'],
    image: '/images/mercy-kids-page-32/k32_031_id_like_to_request.png',
  },
  {
    key: 'k32_032_could_you_please',
    label: 'Could you please...?',
    dialogue: ['I need the teacher to explain again but I do not want to be rude.', 'Just say: Could you please go over that one more time?', 'That is polite and direct — I will use that.'],
    image: '/images/mercy-kids-page-32/k32_032_could_you_please.png',
  },
  {
    key: 'k32_033_fyi',
    label: 'FYI',
    dialogue: ['Did you tell anyone about the change of venue?', 'FYI — I already sent everyone a message about it.', 'Perfect, thanks for handling that so quickly.'],
    image: '/images/mercy-kids-page-32/k32_033_fyi.png',
  },
  {
    key: 'k32_034_just_checking_in',
    label: 'Just checking in',
    dialogue: ['I have not heard from you about the project.', 'Just checking in — how is your part coming along?', 'Almost done — I will send it to you tonight.'],
    image: '/images/mercy-kids-page-32/k32_034_just_checking_in.png',
  },
  {
    key: 'k32_035_i_would_appreciate_it',
    label: 'I would appreciate it',
    dialogue: ['Do you need anything from me before the deadline?', 'I would appreciate it if you could review my draft first.', 'Of course — send it over and I will look at it today.'],
    image: '/images/mercy-kids-page-32/k32_035_i_would_appreciate_it.png',
  },
  {
    key: 'k32_036_with_all_due_respect',
    label: 'With all due respect...',
    dialogue: ['The principal says students have no say in this.', 'With all due respect, we should have been consulted first.', 'That took courage — and you made a very valid point.'],
    image: '/images/mercy-kids-page-32/k32_036_with_all_due_respect.png',
  },
  {
    key: 'k32_037_to_whom_it_may_concern',
    label: 'To whom it may concern',
    dialogue: ['How do I start a formal complaint letter?', 'Begin with: To whom it may concern, then state your issue clearly.', 'That sounds very official — I will use that format.'],
    image: '/images/mercy-kids-page-32/k32_037_to_whom_it_may_concern.png',
  },
  {
    key: 'k32_038_let_me_get_back_to_you',
    label: 'Let me get back to you',
    dialogue: ['Can you confirm the details right now?', 'Let me get back to you — I need to check my notes first.', 'No problem, take your time and message me later.'],
    image: '/images/mercy-kids-page-32/k32_038_let_me_get_back_to_you.png',
  },
  {
    key: 'k32_039_as_per_our_discussion',
    label: 'As per our discussion...',
    dialogue: ['Did we agree on Thursday or Friday for the presentation?', 'As per our discussion, we agreed on Thursday at two pm.', 'Great — I will prepare everything by Wednesday night.'],
    image: '/images/mercy-kids-page-32/k32_039_as_per_our_discussion.png',
  },
  {
    key: 'k32_040_please_be_advised',
    label: 'Please be advised...',
    dialogue: ['How do I send an official notice to the class?', 'Start with: Please be advised that the meeting has been moved.', 'That is exactly what I needed — very clear and formal.'],
    image: '/images/mercy-kids-page-32/k32_040_please_be_advised.png',
  },
  {
    key: 'k32_041_no_worries_got_it',
    label: 'No worries, got it!',
    dialogue: ['Sorry, I forgot to bring the report today.', 'No worries, got it — just send it to my email tonight.', 'Will do — thanks for being so understanding about it.'],
    image: '/images/mercy-kids-page-32/k32_041_no_worries_got_it.png',
  },
  {
    key: 'k32_042_heads_up',
    label: 'Heads up!',
    dialogue: ['Is there anything I should know before the meeting?', 'Heads up — the director is in a bad mood today.', 'Good to know — I will keep things short and professional.'],
    image: '/images/mercy-kids-page-32/k32_042_heads_up.png',
  },
  {
    key: 'k32_043_keep_it_professional',
    label: 'Keep it professional',
    dialogue: ['I really want to tell him exactly what I think.', 'Keep it professional — do not let your emotions take over.', 'You are right, I need to stay calm and focused.'],
    image: '/images/mercy-kids-page-32/k32_043_keep_it_professional.png',
  },
  {
    key: 'k32_044_im_reaching_out_because',
    label: "I'm reaching out because...",
    dialogue: ['How do I start an email to someone I have never met?', "Write: I'm reaching out because I saw your work online.", 'That is confident and friendly at the same time — perfect.'],
    image: '/images/mercy-kids-page-32/k32_044_im_reaching_out_because.png',
  },
  {
    key: 'k32_045_looking_forward_to_it',
    label: 'Looking forward to it',
    dialogue: ['The interview is confirmed for next Monday morning.', 'Looking forward to it — I have been preparing all week.', 'You will do great — just be yourself and stay confident.'],
    image: '/images/mercy-kids-page-32/k32_045_looking_forward_to_it.png',
  },

  // ── Talking About Society & Issues ─────────────────────────────────────────
  {
    key: 'k32_046_thats_a_systemic_problem',
    label: "That's a systemic problem",
    dialogue: ['Why do poor students always struggle more in school?', "That's a systemic problem — it goes beyond individual effort.", 'So what can we actually do to change it?'],
    image: '/images/mercy-kids-page-32/k32_046_thats_a_systemic_problem.png',
  },
  {
    key: 'k32_047_i_care_about_this',
    label: 'I care about this',
    dialogue: ['Why do you get so involved in environmental issues?', 'I care about this — it will affect my generation the most.', 'That is exactly why your voice matters in this conversation.'],
    image: '/images/mercy-kids-page-32/k32_047_i_care_about_this.png',
  },
  {
    key: 'k32_048_we_should_raise_awareness',
    label: 'We should raise awareness',
    dialogue: ['Not many people know about this problem.', 'We should raise awareness — maybe through social media.', 'Great idea — I can help design the posts for it.'],
    image: '/images/mercy-kids-page-32/k32_048_we_should_raise_awareness.png',
  },
  {
    key: 'k32_049_thats_not_right',
    label: "That's not right",
    dialogue: ['Some people say certain groups do not deserve rights.', "That's not right — everyone deserves equal treatment.", 'Exactly — we have to speak up when we hear that.'],
    image: '/images/mercy-kids-page-32/k32_049_thats_not_right.png',
  },
  {
    key: 'k32_050_we_need_to_talk_about_this',
    label: 'We need to talk about this',
    dialogue: ['Everyone just ignores the bullying in our school.', 'We need to talk about this — silence makes it worse.', 'You are right — I will bring it up with the teacher tomorrow.'],
    image: '/images/mercy-kids-page-32/k32_050_we_need_to_talk_about_this.png',
  },
  {
    key: 'k32_051_this_affects_all_of_us',
    label: 'This affects all of us',
    dialogue: ['Why should I care about climate policy?', 'This affects all of us — clean air and water are not optional.', 'When you put it that way, I feel more motivated to act.'],
    image: '/images/mercy-kids-page-32/k32_051_this_affects_all_of_us.png',
  },
  {
    key: 'k32_052_its_more_complicated_than_that',
    label: "It's more complicated than that",
    dialogue: ['Just tell people to stop being poor.', "It's more complicated than that — poverty has deep structural causes.", 'You are right, I was oversimplifying the whole issue.'],
    image: '/images/mercy-kids-page-32/k32_052_its_more_complicated_than_that.png',
  },
  {
    key: 'k32_053_we_have_a_responsibility',
    label: 'We have a responsibility',
    dialogue: ['Do teenagers really have to care about politics?', 'We have a responsibility — we are the ones who inherit the future.', 'That puts it in a whole new perspective for me.'],
    image: '/images/mercy-kids-page-32/k32_053_we_have_a_responsibility.png',
  },
  {
    key: 'k32_054_privilege_plays_a_role',
    label: 'Privilege plays a role',
    dialogue: ['Why do some people succeed so much more easily?', 'Privilege plays a role — not everyone starts from the same place.', 'That is a hard truth but an important one to accept.'],
    image: '/images/mercy-kids-page-32/k32_054_privilege_plays_a_role.png',
  },
  {
    key: 'k32_055_change_starts_with_us',
    label: 'Change starts with us',
    dialogue: ['The government is not doing anything about this.', 'Change starts with us — we cannot just wait for others.', 'You are right — small actions add up to something big.'],
    image: '/images/mercy-kids-page-32/k32_055_change_starts_with_us.png',
  },
  {
    key: 'k32_056_representation_matters',
    label: 'Representation matters',
    dialogue: ['Why does it matter who appears in films and media?', 'Representation matters — people need to see themselves reflected.', 'I never thought about how powerful that must feel.'],
    image: '/images/mercy-kids-page-32/k32_056_representation_matters.png',
  },
  {
    key: 'k32_057_words_have_power',
    label: 'Words have power',
    dialogue: ["It's just a joke — why is everyone so sensitive?", 'Words have power — what feels small to you can hurt someone deeply.', 'I hear you — I will think more carefully before I speak.'],
    image: '/images/mercy-kids-page-32/k32_057_words_have_power.png',
  },
  {
    key: 'k32_058_we_cannot_ignore_this',
    label: 'We cannot ignore this',
    dialogue: ['Can we just move on and not talk about it?', 'We cannot ignore this — pretending it does not exist makes it worse.', 'Okay, you are right — let us face it together.'],
    image: '/images/mercy-kids-page-32/k32_058_we_cannot_ignore_this.png',
  },
  {
    key: 'k32_059_every_voice_counts',
    label: 'Every voice counts',
    dialogue: ['My opinion does not matter — I am just one person.', 'Every voice counts — history was changed by people who thought that way.', 'That actually gives me the confidence to speak up more.'],
    image: '/images/mercy-kids-page-32/k32_059_every_voice_counts.png',
  },
  {
    key: 'k32_060_be_the_change',
    label: 'Be the change',
    dialogue: ['I wish the world was a more fair and kind place.', 'Be the change — start with how you treat people around you.', 'That is the most practical advice I have heard all day.'],
    image: '/images/mercy-kids-page-32/k32_060_be_the_change.png',
  },
];

export const KID_PAGE_32_ID = 'page32';
export const KID_PAGE_32_TITLE = 'Think & Persuade';

export function getKidPage32Item(key: string): KidPage32Item | undefined {
  return KID_PAGE_32_ITEMS.find(item => item.key === key);
}
