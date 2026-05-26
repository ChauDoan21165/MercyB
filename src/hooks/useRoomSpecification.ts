// src/hooks/useRoomSpecification.ts
// MB-BLUE-97.9 — 2025-12-29 (+0700)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type RoomSpecTheme = "color" | "bw";

type SpecRow = {
  id: string;
  name: string;
  description: string | null;
  use_color_theme: boolean;
};

type AssignmentRow = {
  scope: "room" | "tier" | "app" | string;
  target_id: string | null;
  specification_id: string | null;
};

type SpecResult = {
  specification: SpecRow | null;
  scope: "room" | "tier" | "app" | null;
};

function normId(x: string | undefined | null) {
  return String(x || "").trim().toLowerCase();
}

export function useRoomSpecification(opts: {
  roomId?: string;
  tierId?: string;
}) {
  const roomId = normId(opts.roomId);
  const tierId = normId(opts.tierId);

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<RoomSpecTheme>("color"); // default: Mercy Blade rainbow
  const [specName, setSpecName] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);

      try {
        // Pull all assignments once, then pick winner by priority: room > tier > app
        const { data: assignments, error: aErr } = await supabase
          .from("room_specification_assignments")
          .select("scope,target_id,specification_id");

        if (aErr) throw aErr;

        const list = (assignments || []) as AssignmentRow[];

        const pick =
          list.find((x) => x.scope === "room" && normId(x.target_id) === roomId) ||
          list.find((x) => x.scope === "tier" && normId(x.target_id) === tierId) ||
          list.find((x) => x.scope === "app");

        if (!pick?.specification_id) {
          if (!alive) return;
          setTheme("color");
          setSpecName(null);
          return;
        }

        const { data: spec, error: sErr } = await supabase
          .from("room_specifications")
          .select("id,name,description,use_color_theme")
          .eq("id", pick.specification_id)
          .maybeSingle();

        if (sErr) throw sErr;

        if (!alive) return;

        const resolved = (spec || null) as SpecRow | null;

        setTheme(resolved?.use_color_theme ? "color" : "bw");
        setSpecName(resolved?.name || null);
      } catch (e) {
        // Fail-safe: never break the room UI just because spec fetch failed.
        if (!alive) return;
        setTheme("color");
        setSpecName(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    // Only run when we have at least roomId or tierId (roomId usually always exists)
    run();

    return () => {
      alive = false;
    };
  }, [roomId, tierId]);

  return { loading, theme, specName };
}
