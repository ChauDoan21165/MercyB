import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  user_id: string;
  tier_id: string;
  amount: number;
  payment_method: string;
  status: string;
  external_reference: string | null;
  created_at: string;
  profiles?: {
    email: string;
    username: string;
  };
  subscription_tiers?: {
    name: string;
  };
}

interface SubscriptionChange {
  id: string;
  user_id: string;
  tier_id: string;
  status: string;
  created_at: string;
  profiles?: {
    email: string;
    username: string;
  };
  subscription_tiers?: {
    name: string;
  };
}

const PaymentMonitoring = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionChange[]>([]);
  const [stats, setStats] = useState({
    last24h: 0,
    last7d: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
  });

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

      await fetchPaymentData();
    } catch (error) {
      console.error('Error checking admin:', error);
      navigate('/');
    }
  };

  const fetchPaymentData = async () => {
    try {
      setLoading(true);

      // Fetch recent transactions (last 50)
      const { data: txnData, error: txnError } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          profiles:user_id (email, username),
          subscription_tiers:tier_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (txnError) throw txnError;
      setTransactions(txnData || []);

      // Fetch recent subscription changes
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          profiles:user_id (email, username),
          subscription_tiers:tier_id (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (subError) throw subError;
      setSubscriptions(subData || []);

      // Calculate statistics
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const last24hCount = txnData?.filter(t => 
        new Date(t.created_at) > yesterday && t.status === 'completed'
      ).length || 0;

      const last7dCount = txnData?.filter(t => 
        new Date(t.created_at) > weekAgo && t.status === 'completed'
      ).length || 0;

      const totalRevenue = txnData?.reduce((sum, t) => 
        t.status === 'completed' ? sum + Number(t.amount) : sum, 0
      ) || 0;

      const activeCount = subData?.filter(s => s.status === 'active').length || 0;

      setStats({
        last24h: last24hCount,
        last7d: last7dCount,
        totalRevenue,
        activeSubscriptions: activeCount,
      });

    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#000000' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>Payment Monitoring</h1>
            <p style={{ color: '#666666' }}>Track transactions, tier upgrades, and payment verification</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchPaymentData} 
              style={{ background: '#FFFFFF', color: '#000000', border: '1px solid #000000' }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/admin-stats')}
              style={{ background: '#FFFFFF', color: '#000000', border: '1px solid #000000' }}
            >
              ← Back to Admin
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold" style={{ color: '#000000' }}>Last 24 Hours</CardTitle>
              <Clock className="h-4 w-4" style={{ color: '#000000' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#000000' }}>{stats.last24h}</div>
              <p className="text-xs" style={{ color: '#666666' }}>Completed payments</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold" style={{ color: '#000000' }}>Last 7 Days</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: '#000000' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#000000' }}>{stats.last7d}</div>
              <p className="text-xs" style={{ color: '#666666' }}>Total transactions</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold" style={{ color: '#000000' }}>Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: '#000000' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#000000' }}>{formatAmount(stats.totalRevenue)}</div>
              <p className="text-xs" style={{ color: '#666666' }}>All-time earnings</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold" style={{ color: '#000000' }}>Active Subs</CardTitle>
              <Users className="h-4 w-4" style={{ color: '#000000' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#000000' }}>{stats.activeSubscriptions}</div>
              <p className="text-xs" style={{ color: '#666666' }}>Current subscribers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="mb-8" style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
          <CardHeader>
            <CardTitle className="font-bold" style={{ color: '#000000' }}>Recent Transactions (Last 50)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid #000000' }}>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Date</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>User</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Tier</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Amount</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Method</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Status</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} style={{ borderBottom: '1px solid #CCCCCC' }}>
                      <td className="p-2" style={{ color: '#000000' }}>{formatDate(txn.created_at)}</td>
                      <td className="p-2" style={{ color: '#000000' }}>
                        {txn.profiles?.email || txn.profiles?.username || 'N/A'}
                      </td>
                      <td className="p-2 font-bold" style={{ color: '#000000' }}>
                        {txn.subscription_tiers?.name || 'N/A'}
                      </td>
                      <td className="p-2 font-bold" style={{ color: '#000000' }}>{formatAmount(txn.amount)}</td>
                      <td className="p-2" style={{ color: '#000000' }}>{txn.payment_method}</td>
                      <td className="p-2">
                        {txn.status === 'completed' ? (
                          <span className="flex items-center gap-1" style={{ color: '#008000' }}>
                            <CheckCircle className="h-4 w-4" />
                            Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1" style={{ color: '#FF0000' }}>
                            <XCircle className="h-4 w-4" />
                            {txn.status}
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-mono text-xs" style={{ color: '#666666' }}>
                        {txn.external_reference || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="text-center py-8" style={{ color: '#666666' }}>
                  No transactions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscription Changes */}
        <Card style={{ background: '#FFFFFF', border: '1px solid #000000' }}>
          <CardHeader>
            <CardTitle className="font-bold" style={{ color: '#000000' }}>Recent Subscription Changes (Last 50)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '2px solid #000000' }}>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Date</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>User</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Tier</th>
                    <th className="text-left p-2 font-bold" style={{ color: '#000000' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #CCCCCC' }}>
                      <td className="p-2" style={{ color: '#000000' }}>{formatDate(sub.created_at)}</td>
                      <td className="p-2" style={{ color: '#000000' }}>
                        {sub.profiles?.email || sub.profiles?.username || 'N/A'}
                      </td>
                      <td className="p-2 font-bold" style={{ color: '#000000' }}>
                        {sub.subscription_tiers?.name || 'N/A'}
                      </td>
                      <td className="p-2">
                        {sub.status === 'active' ? (
                          <span className="flex items-center gap-1" style={{ color: '#008000' }}>
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1" style={{ color: '#666666' }}>
                            {sub.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscriptions.length === 0 && (
                <div className="text-center py-8" style={{ color: '#666666' }}>
                  No subscription changes found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMonitoring;