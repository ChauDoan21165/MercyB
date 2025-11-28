import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Palette, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoomSpecification {
  id: string;
  name: string;
  description: string | null;
  use_color_theme: boolean;
  created_at: string;
}

export function RoomSpecificationManager() {
  const [specifications, setSpecifications] = useState<RoomSpecification[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [useColorTheme, setUseColorTheme] = useState(true);
  
  // Apply state
  const [selectedSpec, setSelectedSpec] = useState('');
  const [applyScope, setApplyScope] = useState<'room' | 'tier' | 'app'>('tier');
  const [targetId, setTargetId] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadSpecifications();
  }, []);

  const loadSpecifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('apply-room-specification', {
        body: { action: 'list' },
      });

      if (error) throw error;
      setSpecifications(data.specifications || []);
    } catch (error: any) {
      console.error('Error loading specifications:', error);
      toast.error('Failed to load specifications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpec = async () => {
    if (!name.trim()) {
      toast.error('Please enter a specification name');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('apply-room-specification', {
        body: {
          action: 'create',
          targetId: {
            name: name.trim(),
            description: description.trim() || null,
            use_color_theme: useColorTheme,
          },
        },
      });

      if (error) throw error;

      toast.success('Specification created successfully');
      setName('');
      setDescription('');
      setUseColorTheme(true);
      loadSpecifications();
    } catch (error: any) {
      console.error('Error creating specification:', error);
      toast.error('Failed to create specification');
    } finally {
      setCreating(false);
    }
  };

  const handleApplySpec = async () => {
    if (!selectedSpec) {
      toast.error('Please select a specification');
      return;
    }

    if (applyScope !== 'app' && !targetId.trim()) {
      toast.error(`Please enter a ${applyScope} ID`);
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase.functions.invoke('apply-room-specification', {
        body: {
          action: 'apply',
          specificationId: selectedSpec,
          scope: applyScope,
          targetId: applyScope === 'app' ? null : targetId.trim(),
        },
      });

      if (error) throw error;

      toast.success(`Specification applied to ${applyScope}${applyScope !== 'app' ? `: ${targetId}` : ''}`);
      setTargetId('');
    } catch (error: any) {
      console.error('Error applying specification:', error);
      toast.error('Failed to apply specification');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Room Specification Manager</h2>
      </div>

      {/* Create New Specification */}
      <Card className="p-6 bg-white border-2 border-black">
        <h3 className="text-xl font-bold mb-4">Create New Specification</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="spec-name" className="font-bold">Name</Label>
            <Input
              id="spec-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mercy Blade Colors"
              className="border-2 border-black"
            />
          </div>

          <div>
            <Label htmlFor="spec-description" className="font-bold">Description</Label>
            <Textarea
              id="spec-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of this visual specification..."
              className="border-2 border-black"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="use-color-theme"
              checked={useColorTheme}
              onCheckedChange={setUseColorTheme}
            />
            <Label htmlFor="use-color-theme" className="font-bold">
              Use Color Theme (Mercy Blade Colors)
            </Label>
          </div>

          <Button
            onClick={handleCreateSpec}
            disabled={creating}
            className="bg-black text-white hover:bg-gray-800 font-bold"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Specification'
            )}
          </Button>
        </div>
      </Card>

      {/* Apply Specification */}
      <Card className="p-6 bg-white border-2 border-black">
        <h3 className="text-xl font-bold mb-4">Apply Specification</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="select-spec" className="font-bold">Select Specification</Label>
            <Select value={selectedSpec} onValueChange={setSelectedSpec}>
              <SelectTrigger className="border-2 border-black">
                <SelectValue placeholder="Choose a specification" />
              </SelectTrigger>
              <SelectContent>
                {specifications.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.name} {spec.use_color_theme ? '(Color)' : '(B&W)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apply-scope" className="font-bold">Apply To</Label>
            <Select value={applyScope} onValueChange={(v: any) => setApplyScope(v)}>
              <SelectTrigger className="border-2 border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room">Individual Room</SelectItem>
                <SelectItem value="tier">Entire Tier</SelectItem>
                <SelectItem value="app">Whole App</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {applyScope !== 'app' && (
            <div>
              <Label htmlFor="target-id" className="font-bold">
                {applyScope === 'room' ? 'Room ID' : 'Tier Name'}
              </Label>
              <Input
                id="target-id"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder={applyScope === 'room' ? 'e.g., confidence-vip3' : 'e.g., vip3'}
                className="border-2 border-black"
              />
            </div>
          )}

          <Button
            onClick={handleApplySpec}
            disabled={applying}
            className="bg-black text-white hover:bg-gray-800 font-bold"
          >
            {applying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Apply Specification
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Existing Specifications */}
      <Card className="p-6 bg-white border-2 border-black">
        <h3 className="text-xl font-bold mb-4">Existing Specifications</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : specifications.length === 0 ? (
          <p className="text-gray-600">No specifications created yet.</p>
        ) : (
          <div className="space-y-3">
            {specifications.map((spec) => (
              <div
                key={spec.id}
                className="p-4 border-2 border-black rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{spec.name}</h4>
                    {spec.description && (
                      <p className="text-sm text-gray-600 mt-1">{spec.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        spec.use_color_theme 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {spec.use_color_theme ? 'Color Theme' : 'Black & White'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
