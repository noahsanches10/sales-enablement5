import { Lead } from "./types";
import { differenceInDays, isWithinInterval, subDays } from "date-fns";

// Score weights (must sum to 1)
const WEIGHTS = {
  propertyValue: 0.25,
  engagement: 0.25,
  timeline: 0.25,
  qualification: 0.25,
};

// Maximum possible score
const MAX_SCORE = 10;

export interface ScoreBreakdown {
  total: number;
  components: {
    propertyValue: number;
    engagement: number;
    timeline: number;
    qualification: number;
  };
  factors: {
    positive: string[];
    negative: string[];
  };
}

export function calculateLeadScore(lead: Lead): ScoreBreakdown {
  const factors = {
    positive: [] as string[],
    negative: [] as string[],
  };

  // Get business profile for scoring context
  const businessProfile = localStorage.getItem("businessProfile");
  const profile = businessProfile ? JSON.parse(businessProfile) : null;

  // Property Value Score (0-10)
  let propertyValueScore = 0;
  if (lead.projectedValue) {
    if (profile?.avgContractValue) {
      const avgValue = parseFloat(profile.avgContractValue);
      if (lead.projectedValue >= avgValue * 1.5) {
        propertyValueScore = 10;
        factors.positive.push("High-value opportunity (above average)");
      } else if (lead.projectedValue >= avgValue) {
        propertyValueScore = 8;
        factors.positive.push("Above average contract value");
      } else if (lead.projectedValue >= avgValue * 0.5) {
        propertyValueScore = 6;
        factors.positive.push("Moderate contract value");
      } else {
        propertyValueScore = 4;
        factors.negative.push("Below average contract value");
      }
    } else {
      // Fallback if no business profile
      if (lead.projectedValue >= 10000) {
        propertyValueScore = 10;
        factors.positive.push("High-value opportunity");
      } else if (lead.projectedValue >= 5000) {
        propertyValueScore = 8;
        factors.positive.push("Good contract value");
      } else if (lead.projectedValue >= 2500) {
        propertyValueScore = 6;
        factors.positive.push("Moderate contract value");
      } else {
        propertyValueScore = 4;
        factors.negative.push("Low contract value");
      }
    }
  } else {
    factors.negative.push("No projected value set");
  }

  // Engagement Score (0-10)
  let engagementScore = 0;
  const hasNotes = lead.notes && lead.notes.length > 0;
  const hasBeenContacted = !!lead.lastContactedAt;
  
  if (hasBeenContacted && hasNotes) {
    engagementScore = 10;
    factors.positive.push("Active engagement with detailed notes");
  } else if (hasBeenContacted) {
    engagementScore = 7;
    factors.positive.push("Has been contacted");
  } else if (hasNotes) {
    engagementScore = 5;
    factors.negative.push("Has notes but no contact made");
  } else {
    factors.negative.push("No engagement recorded");
  }

  // Timeline Score (0-10)
  let timelineScore = 0;
  if (lead.followUpDate) {
    const followUp = new Date(lead.followUpDate);
    const now = new Date();
    
    if (isWithinInterval(followUp, { 
      start: now, 
      end: subDays(now, -7)  // Next 7 days
    })) {
      timelineScore = 10;
      factors.positive.push("Follow-up scheduled this week");
    } else if (followUp > now) {
      timelineScore = 7;
      factors.positive.push("Future follow-up scheduled");
    } else {
      timelineScore = 3;
      factors.negative.push("Overdue follow-up");
    }
  } else {
    factors.negative.push("No follow-up scheduled");
  }

  // Qualification Score (0-10)
  let qualificationScore = 0;
  
  // Score based on stage
  switch (lead.stage) {
    case "Negotiation":
      qualificationScore += 5;
      factors.positive.push("In negotiation stage");
      break;
    case "Proposal Sent":
      qualificationScore += 4;
      factors.positive.push("Proposal sent");
      break;
    case "Qualified":
      qualificationScore += 3;
      factors.positive.push("Lead qualified");
      break;
    case "New Lead":
      qualificationScore += 1;
      factors.negative.push("New lead, needs qualification");
      break;
  }

  // Additional score based on priority
  switch (lead.priority) {
    case "High":
      qualificationScore += 5;
      factors.positive.push("High priority lead");
      break;
    case "Medium":
      qualificationScore += 3;
      break;
    case "Low":
      qualificationScore += 1;
      factors.negative.push("Low priority lead");
      break;
  }

  // Calculate weighted total (0-10)
  const total = Math.round(
    (propertyValueScore * WEIGHTS.propertyValue +
    engagementScore * WEIGHTS.engagement +
    timelineScore * WEIGHTS.timeline +
    qualificationScore * WEIGHTS.qualification) * 
    (MAX_SCORE / 10)  // Scale to MAX_SCORE
  );

  return {
    total,
    components: {
      propertyValue: propertyValueScore,
      engagement: engagementScore,
      timeline: timelineScore,
      qualification: qualificationScore,
    },
    factors,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 6) return "text-green-500";
  if (score >= 4) return "text-yellow-500";
  return "text-red-500";
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Hot";
  if (score >= 6) return "Warm";
  if (score >= 4) return "Cool";
  return "Cold";
}

export function formatProjectedValue(value?: number): string {
  if (!value) return "";
  if (value >= 1000) {
    return Math.round(value / 1000) + "K";
  }
  return value.toString();
}