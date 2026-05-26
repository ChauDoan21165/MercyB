// Path: src/components/mercy-guide/kids/kidPage31Data.ts
// File: kidPage31Data.ts
// Target age: 15 | 4 topics × 15 items = 60 items
// Format: label = key phrase | dialogue = 2-line mini conversation

export type KidPage31Item = {
  key: string;
  label: string;
  dialogue: [string, string];   // [Person A, Person B]
  image: string;
};

export const KID_PAGE_31_ITEMS: ReadonlyArray<KidPage31Item> = [

  // ── Expressing Doubt & Nuance ──────────────────────────────────────────────
  {
    key: 'k31_001_it_depends',
    label: 'It depends...',
    dialogue: ['Is Saturday good for you?', 'It depends... on what time you mean.'],
    image: '/images/mercy-kids-page-31/k31_001_it_depends.png',
  },
  {
    key: 'k31_002_im_not_totally_sure',
    label: "I'm not totally sure",
    dialogue: ['Did the test cover chapter five?', "I'm not totally sure — I think so, but check with Minh."],
    image: '/images/mercy-kids-page-31/k31_002_im_not_totally_sure.png',
  },
  {
    key: 'k31_003_that_could_be_true_but',
    label: 'That could be true, but...',
    dialogue: ['They say social media is bad for you.', 'That could be true, but it also helps people connect.'],
    image: '/images/mercy-kids-page-31/k31_003_that_could_be_true_but.png',
  },
  {
    key: 'k31_004_i_might_be_wrong',
    label: 'I might be wrong',
    dialogue: ['You said the meeting is at three?', 'I might be wrong — you should double-check the message.'],
    image: '/images/mercy-kids-page-31/k31_004_i_might_be_wrong.png',
  },
  {
    key: 'k31_005_it_depends_on_the_situation',
    label: 'It depends on the situation',
    dialogue: ['Is it okay to say no to a teacher?', 'It depends on the situation — sometimes you have to speak up.'],
    image: '/images/mercy-kids-page-31/k31_005_it_depends_on_the_situation.png',
  },
  {
    key: 'k31_006_thats_not_always_true',
    label: "That's not always true",
    dialogue: ['Hard work always leads to success.', "That's not always true — luck and opportunity matter too."],
    image: '/images/mercy-kids-page-31/k31_006_thats_not_always_true.png',
  },
  {
    key: 'k31_007_in_some_cases',
    label: 'In some cases...',
    dialogue: ['Should we always follow the rules?', 'In some cases... the rules need to be questioned.'],
    image: '/images/mercy-kids-page-31/k31_007_in_some_cases.png',
  },
  {
    key: 'k31_008_generally_speaking',
    label: 'Generally speaking...',
    dialogue: ['Are teenagers good at managing money?', 'Generally speaking... not really, but we are learning.'],
    image: '/images/mercy-kids-page-31/k31_008_generally_speaking.png',
  },
  {
    key: 'k31_009_as_far_as_i_know',
    label: 'As far as I know...',
    dialogue: ['Is the library open on Sunday?', 'As far as I know... it closes at noon on weekends.'],
    image: '/images/mercy-kids-page-31/k31_009_as_far_as_i_know.png',
  },
  {
    key: 'k31_010_im_not_convinced',
    label: "I'm not convinced",
    dialogue: ['This new app will solve all your problems!', "I'm not convinced — sounds too good to be true."],
    image: '/images/mercy-kids-page-31/k31_010_im_not_convinced.png',
  },
  {
    key: 'k31_011_thats_debatable',
    label: "That's debatable",
    dialogue: ['Online classes are just as good as real ones.', "That's debatable — I really miss being in class."],
    image: '/images/mercy-kids-page-31/k31_011_thats_debatable.png',
  },
  {
    key: 'k31_012_i_have_mixed_feelings',
    label: 'I have mixed feelings',
    dialogue: ['Are you excited about moving to a new school?', 'I have mixed feelings — nervous but kind of excited too.'],
    image: '/images/mercy-kids-page-31/k31_012_i_have_mixed_feelings.png',
  },
  {
    key: 'k31_013_on_the_other_hand',
    label: 'On the other hand...',
    dialogue: ['Studying abroad sounds amazing!', 'On the other hand... I would really miss my family.'],
    image: '/images/mercy-kids-page-31/k31_013_on_the_other_hand.png',
  },
  {
    key: 'k31_014_to_be_honest',
    label: 'To be honest...',
    dialogue: ['Did you enjoy the school trip?', 'To be honest... it was a bit boring but the food was great.'],
    image: '/images/mercy-kids-page-31/k31_014_to_be_honest.png',
  },
  {
    key: 'k31_015_i_could_be_mistaken',
    label: 'I could be mistaken',
    dialogue: ['Is Lan the one who said that?', 'I could be mistaken — I was not paying full attention.'],
    image: '/images/mercy-kids-page-31/k31_015_i_could_be_mistaken.png',
  },

  // ── Social Situations ──────────────────────────────────────────────────────
  {
    key: 'k31_016_can_we_reschedule',
    label: 'Can we reschedule?',
    dialogue: ["We're still meeting at four, right?", 'Can we reschedule? Something just came up at home.'],
    image: '/images/mercy-kids-page-31/k31_016_can_we_reschedule.png',
  },
  {
    key: 'k31_017_thats_awkward',
    label: "That's awkward",
    dialogue: ['I accidentally called the teacher "mum".', "That's awkward — did everyone hear it?"],
    image: '/images/mercy-kids-page-31/k31_017_thats_awkward.png',
  },
  {
    key: 'k31_018_i_didnt_get_your_message',
    label: "I didn't get your message",
    dialogue: ["Why didn't you reply last night?", "I didn't get your message — my notifications were off."],
    image: '/images/mercy-kids-page-31/k31_018_i_didnt_get_your_message.png',
  },
  {
    key: 'k31_019_let_me_check_my_schedule',
    label: 'Let me check my schedule',
    dialogue: ['Can you join the study group on Friday?', 'Let me check my schedule — I think I have practice.'],
    image: '/images/mercy-kids-page-31/k31_019_let_me_check_my_schedule.png',
  },
  {
    key: 'k31_020_are_you_free_this_weekend',
    label: 'Are you free this weekend?',
    dialogue: ["I haven't seen you in ages!", 'Are you free this weekend? We should catch up.'],
    image: '/images/mercy-kids-page-31/k31_020_are_you_free_this_weekend.png',
  },
  {
    key: 'k31_021_i_already_have_plans',
    label: 'I already have plans',
    dialogue: ["Come to Hoa's party on Saturday!", 'I already have plans — my cousin is visiting from Hanoi.'],
    image: '/images/mercy-kids-page-31/k31_021_i_already_have_plans.png',
  },
  {
    key: 'k31_022_something_came_up',
    label: 'Something came up',
    dialogue: ['You missed football practice yesterday!', 'Something came up — my mum needed help urgently.'],
    image: '/images/mercy-kids-page-31/k31_022_something_came_up.png',
  },
  {
    key: 'k31_023_my_bad',
    label: 'My bad!',
    dialogue: ['You sent me the wrong file again!', 'My bad! I will send the right one now.'],
    image: '/images/mercy-kids-page-31/k31_023_my_bad.png',
  },
  {
    key: 'k31_024_no_worries',
    label: 'No worries',
    dialogue: ["Sorry I'm late, the traffic was terrible!", 'No worries — we only just started.'],
    image: '/images/mercy-kids-page-31/k31_024_no_worries.png',
  },
  {
    key: 'k31_025_keep_me_posted',
    label: 'Keep me posted',
    dialogue: ['The results might come out today.', 'Keep me posted — I want to know as soon as you hear.'],
    image: '/images/mercy-kids-page-31/k31_025_keep_me_posted.png',
  },
  {
    key: 'k31_026_ill_let_you_know',
    label: "I'll let you know",
    dialogue: ['Are you coming to the event or not?', "I'll let you know by tomorrow — I need to ask my parents."],
    image: '/images/mercy-kids-page-31/k31_026_ill_let_you_know.png',
  },
  {
    key: 'k31_027_just_between_us',
    label: 'Just between us',
    dialogue: ['Can I tell you something personal?', 'Of course — just between us, I promise.'],
    image: '/images/mercy-kids-page-31/k31_027_just_between_us.png',
  },
  {
    key: 'k31_028_i_was_not_invited',
    label: 'I was not invited',
    dialogue: ["Did you go to Phong's birthday?", 'No... I was not invited, which felt a bit weird.'],
    image: '/images/mercy-kids-page-31/k31_028_i_was_not_invited.png',
  },
  {
    key: 'k31_029_count_me_in',
    label: 'Count me in!',
    dialogue: ["We're going hiking on Sunday — want to join?", 'Count me in! I have been wanting to do that.'],
    image: '/images/mercy-kids-page-31/k31_029_count_me_in.png',
  },
  {
    key: 'k31_030_ill_pass_this_time',
    label: "I'll pass this time",
    dialogue: ["We're doing karaoke tonight, come along!", "I'll pass this time — I'm really tired."],
    image: '/images/mercy-kids-page-31/k31_030_ill_pass_this_time.png',
  },

  // ── Handling Pressure & Stress ─────────────────────────────────────────────
  {
    key: 'k31_031_im_stressed_out',
    label: "I'm stressed out",
    dialogue: ["You've been quiet all day. Are you okay?", "I'm stressed out — three exams in two days."],
    image: '/images/mercy-kids-page-31/k31_031_im_stressed_out.png',
  },
  {
    key: 'k31_032_i_need_a_break',
    label: 'I need a break',
    dialogue: ["You've been studying for five hours straight!", 'I need a break — my brain is completely full.'],
    image: '/images/mercy-kids-page-31/k31_032_i_need_a_break.png',
  },
  {
    key: 'k31_033_dont_rush_me',
    label: "Don't rush me",
    dialogue: ['Hurry up, we are going to be late!', "Don't rush me — I'm going as fast as I can."],
    image: '/images/mercy-kids-page-31/k31_033_dont_rush_me.png',
  },
  {
    key: 'k31_034_im_doing_my_best',
    label: "I'm doing my best",
    dialogue: ['Your grades have to improve this term.', "I'm doing my best — I study every night."],
    image: '/images/mercy-kids-page-31/k31_034_im_doing_my_best.png',
  },
  {
    key: 'k31_035_i_cant_handle_this',
    label: "I can't handle this right now",
    dialogue: ['Can you take on one more task today?', "I can't handle this right now — I'm at my limit."],
    image: '/images/mercy-kids-page-31/k31_035_i_cant_handle_this.png',
  },
  {
    key: 'k31_036_take_it_one_step',
    label: 'Take it one step at a time',
    dialogue: ['Everything feels impossible right now.', 'Take it one step at a time — start with the smallest thing.'],
    image: '/images/mercy-kids-page-31/k31_036_take_it_one_step.png',
  },
  {
    key: 'k31_037_breathe',
    label: 'Just breathe',
    dialogue: ["I'm about to go on stage and I'm shaking!", 'Just breathe — you have practised this so many times.'],
    image: '/images/mercy-kids-page-31/k31_037_breathe.png',
  },
  {
    key: 'k31_038_i_feel_overwhelmed',
    label: 'I feel overwhelmed',
    dialogue: ['How are you coping with everything lately?', 'Honestly, I feel overwhelmed — there is too much at once.'],
    image: '/images/mercy-kids-page-31/k31_038_i_feel_overwhelmed.png',
  },
  {
    key: 'k31_039_its_too_much',
    label: "It's too much",
    dialogue: ['We have homework, a project, and a quiz tomorrow.', "It's too much — how are we supposed to do all of that?"],
    image: '/images/mercy-kids-page-31/k31_039_its_too_much.png',
  },
  {
    key: 'k31_040_i_need_to_calm_down',
    label: 'I need to calm down',
    dialogue: ['You seem really upset right now.', 'I need to calm down — give me a minute, please.'],
    image: '/images/mercy-kids-page-31/k31_040_i_need_to_calm_down.png',
  },
  {
    key: 'k31_041_stop_pressuring_me',
    label: 'Stop pressuring me',
    dialogue: ['Just decide already — everyone is waiting!', 'Stop pressuring me — I need more time to think.'],
    image: '/images/mercy-kids-page-31/k31_041_stop_pressuring_me.png',
  },
  {
    key: 'k31_042_i_just_need_some_time',
    label: 'I just need some time',
    dialogue: ["You haven't been yourself lately.", 'I just need some time — things have been hard at home.'],
    image: '/images/mercy-kids-page-31/k31_042_i_just_need_some_time.png',
  },
  {
    key: 'k31_043_this_is_stressing_me_out',
    label: 'This is stressing me out',
    dialogue: ['The university application deadline is next week.', 'This is stressing me out — I do not know where to start.'],
    image: '/images/mercy-kids-page-31/k31_043_this_is_stressing_me_out.png',
  },
  {
    key: 'k31_044_i_feel_better_now',
    label: 'I feel better now',
    dialogue: ['You look more relaxed than yesterday.', 'I feel better now — talking about it really helped.'],
    image: '/images/mercy-kids-page-31/k31_044_i_feel_better_now.png',
  },
  {
    key: 'k31_045_ill_get_through_this',
    label: "I'll get through this",
    dialogue: ["This term has been so tough for you.", "I'll get through this — I always do."],
    image: '/images/mercy-kids-page-31/k31_045_ill_get_through_this.png',
  },

  // ── Talking About the Future ───────────────────────────────────────────────
  {
    key: 'k31_046_im_planning_to',
    label: "I'm planning to...",
    dialogue: ['What are you doing after graduation?', "I'm planning to take a gap year and travel."],
    image: '/images/mercy-kids-page-31/k31_046_im_planning_to.png',
  },
  {
    key: 'k31_047_what_if_we',
    label: 'What if we...?',
    dialogue: ['We need a new idea for the project.', 'What if we made a short documentary instead of a poster?'],
    image: '/images/mercy-kids-page-31/k31_047_what_if_we.png',
  },
  {
    key: 'k31_048_i_hope_someday',
    label: 'I hope someday...',
    dialogue: ['Do you have a big dream?', 'I hope someday I can open my own design studio.'],
    image: '/images/mercy-kids-page-31/k31_048_i_hope_someday.png',
  },
  {
    key: 'k31_049_i_havent_decided_yet',
    label: "I haven't decided yet",
    dialogue: ['Which university are you applying to?', "I haven't decided yet — there are too many good options."],
    image: '/images/mercy-kids-page-31/k31_049_i_havent_decided_yet.png',
  },
  {
    key: 'k31_050_i_want_to_study_abroad',
    label: 'I want to study abroad',
    dialogue: ['Have you thought about your future yet?', 'I want to study abroad — maybe Japan or Australia.'],
    image: '/images/mercy-kids-page-31/k31_050_i_want_to_study_abroad.png',
  },
  {
    key: 'k31_051_i_see_myself',
    label: 'I see myself...',
    dialogue: ['Where do you picture yourself in ten years?', 'I see myself living in a big city, doing work I love.'],
    image: '/images/mercy-kids-page-31/k31_051_i_see_myself.png',
  },
  {
    key: 'k31_052_my_dream_is_to',
    label: 'My dream is to...',
    dialogue: ['What keeps you motivated to study so hard?', 'My dream is to become a doctor and help my community.'],
    image: '/images/mercy-kids-page-31/k31_052_my_dream_is_to.png',
  },
  {
    key: 'k31_053_ill_figure_it_out',
    label: "I'll figure it out",
    dialogue: ["You don't seem worried about the future at all!", "I'll figure it out — stressing now won't help."],
    image: '/images/mercy-kids-page-31/k31_053_ill_figure_it_out.png',
  },
  {
    key: 'k31_054_i_have_no_idea_yet',
    label: 'I have no idea yet',
    dialogue: ['What subject will you major in?', 'I have no idea yet — I like too many things.'],
    image: '/images/mercy-kids-page-31/k31_054_i_have_no_idea_yet.png',
  },
  {
    key: 'k31_055_i_am_working_towards',
    label: 'I am working towards...',
    dialogue: ['Why do you study English so seriously?', 'I am working towards a scholarship overseas.'],
    image: '/images/mercy-kids-page-31/k31_055_i_am_working_towards.png',
  },
  {
    key: 'k31_056_that_is_my_goal',
    label: 'That is my goal',
    dialogue: ['Do you really want to run your own business?', 'That is my goal — I have wanted it since I was twelve.'],
    image: '/images/mercy-kids-page-31/k31_056_that_is_my_goal.png',
  },
  {
    key: 'k31_057_i_need_to_prepare',
    label: 'I need to prepare',
    dialogue: ['The entrance exam is only two months away.', 'I know — I need to prepare much more seriously.'],
    image: '/images/mercy-kids-page-31/k31_057_i_need_to_prepare.png',
  },
  {
    key: 'k31_058_in_five_years',
    label: 'In five years...',
    dialogue: ['Where do you see yourself after high school?', 'In five years... I want to have graduated and be travelling.'],
    image: '/images/mercy-kids-page-31/k31_058_in_five_years.png',
  },
  {
    key: 'k31_059_anything_is_possible',
    label: 'Anything is possible',
    dialogue: ["Do you think your dream is realistic?", 'Anything is possible if you work hard enough for it.'],
    image: '/images/mercy-kids-page-31/k31_059_anything_is_possible.png',
  },
  {
    key: 'k31_060_i_believe_in_myself',
    label: 'I believe in myself',
    dialogue: ["What if you fail the exam?", 'I believe in myself — and I will try again if I do.'],
    image: '/images/mercy-kids-page-31/k31_060_i_believe_in_myself.png',
  },
];

export const KID_PAGE_31_ID = 'page31';
export const KID_PAGE_31_TITLE = 'Real Life English';

export function getKidPage31Item(key: string): KidPage31Item | undefined {
  return KID_PAGE_31_ITEMS.find(item => item.key === key);
}
