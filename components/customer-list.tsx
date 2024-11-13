"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Mail } from "lucide-react";
import { Lead } from "@/lib/types";
import { useState, useEffect } from "react";
import ConvertToCustomerDialog from "./convert-to-customer-dialog";
import ContactDialog from "./contact-dialog";
import CustomerQuickViewDialog from "./customer-quick-view-dialog";
import { saveLead } from "@/lib/storage";
import { calculateContractValue, formatCurrency } from "@/lib/utils";

interface CustomerListProps {
  customers: Lead[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  const [editCustomer, setEditCustomer] = useState<Lead | undefined>();
  const [contactCustomer, setContactCustomer] = useState<Lead | undefined>();
  const [quickViewCustomer, setQuickViewCustomer] = useState<Lead | undefined>();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("businessProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleUpdateCustomer = (customerData: any) => {
    if (editCustomer) {
      const updatedCustomer = {
        ...editCustomer,
        name: `${customerData.firstName} ${customerData.lastName}`,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.propertyAddress.street1,
        updatedAt: new Date().toISOString(),
        customerData: customerData
      };
      saveLead(updatedCustomer);
      window.location.reload();
    }
  };

  const handleArchiveCustomer = (customer: Lead) => {
    const archivedCustomer = {
      ...customer,
      customerArchived: true,
      customerArchivedAt: new Date().toISOString()
    };
    saveLead(archivedCustomer);
    window.location.reload();
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Street Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>CV</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow 
                key={customer.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setQuickViewCustomer(customer)}
              >
                <TableCell>{customer.customerData?.firstName}</TableCell>
                <TableCell>{customer.customerData?.lastName}</TableCell>
                <TableCell>{customer.customerData?.email}</TableCell>
                <TableCell>{customer.customerData?.phone}</TableCell>
                <TableCell>{customer.customerData?.propertyAddress?.street1}</TableCell>
                <TableCell>{customer.customerData?.propertyAddress?.city}</TableCell>
                <TableCell>{customer.customerData?.jobTitle}</TableCell>
                <TableCell>{customer.customerData?.jobType}</TableCell>
                <TableCell>{formatCurrency(calculateContractValue(customer))}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setContactCustomer(customer)}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditCustomer(customer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveCustomer(customer)}
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

      {editCustomer && (
        <ConvertToCustomerDialog
          open={!!editCustomer}
          onOpenChange={(open) => !open && setEditCustomer(undefined)}
          lead={editCustomer}
          onConvert={handleUpdateCustomer}
          isDirectCustomer={true}
        />
      )}

      {contactCustomer && (
        <ContactDialog
          open={!!contactCustomer}
          onOpenChange={(open) => !open && setContactCustomer(undefined)}
          lead={contactCustomer}
        />
      )}

      {quickViewCustomer && (
        <CustomerQuickViewDialog
          open={!!quickViewCustomer}
          onOpenChange={(open) => !open && setQuickViewCustomer(undefined)}
          customer={quickViewCustomer}
          onContact={() => {
            setQuickViewCustomer(undefined);
            setContactCustomer(quickViewCustomer);
          }}
          onEdit={() => {
            setQuickViewCustomer(undefined);
            setEditCustomer(quickViewCustomer);
          }}
        />
      )}
    </>
  );
}