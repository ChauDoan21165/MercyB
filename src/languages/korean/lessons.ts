// Type definitions for Korean lesson data
// Mirrors the schema used by lessons 1-20; lessons 21-50 should be backfilled to match.

export type KoreanVocabEntry = {
  hangul: string;
  meaning: string;
};

export type KoreanSentence = {
  korean: string;
  romanized: string;
  en: string;
  vi: string;
};

export type KoreanDialogueLine = {
  speaker: string;
  hangul: string;
  meaning: string;
};

export type KoreanExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
};

export type KoreanExerciseMatching = {
  type: "matching";
  pairs: { hangul: string; meaning: string }[];
  instruction: string;
};

export type KoreanExerciseTranslation = {
  type: "translation";
  vietnamese: string;
  hangul: string;
};

export type KoreanExercise =
  | KoreanExerciseFillBlank
  | KoreanExerciseMatching
  | KoreanExerciseTranslation;

export type KoreanCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type IdiomGloss = {
  idiom: string;
  literal: string;
  meaning: string;
  example: string;
};

// B2-specific dialogue line — adds Vietnamese gloss to the existing
// {speaker, hangul, meaning} shape used by lessons 1-50.
export type KoreanB2DialogueLine = {
  speaker: string;
  hangul: string;
  meaning: string;
  vi?: string;
};

export type KoreanLesson = {
  id: number;
  level: KoreanCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  vocabulary: KoreanVocabEntry[];
  sentences: KoreanSentence[];
  dialogue: KoreanDialogueLine[];
  exercises: KoreanExercise[];
  // B2-specific optional fields (Phase 2 conversation-focused lessons).
  // All optional — existing A1/A2/B1 lessons typecheck unchanged.
  cultural_notes_vi?: string;
  tip_advice_vi?: string;
  dialogue_long?: KoreanB2DialogueLine[];
  roleplay_prompts?: string[];
  register_notes?: string;
  idiom_glosses?: IdiomGloss[];
};

