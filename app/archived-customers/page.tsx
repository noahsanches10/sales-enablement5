"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, RotateCcw } from "lucide-react";
import { Lead } from "@/lib/types";
import { getArchivedCustomers, saveLead, deleteCustomer } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default function ArchivedCustomers() {
  const [customers, setCustomers] = useState<Lead[]>([]);

  useEffect(() => {
    setCustomers(getArchivedCustomers());
  }, []);

  const handleRestore = (customer: Lead) => {
    const restoredCustomer = {
      ...customer,
      customerArchived: false,
      customerArchivedAt: undefined
    };
    saveLead(restoredCustomer);
    setCustomers(getArchivedCustomers());
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this customer?")) {
      deleteCustomer(customerId);
      setCustomers(getArchivedCustomers());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/customers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Archived Customers</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Archived Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.customerData?.firstName}</TableCell>
                <TableCell>{customer.customerData?.lastName}</TableCell>
                <TableCell>{customer.customerData?.email}</TableCell>
                <TableCell>{customer.customerData?.phone}</TableCell>
                <TableCell>{customer.customerData?.jobTitle}</TableCell>
                <TableCell>{customer.customerData?.jobType}</TableCell>
                <TableCell>
                  {customer.customerArchivedAt && 
                    format(new Date(customer.customerArchivedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(customer)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}