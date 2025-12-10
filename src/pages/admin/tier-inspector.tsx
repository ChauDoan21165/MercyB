// src/pages/admin/tier-inspector.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ---------- TYPES ----------
type RoomRow = {
  id: string;
  slug: string;
  title_en: string | null;
  tier: string | null;
  domain: string | null;
};

type TierColumns = Record<string, RoomRow[]>;

type DragState =
  | {
      roomId: string;
      fromTier: string;
    }
  | null;

type TierMapRow = {
  id: string;
  key: string;
  name: string | null;
  description: string | null;
  layout_json: any;
};

// Canonical tiers
const CANONICAL_TIERS: string[] = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip3ii",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
];

// Tier bucket: which column (Free / VIP1 / VIP2 / …)
const getTierBucket = (room: RoomRow): string => {
  const raw = room.tier ?? "";
  const key = raw.trim().toLowerCase();

  if (!key) return "Unknown / Broken";

  if (key === "free" || key.includes("free /")) return "free";

  if (key.startsWith("vip1")) return "vip1";
  if (key.startsWith("vip2")) return "vip2";
  if (key.includes("vip3ii") || key.includes("vip3 ii")) return "vip3ii";
  if (key.startsWith("vip3")) return "vip3";
  if (key.startsWith("vip4")) return "vip4";
  if (key.startsWith("vip5")) return "vip5";
  if (key.startsWith("vip6")) return "vip6";
  if (key.startsWith("vip7")) return "vip7";
  if (key.startsWith("vip8")) return "vip8";
  if (key.startsWith("vip9")) return "vip9";

  return "Unknown / Broken";
};

// ---------- SAFE SORTING ----------
const roomSortKey = (room: RoomRow) =>
  (room.slug || room.title_en || "").toLowerCase();

// ---------- LANE DETECTION (English / Core / Life) ----------
const getLane = (room: RoomRow): "english" | "core" | "life" => {
  const d = (room.domain || "").trim().toLowerCase();
  const slug = (room.slug || "").trim().toLowerCase();
  const title = (room.title_en || "").trim().toLowerCase();

  // 1) Domain overrides everything
  if (d === "english") return "english";
  if (d === "life") return "life";
  if (d === "core") return "core";

  // 2) English detection
  if (
    slug.includes("english") ||
    slug.includes("ielts") ||
    slug.includes("toeic") ||
    slug.includes("toefl") ||
    slug.includes("grammar") ||
    slug.startsWith("eng-") ||
    title.includes("english")
  ) {
    return "english";
  }

  // 3) Life Skill detection — FIXED: removed stray ||
  if (
    slug.includes("safety") ||
    slug.includes("survival") ||
    slug.includes("life-skill") ||
    slug.includes("life_skill") ||
    slug.includes("emergency") ||
    slug.includes("first-aid") ||
    slug.includes("first_aid") ||
    slug.includes("fire") ||
    title.includes("survival") ||
    title.includes("safety")
  ) {
    return "life";
  }

  // 4) Everything else → Core
  return "core";
};

const TierInspectorPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [columns, setColumns] = useState<TierColumns>({});
  const [dragState, setDragState] = useState<DragState>(null);

  // ---------- LOAD ROOMS ----------
  const roomsQuery = useQuery({
    queryKey: ["tier-inspector-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("id, slug, title_en, tier, domain")
        .order("slug", { ascending: true });

      if (error) throw error;
      return (data ?? []) as RoomRow[];
    },
  });

  // ---------- UPDATE TIER ----------
  const updateTierMutation = useMutation({
    mutationFn: async ({
      roomId,
      newTier,
    }: {
      roomId: string;
      newTier: string;
    }) => {
      const { error } = await supabase
        .from("rooms")
        .update({ tier: newTier })
        .eq("id", roomId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tier-inspector-rooms"] });
    },
  });

  // ---------- BUILD COLUMNS WITH SAFE SORTING ----------
  useEffect(() => {
    if (!roomsQuery.data) return;

    const next: TierColumns = {};
    CANONICAL_TIERS.forEach((t) => (next[t] = []));
    next["Unknown / Broken"] = [];

    roomsQuery.data.forEach((room) => {
      const bucket = getTierBucket(room);
      next[bucket].push(room);
    });

    // Sort every tier column safely
    for (const key of Object.keys(next)) {
      next[key].sort((a, b) =>
        roomSortKey(a).localeCompare(roomSortKey(b))
      );
    }

    setColumns(next);
  }, [roomsQuery.data]);

  const tierList = useMemo(() => {
    const base = [...CANONICAL_TIERS, "Unknown / Broken"];
    return base.filter((t) => (columns[t] ?? []).length > 0);
  }, [columns]);

  const startDrag = (roomId: string, fromTier: string) => {
    setDragState({ roomId, fromTier });
  };

  const cancelDrag = () => setDragState(null);

  const handleDropOnTier = async (targetTier: string) => {
    if (!dragState) return;
    const { roomId, fromTier } = dragState;
    if (fromTier === targetTier) return cancelDrag();

    const room = columns[fromTier]?.find((r) => r.id === roomId);
    if (!room) return cancelDrag();

    // Optimistic update
    setColumns((prev) => {
      const next: TierColumns = {};
      for (const [tierKey, rooms] of Object.entries(prev)) {
        if (tierKey === fromTier) {
          next[tierKey] = rooms.filter((r) => r.id !== roomId);
        } else {
          next[tierKey] = [...rooms];
        }
      }
      const updated: RoomRow = { ...room, tier: targetTier };
      if (!next[targetTier]) next[targetTier] = [];
      next[targetTier].push(updated);

      // Keep alphabetical order after drop
      next[targetTier].sort((a, b) =>
        roomSortKey(a).localeCompare(roomSortKey(b))
      );

      return next;
    });

    cancelDrag();

    toast({
      title: "Updating tier…",
      description: `${room.slug} → ${targetTier}`,
    });

    try {
      await updateTierMutation.mutateAsync({ roomId, newTier: targetTier });
      toast({
        title: "Success",
        description: `${room.slug} moved to ${targetTier}`,
      });
    } catch {
      toast({
        title: "Failed",
        description: "Reverting…",
        variant: "destructive",
      });
      roomsQuery.refetch();
    }
  };

  // ---------- TIER MAP SNAPSHOT ----------
  const tierMapQuery = useQuery({
    queryKey: ["tier-inspector-map", "live"],
    queryFn: async (): Promise<TierMapRow | null> => {
      const { data, error } = await supabase
        .from("tier_maps")
        .select("id, key, name, description, layout_json")
        .eq("key", "live")
        .maybeSingle();
      if (error) throw error;
      return (data as TierMapRow) ?? null;
    },
  });

  // ---------- RENDER ----------
  if (roomsQuery.isLoading) return <div className="p-6">Loading rooms…</div>;
  if (roomsQuery.isError) return <div className="p-6 text-red-500">Failed to load rooms.</div>;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              Tier Inspector — Fix ACCESS tiers by dragging
            </h1>
            <p className="text-xs text-muted-foreground">
              Edits <strong>rooms.tier</strong> — controls who can access what.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Total: {roomsQuery.data?.length ?? 0}</Badge>
          <Button
            size="icon"
            variant="outline"
            onClick={() => roomsQuery.refetch()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TIER MAP SNAPSHOT */}
      <Card className="border-dashed border-2 border-sky-300 bg-sky-50/40 dark:bg-sky-950/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Tier Map Designer — LIVE snapshot
          </CardTitle>
          <p className="text-[11px] text-muted-foreground">
            Reads from <code>tier_maps</code> (key = "live")
          </p>
        </CardHeader>
        <CardContent>
          {tierMapQuery.data ? (
            <pre className="text-[11px] font-mono bg-black/90 text-green-200 rounded-md p-2 max-h-48 overflow-auto">
              {JSON.stringify(tierMapQuery.data.layout_json ?? {}, null, 2)}
            </pre>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              No live tier_map found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* TIERS WITH 3 LANES */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
        {tierList.map((tier) => {
          const rooms = columns[tier] ?? [];
          const isUnknown = tier === "Unknown / Broken";

          return (
            <Card
              key={tier}
              className={`flex flex-col min-h-[280px] ${
                isUnknown ? "border-red-300 bg-red-50/40 dark:bg-red-950/20" : ""
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropOnTier(tier);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm font-semibold">{tier}</CardTitle>
                  <Badge
                    variant={isUnknown ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {rooms.length}
                  </Badge>
                </div>
                {isUnknown && (
                  <p className="mt-1 text-[10px] text-red-600 dark:text-red-300">
                    Drag these to the correct tier.
                  </p>
                )}
              </CardHeader>

              {/* 3 LANE LAYOUT */}
              <CardContent className="flex-1 overflow-hidden pt-0">
                <div className="grid grid-cols-3 gap-2 h-[380px]">
                  {[
                    { key: "english" as const, label: "English Center" },
                    { key: "core" as const, label: "Core (all topics)" },
                    { key: "life" as const, label: "Life Skill" },
                  ].map((lane) => {
                    let laneRooms = rooms.filter((r) => getLane(r) === lane.key);

                    // SAFE SORTING inside each lane
                    laneRooms = [...laneRooms].sort((a, b) =>
                      roomSortKey(a).localeCompare(roomSortKey(b))
                    );

                    return (
                      <div key={lane.key} className="flex flex-col min-w-0">
                        <div className="text-[10px] font-semibold text-muted-foreground mb-1 px-1 truncate">
                          {lane.label} ({laneRooms.length})
                        </div>
                        <ScrollArea className="h-[360px] overflow-y-auto pr-1">
                          <div className="space-y-1">
                            {laneRooms.map((room) => (
                              <div
                                key={room.id}
                                className="rounded-md border bg-background px-2 py-1.5 text-[11px] cursor-move hover:bg-muted flex flex-col"
                                draggable
                                onDragStart={() => startDrag(room.id, tier)}
                                onDragEnd={cancelDrag}
                              >
                                <span className="font-medium truncate">
                                  {room.slug}
                                </span>
                                {room.title_en && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {room.title_en}
                                  </span>
                                )}
                                {room.tier &&
                                  room.tier.toLowerCase() !==
                                    tier.toLowerCase() && (
                                    <span className="mt-0.5 text-[9px] text-amber-600">
                                      DB tier: {room.tier}
                                    </span>
                                  )}
                              </div>
                            ))}
                            {laneRooms.length === 0 && (
                              <p className="text-[10px] text-muted-foreground italic">
                                Empty
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TierInspectorPage;