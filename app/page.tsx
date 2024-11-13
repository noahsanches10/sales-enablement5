"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, List, KanbanSquare, Archive } from "lucide-react";
import { Lead, Priority, Stage, LeadSource } from "@/lib/types";
import { getLeads, saveLead, archiveLead } from "@/lib/storage";
import CreateLeadDialog from "@/components/create-lead-dialog";
import KanbanView from "@/components/kanban-view";
import ListView from "@/components/list-view";
import SearchFilter from "@/components/search-filter";
import Link from "next/link";

export default function Pipeline() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  useEffect(() => {
    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          lead.email.toLowerCase().includes(search) ||
          lead.phone.toLowerCase().includes(search) ||
          lead.address.toLowerCase().includes(search) ||
          lead.notes?.toLowerCase().includes(search)
      );
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((lead) => lead.priority === priorityFilter);
    }

    // Apply stage filter
    if (stageFilter !== "all") {
      filtered = filtered.filter((lead) => lead.stage === stageFilter);
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, priorityFilter, stageFilter, sourceFilter]);

  const handleCreateLead = (lead: Lead) => {
    saveLead(lead);
    setLeads(getLeads());
  };

  const handleArchiveLead = (leadId: string) => {
    archiveLead(leadId);
    setLeads(getLeads());
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("all");
    setStageFilter("all");
    setSourceFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <KanbanSquare className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link href="/archived">
              <Archive className="h-4 w-4 mr-2" />
              Archived Leads
            </Link>
          </Button>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        stageFilter={stageFilter}
        onStageChange={setStageFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        onReset={resetFilters}
      />

      {viewMode === "kanban" ? (
        <KanbanView
          leads={filteredLeads}
          onUpdateLead={handleCreateLead}
          onDeleteLead={handleArchiveLead}
        />
      ) : (
        <ListView
          leads={filteredLeads}
          onUpdateLead={handleCreateLead}
          onDeleteLead={handleArchiveLead}
        />
      )}

      <CreateLeadDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateLead={handleCreateLead}
      />
    </div>
  );
}