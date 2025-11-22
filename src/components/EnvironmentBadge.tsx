import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export function EnvironmentBadge() {
  // Detect environment based on hostname
  const isProduction = window.location.hostname === 'mercyblade.link' || 
                       window.location.hostname === 'www.mercyblade.link';
  
  const isStaging = window.location.hostname.includes('lovable.app') ||
                    window.location.hostname.includes('lovableproject.com');

  if (isProduction) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge variant="destructive" className="text-lg px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          PRODUCTION
        </Badge>
      </div>
    );
  }

  if (isStaging) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge 
          variant="default" 
          className="text-lg px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          STAGING
        </Badge>
      </div>
    );
  }

  return null;
}
