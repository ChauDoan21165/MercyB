/**
 * Room Link Health Component
 * 
 * Displays mismatches between UI room references and actual data sources.
 * Helps identify broken links before users encounter them.
 */

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Link2Off, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface BrokenLink {
  id: string;
  source: string;
  reason: string;
}

interface OrphanFile {
  id: string;
  filename: string;
  note: string;
}

interface LinkHealthData {
  brokenLinks: BrokenLink[];
  orphanFiles: OrphanFile[];
  totalUiReferences: number;
  totalDataFiles: number;
  loading: boolean;
}

export const RoomLinkHealth = () => {
  const [health, setHealth] = useState<LinkHealthData>({
    brokenLinks: [],
    orphanFiles: [],
    totalUiReferences: 0,
    totalDataFiles: 0,
    loading: true
  });

  const checkRoomLinks = async () => {
    setHealth(prev => ({ ...prev, loading: true }));

    try {
      // 1. Get all room IDs from database
      const { data: dbRooms, error: dbError } = await supabase
        .from('rooms')
        .select('id, tier');

      if (dbError) throw dbError;

      const dbRoomIds = new Set(dbRooms?.map(r => r.id) || []);

      // 2. Get hardcoded UI references
      const uiRoomIds = new Set<string>();
      const uiSources: { id: string; source: string }[] = [];

      // VIP4 hardcoded rooms (from RoomGridVIP4.tsx)
      const vip4HardcodedRooms = [
        "courage-to-begin", "discover-self", "explore-world", "build-skills",
        "bridge-to-reality", "resilience-and-adaptation", "career-community",
        "launch-career", "find-fit", "grow-wealth", "master-climb", "lead-impact"
      ];
      vip4HardcodedRooms.forEach(id => {
        uiRoomIds.add(id);
        uiSources.push({ id, source: 'VIP4 Grid (hardcoded array)' });
      });

      // Kids rooms hardcoded map (from KidsChat.tsx)
      const kidsHardcodedRooms = [
        "alphabet-adventure", "colors-shapes", "numbers-counting", "opposites-matching",
        "body-parts-movement", "feelings-emotions", "first-action-verbs", "size-comparison",
        "simple-questions", "early-phonics", "family-home", "rooms-house",
        "clothes-dressing", "food-snacks", "drinks-treats", "daily-routines",
        "bedtime-words", "bathroom-hygiene", "school-objects", "playground-words",
        "toys-playtime", "animals-sounds", "farm-animals", "wild-animals",
        "pets-caring", "nature-explorers", "weather-kids", "colors-nature",
        "magic-story", "make-believe",
        // Level 2
        "school-life", "classroom-english", "math-words", "science-basics",
        "geography-basics", "reading-skills", "spelling-patterns", "project-vocab",
        "art-creativity", "hobbies-fun", "games-sports", "friendship-kindness",
        "social-skills", "community-helpers", "safety-rules", "healthy-habits"
      ];
      kidsHardcodedRooms.forEach(id => {
        uiRoomIds.add(id);
        uiSources.push({ id, source: 'Kids Chat (KIDS_ROOM_JSON_MAP)' });
      });

      // 3. Cross-check for broken links
      const brokenLinks: BrokenLink[] = [];
      
      uiRoomIds.forEach(id => {
        // Normalize for comparison
        const normalizedId = id.toLowerCase().replace(/_/g, '-');
        
        // Check if exists in database
        const existsInDb = Array.from(dbRoomIds).some(dbId => 
          dbId.toLowerCase().replace(/_/g, '-') === normalizedId
        );

        if (!existsInDb) {
          const source = uiSources.find(s => s.id === id)?.source || 'Unknown';
          brokenLinks.push({
            id,
            source,
            reason: 'No matching database row found'
          });
        }
      });

      // 4. Check for orphan database rooms (rooms in DB but possibly not in any JSON)
      // Note: This is informational since rooms may be loaded from DB directly
      const orphanFiles: OrphanFile[] = [];
      
      dbRooms?.forEach(room => {
        const normalizedId = room.id.toLowerCase().replace(/_/g, '-');
        const isReferenced = Array.from(uiRoomIds).some(uiId =>
          uiId.toLowerCase().replace(/_/g, '-') === normalizedId
        );

        // Check if it's a dynamically loaded room (from VIP1-6, VIP9 hooks)
        // These rooms are loaded via useVipRooms/useCachedRooms, not hardcoded
        const isDynamicRoom = room.tier && (
          room.tier.toLowerCase().includes('vip') ||
          room.tier.toLowerCase().includes('free')
        );

        if (!isReferenced && !isDynamicRoom) {
          orphanFiles.push({
            id: room.id,
            filename: `${room.id}.json`,
            note: 'Database row exists but not referenced in hardcoded UI maps'
          });
        }
      });

      setHealth({
        brokenLinks,
        orphanFiles,
        totalUiReferences: uiRoomIds.size,
        totalDataFiles: dbRooms?.length || 0,
        loading: false
      });

    } catch (error) {
      console.error('Error checking room links:', error);
      setHealth(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    checkRoomLinks();
  }, []);

  const hasIssues = health.brokenLinks.length > 0;

  return (
    <Card className="p-6 bg-white border border-black">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link2Off className="h-6 w-6 text-black" />
            <div>
              <h3 className="text-xl font-bold text-black">Room Link Validation</h3>
              <p className="text-sm text-gray-600">
                Cross-check UI references vs actual room data
              </p>
            </div>
          </div>
          <Button
            onClick={checkRoomLinks}
            disabled={health.loading}
            variant="outline"
            size="sm"
            className="border-black text-black hover:bg-gray-100"
          >
            {health.loading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>

        {/* Summary Stats */}
        {!health.loading && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border border-black/10 rounded">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {health.totalUiReferences}
              </div>
              <div className="text-xs text-gray-600">Hardcoded UI Refs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">
                {health.totalDataFiles}
              </div>
              <div className="text-xs text-gray-600">Database Rooms</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${hasIssues ? 'text-red-600' : 'text-green-600'}`}>
                {health.brokenLinks.length}
              </div>
              <div className="text-xs text-gray-600">Broken Links</div>
            </div>
          </div>
        )}

        {/* Broken Links Section */}
        {!health.loading && health.brokenLinks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-black">
                Broken Links ({health.brokenLinks.length})
              </h4>
              <Badge variant="destructive">Fix Required</Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {health.brokenLinks.map((link, idx) => (
                <Card key={idx} className="p-3 bg-red-50 border-red-200">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <code className="text-sm font-mono text-red-900 break-all">
                        {link.id}
                      </code>
                      <Badge variant="outline" className="shrink-0 text-xs border-red-400 text-red-700">
                        Missing
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-700">
                      <strong>Source:</strong> {link.source}
                    </p>
                    <p className="text-xs text-red-700">
                      {link.reason}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-black">
              <strong>Action Required:</strong> Either create the missing room JSON/database entries, 
              or remove these IDs from the UI code. Deployment should be blocked until fixed.
            </div>
          </div>
        )}

        {/* Orphan Files Section (Informational) */}
        {!health.loading && health.orphanFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-black">
                Orphan Rooms ({health.orphanFiles.length})
              </h4>
              <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                Informational
              </Badge>
            </div>
            
            <p className="text-xs text-gray-600">
              These database rooms are not in hardcoded UI maps. This is normal for dynamically loaded rooms 
              (VIP1-VIP6, VIP9 use database queries). Only investigate if a room should be hardcoded but isn't showing.
            </p>
            
            <details className="text-sm">
              <summary className="cursor-pointer text-black font-medium hover:text-gray-700">
                View {health.orphanFiles.length} orphan rooms
              </summary>
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pl-4">
                {health.orphanFiles.map((file, idx) => (
                  <div key={idx} className="text-xs font-mono text-gray-700">
                    • {file.id}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Success State */}
        {!health.loading && health.brokenLinks.length === 0 && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-black">All Room Links Valid ✅</p>
              <p className="text-xs text-gray-600">
                All hardcoded UI references point to valid database rooms
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {health.loading && (
          <div className="text-center py-8 text-gray-500">
            <div className="inline-block h-8 w-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm">Validating room links...</p>
          </div>
        )}
      </div>
    </Card>
  );
};
