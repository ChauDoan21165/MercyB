import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function PriorityDistributionChart() {
  const { data: priorityData } = useQuery({
    queryKey: ["feedback-priorities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("priority");

      if (error) throw error;

      const priorityMap = new Map<string, number>();
      data?.forEach((feedback) => {
        const priority = feedback.priority || "normal";
        priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
      });

      return Array.from(priorityMap.entries()).map(([name, value]) => ({ name, value }));
    }
  });

  const COLORS = {
    high: "hsl(var(--destructive))",
    normal: "hsl(var(--primary))",
    low: "hsl(var(--muted-foreground))"
  };

  const chartConfig = {
    high: { label: "High", color: COLORS.high },
    normal: { label: "Normal", color: COLORS.normal },
    low: { label: "Low", color: COLORS.low }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={priorityData || []}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {priorityData?.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.normal} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
