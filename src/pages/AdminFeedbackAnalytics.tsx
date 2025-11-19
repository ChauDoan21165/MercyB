import { Card } from "@/components/ui/card";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Navigate } from "react-router-dom";
import { FeedbackTrendsChart } from "@/components/analytics/FeedbackTrendsChart";
import { CategoryDistributionChart } from "@/components/analytics/CategoryDistributionChart";
import { PriorityDistributionChart } from "@/components/analytics/PriorityDistributionChart";
import { ResponseTimesChart } from "@/components/analytics/ResponseTimesChart";
import { FeedbackStatsCards } from "@/components/analytics/FeedbackStatsCards";

export default function AdminFeedbackAnalytics() {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feedback Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into user feedback trends and patterns
        </p>
      </div>

      <FeedbackStatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Feedback Trends</h2>
          <FeedbackTrendsChart />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Priority Distribution</h2>
          <PriorityDistributionChart />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <CategoryDistributionChart />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Average Response Times</h2>
          <ResponseTimesChart />
        </Card>
      </div>
    </div>
  );
}
