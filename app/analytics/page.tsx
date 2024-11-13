"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads, getActivities } from "@/lib/storage";
import { Lead } from "@/lib/types";
import { Users, Target, TrendingUp, DollarSign, Calendar } from "lucide-react";
import LeadsByStageChart from "@/components/analytics/leads-by-stage";
import ConversionRateChart from "@/components/analytics/conversion-rate";
import LeadSourceChart from "@/components/analytics/lead-source";
import ActivityTimeline from "@/components/analytics/activity-timeline";
import { calculateMetrics } from "@/lib/analytics";
import { calculateContractValue, formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    conversionRate: 0,
    avgDealSize: 0,
    totalRevenue: 0,
    recurringRevenue: 0,
  });

  useEffect(() => {
    const allLeads = getLeads(true);
    setLeads(allLeads);

    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Calculate enhanced metrics
    const customers = allLeads.filter(lead => lead.convertedToCustomer && !lead.customerArchived);
    const activeLeads = allLeads.filter(lead => !lead.archived && !lead.convertedToCustomer);
    
    const totalRevenue = customers.reduce((sum, customer) => sum + calculateContractValue(customer), 0);
    const recurringRevenue = customers.reduce((sum, customer) => {
      const cv = calculateContractValue(customer);
      return customer.customerData?.jobType !== "One-Time" ? sum + cv : sum;
    }, 0);

    setMetrics({
      totalLeads: activeLeads.length,
      conversionRate: activeLeads.length > 0 ? (customers.length / activeLeads.length) * 100 : 0,
      avgDealSize: customers.length > 0 ? totalRevenue / customers.length : 0,
      totalRevenue,
      recurringRevenue,
    });
  }, []);

  const cards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      icon: Users,
      description: "Active leads in pipeline",
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Target,
      description: "Lead to customer rate",
    },
    {
      title: "Avg. Contract Value",
      value: formatCurrency(metrics.avgDealSize),
      icon: TrendingUp,
      description: `vs. Target: ${profile?.avgContractValue ? formatCurrency(parseFloat(profile.avgContractValue)) : 'Not set'}`,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      description: "Total from all customers",
    },
    {
      title: "Recurring Revenue",
      value: formatCurrency(metrics.recurringRevenue),
      icon: Calendar,
      description: "From recurring contracts",
    },
  ];

  // Group customers by service type
  const serviceBreakdown = leads
    .filter(lead => lead.convertedToCustomer && !lead.customerArchived)
    .reduce((acc, customer) => {
      const service = customer.customerData?.jobTitle || 'Uncategorized';
      if (!acc[service]) {
        acc[service] = {
          count: 0,
          revenue: 0,
        };
      }
      acc[service].count++;
      acc[service].revenue += calculateContractValue(customer);
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <LeadsByStageChart leads={leads} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionRateChart leads={leads} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadSourceChart leads={leads} />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(serviceBreakdown).map(([service, data]) => (
                <div key={service} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{service}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.count} customer{data.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(data.revenue)}</div>
                    <div className="text-sm text-muted-foreground">
                      Avg: {formatCurrency(data.revenue / data.count)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline />
        </CardContent>
      </Card>
    </div>
  );
}