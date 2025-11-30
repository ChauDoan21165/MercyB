import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

export const UiHealthPanel = () => {
  const [uiIssues, setUiIssues] = useState<any[]>([]);

  useEffect(() => {
    const loadIssues = async () => {
      const { data } = await supabase
        .from('ui_health_issues')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      setUiIssues(data || []);
    };
    loadIssues();
    const interval = setInterval(loadIssues, 30000);
    return () => clearInterval(interval);
  }, []);

  if (uiIssues.length === 0) return null;

  return (
    <Card className="p-6 border-2 border-amber-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            UI / UX Issues
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Automated visual detection</p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">{uiIssues.length}</Badge>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {uiIssues.map((issue) => (
          <Card key={issue.id} className={`p-4 ${issue.severity === 'error' ? 'border-red-500/50' : 'border-amber-500/50'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {issue.severity === 'error' ? <XCircle className="h-5 w-5 text-red-500" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}
                  <h3 className="font-semibold">{issue.issue_type.replace(/_/g, ' ')}</h3>
                  <Badge variant={issue.severity === 'error' ? 'destructive' : 'outline'}>{issue.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Path: <code className="bg-muted px-2 py-1 rounded text-xs">{issue.path}</code></p>
                {issue.room_id && <p className="text-sm text-muted-foreground">Room: {issue.room_id}</p>}
                {issue.details?.measured_ratio && (
                  <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                    <p>Contrast: <span className="text-red-500 font-bold">{issue.details.measured_ratio}</span> (need 4.5)</p>
                  </div>
                )}
              </div>
              {issue.room_id && (
                <Link to={`/room/${issue.room_id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
