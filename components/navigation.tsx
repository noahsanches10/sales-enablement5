"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { KanbanSquare, MessageSquare } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Pipeline",
      icon: KanbanSquare,
      active: pathname === "/",
    },
    {
      href: "/campaigns",
      label: "Campaigns",
      icon: MessageSquare,
      active: pathname === "/campaigns",
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant="ghost"
          asChild
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          <Link href={route.href} className="flex items-center gap-2">
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        </Button>
      ))}
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </nav>
  );
}