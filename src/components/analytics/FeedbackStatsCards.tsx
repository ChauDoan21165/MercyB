import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, AlertCircle, Clock, CheckCircle } from "lucide-react";

export function FeedbackStatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["feedback-stats"],
    queryFn: async () => {
      const [totalResult, highPriorityResult, pendingResult, resolvedResult] = await Promise.all([
        supabase.from("feedback").select("*", { count: "exact", head: true }),
        supabase.from("feedback").select("*", { count: "exact", head: true }).eq("priority", "high"),
        supabase.from("feedback").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("feedback").select("*", { count: "exact", head: true }).in("status", ["resolved", "closed"])
      ]);

      return {
        total: totalResult.count || 0,
        highPriority: highPriorityResult.count || 0,
        pending: pendingResult.count || 0,
        resolved: resolvedResult.count || 0
      };
    }
  });

  const cards = [
    {
      title: "Total Feedback",
      value: stats?.total || 0,
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      title: "High Priority",
      value: stats?.highPriority || 0,
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      title: "Resolved",
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: "text-green-500"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
