import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "@/components/AudioPlayer";

interface KidsRoom {
  id: string;
  title_en: string;
  title_vi: string;
  level_id: string;
}

interface KidsEntry {
  id: string;
  content_en: string;
  content_vi: string;
  audio_url: string | null;
  display_order: number;
}

const KIDS_ROOM_JSON_MAP: Record<string, string> = {
  // Level 1 rooms
  "alphabet-adventure": "alphabet_adventure_kids_l1.json",
  "colors-shapes": "colors_shapes_kids_l1.json",
  "numbers-counting": "numbers_counting_kids_l1.json",
  "opposites-matching": "opposites_matching_kids_l1.json",
  "body-parts-movement": "body_parts_movement_kids_l1.json",
  "feelings-emotions": "feelings_emotions_kids_l1.json",
  "first-action-verbs": "first_action_verbs_kids_l1.json",
  "size-comparison": "size_comparison_kids_l1\".json",
  "simple-questions": "simple_questions_kids_l1.json",
  "early-phonics": "early_phonics_sounds_kids_l1.json",
  "family-home": "family_home_words_kids_l1.json",
  "rooms-house": "rooms_in_the_house_kids_l1.json",
  "clothes-dressing": "clothes_dressing_kids_l1.json",
  "food-snacks": "food_snacks_kids_l1.json",
  "drinks-treats": "drinks_treats_kids_l1.json",
  "daily-routines": "daily_routines_kids_l1.json",
  "bedtime-words": "bedtime_words_kids_l1.json",
  "bathroom-hygiene": "bathroom_hygiene_kids_l1.json",
  "school-objects": "school_objects_kids_l1.json",
  "playground-words": "playground_words_kids_l1.json",
  "toys-playtime": "toys_playtime_kids_l1.json",
  "animals-sounds": "animals_sounds_kids_l1.json",
  "farm-animals": "farm_animals_kids_l1.json",
  "wild-animals": "wild_animals_kids_l1.json",
  "pets-caring": "pets_caring_kids_l1.json",
  "nature-explorers": "nature_explorers_kids_l1.json",
  "weather-kids": "weather_for_kids_l1.json",
  "colors-nature": "colors_nature_kids_l1.json",
  "magic-story": "magic_story_words_kids_l1.json",
  "make-believe": "make_believe_kids_l1.json",

  // Level 2 rooms
  "school-life": "school_life_vocabulary_kids_l2.json",
  "classroom-english": "classroom_english_kids_l2.json",
  "math-words": "math_words_kids_l2.json",
  "science-basics": "science_basics_kids_l2.json",
  "geography-basics": "geography_basics_kids_l2.json",
  "reading-skills": "reading_skills_kids_l2.json",
  "spelling-patterns": "spelling_patterns_kids_l2.json",
  "project-vocab": "project_vocabulary_kids_l2.json",
  "art-creativity": "art_creativity_words_kids_l2.json",
  "hobbies-fun": "hobbies_fun_activities_kids_l2.json",
  "games-sports": "games_sports_kids_l2.json",
  "friendship-kindness": "friendship_kindness_kids_l2.json",
  "social-skills": "social_skills_kids_l2.json",
  "community-helpers": "community_helpers_kids_l2.json",
  "safety-rules": "safety_rules_kids_l2\".json",
  "healthy-habits": "healthy_habits_kids_l2.json",
  "travel-transport": "travel_transport_kids_l2\".json",
  "daily-conversations": "daily_conversations_kids_l2.json",
  "weather-seasons": "weather_seasons_kids_l2.json",
  "space-planets": "space_planets_kids_l2.json",
  "animals-world": "animals_around_world_kids_l2.json",
  "experiments-vocab": "simple_experiments_vocabulary_kids_l2.json",
  "world-cultures": "world_cultures_kids_l2.json",
  "environment-nature": "environment_nature_kids_l2.json",
  "adventure-discovery": "adventure_discovery_words_kids_l2.json",
  "story-builder": "story_builder_kids_l2.json",
};

