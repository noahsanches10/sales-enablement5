"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Lead, Stage } from "@/lib/types";

interface LeadsByStageChartProps {
  leads: Lead[];
}

export default function LeadsByStageChart({ leads }: LeadsByStageChartProps) {
  const data = useMemo(() => {
    const stages: Stage[] = [
      "New Lead",
      "Qualified",
      "Proposal Sent",
      "Negotiation",
      "Closed-Won",
      "Closed-Lost",
    ];

    return stages.map((stage) => ({
      name: stage,
      value: leads.filter((lead) => lead.stage === stage).length,
    }));
  }, [leads]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}