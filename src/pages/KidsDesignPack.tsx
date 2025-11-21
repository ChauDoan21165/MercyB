import { KidsImageGenerator } from '@/components/kids/KidsImageGenerator';
import { KidsDesignShowcase } from '@/components/kids/KidsDesignShowcase';
import { KidsRoomViewer } from '@/components/kids/KidsRoomViewer';
import { KidsAdminButton } from '@/components/kids/KidsAdminButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KidsDesignPack = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="w-full max-w-6xl mx-auto px-6 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent">
          Kids English Design Pack
        </h1>
        <KidsAdminButton />
      </div>
      
      <Tabs defaultValue="viewer" className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="viewer">Room Viewer</TabsTrigger>
            <TabsTrigger value="showcase">Design Showcase</TabsTrigger>
            <TabsTrigger value="generator">Generate Assets</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="viewer">
          <KidsRoomViewer />
        </TabsContent>
        
        <TabsContent value="showcase">
          <KidsDesignShowcase />
        </TabsContent>
        
        <TabsContent value="generator">
          <KidsImageGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KidsDesignPack;