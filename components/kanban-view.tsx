"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Lead, Stage } from "@/lib/types";
import LeadCard from "./lead-card";

const stages: Stage[] = [
  "New Lead",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Closed-Won",
  "Closed-Lost"
];

interface KanbanViewProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export default function KanbanView({ leads, onUpdateLead, onDeleteLead }: KanbanViewProps) {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const lead = leads.find(l => l.id === draggableId);
    if (!lead) return;

    const updatedLead: Lead = {
      ...lead,
      stage: destination.droppableId as Stage,
      updatedAt: new Date().toISOString()
    };

    onUpdateLead(updatedLead);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-6 gap-6 min-h-[calc(100vh-12rem)]">
        {stages.map((stage) => (
          <div key={stage} className="flex flex-col">
            <div className="bg-muted rounded-lg p-4 h-full">
              <h3 className="font-semibold mb-4 text-sm">{stage}</h3>
              <Droppable droppableId={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 h-full"
                  >
                    {leads
                      .filter((lead) => lead.stage === stage)
                      .map((lead, index) => (
                        <Draggable
                          key={lead.id}
                          draggableId={lead.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <LeadCard
                                lead={lead}
                                onUpdate={onUpdateLead}
                                onDelete={onDeleteLead}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}