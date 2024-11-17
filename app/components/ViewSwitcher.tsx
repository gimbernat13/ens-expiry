'use client';

import { LayoutGrid, List } from "lucide-react";

interface ViewSwitcherProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg p-1">
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md transition-colors ${
          view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
} 