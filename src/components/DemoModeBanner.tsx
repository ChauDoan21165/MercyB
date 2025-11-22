import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

export const DemoModeBanner = () => {
  const navigate = useNavigate();

  return (
    <Alert className="border-primary bg-gradient-to-r from-primary/10 to-accent/10 mb-6">
      <Sparkles className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary font-semibold">Register for Free Tier Access</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="text-sm text-foreground/80">
          Enjoying the content? Register for a free account to unlock your progress tracking, favorites, and personalized learning.
        </p>
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={() => navigate('/auth')} 
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Register Free
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
