"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/lib/countries";

export interface AddressFields {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressFieldsProps {
  address: AddressFields;
  updateFn: (field: keyof AddressFields, value: string) => void;
}

export function AddressFieldsSection({ address, updateFn }: AddressFieldsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <Label>Street Address</Label>
        <Input
          value={address.street1}
          onChange={(e) => updateFn("street1", e.target.value)}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label>Street Address 2 (Optional)</Label>
        <Input
          value={address.street2}
          onChange={(e) => updateFn("street2", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label>City</Label>
          <Input
            value={address.city}
            onChange={(e) => updateFn("city", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>State</Label>
          <Input
            value={address.state}
            onChange={(e) => updateFn("state", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label>ZIP Code</Label>
          <Input
            value={address.zipCode}
            onChange={(e) => updateFn("zipCode", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select
            value={address.country}
            onValueChange={(value) => updateFn("country", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}