import type { SpeakTopicLibraryEntry as SpeakTopic } from "../speakTopicLibrary";

// Job Interview theme. Real-life situations a Vietnamese learner meets in English.
// Deterministic / client-side: no per-turn LLM. Copy is warm, adult, low-shame.
// l1InterferenceNotes name genuine Vietnamese→English interference as friendly
// context, NEVER as a grammar correction.
export const jobInterviewSpeakTopics: readonly SpeakTopic[] = [
  {
    id: "topic-job-interview-tell-me-about-yourself",
    labelEn: "Tell Me About Yourself",
    labelVi: "Hãy giới thiệu về bản thân bạn",
    category: "work",
    seedInputs: ["I am a hard worker and I have five years experience in sales."],
    detectionPatterns: [
      /\b(?:tell me about yourself|about myself|introduce myself|a bit about me|my background)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-about-article",
        label: "A hard worker",
        note: "Vietnamese has no articles, so learners often say 'I am hard worker.' Natural English adds 'a': 'I am a hard worker.' It is a tiny word that makes the answer sound smooth.",
      },
      {
        id: "job-interview-about-plural-s",
        label: "Years of experience",
        note: "Vietnamese nouns do not change for plural, so 'five years experience' is common. English adds the plural -s and 'of': 'five years of experience.' Both forms are easy to hear once you notice it.",
      },
      {
        id: "job-interview-about-modesty",
        label: "Warm and confident",
        note: "Many learners feel it is polite to play small and say 'My English not so good.' In an interview it is okay to sound calm and proud: 'I'm still improving my English, and I learn fast.' Confident is not rude.",
      },
    ],
    followUps: [
      { id: "job-interview-about-open", question: "How would you start your one-minute introduction?", salienceQuestion: "How would you open your answer about the {slot}?" },
      { id: "job-interview-about-now", question: "What do you do now, or most recently?", salienceQuestion: "How would you describe your current {slot}?" },
      { id: "job-interview-about-strength", question: "What is one strength you want them to remember?", salienceQuestion: "What strength would you connect to the {slot}?" },
      { id: "job-interview-about-close", question: "How would you end and turn it back to them?", salienceQuestion: "How would you close your answer about the {slot}?" },
    ],
  },
  {
    id: "topic-job-interview-work-experience",
    labelEn: "Describing Your Work Experience",
    labelVi: "Kể về kinh nghiệm làm việc",
    category: "work",
    seedInputs: ["I work at a factory for two year before I move to the city."],
    detectionPatterns: [
      /\b(?:work experience|worked at|i used to work|my previous job|my last job|years? of experience)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-experience-past-ed",
        label: "Worked, not work",
        note: "Vietnamese verbs do not change for past time, so 'I work at a factory for two years' is very natural to say. For finished jobs English uses past -ed: 'I worked at a factory for two years.' The -ed quietly tells the listener it is the past.",
      },
      {
        id: "job-interview-experience-time-word",
        label: "Let the verb carry the time",
        note: "In Vietnamese a time word like 'before' can do all the work: 'Before I work in sales.' English likes the verb to show it too: 'Before that, I worked in sales.' You can keep both the time word and the past verb.",
      },
      {
        id: "job-interview-experience-plural",
        label: "Two years, many skills",
        note: "Dropping the plural -s gives 'two year' and 'many skill.' English wants 'two years' and 'many skills.' It is one small sound at the end of the word that makes the sentence feel complete.",
      },
    ],
    followUps: [
      { id: "job-interview-experience-where", question: "Where have you worked, and for how long?", salienceQuestion: "How would you describe how long you held the {slot}?" },
      { id: "job-interview-experience-tasks", question: "What were your main tasks there?", salienceQuestion: "What did you do every day in the {slot}?" },
      { id: "job-interview-experience-learn", question: "What did you learn from that job?", salienceQuestion: "What did you learn from the {slot}?" },
      { id: "job-interview-experience-fit", question: "How does that experience fit this role?", salienceQuestion: "How does the {slot} help you here?" },
    ],
  },
  {
    id: "topic-job-interview-strengths",
    labelEn: "Talking About Your Strengths",
    labelVi: "Nói về điểm mạnh của bạn",
    category: "work",
    seedInputs: ["My strength is I am very careful and I learn fast."],
    detectionPatterns: [
      /\b(?:my strength|my strengths|i am good at|i'm good at|what are you good at|my best quality)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-strengths-the-team",
        label: "Working with the team",
        note: "Learners often drop 'the' and say 'I work well with team.' English uses 'the team': 'I work well with the team.' The little 'the' points to a specific group everyone already knows.",
      },
      {
        id: "job-interview-strengths-give-example",
        label: "One strength plus an example",
        note: "A strong English answer names one quality and gives a quick story: 'I'm organized. Last year I planned the whole schedule for my team.' An example feels more honest than a list of adjectives.",
      },
      {
        id: "job-interview-strengths-confidence",
        label: "It is okay to say it plainly",
        note: "Some learners soften everything: 'Maybe I am a little good at...' In an interview you can say it directly: 'I'm good at solving problems.' Saying it clearly is normal and welcome here.",
      },
    ],
    followUps: [
      { id: "job-interview-strengths-name", question: "What is one strength you are sure about?", salienceQuestion: "How would you name the {slot} as a strength?" },
      { id: "job-interview-strengths-example", question: "What real example shows that strength?", salienceQuestion: "What example proves the {slot}?" },
      { id: "job-interview-strengths-use", question: "How would you use it in this job?", salienceQuestion: "How would the {slot} help in this job?" },
      { id: "job-interview-strengths-team", question: "How does it help the people around you?", salienceQuestion: "How does the {slot} help your team?" },
    ],
  },
  {
    id: "topic-job-interview-weakness",
    labelEn: "A Weakness Or Something You Are Improving",
    labelVi: "Điểm yếu hoặc điều bạn đang cải thiện",
    category: "work",
    seedInputs: ["My weakness is my English, but I am improving it every day."],
    detectionPatterns: [
      /\b(?:my weakness|a weakness|biggest weakness|something i'm working on|i need to improve|area to improve)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-weakness-improving-tense",
        label: "I am improving",
        note: "To show something is happening now, English often uses 'am improving' (the -ing form): 'I am improving my time management.' Vietnamese can carry 'now' with a separate word, so the -ing ending is the new habit to add.",
      },
      {
        id: "job-interview-weakness-too-modest",
        label: "Honest but not harsh",
        note: "Learners may translate very directly and say 'My English is bad.' A warmer, true version is 'My English is still growing, and I practice every day.' You can be honest without putting yourself down.",
      },
      {
        id: "job-interview-weakness-article",
        label: "A weakness",
        note: "Without articles in Vietnamese, 'I have weakness' is common. English adds 'a': 'I have one weakness I am working on.' The 'a' or 'one' makes it sound like a single, manageable thing.",
      },
    ],
    followUps: [
      { id: "job-interview-weakness-name", question: "What is one honest area you want to grow?", salienceQuestion: "How would you name the {slot} gently?" },
      { id: "job-interview-weakness-step", question: "What are you doing to improve it?", salienceQuestion: "What step are you taking with the {slot}?" },
      { id: "job-interview-weakness-progress", question: "What progress have you already made?", salienceQuestion: "What progress have you made on the {slot}?" },
      { id: "job-interview-weakness-frame", question: "How would you keep the tone positive?", salienceQuestion: "How would you stay positive about the {slot}?" },
    ],
  },
  {
    id: "topic-job-interview-why-this-job",
    labelEn: "Why You Want This Job",
    labelVi: "Vì sao bạn muốn công việc này",
    category: "work",
    seedInputs: ["I want this job because I like the company and I want learn more."],
    detectionPatterns: [
      /\b(?:why do you want this job|why this job|why this company|interested in this role|i want to work here)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-why-to-infinitive",
        label: "Want to learn",
        note: "Vietnamese says the equivalent of 'want learn,' so the small 'to' is easy to drop. English keeps it: 'I want to learn more.' After 'want,' the next verb almost always takes 'to.'",
      },
      {
        id: "job-interview-why-the-company",
        label: "The company, the role",
        note: "Learners may say 'I like company' or 'I like role.' English adds 'the' for the specific one in front of you: 'I like the company' and 'this role fits me.' It signals you mean their company, not any company.",
      },
      {
        id: "job-interview-why-specific",
        label: "Name something real",
        note: "A natural answer points to one concrete reason: 'I like that you train new staff.' A specific reason sounds more sincere than 'I want this job because I need a job.'",
      },
    ],
    followUps: [
      { id: "job-interview-why-reason", question: "What is your main reason for wanting this job?", salienceQuestion: "What draws you to the {slot}?" },
      { id: "job-interview-why-company", question: "What do you like about this company?", salienceQuestion: "What do you like about the {slot}?" },
      { id: "job-interview-why-match", question: "How does the role match your goals?", salienceQuestion: "How does the {slot} match your goals?" },
      { id: "job-interview-why-future", question: "What do you hope to grow into here?", salienceQuestion: "Where could the {slot} take you?" },
    ],
  },
  {
    id: "topic-job-interview-why-you-left",
    labelEn: "Why You Left Your Last Job",
    labelVi: "Vì sao bạn nghỉ việc cũ",
    category: "work",
    seedInputs: ["I leave my last job because I want a new chance to grow."],
    detectionPatterns: [
      /\b(?:why did you leave|left your last job|left my last job|why you left|reason for leaving|quit my job)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-left-past-ed",
        label: "I left, not I leave",
        note: "Because Vietnamese verbs stay the same, 'I leave my last job' is natural. The job is finished, so English uses 'left': 'I left my last job.' The past form tells the interviewer it already happened.",
      },
      {
        id: "job-interview-left-positive",
        label: "Look forward, not back",
        note: "It is tempting to translate frustration directly, but a calm reason lands better: 'I left to look for more room to grow,' rather than complaining about the old boss. Warm and forward-looking keeps the door open.",
      },
      {
        id: "job-interview-left-article",
        label: "A new chance",
        note: "With no articles in Vietnamese, 'I want new chance' is common. English adds 'a': 'I wanted a new chance to grow.' The 'a' marks it as one fresh opportunity.",
      },
    ],
    followUps: [
      { id: "job-interview-left-reason", question: "What is your calm reason for leaving?", salienceQuestion: "How would you explain leaving the {slot}?" },
      { id: "job-interview-left-positive", question: "How would you keep it positive?", salienceQuestion: "How would you stay kind about the {slot}?" },
      { id: "job-interview-left-learn", question: "What did the last job give you?", salienceQuestion: "What did you gain from the {slot}?" },
      { id: "job-interview-left-next", question: "What are you looking for next?", salienceQuestion: "What do you want after the {slot}?" },
    ],
  },
  {
    id: "topic-job-interview-questions-for-us",
    labelEn: "Do You Have Any Questions For Us",
    labelVi: "Bạn có câu hỏi nào cho chúng tôi không",
    category: "work",
    seedInputs: ["Yes, I have one question about the team and the schedule."],
    detectionPatterns: [
      /\b(?:any questions for us|do you have any questions|questions for me|i have a question|ask about the role)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-questions-do-have",
        label: "It is good to ask",
        note: "Out of politeness, learners often say 'No, I don't have a question.' In English interviews, having one question shows real interest: 'Yes, I have one question about the team.' Asking is welcome, not pushy.",
      },
      {
        id: "job-interview-questions-the-team",
        label: "The team, the schedule",
        note: "Learners may drop 'the' and say 'question about team.' English uses 'the': 'a question about the team' and 'the schedule.' The 'the' points to this job's specific team and hours.",
      },
      {
        id: "job-interview-questions-plural",
        label: "A few questions",
        note: "When asking about more than one thing, the plural -s matters: 'I have a couple of questions.' Dropping it gives 'a couple of question,' which sounds unfinished to an English ear.",
      },
    ],
    followUps: [
      { id: "job-interview-questions-team", question: "What would you ask about the team?", salienceQuestion: "What would you ask about the {slot}?" },
      { id: "job-interview-questions-day", question: "What would you ask about a normal day?", salienceQuestion: "What would you ask about the {slot} each day?" },
      { id: "job-interview-questions-growth", question: "What would you ask about growing in the role?", salienceQuestion: "What would you ask about the {slot} over time?" },
      { id: "job-interview-questions-next", question: "How would you ask about the next steps?", salienceQuestion: "How would you ask about the {slot} after today?" },
    ],
  },
  {
    id: "topic-job-interview-availability-start-date",
    labelEn: "Availability And Start Date",
    labelVi: "Thời gian rảnh và ngày bắt đầu",
    category: "work",
    seedInputs: ["I can start next week and I am free on the weekend."],
    detectionPatterns: [
      /\b(?:when can you start|start date|your availability|available to start|i can start|notice period)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-availability-can-start",
        label: "I can start",
        note: "A clear, natural frame is 'I can start next week.' Vietnamese may let the time word carry everything ('Next week I start'), but English keeps 'can' plus the simple verb: 'I can start.'",
      },
      {
        id: "job-interview-availability-on-the-weekend",
        label: "Days and time phrases",
        note: "Learners may say 'I free weekend.' English needs a small verb and preposition: 'I am free on the weekend' or 'on weekends.' The 'am' and 'on' make the time clear.",
      },
      {
        id: "job-interview-availability-plural-days",
        label: "Two weeks notice",
        note: "When you mention notice, English uses the plural: 'I need to give two weeks' notice.' Dropping the -s gives 'two week notice,' which sounds short to a native ear.",
      },
    ],
    followUps: [
      { id: "job-interview-availability-start", question: "When could you start?", salienceQuestion: "When could you begin the {slot}?" },
      { id: "job-interview-availability-hours", question: "What hours or days can you work?", salienceQuestion: "What hours could you give to the {slot}?" },
      { id: "job-interview-availability-notice", question: "Do you need to give notice first?", salienceQuestion: "What notice do you owe before the {slot}?" },
      { id: "job-interview-availability-flexible", question: "How flexible can you be?", salienceQuestion: "How flexible are you about the {slot}?" },
    ],
  },
  {
    id: "topic-job-interview-salary-question",
    labelEn: "The Salary Question",
    labelVi: "Câu hỏi về mức lương",
    category: "work",
    seedInputs: ["May I ask what is the salary for this position?"],
    detectionPatterns: [
      /\b(?:salary|pay rate|how much (?:does|do) (?:it|you) pay|expected salary|salary range|hourly rate|wage)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-salary-polite-ask",
        label: "It is okay to ask about pay",
        note: "Some learners feel it is impolite to ask about money, so they stay quiet. In English it is fine to ask gently: 'Could you tell me the salary range for this role?' A calm question is normal and expected.",
      },
      {
        id: "job-interview-salary-embedded-question",
        label: "What the salary is",
        note: "Direct translation can give 'what is the salary' inside a longer sentence. The smooth English form flips it: 'Could you tell me what the salary is?' Inside a bigger sentence, the words settle as 'what the salary is.'",
      },
      {
        id: "job-interview-salary-the-position",
        label: "For the position",
        note: "Learners may say 'salary for this position' without 'the' elsewhere in the sentence. English likes 'the' for the specific role: 'the salary for the position.' It keeps the question precise.",
      },
    ],
    followUps: [
      { id: "job-interview-salary-ask", question: "How would you ask about pay politely?", salienceQuestion: "How would you ask about the {slot} politely?" },
      { id: "job-interview-salary-range", question: "How would you ask for a range?", salienceQuestion: "How would you ask for the {slot} range?" },
      { id: "job-interview-salary-expect", question: "How would you share what you expect?", salienceQuestion: "How would you share your hoped-for {slot}?" },
      { id: "job-interview-salary-benefits", question: "What else besides pay would you ask about?", salienceQuestion: "What would you ask about besides the {slot}?" },
    ],
  },
  {
    id: "topic-job-interview-hard-situation",
    labelEn: "How You Handled A Hard Situation At Work",
    labelVi: "Cách bạn xử lý tình huống khó ở chỗ làm",
    category: "work",
    seedInputs: ["One time a customer was angry, so I stay calm and I fix the problem."],
    detectionPatterns: [
      /\b(?:difficult situation|hard situation|tough situation|handled a problem|a conflict at work|challenge at work|dealt with)\b/i,
    ],
    l1InterferenceNotes: [
      {
        id: "job-interview-hard-past-ed",
        label: "I stayed, I fixed",
        note: "Telling a finished story, learners often keep verbs bare: 'I stay calm and I fix it.' English puts the whole story in the past: 'I stayed calm and I fixed it.' Once one verb is past, the others usually follow.",
      },
      {
        id: "job-interview-hard-the-problem",
        label: "The problem, the customer",
        note: "Without articles, 'I fix problem' is natural. English adds 'the' for the specific one in the story: 'I fixed the problem' and 'I helped the customer.' It keeps the listener with you.",
      },
      {
        id: "job-interview-hard-have-handled",
        label: "Experience over time",
        note: "For things you have done across your career, English often uses 'have' plus the verb: 'I have handled many hard situations.' Vietnamese may show this with a time phrase only, so the 'have' form is the helpful new pattern.",
      },
    ],
    followUps: [
      { id: "job-interview-hard-situation", question: "What hard situation would you describe?", salienceQuestion: "How would you set up the {slot}?" },
      { id: "job-interview-hard-action", question: "What did you actually do?", salienceQuestion: "What action did you take in the {slot}?" },
      { id: "job-interview-hard-result", question: "How did it turn out?", salienceQuestion: "How did the {slot} end?" },
      { id: "job-interview-hard-lesson", question: "What did you learn from it?", salienceQuestion: "What did the {slot} teach you?" },
    ],
  },
] as const;

export const speakTopics = jobInterviewSpeakTopics;
