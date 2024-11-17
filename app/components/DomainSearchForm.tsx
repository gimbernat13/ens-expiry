'use client';

import { useRef } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DomainSearchFormProps {
  onSearch: (query: string) => void;
}

export function DomainSearchForm({ onSearch }: DomainSearchFormProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.current?.value.trim();
    console.log('Form submitted with query:', query);

    if (query) {
      onSearch(query.toLowerCase().replace('.eth', ''));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Input
          ref={searchRef}
          type="text"
          placeholder="Search for a domain (e.g. vitalik)"
          className="bg-zinc-800/50 border-zinc-700 text-white pl-10"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
      </div>
    </form>
  );
} 