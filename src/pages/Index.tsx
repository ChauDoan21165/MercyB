import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.title = "Mercy Blade — Holistic Growth";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute("content", "Mercy Blade: compassionate guidance for holistic growth—body, mind, relationships, finances, and inner self.");
    }
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Mercy Blade
        </h1>

        <Card className="p-8 mb-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">English</h2>
              <Button
                onClick={toggleAudio}
                size="lg"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Volume2 size={20} />
                {isPlaying ? "Pause Audio" : "Play Audio"}
              </Button>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Mercy Blade is your compassionate companion on the path of holistic growth — embracing body, mind, relationships, finances, and the unfolding of your inner self.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              It offers concise, evidence-based, and gently practical guidance to help you recover from burnout, rebuild healthy habits, manage chronic conditions, and cultivate confidence and calm.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground mb-4">
              Whether you seek to ease stress, strengthen your health, or deepen self-understanding, Mercy Blade walks beside you — in a space of empathy, encouragement, and non-judgment.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              And as your journey unfolds, Mercy Blade may even help you find the learning companion — or soulmate — who truly resonates with you.
            </p>
          </div>
          <audio ref={audioRef} src="/Mercy_Blade.mp3" onEnded={() => setIsPlaying(false)} />
        </Card>

        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Tiếng Việt</h2>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            Mercy Blade là người bạn đồng hành đầy thấu cảm trên hành trình phát triển toàn diện — nuôi dưỡng cơ thể, tâm trí, các mối quan hệ, tài chính và thế giới nội tâm của bạn.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            Ứng dụng mang đến những hướng dẫn ngắn gọn, dựa trên bằng chứng và dễ áp dụng, giúp bạn hồi phục sau kiệt sức, xây dựng thói quen lành mạnh, quản lý các vấn đề sức khỏe mạn tính, và nuôi dưỡng sự tự tin cùng bình an bên trong.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground mb-4">
            Dù bạn tìm cách giảm căng thẳng, cải thiện sức khỏe hay khám phá bản thân sâu sắc hơn, Mercy Blade luôn sánh bước cùng bạn — trong một không gian đầy thấu hiểu, khích lệ và không phán xét.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Và trên hành trình ấy, Mercy Blade có thể giúp bạn gặp được người bạn học phù hợp nhất — thậm chí là tri kỷ của chính mình.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
