import { DomainSearchForm } from "./DomainSearchForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gql } from '@apollo/client';
import { query } from "@/apollo-client";
import { DomainExpiryCard } from "./DomainExpiryCard";

const searchDomainQuery = gql`
  query SearchDomain($name: String!) {
    domains(where: { name: $name }) {
      id
      name
      registration {
        id
        expiryDate
        registrant {
          id
        }
      }
    }
  }
`;

interface SearchProps {
  searchParams?: {
    q?: string;
  };
}

export async function DomainSearch({ searchParams = {} }: SearchProps) {
  let searchResult = null;
  let notFound = false;
  
  const searchQuery = searchParams?.q?.toLowerCase();
  
  if (searchQuery && typeof searchQuery === 'string') {
    const { data } = await query({
      query: searchDomainQuery,
      variables: {
        name: searchQuery,
      },
      context: {
        fetchOptions: {
          next: { revalidate: 30 }
        }
      }
    });
    
    if (data?.domains?.[0]) {
      searchResult = {
        id: data.domains[0].registration?.id || 'not-registered',
        domain: {
          name: data.domains[0].name
        },
        expiryDate: data.domains[0].registration?.expiryDate || '0',
        registrant: {
          id: data.domains[0].registration?.registrant?.id || 'none'
        }
      };
    } else {
      notFound = true;
    }
  }

  return (
    <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-zinc-400 text-sm font-medium">Search ENS Domains</CardTitle>
        <CardDescription>Enter a domain name to check its availability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DomainSearchForm initialQuery={searchParams?.q} />
        
        {searchResult && (
          <DomainExpiryCard
            domain={searchResult.domain.name}
            expiryDate={Number(searchResult.expiryDate)}
            registrant={searchResult.registrant.id}
          />
        )}

        {notFound && searchQuery && (
          <Card className="bg-blue-900/20 border-blue-500/20 border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-mono">{searchQuery}.eth</h3>
                  <p className="text-sm text-blue-400">Available for registration!</p>
                </div>
                <a
                  href={`https://app.ens.domains/${searchQuery}.eth`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium 
                           hover:bg-blue-400 transition-colors"
                >
                  Register →
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
} 