async function loadEntriesFromJson(roomId: string, levelId: string): Promise<KidsEntry[]> {
  const filenameFromMap = KIDS_ROOM_JSON_MAP[roomId];

  const fallbackFilename = `${roomId.replace(/-/g, "_")}_${levelId === "level1" ? "kids_l1" : levelId === "level2" ? "kids_l2" : "kids"}.json`;

  const filename = filenameFromMap || fallbackFilename;

  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      console.warn("KidsChat: JSON file not found for room", roomId, "->", filename);
      return [];
    }

    const json = await response.json();

    if (!json.entries || !Array.isArray(json.entries)) {
      console.warn("KidsChat: JSON entries missing or invalid for room", roomId);
      return [];
    }

    const entries: KidsEntry[] = json.entries.map((entry: any, index: number) => {
      let contentEn = "";
      let contentVi = "";

      if (entry.copy) {
        contentEn = entry.copy.en || "";
        contentVi = entry.copy.vi || "";
      } else if (entry.content) {
        contentEn = entry.content.en || "";
        contentVi = entry.content.vi || "";
      }

      let audioUrl = entry.audio || entry.audio_url || null;
      if (audioUrl && !String(audioUrl).startsWith("http")) {
        audioUrl = `/${audioUrl}`;
      }

      return {
        id: `${roomId}-${index + 1}`,
        content_en: contentEn,
        content_vi: contentVi,
        audio_url: audioUrl,
        display_order: index + 1,
      };
    });

    return entries;
  } catch (error) {
    console.error("KidsChat: Failed to load JSON for room", roomId, error);
    return [];
  }
}

const KidsChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [room, setRoom] = useState<KidsRoom | null>(null);
  const [entries, setEntries] = useState<KidsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<KidsEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      
      // Fetch room info
      const { data: roomData, error: roomError } = await supabase
        .from('kids_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);

      // Fetch entries from database first
      const { data: entriesData, error: entriesError } = await supabase
        .from('kids_entries')
        .select('*')
        .eq('room_id', roomId)
        .eq('is_active', true)
        .order('display_order');

      if (entriesError) throw entriesError;

      let finalEntries: KidsEntry[] = entriesData || [];

      // If database has no entries, fall back to static JSON file for this kids room
      if ((!entriesData || entriesData.length === 0) && roomId && roomData?.level_id) {
        const jsonEntries = await loadEntriesFromJson(roomId, roomData.level_id);
        finalEntries = jsonEntries;
      }

      setEntries(finalEntries);
      
      if (finalEntries.length > 0) {
        setSelectedEntry(finalEntries[0]);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      toast({
        title: "Error",
        description: "Failed to load room data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  const handleBack = () => {
    if (room?.level_id) {
      navigate(`/kids-${room.level_id}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Room not found / Không tìm thấy phòng</p>
        <Button onClick={() => navigate('/')}>Go Home / Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ColorfulMercyBladeHeader subtitle={`${room.title_en} / ${room.title_vi}`} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with back button */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back / Quay lại
          </Button>
          
          <Button
            variant="outline"
            onClick={fetchRoomData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Room title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{room.title_en}</h1>
          <p className="text-xl text-muted-foreground">{room.title_vi}</p>
        </div>

        {/* Entries grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedEntry?.id === entry.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedEntry(entry);
                setIsPlaying(false);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {entry.content_en.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Selected entry content */}
        {selectedEntry && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">English:</h3>
                <p className="text-lg leading-relaxed">{selectedEntry.content_en}</p>
              </div>

              {selectedEntry.audio_url && (
                <div className="border-t pt-4">
                  <AudioPlayer
                    audioPath={selectedEntry.audio_url}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tiếng Việt:</h3>
                <p className="text-lg leading-relaxed">{selectedEntry.content_vi}</p>
              </div>
            </div>
          </Card>
        )}

        {entries.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              No content available yet / Chưa có nội dung
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KidsChat;
