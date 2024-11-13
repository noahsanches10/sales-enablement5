"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, VARIABLE_TAGS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCampaign: (campaign: Campaign) => void;
  editCampaign?: Campaign;
}

export default function CreateCampaignDialog({
  open,
  onOpenChange,
  onCreateCampaign,
  editCampaign,
}: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState<Partial<Campaign>>(
    editCampaign || {
      name: "",
      type: "email",
      subject: "",
      content: "",
      status: "draft"
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: editCampaign?.id || crypto.randomUUID(),
      ...formData,
      status: editCampaign?.status || "draft",
      createdAt: editCampaign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Campaign;

    onCreateCampaign(newCampaign);
    onOpenChange(false);
    
    // Reset form if not editing
    if (!editCampaign) {
      setFormData({
        name: "",
        type: "email",
        subject: "",
        content: "",
        status: "draft"
      });
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + variable + after;
      setFormData({ ...formData, content: newText });
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editCampaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Campaign Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "email" | "sms") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "email" && (
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              <TooltipProvider>
                {VARIABLE_TAGS && VARIABLE_TAGS.map((tag) => (
                  <Tooltip key={tag.value}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => insertVariable(tag.value)}
                      >
                        {tag.label}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tag.description}</p>
                      <p className="text-xs text-muted-foreground">{tag.value}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editCampaign ? "Update Campaign" : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}