import { analyzeEmotionalThemes, EmotionTheme } from '@/lib/keywordAnalysis';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface EmotionalThemeAnalysisProps {
  text: string;
  className?: string;
}

export const EmotionalThemeAnalysis = ({ text, className = '' }: EmotionalThemeAnalysisProps) => {
  const themes = analyzeEmotionalThemes(text);
  
  if (themes.length === 0) {
    return null;
  }

  // Get top 5 themes
  const topThemes = themes.slice(0, 5);
  const maxCount = topThemes[0]?.count || 1;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Emotional Themes Analysis</h4>
      </div>
      
      <div className="space-y-3">
        {topThemes.map((theme) => (
          <div key={theme.emotion} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span 
                className="font-medium capitalize"
                style={{ color: theme.color }}
              >
                {theme.emotion.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0"
                  style={{ 
                    backgroundColor: `${theme.color}20`,
                    color: theme.color,
                    borderColor: theme.color
                  }}
                >
                  {theme.count} {theme.count === 1 ? 'keyword' : 'keywords'}
                </Badge>
                <span className="text-muted-foreground font-mono">
                  {theme.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(theme.count / maxCount) * 100}%`,
                  background: theme.color
                }}
              />
            </div>
            
            {/* Show sample keywords (max 3) */}
            <div className="flex flex-wrap gap-1 mt-1">
              {theme.keywords.slice(0, 3).map((keyword, idx) => (
                <span
                  key={idx}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${theme.color}15`,
                    color: theme.color
                  }}
                >
                  {keyword}
                </span>
              ))}
              {theme.keywords.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{theme.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      {topThemes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong style={{ color: topThemes[0].color }}>
              {topThemes[0].emotion.replace(/_/g, ' ')}
            </strong>
            {' '}is the dominant theme in this essay, appearing{' '}
            <strong>{topThemes[0].count}</strong> times 
            ({topThemes[0].percentage.toFixed(0)}% of all keywords).
          </p>
        </div>
      )}
    </Card>
  );
};
