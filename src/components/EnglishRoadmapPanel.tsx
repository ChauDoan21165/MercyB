/**
 * English Roadmap Panel
 * 
 * Minimal UI component to generate and display 90-day English plans.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNinetyDayPlan } from '@/hooks/useNinetyDayPlan';
import { CEFR_INFO, FOCUS_INFO, type CEFRLevel, type FocusArea } from '@/lib/english/planTypes';
import { Loader2, BookOpen, Target, Clock, Sparkles } from 'lucide-react';

interface EnglishRoadmapPanelProps {
  defaultLevel?: CEFRLevel;
  className?: string;
}

export function EnglishRoadmapPanel({ 
  defaultLevel = 'A1',
  className = '' 
}: EnglishRoadmapPanelProps) {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(defaultLevel);
  const [selectedFocus, setSelectedFocus] = useState<FocusArea>('mixed');
  const { plan, isLoading, error, generatePlan, clearPlan } = useNinetyDayPlan();

  const handleGenerate = () => {
    generatePlan({
      cefrLevel: selectedLevel,
      focus: selectedFocus,
      dailyMinutes: 15,
    });
  };

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          90-Day English Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">CEFR Level</label>
            <Select 
              value={selectedLevel} 
              onValueChange={(v) => setSelectedLevel(v as CEFRLevel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CEFR_INFO).map(([level, info]) => (
                  <SelectItem key={level} value={level}>
                    {level} - {info.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Focus Area</label>
            <Select 
              value={selectedFocus} 
              onValueChange={(v) => setSelectedFocus(v as FocusArea)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FOCUS_INFO).map(([focus, info]) => (
                  <SelectItem key={focus} value={focus}>
                    {info.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate my 90-day English roadmap
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Plan Display */}
        {plan && (
          <div className="space-y-4 pt-4 border-t">
            {/* Plan Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {CEFR_INFO[plan.cefr_level].name_en} Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  {CEFR_INFO[plan.cefr_level].description_en}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearPlan}>
                Clear
              </Button>
            </div>

            {/* Plan Stats */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>{plan.estimated_rooms} rooms</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>~{plan.estimated_hours} hours</span>
              </div>
              <Badge variant="secondary">
                {FOCUS_INFO[plan.focus].name_en}
              </Badge>
            </div>

            {/* Phases */}
            <div className="space-y-3">
              {plan.phases.map((phase) => (
                <div 
                  key={phase.phase_number}
                  className="p-3 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Phase {phase.phase_number}: {phase.title_en}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      Weeks {phase.weeks_start}-{phase.weeks_end}
                    </Badge>
                  </div>
                  
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {phase.goals_en.map((goal, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {goal}
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs text-muted-foreground">
                    Target: {phase.rooms_to_complete} rooms
                  </div>

                  {/* Sample Tasks */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {phase.sample_tasks.slice(0, 3).map((task) => (
                      <Badge key={task.id} variant="secondary" className="text-xs">
                        {task.type} ({task.duration_minutes}m)
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
