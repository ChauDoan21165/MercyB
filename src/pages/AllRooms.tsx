/**
 * Path: src/pages/AllRooms.tsx
 *
 * Legacy /rooms route. The product surface moved to /tiers; this
 * component exists only to redirect.
 *
 * Why window.location.replace and not react-router's useNavigate:
 *
 * The previous implementation called useNavigate("/tiers", { replace: true })
 * from a useEffect. That fires a second client-side navigation 0–50 ms
 * after the first one lands on /rooms. On a fast Chrome render the
 * /tiers route then mounts before React Router has fully settled
 * NavigationContext from the in-flight first transition. Any <Link>
 * rendered by TierIndex (or anything else on /tiers) destructures
 * `basename` from `useContext(NavigationContext)` and finds it null —
 * the exact crash captured in Sentry as MERCYBLADE-WEB-4.
 *
 * Using window.location.replace makes the second navigation a hard
 * reload. BrowserRouter remounts cleanly, NavigationContext is fresh,
 * and the rapid double-render race goes away. We lose the SPA
 * transition for this single stub route, but /rooms has no UI to
 * preserve anyway — it renders null and immediately redirects. The
 * end-user experience is identical.
 *
 * Do NOT swap this back to useNavigate. The hard reload is the fix.
 */

import { useEffect } from "react";

export default function AllRooms() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // .replace (not .assign) keeps /rooms out of the back-stack so the
    // browser Back button skips over the redirect, matching the
    // previous `{ replace: true }` semantics.
    window.location.replace("/tiers");
  }, []);

  return null;
}