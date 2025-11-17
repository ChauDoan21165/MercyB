import { Slider } from '@/components/ui/slider';
import { Palette } from 'lucide-react';
import { useColorIntensity } from '@/contexts/ColorIntensityContext';

export const ColorIntensitySlider = () => {
  const { intensity, setIntensity } = useColorIntensity();

  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      <Palette className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Highlight Intensity</span>
          <span className="text-xs text-muted-foreground">{Math.round(intensity * 100)}%</span>
        </div>
        <Slider
          value={[intensity]}
          onValueChange={(values) => setIntensity(values[0])}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Subtle</span>
          <span>Vibrant</span>
        </div>
      </div>
    </div>
  );
};
