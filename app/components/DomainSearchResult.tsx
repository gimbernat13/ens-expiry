'use client';

import { motion } from "framer-motion";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DomainExpiryCard } from "./DomainExpiryCard";

interface DomainSearchResultProps {
  domain: string;
  status: 'registered' | 'available' | 'not-found';
  expiryDate?: number;
  registrant?: string;
}

export function DomainSearchResult({ domain, status, expiryDate, registrant }: DomainSearchResultProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'registered':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          message: 'Registered',
          subtext: `Owned by ${registrant?.slice(0, 6)}...${registrant?.slice(-4)}`
        };
      case 'available':
        return {
          icon: <Check className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          message: 'Available',
          subtext: 'Ready to register'
        };
      case 'not-found':
        return {
          icon: <X className="w-5 h-5" />,
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          message: 'Invalid Domain',
          subtext: 'This domain name is not valid'
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={`${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-mono text-white">{domain}.eth</h3>
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${statusInfo.color} ${statusInfo.bgColor}`}>
                  {statusInfo.icon}
                  {statusInfo.message}
                </span>
              </div>
              <p className="text-sm text-zinc-400">{statusInfo.subtext}</p>
            </div>
            
            <a
              href={`https://app.ens.domains/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                         transition-colors ${status === 'available' 
                         ? 'bg-green-500 hover:bg-green-400 text-white' 
                         : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'}`}
            >
              {status === 'available' ? 'Register' : 'View'}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {status === 'registered' && expiryDate && (
            <div className="mt-4 pt-4 border-t border-zinc-700/50">
              <DomainExpiryCard
                domain={domain}
                expiryDate={expiryDate}
                registrant={registrant || ''}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 