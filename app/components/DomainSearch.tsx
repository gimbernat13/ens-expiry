// components/DomainSearch.tsx
'use client';

import { useState } from 'react';
import { DomainSearchForm } from './DomainSearchForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { searchDomain } from '../actions/searchDomain';
import { generateGoogleCalendarUrl } from '../lib/calendar';

export function DomainSearch() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    setIsSearching(true);

    try {
      const result = await searchDomain(query);
      setSearchResult(result);
      setSearchQuery(result?.name || query);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult(null);
      setSearchQuery(query);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            {searchResult ? (
              <div className="p-4 rounded-lg bg-zinc-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-mono">{searchResult.name}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        searchResult.registration
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {searchResult.registration ? 'Registered' : 'Available'}
                    </span>
                  </div>
                  <a
                    href={`https://app.ens.domains/name/${searchResult.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View →
                  </a>
                </div>

                {searchResult.registration && (
                  <div className="space-y-2 border-t border-zinc-700/50 pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          Expires: {formatDate(Number(searchResult.registration.expiryDate))}
                        </span>
                      </div>
                      <a
                        href={generateGoogleCalendarUrl(
                          searchResult.name,
                          Number(searchResult.registration.expiryDate)
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-2 transition-colors"
                      >
                        <Calendar className="w-3 h-3" />
                        Add to Calendar
                      </a>
                    </div>
                  </div>
                )}
              </div>
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