export const lessons: KoreanLesson[] = [
  {
    id: 1, level: "A1", title_vi: "Nguyên âm cơ bản", title_en: "Basic Vowels",
    intro_vi: "10 nguyên âm cơ bản trong Hangul. Đây là nền tảng của chữ viết tiếng Hàn.",
    vocabulary: [{hangul:"ㅏ",meaning:"a"},{hangul:"ㅑ",meaning:"ya"},{hangul:"ㅓ",meaning:"eo (ơ)"},{hangul:"ㅕ",meaning:"yeo"},{hangul:"ㅗ",meaning:"o (ô)"},{hangul:"ㅛ",meaning:"yo"},{hangul:"ㅜ",meaning:"u"},{hangul:"ㅠ",meaning:"yu"},{hangul:"ㅡ",meaning:"eu (ư)"},{hangul:"ㅣ",meaning:"i"}],
    sentences: [{korean:"아",romanized:"a",en:"a",vi:"Nguyên âm 'a'"},{korean:"야",romanized:"ya",en:"ya",vi:"Nguyên âm 'ya'"},{korean:"어",romanized:"eo",en:"eo",vi:"Nguyên âm 'eo'"},{korean:"오",romanized:"o",en:"o",vi:"Nguyên âm 'ô'"},{korean:"우",romanized:"u",en:"u",vi:"Nguyên âm 'u'"}],
    dialogue: [{speaker:"A",hangul:"이게 뭐예요?",meaning:"What is this?"},{speaker:"B",hangul:"그건 '아'예요.",meaning:"That is 'a'."},{speaker:"A",hangul:"아, 알겠어요.",meaning:"Ah, I understand."},{speaker:"B",hangul:"네, 잘했어요!",meaning:"Yes, well done!"}],
    exercises: [{type:"fill-blank",question:"Nguyên âm giống 'ơ' là ___",answer:"ㅓ"},{type:"matching",pairs:[{hangul:"ㅏ",meaning:"a"},{hangul:"ㅗ",meaning:"o"}],instruction:"Ghép nguyên âm"},{type:"translation",vietnamese:"Nguyên âm 'i' là gì?",hangul:"ㅣ"}]
  },{
    id: 2, level: "A1", title_vi: "Phụ âm cơ bản", title_en: "Basic Consonants",
    intro_vi: "14 phụ âm cơ bản trong Hangul. Cách phát âm thay đổi tùy vị trí.",
    vocabulary: [{hangul:"ㄱ",meaning:"g/k"},{hangul:"ㄴ",meaning:"n"},{hangul:"ㄷ",meaning:"d/t"},{hangul:"ㄹ",meaning:"r/l"},{hangul:"ㅁ",meaning:"m"},{hangul:"ㅂ",meaning:"b/p"},{hangul:"ㅅ",meaning:"s"},{hangul:"ㅇ",meaning:"ng/null"},{hangul:"ㅈ",meaning:"j"},{hangul:"ㅎ",meaning:"h"}],
    sentences: [{korean:"가",romanized:"ga",en:"ga",vi:"Âm tiết 'ga'"},{korean:"나",romanized:"na",en:"na",vi:"Âm tiết 'na'"},{korean:"다",romanized:"da",en:"da",vi:"Âm tiết 'da'"},{korean:"마",romanized:"ma",en:"ma",vi:"Âm tiết 'ma'"},{korean:"바",romanized:"ba",en:"ba",vi:"Âm tiết 'ba'"}],
    dialogue: [{speaker:"A",hangul:"이건 무슨 글자예요?",meaning:"What letter?"},{speaker:"B",hangul:"'ㄱ'이에요.",meaning:"It's ㄱ."},{speaker:"A",hangul:"어려워요.",meaning:"It's hard."},{speaker:"B",hangul:"괜찮아요. 연습하면 돼요.",meaning:"Practice makes perfect."}],
    exercises: [{type:"fill-blank",question:"Phụ âm giống 'n' là ___",answer:"ㄴ"},{type:"matching",pairs:[{hangul:"ㄱ",meaning:"g/k"},{hangul:"ㅁ",meaning:"m"}],instruction:"Ghép phụ âm"},{type:"translation",vietnamese:"Phụ âm 'h' là gì?",hangul:"ㅎ"}]
  },{
    id: 3, level: "A1", title_vi: "Khối âm tiết", title_en: "Syllable Blocks",
    intro_vi: "Mỗi âm tiết = phụ âm + nguyên âm. ㅇ là âm câm khi đứng đầu.",
    vocabulary: [{hangul:"가",meaning:"ga"},{hangul:"나",meaning:"na"},{hangul:"다",meaning:"da"},{hangul:"라",meaning:"ra"},{hangul:"마",meaning:"ma"},{hangul:"바",meaning:"ba"},{hangul:"사",meaning:"sa"},{hangul:"아",meaning:"a"},{hangul:"자",meaning:"ja"},{hangul:"하",meaning:"ha"}],
    sentences: [{korean:"가가 가요.",romanized:"Gaga gayo.",en:"Ga is going.",vi:"Ga đang đi."},{korean:"아기가 자요.",romanized:"Agiga jayo.",en:"Baby is sleeping.",vi:"Em bé đang ngủ."},{korean:"바다가 파래요.",romanized:"Badaga paraeyo.",en:"The sea is blue.",vi:"Biển màu xanh."},{korean:"사자가 자요.",romanized:"Sajaga jayo.",en:"Lion sleeps.",vi:"Sư tử ngủ."},{korean:"나가 가요.",romanized:"Naga gayo.",en:"Going out.",vi:"Đi ra ngoài."}],
    dialogue: [{speaker:"A",hangul:"이 글자 읽을 수 있어요?",meaning:"Can you read this?"},{speaker:"B",hangul:"네, '가'예요.",meaning:"Yes, it's 'ga'."},{speaker:"A",hangul:"잘했어요!",meaning:"Well done!"},{speaker:"B",hangul:"감사합니다!",meaning:"Thank you!"}],
    exercises: [{type:"fill-blank",question:"'사자' là ___",answer:"sư tử"},{type:"matching",pairs:[{hangul:"바다",meaning:"biển"},{hangul:"아기",meaning:"em bé"}],instruction:"Ghép từ"},{type:"translation",vietnamese:"Con sư tử",hangul:"사자"}]
  },{
    id: 4, level: "A1", title_vi: "Phụ âm đôi", title_en: "Double Consonants",
    intro_vi: "5 phụ âm căng (fortis): ㄲㄸㅃㅆㅉ. Phát âm mạnh và căng hơn.",
    vocabulary: [{hangul:"ㄲ",meaning:"kk"},{hangul:"ㄸ",meaning:"tt"},{hangul:"ㅃ",meaning:"pp"},{hangul:"ㅆ",meaning:"ss"},{hangul:"ㅉ",meaning:"jj"},{hangul:"까",meaning:"kka"},{hangul:"따",meaning:"tta"},{hangul:"빠",meaning:"ppa"},{hangul:"싸",meaning:"ssa"},{hangul:"짜",meaning:"jja"}],
    sentences: [{korean:"까만색이에요.",romanized:"Kkamansaegieyo.",en:"It's black.",vi:"Nó màu đen."},{korean:"따뜻해요.",romanized:"Ttatteushaeyo.",en:"It's warm.",vi:"Nó ấm áp."},{korean:"빨리 가요.",romanized:"Ppalli gayo.",en:"Go quickly.",vi:"Đi nhanh."},{korean:"싸요.",romanized:"Ssayo.",en:"It's cheap.",vi:"Nó rẻ."},{korean:"짜요.",romanized:"Jjayo.",en:"It's salty.",vi:"Nó mặn."}],
    dialogue: [{speaker:"A",hangul:"이거 비싸요?",meaning:"Is it expensive?"},{speaker:"B",hangul:"아니요, 싸요.",meaning:"No, it's cheap."},{speaker:"A",hangul:"빨리 사세요!",meaning:"Buy it fast!"},{speaker:"B",hangul:"네, 살게요.",meaning:"Yes, I'll buy it."}],
    exercises: [{type:"fill-blank",question:"'Rẻ' là ___",answer:"싸요"},{type:"matching",pairs:[{hangul:"빨리",meaning:"nhanh"},{hangul:"따뜻해요",meaning:"ấm áp"}],instruction:"Ghép từ"},{type:"translation",vietnamese:"Nó màu đen.",hangul:"까만색이에요."}]
  },{
    id: 5, level: "A1", title_vi: "Nguyên âm ghép", title_en: "Compound Vowels",
    intro_vi: "11 nguyên âm ghép: ㅐㅒㅔㅖㅘㅙㅚㅝㅞㅟㅢ.",
    vocabulary: [{hangul:"ㅐ",meaning:"ae"},{hangul:"ㅔ",meaning:"e"},{hangul:"ㅘ",meaning:"wa"},{hangul:"ㅙ",meaning:"wae"},{hangul:"ㅚ",meaning:"oe"},{hangul:"ㅝ",meaning:"wo"},{hangul:"ㅞ",meaning:"we"},{hangul:"ㅟ",meaning:"wi"},{hangul:"ㅢ",meaning:"ui"},{hangul:"ㅒ",meaning:"yae"}],
    sentences: [{korean:"왜 왔어요?",romanized:"Wae wasseoyo?",en:"Why did you come?",vi:"Sao bạn đến?"},{korean:"괜찮아요.",romanized:"Gwaenchanayo.",en:"It's okay.",vi:"Không sao."},{korean:"뭐 해요?",romanized:"Mwo haeyo?",en:"What are you doing?",vi:"Bạn làm gì?"},{korean:"돼요.",romanized:"Dwaeyo.",en:"It's fine.",vi:"Được."},{korean:"쉬워요.",romanized:"Swiwoyo.",en:"It's easy.",vi:"Dễ."}],
    dialogue: [{speaker:"A",hangul:"한국어 어때요?",meaning:"How's Korean?"},{speaker:"B",hangul:"쉬워요!",meaning:"Easy!"},{speaker:"A",hangul:"정말요?",meaning:"Really?"},{speaker:"B",hangul:"네, 한글은 배우기 쉬워요.",meaning:"Yes, Hangul is easy."}],
    exercises: [{type:"fill-blank",question:"'Không sao' là ___",answer:"괜찮아요"},{type:"matching",pairs:[{hangul:"왜",meaning:"tại sao"},{hangul:"뭐",meaning:"cái gì"}],instruction:"Ghép từ hỏi"},{type:"translation",vietnamese:"Nó dễ.",hangul:"쉬워요."}]
  },{
    id: 6, level: "A1", title_vi: "Phụ âm cuối (받침)", title_en: "Final Consonants",
    intro_vi: "받침 là phụ âm cuối âm tiết. Chỉ 7 âm được phát âm ở vị trí cuối.",
    vocabulary: [{hangul:"받침",meaning:"phụ âm cuối"},{hangul:"각",meaning:"gak"},{hangul:"간",meaning:"gan"},{hangul:"갈",meaning:"gal"},{hangul:"감",meaning:"gam"},{hangul:"갑",meaning:"gap"},{hangul:"갓",meaning:"gat"},{hangul:"강",meaning:"gang"},{hangul:"값",meaning:"gap (giá)"},{hangul:"같",meaning:"gat"}],
    sentences: [{korean:"한국 사람이에요.",romanized:"Hanguk saramieyo.",en:"I am Korean.",vi:"Tôi là người Hàn."},{korean:"밥을 먹어요.",romanized:"Babeul meogeoyo.",en:"I eat rice.",vi:"Tôi ăn cơm."},{korean:"책을 읽어요.",romanized:"Chaekeul ilgeoyo.",en:"I read a book.",vi:"Tôi đọc sách."},{korean:"꽃이 예뻐요.",romanized:"Kkochi yeppeoyo.",en:"The flower is pretty.",vi:"Hoa đẹp."},{korean:"산에 가요.",romanized:"Sane gayo.",en:"I go to the mountain.",vi:"Tôi đi lên núi."}],
    dialogue: [{speaker:"A",hangul:"어디 가요?",meaning:"Where?"},{speaker:"B",hangul:"산에 가요.",meaning:"To the mountain."},{speaker:"A",hangul:"누구랑?",meaning:"With whom?"},{speaker:"B",hangul:"친구랑 같이.",meaning:"With a friend."}],
    exercises: [{type:"fill-blank",question:"'Tôi ăn cơm': 밥을 ___",answer:"먹어요"},{type:"matching",pairs:[{hangul:"책",meaning:"sách"},{hangul:"산",meaning:"núi"}],instruction:"Ghép từ"},{type:"translation",vietnamese:"Tôi là người Hàn.",hangul:"한국 사람이에요."}]
  },{
    id: 7, level: "A1", title_vi: "Phụ âm cuối kép", title_en: "Complex Final Consonants",
    intro_vi: "Âm tiết có 2 phụ âm cuối. Khi đứng một mình chỉ phát âm phụ âm bên trái.",
    vocabulary: [{hangul:"ㄳ",meaning:"gs→ㄱ"},{hangul:"ㄵ",meaning:"nj→ㄴ"},{hangul:"ㄺ",meaning:"lg→ㄱ"},{hangul:"ㄻ",meaning:"lm→ㅁ"},{hangul:"ㄼ",meaning:"lb→ㄹ"},{hangul:"ㄽ",meaning:"ls→ㄹ"},{hangul:"ㄾ",meaning:"lt→ㄹ"},{hangul:"ㅀ",meaning:"lh→ㄹ"},{hangul:"ㅄ",meaning:"bs→ㅂ"},{hangul:"ㄿ",meaning:"lp→ㅂ"}],
    sentences: [{korean:"닭을 먹어요.",romanized:"Dalgeul meogeoyo.",en:"I eat chicken.",vi:"Tôi ăn gà."},{korean:"앉으세요.",romanized:"Anjeuseyo.",en:"Please sit.",vi:"Mời ngồi."},{korean:"값이 비싸요.",romanized:"Gapsi bissayo.",en:"The price is high.",vi:"Giá đắt."},{korean:"넓어요.",romanized:"Neolbeoyo.",en:"It's wide.",vi:"Nó rộng."},{korean:"읊어요.",romanized:"Eulpeoyo.",en:"I recite.",vi:"Tôi ngâm thơ."}],
    dialogue: [{speaker:"A",hangul:"여기 앉으세요.",meaning:"Sit here."},{speaker:"B",hangul:"감사합니다.",meaning:"Thanks."},{speaker:"A",hangul:"뭐 드실래요?",meaning:"What to eat?"},{speaker:"B",hangul:"닭 먹을래요.",meaning:"I'll have chicken."}],
    exercises: [{type:"fill-blank",question:"'Mời ngồi': ___",answer:"앉으세요"},{type:"matching",pairs:[{hangul:"값",meaning:"giá"},{hangul:"닭",meaning:"gà"}],instruction:"Ghép từ"},{type:"translation",vietnamese:"Nó rộng.",hangul:"넓어요."}]
  },{
    id: 8, level: "A1", title_vi: "Chào hỏi", title_en: "Greetings",
    intro_vi: "Các câu chào hỏi cơ bản. 안녕하세요 là cách chào lịch sự phổ biến nhất.",
    vocabulary: [{hangul:"안녕하세요",meaning:"Xin chào"},{hangul:"감사합니다",meaning:"Cảm ơn"},{hangul:"네",meaning:"Vâng"},{hangul:"아니요",meaning:"Không"},{hangul:"안녕히 가세요",meaning:"Tạm biệt (người đi)"},{hangul:"안녕히 계세요",meaning:"Tạm biệt (người ở)"},{hangul:"죄송합니다",meaning:"Xin lỗi"},{hangul:"괜찮아요",meaning:"Không sao"},{hangul:"반갑습니다",meaning:"Rất vui gặp"},{hangul:"또 만나요",meaning:"Hẹn gặp lại"}],
    sentences: [{korean:"안녕하세요, 처음 뵙겠습니다.",romanized:"Annyeonghaseyo, cheoeum boepgesseumnida.",en:"Hello, nice to meet you.",vi:"Xin chào, rất vui gặp bạn."},{korean:"감사합니다.",romanized:"Gamsahamnida.",en:"Thank you.",vi:"Cảm ơn."},{korean:"안녕히 가세요.",romanized:"Annyeonghi gaseyo.",en:"Goodbye (to one leaving).",vi:"Tạm biệt."},{korean:"죄송합니다.",romanized:"Joesonghamnida.",en:"I'm sorry.",vi:"Xin lỗi."},{korean:"또 만나요.",romanized:"Tto mannayo.",en:"See you again.",vi:"Hẹn gặp lại."}],
    dialogue: [{speaker:"A",hangul:"안녕하세요! 저는 민수예요.",meaning:"Hello! I'm Minsu."},{speaker:"B",hangul:"안녕하세요, 지영이에요. 반갑습니다.",meaning:"Hi, I'm Jiyoung. Nice to meet you."},{speaker:"A",hangul:"지금 어디 가세요?",meaning:"Where are you going?"},{speaker:"B",hangul:"집에 가요. 안녕히 계세요!",meaning:"Going home. Bye!"}],
    exercises: [{type:"fill-blank",question:"'Xin chào' là ___",answer:"안녕하세요"},{type:"matching",pairs:[{hangul:"감사합니다",meaning:"cảm ơn"},{hangul:"죄송합니다",meaning:"xin lỗi"}],instruction:"Ghép câu"},{type:"translation",vietnamese:"Tạm biệt, hẹn gặp lại.",hangul:"안녕히 가세요. 또 만나요."}]
  },{
    id: 9, level: "A1", title_vi: "Tự giới thiệu", title_en: "Self-Introduction",
    intro_vi: "Cách giới thiệu bản thân. Dùng 저는 (tôi - khiêm tốn) trong tình huống trang trọng.",
    vocabulary: [{hangul:"저",meaning:"tôi (khiêm tốn)"},{hangul:"이름",meaning:"tên"},{hangul:"입니다",meaning:"là"},{hangul:"학생",meaning:"học sinh"},{hangul:"선생님",meaning:"thầy/cô"},{hangul:"회사원",meaning:"nhân viên"},{hangul:"한국 사람",meaning:"người Hàn"},{hangul:"베트남 사람",meaning:"người Việt"},{hangul:"에서 왔어요",meaning:"đến từ"},{hangul:"살",meaning:"tuổi"}],
    sentences: [{korean:"저는 마이클입니다.",romanized:"Jeoneun Maikeurimnida.",en:"I am Michael.",vi:"Tôi là Michael."},{korean:"저는 베트남 사람이에요.",romanized:"Jeoneun Beteunam saramieyo.",en:"I'm Vietnamese.",vi:"Tôi là người Việt."},{korean:"저는 학생입니다.",romanized:"Jeoneun haksaengimnida.",en:"I'm a student.",vi:"Tôi là học sinh."},{korean:"저는 스무 살이에요.",romanized:"Jeoneun seumu sarieyo.",en:"I'm 20.",vi:"Tôi 20 tuổi."},{korean:"하노이에서 왔어요.",romanized:"Hanoieseo wasseoyo.",en:"I'm from Hanoi.",vi:"Tôi từ Hà Nội."}],
    dialogue: [{speaker:"A",hangul:"이름이 뭐예요?",meaning:"Your name?"},{speaker:"B",hangul:"저는 투안입니다.",meaning:"I'm Tuan."},{speaker:"A",hangul:"어디에서 오셨어요?",meaning:"Where from?"},{speaker:"B",hangul:"베트남에서 왔어요.",meaning:"From Vietnam."}],
    exercises: [{type:"fill-blank",question:"'Tôi là học sinh': 저는 ___",answer:"학생입니다"},{type:"matching",pairs:[{hangul:"회사원",meaning:"nhân viên"},{hangul:"학생",meaning:"học sinh"}],instruction:"Ghép nghề"},{type:"translation",vietnamese:"Tôi từ Việt Nam.",hangul:"베트남에서 왔어요."}]
  },{
    id: 10, level: "A1", title_vi: "Số đếm 1-10", title_en: "Numbers 1-10",
    intro_vi: "Số thuần Hàn dùng đếm đồ vật, tuổi, giờ. Số Hán-Hàn dùng cho ngày tháng, tiền.",
    vocabulary: [{hangul:"하나",meaning:"1"},{hangul:"둘",meaning:"2"},{hangul:"셋",meaning:"3"},{hangul:"넷",meaning:"4"},{hangul:"다섯",meaning:"5"},{hangul:"여섯",meaning:"6"},{hangul:"일곱",meaning:"7"},{hangul:"여덟",meaning:"8"},{hangul:"아홉",meaning:"9"},{hangul:"열",meaning:"10"}],
    sentences: [{korean:"사과 하나 주세요.",romanized:"Sagwa hana juseyo.",en:"One apple please.",vi:"Cho một quả táo."},{korean:"스물다섯 살이에요.",romanized:"Seumuldaseot sarieyo.",en:"I'm 25.",vi:"Tôi 25 tuổi."},{korean:"커피 두 잔 주세요.",romanized:"Keopi du jan juseyo.",en:"Two coffees.",vi:"Hai ly cà phê."},{korean:"책 세 권 있어요.",romanized:"Chaek se gwon isseoyo.",en:"I have 3 books.",vi:"Có 3 quyển sách."},{korean:"한 시에 만나요.",romanized:"Han sie mannayo.",en:"Meet at 1.",vi:"Gặp lúc 1 giờ."}],
    dialogue: [{speaker:"A",hangul:"몇 살이에요?",meaning:"How old?"},{speaker:"B",hangul:"스물셋 살이에요.",meaning:"23."},{speaker:"A",hangul:"커피 몇 잔?",meaning:"How many coffees?"},{speaker:"B",hangul:"두 잔 주세요.",meaning:"Two please."}],
    exercises: [{type:"fill-blank",question:"Số 5 thuần Hàn: ___",answer:"다섯"},{type:"matching",pairs:[{hangul:"하나",meaning:"1"},{hangul:"열",meaning:"10"}],instruction:"Ghép số"},{type:"translation",vietnamese:"Cho 3 quyển sách.",hangul:"책 세 권 주세요."}]
  },{
    id: 11, level: "A1", title_vi: "Ngày trong tuần", title_en: "Days of the Week",
    intro_vi: "Tên ngày bắt đầu bằng thiên thể: 월(trăng), 화(lửa), 수(nước), 목(gỗ), 금(vàng), 토(đất), 일(mặt trời).",
    vocabulary: [{hangul:"월요일",meaning:"Thứ Hai"},{hangul:"화요일",meaning:"Thứ Ba"},{hangul:"수요일",meaning:"Thứ Tư"},{hangul:"목요일",meaning:"Thứ Năm"},{hangul:"금요일",meaning:"Thứ Sáu"},{hangul:"토요일",meaning:"Thứ Bảy"},{hangul:"일요일",meaning:"Chủ Nhật"},{hangul:"주말",meaning:"cuối tuần"},{hangul:"오늘",meaning:"hôm nay"},{hangul:"내일",meaning:"ngày mai"}],
    sentences: [{korean:"오늘은 월요일이에요.",romanized:"Oneureun woryoilieyo.",en:"Today is Monday.",vi:"Hôm nay thứ Hai."},{korean:"금요일에 영화 볼 거예요.",romanized:"Geumyoire bol geoyeyo.",en:"Watching a movie Friday.",vi:"Thứ Sáu xem phim."},{korean:"주말에 뭐 해요?",romanized:"Jumare mwo haeyo?",en:"What on weekend?",vi:"Cuối tuần làm gì?"},{korean:"내일 수요일이에요.",romanized:"Naeil suyoilieyo.",en:"Tomorrow is Wed.",vi:"Mai thứ Tư."},{korean:"일요일에 교회에 가요.",romanized:"Iryoire gyohoee gayo.",en:"Church on Sunday.",vi:"CN đi nhà thờ."}],
    dialogue: [{speaker:"A",hangul:"오늘 무슨 요일?",meaning:"What day?"},{speaker:"B",hangul:"금요일이에요!",meaning:"Friday!"},{speaker:"A",hangul:"주말에 뭐 해요?",meaning:"Weekend plans?"},{speaker:"B",hangul:"쇼핑 갈 거예요.",meaning:"Shopping."}],
    exercises: [{type:"fill-blank",question:"'Thứ Hai' là ___",answer:"월요일"},{type:"matching",pairs:[{hangul:"주말",meaning:"cuối tuần"},{hangul:"오늘",meaning:"hôm nay"}],instruction:"Ghép từ"},{type:"translation",vietnamese:"Hôm nay thứ Sáu.",hangul:"오늘은 금요일이에요."}]
  },{
    id: 12, level: "A1", title_vi: "Động từ cơ bản", title_en: "Basic Verbs",
    intro_vi: "Động từ kết thúc bằng -다 ở dạng từ điển. Bỏ -다 để chia.",
    vocabulary: [{hangul:"하다",meaning:"làm"},{hangul:"가다",meaning:"đi"},{hangul:"오다",meaning:"đến"},{hangul:"먹다",meaning:"ăn"},{hangul:"마시다",meaning:"uống"},{hangul:"보다",meaning:"xem"},{hangul:"듣다",meaning:"nghe"},{hangul:"읽다",meaning:"đọc"},{hangul:"쓰다",meaning:"viết"},{hangul:"자다",meaning:"ngủ"}],
    sentences: [{korean:"밥을 먹어요.",romanized:"Babeul meogeoyo.",en:"I eat rice.",vi:"Tôi ăn cơm."},{korean:"물을 마셔요.",romanized:"Mureul masyeoyo.",en:"I drink water.",vi:"Tôi uống nước."},{korean:"학교에 가요.",romanized:"Hakgyoe gayo.",en:"I go to school.",vi:"Tôi đi học."},{korean:"책을 읽어요.",romanized:"Chaekeul ilgeoyo.",en:"I read a book.",vi:"Tôi đọc sách."},{korean:"음악을 들어요.",romanized:"Eumageul deureoyo.",en:"I listen to music.",vi:"Tôi nghe nhạc."}],
    dialogue: [{speaker:"A",hangul:"뭐 해요?",meaning:"What doing?"},{speaker:"B",hangul:"책 읽어요.",meaning:"Reading."},{speaker:"A",hangul:"무슨 책?",meaning:"What book?"},{speaker:"B",hangul:"한국어 책.",meaning:"Korean book."}],
    exercises: [{type:"fill-blank",question:"'Tôi ăn cơm': 밥을 ___",answer:"먹어요"},{type:"matching",pairs:[{hangul:"마시다",meaning:"uống"},{hangul:"자다",meaning:"ngủ"}],instruction:"Ghép động từ"},{type:"translation",vietnamese:"Tôi đi học.",hangul:"학교에 가요."}]
  },{
    id: 13, level: "A1", title_vi: "Chia thì hiện tại", title_en: "Present Tense",
    intro_vi: "Thêm -아요/-어요/-해요 vào gốc động từ. Quy tắc phụ thuộc nguyên âm cuối.",
    vocabulary: [{hangul:"가요",meaning:"đi"},{hangul:"와요",meaning:"đến"},{hangul:"먹어요",meaning:"ăn"},{hangul:"해요",meaning:"làm"},{hangul:"봐요",meaning:"xem"},{hangul:"들어요",meaning:"nghe"},{hangul:"읽어요",meaning:"đọc"},{hangul:"마셔요",meaning:"uống"},{hangul:"써요",meaning:"viết"},{hangul:"자요",meaning:"ngủ"}],
    sentences: [{korean:"매일 커피 마셔요.",romanized:"Maeil keopi masyeoyo.",en:"I drink coffee daily.",vi:"Ngày nào cũng uống cà phê."},{korean:"주말에 친구 만나요.",romanized:"Jumare chingu mannayo.",en:"Meet friends on weekends.",vi:"Cuối tuần gặp bạn."},{korean:"한국어 공부해요.",romanized:"Hangukeo gongbuhaeyo.",en:"I study Korean.",vi:"Tôi học tiếng Hàn."},{korean:"TV 봐요.",romanized:"TV bwayo.",en:"I watch TV.",vi:"Tôi xem TV."},{korean:"일찍 자요.",romanized:"Iljjik jayo.",en:"I sleep early.",vi:"Tôi ngủ sớm."}],
    dialogue: [{speaker:"A",hangul:"취미가 뭐예요?",meaning:"Hobby?"},{speaker:"B",hangul:"한국어 공부해요.",meaning:"Studying Korean."},{speaker:"A",hangul:"매일 해요?",meaning:"Every day?"},{speaker:"B",hangul:"네, 한 시간씩.",meaning:"Yes, 1 hour."}],
    exercises: [{type:"fill-blank",question:"'Tôi học tiếng Hàn': 한국어 ___",answer:"공부해요"},{type:"matching",pairs:[{hangul:"가요",meaning:"đi"},{hangul:"먹어요",meaning:"ăn"}],instruction:"Ghép dạng chia"},{type:"translation",vietnamese:"Tôi xem TV.",hangul:"TV 봐요."}]
  },{
    id: 14, level: "A1", title_vi: "Tiểu từ 은/는 và 이/가", title_en: "Topic & Subject Particles",
    intro_vi: "은/는 = chủ đề câu. 이/가 = chủ ngữ. Sự khác biệt quan trọng trong tiếng Hàn.",
    vocabulary: [{hangul:"은/는",meaning:"tiểu từ chủ đề"},{hangul:"이/가",meaning:"tiểu từ chủ ngữ"},{hangul:"저는",meaning:"tôi (chủ đề)"},{hangul:"제가",meaning:"tôi (chủ ngữ)"},{hangul:"이것은",meaning:"cái này (CĐ)"},{hangul:"이것이",meaning:"cái này (CN)"},{hangul:"날씨가",meaning:"thời tiết (CN)"},{hangul:"한국어는",meaning:"tiếng Hàn (CĐ)"},{hangul:"오늘은",meaning:"hôm nay (CĐ)"},{hangul:"친구가",meaning:"bạn (CN)"}],
    sentences: [{korean:"저는 학생이에요.",romanized:"Jeoneun haksaengieyo.",en:"I'm a student.",vi:"Tôi là học sinh."},{korean:"날씨가 좋아요.",romanized:"Nalssiga joayo.",en:"The weather is good.",vi:"Thời tiết đẹp."},{korean:"오늘은 금요일이에요.",romanized:"Oneureun geumyoilieyo.",en:"Today is Friday.",vi:"Hôm nay thứ Sáu."},{korean:"친구가 왔어요.",romanized:"Chinguga wasseoyo.",en:"A friend came.",vi:"Bạn đến."},{korean:"한국어는 재미있어요.",romanized:"Hangukeoneun jaemiisseoyo.",en:"Korean is fun.",vi:"Tiếng Hàn thú vị."}],
    dialogue: [{speaker:"A",hangul:"오늘 날씨 어때요?",meaning:"Weather today?"},{speaker:"B",hangul:"날씨가 정말 좋아요.",meaning:"Really nice."},{speaker:"A",hangul:"공원에 갈까요?",meaning:"Park?"},{speaker:"B",hangul:"네, 좋아요!",meaning:"Yes!"}],
    exercises: [{type:"fill-blank",question:"저___ 학생이에요.",answer:"는"},{type:"matching",pairs:[{hangul:"날씨가 좋아요",meaning:"Đẹp trời"},{hangul:"한국어는 재미있어요",meaning:"Tiếng Hàn thú vị"}],instruction:"Ghép câu"},{type:"translation",vietnamese:"Hôm nay đẹp trời.",hangul:"오늘은 날씨가 좋아요."}]
  },{
    id: 15, level: "A1", title_vi: "Tính từ thông dụng", title_en: "Common Adjectives",
    intro_vi: "Tính từ chia như động từ. 크다 → 커요 (lớn, hiện tại).",
    vocabulary: [{hangul:"크다",meaning:"to/lớn"},{hangul:"작다",meaning:"nhỏ"},{hangul:"좋다",meaning:"tốt/thích"},{hangul:"나쁘다",meaning:"xấu/tệ"},{hangul:"맛있다",meaning:"ngon"},{hangul:"맛없다",meaning:"dở"},{hangul:"예쁘다",meaning:"đẹp"},{hangul:"길다",meaning:"dài"},{hangul:"짧다",meaning:"ngắn"},{hangul:"빠르다",meaning:"nhanh"}],
    sentences: [{korean:"이 집은 커요.",romanized:"I jibeun keoyo.",en:"This house is big.",vi:"Nhà này to."},{korean:"김치가 맛있어요.",romanized:"Gimchiga masisseoyo.",en:"Kimchi is delicious.",vi:"Kimchi ngon."},{korean:"그 옷이 예뻐요.",romanized:"Geu osi yeppeoyo.",en:"Those clothes are pretty.",vi:"Áo đó đẹp."},{korean:"오늘 기분 좋아요.",romanized:"Oneul gibun joayo.",en:"I feel good.",vi:"Tâm trạng tốt."},{korean:"이 길은 짧아요.",romanized:"I gireun jjalbayo.",en:"This road is short.",vi:"Đường này ngắn."}],
    dialogue: [{speaker:"A",hangul:"이 음식 어때요?",meaning:"How's the food?"},{speaker:"B",hangul:"정말 맛있어요!",meaning:"Delicious!"},{speaker:"A",hangul:"다행이에요. 더 드세요!",meaning:"Glad! Eat more!"},{speaker:"B",hangul:"감사합니다!",meaning:"Thanks!"}],
    exercises: [{type:"fill-blank",question:"'Kimchi ngon': 김치가 ___",answer:"맛있어요"},{type:"matching",pairs:[{hangul:"예쁘다",meaning:"đẹp"},{hangul:"빠르다",meaning:"nhanh"}],instruction:"Ghép tính từ"},{type:"translation",vietnamese:"Nhà đó rất to.",hangul:"그 집은 아주 커요."}]
  },{
    id: 16, level: "A2", title_vi: "Từ chỉ vị trí", title_en: "Location Words",
    intro_vi: "여기(đây), 거기(đó), 저기(kia) phân biệt theo khoảng cách.",
    vocabulary: [{hangul:"여기",meaning:"đây"},{hangul:"거기",meaning:"đó"},{hangul:"저기",meaning:"kia"},{hangul:"어디",meaning:"đâu"},{hangul:"앞",meaning:"trước"},{hangul:"뒤",meaning:"sau"},{hangul:"왼쪽",meaning:"trái"},{hangul:"오른쪽",meaning:"phải"},{hangul:"위",meaning:"trên"},{hangul:"아래",meaning:"dưới"}],
    sentences: [{korean:"여기 앉으세요.",romanized:"Yeogi anjeuseyo.",en:"Sit here.",vi:"Ngồi đây."},{korean:"은행이 저기에 있어요.",romanized:"Eunhaengi jeogie isseoyo.",en:"Bank over there.",vi:"Ngân hàng đằng kia."},{korean:"학교는 왼쪽에 있어요.",romanized:"Hakgyoneun oenjjoge isseoyo.",en:"School on the left.",vi:"Trường bên trái."},{korean:"책상 위에 있어요.",romanized:"Chaeksang wie isseoyo.",en:"On the desk.",vi:"Trên bàn."},{korean:"화장실이 어디예요?",romanized:"Hwajangsiri eodieyo?",en:"Where's bathroom?",vi:"WC ở đâu?"}],
    dialogue: [{speaker:"A",hangul:"화장실 어디예요?",meaning:"Bathroom?"},{speaker:"B",hangul:"저기 오른쪽.",meaning:"Over there, right."},{speaker:"A",hangul:"감사합니다!",meaning:"Thanks!"},{speaker:"B",hangul:"네, 천천히.",meaning:"Take your time."}],
    exercises: [{type:"fill-blank",question:"'WC ở đâu?': 화장실이 ___?",answer:"어디예요"},{type:"matching",pairs:[{hangul:"여기",meaning:"đây"},{hangul:"저기",meaning:"kia"}],instruction:"Ghép vị trí"},{type:"translation",vietnamese:"Ngân hàng đằng kia.",hangul:"은행이 저기에 있어요."}]
  },{
    id: 17, level: "A2", title_vi: "Từ để hỏi", title_en: "Question Words",
    intro_vi: "뭐(cái gì), 누구(ai), 언제(khi nào), 어디(đâu), 왜(sao), 어떻게(thế nào).",
    vocabulary: [{hangul:"뭐/무엇",meaning:"cái gì"},{hangul:"누구",meaning:"ai"},{hangul:"언제",meaning:"khi nào"},{hangul:"어디",meaning:"ở đâu"},{hangul:"왜",meaning:"tại sao"},{hangul:"어떻게",meaning:"như thế nào"},{hangul:"얼마",meaning:"bao nhiêu"},{hangul:"몇",meaning:"mấy"},{hangul:"어떤",meaning:"loại nào"},{hangul:"무슨",meaning:"gì (+danh từ)"}],
    sentences: [{korean:"이름이 뭐예요?",romanized:"Ireumi mwoyeyo?",en:"Your name?",vi:"Tên bạn?"},{korean:"언제 한국에 왔어요?",romanized:"Eonje hanguge wasseoyo?",en:"When to Korea?",vi:"Đến Hàn khi nào?"},{korean:"왜 한국어 배워요?",romanized:"Wae hangukeo baewoyo?",en:"Why learn Korean?",vi:"Sao học tiếng Hàn?"},{korean:"이거 얼마예요?",romanized:"Igeo eolmayeyo?",en:"How much?",vi:"Bao nhiêu?"},{korean:"어떻게 가요?",romanized:"Eotteoke gayo?",en:"How to go?",vi:"Đi thế nào?"}],
    dialogue: [{speaker:"A",hangul:"한국어 왜 배워요?",meaning:"Why Korean?"},{speaker:"B",hangul:"드라마 좋아해서요.",meaning:"Love dramas."},{speaker:"A",hangul:"어떤 드라마?",meaning:"Which dramas?"},{speaker:"B",hangul:"로맨스 드라마!",meaning:"Romance!"}],
    exercises: [{type:"fill-blank",question:"'Tên bạn?': 이름이 ___?",answer:"뭐예요"},{type:"matching",pairs:[{hangul:"언제",meaning:"khi nào"},{hangul:"왜",meaning:"tại sao"}],instruction:"Ghép từ hỏi"},{type:"translation",vietnamese:"Bao nhiêu tiền?",hangul:"얼마예요?"}]
  },{
    id: 18, level: "A2", title_vi: "Câu phủ định", title_en: "Negative Sentences",
    intro_vi: "안 + động từ = không. 못 = không thể. 있다 → 없다 (không có).",
    vocabulary: [{hangul:"안",meaning:"không"},{hangul:"못",meaning:"không thể"},{hangul:"없다",meaning:"không có"},{hangul:"안 가요",meaning:"không đi"},{hangul:"안 먹어요",meaning:"không ăn"},{hangul:"안 해요",meaning:"không làm"},{hangul:"못 가요",meaning:"không thể đi"},{hangul:"못 먹어요",meaning:"không thể ăn"},{hangul:"없어요",meaning:"không có"},{hangul:"아니에요",meaning:"không phải"}],
    sentences: [{korean:"고기를 안 먹어요.",romanized:"Gogireul an meogeoyo.",en:"I don't eat meat.",vi:"Tôi không ăn thịt."},{korean:"오늘 학교에 못 가요.",romanized:"Oneul hakgyoe mot gayo.",en:"Can't go to school.",vi:"Không thể đi học."},{korean:"시간이 없어요.",romanized:"Sigani eopseoyo.",en:"No time.",vi:"Không có thời gian."},{korean:"그건 아니에요.",romanized:"Geugeon anieyo.",en:"That's not it.",vi:"Không phải."},{korean:"커피 안 마셔요.",romanized:"Keopi an masyeoyo.",en:"I don't drink coffee.",vi:"Không uống cà phê."}],
    dialogue: [{speaker:"A",hangul:"고기 드세요?",meaning:"Eat meat?"},{speaker:"B",hangul:"아니요, 안 먹어요.",meaning:"No, I don't."},{speaker:"A",hangul:"왜요?",meaning:"Why?"},{speaker:"B",hangul:"채식주의자예요.",meaning:"Vegetarian."}],
    exercises: [{type:"fill-blank",question:"'Không ăn thịt': 고기를 ___ 먹어요.",answer:"안"},{type:"matching",pairs:[{hangul:"못 가요",meaning:"không thể đi"},{hangul:"없어요",meaning:"không có"}],instruction:"Ghép phủ định"},{type:"translation",vietnamese:"Không có thời gian.",hangul:"시간이 없어요."}]
  },{
    id: 19, level: "A2", title_vi: "Thì quá khứ", title_en: "Past Tense",
    intro_vi: "Thêm -았/었/했어요 vào gốc động từ. Quy tắc phụ thuộc nguyên âm cuối.",
    vocabulary: [{hangul:"갔어요",meaning:"đã đi"},{hangul:"먹었어요",meaning:"đã ăn"},{hangul:"했어요",meaning:"đã làm"},{hangul:"봤어요",meaning:"đã xem"},{hangul:"왔어요",meaning:"đã đến"},{hangul:"좋았어요",meaning:"đã tốt"},{hangul:"읽었어요",meaning:"đã đọc"},{hangul:"들었어요",meaning:"đã nghe"},{hangul:"만났어요",meaning:"đã gặp"},{hangul:"샀어요",meaning:"đã mua"}],
    sentences: [{korean:"어제 영화 봤어요.",romanized:"Eoje yeonghwa bwasseoyo.",en:"Watched movie yesterday.",vi:"Hôm qua xem phim."},{korean:"지난 주에 한국에 갔어요.",romanized:"Jinan ju hanguge gasseoyo.",en:"Went to Korea last week.",vi:"Tuần trước đi Hàn."},{korean:"아침에 밥 먹었어요.",romanized:"Achime bap meogeosseoyo.",en:"Ate rice morning.",vi:"Sáng ăn cơm."},{korean:"어제 친구 만났어요.",romanized:"Eoje chingu mannasseoyo.",en:"Met friend yesterday.",vi:"Hôm qua gặp bạn."},{korean:"새 폰 샀어요.",romanized:"Sae pon sasseoyo.",en:"Bought new phone.",vi:"Mua điện thoại mới."}],
    dialogue: [{speaker:"A",hangul:"주말에 뭐 했어요?",meaning:"Weekend?"},{speaker:"B",hangul:"영화 봤어요.",meaning:"Watched movie."},{speaker:"A",hangul:"재미있었어요?",meaning:"Fun?"},{speaker:"B",hangul:"네, 아주!",meaning:"Yes, very!"}],
    exercises: [{type:"fill-blank",question:"'Đã xem phim': 영화 ___",answer:"봤어요"},{type:"matching",pairs:[{hangul:"갔어요",meaning:"đã đi"},{hangul:"먹었어요",meaning:"đã ăn"}],instruction:"Ghép quá khứ"},{type:"translation",vietnamese:"Hôm qua gặp bạn.",hangul:"어제 친구 만났어요."}]
  },{
    id: 20, level: "A2", title_vi: "Kính ngữ với -시-", title_en: "Honorifics",
    intro_vi: "Chèn -시- vào sau gốc động từ để tôn trọng chủ ngữ. Rất quan trọng trong văn hóa Hàn.",
    vocabulary: [{hangul:"가세요",meaning:"đi (kính)"},{hangul:"하세요",meaning:"làm (kính)"},{hangul:"계세요",meaning:"ở (kính)"},{hangul:"드세요",meaning:"ăn (kính)"},{hangul:"주무세요",meaning:"ngủ (kính)"},{hangul:"보세요",meaning:"xem (kính)"},{hangul:"읽으세요",meaning:"đọc (kính)"},{hangul:"말씀하세요",meaning:"nói (kính)"},{hangul:"선생님",meaning:"thầy/cô"},{hangul:"분",meaning:"người (kính)"}],
    sentences: [{korean:"선생님이 오셨어요.",romanized:"Seonsaengnimi osyeosseoyo.",en:"Teacher came.",vi:"Thầy đến."},{korean:"어머니가 집에 계세요.",romanized:"Eomeoniga jibe gyeseyo.",en:"Mother is home.",vi:"Mẹ ở nhà."},{korean:"할아버지가 신문 읽으세요.",romanized:"Harabeojiga sinmun ilgeuseyo.",en:"Grandpa reads paper.",vi:"Ông đọc báo."},{korean:"사장님이 말씀하세요.",romanized:"Sajangnimi malsseumhaseyo.",en:"Boss speaks.",vi:"Giám đốc nói."},{korean:"진지 드세요.",romanized:"Jinji deuseyo.",en:"Please eat (honorific).",vi:"Mời dùng bữa."}],
    dialogue: [{speaker:"A",hangul:"할머니, 진지 드셨어요?",meaning:"Grandma, did you eat?"},{speaker:"B",hangul:"응, 방금 먹었어.",meaning:"Yes, just ate."},{speaker:"A",hangul:"뭐 드셨어요?",meaning:"What?"},{speaker:"B",hangul:"국 먹었어.",meaning:"Soup."}],
    exercises: [{type:"fill-blank",question:"'Thầy đến': 선생님이 ___",answer:"오셨어요"},{type:"matching",pairs:[{hangul:"계세요",meaning:"ở (kính)"},{hangul:"드세요",meaning:"ăn (kính)"}],instruction:"Ghép kính ngữ"},{type:"translation",vietnamese:"Mời dùng bữa.",hangul:"진지 드세요."}]
  }
,
  {
    id: 21,
level: "A2",
    title_vi: "Gọi điện thoại",
    title_en: "Making Phone Calls",
    intro_vi: "Học cách diễn đạt khi gọi điện thoại bằng tiếng Hàn. Dùng 여보세요 để chào khi nghe điện.",
    vocabulary: [{ hangul: "전화", meaning: "telephone" },
      { hangul: "전화를 걸다", meaning: "to make a call" },
      { hangul: "전화를 받다", meaning: "to answer the phone" },
      { hangul: "통화하다", meaning: "to have a conversation" },
      { hangul: "여보세요", meaning: "hello (on phone)" },
      { hangul: "실례합니다", meaning: "excuse me" },
      { hangul: "잠시만요", meaning: "just a moment" },
      { hangul: "다시 전화하다", meaning: "to call again" },
      { hangul: "메시지를 남기다", meaning: "to leave a message" },
      { hangul: "통화 중", meaning: "busy (phone)" }],
    sentences: [
      { korean: "여보세요, 거기 김 선생님 계세요?", romanized: "Yeoboseyo, geogi gim seonsaengnim gyeseyo?", en: "Hello, is Mr. Kim there?", vi: "Alô, có ông Kim ở đó không?" },
      { korean: "잠시만 기다리세요.", romanized: "Jamsiman gidariseyo.", en: "Please wait a moment.", vi: "Xin chờ một lát." },
      { korean: "다시 전화할게요.", romanized: "Dasi jeonhwahalgeyo.", en: "I'll call again.", vi: "Tôi sẽ gọi lại." },
      { korean: "메시지를 남겨 주시겠어요?", romanized: "Mesijireul namgyeo jusigesseoyo?", en: "Could you leave a message?", vi: "Bạn có thể nhắn lại được không?" },
      { korean: "통화 중이에요.", romanized: "Tonghwa jungieyo.", en: "The line is busy.", vi: "Đường dây đang bận." }
    ],
    dialogue: [{ speaker: "A", hangul: "여보세요, 김민수 씨 계세요?", meaning: "Hello, is Minsu Kim there?" },
      { speaker: "B", hangul: "제가 김민순데요. 누구세요?", meaning: "This is Minsu Kim. Who is this?" },
      { speaker: "A", hangul: "저는 박지영이에요.", meaning: "This is Jiyoung Park." },
      { speaker: "B", hangul: "아, 지영 씨! 무슨 일이세요?", meaning: "Ah, Jiyoung! What can I do for you?" },],
    exercises: [{ type: "fill-blank", question: "여보세요, 김 선생님 ___?", answer: "계세요" },
      { type: "matching", pairs: [{ hangul: "전화를 걸다", meaning: "to make a call" }, { hangul: "전화를 받다", meaning: "to answer the phone" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Xin chào, tôi muốn nói chuyện với giám đốc.", hangul: "안녕하세요, 사장님과 통화하고 싶습니다." }]
  },
  {
    id: 22,
level: "A2",
    title_vi: "Viết email",
    title_en: "Writing Emails",
    intro_vi: "Học các cách diễn đạt email trang trọng và thân mật. Dùng 안녕하세요 để chào và 감사합니다 để cảm ơn.",
    vocabulary: [{ hangul: "이메일", meaning: "email" },
      { hangul: "보내다", meaning: "to send" },
      { hangul: "받다", meaning: "to receive" },
      { hangul: "제목", meaning: "subject" },
      { hangul: "내용", meaning: "content" },
      { hangul: "첨부 파일", meaning: "attachment" },
      { hangul: "회신하다", meaning: "to reply" },
      { hangul: "확인하다", meaning: "to confirm" },
      { hangul: "감사합니다", meaning: "thank you" },
      { hangul: "안녕하세요", meaning: "hello (formal)" }],
    sentences: [
      { korean: "안녕하세요, 김 선생님께 이메일 드립니다.", romanized: "Annyeonghaseyo, gim seonsaengnimkke imeil deurimnida.", en: "Hello, I am sending an email to Mr. Kim.", vi: "Xin chào, tôi viết email gửi thầy Kim." },
      { korean: "첨부 파일을 확인해 주세요.", romanized: "Cheombu paireul hwaginhae juseyo.", en: "Please check the attached file.", vi: "Xin vui lòng kiểm tra tệp đính kèm." },
      { korean: "회신 부탁드립니다.", romanized: "Hoesin butakdeurimnida.", en: "I look forward to your reply.", vi: "Mong nhận được phản hồi của bạn." },
      { korean: "제목을 다시 쓰겠습니다.", romanized: "Jemogeul dasi sseugetseumnida.", en: "I will rewrite the subject.", vi: "Tôi sẽ viết lại tiêu đề." },
      { korean: "감사합니다. 좋은 하루 보내세요.", romanized: "Gamsahamnida. joeun haru bonaeseyo.", en: "Thank you. Have a nice day.", vi: "Cảm ơn. Chúc một ngày tốt lành." }
    ],
    dialogue: [{ speaker: "A", hangul: "안녕하세요, 이메일 보냈어요?", meaning: "Hello, did you send the email?" },
      { speaker: "B", hangul: "네, 방금 보냈어요. 첨부 파일도 넣었어요.", meaning: "Yes, I just sent it. I also attached a file." },
      { speaker: "A", hangul: "확인해 볼게요. 감사합니다.", meaning: "I'll check it. Thank you." },
      { speaker: "B", hangul: "네, 수고하세요.", meaning: "Okay, take care." },],
    exercises: [{ type: "fill-blank", question: "이메일을 ___습니다.", answer: "보냈" },
      { type: "matching", pairs: [{ hangul: "보내다", meaning: "to send" }, { hangul: "받다", meaning: "to receive" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi đã gửi email kèm tệp đính kèm.", hangul: "첨부 파일과 함께 이메일을 보냈습니다." }]
  },
  {
    id: 23,
level: "A2",
    title_vi: "Ở ngân hàng",
    title_en: "At the Bank",
    intro_vi: "Các câu hữu ích cho giao dịch ngân hàng. Dùng 통장 cho sổ ngân hàng và 계좌 cho tài khoản.",
    vocabulary: [{ hangul: "은행", meaning: "bank" },
      { hangul: "계좌", meaning: "account" },
      { hangul: "통장", meaning: "bankbook" },
      { hangul: "입금하다", meaning: "to deposit" },
      { hangul: "출금하다", meaning: "to withdraw" },
      { hangul: "송금하다", meaning: "to transfer" },
      { hangul: "이자", meaning: "interest" },
      { hangul: "비밀번호", meaning: "password" },
      { hangul: "통화", meaning: "currency" },
      { hangul: "수수료", meaning: "fee" }],
    sentences: [
      { korean: "계좌를 개설하고 싶습니다.", romanized: "Gyejwareul gaeseolhago sipseumnida.", en: "I would like to open an account.", vi: "Tôi muốn mở tài khoản." },
      { korean: "입금하려고 합니다.", romanized: "Ipgeumharyeogo hamnida.", en: "I want to make a deposit.", vi: "Tôi muốn gửi tiền." },
      { korean: "송금 수수료는 얼마인가요?", romanized: "Songgeum susuryoneun eolmaingayo?", en: "How much is the transfer fee?", vi: "Phí chuyển khoản là bao nhiêu?" },
      { korean: "비밀번호를 변경하고 싶어요.", romanized: "Bimilbeonhoreul byeongyeonghago sipeoyo.", en: "I want to change my password.", vi: "Tôi muốn đổi mật khẩu." },
      { korean: "통장 정리를 부탁합니다.", romanized: "Tongjang jeongrireul butakhamnida.", en: "Please update my bankbook.", vi: "Xin cập nhật sổ ngân hàng." }
    ],
    dialogue: [{ speaker: "A", hangul: "안녕하세요, 계좌를 개설하고 싶습니다.", meaning: "Hello, I'd like to open an account." },
      { speaker: "B", hangul: "네, 신분증이 필요합니다.", meaning: "Yes, you need an ID." },
      { speaker: "A", hangul: "여기 있습니다.", meaning: "Here it is." },
      { speaker: "B", hangul: "감사합니다. 잠시만 기다려 주세요.", meaning: "Thank you. Please wait a moment." }],
    exercises: [{ type: "fill-blank", question: "계좌를 ___하고 싶습니다.", answer: "개설" },
      { type: "matching", pairs: [{ hangul: "입금하다", meaning: "to deposit" }, { hangul: "출금하다", meaning: "to withdraw" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn chuyển tiền đến tài khoản này.", hangul: "이 계좌로 송금하고 싶습니다." }]
  },
  {
    id: 24,
level: "A2",
    title_vi: "Ở bưu điện",
    title_en: "At the Post Office",
    intro_vi: "Câu thông dụng để gửi thư và bưu kiện. Dùng 우표 cho tem và 소포 cho bưu kiện.",
    vocabulary: [{ hangul: "우체국", meaning: "post office" },
      { hangul: "우표", meaning: "stamp" },
      { hangul: "편지", meaning: "letter" },
      { hangul: "소포", meaning: "parcel" },
      { hangul: "등기", meaning: "registered mail" },
      { hangul: "빠른 우편", meaning: "express mail" },
      { hangul: "받는 사람", meaning: "recipient" },
      { hangul: "보내는 사람", meaning: "sender" },
      { hangul: "주소", meaning: "address" },
      { hangul: "우편 번호", meaning: "postal code" }],
    sentences: [
      { korean: "이 편지를 한국으로 보내고 싶어요.", romanized: "I pyeonjireul hangugeuro bonaego sipeoyo.", en: "I want to send this letter to Korea.", vi: "Tôi muốn gửi lá thư này đến Hàn Quốc." },
      { korean: "소포를 부치려면 얼마인가요?", romanized: "Soporeul buchiryeomyeon eolmaingayo?", en: "How much is it to send a parcel?", vi: "Gửi bưu kiện giá bao nhiêu?" },
      { korean: "등기로 보내 주세요.", romanized: "Deunggiro bonae juseyo.", en: "Please send it by registered mail.", vi: "Xin gửi bằng thư bảo đảm." },
      { korean: "우표를 어디서 살 수 있나요?", romanized: "Upyoreul eodiseo sal su itnayo?", en: "Where can I buy stamps?", vi: "Tôi có thể mua tem ở đâu?" },
      { korean: "주소를 여기에 적어 주세요.", romanized: "Jusoreul yeogie jeogeo juseyo.", en: "Please write the address here.", vi: "Xin viết địa chỉ ở đây." }
    ],
    dialogue: [{ speaker: "A", hangul: "이 소포를 베트남으로 보내고 싶어요.", meaning: "I want to send this parcel to Vietnam." },
      { speaker: "B", hangul: "네, 내용물은 무엇인가요?", meaning: "Yes, what is the contents?" },
      { speaker: "A", hangul: "옷과 책입니다.", meaning: "Clothes and books." },
      { speaker: "B", hangul: "배송 방법을 선택해 주세요. 항공편이 빠릅니다.", meaning: "Please choose a shipping method. Air mail is faster." }],
    exercises: [{ type: "fill-blank", question: "이 편지를 ___로 보내고 싶어요.", answer: "한국" },
      { type: "matching", pairs: [{ hangul: "우표", meaning: "stamp" }, { hangul: "소포", meaning: "parcel" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn gửi bưu kiện này bằng đường hàng không.", hangul: "이 소포를 항공편으로 보내고 싶습니다." }]
  },
  {
    id: 25,
level: "A2",
    title_vi: "Thuê căn hộ",
    title_en: "Renting an Apartment",
    intro_vi: "Từ vựng thuê căn hộ. Dùng 보증금 cho tiền đặt cọc và 월세 cho tiền thuê hàng tháng.",
    vocabulary: [{ hangul: "아파트", meaning: "apartment" },
      { hangul: "임대", meaning: "rental" },
      { hangul: "보증금", meaning: "deposit" },
      { hangul: "월세", meaning: "monthly rent" },
      { hangul: "계약", meaning: "contract" },
      { hangul: "방", meaning: "room" },
      { hangul: "부엌", meaning: "kitchen" },
      { hangul: "화장실", meaning: "bathroom" },
      { hangul: "주차장", meaning: "parking lot" },
      { hangul: "관리비", meaning: "management fee" }],
    sentences: [
      { korean: "아파트를 구하고 있습니다.", romanized: "Apateureul guhago itseumnida.", en: "I am looking for an apartment.", vi: "Tôi đang tìm căn hộ." },
      { korean: "보증금은 얼마인가요?", romanized: "Bojeunggeumeun eolmaingayo?", en: "How much is the deposit?", vi: "Tiền đặt cọc bao nhiêu?" },
      { korean: "월세가 너무 비싸요.", romanized: "Wolsega neomu bissayo.", en: "The monthly rent is too expensive.", vi: "Tiền thuê hàng tháng đắt quá." },
      { korean: "계약 기간은 1년입니다.", romanized: "Gyeyak giganeun 1nyeonimnida.", en: "The contract period is one year.", vi: "Thời hạn hợp đồng là 1 năm." },
      { korean: "관리비가 포함되어 있나요?", romanized: "Gwanribiga pohamdoeeo itnayo?", en: "Is the management fee included?", vi: "Phí quản lý đã bao gồm chưa?" }
    ],
    dialogue: [{ speaker: "A", hangul: "이 아파트를 보여 주시겠어요?", meaning: "Could you show me this apartment?" },
      { speaker: "B", hangul: "네, 여기 있습니다. 방이 두 개예요.", meaning: "Yes, here it is. It has two rooms." },
      { speaker: "A", hangul: "부엌이 크네요. 마음에 들어요.", meaning: "The kitchen is big. I like it." },
      { speaker: "B", hangul: "보증금은 500만 원이고 월세는 70만 원입니다.", meaning: "The deposit is 5 million won and monthly rent is 700,000 won." }],
    exercises: [{ type: "fill-blank", question: "보증금이 ___만 원입니다.", answer: "500" },
      { type: "matching", pairs: [{ hangul: "월세", meaning: "monthly rent" }, { hangul: "보증금", meaning: "deposit" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tiền thuê nhà hàng tháng là 700.000 won.", hangul: "월세는 70만 원입니다." }]
  },
  {
    id: 26,
level: "A2",
    title_vi: "Khiếu nại và trả hàng",
    title_en: "Complaints and Returns",
    intro_vi: "Cách diễn đạt khiếu nại và trả hàng. Dùng 불만 cho khiếu nại và 반품 cho trả hàng.",
    vocabulary: [{ hangul: "불만", meaning: "complaint" },
      { hangul: "반품", meaning: "return" },
      { hangul: "교환", meaning: "exchange" },
      { hangul: "환불", meaning: "refund" },
      { hangul: "하자", meaning: "defect" },
      { hangul: "영수증", meaning: "receipt" },
      { hangul: "고객 센터", meaning: "customer service" },
      { hangul: "불편하다", meaning: "to be uncomfortable" },
      { hangul: "제품", meaning: "product" },
      { hangul: "주문", meaning: "order" }],
    sentences: [
      { korean: "이 제품에 하자가 있습니다.", romanized: "I jepume hajaga itseumnida.", en: "This product has a defect.", vi: "Sản phẩm này có lỗi." },
      { korean: "반품하고 싶습니다.", romanized: "Banpumhago sipseumnida.", en: "I want to return it.", vi: "Tôi muốn trả lại." },
      { korean: "영수증이 없으면 환불이 어렵습니다.", romanized: "Yeongsujeungi eopseumyeon hwanburi eoryeopseumnida.", en: "Without a receipt, a refund is difficult.", vi: "Không có hóa đơn thì khó hoàn tiền." },
      { korean: "다른 제품으로 교환해 주세요.", romanized: "Dareun jepumeuro gyohwanhae juseyo.", en: "Please exchange it for another product.", vi: "Xin đổi sang sản phẩm khác." },
      { korean: "고객 센터에 전화해 보세요.", romanized: "Gogaek senteoe jeonhwahae boseyo.", en: "Try calling customer service.", vi: "Hãy gọi tổng đài chăm sóc khách hàng." }
    ],
    dialogue: [{ speaker: "A", hangul: "이 옷에 구멍이 났어요. 반품하고 싶어요.", meaning: "This clothing has a hole. I want to return it." },
      { speaker: "B", hangul: "영수증 있으세요?", meaning: "Do you have the receipt?" },
      { speaker: "A", hangul: "네, 여기 있어요.", meaning: "Yes, here it is." },
      { speaker: "B", hangul: "죄송합니다. 바로 환불해 드리겠습니다.", meaning: "I'm sorry. I will refund you right away." }],
    exercises: [{ type: "fill-blank", question: "이 제품에 ___가 있습니다.", answer: "하자" },
      { type: "matching", pairs: [{ hangul: "반품", meaning: "return" }, { hangul: "환불", meaning: "refund" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn đổi sản phẩm này lấy sản phẩm khác.", hangul: "이 제품을 다른 제품으로 교환하고 싶습니다." }]
  },
  {
    id: 27,
level: "A2",
    title_vi: "Chỉ đường chi tiết",
    title_en: "Giving Detailed Directions",
    intro_vi: "Dùng từ chỉ phương hướng như 직진 đi thẳng, 왼쪽 trái, 오른쪽 phải.",
    vocabulary: [{ hangul: "직진", meaning: "straight ahead" },
      { hangul: "왼쪽", meaning: "left" },
      { hangul: "오른쪽", meaning: "right" },
      { hangul: "모퉁이", meaning: "corner" },
      { hangul: "건너편", meaning: "opposite side" },
      { hangul: "사거리", meaning: "intersection" },
      { hangul: "신호등", meaning: "traffic light" },
      { hangul: "걸어서", meaning: "on foot" },
      { hangul: "버스 정류장", meaning: "bus stop" },
      { hangul: "지하철 역", meaning: "subway station" }],
    sentences: [
      { korean: "직진하다가 사거리에서 왼쪽으로 가세요.", romanized: "Jikjinhadaga sageorieseo oenjjogeuro gaseyo.", en: "Go straight and turn left at the intersection.", vi: "Đi thẳng rồi rẽ trái ở ngã tư." },
      { korean: "신호등을 건너면 은행이 보여요.", romanized: "Sinhodeungeul geonneomyeon eunhaengi boyeoyo.", en: "After crossing the traffic light, you'll see the bank.", vi: "Qua đèn giao thông là thấy ngân hàng." },
      { korean: "버스 정류장은 건너편에 있어요.", romanized: "Beoseu jeongryujangeun geonneopyeone isseoyo.", en: "The bus stop is on the opposite side.", vi: "Trạm xe buýt ở phía đối diện." },
      { korean: "여기서 지하철 역까지 걸어서 10분이에요.", romanized: "Yeogiseo jihacheol yeokkkaji georeoseo 10bunieyo.", en: "It's a 10-minute walk from here to the subway station.", vi: "Từ đây đến ga tàu điện ngầm đi bộ 10 phút." },
      { korean: "모퉁이를 돌면 편의점이 있어요.", romanized: "Motungireul dolmyeon pyeonuijeomi isseoyo.", en: "Around the corner, there is a convenience store.", vi: "Rẽ qua góc đường có cửa hàng tiện lợi." }
    ],
    dialogue: [{ speaker: "A", hangul: "실례합니다, 시청에 어떻게 가나요?", meaning: "Excuse me, how do I get to City Hall?" },
      { speaker: "B", hangul: "직진하시다가 두 번째 사거리에서 오른쪽으로 가세요.", meaning: "Go straight and turn right at the second intersection." },
      { speaker: "A", hangul: "네, 감사합니다. 걸어서 얼마나 걸리나요?", meaning: "Okay, thank you. How long does it take on foot?" },
      { speaker: "B", hangul: "약 15분 정도 걸려요.", meaning: "It takes about 15 minutes." }],
    exercises: [{ type: "fill-blank", question: "사거리에서 ___쪽으로 가세요.", answer: "왼" },
      { type: "matching", pairs: [{ hangul: "직진", meaning: "straight" }, { hangul: "모퉁이", meaning: "corner" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Rẽ trái ở ngã tư thứ hai.", hangul: "두 번째 사거리에서 왼쪽으로 가세요." }]
  },
  {
    id: 28,
level: "A2",
    title_vi: "Thảo luận tin tức",
    title_en: "Discussing News",
    intro_vi: "Dùng 뉴스 cho tin tức và 토론 cho thảo luận. Học cách nêu ý kiến về sự kiện thời sự.",
    vocabulary: [{ hangul: "뉴스", meaning: "news" },
      { hangul: "토론하다", meaning: "to discuss" },
      { hangul: "기사", meaning: "article" },
      { hangul: "사건", meaning: "incident" },
      { hangul: "의견", meaning: "opinion" },
      { hangul: "동의하다", meaning: "to agree" },
      { hangul: "반대하다", meaning: "to oppose" },
      { hangul: "사실", meaning: "fact" },
      { hangul: "거짓", meaning: "lie / false" },
      { hangul: "분석", meaning: "analysis" }],
    sentences: [
      { korean: "오늘 뉴스에서 뭘 봤어요?", romanized: "Oneul nyuseueseo mwol bwasseoyo?", en: "What did you see on the news today?", vi: "Hôm nay bạn xem tin gì?" },
      { korean: "그 기사에 동의하세요?", romanized: "Geu gisae donguihaseyo?", en: "Do you agree with that article?", vi: "Bạn có đồng ý với bài báo đó không?" },
      { korean: "저는 그 의견에 반대합니다.", romanized: "Jeoneun geu uigyeone bandaehamnida.", en: "I oppose that opinion.", vi: "Tôi phản đối ý kiến đó." },
      { korean: "그 사건은 아직 사실이 확인되지 않았어요.", romanized: "Geu sageoneun ajik sasiri hwagindoeji anasseoyo.", en: "That incident hasn't been confirmed as fact yet.", vi: "Sự việc đó vẫn chưa được xác nhận là thật." },
      { korean: "뉴스 분석이 매우 흥미로웠어요.", romanized: "Nyuseu bunseogi maeu heungmirowosseoyo.", en: "The news analysis was very interesting.", vi: "Bài phân tích tin tức rất thú vị." }
    ],
    dialogue: [{ speaker: "A", hangul: "어제 뉴스 봤어요? 경제 관련 기사가 있었어요.", meaning: "Did you watch the news yesterday? There was an article about the economy." },
      { speaker: "B", hangul: "네, 봤어요. 하지만 그 분석에 동의하지 않아요.", meaning: "Yes, I saw it. But I don't agree with that analysis." },
      { speaker: "A", hangul: "왜요? 저는 꽤 타당하다고 생각했는데요.", meaning: "Why? I thought it was quite reasonable." },
      { speaker: "B", hangul: "몇 가지 사실이 빠져 있어요.", meaning: "Some facts are missing." }],
    exercises: [{ type: "fill-blank", question: "그 기사에 ___하세요?", answer: "동의" },
      { type: "matching", pairs: [{ hangul: "동의하다", meaning: "to agree" }, { hangul: "반대하다", meaning: "to oppose" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi không đồng ý với phân tích đó.", hangul: "저는 그 분석에 동의하지 않습니다." }]
  },
  {
    id: 29,
level: "A2",
    title_vi: "Khác biệt văn hóa",
    title_en: "Cultural Differences",
    intro_vi: "Thảo luận chuẩn mực và sự khác biệt văn hóa. Dùng 문화 cho văn hóa và 차이 cho khác biệt.",
    vocabulary: [{ hangul: "문화", meaning: "culture" },
      { hangul: "차이", meaning: "difference" },
      { hangul: "관습", meaning: "custom" },
      { hangul: "예절", meaning: "etiquette" },
      { hangul: "인사", meaning: "greeting" },
      { hangul: "선물", meaning: "gift" },
      { hangul: "식사", meaning: "meal" },
      { hangul: "금기", meaning: "taboo" },
      { hangul: "이해하다", meaning: "to understand" },
      { hangul: "존중하다", meaning: "to respect" }],
    sentences: [
      { korean: "한국과 베트남의 문화 차이가 있어요.", romanized: "Hangukgwa beteunamui munhwa chaiga isseoyo.", en: "There are cultural differences between Korea and Vietnam.", vi: "Có sự khác biệt văn hóa giữa Hàn Quốc và Việt Nam." },
      { korean: "한국에서는 인사할 때 고개를 숙여요.", romanized: "Hangugeseoneun insahal ttae gogaereul sugyeoyo.", en: "In Korea, you bow when greeting.", vi: "Ở Hàn Quốc, người ta cúi đầu khi chào." },
      { korean: "선물을 받을 때 두 손으로 받는 게 예의예요.", romanized: "Seonmureul badeul ttae du soneuro batneun ge yeuiyeyo.", en: "It is polite to receive a gift with both hands.", vi: "Nhận quà bằng hai tay là lịch sự." },
      { korean: "식사 중에 코를 푸는 것은 금기예요.", romanized: "Siksa junge koreul puneun geoseun geumgiyeyo.", en: "Blowing your nose during a meal is taboo.", vi: "Hỉ mũi trong bữa ăn là điều cấm kỵ." },
      { korean: "서로의 문화를 존중하는 것이 중요해요.", romanized: "Seoroui munhwareul jonjunghaneun geosi jungyohaeyo.", en: "It's important to respect each other's culture.", vi: "Tôn trọng văn hóa của nhau là điều quan trọng." }
    ],
    dialogue: [{ speaker: "A", hangul: "한국에서 처음으로 명절을 보냈어요.", meaning: "I spent my first holiday in Korea." },
      { speaker: "B", hangul: "어땠어요? 다른 점이 많았죠?", meaning: "How was it? There were many differences, right?" },
      { speaker: "A", hangul: "네, 특히 음식과 인사 방식이 달랐어요.", meaning: "Yes, especially the food and greeting style were different." },
      { speaker: "B", hangul: "시간이 지나면 익숙해질 거예요.", meaning: "You'll get used to it over time." }],
    exercises: [{ type: "fill-blank", question: "한국과 베트남의 ___ 차이가 있어요.", answer: "문화" },
      { type: "matching", pairs: [{ hangul: "인사", meaning: "greeting" }, { hangul: "금기", meaning: "taboo" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Điều quan trọng là tôn trọng văn hóa của nhau.", hangul: "서로의 문화를 존중하는 것이 중요합니다." }]
  },
  {
    id: 30,
level: "A2",
    title_vi: "Phỏng vấn xin việc",
    title_en: "Job Interviews",
    intro_vi: "Câu quan trọng khi phỏng vấn xin việc. Dùng 자기소개 cho tự giới thiệu và 지원하다 cho ứng tuyển.",
    vocabulary: [{ hangul: "면접", meaning: "interview" },
      { hangul: "지원하다", meaning: "to apply" },
      { hangul: "자기소개", meaning: "self-introduction" },
      { hangul: "경력", meaning: "career / experience" },
      { hangul: "학력", meaning: "educational background" },
      { hangul: "강점", meaning: "strength" },
      { hangul: "약점", meaning: "weakness" },
      { hangul: "목표", meaning: "goal" },
      { hangul: "직무", meaning: "job duty" },
      { hangul: "합격", meaning: "pass / acceptance" }],
    sentences: [
      { korean: "먼저 자기소개를 해 주세요.", romanized: "Meonjeo jagisogaereul hae juseyo.", en: "Please introduce yourself first.", vi: "Trước hết hãy tự giới thiệu." },
      { korean: "제 강점은 커뮤니케이션 능력입니다.", romanized: "Je gangjeomeun keomyunikeisyeon neungryeogimnida.", en: "My strength is communication skills.", vi: "Điểm mạnh của tôi là khả năng giao tiếp." },
      { korean: "이전 경력에 대해 말씀해 주세요.", romanized: "Ijeon gyeongryeoge daehae malsseumhae juseyo.", en: "Please tell me about your previous experience.", vi: "Hãy nói về kinh nghiệm trước đây." },
      { korean: "왜 이 회사에 지원하셨나요?", romanized: "Wae i hoesae jiwonhasyeotnayo?", en: "Why did you apply to this company?", vi: "Tại sao bạn ứng tuyển vào công ty này?" },
      { korean: "앞으로의 목표가 무엇인가요?", romanized: "Apeuroui mokpyoga mueosingayo?", en: "What are your future goals?", vi: "Mục tiêu tương lai của bạn là gì?" }
    ],
    dialogue: [{ speaker: "A", hangul: "안녕하세요. 면접관입니다. 편하게 앉으세요.", meaning: "Hello. I am the interviewer. Please have a seat." },
      { speaker: "B", hangul: "감사합니다. 저는 김지수라고 합니다.", meaning: "Thank you. My name is Jisoo Kim." },
      { speaker: "A", hangul: "지수 씨, 자기소개 부탁드립니다.", meaning: "Jisoo, please introduce yourself." },
      { speaker: "B", hangul: "네. 저는 마케팅 분야에서 3년 경력이 있습니다.", meaning: "Yes. I have three years of experience in marketing." }],
    exercises: [{ type: "fill-blank", question: "먼저 ___를 해 주세요.", answer: "자기소개" },
      { type: "matching", pairs: [{ hangul: "강점", meaning: "strength" }, { hangul: "약점", meaning: "weakness" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi có ba năm kinh nghiệm trong lĩnh vực tiếp thị.", hangul: "저는 마케팅 분야에서 3년 경력이 있습니다." }]
  },
  {
    id: 31,
level: "B1",
    title_vi: "Họp công việc",
    title_en: "Business Meetings",
    intro_vi: "Cách diễn đạt trong họp trang trọng. Dùng 회의 cho cuộc họp và 의견을 내다 để nêu ý kiến.",
    vocabulary: [{ hangul: "회의", meaning: "meeting" },
      { hangul: "의제", meaning: "agenda" },
      { hangul: "발표", meaning: "presentation" },
      { hangul: "토의", meaning: "discussion" },
      { hangul: "결정", meaning: "decision" },
      { hangul: "참석하다", meaning: "to attend" },
      { hangul: "의견을 내다", meaning: "to give an opinion" },
      { hangul: "진행하다", meaning: "to proceed" },
      { hangul: "마감", meaning: "deadline" },
      { hangul: "회의록", meaning: "meeting minutes" }],
    sentences: [
      { korean: "회의를 시작하겠습니다.", romanized: "Hoeuireul sijakhagetseumnida.", en: "Let's start the meeting.", vi: "Bắt đầu cuộc họp." },
      { korean: "오늘 의제는 무엇인가요?", romanized: "Oneul uijeneun mueosingayo?", en: "What is today's agenda?", vi: "Chương trình hôm nay là gì?" },
      { korean: "다음 프로젝트에 대해 토의합시다.", romanized: "Daeum peurojekteue daehae touihapsida.", en: "Let's discuss the next project.", vi: "Hãy thảo luận dự án tiếp theo." },
      { korean: "결정은 다음 주까지 미루겠습니다.", romanized: "Gyeoljeongeun daeum jukkaji mirugetseumnida.", en: "We will postpone the decision until next week.", vi: "Quyết định sẽ hoãn đến tuần sau." },
      { korean: "회의록을 이메일로 보내 드리겠습니다.", romanized: "Hoeuirogeul imeilro bonae deurigetseumnida.", en: "I will send you the meeting minutes by email.", vi: "Tôi sẽ gửi biên bản họp qua email." }
    ],
    dialogue: [{ speaker: "A", hangul: "모두 모였으니 회의를 시작하겠습니다.", meaning: "Since everyone is here, let's start the meeting." },
      { speaker: "B", hangul: "네, 먼저 지난주 진행 상황을 보고하겠습니다.", meaning: "Yes, first I will report on last week's progress." },
      { speaker: "A", hangul: "수고하셨습니다. 다음 의제로 넘어갑시다.", meaning: "Good work. Let's move to the next agenda." },
      { speaker: "B", hangul: "새로운 마케팅 전략에 대해 논의하고 싶습니다.", meaning: "I'd like to discuss the new marketing strategy." }],
    exercises: [{ type: "fill-blank", question: "회의를 ___겠습니다.", answer: "시작하" },
      { type: "matching", pairs: [{ hangul: "의제", meaning: "agenda" }, { hangul: "회의록", meaning: "minutes" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng ta hãy thảo luận về dự án tiếp theo.", hangul: "다음 프로젝트에 대해 토의합시다." }]
  },
  {
    id: 32,
level: "B1",
    title_vi: "Thuyết trình",
    title_en: "Giving Presentations",
    intro_vi: "Cách diễn đạt khi thuyết trình. Dùng 발표 cho thuyết trình và 자료 cho tài liệu.",
    vocabulary: [{ hangul: "발표", meaning: "presentation" },
      { hangul: "자료", meaning: "materials" },
      { hangul: "슬라이드", meaning: "slide" },
      { hangul: "요약", meaning: "summary" },
      { hangul: "질문", meaning: "question" },
      { hangul: "대답", meaning: "answer" },
      { hangul: "청중", meaning: "audience" },
      { hangul: "준비하다", meaning: "to prepare" },
      { hangul: "설명하다", meaning: "to explain" },
      { hangul: "마무리하다", meaning: "to conclude" }],
    sentences: [
      { korean: "오늘 발표 주제는 시장 분석입니다.", romanized: "Oneul balpyo jujeneun sijang bunseogimnida.", en: "Today's presentation topic is market analysis.", vi: "Chủ đề thuyết trình hôm nay là phân tích thị trường." },
      { korean: "다음 슬라이드를 봐 주세요.", romanized: "Daeum seulraideureul bwa juseyo.", en: "Please look at the next slide.", vi: "Xin xem slide tiếp theo." },
      { korean: "간단히 요약하겠습니다.", romanized: "Gandanhi yoyakhagetseumnida.", en: "I will give a brief summary.", vi: "Tôi sẽ tóm tắt ngắn gọn." },
      { korean: "질문이 있으시면 언제든지 해 주세요.", romanized: "Jilmuni isseusimyeon eonjedeunji hae juseyo.", en: "If you have questions, please feel free to ask anytime.", vi: "Có câu hỏi xin cứ tự nhiên." },
      { korean: "발표를 마치겠습니다. 감사합니다.", romanized: "Balpyoreul machigetseumnida. gamsahamnida.", en: "I will conclude the presentation. Thank you.", vi: "Tôi xin kết thúc bài thuyết trình. Cảm ơn." }
    ],
    dialogue: [{ speaker: "A", hangul: "안녕하세요, 오늘 발표를 시작하겠습니다.", meaning: "Hello, I will begin today's presentation." },
      { speaker: "B", hangul: "주제가 무엇인가요?", meaning: "What is the topic?" },
      { speaker: "A", hangul: "신제품 출시 전략에 관한 것입니다.", meaning: "It is about the new product launch strategy." },
      { speaker: "B", hangul: "자료를 미리 받을 수 있나요?", meaning: "Can I get the materials in advance?" }],
    exercises: [{ type: "fill-blank", question: "다음 ___를 봐 주세요.", answer: "슬라이드" },
      { type: "matching", pairs: [{ hangul: "발표", meaning: "presentation" }, { hangul: "요약", meaning: "summary" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ kết thúc bài thuyết trình. Cảm ơn.", hangul: "발표를 마치겠습니다. 감사합니다." }]
  },
  {
    id: 33,
level: "B1",
    title_vi: "Đàm phán",
    title_en: "Negotiating",
    intro_vi: "Từ vựng đàm phán. Dùng 협상 cho đàm phán và 조건 cho điều kiện.",
    vocabulary: [{ hangul: "협상", meaning: "negotiation" },
      { hangul: "조건", meaning: "condition" },
      { hangul: "제안", meaning: "proposal" },
      { hangul: "타협", meaning: "compromise" },
      { hangul: "할인", meaning: "discount" },
      { hangul: "가격", meaning: "price" },
      { hangul: "계약서", meaning: "contract" },
      { hangul: "양보하다", meaning: "to concede" },
      { hangul: "이익", meaning: "profit" },
      { hangul: "마감일", meaning: "deadline" }],
    sentences: [
      { korean: "협상을 시작합시다.", romanized: "Hyeopsangeul sijakhapsida.", en: "Let's start the negotiation.", vi: "Hãy bắt đầu đàm phán." },
      { korean: "조건을 조금 완화해 주실 수 있나요?", romanized: "Jogeoneul jogeum wanhwahae jusil su itnayo?", en: "Could you ease the conditions a little?", vi: "Bạn có thể nới lỏng điều kiện một chút không?" },
      { korean: "우리는 10% 할인을 제안합니다.", romanized: "Urineun 10% harineul jeanhamnida.", en: "We propose a 10% discount.", vi: "Chúng tôi đề xuất giảm giá 10%." },
      { korean: "서로 타협점을 찾아야 합니다.", romanized: "Seoro tahyeopjeomeul chajaya hamnida.", en: "We need to find a compromise.", vi: "Chúng ta cần tìm điểm thỏa hiệp." },
      { korean: "계약서에 서명하기 전에 검토하겠습니다.", romanized: "Gyeyakseoe seomyeonghagi jeone geomtohagetseumnida.", en: "I will review the contract before signing.", vi: "Tôi sẽ xem xét hợp đồng trước khi ký." }
    ],
    dialogue: [{ speaker: "A", hangul: "가격을 낮출 수 있을까요?", meaning: "Can you lower the price?" },
      { speaker: "B", hangul: "최대 5%까지 할인이 가능합니다.", meaning: "A maximum of 5% discount is possible." },
      { speaker: "A", hangul: "그럼 10% 할인은 어려운가요?", meaning: "Then is 10% discount difficult?" },
      { speaker: "B", hangul: "죄송합니다. 그 이상은 어렵습니다.", meaning: "Sorry, it's difficult beyond that." }],
    exercises: [{ type: "fill-blank", question: "___을 시작합시다.", answer: "협상" },
      { type: "matching", pairs: [{ hangul: "할인", meaning: "discount" }, { hangul: "양보하다", meaning: "to concede" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng tôi đề xuất giảm giá 10%.", hangul: "우리는 10% 할인을 제안합니다." }]
  },
  {
    id: 34,
level: "B1",
    title_vi: "Mạng xã hội",
    title_en: "Social Media",
    intro_vi: "Thuật ngữ mạng xã hội. Dùng 소셜 미디어 cho mạng xã hội và 팔로우 cho theo dõi.",
    vocabulary: [{ hangul: "소셜 미디어", meaning: "social media" },
      { hangul: "팔로우", meaning: "follow" },
      { hangul: "좋아요", meaning: "like" },
      { hangul: "댓글", meaning: "comment" },
      { hangul: "공유하다", meaning: "to share" },
      { hangul: "게시물", meaning: "post" },
      { hangul: "프로필", meaning: "profile" },
      { hangul: "해시태그", meaning: "hashtag" },
      { hangul: "인스타그램", meaning: "Instagram" },
      { hangul: "트위터", meaning: "Twitter" }],
    sentences: [
      { korean: "소셜 미디어에서 자주 활동하세요?", romanized: "Sosyeol midieoeseo jaju hwaldonghaseyo?", en: "Do you often use social media?", vi: "Bạn có hay dùng mạng xã hội không?" },
      { korean: "제 게시물에 좋아요를 눌러 주세요.", romanized: "Je gesimure joayoreul nulreo juseyo.", en: "Please like my post.", vi: "Xin nhấn like cho bài đăng của tôi." },
      { korean: "댓글을 달아 주셔서 감사합니다.", romanized: "Daetgeureul dara jusyeoseo gamsahamnida.", en: "Thank you for leaving a comment.", vi: "Cảm ơn bạn đã bình luận." },
      { korean: "이 사진을 공유하고 싶어요.", romanized: "I sajineul gongyuhago sipeoyo.", en: "I want to share this photo.", vi: "Tôi muốn chia sẻ bức ảnh này." },
      { korean: "해시태그를 사용하면 검색이 쉬워요.", romanized: "Haesitaegeureul sayonghamyeon geomsaegi swiwoyo.", en: "Using hashtags makes searching easier.", vi: "Dùng hashtag thì tìm kiếm dễ hơn." }
    ],
    dialogue: [{ speaker: "A", hangul: "인스타그램 계정이 있어요?", meaning: "Do you have an Instagram account?" },
      { speaker: "B", hangul: "네, 있어요. 당신을 팔로우할게요.", meaning: "Yes, I do. I'll follow you." },
      { speaker: "A", hangul: "감사합니다. 저도 팔로우할게요.", meaning: "Thank you. I'll follow you too." },
      { speaker: "B", hangul: "게시물이 정말 예쁘네요!", meaning: "Your posts are really pretty!" }],
    exercises: [{ type: "fill-blank", question: "게시물에 ___를 눌러 주세요.", answer: "좋아요" },
      { type: "matching", pairs: [{ hangul: "팔로우", meaning: "follow" }, { hangul: "공유하다", meaning: "to share" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi muốn chia sẻ bức ảnh này.", hangul: "이 사진을 공유하고 싶어요." }]
  },
  {
    id: 35,
level: "B1",
    title_vi: "Vấn đề môi trường",
    title_en: "Environmental Issues",
    intro_vi: "Từ vựng môi trường. Dùng 환경 cho môi trường và 문제 cho vấn đề.",
    vocabulary: [{ hangul: "환경", meaning: "environment" },
      { hangul: "문제", meaning: "problem" },
      { hangul: "오염", meaning: "pollution" },
      { hangul: "재활용", meaning: "recycling" },
      { hangul: "쓰레기", meaning: "trash" },
      { hangul: "지구 온난화", meaning: "global warming" },
      { hangul: "에너지", meaning: "energy" },
      { hangul: "탄소 배출", meaning: "carbon emission" },
      { hangul: "자연 보호", meaning: "nature protection" },
      { hangul: "생태계", meaning: "ecosystem" }],
    sentences: [
      { korean: "환경 오염이 심각해지고 있어요.", romanized: "Hwangyeong oyeomi simgakhaejigo isseoyo.", en: "Environmental pollution is becoming serious.", vi: "Ô nhiễm môi trường đang trở nên nghiêm trọng." },
      { korean: "재활용을 생활화해야 합니다.", romanized: "Jaehwaryongeul saenghwalhwahaeya hamnida.", en: "We should make recycling a habit.", vi: "Chúng ta phải biến tái chế thành thói quen." },
      { korean: "지구 온난화를 막기 위해 노력합시다.", romanized: "Jigu onnanhwareul makgi wihae noryeokhapsida.", en: "Let's try to prevent global warming.", vi: "Hãy cùng nhau ngăn chặn nóng lên toàn cầu." },
      { korean: "탄소 배출을 줄이는 것이 중요해요.", romanized: "Tanso baechureul jurineun geosi jungyohaeyo.", en: "Reducing carbon emissions is important.", vi: "Giảm khí thải carbon là điều quan trọng." },
      { korean: "자연을 보호하는 일에 동참해 주세요.", romanized: "Jayeoneul bohohaneun ire dongchamhae juseyo.", en: "Please join in protecting nature.", vi: "Xin hãy cùng tham gia bảo vệ thiên nhiên." }
    ],
    dialogue: [{ speaker: "A", hangul: "요즘 환경 문제에 관심이 많아졌어요.", meaning: "I've become more interested in environmental issues these days." },
      { speaker: "B", hangul: "저도요. 특히 플라스틱 사용을 줄이려고 해요.", meaning: "Me too. Especially I try to reduce plastic use." },
      { speaker: "A", hangul: "재활용도 열심히 하고 있어요.", meaning: "I'm also doing recycling diligently." },
      { speaker: "B", hangul: "작은 실천이 큰 변화를 만들 수 있죠.", meaning: "Small actions can make big changes." }],
    exercises: [{ type: "fill-blank", question: "환경 ___이 심각해지고 있어요.", answer: "오염" },
      { type: "matching", pairs: [{ hangul: "재활용", meaning: "recycling" }, { hangul: "오염", meaning: "pollution" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Giảm lượng khí thải carbon là rất quan trọng.", hangul: "탄소 배출을 줄이는 것이 중요해요." }]
  },
  {
    id: 36,
level: "B1",
    title_vi: "Bày tỏ ý kiến",
    title_en: "Expressing Opinions",
    intro_vi: "Dùng 의견 cho ý kiến và 표현 cho cách diễn đạt. Học cách nêu và bảo vệ quan điểm.",
    vocabulary: [{ hangul: "의견", meaning: "opinion" },
      { hangul: "생각", meaning: "thought" },
      { hangul: "주장", meaning: "claim / argument" },
      { hangul: "근거", meaning: "evidence" },
      { hangul: "찬성하다", meaning: "to agree" },
      { hangul: "반대하다", meaning: "to disagree" },
      { hangul: "관점", meaning: "perspective" },
      { hangul: "논리", meaning: "logic" },
      { hangul: "확신", meaning: "conviction" },
      { hangul: "의문", meaning: "doubt" }],
    sentences: [
      { korean: "제 의견을 말씀드리겠습니다.", romanized: "Je uigyeoneul malsseumdeurigetseumnida.", en: "I will express my opinion.", vi: "Tôi xin nêu ý kiến của mình." },
      { korean: "저는 그 주장에 동의하지 않습니다.", romanized: "Jeoneun geu jujange donguihaji ansseumnida.", en: "I do not agree with that claim.", vi: "Tôi không đồng ý với lập luận đó." },
      { korean: "다른 관점에서 생각해 볼 필요가 있어요.", romanized: "Dareun gwanjeomeseo saenggakhae bol piryoga isseoyo.", en: "We need to think from a different perspective.", vi: "Cần suy nghĩ từ một góc nhìn khác." },
      { korean: "그 근거가 충분하다고 생각하나요?", romanized: "Geu geungeoga chungbunhadago saenggakhanayo?", en: "Do you think that evidence is sufficient?", vi: "Bạn có nghĩ căn cứ đó là đủ không?" },
      { korean: "저는 확신이 서지 않아요.", romanized: "Jeoneun hwaksini seoji anayo.", en: "I am not convinced.", vi: "Tôi không chắc chắn lắm." }
    ],
    dialogue: [{ speaker: "A", hangul: "새 정책에 대해 어떻게 생각하세요?", meaning: "What do you think about the new policy?" },
      { speaker: "B", hangul: "저는 찬성합니다. 효과적일 거예요.", meaning: "I agree. It will be effective." },
      { speaker: "A", hangul: "그런데 비용이 너무 많이 들지 않을까요?", meaning: "But won't it cost too much?" },
      { speaker: "B", hangul: "장기적으로 보면 이익이 더 클 거예요.", meaning: "In the long run, the benefits will be greater." }],
    exercises: [{ type: "fill-blank", question: "제 ___을 말씀드리겠습니다.", answer: "의견" },
      { type: "matching", pairs: [{ hangul: "찬성하다", meaning: "to agree" }, { hangul: "반대하다", meaning: "to disagree" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi không đồng ý với lập luận đó.", hangul: "저는 그 주장에 동의하지 않습니다." }]
  },
  {
    id: 37,
level: "B1",
    title_vi: "Đưa ra gợi ý",
    title_en: "Making Suggestions",
    intro_vi: "Dùng 제안 cho gợi ý. Dùng -는 게 어때요? để gợi ý.",
    vocabulary: [{ hangul: "제안", meaning: "suggestion" },
      { hangul: "추천", meaning: "recommendation" },
      { hangul: "대안", meaning: "alternative" },
      { hangul: "의견을 묻다", meaning: "to ask for opinion" },
      { hangul: "제안하다", meaning: "to suggest" },
      { hangul: "투표", meaning: "vote" },
      { hangul: "선택", meaning: "choice" },
      { hangul: "계획", meaning: "plan" },
      { hangul: "실행", meaning: "execution" },
      { hangul: "고려하다", meaning: "to consider" }],
    sentences: [
      { korean: "같이 영화 보는 게 어때요?", romanized: "Gati yeonghwa boneun ge eottaeyo?", en: "How about watching a movie together?", vi: "Cùng đi xem phim nhé?" },
      { korean: "제안이 있으신 분?", romanized: "Jeani isseusin bun?", en: "Anyone have a suggestion?", vi: "Có ai có gợi ý không?" },
      { korean: "이 대안을 고려해 보세요.", romanized: "I daeaneul goryeohae boseyo.", en: "Please consider this alternative.", vi: "Hãy cân nhắc phương án này." },
      { korean: "제가 추천하는 곳이 있어요.", romanized: "Jega chucheonhaneun gosi isseoyo.", en: "I have a recommendation.", vi: "Tôi có một địa điểm muốn giới thiệu." },
      { korean: "우선 계획을 세우는 게 좋겠어요.", romanized: "Useon gyehoegeul seuneun ge jokesseoyo.", en: "I think it would be good to make a plan first.", vi: "Tốt nhất nên lập kế hoạch trước." }
    ],
    dialogue: [{ speaker: "A", hangul: "이번 주말에 뭐 할까요?", meaning: "What shall we do this weekend?" },
      { speaker: "B", hangul: "등산 가는 게 어때요?", meaning: "How about going hiking?" },
      { speaker: "A", hangul: "좋아요! 어디로 갈까요?", meaning: "Good idea! Where shall we go?" },
      { speaker: "B", hangul: "북한산이 어때요? 경치가 좋아요.", meaning: "How about Bukhansan? The scenery is nice." }],
    exercises: [{ type: "fill-blank", question: "같이 영화 보는 게 ___?", answer: "어때요" },
      { type: "matching", pairs: [{ hangul: "제안", meaning: "suggestion" }, { hangul: "추천", meaning: "recommendation" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi đề xuất chúng ta đi leo núi.", hangul: "등산 가는 것을 제안합니다." }]
  },
  {
    id: 38,
level: "B1",
    title_vi: "Xin lỗi và biện hộ",
    title_en: "Apologizing and Making Excuses",
    intro_vi: "Dùng 사과 cho xin lỗi và 변명 cho biện hộ. Học các cách xin lỗi lịch sự.",
    vocabulary: [{ hangul: "사과", meaning: "apology" },
      { hangul: "변명", meaning: "excuse" },
      { hangul: "죄송합니다", meaning: "I'm sorry" },
      { hangul: "용서", meaning: "forgiveness" },
      { hangul: "실수", meaning: "mistake" },
      { hangul: "늦다", meaning: "to be late" },
      { hangul: "이해하다", meaning: "to understand" },
      { hangul: "다행이다", meaning: "to be relieved" },
      { hangul: "약속", meaning: "promise" },
      { hangul: "재발", meaning: "recurrence" }],
    sentences: [
      { korean: "정말 죄송합니다.", romanized: "Jeongmal joesonghamnida.", en: "I am really sorry.", vi: "Tôi thực sự xin lỗi." },
      { korean: "제 실수였어요. 용서해 주세요.", romanized: "Je silsuyeosseoyo. yongseohae juseyo.", en: "It was my mistake. Please forgive me.", vi: "Đó là lỗi của tôi. Xin tha lỗi." },
      { korean: "늦은 이유를 설명해 주세요.", romanized: "Neujeun iyureul seolmyeonghae juseyo.", en: "Please explain the reason for being late.", vi: "Xin giải thích lý do đến trễ." },
      { korean: "다시는 그러지 않겠습니다.", romanized: "Dasineun geureoji anketseumnida.", en: "I won't do that again.", vi: "Tôi sẽ không tái phạm." },
      { korean: "이해해 주셔서 감사합니다.", romanized: "Ihaehae jusyeoseo gamsahamnida.", en: "Thank you for understanding.", vi: "Cảm ơn bạn đã thông cảm." }
    ],
    dialogue: [{ speaker: "A", hangul: "어제 약속에 늦어서 정말 미안해요.", meaning: "I'm really sorry for being late to the appointment yesterday." },
      { speaker: "B", hangul: "괜찮아요. 무슨 일이 있었어요?", meaning: "It's okay. What happened?" },
      { speaker: "A", hangul: "교통이 많이 막혔어요.", meaning: "There was heavy traffic." },
      { speaker: "B", hangul: "다행히 큰 문제는 없었어요.", meaning: "Luckily, there was no big issue." }],
    exercises: [{ type: "fill-blank", question: "정말 ___합니다.", answer: "죄송" },
      { type: "matching", pairs: [{ hangul: "사과", meaning: "apology" }, { hangul: "변명", meaning: "excuse" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Đó là lỗi của tôi. Xin hãy tha thứ cho tôi.", hangul: "제 실수였어요. 용서해 주세요." }]
  },
  {
    id: 39,
level: "B1",
    title_vi: "Đưa ra lời khuyên",
    title_en: "Giving Advice",
    intro_vi: "Dùng 조언 cho lời khuyên. Dùng -는 것이 좋다 để khuyên nhủ.",
    vocabulary: [{ hangul: "조언", meaning: "advice" },
      { hangul: "충고", meaning: "counsel" },
      { hangul: "추천하다", meaning: "to recommend" },
      { hangul: "도움이 되다", meaning: "to be helpful" },
      { hangul: "경험", meaning: "experience" },
      { hangul: "조심하다", meaning: "to be careful" },
      { hangul: "노력하다", meaning: "to make an effort" },
      { hangul: "기회", meaning: "opportunity" },
      { hangul: "실패", meaning: "failure" },
      { hangul: "성공", meaning: "success" }],
    sentences: [
      { korean: "제 조언을 들어 보세요.", romanized: "Je joeoneul deureo boseyo.", en: "Listen to my advice.", vi: "Hãy nghe lời khuyên của tôi." },
      { korean: "그 일을 먼저 처리하는 것이 좋아요.", romanized: "Geu ireul meonjeo cheorihaneun geosi joayo.", en: "It's better to handle that task first.", vi: "Nên xử lý việc đó trước." },
      { korean: "실패를 두려워하지 마세요.", romanized: "Silpaereul duryeowohaji maseyo.", en: "Don't be afraid of failure.", vi: "Đừng sợ thất bại." },
      { korean: "기회가 올 때 잡으세요.", romanized: "Gihoega ol ttae jabeuseyo.", en: "Seize the opportunity when it comes.", vi: "Hãy nắm bắt cơ hội khi đến." },
      { korean: "충고를 명심하겠습니다.", romanized: "Chunggoreul myeongsimhagetseumnida.", en: "I will keep your advice in mind.", vi: "Tôi sẽ ghi nhớ lời khuyên." }
    ],
    dialogue: [{ speaker: "A", hangul: "한국어 공부가 어려워요. 조언 좀 해 주세요.", meaning: "Studying Korean is difficult. Please give me some advice." },
      { speaker: "B", hangul: "매일 조금씩 꾸준히 공부하는 게 좋아요.", meaning: "It's good to study a little bit every day consistently." },
      { speaker: "A", hangul: "듣기 실력을 어떻게 늘릴까요?", meaning: "How can I improve my listening skills?" },
      { speaker: "B", hangul: "한국 드라마를 보는 것도 도움이 돼요.", meaning: "Watching Korean dramas also helps." }],
    exercises: [{ type: "fill-blank", question: "제 ___을 들어 보세요.", answer: "조언" },
      { type: "matching", pairs: [{ hangul: "조언", meaning: "advice" }, { hangul: "충고", meaning: "counsel" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ ghi nhớ lời khuyên của bạn.", hangul: "충고를 명심하겠습니다." }]
  },
  {
    id: 40,
level: "B1",
    title_vi: "Kể trải nghiệm",
    title_en: "Describing Experiences",
    intro_vi: "Dùng 경험 cho trải nghiệm. Dùng -아/어 보다 cho việc đã từng làm.",
    vocabulary: [{ hangul: "경험", meaning: "experience" },
      { hangul: "여행", meaning: "trip" },
      { hangul: "체험", meaning: "hands-on experience" },
      { hangul: "도전", meaning: "challenge" },
      { hangul: "즐기다", meaning: "to enjoy" },
      { hangul: "배우다", meaning: "to learn" },
      { hangul: "기억", meaning: "memory" },
      { hangul: "인상적이다", meaning: "impressive" },
      { hangul: "처음", meaning: "first time" },
      { hangul: "느끼다", meaning: "to feel" }],
    sentences: [
      { korean: "한국에 처음 왔을 때가 기억나요.", romanized: "Hanguge cheoeum wasseul ttaega gieoknayo.", en: "I remember the first time I came to Korea.", vi: "Tôi nhớ lần đầu đến Hàn Quốc." },
      { korean: "김치를 처음 먹어 봤어요.", romanized: "Gimchireul cheoeum meogeo bwasseoyo.", en: "I tried kimchi for the first time.", vi: "Tôi đã thử ăn kimchi lần đầu." },
      { korean: "그 경험은 정말 인상적이었어요.", romanized: "Geu gyeongheomeun jeongmal insangjeogieosseoyo.", en: "That experience was really impressive.", vi: "Trải nghiệm đó thực sự ấn tượng." },
      { korean: "여행하면서 많은 것을 배웠어요.", romanized: "Yeohaenghamyeonseo maneun geoseul baewosseoyo.", en: "I learned a lot while traveling.", vi: "Tôi học được nhiều điều khi đi du lịch." },
      { korean: "새로운 도전을 즐기는 편이에요.", romanized: "Saeroun dojeoneul jeulgineun pyeonieyo.", en: "I tend to enjoy new challenges.", vi: "Tôi thích đón nhận thử thách mới." }
    ],
    dialogue: [{ speaker: "A", hangul: "제주도에 가 본 적 있어요?", meaning: "Have you ever been to Jeju Island?" },
      { speaker: "B", hangul: "네, 작년에 다녀왔어요. 정말 아름다웠어요.", meaning: "Yes, I went last year. It was really beautiful." },
      { speaker: "A", hangul: "무엇이 가장 기억에 남나요?", meaning: "What is most memorable?" },
      { speaker: "B", hangul: "한라산 등반이 가장 인상 깊었어요.", meaning: "Climbing Hallasan was the most impressive." }],
    exercises: [{ type: "fill-blank", question: "김치를 처음 ___ 봤어요.", answer: "먹어" },
      { type: "matching", pairs: [{ hangul: "경험", meaning: "experience" }, { hangul: "체험", meaning: "hands-on experience" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Trải nghiệm đó thực sự ấn tượng.", hangul: "그 경험은 정말 인상적이었어요." }]
  },
  {
    id: 41,
level: "B1",
    title_vi: "So sánh các lựa chọn",
    title_en: "Comparing Options",
    intro_vi: "Dùng 비교 cho so sánh. Dùng -보다 더 cho 'hơn'.",
    vocabulary: [{ hangul: "비교", meaning: "comparison" },
      { hangul: "옵션", meaning: "option" },
      { hangul: "선택", meaning: "choice" },
      { hangul: "장점", meaning: "advantage" },
      { hangul: "단점", meaning: "disadvantage" },
      { hangul: "비슷하다", meaning: "similar" },
      { hangul: "다르다", meaning: "different" },
      { hangul: "저렴하다", meaning: "cheap" },
      { hangul: "비싸다", meaning: "expensive" },
      { hangul: "효율적", meaning: "efficient" }],
    sentences: [
      { korean: "이 옵션과 저 옵션을 비교해 보세요.", romanized: "I opsyeongwa jeo opsyeoneul bigyohae boseyo.", en: "Compare this option and that option.", vi: "Hãy so sánh phương án này với phương án kia." },
      { korean: "이 제품이 더 저렴하지만 품질은 비슷해요.", romanized: "I jepumi deo jeoryeomhajiman pumjireun biseuthaeyo.", en: "This product is cheaper, but quality is similar.", vi: "Sản phẩm này rẻ hơn nhưng chất lượng tương tự." },
      { korean: "장점과 단점을 따져 봐야 해요.", romanized: "Jangjeomgwa danjeomeul ttajyeo bwaya haeyo.", en: "We need to weigh the pros and cons.", vi: "Cần cân nhắc ưu và nhược điểm." },
      { korean: "어느 것이 더 효율적이라고 생각하세요?", romanized: "Eoneu geosi deo hyoyuljeogirago saenggakhaseyo?", en: "Which one do you think is more efficient?", vi: "Bạn nghĩ cái nào hiệu quả hơn?" },
      { korean: "비교 결과가 흥미로웠어요.", romanized: "Bigyo gyeolgwaga heungmirowosseoyo.", en: "The comparison result was interesting.", vi: "Kết quả so sánh rất thú vị." }
    ],
    dialogue: [{ speaker: "A", hangul: "이 핸드폰과 저 핸드폰 중에 뭐가 더 좋아요?", meaning: "Between this phone and that phone, which is better?" },
      { speaker: "B", hangul: "이쪽이 카메라가 더 좋지만 배터리는 짧아요.", meaning: "This one has a better camera but shorter battery." },
      { speaker: "A", hangul: "가격은 비슷한가요?", meaning: "Are the prices similar?" },
      { speaker: "B", hangul: "아니요, 이게 조금 더 비싸요.", meaning: "No, this one is a bit more expensive." }],
    exercises: [{ type: "fill-blank", question: "이 옵션과 저 옵션을 ___해 보세요.", answer: "비교" },
      { type: "matching", pairs: [{ hangul: "장점", meaning: "advantage" }, { hangul: "단점", meaning: "disadvantage" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Chúng ta cần cân nhắc ưu và nhược điểm.", hangul: "장점과 단점을 따져 봐야 해요." }]
  },
  {
    id: 42,
level: "B1",
    title_vi: "Tình huống giả định",
    title_en: "Hypothetical Situations",
    intro_vi: "Dùng 가상 cho giả định. Dùng -면 -을 텐데 cho giả định có điều kiện.",
    vocabulary: [{ hangul: "가상", meaning: "hypothetical" },
      { hangul: "상황", meaning: "situation" },
      { hangul: "만약", meaning: "if" },
      { hangul: "가정하다", meaning: "to assume" },
      { hangul: "상상", meaning: "imagination" },
      { hangul: "현실", meaning: "reality" },
      { hangul: "가능성", meaning: "possibility" },
      { hangul: "꿈", meaning: "dream" },
      { hangul: "소원", meaning: "wish" },
      { hangul: "행동", meaning: "action" }],
    sentences: [
      { korean: "만약 내가 백만장자라면 무엇을 할까?", romanized: "Manyak naega baekmanjangjaramyeon mueoseul halkka?", en: "If I were a millionaire, what would I do?", vi: "Nếu tôi là triệu phú, tôi sẽ làm gì?" },
      { korean: "그 상황이 현실이라면 어쩌겠어요?", romanized: "Geu sanghwangi hyeonsiriramyeon eojjeogesseoyo?", en: "If that situation were real, what would you do?", vi: "Nếu tình huống đó là thật, bạn sẽ làm gì?" },
      { korean: "가상의 시나리오를 생각해 봅시다.", romanized: "Gasangui sinarioreul saenggakhae bopsida.", en: "Let's think of a hypothetical scenario.", vi: "Hãy nghĩ về một kịch bản giả định." },
      { korean: "소원이 이루어진다면 가장 먼저 뭘 하고 싶어요?", romanized: "Sowoni irueojindamyeon gajang meonjeo mwol hago sipeoyo?", en: "If your wish came true, what would you want to do first?", vi: "Nếu điều ước thành sự thật, bạn muốn làm gì đầu tiên?" },
      { korean: "꿈을 쫓는 것이 중요해요.", romanized: "Kkumeul jjotneun geosi jungyohaeyo.", en: "It's important to chase your dreams.", vi: "Theo đuổi ước mơ là điều quan trọng." }
    ],
    dialogue: [{ speaker: "A", hangul: "만약 시간을 되돌릴 수 있다면 뭘 하고 싶어요?", meaning: "If you could turn back time, what would you want to do?" },
      { speaker: "B", hangul: "더 열심히 공부할 거예요.", meaning: "I would study harder." },
      { speaker: "A", hangul: "저도요. 후회되는 일이 있어요.", meaning: "Me too. I have some regrets." },
      { speaker: "B", hangul: "하지만 과거는 바꿀 수 없으니 미래를 위해 노력합시다.", meaning: "But we can't change the past, so let's work for the future." }],
    exercises: [{ type: "fill-blank", question: "___ 내가 백만장자라면 무엇을 할까?", answer: "만약" },
      { type: "matching", pairs: [{ hangul: "가상", meaning: "hypothetical" }, { hangul: "상상", meaning: "imagination" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Nếu tôi có thể quay ngược thời gian, tôi sẽ học chăm chỉ hơn.", hangul: "만약 시간을 되돌릴 수 있다면 더 열심히 공부할 거예요." }]
  },
  {
    id: 43,
level: "B1",
    title_vi: "Tường thuật lời nói",
    title_en: "Reporting Speech",
    intro_vi: "Dùng 전달 화법 cho lời nói tường thuật. Học các mẫu -다고 하다 và -라고 하다.",
    vocabulary: [{ hangul: "전달", meaning: "report / delivery" },
      { hangul: "화법", meaning: "speech style" },
      { hangul: "인용", meaning: "quotation" },
      { hangul: "직접 화법", meaning: "direct speech" },
      { hangul: "간접 화법", meaning: "indirect speech" },
      { hangul: "말하다", meaning: "to say" },
      { hangul: "주장하다", meaning: "to claim" },
      { hangul: "묻다", meaning: "to ask" },
      { hangul: "대답하다", meaning: "to answer" },
      { hangul: "전하다", meaning: "to convey" }],
    sentences: [
      { korean: "그가 내일 올 거라고 했어요.", romanized: "Geuga naeil ol georago haesseoyo.", en: "He said he would come tomorrow.", vi: "Anh ấy nói sẽ đến vào ngày mai." },
      { korean: "그녀는 자기는 배고프지 않다고 말했어요.", romanized: "Geunyeoneun jagineun baegopeuji antago malhaesseoyo.", en: "She said she was not hungry.", vi: "Cô ấy nói rằng cô ấy không đói." },
      { korean: "선생님께서 숙제를 내일까지 하라고 하셨어요.", romanized: "Seonsaengnimkkeseo sukjereul naeilkkaji harago hasyeosseoyo.", en: "The teacher told us to do the homework by tomorrow.", vi: "Thầy bảo phải làm bài tập đến ngày mai." },
      { korean: "그가 뭐라고 했어요?", romanized: "Geuga mworago haesseoyo?", en: "What did he say?", vi: "Anh ấy đã nói gì?" },
      { korean: "그 소식을 친구에게 전했어요.", romanized: "Geu sosigeul chinguege jeonhaesseoyo.", en: "I conveyed the news to my friend.", vi: "Tôi đã chuyển tin đó cho bạn." }
    ],
    dialogue: [{ speaker: "A", hangul: "민수가 뭐라고 했어요?", meaning: "What did Minsu say?" },
      { speaker: "B", hangul: "내일 시간이 안 된다고 했어요.", meaning: "He said he doesn't have time tomorrow." },
      { speaker: "A", hangul: "그럼 모레는 괜찮다고 물어봐 주세요.", meaning: "Then please ask if the day after tomorrow is okay." },
      { speaker: "B", hangul: "알겠어요. 전해 줄게요.", meaning: "Okay. I'll pass it on." }],
    exercises: [{ type: "fill-blank", question: "그가 내일 올 ___고 했어요.", answer: "거라" },
      { type: "matching", pairs: [{ hangul: "직접 화법", meaning: "direct speech" }, { hangul: "간접 화법", meaning: "indirect speech" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Cô ấy nói rằng cô ấy không đói.", hangul: "그녀는 자기는 배고프지 않다고 말했어요." }]
  },
  {
    id: 44,
level: "B1",
    title_vi: "Câu bị động",
    title_en: "Passive Voice",
    intro_vi: "Dùng 수동태 cho câu bị động. Học các đuôi bị động như -이/히/리/기-.",
    vocabulary: [{ hangul: "수동태", meaning: "passive voice" },
      { hangul: "능동태", meaning: "active voice" },
      { hangul: "동사", meaning: "verb" },
      { hangul: "주어", meaning: "subject" },
      { hangul: "목적어", meaning: "object" },
      { hangul: "쓰이다", meaning: "to be used" },
      { hangul: "열리다", meaning: "to be opened" },
      { hangul: "닫히다", meaning: "to be closed" },
      { hangul: "만들어지다", meaning: "to be made" },
      { hangul: "알려지다", meaning: "to be known" }],
    sentences: [
      { korean: "이 문은 아침 9시에 열립니다.", romanized: "I muneun achim 9sie yeolrimnida.", en: "This door is opened at 9 AM.", vi: "Cánh cửa này được mở lúc 9 giờ sáng." },
      { korean: "한국어가 세계에서 많이 쓰이고 있어요.", romanized: "Hangugeoga segyeeseo mani sseuigo isseoyo.", en: "Korean is being used a lot in the world.", vi: "Tiếng Hàn đang được sử dụng nhiều trên thế giới." },
      { korean: "그 소식은 금방 알려졌어요.", romanized: "Geu sosigeun geumbang alryeojyeosseoyo.", en: "That news was quickly known.", vi: "Tin đó nhanh chóng được biết đến." },
      { korean: "이 빵은 밀가루로 만들어져요.", romanized: "I ppangeun milgaruro mandeureojyeoyo.", en: "This bread is made from flour.", vi: "Bánh mì này được làm từ bột mì." },
      { korean: "창문이 닫혀 있어요.", romanized: "Changmuni dathyeo isseoyo.", en: "The window is closed.", vi: "Cửa sổ đang đóng." }
    ],
    dialogue: [{ speaker: "A", hangul: "이 건물은 언제 지어졌어요?", meaning: "When was this building built?" },
      { speaker: "B", hangul: "10년 전에 지어졌어요.", meaning: "It was built 10 years ago." },
      { speaker: "A", hangul: "누구에 의해 설계되었나요?", meaning: "By whom was it designed?" },
      { speaker: "B", hangul: "유명한 건축가에 의해 설계되었어요.", meaning: "It was designed by a famous architect." }],
    exercises: [{ type: "fill-blank", question: "이 문은 아침 9시에 ___.", answer: "열립니다" },
      { type: "matching", pairs: [{ hangul: "열리다", meaning: "to be opened" }, { hangul: "닫히다", meaning: "to be closed" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tin tức đó nhanh chóng được biết đến.", hangul: "그 소식은 금방 알려졌어요." }]
  },
  {
    id: 45,
level: "B1",
    title_vi: "Mệnh đề quan hệ",
    title_en: "Relative Clauses",
    intro_vi: "Dùng 관형사절 cho mệnh đề quan hệ. Học -는, -은, -을 để bổ nghĩa danh từ.",
    vocabulary: [{ hangul: "관형사절", meaning: "relative clause" },
      { hangul: "수식", meaning: "modification" },
      { hangul: "명사", meaning: "noun" },
      { hangul: "관형사", meaning: "determiner" },
      { hangul: "형용사", meaning: "adjective" },
      { hangul: "현재", meaning: "present tense" },
      { hangul: "과거", meaning: "past tense" },
      { hangul: "미래", meaning: "future tense" },
      { hangul: "연결", meaning: "connection" },
      { hangul: "관계", meaning: "relation" }],
    sentences: [
      { korean: "제가 산 책이 재미있어요.", romanized: "Jega san chaegi jaemiisseoyo.", en: "The book that I bought is interesting.", vi: "Quyển sách tôi mua rất hay." },
      { korean: "한국어를 배우는 사람이 많아요.", romanized: "Hangugeoreul baeuneun sarami manayo.", en: "There are many people who learn Korean.", vi: "Có nhiều người học tiếng Hàn." },
      { korean: "어제 만난 친구가 전화했어요.", romanized: "Eoje mannan chinguga jeonhwahaesseoyo.", en: "The friend I met yesterday called.", vi: "Người bạn tôi gặp hôm qua đã gọi điện." },
      { korean: "먹을 음식을 준비할게요.", romanized: "Meogeul eumsigeul junbihalgeyo.", en: "I will prepare food to eat.", vi: "Tôi sẽ chuẩn bị thức ăn để ăn." },
      { korean: "그가 쓴 편지를 읽었어요.", romanized: "Geuga sseun pyeonjireul ilgeosseoyo.", en: "I read the letter that he wrote.", vi: "Tôi đọc lá thư anh ấy viết." }
    ],
    dialogue: [{ speaker: "A", hangul: "어제 산 치마가 마음에 들어요?", meaning: "Do you like the skirt you bought yesterday?" },
      { speaker: "B", hangul: "네, 그런데 좀 작아요.", meaning: "Yes, but it's a bit small." },
      { speaker: "A", hangul: "다른 색으로 교환할 수 있어요.", meaning: "You can exchange it for another color." },
      { speaker: "B", hangul: "괜찮아요. 그냥 입을게요.", meaning: "It's okay. I'll just wear it." }],
    exercises: [{ type: "fill-blank", question: "제가 ___ 책이 재미있어요.", answer: "산" },
      { type: "matching", pairs: [{ hangul: "현재", meaning: "present tense" }, { hangul: "과거", meaning: "past tense" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Có nhiều người học tiếng Hàn.", hangul: "한국어를 배우는 사람이 많아요." }]
  },
  {
    id: 46,
level: "B2",
    title_vi: "Câu điều kiện",
    title_en: "Conditional Sentences",
    intro_vi: "Dùng 조건문 cho câu điều kiện. Học các mẫu -면 và -으면.",
    vocabulary: [{ hangul: "조건", meaning: "condition" },
      { hangul: "가정", meaning: "assumption" },
      { hangul: "결과", meaning: "result" },
      { hangul: "인과", meaning: "causation" },
      { hangul: "필요", meaning: "necessity" },
      { hangul: "충족", meaning: "satisfaction" },
      { hangul: "만약", meaning: "if" },
      { hangul: "그러면", meaning: "then" },
      { hangul: "아니면", meaning: "otherwise" },
      { hangul: "때문에", meaning: "because" }],
    sentences: [
      { korean: "비가 오면 집에 있을 거예요.", romanized: "Biga omyeon jibe isseul geoyeyo.", en: "If it rains, I will stay home.", vi: "Nếu trời mưa, tôi sẽ ở nhà." },
      { korean: "시간이 있으면 같이 가자.", romanized: "Sigani isseumyeon gati gaja.", en: "If you have time, let's go together.", vi: "Nếu bạn có thời gian, hãy cùng đi." },
      { korean: "열심히 공부하면 합격할 수 있어요.", romanized: "Yeolsimhi gongbuhamyeon hapgyeokhal su isseoyo.", en: "If you study hard, you can pass.", vi: "Nếu học chăm chỉ, bạn sẽ đỗ." },
      { korean: "돈이 많으면 여행을 갈 텐데.", romanized: "Doni maneumyeon yeohaengeul gal tende.", en: "If I had a lot of money, I would travel.", vi: "Nếu có nhiều tiền, tôi sẽ đi du lịch." },
      { korean: "늦으면 먼저 가도 돼요.", romanized: "Neujeumyeon meonjeo gado dwaeyo.", en: "If you are late, you can go ahead.", vi: "Nếu trễ thì cứ đi trước cũng được." }
    ],
    dialogue: [{ speaker: "A", hangul: "내일 날씨가 좋으면 소풍 갈까요?", meaning: "If the weather is nice tomorrow, shall we go on a picnic?" },
      { speaker: "B", hangul: "좋아요. 그런데 비가 오면 어쩌죠?", meaning: "Good. But what if it rains?" },
      { speaker: "A", hangul: "그러면 영화관에 가요.", meaning: "Then let's go to the cinema." },
      { speaker: "B", hangul: "좋은 생각이에요!", meaning: "Good idea!" }],
    exercises: [{ type: "fill-blank", question: "비가 오면 집에 ___ 거예요.", answer: "있을" },
      { type: "matching", pairs: [{ hangul: "조건", meaning: "condition" }, { hangul: "결과", meaning: "result" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Nếu bạn học chăm chỉ, bạn có thể đỗ.", hangul: "열심히 공부하면 합격할 수 있어요." }]
  },
  {
    id: 47,
level: "B2",
    title_vi: "Thành ngữ",
    title_en: "Idiomatic Expressions",
    intro_vi: "Dùng 관용 표현 cho thành ngữ. Học các thành ngữ Hàn Quốc thông dụng.",
    vocabulary: [{ hangul: "관용 표현", meaning: "idiomatic expression" },
      { hangul: "속담", meaning: "proverb" },
      { hangul: "뜻", meaning: "meaning" },
      { hangul: "비유", meaning: "metaphor" },
      { hangul: "눈이 높다", meaning: "to have high standards (lit. eyes are high)" },
      { hangul: "입이 짧다", meaning: "to eat little (lit. mouth is short)" },
      { hangul: "발이 넓다", meaning: "to have many connections (lit. feet are wide)" },
      { hangul: "손이 크다", meaning: "to be generous (lit. hand is big)" },
      { hangul: "고생 끝에 낙이 온다", meaning: "after hardship comes happiness" },
      { hangul: "시작이 반이다", meaning: "well begun is half done" }],
    sentences: [
      { korean: "그 사람은 눈이 높아서 쉽게 사귀지 않아요.", romanized: "Geu sarameun nuni nopaseo swipge sagwiji anayo.", en: "He has high standards so he doesn't date easily.", vi: "Người đó kén chọn nên không dễ kết bạn." },
      { korean: "아기가 입이 짧아서 걱정이에요.", romanized: "Agiga ibi jjalbaseo geokjeongieyo.", en: "I'm worried because the baby eats very little.", vi: "Tôi lo vì em bé ăn ít quá." },
      { korean: "그녀는 발이 넓어서 아는 사람이 많아요.", romanized: "Geunyeoneun bari neolbeoseo aneun sarami manayo.", en: "She has many connections and knows many people.", vi: "Cô ấy quen biết rộng nên có nhiều bạn bè." },
      { korean: "할머니는 손이 크셔서 항상 많이 주세요.", romanized: "Halmeonineun soni keusyeoseo hangsang mani juseyo.", en: "Grandma is generous and always gives a lot.", vi: "Bà tôi rộng rãi nên luôn cho rất nhiều." },
      { korean: "힘들지만 고생 끝에 낙이 온다고 했어요.", romanized: "Himdeuljiman gosaeng kkeute nagi ondago haesseoyo.", en: "It's hard, but they say after hardship comes happiness.", vi: "Vất vả nhưng người ta nói khổ tận cam lai." }
    ],
    dialogue: [{ speaker: "A", hangul: "시험 준비가 너무 힘들어요.", meaning: "Preparing for the exam is so hard." },
      { speaker: "B", hangul: "시작이 반이잖아요. 이미 절반은 한 거예요.", meaning: "Well begun is half done. You've already done half." },
      { speaker: "A", hangul: "맞아요. 포기하지 말아야겠어요.", meaning: "That's right. I shouldn't give up." },
      { speaker: "B", hangul: "힘내세요! 고생 끝에 낙이 올 거예요.", meaning: "Cheer up! After hardship comes happiness." }],
    exercises: [{ type: "fill-blank", question: "그 사람은 ___이 높아요.", answer: "눈" },
      { type: "matching", pairs: [{ hangul: "손이 크다", meaning: "to be generous" }, { hangul: "입이 짧다", meaning: "to eat little" }],
 instruction: "Match Korean idioms with meanings" },
      { type: "translation", vietnamese: "Sau khó khăn sẽ đến hạnh phúc.", hangul: "고생 끝에 낙이 온다." }]
  },
  {
    id: 48,
level: "B2",
    title_vi: "Tiếng lóng và khẩu ngữ",
    title_en: "Slang and Colloquial",
    intro_vi: "Học tiếng lóng và khẩu ngữ Hàn Quốc. Dùng 속어 cho tiếng lóng và 구어체 cho khẩu ngữ.",
    vocabulary: [{ hangul: "속어", meaning: "slang" },
      { hangul: "구어체", meaning: "colloquial style" },
      { hangul: "대박", meaning: "awesome / jackpot" },
      { hangul: "헐", meaning: "whoa / oh my" },
      { hangul: "진짜", meaning: "really" },
      { hangul: "짱", meaning: "best / awesome" },
      { hangul: "존맛", meaning: "so delicious" },
      { hangul: "꿀잼", meaning: "so fun" },
      { hangul: "노잼", meaning: "boring" },
      { hangul: "안녕", meaning: "hi (informal)" }],
    sentences: [
      { korean: "와, 대박! 이거 진짜 좋다.", romanized: "Wa, daebak! igeo jinjja jota.", en: "Wow, awesome! This is really good.", vi: "Wow, đỉnh quá! Cái này thực sự tuyệt." },
      { korean: "헐, 그거 완전 꿀잼이야!", romanized: "Heol, geugeo wanjeon kkuljaemiya!", en: "Whoa, that's so fun!", vi: "Trời, vui khủng khiếp luôn!" },
      { korean: "이 음식 존맛이야.", romanized: "I eumsik jonmasiya.", en: "This food is so delicious.", vi: "Món này ngon kinh khủng." },
      { korean: "오늘 수업 노잼이었어.", romanized: "Oneul sueop nojaemieosseo.", en: "Today's class was boring.", vi: "Tiết học hôm nay chán òm." },
      { korean: "그 영화 짱이야. 꼭 봐.", romanized: "Geu yeonghwa jjangiya. kkok bwa.", en: "That movie is the best. You must watch it.", vi: "Phim đó đỉnh lắm. Nhất định phải xem." }
    ],
    dialogue: [{ speaker: "A", hangul: "어제 놀이동산 갔어? 어땠어?", meaning: "Did you go to the amusement park yesterday? How was it?" },
      { speaker: "B", hangul: "대박! 완전 꿀잼이었어.", meaning: "Awesome! It was so fun." },
      { speaker: "A", hangul: "진짜? 나도 가고 싶다.", meaning: "Really? I want to go too." },
      { speaker: "B", hangul: "다음에 같이 가자!", meaning: "Let's go together next time!" }],
    exercises: [{ type: "fill-blank", question: "와, ___! 이거 진짜 좋다.", answer: "대박" },
      { type: "matching", pairs: [{ hangul: "꿀잼", meaning: "so fun" }, { hangul: "노잼", meaning: "boring" }],
 instruction: "Match Korean slang with English" },
      { type: "translation", vietnamese: "Món ăn này ngon tuyệt.", hangul: "이 음식 존맛이야." }]
  },
  {
    id: 49,
level: "B2",
    title_vi: "Kỹ năng tranh luận",
    title_en: "Debating Skills",
    intro_vi: "Dùng 토론 cho tranh luận. Học cách lập luận thuyết phục và phản bác.",
    vocabulary: [{ hangul: "토론", meaning: "debate" },
      { hangul: "논쟁", meaning: "argument" },
      { hangul: "주제", meaning: "topic" },
      { hangul: "반론", meaning: "counterargument" },
      { hangul: "증거", meaning: "evidence" },
      { hangul: "논리", meaning: "logic" },
      { hangul: "설득하다", meaning: "to persuade" },
      { hangul: "청중", meaning: "audience" },
      { hangul: "판사", meaning: "judge" },
      { hangul: "승리", meaning: "victory" }],
    sentences: [
      { korean: "오늘 토론 주제는 '원격 수업의 장단점'입니다.", romanized: "Oneul toron jujeneun 'wongyeok sueobui jangdanjeom'imnida.", en: "Today's debate topic is 'Pros and cons of online classes'.", vi: "Chủ đề tranh luận hôm nay là 'Ưu nhược điểm của lớp học từ xa'." },
      { korean: "제 반론을 말씀드리겠습니다.", romanized: "Je banroneul malsseumdeurigetseumnida.", en: "I will present my counterargument.", vi: "Tôi xin trình bày phản biện." },
      { korean: "그 주장을 뒷받침할 증거가 있나요?", romanized: "Geu jujangeul dwitbatchimhal jeunggeoga itnayo?", en: "Is there evidence to support that claim?", vi: "Có bằng chứng nào hỗ trợ lập luận đó không?" },
      { korean: "논리가 타당하지 않습니다.", romanized: "Nonriga tadanghaji ansseumnida.", en: "The logic is not valid.", vi: "Logic không hợp lý." },
      { korean: "청중을 설득하는 것이 중요해요.", romanized: "Cheongjungeul seoldeukhaneun geosi jungyohaeyo.", en: "Persuading the audience is important.", vi: "Thuyết phục khán giả là điều quan trọng." }
    ],
    dialogue: [{ speaker: "A", hangul: "저는 원격 수업이 더 효율적이라고 생각합니다.", meaning: "I think online classes are more efficient." },
      { speaker: "B", hangul: "하지만 집중하기 어렵다는 문제가 있어요.", meaning: "But there is the problem of difficulty concentrating." },
      { speaker: "A", hangul: "그건 개인의 차이라고 봅니다.", meaning: "I see that as an individual difference." },
      { speaker: "B", hangul: "통계를 보면 오히려 학습 효과가 떨어진다는 결과가 있어요.", meaning: "Statistics show that learning effectiveness actually decreases." }],
    exercises: [{ type: "fill-blank", question: "오늘 ___ 주제는 '원격 수업의 장단점'입니다.", answer: "토론" },
      { type: "matching", pairs: [{ hangul: "반론", meaning: "counterargument" }, { hangul: "증거", meaning: "evidence" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Lập luận đó không có tính logic.", hangul: "그 논리가 타당하지 않습니다." }]
  },
  {
    id: 50,
level: "B2",
    title_vi: "Ôn tập tổng hợp cuối khóa",
    title_en: "Final Comprehensive Review",
    intro_vi: "Ôn tập toàn bộ ngữ pháp và từ vựng từ bài 21-49. Luyện tập kỹ năng tổng hợp.",
    vocabulary: [{ hangul: "종합", meaning: "comprehensive" },
      { hangul: "복습", meaning: "review" },
      { hangul: "확인", meaning: "check" },
      { hangul: "평가", meaning: "evaluation" },
      { hangul: "정리", meaning: "summary" },
      { hangul: "연습", meaning: "practice" },
      { hangul: "강화", meaning: "reinforcement" },
      { hangul: "자신감", meaning: "confidence" },
      { hangul: "목표", meaning: "goal" },
      { hangul: "달성", meaning: "achievement" }],
    sentences: [
      { korean: "오늘은 지금까지 배운 내용을 총정리하겠습니다.", romanized: "Oneureun jigeumkkaji baeun naeyongeul chongjeongrihagetseumnida.", en: "Today we will summarize everything learned so far.", vi: "Hôm nay chúng ta sẽ tổng kết tất cả nội dung đã học." },
      { korean: "이 표현을 사용해서 문장을 만들어 보세요.", romanized: "I pyohyeoneul sayonghaeseo munjangeul mandeureo boseyo.", en: "Try making a sentence using this expression.", vi: "Hãy thử đặt câu sử dụng cách diễn đạt này." },
      { korean: "틀린 부분을 다시 확인해 보세요.", romanized: "Teulrin bubuneul dasi hwaginhae boseyo.", en: "Please check the incorrect parts again.", vi: "Xin kiểm tra lại phần sai." },
      { korean: "실전에서 자신 있게 사용할 수 있을 거예요.", romanized: "Siljeoneseo jasin itge sayonghal su isseul geoyeyo.", en: "You will be able to use it confidently in real situations.", vi: "Bạn sẽ có thể tự tin sử dụng trong tình huống thực tế." },
      { korean: "목표를 달성하기 위해 계속 노력합시다.", romanized: "Mokpyoreul dalseonghagi wihae gyesok noryeokhapsida.", en: "Let's keep working to achieve our goals.", vi: "Hãy cùng nỗ lực để đạt được mục tiêu." }
    ],
    dialogue: [{ speaker: "A", hangul: "드디어 마지막 수업이네요. 많이 배웠어요.", meaning: "Finally the last lesson. I learned a lot." },
      { speaker: "B", hangul: "맞아요. 이제 한국어로 대화하는 게 더 편해졌어요.", meaning: "Right. Now it's more comfortable to converse in Korean." },
      { speaker: "A", hangul: "앞으로도 꾸준히 공부할 거예요.", meaning: "I will continue to study steadily." },
      { speaker: "B", hangul: "화이팅! 함께 힘내요!", meaning: "Fighting! Let's cheer together!" }],
    exercises: [{ type: "fill-blank", question: "오늘은 지금까지 배운 내용을 ___하겠습니다.", answer: "총정리" },
      { type: "matching", pairs: [{ hangul: "복습", meaning: "review" }, { hangul: "평가", meaning: "evaluation" }],
 instruction: "Match Korean with English" },
      { type: "translation", vietnamese: "Tôi sẽ tiếp tục học tiếng Hàn một cách đều đặn.", hangul: "앞으로도 꾸준히 한국어를 공부할 거예요." }]
  }
];
