// Room Data Management Utilities
// This file provides helper functions for working with room data

export interface RoomInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  hasData: boolean;
  tier: 'free' | 'vip1' | 'vip2' | 'vip3';
  dataFile?: string;
}

// Complete list of all rooms in the app
export const ALL_ROOMS: RoomInfo[] = [
  { id: "abdominal-pain", nameVi: "Đau bụng", nameEn: "Abdominal Pain", hasData: true, tier: "free", dataFile: "abdominal_pain.json" },
  { id: "addiction", nameVi: "Nghiện", nameEn: "Addiction", hasData: true, tier: "vip2", dataFile: "addiction.json" },
  { id: "ai", nameVi: "Trí tuệ nhân tạo", nameEn: "AI", hasData: true, tier: "free", dataFile: "AI-2.json" },
  { id: "autoimmune", nameVi: "Bệnh tự miễn", nameEn: "Autoimmune Diseases", hasData: true, tier: "free", dataFile: "autoimmune_diseases-2.json" },
  { id: "burnout", nameVi: "Kiệt sức", nameEn: "Burnout", hasData: true, tier: "vip1", dataFile: "burnout-2.json" },
  { id: "business-negotiation", nameVi: "Đàm phán kinh doanh", nameEn: "Business Negotiation Compass", hasData: true, tier: "vip3", dataFile: "business_negotiation_compass.json" },
  { id: "business-strategy", nameVi: "Chiến lược kinh doanh", nameEn: "Business Strategy", hasData: true, tier: "vip2", dataFile: "business_strategy-2.json" },
  { id: "cancer-support", nameVi: "Hỗ trợ ung thư", nameEn: "Cancer Support", hasData: true, tier: "vip1", dataFile: "cancer_support-2.json" },
  { id: "cardiovascular", nameVi: "Tim mạch", nameEn: "Cardiovascular", hasData: true, tier: "free", dataFile: "cardiovascular-2.json" },
  { id: "child-health", nameVi: "Sức khỏe trẻ em", nameEn: "Child Health", hasData: true, tier: "free", dataFile: "child_health-2.json" },
  { id: "cholesterol", nameVi: "Cholesterol", nameEn: "Cholesterol", hasData: true, tier: "free", dataFile: "cholesterol2.json" },
  { id: "chronic-fatigue", nameVi: "Mệt mỏi mãn tính", nameEn: "Chronic Fatigue", hasData: true, tier: "vip1", dataFile: "chronic_fatigue-2.json" },
  { id: "cough", nameVi: "Ho", nameEn: "Cough", hasData: true, tier: "free", dataFile: "cough-2.json" },
  { id: "crypto", nameVi: "Tiền mã hóa", nameEn: "Crypto", hasData: true, tier: "vip2", dataFile: "crypto.json" },
  { id: "depression", nameVi: "Trầm cảm", nameEn: "Depression", hasData: true, tier: "vip1", dataFile: "depression.json" },
  { id: "diabetes", nameVi: "Tiểu đường", nameEn: "Diabetes", hasData: true, tier: "free", dataFile: "diabetes.json" },
  { id: "digestive", nameVi: "Hệ tiêu hóa", nameEn: "Digestive System", hasData: true, tier: "free", dataFile: "digestive_system.json" },
  { id: "elderly-care", nameVi: "Chăm sóc người già", nameEn: "Elderly Care", hasData: true, tier: "free", dataFile: "elderly_care.json" },
  { id: "endocrine", nameVi: "Hệ nội tiết", nameEn: "Endocrine System", hasData: true, tier: "vip1", dataFile: "endocrine_system.json" },
  { id: "exercise-medicine", nameVi: "Y học thể dục", nameEn: "Exercise Medicine", hasData: true, tier: "free", dataFile: "exercise_medicine.json" },
  { id: "fever", nameVi: "Sốt", nameEn: "Fever", hasData: true, tier: "free", dataFile: "fever.json" },
  { id: "finance", nameVi: "Tài chính", nameEn: "Finance", hasData: true, tier: "vip2", dataFile: "finance.json" },
  { id: "fitness", nameVi: "Thể dục", nameEn: "Fitness Room", hasData: true, tier: "free", dataFile: "fitness_room.json" },
  { id: "food-nutrition", nameVi: "Thực phẩm & Dinh dưỡng", nameEn: "Food and Nutrition", hasData: true, tier: "free", dataFile: "food_and_nutrition.json" },
  { id: "grief", nameVi: "Đau buồn", nameEn: "Grief", hasData: true, tier: "vip1", dataFile: "grief.json" },
  { id: "gut-brain", nameVi: "Trục ruột-não", nameEn: "Gut–Brain Axis", hasData: true, tier: "vip2", dataFile: "gut_brain_axis.json" },
  { id: "headache", nameVi: "Đau đầu", nameEn: "Headache", hasData: true, tier: "free", dataFile: "headache.json" },
  { id: "soul-mate", nameVi: "Tìm bạn đời", nameEn: "How to Find Your Soul Mate", hasData: true, tier: "vip3", dataFile: "how_to_find_your_soul_mate.json" },
  { id: "husband-dealing", nameVi: "Quan hệ chồng", nameEn: "Husband Dealing", hasData: true, tier: "vip3", dataFile: "husband_dealing.json" },
  { id: "hypertension", nameVi: "Tăng huyết áp", nameEn: "Hypertension", hasData: true, tier: "free", dataFile: "hypertension.json" },
  { id: "immune-system", nameVi: "Hệ miễn dịch", nameEn: "Immune System", hasData: true, tier: "free", dataFile: "immune_system.json" },
  { id: "immunity-boost", nameVi: "Tăng cường miễn dịch", nameEn: "Immunity Boost", hasData: true, tier: "free", dataFile: "immunity_boost.json" },
  { id: "injury-bleeding", nameVi: "Chấn thương & Chảy máu", nameEn: "Injury and Bleeding", hasData: true, tier: "free", dataFile: "injury_and_bleeding.json" },
  { id: "matchmaker", nameVi: "Đặc điểm mai mối", nameEn: "Matchmaker Traits", hasData: true, tier: "vip3", dataFile: "matchmaker_traits.json" },
  { id: "mens-health", nameVi: "Sức khỏe nam giới", nameEn: "Men's Health", hasData: true, tier: "free", dataFile: "men_health.json" },
  { id: "mental-health", nameVi: "Sức khỏe tâm thần", nameEn: "Mental Health", hasData: true, tier: "vip1", dataFile: "mental_health.json" },
  { id: "mindful-movement", nameVi: "Vận động chánh niệm", nameEn: "Mindful Movement", hasData: true, tier: "vip1", dataFile: "mindful_movement.json" },
  { id: "mindfulness-healing", nameVi: "Chánh niệm & Chữa lành", nameEn: "Mindfulness and Healing", hasData: true, tier: "vip1", dataFile: "mindfulness_and_healing.json" },
  { id: "nutrition-basics", nameVi: "Dinh dưỡng cơ bản", nameEn: "Nutrition Basics", hasData: true, tier: "free", dataFile: "nutrition_basics.json" },
  { id: "obesity", nameVi: "Béo phì", nameEn: "Obesity", hasData: true, tier: "free", dataFile: "obesity.json" },
  { id: "office-survival", nameVi: "Sống còn văn phòng", nameEn: "Office Survival", hasData: true, tier: "vip2", dataFile: "office_survival.json" },
  { id: "pain-management", nameVi: "Quản lý đau", nameEn: "Pain Management", hasData: true, tier: "vip1", dataFile: "pain_management.json" },
  { id: "phobia", nameVi: "Ám ảnh sợ hãi", nameEn: "Phobia", hasData: true, tier: "vip1", dataFile: "phobia.json" },
  { id: "rare-diseases", nameVi: "Bệnh hiếm", nameEn: "Rare Diseases", hasData: true, tier: "vip2", dataFile: "rare_diseases.json" },
  { id: "renal-health", nameVi: "Sức khỏe thận", nameEn: "Renal Health", hasData: true, tier: "vip1", dataFile: "renal_health.json" },
  { id: "reproductive", nameVi: "Sức khỏe sinh sản", nameEn: "Reproductive Health", hasData: true, tier: "free", dataFile: "reproductive_health.json" },
  { id: "respiratory", nameVi: "Hệ hô hấp", nameEn: "Respiratory System", hasData: true, tier: "free", dataFile: "respiratory_system.json" },
  { id: "screening", nameVi: "Sàng lọc & Phòng ngừa", nameEn: "Screening and Prevention", hasData: true, tier: "free", dataFile: "screening_and_prevention.json" },
  { id: "sexuality", nameVi: "Tình dục & Thân mật", nameEn: "Sexuality and Intimacy", hasData: true, tier: "vip3", dataFile: "sexuality_and_intimacy.json" },
  { id: "skin-health", nameVi: "Sức khỏe da", nameEn: "Skin Health", hasData: true, tier: "free", dataFile: "skin_health.json" },
  { id: "sleep-health", nameVi: "Sức khỏe giấc ngủ", nameEn: "Sleep Health", hasData: true, tier: "free", dataFile: "sleep_health.json" },
  { id: "social-connection", nameVi: "Kết nối xã hội", nameEn: "Social Connection", hasData: true, tier: "vip1", dataFile: "social_connection.json" },
  { id: "speaking-crowd", nameVi: "Nói trước đám đông", nameEn: "Speaking Crowd", hasData: true, tier: "vip2", dataFile: "speaking_crowd.json" },
  { id: "stoicism", nameVi: "Chủ nghĩa khắc kỷ", nameEn: "Stoicism", hasData: true, tier: "vip2", dataFile: "stoicism.json" },
  { id: "stress-anxiety", nameVi: "Căng thẳng & Lo âu", nameEn: "Stress and Anxiety", hasData: true, tier: "vip1", dataFile: "stress_and_anxiety.json" },
  { id: "teen", nameVi: "Tuổi thiếu niên", nameEn: "Teen", hasData: true, tier: "free", dataFile: "teen.json" },
  { id: "toddler", nameVi: "Trẻ mới biết đi", nameEn: "Toddler", hasData: true, tier: "free", dataFile: "toddler.json" },
  { id: "train-brain", nameVi: "Luyện trí nhớ", nameEn: "Train Brain Memory", hasData: true, tier: "vip2", dataFile: "train_brain_memory.json" },
  { id: "trauma", nameVi: "Chấn thương tâm lý", nameEn: "Trauma", hasData: true, tier: "vip2", dataFile: "trauma.json" },
  { id: "wife-dealing", nameVi: "Quan hệ vợ", nameEn: "Wife Dealing", hasData: true, tier: "vip3", dataFile: "wife_dealing.json" },
  { id: "womens-health", nameVi: "Sức khỏe phụ nữ", nameEn: "Women's Health", hasData: true, tier: "free", dataFile: "women_health.json" }
];

