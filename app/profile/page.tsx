"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { defaultServiceFrequencies } from "@/lib/utils";

const defaultLeadSources = [
  "Website",
  "Referral",
  "Google Ads",
  "Social Media",
  "Door Hanger",
  "Yard Sign",
  "Home Show",
  "Nextdoor",
  "Direct Mail",
  "Other"
];

interface BusinessProfile {
  name: string;
  industry: "Home Service" | "SaaS" | "Other";
  crm: "Jobber" | "Other" | "None";
  website: string;
  avgContractValue: string;
  leadSources: string[];
  services: Array<{
    name: string;
    measurementField?: {
      label: string;
      type: "number" | "text";
    };
  }>;
  serviceFrequencies: string[];
}

const defaultProfile: BusinessProfile = {
  name: "",
  industry: "Home Service",
  crm: "None",
  website: "",
  avgContractValue: "",
  leadSources: defaultLeadSources,
  services: [],
  serviceFrequencies: defaultServiceFrequencies.map(f => f.name),
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile>(defaultProfile);
  const [newSource, setNewSource] = useState("");
  const [newService, setNewService] = useState("");
  const [newMeasurementLabel, setNewMeasurementLabel] = useState("");
  const [newMeasurementType, setNewMeasurementType] = useState<"number" | "text">("number");
  const [newFrequency, setNewFrequency] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("businessProfile", JSON.stringify(profile));
    window.location.reload();
  };

  const addLeadSource = () => {
    if (newSource && !profile.leadSources.includes(newSource)) {
      setProfile({
        ...profile,
        leadSources: [...profile.leadSources, newSource]
      });
      setNewSource("");
    }
  };

  const removeLeadSource = (source: string) => {
    setProfile({
      ...profile,
      leadSources: profile.leadSources.filter(s => s !== source)
    });
  };

  const addService = () => {
    if (newService && !profile.services.find(s => s.name === newService)) {
      const service = {
        name: newService,
        ...(newMeasurementLabel && {
          measurementField: {
            label: newMeasurementLabel,
            type: newMeasurementType
          }
        })
      };
      setProfile({
        ...profile,
        services: [...profile.services, service]
      });
      setNewService("");
      setNewMeasurementLabel("");
    }
  };

  const removeService = (serviceName: string) => {
    setProfile({
      ...profile,
      services: profile.services.filter(s => s.name !== serviceName)
    });
  };

  const addFrequency = () => {
    if (newFrequency && !profile.serviceFrequencies.includes(newFrequency)) {
      setProfile({
        ...profile,
        serviceFrequencies: [...profile.serviceFrequencies, newFrequency]
      });
      setNewFrequency("");
    }
  };

  const removeFrequency = (frequency: string) => {
    setProfile({
      ...profile,
      serviceFrequencies: profile.serviceFrequencies.filter(f => f !== frequency)
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Profile</h1>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select
              value={profile.industry}
              onValueChange={(value: BusinessProfile["industry"]) =>
                setProfile({ ...profile, industry: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home Service">Home Service</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>CRM System</Label>
            <Select
              value={profile.crm}
              onValueChange={(value: BusinessProfile["crm"]) =>
                setProfile({ ...profile, crm: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jobber">Jobber</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <Input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your business name"
          />
        </div>

        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={profile.website}
            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label>Average Contract Value</Label>
          <Input
            type="number"
            value={profile.avgContractValue}
            onChange={(e) => setProfile({ ...profile, avgContractValue: e.target.value })}
            placeholder="Enter average contract value"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Services</Label>
        <div className="flex gap-4">
          <Input
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="Add a service"
          />
          <Input
            value={newMeasurementLabel}
            onChange={(e) => setNewMeasurementLabel(e.target.value)}
            placeholder="Measurement field label (optional)"
          />
          <Select
            value={newMeasurementType}
            onValueChange={(value: "number" | "text") => setNewMeasurementType(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addService} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.services.map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
            >
              <span>{service.name}</span>
              {service.measurementField && (
                <span className="text-muted-foreground text-sm">
                  ({service.measurementField.label})
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => removeService(service.name)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Service Frequencies</Label>
        <div className="flex gap-4">
          <Input
            value={newFrequency}
            onChange={(e) => setNewFrequency(e.target.value)}
            placeholder="Add a frequency"
          />
          <Button onClick={addFrequency} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.serviceFrequencies.map((frequency) => (
            <div
              key={frequency}
              className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
            >
              <span>{frequency}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => removeFrequency(frequency)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Lead Sources</Label>
        <div className="flex gap-4">
          <Input
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="Add a lead source"
          />
          <Button onClick={addLeadSource} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.leadSources.map((source) => (
            <div
              key={source}
              className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
            >
              <span>{source}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => removeLeadSource(source)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}