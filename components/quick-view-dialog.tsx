"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Clock, AlertCircle, UserCheck } from "lucide-react";
import { Lead, Activity } from "@/lib/types";
import { getActivities, saveLead } from "@/lib/storage";
import ConvertToCustomerDialog from "./convert-to-customer-dialog";
import { useState } from "react";
import { calculateLeadScore } from "@/lib/scoring";
import ScoreIndicator from "./score-indicator";
import ScoreBreakdown from "./score-breakdown";

interface QuickViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onContact: () => void;
  onEdit: () => void;
  onUpdateLead?: (lead: Lead) => void;
}

export default function QuickViewDialog({
  open,
  onOpenChange,
  lead,
  onContact,
  onEdit,
  onUpdateLead,
}: QuickViewDialogProps) {
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const activities = getActivities(lead.id);
  const scoreBreakdown = calculateLeadScore(lead);

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

  const getLeadAge = () => {
    const age = formatDistanceToNow(new Date(lead.createdAt));
    const daysInPipeline = Math.floor(
      (new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    let color = "bg-green-500";
    if (daysInPipeline > 30) color = "bg-red-500";
    else if (daysInPipeline > 14) color = "bg-yellow-500";

    return (
      <Badge variant="secondary" className={`${color} text-white`}>
        {age} in pipeline
      </Badge>
    );
  };

  const getLastContactedBadge = () => {
    if (!lead.lastContactedAt) {
      return (
        <Badge variant="secondary" className="bg-red-500 text-white">
          Never contacted
        </Badge>
      );
    }

    const lastContact = formatDistanceToNow(new Date(lead.lastContactedAt));
    return (
      <Badge variant="secondary" className="bg-blue-500 text-white">
        Last contacted {lastContact} ago
      </Badge>
    );
  };

  const handleConvertToCustomer = () => {
    setIsConvertDialogOpen(true);
  };

  const handleCustomerConversion = (customerData: any) => {
    const updatedLead: Lead = {
      ...lead,
      stage: "Closed-Won",
      updatedAt: new Date().toISOString(),
      convertedToCustomer: true,
      convertedAt: customerData.convertedAt,
      customerData: customerData
    };
    
    saveLead(updatedLead, "stage_changed", {
      oldStage: lead.stage,
      newStage: "Closed-Won"
    });

    if (onUpdateLead) {
      onUpdateLead(updatedLead);
    }
    
    setIsConvertDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{lead.name}</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor(lead.priority)} text-white`}
                >
                  {lead.priority}
                </Badge>
                {getLeadAge()}
                <ScoreIndicator score={scoreBreakdown.total} size="lg" />
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {lead.address}
                </div>
                {lead.followUpDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Follow-up: {format(new Date(lead.followUpDate), "PPP")}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {getLastContactedBadge()}
                </div>
              </div>

              {lead.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Activity Timeline</h4>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-2 text-sm">
                        <div className="text-muted-foreground">
                          {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                        </div>
                        <div>{activity.description}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">Lead Score Analysis</h4>
                <ScoreBreakdown breakdown={scoreBreakdown} />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                Edit Lead
              </Button>
              <Button onClick={onContact}>Contact Lead</Button>
            </div>
            {lead.stage !== "Closed-Won" && (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleConvertToCustomer}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Convert to Customer
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConvertToCustomerDialog
        open={isConvertDialogOpen}
        onOpenChange={setIsConvertDialogOpen}
        lead={lead}
        onConvert={handleCustomerConversion}
      />
    </>
  );
}