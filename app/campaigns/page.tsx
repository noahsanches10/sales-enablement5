"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Campaign } from "@/lib/types";
import { getCampaigns, saveCampaign, deleteCampaign } from "@/lib/storage";
import CreateCampaignDialog from "@/components/create-campaign-dialog";
import CampaignList from "@/components/campaign-list";

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  const handleCreateCampaign = (campaign: Campaign) => {
    saveCampaign(campaign);
    setCampaigns(getCampaigns());
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteCampaign(campaignId);
    setCampaigns(getCampaigns());
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <CampaignList
        campaigns={campaigns}
        onUpdateCampaign={handleCreateCampaign}
        onDeleteCampaign={handleDeleteCampaign}
      />

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
}