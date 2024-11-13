"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare } from "lucide-react";
import { Campaign, Lead } from "@/lib/types";
import { getCampaigns, saveLead } from "@/lib/storage";
import { replaceVariables } from "@/lib/utils";
import { toast } from "sonner";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
}

export default function ContactDialog({
  open,
  onOpenChange,
  lead,
}: ContactDialogProps) {
  const [contactType, setContactType] = useState<"email" | "sms">("email");
  const [campaigns] = useState<Campaign[]>(getCampaigns());
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleCampaignSelect = (campaign: Campaign) => {
    if (campaign.type === "email") {
      setSubject(replaceVariables(campaign.subject || "", lead));
    }
    setMessage(replaceVariables(campaign.content, lead));
    setContactType(campaign.type);
  };

  const handleSend = async () => {
    // Here you would integrate with your email/SMS service
    // For now, we'll just log the message and update activity
    console.log({
      type: contactType,
      to: contactType === "email" ? lead.email : lead.phone,
      subject: subject,
      message: message,
    });

    // Update lead with contact information
    const updatedLead = {
      ...lead,
      lastContactedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save lead with contact activity
    saveLead(updatedLead, "contacted", {
      contactType,
      subject: subject || undefined,
      message,
    });

    toast.success(`${contactType.toUpperCase()} sent successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact {lead.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={contactType} onValueChange={(v) => setContactType(v as "email" | "sms")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <Label>Campaign Templates</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
              {campaigns
                .filter((c) => c.type === contactType)
                .map((campaign) => (
                  <Button
                    key={campaign.id}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleCampaignSelect(campaign)}
                  >
                    {campaign.name}
                  </Button>
                ))}
            </div>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Type your message here"
                />
              </div>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Type your message here"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}