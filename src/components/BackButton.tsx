import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ROOT_PATHS = ["/", "/admin"];

export function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Hide back button on root pages where there is no meaningful "back" destination
  if (ROOT_PATHS.includes(pathname)) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="hover:bg-accent"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      <span className="font-medium">Back</span>
    </Button>
  );
}
