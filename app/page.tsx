import { query } from "@/apollo-client";
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Globe2 } from "lucide-react";
import { DomainExpiryCards } from "./components/DomainExpiryCards";
import { DomainSearch } from "./components/DomainSearch";

const userQuery = gql`
  query GetExpiringDomains($currentTime: BigInt!, $endTime: BigInt!, $first: Int!, $skip: Int!) {
    registrations(
      first: $first
      skip: $skip
      orderBy: expiryDate
      orderDirection: asc
      where: { 
        expiryDate_gt: $currentTime,
        expiryDate_lt: $endTime
      }
    ) {
      id
      domain {
        name
      }
      expiryDate
      registrant {
        id
      }
    }
  }
`;

export default async function Home() {
  const currentTime = Math.floor(Date.now() / 1000);
  const gracePeriod = 90 * 24 * 60 * 60; // 90 days in seconds
  
  const { data } = await query({ 
    query: userQuery,
    variables: {
      currentTime: currentTime - gracePeriod, // Look for domains whose grace period is ending
      endTime: currentTime - gracePeriod + (30 * 24 * 60 * 60), // 30 days window
      first: 500,
      skip: 0
    },
    context: {
      fetchOptions: {
        next: { revalidate: 30 }
      }
    }
  });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">ENS Domain Explorer</h1>
          <p className="text-zinc-400">Search domains or view upcoming expirations</p>
        </div>

        <DomainSearch />
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Upcoming Expirations</h2>
          <p className="text-zinc-400">Domains becoming available in the next 30 days</p>
        </div>

        <DomainExpiryCards registrations={data?.registrations || []} />
      </div>
    </div>
  );
}