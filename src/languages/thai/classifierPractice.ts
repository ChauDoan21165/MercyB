// src/languages/thai/classifierPractice.ts
//
// Thai classifier (ลักษณนาม, lák-sà-nà-naam) practice bank for
// Vietnamese-speaking AND English-speaking learners. Built by the A3 agent
// (Wave 4).
//
// Thai counts with the pattern Noun + Number + Classifier (รถสองคัน,
// lit. "car two CL"). Vietnamese has a similar device (hai chiếc xe), so VI
// learners mostly need to relearn ORDER; English has no everyday classifiers,
// so EN learners must learn the whole system. Each item is a drill card:
//   • the noun (Thai + romanization + EN/VI gloss),
//   • its usual classifier,
//   • a worked example phrase that actually counts the noun,
//   • the common mistake a VI/EN learner makes,
//   • and a practice prompt (with an answer key).
//
// Self-contained: the Thai vertical has no shared classifier registry yet, so
// the types live here. Native review is DEFERRED — classifier choice can vary
// by register and region, and some nouns accept more than one classifier; the
// "common" choice is given. No native authority is claimed.

// ── Types ───────────────────────────────────────────────────────────────────

export type ThaiClassifierCategory =
  | "people"
  | "objects"
  | "animals"
  | "vehicles"
  | "books_documents"
  | "food_drink"
  | "places"
  | "general";

export type ThaiClassifierItem = {
  id: string;
  category: ThaiClassifierCategory;
  /** The noun being counted (Thai script). */
  noun: string;
  noun_rtgs: string;
  noun_en: string;
  noun_vi: string;
  /** The usual classifier (Thai script). */
  classifier: string;
  classifier_rtgs: string;
  classifier_en: string;
  classifier_vi: string;
  /** A worked example that counts the noun. */
  example_th: string;
  example_rtgs: string;
  example_vi: string;
  example_en: string;
  /** The common mistake learners make, bilingual. */
  common_mistake_vi: string;
  common_mistake_en: string;
  /** A drill prompt, bilingual, plus a model answer. */
  practice_prompt_vi: string;
  practice_prompt_en: string;
  practice_answer_th: string;
};

// Small helper to keep each item compact and consistent.
function item(
  id: string,
  category: ThaiClassifierCategory,
  noun: [string, string, string, string],
  classifier: [string, string, string, string],
  example: [string, string, string, string],
  mistake: [string, string],
  practice: [string, string, string],
): ThaiClassifierItem {
  return {
    id,
    category,
    noun: noun[0],
    noun_rtgs: noun[1],
    noun_en: noun[2],
    noun_vi: noun[3],
    classifier: classifier[0],
    classifier_rtgs: classifier[1],
    classifier_en: classifier[2],
    classifier_vi: classifier[3],
    example_th: example[0],
    example_rtgs: example[1],
    example_vi: example[2],
    example_en: example[3],
    common_mistake_vi: mistake[0],
    common_mistake_en: mistake[1],
    practice_prompt_vi: practice[0],
    practice_prompt_en: practice[1],
    practice_answer_th: practice[2],
  };
}

// ── People (คน; monks take รูป/องค์) ────────────────────────────────────────

