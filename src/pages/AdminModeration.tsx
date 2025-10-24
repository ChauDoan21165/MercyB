import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, DollarSign, MessageSquare, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ModerationViolation {
  id: string;
  user_id: string;
  violation_type: string;
  message_content: string;
  room_id: string;
  severity_level: number;
  action_taken: string;
  created_at: string;
}

interface PaymentSubmission {
  id: string;
  user_id: string;
  username: string;
  extracted_email: string;
  extracted_amount: number;
  status: string;
  tier_id: string;
  screenshot_url: string;
  created_at: string;
  subscription_tiers?: { name: string };
}

interface FeedbackMessage {
  id: string;
  user_id: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminModeration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState<ModerationViolation[]>([]);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMessage[]>([]);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in');
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (!roles || roles.length === 0) {
        toast.error('Access denied - Admin only');
        navigate('/');
        return;
      }

      await Promise.all([
        fetchViolations(),
        fetchPayments(),
        fetchFeedback()
      ]);
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const fetchViolations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_moderation_violations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setViolations(data || []);
    } catch (error) {
      console.error('Error fetching violations:', error);
      toast.error('Failed to load violations');
    }
  };

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_proof_submissions')
        .select(`
          *,
          subscription_tiers (name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payment_proof_submissions')
        .update({ status: 'approved' })
        .eq('id', paymentId);

      if (error) throw error;
      
      toast.success('Payment approved');
      await fetchPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payment_proof_submissions')
        .update({ status: 'rejected' })
        .eq('id', paymentId);

      if (error) throw error;
      
      toast.success('Payment rejected');
      await fetchPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--gradient-admin)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">User Moderation</h1>
            <p className="text-muted-foreground">Manage violations, payments, and feedback</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/stats')}>
            ← Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="violations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="violations">
              <Ban className="w-4 h-4 mr-2" />
              Violations ({violations.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              <DollarSign className="w-4 h-4 mr-2" />
              Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback ({feedback.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="violations" className="space-y-4">
            {violations.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">No violations found</p>
                </CardContent>
              </Card>
            ) : (
              violations.map((violation) => (
                <Card key={violation.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">User: {violation.user_id.substring(0, 8)}...</span>
                      <Badge variant={violation.severity_level >= 3 ? 'destructive' : 'secondary'}>
                        Severity: {violation.severity_level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <p className="font-medium">{violation.violation_type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action:</span>
                        <p className="font-medium">{violation.action_taken}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Room:</span>
                        <p className="font-medium">{violation.room_id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">
                          {format(new Date(violation.created_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-muted-foreground">Message:</span>
                      <p className="mt-1 p-3 bg-muted rounded">{violation.message_content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">No pending payments</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{payment.username}</span>
                      <Badge>{payment.subscription_tiers?.name || 'Unknown Tier'}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{payment.extracted_email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <p className="font-medium">${payment.extracted_amount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">
                          {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                    {payment.screenshot_url && (
                      <div>
                        <span className="text-muted-foreground">Screenshot:</span>
                        <img 
                          src={payment.screenshot_url} 
                          alt="Payment proof" 
                          className="mt-2 max-w-md rounded border"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprovePayment(payment.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectPayment(payment.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {feedback.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">No feedback messages</p>
                </CardContent>
              </Card>
            ) : (
              feedback.map((fb) => (
                <Card key={fb.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">User: {fb.user_id.substring(0, 8)}...</span>
                      <Badge variant={fb.status === 'resolved' ? 'default' : 'secondary'}>
                        {fb.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-2">
                      {format(new Date(fb.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                    <p className="p-3 bg-muted rounded">{fb.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminModeration;
