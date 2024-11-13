"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Archive } from "lucide-react";
import { Lead } from "@/lib/types";
import { getLeads, saveLead } from "@/lib/storage";
import CustomerList from "@/components/customer-list";
import ConvertToCustomerDialog from "@/components/convert-to-customer-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Lead[]>([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [filteredCustomers, setFilteredCustomers] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const allLeads = getLeads(true);
    const customerLeads = allLeads.filter(
      (lead) => lead.convertedToCustomer && !lead.customerArchived
    );
    setCustomers(customerLeads);

    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.customerData?.firstName?.toLowerCase().includes(search) ||
          customer.customerData?.lastName?.toLowerCase().includes(search) ||
          customer.customerData?.email?.toLowerCase().includes(search) ||
          customer.customerData?.phone?.toLowerCase().includes(search)
      );
    }

    // Apply service type filter
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.customerData?.jobTitle === serviceTypeFilter
      );
    }

    // Apply frequency filter
    if (frequencyFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.customerData?.jobType === frequencyFilter
      );
    }

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(
        (customer) => customer.source === sourceFilter
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, serviceTypeFilter, frequencyFilter, sourceFilter]);

  const handleAddCustomer = (customerData: any) => {
    const newCustomer: Lead = {
      id: crypto.randomUUID(),
      name: `${customerData.firstName} ${customerData.lastName}`,
      email: customerData.email,
      phone: customerData.phone,
      address: customerData.propertyAddress.street1,
      notes: "",
      priority: "Medium",
      stage: "Closed-Won",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      convertedToCustomer: true,
      convertedAt: new Date().toISOString(),
      customerData: customerData,
      isDirectCustomer: true,
      source: customerData.source
    };

    // Save the new customer
    saveLead(newCustomer, "created");
    
    // Update the local state
    setCustomers(prev => [...prev, newCustomer]);
    setIsAddCustomerOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setServiceTypeFilter("all");
    setFrequencyFilter("all");
    setSourceFilter("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/archived-customers">
              <Archive className="h-4 w-4 mr-2" />
              Archived Customers
            </Link>
          </Button>
          <Button onClick={() => setIsAddCustomerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Service Types</SelectItem>
            {profile?.services.map((service: any) => (
              <SelectItem key={service.name} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Service Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Service Frequencies</SelectItem>
            {profile?.serviceFrequencies.map((frequency: string) => (
              <SelectItem key={frequency} value={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {profile?.leadSources.map((source: string) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchTerm || serviceTypeFilter !== "all" || frequencyFilter !== "all" || sourceFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="px-3"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <CustomerList customers={filteredCustomers} />

      <ConvertToCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        lead={{} as Lead}
        onConvert={handleAddCustomer}
        isDirectCustomer={true}
      />
    </div>
  );
}