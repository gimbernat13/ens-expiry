import { query } from "@/apollo-client";
import { gql } from '@apollo/client';

import { DomainSearch } from "./components/DomainSearch";
import { TopRegistrants } from "./components/TopRegistrants";
import { DomainTabs } from "./components/DomainTabs";

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

const expiredDomainsQuery = gql`
  query GetExpiredDomains($currentTime: BigInt!, $first: Int!, $skip: Int!) {
    registrations(
      first: $first
      skip: $skip
      orderBy: expiryDate
      orderDirection: desc
      where: { 
        expiryDate_lt: $currentTime
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

const INITIAL_ITEMS = 20;
const ITEMS_PER_LOAD = 20;

export default async function Home() {
  const currentTime = Math.floor(Date.now() / 1000);
  const gracePeriod = 90 * 24 * 60 * 60;
  
  const [upcomingDomains, expiredDomains] = await Promise.all([
    query({ 
      query: userQuery,
      variables: {
        currentTime: currentTime - gracePeriod,
        endTime: currentTime - gracePeriod + (30 * 24 * 60 * 60),
        first: 100,
        skip: 0
      },
      context: {
        fetchOptions: {
          next: { revalidate: 30 }
        }
      }
    }),
    query({
      query: expiredDomainsQuery,
      variables: {
        currentTime: currentTime - gracePeriod,
        first: 100,
        skip: 0
      },
      context: {
        fetchOptions: {
          next: { revalidate: 30 }
        }
      }
    })
  ]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">ENS Domain Explorer</h1>
          <p className="text-zinc-400">Search domains or view upcoming expirations</p>
        </div>

        <DomainSearch />
        <DomainTabs 
          upcomingRegistrations={upcomingDomains.data?.registrations || []}
          expiredRegistrations={expiredDomains.data?.registrations || []}
          initialItemsToShow={INITIAL_ITEMS}
          itemsPerLoad={ITEMS_PER_LOAD}
        />

      </div>
    </div>
  );
}