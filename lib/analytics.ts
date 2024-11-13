import { Lead } from "./types";

export function calculateMetrics(leads: Lead[]) {
  const activeLeads = leads.filter(lead => !lead.archived);
  const convertedLeads = leads.filter(lead => lead.convertedToCustomer);
  
  const totalRevenue = convertedLeads.reduce((sum, lead) => {
    const lineItems = lead.customerData?.lineItems || [];
    const leadRevenue = lineItems.reduce((total, item) => 
      total + (parseFloat(item.price) || 0), 0);
    return sum + leadRevenue;
  }, 0);

  return {
    totalLeads: activeLeads.length,
    conversionRate: activeLeads.length > 0 ? convertedLeads.length / activeLeads.length : 0,
    avgDealSize: convertedLeads.length > 0 ? totalRevenue / convertedLeads.length : 0,
    totalRevenue: totalRevenue,
  };
}