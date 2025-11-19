import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format, subDays } from "date-fns";

export function FeedbackTrendsChart() {
  const { data: trendData } = useQuery({
    queryKey: ["feedback-trends"],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from("feedback")
        .select("created_at, priority")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const dateMap = new Map<string, { date: string; count: number; high: number; normal: number; low: number }>();

      data?.forEach((feedback) => {
        const date = format(new Date(feedback.created_at!), "MMM dd");
        const existing = dateMap.get(date) || { date, count: 0, high: 0, normal: 0, low: 0 };
        existing.count++;
        if (feedback.priority === "high") existing.high++;
        else if (feedback.priority === "normal") existing.normal++;
        else if (feedback.priority === "low") existing.low++;
        dateMap.set(date, existing);
      });

      return Array.from(dateMap.values());
    }
  });

  const chartConfig = {
    count: {
      label: "Total",
      color: "hsl(var(--primary))"
    },
    high: {
      label: "High Priority",
      color: "hsl(var(--destructive))"
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} />
          <Line type="monotone" dataKey="high" stroke="var(--color-high)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
