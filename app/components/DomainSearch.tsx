'use client';

import { useState } from 'react';
import { DomainSearchForm } from "./DomainSearchForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DomainSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    console.log('Handling search for:', query);
    setSearchQuery(query);
    setIsSearching(true);

    try {
      // Simple test data for now
      const testResults = [
        {
          name: query,
          isRegistered: Math.random() > 0.5,
        }
      ];
      
      setSearchResults(testResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-zinc-400 text-sm font-medium">Search ENS Domains</CardTitle>
        <CardDescription>Enter a domain name to check its availability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DomainSearchForm onSearch={handleSearch} />
        
        {isSearching && (
          <div className="text-center p-4">
            <p className="text-zinc-400">Searching...</p>
          </div>
        )}
        
        {searchQuery && !isSearching && (
          <div className="mt-4 space-y-2">
            {searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li 
                    key={index}
                    className="p-3 rounded-lg bg-zinc-800/50 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-white font-mono">{result.name}.eth</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        result.isRegistered 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {result.isRegistered ? 'Registered' : 'Available'}
                      </span>
                    </div>
                    <a
                      href={`https://app.ens.domains/${result.name}.eth`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View →
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
                <p className="text-zinc-400">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 