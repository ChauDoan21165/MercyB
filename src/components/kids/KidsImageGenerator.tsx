import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Download } from 'lucide-react';

interface ImageAsset {
  name: string;
  prompt: string;
  category: string;
}

const KIDS_IMAGE_ASSETS: ImageAsset[] = [
  // Level Icons
  {
    name: "kids_level1_icon",
    prompt: "Cute smiling star character with soft pink and pastel colors, simple flat design icon for ages 4-7",
    category: "Level Icons"
  },
  {
    name: "kids_level2_icon",
    prompt: "Friendly rainbow bridge character with green and pastel colors, simple flat design icon for ages 7-10",
    category: "Level Icons"
  },
  {
    name: "kids_level3_icon",
    prompt: "Wise owl character with orange and warm colors, simple flat design icon for ages 10-13",
    category: "Level Icons"
  },
  
  // Mascots
  {
    name: "kids_mascot_explorer",
    prompt: "Cute cartoon explorer character with backpack and magnifying glass, soft pink theme, friendly face, suitable for ages 4-7",
    category: "Mascots"
  },
  {
    name: "kids_mascot_adventurer",
    prompt: "Energetic cartoon adventurer character with compass and map, green theme, excited expression, suitable for ages 7-10",
    category: "Mascots"
  },
  {
    name: "kids_mascot_thinker",
    prompt: "Smart cartoon thinker character with book and lightbulb, orange theme, thoughtful expression, suitable for ages 10-13",
    category: "Mascots"
  },

  // Progress Badges (Level 1)
  {
    name: "kids_badge_colors_shapes",
    prompt: "Colorful badge with rainbow circle and triangle shapes, cute star border, pink theme",
    category: "Progress Badges"
  },
  {
    name: "kids_badge_animals_sounds",
    prompt: "Badge with cute cartoon animals (dog, cat, bird) making sound waves, playful design",
    category: "Progress Badges"
  },
  {
    name: "kids_badge_my_family",
    prompt: "Warm badge with diverse family silhouettes holding hands in a circle, heart shapes",
    category: "Progress Badges"
  },

  // Background Elements
  {
    name: "kids_bg_stars",
    prompt: "Scattered cute smiling stars in pastel colors, transparent background, pattern design",
    category: "Background Elements"
  },
  {
    name: "kids_bg_clouds",
    prompt: "Fluffy cartoon clouds with happy faces, soft pastel colors, transparent background",
    category: "Background Elements"
  },
  {
    name: "kids_bg_rainbow",
    prompt: "Gentle rainbow arc with soft colors, sparkles and stars, transparent background",
    category: "Background Elements"
  },

  // Room Illustrations (Sample)
  {
    name: "kids_room_colors_shapes",
    prompt: "Colorful illustration showing various shapes and colors, crayons, paint palette, fun and educational",
    category: "Room Covers"
  },
  {
    name: "kids_room_animals_sounds",
    prompt: "Cute animals in a meadow making sounds, musical notes, friendly and playful scene",
    category: "Room Covers"
  },
  {
    name: "kids_room_daily_routines",
    prompt: "Clock with cute character doing daily activities, morning to night, colorful and organized",
    category: "Room Covers"
  }
];

export const KidsImageGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [currentAsset, setCurrentAsset] = useState<string>("");

  const generateImage = async (asset: ImageAsset) => {
    setCurrentAsset(asset.name);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-kids-image', {
        body: { 
          prompt: asset.prompt,
          style: "bright, cute, friendly, colorful illustration for kids, culturally neutral, rainbow theme, flat design with soft gradients"
        }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setGeneratedImages(prev => ({
          ...prev,
          [asset.name]: data.imageUrl
        }));
        toast.success(`Generated ${asset.name}`);
        return data.imageUrl;
      }
    } catch (error: any) {
      console.error(`Error generating ${asset.name}:`, error);
      toast.error(`Failed to generate ${asset.name}: ${error.message}`);
    }
  };

  const generateAllImages = async () => {
    setGenerating(true);
    
    for (const asset of KIDS_IMAGE_ASSETS) {
      await generateImage(asset);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setGenerating(false);
    setCurrentAsset("");
    toast.success("All images generated!");
  };

  const downloadImage = (name: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `${name}.png`;
    link.href = dataUrl;
    link.click();
  };

  const groupedAssets = KIDS_IMAGE_ASSETS.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, ImageAsset[]>);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Kids English Visual Assets</h2>
          <p className="text-muted-foreground mt-2">
            Generate a complete design pack for the Kids English area
          </p>
        </div>
        <Button
          onClick={generateAllImages}
          disabled={generating}
          size="lg"
          className="gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate All ({KIDS_IMAGE_ASSETS.length} images)</>
          )}
        </Button>
      </div>

      {generating && currentAsset && (
        <Card className="p-4 bg-muted/50 border-primary">
          <p className="text-sm text-foreground">
            Currently generating: <span className="font-semibold">{currentAsset}</span>
          </p>
        </Card>
      )}

      {Object.entries(groupedAssets).map(([category, assets]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <Card key={asset.name} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {asset.prompt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => generateImage(asset)}
                    disabled={generating}
                  >
                    {currentAsset === asset.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>

                {generatedImages[asset.name] && (
                  <div className="space-y-2">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={generatedImages[asset.name]}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => downloadImage(asset.name, generatedImages[asset.name])}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};