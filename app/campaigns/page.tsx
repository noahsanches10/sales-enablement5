"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Campaign } from "@/lib/types";
import { getCampaigns, saveCampaign, deleteCampaign } from "@/lib/storage";
import CreateCampaignDialog from "@/components/create-campaign-dialog";
import CampaignList from "@/components/campaign-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeTab, setActiveTab] = useState<Campaign['status']>("active");

  useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);

  const handleCreateCampaign = (campaign: Campaign) => {
    saveCampaign(campaign);
    setCampaigns(getCampaigns());
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(campaignId);
      setCampaigns(getCampaigns());
    }
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) => campaign.status === activeTab
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Campaign['status'])}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <CampaignList
            campaigns={filteredCampaigns}
            onUpdateCampaign={handleCreateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
          />
        </TabsContent>
      </Tabs>

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
}