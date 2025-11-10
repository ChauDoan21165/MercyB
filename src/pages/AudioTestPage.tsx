import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioTester } from "@/components/AudioTester";
import { AudioPathTester } from "@/components/AudioPathTester";

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
        
        <Tabs defaultValue="path-tester" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="path-tester">Path Tester</TabsTrigger>
            <TabsTrigger value="vip4-tester">VIP4 Rooms</TabsTrigger>
          </TabsList>
          <TabsContent value="path-tester">
            <AudioPathTester />
          </TabsContent>
          <TabsContent value="vip4-tester">
            <AudioTester />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AudioTestPage;
