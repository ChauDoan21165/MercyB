import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide back button on homepage where there is no meaningful "back" destination
  if (location.pathname === "/") return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => navigate(-1)}
      className="fixed top-4 left-28 z-50 bg-background/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 border-2 hover:scale-105"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      <span className="font-semibold">Back</span>
    </Button>
  );
}
