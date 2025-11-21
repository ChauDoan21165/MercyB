import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ALL_ROOMS, RoomInfo } from '@/lib/roomData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const RoomSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RoomInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search through rooms
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = ALL_ROOMS.filter(room => 
      room.nameEn.toLowerCase().includes(searchTerm) ||
      room.nameVi.toLowerCase().includes(searchTerm) ||
      room.id.toLowerCase().includes(searchTerm)
    ).slice(0, 8); // Limit to 8 results

    setResults(filtered);
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
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto shadow-lg border-border z-50">
          <div className="py-2">
            {results.map((room) => (
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
        </Card>
      )}

      {/* No results message */}
      {isOpen && query && results.length === 0 && (
        <Card className="absolute top-full mt-2 w-full p-4 text-center text-sm text-muted-foreground border-border z-50">
          No rooms found for "{query}"
        </Card>
      )}
    </div>
  );
};
