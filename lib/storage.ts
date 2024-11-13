import { Lead, Activity, Campaign } from './types';

const LEADS_KEY = 'pipeline_leads';
const CAMPAIGNS_KEY = 'pipeline_campaigns';
const ACTIVITIES_KEY = 'pipeline_activities';

// Lead operations
export function getLeads(includeArchived: boolean = false): Lead[] {
  if (typeof window === 'undefined') return [];
  
  const leads = localStorage.getItem(LEADS_KEY);
  const allLeads = leads ? JSON.parse(leads) : [];
  return includeArchived ? allLeads : allLeads.filter((lead: Lead) => !lead.archived);
}

export function getArchivedLeads(): Lead[] {
  if (typeof window === 'undefined') return [];
  
  const leads = localStorage.getItem(LEADS_KEY);
  return leads ? JSON.parse(leads).filter((lead: Lead) => lead.archived) : [];
}

export function saveLead(lead: Lead, activityType?: Activity['type'], activityMetadata?: Activity['metadata']) {
  const leads = getLeads(true);
  const existingIndex = leads.findIndex(l => l.id === lead.id);
  
  if (existingIndex >= 0) {
    leads[existingIndex] = lead;
  } else {
    leads.push(lead);
  }
  
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));

  // Create activity log
  if (activityType) {
    const activity: Activity = {
      id: crypto.randomUUID(),
      leadId: lead.id,
      type: activityType,
      description: getActivityDescription(activityType, lead, activityMetadata),
      timestamp: new Date().toISOString(),
      metadata: activityMetadata
    };
    saveActivity(activity);
  }
}

export function archiveLead(id: string) {
  const leads = getLeads(true);
  const leadIndex = leads.findIndex(lead => lead.id === id);
  
  if (leadIndex >= 0) {
    leads[leadIndex] = {
      ...leads[leadIndex],
      archived: true,
      archivedAt: new Date().toISOString()
    };
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }
}

export function restoreLead(id: string) {
  const leads = getLeads(true);
  const leadIndex = leads.findIndex(lead => lead.id === id);
  
  if (leadIndex >= 0) {
    leads[leadIndex] = {
      ...leads[leadIndex],
      archived: false,
      archivedAt: undefined
    };
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }
}

export function deleteLead(id: string) {
  const leads = getLeads(true);
  const leadToDelete = leads.find(lead => lead.id === id);
  
  if (leadToDelete?.convertedToCustomer) {
    // If it's a converted customer, just archive the lead
    const updatedLead = {
      ...leadToDelete,
      archived: true,
      archivedAt: new Date().toISOString()
    };
    const updatedLeads = leads.map(lead => 
      lead.id === id ? updatedLead : lead
    );
    localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
  } else {
    // If it's just a lead, delete it completely
    const filteredLeads = leads.filter(lead => lead.id !== id);
    localStorage.setItem(LEADS_KEY, JSON.stringify(filteredLeads));
  }
  
  // Delete associated activities
  const activities = getActivities().filter(activity => activity.leadId !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

// Campaign operations
export function getCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return [];
  
  const campaigns = localStorage.getItem(CAMPAIGNS_KEY);
  return campaigns ? JSON.parse(campaigns) : [];
}

export function saveCampaign(campaign: Campaign) {
  const campaigns = getCampaigns();
  const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
  
  if (existingIndex >= 0) {
    campaigns[existingIndex] = campaign;
  } else {
    campaigns.push(campaign);
  }
  
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string) {
  const campaigns = getCampaigns().filter(campaign => campaign.id !== id);
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

// Customer operations
export function getCustomers(): Lead[] {
  const leads = getLeads(true);
  return leads.filter(lead => lead.convertedToCustomer && !lead.customerArchived);
}

export function getArchivedCustomers(): Lead[] {
  const leads = getLeads(true);
  return leads.filter(lead => lead.convertedToCustomer && lead.customerArchived);
}

export function deleteCustomer(id: string) {
  const leads = getLeads(true);
  const customerToDelete = leads.find(lead => lead.id === id);
  
  if (customerToDelete) {
    if (customerToDelete.isDirectCustomer) {
      // If it's a direct customer (not converted from lead), delete completely
      const filteredLeads = leads.filter(lead => lead.id !== id);
      localStorage.setItem(LEADS_KEY, JSON.stringify(filteredLeads));
    } else {
      // If it was converted from a lead, just remove customer data
      const updatedLead = {
        ...customerToDelete,
        convertedToCustomer: false,
        convertedAt: undefined,
        customerData: undefined,
        customerArchived: undefined,
        customerArchivedAt: undefined,
        stage: "Closed-Lost",
        updatedAt: new Date().toISOString()
      };
      const updatedLeads = leads.map(lead => 
        lead.id === id ? updatedLead : lead
      );
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
    }
  }
}

// Activity operations
export function getActivities(leadId?: string): Activity[] {
  if (typeof window === 'undefined') return [];
  
  const activities = localStorage.getItem(ACTIVITIES_KEY);
  const allActivities = activities ? JSON.parse(activities) : [];
  return leadId 
    ? allActivities.filter((activity: Activity) => activity.leadId === leadId)
    : allActivities;
}

export function saveActivity(activity: Activity) {
  const activities = getActivities();
  activities.push(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

function getActivityDescription(
  type: Activity['type'], 
  lead: Lead, 
  metadata?: Activity['metadata']
): string {
  switch (type) {
    case 'created':
      return 'Lead created';
    case 'stage_changed':
      return `Stage changed from ${metadata?.oldStage} to ${metadata?.newStage}`;
    case 'contacted':
      const method = metadata?.contactType === 'email' ? 'Email' : 'SMS';
      const subject = metadata?.subject ? ` - Subject: ${metadata.subject}` : '';
      return `${method} sent${subject}`;
    case 'note_added':
      return `Note added: ${metadata?.note}`;
    case 'updated':
      return 'Lead information updated';
    default:
      return 'Activity logged';
  }
}