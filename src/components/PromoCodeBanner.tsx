import { Gift } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const PromoCodeBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">Have a promo code?</h3>
            <p className="text-sm text-muted-foreground">Unlock additional questions per day</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate("/promo-code")}
          variant="default"
        >
          Redeem
        </Button>
      </div>
    </div>
  );
};
