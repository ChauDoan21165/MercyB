import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableRow, TableCell, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Clock, User, FileText, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_id: string | null;
  target_type: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          *,
          profiles!audit_logs_admin_id_fkey(email, full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = !filterAction || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action))).sort();

  const getActionColor = (action: string) => {
    if (action.includes("delete") || action.includes("ban") || action.includes("fraud")) {
      return "destructive";
    }
    if (action.includes("create") || action.includes("approve")) {
      return "default";
    }
    if (action.includes("edit") || action.includes("update")) {
      return "secondary";
    }
    return "outline";
  };

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-1">
            Track all admin actions and system changes
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action, target, or admin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterAction === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterAction(null)}
                >
                  All Actions
                </Button>
                {uniqueActions.slice(0, 5).map((action) => (
                  <Button
                    key={action}
                    variant={filterAction === action ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterAction(action)}
                  >
                    {action.split(".")[0]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">Total Actions Logged</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {new Set(logs.map((l) => l.admin_id)).size}
              </div>
              <p className="text-xs text-muted-foreground">Unique Admins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{uniqueActions.length}</div>
              <p className="text-xs text-muted-foreground">Action Types</p>
            </CardContent>
          </Card>
        </div>

        {/* Log Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Admin Actions ({filteredLogs.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading audit logs...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No audit logs found matching your filters
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="w-[160px]">Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge variant={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                {log.profiles?.full_name || "Unknown"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {log.profiles?.email || log.admin_id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {log.target_type && (
                            <>
                              <div className="text-sm font-medium">
                                {log.target_type}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {log.target_id?.slice(0, 16)}...
                              </div>
                            </>
                          )}
                        </TableCell>

                        <TableCell>
                          {log.metadata && Object.keys(log.metadata).length > 0 ? (
                            <details className="cursor-pointer">
                              <summary className="text-xs text-muted-foreground hover:text-foreground">
                                View metadata
                              </summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-2 max-w-[320px] overflow-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="text-xs font-mono text-muted-foreground">
                            {log.ip_address || "—"}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AuditLog;
