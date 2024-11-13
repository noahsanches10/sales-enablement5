"use client";

import { Gauge } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { getScoreColor, getScoreLabel } from "@/lib/scoring";

interface ScoreIndicatorProps {
  score: number;
  size?: "sm" | "lg";
  showLabel?: boolean;
}

export default function ScoreIndicator({ 
  score, 
  size = "sm",
  showLabel = true 
}: ScoreIndicatorProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Gauge className={`${color} ${size === "lg" ? "h-5 w-5" : "h-4 w-4"}`} />
            {showLabel && (
              <div className="flex items-center gap-2">
                <span className={`${color} font-medium ${size === "lg" ? "text-lg" : "text-sm"}`}>
                  {score}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({label})
                </span>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <div className="font-medium">Lead Score: {score}/10</div>
            <Progress value={score * 10} className="h-2" />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}