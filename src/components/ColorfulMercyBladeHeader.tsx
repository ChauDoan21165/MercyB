import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ColorfulMercyBladeHeaderProps {
  subtitle?: string;
  showBackButton?: boolean;
  showResetButton?: boolean;
  onReset?: () => void;
}

export const ColorfulMercyBladeHeader = ({
  subtitle,
  showBackButton = false,
  showResetButton = false,
  onReset,
}: ColorfulMercyBladeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4 px-6">
      <div className="max-w-[640px] mx-auto relative">
        {/* Back Button */}
        {showBackButton && (
          <Button
            onClick={() => navigate('/')}
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 gap-2 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}

        {/* Reset Button */}
        {showResetButton && onReset && (
          <Button
            onClick={onReset}
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
            title="Reset cached configuration"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-center tracking-tight">
          <span className="inline-block animate-fade-in" style={{ color: '#E91E63' }}>M</span>
          <span className="inline-block animate-fade-in" style={{ color: '#9C27B0', animationDelay: '0.1s' }}>e</span>
          <span className="inline-block animate-fade-in" style={{ color: '#3F51B5', animationDelay: '0.2s' }}>r</span>
          <span className="inline-block animate-fade-in" style={{ color: '#2196F3', animationDelay: '0.3s' }}>c</span>
          <span className="inline-block animate-fade-in" style={{ color: '#00BCD4', animationDelay: '0.4s' }}>y</span>
          <span className="inline-block mx-2"></span>
          <span className="inline-block animate-fade-in" style={{ color: '#009688', animationDelay: '0.5s' }}>B</span>
          <span className="inline-block animate-fade-in" style={{ color: '#4CAF50', animationDelay: '0.6s' }}>l</span>
          <span className="inline-block animate-fade-in" style={{ color: '#8BC34A', animationDelay: '0.7s' }}>a</span>
          <span className="inline-block animate-fade-in" style={{ color: '#FFC107', animationDelay: '0.8s' }}>d</span>
          <span className="inline-block animate-fade-in" style={{ color: '#FF9800', animationDelay: '0.9s' }}>e</span>
        </h1>
        {subtitle && (
          <p className="text-center text-sm text-gray-600 mt-2">{subtitle}</p>
        )}
      </div>
    </header>
  );
};
