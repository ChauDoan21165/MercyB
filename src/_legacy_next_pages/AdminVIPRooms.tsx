/**
 * MercyBlade Blue — AdminVIPRooms (Legacy compatibility page)
 * File: src/_legacy_next_pages/AdminVIPRooms.tsx
 * Version: MB-BLUE-94.0 — 2025-12-23 (+0700)
 *
 * FIX:
 * - Use Supabase-first truth (getAllRooms) from roomData
 * - Remove legacy ALL_ROOMS / getRoomList
 * - Keep page lightweight + search
 */

import { useEffect, useMemo, useState } from "react";
import { getAllRooms, type RoomInfo } from "@/lib/roomData";

export default function AdminVIPRooms() {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const list = await getAllRooms();
        if (!alive) return;

        setRooms(list);
      } catch (err: any) {
        if (!alive) return;
        setErrorMsg(err?.message ?? "Failed to load rooms");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rooms;

    return rooms.filter((r) => {
      const hay = [r.id, r.nameEn, r.nameVi].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [rooms, q]);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Admin — VIP Rooms</h1>

      <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search room id / name..."
          style={{
            width: "min(720px, 100%)",
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        />
        <span style={{ opacity: 0.7 }}>{filtered.length}</span>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Loading rooms…</p>}
      {!loading && errorMsg && <p style={{ marginTop: 16, color: "crimson" }}>{errorMsg}</p>}

      {!loading && !errorMsg && (
        <ul style={{ marginTop: 16, paddingLeft: 18 }}>
          {filtered.slice(0, 200).map((r) => (
            <li key={r.id} style={{ marginBottom: 6 }}>
              <code>{r.id}</code> — {r.nameEn || r.nameVi || "(no title)"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
