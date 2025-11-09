import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AudioTester } from "@/components/AudioTester";

const AudioTestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <AudioTester />
      </div>
    </div>
  );
};

export default AudioTestPage;
