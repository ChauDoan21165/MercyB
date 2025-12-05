/**
 * Mercy Onboarding Intro
 * 
 * 3-step onboarding for first-time users.
 */

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MercyAvatar } from './MercyAvatar';
import { MercyAnimation } from './MercyAnimations';
import { memory } from '@/lib/mercy-host/memory';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingStep {
  titleEn: string;
  titleVi: string;
  contentEn: string;
  contentVi: string;
  animation: 'halo' | 'ripple' | 'shimmer';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    titleEn: "Meet Mercy, Your Guide",
    titleVi: "Gặp Mercy, Người Hướng Dẫn Của Bạn",
    contentEn: "Welcome! I'm Mercy, your personal host. I'll be here to guide you through your learning journey with warmth and encouragement.",
    contentVi: "Chào mừng! Mình là Mercy, người đồng hành của bạn. Mình sẽ ở đây để hướng dẫn bạn trong hành trình học tập với sự ấm áp và khích lệ.",
    animation: 'halo'
  },
  {
    titleEn: "I Adapt To You",
    titleVi: "Mình Thích Nghi Với Bạn",
    contentEn: "As you grow, my guidance evolves. In higher tiers, I speak with more depth and vision. But always, I remain your steady companion.",
    contentVi: "Khi bạn phát triển, sự hướng dẫn của mình cũng tiến hóa. Ở các tầng cao hơn, mình nói với chiều sâu và tầm nhìn hơn. Nhưng luôn luôn, mình vẫn là người bạn đồng hành vững vàng của bạn.",
    animation: 'shimmer'
  },
  {
    titleEn: "Let's Begin Together",
    titleVi: "Hãy Bắt Đầu Cùng Nhau",
    contentEn: "I'll greet you when you enter rooms, celebrate your progress, and offer gentle guidance. Press Shift+M anytime to toggle my presence.",
    contentVi: "Mình sẽ chào bạn khi bạn vào phòng, ăn mừng tiến bộ của bạn, và đưa ra hướng dẫn nhẹ nhàng. Nhấn Shift+M bất cứ lúc nào để bật/tắt sự hiện diện của mình.",
    animation: 'ripple'
  }
];

interface OnboardingIntroProps {
  language?: 'en' | 'vi';
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingIntro({
  language = 'en',
  onComplete,
  onSkip
}: OnboardingIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if onboarding needed
  useEffect(() => {
    if (!memory.needsOnboarding()) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleComplete = () => {
    memory.completeOnboarding();
    setIsVisible(false);
    onComplete?.();
  };

  const handleSkip = () => {
    memory.completeOnboarding();
    setIsVisible(false);
    onSkip?.();
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md mx-4">
        {/* Skip button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          {language === 'vi' ? 'Bỏ qua' : 'Skip'}
        </Button>

        {/* Main card */}
        <div 
          className={cn(
            "bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-200",
            isAnimating && "opacity-50 scale-95"
          )}
        >
          {/* Header with avatar */}
          <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-8 flex flex-col items-center">
            <div className="relative">
              <MercyAnimation variant={step.animation} size={100} className="absolute inset-0" />
              <MercyAvatar size={80} style="angelic" animate />
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Mercy</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground text-center mb-3">
              {language === 'vi' ? step.titleVi : step.titleEn}
            </h2>
            <p className="text-muted-foreground text-center leading-relaxed">
              {language === 'vi' ? step.contentVi : step.contentEn}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pb-4">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === currentStep 
                    ? "w-6 bg-primary" 
                    : "w-2 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {language === 'vi' ? 'Quay lại' : 'Back'}
            </Button>

            <Button
              onClick={handleNext}
              className="gap-1"
            >
              {isLastStep 
                ? (language === 'vi' ? 'Bắt đầu' : "Let's Go")
                : (language === 'vi' ? 'Tiếp theo' : 'Next')
              }
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if onboarding should show
 */
export function useOnboardingCheck(): boolean {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    setNeedsOnboarding(memory.needsOnboarding());
  }, []);

  return needsOnboarding;
}
