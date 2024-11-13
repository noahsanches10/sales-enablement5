"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreVertical, Pencil, Trash, Mail, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/lib/types";
import CreateLeadDialog from "./create-lead-dialog";
import ContactDialog from "./contact-dialog";
import QuickViewDialog from "./quick-view-dialog";
import ScoreIndicator from "./score-indicator";
import { calculateLeadScore } from "@/lib/scoring";

interface LeadCardProps {
  lead: Lead;
  onUpdate: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export default function LeadCard({ lead, onUpdate, onDelete }: LeadCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const scoreBreakdown = calculateLeadScore(lead);

  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case "Medium":
        return "Med";
      default:
        return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getContactIndicator = () => {
    if (!lead.followUpDate) return "";
    
    const followUpDate = new Date(lead.followUpDate);
    const now = new Date();
    
    // If follow-up date is in the past and no contact has been made
    if (followUpDate < now && !lead.lastContactedAt) {
      return "border-l-4 border-red-500";
    }
    
    return "";
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open quick view if clicking on the dropdown menu
    if (!(e.target as HTMLElement).closest('.dropdown-trigger')) {
      setIsQuickViewOpen(true);
    }
  };

  const formatProjectedValue = (value?: number) => {
    if (!value) return null;
    return value >= 1000 ? `${Math.floor(value / 1000)}K` : value.toString();
  };

  return (
    <>
      <div 
        className={`bg-card rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${getContactIndicator()}`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm line-clamp-1">{lead.name}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 dropdown-trigger"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditDialogOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContactDialogOpen(true);
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(lead.id);
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="secondary"
            className={`${getPriorityColor(lead.priority)} text-white text-xs px-2 py-0`}
          >
            {getPriorityDisplay(lead.priority)}
          </Badge>
          {lead.projectedValue && (
            <Badge variant="outline" className="text-xs px-2 py-0">
              <DollarSign className="h-3 w-3 mr-1" />
              {formatProjectedValue(lead.projectedValue)}
            </Badge>
          )}
          <div className="ml-auto">
            <ScoreIndicator score={scoreBreakdown.total} showLabel={false} />
          </div>
        </div>
        {lead.followUpDate && (
          <div className="text-xs text-muted-foreground">
            Follow-up: {format(new Date(lead.followUpDate), "MMM d, yyyy")}
          </div>
        )}
      </div>

      <CreateLeadDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onCreateLead={onUpdate}
        editLead={lead}
      />

      <ContactDialog
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
        lead={lead}
      />

      <QuickViewDialog
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        lead={lead}
        onContact={() => {
          setIsQuickViewOpen(false);
          setIsContactDialogOpen(true);
        }}
        onEdit={() => {
          setIsQuickViewOpen(false);
          setIsEditDialogOpen(true);
        }}
        onUpdateLead={onUpdate}
      />
    </>
  );
}