// src/pages/AllRooms.tsx
// SAFE REDIRECT VERSION
//
// Reason:
// Old room structure lives in /tiers.
// The placeholder Rooms hub replaced the real browsing path.
// This restores correct behavior.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllRooms() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tiers", { replace: true });
  }, [navigate]);

  return null;
}