/**
 * ConversationList — left-rail picker for past Mercy threads.
 *
 * Loads the user's conversations on mount, sorts by last activity, and
 * provides a "New conversation" button + a search filter on title. The
 * parent owns the active selection (id), this component just emits
 * onSelect / onNew so the same list can be re-used in modal contexts.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  createConversation,
  listMyConversations,
  type MercyConversation,
} from "@/lib/mercy/conversationClient";

export type ConversationListProps = {
  /** Currently authenticated user id — required to scope reads + writes. */
  userId: string | null;
  /** Currently selected conversation id, or null for "new / none". */
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Optional: parent gets notified when a conversation is created. */
  onCreated?: (conversation: MercyConversation) => void;
  /**
   * Increment to force a refetch from the parent (e.g. after a delete in
   * ConversationThread cascades the row out from under us). The list also
   * refetches whenever userId changes.
   */
  refetchToken?: number;
};

const wrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  borderRight: "1px solid rgba(0,0,0,0.08)",
  background: "#fafafa",
  minWidth: 240,
};

const headerStyle: React.CSSProperties = {
  padding: "12px 12px 8px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  background: "white",
};

const newButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 9999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
  background: "#0f172a",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 9999,
  padding: "6px 12px",
  fontSize: 13,
  outline: "none",
};

const listStyle: React.CSSProperties = {
  flex: "1 1 auto",
  overflowY: "auto",
  padding: "8px 6px",
};

const itemStyle = (active: boolean): React.CSSProperties => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  background: active ? "#fff7ed" : "transparent",
  border: active ? "1px solid #fdba74" : "1px solid transparent",
  borderRadius: 10,
  padding: "8px 10px",
  marginBottom: 4,
  cursor: "pointer",
  fontSize: 13,
  lineHeight: 1.4,
  color: "#0f172a",
});

const itemMetaStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 11,
  color: "#64748b",
};

function formatLastActivity(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ConversationList({
  userId,
  activeId,
  onSelect,
  onCreated,
  refetchToken,
}: ConversationListProps) {
  const [items, setItems] = useState<MercyConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    listMyConversations(userId)
      .then((rows) => {
        if (!alive) return;
        setItems(rows);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load conversations.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId, refetchToken]);

  const handleNew = useCallback(async () => {
    if (!userId || creating) return;
    setError(null);
    setCreating(true);
    try {
      const conv = await createConversation(userId);
      setItems((prev) => [conv, ...prev]);
      onCreated?.(conv);
      onSelect(conv.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start a new conversation.");
    } finally {
      setCreating(false);
    }
  }, [userId, creating, onCreated, onSelect]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => (c.title ?? "").toLowerCase().includes(q));
  }, [items, search]);

  return (
    <aside style={wrapStyle} data-testid="conversation-list">
      <div style={headerStyle}>
        <button
          type="button"
          onClick={handleNew}
          style={newButtonStyle}
          disabled={!userId || creating}
          data-testid="new-conversation"
        >
          {creating ? "Creating…" : "+ New conversation"}
        </button>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          style={searchInputStyle}
          data-testid="conversation-search"
        />
      </div>

      <div style={listStyle}>
        {loading ? <div style={{ padding: 12, color: "#64748b", fontSize: 13 }}>Loading…</div> : null}

        {!loading && filtered.length === 0 ? (
          <div style={{ padding: 12, color: "#64748b", fontSize: 13 }}>
            {items.length === 0
              ? "No conversations yet. Click \"New conversation\" to start."
              : "No matches."}
          </div>
        ) : null}

        {filtered.map((c) => {
          const isActive = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              style={itemStyle(isActive)}
              onClick={() => onSelect(c.id)}
              data-testid="conversation-list-item"
              data-active={isActive ? "true" : "false"}
            >
              <span style={{ fontWeight: 700 }}>
                {c.title || "Untitled conversation"}
              </span>
              <span style={itemMetaStyle}>{formatLastActivity(c.lastMessageAt)}</span>
            </button>
          );
        })}

        {error ? (
          <div
            style={{
              margin: 12,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#991b1b",
              fontSize: 12,
            }}
            role="alert"
          >
            {error}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export default ConversationList;
