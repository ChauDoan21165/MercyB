import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ALL_ROOMS, RoomInfo } from '@/lib/roomData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Tier definitions for search
const TIERS = [
  { id: 'free', nameEn: 'Free Tier', nameVi: 'Cấp Miễn Phí', route: '/rooms' },
  { id: 'vip1', nameEn: 'VIP1 Tier', nameVi: 'Cấp VIP1', route: '/rooms-vip1' },
  { id: 'vip2', nameEn: 'VIP2 Tier', nameVi: 'Cấp VIP2', route: '/rooms-vip2' },
  { id: 'vip3', nameEn: 'VIP3 Tier', nameVi: 'Cấp VIP3', route: '/rooms-vip3' },
  { id: 'vip4', nameEn: 'VIP4 Tier', nameVi: 'Cấp VIP4', route: '/rooms-vip4' },
  { id: 'vip5', nameEn: 'VIP5 Tier', nameVi: 'Cấp VIP5', route: '/rooms-vip5' },
  { id: 'vip6', nameEn: 'VIP6 Tier', nameVi: 'Cấp VIP6', route: '/vip6' },
  { id: 'vip9', nameEn: 'VIP9 Tier', nameVi: 'Cấp VIP9', route: '/rooms-vip9' },
  { id: 'kids_l1', nameEn: 'Kids Level 1', nameVi: 'Trẻ Em Cấp 1', route: '/kids-level1' },
  { id: 'kids_l2', nameEn: 'Kids Level 2', nameVi: 'Trẻ Em Cấp 2', route: '/kids-level2' },
  { id: 'kids_l3', nameEn: 'Kids Level 3', nameVi: 'Trẻ Em Cấp 3', route: '/kids-level3' },
];

type TierResult = typeof TIERS[0];

export const RoomSearch = () => {
  const [query, setQuery] = useState('');
  const [roomResults, setRoomResults] = useState<RoomInfo[]>([]);
  const [tierResults, setTierResults] = useState<TierResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search through rooms and tiers
  useEffect(() => {
    if (!query.trim()) {
      setRoomResults([]);
      setTierResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    
    // Search tiers
    const filteredTiers = TIERS.filter(tier =>
      tier.id.toLowerCase().includes(searchTerm) ||
      tier.nameEn.toLowerCase().includes(searchTerm) ||
      tier.nameVi.toLowerCase().includes(searchTerm)
    );

    // Search rooms
    const filteredRooms = ALL_ROOMS.filter(room => 
      room.nameEn.toLowerCase().includes(searchTerm) ||
      room.nameVi.toLowerCase().includes(searchTerm) ||
      room.id.toLowerCase().includes(searchTerm)
    ).slice(0, 6); // Limit to 6 room results to make space for tiers

    setTierResults(filteredTiers);
    setRoomResults(filteredRooms);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
    setQuery('');
    setRoomResults([]);
    setTierResults([]);
    setIsOpen(false);
  };

  const handleTierClick = (route: string) => {
    navigate(route);
    setQuery('');
    setRoomResults([]);
    setTierResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setRoomResults([]);
    setTierResults([]);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search rooms..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-9 h-10 border-border bg-background/95 backdrop-blur-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (tierResults.length > 0 || roomResults.length > 0) && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg border-border z-50">
          <div className="py-2">
            {/* Tier results */}
            {tierResults.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tiers
                </div>
                {tierResults.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleTierClick(tier.route)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors",
                      "border-b border-border"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {tier.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {tier.nameVi}
                        </p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full flex-shrink-0",
                        tier.id === 'free' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        tier.id === 'vip1' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        tier.id === 'vip2' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                        tier.id === 'vip3' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        tier.id === 'vip4' && "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
                        tier.id === 'vip5' && "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                        tier.id === 'vip6' && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                        tier.id === 'vip9' && "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
                        tier.id.startsWith('kids') && "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
                      )}>
                        {tier.id.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Room results */}
            {roomResults.length > 0 && (
              <div>
                {tierResults.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t border-border">
                    Rooms
                  </div>
                )}
                {roomResults.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomClick(room.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors",
                      "border-b border-border last:border-b-0"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {room.nameEn}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {room.nameVi}
                        </p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 text-xs rounded-full flex-shrink-0",
                        room.tier === 'free' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                        room.tier === 'vip1' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        room.tier === 'vip2' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                        room.tier === 'vip3' && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                        room.tier === 'vip4' && "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                      )}>
                        {room.tier.toUpperCase()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* No results message */}
      {isOpen && query && tierResults.length === 0 && roomResults.length === 0 && (
        <Card className="absolute top-full mt-2 w-full p-4 text-center text-sm text-muted-foreground border-border z-50">
          No tiers or rooms found for "{query}"
        </Card>
      )}
    </div>
  );
};
