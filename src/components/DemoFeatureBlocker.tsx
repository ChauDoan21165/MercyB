import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Sparkles } from 'lucide-react';

interface DemoFeatureBlockerProps {
  featureName: string;
  description?: string;
}

export const DemoFeatureBlocker = ({ 
  featureName, 
  description = "This feature is only available to registered users." 
}: DemoFeatureBlockerProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{featureName} Locked</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => navigate('/auth')} 
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Sign Up to Unlock
        </Button>
      </CardContent>
    </Card>
  );
};
