// src/components/analytics/PriorityDistributionChart.tsx
//
// FIX (TS18048): recharts `percent` can be undefined depending on label call context.
// Guard it and format safely.
// Also: remove unused imports (Tooltip) to keep the file clean.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type PriorityRow = { priority?: string | null };
type PieDatum = { name: string; value: number };

export function PriorityDistributionChart() {
  const { data: priorityData } = useQuery<PieDatum[]>({
    queryKey: ["feedback-priorities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("feedback").select("priority");
      if (error) throw error;

      const priorityMap = new Map<string, number>();
      (data as PriorityRow[] | null | undefined)?.forEach((feedback) => {
        const priority = String(feedback?.priority || "normal").trim() || "normal";
        priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
      });

      return Array.from(priorityMap.entries()).map(([name, value]) => ({ name, value }));
    },
  });

  const COLORS = {
    high: "hsl(var(--destructive))",
    normal: "hsl(var(--primary))",
    low: "hsl(var(--muted-foreground))",
  } as const;

  const chartConfig = {
    high: { label: "High", color: COLORS.high },
    normal: { label: "Normal", color: COLORS.normal },
    low: { label: "Low", color: COLORS.low },
  } as const;

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={priorityData || []}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const name = String(props?.name ?? "");
              const percentRaw = props?.percent;
              const percent = typeof percentRaw === "number" && Number.isFinite(percentRaw) ? percentRaw : 0;
              return `${name}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {(priorityData || []).map((entry) => {
              const key = String(entry?.name ?? "normal");
              const fill = (COLORS as any)[key] || COLORS.normal;
              return <Cell key={`cell-${key}`} fill={fill} />;
            })}
          </Pie>

          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}