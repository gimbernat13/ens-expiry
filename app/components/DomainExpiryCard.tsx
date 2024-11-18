'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, User, Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';

interface DomainExpiryCardProps {
  domain: string;
  expiryDate: number;
  registrant: string;
  isExpired?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function DomainExpiryCard({ domain, expiryDate, registrant, isExpired }: DomainExpiryCardProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAvailable, setIsAvailable] = useState(false);
  const gracePeriod = 90 * 24 * 60 * 60;
  const availableDate = expiryDate + gracePeriod;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = availableDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsAvailable(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [availableDate]);

  const getStatusColor = (days: number, isExpired?: boolean) => {
    if (isExpired) return "text-red-500"
    if (days <= 7) return "text-destructive"
    if (days <= 14) return "text-yellow-500"
    return "text-green-500"
  }

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'MMM d, yyyy');
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExpiryStatus = () => {
    const now = Math.floor(Date.now() / 1000);
    const gracePeriodEnd = expiryDate + gracePeriod;
    
    if (now > gracePeriodEnd) return 'Available';
    if (now > expiryDate) return 'In Grace Period';
    return 'Active';
  };

  const getTimeLeftString = () => {
    if (timeLeft.days > 0) return `${timeLeft.days}d`;
    if (timeLeft.hours > 0) return `${timeLeft.hours}h`;
    if (timeLeft.minutes > 0) return `${timeLeft.minutes}m`;
    return `${timeLeft.seconds}s`;
  };

  const getBadgeContent = () => {
    if (isAvailable) return {
      text: 'Available',
      className: 'bg-green-500/20 text-green-400'
    };
    
    const timeLeft = getTimeLeftString();
    if (getExpiryStatus() === 'In Grace Period') return {
      text: `Grace Period · ${timeLeft}`,
      className: 'bg-yellow-500/20 text-yellow-400'
    };
    
    return {
      text: `Active · ${timeLeft}`,
      className: 'bg-blue-500/20 text-blue-400'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-900/50 border-0 backdrop-blur-sm overflow-hidden group 
                     transition-all duration-500 ease-out hover:bg-zinc-900/70">
        <a href={`https://app.ens.domains/${domain}`} target="_blank" rel="noopener noreferrer" 
           className="block relative p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="font-mono text-lg text-white group-hover:text-blue-400 transition-colors">
                {domain}
              </CardTitle>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full 
                ${getBadgeContent().className} transition-colors duration-300`}
            >
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium whitespace-nowrap">
                {getBadgeContent().text}
              </span>
            </motion.div>
          </div>
          
          <div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              <span className="font-mono">
                <a 
                  href={`https://etherscan.io/address/${registrant}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {truncateAddress(registrant)}
                </a>
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span className="font-mono">{formatDate(expiryDate + gracePeriod)}</span>
            </div>
          </div>
        </a>
      </Card>
    </motion.div>
  );
} 