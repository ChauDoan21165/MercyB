import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorCategory {
  id: string;
  hex: string;
  label_en: string;
  label_vi: string;
  description_en: string;
  description_vi: string;
}

const categories: ColorCategory[] = [
  {
    id: "calm_grounded",
    hex: "#9CC7E8",
    label_en: "Calm & Grounded",
    label_vi: "Bình An & Vững Chãi",
    description_en: "Words expressing peace, stability, and gentle presence",
    description_vi: "Từ ngữ thể hiện sự bình yên, ổn định và sự hiện diện nhẹ nhàng"
  },
  {
    id: "warm_connection",
    hex: "#F4C4A6",
    label_en: "Warmth & Connection",
    label_vi: "Ấm Áp & Kết Nối",
    description_en: "Words expressing kindness, love, and human connection",
    description_vi: "Từ ngữ thể hiện lòng tốt, tình yêu và sự kết nối con người"
  },
  {
    id: "power_motivation",
    hex: "#E9893A",
    label_en: "Power & Motivation",
    label_vi: "Sức Mạnh & Động Lực",
    description_en: "Words expressing strength, courage, and determined action",
    description_vi: "Từ ngữ thể hiện sức mạnh, can đảm và hành động quyết tâm"
  },
  {
    id: "healing_clarity",
    hex: "#6CC7C0",
    label_en: "Healing & Clarity",
    label_vi: "Chữa Lành & Sáng Rõ",
    description_en: "Words expressing awareness, insight, and personal growth",
    description_vi: "Từ ngữ thể hiện nhận thức, sự thấu hiểu và phát triển bản thân"
  }
];

interface ColorLegendProps {
  showVietnamese?: boolean;
  compact?: boolean;
}

export const ColorLegend = ({ showVietnamese = true, compact = false }: ColorLegendProps) => {
  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Info className="h-3.5 w-3.5" />
            <span>Color Guide</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm mb-2">Word Color Categories</h4>
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded flex-shrink-0" 
                      style={{ backgroundColor: category.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{category.label_en}</p>
                      {showVietnamese && (
                        <p className="text-xs text-muted-foreground">{category.label_vi}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    {showVietnamese ? category.description_vi : category.description_en}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-border/50 space-y-2">
              <h4 className="font-medium text-sm">
                {showVietnamese ? "Cường Độ Động Từ" : "Verb Intensity"}
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: '#E9893A', opacity: 0.5 }}
                  >
                    light
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {showVietnamese ? "Nhẹ nhàng" : "Gentle action"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: '#E9893A', opacity: 0.75 }}
                  >
                    medium
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {showVietnamese ? "Vừa phải" : "Moderate action"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: '#E9893A', opacity: 1 }}
                  >
                    strong
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {showVietnamese ? "Mạnh mẽ" : "Powerful action"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Word Color Categories</h3>
      </div>
      <div className="grid gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-start gap-3">
            <div 
              className="w-6 h-6 rounded flex-shrink-0 mt-0.5" 
              style={{ backgroundColor: category.hex }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{category.label_en}</span>
                {showVietnamese && (
                  <span className="text-xs text-muted-foreground">{category.label_vi}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {showVietnamese ? category.description_vi : category.description_en}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-muted-foreground" />
          {showVietnamese ? "Cường Độ Động Từ" : "Verb Intensity"}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded text-xs"
              style={{ backgroundColor: '#E9893A', opacity: 0.5 }}
            >
              light
            </span>
            <span className="text-xs text-muted-foreground">
              {showVietnamese ? "Nhẹ nhàng - hành động dịu dàng" : "Gentle action"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded text-xs"
              style={{ backgroundColor: '#E9893A', opacity: 0.75 }}
            >
              medium
            </span>
            <span className="text-xs text-muted-foreground">
              {showVietnamese ? "Vừa phải - hành động trung bình" : "Moderate action"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded text-xs font-semibold"
              style={{ backgroundColor: '#E9893A', opacity: 1 }}
            >
              strong
            </span>
            <span className="text-xs text-muted-foreground">
              {showVietnamese ? "Mạnh mẽ - hành động quyết liệt" : "Powerful action"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
