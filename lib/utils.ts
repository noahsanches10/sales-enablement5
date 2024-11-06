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