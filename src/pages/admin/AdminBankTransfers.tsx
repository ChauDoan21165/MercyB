import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Check, X, RefreshCw, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface BankTransferOrder {
  id: string;
  user_id: string;
  amount_vnd: number;
  tier: string;
  transfer_note: string;
  screenshot_url: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
}

export default function AdminBankTransfers() {
  const [orders, setOrders] = useState<BankTransferOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<BankTransferOrder | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bank_transfer_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data ?? []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch bank transfer orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(orderId: string, action: "approve" | "reject") {
    setProcessing(true);
    try {
      const updates: Partial<BankTransferOrder> & { approved_at?: string } = {
        status: action === "approve" ? "approved" : "rejected",
      };

      if (action === "approve") {
        updates.approved_at = new Date().toISOString();
      } else {
        updates.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from("bank_transfer_orders")
        .update(updates)
        .eq("id", orderId);

      if (error) throw error;

      toast.success(`Order ${action === "approve" ? "approved" : "rejected"} successfully`);
      setSelectedOrder(null);
      setActionType(null);
      setRejectionReason("");
      fetchOrders();
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(`Failed to ${action} order`);
    } finally {
      setProcessing(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] ?? "secondary"}>{status}</Badge>;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bank Transfers</h1>
            <p className="text-muted-foreground">
              {pendingOrders.length} pending orders awaiting approval
            </p>
          </div>
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <Card className="border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-yellow-600">Pending Approval</CardTitle>
              <CardDescription>These orders require your review</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Transfer Note</TableHead>
                    <TableHead>Screenshot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(order.amount_vnd)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.tier}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {order.transfer_note}
                      </TableCell>
                      <TableCell>
                        {order.screenshot_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(order.screenshot_url!, "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActionType("approve");
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActionType("reject");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* All Orders */}
        <Card>
          <CardHeader>
            <CardTitle>All Bank Transfer Orders</CardTitle>
            <CardDescription>{orders.length} total orders</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {order.user_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(order.amount_vnd)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.tier}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedOrder && !!actionType} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Order" : "Reject Order"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the bank transfer and activate the user's subscription."
                : "Please provide a reason for rejecting this order."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "reject" && (
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() => selectedOrder && handleAction(selectedOrder.id, actionType!)}
              disabled={processing || (actionType === "reject" && !rejectionReason)}
            >
              {processing ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
