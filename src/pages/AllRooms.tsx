/**
 * Path: src/pages/AllRooms.tsx
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllRooms() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tiers", { replace: true });
  }, [navigate]);

  return null;
}