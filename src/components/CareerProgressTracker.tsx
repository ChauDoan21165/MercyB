import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CareerStep {
  id: string;
  name: string;
  color: string;
  roomIds: string[]; // Multiple room IDs can map to one step
}

const CAREER_JOURNEY: CareerStep[] = [
  { 
    id: "discover-self", 
    name: "Discover Self", 
    color: "#4CAF50",
    roomIds: ["discover-self-vip4-career-1"]
  },
  { 
    id: "explore-world", 
    name: "Explore World", 
    color: "#2196F3",
    roomIds: ["explore-world-vip4-career-i-2", "explore-world-vip4-career-ii-2"]
  },
  { 
    id: "build-skills", 
    name: "Build Skills", 
    color: "#1E88E5",
    roomIds: ["build-skills-vip4-career-3", "build-skills-vip4-career-3-ii"]
  },
  { 
    id: "launch-career", 
    name: "Launch Career", 
    color: "#FF5722",
    roomIds: ["launch-career-vip4-career-4-ii"]
  },
  { 
    id: "find-fit", 
    name: "Find Fit", 
    color: "#9C27B0",
    roomIds: ["find-fit-vip4-career-5"]
  },
  { 
    id: "grow-wealth", 
    name: "Grow Wealth", 
    color: "#FF9800",
    roomIds: ["grow-wealth-vip4-career-6"]
  },
  { 
    id: "master-climb", 
    name: "Master Climb", 
    color: "#009688",
    roomIds: ["master-climb-vip4-career-7"]
  },
  { 
    id: "lead-impact", 
    name: "Lead Impact", 
    color: "#673AB7",
    roomIds: ["lead-impact-vip4-career-8"]
  }
];

interface CareerProgressTrackerProps {
  currentRoomId: string;
}

export const CareerProgressTracker = ({ currentRoomId }: CareerProgressTrackerProps) => {
  const navigate = useNavigate();
  
  // Find current step index
  const currentStepIndex = CAREER_JOURNEY.findIndex(step => 
    step.roomIds.includes(currentRoomId)
  );

  const handleStepClick = (step: CareerStep, stepIndex: number) => {
    // Only allow navigation to completed or current steps
    if (stepIndex <= currentStepIndex) {
      // Navigate to first room in the step
      const firstRoomId = step.roomIds[0];
      if (firstRoomId) {
        navigate(`/chat/${firstRoomId}`);
      }
    }
  };

  return (
    <Card className="p-1 mb-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 border-emerald-200 dark:border-gray-700">
      <div className="mb-1">
        <h3 className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
          Career Journey Progress • Hành Trình Nghề Nghiệp
        </h3>
        <p className="text-[10px] text-muted-foreground">
          Step {currentStepIndex + 1} of 8 • Bước {currentStepIndex + 1} trên 8
        </p>
      </div>
      
      {/* Desktop Progress Bar */}
      <div className="hidden md:flex items-center gap-1">
        {CAREER_JOURNEY.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isAccessible = index <= currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => handleStepClick(step, index)}
                disabled={!isAccessible}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all flex-1
                  ${isCurrent ? 'bg-card shadow-md' : ''}
                  ${isAccessible ? 'cursor-pointer hover:bg-card/50' : 'cursor-not-allowed opacity-50'}
                `}
              >
                {/* Icon */}
                {isCompleted ? (
                  <CheckCircle2 
                    className="w-5 h-5 flex-shrink-0" 
                    style={{ color: step.color }}
                  />
                ) : (
                  <Circle 
                    className={`w-5 h-5 flex-shrink-0 ${isCurrent ? '' : 'opacity-40'}`}
                    style={{ color: isCurrent ? step.color : '#999' }}
                  />
                )}
                
                {/* Step Name */}
                <span 
                  className={`
                    text-xs font-medium truncate
                    ${isCurrent ? 'text-foreground' : ''}
                    ${isCompleted ? 'text-muted-foreground' : ''}
                    ${isUpcoming ? 'text-muted-foreground/50' : ''}
                  `}
                >
                  {step.name}
                </span>
              </button>
              
              {/* Arrow between steps */}
              {index < CAREER_JOURNEY.length - 1 && (
                <ChevronRight className="w-4 h-4 text-orange-400 opacity-50 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Progress - Compact View */}
      <div className="md:hidden">
        <div className="flex items-center gap-1 mb-3">
          {CAREER_JOURNEY.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div
                key={step.id}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: isCompleted || isCurrent ? step.color : '#e5e7eb',
                  opacity: isCompleted || isCurrent ? 1 : 0.3
                }}
              />
            );
          })}
        </div>
        
        {/* Current Step Detail */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: CAREER_JOURNEY[currentStepIndex]?.color }}
          >
            <span className="text-white text-xs font-bold">{currentStepIndex + 1}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {CAREER_JOURNEY[currentStepIndex]?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentStepIndex > 0 && `✓ ${currentStepIndex} completed • `}
              {8 - currentStepIndex - 1} remaining
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
