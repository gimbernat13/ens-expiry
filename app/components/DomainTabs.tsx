'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DomainExpiryCards } from "./DomainExpiryCards";
import { Clock, History } from "lucide-react";
import { ViewSwitcher } from "./ViewSwitcher";
import { Button } from "@/components/ui/button";

interface DomainTabsProps {
  upcomingRegistrations: any[];
  expiredRegistrations: any[];
  initialItemsToShow: number;
  itemsPerLoad: number;
}

export function DomainTabs({ 
  upcomingRegistrations, 
  expiredRegistrations,
  initialItemsToShow,
  itemsPerLoad
}: DomainTabsProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [visibleUpcoming, setVisibleUpcoming] = useState(initialItemsToShow);
  const [visibleExpired, setVisibleExpired] = useState(initialItemsToShow);
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleLoadMore = () => {
    if (activeTab === 'upcoming') {
      setVisibleUpcoming(prev => prev + itemsPerLoad);
    } else {
      setVisibleExpired(prev => prev + itemsPerLoad);
    }
  };

  const visibleUpcomingDomains = upcomingRegistrations.slice(0, visibleUpcoming);
  const visibleExpiredDomains = expiredRegistrations.slice(0, visibleExpired);
  
  const hasMore = activeTab === 'upcoming' 
    ? visibleUpcoming < upcomingRegistrations.length
    : visibleExpired < expiredRegistrations.length;

  return (
    <>
      <Tabs defaultValue="upcoming" className="space-y-4" onValueChange={setActiveTab}>
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
            <DomainExpiryCards registrations={visibleUpcomingDomains} />
          ) : (
            <DomainExpiryCards registrations={visibleUpcomingDomains} />
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Recently Expired</h2>
            <p className="text-zinc-400">Domains that have expired in the last 30 days</p>
          </div>
          {view === 'grid' ? (
            <DomainExpiryCards registrations={visibleExpiredDomains} isExpired />
          ) : (
            <DomainExpiryCards registrations={visibleExpiredDomains} isExpired />
          )}
        </TabsContent>

        {hasMore && (
          <Button 
            onClick={handleLoadMore}
            className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700"
          >
            Load More
          </Button>
        )}
      </Tabs>
    </>
  );
}