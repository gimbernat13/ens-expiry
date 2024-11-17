'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, User, Calendar } from "lucide-react";
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
    
    if (now > gracePeriodEnd) return 'Grace Period Ended';
    if (now > expiryDate) return 'In Grace Period';
    return 'Active';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        bg-zinc-900/50 border-0 backdrop-blur-sm overflow-hidden group 
        transition-all duration-500 ease-out
        ${isAvailable ? 'bg-green-900/20 border-green-500/20 border' : 'hover:bg-zinc-900/70'}
        ${isExpired ? 'border border-red-500/20' : ''}
      `}>
        <a 
          href={`https://app.ens.domains/${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono text-lg text-white group-hover:text-blue-400 transition-colors">
                {domain}
              </CardTitle>
              <AnimatePresence>
                {isAvailable ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Available Now</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full 
                      ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">{getExpiryStatus()}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="w-4 h-4" />
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
              
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Calendar className="w-4 h-4" />
                <div className="space-x-1">
                  <span>Expired:</span>
                  <span className="font-mono">{formatDate(expiryDate)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="w-4 h-4" />
                <div className="space-x-1">
                  <span>Grace Period Ends:</span>
                  <span className="font-mono">{formatDate(expiryDate + gracePeriod)}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {isAvailable ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center p-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium shadow-lg 
                             shadow-green-500/20 hover:bg-green-400 transition-colors"
                  >
                    Register Now
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-4 gap-4 text-center"
                >
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getStatusColor(timeLeft.days, isExpired)}`}>
                      {timeLeft.days.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Days</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Hours</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Minutes</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-white">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Seconds</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </a>
      </Card>
    </motion.div>
  );
} 