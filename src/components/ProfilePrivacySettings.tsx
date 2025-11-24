import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ProfileVisibility = 'private' | 'vip3_only' | 'public';

export function ProfilePrivacySettings() {
  const [visibility, setVisibility] = useState<ProfileVisibility>('vip3_only');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_knowledge_profile')
        .select('profile_visibility')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setVisibility(data.profile_visibility || 'vip3_only');
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to load privacy settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_knowledge_profile')
        .upsert({
          user_id: user.id,
          profile_visibility: visibility,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Profile Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can see your knowledge profile, interests, and personality traits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as ProfileVisibility)}>
          <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="private" id="private" />
            <div className="flex-1">
              <Label htmlFor="private" className="flex items-center gap-2 font-medium cursor-pointer">
                <EyeOff className="h-4 w-4" />
                Private
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Only you can see your profile. Other users cannot view your interests or traits.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="vip3_only" id="vip3_only" />
            <div className="flex-1">
              <Label htmlFor="vip3_only" className="flex items-center gap-2 font-medium cursor-pointer">
                <Users className="h-4 w-4" />
                VIP3 Members Only
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Only VIP3 tier members can see your profile. Good for matchmaking within your tier.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="public" id="public" />
            <div className="flex-1">
              <Label htmlFor="public" className="flex items-center gap-2 font-medium cursor-pointer">
                <Eye className="h-4 w-4" />
                Public
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                All authenticated users can see your profile. Maximum visibility for networking.
              </p>
            </div>
          </div>
        </RadioGroup>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            What's Protected
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
            <li>Your interests and knowledge areas</li>
            <li>Completed topics and learning progress</li>
            <li>Personality traits and characteristics</li>
            <li>Matchmaking preferences</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>Note:</strong> Your username and avatar are always visible to VIP3 members for basic identification.
            Sensitive information like email and phone are never shared with other users.
          </p>
        </div>

        <Button 
          onClick={savePrivacySettings} 
          disabled={saving}
          className="w-full"
        >
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </CardContent>
    </Card>
  );
}
