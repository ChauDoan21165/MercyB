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
  },
  {
    id: 51,
    level: "B2",
    title_vi: "Báo nghỉ việc với sếp",
    title_en: "Telling your boss you're resigning",
    intro_vi:
      "Cuộc trò chuyện cao điểm áp lực với sếp Hàn Quốc khi báo nghỉ việc. Toàn bộ phải dùng 하십시오체 (cấp kính ngữ cao nhất). Tập trung vào câu mở đầu, lý do tích cực, và cam kết bàn giao chu đáo — ba yếu tố quyết định bạn ra đi 'đẹp' hay 'xấu'.",

    vocabulary: [
      { hangul: "사직", meaning: "resignation" },
      { hangul: "사직서", meaning: "resignation letter" },
      { hangul: "퇴사", meaning: "leaving the company" },
      { hangul: "인수인계", meaning: "handover (of work)" },
      { hangul: "결정", meaning: "decision" },
      { hangul: "진심으로", meaning: "sincerely / from the heart" },
      { hangul: "새로운 도전", meaning: "new challenge" },
      { hangul: "마지막 근무일", meaning: "last working day" },
      { hangul: "양해", meaning: "understanding (asking for)" },
      { hangul: "후임자", meaning: "successor / replacement" },
    ],

    sentences: [
      {
        korean: "부장님, 잠시 시간 괜찮으십니까?",
        romanized: "Bujangnim, jamsi sigan gwaenchanseusimnikka?",
        en: "Director, do you have a moment?",
        vi: "Sếp, sếp có chút thời gian không ạ?",
      },
      {
        korean: "오랜 고민 끝에 사직하기로 결정했습니다.",
        romanized: "Oraen gomin kkeute sajikhagiro gyeoljeonghaesseumnida.",
        en: "After long consideration, I have decided to resign.",
        vi: "Sau thời gian dài cân nhắc, tôi đã quyết định nghỉ việc.",
      },
      {
        korean: "새로운 도전을 시작하기 위해 떠나려고 합니다.",
        romanized: "Saeroun dojeoneul sijakhagi wihae tteonaryeogo hamnida.",
        en: "I am leaving to begin a new challenge.",
        vi: "Tôi sẽ rời đi để bắt đầu một thử thách mới.",
      },
      {
        korean: "인수인계는 철저히 하겠습니다.",
        romanized: "Insuingyeneun cheoljeohi hagetseumnida.",
        en: "I will do the handover thoroughly.",
        vi: "Tôi sẽ bàn giao công việc thật chu đáo.",
      },
      {
        korean: "그동안 정말 감사드립니다.",
        romanized: "Geudongan jeongmal gamsadeurimnida.",
        en: "Thank you sincerely for all this time.",
        vi: "Suốt thời gian qua tôi thực sự rất biết ơn.",
      },
    ],

    dialogue: [
      { speaker: "A", hangul: "부장님, 잠시 시간 괜찮으십니까? 드릴 말씀이 있어서요.", meaning: "Director, do you have a moment? I have something to tell you." },
      { speaker: "B", hangul: "네, 들어오세요. 무슨 일이세요?", meaning: "Yes, come in. What is it?" },
      { speaker: "A", hangul: "죄송합니다만, 사직 의사를 전해 드리고자 합니다.", meaning: "I'm sorry to say, but I would like to inform you of my intent to resign." },
      { speaker: "B", hangul: "갑작스럽군요. 자세히 이야기 좀 해 주세요.", meaning: "That's sudden. Please tell me more in detail." },
    ],

    dialogue_long: [
      { speaker: "A", hangul: "부장님, 잠시 시간 괜찮으십니까? 드릴 말씀이 있어서요.", meaning: "Director, do you have a moment? I have something to tell you.", vi: "Sếp, sếp có chút thời gian không ạ? Tôi có chuyện muốn thưa." },
      { speaker: "B", hangul: "네, 들어오세요. 무슨 일이세요?", meaning: "Yes, come in. What is it?", vi: "Vâng, mời vào. Có chuyện gì vậy?" },
      { speaker: "A", hangul: "부장님, 죄송합니다만 사직 의사를 전해 드리고자 합니다.", meaning: "Director, I'm sorry to say, but I would like to inform you of my intent to resign.", vi: "Sếp, tôi xin lỗi nhưng tôi muốn báo cáo ý định nghỉ việc của mình." },
      { speaker: "B", hangul: "사직이요? 갑작스럽네요. 무슨 일이 있으신가요?", meaning: "Resignation? That's sudden. Is something the matter?", vi: "Nghỉ việc à? Đột ngột quá. Có chuyện gì thế?" },
      { speaker: "A", hangul: "오랫동안 고민한 끝에 새로운 도전을 시작하기로 결정했습니다.", meaning: "After long consideration, I've decided to begin a new challenge.", vi: "Sau thời gian dài suy nghĩ, tôi đã quyết định bắt đầu một thử thách mới." },
      { speaker: "B", hangul: "어디로 옮기시는 거예요?", meaning: "Where are you moving to?", vi: "Anh chuyển sang đâu vậy?" },
      { speaker: "A", hangul: "외국계 회사로 이직하게 되었습니다. 오랫동안 꿈꿔 왔던 분야입니다.", meaning: "I'll be moving to a multinational company. It's a field I've dreamt of for a long time.", vi: "Tôi sẽ chuyển sang công ty đa quốc gia. Đó là lĩnh vực tôi mơ ước từ lâu." },
      { speaker: "B", hangul: "음, 그렇군요. 언제까지 근무하실 예정이세요?", meaning: "Hmm, I see. Until when do you plan to work?", vi: "Ừm, ra vậy. Anh dự định làm đến khi nào?" },
      { speaker: "A", hangul: "다음 달 30일까지 근무하면 어떨까 생각하고 있습니다.", meaning: "I'm thinking of working until the 30th of next month.", vi: "Tôi đang nghĩ làm đến ngày 30 tháng sau." },
      { speaker: "B", hangul: "그럼 한 달 정도 시간이 있는 거네요. 인수인계는 어떻게 하실 건가요?", meaning: "So we have about a month then. How will you handle the handover?", vi: "Vậy có khoảng một tháng. Anh sẽ bàn giao thế nào?" },
      { speaker: "A", hangul: "후임자가 정해지면 철저하게 인수인계 자료를 만들고, 직접 가르쳐 드리겠습니다.", meaning: "Once a successor is chosen, I'll prepare thorough handover materials and train them personally.", vi: "Khi có người kế nhiệm, tôi sẽ chuẩn bị tài liệu bàn giao kỹ lưỡng và đích thân hướng dẫn." },
      { speaker: "B", hangul: "알겠어요. 회사 입장에서는 아쉽지만 더 좋은 기회가 있다면 응원해야죠.", meaning: "Understood. From the company's view it's a pity, but if there's a better opportunity, we should support you.", vi: "Tôi hiểu. Từ góc độ công ty thì tiếc, nhưng nếu có cơ hội tốt hơn thì phải ủng hộ chứ." },
      { speaker: "A", hangul: "진심으로 감사드립니다. 그동안 정말 많이 배웠습니다.", meaning: "I sincerely thank you. I've truly learned a lot during this time.", vi: "Tôi thực sự biết ơn. Suốt thời gian qua tôi đã học được rất nhiều." },
      { speaker: "B", hangul: "우리 회사에서 보낸 시간이 도움이 되었기를 바랍니다.", meaning: "I hope the time you spent at our company has been helpful.", vi: "Hy vọng thời gian ở công ty đã có ích cho anh." },
      { speaker: "A", hangul: "정말 큰 도움이 되었습니다. 사직서는 오늘 중으로 제출하겠습니다.", meaning: "It was truly very helpful. I'll submit my resignation letter sometime today.", vi: "Đã giúp tôi rất nhiều. Tôi sẽ nộp đơn xin nghỉ trong hôm nay." },
      { speaker: "B", hangul: "좋아요. 떠나기 전까지 마지막까지 잘 부탁드립니다.", meaning: "Good. Please give your best until your last day.", vi: "Tốt. Xin nhờ anh cố gắng đến ngày cuối cùng." },
      { speaker: "A", hangul: "네, 끝까지 최선을 다하겠습니다.", meaning: "Yes, I'll do my best until the end.", vi: "Vâng, tôi sẽ cố hết sức đến phút cuối." },
      { speaker: "B", hangul: "그럼, 우리 좋은 모습으로 헤어집시다.", meaning: "Well then, let's part on good terms.", vi: "Vậy thì, chúng ta hãy chia tay trong êm đẹp nhé." },
    ],

    roleplay_prompts: [
      "Đóng vai bạn — nhân viên Việt Nam tại Hàn Quốc — đang gặp 부장님 (giám đốc bộ phận) lần đầu để báo nghỉ việc. Hãy diễn tập câu mở đầu lịch sự, lý do tích cực, và đề xuất thời gian bàn giao 1 tháng. Toàn bộ dùng 하십시오체.",
      "Bạn vừa nhận lời mời từ một công ty Mỹ với mức lương gấp đôi. Hãy diễn tập cách trình bày lý do với sếp Hàn Quốc mà KHÔNG nhắc đến lương — chỉ nói về 'cơ hội phát triển' (성장 기회) và 'thử thách mới' (새로운 도전) để không khiến sếp 'mất mặt' (체면).",
      "Sau khi bạn báo nghỉ, sếp đề nghị tăng lương 15% và promotion để giữ bạn lại (역제안 — counter-offer). Hãy diễn tập cách lịch sự nhưng kiên định từ chối, dùng cụm 'oh thân tâm đã quyết định rồi' (마음을 굳혔습니다) mà vẫn giữ được mối quan hệ tốt sau khi rời đi.",
    ],

    register_notes:
      "Tiếng Hàn có 6 cấp kính ngữ. Khi báo nghỉ việc cho sếp, BẮT BUỘC dùng 하십시오체 (cấp deferential cao nhất, đuôi -습니다/-ㅂ니다) trong toàn bộ cuộc trò chuyện. Ví dụ: '사직하겠습니다' chứ KHÔNG phải '사직해요' (해요체 — vẫn lịch sự nhưng thân mật, không phù hợp tình huống nghiêm trọng). Đừng bao giờ gọi sếp bằng 'X 씨' (anh/chị X — quá thân) — phải gọi bằng chức danh kèm 님: 부장님 (giám đốc bộ phận), 팀장님 (trưởng nhóm), 사장님 (tổng giám đốc). Khi cảm ơn cuối cuộc trò chuyện, dùng '감사드립니다' (kính hơn) thay vì '감사합니다' (vẫn được nhưng nhẹ hơn). Sai cấp kính ngữ ở tình huống này có thể bị xem là thiếu chuyên nghiệp và phá hỏng quan hệ về lâu dài — cộng đồng ngành Hàn liên kết chặt, tiếng xấu lan nhanh.",

    idiom_glosses: [
      {
        idiom: "발을 빼다",
        literal: "rút chân ra",
        meaning: "rút lui khỏi mối quan hệ hoặc cam kết, đặc biệt khi đã tham gia sâu",
        example: "그 프로젝트에서 발을 뺄 때가 됐다고 생각합니다.",
      },
      {
        idiom: "마음을 굳히다",
        literal: "làm cứng tâm trí",
        meaning: "kiên định / đã quyết tâm — dùng khi từ chối lời mời ở lại",
        example: "오랜 고민 끝에 마음을 굳혔습니다.",
      },
      {
        idiom: "끝맺음을 잘하다",
        literal: "kết thúc tốt",
        meaning: "rời đi trong êm đẹp, không 'đốt cầu', giữ thể diện",
        example: "끝맺음을 잘해야 다음 기회가 옵니다.",
      },
      {
        idiom: "퇴직금을 챙기다",
        literal: "thu xếp tiền trợ cấp thôi việc",
        meaning: "lo liệu các quyền lợi khi nghỉ — colloquial, không nên nói thẳng với sếp",
        example: "퇴직금을 챙기는 것도 잊지 마세요.",
      },
    ],

    cultural_notes_vi:
      "Văn hóa nghỉ việc ở Hàn Quốc đặt trọng tâm vào 체면 (thể diện) và quan hệ cấp bậc. Năm nguyên tắc cốt lõi: (1) Báo trước 1 tháng là chuẩn — gấp hơn (2 tuần) bị coi là vô trách nhiệm. (2) Nói trực tiếp với sếp TRƯỚC khi báo HR — nếu HR biết trước, sếp 'mất mặt' và cảm thấy bị qua mặt. (3) Lý do nên là 'tích cực' (cơ hội mới, học hành, gia đình) thay vì 'tiêu cực' (chê công ty, lương thấp). Người Hàn quý trọng người không 'đốt cầu'. (4) 인수인계 (bàn giao) PHẢI làm chu đáo — đào tạo người kế nhiệm sơ sài là tự phá hủy danh tiếng cá nhân ở ngành Hàn (vốn nhỏ và liên kết chặt). (5) Quà chia tay không bắt buộc nhưng phổ biến: tặng team hộp bánh hoặc trái cây vào ngày làm cuối là cử chỉ đẹp đáng nhớ.",

    tip_advice_vi:
      "Câu mở đầu là quyết định nhất. Đừng đi thẳng vào '사직하겠습니다' — quá đột ngột với người Hàn. Mở bằng câu báo trước có chuyện quan trọng: '부장님, 잠시 시간 괜찮으십니까? 드릴 말씀이 있어서요.' (Sếp, có chút thời gian không ạ? Tôi có chuyện muốn thưa.) — cho sếp 30 giây chuẩn bị tâm lý. Sau khi báo, KHÔNG giải thích chi tiết về công ty mới (lương, phúc lợi) — sẽ bị xem như khoe khoang. Chỉ cần '새로운 도전' (thử thách mới) hoặc '오랜 고민 끝에 결정했습니다' (sau cân nhắc lâu đã quyết định) là đủ. Cuối cùng, KHÔNG nói '발 빼다' về việc rời công ty trong lúc trò chuyện với sếp — nghe quá colloquial; chỉ dùng khi tâm sự với bạn ngoài giờ.",

    exercises: [
      {
        type: "fill-blank",
        question: "부장님께 사직 의사를 ___ 드리고자 합니다.",
        answer: "전해",
      },
      {
        type: "matching",
        pairs: [
          { hangul: "발을 빼다", meaning: "rút lui khỏi cam kết" },
          { hangul: "마음을 굳히다", meaning: "kiên định / đã quyết" },
          { hangul: "끝맺음을 잘하다", meaning: "rời đi trong êm đẹp" },
          { hangul: "인수인계", meaning: "bàn giao công việc" },
        ],
        instruction: "Nối thành ngữ Hàn với nghĩa tiếng Việt",
      },
      {
        type: "translation",
        vietnamese: "Sau thời gian dài cân nhắc, tôi đã quyết định rời công ty.",
        hangul: "오랜 고민 끝에 회사를 떠나기로 결정했습니다.",
      },
    ],
  },

  // ── Phase 2 Round 1: Category 1 (Học tập & Nghề nghiệp) — lessons 52-61 ──

  // 52. Job interview at Korean company
  {
    id: 52,
    level: "B2",
    title_vi: "Phỏng vấn xin việc tại công ty Hàn Quốc",
    title_en: "Job interview at a Korean company",
    intro_vi:
      "Phỏng vấn xin việc tại Samsung, LG, Hyundai (chi nhánh Việt Nam hoặc HQ Hàn Quốc). Toàn bộ dùng 하십시오체. Tập trung vào 5 chủ đề cốt lõi luôn xuất hiện: 자기소개, 지원 동기, 강점·약점, 5년 후 모습, câu hỏi cuối. Thái độ và độ chuẩn bị quyết định 70% kết quả.",
    vocabulary: [
      { hangul: "면접", meaning: "interview" },
      { hangul: "자기소개", meaning: "self-introduction" },
      { hangul: "지원 동기", meaning: "reason for applying" },
      { hangul: "강점", meaning: "strength" },
      { hangul: "약점", meaning: "weakness" },
      { hangul: "입사", meaning: "joining the company" },
      { hangul: "포부", meaning: "ambition / aspiration" },
      { hangul: "직무", meaning: "job role" },
      { hangul: "경력", meaning: "career experience" },
      { hangul: "합격", meaning: "passing / acceptance" },
    ],
    sentences: [
      { korean: "안녕하십니까, 지원자 응웬티란이라고 합니다.", romanized: "Annyeonghasimnikka, jiwonja Eungwentiranirago hamnida.", en: "Hello, I am the applicant, Nguyen Thi Lan.", vi: "Chào quý vị, tôi là ứng viên Nguyễn Thị Lan." },
      { korean: "삼성전자에 큰 관심을 가지고 지원하게 되었습니다.", romanized: "Samseongjeonjae keun gwansimeul gajigo jiwonhage doeeotseumnida.", en: "I applied with great interest in Samsung Electronics.", vi: "Tôi ứng tuyển vì rất quan tâm đến Samsung Electronics." },
      { korean: "저의 강점은 책임감과 빠른 적응력입니다.", romanized: "Jeoui gangjeomeun chaegimgamgwa ppareun jeokeungnyeogimnida.", en: "My strengths are responsibility and quick adaptability.", vi: "Điểm mạnh của tôi là tinh thần trách nhiệm và khả năng thích nghi nhanh." },
      { korean: "베트남 시장에 대한 이해를 바탕으로 기여하고 싶습니다.", romanized: "Beteunam sijange daehan ihaereul batangeuro giyeohago sipseumnida.", en: "I'd like to contribute based on my understanding of the Vietnamese market.", vi: "Tôi muốn đóng góp dựa trên sự hiểu biết về thị trường Việt Nam." },
      { korean: "면접 기회를 주셔서 진심으로 감사드립니다.", romanized: "Myeonjeop gihoereul jusyeoseo jinsimeuro gamsadeurimnida.", en: "I sincerely thank you for the interview opportunity.", vi: "Tôi chân thành cảm ơn cơ hội được phỏng vấn." },
    ],
    dialogue: [
      { speaker: "A", hangul: "안녕하십니까. 자기소개 부탁드립니다.", meaning: "Hello. Please introduce yourself." },
      { speaker: "B", hangul: "안녕하십니까. 응웬티란입니다. 하노이 출신이며 한국학을 전공했습니다.", meaning: "Hello. I'm Nguyen Thi Lan, from Hanoi, majored in Korean Studies." },
      { speaker: "A", hangul: "우리 회사에 지원하신 동기가 무엇입니까?", meaning: "What is your motivation for applying to our company?" },
      { speaker: "B", hangul: "글로벌 시장 진출에 기여하고 싶어 지원하게 되었습니다.", meaning: "I applied because I want to contribute to your global expansion." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "안녕하십니까, 응웬티란 씨. 오늘 와 주셔서 감사합니다.", meaning: "Hello, Ms. Nguyen. Thank you for coming today.", vi: "Chào chị Lan. Cảm ơn đã đến hôm nay." },
      { speaker: "B", hangul: "안녕하십니까. 면접 기회를 주셔서 진심으로 감사드립니다.", meaning: "Hello. I sincerely thank you for the interview opportunity.", vi: "Xin chào. Tôi chân thành cảm ơn cơ hội phỏng vấn." },
      { speaker: "A", hangul: "자기소개를 1분 정도 부탁드립니다.", meaning: "Please give a 1-minute self-introduction.", vi: "Mời chị giới thiệu bản thân khoảng 1 phút." },
      { speaker: "B", hangul: "네, 응웬티란입니다. 하노이 국립대학교에서 한국학을 전공했고, 졸업 후 2년간 한국 회사 베트남 지사에서 근무했습니다.", meaning: "Yes, I'm Nguyen Thi Lan. I majored in Korean Studies at Hanoi National University and worked 2 years at a Korean firm's Vietnam branch.", vi: "Vâng, tôi là Nguyễn Thị Lan. Tôi tốt nghiệp ngành Hàn Quốc học tại ĐH Quốc gia Hà Nội, và làm 2 năm ở chi nhánh Việt Nam của một công ty Hàn." },
      { speaker: "A", hangul: "저희 회사에 지원하신 이유가 무엇입니까?", meaning: "Why did you apply to our company?", vi: "Lý do chị ứng tuyển công ty chúng tôi là gì?" },
      { speaker: "B", hangul: "삼성전자가 베트남 시장에서 가장 활발히 활동하는 글로벌 기업이라고 생각합니다. 한국어 능력과 시장 이해를 바탕으로 기여하고 싶습니다.", meaning: "I see Samsung as the most active global firm in Vietnam. I want to contribute with my Korean skills and market insight.", vi: "Tôi thấy Samsung là tập đoàn toàn cầu năng động nhất tại thị trường Việt Nam. Tôi muốn đóng góp bằng năng lực tiếng Hàn và hiểu biết thị trường." },
      { speaker: "A", hangul: "본인의 강점을 말씀해 주시겠습니까?", meaning: "Could you tell me your strengths?", vi: "Chị có thể chia sẻ điểm mạnh của mình không?" },
      { speaker: "B", hangul: "두 가지를 말씀드리겠습니다. 첫째, 책임감입니다. 맡은 일은 끝까지 완수합니다. 둘째, 빠른 적응력으로 새 환경에서도 자리를 잘 잡습니다.", meaning: "Two things. First, responsibility — I complete what I'm given. Second, fast adaptability — I settle in well in new environments.", vi: "Hai điểm. Một, tinh thần trách nhiệm — tôi hoàn thành đến cùng việc được giao. Hai, khả năng thích nghi nhanh — tôi sớm 'tìm chỗ đứng' trong môi trường mới." },
      { speaker: "A", hangul: "약점은 무엇입니까?", meaning: "And weaknesses?", vi: "Còn điểm yếu?" },
      { speaker: "B", hangul: "완벽주의 성향이 강해서 처음에는 시간이 오래 걸렸습니다. 지금은 우선순위 정하기를 의식적으로 연습하고 있습니다.", meaning: "I had strong perfectionism so things took long initially. Now I deliberately practice prioritization.", vi: "Tôi có xu hướng cầu toàn nên ban đầu mất nhiều thời gian. Hiện tôi đang luyện tập sắp xếp ưu tiên có ý thức." },
      { speaker: "A", hangul: "5년 후 본인의 모습을 어떻게 그리고 계십니까?", meaning: "How do you picture yourself in 5 years?", vi: "Chị hình dung mình sau 5 năm như thế nào?" },
      { speaker: "B", hangul: "베트남 시장 전문가로서 한국 본사와 베트남 지사를 잇는 가교 역할을 하고 싶습니다. 큰 그림을 그리며 일하는 사람이 되겠습니다.", meaning: "As a Vietnam-market specialist, I'd serve as a bridge between HQ and the Vietnam office. I'll be someone who works with the big picture in mind.", vi: "Là chuyên gia thị trường Việt Nam, tôi muốn làm cầu nối giữa trụ sở Hàn và chi nhánh Việt. Tôi sẽ là người làm việc với 'bức tranh lớn' trong đầu." },
      { speaker: "A", hangul: "마지막으로 질문 있으십니까?", meaning: "Any final questions?", vi: "Cuối cùng, chị có câu hỏi gì không?" },
      { speaker: "B", hangul: "네, 저희 부서 신입사원에게 가장 기대하시는 자질이 무엇인지 여쭙고 싶습니다.", meaning: "Yes — what quality do you most expect from a new hire in this department?", vi: "Vâng — phẩm chất nào quý vị mong đợi nhất ở nhân viên mới của bộ phận?" },
      { speaker: "A", hangul: "좋은 질문입니다. 협업이 중요해서 소통 능력을 가장 중시합니다.", meaning: "Good question. We value communication most because collaboration matters.", vi: "Câu hỏi hay. Chúng tôi xem trọng kỹ năng giao tiếp vì cộng tác là quan trọng nhất." },
      { speaker: "B", hangul: "자세한 답변 감사드립니다. 입사하게 된다면 최선을 다하겠습니다.", meaning: "Thank you for the detailed answer. If hired I will give my best.", vi: "Cảm ơn câu trả lời chi tiết. Nếu được nhận, tôi sẽ cố gắng hết sức." },
      { speaker: "A", hangul: "결과는 다음 주 중에 연락드리겠습니다. 수고하셨습니다.", meaning: "We'll contact you with the result next week. Well done.", vi: "Chúng tôi sẽ liên hệ kết quả tuần sau. Chị đã vất vả." },
      { speaker: "B", hangul: "시간 내 주셔서 감사드립니다. 안녕히 계십시오.", meaning: "Thank you for your time. Goodbye.", vi: "Cảm ơn quý vị đã dành thời gian. Tạm biệt." },
    ],
    roleplay_prompts: [
      "Đóng vai bạn là ứng viên phỏng vấn tại Samsung Vietnam. Hãy diễn tập 자기소개 trong 1 phút bằng 하십시오체: tên, quê quán, chuyên ngành, kinh nghiệm, lý do ứng tuyển. KHÔNG nói tiêu cực về công ty cũ.",
      "Phỏng vấn viên hỏi 약점 (điểm yếu). Hãy diễn tập câu trả lời thông minh: nêu 1 điểm yếu CỤ THỂ + cách bạn đang khắc phục. Tránh 'tôi quá hoàn hảo' (cliché bị ghét) và 'tôi không có điểm yếu' (thiếu tự nhận thức).",
      "Cuối phỏng vấn người Hàn LUÔN hỏi '마지막으로 질문 있으십니까?'. Trả lời '없습니다' = thiếu quan tâm. Diễn tập 2 câu hỏi thông minh về văn hóa team hoặc kỳ vọng đối với nhân viên mới — bằng 하십시오체. Tránh hỏi lương trong phỏng vấn đầu.",
    ],
    register_notes:
      "Phỏng vấn xin việc Hàn Quốc TUYỆT ĐỐI dùng 하십시오체 từ đầu đến cuối — đuôi -습니다/-ㅂ니다. Người phỏng vấn (면접관) hầu như luôn cấp bậc cao hơn nên kính ngữ tối đa. Cách xưng hô: 부장님, 차장님, 면접관님 — nếu không rõ chức danh dùng 선생님. KHÔNG dùng 해요체 ('-아요/어요') trong phỏng vấn — vẫn lịch sự với bạn bè nhưng thiếu chuyên nghiệp ở đây. Tự xưng 저, không 나. Đề cập công ty cũ chỉ dùng '회사' không gọi tên — kín đáo và an toàn pháp lý. Hai cụm bắt buộc thuộc: '감사드립니다' (cảm ơn cao) và '수고하셨습니다' (đáp lại khi sếp nói câu này).",
    idiom_glosses: [
      { idiom: "첫 단추를 끼우다", literal: "cài cúc áo đầu tiên", meaning: "khởi đầu đúng cách — quyết định cả quá trình", example: "면접에서 첫 단추를 잘 끼워야 합니다." },
      { idiom: "큰 그림을 그리다", literal: "vẽ bức tranh lớn", meaning: "tư duy chiến lược / dài hạn", example: "큰 그림을 그리며 일하는 인재를 찾고 있습니다." },
      { idiom: "한 우물을 파다", literal: "đào một cái giếng", meaning: "chuyên sâu vào một lĩnh vực — không nhảy việc nhiều", example: "한 분야에서 한 우물을 파 온 경력이 강점입니다." },
      { idiom: "자리를 잡다", literal: "giành lấy chỗ ngồi", meaning: "ổn định vị trí, thích nghi xong môi trường mới", example: "새로운 회사에서도 빠르게 자리를 잡겠습니다." },
    ],
    cultural_notes_vi:
      "Phỏng vấn Hàn Quốc tập trung 5 chủ đề CỐT LÕI luôn xuất hiện: (1) 자기소개 — chuẩn bị 1 phút, không quá 90 giây; (2) 지원 동기 — phải nêu điểm CỤ THỂ của công ty này, không generic 'tôi yêu Hàn Quốc'; (3) 강점·약점 — nêu cụ thể với ví dụ, không liệt kê chung chung; (4) 5년 후 본인 모습 — KHÔNG được nói 'sẽ chuyển công ty khác' — họ kiểm tra commitment; (5) 마지막 질문 — bắt buộc có 1-2 câu hỏi, không hỏi lương vòng đầu. Thái độ (태도) chiếm 70%: cúi chào ~30 độ khi vào, ngồi thẳng, hai tay đặt đùi, không bắt chéo chân. Trang phục tối màu (đen/navy/xám), nữ tránh trang điểm đậm. Đến trước 15 phút — đến đúng giờ ở Hàn = đến muộn. KHÔNG nói xấu công ty cũ — bị xem là người 'đốt cầu', sẽ làm vậy với công ty mới.",
    tip_advice_vi:
      "Bí quyết: chuẩn bị câu trả lời CHUẨN cho 5 câu cốt lõi và LUYỆN THÀNH PHẢN XẠ — phỏng vấn Hàn không có chỗ ngập ngừng. Cấu trúc STAR (Situation-Task-Action-Result) nhưng GỌN — mỗi câu 30s–1 phút. Khi nói 강점, 2 điểm là đủ + ví dụ cụ thể. Khi nói 약점, công thức an toàn: '저의 약점은 X였습니다. 지금은 Y로 개선하고 있습니다.' Câu hỏi cuối tránh lương/phúc lợi — hỏi văn hóa team, mentorship, kỳ vọng. Cuối phỏng vấn LUÔN nói '시간 내 주셔서 감사드립니다' trước khi rời — ấn tượng cuối quan trọng cho 합격.",
    exercises: [
      { type: "fill-blank", question: "면접 ___ 주셔서 감사드립니다.", answer: "기회를" },
      {
        type: "matching",
        pairs: [
          { hangul: "첫 단추를 끼우다", meaning: "khởi đầu đúng cách" },
          { hangul: "큰 그림을 그리다", meaning: "tư duy dài hạn" },
          { hangul: "한 우물을 파다", meaning: "chuyên sâu một lĩnh vực" },
          { hangul: "자리를 잡다", meaning: "ổn định vị trí" },
        ],
        instruction: "Nối thành ngữ Hàn với nghĩa tiếng Việt",
      },
      { type: "translation", vietnamese: "Tôi ứng tuyển vì rất quan tâm đến công ty quý vị.", hangul: "귀사에 큰 관심을 가지고 지원하게 되었습니다." },
    ],
  },

  // 53. KGSP scholarship interview
  {
    id: 53,
    level: "B2",
    title_vi: "Phỏng vấn học bổng chính phủ Hàn Quốc (KGSP)",
    title_en: "KGSP scholarship interview at the Korean Embassy",
    intro_vi:
      "Phỏng vấn vòng đại sứ quán cho 한국정부초청장학생 (KGSP) — tỉ lệ chấp nhận ~5%. Ban giám khảo thường gồm tham tán giáo dục, cán bộ KOICA và một giáo sư Hàn. Tập trung vào 학업 계획서 (study plan), 연구 분야 (lĩnh vực nghiên cứu), và 졸업 후 진로 (định hướng sau tốt nghiệp).",
    vocabulary: [
      { hangul: "장학금", meaning: "scholarship" },
      { hangul: "한국정부초청장학생", meaning: "KGSP recipient" },
      { hangul: "학업 계획", meaning: "study plan" },
      { hangul: "연구 분야", meaning: "research field" },
      { hangul: "지도 교수", meaning: "academic advisor" },
      { hangul: "추천서", meaning: "recommendation letter" },
      { hangul: "졸업 후 진로", meaning: "post-graduation path" },
      { hangul: "한국어 능력", meaning: "Korean language ability" },
      { hangul: "학문적 성취", meaning: "academic achievement" },
      { hangul: "양국의 가교", meaning: "bridge between two countries" },
    ],
    sentences: [
      { korean: "한국정부초청장학생 프로그램에 지원하게 되어 영광입니다.", romanized: "Hangukjeongbuchocheongjanghaksaeng peurogeuraeme jiwonhage doeeo yeonggwangimnida.", en: "It is an honor to apply to the KGSP program.", vi: "Tôi vinh dự được ứng tuyển chương trình KGSP." },
      { korean: "저의 연구 관심사는 한·베 경제 협력 분야입니다.", romanized: "Jeoui yeongu gwansimsaneun han-be gyeongje hyeomnyeok bunyaimnida.", en: "My research interest is Korea-Vietnam economic cooperation.", vi: "Lĩnh vực nghiên cứu của tôi là hợp tác kinh tế Hàn-Việt." },
      { korean: "학사 과정에서 평점 3.8을 유지했습니다.", romanized: "Haksa gwajeongeseo pyeongjeom 3.8eul yujihaesseumnida.", en: "I maintained a 3.8 GPA during my undergraduate.", vi: "Tôi duy trì GPA 3.8 trong bậc đại học." },
      { korean: "졸업 후 베트남으로 돌아가 양국의 가교 역할을 하고자 합니다.", romanized: "Jeoreop hu Beteunameuro doraga yangguk-ui gagyo yeokhareul hagoja hamnida.", en: "After graduation I'll return to Vietnam to bridge the two countries.", vi: "Sau tốt nghiệp tôi sẽ về Việt Nam làm cầu nối hai nước." },
      { korean: "한국 사회에 대한 깊은 이해가 저의 강점입니다.", romanized: "Hanguk sahoee daehan gipeun ihaega jeoui gangjeomimnida.", en: "Deep understanding of Korean society is my strength.", vi: "Sự hiểu biết sâu về xã hội Hàn là điểm mạnh của tôi." },
    ],
    dialogue: [
      { speaker: "A", hangul: "자기소개와 지원 동기를 말씀해 주십시오.", meaning: "Please give your self-introduction and motivation." },
      { speaker: "B", hangul: "응웬티엔입니다. 외교학원을 졸업했고 한·베 경제 협력을 연구하고 싶어 지원했습니다.", meaning: "I'm Nguyen Thi En. I graduated from Diplomatic Academy and want to research Korea-Vietnam economics." },
      { speaker: "A", hangul: "어느 대학을 희망하십니까?", meaning: "Which university do you hope to attend?" },
      { speaker: "B", hangul: "서울대학교가 1순위, 연세대학교가 2순위입니다.", meaning: "Seoul National is my first choice, Yonsei second." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "안녕하십니까. 면접에 응해 주셔서 감사합니다. 자기소개 부탁드립니다.", meaning: "Hello. Thank you for coming to the interview. Self-introduction please.", vi: "Xin chào. Cảm ơn đã đến phỏng vấn. Mời giới thiệu bản thân." },
      { speaker: "B", hangul: "안녕하십니까. 응웬티엔이라고 합니다. 베트남 외교학원에서 국제관계학을 전공했으며, 토픽 5급을 보유하고 있습니다.", meaning: "Hello. I'm Nguyen Thi En, majored in IR at Diplomatic Academy of Vietnam, hold TOPIK 5.", vi: "Xin chào. Tôi là Nguyễn Thị Ên, học Quan hệ Quốc tế tại Học viện Ngoại giao, có TOPIK 5." },
      { speaker: "A", hangul: "한국정부초청장학생에 지원하신 동기는 무엇입니까?", meaning: "Why did you apply to KGSP?", vi: "Vì sao chị ứng tuyển KGSP?" },
      { speaker: "B", hangul: "한국과 베트남의 경제 협력이 빠르게 확대되는 시점에서 양국을 이해하는 전문가가 되고자 지원했습니다.", meaning: "I applied to become an expert who understands both countries amid rapid Korea-Vietnam economic expansion.", vi: "Tôi ứng tuyển để trở thành chuyên gia hiểu cả hai nước trong bối cảnh hợp tác kinh tế Hàn-Việt mở rộng nhanh." },
      { speaker: "A", hangul: "구체적으로 어떤 분야를 연구하고 싶으십니까?", meaning: "What field specifically?", vi: "Cụ thể chị muốn nghiên cứu lĩnh vực gì?" },
      { speaker: "B", hangul: "한국 기업의 베트남 진출 전략과 현지화 정책을 비교 연구하고 싶습니다.", meaning: "Korean firms' Vietnam-entry strategies and localization policies, comparatively.", vi: "Chiến lược thâm nhập Việt Nam của doanh nghiệp Hàn và chính sách bản địa hóa, theo hướng so sánh." },
      { speaker: "A", hangul: "1순위 대학교는 어디입니까?", meaning: "First-choice university?", vi: "Trường nguyện vọng 1?" },
      { speaker: "B", hangul: "서울대학교 국제대학원이 1순위입니다. 박지원 교수님의 동남아 경제 연구실에 큰 관심이 있습니다.", meaning: "SNU GSIS — I'm interested in Prof. Park Ji-won's Southeast Asia economics lab.", vi: "Cao học Quốc tế ĐH Seoul. Tôi quan tâm phòng nghiên cứu kinh tế ĐNÁ của GS. Park Ji-won." },
      { speaker: "A", hangul: "학업 계획서에 5학기 안에 학위를 마치겠다고 적으셨는데, 가능하시겠습니까?", meaning: "Your plan says 5 semesters — feasible?", vi: "Kế hoạch ghi 5 học kỳ — chị thấy khả thi?" },
      { speaker: "B", hangul: "네, 어학연수 1년에 토픽 6급을 취득한 뒤 4학기 학위 과정을 마치는 일정으로 계획했습니다.", meaning: "Yes — TOPIK 6 in the language year, then 4 semesters of degree work.", vi: "Vâng, năm học tiếng đạt TOPIK 6, rồi 4 kỳ chính khóa." },
      { speaker: "A", hangul: "한국 생활 적응에 어려움이 있을 수 있는데, 어떻게 극복하실 계획입니까?", meaning: "Adjusting to Korea — how will you cope?", vi: "Thích nghi với Hàn — chị sẽ vượt qua thế nào?" },
      { speaker: "B", hangul: "베트남 학생회와 교류하면서 동시에 한국 친구들에게 한 발 다가가려고 노력하겠습니다.", meaning: "Engage with the Vietnamese student association while taking a step closer to Korean friends.", vi: "Tham gia hội sinh viên Việt đồng thời chủ động 'tiến một bước gần hơn' với bạn Hàn." },
      { speaker: "A", hangul: "졸업 후 계획은 어떻게 됩니까?", meaning: "Plan after graduation?", vi: "Kế hoạch sau tốt nghiệp?" },
      { speaker: "B", hangul: "베트남 외교부나 KOTRA 베트남 사무소에서 양국의 가교 역할을 하고 싶습니다.", meaning: "MFA Vietnam or KOTRA Vietnam — bridge role between the two.", vi: "Bộ Ngoại giao Việt Nam hoặc KOTRA chi nhánh Việt — làm cầu nối hai nước." },
      { speaker: "A", hangul: "마지막으로 한국어로 자유 발언 부탁드립니다.", meaning: "A free closing remark in Korean please.", vi: "Cuối cùng, mời chị phát biểu tự do bằng tiếng Hàn." },
      { speaker: "B", hangul: "한국과 베트남은 형제 같은 나라라고 생각합니다. 이 장학금은 저에게 큰 등용문이 될 것이며, 받게 된다면 책임감 있게 학업에 임하겠습니다.", meaning: "Korea and Vietnam are like brothers. This scholarship would be a great gateway for me; if granted, I'll study with full responsibility.", vi: "Hàn Quốc và Việt Nam như anh em. Học bổng này sẽ là 'cửa rồng hóa' lớn của tôi; nếu được trao, tôi sẽ học với đầy đủ trách nhiệm." },
      { speaker: "A", hangul: "좋은 답변 감사합니다. 결과는 약 한 달 후에 통보됩니다.", meaning: "Good answer. Result in about a month.", vi: "Câu trả lời tốt. Kết quả sau khoảng 1 tháng." },
      { speaker: "B", hangul: "면접 기회를 주셔서 진심으로 감사드립니다.", meaning: "Sincere thanks for the interview opportunity.", vi: "Chân thành cảm ơn cơ hội phỏng vấn." },
    ],
    roleplay_prompts: [
      "Diễn tập câu trả lời 'KGSP 지원 동기' — phải nói CỤ THỂ về Hàn Quốc và liên kết với chuyên ngành của bạn. Tuyệt đối không generic kiểu 'tôi yêu K-pop'.",
      "Phỏng vấn viên hỏi tại sao chọn BẠN trong số ~100 ứng viên Việt. Diễn tập câu trả lời nêu 2 điểm khác biệt cụ thể (ví dụ: kinh nghiệm thực tế tại doanh nghiệp Hàn, kỹ năng nghiên cứu) — không khoe điểm số mà nêu giá trị bạn mang lại.",
      "Đại sứ quán hỏi 'Có câu hỏi cho chúng tôi không?'. Diễn tập 2 câu hỏi thông minh: alumni network KGSP cũ, hoặc hỗ trợ định hướng nghề sau tốt nghiệp — bằng 하십시오체.",
    ],
    register_notes:
      "Phỏng vấn KGSP có ban giám khảo gồm tham tán giáo dục, cán bộ ngoại giao, đôi khi giáo sư Hàn — TUYỆT ĐỐI 하십시오체 toàn bộ. Đề cập giáo sư cụ thể PHẢI thêm 님: 박지원 교수님 chứ không 박지원 교수. Khi nói về Hàn-Việt, tránh '한국이 베트남보다 발달했다' (so sánh trên-dưới — bị xem là tự ti hoặc nịnh) — dùng cấu trúc bình đẳng '한국과 베트남' (Hàn Quốc và Việt Nam). Tự xưng nghiêm trang 저, đề cập đại sứ quán dùng 대사관 không gọi tên cá nhân. Từ 'mơ ước/dream' dịch là 꿈 thì OK trong phát biểu cuối — nhưng phần phân tích nghiên cứu phải dùng từ formal: 목표, 계획, 비전.",
    idiom_glosses: [
      { idiom: "등용문", literal: "cửa rồng hóa", meaning: "cánh cửa dẫn đến thành công lớn — dùng cho cơ hội biến đổi sự nghiệp", example: "이 장학금은 저에게 큰 등용문이 될 것입니다." },
      { idiom: "한 발 다가가다", literal: "tiến một bước gần hơn", meaning: "chủ động xây dựng quan hệ — dùng cho hòa nhập văn hóa", example: "한국 친구들에게 한 발 다가가려고 노력하겠습니다." },
      { idiom: "길을 닦다", literal: "lát đường", meaning: "mở đường, chuẩn bị nền móng cho thế hệ sau", example: "후배들을 위해 길을 닦고 싶습니다." },
      { idiom: "박차를 가하다", literal: "thúc cựa ngựa", meaning: "tăng tốc nỗ lực — dùng khi cam kết đẩy mạnh", example: "연구에 박차를 가하겠습니다." },
    ],
    cultural_notes_vi:
      "KGSP là chương trình cạnh tranh khốc liệt nhất về học bổng Hàn — vòng đại sứ quán chỉ chọn ~30% sau khi đã sàng lọc giấy tờ. Ba điểm hội đồng đánh giá: (1) 학업 계획서 phải CỤ THỂ — nêu rõ trường, giáo sư, lĩnh vực, lý do — đừng viết generic; (2) 졸업 후 진로 phải có kế hoạch RÕ ràng quay về phục vụ Việt Nam (KGSP là 'soft power' của Hàn — họ muốn alumni làm cầu nối, không phải ở lại Hàn); (3) 한국 사회 이해 — họ test xem bạn biết gì ngoài K-pop. Mặc Áo dài hoặc vest formal — tránh trang phục du lịch. Mang theo 추천서 photocopy, 학업 계획서 in màu để giám khảo tham khảo trên bàn. Cúi chào ~30 độ khi vào, hai tay đưa hồ sơ. Sau phỏng vấn nên gửi email cảm ơn (không bắt buộc nhưng tạo điểm tích cực).",
    tip_advice_vi:
      "Câu chốt 'tại sao Hàn Quốc?' — KHÔNG nói 'tôi yêu K-pop/K-drama' (red flag, ban giám khảo nghe quá nhiều). Hãy nói: chọn ngành CỤ THỂ → tại Hàn ngành đó MẠNH ở X → liên kết với Việt Nam Y → đóng góp Z. Phần 학업 계획, hãy nêu TÊN giáo sư cụ thể bạn muốn theo (research trước qua Google Scholar — đọc 1-2 paper của họ); chứng tỏ bạn đã làm bài tập. KHÔNG nói 'tôi sẽ ở lại Hàn làm việc' — KGSP yêu cầu định hướng quay về. Câu cuối tự do nên ngắn (~30s), có cảm xúc nhẹ nhưng không melodrama. Tránh 발 빼다 (rút lui — nghe tiêu cực) hoặc các từ thị trường tài chính (월급, 보너스) — chỉ nói về 학문, 연구, 기여.",
    exercises: [
      { type: "fill-blank", question: "졸업 후 양국의 ___ 역할을 하고자 합니다.", answer: "가교" },
      {
        type: "matching",
        pairs: [
          { hangul: "등용문", meaning: "cửa dẫn đến thành công lớn" },
          { hangul: "한 발 다가가다", meaning: "chủ động kết nối" },
          { hangul: "길을 닦다", meaning: "mở đường cho người sau" },
          { hangul: "박차를 가하다", meaning: "tăng tốc nỗ lực" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Lĩnh vực nghiên cứu của tôi là hợp tác kinh tế Hàn-Việt.", hangul: "저의 연구 분야는 한·베 경제 협력입니다." },
    ],
  },

  // 54. Graduation thesis topic discussion with professor
  {
    id: 54,
    level: "B2",
    title_vi: "Bàn đề tài luận văn tốt nghiệp với giáo sư",
    title_en: "Discussing graduation thesis topic with professor",
    intro_vi:
      "Cuộc gặp 1-1 với 지도 교수님 (giáo sư hướng dẫn) để chốt đề tài luận văn. Sinh viên Việt thường mắc 2 lỗi: đề tài quá rộng, hoặc đồng ý với mọi gợi ý của giáo sư mà không phản biện. Cuộc gặp này dạy cách thảo luận học thuật cân bằng giữa tôn trọng và đề xuất ý kiến riêng — bằng 하십시오체.",
    vocabulary: [
      { hangul: "논문", meaning: "thesis / paper" },
      { hangul: "주제", meaning: "topic" },
      { hangul: "범위", meaning: "scope" },
      { hangul: "선행 연구", meaning: "prior research / literature" },
      { hangul: "연구 방법", meaning: "research methodology" },
      { hangul: "사례 연구", meaning: "case study" },
      { hangul: "자료 수집", meaning: "data collection" },
      { hangul: "문헌 검토", meaning: "literature review" },
      { hangul: "기여도", meaning: "contribution / significance" },
      { hangul: "심사", meaning: "review / defense" },
    ],
    sentences: [
      { korean: "교수님, 논문 주제에 대해 상의드리고 싶습니다.", romanized: "Gyosunim, nonmun jujee daehae sangui-deurigo sipseumnida.", en: "Professor, I'd like to discuss my thesis topic.", vi: "Thưa thầy/cô, em muốn xin ý kiến về đề tài luận văn." },
      { korean: "베트남 K-콘텐츠 수용 양상을 분석하고자 합니다.", romanized: "Beteunam K-kontencheu suyong yangsangeul bunseokhagoja hamnida.", en: "I'd like to analyze how Vietnamese audiences consume K-content.", vi: "Em muốn phân tích cách khán giả Việt tiếp nhận K-content." },
      { korean: "선행 연구를 보면 이 분야는 비교적 적게 다뤄졌습니다.", romanized: "Seonhaeng yeongureul bomyeon i bunyaneun bigyojeok jeokge dawojyeotseumnida.", en: "Prior research has covered this field relatively little.", vi: "Theo nghiên cứu trước đây, lĩnh vực này được khai thác tương đối ít." },
      { korean: "주제가 너무 넓다고 지적해 주신 부분 동의합니다.", romanized: "Jujega neomu neoldago jijeokhae jusin bubun dongui-hamnida.", en: "I agree with your point that the topic is too broad.", vi: "Em đồng ý với góp ý của thầy/cô là đề tài đang quá rộng." },
      { korean: "다음 주까지 수정된 연구 계획서를 보내드리겠습니다.", romanized: "Daeum ju-kkaji sujeongdoen yeongu gyehoekseoreul bonaedeurigetsseumnida.", en: "I'll send the revised proposal by next week.", vi: "Em sẽ gửi đề cương đã chỉnh sửa trong tuần tới." },
    ],
    dialogue: [
      { speaker: "A", hangul: "교수님, 안녕하십니까. 시간 내 주셔서 감사합니다.", meaning: "Hello professor. Thank you for the time." },
      { speaker: "B", hangul: "어서 오세요. 어떤 주제를 생각하고 계세요?", meaning: "Come in. What topic are you thinking?" },
      { speaker: "A", hangul: "베트남에서의 K-콘텐츠 수용 양상에 대해 쓰고 싶습니다.", meaning: "I'd like to write about K-content reception in Vietnam." },
      { speaker: "B", hangul: "흥미로운 주제입니다. 다만 범위를 좁힐 필요가 있겠어요.", meaning: "Interesting. But the scope needs narrowing." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "교수님, 안녕하십니까. 시간 내 주셔서 감사합니다.", meaning: "Hello professor. Thank you for your time.", vi: "Thưa thầy, em chào thầy. Cảm ơn thầy đã dành thời gian." },
      { speaker: "B", hangul: "어서 오세요. 자, 논문 주제 얘기를 해 봅시다. 어떤 주제를 생각하고 계세요?", meaning: "Come in. So, let's discuss your thesis topic. What are you thinking?", vi: "Mời em vào. Nào, bàn về đề tài luận văn. Em đang nghĩ chủ đề gì?" },
      { speaker: "A", hangul: "베트남에서의 한국 콘텐츠 수용 양상에 대해 쓰고 싶습니다.", meaning: "I'd like to write about K-content reception in Vietnam.", vi: "Em muốn viết về cách khán giả Việt tiếp nhận nội dung Hàn." },
      { speaker: "B", hangul: "흥미로운 주제이긴 한데, 좀 넓지 않아요? 'K-콘텐츠'가 K-팝, K-드라마, K-영화, K-푸드까지 포함되니까요.", meaning: "Interesting, but isn't it broad? K-content covers K-pop, dramas, films, food…", vi: "Thú vị đấy nhưng hơi rộng phải không? K-content gồm cả K-pop, drama, phim, ẩm thực…" },
      { speaker: "A", hangul: "맞습니다, 교수님. 좀 더 좁히는 것이 좋을 것 같습니다. K-드라마에만 집중하면 어떨까요?", meaning: "True, professor. Narrowing helps. What if I focus only on K-drama?", vi: "Vâng thưa thầy. Em nên thu hẹp lại. Tập trung chỉ K-drama có được không ạ?" },
      { speaker: "B", hangul: "K-드라마도 여전히 큽니다. 그 안에서 어떤 측면을 보고 싶으세요?", meaning: "K-drama is still big. Which angle interests you?", vi: "K-drama vẫn rộng. Em muốn nhìn từ góc nào?" },
      { speaker: "A", hangul: "베트남 20대 여성 시청자가 OTT 플랫폼에서 K-드라마를 소비하는 패턴과 그것이 한국에 대한 인식에 미치는 영향을 보고 싶습니다.", meaning: "How Vietnamese women in their 20s consume K-drama on OTT, and the effect on perceptions of Korea.", vi: "Pattern tiêu thụ K-drama trên OTT của nữ Việt độ tuổi 20, và ảnh hưởng đến hình ảnh Hàn Quốc trong họ." },
      { speaker: "B", hangul: "이제 좁혀졌네요. 좋습니다. 선행 연구는 살펴보셨습니까?", meaning: "Narrowed nicely. Good. Have you looked at prior research?", vi: "Đã hẹp lại tốt. Em đã xem nghiên cứu trước chưa?" },
      { speaker: "A", hangul: "네, 김지수(2022) 논문과 베트남 호치민대학교의 응웬티엔(2023) 논문을 읽었습니다. 두 연구 모두 양적 접근법입니다.", meaning: "Yes — Kim Ji-su (2022) and Nguyen Thi En (2023) of Ho Chi Minh University. Both quantitative.", vi: "Vâng — luận văn Kim Ji-su (2022) và Nguyễn Thị Ên (2023) ĐH HCM. Cả hai đều định lượng." },
      { speaker: "B", hangul: "그럼 차별점이 있어야 하는데, 어떻게 접근하실 계획입니까?", meaning: "Then you need a differentiator. How will you approach it?", vi: "Vậy phải có điểm khác biệt. Em định tiếp cận thế nào?" },
      { speaker: "A", hangul: "심층 면담(질적 방법)을 통해 시청자 30명의 경험을 깊이 분석하고자 합니다.", meaning: "Qualitative — in-depth interviews with 30 viewers.", vi: "Phương pháp định tính — phỏng vấn sâu 30 khán giả." },
      { speaker: "B", hangul: "좋은 접근입니다. 다만 30명 면담은 시간이 오래 걸려요. 6개월 안에 마칠 수 있겠습니까?", meaning: "Good approach. But 30 interviews takes time. Can you finish in 6 months?", vi: "Hướng tốt. Nhưng 30 phỏng vấn mất thời gian. Em làm xong trong 6 tháng được?" },
      { speaker: "A", hangul: "예비 면담을 다음 달부터 시작하면 가능하다고 봅니다. 일정표를 다시 짜서 보내드리겠습니다.", meaning: "If I start pilot interviews next month, yes. I'll send a revised schedule.", vi: "Nếu phỏng vấn thử bắt đầu tháng sau thì khả thi. Em sẽ gửi lại lịch chi tiết." },
      { speaker: "B", hangul: "그게 좋겠어요. 그리고 IRB(연구윤리) 승인도 잊지 마세요.", meaning: "Good. Don't forget IRB approval.", vi: "Như vậy tốt. Đừng quên xin duyệt đạo đức nghiên cứu IRB." },
      { speaker: "A", hangul: "네, 명심하겠습니다. 다음 주까지 수정된 연구 계획서를 보내드리겠습니다.", meaning: "Yes, I'll keep that in mind. Revised proposal next week.", vi: "Em ghi nhớ. Đề cương sửa em sẽ gửi tuần sau." },
      { speaker: "B", hangul: "좋습니다. 머리를 맞대고 좋은 논문 만들어 봅시다.", meaning: "Good. Let's put our heads together and make a fine thesis.", vi: "Tốt. Chúng ta cùng 'chụm đầu' làm luận văn cho ra hồn." },
      { speaker: "A", hangul: "감사합니다, 교수님. 열심히 하겠습니다.", meaning: "Thank you, professor. I'll work hard.", vi: "Cảm ơn thầy. Em sẽ cố gắng." },
    ],
    roleplay_prompts: [
      "Đóng vai sinh viên Việt gặp 지도 교수님 lần đầu để bàn đề tài. Hãy diễn tập câu mở đầu lịch sự, đề xuất TỪ 3 chủ đề (rộng→hẹp) thay vì 1, và mời thầy gợi ý hướng — dùng 하십시오체.",
      "Giáo sư phản biện đề tài quá rộng. Diễn tập cách (a) đồng ý với phản biện một cách lịch sự, (b) đề xuất CÁCH thu hẹp cụ thể, KHÔNG bị động chờ thầy chỉ định. Người Hàn xem chủ động đề xuất là dấu hiệu nghiên cứu sinh giỏi.",
      "Giáo sư bảo lịch 6 tháng quá ngắn. Diễn tập cách (a) trình bày kế hoạch chi tiết để chứng minh khả thi, hoặc (b) lịch sự đề xuất kéo dài thêm 2 tháng — kèm lý do cụ thể. Tránh nói 'thầy nói gì em làm theo' — bị xem là không có chủ kiến.",
    ],
    register_notes:
      "Quan hệ 사제 (thầy-trò) ở Hàn rất chặt — học bổng, recommendation letter, cả việc làm sau tốt nghiệp đều phụ thuộc vào quan hệ này. Toàn bộ 하십시오체. Gọi giáo sư là 교수님 (KHÔNG '선생님' với giáo sư đại học — '선생님' là cho giáo viên phổ thông). Đề cập sinh viên/khóa khác dùng 선배/후배 + 님 với cấp trên: 선배님. Khi không đồng ý với gợi ý của giáo sư, cấu trúc an toàn: '교수님 말씀이 맞습니다. 다만 ~을 함께 고려하면 어떨까요?' (Thầy nói đúng. Tuy nhiên có thể xem xét thêm ~ được không?) — KHÔNG nói thẳng '아닙니다' (sai). Sau buổi gặp gửi email cảm ơn ngắn — văn hóa Hàn ưa appreciate-loop.",
    idiom_glosses: [
      { idiom: "머리를 맞대다", literal: "chụm đầu lại", meaning: "cùng nhau bàn bạc / hợp tác giải quyết", example: "교수님과 머리를 맞대고 논문 주제를 정했습니다." },
      { idiom: "감을 잡다", literal: "nắm được cảm giác", meaning: "hiểu được trọng tâm / nắm được hướng", example: "선행 연구를 읽어 보니 감이 잡힙니다." },
      { idiom: "벽에 부딪히다", literal: "đâm vào tường", meaning: "gặp bế tắc / khó khăn lớn", example: "자료 수집에서 벽에 부딪혔습니다." },
      { idiom: "한 우물을 파다", literal: "đào một cái giếng", meaning: "chuyên sâu một chủ đề thay vì lan man", example: "한 우물을 파야 좋은 논문이 나옵니다." },
    ],
    cultural_notes_vi:
      "Học thuật Hàn Quốc cực hierarchical — 교수님 quyết định nhiều: đề tài, đồng ý cho bảo vệ, viết recommendation, kết nối việc làm. Sinh viên Việt cần biết: (1) ĐẶT LỊCH trước qua email — đừng gõ cửa phòng đột ngột; (2) Mang theo bản in của tài liệu (đề cương, paper tham khảo) — không trông cậy vào laptop; (3) Đến trước 5 phút, chờ ngoài phòng nếu thầy đang họp khác; (4) KHÔNG ngồi xuống cho đến khi thầy mời, KHÔNG uống nước thầy mời cho đến khi thầy uống trước; (5) Sau buổi gặp gửi email cảm ơn ngắn (~3 dòng) — đây là 'face culture' (체면). Quan trọng: thẳng với giáo sư về timeline — Hàn đánh giá cao realistic planning hơn over-promising.",
    tip_advice_vi:
      "Lỗi sinh viên Việt hay mắc: (1) Đề tài quá rộng — học cách trả lời '범위가 어떻게 됩니까?' bằng 1 câu cụ thể (đối tượng + thời gian + phương pháp). (2) Không dám phản biện — giáo sư Hàn THÍCH sinh viên có chủ kiến (nhưng phải lịch sự). Công thức an toàn: '교수님 말씀이 맞습니다. 다만 X도 고려하면 어떨까요?' (3) Đồng ý hết với gợi ý của thầy — bị xem là không có khả năng nghiên cứu độc lập. Thay vào đó: '말씀하신 부분 검토해 보고 다음 미팅 때 답변드리겠습니다.' (Em sẽ nghiên cứu rồi trả lời lần gặp tới.) (4) Quên gửi follow-up email — sau buổi gặp 24h gửi email tóm tắt 3 điểm đã chốt + timeline tiếp theo. // TODO native-review: confirm '말씀하신 부분 검토해 보고' phrasing for student-to-professor pushback.",
    exercises: [
      { type: "fill-blank", question: "교수님, 논문 ___에 대해 상의드리고 싶습니다.", answer: "주제" },
      {
        type: "matching",
        pairs: [
          { hangul: "머리를 맞대다", meaning: "cùng bàn bạc" },
          { hangul: "감을 잡다", meaning: "nắm được hướng" },
          { hangul: "벽에 부딪히다", meaning: "gặp bế tắc" },
          { hangul: "한 우물을 파다", meaning: "chuyên sâu một chủ đề" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Em đồng ý với góp ý của thầy là phạm vi đang quá rộng.", hangul: "주제가 너무 넓다고 지적해 주신 부분 동의합니다." },
    ],
  },

  // 55. Internship negotiation
  {
    id: 55,
    level: "B2",
    title_vi: "Đàm phán điều khoản thực tập",
    title_en: "Internship terms negotiation",
    intro_vi:
      "Cuộc gặp với HR Hàn để chốt điều khoản 인턴십: lương, giờ làm, công việc cụ thể, khả năng được tuyển chính thức (정규직 전환). Sinh viên Việt thường ngại đặt câu hỏi → bị giao việc photocopy 6 tháng. Bài này dạy cách hỏi rõ ràng, lịch sự nhưng không 'mất giá'.",
    vocabulary: [
      { hangul: "인턴십", meaning: "internship" },
      { hangul: "정규직 전환", meaning: "conversion to full-time" },
      { hangul: "근무 시간", meaning: "working hours" },
      { hangul: "급여", meaning: "wages / pay" },
      { hangul: "업무 내용", meaning: "job content" },
      { hangul: "수습 기간", meaning: "probation period" },
      { hangul: "계약서", meaning: "contract" },
      { hangul: "복리 후생", meaning: "benefits / welfare" },
      { hangul: "성과", meaning: "performance / outcome" },
      { hangul: "멘토", meaning: "mentor" },
    ],
    sentences: [
      { korean: "인턴십 관련해서 몇 가지 여쭤봐도 되겠습니까?", romanized: "Inteonsip gwallyeonhaeseo myeotgaji yeojuwobado doegetseumnida?", en: "May I ask a few things about the internship?", vi: "Em xin hỏi vài điều liên quan đến thực tập được không ạ?" },
      { korean: "정규직 전환 가능성이 어떻게 되는지 궁금합니다.", romanized: "Jeonggyujik jeonhwan ganeungseongi eotteoke doeneunji gunggeumhamnida.", en: "I'm curious about conversion to full-time.", vi: "Em muốn biết khả năng chuyển sang chính thức." },
      { korean: "주된 업무 내용을 미리 알려 주시면 감사하겠습니다.", romanized: "Judoen eopmu naeyongeul miri allyeo jusimyeon gamsahagetseumnida.", en: "I'd appreciate knowing the main duties in advance.", vi: "Em sẽ rất biết ơn nếu được biết trước nội dung công việc chính." },
      { korean: "멘토 분이 정해져 있는지 알 수 있을까요?", romanized: "Mento buni jeonghaejyeo inneunji al su isseulkkayo?", en: "May I know if a mentor is assigned?", vi: "Em được biết có mentor được phân công không ạ?" },
      { korean: "제안해 주신 조건 검토 후 다음 주까지 답변드리겠습니다.", romanized: "Jeanhae jusin jogeon geomto hu daeum ju-kkaji dapbyeon-deurigetsseumnida.", en: "After reviewing the proposed terms, I'll reply by next week.", vi: "Sau khi xem xét điều khoản, em sẽ phản hồi trong tuần tới." },
    ],
    dialogue: [
      { speaker: "A", hangul: "인턴십 합격 축하드립니다. 조건 안내해 드리겠습니다.", meaning: "Congrats on the offer. Let me explain the terms." },
      { speaker: "B", hangul: "감사합니다. 몇 가지 여쭤봐도 될까요?", meaning: "Thank you. May I ask a few things?" },
      { speaker: "A", hangul: "물론입니다. 무엇이든 물어보세요.", meaning: "Of course, ask anything." },
      { speaker: "B", hangul: "정규직 전환 가능성이 어떻게 되는지 궁금합니다.", meaning: "I'm curious about full-time conversion." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "응웬 씨, 인턴십 합격 진심으로 축하드립니다. 오늘은 조건을 자세히 안내해 드리려고 합니다.", meaning: "Mr/Ms Nguyen, sincere congratulations on the internship. Today I'll go through the terms in detail.", vi: "Chúc mừng anh/chị Nguyễn được chọn. Hôm nay tôi sẽ trình bày điều khoản chi tiết." },
      { speaker: "B", hangul: "감사합니다. 잘 부탁드립니다.", meaning: "Thank you. I look forward to working together.", vi: "Cảm ơn. Mong được hợp tác." },
      { speaker: "A", hangul: "기간은 6개월, 근무 시간은 주 40시간, 월급은 220만 원입니다. 4대 보험 가입됩니다.", meaning: "Six months, 40-hour week, 2.2M won/month. Four insurances included.", vi: "6 tháng, 40 giờ/tuần, 2,2 triệu won/tháng. Có 4 loại bảo hiểm." },
      { speaker: "B", hangul: "안내 감사합니다. 몇 가지 여쭤봐도 되겠습니까?", meaning: "Thanks for the info. May I ask a few things?", vi: "Cảm ơn. Em xin hỏi vài điều được không?" },
      { speaker: "A", hangul: "네, 무엇이든지요.", meaning: "Yes, anything.", vi: "Vâng, gì cũng được." },
      { speaker: "B", hangul: "주된 업무 내용이 어떻게 되는지 좀 더 구체적으로 알 수 있을까요?", meaning: "Could I get more specifics on the main duties?", vi: "Em có thể biết cụ thể hơn về nội dung công việc chính không?" },
      { speaker: "A", hangul: "베트남 시장 리서치, 한국 본사와의 통역 보조, 그리고 시장 진출 보고서 작성 보조입니다.", meaning: "Vietnam market research, interpretation support for HQ communication, and assisting with market-entry reports.", vi: "Nghiên cứu thị trường Việt, hỗ trợ phiên dịch với trụ sở, và phụ giúp soạn báo cáo gia nhập thị trường." },
      { speaker: "B", hangul: "그렇군요. 멘토 분이 정해져 있는지 알 수 있을까요?", meaning: "I see. Is a mentor assigned?", vi: "Vâng. Có mentor được phân công không ạ?" },
      { speaker: "A", hangul: "네, 박과장님이 멘토를 맡으실 예정입니다. 매주 1회 1대1 미팅이 있습니다.", meaning: "Yes, Manager Park will mentor. Weekly 1-on-1.", vi: "Có, anh trưởng phòng Park sẽ là mentor. Họp 1-1 hàng tuần." },
      { speaker: "B", hangul: "감사합니다. 한 가지 더 여쭙겠습니다. 정규직 전환 가능성이 어떻게 되는지 궁금합니다.", meaning: "Thanks. One more — what's the chance of full-time conversion?", vi: "Cảm ơn. Một điều nữa — khả năng chuyển sang chính thức ra sao?" },
      { speaker: "A", hangul: "성과에 따라 다르지만, 작년 인턴 5명 중 3명이 정규직으로 전환되었습니다.", meaning: "Depends on performance — last year 3 of 5 interns converted.", vi: "Tùy hiệu suất — năm ngoái 3/5 thực tập sinh được nhận chính thức." },
      { speaker: "B", hangul: "참고 감사합니다. 평가 기준은 어떻게 되는지요?", meaning: "Thank you. What are the evaluation criteria?", vi: "Cảm ơn. Tiêu chí đánh giá là gì ạ?" },
      { speaker: "A", hangul: "업무 성과 50%, 한국어 능력 20%, 팀 협업 30%로 종합 평가됩니다.", meaning: "Performance 50%, Korean ability 20%, teamwork 30%.", vi: "Hiệu suất 50%, năng lực tiếng Hàn 20%, làm việc nhóm 30%." },
      { speaker: "B", hangul: "명확하게 말씀해 주셔서 감사합니다. 제안해 주신 조건 검토 후 다음 주 월요일까지 답변드리겠습니다.", meaning: "Thanks for the clarity. After review I'll reply by next Monday.", vi: "Cảm ơn đã trả lời rõ ràng. Sau khi xem xét, em sẽ phản hồi trong thứ Hai tới." },
      { speaker: "A", hangul: "네, 천천히 검토해 보세요. 궁금한 점이 있으시면 언제든 연락 주십시오.", meaning: "Take your time. Call anytime with questions.", vi: "Vâng, anh/chị xem kỹ. Có gì thắc mắc liên hệ bất cứ lúc nào." },
      { speaker: "B", hangul: "친절하게 설명해 주셔서 정말 감사합니다.", meaning: "Truly thank you for the kind explanation.", vi: "Em thật sự cảm ơn vì lời giải thích chu đáo." },
    ],
    roleplay_prompts: [
      "HR Hàn vừa offer thực tập 6 tháng nhưng KHÔNG nói rõ công việc cụ thể. Diễn tập 3 câu hỏi (업무 내용, 멘토, 정규직 전환) bằng 하십시오체 — lịch sự nhưng kiên định, không bỏ qua bất kỳ câu nào vì ngại.",
      "Lương offer 180만 원 — thấp hơn mức trung bình của ngành (220만). Diễn tập câu hỏi/đề xuất tăng lương lịch sự — KHÔNG nói trực tiếp 'lương quá thấp'; dùng cấu trúc 'tham khảo thị trường, em được biết mức trung bình là X, có thể xem xét điều chỉnh không?'",
      "Sau buổi đàm phán, bạn quyết định ĐỒNG Ý nhưng yêu cầu thêm 1 điều khoản (vd: cho phép làm thêm ngoài giờ tối đa 10h/tuần để học tiếng Hàn). Diễn tập email gửi HR — chốt acceptance + nêu yêu cầu lịch sự — bằng 하십시오체.",
    ],
    register_notes:
      "Buổi đàm phán internship dù 'chỉ là internship' vẫn 하십시오체 vì HR là 인사팀 chuyên nghiệp + bạn chưa được nhận. Cấu trúc câu hỏi an toàn: '~에 대해 여쭤봐도 되겠습니까?' (Em được hỏi về ~ không ạ?) — formal hơn '~에 대해 알 수 있을까요?'. Đề cập tiền tránh dùng từ 돈 (tiền — quá thẳng) — dùng 급여 (lương) hoặc 처우 (đãi ngộ). Khi cần thời gian suy nghĩ: '검토 후 답변드리겠습니다' (Sau khi xem xét sẽ trả lời) — KHÔNG '생각해 볼게요' (해요체 — quá thân, không phù hợp với HR). Sau buổi gặp gửi email cảm ơn trong vòng 24h — đây là 'face culture' và cũng là cơ hội xác nhận lại các điểm đã thảo luận bằng văn bản.",
    idiom_glosses: [
      { idiom: "발걸음을 떼다", literal: "nhấc bước chân", meaning: "bước đi đầu tiên trong sự nghiệp", example: "이번 인턴십이 사회 진출의 첫 발걸음이 될 것입니다." },
      { idiom: "어깨가 무겁다", literal: "vai nặng trĩu", meaning: "trách nhiệm lớn — dùng khi nhận vai trò quan trọng", example: "큰 프로젝트를 맡아 어깨가 무겁습니다." },
      { idiom: "기회를 놓치다", literal: "bỏ lỡ cơ hội", meaning: "đánh mất chance", example: "이 기회를 놓치고 싶지 않습니다." },
      { idiom: "발 벗고 나서다", literal: "cởi giày xông tới", meaning: "sẵn sàng dấn thân hết mình", example: "발 벗고 나서서 회사에 기여하겠습니다." },
    ],
    cultural_notes_vi:
      "Internship Hàn có 2 dạng chính: (1) 정규직 전환형 — có lộ trình thành nhân viên chính thức (gắt nhất, cạnh tranh nội bộ); (2) 체험형 — chỉ trải nghiệm, ít chance lên chính thức. PHẢI hỏi rõ trước khi ký. Mức lương internship thị trường Hàn 2026: 220-280만 원/tháng cho đại học đã tốt nghiệp; 180-220만 cho sinh viên năm cuối. Thấp hơn 180만 = bóc lột (착취), nên cảnh giác. Sinh viên Việt hay phạm sai lầm: (a) đồng ý ngay không hỏi gì → bị giao việc photocopy 6 tháng; (b) hỏi quá nhiều về lương trong buổi đầu → mang tiếng 'tham tiền'. Cân bằng: hỏi đủ 3-5 điều cốt lõi (업무, 멘토, 정규직, 평가, 시간), GỘP câu hỏi lương vào câu '복리후생' (welfare/benefits) cho khéo. Sau internship, dù không lên chính thức, vẫn nên giữ liên lạc với mentor — Hàn ngành nhỏ, có thể giới thiệu công ty khác sau này.",
    tip_advice_vi:
      "Trước buổi đàm phán: (1) Nghiên cứu mức lương thị trường ngành (잡코리아, 사람인 search 'OO업종 인턴 급여'); (2) Chuẩn bị 5-7 câu hỏi viết sẵn — sắp theo độ ưu tiên; (3) Mang theo giấy tờ: 이력서, 자기소개서, 성적증명서 photocopy. Trong buổi: (a) Cảm ơn offer trước rồi mới hỏi — không vào thẳng câu hỏi; (b) Ghi chú trong sổ tay (KHÔNG laptop — Hàn xem laptop trong họp 1-1 là không tôn trọng); (c) Tóm tắt cuối buổi: 'X, Y, Z — 맞으십니까?' để xác nhận. Sau buổi: gửi email cảm ơn trong 24h, kèm 1-2 câu hỏi follow-up nếu có. Câu vàng để dời quyết định: '검토 후 다음 주 월요일까지 답변드리겠습니다.' — đừng quyết ngay tại bàn.",
    exercises: [
      { type: "fill-blank", question: "정규직 ___ 가능성이 어떻게 되는지 궁금합니다.", answer: "전환" },
      {
        type: "matching",
        pairs: [
          { hangul: "발걸음을 떼다", meaning: "bước đi đầu tiên" },
          { hangul: "어깨가 무겁다", meaning: "trách nhiệm lớn" },
          { hangul: "기회를 놓치다", meaning: "bỏ lỡ cơ hội" },
          { hangul: "발 벗고 나서다", meaning: "dấn thân hết mình" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Sau khi xem xét điều khoản, em sẽ phản hồi trong tuần tới.", hangul: "조건을 검토한 후 다음 주까지 답변드리겠습니다." },
    ],
  },

  // 56. Email to study-abroad office about visa
  {
    id: 56,
    level: "B2",
    title_vi: "Email gửi văn phòng quốc tế về visa du học",
    title_en: "Email to international office about study visa",
    intro_vi:
      "Email tới 국제처 (văn phòng quốc tế của trường Hàn) hỏi tài liệu visa D-2. Đây là loại email tiếng Hàn quan trọng nhất với sinh viên Việt — sai cấu trúc bị xem là không chuyên nghiệp, có thể delay nhập học. Tập trung vào: chủ đề (제목), câu mở, nội dung gọn-rõ, câu kết, chữ ký.",
    vocabulary: [
      { hangul: "국제처", meaning: "international office" },
      { hangul: "유학 비자", meaning: "study visa" },
      { hangul: "표준 입학 허가서", meaning: "Certificate of Admission (visa form)" },
      { hangul: "재정 보증서", meaning: "financial guarantee" },
      { hangul: "입국일", meaning: "date of entry" },
      { hangul: "비자 신청", meaning: "visa application" },
      { hangul: "관련 서류", meaning: "related documents" },
      { hangul: "입학 확정", meaning: "admission confirmation" },
      { hangul: "회신", meaning: "reply" },
      { hangul: "수신자", meaning: "recipient" },
    ],
    sentences: [
      { korean: "국제처 담당자님께 안녕하십니까.", romanized: "Gukjecheo damdangja-nimkke annyeonghasimnikka.", en: "Hello to the international office officer.", vi: "Kính gửi quý anh/chị phụ trách văn phòng quốc tế." },
      { korean: "2026년도 가을학기 신입생 응웬티란이라고 합니다.", romanized: "Icheoniyungnyeondo gaeul hakgi sinipsaeng Eungwentiranirago hamnida.", en: "I'm Nguyen Thi Lan, fall 2026 incoming student.", vi: "Em là Nguyễn Thị Lan, tân sinh viên kỳ thu 2026." },
      { korean: "유학 비자(D-2) 신청에 필요한 서류 안내를 부탁드립니다.", romanized: "Yuhak bija(D-2) sincheonge piryohan seoryu annaereul butak-deurimnida.", en: "Please advise on documents needed for the D-2 visa application.", vi: "Em xin được hướng dẫn tài liệu cần thiết cho hồ sơ visa D-2." },
      { korean: "표준 입학 허가서는 언제쯤 발급되는지 여쭙고 싶습니다.", romanized: "Pyojun ipak heogaseoneun eonjejjeum balgeupdoeneunji yeojupgo sipseumnida.", en: "When will the Certificate of Admission be issued?", vi: "Em xin hỏi Giấy chứng nhận nhập học chuẩn được phát hành khi nào." },
      { korean: "회신 기다리겠습니다. 감사합니다.", romanized: "Hoesin gidarigetsseumnida. Gamsahamnida.", en: "I look forward to your reply. Thank you.", vi: "Em chờ phản hồi. Xin cảm ơn." },
    ],
    dialogue: [
      { speaker: "A", hangul: "안녕하십니까. 합격 후 비자 서류 안내 부탁드립니다.", meaning: "Hello. Post-acceptance — please advise on visa documents." },
      { speaker: "B", hangul: "안녕하세요. 표준 입학 허가서는 8월 1일 발급 예정입니다.", meaning: "Hello. Certificate of Admission will be issued Aug 1." },
      { speaker: "A", hangul: "감사합니다. 재정 보증서도 학교에서 발급해 주시는지요?", meaning: "Thank you. Does the school issue the financial guarantee too?" },
      { speaker: "B", hangul: "재정 보증서는 본인이 한국 영사관에 직접 제출하시면 됩니다.", meaning: "The financial guarantee you submit directly to the consulate." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "제목: [2026년도 가을학기 신입생] 유학 비자 D-2 서류 문의 — 응웬티란", meaning: "Subject: [2026 Fall incoming student] D-2 visa document inquiry — Nguyen Thi Lan", vi: "Tiêu đề: [Tân sinh viên kỳ thu 2026] Hỏi tài liệu visa D-2 — Nguyễn Thị Lan" },
      { speaker: "A", hangul: "국제처 담당자님께 안녕하십니까.", meaning: "Hello to the international office.", vi: "Kính gửi văn phòng quốc tế." },
      { speaker: "A", hangul: "저는 2026년도 가을학기 한국학과 신입생 응웬티란이라고 합니다.", meaning: "I'm Nguyen Thi Lan, fall 2026 Korean Studies incoming student.", vi: "Em là Nguyễn Thị Lan, tân sinh viên ngành Hàn Quốc học kỳ thu 2026." },
      { speaker: "A", hangul: "유학 비자(D-2) 신청을 준비하고 있는데, 학교에서 발급하는 표준 입학 허가서가 언제 발급되는지 여쭙고자 메일 드립니다.", meaning: "I'm preparing the D-2 visa application and write to ask when the Certificate of Admission will be issued.", vi: "Em đang chuẩn bị hồ sơ visa D-2 và xin hỏi Giấy chứng nhận nhập học chuẩn của trường được phát hành khi nào." },
      { speaker: "A", hangul: "또한 비자 신청에 필요한 다른 서류 목록도 안내해 주시면 감사하겠습니다.", meaning: "Also, I'd appreciate the full list of required documents.", vi: "Đồng thời em xin được hướng dẫn danh mục đầy đủ giấy tờ cần nộp." },
      { speaker: "A", hangul: "회신 기다리겠습니다. 감사합니다. 응웬티란 드림.", meaning: "Awaiting reply. Thanks. Nguyen Thi Lan.", vi: "Em chờ phản hồi. Xin cảm ơn. Nguyễn Thị Lan kính thư." },
      { speaker: "B", hangul: "안녕하세요, 응웬티란 학생.", meaning: "Hello, student Nguyen Thi Lan.", vi: "Chào em Nguyễn Thị Lan." },
      { speaker: "B", hangul: "표준 입학 허가서는 등록금 납부 확인 후 8월 1일 발급될 예정입니다. 등록금 납부 마감일은 7월 25일입니다.", meaning: "The certificate is issued Aug 1 after tuition payment. Tuition deadline: July 25.", vi: "Giấy chứng nhận nhập học chuẩn sẽ được phát hành 1/8 sau khi xác nhận đóng học phí. Hạn đóng: 25/7." },
      { speaker: "B", hangul: "비자 신청 시 필요 서류는 다음과 같습니다: 표준 입학 허가서, 재정 보증서, 여권 사본, 사진 1장, 한국어 능력 증명서.", meaning: "Visa requires: Certificate of Admission, financial guarantee, passport copy, 1 photo, Korean ability certificate.", vi: "Hồ sơ visa cần: Giấy nhập học chuẩn, chứng minh tài chính, sao hộ chiếu, 1 ảnh, chứng chỉ tiếng Hàn." },
      { speaker: "B", hangul: "재정 보증서는 학교에서 발급하지 않습니다. 본인이 은행에서 영문으로 발급받아 한국 영사관에 직접 제출하시면 됩니다.", meaning: "Financial guarantee not issued by us — get it from your bank in English and submit to the consulate.", vi: "Chứng minh tài chính trường không cấp. Em làm tại ngân hàng bằng tiếng Anh và nộp trực tiếp lãnh sự quán." },
      { speaker: "B", hangul: "추가 문의사항 있으시면 언제든 연락 주세요. 감사합니다.", meaning: "Any further questions, contact anytime. Thanks.", vi: "Còn thắc mắc liên hệ bất cứ lúc nào. Cảm ơn." },
      { speaker: "A", hangul: "제목: Re: [2026년도 가을학기 신입생] 유학 비자 D-2 서류 문의 — 응웬티란", meaning: "Subject: Re: [Fall 2026 incoming] D-2 visa inquiry — Nguyen Thi Lan", vi: "Tiêu đề: Re: [Tân sinh viên kỳ thu 2026] Hỏi tài liệu visa D-2 — Nguyễn Thị Lan" },
      { speaker: "A", hangul: "안녕하세요. 빠른 회신 감사드립니다.", meaning: "Hello. Thank you for the quick reply.", vi: "Chào quý anh/chị. Cảm ơn phản hồi nhanh." },
      { speaker: "A", hangul: "안내 잘 받았습니다. 등록금은 다음 주 화요일까지 납부하겠습니다.", meaning: "I received the info. I'll pay tuition by next Tuesday.", vi: "Em đã nhận hướng dẫn. Em sẽ đóng học phí vào thứ Ba tuần sau." },
      { speaker: "A", hangul: "한 가지 더 여쭙고 싶습니다. 입국일을 8월 25일로 예정하고 있는데, 기숙사 입주는 그날부터 가능한지요?", meaning: "One more — entry date Aug 25, can I move into the dorm that day?", vi: "Em xin hỏi thêm — em dự kiến nhập cảnh 25/8, ngày đó vào ký túc xá được không ạ?" },
      { speaker: "A", hangul: "다시 한 번 도움 주셔서 감사드립니다. 응웬티란 드림.", meaning: "Thanks again for the help. Nguyen Thi Lan.", vi: "Em xin cảm ơn lần nữa. Nguyễn Thị Lan kính thư." },
    ],
    roleplay_prompts: [
      "Soạn email gửi 국제처 hỏi 3 thông tin: (1) thời gian phát hành 표준 입학 허가서, (2) danh sách giấy tờ visa D-2, (3) thời gian được vào ký túc xá. Cấu trúc: tiêu đề → câu chào → giới thiệu bản thân (1 dòng) → 3 câu hỏi RÕ RÀNG → câu kết → chữ ký.",
      "Đã 1 tuần kể từ email đầu mà chưa có phản hồi. Soạn email follow-up lịch sự — KHÔNG nói 'tại sao chưa trả lời', dùng 'bận quá nên có thể bỏ sót — em xin gửi lại để được hỗ trợ' bằng 하십시오체.",
      "Phát hiện điền sai số hộ chiếu trong hồ sơ visa đã gửi đại sứ quán. Soạn email cấp tốc tới 국제처 nhờ trường viết thư xác nhận đính chính — cấu trúc khẩn cấp nhưng vẫn formal, bắt đầu với '죄송합니다만 긴급한 사안이 있어 메일 드립니다'.",
    ],
    register_notes:
      "Email tiếng Hàn formal có cấu trúc CỐ ĐỊNH: (1) 제목 (subject) bao gồm [thẻ phân loại] + nội dung + tên người gửi; (2) câu chào: '~님께 안녕하십니까' (formal nhất) hoặc '안녕하세요' (formal vừa); (3) tự giới thiệu 1 dòng — quan trọng vì cán bộ trường nhận hàng trăm email/ngày; (4) nội dung — gọn, KHÔNG dùng đoạn dài >5 dòng, dùng bullet hoặc gạch đầu dòng nếu nhiều câu hỏi; (5) câu kết: '회신 기다리겠습니다. 감사합니다.' hoặc '바쁘신 와중에 시간 내 주셔서 감사합니다.'; (6) chữ ký: 'XXX 드림' (lễ phép) hoặc 'XXX 올림' (lễ phép cao hơn). KHÔNG dùng emoji, KHÔNG '!!!', KHÔNG cảm thán. Khi reply lại, giữ tiêu đề có 'Re:' và câu chào lịch sự — đừng bỏ trực tiếp vào nội dung. // TODO native-review: '드림' vs '올림' for student-to-staff register choice.",
    idiom_glosses: [
      { idiom: "발등에 불이 떨어지다", literal: "lửa rơi xuống mu bàn chân", meaning: "việc gấp / khẩn cấp đến nơi", example: "비자 마감일이 다가와 발등에 불이 떨어졌습니다." },
      { idiom: "확인 사살하다", literal: "bắn xác nhận", meaning: "kiểm tra lại lần nữa cho chắc — colloquial", example: "메일을 보내기 전에 확인 사살하세요." },
      { idiom: "한 번 더 짚어 보다", literal: "kiểm tra lại một lần nữa", meaning: "rà soát lần cuối — formal hơn 확인 사살", example: "서류를 한 번 더 짚어 보고 제출하겠습니다." },
      { idiom: "꼼꼼히 챙기다", literal: "cẩn thận thu xếp đủ", meaning: "chuẩn bị chu đáo từng chi tiết", example: "비자 서류는 꼼꼼히 챙겨야 합니다." },
    ],
    cultural_notes_vi:
      "Email là phương tiện chính ở trường Hàn — KHÔNG nhắn KakaoTalk cán bộ trường (kể cả khi có số), KHÔNG gọi điện trừ khi khẩn cấp. Cán bộ 국제처 nhận 50-100 email/ngày — email có cấu trúc rõ ràng được trả lời trong 1-2 ngày làm việc; email lộn xộn bị skip. Mẹo nhỏ: tiêu đề có [thẻ phân loại] giúp họ dễ tìm — '[2026년도 가을학기 신입생]' hoặc '[D-2 비자 문의]'. Thời gian phản hồi tiêu chuẩn ở Hàn: trong 24-48h giờ làm việc — nếu sau 5 ngày chưa có reply, gửi follow-up lịch sự. Hai sai lầm thường gặp của sinh viên Việt: (a) viết quá dài 10+ dòng → cán bộ không đọc hết; (b) hỏi 5-6 việc cùng lúc làm rối → tách thành 2-3 email theo chủ đề. Quan trọng: lưu mọi email phản hồi của trường — khi đại sứ quán hỏi, có evidence để show.",
    tip_advice_vi:
      "Tiêu đề là yếu tố quyết định email được mở hay không. Format chuẩn: [phân loại] nội dung — tên. VD: '[2026년도 신입생] D-2 비자 서류 문의 — 응웬티란'. Câu mở 'X님께 안녕하십니까' formal hơn 'X님 안녕하세요' — dùng cái formal nhất với cán bộ trường. Tự giới thiệu phải có: tên, năm/kỳ nhập học, ngành — để họ tra cứu hồ sơ. Câu hỏi nên DÙNG SỐ ((1), (2), (3)) thay vì đoạn dài — Hàn ưa cấu trúc rõ. Câu kết '회신 기다리겠습니다' (chờ phản hồi — formal) không '답장 부탁드립니다' (xin reply — quá thân). Chữ ký '드림' phù hợp sinh viên gửi cán bộ; '올림' khi gửi giáo sư hoặc cấp rất cao. Trước khi gửi: kiểm tra kỹ tên người nhận — gõ nhầm 박 thành 박 (tự sửa autocomplete) là chuyện không hiếm.",
    exercises: [
      { type: "fill-blank", question: "유학 비자 신청에 필요한 서류 ___ 부탁드립니다.", answer: "안내를" },
      {
        type: "matching",
        pairs: [
          { hangul: "발등에 불이 떨어지다", meaning: "việc gấp đến nơi" },
          { hangul: "확인 사살하다", meaning: "kiểm tra lại lần nữa" },
          { hangul: "한 번 더 짚어 보다", meaning: "rà soát lần cuối" },
          { hangul: "꼼꼼히 챙기다", meaning: "chuẩn bị chu đáo" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Em chờ phản hồi của anh/chị. Xin cảm ơn.", hangul: "회신 기다리겠습니다. 감사합니다." },
    ],
  },

  // 57. Phone interview from Vietnam to Korean employer
  {
    id: 57,
    level: "B2",
    title_vi: "Phỏng vấn qua điện thoại với nhà tuyển dụng Hàn",
    title_en: "Phone interview with Korean employer from Vietnam",
    intro_vi:
      "Phỏng vấn qua điện thoại từ Việt Nam (E7 visa application) — nhà tuyển dụng Hàn không thấy mặt nên TIẾNG NÓI và sự rõ ràng của tiếng Hàn quan trọng gấp đôi phỏng vấn trực tiếp. Phổ biến cho vị trí nhân viên kỹ thuật Samsung Hai Phong, LG Display, kỹ sư phần mềm dispatch sang Seoul.",
    vocabulary: [
      { hangul: "전화 면접", meaning: "phone interview" },
      { hangul: "통화 품질", meaning: "call quality" },
      { hangul: "잘 들리시나요", meaning: "Can you hear me well? (formal)" },
      { hangul: "다시 말씀해 주십시오", meaning: "Please say that again (formal)" },
      { hangul: "재직 증명서", meaning: "certificate of employment" },
      { hangul: "지원서", meaning: "application form" },
      { hangul: "포지션", meaning: "position" },
      { hangul: "비자 후원", meaning: "visa sponsorship" },
      { hangul: "예상 입사일", meaning: "expected start date" },
      { hangul: "기술 면접", meaning: "technical interview" },
    ],
    sentences: [
      { korean: "여보세요, 응웬티란입니다. 잘 들리시나요?", romanized: "Yeoboseyo, Eungwentiranimnida. Jal deullisinayo?", en: "Hello, this is Nguyen Thi Lan. Can you hear me well?", vi: "A lô, em là Nguyễn Thị Lan. Anh/chị nghe rõ không ạ?" },
      { korean: "통화가 잘 안 들리는데 다시 말씀해 주시겠습니까?", romanized: "Tonghwaga jal an deullineunde dasi malsseumhae jusigetsseumnikka?", en: "I can't hear well, could you repeat?", vi: "Em nghe không rõ, anh/chị nói lại được không ạ?" },
      { korean: "베트남 시간으로는 오후 3시입니다.", romanized: "Beteunam siganeuroneun ohu 3-siimnida.", en: "It's 3 PM Vietnam time.", vi: "Giờ Việt Nam là 3 giờ chiều." },
      { korean: "E7 비자 후원이 가능한지 확인하고 싶습니다.", romanized: "E7 bija huwoni ganeunghanji hwaginhago sipseumnida.", en: "I'd like to confirm E7 visa sponsorship is available.", vi: "Em muốn xác nhận có thể bảo lãnh visa E7 không." },
      { korean: "오늘 시간 내 주셔서 정말 감사드립니다.", romanized: "Oneul sigan nae jusyeoseo jeongmal gamsadeurimnida.", en: "Thank you sincerely for your time today.", vi: "Em chân thành cảm ơn anh/chị đã dành thời gian hôm nay." },
    ],
    dialogue: [
      { speaker: "A", hangul: "여보세요. 응웬티란 씨이신가요?", meaning: "Hello, is this Ms. Nguyen?" },
      { speaker: "B", hangul: "네, 안녕하십니까. 응웬티란입니다. 잘 들리시나요?", meaning: "Yes, hello. Nguyen Thi Lan speaking. Can you hear me?" },
      { speaker: "A", hangul: "네, 잘 들립니다. 면접 시작해도 될까요?", meaning: "Yes, well. Shall we begin?" },
      { speaker: "B", hangul: "네, 준비됐습니다.", meaning: "Yes, I'm ready." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "여보세요, 응웬티란 씨 되십니까?", meaning: "Hello, is this Ms. Nguyen?", vi: "A lô, có phải chị Nguyễn không ạ?" },
      { speaker: "B", hangul: "네, 안녕하십니까. 응웬티란입니다. 잘 들리시나요?", meaning: "Yes, hello. Nguyen Thi Lan. Can you hear me?", vi: "Vâng, em chào anh/chị. Em là Nguyễn Thị Lan. Anh/chị nghe rõ không ạ?" },
      { speaker: "A", hangul: "네, 잘 들립니다. 저는 한국 본사 인사팀의 박미나입니다. 오늘 30분 정도 시간 괜찮으십니까?", meaning: "Yes. I'm Park Mi-na, HQ HR. Do you have ~30 minutes?", vi: "Vâng. Tôi là Park Mi-na, phòng Nhân sự trụ sở. Chị có khoảng 30 phút không?" },
      { speaker: "B", hangul: "네, 준비됐습니다. 시작해 주십시오.", meaning: "Yes, I'm ready. Please begin.", vi: "Vâng, em đã sẵn sàng. Mời anh/chị bắt đầu." },
      { speaker: "A", hangul: "먼저 자기소개 1분 정도 부탁드립니다.", meaning: "First, ~1 minute self-introduction please.", vi: "Đầu tiên, mời chị giới thiệu bản thân khoảng 1 phút." },
      { speaker: "B", hangul: "네. 응웬티란입니다. 하노이 공과대학교 컴퓨터공학과를 졸업했고, 현재 베트남 IT 회사에서 백엔드 개발자로 3년째 근무하고 있습니다.", meaning: "Yes. I graduated CS at Hanoi University of Technology, working 3 years as backend developer at a Vietnamese IT firm.", vi: "Vâng. Em là Nguyễn Thị Lan, tốt nghiệp CNTT ĐH Bách Khoa Hà Nội, hiện đang là backend dev 3 năm tại công ty IT Việt Nam." },
      { speaker: "A", hangul: "한국 본사 포지션에 지원하신 동기가 무엇입니까?", meaning: "What's your motivation for HQ position?", vi: "Lý do chị ứng tuyển vị trí trụ sở là gì?" },
      { speaker: "B", hangul: "한국 IT 산업의 글로벌 표준 기술을 직접 경험하고 싶었습니다. 또한 한·베 IT 협업 프로젝트에 기여할 수 있다고 생각합니다.", meaning: "I wanted to experience global IT standards firsthand and contribute to Korea-Vietnam IT collaboration.", vi: "Em muốn trực tiếp trải nghiệm công nghệ chuẩn toàn cầu của ngành IT Hàn và đóng góp cho hợp tác IT Hàn-Việt." },
      { speaker: "A", hangul: "음... 통화가 잠깐 끊겼는데 다시 말씀해 주시겠어요?", meaning: "Hmm, the call cut off — could you repeat?", vi: "Ừm, vừa rồi mất tín hiệu — chị nói lại được không?" },
      { speaker: "B", hangul: "네, 죄송합니다. 한국 IT의 글로벌 기술을 경험하고 한·베 협업에 기여하고 싶다는 의미였습니다.", meaning: "Sorry. I meant: experience Korean IT's global tech and contribute to Korea-Vietnam collaboration.", vi: "Vâng, em xin lỗi. Ý em là: trải nghiệm công nghệ toàn cầu của IT Hàn và đóng góp hợp tác Hàn-Việt." },
      { speaker: "A", hangul: "이해했습니다. 기술 질문 하나 드리겠습니다. Spring Boot에서 트랜잭션 전파 옵션 중 REQUIRES_NEW와 NESTED의 차이를 설명해 주십시오.", meaning: "Got it. Tech question: in Spring Boot, explain REQUIRES_NEW vs NESTED transaction propagation.", vi: "Em rõ. Câu hỏi kỹ thuật: trong Spring Boot, giải thích khác biệt giữa REQUIRES_NEW và NESTED?" },
      { speaker: "B", hangul: "REQUIRES_NEW는 항상 새로운 트랜잭션을 시작하고 기존 트랜잭션을 일시 정지합니다. NESTED는 기존 트랜잭션 내에서 savepoint를 만들어 부분 롤백이 가능합니다.", meaning: "REQUIRES_NEW always starts a new transaction and suspends the existing one. NESTED creates a savepoint inside the existing transaction, enabling partial rollback.", vi: "REQUIRES_NEW luôn bắt đầu transaction mới và tạm dừng cái cũ. NESTED tạo savepoint trong transaction hiện tại — rollback một phần được." },
      { speaker: "A", hangul: "정확합니다. 이번 포지션은 E7 비자 후원이 가능합니다. 한국 입국이 가능한 가장 빠른 시기는 언제이십니까?", meaning: "Correct. This position offers E7 visa sponsorship. Earliest possible Korea entry?", vi: "Đúng. Vị trí này có thể bảo lãnh E7. Chị có thể nhập Hàn sớm nhất khi nào?" },
      { speaker: "B", hangul: "현재 회사 인수인계를 한 달 정도 마치면, 비자 발급 후 약 두 달 안에 입국 가능합니다.", meaning: "After 1-month handover and visa issuance, ~2 months total.", vi: "Sau khi bàn giao 1 tháng và visa được cấp, khoảng 2 tháng tổng cộng." },
      { speaker: "A", hangul: "좋습니다. 마지막으로 질문 있으십니까?", meaning: "Good. Final questions?", vi: "Tốt. Cuối cùng, chị có câu hỏi không?" },
      { speaker: "B", hangul: "네, 두 가지 여쭙고 싶습니다. 첫째, 입사 후 한국어 교육 지원이 있습니까? 둘째, 베트남 출장 가능성이 어느 정도 됩니까?", meaning: "Two — Korean language support after joining? Vietnam business trip frequency?", vi: "Em xin hỏi hai điều — có hỗ trợ học tiếng Hàn sau khi vào không? Tần suất công tác về Việt Nam?" },
      { speaker: "A", hangul: "어학 지원은 회사 비용으로 주 2회 수업이 있고, 베트남 출장은 분기당 1-2회 정도입니다. 결과는 일주일 내 메일로 안내드리겠습니다.", meaning: "Language: 2 classes/week, company-paid. Vietnam trips: 1-2 per quarter. Result by email within a week.", vi: "Tiếng Hàn: 2 buổi/tuần, công ty trả phí. Công tác Việt: 1-2 lần/quý. Kết quả qua email trong 1 tuần." },
      { speaker: "B", hangul: "친절하게 답변해 주셔서 정말 감사드립니다. 안녕히 계십시오.", meaning: "Sincere thanks for the kind answers. Goodbye.", vi: "Chân thành cảm ơn anh/chị đã trả lời chu đáo. Tạm biệt." },
    ],
    roleplay_prompts: [
      "Đầu cuộc phỏng vấn, đường truyền không tốt. Diễn tập câu xin lặp lại thông tin lịch sự (3 lần): '죄송하지만 다시 한 번 말씀해 주시겠습니까?' — KHÔNG sợ hỏi lại; xin rõ tốt hơn trả lời sai.",
      "HR hỏi 'mức lương kỳ vọng của chị?'. Diễn tập câu trả lời thông minh: KHÔNG đưa con số ngay (sai chiến lược) — đề nghị họ chia sẻ range trước, hoặc dùng cấu trúc 'tham khảo thị trường ngành tôi nghĩ X-Y triệu won, nhưng tổng gói cũng quan trọng' bằng 하십시오체.",
      "Cuối cuộc gọi, HR đề nghị offer ngay tại bàn điện thoại với deadline 3 ngày. Diễn tập câu LỊCH SỰ XIN THÊM THỜI GIAN: 'cảm ơn lời mời, em xin được xem xét và trả lời chính thức trong 1 tuần — vì cần thông báo công ty hiện tại'. Tránh gây cảm giác bạn từ chối.",
    ],
    register_notes:
      "Phỏng vấn điện thoại MẤT KÊNH HÌNH — bù bằng tiếng nói chuẩn xác và cấu trúc câu rõ ràng. Mở cuộc gọi BẮT BUỘC kiểm tra âm thanh: '잘 들리시나요?' (Anh/chị nghe rõ không?) — chứng tỏ chuyên nghiệp và tránh hiểu lầm sau. KHÔNG nói '여보세요' nhiều lần (chỉ 1 lần ở đầu) — giữ 하십시오체 toàn bộ. Khi mất tín hiệu hoặc không nghe rõ: '죄송하지만 통화가 잘 안 들리는데 다시 한 번 말씀해 주시겠습니까?' (Xin lỗi nhưng đường truyền không rõ, anh/chị nói lại được không ạ?) — KHÔNG đoán mò rồi trả lời sai. Khi đầu bên kia ngắt, KHÔNG ngắt lời — chờ họ kết câu rồi đợi 1 nhịp ngắn để chắc rằng họ đã xong. Cuối gọi LUÔN nói '안녕히 계십시오' (Tạm biệt — bên ở lại) chứ không '안녕히 가세요' (bên đi). // TODO native-review: '안녕히 계십시오' / '안녕히 가십시오' choice for end-of-call from caller side.",
    idiom_glosses: [
      { idiom: "귀를 기울이다", literal: "nghiêng tai", meaning: "lắng nghe chăm chú", example: "면접관 말씀에 귀를 기울이고 있습니다." },
      { idiom: "말꼬리를 흐리다", literal: "đuôi câu mờ đi", meaning: "nói lấp lửng cuối câu — bị xem là thiếu tự tin, NÊN TRÁNH", example: "면접에서 말꼬리를 흐리지 마세요." },
      { idiom: "분위기를 잡다", literal: "nắm bầu không khí", meaning: "kiểm soát mạch cuộc trò chuyện — tích cực", example: "긴장하지 말고 분위기를 잡으세요." },
      { idiom: "감을 잡다", literal: "nắm cảm giác", meaning: "nắm được hướng / tone của cuộc gọi", example: "면접관이 어떤 답을 원하는지 감을 잡아야 합니다." },
    ],
    cultural_notes_vi:
      "Phỏng vấn điện thoại Hàn Quốc khác với phỏng vấn online (Zoom): không có hình → mọi áp lực dồn lên TIẾNG. Người Hàn cực kỳ chú trọng vào: (1) cách phát âm — nuốt âm cuối ('-ㄴ다' thành '~다') = bị xem như tiếng Hàn yếu; (2) tốc độ — chậm rõ tốt hơn nhanh nhưng nuốt âm; (3) im lặng giữa câu — nghĩ 1-2s rồi nói tốt hơn 'à... ờ...'. Chuẩn bị: (a) gọi thử số điện thoại quốc tế trước 1 ngày — kiểm tra chất lượng; (b) ngồi nơi yên tĩnh, không restaurant/cafe; (c) tai nghe có mic tốt + điện thoại sạc đầy; (d) giấy bút sẵn để ghi note; (e) đồng hồ Việt+Hàn — biết múi giờ chính xác. Nếu mất tín hiệu giữa chừng — KHÔNG hoảng — gọi lại sau 30s với câu '죄송합니다, 통화가 끊겼습니다' (Xin lỗi, cuộc gọi bị ngắt). Người Hàn hiểu vấn đề kỹ thuật, không trừ điểm vì điều này, miễn xử lý chuyên nghiệp.",
    tip_advice_vi:
      "Trước cuộc gọi 30 phút: uống nước ấm (mở thanh quản), tránh cà phê (gây run), không ăn no (giảm tốc độ trí não). Trong cuộc gọi: (1) Nói chậm hơn bình thường ~10% — tiếng Hàn người Việt thường hay nuốt âm khi căng thẳng; (2) Mở câu trả lời bằng từ 'gãy' rõ: '네,' rồi 1 nhịp ngắn → câu trả lời. Tránh '음...', 'ㅇㅇ' (lấp khoảng); (3) Khi không hiểu câu hỏi: KHÔNG đoán — hỏi lại '죄송하지만 한 번 더 말씀해 주시겠습니까?'. Một lần xin lặp KHÔNG bị trừ điểm; trả lời sai vì hiểu sai bị trừ NẶNG; (4) Câu hỏi cuối: hỏi cụ thể về VIỆC LÀM (training, mentor, growth path) — không hỏi lương ở vòng phone. Sau cuộc gọi: gửi email 'thank you' trong 24h — Hàn xem là 'face culture'.",
    exercises: [
      { type: "fill-blank", question: "여보세요, 응웬티란입니다. 잘 ___시나요?", answer: "들리" },
      {
        type: "matching",
        pairs: [
          { hangul: "귀를 기울이다", meaning: "lắng nghe chăm chú" },
          { hangul: "말꼬리를 흐리다", meaning: "nói lấp lửng — nên tránh" },
          { hangul: "분위기를 잡다", meaning: "kiểm soát mạch trò chuyện" },
          { hangul: "감을 잡다", meaning: "nắm được hướng" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Em nghe không rõ, anh/chị nói lại được không?", hangul: "통화가 잘 안 들리는데 다시 말씀해 주시겠습니까?" },
    ],
  },

  // 58. Networking event introduction
  {
    id: 58,
    level: "B2",
    title_vi: "Giới thiệu tại sự kiện networking",
    title_en: "Networking event introduction",
    intro_vi:
      "Sự kiện 네트워킹 행사 (Korean alumni meetup, Korea-Vietnam Business Forum, KOTRA event ở Hà Nội/Hồ Chí Minh). Mục tiêu: giới thiệu bản thân trong 60 giây, đổi 명함 (danh thiếp), follow-up sau 24-48h. Bài này dạy 'Korean elevator pitch' — formal nhưng có cá tính.",
    vocabulary: [
      { hangul: "네트워킹 행사", meaning: "networking event" },
      { hangul: "명함", meaning: "business card" },
      { hangul: "인맥", meaning: "personal network" },
      { hangul: "교류", meaning: "exchange / interaction" },
      { hangul: "분야", meaning: "field / sector" },
      { hangul: "동문", meaning: "alumnus / fellow alumni" },
      { hangul: "선배", meaning: "senior (in school/work)" },
      { hangul: "후배", meaning: "junior (in school/work)" },
      { hangul: "관계자", meaning: "relevant person / stakeholder" },
      { hangul: "후속 연락", meaning: "follow-up contact" },
    ],
    sentences: [
      { korean: "처음 뵙겠습니다, 응웬티란이라고 합니다.", romanized: "Cheoeum boepgetsseumnida, Eungwentiranirago hamnida.", en: "Nice to meet you for the first time. I'm Nguyen Thi Lan.", vi: "Em xin chào lần đầu, em là Nguyễn Thị Lan." },
      { korean: "저는 한·베 무역 분야에서 일하고 있습니다.", romanized: "Jeoneun han-be muyeok bunyaeseo ilhago itsseumnida.", en: "I work in Korea-Vietnam trade.", vi: "Em đang làm trong lĩnh vực thương mại Hàn-Việt." },
      { korean: "명함 한 장 드려도 되겠습니까?", romanized: "Myeongham han jang deuryeodo doegetsseumnikka?", en: "May I offer my business card?", vi: "Em xin phép gửi danh thiếp được không ạ?" },
      { korean: "기회가 되면 한 번 더 뵙고 싶습니다.", romanized: "Gihoega doemyeon han beon deo boepgo sipseumnida.", en: "If the chance arises, I'd like to meet again.", vi: "Nếu có cơ hội, em muốn được gặp lại." },
      { korean: "오늘 좋은 만남을 갖게 되어 영광입니다.", romanized: "Oneul joeun mannameul gatge doeeo yeonggwangimnida.", en: "It's an honor to make this acquaintance today.", vi: "Hôm nay được làm quen là vinh dự của em." },
    ],
    dialogue: [
      { speaker: "A", hangul: "처음 뵙겠습니다. 김민수입니다.", meaning: "Nice to meet you. Kim Min-su." },
      { speaker: "B", hangul: "처음 뵙겠습니다, 응웬티란입니다. 어느 회사이십니까?", meaning: "Nice to meet you, Nguyen Thi Lan. Which company?" },
      { speaker: "A", hangul: "삼성전자 베트남 법인 영업팀에 있습니다.", meaning: "I'm in Samsung Vietnam's sales team." },
      { speaker: "B", hangul: "그렇군요. 저는 KOTRA 하노이 사무소 마케팅 분야입니다.", meaning: "I see. I'm at KOTRA Hanoi marketing." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "안녕하세요, 처음 뵙겠습니다. 김민수입니다. 명함 한 장 드리겠습니다.", meaning: "Hello, nice to meet you. Kim Min-su. Here's my card.", vi: "Xin chào, lần đầu gặp. Tôi là Kim Min-su. Xin gửi danh thiếp." },
      { speaker: "B", hangul: "처음 뵙겠습니다, 응웬티란입니다. 저도 명함 드리겠습니다. (양손으로)", meaning: "Nice to meet you. Nguyen Thi Lan. Here's mine. (with both hands)", vi: "Lần đầu gặp, em là Nguyễn Thị Lan. Em xin gửi danh thiếp. (đưa hai tay)" },
      { speaker: "A", hangul: "감사합니다. KOTRA 하노이 사무소에 계시는군요. 어느 분야 담당이세요?", meaning: "Thanks. So you're at KOTRA Hanoi. Which area?", vi: "Cảm ơn. Vậy chị ở văn phòng KOTRA Hà Nội. Chị phụ trách lĩnh vực nào?" },
      { speaker: "B", hangul: "한국 중소기업의 베트남 진출 마케팅을 지원하고 있습니다. 김 부장님은 삼성전자 영업팀이신가요?", meaning: "I support Korean SMEs entering Vietnam with marketing. You're in Samsung sales?", vi: "Em hỗ trợ marketing cho DN vừa & nhỏ Hàn vào Việt Nam. Anh Kim ở phòng kinh doanh Samsung phải không?" },
      { speaker: "A", hangul: "네, 베트남 법인에서 6개월 됐습니다. 마케팅 쪽 분들과 교류할 기회가 많지 않아서 오늘 행사 좋습니다.", meaning: "Yes, 6 months at Vietnam branch. Few chances to network with marketing folks — today's event is great.", vi: "Vâng, em ở chi nhánh Việt Nam 6 tháng. Ít dịp giao lưu với bên marketing nên sự kiện hôm nay tốt." },
      { speaker: "B", hangul: "맞아요. 저희도 영업 쪽과 자주 만나야 시너지가 나거든요. 혹시 호치민으로도 자주 가십니까?", meaning: "Same — synergy comes from sales-marketing meetups. Do you often go to HCMC?", vi: "Đúng vậy. Phía em cũng cần gặp bên kinh doanh để có synergy. Anh có hay vào TP.HCM không?" },
      { speaker: "A", hangul: "분기마다 한 번 정도 갑니다. 호치민 KOTRA에는 또 다른 박지영 차장님이 계시지요?", meaning: "About once per quarter. Park Ji-young (Deputy Mgr) at HCMC KOTRA, right?", vi: "Khoảng 1 lần/quý. Ở KOTRA HCMC có chị Park Ji-young phải không?" },
      { speaker: "B", hangul: "네, 박 차장님과는 자주 협업합니다. 다음에 호치민 출장 오시면 미리 연락 주세요. 자리 한 번 마련하겠습니다.", meaning: "Yes — we collaborate often. Let me know before HCMC trips, I'll set up a meeting.", vi: "Vâng, em hay làm việc với chị. Lần tới anh đến HCMC báo trước, em sẽ sắp xếp gặp." },
      { speaker: "A", hangul: "정말 감사합니다. 인맥이 넓으시네요. 응웬 씨 한국어가 정말 자연스러우십니다.", meaning: "Thanks — your network is wide. And your Korean is so natural.", vi: "Cảm ơn — chị có mạng lưới rộng. Tiếng Hàn của chị thật tự nhiên." },
      { speaker: "B", hangul: "감사합니다. 한국에서 2년 유학했고, KOTRA에서 4년째 일하고 있습니다.", meaning: "Thanks — 2 years study in Korea, 4 at KOTRA.", vi: "Cảm ơn anh — em du học Hàn 2 năm, làm KOTRA 4 năm." },
      { speaker: "A", hangul: "그래서 그렇군요. 한국 본사와도 일을 자주 하시겠어요?", meaning: "That explains it. You work often with HQ?", vi: "Hiểu rồi. Chắc chị hay làm việc với trụ sở Hàn?" },
      { speaker: "B", hangul: "네, 매주 본사 회의가 있습니다. 그래서 한국어를 계속 쓰게 됩니다.", meaning: "Yes, weekly HQ meetings — keeps my Korean active.", vi: "Vâng, họp với trụ sở hàng tuần — nên tiếng Hàn không quên." },
      { speaker: "A", hangul: "잘됐네요. 응웬 씨, 혹시 이번 달 말 KOTRA에서 IT 분야 행사 있으십니까?", meaning: "Nice. Any IT-sector KOTRA event late this month?", vi: "Tốt quá. Cuối tháng này KOTRA có sự kiện ngành IT không?" },
      { speaker: "B", hangul: "네, 25일에 'IT 진출 세미나'가 있습니다. 관심 있으시면 메일로 초청장 보내드리겠습니다.", meaning: "Yes, 'IT Entry Seminar' on the 25th. I can email you the invite.", vi: "Có, ngày 25 có 'Hội thảo IT mở rộng thị trường'. Anh quan tâm em sẽ gửi thư mời." },
      { speaker: "A", hangul: "꼭 부탁드립니다. 오늘 만남이 정말 의미 있었습니다. 다음에 또 뵙겠습니다.", meaning: "Please do. Today was meaningful. Look forward to meeting again.", vi: "Em nhờ chị. Hôm nay gặp ý nghĩa. Mong gặp lại." },
      { speaker: "B", hangul: "저도 같은 마음입니다. 안녕히 가십시오.", meaning: "Same. Goodbye.", vi: "Em cũng vậy. Anh đi mạnh giỏi." },
    ],
    roleplay_prompts: [
      "Tại Korea-Vietnam Business Forum bạn muốn tiếp cận một 부장님 (giám đốc bộ phận) Samsung. Diễn tập câu mở đầu: bước đến lịch sự, '실례합니다, 김 부장님이시지요? 처음 뵙겠습니다…' và 30 giây giới thiệu bản thân — bằng 하십시오체.",
      "Trao danh thiếp đúng cách Hàn: ĐƯA bằng HAI tay (nội dung quay về phía người nhận), ĐỌC danh thiếp khi nhận (~3 giây) trước khi cất, KHÔNG bỏ ngay vào túi sau. Diễn tập câu '잘 받겠습니다' (Em xin nhận) khi nhận danh thiếp.",
      "Sau sự kiện 24-48h, viết tin nhắn KakaoTalk follow-up tới một người bạn vừa gặp. Tránh quá formal (KaTalk nhẹ hơn email) nhưng vẫn 존댓말. Mẫu: chào → nhắc lại nội dung trao đổi → đề xuất gặp tiếp/gửi tài liệu liên quan.",
    ],
    register_notes:
      "Sự kiện networking Hàn có 2 layer kính ngữ: (1) 하십시오체 với người mới gặp, người cấp cao hơn rõ ràng (qua chức danh trên 명함); (2) 해요체 chỉ khi đối phương GỢI Ý '편하게 하세요' (cứ thoải mái). Cách an toàn cho người Việt: BẮT ĐẦU 하십시오체, chỉ chuyển nếu đối phương chủ động chuyển trước. Quy tắc 명함 (danh thiếp) — sai = bị xem là không chuyên nghiệp: (a) đưa hai tay; (b) nội dung quay về phía người nhận; (c) khi nhận, dùng hai tay, ĐỌC ngay 3-5 giây trước khi cất; (d) đặt danh thiếp lên bàn trong cuộc trò chuyện — KHÔNG bỏ vào túi quần. Khi không nghe rõ tên: '죄송하지만 성함을 한 번 더 알려 주시겠습니까?' (Em xin phép hỏi lại tên anh/chị) — formal hơn '이름이 뭐예요?'. Cuối cuộc gặp: '오늘 좋은 만남이었습니다. 또 뵙겠습니다' — KHÔNG '안녕!' (quá thân).",
    idiom_glosses: [
      { idiom: "인맥을 넓히다", literal: "mở rộng mạng lưới", meaning: "xây dựng quan hệ — quan trọng trong văn hóa Hàn", example: "이번 행사에서 인맥을 많이 넓혔습니다." },
      { idiom: "손을 내밀다", literal: "đưa tay ra", meaning: "chủ động đề nghị giúp đỡ / kết nối", example: "선배님께서 먼저 손을 내밀어 주셔서 감사합니다." },
      { idiom: "발이 넓다", literal: "chân rộng", meaning: "có nhiều quan hệ / mạng lưới rộng — khen", example: "박 부장님은 발이 넓으십니다." },
      { idiom: "다리를 놓다", literal: "bắc cầu", meaning: "kết nối hai bên / giới thiệu — chủ động làm trung gian", example: "두 회사 사이에 다리를 놓아 드리겠습니다." },
    ],
    cultural_notes_vi:
      "Networking Hàn KHÔNG phải 'gặp gỡ ngẫu nhiên' — là hệ thống quan hệ có cấu trúc dựa trên 학연 (alumni), 지연 (cùng quê), 사연 (cùng công ty). Người Việt có 학연 yếu (không học ở Hàn) nhưng có thể bù bằng 사연 nếu cùng tập đoàn (Samsung Vietnam ↔ Samsung Korea HQ). Thứ tự quan trọng tại sự kiện: tìm 동문 (cùng trường, nếu có) trước, sau đó tìm 관계자 cùng ngành. 'Working the room' kiểu Mỹ (đi lung tung bắt tay) bị xem là nông cạn — Hàn ưa 3-5 cuộc gặp SÂU hơn 20 cuộc gặp nông. Sau sự kiện 24-48h gửi follow-up bằng KakaoTalk hoặc email — đây là cách 'kích hoạt' mối quan hệ. Không follow-up = mối quan hệ chết. Quy tắc bất thành văn: nếu được giới thiệu qua người thứ ba (X 차장님 소개로), LUÔN nhắc tên người giới thiệu trong follow-up — đây là respect chain.",
    tip_advice_vi:
      "Chuẩn bị: in 50 명함 chuyên nghiệp (mặt Hàn / mặt Anh hoặc Việt), 'elevator pitch' 60s viết sẵn (tên, công ty, vị trí, what you do, what you're looking for). Trang phục: business smart casual (men: blazer + chinos; women: blazer + skirt/pants). Tại sự kiện: (1) Đến đúng giờ (15 phút sớm là tốt nhất — gặp host trước); (2) Tay phải luôn rảnh (tránh cầm cốc tay phải — bắt tay khó); (3) Lần đầu gặp KHÔNG nói chuyện business >5 phút — chuyển sang topic nhẹ (sự kiện, ngành, weather); (4) Đổi 명함 ở 5-10 phút cuối cuộc gặp — không ngay khi vừa làm quen. Sau sự kiện: viết note ngắn lên mặt sau danh thiếp (chủ đề đã nói) — KHÔNG quên ai là ai; gửi follow-up trong 24-48h với 1 câu giá trị thực sự (gửi tài liệu họ quan tâm, link bài báo phù hợp, không chỉ '잘 부탁드립니다').",
    exercises: [
      { type: "fill-blank", question: "처음 뵙겠습니다, 응웬티란이라고 ___.", answer: "합니다" },
      {
        type: "matching",
        pairs: [
          { hangul: "인맥을 넓히다", meaning: "mở rộng quan hệ" },
          { hangul: "손을 내밀다", meaning: "chủ động giúp đỡ" },
          { hangul: "발이 넓다", meaning: "có quan hệ rộng" },
          { hangul: "다리를 놓다", meaning: "kết nối / làm trung gian" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Nếu có cơ hội, em muốn được gặp lại.", hangul: "기회가 되면 한 번 더 뵙고 싶습니다." },
    ],
  },

  // 59. Following up on rejected application
  {
    id: 59,
    level: "B2",
    title_vi: "Email follow-up sau khi bị từ chối",
    title_en: "Following up on a rejected application",
    intro_vi:
      "Email tới HR Hàn sau khi nhận thông báo 불합격 (không trúng tuyển). Mục tiêu KHÔNG phải tranh cãi — mà giữ cánh cửa cho lần sau (Hàn ngành nhỏ, hôm nay HR-này → mai HR-đó). Cấu trúc: cảm ơn cơ hội → xin feedback ngắn gọn → cam kết theo dõi tin tuyển dụng tương lai → kết bằng tone tích cực.",
    vocabulary: [
      { hangul: "불합격", meaning: "non-selection" },
      { hangul: "통보", meaning: "notification" },
      { hangul: "검토", meaning: "review / consideration" },
      { hangul: "피드백", meaning: "feedback" },
      { hangul: "참고하다", meaning: "to take as reference" },
      { hangul: "보완하다", meaning: "to supplement / improve" },
      { hangul: "다음 기회", meaning: "next opportunity" },
      { hangul: "결과 통보", meaning: "result notification" },
      { hangul: "경험", meaning: "experience" },
      { hangul: "성장의 기회", meaning: "growth opportunity" },
    ],
    sentences: [
      { korean: "결과 통보 잘 받았습니다.", romanized: "Gyeolgwa tongbo jal badatsseumnida.", en: "I have received the result notification.", vi: "Em đã nhận được thông báo kết quả." },
      { korean: "기회를 주신 점에 진심으로 감사드립니다.", romanized: "Gihoereul jusin jeome jinsimeuro gamsadeurimnida.", en: "I sincerely thank you for the opportunity.", vi: "Em chân thành cảm ơn vì đã trao cơ hội." },
      { korean: "혹시 간단한 피드백을 받을 수 있을까요?", romanized: "Hoksi gandanhan pideubaegeul badeul su isseulkkayo?", en: "Could I possibly receive brief feedback?", vi: "Em có thể xin nhận một chút phản hồi ngắn gọn không ạ?" },
      { korean: "부족한 점을 보완하여 더 발전하겠습니다.", romanized: "Bujokhan jeomeul bowanhayeo deo baljeonhagetsseumnida.", en: "I'll improve on shortcomings and grow further.", vi: "Em sẽ khắc phục thiếu sót và tiếp tục phát triển." },
      { korean: "다음에 또 좋은 기회로 뵙기를 희망합니다.", romanized: "Daeume tto joeun gihoero boepgireul huimanghamnida.", en: "I hope to meet again with a good opportunity.", vi: "Em hy vọng lần tới gặp nhau qua cơ hội tốt hơn." },
    ],
    dialogue: [
      { speaker: "A", hangul: "안녕하세요, 결과 통보 받았습니다. 검토해 주신 점 감사드립니다.", meaning: "Hello, received the result. Thanks for reviewing." },
      { speaker: "B", hangul: "안녕하세요. 이번에 함께하지 못해 저희도 아쉬웠습니다.", meaning: "Hello. We were also sorry not to bring you on." },
      { speaker: "A", hangul: "혹시 간단한 피드백을 받을 수 있을까요?", meaning: "Could I receive brief feedback?" },
      { speaker: "B", hangul: "메일로 정리해서 보내드리겠습니다.", meaning: "I'll organize and email it." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "제목: [지원자 응웬티란] 결과 통보 관련 감사 인사", meaning: "Subject: [Applicant Nguyen Thi Lan] Thanks regarding result notification", vi: "Tiêu đề: [Ứng viên Nguyễn Thị Lan] Cảm ơn về thông báo kết quả" },
      { speaker: "A", hangul: "박 과장님께, 안녕하십니까.", meaning: "Dear Manager Park, hello.", vi: "Kính gửi anh Park, em chào anh." },
      { speaker: "A", hangul: "보내 주신 결과 통보 잘 받았습니다.", meaning: "I received the result notification.", vi: "Em đã nhận được thông báo kết quả anh gửi." },
      { speaker: "A", hangul: "이번에는 좋은 결과로 이어지지 못했지만, 면접 기회를 주신 점에 진심으로 감사드립니다.", meaning: "Though it didn't work out this time, I sincerely thank you for the interview opportunity.", vi: "Lần này tuy chưa được, em vẫn chân thành cảm ơn vì cơ hội phỏng vấn." },
      { speaker: "A", hangul: "혹시 부담스럽지 않으시다면, 어떤 부분을 보완하면 좋을지 간단한 피드백을 부탁드려도 될까요?", meaning: "If not a burden, may I ask brief feedback on what to improve?", vi: "Nếu không phiền, em xin được nhận một chút phản hồi về điểm cần cải thiện được không ạ?" },
      { speaker: "A", hangul: "다음에 더 좋은 모습으로 다시 지원할 수 있도록 참고하고 싶어서 여쭙는 것이니 양해해 주십시오.", meaning: "I ask only to reference for future applications. Please understand.", vi: "Em xin hỏi để tham khảo cho lần ứng tuyển sau, mong anh thông cảm." },
      { speaker: "A", hangul: "다시 한 번 시간 내 주셔서 감사드립니다. 응웬티란 드림.", meaning: "Thanks again for your time. Nguyen Thi Lan.", vi: "Một lần nữa cảm ơn anh đã dành thời gian. Nguyễn Thị Lan kính thư." },
      { speaker: "B", hangul: "응웬티란 씨, 안녕하세요. 이번에 함께 하지 못해 저희도 아쉬웠습니다.", meaning: "Hi Ms. Nguyen. We're sorry too.", vi: "Chào chị Nguyễn. Chúng tôi cũng tiếc." },
      { speaker: "B", hangul: "한국어 능력과 베트남 시장 이해도는 뛰어났습니다. 다만 SQL 실무 경험이 다른 지원자보다 다소 부족했습니다.", meaning: "Korean ability and market insight excellent. SQL hands-on slightly weaker than others.", vi: "Tiếng Hàn và hiểu biết thị trường tốt. SQL thực hành hơi yếu hơn ứng viên khác." },
      { speaker: "B", hangul: "지난 6개월 프로젝트 경험을 더 쌓으시면 다음 기회에는 분명 좋은 결과 있으실 것입니다.", meaning: "If you build 6 more months of project experience, next time should yield good results.", vi: "Nếu chị tích lũy thêm 6 tháng kinh nghiệm dự án, lần tới chắc chắn có kết quả tốt." },
      { speaker: "B", hangul: "회사 채용 페이지 알림을 신청해 두시면 적합한 공고가 올 때 가장 먼저 보실 수 있습니다.", meaning: "Sign up for our careers alerts to see fitting roles first.", vi: "Chị đăng ký nhận thông báo trang tuyển dụng để biết tin sớm nhất." },
      { speaker: "B", hangul: "응원하겠습니다. 박 과장.", meaning: "Cheering you on. Manager Park.", vi: "Chúng tôi sẽ ủng hộ. Quản lý Park." },
      { speaker: "A", hangul: "박 과장님께, 자세한 피드백 정말 감사드립니다.", meaning: "Dear Mgr Park, sincere thanks for the detailed feedback.", vi: "Kính gửi anh Park, em chân thành cảm ơn phản hồi chi tiết." },
      { speaker: "A", hangul: "지적해 주신 SQL 실무 부분, 다음 6개월 동안 프로젝트로 보완하겠습니다.", meaning: "I'll work on SQL hands-on through projects in the next 6 months.", vi: "Em sẽ khắc phục phần SQL anh nhắc bằng các dự án trong 6 tháng tới." },
      { speaker: "A", hangul: "채용 알림도 신청해 두겠습니다. 다음 기회에 다시 인사드릴 수 있기를 진심으로 바랍니다.", meaning: "I'll subscribe to alerts. Truly hope to greet you again next time.", vi: "Em sẽ đăng ký nhận tin tuyển dụng. Thực sự mong gặp lại lần sau." },
      { speaker: "A", hangul: "건강하시고 좋은 한 해 보내십시오. 응웬티란 올림.", meaning: "Stay well and have a good year. Nguyen Thi Lan.", vi: "Chúc anh sức khỏe và một năm tốt. Nguyễn Thị Lan kính dâng." },
    ],
    roleplay_prompts: [
      "Bị từ chối sau vòng phỏng vấn cuối. Soạn email follow-up CẢM ƠN trong 24-48h kể từ khi nhận thông báo. Cấu trúc: tiêu đề rõ → câu chào → cảm ơn cơ hội → xin feedback ngắn → cam kết phát triển → kết tích cực — bằng 하십시오체.",
      "HR phản hồi feedback: 'tiếng Hàn yếu, kinh nghiệm leadership thiếu'. Soạn email reply (a) cảm ơn feedback chân thành, (b) KHÔNG biện minh, (c) chia sẻ kế hoạch cụ thể cải thiện trong 6 tháng (TOPIK level up, dự án leadership). Tránh tone 'tôi đã có rồi nhưng các anh không thấy'.",
      "6 tháng sau đăng ký vị trí KHÁC tại cùng công ty. Soạn email gửi cùng HR cũ — nhắc lại lần ứng tuyển trước, kết quả phát triển sau 6 tháng (thành tựu cụ thể), lý do quan tâm vị trí mới. Cấu trúc: cảm ơn lần trước → progress update → application chính thức.",
    ],
    register_notes:
      "Email follow-up sau bị từ chối là MOMENT văn hóa quan trọng nhất ở Hàn — quyết định bạn có 'door' cho lần sau hay không. 하십시오체 toàn bộ — kể cả khi đối phương dùng 해요체 trong reply. KHÔNG bao giờ tỏ ý: (a) tiếc nuối quá đà ('정말 아쉽습니다' lặp 3 lần — nghe whiny); (b) tranh cãi quyết định ('이상한 결정 같습니다' — burn bridge); (c) hỏi tên người trúng tuyển. Cấu trúc câu xin feedback PHẢI có 'cushion': '혹시 부담스럽지 않으시다면…' (Nếu không phiền…) hoặc '가능하시다면…' (Nếu có thể…). Câu kết: '다음 기회에 다시 뵙기를 진심으로 바랍니다' — formal và tích cực, KHÔNG '꼭 연락 주세요' (yêu cầu — quá thẳng). Chữ ký 'XXX 올림' formal hơn '드림' — phù hợp khi gửi đến cấp cao đã từ chối bạn.",
    idiom_glosses: [
      { idiom: "끝맺음을 잘하다", literal: "kết thúc tốt", meaning: "rời đi/đóng quan hệ trong êm đẹp — KHÔNG đốt cầu", example: "불합격이라도 끝맺음을 잘해야 다음 기회가 옵니다." },
      { idiom: "약이 되다", literal: "trở thành thuốc", meaning: "kinh nghiệm tệ trở thành bài học hữu ích", example: "이번 경험이 약이 될 것이라 믿습니다." },
      { idiom: "한 발 물러서다", literal: "lùi một bước", meaning: "tạm rút lui để chuẩn bị tốt hơn cho lần sau", example: "이번엔 한 발 물러서고 다음에 다시 도전하겠습니다." },
      { idiom: "고배를 마시다", literal: "uống cốc đắng", meaning: "chịu thất bại đau đớn — formal hơn '실패하다'", example: "이번엔 고배를 마셨지만 포기하지 않겠습니다." },
    ],
    cultural_notes_vi:
      "Văn hóa Hàn Quốc cực coi trọng 'cách thua' — người thua đẹp được nhớ hơn người thắng vô tâm. Ngành Hàn nhỏ và liên kết: HR Park hôm nay từ chối bạn, 2 năm sau có thể chuyển sang công ty khác và gặp lại bạn ứng tuyển ở đó. Email follow-up tốt = 'invisible recommendation letter' đi theo bạn. Sai lầm phổ biến của ứng viên Việt: (1) Không gửi follow-up — bị xem như không quan tâm thật sự; (2) Gửi follow-up tone tiêu cực ('quyết định không công bằng…') — bị blacklist không chỉ ở công ty này; (3) Hỏi feedback quá thẳng — '제가 왜 떨어졌나요?' (Tại sao tôi rớt?) bị xem là challenge. Đúng cách: '어떤 부분을 보완하면 좋을지 조언 부탁드립니다' (Em xin lời khuyên nên bổ sung phần nào). Một chi tiết nhỏ nhưng quan trọng: nếu HR cho feedback chi tiết, sau 3-6 tháng có progress thật → gửi update email NGẮN ('feedback của anh là động lực giúp em đạt TOPIK 6'). Họ nhớ rất lâu.",
    tip_advice_vi:
      "Timing follow-up: gửi trong 24-48h sau khi nhận thông báo từ chối — KHÔNG sớm hơn (cảm xúc còn nóng), KHÔNG muộn hơn (mất context). Độ dài: 6-10 dòng — không dài hơn. Cấu trúc 4 phần: (1) Cảm ơn cơ hội phỏng vấn (1-2 dòng); (2) Đón nhận quyết định một cách trưởng thành (1 dòng) — KHÔNG bộc lộ tổn thương; (3) Xin feedback NHẸ với cushion phrase (2-3 dòng); (4) Câu chốt tích cực về tương lai (1-2 dòng). Tone: chân thành, không drama, không gượng. Tránh từ tiêu cực: 슬프다 (buồn), 실망스럽다 (thất vọng), 억울하다 (oan ức). Dùng từ 'growth' thay 'failure': 성장의 기회 (cơ hội phát triển), 보완 (bổ sung), 발전 (tiến bộ). Khi nhận được feedback dù chỉ 1 dòng — luôn reply '감사드립니다' lần nữa — đừng để email cuối là từ phía HR.",
    exercises: [
      { type: "fill-blank", question: "기회를 주신 점에 진심으로 ___.", answer: "감사드립니다" },
      {
        type: "matching",
        pairs: [
          { hangul: "끝맺음을 잘하다", meaning: "kết thúc trong êm đẹp" },
          { hangul: "약이 되다", meaning: "trở thành bài học" },
          { hangul: "한 발 물러서다", meaning: "lùi để chuẩn bị tốt hơn" },
          { hangul: "고배를 마시다", meaning: "chịu thất bại" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Em sẽ khắc phục thiếu sót và tiếp tục phát triển.", hangul: "부족한 점을 보완하여 더 발전하겠습니다." },
    ],
  },

  // 60. Asking professor for recommendation letter
  {
    id: 60,
    level: "B2",
    title_vi: "Xin giáo sư viết thư tiến cử",
    title_en: "Asking professor for a recommendation letter",
    intro_vi:
      "Cuộc gặp xin 추천서 (thư tiến cử) cho học bổng KGSP, du học, hoặc xin việc tại Hàn. Quy tắc vàng: KHÔNG xin gấp (<2 tuần là bất lịch sự), CHUẨN BỊ HỒ SƠ đầy đủ giúp giáo sư (CV, transcript, motivation, deadlines), GỬI FOLLOW-UP đúng nhịp. Toàn bộ 하십시오체.",
    vocabulary: [
      { hangul: "추천서", meaning: "recommendation letter" },
      { hangul: "추천인", meaning: "recommender" },
      { hangul: "마감일", meaning: "deadline" },
      { hangul: "지원 서류", meaning: "application documents" },
      { hangul: "성적 증명서", meaning: "transcript" },
      { hangul: "이력서", meaning: "résumé" },
      { hangul: "자기소개서", meaning: "personal statement" },
      { hangul: "지도교수", meaning: "academic advisor" },
      { hangul: "강조하다", meaning: "to emphasize" },
      { hangul: "양식", meaning: "form / template" },
    ],
    sentences: [
      { korean: "교수님, 추천서 부탁드릴 일이 있어 메일 드립니다.", romanized: "Gyosunim, chucheonseo butak-deuril iri isseo meil deurimnida.", en: "Professor, I'm writing to ask for a recommendation.", vi: "Thưa thầy, em viết để xin nhờ thầy viết thư tiến cử." },
      { korean: "마감일까지 약 한 달의 시간이 있습니다.", romanized: "Magamil-kkaji yak han darui sigani itsseumnida.", en: "There's about a month until the deadline.", vi: "Còn khoảng 1 tháng nữa là đến hạn." },
      { korean: "필요하신 자료를 미리 준비해 두었습니다.", romanized: "Piryohasin jaryoreul miri junbihae dueotsseumnida.", en: "I've prepared the materials you'll need in advance.", vi: "Em đã chuẩn bị sẵn tài liệu thầy có thể cần." },
      { korean: "교수님께서 강조해 주셨으면 하는 부분이 두 가지 있습니다.", romanized: "Gyosunimkkeseo gangjohae jusyeosseumyeon haneun bubuni du gaji itsseumnida.", en: "There are two points I'd hope you could emphasize.", vi: "Có hai điểm em mong thầy có thể nhấn mạnh." },
      { korean: "바쁘신 와중에 시간 내 주셔서 진심으로 감사드립니다.", romanized: "Bappeusin wajunge sigan nae jusyeoseo jinsimeuro gamsadeurimnida.", en: "Sincere thanks for taking time despite being busy.", vi: "Em chân thành cảm ơn thầy dành thời gian dù bận rộn." },
    ],
    dialogue: [
      { speaker: "A", hangul: "교수님, 추천서 부탁드릴 일이 있어서 찾아뵈었습니다.", meaning: "Professor, I came to ask for a recommendation." },
      { speaker: "B", hangul: "어떤 추천서인가요? 마감은 언제예요?", meaning: "What kind? When's the deadline?" },
      { speaker: "A", hangul: "KGSP 장학금 지원입니다. 마감일은 다음 달 15일입니다.", meaning: "KGSP scholarship. Deadline next month 15th." },
      { speaker: "B", hangul: "한 달 이상 남았으니 충분합니다. 자료 정리해서 가져오세요.", meaning: "Over a month — enough. Bring organized materials." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "교수님, 안녕하십니까. 잠시 시간 괜찮으십니까?", meaning: "Hello professor. Have a moment?", vi: "Thưa thầy, em chào thầy. Thầy có chút thời gian không?" },
      { speaker: "B", hangul: "네, 들어오세요. 무슨 일이세요?", meaning: "Yes, come in. What's up?", vi: "Vâng, em vào đi. Có chuyện gì?" },
      { speaker: "A", hangul: "다름이 아니라, 추천서 부탁드릴 일이 있어서 찾아뵈었습니다.", meaning: "Actually, I came to ask for a recommendation letter.", vi: "Thưa thầy, hôm nay em đến nhờ thầy viết thư tiến cử." },
      { speaker: "B", hangul: "어떤 추천서인가요? 어디에 지원하시는데요?", meaning: "What kind? Applying where?", vi: "Thư tiến cử cho việc gì? Em ứng tuyển ở đâu?" },
      { speaker: "A", hangul: "한국정부초청장학생 KGSP 석사 과정에 지원하려고 합니다. 서울대학교 국제대학원이 1순위입니다.", meaning: "KGSP master's. Seoul National GSIS as first choice.", vi: "Em ứng tuyển thạc sĩ KGSP. Cao học Quốc tế ĐH Seoul là nguyện vọng 1." },
      { speaker: "B", hangul: "좋은 도전이네요. 마감일이 언제예요?", meaning: "Good challenge. When's the deadline?", vi: "Thử thách hay đấy. Hạn nộp khi nào?" },
      { speaker: "A", hangul: "마감은 다음 달 15일입니다. 약 5주 정도 시간이 있습니다.", meaning: "Next month 15th, about 5 weeks.", vi: "Hạn ngày 15 tháng sau, còn khoảng 5 tuần." },
      { speaker: "B", hangul: "5주면 충분하네요. 그래서 어떤 점을 강조해 주면 좋겠어요?", meaning: "5 weeks is plenty. What should I emphasize?", vi: "5 tuần đủ. Em muốn thầy nhấn mạnh điểm gì?" },
      { speaker: "A", hangul: "두 가지 부탁드리고 싶습니다. 첫째, 한·베 비교 연구에 대한 저의 관심과 학문적 잠재력입니다. 둘째, 작년 교수님 수업에서 진행한 동남아 경제 발표 프로젝트입니다.", meaning: "Two things — Korea-Vietnam comparative interest & academic potential, and last year's SE Asia economics presentation in your class.", vi: "Hai điểm — sự quan tâm và tiềm năng học thuật về so sánh Hàn-Việt; dự án thuyết trình kinh tế ĐNÁ trong lớp thầy năm ngoái." },
      { speaker: "B", hangul: "그 발표 잘 기억합니다. 자료 제출은 어떻게 하면 됩니까?", meaning: "Remember that well. How do I submit?", vi: "Tôi nhớ buổi đó. Tôi nộp thế nào?" },
      { speaker: "A", hangul: "온라인 시스템이고, 교수님 이메일로 양식과 링크가 발송됩니다. 직접 서명·업로드해 주시면 됩니다. 제가 자료를 준비해 왔습니다.", meaning: "Online — form and link emailed to you, you sign and upload. I prepared materials.", vi: "Hệ thống online — biểu mẫu và link được gửi vào email thầy, thầy ký và tải lên. Em đã chuẩn bị tài liệu." },
      { speaker: "B", hangul: "어떤 자료를 준비하셨어요?", meaning: "What materials?", vi: "Em chuẩn bị gì?" },
      { speaker: "A", hangul: "이력서, 성적 증명서, 자기소개서, 학업 계획서, 그리고 한·베 비교 연구 관련 제 발표 자료까지 USB에 담아 왔습니다.", meaning: "Résumé, transcript, personal statement, study plan, and my comparative research presentation — on USB.", vi: "CV, bảng điểm, bài tự giới thiệu, kế hoạch học tập, và file thuyết trình so sánh Hàn-Việt — trong USB." },
      { speaker: "B", hangul: "준비를 잘하셨네요. 좋습니다. 한 2주 내로 초안 작성해서 검토 부탁드릴게요.", meaning: "Well prepared. Good. I'll draft within 2 weeks for your review.", vi: "Em chuẩn bị chu đáo. Tốt. Tôi soạn bản thảo trong 2 tuần để em xem." },
      { speaker: "A", hangul: "정말 감사합니다, 교수님. 마감 1주일 전까지 최종 확인 메일 드리겠습니다.", meaning: "Thank you so much, professor. I'll send a final-check email 1 week before deadline.", vi: "Em cảm ơn thầy rất nhiều. Em sẽ gửi email xác nhận cuối 1 tuần trước hạn." },
      { speaker: "B", hangul: "좋아요. 합격하면 꼭 알려 주세요.", meaning: "Good. Let me know if you pass.", vi: "Tốt. Nếu đậu nhớ báo tôi nhé." },
      { speaker: "A", hangul: "네, 반드시 알려 드리겠습니다. 늘 감사합니다.", meaning: "Yes, I will. Thank you always.", vi: "Vâng, em chắc chắn báo. Luôn biết ơn thầy." },
    ],
    roleplay_prompts: [
      "Email gửi giáo sư XIN gặp 15 phút để nhờ viết 추천서 — KHÔNG xin trực tiếp qua email (thiếu trang trọng). Cấu trúc: tiêu đề rõ → câu chào → giới thiệu lại bản thân (lớp/khóa) → mục đích gặp → đề xuất 2-3 khung giờ → câu kết bằng 하십시오체.",
      "Trong cuộc gặp, giáo sư hỏi 'em muốn tôi nhấn mạnh điểm gì?'. Diễn tập câu trả lời CỤ THỂ với 2 điểm + ví dụ: tránh trả lời chung chung 'thầy viết gì cũng được' (bị xem là không chuẩn bị) — thay vào đó nêu 2 điểm gắn với chủ đề học bổng.",
      "1 tuần trước hạn, giáo sư chưa upload thư. Diễn tập email follow-up LỊCH SỰ — KHÔNG nhắc thầy 'thầy quên rồi sao?' (mất phép) — dùng 'không biết có cần em hỗ trợ thêm tài liệu gì không ạ' để gợi ý nhẹ — bằng 하십시오체.",
    ],
    register_notes:
      "Xin 추천서 là cuộc gặp formal nhất giữa sinh viên và giáo sư — 하십시오체 toàn bộ kể cả khi thường ngày thầy/cô để bạn dùng 해요체. Gọi giáo sư '교수님' (KHÔNG '선생님' với giáo sư đại học). Câu xin BẮT BUỘC có cụm 'cushion': '다름이 아니라…' (Thực ra là…) hoặc '죄송합니다만 부탁드릴 일이 있어서…' (Em xin lỗi nhưng có việc nhờ…). KHÔNG hỏi 'thầy có sẵn sàng viết tốt cho em không?' ('잘 써 주실 수 있을까요?') — implicit và xúc phạm; nếu thầy không định viết tốt, sẽ tự nói 'tôi nghĩ em nên xin người khác' (đây là cách Hàn từ chối lịch sự). Sau khi nhận lời, gửi email cảm ơn ngay tối hôm đó kèm tài liệu đính kèm. Sau khi biết kết quả (đậu/rớt), BẮT BUỘC báo lại — KHÔNG báo = burn quan hệ vĩnh viễn. Nếu đậu: '교수님 덕분에 좋은 결과를 얻었습니다' (Nhờ thầy mà em được kết quả tốt). Nếu rớt: vẫn báo + cảm ơn lần nữa. // TODO native-review: '다름이 아니라' usage at sentence-opening for student-to-prof favor request.",
    idiom_glosses: [
      { idiom: "신세를 지다", literal: "mang ơn", meaning: "nhận sự giúp đỡ — formal, dùng khi nhờ vả lớn", example: "교수님께 큰 신세를 지게 되었습니다." },
      { idiom: "은혜를 갚다", literal: "trả ơn", meaning: "đền đáp — văn hóa Hàn coi trọng cycle nhận-cho", example: "꼭 좋은 결과로 은혜를 갚겠습니다." },
      { idiom: "도움의 손길을 내밀다", literal: "đưa bàn tay giúp đỡ", meaning: "dang tay giúp đỡ — formal hơn '도와주다'", example: "교수님께서 도움의 손길을 내밀어 주셔서 감사합니다." },
      { idiom: "발 벗고 도와주다", literal: "cởi giày giúp", meaning: "giúp hết mình — không tính toán", example: "선배님이 발 벗고 도와주셨습니다." },
    ],
    cultural_notes_vi:
      "Văn hóa 추천서 ở Hàn KHÁC Mỹ: (1) Giáo sư Hàn KHÔNG được xem là 'service' của trường — họ làm vì quan hệ 사제 cá nhân; (2) KHÔNG có khái niệm 'cold ask' — phải có ít nhất 1 học kỳ học/làm dưới giáo sư; (3) Thầy không nói 'không' trực tiếp — sẽ nói 'tôi không phải người phù hợp nhất, em xin X 교수님 thì tốt hơn' = lịch sự từ chối. Quy tắc thời gian VÀNG: tối thiểu 4 tuần trước hạn, lý tưởng 6 tuần. Xin gấp <2 tuần = mất face cho cả hai bên (giáo sư phải vội + bạn bị xem là không tổ chức). Mang theo gì đến cuộc gặp: USB chứa CV, transcript, motivation letter, 학업 계획서, plus PDF in-màu của 1-2 deliverable nổi bật trong khóa của thầy (bài thuyết trình, paper). Sau cuộc gặp: gửi 1 hộp bánh nhỏ hoặc trái cây (không bắt buộc, nhưng phổ biến với student-prof relationship lâu dài). Không gửi trước cuộc gặp (nhìn như hối lộ).",
    tip_advice_vi:
      "Cấu trúc cuộc gặp 15 phút: (1) Câu mở '다름이 아니라, 추천서 부탁드릴 일이…' (Thực ra em đến nhờ thầy về thư tiến cử…) — câu mở quan trọng nhất; (2) Cung cấp context: học bổng/du học gì, deadline, trường nguyện vọng; (3) Đề xuất 2 ĐIỂM cụ thể bạn muốn thầy nhấn mạnh — gắn với deliverable cụ thể trong khóa thầy đã dạy; (4) Trao USB + bản in tài liệu, hỏi thầy có cần thêm gì không; (5) Chốt timeline: bạn sẽ gửi reminder 1 tuần trước hạn. Sai lầm chết người: nhờ giáo sư 'có thể tự nghĩ ra điểm để khen' — họ KHÔNG có thời gian. Bạn phải tự FEED nội dung; thầy chỉ là người 'authentic-ate'. Cushion phrases: '바쁘신 와중에 죄송합니다만' (Em xin lỗi giữa lúc thầy bận), '부담드려 죄송합니다' (Em xin lỗi vì làm phiền). Sau khi nhận thư đã nộp: 1 dòng '잘 받았습니다, 정말 감사드립니다.'",
    exercises: [
      { type: "fill-blank", question: "교수님, 추천서 ___드릴 일이 있어 메일 드립니다.", answer: "부탁" },
      {
        type: "matching",
        pairs: [
          { hangul: "신세를 지다", meaning: "mang ơn / nhận giúp đỡ" },
          { hangul: "은혜를 갚다", meaning: "đền đáp" },
          { hangul: "도움의 손길을 내밀다", meaning: "dang tay giúp đỡ" },
          { hangul: "발 벗고 도와주다", meaning: "giúp hết mình" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Có hai điểm em mong thầy có thể nhấn mạnh.", hangul: "교수님께서 강조해 주셨으면 하는 부분이 두 가지 있습니다." },
    ],
  },

  // 61. Discussing research interests in academic context
  {
    id: 61,
    level: "B2",
    title_vi: "Trao đổi hướng nghiên cứu trong môi trường học thuật",
    title_en: "Discussing research interests in an academic context",
    intro_vi:
      "Cuộc trao đổi học thuật với giáo sư hoặc senior researcher (선임 연구원) tại 학회 (conference) hoặc seminar lab. Sinh viên Việt cần biết cách trình bày 'research interest' bằng tiếng Hàn formal: nêu CHỦ ĐỀ → KHOẢNG TRỐNG nghiên cứu → ĐÓNG GÓP của bạn → ĐẶT CÂU HỎI ngược lại. Toàn bộ 하십시오체.",
    vocabulary: [
      { hangul: "연구 분야", meaning: "research field" },
      { hangul: "연구 주제", meaning: "research topic" },
      { hangul: "선행 연구", meaning: "prior literature" },
      { hangul: "연구 격차", meaning: "research gap" },
      { hangul: "방법론", meaning: "methodology" },
      { hangul: "정성적·정량적", meaning: "qualitative·quantitative" },
      { hangul: "가설", meaning: "hypothesis" },
      { hangul: "사례 분석", meaning: "case analysis" },
      { hangul: "학술지", meaning: "academic journal" },
      { hangul: "공동 연구", meaning: "joint research" },
    ],
    sentences: [
      { korean: "저의 주된 연구 관심사는 한·베 디지털 무역입니다.", romanized: "Jeoui judoen yeongu gwansimsaneun han-be dijiteol muyeogimnida.", en: "My main research interest is Korea-Vietnam digital trade.", vi: "Mối quan tâm nghiên cứu chính của em là thương mại số Hàn-Việt." },
      { korean: "기존 연구는 주로 거시 차원에 집중되어 있습니다.", romanized: "Gijon yeonguneun juro geosi chawone jipjungdoeeo itsseumnida.", en: "Existing research mainly focuses on macro level.", vi: "Nghiên cứu hiện có chủ yếu tập trung tầng vĩ mô." },
      { korean: "제가 보완하고 싶은 부분은 중소기업 사례입니다.", romanized: "Jega bowanhago sipeun bubuneun jungsogieop saryeimnida.", en: "What I want to supplement is SME case studies.", vi: "Phần em muốn bổ sung là case study doanh nghiệp vừa & nhỏ." },
      { korean: "교수님의 최근 논문에서 영감을 받았습니다.", romanized: "Gyosunim-ui choegeun nonmuneseo yeonggameul badatsseumnida.", en: "I was inspired by your recent paper.", vi: "Em được truyền cảm hứng từ bài báo gần đây của thầy." },
      { korean: "공동 연구 가능성에 대해 여쭙고 싶습니다.", romanized: "Gongdong yeongu ganeungseonge daehae yeojupgo sipseumnida.", en: "I'd like to ask about joint research possibilities.", vi: "Em muốn hỏi về khả năng nghiên cứu chung." },
    ],
    dialogue: [
      { speaker: "A", hangul: "어떤 분야를 연구하고 계세요?", meaning: "What field do you research?" },
      { speaker: "B", hangul: "한·베 디지털 무역 분야이고, 특히 중소기업 사례에 관심이 있습니다.", meaning: "Korea-Vietnam digital trade, especially SME cases." },
      { speaker: "A", hangul: "흥미롭네요. 어떤 방법론을 사용하고 계십니까?", meaning: "Interesting. What methodology?" },
      { speaker: "B", hangul: "심층 면담과 사례 비교를 결합한 정성적 접근입니다.", meaning: "In-depth interviews combined with case comparison — qualitative." },
    ],
    dialogue_long: [
      { speaker: "A", hangul: "응웬 선생님, 발표 잘 들었습니다. 한·베 디지털 무역 쪽 관심이시군요.", meaning: "Ms. Nguyen, enjoyed your presentation. So you're interested in Korea-Vietnam digital trade.", vi: "Cô Nguyễn, tôi đã nghe bài thuyết trình. Cô quan tâm thương mại số Hàn-Việt nhỉ." },
      { speaker: "B", hangul: "감사합니다, 교수님. 좋게 봐 주셔서 영광입니다.", meaning: "Thank you, professor. It's an honor.", vi: "Cảm ơn thầy. Em vinh dự được thầy đánh giá tốt." },
      { speaker: "A", hangul: "구체적으로 어떤 연구 격차를 보고 계신가요?", meaning: "What specific research gap do you see?", vi: "Cụ thể em thấy khoảng trống nghiên cứu nào?" },
      { speaker: "B", hangul: "기존 연구는 주로 대기업 중심입니다. 베트남 중소기업의 한국 e-커머스 플랫폼 진출 사례는 거의 다뤄지지 않았습니다.", meaning: "Existing research is mostly large-firm focused. Vietnamese SMEs entering Korean e-commerce platforms is barely covered.", vi: "Nghiên cứu sẵn có tập trung tập đoàn lớn. Case DNVN nhỏ và vừa vào nền tảng e-commerce Hàn hầu như chưa có." },
      { speaker: "A", hangul: "방법론은요?", meaning: "Methodology?", vi: "Phương pháp?" },
      { speaker: "B", hangul: "정성적 접근으로, 베트남 식품 중소기업 10곳의 쿠팡·11번가 진출 사례를 심층 분석할 계획입니다.", meaning: "Qualitative — in-depth analysis of 10 Vietnamese F&B SMEs entering Coupang/11st.", vi: "Định tính — phân tích sâu 10 DNNVN thực phẩm Việt vào Coupang/11st." },
      { speaker: "A", hangul: "흥미로운 표본입니다. 그런데 정량적 데이터도 함께 보면 더 강한 그림이 나오지 않을까요?", meaning: "Interesting sample. But wouldn't quantitative data strengthen the picture?", vi: "Mẫu hay. Nhưng có thêm dữ liệu định lượng thì không khắc họa được rõ hơn sao?" },
      { speaker: "B", hangul: "맞는 말씀이십니다. 플랫폼 측에서 받을 수 있는 매출 데이터를 결합하는 혼합 방법론도 고려하고 있습니다.", meaning: "Right — I'm considering mixed methods, combining platform sales data.", vi: "Thầy nói đúng. Em đang cân nhắc phương pháp hỗn hợp kết hợp dữ liệu doanh số từ phía nền tảng." },
      { speaker: "A", hangul: "데이터 접근은 쉽지 않을 텐데, 어떻게 풀어 가실 계획입니까?", meaning: "Data access won't be easy — how will you handle it?", vi: "Tiếp cận dữ liệu không dễ — em xử lý thế nào?" },
      { speaker: "B", hangul: "KOTRA 하노이 사무소를 통해 플랫폼 측과 접촉할 예정입니다. 또 베트남 무역진흥청과의 협력 가능성도 검토 중입니다.", meaning: "Through KOTRA Hanoi for platform contacts, plus possible partnership with Vietnam Trade Promotion.", vi: "Qua KOTRA Hà Nội để liên hệ phía nền tảng, đồng thời đang xem xét hợp tác với Cục Xúc tiến Thương mại Việt Nam." },
      { speaker: "A", hangul: "체계적이시네요. 저희 연구실의 김 박사가 비슷한 주제 박사논문을 쓰고 있습니다. 한 번 만나 보시겠어요?", meaning: "Systematic. My Dr. Kim is doing a similar PhD thesis — care to meet?", vi: "Bài bản đấy. Anh Tiến sĩ Kim trong lab tôi đang viết luận tiến sĩ tương tự — em muốn gặp anh ấy không?" },
      { speaker: "B", hangul: "꼭 부탁드립니다. 큰 도움이 될 것 같습니다.", meaning: "Please — that would help a lot.", vi: "Em rất mong. Sẽ giúp em rất nhiều." },
      { speaker: "A", hangul: "그리고 혹시 저희 학회 8월 워크숍에 발표 의사 있으십니까? 신진 연구자 세션이 있는데요.", meaning: "Also, would you present at our August workshop? There's an early-career researcher session.", vi: "Còn nữa, em có muốn thuyết trình tại workshop tháng 8 của hội chúng tôi không? Có session cho nghiên cứu sinh trẻ." },
      { speaker: "B", hangul: "영광입니다. 자세한 안내 부탁드려도 될까요? 발표 자료를 미리 검토받고 싶습니다.", meaning: "An honor. Could you share details? I'd like preview feedback on my slides.", vi: "Em vinh dự quá. Thầy gửi thông tin chi tiết được không? Em muốn được nhận góp ý trước về slide." },
      { speaker: "A", hangul: "오늘 저녁 메일로 안내 드리겠습니다. 좋은 연구가 될 것 같으니 박차를 가해 주세요.", meaning: "I'll email you tonight. Looks promising — keep up the pace.", vi: "Tối nay tôi gửi email. Hứa hẹn lắm, em hãy tăng tốc nhé." },
      { speaker: "B", hangul: "교수님께서 관심 가져 주셔서 정말 큰 힘이 됩니다. 감사드립니다.", meaning: "Your interest means a lot. Thank you.", vi: "Sự quan tâm của thầy là động lực lớn. Em cảm ơn thầy." },
    ],
    roleplay_prompts: [
      "Tại 학회 (conference) Hàn, bạn đứng cạnh poster của một giáo sư. Diễn tập câu mở đầu academic small-talk: '교수님 발표 잘 들었습니다. 한 가지 여쭤봐도 될까요?' + 1 câu hỏi CỤ THỂ về methodology hoặc dữ liệu — bằng 하십시오체. Tránh hỏi chung 'thầy nghiên cứu gì?'.",
      "Giáo sư hỏi về 연구 격차 (research gap) trong lĩnh vực bạn quan tâm. Diễn tập câu trả lời 60s: nêu (1) hiện trạng nghiên cứu, (2) khoảng trống cụ thể với 1 ví dụ paper, (3) đóng góp của bạn — KHÔNG vòng vo, không nói 'em chưa biết rõ'.",
      "Giáo sư đề nghị 'em có muốn participate vào lab seminar tuần tới không?'. Diễn tập câu CHẤP NHẬN lịch sự + 1 câu hỏi follow-up thông minh (chủ đề seminar, có cần đọc paper trước, dress code) — bằng 하십시오체.",
    ],
    register_notes:
      "Trong môi trường học thuật Hàn, ranking quan trọng: 학사 < 석사 < 박사 < 박사 후 연구원 (postdoc) < 조교수 (assistant prof) < 부교수 (associate) < 정교수 (full prof). 하십시오체 với người cấp cao hơn rõ ràng — kể cả khi ngang tuổi. Cách gọi an toàn: ai có 박사 → '~ 박사님'; giáo sư → '~ 교수님'; nghiên cứu sinh không title → '~ 선생님' (an toàn). Khi không đồng ý với góp ý academic của giáo sư, KHÔNG nói '아닙니다' (sai) — dùng cấu trúc '말씀하신 부분도 일리가 있습니다. 다만 ~ 측면에서는…' (Thầy nói có lý. Tuy nhiên về khía cạnh ~…). Khi đề cập paper khác, dùng 'X 교수님의 2024년도 논문' (paper năm 2024 của giáo sư X) chứ không 'X paper'. Khi giáo sư khen 'good research' — KHÔNG '아니에요, 부족합니다' (Việt-style false modesty quá đà) — chỉ '감사합니다, 더 발전시키겠습니다' là đủ. // TODO native-review: '신진 연구자' vs '초기 경력 연구자' — both used for early-career researcher, native preference for academic events.",
    idiom_glosses: [
      { idiom: "한 우물을 파다", literal: "đào một cái giếng", meaning: "chuyên sâu một chủ đề", example: "박사 과정 동안 한 우물을 파야 합니다." },
      { idiom: "큰 그림을 그리다", literal: "vẽ bức tranh lớn", meaning: "tư duy chiến lược nghiên cứu", example: "큰 그림을 그리며 연구 계획을 세웁니다." },
      { idiom: "빛을 보다", literal: "thấy ánh sáng", meaning: "kết quả nghiên cứu được công nhận / xuất bản", example: "10년 노력 끝에 논문이 빛을 보았습니다." },
      { idiom: "박차를 가하다", literal: "thúc cựa ngựa", meaning: "tăng tốc / đẩy mạnh nỗ lực nghiên cứu", example: "마지막 학기에 논문 작성에 박차를 가했습니다." },
    ],
    cultural_notes_vi:
      "Học thuật Hàn xây trên 3 layer: 학연 (alumni), 사제 (master-disciple), 학파 (school of thought). Sinh viên Việt thường chỉ thấy layer 1 nhưng thực tế layer 2+3 quyết định nhiều: ai supervise bạn → ai introduce bạn → bạn được publish ở journal nào. Tại 학회 (conference): (1) Đứng cạnh poster của senior researcher 5-10 phút LÀ networking; (2) KHÔNG bắt tay khi tay người khác đang cầm nước (đợi họ đặt xuống); (3) Gọi tên đầy đủ + chức danh khi gặp lần đầu '김민수 교수님'; sau đó có thể '교수님'; (4) Khi senior chia sẻ ý tưởng nghiên cứu — KHÔNG note vào laptop trước mặt họ (xem là không tôn trọng); ghi tay rồi gõ lại sau. Quy tắc 'common ground': trước khi propose joint research, bạn phải đọc 2-3 paper gần nhất của họ và REFER cụ thể trong cuộc nói chuyện ('교수님 2024년 논문에서…'). Không refer = bị xem là chưa đủ chuẩn bị. Sau cuộc gặp, gửi follow-up email trong 48h kèm CV + concept paper 1 trang nếu định propose collaboration.",
    tip_advice_vi:
      "Pitch nghiên cứu hoàn hảo trong 60s: (1) HOOK — 1 câu nêu hiện trạng/vấn đề (vd: 'Thương mại số Hàn-Việt tăng 40% mỗi năm nhưng nghiên cứu chỉ tập trung tập đoàn lớn'); (2) GAP — khoảng trống cụ thể bạn thấy; (3) APPROACH — phương pháp bạn dùng (1 câu); (4) CONTRIBUTION — đóng góp; (5) ASK — câu hỏi ngược lại. Câu hỏi NGƯỢC quan trọng — academic Hàn xem 'không hỏi lại' là dấu hiệu thiếu engagement. Mẫu câu hỏi an toàn: '교수님께서는 이 분야에서 어떤 추가 연구가 필요하다고 보시는지요?' (Thầy thấy lĩnh vực này cần thêm nghiên cứu gì?). Khi giáo sư phản biện ('데이터 접근 어렵겠다'), KHÔNG defensive — show bạn ĐÃ NGHĨ về vấn đề: '맞는 말씀이십니다. 그래서 X와 Y 두 가지 접근을 준비했습니다.' (Thầy nói đúng. Nên em đã chuẩn bị 2 cách tiếp cận X và Y).",
    exercises: [
      { type: "fill-blank", question: "공동 연구 ___에 대해 여쭙고 싶습니다.", answer: "가능성" },
      {
        type: "matching",
        pairs: [
          { hangul: "한 우물을 파다", meaning: "chuyên sâu một chủ đề" },
          { hangul: "큰 그림을 그리다", meaning: "tư duy chiến lược" },
          { hangul: "빛을 보다", meaning: "được công nhận / xuất bản" },
          { hangul: "박차를 가하다", meaning: "tăng tốc nỗ lực" },
        ],
        instruction: "Nối thành ngữ với nghĩa",
      },
      { type: "translation", vietnamese: "Mối quan tâm nghiên cứu chính của em là thương mại số Hàn-Việt.", hangul: "저의 주된 연구 관심사는 한·베 디지털 무역입니다." },
    ],
  },
];