const people: ThaiClassifierItem[] = [
  item("thai_clf_people_person", "people",
    ["คน", "khon", "person", "người"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["คนสามคน", "khon sǎam khon", "ba người", "three people"],
    ["Bỏ loại từ: 'คนสาม' — đếm người luôn cần 'คน'.", "Dropping it: 'คนสาม' — counting people always needs 'คน'."],
    ["Đếm 5 người.", "Count 5 people.", "คนห้าคน"]),
  item("thai_clf_people_student", "people",
    ["นักเรียน", "nák-rian", "student", "học sinh"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["นักเรียนสามสิบคน", "nák-rian sǎam-sìp khon", "ba mươi học sinh", "thirty students"],
    ["Dùng 'ตัว' cho người — sai; người luôn là 'คน'.", "Using 'ตัว' for people — wrong; people take 'คน'."],
    ["Đếm 20 học sinh.", "Count 20 students.", "นักเรียนยี่สิบคน"]),
  item("thai_clf_people_teacher", "people",
    ["ครู", "khruu", "teacher", "giáo viên"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["ครูสองคน", "khruu sǎawng khon", "hai giáo viên", "two teachers"],
    ["Quên loại từ khi đếm nghề nghiệp.", "Forgetting the classifier when counting by profession."],
    ["Đếm 4 giáo viên.", "Count 4 teachers.", "ครูสี่คน"]),
  item("thai_clf_people_doctor", "people",
    ["หมอ", "mǎaw", "doctor", "bác sĩ"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["หมอหนึ่งคน", "mǎaw nùeng khon", "một bác sĩ", "one doctor"],
    ["Đảo thứ tự kiểu Việt: 'หนึ่งคนหมอ'.", "Vietnamese-style order: 'หนึ่งคนหมอ' is wrong."],
    ["Đếm 3 bác sĩ.", "Count 3 doctors.", "หมอสามคน"]),
  item("thai_clf_people_friend", "people",
    ["เพื่อน", "phûean", "friend", "bạn"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["เพื่อนห้าคน", "phûean hâa khon", "năm người bạn", "five friends"],
    ["Nói 'เพื่อนห้า' thiếu loại từ.", "Saying 'เพื่อนห้า' without the classifier."],
    ["Đếm 2 người bạn.", "Count 2 friends.", "เพื่อนสองคน"]),
  item("thai_clf_people_child", "people",
    ["เด็ก", "dèk", "child", "đứa trẻ"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["เด็กสี่คน", "dèk sìi khon", "bốn đứa trẻ", "four children"],
    ["Dùng 'ตัว' cho trẻ em — sai và bất lịch sự; dùng 'คน'.", "Using 'ตัว' for children — wrong and impolite; use 'คน'."],
    ["Đếm 6 đứa trẻ.", "Count 6 children.", "เด็กหกคน"]),
  item("thai_clf_people_police", "people",
    ["ตำรวจ", "dtam-rùat", "police officer", "cảnh sát"],
    ["คน", "khon", "classifier for people", "loại từ cho người"],
    ["ตำรวจสองคน", "dtam-rùat sǎawng khon", "hai cảnh sát", "two police officers"],
    ["Quên loại từ với danh từ nghề nghiệp dài.", "Forgetting the classifier with longer job nouns."],
    ["Đếm 5 cảnh sát.", "Count 5 police officers.", "ตำรวจห้าคน"]),
  item("thai_clf_people_monk", "people",
    ["พระ", "phrá", "monk", "nhà sư"],
    ["รูป", "rûup", "classifier for monks", "loại từ cho nhà sư"],
    ["พระห้ารูป", "phrá hâa rûup", "năm nhà sư", "five monks"],
    ["Dùng 'คน' cho nhà sư — nên dùng 'รูป' (kính ngữ).", "Using 'คน' for monks — use the honorific 'รูป' instead."],
    ["Đếm 3 nhà sư.", "Count 3 monks.", "พระสามรูป"]),
];

// ── Animals (ตัว) ───────────────────────────────────────────────────────────

const animals: ThaiClassifierItem[] = [
  item("thai_clf_animal_dog", "animals",
    ["หมา", "mǎa", "dog", "con chó"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["หมาสองตัว", "mǎa sǎawng dtua", "hai con chó", "two dogs"],
    ["Dùng 'คน' cho động vật — sai; động vật là 'ตัว'.", "Using 'คน' for animals — wrong; animals take 'ตัว'."],
    ["Đếm 4 con chó.", "Count 4 dogs.", "หมาสี่ตัว"]),
  item("thai_clf_animal_cat", "animals",
    ["แมว", "maaeo", "cat", "con mèo"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["แมวสามตัว", "maaeo sǎam dtua", "ba con mèo", "three cats"],
    ["Quên loại từ: 'แมวสาม'.", "Forgetting it: 'แมวสาม'."],
    ["Đếm 2 con mèo.", "Count 2 cats.", "แมวสองตัว"]),
  item("thai_clf_animal_elephant", "animals",
    ["ช้าง", "cháang", "elephant", "con voi"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["ช้างสี่ตัว", "cháang sìi dtua", "bốn con voi", "four elephants"],
    ["Tưởng vật lớn cần loại từ khác — voi vẫn là 'ตัว'.", "Assuming big animals need a different word — elephants are still 'ตัว'."],
    ["Đếm 5 con voi.", "Count 5 elephants.", "ช้างห้าตัว"]),
  item("thai_clf_animal_bird", "animals",
    ["นก", "nók", "bird", "con chim"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["นกหกตัว", "nók hòk dtua", "sáu con chim", "six birds"],
    ["Dùng 'อัน' cho chim — sai; sinh vật sống là 'ตัว'.", "Using 'อัน' for birds — wrong; living creatures take 'ตัว'."],
    ["Đếm 3 con chim.", "Count 3 birds.", "นกสามตัว"]),
  item("thai_clf_animal_fish", "animals",
    ["ปลา", "bplaa", "fish", "con cá"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["ปลาสองตัว", "bplaa sǎawng dtua", "hai con cá", "two fish"],
    ["Cá khi còn sống là 'ตัว'; món cá có thể đếm theo phần.", "Live fish is 'ตัว'; a fish dish may be counted by serving."],
    ["Đếm 4 con cá.", "Count 4 fish.", "ปลาสี่ตัว"]),
  item("thai_clf_animal_horse", "animals",
    ["ม้า", "máa", "horse", "con ngựa"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["ม้าสามตัว", "máa sǎam dtua", "ba con ngựa", "three horses"],
    ["Quên loại từ khi đếm gia súc.", "Forgetting the classifier when counting livestock."],
    ["Đếm 2 con ngựa.", "Count 2 horses.", "ม้าสองตัว"]),
  item("thai_clf_animal_cow", "animals",
    ["วัว", "wua", "cow", "con bò"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["วัวห้าตัว", "wua hâa dtua", "năm con bò", "five cows"],
    ["Đảo thứ tự: 'ห้าตัววัว'.", "Wrong order: 'ห้าตัววัว'."],
    ["Đếm 6 con bò.", "Count 6 cows.", "วัวหกตัว"]),
  item("thai_clf_animal_chicken", "animals",
    ["ไก่", "gài", "chicken", "con gà"],
    ["ตัว", "dtua", "classifier for animals", "loại từ cho động vật"],
    ["ไก่สิบตัว", "gài sìp dtua", "mười con gà", "ten chickens"],
    ["Gà sống là 'ตัว'; thịt gà món ăn đếm theo phần/đĩa.", "A live chicken is 'ตัว'; cooked chicken is counted by dish/serving."],
    ["Đếm 3 con gà.", "Count 3 chickens.", "ไก่สามตัว"]),
];

// ── Objects (mixed: ตัว / ใบ / ด้าม / เครื่อง / คัน) ─────────────────────────

const objects: ThaiClassifierItem[] = [
  item("thai_clf_obj_chair", "objects",
    ["เก้าอี้", "gâo-îi", "chair", "cái ghế"],
    ["ตัว", "dtua", "classifier for furniture (chairs/tables)", "loại từ cho bàn ghế"],
    ["เก้าอี้สี่ตัว", "gâo-îi sìi dtua", "bốn cái ghế", "four chairs"],
    ["Dùng 'อัน' cho ghế — bàn ghế dùng 'ตัว'.", "Using 'อัน' for a chair — furniture like chairs takes 'ตัว'."],
    ["Đếm 6 cái ghế.", "Count 6 chairs.", "เก้าอี้หกตัว"]),
  item("thai_clf_obj_table", "objects",
    ["โต๊ะ", "dtó", "table", "cái bàn"],
    ["ตัว", "dtua", "classifier for furniture", "loại từ cho bàn ghế"],
    ["โต๊ะสองตัว", "dtó sǎawng dtua", "hai cái bàn", "two tables"],
    ["Tưởng 'ตัว' chỉ cho động vật — bàn ghế cũng dùng 'ตัว'.", "Thinking 'ตัว' is only for animals — furniture uses it too."],
    ["Đếm 3 cái bàn.", "Count 3 tables.", "โต๊ะสามตัว"]),
  item("thai_clf_obj_glass", "objects",
    ["แก้ว", "gâaeo", "glass / cup", "cái ly"],
    ["ใบ", "bai", "classifier for containers/cups", "loại từ cho đồ chứa/ly"],
    ["แก้วสามใบ", "gâaeo sǎam bai", "ba cái ly", "three glasses"],
    ["Dùng 'อัน' cho ly — đồ chứa rỗng dùng 'ใบ'.", "Using 'อัน' for a glass — empty containers take 'ใบ'."],
    ["Đếm 5 cái ly.", "Count 5 glasses.", "แก้วห้าใบ"]),
  item("thai_clf_obj_plate", "objects",
    ["จาน", "jaan", "plate", "cái đĩa"],
    ["ใบ", "bai", "classifier for dishes/containers", "loại từ cho đĩa/đồ chứa"],
    ["จานสองใบ", "jaan sǎawng bai", "hai cái đĩa", "two plates"],
    ["'จาน' rỗng đếm bằng 'ใบ'; món ăn 'một đĩa' lại dùng 'จาน' làm loại từ.", "An empty plate counts with 'ใบ'; a 'plate of food' uses 'จาน' itself as the classifier."],
    ["Đếm 4 cái đĩa.", "Count 4 plates.", "จานสี่ใบ"]),
  item("thai_clf_obj_bag", "objects",
    ["กระเป๋า", "grà-bpǎo", "bag", "cái túi/cặp"],
    ["ใบ", "bai", "classifier for bags/containers", "loại từ cho túi/đồ chứa"],
    ["กระเป๋าสองใบ", "grà-bpǎo sǎawng bai", "hai cái túi", "two bags"],
    ["Dùng 'อัน' cho túi — túi/cặp dùng 'ใบ'.", "Using 'อัน' for a bag — bags take 'ใบ'."],
    ["Đếm 3 cái túi.", "Count 3 bags.", "กระเป๋าสามใบ"]),
  item("thai_clf_obj_pen", "objects",
    ["ปากกา", "bpàak-gaa", "pen", "cây bút"],
    ["ด้าม", "dâam", "classifier for pens/long-handled items", "loại từ cho bút/vật có cán"],
    ["ปากกาสองด้าม", "bpàak-gaa sǎawng dâam", "hai cây bút", "two pens"],
    ["Dùng 'อัน' cho bút — bút dùng 'ด้าม'.", "Using 'อัน' for a pen — pens take 'ด้าม'."],
    ["Đếm 5 cây bút.", "Count 5 pens.", "ปากกาห้าด้าม"]),
  item("thai_clf_obj_phone", "objects",
    ["โทรศัพท์", "thoo-rá-sàp", "telephone", "điện thoại"],
    ["เครื่อง", "khrûeang", "classifier for machines/devices", "loại từ cho máy móc/thiết bị"],
    ["โทรศัพท์สองเครื่อง", "thoo-rá-sàp sǎawng khrûeang", "hai cái điện thoại", "two phones"],
    ["Dùng 'อัน' cho điện thoại — thiết bị điện dùng 'เครื่อง'.", "Using 'อัน' for a phone — electronic devices take 'เครื่อง'."],
    ["Đếm 3 cái điện thoại.", "Count 3 phones.", "โทรศัพท์สามเครื่อง"]),
  item("thai_clf_obj_umbrella", "objects",
    ["ร่ม", "rôm", "umbrella", "cái ô/dù"],
    ["คัน", "khan", "classifier for umbrellas/long-handled items", "loại từ cho ô/vật có cán"],
    ["ร่มสองคัน", "rôm sǎawng khan", "hai cái ô", "two umbrellas"],
    ["Dùng 'ใบ' hoặc 'อัน' cho ô — ô dùng 'คัน' (giống xe).", "Using 'ใบ'/'อัน' for an umbrella — it takes 'คัน', like vehicles."],
    ["Đếm 4 cái ô.", "Count 4 umbrellas.", "ร่มสี่คัน"]),
];

// ── Vehicles (คัน; boats/planes ลำ; trains ขบวน) ─────────────────────────────

const vehicles: ThaiClassifierItem[] = [
  item("thai_clf_veh_car", "vehicles",
    ["รถยนต์", "rót-yon", "car", "ô tô"],
    ["คัน", "khan", "classifier for road vehicles", "loại từ cho xe"],
    ["รถยนต์สองคัน", "rót-yon sǎawng khan", "hai chiếc ô tô", "two cars"],
    ["Đảo thứ tự kiểu Việt: 'สองคันรถ'.", "Vietnamese-style order: 'สองคันรถ' is wrong."],
    ["Đếm 3 chiếc ô tô.", "Count 3 cars.", "รถยนต์สามคัน"]),
  item("thai_clf_veh_motorbike", "vehicles",
    ["มอเตอร์ไซค์", "maaw-dtoe-sai", "motorbike", "xe máy"],
    ["คัน", "khan", "classifier for road vehicles", "loại từ cho xe"],
    ["มอเตอร์ไซค์สี่คัน", "maaw-dtoe-sai sìi khan", "bốn chiếc xe máy", "four motorbikes"],
    ["Quên loại từ: 'มอเตอร์ไซค์สี่'.", "Forgetting it: 'มอเตอร์ไซค์สี่'."],
    ["Đếm 2 xe máy.", "Count 2 motorbikes.", "มอเตอร์ไซค์สองคัน"]),
  item("thai_clf_veh_bicycle", "vehicles",
    ["จักรยาน", "jàk-grà-yaan", "bicycle", "xe đạp"],
    ["คัน", "khan", "classifier for road vehicles", "loại từ cho xe"],
    ["จักรยานสามคัน", "jàk-grà-yaan sǎam khan", "ba chiếc xe đạp", "three bicycles"],
    ["Dùng 'อัน' cho xe đạp — xe dùng 'คัน'.", "Using 'อัน' for a bicycle — vehicles take 'คัน'."],
    ["Đếm 5 xe đạp.", "Count 5 bicycles.", "จักรยานห้าคัน"]),
  item("thai_clf_veh_bus", "vehicles",
    ["รถเมล์", "rót-mee", "city bus", "xe buýt"],
    ["คัน", "khan", "classifier for road vehicles", "loại từ cho xe"],
    ["รถเมล์สองคัน", "rót-mee sǎawng khan", "hai chiếc xe buýt", "two buses"],
    ["Quên loại từ với phương tiện công cộng.", "Forgetting the classifier for public vehicles."],
    ["Đếm 4 xe buýt.", "Count 4 buses.", "รถเมล์สี่คัน"]),
  item("thai_clf_veh_boat", "vehicles",
    ["เรือ", "ruea", "boat", "thuyền/ghe"],
    ["ลำ", "lam", "classifier for boats/ships", "loại từ cho thuyền/tàu"],
    ["เรือสามลำ", "ruea sǎam lam", "ba chiếc thuyền", "three boats"],
    ["Dùng 'คัน' cho thuyền — thuyền/tàu dùng 'ลำ'.", "Using 'คัน' for a boat — boats/ships take 'ลำ'."],
    ["Đếm 2 chiếc thuyền.", "Count 2 boats.", "เรือสองลำ"]),
  item("thai_clf_veh_plane", "vehicles",
    ["เครื่องบิน", "khrûeang-bin", "airplane", "máy bay"],
    ["ลำ", "lam", "classifier for aircraft/boats", "loại từ cho máy bay/tàu thuyền"],
    ["เครื่องบินสองลำ", "khrûeang-bin sǎawng lam", "hai chiếc máy bay", "two airplanes"],
    ["Dùng 'คัน' hoặc 'เครื่อง' cho máy bay — chuẩn là 'ลำ'.", "Using 'คัน'/'เครื่อง' for a plane — the standard is 'ลำ'."],
    ["Đếm 3 máy bay.", "Count 3 airplanes.", "เครื่องบินสามลำ"]),
  item("thai_clf_veh_train", "vehicles",
    ["รถไฟ", "rót-fai", "train", "tàu hỏa"],
    ["ขบวน", "khà-buan", "classifier for trains (whole train)", "loại từ cho đoàn tàu"],
    ["รถไฟสองขบวน", "rót-fai sǎawng khà-buan", "hai đoàn tàu", "two trains"],
    ["Dùng 'คัน' cho cả đoàn tàu — đoàn tàu dùng 'ขบวน'.", "Using 'คัน' for a whole train — a train uses 'ขบวน'."],
    ["Đếm 3 đoàn tàu.", "Count 3 trains.", "รถไฟสามขบวน"]),
  item("thai_clf_veh_truck", "vehicles",
    ["รถบรรทุก", "rót-ban-thúk", "truck", "xe tải"],
    ["คัน", "khan", "classifier for road vehicles", "loại từ cho xe"],
    ["รถบรรทุกห้าคัน", "rót-ban-thúk hâa khan", "năm chiếc xe tải", "five trucks"],
    ["Quên loại từ với xe lớn.", "Forgetting the classifier for large vehicles."],
    ["Đếm 2 xe tải.", "Count 2 trucks.", "รถบรรทุกสองคัน"]),
];

// ── Books & documents (เล่ม; sheets/issues ฉบับ/ใบ) ──────────────────────────

const books: ThaiClassifierItem[] = [
  item("thai_clf_book_book", "books_documents",
    ["หนังสือ", "nǎng-sǔe", "book", "quyển sách"],
    ["เล่ม", "lêm", "classifier for books/bound volumes", "loại từ cho sách/vở"],
    ["หนังสือสามเล่ม", "nǎng-sǔe sǎam lêm", "ba quyển sách", "three books"],
    ["Dùng 'อัน' cho sách — sách đóng tập dùng 'เล่ม'.", "Using 'อัน' for a book — bound volumes take 'เล่ม'."],
    ["Đếm 5 quyển sách.", "Count 5 books.", "หนังสือห้าเล่ม"]),
  item("thai_clf_book_notebook", "books_documents",
    ["สมุด", "sà-mùt", "notebook", "quyển vở"],
    ["เล่ม", "lêm", "classifier for books/notebooks", "loại từ cho sách/vở"],
    ["สมุดสองเล่ม", "sà-mùt sǎawng lêm", "hai quyển vở", "two notebooks"],
    ["Quên loại từ: 'สมุดสอง'.", "Forgetting it: 'สมุดสอง'."],
    ["Đếm 4 quyển vở.", "Count 4 notebooks.", "สมุดสี่เล่ม"]),
  item("thai_clf_book_magazine", "books_documents",
    ["นิตยสาร", "nít-dtà-yá-sǎan", "magazine", "tạp chí"],
    ["เล่ม", "lêm", "classifier for magazines/volumes", "loại từ cho tạp chí/sách"],
    ["นิตยสารสามเล่ม", "nít-dtà-yá-sǎan sǎam lêm", "ba quyển tạp chí", "three magazines"],
    ["Dùng 'ฉบับ' cho tạp chí đóng tập — thường dùng 'เล่ม'.", "Using 'ฉบับ' for a bound magazine — usually 'เล่ม' is used."],
    ["Đếm 2 quyển tạp chí.", "Count 2 magazines.", "นิตยสารสองเล่ม"]),
  item("thai_clf_book_newspaper", "books_documents",
    ["หนังสือพิมพ์", "nǎng-sǔe-phim", "newspaper", "tờ báo"],
    ["ฉบับ", "chà-bàp", "classifier for issues/copies", "loại từ cho số báo/bản"],
    ["หนังสือพิมพ์สองฉบับ", "nǎng-sǔe-phim sǎawng chà-bàp", "hai tờ báo", "two newspapers"],
    ["Dùng 'เล่ม' cho báo — báo/ấn bản dùng 'ฉบับ'.", "Using 'เล่ม' for a newspaper — issues/editions take 'ฉบับ'."],
    ["Đếm 3 tờ báo.", "Count 3 newspapers.", "หนังสือพิมพ์สามฉบับ"]),
  item("thai_clf_book_letter", "books_documents",
    ["จดหมาย", "jòt-mǎai", "letter", "lá thư"],
    ["ฉบับ", "chà-bàp", "classifier for letters/documents", "loại từ cho thư/văn bản"],
    ["จดหมายสามฉบับ", "jòt-mǎai sǎam chà-bàp", "ba lá thư", "three letters"],
    ["Dùng 'ใบ' hoặc 'อัน' cho thư — thư dùng 'ฉบับ'.", "Using 'ใบ'/'อัน' for a letter — letters take 'ฉบับ'."],
    ["Đếm 2 lá thư.", "Count 2 letters.", "จดหมายสองฉบับ"]),
  item("thai_clf_book_document", "books_documents",
    ["เอกสาร", "èek-gà-sǎan", "document", "tài liệu/giấy tờ"],
    ["ใบ", "bai", "classifier for sheets/forms", "loại từ cho tờ/giấy"],
    ["เอกสารสองใบ", "èek-gà-sǎan sǎawng bai", "hai tờ tài liệu", "two documents"],
    ["Văn bản dạng tờ rời dùng 'ใบ'; bản chính thức có thể dùng 'ฉบับ'.", "Loose sheets take 'ใบ'; a formal copy may take 'ฉบับ'."],
    ["Đếm 4 tờ tài liệu.", "Count 4 documents.", "เอกสารสี่ใบ"]),
  item("thai_clf_book_ticket", "books_documents",
    ["ตั๋ว", "dtǔa", "ticket", "vé"],
    ["ใบ", "bai", "classifier for tickets/cards/sheets", "loại từ cho vé/thẻ/tờ"],
    ["ตั๋วสามใบ", "dtǔa sǎam bai", "ba cái vé", "three tickets"],
    ["Dùng 'อัน' cho vé — vé/thẻ giấy dùng 'ใบ'.", "Using 'อัน' for a ticket — tickets/cards take 'ใบ'."],
    ["Đếm 5 cái vé.", "Count 5 tickets.", "ตั๋วห้าใบ"]),
  item("thai_clf_book_dictionary", "books_documents",
    ["พจนานุกรม", "phót-jà-naa-nú-grom", "dictionary", "từ điển"],
    ["เล่ม", "lêm", "classifier for books/volumes", "loại từ cho sách"],
    ["พจนานุกรมหนึ่งเล่ม", "phót-jà-naa-nú-grom nùeng lêm", "một quyển từ điển", "one dictionary"],
    ["Quên loại từ với danh từ dài.", "Forgetting the classifier with a long noun."],
    ["Đếm 2 quyển từ điển.", "Count 2 dictionaries.", "พจนานุกรมสองเล่ม"]),
];

// ── Food & drink (จาน/ชาม/แก้ว/ขวด/ฟอง/ลูก/แผ่น) ────────────────────────────

const food: ThaiClassifierItem[] = [
  item("thai_clf_food_rice", "food_drink",
    ["ข้าว", "khâao", "rice (a plate of)", "cơm (đĩa)"],
    ["จาน", "jaan", "classifier: plate (of food)", "loại từ: đĩa (thức ăn)"],
    ["ข้าวสองจาน", "khâao sǎawng jaan", "hai đĩa cơm", "two plates of rice"],
    ["Dùng 'อัน' cho phần ăn — món trên đĩa dùng 'จาน'.", "Using 'อัน' for a serving — a plated dish uses 'จาน'."],
    ["Gọi 3 đĩa cơm.", "Order 3 plates of rice.", "ข้าวสามจาน"]),
  item("thai_clf_food_noodles", "food_drink",
    ["ก๋วยเตี๋ยว", "gǔay-dtǐao", "noodle soup (a bowl of)", "phở/hủ tiếu (tô)"],
    ["ชาม", "chaam", "classifier: bowl (of food)", "loại từ: tô/bát"],
    ["ก๋วยเตี๋ยวสองชาม", "gǔay-dtǐao sǎawng chaam", "hai tô mì", "two bowls of noodles"],
    ["Dùng 'จาน' cho món nước — món trong tô dùng 'ชาม'.", "Using 'จาน' for soup — a bowl dish uses 'ชาม'."],
    ["Gọi 1 tô mì.", "Order 1 bowl of noodles.", "ก๋วยเตี๋ยวหนึ่งชาม"]),
  item("thai_clf_food_coffee", "food_drink",
    ["กาแฟ", "gaa-faae", "coffee (a cup of)", "cà phê (ly)"],
    ["แก้ว", "gâaeo", "classifier: glass/cup (of drink)", "loại từ: ly/cốc"],
    ["กาแฟสองแก้ว", "gaa-faae sǎawng gâaeo", "hai ly cà phê", "two cups of coffee"],
    ["Cà phê đá dùng 'แก้ว'; cà phê nóng có thể dùng 'ถ้วย' (tách).", "Iced coffee uses 'แก้ว'; hot coffee may use 'ถ้วย' (cup)."],
    ["Gọi 3 ly cà phê.", "Order 3 coffees.", "กาแฟสามแก้ว"]),
  item("thai_clf_food_water", "food_drink",
    ["น้ำ", "náam", "water (a bottle of)", "nước (chai)"],
    ["ขวด", "khùuat", "classifier: bottle", "loại từ: chai"],
    ["น้ำสามขวด", "náam sǎam khùuat", "ba chai nước", "three bottles of water"],
    ["Nước trong ly dùng 'แก้ว'; nước đóng chai dùng 'ขวด'.", "Water in a glass is 'แก้ว'; bottled water is 'ขวด'."],
    ["Mua 2 chai nước.", "Buy 2 bottles of water.", "น้ำสองขวด"]),
  item("thai_clf_food_egg", "food_drink",
    ["ไข่", "khài", "egg", "quả trứng"],
    ["ฟอง", "faawng", "classifier for eggs", "loại từ cho trứng"],
    ["ไข่สิบฟอง", "khài sìp faawng", "mười quả trứng", "ten eggs"],
    ["Dùng 'ลูก' hoặc 'อัน' cho trứng — trứng dùng 'ฟอง'.", "Using 'ลูก'/'อัน' for eggs — eggs take 'ฟอง'."],
    ["Mua 6 quả trứng.", "Buy 6 eggs.", "ไข่หกฟอง"]),
  item("thai_clf_food_banana", "food_drink",
    ["กล้วย", "glûay", "banana", "quả chuối"],
    ["ลูก", "lûuk", "classifier for round/fruit items", "loại từ cho quả tròn/trái cây"],
    ["กล้วยสามลูก", "glûay sǎam lûuk", "ba quả chuối", "three bananas"],
    ["Một nải chuối dùng 'หวี'; từng quả dùng 'ลูก'.", "A bunch of bananas is 'หวี'; a single banana is 'ลูก'."],
    ["Đếm 5 quả chuối.", "Count 5 bananas.", "กล้วยห้าลูก"]),
  item("thai_clf_food_bread", "food_drink",
    ["ขนมปัง", "khà-nǒm-bpang", "bread (a slice of)", "bánh mì (lát)"],
    ["แผ่น", "phàen", "classifier for slices/flat sheets", "loại từ cho lát/miếng phẳng"],
    ["ขนมปังสองแผ่น", "khà-nǒm-bpang sǎawng phàen", "hai lát bánh mì", "two slices of bread"],
    ["Lát bánh dùng 'แผ่น'; ổ/cục dùng 'ก้อน'.", "A slice is 'แผ่น'; a loaf/lump is 'ก้อน'."],
    ["Đếm 4 lát bánh mì.", "Count 4 slices of bread.", "ขนมปังสี่แผ่น"]),
  item("thai_clf_food_beer", "food_drink",
    ["เบียร์", "bia", "beer (a bottle of)", "bia (chai)"],
    ["ขวด", "khùuat", "classifier: bottle", "loại từ: chai"],
    ["เบียร์สามขวด", "bia sǎam khùuat", "ba chai bia", "three bottles of beer"],
    ["Bia lon dùng 'กระป๋อง'; bia chai dùng 'ขวด'.", "Canned beer is 'กระป๋อง'; bottled beer is 'ขวด'."],
    ["Gọi 2 chai bia.", "Order 2 bottles of beer.", "เบียร์สองขวด"]),
];

// ── Places (mixed: หลัง / แห่ง / ห้อง / self-classifier) ─────────────────────

const places: ThaiClassifierItem[] = [
  item("thai_clf_place_house", "places",
    ["บ้าน", "bâan", "house", "ngôi nhà"],
    ["หลัง", "lǎng", "classifier for houses/buildings", "loại từ cho nhà/tòa nhà"],
    ["บ้านสองหลัง", "bâan sǎawng lǎng", "hai ngôi nhà", "two houses"],
    ["Dùng 'อัน' cho nhà — nhà/tòa nhà dùng 'หลัง'.", "Using 'อัน' for a house — houses/buildings take 'หลัง'."],
    ["Đếm 3 ngôi nhà.", "Count 3 houses.", "บ้านสามหลัง"]),
  item("thai_clf_place_building", "places",
    ["ตึก", "dtùek", "building", "tòa nhà"],
    ["หลัง", "lǎng", "classifier for buildings", "loại từ cho tòa nhà"],
    ["ตึกสี่หลัง", "dtùek sìi lǎng", "bốn tòa nhà", "four buildings"],
    ["Quên loại từ: 'ตึกสี่'.", "Forgetting it: 'ตึกสี่'."],
    ["Đếm 2 tòa nhà.", "Count 2 buildings.", "ตึกสองหลัง"]),
  item("thai_clf_place_restaurant", "places",
    ["ร้านอาหาร", "ráan-aa-hǎan", "restaurant", "nhà hàng"],
    ["ร้าน", "ráan", "self-classifier: shop/eatery", "loại từ tự thân: quán/tiệm"],
    ["ร้านอาหารสองร้าน", "ráan-aa-hǎan sǎawng ráan", "hai nhà hàng", "two restaurants"],
    ["Một số danh từ tự làm loại từ: 'ร้าน...สองร้าน'. Đừng dùng 'อัน'.", "Some nouns are their own classifier: 'ร้าน…สองร้าน'. Don't use 'อัน'."],
    ["Đếm 3 nhà hàng.", "Count 3 restaurants.", "ร้านอาหารสามร้าน"]),
  item("thai_clf_place_school", "places",
    ["โรงเรียน", "roong-rian", "school", "trường học"],
    ["แห่ง", "hàeng", "classifier for institutions/places", "loại từ cho cơ sở/địa điểm"],
    ["โรงเรียนสองแห่ง", "roong-rian sǎawng hàeng", "hai trường học", "two schools"],
    ["Dùng 'อัน' cho trường — cơ sở/địa điểm dùng 'แห่ง'.", "Using 'อัน' for a school — institutions/places take 'แห่ง'."],
    ["Đếm 4 trường học.", "Count 4 schools.", "โรงเรียนสี่แห่ง"]),
  item("thai_clf_place_temple", "places",
    ["วัด", "wát", "temple", "ngôi chùa"],
    ["แห่ง", "hàeng", "classifier for places/sites", "loại từ cho địa điểm/nơi"],
    ["วัดสามแห่ง", "wát sǎam hàeng", "ba ngôi chùa", "three temples"],
    ["'วัด' cũng có thể tự làm loại từ; 'แห่ง' là lựa chọn trung lập.", "'วัด' can self-classify too; 'แห่ง' is the neutral choice."],
    ["Đếm 2 ngôi chùa.", "Count 2 temples.", "วัดสองแห่ง"]),
  item("thai_clf_place_room", "places",
    ["ห้อง", "hâawng", "room", "căn phòng"],
    ["ห้อง", "hâawng", "self-classifier: room", "loại từ tự thân: phòng"],
    ["ห้องสามห้อง", "hâawng sǎam hâawng", "ba căn phòng", "three rooms"],
    ["'ห้อง' tự làm loại từ; đừng đổi sang 'อัน'.", "'ห้อง' is its own classifier; don't switch to 'อัน'."],
    ["Đếm 5 căn phòng.", "Count 5 rooms.", "ห้องห้าห้อง"]),
  item("thai_clf_place_hotel", "places",
    ["โรงแรม", "roong-raaem", "hotel", "khách sạn"],
    ["แห่ง", "hàeng", "classifier for places/establishments", "loại từ cho cơ sở/địa điểm"],
    ["โรงแรมสองแห่ง", "roong-raaem sǎawng hàeng", "hai khách sạn", "two hotels"],
    ["Quên loại từ với cơ sở dịch vụ.", "Forgetting the classifier for establishments."],
    ["Đếm 3 khách sạn.", "Count 3 hotels.", "โรงแรมสามแห่ง"]),
  item("thai_clf_place_island", "places",
    ["เกาะ", "gàw", "island", "hòn đảo"],
    ["เกาะ", "gàw", "self-classifier: island", "loại từ tự thân: đảo"],
    ["เกาะสามเกาะ", "gàw sǎam gàw", "ba hòn đảo", "three islands"],
    ["'เกาะ' tự làm loại từ; không dùng 'อัน'.", "'เกาะ' is its own classifier; don't use 'อัน'."],
    ["Đếm 2 hòn đảo.", "Count 2 islands.", "เกาะสองเกาะ"]),
];

// ── General-use classifiers (อัน / ชิ้น / ที่ / คู่ / ใบ / ลูก / เครื่อง / ก้อน) ─

const general: ThaiClassifierItem[] = [
  item("thai_clf_gen_thing", "general",
    ["ของ", "khǎawng", "thing / object (generic)", "đồ vật (chung)"],
    ["อัน", "an", "general classifier for small objects", "loại từ chung cho vật nhỏ"],
    ["ของสามอัน", "khǎawng sǎam an", "ba cái (đồ)", "three things"],
    ["Lạm dụng 'อัน' cho mọi thứ — chỉ dùng khi không có loại từ riêng.", "Overusing 'อัน' for everything — use it only when no specific classifier fits."],
    ["Đếm 5 cái (vật nhỏ).", "Count 5 (small) things.", "ของห้าอัน"]),
  item("thai_clf_gen_piece", "general",
    ["เค้ก", "khéek", "cake (a piece of)", "bánh kem (miếng)"],
    ["ชิ้น", "chín", "classifier: piece", "loại từ: miếng/mảnh"],
    ["เค้กสองชิ้น", "khéek sǎawng chín", "hai miếng bánh", "two pieces of cake"],
    ["Dùng 'อัน' cho miếng bánh — phần cắt ra dùng 'ชิ้น'.", "Using 'อัน' for a slice — a cut piece takes 'ชิ้น'."],
    ["Gọi 3 miếng bánh.", "Order 3 pieces of cake.", "เค้กสามชิ้น"]),
  item("thai_clf_gen_serving", "general",
    ["อาหาร", "aa-hǎan", "food (a serving of)", "món ăn (phần)"],
    ["ที่", "thîi", "classifier: serving/portion", "loại từ: phần/suất"],
    ["อาหารสองที่", "aa-hǎan sǎawng thîi", "hai phần ăn", "two servings"],
    ["'ที่' đếm suất ăn (set); 'จาน/ชาม' đếm theo vật chứa.", "'ที่' counts servings/sets; 'จาน/ชาม' count by the dish/bowl."],
    ["Gọi 4 suất ăn.", "Order 4 servings.", "อาหารสี่ที่"]),
  item("thai_clf_gen_pair", "general",
    ["รองเท้า", "raawng-tháo", "shoes", "đôi giày"],
    ["คู่", "khûu", "classifier: pair", "loại từ: đôi/cặp"],
    ["รองเท้าสองคู่", "raawng-tháo sǎawng khûu", "hai đôi giày", "two pairs of shoes"],
    ["Dùng 'อัน' cho giày — đồ đi theo cặp dùng 'คู่'.", "Using 'อัน' for shoes — paired items take 'คู่'."],
    ["Đếm 3 đôi giày.", "Count 3 pairs of shoes.", "รองเท้าสามคู่"]),
  item("thai_clf_gen_pillow", "general",
    ["หมอน", "mǎawn", "pillow", "cái gối"],
    ["ใบ", "bai", "general classifier for container/soft items", "loại từ chung cho đồ chứa/mềm"],
    ["หมอนสามใบ", "mǎawn sǎam bai", "ba cái gối", "three pillows"],
    ["Dùng 'อัน' cho gối — gối/đồ dạng túi dùng 'ใบ'.", "Using 'อัน' for a pillow — pillow-like items take 'ใบ'."],
    ["Đếm 2 cái gối.", "Count 2 pillows.", "หมอนสองใบ"]),
  item("thai_clf_gen_orange", "general",
    ["ส้ม", "sôm", "orange", "quả cam"],
    ["ลูก", "lûuk", "classifier for round objects/fruit", "loại từ cho vật tròn/trái cây"],
    ["ส้มห้าลูก", "sôm hâa lûuk", "năm quả cam", "five oranges"],
    ["Dùng 'อัน' cho trái cây tròn — dùng 'ลูก'.", "Using 'อัน' for round fruit — use 'ลูก'."],
    ["Đếm 6 quả cam.", "Count 6 oranges.", "ส้มหกลูก"]),
  item("thai_clf_gen_computer", "general",
    ["คอมพิวเตอร์", "khaawm-phiu-dtôe", "computer", "máy tính"],
    ["เครื่อง", "khrûeang", "classifier for machines/appliances", "loại từ cho máy móc/thiết bị"],
    ["คอมพิวเตอร์สองเครื่อง", "khaawm-phiu-dtôe sǎawng khrûeang", "hai máy tính", "two computers"],
    ["Dùng 'อัน' cho máy tính — máy móc dùng 'เครื่อง'.", "Using 'อัน' for a computer — machines take 'เครื่อง'."],
    ["Đếm 3 máy tính.", "Count 3 computers.", "คอมพิวเตอร์สามเครื่อง"]),
  item("thai_clf_gen_ice", "general",
    ["น้ำแข็ง", "náam-khǎeng", "ice (a block of)", "đá (cục/tảng)"],
    ["ก้อน", "gâawn", "classifier for lumps/blocks", "loại từ cho cục/tảng"],
    ["น้ำแข็งสองก้อน", "náam-khǎeng sǎawng gâawn", "hai cục đá", "two blocks of ice"],
    ["Dùng 'อัน' cho đá — cục/tảng dùng 'ก้อน'.", "Using 'อัน' for ice — lumps/blocks take 'ก้อน'."],
    ["Đếm 4 cục đá.", "Count 4 blocks of ice.", "น้ำแข็งสี่ก้อน"]),
];

// ── Aggregate export ────────────────────────────────────────────────────────

export const items: ThaiClassifierItem[] = [
  ...people,
  ...animals,
  ...objects,
  ...vehicles,
  ...books,
  ...food,
  ...places,
  ...general,
];

export default items;
