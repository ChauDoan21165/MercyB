import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserAccess } from '@/hooks/useUserAccess';
import { toast } from '@/hooks/use-toast';

interface VIPNavigationProps {
  currentPage: 'vip1' | 'vip2' | 'vip3';
}

export const VIPNavigation = ({ currentPage }: VIPNavigationProps) => {
  const navigate = useNavigate();
  const { isAdmin, canAccessVIP1, canAccessVIP2, canAccessVIP3 } = useUserAccess();

  const pages = [
    { name: 'vip1', path: '/rooms-vip1', label: 'VIP1', canAccess: canAccessVIP1 },
    { name: 'vip2', path: '/rooms-vip2', label: 'VIP2', canAccess: canAccessVIP2 },
    { name: 'vip3', path: '/rooms-vip3', label: 'VIP3', canAccess: canAccessVIP3 },
  ];

  const currentIndex = pages.findIndex(p => p.name === currentPage);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const handleNavigation = (page: typeof pages[0] | null) => {
    if (!page) return;

    if (!isAdmin && !page.canAccess) {
      toast({
        title: 'Access Denied',
        description: 'Upgrade your subscription to access this tier',
        variant: 'destructive',
      });
      return;
    }

    navigate(page.path);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation(prevPage)}
          disabled={!prevPage || (!isAdmin && !prevPage.canAccess)}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {prevPage ? prevPage.label : 'Previous'}
        </Button>
        
        <div className="text-sm text-muted-foreground px-2">
          {pages[currentIndex].label}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation(nextPage)}
          disabled={!nextPage || (!isAdmin && !nextPage.canAccess)}
          className="gap-1"
        >
          {nextPage ? nextPage.label : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
