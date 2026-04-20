// Path: src/components/mercy-guide/kids/kidPage33Data.ts
// File: kidPage33Data.ts
// Target age: 17 | 4 topics × 15 items = 60 items
// Format: dialogue = 4-line A/B/A/B exchange

export type KidPage33Item = {
  key: string;
  label: string;
  dialogue: [string, string, string, string];
  image: string;
};

export const KID_PAGE_33_ITEMS: ReadonlyArray<KidPage33Item> = [

  // ── Academic Language ──────────────────────────────────────────────────────
  {
    key: 'k33_001_the_evidence_suggests',
    label: 'The evidence suggests...',
    dialogue: [
      'What conclusion did you reach in your essay?',
      'The evidence suggests that urban green spaces significantly reduce stress levels.',
      'That is a strong claim — what sources did you use to support it?',
      'I cited three peer-reviewed studies and one large-scale urban survey.',
    ],
    image: '/images/mercy-kids-page-33/k33_001_the_evidence_suggests.png',
  },
  {
    key: 'k33_002_in_contrast',
    label: 'In contrast...',
    dialogue: [
      'How did you compare the two approaches in your report?',
      'The first method prioritises speed. In contrast, the second focuses on long-term accuracy.',
      'Did you find one clearly superior to the other?',
      'Not exactly — it depends heavily on the context and available resources.',
    ],
    image: '/images/mercy-kids-page-33/k33_002_in_contrast.png',
  },
  {
    key: 'k33_003_to_summarize',
    label: 'To summarize...',
    dialogue: [
      'That was a very detailed presentation — can you give us the key takeaway?',
      'To summarize, the research shows three consistent patterns across all test groups.',
      'And which pattern do you consider the most significant finding overall?',
      'The third one — it challenges assumptions that have been held for over a decade.',
    ],
    image: '/images/mercy-kids-page-33/k33_003_to_summarize.png',
  },
  {
    key: 'k33_004_this_supports_the_idea',
    label: 'This supports the idea that...',
    dialogue: [
      'What does this graph tell us about student performance?',
      'This supports the idea that sleep quality directly impacts academic results.',
      'Is the correlation strong enough to draw a firm conclusion from?',
      'Yes — the r-value of 0.82 indicates a very strong positive relationship.',
    ],
    image: '/images/mercy-kids-page-33/k33_004_this_supports_the_idea.png',
  },
  {
    key: 'k33_005_furthermore',
    label: 'Furthermore...',
    dialogue: [
      'You argued that remote work increases productivity — is there more to it?',
      'Furthermore, it reduces commuting stress and improves work-life balance significantly.',
      'But do all employees benefit equally from working remotely?',
      'No — the data shows introverts benefit more than extroverts on average.',
    ],
    image: '/images/mercy-kids-page-33/k33_005_furthermore.png',
  },
  {
    key: 'k33_006_however',
    label: 'However...',
    dialogue: [
      'Your argument seemed very one-sided in the first paragraph.',
      'However, I did address the counterarguments in the third section of the essay.',
      'I missed that part — what was the strongest counterargument you found?',
      'That the policy costs outweigh the short-term benefits for smaller communities.',
    ],
    image: '/images/mercy-kids-page-33/k33_006_however.png',
  },
  {
    key: 'k33_007_it_can_be_argued',
    label: 'It can be argued that...',
    dialogue: [
      'Is standardised testing a fair measure of student ability?',
      'It can be argued that it favours students from more privileged backgrounds.',
      'What evidence supports that position in the academic literature?',
      'Multiple studies show a strong correlation between test scores and family income.',
    ],
    image: '/images/mercy-kids-page-33/k33_007_it_can_be_argued.png',
  },
  {
    key: 'k33_008_as_a_result',
    label: 'As a result...',
    dialogue: [
      'What happened after the policy was implemented in the school?',
      'Attendance improved by 18 percent. As a result, exam pass rates rose significantly.',
      'Were there any negative side effects that the study noted?',
      'Yes — teacher workload increased, which led to higher reported stress levels.',
    ],
    image: '/images/mercy-kids-page-33/k33_008_as_a_result.png',
  },
  {
    key: 'k33_009_in_conclusion',
    label: 'In conclusion...',
    dialogue: [
      'How did you wrap up your argument in the final paragraph?',
      'In conclusion, I argued that both individual and systemic change are necessary.',
      'Did you offer any practical recommendations for moving forward?',
      'Yes — I proposed three specific policy changes supported by the research.',
    ],
    image: '/images/mercy-kids-page-33/k33_009_in_conclusion.png',
  },
  {
    key: 'k33_010_according_to',
    label: 'According to...',
    dialogue: [
      'Where did you find the statistics you used in the introduction?',
      'According to the World Health Organization, one in four people face mental health issues.',
      'Is that figure specific to a particular age group or region?',
      'It is a global figure, but the rate is higher among people aged fifteen to twenty-four.',
    ],
    image: '/images/mercy-kids-page-33/k33_010_according_to.png',
  },
  {
    key: 'k33_011_on_the_one_hand',
    label: 'On the one hand...',
    dialogue: [
      'What is the main tension in your argument about social media?',
      'On the one hand, it connects people. On the other, it fuels comparison and anxiety.',
      'Which side of the argument did you ultimately come down on?',
      'I argued that the design of platforms is the root issue, not the technology itself.',
    ],
    image: '/images/mercy-kids-page-33/k33_011_on_the_one_hand.png',
  },
  {
    key: 'k33_012_this_suggests_that',
    label: 'This suggests that...',
    dialogue: [
      'What do the survey results tell us about reading habits among teenagers?',
      'This suggests that digital reading has largely replaced physical books for leisure.',
      'Does the data show any difference between age groups within the teen range?',
      'Yes — younger teens still prefer picture books while older ones favour articles online.',
    ],
    image: '/images/mercy-kids-page-33/k33_012_this_suggests_that.png',
  },
  {
    key: 'k33_013_a_key_finding_is',
    label: 'A key finding is...',
    dialogue: [
      'What was the most important result from your experiment?',
      'A key finding is that group collaboration improved outcomes by 34 percent.',
      'That is a significant improvement — was the sample size large enough to be reliable?',
      'We tested 240 participants across six schools, so yes, it is statistically significant.',
    ],
    image: '/images/mercy-kids-page-33/k33_013_a_key_finding_is.png',
  },
  {
    key: 'k33_014_it_is_worth_noting',
    label: 'It is worth noting...',
    dialogue: [
      'Is there anything about your methodology that could be questioned?',
      'It is worth noting that the study was conducted during exam season, which may skew results.',
      'How would you address that limitation in a follow-up study?',
      'I would replicate it across three different time periods to control for seasonal effects.',
    ],
    image: '/images/mercy-kids-page-33/k33_014_it_is_worth_noting.png',
  },
  {
    key: 'k33_015_the_data_indicates',
    label: 'The data indicates...',
    dialogue: [
      'What trend did you notice when analysing the long-term results?',
      'The data indicates a gradual but consistent decline in attention spans over ten years.',
      'Do you attribute that to technology use, or are there other contributing factors?',
      'Technology is the primary driver, but changes in education format also play a role.',
    ],
    image: '/images/mercy-kids-page-33/k33_015_the_data_indicates.png',
  },

  // ── Presentations & Public Speaking ───────────────────────────────────────
  {
    key: 'k33_016_today_ill_be_talking_about',
    label: "Today I'll be talking about...",
    dialogue: [
      'Are you ready to begin your presentation to the class?',
      "Today I'll be talking about the economic impact of climate change on coastal cities.",
      'Could you start by giving us a brief overview of your main arguments?',
      'Of course — I have structured it around three core themes: cost, risk, and adaptation.',
    ],
    image: '/images/mercy-kids-page-33/k33_016_today_ill_be_talking_about.png',
  },
  {
    key: 'k33_017_moving_on_to_my_next_point',
    label: 'Moving on to my next point...',
    dialogue: [
      'You have covered the historical background very clearly so far.',
      'Thank you. Moving on to my next point, I want to examine current policy responses.',
      'Will you be comparing different countries or focusing on one case study?',
      'I will use three countries as comparative examples to highlight different approaches.',
    ],
    image: '/images/mercy-kids-page-33/k33_017_moving_on_to_my_next_point.png',
  },
  {
    key: 'k33_018_to_conclude',
    label: 'To conclude...',
    dialogue: [
      'How are you planning to close your presentation today?',
      'To conclude, I will call for stronger international cooperation on this issue.',
      'That is a bold ending — are you prepared for challenging questions?',
      'Absolutely — I have prepared responses to the five most likely objections.',
    ],
    image: '/images/mercy-kids-page-33/k33_018_to_conclude.png',
  },
  {
    key: 'k33_019_any_questions',
    label: 'Any questions?',
    dialogue: [
      'You have just finished a ten-minute presentation to the panel.',
      'Thank you for listening. Any questions before I hand back to the chair?',
      'Yes — you mentioned a funding gap. How large is it exactly?',
      'It currently stands at approximately 2.4 billion dollars across developing nations.',
    ],
    image: '/images/mercy-kids-page-33/k33_019_any_questions.png',
  },
  {
    key: 'k33_020_as_you_can_see_from',
    label: 'As you can see from...',
    dialogue: [
      'Can you walk us through the slide you have just put up?',
      'As you can see from this graph, growth accelerated sharply after 2018.',
      'What do you think caused that sudden spike in the data at that point?',
      'It coincided with a major policy reform and a significant rise in investment.',
    ],
    image: '/images/mercy-kids-page-33/k33_020_as_you_can_see_from.png',
  },
  {
    key: 'k33_021_let_me_take_you_through',
    label: 'Let me take you through...',
    dialogue: [
      'Your topic sounds complex — how will you make it accessible to the audience?',
      'Let me take you through each stage step by step so it is easy to follow.',
      'Will you be using visuals to support each stage of the explanation?',
      'Yes — I have prepared a short animation and three supporting diagrams.',
    ],
    image: '/images/mercy-kids-page-33/k33_021_let_me_take_you_through.png',
  },
  {
    key: 'k33_022_that_is_a_great_question',
    label: 'That is a great question',
    dialogue: [
      'Do you think your solution would work in a developing country context?',
      'That is a great question — I actually dedicated a section of my report to that.',
      'And what was your conclusion after examining the developing country context?',
      'The model works but requires significant adaptation to local infrastructure conditions.',
    ],
    image: '/images/mercy-kids-page-33/k33_022_that_is_a_great_question.png',
  },
  {
    key: 'k33_023_i_would_like_to_draw_your_attention',
    label: 'I would like to draw your attention to...',
    dialogue: [
      'Is there a particular part of your data you want us to focus on?',
      'I would like to draw your attention to the sharp outlier in the bottom-left corner.',
      'Why does that outlier matter more than the general trend you described?',
      'Because it represents an entire demographic that the mainstream analysis ignores.',
    ],
    image: '/images/mercy-kids-page-33/k33_023_i_would_like_to_draw_your_attention.png',
  },
  {
    key: 'k33_024_in_summary',
    label: 'In summary...',
    dialogue: [
      'Can you give a one-minute recap for anyone who came in late?',
      'In summary, we have three viable solutions, each with distinct trade-offs.',
      'Which of the three would you personally recommend to the decision-makers?',
      'The second — it balances cost, speed, and long-term sustainability most effectively.',
    ],
    image: '/images/mercy-kids-page-33/k33_024_in_summary.png',
  },
  {
    key: 'k33_025_i_will_now_hand_over_to',
    label: 'I will now hand over to...',
    dialogue: [
      'How will your group manage the transition between different speakers?',
      'I will now hand over to Linh, who will cover the financial analysis section.',
      'Is Linh prepared to answer technical questions about the projections?',
      'Yes — she built the financial model herself and knows every figure inside out.',
    ],
    image: '/images/mercy-kids-page-33/k33_025_i_will_now_hand_over_to.png',
  },
  {
    key: 'k33_026_to_illustrate_this_point',
    label: 'To illustrate this point...',
    dialogue: [
      'Your argument about inequality feels quite abstract — can you ground it somehow?',
      'To illustrate this point, consider a student in rural Vietnam versus one in Hanoi.',
      'Are you saying the gap in resources is the main driver of unequal outcomes?',
      'Exactly — the data shows it is far more significant than any individual factor.',
    ],
    image: '/images/mercy-kids-page-33/k33_026_to_illustrate_this_point.png',
  },
  {
    key: 'k33_027_i_am_open_to_feedback',
    label: 'I am open to feedback',
    dialogue: [
      'How do you feel about receiving criticism of your presentation today?',
      'I am open to feedback — it is the only way I will actually improve.',
      'One observation: your conclusion felt rushed compared to the strong opening.',
      'That is fair — I will restructure the final two minutes before the actual event.',
    ],
    image: '/images/mercy-kids-page-33/k33_027_i_am_open_to_feedback.png',
  },
  {
    key: 'k33_028_please_refer_to',
    label: 'Please refer to...',
    dialogue: [
      'Where can the audience find the detailed breakdown you just mentioned?',
      'Please refer to the appendix on page twelve for the full statistical breakdown.',
      'Should we review the appendix now or after the main presentation is complete?',
      'I recommend after — it is dense and will make more sense in context.',
    ],
    image: '/images/mercy-kids-page-33/k33_028_please_refer_to.png',
  },
  {
    key: 'k33_029_building_on_that',
    label: 'Building on that...',
    dialogue: [
      'Minh made a strong point about community engagement in her section.',
      'Building on that, I would argue that digital tools can scale that engagement globally.',
      'Do you have evidence of communities that have successfully done this at scale?',
      'Yes — I have two case studies from South Korea and Brazil that demonstrate it clearly.',
    ],
    image: '/images/mercy-kids-page-33/k33_029_building_on_that.png',
  },
  {
    key: 'k33_030_i_would_like_to_emphasise',
    label: 'I would like to emphasise...',
    dialogue: [
      'Is there one message you really want the audience to take away today?',
      'I would like to emphasise that inaction now will cost far more in the long run.',
      'Can you quantify that cost in a way that makes it tangible for people?',
      'Yes — every year of delay adds an estimated forty billion dollars to the eventual bill.',
    ],
    image: '/images/mercy-kids-page-33/k33_030_i_would_like_to_emphasise.png',
  },

  // ── Job Interviews & CVs ───────────────────────────────────────────────────
  {
    key: 'k33_031_im_a_fast_learner',
    label: "I'm a fast learner",
    dialogue: [
      'This role requires you to master three new software tools within your first month.',
      "I'm a fast learner — I taught myself two design programs during the last school holiday.",
      'Can you give us a specific example of how quickly you picked up a new skill?',
      'I learned video editing from scratch in two weeks and produced a short documentary.',
    ],
    image: '/images/mercy-kids-page-33/k33_031_im_a_fast_learner.png',
  },
  {
    key: 'k33_032_my_greatest_strength_is',
    label: 'My greatest strength is...',
    dialogue: [
      'Could you start by telling us a little about your key strengths?',
      'My greatest strength is my ability to stay calm and organised under pressure.',
      'Can you describe a situation where that strength made a real difference?',
      'During exam season I managed three group projects simultaneously without missing a deadline.',
    ],
    image: '/images/mercy-kids-page-33/k33_032_my_greatest_strength_is.png',
  },
  {
    key: 'k33_033_i_work_well_under_pressure',
    label: 'I work well under pressure',
    dialogue: [
      'This position involves tight deadlines and frequent last-minute changes.',
      'I work well under pressure — I actually find that I focus better when the stakes are high.',
      'Tell us about a time when you had to deliver something important at very short notice.',
      'I rewrote and submitted a ten-page report in four hours after the original was lost.',
    ],
    image: '/images/mercy-kids-page-33/k33_033_i_work_well_under_pressure.png',
  },
  {
    key: 'k33_034_where_do_you_see_yourself',
    label: 'Where do you see yourself in five years?',
    dialogue: [
      'We always like to understand a candidate\'s long-term ambitions.',
      'In five years, I see myself leading a small team and contributing to strategic decisions.',
      'That is ambitious — what steps are you taking right now to work toward that goal?',
      'I am completing a leadership course and seeking mentorship from professionals in the field.',
    ],
    image: '/images/mercy-kids-page-33/k33_034_where_do_you_see_yourself.png',
  },
  {
    key: 'k33_035_i_am_passionate_about',
    label: 'I am passionate about...',
    dialogue: [
      'Why did you apply for this particular role rather than similar ones elsewhere?',
      'I am passionate about sustainable technology and this company is a leader in that space.',
      'How has that passion translated into action or experience so far in your life?',
      'I co-founded my school\'s first environmental club and ran it for two years.',
    ],
    image: '/images/mercy-kids-page-33/k33_035_i_am_passionate_about.png',
  },
  {
    key: 'k33_036_i_am_a_team_player',
    label: 'I am a team player',
    dialogue: [
      'How would your classmates describe your approach to group work?',
      'They would say I am a team player who makes sure everyone\'s voice is heard.',
      'But can you also work independently when a task requires it?',
      'Absolutely — I completed my entire research dissertation alone over three months.',
    ],
    image: '/images/mercy-kids-page-33/k33_036_i_am_a_team_player.png',
  },
  {
    key: 'k33_037_my_weakness_is',
    label: 'My weakness is...',
    dialogue: [
      'Every candidate has areas for growth — what would you say yours is?',
      'My weakness is that I can be overly detail-oriented, which sometimes slows me down.',
      'And how are you actively working to manage that tendency?',
      'I now set strict time limits for each task and review priorities before I start.',
    ],
    image: '/images/mercy-kids-page-33/k33_037_my_weakness_is.png',
  },
  {
    key: 'k33_038_i_have_experience_in',
    label: 'I have experience in...',
    dialogue: [
      'Your CV mentions several extracurricular activities — can you tell us more?',
      'I have experience in event management, having organised three school-wide competitions.',
      'What was the largest event you managed and how many people were involved?',
      'Our annual science fair — over four hundred students and sixty external judges attended.',
    ],
    image: '/images/mercy-kids-page-33/k33_038_i_have_experience_in.png',
  },
  {
    key: 'k33_039_i_thrive_in',
    label: 'I thrive in...',
    dialogue: [
      'What kind of working environment brings out the best in you?',
      'I thrive in fast-paced environments where creativity and initiative are valued.',
      'How do you handle it when processes are slow or bureaucratic by nature?',
      'I focus on what I can control and find small ways to improve efficiency within constraints.',
    ],
    image: '/images/mercy-kids-page-33/k33_039_i_thrive_in.png',
  },
  {
    key: 'k33_040_i_am_committed_to_growth',
    label: 'I am committed to growth',
    dialogue: [
      'How important is professional development to you at this stage of your career?',
      'I am committed to growth — I read one industry-related book every month.',
      'Are there any specific skills you are currently focused on developing?',
      'Yes — data analysis and public speaking are my two priorities for this year.',
    ],
    image: '/images/mercy-kids-page-33/k33_040_i_am_committed_to_growth.png',
  },
  {
    key: 'k33_041_i_led_a_project',
    label: 'I led a project...',
    dialogue: [
      'Can you demonstrate that you have real leadership experience beyond the classroom?',
      'I led a project last year to redesign our school website — a team of eight students.',
      'What was the biggest challenge you faced as the leader of that project?',
      'Keeping everyone motivated when we hit technical problems in the final two weeks.',
    ],
    image: '/images/mercy-kids-page-33/k33_041_i_led_a_project.png',
  },
  {
    key: 'k33_042_i_am_detail_oriented',
    label: 'I am detail-oriented',
    dialogue: [
      'This role requires producing error-free reports under considerable time pressure.',
      'I am detail-oriented — I always proofread my work at least twice before submitting.',
      'Have you ever caught a significant error that would have caused a serious problem?',
      'Yes — I spotted a calculation error in a financial report that would have misled the board.',
    ],
    image: '/images/mercy-kids-page-33/k33_042_i_am_detail_oriented.png',
  },
  {
    key: 'k33_043_tell_me_about_yourself',
    label: 'Tell me about yourself',
    dialogue: [
      'Before we begin the formal questions, please introduce yourself briefly.',
      'I am a seventeen-year-old student with a strong interest in technology and social impact.',
      'What one experience has shaped who you are more than any other?',
      'Volunteering at a rural school taught me that access to education changes everything.',
    ],
    image: '/images/mercy-kids-page-33/k33_043_tell_me_about_yourself.png',
  },
  {
    key: 'k33_044_i_would_bring',
    label: 'I would bring...',
    dialogue: [
      'Why should we choose you over the other candidates we have interviewed?',
      'I would bring a combination of technical skills, creativity, and genuine commitment.',
      'Could you be more specific about what makes your combination of skills unique?',
      'I can code, design, and communicate — most candidates can do only one or two of those.',
    ],
    image: '/images/mercy-kids-page-33/k33_044_i_would_bring.png',
  },
  {
    key: 'k33_045_do_you_have_any_questions',
    label: 'Do you have any questions for us?',
    dialogue: [
      'We have reached the end of our formal questions — the floor is yours.',
      'Do you have any questions for us about the role or the team culture here?',
      'Yes — what does success look like in this position after the first ninety days?',
      'We expect you to have built strong relationships and delivered your first independent project.',
    ],
    image: '/images/mercy-kids-page-33/k33_045_do_you_have_any_questions.png',
  },

  // ── Making Decisions & Planning ────────────────────────────────────────────
  {
    key: 'k33_046_ive_weighed_the_pros_and_cons',
    label: "I've weighed the pros and cons",
    dialogue: [
      'How did you finally decide which university course to apply for?',
      "I've weighed the pros and cons of each option carefully over several weeks.",
      'What was the deciding factor that tipped you toward your final choice?',
      'The research opportunities available in year three were unmatched by the other programmes.',
    ],
    image: '/images/mercy-kids-page-33/k33_046_ive_weighed_the_pros_and_cons.png',
  },
  {
    key: 'k33_047_my_priority_is',
    label: 'My priority is...',
    dialogue: [
      'With so many responsibilities, how do you decide what to focus on first?',
      'My priority is always to complete the highest-impact tasks before anything else.',
      'Do you use any specific system or tool to manage your workload and priorities?',
      'Yes — I use a weekly planning matrix to categorise tasks by urgency and importance.',
    ],
    image: '/images/mercy-kids-page-33/k33_047_my_priority_is.png',
  },
  {
    key: 'k33_048_i_am_committed_to',
    label: 'I am committed to...',
    dialogue: [
      'Are you likely to stay with this organisation long term if offered the position?',
      'I am committed to this field for the long term — it aligns with my core values.',
      'What would make you consider leaving a role before achieving your initial goals?',
      'Only a fundamental misalignment between company values and my own ethical standards.',
    ],
    image: '/images/mercy-kids-page-33/k33_048_i_am_committed_to.png',
  },
  {
    key: 'k33_049_lets_set_a_deadline',
    label: "Let's set a deadline",
    dialogue: [
      'We keep discussing this project but nothing ever seems to get finalised.',
      "Let's set a deadline — I suggest we aim to complete the first draft by Friday.",
      'That feels tight given everything else we have on this week.',
      'Then let us split the sections today and each commit to finishing our part by Thursday.',
    ],
    image: '/images/mercy-kids-page-33/k33_049_lets_set_a_deadline.png',
  },
  {
    key: 'k33_050_i_have_made_my_decision',
    label: 'I have made my decision',
    dialogue: [
      'You have been going back and forth about this for weeks now.',
      'I have made my decision — I am applying for the scholarship programme in Singapore.',
      'That is a big commitment — are you fully prepared for what that means?',
      'I have thought it through carefully and I believe it is the right step for my future.',
    ],
    image: '/images/mercy-kids-page-33/k33_050_i_have_made_my_decision.png',
  },
  {
    key: 'k33_051_lets_break_it_down',
    label: "Let's break it down",
    dialogue: [
      'This project feels overwhelming — I do not know where to even begin.',
      "Let's break it down into smaller tasks and tackle them one at a time.",
      'How do you suggest we divide the work fairly among the four team members?',
      'Based on each person\'s strengths — assign research, writing, design, and review separately.',
    ],
    image: '/images/mercy-kids-page-33/k33_051_lets_break_it_down.png',
  },
  {
    key: 'k33_052_the_risk_is_worth_it',
    label: 'The risk is worth it',
    dialogue: [
      'Are you not worried about leaving a stable path to pursue something uncertain?',
      'The risk is worth it — playing it safe has never led to anything extraordinary.',
      'But how do you protect yourself if things do not go according to plan?',
      'I have a clear fallback strategy and six months of savings to give me a safety net.',
    ],
    image: '/images/mercy-kids-page-33/k33_052_the_risk_is_worth_it.png',
  },
  {
    key: 'k33_053_i_need_more_information',
    label: 'I need more information',
    dialogue: [
      'Can you make a decision on this by the end of the meeting today?',
      'I need more information before I can commit — specifically the budget and timeline.',
      'I can get you the budget figures by tomorrow morning at the latest.',
      'In that case I will give you my final answer by tomorrow afternoon.',
    ],
    image: '/images/mercy-kids-page-33/k33_053_i_need_more_information.png',
  },
  {
    key: 'k33_054_lets_revisit_this',
    label: "Let's revisit this",
    dialogue: [
      'I think we may have made a mistake in choosing this approach for the campaign.',
      "Let's revisit this with fresh eyes — sometimes distance gives us better clarity.",
      'Are you suggesting we pause the whole project or just reconsider one element?',
      'Just the messaging strategy — the core idea is still strong and worth pursuing.',
    ],
    image: '/images/mercy-kids-page-33/k33_054_lets_revisit_this.png',
  },
  {
    key: 'k33_055_in_the_long_run',
    label: 'In the long run...',
    dialogue: [
      'Is it worth investing so much time into something with such an uncertain outcome?',
      'In the long run, the skills I develop will be valuable regardless of the outcome.',
      'What is the worst-case scenario and how would you recover from it?',
      'I lose six months of time but gain experience, a network, and a clearer direction.',
    ],
    image: '/images/mercy-kids-page-33/k33_055_in_the_long_run.png',
  },
  {
    key: 'k33_056_i_propose',
    label: 'I propose...',
    dialogue: [
      'We need a solution to the falling engagement numbers — what do you suggest?',
      'I propose we shift from weekly to daily short-form content across all channels.',
      'That would require significantly more resources — how do we justify the extra cost?',
      'The projected increase in reach would generate enough revenue to cover it within 90 days.',
    ],
    image: '/images/mercy-kids-page-33/k33_056_i_propose.png',
  },
  {
    key: 'k33_057_we_should_plan_ahead',
    label: 'We should plan ahead',
    dialogue: [
      'I think we can figure things out as we go — why plan so far in advance?',
      'We should plan ahead — last year we scrambled because we had no contingency.',
      'What is the minimum planning horizon you think we need for a project like this?',
      'At least three months — enough time to anticipate obstacles and adjust course.',
    ],
    image: '/images/mercy-kids-page-33/k33_057_we_should_plan_ahead.png',
  },
  {
    key: 'k33_058_i_stand_by_my_decision',
    label: 'I stand by my decision',
    dialogue: [
      'Several people have questioned the approach you chose — are you having doubts?',
      'I stand by my decision — I made it based on the best available evidence at the time.',
      'Would you be open to revisiting it if new evidence emerged that contradicted it?',
      'Absolutely — changing your mind based on evidence is a strength, not a weakness.',
    ],
    image: '/images/mercy-kids-page-33/k33_058_i_stand_by_my_decision.png',
  },
  {
    key: 'k33_059_lets_evaluate_our_progress',
    label: "Let's evaluate our progress",
    dialogue: [
      'We are halfway through the semester — how do you think things are going?',
      "Let's evaluate our progress against the goals we set at the beginning.",
      'What metrics are you using to measure whether we are on track?',
      'Completion rate, quality of output, and whether we are still within the budget.',
    ],
    image: '/images/mercy-kids-page-33/k33_059_lets_evaluate_our_progress.png',
  },
  {
    key: 'k33_060_the_next_step_is',
    label: 'The next step is...',
    dialogue: [
      'We have agreed on the strategy — so what happens now?',
      'The next step is to assign clear responsibilities and confirm the timeline with everyone.',
      'Who do you think should lead the coordination between the different teams?',
      'Thanh — she has the strongest relationships with all the stakeholders involved.',
    ],
    image: '/images/mercy-kids-page-33/k33_060_the_next_step_is.png',
  },
];

export const KID_PAGE_33_ID = 'page33';
export const KID_PAGE_33_TITLE = 'Academic & Professional English';

export function getKidPage33Item(key: string): KidPage33Item | undefined {
  return KID_PAGE_33_ITEMS.find(item => item.key === key);
}