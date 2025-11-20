import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserAccess } from '@/hooks/useUserAccess';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface VIPNavigationProps {
  currentPage?: 'vip1' | 'vip2' | 'vip3' | 'vip3_ii' | 'vip4' | 'vip5';
}

export const VIPNavigation = ({ currentPage }: VIPNavigationProps) => {
  const navigate = useNavigate();
  const { isAdmin, canAccessVIP1, canAccessVIP2, canAccessVIP3, canAccessVIP3II, canAccessVIP4, canAccessVIP5 } = useUserAccess();

  const pages = [
    { name: 'vip1', path: '/rooms-vip1', label: 'VIP1', canAccess: canAccessVIP1 },
    { name: 'vip2', path: '/rooms-vip2', label: 'VIP2', canAccess: canAccessVIP2 },
    { name: 'vip3', path: '/rooms-vip3', label: 'VIP3', canAccess: canAccessVIP3 },
    { name: 'vip3_ii', path: '/rooms-vip3-ii', label: 'VIP3 II', canAccess: canAccessVIP3II },
    { name: 'vip4', path: '/rooms-vip4', label: 'VIP4 CareerZ', canAccess: canAccessVIP4 },
    { name: 'vip5', path: '/rooms-vip5', label: 'VIP5 Writing', canAccess: canAccessVIP5 },
  ];

  const currentIndex = currentPage ? pages.findIndex(p => p.name === currentPage) : -1;
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const handleNavigation = (page: typeof pages[0] | null) => {
    if (!page) return;
    if (!isAdmin && !page.canAccess) return;
    navigate(page.path);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            {prevPage && !isAdmin && !prevPage.canAccess && (
              <TooltipContent>
                <p>Only for {prevPage.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          <div className="text-sm text-muted-foreground px-2">
            {currentIndex >= 0 ? pages[currentIndex].label : 'VIP Rooms'}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            {nextPage && !isAdmin && !nextPage.canAccess && (
              <TooltipContent>
                <p>Only for {nextPage.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
