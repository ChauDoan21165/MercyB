import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { useToast } from "@/hooks/use-toast";
import { AudioPlayer } from "@/components/AudioPlayer";
import { HighlightedContent } from "@/components/HighlightedContent";
import { MessageActions } from "@/components/MessageActions";
import { useUserAccess } from "@/hooks/useUserAccess";
import { User, Copy, ChevronDown, ChevronUp } from "lucide-react";

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

interface UserProfile {
  username: string | null;
  full_name: string | null;
}

interface KidsSubscription {
  level_id: string;
  kids_levels: {
    name_en: string;
    name_vi: string;
    color_theme: string;
  };
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
  const { isAdmin } = useUserAccess();
  const [room, setRoom] = useState<KidsRoom | null>(null);
  const [entries, setEntries] = useState<KidsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<KidsEntry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubscription, setUserSubscription] = useState<KidsSubscription | null>(null);
  const [roomsExplored, setRoomsExplored] = useState<number>(0);
  const [showRoomSpec, setShowRoomSpec] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Fetch user subscription with level info
      const { data: subscription } = await supabase
        .from('kids_subscriptions')
        .select(`
          level_id,
          kids_levels (
            name_en,
            name_vi,
            color_theme
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscription) {
        setUserSubscription(subscription as any);
      }

      // Count unique rooms explored
      const { data: analytics } = await supabase
        .from('room_usage_analytics')
        .select('room_id')
        .eq('user_id', user.id);

      if (analytics) {
        const uniqueRooms = new Set(analytics.map(a => a.room_id));
        setRoomsExplored(uniqueRooms.size);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
    fetchUserData();
  }, []);

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

  const handleKeywordClick = (entry: KidsEntry, index: number) => {
    setSelectedEntry(entry);
    setClickedIndex(index);
    setIsPlaying(false);
    setCurrentAudio(entry.audio_url);
    // Scroll to bottom to show the new content
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCopyEssay = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${lang} essay copied to clipboard`,
    });
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
      <div className="border-b">
        <div className="container mx-auto px-4 py-2 max-w-6xl flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back / Quay lại
          </Button>
          
          <ColorfulMercyBladeHeader subtitle={`${room.title_en} / ${room.title_vi}`} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRoomData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-3 max-w-6xl space-y-3">
        {/* User Profile Info */}
        {userProfile && (
          <Card className="p-3 bg-card border border-border">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {userProfile.full_name || userProfile.username || 'Student'}
                  </p>
                  {userSubscription && (
                    <p className="text-xs text-muted-foreground">
                      {userSubscription.kids_levels.name_en} / {userSubscription.kids_levels.name_vi}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{roomsExplored} rooms explored</p>
                <p className="text-xs text-muted-foreground">{roomsExplored} phòng đã khám phá</p>
              </div>
            </div>
          </Card>
        )}

        {/* Room Specification Card */}
        {room && isAdmin && (
          <Card className="p-4 bg-card border border-border">
            <button
              onClick={() => setShowRoomSpec(!showRoomSpec)}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="font-semibold text-foreground">
                🔧 Room Specification & Documentation / Tài liệu kỹ thuật phòng
              </h3>
              {showRoomSpec ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {showRoomSpec && (
              <div className="mt-4 space-y-6">
                {/* Basic Information */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary border-b border-border pb-1">
                    📋 Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Room ID:</span>
                      <p className="font-mono text-foreground">{room.id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Level ID:</span>
                      <p className="font-mono text-foreground">{room.level_id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Display Order:</span>
                      <p className="font-mono text-foreground">{room.display_order}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-mono text-foreground">
                        {room.is_active ? '✅ Active' : '❌ Inactive'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">JSON File:</span>
                      <p className="font-mono text-xs text-foreground break-all">
                        {KIDS_ROOM_JSON_MAP[room.id] || `${room.id.replace(/-/g, "_")}_${room.level_id === "level1" ? "kids_l1" : "kids_l2"}.json`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Design Specifications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary border-b border-border pb-1">
                    🎨 Design Specifications
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Title (EN):</span>
                      <p className="text-foreground">{room.title_en}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Title (VN):</span>
                      <p className="text-foreground">{room.title_vi}</p>
                    </div>
                    {room.icon && (
                      <div>
                        <span className="text-muted-foreground">Icon:</span>
                        <p className="text-foreground">{room.icon}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Functional Specifications */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary border-b border-border pb-1">
                    ⚙️ Functional Specifications
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-semibold">Purpose:</span>
                      <p className="text-foreground mt-1">
                        Kids learning room for {room.level_id === "level1" ? "beginners (ages 3-6)" : "intermediate learners (ages 7-11)"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold">Core Features:</span>
                      <ul className="list-disc list-inside text-foreground mt-1 space-y-1">
                        <li>Interactive keyword-based navigation buttons</li>
                        <li>Bilingual content (English/Vietnamese)</li>
                        <li>Audio playback with shadowing practice</li>
                        <li>Highlighted keywords in content</li>
                        <li>Copy & share functionality</li>
                        <li>Admin tools for content management</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold">Content Standards:</span>
                      <ul className="list-disc list-inside text-foreground mt-1 space-y-1">
                        <li>VIP3 Mercy Blade standard applied</li>
                        <li>JSON-based entry system</li>
                        <li>Database fallback support</li>
                        <li>Audio files linked per entry</li>
                        <li>Sequential display_order system</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Content Descriptions */}
                {(room.description_en || room.description_vi) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-primary border-b border-border pb-1">
                      📝 Content Descriptions
                    </h4>
                    
                    {room.description_en && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground text-sm">English Description:</span>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                            {room.description_en}
                          </p>
                        </div>
                      </div>
                    )}

                    {room.description_vi && (
                      <div className="space-y-2">
                        <span className="text-muted-foreground text-sm">Vietnamese Description:</span>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                            {room.description_vi}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Copy Buttons */}
                    <div className="flex gap-2 flex-wrap pt-2">
                      {room.description_en && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyEssay(room.description_en!, "English")}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-3 w-3" />
                          Copy EN Description
                        </Button>
                      )}
                      {room.description_vi && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyEssay(room.description_vi!, "Vietnamese")}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-3 w-3" />
                          Copy VN Description
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Notes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary border-b border-border pb-1">
                    🔍 Technical Implementation Notes
                  </h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-muted-foreground font-semibold">Data Source Priority:</span>
                      <ol className="list-decimal list-inside text-foreground mt-1">
                        <li>Database (kids_entries table)</li>
                        <li>Static JSON files (fallback)</li>
                      </ol>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold">Audio Path Convention:</span>
                      <p className="text-foreground mt-1 font-mono text-xs">
                        /audio/{`{filename}`}.mp3
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold">Entry ID Format:</span>
                      <p className="text-foreground mt-1 font-mono text-xs">
                        {`{room_id}`}-{`{index}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(room.created_at!).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last Updated: {new Date(room.updated_at!).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Room title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            {isAdmin && roomId && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    toast({
                      title: "Copied!",
                      description: `Room ID: ${roomId}`,
                    });
                  }}
                  className="w-[1em] h-[1em] rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy Room ID"
                />
                <button
                  type="button"
                  onClick={() => {
                    const filenameFromMap = KIDS_ROOM_JSON_MAP[roomId];
                    const fallbackFilename = `${roomId.replace(/-/g, "_")}_${room?.level_id === "level1" ? "kids_l1" : room?.level_id === "level2" ? "kids_l2" : "kids"}.json`;
                    const filename = filenameFromMap || fallbackFilename;
                    navigator.clipboard.writeText(filename);
                    toast({
                      title: "Copied!",
                      description: `JSON: ${filename}`,
                    });
                  }}
                  className="w-[1em] h-[1em] rounded-full bg-primary hover:bg-primary/90 cursor-pointer flex-shrink-0 transition-colors"
                  title="Copy JSON filename"
                />
              </>
            )}
            <h2 className="text-lg font-semibold" style={{
              background: 'var(--gradient-rainbow)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {room.title_en} / {room.title_vi}
            </h2>
          </div>
        </div>

        {/* Welcome Card with Keyword Buttons */}
        <Card className="p-4 shadow-soft bg-card border border-border">
          <div className="text-center space-y-3 mb-4">
            <p className="text-sm text-foreground leading-tight">
              Welcome! Click on any topic below to start learning. / Chào mừng! Nhấp vào bất kỳ chủ đề nào bên dưới để bắt đầu học.
            </p>
          </div>

          {entries.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {entries.map((entry, index) => {
                const isClicked = clickedIndex === index;
                // Extract first few words for button label
                const labelEn = entry.content_en.split(' ').slice(0, 3).join(' ') + '...';
                const labelVi = entry.content_vi.split(' ').slice(0, 3).join(' ') + '...';
                
                return (
                  <Button
                    key={entry.id}
                    variant={isClicked ? "default" : "outline"}
                    size="sm"
                    className="text-xs cursor-pointer"
                    onClick={() => handleKeywordClick(entry, index)}
                  >
                    {isAdmin && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const audioFile = entry.audio_url;
                          if (!audioFile) {
                            toast({ title: "No audio", description: "This entry has no audio filename" });
                            return;
                          }
                          // Automatically add /audio/ prefix if not already present
                          const out = audioFile.startsWith('/audio/') 
                            ? audioFile 
                            : `/audio/${audioFile.replace(/^\//, '')}`;
                          navigator.clipboard.writeText(out);
                          toast({ title: "Copied!", description: `Audio: ${out}` });
                        }}
                        className="inline-flex w-[1em] h-[1em] rounded-full bg-destructive hover:bg-destructive/90 mr-2 align-middle cursor-pointer"
                        title="Copy audio filename"
                      />
                    )}
                    {index + 1}. {labelEn} / {labelVi}
                  </Button>
                );
              })}
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No content available yet / Chưa có nội dung
              </p>
            </div>
          )}
        </Card>

        {/* Main Content Area - VIP3 Style */}
        <Card className="p-4 shadow-soft bg-card border border-border">
          <ScrollArea className="h-[560px] pr-4" ref={scrollRef}>
            {!selectedEntry ? (
              <div className="flex items-center justify-center text-center py-8 h-full">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Click a topic button to start</p>
                  <p className="text-sm text-muted-foreground">Nhấp vào nút chủ đề để bắt đầu</p>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="rounded-2xl px-6 py-4 bg-card border shadow-sm">
                  {/* English content with highlighting */}
                  <div className="mb-3">
                    <div className="text-sm leading-relaxed">
                      <HighlightedContent content={selectedEntry.content_en} />
                    </div>
                  </div>

                  {/* Shadowing reminder and Audio Player - Right below English */}
                  {selectedEntry.audio_url && (
                    <div className="my-3">
                      <p className="text-xs text-muted-foreground italic mb-2 text-center">
                        💡 Try shadowing: Listen and repeat along with the audio to improve your pronunciation and fluency. / 💡 Hãy thử bóng: Nghe và lặp lại cùng với âm thanh để cải thiện phát âm và sự trôi chảy của bạn.
                      </p>
                      <div className="flex items-center gap-2">
                        <AudioPlayer
                          audioPath={selectedEntry.audio_url}
                          isPlaying={currentAudio === selectedEntry.audio_url && isPlaying}
                          onPlayPause={handleAudioToggle}
                          onEnded={() => {
                            setIsPlaying(false);
                            setCurrentAudio(null);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Vietnamese content with highlighting */}
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <div className="text-sm leading-relaxed">
                      <HighlightedContent content={selectedEntry.content_vi} />
                    </div>
                    <div className="mt-3">
                      <MessageActions 
                        text={selectedEntry.content_en} 
                        viText={selectedEntry.content_vi} 
                        roomId={roomId || ""} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default KidsChat;
