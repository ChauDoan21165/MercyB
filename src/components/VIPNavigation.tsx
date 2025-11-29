import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import type { VipTierId } from "@/lib/constants/tiers";

interface VIPNavigationProps {
  currentPage?: VipTierId; // "vip1" | "vip2" | "vip3" | "vip3ii" | "vip4" | "vip5" | "vip6" | "vip9"
}

type VipNavItem = {
  id: VipTierId;
  path: string;
  label: string;
  canAccess: boolean;
};

export const VIPNavigation = ({ currentPage }: VIPNavigationProps) => {
  const navigate = useNavigate();
  const {
    isAdmin,
    canAccessVIP1,
    canAccessVIP2,
    canAccessVIP3,
    canAccessVIP3II,
    canAccessVIP4,
    canAccessVIP5,
    canAccessVIP6,
  } = useUserAccess();

  const pages: VipNavItem[] = [
    { id: "vip1", path: "/vip/vip1", label: "VIP1", canAccess: canAccessVIP1 },
    { id: "vip2", path: "/vip/vip2", label: "VIP2", canAccess: canAccessVIP2 },
    { id: "vip3", path: "/vip/vip3", label: "VIP3", canAccess: canAccessVIP3 },
    {
      id: "vip3ii",
      path: "/vip/vip3ii",
      label: "VIP3 II",
      canAccess: canAccessVIP3II,
    },
    {
      id: "vip4",
      path: "/vip/vip4",
      label: "VIP4 CareerZ",
      canAccess: canAccessVIP4,
    },
    {
      id: "vip5",
      path: "/vip/vip5",
      label: "VIP5 Writing",
      canAccess: canAccessVIP5,
    },
    {
      id: "vip6",
      path: "/vip/vip6",
      label: "VIP6 Psychology",
      canAccess: canAccessVIP6,
    },
  ];

  const currentIndex = currentPage
    ? pages.findIndex((p) => p.id === currentPage)
    : -1;

  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage =
    currentIndex >= 0 && currentIndex < pages.length - 1
      ? pages[currentIndex + 1]
      : null;

  const handleNavigation = (page: VipNavItem | null) => {
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
                aria-disabled={!prevPage || (!isAdmin && !prevPage.canAccess)}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                {prevPage ? prevPage.label : "Previous"}
              </Button>
            </TooltipTrigger>
            {prevPage && !isAdmin && !prevPage.canAccess && (
              <TooltipContent>
                <p>Locked: requires {prevPage.label}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <div className="text-sm text-muted-foreground px-2">
            {currentIndex >= 0 ? pages[currentIndex].label : "VIP Rooms"}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation(nextPage)}
                disabled={!nextPage || (!isAdmin && !nextPage.canAccess)}
                aria-disabled={!nextPage || (!isAdmin && !nextPage.canAccess)}
                className="gap-1"
              >
                {nextPage ? nextPage.label : "Next"}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            {nextPage && !isAdmin && !nextPage.canAccess && (
              <TooltipContent>
                <p>Locked: requires {nextPage.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
