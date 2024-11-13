"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity } from "@/lib/types";
import { getActivities } from "@/lib/storage";
import { format } from "date-fns";

export default function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const allActivities = getActivities();
    // Sort by timestamp in descending order and take the latest 50
    const sortedActivities = allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
    setActivities(sortedActivities);
  }, []);

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-2 text-sm">
            <div className="text-muted-foreground">
              {format(new Date(activity.timestamp), "MMM d, h:mm a")}
            </div>
            <div>{activity.description}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}