// Get room info by ID
export function getRoomInfo(roomId: string): RoomInfo | null {
  return ALL_ROOMS.find(room => room.id === roomId) || null;
}

// Get all rooms with data
export function getRoomsWithData(): RoomInfo[] {
  return ALL_ROOMS.filter(room => room.hasData);
}

// Get rooms by tier
export function getRoomsByTier(tier: RoomInfo['tier']): RoomInfo[] {
  return ALL_ROOMS.filter(room => room.tier === tier);
}

/**
 * Room Data Structure (from JSON files):
 * 
 * Each room JSON contains:
 * - schema_version: Version of the data schema
 * - schema_id: Unique identifier for the room
 * - description: { en, vi } - Room descriptions in both languages
 * - supported_languages: Array of language codes
 * - keywords: Object mapping keyword groups to {en, vi} arrays
 * - entries: Array of consultation entries with:
 *   - artifact_id: Unique ID for the entry
 *   - title: { en, vi }
 *   - content: { en, vi }
 *   - keywords: Related keywords
 *   - tags: Categories
 * - crisis_footer: { en, vi } - Emergency contact info
 * - safety_disclaimer: { en, vi } - Medical disclaimer
 * - room_essay: { en, vi } - Comprehensive room overview
 * 
 * The AI uses this structured data to provide contextual,
 * bilingual responses that are educational and safe.
 */
