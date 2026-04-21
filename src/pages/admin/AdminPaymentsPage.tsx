import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import {
  Check,
  Download,
  Eye,
  Image as ImageIcon,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

type TabId = "transactions" | "verify";

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function statusBadge(
  status: string,
  mapping: Record<string, "default" | "secondary" | "destructive" | "outline"> = {},
) {
  const variant = mapping[status] ?? "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}

interface AdminPaymentsPageProps {
  defaultTab?: TabId;
}

export default function AdminPaymentsPage({
  defaultTab = "transactions",
}: AdminPaymentsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab") as TabId | null;
  const [tab, setTab] = useState<TabId>(urlTab ?? defaultTab);

  const handleTabChange = (next: string) => {
    const nextTab = next as TabId;
    setTab(nextTab);
    searchParams.set("tab", nextTab);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">
            Transactions and payment verification in one place.
          </p>
        </div>

        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="h-auto">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="verify">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <TransactionsTab />
          </TabsContent>
          <TabsContent value="verify" className="mt-6">
            <VerificationTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

/* -------------------- Transactions -------------------- */

interface PaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_type: string;
  created_at: string;
  external_reference: string | null;
}

function TransactionsTab() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    void fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      setTransactions(data ?? []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payment_method.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{filtered.length} transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchTransactions}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
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
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">
                      {t.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {t.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatVnd(t.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.payment_method}</Badge>
                    </TableCell>
                    <TableCell>{t.transaction_type}</TableCell>
                    <TableCell>
                      {statusBadge(t.status, {
                        completed: "default",
                        pending: "secondary",
                        failed: "destructive",
                        refunded: "outline",
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(t.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------- Verification -------------------- */

interface PaymentProofSubmission {
  id: string;
  user_id: string;
  username: string;
  tier_id: string;
  screenshot_url: string;
  payment_method: string;
  status: string;
  admin_notes: string | null;
  ocr_confidence: number | null;
  extracted_amount: number | null;
  created_at: string;
}

function VerificationTab() {
  const [submissions, setSubmissions] = useState<PaymentProofSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PaymentProofSubmission | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    void fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_proof_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSubmissions(data ?? []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch payment submissions");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(
    submissionId: string,
    action: "approve" | "reject",
  ) {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("payment_proof_submissions")
        .update({
          status: action === "approve" ? "approved" : "rejected",
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
        })
        .eq("id", submissionId);
      if (error) throw error;
      toast.success(
        `Submission ${action === "approve" ? "approved" : "rejected"} successfully`,
      );
      setSelected(null);
      setActionType(null);
      setAdminNotes("");
      void fetchSubmissions();
    } catch (error) {
      console.error("Error processing submission:", error);
      toast.error(`Failed to ${action} submission`);
    } finally {
      setProcessing(false);
    }
  }

  const pending = submissions.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pending.length} pending submissions awaiting verification
        </p>
        <Button variant="outline" onClick={fetchSubmissions}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {pending.length > 0 && (
        <Card className="border-yellow-500/50">
          <CardHeader>
            <CardTitle className="text-yellow-600">
              Pending Verification
            </CardTitle>
            <CardDescription>Review payment screenshots and verify</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>OCR</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Screenshot</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.username}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {submission.tier_id.slice(0, 8)}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.payment_method}</TableCell>
                    <TableCell>
                      {submission.ocr_confidence !== null
                        ? `${(submission.ocr_confidence * 100).toFixed(0)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {submission.extracted_amount !== null
                        ? new Intl.NumberFormat("vi-VN").format(
                            submission.extracted_amount,
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImagePreview(submission.screenshot_url)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(submission.created_at),
                        "MMM d, yyyy HH:mm",
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelected(submission);
                            setActionType("approve");
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelected(submission);
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

      <Card>
        <CardHeader>
          <CardTitle>All Payment Submissions</CardTitle>
          <CardDescription>
            {submissions.length} total submissions
          </CardDescription>
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
                  <TableHead>Username</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-xs">
                        {submission.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.username}
                      </TableCell>
                      <TableCell>{submission.payment_method}</TableCell>
                      <TableCell>
                        {statusBadge(submission.status, {
                          approved: "default",
                          pending: "secondary",
                          rejected: "destructive",
                        })}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(submission.created_at),
                          "MMM d, yyyy HH:mm",
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setImagePreview(submission.screenshot_url)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selected && !!actionType}
        onOpenChange={() => setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Submission"
                : "Reject Submission"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the payment and activate the user's subscription."
                : "Please provide a reason for rejecting this submission."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={
              actionType === "approve"
                ? "Optional notes..."
                : "Enter rejection reason..."
            }
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() =>
                selected && handleAction(selected.id, actionType!)
              }
              disabled={
                processing || (actionType === "reject" && !adminNotes)
              }
            >
              {processing
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!imagePreview} onOpenChange={() => setImagePreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Payment proof"
                className="max-h-[70vh] rounded-lg object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
