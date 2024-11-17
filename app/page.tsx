import { query } from "@/apollo-client";
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Globe2 } from "lucide-react";
import { DomainExpiryCards } from "./components/DomainExpiryCards";

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

export default async function Home() {
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

  const totalDomains = data?.registrations?.length || 0;
  const uniqueRegistrants = new Set(data?.registrations?.map((reg: any) => reg.registrant.id)).size;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Header  */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Expiring Domains</h1>
          <p className="text-zinc-400">Domains expiring in the next 30 days</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 p-2 flex items-center justify-center mr-4">
                <Globe2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-400 text-sm font-medium">Total Domains</CardTitle>
                <CardDescription className="text-2xl font-bold text-white">
                  {totalDomains}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 p-2 flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-zinc-400 text-sm font-medium">Unique Registrants</CardTitle>
                <CardDescription className="text-2xl font-bold text-white">
                  {uniqueRegistrants}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <DomainExpiryCards registrations={data?.registrations || []} />
      </div>
    </div>
  );
}