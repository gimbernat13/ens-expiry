'use server'

import { query } from "@/apollo-client";
import { gql } from '@apollo/client';

const SEARCH_DOMAIN_QUERY = gql`
  query SearchDomain($name: String!) {
    domains(where: { name_contains: $name }, first: 1) {
      name
      labelName
      registration {
        expiryDate
        registrant {
          id
        }
      }
    }
  }
`;

export async function searchDomain(domain: string) {
  try {
    console.log('Searching for domain:', domain);
    const { data } = await query({
      query: SEARCH_DOMAIN_QUERY,
      variables: { 
        name: domain.toLowerCase()
      },
      context: {
        fetchOptions: {
          next: { revalidate: 30 }
        }
      }
    });
    
    console.log('Search result:', data);
    return data?.domains?.[0] || null;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
} 