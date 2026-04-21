import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMetrics from "./AdminMetrics";
import AdminBillingDashboard from "./AdminBillingDashboard";

type TabId = "overview" | "billing";

interface AdminMetricsPageProps {
  defaultTab?: TabId;
}

export default function AdminMetricsPage({
  defaultTab = "overview",
}: AdminMetricsPageProps) {
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
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="h-auto">
          <TabsTrigger value="overview">Overview (VND)</TabsTrigger>
          <TabsTrigger value="billing">Stripe Billing (USD)</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <AdminMetrics />
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <AdminBillingDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
