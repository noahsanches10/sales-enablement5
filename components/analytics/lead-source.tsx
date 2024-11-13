"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Lead } from "@/lib/types";

interface LeadSourceChartProps {
  leads: Lead[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function LeadSourceChart({ leads }: LeadSourceChartProps) {
  const data = useMemo(() => {
    const sources = leads.reduce((acc, lead) => {
      const source = lead.customerData?.source || "Direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sources).map(([name, value]) => ({
      name,
      value,
    }));
  }, [leads]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}