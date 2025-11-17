import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UnauthenticatedBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Sign Up to Start Your Journey
          </h3>
          <p className="text-sm text-muted-foreground">
            You're viewing this room as a guest. Create a free account to interact with the content, 
            track your progress, and unlock personalized features.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Bạn đang xem phòng này với tư cách khách. Tạo tài khoản miễn phí để tương tác với nội dung, 
            theo dõi tiến trình và mở khóa các tính năng cá nhân hóa.
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Sign Up Free
          </Button>
        </div>
      </div>
    </Card>
  );
};
