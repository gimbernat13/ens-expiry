import { query } from "@/apollo-client";
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, User } from "lucide-react";

const TOP_REGISTRANTS_QUERY = gql`
  query TopRegistrants($first: Int!) {
    accounts(first: $first) {
      id
      registrations(first: 100) {
        id
        domain {
          name
        }
      }
    }
  }
`;

interface TopRegistrantsProps {
  accounts: {
    id: string;
    registrations: {
      id: string;
      domain: {
        name: string;
      };
    }[];
  }[];
}

export async function TopRegistrants() {
  const { data } = await query({
    query: TOP_REGISTRANTS_QUERY,
    variables: {
      first: 100
    },
    context: {
      fetchOptions: {
        next: { revalidate: 60 }
      }
    }
  });

  const sortedAccounts = [...(data?.accounts || [])]
    .sort((a, b) => b.registrations.length - a.registrations.length)
    .slice(0, 10); 

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Top Registrants</h2>
        <p className="text-zinc-400">Users with the most ENS domain registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAccounts.map((account, index) => (
          <Card 
            key={account.id}
            className="bg-zinc-900/50 border-0 backdrop-blur-sm hover:bg-zinc-800/50 transition-colors"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 p-2 flex items-center justify-center">
                    <Trophy className={`w-5 h-5 ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-zinc-300' : 
                      index === 2 ? 'text-amber-600' : 
                      'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="font-mono text-white">
                      <a 
                        href={`https://etherscan.io/address/${account.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors"
                      >
                        {account.id.slice(0, 6)}...{account.id.slice(-4)}
                      </a>
                    </CardTitle>
                    <CardDescription>
                      {account.registrations.length} registrations
                    </CardDescription>
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-500">#{index + 1}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-zinc-400 font-medium">Recent Domains</div>
                <div className="space-y-1.5">
                  {account.registrations.slice(0, 5).map((registration) => (
                    <div 
                      key={registration.id}
                      className="flex items-center gap-2 text-sm text-zinc-300 font-mono"
                    >
                      <User className="w-3 h-3 text-zinc-500" />
                      {registration.domain.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}