import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { Check, X, RefreshCw, Eye, Image } from "lucide-react";
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

export default function AdminPaymentVerification() {
  const [submissions, setSubmissions] = useState<PaymentProofSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentProofSubmission | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
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

  async function handleAction(submissionId: string, action: "approve" | "reject") {
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

      toast.success(`Submission ${action === "approve" ? "approved" : "rejected"} successfully`);
      setSelectedSubmission(null);
      setActionType(null);
      setAdminNotes("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error processing submission:", error);
      toast.error(`Failed to ${action} submission`);
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

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payment Verification</h1>
            <p className="text-muted-foreground">
              {pendingSubmissions.length} pending submissions awaiting verification
            </p>
          </div>
          <Button variant="outline" onClick={fetchSubmissions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Pending Submissions */}
        {pendingSubmissions.length > 0 && (
          <Card className="border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-yellow-600">Pending Verification</CardTitle>
              <CardDescription>Review payment screenshots and verify</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>OCR Confidence</TableHead>
                    <TableHead>Extracted Amount</TableHead>
                    <TableHead>Screenshot</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.tier_id.slice(0, 8)}</Badge>
                      </TableCell>
                      <TableCell>{submission.payment_method}</TableCell>
                      <TableCell>
                        {submission.ocr_confidence !== null
                          ? `${(submission.ocr_confidence * 100).toFixed(0)}%`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {submission.extracted_amount !== null
                          ? new Intl.NumberFormat("vi-VN").format(submission.extracted_amount)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setImagePreview(submission.screenshot_url)}
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {format(new Date(submission.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setActionType("approve");
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedSubmission(submission);
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

        {/* All Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>All Payment Submissions</CardTitle>
            <CardDescription>{submissions.length} total submissions</CardDescription>
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
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-mono text-xs">
                          {submission.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium">{submission.username}</TableCell>
                        <TableCell>{submission.payment_method}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          {format(new Date(submission.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setImagePreview(submission.screenshot_url)}
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
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedSubmission && !!actionType} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Submission" : "Reject Submission"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the payment and activate the user's subscription."
                : "Please provide a reason for rejecting this submission."}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder={actionType === "approve" ? "Optional notes..." : "Enter rejection reason..."}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={() => selectedSubmission && handleAction(selectedSubmission.id, actionType!)}
              disabled={processing || (actionType === "reject" && !adminNotes)}
            >
              {processing ? "Processing..." : actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
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
    </AdminLayout>
  );
}
