'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DomainSearchFormProps {
  initialQuery?: string;
}

export function DomainSearchForm({ initialQuery = '' }: DomainSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.current?.value.trim();
    if (query) {
      const params = new URLSearchParams(searchParams);
      params.set('q', query.toLowerCase().replace('.eth', ''));
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Input
          ref={searchRef}
          type="text"
          placeholder="Search for a domain (e.g. vitalik)"
          defaultValue={initialQuery}
          className="bg-zinc-800/50 border-zinc-700 text-white pl-10"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
      </div>
    </form>
  );
} 