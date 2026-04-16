/**
 * Path: src/pages/AllRooms.tsx
 * File: AllRooms.tsx
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllRooms() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tiers/level0?area=english", { replace: true });
  }, [navigate]);

  return null;
}