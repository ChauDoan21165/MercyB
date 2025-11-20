import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Sparkles } from 'lucide-react';

export const DemoModeBanner = () => {
  const navigate = useNavigate();

  return (
    <Alert className="border-primary bg-primary/5 mb-6">
      <Info className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary font-semibold">Demo Mode - Limited Access</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-sm text-foreground/80">
          You're viewing a limited demo with access to only 1-2 sample rooms. 
          Features like favorites, writing coach, progress tracking, and personalized content are disabled.
        </p>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => navigate('/auth')} 
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Sign Up for Full Access
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outline" 
            size="sm"
          >
            Sign In
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
