import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { format } from "date-fns";

interface SystemLog {
  id: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  route: string | null;
  user_id: string | null;
  metadata: any;
  created_at: string;
}

const SystemLogs = () => {
  const [filter, setFilter] = useState<"all" | "error" | "warn">("all");

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["system-logs", filter],
    queryFn: async () => {
      let query = supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filter !== "all") {
        query = query.eq("level", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SystemLog[];
    },
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: "destructive" as const,
      warn: "default" as const,
      info: "secondary" as const,
      debug: "outline" as const,
    };
    return (
      <Badge variant={variants[level as keyof typeof variants] || "secondary"}>
        {level}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                View application errors and warnings from production
              </CardDescription>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
            >
              All Logs
            </Button>
            <Button
              onClick={() => setFilter("error")}
              variant={filter === "error" ? "default" : "outline"}
              size="sm"
            >
              Errors Only
            </Button>
            <Button
              onClick={() => setFilter("warn")}
              variant={filter === "warn" ? "default" : "outline"}
              size="sm"
            >
              Warnings Only
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs found. System is running smoothly! 🎉
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {logs.map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="flex items-start gap-3">
                      {getLevelIcon(log.level)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getLevelBadge(log.level)}
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "PPpp")}
                          </span>
                          {log.route && (
                            <Badge variant="outline" className="text-xs">
                              {log.route}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{log.message}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View metadata
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogs;
