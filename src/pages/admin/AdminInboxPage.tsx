import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMonitoring from "./AdminMonitoring";
import AdminFeedbackPage from "./AdminFeedbackPage";

type TabId = "monitoring" | "feedback";

interface AdminInboxPageProps {
  defaultTab?: TabId;
}

export default function AdminInboxPage({
  defaultTab = "monitoring",
}: AdminInboxPageProps) {
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
          <TabsTrigger value="monitoring">Live Streams</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Inbox</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="mt-4">
          <AdminMonitoring />
        </TabsContent>
        <TabsContent value="feedback" className="mt-4">
          <AdminFeedbackPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
