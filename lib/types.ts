export type Priority = "Low" | "Medium" | "High";

export type Stage =
  | "New Lead"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed-Won"
  | "Closed-Lost";

export type ActivityType = 
  | "created"
  | "stage_changed"
  | "contacted"
  | "note_added"
  | "updated";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  metadata?: {
    oldStage?: Stage;
    newStage?: Stage;
    subject?: string;
    message?: string;
  };
}

export type LeadSource =
  | "Website"
  | "Referral"
  | "Google Ads"
  | "Social Media"
  | "Door Hanger"
  | "Yard Sign"
  | "Home Show"
  | "Nextdoor"
  | "Direct Mail"
  | "Other";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  priority: Priority;
  followUpDate?: string;
  stage: Stage;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  archivedAt?: string;
  lastContactedAt?: string;
  convertedToCustomer?: boolean;
  convertedAt?: string;
  customerData?: any;
  customerArchived?: boolean;
  customerArchivedAt?: string;
  isDirectCustomer?: boolean;
  projectedValue?: number;
  source?: LeadSource;
}

export interface CampaignTargeting {
  stages: Stage[];
  priorities: Priority[];
  sources: LeadSource[];
  includeCustomers: boolean;
}

export interface CampaignMetrics {
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  lastSent?: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms";
  subject?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "active" | "completed" | "paused";
  targeting?: CampaignTargeting;
  metrics?: CampaignMetrics;
}

export const VARIABLE_TAGS = [
  {
    label: "Name",
    value: "{{name}}",
    description: "Full name of the lead/customer"
  },
  {
    label: "First Name",
    value: "{{firstName}}",
    description: "First name only"
  },
  {
    label: "Email",
    value: "{{email}}",
    description: "Email address"
  },
  {
    label: "Phone",
    value: "{{phone}}",
    description: "Phone number"
  },
  {
    label: "Address",
    value: "{{address}}",
    description: "Full address"
  },
  {
    label: "Company",
    value: "{{companyName}}",
    description: "Your company name"
  }
];