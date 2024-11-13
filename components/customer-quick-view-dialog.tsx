"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, MapPin, Building2, Briefcase, CalendarClock, UserMinus } from "lucide-react";
import { Lead, Activity } from "@/lib/types";
import { getActivities, saveLead } from "@/lib/storage";
import { useState } from "react";

interface CustomerQuickViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Lead;
  onContact: () => void;
  onEdit: () => void;
}

export default function CustomerQuickViewDialog({
  open,
  onOpenChange,
  customer,
  onContact,
  onEdit,
}: CustomerQuickViewDialogProps) {
  const activities = getActivities(customer.id);
  const customerData = customer.customerData || {};
  const [isConverting, setIsConverting] = useState(false);

  // Add conversion activity if it doesn't exist
  if (!activities.find(a => a.type === "created")) {
    activities.unshift({
      id: "customer-creation",
      leadId: customer.id,
      type: "created",
      description: customer.isDirectCustomer ? "Customer created" : "Customer converted from lead",
      timestamp: customer.convertedAt || customer.createdAt,
    });
  }

  // Sort activities by timestamp in descending order
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleConvertToLead = () => {
    setIsConverting(true);
    
    // Create a new lead from the customer
    const newLead: Lead = {
      ...customer,
      convertedToCustomer: false,
      convertedAt: undefined,
      customerData: undefined,
      isDirectCustomer: undefined,
      stage: "New Lead",
      updatedAt: new Date().toISOString()
    };

    saveLead(newLead, "stage_changed", {
      oldStage: "Customer",
      newStage: "New Lead"
    });

    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {customerData.firstName} {customerData.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${customerData.email}`} className="hover:underline">
                {customerData.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${customerData.phone}`} className="hover:underline">
                {customerData.phone}
              </a>
            </div>
            {customerData.companyName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {customerData.companyName}
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <div className="flex flex-col">
                <span>{customerData.propertyAddress?.street1}</span>
                {customerData.propertyAddress?.street2 && (
                  <span>{customerData.propertyAddress.street2}</span>
                )}
                <span>
                  {customerData.propertyAddress?.city}, {customerData.propertyAddress?.state} {customerData.propertyAddress?.zipCode}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {customerData.jobTitle} - {customerData.jobType}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              Customer since {format(new Date(customer.convertedAt || customer.createdAt), "MMM d, yyyy")}
            </div>
          </div>

          {customerData.billingAddress && !customerData.billingAddressSame && (
            <div className="space-y-2">
              <h4 className="font-medium">Billing Address</h4>
              <div className="text-sm text-muted-foreground">
                {customerData.billingAddress.street1}
                {customerData.billingAddress.street2 && (
                  <div>{customerData.billingAddress.street2}</div>
                )}
                <div>
                  {customerData.billingAddress.city}, {customerData.billingAddress.state} {customerData.billingAddress.zipCode}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Activity Timeline</h4>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {sortedActivities.map((activity) => (
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

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit}>
                Edit Customer
              </Button>
              <Button onClick={onContact}>Contact Customer</Button>
            </div>
            {customer.isDirectCustomer && (
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleConvertToLead}
                disabled={isConverting}
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Convert to Lead
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}