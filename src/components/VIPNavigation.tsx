/**
 * Path: src/components/VIPNavigation.tsx
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useUserAccess } from "@/hooks/useUserAccess";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface VIPNavigationProps {
  currentPage?: string;
}

type VipNavItem = {
  id: string;
  path: string;
  label: string;
  canAccess: boolean;
};

export const VIPNavigation = ({ currentPage }: VIPNavigationProps) => {
  const navigate = useNavigate();
  const { isAdmin, user } = useUserAccess();
  const access = user as any; // Step 5 fix: bypass missing access typing

  const pages: VipNavItem[] = [
    { id: "level1", path: "/vip/level1", label: "Level 1", canAccess: access.hasPremium },
    { id: "level2", path: "/vip/level2", label: "Level 2", canAccess: access.hasPremium },
    { id: "level3", path: "/vip/level3", label: "Level 3", canAccess: access.hasPremium },
    { id: "level4", path: "/vip/level4", label: "Level 4 CareerZ", canAccess: access.hasPremium },
    { id: "level5", path: "/vip/level5", label: "Level 5 Writing", canAccess: access.hasPremium },
    { id: "level6", path: "/vip/level6", label: "Level 6 Psychology", canAccess: access.hasPremium },
  ];

  const currentIndex = currentPage ? pages.findIndex((page) => page.id === currentPage) : -1;

  const currentItem = currentIndex >= 0 && currentIndex < pages.length ? pages[currentIndex] : null;
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  const canNavigateTo = (page: VipNavItem | null): boolean => {
    if (!page) return false;
    return Boolean(isAdmin || page.canAccess);
  };

  const handleNavigation = (page: VipNavItem | null): void => {
    if (!page) return;
    if (!canNavigateTo(page)) return;
    navigate(page.path);
  };

  return (
    <TooltipProvider>
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleNavigation(prevPage)}
                disabled={!canNavigateTo(prevPage)}
                aria-disabled={!canNavigateTo(prevPage)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {prevPage ? prevPage.label : "Previous"}
              </Button>
            </TooltipTrigger>
            {prevPage && !isAdmin && !prevPage.canAccess ? (
              <TooltipContent>
                <p>Locked: requires {prevPage.label}</p>
              </TooltipContent>
            ) : null}
          </Tooltip>

          <div className="px-2 text-sm text-muted-foreground">
            {currentItem?.label ?? "VIP Rooms"}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleNavigation(nextPage)}
                disabled={!canNavigateTo(nextPage)}
                aria-disabled={!canNavigateTo(nextPage)}
                className="gap-1"
              >
                {nextPage ? nextPage.label : "Next"}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            {nextPage && !isAdmin && !nextPage.canAccess ? (
              <TooltipContent>
                <p>Locked: requires {nextPage.label}</p>
              </TooltipContent>
            ) : null}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default VIPNavigation;
