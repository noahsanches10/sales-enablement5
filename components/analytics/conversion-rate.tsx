"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Lead } from "@/lib/types";
import { startOfMonth, format, eachMonthOfInterval, subMonths } from "date-fns";

interface ConversionRateChartProps {
  leads: Lead[];
}

export default function ConversionRateChart({ leads }: ConversionRateChartProps) {
  const data = useMemo(() => {
    const now = new Date();
    const monthsInterval = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    });

    return monthsInterval.map((date) => {
      const monthStart = startOfMonth(date);
      const monthLeads = leads.filter(
        (lead) => new Date(lead.createdAt) <= date &&
                 new Date(lead.createdAt) >= monthStart
      );
      
      const conversions = monthLeads.filter(
        (lead) => lead.convertedToCustomer &&
                 new Date(lead.convertedAt!) <= date &&
                 new Date(lead.convertedAt!) >= monthStart
      );

      const rate = monthLeads.length > 0
        ? (conversions.length / monthLeads.length) * 100
        : 0;

      return {
        name: format(date, "MMM"),
        value: parseFloat(rate.toFixed(1)),
      };
    });
  }, [leads]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ strokeWidth: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}