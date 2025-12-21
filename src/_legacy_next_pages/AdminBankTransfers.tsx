import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminLevel } from "@/hooks/useAdminLevel";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";

interface BankTransferOrder {
  id: string;
  user_id: string;
  user_email?: string;
  tier: string;
  amount_vnd: number;
  transfer_note: string;
  status: "pending" | "approved" | "rejected" | "expired";
  screenshot_url?: string;
  created_at: string;
  rejection_reason?: string;
}

const AdminBankTransfers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading: adminLoading, adminInfo, canEditSystem } = useAdminLevel();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<BankTransferOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<BankTransferOrder | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!adminLoading) {
      if (!adminInfo || !canEditSystem) {
        toast({ title: "Access denied", description: "Level 9+ required", variant: "destructive" });
        navigate("/admin");
        return;
      }
      fetchOrders();
    }
  }, [adminLoading, adminInfo, canEditSystem]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.refreshSession();
      const token = sessionData?.session?.access_token;

      const { data } = await supabase.functions.invoke("bank-transfer-orders", {
        body: { action: "list-all", status: statusFilter },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.ok && data.orders) {
        setOrders(data.orders);
      } else {
        toast({ title: "Error", description: data?.error || "Failed to fetch orders", variant: "destructive" });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!adminLoading && adminInfo && canEditSystem) {
      fetchOrders();
    }
  }, [statusFilter]);

  async function handleApprove(order: BankTransferOrder) {
    setProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.refreshSession();
      const token = sessionData?.session?.access_token;

      const { data } = await supabase.functions.invoke("bank-transfer-orders", {
        body: { action: "approve", order_id: order.id },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to approve", variant: "destructive" });
        return;
      }

      toast({ title: "Approved!", description: `${order.user_email} now has ${order.tier} access.` });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Failed to approve order", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  }

  async function handleReject() {
    if (!selectedOrder) return;
    setProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.refreshSession();
      const token = sessionData?.session?.access_token;

      const { data } = await supabase.functions.invoke("bank-transfer-orders", {
        body: { action: "reject", order_id: selectedOrder.id, reason: rejectReason },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.ok) {
        toast({ title: "Error", description: data?.error || "Failed to reject", variant: "destructive" });
        return;
      }

      toast({ title: "Rejected", description: "Order has been rejected." });
      setShowRejectDialog(false);
      setSelectedOrder(null);
      setRejectReason("");
      fetchOrders();
    } catch (err) {
      toast({ title: "Error", description: "Failed to reject order", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#FFFFFF]">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bank Transfer Orders</h1>
                <p className="text-gray-600">Review and approve Techcombank payments</p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={fetchOrders}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No {statusFilter === "all" ? "" : statusFilter} orders found.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.user_email}</p>
                            <p className="text-sm text-gray-500">
                              {order.tier} • {order.amount_vnd.toLocaleString()} VND
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.created_at).toLocaleString()} • Note: <code className="bg-gray-100 px-1 rounded">{order.transfer_note}</code>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          {order.screenshot_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={order.screenshot_url} target="_blank" rel="noreferrer">
                                <ImageIcon className="w-4 h-4 mr-1" />
                                Screenshot
                              </a>
                            </Button>
                          )}
                          {order.status === "pending" && (
                            <Button size="sm" onClick={() => setSelectedOrder(order)}>
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedOrder && !showRejectDialog} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Bank Transfer</DialogTitle>
            <DialogDescription>
              Verify the payment and approve or reject.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">User</Label>
                  <p className="font-medium">{selectedOrder.user_email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Tier</Label>
                  <p className="font-medium">{selectedOrder.tier}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Amount</Label>
                  <p className="font-bold text-green-600">{selectedOrder.amount_vnd.toLocaleString()} VND</p>
                </div>
                <div>
                  <Label className="text-gray-500">Transfer Note</Label>
                  <code className="bg-gray-100 px-2 py-1 rounded block">{selectedOrder.transfer_note}</code>
                </div>
              </div>

              {selectedOrder.screenshot_url ? (
                <div>
                  <Label className="text-gray-500">Screenshot</Label>
                  <a href={selectedOrder.screenshot_url} target="_blank" rel="noreferrer" className="block mt-1">
                    <img 
                      src={selectedOrder.screenshot_url} 
                      alt="Payment screenshot" 
                      className="w-full max-h-64 object-contain border rounded-lg"
                    />
                  </a>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-lg text-yellow-700 text-sm">
                  ⚠️ No screenshot uploaded yet
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p className="font-medium">Techcombank Account:</p>
                <p>CT TNHH NT HANOI ARTS FOR YOUTH</p>
                <p>Account: 5577 57</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowRejectDialog(true)}
              disabled={processing}
            >
              Reject
            </Button>
            <Button 
              onClick={() => selectedOrder && handleApprove(selectedOrder)}
              disabled={processing}
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Approve & Grant VIP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection (will be shown to user).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AdminBankTransfers;
