 'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainExpiryCards } from "./DomainExpiryCards";
import { Clock, History } from "lucide-react";
import { ViewSwitcher } from "./ViewSwitcher";
interface DomainTabsProps {
  upcomingRegistrations: any[];
  expiredRegistrations: any[];
}

export function DomainTabs({ upcomingRegistrations, expiredRegistrations }: DomainTabsProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList className="grid grid-cols-2 w-[400px] bg-zinc-800/50">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-zinc-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Upcoming</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="expired" className="data-[state=active]:bg-zinc-700">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>Recently Expired</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <ViewSwitcher view={view} onChange={setView} />
      </div>
      
      <TabsContent value="upcoming" className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Upcoming Expirations</h2>
          <p className="text-zinc-400">Domains becoming available in the next 30 days</p>
        </div>
        {view === 'grid' ? (
          <DomainExpiryCards registrations={upcomingRegistrations} />
        ) : (
            <DomainExpiryCards registrations={upcomingRegistrations} />
        )}
      </TabsContent>
      
      <TabsContent value="expired" className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Recently Expired</h2>
          <p className="text-zinc-400">Domains that have expired in the last 30 days</p>
        </div>
        {view === 'grid' ? (
          <DomainExpiryCards registrations={expiredRegistrations} isExpired />
        ) : (
            <DomainExpiryCards registrations={expiredRegistrations} isExpired />
        )}
      </TabsContent>
    </Tabs>
  );
}