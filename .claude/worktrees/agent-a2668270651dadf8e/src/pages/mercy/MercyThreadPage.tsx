/**
 * /mercy — Multi-turn Mercy thread page (AI Teacher v2).
 *
 * Two-column layout:
 *   left: ConversationList (sidebar) — selectable past threads + "new" button
 *   right: ConversationThread — the active thread + composer
 *
 * On mobile (≤ 720 px) the sidebar collapses into a drawer toggled by a
 * hamburger button at the top-left of the page.
 *
 * Auth-required at the router layer (RequireAuth in AppRouter.tsx).
 * The page itself reads the current user via useAuth() and bails to a
 * generic "please sign in" fallback if the provider hasn't resolved yet.
 */

import React, { useCallback, useEffect, useState } from "react";

import { ConversationList } from "@/components/mercy/ConversationList";
import { ConversationThread } from "@/components/mercy/ConversationThread";
import { useAuth } from "@/providers/AuthProvider";

const MOBILE_BREAKPOINT_PX = 720;

const pageStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "calc(100vh - 64px)",
  minHeight: 540,
};

const titleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 12px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  background: "white",
};

const titleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: -0.2,
  color: "#0f172a",
};

const titleViStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  fontWeight: 500,
};

const layoutStyle: React.CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  minHeight: 0,
};

const sidebarDesktopStyle: React.CSSProperties = {
  width: 280,
  flex: "0 0 280px",
};

const sidebarDrawerStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: 280,
  zIndex: 1000,
  background: "white",
  transform: open ? "translateX(0)" : "translateX(-100%)",
  transition: "transform 180ms ease-out",
  boxShadow: open ? "2px 0 16px rgba(0,0,0,0.12)" : "none",
});

const drawerScrimStyle = (open: boolean): React.CSSProperties => ({
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.4)",
  zIndex: 999,
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 180ms ease-out",
});

const mainStyle: React.CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

const hamburgerStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 8,
  background: "white",
  padding: "6px 10px",
  fontSize: 14,
  cursor: "pointer",
};

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= MOBILE_BREAKPOINT_PX;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onResize() {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT_PX);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

export default function MercyThreadPage() {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [refetchToken, setRefetchToken] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // When the user clears the active conversation, drop the selection so
  // the right pane shows the empty state, and bump the list refetch.
  const handleCleared = useCallback(() => {
    setActiveId(null);
    setRefetchToken((x) => x + 1);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setDrawerOpen(false);
  }, []);

  if (isLoading) {
    return <div style={{ padding: 24, color: "#64748b" }}>Loading…</div>;
  }
  if (!user) {
    // Belt-and-suspenders — RequireAuth in the router should catch this,
    // but the page must not crash if it ever renders unauthenticated.
    return <div style={{ padding: 24 }}>Please sign in to use Teacher Mercy.</div>;
  }

  const list = (
    <ConversationList
      userId={user.id}
      activeId={activeId}
      onSelect={handleSelect}
      refetchToken={refetchToken}
    />
  );

  return (
    <div style={pageStyle} data-testid="mercy-thread-page">
      <div style={titleRowStyle}>
        {isMobile ? (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={hamburgerStyle}
            aria-label="Open conversation list"
            data-testid="mercy-drawer-toggle"
          >
            ☰
          </button>
        ) : null}
        <div>
          <div style={titleStyle}>Teacher Mercy</div>
          <div style={titleViStyle}>Trò chuyện cùng Teacher Mercy</div>
        </div>
      </div>

      <div style={layoutStyle}>
        {isMobile ? (
          <>
            <div
              style={drawerScrimStyle(drawerOpen)}
              onClick={() => setDrawerOpen(false)}
              aria-hidden
            />
            <div style={sidebarDrawerStyle(drawerOpen)}>{list}</div>
          </>
        ) : (
          <div style={sidebarDesktopStyle}>{list}</div>
        )}

        <div style={mainStyle}>
          <ConversationThread
            conversationId={activeId}
            onCleared={handleCleared}
          />
        </div>
      </div>
    </div>
  );
}
