import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from '@/hooks/useMatchmaking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const MatchmakingHub = () => {
  const navigate = useNavigate();
  const { 
    suggestions, 
    loading, 
    isVIP3, 
    generateSuggestions, 
    updateSuggestionStatus 
  } = useMatchmaking();

  useEffect(() => {
    if (!loading && !isVIP3) {
      toast.error('Matchmaking is only available for VIP3 members');
      navigate('/');
    }
  }, [loading, isVIP3, navigate]);

  const handleAccept = async (suggestionId: string) => {
    try {
      await updateSuggestionStatus(suggestionId, 'accepted');
      toast.success('Match accepted! You can now connect with this person.');
    } catch (error) {
      toast.error('Failed to accept match');
    }
  };

  const handleReject = async (suggestionId: string) => {
    try {
      await updateSuggestionStatus(suggestionId, 'rejected');
      toast.info('Match declined');
    } catch (error) {
      toast.error('Failed to reject match');
    }
  };

  const handleGenerate = async () => {
    try {
      toast.loading('Generating personalized matches...', { id: 'generate' });
      await generateSuggestions();
      toast.success('New matches generated!', { id: 'generate' });
    } catch (error) {
      toast.error('Failed to generate matches', { id: 'generate' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Matchmaking Hub</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered connections based on your interests, knowledge, and personality
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleGenerate} className="gap-2">
          <Sparkles className="w-4 h-4" />
          Generate New Matches
        </Button>
      </div>

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Click "Generate New Matches" to find people who share your interests
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {suggestion.suggested_user_profile?.full_name || 'Anonymous User'}
                    </CardTitle>
                    <CardDescription>
                      {suggestion.suggested_user_profile?.email}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    {(suggestion.match_score * 100).toFixed(0)}% Match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {suggestion.common_interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Common Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.common_interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestion.complementary_traits.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Complementary Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.complementary_traits.map((trait, idx) => (
                          <Badge key={idx} variant="secondary">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestion.match_reason && (
                    <div>
                      <h4 className="font-semibold mb-2">Why You Match</h4>
                      <p className="text-muted-foreground">
                        {JSON.stringify(suggestion.match_reason)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => handleAccept(suggestion.id)}
                      className="flex-1 gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      Accept Match
                    </Button>
                    <Button 
                      onClick={() => handleReject(suggestion.id)}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      Pass
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchmakingHub;
