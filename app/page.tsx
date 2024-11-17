import { query } from "@/apollo-client";
import { gql } from '@apollo/client';

const userQuery = gql`
  query GetExpiringDomains($currentTime: BigInt!, $endTime: BigInt!, $first: Int!, $skip: Int!) {
    registrations(
      first: $first
      skip: $skip
      orderBy: expiryDate
      orderDirection: asc
      where: { expiryDate_gt: $currentTime, expiryDate_lt: $endTime }
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

const { data } = await query({ 
  query: userQuery,
  variables: {
    currentTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    first: 500,
    skip: 0
  },
  context: {
    fetchOptions: {
      next: { revalidate: 30 }
    }
  }
});

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1200px] mx-auto">
        <pre className="text-white">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}


