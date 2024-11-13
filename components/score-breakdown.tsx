"use client";

import { ScoreBreakdown } from "@/lib/scoring";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const components = [
    { 
      label: "Property Value", 
      value: breakdown.components.propertyValue,
      description: "Based on projected contract value"
    },
    { 
      label: "Engagement", 
      value: breakdown.components.engagement,
      description: "Based on contact history and notes"
    },
    { 
      label: "Timeline", 
      value: breakdown.components.timeline,
      description: "Based on follow-up schedule"
    },
    { 
      label: "Qualification", 
      value: breakdown.components.qualification,
      description: "Based on priority and stage"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {components.map((component) => (
          <div key={component.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{component.label}</span>
              <span className="font-medium">{component.value}/10</span>
            </div>
            <Progress value={component.value * 10} className="h-2" />
            <p className="text-xs text-muted-foreground">{component.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {breakdown.factors.positive.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-500">
              <ThumbsUp className="h-4 w-4" />
              Positive Factors
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {breakdown.factors.positive.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {breakdown.factors.negative.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-500">
              <ThumbsDown className="h-4 w-4" />
              Areas for Improvement
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {breakdown.factors.negative.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}