// Indonesian extra lesson: Neighborhood fire safety

export type IndonesianLessonSentence = {
  indonesian: string;
  vietnamese: string;
  english: string;
  pronunciation?: string;
  notes?: string;
};

export type IndonesianVocabEntry = {
  term: string;
  meaning_vi: string;
  meaning_en: string;
  example?: string;
};

export type IndonesianDialogueLine = {
  speaker: string;
  indonesian: string;
  vietnamese: string;
  english: string;
};

export type IndonesianExercise = {
  type: "translation" | "fill_blank" | "roleplay" | "matching";
  prompt_vi: string;
  prompt_en: string;
  answer?: string;
};

export type IndonesianCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IndonesianLesson = {
  id: string;
  level: IndonesianCefrLevel;
  category: string;
  title_vi: string;
  title_en: string;
  sentences: IndonesianLessonSentence[];
  vocabulary: IndonesianVocabEntry[];
  dialogue: IndonesianDialogueLine[];
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
  tip_advice_vi?: string[];
  tip_advice_en?: string[];
  exercises?: IndonesianExercise[];
};

export const lessons: IndonesianLesson[] = [
  {
    id: "indonesian_neighborhood_fire_safety",
    level: "B1",
    category: "emergency",
    title_vi: "An toan chay no trong khu pho",
    title_en: "Neighborhood fire safety",
    sentences: [
      {
        indonesian: "Ada kebakaran di rumah sebelah!",
        vietnamese: "Co chay o nha ben canh!",
        english: "There is a fire at the house next door!",
        pronunciation: "AH-dah keh-bah-KAH-rahn dee ROO-mah seh-BEH-lah",
        notes: "Kebakaran means a fire incident. Di marks the location: di rumah sebelah.",
      },
      {
        indonesian: "Tolong matikan kompor dan cek tabung gas.",
        vietnamese: "Lam on tat bep va kiem tra binh gas.",
        english: "Please turn off the stove and check the gas cylinder.",
        pronunciation: "TOH-long MAH-tee-kahn KOM-por dahn chek TAH-boong gahs",
        notes: "Matikan means turn off. Tabung gas is a common term for an LPG gas cylinder.",
      },
      {
        indonesian: "Alarm kebakaran berbunyi, kita harus keluar sekarang.",
        vietnamese: "Bao dong chay dang reo, chung ta phai ra ngoai ngay.",
        english: "The fire alarm is ringing; we have to go out now.",
        pronunciation: "AH-larm keh-bah-KAH-rahn ber-BOO-nyee KEE-tah HAH-roos keh-LOO-ar seh-KAH-rahng",
        notes: "Harus makes the sentence urgent: must or have to.",
      },
      {
        indonesian: "Jangan gunakan lift saat evakuasi.",
        vietnamese: "Dung dung thang may khi so tan.",
        english: "Do not use the elevator during evacuation.",
        pronunciation: "JAH-ngahn goo-NAH-kahn leef saat eh-vah-koo-AH-see",
        notes: "Use jangan for instructions that prohibit an action.",
      },
      {
        indonesian: "Hubungi pemadam kebakaran dan berikan alamat lengkap.",
        vietnamese: "Lien he luc luong cuu hoa va cung cap dia chi day du.",
        english: "Contact the fire department and give the full address.",
        pronunciation: "hoo-BOON-gee peh-MAH-dahm keh-bah-KAH-rahn dahn beh-REE-kahn AH-lah-maht leng-KAHP",
        notes: "Pemadam kebakaran refers to firefighters or the fire department; alamat lengkap is the full address.",
      },
      {
        indonesian: "Semua warga berkumpul di titik kumpul dekat pos satpam.",
        vietnamese: "Tat ca cu dan tap trung tai diem tap ket gan bot bao ve.",
        english: "All residents gather at the assembly point near the security post.",
        pronunciation: "seh-MOO-ah WAR-gah ber-KOOM-pool dee TEE-teek KOOM-pool deh-KAHT pos SAHT-pahm",
        notes: "Titik kumpul means assembly point. Warga means residents or neighborhood members.",
      },
      {
        indonesian: "Warga membantu membawa anak-anak dan lansia ke tempat aman.",
        vietnamese: "Nguoi dan giup dua tre em va nguoi cao tuoi den noi an toan.",
        english: "Residents help bring children and elderly people to a safe place.",
        pronunciation: "WAR-gah mem-BAHN-too mem-BAH-wah AH-nahk AH-nahk dahn LAHN-see-ah keh TEM-paht AH-mahn",
        notes: "Ke shows movement toward a place: ke tempat aman.",
      },
      {
        indonesian: "Jangan masuk lagi sebelum petugas bilang aman.",
        vietnamese: "Dung vao lai truoc khi nhan vien chuc nang noi la an toan.",
        english: "Do not go back in before the officers say it is safe.",
        pronunciation: "JAH-ngahn MAH-sook LAH-gee seh-BEH-loom peh-TOO-gahs BEE-lahng AH-mahn",
        notes: "Petugas is a general word for officers or officials on duty.",
      },
      {
        indonesian: "Pencegahan kebakaran dimulai dari cek kabel dan gas secara rutin.",
        vietnamese: "Phong chay bat dau tu viec kiem tra day dien va gas thuong xuyen.",
        english: "Fire prevention starts with checking electrical cables and gas regularly.",
        pronunciation: "pen-cheh-GAH-hahn keh-bah-KAH-rahn dee-MOO-lai DAH-ree chek KAH-bel dahn gahs seh-CHAH-rah roo-TEEN",
        notes: "Pencegahan means prevention. Secara rutin means regularly.",
      },
      {
        indonesian: "Latihan evakuasi perlu dilakukan bersama RT.",
        vietnamese: "Can tap dien so tan cung to dan pho RT.",
        english: "Evacuation drills need to be done together with the RT neighborhood unit.",
        pronunciation: "LAH-tee-hahn eh-vah-koo-AH-see PER-loo dee-LAH-koo-kahn ber-SAH-mah er-teh",
        notes: "RT is a local neighborhood unit in Indonesia; keep the Indonesian abbreviation.",
      },
    ],
    vocabulary: [
      {
        term: "kebakaran",
        meaning_vi: "vu chay, hoa hoan",
        meaning_en: "fire incident",
        example: "Ada kebakaran di gang belakang.",
      },
      {
        term: "tabung gas",
        meaning_vi: "binh gas",
        meaning_en: "gas cylinder",
        example: "Jauhkan tabung gas dari sumber api.",
      },
      {
        term: "alarm",
        meaning_vi: "chuong bao dong",
        meaning_en: "alarm",
        example: "Alarm berbunyi saat ada asap.",
      },
      {
        term: "evakuasi",
        meaning_vi: "so tan",
        meaning_en: "evacuation",
        example: "Ikuti jalur evakuasi dengan tenang.",
      },
      {
        term: "pemadam kebakaran",
        meaning_vi: "cuu hoa, luc luong cuu hoa",
        meaning_en: "firefighters; fire department",
        example: "Pemadam kebakaran datang setelah warga menelepon.",
      },
      {
        term: "titik kumpul",
        meaning_vi: "diem tap ket",
        meaning_en: "assembly point",
        example: "Titik kumpul ada di lapangan kecil.",
      },
      {
        term: "warga",
        meaning_vi: "cu dan, nguoi dan trong khu",
        meaning_en: "residents; community members",
        example: "Warga membantu memindahkan sepeda motor.",
      },
      {
        term: "pencegahan",
        meaning_vi: "su phong ngua",
        meaning_en: "prevention",
        example: "Pencegahan lebih baik daripada panik saat darurat.",
      },
      {
        term: "jalur evakuasi",
        meaning_vi: "loi/duong so tan",
        meaning_en: "evacuation route",
        example: "Jangan parkir di jalur evakuasi.",
      },
      {
        term: "tempat aman",
        meaning_vi: "noi an toan",
        meaning_en: "safe place",
        example: "Bawa lansia ke tempat aman dulu.",
      },
    ],
    dialogue: [
      {
        speaker: "Rina",
        indonesian: "Pak, ada asap dari rumah sebelah. Sepertinya ada kebakaran.",
        vietnamese: "Chu oi, co khoi tu nha ben canh. Co ve co chay.",
        english: "Sir, there is smoke from the house next door. It looks like there is a fire.",
      },
      {
        speaker: "Pak Agus",
        indonesian: "Baik, bunyikan alarm dan minta warga keluar lewat jalur evakuasi.",
        vietnamese: "Duoc, bat bao dong va bao cu dan ra ngoai theo duong so tan.",
        english: "Okay, sound the alarm and ask residents to leave through the evacuation route.",
      },
      {
        speaker: "Rina",
        indonesian: "Saya akan hubungi pemadam kebakaran dan sebutkan alamat lengkap.",
        vietnamese: "Toi se goi cuu hoa va noi dia chi day du.",
        english: "I will contact the fire department and give the full address.",
      },
      {
        speaker: "Pak Agus",
        indonesian: "Tolong cek tabung gas, tapi jangan masuk kalau api sudah besar.",
        vietnamese: "Lam on kiem tra binh gas, nhung dung vao neu lua da lon.",
        english: "Please check the gas cylinder, but do not go in if the fire is already big.",
      },
      {
        speaker: "Rina",
        indonesian: "Warga sudah membantu anak-anak dan lansia ke titik kumpul.",
        vietnamese: "Cu dan da giup dua tre em va nguoi cao tuoi den diem tap ket.",
        english: "Residents have helped children and elderly people to the assembly point.",
      },
      {
        speaker: "Pak Agus",
        indonesian: "Bagus. Tidak ada yang boleh masuk lagi sebelum petugas bilang aman.",
        vietnamese: "Tot. Khong ai duoc vao lai truoc khi nhan vien chuc nang noi la an toan.",
        english: "Good. No one may go back in before the officers say it is safe.",
      },
    ],
    cultural_notes_vi: [
      "Trong khu dan cu Indonesia, warga, RT/RW, bao ve, va hang xom thuong phoi hop khi co su co khan cap.",
      "Nhieu nha dung tabung gas LPG, nen cach noi ve tabung gas, kompor, va sumber api rat huu ich trong doi song hang ngay.",
      "Titik kumpul la cum tu quan trong trong chung cu, truong hoc, van phong, va khu pho khi can so tan.",
      "Khi bao su co, nguoi nghe can dia chi ro: ten duong, so nha, gang, RT/RW, va moc gan nhat.",
    ],
    cultural_notes_en: [
      "In Indonesian neighborhoods, residents, RT/RW leaders, security guards, and neighbors often coordinate during emergencies.",
      "Many homes use LPG gas cylinders, so vocabulary for gas cylinders, stoves, and ignition sources is practical daily language.",
      "Titik kumpul is an important phrase in apartments, schools, offices, and neighborhoods during evacuation.",
      "When reporting an incident, clear address details help: street name, house number, alley, RT/RW, and nearby landmarks.",
    ],
    tip_advice_vi: [
      "Dung jangan cho menh lenh cam: Jangan gunakan lift, Jangan masuk lagi.",
      "Di la o/tai, ke la den: di titik kumpul nhan manh vi tri; ke titik kumpul nhan manh di chuyen den do.",
      "Noi pemadam kebakaran hoac Damkar cho cuu hoa; tranh dich tung chu tu tieng Viet.",
      "Khi hoang mang, cau ngan se hieu qua hon: Ada kebakaran. Alamatnya lengkap. Kami di titik kumpul.",
    ],
    tip_advice_en: [
      "Use jangan for negative commands: Jangan gunakan lift, Jangan masuk lagi.",
      "Di means at/in, while ke means to: di titik kumpul focuses on location; ke titik kumpul focuses on movement there.",
      "Say pemadam kebakaran or Damkar for the fire department; avoid translating word by word from English or Vietnamese.",
      "In panic, short sentences work best: Ada kebakaran. Alamatnya lengkap. Kami di titik kumpul.",
    ],
    exercises: [
      {
        type: "translation",
        prompt_vi: "Dich sang tieng Indonesia: 'Dung dung thang may khi so tan.'",
        prompt_en: "Translate into Indonesian: 'Do not use the elevator during evacuation.'",
        answer: "Jangan gunakan lift saat evakuasi.",
      },
      {
        type: "fill_blank",
        prompt_vi: "Dien tu dung: Semua warga berkumpul di ____ kumpul.",
        prompt_en: "Fill in the correct word: Semua warga berkumpul di ____ kumpul.",
        answer: "titik",
      },
      {
        type: "roleplay",
        prompt_vi: "Dong vai nguoi goi cuu hoa: noi co chay, noi dia chi, va noi warga da den diem tap ket.",
        prompt_en: "Roleplay calling the fire department: say there is a fire, give the address, and say residents are at the assembly point.",
      },
      {
        type: "matching",
        prompt_vi: "Noi cum tu voi nghia: tabung gas, evakuasi, pemadam kebakaran, pencegahan.",
        prompt_en: "Match each phrase with its meaning: tabung gas, evakuasi, pemadam kebakaran, pencegahan.",
        answer: "tabung gas = gas cylinder; evakuasi = evacuation; pemadam kebakaran = fire department/firefighters; pencegahan = prevention.",
      },
    ],
  },
];
