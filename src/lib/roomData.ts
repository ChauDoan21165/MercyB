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
  { id: "addiction", nameVi: "Nghiện", nameEn: "Addiction", hasData: true, tier: "free", dataFile: "addiction.json" },
  { id: "ai", nameVi: "Trí tuệ nhân tạo", nameEn: "AI", hasData: false, tier: "free", dataFile: "AI-2.json" },
  { id: "autoimmune", nameVi: "Bệnh tự miễn", nameEn: "Autoimmune Diseases", hasData: true, tier: "free", dataFile: "autoimmune_diseases-2.json" },
  { id: "burnout", nameVi: "Kiệt sức", nameEn: "Burnout", hasData: true, tier: "free", dataFile: "burnout-2.json" },
  { id: "career-burnout", nameVi: "Kiệt sức nghề nghiệp", nameEn: "Career Burnout", hasData: true, tier: "free", dataFile: "career_burnout.json" },
  { id: "business-negotiation", nameVi: "Đàm phán kinh doanh", nameEn: "Business Negotiation Compass", hasData: true, tier: "vip1", dataFile: "business_negotiation_compass.json" },
  { id: "business-strategy", nameVi: "Chiến lược kinh doanh", nameEn: "Business Strategy", hasData: true, tier: "free", dataFile: "business_strategy-2.json" },
  { id: "cancer-support", nameVi: "Hỗ trợ ung thư", nameEn: "Cancer Support", hasData: true, tier: "free", dataFile: "cancer_support-2.json" },
  { id: "cardiovascular", nameVi: "Tim mạch", nameEn: "Cardiovascular", hasData: true, tier: "free", dataFile: "cardiovascular-2.json" },
  { id: "child-health", nameVi: "Sức khỏe trẻ em", nameEn: "Child Health", hasData: true, tier: "free", dataFile: "child_health-2.json" },
  { id: "cholesterol", nameVi: "Cholesterol", nameEn: "Cholesterol", hasData: true, tier: "free", dataFile: "cholesterol2.json" },
  { id: "chronic-fatigue", nameVi: "Mệt mỏi mãn tính", nameEn: "Chronic Fatigue", hasData: true, tier: "free", dataFile: "chronic_fatigue-2.json" },
  { id: "confidence-building", nameVi: "Xây dựng sự tự tin", nameEn: "Confidence Building", hasData: true, tier: "free", dataFile: "confidence_building.json" },
  { id: "cough", nameVi: "Ho", nameEn: "Cough", hasData: true, tier: "free", dataFile: "cough-2.json" },
  { id: "crypto", nameVi: "Tiền mã hóa", nameEn: "Crypto", hasData: true, tier: "vip1", dataFile: "crypto.json" },
  { id: "depression", nameVi: "Trầm cảm", nameEn: "Depression", hasData: true, tier: "vip1", dataFile: "depression.json" },
  { id: "diabetes", nameVi: "Tiểu đường", nameEn: "Diabetes", hasData: true, tier: "free", dataFile: "diabetes.json" },
  { id: "diabetes-advanced", nameVi: "Tiểu đường nâng cao", nameEn: "Diabetes Advanced", hasData: true, tier: "free", dataFile: "diabetes_advanced.json" },
  { id: "digestive", nameVi: "Hệ tiêu hóa", nameEn: "Digestive System", hasData: true, tier: "free", dataFile: "digestive_system.json" },
  { id: "elderly-care", nameVi: "Chăm sóc người già", nameEn: "Elderly Care", hasData: true, tier: "free", dataFile: "elderly_care.json" },
  { id: "endocrine", nameVi: "Hệ nội tiết", nameEn: "Endocrine System", hasData: true, tier: "free", dataFile: "endocrine_system.json" },
  { id: "exercise-medicine", nameVi: "Y học thể dục", nameEn: "Exercise Medicine", hasData: true, tier: "free", dataFile: "exercise_medicine.json" },
  { id: "fever", nameVi: "Sốt", nameEn: "Fever", hasData: true, tier: "free", dataFile: "fever.json" },
  { id: "finance", nameVi: "Tài chính", nameEn: "Finance", hasData: true, tier: "vip1", dataFile: "finance.json" },
  { id: "financial-planning", nameVi: "Kế hoạch tài chính", nameEn: "Financial Planning 101", hasData: true, tier: "free", dataFile: "financial_planning_101.json" },
  { id: "fitness", nameVi: "Thể dục", nameEn: "Fitness Room", hasData: true, tier: "free", dataFile: "fitness_room.json" },
  { id: "food-nutrition", nameVi: "Thực phẩm & Dinh dưỡng", nameEn: "Food and Nutrition", hasData: true, tier: "vip1", dataFile: "food_and_nutrition.json" },
  { id: "grief", nameVi: "Đau buồn", nameEn: "Grief", hasData: true, tier: "free", dataFile: "grief.json" },
  { id: "gut-brain", nameVi: "Trục ruột-não", nameEn: "Gut–Brain Axis", hasData: true, tier: "free", dataFile: "gut_brain_axis.json" },
  { id: "habit-building", nameVi: "Xây dựng thói quen", nameEn: "Habit Building", hasData: true, tier: "free", dataFile: "habit_building.json" },
  { id: "headache", nameVi: "Đau đầu", nameEn: "Headache", hasData: true, tier: "free", dataFile: "headache.json" },
  { id: "soul-mate", nameVi: "Tìm bạn đời", nameEn: "How to Find Your Soul Mate", hasData: true, tier: "vip2", dataFile: "how_to_find_your_soul_mate_vip1.json" },
  { id: "confidence-building-vip1", nameVi: "Xây dựng sự tự tin VIP1", nameEn: "Confidence Building VIP1", hasData: true, tier: "vip1", dataFile: "confidence_building_vip1.json" },
  { id: "nutrition-basics-vip1", nameVi: "Dinh dưỡng cơ bản VIP1", nameEn: "Nutrition Basics VIP1", hasData: true, tier: "vip1", dataFile: "nutrition_basics_vip1.json" },
  { id: "financial-wellness-vip1", nameVi: "Sức khỏe tài chính VIP1", nameEn: "Financial Wellness VIP1", hasData: true, tier: "vip1", dataFile: "financial_wellness_vip1.json" },
  { id: "sleep-improvement-vip1", nameVi: "Cải thiện giấc ngủ VIP1", nameEn: "Sleep Improvement VIP1", hasData: true, tier: "vip1", dataFile: "sleep_improvement_vip1.json" },
  { id: "husband-dealing", nameVi: "Ứng Xử Với Chồng", nameEn: "Husband Dealing", hasData: true, tier: "vip2", dataFile: "husband_dealing.json" },
  { id: "husband-dealing-vip2", nameVi: "Ứng Xử Với Chồng VIP2", nameEn: "Husband Dealing VIP2", hasData: true, tier: "vip2", dataFile: "husband_dealing_vip2.json" },
  { id: "hypertension", nameVi: "Tăng huyết áp", nameEn: "Hypertension", hasData: true, tier: "free", dataFile: "hypertension.json" },
  { id: "immune-system", nameVi: "Hệ miễn dịch", nameEn: "Immune System", hasData: true, tier: "free", dataFile: "immune_system.json" },
  { id: "immunity-boost", nameVi: "Tăng cường miễn dịch", nameEn: "Immunity Boost", hasData: true, tier: "free", dataFile: "immunity_boost.json" },
  { id: "injury-bleeding", nameVi: "Chấn thương & Chảy máu", nameEn: "Injury and Bleeding", hasData: false, tier: "vip3", dataFile: "injury_and_bleeding.json" },
  { id: "matchmaker", nameVi: "Đặc điểm mai mối", nameEn: "Matchmaker Traits", hasData: true, tier: "free", dataFile: "matchmaker_traits.json" },
  { id: "mens-health", nameVi: "Sức khỏe nam giới", nameEn: "Men's Health", hasData: true, tier: "free", dataFile: "men_health.json" },
  { id: "mental-health", nameVi: "Sức khỏe tâm thần", nameEn: "Mental Health", hasData: false, tier: "vip3", dataFile: "mental_health.json" },
  { id: "mindful-movement", nameVi: "Vận động chánh niệm", nameEn: "Mindful Movement", hasData: true, tier: "free", dataFile: "mindful_movement.json" },
  { id: "mindfulness-healing", nameVi: "Chánh niệm & Chữa lành", nameEn: "Mindfulness and Healing", hasData: true, tier: "free", dataFile: "mindfulness_and_healing.json" },
  { id: "negotiation-mastery", nameVi: "Làm chủ đàm phán", nameEn: "Negotiation Mastery", hasData: true, tier: "free", dataFile: "negotiation_mastery.json" },
  { id: "nutrition-basics", nameVi: "Dinh dưỡng cơ bản", nameEn: "Nutrition Basics", hasData: true, tier: "free", dataFile: "nutrition_basics.json" },
  { id: "obesity", nameVi: "Béo phì", nameEn: "Obesity", hasData: true, tier: "vip2", dataFile: "obesity.json" },
  { id: "obesity-management-vip2", nameVi: "Quản Lý Béo Phì VIP2", nameEn: "Obesity Management VIP2", hasData: true, tier: "vip2", dataFile: "obesity_management_vip2.json" },
  { id: "onboarding-free-users", nameVi: "Hướng dẫn người dùng miễn phí", nameEn: "Getting Started (Free Users)", hasData: true, tier: "free", dataFile: "onboarding_free_users.json" },
  { id: "office-survival", nameVi: "Sống còn văn phòng", nameEn: "Office Survival", hasData: true, tier: "free", dataFile: "office_survival.json" },
  { id: "pain-management", nameVi: "Quản lý đau", nameEn: "Pain Management", hasData: true, tier: "free", dataFile: "pain_management.json" },
  { id: "parenting-toddlers", nameVi: "Nuôi dạy trẻ mới biết đi", nameEn: "Parenting Toddlers", hasData: true, tier: "free", dataFile: "parenting_toddlers.json" },
  { id: "phobia", nameVi: "Ám ảnh sợ hãi", nameEn: "Phobia", hasData: true, tier: "free", dataFile: "phobia.json" },
  { id: "rare-diseases", nameVi: "Bệnh hiếm", nameEn: "Rare Diseases", hasData: true, tier: "free", dataFile: "rare_diseases.json" },
  { id: "renal-health", nameVi: "Sức khỏe thận", nameEn: "Renal Health", hasData: true, tier: "free", dataFile: "renal_health.json" },
  { id: "relationship-conflicts", nameVi: "Xung đột trong mối quan hệ", nameEn: "Relationship Conflicts", hasData: true, tier: "free", dataFile: "relationship_conflicts.json" },
  { id: "reproductive", nameVi: "Sức khỏe sinh sản", nameEn: "Reproductive Health", hasData: true, tier: "free", dataFile: "reproductive_health.json" },
  { id: "respiratory", nameVi: "Hệ hô hấp", nameEn: "Respiratory System", hasData: true, tier: "free", dataFile: "respiratory_system.json" },
  { id: "screening", nameVi: "Sàng lọc & Phòng ngừa", nameEn: "Screening and Prevention", hasData: true, tier: "free", dataFile: "screening_and_prevention.json" },
  { id: "sexuality", nameVi: "Tình dục & Thân mật", nameEn: "Sexuality and Intimacy", hasData: true, tier: "vip2", dataFile: "sexuality_and_intimacy.json" },
  { id: "sexuality-intimacy-vip2", nameVi: "Tình Dục & Thân Mật VIP2", nameEn: "Sexuality & Intimacy VIP2", hasData: true, tier: "vip2", dataFile: "sexuality_intimacy_vip2.json" },
  { id: "skin-health", nameVi: "Sức khỏe da", nameEn: "Skin Health", hasData: true, tier: "free", dataFile: "skin_health.json" },
  { id: "sleep-health", nameVi: "Sức khỏe giấc ngủ", nameEn: "Sleep Health", hasData: true, tier: "free", dataFile: "sleep_health.json" },
  { id: "social-connection", nameVi: "Kết nối xã hội", nameEn: "Social Connection", hasData: true, tier: "free", dataFile: "social_connection.json" },
  { id: "speaking-crowd", nameVi: "Nói trước đám đông", nameEn: "Speaking Crowd", hasData: true, tier: "free", dataFile: "speaking_crowd.json" },
  { id: "stoicism", nameVi: "Chủ nghĩa khắc kỷ", nameEn: "Stoicism", hasData: true, tier: "free", dataFile: "stoicism.json" },
  { id: "stoicism-free", nameVi: "Triết Học Stoic", nameEn: "Stoic Philosophy", hasData: true, tier: "free", dataFile: "stoicism_free.json" },
  { id: "stress-anxiety", nameVi: "Căng thẳng & Lo âu", nameEn: "Stress and Anxiety", hasData: true, tier: "free", dataFile: "stress_and_anxiety.json" },
  { id: "anxiety-toolkit", nameVi: "Bộ công cụ lo âu", nameEn: "Anxiety Toolkit", hasData: true, tier: "free", dataFile: "anxiety_toolkit.json" },
  { id: "teen", nameVi: "Tuổi thiếu niên", nameEn: "Teen", hasData: false, tier: "vip3", dataFile: "teen.json" },
  { id: "toddler", nameVi: "Trẻ mới biết đi", nameEn: "Toddler", hasData: false, tier: "vip3", dataFile: "toddler.json" },
  { id: "train-brain", nameVi: "Luyện trí nhớ", nameEn: "Train Brain Memory", hasData: true, tier: "free", dataFile: "train_brain_memory.json" },
  { id: "trauma", nameVi: "Chấn thương tâm lý", nameEn: "Trauma", hasData: false, tier: "vip3", dataFile: "trauma.json" },
  { id: "user-profile-dashboard", nameVi: "Hồ Sơ & Bảng Điều Khiển", nameEn: "User Profile & Dashboard", hasData: true, tier: "free", dataFile: "user_profile_dashboard.json" },
  { id: "weight-loss", nameVi: "Giảm cân", nameEn: "Weight Loss Program", hasData: true, tier: "free", dataFile: "weight_loss_program.json" },
  { id: "wife-dealing", nameVi: "Ứng Xử Với Vợ", nameEn: "Wife Dealing", hasData: true, tier: "vip2", dataFile: "wife_dealing.json" },
  { id: "wife-dealing-vip2", nameVi: "Ứng Xử Với Vợ VIP2", nameEn: "Wife Dealing VIP2", hasData: true, tier: "vip2", dataFile: "wife_dealing_vip2.json" },
  { id: "womens-health", nameVi: "Sức khỏe phụ nữ", nameEn: "Women's Health", hasData: true, tier: "free", dataFile: "women_health.json" },
  { id: "keep-soul-calm", nameVi: "Giữ Bình An Nội Tâm VIP3", nameEn: "Keep Soul Calm VIP3", hasData: true, tier: "vip3", dataFile: "keep_soul_calm_vip3.json" },
  { id: "sharpen-mind", nameVi: "Mài Sắc Trí Tuệ VIP3", nameEn: "Sharpen Mind VIP3", hasData: true, tier: "vip3", dataFile: "sharpen_mind_vip3.json" },
  { id: "overcome-storm", nameVi: "Vượt Qua Bão Tố VIP3", nameEn: "Overcome Storm VIP3", hasData: true, tier: "vip3", dataFile: "overcome_storm_vip3.json" },
  { id: "unlock-shadow", nameVi: "Mở Khóa Bóng Tối VIP3", nameEn: "Unlock Shadow VIP3", hasData: true, tier: "vip3", dataFile: "unlock_shadow_vip3.json" },
  { id: "human-rights", nameVi: "Quyền Con Người VIP3", nameEn: "Human Rights VIP3", hasData: true, tier: "vip3", dataFile: "human_rights_vip3.json" },
  { id: "philosophy", nameVi: "Triết học cho đời thường", nameEn: "Philosophy for Everyday", hasData: true, tier: "free", dataFile: "philosophy.json" },
  { id: "finding-gods-peace", nameVi: "Tìm Bình An Trong Chúa", nameEn: "Finding God's Peace", hasData: true, tier: "free", dataFile: "finding_gods_peace_free.json" },
  { id: "gods-guidance", nameVi: "Sự Dẫn Dắt Của Chúa VIP1", nameEn: "God's Guidance VIP1", hasData: true, tier: "vip1", dataFile: "gods_guidance_vip1.json" },
  { id: "gods-strength", nameVi: "Sức Mạnh Của Chúa VIP2", nameEn: "God's Strength VIP2", hasData: true, tier: "vip2", dataFile: "gods_strength_vip2_resilience.json" },
  { id: "gods-purpose", nameVi: "Mục Đích Của Chúa VIP3", nameEn: "God's Purpose VIP3", hasData: true, tier: "vip3", dataFile: "gods_purpose_vip3.json" },
  { id: "proverbs-wisdom-vip1", nameVi: "Tục Ngữ Trí Tuệ VIP1", nameEn: "Proverbs Wisdom VIP1", hasData: true, tier: "vip1", dataFile: "proverbs_wisdom_VIP1.json" },
  { id: "philosophy-of-everyday-free", nameVi: "Triết Học Đời Thường", nameEn: "Philosophy of Everyday", hasData: true, tier: "free", dataFile: "philosophy_of_everyday_free.json" },
  { id: "philosophy-of-everyday-vip1", nameVi: "Triết Học Đời Thường VIP1", nameEn: "Philosophy of Everyday VIP1", hasData: true, tier: "vip1", dataFile: "philosophy_of_everyday_vip1.json" },
  { id: "philosophy-of-everyday-vip2", nameVi: "Triết Học Đời Thường VIP2", nameEn: "Philosophy of Everyday VIP2", hasData: true, tier: "vip2", dataFile: "philosophy_of_everyday_vip2.json" },
  { id: "philosophy-of-everyday-vip3", nameVi: "Triết Học Đời Thường VIP3", nameEn: "Philosophy of Everyday VIP3", hasData: true, tier: "vip3", dataFile: "philosophy_of_everyday_vip3.json" }
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
