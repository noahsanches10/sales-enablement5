"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Mail, DollarSign } from "lucide-react";
import { Lead } from "@/lib/types";
import CreateLeadDialog from "./create-lead-dialog";
import ContactDialog from "./contact-dialog";
import QuickViewDialog from "./quick-view-dialog";

interface ListViewProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function ListView({ leads, onUpdateLead, onDeleteLead }: ListViewProps) {
  const [editLead, setEditLead] = useState<Lead | undefined>();
  const [contactLead, setContactLead] = useState<Lead | undefined>();
  const [quickViewLead, setQuickViewLead] = useState<Lead | undefined>();

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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Projected Value</TableHead>
              <TableHead>Follow-up Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow 
                key={lead.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setQuickViewLead(lead)}
              >
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.stage}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getPriorityColor(lead.priority)} text-white`}
                  >
                    {lead.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {lead.projectedValue ? (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {lead.projectedValue.toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {lead.followUpDate
                    ? format(new Date(lead.followUpDate), "MMM d, yyyy")
                    : "-"}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setContactLead(lead)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditLead(lead)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLead(lead.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editLead && (
        <CreateLeadDialog
          open={!!editLead}
          onOpenChange={(open) => !open && setEditLead(undefined)}
          onCreateLead={onUpdateLead}
          editLead={editLead}
        />
      )}

      {contactLead && (
        <ContactDialog
          open={!!contactLead}
          onOpenChange={(open) => !open && setContactLead(undefined)}
          lead={contactLead}
        />
      )}

      {quickViewLead && (
        <QuickViewDialog
          open={!!quickViewLead}
          onOpenChange={(open) => !open && setQuickViewLead(undefined)}
          lead={quickViewLead}
          onContact={() => {
            setQuickViewLead(undefined);
            setContactLead(quickViewLead);
          }}
          onEdit={() => {
            setQuickViewLead(undefined);
            setEditLead(quickViewLead);
          }}
          onUpdateLead={onUpdateLead}
        />
      )}
    </>
  );
}