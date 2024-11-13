"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Campaign } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MousePointerClick, UserCheck, Users } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CampaignMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
}

export default function CampaignMetricsDialog({
  open,
  onOpenChange,
  campaign,
}: CampaignMetricsDialogProps) {
  const metrics = campaign.metrics || {
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
  };

  // Sample data - in a real app, this would come from your backend
  const chartData = [
    { name: "Mon", sent: 20, opened: 15, clicked: 8, converted: 2 },
    { name: "Tue", sent: 25, opened: 18, clicked: 10, converted: 3 },
    { name: "Wed", sent: 30, opened: 22, clicked: 12, converted: 4 },
    { name: "Thu", sent: 22, opened: 16, clicked: 9, converted: 2 },
    { name: "Fri", sent: 28, opened: 20, clicked: 11, converted: 3 },
  ];

  const cards = [
    {
      title: "Total Sent",
      value: metrics.sent,
      icon: Mail,
      description: metrics.lastSent
        ? `Last sent ${format(new Date(metrics.lastSent), "MMM d, yyyy")}`
        : "No sends yet",
    },
    {
      title: "Open Rate",
      value: `${((metrics.opened / metrics.sent) * 100 || 0).toFixed(1)}%`,
      icon: Users,
      description: `${metrics.opened} opens`,
    },
    {
      title: "Click Rate",
      value: `${((metrics.clicked / metrics.opened) * 100 || 0).toFixed(1)}%`,
      icon: MousePointerClick,
      description: `${metrics.clicked} clicks`,
    },
    {
      title: "Conversion Rate",
      value: `${((metrics.converted / metrics.clicked) * 100 || 0).toFixed(1)}%`,
      icon: UserCheck,
      description: `${metrics.converted} conversions`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Campaign Metrics - {campaign.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sent"
                      stroke="hsl(var(--primary))"
                      name="Sent"
                    />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      stroke="hsl(var(--chart-1))"
                      name="Opened"
                    />
                    <Line
                      type="monotone"
                      dataKey="clicked"
                      stroke="hsl(var(--chart-2))"
                      name="Clicked"
                    />
                    <Line
                      type="monotone"
                      dataKey="converted"
                      stroke="hsl(var(--chart-3))"
                      name="Converted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}