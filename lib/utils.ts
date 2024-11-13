import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Lead, VARIABLE_TAGS } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replaceVariables(content: string, lead: Lead): string {
  let result = content;
  
  // Replace standard variables
  const variables = {
    "{{name}}": lead.name,
    "{{email}}": lead.email,
    "{{phone}}": lead.phone,
    "{{address}}": lead.address,
    "{{firstName}}": lead.name.split(" ")[0],
    "{{companyName}}": "Your Company Name", // Replace with actual company name
  };

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(key, "g"), value);
  }

  return result;
}

export const defaultServiceFrequencies = [
  { name: "One-Time", multiplier: 1 },
  { name: "Semi-Annual", multiplier: 2 },
  { name: "Tri-Annual", multiplier: 3 },
  { name: "Quarterly", multiplier: 4 },
  { name: "Bi-Monthly", multiplier: 6 },
  { name: "Monthly", multiplier: 12 }
];

export function calculateContractValue(customer: Lead): number {
  if (!customer.customerData?.lineItems?.length) return 0;

  // Calculate total from line items
  const lineItemsTotal = customer.customerData.lineItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  );

  // Get frequency multiplier
  const frequency = customer.customerData.jobType;
  const frequencyConfig = defaultServiceFrequencies.find(f => f.name === frequency);
  const multiplier = frequencyConfig?.multiplier || 1;

  return lineItemsTotal * multiplier;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}