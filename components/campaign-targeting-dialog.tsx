"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campaign, Stage, Priority } from "@/lib/types";

interface CampaignTargetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
  onSave: (targeting: Campaign['targeting']) => void;
}

const stages: Stage[] = [
  "New Lead",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed-Won",
  "Closed-Lost",
];

const priorities: Priority[] = ["Low", "Medium", "High"];

export default function CampaignTargetingDialog({
  open,
  onOpenChange,
  campaign,
  onSave,
}: CampaignTargetingDialogProps) {
  const [selectedStages, setSelectedStages] = useState<Stage[]>(
    campaign.targeting?.stages || []
  );
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>(
    campaign.targeting?.priorities || []
  );
  const [selectedSources, setSelectedSources] = useState<string[]>(
    campaign.targeting?.sources || []
  );
  const [includeCustomers, setIncludeCustomers] = useState(
    campaign.targeting?.includeCustomers || false
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    campaign.targeting?.customerServices || []
  );
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>(
    campaign.targeting?.customerFrequencies || []
  );
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleStageToggle = (stage: Stage) => {
    setSelectedStages(prev =>
      prev.includes(stage)
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handlePriorityToggle = (priority: Priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  const handleSourceToggle = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleFrequencyToggle = (frequency: string) => {
    setSelectedFrequencies(prev =>
      prev.includes(frequency)
        ? prev.filter(f => f !== frequency)
        : [...prev, frequency]
    );
  };

  const handleSave = () => {
    onSave({
      stages: selectedStages,
      priorities: selectedPriorities,
      sources: selectedSources,
      includeCustomers,
      customerServices: includeCustomers ? selectedServices : [],
      customerFrequencies: includeCustomers ? selectedFrequencies : [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Campaign Targeting - {campaign.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Lead Stages</h4>
              <div className="grid grid-cols-2 gap-4">
                {stages.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`stage-${stage}`}
                      checked={selectedStages.includes(stage)}
                      onCheckedChange={() => handleStageToggle(stage)}
                    />
                    <Label htmlFor={`stage-${stage}`}>{stage}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Lead Priorities</h4>
              <div className="grid grid-cols-2 gap-4">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityToggle(priority)}
                    />
                    <Label htmlFor={`priority-${priority}`}>{priority}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Lead Sources</h4>
              <div className="grid grid-cols-2 gap-4">
                {profile?.leadSources.map((source: string) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={selectedSources.includes(source)}
                      onCheckedChange={() => handleSourceToggle(source)}
                    />
                    <Label htmlFor={`source-${source}`}>{source}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Customer Targeting</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-customers"
                  checked={includeCustomers}
                  onCheckedChange={(checked) => 
                    setIncludeCustomers(checked as boolean)
                  }
                />
                <Label htmlFor="include-customers">Include Customers</Label>
              </div>

              {includeCustomers && (
                <div className="space-y-4 pl-6">
                  <div className="space-y-2">
                    <Label>Target Services</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {profile?.services.map((service: any) => (
                        <div key={service.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.name}`}
                            checked={selectedServices.includes(service.name)}
                            onCheckedChange={() => handleServiceToggle(service.name)}
                          />
                          <Label htmlFor={`service-${service.name}`}>{service.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Frequencies</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {profile?.serviceFrequencies.map((frequency: string) => (
                        <div key={frequency} className="flex items-center space-x-2">
                          <Checkbox
                            id={`frequency-${frequency}`}
                            checked={selectedFrequencies.includes(frequency)}
                            onCheckedChange={() => handleFrequencyToggle(frequency)}
                          />
                          <Label htmlFor={`frequency-${frequency}`}>{frequency}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Targeting Summary</h4>
              <div className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-1">
                  {selectedStages.length > 0 && (
                    <li>Leads in stages: {selectedStages.join(", ")}</li>
                  )}
                  {selectedPriorities.length > 0 && (
                    <li>Leads with priorities: {selectedPriorities.join(", ")}</li>
                  )}
                  {selectedSources.length > 0 && (
                    <li>Leads from sources: {selectedSources.join(", ")}</li>
                  )}
                  {includeCustomers && (
                    <>
                      <li>
                        Customers with services: {selectedServices.length > 0 
                          ? selectedServices.join(", ") 
                          : "All services"}
                      </li>
                      <li>
                        Customers with frequencies: {selectedFrequencies.length > 0 
                          ? selectedFrequencies.join(", ") 
                          : "All frequencies"}
                      </li>
                    </>
                  )}
                  {selectedStages.length === 0 &&
                   selectedPriorities.length === 0 &&
                   selectedSources.length === 0 &&
                   !includeCustomers && (
                    <li>All leads (no filters applied)</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Targeting</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}