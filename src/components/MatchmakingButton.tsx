// src/components/MatchmakingButton.tsx
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useUserAccess } from "@/hooks/useUserAccess";

export const MatchmakingButton = () => {
  const navigate = useNavigate();
  const access = useUserAccess();

  if (access.loading) return null;
  if (!access.canAccessVIP3) return null;

  return (
    <Button
      onClick={() => navigate("/matchmaking")}
      className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
    >
      <Heart className="w-4 h-4" />
      <span className="flex flex-col items-start">
        <span className="text-sm font-semibold">AI Matchmaking</span>
        <span className="text-xs opacity-90">Ghép Đôi AI</span>
      </span>
    </Button>
  );
};