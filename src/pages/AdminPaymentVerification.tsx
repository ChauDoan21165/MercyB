import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, XCircle, Loader2, ExternalLink, Bell } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { toast as sonnerToast } from "sonner";

interface PaymentSubmission {
  id: string;
  user_id: string;
  tier_id: string;
  screenshot_url: string;
  username: string;
  payment_method: string;
  extracted_transaction_id: string | null;
  extracted_amount: number | null;
  extracted_date: string | null;
  extracted_email: string | null;
  ocr_confidence: number | null;
  status: string;
  verification_method: string | null;
  admin_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string;
  subscription_tiers: {
    name: string;
    price_monthly: number;
  };
}

const AdminPaymentVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, loading: accessLoading } = useUserAccess();
  
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotes, setSelectedNotes] = useState<{ [key: string]: string }>({});
  const hasShownNotification = useRef(false);

  useEffect(() => {
    if (!accessLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, accessLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
    }
  }, [isAdmin]);

  // Real-time subscription for new payment submissions
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('payment-submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payment_proof_submissions'
        },
        (payload) => {
          console.log('New payment submission received:', payload);
          
          // Show notification only after initial load
          if (hasShownNotification.current) {
            sonnerToast.success('🔔 Thanh toán mới! / New Payment Received!', {
              description: `User: ${payload.new.username}`,
              duration: 10000,
            });
          }
          
          // Reload submissions to show the new one
          loadSubmissions();
        }
      )
      .subscribe();

    // Mark that initial load is complete after a short delay
    setTimeout(() => {
      hasShownNotification.current = true;
    }, 1000);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payment_proof_submissions')
        .select(`
          *,
          subscription_tiers (name, price_monthly)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user emails separately
      const submissionsWithEmails = await Promise.all((data || []).map(async (sub) => {
        const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id);
        return {
          ...sub,
          user_email: userData?.user?.email || 'N/A'
        };
      }));
      
      setSubmissions(submissionsWithEmails as any);
    } catch (error: any) {
      toast({
        title: "Error Loading Submissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string, userId: string, tierId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create subscription
      const { error: subError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          tier_id: tierId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (subError) throw subError;

      // Update submission status
      const { error: updateError } = await supabase
        .from('payment_proof_submissions')
        .update({
          status: 'admin_approved',
          verification_method: 'admin_manual',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          admin_notes: selectedNotes[submissionId] || null
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      toast({
        title: "✅ Payment Approved",
        description: "Subscription activated successfully",
      });

      loadSubmissions();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('payment_proof_submissions')
        .update({
          status: 'rejected',
          verification_method: 'admin_manual',
          verified_by: user.id,
          verified_at: new Date().toISOString(),
          admin_notes: selectedNotes[submissionId] || null
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast({
        title: "❌ Payment Rejected",
        description: "Submission marked as rejected",
      });

      loadSubmissions();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50">⏳ Pending</Badge>;
      case 'auto_approved':
        return <Badge variant="outline" className="bg-green-50">✅ Auto-Approved</Badge>;
      case 'admin_approved':
        return <Badge variant="outline" className="bg-blue-50">✅ Admin Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50">❌ Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (accessLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <h1 className="text-3xl font-bold mb-6">Payment Verification Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No payment submissions yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{submission.username}</h3>
                    <p className="text-sm text-muted-foreground">{submission.user_email}</p>
                  </div>
                  {getStatusBadge(submission.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">Tier</p>
                    <p className="text-sm">{submission.subscription_tiers?.name} - ${submission.subscription_tiers?.price_monthly}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Submitted</p>
                    <p className="text-sm">{new Date(submission.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {submission.ocr_confidence !== null && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-2">OCR Extracted Data (Confidence: {Math.round(submission.ocr_confidence * 100)}%)</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transaction ID:</span> {submission.extracted_transaction_id || 'N/A'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span> ${submission.extracted_amount || 'N/A'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span> {submission.extracted_date ? new Date(submission.extracted_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span> {submission.extracted_email || 'N/A'}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Screenshot</p>
                  <a 
                    href={submission.screenshot_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    View Screenshot <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {submission.status === 'pending' && (
                  <>
                    <div className="mb-4">
                      <Label className="text-sm font-semibold mb-2">Admin Notes (Optional)</Label>
                      <Textarea
                        value={selectedNotes[submission.id] || ''}
                        onChange={(e) => setSelectedNotes(prev => ({ ...prev, [submission.id]: e.target.value }))}
                        placeholder="Add notes about this verification..."
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(submission.id, submission.user_id, submission.tier_id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve & Activate
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(submission.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </>
                )}

                {submission.admin_notes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Admin Notes</p>
                    <p className="text-sm">{submission.admin_notes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentVerification;