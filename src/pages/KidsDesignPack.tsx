import { KidsImageGenerator } from '@/components/kids/KidsImageGenerator';
import { KidsDesignShowcase } from '@/components/kids/KidsDesignShowcase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KidsDesignPack = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <Tabs defaultValue="showcase" className="w-full">
        <div className="w-full max-w-6xl mx-auto px-6 mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="showcase">Design Showcase</TabsTrigger>
            <TabsTrigger value="generator">Generate Assets</TabsTrigger>
          </TabsList>
        </div>
        
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