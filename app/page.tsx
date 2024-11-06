import { query } from "@/apollo-client";
import { gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Info } from "lucide-react";
import HyperText from "@/components/ui/hyper-text";
import { ArrowUpRight } from "lucide-react";
import { TierDisplay } from "./components/TierDisplay";

const userQuery = gql`
query {
  transfers(limit: 500, orderBy: block_DESC) {
    from
    block
    id
    to
    value
    txHash
  }
}

`;

const { data } = await query({ query: userQuery });

const formatCPOOLValue = (value: string) => {
  // Convert from wei (18 decimals) to regular CPOOL value
  const num = Number(value) / 1e18;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Stats Cards Row */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {/* Total Rewards Card */}
          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Total Rewards Distributed
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800/50 p-1.5 flex items-center justify-center">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png" 
                    alt="CPOOL" 
                    className="w-full h-full"
                  />
                </div>
                <HyperText
                  className="text-2xl font-bold text-white"
                  text={formatCPOOLValue(data?.transfers.reduce((acc: number, transfer: any) => acc + Number(transfer.value), 0).toString())}
                />
                <span className="text-zinc-400 font-medium">CPOOL</span>
              </div>
            </CardHeader>
          </Card>

          {/* Base Rate Card */}
          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Base Reward Rate
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="flex items-center mt-4">
                <HyperText
                  className="text-2xl font-bold text-white"
                  text="5"
                />
                <span className="text-2xl text-white/80 ml-1">%</span>
              </div>
            </CardHeader>
          </Card>


          {/* Reward Token Card */}
          <Card className="bg-zinc-900 border-0 hover:bg-zinc-800/50 transition-colors">
            <CardHeader>
              <CardDescription className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                Reward Token
                <Info className="w-4 h-4" />
              </CardDescription>
              <div className="flex items-center gap-2 mt-4">
                <img
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png"
                  alt="CPOOL"
                  className="w-6 h-6"
                />
                <span className="text-2xl font-bold text-white">OZ Token</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Replace the separate cards with a grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Table Card - spans 9 columns */}
          <Card className="lg:col-span-9 bg-zinc-900/50 border-0 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[32px] font-bold text-white">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border border-zinc-800/50 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="bg-zinc-900 text-zinc-400 text-sm font-semibold h-12 border-b border-zinc-800/50">
                        Sender
                      </TableHead>
                      <TableHead className="bg-zinc-900 text-zinc-400 text-sm font-semibold border-b border-zinc-800/50">
                        Network
                      </TableHead>
                      <TableHead className="bg-zinc-900 text-zinc-400 text-sm font-semibold border-b border-zinc-800/50">
                        Value
                      </TableHead>
                      <TableHead className="bg-zinc-900 text-zinc-400 text-sm font-semibold border-b border-zinc-800/50">
                        Block
                      </TableHead>
                      <TableHead className="bg-zinc-900 text-zinc-400 text-sm font-semibold text-right border-b border-zinc-800/50">
                        Transaction
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.transfers.map((transfer: any) => (
                      <TableRow 
                        key={transfer.id}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                      >
                        <TableCell className="py-4">
                          <Link 
                            href={`/rewards/${transfer.from}`}
                            className="group flex items-center gap-3 -ml-1 px-3 py-1.5 rounded-md transition-colors hover:bg-white/5"
                          >
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                              <img
                                src={`https://effigy.im/a/${transfer.from}.svg`}
                                alt="Avatar"
                                className="w-full h-full"
                              />
                            </div>
                            <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {transfer.from.slice(0, 6)}...{transfer.from.slice(-4)}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-zinc-800/50 p-1.5 flex items-center justify-center">
                              <img
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                                alt="ETH"
                                className="w-full h-full"
                              />
                            </div>
                            <span className="font-semibold text-white">Ethereum</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-zinc-800/50 p-1.5 flex items-center justify-center">
                              <img 
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/12573.png" 
                                alt="CPOOL" 
                                className="w-full h-full"
                              />
                            </div>
                            <span className="font-semibold text-white">
                              {formatCPOOLValue(transfer.value)}
                            </span>
                            <span className="text-zinc-400 font-medium">
                              CPOOL
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-white">
                            {transfer.block}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <a
                            href={`https://etherscan.io/tx/${transfer.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            {transfer.txHash.slice(0, 6)}...{transfer.txHash.slice(-4)}
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Tiers Card - spans 3 columns */}
          <Card className="lg:col-span-3 bg-zinc-900 border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Reward Tiers</CardTitle>
              <CardDescription className="text-zinc-400">
                Earn higher rewards by reaching higher tiers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bronze Tier */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#CD7F32]/10 flex items-center justify-center">
                    <span className="text-[#CD7F32] font-bold">1×</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">Bronze</div>
                    <div className="text-xs text-zinc-400">0-49 tx</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">5% APR</div>
              </div>

              {/* Silver Tier */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#C0C0C0]/10 flex items-center justify-center">
                    <span className="text-[#C0C0C0] font-bold">2×</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">Silver</div>
                    <div className="text-xs text-zinc-400">50-99 tx</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">10% APR</div>
              </div>

              {/* Gold Tier */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                    <span className="text-[#FFD700] font-bold">4×</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">Gold</div>
                    <div className="text-xs text-zinc-400">100-199 tx</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">20% APR</div>
              </div>

              {/* Platinum Tier */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E4E2]/10 flex items-center justify-center">
                    <span className="text-[#E5E4E2] font-bold">8×</span>
                  </div>
                  <div>
                    <div className="font-bold text-white">Platinum</div>
                    <div className="text-xs text-zinc-400">200+ tx</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">40% APR</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


