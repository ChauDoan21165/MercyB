import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ResponseTimesChart() {
  const { data: responseData } = useQuery({
    queryKey: ["feedback-response-times"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("created_at, updated_at, status")
        .neq("status", "new");

      if (error) throw error;

      const statusMap = new Map<string, { total: number; count: number }>();

      data?.forEach((feedback) => {
        if (feedback.created_at && feedback.updated_at) {
          const created = new Date(feedback.created_at).getTime();
          const updated = new Date(feedback.updated_at).getTime();
          const hours = (updated - created) / (1000 * 60 * 60);
          
          const existing = statusMap.get(feedback.status!) || { total: 0, count: 0 };
          existing.total += hours;
          existing.count += 1;
          statusMap.set(feedback.status!, existing);
        }
      });

      return Array.from(statusMap.entries()).map(([status, { total, count }]) => ({
        status,
        avgHours: Math.round(total / count)
      }));
    }
  });

  const chartConfig = {
    avgHours: {
      label: "Avg Response Time (hours)",
      color: "hsl(var(--primary))"
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={responseData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="avgHours" fill="var(--color-avgHours)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
