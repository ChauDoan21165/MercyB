/**
 * TierRoomColumns - 3-Column Room Display Component
 * 
 * Displays rooms in the canonical Mercy Blade structure:
 * - LEFT: English Pathway
 * - CENTER: Core Mercy Blade 
 * - RIGHT: Life Skills / Survival
 * 
 * Used by VIP pages to maintain consistent 3-column layout.
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, Crown, BookOpen, Heart, Sword } from 'lucide-react';
import { categorizeRoom, COLUMN_LABELS, isVip3IIRoom } from '@/lib/constants/tierMapConfig';
import { highlightShortTitle } from '@/lib/wordColorHighlighter';
import { useMercyBladeTheme } from '@/hooks/useMercyBladeTheme';

interface Room {
  id: string;
  title_en: string;
  title_vi: string;
  hasData?: boolean;
  domain?: string;
}

interface TierRoomColumnsProps {
  rooms: Room[];
  tier: string;
  showVip3IILink?: boolean;
  onVip3IIClick?: () => void;
  excludeVip3II?: boolean;
}

export function TierRoomColumns({
  rooms,
  tier,
  showVip3IILink = false,
  onVip3IIClick,
  excludeVip3II = false,
}: TierRoomColumnsProps) {
  const navigate = useNavigate();
  const { isColor } = useMercyBladeTheme();

  // Filter out VIP3II rooms if requested
  const filteredRooms = excludeVip3II 
    ? rooms.filter(r => !isVip3IIRoom(r.id))
    : rooms;

  // Categorize rooms into 3 columns
  const columns = {
    english: [] as Room[],
    core: [] as Room[],
    skills: [] as Room[],
  };

  filteredRooms.forEach((room) => {
    const category = categorizeRoom(room.id, room.title_en);
    columns[category].push(room);
  });

  const renderRoomCard = (room: Room, index: number, columnType: 'english' | 'core' | 'skills') => {
    const hasData = room.hasData !== false;
    const ColumnIcon = columnType === 'english' ? BookOpen : columnType === 'core' ? Heart : Sword;
    
    return (
      <Card
        key={room.id}
        className={`relative p-3 transition-all duration-300 cursor-pointer group ${
          hasData 
            ? 'hover:scale-105 hover:shadow-lg hover:z-10' 
            : 'opacity-60 cursor-not-allowed'
        }`}
        style={{
          background: 'white',
          border: '1px solid hsl(var(--border))',
          animationDelay: `${index * 0.03}s`,
        }}
        onClick={() => {
          if (!hasData) return;
          navigate(`/room/${room.id}`);
        }}
        role="button"
        tabIndex={hasData ? 0 : -1}
        onKeyDown={(e) => {
          if (hasData && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            navigate(`/room/${room.id}`);
          }
        }}
        aria-label={`${room.title_en} - ${room.title_vi}`}
      >
        {/* Status Badge */}
        <div className="absolute top-1 right-1 z-10">
          {hasData ? (
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle2 className="w-3 h-3 text-white" aria-hidden="true" />
            </div>
          ) : (
            <div className="bg-gray-400 rounded-full p-1">
              <Lock className="w-3 h-3 text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Column Type Badge */}
        <div className="absolute bottom-1 right-1 z-10 opacity-50">
          <ColumnIcon className="w-3 h-3" aria-hidden="true" />
        </div>

        <div className="space-y-1 pr-6">
          <p
            className={`text-xs leading-tight line-clamp-2 ${
              isColor ? 'text-foreground' : 'font-black text-black'
            }`}
          >
            {isColor ? highlightShortTitle(room.title_en, index, false) : room.title_en}
          </p>
          <p
            className={`text-[10px] leading-tight line-clamp-2 ${
              isColor ? 'text-muted-foreground' : 'font-black text-black'
            }`}
          >
            {isColor ? highlightShortTitle(room.title_vi, index, true) : room.title_vi}
          </p>
        </div>

        {/* Hover Effect */}
        {hasData && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-gray-50/50"
            aria-hidden="true"
          />
        )}
      </Card>
    );
  };

  const renderColumn = (
    columnType: 'english' | 'core' | 'skills',
    columnRooms: Room[],
    Icon: React.ElementType,
    gradient: string
  ) => (
    <div className="flex-1 min-w-0">
      {/* Column Header */}
      <div 
        className="mb-4 p-3 rounded-lg text-center"
        style={{ background: gradient }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
          <h3 className="text-sm font-bold text-white">
            {COLUMN_LABELS[columnType].en}
          </h3>
        </div>
        <p className="text-xs text-white/80">
          {COLUMN_LABELS[columnType].vi}
        </p>
        <p className="text-xs text-white/60 mt-1">
          {columnRooms.length} rooms
        </p>
      </div>

      {/* Room Cards */}
      <div className="space-y-2">
        {columnRooms.length > 0 ? (
          columnRooms.map((room, index) => renderRoomCard(room, index, columnType))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <p>Coming soon</p>
            <p className="text-xs">Sắp ra mắt</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT: English Pathway */}
      {renderColumn(
        'english',
        columns.english,
        BookOpen,
        'linear-gradient(135deg, hsl(210, 70%, 50%), hsl(230, 70%, 60%))'
      )}

      {/* CENTER: Core Mercy Blade */}
      {renderColumn(
        'core',
        columns.core,
        Heart,
        'linear-gradient(135deg, hsl(340, 70%, 50%), hsl(320, 70%, 60%))'
      )}

      {/* RIGHT: Life Skills / Survival */}
      {renderColumn(
        'skills',
        columns.skills,
        Sword,
        'linear-gradient(135deg, hsl(150, 60%, 40%), hsl(170, 60%, 50%))'
      )}
    </div>
  );
}
