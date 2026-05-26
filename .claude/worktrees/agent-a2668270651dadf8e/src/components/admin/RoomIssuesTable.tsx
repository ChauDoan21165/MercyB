/**
 * L8 — Room Issues Table Component
 * Displays detected issues in a filterable table
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, XCircle, Wrench } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: string;
  message: string;
  details?: string;
}

interface RoomIssuesTableProps {
  issues: RoomIssue[];
  onFixIssue?: (issue: RoomIssue) => void;
}

export const RoomIssuesTable = ({ issues, onFixIssue }: RoomIssuesTableProps) => {
  const getSeverityBadge = (issueType: string) => {
    const critical = ['missing_file', 'invalid_json', 'no_entries'];
    const warning = ['missing_audio', 'locked', 'inactive'];
    
    if (critical.includes(issueType)) {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Critical
        </Badge>
      );
    } else if (warning.includes(issueType)) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Warning
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          <AlertCircle className="h-3 w-3 mr-1" />
          Info
        </Badge>
      );
    }
  };

  if (issues.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-green-600 mb-2">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-lg font-semibold">No Issues Found</p>
        <p className="text-sm text-muted-foreground mt-2">
          All rooms are healthy and ready to use
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <ScrollArea className="h-[600px]">
        <div className="divide-y">
          {issues.map((issue, idx) => (
            <div key={idx} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{issue.roomTitle}</span>
                    <Badge variant="outline" className="text-xs">
                      {issue.tier.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(issue.issueType)}
                    <span className="text-sm text-muted-foreground">
                      {issue.message}
                    </span>
                  </div>
                  
                  {issue.details && (
                    <p className="text-xs text-muted-foreground pl-4 border-l-2 border-muted">
                      {issue.details}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Room ID: <code className="bg-muted px-1 rounded">{issue.roomId}</code>
                  </p>
                </div>

                {onFixIssue && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFixIssue(issue)}
                    className="shrink-0"
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    Fix
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
