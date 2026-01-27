import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { searchRooms, type RoomSearchResult } from '@/lib/search/roomSearch';
import { useAllRooms } from '@/hooks/useRooms';

// Tier badge colors
const TIER_COLORS: Record<string, string> = {
  free: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  vip1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  vip2: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  vip3: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  vip4: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  vip5: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  vip6: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  vip9: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  kids_1: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  kids_2: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  kids_3: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

// Domain chip colors
const DOMAIN_COLORS: Record<string, string> = {
  english: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
  health: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
  strategy: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300",
  kids: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300",
  martial: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
  other: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-300",
};

export const RoomSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RoomSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Pre-load rooms registry
  const { loading: roomsLoading } = useAllRooms();

  // Debounced search
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = searchRooms(searchQuery, { limit: 20 });
    setResults(searchResults);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

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
    navigate(`/room/${roomId}`);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
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
      {isOpen && query && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg border-border z-50">
          <div className="py-2">
            {roomsLoading ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">Loading rooms...</div>
            ) : results.length > 0 ? (
              results.map((room) => (
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
                        {room.title_en}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {room.title_vi}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={cn("px-1.5 py-0.5 text-[10px] rounded", DOMAIN_COLORS[room.domain] || DOMAIN_COLORS.other)}>
                        {room.domain}
                      </span>
                      <span className={cn("px-2 py-0.5 text-xs rounded-full", TIER_COLORS[room.tier] || TIER_COLORS.free)}>
                        {room.tier.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                No rooms found for "{query}"
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
