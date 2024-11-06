"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Campaign } from "@/lib/types";
import CreateCampaignDialog from "./create-campaign-dialog";

interface CampaignListProps {
  campaigns: Campaign[];
  onUpdateCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (campaignId: string) => void;
}

export default function CampaignList({
  campaigns,
  onUpdateCampaign,
  onDeleteCampaign,
}: CampaignListProps) {
  const [editCampaign, setEditCampaign] = useState<Campaign | undefined>();

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="mb-2">{campaign.name}</CardTitle>
                <CardDescription>
                  Created {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {campaign.type === "email" ? (
                  <Mail className="h-4 w-4 mr-1" />
                ) : (
                  <MessageSquare className="h-4 w-4 mr-1" />
                )}
                {campaign.type}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaign.type === "email" && (
                  <div>
                    <div className="text-sm font-medium">Subject</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.subject}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">Content Preview</div>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {campaign.content}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditCampaign(campaign)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCampaign(campaign.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateCampaignDialog
        open={!!editCampaign}
        onOpenChange={(open) => !open && setEditCampaign(undefined)}
        onCreateCampaign={onUpdateCampaign}
        editCampaign={editCampaign}
      />
    </>
  );
}