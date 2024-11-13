"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export interface LineItem {
  description: string;
  price: string;
}

interface LineItemsProps {
  items: LineItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof LineItem, value: string) => void;
}

export function LineItems({ items, onAdd, onRemove, onUpdate }: LineItemsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Line Items</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => onUpdate(index, "description", e.target.value)}
                required
              />
            </div>
            <div className="w-32">
              <Input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => onUpdate(index, "price", e.target.value)}
                required
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}