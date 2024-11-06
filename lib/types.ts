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
    contactType?: "email" | "sms";
    note?: string;
  };
}

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
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms";
  subject?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface VariableTag {
  label: string;
  value: string;
  description: string;
}

export const VARIABLE_TAGS: VariableTag[] = [
  { label: "Lead Name", value: "{{name}}", description: "The lead's full name" },
  { label: "First Name", value: "{{firstName}}", description: "The lead's first name" },
  { label: "Email", value: "{{email}}", description: "The lead's email address" },
  { label: "Phone", value: "{{phone}}", description: "The lead's phone number" },
  { label: "Address", value: "{{address}}", description: "The lead's address" },
  { label: "Company Name", value: "{{companyName}}", description: "Your company name" },
];