// Path: src/components/mercy-guide/kids/kidPage34Data.ts
// File: kidPage34Data.ts
// Target age: 18 | 4 topics × 15 items = 60 items
// Format: dialogue = 4-line A/B/A/B exchange

export type KidPage34Item = {
  key: string;
  label: string;
  dialogue: [string, string, string, string];
  image: string;
};

export const KID_PAGE_34_ITEMS: ReadonlyArray<KidPage34Item> = [

  // ── University & Academic Life ─────────────────────────────────────────────
  {
    key: 'k34_001_i_would_like_to_discuss_my_grade',
    label: 'I would like to discuss my grade',
    dialogue: [
      'Excuse me, Professor — do you have a moment after class?',
      'Of course. What is on your mind?',
      'I would like to discuss my grade on the last assignment if that is okay.',
      'Absolutely — come to my office at three and we can go through it together.',
    ],
    image: '/images/mercy-kids-page-34/k34_001_i_would_like_to_discuss_my_grade.png',
  },
  {
    key: 'k34_002_could_i_arrange_office_hours',
    label: 'Could I arrange office hours?',
    dialogue: [
      'I am struggling with the research methodology section of my paper.',
      'Could I arrange a time to come to your office hours this week?',
      'Yes — I have availability on Wednesday at two and Friday at eleven.',
      'Wednesday at two would be perfect. Thank you so much for your time.',
    ],
    image: '/images/mercy-kids-page-34/k34_002_could_i_arrange_office_hours.png',
  },
  {
    key: 'k34_003_my_thesis_argues_that',
    label: 'My thesis argues that...',
    dialogue: [
      'Could you give us a brief overview of your dissertation topic?',
      'My thesis argues that urban inequality is driven more by policy than geography.',
      'That is a bold claim — how are you planning to support it empirically?',
      'Through a comparative case study of five cities using thirty years of census data.',
    ],
    image: '/images/mercy-kids-page-34/k34_003_my_thesis_argues_that.png',
  },
  {
    key: 'k34_004_i_would_like_to_cite',
    label: 'I would like to cite...',
    dialogue: [
      'How are you referencing the WHO data you used in your introduction?',
      'I would like to cite it using APA format — is that acceptable for this department?',
      'Yes, APA is our preferred style. Make sure you include the access date for online sources.',
      'Understood — I will go back and update all the online references accordingly.',
    ],
    image: '/images/mercy-kids-page-34/k34_004_i_would_like_to_cite.png',
  },
  {
    key: 'k34_005_i_missed_the_lecture',
    label: 'I missed the lecture',
    dialogue: [
      'I noticed you were absent from Tuesday\'s session on quantitative methods.',
      'I missed the lecture — I had a medical appointment that I could not reschedule.',
      'That is fine. The slides are on the portal and the recording will be up by Friday.',
      'Thank you — I will review everything before the seminar next week.',
    ],
    image: '/images/mercy-kids-page-34/k34_005_i_missed_the_lecture.png',
  },
  {
    key: 'k34_006_could_you_clarify_the_assignment',
    label: 'Could you clarify the assignment brief?',
    dialogue: [
      'Before we finish today, does anyone have questions about the coursework?',
      'Could you clarify the assignment brief? I am unsure about the word count limit.',
      'The main body should be two thousand words, excluding references and appendices.',
      'Perfect — and is it acceptable to use first-person voice throughout the essay?',
    ],
    image: '/images/mercy-kids-page-34/k34_006_could_you_clarify_the_assignment.png',
  },
  {
    key: 'k34_007_i_would_like_to_appeal',
    label: 'I would like to appeal this decision',
    dialogue: [
      'Your application for late submission has unfortunately been declined.',
      'I understand, but I would like to appeal this decision through the formal process.',
      'You will need to submit a written statement to the academic registrar within five days.',
      'I will do that. Could you send me the link to the official appeal form?',
    ],
    image: '/images/mercy-kids-page-34/k34_007_i_would_like_to_appeal.png',
  },
  {
    key: 'k34_008_i_am_working_on_my_dissertation',
    label: 'I am working on my dissertation',
    dialogue: [
      'How is your final year going? It must be a lot of pressure.',
      'It is intense. I am working on my dissertation and juggling two part-time jobs.',
      'That is a huge workload — are you managing to stay on top of everything?',
      'Mostly, yes. I have learned to be very strict about my schedule and boundaries.',
    ],
    image: '/images/mercy-kids-page-34/k34_008_i_am_working_on_my_dissertation.png',
  },
  {
    key: 'k34_009_the_seminar_reading',
    label: 'Did you do the seminar reading?',
    dialogue: [
      'Are you prepared for the discussion in today\'s seminar?',
      'Did you do the seminar reading? I only got through half of it last night.',
      'I finished it but honestly found the second half quite dense and difficult.',
      'Same — I think we should admit that in the discussion rather than bluff our way through.',
    ],
    image: '/images/mercy-kids-page-34/k34_009_the_seminar_reading.png',
  },
  {
    key: 'k34_010_i_need_an_extension',
    label: 'I need an extension',
    dialogue: [
      'The deadline for your final paper is this Friday at noon.',
      'I need an extension — I have been dealing with a serious family emergency this week.',
      'I am sorry to hear that. Please email me the documentation and I will process it.',
      'Thank you for being understanding. I will send everything through by this evening.',
    ],
    image: '/images/mercy-kids-page-34/k34_010_i_need_an_extension.png',
  },
  {
    key: 'k34_011_group_work_contribution',
    label: 'Can we talk about contribution?',
    dialogue: [
      'I need to raise something about how our group project is going.',
      'Can we talk about contribution? I feel like the workload is very uneven right now.',
      'You are right — I have not been pulling my weight this week and I apologise.',
      'I appreciate that. Let us redistribute the tasks and set clear individual deadlines.',
    ],
    image: '/images/mercy-kids-page-34/k34_011_group_work_contribution.png',
  },
  {
    key: 'k34_012_i_have_read_widely_on_this',
    label: 'I have read widely on this topic',
    dialogue: [
      'What makes you qualified to take such a strong stance in your argument?',
      'I have read widely on this topic — over forty sources from the last ten years.',
      'That is impressive. Can you point me to the two or three most influential ones?',
      'Yes — I would start with Piketty, Sen, and the 2022 UNDP inequality report.',
    ],
    image: '/images/mercy-kids-page-34/k34_012_i_have_read_widely_on_this.png',
  },
  {
    key: 'k34_013_peer_review',
    label: 'Could you peer review my draft?',
    dialogue: [
      'I have just finished the first draft of my essay — would you mind looking at it?',
      'Of course. Could you peer review my draft in return? It would help us both.',
      'Absolutely — send yours over and I will have notes back to you by tomorrow.',
      'Great. I will send both drafts tonight so we have time before the submission.',
    ],
    image: '/images/mercy-kids-page-34/k34_013_peer_review.png',
  },
  {
    key: 'k34_014_academic_integrity',
    label: 'Academic integrity matters',
    dialogue: [
      'I found a website that sells pre-written essays for our exact assignment.',
      'Academic integrity matters — using that would be plagiarism and could end your degree.',
      'I know, I was not seriously considering it. I just panicked when I saw the deadline.',
      'Let us sit down together this weekend and work through your outline from scratch.',
    ],
    image: '/images/mercy-kids-page-34/k34_014_academic_integrity.png',
  },
  {
    key: 'k34_015_i_passed_my_finals',
    label: 'I passed my finals!',
    dialogue: [
      'I have been so anxious waiting for these results for three weeks.',
      'I passed my finals! I cannot believe it — I was convinced I had failed one paper.',
      'That is incredible — all that late-night studying finally paid off for you.',
      'It really did. I am going to take a full week off before I think about anything else.',
    ],
    image: '/images/mercy-kids-page-34/k34_015_i_passed_my_finals.png',
  },

  // ── Professional Communication ─────────────────────────────────────────────
  {
    key: 'k34_016_i_am_following_up',
    label: 'I am following up on...',
    dialogue: [
      'Did you ever hear back from the company you applied to last month?',
      'Not yet. I am following up on my application with a polite email today.',
      'That shows initiative — most candidates just wait and never reach out again.',
      'Exactly. Even if they say no, it shows I am genuinely interested in the role.',
    ],
    image: '/images/mercy-kids-page-34/k34_016_i_am_following_up.png',
  },
  {
    key: 'k34_017_please_find_attached',
    label: 'Please find attached...',
    dialogue: [
      'Have you sent the revised proposal to the client yet?',
      'Yes — I wrote: Please find attached the updated version with all your changes.',
      'Did you remember to include the new pricing table in the appendix?',
      'I did, and I also highlighted the key changes in the covering note for clarity.',
    ],
    image: '/images/mercy-kids-page-34/k34_017_please_find_attached.png',
  },
  {
    key: 'k34_018_it_was_a_pleasure_meeting_you',
    label: 'It was a pleasure meeting you',
    dialogue: [
      'How did the networking event go last night? You seemed nervous beforehand.',
      'Really well actually. I ended the conversation with: It was a pleasure meeting you.',
      'That is exactly the right note to end on — professional and warm at the same time.',
      'I also exchanged cards with two people who might be useful contacts in the future.',
    ],
    image: '/images/mercy-kids-page-34/k34_018_it_was_a_pleasure_meeting_you.png',
  },
  {
    key: 'k34_019_i_would_like_to_connect',
    label: 'I would like to connect with you',
    dialogue: [
      'You met someone interesting at the conference — did you follow up with them?',
      'Yes, I sent a LinkedIn message saying: I would like to connect with you.',
      'What did you say beyond that? A blank connection request is easy to ignore.',
      'I mentioned where we met and what we discussed so the context was clear.',
    ],
    image: '/images/mercy-kids-page-34/k34_019_i_would_like_to_connect.png',
  },
  {
    key: 'k34_020_as_discussed_in_our_meeting',
    label: 'As discussed in our meeting...',
    dialogue: [
      'Did you send the summary email after yesterday\'s project meeting?',
      'Yes — I started it with: As discussed in our meeting, here are the agreed actions.',
      'Good. Did you assign a clear owner and deadline to each action point?',
      'Every item has a name, a deadline, and a note on what success looks like.',
    ],
    image: '/images/mercy-kids-page-34/k34_020_as_discussed_in_our_meeting.png',
  },
  {
    key: 'k34_021_i_would_appreciate_your_feedback',
    label: 'I would appreciate your feedback',
    dialogue: [
      'You have been in the role for three months now — how is it going?',
      'I would appreciate your feedback on my performance so far if you have time.',
      'Of course — your written work is strong but you could speak up more in meetings.',
      'That is really helpful. I will make a conscious effort to contribute more verbally.',
    ],
    image: '/images/mercy-kids-page-34/k34_021_i_would_appreciate_your_feedback.png',
  },
  {
    key: 'k34_022_i_am_available_for_a_call',
    label: 'I am available for a call',
    dialogue: [
      'The client wants to discuss the proposal before they make a final decision.',
      'I am available for a call any time Thursday or Friday morning this week.',
      'Friday at ten works for them — I will send a calendar invite with the link.',
      'Perfect. I will prepare a one-page brief so I am ready for any questions they have.',
    ],
    image: '/images/mercy-kids-page-34/k34_022_i_am_available_for_a_call.png',
  },
  {
    key: 'k34_023_i_will_circle_back',
    label: 'I will circle back on this',
    dialogue: [
      'Have you made a decision about the budget allocation for next quarter?',
      'Not yet — I will circle back on this once I have reviewed the latest figures.',
      'When can we expect a final answer so we can plan the team schedules?',
      'I will have something concrete for you by end of day Thursday at the latest.',
    ],
    image: '/images/mercy-kids-page-34/k34_023_i_will_circle_back.png',
  },
  {
    key: 'k34_024_per_my_last_email',
    label: 'As I mentioned in my previous email...',
    dialogue: [
      'They are asking for the same information you already sent them last week.',
      'I know. I replied politely: As I mentioned in my previous email, this was covered.',
      'Good — you kept it professional rather than letting the frustration show.',
      'It is important to stay calm. Tone in emails can easily be misread if you are not careful.',
    ],
    image: '/images/mercy-kids-page-34/k34_024_per_my_last_email.png',
  },
  {
    key: 'k34_025_i_am_out_of_office',
    label: 'I am out of office',
    dialogue: [
      'Did you set your out-of-office reply before you left for the conference?',
      'Yes — I am out of office until Friday and redirected urgent queries to my colleague.',
      'Who did you name as the point of contact while you are away?',
      'Linh — she has full access to my inbox and knows the key priorities for the week.',
    ],
    image: '/images/mercy-kids-page-34/k34_025_i_am_out_of_office.png',
  },
  {
    key: 'k34_026_to_clarify_my_position',
    label: 'To clarify my position...',
    dialogue: [
      'There seems to be some confusion about what you said in yesterday\'s meeting.',
      'To clarify my position — I did not agree to the full budget, only the first phase.',
      'That is an important distinction. Is that reflected in the minutes that were sent out?',
      'It is not, which is why I am raising it now so we can correct the record today.',
    ],
    image: '/images/mercy-kids-page-34/k34_026_to_clarify_my_position.png',
  },
  {
    key: 'k34_027_i_will_take_ownership',
    label: 'I will take ownership of this',
    dialogue: [
      'The error in the report has caused a delay and the client is not happy.',
      'I will take ownership of this — the mistake was in my section and I am sorry.',
      'I appreciate you saying that. What steps are you taking to fix it?',
      'I have already drafted a correction and will send it to the client within the hour.',
    ],
    image: '/images/mercy-kids-page-34/k34_027_i_will_take_ownership.png',
  },
  {
    key: 'k34_028_let_us_schedule_a_follow_up',
    label: 'Let us schedule a follow-up',
    dialogue: [
      'We covered a lot of ground today but there are still some open questions.',
      'Agreed — let us schedule a follow-up for early next week to close everything out.',
      'Tuesday works for me. Should we invite the full team or keep it to just the leads?',
      'Just the leads first — once we are aligned we can brief the wider team together.',
    ],
    image: '/images/mercy-kids-page-34/k34_028_let_us_schedule_a_follow_up.png',
  },
  {
    key: 'k34_029_i_am_copying_in',
    label: 'I am copying in my manager',
    dialogue: [
      'This decision seems to require sign-off from someone more senior than you.',
      'You are right — I am copying in my manager so she has full visibility of this.',
      'Good. Can you also forward the original contract so she has the full context?',
      'Already done — I attached everything she needs in the same email thread.',
    ],
    image: '/images/mercy-kids-page-34/k34_029_i_am_copying_in.png',
  },
  {
    key: 'k34_030_thank_you_for_the_opportunity',
    label: 'Thank you for the opportunity',
    dialogue: [
      'We have decided to offer you the position starting the first of next month.',
      'Thank you for the opportunity — I am genuinely excited to join the team.',
      'We are glad to have you. Do you have any questions about the onboarding process?',
      'Just one — who should I contact if I need to sort out equipment before my first day?',
    ],
    image: '/images/mercy-kids-page-34/k34_030_thank_you_for_the_opportunity.png',
  },

  // ── Living Independently ───────────────────────────────────────────────────
  {
    key: 'k34_031_i_would_like_to_open_an_account',
    label: 'I would like to open an account',
    dialogue: [
      'Good morning. How can I help you today?',
      'I would like to open a current account. I have just moved here for university.',
      'Of course. Do you have a form of photo ID and proof of your current address?',
      'Yes — I have my passport and a letter from the university confirming my enrolment.',
    ],
    image: '/images/mercy-kids-page-34/k34_031_i_would_like_to_open_an_account.png',
  },
  {
    key: 'k34_032_my_lease_says',
    label: 'My lease says...',
    dialogue: [
      'Your landlord is asking you to pay for repairs that were pre-existing.',
      'My lease says the landlord is responsible for structural repairs made before my tenancy.',
      'You are correct — do you have that clause highlighted in your copy of the contract?',
      'Yes, it is on page four. I will email them the reference and request a formal response.',
    ],
    image: '/images/mercy-kids-page-34/k34_032_my_lease_says.png',
  },
  {
    key: 'k34_033_can_i_make_an_appointment',
    label: 'Can I make an appointment?',
    dialogue: [
      'Hello. I have been experiencing headaches for about two weeks now.',
      'Can I make an appointment to see a doctor as soon as possible please?',
      'We have availability on Thursday morning at nine fifteen — would that work?',
      'That works perfectly. Should I bring anything with me to the appointment?',
    ],
    image: '/images/mercy-kids-page-34/k34_033_can_i_make_an_appointment.png',
  },
  {
    key: 'k34_034_what_are_my_rights',
    label: 'What are my rights here?',
    dialogue: [
      'Your employer has just changed your working hours without giving any notice.',
      'What are my rights here? Can they do that without my agreement?',
      'Generally no — changes to your contracted hours require your written consent.',
      'Thank you. I will contact the citizens advice service to confirm before I respond.',
    ],
    image: '/images/mercy-kids-page-34/k34_034_what_are_my_rights.png',
  },
  {
    key: 'k34_035_i_need_to_cancel_my_subscription',
    label: 'I need to cancel my subscription',
    dialogue: [
      'I noticed an unexpected charge on my bank statement this morning.',
      'I need to cancel my subscription — I was charged after the free trial ended.',
      'I can process that for you. Would you like a refund for this month\'s payment?',
      'Yes please — I was not aware the trial had ended and I never intended to subscribe.',
    ],
    image: '/images/mercy-kids-page-34/k34_035_i_need_to_cancel_my_subscription.png',
  },
  {
    key: 'k34_036_i_would_like_to_report',
    label: 'I would like to report a problem',
    dialogue: [
      'The heating in your flat has not been working for over a week now.',
      'I would like to report a problem with the heating and request urgent repair.',
      'I will log that as an emergency repair — someone will contact you within 24 hours.',
      'Thank you. Please note I will need to document this in case it becomes a dispute.',
    ],
    image: '/images/mercy-kids-page-34/k34_036_i_would_like_to_report.png',
  },
  {
    key: 'k34_037_i_am_disputing_this_charge',
    label: 'I am disputing this charge',
    dialogue: [
      'You were billed twice for the same item on your account.',
      'I am disputing this charge — I have never authorised a second payment.',
      'I can see the duplicate transaction. I will raise a chargeback request immediately.',
      'How long will that process take and will I receive a confirmation by email?',
    ],
    image: '/images/mercy-kids-page-34/k34_037_i_am_disputing_this_charge.png',
  },
  {
    key: 'k34_038_what_is_included_in_the_rent',
    label: 'What is included in the rent?',
    dialogue: [
      'I am interested in the flat advertised online — could you tell me more?',
      'What is included in the rent? The listing was not completely clear about utilities.',
      'Water and internet are included. Gas and electricity are metered and billed separately.',
      'I see — and is there a minimum tenancy period or is it flexible month to month?',
    ],
    image: '/images/mercy-kids-page-34/k34_038_what_is_included_in_the_rent.png',
  },
  {
    key: 'k34_039_i_am_on_a_budget',
    label: 'I am on a budget',
    dialogue: [
      'Have you thought about how you are going to manage your finances this year?',
      'I am on a budget — I track every expense in a spreadsheet at the end of each week.',
      'That is a very disciplined approach. What categories do you find hardest to control?',
      'Food and transport. I am still learning how to cook efficiently to reduce costs.',
    ],
    image: '/images/mercy-kids-page-34/k34_039_i_am_on_a_budget.png',
  },
  {
    key: 'k34_040_i_need_a_reference',
    label: 'I need a reference',
    dialogue: [
      'The landlord is asking for two references before they finalise the tenancy.',
      'I need a reference from a previous employer or someone in a professional capacity.',
      'Your university tutor would count — would you feel comfortable asking them?',
      'Yes, I have a good relationship with my dissertation supervisor so I will ask her.',
    ],
    image: '/images/mercy-kids-page-34/k34_040_i_need_a_reference.png',
  },
  {
    key: 'k34_041_splitting_bills',
    label: 'Can we agree on how to split the bills?',
    dialogue: [
      'Now that we have moved into the flat together we need to sort out the finances.',
      'Can we agree on how to split the bills? I suggest we divide everything equally.',
      'That seems fair as long as we are all using the utilities in roughly equal amounts.',
      'Agreed — let us set up a shared account and each transfer the same amount monthly.',
    ],
    image: '/images/mercy-kids-page-34/k34_041_splitting_bills.png',
  },
  {
    key: 'k34_042_i_am_registering_with_a_gp',
    label: 'I am registering with a GP',
    dialogue: [
      'You mentioned you have not sorted out your healthcare since moving here.',
      'I am registering with a GP this week — I found one accepting new patients nearby.',
      'Make sure you bring proof of your address and your national insurance number.',
      'I have both ready. I also want to ask about transferring my prescription records.',
    ],
    image: '/images/mercy-kids-page-34/k34_042_i_am_registering_with_a_gp.png',
  },
  {
    key: 'k34_043_i_need_to_file_my_taxes',
    label: 'I need to file my taxes',
    dialogue: [
      'This is your first year earning income — have you thought about your tax return?',
      'I need to file my taxes for the first time and I honestly have no idea where to start.',
      'Start online with the government portal — it walks you through each step clearly.',
      'Is there a deadline I need to be aware of so I do not face a penalty?',
    ],
    image: '/images/mercy-kids-page-34/k34_043_i_need_to_file_my_taxes.png',
  },
  {
    key: 'k34_044_i_am_looking_for_a_flatmate',
    label: 'I am looking for a flatmate',
    dialogue: [
      'The rent on your own is getting too expensive — what are you going to do?',
      'I am looking for a flatmate to share the cost. I have posted on a few sites.',
      'Have you thought about what your non-negotiables are for living with someone?',
      'Clean shared spaces, quiet after eleven, and no smoking inside — those are my three.',
    ],
    image: '/images/mercy-kids-page-34/k34_044_i_am_looking_for_a_flatmate.png',
  },
  {
    key: 'k34_045_independent_life',
    label: 'Living independently is a learning curve',
    dialogue: [
      'How are you finding life on your own for the first time?',
      'Living independently is a learning curve — I have made a lot of small mistakes.',
      'Like what? I am about to move out for the first time and I want to be prepared.',
      'Things like reading meters, knowing when to call your landlord, and not over-buying food.',
    ],
    image: '/images/mercy-kids-page-34/k34_045_independent_life.png',
  },

  // ── Navigating Difficult Conversations ─────────────────────────────────────
  {
    key: 'k34_046_i_need_to_be_direct',
    label: 'I need to be direct with you',
    dialogue: [
      'This is a difficult conversation but I think we need to have it.',
      'I need to be direct with you — your behaviour in meetings is affecting the team.',
      'I was not aware of that. Can you give me a specific example so I understand?',
      'Yesterday you spoke over three colleagues. It is happening regularly and people notice.',
    ],
    image: '/images/mercy-kids-page-34/k34_046_i_need_to_be_direct.png',
  },
  {
    key: 'k34_047_that_is_not_acceptable',
    label: 'That is not acceptable',
    dialogue: [
      'Your landlord has entered your flat without giving any prior notice.',
      'That is not acceptable — tenants have the right to quiet enjoyment of the property.',
      'What should I say when I confront them about it?',
      'Say: I need written notice at least 24 hours before any future entry to my flat.',
    ],
    image: '/images/mercy-kids-page-34/k34_047_that_is_not_acceptable.png',
  },
  {
    key: 'k34_048_i_would_like_to_clarify',
    label: 'I would like to clarify something',
    dialogue: [
      'I think there has been a misunderstanding about what I said last week.',
      'I would like to clarify something — I did not agree to take on that extra project.',
      'I thought you had agreed when you said you could look into it.',
      'Looking into something and committing to it are two very different things.',
    ],
    image: '/images/mercy-kids-page-34/k34_048_i_would_like_to_clarify.png',
  },
  {
    key: 'k34_049_i_respectfully_disagree',
    label: 'I respectfully disagree',
    dialogue: [
      'The manager says the new shift schedule is fair for everyone on the team.',
      'I respectfully disagree — it consistently disadvantages the junior staff members.',
      'Can you bring data to support that before raising it formally?',
      'I have already mapped the shifts over six weeks and the pattern is very clear.',
    ],
    image: '/images/mercy-kids-page-34/k34_049_i_respectfully_disagree.png',
  },
  {
    key: 'k34_050_i_need_to_set_a_boundary',
    label: 'I need to set a boundary',
    dialogue: [
      'Your colleague keeps messaging you late at night expecting immediate replies.',
      'I need to set a boundary — I do not check work messages after seven in the evening.',
      'Did they respond well when you told them that?',
      'Yes, once I explained it clearly they were actually very respectful about it.',
    ],
    image: '/images/mercy-kids-page-34/k34_050_i_need_to_set_a_boundary.png',
  },
  {
    key: 'k34_051_i_feel_unheard',
    label: 'I feel unheard',
    dialogue: [
      'Is everything okay between you and your manager? You seem frustrated.',
      'I feel unheard — I have raised this issue three times and nothing has changed.',
      'Have you documented those conversations in writing in case you need to escalate?',
      'Not yet, but I will start doing that from now so there is a clear record.',
    ],
    image: '/images/mercy-kids-page-34/k34_051_i_feel_unheard.png',
  },
  {
    key: 'k34_052_i_am_not_comfortable_with_that',
    label: 'I am not comfortable with that',
    dialogue: [
      'They are asking you to sign something without giving you time to read it.',
      'I am not comfortable with that — I need time to review any document before signing.',
      'That is completely reasonable. Did they push back when you said that?',
      'A little, but I held firm. No one should pressure you into signing anything unread.',
    ],
    image: '/images/mercy-kids-page-34/k34_052_i_am_not_comfortable_with_that.png',
  },
  {
    key: 'k34_053_i_would_like_an_apology',
    label: 'I would like an apology',
    dialogue: [
      'Your colleague said something quite hurtful in front of the whole team.',
      'I would like an apology — what was said was unprofessional and it affected me.',
      'You are right to ask for that. How did they respond when you raised it?',
      'They apologised sincerely, which I appreciated. I think it was a lesson for them too.',
    ],
    image: '/images/mercy-kids-page-34/k34_053_i_would_like_an_apology.png',
  },
  {
    key: 'k34_054_let_us_address_this_now',
    label: 'Let us address this now',
    dialogue: [
      'There has been tension in the team for weeks and it is affecting the work.',
      'Let us address this now rather than letting it build into something bigger.',
      'I agree — do you want to have this conversation as a group or one-to-one first?',
      'One-to-one first, then bring everyone together once the key issues are resolved.',
    ],
    image: '/images/mercy-kids-page-34/k34_054_let_us_address_this_now.png',
  },
  {
    key: 'k34_055_i_want_to_understand_your_perspective',
    label: 'I want to understand your perspective',
    dialogue: [
      'We clearly see this situation very differently and it has created tension.',
      'Before I respond, I want to understand your perspective — can you walk me through it?',
      'I appreciate that. I felt dismissed when my idea was not included in the final proposal.',
      'That was not my intention at all — let me explain why that decision was made.',
    ],
    image: '/images/mercy-kids-page-34/k34_055_i_want_to_understand_your_perspective.png',
  },
  {
    key: 'k34_056_i_am_raising_a_formal_complaint',
    label: 'I am raising a formal complaint',
    dialogue: [
      'The harassment has continued despite you asking them to stop informally.',
      'I am raising a formal complaint — this behaviour is serious and needs to be recorded.',
      'Do you have evidence or witnesses who can support your account of events?',
      'I have screenshots of the messages and two colleagues who witnessed the incidents.',
    ],
    image: '/images/mercy-kids-page-34/k34_056_i_am_raising_a_formal_complaint.png',
  },
  {
    key: 'k34_057_i_own_that_mistake',
    label: 'I own that mistake',
    dialogue: [
      'The error in the data caused a significant problem for the whole project.',
      'I own that mistake — I should have double-checked the figures before submitting.',
      'What steps are you taking to make sure this does not happen again?',
      'I have set up a peer review checklist that must be completed before any submission.',
    ],
    image: '/images/mercy-kids-page-34/k34_057_i_own_that_mistake.png',
  },
  {
    key: 'k34_058_this_is_a_difficult_conversation',
    label: 'This is a difficult conversation',
    dialogue: [
      'I have been putting off talking to my flatmate about their hygiene habits.',
      'This is a difficult conversation but avoiding it will only make things worse.',
      'How do you suggest I approach it without damaging the living situation?',
      'Be specific, be kind, and focus on the behaviour rather than making it personal.',
    ],
    image: '/images/mercy-kids-page-34/k34_058_this_is_a_difficult_conversation.png',
  },
  {
    key: 'k34_059_i_have_given_this_careful_thought',
    label: 'I have given this careful thought',
    dialogue: [
      'Are you sure about leaving this job after only six months?',
      'I have given this careful thought — it is not the right environment for my growth.',
      'What specifically made you reach that conclusion after such a short time?',
      'The values of the organisation do not align with mine and that will not change.',
    ],
    image: '/images/mercy-kids-page-34/k34_059_i_have_given_this_careful_thought.png',
  },
  {
    key: 'k34_060_i_am_ready_for_this',
    label: 'I am ready for this',
    dialogue: [
      'You have your first day at the new job tomorrow — how are you feeling?',
      'Nervous but excited. I am ready for this — I have prepared as much as I can.',
      'What does being ready look like for you going into something this new?',
      'Knowing my limits, asking questions early, and not pretending to know what I do not.',
    ],
    image: '/images/mercy-kids-page-34/k34_060_i_am_ready_for_this.png',
  },
];

export const KID_PAGE_34_ID = 'page34';
export const KID_PAGE_34_TITLE = 'Adult Life English';

export function getKidPage34Item(key: string): KidPage34Item | undefined {
  return KID_PAGE_34_ITEMS.find(item => item.key === key);
}