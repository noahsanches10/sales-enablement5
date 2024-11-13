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
import {
  Pencil,
  Trash,
  Mail,
  MessageSquare,
  Play,
  Pause,
  BarChart2,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Campaign } from "@/lib/types";
import CreateCampaignDialog from "./create-campaign-dialog";
import CampaignTargetingDialog from "./campaign-targeting-dialog";
import CampaignMetricsDialog from "./campaign-metrics-dialog";

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
  const [targetingCampaign, setTargetingCampaign] = useState<Campaign | undefined>();
  const [metricsCampaign, setMetricsCampaign] = useState<Campaign | undefined>();

  const handleStatusToggle = (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    onUpdateCampaign({
      ...campaign,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTargetingSave = (campaign: Campaign, targeting: Campaign['targeting']) => {
    onUpdateCampaign({
      ...campaign,
      targeting,
      updatedAt: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderCampaignType = (type: "email" | "sms") => {
    return (
      <div className="flex items-center gap-1">
        {type === "email" ? (
          <Mail className="h-4 w-4" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        <span>{type}</span>
      </div>
    );
  };

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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {renderCampaignType(campaign.type)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(campaign.status)} text-white`}
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>
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

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
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
                      onClick={() => setTargetingCampaign(campaign)}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMetricsCampaign(campaign)}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCampaign(campaign.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  {campaign.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(campaign)}
                    >
                      {campaign.status === "active" ? (
                        <Pause className="h-4 w-4 mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      {campaign.status === "active" ? "Pause" : "Activate"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editCampaign && (
        <CreateCampaignDialog
          open={!!editCampaign}
          onOpenChange={(open) => !open && setEditCampaign(undefined)}
          onCreateCampaign={onUpdateCampaign}
          editCampaign={editCampaign}
        />
      )}

      {targetingCampaign && (
        <CampaignTargetingDialog
          open={!!targetingCampaign}
          onOpenChange={(open) => !open && setTargetingCampaign(undefined)}
          campaign={targetingCampaign}
          onSave={(targeting) => handleTargetingSave(targetingCampaign, targeting)}
        />
      )}

      {metricsCampaign && (
        <CampaignMetricsDialog
          open={!!metricsCampaign}
          onOpenChange={(open) => !open && setMetricsCampaign(undefined)}
          campaign={metricsCampaign}
        />
      )}
    </>
  );
}