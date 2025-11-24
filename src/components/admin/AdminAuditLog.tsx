import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Download, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  accessed_table: string;
  accessed_record_id: string | null;
  action: string;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_email?: string;
}

export function AdminAuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadAuditLogs();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('admin_audit_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_access_audit',
        },
        () => {
          loadAuditLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_access_audit')
        .select(`
          *,
          profiles!admin_access_audit_admin_user_id_fkey(email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const logsWithEmail = data?.map(log => ({
        ...log,
        admin_email: log.profiles?.email || 'Unknown',
      })) || [];

      setLogs(logsWithEmail);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Admin', 'Table', 'Action', 'Record ID'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toISOString(),
        log.admin_email,
        log.accessed_table,
        log.action,
        log.accessed_record_id || 'N/A',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter(log => 
    !filter || 
    log.admin_email?.toLowerCase().includes(filter.toLowerCase()) ||
    log.accessed_table.toLowerCase().includes(filter.toLowerCase()) ||
    log.action.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading audit logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Audit Log
        </CardTitle>
        <CardDescription>
          Track all admin access to sensitive data for security compliance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by admin, table, or action..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon" onClick={exportLogs}>
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No audit logs found
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{log.admin_email}</span>
                        <Badge variant="outline">{log.action}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accessed: <span className="font-mono">{log.accessed_table}</span>
                        {log.accessed_record_id && (
                          <span className="ml-2">
                            (ID: {log.accessed_record_id.substring(0, 8)}...)
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View metadata
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  )}

                  {(log.ip_address || log.user_agent) && (
                    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                      {log.ip_address && <p>IP: {log.ip_address}</p>}
                      {log.user_agent && (
                        <p className="truncate">User Agent: {log.user_agent}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Audit Log Retention</p>
          <p className="text-xs text-muted-foreground">
            Logs are retained for compliance and security monitoring. Access to payment data, 
            security events, and user profiles is tracked. Review regularly for suspicious patterns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
