import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RoomGrid = () => {
  const navigate = useNavigate();

  const rooms = [
    { id: "ai", nameVi: "Trí tuệ nhân tạo", nameEn: "AI", hasData: true, tier: "free" },
    { id: "autoimmune", nameVi: "Bệnh tự miễn", nameEn: "Autoimmune Diseases", hasData: true, tier: "free" },
    { id: "burnout", nameVi: "Kiệt sức", nameEn: "Burnout", hasData: true, tier: "vip1" },
    { id: "business-strategy", nameVi: "Chiến lược kinh doanh", nameEn: "Business Strategy", hasData: true, tier: "vip2" },
    { id: "cancer-support", nameVi: "Hỗ trợ ung thư", nameEn: "Cancer Support", hasData: true, tier: "vip1" },
    { id: "cardiovascular", nameVi: "Tim mạch", nameEn: "Cardiovascular", hasData: true, tier: "free" },
    { id: "child-health", nameVi: "Sức khỏe trẻ em", nameEn: "Child Health", hasData: true, tier: "free" },
    { id: "cholesterol", nameVi: "Cholesterol", nameEn: "Cholesterol", hasData: true, tier: "free" },
    { id: "chronic-fatigue", nameVi: "Mệt mỏi mãn tính", nameEn: "Chronic Fatigue", hasData: true, tier: "vip1" },
    { id: "cough", nameVi: "Ho", nameEn: "Cough", hasData: true, tier: "free" },
    { id: "abdominal-pain", nameVi: "Đau bụng", nameEn: "Abdominal Pain", hasData: false, tier: "free" },
    { id: "addiction", nameVi: "Nghiện", nameEn: "Addiction", hasData: false, tier: "vip2" },
    { id: "business-negotiation", nameVi: "Đàm phán kinh doanh", nameEn: "Business Negotiation Compass", hasData: false, tier: "vip3" },
    { id: "depression", nameVi: "Trầm cảm", nameEn: "Depression", hasData: false, tier: "vip1" },
    { id: "diabetes", nameVi: "Tiểu đường", nameEn: "Diabetes", hasData: false, tier: "free" },
    { id: "digestive", nameVi: "Hệ tiêu hóa", nameEn: "Digestive System", hasData: false, tier: "free" },
    { id: "elderly-care", nameVi: "Chăm sóc người già", nameEn: "Elderly Care", hasData: false, tier: "free" },
    { id: "endocrine", nameVi: "Hệ nội tiết", nameEn: "Endocrine System", hasData: false, tier: "vip1" },
    { id: "exercise-medicine", nameVi: "Y học thể dục", nameEn: "Exercise Medicine", hasData: false, tier: "free" },
    { id: "fever", nameVi: "Sốt", nameEn: "Fever", hasData: false, tier: "free" },
    { id: "finance", nameVi: "Tài chính", nameEn: "Finance", hasData: false, tier: "vip2" },
    { id: "fitness", nameVi: "Thể dục", nameEn: "Fitness Room", hasData: false, tier: "free" },
    { id: "food-nutrition", nameVi: "Thực phẩm & Dinh dưỡng", nameEn: "Food and Nutrition", hasData: false, tier: "free" },
    { id: "grief", nameVi: "Đau buồn", nameEn: "Grief", hasData: false, tier: "vip1" },
    { id: "gut-brain", nameVi: "Trục ruột-não", nameEn: "Gut–Brain Axis", hasData: false, tier: "vip2" },
    { id: "headache", nameVi: "Đau đầu", nameEn: "Headache", hasData: false, tier: "free" },
    { id: "soul-mate", nameVi: "Tìm bạn đời", nameEn: "How to Find Your Soul Mate", hasData: false, tier: "vip3" },
    { id: "husband-dealing", nameVi: "Quan hệ chồng", nameEn: "Husband Dealing", hasData: false, tier: "vip3" },
    { id: "hypertension", nameVi: "Tăng huyết áp", nameEn: "Hypertension", hasData: false, tier: "free" },
    { id: "immune-system", nameVi: "Hệ miễn dịch", nameEn: "Immune System", hasData: false, tier: "free" },
    { id: "immunity-boost", nameVi: "Tăng cường miễn dịch", nameEn: "Immunity Boost", hasData: false, tier: "free" },
    { id: "injury-bleeding", nameVi: "Chấn thương & Chảy máu", nameEn: "Injury and Bleeding", hasData: false, tier: "free" },
    { id: "matchmaker", nameVi: "Đặc điểm mai mối", nameEn: "Matchmaker Traits", hasData: false, tier: "vip3" },
    { id: "mens-health", nameVi: "Sức khỏe nam giới", nameEn: "Men's Health", hasData: false, tier: "free" },
    { id: "mental-health", nameVi: "Sức khỏe tâm thần", nameEn: "Mental Health", hasData: false, tier: "vip1" },
    { id: "mindful-movement", nameVi: "Vận động chánh niệm", nameEn: "Mindful Movement", hasData: false, tier: "vip1" },
    { id: "mindfulness-healing", nameVi: "Chánh niệm & Chữa lành", nameEn: "Mindfulness and Healing", hasData: false, tier: "vip1" },
    { id: "nutrition-basics", nameVi: "Dinh dưỡng cơ bản", nameEn: "Nutrition Basics", hasData: false, tier: "free" },
    { id: "obesity", nameVi: "Béo phì", nameEn: "Obesity", hasData: false, tier: "free" },
    { id: "office-survival", nameVi: "Sống còn văn phòng", nameEn: "Office Survival", hasData: false, tier: "vip2" },
    { id: "pain-management", nameVi: "Quản lý đau", nameEn: "Pain Management", hasData: false, tier: "vip1" },
    { id: "philosophy", nameVi: "Triết học hàng ngày", nameEn: "Philosophy for Everyday", hasData: false, tier: "vip2" },
    { id: "phobia", nameVi: "Ám ảnh sợ hãi", nameEn: "Phobia", hasData: false, tier: "vip1" },
    { id: "rare-diseases", nameVi: "Bệnh hiếm", nameEn: "Rare Diseases", hasData: false, tier: "vip2" },
    { id: "renal-health", nameVi: "Sức khỏe thận", nameEn: "Renal Health", hasData: false, tier: "vip1" },
    { id: "reproductive", nameVi: "Sức khỏe sinh sản", nameEn: "Reproductive Health", hasData: false, tier: "free" },
    { id: "respiratory", nameVi: "Hệ hô hấp", nameEn: "Respiratory System", hasData: false, tier: "free" },
    { id: "screening", nameVi: "Sàng lọc & Phòng ngừa", nameEn: "Screening and Prevention", hasData: false, tier: "free" },
    { id: "sexuality", nameVi: "Tình dục & Thân mật", nameEn: "Sexuality and Intimacy", hasData: false, tier: "vip3" },
    { id: "skin-health", nameVi: "Sức khỏe da", nameEn: "Skin Health", hasData: false, tier: "free" },
    { id: "sleep-health", nameVi: "Sức khỏe giấc ngủ", nameEn: "Sleep Health", hasData: false, tier: "free" },
    { id: "social-connection", nameVi: "Kết nối xã hội", nameEn: "Social Connection", hasData: false, tier: "vip1" },
    { id: "speaking-crowd", nameVi: "Nói trước đám đông", nameEn: "Speaking Crowd", hasData: false, tier: "vip2" },
    { id: "stoicism", nameVi: "Chủ nghĩa khắc kỷ", nameEn: "Stoicism", hasData: false, tier: "vip2" },
    { id: "stress-anxiety", nameVi: "Căng thẳng & Lo âu", nameEn: "Stress and Anxiety", hasData: false, tier: "vip1" },
    { id: "teen", nameVi: "Tuổi thiếu niên", nameEn: "Teen", hasData: false, tier: "free" },
    { id: "toddler", nameVi: "Trẻ mới biết đi", nameEn: "Toddler", hasData: false, tier: "free" },
    { id: "train-brain", nameVi: "Luyện trí nhớ", nameEn: "Train Brain Memory", hasData: false, tier: "vip2" },
    { id: "trauma", nameVi: "Chấn thương tâm lý", nameEn: "Trauma", hasData: false, tier: "vip2" },
    { id: "wife-dealing", nameVi: "Quan hệ vợ", nameEn: "Wife Dealing", hasData: false, tier: "vip3" },
    { id: "womens-health", nameVi: "Sức khỏe phụ nữ", nameEn: "Women's Health", hasData: false, tier: "free" }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free": return "bg-primary/10 text-primary border-primary/20";
      case "vip1": return "bg-secondary/10 text-secondary border-secondary/20";
      case "vip2": return "bg-accent/10 text-accent border-accent/20";
      case "vip3": return "bg-gradient-to-r from-accent to-primary text-white border-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTierLabel = (tier: string) => {
    return tier.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Quay lại / Back
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Chọn phòng học
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose Your Learning Room
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="outline" className={getTierColor("free")}>
              FREE
            </Badge>
            <Badge variant="outline" className={getTierColor("vip1")}>
              VIP1
            </Badge>
            <Badge variant="outline" className={getTierColor("vip2")}>
              VIP2
            </Badge>
            <Badge variant="outline" className={getTierColor("vip3")}>
              VIP3
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Sẵn sàng / Ready
            </Badge>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`relative p-3 transition-all duration-300 cursor-pointer group ${
                room.hasData 
                  ? "hover:scale-110 hover:shadow-hover hover:z-10" 
                  : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => room.hasData && navigate(`/chat/${room.id}`)}
            >
              {/* Status Badge */}
              <div className="absolute -top-2 -right-2 z-10">
                {room.hasData ? (
                  <div className="bg-green-500 rounded-full p-1">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="bg-gray-400 rounded-full p-1">
                    <Lock className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {/* Tier Badge */}
                <Badge 
                  variant="outline" 
                  className={`text-[10px] px-1.5 py-0 ${getTierColor(room.tier)}`}
                >
                  {getTierLabel(room.tier)}
                </Badge>

                {/* Room Names */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
                    {room.nameVi}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                    {room.nameEn}
                  </p>
                </div>
              </div>

              {/* Hover Effect */}
              {room.hasData && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              )}
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-sm text-muted-foreground">
            Các phòng có ✓ đã sẵn sàng để học
          </p>
          <p className="text-xs text-muted-foreground">
            Rooms with ✓ are ready for learning
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;
